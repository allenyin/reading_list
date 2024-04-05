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

Here I compile the relevant procedures I have taken, on Ubuntu 14.04.

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

    This is done by either forking or downloading [FreeIMU-Updates](https://github.com/femtoduino/FreeIMU-Updates)'s **FemtoBeacon** branch (important!). Make the libraries visible to Arduion -- two ways to do this:

    1. Copy all the folders, except the `MotionDriver/` folder in `FreeIMU-Updates/libraries` into the Arduion libraries folder. By default, the Arduion libraries folder is under `/Arduino/libraries`. See [Arduino library guide](https://www.arduino.cc/en/Guide/Libraries) for more instructions.


    2. As I might make changes to FreeIMU library code, it's easier to symbolic link the libraries to Arduino's library directory. Do this with:

        `cd ~/Arduino/libraries`

        `cp -r --symbolic-link ~/PATH_TO/FreeIMU-Updates/libraries/* .

        Remember to delete the symbolic link to `MotionDriver/` since we don't need it.
            
    In `FreeIMU/FreeIMU.h` header file (from folders copied previously), the line `#define MPU9250_5611` is the only uncommented line under `3rd party boards`.

    In `FreeIMU/FreeIMU.h`, find the following section:

    ```
    //Magnetic declination angle for iCompass
    //#define MAG_DEC 4 //+4.0 degrees for Israel
    //#define MAG_DEC -13.1603  //degrees for Flushing, NY
    //#define MAG_DEC 0.21  //degrees for Toulouse, FRANCE
    //#define MAG_DEC 13.66 // degrees for Vallejo, CA
    //#define MAG_DEC 13.616 // degrees for San Francisco, CA
    #define MAG_DEC -9.6    // degrees for Durham, CA 
    //#define MAG_DEC 0
    ```
    and enter the magnetic declination angle for your location. Do this by going to [NOAA](https://www.ngdc.noaa.gov/geomag-web/#declination), enter your zip code and get the declination result. For the result, an **east** declination angle is positive, and **west** declination agnle is negative. This is needed to for magnetometer reading responsible for yaw calculations.

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

``` c
void handleNetworking()
{
    SYS_TaskHandler();
}
```
to 

{% highlight c linenos %}
unsigned long start = millis(); // Global variable, asdffffffffffffffffffffffffffffffffffffffffffffffffffff

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

**Testing Femtobeacon Networking**

Upload one Femtobeacon coin with `FemtoBeacon_Rf_MESH_IMU_Coin.ino` and the dongle with `FemtoBeacon_Rf_MESH_IMU_Dongle.ino`.

Keep the dongle plugged into your computer with Arduino IDE running, and the other coin unconnected but powered through its USB connector.

In the Serial monitor, you should be able to see outputs such as

```
Node #1 handleNetworking()
Node #1 handleNetworking()
Node #1 handleNetworking()
Node #1 handleNetworking()
Node #1 handleNetworking()
Node #1 receiveMessage() from Node #2 = lqi: 156  rssi: -91  data:   154.23,   16.56,   34.45
Node #1 receiveMessage() from Node #2 = lqi: 172  rssi: -91  data:   153.93,   16.89,   34.93
Node #1 receiveMessage() from Node #2 = lqi: 220  rssi: -91  data:   153.66,   17.18,   35.32
Node #1 receiveMessage() from Node #2 = lqi: 160  rssi: -91  data:   153.39,   17.43,   35.61
```

where `Node#1 represent the dongle`, `Node #2` represents the coin beacon.


**Calibrating IMU**

Follow the official Femtoduino's [instructions](https://femtoduino.com/examples/calibration-info). Note that the calibration utility `cal_gui.py` is in the FreeIMU-Updates folder that was forked in machine setup step 5.

Download processing and run the cube sketch to check for results.

Before starting to collect samples from the GUI, in Arduino's Serial Monitor, send a few "q" commands (reset IMU) with some time in between or a "r" command (reset quaternion matrix) for best results. See [post here](https://github.com/mjs513/FreeIMU-Updates/issues/3)

**Common Errors**

1. If serial port permission problems aren't setup correctly, we may see this error:

    `Caused by: processing.app.SerialException: Error touching serial port '/dev/ttyACM0'.`.

    Solve by adding your user account to the dialout group:

    `sudo usermod -a -G dialout yourUserName`

2. The FreeIMU's  variants of `getYawPitchRoll` methods doesn't actually give the yaw, pitch, and roll one may expect. In the comments for the method:

    ```
    Returns the yaw pitch and roll angles, respectively defined as the angles in radians between
    the Earth North and the IMU X axis (yaw), the Earth ground plane and the IMU X axis (pitch)
    and the Earth ground plane and the IMU Y axis.

    @note This is not an Euler representation: the rotations aren't consecutive rotations but only
    angles from Earth and the IMU. For Euler representation Yaw, Pitch and Roll see FreeIMU::getEuler
    ```

    The one that I expected is given by the `getEuler() method`:

    ```
    Returns the Euler angles in degrees defined with the Aerospace sequence.
    See Sebastian O.H. Madwick report "An efficient orientation filter for 
    inertial and intertial/magnetic sensor arrays" Chapter 2 Quaternion representation
    ```

3. After the previous step, we should have reasonable yaw, pitch, roll readings in degrees. However, the yaw reading may exhibit a huge drift/set point behavior -- while the beacon sits flat on a surface and is rotated along its z-axis, the yaw reading would initially change to some reasonable measurement, then drift back to the same value.

    As the magnetometer should be pretty stable, unless the environment has a lot of changing magnetic field, it would be due to how the sensor-fusion algorithm is updating the measurements. In `FreeIMU.h`, look for the lines:

    ```
    // Set filter type: 1 = Madgwick Gradient Descent, 0 - Madgwick implementation of Mahoney DCM
    // in Quaternion form, 3 = Madwick Original Paper AHRS, 4 - DCM Implementation
    #define MARG 3
    ```

    Out of the possible methods, only method 3 gives me yaw reading with a non-instant drift-time...
    
**Directories**

* `Arduino/libraries`: All the third-party libraries for lwmesh, RTCZero, FreeIMU_Updates. FreeIMU_Updates symbolic-linked to FreeIMU_Updates git repo.
* `.arduino/.../femtoduino../`: Arduino board-manager installed cores.


**References**

[Compilation issue](https://github.com/femtoduino/ArduinoCore-atsamd21e18a/issues/11)

[Magnetometer Reading Explanations](https://cdn-shop.adafruit.com/datasheets/AN203_Compass_Heading_Using_Magnetometers.pdf)

[Complementary Filters](http://www.pieter-jan.com/node/11)
