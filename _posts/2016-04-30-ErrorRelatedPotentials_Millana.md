---
layout: post
title: "Chavarriaga, Sobolewski & Millan 2014: Errare machinale est: the use of error-related potentials in brain-machine interfaces"
date: 2016-4-30
comments: false
tags:
- BMI
- error-related_potentials
- Reinforcement_Learning
- Machine_Learning
- Review
---

[Errare machinale est: the use of error-related potentials in braine-machine interfaces](http://journal.frontiersin.org/article/10.3389/fnins.2014.00208/full)

This review focuses on electrophysiological correlates of error recognition in human brain, in the context of human EEG. Millan calls this **error-related potentials, ErrPs**. It has been proposed to use these signals to improve BMI, in the form of training BMI decoder via reinforcement learning.

**Error-related brain activity**

Early reports in EEG date back to early 1990's (*Falkenstein et al., 1991*; *Gehring et al., 1993*). Showed a characteristic EEG event-related potential elicited after subjects commited errors in a speed repsonse choice task, characterized by a negative potential deflection, termed the *error-related negativity*, appearing over fronto-central scalp areas at about 50-100ms after a subject's erroneous response. The negative copmonent is followed by a centro-parietal positive deflection.

*Modulations of this latter component have been linked to the subject's awareness of the error*. ERN amplitude seems to be modulated by the importance of erros in the given task. *These signals have been shown to be quite reliable over time and across diferent tasks*.

Very encouraging for reinforcement-learning based schemes.

fMRI, EEG-based source localization, and intra-cranial recordings suggest that the fronto-central ERP modulations commonly involve the *medial-frontal* cortex, specifically the *anterior cingulate cortex* (ACC). This is consistent with ACC being involved in reward-anticipation and decision-making.

**Error-related potentials for BMI**

*Ferrez and Millan 2008*: 2-class motor-imagery bsaed BMI controlling a cursor moving in discrete steps -- showed ERPs elicited after each command could be decoded as corresponding to the error or correct condition with an accuracy of about 80%. Only 5 subjects, but encouraging.

The ErrP classifiers maintained the same performance when tested several months after calibration - relatively stable signal form. Seemed to be mainly related to **a general error-monitoring process**, not task-dependent.

*Possible Confounds* (in EEG studies):

1. Eye movement contamination: Need to make sure location or movement of target stimuli are balanced.
2. Observed potentials are more related to the rarrity of the erroneous events (?)
3. Attential level: subjects tend to have smaller ErrP amplitude when simply monitoring the device than when they are controoling it -- requires efficient calibration methods.

**Error-Driven Learning**

Trials in which the decoder performed correctly, as classified by ErrP can be incorporated into a learning set that can be then used to perform online retraining of the motor imagery (MI) classifier. Rather discrete, but good architecture.

Binary ErrP decoding can be affected substantially by false positive rate (i.e. correct BMI actions misclassified as errors). Solution is to use methods relying on probabilistic error signals, taking into account of the reliability of the ErrP decoder.

Millan has used ErrP to improve his shared-control BMI systems.
