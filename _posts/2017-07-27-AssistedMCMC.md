---
layout: post
title: "Assisted MCMC -- Learning from human preferences"
date: 2017-07-27
comments: false
tags:
- BMI
- Machine_Learning
- Reinforcement_Learning
- ideas
---

The problem with using [intention estimation](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4105020/) in BMI is that the algorithm designers need to write down an objective function. While this is easy to do for a simple task, it is unclear how and not practical to do this for a general purpose prosthesis.

Using reinforcement learning based decoder deriving [error-signal](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4106211/) directly from cortical activities would be nice and in my opinion the holy grail of BMI decoder. However, deriving the proper error signal and constructing an error decoder seems to present the same problem -- the designers have to first establish what exactly is an error condition.

A compromise is perhaps a human assisted search in the decoding space. The possible decoding space is large, but as [Google+Tri Alpha](https://research.googleblog.com/2017/07/so-there-i-was-firing-megawatt-plasma.html) demonstrated, by guiding MCMC search via human inspection of the results, good results in such complicated problems such as plasma confinement is possible. 

This general approach of [learning from human preferences](https://blog.openai.com/deep-reinforcement-learning-from-human-preferences/) is also becoming a hot topic recently, as getting an objective function slightly wrong may result in completely unseen consequences (much worse than arrogantly assuming a monkey's goal in an experiment is to always get a grape).
