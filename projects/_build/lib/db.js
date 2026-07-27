/* ═══════════════════════════════════════════════════════════════════
   db.js — shared engineering knowledge base.

   COMPONENTS : real part specifications used to build accurate Bills of
                Materials, hardware specification tables, power budgets
                and datasheet links. Prices are indicative Indian retail
                (INR, 2026) and are labelled as such on the page.
   LIBRARIES  : software packages with install commands and purpose.
   IMAGES     : externally hosted reference photographs. Every entry
                carries the source page so attribution is verifiable.
════════════════════════════════════════════════════════════════════ */
'use strict';

/* ── COMPONENTS ─────────────────────────────────────────────────────
   id: { name, spec, volts, current_mA (typical active draw),
         iface, price (INR), datasheet, note }
──────────────────────────────────────────────────────────────────── */
const COMPONENTS = {
  /* ---- Controllers & compute ---- */
  esp32: { name: 'ESP32 DevKit V1 (ESP-WROOM-32)', spec: 'Dual-core Xtensa LX6 @ 240 MHz, 520 KB SRAM, 4 MB flash, Wi-Fi 802.11 b/g/n + BLE 4.2, 34 GPIO, 18× 12-bit ADC, 2× 8-bit DAC', volts: '3.3 V logic / 5 V USB', current_mA: 160, iface: 'UART, SPI, I²C, I²S, CAN, PWM', price: 450, datasheet: 'https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf', note: 'Wi-Fi transmit bursts peak near 500 mA — size the regulator accordingly.' },
  esp32cam: { name: 'ESP32-CAM (AI-Thinker) + OV2640', spec: 'ESP32-S chip, 4 MB PSRAM, 2 MP OV2640 camera, microSD slot, on-board LED flash', volts: '5 V in / 3.3 V logic', current_mA: 220, iface: 'UART (programmer required), SPI, I²C', price: 620, datasheet: 'https://loboris.eu/ESP32/ESP32-CAM%20Product%20Specification.pdf', note: 'No USB-serial on board — needs an FTDI/CP2102 adapter to flash.' },
  esp32s3: { name: 'ESP32-S3 DevKitC-1', spec: 'Dual-core Xtensa LX7 @ 240 MHz, 512 KB SRAM + 8 MB PSRAM, vector instructions for ML, Wi-Fi + BLE 5', volts: '3.3 V logic / 5 V USB', current_mA: 180, iface: 'USB-OTG, SPI, I²C, I²S, LCD/camera bus', price: 900, datasheet: 'https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf', note: 'The vector extensions roughly triple TinyML inference speed over the original ESP32.' },
  esp8266: { name: 'NodeMCU ESP8266 (ESP-12E)', spec: '80/160 MHz Tensilica L106, 80 KB user RAM, 4 MB flash, Wi-Fi 802.11 b/g/n, 11 usable GPIO, 1× 10-bit ADC', volts: '3.3 V logic / 5 V USB', current_mA: 80, iface: 'UART, SPI, I²C (bit-banged)', price: 280, datasheet: 'https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf', note: 'Single ADC pin limited to 0–1.0 V on the bare module; NodeMCU adds a divider for 0–3.3 V.' },
  uno: { name: 'Arduino Uno R3 (ATmega328P)', spec: '16 MHz AVR, 32 KB flash, 2 KB SRAM, 1 KB EEPROM, 14 digital I/O (6 PWM), 6× 10-bit ADC', volts: '5 V logic, 7–12 V barrel in', current_mA: 45, iface: 'UART, SPI, I²C', price: 700, datasheet: 'https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf', note: '2 KB of SRAM is the real constraint — keep strings in PROGMEM.' },
  nano: { name: 'Arduino Nano (ATmega328P)', spec: '16 MHz AVR, 32 KB flash, 2 KB SRAM, 22 I/O, 8× 10-bit ADC, breadboard-friendly DIP footprint', volts: '5 V logic', current_mA: 40, iface: 'UART, SPI, I²C', price: 350, datasheet: 'https://docs.arduino.cc/resources/datasheets/A000005-datasheet.pdf', note: 'Clone boards usually carry a CH340 USB chip — install the CH340 driver.' },
  mega: { name: 'Arduino Mega 2560', spec: '16 MHz AVR, 256 KB flash, 8 KB SRAM, 54 digital I/O (15 PWM), 16× ADC, 4 hardware UARTs', volts: '5 V logic', current_mA: 60, iface: '4× UART, SPI, I²C', price: 1300, datasheet: 'https://docs.arduino.cc/resources/datasheets/A000067-datasheet.pdf', note: 'Choose it when you run out of pins or need several hardware serial ports.' },
  rpi4: { name: 'Raspberry Pi 4 Model B (4 GB)', spec: 'Quad-core Cortex-A72 @ 1.8 GHz, 4 GB LPDDR4, Gigabit Ethernet, Wi-Fi 5, BT 5.0, 2× USB 3.0, 40-pin GPIO', volts: '5 V / 3 A USB-C', current_mA: 1200, iface: 'GPIO, SPI, I²C, UART, CSI, DSI', price: 5800, datasheet: 'https://datasheets.raspberrypi.com/rpi4/raspberry-pi-4-datasheet.pdf', note: 'Use an official 5 V 3 A supply — brown-outs from phone chargers corrupt SD cards.' },
  rpi5: { name: 'Raspberry Pi 5 (8 GB)', spec: 'Quad-core Cortex-A76 @ 2.4 GHz, 8 GB LPDDR4X, PCIe 2.0 ×1, dual 4K HDMI, RP1 southbridge', volts: '5 V / 5 A USB-C PD', current_mA: 1600, iface: 'GPIO, SPI, I²C, UART, 2× CSI/DSI, PCIe', price: 9500, datasheet: 'https://datasheets.raspberrypi.com/rpi5/raspberry-pi-5-product-brief.pdf', note: 'GPIO is behind the RP1 chip — legacy libraries need the lgpio/gpiod backend.' },
  rpizero2: { name: 'Raspberry Pi Zero 2 W', spec: 'Quad-core Cortex-A53 @ 1 GHz, 512 MB RAM, Wi-Fi 802.11n, BLE 4.2, CSI camera port', volts: '5 V / 2 A micro-USB', current_mA: 350, iface: 'GPIO, SPI, I²C, UART, CSI', price: 2200, datasheet: 'https://datasheets.raspberrypi.com/rpizero2/raspberry-pi-zero-2-w-product-brief.pdf', note: '512 MB RAM — enable 1 GB zram swap before running any vision model.' },
  jetson: { name: 'NVIDIA Jetson Nano 4 GB', spec: '128-core Maxwell GPU, quad Cortex-A57 @ 1.43 GHz, 4 GB LPDDR4, 472 GFLOPS FP16', volts: '5 V / 4 A barrel', current_mA: 2000, iface: 'GPIO, I²C, SPI, CSI ×2, USB 3.0', price: 15000, datasheet: 'https://developer.nvidia.com/embedded/jetson-nano', note: 'Set the 10 W power mode (`nvpmodel -m 0`) with the barrel jack for full GPU clocks.' },
  pico: { name: 'Raspberry Pi Pico W (RP2040)', spec: 'Dual Cortex-M0+ @ 133 MHz, 264 KB SRAM, 2 MB flash, 8 PIO state machines, Wi-Fi 802.11n', volts: '3.3 V logic / 5 V USB', current_mA: 50, iface: 'UART, SPI, I²C, PIO', price: 700, datasheet: 'https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf', note: 'PIO blocks let you bit-bang exotic protocols with zero CPU cost.' },
  stm32: { name: 'STM32F103C8T6 "Blue Pill"', spec: 'Cortex-M3 @ 72 MHz, 64 KB flash, 20 KB SRAM, 10× 12-bit ADC, 3× timers, CAN', volts: '3.3 V logic (5 V tolerant I/O)', current_mA: 35, iface: 'UART ×3, SPI ×2, I²C ×2, CAN, USB', price: 320, datasheet: 'https://www.st.com/resource/en/datasheet/stm32f103c8.pdf', note: 'Needs an ST-Link V2 to flash; many clones ship with the wrong USB pull-up resistor.' },

  /* ---- Environmental sensors ---- */
  dht22: { name: 'DHT22 / AM2302 temperature + humidity sensor', spec: '−40 to +80 °C ±0.5 °C, 0–100 %RH ±2 %, 0.5 Hz sample rate, single-wire digital', volts: '3.3–6 V', current_mA: 1.5, iface: '1-wire proprietary', price: 250, datasheet: 'https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf', note: 'Needs a 4.7 kΩ pull-up on the data line and 2 s between reads.' },
  dht11: { name: 'DHT11 temperature + humidity sensor', spec: '0–50 °C ±2 °C, 20–90 %RH ±5 %, 1 Hz, single-wire digital', volts: '3.3–5.5 V', current_mA: 1, iface: '1-wire proprietary', price: 90, datasheet: 'https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf', note: 'Cheap but coarse — step up to DHT22 or SHT31 if accuracy matters.' },
  bme280: { name: 'BME280 pressure/humidity/temperature sensor', spec: '300–1100 hPa ±1 hPa, 0–100 %RH ±3 %, −40 to +85 °C ±1 °C, 3.4 µA at 1 Hz', volts: '1.7–3.6 V (module has 3.3 V LDO)', current_mA: 0.4, iface: 'I²C (0x76/0x77) or SPI', price: 420, datasheet: 'https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf', note: 'Self-heating skews temperature by ~1 °C — read in forced mode, not continuous.' },
  ds18b20: { name: 'DS18B20 waterproof temperature probe', spec: '−55 to +125 °C, ±0.5 °C from −10 to +85 °C, 9–12-bit resolution, unique 64-bit ROM ID', volts: '3.0–5.5 V', current_mA: 1.5, iface: '1-Wire (multi-drop)', price: 160, datasheet: 'https://www.analog.com/media/en/technical-documentation/data-sheets/DS18B20.pdf', note: 'Dozens can share one GPIO — you address them by ROM code.' },
  mq2: { name: 'MQ-2 combustible gas / smoke sensor', spec: '300–10000 ppm LPG, propane, methane, hydrogen, smoke; analogue + digital output', volts: '5 V (heater)', current_mA: 150, iface: 'Analogue + comparator digital', price: 150, datasheet: 'https://www.pololu.com/file/0J309/MQ2.pdf', note: 'Needs 24–48 h burn-in and a stable 5 V; the heater alone draws ~150 mA.' },
  mq135: { name: 'MQ-135 air-quality sensor', spec: 'NH₃, NOx, benzene, smoke, CO₂ proxy, 10–1000 ppm, analogue output', volts: '5 V (heater)', current_mA: 150, iface: 'Analogue', price: 180, datasheet: 'https://www.winsen-sensor.com/d/files/PDF/Semiconductor%20Gas%20Sensor/MQ135%20(Ver1.4)%20-%20Manual.pdf', note: 'Not a true CO₂ sensor — calibrate against clean air (R0) before trusting ppm.' },
  mhz19: { name: 'MH-Z19B NDIR CO₂ sensor', spec: '0–5000 ppm ±(50 ppm + 5 %), NDIR, 60 s warm-up, UART + PWM output', volts: '4.5–5.5 V', current_mA: 60, iface: 'UART 9600 8N1, PWM', price: 2600, datasheet: 'https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19b-co2-ver1_0.pdf', note: 'Disable auto-baseline calibration (ABC) for sealed rooms or it drifts to 400 ppm.' },
  pms5003: { name: 'Plantower PMS5003 laser particulate sensor', spec: 'PM1.0 / PM2.5 / PM10, 0–500 µg/m³, ±10 %, laser scattering, 30 s stabilisation', volts: '5 V', current_mA: 100, iface: 'UART 9600', price: 1900, datasheet: 'https://www.aqmd.gov/docs/default-source/aq-spec/resources-page/plantower-pms5003-manual_v2-3.pdf', note: 'The fan is a wear item — run it in duty cycles, not continuously.' },
  bh1750: { name: 'BH1750 digital ambient light sensor', spec: '1–65535 lx, 16-bit, ±20 %, spectral response close to the human eye', volts: '2.4–3.6 V', current_mA: 0.19, iface: 'I²C (0x23/0x5C)', price: 140, datasheet: 'https://www.mouser.com/datasheet/2/348/bh1750fvi-e-186247.pdf', note: 'Far more linear than an LDR — use it whenever you need real lux, not a relative value.' },
  soil: { name: 'Capacitive soil-moisture sensor v2.0', spec: 'Corrosion-free capacitive sensing, 0–3 V analogue swing, 55 × 20 mm probe', volts: '3.3–5.5 V', current_mA: 5, iface: 'Analogue', price: 180, datasheet: 'https://wiki.dfrobot.com/Capacitive_Soil_Moisture_Sensor_SKU_SEN0193', note: 'Always pick capacitive over the cheap resistive fork — resistive probes corrode in weeks.' },
  ph: { name: 'Analogue pH sensor kit (E-201-C probe + BNC board)', spec: 'pH 0–14, ±0.1 pH at 25 °C, 5–60 °C, response < 1 min', volts: '5 V', current_mA: 8, iface: 'Analogue (offset trimmer)', price: 2400, datasheet: 'https://wiki.dfrobot.com/PH_meter_SKU__SEN0161_', note: 'Two-point calibrate with pH 4.00 and pH 6.86 buffers; store the probe wet.' },
  turbidity: { name: 'Turbidity sensor (TSD-10 style)', spec: '0–3000 NTU, analogue 0–4.5 V, IR transmission measurement', volts: '5 V', current_mA: 30, iface: 'Analogue + digital', price: 900, datasheet: 'https://wiki.dfrobot.com/Turbidity_sensor_SKU__SEN0189', note: 'Optical window fouls quickly — plan a wiper or weekly clean.' },
  ldr: { name: 'LDR (GL5528 photoresistor) + 10 kΩ divider', spec: '10–20 kΩ at 10 lx, 1 MΩ dark, peak response 540 nm', volts: 'any (passive)', current_mA: 0.3, iface: 'Analogue divider', price: 15, datasheet: 'https://cdn-shop.adafruit.com/datasheets/GL5537.pdf', note: 'Cheap and rugged, but non-linear and unit-to-unit variation is large.' },
  rain: { name: 'Rain / water-level board (FC-37)', spec: 'Interdigitated PCB electrode, analogue + digital comparator output', volts: '3.3–5 V', current_mA: 15, iface: 'Analogue + digital', price: 90, datasheet: 'https://components101.com/sensors/rain-drop-sensor-module', note: 'Drive the electrode with AC or duty-cycle its power to slow electrolytic corrosion.' },
  waterflow: { name: 'YF-S201 hall-effect water flow sensor', spec: '1–30 L/min, ±10 %, 450 pulses per litre, ½″ BSP thread, ≤ 1.75 MPa', volts: '5–18 V', current_mA: 15, iface: 'Open-collector pulse', price: 350, datasheet: 'https://www.hobbytronics.co.uk/datasheets/sensors/YF-S201.pdf', note: 'Count pulses on a hardware interrupt; the K-factor changes with pipe orientation.' },

  /* ---- Motion, distance, position ---- */
  hcsr04: { name: 'HC-SR04 ultrasonic distance sensor', spec: '2–400 cm, ±3 mm, 15° beam, 40 kHz, 10 µs trigger pulse', volts: '5 V', current_mA: 15, iface: 'Trigger/Echo digital', price: 90, datasheet: 'https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf', note: 'Echo pin outputs 5 V — divide it down before feeding a 3.3 V ESP32.' },
  jsnsr04t: { name: 'JSN-SR04T waterproof ultrasonic sensor', spec: '25–450 cm, ±1 cm, IP67 sealed transducer, 45° beam', volts: '5 V', current_mA: 30, iface: 'Trigger/Echo or UART', price: 450, datasheet: 'https://www.jsnsensor.com/', note: 'The 25 cm blind zone matters — mount it above the maximum expected water level.' },
  vl53l0x: { name: 'VL53L0X time-of-flight laser ranger', spec: '30–2000 mm, ±3 %, 940 nm VCSEL, up to 50 Hz', volts: '2.6–3.5 V', current_mA: 19, iface: 'I²C (0x29)', price: 620, datasheet: 'https://www.st.com/resource/en/datasheet/vl53l0x.pdf', note: 'Immune to acoustic noise and soft surfaces where ultrasonic fails.' },
  pir: { name: 'HC-SR501 PIR motion sensor', spec: '3–7 m range, 110° cone, 0.3–200 s adjustable hold, 5 µA idle', volts: '4.5–20 V', current_mA: 0.05, iface: 'Digital high on motion', price: 80, datasheet: 'https://www.mpja.com/download/31227sc.pdf', note: 'Give it 60 s to settle after power-up or it fires false triggers.' },
  mpu6050: { name: 'MPU-6050 6-axis IMU', spec: '3-axis gyro ±250–2000 °/s, 3-axis accel ±2–16 g, 16-bit ADC, on-chip DMP', volts: '2.375–3.46 V (module 5 V tolerant)', current_mA: 3.9, iface: 'I²C (0x68/0x69)', price: 190, datasheet: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf', note: 'Gyro bias drifts with temperature — re-zero at boot while the device is still.' },
  mpu9250: { name: 'MPU-9250 9-axis IMU', spec: 'Gyro + accel + AK8963 magnetometer, 16-bit, on-chip sensor fusion DMP', volts: '2.4–3.6 V', current_mA: 4.5, iface: 'I²C / SPI', price: 620, datasheet: 'https://invensense.tdk.com/wp-content/uploads/2015/02/PS-MPU-9250A-01-v1.1.pdf', note: 'Magnetometer needs a figure-of-eight hard/soft-iron calibration.' },
  adxl345: { name: 'ADXL345 3-axis accelerometer', spec: '±2/4/8/16 g, 13-bit, 0.004 g/LSB, tap and free-fall interrupts, 3200 Hz', volts: '2.0–3.6 V', current_mA: 0.14, iface: 'I²C / SPI', price: 220, datasheet: 'https://www.analog.com/media/en/technical-documentation/data-sheets/ADXL345.pdf', note: 'Built-in activity/free-fall interrupts let the MCU deep-sleep until something moves.' },
  neo6m: { name: 'u-blox NEO-6M GPS module + ceramic patch antenna', spec: '50 channels, −161 dBm tracking, 2.5 m CEP, 1–5 Hz update, cold start 27 s', volts: '3.3–5 V', current_mA: 45, iface: 'UART NMEA 9600', price: 550, datasheet: 'https://content.u-blox.com/sites/default/files/products/documents/NEO-6_DataSheet_%28GPS.G6-HW-09005%29.pdf', note: 'Needs clear sky view; indoors it will never get a first fix.' },
  loadcell: { name: '5 kg load cell + HX711 24-bit ADC', spec: 'Strain-gauge bridge, 1.0 mV/V output, HX711 128× gain, 10/80 SPS', volts: '2.6–5.5 V', current_mA: 1.5, iface: '2-wire serial (bit-banged)', price: 320, datasheet: 'https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf', note: 'Mechanical mounting dominates accuracy — bolt it to a rigid plate, not plastic.' },
  fsr: { name: 'FSR-402 force-sensitive resistor', spec: '0.2–20 N, 12.7 mm active area, 100 kΩ–2 kΩ swing, < 1 ms response', volts: 'passive', current_mA: 1, iface: 'Analogue divider', price: 700, datasheet: 'https://www.interlinkelectronics.com/fsr-402', note: 'Not a precision scale — good for presence and relative pressure only.' },
  ir_sensor: { name: 'TCRT5000 IR reflectance sensor module', spec: '1–8 mm optimum sensing gap, 950 nm emitter, analogue + digital out', volts: '3.3–5 V', current_mA: 20, iface: 'Analogue + digital', price: 45, datasheet: 'https://www.vishay.com/docs/83760/tcrt5000.pdf', note: 'Ambient sunlight saturates it — shroud the sensor on outdoor robots.' },
  encoder: { name: 'Quadrature rotary encoder (600 PPR optical)', spec: '600 pulses/rev, A/B/Z channels, 5–24 V open collector, 5000 rpm max', volts: '5–24 V', current_mA: 40, iface: 'Quadrature pulses', price: 950, datasheet: 'https://www.omron.com/global/en/products/family/1852/', note: '4× decoding gives 2400 counts/rev — use a hardware timer in encoder mode.' },

  /* ---- Identification / input ---- */
  rc522: { name: 'MFRC522 13.56 MHz RFID reader + card + fob', spec: 'ISO/IEC 14443A, MIFARE Classic 1K, 0–60 mm range, up to 10 Mbit/s SPI', volts: '2.5–3.6 V', current_mA: 26, iface: 'SPI (also I²C/UART)', price: 180, datasheet: 'https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf', note: 'Strictly 3.3 V — 5 V on the SPI pins kills the chip.' },
  pn532: { name: 'PN532 NFC/RFID module', spec: 'ISO14443A/B, FeliCa, NFC peer-to-peer, card emulation, 50 mm range', volts: '3.3 V', current_mA: 100, iface: 'I²C / SPI / HSU', price: 900, datasheet: 'https://www.nxp.com/docs/en/nxp/data-sheets/PN532_C1.pdf', note: 'Reads phone NFC too — the DIP switches select the bus, set them before wiring.' },
  keypad: { name: '4×4 matrix membrane keypad', spec: '16 keys, 8-wire matrix, 35 × 76 mm adhesive-backed', volts: 'logic level', current_mA: 1, iface: '8 GPIO matrix scan', price: 70, datasheet: 'https://components101.com/misc/4x4-keypad-module-pinout-configuration-features-datasheet', note: 'Debounce in software — 20 ms is enough for membrane keys.' },
  fingerprint: { name: 'R307 optical fingerprint sensor', spec: '500 dpi, 1000-template storage, < 1 s match, FAR < 0.001 %', volts: '3.6–6 V', current_mA: 65, iface: 'UART 57600', price: 1500, datasheet: 'https://components101.com/sensors/r307-optical-fingerprint-sensor-module', note: 'Enrol each finger three times at different angles for reliable matching.' },

  /* ---- Displays & indicators ---- */
  oled: { name: '0.96″ SSD1306 OLED display', spec: '128 × 64 monochrome, 1.3–3.3 V logic, 100 kHz–400 kHz I²C', volts: '3.3–5 V', current_mA: 20, iface: 'I²C (0x3C)', price: 250, datasheet: 'https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf', note: 'Static images burn in — invert or scroll the screen periodically.' },
  lcd1602: { name: '16×2 character LCD + PCF8574 I²C backpack', spec: 'HD44780 controller, 16 × 2 characters, LED backlight', volts: '5 V', current_mA: 30, iface: 'I²C (0x27/0x3F)', price: 180, datasheet: 'https://www.sparkfun.com/datasheets/LCD/HD44780.pdf', note: 'The I²C backpack turns 6 wires into 2 — worth the ₹40.' },
  tft: { name: '2.4″ ILI9341 SPI TFT (240 × 320)', spec: '262 K colour, 40 MHz SPI, optional resistive touch controller', volts: '3.3 V', current_mA: 90, iface: 'SPI', price: 750, datasheet: 'https://cdn-shop.adafruit.com/datasheets/ILI9341.pdf', note: 'Backlight is most of the current — PWM it for battery builds.' },
  neopixel: { name: 'WS2812B addressable RGB LED strip (60 LED/m)', spec: '5 V, 60 mA per LED at full white, 800 kHz single-wire protocol, 8-bit per channel', volts: '5 V', current_mA: 60, iface: '1-wire timed protocol', price: 900, datasheet: 'https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf', note: 'Budget 60 mA × LED count; add a 1000 µF cap and a 330 Ω series resistor on data.' },
  buzzer: { name: 'Active piezo buzzer 5 V', spec: '85 dB at 10 cm, 2.3 kHz resonance, 12 mm diameter', volts: '3–5 V', current_mA: 30, iface: 'Digital / PWM', price: 25, datasheet: 'https://components101.com/misc/buzzer-pinout-working-datasheet', note: 'Active buzzers make tone on DC; passive ones need a PWM carrier.' },

  /* ---- Power & actuation ---- */
  relay1: { name: '5 V single-channel opto-isolated relay module', spec: 'SPDT contacts rated 10 A @ 250 VAC / 10 A @ 30 VDC, opto-isolated input', volts: '5 V coil', current_mA: 70, iface: 'Digital (active-low)', price: 90, datasheet: 'https://components101.com/switches/5v-single-channel-relay-module-pinout-features-applications-working-datasheet', note: 'Cut the JD-VCC jumper and feed the coil separately for true isolation.' },
  relay4: { name: '4-channel opto-isolated relay board', spec: '4 × SPDT, 10 A @ 250 VAC, active-low inputs, LED per channel', volts: '5 V coil', current_mA: 280, iface: '4× digital', price: 280, datasheet: 'https://components101.com/switches/5v-four-channel-relay-module-pinout-features-applications-working-datasheet', note: 'All four coils energised draw ~280 mA — do not power from the MCU 5 V pin.' },
  ssr: { name: 'SSR-25DA solid-state relay', spec: '24–380 VAC load, 25 A, 3–32 VDC control, zero-cross switching', volts: '3–32 VDC control', current_mA: 15, iface: 'Digital', price: 550, datasheet: 'https://www.fotek.com.hk/solid/SSR-1.htm', note: 'Silent and good for PWM heating, but it must have a heatsink above ~5 A.' },
  sg90: { name: 'SG90 9 g micro servo', spec: '1.8 kg·cm at 4.8 V, 0.1 s/60°, 180° travel, plastic gears, 50 Hz PWM', volts: '4.8–6 V', current_mA: 200, iface: 'PWM 500–2400 µs', price: 130, datasheet: 'https://components101.com/servo-motor-basics-pinout-datasheet', note: 'Stall current hits 700 mA — never power servos from the board 5 V rail.' },
  mg996r: { name: 'MG996R metal-gear servo', spec: '11 kg·cm at 6 V, 0.17 s/60°, metal gears, dual ball bearings', volts: '4.8–7.2 V', current_mA: 500, iface: 'PWM 50 Hz', price: 380, datasheet: 'https://components101.com/motors/mg996r-servo-motor-datasheet', note: 'Draws up to 2.5 A stalled — a 6 V 5 A supply per 4–6 servos is realistic.' },
  n20: { name: 'N20 micro gear motor (6 V, 200 rpm) with encoder', spec: '6 V, 200 rpm, 0.4 kg·cm, 12 mm × 10 mm gearbox, magnetic encoder', volts: '3–9 V', current_mA: 120, iface: 'PWM + H-bridge', price: 420, datasheet: 'https://www.pololu.com/category/60/micro-metal-gearmotors', note: 'The encoder makes closed-loop speed control trivial — worth the extra cost.' },
  bo_motor: { name: 'BO gear motor 300 rpm + wheel', spec: '3–12 V, 300 rpm at 6 V, 0.8 kg·cm, plastic dual-shaft gearbox', volts: '3–12 V', current_mA: 200, iface: 'PWM + H-bridge', price: 150, datasheet: 'https://components101.com/motors/bo-motor-datasheet', note: 'No two BO motors run at the same speed — closed-loop or trim in software.' },
  l298n: { name: 'L298N dual H-bridge motor driver', spec: '2 × 2 A continuous, 5–35 V motor supply, 4.9 V logic regulator on board', volts: '5–35 V', current_mA: 36, iface: 'IN1–IN4 + 2 PWM', price: 180, datasheet: 'https://www.st.com/resource/en/datasheet/l298.pdf', note: 'Bipolar transistors drop ~2 V per side — TB6612FNG is far more efficient.' },
  tb6612: { name: 'TB6612FNG dual MOSFET motor driver', spec: '2 × 1.2 A continuous (3.2 A peak), 2.5–13.5 V motors, 100 kHz PWM', volts: '2.7–5.5 V logic', current_mA: 1.5, iface: 'AIN/BIN + PWM + STBY', price: 260, datasheet: 'https://www.sparkfun.com/datasheets/Robotics/TB6612FNG.pdf', note: 'MOSFET output means ~0.5 V drop — noticeably more runtime than an L298N.' },
  a4988: { name: 'A4988 stepper driver + NEMA 17 motor', spec: '1.5 A/phase with heatsink, 1/16 microstepping, 8–35 V; NEMA 17 = 4.4 kg·cm', volts: '8–35 V', current_mA: 1500, iface: 'STEP/DIR', price: 750, datasheet: 'https://www.pololu.com/file/0J450/a4988_DMOS_microstepping_driver_with_translator.pdf', note: 'Set Vref = I_max × 8 × Rsense before the first move or you cook the driver.' },
  pump: { name: '5 V submersible mini water pump', spec: '80–120 L/h, 0.4–1.5 m head, 5 V DC, 5 mm outlet', volts: '3–6 V', current_mA: 220, iface: 'Relay / MOSFET', price: 160, datasheet: 'https://components101.com/motors/5v-submersible-mini-water-pump', note: 'Never run it dry; add a flyback diode across the motor terminals.' },
  solenoid: { name: '12 V solenoid valve (½″, normally closed)', spec: '0.02–0.8 MPa, 12 V DC, 8 W, brass body', volts: '12 V', current_mA: 650, iface: 'Relay / MOSFET + flyback diode', price: 650, datasheet: 'https://components101.com/misc/solenoid-valve', note: 'Continuous energising heats the coil — use latching valves for battery builds.' },

  /* ---- Radio & connectivity ---- */
  lora: { name: 'SX1278 LoRa 433 MHz module (Ra-02)', spec: '−148 dBm sensitivity, +20 dBm output, up to 10 km line of sight, SF7–SF12', volts: '3.3 V', current_mA: 120, iface: 'SPI', price: 480, datasheet: 'https://www.semtech.com/products/wireless-rf/lora-connect/sx1278', note: 'Never power the radio without an antenna — the PA will destroy itself.' },
  sim800: { name: 'SIM800L GSM/GPRS module', spec: 'Quad-band 850/900/1800/1900 MHz, GPRS class 12, SMS + TCP/IP', volts: '3.4–4.4 V (NOT 5 V)', current_mA: 2000, iface: 'UART AT commands', price: 550, datasheet: 'https://simcom.ee/documents/SIM800L/SIM800L_Hardware_Design_V1.00.pdf', note: 'Transmit bursts hit 2 A — needs a 4.0 V supply and a 1000 µF bulk capacitor.' },
  nrf24: { name: 'nRF24L01+ 2.4 GHz transceiver', spec: '2 Mbps, 1–100 m, 126 channels, 6 data pipes, ShockBurst auto-ACK', volts: '1.9–3.6 V', current_mA: 12, iface: 'SPI', price: 120, datasheet: 'https://infocenter.nordicsemi.com/pdf/nRF24L01P_PS_v1.0.pdf', note: 'Solder a 10 µF capacitor across VCC/GND at the module or links drop randomly.' },
  hc05: { name: 'HC-05 Bluetooth 2.0 SPP module', spec: 'Class 2, 10 m, 2.4 GHz, master/slave, 9600–460800 baud', volts: '3.6–6 V (3.3 V logic)', current_mA: 40, iface: 'UART', price: 300, datasheet: 'https://components101.com/wireless/hc-05-bluetooth-module', note: 'RX pin is 3.3 V — use a divider from a 5 V Arduino TX.' },
  rs485: { name: 'MAX485 RS-485 transceiver module', spec: 'Half-duplex differential bus, up to 1200 m, 2.5 Mbps, 32 nodes', volts: '5 V', current_mA: 5, iface: 'UART + DE/RE control', price: 60, datasheet: 'https://www.analog.com/media/en/technical-documentation/data-sheets/MAX1487-MAX491.pdf', note: 'Terminate both ends with 120 Ω and use twisted pair for long runs.' },

  /* ---- Metering & power electronics ---- */
  pzem004t: { name: 'PZEM-004T v3 AC energy meter (100 A CT)', spec: '80–260 VAC, 0–100 A, voltage/current/power/energy/PF/frequency, ±0.5 %', volts: '5 V logic side', current_mA: 20, iface: 'UART Modbus-RTU 9600', price: 950, datasheet: 'https://innovatorsguru.com/wp-content/uploads/2019/06/PZEM-004T-V3.0-Datasheet-User-Manual.pdf', note: 'The measurement side sits at mains potential — the opto-isolated UART is the only safe boundary.' },
  acs712: { name: 'ACS712 hall-effect current sensor (20 A)', spec: '±20 A, 100 mV/A, 80 kHz bandwidth, 1.2 mΩ internal resistance, 2.1 kV isolation', volts: '5 V', current_mA: 10, iface: 'Analogue', price: 180, datasheet: 'https://www.allegromicro.com/-/media/files/datasheets/acs712-datasheet.ashx', note: 'Zero-offset drifts with temperature — re-zero at boot with no load.' },
  ina219: { name: 'INA219 high-side DC current/power monitor', spec: '0–26 V bus, ±3.2 A with 0.1 Ω shunt, 12-bit, ±0.5 % gain error', volts: '3–5.5 V', current_mA: 1, iface: 'I²C (0x40–0x4F)', price: 260, datasheet: 'https://www.ti.com/lit/ds/symlink/ina219.pdf', note: 'Reports bus voltage, shunt voltage, current and power directly — no maths needed.' },
  zmpt101b: { name: 'ZMPT101B AC voltage sensor', spec: '0–250 VAC input, 2 mA:2 mA precision transformer, ±1 % linearity', volts: '5 V', current_mA: 20, iface: 'Analogue', price: 220, datasheet: 'https://components101.com/sensors/zmpt101b-voltage-sensor-module', note: 'Trim the on-board pot so the idle output sits exactly at Vcc/2.' },
  buck: { name: 'LM2596 adjustable buck converter module', spec: '4.5–40 V in, 1.25–37 V out, 2 A (3 A peak), ~92 % efficiency', volts: '4.5–40 V', current_mA: 8, iface: 'Screw terminals + trimmer', price: 90, datasheet: 'https://www.ti.com/lit/ds/symlink/lm2596.pdf', note: 'Set the output voltage with no load connected before wiring the board.' },
  tp4056: { name: 'TP4056 Li-ion charger + DW01 protection', spec: '1 A programmable CC/CV charge to 4.2 V ±1 %, over-discharge and short protection', volts: '4.5–5.5 V in', current_mA: 1000, iface: 'micro-USB / pads', price: 45, datasheet: 'https://dlnmh9ip6v2uc.cloudfront.net/datasheets/Prototyping/TP4056.pdf', note: 'Buy the version *with* protection ICs — the bare charger will over-discharge your cell.' },
  li18650: { name: '18650 Li-ion cell 3400 mAh + holder', spec: '3.7 V nominal, 4.2 V full, 3400 mAh, ~12.6 Wh, 2 C discharge', volts: '3.0–4.2 V', current_mA: 0, iface: 'Holder / spot-welded tabs', price: 450, datasheet: 'https://www.orbtronic.com/content/Samsung-INR18650-35E-Datasheet-Gest.pdf', note: 'Never charge below 0 °C; always use a protected cell or a BMS.' },
  solarpanel: { name: '20 W 12 V polycrystalline solar panel', spec: 'Vmp 17.5 V, Imp 1.14 A, Voc 21.6 V, 350 × 290 mm, aluminium frame', volts: '12 V nominal', current_mA: 1140, iface: 'MC4 / screw terminals', price: 1200, datasheet: 'https://www.solarpowerworldonline.com/', note: 'Rated watts assume 1000 W/m² — plan for 60–70 % of nameplate in real installs.' },
  mppt: { name: 'CN3791 MPPT solar charge controller', spec: '4.5–28 V in, MPPT set by resistor divider, 2 A charge to a 1S Li-ion pack', volts: '4.5–28 V', current_mA: 2000, iface: 'Solder pads', price: 320, datasheet: 'https://www.consonance-elec.com/pdf/datasheet/DSE-CN3791.pdf', note: 'Set the MPPT point to ~80 % of panel Voc for polycrystalline modules.' },

  /* ---- Mechanical / misc ---- */
  breadboard: { name: '830-point solderless breadboard + jumper set', spec: '830 tie points, 2 power rails, 0.1″ pitch; 65 male-male jumpers', volts: '—', current_mA: 0, iface: '—', price: 180, datasheet: 'https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard', note: 'Fine for prototyping; move to perfboard before anything permanent.' },
  perfboard: { name: 'Double-sided perfboard 7 × 9 cm + headers', spec: 'FR-4, 0.1″ pitch, plated through-holes, 24 × 18 grid', volts: '—', current_mA: 0, iface: '—', price: 60, datasheet: 'https://en.wikipedia.org/wiki/Perfboard', note: 'Solder female headers so the MCU can be swapped without desoldering.' },
  enclosure: { name: 'IP65 ABS junction enclosure 158 × 90 × 60 mm', spec: 'IP65, ABS, −20 to +80 °C, transparent lid, wall-mount lugs', volts: '—', current_mA: 0, iface: '—', price: 260, datasheet: 'https://en.wikipedia.org/wiki/IP_Code', note: 'Fit cable glands, not drilled holes, or the IP rating means nothing.' },
  psu5v: { name: '5 V 3 A regulated SMPS adapter', spec: '100–240 VAC in, 5 V ±5 % out, 3 A, short-circuit and over-voltage protection', volts: '5 V', current_mA: 3000, iface: 'DC barrel / USB', price: 350, datasheet: 'https://en.wikipedia.org/wiki/Switched-mode_power_supply', note: 'Measure the real output — many "3 A" adapters sag below 4.7 V at 2 A.' },
  psu12v: { name: '12 V 5 A SMPS adapter', spec: '100–240 VAC in, 12 V ±5 %, 5 A, 60 W, DC 5.5 × 2.1 mm barrel', volts: '12 V', current_mA: 5000, iface: 'DC barrel', price: 650, datasheet: 'https://en.wikipedia.org/wiki/Switched-mode_power_supply', note: 'Fuse the 12 V rail at ~1.5× your calculated draw.' },
  webcam: { name: 'USB webcam 1080p (UVC class)', spec: '1920 × 1080 @ 30 fps, MJPEG + YUY2, UVC — no driver needed on Linux', volts: '5 V USB', current_mA: 250, iface: 'USB 2.0', price: 1200, datasheet: 'https://www.usb.org/document-library/video-class-v15-document-set', note: 'Check `v4l2-ctl --list-formats-ext` — MJPEG at 30 fps beats raw YUY2 at 5 fps.' },
  picam: { name: 'Raspberry Pi Camera Module 3', spec: '12 MP IMX708, autofocus, HDR, 1080p50, CSI-2 ribbon', volts: '3.3 V via CSI', current_mA: 250, iface: 'CSI-2', price: 2600, datasheet: 'https://datasheets.raspberrypi.com/camera/camera-module-3-product-brief.pdf', note: 'Pi 5 uses a narrower 22-pin CSI cable — the old 15-pin ribbon will not fit.' },
  sdcard: { name: 'microSD card 32 GB A1 class', spec: 'A1 rated, 10 MB/s random write, UHS-I, endurance-grade recommended', volts: '3.3 V', current_mA: 100, iface: 'SDIO / SPI', price: 450, datasheet: 'https://www.sdcard.org/developers/sd-standard-overview/application-performance-class/', note: 'For 24/7 loggers buy a high-endurance card — normal cards die in months.' },
  rtc: { name: 'DS3231 precision RTC + CR2032 backup', spec: '±2 ppm (±1 min/year), temperature-compensated crystal, alarms, 32 kHz out', volts: '2.3–5.5 V', current_mA: 0.2, iface: 'I²C (0x68)', price: 180, datasheet: 'https://www.analog.com/media/en/technical-documentation/data-sheets/DS3231.pdf', note: 'Vastly better than DS1307; some boards trickle-charge a non-rechargeable cell — cut that resistor.' },
  levelshift: { name: '4-channel bidirectional logic level shifter (BSS138)', spec: '1.8–5 V translation, 4 channels, up to ~400 kHz on I²C', volts: '1.8–5 V', current_mA: 1, iface: 'Pass-through', price: 60, datasheet: 'https://cdn.sparkfun.com/datasheets/BreakoutBoards/Logic_Level_Bidirectional.pdf', note: 'MOSFET shifters are fine for I²C, too slow for fast SPI — use a proper buffer there.' },
};

/* ── LIBRARIES ─────────────────────────────────────────────────── */
const LIBRARIES = {
  /* Arduino / PlatformIO */
  wifi: { name: 'WiFi (ESP32 core)', v: 'bundled', why: 'Station/AP connection management for the ESP32.', install: 'Bundled with the ESP32 Arduino core', eco: 'arduino' },
  esp8266wifi: { name: 'ESP8266WiFi', v: 'bundled', why: 'Wi-Fi stack for the ESP8266 core.', install: 'Bundled with the ESP8266 Arduino core', eco: 'arduino' },
  pubsub: { name: 'PubSubClient', v: '2.8', why: 'Lightweight MQTT 3.1.1 client for constrained devices.', install: 'Library Manager → "PubSubClient" by Nick O\'Leary', eco: 'arduino' },
  httpclient: { name: 'HTTPClient', v: 'bundled', why: 'REST calls to cloud endpoints over HTTP/HTTPS.', install: 'Bundled with the ESP32 core', eco: 'arduino' },
  arduinojson: { name: 'ArduinoJson', v: '7.x', why: 'Zero-allocation JSON serialisation and parsing.', install: 'Library Manager → "ArduinoJson" by Benoit Blanchon', eco: 'arduino' },
  dhtlib: { name: 'DHT sensor library', v: '1.4.6', why: 'Timing-critical driver for DHT11/DHT22.', install: 'Library Manager → "DHT sensor library" by Adafruit', eco: 'arduino' },
  unified: { name: 'Adafruit Unified Sensor', v: '1.1.x', why: 'Common sensor event abstraction; a dependency of most Adafruit drivers.', install: 'Library Manager → "Adafruit Unified Sensor"', eco: 'arduino' },
  ssd1306: { name: 'Adafruit SSD1306 + GFX', v: '2.5.x', why: 'Framebuffer and text/graphics primitives for the OLED.', install: 'Library Manager → "Adafruit SSD1306"', eco: 'arduino' },
  lcdi2c: { name: 'LiquidCrystal_I2C', v: '1.1.4', why: 'HD44780 character LCD over a PCF8574 backpack.', install: 'Library Manager → "LiquidCrystal I2C" by Frank de Brabander', eco: 'arduino' },
  mfrc522: { name: 'MFRC522', v: '1.4.x', why: 'SPI driver and MIFARE authentication for the RC522 reader.', install: 'Library Manager → "MFRC522" by GithubCommunity', eco: 'arduino' },
  servo: { name: 'ESP32Servo / Servo', v: '3.0.x', why: '50 Hz PWM generation with correct pulse widths for hobby servos.', install: 'Library Manager → "ESP32Servo" by Kevin Harrington', eco: 'arduino' },
  onewire: { name: 'OneWire + DallasTemperature', v: '2.3.x / 3.9.x', why: 'Bus enumeration and conversion commands for DS18B20 probes.', install: 'Library Manager → "DallasTemperature" (pulls OneWire)', eco: 'arduino' },
  mpu: { name: 'MPU6050_light / Adafruit MPU6050', v: '1.3.x', why: 'IMU register access, calibration and complementary-filter angles.', install: 'Library Manager → "MPU6050_light" by rfetick', eco: 'arduino' },
  tinygps: { name: 'TinyGPSPlus', v: '1.0.3', why: 'Streaming NMEA parser producing latitude, longitude, speed and time.', install: 'Library Manager → "TinyGPSPlus" by Mikal Hart', eco: 'arduino' },
  hx711: { name: 'HX711', v: '0.7.x', why: 'Bit-banged 24-bit ADC read with tare and calibration factor.', install: 'Library Manager → "HX711" by Bogdan Necula', eco: 'arduino' },
  lorolib: { name: 'LoRa (sandeepmistry)', v: '0.8.0', why: 'SX127x radio configuration, packet TX/RX and callbacks.', install: 'Library Manager → "LoRa" by Sandeep Mistry', eco: 'arduino' },
  rf24: { name: 'RF24', v: '1.4.x', why: 'nRF24L01+ pipes, auto-ACK and dynamic payloads.', install: 'Library Manager → "RF24" by TMRh20', eco: 'arduino' },
  bme: { name: 'Adafruit BME280', v: '2.2.x', why: 'Compensation maths for the Bosch pressure/humidity/temperature sensor.', install: 'Library Manager → "Adafruit BME280 Library"', eco: 'arduino' },
  bh1750lib: { name: 'BH1750', v: '1.3.0', why: 'Digital lux readings with selectable resolution modes.', install: 'Library Manager → "BH1750" by Christopher Laws', eco: 'arduino' },
  preferences: { name: 'Preferences (NVS)', v: 'bundled', why: 'Wear-levelled key/value storage in ESP32 flash for settings.', install: 'Bundled with the ESP32 core', eco: 'arduino' },
  wifimanager: { name: 'WiFiManager', v: '2.0.x', why: 'Captive-portal Wi-Fi provisioning — no hard-coded credentials.', install: 'Library Manager → "WiFiManager" by tzapu', eco: 'arduino' },
  ntp: { name: 'NTPClient / configTime', v: 'bundled', why: 'Wall-clock time from an NTP server for timestamping.', install: 'Bundled (`configTime()` on ESP32)', eco: 'arduino' },
  blynk: { name: 'Blynk', v: '1.3.x', why: 'Hosted dashboard, mobile app widgets and device provisioning.', install: 'Library Manager → "Blynk" by Volodymyr Shymanskyy', eco: 'arduino' },
  fastled: { name: 'FastLED', v: '3.6.x', why: 'Timing-exact WS2812B driver with colour-correction and palettes.', install: 'Library Manager → "FastLED"', eco: 'arduino' },
  pid: { name: 'PID_v1', v: '1.2.1', why: 'Proportional-integral-derivative controller with anti-windup.', install: 'Library Manager → "PID" by Brett Beauregard', eco: 'arduino' },
  modbus: { name: 'ModbusMaster', v: '2.0.1', why: 'Modbus-RTU master framing for RS-485 meters and drives.', install: 'Library Manager → "ModbusMaster" by Doc Walker', eco: 'arduino' },
  esptask: { name: 'FreeRTOS (ESP-IDF)', v: 'bundled', why: 'Task scheduling so networking never blocks sensor sampling.', install: 'Bundled with the ESP32 core', eco: 'arduino' },
  tflmicro: { name: 'TensorFlow Lite for Microcontrollers', v: '2.4.0-alpha', why: 'Int8 neural-network inference inside 200 KB of RAM.', install: 'Library Manager → "TensorFlowLite_ESP32"', eco: 'arduino' },
  edgeimpulse: { name: 'Edge Impulse Arduino SDK', v: 'per-project export', why: 'Deployable C++ bundle of a trained TinyML classifier.', install: 'Sketch → Include Library → Add .ZIP from the Edge Impulse export', eco: 'arduino' },

  /* Python */
  python: { name: 'Python', v: '3.11+', why: 'Runtime for the analysis, training and service code.', install: 'sudo apt install python3 python3-venv python3-pip', eco: 'python' },
  numpy: { name: 'NumPy', v: '1.26+', why: 'Vectorised array maths underpinning every other library here.', install: 'pip install numpy', eco: 'python' },
  pandas: { name: 'pandas', v: '2.2+', why: 'Tabular data loading, cleaning and time-series resampling.', install: 'pip install pandas', eco: 'python' },
  opencv: { name: 'OpenCV', v: '4.10+', why: 'Frame capture, colour conversion, drawing and classical CV operators.', install: 'pip install opencv-python', eco: 'python' },
  torch: { name: 'PyTorch', v: '2.4+', why: 'Model definition, autograd and GPU training.', install: 'pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121', eco: 'python' },
  tf: { name: 'TensorFlow / Keras', v: '2.17+', why: 'High-level model building and the TFLite converter.', install: 'pip install tensorflow', eco: 'python' },
  sklearn: { name: 'scikit-learn', v: '1.5+', why: 'Classical models, preprocessing pipelines and evaluation metrics.', install: 'pip install scikit-learn', eco: 'python' },
  ultralytics: { name: 'Ultralytics YOLO', v: '8.3+', why: 'Training and inference API for YOLOv8/v11 detectors.', install: 'pip install ultralytics', eco: 'python' },
  mediapipe: { name: 'MediaPipe', v: '0.10+', why: 'Pre-trained hand, pose and face landmark graphs that run on CPU.', install: 'pip install mediapipe', eco: 'python' },
  paho: { name: 'paho-mqtt', v: '2.1+', why: 'MQTT client for subscribing to device telemetry.', install: 'pip install paho-mqtt', eco: 'python' },
  flask: { name: 'Flask', v: '3.0+', why: 'Minimal HTTP API and dashboard server.', install: 'pip install flask', eco: 'python' },
  fastapi: { name: 'FastAPI + Uvicorn', v: '0.115+', why: 'Typed async REST API with automatic OpenAPI docs.', install: 'pip install fastapi uvicorn[standard]', eco: 'python' },
  streamlit: { name: 'Streamlit', v: '1.38+', why: 'One-file interactive dashboard for demos and monitoring.', install: 'pip install streamlit', eco: 'python' },
  matplotlib: { name: 'Matplotlib', v: '3.9+', why: 'Static plots for evaluation curves and reports.', install: 'pip install matplotlib', eco: 'python' },
  transformers: { name: 'Hugging Face Transformers', v: '4.44+', why: 'Pre-trained language and vision transformers with a uniform API.', install: 'pip install transformers', eco: 'python' },
  sentencet: { name: 'sentence-transformers', v: '3.0+', why: 'Sentence embeddings for semantic search and RAG retrieval.', install: 'pip install sentence-transformers', eco: 'python' },
  faiss: { name: 'FAISS', v: '1.8+', why: 'Approximate nearest-neighbour vector index.', install: 'pip install faiss-cpu', eco: 'python' },
  librosa: { name: 'librosa', v: '0.10+', why: 'Audio loading, resampling, MFCC and spectrogram features.', install: 'pip install librosa', eco: 'python' },
  gpiozero: { name: 'gpiozero + lgpio', v: '2.0+', why: 'Readable GPIO API for the Raspberry Pi (Pi 5 compatible backend).', install: 'sudo apt install python3-gpiozero python3-lgpio', eco: 'python' },
  picamera2: { name: 'Picamera2', v: '0.3.20+', why: 'libcamera-based capture API for Pi Camera modules.', install: 'sudo apt install python3-picamera2', eco: 'python' },
  pyserial: { name: 'pySerial', v: '3.5', why: 'Reads the device UART stream from a host computer.', install: 'pip install pyserial', eco: 'python' },
  influx: { name: 'InfluxDB 2.x + Telegraf', v: '2.7', why: 'Time-series storage with retention policies and downsampling.', install: 'docker run -p 8086:8086 influxdb:2.7', eco: 'infra' },
  grafana: { name: 'Grafana', v: '11.x', why: 'Dashboards, threshold alerting and shareable panels.', install: 'docker run -p 3000:3000 grafana/grafana-oss', eco: 'infra' },
  mosquitto: { name: 'Eclipse Mosquitto', v: '2.0.18', why: 'Self-hosted MQTT broker with TLS and per-user ACLs.', install: 'sudo apt install mosquitto mosquitto-clients', eco: 'infra' },
  nodered: { name: 'Node-RED', v: '4.x', why: 'Flow-based glue between MQTT, databases and notification services.', install: 'npm install -g --unsafe-perm node-red', eco: 'infra' },
  homeassistant: { name: 'Home Assistant', v: '2026.x', why: 'Local-first home automation hub with MQTT auto-discovery.', install: 'docker run -d --net=host ghcr.io/home-assistant/home-assistant:stable', eco: 'infra' },
  docker: { name: 'Docker Engine', v: '27+', why: 'Reproducible deployment of the broker, database and dashboard.', install: 'curl -fsSL https://get.docker.com | sh', eco: 'infra' },
  thingsboard: { name: 'ThingsBoard CE', v: '3.8', why: 'Device registry, rule chains and multi-tenant IoT dashboards.', install: 'docker run -p 8080:9090 thingsboard/tb-postgres', eco: 'infra' },
  sqlite: { name: 'SQLite', v: '3.45+', why: 'Zero-configuration embedded database for local logs.', install: 'Bundled with Python (`import sqlite3`)', eco: 'python' },
  onnx: { name: 'ONNX Runtime', v: '1.19+', why: 'Portable, quantised inference across CPU, GPU and NPUs.', install: 'pip install onnxruntime', eco: 'python' },
};

/* ── REFERENCE IMAGES ───────────────────────────────────────────────
   Externally hosted photographs. Each entry records the Wikimedia
   Commons file page so the source is always stated and checkable.
   The build wraps every one of these in a <picture>-style figure with
   an inline SVG fallback, so a page never shows a broken image.
──────────────────────────────────────────────────────────────────── */
const commons = (file, alt, illus) => ({
  src: 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file) + '?width=900',
  page: 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file.replace(/ /g, '_')),
  source: 'Wikimedia Commons',
  file, alt, illus,
});

