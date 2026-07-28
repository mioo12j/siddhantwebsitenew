/* Smart City batch B — 078 Smart Waste Bin, 079 Adaptive Traffic Signal,
   080 Public Transit Tracker. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   078 — Smart Waste Bin
   ══════════════════════════════════════════════════════════════════ */
{
  id: '078',
  domainKey: 'iot',
  emoji: '🗑️', thumb: 'sensor',
  difficulty: 'Beginner',
  hours: '8–14 hours', iso8601: 'PT12H',
  tagline: 'Senses how full each bin is so trucks collect the bins that are actually full — not empty ones on a fixed schedule — cutting collection cost, fuel and overflowing bins.',

  overview: [
    'Municipal waste collection is astonishingly inefficient because it is <b>blind</b>: trucks follow fixed routes on fixed schedules, emptying every bin whether it is full or barely used, which means driving to and lifting half-empty bins (wasting fuel, time and money) while other bins overflow between visits (creating litter, smell and complaints). The fix is simple in concept: know how full each bin is, and collect the ones that need it. This project builds the sensor that makes that possible — a fill-level sensor in each bin that reports how full it is, so collection can be driven by actual need rather than a blind timetable.',
    'The sensing is straightforward: an ultrasonic sensor in the lid measures the distance down to the waste surface, which converts to a fill percentage. Each bin reports its fill level (and its trend) over a low-power wide-area network, and the fleet\'s worth of readings becomes a live map of which bins are full, filling fast, or still empty. From that, collection is <b>optimised</b>: routes are planned to empty the bins that are actually full or nearly so, skipping the empty ones — which cuts the number of lifts, the distance driven and the fuel burned, and stops bins overflowing because a fast-filling bin is collected before it spills.',
    'The value compounds: fewer, fuller collections mean lower cost and emissions, fewer overflow complaints, and — from the fill-rate data — the ability to <b>predict</b> when each bin will be full and right-size bins and schedules. Because bins are everywhere and have no power, the sensor is battery-powered and wireless (LoRa/NB-IoT) and must last a long time on a small battery, so it sleeps and reports infrequently. It is honest that ultrasonic fill sensing has quirks (irregular waste surfaces, a sensor that can be fouled or blocked) and that route optimisation is a logistics problem on top of the sensing. But as a fill-level sensor that turns a blind, wasteful, schedule-driven collection system into a demand-driven one, it delivers a large, well-proven efficiency gain — collect the full bins, skip the empty ones.',
  ],
  does: [
    'Senses how full each bin is (ultrasonic fill level → percentage)',
    'Reports fill level and trend over a low-power wireless network',
    'Builds a live map of which bins are full/filling/empty',
    'Drives demand-based collection (empty full bins, skip empty ones)',
    'Cuts lifts, distance, fuel and overflow',
    'Predicts fill-up times and right-sizes bins/schedules',
    'Runs a long time on a small battery (sleep + infrequent reports)',
  ],
  features: [
    'Ultrasonic fill-level sensing',
    'Fill-trend and prediction',
    'Demand-driven route optimisation',
    'Overflow prevention',
    'Long battery life (LoRa/NB-IoT, deep sleep)',
    'Fleet-wide fill map and analytics',
    'Honest about sensing quirks and logistics',
  ],
  applications: [
    { t: 'Municipal waste collection', d: 'Demand-based collection to cut cost/fuel and stop overflows.' },
    { t: 'Commercial / campus waste', d: 'Right-sizing collection for offices, campuses and facilities.' },
    { t: 'Public-space bins', d: 'Preventing overflow of high-traffic street/park bins.' },
    { t: 'Recycling streams', d: 'Fill monitoring per stream for efficient recycling collection.' },
  ],
  skills: [
    'Ultrasonic fill-level sensing and percentage conversion',
    'Fill-trend and prediction',
    'Low-power wireless (LoRa/NB-IoT) and battery life',
    'Demand-based route/collection logic',
    'Fleet analytics',
  ],
  prereq: [
    'The gain comes from collecting by NEED, not schedule — empty full bins, skip empty ones.',
    'Bins have no power — sensors are battery + wireless and must sleep and report infrequently for long life.',
    'Ultrasonic fill sensing has quirks (irregular surfaces, fouling/blockage) — filter and flag.',
    'Route optimisation is a logistics layer on top of the sensing.',
  ],

  parts: ['esp32', 'jsnsr04t', 'ds18b20', 'lora', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Lid-mounted ultrasonic sensor', spec: 'Waterproof ultrasonic ranging in the bin lid (fill level)', qty: 1, price: 400, note: 'Robust to a dirty/damp bin environment' },
    { name: 'Long-life battery', spec: 'Large battery for years of sleep + infrequent reporting', qty: 1, price: 300, note: 'Battery life is critical at fleet scale' },
    { name: 'LoRa/NB-IoT module', spec: 'Low-power wide-area comms', qty: 1, price: 500 },
    { name: 'Rugged bin enclosure', spec: 'Sealed housing surviving the bin environment', qty: 1, price: 250 },
  ],
  cost: '₹1,500 – ₹2,800 per bin',
  libs: ['wifi', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Ultrasonic (lid)', devPin: 'TRIG/ECHO', pin: 'GPIO 26/25', sig: 'Distance to waste (fill)' },
      { dev: 'Temp (fire safety)', devPin: 'DQ', pin: 'GPIO 4', sig: 'Bin temperature (optional)' },
    ],
    right: [
      { dev: 'LoRa/NB-IoT', devPin: 'bus', pin: 'SPI/UART', sig: 'Fill report' },
      { dev: 'Battery sense', devPin: 'ADC', pin: 'GPIO 34', sig: 'Supervision' },
      { dev: 'TP4056', devPin: 'OUT', pin: '3V3 reg', sig: 'Supply' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Health' },
    ],
  },
  wiringNotes: [
    'Mount the ultrasonic sensor in the lid aimed down at the waste; convert distance to fill percentage using the bin depth.',
    'Median-filter readings because a waste surface is irregular and one ping can be off; flag a blocked/fouled sensor.',
    'Battery + LoRa/NB-IoT — bins have no power; deep-sleep and report infrequently (on change or a few times a day) for long life.',
    'Optionally add a temperature sensor for a bin-fire early warning.',
    'Seal the electronics against the damp, dirty bin environment; supervise the battery.',
  ],

  block: { columns: [
    { label: 'Sense fill', edge: 'right', blocks: [
      { name: 'Ultrasonic', sub: 'fill %', highlight: true },
      { name: 'Temp (opt)', sub: 'fire' },
    ] },
    { label: 'Report', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'fill + trend' },
      { name: 'LoRa/NB-IoT', sub: 'infrequent' },
    ] },
    { label: 'Aggregate', edge: 'right', blocks: [
      { name: 'Fill map', sub: 'full/empty', highlight: true },
      { name: 'Predict', sub: 'fill-up time' },
    ] },
    { label: 'Collect', edge: 'none', blocks: [
      { name: 'Optimise route', sub: 'full bins only' },
      { name: 'No overflow', sub: 'collect in time' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Measure fill (median)', k: 'proc' },
    { t: 'Changed enough / threshold crossed?', k: 'dec', yes: 'Report fill', no: 'Sleep' },
    { t: 'Report fill', k: 'io' },
    { t: 'Sleep', k: 'io', back: 'Wake on schedule' },
    { t: 'Platform: aggregate + predict', k: 'proc' },
    { t: 'Optimise collection (full bins)', k: 'end' },
  ],

  principle: [
    'Waste collection is inefficient for one root reason: it operates <b>without information</b>. A fixed schedule must assume the worst — collect everything often enough that nothing overflows — which guarantees that most collections are of bins that did not need it, while a bin that fills faster than average still overflows between visits. Every wasted lift is fuel, labour and truck-wear spent on nothing; every overflow is litter, smell and a complaint. The entire inefficiency comes from not knowing how full each bin is, so the fix is to <b>measure it</b> and collect by need.',
    'The measurement is simple and robust: an ultrasonic sensor in the lid times an echo down to the waste surface, and the distance converts to a <b>fill percentage</b> against the bin\'s depth (empty = full distance, full = short distance). The practical care is that a waste surface is <b>irregular</b> — a bag piled on one side, a gap in the middle — so a single ping can mislead; taking several pings and using the median gives a stable fill reading. The sensor should also recognise and flag a <b>blocked or fouled</b> face (a bag pressed against it, dirt on the transducer) rather than report a false "full".',
    'Those per-bin fill levels aggregate into a <b>live map</b>, and that map enables the two wins. First, <b>demand-driven collection</b>: routes are planned to empty the bins that are actually full or nearly full and <b>skip the empty ones</b>, which directly cuts the number of lifts, the distance driven and the fuel burned — a large, well-documented saving. Second, <b>overflow prevention</b>: a bin filling fast is visible and collected before it spills, and the <b>fill-rate trend</b> lets the system <b>predict</b> when each bin will be full, so collection can be scheduled just ahead of overflow rather than reactively. Over time the same fill-rate data supports <b>right-sizing</b> — bigger bins or more frequent service where fill is high, less where it is low.',
    'The deployment shape is dictated by the fact that <b>bins are everywhere and have no power</b>. So the sensor is <b>battery-powered and wireless</b> over a low-power wide-area network (LoRa or NB-IoT — long range, tiny data, minimal power), and the dominant design constraint is <b>battery life</b>: fill changes slowly, so the sensor deep-sleeps almost all the time and reports <b>infrequently</b> — a few times a day, or on a meaningful change — which makes years of life on a small battery achievable at fleet scale, with supervision so a dead sensor is noticed. The design is honest that ultrasonic fill sensing has quirks to manage and that turning the fill map into optimal routes is a separate <b>logistics</b> problem (a routing optimisation on top of the sensing). But the core contribution is clear and high-value: it replaces a blind, wasteful, schedule-driven system with a demand-driven one — collect the full bins, skip the empty ones, and stop the overflows — which is one of the most tangible and widely-proven wins in smart-city infrastructure.',
  ],
  equations: [
    { t: 'Fill percentage', eq: 'Sensor at the lid, bin depth D, distance to waste d:\n\n  fill% = (D − d) / D × 100   (clamp 0–100)\n\nMedian of several pings (waste surface is irregular).\nFlag blocked/fouled sensor (implausible/constant near-zero d).' },
    { t: 'Fill-rate prediction', eq: 'From fill history:\n  rate = Δfill / Δt   (%/day)\n  days_to_full ≈ (100 − fill) / rate\n\nSchedule collection just before predicted overflow;\nright-size service from the fill rate.' },
    { t: 'Battery life (infrequent reporting)', eq: 'life ≈ capacity / ( I_sleep + f_report·E_tx )\n\nFill changes slowly → report a few times/day or on change,\ndeep-sleep between → years on a small battery at fleet scale.' },
  ],

  assembly: [
    { h: 'Fit and calibrate the fill sensor', p: [
      'Mount the ultrasonic sensor in the lid aimed at the waste, set the bin depth, and calibrate empty (full distance) and full (short distance). Median-filter readings and flag blocked/fouled faces.',
      'Battery-power with deep sleep and infrequent reporting; supervise the battery.',
    ], warn: 'A waste surface is irregular and the sensor can be blocked by a bag. Median-filter and flag blockage, or the fill reading will be unreliable.' },
    { h: 'Set up wireless reporting', p: [
      'Report fill (and trend) over LoRa/NB-IoT infrequently (on change or a few times a day) for long battery life.',
    ] },
    { h: 'Aggregate and optimise', p: [
      'Aggregate fill levels into a live map, predict fill-up times, and drive demand-based route optimisation and overflow prevention.',
    ] },
  ],
  steps: [
    { h: 'Measure fill robustly and report on change', p: [
      'Take several pings, use the median, convert to fill percentage, flag blockage, and report only on a meaningful change or scheduled beat.',
    ], code: {
      file: 'bin-fill.ino', lang: 'cpp',
      body: `#define BIN_DEPTH_CM 100.0f
#define REPORT_DELTA 10.0f     // report on >=10% change
RTC_DATA_ATTR float lastReported = -1;

float medianDistance(){
  float d[5];
  for(int i=0;i<5;i++){ d[i]=pingCm(); delay(60); }
  for(int i=1;i<5;i++){float k=d[i];int j=i-1;
    while(j>=0&&d[j]>k){d[j+1]=d[j];j--;}d[j+1]=k;}
  return d[2];                          // median rejects an odd ping
}

int fillPercent(float dist){
  if (dist < 3 || isnan(dist)) return -1;          // blocked/fouled -> flag
  float f = (BIN_DEPTH_CM - dist)/BIN_DEPTH_CM*100;
  return (int)constrain(f, 0.0f, 100.0f);
}

bool shouldReport(int fill, bool scheduledBeat){
  if (fill < 0) return true;                        // report a blockage
  if (scheduledBeat) return true;
  return fabsf(fill - lastReported) >= REPORT_DELTA; // meaningful change
}`,
      explain: [
        { ref: 'float medianDistance()', txt: 'Takes several pings and uses the median, so one spurious echo off an irregular waste surface does not fake the fill level.' },
        { ref: 'if (dist < 3 || isnan(dist)) return -1;          // blocked/fouled -> flag', txt: 'A too-close or invalid reading means the sensor is blocked or fouled, which is flagged rather than reported as a false "full".' },
        { ref: 'float f = (BIN_DEPTH_CM - dist)/BIN_DEPTH_CM*100', txt: 'The distance to the waste is converted to a fill percentage against the bin depth — the actionable number for collection.' },
        { ref: 'return fabsf(fill - lastReported) >= REPORT_DELTA;', txt: 'Reporting only on a meaningful change (plus a scheduled beat) keeps transmissions rare, which is what gives years of battery life.' },
      ],
    } },
    { h: 'Aggregate, predict and optimise collection', p: [
      'Aggregate fill into a map, compute fill-rate and days-to-full, and plan routes to collect full/nearly-full bins and skip empty ones, preventing overflow.',
    ], tip: 'Collect on a predicted-full threshold with lead time, so a fast-filling bin is emptied just before it overflows rather than after.' },
  ],

  code: [{
    file: 'smart-waste-bin.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Waste Bin — ESP32 + ultrasonic, LoRa/NB-IoT, battery

   Senses bin fill level (median-filtered), reports on meaningful change
   for long battery life, and feeds demand-based collection. Flags a
   blocked sensor; optional temperature for fire safety.
   ══════════════════════════════════════════════════════════════════ */

#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_TRIG 26
#define PIN_ECHO 25
#define BIN_DEPTH_CM 100.0f
#define REPORT_DELTA 10.0f
#define SLEEP_S 21600          // 6 h base (fill changes slowly)
#define BIN_ID 312

Preferences prefs;
RTC_DATA_ATTR float lastReported = -1;

float pingCm(){
  digitalWrite(PIN_TRIG,LOW); delayMicroseconds(2);
  digitalWrite(PIN_TRIG,HIGH); delayMicroseconds(10); digitalWrite(PIN_TRIG,LOW);
  long us=pulseIn(PIN_ECHO,HIGH,30000);
  return us? us/58.0f : NAN;
}
float medianDistance(){
  float d[5]; for(int i=0;i<5;i++){ d[i]=pingCm(); delay(60);}
  for(int i=1;i<5;i++){float k=d[i];int j=i-1;
    while(j>=0&&(isnan(d[j])||d[j]>k)){d[j+1]=d[j];j--;}d[j+1]=k;}
  return d[2];
}

void report(int fill, float vbat){
  LoRa.beginPacket();
  LoRa.printf("{\\"bin\\":%d,\\"fill\\":%d,\\"vbat\\":%.2f}",
              BIN_ID, fill, vbat);
  LoRa.endPacket();
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_TRIG,OUTPUT); pinMode(PIN_ECHO,INPUT);
  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6); LoRa.setSpreadingFactor(10);

  float dist = medianDistance();
  int fill;
  if (dist < 3 || isnan(dist)) fill = -1;          // blocked/fouled
  else fill = (int)constrain((BIN_DEPTH_CM-dist)/BIN_DEPTH_CM*100, 0.0f, 100.0f);

  bool scheduledBeat = true;                        // every wake is a beat here
  bool changed = (fill < 0) || (lastReported < 0) ||
                 (fabsf(fill - lastReported) >= REPORT_DELTA);

  if (changed || scheduledBeat){
    report(fill, readBattery());
    lastReported = fill;
  }

  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_S*1000000ULL);
  esp_deep_sleep_start();
}
void loop(){}`,
    explain: [
      { ref: 'float medianDistance()', txt: 'Uses the median of several pings so an irregular waste surface or a single bad echo does not corrupt the fill reading.' },
      { ref: 'if (dist < 3 || isnan(dist)) fill = -1;          // blocked/fouled', txt: 'A blocked or fouled sensor is flagged as a special value rather than reported as a false full bin.' },
      { ref: 'if (changed || scheduledBeat){', txt: 'The bin reports only on a meaningful fill change or a scheduled beat, keeping transmissions rare for long battery life.' },
      { ref: 'esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_S*1000000ULL)', txt: 'The sensor deep-sleeps for hours between reads, drawing almost nothing — essential for a battery-powered fleet of thousands of bins.' },
      { ref: 'LoRa.printf("{\\"bin\\":%d,\\"fill\\":%d', txt: 'A tiny fill report per bin aggregates into the live map that drives demand-based collection.' },
    ],
  }],

  config: [
    'Set the bin depth and the report-on-change threshold and beat interval.',
    'Configure the blockage flag and optional temperature (fire) sensing.',
    'Configure LoRa/NB-IoT reporting and battery supervision.',
    'Set the collection thresholds and prediction lead time at the platform.',
  ],
  calibration: [
    { h: 'Fill scale', p: [
      'Calibrate empty (full distance) and full (short distance) for the bin; verify the fill percentage at intermediate levels.',
    ] },
    { h: 'Robustness', p: [
      'Confirm the median filter rejects irregular-surface pings and that blockage is flagged.',
    ] },
    { h: 'Battery/report', p: [
      'Verify report-on-change + beat and measure battery life at the expected report rate.',
    ] },
  ],
  testing: [
    { step: 'Fill the bin partway', expect: 'Fill percentage tracks; reports on meaningful change' },
    { step: 'Irregular surface (bag on one side)', expect: 'Median filter gives a stable reading' },
    { step: 'Block the sensor face', expect: 'Blockage flagged (not a false full)' },
    { step: 'Leave stable for a day', expect: 'Only scheduled beats — battery saved' },
    { step: 'Aggregate many bins', expect: 'Map/prediction drives full-bin collection' },
    { step: 'Battery run-down', expect: 'Low battery reported (supervision)' },
  ],
  output: [
    'The platform shows a map of bin fill levels, predicted fill-up times, and optimised collection routes (full bins), with overflow and blockage/battery alerts.',
    { file: 'bin.json', lang: 'json', body: `{
  "bin": 312,
  "fill": 84,
  "vbat": 3.71
}` },
    'Bin 312 at 84% full — flagged for the next optimised route while empty bins nearby are skipped; a fast fill-rate would schedule it just before overflow, and a blocked sensor would report a flag instead of a false full.',
  ],
  troubleshoot: [
    { sym: 'Unreliable fill readings', cause: 'Irregular surface / single ping', fix: 'Median-filter several pings; mount aimed at the bin centre' },
    { sym: 'False "full"', cause: 'Blocked/fouled sensor', fix: 'Flag blockage (too-close/invalid distance); clean the sensor' },
    { sym: 'Battery dies fast', cause: 'Reporting too often', fix: 'Report on change + slow beat; deep-sleep between' },
    { sym: 'Overflows still happen', cause: 'No prediction / late collection', fix: 'Predict fill-up from rate; collect with lead time' },
    { sym: 'Dead sensor unnoticed', cause: 'No supervision', fix: 'Report battery/beat; flag silent bins' },
  ],

  iot: {
    protoShort: 'LoRa/NB-IoT → waste-management platform',
    net: {
      nodes: [{ name: 'Bin sensor', sub: 'ESP32' }, { name: 'Other bins', sub: 'fleet' }],
      protocol: 'LoRa / NB-IoT', gateway: 'City gateway', gatewaySub: 'to platform',
      uplink: 'MQTT', cloud: 'Waste platform', cloudSub: 'fill + routes',
      clients: [{ name: 'Dispatch', sub: 'routes' }, { name: 'Ops', sub: 'overflow/blockage' }],
    },
    protocol: ['Bins report fill on meaningful change plus a slow beat; the platform aggregates fill, predicts fill-up, and optimises collection routes.'],
    topics: [
      { t: 'waste/bin/<id>/fill', dir: 'bin → platform', payload: 'fill %, battery, blockage flag' },
      { t: 'waste/route/plan', dir: 'platform → dispatch', payload: 'optimised route (full bins)' },
      { t: 'waste/bin/<id>/alert', dir: 'bin → ops', payload: 'overflow risk / blocked / low battery' },
    ],
    cloud: ['A waste-management platform maps fill, predicts fill-up, optimises routes to collect full bins and skip empty ones, and flags overflow/blockage — cutting cost, fuel and complaints.'],
    dashboard: ['A city map of bin fill, predicted overflows, optimised routes, and sensor/battery health.'],
    mobile: ['Overflow-risk, blockage and low-battery alerts; route plans for crews.'],
    security: [
      'Authenticate reports so fill data is trustworthy.',
      'Supervise battery/health; flag silent bins.',
      'Keep reporting rare for battery life at fleet scale.',
    ],
  },

  perf: [
    'Report on meaningful change plus a slow beat; deep-sleep for years of battery life.',
    'Median-filter fill; flag blockage.',
    'Aggregate and predict at the platform; optimise routes there.',
    'Supervise battery/health across the fleet.',
  ],
  safety: [
    'Seal electronics against the damp, dirty bin environment; site the sensor safely in the lid.',
    'Optional temperature sensing can give a bin-fire early warning.',
    'Ultrasonic fill sensing has quirks — filter and flag rather than trust a single reading.',
    'Route optimisation is a logistics layer; validate route plans operationally.',
  ],
  maintenance: [
    'Clean fouled sensors (flagged as blocked); check mounting.',
    'Replace batteries on a fleet plan; act on supervision alerts.',
    'Recalibrate fill scale if bins change.',
    'Review prediction/route performance and tune thresholds.',
  ],
  future: [
    'Add full route-optimisation with truck capacity/constraints.',
    'Add fill-type/contamination sensing for recycling.',
    'Add dynamic pricing/scheduling from fill analytics.',
    'Add bin-fire detection and public-facing fill maps.',
  ],
  faq: [
    { q: 'Where does the saving come from?', a: 'From collecting by need instead of schedule — emptying the bins that are actually full and skipping the empty ones. That cuts the number of lifts, the distance driven and the fuel burned, and stops bins overflowing between fixed visits.' },
    { q: 'How does it measure fill?', a: 'An ultrasonic sensor in the lid measures the distance down to the waste, which converts to a fill percentage against the bin depth. Several pings are median-filtered because a waste surface is irregular.' },
    { q: 'Why battery and wireless?', a: 'Bins are everywhere and have no power, so sensors are battery-powered and use low-power wireless (LoRa/NB-IoT). Because fill changes slowly, they deep-sleep and report infrequently, giving years of battery life.' },
    { q: 'What if a bag blocks the sensor?', a: 'A too-close or invalid reading is recognised as a blockage and flagged, rather than reported as a false "full" — so crews clean it instead of the map lying.' },
    { q: 'Can it prevent overflows?', a: 'Yes — a fast-filling bin is visible, and the fill-rate trend predicts when it will be full, so it can be collected just before it overflows rather than after.' },
  ],
  refs: [
    { t: 'Smart waste management', u: 'https://en.wikipedia.org/wiki/Waste_management', s: 'Reference' },
    { t: 'Fill-level sensing (ultrasonic)', u: 'https://en.wikipedia.org/wiki/Ultrasonic_transducer', s: 'Reference' },
    { t: 'Route optimisation / vehicle routing', u: 'https://en.wikipedia.org/wiki/Vehicle_routing_problem', s: 'Reference' },
    { t: 'LoRa / NB-IoT low-power networks', u: 'https://en.wikipedia.org/wiki/Narrowband_IoT', s: 'Reference' },
    { t: 'Smart-city waste efficiency studies', u: 'https://en.wikipedia.org/wiki/Smart_city', s: 'Reference' },
  ],
  images: ['city', 'ultrasonic', 'esp32'],
  imageCaptions: [
    'Fill sensing turns blind, scheduled collection into demand-driven collection of the full bins.',
    'An ultrasonic sensor in the lid measures the fill level and reports it over low-power wireless.',
    'Aggregated fill data optimises routes and prevents overflow — cutting cost, fuel and complaints.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   079 — Adaptive Traffic Signal
   ══════════════════════════════════════════════════════════════════ */
{
  id: '079',
  domainKey: 'iot',
  emoji: '🚦', thumb: 'board',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'Adjusts signal timing to the traffic that is actually there — giving green to the busy approach and not stranding cars at an empty one — to ease congestion, within strict safety rules.',

  overview: [
    'A fixed-time traffic signal is dumb: it gives each approach the same green regardless of whether ten cars or none are waiting, so you sit at a red light while the cross street is empty, and a queue builds on the busy approach while the quiet one gets green it does not need. Adaptive signals fix this by <b>sensing the traffic that is actually present</b> and adjusting the timing to it — extending green for a busy approach, cutting short a green that no one is using, and responding to demand in real time — which measurably reduces delay, queuing and the stop-start that wastes fuel and frays tempers. This project builds an educational adaptive-signal controller that demonstrates exactly that, within the strict safety framework real traffic control demands.',
    'The core is <b>demand sensing</b> per approach — detecting how many vehicles are waiting or arriving on each — via inductive loops, radar, or camera-based counting, and feeding that into an adaptive timing algorithm. Instead of fixed phase lengths, the controller <b>extends</b> a green while vehicles keep arriving (up to a maximum), <b>terminates</b> it early when the approach clears, and <b>allocates</b> green preferentially to the busier movements — so the intersection\'s capacity follows the real, changing demand rather than a static assumption. The result is less time wasted on empty phases and less queuing on busy ones.',
    'But traffic signals are <b>safety-critical infrastructure</b>, and this dominates the design. Real signals are governed by rigorous standards and must obey inviolable rules — <b>minimum green</b> times, mandatory <b>amber/all-red clearance</b> intervals so an intersection is never given conflicting greens, and <b>fail-safe</b> behaviour (a fault must drop to flashing red/amber or a safe fixed mode, never a dangerous state). The adaptive logic operates strictly <i>within</i> these constraints: it can only shorten or extend phases inside the safe minimum/maximum, and it can never compromise clearance or conflict-monitoring. The project is emphatic that a homebrew controller is an <b>educational demonstration of adaptive timing</b>, not a certified traffic controller, and that deploying real signals requires certified equipment, conflict monitors and regulatory approval. Within that honest, safety-first frame, it shows the genuine idea behind smart traffic control: sense the demand, adapt the timing to ease congestion, and never, ever break the safety rules that keep an intersection from becoming a crash.',
  ],
  does: [
    'Senses traffic demand per approach (loops/radar/camera counting)',
    'Extends green while vehicles arrive; terminates early when clear',
    'Allocates green preferentially to busier movements',
    'Reduces delay, queuing and stop-start congestion',
    'Enforces minimum green, amber/all-red clearance and no conflicting greens',
    'Fails safe (flashing red/amber or safe fixed mode) on fault',
    'Demonstrates adaptive timing within strict safety rules',
  ],
  features: [
    'Per-approach demand sensing',
    'Adaptive green extension/termination and allocation',
    'Congestion reduction vs fixed-time',
    'Inviolable minimum-green and clearance intervals',
    'Conflict avoidance (never conflicting greens)',
    'Fail-safe on fault',
    'Explicit: educational, not a certified controller',
  ],
  applications: [
    { t: 'Adaptive intersection control (educational)', d: 'Demonstrating demand-responsive signal timing to ease congestion.' },
    { t: 'Traffic-engineering study/simulation', d: 'Testing adaptive timing logic and its congestion benefit.' },
    { t: 'Smart-corridor concepts', d: 'Illustrating coordinated/adaptive signals along a route.' },
    { t: 'Education / demonstration', d: 'Teaching signal phases, clearance and adaptive control safely.' },
  ],
  skills: [
    'Vehicle demand sensing (loops/radar/camera)',
    'Adaptive signal timing (extend/terminate/allocate)',
    'Safety rules: minimum green, clearance, conflict avoidance',
    'Fail-safe design',
    'Understanding traffic-control standards (scope/limits)',
  ],
  prereq: [
    'Traffic signals are SAFETY-CRITICAL and standards-governed. This is an educational demonstration, NOT a certified controller — real deployment needs certified equipment, conflict monitors and approval.',
    'Inviolable rules: minimum green, mandatory amber/all-red clearance, and NEVER conflicting greens. Adaptive logic works only within these.',
    'Fail safe: any fault must drop to flashing red/amber or a safe fixed mode, never a dangerous state.',
    'Demand sensing per approach drives adaptation; it must be reliable.',
  ],

  parts: ['esp32', 'ir_sensor', 'jsnsr04t', 'neopixel', 'relay4', 'oled', 'psu5v'],
  extraParts: [
    { name: 'Vehicle detection per approach', spec: 'Inductive loop / radar / camera counting for demand', qty: 4, price: 1600, note: 'Reliable per-approach demand sensing' },
    { name: 'Signal heads (demo) + drivers', spec: 'Red/amber/green heads and safe drivers (demo scale)', qty: 4, price: 2000, note: 'Real heads/controllers must be certified' },
    { name: 'Conflict monitor (concept)', spec: 'Independent check that conflicting greens never occur', qty: 1, price: 1000, note: 'Real signals require a certified conflict monitor' },
    { name: 'Fail-safe supply/logic', spec: 'Drops to flashing/safe mode on fault', qty: 1, price: 500 },
  ],
  cost: '₹5,000 – ₹9,000 (demo)',
  libs: ['wifi', 'pubsub', 'fastled', 'ssd1306', 'arduinojson'],

  pins: {
    left: [
      { dev: 'Approach detectors ×4', devPin: 'in', pin: 'GPIO 34/35/32/33', sig: 'Per-approach demand' },
    ],
    right: [
      { dev: 'Signal heads (R/A/G)', devPin: 'ctrl', pin: 'relays/NeoPixel', sig: 'Phase outputs' },
      { dev: 'Conflict monitor', devPin: 'in', pin: 'GPIO', sig: 'No conflicting greens (independent)' },
      { dev: 'Fail-safe', devPin: 'ctrl', pin: 'GPIO 26', sig: 'Drop to safe mode on fault' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Phase/timing status' },
    ],
  },
  wiringNotes: [
    'This is an educational demonstration. Real traffic signals require certified controllers, certified conflict monitors and regulatory approval — do not deploy a homebrew controller on a live road.',
    'Sense demand per approach reliably (loops/radar/camera); the adaptive logic depends on it.',
    'Enforce inviolable rules in code and, ideally, with an independent conflict monitor: minimum green, mandatory amber/all-red clearance, and never conflicting greens.',
    'Design fail-safe: any fault, watchdog timeout or conflict detection must drop to flashing red/amber or a safe fixed mode.',
    'Keep the safety logic independent of the adaptive logic so adaptation can never violate safety.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Approach demand', sub: 'per approach', highlight: true },
    ] },
    { label: 'Adapt (within limits)', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'extend/terminate' },
      { name: 'Allocate', sub: 'busy approach' },
    ] },
    { label: 'Safety (independent)', edge: 'right', blocks: [
      { name: 'Min green/clearance', sub: 'inviolable', highlight: true },
      { name: 'Conflict monitor', sub: 'no conflicts' },
    ] },
    { label: 'Output', edge: 'none', blocks: [
      { name: 'Signal heads', sub: 'R/A/G' },
      { name: 'Fail-safe', sub: 'flashing on fault' },
    ] },
  ] },
  flow: [
    { t: 'Sense demand per approach', k: 'start' },
    { t: 'Green served min green?', k: 'dec', yes: 'Vehicles still arriving?', no: 'Hold green (min not met)' },
    { t: 'Hold green (min not met)', k: 'io', back: 'Sense demand per approach' },
    { t: 'Vehicles still arriving?', k: 'dec', yes: 'Extend green (≤ max)', no: 'Amber + all-red clearance' },
    { t: 'Extend green (≤ max)', k: 'io', back: 'Sense demand per approach' },
    { t: 'Amber + all-red clearance', k: 'proc' },
    { t: 'Give green to busiest waiting approach', k: 'io' },
    { t: 'Fault/conflict? → fail safe', k: 'end' },
  ],

  principle: [
    'Adaptive traffic control rests on one idea — <b>match green time to real demand</b> — and one non-negotiable constraint: <b>safety comes absolutely first</b>. A fixed-time signal allocates the same time to each movement regardless of who is there, so it systematically wastes capacity (green to empty approaches) and creates delay (red to full ones). Sensing the actual demand and adapting the timing to it recovers that wasted capacity and cuts delay — but a traffic signal is a machine that, if it ever gives green to conflicting movements, causes crashes, so every gain in efficiency must be won <i>inside</i> an inviolable safety envelope. The entire design is the interplay of these two: adapt as much as helps, never break the rules.',
    'The efficiency mechanism is <b>demand-responsive phase timing</b>. The controller senses how many vehicles are waiting or arriving on each approach (via loops, radar, or camera counting) and uses that to make three decisions within each cycle: <b>extend</b> a green while vehicles keep arriving on that approach (so a platoon is not chopped in half), <b>terminate</b> a green early once its approach clears (so no time is wasted on an empty movement), and <b>allocate</b> the next green to the approach with the most waiting demand. The effect is an intersection whose timing continuously tracks the changing traffic rather than a static plan — less wasted green, shorter queues, fewer needless stops.',
    'That adaptation, however, is permitted to move phase lengths only <b>within a safe band</b>, and the band is defined by rules that can never be violated. Every green has a <b>minimum</b> duration (so a phase, once started, runs long enough to be safe and to clear the pedestrians/vehicles that committed to it) and a <b>maximum</b> (so no approach is starved). Between conflicting phases there must be the mandatory <b>amber and all-red clearance</b> intervals — the time to stop and for the intersection to empty — which are <b>fixed by safety</b>, not by demand, and can never be shortened. And the controller must <b>never</b> display green to conflicting movements, a property so critical that real signals enforce it with an <i>independent</i> conflict monitor that will force the intersection to a safe state if the main controller ever tries. The adaptive logic proposes timings; the safety logic has absolute veto.',
    'The final principle is <b>fail-safe</b> and honest scope. Any fault — a sensor failure, a watchdog timeout, a detected conflict, a power problem — must drop the intersection to a <b>safe state</b>: flashing red/amber (treating it as a stop or give-way) or a known-safe fixed-time mode, never a dark or dangerous state. This must-not-fail-dangerous property, the independent conflict monitoring, and the fixed clearance intervals are exactly why real traffic controllers are <b>certified, standards-governed equipment</b> subject to regulatory approval — and why this project is emphatic that it is an <b>educational demonstration of the adaptive-timing idea</b>, not a controller to put on a live road. Built and understood that way, it teaches the real substance of smart traffic control: sense the demand and adapt the timing to ease congestion, but subordinate every efficiency decision to minimum greens, mandatory clearance, conflict avoidance and fail-safe behaviour — because at an intersection, safety is not one goal among several; it is the constraint everything else lives inside.',
  ],
  equations: [
    { t: 'Adaptive green (extend/terminate)', eq: 'Serve green g on approach A:\n\n  hold until t_green ≥ G_MIN (minimum green)\n  extend while vehicles arriving AND t_green < G_MAX\n  terminate when approach clears (gap-out) OR t_green = G_MAX\n\nAdaptation lives strictly within [G_MIN, G_MAX].' },
    { t: 'Mandatory clearance (fixed by safety)', eq: 'Between conflicting phases, ALWAYS:\n\n  amber (yellow) for T_amber  +  all-red for T_allred\n\nThese are fixed by safety (stopping + intersection clear\ntime) and are NEVER shortened by demand. Then and only then\nmay a conflicting green start.' },
    { t: 'Conflict avoidance + fail-safe', eq: 'Invariant: no two conflicting movements green together.\n  independent conflict monitor forces SAFE state if violated.\n\nOn any fault/watchdog/conflict:\n  outputs → flashing red/amber (or safe fixed mode)\nNever a dark/dangerous state.' },
  ],

  assembly: [
    { h: 'Build the safety framework FIRST', p: [
      'Implement the inviolable rules — minimum green, maximum green, mandatory amber/all-red clearance, and never conflicting greens — and a fail-safe that drops to flashing/safe mode on any fault. Ideally add an independent conflict monitor.',
    ], warn: 'Safety is the constraint everything lives inside. Build minimum green, clearance, conflict avoidance and fail-safe first; the adaptive logic may only operate within them. This is educational — real signals require certified equipment and approval.' },
    { h: 'Add demand sensing', p: [
      'Sense demand per approach (loops/radar/camera counting) reliably, feeding the adaptive logic.',
    ] },
    { h: 'Add adaptive timing within the safety band', p: [
      'Extend/terminate greens and allocate to the busiest approach strictly within [G_MIN, G_MAX] and after full clearance.',
    ] },
  ],
  steps: [
    { h: 'Run adaptive timing subordinate to safety', p: [
      'Serve a green no shorter than minimum, extend it on continued demand up to maximum, terminate on gap-out, then always run amber + all-red before the next (non-conflicting) phase.',
    ], code: {
      file: 'adaptive-signal.ino', lang: 'cpp',
      body: `#define G_MIN 7000UL      // ms minimum green (safety)
#define G_MAX 45000UL     // ms maximum green (fairness)
#define T_AMBER 3000UL    // fixed by safety
#define T_ALLRED 2000UL   // fixed by safety

// Decide when to end the current green (within the safe band).
bool endGreen(uint32_t tGreen, bool arriving){
  if (tGreen < G_MIN) return false;             // never below minimum green
  if (tGreen >= G_MAX) return true;             // fairness cap
  return !arriving;                              // gap-out when approach clears
}

// Transition to the next phase ALWAYS via mandatory clearance.
void toNextPhase(int nextApproach){
  setGreen(currentApproach, false);
  setAmber(currentApproach, true);  safeDelay(T_AMBER);   // amber
  setAmber(currentApproach, false);
  allRed();                          safeDelay(T_ALLRED);  // all-red clear
  // conflict monitor must confirm no conflict before any green:
  if (!conflictClear()) { failSafe(); return; }
  currentApproach = nextApproach;
  setGreen(nextApproach, true);                            // safe to go
}`,
      explain: [
        { ref: 'if (tGreen < G_MIN) return false;             // never below minimum green', txt: 'A green can never be terminated before its minimum — a safety rule the adaptive logic cannot override.' },
        { ref: 'return !arriving;                              // gap-out when approach clears', txt: 'Within the safe band, the green ends when the approach clears (no more vehicles arriving), so no time is wasted on an empty movement.' },
        { ref: 'setAmber(...); safeDelay(T_AMBER); ... allRed(); safeDelay(T_ALLRED)', txt: 'Every phase change runs the mandatory amber and all-red clearance, fixed by safety and never shortened by demand.' },
        { ref: 'if (!conflictClear()) { failSafe(); return; }', txt: 'Before any new green, an independent conflict check must confirm no conflict; if it cannot, the intersection fails safe rather than risk conflicting greens.' },
      ],
    } },
    { h: 'Allocate to demand, and fail safe', p: [
      'Choose the next green for the approach with the most waiting demand, and on any fault/watchdog/conflict drop to flashing red/amber or a safe fixed mode.',
    ], tip: 'Keep the safety logic (min green, clearance, conflict monitor, fail-safe) independent of the adaptive logic, so no adaptation bug can ever produce an unsafe state.' },
  ],

  code: [{
    file: 'adaptive-traffic-signal.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Adaptive Traffic Signal — ESP32 (EDUCATIONAL DEMONSTRATION)

   Adapts green timing to sensed demand per approach, strictly within
   safety rules: minimum green, mandatory amber/all-red clearance, never
   conflicting greens, and fail-safe on fault. NOT a certified traffic
   controller — real signals need certified equipment and approval.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>

#define NAPP 4
#define G_MIN 7000UL
#define G_MAX 45000UL
#define T_AMBER 3000UL
#define T_ALLRED 2000UL

const int detPin[NAPP] = {34,35,32,33};
int currentApproach = 0; uint32_t greenStart = 0;
WiFiClient net; PubSubClient mqtt(net);

int demand(int a){ /* count/queue on approach a (loops/radar/camera) */
  return readDemand(detPin[a]); }
bool arriving(int a){ return demand(a) > 0; }

// Independent safety checks (kept separate from adaptive logic).
bool conflictClear(){ return conflictMonitorOK(); }   // certified in reality
void failSafe(){ flashingRedAmber(); }                 // safe state on fault

void setPhase(int a){ /* set greens/reds so ONLY approach a is green */ }
void amber(int a){ /* amber for approach a */ }
void allRed(){ /* all red */ }

void toNextPhase(int next){
  amber(currentApproach); delay(T_AMBER);       // mandatory amber
  allRed(); delay(T_ALLRED);                     // mandatory all-red clearance
  if (!conflictClear()){ failSafe(); return; }   // never conflicting greens
  currentApproach = next; greenStart = millis();
  setPhase(next);
}

int busiestApproach(){
  int best=currentApproach, bestD=-1;
  for(int a=0;a<NAPP;a++){ if(a==currentApproach) continue;
    int d=demand(a); if(d>bestD){bestD=d;best=a;} }
  return best;
}

void setup(){
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  if(!conflictClear()){ failSafe(); return; }
  currentApproach=0; greenStart=millis(); setPhase(0);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("sig-1");
  mqtt.loop();

  if(!conflictClear()){ failSafe(); return; }    // fault -> safe, always

  uint32_t tGreen = millis() - greenStart;
  bool end = false;
  if (tGreen >= G_MIN){                           // never below min green
    if (tGreen >= G_MAX) end = true;              // fairness cap
    else if (!arriving(currentApproach)) end = true;  // gap-out (adaptive)
  }
  if (end) toNextPhase(busiestApproach());        // give green to demand

  static uint32_t last=0;
  if (millis()-last>1000){ last=millis();
    char m[160]; int n=snprintf(m,sizeof m,
      "{\\"green\\":%d,\\"t\\":%lu,\\"demand\\":[",currentApproach,tGreen);
    for(int a=0;a<NAPP;a++) n+=snprintf(m+n,sizeof m-n,"%d%s",demand(a),a<NAPP-1?",":"");
    snprintf(m+n,sizeof m-n,"]}");
    mqtt.publish("signal/1/status", m);
  }
}`,
    explain: [
      { ref: 'if(!conflictClear()){ failSafe(); return; }    // fault -> safe, always', txt: 'On every loop, an independent conflict/fault check can force the intersection to a safe (flashing) state — safety has absolute veto over the adaptive logic.' },
      { ref: 'if (tGreen >= G_MIN){                           // never below min green', txt: 'A green is only ever ended after its minimum duration, an inviolable safety rule.' },
      { ref: 'else if (!arriving(currentApproach)) end = true;  // gap-out (adaptive)', txt: 'Within the safe band, the green ends when the approach clears — the adaptive efficiency gain of not wasting green on empty movements.' },
      { ref: 'void toNextPhase(int next)', txt: 'Every phase change runs mandatory amber and all-red clearance and re-checks for conflicts before any new green — the safety envelope the adaptation lives inside.' },
      { ref: 'if (end) toNextPhase(busiestApproach())', txt: 'The next green is allocated to the approach with the most waiting demand — matching capacity to real traffic while obeying every safety rule.' },
    ],
  }],

  config: [
    'Set minimum/maximum green, and the mandatory amber/all-red clearance times per safety requirements.',
    'Configure per-approach demand sensing and the conflict-monitor/fail-safe behaviour.',
    'Set the allocation policy (busiest approach) within the safety band.',
    'Understand and respect the scope: educational, not a certified controller.',
  ],
  calibration: [
    { h: 'Safety timings', p: [
      'Set minimum green and the fixed clearance intervals per safety standards; verify they are never violated by adaptation.',
    ] },
    { h: 'Demand sensing', p: [
      'Confirm per-approach detection reliably reflects demand (extend/gap-out behave).',
    ] },
    { h: 'Fail-safe', p: [
      'Verify any fault/conflict drops to flashing/safe mode; test the independent conflict check.',
    ] },
  ],
  testing: [
    { step: 'Heavy demand on one approach', expect: 'Its green extends (up to max); busy approach favoured' },
    { step: 'Approach clears mid-green', expect: 'Green gaps-out after minimum — no wasted green' },
    { step: 'Demand below minimum-green time', expect: 'Green still held for minimum (safety)' },
    { step: 'Force a conflict (test)', expect: 'Fails safe to flashing; no conflicting greens' },
    { step: 'Simulate a fault/watchdog', expect: 'Drops to safe state' },
    { step: 'Compare to fixed-time', expect: 'Less delay/queuing under variable demand (simulation)' },
  ],
  output: [
    'The demo/dashboard shows the current phase, timing, per-approach demand, and any fail-safe events; adaptation is visibly subordinate to the safety rules.',
    { file: 'signal.json', lang: 'json', body: `{
  "green": 0,
  "t": 21000,
  "demand": [3, 0, 5, 1]
}` },
    'Approach 0 has green (21 s in) but approach 2 has the most waiting demand — so after minimum green and gap-out (and full clearance), green passes to approach 2; any fault would instead force a safe flashing state.',
  ],
  troubleshoot: [
    { sym: 'Green ends too soon', cause: 'Minimum green not enforced', fix: 'Never terminate below G_MIN; enforce it independently of adaptation' },
    { sym: 'Wasted green on empty approach', cause: 'No gap-out', fix: 'Terminate green (after min) when the approach clears' },
    { sym: 'Conflicting greens risk', cause: 'Safety not independent', fix: 'Use an independent conflict monitor; never allow conflicting greens; fail safe' },
    { sym: 'Unsafe state on fault', cause: 'No fail-safe', fix: 'Drop to flashing red/amber or safe fixed mode on any fault/watchdog/conflict' },
    { sym: 'Treated as a real controller', cause: 'Scope misunderstanding', fix: 'This is educational; real signals need certified equipment, conflict monitors and approval' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → traffic management (demo)',
    net: {
      nodes: [{ name: 'Signal controller', sub: 'ESP32 (demo)' }, { name: 'Detectors', sub: 'per approach' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to management',
      uplink: 'MQTT', cloud: 'Traffic dashboard', cloudSub: 'phase/demand',
      clients: [{ name: 'Dashboard', sub: 'timing/demand' }, { name: 'Study', sub: 'congestion' }],
    },
    protocol: ['Phase, timing and per-approach demand publish for monitoring/study; safety (min green, clearance, conflict monitor, fail-safe) is local and independent of any network.'],
    topics: [
      { t: 'signal/1/status', dir: 'controller → dashboard', payload: 'phase, timing, demand' },
      { t: 'signal/1/event', dir: 'controller → ops', payload: 'fail-safe / fault' },
      { t: 'signal/corridor', dir: 'management → controllers', payload: 'coordination (concept)' },
    ],
    cloud: ['A dashboard shows phase/demand for study and coordination concepts; safety-critical control always runs locally and independently, never dependent on the network.'],
    dashboard: ['Phase and timing, per-approach demand, and fail-safe/fault events; congestion comparison in study.'],
    mobile: ['Fault/fail-safe notifications (for the demo/study).'],
    security: [
      'Safety logic (min green, clearance, conflict monitor, fail-safe) is local and independent of the network.',
      'Never let a network command override safety.',
      'This is educational; real signals require certified equipment and approval.',
    ],
  },

  perf: [
    'Run the control loop deterministically; safety timings must be exact.',
    'Keep safety logic independent of adaptive logic and of the network.',
    'Adapt only within [G_MIN, G_MAX] and after full clearance.',
    'Fail safe fast on any fault/conflict.',
  ],
  safety: [
    'Traffic signals are SAFETY-CRITICAL and standards-governed. This is an educational demonstration, NOT a certified controller — real deployment requires certified equipment, certified conflict monitors and regulatory approval.',
    'Inviolable: minimum green, mandatory amber/all-red clearance, and never conflicting greens.',
    'Fail safe on any fault/watchdog/conflict — flashing red/amber or safe fixed mode, never a dangerous state.',
    'Keep safety logic independent so adaptation can never produce an unsafe state.',
  ],
  maintenance: [
    'Verify safety timings and fail-safe/conflict behaviour regularly.',
    'Check demand sensing reliability.',
    'Never remove or weaken the safety envelope.',
    'Keep the educational scope clear.',
  ],
  future: [
    'Add corridor coordination (green waves) within safety.',
    'Add pedestrian/priority (transit/emergency) phases safely.',
    'Add camera/AI demand sensing.',
    'Study/simulate congestion benefit rigorously.',
  ],
  faq: [
    { q: 'How does it reduce congestion?', a: 'By matching green time to real demand — extending green for a busy approach, ending green early when an approach clears, and giving the next green to the busiest waiting approach — instead of a fixed plan that wastes green on empty movements.' },
    { q: 'How is safety guaranteed?', a: 'By an inviolable envelope: minimum green times, mandatory amber and all-red clearance intervals (fixed by safety, never shortened), never displaying conflicting greens (enforced by an independent conflict monitor in real systems), and failing safe on any fault. Adaptation may only operate within these.' },
    { q: 'Can I put this on a real intersection?', a: 'No. This is an educational demonstration of the adaptive-timing idea. Real traffic signals are safety-critical and require certified controllers, certified conflict monitors and regulatory approval — a homebrew controller must never control live traffic.' },
    { q: 'What happens if something faults?', a: 'It fails safe — dropping to flashing red/amber (stop/give-way) or a known-safe fixed mode. It must never go dark or produce a dangerous state.' },
    { q: 'Why keep safety logic separate from the adaptive logic?', a: 'So that no bug or extreme in the adaptation can ever violate a safety rule. The adaptive logic proposes timings; the independent safety logic has absolute veto.' },
  ],
  refs: [
    { t: 'Traffic signal control', u: 'https://en.wikipedia.org/wiki/Traffic_light_control_and_coordination', s: 'Reference' },
    { t: 'Adaptive/actuated signal control', u: 'https://en.wikipedia.org/wiki/Adaptive_traffic_control_system', s: 'Reference' },
    { t: 'Signal clearance intervals (amber/all-red)', u: 'https://en.wikipedia.org/wiki/Traffic_light', s: 'Reference' },
    { t: 'Conflict monitor / malfunction management unit', u: 'https://en.wikipedia.org/wiki/Traffic_controller', s: 'Reference' },
    { t: 'Traffic-control standards (e.g. MUTCD)', u: 'https://en.wikipedia.org/wiki/Manual_on_Uniform_Traffic_Control_Devices', s: 'Reference' },
  ],
  images: ['traffic', 'esp32', 'city'],
  imageCaptions: [
    'Adaptive signals match green time to the traffic actually present, easing congestion.',
    'ESP32 module adapting phase timing within an inviolable safety envelope.',
    'Safety first: minimum green, mandatory clearance, no conflicting greens, and fail-safe — this is an educational demonstration, not a certified controller.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   080 — Public Transit Tracker
   ══════════════════════════════════════════════════════════════════ */
{
  id: '080',
  domainKey: 'iot',
  emoji: '🚌', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Puts a GPS tracker on each bus and a live-ETA display at each stop, so riders see where their bus actually is and when it will arrive — the single thing that most improves the wait.',

  overview: [
    'The worst part of public transport is not the ride — it is the <b>uncertain wait</b>. Standing at a stop with no idea whether the bus left five minutes ago or is fifteen minutes away is stressful and drives people to other transport. The fix is remarkably effective and simple: show riders where their bus <i>actually is</i> and when it will <i>actually arrive</i>. Real-time arrival information is repeatedly found to be the single improvement that most increases rider satisfaction and even ridership — not because the buses run faster, but because the wait becomes <b>known</b>. This project builds that system: a GPS tracker on each bus and a live-ETA display (and app data) at each stop.',
    'On the vehicle side, a GPS tracker on each bus reports its position (and speed) over cellular or LoRa. On the server side, that live position is combined with the route to compute an <b>ETA</b> for each downstream stop — how long until this bus reaches you — accounting for distance along the route and typical or current travel speed. On the rider side, that ETA is shown on a beacon/display at the stop ("Route 12: 4 min") and in an app/map, so a rider knows whether to hurry, wait, or find another option, and can even watch the bus approach on a map.',
    'The value is entirely in <b>reducing uncertainty</b>. A known wait feels far shorter than an unknown one, riders can use their time instead of anxiously watching the road, and missed buses drop. It also gives the operator a live fleet view for management. The design is honest that ETA is a <b>prediction</b> — traffic, dwell time at stops and incidents make it uncertain, so it must be presented as an estimate that updates, and it improves with better modelling — and that reliable coverage (GPS fix, cellular/LoRa) matters. But as a tracker-plus-ETA system, it delivers the improvement that public-transit riders value most: turning the anxious, uncertain wait at a stop into a known, manageable one.',
  ],
  does: [
    'Tracks each bus\'s live GPS position and speed',
    'Reports position over cellular or LoRa',
    'Computes an arrival ETA for each downstream stop',
    'Shows live ETA at stop displays and in an app/map',
    'Lets riders see where the bus is and when it will arrive',
    'Gives the operator a live fleet-management view',
    'Presents ETA honestly as an updating estimate',
  ],
  features: [
    'Per-bus GPS tracking',
    'Route-aware ETA computation',
    'Stop-side live-ETA displays + app/map',
    'Reduced wait uncertainty (the key benefit)',
    'Live fleet management',
    'Cellular/LoRa reporting',
    'Honest ETA as an updating prediction',
  ],
  applications: [
    { t: 'Bus arrival information', d: 'Live ETAs at stops and in an app to reduce wait uncertainty.' },
    { t: 'Fleet management', d: 'Live vehicle positions for operations and scheduling.' },
    { t: 'Campus / shuttle services', d: 'Tracking and ETAs for shuttles and staff transport.' },
    { t: 'Paratransit / on-demand', d: 'Live vehicle location and arrival prediction for riders.' },
  ],
  skills: [
    'GPS tracking and reporting',
    'Route-aware ETA computation',
    'Stop-side display and app/map integration',
    'Cellular/LoRa telemetry',
    'Presenting predictions honestly',
  ],
  prereq: [
    'The key benefit is reducing wait UNCERTAINTY — accurate, updating ETAs matter more than raw speed.',
    'ETA is a prediction (traffic, dwell, incidents) — present it as an updating estimate, not a guarantee.',
    'Reliable GPS fix and cellular/LoRa coverage are needed for good tracking.',
    'ETA improves with route knowledge and better travel-time modelling.',
  ],

  parts: ['esp32', 'neo6m', 'sim800', 'lora', 'oled', 'li18650', 'tp4056'],
  extraParts: [
    { name: 'GPS module + antenna (on-bus)', spec: 'GPS with a good sky-view antenna on each bus', qty: 1, price: 400 },
    { name: 'Cellular/LoRa modem', spec: 'Cellular for wide coverage, or LoRa where a network exists', qty: 1, price: 900 },
    { name: 'Stop display/beacon', spec: 'Display at the stop showing live ETAs', qty: 1, price: 2000, note: 'Or rely on the app for stops without displays' },
    { name: 'Vehicle power/enclosure', spec: 'Powered from the bus, rugged enclosure', qty: 1, price: 300 },
  ],
  cost: '₹2,000 – ₹4,000 per bus (+ displays)',
  libs: ['wifi', 'pubsub', 'tinygps', 'lorolib', 'ssd1306', 'ntp', 'arduinojson'],

  pins: {
    left: [
      { dev: 'GPS (on-bus)', devPin: 'TX/RX', pin: 'GPIO 16/17', sig: 'Position/speed (NMEA)' },
    ],
    right: [
      { dev: 'Cellular/LoRa', devPin: 'bus', pin: 'UART/SPI', sig: 'Position report' },
      { dev: 'Stop display', devPin: 'I²C/SPI', pin: '—', sig: 'ETA at stop' },
      { dev: 'Bus power', devPin: '+/–', pin: '3V3 reg', sig: 'Supply' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Fix/report' },
    ],
  },
  wiringNotes: [
    'Fit the GPS with a good sky-view antenna on each bus for a reliable fix; power from the bus supply.',
    'Report position over cellular (wide coverage) or LoRa (where a network exists) at a sensible rate.',
    'Compute ETAs on the server from position + route; drive stop displays and app/map from there.',
    'Present ETA as an updating estimate; handle a lost fix/coverage gracefully.',
    'Rugged, vehicle-powered enclosure for the on-bus unit.',
  ],

  block: { columns: [
    { label: 'On the bus', edge: 'right', blocks: [
      { name: 'GPS', sub: 'position/speed', highlight: true },
      { name: 'Modem', sub: 'cellular/LoRa' },
    ] },
    { label: 'Server', edge: 'right', blocks: [
      { name: 'Route + position', sub: 'progress' },
      { name: 'ETA', sub: 'per stop' },
    ] },
    { label: 'Riders', edge: 'right', blocks: [
      { name: 'Stop display', sub: 'live ETA', highlight: true },
      { name: 'App/map', sub: 'watch it come' },
    ] },
    { label: 'Operator', edge: 'none', blocks: [
      { name: 'Fleet view', sub: 'live positions' },
    ] },
  ] },
  flow: [
    { t: 'Bus: get GPS fix', k: 'start' },
    { t: 'Report position/speed', k: 'io' },
    { t: 'Server: locate on route', k: 'proc' },
    { t: 'Compute ETA per downstream stop', k: 'proc' },
    { t: 'Update stop displays + app', k: 'io' },
    { t: 'Rider sees where + when', k: 'end', back: 'Bus: get GPS fix' },
  ],

  principle: [
    'The insight driving this project is that the biggest pain of public transport is <b>uncertainty at the stop</b>, not the journey time itself, and that resolving that uncertainty is disproportionately valuable. Research on transit consistently finds that real-time arrival information is among the most effective improvements an operator can make — it raises satisfaction and even ridership — because a <b>known</b> wait is psychologically far shorter and less stressful than an unknown one. You do not have to make the buses faster; you have to make the wait <b>predictable</b>. Everything the system does serves that single goal: tell the rider where the bus is and when it will arrive.',
    'The mechanism is a three-part pipeline. On the <b>vehicle</b>, a GPS tracker reports each bus\'s live position (and speed) over cellular or LoRa. On the <b>server</b>, that position is placed onto the bus\'s <b>route</b> — matching it to how far along the route the bus is — and an <b>ETA</b> is computed for each downstream stop from the remaining distance and an estimate of travel speed (from current speed, historical travel times for that segment and time of day). On the <b>rider</b> side, that ETA is surfaced where it matters: a display at the stop ("Route 12: 4 min") and an app/map where the rider can watch the bus approach. The tighter and more accurate this loop, the more the wait-uncertainty shrinks.',
    'The honest core of the design is that ETA is a <b>prediction, not a promise</b>. Real travel time is buffeted by traffic, by variable <b>dwell time</b> at each stop (boarding, alighting), by signals and incidents — so any single ETA carries uncertainty, and the right way to present it is as an <b>estimate that continuously updates</b> as new positions arrive, so a rider sees "4 min" become "3 min" as the bus really approaches. A good system communicates this honestly (an updating countdown, not a false-precision guarantee) and improves the prediction with better modelling (segment histories, live traffic, dwell patterns). Over-promising a precise arrival that then slips does more harm than a slightly softer estimate that proves reliable.',
    'Two further points complete the picture. Reliable operation depends on <b>coverage</b>: a good GPS fix (sky-view antenna) and dependable cellular/LoRa reporting, with graceful handling of a lost fix or a coverage gap (fall back to the last known position and a wider ETA rather than showing nothing or something wrong). And the same live position stream gives the <b>operator</b> a real-time fleet view for management — bunching, delays, and schedule adherence become visible. The design is candid about its dependencies and the predictive nature of ETAs, but the value proposition is strong and well-proven: by tracking each bus and turning that into a live, honest, updating arrival estimate at every stop and in the app, it delivers the improvement transit riders value most — converting the anxious, open-ended wait at a bus stop into a known, manageable one.',
  ],
  equations: [
    { t: 'Position on route', eq: 'Map the GPS fix to route progress:\n\n  s = distance along the route to the bus\n     (nearest-point projection of the fix onto the route)\n\nGives how far the bus is from each downstream stop.' },
    { t: 'ETA to a stop', eq: 'For a downstream stop at route distance s_stop:\n\n  remaining = s_stop − s\n  ETA ≈ remaining / v_est + dwell_ahead\n\nv_est from current speed + historical segment speed (time of\nday); dwell_ahead = expected stop dwell before the rider.' },
    { t: 'Updating estimate', eq: 'ETA is a prediction, not a promise:\n  recompute on each new position; show a countdown that\n  updates (4 → 3 → 2 min).\n  widen ETA / show \"approx\" when uncertainty is high or on a\n  lost fix (fall back to last-known position).' },
  ],

  assembly: [
    { h: 'Fit the on-bus tracker', p: [
      'Install GPS with a sky-view antenna and a cellular/LoRa modem on each bus, powered from the bus, reporting position/speed at a sensible rate.',
    ] },
    { h: 'Set up route matching and ETA', p: [
      'On the server, match each bus\'s position to its route and compute per-stop ETAs from remaining distance and estimated travel speed (with dwell).',
    ] },
    { h: 'Surface ETAs to riders and the operator', p: [
      'Drive stop displays and app/map with live, updating ETAs, and provide a fleet-management view; handle lost fix/coverage gracefully.',
    ], warn: 'ETA is a prediction. Present it as an updating estimate, not a guarantee, and handle a lost fix by falling back to last-known position and a wider estimate.' },
  ],
  steps: [
    { h: 'Track, match and compute ETA', p: [
      'Report bus position, place it on the route, and compute the ETA to each downstream stop, updating as new positions arrive.',
    ], code: {
      file: 'eta.py', lang: 'python',
      body: `# Compute per-stop ETA from a bus's live position on its route.
def route_progress(fix, route):
    # nearest-point projection of the GPS fix onto the route polyline
    return distance_along_route(fix, route)   # metres from route start

def eta_to_stops(bus, route, stops, seg_speed):
    s = route_progress(bus.fix, route)
    v = max(bus.speed, 1.0)                    # current speed (m/s), floored
    etas = {}
    for stop in stops:
        if stop.s <= s:                        # already passed
            continue
        remaining = stop.s - s
        # blend current speed with historical segment speed for robustness
        v_est = 0.5*v + 0.5*seg_speed(stop.segment, now())
        dwell = expected_dwell_before(stop)
        etas[stop.id] = remaining / v_est + dwell   # seconds
    return etas                                # present as UPDATING estimates`,
      explain: [
        { ref: 'def route_progress(fix, route)', txt: 'Projects the GPS fix onto the route to find how far along the route the bus is — the basis for the remaining distance to each stop.' },
        { ref: 'v_est = 0.5*v + 0.5*seg_speed(stop.segment, now())', txt: 'The ETA blends the bus\'s current speed with the historical speed for that segment and time of day, making the estimate more robust than instantaneous speed alone.' },
        { ref: 'dwell = expected_dwell_before(stop)', txt: 'Expected stop dwell time ahead is added, since boarding/alighting delays are a real part of arrival time.' },
        { ref: 'return etas                                # present as UPDATING estimates', txt: 'The ETAs are estimates to be shown as an updating countdown, recomputed on each new position — a prediction, not a promise.' },
      ],
    } },
    { h: 'Display and handle uncertainty', p: [
      'Show updating ETAs at stops and in the app, watch the bus on a map, and degrade gracefully (last-known position, wider ETA) on a lost fix or coverage gap.',
    ], tip: 'An honest countdown that updates ("4 → 3 → 2 min") builds trust; a precise time that slips destroys it. Communicate uncertainty when it is high.' },
  ],

  code: [{
    file: 'transit-tracker.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Public Transit Tracker (on-bus) — ESP32 + GPS, cellular/LoRa

   Reports each bus's live position/speed; the server computes per-stop
   ETAs and drives stop displays and the app. The key benefit is
   reducing wait uncertainty — ETA is an updating estimate.
   ══════════════════════════════════════════════════════════════════ */

#include <TinyGPS++.h>

#define GPS_RX 16
#define GPS_TX 17
#define BUS_ID 12
#define ROUTE_ID 12
#define REPORT_MS 5000        // report every 5 s (tune for coverage/cost)

TinyGPSPlus gps; HardwareSerial gpsSer(1);
uint32_t lastReport=0;

void reportPosition(double lat, double lon, double kmh){
  char m[160];
  snprintf(m,sizeof m,
    "{\\"bus\\":%d,\\"route\\":%d,\\"lat\\":%.6f,\\"lon\\":%.6f,\\"kmh\\":%.1f}",
    BUS_ID, ROUTE_ID, lat, lon, kmh);
  sendOverModem("transit/bus/position", m);   // cellular/LoRa to server
}

void setup(){
  Serial.begin(115200);
  gpsSer.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);
}

void loop(){
  while (gpsSer.available()) gps.encode(gpsSer.read());

  if (millis()-lastReport >= REPORT_MS){
    lastReport = millis();
    if (gps.location.isValid() && gps.location.age() < 5000){
      reportPosition(gps.location.lat(), gps.location.lng(),
                     gps.speed.isValid()? gps.speed.kmph() : 0);
    } else {
      // lost fix: report status so the server shows last-known + wider ETA
      sendOverModem("transit/bus/status", "{\\"bus\\":12,\\"fix\\":false}");
    }
  }
}`,
    explain: [
      { ref: 'if (gps.location.isValid() && gps.location.age() < 5000)', txt: 'Only a fresh, valid GPS fix is reported, so the server\'s ETA is based on a real current position.' },
      { ref: 'reportPosition(gps.location.lat(), gps.location.lng(), ... kmph())', txt: 'The bus reports its position and speed, which the server places on the route to compute per-stop ETAs.' },
      { ref: 'sendOverModem("transit/bus/status", "{\\"bus\\":12,\\"fix\\":false}")', txt: 'On a lost fix the bus reports its status, so the server can fall back to the last-known position and a wider estimate rather than showing something wrong.' },
      { ref: '#define REPORT_MS 5000', txt: 'A few-second reporting rate keeps the map and ETAs live while balancing cellular data cost and coverage.' },
    ],
  }],

  config: [
    'Configure per-bus GPS/modem and the report rate (coverage/cost).',
    'Set up route data and per-stop distances for ETA on the server.',
    'Configure the travel-speed/dwell model and lost-fix handling.',
    'Configure stop displays and app/map, and the fleet view.',
  ],
  calibration: [
    { h: 'GPS/coverage', p: [
      'Verify a reliable fix and reporting across the route; handle known coverage gaps.',
    ] },
    { h: 'ETA model', p: [
      'Compare predicted ETAs to actual arrivals; tune the segment-speed/dwell model to reduce error.',
    ] },
    { h: 'Presentation', p: [
      'Confirm the ETA updates smoothly (countdown) and communicates uncertainty when high.',
    ] },
  ],
  testing: [
    { step: 'Drive the route', expect: 'Position reported; bus visible on the map' },
    { step: 'Check a downstream stop', expect: 'ETA shown and counts down as the bus approaches' },
    { step: 'Hit traffic/dwell', expect: 'ETA updates upward honestly, not a false precise time' },
    { step: 'Lose GPS in a tunnel', expect: 'Falls back to last-known + wider ETA gracefully' },
    { step: 'Compare ETA to actual arrival', expect: 'Reasonable accuracy; improves with modelling' },
    { step: 'Operator view', expect: 'Live fleet positions for management' },
  ],
  output: [
    'Stop displays and the app show live ETAs ("Route 12: 4 min") and the bus on a map; the operator sees live fleet positions.',
    { file: 'bus-position.json', lang: 'json', body: `{
  "bus": 12,
  "route": 12,
  "lat": 28.61390,
  "lon": 77.20900,
  "kmh": 22.0
}` },
    'A live bus position that the server turns into "Route 12: 4 min" at the next stops — turning an anxious, open-ended wait into a known one; a lost fix falls back to last-known position with a wider estimate.',
  ],
  troubleshoot: [
    { sym: 'ETA often wrong', cause: 'Instantaneous speed only / no dwell model', fix: 'Blend historical segment speed and time-of-day; add dwell; present as updating estimate' },
    { sym: 'Bus disappears', cause: 'Lost fix/coverage without fallback', fix: 'Fall back to last-known position and a wider ETA; report fix status' },
    { sym: 'Riders distrust ETAs', cause: 'False-precision that slips', fix: 'Show an updating countdown; communicate uncertainty; do not over-promise' },
    { sym: 'Poor fix', cause: 'Antenna placement', fix: 'Sky-view antenna; verify coverage along the route' },
    { sym: 'High data cost', cause: 'Reporting too often', fix: 'Tune the report rate; report on movement; use LoRa where available' },
  ],

  iot: {
    protoShort: 'Cellular/LoRa → transit server → stops/app',
    net: {
      nodes: [{ name: 'On-bus tracker', sub: 'ESP32+GPS' }, { name: 'Fleet', sub: 'all buses' }],
      protocol: 'Cellular / LoRa', gateway: 'Carrier/GW', gatewaySub: 'to server',
      uplink: 'MQTT/HTTPS', cloud: 'Transit server', cloudSub: 'position → ETA',
      clients: [{ name: 'Stop displays', sub: 'ETA' }, { name: 'App/map', sub: 'riders' }],
    },
    protocol: ['Buses report position/speed every few seconds; the server computes per-stop ETAs and pushes them to displays and the app, updating as positions arrive.'],
    topics: [
      { t: 'transit/bus/position', dir: 'bus → server', payload: 'bus, route, lat/lon, speed' },
      { t: 'transit/stop/<id>/eta', dir: 'server → display/app', payload: 'route ETAs (updating)' },
      { t: 'transit/fleet/status', dir: 'server → operator', payload: 'live fleet positions' },
    ],
    cloud: ['A transit server matches positions to routes, computes and updates ETAs, drives stop displays and the app/map, and gives the operator a live fleet view.'],
    dashboard: ['A live map of buses, per-stop ETAs, schedule adherence/bunching, and coverage/fix health.'],
    mobile: ['Rider app with live bus map and updating ETAs; notifications for a chosen stop/route.'],
    security: [
      'Authenticate bus reports so positions/ETAs are trustworthy.',
      'Present ETAs as updating estimates; handle lost fix gracefully.',
      'Protect any rider data appropriately.',
    ],
  },

  perf: [
    'Report position every few seconds (tune for coverage/cost); report on movement.',
    'Compute ETAs on the server with a robust speed/dwell model; update on each position.',
    'Handle lost fix/coverage gracefully with last-known + wider ETA.',
    'Present updating countdowns to build trust.',
  ],
  safety: [
    'Install the on-bus unit safely and powered from the bus without interfering with vehicle systems.',
    'ETA is a prediction — present it honestly as an updating estimate, not a guarantee.',
    'Handle lost fix/coverage gracefully rather than mislead riders.',
    'Protect rider/operator data appropriately.',
  ],
  maintenance: [
    'Verify GPS fix/coverage and reporting across routes.',
    'Tune the ETA model against actual arrivals.',
    'Maintain stop displays and app data.',
    'Monitor fleet health and coverage gaps.',
  ],
  future: [
    'Add live-traffic and richer dwell modelling for better ETAs.',
    'Add GTFS-Realtime feeds for standard app integration.',
    'Add occupancy/crowding info.',
    'Add predictive bunching alerts for operations.',
  ],
  faq: [
    { q: 'Why is this so valuable if it doesn\'t make buses faster?', a: 'Because the worst part of transit is the uncertain wait, and a known wait feels far shorter and less stressful than an unknown one. Real-time arrival information is repeatedly found to be the single improvement that most raises rider satisfaction — and even ridership.' },
    { q: 'How is the ETA computed?', a: 'The bus\'s live GPS position is placed on its route to find the remaining distance to each stop, then divided by an estimated travel speed (blending current speed with historical segment speed and time of day) plus expected stop dwell.' },
    { q: 'How accurate is the ETA?', a: 'It is a prediction affected by traffic, dwell and incidents, so it carries uncertainty. It is presented as an updating estimate (a countdown), improves with better modelling, and should communicate uncertainty rather than over-promise.' },
    { q: 'What happens when the bus loses GPS?', a: 'It falls back to the last-known position and a wider estimate, and reports its fix status, so riders see something sensible rather than the bus vanishing or a wrong ETA.' },
    { q: 'What does the operator get?', a: 'A live fleet view — where every bus is, schedule adherence, bunching — useful for real-time management on top of the rider-facing information.' },
  ],
  refs: [
    { t: 'Real-time passenger information', u: 'https://en.wikipedia.org/wiki/Real-time_passenger_information', s: 'Reference' },
    { t: 'Automatic vehicle location (AVL)', u: 'https://en.wikipedia.org/wiki/Automatic_vehicle_location', s: 'Reference' },
    { t: 'GTFS-Realtime feeds', u: 'https://gtfs.org/realtime/', s: 'Reference' },
    { t: 'Transit ETA prediction', u: 'https://en.wikipedia.org/wiki/Arrival_time', s: 'Reference' },
    { t: 'Perceived vs actual wait time', u: 'https://en.wikipedia.org/wiki/Public_transport', s: 'Reference' },
  ],
  images: ['gps', 'city', 'esp32'],
  imageCaptions: [
    'Live bus tracking and ETAs turn the anxious, uncertain wait at a stop into a known one.',
    'An on-bus GPS tracker reports position; the server computes per-stop ETAs.',
    'Stop displays and an app show riders where the bus is and when it will arrive.',
  ],
},

];
