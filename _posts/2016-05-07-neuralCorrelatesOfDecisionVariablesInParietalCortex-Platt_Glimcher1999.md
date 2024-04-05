---
layout: post
title: "Platt & Glimcher 1999: Neural correlates of decision variables in parietal cortex"
date: 2016-5-7
comments: false
tags:
- Parietal_Lobe
- decision
- sensory-motor_integration
---

[Neural correlates of decision variables in parietal cortex](http://www.nature.com/nature/journal/v400/n6741/abs/400233a0.html)

**Motivation**

Sensory-motor reflex has been tacitly accepted by many older physiologists as an appropriate model for describing the neural processes that underlie complex behavior. More recent findings (in the 1990s) indicate that, at least in some cases, the neural events that connect sensation and movement may involve processes other than classical relfexive mechanisms and these data suppport theoretical approaches that have challenged reflex models directly.

Researchers outside physiology have long argued (since 1960s) for richer models of the sensory-motor process. These models invok3 the **explicit representation of a class of decision variables, which carry information about the environment, are extracted in advance of response selection, aid in the interpretatin or processing of sensory data and are a prerquisite for rational decision making**.

This paper describes a formal **economic-mathematical** approach for the physiological studey o fthe senosry-motor process/decision-making, in the **lateral intra-parietal (LIP)** area of the macaque brain.

**Caveats**

1. Expectation of reward magnitude result in neural modulations in the LIP. LIP is known to translate visual signals into eye-movement commands.

2. The same neurons are sensitive to expected gain and outcome probability of an action. Also correlates with subjective estimate of the gain associated with different actions.

3. These indicate neural basis of reward expectation.

**Decision-Making Framework**

The rational decision maker makes decision based on two environmental variables: the gain expected to result from an action, and the probability that the expected gain will be realized. The decision maker aims to maximize the expected reward.

Neurobiological models of the processes that connect sensation and action almost never propose the explicit representation of decision variables by the nervous system. Authors propose a framework containing

1. Current sensory data - reflect the observer's best estimate of the current state of the salient elements of the environment.

2. Stored representation of environmental contingencies - represent the chooser's assumptions about current environmental contingencies, detailing how an action affects the chooser.

This is a Bayesian framework.

**Sensory-Motor integration in LIP**

In a previous experiment, the authors concluded that visual attention can be treated as conceptually separable from other elements of the decision-making process, and that activity in LIP does not participate in sensory-attentional processing but is correlated with either outcome continguencies, gain functions, decision outputs or motor planning.

**Experiments**

1. Cue saccade trials: a change in the color of a centrally located fixation stimulus instructed subjects to make one of two possible eye-movement responses in order to receive a juice reward. Before the color change, the rewarded movement was ambiguous. The successive trials, the volume of juice delivered for each instructed response (expected gain), or the probability that each possible response would be instructed (outcome probability) are varied.
    
    Goal is to test whether any LIP spike rates correlate to variations in these decision variables.

2. Animals were rewarded for choosing either of two possible eye-movement responses. In subsequent trials, varied the gain that could be expected from each possible response. The frequency with which the animal chose each response is then an estimate of the subjective value of each option.

    Goal is to test whether any LIP activity variation correlates with the subjective estimate of decision variable.

**Analysis**

<u>Experiment 1</u>

For each condition: 1) keeping outcome probability fixed while varying expected gain, and 2) keeping expected gain fixed while varying outcome probability, a trial is divded into 6 200ms epochs. The activity during these epochs are then used to calculate regressions of the following variables:

1. Outcome probability.
2. Expected gain.
3. Type of movement made (up or down saccade).
4. Amplitude of saccade.
5. Average velocity of saccade.
6. Latency of saccade.

Multiple regression were done for each epoch, percentage of recorded neurons that show significant correlations between firing rate and the decision variables were calculated.

Average slope of regression against either decision variables were taken as a measure of correlation. The same regressio slopes were calculated for type of movement made as well.

**For both expected gain and outcome probability**, the regression slopes were significantly greater than 0, and greater than that for type of movement during early and late visual intervals, and decay during late-cue and movement. The opposite is seen for type of movement regression slopes.

<u>Experiment 2</u>

Similar analysis is done to evaluate neural correlate of subjective estimate of reward. Results show activity level correlates with the perceived gain associated with the target location within the neuron's receptive field. The time evolution of the regression slopes show a similar decay as before.

**Consistent with Herrnstein's matching law for choice behavior, there was a linear relationship between the proportion of trials on which the animal chose the target inside the response field and the proportion of total juice available for gaze shifts to that target**.

Animal's estimate of the relative value of the two choices is correlated with the activation of intraparietal neurons.

**Discussions**

1. It would seem obvious that there are neural correlates for decision variables, rather than the traditional sensory-motor reflex decision-making framework. But this may be solely in the context of investigating sensory areas..probably have to read Sherrington to know how he reached that conclusion.

2. The data in this paper can be hard to reconcile with traditional sensory-attentional models, which would attribute modulations in the activity of visually responsive neurons to changes in the behavior relevance of visual stimuli, which would then argue that the author's manipulations of expected gain and outcome probably merely altered the visual activity of intraparietal neurons. Explainations include:

    * Previous work show intraparietal neurons are insensitive to changes in the behavioral relevance of either presented stimulus when it is not the target of a saccade.

    * Experiment 2 showed that intraparietal neuron activity was modulated by changes in the estimated value of each response during the fixation intervals BEFORE the onset of response targets.

3. Modulations by decision variables early in trial. Late in trial more strongly modulated by movement plan. Suggests intraparietal cortex lies close to the motor output stages of the sensory-deicsion-motor process. Prefrontal cortex perhaps has reprsentation of decision variables throughout the trial.
