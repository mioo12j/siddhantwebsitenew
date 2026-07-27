/* Agriculture batch D — 036 Smart Pest Trap Counter, 037 Cold Storage
   Monitor, 038 Aquaponics Controller. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   036 — Smart Pest Trap Counter
   ══════════════════════════════════════════════════════════════════ */
{
  id: '036',
  domainKey: 'iot',
  emoji: '🦟', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Turns a pheromone insect trap into a live counter, so a farmer sees a pest population rising day by day instead of discovering it after the damage is done.',

  overview: [
    'Integrated pest management lives or dies on one number: how many pests are actually flying <i>right now</i>. The classic tool is a pheromone trap — a lure that mimics the female insect\'s scent, pulling males into a funnel or onto a sticky card. Counted regularly, trap catches tell a farmer exactly when a pest population is climbing toward the threshold at which spraying pays off, and just as importantly when it is not, so a spray can be skipped. The problem is the counting: someone has to walk to each trap, empty it, and tally the catch by eye, often across a large farm, and by the time they notice a spike the eggs are already laid. This project automates the count so the trap reports itself.',
    'An optical gate across the throat of the funnel trap detects each insect as it falls through: an infrared beam that a passing body briefly interrupts. Each valid interruption increments a timestamped count, and simple signal shaping rejects the things that are not target insects — a leaf fluttering, a much larger bee, a raindrop. The counts accumulate into a daily catch, the daily catches into a trend, and the trend is exactly the signal IPM needs. An optional camera captures a periodic image of the catch so a human can verify the species and calibrate the counter, because no cheap gate can distinguish two similar moths on its own.',
    'Because traps sit out in fields far from power and Wi-Fi, the counter runs on a small solar panel and reports over LoRa, waking only to log and transmit. Layered on top is a degree-day model: many pests emerge on a schedule set by accumulated warmth, so combining the live catch with a temperature-driven emergence estimate tells the farmer not just "the count is rising" but "this is the generation we expected, and it is early". The outcome is fewer, better-timed sprays — cheaper for the farmer, and gentler on the beneficial insects that indiscriminate calendar spraying destroys.',
  ],
  does: [
    'Counts insects falling through a pheromone trap using an infrared optical gate',
    'Rejects non-target events (debris, oversized insects, rain) by pulse shaping',
    'Timestamps each catch and accumulates daily counts and a multi-day trend',
    'Optionally photographs the catch periodically for species verification',
    'Combines catch data with a degree-day pest-emergence model',
    'Runs on solar + battery in a remote field and reports over LoRa',
    'Raises an alert when the catch crosses an action threshold',
  ],
  features: [
    'Automatic optical counting — no walking the traps to tally by eye',
    'Pulse-width discrimination to separate target insects from debris',
    'Daily catch and trend, the exact input IPM decisions need',
    'Degree-day emergence model fused with the live count',
    'Optional camera verification of species',
    'Solar + LoRa for season-long unattended field deployment',
    'Action-threshold alerts so a spray is timed, not guessed',
  ],
  applications: [
    { t: 'Orchard pest management', d: 'Codling moth, fruit fly and similar orchard pests, where trap-catch thresholds directly drive spray timing and one well-timed spray replaces several calendar ones.' },
    { t: 'Field crops (e.g. armyworm, bollworm)', d: 'Monitoring migratory or seasonal pests across large acreage where manual trap checks cannot keep up with a fast-building population.' },
    { t: 'Cooperative / area-wide IPM', d: 'Many traps across many farms feeding a shared map of pest pressure, so a whole region coordinates its response.' },
    { t: 'Research and extension', d: 'Entomologists and advisory services building long-term phenology records to refine emergence models and spray thresholds.' },
  ],
  skills: [
    'Building an infrared break-beam gate (emitter + detector) with clean thresholding',
    'Debouncing and pulse-width discrimination in firmware',
    'Degree-day accumulation and simple phenology models',
    'LoRa + solar design for remote field nodes',
    'Optional: triggering an ESP32-CAM capture and handling the image off-device',
  ],
  prereq: [
    'The optical gate must sit where every caught insect passes through it — the narrow throat of a funnel trap — or the count undercounts.',
    'Shield the IR detector from direct sun; ambient infrared swamps a weak beam and causes false counts or blindness.',
    'A pheromone lure is species-specific; the counter measures whatever the lure attracts, so match the lure to the target pest.',
  ],

  parts: ['esp32', 'ir_sensor', 'dht22', 'esp32cam', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Funnel/bucket pheromone trap body', spec: 'Standard delta or bucket trap with a throat the gate can span', qty: 1, price: 250, note: 'Match trap style to the target pest' },
    { name: 'IR emitter + phototransistor pair', spec: 'Matched 940 nm pair or a slotted photo-interrupter across the throat', qty: 1, price: 90, note: 'Modulated beam preferred to reject ambient IR' },
    { name: 'Pheromone lure (species-specific)', spec: 'Sealed septum/rubber lure for the target pest; replace per label interval', qty: 3, price: 300, note: 'Consumable — several per season' },
    { name: 'Weatherproof enclosure', spec: 'IP65 for electronics; the trap body stays open to catch insects', qty: 1, price: 400 },
  ],
  cost: '₹2,800 – ₹4,200',
  libs: ['wifi', 'dhtlib', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'IR gate detector', devPin: 'OUT', pin: 'GPIO 34 (ADC/IRQ)', sig: 'Beam-break pulse' },
      { dev: 'IR gate emitter', devPin: 'drive', pin: 'GPIO 25', sig: 'Modulated beam drive' },
      { dev: 'DHT22', devPin: 'DATA', pin: 'GPIO 4', sig: 'Air temp/RH for degree-days' },
      { dev: 'ESP32-CAM (opt)', devPin: 'trigger', pin: 'GPIO 26', sig: 'Wake camera for verification shot' },
    ],
    right: [
      { dev: 'LoRa SX1276', devPin: 'SCK/MISO/MOSI', pin: 'GPIO 18/19/23', sig: 'SPI radio bus' },
      { dev: 'LoRa SX1276', devPin: 'NSS/RST/DIO0', pin: 'GPIO 5/14/2', sig: 'Chip-select, reset, IRQ' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Solar-charged 18650 supply' },
      { dev: 'Solar panel', devPin: '+/–', pin: 'TP4056 IN', sig: '6 V panel → charger' },
    ],
  },
  wiringNotes: [
    'Span the funnel throat with the IR emitter on one side and the detector on the other, aligned so the resting beam is strong and unbroken.',
    'Modulate the emitter (drive it at a few kHz) and detect only the modulated component, so daylight and other steady IR sources do not trip the gate.',
    'Keep the detector in shade under a small hood; a phototransistor staring at bright sky is saturated and blind to the beam break.',
    'The optional ESP32-CAM is a separate power domain — wake it only for a capture, since it draws far more than the counting node.',
    'Route the DHT22 in a shaded, ventilated spot so its temperature drives the degree-day model correctly.',
  ],

  block: { columns: [
    { label: 'Trap', edge: 'right', blocks: [
      { name: 'IR gate', sub: 'beam-break count', highlight: true },
      { name: 'Camera (opt)', sub: 'species check' },
      { name: 'Temp/RH', sub: 'DHT22' },
    ] },
    { label: 'Count + model', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'debounce + degree-days' },
      { name: 'Store', sub: 'daily catch + trend' },
    ] },
    { label: 'Link', edge: 'right', blocks: [
      { name: 'LoRa', sub: 'to field gateway' },
    ] },
    { label: 'Advisor', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'catch trend + map' },
      { name: 'Alert', sub: 'threshold reached' },
    ] },
  ] },
  flow: [
    { t: 'Beam broken (IRQ)', k: 'start' },
    { t: 'Pulse width in target range?', k: 'dec', yes: 'Count as one insect', no: 'Reject (debris/large)' },
    { t: 'Count as one insect', k: 'proc' },
    { t: 'Reject (debris/large)', k: 'io' },
    { t: 'On schedule: read temp, accumulate degree-days', k: 'proc' },
    { t: 'Daily catch or DD threshold crossed?', k: 'dec', yes: 'Alert: action threshold', no: 'Log only' },
    { t: 'Alert: action threshold', k: 'io' },
    { t: 'Log only', k: 'io' },
    { t: 'Transmit + sleep', k: 'end', back: 'Beam broken (IRQ)' },
  ],

  principle: [
    'The whole system rests on a pheromone trap\'s selectivity. The lure emits a synthetic copy of the target species\' sex pheromone, so overwhelmingly it is the target pest that flies in. That means a crude counter — one that just detects "a body passed through" — still produces a meaningful, species-specific number, because the biology has already filtered the catch. The electronics only have to count what the chemistry has selected.',
    'Counting is done with a break-beam gate at the trap\'s throat. An infrared beam crosses the funnel; when an insect falls through, it briefly blocks the beam and the detector output dips. The key to reliability is <b>modulation</b>: driving the emitter at a few kilohertz and looking only for that frequency at the detector, so steady daylight infrared — which is far brighter than the beam — is ignored. Without modulation a field gate is either blinded by sun or swamped with false counts; with it, the beam-break stands out cleanly against the ambient.',
    'Not every beam-break is a target insect. A leaf, a raindrop, or a large non-target bee also blocks the beam, so the firmware discriminates by <b>pulse width</b>: a target moth interrupts the beam for a characteristic short duration as it falls, while a slow-crawling large insect, a resting leaf, or a persistent obstruction produces a much longer or permanent block. Counting only interruptions within a plausible duration window rejects most of the non-target events. This is imperfect — two similar-sized species cannot be separated optically — which is exactly why the periodic camera image exists: a human occasionally verifies that the count corresponds to the intended pest and adjusts the window if needed.',
    'The count becomes actionable when paired with a <b>degree-day</b> model. Insect development is driven by accumulated warmth, not calendar days: a pest emerges after its life stage has banked a species-specific number of degree-days above a threshold temperature. By accumulating degree-days from the on-board temperature sensor, the node predicts when a new generation should appear, and the live trap catch confirms or refines that prediction. "The count is climbing and we are at the degree-day total where the second generation emerges" is a far stronger spray signal than either piece alone.',
  ],
  equations: [
    { t: 'Modulated beam-break detection', eq: 'Emitter driven at f_mod (e.g. 4 kHz). Detector signal is\nband-passed / synchronously sampled at f_mod.\n\n  beam_present  when demodulated amplitude > A_hi\n  beam_broken   when it falls below A_lo   (hysteresis)\n\nAmbient sunlight is broadband/DC → rejected by looking only\nat the f_mod component. This is why a modulated gate works\nin full sun where a DC gate fails.' },
    { t: 'Pulse-width discrimination', eq: 'Measure how long the beam stays broken per event:\n\n  count it if   t_min < t_break < t_max\n  (e.g. 2 ms < t_break < 40 ms for a falling moth)\n\n  t_break < t_min  → electrical glitch → ignore\n  t_break > t_max  → leaf/large insect/obstruction → ignore\n                     and, if persistent, raise \"gate blocked\".' },
    { t: 'Degree-day accumulation (single sine / simple average)', eq: 'Daily degree-days above a base temperature T_base:\n\n  DD_day = max(0, (T_max + T_min)/2 − T_base)\n  DD_total = Σ DD_day from a biofix (first catch / date)\n\nEmergence of the next generation is expected near a\nspecies-specific DD_target. Combine with the live catch:\n  spray signal strongest when catch rising AND\n  DD_total near DD_target.' },
  ],

  assembly: [
    { h: 'Fit the trap and gate', p: [
      'Hang the pheromone trap where the target pest flies (canopy height for orchard moths, per the lure\'s guidance). Load the species-specific lure.',
      'Mount the IR emitter and detector on opposite sides of the funnel throat so every insect dropping into the collection cup crosses the beam. Align until the resting beam gives a strong, steady detector reading.',
      'Hood the detector against direct sun and rain.',
    ], warn: 'Handle pheromone lures with clean gloves and store spares sealed — skin oils and cross-contamination between lures ruin their selectivity.' },
    { h: 'Wire the electronics box', p: [
      'Put the ESP32, LoRa and battery in the IP65 box beside the trap. Bring the gate and DHT22 leads in through glands.',
      'If using the camera, mount the ESP32-CAM looking at the collection cup and give it its own switched power so it only draws current during a capture.',
    ] },
    { h: 'Set up power and radio', p: [
      'Angle the solar panel to the sun, clear of the trap so servicing the trap does not disturb it. Route the LoRa antenna vertically, clear of metal.',
    ] },
  ],
  steps: [
    { h: 'Tune the beam and thresholds', p: [
      'With no insect present, record the steady demodulated beam amplitude. Set the break/restore thresholds with hysteresis below it. Confirm a hand-wave across the beam registers as one clean event.',
    ], tip: 'Do this in full sun and in shade — if the modulation is working, the resting amplitude barely changes between them.' },
    { h: 'Set the pulse-width window', p: [
      'Drop a few sample insects (or a proxy) through the throat and record their beam-break durations. Set t_min/t_max to bracket them, excluding slow debris.',
    ] },
    { h: 'Count in an interrupt with discrimination', p: [
      'Handle the beam-break in an interrupt, measure the break duration, and only increment the daily count when the duration falls inside the target window; flag a persistent block as a fault.',
    ], code: {
      file: 'gate-count.ino', lang: 'cpp',
      body: `volatile uint32_t breakStart = 0;
volatile uint32_t dailyCount = 0;
volatile bool     gateBlocked = false;

#define T_MIN_US   2000UL      // 2 ms  — reject glitches
#define T_MAX_US  40000UL      // 40 ms — reject leaves/large insects
#define BLOCK_US 2000000UL     // 2 s persistent block = fault

// Detector output goes LOW while the (demodulated) beam is broken.
void IRAM_ATTR onEdge() {
  uint32_t now = micros();
  if (digitalRead(PIN_GATE) == LOW) {        // beam just broke
    breakStart = now;
  } else {                                    // beam restored
    uint32_t dt = now - breakStart;
    if (dt > T_MIN_US && dt < T_MAX_US) dailyCount++;   // one insect
    // dt <= T_MIN: glitch; dt >= T_MAX: debris/large — both ignored
  }
}

// Called periodically to detect a stuck/blocked gate.
void checkBlocked() {
  if (digitalRead(PIN_GATE) == LOW &&
      micros() - breakStart > BLOCK_US) {
    gateBlocked = true;                       // leaf lodged / lens fouled
  }
}`,
      explain: [
        { ref: 'if (digitalRead(PIN_GATE) == LOW)', txt: 'The interrupt fires on both edges: a falling edge marks the beam breaking and starts the timer, a rising edge marks it restoring and ends it.' },
        { ref: 'if (dt > T_MIN_US && dt < T_MAX_US)', txt: 'Only interruptions whose duration matches a falling target insect are counted; electrical glitches (too short) and debris or large insects (too long) are discarded.' },
        { ref: 'void checkBlocked()', txt: 'A beam broken continuously for seconds is not an insect but a lodged leaf or a fouled lens, so it is flagged as a fault rather than silently miscounting.' },
      ],
    } },
    { h: 'Accumulate degree-days, report and sleep', p: [
      'On a schedule, read temperature, update the degree-day total, roll the daily count over at midnight, check thresholds, transmit the catch and DD state over LoRa, then sleep. Wake immediately on a beam-break interrupt to count.',
    ] },
  ],

  code: [{
    file: 'pest-trap-counter.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Pest Trap Counter — ESP32, modulated IR gate, DD model, LoRa

   Counts insects falling through a pheromone trap via a modulated
   infrared gate with pulse-width discrimination, accumulates
   degree-days for emergence prediction, and reports over LoRa on solar.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <DHT.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <time.h>

#define PIN_GATE    34     // demodulated detector (LOW = beam broken)
#define PIN_EMIT    25     // modulated emitter drive
#define PIN_DHT      4
#define LORA_CS      5
#define LORA_RST    14
#define LORA_DIO0    2

#define T_MIN_US    2000UL
#define T_MAX_US   40000UL
#define T_BASE      10.0f      // degree-day base temperature (species)
#define DD_TARGET  350.0f      // DD to next-generation emergence
#define CATCH_ACTION  8        // daily catch action threshold

DHT dht(PIN_DHT, DHT22);
Preferences prefs;

RTC_DATA_ATTR uint32_t dailyCount = 0;
RTC_DATA_ATTR float    ddTotal    = 0;
RTC_DATA_ATTR float    tMax = -99, tMin = 99;
RTC_DATA_ATTR int      lastDay = -1;

volatile uint32_t breakStart = 0;

void IRAM_ATTR onEdge() {
  uint32_t now = micros();
  if (digitalRead(PIN_GATE) == LOW) breakStart = now;
  else {
    uint32_t dt = now - breakStart;
    if (dt > T_MIN_US && dt < T_MAX_US) dailyCount++;
  }
}

// Square-wave the emitter so the detector can reject ambient IR.
// (A hardware timer/LEDC does this continuously; shown here conceptually.)
void startBeam() {
  ledcSetup(0, 4000, 8);      // 4 kHz carrier
  ledcAttachPin(PIN_EMIT, 0);
  ledcWrite(0, 128);          // 50% duty
}

void transmit(float t, float rh, bool block) {
  bool action = (dailyCount >= CATCH_ACTION) || (ddTotal >= DD_TARGET);
  LoRa.beginPacket();
  LoRa.printf("{\\"trap\\":1,\\"catch\\":%u,\\"dd\\":%.0f,\\"t\\":%.1f,"
              "\\"rh\\":%.0f,\\"blocked\\":%d,\\"action\\":%d}",
              dailyCount, ddTotal, t, rh, block ? 1 : 0, action ? 1 : 0);
  LoRa.endPacket();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_GATE, INPUT_PULLUP);
  startBeam();
  attachInterrupt(PIN_GATE, onEdge, CHANGE);
  dht.begin();

  // ── periodic housekeeping wake ──
  float t  = dht.readTemperature();
  float rh = dht.readHumidity();
  if (!isnan(t)) { if (t > tMax) tMax = t; if (t < tMin) tMin = t; }

  struct tm tm; getLocalTime(&tm);
  if (tm.tm_yday != lastDay && lastDay >= 0) {
    float dd = fmaxf(0, (tMax + tMin) / 2.0f - T_BASE);
    ddTotal += dd;                            // bank yesterday's degree-days
    prefs.begin("trap", false);
    prefs.putULong("hist", prefs.getULong("hist", 0) + dailyCount);
    prefs.putFloat("dd", ddTotal);
    prefs.end();
    dailyCount = 0; tMax = -99; tMin = 99;    // reset for the new day
  }
  lastDay = tm.tm_yday;

  bool blocked = (digitalRead(PIN_GATE) == LOW &&
                  micros() - breakStart > 2000000UL);

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);
  transmit(t, rh, blocked);

  // Light sleep keeps the gate interrupt live to count while idle.
  esp_sleep_enable_timer_wakeup(900ULL * 1000000ULL);   // 15 min housekeeping
  esp_sleep_enable_ext0_wakeup((gpio_num_t)PIN_GATE, 0); // wake on beam-break
  esp_light_sleep_start();
  // execution resumes here after either wake; loop() re-runs the cycle
}

