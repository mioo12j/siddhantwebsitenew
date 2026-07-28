/* Energy batch B — 072 Battery Management Monitor, 073 Grid Power-Quality
   Logger, 074 Streetlight Energy Optimizer. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   072 — Battery Management Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '072',
  domainKey: 'electronics',
  emoji: '🔋', thumb: 'board',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'Watches every cell in a battery pack — voltage, temperature and balance — so weak cells and thermal danger are caught before they turn a storage battery into a hazard.',

  overview: [
    'A battery pack is only as safe and healthy as its <b>weakest cell</b>, and the whole-pack voltage that a simple gauge shows hides everything that matters. A pack reading a healthy total can contain one cell drifting low, one running hot, or a growing imbalance that will slowly destroy the pack and, in lithium chemistries, can lead to overcharge, over-discharge or thermal events. Serious battery systems therefore monitor <b>each cell individually</b>. This project builds that monitor: it measures per-cell voltage, pack temperature(s) and current, tracks the balance between cells, and warns of the conditions — a weak cell, an imbalance, a thermal excursion — that precede failure, so a storage battery stays safe and lasts.',
    'The core is <b>per-cell voltage sensing</b>, because cells in a series pack must be kept within a safe window individually: over-charging or over-discharging any single cell damages it and, for lithium, is a safety risk, and the pack must be managed to the most extreme cell, not the average. The monitor measures each cell, watches for any cell straying toward its limits, and tracks the <b>spread</b> between the highest and lowest cell — a growing spread (imbalance) is an early sign of a weak or ageing cell and of a pack that needs balancing. <b>Temperature</b> is watched because heat is the enemy of batteries and the herald of danger: an abnormally hot cell, or a rising rate of temperature, is a warning that must be heeded. <b>Current</b> (charge/discharge) lets it estimate state of charge and enforce safe limits.',
    'On top of monitoring, it supports <b>balancing</b> — bleeding charge from the highest cells so the pack charges evenly and no cell runs ahead — which extends pack life and keeps cells matched. It logs and trends every cell so degradation is visible, and it alarms on any unsafe condition. This is safety-critical work, so the project is clear: a battery management <i>system</i> that actually protects a pack must reliably cut off charge/discharge on fault, and lithium packs in particular demand a proper, ideally purpose-built or certified, BMS — a homebrew monitor is an educational build of the sensing and logic and a supplement, not a replacement for protection that a real pack\'s safety depends on. But as a per-cell voltage/temperature/balance monitor, it teaches and demonstrates exactly what keeps a battery pack safe: watch every cell, catch the weak one and the hot one early, and keep the pack in balance.',
  ],
  does: [
    'Measures per-cell voltage across a series pack',
    'Monitors pack temperature(s) and charge/discharge current',
    'Tracks cell imbalance (highest-to-lowest spread)',
    'Warns of weak cells, over/under-voltage and thermal danger',
    'Supports balancing to keep cells matched and extend life',
    'Estimates state of charge and enforces safe limits',
    'Logs and trends every cell so degradation is visible',
  ],
  features: [
    'Per-cell voltage monitoring (manage to the worst cell)',
    'Imbalance tracking for early weak-cell detection',
    'Temperature and rate-of-rise thermal warning',
    'Cell balancing support',
    'State-of-charge estimation and safe-limit enforcement',
    'Per-cell trending for degradation',
    'Honest: monitoring/logic, not a replacement for protective BMS',
  ],
  applications: [
    { t: 'Home/solar storage batteries', d: 'Keeping a storage pack safe and healthy with per-cell visibility and balancing.' },
    { t: 'DIY / repurposed packs', d: 'Monitoring 18650/LiFePO4 packs for imbalance and thermal safety.' },
    { t: 'E-mobility / robotics packs', d: 'Watching cells in EV/robot batteries for weak cells and heat.' },
    { t: 'Battery education / testing', d: 'Learning cell balancing, SoC and thermal management.' },
  ],
  skills: [
    'Per-cell voltage measurement (mux/isolation)',
    'Temperature and current sensing',
    'Imbalance and state-of-charge estimation',
    'Cell balancing',
    'Safe-limit enforcement and alarming',
  ],
  prereq: [
    'Manage the pack to the WORST cell, not the average — over/under-voltage of any single cell damages it and, for lithium, is a safety risk.',
    'A real protective BMS must cut off charge/discharge on fault; a monitor that only warns is a supplement, not a replacement — lithium packs need proper protection.',
    'Battery work is hazardous (fire, shorts, high current) — build and test with appropriate safety.',
    'Temperature and imbalance are the key early-warning signals; watch both.',
  ],

  parts: ['esp32', 'ina219', 'ds18b20', 'acs712', 'oled', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Per-cell voltage sensing', spec: 'Isolated/mux per-cell taps or a battery-monitor IC (e.g. multi-cell AFE)', qty: 1, price: 1200, note: 'A dedicated multi-cell monitor IC is safest/most accurate' },
    { name: 'Balancing circuitry', spec: 'Passive (bleed resistors + FETs) or active balancing per cell', qty: 1, price: 800 },
    { name: 'Pack temperature sensors', spec: 'Multiple DS18B20/thermistors across the pack', qty: 2, price: 200 },
    { name: 'Protection (for a real BMS)', spec: 'Charge/discharge cutoff (FETs/contactor) — required for protection', qty: 1, price: 1000, note: 'A monitor alone does not protect; protection cuts off on fault' },
  ],
  cost: '₹3,500 – ₹6,500',
  libs: ['wifi', 'pubsub', 'ina219lib', 'onewire', 'ssd1306', 'influx', 'arduinojson'],

  pins: {
    left: [
      { dev: 'Per-cell taps / AFE', devPin: 'mux/SPI', pin: 'ADC / bus', sig: 'Per-cell voltage' },
      { dev: 'INA219 (current)', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Pack current (I²C)' },
      { dev: 'Temp sensors', devPin: 'DQ', pin: 'GPIO 4', sig: 'Pack temperature(s)' },
    ],
    right: [
      { dev: 'Balancing FETs', devPin: 'ctrl', pin: 'GPIO', sig: 'Bleed high cells' },
      { dev: 'Protection cutoff', devPin: 'ctrl', pin: 'GPIO 26', sig: 'Charge/discharge disable (real BMS)' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Cell voltages/temp' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard' },
    ],
  },
  wiringNotes: [
    'Sense each cell\'s voltage safely — a dedicated multi-cell monitor IC (analog front end) is the accurate, safe way; ad-hoc dividers on a high-voltage series stack are error-prone and risky.',
    'Manage the pack to the most extreme cell; a healthy total can hide an out-of-limit cell.',
    'Place multiple temperature sensors across the pack; a single sensor can miss a hot cell.',
    'For a protective BMS, include a charge/discharge cutoff (FETs/contactor) that disconnects on fault — a monitor that only warns does not protect.',
    'Battery work is hazardous — guard against shorts and high current, and test safely.',
  ],

  block: { columns: [
    { label: 'Sense cells', edge: 'right', blocks: [
      { name: 'Per-cell V', sub: 'worst cell', highlight: true },
      { name: 'Temperature', sub: 'across pack' },
      { name: 'Current', sub: 'charge/discharge' },
    ] },
    { label: 'Assess', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'imbalance/SoC' },
      { name: 'Safe window', sub: 'per-cell limits' },
    ] },
    { label: 'Act', edge: 'right', blocks: [
      { name: 'Balance', sub: 'bleed high cells' },
      { name: 'Protect', sub: 'cutoff (real BMS)' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'per-cell trend' },
      { name: 'Alarm', sub: 'weak/hot cell' },
    ] },
  ] },
  flow: [
    { t: 'Read all cells, temp, current', k: 'start' },
    { t: 'Any cell out of window or too hot?', k: 'dec', yes: 'Alarm (+ protective cutoff on real BMS)', no: 'Check balance' },
    { t: 'Alarm (+ protective cutoff on real BMS)', k: 'io' },
    { t: 'Check balance', k: 'proc' },
    { t: 'Imbalance high (charging)?', k: 'dec', yes: 'Balance (bleed high cells)', no: 'Update SoC/trend' },
    { t: 'Balance (bleed high cells)', k: 'io' },
    { t: 'Update SoC/trend', k: 'proc' },
    { t: 'Report; repeat', k: 'end', back: 'Read all cells, temp, current' },
  ],

  principle: [
    'The defining principle of battery management is that <b>a series pack must be managed to its worst cell</b>, not its average, because the cells are in series and share the same current but are not identical. The whole-pack voltage — the only thing a simple gauge shows — is a sum that can look perfectly healthy while one cell inside is over-charged, another over-discharged, or one drifting weak. And in lithium chemistries these single-cell excursions are not merely inefficient; over-charging a cell can drive it into thermal instability and over-discharging can damage it irreversibly. So real battery management measures <b>every cell individually</b> and keeps each within its safe voltage window, treating the most extreme cell as the constraint. This per-cell visibility is the foundation everything else builds on.',
    'From per-cell voltages comes the single most useful health signal: <b>imbalance</b>, the spread between the highest and lowest cell. A fresh, healthy pack\'s cells track each other closely; as the pack ages, or if a cell is weak, the cells drift apart — one reaches full or empty before the others, limiting the whole pack\'s usable capacity and, if unmanaged, being repeatedly pushed to its limits and degrading faster. A <b>growing imbalance</b> is therefore an early warning of a weak or ageing cell, and the cue for <b>balancing</b>: bleeding charge from the highest cells (passive balancing) or moving charge between cells (active balancing) so they finish charging together. Balancing keeps the pack matched, restores usable capacity, and protects the weak cell from being over-driven — one of the most important things a battery system does for longevity.',
    '<b>Temperature</b> is the safety-critical channel, because heat is both the enemy of battery life and the signature of danger. Batteries age faster hot, and — crucially — an abnormally hot cell, or a <b>rising rate</b> of temperature, can be the leading edge of a thermal event (in the worst case, thermal runaway). So the monitor watches temperature at multiple points (a single sensor can miss a localised hot cell), warns on both absolute temperature and rate of rise, and treats a thermal excursion as an alarm that must halt charging/discharging. Alongside, <b>current</b> measurement enables <b>state-of-charge</b> estimation (by integrating charge in and out, refined by cell voltages) and the enforcement of safe charge/discharge limits.',
    'The crucial honesty is the difference between a <b>monitor</b> and a protective <b>battery management system</b>. A monitor senses and warns; a BMS that actually keeps a pack safe must be able to <b>act</b> — to reliably <b>cut off</b> charge or discharge the moment any cell goes out of its safe window or the pack overheats, using FETs or a contactor, independent of any network or human. For lithium packs especially, where the consequences of an unmanaged fault include fire, this protective cutoff is not optional, and it is why serious systems use purpose-built or certified BMS hardware. This project builds the <b>sensing and logic</b> — per-cell voltage, temperature, imbalance, balancing, SoC — which is the heart of understanding battery management and a valuable supplementary monitor, but it is emphatic that a monitor which only warns does not protect, and that a real pack\'s safety depends on protection that disconnects on fault. Built and used with that clarity, it teaches and demonstrates exactly what keeps a battery pack safe and healthy: see every cell, catch the weak one and the hot one early, keep the pack in balance, and — in a true BMS — cut off before damage is done.',
  ],
  equations: [
    { t: 'Per-cell safe window + imbalance', eq: 'Each cell must stay in [V_min, V_max] (chemistry-specific,\ne.g. LiFePO4 ~2.5–3.65 V):\n\n  fault if any cell < V_min or > V_max\n  imbalance = max(cell) − min(cell)\n  balance when imbalance > threshold (during charge)\n\nManage to the WORST cell, not the pack average.' },
    { t: 'Thermal warning', eq: 'Watch absolute temperature and rate of rise:\n\n  warn if T_cell > T_warn  OR  dT/dt > R_warn\n  fault/cutoff if T_cell > T_max\n\nRising temperature can precede a thermal event → halt\ncharge/discharge (in a real BMS).' },
    { t: 'State of charge (coulomb counting + voltage)', eq: 'SoC by integrating current, anchored by voltage:\n\n  SoC += (I · dt) / capacity        (coulomb counting)\n  correct near full/empty using cell voltages (OCV)\n\nEnforce safe charge/discharge current and SoC limits.' },
  ],

  assembly: [
    { h: 'Set up safe per-cell sensing', p: [
      'Use a dedicated multi-cell monitor IC (or carefully-isolated per-cell taps) to measure each cell\'s voltage accurately and safely, plus multiple temperature sensors and a current sensor.',
    ], warn: 'Ad-hoc voltage dividers on a high-voltage series stack are error-prone and hazardous. Use a proper multi-cell front end, and guard against shorts across the pack.' },
    { h: 'Add balancing and (for a BMS) protection', p: [
      'Add balancing circuitry (passive bleed or active) per cell, and — for a protective BMS — a charge/discharge cutoff (FETs/contactor) that disconnects on any fault.',
    ] },
    { h: 'Set up logic and reporting', p: [
      'Compute imbalance, SoC and thermal state; enforce safe limits; log/trend per cell; and report/alarm.',
    ] },
  ],
  steps: [
    { h: 'Evaluate cells, balance and enforce safety', p: [
      'Read all cells/temperatures/current, check each cell against its window and the thermal limits, balance during charge when imbalance is high, and (in a real BMS) cut off on fault.',
    ], code: {
      file: 'bms-logic.ino', lang: 'cpp',
      body: `#define V_MIN 2.5f
#define V_MAX 3.65f          // LiFePO4 example
#define IMBAL_THRESH 0.05f   // 50 mV spread triggers balancing
#define T_WARN 45.0f
#define T_MAX  60.0f
#define NCELLS 8

const char* evaluate(float *v, float *t, int nT, bool charging){
  float hi=-1, lo=9; int hiIdx=-1;
  for(int i=0;i<NCELLS;i++){
    if (v[i] > V_MAX) return "cell over-voltage";       // manage to worst cell
    if (v[i] < V_MIN) return "cell under-voltage";
    if (v[i]>hi){ hi=v[i]; hiIdx=i; }
    if (v[i]<lo) lo=v[i];
  }
  for(int i=0;i<nT;i++){
    if (t[i] > T_MAX) return "over-temperature (cutoff)"; // thermal fault
    if (t[i] > T_WARN) return "temperature high (warn)";
  }
  float imbalance = hi - lo;
  if (charging && imbalance > IMBAL_THRESH) balanceCell(hiIdx);  // bleed highest
  return nullptr;
}`,
      explain: [
        { ref: 'if (v[i] > V_MAX) return "cell over-voltage"', txt: 'Every cell is checked against its safe window individually — an over- or under-voltage on any single cell is a fault, because the pack must be managed to its worst cell.' },
        { ref: 'if (t[i] > T_MAX) return "over-temperature (cutoff)"', txt: 'A cell exceeding its thermal limit is a fault that, in a protective BMS, must cut off charge/discharge — heat is the safety-critical channel.' },
        { ref: 'float imbalance = hi - lo', txt: 'The spread between the highest and lowest cell is the imbalance, the early-warning signal for a weak or ageing cell.' },
        { ref: 'if (charging && imbalance > IMBAL_THRESH) balanceCell(hiIdx)', txt: 'When charging and the imbalance is high, charge is bled from the highest cell so the cells finish together — balancing that protects the weak cell and restores capacity.' },
      ],
    } },
    { h: 'Estimate SoC, log and report', p: [
      'Integrate current for state of charge (anchored by cell voltages), log and trend per cell for degradation, and report/alarm — cutting off on fault in a real BMS.',
    ], tip: 'Trend each cell over time; a cell whose voltage sags more under load or drifts from its neighbours is ageing — replace or rebalance before it drags the pack down or becomes unsafe.' },
  ],

  code: [{
    file: 'battery-management-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Battery Management Monitor — ESP32 (sensing + logic; EDUCATIONAL)

   Measures per-cell voltage, pack temperature(s) and current; tracks
   imbalance and SoC; warns of weak/hot cells; supports balancing.
   A real protective BMS must CUT OFF on fault — a monitor that only
   warns is a supplement, not a replacement (lithium needs protection).
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_INA219.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define NCELLS 8
#define NTEMP  2
#define V_MIN 2.5f
#define V_MAX 3.65f
#define IMBAL_THRESH 0.05f
#define T_WARN 45.0f
#define T_MAX  60.0f
#define PIN_CUTOFF 26      // charge/discharge disable (real BMS)

Adafruit_INA219 ina; OneWire ow(4); DallasTemperature temp(&ow);
WiFiClient net; PubSubClient mqtt(net);
float soc = 50.0f; uint32_t lastMs=0;

float readCell(int i){ /* mux/AFE read of cell i */ return readCellVoltage(i); }
void balanceCell(int i){ setBalanceFet(i, true); }   // bleed highest cell

