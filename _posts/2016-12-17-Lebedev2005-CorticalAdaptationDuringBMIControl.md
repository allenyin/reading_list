---
layout: post
title: "Lebedev, Carmena et al 2005: Cortical ensemble adaptation to represent velocity of an artificial actuator controlled by a brain-machine interface"
date: 2016-12-17
comments: false
tags:
- BMI
- Lebedev
- Carmena
- motor_movements
- motor_cortex
- neuroplasticity
---

[Cortical ensemble adaptation to represent velocity of an artificial actuator controlled by a brain-machine interface](http://www.jneurosci.org/content/25/19/4681.short)

**Context**
Follow-up to the [Carmena 2003, Learning to control a brain-machine interface for reaching and grasping by primates](http://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0000042) paper. In the experiments, monkey first learned to do a target-acquisition task via joystick-control (**pole-control**), then brain-control was used to control the cursor while the monkey was still allowed to move the pole (**brain control with hand movement (BCWH)**), and finally the joystick was removed (**brain-control without hand movement (BCWOH)**). All bin-size=100ms.

> Individual cortical neurons do not have a one-to-one relationship to any single motor parameter, and their firing patterns exhibit considerable variablitiy. Precise motor control is achieved through the action of large neuronal ensembles.

The key questions addressed was: **How do the neuronal representations of the cursor movement and arm movement of the recorded ensembles change between pole-control, BCWH, and BCWOH?**

**Method**

Implants in M1, PMd, SMA, S1, and PP.

1. *Tuning to velocity during pole and brain control*. Constructed linear regression model to predict neuronal firing rates based on velocity: 
$$n(t+\tau)=a(\tau)V_{x}(t)+b(\tau)V_y(t)+c(\tau)+\epsilon(t,\tau)$$, 
where $$t$$ is time, $$n(t+\tau)$$ is neuronal firing rate at time $$\tau$$, $$\tau$$ is a time lag. The square root of $$R^2$$ for this regression was termed the velocity tuning index (VTI) at $$\tau$$. A VTI curve is then constructed for $$\tau$$ ranging from [-1,1] second.

2. Preferred direction of a neuron is determined as $$PD(\tau)=arctan(b(\tau)/a(\tau))$$.

3. To examine the change in PD between different tasks, correspondence index is defined as:
$$C=\frac{90^{\circ}-\overline{|\alpha-\beta|}}{90^{\circ}}$$,
where $$\alpha$$ and $$\beta$$ are statistical values calculated from ensembles' PD measured in degrees for the different tasks. Values of $$C$$ approaching zero means no correspondence between the PDs, value approaching 1 means the opposite.

4. *Shuffle test* to examine how correlations between neurons contribute to tuning properties -- destroy correlations between neurons by shifting spike trains of different neurons with repsect to each other by a random interval ranging from 0 to 200s. After shuffling, VTIs are calculated from the regression models in (1). Higher unshuffled VTI would indicate correlated firing between neurons improve tuning characteristics of individual neurons.

5. *Straight-line analysis* extracted times when trajectories are straight for at least 300ms. VTI were calculated for these times. Directional tuning depth is calculated as the different in average firing rate between the direction of maximum and minimum firing, divided by the SD of the firing rate.

6. *Off-line predictions of hand velcocity* - is similar to construction of online decoder with:
$$V_x(t)=b+\sum^{n}_{\tau=-m}\mathbf{w}(\tau)\mathbf{n}(t+\tau)+\epsilon(t)$$

7. *Random neuron dropping*: 10min of neuronal population data fit the velocity prediction model. Model then used to predict on a different 10min period. A single neuron is randomly dropped from the population, train then test. This process is repeated until no neurons remained. This entire process (dropping 1 to entire population) is repeated 100 times to yield $$R$$ as a function of number of neurons. 

**Results**

1. *Hand and robot velocity in pole-control vs. BCWH* -- More correlated during pole-control (expected), less during BCWH. Ranges of velocity similar. In BCWH, robot moved faster than hand. Ranges of robot velocity similar between BCWH and BCWOH.

2. *Neuronal tuning during different modes* -- Velocity tuning defined as correlation between neuronal rate and velocity. Individual neurons exhibited diversity of tuning patterns:

    - Fig.3: *Tuned to both pole-control and brain-control (shown in 3A)*. VTI higher before instaneous velocity measurement (IVM). VTI for differnet modes significantly different (Kruskal-Wallis ANOVA, Tukey's multiple comparison). Highest VTI during pole-control. **After transitioning to brain control, this neuron retained many features of its original velocity tuning, but also became less tuned to hand movements**.

    - Fig.4: *Tuned to hand movements*. Changes in VTI between different modes are significant. Tuning present during pole-control and BCWH, but vanished in BCWOH. Highest VTI before IVM. Observed lag-dependent PD to both hand and robot velocity. **Because of the strong dependency of tuning on the presence of hand movements, this neuron is likely to have been critically involved in generation of descending motor commands**.

    - Fig. 5: *Tuned to BCWOH*.
  
    Pairwise comparison of pole-control with BCWH and BCWOH (within same sessions) showed in majority of neurons, peak VTI for hand decreased after transitioning to BCWH. In BCWH, the peak VTI for robot is significantly greater than peak VTI for hand for a majority of neurons. Peak VTI during BCWOH was greater than during pole control in $$38\%$$ of neurons.

3. *Tuning patterns for ensembles* 

    - Fig.6: *Ensemble VTI for different control mode*. In majority of neurons, and also average VTI, tuning to hand movement decreased from pole-control to BCWH. VTIs for robot movement is higher pre-IVM, because only bins preceding IVM were used for online prediction, and delay of the robot/cursor introduces a lag. VTI for hand movement peaked closer to IVM than for robot movement. Average VTI similar to M1 VTI due to stronger tuning.
    
      Occurence of ensemble tuning to robot velocity in BCWOH is not surprising as neural activities controlled robot movement, but it's not simply a consequence of using the linear model. The shuffled test showed average VTI decreased after the shuffling procedure, indicating role of inter-neuronal correlation in cortical tuning. This corroborates Carmena 2003's finding that firing of individual neurons is correlated and increase in brain control. 

    - Fig 7: *Ensemble PD*. **Generally there was no fixed PD for each neuron and rotated with lag changes** (may be due to representation of accelerative and decelerrative forces a la Sergio & Kalaska). In BCWH, PDs for both hand and robot resemble that of pole-control. Correspondence of hand PD between pole-control and BCWH is highest at IVM. For robot PD correspondence is highest 100ms before IVM, which is in agreement with average velocity VTIs. **PDs during BCWOH were confined to a narrower angular range and rotated less**.

4. *Neuronal tuning for selected hand movements*. 

    - Fig 8: *Comparing directional tuning to hand movements in pole-control and BCWH*. Both directional tuning depth and VTI w/ respect to hand are less in BCWH. Differences are statistically significant.

5. *Offline predictions of hand velocity during pole and brain control*. Three prediction curves were made, 1) Using pole-control to train models, then predict pole-control; 2) Train with pole-control, predict BCWH; 3) Train with brain-control, predict BCWH.

    - Fig 9: Prediction quality: (1)>(3)>(2). This decrease in prediction accuracy applies to all lags. **Suggests cortical representation of the robot ws optimized at the expense of representation of the animal's own limb**.

