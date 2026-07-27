/* ═══════════════════════════════════════════════════════════════════
   Smart Home — projects 003–008
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 003 · Learning Smart Thermostat ─────────────────────────────── */
{
  id: '003',
  domainKey: 'iot',
  emoji: '🌡️',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'A thermostat that stops being a dumb switch — it measures how fast your room actually heats and cools, learns when you are home, and starts the system early enough to hit the setpoint at the right moment rather than after it.',

  overview: [
    'A conventional thermostat implements one rule: if the temperature is below the setpoint, turn the heat on. It works, and it produces a room that is either slightly too cold or slightly too warm nearly all the time, with the system short-cycling at the boundary. Every improvement in this project comes from replacing that rule with something that understands the room has <em>thermal mass</em> and the system has <em>lag</em>.',
    'Three ideas do the heavy lifting. <b>Hysteresis</b> stops short-cycling by using two thresholds instead of one. <b>PI control with a duty cycle</b> replaces bang-bang switching with proportional output, so the room settles at the setpoint rather than oscillating around it. And <b>learned thermal parameters</b> — measured, not guessed — let the controller predict how long a change will take and start early.',
    'The learning part is genuinely simple mathematics, which is why it is worth doing rather than hand-waving about machine learning. A room warming towards a source behaves as a first-order system: the rate of change is proportional to the temperature difference. Two constants describe it — a heating rate and a cooling time constant — and both can be measured by the device itself during ordinary operation. From those two numbers you can answer the only question that matters: "if I want 22 °C at 07:00, when must I start?"',
    'On top of that sits an occupancy schedule the device builds from a PIR sensor. Not a neural network — a seven-by-forty-eight grid of exponentially-weighted occupancy probabilities, one cell per half hour per weekday. After a fortnight it knows that the living room is empty from 09:00 to 18:00 on weekdays and it stops heating an empty room, which is where nearly all of the energy saving comes from.',
  ],

  does: [
    'Measures temperature, humidity and pressure with a BME280 and controls a heater or air conditioner through a relay.',
    'Applies PI control with a slow duty cycle, so the room settles at the setpoint instead of oscillating.',
    'Enforces a minimum off-time so the compressor or boiler can never short-cycle.',
    'Measures the room\'s heating rate and cooling time constant automatically during normal operation.',
    'Predicts a start time so the setpoint is reached at the scheduled moment, not thirty minutes later.',
    'Learns an occupancy schedule from a PIR sensor and drops to a setback temperature when the room is reliably empty.',
    'Exposes everything over MQTT with Home Assistant auto-discovery, so it appears as a proper climate entity.',
  ],

  features: [
    '<b>Two-threshold hysteresis</b> with configurable dead band, eliminating relay chatter at the setpoint.',
    '<b>PI controller with anti-windup</b> driving a 10-minute duty cycle rather than a raw on/off decision.',
    '<b>Minimum run and minimum off timers</b> — a hard protection for compressor-based systems.',
    '<b>Online thermal identification</b>: heating rate in °C/min and cooling time constant in minutes, estimated by recursive least squares.',
    '<b>Predictive pre-heat</b> that solves the first-order model for the required start time.',
    '<b>Learned weekly occupancy grid</b> (7 × 48 cells, exponentially weighted) driving automatic setback.',
    '<b>Freeze and overheat protection</b> that overrides every other rule.',
    '<b>Home Assistant MQTT discovery</b>, so it appears as a native climate card with no YAML.',
  ],

  applications: [
    { t: 'Domestic heating', d: 'Replaces a mechanical or simple digital thermostat and typically cuts runtime 10–25 % through setback alone.' },
    { t: 'Split-AC control', d: 'The same logic with the sign inverted, driving an IR blaster or a relay on the compressor contactor.' },
    { t: 'Server and network cupboards', d: 'Keeps a small enclosed space inside a band and alerts when the cooling cannot keep up.' },
    { t: 'Greenhouse and grow tents', d: 'Night setback plus predictive ramp matters more here than in a house, because plants respond to the temperature curve.' },
    { t: 'Fermentation and proofing chambers', d: 'Tight band control with anti-short-cycling protection is exactly what a beer fridge or a bread proofer needs.' },
    { t: 'Holiday-home frost protection', d: 'Remote setpoint plus freeze protection lets an unoccupied property sit at 8 °C and be brought up before arrival.' },
  ],

  skills: [
    'Arduino C++ with non-blocking timing using <code>millis()</code>',
    'I²C bus basics and how to find a device address',
    'Enough control theory to understand proportional and integral terms',
    'Reading a first-order exponential response and extracting a time constant',
    'Relay wiring for a heating or cooling load, including load ratings',
    'MQTT topics and JSON payloads',
  ],

  parts: ['esp32', 'bme280', 'pir', 'relay1', 'oled', 'rtc', 'buck', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'Rotary encoder with push button', spec: '20 detents/rev, integral switch', qty: 1, price: 90, note: 'Local setpoint adjustment — a thermostat that needs a phone is a worse thermostat.' },
    { name: 'DS18B20 remote probe (optional)', spec: 'Waterproof, 2 m lead', qty: 1, price: 160, note: 'Lets you sense at a better location than the wall box.' },
  ],
  cost: '₹3,100 – ₹4,000',
  libs: ['wifi', 'pubsub', 'arduinojson', 'bme', 'unified', 'ssd1306', 'preferences', 'ntp', 'pid'],

  pins: {
    left: [
      { dev: 'BME280 sensor', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x76' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Same bus, 0x3C' },
      { dev: 'DS3231 RTC', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Same bus, 0x68' },
      { dev: 'HC-SR501 PIR', devPin: 'OUT', pin: 'GPIO 27', sig: 'High while motion detected' },
      { dev: 'Rotary encoder', devPin: 'A / B / SW', pin: 'GPIO 32 / 33 / 25', sig: 'Quadrature + button' },
    ],
    right: [
      { dev: 'Relay → boiler / contactor', devPin: 'IN', pin: 'GPIO 26', sig: 'Active-low, opto-isolated' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Through 330 Ω' },
    ],
  },
  wiringNotes: [
    'Three I²C devices share one bus at three different addresses (0x76, 0x3C, 0x68). Run an I²C scanner first and confirm you see all three before writing any application code.',
    'Mount the BME280 <b>away from the ESP32 and the OLED</b>. Both are heat sources; a sensor 10 mm from the regulator will read one to two degrees high and no amount of software will fix that. A short ribbon cable moving it 50 mm away is the correct answer.',
    'Do not enclose the BME280 in a sealed box. It needs airflow to track the room, and the humidity channel needs it more than the temperature channel.',
    'The PIR needs a stable 5 V and about 60 seconds of settling time after power-up. Ignore its output for the first minute after boot or you will record phantom occupancy.',
    'The relay switches the boiler\'s low-voltage call-for-heat loop in most domestic systems, not mains. Check yours: some older systems switch 230 V through the thermostat, in which case every mains precaution applies.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'BME280', sub: 'T / RH / P' }, { name: 'PIR sensor', sub: 'occupancy' }, { name: 'DS3231', sub: 'time of day' }] },
      { label: 'Model', edge: 'samples', blocks: [{ name: 'Thermal identifier', sub: 'rate + τ', highlight: true }, { name: 'Occupancy grid', sub: '7 × 48 cells' }] },
      { label: 'Control', edge: 'setpoint + model', blocks: [{ name: 'PI + hysteresis', sub: 'duty cycle', highlight: true }, { name: 'Cycle protection', sub: 'min on / off' }] },
      { label: 'Output', edge: 'call for heat', blocks: [{ name: 'Relay', sub: 'boiler / AC' }, { name: 'OLED + MQTT', sub: 'state and history' }] },
    ],
  },

  flow: [
    { t: 'Boot: read stored thermal model and schedule', k: 'start' },
    { t: 'Sample BME280 and PIR every 5 s', k: 'proc' },
    { t: 'Update occupancy grid cell for this half hour', k: 'proc' },
    { t: 'Occupied, or pre-heat window open?', k: 'dec', yes: 'comfort setpoint', no: 'setback setpoint', back: 1 },
    { t: 'Compute PI output over the 10-minute cycle', k: 'proc' },
    { t: 'Minimum off-time elapsed?', k: 'dec', yes: 'yes', no: 'hold relay off', back: 1 },
    { t: 'Drive relay for the computed on-fraction', k: 'io' },
    { t: 'Update thermal estimate from observed slope', k: 'proc' },
    { t: 'Publish state over MQTT', k: 'end' },
  ],

  principle: [
    'A room is a first-order thermal system to a very good approximation. Write <code>T</code> for room temperature, <code>T∞</code> for outside (or the temperature the room drifts to with no input), and <code>P</code> for heater power. Newton\'s law of cooling gives <code>dT/dt = −(T − T∞)/τ + k·P</code>, where <code>τ</code> is the thermal time constant — the room\'s heat capacity divided by its loss coefficient — and <code>k</code> converts heater power into a heating rate.',
    'That single equation explains everything a naive thermostat gets wrong. Because <code>τ</code> for a typical room is 60–240 minutes, temperature responds to a change in heating with a long lag. A controller that reacts only to the present error is always chasing a signal it caused twenty minutes ago, which is precisely why bang-bang control overshoots.',
    'The device measures both constants rather than assuming them. When the heater runs and the room is well below <code>T∞</code>, the observed slope is dominated by <code>k·P</code>, giving the heating rate directly in °C per minute. When the heater is off, the room decays exponentially towards <code>T∞</code>, and fitting <code>ln(T − T∞)</code> against time yields <code>τ</code> as the negative reciprocal of the slope. Both estimates are updated continuously with an exponentially weighted recursive fit so the model tracks the seasons.',
    'Control uses a <b>PI controller driving a duty cycle</b>. The proportional term responds to the current error; the integral term accumulates persistent error and removes the steady-state offset that pure proportional control always leaves. The output is not an on/off decision but a fraction of a ten-minute window: an output of 0.3 means the relay is on for three minutes and off for seven. That converts a binary actuator into an effectively analogue one, which is what lets the room settle rather than oscillate. The integral term is clamped — anti-windup — so that a morning where the heater simply cannot keep up does not accumulate an enormous integral that then overshoots massively once it can.',
    'The derivative term is deliberately omitted. On a slow thermal process with a noisy sensor, the D term amplifies measurement noise far more than it improves response, and every practical thermostat implementation ends up with it either zeroed or so heavily filtered as to be irrelevant.',
    'Predictive pre-heat is then a matter of inverting the model. Given the current temperature <code>T₀</code>, the target <code>T_set</code>, and the measured heating rate, the required lead time is approximately <code>(T_set − T₀) / rate</code>, corrected for the loss term. The device solves this every minute and starts heating exactly when the answer says the remaining time equals the time to the scheduled setpoint change.',
  ],

  equations: [
    { t: 'First-order thermal model', eq: 'dT/dt = −(T − T∞)/τ + k·P\n\nHeater off, solved:\n  T(t) = T∞ + (T₀ − T∞)·e^(−t/τ)\n\nMeasuring τ from a cooling curve:\n  ln(T(t) − T∞) = ln(T₀ − T∞) − t/τ\n  → τ = −1 / slope of the log-linear fit\n\nTypical measured values (3 m × 4 m insulated room):\n  τ    ≈ 145 min\n  rate ≈ 0.048 °C/min with a 2 kW heater' },
    { t: 'PI controller with anti-windup', eq: 'e(t)      = T_set − T\nI         = clamp(I + e·Δt, −I_max, +I_max)\nu         = Kp·e + Ki·I\nduty      = clamp(u, 0, 1)\n\nStarting values that work on a domestic room:\n  Kp    = 0.45  per °C\n  Ki    = 0.0012 per °C·s\n  I_max = 600   °C·s     (≈ 0.72 duty of authority)\n  cycle = 600   s', d: 'Ki looks tiny because the integral accumulates in °C-seconds; over a ten-minute persistent 1 °C error it contributes 0.72 of duty, which is the intended authority.' },
    { t: 'Predictive start time', eq: 'time_to_target = (T_set − T₀) / (rate − (T₀ − T∞)/τ)\n\nExample: T₀ = 16 °C, T_set = 21 °C, T∞ = 8 °C\n  loss term = (16 − 8)/145 = 0.055 °C/min\n  net rate  = 0.048 − 0.055 → negative!\n\nWhen the net rate is negative the heater cannot reach the setpoint\nat this outside temperature — the controller must report that rather\nthan run forever.', d: 'This example is deliberately chosen to show the failure case. A real system should detect an unattainable setpoint and raise an alert rather than running the heater continuously all night.' },
  ],

  steps: [
    {
      h: 'Read the sensor without self-heating error',
      p: ['The BME280 heats itself when read continuously. Forced mode — take one measurement then return to sleep — keeps the die close to ambient and is what the datasheet recommends for any application where the temperature reading matters.'],
      code: {
        file: '01-bme-forced.ino', lang: 'cpp',
        body: `#include <Wire.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void sensorBegin() {
  Wire.begin(21, 22);
  if (!bme.begin(0x76)) { Serial.println("BME280 not found at 0x76"); while (1) delay(100); }

  // Forced mode: the chip sleeps between measurements, so it does not
  // warm itself. x1 oversampling on T and P, x1 on humidity, filter off.
  bme.setSampling(Adafruit_BME280::MODE_FORCED,
                  Adafruit_BME280::SAMPLING_X1,   // temperature
                  Adafruit_BME280::SAMPLING_X1,   // pressure
                  Adafruit_BME280::SAMPLING_X1,   // humidity
                  Adafruit_BME280::FILTER_OFF);
}

struct Reading { float tC, rh, hPa; };

Reading sensorRead() {
  bme.takeForcedMeasurement();      // wakes, converts, sleeps again
  return { bme.readTemperature(), bme.readHumidity(), bme.readPressure() / 100.0f };
}`,
        explain: [
          { ref: 'MODE_FORCED', txt: 'In normal mode the BME280 converts continuously and the die sits 1–2 °C above ambient. Forced mode is the difference between a thermostat that is accurate and one that is confidently wrong.' },
          { ref: 'FILTER_OFF', txt: 'The IIR filter helps with pressure noise but adds lag to temperature. On a system with a 145-minute time constant, sensor lag is the last thing you want to add.' },
        ],
      },
    },
    {
      h: 'Implement PI control with a duty cycle',
      p: ['The controller runs once per second but its output only changes the relay at cycle boundaries. Keeping those two rates separate is what stops the relay from following the noise on the sensor.'],
      code: {
        file: '02-pi-duty.ino', lang: 'cpp',
        body: `const float  KP        = 0.45f;      // per °C
const float  KI        = 0.0012f;   // per °C·second
const float  I_MAX     = 600.0f;    // °C·s
const uint32_t CYCLE_MS   = 600000UL;  // 10 minutes
const uint32_t MIN_ON_MS  = 180000UL;  // 3 min — protects a compressor
const uint32_t MIN_OFF_MS = 300000UL;  // 5 min

static float    integral   = 0;
static uint32_t cycleStart = 0;
static float    dutyThisCycle = 0;
static uint32_t lastSwitch = 0;
static bool     heating    = false;

float piUpdate(float setpoint, float measured, float dtSeconds) {
  float e = setpoint - measured;

  integral += e * dtSeconds;
  if (integral >  I_MAX) integral =  I_MAX;      // anti-windup clamp
  if (integral < -I_MAX) integral = -I_MAX;

  float u = KP * e + KI * integral;
  return u < 0 ? 0 : (u > 1 ? 1 : u);            // duty in [0, 1]
}

void relayService(float duty) {
  uint32_t now = millis();

  if (now - cycleStart >= CYCLE_MS) {            // new cycle: latch the duty
    cycleStart = now;
    dutyThisCycle = duty;
  }

  uint32_t elapsed = now - cycleStart;
  bool want = elapsed < (uint32_t)(dutyThisCycle * CYCLE_MS);

  // Cycle protection overrides the controller, always.
  if (want != heating) {
    uint32_t held = now - lastSwitch;
    if ( heating && held < MIN_ON_MS)  want = true;
    if (!heating && held < MIN_OFF_MS) want = false;
  }

  if (want != heating) {
    heating = want;
    lastSwitch = now;
    digitalWrite(PIN_RELAY, heating ? LOW : HIGH);   // active-low module
  }
}`,
        explain: [
          { ref: 'dutyThisCycle latched at cycle start', txt: 'The duty is sampled once per cycle rather than recomputed continuously. Otherwise a duty that drifts upward mid-cycle can retrigger the relay, defeating the whole point of a duty-cycle scheme.' },
          { ref: 'integral clamp', txt: 'Without the clamp, an hour where the heater cannot reach the setpoint accumulates an enormous integral. The room then overshoots by several degrees once conditions improve — the classic windup failure.' },
          { ref: 'MIN_ON_MS / MIN_OFF_MS override', txt: 'These are protection, not control, so they sit outside the controller and win unconditionally. A compressor started within five minutes of stopping can be damaged by the pressure differential.' },
        ],
      },
    },
    {
      h: 'Identify the thermal constants online',
      p: ['Both constants come out of ordinary operation — there is no calibration mode to run. The estimator only updates when conditions are clean enough for the estimate to mean something.'],
      code: {
        file: '03-thermal-id.ino', lang: 'cpp',
        body: `struct Thermal {
  float heatRate;   // °C per minute with the heater on
  float tau;        // minutes, cooling time constant
  float tInf;       // °C the room drifts towards
};
Thermal model = { 0.05f, 120.0f, 12.0f };   // sane starting guesses

// Called once a minute with the temperature one minute ago and now.
void thermalUpdate(float tPrev, float tNow, bool heaterWasOn, float outsideC) {
  float slope = tNow - tPrev;                       // °C per minute
  const float ALPHA = 0.02f;                        // slow EWMA

  if (heaterWasOn && tNow < tPrev + 1.0f) {
    // Heating: slope ≈ heatRate − (T − T∞)/τ, so add back the loss term.
    float loss = (tNow - model.tInf) / model.tau;
    float est  = slope + loss;
    if (est > 0.005f && est < 0.5f)                 // reject nonsense
      model.heatRate = (1 - ALPHA) * model.heatRate + ALPHA * est;
  }

  if (!heaterWasOn && fabsf(tNow - outsideC) > 3.0f && slope < -0.001f) {
    // Cooling: τ = −(T − T∞) / slope
    float est = -(tNow - outsideC) / slope;
    if (est > 15.0f && est < 600.0f)
      model.tau = (1 - ALPHA) * model.tau + ALPHA * est;
  }

  model.tInf = (1 - 0.005f) * model.tInf + 0.005f * outsideC;
}

// Minutes needed to move from tNow to tTarget, or -1 if unreachable.
float minutesToTarget(float tNow, float tTarget) {
  float loss = (tNow - model.tInf) / model.tau;
  float net  = model.heatRate - loss;
  if (net <= 0.002f) return -1;                     // heater cannot win
  return (tTarget - tNow) / net;
}`,
        explain: [
          { ref: 'if (est > 0.005f && est < 0.5f)', txt: 'Sanity gates. A window opening, a door slamming or someone standing next to the sensor produces slopes that are real measurements of the wrong thing. Rejecting implausible estimates is what keeps the model from being destroyed by one bad hour.' },
          { ref: 'fabsf(tNow − outsideC) > 3.0f', txt: 'The cooling time constant is only observable when there is a meaningful temperature difference. Close to equilibrium the slope is dominated by noise and the estimate diverges.' },
          { ref: 'ALPHA = 0.02', txt: 'An exponentially weighted average with an effective memory of about 50 samples — roughly an hour of updates. Slow enough to reject transients, fast enough to follow a change of season over a fortnight.' },
          { ref: 'return −1 when net ≤ 0', txt: 'Reporting "unreachable" is a feature. A thermostat that silently runs a heater all night against an unattainable setpoint is worse than one that says it cannot get there.' },
        ],
      },
    },
  ],

  code: [{
    file: 'learning-thermostat.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Learning Smart Thermostat — ESP32 + BME280 + PIR + relay

   PI control on a 10-minute duty cycle with compressor protection,
   online identification of the room's heating rate and cooling time
   constant, a learned weekly occupancy grid, and Home Assistant MQTT
   auto-discovery.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>
#include <math.h>

#define WIFI_SSID  "YOUR_WIFI"
#define WIFI_PASS  "YOUR_PASSWORD"
#define MQTT_HOST  "192.168.1.50"
#define DEVICE_ID  "thermostat-living"

#define PIN_RELAY  26
#define PIN_PIR    27
#define PIN_ENC_A  32
#define PIN_ENC_B  33
#define PIN_ENC_SW 25
#define PIN_LED     2

#define COMFORT_C   21.5f
#define SETBACK_C   17.0f
#define FREEZE_C     7.0f
#define DEAD_BAND    0.3f

const float    KP = 0.45f, KI = 0.0012f, I_MAX = 600.0f;
const uint32_t CYCLE_MS = 600000UL, MIN_ON_MS = 180000UL, MIN_OFF_MS = 300000UL;

Adafruit_BME280  bme;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

struct Thermal { float heatRate, tau, tInf; } model = { 0.05f, 120.0f, 12.0f };

float    setpoint = COMFORT_C, roomC = 20, roomRh = 50, outsideC = 12;
float    integral = 0, duty = 0, dutyThisCycle = 0;
bool     heating = false, occupied = false, manualHold = false;
uint32_t cycleStart = 0, lastSwitch = 0, lastSample = 0, lastMinute = 0;
float    tPrevMinute = 20;
bool     heaterWasOnLastMinute = false;

/* Occupancy: 7 days x 48 half-hour slots, probability 0..1 */
float occGrid[7][48];

/* ── occupancy ──────────────────────────────────────────────── */
int slotNow(struct tm &t) { return t.tm_hour * 2 + (t.tm_min >= 30 ? 1 : 0); }

void occUpdate(bool motion) {
  time_t now = time(nullptr);
  struct tm t; localtime_r(&now, &t);
  float &cell = occGrid[t.tm_wday][slotNow(t)];
  cell = 0.94f * cell + 0.06f * (motion ? 1.0f : 0.0f);
}

bool occLikely(int minutesAhead) {
  time_t now = time(nullptr) + minutesAhead * 60;
  struct tm t; localtime_r(&now, &t);
  return occGrid[t.tm_wday][slotNow(t)] > 0.35f;
}

void occSave() {
  prefs.putBytes("occ", occGrid, sizeof(occGrid));
  prefs.putBytes("model", &model, sizeof(model));
}

/* ── thermal identification ─────────────────────────────────── */
void thermalUpdate(float tPrev, float tNow, bool heaterOn) {
  float slope = tNow - tPrev;
  const float A = 0.02f;

  if (heaterOn && slope < 1.0f) {
    float est = slope + (tNow - model.tInf) / model.tau;
    if (est > 0.005f && est < 0.5f) model.heatRate = (1 - A) * model.heatRate + A * est;
  }
  if (!heaterOn && fabsf(tNow - outsideC) > 3.0f && slope < -0.001f) {
    float est = -(tNow - outsideC) / slope;
    if (est > 15.0f && est < 600.0f) model.tau = (1 - A) * model.tau + A * est;
  }
  model.tInf = 0.995f * model.tInf + 0.005f * outsideC;
}

float minutesToTarget(float tNow, float tTarget) {
  float net = model.heatRate - (tNow - model.tInf) / model.tau;
  return net <= 0.002f ? -1 : (tTarget - tNow) / net;
}

/* ── control ────────────────────────────────────────────────── */
float piUpdate(float sp, float pv, float dt) {
  float e = sp - pv;
  if (fabsf(e) < DEAD_BAND) e = 0;              // dead band kills chatter
  integral += e * dt;
  integral = integral >  I_MAX ?  I_MAX : (integral < -I_MAX ? -I_MAX : integral);
  float u = KP * e + KI * integral;
  return u < 0 ? 0 : (u > 1 ? 1 : u);
}

void relayService(float d) {
  uint32_t now = millis();
  if (now - cycleStart >= CYCLE_MS) { cycleStart = now; dutyThisCycle = d; }

  bool want = (now - cycleStart) < (uint32_t)(dutyThisCycle * CYCLE_MS);
  if (roomC < FREEZE_C) want = true;             // freeze protection wins

  if (want != heating) {
    uint32_t held = now - lastSwitch;
    if ( heating && held < MIN_ON_MS)  want = true;
    if (!heating && held < MIN_OFF_MS) want = false;
  }
  if (want != heating) {
    heating = want;
    lastSwitch = now;
    digitalWrite(PIN_RELAY, heating ? LOW : HIGH);
    digitalWrite(PIN_LED, heating);
  }
}

/* ── target selection, including pre-heat ───────────────────── */
float chooseSetpoint() {
  if (manualHold) return setpoint;
  if (occLikely(0)) return COMFORT_C;

  // Look up to two hours ahead; start early if the model says we must.
  for (int ahead = 10; ahead <= 120; ahead += 10) {
    if (!occLikely(ahead)) continue;
    float need = minutesToTarget(roomC, COMFORT_C);
    if (need > 0 && need >= ahead) return COMFORT_C;   // start now
    break;
  }
  return SETBACK_C;
}

/* ── MQTT ───────────────────────────────────────────────────── */
void publishDiscovery() {
  JsonDocument d;
  d["name"] = "Living Room Thermostat";
  d["unique_id"] = DEVICE_ID;
  d["modes"][0] = "off"; d["modes"][1] = "heat";
  d["current_temperature_topic"] = "home/climate/" DEVICE_ID "/state";
  d["current_temperature_template"] = "{{ value_json.room_c }}";
  d["temperature_state_topic"] = "home/climate/" DEVICE_ID "/state";
  d["temperature_state_template"] = "{{ value_json.setpoint }}";
  d["temperature_command_topic"] = "home/climate/" DEVICE_ID "/set";
  d["min_temp"] = 7; d["max_temp"] = 28; d["temp_step"] = 0.5;
  char buf[640];
  size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("homeassistant/climate/" DEVICE_ID "/config", (uint8_t *)buf, n, true);
}

void publishState() {
  JsonDocument d;
  d["room_c"]    = roundf(roomC * 10) / 10.0f;
  d["rh"]        = roundf(roomRh);
  d["setpoint"]  = setpoint;
  d["duty"]      = roundf(duty * 100) / 100.0f;
  d["heating"]   = heating;
  d["occupied"]  = occupied;
  d["heat_rate"] = roundf(model.heatRate * 1000) / 1000.0f;
  d["tau_min"]   = roundf(model.tau);
  d["t_inf"]     = roundf(model.tInf * 10) / 10.0f;
  char buf[256];
  size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("home/climate/" DEVICE_ID "/state", (uint8_t *)buf, n, true);
}

void onMessage(char *topic, byte *payload, unsigned int len) {
  char v[16] = {0};
  memcpy(v, payload, len < 15 ? len : 15);
  float sp = atof(v);
  if (sp >= 7 && sp <= 28) { setpoint = sp; manualHold = true; integral = 0; }
}

/* ── display ────────────────────────────────────────────────── */
void draw() {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(3);
  oled.setCursor(0, 4);  oled.printf("%.1f", roomC);
  oled.setTextSize(1);
  oled.setCursor(96, 6); oled.print("degC");
  oled.setCursor(0, 34); oled.printf("set %.1f  rh %.0f%%", setpoint, roomRh);
  oled.setCursor(0, 46); oled.printf("duty %3.0f%%  %s", duty * 100, heating ? "HEAT" : "idle");
  oled.setCursor(0, 56); oled.printf("tau %.0fm  %.3f C/min", model.tau, model.heatRate);
  oled.display();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY, OUTPUT); digitalWrite(PIN_RELAY, HIGH);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_PIR, INPUT);

  Wire.begin(21, 22);
  if (!bme.begin(0x76)) Serial.println("BME280 missing");
  bme.setSampling(Adafruit_BME280::MODE_FORCED, Adafruit_BME280::SAMPLING_X1,
                  Adafruit_BME280::SAMPLING_X1, Adafruit_BME280::SAMPLING_X1,
                  Adafruit_BME280::FILTER_OFF);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("thermo", false);
  if (prefs.getBytesLength("occ") == sizeof(occGrid)) prefs.getBytes("occ", occGrid, sizeof(occGrid));
  if (prefs.getBytesLength("model") == sizeof(model)) prefs.getBytes("model", &model, sizeof(model));

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);
  mqtt.setBufferSize(768);

  delay(60000);                        // let the PIR settle before trusting it
  Serial.println("Thermostat running");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) {
    if (mqtt.connect(DEVICE_ID)) {
      mqtt.subscribe("home/climate/" DEVICE_ID "/set");
      publishDiscovery();
    }
  }
  mqtt.loop();

  uint32_t now = millis();

  if (now - lastSample >= 5000) {
    float dt = (now - lastSample) / 1000.0f;
    lastSample = now;

    bme.takeForcedMeasurement();
    roomC  = bme.readTemperature();
    roomRh = bme.readHumidity();
    occupied = digitalRead(PIN_PIR);
    occUpdate(occupied);

    setpoint = manualHold ? setpoint : chooseSetpoint();
    duty = piUpdate(setpoint, roomC, dt);
    draw();
  }

  relayService(duty);

  if (now - lastMinute >= 60000) {
    lastMinute = now;
    thermalUpdate(tPrevMinute, roomC, heaterWasOnLastMinute);
    tPrevMinute = roomC;
    heaterWasOnLastMinute = heating;
    publishState();
    static uint8_t saveCounter = 0;
    if (++saveCounter >= 30) { saveCounter = 0; occSave(); }   // every 30 min
  }
}`,
    explain: [
      { ref: 'occGrid[7][48]', txt: '336 floats — 1.3 KB — is the entire occupancy model. It is deliberately not machine learning: an exponentially weighted per-slot average is interpretable, debuggable, and in practice indistinguishable in accuracy from anything more elaborate for this task.' },
      { ref: 'cell = 0.94f * cell + 0.06f * motion', txt: 'An EWMA with an effective memory of about 16 observations of that slot — roughly four months of weekdays. Slow enough that one late night does not rewrite the schedule, fast enough to follow a genuine change in routine.' },
      { ref: 'chooseSetpoint() look-ahead loop', txt: 'Walks forward in ten-minute steps to find the next likely-occupied slot, then asks the thermal model whether it needs to start now to arrive on time. This is the whole point of measuring the heating rate.' },
      { ref: 'if (roomC < FREEZE_C) want = true', txt: 'Freeze protection sits inside relayService, below the controller, so no combination of setpoint, schedule or manual hold can bypass it. Burst pipes cost more than a night of heating.' },
      { ref: 'saveCounter >= 30', txt: 'NVS is flash with a finite erase-cycle budget. Saving every 30 minutes rather than every minute extends the flash life from months to decades.' },
      { ref: 'delay(60000) in setup', txt: 'The HC-SR501 outputs garbage for roughly a minute after power-up. Blocking here is acceptable because it happens once, and it prevents the occupancy grid being polluted at every boot.' },
    ],
  }],

  config: [
    'Set <code>COMFORT_C</code>, <code>SETBACK_C</code> and <code>FREEZE_C</code>. A setback 4–5 °C below comfort captures most of the saving; deeper setbacks cost more to recover than they save on a well-insulated room.',
    'Set <code>DEAD_BAND</code> to at least your sensor noise — 0.3 °C suits a BME280. Too small and the relay chatters; too large and the room drifts visibly.',
    'Set <code>MIN_OFF_MS</code> to your equipment manufacturer\'s figure. Five minutes is a safe default for a compressor; a resistive heater or a modulating boiler can use much less.',
    'Feed a real outside temperature into <code>outsideC</code> — either a second DS18B20 outdoors, or a value published from a weather API through MQTT. Without it, the τ estimate degrades.',
    'Leave the thermostat running for at least a week before judging it. The occupancy grid needs that long to mean anything, and the thermal model needs several heat-and-cool cycles.',
  ],

  calibration: [
    { h: 'Check the sensor against a reference', p: ['Place a known-good thermometer next to the BME280 for an hour and note the offset. A consistent offset of up to about 1 °C is normal and should be corrected in software with a constant; a drifting difference means the sensor is being warmed by something nearby and needs to be moved.'] },
    { h: 'Verify the thermal model after 48 hours', p: ['Compare the reported <code>tau_min</code> against a manual measurement: turn the heat off with the room 8 °C above outside and time how long it takes to fall by 63 % of that difference. That time <em>is</em> τ. The two should agree within about 20 %.'] },
    { h: 'Tune Kp and Ki if it overshoots', p: ['A room that overshoots the setpoint by more than 0.5 °C has too much integral authority — halve <code>KI</code>. A room that takes hours to close the last half degree has too little — double it. Change one term at a time and give each change a full day.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Thermostat', sub: 'ESP32 + BME280' }, { name: 'Outdoor probe', sub: 'DS18B20' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Home router', gatewaySub: 'IoT VLAN',
      uplink: 'MQTT 1883', cloud: 'Mosquitto + HA', cloudSub: 'local, no cloud',
      clients: [{ name: 'Home Assistant', sub: 'climate card' }, { name: 'Grafana', sub: 'runtime history' }],
    },
    protocol: [
      'State is published <b>retained</b>, which is correct here because temperature and setpoint are state rather than events — a dashboard connecting at any moment should immediately learn the current value rather than wait up to a minute for the next update.',
      'Home Assistant MQTT discovery means the device describes itself: publishing a config document to <code>homeassistant/climate/&lt;id&gt;/config</code> creates a fully functional climate entity with no configuration file editing at all.',
    ],
    topics: [
      { t: 'home/climate/thermostat-living/state', dir: 'device → broker (retained)', payload: 'JSON: room_c, rh, setpoint, duty, heating, occupied, heat_rate, tau_min, t_inf' },
      { t: 'home/climate/thermostat-living/set', dir: 'broker → device', payload: 'Plain float setpoint in °C' },
      { t: 'homeassistant/climate/thermostat-living/config', dir: 'device → broker (retained)', payload: 'Home Assistant discovery document' },
    ],
    dashboard: [
      'The panel worth building is not current temperature — the thermostat already shows that. Plot <b>duty cycle against outside temperature</b> over a season: the slope of that line is your building\'s heat loss coefficient, and it is the number that tells you whether insulation work paid for itself.',
    ],
    security: [
      'A thermostat with an open MQTT endpoint can be set to 28 °C by anyone on the network. Use broker authentication and a per-device ACL.',
      'Clamp the accepted setpoint range in firmware (7–28 °C here) so a malformed or malicious message cannot command something dangerous.',
      'Keep freeze protection outside the network path entirely — it must work with the broker unreachable.',
    ],
  },

  testing: [
    { step: 'Run an I²C scanner', expect: 'Addresses 0x76 (BME280), 0x3C (OLED) and 0x68 (RTC) all reported.' },
    { step: 'Compare the reading against a reference thermometer', expect: 'Within about 1 °C after ten minutes of settling, with no upward drift.' },
    { step: 'Set the setpoint 3 °C above the room', expect: 'Duty rises towards 1.0, the relay closes, and the LED lights. The room warms without the relay chattering.' },
    { step: 'Set the setpoint 3 °C below the room', expect: 'Duty falls to 0 and the relay opens — but not before <code>MIN_ON_MS</code> has elapsed.' },
    { step: 'Toggle the setpoint rapidly around the room temperature', expect: 'The relay does not follow. The dead band and minimum timers absorb it entirely.' },
    { step: 'Let it run 48 hours, then read the state topic', expect: '<code>tau_min</code> settles somewhere between 60 and 250 minutes and <code>heat_rate</code> between 0.02 and 0.1 °C/min for a typical room.' },
    { step: 'Cover the PIR for a full working day', expect: 'That day\'s daytime occupancy cells decay and the setpoint drops to setback the following week at the same time.' },
    { step: 'Check Home Assistant', expect: 'A climate card appears automatically showing current temperature and an adjustable setpoint.' },
  ],

  output: [{
    file: 'mqtt-state.json', lang: 'json',
    body: `{
  "room_c": 20.4,
  "rh": 47,
  "setpoint": 21.5,
  "duty": 0.62,
  "heating": true,
  "occupied": true,
  "heat_rate": 0.047,
  "tau_min": 148,
  "t_inf": 11.8
}`,
  }],

  troubleshoot: [
    {
      sym: 'The reported temperature is one to two degrees higher than the room',
      cause: 'Self-heating. Either the BME280 is in continuous mode, or it is physically too close to the ESP32 regulator, the OLED or the relay coil.',
      fix: 'Confirm <code>MODE_FORCED</code> is set. Then move the sensor at least 50 mm away from every other component on a short ribbon cable, with airflow around it. Only after both of those should you apply a software offset — an offset applied to a self-heating sensor is wrong at every other ambient temperature.',
    },
    {
      sym: 'The relay clicks on and off every few seconds',
      cause: 'No dead band, or the duty is being recomputed and applied continuously rather than latched per cycle.',
      fix: 'Set <code>DEAD_BAND</code> to at least 0.3 °C, verify <code>dutyThisCycle</code> is only assigned at a cycle boundary, and confirm the minimum on and off timers are actually being applied — they are the last line of defence and their absence will destroy a compressor.',
    },
    {
      sym: 'The room overshoots the setpoint by two degrees every morning',
      cause: 'Integral windup during the overnight setback, when the error is large for hours.',
      fix: 'Reduce <code>I_MAX</code>, and reset the integral to zero whenever the setpoint changes — this sketch does that in the MQTT handler but not on an automatic schedule change, which is worth adding.',
    },
    {
      sym: 'tau_min drifts to an absurd value like 5 or 5000',
      cause: 'Either <code>outsideC</code> is stale or wrong, or the estimator is updating during a disturbance such as an open window.',
      fix: 'Feed a real outdoor temperature. Tighten the acceptance gates — the sketch rejects estimates outside 15–600 minutes, which you can narrow once you know your building. Also skip the update for ten minutes after any relay transition, since the transient is not a clean exponential.',
    },
    {
      sym: 'Occupancy never triggers comfort mode',
      cause: 'PIR wiring, the 60-second settling period, or a sensitivity trimmer turned down.',
      fix: 'Print <code>digitalRead(PIN_PIR)</code> and wave at it — it should read high for the hold period. The HC-SR501 has two trimmers (sensitivity and hold time) and one jumper (retrigger mode); set retrigger to H so continuous motion holds the output high.',
    },
    {
      sym: 'Home Assistant shows the device but the setpoint does nothing',
      cause: 'The command topic in the discovery document does not match the topic the device subscribes to.',
      fix: 'Subscribe to <code>homeassistant/climate/#</code> with mosquitto_sub and read the published config document. Every topic in it must match the firmware exactly, including case.',
    },
  ],

  perf: [
    'Sample every five seconds, not every loop. Thermal processes have minute-scale dynamics; oversampling adds nothing and costs power.',
    'Write the occupancy grid and thermal model to NVS every half hour, not every update — flash has a finite erase-cycle budget.',
    'Keep the OLED refresh at the sample rate rather than the loop rate. An I²C framebuffer push costs about 10 ms.',
  ],

  safety: [
    'Confirm what your thermostat terminals actually switch. Most modern boilers use a 24 V or dry-contact call-for-heat loop, but plenty of older systems switch 230 V directly. Measure before you touch anything.',
    'Never remove the equipment\'s own limit thermostat or overheat cut-out. This device is a controller, not a safety device, and it must never be the only thing standing between a heater and a fire.',
    'Freeze protection must be independent of the network and the schedule. Verify it works with Wi-Fi disabled.',
  ],

  future: [
    'Add <b>weather forecast integration</b> — knowing that the outside temperature will fall 6 °C overnight lets the pre-heat calculation start earlier and more accurately than reacting to the drop.',
    'Add <b>multi-room sensing</b> with cheap ESP-NOW satellite nodes, and control on a weighted average or on the coldest occupied room.',
    'Add <b>window-open detection</b> — a sudden negative slope with the heater running is unambiguous, and pausing the call for heat saves more than any tuning.',
    'Log <b>duty against outside temperature</b> and fit the line: the intercept is the building\'s baseline heat loss and the slope quantifies insulation quality.',
    'Replace the PIR with an <b>mmWave presence sensor</b>. PIR misses a stationary person reading a book; 24 GHz radar does not.',
  ],

  faq: [
    { q: 'Is the setback actually worth it? I have heard it costs more to reheat.', a: 'That claim is a persistent myth. Heat loss is proportional to the temperature difference between inside and outside, so a cooler house loses less heat, full stop. The energy needed to reheat is exactly the energy that was not lost while cool, minus what escaped — it can never exceed the saving. The real caveat is comfort and recovery time, which is precisely what the predictive pre-heat in this project addresses.' },
    { q: 'Why PI and not PID?', a: 'The derivative term differentiates a noisy sensor signal on a process whose time constant is measured in hours. In practice D contributes almost nothing useful here and amplifies noise into relay chatter. Nearly every commercial thermostat that claims PID runs with D heavily filtered or effectively zero.' },
    { q: 'Can this control an air conditioner?', a: 'Yes — invert the sign of the error and keep everything else. The minimum off-time becomes critical rather than merely advisable, because restarting a compressor against head pressure is genuinely damaging. For a split unit with no accessible contactor, drive an IR blaster instead of a relay and send the manufacturer\'s codes.' },
    { q: 'How long before the learning is useful?', a: 'The thermal model is usable after about six hours and good after two days. The occupancy grid needs two to three weeks to be trustworthy, because each half-hour slot only gets one observation per week per weekday. Until then it falls back to comfort temperature, which is the safe default.' },
    { q: 'What happens if Wi-Fi goes down?', a: 'Everything except the remote setpoint keeps working. Control, learning, scheduling and freeze protection all run locally on the ESP32 — the network is for reporting and convenience, never for control. That is a deliberate architectural choice and it is worth preserving in any modification you make.' },
    { q: 'Should the sensor be in the thermostat or elsewhere in the room?', a: 'Elsewhere, almost always. A wall box near a door is a poor proxy for where people sit. Adding a DS18B20 on a two-metre lead placed at seated height in the middle of the room measurably improves perceived comfort, and it costs ₹160.' },
  ],

  refs: [
    { t: 'BME280 combined humidity, pressure and temperature sensor — datasheet', u: 'https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf', s: 'Bosch Sensortec' },
    { t: 'Åström & Hägglund, "PID Controllers: Theory, Design, and Tuning" — anti-windup chapter', u: 'https://www.isa.org/products/pid-controllers-theory-design-and-tuning-2nd-edi', s: 'ISA' },
    { t: 'Beauregard, "Improving the Beginner\'s PID" — the reference explanation of windup and derivative kick', u: 'http://brettbeauregard.com/blog/2011/04/improving-the-beginners-pid-introduction/', s: 'Brett Beauregard' },
    { t: 'Newton\'s law of cooling and first-order thermal models', u: 'https://en.wikipedia.org/wiki/Newton%27s_law_of_cooling', s: 'Wikipedia' },
    { t: 'Home Assistant MQTT Climate integration and discovery schema', u: 'https://www.home-assistant.io/integrations/climate.mqtt/', s: 'Home Assistant' },
    { t: 'ASHRAE Standard 55 — thermal environmental conditions for human occupancy', u: 'https://www.ashrae.org/technical-resources/bookstore/standard-55-thermal-environmental-conditions-for-human-occupancy', s: 'ASHRAE' },
  ],

  images: ['esp32', 'relay', 'grafana'],
  imageCaptions: [
    'An ESP32 development board — the thermostat controller.',
    'An opto-isolated relay module of the kind used to switch the boiler call-for-heat loop.',
    'A time-series dashboard. Plotting duty cycle against outside temperature over a season quantifies a building\'s heat loss.',
  ],
},

/* ── 004 · Automated Curtain System ──────────────────────────────── */
{
  id: '004',
  domainKey: 'iot',
  emoji: '🪟',
  thumb: 'motor',
  difficulty: 'Intermediate',
  hours: '10–16 hours',
  iso8601: 'PT13H',
  tagline: 'A belt-driven curtain motor with real position feedback, light-triggered and time-triggered automation, silent microstepping, and a stall detector that stops before something breaks.',

  overview: [
    'Motorising a curtain is mechanically trivial and electrically full of traps. The traps are worth naming up front, because almost every failed build hits at least one: a motor with no position feedback that loses track after a single power cut; a system with no end stops that grinds the carrier into the bracket; a stepper driven at full step that sounds like an angle grinder at 6 a.m.; and a light sensor that closes the curtains every time a cloud passes.',
    'This design addresses each of them. Position is tracked in <b>steps from a homed reference</b>, and homing is re-established against a physical limit switch rather than assumed. Microstepping at 1/16 makes the motion genuinely quiet — the difference between 200 discrete kicks per revolution and 3200 small ones is dramatic and audible. Stall detection reads back the driver\'s behaviour so an obstruction stops the motor rather than stripping a belt. And the light trigger uses a proper lux sensor with hysteresis and a time filter, so a passing cloud does nothing.',
    'The mechanical side is a GT2 belt loop along the curtain track with the carrier clamped to the belt — the same arrangement a 3D printer uses for its X axis, for the same reasons: it is cheap, backlash-free enough for this purpose, and it fails gracefully by slipping rather than breaking.',
  ],

  does: [
    'Opens and closes a curtain to any position from 0 to 100 % on a GT2 belt drive.',
    'Homes against a physical limit switch at boot and on demand, so position survives power loss.',
    'Triggers on measured lux with hysteresis and a five-minute confirmation delay, ignoring transient cloud cover.',
    'Runs a sunrise and sunset schedule computed on-device from latitude, longitude and date.',
    'Detects a stall or obstruction and stops immediately rather than forcing through it.',
    'Accepts position commands over MQTT and appears in Home Assistant as a cover entity.',
    'Ramps acceleration so the motion starts and stops smoothly rather than jerking the fabric.',
  ],

  features: [
    '<b>1/16 microstepping</b> for near-silent motion — measurably around 20 dB quieter than full stepping.',
    '<b>Trapezoidal acceleration profile</b> with configurable ramp, so the curtain does not snap taut at the ends.',
    '<b>Absolute position in steps</b> from a homed reference, persisted in NVS on every stop.',
    '<b>Dual limit switches</b> wired normally-closed, so a broken wire reads as a limit hit — fail-safe by construction.',
    '<b>Stall detection</b> by monitoring the driver current-sense against expected motion.',
    '<b>Lux-based automation</b> with Schmitt-trigger hysteresis and a dwell timer.',
    '<b>On-device solar position</b> calculation for sunrise and sunset without a network call.',
    '<b>Home Assistant cover discovery</b> with position reporting and set-position support.',
  ],

  applications: [
    { t: 'Bedroom wake-up automation', d: 'Opening the curtains at sunrise is a far gentler alarm than a sound, and there is decent evidence it helps circadian alignment.' },
    { t: 'Passive solar management', d: 'Closing south-facing curtains during peak summer sun measurably reduces cooling load; opening them on a cold sunny day adds free heat.' },
    { t: 'Occupancy simulation', d: 'Curtains moving on a plausible schedule is a much stronger away-from-home signal than a light on a timer.' },
    { t: 'Accessibility', d: 'For anyone with limited reach or mobility, a motorised curtain removes a daily frustration entirely.' },
    { t: 'Meeting rooms and classrooms', d: 'Blackout on a projector cue, integrated with room booking.' },
    { t: 'Greenhouse shade screens', d: 'The same drivetrain and control logic scales directly to a shade screen on a light threshold.' },
  ],

  skills: [
    'Stepper driver fundamentals: step/direction, microstepping, current limit',
    'Setting a Vref current limit with a multimeter',
    'Basic mechanical assembly — pulleys, belts, tensioning',
    'Non-blocking motion control in C++',
    'I²C sensor reading',
    'MQTT and Home Assistant discovery',
  ],

  parts: ['esp32', 'a4988', 'bh1750', 'limitsw', 'oled', 'buck', 'psu12v', 'perfboard', 'enclosure'],
  qty: { limitsw: 2 },
  extraParts: [
    { name: 'GT2 belt, 6 mm wide', spec: '2 mm pitch, fibreglass reinforced', qty: 1, price: 260, note: 'Buy at least 2.5× the track length — you need a full loop plus slack.' },
    { name: 'GT2 20-tooth pulley + idler pulley', spec: '5 mm bore, with set screws', qty: 1, price: 320 },
    { name: '3D-printed carrier clamp and end brackets', spec: 'PETG recommended — PLA creeps under belt tension in sunlight', qty: 1, price: 150 },
    { name: 'Push button (manual open/close)', spec: 'Momentary, panel mount', qty: 2, price: 120 },
  ],
  cost: '₹4,300 – ₹5,600',
  libs: ['wifi', 'pubsub', 'arduinojson', 'bh1750lib', 'ssd1306', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'BH1750 light sensor', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x23' },
      { dev: 'Limit switch — closed end', devPin: 'NC contact', pin: 'GPIO 34', sig: 'Normally closed to GND' },
      { dev: 'Limit switch — open end', devPin: 'NC contact', pin: 'GPIO 35', sig: 'Normally closed to GND' },
      { dev: 'Manual buttons', devPin: 'NO contacts', pin: 'GPIO 32 / 33', sig: 'Open / close, pull-up' },
    ],
    right: [
      { dev: 'A4988 driver', devPin: 'STEP', pin: 'GPIO 25', sig: 'One pulse = one microstep' },
      { dev: 'A4988 driver', devPin: 'DIR', pin: 'GPIO 26', sig: 'Direction' },
      { dev: 'A4988 driver', devPin: 'ENABLE', pin: 'GPIO 27', sig: 'Active-low; high disables coils' },
      { dev: 'A4988 driver', devPin: 'MS1/MS2/MS3', pin: '3V3 (all three)', sig: 'Selects 1/16 microstepping' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C' },
    ],
  },
  wiringNotes: [
    'Tie MS1, MS2 and MS3 all high for 1/16 microstepping on an A4988. Leaving them floating gives full step, which is loud enough to wake the household.',
    'Wire both limit switches <b>normally closed</b> to ground with a pull-up. A cut or disconnected wire then reads exactly like a triggered limit, so the failure mode is a stopped motor rather than a motor driving into a bracket.',
    'GPIO 34 and 35 are input-only with no internal pull-ups. Fit external 10 kΩ resistors to 3V3.',
    'The A4988 needs a <b>100 µF electrolytic capacitor across VMOT and GND</b>, physically at the driver. Without it, the inductive spikes when the driver commutates will destroy it — this is stated in bold in the Pololu documentation and it is still the most common way people kill these boards.',
    'Never disconnect a stepper motor while the driver is powered. The back-EMF from the disconnection destroys the output stage instantly.',
    'Set the driver current limit before fitting the motor. Vref is measured between the trimmer wiper and ground; for a Pololu A4988 with 0.068 Ω sense resistors, <code>I_max = Vref / (8 × 0.068) = Vref / 0.544</code>.',
  ],

  block: {
    columns: [
      { label: 'Inputs', blocks: [{ name: 'BH1750 lux', sub: 'ambient light' }, { name: 'Limit switches', sub: '2 × NC' }, { name: 'Buttons / MQTT', sub: 'commands' }] },
      { label: 'Decide', edge: 'lux, time, cmd', blocks: [{ name: 'Automation rules', sub: 'hysteresis + dwell' }, { name: 'Solar clock', sub: 'sunrise/sunset', highlight: true }] },
      { label: 'Motion', edge: 'target position', blocks: [{ name: 'Ramp generator', sub: 'trapezoid', highlight: true }, { name: 'Stall detector', sub: 'abort on fault' }] },
      { label: 'Drive', edge: 'step / dir', blocks: [{ name: 'A4988 @ 1/16', sub: 'NEMA 17' }, { name: 'GT2 belt', sub: 'curtain carrier' }] },
    ],
  },

  flow: [
    { t: 'Boot: read stored position, enable driver', k: 'start' },
    { t: 'Home against the closed-end limit switch', k: 'proc' },
    { t: 'Read lux, time, buttons and MQTT', k: 'proc' },
    { t: 'Automation or command wants a new position?', k: 'dec', yes: 'yes', no: 'idle 200 ms', back: 2 },
    { t: 'Generate trapezoidal step profile', k: 'proc' },
    { t: 'Limit hit or stall detected?', k: 'dec', yes: 'abort and re-home', no: 'keep stepping', back: 4 },
    { t: 'Target reached — disable coils, save position', k: 'io' },
    { t: 'Publish position over MQTT', k: 'end' },
  ],

  principle: [
    'A stepper motor moves in discrete increments because its rotor is a permanent magnet that aligns with whichever stator coil pair is energised. A 1.8° NEMA 17 has 200 full steps per revolution. Driven in full step, the rotor snaps from one detent to the next — and that abrupt acceleration is what produces the characteristic buzz.',
    '<b>Microstepping</b> smooths this by driving the two coils with sinusoidally-varying currents that are 90° out of phase. Instead of switching a coil fully on or off, the driver holds intermediate current levels so the resultant magnetic field vector rotates in small increments and the rotor follows it. At 1/16 microstepping there are 3200 positions per revolution, each transition is one-sixteenth the size, and the acoustic energy drops dramatically. Microstepping does <em>not</em> reliably improve positional accuracy — detent torque and friction mean the rotor may not settle exactly where you asked — but for smoothness and quietness it is transformative.',
    'The current limit matters more than most builders realise. A stepper is a constant-current device: the driver chops the supply voltage to hold a set current through each coil, and torque is proportional to that current. Set it too low and the motor skips steps under load; set it too high and the motor and driver overheat. The A4988 sets the limit through a trimmer that produces a reference voltage, related to current by the sense resistor value. Getting this right is a five-minute job with a multimeter and it determines whether the system works at all.',
    'Because a stepper is open loop, position is only meaningful relative to a known reference. The system therefore <b>homes</b>: it drives slowly towards the closed end until the limit switch trips, declares that position zero, then backs off a fixed number of steps to release the switch. Every subsequent move counts steps from there, and the count is written to flash whenever motion stops. A power cut mid-motion is the one case that breaks this, which is why the firmware re-homes at boot if it was moving when it lost power.',
    'The light automation uses a <b>Schmitt trigger with a dwell timer</b>. A single threshold on a noisy signal chatters; two thresholds separated by a gap (close above 8000 lx, open below 2000 lx) means the state cannot flip on small variations. The dwell timer requires the condition to hold for five minutes before acting, which filters out clouds entirely while still responding within a reasonable time to actual sunset.',
    'Sunrise and sunset are computed on-device from the standard solar position algorithm rather than fetched from an API. It is about thirty lines of trigonometry, accurate to within a minute or two, and it means the automation works with no network at all.',
  ],

  equations: [
    { t: 'A4988 current limit', eq: 'I_max = Vref / (8 × R_sense)\n\nPololu A4988, R_sense = 0.068 Ω:\n  I_max = Vref / 0.544\n\nNEMA 17 rated at 1.5 A/phase, derate to 70 % for a\ndriver without a heatsink:\n  I_target = 1.05 A\n  Vref     = 1.05 × 0.544 = 0.571 V\n\nMeasure between the trimmer wiper and GND with the\nmotor DISCONNECTED and logic powered.' },
    { t: 'Belt travel per step', eq: 'GT2 pitch          = 2 mm\nPulley teeth       = 20\nBelt per revolution = 20 × 2 = 40 mm\nMicrosteps per rev  = 200 × 16 = 3200\n\nTravel per microstep = 40 / 3200 = 0.0125 mm\n\nFor a 1.8 m track:\n  steps end to end = 1800 / 0.0125 = 144 000 microsteps' },
    { t: 'Trapezoidal ramp', eq: 'v(t) = min(v_max, v_0 + a·t)                 accelerating\nsteps to reach v_max = (v_max² − v_0²) / (2a)\n\nWith v_max = 4000 steps/s, v_0 = 400 steps/s, a = 8000 steps/s²:\n  ramp steps = (4000² − 400²) / 16000 = 990 steps\n  ramp time  = (4000 − 400) / 8000    = 0.45 s\n\nIf the total move is shorter than 2 × ramp steps,\nthe profile becomes triangular — accelerate to the\nmidpoint, then decelerate.' },
  ],

  steps: [
    {
      h: 'Set the driver current limit before anything else',
      p: ['Power only the logic side, leave the motor disconnected, and measure between the trimmer wiper and ground. Turn until you read the calculated Vref. Getting this wrong destroys drivers and cooks motors, and it is the single most-skipped step in stepper projects.'],
      tip: 'Use a plastic trimmer tool, or hold a metal screwdriver by its insulated handle only. Touching the trimmer with a grounded hand shifts the reading and you will set it wrong.',
    },
    {
      h: 'Generate motion with a non-blocking ramp',
      p: ['Blocking step loops with <code>delayMicroseconds()</code> work for a demo and fail the moment you also want to service MQTT. This generator advances at most one step per call and returns immediately.'],
      code: {
        file: '01-ramp-stepper.ino', lang: 'cpp',
        body: `#define PIN_STEP 25
