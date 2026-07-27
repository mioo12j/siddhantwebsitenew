/* ═══════════════════════════════════════════════════════════════════
   Smart Home — projects 011–012
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 011 · Smart Plant Irrigation ────────────────────────────────── */
{
  id: '011',
  domainKey: 'iot',
  emoji: '🪴',
  thumb: 'sensor',
  difficulty: 'Beginner',
  hours: '6–10 hours',
  iso8601: 'PT8H',
  tagline: 'Soil-moisture-driven watering that understands the difference between "the surface is dry" and "the plant is thirsty" — with capacitive probes that survive, a pump that cannot flood your floor, and per-plant thresholds you calibrate once.',

  overview: [
    'The failure mode of most automatic plant waterers is not that they under-water. It is that they over-water, kill the plant through root rot, and then flood the floor when a tube pops off. Every design decision here is aimed at those three outcomes rather than at the easy part, which is turning a pump on.',
    'The sensing choice matters first. The resistive soil probe that ships with almost every starter kit is two exposed metal prongs with DC across them. In damp soil that is an electrolysis cell: the prongs corrode visibly within two to four weeks, the readings drift steadily drier, and the system responds by watering more and more. It is not a cheaper option, it is a broken one. A <b>capacitive probe</b> measures the dielectric constant of the soil through an insulating coating with no exposed metal at all, and lasts years.',
    'The control logic then has to respect what soil actually does. Water applied at the surface takes fifteen to forty minutes to redistribute through the root zone, so a controller that waters, re-reads immediately, still sees dry soil and waters again will drown the plant in about four cycles. The firmware therefore runs a strict <b>water-then-wait</b> cycle: a bounded pulse, a mandatory soak period, and only then a fresh decision.',
    'Finally the safety layer. A pump that can run indefinitely is a flood waiting for a stuck relay or a crashed loop. This design bounds every pulse in hardware terms — a maximum run time enforced independently of the control logic, a daily volume cap, and a reservoir level switch that refuses to run the pump dry. Running a small diaphragm pump dry destroys it in minutes.',
  ],

  does: [
    'Measures volumetric soil moisture with a capacitive probe per plant, calibrated to that specific soil and pot.',
    'Waters in bounded pulses with an enforced soak period between them, so the reading has time to become meaningful.',
    'Refuses to run the pump when the reservoir level switch reports empty.',
    'Enforces a daily volume cap so a stuck sensor cannot drown a plant over a weekend.',
    'Supports up to four independent zones from one controller, each with its own threshold and schedule.',
    'Logs every watering event with duration, estimated volume and the moisture before and after.',
    'Publishes to MQTT and Home Assistant, with per-zone manual override.',
  ],

  features: [
    '<b>Capacitive probes only</b> — no exposed electrodes, no electrolysis, multi-year life.',
    '<b>Two-point calibration</b> per probe (dry air and saturated soil) mapped to volumetric water content.',
    '<b>Water-then-soak cycle</b> with a 30-minute mandatory wait, which is what prevents over-watering.',
    '<b>Hard pulse limit</b> of 20 seconds enforced by a separate timer from the control logic.',
    '<b>Daily volume cap</b> in millilitres, reset at midnight.',
    '<b>Dry-run protection</b> via a reservoir float switch, protecting the pump.',
    '<b>Temperature and humidity compensation</b> — evapotranspiration rises with heat, so thresholds shift.',
    '<b>Per-plant profiles</b> stored in NVS: succulents, herbs and ferns want completely different set points.',
  ],

  applications: [
    { t: 'Indoor houseplants during travel', d: 'The original use case, and the one where over-watering does the most damage because nobody is there to notice.' },
    { t: 'Balcony herb and vegetable planters', d: 'Small soil volumes dry out fast in summer; daily watering by hand is exactly the chore this removes.' },
    { t: 'Seed propagation trays', d: 'Germination needs consistently damp, never saturated — a band that is very hard to hit manually.' },
    { t: 'Bonsai and specimen plants', d: 'High-value plants where the cost of getting it wrong justifies instrumenting it properly.' },
    { t: 'Office plants', d: 'Nobody waters them at weekends, and everybody waters them on Monday.' },
    { t: 'Teaching sensors and control', d: 'A complete closed loop — measure, decide, actuate, measure again — with a visible physical result.' },
  ],

  skills: [
    'Basic Arduino C++ and analogue reading',
    'Understanding of a two-point sensor calibration',
    'Driving a pump through a MOSFET or relay with a flyback diode',
    'Simple plumbing — tubing, drippers, reservoir',
    'MQTT basics for the reporting half',
  ],

  parts: ['esp32', 'soil', 'pump', 'dht22', 'oled', 'buck', 'psu5v', 'perfboard', 'enclosure'],
  qty: { soil: 4, pump: 1 },
  extraParts: [
    { name: 'Reservoir float switch', spec: 'Vertical, NO/NC, 100 V 0.5 A', qty: 1, price: 180, note: 'Wire normally-closed so a broken wire reads as empty and stops the pump.' },
    { name: 'IRLZ44N logic-level MOSFET + 1N4007', spec: 'N-channel, 3.3 V gate drive, 47 A', qty: 4, price: 120, note: 'Logic-level gate is essential — a standard IRF540 will not fully turn on from 3.3 V.' },
    { name: '6 mm silicone tubing + drippers + T-pieces', spec: '3 m tube, 4 adjustable drippers', qty: 1, price: 280 },
    { name: '5 L reservoir with lid', spec: 'Food-grade HDPE', qty: 1, price: 220 },
  ],
  cost: '₹2,900 – ₹3,800 for four zones',
  libs: ['wifi', 'pubsub', 'arduinojson', 'dhtlib', 'unified', 'ssd1306', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'Capacitive soil probe 1–4', devPin: 'AOUT', pin: 'GPIO 34 35 36 39', sig: 'Analogue, input-only pins' },
      { dev: 'DHT22 air sensor', devPin: 'DATA', pin: 'GPIO 27', sig: '1-wire, 4.7 kΩ pull-up' },
      { dev: 'Reservoir float switch', devPin: 'NC contact', pin: 'GPIO 32', sig: 'Pull-up; open = empty' },
      { dev: 'Manual water button', devPin: 'NO', pin: 'GPIO 33', sig: 'Pull-up' },
    ],
    right: [
      { dev: 'Pump 1–4 via MOSFET', devPin: 'Gate', pin: 'GPIO 25 26 14 12', sig: '3.3 V logic-level gate' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x3C' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Through 330 Ω' },
    ],
  },
  wiringNotes: [
    'GPIO 34, 35, 36 and 39 are <b>input-only</b> and have no internal pull-ups — perfect for analogue probes and useless for anything else. Use them here and keep the output-capable pins for the pumps.',
    'Use <b>ADC1</b> pins (32–39) for the probes. ADC2 (GPIO 0, 2, 4, 12–15, 25–27) is unavailable whenever Wi-Fi is active, and the failure is silent: <code>analogRead()</code> simply returns garbage.',
    'The pump is inductive. Fit a 1N4007 across its terminals, cathode to positive, or the back-EMF will destroy the MOSFET. This is the single most common cause of a pump project that works twice and then stops.',
    'Use a <b>logic-level</b> MOSFET such as the IRLZ44N. A standard IRF540 needs about 10 V on the gate to turn fully on; driven from 3.3 V it operates in its linear region, dissipates several watts and gets hot enough to fail.',
    'Keep the probe electronics above the soil line. The probe is designed to be inserted to a marked depth — pushing it in past the coating line lets water reach the electronics and destroys it.',
    'Route tubing so that if a connection fails, water goes into a tray rather than onto the floor. Assume it will fail eventually, because it will.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'Capacitive probes', sub: '×4, ADC1' }, { name: 'DHT22', sub: 'air T / RH' }, { name: 'Float switch', sub: 'reservoir' }] },
      { label: 'Decide', edge: 'raw ADC', blocks: [{ name: 'Two-point map', sub: 'to % VWC' }, { name: 'Threshold + soak', sub: 'per zone', highlight: true }] },
      { label: 'Guard', edge: 'water request', blocks: [{ name: 'Pulse limiter', sub: '20 s hard cap', highlight: true }, { name: 'Daily volume cap', sub: 'mL/day' }] },
      { label: 'Act', edge: 'approved', blocks: [{ name: 'MOSFET → pump', sub: 'per zone' }, { name: 'Log + MQTT', sub: 'before/after' }] },
    ],
  },

  flow: [
    { t: 'Boot: load calibration and profiles', k: 'start' },
    { t: 'Read all probes, DHT22 and float switch', k: 'proc' },
    { t: 'Any zone below its threshold?', k: 'dec', yes: 'yes', no: 'sleep 60 s', back: 1 },
    { t: 'Soak period elapsed for that zone?', k: 'dec', yes: 'yes', no: 'wait', back: 1 },
    { t: 'Reservoir has water and cap not reached?', k: 'dec', yes: 'yes', no: 'alert, skip', back: 1 },
    { t: 'Run pump for the bounded pulse', k: 'io' },
    { t: 'Record volume, start 30 min soak timer', k: 'proc' },
    { t: 'Publish event over MQTT', k: 'end' },
  ],

  principle: [
    'A <b>capacitive soil probe</b> works because water has an unusually high relative permittivity — about 80, against roughly 4 for dry soil minerals and 1 for air. The probe is a pair of PCB traces forming a capacitor with the soil as its dielectric; more water in the soil means more capacitance. The board runs a 555-style oscillator whose frequency depends on that capacitance, rectifies the result, and presents a DC voltage on the analogue output. Because the copper is entirely covered by solder mask, no current flows through the soil and there is nothing to corrode.',
    'The output is not calibrated in any physical unit, and the mapping differs with soil type, compaction, temperature and even pot size. A <b>two-point calibration</b> is therefore mandatory: record the raw ADC value with the probe in dry air (the driest possible reading) and again in a pot of thoroughly saturated soil (the wettest). Everything between is linearly interpolated. That linear assumption is not perfectly true — the real relationship curves — but across the 20–60 % range where watering decisions actually happen, it is accurate to a few percent.',
    'What the plant cares about is not moisture at the surface but water availability in the <b>root zone</b>. This is where naive controllers fail. Applying 30 mL to the top of a pot wets the top two centimetres immediately and takes 20–40 minutes to redistribute downward through capillary action. A controller that re-reads at one minute sees soil that is still dry at probe depth, waters again, and repeats. Four cycles later the pot is saturated and the roots are anaerobic. The <b>mandatory soak period</b> is not a nicety, it is the core of the algorithm.',
    'The threshold itself should be a band, not a point. Watering when moisture drops below a lower limit and stopping when it rises above an upper limit gives hysteresis and prevents the controller from chasing sensor noise. For most houseplants a band of roughly 30 % to 55 % works; succulents want 15 % to 30 % and ferns want 45 % to 70 %. These are set-point profiles, not universal truths, and the calibration procedure is what makes the numbers mean the same thing across different soils.',
    '<b>Evapotranspiration compensation</b> is a small refinement with a real effect. A plant loses water faster when the air is warm and dry. Shifting the lower threshold up by a couple of percent for every 5 °C above 25 °C, and down when humidity is high, keeps the plant in the same effective water-stress band across seasons rather than across thermometer readings.',
  ],

  equations: [
    { t: 'Two-point calibration to volumetric water content', eq: 'Raw ADC readings for a specific probe:\n  air_dry (0 % VWC)      = 3180\n  saturated (100 % scale)= 1420\n\nVWC% = (air_dry − raw) / (air_dry − saturated) × 100\n\nExample raw = 2400:\n  VWC = (3180 − 2400) / (3180 − 1420) × 100\n      = 780 / 1760 × 100 = 44.3 %\n\nNote the inversion: a wetter soil gives a LOWER\nraw value, because more capacitance lowers the\noscillator frequency and hence the rectified output.' },
    { t: 'Pulse volume and daily cap', eq: 'Pump rated 100 L/h at zero head:\n  = 100 000 mL / 3600 s = 27.8 mL/s\n\nAt 0.5 m head, derate ~35 %:\n  effective ≈ 18 mL/s\n\n8-second pulse  = 144 mL\n20-second cap   = 360 mL   (hard limit)\n\nDaily cap for a 15 cm pot (~1.7 L soil):\n  a full re-wet is about 400 mL\n  set the daily cap at 500 mL — enough for one\n  full watering, not enough to drown it twice.' },
    { t: 'Evapotranspiration threshold shift', eq: 'Baseline threshold  T₀ = 30 % VWC at 25 °C, 50 %RH\n\nT = T₀ + 0.4 × (temp_C − 25) − 0.05 × (rh − 50)\n\n35 °C, 30 %RH:\n  T = 30 + 0.4 × 10 − 0.05 × (−20)\n    = 30 + 4 + 1 = 35 %\n\n18 °C, 70 %RH:\n  T = 30 + 0.4 × (−7) − 0.05 × 20\n    = 30 − 2.8 − 1 = 26.2 %\n\nThe plant is kept at a similar water stress level\nrather than a similar sensor reading.' },
  ],

  steps: [
    {
      h: 'Calibrate each probe before writing any control logic',
      p: ['Every probe is different and every soil is different. This routine records the two endpoints and stores them, and it is the difference between a system that works and one that waters at random.'],
      code: {
        file: '01-probe-calibrate.ino', lang: 'cpp',
        body: `#include <Preferences.h>
Preferences prefs;

const uint8_t PROBE_PIN[4] = { 34, 35, 36, 39 };
uint16_t calDry[4], calWet[4];

uint16_t probeRaw(uint8_t zone) {
  uint32_t acc = 0;
  for (int i = 0; i < 32; i++) { acc += analogRead(PROBE_PIN[zone]); delay(2); }
  return acc / 32;                     // the ESP32 ADC is noisy; average hard
}

float probePercent(uint8_t zone) {
  int span = (int)calDry[zone] - (int)calWet[zone];
  if (span < 200) return -1;           // calibration is nonsense or missing
  float pct = (calDry[zone] - (float)probeRaw(zone)) * 100.0f / span;
  return pct < 0 ? 0 : (pct > 100 ? 100 : pct);
}

void calibrateZone(uint8_t zone) {
  Serial.printf("Zone %d: hold the probe in DRY AIR, then press Enter\\n", zone);
  while (!Serial.available()) delay(50);
  while (Serial.available()) Serial.read();
  calDry[zone] = probeRaw(zone);

  Serial.printf("Zone %d: insert into THOROUGHLY SOAKED soil, press Enter\\n", zone);
  while (!Serial.available()) delay(50);
  while (Serial.available()) Serial.read();
  calWet[zone] = probeRaw(zone);

  char kd[8], kw[8];
  snprintf(kd, sizeof(kd), "d%u", zone);
  snprintf(kw, sizeof(kw), "w%u", zone);
  prefs.putUShort(kd, calDry[zone]);
  prefs.putUShort(kw, calWet[zone]);

  Serial.printf("Zone %d calibrated: dry=%u wet=%u span=%d\\n",
                zone, calDry[zone], calWet[zone],
                (int)calDry[zone] - (int)calWet[zone]);
  if ((int)calDry[zone] - (int)calWet[zone] < 400)
    Serial.println("  WARNING: span too small — probe may be faulty or not inserted");
}`,
        explain: [
          { ref: 'analogRead averaged 32 times', txt: 'The ESP32 SAR ADC has significant noise and non-linearity. A single reading can swing 3–5 %, which on a 30 % threshold is enough to cause spurious watering. Averaging 32 samples costs 64 ms and removes the problem.' },
          { ref: 'span < 200 → return −1', txt: 'A probe that is not inserted, disconnected, or dead produces a tiny span between its two calibration points. Returning an explicit error rather than a plausible percentage stops the controller acting on nonsense.' },
          { ref: 'calDry > calWet', txt: 'Capacitive probes read <em>lower</em> when wet, which is the opposite of the resistive probes people are used to. Getting the direction wrong produces a system that waters when the soil is already saturated.' },
          { ref: '"thoroughly soaked soil", not water', txt: 'Calibrating the wet point in a glass of water gives a value the probe will never see in soil, which compresses the useful range. Saturate an actual pot and let it drain for a minute.' },
        ],
      },
      tip: 'Recalibrate whenever you repot. New soil with different organic content shifts both endpoints noticeably.',
    },
    {
      h: 'Bound the pump in a way the control logic cannot override',
      p: ['The pump guard is deliberately written as a separate module with its own timer. If the decision logic has a bug and asks for water forever, the guard still stops at twenty seconds.'],
      code: {
        file: '02-pump-guard.ino', lang: 'cpp',
        body: `const uint8_t PUMP_PIN[4] = { 25, 26, 14, 12 };
#define PIN_FLOAT 32
#define MAX_PULSE_MS      20000UL
#define DAILY_CAP_ML        500
#define PUMP_ML_PER_SEC      18.0f

struct Zone {
  uint32_t pumpStart;        // 0 when idle
  uint32_t requestedMs;
  uint32_t soakUntil;
  uint16_t mlToday;
} zones[4];

bool reservoirHasWater() {
  // Float switch wired normally-CLOSED: a cut wire reads empty. Fail safe.
  return digitalRead(PIN_FLOAT) == LOW;
}

bool pumpRequest(uint8_t z, uint32_t ms) {
  if (zones[z].pumpStart) return false;                       // already running
  if (millis() < zones[z].soakUntil) return false;            // still soaking
  if (!reservoirHasWater()) return false;                     // dry reservoir
  if (ms > MAX_PULSE_MS) ms = MAX_PULSE_MS;                   // hard clamp

  uint16_t wouldAdd = (uint16_t)(ms / 1000.0f * PUMP_ML_PER_SEC);
  if (zones[z].mlToday + wouldAdd > DAILY_CAP_ML) return false;

  zones[z].pumpStart   = millis();
  zones[z].requestedMs = ms;
  digitalWrite(PUMP_PIN[z], HIGH);
  return true;
}

// Called every loop. This is the only place a pump is ever switched off,
// and it stops on time regardless of what the control logic believes.
void pumpService() {
  for (uint8_t z = 0; z < 4; z++) {
    if (!zones[z].pumpStart) continue;

    uint32_t ran = millis() - zones[z].pumpStart;
    bool stop = ran >= zones[z].requestedMs
             || ran >= MAX_PULSE_MS
             || !reservoirHasWater();

    if (stop) {
      digitalWrite(PUMP_PIN[z], LOW);
      zones[z].mlToday += (uint16_t)(ran / 1000.0f * PUMP_ML_PER_SEC);
      zones[z].soakUntil = millis() + 30UL * 60UL * 1000UL;   // 30 min soak
      zones[z].pumpStart = 0;
    }
  }
}`,
        explain: [
          { ref: 'Float switch normally closed', txt: 'A cut or disconnected float wire reads the same as an empty reservoir, so the failure mode is a pump that refuses to run rather than one that runs dry. Running a diaphragm pump dry destroys it within minutes.' },
          { ref: 'Three independent stop conditions', txt: 'Requested duration, absolute cap, and reservoir state. Any one of them stops the pump. A bug in the control logic can only ever cause under-watering, never a flood.' },
          { ref: 'soakUntil set on stop, not on start', txt: 'The soak timer begins when watering ends, which is when redistribution actually starts. Starting it at pump-on would shorten the effective soak by the pulse length.' },
          { ref: 'mlToday accumulated from actual run time', txt: 'Volume is credited from how long the pump really ran, not from what was requested — so a pulse cut short by an empty reservoir does not consume the daily budget.' },
        ],
      },
    },
  ],

  code: [{
    file: 'smart-irrigation.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Plant Irrigation — ESP32 + capacitive probes + pumps

   Four independent zones, each with its own two-point calibration,
   moisture band and plant profile. Watering is a bounded pulse
   followed by a mandatory 30-minute soak, guarded by a hard pulse
   limit, a daily volume cap and a reservoir float switch.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "irrigation-indoor"

#define PIN_DHT    27
#define PIN_FLOAT  32
#define PIN_BTN    33
#define PIN_LED     2
#define N_ZONES     4

#define MAX_PULSE_MS   20000UL
#define SOAK_MS        (30UL * 60UL * 1000UL)
#define DAILY_CAP_ML     500
#define PUMP_ML_PER_SEC  18.0f

const uint8_t PROBE_PIN[N_ZONES] = { 34, 35, 36, 39 };
const uint8_t PUMP_PIN[N_ZONES]  = { 25, 26, 14, 12 };

/* Plant profiles: low and high moisture band, and pulse length. */
struct Profile { const char *name; uint8_t low, high; uint16_t pulseMs; };
const Profile PROFILES[] = {
  { "succulent", 15, 30,  4000 },
  { "herb",      30, 55,  8000 },
  { "houseplant",30, 55,  8000 },
  { "fern",      45, 70, 10000 },
  { "seedling",  40, 60,  3000 },
};

struct Zone {
  uint8_t  profile;
  uint16_t calDry, calWet;
  uint32_t pumpStart, requestedMs, soakUntil;
  uint16_t mlToday;
  float    lastPct, pctBeforeWater;
  bool     enabled;
} zones[N_ZONES];

DHT              dht(PIN_DHT, DHT22);
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

float airTemp = 25, airRh = 50;
int   lastCapDay = -1;

/* ── probes ─────────────────────────────────────────────────── */
uint16_t probeRaw(uint8_t z) {
  uint32_t acc = 0;
  for (int i = 0; i < 32; i++) { acc += analogRead(PROBE_PIN[z]); delay(2); }
  return acc / 32;
}

float probePercent(uint8_t z) {
  int span = (int)zones[z].calDry - (int)zones[z].calWet;
  if (span < 200) return -1;
  float pct = (zones[z].calDry - (float)probeRaw(z)) * 100.0f / span;
  return pct < 0 ? 0 : (pct > 100 ? 100 : pct);
}

/* ── evapotranspiration-adjusted threshold ──────────────────── */
float thresholdFor(uint8_t z) {
  const Profile &p = PROFILES[zones[z].profile];
  float t = p.low + 0.4f * (airTemp - 25.0f) - 0.05f * (airRh - 50.0f);
  if (t < p.low - 8) t = p.low - 8;          // clamp the compensation
  if (t > p.low + 8) t = p.low + 8;
  return t;
}

/* ── pump guard ─────────────────────────────────────────────── */
bool reservoirHasWater() { return digitalRead(PIN_FLOAT) == LOW; }

bool pumpRequest(uint8_t z, uint32_t ms) {
  Zone &Z = zones[z];
  if (!Z.enabled || Z.pumpStart) return false;
  if (millis() < Z.soakUntil)    return false;
  if (!reservoirHasWater())      return false;
  if (ms > MAX_PULSE_MS) ms = MAX_PULSE_MS;

  uint16_t add = (uint16_t)(ms / 1000.0f * PUMP_ML_PER_SEC);
  if (Z.mlToday + add > DAILY_CAP_ML) return false;

  Z.pctBeforeWater = Z.lastPct;
  Z.pumpStart   = millis();
  Z.requestedMs = ms;
  digitalWrite(PUMP_PIN[z], HIGH);
  digitalWrite(PIN_LED, HIGH);
  return true;
}

void publishEvent(uint8_t z, uint32_t ranMs, uint16_t ml, const char *why);

void pumpService() {
  bool any = false;
  for (uint8_t z = 0; z < N_ZONES; z++) {
    Zone &Z = zones[z];
    if (!Z.pumpStart) continue;
    any = true;

    uint32_t ran = millis() - Z.pumpStart;
    const char *why = nullptr;
    if (!reservoirHasWater())        why = "reservoir-empty";
    else if (ran >= MAX_PULSE_MS)    why = "hard-limit";
    else if (ran >= Z.requestedMs)   why = "complete";
    if (!why) continue;

    digitalWrite(PUMP_PIN[z], LOW);
    uint16_t ml = (uint16_t)(ran / 1000.0f * PUMP_ML_PER_SEC);
    Z.mlToday  += ml;
    Z.soakUntil = millis() + SOAK_MS;
    Z.pumpStart = 0;
    publishEvent(z, ran, ml, why);
  }
  if (!any) digitalWrite(PIN_LED, LOW);
}

/* ── MQTT ───────────────────────────────────────────────────── */
void publishEvent(uint8_t z, uint32_t ranMs, uint16_t ml, const char *why) {
  JsonDocument d;
  d["zone"]    = z;
  d["plant"]   = PROFILES[zones[z].profile].name;
  d["ran_ms"]  = ranMs;
  d["ml"]      = ml;
  d["ml_today"]= zones[z].mlToday;
  d["before"]  = roundf(zones[z].pctBeforeWater);
  d["reason"]  = why;
  char b[224]; size_t n = serializeJson(d, b, sizeof(b));
  mqtt.publish("home/irrigation/" DEVICE_ID "/event", (uint8_t *)b, n, false);
  Serial.printf("zone %d watered %u ms (%u mL) — %s\\n", z, (unsigned)ranMs, ml, why);
}

void publishState() {
  JsonDocument d;
  d["temp"] = roundf(airTemp * 10) / 10.0f;
  d["rh"]   = roundf(airRh);
  d["reservoir"] = reservoirHasWater() ? "ok" : "empty";
  JsonArray zs = d["zones"].to<JsonArray>();
  for (uint8_t z = 0; z < N_ZONES; z++) {
    JsonObject o = zs.add<JsonObject>();
    o["pct"]      = roundf(zones[z].lastPct);
    o["target"]   = roundf(thresholdFor(z));
    o["ml_today"] = zones[z].mlToday;
    o["plant"]    = PROFILES[zones[z].profile].name;
    o["soaking"]  = millis() < zones[z].soakUntil;
  }
  char b[512]; size_t n = serializeJson(d, b, sizeof(b));
  mqtt.publish("home/irrigation/" DEVICE_ID "/state", (uint8_t *)b, n, true);
}

void onMessage(char *topic, byte *payload, unsigned int len) {
  JsonDocument d;
  if (deserializeJson(d, payload, len)) return;
  int z = d["zone"] | -1;
  if (z < 0 || z >= N_ZONES) return;

  const char *action = d["action"] | "";
  if (!strcmp(action, "water")) {
    zones[z].soakUntil = 0;                        // manual overrides the soak
    pumpRequest(z, d["ms"] | 5000);
  } else if (!strcmp(action, "enable")) {
    zones[z].enabled = d["value"] | true;
  } else if (!strcmp(action, "profile")) {
    uint8_t p = d["value"] | 2;
    if (p < sizeof(PROFILES) / sizeof(PROFILES[0])) {
      zones[z].profile = p;
      char k[8]; snprintf(k, sizeof(k), "p%u", z);
      prefs.putUChar(k, p);
    }
  }
}

/* ── display ────────────────────────────────────────────────── */
void draw() {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(1);
  for (uint8_t z = 0; z < N_ZONES; z++) {
    oled.setCursor(0, z * 12);
    if (zones[z].lastPct < 0) oled.printf("Z%d  ---   probe fault", z + 1);
    else oled.printf("Z%d %3.0f%% / %2.0f%%  %s", z + 1, zones[z].lastPct,
                     thresholdFor(z),
                     zones[z].pumpStart ? "PUMP"
                     : millis() < zones[z].soakUntil ? "soak" : "");
  }
  oled.setCursor(0, 52);
  oled.printf("%.0fC %.0f%%RH  tank %s", airTemp, airRh,
              reservoirHasWater() ? "ok" : "EMPTY");
  oled.display();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_FLOAT, INPUT_PULLUP);
  pinMode(PIN_BTN, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);
  for (uint8_t z = 0; z < N_ZONES; z++) {
    pinMode(PUMP_PIN[z], OUTPUT);
    digitalWrite(PUMP_PIN[z], LOW);
    analogSetPinAttenuation(PROBE_PIN[z], ADC_11db);
  }

  dht.begin();
  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("irrig", false);
  for (uint8_t z = 0; z < N_ZONES; z++) {
    char kd[8], kw[8], kp[8];
    snprintf(kd, sizeof(kd), "d%u", z);
    snprintf(kw, sizeof(kw), "w%u", z);
    snprintf(kp, sizeof(kp), "p%u", z);
    zones[z].calDry  = prefs.getUShort(kd, 3180);
    zones[z].calWet  = prefs.getUShort(kw, 1420);
    zones[z].profile = prefs.getUChar(kp, 2);
    zones[z].enabled = true;
  }

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);
  mqtt.setBufferSize(768);

  Serial.println("Irrigation controller ready");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) {
    if (mqtt.connect(DEVICE_ID)) mqtt.subscribe("home/irrigation/" DEVICE_ID "/cmd");
  }
  mqtt.loop();
  pumpService();                      // must run every loop — it stops the pumps

  static uint32_t lastSlow = 0;
  if (millis() - lastSlow < 60000) {  // decide once a minute; soil is slow
    if (!digitalRead(PIN_BTN)) { pumpRequest(0, 3000); delay(400); }
    return;
  }
  lastSlow = millis();

  float t = dht.readTemperature(), h = dht.readHumidity();
  if (!isnan(t)) airTemp = t;
  if (!isnan(h)) airRh = h;

  time_t now = time(nullptr);
  struct tm tmv; localtime_r(&now, &tmv);
  if (tmv.tm_yday != lastCapDay) {                 // reset the daily cap
    lastCapDay = tmv.tm_yday;
    for (uint8_t z = 0; z < N_ZONES; z++) zones[z].mlToday = 0;
  }

  for (uint8_t z = 0; z < N_ZONES; z++) {
    zones[z].lastPct = probePercent(z);
    if (zones[z].lastPct < 0) continue;            // probe fault, do nothing
    if (zones[z].lastPct < thresholdFor(z))
      pumpRequest(z, PROFILES[zones[z].profile].pulseMs);
  }

  draw();
  publishState();
}`,
    explain: [
      { ref: 'pumpService() outside the one-minute gate', txt: 'The decision logic runs once a minute, but the pump guard runs every loop. If they shared a rate, a pump could over-run by up to 60 seconds — 1080 mL — which is a flooded pot.' },
      { ref: 'thresholdFor() clamped to ±8 %', txt: 'Evapotranspiration compensation is a useful nudge, not a licence to move the threshold arbitrarily. A DHT22 reading 45 °C because it is in direct sun should not push a fern into desert settings.' },
      { ref: 'zones[z].lastPct < 0 → continue', txt: 'A faulty probe means the controller does nothing for that zone rather than guessing. Doing nothing kills a plant slowly; guessing wrong floods it quickly.' },
      { ref: 'Manual water clears soakUntil', txt: 'A human explicitly asking for water overrides the soak timer — but not the hard pulse limit, the daily cap or the reservoir check. Those guards apply to every request regardless of source.' },
      { ref: 'ADC1 pins only (34–39)', txt: 'ADC2 is used by the Wi-Fi radio on the ESP32 and returns garbage whenever Wi-Fi is active. This is a well-known trap and it produces readings that look plausible and are random.' },
      { ref: 'pctBeforeWater recorded at request time', txt: 'Logging the moisture immediately before each watering, alongside the volume, gives you the data to tune pulse length empirically instead of by guesswork.' },
    ],
  }],

  config: [
    'Calibrate every probe individually before enabling automatic watering. Run the calibration sketch, record the dry and wet raw values, and confirm the span exceeds 400 counts.',
    'Choose a plant profile per zone. Succulents at 15–30 % and ferns at 45–70 % are genuinely different systems and sharing one threshold guarantees one of them suffers.',
    'Measure your pump\'s real flow rate at your real head height and set <code>PUMP_ML_PER_SEC</code> accordingly. The rated figure assumes zero head and is optimistic by 30–50 %.',
    'Set <code>DAILY_CAP_ML</code> from pot volume. A useful rule is one full re-wet per day maximum — roughly 25 % of the soil volume in millilitres.',
    'Set the soak period to at least 30 minutes. Shorter is the single most common cause of over-watering in these builds.',
  ],

  calibration: [
    { h: 'Two-point probe calibration', p: ['Record the raw ADC in dry air, then in soil you have saturated and allowed to drain for one minute. Store both. A span below 400 counts means the probe is faulty, not inserted to the marked depth, or has water in its electronics.'] },
    { h: 'Measure real pump flow', p: ['Run the pump into a measuring jug for exactly 30 seconds at the actual installed height. Divide by 30 for millilitres per second. Do this per zone if the drippers differ, since dripper restriction changes flow substantially.'] },
    { h: 'Tune pulse length empirically', p: ['Water once, then log the moisture reading every five minutes for an hour. If the reading overshoots the upper band, the pulse is too long; if it barely moves, too short. Two iterations gets it right for that pot.'] },
    { h: 'Verify the threshold against the plant', p: ['The numbers are a proxy. After a fortnight, check whether the plant actually looks right. Drooping between waterings means the lower threshold is too low; consistently soggy topsoil means it is too high.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Irrigation controller', sub: '4 zones' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'indoors',
      uplink: 'MQTT 1883', cloud: 'Local broker', cloudSub: 'Mosquitto + HA',
      clients: [{ name: 'Home Assistant', sub: 'per-zone card' }, { name: 'Grafana', sub: 'moisture history' }],
    },
    topics: [
      { t: 'home/irrigation/<id>/state', dir: 'device → broker (retained)', payload: 'JSON: temp, rh, reservoir, zones[] with pct, target, ml_today, plant, soaking' },
      { t: 'home/irrigation/<id>/event', dir: 'device → broker', payload: 'JSON: zone, plant, ran_ms, ml, before, reason' },
      { t: 'home/irrigation/<id>/cmd', dir: 'broker → device', payload: 'JSON: zone + action = water | enable | profile' },
    ],
    dashboard: [
      'The chart worth building is soil moisture with watering events marked. A healthy zone shows a sawtooth: a sharp rise on watering, then a gentle decline over two to five days. A zone that never drops is over-watered; one that falls off a cliff has a probe that has come loose.',
      'Plot millilitres per day against air temperature over a season and you get your plants\' actual water demand curve, which is a far better basis for a holiday watering schedule than guesswork.',
    ],
    security: [
      'The command topic can run pumps. Use broker authentication — an open topic means anyone on the network can flood your floor.',
      'Keep the hard guards in firmware, not in the automation layer. A Home Assistant automation with a bug should not be able to bypass the pulse limit.',
    ],
  },

  testing: [
    { step: 'Read a probe in dry air and in wet soil', expect: 'A difference of at least 400 ADC counts, with wet reading lower than dry.' },
    { step: 'Check calibrated percentages', expect: 'Dry air about 0 %, saturated soil about 100 %, a normally damp pot somewhere between 35 % and 60 %.' },
    { step: 'Trigger a manual water', expect: 'The pump runs for the profile pulse length and stops precisely, with the LED following it.' },
    { step: 'Lift the float switch to simulate an empty reservoir', expect: 'The pump stops mid-pulse and an event is published with reason <code>reservoir-empty</code>.' },
    { step: 'Disconnect a probe', expect: 'That zone displays "probe fault" and is skipped entirely — no watering, no guessing.' },
    { step: 'Request watering twice in quick succession', expect: 'The second request is refused because the soak timer is running.' },
    { step: 'Request repeatedly for a whole day', expect: 'Watering stops once the daily cap is reached and resumes after midnight.' },
    { step: 'Watch a full cycle over 48 hours', expect: 'A clear sawtooth in the moisture chart — sharp rise, slow decline — and no back-to-back waterings.' },
  ],

  troubleshoot: [
    {
      sym: 'Moisture readings jump wildly or read zero with Wi-Fi on',
      cause: 'The probe is on an ADC2 pin, which the ESP32 Wi-Fi radio takes exclusive use of.',
      fix: 'Move every probe to an ADC1 pin — GPIO 32 to 39. This failure is silent and produces readings that look like a noisy sensor rather than an unavailable peripheral, which makes it very hard to diagnose from symptoms alone.',
    },
    {
      sym: 'The probe corroded within a month',
      cause: 'It is a resistive probe, not a capacitive one.',
      fix: 'Look at the board: a capacitive probe has no exposed metal in the soil section, only solder mask over a wide flat pad. A resistive probe has two visible metal prongs. Resistive probes cannot be made to last — replace them.',
    },
    {
      sym: 'The plant is drowning despite sensible thresholds',
      cause: 'The soak period is too short, so the controller waters repeatedly before the water has redistributed.',
      fix: 'Raise the soak to at least 30 minutes, and verify the soak timer starts when the pump <em>stops</em>. Also check the probe is at root depth rather than near the surface, where it dries fastest and misrepresents the root zone.',
    },
    {
      sym: 'The pump ran twice then stopped working',
      cause: 'No flyback diode across the pump, so the back-EMF destroyed the MOSFET.',
      fix: 'Fit a 1N4007 across the pump terminals, cathode to the positive side. Replace the MOSFET. If the MOSFET now stays on permanently, it has failed short — which is exactly why the reservoir float switch matters as an independent stop.',
    },
    {
      sym: 'The MOSFET gets hot even at low current',
      cause: 'A non-logic-level MOSFET driven from 3.3 V, operating in its linear region.',
      fix: 'Use an IRLZ44N or similar logic-level part. A standard IRF540 needs about 10 V on the gate to reach its rated on-resistance; at 3.3 V it behaves as a resistor and dissipates the difference as heat.',
    },
    {
      sym: 'One zone waters far more than another with the same profile',
      cause: 'Different pot size, different soil, or dripper flow imbalance.',
      fix: 'Calibrate each probe separately (they are not interchangeable) and measure each zone\'s actual flow rate. Adjustable drippers vary by more than 2:1 out of the box.',
    },
  ],

  perf: [
    'Decide once a minute, not once a loop. Soil moisture changes over hours; sampling faster adds ADC noise and nothing else.',
    'Average 32 ADC samples per probe. The ESP32 ADC is noisy enough that a single reading can move a decision across a threshold.',
    'Keep the pump guard in the fast loop and the decision logic in the slow one. Mixing the two rates is how over-runs happen.',
  ],

  safety: [
    'Water and mains do not mix. Keep the controller and its supply above the maximum possible water level, and site the reservoir where an overflow drains somewhere harmless.',
    'Assume a tube will come off eventually. Stand every pot in a tray and route tubing so a failure spills into it.',
    'Never run a diaphragm pump dry — it destroys the membrane within minutes. The float switch is protecting the pump as much as the plant.',
  ],

  maintenance: [
    'Flush the tubing and drippers every three months; algae and mineral deposits block adjustable drippers first.',
    'Wipe the probes and check the seal at the coating line whenever you repot.',
    'Refill the reservoir before it triggers the float switch — repeated dry-run stops shorten pump life.',
  ],

  future: [
    'Add a <b>flow sensor</b> in the delivery line so the controller measures the water it actually delivered rather than estimating from run time. That catches blocked drippers and burst tubes immediately.',
    'Add a <b>load cell under the pot</b>. Pot weight is the single most accurate proxy for total water content, and it is immune to probe placement and soil variation.',
    'Add <b>light measurement</b> and use it in the evapotranspiration model — light drives transpiration more strongly than temperature does.',
    'Add a <b>nutrient dosing pump</b> for hydroponics or fertigation, with its own volume cap and interlock.',
    'Add <b>solar and battery</b> so a balcony system needs no mains at all.',
  ],

  faq: [
    { q: 'Resistive or capacitive probe — does it really matter?', a: 'Yes, decisively. A resistive probe passes DC through the soil, which electrolyses the electrodes. They visibly corrode in two to four weeks, and as they corrode the readings drift drier, so the controller waters more, which accelerates the corrosion. It is a failure spiral. A capacitive probe has no metal in contact with soil and lasts years. The price difference is about ₹100.' },
    { q: 'Why the 30-minute soak? Cannot I just water less at a time?', a: 'Shorter pulses help but do not solve it, because the problem is measurement, not volume. Immediately after watering the probe still reads dry at root depth regardless of how much you applied, so a controller without a soak period will always water again. The soak is what makes each successive reading informative.' },
    { q: 'Can one pump serve four zones?', a: 'Only with solenoid valves per zone, and then the valve becomes the thing that can fail open. Four small pumps at ₹160 each is cheaper than four valves and has a better failure mode — a stuck pump floods one pot, a stuck valve empties the whole reservoir into it.' },
    { q: 'What moisture percentage should I aim for?', a: 'There is no universal number, which is why the profiles exist. As a starting point: succulents 15–30 %, most houseplants 30–55 %, ferns and moisture-lovers 45–70 %, seedlings 40–60 %. Then adjust based on how the plant actually looks after a fortnight — the sensor is a proxy for the plant, not the other way round.' },
    { q: 'Will this work outdoors?', a: 'The electronics will if you seal them properly, but the control logic needs rain compensation or you will water in a downpour. Add a rain sensor or pull a forecast, and expect the calibration to shift as outdoor soil compacts and its organic content changes.' },
    { q: 'How do I water while on holiday for a month?', a: 'Size the reservoir from measured consumption, not estimation. Log millilitres per day for two weeks first, multiply by your trip length and add 50 %. A 5 L reservoir typically covers four houseplants for three to four weeks in mild weather and about half that in summer.' },
  ],

  refs: [
    { t: 'DFRobot capacitive soil moisture sensor v2.0 — wiki and calibration guidance', u: 'https://wiki.dfrobot.com/Capacitive_Soil_Moisture_Sensor_SKU_SEN0193', s: 'DFRobot' },
    { t: 'ESP32 ADC — ADC1 versus ADC2 and the Wi-Fi conflict', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html', s: 'Espressif' },
    { t: 'Soil water content measurement methods — a review of dielectric techniques', u: 'https://www.sciencedirect.com/topics/earth-and-planetary-sciences/soil-water-content', s: 'ScienceDirect' },
    { t: 'FAO Irrigation and Drainage Paper 56 — crop evapotranspiration', u: 'https://www.fao.org/4/x0490e/x0490e00.htm', s: 'FAO' },
    { t: 'IRLZ44N logic-level N-channel MOSFET — datasheet', u: 'https://www.infineon.com/dgdl/irlz44n.pdf', s: 'Infineon' },
    { t: 'Root rot and over-watering in container plants', u: 'https://extension.psu.edu/houseplant-problems', s: 'Penn State Extension' },
  ],

  images: ['sensor', 'esp32', 'farm'],
  imageCaptions: [
    'A sensor breakout module. A capacitive soil probe has no exposed metal at all in the soil section, which is what makes it survive.',
    'An ESP32 development board. Its ADC1 pins are the ones usable for analogue probes while Wi-Fi is running.',
    'A field irrigation system. The same closed loop — measure, decide, deliver, measure again — scales from a windowsill to a farm.',
  ],
},

/* ── 012 · Sleep Environment Optimizer ───────────────────────────── */
{
  id: '012',
  domainKey: 'iot',
  emoji: '😴',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '10–15 hours',
  iso8601: 'PT12H',
  tagline: 'A bedroom controller that manages the four environmental variables sleep research actually supports — temperature, light, sound and CO₂ — and correlates each night against how you slept.',

  overview: [
    'Sleep advice is full of confident claims with thin evidence. This project deliberately targets only the four environmental factors with reasonably solid experimental support: <b>ambient temperature</b>, which affects sleep onset and slow-wave sleep through the body\'s core temperature drop; <b>light exposure</b>, particularly blue light suppressing melatonin; <b>acoustic disturbance</b>, where intermittent noise fragments sleep even when it does not wake you; and <b>CO₂ accumulation</b> in a closed bedroom, which is associated with reduced sleep quality and next-day performance.',
    'The interesting engineering problem is not measuring these — that is straightforward — but acting on them without becoming a disturbance itself. A fan that switches on abruptly at 3 a.m. wakes people. A display that glows is itself light pollution. Every actuator in this design is therefore <b>ramped over minutes</b>, and every indicator is either off or deep red below a configurable illuminance.',
    'The temperature strategy follows the physiology rather than a fixed setpoint. Core body temperature naturally falls by around 1 °C during the night, reaching its minimum roughly two hours before habitual wake time, and a cooler room facilitates that drop. The controller therefore runs a <b>temperature ramp</b>: comfortable at bedtime, coolest in the early hours, rising slightly before wake time — which is a much better match to what the body is doing than holding one number all night.',
    'Finally, the system logs. Every night produces a record of the four variables at one-minute resolution, plus movement from an accelerometer under the mattress as a crude sleep-quality proxy. After a few weeks that data tells you something specific about your own room — for example, that your sleep fragments consistently when CO₂ passes 1800 ppm, or that the traffic peak at 05:30 is what wakes you rather than your alarm.',
  ],

  does: [
    'Measures bedroom temperature, humidity, illuminance, sound level and CO₂ once a minute all night.',
    'Ramps a fan or AC setpoint through the night following the natural core-temperature curve.',
    'Fades a sunrise light from deep red to full brightness over 30 minutes before the alarm.',
    'Generates pink noise through a small speaker, level-matched to measured room noise.',
    'Alerts on CO₂ crossing a ventilation threshold — silently, by logging, not by beeping at 2 a.m.',
    'Detects movement with an under-mattress accelerometer as a restlessness proxy.',
    'Produces a nightly summary correlating environment against restlessness.',
  ],

  features: [
    '<b>Physiological temperature ramp</b> rather than a fixed setpoint, matched to the core-temperature curve.',
    '<b>All actuator changes ramped over minutes</b>, so nothing in the system can itself wake you.',
    '<b>Light-aware indicators</b> — every LED is off or deep red below 5 lx.',
    '<b>Pink noise generation</b> with level matching to measured ambient sound.',
    '<b>Sunrise simulation</b> using a 30-minute warm-to-cool brightness curve.',
    '<b>Under-mattress accelerometer</b> for movement-based restlessness scoring.',
    '<b>Per-night logging</b> at one-minute resolution to InfluxDB.',
    '<b>Correlation report</b> pairing each night\'s environment against its restlessness score.',
  ],

  applications: [
    { t: 'Personal sleep optimisation', d: 'The core case — finding out which of the four variables actually matters in your specific room.' },
    { t: 'Shared bedrooms', d: 'Two people with different temperature preferences at least get data instead of an argument.' },
    { t: 'Infant and child rooms', d: 'Temperature and CO₂ monitoring with silent logging rather than audible alerts.' },
    { t: 'Shift workers', d: 'Daytime sleep needs aggressive light control, and blackout effectiveness is measurable rather than assumed.' },
    { t: 'Student accommodation and hostels', d: 'Documenting noise and ventilation conditions gives a factual basis for a complaint.' },
    { t: 'Sleep research teaching', d: 'A complete, honest instrumentation exercise including the limits of what a consumer sensor can conclude.' },
  ],

  skills: [
    'Arduino C++ with non-blocking scheduling',
    'I²C and UART sensor reading',
    'PWM and gradual ramping of outputs',
    'Basic understanding of audio level in dB and A-weighting',
    'MQTT and time-series logging',
  ],

  parts: ['esp32', 'sht31', 'bh1750', 'mhz19', 'inmp441', 'adxl345', 'neopixel', 'relay1', 'buck', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'Small full-range speaker + PAM8403 amplifier', spec: '4 Ω 3 W, class-D amp', qty: 1, price: 260, note: 'For pink noise. A piezo buzzer is not suitable — it has no low-frequency content.' },
    { name: 'Warm-white + cool-white LED strip 0.5 m', spec: '2700 K and 5000 K, 12 V', qty: 1, price: 320, note: 'Two channels give true colour-temperature control for sunrise simulation.' },
    { name: 'MOSFET dimmer pair (IRLZ44N)', spec: 'Logic level, one per LED channel', qty: 2, price: 60 },
  ],
  cost: '₹8,400 – ₹10,200',
  libs: ['wifi', 'pubsub', 'arduinojson', 'bh1750lib', 'ssd1306', 'preferences', 'ntp', 'fastled'],

  pins: {
    left: [
      { dev: 'SHT31 temperature / humidity', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x44' },
      { dev: 'BH1750 illuminance', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x23' },
      { dev: 'ADXL345 under mattress', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x53' },
      { dev: 'MH-Z19B CO₂', devPin: 'TX / RX', pin: 'GPIO 16 / 17', sig: 'UART2 9600' },
      { dev: 'INMP441 microphone', devPin: 'BCLK / WS / SD', pin: 'GPIO 14 / 15 / 32', sig: 'I²S, level only' },
    ],
    right: [
      { dev: 'Warm white LED channel', devPin: 'MOSFET gate', pin: 'GPIO 25', sig: 'LEDC PWM 12-bit' },
      { dev: 'Cool white LED channel', devPin: 'MOSFET gate', pin: 'GPIO 26', sig: 'LEDC PWM 12-bit' },
      { dev: 'PAM8403 audio', devPin: 'IN', pin: 'GPIO 27 (DAC2)', sig: 'Pink noise output' },
      { dev: 'Relay → fan / AC', devPin: 'IN', pin: 'GPIO 33', sig: 'Ramped duty cycle' },
    ],
  },
  wiringNotes: [
    'The MH-Z19B is the largest heat source in the enclosure. Keep the SHT31 at least 80 mm away and on a separate small board, or your bedroom temperature reading will be two degrees high.',
    'The accelerometer goes <b>under the mattress</b>, not on the bed frame. On the frame it picks up building vibration and footsteps in the corridor; under the mattress it picks up the sleeper.',
    'Use <b>12-bit LEDC PWM</b> for the LED channels. At 8-bit resolution the lowest usable step is visibly bright in a dark room, which defeats the whole point of a gentle sunrise.',
    'Set the LEDC PWM frequency above 20 kHz. Below that, cheap LED drivers can produce an audible whine — in a bedroom, at 2 a.m., that is a disaster.',
    'The microphone is used for level measurement only, and no audio is recorded or transmitted. Wire it so that is verifiably true, and say so on the enclosure if anyone else sleeps in the room.',
    'Use a mains-rated relay only if you are switching a mains fan. For a 12 V fan, a logic-level MOSFET is quieter, has no clicking, and allows genuine speed ramping.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'SHT31 + BH1750', sub: 'T / RH / lux' }, { name: 'MH-Z19B', sub: 'CO₂' }, { name: 'INMP441 + ADXL345', sub: 'sound / motion' }] },
      { label: 'Model', edge: '1 min samples', blocks: [{ name: 'Sleep phase clock', sub: 'bed → wake', highlight: true }, { name: 'Restlessness score', sub: 'motion events' }] },
      { label: 'Control', edge: 'target curve', blocks: [{ name: 'Temperature ramp', sub: 'fan duty', highlight: true }, { name: 'Light + noise', sub: 'ramped only' }] },
      { label: 'Record', edge: 'all values', blocks: [{ name: 'MQTT → InfluxDB', sub: '1 min resolution' }, { name: 'Nightly report', sub: 'correlations' }] },
    ],
  },

  flow: [
    { t: 'Boot: load schedule and calibration', k: 'start' },
    { t: 'Sample all sensors every 60 s', k: 'proc' },
    { t: 'Within the sleep window?', k: 'dec', yes: 'yes', no: 'idle logging only', back: 1 },
    { t: 'Compute target temperature from the ramp', k: 'proc' },
    { t: 'Adjust fan duty by ≤ 5 % per minute', k: 'io' },
    { t: 'Within 30 min of wake time?', k: 'dec', yes: 'run sunrise fade', no: 'keep dark', back: 1 },
    { t: 'Log sample, update restlessness', k: 'io' },
    { t: 'At wake: publish the nightly summary', k: 'end' },
  ],

  principle: [
    'The <b>temperature strategy</b> follows a well-established physiological fact: core body temperature falls by roughly 0.5–1.0 °C during sleep, reaching its nadir about two hours before habitual waking. Sleep onset is facilitated by that drop, and the drop happens through peripheral vasodilation — heat leaving the body through the hands and feet. A room that is too warm impedes it. Rather than holding one setpoint, the controller follows a curve: around 20–21 °C at bedtime, falling to 18–19 °C in the early hours, rising back before wake. The absolute numbers are individual; the shape is not.',
    '<b>Light</b> matters most in two windows. Blue-rich light in the two hours before bed suppresses melatonin and delays sleep onset, which is why the room lighting fades warm and dim in the evening. And light in the last thirty minutes before waking advances the circadian phase and reduces sleep inertia — that grogginess on waking — which is what the sunrise simulation targets. Between those windows, darkness is the goal, which is why every indicator on the device goes dark below 5 lx.',
    '<b>Sound</b> disturbs sleep through intermittency more than through absolute level. A steady 45 dB is far less disruptive than a quiet room punctuated by a 55 dB door. Pink noise works by raising the noise floor so intermittent events are less salient — the delta between background and disturbance shrinks. Pink rather than white is used because its power falls at 3 dB per octave, which sounds like rainfall rather than hiss and matches the ear\'s frequency weighting better. The level is matched to measured ambient noise rather than fixed, because a masking sound louder than what it masks is itself a disturbance.',
    '<b>CO₂</b> in a closed bedroom routinely reaches 2000–3000 ppm overnight, and several studies associate that range with poorer subjective sleep quality and reduced next-day performance. The controller measures it but deliberately does not act loudly on it — waking someone to tell them the air is stale is self-defeating. It logs, and it reports in the morning, and it can trigger a silent trickle vent if you have one.',
    'The <b>restlessness score</b> deserves an honest caveat. An accelerometer under a mattress detects gross body movement, and movement correlates with sleep stage — you move more in light sleep and almost not at all in REM atonia. It is not polysomnography and it cannot stage sleep. What it gives is a repeatable, self-consistent number that can be correlated against environmental variables from the same device, which is exactly what you need to answer "does my room being cooler actually help me".',
  ],

  equations: [
    { t: 'Overnight temperature ramp', eq: 'Given bedtime B and wake time W (hours), fraction f = (t − B)/(W − B):\n\n  T_target(f) = T_bed − ΔT × sin(π × f^0.8)\n\nWith T_bed = 21 °C, ΔT = 2.5 °C:\n  f = 0.00 (bedtime)   → 21.0 °C\n  f = 0.25             → 19.2 °C\n  f = 0.50             → 18.5 °C\n  f = 0.75 (nadir ≈)   → 18.7 °C\n  f = 1.00 (wake)      → 21.0 °C\n\nThe f^0.8 exponent shifts the minimum slightly later\nthan the midpoint, matching the observed core\ntemperature nadir about two hours before waking.' },
    { t: 'Sound pressure level from I²S samples', eq: 'RMS of N samples, normalised to full scale:\n\n  L = 20 · log10(rms / 32768) + K\n\nK is the calibration offset: measure a known\nsource with a reference meter and solve for K.\n\nTypical INMP441 at 94 dB SPL (1 kHz, 1 Pa):\n  rms ≈ 1640 counts → 20·log10(1640/32768) = −26 dBFS\n  K = 94 − (−26) = 120\n\nSo  SPL ≈ dBFS + 120  for this microphone.\nQuiet bedroom ≈ 28 dB SPL, traffic peak ≈ 52 dB.' },
    { t: 'Pink noise from white', eq: 'Pink noise has power spectral density ∝ 1/f (−3 dB/octave).\n\nVoss-McCartney approximation with 5 octave rows:\n  each row updates at half the rate of the previous\n  output = sum of all rows\n\n  row 0 updates every sample\n  row 1 every 2 samples\n  row 2 every 4 samples ... row 4 every 16\n\nThis is far cheaper than filtering white noise and\nsounds indistinguishable for masking purposes.' },
  ],

  code: [{
    file: 'sleep-optimizer.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Sleep Environment Optimizer — ESP32

   Measures temperature, humidity, illuminance, CO2, sound level and
   body movement once a minute through the night. Every actuator is
   ramped slowly enough that the system itself can never be the thing
   that wakes you.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_ADXL345_U.h>
#include <driver/i2s.h>
#include <Preferences.h>
#include <time.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "sleep-master"

#define PIN_LED_WARM 25
#define PIN_LED_COOL 26
#define PIN_FAN      33
#define I2S_BCLK 14
#define I2S_LRCL 15
#define I2S_DOUT 32

#define BED_HOUR    22.5f      // 22:30
#define WAKE_HOUR    6.75f     // 06:45
#define T_BED       21.0f
#define T_DROP       2.5f
#define SUNRISE_MIN 30
#define DARK_LUX     5.0f
#define CO2_NOTE   1800

BH1750                       lux;
Adafruit_SHT31               sht = Adafruit_SHT31();
Adafruit_ADXL345_Unified     accel(12345);
HardwareSerial               co2Serial(2);
WiFiClient                   net;
PubSubClient                 mqtt(net);
Preferences                  prefs;

float tempC = 22, rh = 50, luxNow = 0, spl = 30;
int   co2 = 500;
float fanDuty = 0, warmDuty = 0, coolDuty = 0;
uint16_t movementEvents = 0, minutesLogged = 0;
float accelBaseline = 0;

/* ── clock helpers ──────────────────────────────────────────── */
float hourNow() {
  time_t t = time(nullptr); struct tm tm; localtime_r(&t, &tm);
  return tm.tm_hour + tm.tm_min / 60.0f;
}

bool inSleepWindow(float h) {
  return BED_HOUR > WAKE_HOUR ? (h >= BED_HOUR || h < WAKE_HOUR)
                              : (h >= BED_HOUR && h < WAKE_HOUR);
}

// 0.0 at bedtime, 1.0 at wake time, wrapping past midnight.
float sleepFraction(float h) {
  float span = BED_HOUR > WAKE_HOUR ? (24 - BED_HOUR + WAKE_HOUR)
                                    : (WAKE_HOUR - BED_HOUR);
  float el = h >= BED_HOUR ? h - BED_HOUR : (24 - BED_HOUR + h);
  float f = el / span;
  return f < 0 ? 0 : (f > 1 ? 1 : f);
}

/* ── sound level ────────────────────────────────────────────── */
float readSpl() {
  static int32_t raw[256];
  size_t got;
  i2s_read(I2S_NUM_0, raw, sizeof(raw), &got, 100 / portTICK_PERIOD_MS);
  int n = got / sizeof(int32_t);
  if (!n) return spl;

  double acc = 0;
  for (int i = 0; i < n; i++) { int16_t s = raw[i] >> 11; acc += (double)s * s; }
  float rms = sqrtf(acc / n);
  float dbfs = 20.0f * log10f(rms / 32768.0f + 1e-9f);
  return dbfs + 120.0f;                 // calibration offset, see equations
}

/* ── movement ───────────────────────────────────────────────── */
bool movementDetected() {
  sensors_event_t e;
  accel.getEvent(&e);
  float mag = sqrtf(e.acceleration.x * e.acceleration.x +
                    e.acceleration.y * e.acceleration.y +
                    e.acceleration.z * e.acceleration.z);
  if (accelBaseline == 0) { accelBaseline = mag; return false; }
  bool moved = fabsf(mag - accelBaseline) > 0.35f;      // m/s^2 threshold
  accelBaseline = 0.98f * accelBaseline + 0.02f * mag;  // slow drift tracking
  return moved;
}

/* ── CO2 ────────────────────────────────────────────────────── */
int readCo2() {
  uint8_t cmd[9] = { 0xFF, 0x01, 0x86, 0, 0, 0, 0, 0, 0 };
  uint8_t s = 0; for (int i = 1; i < 8; i++) s += cmd[i];
  cmd[8] = 0xFF - s + 1;
  while (co2Serial.available()) co2Serial.read();
  co2Serial.write(cmd, 9);

  uint8_t r[9]; int got = 0; uint32_t t0 = millis();
  while (got < 9 && millis() - t0 < 300)
    if (co2Serial.available()) r[got++] = co2Serial.read();
  if (got < 9 || r[0] != 0xFF || r[1] != 0x86) return co2;
  return r[2] * 256 + r[3];
}

/* ── ramped actuators ───────────────────────────────────────── */
void setDuty(uint8_t channel, float &current, float target, float maxStep) {
  if (target > current + maxStep) current += maxStep;
  else if (target < current - maxStep) current -= maxStep;
  else current = target;
  if (current < 0) current = 0;
  if (current > 1) current = 1;
  ledcWrite(channel, (uint32_t)(current * 4095));      // 12-bit
}

void climateService(float f) {
  float target = T_BED - T_DROP * sinf((float)M_PI * powf(f, 0.8f));
  float err = tempC - target;
  float want = err <= 0 ? 0 : (err > 2.0f ? 1.0f : err / 2.0f);
  setDuty(2, fanDuty, want, 0.05f);                     // max 5 % per minute
}

void lightService(float h, float f) {
  bool sunrise = false;
  float wakeIn = WAKE_HOUR - h;
  if (wakeIn < 0) wakeIn += 24;
  if (wakeIn * 60 <= SUNRISE_MIN && inSleepWindow(h)) sunrise = true;

  if (!sunrise) {
    setDuty(0, warmDuty, 0, 0.02f);
    setDuty(1, coolDuty, 0, 0.02f);
    return;
  }
  // 0 at start of the window, 1 at wake time.
  float p = 1.0f - (wakeIn * 60.0f / SUNRISE_MIN);
  // Warm leads, cool follows — a real sunrise starts red.
  setDuty(0, warmDuty, powf(p, 1.4f), 0.05f);
  setDuty(1, coolDuty, p < 0.4f ? 0 : powf((p - 0.4f) / 0.6f, 1.8f), 0.05f);
}

/* ── logging ────────────────────────────────────────────────── */
void publishSample() {
  JsonDocument d;
  d["temp"] = roundf(tempC * 10) / 10.0f;
  d["rh"]   = roundf(rh);
  d["lux"]  = roundf(luxNow * 10) / 10.0f;
  d["co2"]  = co2;
  d["spl"]  = roundf(spl * 10) / 10.0f;
  d["fan"]  = roundf(fanDuty * 100);
  d["warm"] = roundf(warmDuty * 100);
  d["cool"] = roundf(coolDuty * 100);
  d["moves"]= movementEvents;
  char b[256]; size_t n = serializeJson(d, b, sizeof(b));
  mqtt.publish("home/sleep/" DEVICE_ID "/sample", (uint8_t *)b, n, false);
}

void publishNightSummary() {
  JsonDocument d;
  d["minutes"]      = minutesLogged;
  d["movements"]    = movementEvents;
  d["restlessness"] = minutesLogged ? roundf(movementEvents * 1000.0f / minutesLogged) / 10.0f : 0;
  d["co2_peak"]     = co2;
  d["temp_end"]     = roundf(tempC * 10) / 10.0f;
  char b[224]; size_t n = serializeJson(d, b, sizeof(b));
  mqtt.publish("home/sleep/" DEVICE_ID "/night", (uint8_t *)b, n, true);
  Serial.printf("Night: %u min, %u movements, restlessness %.1f/hr\\n",
                minutesLogged, movementEvents,
                minutesLogged ? movementEvents * 60.0f / minutesLogged : 0);
  movementEvents = 0;
  minutesLogged = 0;
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  sht.begin(0x44);
  lux.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  accel.begin(0x53);
  accel.setRange(ADXL345_RANGE_2_G);
  co2Serial.begin(9600, SERIAL_8N1, 16, 17);

  // 12-bit PWM above audible range: LED whine at 2 a.m. is unacceptable.
  ledcSetup(0, 25000, 12); ledcAttachPin(PIN_LED_WARM, 0);
  ledcSetup(1, 25000, 12); ledcAttachPin(PIN_LED_COOL, 1);
  ledcSetup(2, 25000, 12); ledcAttachPin(PIN_FAN, 2);

  i2s_config_t cfg = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = 0, .dma_buf_count = 4, .dma_buf_len = 256, .use_apll = true
  };
  i2s_pin_config_t pins = { .bck_io_num = I2S_BCLK, .ws_io_num = I2S_LRCL,
                            .data_out_num = I2S_PIN_NO_CHANGE, .data_in_num = I2S_DOUT };
  i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pins);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);

  Serial.println("Sleep optimizer running");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect(DEVICE_ID);
  mqtt.loop();

  // Movement is polled fast; everything else once a minute.
  static uint32_t lastMove = 0;
  if (millis() - lastMove > 250) {
    lastMove = millis();
    if (movementDetected()) movementEvents++;
  }

  static uint32_t lastMinute = 0;
  static bool wasAsleepWindow = false;
  if (millis() - lastMinute < 60000) return;
  lastMinute = millis();

  tempC  = sht.readTemperature();
  rh     = sht.readHumidity();
  luxNow = lux.readLightLevel();
  co2    = readCo2();
  spl    = readSpl();

  float h = hourNow();
  bool inWindow = inSleepWindow(h);

  if (inWindow) {
    float f = sleepFraction(h);
    climateService(f);
    lightService(h, f);
    minutesLogged++;
    publishSample();
    if (co2 > CO2_NOTE) mqtt.publish("home/sleep/" DEVICE_ID "/note", "co2-high", false);
  } else {
    setDuty(2, fanDuty, 0, 0.05f);
    setDuty(0, warmDuty, 0, 0.05f);
    setDuty(1, coolDuty, 0, 0.05f);
  }

  if (wasAsleepWindow && !inWindow) publishNightSummary();
  wasAsleepWindow = inWindow;
}`,
    explain: [
      { ref: 'setDuty maxStep 0.05 per minute', txt: 'The fan can only change by 5 % of full duty per minute, so going from off to full takes twenty minutes. That is deliberate — an abrupt fan change is exactly the kind of stimulus that fragments sleep.' },
      { ref: 'ledcSetup(..., 25000, 12)', txt: '25 kHz is above the audible range and 12-bit gives 4096 steps. Both matter: an audible PWM whine in a bedroom is unacceptable, and 8-bit resolution makes the dimmest usable step far too bright for a dark room.' },
      { ref: 'powf(f, 0.8f) in the temperature ramp', txt: 'The exponent shifts the coolest point later than the midpoint of the night, matching the observed core-temperature nadir roughly two hours before habitual waking.' },
      { ref: 'Warm leads, cool follows in lightService', txt: 'A real sunrise starts deep red and adds blue later. Bringing both channels up together produces a flat white fade that reads as a lamp switching on rather than a dawn.' },
      { ref: 'accelBaseline slow tracking', txt: 'The baseline follows the accelerometer\'s DC orientation with a long time constant, so the detector responds to movement rather than to how the sensor happens to be lying — which changes every time the mattress is disturbed.' },
      { ref: 'co2-high published, never sounded', txt: 'Waking someone to tell them the air is stale defeats the purpose. The note is logged and surfaced in the morning report, not announced at 2 a.m.' },
      { ref: 'publishNightSummary on window exit', txt: 'The nightly aggregate is what makes the data actionable. A per-minute stream alone is a chart; a restlessness number per night is something you can correlate against a change you made.' },
    ],
  }],

  config: [
    'Set <code>BED_HOUR</code> and <code>WAKE_HOUR</code> to your actual habitual times. The temperature ramp and sunrise are both anchored to them.',
    'Set <code>T_BED</code> and <code>T_DROP</code>. Start at 21 °C and 2.5 °C, then adjust from your own restlessness data over a fortnight rather than from a recommendation.',
    'Calibrate the sound offset. The value of 120 in <code>readSpl()</code> is for an INMP441; measure against a phone SPL app or a reference meter and solve for your own constant.',
    'Disable the MH-Z19B automatic baseline correction if the bedroom never reaches outdoor CO₂ — which it usually does not. See the air quality project for the command.',
    'Set <code>DARK_LUX</code> and verify every indicator on the device is genuinely off below it. Walk into the room at 3 a.m. and look — if you can see the device, it is too bright.',
  ],

  calibration: [
    { h: 'Calibrate the microphone', p: ['Play a steady tone and measure with a reference SPL meter or a calibrated phone app at the same position. Adjust the offset constant until they agree. Absolute accuracy is not critical here — repeatability is, since you are comparing nights against each other.'] },
    { h: 'Establish the movement threshold', p: ['Log raw accelerometer magnitude for one night at the 0.35 threshold and count events. A typical adult produces 20–60 movement events per night. If you are logging hundreds, the threshold is too low or the sensor is on the frame rather than under the mattress.'] },
    { h: 'Verify the sunrise curve in a dark room', p: ['Trigger the sunrise manually and watch the full thirty minutes. It should be barely perceptible for the first five minutes and clearly bright at the end. If it jumps visibly at any point, increase the PWM resolution or reduce the ramp step.'] },
    { h: 'Check the temperature sensor is not self-heating', p: ['Compare against a reference thermometer after two hours. If the SHT31 reads high, it is too close to the CO₂ sensor or the regulator — move it before applying an offset.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Bedroom node', sub: 'ESP32' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'IoT VLAN',
      uplink: 'MQTT 1883', cloud: 'InfluxDB + Grafana', cloudSub: 'local only',
      clients: [{ name: 'Grafana', sub: 'night charts' }, { name: 'Morning report', sub: 'phone' }],
    },
    topics: [
      { t: 'home/sleep/<id>/sample', dir: 'device → broker', payload: 'JSON per minute: temp, rh, lux, co2, spl, fan, warm, cool, moves' },
      { t: 'home/sleep/<id>/night', dir: 'device → broker (retained)', payload: 'JSON: minutes, movements, restlessness, co2_peak, temp_end' },
      { t: 'home/sleep/<id>/note', dir: 'device → broker', payload: 'Silent advisory strings such as "co2-high"' },
    ],
    dashboard: [
      'The chart that pays for the project is a single night with all five variables overlaid and movement events as markers. Clusters of movement lining up with a CO₂ threshold crossing, or with the 05:30 traffic peak, is the kind of finding you cannot get any other way.',
      'The second chart is a scatter of nightly restlessness against mean overnight temperature across thirty nights. If there is a relationship in your room, it will be visible; if there is not, that is also worth knowing before you buy an air conditioner.',
    ],
    security: [
      'This device knows when you are asleep and when the bedroom is empty. Keep it entirely on your own broker and off any cloud service.',
      'The microphone measures level only and never records or transmits audio. Verify that in the code before trusting it, and be able to show anyone else who sleeps in the room.',
      'Use broker authentication and put the node on an IoT VLAN.',
    ],
  },

  testing: [
    { step: 'Read all five sensors at once', expect: 'Plausible values: 18–26 °C, 30–70 %RH, under 5 lx in a dark room, 500–2500 ppm CO₂, 25–40 dB SPL.' },
    { step: 'Trigger the fan target from off to full', expect: 'Duty rises by no more than 5 % per minute, reaching full after about twenty minutes — never a step change.' },
    { step: 'Run the sunrise manually', expect: 'Deep red at the start, warm white at the midpoint, full bright at the end, with no perceptible steps.' },
    { step: 'Stand in the dark room with the device running', expect: 'Nothing visible. Any indicator LED above 5 lx is a design failure, not a feature.' },
    { step: 'Clap once', expect: 'The SPL reading rises and settles back within a few seconds.' },
    { step: 'Move on the bed', expect: 'The movement counter increments. Walking past the bed should not increment it — if it does, the accelerometer is on the frame.' },
    { step: 'Watch one full night', expect: 'Temperature follows the curve, CO₂ rises steadily, and a night summary is published at wake time.' },
    { step: 'Compare morning CO₂ with the door open versus closed', expect: 'A difference of well over 1000 ppm — the single most surprising number this project produces.' },
  ],

  troubleshoot: [
    {
      sym: 'The fan or LEDs make a faint high-pitched whine',
      cause: 'PWM frequency inside the audible range.',
      fix: 'Set the LEDC frequency to 25 kHz or above. In a bedroom this is not a cosmetic issue — a 4 kHz whine at 2 a.m. is worse than no controller at all.',
    },
    {
      sym: 'The sunrise jumps visibly at the start',
      cause: '8-bit PWM resolution, where the first non-zero step is already too bright for a dark-adapted eye.',
      fix: 'Use 12-bit resolution and apply a gamma curve. The lowest visible step should be genuinely dim, which needs both the resolution and the curve.',
    },
    {
      sym: 'Movement events number in the hundreds per night',
      cause: 'The accelerometer is picking up the building, not the sleeper.',
      fix: 'Move it under the mattress near the torso, not on the frame or the floor. Raise the threshold from 0.35 and confirm that footsteps in the corridor no longer register.',
    },
    {
      sym: 'Temperature reads consistently 2 °C high',
      cause: 'The MH-Z19B is heating the SHT31.',
      fix: 'Separate them physically — 80 mm minimum, ideally with the temperature sensor on a small satellite board outside the main enclosure. A software offset is wrong because the error varies with the CO₂ sensor duty.',
    },
    {
      sym: 'CO₂ readings drift downward over weeks',
      cause: 'Automatic baseline correction in a room that never reaches outdoor levels.',
      fix: 'Disable ABC and calibrate manually outdoors once a year. A bedroom is the textbook case where ABC does harm.',
    },
  ],

  perf: [
    'Sample once a minute. Every variable here changes over tens of minutes, and the data is more readable at one-minute resolution than at one-second.',
    'Poll the accelerometer at 4 Hz rather than once a minute — movement events are brief and would be missed entirely at the slow rate.',
    'Publish per-minute samples without the retain flag and the nightly summary with it. The stream is history; the summary is state.',
  ],

  safety: [
    'Do not use this to diagnose a sleep disorder. Persistent snoring with pauses, daytime sleepiness or gasping needs a doctor and a proper sleep study — an accelerometer under a mattress cannot detect apnoea.',
    'If anyone else sleeps in the room, tell them there is a microphone in it, even though it only measures level. Consent matters more than the technical detail.',
    'Keep the cooling ramp conservative for infants and elderly people, who regulate temperature less effectively.',
  ],

  future: [
    'Add a <b>radar presence sensor</b> to detect when you actually got into bed rather than assuming a fixed bedtime.',
    'Add <b>heart-rate and breathing detection</b> with a ballistocardiography sensor or a 60 GHz radar — that gets you much closer to real sleep staging.',
    'Add <b>automatic window or trickle-vent control</b> so high CO₂ is acted on rather than merely logged.',
    'Add a <b>morning report</b> pushed to your phone with the night\'s chart and one specific observation rather than a wall of numbers.',
    'Correlate against a <b>wearable\'s sleep score</b> for a fortnight to see how much the crude movement proxy actually tracks it.',
  ],

  faq: [
    { q: 'Can this measure my sleep stages?', a: 'No, and any project that claims to from an accelerometer is overstating what it does. Movement correlates loosely with sleep stage — you move more in light sleep — but staging needs EEG, EOG and EMG. What this gives is a repeatable restlessness number you can correlate against your own environmental data, which is genuinely useful and a different claim.' },
    { q: 'What temperature is actually best?', a: 'The evidence supports a range of roughly 17–20 °C for most adults, but individual variation is large and bedding matters as much as air temperature. That is exactly why this project logs rather than prescribes — run it for a month at 21 °C and a month at 18.5 °C and compare your own restlessness numbers.' },
    { q: 'Is pink noise better than white noise?', a: 'For masking, marginally, and mostly because it is more pleasant. Pink noise falls at 3 dB per octave so it sounds like rain rather than hiss, and its energy distribution better matches the frequency range of typical disturbances. The bigger factor is level: masking noise louder than what it masks is itself a disturbance, which is why this design matches it to measured ambient.' },
    { q: 'Does the CO₂ number really matter?', a: 'The evidence is reasonable but not overwhelming. Several controlled studies find reduced subjective sleep quality and next-day performance above roughly 1500–2000 ppm. What is not in doubt is that a closed bedroom reaches those levels routinely — most people are genuinely surprised by their first overnight chart, and that surprise is often enough to change a habit.' },
    { q: 'Why not just buy a smart thermostat and a sunrise lamp?', a: 'You could, and they would work. What you would not get is the correlation: a commercial sunrise lamp cannot tell you whether it made any difference to how you slept. The value here is in the logging and the per-night summary, not in the actuation.' },
    { q: 'Will the fan itself wake me?', a: 'Not if it ramps. That is the reason for the 5 %-per-minute limit — sleep is disturbed by <em>change</em> in stimulus far more than by steady level, so a fan that reaches full speed over twenty minutes is far less disruptive than one that steps to half speed instantly.' },
  ],

  refs: [
    { t: 'Okamoto-Mizuno & Mizuno, "Effects of thermal environment on sleep and circadian rhythm"', u: 'https://doi.org/10.1186/1880-6805-31-14', s: 'Journal of Physiological Anthropology, 2012' },
    { t: 'Strøm-Tejsen et al., "The effects of bedroom air quality on sleep and next-day performance"', u: 'https://doi.org/10.1111/ina.12254', s: 'Indoor Air, 2016' },
    { t: 'Basner et al., "Auditory and non-auditory effects of noise on health"', u: 'https://doi.org/10.1016/S0140-6736(13)61613-X', s: 'The Lancet, 2014' },
    { t: 'Zeitzer et al., "Sensitivity of the human circadian pacemaker to nocturnal light"', u: 'https://doi.org/10.1111/j.1469-7793.2000.00695.x', s: 'The Journal of Physiology, 2000' },
    { t: 'SHT31-DIS humidity and temperature sensor — datasheet', u: 'https://sensirion.com/media/documents/213E6A3B/63A5A569/Datasheet_SHT3x_DIS.pdf', s: 'Sensirion' },
    { t: 'Voss-McCartney algorithm for pink noise generation', u: 'https://www.firstpr.com.au/dsp/pink-noise/', s: 'Robin Whittle' },
    { t: 'ESP32 LEDC PWM peripheral — resolution and frequency', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/ledc.html', s: 'Espressif' },
  ],

  images: ['sensor', 'esp32', 'grafana'],
  imageCaptions: [
    'A sensor breakout module. This build combines five separate sensors on one node, deliberately spaced apart so they do not heat each other.',
    'An ESP32 development board — enough I²C, UART and I²S peripherals to run all five sensors and three ramped outputs.',
    'A time-series dashboard. Overlaying movement events on the environmental traces is what turns raw logging into an actual finding.',
  ],
},

];
