---
layout: post
title: "Wireless Headstage: Radio transmission protocol between headstage and gtkclient."
date: 2016-1-26
comments: false
tags:
- BMI
- Wireless
- Blackfin
- Microcontroller
---

- Outgoing packet structure, outgoing bandwidth
- Incoming packet structure (from gtkclient), incoming bandwidth
- total wireless bandwidth
- Packaging procedures, 7bit encoding.
- Ack with gtkclient, echo and packet number in frame
- Debugging..what happens when something goes wrong, and where.. How to isolate problem
    - echo nibble --> no lost packet
    - bad waveform --> use FFT analysis
    - Final problem lol..
