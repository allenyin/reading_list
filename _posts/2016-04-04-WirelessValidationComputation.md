---
layout: post
title: "Wireless Headstage: Validation of signal quality III - Computation and Methods"
date: 2016-4-4
comments: false
tags:
- BMI
- Wireless
- Blackfin
- DSP
- Spike_train_analysis
- Distance_measures
---

Some computation problems/notes I encountered while implementing the metrics. [Code](https://github.com/allenyin/recording_validation)

**Victor Purpura Distance**

Victor-Purpura's [MATLAB implementation](http://www-users.med.cornell.edu/~jdvicto/spkdm.html), adapted from the Seller algorithm of DNA sequence matching, while having $$O(N_i N_j)$$ performance runs pretty slow.

For a test comparison of two spike trains, one with 8418 spike times and the other with 9782 spike times, it takes around 75 seconds. A bit too long. On Victor's page, there are a few other Matlab implementations, but only deal with parallelizing calculations with different cost of shifting a spike. The mex function has weird usage. So I tried translating the algorithm into Julia and calling it from Matlab. The result is [spkd_qpara.jl](https://github.com/allenyin/recording_validation/blob/master/analysis/spkd_qpara.jl):

Pretty straight forward. Importing my spike time vectors into Julia and running the function, it takes about 1.07 seconds, a significant speed-up. However, most of my analysis, plotting, and data are in Matlab, so I would like to call Julia from Matlab. This functionality is provided by [jlcall](https://github.com/twadleigh/jlcall).

Configuration through running `jlconfig` as instructed in the README was smooth, except for the message:

> Warning: Unable to save path to file '/usr/local/MATLAB/R2015a/toolbox/local/pathdef.m'. You can save your path to a different location by calling SAVEPATH with an input argument that specifies the full path. For MATLAB to use that path in future sessions, save the path to 'pathdef.m' in your MATLAB startup folder. 
> > In savepath (line 169)
>   In jlconfig (line 100) 

Warning most likely related to my machine.

Using any methods from `Jl.m`, however, was not. I received the error: 
`Invalid MEX-file '/home/allenyin/.julia/v0.4/jlcall/m/jlcall.mexa64': libjulia.so: cannot open shared object file: No such file or directory`. 

So it seems Matlab cannot find the `libjulia.so`. This is documented [`jlcall`'s bug list](https://github.com/twadleigh/jlcall/issues/2). 

Simple fix is as suggested in the message thread: in Matlab do 
`setenv('LD_RUN_PATH', [getenv('LD_RUN_PATH'), ':', '/usr/lib/x86_64-linux-gnu/julia')` 
before running the `jlconfig` script. The path given is the location of the so file.

Now to call `victorD` from Matlab, do:

{% highlight matlab linenos=table %}
Jl.include(`spkd_qpara.jl');
Jl.call('victorD', spikeTimes1, spikeTimes2, 200);
{% endhighlight %}

The second call takes 1.41 seconds.

**Van Rossum Distance**

Paiva 2009 derived a computational effective estimator with order $$O(N_iN_j)$$ for the VR-distance:

$$d_{vR}(S_i,S_j)=\frac{1}{2}[\sum_{m=1}^{N_i}\sum_{m=1}^{N_i}L_{\tau}(t_m^i-t_n^i)+\sum_{m=1}^{N_j}\sum_{m=2}^{N_j}L_{\tau}(t_m^j-t_n^j)]+\sum_{m=1}^{N_i}\sum_{n=1}^{N_j}L_{\tau}(t_m^i-t_n^j)$$,

where $$L_{\tau}(\cdot)=exp(-abs(\cdot)/\tau)$$ is the Laplacian kernel. However, this formula is wrong. By inspection we can see that this distance will never be 0 since it is a sum of exponentials. Further sample calculation for distance between less similar spike trains may even yield smaller distance! These problems can be corrected by changing the sign of the last summation term. Unfortunately, this *typo* occurs in (Paiva et al., 2007) as well as Paiva's PhD thesis. However, as I can't derive the formula myself (there must be some autocorrelation trick I'm missing), I don't trust it very much.

It is nevertheless, a much more efficient estimator than the naive way of taking the distance between convolved spike trains, and does not depend on time discretization.

Thomas Kreuz has [multiple van Rossum](http://wwwold.fi.isc.cnr.it/users/thomas.kreuz/Source-Code/VanRossum.html) Matlab code posted on his website, but they don't work when $$\tau<20ms$$.

**Schreiber Distance**

This dissimilarity measure also have a data-effective method of $$O(N_iN_j)$$, given in Paiva 2010.

$$d_{CS}(S_i, S_j)=1-\frac{\sum_{m=1}^{N_i}\sum_{n=1}^{N_j}exp[-\frac{(t_m^i-t_n^j)^2}{2\sigma^2}]}{\sqrt{(\sum_{m,n=1}^{N_i}exp[-\frac{(t_m^i-t_n^i)^2}{2\sigma^2}])(\sum_{m,n=1}^{N_j}exp[-\frac{(t_m^j-t_n^j)^2}{2\sigma^2}])}}$$

**Generating Test Signals**

Signals were generated using Leslie Smith and Nhamoinesu Mtetwa's [Noisy Spike Generator MATLAB Software v1.1 (NSG)](http://www.cs.stir.ac.uk/~lss/noisyspikes/) using [makeReferenceSignals.m](https://github.com/allenyin/recording_validation/blob/master/analysis/makeReferenceSignals.m).

Sampling rate was set to 31250Hz since that is the sample rate of the wireless headstages. This frequency is greater than the maximum Plexon ADC frequency of 20,000Hz, but offline analysis may simply use interpolation.

Notes on using this toolbox:

1. The main script `generatenoisysamples.m` outputs a final signal that includes noise from uncorrelated spike noise, correlated spike noise, and Gaussian noise. The `NoiseSNR` only sets the Gaussian noise level. As this validation is on recording quality, not spike sorting algorithm, I [modified](https://github.com/allenyin/recording_validation/blob/master/NoiseModellingv1point1/generatenoisysamples.m#L546) that script to not include the uncorrelated and correlated spike noise in the final output.

2. While the manual of the toolbox claims that the spike duration can be changed by changing the `T_Delta_Integrate` and `N_Delta_integrate` parameters (spike duration is `T_Delta_Integrate X N_Delta_Integrate`). However, changing these parameters simply changes how many samples it takes from a pre-generated template file. These template files were generated by the author and the script used was not available. Regardless, the default spike duration of ~1.8ms, while longer than most motor cortex spikes we encounter, can still be sorted and detected by all three systems teseted.

**Aligning Reference with Recording**

After the reference signals are generated, they are converted to .wav files with Fs=31250Hz. All audio signals (including those with two distinct spikes firing) are available on [soundcloud](https://soundcloud.com/dagolix/sets/recording-validation-signals). The audio signals then goes through the [Plexon headstage test board](http://www.plexon.com/products/headstage-tester-units), to which the wireless and plexon headstage may connect.

As mentioned in [Validation of signal quality I]({% post_url 2016-03-27-WirelessValidationPktLoss %}), since the reference signal and the recording cannot be started and stopped at exactly the same time, some alignment needed to be done before applying the spike train measurements.

The reference and recording are aligned in the start by aligning the peak of the first spike in the reference with that of the recording. I use the recorded analog waveform, rather than the recorded spike times for alignment because the first spike may not be detected, and it's easier to examine the alignment quality visually from the analog waveforms.

The first spike peak of the reference signal is easily found by doing peak-finding on a 5ms window after the first spike-time (which is known). The spike times generated by NSG marks the beginning of a spike, not the peak.

When SNR is high, peak-finding on the recording can also find the peak of the first recorded spike pretty easily. But with lower SNR, the noise level gets higher and the `MinPeakHeight` parameter of MATLAB's `findpeaks()` must be adjusted so that a noise peak is not being mistaken for a signal peak. Of course, it's not always possible to align two signals, contributing to bad spike train comparison. The best `MinPeakHeight` for found this way for each recorded signal is in [compare_signals.m](https://github.com/allenyin/recording_validation/blob/master/analysis/compare_signals.m#L11-L17). The script [checkAlignment.m](https://github.com/allenyin/recording_validation/blob/master/analysis/checkAlignment.m) helps with that.

For the end of the recording signal - sometimes when I don't stop the input audio signal in time, extra signal is recorded. Thus after alignment, I cut the recording to within 102 seconds of the alignment start.


