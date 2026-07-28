/* Automotive 087–090. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   087 — Tire Pressure Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '087',
  domainKey: 'iot',
  emoji: '🛞', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Puts the true pressure of every tyre on a live dashboard and warns the moment one goes low — catching the slow leak before it becomes a blowout.',

  overview: [
    'A tyre losing pressure is one of the most common and most dangerous faults on a vehicle, and the most invisible: a tyre can be dangerously under-inflated and look completely normal, and by the time a driver feels it in the steering the damage — uneven wear, overheating, a potential <b>blowout</b> at speed — is already being done. Under-inflation also quietly wastes fuel and shortens tyre life. This project builds a wireless <b>tyre-pressure monitoring system (TPMS)</b> that measures the actual pressure in every tyre and surfaces it live on a dashboard, warning the moment one drops — turning an invisible, gradual hazard into an obvious, early alert.',
    'The system is inherently <b>wireless</b>, because the sensors ride on a spinning wheel and cannot be wired to the dash. Each tyre carries a small battery-powered sensor (on the valve stem or inside the tyre) that measures pressure — and usually temperature, since heat and pressure move together — and transmits it by radio to a receiver in the cabin. The receiver, built here around an <b>ESP32</b>, listens to all the wheel sensors, shows each tyre\'s pressure on a display, and <b>alerts</b> when any tyre falls below a safe threshold or when a fast pressure drop signals a rapid leak.',
    'The value is early warning of exactly the fault drivers cannot otherwise see. A slow puncture is caught while it is still a top-up, not a blowout; a correctly-inflated set of tyres saves fuel and lasts longer; and a sudden loss is flagged immediately. It is honest that a real automotive TPMS is a safety-regulated system and that the wheel sensors, their batteries and their radio protocol are the hard part (this project focuses on the receiver, alerting and dashboard, working with TPMS sensor modules). But as a wireless per-tyre pressure monitor with low-pressure and rapid-leak alerting, it addresses a leading, invisible cause of tyre failure with exactly the live visibility a driver lacks.',
  ],
  does: [
    'Receives wireless pressure (and temperature) from each wheel sensor',
    'Shows every tyre\'s live pressure on a dashboard',
    'Alerts on low pressure (below a safe threshold)',
    'Alerts on a rapid pressure drop (fast leak/blowout risk)',
    'Flags high tyre temperature',
    'Turns an invisible, gradual hazard into an early warning',
    'Helps save fuel and extend tyre life through correct inflation',
  ],
  features: [
    'Wireless per-tyre pressure + temperature sensing',
    'Live dashboard of all four (or more) tyres',
    'Low-pressure and rapid-leak alerting',
    'High-temperature warning',
    'Per-sensor battery/signal awareness',
    'Configurable thresholds per axle/vehicle',
    'Honest about safety-regulated TPMS and sensor/radio complexity',
  ],
  applications: [
    { t: 'Everyday driving safety', d: 'Early warning of a low or leaking tyre before it becomes a blowout.' },
    { t: 'Fleet / commercial vehicles', d: 'Per-tyre monitoring across many wheels to cut failures and fuel cost.' },
    { t: 'Caravans / trailers', d: 'Monitoring tyres the driver cannot feel through the vehicle.' },
    { t: 'Fuel economy / tyre life', d: 'Keeping every tyre correctly inflated for efficiency and wear.' },
  ],
  skills: [
    'Wireless sensor reception (TPMS sensors / sub-GHz or BLE)',
    'Pressure/temperature interpretation and thresholds',
    'Rapid-drop (rate-of-change) leak detection',
    'Dashboard display and alerting',
    'Per-sensor health (battery/signal) handling',
  ],
  prereq: [
    'Tyre pressure is invisible — a dangerously low tyre looks normal, so live measurement is the whole point.',
    'The system must be wireless: sensors ride on spinning wheels.',
    'Alert on both an absolute low threshold and a rapid drop (fast leak).',
    'Automotive TPMS is safety-regulated; the wheel sensors/radio are the hard part.',
  ],

  parts: ['esp32', 'tft', 'buzzer', 'li18650', 'tp4056'],
  extraParts: [
    { name: 'TPMS wheel sensors', spec: 'Battery-powered pressure+temperature sensors, one per tyre (valve-stem or internal)', qty: 4, price: 2000, note: 'Transmit by radio; the hard, safety-relevant part' },
    { name: 'TPMS receiver front-end', spec: 'Sub-GHz/BLE receiver matched to the sensors', qty: 1, price: 400 },
    { name: 'Dashboard mount', spec: 'In-cabin mount for the display', qty: 1, price: 200 },
    { name: 'Vehicle power tap', spec: '12 V → 5 V, ignition-switched', qty: 1, price: 200 },
  ],
  cost: '₹2,500 – ₹4,500',
  libs: ['wifi', 'tft', 'preferences', 'arduinojson', 'ntp'],

  pins: {
    left: [
      { dev: 'TPMS receiver', devPin: 'DATA/UART', pin: 'GPIO 16/17', sig: 'Wheel-sensor packets' },
      { dev: 'TFT display', devPin: 'SPI', pin: 'GPIO 18/23/5', sig: 'Dashboard' },
    ],
    right: [
      { dev: 'Buzzer', devPin: 'IN', pin: 'GPIO 25', sig: 'Low/leak alert' },
      { dev: 'Warning LED', devPin: 'IN', pin: 'GPIO 26', sig: 'Alert' },
      { dev: 'Vehicle 5V', devPin: 'VIN', pin: '5V', sig: 'Ignition power' },
      { dev: 'Backup Li-ion', devPin: '+', pin: 'BAT', sig: 'Ride-through' },
    ],
  },
  wiringNotes: [
    'Wheel sensors are wireless — you receive their radio packets; you do not wire to the wheels.',
    'Match the receiver front-end to the sensors\' protocol (sub-GHz or BLE) and pairing/IDs.',
    'Drive a display for the live per-tyre dashboard and a buzzer/LED for alerts.',
    'Power from ignition-switched 12 V via a regulator; a small backup cell rides through cranks.',
    'Map each sensor ID to its wheel position (front-left, etc.) during pairing.',
  ],

  block: { columns: [
    { label: 'Each wheel', edge: 'right', blocks: [
      { name: 'TPMS sensor', sub: 'pressure+temp', highlight: true },
      { name: 'Radio TX', sub: 'wireless' },
    ] },
    { label: 'Receive', edge: 'right', blocks: [
      { name: 'Receiver', sub: 'all wheels' },
      { name: 'ESP32', sub: 'map to position' },
    ] },
    { label: 'Judge', edge: 'right', blocks: [
      { name: 'Low?', sub: 'threshold', highlight: true },
      { name: 'Rapid drop?', sub: 'leak' },
    ] },
    { label: 'Show + warn', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'per tyre' },
      { name: 'Alert', sub: 'buzzer/LED' },
    ] },
  ] },
  flow: [
    { t: 'Receive per-wheel pressure/temp', k: 'start' },
    { t: 'Map sensor → wheel position', k: 'proc' },
    { t: 'Below low threshold?', k: 'dec', yes: 'Low-pressure alert', no: 'Check rate of change' },
    { t: 'Low-pressure alert', k: 'io' },
    { t: 'Check rate of change', k: 'proc' },
    { t: 'Rapid drop?', k: 'dec', yes: 'Fast-leak alert', no: 'Update dashboard' },
    { t: 'Fast-leak alert', k: 'io' },
    { t: 'Update dashboard', k: 'end', back: 'Receive per-wheel pressure/temp' },
  ],

  principle: [
    'The problem TPMS solves is one of <b>invisibility</b>. Tyre pressure cannot be judged by eye — a radial tyre can lose a large fraction of its pressure and still look inflated — so drivers routinely run under-inflated without knowing. Under-inflation flexes the sidewall more, which builds <b>heat</b>, which is what actually destroys a tyre: overheating leads to tread separation and blowouts, and blowouts at speed cause loss of control. It also increases rolling resistance (wasting fuel) and causes uneven wear (shortening tyre life). A monitor that simply makes the real pressure <i>visible</i>, continuously, removes the invisibility that makes the hazard so dangerous.',
    'Because the sensors live on rotating wheels, the system is fundamentally <b>wireless</b>. Each wheel carries a self-contained sensor — a pressure transducer, usually a temperature sensor, a small battery, and a radio — that periodically transmits its reading. Direct TPMS (per-wheel sensors) is what gives a true reading of each individual tyre; the receiver\'s job is to listen to all of them, associate each sensor\'s unique ID with its <b>wheel position</b>, and present the fleet of readings coherently. This is why pairing/learning sensor IDs to positions is a core part of setup.',
    'The receiver turns readings into <b>two kinds of alert</b>, because two different failures matter. The first is an <b>absolute low threshold</b>: any tyre below the vehicle\'s recommended pressure (with a margin) is flagged — this catches the slow leak and chronic under-inflation. The second is a <b>rapid rate of change</b>: a pressure that is falling fast signals an active leak or an imminent blowout, and deserves an immediate, louder warning even before it crosses the absolute threshold. Watching both the level and the <i>slope</i> of pressure is what separates a useful safety device from a gauge. Temperature is monitored alongside because an overheating tyre is itself a danger sign.',
    'The design is honest about scope and safety. A production automotive TPMS is a <b>safety-regulated</b> system (mandated on many vehicles) with certified sensors, robust radio protocols, and integration into the vehicle — and the genuinely hard, safety-relevant engineering is in the <b>wheel sensors</b>: their pressure accuracy, battery life over years, sealing, balancing, and interference-resistant radio. This project focuses on the <b>receiver, alerting logic and dashboard</b>, working with existing TPMS sensor modules rather than reinventing the certified wheel unit. Within that honest frame, it delivers the core safety value: continuous, per-tyre visibility and early warning of both slow leaks and fast failures — exactly the information a driver cannot otherwise obtain about one of the most common causes of serious tyre failure.',
  ],
  equations: [
    { t: 'Low-pressure alert', eq: 'For each tyre i with recommended pressure P_rec:\n\n  low if  P_i < P_rec × (1 − m)     (e.g. m = 0.20 → 20% low)\n\nCatches slow leaks and chronic under-inflation before damage.' },
    { t: 'Rapid-leak (rate) alert', eq: 'Track pressure slope over a short window:\n\n  dP/dt = (P_now − P_prev) / Δt\n  fast-leak if  dP/dt < −R_leak   (falling quickly)\n\nWarns of an active leak/blowout even before the absolute\nthreshold is crossed.' },
    { t: 'Temperature / heat check', eq: 'Heat destroys under-inflated tyres:\n\n  high if  T_i > T_max\n\nRising temperature with falling pressure is a strong danger\nsign — flag it prominently.' },
  ],

  assembly: [
    { h: 'Pair the wheel sensors', p: [
      'Fit or use TPMS sensors on each tyre and pair their IDs to wheel positions (front-left, front-right, rear-left, rear-right) in the receiver.',
      'Set each tyre\'s recommended pressure per the vehicle placard.',
    ], warn: 'The wheel sensors are the safety-relevant, precision part. Use proper TPMS sensors; fit valve-stem/internal units correctly and re-balance the wheel if needed.' },
    { h: 'Build the receiver + dashboard', p: [
      'Wire the receiver front-end, display and buzzer/LED to the ESP32; power from ignition-switched 12 V via a regulator with a small backup cell.',
    ] },
    { h: 'Set thresholds and alerts', p: [
      'Configure the low-pressure margin, rapid-drop rate, and high-temperature limit; verify alerts fire clearly.',
    ] },
  ],
  steps: [
    { h: 'Receive, map and judge each tyre', p: [
      'Receive each sensor\'s pressure/temperature, map it to a wheel position, and flag low pressure, a rapid drop, or high temperature.',
    ], code: {
      file: 'tpms.ino', lang: 'cpp',
      body: `struct Tyre { float p, t, pPrev; uint32_t tPrev; };
Tyre tyre[4];                       // FL, FR, RL, RR

const float P_REC = 2.2f;           // bar, recommended
const float LOW_MARGIN = 0.20f;     // 20% low
const float R_LEAK = 0.15f;         // bar/sec rapid drop
const float T_MAX  = 85.0f;         // degC

int alertsFor(int i){
  Tyre& y = tyre[i];
  int a = 0;
  if (y.p < P_REC * (1 - LOW_MARGIN)) a |= 1;      // low pressure
  float dt = (millis() - y.tPrev) / 1000.0f;
  if (dt > 0 && (y.p - y.pPrev)/dt < -R_LEAK) a |= 2; // fast leak
  if (y.t > T_MAX) a |= 4;                         // hot
  y.pPrev = y.p; y.tPrev = millis();
  return a;                                        // bitmask of alerts
}`,
      explain: [
        { ref: 'Tyre tyre[4];                       // FL, FR, RL, RR', txt: 'Each sensor is mapped to a wheel position so an alert names the actual tyre — the driver knows which one to check.' },
        { ref: 'if (y.p < P_REC * (1 - LOW_MARGIN)) a |= 1;      // low pressure', txt: 'The absolute low-threshold check catches the slow leak and chronic under-inflation that are invisible by eye.' },
        { ref: 'if (dt > 0 && (y.p - y.pPrev)/dt < -R_LEAK) a |= 2; // fast leak', txt: 'The rate-of-change check flags an active fast leak or blowout risk even before the absolute threshold is crossed.' },
        { ref: 'if (y.t > T_MAX) a |= 4;                         // hot', txt: 'A hot tyre — often the consequence of under-inflation — is itself a danger sign and flagged.' },
      ],
    } },
    { h: 'Display and alert', p: [
      'Show all tyres\' live pressures/temperatures and raise a clear, escalating alert (louder/faster for a rapid leak) that names the affected wheel.',
    ], tip: 'Escalate: a slow low-pressure warning can be gentle, but a rapid drop deserves an immediate, unmistakable alert — the failure modes are not equally urgent.' },
  ],

  code: [{
    file: 'tpms-receiver.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Tyre-Pressure Monitor (TPMS) — ESP32 receiver + dashboard

   Receives wireless pressure/temperature from per-wheel sensors,
   maps each to a wheel position, and alerts on low pressure, a rapid
   drop (fast leak) or high temperature. Live per-tyre dashboard.
   ══════════════════════════════════════════════════════════════════ */