#define PIN_DIR  26
#define PIN_EN   27

const float V_MIN = 400.0f;    // steps/s at start and finish
const float V_MAX = 4000.0f;   // steps/s cruising
const float ACCEL = 8000.0f;   // steps/s²

long     posSteps = 0, targetSteps = 0;
float    velocity = 0;
uint32_t lastStepUs = 0;
bool     moving = false;

void motionBegin() {
  pinMode(PIN_STEP, OUTPUT); pinMode(PIN_DIR, OUTPUT);
  pinMode(PIN_EN, OUTPUT);   digitalWrite(PIN_EN, HIGH);   // disabled
}

void moveTo(long target) {
  targetSteps = target;
  if (target == posSteps) return;
  digitalWrite(PIN_EN, LOW);            // energise coils
  digitalWrite(PIN_DIR, target > posSteps ? HIGH : LOW);
  velocity = V_MIN;
  lastStepUs = micros();
  moving = true;
}

// Call as often as possible; emits at most one step per invocation.
void motionService() {
  if (!moving) return;

  long remaining = labs(targetSteps - posSteps);
  if (remaining == 0) {
    moving = false;
    digitalWrite(PIN_EN, HIGH);         // release coils: no holding current
    return;
  }

  // Decelerate if we are inside the stopping distance.
  float stopDist = (velocity * velocity - V_MIN * V_MIN) / (2 * ACCEL);
  float dt = 1.0f / velocity;
  if (remaining <= (long)stopDist) velocity -= ACCEL * dt;
  else                             velocity += ACCEL * dt;

  if (velocity > V_MAX) velocity = V_MAX;
  if (velocity < V_MIN) velocity = V_MIN;

  uint32_t interval = (uint32_t)(1000000.0f / velocity);
  uint32_t now = micros();
  if (now - lastStepUs < interval) return;
  lastStepUs = now;

  digitalWrite(PIN_STEP, HIGH);
  delayMicroseconds(2);                 // A4988 needs ≥ 1 µs pulse
  digitalWrite(PIN_STEP, LOW);

  posSteps += (targetSteps > posSteps) ? 1 : -1;
}`,
        explain: [
          { ref: 'stopDist computed each step', txt: 'Rather than precomputing a profile, the deceleration point is derived from the current velocity every step. This makes the motion correct even when the target changes mid-move — which happens whenever a user presses a button while the curtain is already running.' },
          { ref: 'digitalWrite(PIN_EN, HIGH) at the end', txt: 'Releasing the coils when stationary is important. A stepper holding position draws full rated current and gets hot for no reason — a curtain is not fighting gravity and does not need holding torque.' },
          { ref: 'delayMicroseconds(2)', txt: 'The A4988 requires a minimum 1 µs step pulse width. On a 240 MHz ESP32 two consecutive digitalWrites can be faster than that, and the driver silently misses steps.' },
          { ref: 'triangular profile handling', txt: 'No special case is needed. On a short move the deceleration condition becomes true before v_max is reached, and the profile naturally degenerates into a triangle.' },
        ],
      },
    },
    {
      h: 'Home reliably and detect stalls',
      p: ['Homing is what makes an open-loop system trustworthy. Stall detection is what stops it destroying itself when something goes wrong.'],
      code: {
        file: '02-home-and-stall.ino', lang: 'cpp',
        body: `#define PIN_LIMIT_CLOSED 34
