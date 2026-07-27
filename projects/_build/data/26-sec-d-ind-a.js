/* Security 057–058 + Industrial 059. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   057 — Asset GPS Tracker
   ══════════════════════════════════════════════════════════════════ */
{
  id: '057',
  domainKey: 'iot',
  emoji: '📍', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Tracks high-value equipment, wakes on movement, and raises an instant alert the moment an asset leaves its safe zone — all while sipping enough power to last weeks between charges.',

  overview: [
    'High-value equipment — generators, tools, plant machinery, trailers, medical devices — walks off, and by the time anyone notices it is missing, it is long gone. A GPS tracker attached to the asset closes that gap: it knows where the asset is, and — more usefully — it knows when the asset <b>leaves where it is supposed to be</b> and shouts about it immediately. This project builds a practical asset tracker centred on the two things that make such a device actually useful in the field: <b>geofencing</b> (an instant alert when the asset crosses out of a defined safe zone) and <b>power endurance</b> (lasting weeks or months on a battery, because a tracker you have to recharge every day will be flat when it matters).',
    'Those two goals pull against each other, and resolving that tension is the core of the design. GPS and cellular are power-hungry; leaving them on continuously would flatten the battery in a day. The trick is that a stationary asset does not need tracking — so the tracker spends almost all its time in deep sleep, watching only a tiny <b>accelerometer</b> that wakes it the instant the asset actually moves. While parked, it costs almost nothing; when it moves, it wakes, gets a fix, checks the geofence, reports if needed, and goes back to sleep. This "sleep until moved" architecture is what turns a power-hungry radio stack into a device that lasts weeks.',
    'When it does report, it reports over a network suited to the range: <b>cellular</b> (GSM/LTE-M) for go-anywhere coverage, or LoRa where a private gateway exists and running costs must be near zero. Every position and every geofence breach is logged and pushed, so an asset crossing its boundary triggers an immediate located alert while normal movement within the zone is handled quietly. The design is honest about the physics — GPS needs sky view and struggles indoors and in urban canyons, cellular has running costs and coverage gaps, and there is always a tension between how often you report and how long the battery lasts — and it manages those trade-offs deliberately rather than pretending them away. But as a wake-on-motion, geofenced, long-endurance tracker, it does exactly what asset protection needs: it stays quiet and alive for weeks, and the moment your equipment moves somewhere it should not, you know.',
  ],
  does: [
    'Reports the asset\'s GPS location on movement or on a schedule',
    'Wakes from deep sleep on motion via an accelerometer (sleep-until-moved)',
    'Raises an instant alert when the asset leaves a defined geofence',
    'Reports over cellular (anywhere) or LoRa (private, low running cost)',
    'Logs positions and breaches; pushes located alerts',
    'Lasts weeks–months on battery by sleeping while the asset is parked',
    'Manages the report-rate vs battery-life trade-off deliberately',
  ],
  features: [
    'Geofencing with instant breach alerts',
    'Wake-on-motion deep-sleep for long battery life',
    'Cellular or LoRa backhaul to suit coverage/cost',
    'Position and breach logging',
    'Adaptive reporting (more often when moving, rarely when still)',
    'Honest handling of GPS/coverage limits',
    'Compact, attachable, long-endurance design',
  ],
  applications: [
    { t: 'Construction / plant equipment', d: 'Tracking generators, compressors and tools across and between sites, with theft alerts when they leave a yard.' },
    { t: 'Trailers / containers / vehicles', d: 'Geofenced tracking of movable assets, alerting on unauthorised movement.' },
    { t: 'Logistics / high-value shipments', d: 'Following valuable cargo and alerting if it deviates from its route/zone.' },
    { t: 'Medical / rental equipment', d: 'Locating expensive portable devices and flagging when they leave a facility.' },
  ],
  skills: [
    'Reading GPS (NMEA) and getting a reliable fix',
    'Wake-on-motion deep sleep with an accelerometer interrupt',
    'Geofence maths (point-in-zone, distance)',
    'Cellular/LoRa backhaul and power budgeting',
    'Balancing report rate against battery life',
  ],
  prereq: [
    'A stationary asset does not need tracking — sleep until motion wakes it, or the battery dies in a day.',
    'GPS needs sky view; expect poor/no fixes indoors, under cover, or in urban canyons, and design around it.',
    'Report rate trades directly against battery life and (on cellular) running cost — choose deliberately.',
    'Attach discreetly and protect the battery; a found, ripped-off tracker protects nothing.',
  ],

  parts: ['esp32', 'neo6m', 'sim800', 'mpu6050', 'li18650', 'tp4056', 'solarpanel'],
  extraParts: [
    { name: 'Cellular modem + SIM (or LoRa)', spec: 'GSM/LTE-M modem + data SIM for anywhere coverage, or LoRa for private low-cost', qty: 1, price: 1200, note: 'LTE-M/NB-IoT is more power-efficient than 2G where available' },
    { name: 'GPS antenna (good sky view)', spec: 'Active GPS antenna positioned for sky visibility on the asset', qty: 1, price: 250 },
    { name: 'Large battery + optional solar', spec: 'High-capacity Li-ion pack; small solar to extend endurance on outdoor assets', qty: 1, price: 700, note: 'Sleep-until-moved makes a big pack last months' },
    { name: 'Discreet rugged enclosure', spec: 'Concealable, weatherproof, hard to spot/remove', qty: 1, price: 400 },
  ],
  cost: '₹3,500 – ₹5,500',
  libs: ['wifi', 'tinygps', 'mpu', 'arduinojson', 'preferences', 'httpclient'],

  pins: {
    left: [
      { dev: 'NEO-6M GPS', devPin: 'TX/RX', pin: 'GPIO 16/17', sig: 'NMEA position (UART)' },
      { dev: 'MPU-6050', devPin: 'SDA/SCL/INT', pin: 'GPIO 21/22/34', sig: 'Motion wake (I²C + INT)' },
      { dev: 'Modem', devPin: 'TX/RX', pin: 'GPIO 26/27', sig: 'Cellular backhaul' },
    ],
    right: [
      { dev: 'LoRa (alt)', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Private low-cost backhaul' },
      { dev: 'Battery sense', devPin: 'ADC', pin: 'GPIO 35', sig: 'Battery level' },
      { dev: 'TP4056 + solar', devPin: 'OUT', pin: '3V3 reg', sig: 'Charge + supply' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Fix/report indicator' },
    ],
  },
  wiringNotes: [
    'Wire the accelerometer\'s interrupt to a deep-sleep wake pin so motion brings the tracker out of sleep with almost no idle power.',
    'Give the GPS a good sky-view antenna placement; GPS is useless without a view of the sky.',
    'Power the cellular modem from a supply that can handle its transmit current spikes without browning out the ESP32.',
    'Sense the battery so low-battery is reported before the tracker dies silently.',
    'Mount discreetly and protect the battery/antenna; a visible tracker is removed, and a shaded antenna does not fix.',
  ],

  block: { columns: [
    { label: 'Watch (asleep)', edge: 'right', blocks: [
      { name: 'Accelerometer', sub: 'motion wake', highlight: true },
    ] },
    { label: 'On movement', edge: 'right', blocks: [
      { name: 'GPS fix', sub: 'NEO-6M' },
      { name: 'ESP32', sub: 'geofence check' },
    ] },
    { label: 'Report', edge: 'right', blocks: [
      { name: 'Cellular/LoRa', sub: 'position + breach' },
    ] },
    { label: 'Owner', edge: 'none', blocks: [
      { name: 'Map', sub: 'location + zones' },
      { name: 'Alert', sub: 'geofence breach' },
    ] },
  ] },
  flow: [
    { t: 'Deep sleep (watch accel)', k: 'start' },
    { t: 'Motion wake or schedule?', k: 'dec', yes: 'Get GPS fix', no: 'Deep sleep (watch accel)' },
    { t: 'Get GPS fix', k: 'proc' },
    { t: 'Outside geofence?', k: 'dec', yes: 'Instant breach alert + report', no: 'Report position (if moving)' },
    { t: 'Instant breach alert + report', k: 'io' },
    { t: 'Report position (if moving)', k: 'io' },
    { t: 'Back to deep sleep', k: 'end', back: 'Deep sleep (watch accel)' },
  ],

  principle: [
    'An asset tracker\'s usefulness hinges on two properties that fight each other: it must <b>report meaningfully</b> (know where the asset is and, crucially, when it leaves where it should be), and it must <b>last</b> (survive weeks or months on a battery, because a dead tracker protects nothing and constant recharging is impractical for equipment left in a yard or a field). GPS receivers and cellular radios are the power villains — each can draw far more than the rest of the system combined — so naive "get a fix and send it every minute" designs flatten a battery in a day. The entire art is delivering the reporting value at a tiny fraction of that power cost.',
    'The resolution is a simple, powerful observation: <b>a stationary asset does not need tracking</b>. Its position is not changing, so acquiring fresh fixes and sending them is pure waste. So the tracker\'s default state is <b>deep sleep</b>, in which the power-hungry GPS and modem are off and the only thing awake is a micro-power <b>accelerometer</b> configured to fire an interrupt on motion. Parked, the whole device costs microamps. The instant the asset moves, the accelerometer wakes the processor, which powers up GPS, gets a fix, checks it, reports if warranted, and returns to sleep. This "sleep-until-moved" architecture is what makes a large battery last for months instead of a day — the expensive work happens only when something is actually happening.',
    'The reporting value comes from <b>geofencing</b>. A raw stream of positions is far less useful than a single, timely alert that says "the asset just left its safe zone". A geofence is a defined area — a circle around a yard, a polygon around a site — and the tracker checks each new fix against it: as long as the asset is inside, movement is logged quietly; the moment a fix falls <i>outside</i>, it fires an immediate breach alert. This is exactly the theft/loss signal an owner cares about, and it is cheap to compute on-device (a point-in-circle is a distance comparison; point-in-polygon is a simple ray-cast). Geofencing also lets the tracker be adaptive: report frequently while the asset is moving or has breached, and rarely (or only on the periodic heartbeat) while it sits safely in its zone.',
    'The remaining design is <b>honest engineering around real limits</b>. GPS needs a view of the sky, so it is unreliable indoors, under dense cover, and in urban canyons — the tracker must tolerate failed fixes (retry, fall back to the last known position, or cell-tower approximation) rather than assume a fix always comes. The backhaul is chosen for the job: <b>cellular</b> (ideally power-efficient LTE-M/NB-IoT) for go-anywhere coverage at some running cost, or <b>LoRa</b> where a private gateway exists and per-message cost must be near zero. And the report rate is understood as a direct trade against battery life and cellular cost, tuned deliberately (frequent when moving, sparse when still) rather than left as an afterthought. Physical design matters too — discreet, rugged mounting so the tracker is not spotted and ripped off, and a protected antenna with sky view. None of these limits are hidden; they are the constraints the design is built around. The result is a tracker that lives quietly for months and, the moment your equipment crosses a line it should not, tells you at once and where.',
  ],
  equations: [
    { t: 'Circular geofence (point-in-circle)', eq: 'Breach if the asset is farther than R from the zone centre.\nHaversine distance between fix (φ1,λ1) and centre (φ2,λ2):\n\n  a = sin²(Δφ/2) + cosφ1·cosφ2·sin²(Δλ/2)\n  d = 2R_earth·atan2(√a, √(1−a))\n\n  breach if d > R_geofence   (with a small hysteresis margin)' },
    { t: 'Wake-on-motion power budget', eq: 'Battery life is set by how rarely the expensive stack runs:\n\n  life ≈ capacity / ( I_sleep + f_move·(E_fix+E_tx)/T )\n\nI_sleep (accel-only, µA) dominates when parked.\nA large battery + sleep-until-moved → weeks/months,\nwhereas always-on GPS+modem → ~a day.' },
    { t: 'Adaptive report rate', eq: 'moving   → report every T_move (e.g. 30–60 s)\nbreached → report immediately + fast until re-secured\nparked   → heartbeat every T_park (e.g. 6–24 h)\n\nRate trades directly against battery life and cellular cost;\ntie it to state (motion + geofence) rather than a fixed timer.' },
  ],

  assembly: [
    { h: 'Wire wake-on-motion sleep', p: [
      'Configure the accelerometer\'s motion interrupt and route it to an ESP32 deep-sleep wake pin, so the device sleeps at microamps and wakes only on movement.',
      'Confirm the GPS and modem are fully powered down during sleep.',
    ], warn: 'If GPS or the modem stays powered during sleep, the battery drains in a day. The whole endurance depends on truly sleeping the power-hungry parts.' },
    { h: 'Fit GPS and backhaul', p: [
      'Place the GPS antenna for sky view; wire the cellular modem (or LoRa) with a supply that tolerates its transmit current spikes. Sense the battery for supervision.',
    ] },
    { h: 'Mount discreetly with protected power', p: [
      'House the tracker in a concealable, rugged enclosure with a large battery (and optional solar for outdoor assets), positioned so the antenna sees the sky but the device is not obvious.',
    ] },
  ],
  steps: [
    { h: 'Check the geofence and decide reporting', p: [
      'On each fix, compute the distance to the geofence and raise a breach alert if outside; otherwise report at the rate set by the current state (moving/parked).',
    ], code: {
      file: 'geofence.ino', lang: 'cpp',
      body: `struct Geofence { double lat, lon; float radius_m; };

// Haversine distance in metres.
double haversine(double la1,double lo1,double la2,double lo2){
  const double R=6371000.0, d2r=M_PI/180.0;
  double dla=(la2-la1)*d2r, dlo=(lo2-lo1)*d2r;
  double a=sin(dla/2)*sin(dla/2)
          +cos(la1*d2r)*cos(la2*d2r)*sin(dlo/2)*sin(dlo/2);
  return 2*R*atan2(sqrt(a),sqrt(1-a));
}

bool outsideGeofence(double lat,double lon,const Geofence &g){
  double d = haversine(lat,lon,g.lat,g.lon);
  return d > g.radius_m + GEO_HYSTERESIS;      // margin avoids edge flapping
}

// Decide report cadence from movement + geofence state.
uint32_t nextReportDelay(bool moving,bool breached){
  if (breached) return 15;                     // fast while lost
  if (moving)   return 45;                      // frequent while moving
  return 6*3600;                                // heartbeat while parked
}`,
      explain: [
        { ref: 'double haversine(', txt: 'Computes the great-circle distance between the fix and the geofence centre, the basis of the point-in-circle breach test.' },
        { ref: 'return d > g.radius_m + GEO_HYSTERESIS', txt: 'A hysteresis margin around the boundary prevents the tracker from flapping in and out of "breach" when a noisy fix sits right on the fence.' },
        { ref: 'if (breached) return 15;', txt: 'Once outside the safe zone the tracker reports fast, so a moving-away asset is followed closely.' },
        { ref: 'return 6*3600;', txt: 'A safely-parked asset only heartbeats every few hours, which is what lets the battery last for months.' },
      ],
    } },
    { h: 'Get a fix robustly and report', p: [
      'Power up GPS on wake, wait for a valid fix with a timeout, and on success check the geofence and report; on a failed fix, fall back to last-known/cell approximation and retry rather than blocking.',
    ], tip: 'Cap the GPS-on time — a device that waits forever for a fix indoors will drain the battery. Time out and try again later.' },
  ],

  code: [{
    file: 'asset-gps-tracker.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Asset GPS Tracker — ESP32, wake-on-motion, geofenced, low-power

   Sleeps at microamps watching an accelerometer; on motion, gets a GPS
   fix, checks the geofence, and reports over cellular/LoRa — raising an
   instant alert on a breach. Adaptive report rate for weeks of life.
   ══════════════════════════════════════════════════════════════════ */

#include <TinyGPS++.h>
#include <Preferences.h>
#include <math.h>

#define GPS_RX 16
#define GPS_TX 17
#define PIN_ACCEL_INT 34    // accelerometer motion interrupt (wake)
#define GPS_TIMEOUT_MS 90000
#define GEO_HYSTERESIS 30.0f

TinyGPSPlus gps;
HardwareSerial gpsSer(1);
Preferences prefs;

struct Geofence { double lat, lon; float radius_m; } fence;
RTC_DATA_ATTR bool wasBreached = false;

double haversine(double la1,double lo1,double la2,double lo2){
  const double R=6371000.0,d2r=M_PI/180.0;
  double dla=(la2-la1)*d2r,dlo=(lo2-lo1)*d2r;
  double a=sin(dla/2)*sin(dla/2)+cos(la1*d2r)*cos(la2*d2r)*sin(dlo/2)*sin(dlo/2);
  return 2*R*atan2(sqrt(a),sqrt(1-a));
}

bool getFix(double &lat,double &lon){
  gpsSer.begin(9600,SERIAL_8N1,GPS_RX,GPS_TX);
  uint32_t t0=millis();
  while(millis()-t0 < GPS_TIMEOUT_MS){        // bounded wait — never forever
    while(gpsSer.available()) gps.encode(gpsSer.read());
    if(gps.location.isValid() && gps.location.age()<2000){
      lat=gps.location.lat(); lon=gps.location.lng();
      return true;
    }
  }
  return false;                                // fall back to last-known
}

void report(double lat,double lon,bool breach,float batt){
  // Send over cellular/LoRa (modem code elided).
  char msg[200];
  snprintf(msg,sizeof msg,
    "{\\"lat\\":%.6f,\\"lon\\":%.6f,\\"breach\\":%d,\\"batt\\":%.2f}",
    lat,lon,breach?1:0,batt);
  sendOverModem("asset/57/pos", msg);
  if (breach) sendOverModem("asset/57/alert", "GEOFENCE BREACH");
}

void loadFence(){
  prefs.begin("trk",true);
  fence.lat=prefs.getDouble("flat",0);
  fence.lon=prefs.getDouble("flon",0);
  fence.radius_m=prefs.getFloat("fr",200.0f);
  prefs.end();
}

void goToSleep(uint64_t seconds){
  // Wake on accelerometer motion OR after a scheduled heartbeat.
  esp_sleep_enable_ext0_wakeup((gpio_num_t)PIN_ACCEL_INT, 1);
  esp_sleep_enable_timer_wakeup(seconds*1000000ULL);
  esp_deep_sleep_start();
}

void setup(){
  Serial.begin(115200);
  loadFence();

  esp_sleep_wakeup_cause_t cause = esp_sleep_get_wakeup_cause();
  bool byMotion = (cause == ESP_SLEEP_WAKEUP_EXT0);

  double lat, lon; float batt = readBattery();
  bool haveFix = getFix(lat, lon);

  if (haveFix){
    double d = haversine(lat,lon,fence.lat,fence.lon);
    bool breach = d > fence.radius_m + GEO_HYSTERESIS;
    if (breach || byMotion || !wasBreached==breach)   // report on change/motion
      report(lat, lon, breach, batt);
    wasBreached = breach;

    uint64_t sleep_s = breach ? 15 : (byMotion ? 45 : 6*3600);
    goToSleep(sleep_s);
  } else {
    // no fix (indoors/cover) — brief retry then long sleep to save power
    goToSleep(byMotion ? 60 : 6*3600);
  }
}

void loop(){}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'esp_sleep_enable_ext0_wakeup((gpio_num_t)PIN_ACCEL_INT, 1)', txt: 'The accelerometer\'s motion interrupt is a deep-sleep wake source, so the tracker sits at microamps until the asset actually moves.' },
      { ref: 'while(millis()-t0 < GPS_TIMEOUT_MS)', txt: 'The GPS wait is bounded, so a device that cannot see the sky times out and sleeps again rather than draining the battery waiting for a fix that will not come.' },
      { ref: 'bool breach = d > fence.radius_m + GEO_HYSTERESIS', txt: 'Each fix is tested against the geofence with a hysteresis margin, and a breach triggers an immediate alert.' },
      { ref: 'uint64_t sleep_s = breach ? 15 : (byMotion ? 45 : 6*3600)', txt: 'The sleep interval adapts to state — seconds when lost, tens of seconds when moving, hours when safely parked — which is the report-rate-versus-battery trade made concrete.' },
      { ref: 'goToSleep(byMotion ? 60 : 6*3600)', txt: 'Even a failed fix leads straight back to sleep, so an asset stuck indoors does not burn the battery retrying continuously.' },
    ],
  }],

  config: [
    'Set the geofence (centre/radius or polygon) and the hysteresis margin.',
    'Set the moving/breached/parked report intervals and the GPS fix timeout.',
    'Choose cellular vs LoRa backhaul and configure credentials/APN or gateway.',
    'Set battery-low thresholds and any solar-charging behaviour.',
  ],
  calibration: [
    { h: 'GPS fix', p: [
      'Confirm a reliable fix outdoors with sky view and measure typical time-to-fix; set the timeout accordingly and place the antenna well.',
    ] },
    { h: 'Geofence', p: [
      'Walk/drive the asset across the boundary and confirm the breach fires cleanly (no flapping) thanks to the hysteresis margin.',
    ] },
    { h: 'Power', p: [
      'Measure sleep current and per-report energy; verify the projected battery life meets your requirement at the chosen report rate.',
    ] },
  ],
  testing: [
    { step: 'Leave the asset parked', expect: 'Deep sleep at microamps; only periodic heartbeats' },
    { step: 'Move the asset', expect: 'Accelerometer wakes it; a fix is taken and reported' },
    { step: 'Carry it out of the geofence', expect: 'Instant breach alert; fast reporting follows' },
    { step: 'Take it indoors', expect: 'No fix within timeout; sleeps and retries without draining' },
    { step: 'Run a multi-day endurance test', expect: 'Battery lasts to the projected life at the set report rate' },
    { step: 'Drain the battery low', expect: 'Low-battery reported before it dies' },
  ],
  output: [
    'The map shows the asset\'s track and its geofence; a breach produces an instant located alert, and normal parked periods show only sparse heartbeats.',
    { file: 'asset-pos.json', lang: 'json', body: `{
  "lat": 28.61390,
  "lon": 77.20900,
  "breach": 1,
  "batt": 3.71
}` },
    'A breach report places the asset outside its safe zone and fires an alert; while the asset is parked inside the zone, the tracker sleeps and sends only occasional heartbeats to preserve battery.',
  ],
  troubleshoot: [
    { sym: 'Battery dies in a day', cause: 'GPS/modem not powered down in sleep', fix: 'Ensure true deep sleep with only the accelerometer awake; wake on motion' },
    { sym: 'No fix / wrong location', cause: 'Indoors, poor antenna, or urban canyon', fix: 'Place antenna for sky view; time out and retry; fall back to last-known/cell approx' },
    { sym: 'Geofence alerts flap', cause: 'Noisy fixes at the boundary', fix: 'Add a hysteresis margin; require the breach to persist a fix or two' },
    { sym: 'Misses movement', cause: 'Accelerometer wake threshold too high', fix: 'Lower the motion threshold; verify the interrupt wakes deep sleep' },
    { sym: 'High cellular cost', cause: 'Reporting too often', fix: 'Report on state (moving/breach) not a fixed fast timer; use LTE-M/NB-IoT/LoRa' },
  ],

  iot: {
    protoShort: 'Cellular (or LoRa) → tracking platform',
    net: {
      nodes: [{ name: 'Asset tracker', sub: 'ESP32' }, { name: 'Other assets', sub: 'fleet' }],
      protocol: 'Cellular / LoRa', gateway: 'Carrier / LoRa GW', gatewaySub: 'to platform',
      uplink: 'MQTT/HTTPS', cloud: 'Tracking platform', cloudSub: 'positions + geofences',
      clients: [{ name: 'Map/app', sub: 'track + zones' }, { name: 'Phone', sub: 'breach alerts' }],
    },
    protocol: ['Positions publish on movement/heartbeat and breaches immediately. Reporting cadence is tied to state to balance battery life and (on cellular) data cost.'],
    topics: [
      { t: 'asset/57/pos', dir: 'tracker → platform', payload: 'lat, lon, breach flag, battery' },
      { t: 'asset/57/alert', dir: 'tracker → platform', payload: 'geofence breach / low battery' },
      { t: 'asset/57/config', dir: 'platform → tracker', payload: 'geofence, report rates' },
    ],
    cloud: ['A tracking platform maps each asset and its geofences, stores tracks, and pushes instant breach and low-battery alerts; geofences can be updated remotely.'],
    dashboard: ['A map of assets and zones, per-asset track history, and an alert log of breaches and low-battery events.'],
    mobile: ['Instant geofence-breach alerts with location, and low-battery/maintenance alerts.'],
    security: [
      'Authenticate the tracker and encrypt reports so location cannot be spoofed or snooped.',
      'Protect geofence/config updates so only the owner can change them.',
      'Alert on unexpected silence — a jammed or destroyed tracker is itself significant.',
    ],
  },

  perf: [
    'Deep-sleep with only the accelerometer awake; this dominates battery life.',
    'Bound the GPS-on time and report on state, not a fixed fast timer.',
    'Use power-efficient backhaul (LTE-M/NB-IoT or LoRa) and small payloads.',
    'Cache the geofence and last state in RTC memory so wakes are quick and cheap.',
  ],
  safety: [
    'Track only assets you own or are authorised to track; covert tracking of people is unlawful and unethical.',
    'Protect location data — it is sensitive; authenticate and encrypt.',
    'Mind battery/enclosure safety, especially for vehicle-mounted or outdoor trackers.',
    'Do not rely on GPS where it cannot work (indoors/underground); design for its limits.',
  ],
  maintenance: [
    'Recharge/replace batteries per the endurance test; verify solar (if used) keeps up.',
    'Check antenna placement and fix quality after any remounting.',
    'Review geofences and report rates as usage changes.',
    'Confirm cellular coverage/plan or LoRa gateway reach at the asset\'s locations.',
  ],
  future: [
    'Add cell-tower/Wi-Fi positioning fallback for indoor/urban approximate location.',
    'Add tamper/removal detection (light/tilt) to alert if the tracker is found and removed.',
    'Add route/corridor geofences for shipments, not just static zones.',
    'Fuse motion classification (idle/transport/theft-like) to refine reporting.',
  ],
  faq: [
    { q: 'How does it last weeks on a battery?', a: 'By sleeping. A parked asset does not need tracking, so the tracker deep-sleeps at microamps watching only an accelerometer, and wakes the power-hungry GPS/modem only when the asset actually moves.' },
    { q: 'What is a geofence and why is it the key feature?', a: 'A defined safe zone. The tracker checks each fix against it and alerts instantly if the asset leaves — which is the theft/loss signal you actually care about, far more useful than a raw stream of positions.' },
    { q: 'Will it work indoors?', a: 'GPS needs a view of the sky, so indoors/underground it may not get a fix. The design times out and retries rather than draining the battery, and can fall back to last-known or cell-tower approximation.' },
    { q: 'Cellular or LoRa?', a: 'Cellular (ideally LTE-M/NB-IoT) for anywhere coverage at some running cost; LoRa where you have a private gateway and want near-zero per-message cost. The design supports either.' },
    { q: 'How do I keep it from being found and removed?', a: 'Mount it discreetly in a rugged enclosure, protect the battery and antenna, and consider tamper/removal detection so you are alerted if someone tries to disable it.' },
  ],
  refs: [
    { t: 'GPS tracking — principles', u: 'https://en.wikipedia.org/wiki/GPS_tracking_unit', s: 'Reference' },
    { t: 'Geofencing', u: 'https://en.wikipedia.org/wiki/Geo-fence', s: 'Reference' },
    { t: 'NEO-6M GPS module (datasheet)', u: 'https://www.u-blox.com/en/product/neo-6-series', s: 'u-blox' },
    { t: 'LTE-M / NB-IoT low-power cellular', u: 'https://en.wikipedia.org/wiki/Narrowband_IoT', s: 'Reference' },
    { t: 'Haversine distance formula', u: 'https://en.wikipedia.org/wiki/Haversine_formula', s: 'Reference' },
  ],
  images: ['gps', 'esp32', 'warehouse'],
  imageCaptions: [
    'A GPS tracker on high-value equipment knows where it is and alerts when it leaves its safe zone.',
    'ESP32 module getting a GPS fix on movement and checking it against the geofence.',
    'The tracker sleeps for weeks watching an accelerometer, waking only when the asset actually moves.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   058 — Visitor Management Kiosk
   ══════════════════════════════════════════════════════════════════ */
{
  id: '058',
  domainKey: 'ai',
  emoji: '🪪', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'A self-service check-in kiosk: scan a QR invite, capture a photo, print a badge, notify the host — and keep a searchable digital visitor log instead of a paper book.',

  overview: [
    'The paper visitor book at a reception desk is a security and privacy mess: illegible, unsearchable, exposing every visitor\'s details to the next person who signs in, and useless in an actual emergency when you need to know who is in the building. A visitor management kiosk replaces it with a fast self-service flow — a visitor scans a QR code from their invitation, the kiosk captures their photo, prints a badge, notifies their host that they have arrived, and records the visit in a searchable digital log. It speeds up reception, looks professional, and — done thoughtfully — actually improves both security and privacy over the book it replaces.',
    'The core flow is designed around <b>pre-registration and QR codes</b>. A host invites a visitor in advance; the system issues a unique QR code (emailed to the visitor) that encodes their invitation. At the kiosk, the visitor scans it, the kiosk validates it against the expected-visitors list, captures a photo for the badge and the log, prints a time-stamped badge, and pushes an instant notification to the host so they can come to reception. Walk-in visitors are handled by a short manual form. Check-out is equally simple, so the log always reflects who is actually in the building — the thing the paper book never gets right.',
    'The design treats visitor data as the <b>personal data it is</b>. Photos and details are stored access-controlled with an explicit retention policy (kept for the security/audit purpose, then purged), each visitor sees only their own flow (not the previous signer\'s details), and the system is built for legitimate reception and safety use — including an accurate "who is on site" roster for evacuations. It is honest about scope: it is a reception and logging tool, not an identity-verification or access-control system by itself (a QR code proves an invitation, not an identity, and the kiosk should pair with door access where security demands it), and photo capture is for badges and the visit record, not covert surveillance. But as a fast, professional, privacy-respecting replacement for the sign-in book — with QR check-in, photo badges, host notifications, and a searchable, emergency-ready visitor log — it does a genuinely useful job that a paper book simply cannot.',
  ],
  does: [
    'Checks visitors in by scanning a pre-issued QR invitation',
    'Captures a photo for the badge and the visit record',
    'Prints a time-stamped visitor badge',
    'Notifies the host instantly that their visitor has arrived',
    'Keeps a searchable digital visitor log (and a live on-site roster)',
    'Handles walk-ins with a short manual form and check-out',
    'Stores visitor data access-controlled with explicit retention',
  ],
  features: [
    'QR-based pre-registered check-in (fast, professional)',
    'Photo capture for badges and the visit log',
    'Instant host notification on arrival',
    'Searchable digital log + live "who is on site" roster',
    'Per-visitor privacy (no exposed previous entries)',
    'Retention/access controls on personal data',
    'Honest scope: reception/logging, not identity/access control',
  ],
  applications: [
    { t: 'Office reception', d: 'Self-service check-in with host notification and badges, replacing the sign-in book.' },
    { t: 'Factories / secure sites', d: 'Visitor logging with photos and an accurate on-site roster for safety and evacuation.' },
    { t: 'Schools / institutions', d: 'Controlled, logged visitor entry with badges and host alerts.' },
    { t: 'Events / co-working spaces', d: 'Fast QR check-in for expected guests and members.' },
  ],
  skills: [
    'QR generation/validation and a check-in flow',
    'Camera photo capture and badge printing',
    'Host notification and a searchable log/roster',
    'Touchscreen UI for self-service',
    'Privacy-aware data handling (retention/access)',
  ],
  prereq: [
    'A QR code proves an invitation, not an identity — pair with door access/ID checks where real security is required.',
    'Visitor photos and details are personal data — access-control them, set retention, and show each visitor only their own flow.',
    'Keep an accurate check-in/out so the on-site roster is right for emergencies.',
    'Photo capture is for badges/records, not covert surveillance.',
  ],

  parts: ['rpi4', 'picam', 'tft', 'esp32', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Touchscreen display', spec: 'Reception-friendly touchscreen for the self-service UI', qty: 1, price: 3500 },
    { name: 'Camera + QR scan (camera-based)', spec: 'Pi camera for photo capture and QR scanning', qty: 1, price: 600 },
    { name: 'Badge printer', spec: 'Thermal/label printer for visitor badges', qty: 1, price: 3000, note: 'Optional if using digital badges' },
    { name: 'Kiosk enclosure/stand', spec: 'Reception stand housing the screen, camera and printer', qty: 1, price: 2500 },
  ],
  cost: '₹9,000 – ₹14,000',
  libs: ['python', 'opencv', 'fastapi', 'sqlite', 'picamera2', 'streamlit'],

  pins: {
    left: [
      { dev: 'Pi camera', devPin: 'CSI', pin: 'CSI', sig: 'Photo + QR scan' },
      { dev: 'Touchscreen', devPin: 'HDMI/USB', pin: '—', sig: 'Self-service UI' },
      { dev: 'Badge printer', devPin: 'USB', pin: '—', sig: 'Badge output' },
    ],
    right: [
      { dev: 'Network', devPin: 'Wi-Fi/Eth', pin: '—', sig: 'Host notify + log sync' },
      { dev: 'ESP32 (I/O)', devPin: 'UART', pin: '—', sig: 'Optional gate/turnstile' },
      { dev: 'Storage', devPin: 'SD/SSD', pin: '—', sig: 'Log + photos (access-controlled)' },
      { dev: '5V supply', devPin: '+/–', pin: '—', sig: 'Kiosk power' },
    ],
  },
  wiringNotes: [
    'Use the camera for both photo capture and QR scanning to keep the hardware simple.',
    'Store the visitor database and photos on access-controlled local storage; treat them as personal data.',
    'Connect to the network for host notifications and (optional) central log sync.',
    'If gating a turnstile/door, drive it via the ESP32/relay only after a validated check-in — but pair with real access control for security.',
    'Position the camera for a clear, well-lit badge photo and comfortable QR presentation.',
  ],

  block: { columns: [
    { label: 'Check in', edge: 'right', blocks: [
      { name: 'Scan QR', sub: 'invitation', highlight: true },
      { name: 'Photo', sub: 'badge + record' },
    ] },
    { label: 'Process', edge: 'right', blocks: [
      { name: 'Validate', sub: 'expected visitor' },
      { name: 'Log', sub: 'access-controlled' },
    ] },
    { label: 'Output', edge: 'right', blocks: [
      { name: 'Badge', sub: 'printed' },
      { name: 'Notify host', sub: 'arrived' },
    ] },
    { label: 'Records', edge: 'none', blocks: [
      { name: 'Searchable log', sub: 'on-site roster' },
    ] },
  ] },
  flow: [
    { t: 'Visitor at kiosk', k: 'start' },
    { t: 'Has a QR invite?', k: 'dec', yes: 'Scan + validate QR', no: 'Short walk-in form' },
    { t: 'Scan + validate QR', k: 'proc' },
    { t: 'Short walk-in form', k: 'proc' },
    { t: 'Capture photo', k: 'proc' },
    { t: 'Print badge + notify host + log', k: 'io' },
    { t: 'Add to on-site roster', k: 'end' },
  ],

  principle: [
    'A visitor kiosk is fundamentally a <b>workflow-and-records</b> system, and its value over a paper book comes from three properties the book cannot provide: <b>speed and professionalism</b> at reception, an <b>accurate live record</b> of who is on site, and <b>privacy</b> for each visitor\'s data. Designing it well means optimising the common path (an expected visitor arriving), handling the exceptions gracefully (walk-ins, check-out), and treating the data it accumulates with the care that personal data demands.',
    'The efficient common path is built on <b>pre-registration and QR codes</b>. Rather than making a visitor type their details at the desk, the host registers them in advance and the system issues a unique QR code that encodes (or references) the invitation. At the kiosk the visitor simply <b>scans</b>; the system validates the code against the expected-visitor list, pulls up the pre-entered details, and the visitor confirms rather than types. This is fast, error-free and professional. The QR is best treated as a <b>reference/token</b> the backend validates (so it can be checked for validity, expiry and single-use) rather than a blob of personal data printed on a page — which is both more secure and more private. Walk-ins fall back to a short manual form, and the whole flow ends with a <b>photo</b> (for the badge and the visit record), a printed <b>badge</b>, an instant <b>host notification</b>, and a log entry.',
    'The <b>on-site roster</b> is the quietly important feature. Because the system records check-in and, crucially, <b>check-out</b>, it always knows who is currently in the building — which the paper book, where people rarely sign out, never does. That roster is exactly what a fire evacuation or a security incident needs: an accurate, instantly-available list of the visitors on site and who they are visiting. Making check-out as frictionless as check-in (scan the same badge, or a host confirms departure) is what keeps the roster honest and therefore useful when it matters.',
    'Finally, the kiosk is designed around <b>privacy and honest scope</b>, because it handles sensitive data and could easily be built carelessly. Each visitor interacts with a fresh flow that shows only their own information — never, as the paper book does, the previous ten visitors\' names and companies on the same open page. Photos and details are stored <b>access-controlled</b>, visible only to authorised reception/security staff, with an <b>explicit retention</b> policy that keeps records for the legitimate security/audit period and then purges them, so the system does not silently accumulate a permanent database of everyone who ever visited. And the scope is stated plainly: it is a <i>reception and logging</i> tool, not identity verification or access control on its own — a QR proves an invitation exists, not who is holding it, and the photo is for a badge and a record, not facial surveillance — so where genuine security is required, the kiosk is paired with proper door access and ID checks. Built this way, it delivers everything the sign-in book fails at: fast, professional check-in; an accurate, emergency-ready roster; and better, not worse, privacy for the people it records.',
  ],
  equations: [
    { t: 'QR as a validated token', eq: 'Invitation → token T (random, unguessable), emailed as a QR.\nAt the kiosk:\n\n  valid(T) = T ∈ expected AND not_expired(T) AND not_used(T)\n\nQR references the record (server-side), it does NOT carry the\npersonal data itself → more secure and private.' },
    { t: 'Accurate on-site roster', eq: 'roster = { v : checked_in(v) AND NOT checked_out(v) }\n\nAccuracy depends on frictionless check-OUT. The roster is the\nemergency/evacuation list the paper book never gets right.' },
    { t: 'Retention / access', eq: 'store visit records access-controlled; purge on schedule:\n\n  keep record while now − visit_time < RETENTION\n  visible only to authorised staff\n  each visitor sees ONLY their own flow (no prior entries)\n\nMinimise personal data; do not accumulate it beyond purpose.' },
  ],

  assembly: [
    { h: 'Build the kiosk', p: [
      'Assemble the touchscreen, camera (for photo + QR scan) and badge printer in a reception stand, driven by the Pi with access-controlled local storage.',
      'Position the camera for a clear photo and comfortable QR presentation, with good lighting.',
    ] },
    { h: 'Set up the check-in backend', p: [
      'Create the expected-visitor list and QR-token validation, the visit database (access-controlled), and the host-notification path.',
    ] },
    { h: 'Configure privacy and integrations', p: [
      'Set retention and access controls; ensure each visitor sees only their own flow; optionally integrate a turnstile/door (paired with real access control).',
    ], warn: 'Never display previous visitors\' details on the kiosk and never store visitor data without access control and a retention policy — it is personal data.' },
  ],
  steps: [
    { h: 'Validate the QR and run the flow', p: [
      'Scan the QR, validate the token (expected, not expired, not used), pull the pre-registered details, capture a photo, print the badge, notify the host and log the visit.',
    ], code: {
      file: 'checkin.py', lang: 'python',
      body: `import time

def validate_qr(token, db):
    inv = db.get_invitation(token)
    if inv is None:                     return None, "unknown code"
    if inv.expired():                   return None, "code expired"
    if inv.used:                        return None, "code already used"
    return inv, "ok"

def check_in(token, camera, printer, notifier, db):
    inv, reason = validate_qr(token, db)
    if inv is None:
        return prompt_walk_in()          # fall back to a short manual form
    photo = camera.capture()             # for badge + record
    visit = db.create_visit(inv, photo=photo, time=time.time())
    printer.print_badge(visit)           # time-stamped badge
    notifier.notify_host(inv.host, inv.visitor_name)   # instant arrival alert
    db.mark_used(token)                  # single-use token
    db.roster_add(visit)                 # live on-site roster
    return visit

def check_out(badge_id, db):
    db.roster_remove(badge_id)           # keep the roster accurate
    db.close_visit(badge_id, time=time.time())`,
      explain: [
        { ref: 'def validate_qr(token, db):', txt: 'The QR is validated server-side against the expected list, expiry and single-use, so it functions as a secure token rather than a blob of printed personal data.' },
        { ref: 'return prompt_walk_in()', txt: 'An invalid or absent code gracefully falls back to a short manual walk-in form rather than a dead end.' },
        { ref: 'notifier.notify_host(inv.host, inv.visitor_name)', txt: 'The host is notified instantly on arrival, the key convenience that replaces someone phoning around to find them.' },
        { ref: 'db.roster_add(visit)', txt: 'Every check-in updates the live on-site roster, the accurate who-is-here list that a paper book never maintains.' },
        { ref: 'def check_out(badge_id, db):', txt: 'Frictionless check-out keeps the roster honest, so the evacuation/emergency list stays correct.' },
      ],
    } },
    { h: 'Enforce privacy and retention', p: [
      'Store photos/details access-controlled, show each visitor only their own flow, and purge records past the retention window automatically.',
    ], tip: 'Reset the UI fully between visitors so no one ever sees the previous person\'s details — a basic privacy win over the sign-in book.' },
  ],

  code: [{
    file: 'visitor_kiosk.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Visitor Management Kiosk — Raspberry Pi

QR-based self-service check-in with photo capture, badge printing, host
notification, and a searchable, access-controlled visitor log with a
live on-site roster. Reception/logging tool — not identity/access control.
"""
import time
from camera import Camera          # photo + QR decode
from printer import BadgePrinter
from notify import HostNotifier
from db import VisitorDB

RETENTION_DAYS = 30

class Kiosk:
    def __init__(self):
        self.cam = Camera()
        self.printer = BadgePrinter()
        self.notify = HostNotifier()
        self.db = VisitorDB()          # access-controlled storage

    def validate(self, token):
        inv = self.db.get_invitation(token)
        if not inv:            return None, "unknown code"
        if inv.expired():      return None, "code expired"
        if inv.used:           return None, "already used"
        return inv, "ok"

    def run_once(self):
        self.reset_ui()                # fresh flow — no prior visitor's data
        token = self.cam.scan_qr(timeout=30)
        if token:
            inv, reason = self.validate(token)
        else:
            inv = self.walk_in_form()  # short manual entry for walk-ins

        if inv is None and token:
            return self.show(reason)   # invalid code message

        photo = self.cam.capture()     # badge + record photo
        visit = self.db.create_visit(inv, photo=photo, ts=time.time())
        self.printer.print_badge(visit)
        self.notify.host(inv.host, inv.visitor_name)   # instant arrival alert
        if token: self.db.mark_used(token)
        self.db.roster_add(visit)      # accurate on-site roster
        self.show(f"Welcome, {inv.visitor_name}. {inv.host} has been notified.")

    def check_out(self, badge_id):
        self.db.close_visit(badge_id, ts=time.time())
        self.db.roster_remove(badge_id)

    def housekeeping(self):
        self.db.purge_older_than(RETENTION_DAYS)       # enforce retention

if __name__ == "__main__":
    k = Kiosk()
    while True:
        k.run_once()
        k.housekeeping()`,
    explain: [
      { ref: 'self.reset_ui()                # fresh flow — no prior visitor\'s data', txt: 'The UI is fully reset for each visitor so no one ever sees the previous person\'s details — a privacy improvement over the open sign-in book.' },
      { ref: 'token = self.cam.scan_qr(timeout=30)', txt: 'The camera scans the pre-issued QR, giving the fast, error-free common path for expected visitors.' },
      { ref: 'self.notify.host(inv.host, inv.visitor_name)', txt: 'The host is alerted the instant their visitor checks in, replacing the reception phone-around.' },
      { ref: 'self.db.roster_add(visit)      # accurate on-site roster', txt: 'Each visit joins the live roster, so the building always has an accurate who-is-here list for emergencies.' },
      { ref: 'self.db.purge_older_than(RETENTION_DAYS)       # enforce retention', txt: 'Old records are automatically purged, so the kiosk minimises the personal data it holds rather than accumulating it forever.' },
    ],
  }],

  config: [
    'Set the retention period and access controls on the visitor database and photos.',
    'Configure QR-token validation (expiry, single-use) and the host-notification channel.',
    'Configure the badge template and printer, and the walk-in form fields.',
    'Set UI reset behaviour so no visitor sees another\'s details.',
  ],
  calibration: [
    { h: 'QR/camera', p: [
      'Verify reliable QR scanning and clear, well-lit photo capture at the kiosk\'s ergonomics; adjust camera position/lighting.',
    ] },
    { h: 'Flow timing', p: [
      'Confirm the end-to-end check-in (scan → photo → badge → notify) is fast and the walk-in fallback is short.',
    ] },
    { h: 'Roster accuracy', p: [
      'Test check-in and check-out and confirm the on-site roster stays accurate; make check-out easy.',
    ] },
  ],
  testing: [
    { step: 'Check in with a valid QR', expect: 'Validated, photo taken, badge printed, host notified, added to roster' },
    { step: 'Use an expired/used QR', expect: 'Clear message; falls back appropriately' },
    { step: 'Walk-in without a code', expect: 'Short manual form completes the check-in' },
    { step: 'Check out', expect: 'Roster updated; visit closed' },
    { step: 'Next visitor', expect: 'UI shows no trace of the previous visitor' },
    { step: 'Run retention housekeeping', expect: 'Records past the retention window are purged' },
  ],
  output: [
    'The kiosk confirms check-in and notifies the host; reception sees a searchable visitor log and a live on-site roster.',
    { file: 'visit-record.json', lang: 'json', body: `{
  "visitor": "A. Sharma",
  "company": "Acme",
  "host": "R. Patel",
  "checkin": "2026-07-27T10:04:12",
  "checkout": null,
  "badge": "V-20260727-014",
  "photo": "/secure/photos/014.jpg"
}` },
    'A check-in record with a printed badge and an instant host notification; the on-site roster lists everyone currently checked in but not out — the accurate emergency list the paper book never provides.',
  ],
  troubleshoot: [
    { sym: 'QR won\'t scan', cause: 'Lighting/camera/position', fix: 'Improve lighting and camera placement; provide a manual code-entry fallback' },
    { sym: 'Roster inaccurate', cause: 'People not checking out', fix: 'Make check-out frictionless (scan badge / host confirm); auto-close stale visits at day end' },
    { sym: 'Previous visitor\'s data visible', cause: 'UI not reset', fix: 'Fully reset the flow between visitors — a privacy must' },
    { sym: 'Host not notified', cause: 'Notification channel/host mapping issue', fix: 'Verify the host directory and notification path' },
    { sym: 'Data kept too long', cause: 'No retention enforcement', fix: 'Set and run automatic purging; access-control storage' },
  ],
  perf: [
    'Keep the common (QR) path to a few seconds; pre-registration removes typing at the desk.',
    'Store photos efficiently and access-controlled; enforce retention to bound storage.',
    'Notify hosts asynchronously so the visitor is not kept waiting.',
    'Reset the UI quickly between visitors for throughput and privacy.',
  ],
  safety: [
    'Visitor photos and details are personal data — access-control them, set retention, and show each visitor only their own flow.',
    'It is a reception/logging tool, not identity verification or access control; pair with real door access/ID checks where security requires it.',
    'Keep an accurate on-site roster for emergencies, and make it available to those responsible for evacuation.',
    'Comply with local data-protection law (consent, notices, retention).',
  ],
  maintenance: [
    'Keep the expected-visitor/host directory current.',
    'Check camera, printer and consumables; test the flow regularly.',
    'Review retention/access settings and purge as policy requires.',
    'Reconcile the roster (auto-close stale check-ins) so it stays trustworthy.',
  ],
  future: [
    'Add self-service pre-registration and calendar integration for hosts.',
    'Add NDA/sign-off capture during check-in where required.',
    'Add optional face-match to the badge photo for return visitors (privacy-reviewed).',
    'Integrate with access control and evacuation systems for a complete flow.',
  ],
  faq: [
    { q: 'How is this better than a sign-in book?', a: 'It is faster and professional, keeps a searchable digital log and an accurate live on-site roster for emergencies, notifies hosts instantly, and — unlike the open book — shows each visitor only their own details.' },
    { q: 'Does the QR prove who the person is?', a: 'No — it proves a valid invitation exists, not the identity of the holder. For real security, pair the kiosk with proper door access and ID checks; the QR just streamlines an expected visit.' },
    { q: 'What about visitor privacy?', a: 'Data is access-controlled with an explicit retention policy and purged when no longer needed, each visitor sees only their own flow, and photos are for badges/records — not surveillance.' },
    { q: 'Why does check-out matter?', a: 'Because the on-site roster is only accurate if people check out. That roster is the list you need in a fire or incident, which the paper book — where people rarely sign out — never gets right.' },
    { q: 'What about walk-in visitors?', a: 'They use a short manual form instead of a QR, then get the same photo, badge, host notification and log entry.' },
  ],
  refs: [
    { t: 'Visitor management systems — overview', u: 'https://en.wikipedia.org/wiki/Visitor_management', s: 'Reference' },
    { t: 'QR codes', u: 'https://en.wikipedia.org/wiki/QR_code', s: 'Reference' },
    { t: 'Data protection and retention (GDPR principles)', u: 'https://gdpr.eu/', s: 'Reference' },
    { t: 'Reception/evacuation roster best practice', u: 'https://www.hse.gov.uk/', s: 'HSE' },
    { t: 'Raspberry Pi camera (picamera2)', u: 'https://www.raspberrypi.com/documentation/', s: 'Raspberry Pi' },
  ],
  images: ['retail', 'camera', 'oled'],
  imageCaptions: [
    'A self-service kiosk replaces the paper sign-in book with QR check-in, a photo badge and a digital log.',
    'The camera scans the visitor\'s QR invitation and captures a badge photo.',
    'Hosts are notified instantly and reception keeps a searchable log and an accurate on-site roster.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   059 — Machine Vibration Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '059',
  domainKey: 'electronics',
  emoji: '📳', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'Reads a machine\'s vibration and turns its frequency spectrum into an early warning — spotting the tell-tale signatures of bearing wear, imbalance and misalignment weeks before failure.',

  overview: [
    'Rotating machines — motors, pumps, fans, gearboxes — announce their decline through vibration long before they fail, and each fault has a distinct signature buried in the vibration\'s frequency spectrum. A worn bearing generates energy at specific defect frequencies set by its geometry; imbalance shows up as a peak at the running speed; misalignment appears at twice the running speed; looseness scatters harmonics. To a human the machine just hums, but to an accelerometer plus a frequency analysis, these signatures are readable — which is the foundation of <b>predictive maintenance</b>: fixing a machine when the data says it is starting to fail, weeks in advance, instead of after it has failed and taken the production line down with it.',
    'This monitor bolts an accelerometer to a machine, samples its vibration at high rate, and computes the <b>FFT</b> (Fast Fourier Transform) to reveal the spectrum — the amount of vibration at each frequency. From that spectrum it extracts the diagnostic features: the <b>overall vibration level</b> (an ISO-standard velocity RMS that classifies the machine\'s general health as good/acceptable/unacceptable), the peak at running speed (imbalance), the peak at 2× (misalignment), and energy at the calculated <b>bearing defect frequencies</b> (BPFO, BPFI, BSF, FTF) that pinpoint which part of a bearing is failing. Tracked over time against each machine\'s own healthy baseline, a rising trend in any of these is an early warning.',
    'The value is entirely in <b>trend and early warning</b>, not a single reading. A machine has a characteristic healthy spectrum; the monitor learns it, then watches for the specific peaks to grow — a bearing defect frequency climbing out of the noise floor over weeks is a bearing beginning to fail, caught while there is still time to schedule the replacement during planned downtime rather than suffer an unplanned breakdown. The design is honest that low-cost MEMS accelerometers and edge FFTs are indicative — good for trending and catching clear developing faults, less so for the fine diagnosis a calibrated industrial analyser gives — and that mounting and sampling done wrong will corrupt the spectrum. But as an affordable, always-on condition monitor that turns vibration into readable, trended fault signatures, it delivers the core promise of predictive maintenance: knowing a machine is going to fail before it does.',
  ],
  does: [
    'Samples machine vibration at high rate with an accelerometer',
    'Computes the FFT to reveal the vibration spectrum',
    'Measures an ISO-standard overall vibration level (velocity RMS) for health class',
    'Extracts imbalance (1×), misalignment (2×) and looseness signatures',
    'Computes and watches bearing defect frequencies (BPFO/BPFI/BSF/FTF)',
    'Trends features against each machine\'s baseline for early warning',
    'Alerts when a fault signature rises — weeks before failure',
  ],
  features: [
    'FFT spectral analysis on the edge',
    'ISO 10816-style overall-level health classification',
    'Fault-specific signatures (imbalance, misalignment, looseness, bearings)',
    'Bearing defect-frequency computation from bearing geometry',
    'Per-machine baseline trending for predictive maintenance',
    'Early-warning alerts before breakdown',
    'Honest about MEMS/edge-FFT limits vs industrial analysers',
  ],
  applications: [
    { t: 'Motors, pumps, fans', d: 'Continuous condition monitoring of rotating plant to catch bearing/imbalance/misalignment faults early.' },
    { t: 'Predictive maintenance programmes', d: 'Trending vibration across many machines to schedule repairs before failure and cut unplanned downtime.' },
    { t: 'Gearboxes / compressors', d: 'Watching for developing mechanical faults in critical drivetrain equipment.' },
    { t: 'Fleet / building services', d: 'HVAC, pumps and fans monitored cheaply and always-on across a facility.' },
  ],
  skills: [
    'High-rate accelerometer sampling and correct mounting',
    'FFT/spectral analysis and windowing',
    'ISO velocity-RMS overall level and health classes',
    'Bearing defect-frequency calculation and interpretation',
    'Baseline trending and early-warning alerting',
  ],
  prereq: [
    'Mounting is critical: rigidly couple the accelerometer to the machine (stud/magnet on bare metal) or the spectrum is meaningless above low frequencies.',
    'Sample fast enough (well above twice the highest frequency of interest) to avoid aliasing; know your bearing speeds.',
    'The value is trend vs a healthy baseline, not one reading — establish a baseline first.',
    'Low-cost MEMS + edge FFT is indicative, good for trending and clear faults, not a substitute for a calibrated industrial analyser.',
  ],

  parts: ['esp32', 'adxl345', 'mpu6050', 'oled', 'lora', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'High-rate/low-noise accelerometer', spec: 'ADXL345/ADXL355-class or industrial IEPE for real bandwidth', qty: 1, price: 600, note: 'Bandwidth and noise floor set what faults you can see' },
    { name: 'Stud/magnetic mount', spec: 'Rigid coupling to the machine (stud on bare metal best; magnet acceptable)', qty: 1, price: 250, note: 'Mounting quality dominates high-frequency fidelity' },
    { name: 'Tacho / speed reference (optional)', spec: 'To know running speed for 1×/2× and bearing-frequency scaling', qty: 1, price: 300 },
    { name: 'Industrial enclosure', spec: 'Vibration/temperature-tolerant housing on or near the machine', qty: 1, price: 400 },
  ],
  cost: '₹3,200 – ₹5,500',
  libs: ['wifi', 'pubsub', 'ssd1306', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Accelerometer', devPin: 'SPI/I²C', pin: 'GPIO 18/19/23/5 or 21/22', sig: 'High-rate vibration' },
      { dev: 'Accelerometer', devPin: 'INT', pin: 'GPIO 34', sig: 'Data-ready (paced sampling)' },
      { dev: 'Tacho (opt)', devPin: 'PULSE', pin: 'GPIO 27', sig: 'Running speed reference' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Level/spectrum display' },
      { dev: 'LoRa/Wi-Fi', devPin: 'bus', pin: 'SPI / on-chip', sig: 'Features/trends uplink' },
      { dev: 'microSD', devPin: 'SPI', pin: 'shared + CS', sig: 'Optional raw/feature log' },
      { dev: '5V supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Rigidly couple the accelerometer to the machine — a stud into bare metal is best; a strong magnet on a clean flat surface is acceptable; anything loose (tape, a wobbly bracket) destroys the high-frequency spectrum.',
    'Sample at a steady, known rate using the sensor\'s data-ready interrupt, at least ~2.5× the highest frequency of interest (bearing defect frequencies can be several kHz).',
    'Orient the accelerometer consistently (radial/axial) and record it; different directions reveal different faults.',
    'If available, feed a tacho/speed reference so 1×/2× and bearing frequencies scale with actual running speed.',
    'Keep the mount and cabling free of resonances that would add spurious peaks.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Accelerometer', sub: 'high-rate, rigid mount', highlight: true },
      { name: 'Speed (opt)', sub: 'tacho' },
    ] },
    { label: 'Analyse', edge: 'right', blocks: [
      { name: 'FFT', sub: 'spectrum' },
      { name: 'Features', sub: 'RMS, 1×, 2×, bearings' },
    ] },
    { label: 'Diagnose', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'vs baseline trend' },
      { name: 'Health class', sub: 'ISO level' },
    ] },
    { label: 'Warn', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'trends' },
      { name: 'Alert', sub: 'rising fault' },
    ] },
  ] },
  flow: [
    { t: 'Sample vibration block', k: 'start' },
    { t: 'Window + FFT → spectrum', k: 'proc' },
    { t: 'Extract RMS, 1×, 2×, bearing bands', k: 'proc' },
    { t: 'Any feature above baseline trend?', k: 'dec', yes: 'Alert: developing fault', no: 'Update trend' },
    { t: 'Alert: developing fault', k: 'io' },
    { t: 'Update trend', k: 'proc' },
    { t: 'Report features; sleep interval', k: 'end', back: 'Sample vibration block' },
  ],

  principle: [
    'Vibration analysis works because a rotating machine\'s faults each inject energy at <b>predictable frequencies</b>, and separating vibration by frequency (the spectrum) exposes them. The physics is direct: a mass imbalance on a rotor pulls once per revolution, so it appears as a peak at the <b>running speed</b> (1×); a misaligned coupling flexes twice per revolution, giving a peak at <b>2×</b>; mechanical looseness rattles and scatters energy across many <b>harmonics</b>; and a defect on a bearing race or rolling element strikes at a specific, calculable frequency every time it passes the load, producing energy at the <b>bearing defect frequencies</b>. A raw vibration amplitude tells you only that the machine shakes; the spectrum tells you <i>why</i>.',
    'Getting the spectrum requires the <b>FFT</b>, and getting it right requires respecting the sampling. The accelerometer samples the vibration at a high, steady rate; the FFT converts a block of those samples into amplitude-versus-frequency. Two constraints dominate: the sample rate must exceed about 2.5× the highest frequency of interest (bearing defects can reach several kHz) or those frequencies <b>alias</b> into false low-frequency peaks; and the sample block should be <b>windowed</b> (e.g. Hann) before the FFT to avoid spectral leakage smearing the peaks. Above all, the accelerometer must be <b>rigidly mounted</b> — a stud into bare metal, or at least a magnet on a clean surface — because a loose or compliant mount acts as a mechanical filter that kills the high-frequency content where bearing faults live, so poor mounting silently makes the most important faults invisible.',
    'From the spectrum the monitor extracts <b>diagnostic features</b>, each answering a specific question. The <b>overall vibration level</b> — conventionally a velocity RMS in the ISO 10816 band — classifies the machine\'s general condition (good / acceptable / unacceptable / danger) and is the headline health number. The amplitude at <b>1×</b> quantifies imbalance; at <b>2×</b>, misalignment; the pattern of harmonics, looseness. And energy in narrow bands around the computed <b>bearing defect frequencies</b> (outer race BPFO, inner race BPFI, ball BSF, cage FTF — each derived from the bearing\'s ball count, diameter and contact angle) pinpoints not just that a bearing is failing but <i>which element</i>. This turns a spectrum into a named diagnosis rather than a wall of peaks.',
    'The decisive principle, though, is that the value lives in the <b>trend against a baseline</b>, not any single measurement. Every machine has a characteristic healthy spectrum with its own peaks and noise floor; the absolute numbers vary hugely between machines, so what matters is <i>change</i>. The monitor learns each machine\'s healthy baseline and then watches for the diagnostic features to <b>grow over time</b> — a bearing defect frequency rising out of the noise floor over days and weeks is a bearing entering failure, and catching that early is the entire point of predictive maintenance: it converts an unplanned, production-stopping breakdown into a planned repair during scheduled downtime. The design is candid about its ceiling — a low-cost MEMS accelerometer and an edge FFT are excellent for <i>trending</i> and catching clear developing faults but do not match a calibrated industrial analyser\'s resolution and diagnostic depth, and mounting or sampling done poorly will mislead. Used honestly, though — rigidly mounted, correctly sampled, and trended against each machine\'s own baseline — it delivers predictive maintenance\'s core value cheaply and continuously: it sees the failure coming.',
  ],
  equations: [
    { t: 'Sampling and FFT resolution', eq: 'To see up to f_max without aliasing:\n  f_sample > 2.5·f_max   (bearing defects reach several kHz)\n\nFFT of N samples at f_sample gives:\n  resolution Δf = f_sample / N\n  → more samples = finer peaks (needed to resolve close\n    bearing frequencies). Window (Hann) before FFT to reduce\n    spectral leakage.' },
    { t: 'ISO overall level (velocity RMS)', eq: 'Integrate acceleration to velocity; overall RMS in the\n10–1000 Hz band classifies condition (ISO 10816-style):\n\n  v_rms = sqrt( mean( v(t)^2 ) )\n\n  zones (machine-class dependent):\n   A good | B acceptable | C unsatisfactory | D danger\nRising v_rms = worsening general condition.' },
    { t: 'Bearing defect frequencies', eq: 'For a bearing: n balls, ball dia d, pitch dia D, contact\nangle θ, shaft speed f_r (rev/s):\n\n  BPFO = (n/2)·f_r·(1 − (d/D)cosθ)   outer race\n  BPFI = (n/2)·f_r·(1 + (d/D)cosθ)   inner race\n  BSF  = (D/2d)·f_r·(1 − ((d/D)cosθ)²)  ball\n  FTF  = (1/2)·f_r·(1 − (d/D)cosθ)   cage\n\nEnergy at these = the corresponding element failing.' },
  ],

  assembly: [
    { h: 'Mount the accelerometer rigidly', p: [
      'Couple the accelerometer to the machine with a stud into bare metal where possible (best high-frequency fidelity), or a strong magnet on a clean, flat surface. Orient it consistently (radial and/or axial) and record the orientation.',
      'Avoid tape, adhesive pads or flexible brackets — they filter out the high frequencies where bearing faults appear.',
    ], warn: 'Mounting quality dominates everything above a few hundred Hz. A poorly-coupled sensor makes bearing faults — the whole point — invisible. Get the mount right first.' },
    { h: 'Set up high-rate sampling', p: [
      'Sample at a steady, known rate (well above 2.5× your highest bearing frequency) using the sensor\'s data-ready interrupt, and capture blocks long enough for the frequency resolution you need.',
      'Feed a speed reference if available so 1×/2× and bearing frequencies scale with running speed.',
    ] },
    { h: 'Set up analysis, display and reporting', p: [
      'Run the windowed FFT and feature extraction on the ESP32, show the level/spectrum on an OLED, and report features/trends over LoRa/Wi-Fi (optionally logging raw blocks to SD).',
    ] },
  ],
  steps: [
    { h: 'Compute the spectrum and features', p: [
      'Window the sample block, FFT it, then extract the overall level, the 1×/2× amplitudes and the energy in bands around each computed bearing defect frequency.',
    ], code: {
      file: 'vibration-features.ino', lang: 'cpp',
      body: `#include <arduinoFFT.h>
#define NS 2048           // samples per block
double vReal[NS], vImag[NS];
ArduinoFFT<double> FFT(vReal, vImag, NS, F_SAMPLE);

struct Bearing { int n; double d, D, thetaDeg; };

// Bearing defect frequencies at shaft speed fr (rev/s).
void bearingFreqs(const Bearing &b, double fr,
                  double &bpfo,double &bpfi,double &bsf,double &ftf){
  double r = (b.d/b.D)*cos(b.thetaDeg*M_PI/180.0);
  bpfo=(b.n/2.0)*fr*(1-r);  bpfi=(b.n/2.0)*fr*(1+r);
  bsf =(b.D/(2*b.d))*fr*(1-r*r);  ftf=0.5*fr*(1-r);
}

double bandEnergy(double centreHz,double halfWidthHz){
  double df = F_SAMPLE/(double)NS, e=0;
  int lo=(centreHz-halfWidthHz)/df, hi=(centreHz+halfWidthHz)/df;
  for(int k=max(1,lo);k<=hi && k<NS/2;k++) e += vReal[k]*vReal[k];
  return sqrt(e);
}

void analyse(double fr, const Bearing &b, double &lvl,
             double &x1,double &x2,double &bo,double &bi){
  FFT.windowing(FFT_WIN_TYP_HANN, FFT_FORWARD);   // reduce leakage
  FFT.compute(FFT_FORWARD);
  FFT.complexToMagnitude();                        // spectrum in vReal[]

  lvl = overallLevel(vReal, NS);                   // ISO velocity RMS
  x1  = bandEnergy(fr, fr*0.05);                   // 1x  imbalance
  x2  = bandEnergy(2*fr, fr*0.05);                 // 2x  misalignment
  double bpfo,bpfi,bsf,ftf; bearingFreqs(b,fr,bpfo,bpfi,bsf,ftf);
  bo  = bandEnergy(bpfo, 5);                        // outer-race energy
  bi  = bandEnergy(bpfi, 5);                        // inner-race energy
}`,
      explain: [
        { ref: 'FFT.windowing(FFT_WIN_TYP_HANN, FFT_FORWARD)', txt: 'A Hann window is applied before the FFT to reduce spectral leakage, so the diagnostic peaks stay sharp rather than smearing into their neighbours.' },
        { ref: 'void bearingFreqs(', txt: 'The bearing\'s defect frequencies are computed from its geometry and the shaft speed, so the monitor knows exactly which frequencies to watch for each bearing.' },
        { ref: 'double bandEnergy(double centreHz,double halfWidthHz)', txt: 'Energy is summed in a narrow band around a target frequency, so the feature tracks a specific fault (a bearing race, 1×, 2×) rather than the whole spectrum.' },
        { ref: 'lvl = overallLevel(vReal, NS)', txt: 'The ISO-style overall velocity RMS gives the headline health number that classifies the machine good/acceptable/unacceptable.' },
        { ref: 'bo  = bandEnergy(bpfo, 5)', txt: 'Energy in the outer-race band is exactly the feature whose rise over weeks signals a developing outer-race bearing defect.' },
      ],
    } },
    { h: 'Baseline, trend and alert', p: [
      'Learn each machine\'s healthy feature baseline, trend the features over time, and alert when any rises significantly above baseline — the early warning of a developing fault.',
    ], tip: 'Alert on the trend crossing a multiple of the healthy baseline, not a universal threshold — every machine\'s "normal" is different.' },
  ],

  code: [{
    file: 'machine-vibration-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Machine Vibration Monitor — ESP32 + accelerometer, FFT diagnostics

   Samples vibration at high rate, computes the FFT, extracts the ISO
   overall level and imbalance/misalignment/bearing signatures, and
   trends them against each machine's baseline for early-warning alerts.
   ══════════════════════════════════════════════════════════════════ */

#include <arduinoFFT.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Preferences.h>
#include <math.h>

#define NS       2048
#define F_SAMPLE 8000       // Hz — set from your f_max
#define SHAFT_HZ 24.5f      // running speed (from tacho or nameplate)

double vReal[NS], vImag[NS];
ArduinoFFT<double> FFT(vReal, vImag, NS, F_SAMPLE);
Preferences prefs;
WiFiClient net; PubSubClient mqtt(net);

struct Bearing { int n; double d, D, thetaDeg; } brg = {8, 7.94, 39.0, 0};
struct Baseline { double lvl, x1, x2, bo, bi; } base;

void sampleBlock() {
  uint32_t period_us = 1000000UL / F_SAMPLE;
  uint32_t next = micros();
  for (int i = 0; i < NS; i++) {
    while ((int32_t)(micros() - next) < 0) {}
    next += period_us;
    vReal[i] = readAccel();     // one axis, steady-rate
    vImag[i] = 0;
  }
}

double bandEnergy(double f, double hw) {
  double df = F_SAMPLE/(double)NS, e=0;
  int lo=(f-hw)/df, hi=(f+hw)/df;
  for (int k=max(1,lo); k<=hi && k<NS/2; k++) e += vReal[k]*vReal[k];
  return sqrt(e);
}

void bearingFreqs(double fr,double&o,double&i){
  double r=(brg.d/brg.D)*cos(brg.thetaDeg*M_PI/180.0);
  o=(brg.n/2.0)*fr*(1-r); i=(brg.n/2.0)*fr*(1+r);
}

void loadBaseline(){
  prefs.begin("vib",true);
  base.lvl=prefs.getDouble("lvl",0); base.x1=prefs.getDouble("x1",0);
  base.x2=prefs.getDouble("x2",0);   base.bo=prefs.getDouble("bo",0);
  base.bi=prefs.getDouble("bi",0);   prefs.end();
}

void setup(){
  Serial.begin(115200);
  loadBaseline();
  WiFi.begin(WIFI_SSID,WIFI_PASS);
  mqtt.setServer(MQTT_HOST,1883);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("vib-1");
  mqtt.loop();

  sampleBlock();
  FFT.windowing(FFT_WIN_TYP_HANN, FFT_FORWARD);
  FFT.compute(FFT_FORWARD);
  FFT.complexToMagnitude();

  double lvl = overallLevel(vReal, NS);         // ISO velocity RMS
  double x1  = bandEnergy(SHAFT_HZ, SHAFT_HZ*0.05);
  double x2  = bandEnergy(2*SHAFT_HZ, SHAFT_HZ*0.05);
  double bo, bi; bearingFreqs(SHAFT_HZ, bo, bi);
  double eo  = bandEnergy(bo, 5), ei = bandEnergy(bi, 5);

  // If unbaselined, learn this as the healthy baseline.
  if (base.lvl == 0) {
    base = {lvl, x1, x2, eo, ei};
    prefs.begin("vib",false);
    prefs.putDouble("lvl",lvl); prefs.putDouble("x1",x1);
    prefs.putDouble("x2",x2); prefs.putDouble("bo",eo);
    prefs.putDouble("bi",ei); prefs.end();
  }

  // Alert when a feature rises well above its healthy baseline.
  const char *fault = nullptr;
  if (lvl > 2.5*base.lvl) fault = "overall level high";
  else if (x1 > 3*base.x1) fault = "imbalance (1x)";
  else if (x2 > 3*base.x2) fault = "misalignment (2x)";
  else if (eo > 4*base.bo) fault = "bearing outer race";
  else if (ei > 4*base.bi) fault = "bearing inner race";

  char m[240];
  snprintf(m,sizeof m,
    "{\\"lvl\\":%.3f,\\"x1\\":%.3f,\\"x2\\":%.3f,\\"bpfo\\":%.3f,"
    "\\"bpfi\\":%.3f,\\"fault\\":\\"%s\\"}",
    lvl,x1,x2,eo,ei, fault?fault:"none");
  mqtt.publish("vib/machine1/features", m);
  if (fault) mqtt.publish("vib/machine1/alert", fault);

  delay(60000);                                  // one analysis per minute
}`,
    explain: [
      { ref: 'void sampleBlock()', txt: 'Captures a block of vibration at a precise, steady rate — essential, because jittery sampling smears the spectrum and invalidates the frequency features.' },
      { ref: 'FFT.windowing(FFT_WIN_TYP_HANN, FFT_FORWARD)', txt: 'Windows the block before the FFT to control spectral leakage, keeping the diagnostic peaks sharp.' },
      { ref: 'if (base.lvl == 0) {', txt: 'On first run the current healthy spectrum is stored as the machine\'s baseline, because diagnosis is about change from this machine\'s own normal, not an absolute number.' },
      { ref: 'if (lvl > 2.5*base.lvl) fault = "overall level high"', txt: 'Alerts fire when a feature rises to a multiple of its healthy baseline, giving per-machine early warning rather than a universal threshold that fits no machine.' },
      { ref: 'else if (eo > 4*base.bo) fault = "bearing outer race"', txt: 'Rising energy at the outer-race defect frequency names the specific failing element — the actionable diagnosis predictive maintenance needs.' },
    ],
  }],

  config: [
    'Set F_SAMPLE and block size for your highest frequency of interest and the resolution you need.',
    'Enter the running speed (or tacho) and the bearing geometry (n, d, D, θ) for defect-frequency computation.',
    'Set the baseline-learning behaviour and the per-feature alert multipliers.',
    'Configure reporting (LoRa/Wi-Fi) and any raw-block logging.',
  ],
  calibration: [
    { h: 'Mounting/sampling', p: [
      'Verify the mount is rigid and the sample rate avoids aliasing (a known excitation should appear at the right frequency, not aliased).',
    ] },
    { h: 'Baseline', p: [
      'Capture the healthy spectrum over a period of normal operation to establish a stable baseline before trusting alerts.',
    ] },
    { h: 'Bearing frequencies', p: [
      'Confirm the computed BPFO/BPFI/BSF/FTF against the bearing datasheet and the running speed.',
    ] },
  ],
  testing: [
    { step: 'Excite a known frequency', expect: 'Peak appears at the correct frequency (no aliasing) after correct mounting/sampling' },
    { step: 'Add imbalance (test mass)', expect: '1× amplitude rises; imbalance flagged when above baseline' },
    { step: 'Introduce misalignment', expect: '2× amplitude rises; misalignment flagged' },
    { step: 'Run with a worn bearing (or simulate)', expect: 'Energy grows at the bearing defect frequency; bearing fault flagged' },
    { step: 'Compare loose vs rigid mount', expect: 'High-frequency content collapses when loosely mounted — proving mounting matters' },
    { step: 'Trend over time', expect: 'A rising feature triggers an early-warning alert before failure' },
  ],
  output: [
    'The dashboard shows the overall level (health class), the spectrum, and trends of 1×/2×/bearing-band energy against baseline; a rising feature raises an early-warning alert.',
    { file: 'vib-features.json', lang: 'json', body: `{
  "lvl": 4.8,
  "x1": 0.9,
  "x2": 0.4,
  "bpfo": 2.7,
  "bpfi": 0.6,
  "fault": "bearing outer race"
}` },
    'Here the outer-race bearing energy (bpfo) has climbed well above its baseline, flagging a developing outer-race bearing fault — an alert raised while the machine still runs, allowing the bearing to be replaced during planned downtime.',
  ],
  troubleshoot: [
    { sym: 'Spectrum looks like noise / no clear peaks', cause: 'Loose mounting or jittery sampling', fix: 'Mount rigidly (stud/magnet on bare metal); use steady-rate sampling; window before FFT' },
    { sym: 'False low-frequency peaks', cause: 'Aliasing (sample rate too low)', fix: 'Increase the sample rate above 2.5× f_max; add anti-alias filtering' },
    { sym: 'Bearing frequencies not where expected', cause: 'Wrong geometry or running speed', fix: 'Verify n/d/D/θ and the actual shaft speed (use a tacho)' },
    { sym: 'Alerts on a healthy machine', cause: 'No/poor baseline or universal thresholds', fix: 'Learn a proper per-machine baseline; alert on multiples of it' },
    { sym: 'Can\'t see high-frequency bearing faults', cause: 'MEMS bandwidth/mount limits', fix: 'Use a higher-bandwidth/low-noise sensor and better mounting; know the sensor\'s limits' },
  ],

  iot: {
    protoShort: 'LoRa/Wi-Fi → maintenance dashboard',
    net: {
      nodes: [{ name: 'Vibration node', sub: 'ESP32' }, { name: 'Other machines', sub: 'fleet' }],
      protocol: 'LoRa / Wi-Fi', gateway: 'Plant gateway', gatewaySub: 'to MQTT',
      uplink: 'MQTT 1883', cloud: 'CMMS/dashboard', cloudSub: 'features + trends',
      clients: [{ name: 'Maintenance', sub: 'trends + alerts' }, { name: 'Phone', sub: 'early warnings' }],
    },
    protocol: ['Nodes report extracted features (level, 1×, 2×, bearing bands) and trends — not raw waveforms — on a slow cadence, with immediate alerts when a feature rises above baseline.'],
    topics: [
      { t: 'vib/machine1/features', dir: 'node → broker', payload: 'level, 1x, 2x, bearing-band energies' },
      { t: 'vib/machine1/alert', dir: 'node → broker', payload: 'developing fault (which signature)' },
      { t: 'vib/machine1/status', dir: 'node → broker', payload: 'baseline, health class, uptime' },
    ],
    cloud: ['A maintenance dashboard / CMMS trends each machine\'s features against baseline, classifies health, and raises work orders on early warnings, turning breakdowns into planned repairs.'],
    dashboard: ['Per-machine health class, spectrum snapshot, and trend charts of 1×/2×/bearing energies with baseline and alert markers.'],
    mobile: ['Early-warning alerts naming the machine and the developing fault (imbalance, misalignment, bearing element).'],
    security: [
      'Authenticate nodes so plant condition data cannot be spoofed.',
      'Report features/trends (not raw waveforms) to keep bandwidth and exposure low.',
      'Alert on node silence so a failed monitor is noticed.',
    ],
  },

  perf: [
    'Sample at a precise steady rate; do the FFT on a block and report features, not raw data.',
    'Choose block size for the frequency resolution needed to separate close bearing frequencies.',
    'Analyse periodically (e.g. once a minute) — faults develop over days, so high rate wastes power.',
    'Keep per-machine baselines and trends so alerts are meaningful and lightweight.',
  ],
  safety: [
    'Mount and service on running machinery safely, following lockout/tagout for any hands-on work.',
    'This is indicative condition monitoring (low-cost MEMS + edge FFT), not a calibrated industrial analyser — use it for trending and clear faults, and escalate to proper analysis for critical decisions.',
    'Act on early warnings by scheduling inspection/repair, not by ignoring them until failure.',
    'Ensure the sensor and enclosure tolerate the machine\'s temperature and vibration environment.',
  ],
  maintenance: [
    'Re-baseline after any repair, re-mount, or speed change.',
    'Check the mount remains rigid; a loosened sensor degrades the spectrum.',
    'Verify sample rate and bearing parameters if machines change.',
    'Correlate alerts with actual findings to tune the alert multipliers.',
  ],
  future: [
    'Add order tracking (speed-normalised spectra) for variable-speed machines.',
    'Add envelope/demodulation analysis for earlier bearing-fault detection.',
    'Add temperature and current signatures for multi-parameter diagnosis.',
    'Train an ML classifier on labelled fault spectra for automatic diagnosis.',
  ],
  faq: [
    { q: 'How can vibration predict a failure weeks ahead?', a: 'Faults inject energy at specific frequencies that grow as the fault develops. A bearing defect frequency rising out of the noise floor over weeks is the bearing beginning to fail — visible in the spectrum long before the machine actually breaks.' },
    { q: 'Why is the FFT necessary?', a: 'Because each fault lives at a specific frequency. A raw amplitude just says the machine shakes; the FFT separates the vibration by frequency so you can see imbalance at 1×, misalignment at 2×, and bearing defects at their calculated frequencies.' },
    { q: 'Why does mounting matter so much?', a: 'A loose or compliant mount filters out the high frequencies where bearing faults appear, making the most important faults invisible. A rigid stud/magnet coupling to bare metal is essential for a faithful spectrum.' },
    { q: 'Is a cheap MEMS sensor good enough?', a: 'For trending and catching clear developing faults, yes — that is the core value. It does not match a calibrated industrial analyser\'s resolution and depth, so critical decisions should be escalated to proper analysis.' },
    { q: 'Why compare to a baseline instead of a fixed limit?', a: 'Every machine\'s healthy spectrum is different, so absolute numbers are not comparable. Diagnosis is about change: the monitor learns each machine\'s normal and alerts when a feature rises above it.' },
  ],
  refs: [
    { t: 'Vibration analysis and machinery diagnostics', u: 'https://en.wikipedia.org/wiki/Vibration', s: 'Reference' },
    { t: 'ISO 10816 / 20816 vibration severity', u: 'https://en.wikipedia.org/wiki/Machinery_vibration', s: 'Reference' },
    { t: 'Rolling-element bearing defect frequencies', u: 'https://en.wikipedia.org/wiki/Rolling-element_bearing', s: 'Reference' },
    { t: 'Fast Fourier Transform', u: 'https://en.wikipedia.org/wiki/Fast_Fourier_transform', s: 'Reference' },
    { t: 'Predictive maintenance / condition monitoring', u: 'https://en.wikipedia.org/wiki/Condition_monitoring', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'motor'],
  imageCaptions: [
    'An accelerometer on a motor reads vibration whose spectrum reveals developing faults.',
    'ESP32 module computing the FFT and extracting imbalance, misalignment and bearing signatures.',
    'Trended against each machine\'s baseline, a rising fault signature warns weeks before a breakdown.',
  ],
},

];
