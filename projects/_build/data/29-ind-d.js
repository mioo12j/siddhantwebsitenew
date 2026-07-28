/* Industrial batch D — 066 Compressed Air Leak Monitor, 067 Worker
   Safety Wearable, 068 Warehouse Climate Logger. Full-depth guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   066 — Compressed Air Leak Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '066',
  domainKey: 'iot',
  emoji: '🌬️', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Finds the compressed-air leaks that silently waste a huge share of a factory\'s energy — by watching pressure decay when nothing should be running, and listening for the ultrasonic hiss of escaping air.',

  overview: [
    'Compressed air is often called the "fourth utility", and it is one of the most expensive forms of energy in a factory — most of the electricity a compressor consumes ends up as heat, so every cubic metre of compressed air is dear. The dirty secret is that a large fraction of it — commonly 20-30% — leaks away through worn fittings, cracked hoses and stuck drains, wasting money continuously, day and night, for years, because a leak makes no obvious sign on the production floor. This project builds a monitor that finds that waste: it detects when the system is leaking, quantifies how much, and helps locate leaks so they can be fixed — turning an invisible, permanent energy drain into a fixable, measurable problem.',
    'It attacks the problem two complementary ways. The <b>system-level</b> method watches the receiver <b>pressure during no-demand periods</b> — nights, weekends, breaks — when, with all tools off, a sealed system should hold pressure. If it does not, the <b>rate of pressure decay</b> reveals the total leakage, and the frequency with which the compressor kicks in to top up an idle system (the "load/unload" cycling with no demand) directly quantifies the leak load and its energy cost. This needs only a pressure sensor on the receiver and knowledge of the demand schedule, and it gives the headline number: how much air, and money, is leaking.',
    'The <b>local</b> method helps find <i>where</i>: escaping compressed air generates a characteristic <b>ultrasonic hiss</b> (turbulent flow radiates strongly above human hearing), so an ultrasonic microphone can detect a leak by ear that is silent to a person, pointing a technician to the exact fitting. Combined, the system-level monitor says "you are leaking X and it is costing Y", and the ultrasonic aid helps hunt the leaks down. The monitor logs and trends the leakage so a growing leak load is caught and the savings from repairs are verified. It is honest that quantification depends on the compressor/system specifics and that ultrasonic hunting is an aid, not magic — but as a leak monitor that makes an invisible, expensive waste visible and actionable, it typically pays for itself many times over in the energy it recovers.',
  ],
  does: [
    'Detects compressed-air leaks at the system level via pressure decay in no-demand periods',
    'Quantifies leakage from pressure-decay rate and no-demand compressor cycling',
    'Estimates the energy and money cost of the leak load',
    'Detects/locates leaks acoustically via ultrasonic hiss',
    'Logs and trends leakage so a growing leak load is caught',
    'Verifies the savings from leak repairs',
    'Turns invisible, permanent air waste into a measurable, fixable problem',
  ],
  features: [
    'No-demand pressure-decay leak detection (system level)',
    'Leakage and cost quantification from decay/cycling',
    'Ultrasonic leak location (hear the silent hiss)',
    'Trending to catch a worsening leak load',
    'Repair savings verification',
    'Compressor-cycling energy insight',
    'Honest quantification tied to system specifics',
  ],
  applications: [
    { t: 'Factory compressed-air systems', d: 'Quantifying and finding leaks that waste a large share of compressor energy.' },
    { t: 'Energy / sustainability programmes', d: 'Measuring and recovering compressed-air waste as a high-ROI efficiency win.' },
    { t: 'Maintenance leak surveys', d: 'Ultrasonic-assisted leak hunting and repair verification.' },
    { t: 'Multi-site compressed air', d: 'Comparing leak load across plants and prioritising fixes.' },
  ],
  skills: [
    'Pressure sensing on a compressed-air receiver',
    'No-demand pressure-decay analysis and leakage quantification',
    'Ultrasonic acoustic leak detection',
    'Compressor-cycling and energy-cost estimation',
    'Trending and repair verification',
  ],
  prereq: [
    'Compressed air is expensive energy; even small leaks waste money continuously — quantify to justify fixes.',
    'The cleanest system-level signal is pressure decay (or compressor cycling) during no-demand periods; you need the demand schedule.',
    'Leaks hiss ultrasonically; an ultrasonic mic locates leaks silent to the ear — but treat it as a hunting aid.',
    'Work safely around pressurised systems; never aim ultrasonic/leak searches in a way that risks air-jet injury.',
  ],

  parts: ['esp32', 'inmp441', 'ds18b20', 'oled', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Pressure sensor on the receiver', spec: 'Pressure transducer (e.g. 0-16 bar, 4-20 mA/analogue) on the air receiver/main', qty: 1, price: 1200, note: 'The core system-level sensor' },
    { name: 'Ultrasonic leak detector mic', spec: 'Ultrasonic microphone/parabola (~40 kHz) for acoustic leak location', qty: 1, price: 1500, note: 'INMP441 has limited ultrasonic range; a dedicated ultrasonic sensor is better' },
    { name: 'Compressor state input', spec: 'Signal/CT to detect compressor load/unload cycles', qty: 1, price: 400 },
    { name: 'Enclosure', spec: 'Industrial housing near the receiver', qty: 1, price: 350 },
  ],
  cost: '₹3,500 – ₹6,000',
  libs: ['wifi', 'pubsub', 'ssd1306', 'influx', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Pressure transducer', devPin: '4-20mA/AOUT', pin: 'GPIO 34 (ADC)', sig: 'Receiver pressure' },
      { dev: 'Ultrasonic mic', devPin: 'AOUT/I²S', pin: 'GPIO 35 / I²S', sig: 'Leak hiss (ultrasonic)' },
      { dev: 'Compressor state', devPin: 'in/CT', pin: 'GPIO 27', sig: 'Load/unload cycles' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Pressure/leak readout' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard' },
      { dev: 'microSD', devPin: 'SPI', pin: 'shared + CS', sig: 'Log/trend' },
      { dev: '5V supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Fit the pressure transducer on the receiver/main to read system pressure; this is the core system-level sensor.',
    'Add a compressor-state input (or CT) to count load/unload cycles, which quantify no-demand leakage.',
    'For acoustic location, use a dedicated ultrasonic sensor (~40 kHz) — an audio MEMS mic has limited ultrasonic range.',
    'Know the plant\'s demand schedule so the monitor can analyse pressure decay during genuine no-demand periods.',
    'Work safely around pressurised lines; do not create injury hazards during leak hunting.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Pressure', sub: 'receiver decay', highlight: true },
      { name: 'Compressor state', sub: 'load/unload' },
      { name: 'Ultrasonic', sub: 'leak hiss' },
    ] },
    { label: 'Analyse', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'decay + cycling' },
      { name: 'Quantify', sub: 'air + cost' },
    ] },
    { label: 'Locate', edge: 'right', blocks: [
      { name: 'Ultrasonic aid', sub: 'find the leak' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'leak trend' },
      { name: 'Savings', sub: 'verify repairs' },
    ] },
  ] },
  flow: [
    { t: 'Monitor pressure + compressor', k: 'start' },
    { t: 'No-demand period?', k: 'dec', yes: 'Measure decay / no-demand cycling', no: 'Log; continue' },
    { t: 'Measure decay / no-demand cycling', k: 'proc' },
    { t: 'Leakage above target?', k: 'dec', yes: 'Quantify cost; alert; assist location', no: 'Trend' },
    { t: 'Quantify cost; alert; assist location', k: 'io' },
    { t: 'Log; continue', k: 'io' },
    { t: 'Trend', k: 'proc' },
    { t: 'Report; verify repairs', k: 'end', back: 'Monitor pressure + compressor' },
  ],

  principle: [
    'Compressed air deserves special attention because it is <b>expensive energy that leaks invisibly</b>. A compressor is an inefficient converter — most of the electrical energy it draws becomes waste heat, so the usable compressed air is costly per unit — and leaks bleed that costly air away continuously, unseen and unheard, through fittings and hoses across a plant. Because a leak produces no visible effect on production and often no audible sound to human ears, it can waste energy for years unnoticed. The monitor\'s job is to make this waste <b>visible and quantified</b>, because a leak you can measure and cost is a leak that gets fixed, while an invisible one is tolerated forever.',
    'The most reliable <b>system-level</b> signal is what happens during <b>no demand</b>. When every tool and machine is off — overnight, at weekends, during a break — a leak-free system, once charged, should hold its pressure indefinitely; the compressor should not need to run at all. A real system does not: its pressure <b>decays</b>, and the compressor periodically <b>cycles</b> (loads and unloads) just to keep the idle system topped up. Both are pure leakage. The <b>rate of pressure decay</b> in a known system volume gives the leak flow directly, and the fraction of no-demand time the compressor spends loaded (or the number of load cycles per hour with no demand) quantifies the leak load as a share of compressor capacity — which converts straight into wasted energy and money using the compressor\'s power. This is the headline the monitor delivers: not "there are leaks" but "you are leaking X m³/h, costing ₹Y per year".',
    'Finding <i>where</i> the leaks are is the complementary <b>local</b> problem, and physics helps: air escaping through a small orifice becomes turbulent and radiates strongly in the <b>ultrasonic</b> range, well above human hearing. An ultrasonic detector "hears" this hiss and, especially with a directional/parabolic pickup, points a technician straight to a leak that is completely silent to the ear. This turns leak hunting from a hopeless walk-around into a directed search. The monitor can use ultrasonic sensing to flag and help localise leaks, though it is honest that ultrasonic hunting is a skilled aid — reflections and background ultrasonic noise exist — rather than an automatic map.',
    'What ties it together is <b>trending and verification</b>. Logging the quantified leak load over time catches a <b>worsening</b> system (leaks grow, new ones appear) before the bill balloons, and — crucially — lets you <b>verify repairs</b>: fix a batch of leaks and the no-demand decay slows, the no-demand cycling drops, and the monitor shows the recovered air and money, proving the maintenance paid off and justifying the next round. The design is candid about its dependencies: quantification needs the compressor and system specifics (capacity, power, volume) to convert decay/cycling into real energy, and precise leak location is a technician-assisted process. But within that, it does something with unusually high ROI — it exposes and measures one of the largest, most ignored energy wastes in a factory, and turns it into a prioritised, verifiable repair list. Compressed-air leak repair is famously one of the cheapest energy savings available; this monitor is what makes a plant actually go and get it.',
  ],
  equations: [
    { t: 'Leakage from no-demand pressure decay', eq: 'Sealed system volume V, pressure falls p1→p2 in time t\nwith no demand (isothermal approx):\n\n  leaked_free_air ≈ V·(p1 − p2)/p_atm\n  leak_flow ≈ leaked_free_air / t   (free air / time)\n\nA faster decay = a larger leak. Needs the system volume.' },
    { t: 'Leakage from no-demand compressor cycling', eq: 'With no demand, all compressor output serves leaks:\n\n  leak_fraction = loaded_time / total_time (no-demand)\n  leak_flow ≈ leak_fraction · compressor_capacity\n\n  wasted_power ≈ leak_fraction · compressor_power\n  annual_cost ≈ wasted_power · hours · tariff' },
    { t: 'Ultrasonic leak signature', eq: 'Turbulent flow through a leak radiates ultrasound (~20–50 kHz):\n\n  ultrasonic level rises sharply near a leak\n  directional pickup → localise the leak\n\nSilent to the ear, loud in ultrasound → detectable/locatable.' },
  ],

  assembly: [
    { h: 'Fit the pressure and compressor sensing', p: [
      'Install the pressure transducer on the receiver/main and a compressor-state input (or CT). Establish the system volume and the compressor\'s capacity/power for quantification.',
    ] },
    { h: 'Add ultrasonic leak detection', p: [
      'Add a dedicated ultrasonic sensor (directional if possible) for acoustic leak location, and learn the background ultrasonic level so a real leak stands out.',
    ] },
    { h: 'Set up analysis and reporting', p: [
      'Configure the no-demand schedule, decay/cycling analysis, cost model, and dashboard/logging for trending and repair verification.',
    ], warn: 'Work safely around pressurised lines; a compressed-air jet can cause serious injury. Keep leak searches safe.' },
  ],
  steps: [
    { h: 'Quantify leakage in no-demand periods', p: [
      'During genuine no-demand periods, measure the pressure decay rate (and/or no-demand compressor cycling), convert to leak flow, and estimate the energy and money cost.',
    ], code: {
      file: 'leak-quantify.ino', lang: 'cpp',
      body: `// System-level leak quantification during a no-demand period.
struct System { float volume_m3; float compCapacity_m3min; float compPower_kW; };

// From pressure decay p1->p2 over t seconds (no demand).
float leakFlowFromDecay(float p1_bar, float p2_bar, float t_s,
                        const System &s) {
  float freeAirLost = s.volume_m3 * (p1_bar - p2_bar);   // ~ m3 free air
  return (freeAirLost / (t_s/60.0f));                    // m3/min
}

// From no-demand compressor loaded fraction.
float leakFlowFromCycling(float loadedFraction, const System &s) {
  return loadedFraction * s.compCapacity_m3min;          // m3/min
}

float annualLeakCost(float loadedFraction, const System &s,
                     float hoursPerYear, float tariff) {
  float wastedKW = loadedFraction * s.compPower_kW;
  return wastedKW * hoursPerYear * tariff;               // currency/year
}`,
      explain: [
        { ref: 'float freeAirLost = s.volume_m3 * (p1_bar - p2_bar)', txt: 'The pressure drop in the known system volume during no demand gives the free air lost, and dividing by time gives the leak flow.' },
        { ref: 'return loadedFraction * s.compCapacity_m3min', txt: 'During no demand, the fraction of time the compressor runs loaded times its capacity is the leak flow — a second, independent quantification.' },
        { ref: 'float wastedKW = loadedFraction * s.compPower_kW', txt: 'That same loaded fraction times the compressor power is the wasted electrical power feeding the leaks.' },
        { ref: 'return wastedKW * hoursPerYear * tariff', txt: 'Multiplying by run hours and tariff turns the leak into an annual cost — the number that justifies the repair.' },
      ],
    } },
    { h: 'Detect/locate acoustically and trend', p: [
      'Use ultrasonic level to flag leaks and assist location, trend the quantified leak load over time, and verify repairs by the drop in decay/cycling.',
    ], tip: 'Log the no-demand leak metric each night; a rising trend means new/growing leaks, and a step down after maintenance proves (and quantifies) the fix.' },
  ],

  code: [{
    file: 'compressed-air-leak-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Compressed Air Leak Monitor — ESP32

   Quantifies compressed-air leakage from no-demand pressure decay and
   compressor cycling, estimates energy cost, flags/locates leaks
   ultrasonically, and trends leakage to verify repairs.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>

#define PIN_PRESSURE 34
#define PIN_ULTRA    35
#define PIN_COMP     27       // compressor loaded (HIGH)
#define PMAX_BAR     16.0f
#define VOLUME_M3    2.0f
#define COMP_CAP_M3MIN 5.0f
#define COMP_KW      37.0f
#define TARIFF       8.0f     // currency per kWh
#define HOURS_YEAR   8000.0f

Adafruit_SSD1306 oled(128,64,&Wire);
Preferences prefs; WiFiClient net; PubSubClient mqtt(net);

float readPressure(){ return analogRead(PIN_PRESSURE)/4095.0f * PMAX_BAR; }
float ultrasonicLevel(){ return analogRead(PIN_ULTRA)/4095.0f; }

// Track compressor loaded fraction during a no-demand window.
uint32_t noDemandStart=0, loadedMs=0; float p1=0; bool inNoDemand=false;

void startNoDemand(){ inNoDemand=true; noDemandStart=millis(); loadedMs=0; p1=readPressure(); }

void endNoDemand(){
  inNoDemand=false;
  uint32_t total = millis()-noDemandStart;
  float loadedFrac = total? (float)loadedMs/total : 0;
  float p2 = readPressure();
  float decayFlow = VOLUME_M3*(p1-p2) / ((total/1000.0f)/60.0f);  // m3/min
  float cycleFlow = loadedFrac * COMP_CAP_M3MIN;                   // m3/min
  float wastedKW  = loadedFrac * COMP_KW;
  float annualCost= wastedKW * HOURS_YEAR * TARIFF;

  char m[240];
  snprintf(m,sizeof m,
    "{\\"leak_decay_m3min\\":%.2f,\\"leak_cycle_m3min\\":%.2f,"
    "\\"wasted_kW\\":%.1f,\\"annual_cost\\":%.0f}",
    decayFlow, cycleFlow, wastedKW, annualCost);
  mqtt.publish("air/leak/summary", m);       // trend + verify repairs
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_COMP, INPUT);
  Wire.begin(21,22); oled.begin(SSD1306_SWITCHCAPVCC,0x3C);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("air-1");
  mqtt.loop();

  bool noDemand = isNoDemandPeriod();          // from schedule
  if (noDemand && !inNoDemand) startNoDemand();
  if (!noDemand && inNoDemand) endNoDemand();

  if (inNoDemand && digitalRead(PIN_COMP)==HIGH) loadedMs += 200;  // loaded time

  float ultra = ultrasonicLevel();
  if (ultra > ULTRA_LEAK_THRESH)                // near a leak
    mqtt.publish("air/leak/acoustic", "ultrasonic leak nearby");

  float p = readPressure();
  oled.clearDisplay(); oled.setCursor(0,0);
  oled.printf("P: %.1f bar\\nUltra: %.2f\\n%s", p, ultra,
              inNoDemand?"NO-DEMAND":"running");
  oled.display();

  delay(200);
}`,
    explain: [
      { ref: 'void startNoDemand()', txt: 'When a no-demand period begins, the monitor records the starting pressure and begins timing how long the compressor runs loaded — the two independent leakage measures.' },
      { ref: 'float decayFlow = VOLUME_M3*(p1-p2) / ((total/1000.0f)/60.0f)', txt: 'The pressure decay over the no-demand window gives the leak flow directly from the system volume.' },
      { ref: 'float cycleFlow = loadedFrac * COMP_CAP_M3MIN', txt: 'Independently, the fraction of no-demand time the compressor ran loaded times its capacity gives the leak flow — cross-checking the decay figure.' },
      { ref: 'float annualCost= wastedKW * HOURS_YEAR * TARIFF', txt: 'The wasted power is turned into an annual cost, the number that turns "there are leaks" into a justified repair budget.' },
      { ref: 'if (ultra > ULTRA_LEAK_THRESH)', txt: 'A high ultrasonic level flags a nearby leak — the acoustic aid that helps a technician find the exact fitting silent to the ear.' },
    ],
  }],

  config: [
    'Set the system volume, compressor capacity/power, tariff and run hours for quantification.',
    'Configure the no-demand schedule and the pressure/compressor/ultrasonic inputs.',
    'Set leak targets and the ultrasonic threshold.',
    'Configure trending/logging and repair-verification reporting.',
  ],
  calibration: [
    { h: 'Pressure', p: [
      'Verify the pressure reading against a reference gauge; confirm the transducer range/scaling.',
    ] },
    { h: 'Quantification', p: [
      'Confirm the system volume and compressor figures so decay/cycling convert to realistic leak flow and cost; cross-check the two methods.',
    ] },
    { h: 'Ultrasonic', p: [
      'Learn the background ultrasonic level and set the threshold so a real leak stands out; test on a known small leak.',
    ] },
  ],
  testing: [
    { step: 'Run a no-demand period on a sealed system', expect: 'Slow decay / minimal cycling — low leakage' },
    { step: 'Introduce a known leak', expect: 'Faster decay / more cycling; leak flow and cost quantified' },
    { step: 'Bring an ultrasonic source near the sensor', expect: 'Ultrasonic level rises; leak-nearby flag' },
    { step: 'Trend over nights', expect: 'A worsening leak load shows as a rising trend' },
    { step: 'Repair leaks and re-measure', expect: 'Decay/cycling drop; recovered air/cost quantified' },
    { step: 'Cross-check decay vs cycling', expect: 'The two leak-flow estimates broadly agree' },
  ],
  output: [
    'The dashboard shows current pressure, the quantified no-demand leak flow and its annual cost, an ultrasonic leak indicator, and a leak-load trend with repair markers.',
    { file: 'air-leak.json', lang: 'json', body: `{
  "leak_decay_m3min": 0.9,
  "leak_cycle_m3min": 0.95,
  "wasted_kW": 7.0,
  "annual_cost": 448000
}` },
    'The two methods agree on ~0.9 m³/min of leakage, ~7 kW of wasted power costing ~₹4.5 lakh/year — an invisible waste made visible and costed; after repairs these numbers drop, proving the saving.',
  ],
  troubleshoot: [
    { sym: 'Leak flow numbers unrealistic', cause: 'Wrong system volume/compressor figures', fix: 'Verify V, capacity and power; cross-check decay vs cycling' },
    { sym: 'No clear no-demand signal', cause: 'Demand schedule wrong / genuine demand overnight', fix: 'Confirm real no-demand periods; use compressor cycling if pressure is held by demand' },
    { sym: 'Ultrasonic false/no detection', cause: 'Wrong sensor range or background noise', fix: 'Use a dedicated ultrasonic sensor; learn background; use directional pickup' },
    { sym: 'Can\'t verify repairs', cause: 'No trend/baseline', fix: 'Log the no-demand leak metric before and after; compare' },
    { sym: 'Safety concern', cause: 'Unsafe leak hunting near pressurised lines', fix: 'Follow pressurised-system safety; avoid air-jet injury' },
  ],

  iot: {
    protoShort: 'Wi-Fi → energy/maintenance dashboard',
    net: {
      nodes: [{ name: 'Air monitor', sub: 'ESP32' }, { name: 'Other systems', sub: 'per-compressor' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to server',
      uplink: 'MQTT/HTTP', cloud: 'Dashboard/CMMS', cloudSub: 'leak load + cost',
      clients: [{ name: 'Energy', sub: 'leak trend/cost' }, { name: 'Maintenance', sub: 'find/fix' }],
    },
    protocol: ['No-demand leak summaries (flow, wasted power, cost) publish per period; acoustic leak flags publish on detection. Trends drive repair prioritisation and verification.'],
    topics: [
      { t: 'air/leak/summary', dir: 'node → dashboard', payload: 'leak flow (decay+cycle), wasted kW, cost' },
      { t: 'air/leak/acoustic', dir: 'node → maintenance', payload: 'ultrasonic leak nearby' },
      { t: 'air/system/status', dir: 'node → ops', payload: 'pressure, compressor cycling' },
    ],
    cloud: ['A dashboard/CMMS trends the leak load and cost, prioritises repairs, and verifies savings after maintenance; acoustic flags aid leak hunting.'],
    dashboard: ['Pressure and no-demand leak-load trend with cost, an ultrasonic leak indicator, and repair-verification comparisons.'],
    mobile: ['Alerts on a rising leak load and acoustic leak detections; savings summaries after repairs.'],
    security: [
      'Authenticate nodes; secure the energy data.',
      'Keep quantification inputs (system/compressor specs) accurate for trustworthy cost figures.',
      'Alert on monitor silence.',
    ],
  },

  perf: [
    'Sample pressure/compressor at a modest rate; analyse over no-demand windows.',
    'Cross-check decay and cycling estimates for confidence.',
    'Trend the nightly leak metric to catch worsening leaks and verify repairs.',
    'Handle ultrasonic detection separately as a location aid.',
  ],
  safety: [
    'Work safely around pressurised systems — a compressed-air jet can cause serious injury; keep leak hunting safe.',
    'Quantification depends on correct compressor/system specifics; label figures as estimates where inputs are uncertain.',
    'Ultrasonic leak location is a skilled aid, not an automatic map.',
    'Coordinate with maintenance/energy teams; do not interfere with compressor control.',
  ],
  maintenance: [
    'Verify pressure calibration and quantification inputs periodically.',
    'Re-learn the ultrasonic background as the environment changes.',
    'Repair flagged leaks and log the verified savings.',
    'Trend the leak load and act before it grows.',
  ],
  future: [
    'Add flow metering for direct leak measurement.',
    'Add multiple ultrasonic sensors / a scanning aid for faster location.',
    'Model demand to separate leaks from process use during production.',
    'Integrate with the CMMS to raise and track leak-repair work orders.',
  ],
  faq: [
    { q: 'Why care about compressed-air leaks?', a: 'Compressed air is expensive energy, and leaks commonly waste 20-30% of it continuously and invisibly. Finding and fixing them is one of the highest-ROI energy savings a factory can make.' },
    { q: 'How does it quantify the leak without a flow meter?', a: 'During no-demand periods a leak-free system should hold pressure with the compressor off. The rate of pressure decay in the known system volume, and the no-demand compressor cycling, both give the leak flow — and thus the wasted power and cost.' },
    { q: 'How does it help find the leaks?', a: 'Escaping air hisses ultrasonically, above human hearing. An ultrasonic detector, especially a directional one, points a technician to a leak that is completely silent to the ear.' },
    { q: 'How do I prove a repair worked?', a: 'Re-measure the no-demand leak metric after fixing leaks. The decay slows and cycling drops, and the monitor quantifies the recovered air and money — verifying and justifying the maintenance.' },
    { q: 'What do I need for accurate cost figures?', a: 'The system volume and the compressor\'s capacity and power (plus tariff and run hours). These convert the measured leakage into real energy and money; get them right for trustworthy numbers.' },
  ],
  refs: [
    { t: 'Compressed air energy efficiency and leaks', u: 'https://www.energy.gov/eere/amo/compressed-air-systems', s: 'US DOE' },
    { t: 'Ultrasonic leak detection', u: 'https://en.wikipedia.org/wiki/Ultrasonic_testing', s: 'Reference' },
    { t: 'Compressed air systems — overview', u: 'https://en.wikipedia.org/wiki/Compressed_air', s: 'Reference' },
    { t: 'Compressor load/unload control', u: 'https://en.wikipedia.org/wiki/Air_compressor', s: 'Reference' },
    { t: 'Pressure decay leak testing', u: 'https://en.wikipedia.org/wiki/Leak_testing', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'grafana'],
  imageCaptions: [
    'Compressed-air leaks waste a large, invisible share of a factory\'s energy — the monitor makes it visible.',
    'ESP32 module quantifying leakage from no-demand pressure decay and compressor cycling.',
    'A dashboard costs the leak load and verifies the savings once leaks are repaired.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   067 — Worker Safety Wearable
   ══════════════════════════════════════════════════════════════════ */
{
  id: '067',
  domainKey: 'iot',
  emoji: '🦺', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A wearable that watches for the two things that kill plant workers — toxic gas and a man-down fall — and raises a located, acknowledged alarm to a control room in seconds.',

  overview: [
    'Two hazards account for a grim share of industrial fatalities, and both are ones a person often cannot save themselves from. <b>Toxic or oxygen-deficient atmospheres</b> — hydrogen sulphide in a sewer, carbon monoxide in a boiler room, oxygen displaced in a tank — can incapacitate a worker in seconds, before they even realise, and a rescuer who rushes in unprotected becomes the next casualty. A <b>man-down</b> event — a fall, a collapse, an incapacitation — leaves a worker unable to call for help, and if they are alone or unseen, minutes of delay can be fatal. This wearable watches for both continuously and, when it detects danger, raises a <b>located, acknowledged alarm</b> to a control room fast enough to matter.',
    'It carries a <b>gas sensor</b> (or several) for the specific hazards of the workplace — H₂S, CO, combustible gas, low oxygen — alarming the moment concentration crosses a danger threshold, both to the worker (loud/vibrating) and to the control room. It carries an <b>accelerometer</b> that recognises the signatures of a <b>man-down</b> event: the impact and sudden stillness of a fall, or prolonged no-motion suggesting incapacitation, with a pre-alarm the worker can cancel if they are fine (to reduce false alarms). And it carries a <b>manual panic button</b> for any other emergency. Every alarm goes out <b>located</b> (who, and where) and is <b>acknowledged</b> by the control room so the worker knows help is coming and the system knows a human is responding.',
    'Being a life-safety device for the two hazards above, its design is dominated by <b>reliability and honest limits</b>. It runs a full shift on battery with battery supervision, uses a communication path with coverage across the plant (LoRa/mesh, sometimes cellular), and — this must be stated plainly — a DIY wearable is <b>not</b> a certified gas detector or a substitute for the intrinsically-safe, calibrated, professionally-certified safety equipment that hazardous industrial work legally requires. Real gas detection in explosive/toxic atmospheres demands certified instruments; this project is an educational build and, at most, a supplementary awareness layer. Within that honest frame, though, it embodies the right architecture: sense the killers, alarm the worker and a control room instantly, locate and acknowledge, and never pretend a hobby device replaces the certified gear that lives are actually trusted to.',
  ],
  does: [
    'Monitors for toxic/combustible gas and low oxygen (workplace-specific)',
    'Detects man-down events (fall impact + stillness, or prolonged no-motion)',
    'Provides a manual panic button for any emergency',
    'Alarms the worker (loud/vibrate) and a control room instantly',
    'Sends located, acknowledged alerts (who + where)',
    'Runs a full shift on supervised battery with plant-wide comms',
    'Is explicit that it is not a certified safety device',
  ],
  features: [
    'Gas + man-down + panic — the core worker-safety triggers',
    'Fall/incapacitation detection with a cancellable pre-alarm',
    'Located, acknowledged control-room alarms',
    'Worker + control-room dual alerting',
    'Shift battery life with supervision',
    'Plant-wide resilient comms',
    'Honest: supplementary/educational, NOT certified safety equipment',
  ],
  applications: [
    { t: 'Confined-space / lone workers (educational)', d: 'Awareness of gas and man-down events for workers who may be alone or unseen — alongside certified equipment.' },
    { t: 'Plant / process areas', d: 'Supplementary gas and fall alerting routed to a control room with location.' },
    { t: 'Utilities / sewers / tanks', d: 'Demonstrating the sensing and alarm architecture for toxic-atmosphere and fall hazards.' },
    { t: 'Safety-tech education', d: 'Teaching man-down detection, gas alarming and located, acknowledged alerting.' },
  ],
  skills: [
    'Gas sensing and danger-threshold alarming',
    'Man-down/fall detection from accelerometer signatures',
    'Located, acknowledged alerting and pre-alarm cancellation',
    'Wearable battery life and supervision',
    'Resilient plant-wide comms',
  ],
  prereq: [
    'THIS IS EDUCATIONAL/SUPPLEMENTARY — not a certified, calibrated, intrinsically-safe gas detector. Hazardous work legally requires certified safety equipment; never rely on this for life safety.',
    'Alarm both the worker and a control room, located and acknowledged — a silent or unlocated alarm fails when it matters.',
    'Reduce false man-down alarms with a cancellable pre-alarm, or workers will disable it.',
    'Provide shift battery life with supervision and resilient comms; a dead wearable is a silent risk.',
  ],

  parts: ['esp32', 'mq2', 'mq135', 'co', 'mpu6050', 'buzzer', 'lora', 'li18650'],
  extraParts: [
    { name: 'Gas sensor(s) for the hazard', spec: 'H₂S/CO/combustible/O₂ sensors appropriate to the workplace (educational-grade)', qty: 1, price: 900, note: 'Real safety needs certified, calibrated, IS-rated detectors' },
    { name: 'Vibration motor + loud buzzer', spec: 'Haptic + audible worker alarm', qty: 1, price: 200 },
    { name: 'Wearable enclosure + battery', spec: 'Comfortable, rugged, shift-life battery with supervision', qty: 1, price: 500 },
    { name: 'Control-room gateway/console', spec: 'LoRa/mesh gateway + console for located, acknowledged alarms', qty: 1, price: 2500 },
  ],
  cost: '₹3,500 – ₹6,000 per wearable',
  libs: ['wifi', 'mpu', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'Gas sensor(s)', devPin: 'AOUT', pin: 'GPIO 34/35', sig: 'Toxic/combustible/O₂' },
      { dev: 'MPU-6050', devPin: 'SDA/SCL/INT', pin: 'GPIO 21/22/27', sig: 'Man-down (fall/stillness)' },
      { dev: 'Panic button', devPin: 'NO', pin: 'GPIO 26', sig: 'Manual SOS' },
    ],
    right: [
      { dev: 'Buzzer + vibrator', devPin: 'IN', pin: 'GPIO 13/14', sig: 'Worker alarm' },
      { dev: 'LoRa/mesh', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Located alert to control room' },
      { dev: 'Battery sense', devPin: 'ADC', pin: 'GPIO 32', sig: 'Supervision' },
      { dev: 'Charger', devPin: 'OUT', pin: '3V3 reg', sig: 'Shift power' },
    ],
  },
  wiringNotes: [
    'Use gas sensors appropriate to the workplace hazard; understand these are educational-grade, not certified detectors.',
    'Mount the accelerometer firmly on the body so fall/stillness signatures are faithful.',
    'Provide both loud audible and haptic (vibration) worker alarms so it is felt in noise/PPE.',
    'Power for a full shift with battery supervision, and use a comms path with plant-wide coverage (LoRa/mesh; cellular where needed).',
    'Keep the panic button easy to press but guarded against accidental activation.',
  ],

  block: { columns: [
    { label: 'Sense danger', edge: 'right', blocks: [
      { name: 'Gas', sub: 'toxic/O₂', highlight: true },
      { name: 'Man-down', sub: 'fall/stillness' },
      { name: 'Panic', sub: 'manual SOS' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'thresholds + pre-alarm' },
    ] },
    { label: 'Alarm', edge: 'right', blocks: [
      { name: 'Worker', sub: 'loud + vibrate' },
      { name: 'Control room', sub: 'located + ack' },
    ] },
    { label: 'Assure', edge: 'none', blocks: [
      { name: 'Supervision', sub: 'battery/link' },
    ] },
  ] },
  flow: [
    { t: 'Monitor gas + motion; supervise', k: 'start' },
    { t: 'Gas over danger, fall, or panic?', k: 'dec', yes: 'Worker alarm + located alert', no: 'Heartbeat' },
    { t: 'Man-down: pre-alarm (cancellable)?', k: 'dec', yes: 'Cancelled → resume', no: 'Escalate man-down' },
    { t: 'Worker alarm + located alert', k: 'io' },
    { t: 'Escalate man-down', k: 'io' },
    { t: 'Control-room ack → confirm to worker', k: 'io' },
    { t: 'Heartbeat', k: 'proc' },
    { t: 'Continue', k: 'end', back: 'Monitor gas + motion; supervise' },
  ],

  principle: [
    'This wearable is a <b>life-safety device targeted at two specific killers</b>, and life-safety design means everything is optimised for the rare, adverse moment of use, with brutal honesty about limits. The two hazards are chosen because they share a lethal property: the victim often <b>cannot save themselves</b>. A toxic or oxygen-deficient atmosphere can incapacitate before the worker even perceives danger — and, notoriously, lures would-be rescuers to their deaths — so it must be detected by an instrument, not by human senses. A man-down event leaves the worker unable to call for help, so the device must call on their behalf. The wearable\'s whole reason to exist is to sense these, alarm instantly, and get a located, acknowledged call to people who can respond.',
    '<b>Gas detection</b> alarms on concentration crossing a danger threshold for the specific hazard — a toxic gas rising past its exposure limit, oxygen falling below safe, combustible gas approaching its explosive limit. The response is immediate and dual: the <b>worker</b> is alerted loudly and by vibration (because in plant noise and PPE, sound alone may not reach them) so they can evacuate or don protection, and the <b>control room</b> is alerted simultaneously so help and rescue (properly equipped) can be organised. The device must be candid that its educational-grade sensors are <i>not</i> the certified, calibrated, intrinsically-safe detectors that hazardous work legally mandates — so its gas function is, at most, a supplementary awareness layer, never the primary protection lives are trusted to.',
    '<b>Man-down detection</b> reads the accelerometer for the signatures of incapacitation. A <b>fall</b> shows as a characteristic sequence — often a brief free-fall or lurch, a sharp impact, then abnormal <b>stillness</b> — and prolonged <b>no-motion</b> (a worker who has not moved for an unusual period) suggests collapse. The design must balance sensitivity against <b>false alarms</b>, because a wearable that cries wolf gets taken off, so a detected man-down triggers a <b>cancellable pre-alarm</b>: the device warns the worker (buzz/vibrate) and, if they are fine, they cancel it within a few seconds; only if they do not cancel does it escalate to a full located alarm. This "confirm before escalate" pattern keeps false alarms tolerable while still catching a genuinely incapacitated worker who cannot cancel. A <b>manual panic button</b> covers every other emergency the sensors do not.',
    'Because it is trusted (even supplementarily) for safety, the wearable lives or dies on <b>reliability, location, acknowledgement and supervision</b>. Alarms carry the worker\'s identity and <b>location</b> so responders go straight to them — vital in a large plant. They are <b>acknowledged</b> end-to-end so the worker knows help is coming and the control room confirms it is handling the event. The device runs a full <b>shift on battery</b> with battery <b>supervision</b>, over comms with <b>plant-wide coverage</b>, and heartbeats its health so a dead or low wearable is flagged before an incident — because a silently failed safety device is worse than none. Above all, the design is <b>emphatically honest</b>: a homebrew wearable, however well-architected, is not a certified gas detector or a replacement for the intrinsically-safe, calibrated, professionally-certified safety equipment that industrial hazardous work requires by law. It is an educational realisation of the right ideas — sense the killers, alarm the worker and a control room instantly, locate and acknowledge, supervise relentlessly — and it must never be presented, or relied upon, as the real thing.',
  ],
  equations: [
    { t: 'Gas danger alarm', eq: 'For each gas, alarm on crossing its danger threshold:\n\n  toxic  : conc > exposure_limit (e.g. ppm)\n  O2     : O2 < safe_min (e.g. 19.5%)  OR > safe_max\n  LEL    : combustible > %LEL_alarm (with margin)\n\nAlarm worker (loud+vibrate) AND control room, immediately.' },
    { t: 'Man-down detection', eq: 'From accelerometer magnitude a and orientation:\n  free-fall : a ≈ 0 briefly\n  impact    : a spike (high g)\n  stillness : low motion sustained after impact\n  no-motion : |a − 1g| < ε for > T_still (collapse)\n\n  man_down = (impact THEN stillness) OR prolonged no-motion' },
    { t: 'Pre-alarm + escalate', eq: 'On man_down:\n  pre-alarm the worker for T_cancel seconds\n  if worker cancels -> resume (false alarm avoided)\n  else -> escalate: located, acknowledged control-room alarm\n\nReduces false alarms while catching real incapacitation.' },
  ],

  assembly: [
    { h: 'Build a reliable, comfortable wearable', p: [
      'Assemble the gas sensor(s), a firmly-mounted accelerometer, loud + haptic alarms, and a guarded panic button in a comfortable, rugged enclosure with shift battery life and supervision.',
    ], warn: 'Use certified, calibrated, intrinsically-safe gas detectors for real hazardous work. This build is educational/supplementary and must never be relied upon as the primary life-safety device.' },
    { h: 'Set up located, acknowledged comms', p: [
      'Use a comms path with plant-wide coverage (LoRa/mesh; cellular where needed) so alarms reach a control-room console with the worker\'s location and are acknowledged back.',
    ] },
    { h: 'Configure detection and pre-alarm', p: [
      'Set gas danger thresholds for the workplace, man-down signatures, and the cancellable pre-alarm and escalation, plus heartbeat supervision.',
    ] },
  ],
  steps: [
    { h: 'Detect gas, man-down and panic', p: [
      'Alarm immediately on gas crossing a danger threshold or a panic press; on man-down, run a cancellable pre-alarm before escalating.',
    ], code: {
      file: 'safety-triggers.ino', lang: 'cpp',
      body: `#define T_STILL_MS  20000    // no-motion time suggesting collapse
#define T_CANCEL_MS  8000    // pre-alarm cancel window
uint32_t stillSince=0, preAlarmStart=0; bool preAlarm=false;

bool gasDanger(float toxic, float o2, float lel){
  return toxic > TOXIC_LIMIT || o2 < O2_MIN || lel > LEL_ALARM;
}

// Man-down: impact-then-stillness OR prolonged no-motion.
bool manDown(float aMag, uint32_t now){
  static bool impacted=false; static uint32_t impactAt=0;
  if (aMag > 3.0f){ impacted=true; impactAt=now; }          // impact spike
  bool still = fabsf(aMag - 1.0f) < 0.08f;                  // ~stationary (g)
  if (still){ if(!stillSince) stillSince=now; }
  else stillSince=0;
  bool afterImpact = impacted && (now-impactAt<30000) && stillSince
                     && (now-stillSince>3000);
  bool collapsed   = stillSince && (now-stillSince>T_STILL_MS);
  return afterImpact || collapsed;
}

// Cancellable pre-alarm before escalating a man-down.
bool escalateManDown(bool md, bool cancelled, uint32_t now){
  if (md && !preAlarm){ preAlarm=true; preAlarmStart=now; warnWorker(); }
  if (preAlarm && cancelled){ preAlarm=false; return false; }
  if (preAlarm && now-preAlarmStart>T_CANCEL_MS){ preAlarm=false; return true; }
  return false;
}`,
      explain: [
        { ref: 'return toxic > TOXIC_LIMIT || o2 < O2_MIN || lel > LEL_ALARM', txt: 'Any gas crossing its danger threshold — toxic high, oxygen low, combustible high — triggers an immediate alarm.' },
        { ref: 'bool afterImpact = impacted && ... && (now-stillSince>3000)', txt: 'A fall is recognised as an impact spike followed by abnormal stillness, the classic man-down signature.' },
        { ref: 'bool collapsed   = stillSince && (now-stillSince>T_STILL_MS)', txt: 'Prolonged no-motion catches a collapse without a sharp impact, e.g. a slow incapacitation.' },
        { ref: 'if (md && !preAlarm){ preAlarm=true; ... warnWorker(); }', txt: 'A detected man-down first warns the worker, giving them a chance to cancel if they are fine — the false-alarm control that keeps the device worn.' },
        { ref: 'if (preAlarm && now-preAlarmStart>T_CANCEL_MS){ preAlarm=false; return true; }', txt: 'Only if the worker does not cancel within the window does it escalate to a full located alarm — catching someone genuinely unable to respond.' },
      ],
    } },
    { h: 'Alarm, locate, acknowledge, supervise', p: [
      'On any trigger, alarm the worker (loud+vibrate) and send a located alert to the control room, retry until acknowledged, confirm to the worker, and heartbeat health continuously.',
    ], tip: 'Make the man-down pre-alarm impossible to miss (loud + strong vibration) so a conscious worker reliably cancels it — that is what keeps false alarms from destroying trust.' },
  ],

  code: [{
    file: 'worker-safety-wearable.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Worker Safety Wearable — ESP32 (EDUCATIONAL / SUPPLEMENTARY)

   Detects toxic/low-O2 gas and man-down (fall/stillness), plus a panic
   button; alarms the worker (loud+vibrate) and a control room with a
   located, acknowledged alert; supervises battery/link.
   NOT a certified, calibrated, intrinsically-safe safety device.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <MPU6050.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_TOXIC 34
#define PIN_O2    35
#define PIN_PANIC 26
#define PIN_BUZZER 13
#define PIN_VIBE  14
#define PIN_CANCEL 33
#define T_STILL_MS 20000
#define T_CANCEL_MS 8000
#define HEARTBEAT_MS 60000UL

MPU6050 imu; Preferences prefs;
const uint16_t WORKER_ID = 7;
const char *ZONE = "Boiler room";     // updated by location beacons in practice
uint32_t stillSince=0, preAlarmStart=0, lastBeat=0, seq=0;
bool preAlarm=false;

void workerAlarm(bool on){ digitalWrite(PIN_BUZZER,on); digitalWrite(PIN_VIBE,on); }

bool sendAlert(const char *type){
  for (int a=0; a<5; a++){
    LoRa.beginPacket();
    LoRa.printf("{\\"t\\":\\"%s\\",\\"id\\":%u,\\"zone\\":\\"%s\\",\\"seq\\":%lu}",
                type, WORKER_ID, ZONE, (unsigned long)++seq);
    LoRa.endPacket();
    if (waitAck(seq, 1500)){ /* confirm to worker */ return true; }
  }
  return false;
}

bool gasDanger(){
  float toxic = analogRead(PIN_TOXIC)/4095.0f * TOXIC_FS;
  float o2    = analogRead(PIN_O2)/4095.0f * 25.0f;      // %O2 (calibrate)
  return toxic > TOXIC_LIMIT || o2 < 19.5f;
}

bool manDown(float aMag, uint32_t now){
  static bool impacted=false; static uint32_t impactAt=0;
  if (aMag>3.0f){ impacted=true; impactAt=now; }
  bool still = fabsf(aMag-1.0f)<0.08f;
  if (still){ if(!stillSince) stillSince=now; } else stillSince=0;
  bool afterImpact = impacted&&(now-impactAt<30000)&&stillSince&&(now-stillSince>3000);
  bool collapsed = stillSince&&(now-stillSince>T_STILL_MS);
  return afterImpact||collapsed;
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_PANIC,INPUT_PULLUP); pinMode(PIN_CANCEL,INPUT_PULLUP);
  pinMode(PIN_BUZZER,OUTPUT); pinMode(PIN_VIBE,OUTPUT);
  Wire.begin(21,22); imu.initialize();
  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6); LoRa.setSpreadingFactor(10);
}

