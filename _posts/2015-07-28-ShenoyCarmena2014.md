---
layout: post
title: "Shenoy, Carmena 2014: Combining Decoder Design and Neural Adaptation in Brain-Machine Interfaces"
date: 2015-07-28
comments: false
tags:
- BMI
- Carmena
- Shenoy
- neural_decoding
- neuroplasticity
---

Perspective article: [Combining Decoder Design and Neural Adaptation in Brain-Machine Interfaces](http://www.cell.com/neuron/abstract/S0896-6273(14)00739-9)

**Thesis**: optimal codesign of decoders and concomitant engagement of neural adaptation is important.

**Decoding vs. Learning**. 

Decoder design begins by (1) training a decoder to predict natural or intended movement from previously recorded open-loop neural data and (2) assumes that the statistics of the neural activity remain the same when controlling the BMI during the closed-oop phase.

Neural adapation approach begins by (1) starting with a decoder that is not trained to predict natural or intended movement, and instead has minimal structure within its decoder paratmers, and (2) takes the view that there is a de novo, closed-loop system that has to be learned by the brain in order to achieve proficient BMI control.

These two approaches do not have to be exclusive.

Three experimental model:

1. hand-controlled training, hand-free BMI control. No context switch between change, so movement continue from training to BMI. Lead to high performance with biomemtic decoder design.
2. hand-controlled training, hand-independent BMI control - involves context change between control change. Hand free to move in brain-control. The same movements that were used to train the open-loop decoder cannot be made during BMI. This process predicts more meaningful neural adaptation changes.
3. hand-constrained training, hand-constrained BMI control without context change via passive observation. Less mismatch between closed-loop BMI operation and open-loop decoder training, can lead to high BMI perforance but predict less neural adapatation.

CLDA e.g. Carmena's PVKF with Smooth-batch or ReFIT may combine decoder adapation with neural adapation. Requires "intention estimation" which I think is hard to generalize, but it's also the easiest closed-loop adaptation to implement.

Neuro-adapation allows animals to effectively learn at least a slightly different decoder each day before being able to perform the task proficiently. But this is difficult for more complex task with higher DOF. The key is to pair stable neural populations with fixed, static decoder. Differential modulation of neuronal populations based on their causal link to neuroprosthetic control, resulting netowrks co-existing with native cortical networks, can switch without interference based on task requirements, blablabla nothing new here, just re-iterating the *Ganguly-Carmena 2011* paper.

The real challenge is to control two different BMI using two decoder from two separate neural ensembles!

**How do these adapations happen? Basal ganglia? **

Mouse studies (Yin et al., 2009)showed increasing coherence between M1 and dorsostlateral striatum neurons during learning to brain-control using M1 neurons. 
    
    Changes in cohereance were temporally precise and significantly more pronounced in direct M1 neurons than in those not controlling the BMI - consistent with formation of a BMI-specific network. Further, knckout mice lacking NMDA receptors in the striatum were not able to learn the same task, supporting the notion that corticostriatal plasticity is necessary for neuroprosthetic learning. Together these results suggest that corticobasal ganglia circuits are invovles in BMI learning, even when they do not require physical movement. [...] neural adapatation not only elicits changes in motor cortical networks, but also recruits elements fo the natural motor system outside of the cortex such as the basal ganglia. 

This is pretty cool...brain has so much generalization capability, motor learning is like the greatest API ever for BMI! On the other hand, if BMI learning is so closely coupled with the motor learning process (signaled by the activation of the corticobasal ganglia circuits), would that imply subjects who have more proficient motor learning would also be more proficient at learning different modes of BMI control (at least when using M1 ensembles)?

Can try a bimanual task where one hand is controlled by BMI the other by native arm.

How does the decoder know if the user intends to use the BMI controlled device? Motor cortex is always active and not strictly lateralized and is part of a coordinated bimanual circuit. This correlation may not be readily separated by the decoder, especially if neural activity from both contra- and ipsilateral motor cortex couupy the same neural dimensions.
    
    Thus the onus would then fall on neural adaptation to create a new motor control circuit, which effectively decorrelates control of the intact arm from the prosthetsis, so that the subject can have independent control of both her real and prosthetic limb and hand.

**References to Read**

* Chase, S.M., Kass, R.E., and Schwartz, A.B. (2012). Behavioral and neural correlates of visuomotor adaptation observed through a brain-computer interface in primary motor cortex. J. Neurophysiol. 108, 624–644.
* Chestek, C.A., Gilja, V., Nuyujukian, P., Foster, J.D., Fan, J.M., Kaufman, M.T., Churchland, M.M., Rivera-Alvidrez, Z., Cunningham, J.P., Ryu, S.I., and Shenoy, K.V. (2011). Long-term stability of neural prosthetic control signals from silicon cortical arrays in rhesus macaque motor cortex. J. Neural Eng. 8, 045005.
* Dangi, S., Gowda, S., Moorman, H.G., Orsborn, A.L., So, K., Shanechi, M., and Carmena, J.M. (2014). Continuous closed-loop decoder adaptation with a recursive maximum likelihood algorithm allows for rapid performance acquisition in brain-machine interfaces. Neural Comput. 26, 1811–1839.
* Durand, D.M., Ghovanloo, M., and Krames, E. (2014). Time to address the problems at the neural interface. J. Neural Eng. 11, 020201.
* Fan, J.M., Nuyujukian, P., Kao, J.C., Chestek, C.A., Ryu, S.I., and Shenoy, K.V. (2014). Intention estimation in brain-machine interfaces. J. Neural Eng. 11, 016004.
* Fetz, E.E. (2007). Volitional control of neural activity: implications for braincomputer interfaces. J. Physiol. 579, 571–579
* Gage, G., Ludwig, K., Otto, K., Ionides, E., and Kipke, D. (2005). Naive coadaptive
cortical control. J. Neural Eng. 2, 52–63
* Jarosiewicz, B., Masse, N.Y., Bacher, D., Cash, S.S., Eskandar, E., Friehs, G., Donoghue, J.P., and Hochberg, L.R. (2013). Advantages of closed-loop calibration in intracortical brain-computer interfaces for people with tetraplegia. J. Neural Eng. 10, 046012.
* Kao, J.C., Stavisky, S., Sussillo, D., Nuyujukian, P., and Shenoy, K.V. (2014). Information systems opportunities in brain-machine interface decoders. Proceedings of the IEEE 102, 666–682.
* Koralek, A.C., Jin, X., Long, J.D., II, Costa, R.M., and Carmena, J.M. (2012). Corticostriatal plasticity is necessary for learning intentional neuroprosthetic skills. Nature 483, 331–335.
* Koralek, A.C., Costa, R.M., and Carmena, J.M. (2013). Temporally precise cellspecific coherence develops in corticostriatal networks during learning. Neuron 79, 865–872.
* Lebedev, M.A., Carmena, J.M., O’Doherty, J.E., Zacksenhouse, M., Henriquez, C.S., Principe, J.C., and Nicolelis, M.A. (2005). Cortical ensemble adaptation to represent velocity of an artificial actuator controlled by a brainmachine interface. J. Neurosci. 25, 4681–4693.
* Merel, J., Fox, R., Jebara, T., and Paninski, L. (2013). A multi-agent control framework for co-adaptation in brain-computer interfaces. Proceedings of the 26th Annual Conference on Neural Information Processing Systems, 2841–2849.
* Milla´ n, Jdel.R., and Carmena, J.M. (2010). Invasive or noninvasive: understanding brain-machine interface technology. IEEE Eng. Med. Biol. Mag. 29, 16–22
* Yin, H.H., Mulcare, S.P., Hila´rio, M.R., Clouse, E., Holloway, T., Davis, M.I., Hansson, A.C., Lovinger, D.M., and Costa, R.M. (2009). Dynamic reorganization of striatal circuits during the acquisition and consolidation of a skill. Nat. Neurosci. 12, 333–341.
* Sussillo D, Nuyujukian P, Fan JM, Kao JC, Stavisky SD, Ryu SI, Shenoy KV (2012) A recurrent neural network for closed-loop intracortical brain-machine interface decoders. Journal of Neural Engineering. 9(2):026027
