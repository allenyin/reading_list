---
layout: post
title: "The Eighty Five Percent Rule for optimal learning"
date: 2022-01-21
comments: false
tags:
- Machine_Learning
- Reinforcement_Learning
- learning
---

[The Eighty Five Percent Rule for optimal learning](https://www.nature.com/articles/s41467-019-12552-4)

A practice schedule or learning plan can be very important in skills and knowledge acquisition, thus the saying "perfect practice makes perfect". I first heard about this work on Andrew Huberman's [podcast on goal setting](https://hubermanlab.com/the-science-of-setting-and-achieving-goals/). The results here are significant, offering insights into both training ML algorithms, as well as biological learners. Furthermore, the analysis techniques are elegant, definitely brushed off some rust here!

## Summary

1. Examine the role of the __difficulty of training__ on the __rate of learning__.
2. Theoretical result derived for learning algorithms relying on some form of __gradient descent__, in the context of __binary classification__.
  - Note that gradient descent here is defined as where "parameters of the model are adjusted based on feedback in such a way as to reduce the average error rate over time". This is pretty general, and both reinforcement learning, stochastic gradient descent, and [LMS filtering]({{ site.baseurl }}/2016/01/BlackfinLMS) can be seen as special cases.
3. Results show under __Gaussian__ noise distributions, the optimal error rate for training is around 15.87%, or conversely, the __optimal training accuracy is about 85%__.
  - The noise distribution profile is assumed to be fixed, i.e. the noise distribution won't change from Gaussian to Poisson.
  - The 15.87% is derived from the value of normal CDF with value of -1.
  - Under different fixed noise distributions, this optimal value can change.
4. Training according to fixed error rate yields __exponentially faster__ improvement in precision (proportional to accuracy), compared to fixed difficulty. $$O(\sqrt(t))$$ vs. $$O(\sqrt(log(t)))$$.
5. Theoretical results validated in simulations for perceptrons, 2-layer NN on MNIST dataset, and [Law and Gold model](https://www.nature.com/articles/nn.2304) of perceptual learning (neurons in MT area making decision about the moving direction of dots with different coherence level, using reinforcement learning rules).

## Some background

The problem of optimal error rate pops up in many domains:
- Curriculum learning, or self-paced learning in ML.
- Level design in video games
- Teaching curriculum in education

In education and game design, empirically we know that people are more engaged when the tasks being presented aren't too easy, and just slightly more difficult. Some call this the optimal conditions for "flow state".

## Problem formulation

The problem formulation is fairly straight-forward, as the case of binary classification and Gaussian noise.

1. Agent make decision, represented by a decision variable $$h$$, computed as $$h=\Phi(\mathbf{x}, \phi)$$, where $$\mathbf{x}$$ is the stimulus, and $$\phi$ are the parameters of whatever learning algorithm.
2. The decision variable $$h$$ is a noisy representation of the true label $$\Delta$$: $$h = \Delta + n$$, where $$n \tilde N(0, \sigma)$$.
3. If the decision boundary is set at $$h=0$$ (see Figure 1A), such that chose A when $$h<0$$, B when $$h>0$$ and randomly otherwise, then the decision noise leads to error rate of: \\[ER = \int_-\infty^0 p(h|\Delta,\sigma)dh=F(-\Delta/\sigma)=F(-\beta\Delta)\\].
  - p() is Gaussian distribution
  - F() is Gaussian CDF
  - $$\beta$$ is precision, and essentially measures how "peaky" the decision variable distribution is. This can be thought of as the (inverse) accuracy or "skill" of the agent.
  - So, the error decreases with both agent skill ($$\beta$$) and ease of problem ($$\Delta$$).
4. Learning is essentially an optimization problem, to change $$\phi$$ in order to minimize $$ER$$. This can be formulated as a general gradient descent problem: \\[\frac{d\phi}{dt}=-\eta\nabla_\phi ER\\].
5. This gradient can be written as $$\nabla_\phi ER = \frac{dER}{d\beta}\nabla_\phi \beta$$. And we want to find the optimal difficulty $$\Delta^*$$ that maximizes $$\frac{dER}{d\beta}$$.
6. $$\Delta^*$$ turns out to be $$\frac{1}{\beta}$$, which gives optimal error rate $$ER^*\approx 0.1587$$.
  - This is nice, the difficulty level should be proportional to the skill level.

![model illustration]({{ site.baseurl }}/assets/optimal_error_rate1.png){: .center-image }

## Simulations

Validation of this theory boils down to the following elements:
1. How to quantify problem/stimulus difficulty $$\Delta$$?
2. How to select problem with the desired difficulty?
3. How to adjust target difficulty level to maintain the desired error rate?
3. How to measure error rate $$ER$$?
4. How to measure skill level?

1. Application to perceptron:
  - A fully trained teacher perceptron network's weights $$\mathbf{e}$$ are used to calculate the difficulty. The difficulty of a sample is equal to its distance from the decision boundary (higher is less difficult).
  - Skill level of the network is $$\cot{\theta}$$, where $$\theta$$ is the angle between the learner perceptron's weight vector and the teacher perceptron's weight vector.
  - Error rate is approximately Gaussian and can be determined from the weight vectors of the teacher and learner perceptrons, and the sample vectors.

2. Application to two-layer NN:
  - Trained teacher network. The absolute value of the teacher network's sigmoid output is the difficulty of a stimulus.
  - Error rate is the accuracy over the past 50 trials (not batch training).
  - Skill level is the final performance over the entire MNIST dataset.
  - Difficulty level is updated with value proportional to the current and target accuracy level.

3. Appliation to Law and Gold model:
  - Simulated update rule of 7200 MT neurons according to the orignal reinforcement model.
  - Coherence adjusted to hit target accuracy level: implicitly measure difficulty level
  - Accuracy/error rate is from past running average
  - Final skill level is from applying ensemble on different coherence level stimulus (disabling learning) and fitting logistic regression.

## Implications 

1. Optimal rate is dependent on task (binary vs. multi-class), and noise distribution.
2. Batch learning makes things more tricky -- depending on agent learning rate.
3. Multi-class may require finer grained evaluation of difficulty and problem preseentation (i.e. misclassifying 1v2, or 2v3).
4. Not all models follow this framework, e.g. Bayesian learner with perfect memory does not care about example presentation order.
5. Can be a good model for optimal use of attention for learning -- suppose exerting attention changes the precision $$\beta$$, then the benefits of exerting attention is maximized during optimal error rate.
