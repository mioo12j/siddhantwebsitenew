/* Industrial batch B — 060 Factory Energy Dashboard, 061 Conveyor Item
   Counter, 062 Predictive Motor Temperature. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   060 — Factory Energy Dashboard
   ══════════════════════════════════════════════════════════════════ */
{
  id: '060',
  domainKey: 'iot',
  emoji: '⚡', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Meters each machine\'s real power use so a factory can see where its energy actually goes, cut the waste it never knew about, and spot a machine drawing abnormally.',

  overview: [
    'A factory\'s electricity bill is a single number, and that single number hides everything useful. Which machines are the energy hogs? What is being wasted running idle overnight? Is a motor drawing more than it should because a bearing is dragging? The utility meter cannot answer any of this because it measures the whole site as one lump. This project breaks that lump apart: it meters <b>each machine</b> individually, so a factory finally sees where its energy actually goes — and once you can see per-machine consumption, you can cut waste and catch anomalies that were previously invisible in the aggregate.',
    'Each machine gets a <b>power meter</b> — a module (like a PZEM-004T) or a current-transformer clamp — that measures its real power, energy, voltage, current and power factor without breaking into the wiring. An ESP32 reads these and streams them to a time-series database and a dashboard (the classic InfluxDB + Grafana stack), giving live and historical per-machine consumption. The value is immediate: you discover the machines left drawing power while "off" (phantom/idle loads), the compressor that runs far more than anyone thought, the process that spikes demand and drives up peak charges — and you can quantify the saving from fixing each one, which is what turns an energy dashboard from a curiosity into a paying investment.',
    'Beyond visibility, per-machine metering enables <b>anomaly detection</b>. A machine has a characteristic power profile for its normal duty; a sustained deviation — a motor drawing steadily more than baseline (a developing mechanical problem or a failing supply), a heater cycling abnormally, a machine running when it should be idle — is a signal worth an alert. Watching <b>power factor</b> adds another layer, revealing reactive-power inefficiency that costs money on the bill. It is honest that this is monitoring and insight, not a substitute for a professional energy audit or safety-critical metering, and that CT/meter accuracy and correct installation matter — but as an affordable, per-machine, always-on energy dashboard, it converts an opaque bill into a map of consumption a factory can actually act on, typically paying for itself in the waste it uncovers.',
  ],
  does: [
    'Meters each machine\'s real power, energy, voltage, current and power factor',
    'Streams live and historical per-machine data to a time-series dashboard',
    'Reveals idle/phantom loads and the true energy hogs',
    'Detects anomalies — a machine drawing abnormally vs its baseline',
    'Surfaces power-factor and peak-demand issues that cost money',
    'Quantifies the saving from each fix',
    'Alerts on abnormal consumption and left-on-idle machines',
  ],
  features: [
    'Per-machine metering (not one site lump)',
    'Real power/energy/PF via meter modules or CT clamps (non-invasive)',
    'InfluxDB + Grafana time-series dashboard',
    'Idle/phantom-load discovery and quantified savings',
    'Baseline anomaly detection per machine',
    'Power-factor and peak-demand insight',
    'Honest scope: insight tool, not audit/safety metering',
  ],
  applications: [
    { t: 'Factory energy management', d: 'Per-machine visibility to target waste, idle loads and peak-demand drivers and cut the bill.' },
    { t: 'Predictive-maintenance signal', d: 'A motor drawing steadily more than baseline flags a developing mechanical/electrical problem.' },
    { t: 'Sustainability / reporting', d: 'Measured per-process energy for efficiency programmes and carbon reporting.' },
    { t: 'Facilities / building services', d: 'Metering HVAC, compressors and pumps to find and fix inefficiency.' },
  ],
  skills: [
    'Non-invasive power metering (PZEM/CT) and reading real power/PF',
    'Streaming to a time-series database (InfluxDB) and Grafana dashboards',
    'Baseline anomaly detection on power profiles',
    'Interpreting power factor and peak demand',
    'Safe installation around mains/machine power',
  ],
  prereq: [
    'Mains metering is dangerous — installation (especially opening CTs around live conductors) must follow electrical safety and, where required, be done by a qualified electrician.',
    'Measure REAL power (and power factor), not just current — apparent power misleads on reactive loads.',
    'The value is per-machine visibility and trend vs baseline; establish baselines to make anomalies meaningful.',
    'This is an insight tool, not billing-grade or safety metering — accuracy depends on the meter/CT and installation.',
  ],

  parts: ['esp32', 'pzem004t', 'acs712', 'zmpt101b', 'oled', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Per-machine power meter / CT clamps', spec: 'PZEM-004T (with CT) or split-core CTs sized to each machine\'s current', qty: 4, price: 1600, note: 'Split-core CTs clip on without breaking wiring' },
    { name: 'InfluxDB + Grafana host', spec: 'A small server/Pi running the time-series DB and dashboard', qty: 1, price: 4500, note: 'Or a cloud/self-hosted stack' },
    { name: 'DIN enclosure + isolation', spec: 'Safe enclosure, fusing and isolation for mains-side metering', qty: 1, price: 800 },
    { name: 'Three-phase meter (optional)', spec: 'For three-phase machines, a suitable 3-phase meter', qty: 1, price: 2000, note: 'Match to the machine\'s supply' },
  ],
  cost: '₹5,000 – ₹9,000 (multi-machine)',
  libs: ['wifi', 'pubsub', 'modbus', 'ssd1306', 'influx', 'grafana', 'arduinojson'],

  pins: {
    left: [
      { dev: 'PZEM-004T', devPin: 'TX/RX', pin: 'GPIO 16/17', sig: 'Real power/energy/V/I/PF (UART/Modbus)' },
      { dev: 'CT (alt)', devPin: 'AOUT', pin: 'GPIO 34 (ADC)', sig: 'Current (with voltage ref)' },
      { dev: 'Voltage ref (ZMPT)', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'Mains voltage for real power' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Live per-machine readout' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Stream to InfluxDB' },
      { dev: 'microSD', devPin: 'SPI', pin: 'shared + CS', sig: 'Local buffer' },
      { dev: '5V supply', devPin: '+/–', pin: '3V3 reg', sig: 'Isolated power' },
    ],
  },
  wiringNotes: [
    'Prefer an integrated meter module (PZEM-004T) that measures real power and power factor directly; if using bare CTs, you also need a voltage reference and phase to compute real power.',
    'Split-core CTs clip around a conductor without breaking it; never open the secondary of a CT while primary current flows (dangerous voltage).',
    'Keep the mains-side metering fused, isolated and enclosed; have a qualified electrician do or verify the installation.',
    'One meter per machine (or per circuit) so the data is genuinely per-machine, not a shared circuit lump.',
    'Isolate the low-voltage electronics and its power supply from the mains-side measurement.',
  ],

  block: { columns: [
    { label: 'Meter', edge: 'right', blocks: [
      { name: 'Per-machine meter', sub: 'real power + PF', highlight: true },
    ] },
    { label: 'Collect', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'read + buffer' },
      { name: 'Baseline', sub: 'anomaly check' },
    ] },
    { label: 'Store', edge: 'right', blocks: [
      { name: 'InfluxDB', sub: 'time series' },
      { name: 'Grafana', sub: 'dashboard' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Insights', sub: 'waste + hogs' },
      { name: 'Alert', sub: 'anomaly' },
    ] },
  ] },
  flow: [
    { t: 'Read per-machine power/PF', k: 'start' },
    { t: 'Compute energy; update baseline', k: 'proc' },
    { t: 'Above baseline or idle-but-on?', k: 'dec', yes: 'Anomaly alert', no: 'Stream to DB' },
    { t: 'Anomaly alert', k: 'io' },
    { t: 'Stream to DB', k: 'io' },
    { t: 'Dashboard trends + savings', k: 'end', back: 'Read per-machine power/PF' },
  ],

  principle: [
    'The entire value proposition rests on <b>disaggregation</b>: a single site-level meter reading is nearly useless for action because it averages away everything, while per-machine metering reveals the structure of consumption. Once you can see that machine A draws 40% of the total, that machine B sits at 2 kW all night while "off", and that machine C spikes the site\'s peak demand every hour, you have specific, quantifiable targets. Energy management is fundamentally "you cannot manage what you cannot measure", and this project supplies the measurement at the resolution where decisions actually live — the individual machine.',
    'Measuring correctly means measuring <b>real power</b>, not just current, which is the most common amateur mistake. Machines are largely inductive loads (motors), so their current and voltage are out of phase; the true power consumed (watts) is the current times voltage times the <b>power factor</b> (the cosine of that phase angle), and it is less than the "apparent power" (volt-amps) that current alone implies. Reading only current over-states consumption and, worse, hides the power-factor story entirely. So the design uses meters that measure real power and power factor directly (or, with bare CTs, adds a voltage reference and computes the phase relationship). Power factor is itself valuable: a poor power factor means the machine draws more current than its real power needs, wasting capacity and often incurring utility penalties, and per-machine PF pinpoints where correction would pay.',
    'With per-machine real-power data flowing into a <b>time-series dashboard</b>, the insights are direct and monetisable. <b>Idle/phantom loads</b> — machines drawing power while nominally off — jump out as flat non-zero baselines overnight, and switching those off is often free money. The true <b>energy hogs</b> are ranked, so efficiency effort goes where it matters. <b>Peak demand</b> events, which drive a big part of many industrial tariffs, become visible and schedulable. And crucially, each fix can be <b>quantified</b> from the same data — you measure the before and after, prove the saving, and justify the next investment. This closed loop of measure-act-verify is what makes an energy dashboard pay for itself rather than being a dashboard nobody looks at.',
    'Per-machine power is also a <b>condition signal</b>. A machine\'s power draw for a given duty is characteristic; when it drifts up over time — a motor pulling steadily more amps than its baseline for the same work — that often indicates a developing mechanical problem (friction, a dragging bearing, misalignment) or an electrical one, sometimes before vibration or temperature would flag it. So the dashboard learns each machine\'s baseline profile and <b>alerts on sustained anomalies</b>, adding a maintenance dimension to the energy one. The design is candid about scope: it is an <i>insight and monitoring</i> tool, not billing-grade metering or an electrical-safety device, and its accuracy depends on the meter/CT class and correct, safe installation (mains work carries real danger and often legal requirements for a qualified electrician). Within that honest frame, though, it does something a factory rarely has: it turns one opaque number into a live, per-machine map of where the energy goes — and where the money is being wasted.',
  ],
  equations: [
    { t: 'Real vs apparent power (why PF matters)', eq: 'For an AC load:\n  apparent power S = V_rms · I_rms          (VA)\n  real power     P = V_rms · I_rms · cosφ   (W)\n  power factor   PF = cosφ = P / S\n\nCurrent alone gives S (misleading). Measure P and PF.\nLow PF = more current than the real power needs = waste.' },
    { t: 'Energy and idle load', eq: 'Energy accumulates real power over time:\n  E = ∫ P dt   (kWh)\n\nIdle/phantom load = P > 0 while the machine should be OFF.\n  waste_kWh = P_idle · off_hours\n  saving = waste_kWh · tariff  → often free to eliminate.' },
    { t: 'Baseline anomaly (condition signal)', eq: 'For a machine\'s duty state, learn baseline P_base:\n  P_base ← P_base + α·(P − P_base)   (during normal duty)\n\n  anomaly if P sustained > k·P_base for the same duty\n  → developing mechanical/electrical fault, or left-on.\nCompare like-with-like (same duty state).' },
  ],

  assembly: [
    { h: 'Install per-machine metering safely', p: [
      'Fit a real-power meter (PZEM-004T with its CT, or split-core CTs plus a voltage reference) on each machine\'s supply, enclosed, fused and isolated. Have a qualified electrician do or verify the mains-side work.',
      'Clip split-core CTs around the live conductor without breaking it; never open a CT secondary under load.',
    ], warn: 'Mains metering is dangerous and often legally requires a qualified electrician. Isolation, fusing and correct CT handling are safety-critical, not optional.' },
    { h: 'Set up collection and storage', p: [
      'Read each meter\'s real power/energy/V/I/PF with the ESP32 and stream to InfluxDB, with a local buffer so a network drop does not lose data.',
    ] },
    { h: 'Build the dashboard and baselines', p: [
      'Create Grafana panels for per-machine live/historical power, energy, PF and site total, and learn each machine\'s baseline for anomaly alerts.',
    ] },
  ],
  steps: [
    { h: 'Read real power and detect anomalies', p: [
      'Read real power and PF per machine, accumulate energy, maintain a per-duty baseline, and flag sustained deviations or idle-but-on conditions.',
    ], code: {
      file: 'energy-monitor.ino', lang: 'cpp',
      body: `struct Machine { float pBase; float energyKWh; bool baselined; };

// Update baseline during normal duty; flag sustained anomalies.
const char* checkMachine(Machine &m, float realW, bool shouldBeOff,
                         float dtHrs) {
  m.energyKWh += realW/1000.0f * dtHrs;          // accumulate energy

  if (shouldBeOff && realW > IDLE_W)
    return "idle/phantom load (on while off)";   // free saving

  if (!m.baselined) {
    if (realW > MIN_DUTY_W) { m.pBase = realW; m.baselined = true; }
    return nullptr;
  }
  if (realW > MIN_DUTY_W) m.pBase += 0.01f*(realW - m.pBase);  // slow baseline
  if (realW > 1.3f * m.pBase)                    // 30% over baseline, sustained
    return "drawing above baseline (check machine)";
  return nullptr;
}`,
      explain: [
        { ref: 'm.energyKWh += realW/1000.0f * dtHrs', txt: 'Energy is integrated from real power over time, giving the kWh figure that translates directly to cost and savings.' },
        { ref: 'if (shouldBeOff && realW > IDLE_W)', txt: 'Power drawn while the machine should be off is flagged as an idle/phantom load — usually the cheapest saving a factory can make.' },
        { ref: 'if (realW > MIN_DUTY_W) m.pBase += 0.01f*(realW - m.pBase)', txt: 'The baseline is learned slowly during real duty, so the anomaly test compares each reading against this machine\'s own normal.' },
        { ref: 'if (realW > 1.3f * m.pBase)', txt: 'A sustained draw well above baseline for the same duty flags a developing fault or a machine left running — the condition-monitoring dimension of energy data.' },
      ],
    } },
    { h: 'Stream, dashboard and quantify savings', p: [
      'Stream readings to InfluxDB, build Grafana panels for per-machine and site trends, and use before/after data to quantify the saving from each fix.',
    ], tip: 'Compare like duty states — a machine at full load vs idle are different baselines; anomalies are meaningful only within the same state.' },
  ],

  code: [{
    file: 'factory-energy-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Factory Energy Dashboard — ESP32, per-machine real-power metering

   Reads each machine's real power / energy / PF, streams to InfluxDB
   for a Grafana dashboard, detects idle/phantom loads and baseline
   anomalies, and quantifies waste. Insight tool, not billing metering.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PZEM004Tv30.h>
#include <HTTPClient.h>
#include <Preferences.h>

#define PZEM_RX 16
#define PZEM_TX 17
#define IDLE_W    30.0f
#define MIN_DUTY_W 100.0f
#define MACHINE  "press-1"

PZEM004Tv30 pzem(Serial2, PZEM_RX, PZEM_TX);
Preferences prefs;
float pBase = 0; bool baselined = false;
uint32_t lastMs = 0;

const char* check(float realW, float pf, bool shouldBeOff, float dtHrs) {
  if (shouldBeOff && realW > IDLE_W) return "idle/phantom load";
  if (!baselined) { if (realW > MIN_DUTY_W){pBase=realW;baselined=true;} return nullptr; }
  if (realW > MIN_DUTY_W) pBase += 0.01f*(realW - pBase);
  if (realW > 1.3f*pBase) return "above baseline";
  if (pf > 0 && pf < 0.7f) return "poor power factor";
  return nullptr;
}

void toInflux(float v,float i,float p,float e,float pf,const char*note){
  HTTPClient http;
  http.begin(String(INFLUX_URL) + "/api/v2/write?bucket=energy&precision=s");
  http.addHeader("Authorization", String("Token ") + INFLUX_TOKEN);
  http.addHeader("Content-Type","text/plain");
  // line protocol: measurement,tags fields
  char line[220];
  snprintf(line,sizeof line,
    "power,machine=%s v=%.1f,i=%.2f,p=%.1f,e=%.3f,pf=%.2f",
    MACHINE, v, i, p, e, pf);
  http.POST(line);
  http.end();
}

void setup(){
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  prefs.begin("energy",true);
  pBase=prefs.getFloat("base",0); baselined=pBase>0; prefs.end();
  lastMs = millis();
}

void loop(){
  uint32_t now = millis();
  float dtHrs = (now - lastMs)/3600000.0f; lastMs = now;

  float v  = pzem.voltage();
  float i  = pzem.current();
  float p  = pzem.power();          // REAL power (W)
  float e  = pzem.energy();         // cumulative kWh
  float pf = pzem.pf();

  if (!isnan(p)) {
    bool shouldBeOff = isOffShift();          // from schedule/relay state
    const char *note = check(p, pf, shouldBeOff, dtHrs);
    toInflux(v, i, p, e, pf, note);
    if (note) publishAlert(MACHINE, note);    // anomaly/idle/PF alert
  }
  delay(5000);                                 // 0.2 Hz per machine
}`,
    explain: [
      { ref: 'float p  = pzem.power();          // REAL power (W)', txt: 'The meter returns real power directly, so consumption and energy are correct for the inductive machine loads that current-only measurement would misstate.' },
      { ref: 'if (shouldBeOff && realW > IDLE_W) return "idle/phantom load"', txt: 'Detects a machine drawing power when it should be off — the flat overnight baseline that is usually a free saving.' },
      { ref: 'if (pf > 0 && pf < 0.7f) return "poor power factor"', txt: 'Flags poor power factor per machine, pinpointing where reactive-power correction would cut wasted current and utility penalties.' },
      { ref: 'toInflux(', txt: 'Each reading is written to InfluxDB in line protocol, feeding the Grafana dashboard of per-machine and site trends.' },
      { ref: 'if (realW > 1.3f*pBase) return "above baseline"', txt: 'A sustained draw above the machine\'s learned baseline raises an anomaly alert — energy data doubling as a maintenance signal.' },
    ],
  }],

  config: [
    'Assign one meter per machine and tag its data; set idle/duty thresholds and baseline behaviour.',
    'Configure InfluxDB (bucket/token) and Grafana panels for per-machine and site views.',
    'Define off-shift schedules so idle-load detection knows when a machine should be off.',
    'Set anomaly and power-factor alert thresholds per machine.',
  ],
  calibration: [
    { h: 'Meter accuracy', p: [
      'Verify the meter/CT reads correctly against a reference for a known load; ensure it reports real power and PF, not just current.',
    ] },
    { h: 'Baselines', p: [
      'Capture each machine\'s normal power profile per duty state before trusting anomaly alerts.',
    ] },
    { h: 'Idle detection', p: [
      'Confirm off-shift/idle detection matches reality so phantom-load alerts are accurate.',
    ] },
  ],
  testing: [
    { step: 'Run a machine at known load', expect: 'Real power/energy/PF match a reference within meter accuracy' },
    { step: 'Leave a machine on while "off"', expect: 'Idle/phantom-load alert; visible as a non-zero overnight baseline' },
    { step: 'Load a machine above its baseline', expect: 'Above-baseline anomaly alert' },
    { step: 'Add a poor-PF load', expect: 'Power-factor alert; PF shown per machine' },
    { step: 'Drop the network', expect: 'Local buffer holds data; streams when reconnected' },
    { step: 'Fix an idle load and compare', expect: 'Dashboard quantifies the kWh/cost saving' },
  ],
  output: [
    'Grafana shows per-machine and site power/energy trends, PF, and rankings of the biggest consumers; anomalies and idle loads raise alerts.',
    { file: 'energy-line.txt', lang: 'plain', body: `power,machine=press-1 v=232.1,i=8.4,p=1740.0,e=412.836,pf=0.89
# note: idle/phantom load overnight — 2.1 kW for 8 h = ~16.8 kWh/day wasted
# fix: switch off at shift end -> ~₹X/day saved (tariff x kWh)` },
    'A per-machine reading with real power and PF; the annotated note shows an overnight idle load quantified into a daily kWh (and cost) saving — the measure-act-verify loop that makes the dashboard pay.',
  ],
  troubleshoot: [
    { sym: 'Consumption looks too high', cause: 'Measuring current/apparent power, not real power', fix: 'Use a meter that reports real power and PF; do not infer from current alone' },
    { sym: 'Data not per-machine', cause: 'Meter on a shared circuit', fix: 'One meter per machine/circuit for genuine disaggregation' },
    { sym: 'False anomalies', cause: 'Comparing across different duty states', fix: 'Baseline per duty state; compare like-with-like' },
    { sym: 'Data gaps', cause: 'Network drop without buffering', fix: 'Buffer locally and backfill on reconnect' },
    { sym: 'Unsafe installation', cause: 'DIY mains work / open CT secondary', fix: 'Use a qualified electrician; never open a CT under load; enclose/fuse/isolate' },
  ],

  iot: {
    protoShort: 'Wi-Fi → InfluxDB + Grafana',
    net: {
      nodes: [{ name: 'Machine meter', sub: 'ESP32' }, { name: 'Other machines', sub: 'per-meter' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to server',
      uplink: 'HTTP/MQTT', cloud: 'InfluxDB + Grafana', cloudSub: 'time series',
      clients: [{ name: 'Dashboard', sub: 'per-machine trends' }, { name: 'Phone', sub: 'anomaly alerts' }],
    },
    protocol: ['Each meter streams real power/energy/PF to a time-series database on a few-second cadence; anomalies and idle loads publish alerts. Local buffering covers network drops.'],
    topics: [
      { t: 'energy/machineX/reading', dir: 'node → DB', payload: 'V, I, real power, energy, PF' },
      { t: 'energy/machineX/alert', dir: 'node → ops', payload: 'idle load / above baseline / poor PF' },
      { t: 'energy/machineX/status', dir: 'node → ops', payload: 'meter/link health' },
    ],
    cloud: ['InfluxDB stores the time series and Grafana visualises per-machine and site energy, rankings, PF and peak demand; alerts drive action, and before/after comparisons quantify savings.'],
    dashboard: ['Per-machine power/energy/PF trends, a consumer ranking, site total and peak-demand view, and annotations for fixes and their measured savings.'],
    mobile: ['Alerts for idle/phantom loads, above-baseline draw, and poor power factor.'],
    security: [
      'Secure the InfluxDB/Grafana stack and authenticate nodes.',
      'Keep mains-side metering safely isolated from the low-voltage network.',
      'Alert on meter/link silence so a blind machine is noticed.',
    ],
  },

  perf: [
    'A few-second cadence per machine is ample for energy trends; heavier sampling is unnecessary.',
    'Read real power/PF from the meter directly rather than computing from raw ADC where possible.',
    'Buffer locally and backfill so the time series has no gaps.',
    'Aggregate/downsample in InfluxDB for long-term trends.',
  ],
  safety: [
    'Mains metering is dangerous — isolate, fuse and enclose, and have a qualified electrician do or verify the work; never open a CT secondary under load.',
    'This is an insight/monitoring tool, not billing-grade or safety metering; accuracy depends on the meter/CT and installation.',
    'Keep low-voltage electronics isolated from the mains-side measurement.',
    'Act on anomalies (which may indicate electrical faults) with appropriate caution and expertise.',
  ],
  maintenance: [
    'Verify meter/CT accuracy periodically against a reference.',
    'Re-baseline after process/machine changes.',
    'Check the InfluxDB/Grafana stack and buffering are healthy.',
    'Review and act on idle-load and anomaly alerts, and log the savings.',
  ],
  future: [
    'Add three-phase and sub-metering granularity where needed.',
    'Add automatic power-factor-correction recommendations per machine.',
    'Add ML disaggregation to estimate loads from fewer meters.',
    'Integrate with the maintenance system so power anomalies raise work orders.',
  ],
  faq: [
    { q: 'Why not just read the utility meter?', a: 'It measures the whole site as one number, which hides where energy goes. Per-machine metering shows the hogs, the idle loads and the anomalies — the resolution at which you can actually cut waste.' },
    { q: 'Why measure real power, not current?', a: 'Machines are inductive, so current and voltage are out of phase. Real power (watts) is current × voltage × power factor and is less than the apparent power current implies. Measuring current alone overstates use and hides power-factor problems.' },
    { q: 'What is the quickest saving?', a: 'Usually idle/phantom loads — machines drawing power while "off". They show up as a flat overnight baseline and are often free to eliminate by switching off at shift end.' },
    { q: 'Can power data predict maintenance?', a: 'Often, yes. A machine steadily drawing more than its baseline for the same work can indicate friction, a dragging bearing or an electrical issue — sometimes before other signals, so the dashboard doubles as a condition monitor.' },
    { q: 'Is it safe to install myself?', a: 'Mains metering is dangerous and often legally requires a qualified electrician. Isolation, fusing and correct CT handling are safety-critical — get the mains-side work done or verified professionally.' },
  ],
  refs: [
    { t: 'Power factor and real vs apparent power', u: 'https://en.wikipedia.org/wiki/Power_factor', s: 'Reference' },
    { t: 'Current transformers (CTs) and safety', u: 'https://en.wikipedia.org/wiki/Current_transformer', s: 'Reference' },
    { t: 'PZEM-004T energy monitor', u: 'https://innovatorsguru.com/pzem-004t-v3/', s: 'Reference' },
    { t: 'InfluxDB + Grafana time-series monitoring', u: 'https://grafana.com/', s: 'Grafana' },
    { t: 'Industrial energy management (ISO 50001)', u: 'https://www.iso.org/iso-50001-energy-management.html', s: 'ISO' },
  ],
  images: ['factory', 'esp32', 'grafana'],
  imageCaptions: [
    'Per-machine metering turns one opaque factory bill into a map of where the energy actually goes.',
    'ESP32 module reading each machine\'s real power and power factor and streaming it to the dashboard.',
    'A Grafana dashboard trends per-machine consumption, ranks the hogs, and quantifies the savings from each fix.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   061 — Conveyor Item Counter
   ══════════════════════════════════════════════════════════════════ */
{
  id: '061',
  domainKey: 'electronics',
  emoji: '🔢', thumb: 'sensor',
  difficulty: 'Beginner',
  hours: '8–14 hours', iso8601: 'PT12H',
  tagline: 'Counts products passing on a conveyor accurately and automatically — with the debouncing, gap-detection and edge cases handled so the tally is right, not roughly right.',

  overview: [
    'Counting the items coming off a production line sounds trivial until you try to do it reliably at speed. A break-beam across the belt seems obvious — an item blocks the beam, add one — but a naive counter double-counts a single tall item that flickers the beam, misses two items that touch as they pass, counts a hand reaching in, and drifts off over a shift so the tally no longer matches reality. Getting an <b>accurate</b> automatic count means handling all of those edge cases deliberately. This project builds a conveyor item counter that is right, not roughly right, because in production a count that is a few percent off is a count nobody trusts.',
    'The sensing is a beam-break (an IR emitter/receiver across the belt, or an ultrasonic/photoelectric sensor), but the intelligence is in the <b>signal processing</b>. Each item produces a beam-break of a characteristic duration as it passes at belt speed; the counter <b>debounces</b> the edges so a single item cannot register twice, uses the <b>gap</b> between items to separate two that pass close together, and applies a plausible <b>duration window</b> to reject things that are not products — a hand, a jam, a long shadow. It can infer <b>direction</b> with a second beam so items going backwards (or a rejected item pulled off) are not miscounted. The result is a tally that holds up against a manual count across a full shift.',
    'Beyond the raw count, per-line counting gives <b>production insight</b>: throughput rate (items per minute), which reveals slowdowns and stoppages; totals per shift/batch for accurate production records; and gap/rate patterns that flag jams or feed problems. It reports to a dashboard and can drive downstream actions (batch complete, carton full). It is honest that a simple beam counts <i>objects breaking the beam</i>, not verified good products — quality and identity need a camera or other sensing — and that very fast lines or touching/overlapping items push a single beam to its limits. But as an accurate, well-debounced, edge-case-aware counter, it replaces guesswork and manual tallies with a production count a line can actually rely on.',
  ],
  does: [
    'Counts items passing on a conveyor with a beam-break sensor',
    'Debounces edges so one item never double-counts',
    'Uses inter-item gaps to separate items passing close together',
    'Rejects non-products by a plausible duration window',
    'Infers direction with a second beam (ignore backward/rejected items)',
    'Reports throughput rate and per-shift/batch totals',
    'Flags jams/feed problems from gap and rate patterns',
  ],
  features: [
    'Accurate counting with proper debouncing and gap logic',
    'Duration-window rejection of hands/jams/shadows',
    'Optional direction detection (two beams)',
    'Throughput rate and batch/shift totals',
    'Jam/stoppage detection from rate patterns',
    'Dashboard reporting and downstream triggers',
    'Honest scope: counts objects, not verified good product',
  ],
  applications: [
    { t: 'Production line counting', d: 'Accurate automatic tallies of products coming off a line for records and pay/output tracking.' },
    { t: 'Packing / cartoning', d: 'Counting items into a carton and triggering "carton full"/batch-complete actions.' },
    { t: 'Throughput / OEE input', d: 'Feeding item rate into productivity and OEE calculations, and flagging slowdowns.' },
    { t: 'Warehouse / sortation', d: 'Counting items past a point on a belt for inventory and flow monitoring.' },
  ],
  skills: [
    'Beam-break sensing and clean edge detection',
    'Debouncing, gap logic and duration-window filtering',
    'Direction detection with two sensors',
    'Rate/throughput computation and jam detection',
    'Reporting counts and triggering downstream actions',
  ],
  prereq: [
    'Naive edge-counting double-counts and misses items — debouncing, gap logic and a duration window are what make it accurate.',
    'A single beam counts objects breaking it, not verified good products; touching/overlapping items and very fast lines need care (or a second beam/camera).',
    'Position and shield the sensor so ambient light and the belt itself do not cause false counts.',
    'Validate against a manual count before trusting the tally.',
  ],

  parts: ['esp32', 'ir_sensor', 'oled', 'relay1', 'buzzer', 'psu5v'],
  extraParts: [
    { name: 'Break-beam sensor pair(s)', spec: 'IR emitter/receiver (or photoelectric) across the belt; two for direction', qty: 2, price: 300, note: 'Two beams a short distance apart give direction' },
    { name: 'Sensor mounts + shielding', spec: 'Rigid mounts and hoods to hold aim and reject ambient light', qty: 1, price: 250 },
    { name: 'Display / stack-light', spec: 'Count/rate display and optional stack-light for batch-complete', qty: 1, price: 500 },
    { name: 'Enclosure', spec: 'Industrial housing for the controller near the line', qty: 1, price: 350 },
  ],
  cost: '₹1,800 – ₹3,200',
  libs: ['wifi', 'pubsub', 'ssd1306', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Beam A receiver', devPin: 'OUT', pin: 'GPIO 34', sig: 'Primary beam-break' },
      { dev: 'Beam B receiver', devPin: 'OUT', pin: 'GPIO 35', sig: 'Second beam (direction)' },
      { dev: 'Reset/batch', devPin: 'btn', pin: 'GPIO 27', sig: 'Reset / batch mark' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Count + rate' },
      { dev: 'Batch relay/stack-light', devPin: 'IN', pin: 'GPIO 26', sig: 'Batch-complete action' },
      { dev: 'Buzzer', devPin: 'IN', pin: 'GPIO 13', sig: 'Jam/batch alert' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Report counts' },
    ],
  },
  wiringNotes: [
    'Mount the beam across the belt at a height that every item breaks but the belt/guides do not, and shield the receiver from ambient light (modulated beams help).',
    'For direction, place two beams a small, known distance apart; the order in which they break gives travel direction.',
    'Use the sensor\'s clean digital output (or threshold an analogue one with hysteresis) so edges are crisp.',
    'Drive a batch relay/stack-light for downstream actions and a buzzer for jam/batch alerts.',
    'Keep wiring away from motor/VFD noise that can cause false edges.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Beam A/B', sub: 'break + direction', highlight: true },
    ] },
    { label: 'Process', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'debounce + gap + window' },
      { name: 'Direction', sub: 'A→B vs B→A' },
    ] },
    { label: 'Count', edge: 'right', blocks: [
      { name: 'Tally + rate', sub: 'shift/batch' },
      { name: 'Jam detect', sub: 'rate pattern' },
    ] },
    { label: 'Act/report', edge: 'none', blocks: [
      { name: 'Batch action', sub: 'carton/light' },
      { name: 'Dashboard', sub: 'throughput' },
    ] },
  ] },
  flow: [
    { t: 'Beam edge', k: 'start' },
    { t: 'Break duration in item window?', k: 'dec', yes: 'Direction forward?', no: 'Reject (hand/jam/noise)' },
    { t: 'Direction forward?', k: 'dec', yes: 'Count +1 (after gap/debounce)', no: 'Ignore/decrement' },
    { t: 'Count +1 (after gap/debounce)', k: 'proc' },
    { t: 'Reject (hand/jam/noise)', k: 'io' },
    { t: 'Ignore/decrement', k: 'io' },
    { t: 'Update rate; batch/jam checks', k: 'proc' },
    { t: 'Report; trigger actions', k: 'end', back: 'Beam edge' },
  ],

  principle: [
    'The gap between a naive beam counter and an accurate one is entirely in <b>signal processing</b>, because the raw beam signal is deceptively messy. A single item passing does not produce one clean edge pair; it can produce edge chatter as it enters and leaves the beam, a flicker if it has a hole or a shiny spot, and its duration depends on its length and the belt speed. Meanwhile two items touching produce one long break that should count as two, a hand reaching in produces a very long break that should count as none, and electrical noise produces spurious edges. Accurate counting means turning this messy reality into a correct tally through a handful of well-chosen rules.',
    'The first rule is <b>debouncing</b>. After a valid count, the counter ignores further edges for a short refractory time (or requires the beam to clear and re-break) so the entry/exit chatter of one item cannot register as several. This single measure eliminates the most common error — the same item counted two or three times — and it is tuned so the refractory time is shorter than the minimum realistic gap between items but long enough to swallow edge chatter.',
    'The second and third rules handle the harder edge cases. A <b>duration window</b> rejects breaks that are implausibly long or short: an item at belt speed breaks the beam for a characteristic range of times, so a very long break (a hand, a jam, a stalled item) or a very short one (noise) is not counted, and a persistent long break can be flagged as a <b>jam</b>. And separating <b>touching items</b> — two products with no gap between them that make one continuous break — is where a second beam or a length model helps: if the break is about twice the single-item duration, it is two items; and with two beams a known distance apart, the timing between them gives both the count and the belt speed, disambiguating touching items and giving <b>direction</b> so a backward-moving or rejected item is not miscounted.',
    'On top of the correct count, the counter derives <b>production value</b>: the <b>throughput rate</b> (items per minute) exposes slowdowns and stoppages in real time; <b>batch/shift totals</b> give trustworthy production records and can trigger downstream actions (carton full, batch complete); and patterns in the gaps and rate flag <b>jams and feed problems</b> before they waste much product. The design is candid about what a beam does and does not know: it counts <i>objects that break the beam</i>, not verified good products — it cannot tell a good unit from a defective one, or item A from item B, which needs a camera or other identity/quality sensing — and very fast lines with tiny gaps push a single beam to its limit. But engineered with proper debouncing, a duration window, gap/direction logic and validation against a manual count, it delivers what production actually needs: a count that is <i>right</i>, holding up over a full shift, rather than a rough guess that no one trusts.',
  ],
  equations: [
    { t: 'Debounce / refractory', eq: 'After a valid count, ignore edges for t_refractory:\n\n  count only if (t_now − t_last_count) > t_refractory\n  and require the beam to have cleared (rising edge) first\n\nt_refractory < min realistic item gap, > edge chatter.\nPrevents one item counting multiple times.' },
    { t: 'Duration window + jam', eq: 'Item break duration at belt speed v, item length L:\n  t_break ≈ (L + beam_width) / v\n\n  count if  t_min < t_break < t_max\n  t_break > t_jam (>> t_max) → JAM / stalled item → alert\n  ~2·t_single with no gap → two touching items\n\nRejects hands/noise; separates touching items.' },
    { t: 'Direction + throughput', eq: 'Two beams distance s apart; A breaks then B → forward:\n  v = s / (t_B − t_A),  direction = sign(t_B − t_A)\n\n  count only forward-moving items\n  rate = items / elapsed_time (items per minute)\n  falling rate / long gaps → slowdown/stoppage.' },
  ],

  assembly: [
    { h: 'Mount and shield the beam', p: [
      'Fit the emitter/receiver across the belt at a height every item breaks but the belt and guides do not, shielded from ambient light (a modulated beam is ideal). For direction, add a second beam a known short distance downstream.',
    ] },
    { h: 'Wire the controller and outputs', p: [
      'Connect the beam outputs to the ESP32, plus a display for count/rate, a batch relay/stack-light for downstream actions and a buzzer for jam/batch alerts.',
    ] },
    { h: 'Set up reporting', p: [
      'Configure Wi-Fi reporting of counts/rate to a dashboard and the batch/shift logic.',
    ] },
  ],
  steps: [
    { h: 'Count accurately with debounce, window and direction', p: [
      'On each beam clear-and-break, measure the break duration, apply the duration window and refractory time, check direction with the second beam, and increment only for a valid forward item.',
    ], code: {
      file: 'counter.ino', lang: 'cpp',
      body: `#define T_MIN_MS   20     // shortest plausible item break
#define T_MAX_MS  400     // longest single-item break
#define T_JAM_MS 2000     // beyond this = jam/stalled
#define T_REFRACTORY 15   // min ms between counts

uint32_t breakStart=0, lastCount=0, aBreak=0, bBreak=0;
long count=0;

// Primary beam edge (LOW = broken). Returns true if it counted.
bool onBeamA(bool broken, uint32_t now){
  if (broken) { breakStart = now; aBreak = now; return false; }
  // beam cleared -> evaluate the completed break
  uint32_t dur = now - breakStart;
  if (dur > T_JAM_MS) { raiseJam(); return false; }
  if (dur < T_MIN_MS || dur > T_MAX_MS) return false;   // reject non-item
  if (now - lastCount < T_REFRACTORY) return false;     // debounce

  bool forward = (bBreak >= aBreak) && (bBreak - aBreak < 500); // A before B
  if (!forward) return false;                           // ignore backward
  count++; lastCount = now;
  // roughly-2x single duration with no gap could be two touching items:
  if (dur > 1.7f*T_TYPICAL) count++;                    // count the pair
  return true;
}`,
      explain: [
        { ref: 'if (dur > T_JAM_MS) { raiseJam(); return false; }', txt: 'A break far longer than any item means a jam or a stalled product, so it is alarmed rather than counted.' },
        { ref: 'if (dur < T_MIN_MS || dur > T_MAX_MS) return false', txt: 'The duration window rejects noise (too short) and hands/obstructions (too long), counting only breaks consistent with a passing item.' },
        { ref: 'if (now - lastCount < T_REFRACTORY) return false', txt: 'The refractory time debounces edge chatter so one item cannot register as several.' },
        { ref: 'bool forward = (bBreak >= aBreak)', txt: 'The order in which the two beams broke gives travel direction, so backward-moving or rejected items are not counted.' },
        { ref: 'if (dur > 1.7f*T_TYPICAL) count++', txt: 'A break near twice the typical single-item duration with no gap is two touching items, so the pair is counted correctly.' },
      ],
    } },
    { h: 'Compute rate, detect jams, report', p: [
      'Maintain items-per-minute and batch/shift totals, flag jams/slowdowns from the rate and gap patterns, trigger batch-complete actions, and report to the dashboard.',
    ], tip: 'Always validate the automatic count against a manual count over a run before trusting it — then tune the window/refractory to close any gap.' },
  ],

  code: [{
    file: 'conveyor-item-counter.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Conveyor Item Counter — ESP32, debounced beam-break

   Counts items on a belt accurately with debouncing, a duration window,
   optional two-beam direction, and touching-item separation. Computes
   throughput and batch totals, flags jams, and triggers batch actions.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>

#define PIN_A 34          // primary beam receiver (LOW = broken)
#define PIN_B 35          // second beam (direction)
#define PIN_BATCH_OUT 26
#define PIN_BUZZER 13
#define T_MIN_MS 20
#define T_MAX_MS 400
#define T_JAM_MS 2000
#define T_REFRACTORY 15
#define T_TYPICAL 120
#define BATCH_SIZE 24

Adafruit_SSD1306 oled(128,64,&Wire);
Preferences prefs;
WiFiClient net; PubSubClient mqtt(net);

volatile uint32_t breakStart=0, aBreak=0, bBreak=0, lastCount=0;
volatile long count=0, batchCount=0;
uint32_t rateWindowStart=0; long rateWindowCount=0; float itemsPerMin=0;
bool aBroken=false;

void IRAM_ATTR onA() {                       // both edges of beam A
  uint32_t now = millis();
  if (digitalRead(PIN_A)==LOW) { breakStart=now; aBreak=now; aBroken=true; return; }
  aBroken=false;
  uint32_t dur = now - breakStart;
  if (dur > T_JAM_MS) return;                 // jam handled in loop
  if (dur < T_MIN_MS || dur > T_MAX_MS) return;
  if (now - lastCount < T_REFRACTORY) return;
  bool forward = (bBreak >= aBreak) && (bBreak - aBreak < 500);
  if (!forward) return;
  count++; batchCount++; lastCount = now; rateWindowCount++;
  if (dur > 1.7f*T_TYPICAL) { count++; batchCount++; rateWindowCount++; }
}
void IRAM_ATTR onB() { if (digitalRead(PIN_B)==LOW) bBreak=millis(); }

void setup(){
  Serial.begin(115200);
  pinMode(PIN_A, INPUT_PULLUP); pinMode(PIN_B, INPUT_PULLUP);
  pinMode(PIN_BATCH_OUT, OUTPUT); pinMode(PIN_BUZZER, OUTPUT);
  attachInterrupt(PIN_A, onA, CHANGE);
  attachInterrupt(PIN_B, onB, CHANGE);
  Wire.begin(21,22); oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  WiFi.begin(WIFI_SSID, WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  prefs.begin("cnt",true); count=prefs.getLong("count",0); prefs.end();
  rateWindowStart = millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("cnt-1");
  mqtt.loop();
  uint32_t now = millis();

  // throughput rate over a rolling 60 s window
  if (now - rateWindowStart >= 60000) {
    itemsPerMin = rateWindowCount;
    rateWindowCount = 0; rateWindowStart = now;
  }

  // jam detection: beam A held broken too long
  if (aBroken && now - breakStart > T_JAM_MS) {
    digitalWrite(PIN_BUZZER, HIGH);
    mqtt.publish("line/1/alert", "JAM (beam held)");
  } else digitalWrite(PIN_BUZZER, LOW);

  // batch complete
  if (batchCount >= BATCH_SIZE) {
    digitalWrite(PIN_BATCH_OUT, HIGH); delay(200);
    digitalWrite(PIN_BATCH_OUT, LOW);
    mqtt.publish("line/1/batch", "complete");
    batchCount = 0;
  }

  oled.clearDisplay(); oled.setCursor(0,0);
  oled.printf("Count: %ld\\nBatch: %ld/%d\\n%.0f /min",
              count, batchCount, BATCH_SIZE, itemsPerMin);
  oled.display();

  char m[120];
  snprintf(m,sizeof m,"{\\"count\\":%ld,\\"rate\\":%.0f}", count, itemsPerMin);
  mqtt.publish("line/1/count", m);

  prefs.begin("cnt",false); prefs.putLong("count",count); prefs.end();
  delay(500);
}`,
    explain: [
      { ref: 'void IRAM_ATTR onA()', txt: 'The primary beam is handled in an interrupt on both edges, measuring each break\'s duration and applying the window, refractory and direction checks so the count stays accurate at speed.' },
      { ref: 'if (dur > 1.7f*T_TYPICAL) { count++;', txt: 'A break near twice the typical single-item duration is treated as two touching items, so items with no gap between them are still counted correctly.' },
      { ref: 'if (aBroken && now - breakStart > T_JAM_MS)', txt: 'A beam held broken far too long is a jam, which sounds the buzzer and alerts rather than corrupting the count.' },
      { ref: 'if (batchCount >= BATCH_SIZE)', txt: 'Reaching the batch size triggers a downstream action (relay/stack-light) and a batch-complete message — the counter driving the line, not just tallying.' },
      { ref: 'prefs.putLong("count",count)', txt: 'The running total is persisted so a reset or power blip does not lose the shift\'s count.' },
    ],
  }],

  config: [
    'Set the duration window, refractory time and typical single-item duration for your product and belt speed.',
    'Configure the two-beam spacing for direction/speed, the batch size, and jam threshold.',
    'Set reporting (dashboard) and downstream actions (batch relay/stack-light).',
    'Enable ambient-light shielding/modulation appropriate to the environment.',
  ],
  calibration: [
    { h: 'Window/refractory', p: [
      'Run known items at production speed and set the duration window and refractory so every item counts once and none is missed.',
    ] },
    { h: 'Touching items', p: [
      'Test with items deliberately touching; tune the double-count threshold (or rely on the second beam) so pairs count correctly.',
    ] },
    { h: 'Manual validation', p: [
      'Compare the automatic count to a manual count over a run; adjust until they agree, then across a full shift.',
    ] },
  ],
  testing: [
    { step: 'Pass single items at speed', expect: 'Each counts exactly once (debounced)' },
    { step: 'Pass two touching items', expect: 'Counted as two (double-duration or second-beam logic)' },
    { step: 'Reach a hand into the beam', expect: 'Long break rejected (not counted)' },
    { step: 'Stall an item in the beam', expect: 'Jam alert; not counted' },
    { step: 'Move an item backward (two beams)', expect: 'Not counted (direction)' },
    { step: 'Validate over a shift', expect: 'Automatic total matches the manual count' },
  ],
  output: [
    'The display and dashboard show the running count, batch progress and throughput rate; jams and batch-complete raise alerts/actions.',
    { file: 'count.json', lang: 'json', body: `{
  "line": 1,
  "count": 4821,
  "rate": 96,
  "batch": "18/24"
}` },
    'A live tally with throughput (96/min) and batch progress; a jam would raise an alert and a completed batch would trigger the downstream action — an accurate, actionable production count rather than a rough estimate.',
  ],
  troubleshoot: [
    { sym: 'Over-counting', cause: 'Edge chatter / no debounce', fix: 'Add refractory time; require beam clear before next count; shield from noise/ambient light' },
    { sym: 'Missing items', cause: 'Window too tight or touching items merged', fix: 'Widen the window to real break durations; use double-duration/second-beam logic for touching items' },
    { sym: 'Counts hands/jams', cause: 'No duration window', fix: 'Reject too-long breaks; alarm jams' },
    { sym: 'Backward items counted', cause: 'Single beam, no direction', fix: 'Add a second beam and count only forward travel' },
    { sym: 'Drifts vs manual count', cause: 'Untuned parameters', fix: 'Validate against a manual count and tune window/refractory; re-check across a shift' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → production dashboard',
    net: {
      nodes: [{ name: 'Counter', sub: 'ESP32' }, { name: 'Other lines', sub: 'per-line' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to MQTT',
      uplink: 'MQTT 1883', cloud: 'Production dashboard', cloudSub: 'counts + rate',
      clients: [{ name: 'Dashboard', sub: 'throughput' }, { name: 'Ops', sub: 'jam/batch alerts' }],
    },
    protocol: ['Counts and rate publish on a slow cadence; jams and batch-complete publish immediately. The count persists locally so it is not lost on a reset.'],
    topics: [
      { t: 'line/1/count', dir: 'node → dashboard', payload: 'running count, rate, batch progress' },
      { t: 'line/1/alert', dir: 'node → ops', payload: 'jam / slowdown' },
      { t: 'line/1/batch', dir: 'node → line', payload: 'batch complete (trigger action)' },
    ],
    cloud: ['A production dashboard trends throughput and totals per line/shift/batch, feeds OEE, and surfaces jams and slowdowns.'],
    dashboard: ['Live count and rate per line, shift/batch totals, and jam/slowdown markers.'],
    mobile: ['Alerts for jams, slowdowns and batch-complete.'],
    security: [
      'Authenticate nodes so counts cannot be spoofed.',
      'Persist counts locally so a network/power blip does not lose the tally.',
      'Alert on counter silence so a down line is noticed.',
    ],
  },

  perf: [
    'Handle beam edges in interrupts for accurate timing at speed.',
    'Keep the debounce/window logic lightweight so it runs in the ISR without missing edges.',
    'Compute rate over a rolling window; report counts on a slow cadence.',
    'Persist the count so resets do not lose the shift total.',
  ],
  safety: [
    'Mount sensors clear of moving belt parts and pinch points; follow machine-guarding rules.',
    'This counts objects breaking the beam, not verified good product — do not treat it as quality/identity verification.',
    'Validate against a manual count before relying on the tally for records or pay.',
    'Keep wiring away from motor/VFD noise and follow electrical safety near the line.',
  ],
  maintenance: [
    'Clean the beam optics; dust/product buildup causes false or missed counts.',
    'Re-validate against a manual count periodically and after product/speed changes.',
    'Check sensor alignment and shielding remain good.',
    'Verify batch/jam actions and the persisted count.',
  ],
  future: [
    'Add a camera for product identity/quality alongside the count.',
    'Add speed-aware length measurement to classify item sizes.',
    'Feed counts directly into OEE and MES systems.',
    'Add reject verification (count items removed) for accurate good-count.',
  ],
  faq: [
    { q: 'Why is a simple beam counter inaccurate?', a: 'Because raw edges are messy — one item can chatter or flicker the beam, two touching items make one break, and hands/jams break it too. Accurate counting needs debouncing, a duration window and gap/direction logic.' },
    { q: 'How does it separate two touching items?', a: 'A break near twice the single-item duration is treated as two, and with two beams a known distance apart the timing gives the belt speed and disambiguates them — plus direction so backward items are not counted.' },
    { q: 'Does it count only good products?', a: 'No — it counts objects that break the beam. It cannot tell a good unit from a defective one or item A from item B; that needs a camera or other identity/quality sensing.' },
    { q: 'Why validate against a manual count?', a: 'Because a production count nobody trusts is worthless. Comparing to a manual count over a run (and a shift) proves the tuning is right before you rely on the tally.' },
    { q: 'What about very fast lines?', a: 'Very fast lines with tiny gaps push a single beam to its limits. A second beam, faster sensing, or a camera helps; the design is honest about that boundary.' },
  ],
  refs: [
    { t: 'Photoelectric / break-beam sensors', u: 'https://en.wikipedia.org/wiki/Photoelectric_sensor', s: 'Reference' },
    { t: 'Debouncing and edge detection', u: 'https://en.wikipedia.org/wiki/Switch#Contact_bounce', s: 'Reference' },
    { t: 'Conveyor systems and counting', u: 'https://en.wikipedia.org/wiki/Conveyor_system', s: 'Reference' },
    { t: 'Throughput and OEE', u: 'https://en.wikipedia.org/wiki/Overall_equipment_effectiveness', s: 'Reference' },
    { t: 'Direction sensing with dual beams', u: 'https://en.wikipedia.org/wiki/Quadrature_encoder', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'ultrasonic'],
  imageCaptions: [
    'A beam across the belt counts products passing on the line.',
    'ESP32 module debouncing edges and applying gap/duration/direction logic for an accurate tally.',
    'Throughput rate and batch totals turn the count into actionable production data.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   062 — Predictive Motor Temperature
   ══════════════════════════════════════════════════════════════════ */
{
  id: '062',
  domainKey: 'iot',
  emoji: '🌡️', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Watches a motor\'s temperature and, crucially, its rate of rise — warning before it overheats and trips, so a line is stopped on purpose instead of by a failure.',

  overview: [
    'When an industrial motor overheats, it does not just stop — it takes the production line down with it, unplanned, often at the worst moment, and repeated overheating quietly cooks the winding insulation until the motor fails for good. The motor\'s own thermal protection trips only when it is already too hot, which means the line stops as a <b>consequence</b> of the problem. This project moves the warning earlier: it watches the motor\'s temperature continuously and, most importantly, its <b>rate of rise</b>, so it can predict an overheat before it happens and warn while there is still time to intervene — reduce load, improve cooling, or stop the line on your terms rather than the motor\'s.',
    'A temperature sensor on or near the motor (a contact probe on the frame/bearing, or a non-contact infrared sensor aimed at the winding area) gives the reading. But the key insight is that <b>how fast the temperature is climbing</b> is a better early warning than the absolute value: a motor heading for trouble shows an abnormally fast rise, or a rise that does not level off at its normal steady-state, long before it reaches the trip point. By modelling the motor\'s normal thermal behaviour — it warms to a steady temperature for a given load and ambient, following a characteristic curve — the monitor can tell a normal warm-up from a developing problem and project when the trip threshold will be reached.',
    'That projection is the value: instead of "the motor is hot" (too late), it says "at this rate the motor will hit its limit in N minutes — act now". It stages alerts (watch/warning/critical), can trigger protective actions, and logs the thermal history so recurring overheating (a sign of overload, poor cooling, or a developing bearing/electrical fault) is visible and fixable. It is honest that it complements, not replaces, the motor\'s built-in thermal protection and proper thermal design, and that sensor placement and the motor\'s real thermal path matter. But as a predictive layer that turns temperature and its rate of change into advance warning, it converts unplanned overheating shutdowns into planned, controlled interventions — which is exactly what keeps a line running.',
  ],
  does: [
    'Monitors motor temperature continuously (contact or non-contact)',
    'Tracks the rate of rise, the key early-warning signal',
    'Models normal thermal behaviour to tell warm-up from a problem',
    'Projects time-to-trip and warns before overheating',
    'Stages alerts (watch/warning/critical) and can trigger protection',
    'Logs thermal history to reveal recurring overheating causes',
    'Complements the motor\'s own thermal protection',
  ],
  features: [
    'Rate-of-rise prediction, not just a hot-threshold alarm',
    'Normal-thermal-behaviour model (steady-state vs abnormal)',
    'Time-to-trip projection for advance warning',
    'Staged alerts and protective triggers',
    'Thermal-history logging for root-cause (overload/cooling/fault)',
    'Contact or non-contact temperature sensing',
    'Complements built-in protection and thermal design',
  ],
  applications: [
    { t: 'Production-line motors', d: 'Advance warning before an overheating motor trips and stops the line, allowing controlled intervention.' },
    { t: 'Pumps / fans / compressors', d: 'Detecting cooling or load problems early from abnormal temperature rise.' },
    { t: 'Predictive maintenance', d: 'Recurring overheating flags overload, poor cooling or a developing bearing/electrical fault.' },
    { t: 'Critical drives', d: 'Protecting expensive or hard-to-replace motors with early thermal warning.' },
  ],
  skills: [
    'Contact/non-contact motor temperature sensing and placement',
    'Rate-of-rise computation and simple thermal modelling',
    'Time-to-threshold projection and staged alerting',
    'Thermal-history logging and root-cause interpretation',
    'Protective action and safe integration',
  ],
  prereq: [
    'Rate of rise predicts overheating earlier than absolute temperature — track and act on it.',
    'Sensor placement matters: measure where it represents the motor\'s hot path (frame/bearing/winding area), and know the offset to internal temperature.',
    'This complements, not replaces, the motor\'s built-in thermal protection and proper thermal design.',
    'Non-contact IR needs correct emissivity/aim; contact probes need good thermal coupling.',
  ],

  parts: ['esp32', 'ds18b20', 'mlx90614', 'oled', 'relay1', 'buzzer', 'psu5v'],
  extraParts: [
    { name: 'Motor temperature sensor', spec: 'Contact probe (DS18B20/thermocouple) on frame/bearing, or MLX90614 IR at the winding area', qty: 1, price: 500, note: 'Placement and coupling determine accuracy' },
    { name: 'Ambient temperature sensor', spec: 'For load/ambient-aware thermal modelling', qty: 1, price: 120 },
    { name: 'Protective interface', spec: 'Relay/contactor interface to reduce load or stop the drive on critical', qty: 1, price: 500, note: 'Coordinate with the drive/starter safely' },
    { name: 'Industrial enclosure', spec: 'Heat/vibration-tolerant housing near the motor', qty: 1, price: 350 },
  ],
  cost: '₹2,500 – ₹4,000',
  libs: ['wifi', 'pubsub', 'onewire', 'unified', 'ssd1306', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Motor temp (DS18B20)', devPin: 'DQ', pin: 'GPIO 4', sig: 'Contact temperature' },
      { dev: 'MLX90614 (IR)', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Non-contact winding-area temp' },
      { dev: 'Ambient sensor', devPin: 'DQ/I²C', pin: 'GPIO', sig: 'Ambient for modelling' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Temp/rate/time-to-trip' },
      { dev: 'Protect relay', devPin: 'IN', pin: 'GPIO 26', sig: 'Reduce load / stop (coordinated)' },
      { dev: 'Buzzer', devPin: 'IN', pin: 'GPIO 13', sig: 'Alarm' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Alerts + history' },
    ],
  },
  wiringNotes: [
    'Place the temperature sensor where it best represents the motor\'s hot path — a probe on the frame near the winding/bearing, or an IR sensor aimed at the winding area — and record the offset to the true internal temperature.',
    'Ensure good thermal coupling for contact probes (thermal paste/clamp) and correct emissivity/aim for IR.',
    'Measure ambient too, so the thermal model can distinguish a hot day from a motor problem.',
    'Interface any protective action (load reduction/stop) to the drive/starter safely and in coordination with its own protection.',
    'Keep electronics tolerant of the motor\'s heat and vibration.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Motor temp', sub: 'contact/IR', highlight: true },
      { name: 'Ambient', sub: 'context' },
    ] },
    { label: 'Predict', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'rate + model' },
      { name: 'Time-to-trip', sub: 'projection' },
    ] },
    { label: 'Warn/act', edge: 'right', blocks: [
      { name: 'Staged alerts', sub: 'watch/warn/crit' },
      { name: 'Protect', sub: 'reduce/stop' },
    ] },
    { label: 'Learn', edge: 'none', blocks: [
      { name: 'History', sub: 'recurring cause' },
    ] },
  ] },
  flow: [
    { t: 'Read motor + ambient temp', k: 'start' },
    { t: 'Compute rate of rise', k: 'proc' },
    { t: 'Rate abnormal or projected trip soon?', k: 'dec', yes: 'Warn (time-to-trip); stage', no: 'Update model/log' },
    { t: 'Warn (time-to-trip); stage', k: 'io' },
    { t: 'Update model/log', k: 'proc' },
    { t: 'Critical approaching?', k: 'dec', yes: 'Protective action', no: 'Continue' },
    { t: 'Protective action', k: 'io' },
    { t: 'Continue', k: 'end', back: 'Read motor + ambient temp' },
  ],

  principle: [
    'A motor\'s temperature carries a warning long before its own protection trips, but only if you read it the right way. The naive approach — alarm when the temperature exceeds a threshold — fires when the motor is <i>already</i> too hot, so the line stops as a consequence of the fault, which is exactly the unplanned event you wanted to avoid. The predictive approach reads the temperature\'s <b>rate of rise</b> and its <b>trajectory</b>, because a motor heading for an overheat betrays itself early: it heats faster than normal, or it fails to level off at its usual steady-state, well before it reaches the trip point. Catching the abnormal <i>trend</i> is what buys the time to act.',
    'This works because a healthy motor has a <b>characteristic thermal behaviour</b>. Switched on at a given load and ambient temperature, it warms along an exponential curve toward a stable steady-state temperature (heat generated equals heat dissipated), reaching it in a predictable time with a predictable final value. That normal curve is the reference. A motor that is overloaded generates more heat and climbs toward a higher, possibly unsafe, steady-state; one whose cooling is impaired (blocked vents, failed fan, high ambient) dissipates less and also runs hotter; a developing bearing or electrical fault adds heat abnormally. Each shows up as a <b>deviation from the normal thermal curve</b> — a steeper rise, a higher plateau, a rise that does not settle — which the monitor can detect by comparing the live behaviour to the learned normal, accounting for ambient so a hot day is not mistaken for a fault.',
    'From the rate and the model comes the actionable output: a <b>time-to-trip projection</b>. If the temperature is rising at a certain rate and the trip/limit is a certain distance away, the monitor projects when the limit will be reached — turning "the motor is warming" into "at this rate it will trip in N minutes, act now". That projection drives <b>staged alerts</b>: a gentle watch when behaviour is mildly abnormal, a warning when a trip is projected within a comfortable margin, and a critical alarm (with optional automatic protective action — reduce load, stop the drive in coordination with its own controls) when a trip is imminent. Staging gives operators graduated, timely information rather than a single last-second alarm.',
    'Finally, the <b>thermal history</b> is where longer-term value lives. A single overheat is an event; a <i>pattern</i> of overheating is a diagnosis. Logging temperature, rate and ambient over time reveals whether a motor routinely runs too hot (chronic overload — resize or offload), overheats when cooling degrades (maintenance — clean vents, fix the fan), or shows a slow upward creep in running temperature over weeks (a developing bearing or electrical fault). This turns the monitor from an alarm into a root-cause tool. The design is explicit that it <b>complements</b> the motor\'s built-in thermal protection and proper thermal/electrical design rather than replacing them — the embedded protection remains the last line of defence, and sensor placement and the motor\'s real thermal path bound the accuracy — but as a predictive layer, reading rate-of-rise and trajectory against a normal thermal model, it delivers the thing that keeps a line running: warning of an overheat <i>before</i> it stops the motor, so the intervention is planned and controlled, not forced by failure.',
  ],
  equations: [
    { t: 'Rate of rise (early warning)', eq: 'From successive temperatures T at times t:\n  dT/dt = (T_now − T_prev) / (t_now − t_prev)   [°C/min]\n\nAbnormally high dT/dt, or dT/dt not decaying toward 0 as\nthe motor should approach steady-state, is the early sign\nof a developing overheat — before T is high.' },
    { t: 'Time-to-trip projection', eq: 'With current T, trip limit T_trip and rate dT/dt > 0:\n\n  t_to_trip ≈ (T_trip − T) / (dT/dt)\n\n  warning if t_to_trip < T_warn_margin\n  critical if t_to_trip < T_crit_margin (or T near T_trip)\nProjects WHEN the limit is reached → act in advance.' },
    { t: 'Normal thermal model (deviation)', eq: 'Healthy warm-up: T(t) → T_ss with time constant τ:\n  T(t) = T_amb + ΔT_ss·(1 − e^(−t/τ))\n\nT_ss and τ characterise the motor at a load/ambient.\nDeviation (higher T_ss, steeper rise, no settling) vs the\nlearned normal = overload / poor cooling / developing fault.' },
  ],

  assembly: [
    { h: 'Place the temperature sensor well', p: [
      'Fit a contact probe on the motor frame near the winding/bearing (well coupled), or aim an IR sensor at the winding area with correct emissivity. Record the offset from this reading to the true internal temperature.',
      'Add an ambient sensor so the model can separate a hot environment from a motor problem.',
    ], warn: 'Sensor placement and coupling bound everything. A poorly-placed or badly-coupled sensor mis-reads the motor\'s real thermal state; know your measurement point and its offset.' },
    { h: 'Wire alerting and protection', p: [
      'Connect a display, a buzzer, and a protective relay/interface to reduce load or stop the drive — coordinated with the drive\'s own protection, not fighting it.',
    ] },
    { h: 'Set up modelling and reporting', p: [
      'Configure the normal thermal model/baselines, staged alert thresholds and time-to-trip margins, and Wi-Fi reporting with history logging.',
    ] },
  ],
  steps: [
    { h: 'Compute rate and project time-to-trip', p: [
      'Read motor and ambient temperature, compute the smoothed rate of rise, project the time-to-trip, and stage alerts against the projection and the normal model.',
    ], code: {
      file: 'thermal-predict.ino', lang: 'cpp',
      body: `#define T_TRIP 120.0f        // motor limit (deg C) — set to the motor
#define WARN_MIN 15.0f       // warn if trip projected within 15 min
#define CRIT_MIN 5.0f
float prevT=NAN; uint32_t prevMs=0; float rateS=0;

float rateOfRise(float t, uint32_t now){
  if (isnan(prevT)){ prevT=t; prevMs=now; return 0; }
  float dtMin=(now-prevMs)/60000.0f;
  float r = dtMin>0 ? (t-prevT)/dtMin : 0;
  prevT=t; prevMs=now;
  rateS = 0.7f*rateS + 0.3f*r;               // smooth
  return rateS;
}

const char* stage(float t, float rate){
  if (t >= T_TRIP) return "CRITICAL (at limit)";
  if (rate > 0.1f){                           // only project while rising
    float tToTrip = (T_TRIP - t) / rate;      // minutes
    if (tToTrip < CRIT_MIN) return "CRITICAL (trip imminent)";
    if (tToTrip < WARN_MIN) return "WARNING (trip approaching)";
  }
  if (rate > NORMAL_RATE_MAX) return "WATCH (rising fast)";
  return nullptr;
}`,
      explain: [
        { ref: 'rateS = 0.7f*rateS + 0.3f*r', txt: 'The rate of rise is lightly smoothed so a noisy reading does not produce a wild projection while still tracking a real climb.' },
        { ref: 'float tToTrip = (T_TRIP - t) / rate', txt: 'Projects how many minutes until the motor reaches its limit at the current rate — the advance-warning number an operator can act on.' },
        { ref: 'if (tToTrip < WARN_MIN) return "WARNING (trip approaching)"', txt: 'Staged alerts fire on the projection, not just the current temperature, so the warning comes before the motor is dangerously hot.' },
        { ref: 'if (rate > NORMAL_RATE_MAX) return "WATCH (rising fast)"', txt: 'An abnormally fast rise is flagged even before a trip is projected, catching a developing problem at the earliest sign.' },
      ],
    } },
    { h: 'Act, log and diagnose', p: [
      'Sound alerts, take protective action on critical (coordinated with the drive), and log temperature/rate/ambient over time so recurring overheating and its cause become visible.',
    ], tip: 'Log every overheat episode with load/ambient context; a pattern (always at high load, or when the fan is dirty) points straight at the root cause.' },
  ],

  code: [{
    file: 'predictive-motor-temp.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Predictive Motor Temperature — ESP32

   Monitors motor temperature and its RATE OF RISE against a normal
   thermal model, projects time-to-trip, and stages alerts/protection
   BEFORE an overheat trips the line. Logs history for root-cause.
   Complements the motor's own thermal protection.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Preferences.h>
#include <math.h>

#define OW_MOTOR 4
#define OW_AMB   5
#define PIN_RELAY 26
#define PIN_BUZZER 13
#define T_TRIP   120.0f
#define WARN_MIN 15.0f
#define CRIT_MIN 5.0f
#define NORMAL_RATE_MAX 3.0f    // deg C/min considered normal warm-up

OneWire owM(OW_MOTOR), owA(OW_AMB);
DallasTemperature motorT(&owM), ambT(&owA);
Preferences prefs;
WiFiClient net; PubSubClient mqtt(net);
float prevT=NAN, rateS=0; uint32_t prevMs=0;

float rateOfRise(float t, uint32_t now){
  if (isnan(prevT)){ prevT=t; prevMs=now; return 0; }
  float dtMin=(now-prevMs)/60000.0f;
  float r = dtMin>0 ? (t-prevT)/dtMin : 0;
  prevT=t; prevMs=now;
  rateS = 0.7f*rateS + 0.3f*r; return rateS;
}

const char* stage(float t, float rate, float &tToTrip){
  tToTrip = -1;
  if (t >= T_TRIP) return "CRITICAL_LIMIT";
  if (rate > 0.1f){
    tToTrip = (T_TRIP - t) / rate;
    if (tToTrip < CRIT_MIN) return "CRITICAL_IMMINENT";
    if (tToTrip < WARN_MIN) return "WARNING";
  }
  if (rate > NORMAL_RATE_MAX) return "WATCH";
  return "OK";
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_RELAY, OUTPUT); pinMode(PIN_BUZZER, OUTPUT);
  motorT.begin(); ambT.begin();
  WiFi.begin(WIFI_SSID, WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("mtemp-1");
  mqtt.loop();
  uint32_t now = millis();

  motorT.requestTemperatures(); ambT.requestTemperatures();
  float t   = motorT.getTempCByIndex(0);
  float amb = ambT.getTempCByIndex(0);
  float rate = rateOfRise(t, now);

  float tToTrip; const char *st = stage(t, rate, tToTrip);

  bool critical = (strncmp(st,"CRITICAL",8)==0);
  digitalWrite(PIN_BUZZER, (critical || strcmp(st,"WARNING")==0) ? HIGH:LOW);
  if (critical) {
    digitalWrite(PIN_RELAY, HIGH);            // protective action (coordinated)
    mqtt.publish("motor/1/protect", "reduce/stop");
  } else digitalWrite(PIN_RELAY, LOW);

  char m[200];
  snprintf(m,sizeof m,
    "{\\"t\\":%.1f,\\"amb\\":%.1f,\\"rate\\":%.2f,\\"t2trip_min\\":%.1f,"
    "\\"stage\\":\\"%s\\"}", t, amb, rate, tToTrip, st);
  mqtt.publish("motor/1/thermal", m);          // live + history

  delay(2000);
}`,
    explain: [
      { ref: 'float rate = rateOfRise(t, now)', txt: 'The smoothed rate of rise is computed every cycle, the signal that gives warning before the absolute temperature is dangerous.' },
      { ref: 'tToTrip = (T_TRIP - t) / rate', txt: 'A live projection of minutes-to-trip turns the temperature trend into an actionable countdown for operators.' },
      { ref: 'const char *st = stage(t, rate, tToTrip)', txt: 'Alerts are staged from OK through WATCH/WARNING to CRITICAL based on the projection and abnormal rate, giving graduated advance warning.' },
      { ref: 'if (critical) {\n    digitalWrite(PIN_RELAY, HIGH);            // protective action (coordinated)', txt: 'On a critical projection the monitor can take protective action — reduce load or stop the drive in coordination with its own controls — before the motor\'s own protection trips.' },
      { ref: 'mqtt.publish("motor/1/thermal", m);          // live + history', txt: 'Every reading with its rate, ambient and stage is logged, building the thermal history that reveals recurring overheating and its cause.' },
    ],
  }],

  config: [
    'Set T_TRIP to the motor\'s limit and the warn/critical time margins.',
    'Set NORMAL_RATE_MAX and the normal thermal model/baseline for the motor at its duty.',
    'Configure the sensor placement offset and the ambient sensor.',
    'Configure protective action (coordinated with the drive) and reporting/history logging.',
  ],
  calibration: [
    { h: 'Sensor offset', p: [
      'Determine the offset from the measured point to the true internal/winding temperature (from the motor\'s thermal data or a reference), and apply it.',
    ] },
    { h: 'Normal thermal curve', p: [
      'Record the motor\'s normal warm-up and steady-state at typical loads/ambient to establish the reference the model compares against.',
    ] },
    { h: 'Thresholds', p: [
      'Set the rate and time-to-trip thresholds so warnings arrive with useful lead time without nuisance alarms during normal warm-up.',
    ] },
  ],
  testing: [
    { step: 'Normal warm-up', expect: 'Rate decays as it approaches steady-state; no false alarm' },
    { step: 'Overload the motor (safely)', expect: 'Faster rise / higher plateau; WATCH/WARNING with time-to-trip' },
    { step: 'Impair cooling (e.g. block vents briefly)', expect: 'Abnormal rise flagged before the trip point' },
    { step: 'Approach the trip limit', expect: 'CRITICAL and protective action before the motor\'s own trip' },
    { step: 'Hot ambient day', expect: 'Model accounts for ambient; not mistaken for a fault' },
    { step: 'Review history', expect: 'Recurring overheating and its context are visible' },
  ],
  output: [
    'The display/dashboard shows motor temperature, rate of rise, projected time-to-trip and the alert stage; history reveals recurring overheating.',
    { file: 'motor-thermal.json', lang: 'json', body: `{
  "t": 98.4,
  "amb": 34.0,
  "rate": 4.8,
  "t2trip_min": 4.5,
  "stage": "CRITICAL_IMMINENT"
}` },
    'At 98 °C rising 4.8 °C/min, the monitor projects the 120 °C limit in ~4.5 minutes and raises a critical alert (and protective action) — warning issued before the motor\'s own protection would have tripped the line.',
  ],
  troubleshoot: [
    { sym: 'Warns too late', cause: 'Threshold-only, not rate-based', fix: 'Use rate of rise and time-to-trip projection for advance warning' },
    { sym: 'Nuisance alarms on normal warm-up', cause: 'Rate threshold too low / no model', fix: 'Learn the normal thermal curve; set NORMAL_RATE_MAX above normal warm-up' },
    { sym: 'Reading does not match motor state', cause: 'Poor placement/coupling or wrong offset', fix: 'Improve coupling/aim; apply the correct offset to internal temperature' },
    { sym: 'Hot day triggers alarms', cause: 'No ambient context', fix: 'Include ambient in the model so environment is not mistaken for a fault' },
    { sym: 'Protective action conflicts with drive', cause: 'Uncoordinated action', fix: 'Coordinate with the drive\'s own protection; complement, do not fight it' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → maintenance/SCADA',
    net: {
      nodes: [{ name: 'Motor monitor', sub: 'ESP32' }, { name: 'Other motors', sub: 'per-motor' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to MQTT',
      uplink: 'MQTT 1883', cloud: 'Maintenance/SCADA', cloudSub: 'thermal + history',
      clients: [{ name: 'Dashboard', sub: 'temp/rate/t2trip' }, { name: 'Ops', sub: 'staged alerts' }],
    },
    protocol: ['Thermal readings, rate and projected time-to-trip publish continuously; staged alerts and protective actions publish immediately, and history is logged for root-cause.'],
    topics: [
      { t: 'motor/1/thermal', dir: 'node → dashboard', payload: 'temp, ambient, rate, time-to-trip, stage' },
      { t: 'motor/1/protect', dir: 'node → drive/ops', payload: 'protective action (reduce/stop)' },
      { t: 'motor/1/status', dir: 'node → ops', payload: 'sensor/link health' },
    ],
    cloud: ['A maintenance/SCADA dashboard trends motor temperature, rate and time-to-trip, raises staged alerts, and keeps thermal history so recurring overheating and its causes are diagnosable.'],
    dashboard: ['Per-motor temperature and rate-of-rise trends, projected time-to-trip, alert stage, and overheating-episode history with load/ambient context.'],
    mobile: ['Staged alerts (watch/warning/critical) with projected time-to-trip.'],
    security: [
      'Authenticate nodes; coordinate any protective action with the drive\'s own safety systems.',
      'Keep the motor\'s built-in protection as the last line of defence, independent of this monitor.',
      'Alert on sensor/link silence.',
    ],
  },

  perf: [
    'Sample every second or two — thermal changes are not fast — and smooth the rate for stable projections.',
    'Model normal behaviour and use ambient context to avoid nuisance alarms.',
    'Log history for root-cause without flooding the network.',
    'Keep protective action coordinated with, and secondary to, the drive\'s own protection.',
  ],
  safety: [
    'This complements, and does not replace, the motor\'s built-in thermal protection and proper thermal/electrical design.',
    'Coordinate any protective action with the drive/starter\'s own controls; do not create conflicting or unsafe behaviour.',
    'Sensor placement and coupling bound accuracy — measure the real hot path and apply the correct offset.',
    'Work on motors safely (lockout/tagout) and keep electronics rated for the heat/vibration environment.',
  ],
  maintenance: [
    'Re-verify sensor placement/coupling and offset after any remounting.',
    'Update the normal thermal model after motor/load/cooling changes.',
    'Act on recurring overheating (clean cooling, resize load, investigate faults).',
    'Test the alert stages and protective action periodically.',
  ],
  future: [
    'Add motor current alongside temperature for a fuller thermal/electrical picture.',
    'Fit a proper thermal model (winding time-constant) for more accurate projection.',
    'Correlate with vibration for combined predictive maintenance.',
    'Integrate protective action with the VFD for graceful load reduction.',
  ],
  faq: [
    { q: 'Why watch the rate of rise, not just the temperature?', a: 'Because a temperature threshold alarms when the motor is already too hot — the line stops as a result. The rate of rise (and the trajectory) shows a developing overheat earlier, giving time to act before the trip.' },
    { q: 'How does it warn before overheating?', a: 'It projects the time-to-trip from the current temperature and rate: "at this rate the limit is reached in N minutes". That advance countdown lets you reduce load, fix cooling or stop the line on purpose.' },
    { q: 'Does it replace the motor\'s thermal protection?', a: 'No — it complements it. The built-in protection remains the last line of defence; this adds an earlier, predictive warning layer so the trip is avoided in the first place.' },
    { q: 'Why measure ambient temperature?', a: 'So the model can tell a hot environment from a motor problem. A rise driven by a hot day is normal; the same rise on a cool day may signal overload or failing cooling.' },
    { q: 'What does the history tell me?', a: 'Patterns. A motor that always overheats at high load points to chronic overload; one that overheats when the fan is dirty points to cooling maintenance; a slow creep over weeks points to a developing fault.' },
  ],
  refs: [
    { t: 'Electric motor thermal protection', u: 'https://en.wikipedia.org/wiki/Motor_protection', s: 'Reference' },
    { t: 'Thermal time constant and heating curves', u: 'https://en.wikipedia.org/wiki/Thermal_time_constant', s: 'Reference' },
    { t: 'Insulation classes and motor temperature limits', u: 'https://en.wikipedia.org/wiki/Insulation_system', s: 'Reference' },
    { t: 'MLX90614 non-contact IR thermometer (datasheet)', u: 'https://www.melexis.com/en/product/mlx90614', s: 'Melexis' },
    { t: 'Predictive maintenance / condition monitoring', u: 'https://en.wikipedia.org/wiki/Condition_monitoring', s: 'Reference' },
  ],
  images: ['motor', 'esp32', 'factory'],
  imageCaptions: [
    'A temperature sensor on a motor reads the heat that predicts an overheating shutdown.',
    'ESP32 module computing the rate of rise and projecting time-to-trip for advance warning.',
    'Staged alerts and thermal history turn overheating from an unplanned trip into a controlled, diagnosable event.',
  ],
},

];
