---
layout: post
title: "Wireless Headstage: Implementing direct-form I biquad IIR filters"
date: 2016-1-6
comments: false
tags:
- BMI
- Wireless
- Blackfin
- Intan
- Microcontroller
- DSP
---

Continuing to add on to the RHD headstage's signal chain, I have to cut down on the number of biquads used to implement the butterworth bandpass filters on the Blackfin. The original code uses four back-to-back biquads to implement 8-pole butterworth filter.

The reason for using butterworth filter is because of the maximal flat passband. The reason for using back-to-back biquads rather than a big-chain (i.e. naively implementing the transfer function) is because each biquad uses only one summer, maximizing efficiency on embedded systems.

![DF2-biquad]({{ site.baseurl }}/assets/DF2_biquad.png)

DF2-biquad

![DF1-biquad]({{ site.baseurl }}/assets/DF1_biquad.png)

DF1-biquad

Most commonly, Direct Form II biquads are used in implementations. However, as [this great paper](m8ta.com/images/584_1.pdf) suggests, Direct Form II biquads have extra limitations on the coefficient range. Therefore, Direct Form I biquads are more desirable in 16-bit fixed-point applications. The paper does point out instability issues of DF1-based IIR filters. 

A lot of the original implementation rationale of the filters have been discussed in [Tim's post from a long time ago](m8ta.com/index.pl?pid=438), although his post was deriving elliptic filters.This post will mostly talk about how to generate the coefficients for the filters given the following assembly code structure:

{% highlight asm linenos=table %}
r5 = [i0++] || r1 = [i1++];  // r5=b0(LPF), r1=x0(n-1); i0@b1(LPF), i1@x0(n-2)
a0 = r0.l * r5.l, a1 = r0.h * r5.h || r6 = [i0++] || r2 = [i1++];    // r6=b1(LPF), r2=x0(n-2)
a0 += r1.l * r6.l, a1 += r1.h * r6.h || r7 = [i0++] || r3 = [i1++];  // r7=a0(LPF), r3=y1(n-1)
a0 += r2.l * r5.l, a1 += r2.h * r5.h || r5 = [i0++] || r4 = [i1++];  // r5=a1(LPF), r4=y1(n-2)
a0 += r3.l * r7.l, a1 += r3.h * r7.h || [i2++] = r0;                 // update x0(n-1), i2@x0(n-2)
r0.l = (a0 += r4.l * r5.l), r0.h = (a1 += r4.h * r5.h) (s2rnd) || [i2++] = r1; // r0=y1(n), save x0(n-2)
{% endhighlight %}

This code is the most efficient implementation of DF1-biquad on Blackfin. To implement new filters, we need to

1. Get new filter transfer function.
2. Factor the transfer function into biquad forms.
3. Make biquad coefficients into correct fixed-point format.

Note that since we are only implementing filters that are cascades of biquads, that means any filters that we implement must contain an even number of poles. 

There are two approaches for step 1 and 2. Approach 1 is easier for making filters low number of poles. Approach 2 is easier for high number of poles.

**Approach 1**

Since I only have enough code-path to implement two biquads (instead of four as Tim did), I need one LPF biquad and one HPF biquad. The filter can be designed by:

{% highlight matlab linenos=table %}
fs = 31250; % sampling frequency

% 2nd order butterworth LPF, cutoff at 9kHz
fc_LPF = 9000;
wn_LPF = (fc_LPF/fs)*2;  % normalized cutoff frequency (units=pi rad/sample)
[b_LPF, a_LPF] = butter(2, wn_LPF, 'low');  % descending powers of z, const firstA

% b_LPF = [0.3665, 0.7329, 0.3665]
% a_LPF = [1, 0.2804, 0.1855]

% 2nd order butterworth HPF, cutoff at 500Hz
fc_HPF = 500;
wn_HPF = (fc_HPF/fs)*2;
[b_HPF, a_HPF] = butter(2, wn_HPF, 'high');

% b_HPF = [0.9314, -1.8628, 0.9314]
% a_HPF = [1, -1.8580, 0.8675]

% plot freq-response of bandpass filter
fvtool(conv(b_LPF,b_HPF), conv(a_LPF, a_HPF));
{% endhighlight %}

The transfer function of a biquad is \\(H(z)=\frac{Y}{X}=\frac{b_0+b_1z^{-1}+b_0z^{-2}}{1-a_0z^{-1}-a_1z^{-2}}\\). However, the coefficients generated by the *butter()* function follows the form \\(H(z)=\frac{Y}{X}=\frac{b(1)+b(2)z^{-1}+b(3)z^{-2}}{a(1)+a(2)z^{-1}+a(3)z^{-2}}\\), so we need to reverse the sign of the last two values in *a_LPF* and *b_LPF*.

To make the generated coefficients into the actual values used on Blackfin, we need to be mindful of how many bits they should be. Since the result of the biquad (line 6 from the assembly snippet) uses the (s2rnd) flag, the result of the summer must be Q1.14 (so s2rnd result is Q1.15). This means all coefficients must be within Q1.14 (and hopefully can be represented as such):

{% highlight matlab linenos=table %}
b_LPF_DSP = round(b_LPF*2^14);    % result is [b0,b1,b0]
a_LPF_DSP = round(a_LPF*2^14)*-1; % result is [dont-care, a0, a1]
% b0=6004, b1=12008, a0=-4594, a1=-3039

b_HPF_DSP = round(b_HPF*2^14);
a_HPF_DSP = round(a_HPF*2^14)*-1;
% b0=15260, b1=-30519, a0=30442, a1=-14213
{% endhighlight %}

These resulting coefficients are what I ended up using in the firmware.

As mentioned in Tim's post, if the inputs were of less than 16-bits, the scaler value can be something other than \\(2^{14}\\) to increase the gain and expand the results to the full 16-bits range. For example, if the input to the biquad were 12-bits, we can incorporate a scale factor of x2 into the first biquad, and x4 into the second:

{% highlight matlab linenos=table %}
b_LPF_DSP = round(b_LPF*2^14*2);    % x2 scale factor
a_LPF_DSP = round(a_LPF*2^14)*-1;

b_HPF_DSP = round(b_HPF*2^14*2^2);  % x4 scale factor
a_HPF_DSP = round(a_HPF*2^14);
{% endhighlight %}

By multiplying the b-coefficients, different scale factor can be applied. However, the resulting coefficients must be clamped within 15-bits, i.e. [-32768, 32767]. This is the mechanism by which gtkclient changes the signal gain on Tim's headstage. It is not applicable to my version of headstage, because the raw samples are alreayd 16-bits.

**Approach 2**

The above approach is fine when we need one LPF biquad and one HPF biquad. But say we need an 8th-order buttworht bandpass filter, using the above approach we would need two HPF biquads and two LPF biquads. We can't simply use two of the same HPF biquads and two of the same LPF biquads. The resulting bandpass filter will have less bandwidth between the -3dB points (two poles at same frequency means sharper roll-off from that point on).

The solution then, requires us to factor the generated transfer function:

{% highlight matlab linenos=table %}
% design butterworth filter, and derive coefficients for
% the cascade of two direct-form I biquads

fs = 31250;
% 8th order butterworth bandpass filter
% B and A in descending order of z
[B,A] = butter(4, [1000,9000]/(fs/2), 'bandpass');

% Factor the numerator and denominator.
% First get the roots of num and den: for roots
rB = roots(B);
rA = roots(A);

% get the polynomials for each biquad, each from two (conjugate) roots
% abs to take care of round-off errors - product of conjugate roots cannot be imaginary.
pB1 = abs(poly(rB(1:2)));    % num
pA1 = abs(poly(rA(1:2)));    % den

pB2 = abs(poly(rB(3:4)));
pA2 = abs(poly(rA(3:4)));

pB3 = abs(poly(rB(5:6)));
pA3 = abs(poly(rA(5:6)));

pB4 = abs(poly(rB(7:8)));
pA4 = abs(poly(rA(7:8)));

final_num = conv(conv(pB1,pB2),conv(pB3,pB4));
final_den = conv(conv(pA1,pA2),conv(pA3,pA4));
fvtool(final_num, final_den);   % plot resulting biquad cascade behavior

% convert to fixed point coefficients (Q1.14)
% b1(1) and a1(1) are the highest-order terms.
b1 = round(pB1*2^14);
a1 = round(pA1*2^14)*-1;

b2 = round(pB2*2^14);
a2 = round(pA2*2^14)*-1;

b3 = round(pB3*2^14);
a3 = round(pA3*2^14)*-1;

b4 = round(pB4*2^14);
a4 = round(pA4*2^14)*-1;
{% endhighlight %}

Ironically, the filtering behavior looks better for the 4th-order filter generated from Approach 1, shown below left is the 4th-order biquad cascades. Right is the 8th-order biquad (4 of them) cascades from Approach 2. 

![butterworth_comparison]({{ site.baseurl }}/assets/butterworth_comparison.png){: .center-image }

In the 8th-order filter, the HPF filter disappeared..not sure why?