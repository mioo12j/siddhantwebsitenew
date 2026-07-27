/* ═══════════════════════════════════════════════════════════════════
   defaults.js — derives the parts of a project specification that can
   be computed from what the author already declared.

   The rule: anything written by hand in the project data always wins.
   These generators only fill gaps, and they are driven by the actual
   parts, platform and domain of the project, so the result is specific
   to that build rather than generic filler.
════════════════════════════════════════════════════════════════════ */
'use strict';

const { COMPONENTS } = require('./db');

const has = (spec, ...ids) => ids.some(id => (spec.parts || []).includes(id));
const nameOf = (id) => (COMPONENTS[id] || {}).name || id;

const MCU_IDS = ['esp32', 'esp32cam', 'esp32s3', 'esp8266', 'uno', 'nano', 'mega', 'rpi4', 'rpi5', 'rpizero2', 'jetson', 'pico', 'stm32'];

function platformOf(spec) {
  const id = (spec.parts || []).find(p => MCU_IDS.includes(p));
  return id || 'esp32';
}

const IS_PI = (id) => ['rpi4', 'rpi5', 'rpizero2', 'jetson'].includes(id);
const IS_AVR = (id) => ['uno', 'nano', 'mega'].includes(id);

/* ── development environment ───────────────────────────────────── */
function defaultIDE(spec) {
  const mcu = platformOf(spec);
  if (IS_PI(mcu)) return 'Raspberry Pi OS Bookworm (64-bit) + Python 3.11 + VS Code Remote-SSH';
  if (IS_AVR(mcu)) return 'Arduino IDE 2.3.x (AVR core 1.8.6)';
  if (mcu === 'pico') return 'Arduino IDE 2.3.x with the arduino-pico core, or the official Pico SDK';
  if (mcu === 'stm32') return 'Arduino IDE 2.3.x with STM32duino, or STM32CubeIDE';
  return 'Arduino IDE 2.3.x with the ESP32 board package 3.x (or PlatformIO on VS Code)';
}

function defaultEnv(spec) {
  const mcu = platformOf(spec);
  if (IS_PI(mcu)) {
    return [
      'Flash <b>Raspberry Pi OS (64-bit)</b> with Raspberry Pi Imager; pre-configure Wi-Fi, hostname and SSH in the Imager settings so the board comes up headless.',
      'Update first: <code>sudo apt update &amp;&amp; sudo apt full-upgrade -y</code>, then reboot.',
      'Work inside a virtual environment — <code>python3 -m venv ~/venv &amp;&amp; source ~/venv/bin/activate</code>. Bookworm blocks system-wide <code>pip install</code> by design.',
      'Enable the buses you need with <code>sudo raspi-config</code> → Interface Options (I²C, SPI, Serial, Camera).',
      'Develop over <b>VS Code Remote-SSH</b> so you edit on your laptop but run on the Pi.',
    ];
  }
  return [
    'Install the <b>Arduino IDE 2.3.x</b> (or PlatformIO if you prefer a real editor and dependency locking).',
    IS_AVR(mcu)
      ? 'Select <b>Tools → Board → Arduino AVR Boards</b> and the matching board. Clone boards with a CH340 USB bridge need the CH340 driver on Windows and macOS.'
      : 'Add <code>https://espressif.github.io/arduino-esp32/package_esp32_index.json</code> under <b>File → Preferences → Additional Board Manager URLs</b>, then install <b>esp32</b> from the Boards Manager.',
    'Set the correct port under <b>Tools → Port</b>. On Linux add yourself to the <code>dialout</code> group: <code>sudo usermod -aG dialout $USER</code> and log out and back in.',
    'Open the Serial Monitor at <b>115200 baud</b> — every sketch here logs its state there.',
    'Keep <b>File → Preferences → Show verbose output during: compilation</b> switched on while you are debugging build errors.',
  ];
}

/* ── architecture layers ───────────────────────────────────────── */
function defaultLayers(spec) {
  const mcu = platformOf(spec);
  const sensors = (spec.parts || []).filter(id => COMPONENTS[id] && /sensor|detector|probe|camera|reader|IMU|GPS/i.test(COMPONENTS[id].name))
    .map(nameOf).slice(0, 3);
  const layers = [
    { name: 'Hardware layer', items: [nameOf(mcu)].concat(sensors.length ? sensors : ['sensors and actuators']), highlight: true },
    { name: 'Driver layer', items: (spec.libs || []).slice(0, 4).map(l => l) },
    { name: 'Application logic', items: ['sampling loop', 'filtering', 'thresholds', 'state machine'] },
  ];
  if (spec.iot) layers.push({ name: 'Transport layer', items: [spec.iot.protoShort || 'Wi-Fi + MQTT', 'TLS', 'retry and backoff'] });
  layers.push({ name: 'Presentation layer', items: spec.iot ? ['dashboard', 'mobile notifications', 'historical charts'] : ['local display', 'serial console', 'logged output'] });
  return layers;
}