**Conclusion**

1. Principle finding: **Once cortical ensemble activity is switched to represent the movements of the artificial actuator, it is less representative of the movement of the animal's own limb**, as evidence by how tuning to hand velocity decreases from pole-control to BCWH.

    - Neuronal tuning to robot movements may be enhanced due to increased correlation between neurons (attention leads to synchrony$$^2$$).
    
    - Supports evidence that cortical motor areas include cognitive signals as well as limb movements. Limb representation is highly flexible and susceptible to illusions and mental imagery (rubber arm). **Neuronal mechanisms underlying adaptive properties$$^1$$ may be responsible for cortical ensemble adaptation during the BMI operation.**

2. BMI design makes any modulation of neuronal activity translate into movement of the actuator. To interpret it as reflection of new representation of artificial actuators, uses the following evidence:

    - Nonrandomness of actuator movements and behavioral improvements. (Peaking of VTI pre-IVM not neccessarily sufficient because that's built into prediction algorithms).

    - Increased correlation between neurons during brain control (via Carmena 2003).

    - Decreased tuning to hand velocity in BCWH suggests different representation.

3. Neurons tuned to hand velocity in pole control code for robot velocity in brain-control. How do those neurons' modulation not lead to hand movements in brain-control? In other words how does the monkey inhibit hand movements during brain control? **Suggests activity on the level of ensemble combination changes to accomodate it.** The recorded population is small part, may be preferentially assigned weights to control the actuator, whereas the others operate normally. This is the topic of [Ganguly and Carmena, 2011](../../2015/07/GangulyCarmena2011).

4. Neuronal ensemble represents robot velocities better during brain control supports optimal feedback control theory -- motor system as a stochastic feedback controller that optimizes only motor parameters necessary to achieve task goals (meh).

5. Once the neuronal ensemble starts to control a BMI, imperfections in open-loop model may be compensated by neuronal adaptations to improve control, concurs with (Taylor 2002) using adaptive BMI. Justifies using fixed decoder, and closed-loop decoder calibration stage (CLDA, ReFIT, Schwartz algs).

**Further Questions**

6. How exactly does the cortical plasticity process help? Very likely features of adaptations depend on requirements of BMI operations. If the task requires both limb movements and BMI operations, what will be the optimal neural system state? It's possible certain adapation states is only temporary to maintain performance.

    - PDs of many neurons become more similar in BCWOH -- may be maladaptive since PD diversity may be needed to improve directional encoding.
    
    - Shuffling procedures show increased correlations accompanies increased individual neuronal tuning...seems to contradict the previous point.
    
    - Therefore, neuronal ensemble controlling hte BMI may have been optimizing its performance by trading magnitude of tuning and the diversity of PD, or that increased correlation is only a temporary effect and will decrease with prolonged training (attention in learning stage increases synchrony).

Probably led to [Orsborn & Carmena 2014](../../2015/07/OrsbornCarmena2014)'s task of pressing a button while doing BMI center-out.

$$^1$$ --  Cortical neurons can encode movement directions regardless of muscle patterns, represent target of movement and movement of the hand-controlled visual marker toward it rather than actual hand trajectory, encode multiple spatial variables, reflect orientation of selective spatial attention, and represent misperceived movements of visual targets.

$$^2$$ -- Murphy and Fetz, 1992, 1996a,b; Riehle et al., 1997, 2000; Hatsopoulos et al., 1998; Lebedev and Wise, 2000; Baker et al., 2001.
