---
layout: post
title: "DeepSeekMath V2: Iterative improvement through self-verification"
date: 2025-12-05
comments: false
tags:
- LLM
- SFT
- RLVR
- RL
- DeepSeek
---

[DeepSeekMath-v2](https://github.com/deepseek-ai/DeepSeek-Math-V2/blob/main/DeepSeekMath_V2.pdf) came out on Thanksgiving without much fanfare but has now become the only open weight model to achieve IMO-gold performance with natural language informal proofs, after Gemini and GPT5. The technical reported is a packed with technical details, much of which isn't entirely surprising as the entire LLM field has converged toward a similar direction in terms of how to achieve iterative improvements in a domain like informal math proofs.

# Key ideas

## How to verify?

In the past year, RL with verifiable reward (RLVR) has made a lot of stride, especially in math and coding domains. After GPT-4o, Deepseek-R1 paper really popularized this approach (history repeating itself with DeepseekMath-v2 now). However, for something not easily verifiable like math proofs, how to craft a reward function that provides a training signal?

In other words, how to verify math proofs better to provide a training signal to improve proof generation?

Taking inspiration from human proof verification, we notice that:
- Issues can be identified in a proof even without reference solution. Whether this is by pattern matching a familiar subproblem and noticing a wrong solution, or by noticing inconsistent logical statement even if one cannot verify how the predicates and conclusion of a logical statement were derived.
- A proof is more likely to be valid when no issues can be identified after "thinking for a long time by a lot of different people". This is similar to the scientific peer review process. In LLM speak, this means that a proof is more valid if "after scaled verification efforts no issues can be identified".

So the answer to "how to verify better" is then "scaling verification compute".

## What's "scaling verification compute"?

This is in line with [scaling test time compute](https://arxiv.org/abs/2408.03314). In the case of DeepseekMath-V2, this is parallel inference with majority-voting, which does the following:

Given a proof, how do we verify its correctness better?
- Give the proof to the verifier model, ask it to evaluate the proof according to some rules.
- Do this in parallel for $N$ times.
- If most of the generated verifications think there's no problem, then proof is probably good.
- If at least $k$ of the generated verifications think that there's some kind of problem, then proof probably has a problem.
- If no group of $k$ verifications agree on a correctness score, then the verifier is too unsure of the proof quality -- this means the verifier is not smart enough to check the work of that proof. We can discard this specific proof rollout.

## How to improve proof-generation ability?

The verifier with scaled compute can now provide a reward signal to improve proof generation in an RL setting. This reduces to the classic RLVR-by-GRPO: 

1. For each problem $x$, generate $P$ proofs from the model.
2. For each proof $y_i$, do scaled verification (so $N$ times per proof), and get the resulting proof's score $s_i$ from majority voting -- this results in a set of {$y_i$, $s_i$} for each problem.
3. Combine each $s_i$ with other rubrics to get a final reward score $r_i$ for $y_i$.
4. Do backprop with the reward score.

The reward score for proof-generation is set to be $R_Y = s$.

At the end of a round of RL, we can additionally do SFT for each problem $x$ with proofs verified to be correct. This will distill and improve the model's proof generation capability further.

## Maintaining generation-verification gap

An assumption that is implied in the above approach is that verification is easier than generation, this is known as the "generation-verification gap". This has the same intuition as [`P != NP`](https://en.wikipedia.org/wiki/P_versus_NP_problem) -- the widely believed but unproven statement that problems whose solutions are easy to verify (NP) are not necessarily easy to solve (P).

Scaling verification compute to verify generated proofs by the LLM can work IF there exists a gap between the proof generator and the proof verifier. But as RL improves the generator, this gap shrinks and performance eventually saturates, and the rate of this saturation has been shown to correlate to the models' [pretraining flops](https://arxiv.org/pdf/2412.02674).

Therefore to continuously improve generator abilities, the verifier capability needs to improve as well -- in other words, the generation-verification gap needs to be maintained.

This means the verifier needs to be continously trained somehow, with dataset of {proof, proof score}. This was provided exactly during the proof-generation rollout process!

With this data, RLVR-by-GRPO for verification generation can proceed similarly. The obvious reward term is:

$$R_{score}(s_i', s_i) = 1 - |s_i' - s_i|$$

where $s_i'$ is the score given to the proof by the i-th verification rollout, and $s_i$ is the "ground-truth" proof score from the proof generation step. We want each verification rollout to match the consensus score for a proof.

Additionally, there's format reward $R_{format}$ to reward certain verification format.

### Prevent verifier hallucination with meta-verification

With only $R_{score}$ and $R_{format}$, the verifier can assign a correct score to the proof while still hallucinating non-existent issues. To prevent this, verification of proof verification reasoning can be introduced -- *metaverification*.

The underlying idea here is again the generation-verification gap -- it's easier to verify the verifications than generating the verifications. Here, for each *verification*, a *metaverification* is generated to find issues in the verification analysis with an accompanying verification quality score $ms$. This score $R_{meta}$ is then added to the verifier training reward term:

$$R_V = R_{format}\cdot R_{score}\cdot R_{meta}$$

In the end, the verifier can both verify proofs, and verify those verifications.

## Forcing self-verification during proof generation

The authors points out that

> when a proof generator fails to produce a completely correct proof in one shot [...] iterative verification and refinement can improve results. This involves analyzing the proof with an external verifier and prompting the generator to address identified issues.

But in practice:

> while the generator can refine proofs based on external feedback, it fails to evaluate its own work with the same rigor as the dedicated verifier

What this means:
- Scenario: The model generates a flawed proof.
- Standard Behavior: The model concludes "Therefore, the answer is X" and internally assigns it a high confidence.
- The Consequence: Because the model thinks it is right, it stops. It never triggers a refinement loop because it doesn't believe there is anything to fix.

While the model could fix the error if an external teacher pointed it out, it fails to find the error itself.

The authors then refined the proof-generation prompt and updated the reward function to force the model to rigorously "identify and resolve as many issues as possible before finalizing the response" (i.e. a type of test-time compute scaling by increasing reasoning chain length).

This is done by:
- In addition to the proof $Y$ generated, the prompt also asks the model to generate a self-analysis $Z$ of the proof $Y$ according to the same rubric given to the verifier.
- The proof $Y$ receives score $R_Y=s'$, and the self-analysis $Z$ receives metaverification score $R_{meta}(Z)=ms$.

The reward function then becomes:

$$
\begin{align*}
R &= R_{format}(Y, Z)\cdot (\alpha\cdot R_Y + \beta\cdot R_Z) \\
R_Z &= R_{score}(s', s)\cdot R_{meta}(Z)
\end{align*}
$$

So the verifier will check the proof generated, and the associated self-analysis. This then incentives the model to think harder and not be lazy.

# Iterative improvement

Now all pieces are in place to do continuous iterative improvement. Note that even though we talk about "verifier" and "generator", they are in fact the checkpoints of the same model. Let $M_0$ be the model at the start of the process.

In iteration 0, we have the following steps:

1. Initalize proof verifier $M_{v0}$ from $M_0$ and freeze it.
2. Initialize proof generator $M_{g0}$ from $M_0$. Use it for proof-generation RLVR with $M$ rollouts:
    - for each *problem* $x$, generate $P$ proofs.
        - for each proof $y_i$ and associated self-analysis $z_i$, generate $N$ verifications
            - Conduct consensus voting among the $N$ verifications to either assign a score $s_i$ to each proof for reward calculation (and associated metaverification score $ms_i$ for $z_i$), or discard that proof if no consensus.
    - backpropagate all the reward signals on the generated proofs and self-analyses.
    - At end of each iteration, we also save $D_V = {(X, Y, s)}$ -- triplets of problem, proof, and proof score for verifier training.
    - After this process, $M_{g0}$ updated to $M_{g0}^{rl}$.
3. Do distillation via SFT on $M_{g0}^{rl}$ with correct proof rollouts, i.e. subset of $D$ where $s=1$, this gives us $M_1$.

In iteration 1 and on, we have:

1. Do verification-generation rollout with $M$ rollouts on $M_{i}$.
    - for each *proof* $y$, generate $N$ verifications and metaverifications
        - for each verification $v_i$, metaverification $mv_i$, and associated proof score $s_i^\prime$, calculate reward score $R_V$.
    - At end of this process, $M_i$ is updated to $M_{vi}$.
2. [Not explicitly stated in the paper]: The metaverification ability can also be improved via RL here. For each $(y_i, s_i)$ from the previous round, generate metaverifications ${z_i, ms_i}$ and perform consensus voting to obtain "ground-truth" metascore $z_i$. The RL process reward metaverification rollout metascore $z_i^\prime$ to match $z_i$.
3. Freeze $M_{vi}$.
4. Initialize proof generator $M_{gi}$ from $M_{vi}$. Do proof-generation RLVR with $M$ rollouts. After this step, $M_{gi}$ becomes $M_{gi}^{rl}$.
5. Do SFT on $M_{gi}^{rl}$ with correct proof rollouts, resulting in $M_{i+1}$.

![flow_chart]({{ site.baseurl }}/assets/DeepseekMathv2_flowchart.png){: .center-image }

# Important details

## Model initialization and cold-start

Before the iterative improvement can begin, SFT is needd to improve the baseline generation and verification performance -- otherwise a lot of inference compute would be wasted to derive easy facts. Fortunately the base model DeepSeek-V3.2-Exp-Base already has reasonable math capabilities.

### Cold-start verifier RL dataset

To start verifier RL training, a set of hard problems, proofs and estimates of proof quality is needed.

1. Curate $D_p$ by crawling hard math problems (e.g. IMO, USAMO, CMO, etc) that require proofs.
2. Generate candidate proofs using Deepseek-V3.2-Exp-Thinking -- a capable thinking model. The prompt used iterative-refinement to ask the model to improve its proofs to improve the proof quality.
3. Sample from this pool of generated proofs and have humans annotate the proof quality.

This process yields the initial RL-dataset $D_v = {(X_i, Y_i, s_i)}$ -- triplets of problem, proof, and annotated proof score.

### Cold-start metaverifier RL dataset

Similarly, annotations are needed to initiate RL training for the metaverifier.

1. The verifier generates proof verification $V_i$ ($s_i$ is part of this) for proof $Y_i$.
2. Human experts annotate $V_i$ according to some rubric to arrive at a verification score, $ms_i$.
3. The resulting dataset $D_{mv} = {(X_i, Y_i, V_i, ms_i)}$ is used to train the metaverifier (same as the verifier) to produce a summary of issues found in each verification $V_i$ and produce a verification score $ms_i^\prime$ to match $ms_i$.

## Inference: Sequential refinement with verification

Iterative self-refinement is a test-time inference scaling idea introduced around 2023 ([self-refine](https://arxiv.org/abs/2303.17651), [ReAct](https://arxiv.org/pdf/2210.03629)). This technique is similar to how humans try to iteratively refine a solution:

1. Model generates an answer
2. Prompts the model verifies and spots mistakes in the answer and proposes solution
3. Prompt the model to generate an answer again, taking into account of its own analysis in (2).
4. Iterate 2-3 multiple times

Notice with this method, while the quality of the proof improves with additional iterations, its ultimately limited by the verifier's ability!

The process of iterative self-refinement can additionally be parallelized (i.e. having multiple people thinking about the same problem repeatedly). The final answer can then be determined by committee among the different threads' answers (i.e. via majority voting, another synthesizer model decided based on their results, etc)

![sequential refinement]({{ site.baseurl }}/assets/deepseekMath_sequential_refinement.png){: .center-image }

## High-Compute Search (Population-Based Refinement)

For the most challenging problems where standard sequential refinement fails, the paper proposes a "High-Compute Search" that scales both generation (breadth) and verification (depth). Instead of refining a single thread, this method evolves a population of proofs.

1. **Initialization**: A pool of candidate proofs is initialized (e.g., 64 samples).
2. **Mass Verification**: For *each* proof in the pool, the model generates 64 independent verification analyses. This statistical volume helps identify subtle issues that a single verification pass might miss.
3. **Selection & Pairing**: The system selects the 64 highest-scoring proofs based on their average verification scores. Each selected proof is paired with 8 verification analyses, specifically prioritizing those that identified issues (scores of 0 or 0.5).
4. **Evolution**: Each `<proof, analysis>` pair is used to generate a new, refined proof, which updates the candidate pool.
5. **Termination**: The process repeats for up to 16 iterations or until a proof passes all 64 verification attempts (unanimous consensus), indicating extremely high confidence in correctness.

This method is used to eventually take IMO 2025 and Putnam 2024 achieving incredible scores.

![contest scores]({{ site.baseurl }}/assets/deepseekMath_contest_scores.png){: .center-image }

Step 3 seems rather strange -- pairing high-scoring proofs with randomly sampled verification you are bound to end up with `<proof, analysis>` pairs where the analysis is simply irrelevant to the proof. I wonder how often this actually generates a better proof than the existing pool, in other words, how compute efficient this is.

# Why this works and what next?

The success of AlphaGo and AlphaZero were major inspirations for a lot of the iterative improvement approaches. But the approaches there are hard to translate into iterative improvement in LLMs, as previously explained in DeepSeek-R1:

> we explored using Monte Carlo Tree Search (MCTS) to enhance test-time compute scalability. This approach involves breaking answers into smaller parts to allow the model to explore the solution space systematically. To facilitate this, we prompt the model to generate multiple tags that correspond to specific reasoning steps necessary for the search. For training, we first use collected prompts to find answers via MCTS guided by a pre-trained value model. Subsequently, we use the resulting question-answer pairs to train both the actor model and the value model, iteratively refining the process.

> However, this approach encounters several challenges when scaling up the training. First,unlike chess, where the search space is relatively well-defined, token generation presents an exponentially larger search space [...] Second, the value model directly influences the quality of generation since it guides each step of the search process. Training a fine-grained value model is inherently difficult, which makes it challenging for the model to iteratively improve. 

> In conclusion, while MCTS can improve performance during inference when paired with a pre-trained value model, iteratively boosting model performance through self-search remains a significant challenge.

The MCTS in AlphaGo/Zero was hard to replicate because:
1. The LLM token space is hard to define as a search problem useful for MCTS.
2. The value function used to guide the search is hard to define.

GRPO-style RL solves (1) by replacing tree search with parallel sampling (exploration), and applying the same to verification solves (2) by using verifiers as the reward model. Now, iterative improvement is possible.

The core mechanism in both systems is using compute-heavy search to generate high-quality data, then distilling that data back into the model to improve its "instinctive" capabilities.

| Component | AlphaGo / AlphaZero | DeepSeekMath-V2 |
| :--- | :--- | :--- |
| **1. Search Guide**<br>(The "Intuition") | **Policy & Value Networks**<br>Neural networks that predict the best next move ($p$) and the winning probability ($v$) to prune the search. | **Verifier Model**<br>A model trained to estimate the correctness of a proof ($R_Y$) and the validity of reasoning steps. |
| **2. Search Mechanism**<br>(The "Thinking") | **Monte Carlo Tree Search (MCTS)**<br>Simulates thousands of future game trajectories to refine the probability of which move is truly best. | **Parallel Sampling & Refinement**<br>Generates multiple candidate proofs (Best-of-N) and performs iterative self-correction to find a valid solution. |
| **3. Policy Improvement**<br>(Improving Generation) | **Distillation of Search Probabilities**<br>The Policy Network is trained to match the move counts from MCTS (learning to instantly predict moves that took MCTS a long time to find). | **Rejection Fine-Tuning (RFT)**<br>The Generator is trained (SFT) on the successful proof rollouts found via high-compute search/refinement (learning to instantly generate proofs that required iterative fixing). |
| **4. Value Improvement**<br>(Improving Evaluation) | **Training on Game Outcomes**<br>The Value Network is retrained to predict the actual winner ($z$) of self-play games, grounding its estimates in reality. | **Training on Consensus Verification**<br>The Verifier is retrained to predict the consensus score derived from majority voting (grounding its estimates in statistical consistency). |

It's obvious that iterative improvement for a verifiable domain like Go should work. The intuition behind why it should work for a hard-to-verify domain like math proofs is less so, and I understand it as the following:

1. **Consensus Voting as Noise Reduction** Individual model outputs are noisy samples from a probability distribution. By sampling $N$ verifications and taking a majority vote (especially when cross-checked by a Meta-Verifier), we effectively reduce the variance.
        - The "Consensus Label" is a far higher-fidelity approximation of the "Ground Truth" than any single model inference.
        - Training on this consensus effectively "denoises" the model's understanding of what constitutes a valid proof.
        - Known in the field as ["self-consistency"](https://arxiv.org/abs/2311.17311)
2. **Manifold Expansion via Search and Distillation** We can view the "space of correct mathematical proofs" as a low-dimensional manifold within the high-dimensional space of all possible text.
    - **RL/Search (The Reach)**: Standard generation samples near the center of the model's current manifold. **Iterative Refinement** (Test-Time compute scaling or multiple rounds of RL) allows the model to traverse off its comfortable manifold, stepping through error-correction to find a distant solution point (a hard proof) that it could not generate zero-shot.
    - **Distillation (The Pull)**: By performing SFT/RFT on these distant solution points, we pull the model's base distribution (manifold) towards these new regions
    - **The Result**: The "center" of the manifold shifts. Problems that previously required expensive search (edges of the manifold) are now near the center (zero-shot solvable).
3. **The Difficulty Ceiling** As the model improves, the manifold covers the entire training distribution. The limiting factor becomes the difficulty of the problems. If the model can solve everything in the dataset zero-shot, the gradient for improvement vanishes. To exceed the best human capability, the system eventually needs a mechanism to generate novel, harder problems (synthetic data generation) or prove open conjectures where the ground truth is unknown, relying entirely on its self-verification rigor to guide the search into uncharted mathematical territory -- this is likely needed for "*superintelligence*".

This intuition is well-observed in human learning: we improve the fastest when we are attempting tasks that are SLIGHTLY out-of-reach. In fact, the "search" and "verifier" in LLM iterative improvement are analogous to "information" in the [Challenge Point Framework]({{ site.baseurl }}/_posts/2022-01-28-ChallengePoint/) for optimal learning difficulty.