/* ── performance tips ──────────────────────────────────────────── */
function defaultPerf(spec) {
  const mcu = platformOf(spec);
  const tips = [];
  if (IS_PI(mcu)) {
    tips.push('Pin the hot loop to one core with <code>taskset</code> and leave the others free for the OS.');
    tips.push('Prefer MJPEG over raw YUY2 when capturing from USB cameras — the decode cost is far lower than the USB bandwidth cost.');
    tips.push('Log to a tmpfs RAM disk and flush to the SD card once a minute; per-sample SD writes are what kills cards.');
    tips.push('Run the service under <code>systemd</code> with <code>Restart=always</code> so a crash never means a dead deployment.');
  } else {
    tips.push('Replace every <code>delay()</code> with a <code>millis()</code> comparison — blocking delays are the single most common cause of dropped readings.');
    tips.push('Sample sensors on a fixed cadence and publish on a slower one; you almost never need to transmit at the sampling rate.');
    if (!IS_AVR(mcu)) tips.push('Move networking into its own FreeRTOS task so a slow DNS lookup cannot stall the control loop.');
    if (IS_AVR(mcu)) tips.push('Wrap constant strings in <code>F("...")</code> so they stay in flash — an Uno only has 2 KB of SRAM.');
    tips.push('Use <code>uint8_t</code> / <code>uint16_t</code> where the range allows; on an 8-bit AVR a 32-bit add costs four times as much.');
  }
  if (spec.iot) {
    tips.push('Batch several samples into one MQTT publish. Radio time, not CPU time, dominates the energy budget.');
    tips.push('Set the MQTT keep-alive to a value that matches your reporting interval so the broker does not churn reconnections.');
  }
  if (has(spec, 'esp32', 'esp8266', 'esp32s3', 'pico')) {
    tips.push('For battery builds use deep sleep between samples: an ESP32 drops from ~160 mA awake to about 10 µA asleep, which is the difference between days and months of runtime.');
  }
  tips.push('Profile before optimising — print <code>micros()</code> deltas around each stage and fix the slowest one first.');
  return tips;
}

/* ── safety ────────────────────────────────────────────────────── */
function defaultSafety(spec) {
  const s = [];
  const mains = has(spec, 'relay1', 'relay4', 'ssr', 'pzem004t', 'zmpt101b');
  if (mains) {
    s.push('<b>Mains voltage kills.</b> Anything on the load side of the relay is at 230 V. Do not work on a powered circuit, and never leave exposed mains wiring on a bench where someone could touch it.');
    s.push('Keep at least 6 mm of creepage between the mains and low-voltage sides of any board you make, and never route mains tracks under the microcontroller.');
    s.push('Have a qualified electrician do the final installation into a consumer unit or wall fitting. In most jurisdictions this is a legal requirement, not a suggestion.');
    s.push('Fit an RCD/RCBO upstream and fuse the load appropriately for its rating.');
  }
  if (has(spec, 'li18650', 'tp4056')) {
    s.push('Lithium cells vent and burn when abused. Only use protected cells or a proper BMS, never charge below 0 °C, and never leave a charging pack unattended on a wooden desk.');
  }
  if (has(spec, 'sg90', 'mg996r', 'n20', 'bo_motor', 'a4988', 'l298n', 'tb6612', 'solenoid', 'pump')) {
    s.push('Moving parts pinch. Keep fingers, cables and hair out of gear trains and wheels, and always test motion with the drivetrain unloaded and the robot on blocks first.');
    s.push('Motors are inductive — always fit a flyback diode across a DC coil, or use a driver that already has one, or the back-EMF spike will destroy your GPIO.');
  }
  if (has(spec, 'mq2', 'mq135')) {
    s.push('MQ-series sensors run a hot element. They get genuinely hot, need ventilation, and must never be enclosed in a sealed plastic box.');
  }
  if (has(spec, 'lora', 'sim800', 'nrf24')) {
    s.push('Never power an RF module without its antenna fitted — the reflected power destroys the output stage. Check your local licence-free band and duty-cycle limits before transmitting.');
  }
  if (has(spec, 'pump', 'solenoid', 'ph', 'turbidity', 'waterflow')) {
    s.push('Water and electronics: mount all boards above the maximum possible water line, use drip loops on every cable, and pressure-test plumbing before wiring anything up.');
  }
  s.push('Wear eye protection when soldering or cutting, and solder in a ventilated space — rosin flux fumes are a respiratory irritant.');
  s.push('Power the circuit through a bench supply with a current limit while you are testing. A 300 mA limit turns a wiring mistake into a beep instead of a dead board.');
  s.push('Disconnect power before changing any wiring. Hot-plugging a sensor onto a live bus is the fastest way to lose a controller.');
  return s;
}

