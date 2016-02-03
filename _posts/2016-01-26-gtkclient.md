---
layout: post
title: "Wireless Headstage: gtkclient notes"
date: 2016-1-26
comments: false
tags:
- BMI
- Wireless
- Blackfin
- Micrcontroller
---

[Wireless Project github](https://github.com/allenyin/allen_wireless)

How gtkclient works:

* Bridge gets assigned DHCP IP address.
* gtkclient multicast socket receives bridge messages `neurobrg`.
* Upon receiving that message, gtkclient assigns that bridge to one of the pre-determined radio channels.
* The bridge then starts receiving wireless packets on the assigned radio channel.

gktclient spawns `sock_thread` to take care of each bridge. Previously, the array holding the detected bridge IP addresses was not locked, this means it's sometimes possible for two threads to be assigned to handle the same bridge, which at best leaves us with 1 operational radio channel, and at worst we will not get any transmission. This can be solved by mutex-locking the shared array. In general, proper threading can be used to solve gtkclient-bridge communication issues.

-------------

**Dropped packets tracking**

In bridge firmware:

* When bridge starts, it keeps a flag `g_nextFlag` which says what the echo of the next packet should be.

* This echo value is extracted by `getRadioPacket()` in `test_spi.c`.

* If `flag>g_nextFlag`, we know a packet has been dropped. The total number of dropped packet, `g_dropped` increment by `flag-g_nextFlag` and is sent to gtkclient.

* gtkclient also keeps track of this `g_dropped` statistic in `g_dropped[tid]`, where `tid` corresponds to the different headstages we are communicating with. If the echo flag of the newly received packet is greater than that in `g_dropped[tid]`, then the value in array is replaced by that echo flag. The difference between the new echo flag and the old value is then added to `g_totalDropped`.

---------------

**Waveform display**

Each received wireless packet has 24 bytes of waveform data nd 8 bytes of template matching data. The waveform data is in fact 6 consecutive samples from 4 different channels, each sample is one byte in size. However, it is important to know how we are supposed to interpret this byte value before plotting.

In my earliest iteration of `radio_basic.asm` firmware, I am simply saving the high byte of the 16-bit sample acquired from the RHD2132. The amplifiers were configured to transmit the samples in offset-binary, meaning the most negative voltage with respect to the reference electrode is represented by 0x0000, the most positive 0xffff, and the reference voltage is 0x7fff. Therefore, I would want to treat the byte extracted from the packet as an `unsigned char`. The waveform plot window has vertical range of [-1,1], therefore to plot, I had mapped the unsigned char range [0,255] to [-1,1].

In later firmware iterations, AGC and IIR filter outputs are transmitted. Those samples, however, have to be interpreted as `signed char`. This is because the samples collected were converted to signed Q1.15 before going through the signal-chain process, and therefore the outputs ended up in signed two's complement format as well. 

Although the location of the decimal point varied depending on what the value transmitted is. For example, the AGC gain is Q7.8, therefore the decimal point is at the end of the most significant byte being transmitted. In comparison, the result of IIR filter is Q1.15, so the decimal point is after the most significant bit of the byte transmitted in that case. But since we are never mixing displaying waveforms in different format, this is not too important, just have to keep in mind when interpreting the waveforms plotted. Although practically speaking, the shape of the waveforms is the most important for spike-sorting, debugging, etc.

In those cases, to plot, I had to map the signed char range [-128,127] to [-1,1], which is a different function from the signed char mapping.

The gtkclient by default used the signed char mapping. Therefore when I first transmitted Intan data as unsigned data, the waveforms plotted were simply rail-to-rail oscillations due to value-wrappings. There are two ways to allow displaying both Intan data and the signal chain data appropriately:

1. Changed the mapping based on what part of the siganl chain gtkclient has selected from the headstage to transmit.

2. Configure the RHD2132 to transmit samples in two's complement format. This actually simplifies the AGC stage. Since the signed 16-bit samples can be treated as Q1.15 numbers right-away, we skip a step of conversion from unsigned to signed fixed-point. With this method, gtkclient can use the signed char mapping to display all parts of the signal chain.

--------------------

**Multicast Problems**

This problem happened during a demo of the wheelchair experiment using RHA-headstages, with RHA-gtkclient running on Daedalus. A router was used rather than a switch at a time. Despite router configurations to not filter multicast traffic, the bridges were not able to be detected by gtkclient.

UDP sockets opened by gtkclient:

* 4340, and 4340+radio_channel are the bcastsock to detect bridges. This is what we are interested in for the bridge problem.
* 4343: TCP server socket to receive BMI3 connections
* 8845: Strobe socket

Steps:

1. Used `ss -u -a`  to check what multicast sockets are open.
2. Monitor multicast traffic via wireshark: 

    `sudo tshark -n -V -i eth0 igmp`
    
    Surprisingly, after executing this command, we started to receive bridge packets and gtkclient started working again. 

I wasn't able to duplicate this scenario on other systems...

[Stackoverflow thread](http://stackoverflow.com/questions/32280563/how-can-i-diagnose-this-strange-multicast-issue)

