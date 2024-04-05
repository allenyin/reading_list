---
layout: post
title: "McNiel, [...] & Francis 2016: Classifier performance in primary somatosensory cortex towards implementation of a reinforcement learning based brain machine interface"
date: 2016-5-7
comments: false
tags:
- BMI
- Francis
- Reinforcement_Learning
- error-related_potentials
---

[Classifier performance in primary somatosensory cortex towards implementation of a reinforcement learning based brain machine interface](http://joefrancislab.com/pdfs/Dave_SBEC%202016.pdf), submitted to Southern Biomedical Engineering Conference, 2016.

In the theme of RL-based BMI decoder, this paper evaluates classifiers for identifying the *reinforcing signal* (or ERS according to Millan). Evaluates the ability of several common classifiers to **detect impending reward delivery within S1 cortex during a grip force match to sample** task performed by monkeys.

**Methods**

1. Monkey trained to grip right hand to hold and match a visually displayed target.

2. PETHs from S1 generated, from 1) aligning with timing of visual cue denoting the impending result of trial (reward delivered or withheld), 2) aligning with timing of trial outcome (reward delievery or withold).
   
   PETH time extended 500ms after stimulus of interest using a 100ms bin width. (So only 500ms total signal, 5-bin vector samples).

3. Dimension-reduction of PETH via PCA. Use only the first 2 PCs, feed into classifiers including:

    * Naive Bayes
    * Nearest Neighbor (didn't specify how many k...or just one neighbor..)
    * Linear SVM
    * Adaboost
    * Quadratic Discriminant Analysis (QDA)
    * LDA
    
    Trained on 82 trials, tested on 55 trials. Goal is to determine if a trial is rewarding or non-rewarding.

**Results**

1. For all classifiers, post-cue accuracy higher than post-reward accuracy. Consistent with previous work (Marsh 2015) showing the presence of conditioned stimuli in reward prediction tasks shift rerward modulated activity in the brain to the earliest stimulus predictive of impending reward delivery.

2. NN performs the best out of all classifiers. But based on the sample size (55 trials) and the performance figures, not significantly better.

**Takeaways**

Results are good, but should have more controlled experiments to eliminate confounds...could be seeing an effect of attention level.

Also, still limited to discrete actions.