const IMAGES = {
  esp32: commons('ESP32 Espressif ESP-WROOM-32 Dev Board.jpg', 'An ESP32 development board with the ESP-WROOM-32 module and USB connector', 'esp32'),
  arduino: commons('Arduino Uno - R3.jpg', 'An Arduino Uno R3 board showing the ATmega328P microcontroller and header rows', 'arduino'),
  nano: commons('Arduino Nano.jpg', 'An Arduino Nano board on a white background', 'arduino'),
  rpi: commons('Raspberry Pi 4 Model B - Side.jpg', 'A Raspberry Pi 4 Model B single-board computer viewed from the side', 'rpi'),
  rpizero: commons('Raspberry Pi Zero.jpg', 'A Raspberry Pi Zero single-board computer', 'rpi'),
  breadboard: commons('400 points breadboard.jpg', 'A solderless breadboard used for prototyping circuits', 'breadboard'),
  dht: commons('DHT22.jpg', 'A DHT22 digital temperature and humidity sensor module', 'sensor'),
  ultrasonic: commons('HC-SR04.jpg', 'An HC-SR04 ultrasonic distance sensor with its two transducers', 'sensor'),
  servo: commons('Servo motor sg90.jpg', 'An SG90 hobby micro servo with its horn attached', 'motor'),
  relay: commons('Relay module.jpg', 'A single-channel relay module with screw terminals', 'sensor'),
  oled: commons('OLED display module.jpg', 'A small monochrome OLED display module', 'dashboard'),
  motor: commons('DC motor.jpg', 'A brushed DC gear motor', 'motor'),
  stepper: commons('Stepper motor.jpg', 'A NEMA-format stepper motor', 'motor'),
  solar: commons('Solar panel.jpg', 'A photovoltaic solar panel in sunlight', 'solar'),
  battery: commons('18650 Li-ion battery.jpg', 'An 18650 lithium-ion cell', 'sensor'),
  robot: commons('Line following robot.jpg', 'A small wheeled line-following robot on a track', 'robot'),
  robotarm: commons('Robot arm.jpg', 'A multi-axis robotic arm', 'robot'),
  drone: commons('Quadcopter drone.jpg', 'A quadcopter drone in flight', 'robot'),
  camera: commons('Webcam.jpg', 'A USB webcam', 'camera'),
  picamera: commons('Raspberry Pi Camera Module.jpg', 'The Raspberry Pi camera module attached by ribbon cable', 'camera'),
  neural: commons('Artificial neural network.svg', 'A schematic of a feed-forward artificial neural network', 'neural'),
  cnn: commons('Typical cnn.png', 'A typical convolutional neural network architecture diagram', 'neural'),
  datacentre: commons('Datacenter servers.jpg', 'Racks of servers in a data centre', 'cloud'),
  gps: commons('GPS satellite.jpg', 'A GPS navigation satellite in orbit', 'sensor'),
  lora: commons('LoRa module.jpg', 'A LoRa radio transceiver module', 'sensor'),
  greenhouse: commons('Greenhouse interior.jpg', 'The interior of a commercial greenhouse with rows of plants', 'sensor'),
  farm: commons('Irrigation system.jpg', 'A field irrigation system watering crops', 'sensor'),
  factory: commons('Factory automation.jpg', 'Automated machinery on a factory production line', 'motor'),
  city: commons('Smart city.jpg', 'A city skyline at night', 'cloud'),
  traffic: commons('Traffic light.jpg', 'A road traffic signal head', 'sensor'),
  streetlight: commons('LED street light.jpg', 'An LED street light on a pole', 'solar'),
  ev: commons('Electric car charging.jpg', 'An electric car connected to a charging station', 'motor'),
  car: commons('Car dashboard.jpg', 'The dashboard of a modern car', 'sensor'),
  health: commons('Fitness tracker.jpg', 'A wrist-worn fitness tracker', 'sensor'),
  ecg: commons('ECG trace.png', 'An electrocardiogram waveform trace', 'dashboard'),
  cctv: commons('CCTV camera.jpg', 'A wall-mounted CCTV surveillance camera', 'camera'),
  warehouse: commons('Warehouse racking.jpg', 'Pallet racking in a distribution warehouse', 'cloud'),
  retail: commons('Supermarket shelves.jpg', 'Stocked shelves in a supermarket aisle', 'dashboard'),
  grafana: commons('Grafana dashboard.png', 'A Grafana time-series dashboard', 'dashboard'),
};

module.exports = { COMPONENTS, LIBRARIES, IMAGES };
