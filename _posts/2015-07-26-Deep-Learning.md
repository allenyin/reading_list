---
layout: post
title: "Deep Learning - Review by LeCun, Bengio, and Hinton"
date: 2015-7-26
comments: false
tags:
- Deep_Learning
- Machine_Learning
- Review
- Hinton
- Bengio
- LeCun
---

[Nature review on Deep Learning by LeCun, Bengio, and Hinton](http://www.nature.com/nature/journal/v521/n7553/full/nature14539.html)

**Representational Learning** is a set of methods that allows a machine to be fed with raw data and automatically discover the representations needed for detection or classification. Deep-learning methods are repsentation-learning methods with multiple levels of representation, obtained by composing simple but non-linear modules that each transform teh representation at one level into a representation at a higher, slightly more abstract level. With the composition of enough such transformations, very complex functions can be learned.

Key advantage of Deep Learning is that it requires very little engineering by hand, so it can easily take advantage of increases in the amount of availabel computation and data. Feature extraction becomes easier. The number of nodes determine what kind of input-space transformation is possible, and there can classify data that otherwise cannot using lower-dimension techniques.

Interesting historical fact: in the late 1990s, neural nets and backpropagation were largely forsaken by the community. It was widely thought that learning useful, multistage, feature extractors with little prior knowledge was infeasible. In particular, it was commonly thought that simple gradient descent would get trapped in poor local minima.

**In practice, however, poor local minima are rarely a problem with large networks. Regardless of the initial conditions, the system nearly always reaches solutions of very similar quality. Theoretical and empirical results suggest that the landscape is packed with a combinatorially large number of saddle points where the gradient is zero, and the surface curves up in most dimensions and down in the remainder [...] saddle points with only a few downward curving directions are present in very large numbers, but almost all of them have very similar values of the objective function. Hence, it does not much matter which of these saddle points the algorithm gets stuck at.**

**Convolutional neural networks (convNet)** - four key ideas: 

* local connections: in array data, local groups of values are often highly correlated, forming distinctive local motifs that are easily detected; the local statistics of images and other signals are invariant to location.
* shared weights: If a motif can appear in one part of the image, it could appear anywhere, hence the idea of units at different locations sharing the same weights and detecting the same pattern in different parts of the array.
* pooling: merrge semantically similar features into one. Many natural signals are compositional hierarchies, in which higher-level features are otained by compoising lower-level ones.
* use of many layers.

**Distributed representations**. two different exponential advantages over classic learning algorithms that do not use distributed representations - both arise from the power of composition and depend on the underying data-generating distribution having an appropriate compnential structure.

* Learning distributed representations enable generalization to new combinations of the values of learned features beyond those seen during training (can be very useful BMI).
* Composing layers of representation in a deep net brings the potential for another exponential advantage (not sure what it means).

**Recurrent neural networks** for tasks that involve sequential inputs. Most likely useufl for BMI. Can be augmented with an explicity memory, e.g. *long short-term memory (LSTM)* that use special hidden units, the natural behavior of which is to remember inputs for a long time.

Much progress shold come with systems that train end-to-end and combine ConvNets with RNNs that use reinforcment learning to decide where to look.

**References to Read**

* Bottou, L. & Bousquet, O. The tradeoffs of large scale learning. In Proc. Advances in Neural Information Processing Systems 20 161–168 (2007).
* Hinton, G. E. What kind of graphical model is the brain? In Proc. 19th International Joint Conference on Artificial intelligence 1765–1775 (2005).
* Hinton, G. E., Osindero, S. & Teh, Y.-W. A fast learning algorithm for deep belief nets. Neural Comp. 18, 1527–1554 (2006). 
This paper introduced a novel and effective way of training very deep neural networks by pre-training one hidden layer at a time using the unsupervised learning procedure for restricted Boltzmann machines.
* Cadieu, C. F. et al. Deep neural networks rival the representation of primate it cortex for core visual object recognition. PLoS Comp. Biol. 10, e1003963 (2014).
* Farabet, C. et al. Large-scale FPGA-based convolutional networks. In Scaling up Machine Learning: Parallel and Distributed Approaches (eds Bekkerman, R., Bilenko, M. & Langford, J.) 399–419 (Cambridge Univ. Press, 2011).
* Weston, J. Chopra, S. & Bordes, A. Memory networks. http://arxiv.org/abs/1410.3916 (2014).
