/* Environment batch A — 039 City Air Pollution Node, 040 River Water
   Quality Buoy, 041 Noise Pollution Mapper. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   039 — City Air Pollution Node
   ══════════════════════════════════════════════════════════════════ */
{
  id: '039',
  domainKey: 'iot',
  emoji: '🌫️', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'A low-cost, honestly-calibrated air-quality node that measures street-level pollution where people actually breathe — and knows the limits of what a cheap sensor can claim.',

  overview: [
    'Official air-quality monitoring is accurate but sparse: a city of millions might have a handful of reference stations, so the number on the app is an average of places you are not standing. Pollution, though, is intensely local — a busy junction, a construction site, a street canyon where exhaust pools can be several times worse than the citywide figure a few hundred metres away. A dense network of low-cost nodes fills that gap, mapping pollution at the scale people experience it. The catch, and the thing this project takes seriously, is that a cheap sensor is only useful if you are honest about what it can and cannot measure and you calibrate it against reference instruments rather than trusting the raw number.',
    'The node measures the pollutant that matters most for health, <b>fine particulate matter (PM2.5 and PM10)</b>, with an optical particle counter, alongside temperature, humidity and pressure — not as afterthoughts but because humidity in particular corrupts low-cost PM readings: humid air makes particles swell and scatter more light, so an uncorrected sensor reads high on damp mornings and fog. It optionally adds a gas channel (a metal-oxide sensor for a broad "VOC/oxidising gas" signal, or an NDIR CO₂ sensor) with the firm caveat that low-cost gas sensors are qualitative — good for trends and relative comparisons, poor for absolute regulated concentrations. The design philosophy throughout is calibrate, correct, and caveat.',
    'Because the whole value of the node is being cheap enough to deploy in numbers, it is built for exactly that: solar-plus-battery so it needs no mains, LoRa or Wi-Fi so it needs no wiring, and a weatherproof housing that shelters the electronics while letting outside air reach the sensor. It publishes a corrected reading and an AQI-style category to a map, applies a co-location calibration factor derived from sitting next to a reference station, and flags its own data quality so a fogged-out PM reading is marked as such rather than fed to the map as truth. One node is a curiosity; a hundred honest nodes are a street-level pollution map a city can act on.',
  ],
  does: [
    'Measures fine particulate matter (PM2.5, PM10) with an optical counter',
    'Measures temperature, humidity and pressure, and humidity-corrects the PM reading',
    'Optionally adds a qualitative gas channel (VOC/CO₂), clearly caveated',
    'Applies a co-location calibration factor against a reference station',
    'Computes an AQI-style category and flags its own data quality',
    'Runs on solar + battery and reports over LoRa or Wi-Fi to a map',
    'Marks unreliable readings (e.g. fog/high humidity) rather than hiding them',
  ],
  features: [
    'Health-relevant PM2.5/PM10 at street level, where people breathe',
    'Humidity correction — the single biggest low-cost PM error source',
    'Co-location calibration against reference instruments',
    'Honest data-quality flags instead of false precision',
    'Solar + LoRa/Wi-Fi for dense, wiring-free deployment',
    'AQI-style categories for public-facing maps',
    'Designed for networks: cheap, self-reporting, comparable nodes',
  ],
  applications: [
    { t: 'Community air-quality networks', d: 'Neighbourhood groups and NGOs building street-level pollution maps to reveal hotspots that sparse official stations miss.' },
    { t: 'School and campus monitoring', d: 'Showing children and staff real, local exposure and informing decisions about outdoor activity on bad-air days.' },
    { t: 'Traffic and construction impact studies', d: 'Quantifying how much a junction, a building site or a policy change shifts local pollution over time.' },
    { t: 'Personal and workplace awareness', d: 'A calibrated node at home or work giving trustworthy trends where the nearest official station is kilometres away.' },
  ],
  skills: [
    'Reading an optical PM sensor (PMS5003) over UART and interpreting its outputs',
    'Humidity-correcting low-cost particulate readings',
    'Co-location calibration against a reference monitor',
    'Computing AQI categories and honest data-quality flags',
    'Solar + LoRa/Wi-Fi design for outdoor networked nodes',
  ],
  prereq: [
    'Low-cost PM sensors read high in humid air; a humidity correction (or flagging high-RH data) is not optional.',
    'Low-cost gas sensors are qualitative — use them for trends and relative comparison, never as regulated absolute concentrations.',
    'The node is only trustworthy after co-location: run it beside a reference station to derive its correction factor before trusting the map.',
  ],

  parts: ['esp32', 'pms5003', 'bme280', 'mq135', 'mhz19', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Weatherproof vented housing', spec: 'Shelters electronics, allows free-flowing outside air to the PM inlet, keeps rain/insects out', qty: 1, price: 500, note: 'A Stevenson-style or louvred housing; a sealed box gives false readings' },
    { name: 'PM inlet filter/insect screen', spec: 'Fine mesh at the PMS5003 inlet to keep insects out without restricting flow', qty: 1, price: 60 },
    { name: 'Reference co-location time (access)', spec: 'Time beside a regulatory monitor to derive calibration', qty: 1, price: 0, note: 'Not hardware — but essential to the node\'s validity' },
  ],
  cost: '₹3,600 – ₹4,800',
  libs: ['wifi', 'pubsub', 'bme', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'PMS5003', devPin: 'TX/RX', pin: 'GPIO 16/17', sig: 'UART PM2.5/PM10 counts' },
      { dev: 'PMS5003', devPin: 'SET', pin: 'GPIO 26', sig: 'Sleep/wake (duty-cycle the fan)' },
      { dev: 'BME280', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Temp/RH/pressure (I²C)' },
      { dev: 'MQ135 / MH-Z19', devPin: 'AOUT / UART', pin: 'GPIO 34 / 4', sig: 'Optional gas channel' },
    ],
    right: [
      { dev: 'LoRa SX1276', devPin: 'SCK/MISO/MOSI', pin: 'GPIO 18/19/23', sig: 'SPI radio bus' },
      { dev: 'LoRa SX1276', devPin: 'NSS/RST/DIO0', pin: 'GPIO 5/14/2', sig: 'Chip-select, reset, IRQ' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar-charged 18650 supply' },
      { dev: 'Solar panel', devPin: '+/–', pin: 'TP4056 IN', sig: '6 V panel → charger' },
    ],
  },
  wiringNotes: [
    'Mount the PMS5003 so its inlet draws genuine outside air inside a vented housing — never a sealed box, which traps stale air and gives meaningless readings.',
    'Duty-cycle the PM sensor via its SET pin: its fan and laser draw meaningful current and wear out, so wake it, let the reading settle for ~30 s, sample, then sleep it.',
    'Keep the BME280 in the same airflow as the PM inlet so its humidity truly represents the air whose PM you are correcting.',
    'If using the MQ135, give it a stable warmed supply and long warm-up; treat its output as a qualitative index, and keep its heater noise off the PM sensor\'s ground.',
    'Screen the inlet against insects with fine mesh that does not restrict the airflow the optical counter depends on.',
  ],

  block: { columns: [
    { label: 'Sense the air', edge: 'right', blocks: [
      { name: 'PM2.5/PM10', sub: 'PMS5003 optical', highlight: true },
      { name: 'T/RH/P', sub: 'BME280' },
      { name: 'Gas (opt)', sub: 'MQ135 / CO₂' },
    ] },
    { label: 'Correct + rate', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'humidity correction' },
      { name: 'Calibration', sub: 'co-location factor' },
      { name: 'AQI + quality', sub: 'category + flags' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'LoRa / Wi-Fi', sub: 'to map' },
    ] },
    { label: 'Public', edge: 'none', blocks: [
      { name: 'Air map', sub: 'street-level' },
      { name: 'Alert', sub: 'bad-air days' },
    ] },
  ] },
  flow: [
    { t: 'Wake PM sensor, settle fan', k: 'start' },
    { t: 'Read PM, T, RH, P (+gas)', k: 'proc' },
    { t: 'Humidity within valid range?', k: 'dec', yes: 'Apply RH + calibration correction', no: 'Flag data quality: high-RH' },
    { t: 'Apply RH + calibration correction', k: 'proc' },
    { t: 'Flag data quality: high-RH', k: 'io' },
    { t: 'Compute AQI category', k: 'proc' },
    { t: 'Transmit corrected value + flags', k: 'io' },
    { t: 'Sleep PM sensor; wait interval', k: 'end', back: 'Wake PM sensor, settle fan' },
  ],

  principle: [
    'The health case for this node rests almost entirely on fine particulate matter. Particles smaller than 2.5 micrometres (PM2.5) penetrate deep into the lungs and cross into the bloodstream, and epidemiology ties them to a large share of air-pollution\'s health burden. A low-cost optical particle counter like the PMS5003 estimates PM by drawing air past a laser and measuring how much light suspended particles scatter, then inferring a mass concentration. That inference is the sensor\'s strength (cheap, real-time, sensitive to the size range that matters) and its weakness (it assumes particle properties that vary, and it is fooled by anything else that scatters light).',
    'The most important correction is for <b>humidity</b>. Many airborne particles are hygroscopic — they absorb water and swell as humidity rises — so in damp air the same amount of pollutant scatters more light and the sensor over-reads, sometimes dramatically on foggy mornings when there is barely any actual pollution. A node that ignores this will publish alarming PM spikes that are really just weather. The fix is to measure humidity alongside PM and apply a correction that grows with relative humidity, and to flag or discard readings above a very high humidity where no correction is trustworthy. This single correction is the difference between a node that informs and one that misleads.',
    '<b>Calibration by co-location</b> is what turns a hobby sensor into a credible one. Because low-cost sensors have unit-to-unit variation and a systematic offset from reference instruments, the accepted practice is to run the node for a period right beside a regulatory-grade monitor, compare the two, and derive a correction (often a linear factor plus the humidity term). Applied thereafter, that factor aligns the cheap node with the reference. Without co-location, a network of nodes is internally comparable at best and absolutely wrong at worst; with it, the nodes become a genuine extension of the reference network at higher spatial density.',
    'Everything else follows from <b>honesty about uncertainty</b>. The optional gas sensor gets a trend, not a number, because metal-oxide sensors drift and cross-respond to many gases. Each transmitted reading carries a data-quality flag — good, humidity-suspect, sensor-warming, out-of-range — so the map can show or grey-out accordingly. An AQI-style category communicates risk in language the public understands without implying laboratory precision. The node\'s credibility, and therefore its usefulness, comes from claiming exactly as much as a cheap sensor can support and no more.',
  ],
  equations: [
    { t: 'Humidity correction of low-cost PM', eq: 'Hygroscopic growth inflates scattered light at high RH.\nA common correction form:\n\n  PM_corr = PM_raw / (1 + a · (RH/100)^b / (1 − RH/100))\n\na, b are fitted during co-location (κ-Köhler-style growth).\nAbove ~RH 85–90% no correction is reliable → flag/discard.\nThis removes the fog/humid-morning false spikes.' },
    { t: 'Co-location calibration (linear + RH)', eq: 'Fit node output to a reference monitor:\n\n  PM_ref ≈ m · PM_corr + c\n\nm (slope) and c (offset) come from regression over a\nco-location period spanning a range of concentrations.\nStore m, c and the humidity coefficients per node —\nlow-cost sensors vary unit to unit.' },
    { t: 'AQI category from PM2.5', eq: 'Map corrected PM2.5 (µg/m³) to an AQI band via the\npiecewise-linear breakpoints of the standard used\n(e.g. Indian NAQI or US EPA):\n\n  AQI = ((I_hi − I_lo)/(C_hi − C_lo))·(C − C_lo) + I_lo\n\nwhere C sits in the [C_lo, C_hi] concentration band with\nindex range [I_lo, I_hi]. Report the band name (Good/\nModerate/Poor/…) for the public, the number for analysts.' },
  ],

  assembly: [
    { h: 'Build the vented housing', p: [
      'Fit the PMS5003 with its inlet exposed to free-flowing outside air inside a louvred/Stevenson-style housing that keeps rain and direct sun off the electronics but does not seal the air in.',
      'Screen the inlet against insects with fine mesh and mount the housing away from very local sources (not directly over an exhaust or a barbecue) unless you specifically want that microenvironment.',
    ], warn: 'A sealed enclosure is the classic beginner mistake: it traps stale air, over-heats, and makes every reading meaningless. The housing must breathe.' },
    { h: 'Wire and duty-cycle the sensors', p: [
      'Connect the PMS5003 over UART with its SET pin on a GPIO so firmware can sleep the fan/laser between reads. Place the BME280 in the same airflow.',
      'If fitting a gas sensor, give it a clean warmed supply and accept a long stabilisation time; keep its heater current off the PM sensor ground.',
    ] },
    { h: 'Set up power and radio', p: [
      'Angle the solar panel to the sun and route the LoRa antenna clear of metal. Ensure the battery and charger sit in the sheltered part of the housing, not in the wet airflow.',
    ] },
  ],
  steps: [
    { h: 'Duty-cycle the PM sensor correctly', p: [
      'Wake the PMS5003, let its fan run ~30 seconds so the airflow and reading stabilise, average several samples, then sleep it. This saves power and greatly extends the fan/laser life.',
    ], tip: 'Never sample immediately on wake — the first readings before the fan settles are unreliable.' },
    { h: 'Apply the corrections in order', p: [
      'Correct the raw PM for humidity first, then apply the co-location slope/offset, then map to AQI, and attach a data-quality flag reflecting humidity, warm-up and range.',
    ], code: {
      file: 'pm-correct.ino', lang: 'cpp',
      body: `struct Reading { float pm25, pm10, rh, temp; uint8_t quality; };
enum { Q_GOOD=0, Q_HUMID=1, Q_WARMING=2, Q_RANGE=3 };

// Node-specific constants from co-location, stored in flash.
float RH_A, RH_B, CAL_M, CAL_C;

// Humidity correction then linear calibration; sets a quality flag.
float correctPM(float raw, float rh, uint8_t &quality) {
  if (rh > 90.0f) { quality = Q_HUMID; return raw; }   // no trustworthy fix
  float growth = 1.0f + RH_A * powf(rh/100.0f, RH_B) / (1.0f - rh/100.0f);
  float dehumid = raw / growth;                          // remove swelling
  return CAL_M * dehumid + CAL_C;                        // align to reference
}

// Piecewise-linear AQI (breakpoints per the standard in use).
int aqiFromPM25(float c) {
  static const float C[] = {0,30,60,90,120,250,500};    // NAQI-style bands
  static const int   I[] = {0,50,100,200,300,400,500};
  for (int k = 1; k < 7; k++)
    if (c <= C[k])
      return (int)((I[k]-I[k-1])/(C[k]-C[k-1])*(c-C[k-1]) + I[k-1]);
  return 500;
}`,
      explain: [
        { ref: 'if (rh > 90.0f)', txt: 'Above very high humidity no correction is trustworthy, so the reading is passed through but flagged Q_HUMID rather than being "corrected" with a formula that no longer holds.' },
        { ref: 'float growth = 1.0f + RH_A', txt: 'Models the hygroscopic swelling of particles as a function of humidity and divides it out — removing the fog and damp-morning false spikes that fool uncorrected sensors.' },
        { ref: 'return CAL_M * dehumid + CAL_C', txt: 'Applies the node\'s own co-location slope and offset so its output aligns with the reference monitor it was calibrated against.' },
        { ref: 'int aqiFromPM25(float c)', txt: 'Converts the corrected concentration into a standard AQI number via piecewise-linear breakpoints, which the map turns into a public-friendly band name.' },
      ],
    } },
    { h: 'Transmit with flags and sleep', p: [
      'Send the corrected PM2.5/PM10, AQI, the raw values, humidity and the data-quality flag, then sleep the PM sensor and the radio until the next interval.',
    ] },
  ],

  code: [{
    file: 'city-air-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   City Air Pollution Node — ESP32, PMS5003, BME280, LoRa, solar

   Measures street-level PM2.5/PM10, humidity-corrects it, applies a
   co-location calibration, computes AQI, flags data quality, and
   reports over LoRa/Wi-Fi. Honest about low-cost-sensor limits.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>

#define PMS_RX     16
#define PMS_TX     17
#define PMS_SET    26     // LOW = sleep fan/laser
#define LORA_CS     5
#define LORA_RST   14
#define LORA_DIO0   2
#define SLEEP_S   300     // 5 min duty cycle

Adafruit_BME280 bme;
Preferences     prefs;
HardwareSerial  pms(2);

float RH_A, RH_B, CAL_M, CAL_C;
enum { Q_GOOD=0, Q_HUMID=1, Q_WARMING=2, Q_RANGE=3 };

/* ── read a PMS5003 frame (32 bytes, 0x42 0x4D header) ───────── */
bool readPMS(float &pm25, float &pm10) {
  uint8_t b[32]; int n = 0; unsigned long t0 = millis();
  while (n < 32 && millis() - t0 < 2000) {
    if (pms.available()) {
      uint8_t c = pms.read();
      if (n == 0 && c != 0x42) continue;      // resync to header
      if (n == 1 && c != 0x4D) { n = 0; continue; }
      b[n++] = c;
    }
  }
  if (n < 32) return false;
  uint16_t sum = 0; for (int i = 0; i < 30; i++) sum += b[i];
  if (sum != ((b[30] << 8) | b[31])) return false;   // checksum
  pm25 = (b[12] << 8) | b[13];               // atmospheric PM2.5
  pm10 = (b[14] << 8) | b[15];               // atmospheric PM10
  return true;
}

float correctPM(float raw, float rh, uint8_t &q) {
  if (rh > 90.0f) { q = Q_HUMID; return raw; }
  float growth = 1.0f + RH_A * powf(rh/100.0f, RH_B) / (1.0f - rh/100.0f);
  return CAL_M * (raw / growth) + CAL_C;
}

int aqiFromPM25(float c) {
  static const float C[] = {0,30,60,90,120,250,500};
  static const int   I[] = {0,50,100,200,300,400,500};
  for (int k = 1; k < 7; k++)
    if (c <= C[k])
      return (int)((I[k]-I[k-1])/(C[k]-C[k-1])*(c-C[k-1]) + I[k-1]);
  return 500;
}

void transmit(float pm25c, float pm10c, float pm25raw,
              float rh, float temp, int aqi, uint8_t q) {
  LoRa.beginPacket();
  LoRa.printf("{\\"node\\":1,\\"pm25\\":%.1f,\\"pm10\\":%.1f,\\"pm25_raw\\":%.1f,"
              "\\"rh\\":%.0f,\\"t\\":%.1f,\\"aqi\\":%d,\\"q\\":%d}",
              pm25c, pm10c, pm25raw, rh, temp, aqi, q);
  LoRa.endPacket();
}

void loadCal() {
  prefs.begin("air", true);
  RH_A  = prefs.getFloat("rhA", 0.25f);
  RH_B  = prefs.getFloat("rhB", 1.0f);
  CAL_M = prefs.getFloat("m", 1.0f);
  CAL_C = prefs.getFloat("c", 0.0f);
  prefs.end();
}

void setup() {
  Serial.begin(115200);
  loadCal();
  pinMode(PMS_SET, OUTPUT);
  pms.begin(9600, SERIAL_8N1, PMS_RX, PMS_TX);
  Wire.begin(21, 22);
  bme.begin(0x76);

  // wake PM sensor and let the fan settle before sampling
  digitalWrite(PMS_SET, HIGH);
  delay(30000);

  float pm25 = 0, pm10 = 0; int good = 0;
  for (int i = 0; i < 5; i++) {                 // average a few frames
    float a, b;
    if (readPMS(a, b)) { pm25 += a; pm10 += b; good++; }
    delay(1000);
  }
  digitalWrite(PMS_SET, LOW);                   // sleep the fan/laser

  float rh = bme.readHumidity();
  float temp = bme.readTemperature();
  uint8_t q = good ? Q_GOOD : Q_RANGE;
  if (good) { pm25 /= good; pm10 /= good; }

  float pm25c = correctPM(pm25, rh, q);
  float pm10c = correctPM(pm10, rh, q);
  int   aqi   = aqiFromPM25(pm25c);

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);
  transmit(pm25c, pm10c, pm25, rh, temp, aqi, q);

  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_S * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'bool readPMS(', txt: 'Parses the PMS5003\'s 32-byte frame, resynchronising to the 0x42 0x4D header and verifying the checksum so a garbled UART read is rejected rather than published.' },
      { ref: 'digitalWrite(PMS_SET, HIGH);\n  delay(30000);', txt: 'Wakes the fan and laser and waits half a minute for the airflow to stabilise before any sample is taken — sampling on cold-start gives unreliable numbers.' },
      { ref: 'for (int i = 0; i < 5; i++)', txt: 'Averages several valid frames to beat the frame-to-frame noise of an optical counter, counting how many were good for the quality flag.' },
      { ref: 'digitalWrite(PMS_SET, LOW);', txt: 'Immediately sleeps the fan/laser after sampling, which both saves solar power and greatly extends the sensor\'s limited fan life.' },
      { ref: 'transmit(pm25c, pm10c, pm25,', txt: 'Sends both the corrected and the raw PM plus humidity and the quality flag, so the map can trust, correct, or grey-out each reading transparently.' },
    ],
  }],

  config: [
    'Load the node\'s co-location constants (humidity coefficients, slope, offset) into flash after calibration.',
    'Set the AQI breakpoints to the standard you report against (e.g. Indian NAQI or US EPA).',
    'Choose the duty-cycle interval (5 min is common) balancing map freshness against fan life and power.',
    'Pick the region-legal LoRa frequency or configure Wi-Fi/MQTT, and set the high-humidity flag threshold.',
  ],
  calibration: [
    { h: 'Co-location', p: [
      'Run the node beside a reference monitor for a period spanning a range of concentrations and humidities; regress its corrected output against the reference to get slope, offset and the humidity coefficients.',
    ] },
    { h: 'Humidity term', p: [
      'Confirm that after correction, damp-morning/fog spikes disappear relative to the reference; adjust RH_A/RH_B if the node still over-reads at high humidity.',
    ] },
    { h: 'Gas channel (if fitted)', p: [
      'Do not attempt an absolute calibration of a low-cost gas sensor; establish a clean-air baseline and report only relative trends.',
    ] },
  ],
  testing: [
    { step: 'Sample immediately on wake vs after fan settle', expect: 'Settled readings are stable; cold-start readings are not — confirming the warm-up matters' },
    { step: 'Breathe/smoke near the inlet briefly', expect: 'PM rises and recovers; frame checksum validates each read' },
    { step: 'Expose to a foggy/high-humidity morning', expect: 'Raw PM spikes; corrected PM stays sane or the reading is flagged Q_HUMID' },
    { step: 'Compare to the reference during co-location', expect: 'Corrected node tracks the reference within expected low-cost tolerance' },
    { step: 'Run a solar day/night cycle', expect: 'Battery recovers; duty-cycling keeps power sustainable' },
  ],
  output: [
    'The map shows each node as a coloured dot (AQI band), expanding to corrected PM2.5/PM10, humidity, the raw value and the data-quality flag.',
    { file: 'air-packet.json', lang: 'json', body: `{
  "node": 1,
  "pm25": 47.2,
  "pm10": 68.9,
  "pm25_raw": 61.0,
  "rh": 82,
  "t": 24.1,
  "aqi": 128,
  "q": 0
}` },
    'Here the raw PM2.5 of 61 is corrected down to 47 after removing humidity-driven swelling, giving an AQI of 128 (Moderate) — the correction preventing a damp evening from being reported as far worse than it is.',
  ],
  troubleshoot: [
    { sym: 'Readings spike every humid morning', cause: 'No humidity correction; hygroscopic particle growth', fix: 'Apply the RH correction; flag/discard above ~90% RH; this is the classic false-spike' },
    { sym: 'Node reads consistently high/low vs reference', cause: 'Not co-location calibrated, or unit variation', fix: 'Run a co-location and apply the derived slope/offset' },
    { sym: 'PM values are noisy/jumpy', cause: 'Sampling before the fan settles, or too few frames', fix: 'Wait ~30 s after wake and average several validated frames' },
    { sym: 'All PM reads fail (checksum)', cause: 'UART wiring/baud wrong, or sensor asleep', fix: 'Confirm TX/RX and 9600 baud; ensure SET is high before reading' },
    { sym: 'Gas channel drifts wildly', cause: 'Expecting absolute values from a low-cost gas sensor', fix: 'Report only relative trends; re-baseline in clean air; do not present as regulated concentration' },
  ],

  iot: {
    protoShort: 'LoRa/Wi-Fi → gateway → air-map broker',
    net: {
      nodes: [{ name: 'Air node', sub: 'ESP32 + PMS5003' }, { name: 'Other nodes', sub: 'across the city' }],
      protocol: 'LoRa / Wi-Fi', gateway: 'City gateway', gatewaySub: 'to MQTT',
      uplink: 'MQTT 1883', cloud: 'Broker + map', cloudSub: 'corrected + flagged',
      clients: [{ name: 'Public map', sub: 'street-level AQI' }, { name: 'Phone', sub: 'bad-air alerts' }],
    },
    protocol: ['Each node publishes corrected PM, raw PM, humidity, AQI and a data-quality flag every few minutes. Sending both raw and corrected values plus the flag lets the map apply network-wide calibration and honestly show or grey-out each reading.'],
    topics: [
      { t: 'air/node/1/reading', dir: 'node → broker', payload: 'PM2.5/10 corrected+raw, RH, AQI, quality' },
      { t: 'air/node/1/status', dir: 'node → broker', payload: 'battery, RSSI, calibration date' },
      { t: 'air/node/1/cal', dir: 'broker → node', payload: 'push updated calibration constants' },
    ],
    cloud: ['A broker feeds a map that renders street-level AQI, and can push refreshed calibration constants to nodes as new co-location data arrives — so the whole network improves over time.'],
    dashboard: ['A city map of coloured node dots with a time-slider, plus per-node history overlaying corrected and raw PM against humidity so anomalies are explainable.'],
    mobile: ['Alerts when a user\'s local node (or their saved area) crosses into an unhealthy AQI band.'],
    security: [
      'Sign each reading with a per-node key so the public map cannot be poisoned by spoofed nodes.',
      'Version and authenticate calibration pushes so only the network operator can change a node\'s constants.',
      'Publish the data-quality flag openly so users can judge reliability themselves.',
    ],
  },

  perf: [
    'Duty-cycle the PMS5003 aggressively — its fan and laser are the main power draw and the main wear item.',
    'Average several validated frames per read rather than sampling continuously.',
    'Deep-sleep between intervals; a 5-minute cadence is fine for a pollution map and easy on solar.',
    'Send compact packets and let the cloud handle heavy analytics and mapping.',
  ],
  safety: [
    'Present readings honestly: a low-cost node informs and maps trends; it is not a regulatory instrument, and the UI should say so.',
    'Never report the gas channel as an absolute regulated concentration.',
    'Mount housings securely and safely at street level, clear of traffic and tampering.',
    'Keep the lithium battery and charger sheltered from the wet airflow the PM inlet needs.',
  ],
  maintenance: [
    'Re-run co-location periodically; low-cost sensors drift over months.',
    'Clean the inlet screen and check for insect ingress that restricts airflow.',
    'Replace the PM sensor when its fan noise rises or readings degrade — it is a wear part.',
    'Keep the solar panel clean and verify the calibration date shown on the map is current.',
  ],
  future: [
    'Fuse many nodes with reference stations in a spatial model for a continuously-calibrated citywide field.',
    'Add a proper NO₂/O₃ electrochemical channel for the traffic-related gases PM misses.',
    'Machine-learn the humidity/calibration correction per node from ongoing co-location.',
    'Add source attribution (traffic vs dust vs burning) from PM size ratios and diurnal patterns.',
  ],
  faq: [
    { q: 'Is a cheap node accurate enough to be useful?', a: 'After humidity correction and co-location calibration, yes — for mapping trends and hotspots at high spatial density. It is not a regulatory instrument, and the design says so with data-quality flags rather than pretending otherwise.' },
    { q: 'Why does humidity matter so much?', a: 'Many particles absorb water and swell in damp air, scattering more light, so an uncorrected optical sensor over-reads on foggy mornings. Correcting for humidity removes those false spikes.' },
    { q: 'What is co-location and why is it essential?', a: 'Running the node beside a reference monitor to derive a correction factor. Low-cost sensors have offsets and unit variation; co-location aligns them to truth and makes a network credible.' },
    { q: 'Can it measure CO₂ or toxic gases accurately?', a: 'Only qualitatively. Low-cost gas sensors drift and cross-respond, so the node reports gas as a relative trend, never as a regulated absolute value.' },
    { q: 'How dense can a network be?', a: 'As dense as you can deploy nodes — that is the whole point. Cheap, solar, wireless, comparable nodes let you map pollution street by street where official stations are kilometres apart.' },
  ],
  refs: [
    { t: 'WHO — ambient air pollution and health', u: 'https://www.who.int/health-topics/air-pollution', s: 'WHO' },
    { t: 'US EPA — air sensor guidebook and correction methods', u: 'https://www.epa.gov/air-sensor-toolbox', s: 'US EPA' },
    { t: 'PMS5003 optical particle sensor (datasheet)', u: 'https://www.plantower.com/', s: 'Plantower' },
    { t: 'Hygroscopic growth and low-cost PM correction — literature', u: 'https://en.wikipedia.org/wiki/Particulates', s: 'Reference' },
    { t: 'Air Quality Index — computation and breakpoints', u: 'https://en.wikipedia.org/wiki/Air_quality_index', s: 'Reference' },
  ],
  images: ['city', 'esp32', 'lora'],
  imageCaptions: [
    'A dense network of low-cost nodes maps pollution at the street scale that sparse official stations miss.',
    'ESP32 module reading the optical PM sensor, correcting for humidity and applying the co-location calibration.',
    'A LoRa radio carries corrected, quality-flagged readings from each node to the citywide air map.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   040 — River Water Quality Buoy
   ══════════════════════════════════════════════════════════════════ */
{
  id: '040',
  domainKey: 'iot',
  emoji: '🛟', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A self-powered floating station that logs pH, turbidity and dissolved oxygen along a river, catching pollution events that a monthly grab-sample would never see.',

  overview: [
    'A river\'s health is usually judged from a grab sample: someone drives to a bridge once a month, dips a bottle, and sends it to a lab. It is accurate for that instant, but a river is not a constant — a factory discharge at 2 a.m., a slug of run-off after a storm, a diurnal swing in oxygen as aquatic plants photosynthesise by day and respire by night — all come and go between visits, invisible to monthly sampling. This buoy trades a little laboratory accuracy for continuous presence: it sits in the water day and night, logging the key water-quality signals, so a pollution event that lasts hours is captured with its timing and magnitude instead of being missed entirely.',
    'It measures the three parameters that reveal most about a river cheaply and continuously: <b>dissolved oxygen</b>, the master variable for aquatic life, whose crashes signal pollution or eutrophication; <b>pH</b>, which shifts with industrial discharges, acid run-off and biological activity; and <b>turbidity</b>, the cloudiness that tracks sediment, run-off and many effluents and is often the first visible sign something has entered the water. Water temperature is logged alongside because it governs oxygen solubility and biological rate, and EC/TDS optionally tracks dissolved salts and pollution load. Together these paint a live picture of the river\'s state and, crucially, its <i>changes</i>.',
    'Surviving in a river is its own engineering problem, and the design takes it seriously: the buoy is solar-powered because there is no mains in a river, communicates over LoRa or cellular because there is no Wi-Fi, is sealed and ruggedised against constant immersion, fouling and debris, and logs locally so a lost link never loses data. It timestamps everything, flags sensor faults and fouling, and raises an alert when a parameter crosses into a danger zone or changes abruptly — the signature of a discharge event. It cannot replace a certified lab, but it can tell you <i>when</i> to send someone with a bottle, which is often the difference between catching a polluter and cleaning up after them.',
  ],
  does: [
    'Continuously logs dissolved oxygen, pH, turbidity and water temperature',
    'Optionally logs EC/TDS as a dissolved-pollution-load proxy',
    'Timestamps all data and detects abrupt changes that signal discharge events',
    'Alerts when a parameter enters a danger zone (e.g. DO crash, pH swing)',
    'Runs on solar + battery as a moored floating station',
    'Reports over LoRa or cellular and logs locally through link outages',
    'Flags sensor faults and biofouling rather than reporting bad data',
  ],
  features: [
    'Continuous presence that catches transient pollution events',
    'DO, pH and turbidity — the highest-value continuous river signals',
    'Change-detection for discharge events, not just fixed thresholds',
    'Temperature-compensated DO and pH',
    'Rugged, sealed, solar, moored design for life in a river',
    'Local logging + LoRa/cellular for remote reaches',
    'Fouling/fault flags to keep the record honest',
  ],
  applications: [
    { t: 'Pollution watchdog / regulator', d: 'Continuous monitoring below industrial or urban outfalls to catch and time discharge events that monthly sampling misses.' },
    { t: 'Community river-keeper groups', d: 'Citizen-science networks watching a catchment and building evidence of pollution trends and events.' },
    { t: 'Drinking-water intake protection', d: 'Early warning upstream of an abstraction point so operators can react to a contamination slug before it reaches the intake.' },
    { t: 'Ecological and fisheries monitoring', d: 'Tracking dissolved-oxygen regimes and their diurnal swings that determine whether a reach can support fish.' },
  ],
  skills: [
    'Calibrating and temperature-compensating pH, DO and turbidity probes',
    'Designing a rugged, sealed, solar-powered floating platform',
    'Change/anomaly detection for event flagging',
    'LoRa/cellular telemetry with local logging fallback',
    'Managing biofouling and its effect on submerged sensors',
  ],
  prereq: [
    'Submerged probes foul with algae and biofilm within weeks; plan for anti-fouling and flag drift, or the data slowly lies.',
    'DO and pH are temperature-dependent — always log and compensate with water temperature.',
    'Mooring and waterproofing must survive floods and debris; a buoy that sinks or drifts away logs nothing.',
    'Continuous readings indicate when to take a certified grab sample; they do not replace laboratory analysis for enforcement.',
  ],

  parts: ['esp32', 'dissolvedo2', 'ph', 'turbidity', 'ds18b20', 'tds', 'lora', 'solarpanel', 'mppt', 'li18650'],
  extraParts: [
    { name: 'Buoy hull + mooring', spec: 'Sealed floating hull, ballast, anchor line rated for flood flow', qty: 1, price: 1800, note: 'Must survive debris and floods; the platform is half the project' },
    { name: 'Waterproof probe glands + sonde housing', spec: 'IP68 pass-throughs; probes below the waterline, electronics dry above', qty: 1, price: 700 },
    { name: 'Anti-fouling measures', spec: 'Copper tape/mesh or wiper on optical faces to slow biofilm', qty: 1, price: 300, note: 'Fouling is the number-one long-term failure mode' },
    { name: 'Cellular modem (optional)', spec: 'For reaches without LoRa gateway coverage', qty: 1, price: 900, note: 'LoRa preferred where a gateway exists' },
  ],
  cost: '₹7,500 – ₹11,000',
  libs: ['wifi', 'pubsub', 'onewire', 'unified', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'DO probe', devPin: 'AOUT', pin: 'GPIO 34 (ADC)', sig: 'Dissolved oxygen' },
      { dev: 'pH probe', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'pH via BNC amp' },
      { dev: 'Turbidity', devPin: 'AOUT', pin: 'GPIO 32 (ADC)', sig: 'Optical cloudiness (NTU)' },
      { dev: 'DS18B20', devPin: 'DQ', pin: 'GPIO 4', sig: 'Water temperature' },
    ],
    right: [
      { dev: 'TDS/EC', devPin: 'AOUT', pin: 'GPIO 33 (ADC)', sig: 'Dissolved solids (optional)' },
      { dev: 'LoRa/cellular', devPin: 'bus', pin: 'SPI / UART', sig: 'Telemetry uplink' },
      { dev: 'MPPT + panel', devPin: 'OUT', pin: 'Battery bus', sig: 'Solar charging' },
      { dev: '18650 pack', devPin: '+/–', pin: '3V3 reg', sig: 'Buffered supply' },
    ],
  },
  wiringNotes: [
    'Mount the probes below the waterline through IP68 glands, with all electronics in a sealed dry compartment above; a single leak drowns the station.',
    'Put the pH electrode on a proper high-impedance BNC amplifier and keep analogue probe grounds quiet and separate from the modem\'s current spikes.',
    'Place the DS18B20 at the same depth as the DO/pH probes so its temperature genuinely compensates them.',
    'Fit the turbidity sensor\'s optical faces where a wiper or anti-fouling can keep them clear; a fouled optical face reads ever-rising false turbidity.',
    'Use an MPPT charger so the panel keeps the pack topped through short winter days and long overcast spells on the water.',
  ],

  block: { columns: [
    { label: 'In the water', edge: 'right', blocks: [
      { name: 'Dissolved O₂', sub: 'aquatic-life master', highlight: true },
      { name: 'pH', sub: 'discharge signal' },
      { name: 'Turbidity', sub: 'run-off/effluent' },
      { name: 'Water temp', sub: 'DS18B20' },
    ] },
    { label: 'On the buoy', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'compensate + detect' },
      { name: 'Log', sub: 'local, timestamped' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'LoRa/cellular', sub: 'remote reach' },
    ] },
    { label: 'Watcher', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'river trends' },
      { name: 'Alert', sub: 'event → grab sample' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Read DO, pH, turbidity, temp', k: 'proc' },
    { t: 'Temperature-compensate DO + pH', k: 'proc' },
    { t: 'Abrupt change or danger zone?', k: 'dec', yes: 'Alert: possible discharge event', no: 'Log trend' },
    { t: 'Alert: possible discharge event', k: 'io' },
    { t: 'Log trend', k: 'proc' },
    { t: 'Transmit + local log', k: 'io' },
    { t: 'Sleep until next interval', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'The buoy\'s power is temporal, not analytical. A certified lab beats it on accuracy for any single sample, but the lab sees the river once a month; the buoy sees it every few minutes, forever. Rivers change on every timescale — a storm slug of turbid run-off over hours, an illicit discharge over a single night, the daily rise and fall of dissolved oxygen as photosynthesis by day gives way to respiration by night. These are exactly the phenomena grab-sampling is blind to, and exactly what continuous monitoring reveals. The design accepts modest per-reading accuracy to gain the thing that actually catches pollution: presence.',
    '<b>Dissolved oxygen</b> is the river\'s master health variable, and its behaviour is doubly informative. Its absolute level determines whether fish and invertebrates can live in a reach; its <i>pattern</i> diagnoses the river\'s metabolism. A healthy stream shows a gentle diurnal DO swing; a river choked with nutrients (eutrophic) shows violent swings — supersaturated by afternoon, crashing to near-zero before dawn — and an organic pollution event drives DO down as microbes consume oxygen breaking down the waste. Because oxygen solubility falls as water warms, DO must always be interpreted together with temperature, and reported both as an absolute (mg/L, for the fish) and as a percentage of saturation (for the metabolism).',
    '<b>pH</b> and <b>turbidity</b> are the two cheapest, most responsive tell-tales of an intrusion. Many industrial and mining discharges shift pH sharply, and biological activity moves it more slowly; a sudden pH step that does not match the diurnal rhythm is a strong discharge signature. Turbidity — how much the water scatters light — tracks suspended sediment and a great many effluents, and because it often changes fast and visibly, a turbidity spike is frequently the very first sign that something has entered the water, even before you know what. Watching the <b>rate of change</b> of these signals, not just fixed thresholds, is what lets the buoy flag an event: a normal river drifts; a discharge steps.',
    'The hard part is not the sensing but the <b>survival</b>. Submerged probes foul — algae and biofilm coat them within weeks, and a fouled optical turbidity face reads a steadily rising false signal while a fouled DO membrane reads progressively low — so the design fights fouling (copper, wipers) and, just as importantly, flags suspected drift so a slow lie is caught. The platform must ride floods and shrug off debris without sinking or dragging its mooring; the electronics must stay dry through constant immersion; and the whole thing must run for months on the sun and log locally so a dropped link never loses the record. A river buoy that reports beautiful data for three weeks and then quietly fouls, floods or floats away has failed at the only thing that mattered — being there when the pollution happened.',
  ],
  equations: [
    { t: 'DO percent saturation (temperature-aware)', eq: 'Report both absolute and relative oxygen:\n\n  DO_pct = DO_meas(mg/L) / DO_sat(T) × 100\n\nDO_sat falls with temperature (~9 mg/L at 20 °C to\n~7 mg/L at 30 °C, freshwater). Diurnal DO_pct swinging\nfrom >120% (afternoon) to <40% (pre-dawn) signals a\nnutrient-enriched, metabolically stressed river.' },
    { t: 'Turbidity from scattered light', eq: 'Optical turbidity sensor: cloudier water scatters more\nlight to the detector.\n\n  NTU = f(V_scatter)   (calibrated against formazin standards)\n\nRising baseline over weeks with no rain event = biofouling\nof the optical face, not real turbidity → flag & clean.' },
    { t: 'Event (rate-of-change) detection', eq: 'For each parameter x, compare to a slow baseline:\n\n  base ← base + α·(x − base)      (α small)\n  event if |x − base| > k·σ_recent  sustained N reads\n\nk·σ scales the threshold to each parameter\'s normal noise.\nA step that exceeds the diurnal rhythm\'s expected range is\nflagged as a possible discharge — the cue for a grab sample.' },
  ],

  assembly: [
    { h: 'Build the buoy and mooring', p: [
      'Assemble a sealed, ballasted hull that floats upright with the probes below the waterline and the electronics compartment dry above. Design the mooring for flood flow and debris load — a scope and anchor that will not drag or snap.',
      'Bring the probe cables into the dry compartment through IP68 glands; pressure-test the seals before deployment.',
    ], warn: 'The platform is half the engineering. A buoy that sinks, leaks or breaks its mooring in the first flood logs nothing, however good the sensors are.' },
    { h: 'Install and protect the probes', p: [
      'Fit the DO, pH, turbidity and temperature probes at a representative depth. Apply anti-fouling (copper around optical faces, a wiper if available) and position them where a service visit can reach them.',
      'Amplify the pH electrode properly and keep analogue grounds away from the modem\'s switching current.',
    ] },
    { h: 'Set up solar, storage and telemetry', p: [
      'Mount the solar panel on top clear of splash, charge the pack through an MPPT controller, and fit the LoRa (or cellular) modem with its antenna high and dry. Confirm local logging works before you rely on the link.',
    ] },
  ],
  steps: [
    { h: 'Calibrate every probe against standards', p: [
      'pH against 4/7/(10) buffers; DO against zero and air-saturated water; turbidity against formazin (or a supplied) standard; EC against a standard solution. Store constants and dates.',
    ], tip: 'Record the calibration date in the telemetry so the dashboard can show data age and prompt re-calibration.' },
    { h: 'Compensate and detect events', p: [
      'Temperature-compensate DO and pH, maintain a slow baseline per parameter, and flag a sustained departure beyond a noise-scaled threshold as a possible discharge event.',
    ], code: {
      file: 'river-events.ino', lang: 'cpp',
      body: `struct Chan { float base; float var; bool primed; };
Chan cDO, cpH, cTurb;

// Update a slow baseline and running variance; return true on event.
bool detect(Chan &c, float x, float k, uint8_t &nOver) {
  if (!c.primed) { c.base = x; c.var = 1; c.primed = true; return false; }
  float d = x - c.base;
  c.var  = 0.98f * c.var + 0.02f * d * d;         // running variance
  c.base += 0.02f * d;                             // slow baseline
  float sigma = sqrtf(c.var) + 1e-3f;
  if (fabsf(d) > k * sigma) { nOver++; }           // step beyond normal noise
  else nOver = 0;
  return nOver >= 3;                               // sustained → event
}

float doPercentSat(float doMgL, float tempC) {
  // DO_sat approximation (freshwater); replace with a fuller table if needed.
  float sat = 14.6f - 0.41f*tempC + 0.008f*tempC*tempC;
  return doMgL / sat * 100.0f;
}`,
      explain: [
        { ref: 'c.var  = 0.98f * c.var', txt: 'Each channel tracks its own running variance, so the event threshold adapts to how noisy that parameter naturally is rather than using one fixed number for all.' },
        { ref: 'if (fabsf(d) > k * sigma)', txt: 'An event is a departure from the slow baseline scaled by the channel\'s own noise — a step that stands out above the river\'s normal drift and diurnal wobble.' },
        { ref: 'return nOver >= 3', txt: 'A single noisy sample does not raise an alarm; the departure must persist for several reads, which distinguishes a real discharge from sensor noise.' },
        { ref: 'float doPercentSat(', txt: 'Converts absolute oxygen to percent saturation using a temperature-dependent solubility, giving the metabolic view of the river alongside the absolute value the fish care about.' },
      ],
    } },
    { h: 'Log locally, transmit and sleep', p: [
      'Write every reading to local storage first, then transmit; on a dropped link, keep logging and forward the backlog on reconnect. Sleep between intervals to make the solar budget.',
    ] },
  ],

  code: [{
    file: 'river-quality-buoy.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   River Water Quality Buoy — ESP32, DO/pH/turbidity/temp, LoRa, solar

   Continuously logs the high-value river signals, temperature-
   compensates DO and pH, detects abrupt changes that signal discharge
   events, and reports over LoRa with local-logging fallback.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_DO    34
#define PIN_PH    35
#define PIN_TURB  32
#define PIN_EC    33
#define OW_PIN     4
#define LORA_CS    5
#define LORA_RST  14
#define LORA_DIO0  2
#define SLEEP_S  600      // 10 min

OneWire           ow(OW_PIN);
DallasTemperature water(&ow);
Preferences       prefs;

float PH_SLOPE, PH_OFFSET, DO_CAL, TURB_CAL, EC_CAL;

RTC_DATA_ATTR struct { float base, var; bool primed; } cDO, cpH, cTurb;

float avgADC(int pin) {
  long s = 0; for (int i = 0; i < 64; i++) s += analogRead(pin);
  return (s / 64.0f) / 4095.0f * 3.3f;
}

float readpH(float t) {
  float v = avgADC(PIN_PH);
  float tc = (t + 273.15f) / 298.15f;
  return 7.0f + (PH_OFFSET - v) / (PH_SLOPE * tc);
}
float readDO(float t) {
  float v = avgADC(PIN_DO);
  return v * DO_CAL * (1.0f - 0.023f * (t - 20.0f));
}
float readTurb() { return avgADC(PIN_TURB) * TURB_CAL; }   // → NTU
float readEC()   { return avgADC(PIN_EC)   * EC_CAL;   }

float doPercentSat(float doMgL, float t) {
  float sat = 14.6f - 0.41f*t + 0.008f*t*t;
  return doMgL / sat * 100.0f;
}

bool detect(decltype(cDO) &c, float x, float k, uint8_t &nOver) {
  if (!c.primed) { c.base = x; c.var = 1; c.primed = true; return false; }
  float d = x - c.base;
  c.var  = 0.98f * c.var + 0.02f * d * d;
  c.base += 0.02f * d;
  float sigma = sqrtf(c.var) + 1e-3f;
  if (fabsf(d) > k * sigma) nOver++; else nOver = 0;
  return nOver >= 3;
}

void loadCal() {
  prefs.begin("river", true);
  PH_SLOPE  = prefs.getFloat("phS", 0.18f);
  PH_OFFSET = prefs.getFloat("phO", 1.65f);
  DO_CAL    = prefs.getFloat("doC", 3.0f);
  TURB_CAL  = prefs.getFloat("tbC", 1000.0f);
  EC_CAL    = prefs.getFloat("ecC", 1000.0f);
  prefs.end();
}

void transmit(float doMgL, float doPct, float pH, float turb,
              float ec, float t, bool event) {
  LoRa.beginPacket();
  LoRa.printf("{\\"buoy\\":1,\\"do\\":%.2f,\\"do_pct\\":%.0f,\\"ph\\":%.2f,"
              "\\"turb\\":%.0f,\\"ec\\":%.0f,\\"t\\":%.1f,\\"event\\":%d}",
              doMgL, doPct, pH, turb, ec, t, event ? 1 : 0);
  LoRa.endPacket();
}

void logLocal(/* to SD/flash */) { /* append timestamped record */ }

void setup() {
  Serial.begin(115200);
  loadCal();
  water.begin();

  water.requestTemperatures();
  float t     = water.getTempCByIndex(0);
  float doMgL = readDO(t);
  float pH    = readpH(t);
  float turb  = readTurb();
  float ec    = readEC();
  float doPct = doPercentSat(doMgL, t);

  static uint8_t nDO, nPH, nTB;
  bool ev = detect(cDO, doMgL, 3.0f, nDO)
          | detect(cpH, pH,    3.0f, nPH)
          | detect(cTurb, turb, 3.0f, nTB);

  logLocal();                              // record first — never lose data

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);
  transmit(doMgL, doPct, pH, turb, ec, t, ev);

  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_S * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'RTC_DATA_ATTR struct { float base, var; bool primed; } cDO', txt: 'Each channel\'s adaptive baseline and variance persist in RTC memory across deep sleep, so event detection keeps its sense of "normal" without re-learning every wake.' },
      { ref: 'float avgADC(int pin)', txt: 'Averages 64 ADC samples per probe because in-water electrochemical and optical signals are noisy, and dosing decisions and event flags must not ride on a single jittery sample.' },
      { ref: 'return v * DO_CAL * (1.0f - 0.023f * (t - 20.0f))', txt: 'Applies temperature compensation to the dissolved-oxygen reading, since the same probe voltage corresponds to different oxygen at different water temperatures.' },
      { ref: 'logLocal();                              // record first', txt: 'The reading is written locally before it is transmitted, so a dropped LoRa link degrades to a backlog to forward — never a hole in the river\'s record.' },
      { ref: 'bool ev = detect(cDO', txt: 'The three fast-responding channels are each checked for a sustained departure from their own baseline, and any one tripping raises the possible-discharge event flag.' },
    ],
  }],

  config: [
    'Load probe calibration constants and the event-threshold multiplier (k·σ) per channel; store calibration dates.',
    'Set the danger-zone limits (e.g. a hard low-DO floor) that alert regardless of rate-of-change.',
    'Choose the sampling interval (10 min captures diurnal cycles) and the LoRa/cellular telemetry settings.',
    'Configure local logging and backlog-forwarding for link outages.',
  ],
  calibration: [
    { h: 'pH / DO', p: [
      'Calibrate pH against buffers and DO against zero and air-saturated water at a known temperature; verify the temperature compensation reproduces the reference across a range.',
    ] },
    { h: 'Turbidity', p: [
      'Calibrate against formazin (or supplied) standards; note the clean-optics baseline so you can later distinguish real turbidity from fouling drift.',
    ] },
    { h: 'Fouling baseline', p: [
      'Record each probe\'s clean-water reading at deployment; a slow one-directional drift with no rain/event is the fingerprint of biofouling.',
    ] },
  ],
  testing: [
    { step: 'Immerse in a known DO/pH standard', expect: 'Readings match the standard after temperature compensation' },
    { step: 'Add sediment to raise turbidity', expect: 'Turbidity rises; a sustained step raises an event flag' },
    { step: 'Simulate a pH discharge step', expect: 'Event detected once the step persists beyond the noise band' },
    { step: 'Drop the LoRa link during a read', expect: 'Reading logged locally; backlog forwards on reconnect' },
    { step: 'Leave deployed for weeks', expect: 'Any slow one-way drift flags suspected fouling for a clean/recal' },
    { step: 'Run through a flood/debris event (or bench proxy)', expect: 'Buoy stays sealed and moored; logging continues' },
  ],
  output: [
    'The dashboard trends DO (absolute and % saturation), pH, turbidity, EC and temperature, marks detected events, and shows each probe\'s calibration age and fouling flag.',
    { file: 'buoy-packet.json', lang: 'json', body: `{
  "buoy": 1,
  "do": 4.1,
  "do_pct": 52,
  "ph": 6.3,
  "turb": 210,
  "ec": 640,
  "t": 27.4,
  "event": 1
}` },
    'Here a simultaneous DO drop, pH dip and turbidity spike has tripped the event flag — the classic signature of an organic/chemical discharge, and the cue to dispatch someone with a certified sample bottle.',
  ],
  troubleshoot: [
    { sym: 'Turbidity baseline creeps up with no rain', cause: 'Biofouling of the optical face', fix: 'Clean the optics; deploy anti-fouling/wiper; treat the drift flag as a maintenance prompt' },
    { sym: 'DO reads progressively low over weeks', cause: 'Fouled/ageing DO membrane', fix: 'Service or replace the membrane; recalibrate; compare to a spot grab sample' },
    { sym: 'pH noisy or drifting', cause: 'Amplifier noise, electrode ageing, or ground coupling from the modem', fix: 'Improve grounding/shielding; recalibrate; replace an old electrode' },
    { sym: 'Data gaps', cause: 'Link outage without local logging', fix: 'Ensure local logging and backlog-forwarding are enabled; the log is the source of truth' },
    { sym: 'Buoy drifting or listing', cause: 'Mooring dragging or ballast/leak issue', fix: 'Re-set the mooring for flood load; pressure-test seals; correct ballast' },
  ],

  iot: {
    protoShort: 'LoRa or cellular → gateway → river dashboard',
    net: {
      nodes: [{ name: 'River buoy', sub: 'ESP32 sonde' }, { name: 'Upstream buoy', sub: 'reach network' }],
      protocol: 'LoRa / cellular', gateway: 'Bank gateway', gatewaySub: 'or direct cellular',
      uplink: 'MQTT 1883', cloud: 'Broker + dashboard', cloudSub: 'trends + events',
      clients: [{ name: 'Dashboard', sub: 'reach trends' }, { name: 'Phone/SMS', sub: 'event alerts' }],
    },
    protocol: ['Readings publish every ~10 minutes; event flags publish immediately. Local logging is authoritative and forwards any backlog on reconnect, so a remote reach with patchy coverage still yields a complete record.'],
    topics: [
      { t: 'river/buoy/1/reading', dir: 'node → broker', payload: 'DO, DO%, pH, turbidity, EC, temp' },
      { t: 'river/buoy/1/event', dir: 'node → broker', payload: 'possible-discharge event with which channels' },
      { t: 'river/buoy/1/status', dir: 'node → broker', payload: 'battery, fouling/cal flags, RSSI' },
    ],
    cloud: ['A broker feeds a dashboard that trends each reach and, with several buoys, shows a pollutant slug travelling downstream — timing an event between stations to help locate its source.'],
    dashboard: ['Per-buoy trend panels with event markers and fouling/calibration-age indicators, plus a reach map when multiple buoys are deployed.'],
    mobile: ['Immediate alerts on a detected event or a hard danger-zone breach (e.g. DO below the fish-kill floor), prompting a grab sample.'],
    security: [
      'Sign readings per buoy so enforcement evidence cannot be spoofed.',
      'Authenticate any configuration/calibration push to the buoy.',
      'Alert on a buoy going silent — a drowned or vandalised station must be noticed quickly.',
    ],
  },

  perf: [
    'Deep-sleep between 10-minute reads; the modem transmit is the main power cost, so keep packets small.',
    'Average many ADC samples per probe to beat in-water electrical noise.',
    'Keep adaptive baselines in RTC memory so event detection survives sleep without re-priming.',
    'Log locally first and batch-forward backlogs rather than blocking on the link.',
  ],
  safety: [
    'Continuous data indicates when to take a certified grab sample; it is not laboratory evidence on its own.',
    'Deploy and service buoys with proper water safety — moving water is dangerous; never work alone in the current.',
    'Secure the lithium pack and seal the electronics against constant immersion.',
    'Mark the buoy for navigation and moor it so it cannot become a hazard to boats in flood.',
  ],
  maintenance: [
    'Clean and recalibrate probes on a schedule; fouling is the dominant long-term error.',
    'Inspect the mooring and hull seals after every significant flood.',
    'Replace ageing DO membranes and pH electrodes before they drift out of use.',
    'Verify local logs and backlog-forwarding, and keep the solar panel clear of splash-fouling.',
  ],
  future: [
    'Add automated wiper anti-fouling to extend service intervals.',
    'Deploy several buoys along a reach to triangulate a discharge to a source outfall.',
    'Add nitrate/ammonium ion-selective sensing for nutrient-pollution specificity.',
    'Fuse flow and rainfall data to separate storm run-off from illicit discharges automatically.',
  ],
  faq: [
    { q: 'Can it replace lab testing?', a: 'No — a certified lab is more accurate per sample. The buoy\'s value is continuous presence: it catches transient events monthly sampling misses and tells you exactly when to take a certified sample.' },
    { q: 'Why continuous instead of daily?', a: 'Rivers change hourly — storm run-off, night-time discharges, diurnal oxygen swings. Only continuous monitoring captures the timing and magnitude of these, which is what identifies and evidences pollution events.' },
    { q: 'What is the biggest long-term problem?', a: 'Biofouling. Algae and biofilm coat submerged probes within weeks, so the design fights it with anti-fouling and flags slow drift so a fouled sensor is cleaned rather than believed.' },
    { q: 'Why report both mg/L and % saturation for oxygen?', a: 'mg/L tells you whether fish can breathe; % saturation, which accounts for temperature, tells you about the river\'s metabolism and eutrophication. Together they diagnose more than either alone.' },
    { q: 'How does it flag a pollution event?', a: 'It watches each parameter\'s rate of change against its own adaptive baseline. A river normally drifts; a discharge causes a step. A sustained step beyond the normal noise raises an event flag.' },
  ],
  refs: [
    { t: 'Dissolved oxygen and aquatic life — overview', u: 'https://en.wikipedia.org/wiki/Oxygenation_(environmental)', s: 'Reference' },
    { t: 'Turbidity — measurement and meaning', u: 'https://en.wikipedia.org/wiki/Turbidity', s: 'Reference' },
    { t: 'USGS — continuous water-quality monitoring', u: 'https://www.usgs.gov/mission-areas/water-resources', s: 'USGS' },
    { t: 'Eutrophication and diurnal DO swings', u: 'https://en.wikipedia.org/wiki/Eutrophication', s: 'Reference' },
    { t: 'Biofouling of water-quality sensors — literature', u: 'https://en.wikipedia.org/wiki/Biofouling', s: 'Reference' },
  ],
  images: ['solar', 'esp32', 'lora'],
  imageCaptions: [
    'A solar panel and battery let the buoy log a river continuously for months with no mains power.',
    'ESP32 module reading the submerged DO, pH and turbidity probes and detecting discharge events.',
    'A LoRa (or cellular) radio carries each reading from a remote reach to the river-quality dashboard.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   041 — Noise Pollution Mapper
   ══════════════════════════════════════════════════════════════════ */
{
  id: '041',
  domainKey: 'iot',
  emoji: '🔊', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Measures sound the way regulations and human hearing do — A-weighted, time-averaged levels — to build an honest city-wide noise map without recording anyone.',

  overview: [
    'Noise is a genuine pollutant — sustained exposure raises stress, disrupts sleep, and is linked to cardiovascular harm — yet it is one of the least-mapped. Complaints are subjective and sporadic, and official noise surveys are expensive and rare, so a city rarely knows which streets are actually too loud, when, and by how much. This project builds the sensing node for a distributed noise map: a device that measures sound levels the way noise regulations and the human ear do, reports them continuously, and does so <b>without recording audio</b>, so it maps loudness without surveilling conversations.',
    'Measuring sound "properly" means two things that a naive peak-detector gets wrong. First, human hearing is not equally sensitive across frequencies — we hear mid frequencies far better than very low or very high ones — so meters apply <b>A-weighting</b>, a filter that discounts the frequencies our ears discount, giving dB(A), the unit used in virtually every noise regulation. Second, a single instant tells you nothing about a fluctuating quantity like traffic noise, so meters report <b>time-averaged</b> and statistical measures: the equivalent continuous level L<sub>eq</sub> (the steady level carrying the same energy as the fluctuating real sound over a period) and percentile levels like L<sub>90</sub> (the background) and L<sub>10</sub> (the intrusive peaks). This node computes those, because they are what make a reading comparable to a limit and to other nodes.',
    'Privacy is a design constraint, not an afterthought. The node computes sound-pressure levels on-device from short analysis windows and transmits only the numbers — L<sub>eq</sub>, L<sub>10</sub>, L<sub>90</sub>, L<sub>max</sub> per interval — never audio, so it can sit in public space without recording what people say. It runs on mains or solar, reports over Wi-Fi or LoRa, and feeds a heat map that shows how loudness varies by street and by hour, revealing the difference between a road that roars at rush hour and a nightlife strip that peaks at midnight. It is honest about being a class-of-instrument below a calibrated sound-level meter — its microphone is not laboratory-grade — but with a reference calibration it produces maps a city can actually use to target the streets that most need quieting.',
  ],
  does: [
    'Measures A-weighted sound-pressure level (dB(A)) the way regulations define it',
    'Computes time-averaged Leq and statistical Lmax, L10 and L90 per interval',
    'Processes audio on-device and transmits only levels — never recordings',
    'Builds a time-and-place noise map from many nodes',
    'Runs on mains or solar and reports over Wi-Fi or LoRa',
    'Calibrates against a reference sound-level meter for comparable readings',
    'Flags when levels exceed day/night regulatory limits',
  ],
  features: [
    'A-weighting and Leq — the units and averages noise rules actually use',
    'Statistical levels (L10/L90) that separate peaks from background',
    'Privacy by design: levels transmitted, audio never leaves the device',
    'Diurnal noise mapping (rush-hour road vs midnight nightlife)',
    'Reference calibration for comparability across the network',
    'Day/night limit flagging',
    'Cheap enough to deploy as a dense map, not a single meter',
  ],
  applications: [
    { t: 'City noise mapping and planning', d: 'Revealing which streets exceed limits and when, so authorities target enforcement, traffic calming or barriers where they matter.' },
    { t: 'Nightlife / entertainment districts', d: 'Monitoring venue and street noise against night limits to balance a lively economy with residents\' sleep.' },
    { t: 'Construction and industry compliance', d: 'Continuous boundary-noise monitoring against consent limits, with an evidence trail and exceedance alerts.' },
    { t: 'Community and school environments', d: 'Quantifying noise exposure around homes, hospitals and schools to support quiet-zone advocacy.' },
  ],
  skills: [
    'Reading an I²S MEMS microphone and computing RMS sound levels',
    'Implementing A-weighting and time-averaged Leq / percentile levels',
    'Calibrating a level meter against a reference dB(A) source',
    'Designing for privacy (on-device processing, no audio transmission)',
    'Wi-Fi/LoRa reporting and heat-map data feeds',
  ],
  prereq: [
    'A-weighting and Leq are what make a reading a noise measurement rather than a raw amplitude — a peak level in raw counts is not comparable to any regulation.',
    'A MEMS microphone node is below a Class-1/2 sound-level meter; calibrate it against a reference and present it as an indicative map, not legal metrology, unless using certified hardware.',
    'Process audio on-device and never transmit or store recordings — the node measures loudness, it is not a listening device.',
  ],

  parts: ['esp32', 'inmp441', 'oled', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Weatherproof mic windshield', spec: 'Foam/mesh windscreen + rain hood over the MEMS port, IP-rated housing for electronics', qty: 1, price: 250, note: 'Wind noise ruins outdoor SPL without a windscreen' },
    { name: 'Reference calibration access', spec: 'A calibrated sound-level meter or acoustic calibrator to set the node\'s offset', qty: 1, price: 0, note: 'Not hardware — essential for comparable dB(A)' },
    { name: 'Pole/wall mount', spec: 'Positions the mic at a standard height, clear of reflecting surfaces', qty: 1, price: 200 },
  ],
  cost: '₹2,600 – ₹3,800',
  libs: ['wifi', 'pubsub', 'ssd1306', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'INMP441 mic', devPin: 'SD/WS/SCK', pin: 'GPIO 33/25/32', sig: 'I²S digital audio' },
      { dev: 'INMP441 mic', devPin: 'L/R', pin: 'GND', sig: 'Channel select' },
      { dev: 'OLED (opt)', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Local dB(A) display' },
    ],
    right: [
      { dev: 'LoRa/Wi-Fi', devPin: 'bus', pin: 'SPI / on-chip', sig: 'Level telemetry (no audio)' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar/mains supply' },
      { dev: 'Solar/mains', devPin: '+/–', pin: 'TP4056 IN', sig: 'Charge source' },
    ],
  },
  wiringNotes: [
    'Wire the INMP441 as an I²S input (SD, WS, SCK) and tie its L/R pin to select a single channel; the ESP32 I²S peripheral streams samples with no CPU polling.',
    'Mount the microphone port through a foam windscreen and rain hood — outdoor wind directly on the MEMS port produces large false low-frequency levels.',
    'Position the mic at a standard measurement height on a pole or wall, away from large reflecting surfaces that would inflate levels.',
    'Keep the mic away from the node\'s own switching supplies and any fan; you are measuring the environment, not the enclosure.',
    'If solar, ensure the panel/charger noise does not couple into the mic supply.',
  ],

  block: { columns: [
    { label: 'Hear (levels only)', edge: 'right', blocks: [
      { name: 'MEMS mic', sub: 'INMP441 I²S', highlight: true },
      { name: 'On-device DSP', sub: 'A-weight + RMS' },
    ] },
    { label: 'Summarise', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'Leq, L10, L90, Lmax' },
      { name: 'Calibrate', sub: 'reference offset' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'Wi-Fi/LoRa', sub: 'numbers only' },
    ] },
    { label: 'Map', edge: 'none', blocks: [
      { name: 'Noise map', sub: 'street × hour' },
      { name: 'Alert', sub: 'limit exceeded' },
    ] },
  ] },
  flow: [
    { t: 'Stream I²S audio window', k: 'start' },
    { t: 'A-weight, compute RMS/SPL', k: 'proc' },
    { t: 'Accumulate energy + percentiles', k: 'proc' },
    { t: 'Interval elapsed?', k: 'dec', yes: 'Compute Leq/L10/L90/Lmax', no: 'Stream I²S audio window' },
    { t: 'Compute Leq/L10/L90/Lmax', k: 'proc' },
    { t: 'Above day/night limit?', k: 'dec', yes: 'Flag exceedance', no: 'Transmit levels' },
    { t: 'Flag exceedance', k: 'io' },
    { t: 'Transmit levels', k: 'end', back: 'Stream I²S audio window' },
  ],

  principle: [
    'To be a noise measurement rather than a raw amplitude, the node must mimic the ear and the regulation. The ear\'s frequency response is uneven — most sensitive around 1–4 kHz, much less so at very low and very high frequencies — and <b>A-weighting</b> is the standard filter that shapes the measured spectrum to match, producing dB(A). A truck\'s low rumble and a whistle of the same physical energy are not equally loud to us, and dB(A) encodes that. Every noise limit in the world is written in dB(A), so applying A-weighting is what makes the node\'s number comparable to a limit at all.',
    'Because environmental noise fluctuates constantly, a single instantaneous level is nearly meaningless; the meaningful quantities are <b>time-integrated</b>. The equivalent continuous level, L<sub>eq</sub>, is the steady dB(A) that would deliver the same total sound energy as the actual fluctuating sound over the measurement period — the honest "average loudness" of a noisy interval. Alongside it, statistical <b>percentile levels</b> describe the shape of the noise: L<sub>90</sub> (the level exceeded 90% of the time) is effectively the background or residual level, while L<sub>10</sub> (exceeded only 10% of the time) captures the intrusive peaks like passing vehicles. A street with a low L<sub>90</sub> but a high L<sub>10</sub> is quiet with sharp intrusions; one with a high L<sub>90</sub> is relentlessly loud. These distinctions are exactly what a noise map needs to be actionable.',
    'The computation is a pipeline the ESP32 can run in real time without ever storing audio. Samples stream from the I²S microphone; each short analysis window is A-weighted (a small digital filter) and reduced to a mean-square energy; those energies accumulate over the reporting interval to form L<sub>eq</sub>, while a running histogram of short-window levels yields the percentiles and the maximum. At the end of each interval the node emits a handful of numbers and discards the audio. Nothing that could reconstruct speech ever leaves the device — the privacy property is structural, a consequence of computing statistics and throwing the samples away, not a policy layered on top.',
    'Finally, comparability requires <b>calibration</b>. A MEMS microphone has a sensitivity and the whole chain has a gain, so the raw RMS must be mapped to true dB(A) by comparing the node against a reference sound-level meter or acoustic calibrator and storing the offset. With that offset the node produces readings that line up with a proper meter and with its neighbours, turning a field of cheap nodes into a coherent map. The node is candid that it is a class below laboratory metrology — the microphone is not certified — but calibrated and A-weighted, it is more than good enough to show which streets are too loud, and when, which is the entire point of a noise map.',
  ],
  equations: [
    { t: 'Sound-pressure level from RMS', eq: 'For an analysis window, from A-weighted samples x[n]:\n\n  rms = sqrt( (1/N) Σ x[n]^2 )\n  SPL_dBA = 20·log10(rms) + CAL_OFFSET\n\nCAL_OFFSET (from reference calibration) maps the mic/ADC\nchain to true dB(A). A-weighting is applied to x[n] before\nthe RMS so the level matches the ear and the regulation.' },
    { t: 'Equivalent continuous level (Leq)', eq: 'Leq is the energy-average over the interval T:\n\n  Leq = 10·log10( (1/M) Σ 10^(L_i/10) )\n\nwhere L_i are the short-window SPL_dBA values (M of them\nin T). Averaging in the ENERGY domain (10^(L/10)), not the\ndB domain, is essential — a few loud windows dominate,\njust as they dominate real exposure.' },
    { t: 'Percentile levels (L10, L90)', eq: 'Build a histogram of the short-window L_i over the interval.\n\n  L90 = level exceeded 90% of the time  → background/residual\n  L10 = level exceeded 10% of the time  → intrusive peaks\n  Lmax = maximum short-window level\n\nHigh L10 with low L90 = quiet with sharp intrusions;\nhigh L90 = persistently loud. Both matter for a map.' },
  ],

  assembly: [
    { h: 'Mount the microphone correctly', p: [
      'Fit the INMP441 behind a foam windscreen and rain hood, port facing the environment, at a standard measurement height on a pole or wall and clear of large reflecting surfaces.',
      'Keep the mic away from the node\'s own supplies and any moving parts so it measures the street, not the box.',
    ], warn: 'Skip the windscreen and outdoor wind will hammer the MEMS port with false low-frequency energy, wrecking every reading. It is not optional outdoors.' },
    { h: 'Wire and stream the I²S mic', p: [
      'Connect SD/WS/SCK to the I²S pins and select a single channel. Configure the I²S peripheral to stream continuously so the CPU only processes buffers, never polls.',
    ] },
    { h: 'Set up display, power and link', p: [
      'Optionally add an OLED to show the live dB(A) locally. Power from mains or solar, and configure Wi-Fi or LoRa for level-only telemetry.',
    ] },
  ],
  steps: [
    { h: 'Build the level pipeline', p: [
      'For each I²S buffer, apply the A-weighting filter, compute the window RMS and SPL, accumulate the energy for L<sub>eq</sub>, and update a level histogram for the percentiles and maximum.',
    ], code: {
      file: 'spl-pipeline.ino', lang: 'cpp',
      body: `// Accumulators for one reporting interval.
double  energySum = 0;    // Σ 10^(L/10) for Leq
uint32_t windows  = 0;
uint16_t hist[140] = {0}; // 1 dB bins, 0..139 dB(A)
float    lmax = 0;
float    CAL_OFFSET;      // from reference calibration

// A-weighting as a cascade of biquads (coeffs precomputed for fs).
float aWeight(float x) { /* IIR biquad cascade */ return applyBiquads(x); }

// Process one window of N A-weighted samples → SPL, and accumulate.
void processWindow(const int32_t *buf, int N) {
  double ss = 0;
  for (int i = 0; i < N; i++) {
    float x = aWeight((float)(buf[i] >> 8));   // 24-bit sample, A-weighted
    ss += (double)x * x;
  }
  float rms = sqrt(ss / N);
  float spl = 20.0f * log10f(rms + 1e-9f) + CAL_OFFSET;

  energySum += pow(10.0, spl / 10.0);          // energy domain for Leq
  windows++;
  int bin = constrain((int)lroundf(spl), 0, 139);
  hist[bin]++;
  if (spl > lmax) lmax = spl;
}

// At interval end: derive Leq and percentiles from the accumulators.
void intervalStats(float &leq, float &l10, float &l90) {
  leq = 10.0f * log10f(energySum / windows);
  uint32_t c = 0, t = windows;
  l90 = l10 = 0;
  for (int b = 139; b >= 0; b--) {             // high → low
    c += hist[b];
    if (!l10 && c >= t * 0.10f) l10 = b;        // exceeded 10% of time
    if (!l90 && c >= t * 0.90f) { l90 = b; break; } // exceeded 90%
  }
}`,
      explain: [
        { ref: 'float aWeight(float x)', txt: 'Applies the standard A-weighting filter to each sample so the level reflects how loud humans actually perceive that frequency content — the step that turns raw amplitude into dB(A).' },
        { ref: 'energySum += pow(10.0, spl / 10.0)', txt: 'L<sub>eq</sub> is accumulated in the energy domain, not by averaging decibels, so a few loud windows dominate the interval average exactly as they dominate real exposure.' },
        { ref: 'hist[bin]++', txt: 'A running 1 dB histogram of window levels lets the percentile levels be read out at the end without storing the whole time series.' },
        { ref: 'if (!l10 && c >= t * 0.10f)', txt: 'Walking the histogram from loud to quiet finds the level exceeded 10% of the time (the intrusive peaks) and 90% of the time (the background) — L10 and L90.' },
        { ref: 'float CAL_OFFSET', txt: 'The single calibration constant that maps this microphone-and-ADC chain to true dB(A), set once against a reference so the node agrees with a real meter and with its neighbours.' },
      ],
    } },
    { h: 'Report levels and flag exceedances', p: [
      'At the end of each interval, transmit L<sub>eq</sub>, L<sub>10</sub>, L<sub>90</sub> and L<sub>max</sub> (numbers only), compare L<sub>eq</sub> to the applicable day/night limit, flag exceedances, and reset the accumulators.',
    ], tip: 'Use different limits for day and night — night limits are stricter, and sleep disturbance is where noise does much of its health damage.' },
  ],

  code: [{
    file: 'noise-mapper.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Noise Pollution Mapper — ESP32 + INMP441 I2S mic

   Measures A-weighted SPL, computes Leq / L10 / L90 / Lmax per
   interval entirely on-device, and transmits ONLY the levels — never
   audio. Feeds a city noise heat map. Calibrated to a reference dB(A).
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <driver/i2s.h>
#include <Preferences.h>
#include <math.h>

#define I2S_SD    33
#define I2S_WS    25
#define I2S_SCK   32
#define FS        16000       // sample rate
#define WIN       1600        // 100 ms windows
#define INTERVAL_MS 60000UL   // 1-minute reporting interval

Preferences  prefs;
WiFiClient   net;
PubSubClient mqtt(net);

float    CAL_OFFSET;
double   energySum = 0; uint32_t windows = 0;
uint16_t hist[140]; float lmax = 0;
uint32_t intervalStart = 0;

/* A-weighting IIR (biquad coeffs precomputed for FS = 16 kHz). */
float applyBiquads(float x) {
  static float z1a=0,z2a=0,z1b=0,z2b=0;
  // Two biquad sections approximating the A-weighting curve.
  const float b0a=0.255f,b1a=-0.510f,b2a=0.255f,a1a=-0.734f,a2a=0.181f;
  float ya = b0a*x + z1a; z1a = b1a*x - a1a*ya + z2a; z2a = b2a*x - a2a*ya;
  const float b0b=1.0f,b1b=-2.0f,b2b=1.0f,a1b=-1.889f,a2b=0.895f;
  float yb = b0b*ya + z1b; z1b = b1b*ya - a1b*yb + z2b; z2b = b2b*ya - a2b*yb;
  return yb;
}

void i2sInit() {
  i2s_config_t cfg = {
    .mode=(i2s_mode_t)(I2S_MODE_MASTER|I2S_MODE_RX), .sample_rate=FS,
    .bits_per_sample=I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format=I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format=I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags=0, .dma_buf_count=8, .dma_buf_len=WIN/4 };
  i2s_pin_config_t pins={ I2S_SCK, I2S_WS, I2S_PIN_NO_CHANGE, I2S_SD };
  i2s_driver_install(I2S_NUM_0,&cfg,0,NULL);
  i2s_set_pin(I2S_NUM_0,&pins);
}

void processWindow(const int32_t *buf,int N){
  double ss=0;
  for(int i=0;i<N;i++){ float x=applyBiquads((float)(buf[i]>>8)); ss+=(double)x*x; }
  float spl=20.0f*log10f(sqrtf(ss/N)+1e-9f)+CAL_OFFSET;
  energySum+=pow(10.0,spl/10.0); windows++;
  int bin=constrain((int)lroundf(spl),0,139); hist[bin]++;
  if(spl>lmax) lmax=spl;
}

void reportInterval(){
  if(!windows) return;
  float leq=10.0f*log10f(energySum/windows);
  uint32_t c=0,t=windows; float l10=0,l90=0;
  for(int b=139;b>=0;b--){ c+=hist[b];
    if(!l10 && c>=t*0.10f) l10=b;
    if(!l90 && c>=t*0.90f){ l90=b; break; } }

  bool night = isNight();                    // stricter limits at night
  float limit = night?45.0f:55.0f;           // example dB(A) limits
  bool exceed = leq>limit;

  char b[200];
  snprintf(b,sizeof b,
    "{\\"node\\":1,\\"leq\\":%.1f,\\"l10\\":%.0f,\\"l90\\":%.0f,"
    "\\"lmax\\":%.1f,\\"limit\\":%.0f,\\"exceed\\":%d}",
    leq,l10,l90,lmax,limit,exceed?1:0);
  mqtt.publish("noise/node/1/levels", b);    // NUMBERS ONLY — no audio

  energySum=0; windows=0; lmax=0;
  for(int i=0;i<140;i++) hist[i]=0;          // reset for next interval
}

void setup(){
  Serial.begin(115200);
  prefs.begin("noise",true);
  CAL_OFFSET=prefs.getFloat("cal",90.0f);    // from reference calibration
  prefs.end();
  i2sInit();
  WiFi.begin(WIFI_SSID,WIFI_PASS);
  mqtt.setServer(MQTT_HOST,1883);
  intervalStart=millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("noise-1");
  mqtt.loop();

  static int32_t buf[WIN];
  size_t br;
  i2s_read(I2S_NUM_0,buf,sizeof buf,&br,portMAX_DELAY);
  processWindow(buf,br/4);                    // one ~100 ms window

  if(millis()-intervalStart>=INTERVAL_MS){
    reportInterval();
    intervalStart=millis();
  }
}`,
    explain: [
      { ref: 'float applyBiquads(float x)', txt: 'Runs each audio sample through a small IIR filter cascade that approximates the A-weighting curve, so the computed level matches human hearing and the regulatory dB(A) definition.' },
      { ref: 'energySum+=pow(10.0,spl/10.0)', txt: 'Accumulates window energy so the interval L<sub>eq</sub> is a true energy average — the measure that reflects real noise exposure rather than a plain decibel mean.' },
      { ref: 'mqtt.publish("noise/node/1/levels", b);    // NUMBERS ONLY', txt: 'Only the computed levels are ever transmitted; the audio buffer is processed and overwritten, so the privacy guarantee is structural — there is no recording to leak.' },
      { ref: 'float limit = night?45.0f:55.0f', txt: 'Applies stricter night-time limits, matching how regulations and health concerns treat night noise, so exceedance flags mean the right thing at the right hour.' },
      { ref: 'CAL_OFFSET=prefs.getFloat("cal",90.0f)', txt: 'Loads the single reference-calibration offset that turns this microphone chain\'s RMS into true dB(A), making the node comparable to a real meter and to the rest of the network.' },
    ],
  }],

  config: [
    'Set CAL_OFFSET from a reference calibration so the node reports true dB(A).',
    'Set the day/night dB(A) limits and the day/night boundary times for your jurisdiction.',
    'Choose the reporting interval (1 min is common; 15 min Leq is also standard for surveys).',
    'Select Wi-Fi/MQTT or LoRa, and confirm the payload carries levels only, never audio.',
  ],
  calibration: [
    { h: 'Reference offset', p: [
      'Place the node beside a calibrated sound-level meter (or use an acoustic calibrator) across a range of levels and set CAL_OFFSET so the node\'s dB(A) matches the reference.',
    ] },
    { h: 'A-weighting check', p: [
      'Verify with tones that the node discounts very low and very high frequencies relative to mid frequencies, confirming the A-weighting filter is working.',
    ] },
    { h: 'Wind/self-noise floor', p: [
      'In a quiet space confirm the node\'s noise floor is well below the levels you care about, and that the windscreen suppresses wind-induced false levels outdoors.',
    ] },
  ],
  testing: [
    { step: 'Play a 1 kHz tone at a known level', expect: 'Node dB(A) matches the reference meter after calibration' },
    { step: 'Play equal-energy low and high tones', expect: 'A-weighting discounts them relative to mid frequencies' },
    { step: 'Create brief loud events amid quiet', expect: 'Lmax and L10 rise; L90 (background) stays low' },
    { step: 'Run a steady loud source', expect: 'L90 rises toward Leq — persistently loud signature' },
    { step: 'Inspect the transmitted payload', expect: 'Only levels present; no audio field anywhere' },
    { step: 'Compare day vs night intervals', expect: 'Correct (stricter) night limit applied to exceedance flag' },
  ],
  output: [
    'The heat map colours each node by Leq for the selected hour; a node view shows Leq/L10/L90/Lmax over the day and marks limit exceedances.',
    { file: 'noise-levels.json', lang: 'json', body: `{
  "node": 1,
  "leq": 63.4,
  "l10": 68,
  "l90": 54,
  "lmax": 81.2,
  "limit": 55,
  "exceed": 1
}` },
    'Here the interval Leq of 63.4 dB(A) exceeds the 55 dB(A) day limit, with an L90 of 54 (persistently busy) and an L10 of 68 (frequent traffic peaks) — a genuinely loud street, not one quiet stretch spoiled by a single event.',
  ],
  troubleshoot: [
    { sym: 'Levels far too high outdoors, worst when windy', cause: 'Wind on the MEMS port', fix: 'Fit a foam windscreen and rain hood; the correlation with wind confirms the cause' },
    { sym: 'Node disagrees with a reference meter', cause: 'Uncalibrated, or wrong CAL_OFFSET', fix: 'Recalibrate against the reference across a range of levels' },
    { sym: 'Leq seems dominated by rare events', cause: 'That is correct — energy averaging weights loud windows heavily', fix: 'Report L90 alongside Leq to show the background separately' },
    { sym: 'Low-frequency readings look inflated', cause: 'A-weighting not applied or filter wrong', fix: 'Verify the A-weighting biquad coefficients for your sample rate' },
    { sym: 'Privacy concern raised', cause: 'Misunderstanding — no audio is sent', fix: 'Show that only numeric levels are transmitted and audio buffers are discarded on-device' },
  ],

  iot: {
    protoShort: 'Wi-Fi/LoRa → gateway → noise heat map (levels only)',
    net: {
      nodes: [{ name: 'Noise node', sub: 'ESP32 + mic' }, { name: 'Other nodes', sub: 'across the city' }],
      protocol: 'Wi-Fi / LoRa', gateway: 'City gateway', gatewaySub: 'to MQTT',
      uplink: 'MQTT 1883', cloud: 'Broker + heat map', cloudSub: 'levels + limits',
      clients: [{ name: 'Heat map', sub: 'street × hour' }, { name: 'Phone', sub: 'exceedance alerts' }],
    },
    protocol: ['Each node publishes Leq/L10/L90/Lmax and an exceedance flag per interval. The payload is numeric only — audio never leaves the device — so a dense public network maps loudness without any surveillance capability.'],
    topics: [
      { t: 'noise/node/1/levels', dir: 'node → broker', payload: 'Leq, L10, L90, Lmax, limit, exceed' },
      { t: 'noise/node/1/status', dir: 'node → broker', payload: 'battery, RSSI, calibration date' },
      { t: 'noise/node/1/config', dir: 'broker → node', payload: 'limits, interval, calibration offset' },
    ],
    cloud: ['A broker feeds a heat map that renders Leq by location and hour, so a city sees which streets breach limits and when — rush-hour roads versus late-night nightlife strips emerge clearly.'],
    dashboard: ['A time-sliderable heat map plus per-node daily curves of Leq/L10/L90, with exceedance shading against the day/night limits.'],
    mobile: ['Alerts when a monitored location exceeds its night or day limit, useful for residents and for compliance monitoring.'],
    security: [
      'Sign each node\'s levels so the public map cannot be spoofed with fake quiet/loud readings.',
      'Guarantee and document that no audio is transmitted or stored — the privacy property is the network\'s social licence.',
      'Authenticate configuration/calibration pushes to nodes.',
    ],
  },

  perf: [
    'Stream audio via I²S DMA and process per buffer; the ESP32 handles A-weighting and RMS in real time without storing audio.',
    'Use a running histogram for percentiles instead of buffering the time series — constant memory per interval.',
    'Report compact numeric packets once per interval; the heavy lifting is already done on-device.',
    'On solar, the mic and CPU are the main draw; a modest panel covers continuous operation.',
  ],
  safety: [
    'Publish and honour the privacy design: levels only, no audio recorded or transmitted — this is the node\'s social licence to sit in public space.',
    'Present readings as indicative unless certified hardware is used; a MEMS node is below Class-1/2 metrology.',
    'Mount nodes safely at height, clear of traffic and tampering.',
    'Keep the lithium battery and charger sheltered from weather.',
  ],
  maintenance: [
    'Re-verify the reference calibration periodically; microphone sensitivity can drift.',
    'Inspect and replace the windscreen as it degrades; a perished windscreen lets wind noise back in.',
    'Check the mic port for dust/insects blocking the acoustic path.',
    'Confirm day/night limits and clock sync remain correct so exceedance flags stay meaningful.',
  ],
  future: [
    'Add coarse spectral bands (octave levels) for source classification without recording audio.',
    'Run an on-device classifier to tag noise type (traffic, aircraft, music) from spectral features, still transmitting no audio.',
    'Fuse many nodes with a propagation model for a continuous city noise surface between sensors.',
    'Correlate exceedances with traffic and event calendars to attribute and target interventions.',
  ],
  faq: [
    { q: 'Does it record what people say?', a: 'No. Audio is processed on-device into sound levels and immediately discarded; only numbers (Leq, L10, L90, Lmax) are transmitted. There is no recording to leak — the privacy is structural.' },
    { q: 'What is A-weighting and why use it?', a: 'A filter that discounts frequencies the human ear is less sensitive to, giving dB(A). Every noise regulation is written in dB(A), so applying A-weighting is what makes the reading comparable to a limit.' },
    { q: 'Why report Leq, L10 and L90 instead of one number?', a: 'Noise fluctuates. Leq is the energy-average loudness, L90 is the background, and L10 the intrusive peaks. Together they distinguish a relentlessly loud street from a quiet one with occasional events.' },
    { q: 'Is it as accurate as a professional meter?', a: 'No — a MEMS node is below Class-1/2 metrology. But calibrated against a reference and A-weighted, it is accurate enough to map which streets are too loud and when, which is the goal.' },
    { q: 'Why does wind ruin outdoor readings?', a: 'Wind hitting the microphone port creates large false low-frequency levels. A foam windscreen suppresses it; outdoors it is essential.' },
  ],
  refs: [
    { t: 'A-weighting and sound-level measurement', u: 'https://en.wikipedia.org/wiki/A-weighting', s: 'Reference' },
    { t: 'Equivalent continuous sound level (Leq)', u: 'https://en.wikipedia.org/wiki/Equivalent_continuous_sound_level', s: 'Reference' },
    { t: 'WHO — environmental noise guidelines and health', u: 'https://www.who.int/', s: 'WHO' },
    { t: 'INMP441 I²S MEMS microphone (datasheet)', u: 'https://invensense.tdk.com/products/digital/inmp441/', s: 'TDK InvenSense' },
    { t: 'Noise mapping — methods and percentile levels', u: 'https://en.wikipedia.org/wiki/Noise_pollution', s: 'Reference' },
  ],
  images: ['city', 'esp32', 'grafana'],
  imageCaptions: [
    'A dense network of nodes maps how loud each street is, and when — data a city rarely has otherwise.',
    'ESP32 module computing A-weighted Leq and percentile levels on-device and transmitting only the numbers.',
    'A dashboard turns the level streams into a time-and-place noise heat map.',
  ],
},

];
