---
layout: post
title: "Shenoy, Kaufman, Sahani, Churchland 2011: A dynamical systems view of motor preparation: Implications for neural prosthetic system design"
date: 2015-07-28
comments: false
tags:
- BMI
- Shenoy
- Churchland
- motor_system
- neural_decoding
- premotor_cortex
- optimal_subspace_hypothesis
---

[A dynamical systems view of motor preparation: Implications for neural prosthetic system design](https://web.stanford.edu/~shenoy/GroupPublications/ShenoyEtAlProgBrainRes2011.pdf)

This book chapter/review paper seeks to tie up a bunch of Shenoy lab work (mostly Churchland) on premotor cortex together with a dynamical system hypothesis - the *optimal subspace hypothesis*. Central question is **what are the neural processes that precede movement and lead to the initiation of movement**? And what links **movement preparation** and **movement generation**.

The experiment used to derive all the results here is a instructed-delay task, where a monkey first holds its hand in the center, a target then appears, then a go-cue appears, at which the monkey moves to the target.

They first noticed that delay time (between target appearnce and go-cue) is inversely proportional to the reaciton time (time between go-cue and movement-onset). This is hypothesized as a result of more time for *movement preparation*. So they recorded from the premotor cortex (PMd) and M1, and found activity changes there during the delay period, and seek to find how activties there (indvidual neuron changes vary) contribute to the reduction in movement delay.

(Seems like they are begging the question in terms of which cortical areas to focus on. They mentioned a number of areas show changes in activity during the delay period, yet focus only on PMd and M1. Probably because they only have implants there. Contributions of specific cortical areas to movement preparation is then unclear)

**Optimal Suspace Hypothesis**

If approaching this question from a dynamical systems perspective, then they will have to answer:

* How the activity of a neural population evolves and achieves the needed preparatory state?
* How this preparatory state impacts the subsequent arm movement?
* What are the underlying dynamics of the neural circuit?

Their solution to the delay period-RT observation is to hypothesis that time is needed for the neural population to achieve some kind of preparatory state which is neccessary for the subsequent movement. Seems like a reasonable hypothesis to me. Specifically, the motor preparation may be the act of optimizing preparatory activity so that the generated movement has the desired properties (what these properties are, they have yet to answer at all).

In a dynamical systems framework, they considered, for a given reach, there is presumably some small sub-region of space containing those values of P that are adequate to produce a successful reach. A smooth relationship exist between firing rate and movement (reasonable), therefore, the small subregion of space is conceived of as being contiguous.

This framework would then predict several things that one can test in the lab (although the order of experiments and hypothesis formulation is probably the opposite in practice here...).

A direct corollary of this framework would be that:
    
    If prep activity is equivalent to initializing a traverse to some optimal subspace for the subsequent movement, these activities for different movements must be different. Movements are defined by their kinematic parameters, thus prep activity should be characterized, or tuned, to these different movement parameters as well.

This is presumable true, have yet to read the *Messier and Kalasak, 2000* paper.

Other predictions:

- **Prediction 1: Reach-speed modulation**: Preparatory activity should covary with other meanginful aspects of movement, including peak reach speed. Experiment conducted where monkeys were instructed to reach targets with either faster or lower speed, and the neural data during the preparatory period analyzed.
- **Prediction 2: Reach-speed (trial-by-trial) correlation**: Preparatory activity should correlate, on a trial-by-trial basis, with the peak reach speed. This is mainly to demonstrate the smooth mapping between the neural space and movement parameters, such a trial on the slower side within the instructed-fast condition, should be closer to the those found in the instructed-slow condition than the others. Closeness is measured via distance on the (speed, mean-firing-rate) axis.
- **Prediction 3: Across-trial firing-rate variance (Fano factor) reduces through time**: Preparatory activityshould become, through time, quite accurate and therefore quite similar across trials. In other words, at the end of the preparatory period, the neural activity should become constrained inside the optimal subspace for the subsequent movement, this should manifest in the reduction in variance of the neural activity. The metric they used is the Fano factor (seems rather convoluted), need to read the actual method.
- **Prediction 4-I and 4-II: Lower Fano factor correlation with lower RTs**.
- **Prediction 5: Perturbing neural activity increases RT**: Delivering subthreshold electrical microstimulation (how do they define subthreshold here?) at different times prior to the go-cue in PMd, resulted in longer RT if the stimulation was closer to the go-cue. Stimulating M1 impacted RT less. Effect of stimulation was specific to arm movements and produced little increase in saccadic eye movement RT. The results aligns with theory pretty well, but are the shifts in RT significant? Need to reference the actual paper.
- **Prediction 6: It should be possible to construct single-trial state-space enural trajectories and use them to directly confirm that across-trial firing-rate variability decrease through time**. They recorded a bunch of neurons simultaneously and plotted the neural activity trajectories using Gaussian Process Factor Analysis (GPFA) with dimensionality reduction to visualize. The plots look fine, as in the trajectories run around and converge into different subspaces at different stages of the task. But this can also be due to dimension selection. Need to check the GPFA technique.
- **Prediction 7: Farther and faster along loop reduces RT**. This prediction tries to answer how preparatory state at the time of go cue influence subsequent movement. They hypotehsize that this prep state serves as the initial state of a subsequent dynamical system - thus some region of the brain appear to moniotr and wait for this to be true before "pulling the trigger" to initiate movement. When th trigger is pulled, the further along the loop, the lower the RT. They tested this with offline analysis on a trial-by-trial basis, how far along the loop the prep state was, in relation with that trial's RT. Of course, this would neccessitate the use of the GPFA plotting of the neural trajectories in finding the actual loop.

To really test these predictions however, we really need to monitor the PMd during brain-control tasks - does the Fano factor analysis still hold? Does the RT still vary with the delay period in brain-control? What else do these prep activities tune for? Does the location of the optimal subspace change following learning (Byron Yu's null hypothesis papers)?

Implications to BMI if this hypothesis turns out to be a good framework: How long does it take for the neural trajectory to change from baseline to the optimal subspace? Can we make decoders detect/classify these spaces? Shenoy suggests 200ms as measured with single-trial neural trajectories as the transition period needed for transition between baseline to the optimal subspace, thus decoding during this period should be avoided (will have to read the paper to evaluate this).

**References to Read**

* Churchland, M. M., Afshar, A., & Shenoy, K. V. (2006a). A central source of movement variability. Neuron, 52, 1085–1096
* Churchland, M. M., Cunningham, J. P., Kaufman, M. T.,Ryu, S. I., & Shenoy, K. V. (2010a). Cortical preparatory activity: Representation of movement or first cog in a dynamical machine? Neuron, 68, 387–400
* Churchland, M. M., Kaufman, M. T., Cunningham, J. P., Ryu, S. I., & Shenoy, K. V. (2010b). Some basic features of the neural response in motor and premotor cortex. In Program No. 382.2. Neuroscience meeting planner. San Diego, CA: Society for Neuroscience Online
* Churchland, M. M., Santhanam, G., & Shenoy, K. V. (2006b). Preparatory activity in premotor and motor cortex reflects the speed of the upcoming reach. Journal of Neurophysiology, 96, 3130–3146
* Churchland, M. M., & Shenoy, K. V. (2007a). Delay of movement caused by disruption of cortical preparatory activity. Journal of Neurophysiology, 97, 348–359.
* Churchland, M. M., Yu, B. M., Cunningham, J. P., Sugrue, L. P., Cohen, M. R., Corrado, G. S., et al. (2010c)  Stimulus onset quenches neural variability: A widespread cortical phenomenon. Nature Neuroscience, 13, 369–378
* Churchland, M. M., Yu, B. M., Ryu, S. I., Santhanam, G., & Shenoy, K. V. (2006c). Neural variability in premotor cortex provides a signature of motor preparation. The Journal of Neuroscience, 26, 3697–3712
* Messier, J., & Kalaska, J. F. (2000). Covariation of primate dorsal premotor cell activity with direction and amplitude during a memorized-delay reaching task. Journal of Neurophysiology, 84, 152–165.
* Santhanam, G., Ryu, S. I., Yu, B. M., Afshar, A., & Shenoy, K. V. (2006). A high-performance brain-computer interface. Nature, 442, 195–198.
* Santhanam, G., Sahani, M., Ryu, S. I., & Shenoy, K. V. (2004). In: An extensible infrastructure for fully automated spike sorting during online experiments (pp. 4380–4384). Proceedings of the 26th annual international conference of IEEE EMBS, San Francisco, CA.
* Yu, B. M., Afshar, A., Santhanam, G., Ryu, S. I., Shenoy, K. V., & Sahani, M. (2006). Extracting dynamical structure embedded in neural activity. In Y. Weiss, B. Schölkopf & J. Platt (Eds.), Advances in neural information processing systems, (Vol. 18, pp. 1545–1552). Cambridge, MA: MIT Press
* Yu, B. M., Cunningham, J. P., Santhanam, G., Ryu, S. I., Shenoy, K. V., & Sahani, M. (2009). Gaussian-process factor analysis for low-dimensional single-trial analysis of neural population activity. Journal of Neurophysiology, 102, 614–635.
