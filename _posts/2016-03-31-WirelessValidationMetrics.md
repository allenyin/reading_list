---
layout: post
title: "Wireless Headstage: Validation of signal qualit II"
date: 2016-3-31
comments: false
tags:
- BMI
- Wireless
- Blackfin
- DSP
- Spike_train_analysis
- Distance_measures
---

Measures used include:

1. Victor-Purpura
2. Van Rossum
3. Schreiber cross-correlation
4. Binned cross-correlation

Victor-Purpura's [MATLAB implementation](http://www-users.med.cornell.edu/~jdvicto/spkdm.html), which is adapted from the Seller algorithm of DNA sequence matching, is pretty slow:

{% highlight matlab linenos=table %}
function d=spkd(tli,tlj,cost)

%% d=spkd(tli,tlj,cost) calculates the "spike time" distance
%% (Victor & Purpura 1996) for a single cost
%%
%% tli: vector of spike times for first spike train
%% tlj: vector of spike times for second spike train
%% cost: cost per unit time to move a spike
%%
%%  Copyright (c) 1999 by Daniel Reich and Jonathan Victor.
%%  Translated to Matlab by Daniel Reich from FORTRAN code by Jonathan Victor.
%%
    nspi=length(tli);
    nspj=length(tlj);

    if cost==0
        d=abs(nspi-nspj);
        return
    elseif cost==Inf
        d=nspi+nspj;
        return
    end

    scr=zeros(nspi+1,nspj+1);
    %
    %     INITIALIZE MARGINS WITH COST OF ADDING A SPIKE
    %
    
    scr(:,1)=(0:nspi)';
    scr(1,:)=(0:nspj);
    if nspi & nspj
        for i=2:nspi+1
            for j=2:nspj+1
                scr(i,j)=min([scr(i-1,j)+1 scr(i,j-1)+1 scr(i-1,j-1)+cost*abs(tli(i-1)-tlj(j-1))]);
            end
        end
    end
    d=scr(nspi+1,nspj+1);
end
{% endhighlight %}

For my comparison of two spike trains, one with 8418 spike times and the other with 9782 spike times, it takes around 75 seconds. A bit too long. On Victor's page, there are a few other Matlab implementations, but only deal with parallelizing calculations with different cost of shifting a spike. The mex function has weird usage. So I tried translating the algorithm into Julia and calling it from Matlab. The result is [spkd_qpara.jl](https://github.com/allenyin/recording_validation/blob/master/analysis/victorD.jl):

{% highlight julia linenos=table %}
function spkd_qpara(tli, tlj, costs)
    nspi = length(tli);
    nspj = length(tlj);
    if costs == 0
        d = abs(nspi-nspj);
        return
    elseif costs==Inf
        d = nspi+nspj;
        return
    end

    scr = zeros(nspi+1, nspj+1);
    scr[:,1] = (0:nspi)';
    scr[1,:] = (0:nspj);
    scr_new = zeros(1, nspi+1, nspj+1);
    scr_new[1,:,:] = scr;
    scr = scr_new;
    scr = repeat(scr, outer=[length(costs),1,1]);
    if nspi>0 && nspj>0
        for i=2:nspi+1
            for j=2:nspj+1
                scr[:,i,j]=min(cat(3, scr[:,i-1,j]+1, scr[:,i,j-1]+1, scr[:,i-1,j-1]+costs'*abs(tli[i-1]-tlj[j-1])),[],3);
            end
        end
    end
    d = scr[:,nspi+1,nspj+1];
end
{% endhighlight %}


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

