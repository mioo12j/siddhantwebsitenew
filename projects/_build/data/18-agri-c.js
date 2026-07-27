/* Agriculture batch C — 033 Grain Silo Monitor, 034 Solar Pump Controller,
   035 Beehive Health Monitor. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   033 — Grain Silo Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '033',
  domainKey: 'iot',
  emoji: '🌾', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Reads temperature and moisture at several depths inside a stored-grain mass and warns before a hot spot turns into a spoilage pocket.',

  overview: [
    'Stored grain is a living, respiring ecosystem. Even after harvest the kernels breathe, the moulds and insects living on them breathe, and every gram of that respiration releases heat, water and carbon dioxide. In a sealed silo those products cannot escape, so a small pocket of slightly-too-wet grain warms up, the warmth drives moisture migration toward it, the added moisture accelerates mould growth, and within days a self-reinforcing <b>hot spot</b> forms that can spoil tonnes of grain and, in extreme cases, catch fire. The whole loss is silent — from the outside the silo looks exactly the same. This project puts sensors <i>inside</i> the grain so the hot spot is visible on day one instead of week three.',
    'The monitor drops a cable of temperature sensors down the centre of the silo, samples grain-interface humidity, and watches the headspace CO₂ concentration — the single most sensitive early indicator of biological activity, because respiration produces measurable CO₂ long before a temperature rise is obvious. An ESP32 logs all of this on a schedule, computes the grain\'s <b>equilibrium moisture content</b> from temperature and humidity, and sends the profile over LoRa to a shed or phone. When any depth trends upward against its neighbours, or CO₂ climbs, it raises an alarm and tells the operator which layer and roughly how deep to aim the aeration fan or unload from.',
    'The design goal is a device a farmer or a small co-operative can actually deploy: it runs for a whole storage season on a solar-charged battery, survives the dust and the temperature swing of a metal silo, needs no wiring back to mains, and speaks in the language the operator already uses — "top third is warming, moisture 15%, ventilate" rather than a wall of raw numbers.',
  ],
  does: [
    'Measures grain temperature at several depths on a single sensor cable',
    'Tracks headspace humidity and computes grain equilibrium moisture content (EMC)',
    'Monitors CO₂ in the silo headspace as the earliest sign of biological activity',
    'Detects a developing hot spot by comparing each depth against its neighbours and its own history',
    'Sends the depth profile and alerts over long-range LoRa to a base station or phone',
    'Logs to local storage so a communication gap never loses the record',
    'Runs a full storage season on solar + battery with no mains wiring',
  ],
  features: [
    'Multi-point temperature cable — one hot spot cannot hide behind an average',
    'CO₂ early warning: respiration is detectable before temperature moves',
    'Equilibrium moisture content derived on-device from temperature + humidity',
    'Rate-of-rise and neighbour-difference alarms, not just fixed thresholds',
    'Long-range LoRa so the silo need not be near Wi-Fi or mains',
    'Season-long unattended operation on a small solar panel',
    'Operator-language alerts naming the affected layer and suggested action',
  ],
  applications: [
    { t: 'On-farm storage', d: 'A farmer holding wheat, maize or paddy for a better price weeks or months after harvest, protecting the crop from silent spoilage.' },
    { t: 'Co-operative / FPO warehouses', d: 'Village-level aggregators storing many members\' grain, where one undetected hot spot means many families\' losses and disputes.' },
    { t: 'Seed storage', d: 'Seed viability collapses with heat and moisture; continuous monitoring protects germination rate, which is the seed\'s entire value.' },
    { t: 'Procurement / mandi godowns', d: 'Government or trader stores holding grain to buffer prices, where fumigation and aeration decisions need data, not guesswork.' },
  ],
  skills: [
    'Wiring a chain of 1-Wire (DS18B20) sensors on a single bus',
    'Reading an NDIR CO₂ sensor over UART',
    'Basic grain-storage physics: EMC, respiration, moisture migration',
    'LoRa point-to-point links and simple packet framing',
    'Solar + lithium power budgeting for seasonal deployment',
  ],
  prereq: [
    'A DS18B20 chain uses a single data pin with a 4.7 kΩ pull-up for the whole bus — do not add one per sensor.',
    'The CO₂ sensor needs a fresh-air baseline calibration when new; run it once in clean outdoor air before installing.',
    'Never enter a silo to install sensors without following confined-space safety — grain engulfment and low-oxygen atmospheres kill. Install from the top hatch with the sensor cable, not by entering.',
  ],

  parts: ['esp32', 'ds18b20', 'sht31', 'mhz19', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  qty: { ds18b20: 6 },
  extraParts: [
    { name: 'Sensor cable + waterproof DS18B20 probes', spec: 'Pre-wired 1-Wire chain, stainless probes, food-safe jacket, 3–6 m', qty: 1, price: 900, note: 'Or build from individual waterproof probes on shielded cable' },
    { name: 'Weatherproof field enclosure', spec: 'IP65, UV-stable, cable glands, mounts on silo roof', qty: 1, price: 450, note: 'Electronics stay outside the grain; only probes go in' },
    { name: 'Grain-safe cable gland / eye-bolt', spec: 'Seals the probe cable at the roof hatch, takes the hanging weight', qty: 1, price: 120 },
  ],
  cost: '₹3,200 – ₹4,200',
  libs: ['wifi', 'onewire', 'unified', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'DS18B20 chain', devPin: 'DQ', pin: 'GPIO 4', sig: '1-Wire data (4.7 kΩ pull-up to 3V3)' },
      { dev: 'DS18B20 chain', devPin: 'VDD', pin: '3V3', sig: 'Power (external, not parasitic, for a long bus)' },
      { dev: 'SHT31', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'I²C headspace humidity + temp' },
      { dev: 'MH-Z19 CO₂', devPin: 'TX/RX', pin: 'GPIO 16/17', sig: 'UART NDIR CO₂' },
    ],
    right: [
      { dev: 'LoRa SX1276', devPin: 'SCK/MISO/MOSI', pin: 'GPIO 18/19/23', sig: 'SPI radio bus' },
      { dev: 'LoRa SX1276', devPin: 'NSS/RST/DIO0', pin: 'GPIO 5/14/2', sig: 'Chip-select, reset, RX-done IRQ' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar-charged 18650 supply' },
      { dev: 'Solar panel', devPin: '+/–', pin: 'TP4056 IN', sig: '6 V panel → charger' },
    ],
  },
  wiringNotes: [
    'Only the probe cable and its gland go through the roof hatch; the ESP32, radio and battery live in an IP65 box bolted to the silo roof, out of the grain and the weather.',
    'Give the DS18B20 bus a solid 4.7 kΩ pull-up from data to 3V3 at the ESP32 end. One pull-up for the whole chain, not one per probe.',
    'Power the DS18B20 chain from 3V3 (three-wire mode), not parasitically — parasitic power is unreliable over several metres of cable and many devices.',
    'The MH-Z19 draws current in bursts when its lamp fires; power it from a stable 5 V (or its rated rail) and keep its ground short to the ESP32.',
    'Route the CO₂ sensor so it samples the headspace, not the outside air — but keep the electronics vented enough that condensation does not form inside the box.',
  ],

  block: { columns: [
    { label: 'In the grain', edge: 'right', blocks: [
      { name: 'Temp cable', sub: 'DS18B20 ×6 depths' },
      { name: 'Headspace RH', sub: 'SHT31' },
      { name: 'Headspace CO₂', sub: 'MH-Z19 NDIR', highlight: true },
    ] },
    { label: 'On the roof', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'sample + EMC + logic' },
      { name: 'Store', sub: 'flash log + baselines' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'LoRa', sub: '433/868 MHz' },
    ] },
    { label: 'Operator', edge: 'none', blocks: [
      { name: 'Base station', sub: 'shed gateway / phone' },
      { name: 'Alert', sub: 'layer + action' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Read all depths + RH + CO₂', k: 'proc' },
    { t: 'Compute EMC from T + RH', k: 'proc' },
    { t: 'CO₂ or hot-spot rule tripped?', k: 'dec', yes: 'Raise alert (layer + action)', no: 'Log only' },
    { t: 'Raise alert (layer + action)', k: 'io' },
    { t: 'Log only', k: 'io' },
    { t: 'Transmit profile over LoRa', k: 'io' },
    { t: 'Sleep until next interval', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'Grain spoilage is a coupled heat-and-moisture problem. A kernel at a given temperature and surrounding humidity holds a specific water content at equilibrium — its <b>equilibrium moisture content</b>. When the air around the grain is more humid than that equilibrium, the grain absorbs water; when drier, it releases it. Warm grain respires faster, respiration releases both heat and water, the water raises local humidity, higher humidity raises EMC, wetter grain respires faster still. That positive feedback is why a hot spot accelerates rather than settling down, and why catching it early — before the feedback dominates — matters so much.',
    'Temperature at a single point tells you almost nothing, because grain is an excellent insulator: a hot spot 50 cm away can be invisible at the sensor while the average silo temperature barely moves. That is why the cable carries several sensors at different depths. The signal you look for is not an absolute temperature but a <b>divergence</b>: one depth pulling away from its neighbours, or one depth rising faster than the seasonal drift of the whole mass. A layer 4 °C above the two around it is a hot spot even if it is only 20 °C.',
    'CO₂ is the earliest and most sensitive channel. Biological respiration — grain, mould, and insects together — consumes oxygen and produces carbon dioxide continuously. Because the headspace is nearly closed, CO₂ accumulates measurably from activity that is still far too small to move the temperature of a large thermal mass. A rising CO₂ trend is the smoke alarm; the temperature cable tells you which room the fire is in.',
    'The operator\'s levers are aeration (running a fan to push ambient air through the grain, cooling it and equalising moisture) and unloading (removing grain from the affected zone). The monitor\'s job is to tell them <i>when</i> and <i>where</i>: which depth is diverging, whether ambient conditions right now would help or harm if the fan runs (running a fan in humid weather can add moisture), and whether CO₂ says the whole mass is trending the wrong way.',
  ],
  equations: [
    { t: 'Equilibrium moisture content (modified Henderson)', eq: 'A crop-specific model relates grain moisture m (% wet basis)\nto air temperature T (°C) and relative humidity RH (fraction):\n\n  1 − RH = exp( −A·(T + C)·m^B )\n\nSolved for m:\n\n  m = [ −ln(1 − RH) / (A·(T + C)) ]^(1/B)\n\nA, B, C are tabulated per grain (wheat, maize, paddy…).\nExample (wheat-like constants), T = 25 °C, RH = 0.65:\n  gives m ≈ 13–14% — the safe-storage range.\nRH = 0.75 at the same T pushes m toward 15–16% — risk rises.' },
    { t: 'Hot-spot divergence test', eq: 'For depth i with neighbours i−1, i+1:\n\n  Δ_i = T_i − ½(T_{i−1} + T_{i+1})\n\nAlarm if Δ_i > Δ_warn (e.g. 3 °C) sustained over N reads.\n\nAlso track rate of rise:\n  dT_i/dt over 24 h; > 1 °C/day at one depth = developing\n  hot spot even if the absolute temperature looks normal.' },
    { t: 'CO₂ trend alarm', eq: 'Headspace CO₂ rises with total respiration.\nCompare a slow baseline to the current reading:\n\n  baseline ← baseline + α·(CO₂_now − baseline)   (α small)\n  alarm if CO₂_now − baseline > threshold (e.g. +400 ppm)\n  or if CO₂_now exceeds an absolute ceiling for stored grain.\n\nThe exponential baseline adapts to slow seasonal drift while\nstill catching a fast biological climb.' },
  ],

  assembly: [
    { h: 'Build the sensor cable', p: [
      'Space the waterproof DS18B20 probes along the cable at the depths you want to monitor — for a typical farm silo, roughly every 0.5–1 m so the top, middle and bottom thirds each have coverage. The top third matters most: it is where moisture migrates and where hot spots most often start.',
      'Wire all probes in parallel on the three-wire bus (VDD, GND, DQ). Record each probe\'s unique 64-bit ROM address against its physical depth — the software needs this map to say "the 1.5 m layer is warming", not "sensor 3 is warming".',
      'Jacket the whole cable in a food-safe, abrasion-resistant sleeve. Grain flowing during loading and unloading exerts real force; a bare cable will chafe through in a season.',
    ], warn: 'Do the depth-to-address mapping on the bench, before installation. Once the cable is hanging in grain you cannot tell which probe is which.' },
    { h: 'Mount the roof enclosure', p: [
      'Bolt the IP65 box to the silo roof beside the top hatch. Bring the sensor cable in through a gland; take the hanging weight on an eye-bolt or the gland\'s strain relief, never on the wire solder joints.',
      'Position the CO₂ sensor so it samples headspace gas. If the box is fully sealed you will read box air, not silo air — provide a short vent tube or mount the sensor at the hatch.',
      'Angle the solar panel toward the sun and keep it clear of the hatch so opening the silo does not shade or knock it.',
    ] },
    { h: 'Lower and secure the cable', p: [
      'From the top hatch, lower the cable to the design depth with the deepest probe near — but not buried in — the silo floor cone. Mark the cable so re-installation next season lands the probes at the same depths.',
      'Seal the hatch around the cable as well as the silo design allows; a sealed headspace gives the truest CO₂ signal and best represents the stored mass.',
    ], warn: 'Confined space: never climb into the silo. Grain behaves like quicksand and the atmosphere can be low-oxygen or high-CO₂. Install entirely from the top hatch.' },
  ],
  steps: [
    { h: 'Enumerate and map the temperature bus', p: [
      'Scan the 1-Wire bus and print every ROM address. Match each to a depth using the bench map you recorded, and store the ordered list in flash so reboots keep the same layer labels.',
    ], tip: 'If a probe drops off the bus mid-season, its address simply stops responding — flag that layer as "sensor fault", do not silently drop it from the average.' },
    { h: 'Baseline the CO₂ sensor', p: [
      'Run the fresh-air (zero-point) calibration in clean outdoor air before installing, then let the adaptive software baseline track slow drift afterwards.',
    ] },
    { h: 'Compute EMC and the alarms each cycle', p: [
      'On each wake, read all depths, headspace RH/T and CO₂; compute EMC; run the divergence, rate-of-rise and CO₂ trend tests; then log and, if tripped, transmit an alert naming the layer and a suggested action.',
    ], code: {
      file: 'silo-checks.ino', lang: 'cpp',
      body: `// Called once per sampling cycle after all sensors are read.
struct Layer { float depth_m; float tempC; };
Layer layer[NUM_DEPTHS];

// Grain equilibrium moisture content, modified-Henderson form.
float emcPercent(float T, float rhFrac) {
  const float A = 2.3e-5, B = 2.16, C = 55.8;   // wheat-like; set per grain
  float num = -logf(1.0f - rhFrac);
  return powf(num / (A * (T + C)), 1.0f / B);
}

// Divergence of a depth from its two neighbours.
bool hotSpot(int i, float warn) {
  if (i == 0 || i == NUM_DEPTHS - 1) return false;
  float d = layer[i].tempC - 0.5f * (layer[i-1].tempC + layer[i+1].tempC);
  return d > warn;
}

void evaluate(float headRH, float headT, float co2) {
  float emc = emcPercent(headT, headRH / 100.0f);

  int worst = -1; float worstDelta = 0;
  for (int i = 1; i < NUM_DEPTHS - 1; i++) {
    float d = layer[i].tempC - 0.5f*(layer[i-1].tempC + layer[i+1].tempC);
    if (d > worstDelta) { worstDelta = d; worst = i; }
  }

  co2Baseline += 0.02f * (co2 - co2Baseline);     // slow adaptive baseline
  bool co2Alarm = (co2 - co2Baseline) > 400.0f || co2 > CO2_CEILING;

  if (worst >= 0 && worstDelta > 3.0f) {
    alert("Hot spot at %.1f m: +%.1f C vs neighbours. Aerate/unload.",
          layer[worst].depth_m, worstDelta);
  }
  if (emc > 15.0f) alert("Grain EMC %.1f%% — too wet, ventilate in dry air.", emc);
  if (co2Alarm)    alert("CO2 rising (%.0f ppm) — biological activity. Inspect.", co2);
}`,
      explain: [
        { ref: 'emcPercent', txt: 'Turns headspace temperature and humidity into the grain\'s equilibrium moisture — the number that decides whether storage is safe. The constants are grain-specific; swap them for wheat, maize or paddy.' },
        { ref: 'hotSpot', txt: 'A hot spot is a local divergence, not an absolute temperature, so each interior depth is compared with the mean of its two neighbours.' },
        { ref: 'co2Baseline += 0.02f', txt: 'An exponential moving baseline follows slow seasonal drift while still letting a fast biological climb stand out above it.' },
        { ref: 'alert(', txt: 'Every alert names the affected layer and the action — aerate, ventilate, inspect — so the operator gets a decision, not a raw reading.' },
      ],
    } },
    { h: 'Transmit and sleep', p: [
      'Pack the depth profile, EMC, CO₂ and any alerts into a compact LoRa packet, send it, then deep-sleep until the next interval. Hourly is plenty for a slow thermal mass; more often only if an alarm is active.',
    ], tip: 'When an alarm is active, shorten the interval automatically so the operator sees the hot spot developing in near-real time.' },
  ],

  code: [{
    file: 'grain-silo-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Grain Silo Monitor — ESP32, DS18B20 depth cable, CO2, LoRa, solar

   Samples grain temperature at several depths, headspace humidity and
   CO2, computes equilibrium moisture content, detects hot spots by
   neighbour-divergence and rate-of-rise, and reports over LoRa.
   ══════════════════════════════════════════════════════════════════ */