/* ── maintenance ───────────────────────────────────────────────── */
function defaultMaintenance(spec) {
  const m = [];
  m.push('Re-check every screw terminal and header after the first week — thermal cycling loosens connections that felt tight on day one.');
  if (has(spec, 'soil', 'ph', 'turbidity', 'rain', 'pms5003')) m.push('Clean the sensing element on a schedule. Optical and electrochemical sensors foul, and a fouled sensor reports plausible nonsense rather than failing outright.');
  if (has(spec, 'sdcard')) m.push('Rotate the microSD card annually and keep an image of the working system. Cards used as loggers wear out silently.');
  if (has(spec, 'li18650', 'tp4056')) m.push('Log pack voltage. When resting voltage after a full charge drops below about 4.0 V, the cell is near end of life — replace it.');
  if (has(spec, 'solarpanel')) m.push('Wash the panel every few weeks in dusty conditions; a visible dust film costs 15–25 % of the harvest.');
  if (has(spec, 'sg90', 'mg996r', 'n20', 'bo_motor')) m.push('Listen for gear chatter. A servo that buzzes at rest is either stripped or fighting a mechanical bind — fix it before it burns out.');
  if (spec.iot) m.push('Keep the broker and dashboard containers patched, and rotate device credentials at least once a year.');
  m.push('Recalibrate at the interval given in the calibration section, and keep the constants in a text file next to the firmware — not only in flash.');
  m.push('Keep a short logbook of firmware versions and what changed. Six months later you will not remember why that constant is 1.083.');
  return m;
}

/* ── troubleshooting seeds ─────────────────────────────────────── */
function defaultTrouble(spec) {
  const mcu = platformOf(spec);
  const t = [];
  if (!IS_PI(mcu)) {
    t.push({
      sym: 'The sketch will not upload — "Failed to connect" or "avrdude: stk500_recv()"',
      cause: 'The bootloader is not being reached: wrong port, wrong board, a serial monitor holding the port open, or a USB cable that only carries power.',
      fix: 'Close every serial monitor, confirm <b>Tools → Board</b> and <b>Port</b>, and swap to a known data-capable USB cable. On an ESP32 hold <b>BOOT</b> while the IDE prints "Connecting…", then release. If a peripheral is wired to the UART pins (GPIO 1/3 on ESP32, D0/D1 on Uno) unplug it — it fights the programmer.',
    });
    t.push({
      sym: 'The board resets in a loop, or the serial monitor prints "Brownout detector was triggered"',
      cause: 'The supply cannot deliver peak current. Wi-Fi transmit bursts, relay coils and servos all pull far more than their average draw.',
      fix: 'Power peripherals from a separate regulated supply with a common ground rather than from the board 5 V pin. Add a 470–1000 µF electrolytic capacitor across the supply near the load, and use a real power adapter rather than a laptop USB port.',
    });
    t.push({
      sym: 'Serial monitor shows garbage characters',
      cause: 'Baud rate mismatch between <code>Serial.begin()</code> and the monitor, or a floating/shared UART line.',
      fix: 'Set the monitor to <b>115200</b> to match the sketch. If it still garbles, the crystal or the USB bridge is being confused by noise — shorten the cable and keep motor wiring away from the USB lead.',
    });
  } else {
    t.push({
      sym: 'The Python script crashes with "externally-managed-environment" on pip install',
      cause: 'Raspberry Pi OS Bookworm marks the system Python as managed by apt, and refuses global pip installs.',
      fix: 'Create and activate a virtual environment — <code>python3 -m venv ~/venv &amp;&amp; source ~/venv/bin/activate</code> — and install there. Use <code>--system-site-packages</code> if you also need apt-installed modules such as <code>picamera2</code>.',
    });
    t.push({
      sym: 'The Pi reboots or shows a lightning-bolt icon under load',
      cause: 'Under-voltage. The supply sags below 4.63 V when the CPU and peripherals ramp up.',
      fix: 'Use the official supply for your model (5 V 3 A for Pi 4, 5 V 5 A for Pi 5) and a short, thick USB-C cable. Check with <code>vcgencmd get_throttled</code> — anything other than <code>0x0</code> means power problems.',
    });
  }
  if (has(spec, 'oled', 'lcd1602', 'bme280', 'mpu6050', 'bh1750', 'ina219', 'rtc')) {
    t.push({
      sym: 'An I²C device is not detected',
      cause: 'Wrong address, missing pull-ups, swapped SDA/SCL, or a bus too long for the pull-up value.',
      fix: 'Run an I²C scanner sketch first — it should print the device address. Most breakout boards include 4.7 kΩ pull-ups, but if you have chained four of them the parallel resistance is too low; remove the pull-ups from all but one board. Keep the bus under 30 cm at 100 kHz.',
    });
  }
  if (spec.iot) {
    t.push({
      sym: 'Wi-Fi connects but MQTT never does (state -2)',
      cause: 'Wrong broker address or port, a firewall in the way, or the broker requiring credentials the sketch is not sending.',
      fix: 'Test from a laptop on the same network first: <code>mosquitto_sub -h &lt;broker&gt; -t "#" -v</code>. If that works, the problem is on the device — check the IP literal, port 1883 (or 8883 for TLS), and that <code>client.setServer()</code> runs before <code>connect()</code>. PubSubClient state codes are documented in its header.',
    });
    t.push({
      sym: 'Readings arrive for a while and then stop',
      cause: 'The Wi-Fi or MQTT session dropped and the sketch never reconnects, or the broker dropped the client on keep-alive timeout.',
      fix: 'Never assume the link stays up. Check <code>WiFi.status()</code> and <code>client.connected()</code> at the top of every loop and reconnect with exponential backoff. Add a watchdog so a wedged network stack reboots the device instead of going silent.',
    });
  }
  return t;
}

