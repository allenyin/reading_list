---
layout: post
title: "Wireless Headstage: Blackfin BF532 communcation with Intan RHD2136 via SPI simulation via SPORT"
date: 2015-12-25
comments: false
tags:
- BMI
- Wireless
- Blackfin
- Intan
- Microcontroller
---

- Motivation for using SPORT to emulate SPI
- Intan SPI protocol
- SPORT capabilities.
- Possible configurations and problems
- Testing...
    - JTAG and Intan_setup_test. DSP enable
    - Pitfalls-->sampling frequency
- Intan setup..signed vs unsigned
- Threading...how SPORT acquisition speed place requirements on how long the signal length can be, manifestation in gtkclient, how to debug?
