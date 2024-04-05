---
layout: post
title: "Ganguly, Carmena 2011: Reversible large-scale modification of cortical networks during neuroprosthetic control"
date: 2015-7-27
comments: false
tags:
- BMI
- Carmena
- Ganguly
- motor_system
- neural_decoding
- neuroplasticity
---

[Reversible large-scale modification of cortical networks during neuroprosthetic control](http://www.nature.com/neuro/journal/v14/n5/full/nn.2797.html)

> Monitored ensembles of neurons that were either casually linked to BMI control or indirectly invovled, found that proficient neuroprosthetic control is associated with *large-scale modifications to the cortical network*. [...] Specifically, there were changes in the preferred direction of both direct and indirect neurons. Notably, with learning, there was a relative decrease in the net modulation of indirect neural activity in comparison with direct activity. [...] Thus, the process of learning BMI control is associated with differential modification of neural populations based on their specific relation to movement control.

Results pretty intuitive, but analysis methods are useful to know.

**Experiment**
Recorded ensembles of M1 neurons while only a subset were assigned to have a causal role during control as direct neurons. The monkyes performed center-out reaching movements using a exoskeleton that constrained movements to the horizontal plane.

Used a linear decoder for motor commands. Decoder was held constant after initial training. Stability of recordings across days assessed by measuring the stationarity of spike waveforms and the interspike interval distribution, as well as directional modulation during manual control sessions.

**Results**

1. *Modification of preferred directions*  
    There is a relative remapping of the preferred directions for all neurons without any substantial systematic rotational shifts for each neural opulation.

2. *Differential modification of modulation depths*  
    Direct and indirect neurons had different tuning depth. This differential modulation was specifically present during proficient neuroprosthetic control and not during the initial learning period. At population level, no significant systematic differences in the mean firing rate between manual control and brain control for either populations.

3. *Reversibility of modifications*  
    Modulation depths for the manul-BMI-manul experimental scheme changes, while being similar during the manual sessions. This suggests reversibility in the large-scale modifications dependent on cortical state (manual vs. BMI_

4. *Stability*  
    Indirect neurons maintained a relatively fixed neuron-behavior relationship during brain-control through sessions across days. May suggest an active role to brain-control? Probably related to the irrotational shift of tuning properties.

Used bootstrap resampling methods for testing significance in directional tuning and mean modulation depth changes.