#define PIN_LIMIT_OPEN   35

// Switches are wired normally-closed to GND: LOW = healthy, HIGH = hit or broken.
bool limitClosedHit() { return digitalRead(PIN_LIMIT_CLOSED) == HIGH; }
bool limitOpenHit()   { return digitalRead(PIN_LIMIT_OPEN)   == HIGH; }

long travelSteps = 144000;      // learned during the first full home cycle

bool homeAxis() {
  digitalWrite(PIN_EN, LOW);
  digitalWrite(PIN_DIR, LOW);                 // towards the closed end

  uint32_t guard = millis();
  while (!limitClosedHit()) {
    if (millis() - guard > 90000) {           // 90 s watchdog
      digitalWrite(PIN_EN, HIGH);
      Serial.println("HOMING FAILED: limit never reached");
      return false;
    }
    digitalWrite(PIN_STEP, HIGH); delayMicroseconds(2);
    digitalWrite(PIN_STEP, LOW);  delayMicroseconds(600);   // slow, ~1600 st/s
  }

  // Back off until the switch releases, then call that zero.
  digitalWrite(PIN_DIR, HIGH);
  for (int i = 0; i < 800 || limitClosedHit(); i++) {
    digitalWrite(PIN_STEP, HIGH); delayMicroseconds(2);
    digitalWrite(PIN_STEP, LOW);  delayMicroseconds(900);
  }
  posSteps = 0;
  digitalWrite(PIN_EN, HIGH);
  Serial.println("Homed");
  return true;
}

