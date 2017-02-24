---
layout: post
title: "Using FemtoBeacon with ROS"
date: 2017-02-24
comments: false
tags:
- Wireless
- DSP
- Microcontroller
---


[FemtoDuino Offical Site](https://femtoduino.com/shop)
[FemtoBeacon Specs](https://www.tindie.com/products/femtoduino/femtobeacon-kit-starter/?pt=full_prod_search)

We bought the 5-coin + dongle version. Each chip has onboard a ATMEL SAM R21E (ATSAMR21E18A), which is Arduino compatible. The coins have onbaoard precision altimeter and a 9 Axis IMU (MPU-9250). The wireless communication between the coins and the dongle can be programmed t use any available 2.4GHz RF stack. FemtoDuino implements Atmel's LwMesh stack.

The design files for the boards and example programs are in the [femtobeacon repository](https://github.com/femtoduino/femto-beacon). The repository's README includes setup instructions to program the FemtoBeacon with bareemtal C with the Atmel Software Framework. Alex the maker of FemtoBeacons personal uses and suggests using the Arduino core and bootloader instead.[Discussion](https://github.com/femtoduino/femto-beacon/issues/3).

I am using the Arduino core and bootloader for my development as well.

**Machine Setup**

Femtoduino has a [list of instructions](https://femtoduino.com/examples/setup). There is also a list of instructions on [Femtoduino's github repo](https://github.com/femtoduino/ArduinoCore-atsamd21e18a/). 

Here I compile the relevant procedures I have taken.

1. [Download Arduino IDE](https://www.arduino.cc/en/main/software), version 1.8.1 or higher.

2. From Arduino IDE's board manager, install **Arduino SAMD Boards (32-bits ARM Cortex-M0+) by Arduino**. Femtoduino recommends version 1.6.11. I have tested 1.6.7 to 1.6.12, doesn't seem to make too much of a difference.

3. Add package URL (given in [ArduinoCore repo](https://github.com/femtoduino/ArduinoCore-atsamd21e18a/)) to the **Additional Board Manger URLs** field in the Arduino IDE via **File > Preferences** (Settings Tab).
  
    The Stable Release URL is: 

    `https://downloads.femtoduino.com/ArduinoCore-atsamd21e18a/package_atsamd21e18a-release-build_index.json`.
  
    The hourly build URL is: 

    `https://downloads.femtoduino.com/ArduinoCore-atsamd21e18a/package_atsamd21e18a-hourly-build_index.json`.

    I have found the hourly build works without compilation errors.

4. This core is now available as a package in the Arduion IDE board manager. Use Arduino's **Board Manager** to install **Atmel SAM D21/R21 core (ATSAMD21E18A/ATSAMR21E18A) by Femtoduino**.

    At this point, with default installations, there should be a `.arduino15/packages/femtoduino/hardware/samd/9.9.9-Hourly` directory, which contains the Arduion core for our device. This directory should contain files in the [ArduinoCore-atsamd21e18a git repo](https://github.com/femtoduino/ArduinoCore-atsamd21e18a/). The example files for the RF-dongle and RF-coins are in the `libraries/` folder of this directory.

5. Install the FreeIMU libraries from Femtoduino's fork of FreeIMU-Updates. This is needed for the onboard MCUs to talk to the IMU chips.

    This is done by either forking or downloading [FreeIMU-Updates](https://github.com/femtoduino/FreeIMU-Updates)'s **FemtoBeacon** branch (important!). 

    Then copy all the folders, except the `MotionDriver/` folder in `FreeIMU-Updates/libraries` into the Arduion libraries folder. By default, the Arduion libraries folder is under `/Arduino/libraries`. See [Arduino library guide](https://www.arduino.cc/en/Guide/Libraries) for more instructions.

    In `FreeIMU/FreeIMU.h` header file (from folders copied previously), the line `#define MPU9250_5611` is the only uncommented line under `3rd party boards`.

6. Install the FemtoDuino port of the LwMesh library. This is needed to run the wireless protocols.

    Fork or download the **at86rf233** branch of FemtoDuino's fork of [library-atmel-lwm](https://github.com/femtoduino/library-atmel-lwm/tree/at86rf233). Having the incorrect branch will break compilation.

    Move all the files in that repository into the Arduino library folder as `at86rf233`.

7. Install the Femtoduino fork of [RTCZero library, **osculp32k** branch](https://github.com/femtoduino/RTCZero/tree/osculp32k). This is needed to use an external 32kHz clock onboard the chips (see [compilation issue thread](https://github.com/femtoduino/ArduinoCore-atsamd21e18a/issues/11) for discussion).

    Fork or download **osculp32k** branch of Femtoduino's fork of [RTCZero](https://github.com/femtoduino/RTCZero/tree/osculp32k). Move it to Arduion library folder as `RTCZero`.

**Testing Coin and IMU**

To check if the machine setup has gone successfully, in Arduion IDE, select the **Board: "ATSAMR21E18A (Native USB Port)"** option. If it's not available, step 1-4 of the Machine Setup was probably done incorrectly.

Select the port corresponding to the connected Coin-chip.

Open `FemtoBeacon_Rf_FreeIMU_raw.ino` through **File > Examples > FemtoBeacon_Rf**. 

Compile and upload. If machine setup has gone correctly, should be able to see IMU readings in the serial monitor. Serial plotter can also visualize the outputs.

**Testing Dongle**

Testing the Dongle requires some modification of `FemotoBeacon_Rf_MESH_IMU_Dongle.ino` (can also be acessed via **Files > Examples > FemtoBeacon_Rf**). This program makes the Dongle listen for wireless traffic, and prints them in Serial. If there's no traffic, then nothing is done.

This is not very informative if we just want to see if the Dongle's working. So change the original `handleNetworking()` method:

{% highlight c linenos=table%}
void handleNetworking()
{
    SYS_TaskHandler();
}
{% endhighlight %}

to 

{% highlight c linenos=table%}
unsigned long start;
void handleNetworking()
{
    SYS_TaskHandler();
    if (millis() - start > 1000) {
        Serial.print("Node #");
        Serial.print(APP_ADDRESS);
        Serial.println(" handleNetworking()");
        start = millis();
    }
}
{% endhighlight %}

This way, even without wireless traffic, the dongle will print out "Node #1 handleNetworking()" every second in the serial monitor.

**Calibrating IMU**

Follow the official Femtoduino's [instructions](https://femtoduino.com/examples/calibration-info). Note that the calibration utility `cal_gui.py` is in the FreeIMU-Updates folder that was forked in machine setup step 5.


    

**References**

[Compilation issue](https://github.com/femtoduino/ArduinoCore-atsamd21e18a/issues/11)