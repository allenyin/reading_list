---
layout: post
title: "Wireless Headstage: AGC with Blackfin BF532 and Intan RHD2136"
date: 2015-12-24
comments: false
tags:
- BMI
- Wireless
- Blackfin
- Intan
- Microcontroller
- DSP
---

I have been working on improving our lab's [wireless headstage](http://github.com/tlh24/myopen) using Analog Device's Blackfin BF532, Intan's analog 32-channel amplifiers RHA2136, and Nordic's NRF24L01 2.4MHz transceivers. 
The improvement is replacing the RHA2136 with Intan's digital version, RHD2136. There are 4 RHA2136 per headstage in the original headstage, each of which requires a voltage regulator and ADC, both of which can be eliminated when using RHD2136. The resulting (ideally working) board would be half the size.

The PCBs have been made. I originally imagined the firmware changes to be minimal -- essentially changing how BF532 would talk to the amplifiers through SPI, while keeping most of the signal chain code constant. The code architecture should not have to change much.

However, it has proved to be a lot more difficult than the expected plug-and-play scenario. One of the first issues was to first get [Blackfins to talk to the Intans correctly via SPORT]. Then I ran into the problem where the original signal chain code in between sample conversions were too long and resulted in data corruption. Therefore, I need to pick parts of the signal chain to cut and modify.

This post documents my work to understand and adapt the integrator-highpass-AGC, the first stage of the signal chain.

**Background**

The general idea of this wireless system is that, we would acquire samples from four amplifiers at the same time, and then do processing on two of theses samples at a time. Signals at the different stages of the signal chain can be streamed to gtkclient - the PC GUI for display and for spike-sorting. The samples are displayed in a plexon-style interface, and templates are made using PCA. These templates are then sent back to the headstage. In the final firmware, at the end of the signal chain, template matching are done using those results, and a match (or a spike) is found if 16 samples on a given channel is within a certain "aperture" of the templates. (The template is a 16-point time-series. Aperture is the L1-norm of the difference between the template and the most recent 16-samples of the current channel) 