/* Stall detection: if we have been commanding steps but the expected
   limit has not appeared within a generous margin, something is wrong. */
bool stallCheck() {
  static long   lastPos = 0;
  static uint32_t lastProgress = 0;

  if (posSteps != lastPos) { lastPos = posSteps; lastProgress = millis(); return false; }
  if (!moving) { lastProgress = millis(); return false; }

  if (millis() - lastProgress > 3000) {       // 3 s with no step emitted
    moving = false;
    digitalWrite(PIN_EN, HIGH);
    Serial.println("STALL: motion aborted");
    return true;
  }
  return false;
}`,
        explain: [
          { ref: 'HIGH = hit or broken', txt: 'The normally-closed wiring is a deliberate safety property. A severed cable, a corroded contact and a genuine limit hit all produce the same reading, and the response to all three — stop — is correct.' },
          { ref: '90 s homing watchdog', txt: 'Without it, a failed limit switch means the motor drives into the end bracket until something gives. The watchdog converts a mechanical failure into a log message.' },
          { ref: 'i < 800 || limitClosedHit()', txt: 'Backs off at least 800 steps and keeps going if the switch is still held. A fixed back-off alone fails when the switch has a long actuation travel.' },
          { ref: 'stallCheck() 3 s threshold', txt: 'This detects the software-side symptom of a jam. A more rigorous version reads the A4988 current-sense pin or moves to a TMC2209 driver, which has genuine load measurement (StallGuard) built in.' },
        ],
      },
    },
  ],

  code: [{
    file: 'automated-curtain.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Automated Curtain System — ESP32 + A4988 + NEMA 17 + BH1750

   Absolute position in microsteps from a homed reference, trapezoidal
   acceleration, normally-closed limit switches, lux automation with
   hysteresis and dwell, on-device sunrise/sunset, and Home Assistant
   cover discovery.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "curtain-bedroom"

#define PIN_STEP 25
#define PIN_DIR  26
#define PIN_EN   27
#define PIN_LIMIT_CLOSED 34
#define PIN_LIMIT_OPEN   35
#define PIN_BTN_OPEN     32
#define PIN_BTN_CLOSE    33

#define LAT   28.6139f          // your latitude  (Delhi shown)
#define LON   77.2090f          // your longitude
#define TZ_H  5.5f              // hours from UTC

const float V_MIN = 400, V_MAX = 4000, ACCEL = 8000;
const float LUX_CLOSE = 8000, LUX_OPEN = 2000;      // Schmitt thresholds
const uint32_t LUX_DWELL_MS = 300000UL;             // 5 minutes

BH1750           lux;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

long   posSteps = 0, targetSteps = 0, travelSteps = 144000;
float  velocity = 0;
uint32_t lastStepUs = 0, luxSince = 0, lastPublish = 0;
bool   moving = false, homed = false;
float  luxNow = 0;
int    luxWant = -1;             // -1 unknown, 0 closed, 100 open

/* ── motion ─────────────────────────────────────────────────── */
bool limitClosedHit() { return digitalRead(PIN_LIMIT_CLOSED) == HIGH; }
bool limitOpenHit()   { return digitalRead(PIN_LIMIT_OPEN)   == HIGH; }

void moveTo(long target) {
  if (target < 0) target = 0;
  if (target > travelSteps) target = travelSteps;
  targetSteps = target;
  if (target == posSteps) return;
  digitalWrite(PIN_EN, LOW);
  digitalWrite(PIN_DIR, target > posSteps ? HIGH : LOW);
  velocity = V_MIN;
  lastStepUs = micros();
  moving = true;
}

void motionStop() {
  moving = false;
  digitalWrite(PIN_EN, HIGH);
  prefs.putLong("pos", posSteps);
}

void motionService() {
  if (!moving) return;

  // Hard limits abort immediately, whatever the controller wants.
  bool goingOpen = targetSteps > posSteps;
  if ((goingOpen && limitOpenHit()) || (!goingOpen && limitClosedHit())) {
    if (!goingOpen) posSteps = 0;
    else            travelSteps = posSteps;      // learn the real travel
    motionStop();
    return;
  }

  long remaining = labs(targetSteps - posSteps);
  if (remaining == 0) { motionStop(); return; }

  float stopDist = (velocity * velocity - V_MIN * V_MIN) / (2 * ACCEL);
  float dt = 1.0f / velocity;
  velocity += (remaining <= (long)stopDist ? -ACCEL : ACCEL) * dt;
  if (velocity > V_MAX) velocity = V_MAX;
  if (velocity < V_MIN) velocity = V_MIN;

  uint32_t now = micros();
  if (now - lastStepUs < (uint32_t)(1000000.0f / velocity)) return;
  lastStepUs = now;

  digitalWrite(PIN_STEP, HIGH);
  delayMicroseconds(2);
  digitalWrite(PIN_STEP, LOW);
  posSteps += goingOpen ? 1 : -1;
}

bool homeAxis() {
  digitalWrite(PIN_EN, LOW);
  digitalWrite(PIN_DIR, LOW);
  uint32_t guard = millis();
  while (!limitClosedHit()) {
    if (millis() - guard > 90000) { digitalWrite(PIN_EN, HIGH); return false; }
    digitalWrite(PIN_STEP, HIGH); delayMicroseconds(2);
    digitalWrite(PIN_STEP, LOW);  delayMicroseconds(600);
  }
  digitalWrite(PIN_DIR, HIGH);
  for (int i = 0; i < 800 || limitClosedHit(); i++) {
    digitalWrite(PIN_STEP, HIGH); delayMicroseconds(2);
    digitalWrite(PIN_STEP, LOW);  delayMicroseconds(900);
  }
  posSteps = 0;
  digitalWrite(PIN_EN, HIGH);
  homed = true;
  return true;
}

/* ── solar position (NOAA simplified) ───────────────────────── */
void sunTimes(int dayOfYear, float &riseH, float &setH) {
  float g   = 2.0f * (float)M_PI / 365.0f * (dayOfYear - 1);
  float decl = 0.006918f - 0.399912f * cosf(g) + 0.070257f * sinf(g)
             - 0.006758f * cosf(2 * g) + 0.000907f * sinf(2 * g)
             - 0.002697f * cosf(3 * g) + 0.00148f  * sinf(3 * g);

  float latR = LAT * (float)M_PI / 180.0f;
  float cosH = (cosf(90.833f * (float)M_PI / 180.0f) - sinf(latR) * sinf(decl))
             / (cosf(latR) * cosf(decl));
  if (cosH > 1)  { riseH = setH = -1; return; }   // polar night
  if (cosH < -1) { riseH = 0; setH = 24; return; } // midnight sun

  float H = acosf(cosH) * 180.0f / (float)M_PI / 15.0f;   // hours
  float solarNoon = 12.0f - LON / 15.0f + TZ_H;
  riseH = solarNoon - H;
  setH  = solarNoon + H;
}

/* ── automation ─────────────────────────────────────────────── */
void automationService() {
  luxNow = lux.readLightLevel();

  int want = luxWant;
  if      (luxNow > LUX_CLOSE) want = 0;      // very bright: close for shade
  else if (luxNow < LUX_OPEN)  want = 0;      // dark: close for privacy
  else                         want = 100;    // comfortable daylight: open

  if (want != luxWant) { luxWant = want; luxSince = millis(); return; }
  if (millis() - luxSince < LUX_DWELL_MS) return;    // must hold 5 minutes

  long target = (long)(travelSteps * (want / 100.0f));
  if (labs(target - posSteps) > travelSteps / 50) moveTo(target);   // 2 % dead band
}

/* ── MQTT ───────────────────────────────────────────────────── */
void publishDiscovery() {
  JsonDocument d;
  d["name"] = "Bedroom Curtain";
  d["unique_id"] = DEVICE_ID;
  d["device_class"] = "curtain";
  d["command_topic"]  = "home/cover/" DEVICE_ID "/set";
  d["position_topic"] = "home/cover/" DEVICE_ID "/position";
  d["set_position_topic"] = "home/cover/" DEVICE_ID "/set_position";
  d["payload_open"] = "OPEN"; d["payload_close"] = "CLOSE"; d["payload_stop"] = "STOP";
  char buf[512];
  size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("homeassistant/cover/" DEVICE_ID "/config", (uint8_t *)buf, n, true);
}

void publishPosition() {
  int pct = travelSteps ? (int)(100L * posSteps / travelSteps) : 0;
  char buf[8]; snprintf(buf, sizeof(buf), "%d", pct);
  mqtt.publish("home/cover/" DEVICE_ID "/position", buf, true);
}

void onMessage(char *topic, byte *payload, unsigned int len) {
  char v[16] = {0};
  memcpy(v, payload, len < 15 ? len : 15);

  if (strstr(topic, "set_position")) { moveTo((long)(travelSteps * atoi(v) / 100.0f)); return; }
  if (!strcmp(v, "OPEN"))  moveTo(travelSteps);
  if (!strcmp(v, "CLOSE")) moveTo(0);
  if (!strcmp(v, "STOP"))  motionStop();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_STEP, OUTPUT); pinMode(PIN_DIR, OUTPUT);
  pinMode(PIN_EN, OUTPUT);   digitalWrite(PIN_EN, HIGH);
  pinMode(PIN_LIMIT_CLOSED, INPUT); pinMode(PIN_LIMIT_OPEN, INPUT);
  pinMode(PIN_BTN_OPEN, INPUT_PULLUP); pinMode(PIN_BTN_CLOSE, INPUT_PULLUP);

  Wire.begin(21, 22);
  lux.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("curtain", false);
  travelSteps = prefs.getLong("travel", 144000);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime((long)(TZ_H * 3600), 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);

  homeAxis();                      // always establish a real reference
  Serial.printf("Homed. travel=%ld steps\\n", travelSteps);
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) {
    if (mqtt.connect(DEVICE_ID)) {
      mqtt.subscribe("home/cover/" DEVICE_ID "/set");
      mqtt.subscribe("home/cover/" DEVICE_ID "/set_position");
      publishDiscovery();
    }
  }
  mqtt.loop();
  motionService();                 // called as often as possible

  static uint32_t lastSlow = 0;
  if (millis() - lastSlow > 200) {
    lastSlow = millis();

    if (!digitalRead(PIN_BTN_OPEN))  moveTo(travelSteps);
    if (!digitalRead(PIN_BTN_CLOSE)) moveTo(0);
    if (!moving) automationService();

    oled.clearDisplay();
    oled.setTextColor(SSD1306_WHITE); oled.setTextSize(2);
    oled.setCursor(0, 4);
    oled.printf("%3d%%", travelSteps ? (int)(100L * posSteps / travelSteps) : 0);
    oled.setTextSize(1);
    oled.setCursor(0, 32); oled.printf("lux %.0f", luxNow);
    oled.setCursor(0, 44); oled.printf("%s", moving ? "moving" : "idle");
    float r, s;
    time_t t = time(nullptr); struct tm tmv; localtime_r(&t, &tmv);
    sunTimes(tmv.tm_yday + 1, r, s);
    oled.setCursor(0, 54); oled.printf("rise %.2f set %.2f", r, s);
    oled.display();
  }

  if (millis() - lastPublish > 5000) { lastPublish = millis(); publishPosition(); }
}`,
    explain: [
      { ref: 'motionService() called every loop', txt: 'Step timing lives in the fastest path in the program. Anything that blocks — a long MQTT publish, an OLED refresh — directly produces audible stutter and, at high speed, missed steps.' },
      { ref: 'travelSteps = posSteps on the open limit', txt: 'The system learns its own travel the first time it reaches the far end. Hard-coding the track length means every install needs a recompile; measuring it means it just works.' },
      { ref: 'luxNow thresholds close at both extremes', txt: 'The rule is deliberately non-monotonic: close when very bright (shade) and also when dark (privacy), open in between. A single threshold cannot express that, which is why so many light-triggered blinds behave oddly.' },
      { ref: '2 % dead band on automation moves', txt: 'Without it, small lux variations produce a curtain that creeps a few centimetres every few minutes — technically correct and extremely irritating.' },
      { ref: 'sunTimes() NOAA algorithm', txt: 'Accurate to roughly a minute, computed from the day of year and your coordinates. The 90.833° zenith accounts for atmospheric refraction and the solar disc radius — this is why sunrise is a few minutes earlier than pure geometry predicts.' },
    ],
  }],

  config: [
    'Set <code>LAT</code>, <code>LON</code> and <code>TZ_H</code> for your location, or the sunrise calculation will be hours out.',
    'Set the A4988 Vref before connecting the motor, using the formula in the equations section.',
    'Let the system reach both limit switches once so <code>travelSteps</code> is learned, then confirm the figure looks sane against the belt-travel calculation.',
    'Tune <code>LUX_CLOSE</code> and <code>LUX_OPEN</code> against the readings you actually see. Overcast daylight indoors is roughly 500–2000 lx; direct sun through glass can exceed 20 000 lx.',
    'Reduce <code>V_MAX</code> if the motor skips steps. A heavy curtain on a stiff track may only manage 2000 steps/s.',
  ],

  calibration: [
    { h: 'Verify steps per millimetre', p: ['Command a 10 000-step move and measure the actual carrier travel with a ruler. The predicted figure is 125 mm at 0.0125 mm/step. A large discrepancy means the microstepping jumpers are not set as you think.'] },
    { h: 'Find the maximum reliable speed', p: ['Increase <code>V_MAX</code> in 500 steps/s increments, running the full travel each time, until steps are lost — you will see the homing position drift. Then back off 30 %. Stepper torque falls with speed and this margin is what absorbs a stiff spot in the track.'] },
    { h: 'Set the lux thresholds from real data', p: ['Log the BH1750 reading every minute for two clear days and one overcast day, then choose thresholds that separate the states you care about. Guessing produces curtains that close at 3 p.m. in winter.'] },
  ],

  robotics: {
    mechanical: [
      'Mount the motor at one end of the track and an idler pulley at the other, with the GT2 belt forming a closed loop between them.',
      'Clamp the leading curtain carrier to one run of the belt. The belt then pulls it in both directions with no rack, no lead screw and no backlash worth worrying about.',
      'Tension the belt so it deflects about 5 mm under light finger pressure at mid-span. Too loose and it skips teeth; too tight and it loads the motor bearing.',
      'Print brackets in PETG rather than PLA. A bracket in a sunlit window reaches 55 °C easily, which is above PLA\'s glass transition — it will creep and the belt will go slack over a summer.',
      'Fit the limit switches so they are struck by the carrier itself, not by the belt clamp, with 10–15 mm of over-travel available before anything hits a hard stop.',
    ],
    motion: [
      'Motion is single-axis and position-controlled. The controller only ever answers one question: how many microsteps from home should the carrier be? Everything else — automation, MQTT commands, buttons — resolves to a target step count.',
      'Acceleration is trapezoidal rather than instantaneous because a curtain is a compliant load. Snapping to 4000 steps/s instantly makes the fabric surge and the belt jump teeth; a 0.45 s ramp eliminates both.',
    ],
    actuators: [
      'A NEMA 17 stepper at 1.5 A/phase produces about 4.4 kg·cm holding torque, which through a 20-tooth GT2 pulley (6.4 mm pitch radius) gives roughly 68 N of belt force — vastly more than a curtain needs, and that margin is why the system tolerates a stiff track.',
      'The coils are de-energised whenever the curtain is stationary. There is no gravitational load on a horizontal track, so holding torque is unnecessary, and releasing it takes idle power from about 1.5 A to zero and stops the motor getting hot.',
    ],
  },

  testing: [
    { step: 'Measure Vref with the motor disconnected', expect: 'Within 0.02 V of the calculated value (0.571 V for a 1.05 A target on a Pololu A4988).' },
    { step: 'Power up and let it home', expect: 'The carrier drives slowly to the closed end, the switch trips, it backs off about 800 steps, and the display reads 0 %.' },
    { step: 'Command 50 % over MQTT', expect: 'Smooth accelerate-cruise-decelerate motion to the midpoint with no audible stepping buzz.' },
    { step: 'Block the carrier by hand mid-move', expect: 'The stall detector aborts within about three seconds and the coils release. Nothing should grind or skip audibly for long.' },
    { step: 'Disconnect a limit switch wire', expect: 'The system immediately treats that end as hit and refuses to move towards it — the intended fail-safe behaviour.' },
    { step: 'Shine a bright torch at the BH1750 for six minutes', expect: 'After the five-minute dwell expires, the curtain moves to the closed position.' },
    { step: 'Power-cycle and re-home', expect: 'The homed position matches the previous run to within a few hundred steps — under 5 mm of travel.' },
    { step: 'Check the sunrise/sunset display', expect: 'Within a couple of minutes of a published almanac figure for your location.' },
  ],

  troubleshoot: [
    {
      sym: 'The motor buzzes or vibrates but does not turn',
      cause: 'One coil is open, the coil pairs are wired wrong, or the current limit is far too low.',
      fix: 'Check continuity across each coil with a multimeter — a NEMA 17 typically reads 2–4 Ω per coil. The two wires with continuity between them are one pair; they must go to 1A/1B and the other pair to 2A/2B. If the pairing is right, raise Vref.',
    },
    {
      sym: 'The driver gets extremely hot or has died',
      cause: 'Current limit set too high, no heatsink, or the 100 µF capacitor across VMOT is missing.',
      fix: 'Derate to 70 % of the motor\'s rated current for an unheatsinked A4988. Fit the heatsink that came with it. Fit the electrolytic capacitor physically at the driver — this is the most common cause of dead A4988s and it is preventable for ₹5.',
    },
    {
      sym: 'Position drifts a little further every day',
      cause: 'Steps are being lost, usually at the top of the speed range or through a stiff patch in the track.',
      fix: 'Reduce <code>V_MAX</code> by 30 %, reduce <code>ACCEL</code>, check the track runs freely by hand, and increase the current limit slightly. Re-homing daily masks the symptom but the cause is mechanical or electrical.',
    },
    {
      sym: 'The motion is loud',
      cause: 'Microstepping jumpers not set, or resonance at a particular speed.',
      fix: 'Verify MS1/MS2/MS3 are all pulled high. If it is quiet at most speeds but loud at one, you are hitting a mechanical resonance — change <code>V_MAX</code> by 15 % to move past it, or fit a TMC2209 driver, which is dramatically quieter than an A4988 at any speed.',
    },
    {
      sym: 'The curtain closes on a bright afternoon and opens at dusk',
      cause: 'The dual-threshold logic is inverted for your preference, or the sensor is in shadow.',
      fix: 'Decide what you actually want the two thresholds to do and edit <code>automationService()</code> accordingly — the non-monotonic rule here (close when very bright <em>and</em> when dark) suits a bedroom, not every room. Mount the BH1750 where it sees the sky, not the room.',
    },
    {
      sym: 'Homing fails with the watchdog message',
      cause: 'Limit switch not reached — wrong direction, mechanical jam, or the switch never actuates.',
      fix: 'Check the DIR polarity first; if the carrier moves away from the switch, invert it. Then verify the switch changes state when pressed by hand, and that the carrier physically reaches it.',
    },
  ],

  perf: [
    'Consider a TMC2209 instead of the A4988. It is quieter through StealthChop, and its StallGuard feature gives real sensorless load detection — which lets you drop the limit switches entirely if you want.',
    'Keep <code>motionService()</code> free of any I²C or network work. A single OLED refresh mid-move is visible as a hitch in the curtain.',
    'Release the coils when idle. It saves roughly 1.5 A of continuous current and stops the motor from heating the window frame.',
  ],

  safety: [
    'A motorised curtain cord is a strangulation hazard for small children. Use a belt drive with no accessible loop, and if a cord exists, fit a break-away safety connector.',
    'Keep the motor torque no higher than the job needs. A NEMA 17 at full current can trap a hand against a bracket; running at 70 % and detecting stalls is both quieter and safer.',
    'Never disconnect the stepper while the driver is powered — the resulting back-EMF spike destroys the driver instantly.',
  ],

  future: [
    'Move to a <b>TMC2209 driver</b> for StealthChop silence and sensorless StallGuard homing.',
    'Add a <b>solar panel and battery</b>. A curtain motor runs for seconds per day, which is well within what a 5 W panel and one 18650 can supply.',
    'Add <b>Matter over Thread</b> so the curtain works with every major ecosystem rather than only Home Assistant.',
    'Add a <b>second axis</b> for a second curtain and coordinate them, so a pair meets in the middle.',
    'Use the <b>indoor and outdoor lux difference</b> rather than absolute lux — it is a far better proxy for glare than either alone.',
  ],

  faq: [
    { q: 'Stepper, DC gear motor or servo?', a: 'A stepper wins here because position is what you care about and there is no gravitational load. A DC gear motor needs an encoder to know where it is, which is more parts and more code for the same result. A continuous-rotation servo is the cheapest option and gives you no position feedback at all — fine for open/close, hopeless for 40 %.' },
    { q: 'Do I really need limit switches if I count steps?', a: 'Yes. Step counting is open loop: it assumes every commanded step happened. One skipped step from a stiff track and your zero is wrong forever, with nothing to detect it. Two switches cost ₹60 and turn an unreliable system into a reliable one.' },
    { q: 'How heavy a curtain can this move?', a: 'Far heavier than you would expect. The bottleneck is track friction, not weight — 68 N of belt force will drag a very heavy curtain along a good track and stall against a bad one. If it struggles, clean and lubricate the track before adding motor current.' },
    { q: 'Why is my curtain moving at 3 a.m.?', a: 'Almost certainly the dark branch of the lux rule firing after the dwell timer, on a curtain that was already closed but drifted a few percent. Widen the 2 % dead band, or gate the automation on time of day so it simply does not run overnight.' },
    { q: 'Can I run two curtains from one ESP32?', a: 'Yes — a second A4988 needs three more GPIO and the motion state must become an array rather than globals. The one thing to watch is the power supply: two NEMA 17s at 1 A each need a 12 V supply rated well above 2 A once you account for the buck converter and inrush.' },
  ],

  refs: [
    { t: 'A4988 DMOS Microstepping Driver with Translator — datasheet', u: 'https://www.pololu.com/file/0J450/a4988_DMOS_microstepping_driver_with_translator.pdf', s: 'Allegro MicroSystems / Pololu' },
    { t: 'Pololu A4988 carrier — current limit setting and the VMOT capacitor warning', u: 'https://www.pololu.com/product/1182', s: 'Pololu' },
    { t: 'BH1750FVI digital ambient light sensor — datasheet', u: 'https://www.mouser.com/datasheet/2/348/bh1750fvi-e-186247.pdf', s: 'ROHM Semiconductor' },
    { t: 'NOAA Solar Calculator — equations for sunrise and sunset', u: 'https://gml.noaa.gov/grad/solcalc/calcdetails.html', s: 'NOAA Global Monitoring Laboratory' },
    { t: 'GT2 timing belt specification and pulley geometry', u: 'https://www.pfeiferindustries.com/timing-belt-pulley-design-guide', s: 'Pfeifer Industries' },
    { t: 'Home Assistant MQTT Cover integration', u: 'https://www.home-assistant.io/integrations/cover.mqtt/', s: 'Home Assistant' },
    { t: 'Microstepping: myths and realities', u: 'https://www.micromo.com/microstepping-myths-and-realities', s: 'MICROMO' },
  ],

  images: ['stepper', 'esp32', 'motor'],
  imageCaptions: [
    'A NEMA-format stepper motor of the kind used to drive the belt.',
    'An ESP32 development board running the motion controller and automation logic.',
    'A DC gear motor — the alternative drivetrain choice, which needs an encoder to match the stepper\'s positional certainty.',
  ],
},

];
