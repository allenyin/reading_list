---
layout: post
title: "Wiener Filter Notes"
date: 2016-4-12
comments: false
tags:
- BMI
- DSP
- Signal_processing
---

Wiener filter is used to produce an estimate of a target random process by LTI filtering of an observed noisy process, assuming known stationary siganl and noise spectra. This is done by minimizing the mean square error (MSE) between the estimated random process and the desired process.

Wiener filter is one of the first *decoding* algorithms used with success in BMI.

Derivations of Wiener filter are all over the place. 

1. Many papers and classes refer to [Haykin's Adaptive Filter Theory](http://www.amazon.com/Adaptive-Filter-Theory-Simon-Haykin/dp/0130901261/ref=mt_paperback?_encoding=UTF8&me=), a terrible book, in terms of setting the motivation, presenting intuition, and the horrible typesetting.

2. [MIT's 6.011 notes on Wiener Filter](http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-011-introduction-to-communication-control-and-signal-processing-spring-2010/readings/MIT6_011S10_chap11.pdf) has a good treatment of DT noncausal Wiener filter derivation, and includes some practical examples. Its treatment on Causual Wiener Filter, which is probably the most important regarding real-time processing, is mathematical and really obscures the intuition -- *we reach this equation from completing the square and using Parseval's theorem*, without mentioning the consquences in the time domain.

3. [Max Kamenetsky's EE264 notes](http://web.stanford.edu/class/archive/ee/ee264/ee264.1072/mylecture12.pdf) gives the best derivation and numerical examples of the subject for practical application, even though only DT is considered. It might get taken down, so extra copy [here]({{ site.baseurl }}/assets/wienerFilter.pdf}. Introducing the causual form of Wiener filter using input whitening method developed by Shannon and Bode fits into the general framework of Wiener filter nicely.

**Wiener Filter Derivation Summary**

1. Both the input $$\mathbf{x}$$ (observation of the target process) and output $$\mathbf{y}$$(estimate of the target process $$\mathbf{d}$$, after filtering) are random processes.

2. Derive expression for cross-correlation between input and output.

3. Derive expression for the MSE between the output and the target process.

4. Minimize expression and obtain the transfer function in terms of $$\mathbf{S_{xx}}$$ and $$\mathbf{S_{xd}}$$, where $$\mathbf{S}$$ are Z or Laplace transforms of the cross-correlations.
