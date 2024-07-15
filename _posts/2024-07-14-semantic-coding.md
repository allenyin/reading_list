---
layout: post
title: "Semantic encoding in single cell level" 
date: 2024-07-14
comments: false
tags:
- silent_speech
---

A very cool paper from the Williams lab at Harvard-MGH came out this month: [Semantic encoding during language comprehension at single-cell resolution](https://www.nature.com/articles/s41586-024-07643-2).

It records from __10 awake neurosurgery patients__ from the __superior posterior middle frontal gyrus within the dorsal prefrontal cortex of the language-dominant hemisphere__, while they listened to different short sentences. Comprehension was confirmed by asking follow-up questions to the sentences. __133__ well-isolated units from the 10 patients were collectively analyzed.

The results are very satisfying. Also see nature [commentary on this paper](https://www.nature.com/articles/d41586-024-02146-6).

# Semantic tuning

They found something akin to "semantic tuning" on the single neuron level to the words in the sentence.
  - This is done by correlating neuron firings to the semantic content of each word in time, where the semantic content of a word is a multi-dimensional embedding vector (derived from models like word2vec).
  - A neuron is tuned to a "semantic domain" if its firing rate is significantly higher for that domain vs. others.
  - They observed most of the neurons exhibited semantic selectivity to only one semantic domain. Though construction of 1-vs-all determination of semantic tuning this conclusion is a bit weak.
  - As a control, many semantic-selective neurons also distinguished real vs. non-words.

![image1]({{ site.baseurl }}/assets/semantic_selectivity1.png){: .center-image }

# Generalizable semantic selectivity

- Semantic decoders generalize to words not used in the training set (31+/-7%)
- Semantic decoders work when a different word-embedding model is used (25+/-5%)
- Decoding performance holds regardless of position in a sentence (23% vs 29%)
- Works for multi-unit activities (25%)

Considering they use a support vector classifier with only 43 neurons, this is really good.

Additional control found different story "narrative" (different thematic and style) does not affect semantic decoding (28% accuracy using decoders trained from a different narrative).

The decoding experiments used the response from the collective semantically-tuned neurons from all 10 participants (they can do this since the tasks are the same across participant). They checked the semantic decoding generalizability hold for individual participant.

![image2]({{ site.baseurl }}/assets/semantic_selectivity2.png){: .center-image }

# Context-dependence

- Presenting words without context yield much lower semantic-selectivity from the units compared to when they were presented in a sentence.
- Homophone pairs (words that sound the same but mean different things) showed bigger differences in semantic-selective units compared to non-homophone pairs (words that sound different but semantically similar).
- Context helped with semantic decoding
  - They assigned a "surprisal"-metric to each word using a LSTM: high surprisal means based on the context, the prob that a word is surprising;
  - They looked at the decoding performance as a function of surprisal
  - Decoding performance for low-surprisal words significantly higher than for high-surprisal words

# Neural representation of the semantic space

Even though a neuron might be selective primarily to a single semantic domain, the actual semantic representation could be distrbuted (perhaps in a sparse manner). Statistical significance from permutation tests.

They regressed the responses of all 133 units onto the embedding vectors (300-dimensional) of all words in the study.
- This results in a set of model weights for each neuron (i.e. how much each neuron encodes a particular semantic dimension)
- The concatenated set of model weights is then a neural represention of the semantic space (neurons-by-embeddings, 133x300 in this case).
- Top 5 PC accounts for 81% of activities of semantically-selective neurons.
- Different in neuronal activities correlated with word-vector distance (measured with cosine similarity). r=0.17
-  Word pairs with less hierarchical semantic distance (cophenetic distance) elicited more similar neuronal activities, r=0.36.

These last two points are interesting. It FEELS right, since hierarchical semantic organization probably allows a moer efficient coding scheme for a large and expanding semantic space.

![image3]({{ site.baseurl }}/assets/semantic_selectivity3.png){: .center-image }

# Impact

This work is spiritually similar to the Huth/Gallant approaches for looking at fMRI during story-listening to examine language processing. But the detailed single-neuron results make it reminiscent of the classic Georgeopoulos motor control papers that largely formed the basis of BMI ([1](https://www.jneurosci.org/content/2/11/1527), [2](https://www.science.org/doi/10.1126/science.3749885)). 

While the decoding accuracy (0.2-0.3) here is looks much lower than the initial motor cortex decoding of arm trajectories in the early papers, it is VERY GOOD considering the much higher dimensionality of the semantic space. While the results might not be too surprising -- we know semantic processing has to happy SOMEWHERE in the brain, it is surpising how elegant the results here are.

The natural next-step IMO is to obviously recorded from more neurons with more sentences, etc. I would then love to see:
1. Fine-tune LLM with the recordings: since the neural activities are correlated with semantic content, it could be projected into a language model's embedding space.
2. Try to reconstruct sentences' semantic meaning, and the LLM can be additionally be used to sample from the embedding space for sentence "visualization".

And this will be a huge step toward what most people perceive as "thought"-decoding vs. speech-decoding (which deals more with the mechanics of speech roduction such as tones and frequencies vs. languag aspects such as semantics).

__What else are needed?__

The discussion section of the paper is a good read, and this section stands out regarding different aspects of semantic processing:

__Modality-dependence__

> As the present findings focus on auditory language processing, however, it is also interesting to speculate whether these semantic representations may be modality independent, generalizing to reading comprehension, or even generalize to non-linguistic stimuli, such as pictures or videos or nonspeech sounds.

__Production vs. Comprehension__

> It remains to be discovered whether similar semantic representations would be observed across languages, including in bilingual speakers, and whether accessing word meanings in language comprehension and production would elicit similar responses (for example, whether the representations would be similar when participants understand the word ‘sun’ versus produce the word ‘sun’).

Perhaps the most relevant aspect to semantic-readout. It's unclear whether semantic processing in production of language (as close to thoughts as we can currently define) is similar to that during comprehension. Although a [publication](https://www.nature.com/articles/s41586-023-06982-w) from the same group examines speech production (phoneme, syllables, etc) in the same brain region (the second paper says __posterior middle frontal gyrus of the langauge-dominant prefrontal cortex__, illustration looks similar), examined the organization of the cortical column and saw their activities transitioned from articulation planning to production.

It would be great to know if the semantic selectivity holds during speech production as well -- the combined findings suggest there's a high likelihood.

__Cortical Distribution__

> It is also unknown whether similar semantic selectivity is present across other parts of the brain such as the temporal cortex, how finer-grained distinctions are represented, and how representations of specific words are composed into phrase- and sentence-level meanings.

Language and speech neuroscience has evolved quickly in the past two decades, with the traditional thesis that Broca's area is responsible for language production being challenged with more evidence implicating the role of precentral gyrus/premotor cortex.

Meanwhile the hypothesis that Werneke's area (posterior temporal lobe) for language understanding has withstood more test of time. How this is connected to the semantic processing observed in this paper in prefront gyrus should (e.g. is it downstream or upstream in language production) certainly be addressed.

My (hopeful) hypothesis is that the prefrontal gyrus area here participates in both semantic understanding and production. I don't believe this as far-fetched given how motor/premotor cortex' roles in both action observation and production in the decades of BMI studies.