/* ── future work ───────────────────────────────────────────────── */
function defaultFuture(spec) {
  const f = [];
  f.push('Design a proper PCB. Once the breadboard version has run for a month, moving to a two-layer board removes the intermittent-contact failures that dominate prototype faults.');
  if (!spec.iot) f.push('Add connectivity — an ESP32 and an MQTT publish turn a local gadget into something you can graph, alert on and analyse over months.');
  if (spec.iot) f.push('Add over-the-air firmware updates so you never have to physically reach a deployed node again.');
  f.push('Add persistent local storage (microSD or the on-chip flash) so a network outage does not create a hole in your data.');
  f.push('Move configuration out of the source: a captive-portal setup page or a JSON config file makes the build reusable without a recompile.');
  f.push('Add a battery and solar option so the unit survives a power cut and can be sited away from a socket.');
  f.push('Write a small test harness that feeds synthetic sensor values through the decision logic, so you can validate thresholds without physically triggering the event.');
  return f;
}

/* ── expected output ───────────────────────────────────────────── */
function defaultOutput(spec) {
  return [
    'With everything wired and the firmware uploaded, the Serial Monitor at 115200 baud should look similar to the trace below. Values will differ; the <em>shape</em> of the output should not.',
  ];
}

/* ── normalisation entry point ─────────────────────────────────── */
function normalise(spec) {
  const mcu = platformOf(spec);
  const d = Object.assign({}, spec);

  d.platform = mcu;
  d.platformName = d.platformName || (COMPONENTS[mcu] || {}).name || 'Microcontroller';
  d.supply = d.supply || (COMPONENTS[mcu] || {}).volts || '';
  d.ide = d.ide || defaultIDE(spec);
  d.env = d.env || defaultEnv(spec);
  d.layers = d.layers || defaultLayers(spec);
  d.perf = (d.perf || []).concat(defaultPerf(spec)).slice(0, 11);
  d.safety = (d.safety || []).concat(defaultSafety(spec));
  d.maintenance = (d.maintenance || []).concat(defaultMaintenance(spec));
  d.troubleshoot = (d.troubleshoot || []).concat(defaultTrouble(spec));
  d.future = (d.future || []).concat(defaultFuture(spec)).slice(0, 11);
  d.output = d.output || defaultOutput(spec);
  d.tools = d.tools || [
    'Soldering iron (temperature controlled, 350 °C) with 0.8 mm 60/40 or lead-free solder',
    'Digital multimeter — continuity, DC volts and current ranges',
    'Wire strippers, flush cutters and a small set of precision screwdrivers',
    'Heat-shrink tubing and a heat gun (or a lighter, carefully)',
    'A laptop with a USB port and the toolchain listed above',
  ];
  d.keywords = d.keywords || [
    spec.title.toLowerCase(), spec.title.toLowerCase() + ' project',
    'how to build ' + spec.title.toLowerCase(),
    d.platformName.split('(')[0].trim().toLowerCase() + ' project',
    spec.cat.toLowerCase() + ' project', 'circuit diagram', 'source code', 'tutorial',
  ];
  d.seoTitle = d.seoTitle || `${spec.title} — Circuit, Code & Full Build Guide | ${spec.cat}`;
  d.seoDesc = d.seoDesc || `Complete ${spec.difficulty.toLowerCase()}-level build guide for a ${spec.title}: bill of materials, wiring diagram, working principle, full annotated source code, calibration, testing and troubleshooting.`;
  d.iso8601 = d.iso8601 || 'PT8H';

  return d;
}

module.exports = { normalise, platformOf, defaultLayers };