void loop(){
  uint32_t now=millis();
  int16_t ax,ay,az; imu.getAcceleration(&ax,&ay,&az);
  float g=1.0f/16384.0f;
  float aMag=sqrtf((ax*g)*(ax*g)+(ay*g)*(ay*g)+(az*g)*(az*g));

  // panic + gas = immediate
  if (digitalRead(PIN_PANIC)==LOW){ workerAlarm(true); sendAlert("PANIC"); }
  if (gasDanger()){ workerAlarm(true); sendAlert("GAS"); }

  // man-down with cancellable pre-alarm
  if (manDown(aMag, now) && !preAlarm){ preAlarm=true; preAlarmStart=now; workerAlarm(true); }
  if (preAlarm && digitalRead(PIN_CANCEL)==LOW){ preAlarm=false; workerAlarm(false); }
  if (preAlarm && now-preAlarmStart>T_CANCEL_MS){
    preAlarm=false; sendAlert("MAN_DOWN");            // escalate located alarm
  }

  if (now-lastBeat>HEARTBEAT_MS){                     // supervision
    LoRa.beginPacket();
    LoRa.printf("{\\"t\\":\\"HB\\",\\"id\\":%u,\\"vbat\\":%.2f}",
                WORKER_ID, readBattery());
    LoRa.endPacket(); lastBeat=now;
  }
  delay(100);
}`,
    explain: [
      { ref: 'NOT a certified, calibrated, intrinsically-safe safety device.', txt: 'The header states the scope in the code itself — this is educational/supplementary and must never be relied on as the certified equipment hazardous work requires.' },
      { ref: 'bool sendAlert(const char *type)', txt: 'Every alert is retried until the control room acknowledges, and carries the worker\'s id and zone — located, reliable, confirmed delivery.' },
      { ref: 'return toxic > TOXIC_LIMIT || o2 < 19.5f', txt: 'Gas alarms fire on toxic concentration or oxygen deficiency, the atmospheric killers a worker cannot sense in time.' },
      { ref: 'if (manDown(aMag, now) && !preAlarm){ preAlarm=true; ... }', txt: 'A man-down first raises a cancellable pre-alarm the worker can dismiss if fine, controlling false alarms so the device stays worn.' },
      { ref: 'if (now-lastBeat>HEARTBEAT_MS){', txt: 'Heartbeats supervise the wearable so a dead or low-battery unit is flagged before an incident — a silent safety device is worse than none.' },
    ],
  }],

  config: [
    'Set gas danger thresholds for the workplace hazard (educational-grade sensors, clearly labelled as such).',
    'Configure man-down signatures, the pre-alarm cancel window, and escalation.',
    'Set the located-alert path (with acknowledgement), heartbeat interval and battery-low threshold.',
    'Integrate plant location (beacons/zones) so alerts are located.',
  ],
  calibration: [
    { h: 'Gas', p: [
      'Understand these are educational sensors; for any real use, certified, calibrated detectors are required. Set thresholds and test response conservatively.',
    ] },
    { h: 'Man-down', p: [
      'Tune fall/stillness thresholds so genuine falls/incapacitation are caught while normal movement and brief rest do not false-alarm (with the pre-alarm as backstop).',
    ] },
    { h: 'Comms/battery', p: [
      'Verify located, acknowledged delivery across the plant and shift battery life with supervision.',
    ] },
  ],
  testing: [
    { step: 'Expose to test gas (safely)', expect: 'Worker + control-room alarm; located, acknowledged' },
    { step: 'Simulate a fall', expect: 'Pre-alarm; if not cancelled, escalates to man-down alarm' },
    { step: 'Cancel the pre-alarm', expect: 'No escalation (false alarm avoided)' },
    { step: 'Remain motionless past the timeout', expect: 'Collapse detected; man-down escalated' },
    { step: 'Press panic', expect: 'Immediate located alarm' },
    { step: 'Let battery run low / go silent', expect: 'Supervision flags low battery / missing heartbeat' },
  ],
  output: [
    'The control-room console shows located, acknowledged alarms (gas/man-down/panic) with the worker and zone, and a health view of every wearable.',
    { file: 'safety-event.json', lang: 'json', body: `{
  "type": "MAN_DOWN",
  "worker": 7,
  "zone": "Boiler room",
  "seq": 22,
  "time": "2026-07-27T14:03:51",
  "acknowledged": true
}` },
    'A located man-down alert (worker 7, boiler room) reaches the control room and is acknowledged; a gas or panic event would be handled identically — always with a supplementary, never a certified, guarantee.',
  ],
  troubleshoot: [
    { sym: 'Too many man-down false alarms', cause: 'Thresholds too sensitive / no pre-alarm', fix: 'Use the cancellable pre-alarm; tune fall/stillness; make the pre-alarm unmissable' },
    { sym: 'Worker doesn\'t feel the alarm', cause: 'Audible only in noise/PPE', fix: 'Add strong vibration/haptic alongside the buzzer' },
    { sym: 'Alarm not located/acknowledged', cause: 'No location or ack', fix: 'Add plant location and end-to-end acknowledgement with retry' },
    { sym: 'Wearable dies mid-shift unnoticed', cause: 'No supervision', fix: 'Heartbeat battery/health; flag silent/low units' },
    { sym: 'Treated as a certified detector', cause: 'Misunderstanding of scope', fix: 'Be explicit: educational/supplementary; certified equipment is legally required for hazardous work' },
  ],

  iot: {
    protoShort: 'LoRa/mesh → control-room console (located, ack)',
    net: {
      nodes: [{ name: 'Wearable', sub: 'ESP32' }, { name: 'Other workers', sub: 'fleet' }],
      protocol: 'LoRa/mesh', gateway: 'Control-room GW', gatewaySub: 'located alarms',
      uplink: 'MQTT/console', cloud: 'Control room', cloudSub: 'gas/man-down/panic',
      clients: [{ name: 'Console', sub: 'located + ack' }, { name: 'Responders', sub: 'rescue' }],
    },
    protocol: ['Alarms deliver with retry and acknowledgement, located by worker/zone; heartbeats supervise every wearable. Worker alarm and delivery do not depend on a single link.'],
    topics: [
      { t: 'safety/alarm', dir: 'wearable → console', payload: 'type (gas/man-down/panic), worker, zone' },
      { t: 'safety/ack', dir: 'console → wearable', payload: 'acknowledgement → confirm to worker' },
      { t: 'safety/heartbeat', dir: 'wearable → console', payload: 'battery, link (supervision)' },
    ],
    cloud: ['A control-room console shows located, acknowledged alarms and every wearable\'s health, and coordinates (properly-equipped) response.'],
    dashboard: ['A plant map of workers with instant located alarms, an alarm queue with acknowledge, and a wearable-health/supervision view.'],
    mobile: ['Located alarms to responders and supervision alerts for low-battery/silent wearables.'],
    security: [
      'Authenticate wearables/acknowledgements so alarms cannot be spoofed.',
      'Keep worker alarm and delivery independent of a single link; supervise continuously.',
      'Never present as certified equipment; certified, calibrated, IS-rated detectors are legally required for hazardous work.',
    ],
  },

  perf: [
    'Prioritise instant, reliable alarming (retry+ack) over everything.',
    'Keep man-down detection light so it runs continuously without draining the shift battery.',
    'Heartbeat health so a dead/low wearable is known before an incident.',
    'Make the worker alarm both loud and haptic for noisy/PPE environments.',
  ],
  safety: [
    'THIS IS EDUCATIONAL/SUPPLEMENTARY — not a certified, calibrated, intrinsically-safe gas detector. Hazardous industrial work legally requires certified safety equipment; never rely on this for life safety.',
    'Real toxic/explosive atmospheres demand certified instruments and proper procedures (confined-space entry, rescue plans).',
    'Provide located, acknowledged alarms and supervision; a silent or unlocated alarm fails when it matters.',
    'Test regularly and never let this replace required PPE, gas detectors or safe systems of work.',
  ],
  maintenance: [
    'Act on every supervision alert; replace/charge batteries; fix silent wearables.',
    'Test gas response and man-down detection regularly (with the pre-alarm).',
    'Verify located, acknowledged delivery across the plant.',
    'Reinforce that it is supplementary — certified equipment remains mandatory.',
  ],
  future: [
    'Add heart-rate/temperature for heat-stress detection.',
    'Add precise indoor location (UWB/beacons) for faster rescue.',
    'Add two-way voice to the control room.',
    'Integrate with certified gas-detection systems as a data/awareness layer.',
  ],
  faq: [
    { q: 'Can I use this instead of a real gas detector?', a: 'No — absolutely not. This is an educational/supplementary build. Hazardous work legally requires certified, calibrated, intrinsically-safe gas detectors and proper procedures; never rely on this for life safety.' },
    { q: 'Why detect man-down and gas specifically?', a: 'Because in both, the victim often cannot save themselves — a toxic atmosphere incapacitates before you realise, and a fall/collapse leaves you unable to call for help. The wearable calls for help on the worker\'s behalf.' },
    { q: 'How does it avoid constant false man-down alarms?', a: 'With a cancellable pre-alarm: on a detected man-down it warns the worker, who cancels if fine; only an uncancelled event escalates to a full alarm. That keeps false alarms tolerable so the device stays worn.' },
    { q: 'Why do alarms need location and acknowledgement?', a: 'Location sends responders straight to the worker in a large plant; acknowledgement tells the worker help is coming and confirms a human is responding. A silent, unlocated alarm fails at the crucial moment.' },
    { q: 'What makes it reliable enough to trust (even supplementarily)?', a: 'Shift battery life with supervision, plant-wide comms, retry-until-acknowledged alarms, and heartbeats that flag a dead or low wearable before an incident — plus the honesty that it does not replace certified equipment.' },
  ],
  refs: [
    { t: 'Confined spaces and toxic atmospheres (OSHA)', u: 'https://www.osha.gov/confined-spaces', s: 'OSHA' },
    { t: 'Gas detection and exposure limits', u: 'https://en.wikipedia.org/wiki/Gas_detector', s: 'Reference' },
    { t: 'Man-down / lone worker safety', u: 'https://en.wikipedia.org/wiki/Lone_worker', s: 'Reference' },
    { t: 'Fall detection with accelerometers', u: 'https://en.wikipedia.org/wiki/Fall_detection', s: 'Reference' },
    { t: 'Intrinsic safety (ATEX/IECEx)', u: 'https://en.wikipedia.org/wiki/Intrinsic_safety', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'health'],
  imageCaptions: [
    'A wearable watching for toxic gas and man-down events — the two hazards a worker often cannot survive alone.',
    'ESP32 module sensing gas and fall/stillness and sending located, acknowledged alarms.',
    'A control-room console shows located alarms and every wearable\'s health — supplementary to, never a replacement for, certified safety equipment.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   068 — Warehouse Climate Logger
   ══════════════════════════════════════════════════════════════════ */
{
  id: '068',
  domainKey: 'iot',
  emoji: '🌡️', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Records temperature and humidity across a warehouse to a tamper-evident, audit-ready log — proving storage stayed in spec and warning before it drifts out.',

  overview: [
    'Many goods — pharmaceuticals, food, electronics, documents, museum pieces — must be stored within a temperature and humidity range, and the person storing them must be able to <b>prove</b> the conditions were maintained. A regulator, a customer, or an insurer will not take "it was fine" on trust; they want a continuous, trustworthy record. Yet warehouses are large and their climate varies from the loading dock to the back corner to the roof space, so a single wall thermometer proves nothing. This project logs temperature and humidity at multiple points across a warehouse to a tamper-evident, audit-ready record — proving storage stayed in spec, and alerting before it drifts out of it.',
    'It places sensors where the warehouse is actually at risk — near doors, in the warmest and coldest corners, high and low (warm air rises), in the product zones that matter — because compliance is judged on the <b>worst</b> conditions goods experienced, not a flattering average. It timestamps every reading against a real-time clock, writes it to an <b>append-only</b> log, and mirrors it off-device, so the record is trustworthy and survives. Alongside temperature and humidity it derives the metrics compliance actually uses: <b>excursions</b> (any time-out-of-range, with duration and peak), <b>mean kinetic temperature</b> for temperature-sensitive goods, and <b>dew point</b> where condensation risk matters.',
    'Beyond proving the past, it protects the present: it alarms the moment a zone drifts toward its limit — a door left open, HVAC failing, a humid spell — so someone can act before goods are damaged, and it runs on battery backup and local logging so a power cut (exactly when incidents happen) never leaves a gap. It exports the audit trail buyers and inspectors require. It is honest that a DIY logger is not automatically a certified/validated compliance instrument where regulations demand one (pharma GDP, for instance, has specific requirements), and that sensor placement and calibration decide everything. But as a multi-point, tamper-evident, alerting climate logger, it does exactly what regulated storage needs: it keeps an honest, defensible record that conditions stayed in spec, and warns in time when they might not.',
  ],
  does: [
    'Logs temperature and humidity at multiple warehouse points',
    'Places sensors at the worst/most-variable locations, not one average spot',
    'Timestamps to a tamper-evident, append-only log, mirrored off-device',
    'Derives excursions (duration/peak), mean kinetic temperature and dew point',
    'Alarms before a zone drifts out of range',
    'Rides power/network outages on battery + local logging',
    'Exports an audit-ready trail for inspectors/customers',
  ],
  features: [
    'Multi-point sensing representing the whole warehouse',
    'Tamper-evident, timestamped compliance log (local + mirror)',
    'MKT, excursion and dew-point metrics',
    'Proactive alerts before goods are at risk',
    'Outage ride-through (battery + local log)',
    'Exportable audit trail',
    'Honest scope vs certified/validated instruments',
  ],
  applications: [
    { t: 'Pharma / GDP storage', d: 'Temperature/humidity compliance logging with excursions and MKT for medicine warehouses (supplementary to validated systems).' },
    { t: 'Food / FMCG warehousing', d: 'Proving ambient storage conditions and alerting before spoilage risk.' },
    { t: 'Electronics / documents / archives', d: 'Humidity/temperature control and audit for moisture- or heat-sensitive goods.' },
    { t: 'Museums / sensitive storage', d: 'Stable-climate monitoring with dew-point and excursion records.' },
  ],
  skills: [
    'Multi-point temperature/humidity sensing and placement',
    'Tamper-evident logging with a real-time clock and off-device mirror',
    'Excursion, MKT and dew-point computation',
    'Proactive alerting and outage ride-through',
    'Audit-trail export and compliance framing',
  ],
  prereq: [
    'Place sensors at the worst/most-variable points (doors, corners, high/low, product zones) — compliance is judged on the worst conditions, not an average.',
    'The log is only trustworthy if append-only, timestamped and mirrored off-device.',
    'Provide battery backup and local logging — power/network fail exactly when incidents happen.',
    'A DIY logger is not automatically a certified/validated compliance instrument; calibration and placement decide accuracy.',
  ],

  parts: ['esp32', 'sht31', 'dht22', 'reed', 'rtc', 'sdcard', 'buzzer', 'li18650'],
  qty: { sht31: 4 },
  extraParts: [
    { name: 'Multi-point T/RH sensors', spec: 'SHT31 (accurate) at door/corner/high/low/product zones', qty: 5, price: 900, note: 'Placement at worst points is critical' },
    { name: 'Door sensors', spec: 'Reed contacts logging door openings (a common excursion cause)', qty: 2, price: 200 },
    { name: 'Backup battery + RTC', spec: '18650 backup and DS3231 RTC for outage ride-through and accurate time', qty: 1, price: 300 },
    { name: 'Mirror/host', spec: 'Server/cloud for the off-device audit trail', qty: 1, price: 0, note: 'Use existing infrastructure' },
  ],
  cost: '₹3,000 – ₹4,800',
  libs: ['wifi', 'pubsub', 'bme', 'unified', 'ntp', 'sqlite', 'preferences'],

  pins: {
    left: [
      { dev: 'SHT31 ×N', devPin: 'SDA/SCL', pin: 'GPIO 21/22 (+mux)', sig: 'Zone temp/humidity (I²C)' },
      { dev: 'Door reeds', devPin: 'NC', pin: 'GPIO 34/35', sig: 'Door open/close' },
      { dev: 'DS3231 RTC', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Timestamps' },
    ],
    right: [
      { dev: 'microSD', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Append-only local log' },
      { dev: 'Buzzer', devPin: 'IN', pin: 'GPIO 13', sig: 'Local alarm' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Off-device mirror' },
      { dev: 'Backup battery', devPin: 'sense', pin: 'ADC', sig: 'Power supervision' },
    ],
  },
  wiringNotes: [
    'Place accurate T/RH sensors at the warehouse\'s worst/most-variable points (near doors, warm/cold corners, high and low, product zones), not a single convenient wall.',
    'Use an I²C mux or addressable sensors for multiple SHT31s; map each to its location.',
    'Give the RTC a coin-cell backup for accurate timestamps, and log door openings (a common excursion cause).',
    'Power from mains with battery backup and sense the supply so outages are ridden through and logged.',
    'Mirror the append-only log off-device so the record survives tampering or loss.',
  ],

  block: { columns: [
    { label: 'Sense zones', edge: 'right', blocks: [
      { name: 'T/RH ×N', sub: 'worst points', highlight: true },
      { name: 'Doors', sub: 'openings' },
    ] },
    { label: 'Record', edge: 'right', blocks: [
      { name: 'ESP32 + RTC', sub: 'timestamp' },
      { name: 'Append-only', sub: 'local + mirror' },
      { name: 'MKT/dew/excursion', sub: 'computed' },
    ] },
    { label: 'Protect', edge: 'right', blocks: [
      { name: 'Alarm', sub: 'before out-of-range' },
      { name: 'Ride-through', sub: 'battery+log' },
    ] },
    { label: 'Audit', edge: 'none', blocks: [
      { name: 'Export', sub: 'audit trail' },
    ] },
  ] },
  flow: [
    { t: 'Sample zones + doors', k: 'start' },
    { t: 'Timestamp; append to log; mirror', k: 'proc' },
    { t: 'Any zone near/out of range?', k: 'dec', yes: 'Alarm; start/continue excursion', no: 'Update MKT/dew' },
    { t: 'Alarm; start/continue excursion', k: 'io' },
    { t: 'Update MKT/dew', k: 'proc' },
    { t: 'Wait interval', k: 'end', back: 'Sample zones + doors' },
  ],

  principle: [
    'A compliance climate logger exists to answer one question convincingly: <b>did storage stay within spec, and can you prove it?</b> "Prove" is the operative word, because in regulated or contractual storage, an unprovable claim is treated as a failure — a customer or inspector who cannot see a trustworthy record must assume the worst. So the logger\'s design centres on producing a record that is <b>representative</b> (of the whole warehouse, not one flattering spot), <b>trustworthy</b> (tamper-evident and timestamped), <b>complete</b> (no gaps, even through outages), and <b>audit-ready</b> (exportable in a form an inspector accepts).',
    'Being <b>representative</b> means <b>multi-point sensing at the worst locations</b>. A warehouse is not one temperature: it is warm near the roof and the loading dock, cool in a shaded back corner, humid near a leaky door, and the goods in each zone experience their local conditions. Compliance is judged on the <b>worst</b> conditions any product experienced, so a single sensor — especially one placed somewhere convenient and benign — proves nothing and can hide a real excursion. The logger therefore places sensors deliberately at the door, the warmest and coldest corners, high and low, and in the product zones, so the record reflects the true envelope of conditions, and it logs door openings because an open door is the commonest cause of a local excursion.',
    'Being <b>trustworthy and complete</b> mirrors the discipline of any compliance record. Every reading is timestamped against a <b>backed-up real-time clock</b> and written to <b>append-only</b> storage (you can add, not silently rewrite), with a sequence/hash so a deleted or altered entry is detectable, and the log is <b>mirrored off-device</b> so it survives tampering or loss of the unit. And because power and network fail precisely during the incidents you most need to document, the logger runs on <b>battery backup</b> and keeps logging <b>locally</b> through outages, syncing the backlog on recovery — a compliance logger that goes blind during a power cut is blind during the very event it exists to record.',
    'On top of the raw log, the logger computes the <b>metrics compliance actually uses</b>, so the record is not just data but evidence. An <b>excursion</b> is any continuous period out of range, characterised by its start, duration and peak — because how far and how long matter, not merely that it happened. <b>Mean kinetic temperature</b> summarises a fluctuating temperature history into the single effective temperature the goods experienced, weighting warm periods more heavily (the standard the regulated cold/ambient chains use precisely because degradation accelerates with temperature). <b>Dew point</b> flags condensation risk where humidity control matters. And beyond documenting the past, the logger <b>protects the present</b> with proactive alarms the moment a zone drifts <i>toward</i> its limit, so a person can act — close the door, fix the HVAC — before goods are damaged, not after. The design is candid that a homebrew logger is not automatically a <b>certified/validated</b> instrument where regulations (e.g. pharmaceutical GDP) demand specific, qualified equipment, and that sensor calibration and placement bound its accuracy. But within that honest frame, it delivers exactly what regulated storage needs: an honest, representative, tamper-evident, complete and audit-ready record that conditions stayed in spec — and a timely warning when they might not.',
  ],
  equations: [
    { t: 'Mean kinetic temperature', eq: 'MKT = (ΔH/R) / −ln[ (Σ e^(−ΔH/(R·T_i))) / n ]\n\n  T_i absolute temps (K) of each interval,\n  ΔH ≈ 83 kJ/mol, R = 8.314 J/mol·K\n\nWarm periods dominate the average (degradation is\nexponential in T) — the standard for temp-sensitive goods.' },
    { t: 'Excursion + dew point', eq: 'Excursion (per representative zone vs limits):\n  in_excursion while T/RH out of range\n  record start, end, duration, peak\n\nDew point from T, RH (Magnus):\n  γ = ln(RH/100) + a·T/(b+T)\n  Td = b·γ/(a−γ)\n  condensation risk if surfaces near/below Td.' },
    { t: 'Representative (worst-case) evaluation', eq: 'Judge compliance on the worst zone:\n  T_rep = max over zones (for over-temp)\n  RH_rep = max over zones (for humidity)\n\nA single benign sensor hides excursions the goods actually\nsaw — use the worst point, not an average.' },
  ],

  assembly: [
    { h: 'Place sensors at the worst points and set up time', p: [
      'Mount accurate T/RH sensors at the door, warm/cold corners, high/low and product zones, mapped to locations; add door sensors. Set up the RTC with coin-cell backup for accurate timestamps.',
    ], warn: 'Do not place all sensors somewhere convenient and benign. Compliance is judged on the worst conditions — sensors must be where the risk is, or the record is worthless.' },
    { h: 'Set up tamper-evident logging', p: [
      'Define an append-only, sequence-numbered log to local storage, mirrored off-device, and run on mains with battery backup so outages do not create gaps.',
    ] },
    { h: 'Compute metrics and alerts', p: [
      'Compute excursions, MKT and dew point, and configure proactive alarms before a zone drifts out of range, plus audit export.',
    ] },
  ],
  steps: [
    { h: 'Log representatively and compute metrics', p: [
      'Each interval, read all zones (and doors), append timestamped records, evaluate the worst zone against limits for excursions, and update MKT and dew point.',
    ], code: {
      file: 'climate-compliance.ino', lang: 'cpp',
      body: `struct MKT { double sumExp=0; uint32_t n=0; } mkt;
