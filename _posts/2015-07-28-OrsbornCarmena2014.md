---
layout: post
title: "Orsborn, Carmena 2014: Closed-loop decoder adaptation shapes neural plasticity for skillful neuroprosthetic control"
date: 2015-07-28
comments: false
tags:
- BMI
- Carmena
- motor_system
- neural_decoding
- neuroplasticity
---

[Closed-loop decoder adaptation shapes neural plasticity for skillful neuroprosthetic control](http://www.cell.com/neuron/abstract/S0896-6273(14)00363-8)

Focuses on the acquisition of "neuroprosthetic skill", performance and neural representations that are robust over time and resistant to interfernce. As shown before, learning in brain-control facilitate the formation of BMI-specific control networks, changes in cortical and corticostriatal plasticity show speficificty for BMI control neurons. Evidence seems to suggest that neuroplasticity creates specialized BMI control network that allows skillful control.

Cortical map formation has been shown to be sensitive to the details of the BMI system, such as the neurons input into the decoder, and decoder parameters. Training new decoders regularly, even with the same neural ensemble, elminated cortical map formation and the associated performance improvement. This would then suggest a fixed decoder would allow neuroplastiicty to yield continued task performance from day to day. However, the decoder's performance is sensitive to changes in the neural signals. Thus closed-loop adapation can facilitate and maintain learning in the presence of changing neural inputs to the BMI. Therefore the control architecture of closed-loop decoder adaptation (CLDA) as a two-learner system can provide more robust BMI performance. 

In the first experiment, a delayed center-out hold task is used. CLDA was used initially to train the decoder (via smooth-batch or ReFIT). CLDA was stopped until the monkey can navigate the cursor across workspace - the goal is to limit decoder adapation to maximize improvement driven by neural adapation, perhaps this allows for more robust neuroprosthetic skill retention?

Performance (measured by % correct, success rate - trials/min, and mean error - deviation from ideal trajectory) continued to improve after the decoders were held fixed. Intermittent CLDA was used to compensate for performance drops and changes in the neural ensemble.

One key finding was that 
    
> [...] gradual refinement of cursor control, with continued improvements in movement errors and success rates reached a plateau. These improvements were absent when CLDA was used each day to maximize performance starting from varying initial decoders that used differeint neural ensembles. Whereas CLDA could achieve high task performance, movement kinematics showed no improvements. Daily performance also showed variability commonly observed with daily re-training. This finding confirms that observed learning was not purely reflective of increased practice in BMI and highlights the improtance of some degree of neural and decoder stability for learning.

While the specifics of how CLDA is used exactly in their training scheme are needed for me to accept their conclusion (reseeding CLDA every day would introduce abrupt changes to the decoder, as the authors mention), but the idea of intermittent decoder adapation and neural plastiticty can be useful. Also supports using reinforcement learning to train the decoder...

**Neural data analysis**:

1. Tuning map correlate strongly in later sessions, less tuning changes in later sessions indicate saturation.
2. Degree of neural adaptation depends on amount of performance improvements - correlation of tuning maps with day 1 decrease with sessions and performance rate. Really just a corrollary of analysis 1.
3. Neural adapation is shaped by decoder properties - tuning properties changed primarily when necessary to improve performance and otherwise stable. Specifically, units were more likely to change their preferred directions if the initial decoder assigned them an "incorrect" PD. *If they did the same analysis on the Ganguly, Carmena 2011 paper on direct and indirect neuron populations, would they still reach the same results with the direct neuron population? What about the indirect neurons*?
4. They compared the onset time of directionally tuned activity and time of peak firing for each unit during different sessions. Averaging across all units and series, they found that after learning:  
    * units were both directionally tuned earlier and reached peak firing earlier in the trial (Wilcoxon sign-rank test).
    * Majority of units developed tuning prior to the go-cue - indicate planning or preparation to move.
    * Cursor speed profiles also shifted earlier with learning, and clear increases in speed occured prior to the go-cue. (*WTF the cursor isn't supposed to move before go-cue!*).

**Second Experiment**
To test the robustness of neuroprosthetic skill and the emerging neural map's resistance to interference from exposure to other contexts and perturbing neural inputs, specifically, from native motor networks, the *BMI-SC* task involved the monkey pressing down on a force sensor with arm contralateral to the implants, whlie performing the regular task. The decoder used in BMI-SC and regular BMI task is the same.

Results here include:
1. Isometric force task significantly disrupted the task performance.
2. BMI-only performance and learning not disrupted by performing the BMI-SC task in the same day.
3. Sessions in which BMI-only and BMI-SC tasks were perofrmed in A-B-A block showed minimal within-session interference between contexts, confirms the reversible modification hypothesis from *Ganguly, Carmena 2011*.
4. BMI-SC performance also improved across the series, approaching that of BMI-only performance on the last day in one example. These improvements may be due in part to reduced interference of arm-movement-related activity with BMI control, the disruption of simultaneous arm movements may not be fully blocked by skill formation. **Learning Transfer** between contexts.

Performance improved even when CLDA was used to fully adapt the decoder, suggesting that neural plasticity may provide benefits beyond decoder adapation alone. Gradual adapation might be kye.

**References to Read**

* ~~Collinger, J.L., Wodlinger, B., Downey, J.E., Wang, W., Tyler-Kabara, E.C., Weber, D.J., McMorland, A.J., Velliste, M., Boninger, M.L., and Schwartz, A.B. (2013). High-performance neuroprosthetic control by an individual with tetraplegia. Lancet 381, 557–564~~
* ~~Dangi, S., Orsborn, A.L., Moorman, H.G., and Carmena, J.M. (2013). Design and analysis of closed-loop decoder adaptation algorithms for brain-machine interfaces. Neural Comput. 25, 1693–1731~~
* ~~Gilja, V., Nuyujukian, P., Chestek, C.A., Cunningham, J.P., Yu, B.M., Fan, J.M., Churchland, M.M., Kaufman, M.T., Kao, J.C., Ryu, S.I., and Shenoy, K.V. (2012). A high-performance neural prosthesis enabled by control algorithm design. Nat. Neurosci. 15, 1752–1757~~
* Orsborn, A.L., Dangi, S., Moorman, H.G., and Carmena, J.M. (2012). Closedloop decoder adaptation on intermediate time-scales facilitates rapid BMI performance improvements independent of decoder initialization conditions. IEEE Trans. Neural Syst. Rehabil. Eng. 20, 468–477.
* Suminski, A.J., Tkach, D.C., and Hatsopoulos, N.G. (2009). Exploiting multiple sensory modalities in brain-machine interfaces. Neural Netw. 22, 1224–1234
* Suminski, A.J., Tkach, D.C., Fagg, A.H., and Hatsopoulos, N.G. (2010). Incorporating feedback from multiple sensory modalities enhances brain-machine interface control. J. Neurosci. 30, 16777–16787.
* Wander, J.D., Blakely, T., Miller, K.J., Weaver, K.E., Johnson, L.A., Olson, J.D., Fetz, E.E., Rao, R.P.N., and Ojemann, J.G. (2013). Distributed cortical adaptation during learning of a brain-computer interface task. Proc. Natl. Acad. Sci. USA 110, 10818–10823.