Because of this, it would be nice to keep the input signal to template matching at a stable level -- a signal with the correct spiking shape, but different signal amplitude may not be catagorized as a match. Thus enters [Automatic Gain Control (AGC)](http://en.wikipedia.org/wiki/Automatic_gain_control).

**Algorithm**

The basic idea is that, the user sets a reference level for the signal power. If the signal power is above this reference level, then decrease the front-end gain. If it is below, then increase it. There are all kinds of fancy implementation, including using different attack/release rate (different gain increasing/decreasing rate). In terms of embeded system, I find [this thread](www.dsprelated.com/showthread/comp.dsp/21943-1.php), and "TI DSP Applications With the TMS320 Family, Theory, Algorithms and Implementations Volume 2" (pages 389-403) to be helpful in understanding how it works.

Tim describes the firmware in his [thesis, page 162](http://m8ta.com/tim/dissertation.pdf):
> Four samples from each of the 4 ADCs are read at once; as the blackfin works efficiently with two 16-bit samples at once, two samples (from two of the 4 headstages) are then processed at a time. These two come in at 12 bits unsigned, and must be converted to 1.15 signed fixed-point, which is done by pre-gain (usually 4) followed by an integraotr highpass stage. The transfer function of the high pass stage is H(z)=4(1-z^-1)/(1-z^-1(1-mu)); the normal value of mu is 800/16384 [...] This is followed by an AGC stage which applies a variable gain 0-128 in 7.8 fixed-point format; the absolute value of the scaled sample is compared to the AGC target (stored as the square root to permit 32-bit integers) and the difference is saturated at 1 bit plus sign. This permits the gain to ramp from 0 to 127.999 in 2^15 clocks.

The accompanying diagram is shown below:

![image1]({{ site.baseurl }}/assets/tim_AGC.png){: .center-image }


Below is the firmware related to this part - it is obvious now I understand how it works, and Tim's thesis explanations now makes perfect sense (it did before, but they seemed more like clues to an elaborate puzzle).

{% highlight asm %}
1 |     //read in the samples -- SPORT0
2 |     r0 = w[p0] (z); // SPORT0-primary: Ch0-31
3 |     r1 = w[p0] (z); // SPORT0-sec:     Ch32-63
4 |     r2.l = 0xfff;
5 |     r0 = r0 & r2;
6 |     r1 = r1 & r2;
7 |     r1 <<= 16;  //secondary channel in the upper word.
8 |     r2 = r0 + r1;
9 |        
10|     //apply integrator highpass + gain (2, add twice)).
11|     r5 = [i0++]; //r5 = 32000,-16384. (lo, high)
12|    .align 8
13|        a0 = r2.l * r5.l, a1 = r2.h * r5.l || r1 = [i1++]; // r1 = integrated mean
14|        a0 += r2.l * r5.l, a1 += r2.h * r5.l || r6 = [i0++]; //r6 = 16384 (0.5), 800 (mu)
15|        r0.l = (a0 += r1.l * r5.h), r0.h = (a1 += r1.h * r5.h) (s2rnd);
16|        a0 = r1.l * r6.l , a1 = r1.h * r6.l; //integrator
17|        r2.l = (a0 += r0.l * r6.h), r2.h = (a1 += r0.h * r6.h) (s2rnd)
18|
19|        /*AGC*/	|| r5 = [i1++] || r7 = [i0++]; //r5 = gain, r7 AGC targets (sqrt)
20|        a0 = r0.l * r5.l, a1 = r0.h * r5.h || [i2++] = r2; //save mean, above
21|        a0 = a0 << 8 ; // 14 bits in SRC (note *4 above), amp to 16 bits, which leaves 2 more bits for amplification (*4)
22|        a1 = a1 << 8 ; //gain goes from 0-128 hence (don't forget about sign)
23|        r0.l = a0, r0.h = a1 ;  //default mode should work (treat both as signed fractions)
24|        a0 = abs a0, a1 = abs a1;
25|        r4.l = (a0 -= r7.l * r7.l), r4.h = (a1 -= r7.h * r7.h) (is) //subtract target, saturate, store difference
26|            || r6 = [i0++]; //r6.l = 16384 (1), r6.h = 1 (mu)
27|        a0 = r5.l * r6.l, a1 = r5.h * r6.l || nop; //load the gain again & scale.
28|        r3.l = (a0 -= r4.l * r6.h), r3.h = (a1 -= r4.h * r6.h) (s2rnd) || nop; //r6.h = 1 (mu); within a certain range gain will not change.
29|    .align 8
30|        r3 = abs r3 (v) || r7 = [FP - FP_WEIGHTDECAY]; //set weightdecay to zero to disable LMS.
31|        r4.l = (a0 = r0.l * r7.l), r4.h = (a1 = r0.h * r7.l) (is) || i1 += m1 || [i2++] = r3;
32|                    //saturate the sample (r4), save the gain (r3).
{% endhighlight %}

Line 2-8 stores the 12-bit samples in the LO and HI 16-bits of r2.

Line 13 and 14 implement the pre-gain. r5.l=32000=0x7d00 is 0.9765625 in Q15. Multiplying a 12-bit number by 0x7d00 in blackfin's default mode is equivalent of converting the 12-bit UNSIGNED sample into signed Q15 format. This IS VERY IMPORTANT as I shall see later. Line 14 does it again and then add to the original result. This means by line 15, a0 and a1 contains the original samples multiplied by 2 (although r5.l should really be 0x7fff, which is closer to 1 than 0x7d00 in Q15).

Line 15: **r1.l=integrated mean, r5.l=-16384=(Q15) -0.5**. The multiply-accumulate (MAC) mode is s2rnd. So, in algebraic form, at the end of the instruction, **a0=2x-0.5m[n-1]. r0.l=2*a0=4x-m[n-1].** Here x is the incoming sample, and m[n-1] is the previous integrated mean. Note that since x is 12-bits, then a0 and r0 are at most 14-bits, therefore still positive in Q15 format. Finally, r0 here is actually the output of the integrator-highpass stage (call it y), as also indicated by the diagram.

Line 16: As the comment hints, loads 0.5*m[n-1] into the accumulator. Both numbers are in Q15, the result in the accumulator is Q31.

Line17: From line 15, we have **r0=4x-m[n-1]. r6.h=mu=800=(Q15)0.0244140625**, which is a constant used to get the desired high-pass response. At the end of this instruction, **a0=0.5*m[n-1]+mu*(4x-m[n-1])**. 

Since the 40-bit accumulator value is extracted into r2 with (s2rnd) mode, we have r2.l and r2.h to be 

**2(0.5*m[n-1]+mu*(4x-m[n-1]))=m[n-1]+2*mu*(4x-m[n-1])**. 

As the comment in line 20 hints, this is the new mean.

To characterize the behavior of this integrator-filter stage, we have the following two equations:

\begin{aligned}
m &= mz^{-1}(1-2\mu)+8\mu x \\\\
y &= 4x-mz^{-1}
\end{aligned}

where m is integrated mean, 1/z is delay, x is the original 12-bit samples, y is the output. Note again that since x is 12-bit unsigned, conversion into Q15 does not change anything, therefore the system equations are easy to derive:

\begin{aligned}
\frac{Y}{X} &= 4 \frac{1-z^{-1}}{1+z^{-1}(2\mu-1)}
\end{aligned}

The gain is 4, and the 3dB point is determined by \\(z=1-2\mu\\). In the code \\(\mu\approx 0.0244\\), so \\(z=0.9512\\). Note also, in Tim's thesis, \\(\mu\\) is actually \\(0.0488\\), this is because (s2rnd) was used in the actual implementation.

Line 20-23 is the first step of AGC, and is pretty tricky. r5 contains the AGC gain, which as described in the thesis is Q7.8 format (really Q8.8, but we never have negative gain here).

Line 20 multiplies r0 with the AGC gain. But the default mode of multiplication treats both numbers as Q15 fractions, the value inside the accumulator is Q31 and will not be correct. In Q31, the decimal point is after bit 31. But when a Q15 number multiplies a Q7.8 number, there are 15+8=23 fractional bits, and the decimal point is in fact after bit 23. 

Therefore, before we can extract the resulting 16-bit number in line 23 (MAC to half-register), we have to shift the results in accumulator by 8. Since the default extraction option takes bit 31-16 after rounding, we get the correct 16-bit results. One questions might be, the result of Q15 and Q7.8 multiplication also have 9 integer bits. In the shift-and-extraction operation, we are essentially throwing away 8 of these integer bits. Turns out the gain is never very big for this to matter (in other words, Q7.8 gives a big range of available gain, but this range is probably not needed). 

Finally, r0 in line 23 is the output of the AGC stage.

Important to note here **r0 in line 20 is the difference between the new samples and the previous integrated mean**, therefore when we take the absolute value of the accumulators in line 21 and line 23, we are essentially getting a measurement of the sigal envelope's amplitude. And the goal of AGC is to adjust the gain so the signal envelope stays within a target range. **This is a very important point**. Since Intan implements a highpass DSP filter onboard, I initially thought I could skip the integrator-highpass stage, and plug in the AGC code directly to process the incoming samples. But I simply got rubbish, because the instanteous signal value is not a good measurement of the signal power. **The integrator is required** to obtain the mean and for this specific AGC implementation to work.

Line 25 does a clever bit of MAC trick. a0 contains the difference of the signal level and the target level. Note that the target level is stored in memory as the square root of the value. Using the (is) mode treats both all numbers involved as signed integer, and the extraction will either be 0x8000 or 0x7fff, for a negative or positive difference. This is significant since 0x8000 and 0x7fff are respectively the smallest negative number and greatest positive number that can be represented in Q15, and allows us to update our AGC gain without doing any if-statement style conditions.

In line 26, r6.h=1 is not the value of mu, but simply indicates whether we have enabled AGC.

Line 27 and line 28 involve yet another fixed-point trick. These two lines updates the AGC gain. The **AGC gain in r5** is loaded into the accumulator by multiplying 0x4000 (16384). Afterwards, the MAC with s2rnd option subtract either 0x8000 or 0x7fff from it. This whole procedure is the equivalent of either adding \\(2^{-8}\\) or subtracting \\(2^{-7}\\) from the Q7.8 value of the original AGC gain.

The key is noticing that multiplying a Q7.8 number by 0x4000 while treating both as Q15 numbers, then extracting the resulting Q31 number in s2rnd mode, results in a 16-bit number that has the same Q7.8 value as before. This can be demonstrated by the following lines using functions defined in [AGC_sim.py](https://github.com/allenyin/allen_wireless/blob/master/myopen_multi/headstage2_firmware/AGC_sim.py):

{% highlight python %}
gain = 52                               # original gain
Q8_gain = int(decimal_to_Q8_8(52),16)
acc_val = int(decimal_to_Q1_31(hex_to_Q15(Q8_gain) * hex_to_Q15(16384)),16)
final_gain = mult_acc_to_halfReg(acc_val, 0, 0, 'sub', 's2rnd')
final_gain = hex_to_Q8_8(final_gain)    # should be 52 again.
{% endhighlight %}

In line 30, we simply take the absolute value of r3, which contains the new AGC gain, just to be safe.

**Implementation for Intan**

Understanding that the integrator stage is required for the AGC to work was crucial. Initially giving the unsigned 16-bit Intan samples to the AGC stage (starting around line 20), I simply got rail-to-rail oscillations that didn't make any sense.

Adding the integrator stage, however, still gave me similar results, but less oscillations. The key to solving this is to realize the original code was written to work with 12-bits unsigned samples. I wish this was emphasized more in the thesis, or perhaps I was just too n00b to realize the significance here.

Since the incoming samples from Intan are 16-bits unsigned in offset binary format -- reference value is 0x8000, 0 volts would be 0x0000, and VDD is 0xffff, the conversion step in line 13 by multiplying 0x7fff will often result in a negative result. For example, treating both 0x8000 and 0x7FFF as Q15 numbers, the product is close to -1. Thus the result mean would be -2, rather than 0 (since 0x8000 means signal value at reference voltage). Further, this sign flip would result in new values with different amplitude from the original values.

There are two solutions to this problem:

1. Right-shift the incoming 16-bit unsigned binary offset samples to 12 bits. Do this right after line 8, and the rest of the code stays unchanged. This approach the least changes to the old firmware (of course, line 1-8 need to be altered to work with Intan, but that's not algorithmic).

2. RHD2136 is capable of outputting the ADC samples in 16-bit signed, two's complement format. This would solve the above mentioned problem of inadvertently flipped signs, since the samples will already in Q15 format. But this would also require changing the integrator-highpass stage, to obtain the same behavior. Specifically, in the system function, there is a pre-gain of 4 in front. This is a result of the line 14, and the two s2rnd operations in line 15 and line 17.

    Now that our samples are full 16-bits, we do not need the extra gain. This requires changing the coefficient values in:  
      * r5 in line 11: from r5.l=0x7fff, r5.h=0xc000 to r5.l=0x7fff, r5.h=0x8000.
      * r6 in line 14: from r6.l=0x4000, r6.h=800 to r6.l=0x7fff, r6.h=1600.
 
    In addition to deleting line 14, and changing the MAC option from (s2rnd) to default in line 15 and line 17. 

I ended up using the second approach, because I don't like throwing away bits. But both works.