const double DH_R = 83000.0/8.314;

void mktAdd(float tC){ mkt.sumExp += exp(-DH_R/(tC+273.15)); mkt.n++; }
float mktValue(){ return mkt.n? (float)(DH_R/-log(mkt.sumExp/mkt.n)-273.15):NAN; }

float dewPoint(float t, float rh){
  const float a=17.27f, b=237.7f;
  float g = logf(rh/100.0f) + a*t/(b+t);
  return b*g/(a-g);
}

struct Excursion { bool active=false; uint32_t start=0; float peak=-99; } exc;

void evaluate(float *zoneT, int n, float tLimit, uint32_t now){
  float tRep = -99; for(int i=0;i<n;i++) if(zoneT[i]>tRep) tRep=zoneT[i]; // worst
  mktAdd(tRep);
  if (tRep > tLimit){
    if (!exc.active){ exc.active=true; exc.start=now; exc.peak=tRep; }
    if (tRep>exc.peak) exc.peak=tRep;
    if (now-exc.start > GRACE) raiseAlarm("temp excursion", tRep, exc.peak);
  } else if (exc.active){
    logExcursion(exc.start, now, exc.peak);   // start/end/duration/peak
    exc.active=false; exc.peak=-99;
  }
}`,
      explain: [
        { ref: 'float tRep = -99; for(int i=0;i<n;i++) if(zoneT[i]>tRep) tRep=zoneT[i]', txt: 'The worst (warmest) zone represents the warehouse, because compliance is judged on the worst conditions goods experienced, not an average that hides them.' },
        { ref: 'void mktAdd(float tC)', txt: 'Each interval folds into the running mean kinetic temperature, weighting warm periods exponentially as the standard requires.' },
        { ref: 'float dewPoint(float t, float rh)', txt: 'Dew point is derived so condensation risk can be flagged where humidity control matters.' },
        { ref: 'if (now-exc.start > GRACE) raiseAlarm', txt: 'An out-of-range condition sustained past a grace period alarms, and the full excursion (start/end/duration/peak) is logged when it recovers — the evidence compliance needs.' },
      ],
    } },
    { h: 'Log tamper-evidently, alert and export', p: [
      'Append each record with a sequence number/timestamp to local storage and mirror off-device, alarm proactively before limits, ride outages on battery, and provide audit export.',
    ], tip: 'Alarm before the limit (a near-limit warning), not only on breach — the point is to prevent damage, not just document it.' },
  ],

  code: [{
    file: 'warehouse-climate-logger.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Warehouse Climate Logger — ESP32, multi-point, tamper-evident

   Logs T/RH at multiple worst-case points to an append-only,
   timestamped, mirrored record; computes excursions, MKT and dew
   point; alarms before drift-out; rides outages on battery + SD.
   Supplementary to certified/validated compliance systems.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <RTClib.h>
#include <SD.h>
#include <SPI.h>
#include <math.h>

#define NZONES 5
#define SD_CS  5
#define PIN_BUZZER 13
#define T_LIMIT 25.0f
#define RH_LIMIT 60.0f
#define GRACE_MS 600000UL   // 10 min sustained before excursion alarm
#define LOG_MS 60000UL

const char *zoneName[NZONES] =
  {"Door","Warm corner","Cold corner","High","Product"};
Adafruit_SHT31 sht[NZONES];    // via mux/addresses in practice
RTC_DS3231 rtc;
WiFiClient net; PubSubClient mqtt(net);

struct MKT { double sumExp=0; uint32_t n=0; } mkt;
const double DH_R = 83000.0/8.314;
struct Exc { bool active=false; uint32_t start=0; float peak=-99; } exc;
uint32_t lastLog=0, seq=0;

void mktAdd(float t){ mkt.sumExp += exp(-DH_R/(t+273.15)); mkt.n++; }
float mktValue(){ return mkt.n? (float)(DH_R/-log(mkt.sumExp/mkt.n)-273.15):NAN; }
float dewPoint(float t,float rh){ const float a=17.27f,b=237.7f;
  float g=logf(rh/100.0f)+a*t/(b+t); return b*g/(a-g); }

void logLine(DateTime t, float *zt, float *zh, float tRep){
  File f = SD.open("/climate.csv", FILE_APPEND);        // append-only
  if(!f) return;
  f.printf("%lu,%04d-%02d-%02d %02d:%02d:%02d",(unsigned long)seq++,
    t.year(),t.month(),t.day(),t.hour(),t.minute(),t.second());
  for(int i=0;i<NZONES;i++) f.printf(",%.2f,%.1f", zt[i], zh[i]);
  f.printf(",%.2f,%.2f\\n", mktValue(), tRep);
  f.close();
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_BUZZER, OUTPUT);
  Wire.begin(21,22);
  for(int i=0;i<NZONES;i++) sht[i].begin(0x44);          // + mux select
  rtc.begin(); SD.begin(SD_CS);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("climate-1");
  mqtt.loop();
  uint32_t now = millis();
  if (now-lastLog < LOG_MS) return;
  lastLog = now;

  float zt[NZONES], zh[NZONES], tRep=-99, rhRep=0;
  for(int i=0;i<NZONES;i++){
    selectMux(i);
    zt[i]=sht[i].readTemperature(); zh[i]=sht[i].readHumidity();
    if(zt[i]>tRep) tRep=zt[i];
    if(zh[i]>rhRep) rhRep=zh[i];
  }
  DateTime t = rtc.now();
  mktAdd(tRep);
  logLine(t, zt, zh, tRep);                               // always, even offline

  // proactive near-limit warning + excursion
  if (tRep > T_LIMIT-1.0f) mqtt.publish("wh/1/warn","approaching temp limit");
  if (rhRep > RH_LIMIT-3.0f) mqtt.publish("wh/1/warn","approaching RH limit");
  if (tRep > T_LIMIT){
    if(!exc.active){ exc.active=true; exc.start=now; exc.peak=tRep; }
    if(tRep>exc.peak) exc.peak=tRep;
    if(now-exc.start>GRACE_MS){ digitalWrite(PIN_BUZZER,HIGH);
      mqtt.publish("wh/1/alarm","temp excursion"); }
  } else if(exc.active){
    char m[120]; snprintf(m,sizeof m,"{\\"exc_end\\":1,\\"peak\\":%.2f}",exc.peak);
    mqtt.publish("wh/1/excursion", m);
    exc.active=false; digitalWrite(PIN_BUZZER,LOW);
  }

  char m[220];
  snprintf(m,sizeof m,"{\\"tRep\\":%.2f,\\"rhRep\\":%.1f,\\"mkt\\":%.2f,"
    "\\"dew\\":%.2f}", tRep, rhRep, mktValue(), dewPoint(tRep,rhRep));
  mqtt.publish("wh/1/live", m);                            // mirror off-device
}`,
    explain: [
      { ref: 'if(zt[i]>tRep) tRep=zt[i]', txt: 'The warmest zone represents the warehouse for compliance, so an excursion at the worst point is never hidden by cooler zones.' },
      { ref: 'File f = SD.open("/climate.csv", FILE_APPEND);        // append-only', txt: 'Records are appended with a sequence number and RTC timestamp, never overwritten, making the compliance log tamper-evident.' },
      { ref: 'logLine(t, zt, zh, tRep);                               // always, even offline', txt: 'Logging happens regardless of network, so a power cut or outage — when incidents happen — never leaves a gap in the record.' },
      { ref: 'if (tRep > T_LIMIT-1.0f) mqtt.publish("wh/1/warn"', txt: 'A near-limit warning fires before the range is breached, so staff can act to prevent damage rather than just document it.' },
      { ref: 'mqtt.publish("wh/1/live", m);                            // mirror off-device', txt: 'The record and metrics are mirrored off-device so the audit trail survives tampering or loss of the unit.' },
    ],
  }],

  config: [
    'Place and map sensors to worst-case zones; set the temperature/humidity limits and grace period.',
    'Configure the append-only log, off-device mirror, RTC/NTP, and battery-backup behaviour.',
    'Set MKT/dew-point and near-limit warning thresholds.',
    'Configure audit export and access controls.',
  ],
  calibration: [
    { h: 'Sensor accuracy', p: [
      'Calibrate/verify each T/RH sensor against a reference; record offsets. For regulated use, use appropriately qualified/calibrated sensors.',
    ] },
    { h: 'Placement', p: [
      'Confirm sensors are at the genuinely worst/most-variable points; validate with a survey across a day.',
    ] },
    { h: 'Clock/logging', p: [
      'Verify accurate timestamps (RTC backup) and that the append-only log and off-device mirror work and survive a power-off.',
    ] },
  ],
  testing: [
    { step: 'Warm a zone above limit briefly then recover', expect: 'Excursion logged with duration/peak; near-limit warning first' },
    { step: 'Compare zones', expect: 'Worst zone drives compliance evaluation' },
    { step: 'Cut mains power', expect: 'Battery keeps logging locally with correct timestamps' },
    { step: 'Drop the network', expect: 'Local log continues; mirrors/backfills on reconnect' },
    { step: 'Attempt to edit a past record', expect: 'Sequence break makes tampering detectable' },
    { step: 'Export the audit trail', expect: 'Complete, timestamped record suitable for inspection' },
  ],
  output: [
    'The dashboard shows each zone\'s T/RH, the worst-case values, MKT and dew point, and an excursion/door-event timeline; an export produces the audit trail.',
    { file: 'climate.csv', lang: 'plain', body: `seq,timestamp,door_t,door_rh,corner_t,corner_rh,...,mkt,tRep
20431,2026-07-27 14:00:00,24.1,54,23.6,52,...,23.8,24.6
20432,2026-07-27 14:01:00,26.3,58,23.7,52,...,23.9,26.3
# near-limit warning 14:01; excursion if sustained > grace` },
    'The door zone spiking to 26.3 °C (worst-case) drives a near-limit warning and, if sustained, an excursion record — the representative, tamper-evident evidence that proves conditions and flags risk.',
  ],
  troubleshoot: [
    { sym: 'Log looks fine but goods damaged', cause: 'Sensors at benign spots, missing the worst zones', fix: 'Relocate to door/corners/high/product; judge on the worst zone' },
    { sym: 'Timestamps wrong after power cut', cause: 'RTC backup dead', fix: 'Fit a fresh coin cell; re-sync NTP; verify time survives power-off' },
    { sym: 'Gaps in the record', cause: 'Stopped logging during an outage', fix: 'Battery backup + local logging + backfill; log before/independent of network' },
    { sym: 'Record can be edited', cause: 'Overwritable log', fix: 'Append-only with sequence numbers; mirror off-device' },
    { sym: 'Treated as certified compliance', cause: 'Scope misunderstanding', fix: 'For regulated use, use validated/qualified instruments; this is supplementary unless validated' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT; local SD is the source of truth',
    net: {
      nodes: [{ name: 'Climate logger', sub: 'ESP32 + SD' }, { name: 'Other areas', sub: 'more nodes' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to server',
      uplink: 'MQTT/TLS', cloud: 'Compliance store', cloudSub: 'mirror + audit',
      clients: [{ name: 'Dashboard', sub: 'live + audit' }, { name: 'QA/Phone', sub: 'alerts' }],
    },
    protocol: ['Readings, MKT/dew and excursions publish on a slow cadence and immediately on excursion/warning; the local append-only log is authoritative and mirrored off-device.'],
    topics: [
      { t: 'wh/1/live', dir: 'node → store', payload: 'per-zone T/RH, worst-case, MKT, dew' },
      { t: 'wh/1/excursion', dir: 'node → store', payload: 'excursion start/end, duration, peak' },
      { t: 'wh/1/warn', dir: 'node → QA', payload: 'approaching-limit warning' },
    ],
    cloud: ['A compliance store mirrors the record, keeps the audit trail, and supports export/reporting for inspectors and customers; near-limit warnings drive preventive action.'],
    dashboard: ['Per-zone and worst-case trends, MKT/dew, an excursion/door timeline, and an audit-export button.'],
    mobile: ['Near-limit warnings and excursion alerts, and power-loss/battery notifications.'],
    security: [
      'TLS and append-only, sequence-numbered logs mirrored off-device.',
      'Restrict audit access; keep the record tamper-evident.',
      'Alert on power/connectivity loss and on a node going silent.',
    ],
  },

  perf: [
    'A one-minute cadence suits warehouse climate; publish warnings/excursions immediately.',
    'Compute MKT incrementally; keep the log append-only and rotate by day/month.',
    'Ride outages on battery + local log; backfill the mirror on reconnect.',
    'Use accurate sensors and worst-case placement for a trustworthy record.',
  ],
  safety: [
    'For regulated storage (e.g. pharma GDP), use validated/qualified/calibrated instruments — a DIY logger is supplementary unless validated to the applicable standard.',
    'Placement and calibration decide accuracy; sensors must be at the worst points and verified.',
    'Keep the record tamper-evident and mirrored so it is defensible.',
    'Alert before limits to prevent damage, and maintain outage ride-through.',
  ],
  maintenance: [
    'Re-verify/calibrate sensors on a schedule; replace the RTC coin cell.',
    'Confirm placement still represents the worst conditions as storage/use changes.',
    'Check the off-device mirror, battery backup and backfill.',
    'Export/archive the audit trail per retention policy.',
  ],
  future: [
    'Add CO₂/particulate for specific storage needs.',
    'Add wireless zone nodes for easy coverage.',
    'Cryptographically sign records for a stronger audit trail.',
    'Integrate with a validated compliance/QMS system.',
  ],
  faq: [
    { q: 'Why multiple sensors instead of one?', a: 'A warehouse varies from door to corner to roof, and goods experience their local conditions. Compliance is judged on the worst conditions, so a single benign sensor proves nothing and can hide a real excursion.' },
    { q: 'What makes the log "tamper-evident"?', a: 'It is append-only with sequence numbers (optionally hashes) and mirrored off-device — you can add readings but not silently rewrite them, and a deleted or altered entry breaks the sequence.' },
    { q: 'What is mean kinetic temperature?', a: 'A way to summarise a fluctuating temperature history into the single effective temperature the goods experienced, weighting warm periods more heavily because degradation accelerates with temperature. It is the standard for temperature-sensitive goods.' },
    { q: 'Does it keep logging in a power cut?', a: 'Yes — battery backup and local logging keep the record complete through outages (when incidents happen), and it backfills the off-device mirror on recovery.' },
    { q: 'Is this good enough for pharma compliance?', a: 'For regulated storage you must use validated, qualified, calibrated instruments to the applicable standard. This is a faithful, supplementary logger and teaching tool unless it is validated for that use.' },
  ],
  refs: [
    { t: 'Good Distribution Practice (GDP) — temperature control', u: 'https://www.who.int/', s: 'WHO' },
    { t: 'Mean kinetic temperature', u: 'https://en.wikipedia.org/wiki/Mean_kinetic_temperature', s: 'Reference' },
    { t: 'Dew point and condensation', u: 'https://en.wikipedia.org/wiki/Dew_point', s: 'Reference' },
    { t: 'SHT31 temperature/humidity sensor (datasheet)', u: 'https://sensirion.com/products/catalog/SHT31-DIS-B', s: 'Sensirion' },
    { t: 'Data integrity and audit trails (ALCOA)', u: 'https://en.wikipedia.org/wiki/Data_integrity', s: 'Reference' },
  ],
  images: ['warehouse', 'esp32', 'grafana'],
  imageCaptions: [
    'Multi-point sensing across a warehouse represents the true envelope of storage conditions.',
    'ESP32 module timestamping every zone to a tamper-evident, mirrored compliance log.',
    'A dashboard proves conditions with MKT/excursion records and warns before a zone drifts out of range.',
  ],
},

];
