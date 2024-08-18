# SvitloPulse Config App

EN | [UA](./README-UA.md)

<img width="300" src="https://github.com/user-attachments/assets/8d9f39c7-8771-4e4f-bdbe-6d19fad1175c" />


A mobile application that allows you to configure:

- The name of the WiFi network that the device will use
- The password for this network
- The Svitlobot key

To set up the ESP32-C3 Super Mini device with the Svitlo Pulse firmware, follow these steps:

1. Download the application from the release page and install it on an Android smartphone.
2. The Android smartphone must be connected to a 2.5 GHz WiFi network. WiFi 5 GHz is not supported by ESP32-C3-based devices.
3. Connect the device to a power source.
4. Wait a few seconds. The LED on the board should blink continuously, indicating it is waiting for configuration.
5. Open the application, enter the network password and the Svitlobot key, and press "Configure." The setup process takes some time, but no more than a minute.
6. After configuration is complete, the application will display a notification saying "SvitloPulse has been successfully configured!" The device will restart and begin functioning.
7. If the WiFi network and Svitlobot key are correct, the device will send its first ping to the Svitlobot server within a minute, and you will receive a notification in Telegram.