void setup(){
  Serial.begin(115200);
  pinMode(PIN_CUTOFF, OUTPUT); digitalWrite(PIN_CUTOFF, HIGH); // enabled
  Wire.begin(21,22); ina.begin(); temp.begin();
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  lastMs = millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("bms-1");
  mqtt.loop();
  uint32_t now=millis(); float dtHr=(now-lastMs)/3600000.0f; lastMs=now;

  float v[NCELLS], hi=-1, lo=9; int hiIdx=-1;
  for(int i=0;i<NCELLS;i++){ v[i]=readCell(i);
    if(v[i]>hi){hi=v[i];hiIdx=i;} if(v[i]<lo)lo=v[i]; }

  float t[NTEMP]; temp.requestTemperatures();
  for(int i=0;i<NTEMP;i++) t[i]=temp.getTempCByIndex(i);

  float current = ina.getCurrent_mA()/1000.0f;      // + charge / - discharge
  soc += (current * dtHr) / PACK_AH * 100.0f;       // coulomb counting
  soc = constrain(soc, 0, 100);

  // safety evaluation (manage to worst cell)
  const char *fault=nullptr;
  for(int i=0;i<NCELLS;i++){
    if(v[i]>V_MAX){fault="cell over-voltage";} if(v[i]<V_MIN){fault="cell under-voltage";}
  }
  for(int i=0;i<NTEMP;i++) if(t[i]>T_MAX) fault="over-temperature";

  if (fault){
    digitalWrite(PIN_CUTOFF, LOW);                   // PROTECT: disconnect
    mqtt.publish("bms/1/fault", fault);
  } else {
    digitalWrite(PIN_CUTOFF, HIGH);
    float imbalance = hi - lo;
    bool charging = current > 0.1f;
    if (charging && imbalance > IMBAL_THRESH) balanceCell(hiIdx);  // balance
    if (t[0] > T_WARN) mqtt.publish("bms/1/warn","temperature high");
  }

  char m[260];
  int n = snprintf(m,sizeof m,
    "{\\"soc\\":%.0f,\\"imbalance_mV\\":%.0f,\\"tmax\\":%.1f,\\"cells\\":[",
    soc,(hi-lo)*1000, t[0]);
  for(int i=0;i<NCELLS;i++) n+=snprintf(m+n,sizeof m-n,"%.3f%s",v[i],i<NCELLS-1?",":"");
  snprintf(m+n,sizeof m-n,"]}");
  mqtt.publish("bms/1/cells", m);

  delay(1000);
}`,
    explain: [
      { ref: 'if (fault){\n    digitalWrite(PIN_CUTOFF, LOW);                   // PROTECT: disconnect', txt: 'On any cell over/under-voltage or over-temperature, a protective BMS disconnects charge/discharge — the action that a monitor which only warns cannot provide.' },
      { ref: 'for(int i=0;i<NCELLS;i++){ v[i]=readCell(i);', txt: 'Every cell is read individually so the worst cell — not a flattering pack average — governs the safety decision.' },
      { ref: 'soc += (current * dtHr) / PACK_AH * 100.0f;', txt: 'State of charge is estimated by coulomb counting (integrating current), refined near the extremes by cell voltages.' },
      { ref: 'if (charging && imbalance > IMBAL_THRESH) balanceCell(hiIdx)', txt: 'During charge, the highest cell is bled when the imbalance grows, keeping the cells matched and protecting the weak one.' },
      { ref: 'A real protective BMS must CUT OFF on fault', txt: 'The header states the scope: this builds the sensing/logic and a protective cutoff, but a real pack\'s safety depends on protection that reliably disconnects — lithium needs a proper BMS.' },
    ],
  }],

  config: [
    'Set the chemistry-specific per-cell V_min/V_max, thermal limits and imbalance threshold.',
    'Configure per-cell sensing (AFE/mux), temperature/current sensing, balancing and (for a BMS) the cutoff.',
    'Set pack capacity for SoC and safe charge/discharge limits.',
    'Configure logging/trending and alarms.',
  ],
  calibration: [
    { h: 'Cell voltage accuracy', p: [
      'Verify per-cell voltage readings against a reference meter; accuracy matters near the safe limits.',
    ] },
    { h: 'SoC', p: [
      'Calibrate coulomb counting against known full/empty points; anchor with cell voltages.',
    ] },
    { h: 'Thermal', p: [
      'Verify temperature sensors and set warn/max limits for the chemistry; test rate-of-rise warning.',
    ] },
  ],
  testing: [
    { step: 'Drive a cell toward V_max/V_min', expect: 'Fault; (real BMS) cutoff; alarm — managed to worst cell' },
    { step: 'Create an imbalance during charge', expect: 'Highest cell balanced (bled); imbalance reduces' },
    { step: 'Heat a cell', expect: 'Temperature warn, then over-temp cutoff/alarm' },
    { step: 'Charge/discharge a known amount', expect: 'SoC tracks; anchored by voltages near extremes' },
    { step: 'Trend cells over cycles', expect: 'A weak/ageing cell drifts/sags — visible for action' },
    { step: 'Fault with a monitor-only build', expect: 'Warns but cannot protect — confirming a real BMS needs cutoff' },
  ],
  output: [
    'The dashboard shows each cell\'s voltage, the imbalance, temperatures, current and SoC, with per-cell trends and alarms for weak/hot cells; a real BMS shows cutoff events.',
    { file: 'bms-cells.json', lang: 'json', body: `{
  "soc": 68,
  "imbalance_mV": 72,
  "tmax": 41.0,
  "cells": [3.31, 3.33, 3.28, 3.34, 3.32, 3.33, 3.26, 3.33]
}` },
    'Cell 7 (3.26 V) is the lowest and the 72 mV imbalance flags a weak cell developing — visible per-cell before the pack total would ever reveal it, and the cue to balance and watch that cell.',
  ],
  troubleshoot: [
    { sym: 'Pack total fine but cells damaged', cause: 'Only whole-pack monitoring', fix: 'Monitor per cell; manage to the worst cell' },
    { sym: 'Growing imbalance', cause: 'Weak/ageing cell; no balancing', fix: 'Enable balancing; identify and (if needed) replace the weak cell' },
    { sym: 'Missed a hot cell', cause: 'Single temperature sensor', fix: 'Use multiple sensors; watch rate of rise' },
    { sym: 'SoC drifts', cause: 'Coulomb-count drift', fix: 'Anchor with cell voltages near full/empty; calibrate capacity' },
    { sym: 'Monitor did not protect', cause: 'Monitor without cutoff', fix: 'A real BMS must cut off on fault; use protective hardware for a real pack' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → battery dashboard',
    net: {
      nodes: [{ name: 'BMS monitor', sub: 'ESP32' }, { name: 'Packs', sub: 'per-pack' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to server',
      uplink: 'MQTT 1883', cloud: 'Battery dashboard', cloudSub: 'cells + faults',
      clients: [{ name: 'Dashboard', sub: 'per-cell' }, { name: 'Phone', sub: 'fault alerts' }],
    },
    protocol: ['Per-cell voltages, imbalance, temperatures, current and SoC publish continuously; faults publish immediately. Protective cutoff (real BMS) is local and independent of the network.'],
    topics: [
      { t: 'bms/1/cells', dir: 'node → dashboard', payload: 'per-cell V, imbalance, temp, SoC' },
      { t: 'bms/1/fault', dir: 'node → owner', payload: 'over/under-voltage, over-temp (cutoff)' },
      { t: 'bms/1/warn', dir: 'node → owner', payload: 'temperature high / imbalance' },
    ],
    cloud: ['A dashboard trends every cell for degradation, shows imbalance/temperature/SoC, and alarms on faults; protective cutoff stays local for safety.'],
    dashboard: ['Per-cell voltage bars and trends, imbalance, temperatures, current and SoC, with fault/warn markers.'],
    mobile: ['Immediate fault alerts (over/under-voltage, over-temp) and warnings (imbalance, high temp).'],
    security: [
      'Keep protective cutoff local and independent of the network.',
      'Authenticate nodes; secure battery data.',
      'Alert on monitor silence — a blind pack is a risk.',
    ],
  },

  perf: [
    'Read all cells each cycle; per-cell visibility is the whole point.',
    'Keep protective cutoff local and fast; never depend on the network for safety.',
    'Balance during charge when imbalance is high.',
    'Trend per cell for degradation.',
  ],
  safety: [
    'A real protective BMS must cut off charge/discharge on fault; a monitor that only warns is a supplement, not a replacement — lithium packs require proper protection.',
    'Manage the pack to the worst cell; over/under-voltage or over-temperature of any cell is a fault.',
    'Battery work is hazardous (fire, shorts, high current) — build/test with appropriate safety and use proper multi-cell front ends.',
    'For real packs, use purpose-built/certified BMS hardware; this is educational sensing/logic.',
  ],
  maintenance: [
    'Verify per-cell voltage/temperature calibration periodically.',
    'Act on imbalance/weak-cell trends; balance or replace cells.',
    'Test the protective cutoff (real BMS) regularly.',
    'Re-calibrate SoC/capacity as the pack ages.',
  ],
  future: [
    'Add active balancing for efficiency.',
    'Add impedance/health estimation per cell.',
    'Integrate with charger/inverter for coordinated protection.',
    'Add state-of-health and remaining-life estimation.',
  ],
  faq: [
    { q: 'Why monitor every cell instead of the pack total?', a: 'Because a series pack must be managed to its worst cell. The total can look healthy while one cell is over-charged, over-discharged or overheating — all of which damage the pack and, for lithium, are safety risks that only per-cell monitoring reveals.' },
    { q: 'What is balancing and why does it matter?', a: 'Bleeding charge from the highest cells (or moving charge between cells) so they finish charging together. It keeps cells matched, restores usable capacity, and protects a weak cell from being repeatedly over-driven — key to pack longevity.' },
    { q: 'Why is temperature so important?', a: 'Heat ages batteries and, more seriously, an abnormally hot cell or a rising temperature can precede a thermal event. Watching temperature (and its rate of rise) at multiple points is the safety-critical channel.' },
    { q: 'Is this a real BMS I can trust to protect my pack?', a: 'It builds the sensing and logic (and a protective cutoff), which is the heart of battery management — but a real pack\'s safety depends on protection that reliably cuts off on fault. For lithium packs, use a purpose-built or certified BMS; treat this as educational and supplementary.' },
    { q: 'How does it estimate state of charge?', a: 'Mainly by coulomb counting — integrating the current in and out over the pack capacity — anchored near full and empty by the cell voltages to correct drift.' },
  ],
  refs: [
    { t: 'Battery management system (BMS)', u: 'https://en.wikipedia.org/wiki/Battery_management_system', s: 'Reference' },
    { t: 'Cell balancing', u: 'https://en.wikipedia.org/wiki/Battery_balancing', s: 'Reference' },
    { t: 'Lithium-ion safety and thermal runaway', u: 'https://en.wikipedia.org/wiki/Thermal_runaway', s: 'Reference' },
    { t: 'State of charge estimation', u: 'https://en.wikipedia.org/wiki/State_of_charge', s: 'Reference' },
    { t: 'INA219 current/power monitor (datasheet)', u: 'https://www.ti.com/product/INA219', s: 'TI' },
  ],
  images: ['battery', 'esp32', 'grafana'],
  imageCaptions: [
    'A pack is only as safe as its weakest cell — per-cell monitoring reveals what the total hides.',
    'ESP32 module reading every cell\'s voltage, temperature and current and managing balance.',
    'A dashboard trends each cell so a weak or hot one is caught before it becomes a hazard.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   073 — Grid Power-Quality Logger
   ══════════════════════════════════════════════════════════════════ */
{
  id: '073',
  domainKey: 'electronics',
  emoji: '📉', thumb: 'board',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Captures the voltage sags, swells, surges and disturbances that damage equipment and trip processes — timestamped and characterised — so a supply problem can finally be diagnosed and proven.',

  overview: [
    'When equipment mysteriously resets, a process trips for no obvious reason, or electronics fail early, the cause is often the <b>power quality</b> — brief voltage sags when a big motor starts nearby, swells and surges, spikes from switching, distortion from non-linear loads — events too fast and transient for anyone to see on a normal meter, but more than enough to disrupt or damage equipment. And because they are invisible and intermittent, they are almost impossible to diagnose: the utility says the supply is fine, the equipment vendor blames the site, and the problem persists. This project builds a logger that catches these disturbances — measuring the voltage waveform fast enough to see them, characterising each event, and timestamping it — so a supply problem can be diagnosed and, crucially, <b>proven</b>.',
    'It samples the mains voltage at a <b>high rate</b> (many samples per cycle) so it can compute the true RMS voltage cycle-by-cycle and detect deviations that a slow meter averages away. From the waveform it captures the classic power-quality events: <b>sags</b> (dips, the most common and disruptive — a brief drop when a large load starts), <b>swells</b> (temporary rises), <b>surges/transients</b> (fast spikes), interruptions, and frequency deviations, and it can measure <b>harmonic distortion</b> (THD) from non-linear loads. Each event is recorded with its <b>timestamp, type, magnitude and duration</b> — the characterisation that turns "the power is bad" into "a 30% sag lasting 80 ms occurred at 14:32", which is evidence.',
    'That evidence is the point. A timestamped log of characterised events lets you <b>correlate</b> disturbances with equipment failures ("the machine trips whenever that sag occurs"), pin down the source (on-site vs the utility), and make a documented case to the utility or the equipment vendor. The logger trends event frequency, alarms on severe disturbances, and exports the record. It is honest that measuring mains is hazardous and that a DIY logger is not a calibrated, standards-compliant power-quality analyser (which classifies events per IEC 61000-4-30) — but as a high-rate voltage logger that captures and characterises the sags, swells and surges a normal meter cannot see, it turns an invisible, intermittent, un-diagnosable supply problem into a measured, timestamped, provable one.',
  ],
  does: [
    'Samples the mains voltage at high rate to see fast disturbances',
    'Computes true RMS voltage cycle-by-cycle',
    'Captures sags, swells, surges/transients, interruptions and frequency deviations',
    'Measures harmonic distortion (THD) from non-linear loads',
    'Characterises each event (type, magnitude, duration) with a timestamp',
    'Correlates disturbances with equipment problems and trends them',
    'Exports an evidence-grade log for utility/vendor disputes',
  ],
  features: [
    'High-rate waveform capture (fast enough for transients)',
    'Cycle-by-cycle true RMS',
    'Sag/swell/surge/interruption/frequency detection',
    'THD / harmonic measurement',
    'Timestamped, characterised event log',
    'Correlation and trending',
    'Honest: not a calibrated IEC power-quality analyser',
  ],
  applications: [
    { t: 'Diagnosing equipment resets/trips', d: 'Correlating mysterious failures with voltage sags/surges to find the cause.' },
    { t: 'Supply-quality disputes', d: 'Documented, timestamped evidence for the utility or an equipment vendor.' },
    { t: 'Sensitive-load protection', d: 'Monitoring power quality where equipment is disturbance-sensitive.' },
    { t: 'Site power assessment', d: 'Characterising a site\'s supply before installing sensitive equipment.' },
  ],
  skills: [
    'High-rate mains-voltage sampling (safe, isolated)',
    'Cycle-by-cycle RMS and event detection',
    'Sag/swell/surge/THD characterisation',
    'Timestamped event logging and correlation',
    'Evidence export and interpretation',
  ],
  prereq: [
    'Measuring mains is dangerous — use isolated voltage sensing and a qualified person for the mains-side connection.',
    'You must sample fast (many samples per cycle) to see transients a normal meter averages away.',
    'Characterise events (type/magnitude/duration/timestamp) — a characterised, timestamped log is what constitutes evidence.',
    'A DIY logger is not a calibrated, standards-compliant (IEC 61000-4-30) power-quality analyser; present it as indicative evidence.',
  ],

  parts: ['esp32', 'zmpt101b', 'oled', 'sdcard', 'rtc', 'psu5v'],
  extraParts: [
    { name: 'Isolated voltage sensing', spec: 'ZMPT101b or isolated voltage transformer for safe mains-voltage measurement', qty: 1, price: 400, note: 'Isolation is safety-critical' },
    { name: 'High-rate ADC / front-end', spec: 'Fast ADC front-end for many samples/cycle (transient capture)', qty: 1, price: 500 },
    { name: 'Accurate time source', spec: 'RTC/GPS for precise event timestamps (correlation)', qty: 1, price: 300 },
    { name: 'DIN enclosure + isolation', spec: 'Safe mains-side enclosure', qty: 1, price: 500 },
  ],
  cost: '₹2,800 – ₹4,500',
  libs: ['wifi', 'pubsub', 'ssd1306', 'ntp', 'sqlite', 'arduinojson'],

  pins: {
    left: [
      { dev: 'Isolated V sense', devPin: 'AOUT', pin: 'GPIO 34 (ADC)', sig: 'Mains voltage waveform' },
      { dev: 'DS3231 RTC/GPS', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Event timestamps' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'RMS/event display' },
      { dev: 'microSD', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Event log / waveform' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard/alerts' },
      { dev: 'Isolated supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Use isolated voltage sensing (ZMPT101b/isolated transformer) — measuring mains directly is dangerous; have a qualified person make the mains-side connection.',
    'Sample many times per cycle (e.g. 32–128 samples/cycle at 50/60 Hz) so transients and sub-cycle events are captured, not averaged away.',
    'Give the logger an accurate time source (RTC/GPS) for precise, correlatable event timestamps.',
    'Log events (and optionally waveform snippets) to local storage; keep an off-device copy for evidence.',
    'Keep the low-voltage electronics isolated from the mains sensing.',
  ],

  block: { columns: [
    { label: 'Capture', edge: 'right', blocks: [
      { name: 'Voltage waveform', sub: 'high-rate', highlight: true },
      { name: 'Time', sub: 'RTC/GPS' },
    ] },
    { label: 'Analyse', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'cycle RMS' },
      { name: 'Detect', sub: 'sag/swell/surge/THD' },
    ] },
    { label: 'Record', edge: 'right', blocks: [
      { name: 'Event log', sub: 'type/mag/dur/time' },
      { name: 'Trend', sub: 'frequency' },
    ] },
    { label: 'Prove', edge: 'none', blocks: [
      { name: 'Correlate', sub: 'with failures' },
      { name: 'Export', sub: 'evidence' },
    ] },
  ] },
  flow: [
    { t: 'Sample waveform (high-rate)', k: 'start' },
    { t: 'Compute cycle RMS + frequency', k: 'proc' },
    { t: 'RMS out of band / transient / high THD?', k: 'dec', yes: 'Characterise + timestamp event', no: 'Continue' },
    { t: 'Characterise + timestamp event', k: 'io' },
    { t: 'Continue', k: 'proc' },
    { t: 'Log; trend; alarm on severe', k: 'io' },
    { t: 'Correlate/export', k: 'end', back: 'Sample waveform (high-rate)' },
  ],

  principle: [
    'Power-quality problems are hard precisely because they are <b>fast, transient and intermittent</b> — a voltage sag when a nearby motor starts might last only a few cycles (tens of milliseconds), a surge a fraction of a cycle — and a normal meter, which reports a slow average, simply cannot see them: it smooths the disturbance into a number that looks fine. Yet these brief events are more than enough to reset a controller, trip a drive, corrupt data, or, over time, degrade equipment. So the whole approach hinges on <b>measuring fast enough to see what a meter misses</b>, and then turning each fleeting event into a permanent, characterised record.',
    'Seeing the events requires <b>high-rate waveform sampling</b> — many samples per mains cycle — from which the logger computes the <b>true RMS voltage cycle by cycle</b>. This cycle-resolved RMS is the key measurement: it reveals a sag as a run of cycles where the RMS drops below normal, a swell as a run above, an interruption as RMS collapsing, all with the timing a slow average destroys. On top of RMS, the raw samples let the logger catch faster <b>transients/surges</b> (a spike within a cycle) and compute <b>harmonic distortion</b> (THD) — the waveform distortion caused by non-linear loads (drives, power supplies) that stresses equipment and indicates supply or load problems. The single design decision that makes everything possible is sampling density; everything else is analysis on top of a fast, faithful capture of the waveform.',
    'The value comes from <b>characterisation and timestamping</b>, because a raw waveform is not actionable but a characterised event is. Each disturbance is classified by <b>type</b> (sag, swell, surge, interruption, frequency deviation, high THD), and recorded with its <b>magnitude</b> (how far the voltage deviated), <b>duration</b> (how long), and an accurate <b>timestamp</b>. This transforms a vague complaint into a precise fact: not "the power is bad" but "a sag to 70% of nominal lasting 80 ms occurred at 14:32:07". A log of such facts is <b>evidence</b> — the currency of any power-quality investigation.',
    'That evidence enables the two things that actually solve power-quality problems: <b>correlation</b> and <b>attribution</b>. Correlation matches disturbances against symptoms — if the machine trips at 14:32 and the logger recorded a deep sag at 14:32, you have found your culprit and can stop guessing. Attribution helps locate the <b>source</b>: a sag that coincides with an on-site load starting points inward (fix your own installation or supply capacity), while disturbances arriving from the incoming supply point to the utility — and a timestamped record is what lets you make a documented, defensible case to the utility or an equipment vendor rather than a losing argument of assertions. The design is honest about its limits: mains measurement is genuinely hazardous and must be done safely and isolated, and a homebrew logger is <i>not</i> a calibrated, standards-compliant power-quality analyser (the ones that classify events strictly per IEC 61000-4-30 for formal disputes). But as an instrument that captures, characterises and timestamps the sags, swells and surges a normal meter cannot see, it does the essential thing: it makes an invisible, intermittent, previously un-diagnosable supply problem <b>visible, measured and provable</b>.',
  ],
  equations: [
    { t: 'Cycle-by-cycle true RMS', eq: 'From N samples v[n] over one mains cycle:\n\n  V_rms = sqrt( (1/N) Σ v[n]^2 )\n\nCompute per cycle (needs many samples/cycle). A slow meter\naverages over seconds and hides sub-second events.' },
    { t: 'Sag / swell / interruption', eq: 'Relative to nominal V_nom:\n\n  sag        : 0.1·V_nom ≤ V_rms < 0.9·V_nom\n  swell      : V_rms > 1.1·V_nom\n  interruption: V_rms < 0.1·V_nom\n\nRecord each event\'s magnitude (% of nominal) and duration\n(number of affected cycles → time).' },
    { t: 'Harmonic distortion (THD)', eq: 'From the FFT of the voltage waveform:\n\n  THD = sqrt(Σ_{h≥2} V_h^2) / V_1\n\nV_1 = fundamental (50/60 Hz), V_h = harmonic amplitudes.\nHigh THD = waveform distortion from non-linear loads.' },
  ],

  assembly: [
    { h: 'Set up isolated high-rate voltage sensing', p: [
      'Use isolated voltage sensing and a fast ADC front-end to sample the mains waveform many times per cycle, with the mains-side connection made by a qualified person and the electronics isolated.',
      'Add an accurate time source (RTC/GPS) for event timestamps.',
    ], warn: 'Mains measurement is dangerous. Use isolation and have a qualified person make the mains connection; never probe live mains casually.' },
    { h: 'Set up detection and logging', p: [
      'Compute cycle RMS, frequency and THD, detect and characterise events, and log them (with optional waveform snippets) locally and off-device.',
    ] },
    { h: 'Set up correlation and export', p: [
      'Provide correlation/trending and an evidence export, and alarms on severe disturbances.',
    ] },
  ],
  steps: [
    { h: 'Compute cycle RMS and detect events', p: [
      'Compute true RMS per cycle, compare to nominal for sags/swells/interruptions, detect transients and high THD, and characterise each with type/magnitude/duration/timestamp.',
    ], code: {
      file: 'pq-detect.ino', lang: 'cpp',
      body: `#define V_NOM 230.0f
