/* Environment batch B — 042 Forest Fire Early Detector, 043 Flood Level
   Sensor, 044 UV Index Public Monitor. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   042 — Forest Fire Early Detector
   ══════════════════════════════════════════════════════════════════ */
{
  id: '042',
  domainKey: 'iot',
  emoji: '🔥', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A mesh of self-powered wireless nodes that smells and feels a wildfire in its first minutes — when a satellite still sees nothing and a lookout is still hours from noticing.',

  overview: [
    'A wildfire is almost survivable in its first ten minutes and almost unstoppable an hour later. The whole game is early detection, and the tools we usually rely on are late: satellites revisit on a schedule and need a fire big and hot enough to show through cloud and canopy; watchtowers and cameras see smoke only once a plume has risen above the trees; a 112/emergency call needs a human who has already noticed. Down in the understory, though, a fire announces itself long before any of that — a sharp rise in temperature, a collapse in local humidity, and above all the <b>smoke and combustion gases</b> that pour off smouldering vegetation minutes before there are visible flames. This project puts cheap sensors down where the fire starts and networks them so that first chemical whisper becomes an alert.',
    'Each node is a small, rugged, solar-powered box that samples the air for the signature of combustion — smoke particulate and carbon-monoxide-rich gases from a metal-oxide sensor — together with temperature and humidity, and watches for the <i>combination</i> that means fire rather than any single cue. That combination matters enormously: a hot afternoon is not a fire, a dust cloud is not a fire, but rising smoke gas AND rising temperature AND falling humidity together, appearing suddenly, is. By fusing the channels and looking at rate-of-change against each node\'s own learned baseline, the detector fires on real events and stays quiet through the daily weather, which is the difference between a system people trust and one they mute.',
    'The other half of the design is the network. A single node covers a small patch, so detection at landscape scale means many nodes spread across a forest — and forests have no mains power and no Wi-Fi. The nodes therefore run on solar and talk over <b>LoRa in a mesh</b>, each relaying its neighbours\' messages so an alert from deep in the trees hops node-to-node out to a gateway at the forest edge and onward to the fire service, with the node\'s location. It is candid about its limits — low-cost gas sensors are indicative, coverage depends on node density, and it complements rather than replaces satellites and lookouts — but a dense mesh of honest, fast, ground-level nodes buys the one thing wildfire response never has enough of: minutes.',
  ],
  does: [
    'Samples smoke/combustion gas, temperature and humidity at ground level',
    'Fuses the channels and fires on the combination that means fire, not single cues',
    'Detects by rate-of-change against each node\'s learned baseline to reject weather',
    'Relays alerts node-to-node over a LoRa mesh to a forest-edge gateway',
    'Reports each alert with the originating node\'s location',
    'Runs unattended for seasons on solar + battery',
    'Escalates a confirmed detection immediately to responders',
  ],
  features: [
    'Ground-level chemical detection — minutes before smoke rises or satellites see',
    'Multi-cue fusion (smoke + heat + humidity drop) to reject false alarms',
    'Per-node adaptive baselines so normal weather does not trigger it',
    'LoRa mesh relaying for coverage deep in roadless, powerless forest',
    'Solar, rugged, season-long unattended operation',
    'Located alerts routed straight to the fire service',
    'Honest about coverage and sensor limits — a complement to satellites/lookouts',
  ],
  applications: [
    { t: 'High-risk forest and wildland-urban interface', d: 'Dense node coverage over fire-prone forest or the vulnerable edge where settlements meet wildland, buying response time for the highest-consequence areas.' },
    { t: 'Plantations and managed forestry', d: 'Protecting commercial timber and preventing a small ignition from destroying years of growth.' },
    { t: 'Protected areas and biodiversity reserves', d: 'Early alerts in remote reserves where no lookout exists and access is slow.' },
    { t: 'Peatland and agricultural-burn monitoring', d: 'Catching smouldering peat or escaped stubble fires that produce heavy smoke gas before open flame.' },
  ],
  skills: [
    'Reading smoke/gas (metal-oxide) sensors and interpreting them qualitatively',
    'Multi-sensor fusion and rate-of-change (baseline) detection',
    'Building a LoRa mesh with message relaying and deduplication',
    'Solar power design for season-long remote nodes',
    'Ruggedising electronics for outdoor, high-temperature environments',
  ],
  prereq: [
    'No single sensor is sufficient — fuse smoke gas, temperature and humidity, or you will drown in false alarms or miss real fires.',
    'Metal-oxide gas sensors are qualitative and drift; use rate-of-change against a learned baseline, not absolute thresholds.',
    'This is a complement to satellites, cameras and lookouts, not a replacement; coverage is only as good as node density.',
    'Nodes may sit in extreme heat and dust — design the enclosure and power for it, and protect the battery from over-temperature.',
  ],

  parts: ['esp32', 'mq2', 'mq135', 'dht22', 'bme280', 'flame', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Rugged UV/heat-resistant enclosure', spec: 'Vented for gas ingress, IP-rated against rain/dust, shades the electronics', qty: 1, price: 550, note: 'Must let air reach the gas sensor but shelter the board' },
    { name: 'High-temperature battery + protection', spec: 'LiFePO4 preferred for heat tolerance, with over-temperature cutoff', qty: 1, price: 700, note: 'Standard Li-ion degrades/fails in forest summer heat' },
    { name: 'LoRa mesh gateway (edge)', spec: 'One gateway at the forest edge with backhaul (cellular/Ethernet) to responders', qty: 1, price: 2500, note: 'Shared across the whole mesh' },
  ],
  cost: '₹4,200 – ₹5,800 per node',
  libs: ['wifi', 'dhtlib', 'bme', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'MQ-2 (smoke)', devPin: 'AOUT', pin: 'GPIO 34 (ADC)', sig: 'Smoke/combustible gas' },
      { dev: 'MQ-135 (gas)', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'CO/VOC combustion gases' },
      { dev: 'DHT22 / BME280', devPin: 'DATA / I²C', pin: 'GPIO 4 / 21-22', sig: 'Temp + humidity' },
      { dev: 'Flame sensor', devPin: 'DOUT', pin: 'GPIO 27', sig: 'IR flame (line-of-sight confirm)' },
    ],
    right: [
      { dev: 'LoRa SX1276', devPin: 'SCK/MISO/MOSI', pin: 'GPIO 18/19/23', sig: 'SPI mesh radio' },
      { dev: 'LoRa SX1276', devPin: 'NSS/RST/DIO0', pin: 'GPIO 5/14/2', sig: 'Chip-select, reset, IRQ' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar-charged supply' },
      { dev: 'Solar panel', devPin: '+/–', pin: 'TP4056 IN', sig: '6 V panel → charger' },
    ],
  },
  wiringNotes: [
    'Vent the enclosure so outside air reaches the gas sensors, but shade the electronics and battery from direct sun and the worst heat.',
    'Metal-oxide gas sensors have a heated element that draws steady current and needs warm-up; budget for it and keep its heater noise off the analogue grounds.',
    'Place the temperature/humidity sensor in the same vented airflow so its readings represent the air the gas sensors sample.',
    'Mount the flame sensor with a clear line of sight where possible; treat it as confirmation, not primary detection, since it needs direct view of flame.',
    'Keep the LoRa antenna vertical and as high as the mounting allows for mesh range under canopy.',
  ],

  block: { columns: [
    { label: 'Smell + feel', edge: 'right', blocks: [
      { name: 'Smoke/gas', sub: 'MQ-2 / MQ-135', highlight: true },
      { name: 'Temp + RH', sub: 'DHT22 / BME280' },
      { name: 'Flame (confirm)', sub: 'IR sensor' },
    ] },
    { label: 'Fuse + decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'multi-cue + baseline' },
      { name: 'Fire score', sub: 'combination rule' },
    ] },
    { label: 'Mesh', edge: 'right', blocks: [
      { name: 'LoRa relay', sub: 'node → node' },
      { name: 'Edge gateway', sub: 'to responders' },
    ] },
    { label: 'Response', edge: 'none', blocks: [
      { name: 'Fire service', sub: 'located alert' },
      { name: 'Dashboard', sub: 'node health map' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Read smoke, gas, temp, RH', k: 'proc' },
    { t: 'Update per-node baselines', k: 'proc' },
    { t: 'Smoke↑ AND temp↑ AND RH↓ together?', k: 'dec', yes: 'Raise fire score', no: 'Log; sleep' },
    { t: 'Raise fire score', k: 'proc' },
    { t: 'Score over threshold (sustained)?', k: 'dec', yes: 'Emit located alert into mesh', no: 'Log; sleep' },
    { t: 'Emit located alert into mesh', k: 'io' },
    { t: 'Log; sleep', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'The detector wins on physics of timing. A ground fire begins as smouldering combustion in leaf litter and undergrowth, and long before there are flames tall enough to see or hot enough for a satellite\'s thermal band, it is emitting a plume of smoke particulate and combustion gases — carbon monoxide and a soup of volatile organics — right at the height where our nodes sit. It also locally spikes the temperature and drives down the relative humidity as it heats and dries the air around it. Detecting these near the source, in the first minutes, is inherently earlier than any method that waits for the fire to grow large enough to be visible from above or from a distance.',
    'The central design principle is <b>multi-cue fusion</b>, because no single sensor can tell fire from ordinary environmental variation. A metal-oxide gas sensor rises on a fire — but also on a passing vehicle\'s exhaust, a nearby cooking fire, or its own drift. Temperature rises on a fire — but also every sunny afternoon. Humidity falls in a fire — but also in a dry wind. Each cue alone would either false-alarm constantly or miss real fires depending on where you set the threshold. Fused, they become specific: it is the <i>coincidence</i> of rising combustion gas, rising temperature and falling humidity, arriving together and quickly, that is the fingerprint of fire and almost nothing else. The node computes a combined fire score from all channels rather than trusting any one.',
    'Because the cheap gas sensors drift and every site has a different "normal", detection is done by <b>rate-of-change against a per-node adaptive baseline</b>, not fixed thresholds. Each node continuously learns its own slow background for each channel; an alarm needs a departure that is fast and large relative to that baseline and the channel\'s normal noise. This makes a node in a humid valley and one on a dry ridge each judge fire by <i>its own</i> normal, absorbs slow sensor drift automatically, and keys on the sudden coincident change that fire produces rather than any absolute value. A flame sensor, where it has line of sight, adds a final confirmation channel — direct evidence of flame that sharply raises confidence when present, though its short range and need for a clear view keep it a confirmer rather than the primary detector.',
    'Detection at landscape scale is a <b>networking</b> problem as much as a sensing one. One node protects a small radius, so real coverage means a dense field of nodes — and forests are exactly where there is no power and no cellular. The answer is solar nodes on a <b>LoRa mesh</b>: each node not only sends its own messages but relays its neighbours\', so an alert originating deep in roadless terrain hops from node to node until it reaches a gateway at the forest edge with backhaul to the fire service. Messages carry the originating node\'s ID and location and a hop count, and the mesh deduplicates and rate-limits relays so one alert does not storm the network. The system is deliberately honest about the trade-offs — coverage is only as good as node density, and a low-cost gas sensor is indicative not analytical — but as a fast, ground-truth complement to satellites and lookouts, a mesh like this delivers the minutes that decide whether a fire is a footnote or a catastrophe.',
  ],
  equations: [
    { t: 'Per-node adaptive baseline and anomaly', eq: 'For each channel x (smoke, gas, temp, −RH):\n\n  base ← base + α·(x − base)         (α small, slow)\n  var  ← 0.98·var + 0.02·(x − base)^2\n  z_x  = (x − base) / (sqrt(var) + ε)\n\nz_x is how many "normals" this channel has jumped.\nUsing −RH means a humidity DROP contributes positively,\naligning all cues so a fire pushes every z_x upward.' },
    { t: 'Fused fire score', eq: 'Combine the standardised cues (require coincidence):\n\n  score = w1·z_smoke + w2·z_gas + w3·z_temp + w4·z_negRH\n          + FLAME_BONUS·flame_confirmed\n\nAlarm if score > S_thresh sustained over N reads.\nWeights w emphasise the gas/smoke channels; the flame\nbonus sharply raises confidence when a flame is seen.\nCoincidence (several z high together) is what fire looks\nlike — one channel alone rarely crosses S_thresh.' },
    { t: 'Mesh relay with deduplication', eq: 'Each alert packet: {node_id, lat, lon, score, msg_id, hops}\n\n  on receive:\n    if msg_id already seen  → drop (dedup)\n    else record msg_id; if hops < HOP_MAX:\n         hops++ ; rebroadcast after random backoff\n\nRandom backoff avoids collisions; HOP_MAX bounds flooding;\ndedup stops a message circulating forever. The alert walks\noutward to the edge gateway node by node.' },
  ],

  assembly: [
    { h: 'Build the vented, heat-tolerant node', p: [
      'House the electronics in a rugged, UV-resistant enclosure that is vented so outside air reaches the gas sensors while the board and battery are shaded from direct sun.',
      'Use a heat-tolerant battery (LiFePO4) with over-temperature protection — forest summer heat destroys ordinary Li-ion.',
    ], warn: 'The battery is the weak point in heat. Shade it, choose a chemistry that tolerates high temperature, and include an over-temperature cutoff, or nodes will fail in the fire season — exactly when they are needed.' },
    { h: 'Fit and warm the sensors', p: [
      'Mount the MQ-2/MQ-135 in the vented airflow and allow their heaters to stabilise (a warm-up period) before trusting readings. Place the temperature/humidity sensor in the same airflow, and the flame sensor with a clear view where possible.',
    ] },
    { h: 'Set up solar and the mesh radio', p: [
      'Angle the solar panel to the sun; size the panel and battery for the shortest winter days and canopy shade. Mount the LoRa antenna high and vertical for mesh range, and place gateways at the forest edge with backhaul.',
    ] },
  ],
  steps: [
    { h: 'Learn baselines and standardise cues', p: [
      'Let each node learn a slow baseline and variance per channel, and standardise each reading into a z-score of how far it has jumped from that node\'s own normal.',
    ], tip: 'Give baselines time to settle at deployment (hours to a day) before enabling alerts, so a node does not alarm on its own warm-up.' },
    { h: 'Fuse into a fire score with coincidence', p: [
      'Combine the standardised cues into a single score that only crosses threshold when several channels rise together, and require the score to persist to reject transient spikes.',
    ], code: {
      file: 'fire-fusion.ino', lang: 'cpp',
      body: `struct Chan { float base, var; bool primed; };
Chan smoke, gas, temp, humid;

float zscore(Chan &c, float x) {
  if (!c.primed) { c.base = x; c.var = 1; c.primed = true; return 0; }
  float d = x - c.base;
  c.var  = 0.98f * c.var + 0.02f * d * d;
  c.base += 0.02f * d;                       // slow per-node baseline
  return d / (sqrtf(c.var) + 1e-3f);
}

// Fuse cues; humidity is entered as its NEGATIVE so a drop reads positive.
float fireScore(float smk, float g, float t, float rh, bool flame) {
  float zs = zscore(smoke, smk);
  float zg = zscore(gas,   g);
  float zt = zscore(temp,  t);
  float zh = zscore(humid, -rh);            // humidity DROP → positive z
  float score = 1.2f*zs + 1.2f*zg + 0.9f*zt + 0.9f*zh;
  if (flame) score += 3.0f;                 // direct flame confirmation
  return score;
}

// Alarm needs coincidence AND persistence, not one loud channel.
bool fireConfirmed(float score, uint8_t &nHigh) {
  if (score > 5.0f) nHigh++; else nHigh = 0;
  return nHigh >= 3;                         // sustained multi-cue rise
}`,
      explain: [
        { ref: 'return d / (sqrtf(c.var) + 1e-3f)', txt: 'Each channel is expressed as how many of its own normal fluctuations it has jumped, so drift and site differences wash out and only genuine departures count.' },
        { ref: 'float zh = zscore(humid, -rh)', txt: 'Feeding negative humidity makes a humidity drop contribute positively, aligning all four cues so a real fire pushes every one of them up together.' },
        { ref: 'if (flame) score += 3.0f', txt: 'A line-of-sight flame detection adds a large bonus — direct evidence of fire that sharply raises confidence when available.' },
        { ref: 'return nHigh >= 3', txt: 'Confirmation requires the fused score to stay high for several reads, so a single sensor glitch or a passing exhaust puff cannot trip a landscape-scale alert.' },
      ],
    } },
    { h: 'Alert into the mesh with location', p: [
      'On a confirmed detection, emit a located alert packet into the LoRa mesh with a unique message id; relay neighbours\' alerts with deduplication and a hop limit so every alert reaches the edge gateway once.',
    ] },
  ],

  code: [{
    file: 'forest-fire-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Forest Fire Early Detector — ESP32, smoke/gas/temp/RH, LoRa mesh

   Fuses ground-level combustion cues against per-node baselines,
   confirms fire by coincidence + persistence, and relays located
   alerts through a solar LoRa mesh to a forest-edge gateway.
   ══════════════════════════════════════════════════════════════════ */

#include <DHT.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_SMOKE 34
#define PIN_GAS   35
#define PIN_DHT    4
#define PIN_FLAME 27
#define LORA_CS    5
#define LORA_RST  14
#define LORA_DIO0  2
#define HOP_MAX    6
#define SLEEP_S   60          // 1 min — fast enough for early detection

DHT dht(PIN_DHT, DHT22);
Preferences prefs;

const uint16_t NODE_ID = 1;
float NODE_LAT, NODE_LON;

RTC_DATA_ATTR struct C { float base, var; bool primed; }
  cSmoke, cGas, cTemp, cHumid;
RTC_DATA_ATTR uint32_t msgCounter = 0;
RTC_DATA_ATTR uint32_t seenIds[16]; RTC_DATA_ATTR uint8_t seenN = 0;

float z(struct C &c, float x) {
  if (!c.primed) { c.base = x; c.var = 1; c.primed = true; return 0; }
  float d = x - c.base;
  c.var  = 0.98f * c.var + 0.02f * d * d;
  c.base += 0.02f * d;
  return d / (sqrtf(c.var) + 1e-3f);
}

bool seen(uint32_t id) {
  for (int i = 0; i < seenN; i++) if (seenIds[i] == id) return true;
  seenIds[seenN % 16] = id; seenN++;
  return false;
}

void sendAlert(float score) {
  uint32_t id = ((uint32_t)NODE_ID << 16) | (++msgCounter & 0xFFFF);
  char pkt[160];
  snprintf(pkt, sizeof pkt,
    "{\\"t\\":\\"fire\\",\\"node\\":%u,\\"lat\\":%.5f,\\"lon\\":%.5f,"
    "\\"score\\":%.1f,\\"id\\":%lu,\\"hops\\":0}",
    NODE_ID, NODE_LAT, NODE_LON, score, (unsigned long)id);
  LoRa.beginPacket(); LoRa.print(pkt); LoRa.endPacket();
}

// Relay any alert we hear (dedup + hop limit) so it walks to the edge.
void relayIfNeeded() {
  int sz = LoRa.parsePacket();
  if (!sz) return;
  char buf[200]; int n = 0;
  while (LoRa.available() && n < 199) buf[n++] = LoRa.read();
  buf[n] = 0;
  // (a real build parses JSON; shown conceptually)
  uint32_t id; int hops;
  if (parseAlert(buf, id, hops)) {
    if (seen(id)) return;                    // dedup
    if (hops < HOP_MAX) {
      delay(random(20, 200));                // random backoff vs collisions
      char out[210]; bumpHops(buf, out);     // hops+1
      LoRa.beginPacket(); LoRa.print(out); LoRa.endPacket();
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_FLAME, INPUT);
  dht.begin();
  prefs.begin("fire", true);
  NODE_LAT = prefs.getFloat("lat", 0); NODE_LON = prefs.getFloat("lon", 0);
  prefs.end();

  analogSetPinAttenuation(PIN_SMOKE, ADC_11db);
  analogSetPinAttenuation(PIN_GAS,   ADC_11db);

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);

  // relay anything heard while we were asleep/awake
  relayIfNeeded();

  // ── read + fuse this node's cues ──
  float smk = analogRead(PIN_SMOKE);
  float g   = analogRead(PIN_GAS);
  float t   = dht.readTemperature();
  float rh  = dht.readHumidity();
  bool flame = digitalRead(PIN_FLAME) == LOW;

  float score = 1.2f*z(cSmoke, smk) + 1.2f*z(cGas, g)
              + 0.9f*z(cTemp, t)    + 0.9f*z(cHumid, -rh)
              + (flame ? 3.0f : 0.0f);

  static uint8_t nHigh;
  if (score > 5.0f) nHigh++; else nHigh = 0;
  if (nHigh >= 3) sendAlert(score);          // confirmed: coincidence+persist

  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_S * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'RTC_DATA_ATTR struct C', txt: 'Each channel\'s baseline and variance persist across deep sleep in RTC memory, so a node keeps its learned sense of "normal" between one-minute wakes instead of re-learning and false-alarming.' },
      { ref: 'bool seen(uint32_t id)', txt: 'Remembers recently-relayed message ids so the same alert is not rebroadcast twice — the deduplication that keeps one detection from storming the mesh.' },
      { ref: 'void relayIfNeeded()', txt: 'Every node forwards its neighbours\' alerts, with a random backoff and a hop limit, so a message from deep in the forest hops outward to the edge gateway without collisions or endless circulation.' },
      { ref: 'float score = 1.2f*z(cSmoke', txt: 'The fused fire score weights the smoke and gas channels most, adds temperature and humidity-drop, and a flame bonus — only their coincidence crosses threshold.' },
      { ref: 'if (nHigh >= 3) sendAlert(score)', txt: 'An alert is emitted only when a multi-cue rise persists for several reads, the combination that distinguishes a real fire from weather or a sensor glitch.' },
    ],
  }],

  config: [
    'Set each node\'s location (lat/lon) in flash so alerts are geolocated.',
    'Tune the cue weights, the score threshold and the persistence count from field trials in your vegetation type.',
    'Set the sampling interval (1 min for fast detection) and the mesh HOP_MAX to your network diameter.',
    'Choose the region-legal LoRa frequency and place edge gateways with reliable backhaul to responders.',
  ],
  calibration: [
    { h: 'Baseline settling', p: [
      'At deployment, let baselines learn for hours to a day (sensors warmed up, weather sampled) before enabling alerts so a node does not trip on its own start-up.',
    ] },
    { h: 'Controlled smoke test', p: [
      'With authorisation and safety, introduce a small controlled smoke source near a node and confirm the fused score rises and confirms while single-channel noise does not.',
    ] },
    { h: 'Mesh range and relay', p: [
      'Verify neighbour-to-neighbour range under canopy and that a test alert from the deepest node reaches the edge gateway with sensible hop counts.',
    ] },
  ],
  testing: [
    { step: 'Heat one channel only (e.g. warm the node)', expect: 'Score stays below threshold — single cue is not fire' },
    { step: 'Introduce smoke + heat + dry air together', expect: 'Fused score rises, persists, and an alert is emitted' },
    { step: 'Trigger the flame sensor with a safe flame in view', expect: 'Score jumps via the flame bonus; confirmation faster' },
    { step: 'Inject a test alert at the far node', expect: 'It relays hop-by-hop to the edge gateway; each node relays once' },
    { step: 'Rebroadcast a duplicate id', expect: 'Dedup drops it; no relay storm' },
    { step: 'Run a solar season cycle in heat', expect: 'Battery survives heat; node keeps sampling and relaying' },
  ],
  output: [
    'The responder dashboard shows a map of nodes (green healthy, red alerting) and, on a detection, the originating node\'s location, fire score and the relay path out to the gateway.',
    { file: 'fire-alert.json', lang: 'json', body: `{
  "t": "fire",
  "node": 47,
  "lat": 30.41822,
  "lon": 78.09143,
  "score": 7.8,
  "id": 3080193,
  "hops": 3
}` },
    'Here node 47 deep in the forest has confirmed a fire (fused score 7.8) and its located alert has reached the edge gateway in three hops — a geolocated warning delivered in the fire\'s first minutes.',
  ],
  troubleshoot: [
    { sym: 'Frequent false alarms', cause: 'Alerting on a single channel or absolute thresholds', fix: 'Require multi-cue coincidence and persistence; use per-node baselines, not fixed limits' },
    { sym: 'Node alarms on its own warm-up', cause: 'Alerts enabled before baselines settled', fix: 'Delay alerting for hours after deployment while baselines and sensor heaters stabilise' },
    { sym: 'Alerts do not reach the gateway', cause: 'Mesh gaps, HOP_MAX too low, or antenna orientation', fix: 'Increase node density/HOP_MAX; raise and vertically orient antennas; add relay nodes' },
    { sym: 'Nodes die in summer', cause: 'Battery over-temperature', fix: 'Use LiFePO4 with over-temp cutoff; shade the battery; oversize the panel for hot short days' },
    { sym: 'Gas sensor drifts over months', cause: 'Metal-oxide sensor ageing', fix: 'Rely on rate-of-change (baseline) not absolute values; replace sensors periodically' },
  ],

  iot: {
    protoShort: 'LoRa mesh → edge gateway → fire service',
    net: {
      nodes: [{ name: 'Fire node', sub: 'ESP32 + gas' }, { name: 'Relay nodes', sub: 'mesh peers' }],
      protocol: 'LoRa mesh', gateway: 'Edge gateway', gatewaySub: 'cellular/Ethernet backhaul',
      uplink: 'MQTT/HTTPS', cloud: 'Alert server', cloudSub: 'dispatch + map',
      clients: [{ name: 'Fire service', sub: 'located alerts' }, { name: 'Dashboard', sub: 'node health' }],
    },
    protocol: ['Nodes sample every minute and stay silent unless a fire is confirmed; alerts are small located packets that flood outward through the mesh with deduplication and a hop limit, reaching the edge gateway and then responders in seconds.'],
    topics: [
      { t: 'fire/mesh/alert', dir: 'node → gateway', payload: 'located fire alert (node, lat/lon, score, id, hops)' },
      { t: 'fire/node/health', dir: 'node → gateway', payload: 'battery, baselines, RSSI (periodic)' },
      { t: 'fire/gateway/dispatch', dir: 'gateway → responders', payload: 'geolocated dispatch with confidence' },
    ],
    cloud: ['An alert server geolocates each detection, correlates nearby nodes (several nodes confirming raises confidence), and dispatches to the fire service with a map, while a health map tracks battery and connectivity of every node.'],
    dashboard: ['A forest map of node health with instant red alerting, showing the originating node, fused score, relay path and any corroborating neighbours.'],
    mobile: ['Immediate located push/SMS to responders on a confirmed detection, with confidence raised when multiple nodes agree.'],
    security: [
      'Authenticate and sign alerts so a false fire cannot be injected to waste response resources.',
      'Rate-limit and dedup relays so the mesh cannot be flooded, accidentally or maliciously.',
      'Monitor node health so a cluster going silent (possibly burned or failed) is itself a signal.',
    ],
  },

  perf: [
    'Deep-sleep between one-minute samples; the gas-sensor heaters are the main continuous draw, so manage warm-up carefully.',
    'Keep nodes silent unless confirming — the mesh should carry almost no traffic until a real event.',
    'Persist baselines in RTC memory so detection survives sleep without re-priming.',
    'Bound mesh flooding with dedup, random backoff and a hop limit so alerts propagate fast without storms.',
  ],
  safety: [
    'This is a complement to satellites, cameras and lookouts — coverage depends on node density and it must not be the sole line of defence.',
    'Design nodes and batteries for extreme heat with over-temperature protection; a node must not itself become an ignition or failure risk.',
    'Conduct any smoke/flame testing with authorisation and full fire-safety precautions.',
    'Ensure alerts reach a real dispatch path with human confirmation before mobilising resources.',
  ],
  maintenance: [
    'Replace ageing gas sensors and re-verify detection with a controlled test each season before the fire season.',
    'Check battery health and over-temperature protection; heat degrades cells fastest.',
    'Verify mesh connectivity and fill coverage gaps with additional relay nodes.',
    'Keep solar panels clear of dust and canopy debris; a starved node is a blind spot.',
  ],
  future: [
    'Add low-cost thermal or optical smoke imaging on select nodes for visual confirmation.',
    'Correlate node detections with weather (wind, dryness indices) to predict spread direction with the alert.',
    'Machine-learn the fusion weights per vegetation type from labelled fire/no-fire episodes.',
    'Add satellite backhaul on gateways for forests beyond any cellular coverage.',
  ],
  faq: [
    { q: 'How is this earlier than a satellite?', a: 'Satellites revisit on a schedule and need a fire large and hot enough to show through canopy and cloud. Ground nodes smell the smoke gas and feel the heat and humidity drop in the fire\'s first minutes, right at the source.' },
    { q: 'Won\'t cheap gas sensors cause endless false alarms?', a: 'Not when fused. The system requires smoke gas, temperature and humidity to move together and persist, judged against each node\'s own baseline. That coincidence is the fingerprint of fire and rejects weather, exhaust and drift.' },
    { q: 'How do alerts get out of a forest with no signal?', a: 'A LoRa mesh: each node relays its neighbours\' messages, so an alert hops node to node until it reaches a gateway at the forest edge with cellular or wired backhaul to the fire service.' },
    { q: 'What is the flame sensor for if gas detects first?', a: 'Confirmation. Where a node has line of sight to flame, it adds strong direct evidence and raises confidence, but its short range and need for a clear view keep it a confirmer, not the primary detector.' },
    { q: 'How much area does one node cover?', a: 'A small radius — that is why density matters. Coverage is only as good as how many nodes you deploy, and the design is honest that it complements rather than replaces satellites and lookouts.' },
  ],
  refs: [
    { t: 'Wildfire detection methods — overview', u: 'https://en.wikipedia.org/wiki/Wildfire#Detection', s: 'Reference' },
    { t: 'Metal-oxide gas sensors (MQ series) — principles', u: 'https://en.wikipedia.org/wiki/MOS_sensor', s: 'Reference' },
    { t: 'LoRa mesh networking — overview', u: 'https://en.wikipedia.org/wiki/LoRa', s: 'Reference' },
    { t: 'Sensor fusion for detection — overview', u: 'https://en.wikipedia.org/wiki/Sensor_fusion', s: 'Reference' },
    { t: 'FAO — forest fire management', u: 'https://www.fao.org/forestry/', s: 'FAO' },
  ],
  images: ['solar', 'esp32', 'lora'],
  imageCaptions: [
    'Solar power lets fire nodes live for seasons deep in forest where there is no mains and no cellular.',
    'ESP32 module fusing smoke, heat and humidity cues against a learned baseline to confirm fire.',
    'A LoRa radio relays located alerts node-to-node out of the forest to a gateway and the fire service.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   043 — Flood Level Sensor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '043',
  domainKey: 'iot',
  emoji: '🌊', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Watches a river\'s level and — more importantly — its rate of rise from a bridge or bank, turning a fast climb into a staged warning while there is still time to move.',

  overview: [
    'Floods kill and destroy not because water is inherently mysterious but because warnings arrive too late. A river can look benign at dusk and be over its banks by dawn, and the people most exposed — a downstream village, a low bridge, a riverside market — often have no idea the water upstream is already climbing fast. This sensor is a simple, robust early-warning node: mounted on a bridge or a bank, it measures the distance down to the water surface, converts that to a river level, and watches not just whether the level is high but how <b>fast it is rising</b> — because the rate of rise, more than the absolute level, is what tells you a flood is coming and how much time is left.',
    'The measurement is deliberately non-contact. An ultrasonic (or radar) sensor looks down from the structure at the water and times an echo; nothing the sensor needs sits in the water to be swept away, fouled or buried in debris, which is what kills contact float gauges in exactly the flood conditions you care about. From the measured level the node computes the rate of rise and issues <b>staged alerts</b> — watch, warning, danger — each tied to a level and a rate, so a slow seasonal rise is treated differently from a flash flood climbing tens of centimetres an hour. Rain sensing can be added so the node knows whether a rise is being fed by local downpour.',
    'Like the rest of this family, it is built to live where it is needed: solar-powered because riverbanks have no mains, reporting over LoRa or cellular because they have no Wi-Fi, sealed against weather, and logging locally so a dropped link during the storm — the worst possible moment — never loses the record or silences the warning. Multiple nodes along a river become a chain that watches a flood travel: an upstream node crossing "danger" is itself an early warning for everyone downstream, with real lead time measured from how long the water actually takes to arrive. It will not stop a flood, but it can give a village the twenty minutes that turn a disaster into an evacuation.',
  ],
  does: [
    'Measures river level non-contact from a bridge or bank (ultrasonic/radar)',
    'Computes the rate of rise, the key early-warning signal',
    'Issues staged alerts (watch / warning / danger) on level and rate',
    'Optionally senses rain to attribute a rise to local rainfall',
    'Runs on solar + battery and reports over LoRa or cellular',
    'Logs locally so a link outage during the storm loses nothing',
    'Chains along a river so upstream danger warns downstream with real lead time',
  ],
  features: [
    'Rate-of-rise focus — flash-flood warning, not just a high-water mark',
    'Non-contact sensing that survives the debris and current of a flood',
    'Staged, level-and-rate alerts distinguishing seasonal rise from flash flood',
    'Local logging + LoRa/cellular for the storm when networks fail',
    'Solar, sealed, unattended riverbank operation',
    'Upstream-to-downstream lead time from a chain of nodes',
    'Optional rainfall attribution',
  ],
  applications: [
    { t: 'Community flash-flood warning', d: 'Protecting downstream villages and low crossings with staged alerts and real lead time as a flood front travels down the river.' },
    { t: 'Urban stormwater and culverts', d: 'Watching drains, culverts and urban streams that flood streets and underpasses in intense rain.' },
    { t: 'Low-water crossings and causeways', d: 'Automatically warning (and gating) at fords and causeways that become deadly when the water rises.' },
    { t: 'Reservoir and canal monitoring', d: 'Tracking levels behind and below control structures for operations and downstream safety.' },
  ],
  skills: [
    'Non-contact level measurement with an ultrasonic/radar sensor and echo filtering',
    'Converting distance-to-water into level with a datum',
    'Computing rate of rise and staged alert logic',
    'LoRa/cellular telemetry with local-logging fallback',
    'Solar power design for riverside nodes',
  ],
  prereq: [
    'Rate of rise is often more important than absolute level — a fast climb warns of a flood before the water is high.',
    'Mount the sensor above the highest expected flood so the sensor itself is not submerged or struck by debris.',
    'Filter echoes: waves, spray, debris and foam produce spurious returns; use median/statistical filtering.',
    'Local logging is essential — networks often fail in the storm exactly when the data matters most.',
  ],

  parts: ['esp32', 'jsnsr04t', 'rain', 'ds18b20', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Radar/ultrasonic level sensor (long-range)', spec: 'Waterproof, long-range (JSN-SR04T for short spans; radar for large clearance)', qty: 1, price: 1200, note: 'Radar is better over big drops and in spray; ultrasonic suits low bridges' },
    { name: 'Rigid downward mount / bracket', spec: 'Aims the sensor straight down at the water, above max flood, rigid against wind', qty: 1, price: 350 },
    { name: 'Cellular modem (optional)', spec: 'For sites without LoRa gateway coverage', qty: 1, price: 900, note: 'LoRa preferred where a gateway exists' },
    { name: 'Local siren/beacon (optional)', spec: 'On-site audible/visual warning at a crossing', qty: 1, price: 500 },
  ],
  cost: '₹4,500 – ₹6,500',
  libs: ['wifi', 'pubsub', 'onewire', 'unified', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'Level sensor', devPin: 'TRIG/ECHO', pin: 'GPIO 26/25', sig: 'Distance down to water' },
      { dev: 'Rain sensor', devPin: 'AOUT/DOUT', pin: 'GPIO 34 / 27', sig: 'Local rainfall (optional)' },
      { dev: 'DS18B20', devPin: 'DQ', pin: 'GPIO 4', sig: 'Air temp (sound-speed correction)' },
    ],
    right: [
      { dev: 'LoRa/cellular', devPin: 'bus', pin: 'SPI / UART', sig: 'Telemetry uplink' },
      { dev: 'Siren/beacon', devPin: 'IN', pin: 'GPIO 13', sig: 'Local warning (optional)' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar-charged supply' },
      { dev: 'Solar panel', devPin: '+/–', pin: 'TP4056 IN', sig: '6 V panel → charger' },
    ],
  },
  wiringNotes: [
    'Mount the level sensor rigidly, aimed straight down at the water, well above the highest expected flood so it is never submerged or hit by debris.',
    'For ultrasonic sensors, correct the echo time for the speed of sound using air temperature — sound speed varies enough with temperature to matter over a large drop.',
    'Keep the mount rigid against wind; a swaying sensor changes its aim and its measured distance.',
    'Route the antenna high and clear; place the electronics box on the structure above flood level.',
    'If fitting a siren at a crossing, drive it via a relay and ensure its power does not brown out the sensor node.',
  ],

  block: { columns: [
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'Level (non-contact)', sub: 'ultrasonic/radar', highlight: true },
      { name: 'Rain (opt)', sub: 'attribution' },
      { name: 'Air temp', sub: 'sound-speed' },
    ] },
    { label: 'Assess', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'level + rate' },
      { name: 'Staged alerts', sub: 'watch/warn/danger' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'LoRa/cellular', sub: '+ local log' },
    ] },
    { label: 'Warn', edge: 'none', blocks: [
      { name: 'Downstream', sub: 'lead-time alert' },
      { name: 'Siren (opt)', sub: 'on-site' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Measure distance; filter echoes', k: 'proc' },
    { t: 'Convert to level; compute rate of rise', k: 'proc' },
    { t: 'Level or rate over a stage threshold?', k: 'dec', yes: 'Escalate stage; alert + local siren', no: 'Log trend' },
    { t: 'Escalate stage; alert + local siren', k: 'io' },
    { t: 'Log trend', k: 'proc' },
    { t: 'Transmit + local log', k: 'io' },
    { t: 'Sleep (shorter if rising)', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'The core insight is that <b>rate of rise carries the warning</b>. A river\'s absolute level tells you the present danger, but its rate of change tells you the future one — and gives you time. Water rising ten centimetres an hour is a seasonal event you watch; water rising a metre an hour is a flash flood, and the difference in the two numbers is the difference between "keep an eye on it" and "move now". By computing the rate from successive level readings, the node converts a passive gauge into an early-warning device: it can be issuing a "danger" alert while the water is still well below the bank, because the <i>trajectory</i> says where it will be in twenty minutes.',
    'Measurement is <b>non-contact by necessity</b>. The sensor looks down from the structure and times an echo off the water surface — ultrasonic for modest clearances, radar for large drops and heavy spray — so nothing the node depends on is in the water. This is not a convenience; it is survival. Contact gauges (floats, pressure transducers on the bed) are exactly what debris, sediment and violent current destroy during a flood, so a node that must survive the flood to warn of it cannot rely on anything submerged. The trade is that surface echoes are noisy — waves, foam, spray and passing debris all scatter the pulse — so the node takes many pings and uses a robust statistic (a median) to reject the spurious returns and track the true surface.',
    'Turning distance into a meaningful level needs a <b>datum</b>: the sensor measures the gap down to the water, which is converted to a level above a reference (say, the riverbed or a defined zero) by subtracting from the known sensor height. Staged thresholds are then set against that level and against the rate — a "watch" at a modest level or gentle rise, a "warning" higher or faster, a "danger" at flood level or a rapid climb. Staging matters because a single alarm level cannot express both "high but stable" and "not yet high but climbing dangerously fast"; two axes (level and rate) mapped to graded stages let the node say the right thing in each case, and hysteresis stops it flickering between stages on noise.',
    'The system\'s real power appears when nodes are <b>chained along a river</b>. Because water takes real time to travel downstream, an upstream node crossing "danger" is a concrete early warning for every community below it, with a lead time you can actually estimate from the travel time between stations. This is how meaningful flood warning works at low cost: not one perfect gauge, but a line of honest ones, each watching its reach and passing the news downstream faster than the water can flow. And because the network that carries those warnings is most likely to fail in the storm, every node logs locally and keeps sounding any local siren regardless of the link — the warning must not depend on the very connectivity a flood tends to knock out.',
  ],
  equations: [
    { t: 'Level from non-contact distance', eq: 'Sensor at known height H_sensor above the datum measures\ndistance d down to the water:\n\n  water_level = H_sensor − d\n\nUltrasonic distance from echo time, temperature-corrected:\n  c = 331.3 + 0.606·T_air   (m/s, speed of sound)\n  d = c · t_echo / 2' },
    { t: 'Rate of rise', eq: 'From successive levels L at times t:\n\n  rate = (L_now − L_prev) / (t_now − t_prev)   [m/h]\n\nSmooth lightly to reject noise but stay responsive:\n  rate_s ← 0.7·rate_s + 0.3·rate\n\nA high rate can trigger "danger" while the absolute level is\nstill moderate — the essence of flash-flood warning.' },
    { t: 'Staged alert logic (level × rate)', eq: 'stage = max( stage_by_level(L), stage_by_rate(rate_s) )\n\n  WATCH   : L > L1  OR rate > R1\n  WARNING : L > L2  OR rate > R2\n  DANGER  : L > L3  OR rate > R3\n\nHysteresis: require L to fall a margin below a threshold to\nde-escalate, so the stage does not flicker on wave noise.' },
  ],

  assembly: [
    { h: 'Mount above the worst-case flood', p: [
      'Fix the level sensor rigidly to the bridge or a bank mast, aimed straight down at the water and positioned above the highest flood ever recorded plus margin, so the sensor itself never goes under or into the debris path.',
      'Measure and record the sensor height above your chosen datum precisely — every level reading depends on it.',
    ], warn: 'If the sensor can be submerged or struck by flood debris, it will fail at the peak — exactly when the warning matters most. Height and rigidity are the whole game.' },
    { h: 'Add temperature and rain sensing', p: [
      'Fit the air-temperature sensor for the sound-speed correction (ultrasonic), and optionally a rain sensor so the node can attribute a rise to local rainfall versus upstream flow.',
    ] },
    { h: 'Set up power, link and any siren', p: [
      'Angle the solar panel, mount the LoRa/cellular antenna high, and place the electronics box above flood level. If used, wire a local siren/beacon via a relay for on-site warning at a crossing.',
    ] },
  ],
  steps: [
    { h: 'Measure level robustly', p: [
      'Take many pings, discard outliers with a median, convert the temperature-corrected distance to a level above datum, and reject any reading that implies an impossible jump.',
    ], code: {
      file: 'level-measure.ino', lang: 'cpp',
      body: `#define H_SENSOR_CM 600.0f     // sensor height above datum (measured)

float soundSpeedCmUs(float tAir) {
  return (331.3f + 0.606f * tAir) / 10000.0f;   // cm per microsecond
}

// Median of many pings rejects wave/spray/debris echoes.
float measureLevel(float tAir) {
  const int N = 9; float d[N];
  for (int i = 0; i < N; i++) {
    digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
    digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
    digitalWrite(PIN_TRIG, LOW);
    long us = pulseIn(PIN_ECHO, HIGH, 60000);
    d[i] = us ? us * soundSpeedCmUs(tAir) / 2.0f : NAN;
    delay(50);
  }
  // simple insertion sort, take median
  for (int i = 1; i < N; i++) { float k=d[i]; int j=i-1;
    while (j>=0 && (isnan(d[j])||d[j]>k)) { d[j+1]=d[j]; j--; } d[j+1]=k; }
  float dist = d[N/2];
  if (isnan(dist)) return NAN;
  return H_SENSOR_CM - dist;          // level above datum (cm)
}`,
      explain: [
        { ref: 'float soundSpeedCmUs(float tAir)', txt: 'The speed of sound varies with air temperature, so the echo-to-distance conversion is temperature-corrected — important over a large drop where a few percent error is centimetres of level.' },
        { ref: 'const int N = 9; float d[N]', txt: 'Nine pings are taken because a water surface scatters the pulse; a single ping off a wave crest or a piece of debris would give a wildly wrong distance.' },
        { ref: 'take median', txt: 'The median of the nine readings rejects the spurious echoes entirely, tracking the true surface where a simple average would be dragged by outliers.' },
        { ref: 'return H_SENSOR_CM - dist', txt: 'The measured gap down to the water is subtracted from the known sensor height to give the level above the datum — the number the alert logic and downstream nodes actually use.' },
      ],
    } },
    { h: 'Compute rate and stage the alert', p: [
      'Compute a lightly-smoothed rate of rise from successive levels, map both level and rate to a stage (watch/warning/danger) taking the worse of the two, and apply hysteresis so the stage does not flicker.',
    ], tip: 'Shorten the sampling interval automatically once the level is rising, so a fast event is tracked at higher time resolution.' },
    { h: 'Log, transmit, warn', p: [
      'Write every reading locally first, transmit level, rate and stage, drive any on-site siren on danger, and forward the backlog when the link returns.',
    ] },
  ],

  code: [{
    file: 'flood-level-sensor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Flood Level Sensor — ESP32, non-contact level, rate-of-rise, LoRa

   Measures river level from a structure, computes rate of rise, issues
   staged watch/warning/danger alerts, drives an optional local siren,
   and reports over LoRa/cellular with local-logging fallback.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_TRIG 26
#define PIN_ECHO 25
#define OW_PIN    4
#define PIN_SIREN 13
#define LORA_CS   5
#define LORA_RST 14
#define LORA_DIO0 2
#define H_SENSOR_CM 600.0f

// Stage thresholds (level cm above datum, rate cm/h).
#define L1 150.0f
#define L2 300.0f
#define L3 450.0f
#define R1 20.0f
#define R2 60.0f
#define R3 120.0f

OneWire ow(OW_PIN); DallasTemperature airT(&ow);
Preferences prefs;

RTC_DATA_ATTR float prevLevel = NAN; RTC_DATA_ATTR uint32_t prevMs = 0;
RTC_DATA_ATTR float rateS = 0; RTC_DATA_ATTR int stage = 0;

const char *STAGE[] = {"normal","watch","warning","danger"};

float soundSpeedCmUs(float t){ return (331.3f+0.606f*t)/10000.0f; }

float measureLevel(float t) {
  const int N = 9; float d[N];
  for (int i=0;i<N;i++){
    digitalWrite(PIN_TRIG,LOW); delayMicroseconds(2);
    digitalWrite(PIN_TRIG,HIGH); delayMicroseconds(10);
    digitalWrite(PIN_TRIG,LOW);
    long us=pulseIn(PIN_ECHO,HIGH,60000);
    d[i]= us? us*soundSpeedCmUs(t)/2.0f : NAN; delay(50);
  }
  for(int i=1;i<N;i++){float k=d[i];int j=i-1;
    while(j>=0&&(isnan(d[j])||d[j]>k)){d[j+1]=d[j];j--;} d[j+1]=k;}
  float dist=d[N/2];
  return isnan(dist)? NAN : H_SENSOR_CM - dist;
}

int stageOf(float level, float rate) {
  int byL = level>L3?3 : level>L2?2 : level>L1?1 : 0;
  int byR = rate >R3?3 : rate >R2?2 : rate >R1?1 : 0;
  return max(byL, byR);              // worse of level or rate
}

void transmit(float level, float rate, int st) {
  LoRa.beginPacket();
  LoRa.printf("{\\"node\\":1,\\"level\\":%.0f,\\"rate\\":%.0f,"
              "\\"stage\\":\\"%s\\"}", level, rate, STAGE[st]);
  LoRa.endPacket();
}

void logLocal(float level, float rate, int st) { /* append timestamped */ }

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG,OUTPUT); pinMode(PIN_ECHO,INPUT);
  pinMode(PIN_SIREN,OUTPUT);
  airT.begin();

  airT.requestTemperatures();
  float tAir = airT.getTempCByIndex(0);
  float level = measureLevel(tAir);
  uint32_t now = millis();

  float rate = 0;
  if (!isnan(prevLevel) && prevMs) {
    float dtH = (now - prevMs) / 3600000.0f;        // ms → hours
    if (dtH > 0) rate = (level - prevLevel) / dtH;  // cm/h
  }
  rateS = 0.7f*rateS + 0.3f*rate;                    // light smoothing

  int newStage = stageOf(level, rateS);
  // hysteresis: only de-escalate if clearly below the lower stage
  if (newStage < stage && level > (stage==3?L3-50: stage==2?L2-50: L1-50))
    newStage = stage;
  stage = newStage;

  digitalWrite(PIN_SIREN, stage >= 3 ? HIGH : LOW); // danger → local siren

  logLocal(level, rateS, stage);                     // record first

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);
  transmit(level, rateS, stage);

  prevLevel = level; prevMs = now;

  // sample faster when rising or already elevated
  uint32_t sleep_s = (rateS > R1 || stage >= 1) ? 120 : 900;
  esp_sleep_enable_timer_wakeup((uint64_t)sleep_s * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'RTC_DATA_ATTR float prevLevel', txt: 'The previous level, timestamp and smoothed rate persist across deep sleep, so the rate of rise is computed correctly between wakes rather than lost each cycle.' },
      { ref: 'int stageOf(float level, float rate)', txt: 'Maps both level and rate to a stage and takes the worse of the two, so a fast rise can raise "danger" while the water is still only moderately high — the flash-flood case.' },
      { ref: 'if (newStage < stage && level >', txt: 'Hysteresis prevents the alert stage from flickering downward on wave noise; it only de-escalates once the level has clearly dropped below the stage boundary.' },
      { ref: 'digitalWrite(PIN_SIREN, stage >= 3', txt: 'On "danger" the local siren sounds directly from the node, independent of the network — the on-site warning cannot depend on a link a flood may have knocked out.' },
      { ref: 'uint32_t sleep_s = (rateS > R1 || stage >= 1)', txt: 'The node samples every fifteen minutes when calm but drops to two-minute intervals the moment the water is rising or elevated, tracking a developing flood at high resolution.' },
    ],
  }],

  config: [
    'Measure and set H_SENSOR_CM (sensor height above your datum) precisely.',
    'Set the level thresholds (L1–L3) from local flood history and the rate thresholds (R1–R3) from what a dangerous climb looks like on this river.',
    'Choose the calm and rising sampling intervals and the hysteresis margins.',
    'Select LoRa/cellular, configure local logging + backlog forwarding, and wire any siren.',
  ],
  calibration: [
    { h: 'Datum and height', p: [
      'Verify the sensor height by comparing a measured level against a physical staff gauge or a known water mark; correct H_SENSOR_CM until they agree.',
    ] },
    { h: 'Echo filtering', p: [
      'Confirm the median filter rejects wave/spray outliers by watching raw vs filtered distance during choppy conditions.',
    ] },
    { h: 'Rate thresholds', p: [
      'Set the rate stages against historical flood hydrographs for the river so "danger" corresponds to genuinely dangerous climbs, not ordinary rises.',
    ] },
  ],
  testing: [
    { step: 'Raise a target toward the sensor', expect: 'Measured level increases correctly; median rejects a single spurious ping' },
    { step: 'Simulate a fast rise between reads', expect: 'Rate of rise climbs; stage can reach danger before the level threshold' },
    { step: 'Hold a high but steady level', expect: 'Stage set by level; no flicker thanks to hysteresis' },
    { step: 'Drop the link during a rising event', expect: 'Readings logged locally; siren still sounds on danger; backlog forwards later' },
    { step: 'Cool/warm the air (ultrasonic)', expect: 'Temperature correction keeps the distance accurate' },
    { step: 'Run a solar day/night cycle', expect: 'Battery recovers; faster sampling during events is sustainable' },
  ],
  output: [
    'The dashboard shows each node\'s level, rate of rise and current stage on a map, with a river-chain view where an upstream danger stage flags downstream lead time.',
    { file: 'flood-packet.json', lang: 'json', body: `{
  "node": 1,
  "level": 280,
  "rate": 95,
  "stage": "danger"
}` },
    'Here the level (280 cm) is only at the "warning" band, but the rate of rise (95 cm/h) pushes the stage to "danger" — the node warning of a flash flood before the water is physically high, which is exactly the point.',
  ],
  troubleshoot: [
    { sym: 'Level jumps around wildly', cause: 'Wave/spray/debris echoes, or a swaying mount', fix: 'Increase pings and keep the median filter; make the mount rigid; aim straight down' },
    { sym: 'Level slowly wrong by a fixed amount', cause: 'Sensor height/datum miscalibrated', fix: 'Recalibrate H_SENSOR_CM against a staff gauge or known water mark' },
    { sym: 'Distance drifts with day/night temperature', cause: 'No sound-speed correction (ultrasonic)', fix: 'Apply the air-temperature correction; consider a radar sensor for large drops' },
    { sym: 'Alerts flicker between stages', cause: 'No/insufficient hysteresis', fix: 'Increase the de-escalation margins so noise cannot bounce the stage' },
    { sym: 'No data during the flood', cause: 'Network failed and no local logging', fix: 'Ensure local logging and the on-site siren work independently of the link' },
  ],

  iot: {
    protoShort: 'LoRa/cellular → gateway → flood warning system',
    net: {
      nodes: [{ name: 'River node', sub: 'ESP32 + level' }, { name: 'Upstream nodes', sub: 'river chain' }],
      protocol: 'LoRa / cellular', gateway: 'Area gateway', gatewaySub: 'or direct cellular',
      uplink: 'MQTT 1883', cloud: 'Warning system', cloudSub: 'stages + lead time',
      clients: [{ name: 'Authorities', sub: 'staged alerts' }, { name: 'Public/SMS', sub: 'evacuation' }],
    },
    protocol: ['Nodes report level, rate and stage on a cadence that shortens while rising; stage changes publish immediately. Local logging is authoritative and forwards backlog on reconnect, so the storm-time record survives network failure.'],
    topics: [
      { t: 'flood/node/1/level', dir: 'node → broker', payload: 'level, rate of rise, stage' },
      { t: 'flood/node/1/stage', dir: 'node → broker', payload: 'stage change (watch/warning/danger)' },
      { t: 'flood/node/1/status', dir: 'node → broker', payload: 'battery, RSSI, sensor health' },
    ],
    cloud: ['A warning system correlates nodes along a river: an upstream danger stage, combined with the known travel time to downstream communities, produces a concrete lead-time evacuation warning with a map of the advancing front.'],
    dashboard: ['A river map coloured by stage, per-node level/rate trends, and a chain view estimating when an upstream event reaches each downstream point.'],
    mobile: ['Staged push/SMS to authorities and, at danger, to the public and to on-site sirens, timed by the estimated arrival of the flood front.'],
    security: [
      'Sign node reports so false flood alerts cannot be injected to cause panic or complacency.',
      'Keep the local siren and logging independent of the network so a lost link cannot silence the warning.',
      'Alert on a node going silent during rising conditions — a failed node in a storm is itself significant.',
    ],
  },

  perf: [
    'Deep-sleep between reads when calm; shorten the interval automatically once the level is rising.',
    'Median-filter many pings rather than trusting one; the water surface is a noisy target.',
    'Persist previous level, time and rate in RTC memory so rate-of-rise is correct across sleeps.',
    'Keep packets tiny; the value is timeliness of the stage, not data volume.',
  ],
  safety: [
    'Mount above the worst-case flood so the node survives the peak it must warn about.',
    'Keep the on-site siren and local logging independent of the network — the warning must not depend on connectivity a flood can destroy.',
    'Install and service on riverbanks and bridges with proper safety; never work near fast water alone.',
    'This provides early warning to support official decisions; it does not replace an authoritative flood-warning authority.',
  ],
  maintenance: [
    'Re-verify the datum/height after any structural work or if the mount is disturbed.',
    'Clear the sensor\'s line of sight of nests, cobwebs and vegetation that cause false echoes.',
    'Test the siren and local logging before each wet season.',
    'Keep the solar panel clean and check the antenna and seals after storms.',
  ],
  future: [
    'Fuse rainfall and upstream nodes into a simple routing model for better lead-time estimates.',
    'Add a camera snapshot on danger for visual confirmation to responders.',
    'Add automatic barrier/gate control at low-water crossings tied to the danger stage.',
    'Machine-learn river-specific stage thresholds from historical hydrographs.',
  ],
  faq: [
    { q: 'Why is rate of rise more important than the level?', a: 'The level tells you the danger now; the rate tells you the danger soon — and gives you time. A fast climb can warrant a danger alert while the water is still moderate, which is how you get people out before a flash flood peaks.' },
    { q: 'Why non-contact measurement?', a: 'Anything in the water — floats, bed sensors — is destroyed by the debris and current of a flood, exactly when you need the reading. Looking down at the surface from above keeps the sensor out of harm.' },
    { q: 'How does a chain of nodes give lead time?', a: 'Water takes real time to travel downstream. An upstream node reaching "danger" is an early warning for everyone below, with a lead time you can estimate from the travel time between stations.' },
    { q: 'What if the network fails in the storm?', a: 'It often does — which is why the node logs locally and sounds any on-site siren independent of the link, and forwards its backlog once connectivity returns. The warning never depends solely on the network.' },
    { q: 'Can it stop a flood?', a: 'No — it warns of one. Its job is to convert a fast rise into staged alerts with real lead time so people and assets can be moved, turning a disaster into an evacuation.' },
  ],
  refs: [
    { t: 'Flood warning systems — overview', u: 'https://en.wikipedia.org/wiki/Flood_warning', s: 'Reference' },
    { t: 'Flash floods and rate of rise — hydrology', u: 'https://en.wikipedia.org/wiki/Flash_flood', s: 'Reference' },
    { t: 'Ultrasonic and radar water-level sensing', u: 'https://www.usgs.gov/mission-areas/water-resources', s: 'USGS' },
    { t: 'Speed of sound and temperature', u: 'https://en.wikipedia.org/wiki/Speed_of_sound', s: 'Reference' },
    { t: 'Community-based flood early warning (guidance)', u: 'https://www.undrr.org/', s: 'UNDRR' },
  ],
  images: ['ultrasonic', 'lora', 'city'],
  imageCaptions: [
    'A non-contact ultrasonic/radar sensor reads the water surface from a bridge without anything in the flood\'s path.',
    'A LoRa (or cellular) radio carries level, rate and stage from the riverbank to the warning system.',
    'Chained along a river, the nodes warn downstream communities with real lead time as a flood travels.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   044 — UV Index Public Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '044',
  domainKey: 'iot',
  emoji: '🌞', thumb: 'board',
  difficulty: 'Beginner',
  hours: '8–12 hours', iso8601: 'PT10H',
  tagline: 'Measures real UV at a specific park or beach and shows the live UV index and a plain-language safe-exposure time on a bright public display.',

  overview: [
    'The UV index on a weather app is a forecast for a whole city, and it can be badly wrong for the spot you are actually standing in: a shaded plaza, a high-altitude viewpoint, a beach with sand and water bouncing extra UV back at you, a cloudy morning that clears at noon. UV is what causes sunburn, premature skin ageing and, over years, skin cancer — and it is invisible, so people routinely under- or over-estimate it. This monitor measures the <b>actual</b> UV at one public place in real time and shows it on a bright, glanceable display with something more useful than a number: roughly how long until an unprotected person of average skin would start to burn.',
    'The sensing is straightforward and the honesty is in the interpretation. A UV sensor measures the erythemal (sunburn-weighted) UV irradiance, which converts to the standard <b>UV index</b> — the familiar 0-to-11+ scale where each unit is a fixed amount of skin-reddening UV. From the UV index and a typical skin type, the monitor estimates a safe-exposure time: at UV index 3 you might have the better part of an hour before an average unprotected person burns, at UV index 10 only a few minutes. It shows the index, a colour band (green/yellow/orange/red/purple, matching the international standard), and that burn-time in plain words, so a parent at a playground or a swimmer at a beach gets advice they can act on rather than a number they have to interpret.',
    'Because it lives in a public space, it is built to be seen and to run itself: a bright display readable in full sun, solar power so it needs no mains at a remote park or beach, and optional connectivity to log the day\'s UV profile and feed a network of such displays across a city\'s parks. It is careful to state its limits — a single low-cost UV sensor is indicative, must be sited in the open and kept clean, and burn-time is an average not a personal guarantee — but as a piece of public-health infrastructure it does something apps cannot: it tells you the truth about the sun where you are, right now, and nudges people to cover up before they get hurt.',
  ],
  does: [
    'Measures real erythemal UV and converts it to the standard UV index',
    'Estimates a plain-language safe-exposure (burn) time from the index',
    'Shows the index, the international colour band and advice on a bright display',
    'Logs the day\'s UV profile (peak, timing) for a place',
    'Runs on solar so it needs no mains at a park or beach',
    'Optionally networks many displays into a city parks map',
    'States its limits honestly — indicative, sited and cleaned, average advice',
  ],
  features: [
    'Location-true UV, not a citywide forecast',
    'Standard UV index and the international colour categories',
    'Actionable burn-time advice in plain language',
    'Bright, sun-readable public display',
    'Solar, self-contained, park/beach-ready',
    'Optional networking for a city parks UV map',
    'Daily UV-profile logging',
  ],
  applications: [
    { t: 'Parks, playgrounds and beaches', d: 'Public-health signage that tells families the real UV and safe time at the exact spot they are enjoying, prompting sun protection.' },
    { t: 'Schools and sports grounds', d: 'Live UV at the field so PE and outdoor activity can be timed and protected, especially for children.' },
    { t: 'High-altitude and snow locations', d: 'Viewpoints and ski areas where thin air and reflective snow drive UV far above valley forecasts.' },
    { t: 'Workplace sun-safety', d: 'Outdoor worksites displaying live UV to trigger break and cover-up policies.' },
  ],
  skills: [
    'Reading a UV sensor and converting irradiance to UV index',
    'Estimating erythemal (burn) exposure time from the index and skin type',
    'Driving a bright, sun-readable display',
    'Solar power design for a public installation',
    'Optional networking of public displays',
  ],
  prereq: [
    'Site the sensor in the open with a clear view of the whole sky — shade, overhangs or dirt make it read low and give dangerously reassuring advice.',
    'A single low-cost UV sensor is indicative; calibrate against a reference where possible and present readings as guidance.',
    'Burn-time is an average for a typical skin type — the display must say so; individuals vary widely.',
  ],

  parts: ['esp32', 'tft', 'bh1750', 'ds18b20', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'UV sensor (erythemal)', spec: 'LTR390 / VEML6075 / Si1145-class UV sensor; erythemal/UVI output', qty: 1, price: 350, note: 'Choose one that reports UVA/UVB or UV index; calibrate if possible' },
    { name: 'Bright sun-readable display', spec: 'High-nit TFT, large LED digits, or an outdoor LED matrix behind UV-stable glazing', qty: 1, price: 1200, note: 'Must be legible in direct sunlight — the whole point' },
    { name: 'UV-transparent sensor window', spec: 'A cap/window that passes UV (many plastics block it) protecting the sensor', qty: 1, price: 120, note: 'Ordinary acrylic blocks UV — use a UV-passing material' },
    { name: 'Outdoor pedestal/housing', spec: 'Weatherproof housing, sensor on top facing the sky, display at eye level', qty: 1, price: 900 },
  ],
  cost: '₹3,800 – ₹5,200',
  libs: ['wifi', 'pubsub', 'bh1750lib', 'unified', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'UV sensor', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Erythemal UV / UVI (I²C)' },
      { dev: 'BH1750 (opt)', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Visible light (cross-check)' },
      { dev: 'DS18B20', devPin: 'DQ', pin: 'GPIO 4', sig: 'Enclosure temp (sensor health)' },
    ],
    right: [
      { dev: 'Bright display', devPin: 'SPI/parallel', pin: 'GPIO 18/19/23/5', sig: 'Public UV readout' },
      { dev: 'Wi-Fi (opt)', devPin: 'on-chip', pin: '—', sig: 'Networked UV map + logging' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar-charged supply' },
      { dev: 'Solar panel', devPin: '+/–', pin: 'TP4056 IN', sig: '6 V panel → charger' },
    ],
  },
  wiringNotes: [
    'Mount the UV sensor on top of the housing facing straight up at the open sky, behind a UV-transparent window — ordinary acrylic blocks UV and would make the reading meaningless.',
    'Keep the sensor clear of any shade, overhang or nearby wall that blocks part of the sky or reflects onto it.',
    'Drive the bright display on its own supply headroom; a large LED display can draw significant current and must not brown out the sensor node.',
    'Add an enclosure-temperature sensor so you can flag over-heating, which affects both the sensor and the display.',
    'Angle the solar panel for the site and size it for the display\'s daytime draw plus overnight standby.',
  ],

  block: { columns: [
    { label: 'Measure sky', edge: 'right', blocks: [
      { name: 'UV sensor', sub: 'erythemal → UVI', highlight: true },
      { name: 'Visible (opt)', sub: 'BH1750 cross-check' },
    ] },
    { label: 'Interpret', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'UVI + burn-time' },
      { name: 'Category', sub: 'colour band' },
    ] },
    { label: 'Show', edge: 'right', blocks: [
      { name: 'Bright display', sub: 'index + advice' },
    ] },
    { label: 'Network (opt)', edge: 'none', blocks: [
      { name: 'Parks map', sub: 'city UV' },
      { name: 'Log', sub: 'daily profile' },
    ] },
  ] },
  flow: [
    { t: 'Read UV sensor', k: 'start' },
    { t: 'Convert to UV index', k: 'proc' },
    { t: 'Compute burn-time + colour band', k: 'proc' },
    { t: 'UV index high (≥ 8)?', k: 'dec', yes: 'Show strong-protection advice', no: 'Show standard advice' },
    { t: 'Show strong-protection advice', k: 'io' },
    { t: 'Show standard advice', k: 'io' },
    { t: 'Update display; log; (network)', k: 'proc' },
    { t: 'Wait interval', k: 'end', back: 'Read UV sensor' },
  ],

  principle: [
    'The quantity that matters for health is not raw UV power but <b>erythemally-weighted</b> UV — UV weighted by how effectively each wavelength reddens skin, since shorter-wavelength UVB burns far more per watt than UVA. The internationally standardised <b>UV index</b> is built directly on this: it is the erythemal irradiance scaled so that each index unit equals a fixed amount of skin-reddening UV (25 mW/m² of erythemal irradiance per unit). That standardisation is what lets a single number mean the same thing everywhere and map to the familiar colour categories — low (green) through extreme (purple) — that public-health bodies use worldwide. A good UV sensor either reports the index directly or an erythemal irradiance the firmware converts.',
    'The monitor\'s value over a forecast is <b>locality and truth</b>. A citywide UV forecast cannot know that this particular spot is shaded until noon, sits at altitude where thinner air lets more UV through, or is a beach where sand and water reflect additional UV onto people. By measuring the sky at the actual location, the display reflects the sun people are really under — which can differ substantially from the app in their pocket. This demands correct <b>siting</b>: the sensor must see the whole open sky, behind a UV-transparent window, unshaded and clean, because a sensor under an overhang or a dusty cover reads low and would hand out dangerously reassuring advice.',
    'What turns the index into action is the <b>safe-exposure (burn) time</b>. Because a UV index unit is a fixed dose rate, and skin has a characteristic dose at which it starts to redden (the minimal erythemal dose, which depends on skin type), you can estimate how long until an unprotected average person begins to burn: high index means the dose accumulates fast, so the time is short; low index means it is long. The display shows this in plain language — "about X minutes to burn without protection" — alongside the index and colour, which is far more actionable to a passer-by than a bare number. Crucially, it is framed as an average for a typical skin type, because the minimal erythemal dose varies several-fold between very fair and very dark skin, and the display says so rather than implying a personal guarantee.',
    'Everything else serves getting that message to people reliably in a public place. The display must be genuinely <b>readable in direct sunlight</b> — the environment it exists to describe is the one that washes out ordinary screens — so it uses a high-brightness panel or large LEDs. It runs on <b>solar</b> so it can stand at a remote beach or hilltop with no mains. And optionally it joins a <b>network</b> of such displays, logging each site\'s daily UV profile (when the peak occurs, how high it reaches) and feeding a city map so people can see, and planners can study, how UV varies across a city\'s public spaces. It is modest infrastructure with a real public-health job: making an invisible, cumulative hazard visible at the moment and place people are exposed to it.',
  ],
  equations: [
    { t: 'UV index from erythemal irradiance', eq: 'The UV index is defined from erythemal irradiance E_er:\n\n  UVI = E_er (mW/m²) / 25\n\ni.e. 1 index unit = 25 mW/m² of skin-reddening UV.\nA sensor giving E_er (or UVA/UVB it converts) yields UVI\ndirectly. Categories: 0–2 low, 3–5 moderate, 6–7 high,\n8–10 very high, 11+ extreme.' },
    { t: 'Safe-exposure (burn) time', eq: 'Skin burns after a minimal erythemal dose (MED),\nwhich depends on skin type. As a rate:\n\n  dose_rate ∝ UVI\n  t_burn (min) ≈ MED_factor / UVI\n\nA common rule of thumb for average (type II–III) skin:\n  t_burn ≈ 200 / (UVI × skin_factor)  minutes\nStronger for fair skin, longer for darker skin. Display it\nas AVERAGE guidance, never a personal guarantee.' },
    { t: 'Reflective and altitude enhancement (why local matters)', eq: 'Local UV can exceed a valley forecast because:\n\n  • altitude: +~10–12% UV per 1000 m of elevation\n  • snow reflects up to ~80% of UV back onto you\n  • sand ~15%, water ~10% add to direct UV\n\nA sensor measures the ACTUAL local UV including these,\nwhich a citywide forecast cannot capture.' },
  ],

  assembly: [
    { h: 'Site and mount the UV sensor correctly', p: [
      'Fix the UV sensor on top of the housing facing straight up, behind a UV-transparent window, with an unobstructed view of the whole sky — no overhangs, branches or walls in its hemisphere.',
      'Confirm the window material actually passes UV; many clear plastics block it and would silently kill the reading.',
    ], warn: 'Bad siting is the dangerous failure here: a shaded or dirty sensor reads low and tells people the sun is safe when it is not. Open sky, UV-passing window, kept clean.' },
    { h: 'Fit the bright display', p: [
      'Mount a high-brightness display or large LED digits at eye level, behind UV-stable glazing, angled to avoid direct glare while staying legible in full sun.',
      'Give the display its own current headroom so it never browns out the sensor node.',
    ] },
    { h: 'Set up solar and optional networking', p: [
      'Angle and size the solar panel for the display\'s daytime draw plus standby; add Wi-Fi if joining a parks network and logging daily profiles.',
    ] },
  ],
  steps: [
    { h: 'Read UV and compute index, band and burn-time', p: [
      'Read the UV sensor, convert to UV index, map to the international colour category, and estimate an average safe-exposure time, clamping sensibly at the extremes.',
    ], code: {
      file: 'uv-advice.ino', lang: 'cpp',
      body: `struct UVInfo { float uvi; const char *band; uint32_t burnMin; const char *advice; };

const char* uvBand(float uvi) {
  if (uvi < 3)  return "LOW";
  if (uvi < 6)  return "MODERATE";
  if (uvi < 8)  return "HIGH";
  if (uvi < 11) return "VERY HIGH";
  return "EXTREME";
}

// Average burn time for typical (type II–III) skin; guidance only.
uint32_t burnMinutes(float uvi) {
  if (uvi < 0.5f) return 999;                 // effectively no burn risk
  float t = 200.0f / (uvi * 1.0f);            // skin_factor = 1 (average)
  return (uint32_t)constrain(t, 5.0f, 999.0f);
}

const char* uvAdvice(float uvi) {
  if (uvi < 3)  return "Enjoy — minimal protection needed";
  if (uvi < 6)  return "Hat + sunscreen; seek shade midday";
  if (uvi < 8)  return "Cover up, SPF30+, shade 11-3";
  if (uvi < 11) return "Avoid sun midday; full protection";
  return "Stay in shade; extreme risk";
}

UVInfo uvInfo(float erythemal_mWm2) {
  float uvi = erythemal_mWm2 / 25.0f;         // definition of the UV index
  return { uvi, uvBand(uvi), burnMinutes(uvi), uvAdvice(uvi) };
}`,
      explain: [
        { ref: 'float uvi = erythemal_mWm2 / 25.0f', txt: 'Applies the exact definition of the UV index — 25 mW/m² of erythemal irradiance per index unit — turning the sensor\'s measurement into the standard scale.' },
        { ref: 'const char* uvBand(float uvi)', txt: 'Maps the index to the internationally standardised colour categories, so the display speaks the same language as every public UV forecast.' },
        { ref: 'float t = 200.0f / (uvi * 1.0f)', txt: 'Estimates the average time to burn as inversely proportional to the index, since a UV index unit is a fixed dose rate — higher index, faster dose, shorter time.' },
        { ref: 'constrain(t, 5.0f, 999.0f)', txt: 'Clamps the estimate to sensible bounds so extreme UV never shows an alarmingly precise "2 minutes" and near-zero UV does not show an infinite time.' },
      ],
    } },
    { h: 'Drive the display and (optionally) the network', p: [
      'Show the big index number, the colour band, and the burn-time and advice; log the reading; and if networked, publish the site\'s UV so a parks map and daily-profile record update.',
    ], tip: 'Cross-check the UV reading against a visible-light sensor: if it is bright daylight but UV reads near zero, the sensor is shaded, dirty or faulty — flag it rather than reassure.' },
  ],

  code: [{
    file: 'uv-public-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   UV Index Public Monitor — ESP32 + UV sensor + bright display

   Measures real erythemal UV at a public place, shows the UV index,
   international colour band and an average safe-exposure time, logs the
   daily profile, and optionally feeds a city parks UV map. Solar.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <BH1750.h>
#include <Preferences.h>

// Replace with your UV sensor's driver (LTR390 / VEML6075 / Si1145).
#include "UvSensor.h"

#define PIN_TFT_DC  16
#define INTERVAL_MS 30000UL   // update every 30 s

UvSensor    uv;
BH1750      vis;              // visible-light cross-check
Preferences prefs;
WiFiClient  net;
PubSubClient mqtt(net);

float UV_CAL;                 // reference-calibration scale
float dayPeakUVI = 0; int dayPeakHour = -1;

const char* uvBand(float u){
  if(u<3)return "LOW"; if(u<6)return "MODERATE"; if(u<8)return "HIGH";
  if(u<11)return "VERY HIGH"; return "EXTREME";
}
uint32_t burnMinutes(float u){
  if(u<0.5f)return 999;
  float t=200.0f/(u*1.0f); return (uint32_t)constrain(t,5.0f,999.0f);
}
const char* uvAdvice(float u){
  if(u<3)return "Minimal protection needed";
  if(u<6)return "Hat + sunscreen; shade midday";
  if(u<8)return "Cover up, SPF30+, shade 11-3";
  if(u<11)return "Avoid midday sun; full protection";
  return "Stay in shade; extreme risk";
}

void showDisplay(float uvi, const char* band, uint32_t burn, const char* adv,
                 bool suspect) {
  // Big index, colour band, burn-time and advice on a bright panel.
  displayClear();
  displayBigNumber(uvi);
  displayBand(band);                     // coloured per UVI category
  if (burn < 999) displayBurn(burn);     // "~%u min to burn"
  displayAdvice(adv);
  if (suspect) displayFlag("sensor check"); // shaded/dirty/faulty
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21,22);
  uv.begin();
  vis.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  prefs.begin("uv",true); UV_CAL=prefs.getFloat("cal",1.0f); prefs.end();
  displayInit();
  WiFi.begin(WIFI_SSID,WIFI_PASS);
  mqtt.setServer(MQTT_HOST,1883);
}

void loop() {
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("uv-1");
  mqtt.loop();

  float erythemal = uv.readErythemal_mWm2() * UV_CAL;
  float uvi = erythemal / 25.0f;              // UV index definition
  float lux = vis.readLightLevel();

  // Cross-check: bright daylight but ~zero UV => sensor shaded/dirty/faulty.
  bool suspect = (lux > 20000.0f && uvi < 0.5f);

  const char* band = uvBand(uvi);
  uint32_t burn = burnMinutes(uvi);
  const char* adv = uvAdvice(uvi);
  showDisplay(uvi, band, burn, adv, suspect);

  // daily profile
  int hr = nowHour();
  if (uvi > dayPeakUVI) { dayPeakUVI = uvi; dayPeakHour = hr; }

  if (WiFi.status()==WL_CONNECTED) {
    char b[200];
    snprintf(b,sizeof b,
      "{\\"site\\":1,\\"uvi\\":%.1f,\\"band\\":\\"%s\\",\\"burn_min\\":%u,"
      "\\"peak\\":%.1f,\\"suspect\\":%d}",
      uvi, band, burn, dayPeakUVI, suspect?1:0);
    mqtt.publish("uv/site/1/reading", b);
  }

  delay(INTERVAL_MS);
}`,
    explain: [
      { ref: 'float uvi = erythemal / 25.0f', txt: 'Converts the calibrated erythemal irradiance to the standard UV index by its defining constant, so the displayed number is the real, comparable index.' },
      { ref: 'bool suspect = (lux > 20000.0f && uvi < 0.5f)', txt: 'Cross-checks UV against visible light: bright daylight with near-zero UV means the UV sensor is shaded, dirty or faulty, so the display flags itself rather than handing out falsely reassuring advice.' },
      { ref: 'if (burn < 999) displayBurn(burn)', txt: 'Shows the average time-to-burn only when there is a real burn risk, keeping the public advice concrete and actionable at high UV and uncluttered at low UV.' },
      { ref: 'if (uvi > dayPeakUVI)', txt: 'Tracks the day\'s peak UV and when it occurred, building the per-site daily profile that the network logs and maps.' },
      { ref: 'mqtt.publish("uv/site/1/reading"', txt: 'Publishes the site\'s live UV, band and peak so a city parks map and daily-profile record can aggregate many displays.' },
    ],
  }],

  config: [
    'Set UV_CAL from a reference calibration so the displayed index matches a trusted UV meter.',
    'Choose the skin-type factor and burn-time framing text; always present it as average guidance.',
    'Set the display brightness/day-night behaviour and the update interval.',
    'Enable Wi-Fi/MQTT and daily-profile logging if joining a parks network.',
  ],
  calibration: [
    { h: 'Reference UV', p: [
      'Compare the node against a calibrated UV-index meter across a range (morning to midday) and set UV_CAL so they agree.',
    ] },
    { h: 'Siting check', p: [
      'Confirm the sensor sees the full open sky and that the window passes UV; verify readings track the sun\'s arc and are not clipped by shade.',
    ] },
    { h: 'Cross-check logic', p: [
      'Validate the visible-light cross-check by shading only the UV sensor and confirming the display flags "sensor check".',
    ] },
  ],
  testing: [
    { step: 'Compare to a UV meter at midday', expect: 'Displayed UV index matches the reference after calibration' },
    { step: 'Move through the day', expect: 'Index rises to a midday peak and falls; daily peak/time logged' },
    { step: 'Shade only the UV sensor in daylight', expect: 'Cross-check flags "sensor check"; advice not falsely reassuring' },
    { step: 'Read the display in direct sun', expect: 'Index, colour and advice remain legible' },
    { step: 'Check burn-time at low and extreme UV', expect: 'Sensible clamped values with average-guidance framing' },
    { step: 'Run a solar day/night cycle', expect: 'Battery covers the bright display\'s daytime draw; recovers overnight' },
  ],
  output: [
    'The display shows a large UV-index number, the colour band, and a burn-time with plain advice; if networked, a parks map shows each site\'s live UV and daily peak.',
    { file: 'uv-reading.json', lang: 'json', body: `{
  "site": 1,
  "uvi": 9.2,
  "band": "VERY HIGH",
  "burn_min": 22,
  "peak": 9.6,
  "suspect": 0
}` },
    'Here the live UV index is 9.2 (Very High), with an average burn time of about 22 minutes and a day-peak of 9.6 — a clear, local, actionable public-health message the citywide forecast could not give.',
  ],
  troubleshoot: [
    { sym: 'UV reads low on a clearly sunny day', cause: 'Sensor shaded/dirty, or window blocks UV', fix: 'Re-site for full open sky; clean the window; confirm the window passes UV; the cross-check should flag this' },
    { sym: 'Display unreadable in sunlight', cause: 'Low-brightness panel', fix: 'Use a high-nit display or large LEDs; reduce glare with placement/glazing' },
    { sym: 'Index disagrees with a reference meter', cause: 'Uncalibrated sensor', fix: 'Calibrate UV_CAL against a trusted UV-index meter across a range' },
    { sym: 'Burn-time looks alarmingly precise', cause: 'Presenting an average as a personal guarantee', fix: 'Frame as average guidance for typical skin; clamp extremes; state individual variation' },
    { sym: 'Display browns out at midday', cause: 'Bright display draw exceeds solar/battery', fix: 'Give the display its own headroom; oversize the panel/battery; dim slightly if needed' },
  ],

  iot: {
    protoShort: 'Optional Wi-Fi + MQTT → city parks UV map',
    net: {
      nodes: [{ name: 'UV display', sub: 'ESP32 + sensor' }, { name: 'Other parks', sub: 'more displays' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'per site',
      uplink: 'MQTT 1883', cloud: 'Broker + parks map', cloudSub: 'live + daily profile',
      clients: [{ name: 'Parks map', sub: 'city UV' }, { name: 'Phone', sub: 'high-UV alerts' }],
    },
    protocol: ['Each display optionally publishes its live UV index, band and daily peak. Networking is a bonus — the display works fully stand-alone — so a park with no connectivity still protects the people in front of it.'],
    topics: [
      { t: 'uv/site/1/reading', dir: 'node → broker', payload: 'UVI, band, burn-time, daily peak, suspect flag' },
      { t: 'uv/site/1/status', dir: 'node → broker', payload: 'battery, calibration date, sensor health' },
      { t: 'uv/site/1/config', dir: 'broker → node', payload: 'calibration, display settings' },
    ],
    cloud: ['A broker feeds a city parks map of live UV and archives each site\'s daily profile, useful for public-health messaging and for studying how UV varies across a city\'s open spaces.'],
    dashboard: ['A parks map coloured by live UV index, with per-site daily curves showing when and how high UV peaks at each location.'],
    mobile: ['Optional alerts when a favourite park hits very-high/extreme UV, prompting sun protection or a change of plans.'],
    security: [
      'Sign readings so a public map cannot be spoofed with false "safe" UV values.',
      'Keep the stand-alone display fully functional without the network — connectivity must never gate the public-health message.',
      'Flag and surface any "sensor check" condition so a mis-sited display is corrected quickly.',
    ],
  },

  perf: [
    'Update every ~30 s — UV changes slowly enough that faster is unnecessary and costs display power.',
    'Dim or duty-cycle the bright display when no one is around (e.g. at night) to save solar budget.',
    'Do the trivial index/burn-time maths on-device; there is no heavy computation here.',
    'Cache the day\'s peak locally so the profile survives brief resets.',
  ],
  safety: [
    'Site for full open sky and keep the sensor clean — a low reading gives dangerously reassuring advice.',
    'Present burn-time as average guidance for a typical skin type; individuals, especially fair-skinned and children, vary and need more caution.',
    'Make clear the display is a public-health aid, not a substitute for personal sun-protection judgement.',
    'Use UV-stable materials for the housing and glazing so the installation itself does not degrade in the sun it measures.',
  ],
  maintenance: [
    'Clean the sensor window regularly; dust and grime cut UV and bias the reading low.',
    'Re-verify calibration against a reference periodically; UV sensors can drift.',
    'Check the display legibility and brightness, and the solar panel cleanliness.',
    'Confirm the siting is still clear as trees grow or structures change around the installation.',
  ],
  future: [
    'Add a skin-type selector (button) so a user can get advice tuned to their skin.',
    'Add spoken/multilingual advice and larger accessibility features for public spaces.',
    'Correlate logged UV with local ozone and cloud data to explain and forecast site UV.',
    'Integrate with park PA/signage to broadcast sun-safety reminders at high-UV times.',
  ],
  faq: [
    { q: 'Why not just use the weather app\'s UV index?', a: 'The app forecasts a whole city. Your exact spot can differ a lot — shade, altitude, or reflective sand/snow — and this monitor measures the real UV where people actually are, which is what protects them.' },
    { q: 'How does it work out a burn time?', a: 'A UV index unit is a fixed dose rate, and skin burns after a characteristic dose. So time-to-burn is roughly inversely proportional to the index. It is shown as an average for typical skin, not a personal guarantee.' },
    { q: 'What is the biggest thing to get right?', a: 'Siting. The sensor must see the whole open sky through a UV-passing window and be kept clean. A shaded or dirty sensor reads low and tells people the sun is safe when it is not — the one dangerous failure mode.' },
    { q: 'Does it need internet?', a: 'No. It works fully stand-alone, showing the index and advice from its own sensor. Networking only adds a city parks map and daily-profile logging as a bonus.' },
    { q: 'Is a cheap UV sensor accurate enough?', a: 'It is indicative, and better with a reference calibration. For public awareness — showing that UV is high and prompting protection at the right place and time — it does the job, and it flags itself if it looks shaded or faulty.' },
  ],
  refs: [
    { t: 'WHO — UV index and sun protection', u: 'https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index', s: 'WHO' },
    { t: 'Ultraviolet index — definition and categories', u: 'https://en.wikipedia.org/wiki/Ultraviolet_index', s: 'Reference' },
    { t: 'Erythema and minimal erythemal dose', u: 'https://en.wikipedia.org/wiki/Sunburn', s: 'Reference' },
    { t: 'LTR390 / VEML6075 UV sensors (datasheets)', u: 'https://optoelectronics.liteon.com/', s: 'Manufacturer' },
    { t: 'UV, altitude and surface reflectance', u: 'https://en.wikipedia.org/wiki/Ultraviolet', s: 'Reference' },
  ],
  images: ['city', 'oled', 'esp32'],
  imageCaptions: [
    'A public UV display in a park or beach shows the real local UV where a citywide forecast cannot.',
    'A bright, sun-readable display presents the UV index, colour band and safe-exposure advice at a glance.',
    'ESP32 module converting the UV sensor reading into the standard index and plain-language guidance.',
  ],
},

];
