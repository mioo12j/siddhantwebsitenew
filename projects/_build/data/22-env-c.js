/* Environment batch C — 045 Landfill Methane Monitor, 046 Earthquake
   Vibration Sensor, 047 Rainwater Harvesting Monitor. Full-depth guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   045 — Landfill Methane Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '045',
  domainKey: 'iot',
  emoji: '💨', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Watches a waste site for methane build-up and leaks, reporting concentration as a fraction of the explosive limit so a dangerous pocket is caught before it can ignite.',

  overview: [
    'A landfill is a slow methane factory. Buried organic waste decomposes without oxygen and produces landfill gas — roughly half methane — for decades after the site closes. Methane is both a potent greenhouse gas (dozens of times worse than CO₂ over its lifetime) and, in the wrong concentration, explosive: between about 5% and 15% in air it will ignite from any spark. It does not stay put, either — it migrates sideways through soil and can accumulate in a nearby building\'s basement or a service trench far from the tip face. This monitor puts methane sensing across and around a waste site so a build-up or a leak is detected while it is still a warning, not yet a hazard.',
    'The single most important design decision is how the reading is expressed. A raw ppm or percent-methane number means little to the person who has to act on it; what matters for safety is how close the gas is to the point where it can explode. So the monitor reports concentration as a percentage of the <b>lower explosive limit (%LEL)</b> — 100% LEL being the 5%-methane point where the atmosphere becomes flammable — and stages its alarms as fractions of that: a low-level warning well before danger, a serious alarm approaching the explosive range, with the numbers chosen so people act with a wide safety margin. Temperature, humidity and barometric pressure are logged alongside because they drive when and where gas migrates and surfaces (a falling barometer, in particular, lets buried gas expand and escape).',
    'Waste sites are large, wet, corrosive and often without power or network, so the nodes are solar-powered, sealed and ruggedised, communicate over LoRa, and log locally so nothing is lost. A network of them turns a sprawling site into a live methane map — showing which cells are venting, whether a migration front is heading toward the boundary and a neighbouring property, and how emissions rise and fall with the weather. It is explicit that it is a monitoring and early-warning aid within a site\'s formal gas-safety regime, not a replacement for certified fixed detectors or intrinsically-safe equipment where those are required — but as a dense, honest, self-reporting layer it catches the developing problems that periodic manual surveys miss between visits.',
  ],
  does: [
    'Measures methane and reports it as a percentage of the lower explosive limit (%LEL)',
    'Stages alarms as fractions of the explosive limit with a wide safety margin',
    'Logs temperature, humidity and barometric pressure that drive gas migration',
    'Maps which cells are venting and whether a migration front nears the boundary',
    'Runs on solar + battery across a large, powerless site',
    'Reports over LoRa and logs locally through outages',
    'Complements, does not replace, certified fixed gas-safety systems',
  ],
  features: [
    '%LEL reporting — the number that actually means "how dangerous"',
    'Staged, margin-of-safety alarms below the explosive range',
    'Barometric-pressure context (falling pressure releases buried gas)',
    'Site-wide methane mapping and migration-front tracking',
    'Solar, sealed, corrosion-tolerant nodes for waste environments',
    'LoRa + local logging for large sites without power or network',
    'Honest framing as an aid within a formal gas-safety regime',
  ],
  applications: [
    { t: 'Active and closed landfills', d: 'Continuous surface and perimeter methane monitoring to catch venting cells and lateral migration long after a site has stopped taking waste.' },
    { t: 'Landfill boundary / property protection', d: 'Perimeter nodes warning if a migration front approaches neighbouring buildings where gas could accumulate dangerously.' },
    { t: 'Composting and anaerobic-digestion sites', d: 'Detecting methane build-up around organic-waste processing and biogas infrastructure.' },
    { t: 'Old/contaminated land redevelopment', d: 'Monitoring former tips being surveyed or built on, where buried gas remains a long-term hazard.' },
  ],
  skills: [
    'Reading a methane sensor and converting to %LEL',
    'Designing staged, margin-of-safety gas alarms',
    'Understanding gas migration and the role of barometric pressure',
    'LoRa + solar design for large, harsh outdoor sites',
    'Working within a formal gas-safety framework (knowing the system\'s limits)',
  ],
  prereq: [
    'Report and reason in %LEL, not raw ppm — the explosive limit is the safety-relevant reference.',
    'Low-cost methane sensors are indicative and drift; use them as early warning within a regime that includes certified detectors, never as the sole safety device.',
    'Falling barometric pressure releases buried gas — log pressure, and expect emission peaks as the barometer drops.',
    'Where an explosive atmosphere is possible, certified intrinsically-safe equipment may be legally required; this monitor does not substitute for it.',
  ],

  parts: ['esp32', 'mq2', 'bme280', 'mhz19', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Methane (CH₄) sensor', spec: 'MQ-4 / TGS2611 or catalytic/NDIR CH₄ sensor with %LEL or ppm output', qty: 1, price: 600, note: 'NDIR/catalytic is more selective than MQ-class; choose for the hazard level' },
    { name: 'Corrosion-resistant vented enclosure', spec: 'IP-rated, chemically resistant, vented for gas ingress, shades electronics', qty: 1, price: 650, note: 'Landfill gas and leachate are corrosive' },
    { name: 'Perimeter probe / borehole adapter', spec: 'Draws soil-gas from a shallow probe for sub-surface migration sensing', qty: 1, price: 400, note: 'For boundary migration monitoring, not just surface' },
    { name: 'LoRa gateway (site edge)', spec: 'One gateway with backhaul, shared by the whole site network', qty: 1, price: 2500 },
  ],
  cost: '₹4,500 – ₹6,500 per node',
  libs: ['wifi', 'bme', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'CH₄ sensor', devPin: 'AOUT/UART', pin: 'GPIO 34 / 16-17', sig: 'Methane concentration' },
      { dev: 'MQ-2 (backup)', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'Combustible-gas cross-check' },
      { dev: 'BME280', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Temp/RH/pressure (I²C)' },
    ],
    right: [
      { dev: 'LoRa SX1276', devPin: 'SCK/MISO/MOSI', pin: 'GPIO 18/19/23', sig: 'SPI radio bus' },
      { dev: 'LoRa SX1276', devPin: 'NSS/RST/DIO0', pin: 'GPIO 5/14/2', sig: 'Chip-select, reset, IRQ' },
      { dev: 'Alarm beacon', devPin: 'IN', pin: 'GPIO 13', sig: 'Local visual alarm' },
      { dev: 'Solar + TP4056', devPin: 'OUT', pin: '3V3 reg', sig: 'Charged supply' },
    ],
  },
  wiringNotes: [
    'Vent the enclosure so gas can reach the sensor while the electronics and battery are shaded and protected from corrosive leachate and rain.',
    'A catalytic/NDIR methane sensor is preferred where the hazard is real; give it its stable supply and warm-up and treat MQ-class parts as a cross-check.',
    'Log barometric pressure with the BME280 — emissions rise as the barometer falls, and pressure context makes a reading interpretable.',
    'For migration monitoring, draw soil-gas from a shallow perimeter probe rather than sampling only open air above the tip.',
    'Where an explosive atmosphere is credible, follow site rules on intrinsically-safe equipment; this build is a monitoring aid, not a certified detector.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Methane', sub: '→ %LEL', highlight: true },
      { name: 'T/RH/pressure', sub: 'BME280' },
      { name: 'Combustible', sub: 'MQ-2 cross-check' },
    ] },
    { label: 'Assess', edge: 'right', blocks: [
      { name: 'ESP32', sub: '%LEL + staging' },
      { name: 'Context', sub: 'pressure trend' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'LoRa', sub: '+ local beacon' },
    ] },
    { label: 'Site', edge: 'none', blocks: [
      { name: 'Methane map', sub: 'venting + migration' },
      { name: 'Alarm', sub: 'staged %LEL' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Read methane; convert to %LEL', k: 'proc' },
    { t: 'Read T/RH/pressure; note trend', k: 'proc' },
    { t: '%LEL over a staged threshold?', k: 'dec', yes: 'Escalate alarm; local beacon', no: 'Log trend' },
    { t: 'Escalate alarm; local beacon', k: 'io' },
    { t: 'Log trend', k: 'proc' },
    { t: 'Transmit + local log', k: 'io' },
    { t: 'Sleep (shorter if elevated)', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'Everything about this monitor is organised around one number that means danger: the <b>lower explosive limit</b>. Methane is only flammable within a band — roughly 5% to 15% by volume in air — and the bottom of that band, 5%, is the LEL. Reporting a reading as "% of LEL" makes the whole scale intuitive and safety-relevant: 0% LEL is clean air, 100% LEL is the threshold of an explosive atmosphere, and every alarm can be set as a comfortable fraction of that. A "20% LEL" warning means the gas is at one-fifth of the way to flammable — plenty of margin, but a clear signal to investigate — while "50% LEL" is a serious situation demanding action. Expressing methane this way, rather than as an abstract ppm, is what lets a non-specialist act correctly.',
    'The staging is deliberately conservative because the consequence is explosion. Alarm thresholds sit well below the LEL and escalate: a low warning to prompt a look, a higher alarm to trigger site procedures, all reached long before the atmosphere could actually ignite. This margin absorbs the real uncertainty of low-cost sensing — these sensors drift, cross-respond to other gases, and are indicative rather than precise — so that even a sensor reading somewhat optimistically still alarms with room to spare. The monitor also cross-checks methane against a general combustible-gas channel, so a suspicious rise is corroborated rather than trusted from a single element.',
    '<b>Barometric pressure</b> is the piece of context that makes methane readings make sense over time. Landfill gas sits under slight pressure in the waste mass and soil; when the atmospheric pressure <i>falls</i> — as a weather front approaches — that buried gas expands and is drawn out to the surface and through migration pathways, so surface methane and boundary migration both tend to peak as the barometer drops. A node that logs pressure can explain a rise ("emissions up because the barometer is falling fast") and even anticipate one, which is why pressure, temperature and humidity are logged as first-class data, not decoration.',
    'At site scale the goal shifts from a point reading to a <b>picture</b>. Landfills are large; gas vents unevenly from different cells and migrates laterally toward boundaries. A network of nodes across the surface and around the perimeter builds a live methane map: which cells are actively venting, whether a migration front is advancing toward the fence line and a neighbouring building where gas could accumulate in an enclosed space, and how the whole site\'s emissions breathe with the weather. Perimeter nodes drawing soil-gas from shallow probes are especially valuable, because lateral migration into an off-site basement or trench is the classic landfill-gas tragedy, and it happens away from the obvious tip face. The system is candid that it operates <i>within</i> a formal gas-safety regime — it complements certified fixed detectors and intrinsically-safe practice rather than replacing them — but as a dense, continuous, honestly-scaled early-warning layer it closes the gap between periodic manual surveys, catching the build-ups and migration events that develop in between.',
  ],
  equations: [
    { t: 'Percent of lower explosive limit', eq: 'Methane is flammable from ~5% to ~15% vol in air.\nLEL = 5% vol = 50000 ppm.\n\n  %LEL = (CH₄ concentration in ppm) / 50000 × 100\n\nSo 10000 ppm CH₄ = 20% LEL.\nAlarms are set as fractions of LEL (with margin):\n  warning ~10–20% LEL, alarm ~40–50% LEL — all below 100%.' },
    { t: 'Barometric influence on emissions', eq: 'Falling atmospheric pressure lets buried gas expand/escape:\n\n  emission ↑ when dP/dt < 0 (barometer dropping)\n\nTrack the pressure trend to contextualise a methane rise:\n  rapid pressure drop + methane rise = pressure-driven venting,\n  expected and transient — but still real gas at the surface.' },
    { t: 'Sensor drift handling (trend + cross-check)', eq: 'Low-cost CH₄ sensors drift, so combine absolute %LEL alarms\nwith a rate-of-change check and a cross-sensor gate:\n\n  alarm if %LEL > stage_threshold\n         AND combustible cross-check also elevated\n  flag \"suspect\" if the two sensors disagree markedly\n  (one may be drifting/faulted → maintenance).' },
  ],

  assembly: [
    { h: 'Build the corrosion-tolerant node', p: [
      'House the electronics in a chemically-resistant, vented, IP-rated enclosure so landfill gas can reach the sensor while the board and battery are shielded from corrosive leachate, rain and sun.',
      'Fit the methane sensor (catalytic/NDIR where the hazard warrants) and allow its warm-up; add the BME280 for pressure/temperature/humidity.',
    ], warn: 'Landfill gas and leachate corrode electronics. Use resistant materials and seal the electronics compartment, or nodes fail quickly in exactly the conditions they must monitor.' },
    { h: 'Set up surface and perimeter sensing', p: [
      'Place surface nodes over the tip and perimeter nodes at the boundary, the latter drawing soil-gas from shallow probes to catch lateral migration before it leaves the site.',
    ] },
    { h: 'Power, radio and local alarm', p: [
      'Angle the solar panel, mount the LoRa antenna high, and wire a local visual beacon that lights on a high-%LEL alarm regardless of the network. Place gateways at the site edge.',
    ] },
  ],
  steps: [
    { h: 'Convert to %LEL and stage the alarm', p: [
      'Convert the methane reading to ppm, then to %LEL against the 50000 ppm LEL, map to a staged alarm well below 100% LEL, and require corroboration from the combustible cross-check.',
    ], code: {
      file: 'methane-lel.ino', lang: 'cpp',
      body: `#define LEL_PPM 50000.0f          // 5% vol CH4 = 100% LEL

float percentLEL(float ch4_ppm) {
  return ch4_ppm / LEL_PPM * 100.0f;
}

enum Stage { CLEAR=0, WATCH=1, WARNING=2, ALARM=3 };

// Staged alarm, all thresholds well BELOW the explosive limit.
Stage stageOf(float lel, bool crossElevated) {
  if (lel >= 50.0f && crossElevated) return ALARM;   // ~half LEL: act now
  if (lel >= 20.0f)                  return WARNING;  // one-fifth LEL
  if (lel >= 10.0f)                  return WATCH;    // early notice
  return CLEAR;
}

// Cross-check: methane and combustible channels should agree.
bool suspectDrift(float lel, float combustible_pctLEL) {
  return fabsf(lel - combustible_pctLEL) > 25.0f;    // large disagreement
}`,
      explain: [
        { ref: 'return ch4_ppm / LEL_PPM * 100.0f', txt: 'Converts the methane concentration to a percentage of the explosive limit — the single number that expresses how close the atmosphere is to flammable.' },
        { ref: 'if (lel >= 50.0f && crossElevated) return ALARM', txt: 'The highest alarm still sits at only half the explosive limit and requires the combustible cross-check to agree, giving a wide safety margin and guarding against a single drifting sensor.' },
        { ref: 'if (lel >= 10.0f)                  return WATCH', txt: 'A gentle early-notice stage fires at a tenth of the LEL, so a developing build-up is flagged long before it is anywhere near dangerous.' },
        { ref: 'bool suspectDrift(', txt: 'When the methane and combustible channels disagree sharply, one is likely drifting or faulted, so the node flags itself for maintenance rather than trusting a lone number.' },
      ],
    } },
    { h: 'Add pressure context and report', p: [
      'Log the barometric trend, attach it to each reading so a rise can be explained, drive the local beacon on alarm, transmit %LEL and stage over LoRa, and log locally.',
    ], tip: 'Sample faster when %LEL is elevated or the barometer is dropping quickly, to track a pressure-driven venting event at higher resolution.' },
  ],

  code: [{
    file: 'landfill-methane-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Landfill Methane Monitor — ESP32, CH4 %LEL, pressure context, LoRa

   Reports methane as a percentage of the lower explosive limit, stages
   alarms with a wide safety margin, logs barometric context that drives
   migration, and reports over LoRa on solar. An aid within a formal
   gas-safety regime, not a certified detector.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_CH4   34
#define PIN_COMB  35
#define PIN_BEACON 13
#define LORA_CS    5
#define LORA_RST  14
#define LORA_DIO0  2
#define LEL_PPM 50000.0f

Adafruit_BME280 bme;
Preferences prefs;

float CH4_CAL, COMB_CAL;
RTC_DATA_ATTR float prevPressure = NAN;

enum Stage { CLEAR=0, WATCH=1, WARNING=2, ALARM=3 };
const char *STAGE[] = {"clear","watch","warning","alarm"};

float readCH4ppm() {                        // sensor-specific mapping
  long s=0; for(int i=0;i<64;i++) s+=analogRead(PIN_CH4);
  return (s/64.0f)/4095.0f * CH4_CAL;       // CH4_CAL maps ADC→ppm
}
float readCombustiblePctLEL() {
  long s=0; for(int i=0;i<64;i++) s+=analogRead(PIN_COMB);
  return (s/64.0f)/4095.0f * COMB_CAL;      // COMB_CAL maps ADC→%LEL
}

Stage stageOf(float lel, bool cross) {
  if (lel>=50.0f && cross) return ALARM;
  if (lel>=20.0f)          return WARNING;
  if (lel>=10.0f)          return WATCH;
  return CLEAR;
}

void transmit(float lel, float comb, float t, float rh, float p,
              float dP, Stage st, bool suspect) {
  LoRa.beginPacket();
  LoRa.printf("{\\"node\\":1,\\"lel\\":%.1f,\\"comb\\":%.1f,\\"t\\":%.1f,"
              "\\"rh\\":%.0f,\\"p\\":%.0f,\\"dP\\":%.1f,\\"stage\\":\\"%s\\","
              "\\"suspect\\":%d}",
              lel, comb, t, rh, p, dP, STAGE[st], suspect?1:0);
  LoRa.endPacket();
}

void logLocal() { /* append timestamped record */ }

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BEACON, OUTPUT);
  analogSetPinAttenuation(PIN_CH4, ADC_11db);
  analogSetPinAttenuation(PIN_COMB, ADC_11db);
  Wire.begin(21,22); bme.begin(0x76);
  prefs.begin("ch4",true);
  CH4_CAL=prefs.getFloat("ch4",100000.0f);
  COMB_CAL=prefs.getFloat("comb",100.0f);
  prefs.end();

  float ch4 = readCH4ppm();
  float lel = ch4 / LEL_PPM * 100.0f;
  float comb = readCombustiblePctLEL();
  float t = bme.readTemperature();
  float rh = bme.readHumidity();
  float p  = bme.readPressure()/100.0f;      // hPa
  float dP = isnan(prevPressure)? 0 : p - prevPressure;
  prevPressure = p;

  bool cross = comb > 15.0f;                  // combustible corroborates
  Stage st = stageOf(lel, cross);
  bool suspect = fabsf(lel - comb) > 25.0f;

  digitalWrite(PIN_BEACON, st >= ALARM ? HIGH : LOW);
  logLocal();

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);
  transmit(lel, comb, t, rh, p, dP, st, suspect);

  // sample faster if elevated or barometer dropping fast
  uint32_t sleep_s = (lel > 10.0f || dP < -1.0f) ? 120 : 900;
  esp_sleep_enable_timer_wakeup((uint64_t)sleep_s * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'float lel = ch4 / LEL_PPM * 100.0f', txt: 'Immediately converts the methane concentration to %LEL, so every downstream decision is made in the safety-relevant unit rather than raw counts.' },
      { ref: 'bool cross = comb > 15.0f', txt: 'Requires the independent combustible-gas channel to corroborate before the top alarm fires, so one drifting methane sensor cannot raise a false site-wide alarm.' },
      { ref: 'float dP = isnan(prevPressure)? 0 : p - prevPressure', txt: 'Computes the barometric trend across wakes, the context that explains (and anticipates) pressure-driven venting of buried gas.' },
      { ref: 'digitalWrite(PIN_BEACON, st >= ALARM', txt: 'Lights a local beacon at the alarm stage independent of the network, so an on-site hazard is visible even if the radio link is down.' },
      { ref: 'uint32_t sleep_s = (lel > 10.0f || dP < -1.0f)', txt: 'Samples every two minutes when methane is elevated or the barometer is falling fast, tracking a venting event closely, and every fifteen minutes when the site is quiet.' },
    ],
  }],

  config: [
    'Calibrate CH4_CAL (ADC→ppm) and COMB_CAL against known gas concentrations; set the LEL for the target gas (methane 50000 ppm).',
    'Set the staged %LEL thresholds conservatively below 100% LEL per your site\'s safety procedures.',
    'Configure surface vs perimeter (soil-gas) node behaviour and the pressure-trend sensitivity.',
    'Choose the region-legal LoRa frequency, local logging, and the local-beacon behaviour.',
  ],
  calibration: [
    { h: 'Methane span', p: [
      'Calibrate the methane sensor against a known methane concentration (calibration gas) so %LEL is accurate; repeat regularly as these sensors drift.',
    ] },
    { h: 'Cross-channel agreement', p: [
      'Confirm the methane and combustible channels agree on clean and elevated air so the cross-check and suspect-drift logic behave.',
    ] },
    { h: 'Pressure/context', p: [
      'Verify the BME280 pressure tracks a reference barometer so the dP trend is trustworthy.',
    ] },
  ],
  testing: [
    { step: 'Apply a known methane concentration', expect: '%LEL reads correctly; the right stage triggers with margin below LEL' },
    { step: 'Elevate methane but not the combustible channel', expect: 'Top alarm withheld (no corroboration); suspect-drift may flag' },
    { step: 'Drop the barometric pressure (or simulate)', expect: 'dP trend negative; faster sampling engaged; context attached' },
    { step: 'Reach the alarm stage', expect: 'Local beacon lights independent of the network; alert transmitted' },
    { step: 'Drop the LoRa link', expect: 'Reading logged locally; backlog forwards on reconnect' },
    { step: 'Run a solar cycle in a wet/corrosive mock environment', expect: 'Enclosure protects electronics; node keeps reporting' },
  ],
  output: [
    'The site dashboard shows a methane map (nodes coloured by %LEL stage), the barometric trend, and any migration front approaching the boundary; alarms list the node and %LEL.',
    { file: 'methane-packet.json', lang: 'json', body: `{
  "node": 1,
  "lel": 22.5,
  "comb": 24.0,
  "t": 28.7,
  "rh": 74,
  "p": 1006,
  "dP": -2.4,
  "stage": "warning",
  "suspect": 0
}` },
    'Here methane is at 22.5% LEL (warning stage), corroborated by the combustible channel, while the barometer is falling (−2.4 hPa) — a pressure-driven venting event flagged with plenty of margin below the explosive limit.',
  ],
  troubleshoot: [
    { sym: 'Readings drift up over weeks', cause: 'Methane sensor ageing/drift', fix: 'Recalibrate against calibration gas; rely on rate-of-change and cross-check; replace ageing sensors' },
    { sym: 'Methane and combustible channels disagree', cause: 'One sensor drifting or cross-responding', fix: 'Investigate via the suspect flag; recalibrate or replace the offending sensor' },
    { sym: 'Emissions spike then fade with weather', cause: 'Barometric-pressure-driven venting', fix: 'Expected — use the pressure trend to contextualise; it is still real surface gas' },
    { sym: 'Node corrodes/fails quickly', cause: 'Leachate/gas attacking electronics', fix: 'Use chemically-resistant sealed enclosures; keep electronics out of the wet, corrosive path' },
    { sym: 'No alarm reached expected escalation', cause: 'Thresholds or cross-check gating too strict', fix: 'Re-tune stages per site procedure; verify the combustible channel is calibrated' },
  ],

  iot: {
    protoShort: 'LoRa → site gateway → gas-safety dashboard',
    net: {
      nodes: [{ name: 'Surface node', sub: 'ESP32 + CH₄' }, { name: 'Perimeter node', sub: 'soil-gas probe' }],
      protocol: 'LoRa 433/868', gateway: 'Site gateway', gatewaySub: 'to MQTT',
      uplink: 'MQTT 1883', cloud: 'Broker + gas map', cloudSub: '%LEL + migration',
      clients: [{ name: 'Site safety', sub: '%LEL map' }, { name: 'Phone/SMS', sub: 'staged alarms' }],
    },
    protocol: ['Nodes report %LEL, stage, cross-check and barometric context on a cadence that shortens when elevated; alarm-stage changes publish immediately. Local logging is authoritative and forwards backlog on reconnect.'],
    topics: [
      { t: 'landfill/node/1/gas', dir: 'node → broker', payload: '%LEL, combustible, T/RH/pressure, dP, stage' },
      { t: 'landfill/node/1/alarm', dir: 'node → broker', payload: 'staged %LEL alarm (escalated)' },
      { t: 'landfill/node/1/status', dir: 'node → broker', payload: 'battery, suspect/cal flags, RSSI' },
    ],
    cloud: ['A broker feeds a site gas map that shows which cells vent, tracks a migration front toward the boundary, and overlays the barometric trend so emission peaks are explained; alarms escalate to site safety staff.'],
    dashboard: ['A site map coloured by %LEL stage with perimeter migration indicators, plus emission-vs-pressure trends and per-node sensor-health flags.'],
    mobile: ['Escalating alerts on warning/alarm stages, especially perimeter migration, routed to site gas-safety personnel.'],
    security: [
      'Sign node reports so false gas alarms cannot be injected into a safety system.',
      'Keep the local beacon and logging independent of the network so a lost link cannot hide an on-site hazard.',
      'Alert on a node going silent — a failed node in a gas environment is itself significant.',
    ],
  },

  perf: [
    'Deep-sleep between reads when clear; shorten intervals when %LEL is elevated or the barometer is falling.',
    'Average many ADC samples per gas channel; single samples are far too noisy for a safety decision.',
    'Persist the pressure baseline in RTC memory so the barometric trend survives sleep.',
    'Keep packets small; the value is the timely %LEL and stage, not data volume.',
  ],
  safety: [
    'This is a monitoring and early-warning aid within a formal gas-safety regime — not a replacement for certified fixed detectors or intrinsically-safe equipment where those are required.',
    'Report and act in %LEL with wide margins; never let alarms approach the actual explosive limit.',
    'Where an explosive atmosphere is credible, only appropriately-rated, certified equipment may be used — follow site rules and law.',
    'Keep the lithium battery and any spark-capable component out of potentially flammable atmospheres unless suitably protected.',
  ],
  maintenance: [
    'Recalibrate methane sensors against calibration gas on a regular schedule; drift is significant.',
    'Inspect enclosures for corrosion and reseal; replace degraded parts before they let leachate in.',
    'Verify perimeter probes remain clear and representative of soil-gas.',
    'Test the local beacon and confirm local logging/backlog forwarding before relying on the network.',
  ],
  future: [
    'Add flux (emission-rate) estimation, not just concentration, for greenhouse-gas quantification.',
    'Fuse many nodes with wind and pressure into a migration model that predicts boundary risk.',
    'Add gas-extraction well control to actively manage a venting cell.',
    'Integrate with the site\'s certified detection for a combined operational + safety view.',
  ],
  faq: [
    { q: 'Why report %LEL instead of ppm?', a: 'Because the danger is explosion, and the lower explosive limit is the reference that matters. %LEL says how close the atmosphere is to flammable, which is directly actionable; a raw ppm is not.' },
    { q: 'Can this be the site\'s gas-safety system?', a: 'No. It is an early-warning aid that complements certified fixed detectors and intrinsically-safe practice. Low-cost sensors are indicative and must not be the sole safeguard where an explosive atmosphere is possible.' },
    { q: 'Why does barometric pressure matter?', a: 'Buried landfill gas is under slight pressure; when the atmospheric pressure falls, that gas expands and escapes, so surface and migrating methane peak as the barometer drops. Logging pressure explains and anticipates those peaks.' },
    { q: 'What is the point of perimeter soil-gas nodes?', a: 'Landfill gas migrates sideways and can accumulate in an off-site basement or trench — the classic tragedy. Perimeter probes catch that migration before it leaves the site.' },
    { q: 'How do you handle cheap-sensor drift?', a: 'Wide %LEL safety margins, rate-of-change alarms, a combustible cross-check, a suspect-drift flag, and regular calibration against gas — so a drifting sensor is caught and still alarms with room to spare.' },
  ],
  refs: [
    { t: 'Landfill gas — composition and hazards (US EPA)', u: 'https://www.epa.gov/lmop/basic-information-about-landfill-gas', s: 'US EPA' },
    { t: 'Lower explosive limit and flammability of methane', u: 'https://en.wikipedia.org/wiki/Lower_flammable_limit', s: 'Reference' },
    { t: 'Landfill gas migration and barometric pumping', u: 'https://en.wikipedia.org/wiki/Landfill_gas', s: 'Reference' },
    { t: 'Catalytic and NDIR methane sensing', u: 'https://en.wikipedia.org/wiki/Catalytic_bead_sensor', s: 'Reference' },
    { t: 'Methane as a greenhouse gas', u: 'https://en.wikipedia.org/wiki/Methane', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'lora'],
  imageCaptions: [
    'A waste site vents methane for decades; a network of nodes maps where and how much.',
    'ESP32 module converting the methane reading to %LEL and staging alarms with a wide safety margin.',
    'A LoRa radio carries %LEL and migration data across a large, powerless site to the gas-safety dashboard.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   046 — Earthquake Vibration Sensor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '046',
  domainKey: 'iot',
  emoji: '📉', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '12–20 hours', iso8601: 'PT18H',
  tagline: 'A community seismic node that recognises the first faint tremor of an earthquake and triggers a fast local shake alert — buying seconds before the strong shaking arrives.',

  overview: [
    'Earthquake early warning is a race against a wave. When a fault ruptures, it sends out two kinds of seismic waves: a fast, weak <b>P-wave</b> that arrives first and does little damage, and a slower, violent <b>S-wave</b> (and surface waves) that arrive seconds to tens of seconds later and cause the destruction. If a sensor near the source detects the P-wave and immediately shouts a warning that travels at the speed of electronics — far faster than the S-wave travels through rock — places further away can get a few seconds to a minute of notice before the strong shaking hits. Those seconds are enough to stop trains, halt surgeries, open elevator doors, shut gas valves, and let people drop, cover and hold. This project builds one node of a community network that plays that game.',
    'The heart of it is an accelerometer watching the ground constantly and an algorithm that can tell a genuine seismic P-wave from the endless background of a truck rumbling past, a door slamming, or someone bumping the bench. The classic method is <b>STA/LTA</b> — comparing a short-term average of the vibration energy to a long-term average — which fires when the signal suddenly jumps above its recent background, the signature of a wave arriving. On a P-wave detection the node instantly emits an alert; when many nodes are networked, agreement between several nearby nodes confirms a real earthquake (not one person\'s washing machine) and the network estimates where and how strong it is, issuing warnings outward ahead of the damaging waves.',
    'A single hobby node is not a seismograph and cannot, alone, warn anyone reliably — false alarms from local noise would make it useless. Its value is entirely in the <b>network and the honesty of the trigger</b>: cheap MEMS accelerometers, densely deployed and cross-confirmed, can genuinely contribute to early warning, as community seismic projects have shown. So this node is designed to be a good citizen of such a network — a clean, well-characterised trigger with a sensible noise floor, accurate timing, and immediate local action (a loud shake alert) combined with networked confirmation. It is explicit that reliable warning is a system property, not a single-device one, and that it complements rather than replaces national seismic networks — but as a node you can build and run, it turns the abstract idea of earthquake early warning into something concrete on your own bench.',
  ],
  does: [
    'Continuously monitors ground vibration with a MEMS accelerometer',
    'Detects a seismic P-wave arrival with an STA/LTA trigger',
    'Rejects everyday noise (traffic, footsteps, bumps) below the trigger',
    'Emits an immediate local shake alert on detection',
    'Contributes to networked confirmation and location by many nodes',
    'Timestamps events accurately for cross-node correlation',
    'Complements, does not replace, official seismic networks',
  ],
  features: [
    'STA/LTA P-wave trigger — the classic seismic detection method',
    'Noise-floor characterisation so local bumps do not false-trigger',
    'Immediate local drop-cover-hold alert on detection',
    'Networked cross-confirmation to reject single-node false alarms',
    'Accurate timing for multi-node location and magnitude estimation',
    'Honest framing: warning is a network property, not one device',
    'Cheap, dense, community-deployable seismic node',
  ],
  applications: [
    { t: 'Community earthquake early warning', d: 'Dense citizen networks in seismic regions contributing detections that, cross-confirmed, deliver seconds of warning to a wider area.' },
    { t: 'Schools, hospitals and offices', d: 'A local node that sounds a drop-cover-hold alert and can trigger automatic safety actions the moment shaking is detected.' },
    { t: 'Critical infrastructure triggers', d: 'Fast local shut-off signals for gas, elevators or machinery on confirmed strong shaking.' },
    { t: 'Education and research', d: 'A hands-on platform for teaching seismology, detection algorithms and the physics of earthquake early warning.' },
  ],
  skills: [
    'Reading a MEMS accelerometer at a steady sample rate',
    'Implementing the STA/LTA detection algorithm and setting its parameters',
    'Characterising and rejecting environmental noise',
    'Accurate timekeeping and networked event correlation',
    'Designing immediate local alerts and safe automatic actions',
  ],
  prereq: [
    'A single node cannot reliably warn — false alarms from local noise are inevitable; warning comes from networked cross-confirmation.',
    'Mount the sensor firmly to the structure/ground; a loose or benchtop-wobbly mount fabricates vibration.',
    'Accurate, synchronised time is essential — multi-node location depends on precise arrival timestamps.',
    'This complements official seismic networks; do not present it as an authoritative earthquake warning by itself.',
  ],

  parts: ['esp32', 'mpu6050', 'adxl345', 'buzzer', 'oled', 'rtc', 'psu5v'],
  extraParts: [
    { name: 'High-sensitivity accelerometer', spec: 'MPU-6050/ADXL345 for a starter; a low-noise MEMS (e.g. ADXL355-class) for real sensitivity', qty: 1, price: 400, note: 'Lower noise floor = smaller detectable quakes; upgrade for real use' },
    { name: 'Rigid mounting plate + fixings', spec: 'Bolts the sensor solidly to a floor slab or structural wall', qty: 1, price: 150, note: 'A firm coupling to the ground is essential' },
    { name: 'GPS time module (optional)', spec: 'For sub-second synchronised timestamps across nodes', qty: 1, price: 500, note: 'Or discipline the RTC from NTP; timing accuracy drives location' },
    { name: 'Loud alert + strobe', spec: 'Audible/visual drop-cover-hold alert for the room', qty: 1, price: 300 },
  ],
  cost: '₹2,500 – ₹4,500',
  libs: ['wifi', 'pubsub', 'mpu', 'ssd1306', 'ntp', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Accelerometer', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Triaxial ground motion (I²C)' },
      { dev: 'Accelerometer', devPin: 'INT', pin: 'GPIO 34', sig: 'Data-ready interrupt' },
      { dev: 'DS3231 RTC / GPS', devPin: 'SDA/SCL / UART', pin: 'GPIO 21-22 / 16-17', sig: 'Accurate timestamps' },
    ],
    right: [
      { dev: 'Buzzer + strobe', devPin: 'IN', pin: 'GPIO 13', sig: 'Local shake alert' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Status/live seismogram' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Networked detection reporting' },
      { dev: '5V supply', devPin: '+/–', pin: '3V3 reg', sig: 'Mains-powered (fixed install)' },
    ],
  },
  wiringNotes: [
    'Bolt the accelerometer rigidly to a structural floor or wall so it moves with the building; a sensor on a wobbly bench measures the bench, not the earthquake.',
    'Sample the accelerometer at a steady, known rate (e.g. 100 Hz) using its data-ready interrupt so the STA/LTA windows are correctly timed.',
    'Give the node accurate time — GPS-disciplined or NTP-disciplined RTC — because multi-node location depends on precise arrival timestamps.',
    'Keep the sensor away from local vibration sources (HVAC, machinery, foot traffic) that would raise its noise floor and cause false triggers.',
    'Wire the alert loud and unmissable; on a confirmed strong event it must reliably prompt drop-cover-hold.',
  ],

  block: { columns: [
    { label: 'Sense motion', edge: 'right', blocks: [
      { name: 'Accelerometer', sub: 'triaxial, 100 Hz', highlight: true },
      { name: 'Time', sub: 'GPS/NTP RTC' },
    ] },
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'STA/LTA trigger' },
      { name: 'Noise reject', sub: 'background floor' },
    ] },
    { label: 'Act + report', edge: 'right', blocks: [
      { name: 'Local alert', sub: 'drop-cover-hold' },
      { name: 'Network', sub: 'detection report' },
    ] },
    { label: 'Confirm', edge: 'none', blocks: [
      { name: 'Server', sub: 'multi-node quake' },
      { name: 'Warning', sub: 'to wider area' },
    ] },
  ] },
  flow: [
    { t: 'Sample acceleration (100 Hz)', k: 'start' },
    { t: 'Update STA and LTA energy', k: 'proc' },
    { t: 'STA/LTA ratio over trigger?', k: 'dec', yes: 'P-wave detected: alert + report', no: 'Keep monitoring' },
    { t: 'Keep monitoring', k: 'io', back: 'Sample acceleration (100 Hz)' },
    { t: 'P-wave detected: alert + report', k: 'proc' },
    { t: 'Local shake alert (drop-cover-hold)', k: 'io' },
    { t: 'Send timestamped detection to network', k: 'io' },
    { t: 'De-trigger when ratio falls', k: 'end', back: 'Sample acceleration (100 Hz)' },
  ],

  principle: [
    'Earthquake early warning exploits the gap between two waves and the gap between rock and radio. A rupture emits a fast, low-amplitude <b>P-wave</b> (compressional, ~6–8 km/s) ahead of the slower, destructive <b>S-wave</b> and surface waves (~3–4 km/s). A sensor close to the epicentre feels the P-wave first; if it instantly sends an alert electronically, that alert outruns the still-travelling S-wave to more distant places. The warning time is essentially the difference in travel times — small near the epicentre, larger far from it — which is why dense networks and fast triggers matter: every fraction of a second shaved off detection is added to someone\'s warning.',
    'The detection algorithm at the core is <b>STA/LTA</b>, the workhorse of seismology. It maintains a Short-Term Average of the signal\'s energy (over, say, the last second) and a Long-Term Average (over the last tens of seconds), and computes their ratio. In quiet times the two are similar and the ratio hovers near one; when a wave arrives, the short-term energy jumps while the long-term average still reflects the quiet background, so the ratio spikes. A trigger fires when the ratio crosses a threshold, and de-triggers when it falls back. The beauty of the method is that it is self-scaling: it responds to a <i>sudden change relative to recent background</i>, so it works whether the site is inherently quiet or a bit noisy, and it adapts as conditions drift.',
    'The hard part on a cheap node is <b>rejecting the non-earthquake world</b>. A passing truck, a slammed door, footsteps, or someone knocking the desk all produce transients that can spike STA/LTA just like a P-wave. Several things help: characterising the site\'s noise floor and setting the threshold above it; requiring the trigger to persist and to show up across all three axes in a way consistent with ground motion rather than a single-axis tap; and, decisively, <b>networked cross-confirmation</b>. A real earthquake shakes many nearby nodes within a physically-consistent time pattern; one person\'s washing machine shakes exactly one node. So the network treats a lone detection as suspect and a coincident cluster of detections, arriving in a pattern consistent with a wave sweeping across the array, as a confirmed event — which also lets it estimate the epicentre (from the relative arrival times) and a rough magnitude (from the amplitudes).',
    'This is why the design insists that <b>reliable warning is a property of the network, not the node</b>. A single low-cost accelerometer, however cleverly triggered, will occasionally false-alarm on local noise, and cannot by itself distinguish a nearby small quake from a distant large one. But cheap MEMS sensors, deployed densely and cross-confirmed with accurate timestamps, genuinely contribute — community seismic networks have demonstrated that a crowd of humble sensors can detect and locate earthquakes and shave seconds off warnings for everyone. So the node does two honest things well: it acts immediately and locally (a loud drop-cover-hold alert the instant it triggers, because your own trigger on a real quake is real ground motion under you), and it reports a clean, well-timed detection into a network that does the confirmation and warning. It complements official seismic networks rather than replacing them, and it never pretends a single bench-top box is an authoritative earthquake alarm.',
  ],
  equations: [
    { t: 'STA/LTA trigger', eq: 'On the vibration signal x[n] (e.g. |acceleration| or an axis):\n\n  STA = mean of x^2 over a SHORT window (e.g. 1 s)\n  LTA = mean of x^2 over a LONG window (e.g. 30 s)\n  ratio = STA / LTA\n\n  trigger  when ratio > R_on  (e.g. 4–8)\n  de-trigger when ratio < R_off (e.g. 2)\n\nThe LTA tracks background; a sudden arrival makes STA jump\nwhile LTA lags → the ratio spikes.' },
    { t: 'Warning time from wave speeds', eq: 'For a site at distance D from the epicentre:\n\n  t_P = D / v_P,   t_S = D / v_S   (v_P ~ 6–8, v_S ~ 3–4 km/s)\n\n  warning ≈ t_S − t_P − t_detect − t_comms\n\nDetect on the P-wave, alert electronically; the S-wave still\nhas to travel. Warning grows with D but is zero in the\n\"blind zone\" very near the epicentre.' },
    { t: 'Networked confirmation and location', eq: 'A real quake triggers many nodes with consistent timing.\n\n  confirmed if ≥ K nodes trigger within a plausible window\n  epicentre from relative arrival times (t_i) across nodes\n  (grid-search / triangulation on the array geometry)\n  magnitude proxy from peak amplitudes vs distance.\n\nOne node triggering alone → treated as local noise, not a quake.' },
  ],

  assembly: [
    { h: 'Couple the sensor to the structure', p: [
      'Bolt the accelerometer rigidly to a structural floor slab or wall via a mounting plate, low in the building, so it faithfully moves with the ground.',
      'Keep it away from local vibration sources (HVAC, lifts, foot traffic) that raise the noise floor.',
    ], warn: 'A sensor that is not firmly coupled measures its own wobble, not the earthquake. Rigid mounting to the structure is non-negotiable.' },
    { h: 'Set up steady sampling and time', p: [
      'Sample the accelerometer at a fixed rate (e.g. 100 Hz) using its data-ready interrupt, and discipline the clock from GPS or NTP so timestamps are accurate to well under a second.',
    ] },
    { h: 'Wire alert, display and network', p: [
      'Connect a loud buzzer/strobe for the local drop-cover-hold alert, an OLED for status/live seismogram, and Wi-Fi for reporting detections to the confirmation server.',
    ] },
  ],
  steps: [
    { h: 'Implement the STA/LTA detector', p: [
      'Maintain short- and long-term energy averages of the vibration signal, compute their ratio each sample, and trigger when it crosses R_on, de-triggering below R_off.',
    ], code: {
      file: 'stalta.ino', lang: 'cpp',
      body: `// Running STA/LTA on the acceleration magnitude (100 Hz).
float sta = 0, lta = 0;
const float A_STA = 1.0f/100.0f;    // ~1 s short window (as an EMA)
const float A_LTA = 1.0f/3000.0f;   // ~30 s long window
const float R_ON = 6.0f, R_OFF = 2.0f;
bool triggered = false;

// Call once per sample with the (gravity-removed) accel magnitude.
bool detect(float accMag) {
  float e = accMag * accMag;                 // signal energy
  sta += A_STA * (e - sta);                  // fast average
  // Freeze LTA while triggered so the event doesn't inflate the background.
  if (!triggered) lta += A_LTA * (e - lta);
  float ratio = (lta > 1e-9f) ? sta / lta : 0;

  if (!triggered && ratio > R_ON)  { triggered = true;  return true; }  // onset
  if ( triggered && ratio < R_OFF) { triggered = false; }                // end
  return false;
}`,
      explain: [
        { ref: 'sta += A_STA * (e - sta)', txt: 'Implements the short-term average as an exponential moving average of the signal energy, cheap to run every sample and responsive to a sudden arrival.' },
        { ref: 'if (!triggered) lta += A_LTA', txt: 'The long-term background average is frozen while an event is in progress, so the earthquake\'s own energy does not inflate the baseline and suppress the trigger.' },
        { ref: 'if (!triggered && ratio > R_ON)', txt: 'A detection fires when the short-term energy jumps well above the recent background — the STA/LTA signature of a wave arriving.' },
        { ref: 'if ( triggered && ratio < R_OFF)', txt: 'Separate on and off thresholds give hysteresis, so the trigger latches through the event and releases cleanly when the shaking subsides.' },
      ],
    } },
    { h: 'Act locally and report to the network', p: [
      'On a trigger, immediately sound the local alert and send a timestamped detection (with peak amplitude and location) to the confirmation server, which decides if a cluster constitutes a real quake.',
    ], tip: 'Your own trigger means real motion under your node, so the local alert should fire immediately — the network confirmation is for warning the wider area, not for gating your own room\'s alert.' },
  ],

  code: [{
    file: 'earthquake-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Earthquake Vibration Sensor — ESP32 + accelerometer, STA/LTA

   Continuously samples ground motion, detects a P-wave with STA/LTA,
   sounds an immediate local drop-cover-hold alert, and reports a
   timestamped detection to a network that cross-confirms real quakes.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <MPU6050.h>
#include <time.h>
#include <math.h>

#define PIN_ALERT 13
#define FS        100        // 100 Hz sampling

MPU6050 accel;
WiFiClient net; PubSubClient mqtt(net);

float sta=0, lta=0, gravity=9.81f;
const float A_STA=1.0f/FS, A_LTA=1.0f/(30*FS);
const float R_ON=6.0f, R_OFF=2.0f;
bool triggered=false;
float peakDuringEvent=0;
uint32_t nextSampleUs=0;

double nowEpochMs() {
  struct timeval tv; gettimeofday(&tv,NULL);
  return tv.tv_sec*1000.0 + tv.tv_usec/1000.0;
}

void reportDetection(float peak) {
  char b[200];
  snprintf(b,sizeof b,
    "{\\"node\\":1,\\"t_ms\\":%.0f,\\"peak_g\\":%.4f,\\"lat\\":%.5f,"
    "\\"lon\\":%.5f}", nowEpochMs(), peak/9.81f, NODE_LAT, NODE_LON);
  mqtt.publish("quake/detect", b);           // network confirms clusters
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_ALERT, OUTPUT);
  Wire.begin(21,22); Wire.setClock(400000);
  accel.initialize();
  accel.setFullScaleAccelRange(MPU6050_ACCEL_FS_2);   // ±2g, fine resolution
  WiFi.begin(WIFI_SSID,WIFI_PASS);
  mqtt.setServer(MQTT_HOST,1883);
  configTime(0,0,"pool.ntp.org");            // discipline the clock
  nextSampleUs = micros();
}

void loop() {
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("quake-1");
  mqtt.loop();

  // steady-rate sampling
  if ((int32_t)(micros() - nextSampleUs) < 0) return;
  nextSampleUs += 1000000UL / FS;

  int16_t ax,ay,az;
  accel.getAcceleration(&ax,&ay,&az);
  float g = 9.81f/16384.0f;                  // ±2g scale → m/s^2 per LSB
  float x=ax*g, y=ay*g, z=az*g;
  float mag = sqrtf(x*x+y*y+z*z);
  gravity += 0.001f*(mag-gravity);           // slow-track gravity
  float motion = fabsf(mag - gravity);       // ground motion, gravity removed

  float e = motion*motion;
  sta += A_STA*(e-sta);
  if(!triggered) lta += A_LTA*(e-lta);
  float ratio = (lta>1e-9f)? sta/lta : 0;

  if (triggered && motion > peakDuringEvent) peakDuringEvent = motion;

  if (!triggered && ratio > R_ON) {
    triggered = true; peakDuringEvent = motion;
    digitalWrite(PIN_ALERT, HIGH);           // IMMEDIATE local alert
    reportDetection(peakDuringEvent);        // report onset to network
  } else if (triggered && ratio < R_OFF) {
    triggered = false;
    digitalWrite(PIN_ALERT, LOW);
  }
}`,
    explain: [
      { ref: 'if ((int32_t)(micros() - nextSampleUs) < 0) return', txt: 'Enforces a steady 100 Hz sample rate, which the STA/LTA window lengths assume — jittery sampling would distort the ratio and the timing.' },
      { ref: 'float motion = fabsf(mag - gravity)', txt: 'Removes the constant 1g of gravity by slow-tracking it, leaving the actual ground motion the detector should act on.' },
      { ref: 'if(!triggered) lta += A_LTA*(e-lta)', txt: 'Freezes the long-term background while triggered so the quake\'s energy does not raise the baseline and prematurely end the detection.' },
      { ref: 'digitalWrite(PIN_ALERT, HIGH);           // IMMEDIATE local alert', txt: 'A local trigger means real motion under this node, so the drop-cover-hold alert fires instantly rather than waiting for network confirmation.' },
      { ref: 'reportDetection(peakDuringEvent)', txt: 'Sends a timestamped, located detection to the network, which cross-confirms clusters into real earthquakes and warns the wider area — the part a single node cannot do.' },
    ],
  }],

  config: [
    'Set the sample rate and the STA/LTA window lengths and R_on/R_off thresholds to your accelerometer and site noise.',
    'Set the node\'s location for network location/magnitude estimation, and discipline the clock (GPS/NTP).',
    'Characterise the site noise floor and set the trigger above it.',
    'Configure the network reporting (MQTT topic/server) and the local alert behaviour.',
  ],
  calibration: [
    { h: 'Noise floor', p: [
      'Record the STA/LTA ratio over quiet and busy periods; set R_on comfortably above the busiest normal ratio so routine activity does not trigger.',
    ] },
    { h: 'Timing', p: [
      'Verify the clock is disciplined and timestamps are accurate to well under a second by comparing against a reference; multi-node location depends on it.',
    ] },
    { h: 'Response check', p: [
      'Induce a controlled tap/shake and confirm the trigger fires and de-triggers cleanly, and that the local alert activates immediately.',
    ] },
  ],
  testing: [
    { step: 'Tap the mounting near the sensor', expect: 'STA/LTA spikes and triggers; de-triggers as it settles' },
    { step: 'Run a nearby noise source (fan, footsteps)', expect: 'Ratio stays below R_on if the floor is set correctly' },
    { step: 'Simulate a P-wave-like transient', expect: 'Immediate local alert; timestamped detection reported' },
    { step: 'Trigger one node only', expect: 'Network treats it as noise (no cluster) — no wider warning' },
    { step: 'Trigger several nodes coincidently (test harness)', expect: 'Network confirms a quake and estimates location' },
    { step: 'Check clock discipline', expect: 'Timestamps accurate enough for cross-node correlation' },
  ],
  output: [
    'The node shows a live seismogram and status; the network dashboard shows detections, and on a confirmed cluster, an estimated epicentre, magnitude proxy, and the outgoing warning with countdown to shaking for surrounding areas.',
    { file: 'quake-detect.json', lang: 'json', body: `{
  "node": 1,
  "t_ms": 1785312045678,
  "peak_g": 0.031,
  "lat": 28.61390,
  "lon": 77.20900
}` },
    'A single detection like this is only a candidate; when several nodes report coincident, physically-consistent detections, the server confirms an earthquake, locates it from the relative arrival times, and warns areas the S-wave has not yet reached.',
  ],
  troubleshoot: [
    { sym: 'Frequent false triggers', cause: 'Noise floor too close to R_on, or loose mount', fix: 'Mount rigidly away from vibration sources; raise R_on above the busy-period ratio; require multi-axis consistency' },
    { sym: 'Misses small events', cause: 'Noisy site or insensitive accelerometer', fix: 'Use a lower-noise MEMS sensor; quieter mounting location; rely on the network\'s many nodes' },
    { sym: 'Network never confirms real events', cause: 'Poor time sync or too few nodes', fix: 'Discipline clocks (GPS/NTP); increase node density; check the confirmation window' },
    { sym: 'Trigger latches on and never releases', cause: 'LTA inflated during the event', fix: 'Freeze LTA while triggered (as implemented); ensure R_off is set sensibly' },
    { sym: 'Locations are wrong', cause: 'Inaccurate node positions or timestamps', fix: 'Set precise node lat/lon; verify timing accuracy; more nodes improve the solution' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → confirmation server → area warning',
    net: {
      nodes: [{ name: 'Seismic node', sub: 'ESP32 + accel' }, { name: 'Other nodes', sub: 'dense array' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'low-latency',
      uplink: 'MQTT 1883', cloud: 'Confirmation server', cloudSub: 'cluster + locate',
      clients: [{ name: 'Warning system', sub: 'area alerts' }, { name: 'Local alerts', sub: 'drop-cover-hold' }],
    },
    protocol: ['Each node reports a timestamped, located detection the instant it triggers — latency is everything in early warning. The server correlates detections into confirmed quakes and issues warnings outward faster than the S-wave travels.'],
    topics: [
      { t: 'quake/detect', dir: 'node → server', payload: 'timestamp, peak amplitude, node location' },
      { t: 'quake/confirmed', dir: 'server → clients', payload: 'epicentre, magnitude proxy, ETA of shaking' },
      { t: 'quake/node/health', dir: 'node → server', payload: 'noise floor, clock status, uptime' },
    ],
    cloud: ['A confirmation server clusters coincident detections, rejects lone (noise) triggers, estimates epicentre and magnitude from arrival times and amplitudes, and pushes warnings with a shaking-ETA countdown to areas the destructive waves have not yet reached.'],
    dashboard: ['A live map of node detections and confirmed events, showing the estimated epicentre, the expanding S-wave front, and per-area warning countdowns.'],
    mobile: ['On a confirmed event, an immediate warning with the seconds-until-shaking countdown, and triggers for automatic safety actions.'],
    security: [
      'Authenticate node detections so false quakes cannot be injected to cause panic.',
      'Prioritise latency and integrity end-to-end — a warning is only useful if it arrives before the shaking.',
      'Weight nodes by reliability so noisy or spoofed nodes cannot dominate the confirmation.',
    ],
  },

  perf: [
    'Sample at a steady rate and keep the STA/LTA update to a few operations per sample so 100 Hz is comfortable.',
    'Minimise end-to-end latency: detect, alert and report with as little delay as possible — seconds decide the warning\'s value.',
    'Discipline the clock continuously; timing accuracy is as important as detection accuracy for the network.',
    'Freeze the LTA during events and use hysteresis so the detector behaves cleanly without extra computation.',
  ],
  safety: [
    'Warning is a network property — never present a single node as an authoritative earthquake alarm.',
    'This complements, and does not replace, official seismic networks and public warning systems.',
    'Ensure any automatic safety actions (gas shut-off, lift control) triggered on confirmation are fail-safe and reviewed by qualified engineers.',
    'Make the local drop-cover-hold alert unmistakable and test it regularly.',
  ],
  maintenance: [
    'Periodically re-characterise the noise floor as the building\'s use changes.',
    'Verify clock discipline and node position accuracy.',
    'Check the mounting remains rigid and the sensor free of new local vibration sources.',
    'Test the local alert and the network reporting path regularly.',
  ],
  future: [
    'Upgrade to a low-noise MEMS (ADXL355-class) accelerometer for sensitivity closer to research nodes.',
    'Add on-device magnitude estimation from P-wave characteristics for faster warnings.',
    'Contribute to an existing community seismic network protocol for real cross-confirmation.',
    'Add battery backup so detection survives the power loss an earthquake can cause.',
  ],
  faq: [
    { q: 'How can a sensor warn before the earthquake?', a: 'It detects the fast, weak P-wave that arrives first and sends an electronic alert that outruns the slower, destructive S-wave to more distant places — giving them seconds of warning before the strong shaking.' },
    { q: 'Won\'t a truck or a slammed door set it off?', a: 'A single node sometimes will — which is exactly why warning depends on the network. A real quake shakes many nodes in a consistent pattern; local noise shakes one. The server confirms clusters and ignores lone triggers.' },
    { q: 'What is STA/LTA?', a: 'A short-term average of vibration energy divided by a long-term average. When a wave arrives, the short-term energy jumps above the recent background and the ratio spikes, triggering detection. It is the classic seismic method.' },
    { q: 'Is one node useful on its own?', a: 'It gives you an immediate local shake alert (your own trigger is real motion under you) and can drive local safety actions, but reliable early warning for an area is a network property, not a single-device one.' },
    { q: 'Does this replace the official earthquake warning?', a: 'No — it complements national seismic networks. Community nodes add density and can genuinely contribute, but they are not a substitute for authoritative systems.' },
  ],
  refs: [
    { t: 'Earthquake early warning — how it works', u: 'https://en.wikipedia.org/wiki/Earthquake_warning_system', s: 'Reference' },
    { t: 'STA/LTA detection algorithm — seismology', u: 'https://en.wikipedia.org/wiki/Seismometer', s: 'Reference' },
    { t: 'P-waves and S-waves', u: 'https://en.wikipedia.org/wiki/Seismic_wave', s: 'Reference' },
    { t: 'Community seismic networks (e.g. MyShake / QCN)', u: 'https://en.wikipedia.org/wiki/Quake-Catcher_Network', s: 'Reference' },
    { t: 'MEMS accelerometers for seismology', u: 'https://en.wikipedia.org/wiki/Accelerometer', s: 'Reference' },
  ],
  images: ['city', 'esp32', 'grafana'],
  imageCaptions: [
    'A dense community array of nodes cross-confirms real earthquakes and warns the wider area.',
    'ESP32 module running the STA/LTA detector on continuous accelerometer data.',
    'A dashboard clusters coincident detections into a located event and a shaking-ETA warning.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   047 — Rainwater Harvesting Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '047',
  domainKey: 'iot',
  emoji: '🌧️', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Tracks how much rainwater a system has stored and whether it is clean enough to use, automating the first-flush diversion and telling you when to draw from the tank versus the mains.',

  overview: [
    'Rainwater harvesting is wonderfully simple in principle — catch roof runoff, store it, use it — and quietly fiddly in practice. How full is the tank, really? Is the water in it clean enough for what you want to use it for, or has it gone stagnant? Did the "first flush" of dirty water that washes the roof\'s accumulated dust, leaves and bird droppings actually get diverted away before the clean water started filling the tank? And should the garden or the toilets be drawing from the tank right now, or has it run low enough that they should switch to mains? This monitor answers all of those continuously, turning a passive tank into a managed water resource.',
    'It measures <b>tank level</b> non-contact with an ultrasonic sensor so you always know your stored volume and can see it rise with each rain and fall with each use. It watches basic <b>water quality</b> — turbidity for cloudiness, TDS/EC for dissolved solids, and optionally pH — so you know whether the stored water is fit for irrigation, washing or (with proper treatment) more. It automates the <b>first-flush diverter</b>, ensuring the initial dirty runoff is sent to waste and only the cleaner water that follows is admitted to the tank, which is the single biggest determinant of stored-water quality. And it manages the <b>changeover</b> between tank and mains, drawing from the tank while it is adequate and quality is acceptable, and switching to mains when it is not — maximising the free rainwater used without ever leaving a tap dry.',
    'Everything is logged so you can see how much water the system has saved, how quality varies through a storage season, and whether the catchment is performing. It reports to a phone or dashboard, can run on solar where there is no convenient power, and alerts on the things that matter: tank nearly empty, quality degraded, first-flush or overflow events, or a sensor fault. It is honest that it monitors and manages rather than treats — it will tell you the water is turbid and switch you to mains, but making rainwater potable needs proper filtration and disinfection beyond its scope — yet as the brain of a harvesting system it captures far more usable water, more safely, than a manual tank ever will.',
  ],
  does: [
    'Measures tank level non-contact and reports stored volume and its trend',
    'Monitors turbidity, TDS/EC and optionally pH of the stored water',
    'Automates the first-flush diverter to keep dirty initial runoff out of the tank',
    'Manages changeover between tank and mains by level and quality',
    'Logs water saved, quality over the season and catchment performance',
    'Alerts on low tank, poor quality, first-flush/overflow and sensor faults',
    'Runs on mains or solar and reports to a phone/dashboard',
  ],
  features: [
    'Stored-volume tracking with rain-response and usage visibility',
    'Basic water-quality monitoring for fit-for-purpose decisions',
    'Automated first-flush diversion — the key to stored-water quality',
    'Smart tank/mains changeover to maximise free-water use',
    'Season-long logging of savings and quality',
    'Solar-capable, phone-connected operation',
    'Honest scope: manages and monitors, does not make water potable',
  ],
  applications: [
    { t: 'Domestic rainwater harvesting', d: 'Homes using stored rainwater for gardens, toilets and washing, automating diversion and mains changeover for maximum free-water use.' },
    { t: 'Institutional / campus systems', d: 'Schools, offices and apartments managing larger tanks with quality logging and savings reporting.' },
    { t: 'Agricultural and horticultural storage', d: 'Farms and nurseries tracking irrigation-water reserves and quality across a dry season.' },
    { t: 'Water-scarce and off-grid settings', d: 'Maximising every litre of captured rain where mains is limited, unreliable or expensive.' },
  ],
  skills: [
    'Non-contact tank-level measurement and volume calculation',
    'Basic water-quality sensing (turbidity, TDS, pH) and interpretation',
    'Automating a first-flush diverter and valve/pump control',
    'Changeover logic between sources with hysteresis',
    'Logging, alerting and solar/phone connectivity',
  ],
  prereq: [
    'First-flush diversion is the biggest lever on stored-water quality — get its volume and timing right.',
    'This monitors and manages water; it does not make rainwater potable. Treat quality readings as fit-for-purpose guidance, not a safety certification.',
    'Mount the level sensor above the maximum water level and keep quality probes representative and clean.',
    'Control valves/pumps via correctly-rated relays with sensible interlocks and a manual override.',
  ],

  parts: ['esp32', 'jsnsr04t', 'turbidity', 'tds', 'ph', 'waterflow', 'relay4', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'First-flush diverter + actuated valve', spec: 'Motorised/solenoid valve to divert initial runoff to waste', qty: 1, price: 800, note: 'The core water-quality mechanism' },
    { name: 'Source changeover valve(s)', spec: 'Valves/pump to select tank vs mains supply', qty: 1, price: 700 },
    { name: 'Rain/flow inlet sensor', spec: 'Detects runoff starting and measures inflow for first-flush volume', qty: 1, price: 250 },
    { name: 'Weatherproof enclosure', spec: 'IP65 for the electronics near the tank', qty: 1, price: 400 },
  ],
  cost: '₹4,500 – ₹6,500',
  libs: ['wifi', 'pubsub', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'JSN-SR04T', devPin: 'TRIG/ECHO', pin: 'GPIO 26/25', sig: 'Tank level (non-contact)' },
      { dev: 'Turbidity', devPin: 'AOUT', pin: 'GPIO 34 (ADC)', sig: 'Water cloudiness' },
      { dev: 'TDS/EC', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'Dissolved solids' },
      { dev: 'Flow sensor', devPin: 'PULSE', pin: 'GPIO 27', sig: 'Inflow (first-flush volume)' },
    ],
    right: [
      { dev: 'First-flush valve', devPin: 'IN', pin: 'GPIO 14', sig: 'Divert dirty runoff to waste' },
      { dev: 'Changeover valve', devPin: 'IN', pin: 'GPIO 12', sig: 'Tank vs mains select' },
      { dev: 'pH (opt)', devPin: 'AOUT', pin: 'GPIO 32 (ADC)', sig: 'pH via amp' },
      { dev: 'Solar + TP4056', devPin: 'OUT', pin: '3V3 reg', sig: 'Charged supply' },
    ],
  },
  wiringNotes: [
    'Mount the ultrasonic level sensor at the top of the tank, aimed down at the water, above the maximum (overflow) level so it is never submerged.',
    'Place the turbidity and TDS probes where they see representative stored water, not stagnant corners or the inlet stream.',
    'Put the flow/rain sensor at the inlet so the controller knows when runoff starts and can measure the first-flush volume.',
    'Drive the first-flush and changeover valves via correctly-rated relays with a manual override, so a fault never traps you without water.',
    'Keep analogue probe grounds quiet and separate from the valve/pump switching current.',
  ],

  block: { columns: [
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'Tank level', sub: 'ultrasonic', highlight: true },
      { name: 'Quality', sub: 'turbidity/TDS/pH' },
      { name: 'Inflow', sub: 'flow sensor' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'first-flush + changeover' },
      { name: 'Logic', sub: 'level × quality' },
    ] },
    { label: 'Act', edge: 'right', blocks: [
      { name: 'First-flush valve', sub: 'divert dirty runoff' },
      { name: 'Changeover', sub: 'tank ↔ mains' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'volume + savings' },
      { name: 'Alert', sub: 'low/quality' },
    ] },
  ] },
  flow: [
    { t: 'Runoff detected (inflow)?', k: 'dec', yes: 'Divert first-flush volume to waste', no: 'Idle / serve demand' },
    { t: 'Divert first-flush volume to waste', k: 'proc' },
    { t: 'First-flush volume passed?', k: 'dec', yes: 'Admit clean water to tank', no: 'Divert first-flush volume to waste' },
    { t: 'Admit clean water to tank', k: 'io' },
    { t: 'Idle / serve demand', k: 'proc' },
    { t: 'Tank adequate AND quality OK?', k: 'dec', yes: 'Draw from tank', no: 'Switch to mains' },
    { t: 'Draw from tank', k: 'io' },
    { t: 'Switch to mains', k: 'io' },
  ],

  principle: [
    'A rainwater system\'s usefulness comes down to two questions the monitor answers continuously: <b>how much</b> water do I have, and <b>how good</b> is it. Level answers the first: an ultrasonic sensor looking down at the water gives the stored depth, which the known tank geometry turns into a volume, and watching that volume over time shows the system breathing — jumping up with each rain, ebbing with each use, and revealing whether the catchment is keeping pace with demand. Because the sensor is non-contact and mounted above the water, nothing sits in the tank to foul or fail, and the reading survives the algae and sediment that would defeat a float.',
    'Quality answers the second question, and its most important determinant is the <b>first flush</b>. When rain starts, the initial runoff sweeps the roof\'s accumulated dust, leaves, droppings and grime into the downpipe — a concentrated slug of contamination. If that slug enters the tank it fouls the whole store; if it is diverted to waste and only the cleaner water that follows is admitted, the stored water is far better. Automating this is exactly what the monitor does: it detects runoff beginning (via the inlet flow sensor), diverts a set first-flush <i>volume</i> to waste, and only then opens the path to the tank. Sizing that volume to the roof area (a few litres per square metre of catchment is a common guide) is the single most effective water-quality intervention in the whole system, and doing it automatically means it happens every time, not just when someone remembers.',
    'The in-tank <b>quality sensors</b> — turbidity for cloudiness, TDS/EC for dissolved solids, optionally pH — then tell you whether the stored water is fit for its intended use. This is deliberately framed as <i>fit-for-purpose</i>, not potability: turbid water is fine for flushing toilets, questionable for washing, and unsuitable for drinking without proper treatment, and the monitor\'s job is to report the quality and let the changeover logic act on it, not to certify the water safe. Rising turbidity over a stagnant month, for instance, is a signal to use the water down and let fresh rain refresh it, or to service the filtration.',
    'Those two answers combine in the <b>changeover</b> decision, which is where the system pays for itself. The controller draws from the tank whenever the level is adequate <i>and</i> the quality is acceptable for the use, falling back to mains only when the tank is too low or the water too poor — with hysteresis so it does not flicker between sources around a threshold. This maximises the free rainwater actually used (the whole economic point) while guaranteeing supply never fails. Everything is logged, so over a season you can see litres saved, how quality tracked rainfall and stagnation, and whether the first-flush and catchment sizing are right — turning a set-and-forget tank into a managed resource you can actually optimise. It manages and monitors within honest limits: it will divert, switch and alert intelligently, but making rainwater potable remains a job for proper filtration and disinfection beyond the sensor\'s reach.',
  ],
  equations: [
    { t: 'Stored volume from level', eq: 'Ultrasonic distance d to the water, sensor at height H:\n\n  water_depth = H − d\n  volume = water_depth × tank_cross_section\n         (or integrate the tank\'s area profile if non-uniform)\n\nStart draw-from-tank above V_low; alert below V_min.' },
    { t: 'First-flush volume', eq: 'Divert the initial runoff that washes the roof:\n\n  V_firstflush ≈ f · A_roof        (f ~ 0.5–2 L per m²)\n\nMeasure inflow with the flow sensor and divert until the\ncumulative inflow since runoff-start exceeds V_firstflush,\nthen admit to the tank. Sized to roof area and dirtiness.' },
    { t: 'Source changeover with hysteresis', eq: 'use_tank if  volume > V_on  AND quality_ok\nswitch_mains if volume < V_off OR NOT quality_ok\n\nV_on > V_off gives hysteresis (no flicker at the threshold).\nquality_ok = turbidity < T_lim AND TDS < D_lim (and pH band)\nfor the intended use (irrigation vs washing differ).' },
  ],

  assembly: [
    { h: 'Fit level and quality sensing', p: [
      'Mount the ultrasonic sensor above the tank\'s maximum level, aimed down. Place the turbidity and TDS (and optional pH) probes in representative stored water, accessible for cleaning.',
      'Record the tank geometry so level converts to volume correctly.',
    ] },
    { h: 'Install the first-flush and changeover valves', p: [
      'Fit the actuated first-flush diverter at the downpipe with the inlet flow sensor upstream of it, and the source-changeover valve(s)/pump between tank, mains and the point of use.',
      'Wire both valves through correctly-rated relays with a manual override.',
    ], warn: 'Always provide a manual override on the valves. A controller fault must never be able to leave the property without water or unable to divert a flush.' },
    { h: 'Set up power, control and reporting', p: [
      'Power from mains or solar, house the electronics in an IP65 box near the tank, and configure Wi-Fi/MQTT reporting to a phone/dashboard.',
    ] },
  ],
  steps: [
    { h: 'Automate the first flush', p: [
      'On detecting runoff (inflow starting), divert to waste and integrate the inflow until the sized first-flush volume has passed, then admit water to the tank.',
    ], code: {
      file: 'first-flush.ino', lang: 'cpp',
      body: `float V_FIRSTFLUSH_L;          // sized to roof area (f * A_roof)
volatile uint32_t flowPulses = 0;
float pulsesPerLitre = 450.0f;  // flow-sensor constant

void IRAM_ATTR onFlow() { flowPulses++; }

enum Inlet { IDLE, FLUSHING, ADMIT };
Inlet inlet = IDLE;
uint32_t flushStartPulses = 0;

void inletTick(bool runoff) {
  switch (inlet) {
    case IDLE:
      if (runoff) {                       // rain just started
        flushStartPulses = flowPulses;
        setDiverter(true);                // send dirty first-flush to waste
        inlet = FLUSHING;
      }
      break;
    case FLUSHING: {
      float litres = (flowPulses - flushStartPulses) / pulsesPerLitre;
      if (litres >= V_FIRSTFLUSH_L) {
        setDiverter(false);               // clean water now
        setTankInlet(true);               // admit to tank
        inlet = ADMIT;
      }
      break; }
    case ADMIT:
      if (!runoff) {                       // rain stopped
        setTankInlet(false);
        inlet = IDLE;
      }
      break;
  }
}`,
      explain: [
        { ref: 'if (runoff) {                       // rain just started', txt: 'When the inlet flow sensor sees runoff begin, the diverter opens to waste — the dirty first flush is sent away before any of it can reach the tank.' },
        { ref: 'float litres = (flowPulses - flushStartPulses) / pulsesPerLitre', txt: 'The first flush is measured by volume, not time, by counting flow-sensor pulses since runoff started — so the right amount is diverted regardless of rain intensity.' },
        { ref: 'if (litres >= V_FIRSTFLUSH_L)', txt: 'Once the sized first-flush volume has passed, the diverter closes and the tank inlet opens, admitting the cleaner water that follows.' },
        { ref: 'case ADMIT:', txt: 'Clean water fills the tank until the rain stops, when the inlet closes and the system resets for the next storm.' },
      ],
    } },
    { h: 'Decide source by level and quality', p: [
      'Convert level to volume, evaluate quality against the intended use, and select tank or mains with hysteresis; log the reading and any events, and alert on low level, poor quality or faults.',
    ], tip: 'Use different quality limits for different uses — water fine for the garden may be switched to mains for washing.' },
  ],

  code: [{
    file: 'rainwater-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Rainwater Harvesting Monitor — ESP32

   Tracks tank volume and water quality, automates the first-flush
   diverter, and manages tank/mains changeover by level and quality.
   Logs savings and quality; reports to a dashboard. Manages and
   monitors — it does not make rainwater potable.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Preferences.h>

#define PIN_TRIG   26
#define PIN_ECHO   25
#define PIN_TURB   34
#define PIN_TDS    35
#define PIN_FLOW   27
#define PIN_DIVERT 14     // first-flush diverter valve
#define PIN_SOURCE 12     // tank(HIGH) / mains(LOW) changeover

#define TANK_H_CM   200.0f
#define TANK_AREA_M2 2.0f
#define V_ON_L     300.0f  // draw from tank above this
#define V_OFF_L    120.0f  // switch to mains below this (hysteresis)
#define TURB_LIM   100.0f  // NTU limit for the intended use
#define TDS_LIM    600.0f  // ppm limit

Preferences prefs;
WiFiClient net; PubSubClient mqtt(net);

float V_FIRSTFLUSH_L, TURB_CAL, TDS_CAL, pulsesPerLitre=450.0f;
volatile uint32_t flowPulses=0;
bool useTank=false;

void IRAM_ATTR onFlow(){ flowPulses++; }

float tankVolumeL() {
  digitalWrite(PIN_TRIG,LOW); delayMicroseconds(2);
  digitalWrite(PIN_TRIG,HIGH); delayMicroseconds(10); digitalWrite(PIN_TRIG,LOW);
  long us=pulseIn(PIN_ECHO,HIGH,30000);
  if(!us) return -1;
  float dist=us/58.0f;                      // cm
  float depth=constrain(TANK_H_CM-dist,0.0f,TANK_H_CM);
  return depth/100.0f * TANK_AREA_M2 * 1000.0f;   // litres
}
float readTurb(){ long s=0; for(int i=0;i<64;i++) s+=analogRead(PIN_TURB);
  return (s/64.0f)/4095.0f*TURB_CAL; }
float readTDS(){ long s=0; for(int i=0;i<64;i++) s+=analogRead(PIN_TDS);
  return (s/64.0f)/4095.0f*TDS_CAL; }

void setSource(bool tank){
  useTank=tank; digitalWrite(PIN_SOURCE, tank?HIGH:LOW);
}

void report(float vol,float turb,float tds,bool tank,bool qOk){
  char b[200];
  snprintf(b,sizeof b,
    "{\\"vol_l\\":%.0f,\\"turb\\":%.0f,\\"tds\\":%.0f,\\"source\\":\\"%s\\","
    "\\"quality_ok\\":%d}", vol,turb,tds, tank?"tank":"mains", qOk?1:0);
  mqtt.publish("rainwater/1/state", b);
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_TRIG,OUTPUT); pinMode(PIN_ECHO,INPUT);
  pinMode(PIN_DIVERT,OUTPUT); pinMode(PIN_SOURCE,OUTPUT);
  pinMode(PIN_FLOW,INPUT_PULLUP);
  attachInterrupt(PIN_FLOW,onFlow,FALLING);
  analogSetPinAttenuation(PIN_TURB,ADC_11db);
  analogSetPinAttenuation(PIN_TDS,ADC_11db);
  prefs.begin("rain",true);
  V_FIRSTFLUSH_L=prefs.getFloat("ff",20.0f);
  TURB_CAL=prefs.getFloat("turb",1000.0f);
  TDS_CAL=prefs.getFloat("tds",1000.0f);
  prefs.end();
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  setSource(false);                          // default mains until proven
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("rain-1");
  mqtt.loop();

  float vol=tankVolumeL();
  float turb=readTurb();
  float tds=readTDS();
  bool qualityOk = (turb < TURB_LIM) && (tds < TDS_LIM);

  // changeover with hysteresis
  if (!useTank && vol > V_ON_L  && qualityOk) setSource(true);
  if ( useTank && (vol < V_OFF_L || !qualityOk)) setSource(false);

  if (vol >= 0 && vol < V_OFF_L)
    mqtt.publish("rainwater/1/alert","tank low");
  if (!qualityOk)
    mqtt.publish("rainwater/1/alert","quality below limit");

  report(vol,turb,tds,useTank,qualityOk);
  delay(5000);                               // 0.2 Hz management loop
}`,
    explain: [
      { ref: 'float tankVolumeL()', txt: 'Turns the non-contact ultrasonic distance into a stored volume using the tank geometry, giving the litres figure the changeover logic and dashboard need.' },
      { ref: 'bool qualityOk = (turb < TURB_LIM) && (tds < TDS_LIM)', txt: 'Judges the stored water against fit-for-purpose limits for the intended use, not a potability standard — the honest scope of the monitor.' },
      { ref: 'if (!useTank && vol > V_ON_L  && qualityOk) setSource(true)', txt: 'Draws from the tank only when there is enough water and its quality is acceptable, maximising use of free rainwater.' },
      { ref: 'if ( useTank && (vol < V_OFF_L || !qualityOk))', txt: 'Falls back to mains when the tank runs low or quality drops, with V_on above V_off giving hysteresis so the source does not flicker.' },
      { ref: 'setSource(false);                          // default mains until proven', txt: 'On start-up the system defaults to mains, so a fresh boot or a sensor fault never leaves a tap dry while it works out the tank\'s state.' },
    ],
  }],

  config: [
    'Set the tank geometry (height, cross-section) so volume is accurate; set V_on/V_off and the quality limits for each intended use.',
    'Size V_FIRSTFLUSH_L to your roof area and typical dirtiness (a few litres per m²).',
    'Calibrate the turbidity and TDS scales and the flow-sensor pulses-per-litre.',
    'Configure reporting, alerts, and the manual valve override behaviour.',
  ],
  calibration: [
    { h: 'Tank volume', p: [
      'Verify computed volume against known added volumes at a couple of levels; correct the geometry constants.',
    ] },
    { h: 'Quality probes', p: [
      'Calibrate turbidity against a standard and TDS against a known solution; set fit-for-purpose limits for your uses.',
    ] },
    { h: 'Flow and first-flush', p: [
      'Calibrate the flow sensor\'s pulses-per-litre and confirm the diverter passes exactly the sized first-flush volume before admitting to the tank.',
    ] },
  ],
  testing: [
    { step: 'Add known water volumes', expect: 'Reported volume matches; changeover engages above V_on' },
    { step: 'Simulate rain onset with inflow', expect: 'Diverter sends first-flush to waste, then admits to tank by volume' },
    { step: 'Raise turbidity above the limit', expect: 'Quality flagged; source switches to mains' },
    { step: 'Draw the tank below V_off', expect: 'Switches to mains; low-tank alert; no flicker (hysteresis)' },
    { step: 'Trigger the manual override', expect: 'Valves respond manually regardless of controller state' },
    { step: 'Run a solar day/night cycle', expect: 'Battery covers the management loop and any valve actuation' },
  ],
  output: [
    'The dashboard shows tank volume with rain/use history, current turbidity/TDS/pH, the active source (tank/mains), cumulative water saved, and any alerts or first-flush/overflow events.',
    { file: 'rainwater-state.json', lang: 'json', body: `{
  "vol_l": 410,
  "turb": 34,
  "tds": 210,
  "source": "tank",
  "quality_ok": 1
}` },
    'Here the tank holds 410 L of acceptable-quality water (turbidity 34 NTU, TDS 210 ppm), so the system is drawing from the tank rather than mains — free water used, supply assured.',
  ],
  troubleshoot: [
    { sym: 'Volume reading noisy/wrong', cause: 'Ultrasonic echoes off inlet splash or ripples, or wrong geometry', fix: 'Aim clear of splash; median-filter pings; verify tank dimensions' },
    { sym: 'Tank fills with dirty water', cause: 'First-flush volume too small or diverter not working', fix: 'Increase V_FIRSTFLUSH_L for the roof; verify the diverter actuates and the flow sensor counts' },
    { sym: 'Source flickers tank/mains', cause: 'Insufficient hysteresis or noisy quality reads', fix: 'Widen V_on/V_off gap; average quality readings; add a dwell time' },
    { sym: 'Quality probes drift', cause: 'Fouling or ageing', fix: 'Clean probes; recalibrate; they need periodic maintenance' },
    { sym: 'Taps run dry', cause: 'Changeover or valve fault without override', fix: 'Default to mains on fault; ensure the manual override works; alert on valve faults' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → home water dashboard',
    net: {
      nodes: [{ name: 'Rainwater controller', sub: 'ESP32' }, { name: 'Tank sensors', sub: 'on the node' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'home network',
      uplink: 'MQTT 1883', cloud: 'Broker + dashboard', cloudSub: 'volume, quality, savings',
      clients: [{ name: 'Dashboard', sub: 'volume + source' }, { name: 'Phone', sub: 'low/quality alerts' }],
    },
    protocol: ['The controller publishes volume, quality and the active source on a slow cadence, with immediate publishes on changeover, first-flush/overflow events and alerts. Control is local; the dashboard is for visibility and history.'],
    topics: [
      { t: 'rainwater/1/state', dir: 'node → broker', payload: 'volume, turbidity, TDS, source, quality-ok' },
      { t: 'rainwater/1/event', dir: 'node → broker', payload: 'first-flush, overflow, changeover' },
      { t: 'rainwater/1/alert', dir: 'node → broker', payload: 'tank low, quality below limit, sensor fault' },
    ],
    cloud: ['A broker feeds a dashboard that trends stored volume against rainfall and use, logs quality across the season, and totals the mains water saved — the number that justifies the system.'],
    dashboard: ['Volume history with rain/use overlay, live quality gauges, active-source indicator, cumulative savings, and event markers for first-flush and overflow.'],
    mobile: ['Alerts for a low tank, quality dropping below the use limit, overflow, or a sensor/valve fault.'],
    security: [
      'Authenticate any remote valve/source commands; keep the manual override and safe-default-to-mains independent of the network.',
      'Protect the dashboard so household water data stays private.',
      'Alert on controller silence so a failed node is noticed before a tap runs dry.',
    ],
  },

  perf: [
    'A slow management loop (seconds) suffices — tank and quality change gradually; reserve fast response for the first-flush flow counting.',
    'Median-filter ultrasonic pings and average quality ADC samples for stable readings.',
    'On solar, the valves are the main momentary draw; size the battery for actuation plus standby.',
    'Log locally/aggregate to keep network traffic light while preserving season-long history.',
  ],
  safety: [
    'This monitors and manages water; it does not make rainwater potable — treat quality readings as fit-for-purpose guidance, and use proper filtration/disinfection for drinking water.',
    'Provide a manual override and default to mains on any fault so supply is never lost.',
    'Keep any cross-connection between rainwater and mains compliant with local plumbing codes (backflow prevention) to protect the mains supply.',
    'Use correctly-rated valves/relays and protect the electronics from the wet tank environment.',
  ],
  maintenance: [
    'Clean turbidity/TDS probes and recalibrate periodically; fouling biases quality.',
    'Check the first-flush diverter actuates and the flow sensor counts before the wet season.',
    'Inspect the tank and overflow, and verify the level sensor\'s line of sight is clear.',
    'Test the manual override and mains-default behaviour regularly.',
  ],
  future: [
    'Add inline filtration/UV with monitoring to extend usable quality toward potable (with proper validation).',
    'Forecast supply from a weather feed to pre-empt low-tank changeovers.',
    'Add per-outlet metering to attribute savings by use (garden vs toilets).',
    'Integrate with home automation for demand-aware use of stored water.',
  ],
  faq: [
    { q: 'What is the first flush and why automate it?', a: 'The initial runoff washes the roof\'s accumulated dirt into the downpipe. Diverting that first slug to waste keeps the tank clean. Automating it means the right volume is diverted every storm, not just when someone remembers.' },
    { q: 'Does it make the rainwater safe to drink?', a: 'No. It monitors and manages quality and switches sources, but making rainwater potable needs proper filtration and disinfection. Treat its readings as fit-for-purpose guidance, not a safety certification.' },
    { q: 'How does it decide tank versus mains?', a: 'It draws from the tank when the level is adequate and the quality is acceptable for the use, and falls back to mains when either fails — with hysteresis so it does not flicker between sources.' },
    { q: 'What if a valve or sensor fails?', a: 'It defaults to mains and there is a manual override, so a fault never leaves you without water. Faults are also alerted.' },
    { q: 'How much water will it actually save?', a: 'As much as your catchment supplies and your uses draw — the monitor maximises it by using tank water whenever it is adequate and clean, and logs the running total so you can see the saving.' },
  ],
  refs: [
    { t: 'Rainwater harvesting — overview', u: 'https://en.wikipedia.org/wiki/Rainwater_harvesting', s: 'Reference' },
    { t: 'First-flush diverters and water quality', u: 'https://en.wikipedia.org/wiki/First_flush', s: 'Reference' },
    { t: 'Turbidity and TDS in water quality', u: 'https://en.wikipedia.org/wiki/Total_dissolved_solids', s: 'Reference' },
    { t: 'Backflow prevention and cross-connection control', u: 'https://en.wikipedia.org/wiki/Backflow_prevention_device', s: 'Reference' },
    { t: 'Domestic rainwater system design (guidance)', u: 'https://www.cpheeo.gov.in/', s: 'Reference' },
  ],
  images: ['ultrasonic', 'esp32', 'grafana'],
  imageCaptions: [
    'A non-contact ultrasonic sensor reads the tank level to track stored rainwater volume.',
    'ESP32 module automating the first-flush diverter and the tank/mains changeover.',
    'A dashboard trends stored volume, water quality and the mains water saved over a season.',
  ],
},

];
