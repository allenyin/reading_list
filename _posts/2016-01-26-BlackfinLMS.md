---
layout: post
title: "Wireless Headstage: Least-Mean Squared (LMS) adaptive noise cancellation."
date: 2016-1-26
comments: false
tags:
- BMI
- Wireless
- Blackfin
- Microcontroller
- DSP
---

[Wireless Project github](https://github.com/allenyin/allen_wireless)

LMS is the second stage of processing in RHA-headstage's signal chain, after AGC. It aims to estimate the noise common to all electrodes and subtract that noise from each channel.

**Adaptive Filtering Theory**

Chapter 12 on Adaptive Interference Cancelling in [Adaptive Signal Processing by Bernard Widrow](http://www.amazon.com/Adaptive-Signal-Processing-Bernard-Widrow/dp/0130040290) is an excellent reference on adaptive interference cancelling. Chapter 6 is a great reference on the LMS algorithm.

Adaptive noise cancelling uses an auxiliary or reference input derived from one or more sensors located at points in the noise field where the signal is weak or undetectable. This input is filtered and subtracted from a primary input containing both signal and noise. As a result, the primary noise is attenuated or elminiated by cancellation. This concept is illustrated below:

![image1]({{ site.baseurl }}/assets/adaptive_filter.png){: .center-image }

The objective is to produce a system output $$\epsilon=s+n_0-y$$ that is a best fit in the least-squares sense to the signal $$s$$. This is accomplished by feeding the system output back to the adaptive filter and adjusting the filter through an adaptive algorithm to minimize the total system output power. In this case, the system output serves as the error siganl for the adaptive process.

**LMS Theory**

LMS can be considered as an approximation of Wiener filter (i.e. LMS solution converges to the Wiener filter). Given an input vector $$\vec{x}$$, we multiply it by weights vector $$\vec{w}$$ such that we reduce the least-mean-squared error, which is the difference between $$w^T x$$ and the desired vector $$\vec{d}$$. The error term is then fedback to adjust $$\vec{w}$$. This is illustrated below:

![image2]({{ site.baseurl }}/assets/LMSdiagram.png){: .center-image }

In contrast with Wiener filter's derivation where we estimate the gradient of the error in order to find $$\vec{w}$$ values to minimize the error, in LMS, we sipmly aprroximate the gradient with $$\epsilon_k$$. This turns out to be an unbiased estimator, and the weights can be updated as:

$$\vec{W_{k+1}} = \vec{W_k} + 2\mu\epsilon_k\vec{X_k}$$

where $$\mu$$ is the update rate, similar to that in other gradient descent algorithms.

Therefore, the LMS algorithm is a rather simple algorithm to serve as the adaptive filter block in the adaptive noise cancellation framework.

**Application in firmware**

To apply these algorithms to our headstage application, we treat the current channel's signal as $$s[n]+e_n$$, where $$s[n]$$ is the signal for channel $$n$$, $$e_n$$ is the noise added to channel $$n$$. It's reasonable to assume that $$e_n$$ is correlated with noise observed in other channels (since they share the same chip, board, etc): $$e_{n-1}$$, $$e_{n-2}$$, etc. The signals measured in the previous channels then can be used as the `reference input` sources to predict and model the current channel's noise.

This is implemented in the firmware by Tim Hanson as below:

{% highlight asm linenos=table %}

/* LMS adaptive noise remover
	want to predict the current channel based on samples from the previous 8.
	at this point i1 will point to x(n-1) of the present channel.
		(i2 is not used, we do not need to write taps -- IIR will take care of this.)
	24 32-bit samples are written each time through this loop,
	so to go back 8 channels add m1 = -784
	to move forward one channel add m2 = 112
	for modifying i0, m3 = 8 (move +2 weights)
		and m0 = -28 (move -7 weights)
	i0, as usual, points to the filter taps!
*/

    // apply LMS weights for noise cancelling
	mnop || r1 = [i1++] || [i2++] = r4; //move to x1(n-1), save the saturated sample.
	mnop || r1 = [i1++m2] || r2 = [i0++]; //r1 = sample, r2 = weight.
	a0 = r1.l * r2.l, a1 = r1.h * r2.h || r1 = [i1++m2] || r2 = [i0++];
	a0+= r1.l * r2.l, a1+= r1.h * r2.h || r1 = [i1++m2] || r2 = [i0++];
	a0+= r1.l * r2.l, a1+= r1.h * r2.h || r1 = [i1++m2] || r2 = [i0++];
	a0+= r1.l * r2.l, a1+= r1.h * r2.h || r1 = [i1++m2] || r2 = [i0++];
	a0+= r1.l * r2.l, a1+= r1.h * r2.h || r1 = [i1++m2] || r2 = [i0++];
	a0+= r1.l * r2.l, a1+= r1.h * r2.h || r1 = [i1++m2] || r2 = [i0++];
	r6.l = (a0+= r1.l * r2.l), r6.h = (a1+= r1.h * r2.h) || r1 = [i1++m1] || r2 = [i0++m0];
    // move i1 back to the integrator output 7 chans ago; move i0 back to LMS weight for that chan

	r0 = r0 -|- r6 (s) || [i2++] = r0 || r1 = [i1--] ; //compute error, save original, move i1 back to saturated samples.
	r6 = r0 >>> 15 (v,s) || r1 = [i1++m2] || r2 = [i0++];//r1 = saturated sample, r2 = w0, i0 @ 1
.align 8

    // UPDATE LMS weights
	a0 = r2.l * r7.h, a1 = r2.h * r7.h || nop || nop; //load / decay weight.
r5.l = (a0 += r1.l * r6.l), r5.h = (a1 += r1.h * r6.h) || r1 = [i1++m2] || r2 = [i0--];//r2 = w1, i0 @ 0
	a0 = r2.l * r7.h, a1 = r2.h * r7.h || [i0++m3] = r5; //write 0, i0 @ 2
r5.l = (a0 += r1.l * r6.l), r5.h = (a1 += r1.h * r6.h) || r1 = [i1++m2] || r2 = [i0--];//r2 = w2, i0 @ 1
	a0 = r2.l * r7.h, a1 = r2.h * r7.h || [i0++m3] = r5; //write 1, i0 @ 3
r5.l = (a0 += r1.l * r6.l), r5.h = (a1 += r1.h * r6.h) || r1 = [i1++m2] || r2 = [i0--];//r2 = w3, i0 @ 2
	a0 = r2.l * r7.h, a1 = r2.h * r7.h || [i0++m3] = r5; //write 2, i0 @ 4
r5.l = (a0 += r1.l * r6.l), r5.h = (a1 += r1.h * r6.h) || r1 = [i1++m2] || r2 = [i0--];//r2 = w4, i0 @ 3
	a0 = r2.l * r7.h, a1 = r2.h * r7.h || [i0++m3] = r5; //write 3, i0 @ 5
r5.l = (a0 += r1.l * r6.l), r5.h = (a1 += r1.h * r6.h) || r1 = [i1++m2] || r2 = [i0--];//r2 = w5, i0 @ 4
	a0 = r2.l * r7.h, a1 = r2.h * r7.h || [i0++m3] = r5; //write 4, i0 @ 6
r5.l = (a0 += r1.l * r6.l), r5.h = (a1 += r1.h * r6.h) || r1 = [i1++m2] || r2 = [i0--];//r2 = w6, i0 @ 5
	a0 = r2.l * r7.h, a1 = r2.h * r7.h || [i0++m3] = r5; //write 5, i0 @ 7
r5.l = (a0 += r1.l * r6.l), r5.h = (a1 += r1.h * r6.h) || r1 = [i1++m3] || r2 = [i0--];// inc to x1(n-1) r2 = w1, i0 @ 6
	mnop || [i0++] = r5; //write 6.
{% endhighlight %}

This is described by Tim in the following diagram:

![image3]({{ site.baseurl }}/assets/tim_LMS.png){: .center-image }

Line 13-25 is the filtering stage. In line 16-22 samples from the past 7 channels are multiplied with their corresponding LMS weight to yield the filter output (the big summer in Tim's diagram), which is subtracted from current channel's input in `r0` and saved.

Line 26-44 is the LMS update stage, which proceeds in, according to Tim, "a pseudo-normalized LMS method". Instead of he canonical LMS weight update equation, we have

$$
\begin{align}
\vec{W_{k+1}} &= \vec{W_k} + \vec{X_k}*sign(\epsilon_k) \\
              &= r2*r7 + r1*r6
\end{align}
$$

Here, the old $$w_k$$ are loaded into `r2`. `r7` contains a weight-decay factor. If it's set to 0, LMS is effectively disabled as no weight update would happen and it becomes a fixed gain stage.

`r1` contains the saturated version of each reference channel's input. `r6` is the sign of the error term.

In this modified LMS approach, if both the error and sample are the same sign, the weight would increase (Hebb's rule). This implementation involves saturation and 1-bit weight updates, so it's not analytical. However, it is fast and according to Tim,

> in practice the filter settles to final weight values within 4s. The filter offers 40dB of noise rejection.

If at any time the error term $$\epsilon_k=0$$, that means the current channel can be completely predicted by the previous 7 channels, that means the current channel is measuring only noise. This could serve as a good debugging tool.

**Effects of removing LMS**

However, LMS is not included in the RHD-headstage. The effects are not too significant -- when all channels are either grounded or have signals applied, the acquired signals with and without LMS are not too different. When channels are left floating, however, the acquired signals show common oscillations as show below for the first three channels:

![image4]({{ site.baseurl }}/assets/radio_noise.png){: .center-image }

The first three channels were channels on different amplifiers that were left floating. The dominant oscillations is around 220Hz (the smaller faster frequency is due to radio-transmission problems solved later). Apparently this is due to the radio-control signals interference, since they are routed pretty close to the amplifiers. With LMS applied, this noise would've been filtered out and we would seen a very flat signal instead.