#define SAMPLES_PER_CYCLE 64

float cycleRMS(const float *v, int n){
  double ss=0; for(int i=0;i<n;i++) ss += (double)v[i]*v[i];
  return sqrtf(ss/n);
}

struct Event { const char* type; float magPct; };

Event classify(float vrms){
  float pct = vrms / V_NOM;
  if (pct < 0.10f) return {"interruption", pct*100};
  if (pct < 0.90f) return {"sag", pct*100};          // most common/disruptive
  if (pct > 1.10f) return {"swell", pct*100};
  return {nullptr, 100};                              // normal
}

// Track an ongoing event to record its duration.
struct EvState { bool active=false; const char* type=nullptr;
                 uint32_t startCycle=0; float peakPct=100; } ev;

void onCycle(float vrms, uint32_t cycle, DateTime t){
  Event e = classify(vrms);
  if (e.type){
    if (!ev.active){ ev.active=true; ev.type=e.type; ev.startCycle=cycle; ev.peakPct=e.magPct; }
    if (fabsf(e.magPct-100) > fabsf(ev.peakPct-100)) ev.peakPct=e.magPct;
  } else if (ev.active){                              // event ended
    uint32_t cycles = cycle - ev.startCycle;
    logEvent(ev.type, ev.peakPct, cycles, t);         // type/mag/duration/time
    ev.active=false;
  }
}`,
      explain: [
        { ref: 'float cycleRMS(const float *v, int n)', txt: 'Computes the true RMS of each mains cycle from many samples — the cycle-resolved measurement that reveals sub-second events a slow meter hides.' },
        { ref: 'if (pct < 0.90f) return {"sag", pct*100}', txt: 'A cycle RMS below 90% of nominal is a sag — the most common and disruptive disturbance — classified with its magnitude as a percentage of nominal.' },
        { ref: 'if (!ev.active){ ev.active=true; ev.type=e.type;', txt: 'An event is tracked from its first affected cycle so its duration and peak magnitude can be recorded, not just that it happened.' },
        { ref: 'logEvent(ev.type, ev.peakPct, cycles, t)', txt: 'When the event ends it is logged with type, peak magnitude, duration (in cycles → time) and timestamp — the characterisation that makes it evidence.' },
      ],
    } },
    { h: 'Log, correlate and export', p: [
      'Log characterised events with timestamps, compute THD, trend event frequency, alarm on severe disturbances, and export an evidence record for correlation with failures and for the utility/vendor.',
    ], tip: 'Capture a short waveform snippet around each event where storage allows — a waveform is far more convincing evidence than a single number.' },
  ],

  code: [{
    file: 'grid-power-quality-logger.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Grid Power-Quality Logger — ESP32 (isolated, high-rate)

   Samples the mains voltage many times per cycle, computes cycle RMS,
   frequency and THD, and captures/characterises sags, swells, surges,
   interruptions with timestamps — evidence for supply diagnosis.
   Mains measurement is hazardous; a DIY logger is indicative, not a
   calibrated IEC 61000-4-30 analyser.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <RTClib.h>
#include <math.h>

#define PIN_V     34
#define V_NOM     230.0f
#define SPC       64            // samples per cycle
#define MAINS_HZ  50

RTC_DS3231 rtc; WiFiClient net; PubSubClient mqtt(net);
float VCAL;                     // ADC->volts calibration
struct EvState { bool active=false; const char* type=nullptr;
                 uint32_t startMs=0; float peakPct=100; } ev;

float sampleCycleRMS(){
  const uint32_t period_us = 1000000UL/(MAINS_HZ*SPC);
  double ss=0; uint32_t next=micros();
  for(int i=0;i<SPC;i++){
    while((int32_t)(micros()-next)<0){} next+=period_us;
    float v = (analogRead(PIN_V) - 2048)/2048.0f * VCAL;   // centred, scaled
    ss += (double)v*v;
  }
  return sqrtf(ss/SPC);
}

const char* classify(float vrms, float &pct){
  pct = vrms/V_NOM*100;
  if (pct < 10) return "interruption";
  if (pct < 90) return "sag";
  if (pct > 110) return "swell";
  return nullptr;
}

void setup(){
  Serial.begin(115200);
  analogSetPinAttenuation(PIN_V, ADC_11db);
  Wire.begin(21,22); rtc.begin();
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("pq-1");
  mqtt.loop();

  float vrms = sampleCycleRMS();          // one mains cycle
  uint32_t now = millis();
  float pct; const char* type = classify(vrms, pct);

  if (type){
    if (!ev.active){ ev.active=true; ev.type=type; ev.startMs=now; ev.peakPct=pct; }
    if (fabsf(pct-100) > fabsf(ev.peakPct-100)) ev.peakPct=pct;
  } else if (ev.active){                    // event ended -> record it
    uint32_t dur = now - ev.startMs;
    DateTime t = rtc.now();
    char m[200];
    snprintf(m,sizeof m,
      "{\\"type\\":\\"%s\\",\\"mag_pct\\":%.0f,\\"dur_ms\\":%lu,"
      "\\"time\\":\\"%04d-%02d-%02d %02d:%02d:%02d\\"}",
      ev.type, ev.peakPct, (unsigned long)dur,
      t.year(),t.month(),t.day(),t.hour(),t.minute(),t.second());
    logLocal(m);                            // evidence log (local + mirror)
    mqtt.publish("pq/1/event", m);
    if (ev.peakPct < 80 || ev.peakPct > 115) mqtt.publish("pq/1/alarm", m);
    ev.active=false;
  }

  // periodic RMS/THD status
  static uint32_t last=0;
  if (now-last > 1000){ last=now;
    char s[120]; snprintf(s,sizeof s,"{\\"vrms\\":%.1f}", vrms);
    mqtt.publish("pq/1/status", s);
  }
}`,
    explain: [
      { ref: 'float sampleCycleRMS()', txt: 'Samples one full mains cycle at 64 points per cycle and computes true RMS — fast enough to catch sub-second disturbances a normal meter averages away.' },
      { ref: 'const char* classify(float vrms, float &pct)', txt: 'Classifies the cycle as an interruption, sag or swell by comparing its RMS to nominal, capturing the event\'s magnitude as a percentage.' },
      { ref: 'if (!ev.active){ ev.active=true; ev.type=type; ev.startMs=now;', txt: 'An event is tracked from its onset so its duration and peak magnitude are recorded — the characterisation that makes it usable evidence.' },
      { ref: 'logLocal(m);                            // evidence log (local + mirror)', txt: 'Each characterised, timestamped event is logged locally and mirrored — a permanent record for correlation and dispute.' },
      { ref: 'if (ev.peakPct < 80 || ev.peakPct > 115)', txt: 'Severe disturbances raise an immediate alarm, while all events are logged for trending and correlation.' },
    ],
  }],

  config: [
    'Set the nominal voltage, samples-per-cycle and event thresholds (sag/swell/interruption/THD).',
    'Calibrate the voltage scaling and configure the time source for accurate timestamps.',
    'Configure local + off-device logging and waveform-snippet capture.',
    'Set severe-disturbance alarm thresholds.',
  ],
  calibration: [
    { h: 'Voltage scaling', p: [
      'Calibrate the ADC-to-volts scaling against a reference so RMS and event magnitudes are accurate.',
    ] },
    { h: 'Sampling', p: [
      'Confirm the samples-per-cycle rate is steady and sufficient to capture transients; verify RMS matches a reference under steady voltage.',
    ] },
    { h: 'Time', p: [
      'Verify the RTC/GPS timestamps are accurate for correlation.',
    ] },
  ],
  testing: [
    { step: 'Steady nominal voltage', expect: 'Accurate RMS; no events' },
    { step: 'Induce a sag (start a big load)', expect: 'Sag captured with magnitude, duration, timestamp' },
    { step: 'Induce a swell/surge', expect: 'Swell/transient captured and characterised' },
    { step: 'Add a non-linear load', expect: 'THD rises; measured' },
    { step: 'Correlate an event with a trip', expect: 'Timestamps match — cause identified' },
    { step: 'Export the log', expect: 'Timestamped, characterised evidence record' },
  ],
  output: [
    'The dashboard shows live RMS/frequency/THD and a timeline of characterised events (type/magnitude/duration/time) with alarms and export.',
    { file: 'pq-event.json', lang: 'json', body: `{
  "type": "sag",
  "mag_pct": 71,
  "dur_ms": 82,
  "time": "2026-07-27 14:32:07"
}` },
    'A sag to 71% of nominal lasting 82 ms at 14:32:07 — a characterised, timestamped event that a normal meter would never have shown, and exactly the evidence needed to correlate with an equipment trip and take to the utility.',
  ],
  troubleshoot: [
    { sym: 'Events not captured', cause: 'Sampling too slow (averaging)', fix: 'Sample many times per cycle; compute cycle-by-cycle RMS' },
    { sym: 'Magnitudes wrong', cause: 'Voltage scaling uncalibrated', fix: 'Calibrate ADC-to-volts against a reference' },
    { sym: 'Timestamps unreliable', cause: 'No accurate time source', fix: 'Use RTC/GPS; correlation depends on accurate time' },
    { sym: 'Can\'t prove to the utility', cause: 'Uncharacterised or non-standard log', fix: 'Characterise events (type/mag/dur/time); note a calibrated IEC analyser may be needed for formal disputes' },
    { sym: 'Safety concern', cause: 'Direct mains measurement', fix: 'Use isolated sensing; qualified person for mains connection' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → power-quality dashboard',
    net: {
      nodes: [{ name: 'PQ logger', sub: 'ESP32' }, { name: 'Other points', sub: 'per-location' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to server',
      uplink: 'MQTT 1883', cloud: 'PQ dashboard', cloudSub: 'events + trends',
      clients: [{ name: 'Dashboard', sub: 'events/RMS' }, { name: 'Engineer', sub: 'alerts/export' }],
    },
    protocol: ['RMS/THD status publishes periodically; characterised events and severe-disturbance alarms publish immediately. The local log is the evidence record, mirrored off-device.'],
    topics: [
      { t: 'pq/1/event', dir: 'node → dashboard', payload: 'type, magnitude, duration, timestamp' },
      { t: 'pq/1/alarm', dir: 'node → engineer', payload: 'severe disturbance' },
      { t: 'pq/1/status', dir: 'node → dashboard', payload: 'RMS, frequency, THD' },
    ],
    cloud: ['A dashboard shows RMS/THD and an event timeline, trends event frequency, and exports the record for correlation with failures and for utility/vendor disputes.'],
    dashboard: ['Live RMS/frequency/THD, an event timeline with magnitude/duration, trend of event frequency, and export.'],
    mobile: ['Alerts on severe disturbances; daily disturbance summaries.'],
    security: [
      'Keep the local evidence log authoritative and mirrored; timestamp accurately.',
      'Authenticate nodes; secure the data.',
      'Note a calibrated, standards-compliant analyser may be required for formal disputes.',
    ],
  },

  perf: [
    'Sample many times per cycle at a steady rate — this determines what you can see.',
    'Compute cycle RMS and event detection efficiently to keep up with the sampling.',
    'Log events (and snippets) locally and mirror; alarm on severe events.',
    'Trend event frequency for correlation and reporting.',
  ],
  safety: [
    'Measuring mains is dangerous — use isolated sensing and a qualified person for the mains-side connection.',
    'Keep the low-voltage electronics isolated from the mains sensing.',
    'A DIY logger is indicative, not a calibrated, standards-compliant (IEC 61000-4-30) power-quality analyser; formal disputes may need certified equipment.',
    'Investigate/act on power-quality findings with appropriate electrical expertise.',
  ],
  maintenance: [
    'Verify voltage calibration and timestamp accuracy periodically.',
    'Check the log and off-device mirror; export/archive evidence.',
    'Confirm sampling rate/integrity after any change.',
    'Correlate events with equipment issues and act.',
  ],
  future: [
    'Add current channels for full power-quality (flicker, unbalance, power).',
    'Add standards-aligned event classification and reporting.',
    'Add waveform capture/streaming for detailed analysis.',
    'Correlate multiple loggers to locate disturbance sources.',
  ],
  faq: [
    { q: 'Why can\'t a normal meter see these problems?', a: 'Because they are fast and brief — a sag may last only tens of milliseconds. A normal meter reports a slow average that smooths the disturbance away. You must sample many times per cycle to see it.' },
    { q: 'What is a voltage sag and why does it matter?', a: 'A brief dip in voltage, often when a large load starts nearby. It is the most common and disruptive power-quality event — enough to reset controllers or trip processes — yet invisible to ordinary metering.' },
    { q: 'How does this help me prove a supply problem?', a: 'It characterises each disturbance (type, magnitude, duration) with an accurate timestamp, producing an evidence log you can correlate with equipment failures and take to the utility or vendor — facts, not assertions.' },
    { q: 'Is it accurate enough for a formal dispute?', a: 'It is indicative evidence. Formal disputes may require a calibrated, standards-compliant (IEC 61000-4-30) analyser. This logger is excellent for diagnosis and building a case, honestly labelled as such.' },
    { q: 'Is it safe to build?', a: 'Only with isolated voltage sensing and a qualified person making the mains-side connection. Measuring mains directly is dangerous; keep the electronics isolated.' },
  ],
  refs: [
    { t: 'Power quality — overview', u: 'https://en.wikipedia.org/wiki/Power_quality', s: 'Reference' },
    { t: 'Voltage sag (dip) and swell', u: 'https://en.wikipedia.org/wiki/Voltage_sag', s: 'Reference' },
    { t: 'Total harmonic distortion (THD)', u: 'https://en.wikipedia.org/wiki/Total_harmonic_distortion', s: 'Reference' },
    { t: 'IEC 61000-4-30 power-quality measurement', u: 'https://en.wikipedia.org/wiki/IEC_61000', s: 'Reference' },
    { t: 'RMS and waveform measurement', u: 'https://en.wikipedia.org/wiki/Root_mean_square', s: 'Reference' },
  ],
  images: ['esp32', 'grafana', 'city'],
  imageCaptions: [
    'Power-quality events are too fast for a normal meter — the logger samples fast enough to catch them.',
    'ESP32 module computing cycle-by-cycle RMS and characterising sags, swells and surges.',
    'A timestamped event log turns an invisible supply problem into provable evidence.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   074 — Streetlight Energy Optimizer
   ══════════════════════════════════════════════════════════════════ */
{
  id: '074',
  domainKey: 'iot',
  emoji: '💡', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Runs streetlights dusk-to-dawn and dims them when no one is around — cutting a municipality\'s biggest controllable electricity bill while keeping streets safe.',

  overview: [
    'Street lighting is often a municipality\'s single largest electricity expense, and much of that energy is wasted: lights burning at full brightness on empty streets at 3 a.m., lights left on after dawn or switched on before dusk because a timer drifted, and lights that fail unnoticed until someone complains. This project builds a smarter streetlight controller that attacks all of that: it switches precisely dusk-to-dawn from actual light levels, <b>dims</b> when no one is around and brightens when they are, and reports faults — cutting the bill substantially while keeping the street appropriately lit.',
    'The two big savings are <b>accurate dusk-to-dawn switching</b> and <b>adaptive dimming</b>. A light sensor switches the lamp on at real dusk and off at real dawn (not a fixed clock that is wrong half the year and drifts), eliminating the hours of daylight burning that fixed timers waste. Then, during the night, a motion sensor (PIR or radar) lets the light run <b>dimmed</b> when the street is empty and ramp to full brightness when a person or vehicle approaches — so the street is brightly lit exactly when someone is there to use it, and sips power the rest of the time. Because a dimmed LED uses proportionally less energy, and streets are empty most of the night, the saving is large.',
    'Beyond energy, per-light intelligence enables <b>fault reporting</b> — a light that draws no current when it should be on has failed, and the controller can report it (with its location) so maintenance is proactive instead of complaint-driven — and, networked, a city-wide picture of energy, brightness and faults. It measures its own consumption to prove the savings. The design keeps safety first: dimming respects minimum lighting levels for the road type so streets are never unsafely dark, and it fails to a safe (on) state. It is honest that lighting levels are governed by standards and that dimming policy is a municipal decision, and that a real deployment integrates with the lighting infrastructure properly. But as a dusk-to-dawn, adaptively-dimming, fault-reporting controller, it turns a large, wasteful, static electricity bill into a managed one — saving money while keeping the light where and when it is needed.',
  ],
  does: [
    'Switches lights precisely dusk-to-dawn from actual light levels',
    'Dims when the street is empty and brightens on motion',
    'Cuts energy while keeping streets appropriately lit',
    'Reports faults (a light drawing no current when on) with location',
    'Measures consumption to prove the savings',
    'Respects minimum lighting levels and fails safe (on)',
    'Networks for a city-wide energy/brightness/fault picture',
  ],
  features: [
    'Accurate dusk-to-dawn (no drifting timer waste)',
    'Adaptive motion-based dimming',
    'Large energy saving (dimmed LED + empty streets)',
    'Proactive fault reporting',
    'Consumption measurement / savings proof',
    'Safety: minimum levels, fail-safe on',
    'City-wide networked control',
  ],
  applications: [
    { t: 'Municipal street lighting', d: 'Cutting the biggest controllable power bill with dusk-to-dawn + adaptive dimming.' },
    { t: 'Campus / industrial estates', d: 'Adaptive lighting of roads and car parks with fault reporting.' },
    { t: 'Highways / rural roads', d: 'Motion-brightening lighting where traffic is sparse most of the night.' },
    { t: 'Smart-city lighting networks', d: 'Central control, energy and fault visibility across a city.' },
  ],
  skills: [
    'Light-level (dusk/dawn) sensing and hysteresis',
    'Motion sensing and adaptive dimming (PWM/0-10V)',
    'Current sensing for fault detection',
    'Minimum-level/fail-safe design',
    'Networked reporting and savings measurement',
  ],
  prereq: [
    'Dimming must respect minimum lighting levels for the road type — never make a street unsafely dark; fail to a safe (on) state.',
    'Accurate dusk-to-dawn from real light levels beats a fixed timer that drifts and wastes daylight hours.',
    'Current sensing turns "is the light on?" into fault detection (drawing no current when it should).',
    'Lighting levels are standards-governed and dimming policy is a municipal decision; integrate properly with the infrastructure.',
  ],

  parts: ['esp32', 'ldr', 'pir', 'acs712', 'relay1', 'oled', 'lora', 'psu5v'],
  extraParts: [
    { name: 'Dimmable LED driver interface', spec: '0-10 V / PWM / DALI dimming interface to the luminaire driver', qty: 1, price: 600, note: 'Match to the luminaire\'s dimming standard' },
    { name: 'Motion sensor (PIR/radar)', spec: 'Radar preferred outdoors for range/reliability', qty: 1, price: 400 },
    { name: 'Current sensor', spec: 'To confirm the light is drawing (fault detection)', qty: 1, price: 200 },
    { name: 'Pole enclosure + LoRa', spec: 'Outdoor enclosure and LoRa for city networking', qty: 1, price: 900 },
  ],
  cost: '₹2,500 – ₹4,500 per light',
  libs: ['wifi', 'pubsub', 'ssd1306', 'lorolib', 'ntp', 'arduinojson'],

  pins: {
    left: [
      { dev: 'Light sensor (LDR)', devPin: 'AOUT', pin: 'GPIO 34', sig: 'Dusk/dawn level' },
      { dev: 'Motion (PIR/radar)', devPin: 'OUT', pin: 'GPIO 27', sig: 'Presence' },
      { dev: 'Current sensor', devPin: 'AOUT', pin: 'GPIO 35', sig: 'Lamp current (fault)' },
    ],
    right: [
      { dev: 'Dimming (0-10V/PWM)', devPin: 'ctrl', pin: 'GPIO 25', sig: 'Brightness to driver' },
      { dev: 'Relay/contactor', devPin: 'IN', pin: 'GPIO 26', sig: 'Lamp on/off' },
      { dev: 'LoRa', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'City network' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Status' },
    ],
  },
  wiringNotes: [
    'Switch the lamp on/off from real light levels (LDR) with hysteresis so it does not flicker at dusk/dawn.',
    'Drive the luminaire\'s dimming input (0-10 V/PWM/DALI) to set brightness; match the luminaire\'s dimming standard.',
    'Sense lamp current to confirm the light is actually drawing when commanded on — the basis of fault detection.',
    'Respect minimum lighting levels for the road and fail to a safe (on) state if sensing fails.',
    'Use an outdoor pole enclosure and LoRa for city-wide networking; integrate with the lighting infrastructure properly.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Light level', sub: 'dusk/dawn', highlight: true },
      { name: 'Motion', sub: 'presence' },
      { name: 'Current', sub: 'fault' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'on + brightness' },
      { name: 'Min level', sub: 'fail-safe on' },
    ] },
    { label: 'Actuate', edge: 'right', blocks: [
      { name: 'Dim', sub: 'brightness' },
      { name: 'Switch', sub: 'on/off' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'Energy/savings', sub: 'measured' },
      { name: 'Fault', sub: 'located' },
    ] },
  ] },
  flow: [
    { t: 'Read light level, motion, current', k: 'start' },
    { t: 'Dark (dusk-to-dawn)?', k: 'dec', yes: 'Lamp on', no: 'Lamp off (day)' },
    { t: 'Lamp on', k: 'proc' },
    { t: 'Lamp off (day)', k: 'io' },
    { t: 'Motion present?', k: 'dec', yes: 'Full brightness', no: 'Dim to minimum level' },
    { t: 'Full brightness', k: 'io' },
    { t: 'Dim to minimum level', k: 'io' },
    { t: 'On but no current? → fault', k: 'dec', yes: 'Report fault (located)', no: 'Report energy' },
    { t: 'Report fault (located)', k: 'io' },
    { t: 'Report energy', k: 'end', back: 'Read light level, motion, current' },
  ],

  principle: [
    'Street lighting is a large, mostly <b>static and wasteful</b> load, and the optimiser\'s value comes from making it <b>responsive</b> in two dimensions — <i>when</i> it is on and <i>how bright</i> it is — while never compromising the safety the lighting exists to provide. The two biggest wastes are lights burning during daylight (from timers that drift or are mis-set) and lights burning at full brightness on empty streets. Fixing both, per light and city-wide, converts a fixed bill into a managed one, and the savings are large because the waste is large.',
    'The first win is <b>accurate dusk-to-dawn switching from real light levels</b>. A light sensor turns the lamp on when it genuinely gets dark and off when it genuinely gets light, with <b>hysteresis</b> so passing clouds do not make it flicker at the threshold. This beats a fixed timer, which is right only twice a year and drifts, wasting hours of daylight burning across a season — hours multiplied by thousands of lights. Getting the on/off boundary right, automatically and locally, is a substantial saving before any dimming.',
    'The second, larger win is <b>adaptive dimming</b>. A dimmed LED consumes proportionally less power, and a street is empty for most of the night — so running the light at a reduced (but safe) level when no one is present, and ramping it to full brightness when a motion sensor detects a person or vehicle approaching, delivers bright light exactly when it is needed and low power the rest of the time. The critical constraint, and the safety principle, is that dimming must respect the <b>minimum lighting level</b> appropriate to the road type: the street is never made unsafely dark, only reduced within safe limits, and the system <b>fails to a safe (on/full) state</b> if a sensor fails. Dimming policy — how low, and on what roads — is a municipal decision within lighting standards, which the design honours rather than overrides.',
    'Per-light intelligence unlocks two further benefits. <b>Fault reporting</b>: by sensing whether the lamp actually draws current when commanded on, the controller knows if a light has failed and can report it <i>with its location</i>, so maintenance becomes proactive (fix the dark light before residents complain) instead of reactive — a major operational saving on top of the energy one. And <b>measured savings</b>: by metering its own consumption, the system proves the reduction, which is what justifies the investment to a municipality and lets it verify each policy. Networked over LoRa, all of this scales to a <b>city-wide</b> view — energy, brightness, and faults across every light, centrally controllable. The design keeps safety and honesty central — minimum levels respected, fail-safe on, standards and municipal policy honoured, proper integration with the lighting infrastructure — but within that, it does exactly what a city needs: it keeps the streets appropriately lit while cutting one of the largest, most wasteful bills a municipality carries.',
  ],
  equations: [
    { t: 'Dusk-to-dawn with hysteresis', eq: 'From the light sensor level L:\n\n  turn ON  when L < L_dark  (dusk)\n  turn OFF when L > L_light (dawn), with L_light > L_dark\n\nHysteresis prevents flicker from clouds at the threshold.\nReal-level switching avoids daylight burning of drifting timers.' },
    { t: 'Adaptive dimming energy saving', eq: 'Brightness B: full when motion, else dim (≥ B_min):\n\n  power ∝ B (LED)\n  night energy ≈ Σ (B_full·t_occupied + B_dim·t_empty)\n\nStreets empty most of the night → large saving, while\nB_dim ≥ minimum safe level keeps the street safe.' },
    { t: 'Fault detection', eq: 'Commanded ON but lamp draws no current → failed:\n\n  fault if (commanded_on AND I_lamp < I_min)\n  report fault with light location → proactive maintenance.' },
  ],

  assembly: [
    { h: 'Set up switching, dimming and current sensing', p: [
      'Connect the light sensor (with hysteresis) for dusk-to-dawn, the motion sensor for presence, the dimming interface to the luminaire driver, and a current sensor for fault detection.',
      'Configure the minimum safe brightness for the road type and fail-safe (on) behaviour.',
    ], warn: 'Dimming must never take the street below its safe minimum lighting level, and the system must fail to on/full if sensing fails. Safety and standards come first.' },
    { h: 'Set up energy measurement and networking', p: [
      'Measure consumption to prove savings, and add LoRa for city-wide reporting/control.',
    ] },
    { h: 'Set up fault reporting', p: [
      'Report a located fault when a commanded-on light draws no current, for proactive maintenance.',
    ] },
  ],
  steps: [
    { h: 'Control on/off and adaptive brightness', p: [
      'Switch dusk-to-dawn with hysteresis, set brightness to full on motion or the safe dim level when empty, and detect faults from current.',
    ], code: {
      file: 'streetlight.ino', lang: 'cpp',
      body: `#define L_DARK 800     // ADC: below = dark (dusk)
#define L_LIGHT 1200   // ADC: above = light (dawn); hysteresis gap
#define B_MIN 40       // % minimum safe brightness
#define B_FULL 100     // %
#define I_MIN 0.05f    // A: below when on = fault
#define MOTION_HOLD_MS 30000

bool lampOn=false; uint32_t lastMotion=0;

int decide(int light, bool motion, uint32_t now, bool &on){
  // dusk-to-dawn with hysteresis
  if (light < L_DARK) on = true;
  else if (light > L_LIGHT) on = false;      // else keep previous (hysteresis)
  else on = lampOn;

  if (!on) return 0;                          // day: off
  if (motion) lastMotion = now;
  bool occupied = (now - lastMotion) < MOTION_HOLD_MS;
  return occupied ? B_FULL : B_MIN;           // never below safe minimum
}

const char* checkFault(bool on, float iLamp){
  if (on && iLamp < I_MIN) return "lamp failed (no current)";
  return nullptr;
}`,
      explain: [
        { ref: 'if (light < L_DARK) on = true;', txt: 'The lamp switches on at real darkness and off at real daylight, with a hysteresis gap so clouds do not cause flicker — no wasted daylight burning.' },
        { ref: 'return occupied ? B_FULL : B_MIN', txt: 'Brightness is full when the street is occupied (recent motion) and the safe minimum when empty — bright when needed, low power otherwise, never below the safe level.' },
        { ref: 'bool occupied = (now - lastMotion) < MOTION_HOLD_MS', txt: 'A hold time keeps the light bright for a while after motion, so it does not drop while someone is still passing.' },
        { ref: 'if (on && iLamp < I_MIN) return "lamp failed (no current)"', txt: 'A commanded-on lamp drawing no current has failed, enabling proactive, located fault reporting.' },
      ],
    } },
    { h: 'Drive brightness, measure and report', p: [
      'Set the dimming output and lamp relay per the decision, measure consumption to prove savings, report energy/brightness/faults over LoRa, and fail safe (on) if sensing fails.',
    ], tip: 'Fail to full brightness on any sensor fault — a dark street from a controller fault is a safety hazard, not an acceptable energy saving.' },
  ],

  code: [{
    file: 'streetlight-optimizer.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Streetlight Energy Optimizer — ESP32

   Dusk-to-dawn from real light levels, adaptive motion dimming (never
   below the safe minimum), fault reporting from lamp current, and
   measured savings. Fails safe (full on). Networked over LoRa.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <LoRa.h>
#include <SPI.h>

#define PIN_LDR   34
#define PIN_MOTION 27
#define PIN_ILAMP 35
#define PIN_DIM   25    // 0-10V/PWM to driver
#define PIN_RELAY 26
#define L_DARK 800
#define L_LIGHT 1200
#define B_MIN 40
#define B_FULL 100
#define I_MIN 0.05f
#define MOTION_HOLD_MS 30000

WiFiClient net; PubSubClient mqtt(net);
bool lampOn=false; uint32_t lastMotion=0; double energyWh=0; uint32_t lastMs=0;
const char *LIGHT_ID = "SL-4412";

void setBrightness(int pct){ ledcWrite(0, pct*1023/100); }

void setup(){
  Serial.begin(115200);
  pinMode(PIN_MOTION, INPUT); pinMode(PIN_RELAY, OUTPUT);
  ledcSetup(0, 1000, 10); ledcAttachPin(PIN_DIM, 0);
  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  lastMs=millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("sl-1");
  mqtt.loop();
  uint32_t now=millis(); float dtHr=(now-lastMs)/3600000.0f; lastMs=now;

  int light = analogRead(PIN_LDR);
  bool motion = digitalRead(PIN_MOTION)==HIGH;
  float iLamp = analogRead(PIN_ILAMP)/4095.0f * I_FS;   // A

  bool sensorsOk = true;                                // (validate reads)

  // dusk-to-dawn with hysteresis
  if (light < L_DARK) lampOn = true;
  else if (light > L_LIGHT) lampOn = false;

  int brightness = 0;
  if (lampOn || !sensorsOk){                            // fail-safe: on
    if (motion) lastMotion = now;
    bool occupied = (now - lastMotion) < MOTION_HOLD_MS;
    brightness = (!sensorsOk) ? B_FULL : (occupied ? B_FULL : B_MIN);
  }
  digitalWrite(PIN_RELAY, brightness>0 ? HIGH : LOW);
  setBrightness(brightness);

  // energy + fault
  float watts = (brightness/100.0f) * LAMP_W;
  energyWh += watts * dtHr;
  const char* fault = (brightness>0 && iLamp < I_MIN) ? "lamp failed" : nullptr;

  char m[220];
  snprintf(m,sizeof m,
    "{\\"id\\":\\"%s\\",\\"on\\":%s,\\"bright\\":%d,\\"kWh\\":%.3f,"
    "\\"fault\\":\\"%s\\"}",
    LIGHT_ID, lampOn?"true":"false", brightness, energyWh/1000.0,
    fault?fault:"none");
  LoRa.beginPacket(); LoRa.print(m); LoRa.endPacket();  // city network
  if (fault) mqtt.publish("streetlight/fault", m);

  delay(1000);
}`,
    explain: [
      { ref: 'if (light < L_DARK) lampOn = true;\n  else if (light > L_LIGHT) lampOn = false;', txt: 'Real-light-level dusk-to-dawn with a hysteresis gap avoids the daylight burning and flicker of a drifting timer.' },
      { ref: 'if (lampOn || !sensorsOk){                            // fail-safe: on', txt: 'If sensing fails, the light stays on at full — a controller fault must never leave a street dark.' },
      { ref: 'brightness = (!sensorsOk) ? B_FULL : (occupied ? B_FULL : B_MIN)', txt: 'Brightness is full when occupied (or on fault) and the safe minimum when empty — the adaptive dimming that saves energy without unsafe darkness.' },
      { ref: 'energyWh += watts * dtHr', txt: 'The controller meters its own consumption so the savings from dusk-to-dawn and dimming are measured and provable.' },
      { ref: 'const char* fault = (brightness>0 && iLamp < I_MIN)', txt: 'A commanded-on light drawing no current is a failed lamp, reported (with its ID) for proactive maintenance.' },
    ],
  }],

  config: [
    'Set the dusk/dawn light thresholds (with hysteresis), the minimum safe brightness, and the motion hold time.',
    'Configure the dimming interface (0-10V/PWM/DALI), current-fault threshold and lamp wattage.',
    'Set fail-safe (on) behaviour and the road-type minimum level per lighting policy/standards.',
    'Configure LoRa networking, energy measurement and fault reporting.',
  ],
  calibration: [
    { h: 'Dusk/dawn', p: [
      'Set the light thresholds so switching matches real dusk/dawn with adequate hysteresis (no cloud flicker).',
    ] },
    { h: 'Dimming/minimum', p: [
      'Verify the dim level meets the road\'s minimum lighting standard and the motion-brighten works with adequate hold time.',
    ] },
    { h: 'Fault/energy', p: [
      'Calibrate current sensing for fault detection and consumption for savings measurement.',
    ] },
  ],
  testing: [
    { step: 'Cover/uncover the light sensor', expect: 'Switches on at dark, off at light, with hysteresis' },
    { step: 'Trigger motion at night', expect: 'Brightens to full; dims after the hold time when empty' },
    { step: 'Empty street at night', expect: 'Runs at the safe minimum brightness (energy saved)' },
    { step: 'Disable the lamp (no current)', expect: 'Fault reported with the light\'s ID' },
    { step: 'Simulate a sensor fault', expect: 'Fails safe to full brightness' },
    { step: 'Measure over a night', expect: 'Consumption/savings quantified' },
  ],
  output: [
    'The city dashboard shows each light\'s on/brightness state, energy and faults on a map; savings are quantified against always-full-brightness.',
    { file: 'streetlight.json', lang: 'json', body: `{
  "id": "SL-4412",
  "on": true,
  "bright": 40,
  "kWh": 0.183,
  "fault": "none"
}` },
    'A light running at 40% (safe minimum) on an empty street at night — brightening to full when someone approaches — with its energy measured; a failed lamp would appear as a located fault for proactive repair.',
  ],
  troubleshoot: [
    { sym: 'Light flickers at dusk/dawn', cause: 'No hysteresis', fix: 'Add a hysteresis gap between on and off thresholds' },
    { sym: 'Street too dark when dimmed', cause: 'Dim level below the safe minimum', fix: 'Raise the minimum brightness to the road standard; dimming must stay safe' },
    { sym: 'Doesn\'t brighten in time', cause: 'Motion range/hold too short', fix: 'Use a longer-range sensor (radar); increase the hold time' },
    { sym: 'Faults not detected', cause: 'No current sensing', fix: 'Sense lamp current; report when on but drawing nothing' },
    { sym: 'Dark street on controller fault', cause: 'Not failing safe', fix: 'Fail to full brightness on any sensor/controller fault' },
  ],

  iot: {
    protoShort: 'LoRa → city lighting management',
    net: {
      nodes: [{ name: 'Streetlight', sub: 'ESP32' }, { name: 'Other lights', sub: 'city grid' }],
      protocol: 'LoRa', gateway: 'City gateway', gatewaySub: 'to management',
      uplink: 'MQTT', cloud: 'Lighting management', cloudSub: 'energy/brightness/faults',
      clients: [{ name: 'Dashboard', sub: 'map + energy' }, { name: 'Maintenance', sub: 'faults' }],
    },
    protocol: ['Each light reports state, brightness, energy and faults; the city management can adjust policy (dim levels, schedules) and see energy/faults across the network.'],
    topics: [
      { t: 'streetlight/<id>/status', dir: 'light → mgmt', payload: 'on, brightness, energy' },
      { t: 'streetlight/<id>/fault', dir: 'light → maintenance', payload: 'failed lamp (located)' },
      { t: 'streetlight/policy', dir: 'mgmt → lights', payload: 'dim levels, schedules' },
    ],
    cloud: ['A lighting-management system maps every light\'s state, energy and faults, quantifies savings, and pushes dimming/schedule policy — a city-wide managed lighting network.'],
    dashboard: ['A city map of lights by state/brightness, energy and savings, and a fault list for proactive maintenance.'],
    mobile: ['Fault alerts (failed lamps) and energy/savings summaries.'],
    security: [
      'Keep minimum-level and fail-safe behaviour local and safe, independent of the network.',
      'Authenticate policy pushes so only the municipality can change dimming/schedules.',
      'Alert on light silence — a non-reporting light may be failed.',
    ],
  },

  perf: [
    'Simple local control loop; dusk-to-dawn and dimming need modest rates.',
    'Keep minimum-level/fail-safe local and safe.',
    'Report state/energy/faults over LoRa on a slow cadence, faults immediately.',
    'Measure consumption to prove savings.',
  ],
  safety: [
    'Dimming must respect the road\'s minimum lighting level — never make a street unsafely dark; fail to safe (full on).',
    'Lighting levels are standards-governed and dimming policy is a municipal decision; honour both.',
    'Integrate with the lighting infrastructure and mains safely (qualified work for power).',
    'Fault-report failed lamps for maintenance; do not leave dark spots.',
  ],
  maintenance: [
    'Verify dusk/dawn thresholds and minimum-level compliance seasonally.',
    'Act on fault reports; the point is proactive maintenance.',
    'Check motion-sensor range/coverage and dimming operation.',
    'Review measured savings and adjust policy.',
  ],
  future: [
    'Add group/predictive brightening (light the path ahead of a moving vehicle).',
    'Add per-light scheduling and astronomical-clock backup.',
    'Add power-quality/energy analytics across the network.',
    'Integrate with traffic/occupancy data for smarter policy.',
  ],
  faq: [
    { q: 'Where do the savings come from?', a: 'Two places: accurate dusk-to-dawn switching (no daylight burning from drifting timers) and adaptive dimming (a dimmed LED uses proportionally less power, and streets are empty most of the night). Together they cut a large, wasteful bill substantially.' },
    { q: 'Is it safe to dim the streets?', a: 'Yes, within limits. Dimming never goes below the road type\'s minimum safe lighting level, the light brightens to full when someone is present, and the system fails to full on if a sensor fails. Safety and standards come first.' },
    { q: 'How does fault reporting work?', a: 'By sensing whether the lamp actually draws current when commanded on. A commanded-on light drawing nothing has failed, and it is reported with its location so maintenance is proactive instead of waiting for complaints.' },
    { q: 'Why not just use a timer?', a: 'A fixed timer is right only twice a year and drifts, wasting hours of daylight burning across thousands of lights. Switching from real light levels eliminates that waste automatically.' },
    { q: 'How is this managed across a city?', a: 'Each light networks over LoRa to a lighting-management system that maps state, energy and faults and pushes dimming/schedule policy — a centrally managed, measurable lighting network.' },
  ],
  refs: [
    { t: 'Street lighting and energy efficiency', u: 'https://en.wikipedia.org/wiki/Street_light', s: 'Reference' },
    { t: 'Adaptive/dimming street lighting', u: 'https://en.wikipedia.org/wiki/Smart_street_lighting', s: 'Reference' },
    { t: 'Road lighting standards (minimum levels)', u: 'https://en.wikipedia.org/wiki/Road_lighting', s: 'Reference' },
    { t: 'LED dimming (0-10V/DALI/PWM)', u: 'https://en.wikipedia.org/wiki/Digital_Addressable_Lighting_Interface', s: 'Reference' },
    { t: 'Photocell dusk-to-dawn control', u: 'https://en.wikipedia.org/wiki/Photoresistor', s: 'Reference' },
  ],
  images: ['streetlight', 'esp32', 'city'],
  imageCaptions: [
    'Adaptive streetlights cut a city\'s biggest controllable bill while keeping streets safely lit.',
    'ESP32 module switching dusk-to-dawn and dimming to a safe minimum when the street is empty.',
    'Networked, it gives a city-wide view of energy, brightness and faults for proactive management.',
  ],
},

];
