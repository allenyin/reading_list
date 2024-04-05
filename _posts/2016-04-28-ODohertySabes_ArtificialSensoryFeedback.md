---
layout: post
title: "Dadarlat, O'Doherty & Sabes 2015: A learning-based approach to artificial sensory feedback leads to optimal integration"
date: 2016-4-28
comments: false
tags:
- BMI
- sensory_feedback
- cortical_stimulation
- Sabes
- O'Doherty
---

[A learning-based approach to artificial sensory feedback leads to optimal integration](http://www.nature.com/neuro/journal/v18/n1/full/nn.3883.html)

**Motivation**

Maximally precise movements are achieved by combining estimates of limb or target positiion from multiple sensory modalities, weighting each by its relative reliability. Current BMI relies on visual feedback alone, and would be hard to achieve fluid and precise natural movements. Artificial proprioception may improve performance of neuroprosthetics.

**Goal**

Artificial proprioception should be able to:

1. Provide sufficient information to alow competent performance in the absence of other sensory inputs.
2. Permit multisensory integration with vision to reduce movement variability when both signnals are available.
Implemented via multichannel intracortical microstimulation. Different from most other works that take a biomimetic approach. It focuses not on reproducing natural patterns of activity but instead on taking advantage of the natural mechanisms of sensorimotor learning and plasiticity.

Hypothesize spatiotemporal correlations between a visual signal and novel artificial signal in a behavioral context would be sufficient for a monkey to learn to integrate the new modality.

**Approach**

Monkey looks at a screen, trying to move to an invisible target. The movement vector is the vector between the monkey's current hand position and the invisible target.

1. *Visual feedback*: The movement vector is translated to random moving-dot flow field. The coherence of the dot-field is the percentage of dots moving in the same direction. So 100% coherence dot-field would have the dots moving in the same direction as the movement vector.
2. *ICMS*: 96-channels array is implanted. 8 electrodes were stimulated on. During feedback, the movement vector is decomposed into 8 components in direction equally spaced around a circle, each corresponding to a stimulating electrode. Higher relative frequency on an electrode means greater component of the movement vector in that direction. Common frequency scaling factor corresponds to movement vector distance.

Experiments inluded:

1. Learning the task with only visual feedback, with different coherence to demonstrate performance differences due to changing sensory cue precision.
2. Learning the task with only ICMS feedback. Trained by providing ICMS during visual task to teach monkey to associate the spatial relationship. No changing coherence.
3. Performing the task with both.

Metrics:

1. *Percent trials correct*
2. *Number of movement segments* - small is better. Movement segment found by assuming sub-movements have bell-hsaped velocity profiles -- identify submovements by threshold crossings of the radio velocity plot of a trajectory.
3. *Normalized movement time*: by the distance to target.
4. *Noramlized path length*: Normalized the integrated path length by the distance from start to target.
5. *Mean and Variance of the initial angle*: Used to compare initial movement direction and movement vector.
6. *Distance estimation*: Assess the monkey's ability to estimate target distance from ICMS by regressing initial movement distance against target distance for ICMS-only trials, excluding trials for which the first movement segment was not the longest.

**Evaluating Sensory Integration**

Minimum variance integration, which is supposed to the *optimal* integration, predicts that in VIS+ICMS condition, as the visual coherence increases from 0% to 100%, the animals should transition from relying primarily on the ICMS cue to primarily on the visual cue -- under the model of minimum variance integration, each sensory cue should be wieghted inversely proportional to its variance.

**Results**

1. Monkey learns all three tasks.
2. VIS+ICMS outperforms VIS only for visual coherence less than 50%.
3. Optimal (minimum variance integration) integration of the two sensory modalities observed.

And only 8 electrodes!!