#include <Preferences.h>

struct Tyre { uint32_t id; float p, t, pPrev; uint32_t tPrev; bool seen; };
Tyre tyre[4];                              // FL, FR, RL, RR
const char* POS[4] = {"FL","FR","RL","RR"};

const float P_REC = 2.2f;                  // recommended, bar
const float LOW_MARGIN = 0.20f;
const float R_LEAK = 0.15f;                // bar/sec
const float T_MAX  = 85.0f;
const uint32_t STALE_MS = 300000;          // 5 min without a packet

int wheelOf(uint32_t id){                  // sensor ID -> paired position
  for (int i=0;i<4;i++) if (tyre[i].id==id) return i;
  return -1;
}

int judge(int i){
  Tyre& y = tyre[i]; int a = 0;
  if (y.p < P_REC*(1-LOW_MARGIN)) a |= 1;                 // low
  float dt = (millis()-y.tPrev)/1000.0f;
  if (dt>0 && (y.p-y.pPrev)/dt < -R_LEAK) a |= 2;         // fast leak
  if (y.t > T_MAX) a |= 4;                                // hot
  y.pPrev = y.p; y.tPrev = millis();
  return a;
}

void onPacket(uint32_t id, float p, float t){
  int i = wheelOf(id);
  if (i < 0) return;                       // unknown/other vehicle
  tyre[i].p = p; tyre[i].t = t; tyre[i].seen = true;
  int a = judge(i);
  drawTyre(i, p, t, a);                     // update dashboard cell
  if (a & 2) alert(URGENT, POS[i], "FAST LEAK");
  else if (a & 1) alert(WARN, POS[i], "LOW");
  else if (a & 4) alert(WARN, POS[i], "HOT");
}

void checkStale(){
  for (int i=0;i<4;i++)
    if (tyre[i].seen && millis()-tyre[i].tPrev > STALE_MS)
      alert(WARN, POS[i], "NO SIGNAL");     // sensor battery/fault
}

void setup(){
  Serial.begin(115200);
  loadPairing(tyre);                        // sensor IDs <-> positions
  receiverInit(onPacket);                   // sub-GHz/BLE front-end
  displayInit();
}

