---
layout: post
title: "Challenge Point Framework for motor learning"
date: 2022-01-28
comments: false
tags:
- learning
- Reinforcement_Learning
---

[Challenge Point: A framework for conceptualizing the effects of various practice conditions in motor learning](https://pubmed.ncbi.nlm.nih.gov/15130871/)

Challenge point framework is a generalization of the [85% optimal learning rule]({{ site.baseurl }}/2022/01/85percentLearningRule) result. Perhaps it's better to call the 85% optimal learning rule as a prediction within the challenge point framework (which came before).

### Essentials

The Challenge Point Framework (CPF) provides a conceptual framework for factors influencing motor skill learning (unclear if it applies to cognitive learning, but some empirical observations in education and language learning seems to suggest so).

The main interacting factors in this framework are:
- Skill level of the learner regarding a specific task
- Task difficulty
- Practice environment

The CPF suggests that as one's skill increase in a task, learning is optimized when task difficulty is increased as well. This relationship is explained by higher ability to utilize additional information for learning when task skill increases, and additional information improves learning. In contrast, extra information presented during to someone with a low skill level, and thus low ability to utilize information, impedes the learning process by overwhelming the cognitive resources available during learning.

A key idea is that increasing task difficulty is associated with increasing information available to the learner for the following reasons:
1. Model someone being highly skilled in a motor task with the expected success of his movement plan in the task being very high. In this case, a negative result would yield more information about the learner's internal model. In contrast, a positive result does not provide much useful information.
2. When task difficulty is low, he would expect success, therefore learning is minimal.
3. When task difficulty is high, likelihood for negative result is higher, therefore the potential information available to the learner is higher. More potential information implies more learning is possible.

A related way to see it is that "practice leads to redundancy, less uncertainty, and, hence, to reduced information". The more that practice leads to better expectations, the less information there will be to process.

Therefore in this framework, factors that contribute to motor learning can be easily evaluated to predict its effects on skill performance and learning. Factors influencing learning include:
1. Task difficulty: note this can be divided into the inherent or nominal difficulty, and functional difficulty. A nominally difficult task can be made to have less functional difficult task by introducing helpful feedback, for example.
2. Practice schedule (changes the functional difficulty): blocked, random, randomized block. Random practice schedule increases the functional difficulty wrt blocked practice schedule due to contextual interference.
3. Feedback (also known as knowlege of result - KR) and feedback schedule:
  - More frequent feedback lowers functional difficulty
  - Random feedback schedule increases functional difficulty, compared to blocked schedule.

This framework also predict optimal challenge point, as a function of task difficulty and skill level, during which learning (or utilizable potential information availability) is maximized.

### Details

__Definitions__

__Nominal task difficulty__: The difficulty of a particular task within the constraints of an experimental protocol. The nomianl difficulty of a task is considered to reflect a constant amount of task difficulty, regardless of who is performing the task and under what conditions it is being performed. This makes the most sense in comparison with other skills, for example, kicking a ball 50 meters has more nominal difficulty than kicking it 1m, and less than kicking it 100 meters.

__Functional task difficulty__: How challenging the task is relative to the skill level of the individual performing the task and to the conditions under which it is being performed. Ex: kicking a ball 50 meters has the same nominal difficulty to amateur and pro, but different functional difficulty (i.e. success rate).

Practically, nominal task difficulty is probably not important to think about.

__Assumptions__

Learning is a problem-solving process in which the goal of an action represents the problem to be solved and the evolution of a movement configuration represents the performer's attempt to solve the problem.

Source of information available during and after each attempt is remembered and form the basis for learning, resulting in improvement skill -- this is practice.

Two sources of information are criticle for learning: the action plan (known to a priori to the learner), and feedback (obtained during or after).

__Optimal challenge point__

In CPF, learning is directly related to the information __available and interpretable__ in a performance instance, which, in turn is tied to the functional difficulty of the task. The __central thesis__ is then:

> Information represents a challenge to the performer and that when information is present, there is potential to learn from it

Subsequent corollaries are:
1. Learning cannot occur in the absence of information
2. Learning will be impeded in the presence of too much information (too much challenge, cognitive overload).
3. Learning achievement depends on an optimal amount of information, which differs as a function of the skill level of the individaul.

Therefore, the factors contributing to functional task difficulty interact to dictate the optimal amount of interpretable information, and thus the potential for learning.

Corollary 2 derives from the observation that if information is to result in learning, it must be interpretable. The total amount of information one can interpret is goverend by one's information-processing capabilities, which changes with practice.

As skill improves, the expectation for performance becomes more challenging. So to generate a challenge for learning, one must obtain increased information, which can arise only from an increase in the functional task difficulty. Luckily, both information-processing capability and skill level increases with practice.

![optimal_challenge_points]({{ site.baseurl }}/assets/optimal_challenge_point.png){: .center-image }

![CPF_interactions]({{ site.baseurl }}/assets/CPF_interactions.png){: .center-image }

__Predictions of CPF__

1. Practice variables that influence action planning information via contextual interference (most often random practice schedule is proxy for contextual interference):
  - For tasks with differing levels of nominal difficulty, the advantage of random practice (vs. blocked practice) for learning will be largest for tasks of lowest nominal difficulty and smallest for tasks of highest nominal difficulty.
  - For individuals with differing skill levels, low levels of CI will be better for beginning skill levels and higher levels of CI will be better for more highly skilled individuals (via increasing functional difficulty).
  - Modeled information (i.e. examples and prior demos) decrease functional difficulty.
2. Practice variables that influence feedback information (knowledge of result, among other things):
  - For tasks of high nominal difficulty, more frequent or immediate presentation of KR, or both, will yield the largest learning effect. For tasks of low nominal difficulty, less frequent or immediate presentation of KR, or both, will yield the largest learning effect
  - For tasks about which multiple sources of augmented information can be provided, the schedule of presenting the information will influence learning. For tasks of low nominal difficulty, a random schedule of augmented feedback presentation will facilitate learning as compared with a blocked presentation. For tasks high in nominal difficulty, a blocked presentation will produce better learning than a random schedule.

### How to apply?

1. Athletic skills is perhaps the obvious example: boxers practice individual punches first (blocked practice schedule, frequent feedback, easy), before mixing it in combinations and sparring.(random practice schedule, summary/infrequent feedback, difficult).
2. Tutorials: Introduce concept one at a time (less information and less difficulty)