#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_OW      4        // DS18B20 1-Wire bus (4.7k pull-up to 3V3)
#define CO2_RX      16       // MH-Z19 TX -> ESP32 RX
#define CO2_TX      17       // MH-Z19 RX -> ESP32 TX
#define LORA_CS      5
#define LORA_RST    14
#define LORA_DIO0    2
#define NUM_DEPTHS   6
#define CO2_CEILING 3000.0f  // ppm absolute ceiling for stored grain
#define SLEEP_S     3600     // 1 h normal; shortened when alarmed

OneWire           ow(PIN_OW);
DallasTemperature grain(&ow);
Adafruit_SHT31    sht;
Preferences       prefs;
HardwareSerial    co2ser(2);

// depth[i] is the physical depth of the probe at bus index i, filled
// from the bench map stored in flash.
float depth_m[NUM_DEPTHS];
DeviceAddress addr[NUM_DEPTHS];
float co2Baseline;

/* ── CO2 read (MH-Z19 command frame) ─────────────────────────── */
float readCO2() {
  const uint8_t cmd[9] = {0xFF,0x01,0x86,0,0,0,0,0,0x79};
  co2ser.write(cmd, 9);
  uint8_t r[9]; unsigned long t0 = millis();
  int n = 0;
  while (n < 9 && millis() - t0 < 1000)
    if (co2ser.available()) r[n++] = co2ser.read();
  if (n == 9 && r[0] == 0xFF && r[1] == 0x86)
    return r[2] * 256 + r[3];
  return NAN;
}

/* ── EMC + alarms (see silo-checks) ──────────────────────────── */
float emcPercent(float T, float rhFrac) {
  const float A = 2.3e-5, B = 2.16, C = 55.8;
  return powf(-logf(1.0f - rhFrac) / (A * (T + C)), 1.0f / B);
}

void transmit(float *t, float headT, float headRH, float co2,
              float emc, int hotIdx, float hotDelta, bool co2Alarm) {
  LoRa.beginPacket();
  LoRa.print("{\\"silo\\":1,\\"depths\\":[");
  for (int i = 0; i < NUM_DEPTHS; i++) {
    LoRa.printf("%.1f", t[i]);
    if (i < NUM_DEPTHS - 1) LoRa.print(",");
  }
  LoRa.printf("],\\"rh\\":%.0f,\\"co2\\":%.0f,\\"emc\\":%.1f,"
              "\\"hot_m\\":%.1f,\\"hot_d\\":%.1f,\\"co2_alarm\\":%d}",
              headRH, co2, emc,
              hotIdx >= 0 ? depth_m[hotIdx] : -1.0f,
              hotDelta, co2Alarm ? 1 : 0);
  LoRa.endPacket();
}

void loadMap() {
  prefs.begin("silo", true);
  for (int i = 0; i < NUM_DEPTHS; i++) {
    char k[8]; snprintf(k, sizeof k, "d%d", i);
    depth_m[i] = prefs.getFloat(k, i * 0.75f);   // default even spacing
  }
  co2Baseline = prefs.getFloat("co2b", 450.0f);
  prefs.end();
}