void loop() {
  // On wake, do a quick housekeeping pass then sleep again.
  float t  = dht.readTemperature();
  float rh = dht.readHumidity();
  if (!isnan(t)) { if (t > tMax) tMax = t; if (t < tMin) tMin = t; }
  bool blocked = (digitalRead(PIN_GATE) == LOW &&
                  micros() - breakStart > 2000000UL);
  transmit(t, rh, blocked);
  esp_sleep_enable_timer_wakeup(900ULL * 1000000ULL);
  esp_sleep_enable_ext0_wakeup((gpio_num_t)PIN_GATE, 0);
  esp_light_sleep_start();
}`,
    explain: [
      { ref: 'RTC_DATA_ATTR uint32_t dailyCount', txt: 'The count, degree-day total and daily temperature extremes live in RTC memory so light sleep between events never loses the day\'s tally.' },
      { ref: 'void startBeam()', txt: 'Drives the emitter with a 4 kHz carrier through the ESP32\'s LEDC hardware so the detector can lock onto that frequency and ignore steady daylight infrared.' },
      { ref: 'if (tm.tm_yday != lastDay', txt: 'At the day rollover the previous day\'s degree-days are banked, the running catch history is added to flash, and the daily counters reset — turning a stream of events into daily catch and cumulative DD.' },
      { ref: 'esp_sleep_enable_ext0_wakeup', txt: 'The node light-sleeps but keeps the gate pin as a wake source, so it draws almost nothing while idle yet wakes the instant an insect breaks the beam.' },
      { ref: 'bool action =', txt: 'The transmitted packet carries a single action flag that is true when either the daily catch or the degree-day total has crossed its threshold — the farmer\'s cue to act.' },
    ],
  }],

  config: [
    'Set T_BASE, DD_TARGET and CATCH_ACTION to the target pest\'s biology and the local IPM guidance.',
    'Tune the beam thresholds and the pulse-width window (T_MIN/T_MAX) to your gate geometry and target insect size.',
    'Match the emitter modulation frequency between the drive and the detector demodulation.',
    'Choose the region-legal LoRa frequency and the housekeeping interval.',
  ],
  calibration: [
    { h: 'Beam baseline', p: [
      'Record the resting demodulated amplitude in full sun and shade; set break/restore thresholds with hysteresis. If the two ambients differ much, the modulation/demodulation needs work.',
    ] },
    { h: 'Pulse-width window', p: [
      'Measure the beam-break duration of real target insects (or a matched proxy) and set T_MIN/T_MAX to bracket them while excluding slow debris.',
    ] },
    { h: 'Count truth-check', p: [
      'Periodically compare the automatic count against a manual tally (and the verification photo) over a few days; adjust the window until they agree.',
    ] },
  ],
  testing: [
    { step: 'Wave a hand through the beam', expect: 'Exactly one count registered, in sun and in shade' },
    { step: 'Hold an obstruction in the beam for seconds', expect: 'No count; "gate blocked" fault raised' },
    { step: 'Flick a fast tiny object through', expect: 'Sub-threshold glitch ignored (no count)' },
    { step: 'Advance the clock past midnight', expect: 'Daily count rolls over; degree-days banked; history preserved' },
    { step: 'Drive temperature to accumulate DD past target', expect: 'Action flag set even before the catch threshold' },
    { step: 'Run a solar day/night cycle', expect: 'Battery recovers; RTC counters persist across sleeps' },
  ],
  output: [
    'The dashboard shows a daily catch bar chart with the action threshold marked, the cumulative degree-day curve against the emergence target, and any "gate blocked" faults.',
    { file: 'trap-packet.json', lang: 'json', body: `{
  "trap": 1,
  "catch": 11,
  "dd": 372,
  "t": 24.6,
  "rh": 55,
  "blocked": 0,
  "action": 1
}` },
    'Here the daily catch of 11 exceeds the action threshold and the degree-day total (372) has passed the emergence target (350) — a strong, well-timed signal to scout and consider treatment.',
  ],
  troubleshoot: [
    { sym: 'Counts spike at midday', cause: 'Ambient IR swamping a poorly-modulated beam', fix: 'Ensure the emitter is modulated and the detector demodulates; hood the detector from direct sun' },
    { sym: 'Undercounting versus manual tally', cause: 'Gate not at the throat, or window too narrow', fix: 'Move the gate so all catch passes through it; widen T_MAX toward the real break durations' },
    { sym: 'Overcounting', cause: 'Vibration/wind jitter double-triggering, or window too wide', fix: 'Add hysteresis and a short refractory time after each count; tighten T_MIN' },
    { sym: 'Persistent "gate blocked"', cause: 'Leaf or dead insect lodged across the beam, or fouled lens', fix: 'Clear the throat and clean the emitter/detector faces; the fault flag is doing its job' },
    { sym: 'Degree-days look wrong', cause: 'DHT22 in sun or missing days', fix: 'Shade and ventilate the sensor; ensure the daily rollover ran every day' },
  ],

  iot: {
    protoShort: 'LoRa → field gateway → MQTT',
    net: {
      nodes: [{ name: 'Trap node', sub: 'ESP32 + gate' }, { name: 'Other traps', sub: 'across the farm' }],
      protocol: 'LoRa 433/868', gateway: 'Field gateway', gatewaySub: 'LoRa → MQTT',
      uplink: 'MQTT 1883', cloud: 'Broker + IPM dashboard', cloudSub: 'catch history + map',
      clients: [{ name: 'Dashboard', sub: 'trend + map' }, { name: 'Phone', sub: 'threshold alerts' }],
    },
    protocol: ['A compact JSON packet — daily catch, degree-day total, temperature and the action flag — goes over LoRa on the housekeeping schedule, with an extra transmit when the action threshold is first crossed so the advice is timely.'],
    topics: [
      { t: 'ipm/trap/1/catch', dir: 'node → broker', payload: 'daily catch, DD, temp, action flag' },
      { t: 'ipm/trap/1/fault', dir: 'node → broker', payload: 'gate blocked, low battery' },
      { t: 'ipm/trap/1/image', dir: 'node → broker', payload: 'verification photo reference (optional)' },
    ],
    cloud: ['The gateway forwards to an MQTT broker feeding an IPM dashboard that keeps each trap\'s catch history and overlays them on a farm map, so pest pressure is seen spatially and over time — the basis for area-wide decisions.'],
    dashboard: ['Per-trap daily-catch bars with the action threshold drawn in, the cumulative degree-day curve toward the emergence target, and a farm map coloured by current pressure.'],
    mobile: ['A push alert fires when a trap first crosses its action threshold or reports a blocked gate, naming the trap and its location.'],
    security: [
      'A per-node key and rolling counter stop a stray node from injecting false catches that could trigger an unnecessary spray.',
      'Authenticate the broker so only the farm\'s dashboard reads the pest data.',
      'Alert on a trap going silent so a dead node is not read as zero pressure.',
    ],
  },

  perf: [
    'Light-sleep with the gate as a wake source: near-zero current while idle, instant counting on a beam-break.',
    'Keep the emitter modulation efficient (LEDC hardware) rather than bit-banging it awake.',
    'Only wake the camera for the occasional verification shot; it dwarfs the counter\'s power draw.',
    'Transmit on the housekeeping schedule plus threshold events, not per insect.',
  ],
  safety: [
    'Handle and store pheromone lures carefully; they are potent attractants and cross-contamination ruins selectivity.',
    'The counter informs spray decisions — it does not replace scouting, resistance management or label compliance.',
    'Keep the lithium battery and charger sealed against field moisture and dust.',
    'Site traps and any lure-handling away from where children or livestock could reach them.',
  ],
  maintenance: [
    'Replace the pheromone lure on its label interval; a spent lure quietly stops catching.',
    'Empty the collection cup and clean the gate faces so debris does not fake or block counts.',
    'Re-truth the count against a manual tally periodically and adjust the window.',
    'Clean the solar panel and check the antenna after storms.',
  ],
  future: [
    'Run a small on-device image classifier to verify species automatically from the periodic photo.',
    'Add a second lure/gate channel to monitor two pests from one node.',
    'Fuse many traps into a live degree-day + catch model that forecasts the next generation\'s peak.',
    'Add wind and a weather feed to flag migratory influx events that a lure-based count would otherwise misattribute.',
  ],
  faq: [
    { q: 'How does it know it counted the right insect?', a: 'The pheromone lure is species-specific, so almost everything drawn in is the target pest. Pulse-width discrimination rejects debris, and the periodic photo lets a human verify the species and fine-tune the counter.' },
    { q: 'Won\'t sunlight break the optical gate?', a: 'Only if the beam is unmodulated. Driving the emitter at a few kHz and detecting only that frequency makes the gate ignore steady daylight, which is why it works in full sun.' },
    { q: 'Why bother with degree-days if I have the live count?', a: 'Together they are far stronger than either alone. Degree-days predict when a generation should emerge; the live catch confirms it. A rising catch at the expected degree-day total is a confident, well-timed spray signal.' },
    { q: 'How long does it run in the field?', a: 'A season. It light-sleeps between events, wakes only to count or do housekeeping, and rarely transmits, so a small solar panel keeps it charged.' },
    { q: 'Can I monitor many traps at once?', a: 'Yes — each trap is a LoRa node reporting to one field gateway, and the dashboard maps them so you see pest pressure across the whole farm.' },
  ],
  refs: [
    { t: 'Integrated pest management and trap thresholds — overview', u: 'https://en.wikipedia.org/wiki/Integrated_pest_management', s: 'Reference' },
    { t: 'Insect pheromone traps — principles', u: 'https://en.wikipedia.org/wiki/Insect_trap', s: 'Reference' },
    { t: 'Degree-day models for pest phenology (UC IPM)', u: 'https://ipm.ucanr.edu/WEATHER/ddconcepts.html', s: 'UC IPM' },
    { t: 'Photointerrupter / break-beam sensing basics', u: 'https://en.wikipedia.org/wiki/Photoelectric_sensor', s: 'Reference' },
    { t: 'FAO — fall armyworm monitoring guidance', u: 'https://www.fao.org/', s: 'FAO' },
  ],
  images: ['farm', 'camera', 'solar'],
  imageCaptions: [
    'Pheromone traps in the field — the counter turns each one into a live, self-reporting instrument.',
    'An optional camera photographs the catch so a human can verify the species behind the automatic count.',
    'A small solar panel and battery keep the trap node counting and reporting through a whole season.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   037 — Cold Storage Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '037',
  domainKey: 'iot',
  emoji: '❄️', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Keeps produce and perishables inside their safe temperature band and keeps a tamper-evident compliance log that proves it — with alarms the moment anything drifts.',

  overview: [
    'Cold storage is a promise: that everything inside stayed within a safe temperature band from the moment it went in until the moment it came out. Break that promise for even a few hours — a door left ajar, a compressor that quietly failed overnight, a sensor no one was watching — and a room full of produce, dairy, vaccines or frozen goods can be spoiled or, worse, made unsafe while still looking fine. And in regulated cold chains, being able to <b>prove</b> the temperature never strayed is as important as the temperature itself: without a trustworthy log, a buyer or an inspector must assume the worst. This monitor does both jobs — it watches the room and keeps the record.',
    'Several temperature probes are placed where the room is actually at risk — near the door, in the warmest corner, at the return air, and among the product — because a single sensor by the evaporator reads the coldest, most flattering spot and misses the excursions that matter. A humidity sensor tracks the condition that governs how fast produce dehydrates or how readily frost forms. A door sensor logs every opening, since the door is the single biggest source of warm, moist air and most excursions begin with it. The controller timestamps everything against a real-time clock, writes it to local storage that cannot be quietly edited, and mirrors it to the cloud so the record survives even if the device is later tampered with.',
    'On top of the raw log sit the two numbers a cold chain lives by: <b>excursions</b> (any time-above-limit event, with its duration and peak) and <b>mean kinetic temperature</b>, a way of summarising a fluctuating temperature history into the single effective temperature the product experienced — the metric regulators use precisely because a brief warm spike is not the same as a steady warm room. Alarms fire the instant the band is breached or the door stays open too long, escalating if no one responds, so a failure at 2 a.m. wakes someone instead of thawing the stock. The result is a cold room that protects its contents and defends its own paperwork.',
  ],
  does: [
    'Monitors temperature at several points in the room, not just the coldest spot',
    'Tracks humidity and logs every door opening with its duration',
    'Timestamps all readings against a real-time clock and writes a tamper-evident local log',
    'Mirrors the log to the cloud so the record survives device tampering',
    'Detects excursions (time-above-limit) with duration and peak, and computes mean kinetic temperature',
    'Alarms immediately on band breach or door-open-too-long, with escalation',
    'Rides through power and network outages on battery and local storage',
  ],
  features: [
    'Multi-zone sensing that catches the warm corners a single probe misses',
    'Door-event logging — the root cause of most excursions',
    'Tamper-evident, timestamped compliance log (local + cloud mirror)',
    'Mean kinetic temperature and excursion reporting for regulated cold chains',
    'Escalating alarms so a 2 a.m. failure actually reaches someone',
    'Battery + local logging ride-through for power and network outages',
    'Exportable audit trail for buyers and inspectors',
  ],
  applications: [
    { t: 'Produce and food cold rooms', d: 'Keeping fruit, vegetables, dairy and meat within grade-safe temperatures and proving it to buyers who reject undocumented stock.' },
    { t: 'Pharmaceutical / vaccine storage', d: 'Cold-chain compliance where an undocumented excursion can legally condemn an entire batch; MKT and excursion logs are mandatory.' },
    { t: 'Restaurant and retail refrigeration', d: 'Automating the manual temperature-check logs that food-safety rules require, with alarms before stock is lost.' },
    { t: 'Agri warehouses and FPO cold stores', d: 'Protecting aggregated produce and settling disputes with an objective record of storage conditions.' },
  ],
  skills: [
    'Placing multiple temperature probes to represent a room, not a point',
    'Using a real-time clock and writing timestamped, append-only logs to SD/flash',
    'Reed-switch door sensing and event logging',
    'Computing excursions and mean kinetic temperature',
    'Designing escalating alarms and outage ride-through',
  ],
  prereq: [
    'Probe placement decides everything: put probes where the room is warmest and most variable (near the door, top corners, in-product), not next to the evaporator.',
    'The compliance log is only trustworthy if it is append-only and mirrored off-device; a log the operator can silently edit proves nothing.',
    'The monitor observes and alarms — it does not by itself keep the room cold. Treat it as an independent watchdog over the refrigeration, not the refrigeration control.',
  ],

  parts: ['esp32', 'ds18b20', 'sht31', 'reed', 'rtc', 'sdcard', 'buzzer', 'tp4056', 'li18650'],
  qty: { ds18b20: 4 },
  extraParts: [
    { name: 'Waterproof DS18B20 probes on cable', spec: 'Stainless probes for door/corner/return/in-product placement', qty: 4, price: 480, note: 'One 1-Wire bus, addresses mapped to locations' },
    { name: 'Door reed switch', spec: 'Magnetic contact on the cold-room door', qty: 1, price: 120 },
    { name: 'Backup battery + charger', spec: '18650 + TP4056 to ride through power cuts and keep logging', qty: 1, price: 260 },
    { name: 'IP-rated enclosure (external mount)', spec: 'Electronics outside the cold, only probes inside, to avoid condensation on the board', qty: 1, price: 400 },
  ],
  cost: '₹3,200 – ₹4,400',
  libs: ['wifi', 'pubsub', 'onewire', 'unified', 'arduinojson', 'preferences', 'ntp', 'sqlite'],

  pins: {
    left: [
      { dev: 'DS18B20 ×4', devPin: 'DQ', pin: 'GPIO 4', sig: '1-Wire zone temps (4.7 kΩ pull-up)' },
      { dev: 'SHT31', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Humidity + temp (I²C)' },
      { dev: 'Reed switch', devPin: 'NO', pin: 'GPIO 27', sig: 'Door open/closed' },
      { dev: 'DS3231 RTC', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Timestamp source (I²C)' },
    ],
    right: [
      { dev: 'microSD', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Local append-only log' },
      { dev: 'Buzzer/relay', devPin: 'IN', pin: 'GPIO 13', sig: 'Local alarm output' },
      { dev: 'TP4056', devPin: 'OUT', pin: 'VIN / 3V3 reg', sig: 'Backup-battery supply' },
      { dev: 'Mains 5V', devPin: '+/–', pin: 'TP4056 IN', sig: 'Primary supply + charge' },
    ],
  },
  wiringNotes: [
    'Mount the electronics box <b>outside</b> the cold room. Only the probes and the reed switch go into the cold; a circuit board in a cold, humid room grows condensation and corrodes.',
    'Run the four DS18B20 probes on one 1-Wire bus with a single 4.7 kΩ pull-up, and map each address to its physical location (door, corner, return, in-product).',
    'Wire the reed switch so a door opening is unambiguous; debounce it in firmware to log clean open/close events.',
    'Give the RTC a coin-cell backup so timestamps survive power loss — a compliance log with wrong times is worthless.',
    'Power from mains with the 18650 as automatic backup, so a power cut does not create a gap in the record.',
  ],

  block: { columns: [
    { label: 'The room', edge: 'right', blocks: [
      { name: 'Zone temps', sub: 'DS18B20 ×4', highlight: true },
      { name: 'Humidity', sub: 'SHT31' },
      { name: 'Door', sub: 'reed switch' },
    ] },
    { label: 'Record', edge: 'right', blocks: [
      { name: 'ESP32 + RTC', sub: 'timestamp' },
      { name: 'SD log', sub: 'append-only' },
      { name: 'MKT/excursion', sub: 'computed' },
    ] },
    { label: 'Protect', edge: 'right', blocks: [
      { name: 'Alarm', sub: 'buzzer + escalate' },
      { name: 'Cloud mirror', sub: 'off-device copy' },
    ] },
    { label: 'Auditor', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'live + history' },
      { name: 'Export', sub: 'audit trail' },
    ] },
  ] },
  flow: [
    { t: 'Sample zones + humidity + door', k: 'start' },
    { t: 'Timestamp and append to log', k: 'proc' },
    { t: 'Any zone above limit?', k: 'dec', yes: 'Start/continue excursion; alarm', no: 'Clear excursion state' },
    { t: 'Start/continue excursion; alarm', k: 'io' },
    { t: 'Door open too long?', k: 'dec', yes: 'Door alarm', no: 'Update MKT' },
    { t: 'Door alarm', k: 'io' },
    { t: 'Update MKT', k: 'proc' },
    { t: 'Mirror to cloud; wait interval', k: 'end', back: 'Sample zones + humidity + door' },
  ],

  principle: [
    'A cold room is not one temperature — it is a field of temperatures, coldest at the evaporator and warmest near the door and the ceiling corners, and it changes every time the door opens or the compressor cycles. A single probe by the cooling coil reads the best-case number and will happily show "all fine" while product near the door sits above its safe limit. Representing the room honestly means several probes placed deliberately at the <b>worst</b> spots — the door, the far top corner, the return air, and within the product mass where thermal inertia matters — so the log reflects what the goods actually experienced, not the flattering minimum.',
    'The door is the villain in most cold-chain stories. Every opening dumps warm, humid air into the room; frequent or prolonged openings are the commonest cause of excursions and of frost and dehydration problems. Logging door events — when, and for how long — both explains excursions after the fact and lets the monitor alarm proactively when a door has been left open past a sensible threshold, catching the classic "someone propped it open and forgot" failure before it spoils anything.',
    'Two derived numbers turn a raw temperature stream into compliance evidence. An <b>excursion</b> is any continuous period above the safe limit, characterised by its start, duration and peak — because regulators and buyers care about how far and how long, not merely that it happened once. <b>Mean kinetic temperature</b> (MKT) collapses a fluctuating history into the single effective temperature the product experienced, weighting warm periods more heavily than a plain average because degradation accelerates with temperature (an Arrhenius relationship). MKT is the standard cold-chain summary precisely because it answers the real question — "given all the ups and downs, what effective temperature did this batch see?" — better than a min/max or an average can.',
    'The record is only worth keeping if it is <b>trustworthy</b>. That means append-only local storage (you can add readings, not silently rewrite history), timestamps from a backed-up real-time clock, and an off-device mirror to the cloud so that even if the local device is lost or tampered with, the evidence survives. And because power and network both fail exactly when you most need the record — during the incident — the monitor runs on a backup battery and keeps logging locally through outages, syncing the backlog when connectivity returns. A compliance monitor that goes blind during a power cut is blind during the very events it exists to document.',
  ],
  equations: [
    { t: 'Mean kinetic temperature (Arrhenius-weighted)', eq: 'MKT summarises a varying temperature history:\n\n  MKT = (ΔH/R) / −ln[ (Σ e^(−ΔH/(R·T_i))) / n ]\n\n  T_i are absolute temperatures (K) of each interval,\n  ΔH ≈ 83 kJ/mol (typical activation energy),\n  R = 8.314 J/mol·K, n = number of intervals.\n\nWarm periods dominate the average far more than in a plain\nmean — which is the point: degradation is exponential in T.' },
    { t: 'Excursion detection', eq: 'For the representative zone temperature T_rep\n(usually the warmest logged zone):\n\n  in_excursion  while T_rep > T_limit\n  duration = t_end − t_start,  peak = max T_rep in window\n\nAlarm when duration exceeds a grace period (e.g. product\ncan tolerate a short spike but not a sustained breach).\nLog every excursion\'s start, end, duration and peak.' },
    { t: 'Door-open alarm', eq: 'From the reed switch:\n\n  open_duration = now − door_opened_at\n  alarm if door open and open_duration > T_door (e.g. 120 s)\n\nAlso count openings per hour; an unusually high rate warns\nof a propped door or heavy traffic driving up the room temp.' },
  ],

  assembly: [
    { h: 'Place the probes where the room is at risk', p: [
      'Put one probe just inside the door (the warmest, most variable spot), one in the far top corner, one at the evaporator return air, and one inserted into or among the product to capture its thermal inertia.',
      'Run all four on a single 1-Wire cable and record which address is where — the log must say "door zone", not "sensor 2".',
    ], warn: 'Do not cluster all probes near the cooling coil. That reads the coldest air and hides the excursions the monitor exists to catch.' },
    { h: 'Fit the door sensor and mount electronics outside', p: [
      'Install the reed switch and magnet on the door and frame so an opening is cleanly detected. Route its cable out through a gland.',
      'Mount the ESP32/SD/RTC box outside the cold room to avoid condensation on the board; only sensor cables cross the wall.',
    ] },
    { h: 'Set up logging, clock and backup power', p: [
      'Insert the microSD and confirm the RTC holds the correct time with its coin cell in. Wire mains power with the 18650 as automatic backup so logging never stops.',
    ] },
  ],
  steps: [
    { h: 'Establish trusted time and the log format', p: [
      'Sync the RTC (from NTP when online) and define an append-only log record: timestamp, each zone temperature, humidity, door state, and any active excursion. Never rewrite past records.',
    ], tip: 'Include a running hash or sequence number per record so a missing or altered entry is detectable — the difference between a log and evidence.' },
    { h: 'Compute excursions and MKT continuously', p: [
      'Track the warmest representative zone against the limit to open/close excursions, and fold every interval into the MKT accumulator so the effective temperature is always current.',
    ], code: {
      file: 'compliance.ino', lang: 'cpp',
      body: `// Running mean kinetic temperature accumulator (Arrhenius-weighted).
