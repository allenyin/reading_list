---
layout: post
title: "A Cross-Modal approach to silent speech with LLM-Enhanced recognition" 
date: 2024-04-05
comments: false
tags:
- Deep_Learning
- Machine_Learning
- silent_speech
---

[Paper link](https://arxiv.org/pdf/2403.05583.pdf)

This paper advances the SOTA on silent-speech decoding from EMG recorded on the face. "Silent" here means "vocalized" or "mimed" speech. The dataset comes from [Gaddy 2022](http://www2.eecs.berkeley.edu/
Pubs/TechRpts/2022/EECS-2022-68.html).

![image1]({{ site.baseurl }}/assets/cross_modal_silent_speech_flow.png){: .center-image }

Image above shows the overall flow of the work:
1. Model is trained to align EMG (from vocalized and silent) and audio into a shared latent space from which text-decoding can be trained. This training utilizes some new technique they call "cross-modal contrastive loss" (crossCon) and "supervised temporal contrastive loss" (supTCon). More on this later.
2. They take the 10 best models trained with different loss and data-set settings, and make into an ensemble.
3. For inference, they get the decoded beam-search output from these different models, and pass them into a fine-tuned LLM, to infer the best text transcription. They call this LLM-based decoding "LLM Integrated Scoring Adjustment" (LISA).

## Datasets

The Gaddy 2022 dataset contains:
1. EMG, Audio, and Text recorded simulataneously during vocalized speech
2. EMG and Text for silent speech
3. Librispeech: Synchronized Audio + Text

## Techniques

A key challenge to decode silent speech from EMG is the lack of labeled data. So a variety of techniques are used to overcome this, drawing inspiration from self-supervised learning techniques that have advanced automatic-speech recognition (ASR) recently.

__Cross-modality Contrastive Loss (crossCon)__: Aims to make cross-modality embeddings at the same time point more similar than all other pairs. This is really the same as CLIP-style loss.

![image2]({{ site.baseurl }}/assets/crossCon_loss.png){: .center-image }

__Supervised temporal contrastive Loss (supTCon)__: This loss aims to leverage un-synchronized temporal data by maximizing similarity between data at time points with the same label than other pairs.

![image3]({{ site.baseurl }}/assets/supTCon_loss.png){: .center-image }

__Dynamic time warping (DTW)__: To apply crossCon and supTCon to silent speech and audio data, it's important to have labels for the silent speech EMG. DTW leverages the fact that vocalized EMG and audio are synchronized, by:
1. Use DTW to align vocalized and silent EMG
2. Pair the aligned silent EMG with the vocalized audio embeddings.

__Using audio-text data__: To further increase the amount of training data, Librispeech is used. Since the final output is text, this results in more training data for the audio encoder, as well as the joint-embedding-to-text path.

All these tricks together maximize the amount of training data available for the models. I think there are some implicity assumptions here:
1. EMG and Audio have more similarity with EMG and Text, since both Audio and EMG have temporal relationship.

The use of a joint-embedding space between EMG and Audio is crucial, as it allows for different ways to utilize available data.

__LISA__: An LLM (GPT3.5 or GPT4) are fine-tuned on the EMG/Audio-to-Text outputs for the ensemble models, and the ground truth text transcriptions. This is done from the validation dataset. Using LLM to output the final text transcription (given engineered prompt and beam-search paths), instead of the typical beam-search method, yielded significant improvements. And this technique can replace other language-model based speech-decoding (e.g. on invasive speech-decoder output) as well!

## Details:

1. CrossCon + DTW performed the best. It's interesting to note that DTW with longer time-steps (10ms per timepoint) perform better.
2. SupTCon loss didn't actually help.
2. Mini-batch balancing: Each minibatch has at least one Gaddy-silent sample. Vocalized Gaddy samples are class-balanced with Gaddy-silent sample. The rest of the mini-batch is sub-sampled from Librispeech. This is important to ensure the different encoders are jointly optimized.
3. GeLU is used instead of ReLU for improved numerical stability.
4. The final loss function equals to weighted sum EMG-CTC_loss, Audio-CTC_loss, CrossCon and supTConLoss

## Final Results on Word-Error Rate (WER)

For final MONA LISA performance (joint-model + LLM output):

1. SOTA on Gaddy silent speech: 28.8% to 12.2%
2. SOTA on vocal EMG speech: 23.3% to 3.7%
3. SOTA on Brain-to-Text: 9.8% to 8.9%

## Additional userful reference

Cites [Acceptability of Speech and Silent Speech Input Methods in Private and Public](https://dl.acm.org/doi/10.1145/3411764.3445430):

> The performance threshold for SSIs to become a viable alternative to existing automatic speech recognition (ASR) systems is approximately 15% WER