void setup() {
  Serial.begin(115200);
  loadMap();
  grain.begin();
  grain.setResolution(12);
  Wire.begin(21, 22);
  sht.begin(0x44);
  co2ser.begin(9600, SERIAL_8N1, CO2_RX, CO2_TX);

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(433E6)) Serial.println("LoRa init failed");
  LoRa.setSpreadingFactor(10);
  LoRa.setSignalBandwidth(125E3);

  // ── one sampling cycle ──
  grain.requestTemperatures();
  float t[NUM_DEPTHS];
  for (int i = 0; i < NUM_DEPTHS; i++)
    t[i] = grain.getTempCByIndex(i);

  float headT  = sht.readTemperature();
  float headRH = sht.readHumidity();
  float co2    = readCO2();
  float emc    = emcPercent(headT, headRH / 100.0f);

  int hotIdx = -1; float hotDelta = 0;
  for (int i = 1; i < NUM_DEPTHS - 1; i++) {
    float d = t[i] - 0.5f * (t[i-1] + t[i+1]);
    if (d > hotDelta) { hotDelta = d; hotIdx = i; }
  }

  if (!isnan(co2)) co2Baseline += 0.02f * (co2 - co2Baseline);
  bool co2Alarm = !isnan(co2) &&
                  ((co2 - co2Baseline) > 400.0f || co2 > CO2_CEILING);

  transmit(t, headT, headRH, co2, emc, hotIdx, hotDelta, co2Alarm);

  prefs.begin("silo", false);
  prefs.putFloat("co2b", co2Baseline);
  prefs.end();

  bool alarmed = (hotDelta > 3.0f) || (emc > 15.0f) || co2Alarm;
  uint32_t sleep_s = alarmed ? 600 : SLEEP_S;   // watch closely if alarmed
  esp_sleep_enable_timer_wakeup((uint64_t)sleep_s * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}   // never reached; deep sleep restarts setup()`,
    explain: [
      { ref: 'readCO2', txt: 'Sends the MH-Z19\'s 9-byte read command and decodes the response frame. A malformed or timed-out reply returns NAN so a bad read never poisons the baseline.' },
      { ref: 'loadMap', txt: 'Restores the depth-to-bus-index map and the CO₂ baseline from flash on every boot, so deep sleep does not lose the layer labels or the slow trend.' },
      { ref: 'for (int i = 1; i < NUM_DEPTHS - 1', txt: 'Scans only interior depths for the largest neighbour-divergence, since the top and bottom probes have only one neighbour.' },
      { ref: 'uint32_t sleep_s = alarmed ? 600', txt: 'A healthy silo is a slow system, so it sleeps an hour between reads; the moment anything trips, the interval drops to ten minutes to track the developing problem.' },
    ],
  }],

  config: [
    'Set the EMC constants (A, B, C) for the grain actually stored — wheat, maize and paddy have materially different curves.',
    'Record the depth-to-address map in flash during commissioning so each layer is labelled by real depth.',
    'Tune the divergence threshold (default 3 °C) and CO₂ step (default +400 ppm) to your silo size and seal quality.',
    'Choose the LoRa frequency legal in your region (433 MHz in much of Asia, 868 MHz in Europe) and match it at the base station.',
  ],
  calibration: [
    { h: 'Temperature cable', p: [
      'Before installing, bundle all probes together at room temperature and confirm they read within a few tenths of a degree of each other. A probe reading consistently high or low will fake a hot spot — record and subtract its offset.',
    ] },
    { h: 'CO₂ zero point', p: [
      'Run the sensor\'s fresh-air calibration in clean outdoor air (≈400 ppm) before installation. Repeat at the start of each storage season.',
    ] },
    { h: 'EMC sanity check', p: [
      'On loading day, take a grain sample to a moisture meter and compare with the computed EMC. If they disagree by more than a point, revisit the EMC constants for that grain.',
    ] },
  ],
  testing: [
    { step: 'Bench-scan the 1-Wire bus', expect: 'All six ROM addresses enumerate; each maps to a known depth' },
    { step: 'Warm one probe by hand', expect: 'That depth reads a divergence; a hot-spot alert names its depth' },
    { step: 'Breathe near the CO₂ sensor', expect: 'CO₂ jumps then decays; trend logic reacts, absolute ceiling respected' },
    { step: 'Compare EMC to a moisture meter', expect: 'Agreement within ~1 percentage point on the stored grain' },
    { step: 'Range-test the LoRa link', expect: 'Packets received at the shed/base with acceptable RSSI' },
    { step: 'Run a 24 h solar cycle', expect: 'Battery recovers by day; no brown-out overnight' },
  ],
  output: [
    'The base station shows a depth profile — a small column of temperatures top to bottom — plus headspace humidity, computed EMC and CO₂, updated each cycle.',
    { file: 'lora-packet.json', lang: 'json', body: `{
  "silo": 1,
  "depths": [21.2, 21.5, 24.8, 21.9, 21.4, 21.1],
  "rh": 62,
  "co2": 690,
  "emc": 13.4,
  "hot_m": 1.5,
  "hot_d": 3.2,
  "co2_alarm": 0
}` },
    'Here depth index 2 (1.5 m) sits 3.2 °C above its neighbours — a developing hot spot flagged while the silo average still looks fine.',
  ],
  troubleshoot: [
    { sym: 'One depth reads −127 °C', cause: 'DS18B20 dropped off the bus (broken wire, bad joint, weak pull-up)', fix: 'Check the 4.7 kΩ pull-up and the probe\'s connections; flag that layer as faulted, do not average it in' },
    { sym: 'All depths read the same, suspiciously', cause: 'Only one probe enumerated; index-based reads repeat it', fix: 'Verify the bus scan returns all addresses; use addresses, not just indices, when a probe may be missing' },
    { sym: 'CO₂ reads a flat 400 or 5000', cause: 'Sensor still warming up, or wiring/UART fault', fix: 'Allow the lamp warm-up time; confirm TX/RX are crossed and baud is 9600' },
    { sym: 'EMC disagrees badly with a moisture meter', cause: 'Wrong grain constants, or the sensor reads box air not headspace', fix: 'Set A/B/C for the actual grain; ensure the RH/CO₂ sensors sample the silo, not the enclosure' },
    { sym: 'Constant false hot-spot alerts', cause: 'One probe has an uncorrected offset', fix: 'Apply the bench offset for that probe; raise the divergence threshold slightly' },
  ],

  iot: {
    protoShort: 'LoRa → gateway → MQTT',
    net: {
      nodes: [{ name: 'Silo node', sub: 'ESP32 + LoRa' }, { name: 'Neighbour silos', sub: 'same design' }],
      protocol: 'LoRa 433/868', gateway: 'Shed gateway', gatewaySub: 'LoRa → MQTT',
      uplink: 'MQTT 1883', cloud: 'Broker + dashboard', cloudSub: 'season logging',
      clients: [{ name: 'Dashboard', sub: 'depth + CO₂' }, { name: 'Phone', sub: 'alerts' }],
    },
    protocol: ['Compact JSON over LoRa at SF10/125 kHz for range through the silo\'s metal skin and across farm distances. Hourly cadence keeps duty-cycle and power low; the interval shortens automatically while an alarm is active so a developing hot spot is seen in near-real time.'],
    topics: [
      { t: 'grain/silo/1/profile', dir: 'node → broker', payload: 'depth temps, RH, CO₂, EMC' },
      { t: 'grain/silo/1/alert', dir: 'node → broker', payload: 'hot-spot / EMC / CO₂ alerts' },
      { t: 'grain/silo/1/status', dir: 'node → broker', payload: 'battery, RSSI, uptime' },
    ],
    cloud: ['The gateway publishes to an MQTT broker; a small dashboard trends each depth and the CO₂ over the whole storage season, so you can see whether the mass actually cooled after loading or has been quietly drifting warmer.'],
    dashboard: ['A per-silo panel shows the depth column, EMC and CO₂ updated each cycle; a season view overlays every depth so a slow warming trend at one layer stands out long before it becomes an alarm.'],
    mobile: ['Alerts push to the operator\'s phone naming the silo, the affected layer and the recommended action — aerate, ventilate or inspect.'],
    security: [
      'Include a per-node key and a rolling counter in each packet so a neighbour\'s identical hardware cannot spoof or replay readings.',
      'Authenticate the broker so only the operator\'s dashboard subscribes to the silo data.',
      'Alert on communication loss so a silently-dead node is noticed rather than assumed healthy.',
    ],
  },

  perf: [
    'Deep-sleep between hourly reads; the DS18B20 conversion and CO₂ lamp are the main awake-time costs.',
    'Raise the sampling rate only while an alarm is active — that is when temporal resolution actually matters.',
    'Keep LoRa at the lowest spreading factor that still reaches the gateway reliably; higher SF costs air-time and battery.',
    'Cache the depth map and CO₂ baseline in flash so a reboot never restarts the season\'s trend from scratch.',
  ],
  safety: [
    'Confined space: never enter a silo to install or service sensors. Grain engulfment and oxygen-deficient or CO₂-rich atmospheres are lethal. Work from the top hatch only.',
    'Follow your grain store\'s lockout rules before anyone works near augers, sweeps or aeration fans.',
    'The monitor warns of spoilage risk; it does not replace a store\'s fire, fumigation and confined-space procedures.',
    'Keep the lithium battery and charger in the roof enclosure, away from grain dust, which is combustible.',
  ],
  maintenance: [
    'Re-run the CO₂ fresh-air calibration at the start of each storage season.',
    'Inspect the sensor cable jacket for grain-flow abrasion when the silo is empty.',
    'Clean dust off the solar panel; a dusty panel is the most common cause of a mid-season brown-out.',
    'Re-verify the depth map if the cable is ever removed and re-hung.',
  ],
  future: [
    'Add a second CO₂ sample point lower in the mass for a vertical activity gradient.',
    'Drive an aeration-fan relay automatically when ambient air is dry and cool enough to help.',
    'Estimate insect activity by separating CO₂ diurnal rhythm from the slow mould baseline.',
    'Fuse several seasons of profiles to predict safe storage duration for a given grain and moisture.',
  ],
  faq: [
    { q: 'Why not just one temperature sensor in the middle?', a: 'Grain insulates so well that a hot spot half a metre away is invisible to a single sensor. Several depths let you see divergence, which is the actual early signal.' },
    { q: 'Is CO₂ really necessary if I have temperature?', a: 'CO₂ moves first. Respiration produces measurable CO₂ long before it warms a large thermal mass, so it buys you days of early warning that temperature alone cannot.' },
    { q: 'Will running the aeration fan always help?', a: 'No — pushing warm, humid air through cool grain adds moisture. That is exactly why the monitor reports ambient conditions and EMC, so you aerate when the air will actually dry and cool the grain.' },
    { q: 'How long does it run without mains?', a: 'A small solar panel and one 18650 comfortably cover a storage season at hourly sampling, because the device sleeps almost all the time.' },
    { q: 'Can one gateway serve several silos?', a: 'Yes. Each node carries its own ID and key; the LoRa gateway collects them all and forwards to your dashboard.' },
  ],
  refs: [
    { t: 'FAO — Grain storage techniques and stored-grain ecology', u: 'https://www.fao.org/', s: 'FAO' },
    { t: 'Modified Henderson EMC model for cereal grains', u: 'https://en.wikipedia.org/wiki/Equilibrium_moisture_content', s: 'Reference' },
    { t: 'DS18B20 programmable resolution 1-Wire digital thermometer (datasheet)', u: 'https://www.analog.com/en/products/ds18b20.html', s: 'Analog Devices' },
    { t: 'MH-Z19 NDIR CO₂ sensor — application notes', u: 'https://www.winsen-sensor.com/', s: 'Winsen' },
    { t: 'OSHA / confined-space grain handling safety', u: 'https://www.osha.gov/grain-handling', s: 'OSHA' },
  ],
  images: ['esp32', 'lora', 'solar'],
  imageCaptions: [
    'ESP32 module — the low-power controller that samples the depth cable, computes EMC and drives the LoRa link.',
    'A LoRa radio module carries the depth profile across farm distances and through the silo\'s metal skin without Wi-Fi or mains.',
    'A small solar panel keeps the monitor alive through a whole storage season with no wiring to the silo.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   034 — Solar Pump Controller
   ══════════════════════════════════════════════════════════════════ */
{
  id: '034',
  domainKey: 'iot',
  emoji: '☀️', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Runs a solar borewell pump only when there is enough sun and the tank actually needs water, and protects it from the dry-run that kills submersible pumps.',

  overview: [
    'A solar borewell pump is a wonderful thing until the day it runs dry. When the water level in the well drops below the pump intake — which happens on hot afternoons exactly when the sun is strongest and the pump is running hardest — a submersible pump keeps spinning with no water to cool or lubricate it. Within minutes the seals cook and the motor burns out, and a farmer who bought a pump to save money on diesel is suddenly facing its full replacement cost. This controller sits between the solar array and the pump and makes the pump smart: it runs when the sun is strong <i>and</i> the tank needs filling, and it shuts down the instant it detects a dry run.',
    'The logic is deliberately simple and robust because it protects an expensive asset in a place with no technician nearby. An ultrasonic sensor watches the tank level so the pump stops when the tank is full and starts when it draws down. A current sensor on the pump feed watches the motor: a pump that suddenly draws much less current than normal is almost always running dry or has lost prime, and that signature triggers an immediate protective stop and a cool-down timer. A light sensor (or the panel\'s own voltage) tells the controller whether there is enough sun to start at all, so it never tries to start a pump on a cloudy morning and stall it.',
    'Everything is logged and reported so the farmer can see, from a phone, how much the pump ran, how many dry-run events were caught, and whether the tank is keeping up with demand. The controller turns a bare solar pump into a managed irrigation resource — one that protects itself, waters on its own, and tells you when something is wrong before the crop or the pump suffers.',
  ],
  does: [
    'Starts the pump only when solar power is sufficient and the tank needs water',
    'Stops automatically when the tank is full (ultrasonic level)',
    'Detects a dry run from the pump\'s current signature and stops to protect the motor',
    'Enforces a cool-down before retrying after a dry-run trip',
    'Logs run-time, water delivered (estimated) and every protective event',
    'Reports status and alerts to a phone over Wi-Fi or LoRa',
    'Falls back to a hardware float switch so the tank never overflows even if software fails',
  ],
  features: [
    'Dry-run protection by motor-current signature — saves the pump\'s life',
    'Sun-aware starting so the pump never stalls on weak light',
    'Tank-level control with a hardware float-switch backstop',
    'Cool-down and retry logic instead of hammering a failing pump',
    'Run-time and water-delivered logging for irrigation planning',
    'Contactor drive so the low-voltage controller safely switches a mains/48 V pump',
    'Phone alerts for dry-run, tank-full and no-sun conditions',
  ],
  applications: [
    { t: 'Solar borewell irrigation', d: 'The core case: a submersible solar pump filling an overhead or ground tank for drip/flood irrigation without diesel or grid power.' },
    { t: 'Village drinking-water supply', d: 'A community solar pump filling a storage tank, where an unattended dry-run burnout means days without water and a costly repair.' },
    { t: 'Livestock watering', d: 'Keeping troughs and tanks topped up automatically on remote grazing land far from mains power.' },
    { t: 'Small horticulture / polyhouse', d: 'Managed filling of a header tank that feeds fertigation, where consistent supply and pump longevity both matter.' },
  ],
  skills: [
    'Reading an ultrasonic level sensor and rejecting spurious echoes',
    'Non-invasive current sensing with a Hall-effect sensor (ACS712 / clamp)',
    'Driving a contactor from a microcontroller to switch a high-power pump safely',
    'Designing protective state machines (dry-run trip, cool-down, retry)',
    'Solar power basics: knowing when there is enough light to start a load',
  ],
  prereq: [
    'The controller must never switch pump-level power directly — it drives a correctly-rated contactor or motor starter that switches the pump.',
    'A hardware float switch in series with the contactor coil is a required safety backstop, independent of any software.',
    'Mains/48 V wiring and pump electricals should be done or checked by a qualified electrician. This project builds the low-voltage control brain, not the power wiring.',
  ],

  parts: ['esp32', 'jsnsr04t', 'acs712', 'ina219', 'relay1', 'ldr'],
  extraParts: [
    { name: 'AC/DC contactor rated for the pump', spec: 'Coil driven by the relay; contacts rated ≥ pump full-load current with margin', qty: 1, price: 650, note: 'Choose AC or DC coil to match your control supply' },
    { name: 'Float switch (backstop)', spec: 'Normally-closed, wired in series with the contactor coil at tank-full', qty: 1, price: 180, note: 'Independent hardware overflow protection' },
    { name: 'Waterproof enclosure + glands', spec: 'IP65, room for contactor + controller, DIN or panel mount', qty: 1, price: 550 },
    { name: 'Current transformer or ACS712 module', spec: 'Sized to the pump current; ACS712-30A for small pumps, CT clamp for larger', qty: 1, price: 220, note: 'ACS712 for DC/small AC; a CT for larger AC pumps' },
  ],
  cost: '₹3,000 – ₹4,500',
  libs: ['wifi', 'pubsub', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'JSN-SR04T', devPin: 'TRIG/ECHO', pin: 'GPIO 26/25', sig: 'Waterproof ultrasonic tank level' },
      { dev: 'ACS712 / CT', devPin: 'OUT', pin: 'GPIO 34 (ADC)', sig: 'Pump current signature' },
      { dev: 'INA219', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Panel voltage/current (I²C)' },
      { dev: 'LDR / panel V', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'Sunlight-sufficient signal' },
    ],
    right: [
      { dev: 'Relay → contactor coil', devPin: 'IN', pin: 'GPIO 27', sig: 'Pump on/off via contactor' },
      { dev: 'Float switch', devPin: 'NC', pin: 'In series with coil', sig: 'Hardware tank-full backstop' },
      { dev: 'Status LED/buzzer', devPin: 'IN', pin: 'GPIO 13', sig: 'Local run / fault indicator' },
      { dev: 'Supply', devPin: '5V/3V3', pin: 'Buck from panel/battery', sig: 'Controller power' },
    ],
  },
  wiringNotes: [
    'The ESP32 drives a relay; the relay switches the contactor coil; the contactor switches the pump. The microcontroller never carries pump current.',
    'Wire the float switch (normally-closed at tank-full) in series with the contactor coil. When the tank is full the coil drops out regardless of software — this is the overflow backstop.',
    'Mount the JSN-SR04T transducer looking down at the tank water from the top, clear of the inlet splash, so echoes are clean.',
    'Place the current sensor on the pump feed conductor: ACS712 in-line for small DC/AC pumps, or a clip-on CT for larger AC pumps to avoid breaking the conductor.',
    'Give the contactor coil a flyback/snubber appropriate to its coil type so switching transients do not reset the ESP32.',
    'Keep the ultrasonic and current signal grounds tied to the ESP32 ADC ground reference for stable analogue readings.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Tank level', sub: 'JSN-SR04T ultrasonic' },
      { name: 'Pump current', sub: 'ACS712 / CT', highlight: true },
      { name: 'Sun', sub: 'LDR / panel V' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'state machine' },
      { name: 'Protect', sub: 'dry-run + cool-down' },
    ] },
    { label: 'Actuate', edge: 'right', blocks: [
      { name: 'Relay', sub: 'coil driver' },
      { name: 'Contactor', sub: 'switches pump' },
      { name: 'Float NC', sub: 'HW backstop' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'Wi-Fi/LoRa', sub: 'status + alerts' },
    ] },
  ] },
  flow: [
    { t: 'Idle', k: 'start' },
    { t: 'Enough sun and tank not full?', k: 'dec', yes: 'Start pump via contactor', no: 'Stay idle' },
    { t: 'Stay idle', k: 'io', back: 'Idle' },
    { t: 'Start pump via contactor', k: 'proc' },
    { t: 'Current normal (not dry)?', k: 'dec', yes: 'Run + fill tank', no: 'Trip: stop + cool-down' },
    { t: 'Run + fill tank', k: 'proc' },
    { t: 'Tank full or sun gone?', k: 'dec', yes: 'Stop pump', no: 'Run + fill tank' },
    { t: 'Trip: stop + cool-down', k: 'io' },
    { t: 'Stop pump', k: 'end', back: 'Idle' },
  ],

  principle: [
    'The controller is a protective state machine wrapped around three questions: is there enough sun to run, does the tank need water, and is the pump running healthily. Only when the first two are yes does it start; while running, the third question is checked continuously and can stop the pump in a fraction of a second.',
    'Dry-run detection rests on a simple fact of centrifugal pumps: a pump moving water does work and draws its rated current; a pump spinning in air (dry, or having lost prime) does far less work and draws noticeably <b>less</b> current. So the protective signal is not an over-current — it is an <i>under</i>-current relative to the pump\'s learned normal running draw. When current collapses below a fraction of the learned baseline while the pump should be pumping, the controller trips immediately. This catches dry runs, lost prime and a closed/blocked delivery before heat destroys the seals.',
    'The sun check prevents a different failure: starting a pump on marginal light. A solar pump fed by weak sun may draw current, strain, and stall without ever moving water — which itself looks like and can cause a dry-run-like stress. By requiring a minimum irradiance (from an LDR or, better, the panel\'s open-circuit/loaded voltage) before starting, the controller only ever commits to a start it can sustain.',
    'Tank-level control closes the outer loop. The ultrasonic sensor measures the distance to the water surface; knowing the tank geometry converts that to a fill fraction. The pump starts when the tank draws down past a low mark and stops at a high mark, with hysteresis so it does not chatter on and off around a single level. And underneath all of it sits the float switch — a piece of hardware that drops the contactor coil at tank-full no matter what the software believes, so the tank physically cannot overflow.',
  ],
  equations: [
    { t: 'Tank fill fraction from ultrasonic distance', eq: 'Sensor measures distance d to the water surface.\nTank of height H, sensor mounted at the top:\n\n  water_depth = H − d\n  fill_fraction = (H − d) / H          (clamp to [0,1])\n\nStart pump when fill_fraction < LOW  (e.g. 0.30)\nStop  pump when fill_fraction > HIGH (e.g. 0.90)\nHysteresis (HIGH−LOW) prevents on/off chatter.' },
    { t: 'Dry-run detection by under-current', eq: 'Learn the healthy running current I_run over the first\nseconds of a good run (pump primed, moving water).\n\n  dry if I_now < k · I_run   (e.g. k = 0.6) for t > t_debounce\n\nA pump in air does far less work → draws far less current.\nDebounce (t_debounce ~ 3–5 s) rejects the start-up inrush\nand momentary air slugs.' },
    { t: 'Water delivered estimate', eq: 'Without a flow meter, estimate volume from run-time:\n\n  V ≈ Q_rated · t_run · η_head\n\nQ_rated is the pump\'s rated flow at the working head,\nt_run the accumulated run-time, η_head a derating for the\nactual head vs rated. A cheap way to log daily delivery;\nadd a flow sensor later for true measurement.' },
  ],

  assembly: [
    { h: 'Mount the control enclosure', p: [
      'Fit the contactor and the low-voltage controller in one IP65 box near the pump\'s electrical connection. Keep the pump-power wiring (contactor input/output) physically separated from the signal wiring inside the box.',
      'Bring the pump feed through the contactor. Have the current sensor on the pump-side conductor so it sees the motor\'s draw.',
    ], warn: 'All pump-power wiring must be done or verified by a qualified electrician and isolated before you work inside the box.' },
    { h: 'Install the tank sensor and float', p: [
      'Mount the JSN-SR04T transducer at the top of the tank, aimed straight down at the water, away from the inlet splash and tank walls that cause false echoes.',
      'Fit the float switch at the tank-full level and wire its normally-closed contact in series with the contactor coil, so a full tank physically opens the coil circuit.',
    ] },
    { h: 'Wire the sun sensor', p: [
      'Place the LDR (or tap the panel voltage through a divider into an ADC pin) where it sees the same sky the array does, so "enough sun" reflects what the panel actually receives.',
    ], tip: 'Panel loaded-voltage is a better sun proxy than an LDR: a panel that sags under load in weak light tells you directly that a start will not sustain.' },
  ],
  steps: [
    { h: 'Calibrate the empty/full tank levels', p: [
      'With the tank empty, record the ultrasonic distance; with it full, record it again. These two numbers define the fill-fraction scale for your specific tank.',
    ] },
    { h: 'Learn the healthy running current', p: [
      'On a known-good, primed run, capture the steady running current a few seconds after start (past inrush). Store it as the baseline the dry-run test compares against.',
    ], tip: 'Re-learn the baseline seasonally — a worn pump or a changed head shifts the normal running current.' },
    { h: 'Implement the protective state machine', p: [
      'Move between IDLE, STARTING, RUNNING, and COOLDOWN. Enter STARTING only when sun and tank demand agree; require healthy current to reach RUNNING; drop to COOLDOWN on a dry-run trip and refuse to restart until the timer expires.',
    ], code: {
      file: 'pump-fsm.ino', lang: 'cpp',
      body: `enum State { IDLE, STARTING, RUNNING, COOLDOWN };
State st = IDLE;
uint32_t stateSince = 0;
float I_run = 0;              // learned healthy running current

void setPump(bool on) { digitalWrite(PIN_RELAY, on ? HIGH : LOW); }

void tick(float fill, float sun, float I, uint32_t now) {
  switch (st) {
    case IDLE:
      if (sun > SUN_MIN && fill < LOW) enter(STARTING, now);
      break;

    case STARTING:                       // spin up, ride out inrush
      setPump(true);
      if (now - stateSince > START_MS) {
        I_run = I;                        // capture healthy running draw
        enter(RUNNING, now);
      }
      break;

    case RUNNING:
      setPump(true);
      if (I < DRY_K * I_run && now - stateSince > DRY_DEBOUNCE_MS) {
        setPump(false);
        alert("Dry-run: current %.1fA < %.1fA. Cooling down.", I, DRY_K*I_run);
        enter(COOLDOWN, now);
      } else if (fill > HIGH || sun < SUN_MIN) {
        setPump(false);
        enter(IDLE, now);                 // tank full or sun gone
      }
      break;

    case COOLDOWN:
      setPump(false);
      if (now - stateSince > COOLDOWN_MS) enter(IDLE, now);
      break;
  }
}

void enter(State s, uint32_t now) { st = s; stateSince = now; }`,
      explain: [
        { ref: 'if (sun > SUN_MIN && fill < LOW)', txt: 'The pump only ever starts when there is enough sun to sustain it and the tank actually needs water — never on marginal light.' },
        { ref: 'I_run = I;', txt: 'A few seconds into a good run, past the inrush, the controller learns the pump\'s healthy current so the dry-run test compares against reality, not a fixed guess.' },
        { ref: 'if (I < DRY_K * I_run', txt: 'Dry running shows up as a current collapse below a fraction of the learned normal; debounced, it trips an immediate protective stop.' },
        { ref: 'case COOLDOWN', txt: 'After a trip the pump is held off for a fixed cool-down instead of being hammered on and off, letting the well recover and the motor cool.' },
      ],
    } },
    { h: 'Log and report', p: [
      'Accumulate run-time, estimate water delivered, count dry-run trips, and publish status plus any alerts to the phone/dashboard each cycle and on every state change.',
    ] },
  ],

  code: [{
    file: 'solar-pump-controller.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Solar Pump Controller — ESP32

   Runs a solar borewell pump only with sufficient sun and tank demand,
   protects it from dry-running by motor-current signature, enforces a
   cool-down, and reports status/alerts. Drives a contactor; a hardware
   float switch in series with the coil is the overflow backstop.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Preferences.h>

#define PIN_TRIG   26
#define PIN_ECHO   25
#define PIN_CUR    34     // ACS712 / CT signal (ADC)
#define PIN_SUN    35     // LDR or panel-voltage divider (ADC)
#define PIN_RELAY  27     // -> contactor coil
#define PIN_LED    13

#define TANK_H_CM   200.0f
#define LOW_FRAC    0.30f
#define HIGH_FRAC   0.90f
#define SUN_MIN     0.35f   // normalised sun threshold to start
#define DRY_K       0.60f   // trip below 60% of learned running current
#define START_MS    5000    // ride out inrush, then learn baseline
#define DRY_DEBOUNCE_MS 4000
#define COOLDOWN_MS 600000  // 10 min after a dry-run trip

enum State { IDLE, STARTING, RUNNING, COOLDOWN };
State st = IDLE;
uint32_t stateSince = 0;
float I_run = 0, runMinutes = 0;
uint32_t dryTrips = 0, lastRunTick = 0;

Preferences prefs;
WiFiClient net;
PubSubClient mqtt(net);

/* ── sensors ─────────────────────────────────────────────────── */
float readDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long us = pulseIn(PIN_ECHO, HIGH, 30000);
  if (us == 0) return NAN;                 // no echo
  return us / 58.0f;                       // cm
}

// Median of several pings rejects the odd spurious echo.
float tankFill() {
  float d[5];
  for (int i = 0; i < 5; i++) { d[i] = readDistanceCm(); delay(60); }
  for (int i = 0; i < 4; i++) for (int j = i+1; j < 5; j++)
    if (d[j] < d[i]) { float t = d[i]; d[i] = d[j]; d[j] = t; }
  float dist = d[2];
  if (isnan(dist)) return -1;
  float frac = (TANK_H_CM - dist) / TANK_H_CM;
  return constrain(frac, 0.0f, 1.0f);
}

float sunLevel() {                          // normalised 0..1
  return analogRead(PIN_SUN) / 4095.0f;
}

// RMS-ish current from the sensor (offset-removed, scaled).
float pumpCurrent() {
  const int N = 400; long acc = 0; int mid = 2048;
  for (int i = 0; i < N; i++) {
    int v = analogRead(PIN_CUR) - mid;
    acc += (long)v * v;
  }
  float rms = sqrtf((float)acc / N);
  return rms * CUR_SCALE;                   // A; CUR_SCALE from calibration
}

/* ── state machine ───────────────────────────────────────────── */
void setPump(bool on) {
  digitalWrite(PIN_RELAY, on ? HIGH : LOW);
  digitalWrite(PIN_LED,   on ? HIGH : LOW);
}
void enter(State s, uint32_t now) { st = s; stateSince = now; }

void publish(float fill, float sun, float I) {
  char buf[220];
  const char *sn[] = {"idle","starting","running","cooldown"};
  snprintf(buf, sizeof buf,
    "{\\"state\\":\\"%s\\",\\"fill\\":%.2f,\\"sun\\":%.2f,\\"I\\":%.2f,"
    "\\"I_run\\":%.2f,\\"run_min\\":%.0f,\\"dry_trips\\":%u}",
    sn[st], fill, sun, I, I_run, runMinutes, dryTrips);
  mqtt.publish("pump/1/status", buf);
}

void tick() {
  uint32_t now = millis();
  float fill = tankFill();
  float sun  = sunLevel();
  float I    = pumpCurrent();

  switch (st) {
    case IDLE:
      setPump(false);
      if (sun > SUN_MIN && fill >= 0 && fill < LOW_FRAC) enter(STARTING, now);
      break;
    case STARTING:
      setPump(true);
      if (now - stateSince > START_MS) { I_run = I; enter(RUNNING, now); }
      break;
    case RUNNING:
      setPump(true);
      if (now - lastRunTick > 60000) { runMinutes += 1; lastRunTick = now; }
      if (I < DRY_K * I_run && now - stateSince > DRY_DEBOUNCE_MS) {
        setPump(false);
        dryTrips++;
        mqtt.publish("pump/1/alert", "dry-run trip");
        prefs.begin("pump", false);
        prefs.putUInt("dry", dryTrips);
        prefs.putFloat("run", runMinutes);
        prefs.end();
        enter(COOLDOWN, now);
      } else if (fill > HIGH_FRAC || sun < SUN_MIN) {
        setPump(false);
        enter(IDLE, now);
      }
      break;
    case COOLDOWN:
      setPump(false);
      if (now - stateSince > COOLDOWN_MS) enter(IDLE, now);
      break;
  }
  publish(fill, sun, I);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  setPump(false);
  analogSetPinAttenuation(PIN_CUR, ADC_11db);
  analogSetPinAttenuation(PIN_SUN, ADC_11db);

  prefs.begin("pump", true);
  runMinutes = prefs.getFloat("run", 0);
  dryTrips   = prefs.getUInt("dry", 0);
  prefs.end();

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
}

void loop() {
  if (!mqtt.connected()) mqtt.connect("pump-1");
  mqtt.loop();
  tick();
  delay(1000);                              // 1 Hz control loop
}`,
    explain: [
      { ref: 'float tankFill()', txt: 'Takes five ultrasonic pings and uses the median, so a single spurious echo off the inlet splash or a tank wall cannot fake a level and mis-trigger the pump.' },
      { ref: 'float pumpCurrent()', txt: 'Computes an RMS-style current from many fast ADC samples of the AC/DC current sensor, which is what the dry-run test needs — a stable measure of how hard the motor is working.' },
      { ref: 'if (sun > SUN_MIN && fill >= 0 && fill < LOW_FRAC)', txt: 'The start condition is a conjunction: enough sun, a valid level reading, and genuine tank demand. A failed level read (fill < 0) blocks the start rather than guessing.' },
      { ref: 'prefs.putUInt("dry", dryTrips)', txt: 'Run-time and dry-trip counts survive power loss, so the season\'s log and the pump\'s protective history are not wiped every sunset.' },
      { ref: 'delay(1000)', txt: 'A one-second control loop is fast enough to catch a dry run within the debounce window while keeping the ADC and Wi-Fi work light.' },
    ],
  }],

  config: [
    'Set TANK_H_CM and the LOW/HIGH fractions to your tank geometry and desired reserve.',
    'Calibrate CUR_SCALE against a clamp meter so pumpCurrent() reads true amps.',
    'Tune DRY_K (fraction of running current that counts as dry) to your pump — start at 0.6 and adjust after watching a real dry run.',
    'Set SUN_MIN from observation: the lowest sun level at which your pump reliably sustains a run.',
    'Pick the reporting transport (Wi-Fi/MQTT here, or LoRa for remote wells) and the cool-down duration.',
  ],
  calibration: [
    { h: 'Tank scale', p: [
      'Record ultrasonic distance at empty and full; verify the computed fill fraction matches a physical mark at a couple of intermediate levels.',
    ] },
    { h: 'Current scale', p: [
      'With the pump running normally, compare pumpCurrent() to a clamp-meter reading and set CUR_SCALE so they agree. This is the anchor for dry-run detection.',
    ] },
    { h: 'Dry-run threshold', p: [
      'Deliberately (and briefly, safely) create a lost-prime or closed-valve condition and watch the current drop; set DRY_K comfortably above the dry current but below the healthy current.',
    ] },
  ],
  testing: [
    { step: 'Empty tank, full sun', expect: 'Controller starts the pump, reaches RUNNING, learns I_run' },
    { step: 'Simulate tank filling to HIGH', expect: 'Pump stops cleanly; state returns to IDLE' },
    { step: 'Simulate dry run (close valve / lost prime)', expect: 'Current collapses; trip within debounce; COOLDOWN entered; alert sent' },
    { step: 'Shade the sun sensor', expect: 'Pump will not start; if running with sun lost, it stops' },
    { step: 'Open the float switch at tank-full', expect: 'Contactor drops out in hardware regardless of software state' },
    { step: 'Power-cycle mid-run', expect: 'Run-time and dry-trip counts restored from flash' },
  ],
  output: [
    'The dashboard shows the current state, tank fill, sun level, live pump current versus the learned running current, cumulative run-time and dry-trip count.',
    { file: 'status.json', lang: 'json', body: `{
  "state": "running",
  "fill": 0.42,
  "sun": 0.78,
  "I": 4.9,
  "I_run": 5.1,
  "run_min": 137,
  "dry_trips": 2
}` },
    'A dry-run event appears as the live current I dropping well below I_run, followed by a state change to "cooldown" and a "dry-run trip" alert on the phone.',
  ],
  troubleshoot: [
    { sym: 'Pump short-cycles on/off', cause: 'LOW and HIGH fractions too close, or noisy level reads', fix: 'Widen the hysteresis; keep the median-of-5 ping filter; move the transducer away from splash' },
    { sym: 'False dry-run trips', cause: 'DRY_K too high or CUR_SCALE wrong', fix: 'Re-calibrate current against a clamp meter; lower DRY_K; lengthen the debounce slightly' },
    { sym: 'Pump never starts', cause: 'SUN_MIN too high, float switch open, or level read failing', fix: 'Lower SUN_MIN; check the float wiring; confirm tankFill() returns a valid fraction' },
    { sym: 'ESP32 resets when the pump switches', cause: 'Contactor coil transient coupling into the controller supply', fix: 'Add a proper snubber/flyback across the coil; separate control and power grounds/wiring' },
    { sym: 'Tank overflows', cause: 'Relying on software alone', fix: 'This must never happen — verify the NC float switch is truly in series with the contactor coil' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT (LoRa for remote wells)',
    net: {
      nodes: [{ name: 'Pump controller', sub: 'ESP32' }, { name: 'Tank sensor', sub: 'on the same node' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router / LoRa GW', gatewaySub: 'or LoRa for a remote well',
      uplink: 'MQTT 1883', cloud: 'Broker + dashboard', cloudSub: 'run-time & events',
      clients: [{ name: 'Dashboard', sub: 'state, fill, current' }, { name: 'Phone', sub: 'dry-run alerts' }],
    },
    protocol: ['Status JSON is published at roughly 1 Hz locally and throttled to a sensible rate over the network, with an immediate publish on any state change or protective trip so a dry-run event reaches the operator without waiting for the next heartbeat.'],
    topics: [
      { t: 'pump/1/status', dir: 'node → broker', payload: 'state, fill, current, run-time' },
      { t: 'pump/1/alert', dir: 'node → broker', payload: 'dry-run, tank-full-timeout, no-sun' },
      { t: 'pump/1/cmd', dir: 'broker → node', payload: 'force-stop, enable/disable' },
    ],
    cloud: ['A broker plus a small dashboard trends run-time, estimated water delivered and every dry-run event; a command topic lets the owner force-stop or enable/disable the pump remotely without defeating the local hardware interlocks.'],
    dashboard: ['A live tile shows state, tank fill and live pump current against the learned running current, with daily bars of run-time and delivery and a red marker on every dry-run trip.'],
    mobile: ['Push alerts fire for a dry-run trip, a tank-full-timeout (the pump ran but the tank is not filling — a likely blockage) and days with no usable sun.'],
    security: [
      'Authenticate the command topic so only the owner can start or stop the pump remotely.',
      'Keep the float-switch interlock and dry-run trip entirely in local hardware/firmware, independent of the network.',
      'Alert on communication loss so a controller that has gone silent is investigated.',
    ],
  },

  perf: [
    'Run the control loop at ~1 Hz — fast enough to catch a dry run, light enough on the ADC and radio.',
    'Average many ADC samples for current; a single sample is far too noisy to base a protective trip on.',
    'Publish on change plus a slow heartbeat rather than streaming every second, to keep network and power modest.',
    'If solar-powered controller electronics, deep-sleep the reporting stack overnight when the pump cannot run anyway.',
  ],
  safety: [
    'The controller drives a correctly-rated contactor; it never switches pump power directly.',
    'A normally-closed float switch in series with the contactor coil is a mandatory hardware overflow backstop, independent of software.',
    'Have a qualified electrician do or verify all pump-power wiring and earthing/RCD protection.',
    'Dry-run protection reduces but does not eliminate pump risk — do not defeat the pump\'s own thermal or motor-protection devices.',
  ],
  maintenance: [
    'Re-learn the healthy running current at the start of each season and after any pump service.',
    'Clean the ultrasonic transducer face; scale or a spider web across it causes phantom levels.',
    'Check the float switch physically moves freely and its contacts are sound.',
    'Inspect the contactor contacts for pitting; a solar pump cycles them thousands of times a season.',
  ],
  future: [
    'Add a true flow meter for measured (not estimated) delivery and a blockage alarm when current is normal but flow is low.',
    'Add a well-level probe to distinguish a dry well from a dry pump.',
    'Log energy from the INA219 to report water-per-kWh efficiency of the array.',
    'MPPT-aware starting: begin only when the array can hold its maximum-power voltage under load.',
  ],
  faq: [
    { q: 'How does it detect a dry run without a special sensor?', a: 'A pump moving water draws its rated current; a pump spinning in air draws much less. The controller learns the healthy current, then trips when the current collapses below a fraction of it.' },
    { q: 'What if the software crashes with the pump on?', a: 'The float switch is wired in hardware series with the contactor coil, so at tank-full the pump drops out no matter what the software does. That is the whole point of the backstop.' },
    { q: 'Why check sunlight before starting?', a: 'Starting a solar pump on weak light can make it strain and stall without moving water, which stresses the motor. Requiring a minimum sun level means every start is one the array can actually sustain.' },
    { q: 'Can it run a mains or 48 V DC pump?', a: 'Yes — the controller drives a contactor sized for your pump, so the same control logic works for AC or DC pumps as long as the contactor and current sensor match the pump.' },
    { q: 'Does it measure how much water I pumped?', a: 'It estimates volume from run-time and rated flow out of the box; add a flow meter for a true measurement and a blockage alarm.' },
  ],
  refs: [
    { t: 'Submersible pump dry-run protection — application notes', u: 'https://en.wikipedia.org/wiki/Submersible_pump', s: 'Reference' },
    { t: 'ACS712 Hall-effect current sensor (datasheet)', u: 'https://www.allegromicro.com/en/products/sense/current-sensor-ics/zero-to-fifty-amp-integrated-conductor-sensor-ics/acs712', s: 'Allegro' },
    { t: 'JSN-SR04T waterproof ultrasonic ranging module', u: 'https://www.electroschematics.com/', s: 'Reference' },
    { t: 'Solar water pumping systems — design guidance', u: 'https://mnre.gov.in/', s: 'MNRE India' },
    { t: 'Contactor selection and coil control basics', u: 'https://en.wikipedia.org/wiki/Contactor', s: 'Reference' },
  ],
  images: ['solar', 'esp32', 'ultrasonic'],
  imageCaptions: [
    'A solar array feeds the borewell pump; the controller decides when it is worth starting and protects it while it runs.',
    'ESP32 module running the protective state machine — sun, tank and current in, contactor drive out.',
    'A waterproof ultrasonic sensor reads the tank surface from above to close the fill-level control loop.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   035 — Beehive Health Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '035',
  domainKey: 'iot',
  emoji: '🐝', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Weighs a beehive continuously and listens to its temperature, humidity and sound so a beekeeper reads the colony\'s state without opening it.',

  overview: [
    'Every time a beekeeper opens a hive to inspect it, they chill the brood, crush a few bees, provoke the colony, and interrupt the very work they are trying to protect. Yet the colony is constantly broadcasting its state in signals you never see from the outside: its <b>weight</b> climbs during a nectar flow and falls when foragers cannot fly or when stores are being eaten; its <b>brood-nest temperature</b> is held near 35 °C with astonishing precision whenever there is brood to raise; its <b>sound</b> changes character before swarming and when the colony goes queenless. This monitor turns the hive into an instrument so the beekeeper reads those signals from a phone and only opens the hive when the data says something is worth checking.',
    'A load cell under the hive (or a framed scale platform) measures weight to the tens of grams, revealing the daily rhythm of foraging and the slow arc of the honey flow. An SHT31 in the brood area tracks temperature and humidity; a stable 34–35 °C signals healthy, actively-thermoregulated brood, while a sudden loss of regulation can mean a failing or absent queen. A microphone captures the hive\'s acoustic signature, whose changes precede swarming and mark queenlessness. An ESP32 logs all of it, and because apiaries sit in fields far from power and Wi-Fi, the whole thing runs on solar and reports over LoRa.',
    'The result is a hive that tells its own story: "gained 1.8 kg today — good flow", "brood temperature slipping, inspect the queen", "pre-swarm acoustic signature rising". It reduces needless inspections, catches problems days earlier than a monthly check would, and — for a beekeeper running many hives across many sites — turns a guessing game into a prioritised list of which colonies actually need a visit.',
  ],
  does: [
    'Weighs the hive continuously to tens-of-grams resolution (load cell + HX711)',
    'Tracks brood-area temperature and humidity, the core sign of colony health',
    'Captures the hive\'s acoustic signature to flag pre-swarm and queenless states',
    'Separates daily foraging rhythm from the slow honey-flow trend in the weight',
    'Runs on solar + battery in a remote apiary with no mains or Wi-Fi',
    'Reports over long-range LoRa to a base station or phone',
    'Alerts on abnormal weight loss, lost thermoregulation and swarm-signature changes',
  ],
  features: [
    'Hive-scale weight with temperature compensation of the load cell',
    'Brood thermoregulation as a direct, non-invasive queen-health proxy',
    'Acoustic features (band energy) for swarm and queenless detection',
    'Nectar-flow vs consumption separated from the weight signal',
    'Season-long solar operation with deep sleep between reads',
    'LoRa link for apiaries far from any network',
    'Fewer, better-timed inspections — the colony is disturbed only when needed',
  ],
  applications: [
    { t: 'Hobby and sideline beekeeping', d: 'A beekeeper with a handful of hives watching each colony\'s weight and brood health remotely, opening a hive only when the data warrants.' },
    { t: 'Commercial / migratory apiaries', d: 'Hundreds of hives across many sites, where a scale on each colony turns hive management into a prioritised route rather than a blind round.' },
    { t: 'Pollination services', d: 'Growers renting hives for pollination can verify colony strength and activity objectively during the contract.' },
    { t: 'Research and conservation', d: 'Long-term weight, temperature and acoustic records for studying forage availability, colony collapse and climate effects on bees.' },
  ],
  skills: [
    'Using a load cell with an HX711 24-bit ADC, including tare and calibration',
    'Temperature-compensating a weight signal',
    'Reading an I²S/analogue microphone and computing simple band-energy features',
    'Interpreting brood thermoregulation and hive acoustics',
    'LoRa + solar design for remote, season-long deployment',
  ],
  prereq: [
    'Site the load cell so the hive\'s full weight passes through it evenly; a lopsided load reads badly and stresses the cell.',
    'Place the temperature/humidity probe in the brood area but where bees will not fully propolise it over — a small vented cage helps.',
    'Bees defend their hive; do all sensor installation wearing appropriate protection and, ideally, during a calm, cool period.',
  ],

  parts: ['esp32', 'loadcell', 'sht31', 'ds18b20', 'inmp441', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Hive scale frame + HX711', spec: 'Load cell(s) in a platform sized to the hive footprint; 200 kg bar or 4× 50 kg', qty: 1, price: 1100, note: 'Single bar under a corner + pivot, or four cells for full support' },
    { name: 'Vented probe cage', spec: 'Protects the SHT31 in the brood box from propolis while letting air through', qty: 1, price: 90 },
    { name: 'Weatherproof enclosure', spec: 'IP65 for the electronics, mounted on or beside the hive stand', qty: 1, price: 420 },
  ],
  cost: '₹3,800 – ₹5,200',
  libs: ['wifi', 'hx711', 'unified', 'onewire', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'HX711 (load cell)', devPin: 'DT/SCK', pin: 'GPIO 16/4', sig: 'Weight ADC (24-bit)' },
      { dev: 'SHT31', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Brood temp + humidity (I²C)' },
      { dev: 'DS18B20', devPin: 'DQ', pin: 'GPIO 17', sig: 'Ambient temp (load-cell compensation)' },
      { dev: 'INMP441 mic', devPin: 'SD/WS/SCK', pin: 'GPIO 33/25/32', sig: 'I²S hive audio' },
    ],
    right: [
      { dev: 'LoRa SX1276', devPin: 'SCK/MISO/MOSI', pin: 'GPIO 18/19/23', sig: 'SPI radio bus' },
      { dev: 'LoRa SX1276', devPin: 'NSS/RST/DIO0', pin: 'GPIO 5/14/2', sig: 'Chip-select, reset, IRQ' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar-charged 18650 supply' },
      { dev: 'Solar panel', devPin: '+/–', pin: 'TP4056 IN', sig: '6 V panel → charger' },
    ],
  },
  wiringNotes: [
    'Mount the load cell so the hive\'s weight is carried cleanly through it — a single bar under one edge with a pivot at the other, or four cells at the corners for a heavy hive.',
    'Run the HX711 close to the load cell and keep its excitation/signal leads short; it is a sensitive 24-bit converter and long analogue leads pick up noise.',
    'Give the ambient DS18B20 its own spot in shade near the hive so it measures the temperature the load cell actually sees, for compensation.',
    'The INMP441 is an I²S MEMS mic; wire SD/WS/SCK to the I²S pins and place it against the hive body where it hears the cluster, not the wind.',
    'Keep the electronics box off the hive\'s vibration path where practical so bee activity and wind do not shake the enclosure and the mic mount.',
  ],

  block: { columns: [
    { label: 'The hive speaks', edge: 'right', blocks: [
      { name: 'Weight', sub: 'load cell + HX711', highlight: true },
      { name: 'Brood T/RH', sub: 'SHT31' },
      { name: 'Sound', sub: 'INMP441 I²S' },
      { name: 'Ambient T', sub: 'DS18B20' },
    ] },
    { label: 'Interpret', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'compensate + features' },
      { name: 'Trends', sub: 'flow, brood, swarm' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'LoRa', sub: 'to apiary base' },
    ] },
    { label: 'Beekeeper', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'per-hive story' },
      { name: 'Alert', sub: 'which hive to open' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Read weight (temp-compensated)', k: 'proc' },
    { t: 'Read brood T/RH + ambient', k: 'proc' },
    { t: 'Record short audio, compute band energy', k: 'proc' },
    { t: 'Brood regulation lost or swarm signature?', k: 'dec', yes: 'Flag colony for inspection', no: 'Update trends' },
    { t: 'Flag colony for inspection', k: 'io' },
    { t: 'Update trends', k: 'proc' },
    { t: 'Transmit over LoRa', k: 'io' },
    { t: 'Sleep until next interval', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'Weight is the richest single signal a hive gives. Over a day it traces the colony\'s foraging: it dips in the morning as foragers leave, climbs through the day as they return laden, and settles overnight. Subtract that daily rhythm and the residual trend is the <b>honey flow</b> — kilograms gained over a good week, or a steady loss when nectar is scarce and the colony is eating its stores. A sudden step down can mean a swarm has left (taking half the bees and some honey) or a robbing event; a sudden step up is usually the beekeeper adding a box. The load cell must be temperature-compensated, because the metal\'s response drifts with heat and an uncompensated scale would fake a daily weight cycle that is really just the sun warming the sensor.',
    'Brood temperature is the colony\'s vital sign. Honeybees hold the brood nest at roughly 34–35 °C with remarkable stability whenever there is brood to raise, spending real energy to do it. As long as that regulation holds, the colony has the population and the will to keep brood warm — a strong indirect sign of a laying queen and a healthy workforce. When the brood-area temperature starts drifting with ambient, or collapses, it often means the colony has lost its ability or reason to thermoregulate: a dead or failing queen, a collapsed population, or a colony that has already absconded. That loss of regulation is one of the earliest remote signs that something is seriously wrong.',
    'Sound carries information nothing else does. A queenright colony has a characteristic hum; a queenless one develops a rising, plaintive "roar", and the days before swarming bring changes in the colony\'s acoustic energy and the piping of rival queens. You do not need full spectral analysis on a microcontroller to use this — computing the energy in a few frequency bands and watching how their ratios move over days captures much of the swarm and queenless signal cheaply. The monitor is not trying to diagnose from sound alone; it is raising a flag that, combined with weight and temperature, tells the beekeeper which hive deserves a look.',
    'The value of putting these three signals together is that each disambiguates the others. A weight drop plus a lost brood temperature plus a queenless acoustic signature is a confident "this colony is in trouble". A weight drop with healthy brood temperature and a normal hum is probably just poor forage weather. That fusion — done on-device, reported compactly over LoRa — is what turns raw sensors into a decision about whether to drive out and open the hive.',
  ],
  equations: [
    { t: 'Temperature-compensated weight', eq: 'Raw load-cell output drifts with temperature. Model the\ndrift as roughly linear and correct it:\n\n  W_corr = W_raw − k_T · (T_amb − T_cal)\n\nk_T is the cell/frame drift coefficient (kg per °C),\nfound by watching the empty scale over a day/night cycle.\nT_cal is the temperature at which tare was taken.\nWithout this, a warm afternoon fakes a weight change.' },
    { t: 'Daily rhythm vs honey-flow trend', eq: 'Split the weight series into a fast daily part and a slow\ntrend:\n\n  trend_t = trend_{t−1} + β·(W_corr − trend_{t−1})   (β small)\n  daily   = W_corr − trend_t\n\ntrend rising over days  → nectar flow (honey gain)\ntrend falling steadily  → dearth / consumption\nsharp step down in trend → swarm or robbing event.' },
    { t: 'Brood thermoregulation index', eq: 'Compare brood temperature to ambient:\n\n  reg = (T_brood − T_amb) held while T_brood ≈ 35 °C\n\nHealthy: T_brood stable near 34–35 °C, reg large and steady\nWarning: T_brood tracks T_amb (reg → small) or falls\n         well below 34 °C → possible queen/population loss.' },
    { t: 'Acoustic band-energy features', eq: 'From a short audio capture, compute energy in bands:\n\n  E_low  (~100–300 Hz), E_mid (~300–600 Hz), E_high (>600 Hz)\n  ratio  = E_high / E_low\n\nRising ratio / roar over days can accompany queenlessness;\npre-swarm periods show characteristic shifts and piping.\nUse trends, not one reading, and always with weight + temp.' },
  ],

  assembly: [
    { h: 'Build the hive scale', p: [
      'Fit the load cell(s) into a flat platform sized to the hive footprint. For a light single-box hive one 200 kg bar under a corner with a pivot opposite can work; for a full production hive, four 50 kg cells at the corners share the load and read most accurately.',
      'Wire the cell(s) to the HX711 with short leads and mount the HX711 in the electronics box, close to the platform.',
      'Set the hive on the platform level; a tilted hive puts uneven load on the cell and both reads badly and shortens its life.',
    ], warn: 'A production hive in a flow can exceed 40–50 kg. Size the load cell and frame for the full loaded weight with margin, not the empty box.' },
    { h: 'Place the internal sensors', p: [
      'Slide the SHT31 in its vented cage into the brood area, positioned where the cluster keeps it — near the centre of the brood nest — but where you can retrieve it. Bees will propolise it over time; the cage slows this.',
      'Mount the INMP441 against the hive body so it hears the cluster. Isolate it from wind and rain but keep an acoustic path to the interior.',
    ] },
    { h: 'Set up power and radio', p: [
      'Mount the IP65 box on or beside the hive stand, angle the solar panel to the sun, and route the LoRa antenna clear of metal.',
      'Place the ambient DS18B20 in shade near the hive so the weight compensation uses the temperature the scale actually experiences.',
    ] },
  ],
  steps: [
    { h: 'Tare and calibrate the scale', p: [
      'Tare the empty platform, then place a known weight and set the HX711 scale factor so the reading matches. Record the ambient temperature at tare for the compensation baseline.',
    ], tip: 'Calibrate near midday and again near dawn to estimate the temperature drift coefficient k_T from how the empty reading moves.' },
    { h: 'Learn the brood and acoustic baselines', p: [
      'Over the first days, record the normal brood temperature band and the normal acoustic band ratios for this colony, so later alerts are relative to this hive rather than a textbook number.',
    ] },
    { h: 'Compute features and fuse them', p: [
      'Each cycle: temperature-compensate the weight, update the daily/trend split, read brood T/RH, capture a short audio clip and compute band energies, then combine the three into a health verdict.',
    ], code: {
      file: 'hive-features.ino', lang: 'cpp',
      body: `struct Hive { float weight, trend, broodT, ambT, ratio; };

// Temperature-compensated weight from the HX711 reading.
float compWeight(float raw, float ambT) {
  return raw - K_T * (ambT - T_CAL);          // K_T kg/degC, from calibration
}

// Slow trend (honey flow) separated from the daily foraging rhythm.
void updateTrend(Hive &h, float w) {
  h.trend += 0.02f * (w - h.trend);           // slow EMA
}

// Combine the three channels into a colony verdict.
const char* verdict(const Hive &h, float ratioBase, float trendPrev) {
  bool broodLost = (h.broodT < 32.0f) ||
                   (fabsf(h.broodT - h.ambT) < 3.0f);   // tracks ambient
  bool swarmSig  = (h.ratio > 1.4f * ratioBase);
  bool stepDown  = (trendPrev - h.trend) > 1.0f;        // sudden kg loss

  if (broodLost && (swarmSig || stepDown)) return "CRITICAL: inspect now";
  if (broodLost)                           return "WARN: brood cooling";
  if (swarmSig)                            return "WATCH: swarm signature";
  if (stepDown)                            return "WATCH: sudden weight loss";
  return "OK";
}`,
      explain: [
        { ref: 'compWeight', txt: 'Removes the load cell\'s temperature drift so a warm afternoon does not masquerade as the colony gaining or losing weight.' },
        { ref: 'updateTrend', txt: 'A slow exponential average strips the daily foraging wobble and leaves the honey-flow trend that actually matters week to week.' },
        { ref: 'bool broodLost', txt: 'Brood trouble shows up either as an outright low temperature or as the brood temperature collapsing toward ambient — the colony no longer regulating.' },
        { ref: 'if (broodLost && (swarmSig || stepDown))', txt: 'The signals are fused: a cold brood nest together with a swarm signature or a sudden weight drop is a confident call to drive out and open the hive.' },
      ],
    } },
    { h: 'Transmit and sleep', p: [
      'Send the compensated weight, trend, brood T/RH, acoustic ratio and verdict over LoRa, then deep-sleep. A read every 15–30 minutes captures the daily curve without draining the battery.',
    ] },
  ],

  code: [{
    file: 'beehive-health-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Beehive Health Monitor — ESP32, load cell, brood T/RH, mic, LoRa

   Weighs the hive (temperature-compensated), tracks brood
   thermoregulation, extracts acoustic band-energy features, fuses the
   three into a colony verdict, and reports over LoRa on solar power.
   ══════════════════════════════════════════════════════════════════ */

#include <HX711.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <driver/i2s.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define HX_DT     16
#define HX_SCK     4
#define OW_PIN    17
#define I2S_SD    33
#define I2S_WS    25
#define I2S_SCK   32
#define LORA_CS    5
#define LORA_RST  14
#define LORA_DIO0  2

#define SLEEP_S    1200          // 20 min between reads

HX711             scale;
Adafruit_SHT31    sht;
OneWire           ow(OW_PIN);
DallasTemperature ambient(&ow);
Preferences       prefs;

// Persisted state (survives deep sleep).
RTC_DATA_ATTR float trend = 0, trendPrev = 0, ratioBase = 0;
RTC_DATA_ATTR bool  primed = false;

float K_T, T_CAL, HX_SCALE;      // calibration constants from flash

/* ── I2S mic: capture a block, return band-energy ratio ──────── */
float acousticRatio() {
  i2s_config_t cfg = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 8000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = 0, .dma_buf_count = 4, .dma_buf_len = 256 };
  i2s_pin_config_t pins = { I2S_SCK, I2S_WS, I2S_PIN_NO_CHANGE, I2S_SD };
  i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pins);

  const int N = 1024; int32_t buf[256]; size_t br;
  double eLow = 0, eHigh = 0; int got = 0;
  // Crude band split via a one-pole high-pass to separate low/high energy.
  int32_t prev = 0; double hp = 0;
  while (got < N) {
    i2s_read(I2S_NUM_0, buf, sizeof buf, &br, 100);
    int n = br / 4;
    for (int i = 0; i < n && got < N; i++, got++) {
      double x = buf[i] >> 8;                 // 24-bit sample
      hp = 0.9 * (hp + x - prev); prev = x;    // high-pass
      eHigh += hp * hp;
      eLow  += (x - hp) * (x - hp);
    }
  }
  i2s_driver_uninstall(I2S_NUM_0);
  if (eLow < 1) return 0;
  return (float)(eHigh / eLow);
}

void transmit(float w, float broodT, float rh, float ambT,
              float ratio, const char *v) {
  LoRa.beginPacket();
  LoRa.printf("{\\"hive\\":1,\\"w\\":%.2f,\\"trend\\":%.2f,\\"broodT\\":%.1f,"
              "\\"rh\\":%.0f,\\"ambT\\":%.1f,\\"ratio\\":%.2f,\\"v\\":\\"%s\\"}",
              w, trend, broodT, rh, ambT, ratio, v);
  LoRa.endPacket();
}

const char* verdict(float broodT, float ambT, float ratio) {
  bool broodLost = (broodT < 32.0f) || (fabsf(broodT - ambT) < 3.0f);
  bool swarmSig  = ratioBase > 0 && ratio > 1.4f * ratioBase;
  bool stepDown  = (trendPrev - trend) > 1.0f;
  if (broodLost && (swarmSig || stepDown)) return "CRITICAL";
  if (broodLost) return "WARN_BROOD";
  if (swarmSig)  return "WATCH_SWARM";
  if (stepDown)  return "WATCH_WEIGHT";
  return "OK";
}

void loadCal() {
  prefs.begin("hive", true);
  K_T      = prefs.getFloat("kT", 0.0f);
  T_CAL    = prefs.getFloat("tcal", 25.0f);
  HX_SCALE = prefs.getFloat("hxs", 1.0f);
  prefs.end();
}

void setup() {
  Serial.begin(115200);
  loadCal();

  scale.begin(HX_DT, HX_SCK);
  scale.set_scale(HX_SCALE);
  Wire.begin(21, 22);
  sht.begin(0x44);
  ambient.begin();

  float raw    = scale.get_units(10);
  ambient.requestTemperatures();
  float ambT   = ambient.getTempCByIndex(0);
  float w      = raw - K_T * (ambT - T_CAL);   // temp-compensated weight
  float broodT = sht.readTemperature();
  float rh     = sht.readHumidity();
  float ratio  = acousticRatio();

  trendPrev = trend;
  trend += 0.02f * (w - trend);
  if (!primed) { trend = w; ratioBase = ratio; primed = true; }
  else if (ratioBase > 0) ratioBase += 0.05f * (ratio - ratioBase);

  const char *v = verdict(broodT, ambT, ratio);

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);
  transmit(w, broodT, rh, ambT, ratio, v);

  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_S * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'RTC_DATA_ATTR float trend', txt: 'The honey-flow trend and acoustic baseline live in RTC memory so they persist across deep sleep — the colony\'s multi-day story is not reset every 20 minutes.' },
      { ref: 'float acousticRatio()', txt: 'Captures a short I²S audio block and splits it into low- and high-frequency energy with a cheap one-pole filter, yielding a single ratio that tracks swarm/queenless acoustic shifts without a full FFT.' },
      { ref: 'float w = raw - K_T * (ambT - T_CAL)', txt: 'Applies the temperature compensation at the point of measurement, so every transmitted weight is already corrected for the day\'s heat.' },
      { ref: 'if (!primed)', txt: 'On the very first wake the trend and acoustic baseline are seeded from the current reading, so early cycles do not fire false alerts before the colony\'s normal is learned.' },
      { ref: 'const char *v = verdict(', txt: 'Fuses weight trend, brood thermoregulation and acoustics into a single word the beekeeper can act on, sent alongside the raw numbers.' },
    ],
  }],

  config: [
    'Set HX_SCALE and the tare from calibration with a known weight; set T_CAL to the temperature at tare and K_T from the observed day/night drift of the empty scale.',
    'Adjust the brood-temperature thresholds to your bee subspecies and climate; 34–35 °C is typical but local strains vary.',
    'Tune the acoustic ratio multiplier (default 1.4×) after watching a real colony, since band energy depends on mic placement.',
    'Choose the LoRa frequency legal in your region and the sampling interval (15–30 min captures the daily curve).',
  ],
  calibration: [
    { h: 'Weight', p: [
      'Tare empty, apply a known reference weight, and set HX_SCALE so the reading matches. Verify linearity with a second known weight.',
    ] },
    { h: 'Temperature drift', p: [
      'Leave the empty (or fixed-load) scale running through a full day and night; the swing in the reading against ambient gives K_T, the compensation coefficient.',
    ] },
    { h: 'Acoustic baseline', p: [
      'Record the band ratio over several days of a known-queenright colony to establish ratioBase before trusting swarm/queenless flags.',
    ] },
  ],
  testing: [
    { step: 'Add a known weight to the platform', expect: 'Reading increases by that weight within tolerance after compensation' },
    { step: 'Warm the load cell (e.g. sun/heat) with fixed load', expect: 'Compensated weight stays roughly constant; uncompensated would drift' },
    { step: 'Cool the brood probe below 32 °C', expect: 'Verdict flags brood cooling' },
    { step: 'Play a rising-frequency tone near the mic', expect: 'Acoustic ratio increases; swarm-watch can trigger above baseline' },
    { step: 'Range-test the LoRa link across the apiary', expect: 'Packets received at the base with usable RSSI' },
    { step: 'Run a solar day/night cycle', expect: 'Battery recovers by day; RTC-stored trend persists across sleeps' },
  ],
  output: [
    'The per-hive dashboard shows a weight curve (daily wobble on a rising or falling trend), brood temperature against ambient, the acoustic ratio, and the current verdict word.',
    { file: 'hive-packet.json', lang: 'json', body: `{
  "hive": 1,
  "w": 38.42,
  "trend": 37.9,
  "broodT": 34.8,
  "rh": 58,
  "ambT": 22.1,
  "ratio": 0.91,
  "v": "OK"
}` },
    'A healthy colony in a flow shows the trend climbing day over day with brood temperature pinned near 35 °C and a stable acoustic ratio; a "CRITICAL" verdict pairs a cold brood nest with a weight step-down or a rising acoustic ratio.',
  ],
  troubleshoot: [
    { sym: 'Weight wanders with the time of day', cause: 'Load-cell temperature drift not compensated', fix: 'Measure K_T from the empty-scale day/night swing and apply the compensation; keep the cell shaded' },
    { sym: 'Weight reading is noisy or jumps', cause: 'Long HX711 leads, uneven load, or a tilted hive', fix: 'Shorten and shield the leads; level the platform; average more samples per read' },
    { sym: 'Brood temperature reads oddly low', cause: 'Probe propolised over or displaced to the hive edge', fix: 'Use the vented cage; reposition the probe near the brood-nest centre' },
    { sym: 'Acoustic ratio is meaningless/erratic', cause: 'Mic hearing wind, or picking up enclosure vibration', fix: 'Shield the mic from wind; couple it to the hive body; average several captures' },
    { sym: 'Battery dies mid-season', cause: 'Sampling too often or audio capture too long', fix: 'Lengthen the interval; shorten the audio block; clean the solar panel' },
  ],

  iot: {
    protoShort: 'LoRa → apiary gateway → dashboard',
    net: {
      nodes: [{ name: 'Hive node', sub: 'ESP32 + LoRa' }, { name: 'Other hives', sub: 'same site' }],
      protocol: 'LoRa 433/868', gateway: 'Apiary gateway', gatewaySub: 'LoRa → MQTT',
      uplink: 'MQTT 1883', cloud: 'Broker + dashboard', cloudSub: 'per-hive season history',
      clients: [{ name: 'Dashboard', sub: 'hive grid' }, { name: 'Phone', sub: 'inspection alerts' }],
    },
    protocol: ['Compact JSON travels over LoRa (SF10) every 15–30 minutes. The weight trend and the fused verdict are the priority fields; raw audio is never transmitted — only the couple of band-energy features computed on-board — which keeps the packet tiny and the battery alive.'],
    topics: [
      { t: 'apiary/hive/1/data', dir: 'node → broker', payload: 'weight, trend, brood T/RH, ratio' },
      { t: 'apiary/hive/1/alert', dir: 'node → broker', payload: 'brood-cooling / weight / swarm' },
      { t: 'apiary/hive/1/status', dir: 'node → broker', payload: 'battery, RSSI, uptime' },
    ],
    cloud: ['The gateway publishes to MQTT; a dashboard keeps a per-hive history of weight, brood temperature and acoustic features across the whole season, turning many colonies into one comparable record.'],
    dashboard: ['A grid of hive tiles coloured by verdict, each expanding to its weight, temperature and acoustic history — the beekeeper\'s route-planning view of which colonies to visit first.'],
    mobile: ['Push alerts name the hive and the reason to open it: brood cooling, a sudden weight loss, or a rising swarm signature.'],
    security: [
      'A per-hive key and rolling counter stop a stray identical node from injecting false data into a neighbour\'s record.',
      'Authenticate the broker so only the beekeeper\'s dashboard reads the apiary data.',
      'Alert on a hive going silent so a dead node is not mistaken for a healthy, quiet colony.',
    ],
  },

  perf: [
    'Deep-sleep between reads; the HX711 settling and the audio capture dominate awake time, so keep both as short as accuracy allows.',
    'Transmit acoustic features, never raw audio — a few band energies instead of kilobytes of samples.',
    'Persist trend and baselines in RTC memory so the multi-day story survives sleep without re-learning.',
    'Average enough weight samples to beat load-cell noise, but no more; each extra sample is awake-time and battery.',
  ],
  safety: [
    'Wear appropriate protection when installing or servicing sensors; a monitored hive is still a defensive colony.',
    'Keep the lithium battery and charger in the sealed enclosure, away from moisture and hive debris.',
    'The monitor guides inspections; it does not replace the beekeeper\'s judgement or routine disease checks (e.g. for mites).',
    'Secure cables so bees cannot be trapped and the colony cannot propolise the electronics into a heat trap.',
  ],
  maintenance: [
    'Re-tare and spot-check the scale against a known weight periodically; load cells drift over a season.',
    'Free the brood probe of propolis and confirm it still sits in the brood nest.',
    'Clean the solar panel and check the mic\'s acoustic path is not blocked by wax or debris.',
    'Re-learn the acoustic baseline after re-queening or moving the hive, since the colony\'s normal changes.',
  ],
  future: [
    'Add a bee-counter at the entrance to correlate forager traffic with the weight rhythm.',
    'Run a small on-device classifier on the audio features for queenless/pre-swarm detection instead of thresholds.',
    'Add a Varroa-drop tray sensor to fold mite load into the health verdict.',
    'Aggregate many hives\' weight trends into a live nectar-flow map for a region.',
  ],
  faq: [
    { q: 'Can it really tell me the queen is failing without opening the hive?', a: 'Not with certainty, but a colony that stops holding its brood nest near 35 °C has usually lost the queen or the population to keep brood warm. Combined with weight and sound, it is a strong, early flag to inspect.' },
    { q: 'Why weigh the hive at all?', a: 'Weight is the single richest signal: its daily wobble shows foraging, its slow trend is the honey flow, and a sudden step down can mean a swarm or robbing. It is the backbone of remote hive monitoring.' },
    { q: 'Do you transmit recordings of the bees?', a: 'No. The device computes a couple of band-energy features on-board and sends only those numbers — cheap over LoRa and privacy-free.' },
    { q: 'Why does the weight need temperature compensation?', a: 'Load cells drift with temperature. Without correction, the sun warming the scale each afternoon would look like the colony gaining and losing a kilo every day.' },
    { q: 'How long does it run in the field?', a: 'A small solar panel and one 18650 cover a season, because the device sleeps between reads and never transmits raw audio.' },
  ],
  refs: [
    { t: 'Honeybee brood-nest thermoregulation — research overview', u: 'https://en.wikipedia.org/wiki/Thermoregulation_in_beehives', s: 'Reference' },
    { t: 'HX711 24-bit ADC for load cells (datasheet)', u: 'https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf', s: 'Avia Semiconductor' },
    { t: 'INMP441 I²S MEMS microphone (datasheet)', u: 'https://invensense.tdk.com/products/digital/inmp441/', s: 'TDK InvenSense' },
    { t: 'Acoustic monitoring of honeybee colonies — literature', u: 'https://en.wikipedia.org/wiki/Beehive', s: 'Reference' },
    { t: 'Precision beekeeping / hive scales — overview', u: 'https://en.wikipedia.org/wiki/Precision_beekeeping', s: 'Reference' },
  ],
  images: ['solar', 'esp32', 'lora'],
  imageCaptions: [
    'A solar panel and battery let the hive monitor run a full season in a remote apiary with no mains power.',
    'ESP32 module — reads the hive scale, brood sensors and microphone, fuses them, and drives the LoRa link.',
    'A LoRa radio carries each hive\'s weight, temperature and acoustic verdict back to the beekeeper across the field.',
  ],
},

];