struct MKT { double sumExp = 0; uint32_t n = 0; };
const double DH_R = 83000.0 / 8.314;    // ΔH/R in kelvin

void mktAdd(MKT &m, float tempC) {
  double Tk = tempC + 273.15;
  m.sumExp += exp(-DH_R / Tk);
  m.n++;
}
float mktValue(const MKT &m) {
  if (m.n == 0) return NAN;
  double denom = -log(m.sumExp / m.n);
  return (float)(DH_R / denom - 273.15);
}

// Excursion state machine on the warmest representative zone.
struct Excursion { bool active = false; uint32_t start = 0; float peak = -99; };

void excursionUpdate(Excursion &e, float tRep, float limit,
                     uint32_t now, uint32_t grace) {
  if (tRep > limit) {
    if (!e.active) { e.active = true; e.start = now; e.peak = tRep; }
    if (tRep > e.peak) e.peak = tRep;
    if (now - e.start > grace) raiseAlarm("Temperature excursion", tRep, e.peak);
  } else if (e.active) {
    logExcursion(e.start, now, e.peak);      // record start/end/duration/peak
    e.active = false; e.peak = -99;
  }
}`,
      explain: [
        { ref: 'const double DH_R', txt: 'Pre-computes the activation-energy-over-gas-constant term, the constant that makes MKT weight warm intervals exponentially more than cool ones.' },
        { ref: 'm.sumExp += exp(-DH_R / Tk)', txt: 'Each interval\'s absolute temperature is folded into a running sum of Arrhenius weights, so MKT can be read out at any time without storing the whole history.' },
        { ref: 'if (!e.active)', txt: 'An excursion opens the moment the representative zone crosses the limit, capturing its start time and tracking the peak as it develops.' },
        { ref: 'if (now - e.start > grace)', txt: 'A brief spike within the product\'s tolerance does not alarm; only a breach sustained past the grace period does — matching how cold-chain limits actually work.' },
        { ref: 'logExcursion(', txt: 'When the temperature recovers, the full excursion — start, end, duration, peak — is written to the compliance log as a discrete, auditable event.' },
      ],
    } },
    { h: 'Alarm, escalate, and mirror', p: [
      'Sound the local alarm on an excursion or door-open-too-long; escalate to phone/SMS if unacknowledged. Mirror each record to the cloud, and when offline, queue records on the SD and sync the backlog on reconnect.',
    ] },
  ],

  code: [{
    file: 'cold-storage-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Cold Storage Monitor — ESP32, multi-zone temp, door, RTC, SD, cloud

   Watches several zones of a cold room, logs a timestamped
   append-only compliance record locally and to the cloud, computes
   excursions and mean kinetic temperature, and alarms with escalation.
   Rides through power/network outages on battery + SD.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <RTClib.h>
#include <SD.h>
#include <SPI.h>
#include <math.h>

#define OW_PIN     4
#define PIN_DOOR  27
#define PIN_ALARM 13
#define SD_CS      5
#define NUM_ZONES  4
#define T_LIMIT    4.0f       // safe upper limit (chilled produce example)
#define GRACE_MS  300000UL    // 5 min sustained breach before alarm
#define DOOR_MS   120000UL    // door open > 2 min alarms
#define LOG_MS     60000UL    // log once a minute

OneWire           ow(OW_PIN);
DallasTemperature zones(&ow);
Adafruit_SHT31    sht;
RTC_DS3231        rtc;
WiFiClient        net;
PubSubClient      mqtt(net);

const char *zoneName[NUM_ZONES] = {"door","corner","return","product"};

struct MKT { double sumExp = 0; uint32_t n = 0; } mkt;
const double DH_R = 83000.0 / 8.314;

struct Excursion { bool active=false; uint32_t start=0; float peak=-99; } exc;
uint32_t doorOpenedAt = 0, lastLog = 0, seq = 0;
bool alarmActive = false, alarmAck = false;

void mktAdd(float t) { mkt.sumExp += exp(-DH_R / (t + 273.15)); mkt.n++; }
float mktValue() { return mkt.n ? (float)(DH_R / -log(mkt.sumExp/mkt.n) - 273.15) : NAN; }

// Append-only log line with a sequence number for tamper detection.
void logLine(DateTime t, float *z, float rh, bool doorOpen) {
  File f = SD.open("/coldlog.csv", FILE_APPEND);
  if (!f) return;
  f.printf("%lu,%04d-%02d-%02d %02d:%02d:%02d",
           (unsigned long)seq++, t.year(), t.month(), t.day(),
           t.hour(), t.minute(), t.second());
  for (int i = 0; i < NUM_ZONES; i++) f.printf(",%.2f", z[i]);
  f.printf(",%.1f,%d,%.2f,%d\\n", rh, doorOpen ? 1 : 0, mktValue(),
           exc.active ? 1 : 0);
  f.close();
}

void raiseAlarm(const char *why, float v, float peak) {
  digitalWrite(PIN_ALARM, HIGH);
  alarmActive = true;
  char msg[160];
  snprintf(msg, sizeof msg,
    "{\\"alarm\\":\\"%s\\",\\"val\\":%.2f,\\"peak\\":%.2f}", why, v, peak);
  mqtt.publish("cold/room1/alarm", msg);   // triggers escalation server-side
}

void publishLive(float *z, float rh, bool doorOpen) {
  char b[240];
  int n = snprintf(b, sizeof b,
    "{\\"mkt\\":%.2f,\\"rh\\":%.1f,\\"door\\":%d,\\"exc\\":%d",
    mktValue(), rh, doorOpen ? 1 : 0, exc.active ? 1 : 0);
  for (int i = 0; i < NUM_ZONES; i++)
    n += snprintf(b+n, sizeof b-n, ",\\"%s\\":%.2f", zoneName[i], z[i]);
  snprintf(b+n, sizeof b-n, "}");
  mqtt.publish("cold/room1/live", b);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_DOOR, INPUT_PULLUP);
  pinMode(PIN_ALARM, OUTPUT);
  zones.begin();
  Wire.begin(21, 22);
  sht.begin(0x44);
  rtc.begin();
  SD.begin(SD_CS);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect("cold-1");
  mqtt.loop();
  uint32_t now = millis();

  bool doorOpen = digitalRead(PIN_DOOR) == LOW;
  if (doorOpen && doorOpenedAt == 0) doorOpenedAt = now;
  if (!doorOpen) doorOpenedAt = 0;

  if (now - lastLog >= LOG_MS) {
    lastLog = now;
    zones.requestTemperatures();
    float z[NUM_ZONES], tRep = -99;
    for (int i = 0; i < NUM_ZONES; i++) {
      z[i] = zones.getTempCByIndex(i);
      if (z[i] > tRep) tRep = z[i];          // warmest zone represents risk
    }
    float rh = sht.readHumidity();
    DateTime t = rtc.now();

    mktAdd(tRep);
    logLine(t, z, rh, doorOpen);             // append-only, always (even offline)
    if (WiFi.status() == WL_CONNECTED) publishLive(z, rh, doorOpen);

    // excursion state machine
    if (tRep > T_LIMIT) {
      if (!exc.active) { exc.active = true; exc.start = now; exc.peak = tRep; }
      if (tRep > exc.peak) exc.peak = tRep;
      if (now - exc.start > GRACE_MS && !alarmActive)
        raiseAlarm("temp excursion", tRep, exc.peak);
    } else if (exc.active) {
      char m[120];
      snprintf(m, sizeof m,
        "{\\"exc_end\\":1,\\"peak\\":%.2f,\\"dur_s\\":%lu}",
        exc.peak, (unsigned long)((now - exc.start)/1000));
      mqtt.publish("cold/room1/excursion", m);
      exc.active = false; exc.peak = -99;
      if (!doorAlarmActive()) { digitalWrite(PIN_ALARM, LOW); alarmActive = false; }
    }
  }

  if (doorOpenedAt && now - doorOpenedAt > DOOR_MS)
    raiseAlarm("door open too long", (now - doorOpenedAt)/1000.0f, 0);

  delay(1000);
}

bool doorAlarmActive() {
  return doorOpenedAt && millis() - doorOpenedAt > DOOR_MS;
}`,
    explain: [
      { ref: 'void logLine(', txt: 'Every record is appended — never overwritten — with an incrementing sequence number, so a deleted or altered line breaks the sequence and is detectable on audit.' },
      { ref: 'if (z[i] > tRep) tRep = z[i]', txt: 'The warmest of the four zones represents the room\'s risk; compliance is judged against the hottest spot the product could be sitting in, not an average that hides it.' },
      { ref: 'logLine(t, z, rh, doorOpen);  // append-only, always', txt: 'Logging happens whether or not the network is up, so a power cut or outage — exactly when incidents happen — never leaves a gap in the local record.' },
      { ref: 'raiseAlarm("door open too long"', txt: 'The commonest real-world cause of an excursion, a propped or forgotten door, is alarmed proactively before the room even breaches its limit.' },
      { ref: 'mqtt.publish("cold/room1/alarm"', txt: 'Alarms are published to a topic the server watches for escalation, so an unacknowledged 2 a.m. failure can be pushed onward to SMS or a call.' },
    ],
  }],

  config: [
    'Set T_LIMIT (and, if needed, a low limit for frozen goods) to the product\'s safe band, and the excursion grace period to its tolerance.',
    'Map each DS18B20 address to its zone name so the log and alarms are human-readable.',
    'Set the door-open alarm time and the escalation policy (who is notified, and after how long unacknowledged).',
    'Configure the cloud endpoint and the offline-backlog sync so outage records are uploaded on reconnect.',
  ],
  calibration: [
    { h: 'Probe agreement', p: [
      'Before installing, bundle all probes in an ice-water bath (0 °C) and a known reference; record and correct any per-probe offset so zone comparisons are fair.',
    ] },
    { h: 'Clock accuracy', p: [
      'Sync the RTC to NTP and confirm it holds time on the coin cell through a power-off. Compliance timestamps must be right.',
    ] },
    { h: 'Excursion timing', p: [
      'Verify with a controlled warm-up that an excursion opens at the limit, the grace period behaves, and the logged duration/peak match reality.',
    ] },
  ],
  testing: [
    { step: 'Warm the door-zone probe above T_LIMIT briefly then recover', expect: 'Excursion opens and closes; logged with duration and peak; no alarm if within grace' },
    { step: 'Hold above limit past the grace period', expect: 'Alarm fires locally and publishes for escalation' },
    { step: 'Open the door and leave it open', expect: 'Door-open alarm after the threshold; opening logged' },
    { step: 'Pull mains power', expect: 'Battery keeps the device logging locally with correct timestamps' },
    { step: 'Drop the network during an excursion', expect: 'Local log continues; records sync to cloud on reconnect' },
    { step: 'Attempt to edit a past log line', expect: 'Sequence/hash break makes the tampering detectable on audit' },
  ],
  output: [
    'The dashboard shows each zone\'s live temperature, the room humidity, door state, the current MKT, and a timeline of excursions and door events; an export produces the audit trail.',
    { file: 'coldlog.csv', lang: 'plain', body: `seq,timestamp,door,corner,return,product,rh,door_open,mkt,exc
10432,2026-07-27 02:14:00,3.6,3.9,2.1,3.2,86,0,3.1,0
10433,2026-07-27 02:15:00,5.8,4.2,2.2,3.4,88,1,3.2,1
10434,2026-07-27 02:16:00,6.9,4.6,2.3,3.6,90,1,3.4,1
... excursion: start 02:15, peak 6.9C, cause: door open 3m` },
    'The record shows a door left open at 02:15 driving the door-zone above the 4 °C limit — the door event, the excursion and the rising MKT all captured and linked.',
  ],
  troubleshoot: [
    { sym: 'Log looks fine but product spoiled', cause: 'Probes clustered at the cold spot, missing the warm zones', fix: 'Relocate probes to the door, top corner and product; judge compliance on the warmest zone' },
    { sym: 'Timestamps wrong after a power cut', cause: 'RTC coin cell missing/dead', fix: 'Fit a fresh coin cell; re-sync from NTP; verify time survives power-off' },
    { sym: 'Frequent nuisance excursion alarms', cause: 'Grace period too short, or normal defrost cycles', fix: 'Lengthen the grace period; mask known defrost windows; ensure the limit matches the product' },
    { sym: 'Gaps in the record', cause: 'Device stopped logging during an outage', fix: 'Verify the backup battery carries the logger; confirm offline logging to SD is enabled' },
    { sym: 'Humidity reads saturated', cause: 'Condensation on the SHT31 in the cold, humid air', fix: 'Mount the sensor to shed condensation; allow warm-up; keep electronics outside the room' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT with escalation; local SD is the source of truth',
    net: {
      nodes: [{ name: 'Room monitor', sub: 'ESP32 + SD' }, { name: 'Other rooms', sub: 'more nodes' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'or cellular backup',
      uplink: 'MQTT/TLS 8883', cloud: 'Broker + compliance store', cloudSub: 'immutable mirror',
      clients: [{ name: 'Dashboard', sub: 'live + audit' }, { name: 'Phone/SMS', sub: 'escalation' }],
    },
    protocol: ['Live readings publish once a minute; alarms and excursion start/end publish immediately. The local append-only SD log is the authoritative record, and the cloud is a mirror plus escalation engine — so losing the network degrades visibility, not the evidence.'],
    topics: [
      { t: 'cold/room1/live', dir: 'node → broker', payload: 'per-zone temps, RH, door, MKT' },
      { t: 'cold/room1/alarm', dir: 'node → broker', payload: 'excursion / door alarm for escalation' },
      { t: 'cold/room1/excursion', dir: 'node → broker', payload: 'excursion end: duration + peak' },
    ],
    cloud: ['A broker feeds an immutable compliance store that mirrors every record and drives escalation — if an alarm is not acknowledged within a set time it is pushed onward to SMS or a phone call, so a failure reaches a human even at night.'],
    dashboard: ['Live per-zone tiles, an MKT readout, and a timeline of door events and excursions; an export button produces the timestamped audit trail buyers and inspectors require.'],
    mobile: ['Escalating push/SMS alerts for excursions and door-open-too-long, with acknowledgement so the system knows a human is handling it.'],
    security: [
      'Use TLS to the broker and an append-only, sequence-numbered log so records cannot be silently altered.',
      'Mirror off-device so tampering with the local unit does not erase the evidence.',
      'Authenticate acknowledgements so only authorised staff can silence an alarm.',
    ],
  },

  perf: [
    'A one-minute log cadence is ample for a slow thermal mass; publish alarms and excursion edges immediately.',
    'Keep the SD log append-only and rotate by day/month rather than rewriting, to stay fast and tamper-evident.',
    'Compute MKT incrementally (running sum) so the effective temperature is always available without reprocessing history.',
    'Ride outages on the battery and local SD; sync the backlog in batches on reconnect rather than blocking on the network.',
  ],
  safety: [
    'The monitor is an independent watchdog; it does not control the refrigeration and must not be relied on to keep the room cold.',
    'For regulated cold chains (e.g. pharma), validate probe placement, calibration and MKT settings against the applicable standard.',
    'Keep electronics and the lithium backup outside the cold, humid room to prevent condensation faults.',
    'Test the alarm and escalation path regularly — an alarm no one receives is no protection.',
  ],
  maintenance: [
    'Periodically re-verify probe calibration in an ice bath and against a reference.',
    'Replace the RTC coin cell on schedule so timestamps never drift.',
    'Check the door reed switch and magnet alignment; a mis-sensed door corrupts the event log.',
    'Confirm the cloud mirror and backlog sync are current, and export/archive the audit trail per your retention policy.',
  ],
  future: [
    'Add power-quality logging so a compressor failure is distinguished from a mains outage.',
    'Predict compressor decline from slowly rising pull-down times and warn before it fails.',
    'Add CO₂/ethylene sensing for controlled-atmosphere produce storage.',
    'Sign each record cryptographically for a stronger, court-defensible audit trail.',
  ],
  faq: [
    { q: 'Why several probes instead of one?', a: 'A cold room varies from the cold evaporator to the warm door and corners. One probe reads the best spot and hides excursions; several placed at the warm, variable spots represent what the product actually experienced.' },
    { q: 'What is mean kinetic temperature and why not just an average?', a: 'MKT weights warm periods exponentially, because spoilage accelerates with temperature. A brief spike affects product more than a plain average implies, and MKT captures that — which is why regulated cold chains use it.' },
    { q: 'What makes the log "tamper-evident"?', a: 'It is append-only with sequence numbers (optionally hashes) and mirrored to the cloud. You can add readings but not silently rewrite them, and deleting a line breaks the sequence.' },
    { q: 'Does it keep working during a power cut?', a: 'Yes. A backup battery keeps it logging locally with correct timestamps, and it syncs the backlog to the cloud when power and network return — outages are exactly when the record matters most.' },
    { q: 'Can it control the fridge to fix an excursion?', a: 'By design it is a watchdog, not the control system. It alarms and escalates so a person or the refrigeration\'s own controls act; keeping it independent is what lets it honestly judge the room.' },
  ],
  refs: [
    { t: 'Mean kinetic temperature — definition and use', u: 'https://en.wikipedia.org/wiki/Mean_kinetic_temperature', s: 'Reference' },
    { t: 'Cold chain and temperature monitoring — overview', u: 'https://en.wikipedia.org/wiki/Cold_chain', s: 'Reference' },
    { t: 'WHO — temperature monitoring of vaccine cold chain', u: 'https://www.who.int/', s: 'WHO' },
    { t: 'DS18B20 1-Wire digital thermometer (datasheet)', u: 'https://www.analog.com/en/products/ds18b20.html', s: 'Analog Devices' },
    { t: 'DS3231 extremely accurate RTC (datasheet)', u: 'https://www.analog.com/en/products/ds3231.html', s: 'Analog Devices' },
  ],
  images: ['warehouse', 'esp32', 'grafana'],
  imageCaptions: [
    'A cold store — the monitor represents the whole room with probes at its warmest, most variable points.',
    'ESP32 module timestamping and logging every zone, the humidity and every door event.',
    'A dashboard turns the compliance log into a live view and an exportable audit trail.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   038 — Aquaponics Controller
   ══════════════════════════════════════════════════════════════════ */
{
  id: '038',
  domainKey: 'iot',
  emoji: '🐟', thumb: 'board',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Keeps fish and plants alive together by holding dissolved oxygen, pH and temperature in the narrow band where both the fish and the bacteria that feed the plants can thrive.',

  overview: [
    'Aquaponics is a three-way partnership that only works if the water stays in balance. Fish produce ammonia-rich waste; a colony of nitrifying bacteria converts that ammonia first to nitrite and then to nitrate; the plants take up the nitrate as fertiliser and, in doing so, clean the water that returns to the fish. Every member of this loop is fragile in a different way, and they disagree about the ideal conditions: fish and bacteria want a near-neutral pH and plenty of dissolved oxygen, plants would often prefer more acidity, and the bacteria are slow to recover if you ever let them die. This controller\'s job is to hold the compromise — the band where all three survive — and to intervene fast when the most dangerous variable, dissolved oxygen, starts to fall.',
    'Of everything the controller watches, <b>dissolved oxygen</b> is the one that kills in minutes rather than days. Fish suffocate, and the aerobic bacteria that run the nitrogen cycle stop working, if oxygen crashes — which it does fastest on warm nights when warm water holds less oxygen and respiration is high, exactly when no one is watching. So the controller treats aeration as a life-support system: it runs aerators to keep DO above a hard floor, and it is built so that the safe failure mode is "aerator on". <b>pH</b> is managed more gently, by slow dosing toward a target, because a sudden pH swing is itself a shock to fish and bacteria. <b>Water temperature</b> is monitored because it sets how much oxygen the water can hold and how fast everything metabolises, and because most systems can heat but not easily cool.',
    'Underlying all of it is respect for the nitrogen cycle. Ammonia and nitrite are acutely toxic to fish; nitrate is not. A healthy system converts the first two to the third quickly, but that conversion depends on the bacteria, which depend on oxygen, pH and temperature staying in range — so the water-chemistry sensors are really watching the health of the invisible bacterial workforce as much as the water itself. The controller logs trends, alarms on any excursion toward danger, and is deliberately conservative: when in doubt, aerate, dose slowly, and call for a human. In a living system you cannot reboot, that conservatism is the whole point.',
  ],
  does: [
    'Monitors dissolved oxygen, pH, water temperature and EC/TDS continuously',
    'Runs aerators to hold dissolved oxygen above a hard safety floor',
    'Doses slowly to hold pH near the fish/bacteria/plant compromise target',
    'Watches for conditions that stress the nitrogen-cycle bacteria',
    'Fails safe — loss of control defaults to aeration on',
    'Logs water-chemistry trends and alarms on any drift toward danger',
    'Reports to a dashboard and escalates critical (DO) alarms immediately',
  ],
  features: [
    'DO as life-support: aeration held above a hard floor, fail-safe on',
    'Gentle proportional pH dosing that avoids shocking the system',
    'Temperature-aware oxygen expectations (warm water holds less O₂)',
    'EC/TDS trend as a proxy for nutrient load and water changes',
    'Nitrogen-cycle-aware alarms, not just single-variable thresholds',
    'Conservative, human-in-the-loop control for a system you cannot reboot',
    'Immediate escalation for dissolved-oxygen emergencies',
  ],
  applications: [
    { t: 'Backyard / educational aquaponics', d: 'A hobby or school system growing fish and vegetables together, where automated life-support prevents the classic overnight DO crash that wipes out the fish.' },
    { t: 'Commercial aquaponic farms', d: 'Larger recirculating systems where continuous DO/pH control and logging protect both crops and a valuable fish stock and provide records for buyers.' },
    { t: 'Recirculating aquaculture (RAS)', d: 'Fish-only intensive systems where dissolved-oxygen management is the single most critical control loop.' },
    { t: 'Research and demonstration systems', d: 'Controlled water-chemistry logging for studying nitrogen-cycle dynamics and crop/fish performance.' },
  ],
  skills: [
    'Calibrating and reading pH, dissolved-oxygen and EC probes',
    'Designing fail-safe control (safe state = aeration on)',
    'Proportional dosing control that avoids overshoot in a slow system',
    'Understanding the nitrogen cycle and fish tolerances',
    'Relay/pump control with interlocks and alarm escalation',
  ],
  prereq: [
    'Dissolved oxygen is the life-critical variable — design so that any fault, brown-out or crash leaves the aerator running, not off.',
    'pH probes and DO probes need real calibration against standards and drift over weeks; an uncalibrated probe driving dosing is dangerous.',
    'Never dose pH quickly. Small, slow corrections only — a fast pH swing can be more harmful than the original deviation.',
    'This controls a living system. Keep a human in the loop for anything beyond aeration and gentle dosing, and always have manual backup aeration.',
  ],

  parts: ['esp32', 'dissolvedo2', 'ph', 'ds18b20', 'tds', 'relay4', 'pump'],
  extraParts: [
    { name: 'Air pump + air stones (aeration)', spec: 'Sized to the tank volume/stocking; the primary life-support actuator', qty: 1, price: 900, note: 'Consider a second, independently-powered backup aerator' },
    { name: 'pH dosing pumps (acid/base)', spec: 'Two peristaltic pumps for slow, metered pH correction', qty: 2, price: 700, note: 'Peristaltic for precise small doses' },
    { name: 'Lab pH / DO calibration standards', spec: 'pH 4/7/10 buffers; DO zero + saturation calibration', qty: 1, price: 500, note: 'Consumable — recalibrate regularly' },
    { name: 'Backup aerator on separate power', spec: 'Battery/UPS-backed air pump as independent fail-safe', qty: 1, price: 800, note: 'The most important safety item in the build' },
  ],
  cost: '₹5,500 – ₹7,500',
  libs: ['wifi', 'pubsub', 'onewire', 'unified', 'pid', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'DO probe (analog)', devPin: 'AOUT', pin: 'GPIO 34 (ADC)', sig: 'Dissolved oxygen' },
      { dev: 'pH probe (analog)', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'pH via BNC amp board' },
      { dev: 'DS18B20', devPin: 'DQ', pin: 'GPIO 4', sig: 'Water temperature (compensates DO/pH)' },
      { dev: 'TDS/EC probe', devPin: 'AOUT', pin: 'GPIO 32 (ADC)', sig: 'Electrical conductivity / nutrient load' },
    ],
    right: [
      { dev: 'Relay ch1', devPin: 'IN', pin: 'GPIO 26', sig: 'Aerator (fail-safe ON)' },
      { dev: 'Relay ch2', devPin: 'IN', pin: 'GPIO 25', sig: 'Circulation pump' },
      { dev: 'Dose pump — acid', devPin: 'IN', pin: 'GPIO 27', sig: 'pH-down peristaltic' },
      { dev: 'Dose pump — base', devPin: 'IN', pin: 'GPIO 14', sig: 'pH-up peristaltic' },
    ],
  },
  wiringNotes: [
    'Wire the aerator relay so the safe state is <b>energised/aerating</b>: choose the relay sense and default output so a reset, brown-out or crash leaves the aerator running, and back it up with an independently-powered aerator that the controller cannot switch off.',
    'Keep the pH probe on a proper high-impedance BNC amplifier board; the raw electrode signal cannot drive an ADC directly and is easily corrupted by noise.',
    'Give the analogue probes a clean, stable reference and keep their grounds away from the pump/relay switching currents that inject noise.',
    'Use peristaltic pumps for pH dosing so a dose is a precise, small, metered volume — never a valve that could dump.',
    'Place the DS18B20 in the water flow so its temperature genuinely represents the water the DO and pH probes see, since both readings are temperature-dependent.',
  ],

  block: { columns: [
    { label: 'Water chemistry', edge: 'right', blocks: [
      { name: 'Dissolved O₂', sub: 'life-critical', highlight: true },
      { name: 'pH', sub: 'slow dosing' },
      { name: 'Water temp', sub: 'DS18B20' },
      { name: 'EC/TDS', sub: 'nutrient load' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'fail-safe logic' },
      { name: 'Interlocks', sub: 'DO floor first' },
    ] },
    { label: 'Actuate', edge: 'right', blocks: [
      { name: 'Aerator', sub: 'fail-safe ON' },
      { name: 'Circulation', sub: 'pump' },
      { name: 'Dose', sub: 'acid / base' },
    ] },
    { label: 'Watch', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'trends' },
      { name: 'Escalate', sub: 'DO alarm' },
    ] },
  ] },
  flow: [
    { t: 'Read DO, pH, temp, EC', k: 'start' },
    { t: 'DO below floor?', k: 'dec', yes: 'Aerator ON + critical alarm', no: 'Aerator per schedule' },
    { t: 'Aerator ON + critical alarm', k: 'io' },
    { t: 'Aerator per schedule', k: 'proc' },
    { t: 'pH outside target band?', k: 'dec', yes: 'Dose slowly toward target', no: 'Hold dosing' },
    { t: 'Dose slowly toward target', k: 'io' },
    { t: 'Hold dosing', k: 'proc' },
    { t: 'Log + report; wait interval', k: 'end', back: 'Read DO, pH, temp, EC' },
  ],

  principle: [
    'The controller\'s priorities are strictly ordered, and dissolved oxygen sits at the top because it is the only variable that can kill the whole system within minutes. Fish extract oxygen from water across their gills; the nitrifying bacteria that keep ammonia from poisoning those same fish are aerobic and stop working without oxygen. Warm water holds less dissolved oxygen than cool water, and warm nights combine low solubility with high biological respiration, so the classic catastrophe is a pre-dawn DO crash. The design answer is to treat aeration as life-support: hold DO above a hard floor at all costs, and arrange the electronics so that the failure mode — a crash, a brown-out, a lost network — leaves the aerator <i>running</i>. An independently-powered backup aerator the controller cannot switch off is the belt to that braces.',
    'pH is managed with a completely different temperament: slowly. The fish, the bacteria and the plants each prefer a slightly different pH, so the target is a compromise near neutral that keeps the fish and bacteria safe while the plants tolerate it. The danger with pH is not just the wrong value but the wrong <b>rate of change</b> — a rapid swing shocks fish and stalls the bacteria more than a modest steady offset would. So the controller doses in small, metered amounts with a long wait between doses, using proportional control that eases toward the target and deliberately under-corrects rather than risk overshoot. In a large, slow water volume, patience is safety.',
    'Water temperature is monitored rather than aggressively controlled, but it is not passive information: it sets the oxygen-carrying capacity of the water (so the DO floor and aeration expectations are temperature-aware), it governs how fast the bacteria process ammonia, and it bounds what the fish and plants can tolerate. Most systems can add heat but cannot easily remove it, so the controller\'s temperature role is mainly to warn — a rising temperature is also a falling oxygen ceiling, and the two alarms reinforce each other.',
    'EC/TDS closes the picture as a proxy for nutrient concentration and dilution. It does not directly measure the toxic ammonia and nitrite — those need test kits or dedicated sensors — but its trend reveals a lot: a steady rise tracks nutrient accumulation and evaporation, a sudden drop flags a water change or top-up, and unexpected jumps can hint at a problem. Because ammonia and nitrite are the acutely toxic species and are hard to measure cheaply online, the controller\'s water-chemistry alarms are framed around protecting the bacteria that destroy them: keep oxygen, pH and temperature in range and the invisible nitrogen-cycle workforce keeps the toxins low for you. The controller is, in the end, a caretaker of that workforce as much as of the water.',
  ],
  equations: [
    { t: 'Temperature-dependent oxygen saturation', eq: 'The maximum DO water can hold falls as it warms:\n\n  DO_sat(T) decreases roughly from ~9 mg/L at 20 °C\n  to ~7 mg/L at 30 °C (freshwater, sea level).\n\nExpress health as % of saturation, not just mg/L:\n  DO_pct = DO_meas / DO_sat(T) × 100\n\nA warm tank can be near saturation yet still low in absolute\nmg/L — which is why the floor is set in mg/L for the fish.' },
    { t: 'pH probe (Nernstian) with temperature', eq: 'The electrode voltage is temperature-sensitive:\n\n  pH = 7 + (V_probe − V_offset) / (S · k·T)\n\nS is the slope from 2-/3-point buffer calibration,\nk·T is the Nernst temperature term (≈ 59 mV/pH at 25 °C).\nAlways calibrate against pH 4/7/(10) buffers and apply the\ntemperature correction, or dosing acts on a wrong number.' },
    { t: 'Proportional, rate-limited pH dosing', eq: 'error = pH − pH_target\ndose_ml = clamp(Kp · error, 0, dose_max)   // small cap\n\nWait t_settle (minutes) after each dose before re-measuring,\nbecause the tank mixes slowly. Never chase the target with\nback-to-back doses — that is how pH overshoots and shocks\nthe fish. Under-correct and repeat.' },
  ],

  assembly: [
    { h: 'Wire aeration as fail-safe life-support', p: [
      'Connect the primary aerator through a relay arranged so the default/failed state is aerating, and add a second aerator on independent (battery/UPS) power that the controller cannot turn off.',
      'Verify by cutting controller power that at least one aerator keeps running.',
    ], warn: 'This is the single most important step. Everything else can fail gracefully; oxygen cannot. Test the fail-safe before you ever add fish.' },
    { h: 'Install and amplify the probes', p: [
      'Mount the DO, pH, EC and temperature probes in flowing water where they see representative conditions. Put the pH electrode on its BNC amplifier board and keep probe grounds away from pump/relay noise.',
      'Fit the two peristaltic dosing pumps with their intakes in the acid and base reservoirs and outlets into a well-mixed part of the flow.',
    ] },
    { h: 'Set up dosing reservoirs and circulation', p: [
      'Place small, clearly-labelled acid and base reservoirs and prime the dosing lines. Ensure the circulation pump keeps the water mixed so a dose disperses rather than pooling at the probe.',
    ], warn: 'Handle pH-adjustment chemicals with care and keep acid and base reservoirs and lines clearly separated — cross-dosing is dangerous to the system and to you.' },
  ],
  steps: [
    { h: 'Calibrate every probe', p: [
      'Calibrate pH against 4/7/(10) buffers, DO against a zero solution and air-saturated water, and EC against a standard solution. Store the calibration constants and the date.',
    ], tip: 'Log calibration dates and re-check on a schedule; probes drift, and dosing driven by a drifted probe is worse than no dosing.' },
    { h: 'Implement the ordered control logic', p: [
      'Each cycle, evaluate DO first (aerate/alarm), then pH (slow dose within limits), then log temperature and EC trends. Never let pH or EC logic override the DO floor.',
    ], code: {
      file: 'aquaponics-control.ino', lang: 'cpp',
      body: `// Priority-ordered control: dissolved oxygen is life-support and wins.
void controlCycle(float doMgL, float pH, float tempC, float ec, uint32_t now) {
  // 1) Dissolved oxygen — hard floor, fail-safe toward aeration.
  if (doMgL < DO_FLOOR) {
    setAerator(true);
    if (doMgL < DO_CRIT) escalate("DO CRITICAL", doMgL);   // wake a human
  } else if (doMgL > DO_HIGH_OFF) {
    // Only ever ease aeration; a schedule keeps a baseline running.
    setAerator(scheduledAeration(now));
  }

  // 2) pH — slow, rate-limited proportional dosing, DO permitting.
  static uint32_t lastDose = 0;
  if (now - lastDose > SETTLE_MS) {
    float err = pH - PH_TARGET;
    if (fabsf(err) > PH_DEADBAND) {
      float ml = fminf(fabsf(err) * KP_PH, DOSE_MAX_ML);   // small, capped
      if (err > 0) doseBase(0);                            // pH high? add...
      if (err > 0) doseAcid(ml);                           // acid to lower pH
      else         doseBase(ml);                           // base to raise pH
      lastDose = now;
      logDose(err, ml);
    }
  }

  // 3) Temperature + EC — monitor, warn, adjust expectations.
  if (tempC > TEMP_WARN) warn("Water warm — oxygen ceiling low", tempC);
  logTrends(doMgL, pH, tempC, ec);
}`,
      explain: [
        { ref: 'if (doMgL < DO_FLOOR)', txt: 'Dissolved oxygen is checked first and unconditionally turns the aerator on; nothing later in the cycle can countermand it.' },
        { ref: 'if (doMgL < DO_CRIT) escalate', txt: 'Below a critical level the controller does not just aerate — it wakes a human, because a DO crash is a minutes-not-hours emergency.' },
        { ref: 'if (now - lastDose > SETTLE_MS)', txt: 'pH is only re-dosed after a settling wait, because a slow-mixing tank must be given time to respond before correcting again — this is what prevents overshoot.' },
        { ref: 'float ml = fminf(fabsf(err) * KP_PH, DOSE_MAX_ML)', txt: 'Each dose is proportional to the error but hard-capped small, so the controller deliberately under-corrects and eases toward the target rather than shocking the fish.' },
        { ref: 'if (tempC > TEMP_WARN)', txt: 'Temperature is treated as a warning that the oxygen ceiling is dropping, reinforcing the DO logic rather than driving its own aggressive actuator.' },
      ],
    } },
    { h: 'Log, report and escalate', p: [
      'Log all four variables and every dose; report trends to the dashboard; and route DO-critical alarms to immediate escalation (push/SMS/siren) separate from routine notifications.',
    ] },
  ],

  code: [{
    file: 'aquaponics-controller.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Aquaponics Controller — ESP32, DO/pH/temp/EC, fail-safe aeration

   Priority-ordered life-support: dissolved oxygen held above a hard
   floor (fail-safe toward aeration), pH corrected by slow rate-limited
   dosing, temperature and EC monitored. DO-critical alarms escalate.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Preferences.h>
#include <math.h>

#define PIN_DO     34
#define PIN_PH     35
#define PIN_EC     32
#define OW_PIN      4
#define PIN_AER    26     // aerator relay — WIRED FAIL-SAFE ON
#define PIN_CIRC   25     // circulation pump
#define PIN_ACID   27     // peristaltic pH-down
#define PIN_BASE   14     // peristaltic pH-up

#define DO_FLOOR    5.0f  // mg/L — keep above this for fish + bacteria
#define DO_CRIT     3.0f  // mg/L — emergency escalation
#define DO_HIGH_OFF 7.5f  // mg/L — may ease aeration to schedule
#define PH_TARGET   6.8f  // fish/bacteria/plant compromise
#define PH_DEADBAND 0.2f
#define KP_PH       6.0f  // ml per pH unit of error (small)
#define DOSE_MAX_ML 5.0f  // hard cap per dose
#define SETTLE_MS  600000UL   // 10 min between doses (slow tank)
#define TEMP_WARN   30.0f
#define CYCLE_MS    5000UL

OneWire           ow(OW_PIN);
DallasTemperature water(&ow);
Preferences       prefs;
WiFiClient        net;
PubSubClient      mqtt(net);

// Calibration constants loaded from flash.
float PH_SLOPE, PH_OFFSET, DO_CAL, EC_CAL;
uint32_t lastCycle = 0, lastDose = 0;
float doseMlPerMs;     // peristaltic pump flow rate

/* ── probe reads (calibrated, temperature-compensated) ───────── */
float readpH(float tempC) {
  int raw = 0; for (int i = 0; i < 32; i++) raw += analogRead(PIN_PH);
  float v = (raw / 32.0f) / 4095.0f * 3.3f;
  float tc = (tempC + 273.15f) / 298.15f;             // Nernst temp factor
  return 7.0f + (PH_OFFSET - v) / (PH_SLOPE * tc);
}
float readDO(float tempC) {
  int raw = 0; for (int i = 0; i < 32; i++) raw += analogRead(PIN_DO);
  float v = (raw / 32.0f) / 4095.0f * 3.3f;
  // DO_CAL maps voltage→mg/L; result scaled by saturation vs temperature.
  return v * DO_CAL * (1.0f - 0.023f * (tempC - 20.0f));
}
float readEC() {
  int raw = 0; for (int i = 0; i < 32; i++) raw += analogRead(PIN_EC);
  return (raw / 32.0f) / 4095.0f * 3.3f * EC_CAL;
}

/* ── actuators ───────────────────────────────────────────────── */
void setAerator(bool on) { digitalWrite(PIN_AER, on ? HIGH : LOW); }
void dose(uint8_t pin, float ml) {
  uint32_t t = (uint32_t)(ml / doseMlPerMs);
  digitalWrite(pin, HIGH); delay(t); digitalWrite(pin, LOW);
}

bool scheduledAeration(uint32_t now) { return true; }   // baseline: always on

void escalate(const char *why, float v) {
  char m[120];
  snprintf(m, sizeof m, "{\\"crit\\":\\"%s\\",\\"val\\":%.2f}", why, v);
  mqtt.publish("aqua/1/critical", m);      // separate, escalated topic
}

void report(float doMgL, float pH, float t, float ec, bool aer) {
  char b[220];
  snprintf(b, sizeof b,
    "{\\"do\\":%.2f,\\"ph\\":%.2f,\\"temp\\":%.1f,\\"ec\\":%.0f,"
    "\\"aer\\":%d,\\"do_floor\\":%.1f}",
    doMgL, pH, t, ec, aer ? 1 : 0, DO_FLOOR);
  mqtt.publish("aqua/1/state", b);
}

void loadCal() {
  prefs.begin("aqua", true);
  PH_SLOPE  = prefs.getFloat("phS", 0.18f);
  PH_OFFSET = prefs.getFloat("phO", 1.65f);
  DO_CAL    = prefs.getFloat("doC", 3.0f);
  EC_CAL    = prefs.getFloat("ecC", 1000.0f);
  doseMlPerMs = prefs.getFloat("dose", 0.001f);
  prefs.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_AER, OUTPUT);  pinMode(PIN_CIRC, OUTPUT);
  pinMode(PIN_ACID, OUTPUT); pinMode(PIN_BASE, OUTPUT);
  setAerator(true);                        // start aerating immediately
  digitalWrite(PIN_CIRC, HIGH);            // circulation always on
  water.begin();
  loadCal();
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect("aqua-1");
  mqtt.loop();
  uint32_t now = millis();
  if (now - lastCycle < CYCLE_MS) return;
  lastCycle = now;

  water.requestTemperatures();
  float tempC = water.getTempCByIndex(0);
  float pH    = readpH(tempC);
  float doMgL = readDO(tempC);
  float ec    = readEC();

  // 1) Dissolved oxygen — life-support, wins over everything.
  bool aer = true;
  if (doMgL < DO_FLOOR) {
    setAerator(true);
    if (doMgL < DO_CRIT) escalate("DO CRITICAL", doMgL);
  } else if (doMgL > DO_HIGH_OFF) {
    aer = scheduledAeration(now);          // still defaults on here
    setAerator(aer);
  }

  // 2) pH — slow, rate-limited, capped dosing.
  if (now - lastDose > SETTLE_MS) {
    float err = pH - PH_TARGET;
    if (fabsf(err) > PH_DEADBAND) {
      float ml = fminf(fabsf(err) * KP_PH, DOSE_MAX_ML);
      if (err > 0) dose(PIN_ACID, ml);     // pH too high → add acid
      else         dose(PIN_BASE, ml);     // pH too low  → add base
      lastDose = now;
    }
  }

  // 3) Temperature — warn (oxygen ceiling falls as it warms).
  if (tempC > TEMP_WARN)
    mqtt.publish("aqua/1/warn", "water warm; DO ceiling low");

  report(doMgL, pH, tempC, ec, aer);
}`,
    explain: [
      { ref: 'setAerator(true);                        // start aerating immediately', txt: 'The very first thing setup does is turn aeration on and start circulation, so the system is life-supporting from the instant it powers up, before any sensor is even read.' },
      { ref: 'float readpH(float tempC)', txt: 'The pH is computed from a calibrated slope/offset with the Nernst temperature factor applied, so dosing acts on a true, temperature-corrected pH rather than a raw voltage.' },
      { ref: 'return v * DO_CAL * (1.0f - 0.023f * (tempC - 20.0f))', txt: 'The dissolved-oxygen reading is corrected for temperature, since the same probe voltage means different oxygen at different water temperatures.' },
      { ref: 'if (doMgL < DO_CRIT) escalate("DO CRITICAL"', txt: 'A critical oxygen level publishes to a separate escalated topic — this is the alarm that must reach a person immediately, distinct from routine notifications.' },
      { ref: 'if (now - lastDose > SETTLE_MS)', txt: 'Dosing is gated by a ten-minute settle timer and a hard per-dose cap, encoding the rule that pH must be nudged slowly in a big, slow tank — never chased.' },
    ],
  }],

  config: [
    'Set DO_FLOOR and DO_CRIT to your fish species\' oxygen needs (many need ≥ 5 mg/L; sensitive species higher).',
    'Set PH_TARGET to the compromise for your fish, bacteria and crops (commonly ~6.8–7.0), and keep KP_PH and DOSE_MAX_ML small.',
    'Load probe calibration constants (pH slope/offset, DO and EC) and record the calibration dates.',
    'Configure the settle time between doses to your tank volume/mixing, and route DO-critical alarms to real escalation (SMS/siren).',
  ],
  calibration: [
    { h: 'pH', p: [
      'Two- or three-point calibrate against pH 4/7/(10) buffers at a known temperature; store slope and offset. Re-check weekly at first.',
    ] },
    { h: 'Dissolved oxygen', p: [
      'Zero the probe in a zero-oxygen solution and set the span in air-saturated water at a known temperature; verify the temperature compensation.',
    ] },
    { h: 'EC and dosing pumps', p: [
      'Calibrate EC against a standard solution. Measure each peristaltic pump\'s ml-per-second by timed dispense so a commanded dose is an accurate volume.',
    ] },
  ],
  testing: [
    { step: 'Cut controller power with fish present (dry-run/empty first)', expect: 'A backup aerator keeps running; the system stays oxygenated' },
    { step: 'Lower DO below the floor (simulate)', expect: 'Aerator forced on; below critical, escalation alarm fires' },
    { step: 'Offset pH above target', expect: 'One small acid dose, then a settle wait before any further dose — no chasing' },
    { step: 'Warm the water past the temp-warn level', expect: 'Warning published; DO logic already holding the floor' },
    { step: 'Change/top-up water', expect: 'EC trend steps; logged, no spurious dosing' },
    { step: 'Verify a dose volume against the pump calibration', expect: 'Dispensed ml matches the commanded ml within tolerance' },
  ],
  output: [
    'The dashboard shows live DO (against its floor), pH (against target), water temperature and EC, plus a dosing log and a prominent DO status indicator.',
    { file: 'aqua-state.json', lang: 'json', body: `{
  "do": 6.4,
  "ph": 6.9,
  "temp": 26.3,
  "ec": 1180,
  "aer": 1,
  "do_floor": 5.0
}` },
    'Here DO sits safely above its 5 mg/L floor with the aerator on, pH is near the 6.8 target, and temperature and EC are in a healthy range — a balanced system, with the DO indicator the one to watch overnight.',
  ],
  troubleshoot: [
    { sym: 'Fish gasping at the surface at dawn', cause: 'Overnight DO crash — warm water, high respiration, weak aeration', fix: 'Increase aeration capacity; raise the DO floor; ensure the fail-safe/backup aerator works; this is the classic emergency the design targets' },
    { sym: 'pH oscillates or overshoots', cause: 'Dosing too aggressively or too often', fix: 'Reduce KP_PH and DOSE_MAX_ML; lengthen the settle time; the tank must be given time to mix' },
    { sym: 'pH reading drifts / dosing on wrong number', cause: 'Uncalibrated or ageing pH probe', fix: 'Recalibrate against buffers; replace an old electrode; never dose on an unverified probe' },
    { sym: 'DO reads implausibly high or low', cause: 'Probe fouling or bad temperature compensation', fix: 'Clean/service the DO probe; verify the water-temperature reading feeding the compensation' },
    { sym: 'Bacteria seem to stall (ammonia/nitrite rise on test kit)', cause: 'Low oxygen, pH out of range, or temperature too low for nitrification', fix: 'Restore DO, pH and temperature to range and be patient; the bacteria recover slowly' },
  ],

  electronics: {
    pcb: [
      'Keep the high-impedance pH input isolated and guarded on the board; ground loops and noise from pump/relay switching corrupt it easily.',
      'Separate the low-voltage analogue front end from the relay/pump switching section, with a single clean ground reference for the ADC.',
      'Fuse the pump and aerator outputs and use relays/SSRs rated well above the actuator currents.',
    ],
    calcs: [
      { t: 'Aerator sizing (rule of thumb)', eq: 'Oxygen demand rises with fish load and temperature.\nSize aeration so DO stays > floor at the WARM-night worst case,\nnot the cool-day average. Include margin and a backup unit.', d: 'The aerator must cover peak biological oxygen demand on the hottest night, with the water least able to hold oxygen — the moment the system is most likely to fail.' },
      { t: 'Dose volume per correction', eq: 'ml = flow_rate(ml/s) × on_time(s)\nCap ml so one dose shifts pH only a fraction of a unit\nin the full tank volume — small relative to buffering.', d: 'A dose should nudge, not shove: sized small against the tank\'s volume and buffering so it cannot overshoot before the next settle.' },
    ],
    ratings: [
      { p: 'Aerator relay/SSR', r: '≥ 2× aerator current', m: 'Runs near-continuously; derate generously' },
      { p: 'Peristaltic dose pumps', r: 'Per pump spec', m: 'Short bursts; protect against run-dry' },
      { p: 'pH amp input', r: 'High-impedance, guarded', m: 'Never load the electrode; shield the lead' },
      { p: 'Controller supply', r: 'Stable 5 V + backup', m: 'Loss must leave aeration running' },
    ],
    pinout: [
      { p: 'GPIO 34/35/32', f: 'DO / pH / EC analogue in', n: 'ADC; average many samples; clean ground' },
      { p: 'GPIO 4', f: 'DS18B20 water temp', n: '1-Wire; compensates DO and pH' },
      { p: 'GPIO 26', f: 'Aerator relay', n: 'Wired fail-safe ON' },
      { p: 'GPIO 27/14', f: 'Acid / base dose pumps', n: 'Peristaltic; short metered pulses' },
    ],
  },

  iot: {
    protoShort: 'Wi-Fi + MQTT; DO-critical on a separate escalated topic',
    net: {
      nodes: [{ name: 'Aqua controller', sub: 'ESP32' }, { name: 'Backup aerator', sub: 'independent power' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'local-first control',
      uplink: 'MQTT 1883', cloud: 'Broker + dashboard', cloudSub: 'trends + escalation',
      clients: [{ name: 'Dashboard', sub: 'DO/pH/temp/EC' }, { name: 'Phone/SMS', sub: 'DO alarms' }],
    },
    protocol: ['State publishes every few seconds; DO-critical events publish immediately on a dedicated topic that the escalation server treats as urgent. All life-critical control (aeration floor, fail-safe) runs locally and never depends on the network.'],
    topics: [
      { t: 'aqua/1/state', dir: 'node → broker', payload: 'DO, pH, temp, EC, aerator state' },
      { t: 'aqua/1/critical', dir: 'node → broker', payload: 'DO-critical emergency (escalated)' },
      { t: 'aqua/1/warn', dir: 'node → broker', payload: 'temperature / drift warnings' },
    ],
    cloud: ['A broker feeds a dashboard that trends all four variables and a separate escalation path for DO-critical alarms; the cloud is for visibility and alerting, never for holding the oxygen floor, which stays entirely local.'],
    dashboard: ['A prominent dissolved-oxygen gauge against its floor, plus pH-against-target, water temperature and EC trends and a dosing history — designed so the one life-critical number is impossible to miss.'],
    mobile: ['Routine warnings notify; a DO-critical alarm escalates hard (push, then SMS/call) because it is a minutes-scale emergency.'],
    security: [
      'Keep all life-support control local and independent of the network and cloud.',
      'Authenticate any remote command; never allow a remote command to disable aeration.',
      'Alarm on controller silence so a dead node is noticed before the fish are.',
    ],
  },

  perf: [
    'A few-second control cycle is fast enough for water chemistry, which changes slowly, while keeping ADC and dosing work light.',
    'Average many ADC samples per probe read; a single sample is far too noisy to drive dosing.',
    'Rate-limit dosing with a settle timer so the slow tank is never over-corrected.',
    'Keep the life-critical DO loop entirely local so latency or an outage never delays aeration.',
  ],
  safety: [
    'Dissolved oxygen is life-critical: design so every fault leaves aeration running, and always keep an independently-powered backup aerator.',
    'Handle pH-adjustment chemicals safely; label and separate acid and base reservoirs and lines.',
    'Never dose pH quickly — a rapid swing can be more harmful than the deviation being corrected.',
    'Keep a human in the loop for anything beyond aeration and gentle dosing; a living system cannot be rebooted.',
  ],
  maintenance: [
    'Recalibrate pH, DO and EC probes on a schedule and log the dates; replace ageing electrodes.',
    'Clean probe surfaces of biofilm, which slowly falsifies readings.',
    'Refill and prime dosing reservoirs; verify pump flow rates so doses stay accurate.',
    'Regularly test the aerator fail-safe and backup, and cross-check ammonia/nitrite with test kits.',
  ],
  future: [
    'Add online ammonia/nitrate sensing to close the loop on the nitrogen cycle directly.',
    'Add dosing for plant nutrients (iron, potassium) that aquaponic systems often lack.',
    'Model DO demand from temperature and feeding to pre-emptively aerate before a night-time crash.',
    'Integrate fish-feeding automation with water-quality feedback to avoid overfeeding, the root of many problems.',
  ],
  faq: [
    { q: 'Why is dissolved oxygen treated so differently from pH?', a: 'Because a DO crash kills fish and stalls the bacteria within minutes, while pH problems act over hours to days. So DO is life-support — held above a hard floor, fail-safe on — and pH is nudged gently.' },
    { q: 'What does "fail-safe on" actually mean here?', a: 'The aerator is wired and the firmware arranged so that a crash, brown-out or lost network leaves it running, and a separate aerator on independent power the controller cannot switch off backs it up. Silence must never mean no oxygen.' },
    { q: 'Why dose pH so slowly instead of correcting fast?', a: 'A rapid pH swing shocks fish and the bacteria more than a modest steady offset. Small, capped doses with a settling wait ease the system to target without overshoot.' },
    { q: 'Does it measure ammonia and nitrite?', a: 'Not directly in this build — those are hard to sense cheaply online. Instead it protects the bacteria that destroy them by holding oxygen, pH and temperature in range, and you cross-check with test kits.' },
    { q: 'Can I run it purely from the cloud?', a: 'No. All life-critical control runs locally so an internet outage can never delay aeration. The cloud is only for trends and escalating alarms.' },
  ],
  refs: [
    { t: 'Aquaponics — principles and water chemistry (FAO)', u: 'https://www.fao.org/', s: 'FAO' },
    { t: 'Nitrogen cycle in aquaculture — overview', u: 'https://en.wikipedia.org/wiki/Nitrogen_cycle', s: 'Reference' },
    { t: 'Dissolved oxygen and temperature solubility', u: 'https://en.wikipedia.org/wiki/Oxygen_saturation', s: 'Reference' },
    { t: 'pH measurement and Nernst equation', u: 'https://en.wikipedia.org/wiki/PH_meter', s: 'Reference' },
    { t: 'Recirculating aquaculture systems (RAS) — overview', u: 'https://en.wikipedia.org/wiki/Recirculating_aquaculture_system', s: 'Reference' },
  ],
  images: ['greenhouse', 'esp32', 'grafana'],
  imageCaptions: [
    'An aquaponic system grows fish and plants together — the controller holds the water in the band where both, and the bacteria between them, survive.',
    'ESP32 module running the priority-ordered life-support logic, with dissolved oxygen always first.',
    'A dashboard keeps the one life-critical number — dissolved oxygen — impossible to miss, alongside pH, temperature and EC trends.',
  ],
},

];