void loop(){
  receiverPoll();                           // dispatches onPacket()
  checkStale();
  delay(200);
}`,
    explain: [
      { ref: 'int wheelOf(uint32_t id){                  // sensor ID -> paired position', txt: 'Each wireless sensor is identified by ID and mapped to its wheel position, so alerts and the dashboard name the actual tyre.' },
      { ref: 'if (y.p < P_REC*(1-LOW_MARGIN)) a |= 1;                 // low', txt: 'The absolute threshold catches slow leaks and chronic under-inflation — the invisible, gradual hazard.' },
      { ref: 'if (dt>0 && (y.p-y.pPrev)/dt < -R_LEAK) a |= 2;         // fast leak', txt: 'The rate check flags a fast leak/blowout risk immediately, escalated above a mere low warning.' },
      { ref: 'if (i < 0) return;                       // unknown/other vehicle', txt: 'Only paired sensors are accepted, so a passing vehicle\'s TPMS packets are ignored.' },
      { ref: 'if (tyre[i].seen && millis()-tyre[i].tPrev > STALE_MS)', txt: 'A sensor that goes silent (dead battery/fault) is flagged, since a missing tyre reading is itself a problem.' },
    ],
  }],

  config: [
    'Pair each sensor ID to a wheel position and set the recommended pressure per axle.',
    'Configure the low-pressure margin, rapid-drop rate and high-temperature limit.',
    'Configure alert escalation (gentle for low, urgent for fast leak).',
    'Configure stale-sensor (no-signal/battery) handling.',
  ],
  calibration: [
    { h: 'Pressure accuracy', p: [
      'Cross-check sensor readings against a known-good gauge at a couple of pressures.',
    ] },
    { h: 'Thresholds', p: [
      'Set the low margin and rapid-drop rate so real problems alert without nuisance warnings from normal temperature-driven pressure changes.',
    ] },
    { h: 'Pairing/position', p: [
      'Confirm each alert names the correct wheel by deliberately deflating one tyre slightly.',
    ] },
  ],
  testing: [
    { step: 'Deflate one tyre below threshold', expect: 'Correct wheel flagged LOW' },
    { step: 'Release air quickly', expect: 'FAST LEAK (urgent) on that wheel' },
    { step: 'Heat a tyre (or simulate)', expect: 'HOT warning' },
    { step: 'Remove a sensor', expect: 'NO SIGNAL for that position' },
    { step: 'Normal driving warm-up', expect: 'Pressure rises with temp — no false low alert' },
    { step: 'Park near another TPMS vehicle', expect: 'Foreign sensors ignored' },
  ],
  output: [
    'A live dashboard of every tyre\'s pressure and temperature, with clear low/fast-leak/hot alerts naming the affected wheel.',
    { file: 'tpms-status.json', lang: 'json', body: `{
  "FL": { "bar": 2.2, "degC": 34, "state": "ok" },
  "FR": { "bar": 2.2, "degC": 35, "state": "ok" },
  "RL": { "bar": 1.6, "degC": 48, "state": "LOW+HOT" },
  "RR": { "bar": 2.1, "degC": 36, "state": "ok" }
}` },
    'Rear-left is low and running hot — flagged early, before the under-inflation could overheat the tyre into a blowout; the other three read normal.',
  ],
  troubleshoot: [
    { sym: 'No readings from a wheel', cause: 'Sensor battery/pairing/range', fix: 'Re-pair; check sensor battery; verify receiver front-end matches the sensor protocol' },
    { sym: 'Alerts on the wrong wheel', cause: 'Position mapping', fix: 'Re-pair sensor IDs to positions; verify by deflating one tyre' },
    { sym: 'Nuisance low alerts when cold', cause: 'Threshold vs temperature effect', fix: 'Account for cold vs warm pressure; set thresholds sensibly' },
    { sym: 'Foreign sensors show up', cause: 'Accepting unpaired IDs', fix: 'Only accept paired sensor IDs' },
    { sym: 'Missed fast leak', cause: 'No rate check / slow update', fix: 'Add rate-of-change detection; ensure timely packets' },
  ],

  iot: {
    protoShort: 'Wireless wheel sensors → in-cabin receiver (optional cloud)',
    net: {
      nodes: [{ name: 'Wheel sensors', sub: 'x4, wireless' }, { name: 'Receiver', sub: 'ESP32' }],
      protocol: 'Sub-GHz/BLE', gateway: 'ESP32', gatewaySub: 'in cabin',
      uplink: 'Wi-Fi/cellular', cloud: 'Fleet TPMS (optional)', cloudSub: 'per-vehicle tyres',
      clients: [{ name: 'Driver', sub: 'dashboard' }, { name: 'Fleet', sub: 'tyre health' }],
    },
    protocol: ['Wheel sensors broadcast pressure/temperature to the in-cabin receiver; for fleets the receiver can forward per-tyre status to a platform.'],
    topics: [
      { t: 'tpms/<veh>/tyre/<pos>', dir: 'receiver → platform', payload: 'pressure, temperature, state' },
      { t: 'tpms/<veh>/alert', dir: 'receiver → fleet', payload: 'low / fast-leak / hot / no-signal' },
    ],
    cloud: ['For fleets, a platform tracks every tyre across every vehicle so under-inflation and leaks are managed before failures.'],
    dashboard: ['A per-vehicle tyre view with pressures, temperatures and alerts; a fleet roll-up of tyre health.'],
    mobile: ['Low-pressure and fast-leak alerts naming the vehicle and wheel.'],
    security: [
      'Accept only paired sensor IDs; ignore foreign/spoof packets.',
      'Alerting is local and immediate; cloud is optional for fleets.',
      'Tyre data is low-sensitivity but per-vehicle — secure fleet uploads.',
    ],
  },

  perf: [
    'Judge both absolute pressure and its rate of change for slow and fast leaks.',
    'Map every sensor to a position so alerts name the wheel.',
    'Flag stale sensors (battery/fault) as a real condition.',
    'Escalate urgency: fast leak louder than a low warning.',
  ],
  safety: [
    'This aids the driver; a production automotive TPMS is a safety-regulated system — treat this as a monitor, not a certified replacement.',
    'Fit wheel sensors correctly and re-balance wheels as needed; a poorly fitted sensor is a hazard.',
    'Do not let the display distract driving; alerts should be glanceable/audible.',
    'Correct inflation is a safety and fuel matter — act on low readings promptly.',
  ],
  maintenance: [
    'Replace wheel-sensor batteries before they die; act on no-signal flags.',
    'Re-verify pressure accuracy periodically against a gauge.',
    'Re-pair positions after tyre rotation.',
    'Keep recommended pressures updated for load/vehicle.',
  ],
  future: [
    'Add automatic tyre-rotation-aware position learning.',
    'Add temperature-compensated pressure (cold-equivalent).',
    'Add fleet trend analytics (slow-leak detection over days).',
    'Add tread-wear estimation from long-term pressure/temperature.',
  ],
  faq: [
    { q: 'Why not just check tyres by eye?', a: 'Because a dangerously under-inflated tyre looks normal — a radial can lose a large fraction of its pressure with no visible sag. Pressure is invisible, which is exactly why continuous measurement matters.' },
    { q: 'Why does it need to be wireless?', a: 'The sensors ride on spinning wheels and cannot be wired to the dashboard, so each is a self-contained, battery-powered radio transmitter that the cabin receiver listens to.' },
    { q: 'Why two kinds of alert?', a: 'A slow leak needs an absolute low-pressure threshold; a fast leak or blowout risk needs a rate-of-change check that fires immediately. Watching both the level and the slope catches both failure modes.' },
    { q: 'Why monitor temperature too?', a: 'Heat is what actually destroys an under-inflated tyre — the flexing sidewall overheats and can separate. A hot tyre, especially with falling pressure, is a strong danger sign.' },
    { q: 'Is this a real automotive TPMS?', a: 'It provides the core value — per-tyre visibility and early warning — but a production TPMS is a safety-regulated system with certified sensors. The genuinely hard, safety-relevant part is the wheel sensor; this project focuses on the receiver, alerting and dashboard.' },
  ],
  refs: [
    { t: 'Tyre-pressure monitoring system', u: 'https://en.wikipedia.org/wiki/Tire-pressure_monitoring_system', s: 'Reference' },
    { t: 'Tyre safety and under-inflation', u: 'https://en.wikipedia.org/wiki/Tire#Inflation', s: 'Reference' },
    { t: 'Blowout / tread separation', u: 'https://en.wikipedia.org/wiki/Tire_blowout', s: 'Reference' },
    { t: 'ESP32', u: 'https://www.espressif.com/en/products/socs/esp32', s: 'Espressif' },
    { t: 'Rolling resistance and fuel economy', u: 'https://en.wikipedia.org/wiki/Rolling_resistance', s: 'Reference' },
  ],
  images: ['car', 'esp32', 'battery'],
  imageCaptions: [
    'A wireless TPMS makes every tyre\'s true pressure visible and warns before a low or leaking tyre becomes a blowout.',
    'The ESP32 receiver listens to per-wheel sensors and maps each to its position for named alerts.',
    'Each wheel sensor is a small battery-powered radio unit — the safety-relevant, precision part of the system.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   088 — EV Range & Trip Logger
   ══════════════════════════════════════════════════════════════════ */
{
  id: '088',
  domainKey: 'iot',
  emoji: '🔋', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Logs an electric vehicle\'s real energy use trip by trip and turns it into an honest, condition-aware range estimate you can actually trust.',

  overview: [
    'Range anxiety is the defining worry of electric driving, and it is made worse by range <i>numbers you cannot trust</i>: the dashboard\'s guess-o-meter swings wildly, the official range assumes gentle conditions, and neither tells you what your car will really do on this route, in this weather, driven the way you drive. This project builds a logger that measures an EV\'s <b>real energy consumption</b> trip by trip and uses that history to produce an <b>honest, condition-aware range estimate</b> — replacing an optimistic single number with evidence from how the car is actually used.',
    'The system reads the vehicle\'s energy and driving data (via OBD-II/CAN where available, plus GPS for distance and speed) and logs each trip: <b>energy used</b> (kWh), <b>distance</b>, average speed, and the conditions that dominate EV consumption — chiefly <b>temperature</b> (cold weather and cabin heating slash range), speed (aerodynamic drag rises sharply with speed), and terrain (climbs cost energy, regen returns some). From this it computes real-world <b>efficiency</b> (Wh/km or km/kWh) and, crucially, how that efficiency <i>varies with conditions</i>.',
    'The payoff is a range estimate grounded in reality: given the current battery state of charge and the conditions and driving style at hand, how far can this car actually go — with the honesty to say the estimate is lower in the cold, at motorway speed, or up a long climb. It is honest that OBD/CAN access and signals vary by EV (some expose rich data, some little), that this reads and logs rather than interfering with the vehicle, and that it complements — not replaces — the car\'s own systems. But as a real-consumption trip logger that turns measured history into a trustworthy, condition-aware range estimate, it attacks range anxiety at its root: not with a more optimistic number, but with an honest one.',
  ],
  does: [
    'Logs each trip: energy used, distance, speed, conditions',
    'Computes real-world efficiency (Wh/km, km/kWh)',
    'Learns how consumption varies with temperature, speed and terrain',
    'Produces an honest, condition-aware range estimate from state of charge',
    'Records regen and climb/descent effects on energy',
    'Replaces an optimistic single number with measured evidence',
    'Reads/logs without interfering with the vehicle',
  ],
  features: [
    'Trip-by-trip energy/distance/condition logging',
    'Real-world efficiency computation',
    'Condition-aware (temperature/speed/terrain) range model',
    'Honest range estimate vs current state of charge',
    'Regen and elevation awareness',
    'History and trends for driving/planning',
    'Honest about OBD/CAN variability and read-only scope',
  ],
  applications: [
    { t: 'Range confidence / planning', d: 'Trustworthy range for a specific route, weather and driving style.' },
    { t: 'Efficiency coaching', d: 'Seeing how speed and heating affect real consumption.' },
    { t: 'Fleet EV management', d: 'Real efficiency and range across an EV fleet for scheduling and charging.' },
    { t: 'Battery/health insight', d: 'Long-term efficiency trends that hint at battery condition.' },
  ],
  skills: [
    'OBD-II/CAN reading of EV energy/SoC signals (where available)',
    'Energy/efficiency computation (kWh, Wh/km)',
    'Condition modelling (temperature/speed/terrain vs consumption)',
    'Range estimation from state of charge and conditions',
    'Trip logging and trend analysis',
  ],
  prereq: [
    'The problem is untrustworthy range numbers — the fix is estimates grounded in measured real consumption.',
    'EV consumption is dominated by temperature, speed and terrain — the estimate must be condition-aware.',
    'OBD/CAN signals vary by EV; degrade gracefully and use GPS as a backstop.',
    'Read and log; do not interfere with the vehicle.',
  ],

  parts: ['esp32', 'neo6m', 'sdcard', 'oled', 'ds18b20'],
  extraParts: [
    { name: 'OBD-II / CAN interface', spec: 'ELM327 or CAN transceiver for EV energy/SoC signals', qty: 1, price: 600, note: 'Signals vary by EV; read-only' },
    { name: 'GPS module', spec: 'Distance, speed and elevation backstop', qty: 1, price: 400 },
    { name: 'Temperature sensor', spec: 'Ambient temperature (dominant range factor)', qty: 1, price: 100 },
    { name: 'Vehicle power tap', spec: '12 V accessory → 5 V, ignition-switched', qty: 1, price: 200 },
  ],
  cost: '₹2,500 – ₹4,000',
  libs: ['wifi', 'tinygps', 'onewire', 'ssd1306', 'sqlite', 'arduinojson'],

  pins: {
    left: [
      { dev: 'OBD/CAN', devPin: 'UART/CAN', pin: 'GPIO 16/17', sig: 'Energy, SoC, speed' },
      { dev: 'GPS', devPin: 'TX/RX', pin: 'GPIO 26/25', sig: 'Distance/speed/elev' },
      { dev: 'Temp sensor', devPin: 'DATA', pin: 'GPIO 4', sig: 'Ambient temp' },
    ],
    right: [
      { dev: 'SD card', devPin: 'SPI', pin: 'GPIO 18/23/5', sig: 'Trip log' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Range/efficiency' },
      { dev: 'Vehicle 5V', devPin: 'VIN', pin: '5V', sig: 'Ignition power' },
    ],
  },
  wiringNotes: [
    'Interface OBD-II/CAN read-only for energy, state of charge and speed where the EV exposes them.',
    'Add GPS for distance/speed/elevation as a backstop and for terrain awareness.',
    'Add an ambient temperature sensor — temperature is the dominant range factor.',
    'Log trips to SD and show live range/efficiency on the OLED.',
    'Read and log only; never write to or interfere with the vehicle.',
  ],

  block: { columns: [
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'OBD/CAN', sub: 'energy/SoC', highlight: true },
      { name: 'GPS', sub: 'dist/speed/elev' },
      { name: 'Temp', sub: 'ambient' },
    ] },
    { label: 'Log trip', edge: 'right', blocks: [
      { name: 'kWh, km', sub: 'per trip' },
      { name: 'Conditions', sub: 'temp/speed/terrain' },
    ] },
    { label: 'Model', edge: 'right', blocks: [
      { name: 'Efficiency', sub: 'Wh/km', highlight: true },
      { name: 'vs conditions', sub: 'learned' },
    ] },
    { label: 'Estimate', edge: 'none', blocks: [
      { name: 'Honest range', sub: 'from SoC' },
      { name: 'Condition-aware', sub: 'cold/fast/climb' },
    ] },
  ] },
  flow: [
    { t: 'Read energy/SoC, GPS, temperature', k: 'start' },
    { t: 'Trip in progress?', k: 'dec', yes: 'Accumulate energy/distance/conditions', no: 'Close + log trip' },
    { t: 'Accumulate energy/distance/conditions', k: 'proc' },
    { t: 'Close + log trip', k: 'io' },
    { t: 'Update efficiency model (by condition)', k: 'proc' },
    { t: 'Estimate range from SoC + conditions', k: 'proc' },
    { t: 'Show honest, condition-aware range', k: 'end', back: 'Read energy/SoC, GPS, temperature' },
  ],

  principle: [
    'Range anxiety is really <b>trust</b> anxiety. An EV usually has plenty of range for the journey; what it lacks is a number the driver believes. The dashboard estimate is jumpy and optimistic, the rated range assumes benign conditions, and neither reflects <i>this</i> car, route, weather and driver. The cure is not a cleverer guess from the same thin inputs — it is grounding the estimate in <b>measured real consumption</b>, so the number comes from evidence rather than optimism.',
    'That starts with honest <b>per-trip measurement</b>. For each trip the logger records the <b>energy actually used</b> (kWh drawn from the battery), the <b>distance</b> covered, and the conditions in force. Dividing energy by distance gives real-world <b>efficiency</b> — Wh/km or km/kWh — which is the true, personal consumption of this vehicle as driven, not a laboratory figure. Accumulating this across many trips builds a picture far more trustworthy than any single dashboard reading.',
    'The insight that makes the estimate <i>useful</i> is that EV consumption is <b>dominated by a few conditions</b>, and the model must be aware of them. <b>Temperature</b> is the biggest: cold weather raises battery internal resistance and, more importantly, cabin heating draws heavily from the same battery, so winter range can fall dramatically. <b>Speed</b> is next: aerodynamic drag rises with the square of speed, so motorway cruising consumes far more per kilometre than town driving. <b>Terrain</b> matters too: climbs cost energy while descents return some through <b>regenerative braking</b>. A logger that records efficiency <i>alongside</i> these conditions can learn how consumption varies with them — cold vs warm, fast vs slow, hilly vs flat — instead of pretending consumption is constant.',
    'From that model comes the deliverable: an <b>honest, condition-aware range estimate</b>. Given the current <b>state of charge</b> and the conditions and driving at hand, the logger estimates how far the car can really go — and, crucially, has the honesty to say the number is <i>lower</i> in the cold, at speed, or up a climb, rather than flattering the driver. That honesty is the point: a range estimate you can trust because it is built from what your car actually does. The design is candid about its constraints — OBD/CAN signal availability varies widely between EVs (some expose rich battery data, others almost none), GPS provides a backstop for distance/speed/elevation, everything is <b>read-only</b> and non-interfering, and it complements rather than replaces the vehicle\'s own systems. Within that frame it does the one thing that actually reduces range anxiety: turn measured history into a range number worth believing.',
  ],
  equations: [
    { t: 'Real-world efficiency', eq: 'Per trip:\n\n  efficiency (Wh/km) = energy_used_Wh / distance_km\n  range-equiv (km/kWh) = distance_km / energy_used_kWh\n\nThis is the car\'s TRUE consumption as driven — not a rated\nlab figure.' },
    { t: 'Condition-aware consumption', eq: 'Consumption depends on conditions:\n\n  E(v,T,grade) ≈ E_base\n    × f_speed(v)     (drag ~ v²  → higher at speed)\n    × f_temp(T)      (cold + heating → much higher)\n    × f_grade(grade) (climb costs; regen returns some)\n\nLearned from logged trips, not assumed constant.' },
    { t: 'Honest range estimate', eq: 'range_km = (SoC × usable_kWh) / efficiency(conditions)\n\nUse the efficiency for the CURRENT conditions, so the estimate\nfalls honestly in cold / at speed / uphill instead of\nflattering the driver.' },
  ],

  assembly: [
    { h: 'Interface energy and conditions (read-only)', p: [
      'Read EV energy/SoC/speed via OBD-II/CAN where available; add GPS for distance/speed/elevation and an ambient temperature sensor.',
      'Handle EVs that expose little data by leaning on GPS/temperature.',
    ], warn: 'Read and log only — never write to or interfere with the vehicle. OBD/CAN signals vary widely between EVs; degrade gracefully.' },
    { h: 'Log trips and compute efficiency', p: [
      'Accumulate energy, distance and conditions per trip; compute real-world efficiency and store the trip.',
    ] },
    { h: 'Build the condition-aware estimate', p: [
      'Learn how efficiency varies with temperature, speed and terrain, and estimate range from the current state of charge and conditions — honestly.',
    ] },
  ],
  steps: [
    { h: 'Accumulate a trip and its conditions', p: [
      'While driving, accumulate energy used and distance, and record the dominant conditions (temperature, speed, elevation change).',
    ], code: {
      file: 'trip.py', lang: 'python',
      body: `class Trip:
    def __init__(self):
        self.kwh = 0.0; self.km = 0.0
        self.temp_sum = 0.0; self.samples = 0
        self.climb_m = 0.0; self.v_sum = 0.0

    def sample(self, power_kw, dt_h, dist_km, temp_c, dv_elev_m, speed):
        self.kwh += power_kw * dt_h          # energy actually drawn
        self.km  += dist_km                  # distance covered
        self.temp_sum += temp_c; self.samples += 1
        if dv_elev_m > 0: self.climb_m += dv_elev_m   # climbs cost energy
        self.v_sum += speed

    def summary(self):
        n = max(self.samples, 1)
        eff = (self.kwh * 1000.0) / self.km if self.km else 0   # Wh/km
        return {
            "kwh": round(self.kwh, 2), "km": round(self.km, 1),
            "wh_per_km": round(eff, 0),
            "avg_temp": round(self.temp_sum / n, 1),
            "avg_speed": round(self.v_sum / n, 1),
            "climb_m": round(self.climb_m, 0),
        }`,
      explain: [
        { ref: 'self.kwh += power_kw * dt_h          # energy actually drawn', txt: 'Energy is the real quantity used — integrated from battery power over time — the basis of trustworthy efficiency, not a rated figure.' },
        { ref: 'eff = (self.kwh * 1000.0) / self.km if self.km else 0   # Wh/km', txt: 'Real-world efficiency is energy over distance — the car\'s true consumption as actually driven.' },
        { ref: 'self.temp_sum += temp_c; self.samples += 1', txt: 'Temperature is logged with the trip because it is the single biggest driver of EV consumption.' },
        { ref: 'if dv_elev_m > 0: self.climb_m += dv_elev_m   # climbs cost energy', txt: 'Climbs are recorded because terrain materially changes energy use — the estimate must be terrain-aware.' },
      ],
    } },
    { h: 'Estimate range honestly for the conditions', p: [
      'From the current state of charge and the efficiency for the present conditions, estimate range — and let it fall honestly in the cold, at speed, or uphill.',
    ], tip: 'Prefer honest and slightly conservative over optimistic. A range number that under-promises and over-delivers builds the trust that cures range anxiety.' },
  ],

  code: [{
    file: 'ev_range_logger.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
EV Range & Trip Logger

Logs real per-trip energy/distance/conditions, computes real-world
efficiency, learns how consumption varies with temperature/speed/terrain,
and produces an HONEST, condition-aware range estimate from state of charge.
Read-only: reads and logs, never interferes with the vehicle.
"""
import statistics, json

USABLE_KWH = 40.0                        # battery usable capacity

class EfficiencyModel:
    """Learns Wh/km bucketed by the dominant conditions."""
    def __init__(self):
        self.buckets = {}                # (temp_band, speed_band) -> [wh/km,...]

    @staticmethod
    def bands(temp_c, speed):
        tb = "cold" if temp_c < 10 else "mild" if temp_c < 25 else "warm"
        sb = "town" if speed < 45 else "mixed" if speed < 80 else "motorway"
        return (tb, sb)

    def learn(self, trip):
        key = self.bands(trip["avg_temp"], trip["avg_speed"])
        self.buckets.setdefault(key, []).append(trip["wh_per_km"])

    def wh_per_km(self, temp_c, speed):
        key = self.bands(temp_c, speed)
        hist = self.buckets.get(key)
        if hist:
            return statistics.median(hist)          # this car, these conditions
        # fall back to any history, then a sane default
        allv = [v for h in self.buckets.values() for v in h]
        return statistics.median(allv) if allv else 160.0

def honest_range_km(model, soc_frac, temp_c, speed):
    wh_km = model.wh_per_km(temp_c, speed)          # condition-aware
    available_wh = soc_frac * USABLE_KWH * 1000.0
    est = available_wh / wh_km
    return round(est), round(wh_km)                 # km, Wh/km used

def log_trip(model, trip, path="trips.jsonl"):
    model.learn(trip)                               # update the model
    with open(path, "a") as f:
        f.write(json.dumps(trip) + "\\n")           # keep the evidence

if __name__ == "__main__":
    model = EfficiencyModel()
    # ... each completed trip:
    #   trip = Trip(...).summary(); log_trip(model, trip)
    # live estimate for current conditions:
    km, wh = honest_range_km(model, soc_frac=0.62, temp_c=4, speed=95)
    print(f"Honest range ~{km} km at {wh} Wh/km "
          f"(cold + motorway → lower, and we say so)")`,
    explain: [
      { ref: 'self.buckets = {}                # (temp_band, speed_band) -> [wh/km,...]', txt: 'Efficiency is stored bucketed by conditions, so the model knows this car\'s consumption cold-and-fast vs warm-and-slow — the key to a useful estimate.' },
      { ref: 'return statistics.median(hist)          # this car, these conditions', txt: 'The estimate uses the measured efficiency for the current conditions from this car\'s own history — evidence, not optimism.' },
      { ref: 'available_wh = soc_frac * USABLE_KWH * 1000.0', txt: 'Range is energy available (state of charge × usable capacity) divided by real consumption for the conditions.' },
      { ref: 'f.write(json.dumps(trip) + "\\n")           # keep the evidence', txt: 'Every trip is logged, so the model keeps improving and the range number stays grounded in real history.' },
      { ref: 'f"(cold + motorway → lower, and we say so)")', txt: 'The estimate is honest: it falls in the cold and at speed rather than flattering the driver — the honesty that builds trust and cures range anxiety.' },
    ],
  }],

  config: [
    'Configure the OBD/CAN signals available on your EV and the usable battery capacity.',
    'Configure GPS and temperature inputs; set condition bands (temp/speed) for the model.',
    'Configure trip start/stop detection and logging.',
    'Configure conservative rounding for the range estimate.',
  ],
  calibration: [
    { h: 'Energy accuracy', p: [
      'Cross-check logged trip energy against the car\'s own trip energy or a full charge\'s known kWh.',
    ] },
    { h: 'Condition bands', p: [
      'Verify efficiency really does separate across temperature and speed bands after a few varied trips.',
    ] },
    { h: 'Range honesty', p: [
      'Compare estimated vs actual range achieved; tune to be honest/slightly conservative, not optimistic.',
    ] },
  ],
  testing: [
    { step: 'Log a warm town trip', expect: 'Low Wh/km recorded in warm/town bucket' },
    { step: 'Log a cold motorway trip', expect: 'Much higher Wh/km in cold/motorway bucket' },
    { step: 'Estimate range in the cold at speed', expect: 'Honestly lower range than warm/town' },
    { step: 'Drive a climb then descent', expect: 'Climb energy up; regen recovers some on descent' },
    { step: 'EV exposes little OBD data', expect: 'Falls back to GPS/temperature gracefully' },
    { step: 'Compare estimate to reality', expect: 'Estimate honest / slightly conservative' },
  ],
  output: [
    'A live, condition-aware range estimate plus a trip log of real energy, distance, efficiency and conditions.',
    { file: 'trip-summary.json', lang: 'json', body: `{
  "km": 42.6,
  "kwh": 9.1,
  "wh_per_km": 214,
  "avg_temp": 4,
  "avg_speed": 95,
  "climb_m": 180,
  "range_estimate_km": 116,
  "note": "cold + motorway -> honest lower range"
}` },
    'A cold motorway trip logged at 214 Wh/km — far above a gentle-day figure — and the range estimate honestly reflects it rather than promising the rated number.',
  ],
  troubleshoot: [
    { sym: 'Range estimate too optimistic', cause: 'Ignoring conditions', fix: 'Use condition-aware efficiency; prefer conservative rounding' },
    { sym: 'Little/no OBD data', cause: 'EV exposes few signals', fix: 'Fall back to GPS distance/speed and temperature; use battery kWh from charging' },
    { sym: 'Efficiency looks wrong', cause: 'Energy vs distance mismatch', fix: 'Cross-check energy against a known charge; verify distance from GPS/odometer' },
    { sym: 'No condition sensitivity', cause: 'Not bucketing by condition', fix: 'Bucket efficiency by temperature/speed; log enough varied trips' },
    { sym: 'Interfering with the car', cause: 'Writing to the bus', fix: 'Read-only; never write to or interfere with the vehicle' },
  ],

  iot: {
    protoShort: 'In-vehicle logging; optional Wi-Fi/cellular sync',
    net: {
      nodes: [{ name: 'EV logger', sub: 'ESP32' }, { name: 'Other EVs', sub: 'fleet' }],
      protocol: 'Wi-Fi/cellular', gateway: 'Phone/router', gatewaySub: 'when parked',
      uplink: 'HTTPS', cloud: 'Trip/efficiency store', cloudSub: 'history + model',
      clients: [{ name: 'Driver', sub: 'range/efficiency' }, { name: 'Fleet', sub: 'EV efficiency' }],
    },
    protocol: ['Trips are logged locally and can sync to a store for history/trends; the condition-aware model improves as trips accumulate.'],
    topics: [
      { t: 'ev/<veh>/trip', dir: 'logger → store', payload: 'energy, distance, efficiency, conditions' },
      { t: 'ev/<veh>/range', dir: 'logger → app', payload: 'condition-aware range estimate' },
    ],
    cloud: ['A store of real trips per vehicle powers honest range, efficiency trends and (for fleets) charging/scheduling insight.'],
    dashboard: ['Trip history, real efficiency vs conditions, and a range estimate you can trust.'],
    mobile: ['Live condition-aware range and pre-trip range for a planned route/weather.'],
    security: [
      'Read-only vehicle access; never interfere.',
      'Trip/location data is personal — secure and minimise it.',
      'Local logging works offline; sync is optional.',
    ],
  },

  perf: [
    'Log real energy/distance per trip; compute true efficiency.',
    'Bucket efficiency by condition for an accurate estimate.',
    'Estimate range from state of charge honestly, not optimistically.',
    'Degrade gracefully when OBD signals are sparse.',
  ],
  safety: [
    'Read and log only — never write to or interfere with the vehicle.',
    'Do not let the display distract driving; keep it glanceable.',
    'Trip and location data are personal — secure and minimise them.',
    'This complements the vehicle\'s own systems; do not rely on it as a sole safety-critical gauge.',
  ],
  maintenance: [
    'Keep logging trips so the condition model stays current.',
    'Re-check energy accuracy against known charges periodically.',
    'Update usable capacity as the battery ages (efficiency trends hint at health).',
    'Verify OBD/CAN signals after vehicle software updates.',
  ],
  future: [
    'Add route-based range (elevation/weather along a planned route).',
    'Add battery-health estimation from long-term efficiency/capacity trends.',
    'Add charging-cost and eco-driving coaching.',
    'Add fleet scheduling from real per-vehicle efficiency.',
  ],
  faq: [
    { q: 'Why is the car\'s own range estimate not enough?', a: 'It is jumpy and tends to be optimistic, and it does not reflect this car, route, weather and driving. Grounding the estimate in your own measured trips makes it trustworthy.' },
    { q: 'What makes EV range vary so much?', a: 'Mainly temperature (cold weather and cabin heating cut range sharply), speed (drag rises with the square of speed), and terrain (climbs cost energy, regen returns some). A useful estimate must be aware of these.' },
    { q: 'Where does the energy figure come from?', a: 'From OBD-II/CAN where the EV exposes battery power/state of charge, with GPS for distance/speed/elevation as a backstop. Energy over distance gives real efficiency.' },
    { q: 'Why prefer a conservative estimate?', a: 'Because trust is the goal. A range number that under-promises and over-delivers cures range anxiety; an optimistic one that strands you destroys confidence.' },
    { q: 'Does it work on any EV?', a: 'Partly — OBD/CAN signals vary widely. Where the car exposes rich data it is precise; where it exposes little, the logger leans on GPS and temperature and is honest about the limits. It is read-only and never interferes with the vehicle.' },
  ],
  refs: [
    { t: 'Electric vehicle range', u: 'https://en.wikipedia.org/wiki/Electric_vehicle_range', s: 'Reference' },
    { t: 'Range anxiety', u: 'https://en.wikipedia.org/wiki/Range_anxiety', s: 'Reference' },
    { t: 'Regenerative braking', u: 'https://en.wikipedia.org/wiki/Regenerative_braking', s: 'Reference' },
    { t: 'Aerodynamic drag and speed', u: 'https://en.wikipedia.org/wiki/Drag_(physics)', s: 'Reference' },
    { t: 'OBD-II / EV data', u: 'https://en.wikipedia.org/wiki/On-board_diagnostics', s: 'Reference' },
  ],
  images: ['ev', 'gps', 'battery'],
  imageCaptions: [
    'An EV range logger turns measured, condition-aware consumption into a range number you can actually trust.',
    'GPS and temperature capture the conditions — speed, cold, terrain — that dominate real EV consumption.',
    'Real per-trip energy history replaces an optimistic guess-o-meter with honest evidence.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   089 — Cold-Chain Truck Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '089',
  domainKey: 'iot',
  emoji: '🧊', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Guards refrigerated cargo in transit — logging temperature the whole journey, alerting the instant it drifts, and proving the cold chain never broke.',

  overview: [
    'A refrigerated truck carries cargo whose entire value depends on staying cold — vaccines, food, pharmaceuticals — and a single unnoticed excursion can spoil a whole load or, worse, render medicine unsafe while it still looks fine. The danger is that a temperature breach in transit is <b>silent</b>: a failing reefer unit, a door left ajar, or a hot-day soak can push cargo out of range for hours with no one aware until delivery, when the damage is already done. This project builds a cold-chain monitor that rides with the load, <b>continuously logs temperature</b>, <b>alerts the instant it drifts</b> out of range, and produces the <b>tamper-evident record</b> that proves the cold chain held.',
    'The system places temperature sensors in the cargo space (and, where it matters, at multiple points, since a trailer is not uniform), reads them continuously, and does three things. It <b>logs</b> every reading with a timestamp and location (GPS), building the complete journey record. It <b>alerts</b> — over cellular — the moment temperature leaves the safe band, so a problem is caught <i>in transit</i> while there is still time to act (fix the reefer, reroute, prioritise the load), not discovered at the door. And it retains the log locally even without signal, so the record is never lost.',
    'The value is threefold: <b>protect the cargo</b> (catch excursions in time to act), <b>prove compliance</b> (an auditable temperature-vs-time record for food-safety and pharmaceutical regulations), and <b>assign accountability</b> (know exactly when and where a breach happened). It is honest that cold-chain compliance is a regulated domain with validated equipment requirements, that sensor placement and calibration are critical, and that the record must be trustworthy to be worth anything. But as a journey-long, alerting, location-stamped cold-chain logger, it turns the silent, expensive risk of a broken cold chain into an early warning and a defensible proof.',
  ],
  does: [
    'Continuously logs cargo temperature with time and location',
    'Alerts the instant temperature leaves the safe band',
    'Monitors multiple points (a trailer is not uniform)',
    'Retains the log locally even without signal',
    'Records door-open and reefer events where available',
    'Provides an auditable temperature-vs-time compliance record',
    'Assigns accountability — when and where a breach occurred',
  ],
  features: [
    'Journey-long temperature logging (time + GPS)',
    'Immediate out-of-range alerting over cellular',
    'Multi-point sensing across the cargo space',
    'Offline-safe local logging (never lose the record)',
    'Excursion detection (duration + severity)',
    'Auditable compliance report',
    'Honest about regulated cold-chain and calibration requirements',
  ],
  applications: [
    { t: 'Food cold chain', d: 'Chilled/frozen food kept in range from depot to delivery, with proof.' },
    { t: 'Pharma / vaccine transport', d: 'Regulated temperature control and auditable records for medicines.' },
    { t: 'Reefer fleet management', d: 'Live visibility and alerting across refrigerated vehicles.' },
    { t: 'Dispute / claims evidence', d: 'When and where a breach occurred, for accountability and claims.' },
  ],
  skills: [
    'Multi-point temperature sensing and calibration',
    'Excursion detection (band + duration)',
    'GPS/time-stamped logging and offline retention',
    'Cellular alerting and reporting',
    'Compliance-oriented record keeping',
  ],
  prereq: [
    'A cold-chain breach in transit is silent — continuous logging and immediate alerting are the point.',
    'A trailer is not thermally uniform — monitor multiple points where it matters.',
    'The record must survive signal loss — log locally, sync when connected.',
    'Cold-chain compliance is regulated — calibration and a trustworthy record matter.',
  ],

  parts: ['esp32', 'ds18b20', 'neo6m', 'sim800', 'sdcard', 'li18650'],
  extraParts: [
    { name: 'Temperature probes', spec: 'Sealed DS18B20 (or validated probes), multiple points', qty: 3, price: 600, note: 'Placement/calibration are critical' },
    { name: 'GPS + cellular', spec: 'Location and in-transit alerting/upload', qty: 1, price: 1200 },
    { name: 'Door sensor', spec: 'Reed switch for door-open events', qty: 1, price: 100 },
    { name: 'Rugged enclosure + battery', spec: 'In-cargo enclosure with battery backup', qty: 1, price: 500 },
  ],
  cost: '₹3,000 – ₹5,000 per vehicle',
  libs: ['wifi', 'onewire', 'tinygps', 'pubsub', 'sqlite', 'ntp'],

  pins: {
    left: [
      { dev: 'Temp probes (bus)', devPin: 'DATA', pin: 'GPIO 4', sig: 'Multi-point temp (1-Wire)' },
      { dev: 'Door reed', devPin: 'IN', pin: 'GPIO 34', sig: 'Door open/close' },
      { dev: 'GPS', devPin: 'TX/RX', pin: 'GPIO 26/25', sig: 'Location' },
    ],
    right: [
      { dev: 'Cellular modem', devPin: 'UART', pin: 'GPIO 27/14', sig: 'Alert/upload' },
      { dev: 'SD card', devPin: 'SPI', pin: 'GPIO 18/23/5', sig: 'Offline log' },
      { dev: 'Battery', devPin: '+', pin: 'BAT', sig: 'Backup power' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Health' },
    ],
  },
  wiringNotes: [
    'Place sealed temperature probes at multiple representative points in the cargo space (not just near the vent).',
    'Add a door sensor to correlate excursions with door-open events.',
    'Add GPS for location stamping and cellular for in-transit alerts/upload.',
    'Log to SD locally so the record survives signal loss; sync when connected.',
    'Calibrate probes; a compliance record is only as good as its calibration.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Multi-point temp', sub: 'cargo space', highlight: true },
      { name: 'Door', sub: 'open/close' },
      { name: 'GPS', sub: 'location' },
    ] },
    { label: 'Judge', edge: 'right', blocks: [
      { name: 'In safe band?', sub: 'per point', highlight: true },
      { name: 'Excursion?', sub: 'band+duration' },
    ] },
    { label: 'Log + alert', edge: 'right', blocks: [
      { name: 'Local log', sub: 'offline-safe' },
      { name: 'Alert', sub: 'in transit' },
    ] },
    { label: 'Prove', edge: 'none', blocks: [
      { name: 'Compliance record', sub: 'temp vs time' },
      { name: 'Accountability', sub: 'when/where' },
    ] },
  ] },
  flow: [
    { t: 'Read multi-point temp, door, GPS', k: 'start' },
    { t: 'Log reading (time + location)', k: 'io' },
    { t: 'Out of safe band?', k: 'dec', yes: 'Excursion: alert in transit', no: 'Continue logging' },
    { t: 'Excursion: alert in transit', k: 'io' },
    { t: 'Continue logging', k: 'proc' },
    { t: 'Connected?', k: 'dec', yes: 'Sync log to platform', no: 'Retain locally' },
    { t: 'Sync log to platform', k: 'io' },
    { t: 'Retain locally', k: 'end', back: 'Read multi-point temp, door, GPS' },
  ],

  principle: [
    'The cold chain is a <b>chain</b>, and its integrity is only as good as its weakest, least-watched link — which in practice is <b>transit</b>. In a depot there are alarms and staff; on the road the cargo is sealed in a moving box, and a temperature breach there is <b>silent</b>. A reefer compressor can fail, a thermostat can drift, a door can be left ajar at a stop, or the load can soak up heat on a long hot leg — and unless something is actively watching, the cargo can sit out of range for hours and arrive looking fine while being spoiled or, for medicines, unsafe. Continuous, in-transit monitoring exists precisely to make that silent failure loud and early.',
    'The first job is honest <b>measurement</b>, and the subtlety is that a trailer is <b>not thermally uniform</b>. Cold air enters at the vent and warms as it circulates; the load near the doors, in corners, or deep in a full pallet stack can be well outside the range the single factory sensor near the vent reports. So the monitor places probes at <b>multiple representative points</b> and judges each — because the cargo that spoils is the cargo at the worst point, not the average. Probes must be <b>calibrated</b>, because a compliance record built on an inaccurate sensor is worthless (and potentially dangerous, if it reassures falsely).',
    'The second job is <b>catching excursions in time to act</b>. An excursion is not just an instantaneous reading out of band — it is temperature outside the safe range for a meaningful <b>duration</b>, since brief blips (a door opening) may be tolerable while sustained breaches are not, and different cargoes tolerate different exposures. The moment a genuine excursion is detected, the monitor <b>alerts over cellular</b> so someone can act <i>while the load can still be saved</i>: restart or repair the reefer, close the door, reroute to the nearest facility, or prioritise delivery. Catching it in transit is the entire difference between a recoverable incident and a written-off load.',
    'The third job is <b>proof and accountability</b>. Cold-chain cargo lives in a <b>regulated</b> world — food safety and pharmaceutical rules require demonstrable temperature control — so the monitor keeps a complete, time-and-location-stamped <b>record</b> of the whole journey, retained <b>locally even without signal</b> so it is never lost, and syncable to a platform. That record does two things: it <b>proves compliance</b> (an auditable temperature-vs-time trace showing the chain held), and it <b>assigns accountability</b> when it did not (exactly when and where the breach happened, correlated with door events and location — depot, driver, route, or equipment). The design is candid that this is a regulated domain with validated-equipment expectations, that placement and calibration are critical, and that the record must be trustworthy to have value. Within that frame it delivers what cold-chain transit fundamentally needs: continuous watch, timely alerts, and a defensible proof that the cold never broke.',
  ],
  equations: [
    { t: 'Excursion detection (band + duration)', eq: 'For each monitored point p with safe band [T_lo, T_hi]:\n\n  out(p) = T_p < T_lo  OR  T_p > T_hi\n  excursion(p) if out(p) sustained for > t_tol\n\nBrief blips (door open) tolerated; sustained breaches alerted.\nJudge the WORST point, not the average.' },
    { t: 'Mean-kinetic-temperature (pharma)', eq: 'For thermal-load assessment over a journey:\n\n  MKT = −(E/R) / ln( (1/n) Σ e^(−E/(R·T_i)) )\n\n(a temperature that weights higher excursions more heavily —\nused in pharma cold-chain to judge cumulative exposure.)' },
    { t: 'Record integrity', eq: 'Every reading logged: {t, location, point, temp}\n\n  connected  → sync to platform\n  offline    → retain locally, sync later (never lose it)\n\nA compliance record must be complete and trustworthy.' },
  ],

  assembly: [
    { h: 'Place and calibrate the probes', p: [
      'Place sealed probes at multiple representative points (including likely worst points near doors/corners), not just at the vent, and calibrate them.',
      'Add a door sensor to correlate excursions with door-open events.',
    ], warn: 'Placement and calibration decide whether the record is meaningful. A compliance record from an uncalibrated or badly-placed sensor is worse than none — it can falsely reassure.' },
    { h: 'Add location, alerting and offline logging', p: [
      'Add GPS for location stamping and cellular for in-transit alerts/upload; log to SD so the record survives signal loss.',
    ] },
    { h: 'Set bands, tolerances and the compliance report', p: [
      'Configure the safe band and excursion tolerance per cargo, and produce an auditable temperature-vs-time report.',
    ] },
  ],
  steps: [
    { h: 'Detect a real excursion (band + duration)', p: [
      'Judge each monitored point against its safe band, and treat it as an excursion only when out of range for longer than the tolerated duration — alerting on the worst point.',
    ], code: {
      file: 'excursion.py', lang: 'python',
      body: `class PointMonitor:
    def __init__(self, name, t_lo, t_hi, tol_s):
        self.name = name; self.lo = t_lo; self.hi = t_hi
        self.tol = tol_s; self.out_since = None

    def update(self, temp, now):
        out = temp < self.lo or temp > self.hi     # outside safe band
        if out:
            if self.out_since is None:
                self.out_since = now               # start timing the breach
            dur = now - self.out_since
            if dur >= self.tol:                    # sustained -> excursion
                return {"point": self.name, "temp": temp,
                        "duration_s": int(dur), "excursion": True}
        else:
            self.out_since = None                  # back in band; blip tolerated
        return None

def worst_excursion(points, temps, now):
    hits = [m.update(temps[m.name], now) for m in points]
    hits = [h for h in hits if h]
    # alert on the most severe (longest/most out-of-band) point
    return max(hits, key=lambda h: h["duration_s"], default=None)`,
      explain: [
        { ref: 'out = temp < self.lo or temp > self.hi     # outside safe band', txt: 'Each point is judged against its own safe band — the cargo that spoils is at the worst point, not the average.' },
        { ref: 'if dur >= self.tol:                    # sustained -> excursion', txt: 'An excursion requires the breach to persist beyond a tolerance, so a brief door-opening blip does not cry wolf while a sustained failure does.' },
        { ref: 'self.out_since = None                  # back in band; blip tolerated', txt: 'Returning to band resets the timer — only sustained breaches alert, matching how cargo actually tolerates brief exposure.' },
        { ref: 'return max(hits, key=lambda h: h["duration_s"], default=None)', txt: 'The alert is driven by the most severe point, so the worst-affected cargo governs the response.' },
      ],
    } },
    { h: 'Alert in transit and keep the record', p: [
      'On a real excursion, alert over cellular immediately (with location and duration) so the load can be saved, and retain the full log locally so the compliance record is never lost.',
    ], tip: 'Alert with location and duration, not just "too warm" — the responder needs to know how bad, how long, and where, to decide whether to reroute or write off.' },
  ],

  code: [{
    file: 'coldchain_monitor.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Cold-Chain Truck Monitor

Continuously logs multi-point cargo temperature with time and location,
alerts in transit the instant a real excursion occurs (band + duration),
retains the record locally even without signal, and produces an auditable
compliance report. Placement and calibration are critical.
"""
import json, time

class ColdChainMonitor:
    def __init__(self, points, uplink, logfile="coldchain.jsonl"):
        self.points = points            # list[PointMonitor]
        self.uplink = uplink            # cellular
        self.logfile = logfile

    def log(self, record):
        with open(self.logfile, "a") as f:     # offline-safe: always log locally
            f.write(json.dumps(record) + "\\n")

    def sync(self, record):
        try:
            self.uplink.publish("coldchain/telemetry", record)   # if connected
        except Exception:
            pass                                # retained locally; sync later

    def tick(self, temps, gps, door_open, now):
        record = {"t": now, "loc": gps, "door": door_open,
                  "temps": temps}
        self.log(record)                        # complete journey record
        self.sync(record)

        # excursion detection on the worst point
        worst = worst_excursion(self.points, temps, now)
        if worst:
            alert = {**worst, "loc": gps, "door": door_open, "t": now}
            self.log({"alert": alert})
            try:
                self.uplink.publish("coldchain/alert", alert)     # in-transit alert
            except Exception:
                pass                            # will re-send when connected

    def compliance_report(self):
        # auditable temperature-vs-time trace for food-safety / pharma
        with open(self.logfile) as f:
            return [json.loads(l) for l in f]

if __name__ == "__main__":
    pts = [PointMonitor("front", 2, 8, 600),
           PointMonitor("mid",   2, 8, 600),
           PointMonitor("doors", 2, 8, 300)]    # doors: tighter tolerance
    mon = ColdChainMonitor(pts, uplink=Cellular())
    while True:
        mon.tick(read_probes(), read_gps(), read_door(), time.time())
        time.sleep(30)`,
    explain: [
      { ref: 'with open(self.logfile, "a") as f:     # offline-safe: always log locally', txt: 'Every reading is logged locally first, so the compliance record survives signal loss and is never incomplete.' },
      { ref: 'self.uplink.publish("coldchain/telemetry", record)   # if connected', txt: 'Readings sync to the platform when connected, giving live visibility without depending on constant signal.' },
      { ref: 'worst = worst_excursion(self.points, temps, now)', txt: 'Excursion detection runs on the worst monitored point, so the most-affected cargo governs the alert.' },
      { ref: 'self.uplink.publish("coldchain/alert", alert)     # in-transit alert', txt: 'A real excursion alerts in transit, with location and duration, so the load can be saved while there is still time to act.' },
      { ref: 'def compliance_report(self):', txt: 'The full local log becomes the auditable temperature-vs-time record that proves the cold chain held — or shows exactly when and where it did not.' },
    ],
  }],

  config: [
    'Configure probe placement/IDs, safe bands and excursion tolerances per cargo type.',
    'Configure GPS/location stamping and cellular alerting/upload.',
    'Configure offline logging retention and sync-on-reconnect.',
    'Configure the compliance report format for audit.',
  ],
  calibration: [
    { h: 'Probe calibration', p: [
      'Calibrate each probe against a reference at the relevant temperatures; a compliance record depends on it.',
    ] },
    { h: 'Placement', p: [
      'Verify probes represent the real worst points (doors/corners), not just the vent.',
    ] },
    { h: 'Tolerances', p: [
      'Set excursion durations so brief door-opens are tolerated while real breaches alert.',
    ] },
  ],
  testing: [
    { step: 'Open the door briefly', expect: 'Blip logged; no false excursion (within tolerance)' },
    { step: 'Disable cooling', expect: 'Sustained rise → in-transit excursion alert with location' },
    { step: 'Lose cellular signal', expect: 'Readings retained locally; sync on reconnect' },
    { step: 'Heat one point only', expect: 'Worst point flagged, not masked by the average' },
    { step: 'Complete a journey', expect: 'Auditable temperature-vs-time compliance record' },
    { step: 'Miscalibrate a probe (test)', expect: 'Detected in calibration check — record trustworthy' },
  ],
  output: [
    'A complete, location-stamped temperature record with in-transit excursion alerts and an auditable compliance report.',
    { file: 'coldchain-alert.json', lang: 'json', body: `{
  "point": "doors",
  "temp": 11.4,
  "duration_s": 420,
  "loc": { "lat": 26.9124, "lon": 75.7873 },
  "door": false,
  "excursion": true
}` },
    'A sustained breach at the door-end (11.4 °C for 7 minutes, doors closed — a cooling fault, not a door-open) flagged in transit with location, so the load can be saved and the cause pinned to equipment.',
  ],
  troubleshoot: [
    { sym: 'Excursion missed', cause: 'Single/poorly-placed sensor', fix: 'Monitor multiple representative points; judge the worst' },
    { sym: 'False excursions on stops', cause: 'No door tolerance', fix: 'Tolerate brief blips by duration; correlate with door events' },
    { sym: 'Record lost in a dead zone', cause: 'No offline logging', fix: 'Log locally always; sync on reconnect' },
    { sym: 'Record not trusted', cause: 'Uncalibrated probes', fix: 'Calibrate against a reference; document calibration' },
    { sym: 'Alert too late to act', cause: 'Post-hoc only', fix: 'Alert in transit the instant a real excursion is detected' },
  ],

  iot: {
    protoShort: 'Cellular → cold-chain platform (offline-safe local log)',
    net: {
      nodes: [{ name: 'Cargo monitor', sub: 'ESP32' }, { name: 'Reefer fleet', sub: 'all vehicles' }],
      protocol: 'Cellular', gateway: 'Carrier', gatewaySub: 'to platform',
      uplink: 'MQTT/HTTPS', cloud: 'Cold-chain platform', cloudSub: 'temp records + alerts',
      clients: [{ name: 'Ops', sub: 'live + alerts' }, { name: 'Audit', sub: 'compliance record' }],
    },
    protocol: ['Monitors stream temperature/location and alert on excursions; the full record is retained locally and synced, so signal loss never breaks the audit trail.'],
    topics: [
      { t: 'coldchain/<veh>/telemetry', dir: 'monitor → platform', payload: 'multi-point temp, location, door' },
      { t: 'coldchain/<veh>/alert', dir: 'monitor → ops', payload: 'excursion: point, temp, duration, location' },
      { t: 'coldchain/<veh>/report', dir: 'monitor → audit', payload: 'temperature-vs-time compliance record' },
    ],
    cloud: ['A platform gives live reefer visibility, in-transit excursion alerts, and auditable compliance records across the fleet.'],
    dashboard: ['Live per-vehicle temperatures/location, excursion alerts, and downloadable compliance reports.'],
    mobile: ['Immediate excursion alerts (where, how bad, how long) so the load can be saved.'],
    security: [
      'Authenticate monitors; secure and tamper-evidence the temperature record.',
      'Retain locally so signal loss never breaks the audit trail.',
      'Calibrated, trustworthy records are a compliance requirement.',
    ],
  },

  perf: [
    'Monitor multiple points; judge the worst, not the average.',
    'Detect excursions by band and duration to avoid false alarms on door-opens.',
    'Log locally always; alert in transit; sync when connected.',
    'Keep the record complete and calibrated for audit.',
  ],
  safety: [
    'Cold-chain compliance is regulated (food safety, pharma) — use validated equipment and calibrated probes where required.',
    'A false-reassuring record is dangerous — trustworthiness (calibration, placement, integrity) is paramount.',
    'For medicines especially, treat excursions as potential safety events, not just quality issues.',
    'Mount sensors and enclosure so they do not obstruct loading or damage cargo.',
  ],
  maintenance: [
    'Re-calibrate probes on a schedule; document it.',
    'Verify placement still represents worst points after load-pattern changes.',
    'Check battery, GPS and cellular health.',
    'Review excursion alerts and reports for recurring causes.',
  ],
  future: [
    'Add mean-kinetic-temperature and cargo-specific stability budgets.',
    'Add predictive alerts (trend toward breach before it happens).',
    'Add tamper-evident/signed records for stronger audit.',
    'Add humidity and shock monitoring for sensitive cargo.',
  ],
  faq: [
    { q: 'Why monitor in transit rather than just at delivery?', a: 'Because a breach caught at delivery is a written-off load, but a breach caught in transit can often be saved — restart the reefer, close a door, reroute. In-transit alerting is the difference between a recoverable incident and a loss.' },
    { q: 'Why multiple sensors?', a: 'A trailer is not thermally uniform — the load near doors or in corners can be well out of range while the vent sensor reads fine. The cargo that spoils is at the worst point, so you monitor several and judge the worst.' },
    { q: 'What counts as an excursion?', a: 'Temperature outside the safe band for longer than a tolerated duration. A brief door-opening blip may be fine; a sustained breach is not. Judging band and duration together avoids both false alarms and missed failures.' },
    { q: 'What if there is no signal?', a: 'The full record is logged locally and synced when the connection returns, so the compliance trail is never lost in a dead zone. Alerts are re-sent on reconnect.' },
    { q: 'Why does calibration matter so much?', a: 'Because the record\'s whole value is trust. An uncalibrated probe can falsely reassure that cargo stayed safe when it did not — worse than no record at all, especially for medicines. Cold-chain is a regulated domain for exactly this reason.' },
  ],
  refs: [
    { t: 'Cold chain', u: 'https://en.wikipedia.org/wiki/Cold_chain', s: 'Reference' },
    { t: 'Temperature excursion / mean kinetic temperature', u: 'https://en.wikipedia.org/wiki/Mean_kinetic_temperature', s: 'Reference' },
    { t: 'Vaccine / pharma cold chain', u: 'https://en.wikipedia.org/wiki/Vaccine#Storage', s: 'Reference' },
    { t: 'DS18B20 temperature sensor', u: 'https://www.analog.com/en/products/ds18b20.html', s: 'Analog Devices' },
    { t: 'Food safety temperature control', u: 'https://en.wikipedia.org/wiki/Food_safety', s: 'Reference' },
  ],
  images: ['car', 'gps', 'factory'],
  imageCaptions: [
    'A cold-chain monitor rides with refrigerated cargo, logging temperature the whole journey and alerting the instant it drifts.',
    'Multiple probes catch the worst point in a non-uniform trailer, not just the average near the vent.',
    'The location-stamped record proves the cold chain held — or pins exactly when and where it broke.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   090 — Two-Wheeler Anti-Theft GPS
   ══════════════════════════════════════════════════════════════════ */
{
  id: '090',
  domainKey: 'iot',
  emoji: '🏍️', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Feels a parked motorcycle being tampered with, warns and alerts the owner instantly, and tracks it live if it is taken — deterrence, alarm and recovery in one.',

  overview: [
    'Motorcycles and scooters are stolen far more easily than cars — they are light enough to lift into a van, quick to hot-wire, and often parked in the open — and once gone they are rarely recovered because there is no way to follow them. This project builds an anti-theft tracker that covers the whole timeline of a theft: it <b>detects tampering</b> on a parked bike, <b>alerts the owner instantly</b>, and if the bike is taken, <b>tracks it live</b> so it can be recovered. Deterrence, alarm and recovery in one small, hidden unit.',
    'The core is <b>motion-based tamper detection</b>. While the bike is parked and armed, an accelerometer watches for the signatures of theft — the bike being lifted, wheeled, tilted onto its stand, knocked, or started — distinguishing a real tampering event from harmless nudges (wind, a passer-by brushing past) so it does not cry wolf. On a genuine event it does two things at once: sounds a local <b>alarm</b> as a deterrent, and sends the owner an <b>instant alert</b> over cellular. If motion continues — the bike is actually being taken — it switches to <b>live GPS tracking</b>, streaming location so the owner and, where appropriate, the police can follow and recover it.',
    'The design is built around the realities of a hidden, battery-lean device on a parked vehicle: it spends almost all its life in <b>low-power sleep</b>, woken by the accelerometer only when something moves, so a small battery lasts; it is <b>hidden and tamper-resistant</b> so a thief cannot simply pull it off; and it escalates sensibly (nudge → warn, sustained motion → alarm + track). It is honest that no tracker guarantees recovery, that thieves may find and disable a unit, and that recovery should go through the police rather than owner heroics. But as a motion-triggered, alerting, live-tracking anti-theft device tuned for two-wheelers, it turns a bike from an easy, untraceable target into one that fights back — noisy when touched, and followable if taken.',
  ],
  does: [
    'Detects tampering on a parked bike via motion (lift/tilt/wheel/knock)',
    'Distinguishes real theft from harmless nudges',
    'Sounds a local alarm as a deterrent',
    'Alerts the owner instantly over cellular',
    'Switches to live GPS tracking if the bike is taken',
    'Sleeps in ultra-low power, woken only by motion',
    'Stays hidden and tamper-resistant',
  ],
  features: [
    'Motion/tamper detection with false-alarm rejection',
    'Instant owner alert + local alarm',
    'Live GPS tracking on sustained motion',
    'Escalation (nudge → warn → alarm + track)',
    'Ultra-low-power sleep, accelerometer wake',
    'Hidden, tamper-resistant install',
    'Honest about recovery limits and lawful process',
  ],
  applications: [
    { t: 'Personal two-wheeler security', d: 'Deterrence, alarm and recovery tracking for a bike or scooter.' },
    { t: 'Delivery-fleet two-wheelers', d: 'Anti-theft across many riders\' vehicles.' },
    { t: 'Rental / shared mobility', d: 'Tamper alerts and location for shared scooters/bikes.' },
    { t: 'High-value parked assets', d: 'Motion-triggered alerting for anything parked and portable.' },
  ],
  skills: [
    'Accelerometer motion/tamper classification',
    'False-alarm rejection (real theft vs nudge)',
    'Ultra-low-power sleep + motion wake',
    'GPS tracking and cellular alerting',
    'Hidden, tamper-resistant installation',
  ],
  prereq: [
    'Cover the whole theft timeline: detect tampering, alert/alarm, then track if taken.',
    'Reject harmless nudges (wind, passers-by) or the alarm becomes noise people ignore.',
    'Battery life demands ultra-low-power sleep with accelerometer wake.',
    'No tracker guarantees recovery; go through the police, not heroics.',
  ],

  parts: ['esp32', 'mpu6050', 'neo6m', 'sim800', 'buzzer', 'li18650'],
  extraParts: [
    { name: 'Accelerometer', spec: 'Motion/tilt with wake-on-motion interrupt', qty: 1, price: 150, note: 'Wakes the MCU only when moved' },
    { name: 'GPS + cellular', spec: 'Live location and alerting', qty: 1, price: 1200 },
    { name: 'Hidden enclosure', spec: 'Concealed, tamper-resistant mount + wiring', qty: 1, price: 300 },
    { name: 'Battery + charger', spec: 'Li-ion with charge from the bike (with cutoff)', qty: 1, price: 400 },
  ],
  cost: '₹2,500 – ₹4,500',
  libs: ['wifi', 'mpu', 'tinygps', 'pubsub', 'preferences', 'esptask'],

  pins: {
    left: [
      { dev: 'Accelerometer', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Motion/tilt' },
      { dev: 'Accel INT (wake)', devPin: 'INT', pin: 'GPIO 33 (RTC)', sig: 'Wake-on-motion' },
      { dev: 'GPS', devPin: 'TX/RX', pin: 'GPIO 26/25', sig: 'Location' },
    ],
    right: [
      { dev: 'Cellular modem', devPin: 'UART', pin: 'GPIO 27/14', sig: 'Alert/track' },
      { dev: 'Alarm/buzzer', devPin: 'IN', pin: 'GPIO 2', sig: 'Local deterrent' },
      { dev: 'Battery', devPin: '+', pin: 'BAT', sig: 'Power' },
      { dev: 'Bike charge', devPin: '12V', pin: 'reg+cutoff', sig: 'Trickle charge' },
    ],
  },
  wiringNotes: [
    'Wire the accelerometer\'s motion interrupt to an RTC-capable GPIO so it can wake the ESP32 from deep sleep.',
    'Add GPS and a cellular modem for location and alerting.',
    'Add a loud local alarm as a deterrent.',
    'Charge from the bike through a regulator with a cutoff; the battery must ride through when parked/off.',
    'Install hidden and tamper-resistant — a thief must not be able to find and pull the unit off easily.',
  ],

  block: { columns: [
    { label: 'Parked (armed)', edge: 'right', blocks: [
      { name: 'Deep sleep', sub: 'ultra-low power', highlight: true },
      { name: 'Accel INT', sub: 'wake on motion' },
    ] },
    { label: 'Classify', edge: 'right', blocks: [
      { name: 'Tamper?', sub: 'lift/tilt/wheel', highlight: true },
      { name: 'Reject nudge', sub: 'wind/passer-by' },
    ] },
    { label: 'Alarm + alert', edge: 'right', blocks: [
      { name: 'Local alarm', sub: 'deterrent' },
      { name: 'Owner alert', sub: 'instant' },
    ] },
    { label: 'Track', edge: 'none', blocks: [
      { name: 'Live GPS', sub: 'if taken' },
      { name: 'Recover', sub: 'via police' },
    ] },
  ] },
  flow: [
    { t: 'Parked + armed: deep sleep', k: 'start' },
    { t: 'Motion wake (accel INT)', k: 'io' },
    { t: 'Real tamper (not a nudge)?', k: 'dec', yes: 'Alarm + instant owner alert', no: 'Back to sleep' },
    { t: 'Back to sleep', k: 'proc', back: 'Parked + armed: deep sleep' },
    { t: 'Alarm + instant owner alert', k: 'io' },
    { t: 'Motion sustained (being taken)?', k: 'dec', yes: 'Live GPS tracking', no: 'Re-arm after quiet' },
    { t: 'Live GPS tracking', k: 'io' },
    { t: 'Re-arm after quiet', k: 'end', back: 'Parked + armed: deep sleep' },
  ],

  principle: [
    'A theft is not a single instant but a <b>timeline</b> — the bike is approached and tampered with, then taken, then moved away — and an effective anti-theft device intervenes at <b>every stage</b> of it. Tamper detection deters and warns at the start; a loud alarm and an instant alert can stop the theft before it completes; and live tracking gives a chance of recovery if it does. Covering the whole timeline, rather than just one stage, is what makes the difference for a vehicle as easy to steal and as hard to recover as a two-wheeler.',
    'The heart of it is <b>motion-based tamper detection</b>, and its central engineering problem is <b>discrimination</b>. An accelerometer on a parked bike sees the theft signatures — being lifted off the stand, tilted, wheeled, knocked, or started — but it also sees harmless motion: wind, a passer-by brushing past, a neighbouring vehicle. If the device alarms on every nudge, the owner disables it and thieves learn to ignore it; if it is too deaf, it misses the theft. So it classifies motion by pattern, magnitude and persistence — a sustained lift or a continued wheeling is theft, a single small jolt is a nudge — to alarm on real tampering while rejecting the noise. That discrimination is what keeps the alarm credible.',
    'On a genuine event the device acts on <b>two fronts simultaneously</b>. It sounds a <b>local alarm</b> — a deterrent that often ends the attempt, since a thief wants a quiet, quick job — and it sends the owner an <b>instant remote alert</b> over cellular, because the owner may be nearby and able to intervene, or to call the police immediately. Then it <b>escalates</b>: if motion continues and the bike is actually being taken, it switches from alarming to <b>live GPS tracking</b>, streaming location so the bike can be followed and recovered. This escalation — nudge tolerated, tamper alarmed and alerted, removal tracked — matches the response to the threat.',
    'Making all this work on a hidden device on a parked, engine-off vehicle imposes two hard constraints that shape the design. First, <b>power</b>: the device may sit armed for days, so it lives in <b>ultra-low-power sleep</b>, drawing almost nothing, and is <b>woken by the accelerometer\'s motion interrupt</b> only when something actually moves — this "sleep until moved" architecture is what lets a small battery last, and it means the accelerometer, not a polling loop, is the trigger. Second, <b>tamper resistance</b>: a tracker a thief can find and rip off in seconds is useless, so the unit is <b>hidden</b> and mounted to resist quick removal, ideally alerting the moment it is interfered with. The design is honest about the limits — no tracker guarantees recovery, a determined thief may locate and disable a unit or jam signals, and recovery should be pursued <b>through the police</b>, not by the owner confronting thieves. Within those honest bounds, it does what two-wheeler security most needs: make an easy, untraceable target into one that is noisy when touched and followable if taken.',
  ],
  equations: [
    { t: 'Tamper vs nudge classification', eq: 'From accelerometer magnitude a and tilt θ over a window:\n\n  jolt      = |a − 1g| > A_jolt            (a knock)\n  lift/tilt = |θ − θ_park| > θ_thr          (moved off stand)\n  motion    = jolts/tilt SUSTAINED > t_persist\n\n  tamper if (lift/tilt) OR sustained motion\n  nudge  if a single brief jolt only  → ignore\n\nDiscrimination keeps the alarm credible.' },
    { t: 'Escalation', eq: 'nudge         → stay armed (no alarm)\ntamper        → LOCAL ALARM + instant owner alert\nsustained/    → also LIVE GPS TRACKING (being taken)\n  removal\n\nResponse matched to threat stage.' },
    { t: 'Ultra-low-power arm', eq: 'Armed & parked:\n  deep sleep (µA-scale), accel INT wired to RTC GPIO\n  motion interrupt → WAKE → classify\n  no theft → back to sleep\n\n"Sleep until moved" makes a small battery last days.' },
  ],

  assembly: [
    { h: 'Wire the wake-on-motion core', p: [
      'Connect the accelerometer with its motion interrupt to an RTC-capable GPIO so it wakes the ESP32 from deep sleep; add GPS, cellular and a loud alarm.',
      'Charge from the bike via a regulator with a cutoff so the battery rides through when parked.',
    ], warn: 'Install hidden and tamper-resistant. A tracker a thief can find and pull off in seconds is useless — conceal it and mount it to resist quick removal.' },
    { h: 'Tune tamper vs nudge', p: [
      'Calibrate the parked orientation and thresholds so a real lift/wheel/knock alarms while wind and passers-by do not.',
    ] },
    { h: 'Set escalation and alerting', p: [
      'Configure alarm + instant alert on tamper, and live tracking on sustained motion; verify low-power sleep and wake.',
    ] },
  ],
  steps: [
    { h: 'Classify motion: tamper or nudge', p: [
      'On a motion wake, classify the event — a sustained lift/tilt/wheeling is tampering; a single brief jolt is a harmless nudge to ignore.',
    ], code: {
      file: 'tamper.ino', lang: 'cpp',
      body: `#define A_JOLT   0.30f     // g deviation = a knock
#define TILT_THR 15.0f     // deg off parked orientation
#define PERSIST_MS 1500    // sustained motion => real tamper

float parkedTilt = 0;      // learned when armed

// Returns: 0 none, 1 nudge, 2 tamper
int classifyMotion(){
  uint32_t start = millis(); int jolts = 0; float maxTilt = 0;
  while (millis() - start < PERSIST_MS){
    float a = accelMagnitude();          // g
    float tilt = fabsf(currentTilt() - parkedTilt);
    if (fabsf(a - 1.0f) > A_JOLT) jolts++;
    if (tilt > maxTilt) maxTilt = tilt;
    delay(50);
  }
  if (maxTilt > TILT_THR) return 2;        // lifted/tilted off stand -> tamper
  if (jolts >= 6)          return 2;        // sustained knocking -> tamper
  if (jolts >= 1)          return 1;        // a single/brief jolt -> nudge
  return 0;
}`,
      explain: [
        { ref: 'while (millis() - start < PERSIST_MS){', txt: 'Motion is judged over a persistence window — sustained motion is theft, a momentary blip is not — which is what rejects false alarms.' },
        { ref: 'if (maxTilt > TILT_THR) return 2;        // lifted/tilted off stand -> tamper', txt: 'A change in tilt from the learned parked orientation means the bike was lifted or moved off its stand — a strong theft signature.' },
        { ref: 'if (jolts >= 6)          return 2;        // sustained knocking -> tamper', txt: 'Repeated jolts indicate active tampering (wheeling, forcing), escalated to a tamper event.' },
        { ref: 'if (jolts >= 1)          return 1;        // a single/brief jolt -> nudge', txt: 'A single brief jolt (wind, a passer-by) is classified as a harmless nudge and does not trigger the alarm, keeping it credible.' },
      ],
    } },
    { h: 'Alarm, alert and escalate to tracking', p: [
      'On a tamper, sound the alarm and alert the owner instantly; if motion continues (the bike is being taken), switch to live GPS tracking.',
    ], tip: 'Escalate rather than blast: a warning chirp on the first nudge, full alarm + alert on a real tamper, and live tracking only once the bike is actually moving away.' },
  ],

  code: [{
    file: 'antitheft-tracker.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Two-Wheeler Anti-Theft GPS Tracker — ESP32

   Armed & parked: deep sleep, woken by the accelerometer's motion
   interrupt. Classifies tamper vs nudge; on tamper sounds a local alarm
   and alerts the owner instantly; if the bike is taken, tracks it live.
   Hidden, tamper-resistant, ultra-low-power. Recover via the police.
   ══════════════════════════════════════════════════════════════════ */

#include "esp_sleep.h"
#include <TinyGPS++.h>

#define ACCEL_INT_GPIO GPIO_NUM_33      // RTC-capable: wakes from deep sleep
#define TRACK_PERSIST_MS 4000           // sustained motion => being taken

RTC_DATA_ATTR bool armed = true;
TinyGPSPlus gps; HardwareSerial gpsSer(2);

void armAndSleep(){
  configureAccelWakeInterrupt();        // accel INT on motion
  esp_sleep_enable_ext0_wakeup(ACCEL_INT_GPIO, 1);
  esp_deep_sleep_start();               // µA sleep until MOVED
}

void alarm(bool on){ digitalWrite(2, on); }       // local deterrent
void alertOwner(const char* what){
  cellularSend("bike/alert", what);     // instant remote alert
}
void trackLive(){
  while (motionContinues()){            // being taken -> stream location
    while (gpsSer.available()) gps.encode(gpsSer.read());
    char m[128];
    snprintf(m,sizeof m,"{\\"lat\\":%.6f,\\"lon\\":%.6f}",
             gps.location.lat(), gps.location.lng());
    cellularSend("bike/track", m);      // owner/police can follow
    delay(5000);
  }
}

void setup(){
  Serial.begin(115200);
  gpsSer.begin(9600, SERIAL_8N1, 26, 25);
  pinMode(2, OUTPUT);
  accelInit(); learnParkedOrientation();

  if (esp_sleep_get_wakeup_cause() == ESP_SLEEP_WAKEUP_EXT0){
    int m = classifyMotion();           // 0 none, 1 nudge, 2 tamper
    if (m == 2){
      alarm(true);
      alertOwner("TAMPER on your bike");         // alarm + instant alert
      if (motionSustained(TRACK_PERSIST_MS)){     // actually being taken
        alertOwner("Bike being MOVED - tracking");
        trackLive();                              // live GPS tracking
      }
      alarm(false);
    }
    // nudge or none -> just re-arm
  }
  if (armed) armAndSleep();             // back to ultra-low-power sleep
}

void loop(){}                          // all work is wake-driven`,
    explain: [
      { ref: 'esp_sleep_enable_ext0_wakeup(ACCEL_INT_GPIO, 1);', txt: 'The accelerometer\'s motion interrupt wakes the ESP32 from deep sleep, so the device draws almost nothing until the bike is actually moved — the key to battery life.' },
      { ref: 'int m = classifyMotion();           // 0 none, 1 nudge, 2 tamper', txt: 'Every wake is classified, so harmless nudges are dismissed and only real tampering triggers a response — keeping the alarm credible.' },
      { ref: 'alarm(true);\n      alertOwner("TAMPER on your bike");         // alarm + instant alert', txt: 'On a real tamper the device deters locally and alerts the owner instantly — acting on both fronts at the start of the theft.' },
      { ref: 'if (motionSustained(TRACK_PERSIST_MS)){     // actually being taken', txt: 'Escalation: only when motion is sustained (the bike is being taken) does it switch to live tracking — matching response to threat.' },
      { ref: 'trackLive();                              // live GPS tracking', txt: 'If the bike is taken, it streams live location so the owner and police can follow and recover it.' },
    ],
  }],

  config: [
    'Configure the accelerometer wake interrupt and parked-orientation learning.',
    'Configure tamper vs nudge thresholds (jolt, tilt, persistence).',
    'Configure alarm, instant alert, and the sustained-motion tracking trigger.',
    'Configure GPS/cellular and low-power sleep behaviour.',
  ],
  calibration: [
    { h: 'Tamper thresholds', p: [
      'Tune jolt/tilt/persistence so lifting, wheeling and knocking alarm while wind and passers-by do not.',
    ] },
    { h: 'Power', p: [
      'Verify deep-sleep current and reliable wake-on-motion; confirm battery life meets the parked duration.',
    ] },
    { h: 'Tracking', p: [
      'Confirm GPS fix time and cellular streaming once tracking starts.',
    ] },
  ],
  testing: [
    { step: 'Nudge the parked bike lightly', expect: 'Classified as nudge — no alarm (credible)' },
    { step: 'Lift it off the stand', expect: 'Tamper: alarm + instant owner alert' },
    { step: 'Wheel it away', expect: 'Sustained motion → live GPS tracking' },
    { step: 'Leave armed for a day', expect: 'Deep sleep holds battery; wakes on motion' },
    { step: 'Try to find/remove the unit', expect: 'Hidden; interference alerts' },
    { step: 'Recover scenario', expect: 'Live location shared for police-led recovery' },
  ],
  output: [
    'Instant tamper alerts, a local alarm, and live location if the bike is taken.',
    { file: 'bike-alert.json', lang: 'json', body: `{
  "event": "tamper",
  "escalation": "being-moved",
  "alarm": true,
  "lat": 19.0760,
  "lon": 72.8777,
  "battery": "ok"
}` },
    'A tamper that escalated to the bike being moved: the alarm sounded, the owner was alerted instantly, and live location began streaming for a police-led recovery.',
  ],
  troubleshoot: [
    { sym: 'Alarms on every nudge', cause: 'Thresholds too sensitive', fix: 'Require sustained motion/tilt; reject single brief jolts' },
    { sym: 'Misses a real theft', cause: 'Thresholds too deaf', fix: 'Lower tilt/persistence thresholds; test lifting/wheeling' },
    { sym: 'Battery dies while parked', cause: 'Not truly sleeping', fix: 'Deep sleep with accel-interrupt wake; measure µA current' },
    { sym: 'Thief finds/removes unit', cause: 'Poor concealment', fix: 'Hide better; tamper-resistant mount; alert on interference' },
    { sym: 'No fix when tracking', cause: 'GPS cold start/coverage', fix: 'Allow fix time; keep antenna clear; use cellular-assisted location' },
  ],

  iot: {
    protoShort: 'Cellular → owner app + tracking platform',
    net: {
      nodes: [{ name: 'Bike tracker', sub: 'ESP32' }, { name: 'Other bikes', sub: 'fleet' }],
      protocol: 'Cellular', gateway: 'Carrier', gatewaySub: 'to platform',
      uplink: 'MQTT/HTTPS', cloud: 'Tracking platform', cloudSub: 'alerts + live location',
      clients: [{ name: 'Owner', sub: 'app alerts/track' }, { name: 'Police', sub: 'recovery (lawful)' }],
    },
    protocol: ['The tracker sends instant tamper alerts and, if the bike is taken, streams live location; it sleeps otherwise to save battery.'],
    topics: [
      { t: 'bike/<id>/alert', dir: 'tracker → owner', payload: 'tamper / being-moved' },
      { t: 'bike/<id>/track', dir: 'tracker → owner/police', payload: 'live location' },
      { t: 'bike/<id>/health', dir: 'tracker → platform', payload: 'battery, armed, signal' },
    ],
    cloud: ['A platform delivers instant alerts and live tracking to the owner, and supports lawful, police-led recovery.'],
    dashboard: ['Owner app: armed status, tamper alerts, live map when taken, and device health.'],
    mobile: ['Instant tamper alerts and a live recovery map; arm/disarm.'],
    security: [
      'Hidden, tamper-resistant install; authenticate the tracker.',
      'Recovery is lawful and police-led — not owner confrontation.',
      'Location data is sensitive — secure it and restrict access to the owner.',
    ],
  },

  perf: [
    'Ultra-low-power sleep with accelerometer wake for long parked life.',
    'Classify tamper vs nudge to keep the alarm credible.',
    'Escalate: alarm/alert on tamper, live-track only if taken.',
    'Fast, reliable location once tracking starts.',
  ],
  safety: [
    'No tracker guarantees recovery — treat it as deterrence and a recovery aid, not a certainty.',
    'Recovery must be lawful and police-led; never confront thieves yourself.',
    'Install charging from the bike safely (regulator + cutoff); avoid fire/short risks.',
    'Location data is sensitive personal data — secure it and restrict it to the owner.',
  ],
  maintenance: [
    'Check battery health and deep-sleep current periodically.',
    'Re-verify tamper thresholds after re-mounting.',
    'Confirm GPS/cellular coverage in usual parking spots.',
    'Keep the install hidden and tamper-resistant after servicing.',
  ],
  future: [
    'Add geofencing (alert if the bike leaves a zone).',
    'Add remote immobilisation (lawfully and safely engineered).',
    'Add BLE owner-presence auto-arm/disarm.',
    'Add crash/fall detection and emergency alerting.',
  ],
  faq: [
    { q: 'How does it avoid false alarms?', a: 'It classifies motion by pattern and persistence — a sustained lift, tilt off the stand, or continued wheeling is tampering, while a single brief jolt from wind or a passer-by is a nudge it ignores. A credible alarm is one that does not cry wolf.' },
    { q: 'How does it last on battery while parked?', a: 'It spends almost all its time in ultra-low-power deep sleep and is woken by the accelerometer\'s motion interrupt only when the bike actually moves. "Sleep until moved" is what makes a small battery last days.' },
    { q: 'What happens if the bike is actually stolen?', a: 'It escalates from alarm-and-alert to live GPS tracking, streaming location so the owner and police can follow and recover it.' },
    { q: 'Can a thief just remove it?', a: 'It is installed hidden and tamper-resistant so it is hard to find and pull off quickly, and it can alert the moment it is interfered with — but no tracker is invincible, which is why it deters, alarms and tracks rather than relying on any one defence.' },
    { q: 'Should I chase down my stolen bike?', a: 'No. Recovery should be lawful and police-led — share the live location with the police. The tracker\'s job is to give them what they need, not to send you into a confrontation.' },
  ],
  refs: [
    { t: 'Vehicle tracking system', u: 'https://en.wikipedia.org/wiki/Vehicle_tracking_system', s: 'Reference' },
    { t: 'Motorcycle theft', u: 'https://en.wikipedia.org/wiki/Motorcycle_theft', s: 'Reference' },
    { t: 'Accelerometer', u: 'https://en.wikipedia.org/wiki/Accelerometer', s: 'Reference' },
    { t: 'ESP32 deep sleep / wake sources', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/sleep_modes.html', s: 'Espressif' },
    { t: 'GPS', u: 'https://en.wikipedia.org/wiki/Global_Positioning_System', s: 'Reference' },
  ],
  images: ['gps', 'esp32', 'battery'],
  imageCaptions: [
    'A hidden anti-theft tracker deters, alarms and tracks — covering the whole timeline of a two-wheeler theft.',
    'The accelerometer wakes the sleeping ESP32 only on motion, so a small battery lasts through days of parking.',
    'If the bike is taken, live GPS location streams to the owner and police for a lawful recovery.',
  ],
},

];
