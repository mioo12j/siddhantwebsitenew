/* Energy batch A — 069 Solar Rooftop Monitor, 070 Smart Energy Meter,
   071 EV Charging Controller. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   069 — Solar Rooftop Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '069',
  domainKey: 'iot',
  emoji: '☀️', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Tracks what a rooftop solar array actually generates against what it should — catching the underperformance from shading, soiling and faults that quietly steals a big share of your energy.',

  overview: [
    'A rooftop solar array is a silent investment: it sits on the roof, generates power, and — unless you are watching closely — you have no idea whether it is producing what it should. And often it is not. Panels get shaded by a new tree or a chimney, dust and bird droppings build up and cut output, a string develops a fault, an inverter derates, a bypass diode fails — and because the system keeps producing <i>something</i>, these losses are invisible. Studies repeatedly find real-world arrays running well below their potential for exactly these reasons. This project builds a monitor that catches that lost generation by comparing what the array actually produces against what it should, given the sun available.',
    'The key idea is <b>expectation, not just measurement</b>. Measuring generation alone tells you the array made 18 kWh today — but was that good or bad? The monitor measures generation (per string where possible, using current/voltage sensors) <i>and</i> the available sunlight (irradiance) and panel temperature, so it can compute the <b>performance ratio</b> — actual output versus the output the array should have produced under those conditions. A performance ratio that is healthy means the array is fine; one that is low, or falling over time, means energy is being lost, and the monitor can often say why: a sudden drop points to a fault, a gradual decline to soiling, a daily shadow pattern to shading, one string lagging its neighbours to a string-level problem.',
    'Per-string (or per-panel) monitoring is what turns "the array is underperforming" into "string 2 is the problem", because comparing strings that should behave identically instantly localises a fault or a shadow. The monitor logs and trends everything, alerts on abnormal underperformance, and quantifies the lost energy (and money) so a cleaning or a repair can be justified and its benefit verified. It is honest that accurate performance-ratio needs a decent irradiance/temperature reference and that string comparison is the most practical fault signal for a DIY build. But as a monitor that measures generation against expectation, it converts a silent, opaque investment into one you can actually manage — catching the shading, soiling and faults that would otherwise quietly erode your returns for years.',
  ],
  does: [
    'Measures solar generation (per string where possible) via current/voltage',
    'Measures irradiance and panel temperature to compute expected output',
    'Computes performance ratio — actual vs expected generation',
    'Detects underperformance from shading, soiling, faults and derating',
    'Localises faults by comparing strings that should behave identically',
    'Trends generation and quantifies lost energy/money',
    'Alerts on abnormal underperformance and verifies fixes/cleaning',
  ],
  features: [
    'Performance ratio (generation vs expectation), not just kWh',
    'Per-string comparison to localise faults/shading',
    'Irradiance + temperature reference for true expectation',
    'Soiling/shading/fault discrimination from the pattern',
    'Lost-energy quantification and cleaning/repair verification',
    'Trending and abnormal-underperformance alerts',
    'Honest about reference-sensor needs',
  ],
  applications: [
    { t: 'Home rooftop solar', d: 'Knowing your array performs as it should, and catching shading/soiling/faults that steal generation.' },
    { t: 'Commercial / C&I solar', d: 'Per-string performance monitoring and fault localisation across larger arrays.' },
    { t: 'O&M / cleaning optimisation', d: 'Quantifying soiling loss to schedule cleaning when it pays, and verifying it worked.' },
    { t: 'Solar fault diagnosis', d: 'Detecting and localising underperforming strings, failed diodes and derating.' },
  ],
  skills: [
    'DC current/voltage measurement per string',
    'Irradiance and panel-temperature sensing',
    'Performance-ratio and expected-output computation',
    'String comparison for fault localisation',
    'Trending, lost-energy quantification and alerting',
  ],
  prereq: [
    'Measure against expectation (irradiance + temperature), not just kWh — otherwise you cannot tell good from bad output.',
    'Per-string comparison is the most practical fault/shading localiser; strings that should match but don\'t reveal the problem.',
    'DC-side measurement on a live PV system is hazardous — PV voltages are dangerous even in sun; follow electrical safety / use a qualified installer.',
    'A decent irradiance/temperature reference is needed for accurate performance ratio.',
  ],

  parts: ['esp32', 'ina219', 'acs712', 'ds18b20', 'bh1750', 'oled', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Per-string DC current/voltage sensing', spec: 'Hall/shunt current + voltage divider per string (isolated, rated for PV voltage)', qty: 2, price: 1200, note: 'PV DC voltages are high and dangerous — use rated, isolated sensing' },
    { name: 'Irradiance reference', spec: 'A reference cell or a calibrated pyranometer/PV reference for expected output', qty: 1, price: 1500, note: 'A matched reference cell is practical and cheap' },
    { name: 'Panel temperature sensor', spec: 'Back-of-panel temperature sensor (temperature derates output)', qty: 1, price: 150 },
    { name: 'Isolation / safety interface', spec: 'Isolated sensing and enclosure appropriate to PV DC', qty: 1, price: 600 },
  ],
  cost: '₹4,000 – ₹7,000',
  libs: ['wifi', 'pubsub', 'ina219lib', 'onewire', 'bh1750lib', 'ssd1306', 'influx', 'grafana'],

  pins: {
    left: [
      { dev: 'INA219 / shunt (string)', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'String current/voltage (I²C)' },
      { dev: 'Irradiance ref', devPin: 'AOUT/I²C', pin: 'GPIO 34 / I²C', sig: 'Available sunlight' },
      { dev: 'Panel temp (DS18B20)', devPin: 'DQ', pin: 'GPIO 4', sig: 'Back-of-panel temperature' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Generation / PR' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard' },
      { dev: 'microSD', devPin: 'SPI', pin: 'shared + CS', sig: 'Log/trend' },
      { dev: 'Isolated supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power (isolated from PV DC)' },
    ],
  },
  wiringNotes: [
    'PV DC voltages are high and dangerous even in sunlight — use isolated, appropriately-rated sensing and have a qualified installer do or verify the DC-side connections.',
    'Sense current and voltage per string so strings can be compared to localise faults/shading.',
    'Place the irradiance reference in the same plane/orientation as the panels so "expected" reflects the sun the array actually sees.',
    'Fit a back-of-panel temperature sensor; panel output derates as temperature rises, so temperature is needed for a true expectation.',
    'Keep the low-voltage electronics isolated from the PV DC side.',
  ],

  block: { columns: [
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'Per-string I/V', sub: 'generation', highlight: true },
      { name: 'Irradiance', sub: 'available sun' },
      { name: 'Panel temp', sub: 'derating' },
    ] },
    { label: 'Expect', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'expected output' },
      { name: 'Perf ratio', sub: 'actual/expected' },
    ] },
    { label: 'Diagnose', edge: 'right', blocks: [
      { name: 'String compare', sub: 'localise fault' },
      { name: 'Soil/shade/fault', sub: 'pattern' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'PR trend' },
      { name: 'Lost energy', sub: 'clean/fix' },
    ] },
  ] },
  flow: [
    { t: 'Read per-string I/V, irradiance, temp', k: 'start' },
    { t: 'Compute expected output + PR', k: 'proc' },
    { t: 'PR low or a string lagging?', k: 'dec', yes: 'Diagnose (shade/soil/fault); alert', no: 'Trend' },
    { t: 'Diagnose (shade/soil/fault); alert', k: 'io' },
    { t: 'Trend', k: 'proc' },
    { t: 'Quantify lost energy; report', k: 'end', back: 'Read per-string I/V, irradiance, temp' },
  ],

  principle: [
    'The core insight is that <b>generation only has meaning against expectation</b>. An array that made 18 kWh today is impossible to judge without knowing how much sun there was — 18 kWh on a bright day may be poor, on a cloudy day excellent. So the monitor measures not just output but the <b>conditions</b> that determine what output <i>should</i> be: the available <b>irradiance</b> (via a reference cell or pyranometer in the panels\' plane) and the <b>panel temperature</b> (because PV output derates as cells heat up — a hot panel produces measurably less than a cool one at the same irradiance). From these it computes the <b>performance ratio</b>: actual generation divided by the generation the array should have produced under the measured sun and temperature. Performance ratio is the single number that tells you whether the array is healthy, independent of the weather.',
    'A low or falling performance ratio is the signal that <b>energy is being lost</b>, and the <i>pattern</i> of the loss often reveals the cause. A <b>sudden</b> drop points to a fault — a tripped string, a failed inverter, a blown fuse or bypass diode. A <b>gradual</b> decline over weeks with no rain points to <b>soiling</b> — dust, pollen and droppings accumulating on the glass — which a good rain or a clean reverses (and the monitor can prove the reversal). A loss that recurs at the <b>same time each day</b> and grows with the seasons points to <b>shading</b> from a fixed obstruction whose shadow tracks the sun. And a <b>persistent</b> shortfall may be inverter derating or module degradation. Reading the shape of the underperformance turns "something is wrong" into a likely diagnosis.',
    'The most powerful and practical diagnostic for a DIY build is <b>per-string comparison</b>. Strings of panels wired identically, in the same plane, under the same sun, should generate nearly identically — so when one string lags its neighbours, the problem is almost certainly in that string: a shadow falling on it, a fault, a failed diode, or heavier soiling. This <b>differential</b> approach is beautifully robust because it cancels out the weather entirely — you are not comparing to a model but to an identical sibling under identical conditions, so any divergence is real and <b>localised</b>. "The array is down 15%" becomes "string 2 is producing 30% less than string 1", which points a technician straight at the problem.',
    'What makes the monitor pay is <b>quantification and verification</b>. By continuously comparing actual to expected, it can put a number on the <b>lost energy</b> — and its money value — from soiling or a fault, which is what justifies the cost of a cleaning or a repair (soiling losses often exceed cleaning costs, but only measurement tells you when). And the same measurement <b>verifies</b> the fix: clean the panels and the performance ratio jumps back up by the quantified amount, proving the cleaning paid for itself; repair a string and its output rejoins its neighbours. The design is honest about its needs — a genuinely accurate performance ratio depends on a decent irradiance and temperature reference, and DC-side sensing on a live PV system is hazardous and best left to qualified work — but within that, it transforms rooftop solar from a silent black box into a managed asset, catching the shading, soiling and faults that would otherwise quietly bleed away a meaningful fraction of the generation you paid for.',
  ],
  equations: [
    { t: 'Performance ratio', eq: 'PR = actual energy / expected energy\n\nexpected ≈ (irradiance / STC_irradiance) · P_rated · η_temp\n  η_temp = 1 + γ·(T_cell − 25°C)   (γ ≈ −0.4%/°C, negative)\n\nPR near its healthy value = fine; low/falling PR = losses.\nPR cancels weather, so it is comparable day to day.' },
    { t: 'Per-string comparison (differential)', eq: 'Identical strings under identical conditions should match:\n\n  ratio_i = P_string_i / mean(P_other_strings)\n\n  fault/shade on string i if ratio_i << 1 (sustained)\nCancels weather entirely → any divergence is real & localised.' },
    { t: 'Lost energy / soiling', eq: 'Loss vs expectation over a period:\n\n  lost_kWh = Σ (expected − actual)\n  lost_cost = lost_kWh · tariff (or feed-in rate)\n\nGradual PR decline (no rain) → soiling; step → fault.\nClean/repair → PR recovers by the quantified amount (verify).' },
  ],

  assembly: [
    { h: 'Install per-string sensing safely', p: [
      'Fit isolated, appropriately-rated current and voltage sensing on each string so strings can be compared. Have a qualified installer do or verify the PV DC-side work.',
    ], warn: 'PV arrays produce dangerous DC voltage whenever there is light — you cannot simply "switch it off". DC-side sensing must be isolated, rated and ideally installed by a qualified person.' },
    { h: 'Add irradiance and temperature reference', p: [
      'Mount an irradiance reference (reference cell/pyranometer) in the panels\' plane and a back-of-panel temperature sensor, so expected output reflects the real sun and cell temperature.',
    ] },
    { h: 'Set up computation and reporting', p: [
      'Compute expected output, performance ratio and per-string ratios; log and trend; and set up the dashboard and alerts.',
    ] },
  ],
  steps: [
    { h: 'Compute expected output, PR and string ratios', p: [
      'From irradiance and temperature compute expected output, divide actual by expected for PR, and compare strings to localise problems.',
    ], code: {
      file: 'solar-performance.ino', lang: 'cpp',
      body: `#define P_RATED_W  3000.0f      // array/string rated power (STC)
#define STC_IRR    1000.0f      // W/m2 at STC
#define GAMMA     -0.004f       // -0.4%/degC temperature coefficient

float expectedPower(float irr, float tCell){
  float etaTemp = 1.0f + GAMMA*(tCell - 25.0f);
  return (irr/STC_IRR) * P_RATED_W * etaTemp;
}

float performanceRatio(float actualW, float irr, float tCell){
  float exp = expectedPower(irr, tCell);
  return exp>1 ? actualW/exp : 0;
}

// Compare each string to the mean of the others (weather cancels out).
int laggingString(float *p, int n){
  for (int i=0;i<n;i++){
    float sum=0; int c=0;
    for(int j=0;j<n;j++) if(j!=i){ sum+=p[j]; c++; }
    float others = c? sum/c : 0;
    if (others>1 && p[i] < 0.7f*others) return i;   // 30% below siblings
  }
  return -1;
}`,
      explain: [
        { ref: 'float etaTemp = 1.0f + GAMMA*(tCell - 25.0f)', txt: 'Applies the negative temperature coefficient so the expected output accounts for a hot panel producing less — without this, a fine array on a hot day looks like it is underperforming.' },
        { ref: 'return exp>1 ? actualW/exp : 0', txt: 'Performance ratio is actual over expected, the weather-independent number that says whether the array is healthy.' },
        { ref: 'int laggingString(float *p, int n)', txt: 'Compares each string to the mean of the others; because they share the same weather, a string 30% below its siblings is a localised fault or shadow, not a cloudy patch.' },
      ],
    } },
    { h: 'Diagnose, quantify and verify', p: [
      'Classify underperformance by its pattern (sudden fault, gradual soiling, daily shading), quantify lost energy/money, alert, and verify that cleaning/repairs restore performance ratio.',
    ], tip: 'Track PR over weeks: a slow decline with no rain is soiling — clean and confirm PR jumps back; a step down is a fault to investigate now.' },
  ],

  code: [{
    file: 'solar-rooftop-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Solar Rooftop Monitor — ESP32

   Measures per-string generation against expected output (from
   irradiance + panel temperature), computes performance ratio,
   localises faults/shading by string comparison, and quantifies lost
   energy. DC-side sensing must be isolated/rated (safety).
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_INA219.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <BH1750.h>

#define NSTR 2
#define P_RATED_W 3000.0f
#define STC_IRR 1000.0f
#define GAMMA -0.004f

Adafruit_INA219 ina[NSTR];        // per-string (distinct I2C addr)
OneWire ow(4); DallasTemperature panelT(&ow);
BH1750 lux;                        // stand-in for irradiance ref (scaled)
WiFiClient net; PubSubClient mqtt(net);
float lostWh=0; uint32_t lastMs=0;

float expectedPower(float irr,float tCell){
  return (irr/STC_IRR)*P_RATED_W*(1.0f+GAMMA*(tCell-25.0f));
}

void setup(){
  Serial.begin(115200);
  Wire.begin(21,22);
  for(int i=0;i<NSTR;i++) ina[i].begin();     // addresses set per module
  panelT.begin(); lux.begin();
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  lastMs=millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("solar-1");
  mqtt.loop();
  uint32_t now=millis(); float dtHr=(now-lastMs)/3600000.0f; lastMs=now;

  panelT.requestTemperatures();
  float tCell = panelT.getTempCByIndex(0);
  float irr   = lux.readLightLevel() * IRR_SCALE;   // → W/m2 (calibrated ref)

  float p[NSTR], total=0;
  for(int i=0;i<NSTR;i++){
    float v = ina[i].getBusVoltage_V();
    float i_a = ina[i].getCurrent_mA()/1000.0f;
    p[i] = v*i_a; total += p[i];
  }

  float expected = expectedPower(irr, tCell);
  float pr = expected>1 ? total/expected : 0;
  lostWh += fmaxf(0, expected-total) * dtHr;         // accumulate lost energy

  // per-string comparison
  int lag = -1;
  for(int i=0;i<NSTR && lag<0;i++){
    float others=0; int c=0;
    for(int j=0;j<NSTR;j++) if(j!=i){ others+=p[j]; c++; }
    if(c && others/c>1 && p[i] < 0.7f*(others/c)) lag=i;
  }

  const char* diag = nullptr;
  if (lag>=0) diag = "string lagging (fault/shade)";
  else if (pr < 0.7f && irr>200) diag = "array underperforming";

  char m[240];
  snprintf(m,sizeof m,
    "{\\"total_W\\":%.0f,\\"pr\\":%.2f,\\"irr\\":%.0f,\\"tCell\\":%.1f,"
    "\\"lag\\":%d,\\"lost_Wh\\":%.0f,\\"diag\\":\\"%s\\"}",
    total, pr, irr, tCell, lag, lostWh, diag?diag:"ok");
  mqtt.publish("solar/1/perf", m);
  if (diag) mqtt.publish("solar/1/alert", diag);

  delay(10000);                                      // 0.1 Hz
}`,
    explain: [
      { ref: 'float expected = expectedPower(irr, tCell)', txt: 'Expected output is computed from the measured sun and panel temperature, giving the benchmark that turns raw generation into a judgeable performance ratio.' },
      { ref: 'float pr = expected>1 ? total/expected : 0', txt: 'Performance ratio is the health number — near its healthy value the array is fine; low means energy is being lost.' },
      { ref: 'lostWh += fmaxf(0, expected-total) * dtHr', txt: 'The shortfall against expectation is accumulated as lost energy, which the dashboard turns into money to justify cleaning or repair.' },
      { ref: 'if(c && others/c>1 && p[i] < 0.7f*(others/c)) lag=i', txt: 'Per-string comparison flags a string well below its siblings — a localised fault or shadow, identified without any weather model.' },
      { ref: 'else if (pr < 0.7f && irr>200) diag = "array underperforming"', txt: 'A low performance ratio in decent sun flags whole-array underperformance (soiling, derating), distinct from a single-string problem.' },
    ],
  }],

  config: [
    'Set the rated power, temperature coefficient, and irradiance-reference calibration.',
    'Configure per-string sensing and the lagging-string threshold.',
    'Set underperformance/alert thresholds and the tariff for lost-energy costing.',
    'Configure logging/trending and the dashboard.',
  ],
  calibration: [
    { h: 'Irradiance reference', p: [
      'Calibrate the irradiance sensor/reference cell against a known reference in the panels\' plane so expected output is accurate.',
    ] },
    { h: 'Per-string sensing', p: [
      'Verify current/voltage per string against a reference and confirm identical strings read alike in clear sun.',
    ] },
    { h: 'Baseline PR', p: [
      'Establish the array\'s healthy performance ratio on clean, clear days as the reference for detecting decline.',
    ] },
  ],
  testing: [
    { step: 'Clear day, clean panels', expect: 'Performance ratio at its healthy value; strings match' },
    { step: 'Shade one string', expect: 'That string lags; lagging-string diagnosis' },
    { step: 'Soil the array over time (or simulate)', expect: 'PR gradually declines with no rain — soiling signature' },
    { step: 'Clean and re-measure', expect: 'PR jumps back; recovered energy quantified' },
    { step: 'Simulate a string fault', expect: 'Sudden drop; string localised' },
    { step: 'Hot day', expect: 'Temperature correction keeps PR fair (not a false underperformance)' },
  ],
  output: [
    'The dashboard shows generation, performance ratio, per-string comparison, irradiance/temperature, and lost-energy/cost, with alerts for underperformance and lagging strings.',
    { file: 'solar-perf.json', lang: 'json', body: `{
  "total_W": 2180,
  "pr": 0.74,
  "irr": 920,
  "tCell": 52.0,
  "lag": 1,
  "lost_Wh": 3400,
  "diag": "string lagging (fault/shade)"
}` },
    'A performance ratio of 0.74 with string 1 lagging points to a localised problem on that string; the accumulated lost energy (3.4 kWh) quantifies what it is costing — turning silent underperformance into an actionable, costed fault.',
  ],
  troubleshoot: [
    { sym: 'Can\'t tell good output from bad', cause: 'No expectation reference', fix: 'Add irradiance + temperature sensing and compute performance ratio' },
    { sym: 'Whole-array PR low on hot days', cause: 'No temperature correction', fix: 'Apply the temperature coefficient with panel temperature' },
    { sym: 'Fault not localised', cause: 'Only whole-array measurement', fix: 'Measure per string and compare; a lagging string localises the fault' },
    { sym: 'Gradual decline mistaken for a fault', cause: 'Not distinguishing soiling from faults', fix: 'Read the pattern — gradual/no-rain = soiling (clean and verify); step = fault' },
    { sym: 'Safety concern on DC side', cause: 'Unrated/non-isolated PV sensing', fix: 'Use isolated, rated sensing; qualified installer for DC-side work' },
  ],

  iot: {
    protoShort: 'Wi-Fi → InfluxDB + Grafana',
    net: {
      nodes: [{ name: 'Solar monitor', sub: 'ESP32' }, { name: 'Strings', sub: 'per-string sensing' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to server',
      uplink: 'HTTP/MQTT', cloud: 'InfluxDB + Grafana', cloudSub: 'PR + generation',
      clients: [{ name: 'Dashboard', sub: 'PR/string trends' }, { name: 'Phone', sub: 'underperf alerts' }],
    },
    protocol: ['Generation, performance ratio, per-string data and lost-energy publish on a slow cadence; underperformance and lagging-string alerts publish on detection.'],
    topics: [
      { t: 'solar/1/perf', dir: 'node → dashboard', payload: 'generation, PR, per-string, irradiance/temp, lost energy' },
      { t: 'solar/1/alert', dir: 'node → owner', payload: 'underperformance / lagging string' },
      { t: 'solar/1/status', dir: 'node → owner', payload: 'sensor/link health' },
    ],
    cloud: ['A dashboard trends performance ratio and per-string generation, quantifies lost energy and cost, and verifies cleaning/repairs; alerts drive O&M.'],
    dashboard: ['Generation and PR trends, per-string comparison, irradiance/temperature, and lost-energy/cost with cleaning/repair markers.'],
    mobile: ['Alerts on abnormal underperformance and lagging strings; cleaning-benefit summaries.'],
    security: [
      'Authenticate nodes; secure the energy data.',
      'Keep DC-side sensing isolated and safe.',
      'Alert on monitor silence.',
    ],
  },

  perf: [
    'Sample at a modest rate; PR and string comparison need conditions, not high speed.',
    'Compute PR with temperature correction for fair comparison across days.',
    'Trend PR and per-string ratios to catch decline and localise faults.',
    'Quantify lost energy so O&M is justified and verified.',
  ],
  safety: [
    'PV arrays produce dangerous DC voltage in any light and cannot simply be switched off — use isolated, rated sensing and qualified installers for DC-side work.',
    'Keep low-voltage electronics isolated from the PV DC side.',
    'Accurate performance ratio needs a decent irradiance/temperature reference; label estimates where the reference is rough.',
    'Follow rooftop and electrical safety for installation and cleaning.',
  ],
  maintenance: [
    'Verify irradiance-reference calibration and per-string sensing periodically.',
    'Act on soiling/fault alerts; clean/repair and confirm PR recovery.',
    'Re-baseline PR after any array change.',
    'Keep DC-side connections inspected and safe.',
  ],
  future: [
    'Add per-panel monitoring for finer localisation.',
    'Add I-V curve tracing for deeper fault diagnosis.',
    'Fuse a weather/forecast feed to predict expected generation.',
    'Estimate degradation rate over years for warranty/finance.',
  ],
  faq: [
    { q: 'Why not just measure how many kWh it makes?', a: 'Because a kWh figure is meaningless without knowing the available sun. Measuring against expectation (irradiance + temperature) gives the performance ratio, which tells you whether the array is healthy regardless of the weather.' },
    { q: 'How does it find which string has a problem?', a: 'By comparing strings that should behave identically. They share the same weather, so a string producing well below its siblings is a localised fault or shadow — no model needed, and the problem is pinpointed.' },
    { q: 'How does it tell soiling from a fault?', a: 'By the pattern. Soiling is a gradual decline over weeks with no rain that a clean reverses; a fault is a sudden step down. Shading recurs at the same time each day. The shape of the loss suggests the cause.' },
    { q: 'Is it safe to install myself?', a: 'PV arrays carry dangerous DC voltage whenever there is light and cannot simply be turned off. DC-side sensing must be isolated and rated, and is best done or verified by a qualified installer.' },
    { q: 'How does it pay for itself?', a: 'By quantifying lost energy. Soiling and faults often cost more than a clean or a repair, but only measurement tells you when — and the same measurement verifies the fix restored the generation.' },
  ],
  refs: [
    { t: 'Photovoltaic performance ratio', u: 'https://en.wikipedia.org/wiki/Performance_ratio', s: 'Reference' },
    { t: 'PV soiling and cleaning', u: 'https://en.wikipedia.org/wiki/Soiling_(photovoltaics)', s: 'Reference' },
    { t: 'PV temperature coefficient', u: 'https://en.wikipedia.org/wiki/Solar_cell', s: 'Reference' },
    { t: 'PV DC safety (arc flash / live arrays)', u: 'https://en.wikipedia.org/wiki/Photovoltaic_system', s: 'Reference' },
    { t: 'Solar monitoring and fault detection', u: 'https://en.wikipedia.org/wiki/Solar_micro-inverter', s: 'Reference' },
  ],
  images: ['solar', 'esp32', 'grafana'],
  imageCaptions: [
    'Rooftop solar measured against expectation, not just kWh, reveals hidden underperformance.',
    'ESP32 module computing performance ratio from generation, irradiance and panel temperature.',
    'Per-string comparison localises faults and shading, and lost-energy figures justify cleaning and repairs.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   070 — Smart Energy Meter
   ══════════════════════════════════════════════════════════════════ */
{
  id: '070',
  domainKey: 'ai',
  emoji: '🔌', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A single whole-home meter that not only shows real-time consumption but disaggregates it into appliance-level insights — telling you what is using power, from one measurement point.',

  overview: [
    'A conventional meter gives you one number: total consumption. It cannot tell you that the geyser is your biggest cost, that a fridge is failing and drawing more each week, or that something is left on overnight. Sub-metering every circuit is expensive and invasive. This project takes a smarter route: a single whole-home meter that measures the total, and then <b>disaggregates</b> that total into appliance-level insights using the technique called <b>non-intrusive load monitoring (NILM)</b> — inferring which appliances are running, and how much each is using, from the aggregate signal at one measurement point.',
    'The foundation is accurate <b>real-time whole-home measurement</b> — real power, energy and power factor from a CT clamp or meter module on the incoming supply. On top of that sits the disaggregation: appliances have characteristic <b>signatures</b> in the aggregate power signal — a heating element switches on as a clean rectangular step of a specific size, a motor draws an inrush spike then settles, an electronic device has its own pattern — so when the total power steps up by ~2 kW in a rectangular fashion, that is very likely the geyser turning on. By detecting these on/off <b>events</b> and matching their signatures to known appliances, the meter attributes the total consumption to individual loads without a sensor on each one.',
    'The result is genuinely useful: real-time and historical consumption, a breakdown of which appliances cost the most, alerts when an appliance behaves abnormally (a fridge cycling too often, a heater left on), and the data to actually reduce a bill. It is honest that NILM is an inference, not a measurement — it works best for larger, distinct loads and struggles to separate several small or similar appliances, and it needs a training/learning phase to recognise a home\'s specific appliances — so its appliance figures are informative estimates, not billing-grade sub-metering. But as a single-point meter that combines accurate whole-home measurement with appliance-level disaggregation, it delivers most of the value of expensive per-circuit sub-metering from one clamp, turning an opaque bill into an itemised, actionable picture of where the energy goes.',
  ],
  does: [
    'Measures accurate real-time whole-home power, energy and power factor',
    'Disaggregates the total into appliance-level usage (NILM)',
    'Detects appliance on/off events by their power signatures',
    'Attributes consumption and cost to individual appliances',
    'Learns a home\'s specific appliances during a training phase',
    'Alerts on abnormal appliance behaviour (failing/left-on)',
    'Turns an opaque bill into an itemised, actionable breakdown',
  ],
  features: [
    'Single-point measurement, appliance-level insight',
    'Event-detection + signature-matching NILM',
    'Real power/energy/PF whole-home base',
    'Per-appliance cost breakdown',
    'Learned per-home appliance models',
    'Abnormal-behaviour alerts',
    'Honest: NILM is inference, not per-appliance metering',
  ],
  applications: [
    { t: 'Home energy awareness', d: 'Seeing which appliances cost the most and where to cut, from one meter.' },
    { t: 'Appliance fault detection', d: 'Catching a failing fridge/pump drawing more, or something left on.' },
    { t: 'Demand/efficiency programmes', d: 'Appliance-level data for efficiency advice and demand response.' },
    { t: 'Elderly / activity awareness', d: 'Inferring appliance usage patterns (with consent) for wellbeing.' },
  ],
  skills: [
    'Whole-home real-power measurement (CT/meter)',
    'Event detection in the aggregate power signal',
    'Appliance signature extraction and matching (NILM)',
    'Learning/training per-home appliance models',
    'Consumption attribution and alerting',
  ],
  prereq: [
    'NILM is an inference from one signal — it works best for larger, distinct loads and cannot perfectly separate small/similar appliances; present appliance figures as estimates.',
    'Accurate whole-home real-power measurement (with power factor) is the foundation — get it right first.',
    'A learning/training phase is needed to recognise a home\'s specific appliances.',
    'Mains measurement is dangerous — use a qualified electrician for the mains-side install.',
  ],

  parts: ['esp32', 'pzem004t', 'acs712', 'zmpt101b', 'oled', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'CT clamp / meter on the main', spec: 'Split-core CT + voltage ref, or a PZEM with CT, on the incoming supply', qty: 1, price: 900, note: 'Whole-home real-power measurement' },
    { name: 'Higher-rate sampling front-end', spec: 'For capturing transients/signatures (fast ADC or a metering IC)', qty: 1, price: 600, note: 'Signature detection benefits from higher-rate data' },
    { name: 'Compute for NILM', spec: 'ESP32 for simple event NILM; a Pi for heavier disaggregation/ML', qty: 1, price: 0, note: 'Match compute to the NILM method' },
    { name: 'DIN enclosure + isolation', spec: 'Safe mains-side enclosure and isolation', qty: 1, price: 700 },
  ],
  cost: '₹3,500 – ₹6,000',
  libs: ['wifi', 'pubsub', 'ssd1306', 'influx', 'python', 'sklearn', 'numpy'],

  pins: {
    left: [
      { dev: 'CT / PZEM', devPin: 'UART/AOUT', pin: 'GPIO 16/17 / ADC', sig: 'Whole-home current/power' },
      { dev: 'Voltage ref', devPin: 'AOUT', pin: 'GPIO 35 (ADC)', sig: 'Mains voltage (real power/PF)' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Live total + breakdown' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard / NILM offload' },
      { dev: 'microSD', devPin: 'SPI', pin: 'shared + CS', sig: 'Log/training data' },
      { dev: 'Isolated supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Measure whole-home real power (and power factor) with a CT + voltage reference or a metering module on the incoming supply; have a qualified electrician do the mains-side install.',
    'Sample fast enough to capture appliance switching transients if using transient signatures; steady-state step detection needs less.',
    'Keep the low-voltage electronics isolated from the mains measurement.',
    'For heavier NILM/ML, offload to a Pi/server; the ESP32 can do simple event-based disaggregation.',
    'Log data during a training phase so appliance signatures can be learned.',
  ],

  block: { columns: [
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'Whole-home', sub: 'real power/PF', highlight: true },
    ] },
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'Events', sub: 'on/off steps' },
      { name: 'Signatures', sub: 'step size/shape' },
    ] },
    { label: 'Disaggregate', edge: 'right', blocks: [
      { name: 'Match', sub: 'appliance models', highlight: true },
      { name: 'Attribute', sub: 'usage + cost' },
    ] },
    { label: 'Insight', edge: 'none', blocks: [
      { name: 'Breakdown', sub: 'per appliance' },
      { name: 'Alerts', sub: 'abnormal/left-on' },
    ] },
  ] },
  flow: [
    { t: 'Measure whole-home power', k: 'start' },
    { t: 'Power step (on/off event)?', k: 'dec', yes: 'Extract signature; match appliance', no: 'Update totals' },
    { t: 'Extract signature; match appliance', k: 'proc' },
    { t: 'Attribute consumption to appliance', k: 'proc' },
    { t: 'Update totals', k: 'proc' },
    { t: 'Abnormal behaviour?', k: 'dec', yes: 'Alert', no: 'Report breakdown' },
    { t: 'Alert', k: 'io' },
    { t: 'Report breakdown', k: 'end', back: 'Measure whole-home power' },
  ],

  principle: [
    'The meter\'s ambition is to give <b>appliance-level insight from a single measurement point</b>, which is valuable because per-appliance sub-metering is expensive and invasive while a single whole-home meter is cheap and non-invasive. The bridge between the two is <b>non-intrusive load monitoring</b> — the idea that the aggregate electrical signal at the meter contains, mixed together, the individual contributions of every running appliance, and that with the right processing you can pull those contributions back apart. It rests on accurate whole-home measurement as its foundation and clever inference as its magic.',
    'The foundation must be solid: <b>accurate real-power measurement</b> of the whole home, including power factor, because everything downstream is inference on top of it. A CT clamp with a voltage reference (or a metering module) on the incoming supply gives real-time total power and energy. This alone is useful — real-time consumption feedback measurably reduces usage — but it is the raw material for the disaggregation.',
    'Disaggregation works because appliances have <b>distinctive signatures</b> in the aggregate signal. When an appliance switches on or off, the total power <b>steps</b>, and the size and shape of that step is characteristic: a resistive heater (geyser, kettle, iron) switches as a clean, rectangular step of a specific magnitude; a motor (fridge compressor, pump) shows a brief inrush spike then settles to a running level; electronic devices have their own patterns; some appliances even cycle in recognisable rhythms. The classic, tractable NILM approach is <b>event-based</b>: detect these on/off events in the power stream, extract each event\'s signature (step magnitude, transient shape, power factor change), and <b>match</b> it to a library of known appliance signatures, thereby attributing that chunk of consumption to that appliance. More advanced NILM uses machine-learning models, but the event-and-signature approach captures the core idea and runs on modest hardware.',
    'The output is an <b>itemised, actionable</b> picture — which appliances cost the most, when they run, and how their behaviour changes — enabling real savings and catching faults (a fridge cycling too often, a heater left on). But the design is <b>honest about NILM\'s nature</b>: it is an <i>inference</i>, not a measurement, and it has real limits. It works best for <b>larger, distinct</b> loads whose signatures stand out, and struggles to separate several <b>small or similar</b> appliances whose events overlap or look alike; it needs a <b>learning/training phase</b> to recognise a specific home\'s appliances, since signatures vary between makes and models; and its attributions are best-estimates, not billing-grade sub-metering. So the meter presents appliance figures as informative estimates, is upfront about uncertainty, and leans on the rock-solid whole-home total for anything that must be exact. Within that frame, it delivers most of the value of expensive per-circuit metering from a single clamp — the genuinely useful trick of turning one aggregate signal into an appliance-by-appliance understanding of where a home\'s energy, and money, goes.',
  ],
  equations: [
    { t: 'Whole-home real power (foundation)', eq: 'P = V_rms · I_rms · cosφ   (real power, W)\nE = ∫ P dt                  (energy, kWh)\n\nAccurate real power + power factor is the base signal NILM\ndisaggregates. Current alone (apparent power) is not enough.' },
    { t: 'Event detection', eq: 'Detect steps in the power stream:\n\n  ΔP = P(t) − P(t−Δ)\n  event if |ΔP| > threshold (sustained)  → appliance on/off\n\nEach event\'s magnitude, sign and transient shape form its\nsignature.' },
    { t: 'Signature matching (NILM)', eq: 'Match an event signature s to appliance models {m}:\n\n  appliance = argmin_m distance(s, signature(m))\n  attribute the step power to that appliance until its OFF event\n\nBest for large/distinct loads; small/similar loads overlap →\nreport as estimates, learn per-home models.' },
  ],

  assembly: [
    { h: 'Install accurate whole-home measurement', p: [
      'Fit a CT + voltage reference (or metering module) on the incoming supply for real power/PF, installed by a qualified electrician, with the electronics isolated from the mains.',
      'Sample fast enough to capture the switching transients your NILM method uses.',
    ], warn: 'Mains measurement is dangerous. The mains-side install must be done or verified by a qualified electrician, with proper isolation.' },
    { h: 'Set up event detection and learning', p: [
      'Detect on/off events in the power stream and log a training period so appliance signatures can be learned (label known appliances by switching them).',
    ] },
    { h: 'Set up disaggregation and reporting', p: [
      'Match events to appliance models, attribute consumption, and report the breakdown and alerts; offload heavier NILM to a Pi/server if needed.',
    ] },
  ],
  steps: [
    { h: 'Detect events and disaggregate', p: [
      'Detect power steps, extract each event\'s signature, match to the appliance library, and attribute consumption until the matching off-event.',
    ], code: {
      file: 'nilm-event.py', lang: 'python',
      body: `# Event-based NILM: detect steps, match signatures, attribute energy.
import numpy as np

class Appliance:
    def __init__(self, name, step_w, pf, tol=0.15):
        self.name, self.step_w, self.pf, self.tol = name, step_w, pf, tol
    def matches(self, dP, pf):
        return abs(dP - self.step_w) < self.tol*self.step_w and abs(pf-self.pf)<0.1

def detect_events(power, pf, thresh=150):
    events = []
    for t in range(1, len(power)):
        dP = power[t] - power[t-1]
        if abs(dP) > thresh:                      # a step = appliance on/off
            events.append((t, dP, pf[t]))
    return events

def disaggregate(events, library):
    active = {}                                    # appliance -> power
    usage  = {a.name: 0.0 for a in library}
    for (t, dP, pf) in events:
        if dP > 0:                                 # turn-on
            for a in library:
                if a.matches(dP, pf): active[a.name] = dP; break
        else:                                      # turn-off
            for name, p in list(active.items()):
                if abs(-dP - p) < 0.2*p: del active[name]; break
    return active, usage`,
      explain: [
        { ref: 'def detect_events(power, pf, thresh=150)', txt: 'Finds steps in the aggregate power — the on/off events of individual appliances that NILM keys on.' },
        { ref: 'def matches(self, dP, pf)', txt: 'An appliance is recognised when a power step matches its characteristic magnitude and power factor, the essence of signature matching.' },
        { ref: 'if dP > 0:                                 # turn-on', txt: 'A positive step is an appliance turning on and is matched to the library; the attributed power runs until its off-event.' },
        { ref: 'if abs(-dP - p) < 0.2*p: del active[name]', txt: 'A negative step near a known active appliance\'s power is that appliance turning off, closing its usage interval.' },
      ],
    } },
    { h: 'Attribute, alert and report', p: [
      'Accumulate per-appliance energy and cost, alert on abnormal behaviour (a fridge cycling too often, a heater left on), and report the breakdown — clearly labelling appliance figures as estimates.',
    ], tip: 'Anchor everything to the exact whole-home total; NILM allocates that total to appliances as estimates, so the sum stays correct even when an appliance guess is off.' },
  ],

  code: [{
    file: 'smart-energy-meter.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Energy Meter — ESP32 (whole-home + event NILM)

   Measures accurate whole-home real power/energy/PF and disaggregates
   into appliance-level usage by detecting on/off power events and
   matching their signatures. Appliance figures are ESTIMATES.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>

#define STEP_THRESH 150.0f    // W step = an appliance event

PZEM004Tv30 pzem(Serial2, 16, 17);
WiFiClient net; PubSubClient mqtt(net);

struct Appliance { const char* name; float stepW; float pf; float energyWh; };
Appliance lib[] = {
  {"Geyser", 2000, 1.00, 0}, {"Fridge", 150, 0.65, 0},
  {"AC", 1200, 0.90, 0}, {"Kettle", 1500, 1.00, 0} };
const int NA = 4;
float prevP = 0; int activeIdx = -1; uint32_t activeSince = 0;

int matchAppliance(float dP, float pf){
  for (int i=0;i<NA;i++)
    if (fabsf(dP - lib[i].stepW) < 0.15f*lib[i].stepW &&
        fabsf(pf - lib[i].pf) < 0.1f) return i;
  return -1;
}

void setup(){
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("meter-1");
  mqtt.loop();

  float p  = pzem.power();          // whole-home REAL power (foundation)
  float e  = pzem.energy();         // whole-home energy (exact)
  float pf = pzem.pf();
  if (isnan(p)) { delay(1000); return; }

  float dP = p - prevP; prevP = p;
  uint32_t now = millis();

  if (dP > STEP_THRESH){                              // an appliance turned on
    int idx = matchAppliance(dP, pf);
    if (idx>=0){ activeIdx=idx; activeSince=now; }
    char m[80]; snprintf(m,sizeof m,"{\\"on\\":\\"%s\\",\\"step\\":%.0f}",
      idx>=0?lib[idx].name:"unknown", dP);
    mqtt.publish("meter/event", m);
  } else if (dP < -STEP_THRESH && activeIdx>=0){       // turned off
    float hrs = (now-activeSince)/3600000.0f;
    lib[activeIdx].energyWh += lib[activeIdx].stepW * hrs;   // attribute (est.)
    activeIdx = -1;
  }

  // whole-home total is exact; appliance breakdown is estimated
  char m[240];
  int n = snprintf(m,sizeof m,"{\\"total_W\\":%.0f,\\"energy_kWh\\":%.3f,\\"appliances\\":{", p, e);
  for(int i=0;i<NA;i++)
    n += snprintf(m+n,sizeof m-n,"\\"%s\\":%.0f%s",
      lib[i].name, lib[i].energyWh, i<NA-1?",":"");
  snprintf(m+n,sizeof m-n,"}}");
  mqtt.publish("meter/1/breakdown", m);

  delay(1000);
}`,
    explain: [
      { ref: 'float p  = pzem.power();          // whole-home REAL power (foundation)', txt: 'The exact whole-home real power and energy are the trustworthy foundation; NILM only allocates this total to appliances.' },
      { ref: 'if (dP > STEP_THRESH){', txt: 'A power step above the threshold is an appliance on-event, the trigger for signature matching.' },
      { ref: 'int matchAppliance(float dP, float pf)', txt: 'Matches the step\'s magnitude and power factor to the appliance library — the disaggregation, best for large distinct loads.' },
      { ref: 'lib[activeIdx].energyWh += lib[activeIdx].stepW * hrs;   // attribute (est.)', txt: 'Energy is attributed to the appliance for the interval it was on, explicitly as an estimate.' },
      { ref: '// whole-home total is exact; appliance breakdown is estimated', txt: 'The design keeps the exact total authoritative and presents the appliance split as informative estimates — honest about NILM\'s nature.' },
    ],
  }],

  config: [
    'Configure whole-home real-power measurement and the event-detection threshold.',
    'Build/learn the appliance library (signatures) during a training phase for the specific home.',
    'Set tariff for cost attribution and abnormal-behaviour alert rules.',
    'Choose on-device (event NILM) vs offloaded (ML) disaggregation.',
  ],
  ai: {
    dataset: [
      'NILM can use event-and-signature matching (lightweight, on-device) or trained machine-learning models. For ML NILM, models are trained on labelled aggregate-power data where individual appliance states are known, learning to disaggregate the total.',
      'A per-home learning phase (switching known appliances while recording) captures that home\'s specific signatures, which vary by make/model.',
    ],
    datasetTable: [
      { n: 'REDD / UK-DALE / others', size: 'Multiple homes', lic: 'Research (check terms)', use: 'Train/benchmark NILM models' },
      { n: 'Your-home learning set', size: 'Days of labelled events', lic: 'Your own data', use: 'Adapt signatures to your appliances' },
    ],
    preprocess: [
      'Compute real power (and power factor) from voltage/current; resample to the analysis rate.',
      'Detect events (steps) and extract features per event (step magnitude, transient shape, PF change).',
      'Label events with the known appliance during the learning phase.',
    ],
    pipeline: [
      { name: 'Aggregate power', sub: 'whole-home', highlight: true },
      { name: 'Event detect', sub: 'on/off steps' },
      { name: 'Features', sub: 'magnitude/PF/shape' },
      { name: 'Match/model', sub: 'appliance' },
      { name: 'Attribute', sub: 'usage estimate', highlight: true },
    ],
    arch: [
      'Event NILM: a rule/nearest-signature matcher (tiny, on-device). ML NILM: models such as combinatorial optimisation, factorial HMMs, or neural sequence models (on a Pi/server).',
      'Match compute to method — the ESP32 handles event NILM; heavier ML runs offloaded.',
    ],
    archTable: [
      { l: 'Event detector', s: 'thresholded ΔP', p: 'Find appliance on/off events' },
      { l: 'Feature vector', s: 'step, PF, transient', p: 'Signature per event' },
      { l: 'Matcher/model', s: 'NN / HMM / NN-seq', p: 'Assign event to appliance' },
      { l: 'Attribution', s: 'interval integration', p: 'Per-appliance energy (estimate)' },
    ],
    hyper: [
      { k: 'event threshold', v: '~150 W', w: 'Trade sensitivity vs false events' },
      { k: 'sample rate', v: '1 Hz–kHz', w: 'Higher rate captures transients for better ID' },
      { k: 'match tolerance', v: '~15%', w: 'Signature variation between instances' },
    ],
    training: [
      'Record a learning period labelling each appliance\'s events to build/adapt its signature.',
      'For ML NILM, train on labelled aggregate data and validate on held-out homes/periods.',
      'Focus accuracy on large, distinct loads; accept lower accuracy for small/similar ones.',
    ],
    metricsIntro: [
      'NILM accuracy is judged per appliance (did we detect it, and estimate its energy) and overall (how much of the total is correctly attributed).',
    ],
    metrics: [
      { m: 'Large-load accuracy', v: 'high', d: 'Geyser/AC/kettle etc. detected well' },
      { m: 'Small/similar loads', v: 'lower', d: 'Overlap/ambiguity limits accuracy' },
      { m: 'Energy attribution error', v: 'per appliance', d: 'Estimate vs true where known' },
      { m: 'Whole-home total', v: 'exact', d: 'The foundation is a real measurement' },
    ],
    chart: {
      title: 'NILM confidence by load type (illustrative)',
      desc: 'Disaggregation is strong for large distinct loads, weaker for small/similar ones.',
      unit: '%',
      bars: [
        { label: 'Large distinct (geyser)', value: 92 },
        { label: 'Cyclic (fridge)', value: 78 },
        { label: 'Similar small loads', value: 45 },
      ],
    },
    deploy: [
      'Run event NILM on the ESP32 or offload ML NILM to a Pi/server; keep the exact whole-home total authoritative.',
      'Present appliance figures as estimates with confidence; refine with the learning phase.',
      'Log data to improve models over time.',
    ],
    inference: {
      file: 'infer.py', lang: 'python',
      body: `# Per-event appliance inference (event NILM).
def infer_event(dP, pf, library):
    best, best_d = None, 1e9
    for a in library:
        d = abs(dP - a.step_w)/a.step_w + abs(pf - a.pf)
        if d < best_d and abs(dP - a.step_w) < 0.15*a.step_w:
            best, best_d = a, d
    return best        # None = unknown/overlapping load`,
    },
    limits: [
      'NILM is inference, not measurement — appliance figures are estimates, best for large/distinct loads and weak for small/similar/overlapping ones.',
      'It needs a per-home learning phase and can misattribute when appliances switch simultaneously.',
      'Do not present appliance breakdowns as billing-grade; anchor exactness to the whole-home total.',
    ],
  },
  calibration: [
    { h: 'Whole-home accuracy', p: [
      'Verify real power/energy against a reference; this foundation must be accurate.',
    ] },
    { h: 'Appliance learning', p: [
      'Run the learning phase switching known appliances so their signatures are captured; validate detections.',
    ] },
    { h: 'Thresholds', p: [
      'Tune the event threshold and match tolerances to detect real appliance events without excess false ones.',
    ] },
  ],
  testing: [
    { step: 'Switch a large appliance (geyser)', expect: 'Event detected and attributed; breakdown updates' },
    { step: 'Run several small appliances together', expect: 'Some ambiguity — figures shown as estimates' },
    { step: 'Compare total to a reference meter', expect: 'Whole-home total accurate' },
    { step: 'Leave a heater on', expect: 'Left-on alert' },
    { step: 'Degrade a fridge (more cycling)', expect: 'Abnormal-behaviour alert' },
    { step: 'Run the learning phase', expect: 'Appliance signatures learned; accuracy improves' },
  ],
  output: [
    'The app shows live total consumption, a per-appliance breakdown and cost (as estimates), history, and alerts for abnormal/left-on appliances.',
    { file: 'meter-breakdown.json', lang: 'json', body: `{
  "total_W": 2380,
  "energy_kWh": 512.4,
  "appliances": { "Geyser": 4200, "Fridge": 1100, "AC": 3300, "Kettle": 300 },
  "note": "appliance figures are NILM estimates; total is measured"
}` },
    'An accurate whole-home total with an estimated appliance breakdown — enough to see the geyser and AC dominate the bill and target them, while the total stays exact.',
  ],
  troubleshoot: [
    { sym: 'Appliance figures wrong', cause: 'NILM ambiguity / no learning', fix: 'Run the learning phase; accept lower accuracy for small/similar loads; present as estimates' },
    { sym: 'Total inaccurate', cause: 'Measuring current/apparent, not real power', fix: 'Measure real power with power factor; verify against a reference' },
    { sym: 'Missed appliance events', cause: 'Threshold too high or sampling too slow', fix: 'Lower the threshold; sample faster for transients' },
    { sym: 'Simultaneous switches confuse it', cause: 'Overlapping events', fix: 'Known NILM limit; use higher-rate features/ML; report uncertainty' },
    { sym: 'Safety concern', cause: 'DIY mains install', fix: 'Use a qualified electrician; isolate electronics from mains' },
  ],
  perf: [
    'Keep the whole-home measurement accurate and continuous — it is the foundation.',
    'Run event NILM on-device; offload heavier ML to a Pi/server.',
    'Sample faster where transient signatures improve identification.',
    'Anchor exactness to the total; present appliance splits as estimates.',
  ],
  safety: [
    'Mains measurement is dangerous — use a qualified electrician for the mains-side install and isolate the electronics.',
    'NILM appliance figures are estimates, not billing-grade sub-metering — present them honestly.',
    'Respect privacy: appliance-usage data reveals occupancy/behaviour; secure and consent it.',
    'Keep the whole-home total authoritative for anything that must be exact.',
  ],
  maintenance: [
    'Re-run/extend the learning phase as appliances change.',
    'Verify whole-home accuracy periodically.',
    'Tune thresholds/models as usage patterns shift.',
    'Review alerts and refine appliance models.',
  ],
  future: [
    'Add higher-rate transient signatures and ML NILM for better disaggregation.',
    'Add solar/export awareness for prosumer homes.',
    'Add appliance-level anomaly detection for predictive maintenance.',
    'Integrate demand-response and time-of-use optimisation.',
  ],
  faq: [
    { q: 'How can one meter tell what each appliance uses?', a: 'By disaggregation (NILM): appliances have characteristic signatures in the aggregate power signal, so detecting on/off events and matching their step size and shape attributes the total to individual appliances — from a single measurement point.' },
    { q: 'Is the appliance breakdown accurate?', a: 'It is an informed estimate, not a measurement. It works well for large, distinct loads (geyser, AC, kettle) and less well for small or similar appliances whose events overlap. The whole-home total, though, is a real, exact measurement.' },
    { q: 'Does it need setup for my home?', a: 'Yes — a learning phase where you switch known appliances so it captures their specific signatures, since these vary by make and model.' },
    { q: 'Why measure real power, not just current?', a: 'Because appliances are often inductive and current alone overstates consumption and hides power factor. Real power (with PF) is the accurate foundation NILM builds on.' },
    { q: 'What can I actually do with it?', a: 'See which appliances cost the most and cut them, catch a failing appliance drawing more or something left on, and verify savings — most of the value of expensive per-circuit metering from one clamp.' },
  ],
  refs: [
    { t: 'Non-intrusive load monitoring (NILM)', u: 'https://en.wikipedia.org/wiki/Nonintrusive_load_monitoring', s: 'Reference' },
    { t: 'Hart\'s NILM (original work)', u: 'https://en.wikipedia.org/wiki/Nonintrusive_load_monitoring', s: 'Reference' },
    { t: 'Power factor and real power', u: 'https://en.wikipedia.org/wiki/Power_factor', s: 'Reference' },
    { t: 'Real-time energy feedback and savings', u: 'https://en.wikipedia.org/wiki/Smart_meter', s: 'Reference' },
    { t: 'NILM datasets (REDD/UK-DALE)', u: 'https://en.wikipedia.org/wiki/Nonintrusive_load_monitoring', s: 'Reference' },
  ],
  images: ['esp32', 'grafana', 'city'],
  imageCaptions: [
    'A single whole-home meter that disaggregates the total into appliance-level insight.',
    'ESP32 module measuring real power and detecting appliance on/off events for NILM.',
    'A dashboard shows which appliances cost the most — from one measurement point.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   071 — EV Charging Controller
   ══════════════════════════════════════════════════════════════════ */
{
  id: '071',
  domainKey: 'electronics',
  emoji: '🔋', thumb: 'board',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'Charges an EV as fast as the house wiring safely allows — dynamically sharing capacity with the home\'s other loads — and meters each session for billing, all via the standard charging protocol.',

  overview: [
    'Charging an electric vehicle at home or at a shared charge point raises a problem a normal socket does not: an EV draws a large, sustained current for hours, and if it does so on top of the house\'s other loads it can overload the wiring or trip the main breaker. The naive fix — a fixed, low charge current — wastes time and capacity. The smart fix, and the heart of this project, is <b>dynamic load management</b>: the controller continuously measures how much of the supply the rest of the building is using and charges the EV with whatever capacity is left, so the car charges as fast as is <i>safe right now</i>, and automatically backs off when the house load rises (the kettle goes on) and speeds up when it falls.',
    'It does this through the <b>standard EV charging protocol</b>. AC EV charging (IEC 61851 / SAE J1772, the "Type 1/Type 2" connectors) uses a <b>control pilot</b> signal — a PWM waveform whose duty cycle <i>tells the car how much current it may draw</i>. So the controller does not switch the car\'s current directly; it advertises a safe limit via the pilot, and the car obeys it. By varying that pilot duty cycle in response to the measured spare capacity, the controller safely modulates the charge rate in real time, and it follows the protocol\'s handshake (detecting the vehicle, confirming readiness, energising the contactor) so it interoperates with standard EVs.',
    'On top of safe charging it adds <b>metering and billing</b>: it measures the energy delivered each session (real power/energy) and logs it per user/session, which is what a shared or workplace charge point needs to bill fairly. It reports status and energy to a dashboard, supports authorisation (who may charge), and schedules charging to cheap tariff windows where desired. This is genuinely safety-critical, high-power equipment, so the project is emphatic: EV charging is governed by standards and electrical codes, the power wiring and protection (RCD/RCBO, earthing) must be done by a qualified electrician, and a DIY controller must respect the protocol and safety interlocks — it is an educational build of the control logic, not a certified charger. But as a load-managing, protocol-correct, metered charging controller, it demonstrates exactly how smart EV charging works: fast when it can be, safe always, and accounted for.',
  ],
  does: [
    'Charges an EV via the standard control-pilot protocol (IEC 61851/J1772)',
    'Dynamically shares supply capacity with the home\'s other loads',
    'Advertises a safe current limit to the car via the pilot PWM duty cycle',
    'Follows the charging handshake (vehicle detect, ready, contactor)',
    'Meters energy per session for billing',
    'Supports authorisation and cheap-tariff scheduling',
    'Respects safety standards and interlocks (educational scope)',
  ],
  features: [
    'Dynamic load management (charge with spare capacity)',
    'Standard control-pilot current signalling',
    'Protocol-correct handshake and interoperability',
    'Per-session energy metering for billing',
    'Authorisation and tariff scheduling',
    'Backs off/speeds up as house load changes',
    'Explicit safety-standard framing (not a certified charger)',
  ],
  applications: [
    { t: 'Home EV charging', d: 'Charging as fast as the house wiring safely allows without tripping the main breaker.' },
    { t: 'Shared / apartment charge points', d: 'Load-managed charging with per-session metering and billing.' },
    { t: 'Workplace charging', d: 'Authorised, metered charging across multiple bays sharing supply capacity.' },
    { t: 'Solar-aware charging', d: 'Charging preferentially from spare solar/cheap tariff windows.' },
  ],
  skills: [
    'EV charging protocol (control pilot PWM, handshake)',
    'Dynamic load management from whole-supply measurement',
    'Contactor control and safety interlocks',
    'Per-session energy metering and billing',
    'Authorisation and scheduling',
  ],
  prereq: [
    'EV charging is safety-critical, high-power, standards-governed. Power wiring and protection (RCD/RCBO, earthing) must be done by a qualified electrician; this is an educational build of the control logic, not a certified charger.',
    'You do not switch the car\'s current directly — you advertise a safe limit via the control-pilot PWM and the car obeys.',
    'Dynamic load management needs a whole-supply current measurement to know the spare capacity.',
    'Follow the protocol handshake and interlocks; never energise without the correct sequence.',
  ],

  parts: ['esp32', 'pzem004t', 'acs712', 'relay1', 'oled', 'rc522', 'psu5v'],
  extraParts: [
    { name: 'EVSE power stage (contactor + pilot/PP)', spec: 'Contactor rated for the charge current, control-pilot & proximity circuitry per IEC 61851', qty: 1, price: 3000, note: 'Safety-critical; must meet the standard and be professionally installed' },
    { name: 'Whole-supply CT', spec: 'CT on the incoming supply to measure total house load for dynamic management', qty: 1, price: 500 },
    { name: 'Session energy meter', spec: 'Real-power/energy metering of the charge for billing', qty: 1, price: 700 },
    { name: 'RCD/RCBO + earthing (installer)', spec: 'Required protection for EV charging, installed by a qualified electrician', qty: 1, price: 2000, note: 'Legally/technically required protection' },
  ],
  cost: '₹8,000 – ₹14,000',
  libs: ['wifi', 'pubsub', 'ssd1306', 'mfrc522', 'modbus', 'arduinojson', 'ntp'],

  pins: {
    left: [
      { dev: 'Control pilot', devPin: 'PWM/ADC', pin: 'GPIO 25 / 34', sig: 'CP: advertise limit + read state' },
      { dev: 'Proximity (PP)', devPin: 'ADC', pin: 'GPIO 35', sig: 'Cable presence/rating' },
      { dev: 'Whole-supply CT', devPin: 'AOUT', pin: 'GPIO 32 (ADC)', sig: 'Total house load' },
      { dev: 'RFID (authorise)', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Who may charge' },
    ],
    right: [
      { dev: 'Contactor', devPin: 'IN', pin: 'GPIO 26', sig: 'Energise (after handshake)' },
      { dev: 'Session meter', devPin: 'UART', pin: 'GPIO 16/17', sig: 'Energy for billing' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Status/current' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard/billing' },
    ],
  },
  wiringNotes: [
    'The power stage (contactor, control-pilot/proximity circuitry, protection) is safety-critical and must meet IEC 61851 and be installed by a qualified electrician with proper RCD/RCBO and earthing.',
    'The controller advertises a current limit via the control-pilot PWM duty cycle; it never switches the car\'s current directly — the car regulates to the advertised limit.',
    'Measure whole-supply current (CT on the incoming supply) so the controller knows the spare capacity for dynamic management.',
    'Only energise the contactor after the correct handshake (vehicle detected, ready) and interlocks.',
    'Meter the session energy for billing; add RFID/authorisation for shared use.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'House load', sub: 'spare capacity', highlight: true },
      { name: 'CP/PP', sub: 'vehicle state/cable' },
      { name: 'Authorise', sub: 'RFID' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'safe current' },
      { name: 'Load mgmt', sub: 'spare = max−house' },
    ] },
    { label: 'Signal/act', edge: 'right', blocks: [
      { name: 'Control pilot', sub: 'advertise limit' },
      { name: 'Contactor', sub: 'energise (handshake)' },
    ] },
    { label: 'Account', edge: 'none', blocks: [
      { name: 'Session meter', sub: 'billing' },
    ] },
  ] },
  flow: [
    { t: 'Vehicle connected + authorised?', k: 'dec', yes: 'Handshake (CP state)', no: 'Idle' },
    { t: 'Idle', k: 'io', back: 'Vehicle connected + authorised?' },
    { t: 'Handshake (CP state)', k: 'proc' },
    { t: 'Measure house load; compute spare', k: 'proc' },
    { t: 'Advertise safe current via CP PWM', k: 'io' },
    { t: 'Energise contactor; meter session', k: 'io' },
    { t: 'House load changed?', k: 'dec', yes: 'Re-advertise current (up/down)', no: 'Continue' },
    { t: 'Re-advertise current (up/down)', k: 'io', back: 'Measure house load; compute spare' },
    { t: 'Continue', k: 'end' },
  ],

  principle: [
    'Home and shared EV charging has one dominant constraint — <b>the supply is shared and finite</b> — and the controller\'s core intelligence is managing that safely without wasting it. An EV is an unusually large, sustained load (often as much as the rest of the house combined), so charging it at full tilt on top of the household\'s other loads can exceed the wiring\'s or the breaker\'s rating. The unintelligent solutions are bad: charge slowly always (wastes hours of capacity you often have) or charge fast and risk tripping/overloading. <b>Dynamic load management</b> resolves this by making the charge current a live variable: the controller measures the whole-supply load, subtracts it from the safe maximum, and charges the car with the <i>remaining</i> capacity — fast when the house is quiet, backing off automatically the instant a big load switches on, and ramping back up when it switches off. The car always charges as fast as is safe at that moment.',
    'The elegant part is <b>how</b> the controller sets the charge rate, via the <b>control pilot</b> of the standard AC charging protocol (IEC 61851 / SAE J1772). The charging cable carries a control-pilot line on which the charging equipment outputs a PWM signal, and — crucially — the <b>duty cycle of that PWM encodes the maximum current the vehicle is permitted to draw</b> (a defined linear relationship, e.g. a certain duty cycle means "you may draw up to N amps"). So the controller never switches the car\'s heavy current itself; it simply <b>advertises a limit</b> on the pilot, and the vehicle\'s onboard charger regulates its draw to stay within it. To modulate charging for load management, the controller just changes the pilot duty cycle — a low-power signalling action — and the car follows. This is what makes safe, smooth, dynamic current control possible.',
    'Around that sits the <b>protocol handshake and safety sequence</b>, which the controller must follow to interoperate and to be safe. The control-pilot voltage also encodes <b>state</b> — no vehicle, vehicle connected, vehicle ready to charge (and ventilation-required states) — so the controller detects a plugged-in car, waits for the "ready" state, checks the proximity/cable rating, and only then <b>energises the contactor</b> to deliver power, de-energising when the car finishes or unplugs. It never applies power out of sequence. This handshake, plus the protection that must accompany EV charging (residual-current protection, proper earthing), is why the power stage is genuinely safety-critical and standards-governed.',
    'On the safe-charging base, the controller adds the features a real charge point needs. <b>Per-session metering</b> — measuring the real energy delivered each charge — is what enables fair <b>billing</b> at shared, apartment or workplace points, logged per user/session. <b>Authorisation</b> (RFID or app) controls who may charge. <b>Scheduling</b> can steer charging into cheap tariff windows or toward surplus solar. And status/energy reporting feeds a dashboard. Throughout, the design is <b>emphatically honest about scope and safety</b>: EV charging is high-power, safety-critical equipment governed by standards and electrical codes; the power wiring, contactor and protection must be specified and installed by a qualified electrician, and a homebrew controller — however correct its logic — is an <b>educational realisation of the control system, not a certified charger</b>, and must respect the protocol and every interlock. Within that frame, it demonstrates exactly what smart EV charging is: use the standard pilot to charge as fast as the shared supply safely allows at every moment, follow the protocol and protection to do it safely, and meter it so it can be paid for.',
  ],
  equations: [
    { t: 'Dynamic load management', eq: 'Charge with the spare capacity of the supply:\n\n  I_spare = I_supply_max − I_house\n  I_charge = clamp(I_spare, I_min_or_0, I_evse_max)\n\nIf I_spare < I_min → pause; else advertise I_charge.\nRe-evaluate continuously so charging tracks the house load.' },
    { t: 'Control-pilot current signalling', eq: 'The pilot PWM duty cycle encodes the allowed current\n(IEC 61851 / J1772), e.g. for a common range:\n\n  I_allowed (A) ≈ duty(%) × 0.6   (6–51 A region)\n  → to allow I amps: duty = I / 0.6 (%)\n\nThe car regulates its draw to ≤ I_allowed. The controller\nsets duty; it does NOT switch the car current directly.' },
    { t: 'CP state + session energy', eq: 'Pilot voltage encodes state:\n  12V none | 9V connected | 6V ready | (3V vent)\n  energise contactor only in the ready state.\n\nSession energy for billing:\n  E_session = ∫ P dt  (real power over the session)' },
  ],

  assembly: [
    { h: 'Install the safety-critical power stage (qualified)', p: [
      'Have a qualified electrician install the contactor, control-pilot/proximity circuitry, and the required protection (RCD/RCBO, earthing) per IEC 61851 and local codes. This is not DIY power work.',
    ], warn: 'EV charging is high-power and safety-critical. The power stage and protection must meet the standard and be professionally installed. This project builds the control logic; it is not a certified charger.' },
    { h: 'Set up load measurement and control', p: [
      'Measure whole-supply current for dynamic management, and wire the controller to output the control-pilot PWM and read its state, and to drive the contactor after the handshake.',
    ] },
    { h: 'Add metering, authorisation and reporting', p: [
      'Meter session energy for billing, add RFID/app authorisation, and report status/energy to a dashboard; add scheduling for tariff/solar.',
    ] },
  ],
  steps: [
    { h: 'Compute safe current and advertise it', p: [
      'Compute the spare capacity from the whole-supply load, clamp to the EVSE limit, and set the control-pilot duty cycle to advertise it — re-evaluating continuously.',
    ], code: {
      file: 'load-mgmt.ino', lang: 'cpp',
      body: `#define I_SUPPLY_MAX 32.0f    // A — the supply/wiring safe limit
#define I_EVSE_MAX   32.0f    // A — charger/cable limit
#define I_MIN         6.0f    // A — minimum EV charge current

// Amps the EV may draw = spare capacity, clamped.
float safeChargeCurrent(float houseCurrentA){
  float spare = I_SUPPLY_MAX - houseCurrentA;
  if (spare < I_MIN) return 0;                 // not enough spare -> pause
  return fminf(spare, I_EVSE_MAX);
}

// Advertise the current to the car via control-pilot PWM duty.
void setPilotCurrent(float amps){
  float duty = amps / 0.6f;                     // IEC 61851 6-51 A region
  duty = constrain(duty, 10.0f, 90.0f);         // valid PWM range
  setPilotDuty(duty);                           // car regulates to <= amps
}`,
      explain: [
        { ref: 'float spare = I_SUPPLY_MAX - houseCurrentA', txt: 'The spare capacity is the supply limit minus what the house is already drawing — the amount available to charge with, right now.' },
        { ref: 'if (spare < I_MIN) return 0;', txt: 'If there is not enough spare for the EV\'s minimum charge current, charging pauses rather than overloading the supply.' },
        { ref: 'float duty = amps / 0.6f;', txt: 'The allowed current is encoded into the control-pilot PWM duty cycle per the standard — the low-power signal the car obeys.' },
        { ref: 'setPilotDuty(duty);                           // car regulates to <= amps', txt: 'The controller advertises the limit; the vehicle\'s onboard charger regulates its draw to stay within it — the controller never switches the heavy current itself.' },
      ],
    } },
    { h: 'Follow the handshake, meter and bill', p: [
      'Detect the vehicle and ready state via the pilot, energise the contactor only when ready, meter session energy per authorised user, and report — modulating the advertised current continuously with the house load.',
    ], tip: 'Re-advertise the current whenever the house load changes so the car ramps down when a big load starts and back up when it stops — smooth, safe, and fast when it can be.' },
  ],

  code: [{
    file: 'ev-charging-controller.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   EV Charging Controller — ESP32 (control logic; EDUCATIONAL)

   Dynamic load management: charges the EV with the supply's spare
   capacity, advertised via the IEC 61851/J1772 control-pilot PWM, with
   the protocol handshake, per-session metering and authorisation.
   The power stage/protection is safety-critical — professional install.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>

#define PIN_CP_PWM   25     // control-pilot PWM out
#define PIN_CP_ADC   34     // control-pilot state (voltage)
#define PIN_HOUSE_CT 32     // whole-supply current
#define PIN_CONTACTOR 26
#define I_SUPPLY_MAX 32.0f
#define I_EVSE_MAX   32.0f
#define I_MIN         6.0f

PZEM004Tv30 session(Serial2, 16, 17);   // session energy meter
WiFiClient net; PubSubClient mqtt(net);
bool authorised=false, charging=false;

enum CPState { CP_NONE, CP_CONNECTED, CP_READY, CP_UNKNOWN };
CPState readCP(){
  int v = analogRead(PIN_CP_ADC);        // map to CP voltage
  float cp = v/4095.0f*12.0f;            // simplified scaling
  if (cp > 10) return CP_NONE;           // ~12V no vehicle
  if (cp > 7)  return CP_CONNECTED;      // ~9V connected
  if (cp > 4)  return CP_READY;          // ~6V ready to charge
  return CP_UNKNOWN;
}

float houseCurrent(){ return analogRead(PIN_HOUSE_CT)/4095.0f * 63.0f; } // A

float safeChargeCurrent(float house){
  float spare = I_SUPPLY_MAX - house;
  if (spare < I_MIN) return 0;
  return fminf(spare, I_EVSE_MAX);
}
void setPilotCurrent(float amps){
  float duty = constrain(amps/0.6f, 10.0f, 90.0f);
  ledcWrite(0, (int)(duty/100.0f*1023));  // advertise via CP PWM
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_CONTACTOR, OUTPUT);
  ledcSetup(0, 1000, 10); ledcAttachPin(PIN_CP_PWM, 0);  // 1 kHz CP PWM
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("evse-1");
  mqtt.loop();

  CPState st = readCP();
  authorised = checkAuthorisation();       // RFID/app

  if (st == CP_READY && authorised){
    float amps = safeChargeCurrent(houseCurrent());
    setPilotCurrent(amps);                 // advertise safe current
    if (amps >= I_MIN){
      if (!charging){ digitalWrite(PIN_CONTACTOR, HIGH); charging=true; } // energise
    } else if (charging){
      digitalWrite(PIN_CONTACTOR, LOW); charging=false;   // pause (no spare)
    }
  } else {                                  // not ready/authorised
    if (charging){ digitalWrite(PIN_CONTACTOR, LOW); charging=false; }
    setPilotCurrent(0);
  }

  float e = session.energy();               // session energy for billing
  char m[200];
  snprintf(m,sizeof m,
    "{\\"state\\":%d,\\"charging\\":%s,\\"house_A\\":%.1f,"
    "\\"charge_A\\":%.1f,\\"session_kWh\\":%.3f}",
    st, charging?"true":"false", houseCurrent(),
    safeChargeCurrent(houseCurrent()), e);
  mqtt.publish("evse/1/status", m);

  delay(1000);
}`,
    explain: [
      { ref: 'CPState readCP()', txt: 'Reads the control-pilot voltage to detect vehicle state — none, connected, ready — so the controller only charges when the car signals it is ready.' },
      { ref: 'float amps = safeChargeCurrent(houseCurrent())', txt: 'The charge current is the supply\'s spare capacity, so the EV charges as fast as is safe given the rest of the house\'s load, moment to moment.' },
      { ref: 'setPilotCurrent(amps);                 // advertise safe current', txt: 'The safe limit is advertised via the control-pilot PWM; the car regulates to it, so the controller never switches the heavy current directly.' },
      { ref: 'if (!charging){ digitalWrite(PIN_CONTACTOR, HIGH); charging=true; } // energise', txt: 'The contactor is energised only in the ready state with authorisation and adequate spare capacity — the protocol-correct, interlocked sequence.' },
      { ref: 'float e = session.energy();               // session energy for billing', txt: 'Per-session energy is metered for fair billing at shared or workplace charge points.' },
    ],
  }],

  config: [
    'Set the supply/wiring and EVSE current limits and the minimum charge current.',
    'Configure the control-pilot PWM (current encoding) and state thresholds, and the handshake/interlocks.',
    'Configure whole-supply measurement for load management, session metering, authorisation and tariff scheduling.',
    'Ensure the power stage/protection is professionally installed per standards.',
  ],
  calibration: [
    { h: 'Pilot signalling', p: [
      'Verify the control-pilot PWM duty cycle correctly encodes the advertised current per the standard, and that the vehicle regulates to it.',
    ] },
    { h: 'Load management', p: [
      'Calibrate the whole-supply current measurement and confirm the charge current tracks spare capacity as house load changes.',
    ] },
    { h: 'Metering', p: [
      'Verify session energy against a reference for accurate billing.',
    ] },
  ],
  testing: [
    { step: 'Connect an EV (ready state)', expect: 'Handshake completes; contactor energises; charging starts' },
    { step: 'Switch on a big house load', expect: 'Advertised current drops; car ramps down; no overload' },
    { step: 'Switch it off', expect: 'Advertised current rises; car ramps up' },
    { step: 'House load leaves no spare', expect: 'Charging pauses; resumes when spare returns' },
    { step: 'Unauthorised user', expect: 'No charging without authorisation' },
    { step: 'Complete a session', expect: 'Session energy metered for billing' },
  ],
  output: [
    'The dashboard shows charge state, live charge current vs house load, session energy and cost, and billing per user/session.',
    { file: 'evse-status.json', lang: 'json', body: `{
  "state": 2,
  "charging": true,
  "house_A": 14.0,
  "charge_A": 18.0,
  "session_kWh": 7.42
}` },
    'With the house drawing 14 A of a 32 A supply, the EV is advertised 18 A of spare capacity — charging fast but safe; when a big load starts, the advertised current drops automatically to protect the supply.',
  ],
  troubleshoot: [
    { sym: 'Trips the main breaker', cause: 'No/incorrect load management', fix: 'Measure whole-supply load and charge only with spare capacity; verify the supply limit' },
    { sym: 'Car won\'t charge', cause: 'Pilot/handshake wrong', fix: 'Verify CP PWM/state encoding and the handshake sequence; check proximity/cable' },
    { sym: 'Charge current not obeyed', cause: 'Wrong pilot current encoding', fix: 'Correct the duty-cycle-to-current mapping per the standard' },
    { sym: 'Billing inaccurate', cause: 'Session meter uncalibrated', fix: 'Verify session energy against a reference' },
    { sym: 'Safety concern', cause: 'DIY power stage/protection', fix: 'Professional install of contactor and RCD/RCBO/earthing per standards; this is control logic only' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → charge-point management/billing',
    net: {
      nodes: [{ name: 'EVSE controller', sub: 'ESP32' }, { name: 'Other bays', sub: 'shared supply' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to backend',
      uplink: 'MQTT/OCPP', cloud: 'CPMS/billing', cloudSub: 'sessions + energy',
      clients: [{ name: 'Dashboard', sub: 'status/energy' }, { name: 'Billing', sub: 'per session' }],
    },
    protocol: ['Charge status, current and session energy publish continuously; multiple bays coordinate to share supply capacity (site-wide load management). OCPP integration suits managed charge points.'],
    topics: [
      { t: 'evse/1/status', dir: 'node → backend', payload: 'state, charge/house current, session kWh' },
      { t: 'evse/1/session', dir: 'node → billing', payload: 'user, energy, duration (billing)' },
      { t: 'evse/site/limit', dir: 'backend → nodes', payload: 'site capacity allocation' },
    ],
    cloud: ['A charge-point management/billing backend records sessions and energy, allocates site capacity across bays, and handles authorisation and billing (OCPP for standard integration).'],
    dashboard: ['Per-bay charge status and current vs house/site load, session energy/cost, and billing per user.'],
    mobile: ['Charge-status and session-complete notifications; cost per session.'],
    security: [
      'Authenticate authorisation and billing; secure the backend.',
      'Keep the protocol handshake and safety interlocks robust; the power stage/protection is professionally installed.',
      'Coordinate multi-bay load management so the site limit is never exceeded.',
    ],
  },

  perf: [
    'Re-evaluate the safe charge current continuously so it tracks house/site load.',
    'Use the control pilot to modulate current smoothly; never switch the car current directly.',
    'Meter session energy accurately for billing.',
    'Coordinate multiple bays to share site capacity.',
  ],
  safety: [
    'EV charging is high-power, safety-critical and standards-governed — the power stage, contactor and protection (RCD/RCBO, earthing) must be professionally installed per IEC 61851 and local codes.',
    'This is an educational build of the control logic, NOT a certified charger; respect the protocol and every interlock.',
    'Only energise in the correct handshake state; never apply power out of sequence.',
    'Dynamic load management protects the wiring — verify the supply limit and measurement.',
  ],
  maintenance: [
    'Verify pilot signalling, handshake and interlocks periodically.',
    'Check the load-management measurement and session-meter calibration.',
    'Inspect the power stage/protection (professionally).',
    'Update authorisation/billing and site-capacity allocation as needed.',
  ],
  future: [
    'Add OCPP for standard charge-point management integration.',
    'Add solar-surplus charging (charge from export).',
    'Add three-phase and vehicle-to-grid where supported.',
    'Add site-wide multi-bay dynamic load balancing.',
  ],
  faq: [
    { q: 'How does it charge fast without tripping the breaker?', a: 'Dynamic load management: it measures the whole-house load and charges the EV with the spare capacity, backing off automatically when a big load switches on and ramping up when it stops — always as fast as is safe at that moment.' },
    { q: 'Does it switch the car\'s current directly?', a: 'No. It advertises a current limit to the car via the control-pilot PWM duty cycle (the IEC 61851/J1772 standard), and the car\'s onboard charger regulates its draw to stay within it. Modulating charging is a low-power signalling action.' },
    { q: 'Can I build and install this myself?', a: 'The control logic, yes, as an educational build. But EV charging is high-power and safety-critical — the power stage, contactor and protection (RCD/RCBO, earthing) must be specified and installed by a qualified electrician per standards. It is not a certified charger.' },
    { q: 'How does billing work at a shared point?', a: 'It meters the real energy delivered each session and logs it per authorised user, which is what fair billing at apartment or workplace charge points needs.' },
    { q: 'Can it use cheap tariffs or solar?', a: 'Yes — it can schedule charging into cheap tariff windows or prioritise charging from surplus solar, since it controls the charge rate and timing.' },
  ],
  refs: [
    { t: 'IEC 61851 / SAE J1772 EV charging (control pilot)', u: 'https://en.wikipedia.org/wiki/SAE_J1772', s: 'Reference' },
    { t: 'EVSE and control-pilot signalling', u: 'https://en.wikipedia.org/wiki/Charging_station', s: 'Reference' },
    { t: 'Dynamic load management for EV charging', u: 'https://en.wikipedia.org/wiki/Load_management', s: 'Reference' },
    { t: 'OCPP charge-point management', u: 'https://en.wikipedia.org/wiki/Open_Charge_Point_Protocol', s: 'Reference' },
    { t: 'EV charging safety (RCD/earthing)', u: 'https://en.wikipedia.org/wiki/Residual-current_device', s: 'Reference' },
  ],
  images: ['ev', 'esp32', 'car'],
  imageCaptions: [
    'Smart EV charging shares the supply so the car charges as fast as the wiring safely allows.',
    'ESP32 module advertising a safe current via the control pilot and metering the session.',
    'Dynamic load management backs the charge off when the house load rises and speeds it up when it falls.',
  ],
},

];
