---
layout: post
title: "Hints from biology"
date: 2018-02-22
comments: false
tags:
- Deep_Learning
- ideas
- sensory
- post_parietal_cortex
---

The success of deep neural network techniques have been so great leading to the hype general intelligence can be achieved soon. I had my doubts, mostly based on the amount of data needed compared to examples needed for people to learn, but also on possible biological mechanisms that could implement backpropagation that is central to artificial neural networks. More neuroscience discoverys are needed.

The great Hinton made a big splash with the capsule theory. [Marblestone et al., 2016](https://www.frontiersin.org/articles/10.3389/fncom.2016.00094/full) had many speculations on how backprop could be approximated by various mechanisms.

Some cool recent results:

1. [Delahunt 2018](https://arxiv.org/abs/1802.02678): Biological mechanisms for learning, a computational model of olfactory learning in the Manduca sexta Moth, with applications to neural nets. [TR interview](https://www.technologyreview.com/s/610278/why-even-a-moths-brain-is-smarter-than-an-ai/)

    > The insect olfactory system [...] process olfactory stimuli through a cascade of networks where large dimension shifts occur from stage to stage and where sparsity and randomoness play a critical role in coding.

    Notably, a transition from encoding of stimulus from a low-dimensional parameter space to one in a high-dimensional parameter space occur, not too common in ANN architectures. Reminds me of the kernel transformations.

    > Learning is partly enabled by a neuromodulatory reward mechnaism of octopamine stimulation of the antennal lobe, whose increased activity induces rewiring of the mushroom body through Hebbian plasticity. Enforced sparsity in the MB focuses Hebbian growth on neurons that are the most important for the representation of the learned odor.

    Potential augment to backprop at least. Also, octopamine opens new transmitting channels for wiring expanding the solution space.

2. [Akrami 2018](https://www.nature.com/articles/nature25510): PPC represents sensory history and mediates its effects on behavior. Shows PPC's role in the representation and ues of prior stimulus information. Cool experiments showing Bayesian aspect of the brain. As much as I dislike Bayesian techniques..

3. [Nikbakht 2018](https://www.sciencedirect.com/science/article/pii/S0896627318300060?via%3Dihub#fig5) Supralinear and supramodal integration of visual and tactile signals in rats: psychophysics and neuronal mechanisms.

    . Rats combine vision and touch to distinguish two grating orientation categories.
    . Performance with vision and touch together reveals synergy between the two channels.
    . **PPC neuronal responses are invariant to modality.**
    . PPC neurons carry information about object orientation and the rat's categorization.

    
