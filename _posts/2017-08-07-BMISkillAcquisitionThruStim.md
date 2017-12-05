---
layout: post
title: "BMI skill acquisition through stimulation"
date: 2017-08-09
comments: false
tags: [BMI, sensory_feedback, cortical_stimulation, tDCS, Collinger, Boninger, Fetz]
---

There is an interesting section on **Approaches for BCI Learning** in the review [Brain computer interface learning for systems based on electrocorticography and intracortical microelectrode arrays](http://journal.frontiersin.org/article/10.3389/fnint.2015.00040/full#h6). Specifically:

> Since cortical stimulation can modulate cortical activity patterns (Hummel and Cohen, 2006; Harvey and Nudo, 2007), it is conceivable that cortical stimulation may be able to replace or supplement repetitive behavior training to induce changes in cortical activity and accelerate BCI learning (Soekadar et al., 2014). While this approach has not been well investigated for BCI learning, previous studies about neuroplasticity (Gage et al., 2005; Jackson et al., 2006) and rehabilitation using neurostimulation (Ziemann et al., 2002; Hummel et al., 2005; Hummel and Cohen, 2006; Harvey and Nudo, 2007; Perez and Cohen, 2009; Plow et al., 2009; Reis et al., 2009) can shed some light on the feasibility of this approach. At the macroscopic level, cortical areas can be stimulated non-invasively using transcranial magnetic or current stimulations. In the context of stroke rehabilitation, it has been suggested that such stimulation can enhance motor cortical excitability and change cortical connectivity (Hummel et al., 2005; Hummel and Cohen, 2006; Perez and Cohen, 2009). [...] A recent pilot study has shown that transcranial direct current stimulation induces event-related desynchronization associated with sensorimotor rhythm (Wei et al., 2013). This event-related desynchronization, along with motor imagery, was used to improve the performance of an EEG based BCI.

Nothing interesting there, there have been quiet some evidence that anodal tDCS has positive effects on motor and cognitive skill acquisition. I particularly like [Soekadar 2014](https://academic.oup.com/cercor/article/25/9/2409/2926054/Enhancing-Hebbian-Learning-to-Control-Brain): tDCS was used to help with the subjects to train to modulate sensorimotor rhythms (SMR, 8-15Hz). They hypothesized that M1 had a causal link to modulate SMR, so anodal tDCS was applied there. They found anodal stimulation resulted in better performance than sham and cathodal stimulation. I will not comment on if this experiment alone establishes its conclusion that "M1 is a common substrate for acquisition of physical motor skills and learning to control brain oscillatory activity", but it certainly serves as evidence that tDCS may help in BMI control acquisition.


> At the microscopic level, based on the concept of Hebbian or associative learning, motor cortical reorganization can be induced by coupling action potentials of one motor cortical neuron with electrical stimulation impulses of another motor cortical neuron (Jackson et al., 2006; Stevenson et al., 2012).  Besides electromagnetic stimulation, optogenetics is another approach to stimulate cortical tissue. 

They reference the Jackson, Mavoori, and Fetz 2006 paper [Long-term motor cortex plasticity induced by an electronic neural implant](https://search.proquest.com/docview/204522626?pq-origsite=gscholar). In this paper, stimulation was delieverd on one electrode upon detection of action potential on another one. This was done for 17 pairs of electrodes over 8 to 9 sessions spread between 1 to 4 days. The stimulation current is just above threshold current needed to elicit a muscle response (wrist). They first measured the muscle response torque vector elicited from stimulating the recording electrode, stimulating electrode, and a control electrode. After conditioning, they showed that the response vector elicited from stimulating the recording electrode has has shifted toward the response vector of the stimulating electrode. Meanwhile, the control electrode response vector does not change significantly. This results seems consistent with the second neuron firing in sync with the first neuron. Furhter, varying the lag betweeen record and stimulation has an effect on this shift, consisten with spike-timing dependence. The authors then suggest that this can be a method to induce "artifical synapses". While the use of even cortical stimulation to selectively strengthening specific neural pathways during rehab is not a brand new idea, the ability to create *artificial connections* is crazy cool for BMI.

In BMI, we know exactly (exaggeration) what signals will be mapped by a decoder to movement commands for a BMI. This means if we use a random decoder assigning weights to the units recorded at the different electrodes, we can potentially apply stimulation at those electrodes according to our decoding weight matrix to enhance the BMI skill acquisition. 

A more recent study from Fetz' group [Paired stimulation for spike-timing-dependent plasticity in primate snesorimotor cortex](http://www.jneurosci.org/content/37/7/1935) uses slightly different approach to induce STDP. They first map out connections between neurons near implanted pairs of electrodes, judging from the measured LFP in response to stimulation. Neuron A is putatively pre-synaptic, Neuron B post-synaptic, and Neuron C has recurrent connections with both of them and serves as a control. During conditioning they stimulated A then followed by B. The results again measured the evoked EP for A->B, B->A, and all to C.

Results are mixed: 2 out of 15 pairs showed increased EP in A->B direction. Network changes were seen -- neurons near the implanted area not involved in paired-stimulation also showed changes in their EP. Some showed depressed EP. Conditioning with spike-triggered stimulation from the 2006 study produced a larger proportion of positive plasticity effects than paired electrical stimulation and the authors propose possible mechanisms:

1. Stimulating at site A rather than using recorded trigger spikes would have activated a larger population of more diverse cell types and consequently can recurit a broad range of plasticity mechanisms, such as anti-Hebbian effects.

2. The triggering spikes in 2006 study occured in association with normal behavior, whereas the paired stimulation was delivered in a preprogrammed manner independently of the modulation of local activity with movements or sleep spindles.

3. Most importantly, the 2006 study measured plasticity effects in terms of behavior, rather than EP.

So, looks like behavior is important and spike-triggered stimulation may result in better plasticity mechanisms, I hypothesizie.. Ideally, stimulation specificity afforded by optogenetics may be a better tool to study this effect.

And apparently someone in our group from 2010-2012 had a similar idea about using stimulation to assit in BMI skill acquisition, and the results were bad, resulting in mastering-out.. So I better put this on the back burner.




