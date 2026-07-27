/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 019–020
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 019 · Continuous Fever Patch ────────────────────────────────── */
{
  id: '019',
  domainKey: 'iot',
  emoji: '🌡️',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '10–14 hours',
  iso8601: 'PT12H',
  tagline: 'A skin patch that streams axillary temperature every thirty seconds over BLE — with the thermal modelling that turns a skin reading into something that actually tracks core temperature.',

  overview: [
    'A thermometer under the arm is a spot check. What matters clinically in a feverish child is the <em>trajectory</em>: is the temperature climbing, has an antipyretic taken effect, did it spike at 3 a.m. while everyone was asleep. Continuous measurement answers those questions and a spot check does not, which is why continuous patches exist commercially at ten times the cost of this build.',
    'The hard part is not measurement — a DS18B20 or an MAX30205 resolves 0.0625 °C without effort. The hard part is that <b>skin temperature is not core temperature</b>. A sensor against the skin sits in a thermal gradient between the body and the room, and the offset depends on ambient temperature, blood flow, sweat, clothing and how firmly the sensor is held. Reporting raw skin temperature as if it were body temperature is the single most common error in these projects, and it produces readings that are two degrees low and confidently wrong.',
    'This design addresses that with a <b>dual-sensor heat-flux approach</b>. One sensor sits against the skin; a second sits on the outer face of a known insulating layer. The difference between them measures heat flowing outward, and a simple thermal model estimates the temperature at the other end of the gradient — the core. It is the same principle used by commercial zero-heat-flux thermometers, implemented simply.',
    'The rest of the design is about being wearable. It must be small, comfortable, safe against skin for days, run for a week, and — most importantly — must fail visibly rather than silently, because a parent watching a fever needs to know when the device has stopped reporting.',
  ],

  does: [
    'Measures skin and outer-surface temperature every 30 seconds with 0.0625 °C resolution.',
    'Estimates core temperature using a two-sensor heat-flux model calibrated per wearer.',
    'Streams readings over BLE to a phone, with local buffering for up to 12 hours out of range.',
    'Alerts on threshold crossing and on rate of rise, both configurable.',
    'Detects when the patch has come loose or lost skin contact, and says so rather than reporting garbage.',
    'Logs a full temperature trace for review and export.',
    'Runs for about a week on a small lithium cell.',
  ],

  features: [
    '<b>Dual-sensor heat-flux estimation</b> rather than a naive skin reading plus a fixed offset.',
    '<b>Per-wearer calibration</b> against a reference thermometer, stored in flash.',
    '<b>Contact detection</b> from the skin-to-ambient gradient — a detached patch is obvious.',
    '<b>Rate-of-rise alerting</b>, which catches a developing fever before the absolute threshold.',
    '<b>12-hour local ring buffer</b> so a night out of BLE range loses nothing.',
    '<b>Configurable thresholds</b> with separate warning and alert levels.',
    '<b>Low-power design</b> at about 60 µA average through aggressive duty cycling.',
    '<b>Visible failure</b>: the device reports staleness rather than repeating the last good value.',
  ],

  applications: [
    { t: 'Paediatric fever monitoring', d: 'The primary case — overnight trajectory in a feverish child, without waking them every two hours.' },
    { t: 'Post-operative infection watch', d: 'A rising temperature is often the first sign of a surgical site infection, and continuous monitoring catches it a day earlier.' },
    { t: 'Elderly care', d: 'Older adults often mount a blunted fever response; a small but sustained rise is significant and easy to miss on spot checks.' },
    { t: 'Antipyretic effectiveness', d: 'Seeing exactly when and how much paracetamol brought a temperature down is genuinely informative.' },
    { t: 'Ovulation and cycle tracking', d: 'Basal body temperature shifts of about 0.3 °C are detectable with continuous overnight measurement.' },
    { t: 'Occupational heat stress', d: 'The same hardware with different thresholds monitors workers in hot environments.' },
  ],

  skills: [
    'Arduino C++ and 1-Wire or I²C sensor reading',
    'Basic heat-transfer intuition — conduction, thermal resistance, gradients',
    'Two-point sensor calibration',
    'BLE GATT services',
    'Low-power design and deep sleep',
  ],

  prereq: [
    'This is not a clinical thermometer and must not be used to make a treatment decision. Confirm any concerning reading with a validated device before acting on it, and see a doctor for a genuinely unwell person.',
  ],

  parts: ['esp32', 'ds18b20', 'sht31', 'li18650', 'tp4056', 'perfboard'],
  qty: { ds18b20: 2 },
  extraParts: [
    { name: 'MAX30205 clinical-grade temperature sensor', spec: '±0.1 °C from 37–39 °C, 16-bit, I²C', qty: 2, price: 620, note: 'Better than DS18B20 in the clinically relevant range. Worth the upgrade if accuracy matters.' },
    { name: 'Thermally conductive silicone pad', spec: '1 mm, 1.5 W/m·K, known thickness', qty: 1, price: 180, note: 'The insulating layer between the two sensors. Its thermal resistance must be known and consistent.' },
    { name: 'Hypoallergenic medical adhesive patches', spec: '50 mm, breathable, 3M 1776 or similar', qty: 20, price: 320 },
    { name: '150 mAh LiPo cell', spec: '3.7 V, protected, 4 mm thick', qty: 1, price: 240 },
    { name: 'Flexible PCB or thin perfboard + silicone potting', spec: 'Skin-safe encapsulation', qty: 1, price: 300 },
  ],
  cost: '₹2,400 – ₹3,400',
  libs: ['onewire', 'preferences', 'arduinojson'],

  pins: {
    left: [
      { dev: 'Skin-side temperature sensor', devPin: 'DATA / SDA', pin: 'GPIO 27', sig: '1-Wire with 4.7 kΩ pull-up' },
      { dev: 'Outer-side temperature sensor', devPin: 'DATA / SDA', pin: 'GPIO 27', sig: 'Same bus, different ROM ID' },
      { dev: 'SHT31 ambient reference', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x44' },
      { dev: 'Battery divider', devPin: 'Mid-point', pin: 'GPIO 34', sig: '1 MΩ / 1 MΩ, gated' },
    ],
    right: [
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 25', sig: 'Very brief flashes only' },
      { dev: 'Buzzer (optional)', devPin: '+', pin: 'GPIO 26', sig: 'Threshold alert' },
      { dev: 'Sensor power gate', devPin: 'MOSFET gate', pin: 'GPIO 14', sig: 'Cuts sensor power between samples' },
    ],
  },
  wiringNotes: [
    'Both DS18B20 sensors share <b>one GPIO</b> — that is the point of 1-Wire. Each has a unique 64-bit ROM address, so you address them individually on the same two wires. Scan and record both addresses before writing the application code.',
    'The <b>skin-side sensor must contact skin directly</b> through a thin thermally conductive layer, and the outer sensor must be separated from it by an insulator of known thickness. That known thermal resistance is what makes the heat-flux calculation possible.',
    'Encapsulate everything in skin-safe silicone. Bare electronics against skin for days causes irritation, and sweat will corrode exposed copper within a week.',
    'Gate the sensor power through a MOSFET. A DS18B20 draws 1.5 mA during conversion and 750 ms per conversion at 12-bit — leaving it powered continuously is most of your battery budget.',
    'Keep the whole assembly under about 4 mm thick and under 15 g. Anything bulkier will not stay attached under an arm for a week, and the project value depends entirely on it staying on.',
    'Route the battery so it is on the outer face, away from skin. A lithium cell against skin for days is both a comfort and a safety consideration.',
  ],

  block: {
    columns: [
      { label: 'Measure', blocks: [{ name: 'Skin sensor', sub: 'T_skin' }, { name: 'Outer sensor', sub: 'T_outer' }, { name: 'SHT31', sub: 'T_ambient' }] },
      { label: 'Model', edge: 'three temps', blocks: [{ name: 'Heat-flux estimate', sub: 'gradient → core', highlight: true }, { name: 'Contact check', sub: 'attached?' }] },
      { label: 'Assess', edge: 'T_core est', blocks: [{ name: 'Threshold + rate', sub: 'warn / alert' }, { name: 'Ring buffer', sub: '12 h local' }] },
      { label: 'Report', edge: 'reading', blocks: [{ name: 'BLE notify', sub: 'to phone' }, { name: 'Alert', sub: 'on crossing' }] },
    ],
  },

  flow: [
    { t: 'Wake from deep sleep every 30 s', k: 'start' },
    { t: 'Power sensors, wait for conversion', k: 'proc' },
    { t: 'Read skin, outer and ambient', k: 'io' },
    { t: 'Skin−ambient gradient plausible?', k: 'dec', yes: 'attached', no: 'report detached', back: 0 },
    { t: 'Estimate core from the heat flux', k: 'proc' },
    { t: 'Above threshold or rising fast?', k: 'dec', yes: 'alert', no: 'log only', back: 0 },
    { t: 'Notify over BLE or buffer locally', k: 'io' },
    { t: 'Cut sensor power, deep sleep', k: 'end' },
  ],

  principle: [
    'Heat flows from the body core to the environment through a series of thermal resistances: core to skin (mostly determined by blood flow), skin to the patch surface, and patch surface to air. In steady state the same heat flux passes through each stage, and each stage drops a temperature proportional to its thermal resistance. That is exactly Ohm\'s law with temperature in place of voltage and heat flux in place of current.',
    'A single skin sensor measures one point in that chain and tells you nothing about the gradient. Two sensors separated by a layer of <b>known thermal resistance</b> measure the gradient directly: the temperature difference across that layer, divided by its resistance, gives the heat flux. Knowing the flux and the (estimated) resistance from core to skin lets you extrapolate back to the core.',
    'That extrapolation is where the calibration lives. The core-to-skin resistance is not constant — it varies with vasoconstriction, which itself varies with core temperature, ambient temperature and time of day. A single global constant is a simplification. What makes it workable is calibrating that constant <b>per wearer against a reference thermometer</b> at a known point, and accepting that the estimate degrades when conditions change substantially from the calibration conditions.',
    'The alternative approach, used by high-end clinical devices, is <b>zero-heat-flux</b>: actively heat the outer surface until the gradient across the insulator is zero, at which point no heat flows and the skin temperature equals the core temperature directly. It is elegant and accurate, and it needs a heater drawing tens of milliwatts continuously, which is incompatible with a week of battery life. The passive two-sensor approach is the pragmatic compromise.',
    '<b>Contact detection</b> falls out of the same measurement. When the patch is attached, the skin sensor reads within a few degrees of body temperature and well above ambient. When it detaches, both sensors converge on ambient within a minute or two. Testing for that convergence gives an unambiguous attached/detached signal, which matters enormously: a detached patch reporting 26 °C looks like a healthy reading if you are not checking.',
    'Finally, <b>rate of rise</b>. A fever developing rises at perhaps 0.5–1.5 °C per hour. Detecting that trend catches it before an absolute threshold is crossed, and — more usefully — distinguishes a genuine rise from the normal circadian variation of about 0.5 °C, which happens far more slowly.',
  ],

  equations: [
    { t: 'Heat flux and core estimation', eq: 'Thermal resistance analogy:\n  q = ΔT / R          (heat flux = temperature drop / resistance)\n\nMeasured across the known insulator:\n  q = (T_skin − T_outer) / R_insulator\n\nExtrapolate back through the core-to-skin resistance:\n  T_core ≈ T_skin + q · R_body\n         = T_skin + (T_skin − T_outer) · (R_body / R_insulator)\n         = T_skin + k · (T_skin − T_outer)\n\nk is the single calibration constant, typically 0.6–1.4.\n\nWorked example, k = 0.9:\n  T_skin = 36.1 °C, T_outer = 34.6 °C\n  T_core = 36.1 + 0.9 × 1.5 = 37.45 °C' },
    { t: 'Contact detection', eq: 'Attached:\n  T_skin − T_ambient  > 4 °C   (body is much warmer than the room)\n  T_skin − T_outer    > 0.3 °C (a gradient exists)\n\nDetached (converging on ambient):\n  |T_skin − T_ambient| < 2 °C\n  |T_skin − T_outer|   < 0.2 °C\n\nRequire the attached condition for three consecutive\nsamples before reporting a temperature at all. A\ndetached patch reading 26 °C looks healthy if you\nare not explicitly checking.' },
    { t: 'Rate of rise', eq: 'Over a 30-minute window (60 samples at 30 s):\n\n  rate = (T_core[now] − T_core[now−30min]) / 0.5 h   °C/h\n\nInterpretation:\n  |rate| < 0.2 °C/h : normal circadian variation\n  rate > 0.5 °C/h   : developing fever — warn\n  rate > 1.0 °C/h   : rapid rise — alert\n  rate < −0.8 °C/h  : antipyretic taking effect\n\nUse a linear least-squares fit over the window rather\nthan a two-point difference — the two-point version is\ndominated by noise on a 0.0625 °C resolution sensor.' },
    { t: 'Battery budget', eq: 'DS18B20 conversion: 1.5 mA for 750 ms (12-bit)\n  2 sensors on one bus, one conversion each 30 s\n  = 1.5 mA × 0.75 s / 30 s = 37.5 µA average\n\nSHT31: 1.5 mA for 15 ms every 30 s = 0.75 µA\nESP32 awake: 80 mA for 1.2 s every 30 s = 3.2 mA  ← dominant\nESP32 deep sleep: 10 µA\n\nWith BLE advertising only every 5th wake:\n  average ≈ 3.3 mA\n\n150 mAh cell → 45 h. Not a week!\n\nFix: buffer 10 readings, wake the radio once every\n5 minutes instead of every 30 s:\n  ESP32 active drops to ~0.7 mA average\n  → 150 / 0.75 ≈ 200 h ≈ 8 days  ✓' },
  ],

  code: [{
    file: 'fever-patch.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Continuous Fever Patch — ESP32 + dual DS18B20 + SHT31

   Two temperature sensors separated by a layer of known thermal
   resistance measure the heat flux leaving the skin, which allows a
   core temperature estimate rather than a raw skin reading.

   NOT a clinical thermometer. Confirm any concerning reading with a
   validated device.
   ══════════════════════════════════════════════════════════════════ */

#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <Preferences.h>
#include <esp_sleep.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <math.h>

#define PIN_ONEWIRE   27
#define PIN_SENSOR_EN 14
#define PIN_LED       25
#define PIN_BUZZ      26
#define PIN_BATT      34
#define PIN_BATT_EN   13

#define SAMPLE_INTERVAL_S   30
#define RADIO_EVERY_N       10        // advertise once per 5 minutes
#define BUFFER_LEN         120        // 1 hour of samples in RTC memory
#define TREND_SAMPLES       60        // 30 minutes for the rate fit

#define WARN_C   37.8f
#define ALERT_C  38.5f
#define RATE_WARN_C_PER_H  0.5f
#define RATE_ALERT_C_PER_H 1.0f

/* BLE Health Thermometer Service UUIDs */
#define HTS_SERVICE     "00001809-0000-1000-8000-00805f9b34fb"
#define HTS_MEASUREMENT "00002a1c-0000-1000-8000-00805f9b34fb"

OneWire           oneWire(PIN_ONEWIRE);
DallasTemperature ds(&oneWire);
Adafruit_SHT31    sht;
Preferences       prefs;

DeviceAddress addrSkin, addrOuter;

/* Survives deep sleep */
RTC_DATA_ATTR float    ring[BUFFER_LEN];
RTC_DATA_ATTR uint32_t ringTime[BUFFER_LEN];
RTC_DATA_ATTR uint16_t ringHead = 0, ringCount = 0;
RTC_DATA_ATTR uint32_t wakeCount = 0;
RTC_DATA_ATTR bool     wasAttached = false;
RTC_DATA_ATTR uint32_t uptimeS = 0;

float kCalib = 0.9f;                 // heat-flux constant, per wearer
float tSkin = 0, tOuter = 0, tAmbient = 0, tCore = 0, rateCperH = 0;
bool  attached = false;

/* ── sensors ────────────────────────────────────────────────── */
void sensorsOn(bool on) {
  pinMode(PIN_SENSOR_EN, OUTPUT);
  digitalWrite(PIN_SENSOR_EN, on ? HIGH : LOW);
  if (on) delay(20);                 // let rails settle before talking
}

bool readAll() {
  ds.requestTemperatures();          // blocking ~750 ms at 12-bit
  tSkin  = ds.getTempC(addrSkin);
  tOuter = ds.getTempC(addrOuter);
  tAmbient = sht.readTemperature();

  if (tSkin == DEVICE_DISCONNECTED_C || tOuter == DEVICE_DISCONNECTED_C) return false;
  if (isnan(tAmbient)) tAmbient = tOuter;    // fall back to the outer sensor
  return true;
}

/* ── attachment detection ───────────────────────────────────── */
bool checkAttached() {
  bool warmerThanRoom = (tSkin - tAmbient) > 4.0f;
  bool gradientExists = (tSkin - tOuter)   > 0.3f;
  return warmerThanRoom && gradientExists;
}

/* ── core estimation ────────────────────────────────────────── */
float estimateCore() {
  // T_core = T_skin + k * (T_skin - T_outer)
  // The bracketed term is proportional to outward heat flux.
  float flux = tSkin - tOuter;
  if (flux < 0) flux = 0;                    // never extrapolate downward
  return tSkin + kCalib * flux;
}

/* ── trend by least squares ─────────────────────────────────── */
float computeRate() {
  int n = ringCount < TREND_SAMPLES ? ringCount : TREND_SAMPLES;
  if (n < 10) return 0;

  // Least squares slope over the last n samples. A two-point
  // difference is dominated by the 0.0625 C quantisation step.
  double sx = 0, sy = 0, sxy = 0, sxx = 0;
  for (int i = 0; i < n; i++) {
    int idx = (ringHead + BUFFER_LEN - 1 - i) % BUFFER_LEN;
    double x = -(double)i * SAMPLE_INTERVAL_S / 3600.0;   // hours, negative
    double y = ring[idx];
    sx += x; sy += y; sxy += x * y; sxx += x * x;
  }
  double denom = n * sxx - sx * sx;
  if (fabs(denom) < 1e-9) return 0;
  return (float)((n * sxy - sx * sy) / denom);            // °C per hour
}

/* ── BLE ────────────────────────────────────────────────────── */
BLECharacteristic *htsChar = nullptr;
bool bleClientConnected = false;

class ServerCb : public BLEServerCallbacks {
  void onConnect(BLEServer *) override    { bleClientConnected = true; }
  void onDisconnect(BLEServer *s) override { bleClientConnected = false; s->startAdvertising(); }
};

void bleBegin() {
  BLEDevice::init("FeverPatch");
  BLEServer *server = BLEDevice::createServer();
  server->setCallbacks(new ServerCb());

  BLEService *svc = server->createService(HTS_SERVICE);
  htsChar = svc->createCharacteristic(
      HTS_MEASUREMENT,
      BLECharacteristic::PROPERTY_INDICATE | BLECharacteristic::PROPERTY_NOTIFY);
  htsChar->addDescriptor(new BLE2902());
  svc->start();
  server->getAdvertising()->addServiceUUID(HTS_SERVICE);
  server->getAdvertising()->start();
}

// Health Thermometer Measurement: flags byte + IEEE-11073 32-bit float
void bleSend(float celsius) {
  if (!htsChar || !bleClientConnected) return;
  int32_t mantissa = (int32_t)lroundf(celsius * 100.0f);
  uint8_t payload[5];
  payload[0] = 0x00;                                   // flags: Celsius
  payload[1] =  mantissa        & 0xFF;
  payload[2] = (mantissa >>  8) & 0xFF;
  payload[3] = (mantissa >> 16) & 0xFF;
  payload[4] = (uint8_t)(int8_t)(-2);                  // exponent 10^-2
  htsChar->setValue(payload, 5);
  htsChar->notify();
}

void flushBuffer() {
  int n = ringCount < 20 ? ringCount : 20;
  for (int i = n - 1; i >= 0; i--) {
    int idx = (ringHead + BUFFER_LEN - 1 - i) % BUFFER_LEN;
    bleSend(ring[idx]);
    delay(30);
  }
}

/* ── calibration ────────────────────────────────────────────── */
void calibrateAgainst(float referenceCore) {
  if (!attached || (tSkin - tOuter) < 0.2f) return;
  kCalib = (referenceCore - tSkin) / (tSkin - tOuter);
  if (kCalib < 0.2f) kCalib = 0.2f;
  if (kCalib > 2.5f) kCalib = 2.5f;
  prefs.putFloat("k", kCalib);
}

/* ── setup runs once per wake ───────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED, OUTPUT);
  wakeCount++;
  uptimeS += SAMPLE_INTERVAL_S;

  prefs.begin("patch", false);
  kCalib = prefs.getFloat("k", 0.9f);

  sensorsOn(true);
  Wire.begin(21, 22);
  sht.begin(0x44);
  ds.begin();
  ds.setResolution(12);

  // Both sensors share one bus; index 0 and 1 by discovery order.
  if (!ds.getAddress(addrSkin, 0) || !ds.getAddress(addrOuter, 1)) {
    Serial.println("Sensor discovery failed");
    sensorsOn(false);
    esp_sleep_enable_timer_wakeup((uint64_t)SAMPLE_INTERVAL_S * 1000000ULL);
    esp_deep_sleep_start();
  }

  bool ok = readAll();
  sensorsOn(false);

  if (!ok) {
    Serial.println("Read failed");
    esp_sleep_enable_timer_wakeup((uint64_t)SAMPLE_INTERVAL_S * 1000000ULL);
    esp_deep_sleep_start();
  }

  attached = checkAttached();
  tCore = attached ? estimateCore() : NAN;

  if (attached) {
    ring[ringHead] = tCore;
    ringTime[ringHead] = uptimeS;
    ringHead = (ringHead + 1) % BUFFER_LEN;
    if (ringCount < BUFFER_LEN) ringCount++;
    rateCperH = computeRate();
  } else {
    ringCount = 0;                   // a detached period invalidates the trend
  }

  Serial.printf("skin %.2f  outer %.2f  amb %.2f  core %.2f  rate %+.2f C/h  %s\\n",
                tSkin, tOuter, tAmbient, tCore, rateCperH,
                attached ? "attached" : "DETACHED");

  bool alert = attached && (tCore >= ALERT_C || rateCperH >= RATE_ALERT_C_PER_H);
  bool warn  = attached && (tCore >= WARN_C  || rateCperH >= RATE_WARN_C_PER_H);

  if (alert) { for (int i = 0; i < 4; i++) { tone(PIN_BUZZ, 2600, 180); delay(240); } }
  else if (warn) { tone(PIN_BUZZ, 2000, 200); }

  if (attached != wasAttached) {
    // An attachment change is worth reporting immediately.
    digitalWrite(PIN_LED, HIGH); delay(60); digitalWrite(PIN_LED, LOW);
    wasAttached = attached;
    wakeCount = RADIO_EVERY_N;       // force a radio wake this cycle
  }

  /* Radio only every Nth wake — this is what makes a week possible. */
  if (wakeCount % RADIO_EVERY_N == 0 || alert) {
    bleBegin();
    uint32_t t0 = millis();
    while (millis() - t0 < 3000 && !bleClientConnected) delay(50);
    if (bleClientConnected) { flushBuffer(); delay(200); }
    BLEDevice::deinit(true);
  }

  esp_sleep_enable_timer_wakeup((uint64_t)SAMPLE_INTERVAL_S * 1000000ULL);
  Serial.flush();
  esp_deep_sleep_start();
}

void loop() { /* never reached */ }`,
    explain: [
      { ref: 'estimateCore() with k · (T_skin − T_outer)', txt: 'The bracketed difference is proportional to outward heat flux through a layer of known resistance. Multiplying by a calibrated constant extrapolates back through the body\'s own thermal resistance to the core — which is the entire reason for the second sensor.' },
      { ref: 'if (flux < 0) flux = 0', txt: 'A negative gradient means heat is flowing inward, which happens in a hot room or direct sun. Extrapolating downward in that case would report a core temperature below skin temperature, which is physically wrong.' },
      { ref: 'checkAttached() two conditions', txt: 'Both must hold: the skin must be much warmer than the room, and a gradient must exist across the insulator. A detached patch fails both within about two minutes, and reporting "detached" rather than an ambient reading is the single most important safety behaviour here.' },
      { ref: 'ringCount = 0 on detach', txt: 'A detached period makes the preceding trend meaningless. Clearing the buffer prevents a rate-of-rise alert firing purely because the patch was reattached to a warm body.' },
      { ref: 'computeRate() least squares, not two-point', txt: 'A DS18B20 quantises to 0.0625 °C. Over 30 minutes a real fever moves perhaps 0.5 °C, which is only eight quantisation steps — a two-point difference is dominated by that quantisation, while a least-squares fit over 60 samples is not.' },
      { ref: 'wakeCount % RADIO_EVERY_N', txt: 'The radio dominates power consumption. Sampling every 30 seconds but advertising every 5 minutes cuts average current by roughly four times, which is the difference between two days and eight days of battery.' },
      { ref: 'IEEE-11073 float in bleSend', txt: 'The standard BLE Health Thermometer characteristic uses a 32-bit medical float: a 24-bit signed mantissa and an 8-bit exponent. Using this standard format means any generic BLE thermometer app can read the patch with no custom code.' },
    ],
  }],

  config: [
    'Record both DS18B20 ROM addresses and assign them explicitly to skin and outer rather than relying on discovery order, which can change if a sensor is replaced.',
    'Set <code>kCalib</code> by calibrating against a reference thermometer — the routine is in the code, and the value is typically between 0.6 and 1.4.',
    'Set <code>WARN_C</code> and <code>ALERT_C</code> from clinical guidance for the wearer. 37.8 °C and 38.5 °C are common adult thresholds; paediatric thresholds differ and should come from a clinician.',
    'Set <code>RADIO_EVERY_N</code> from your battery target. Every 10th wake (5 minutes) gives about a week; every wake gives about two days.',
    'Choose the insulating layer deliberately and keep it consistent. Changing its thickness changes the effective thermal resistance and invalidates the calibration.',
  ],

  calibration: [
    { h: 'Calibrate k against a reference', p: ['Wear the patch for 30 minutes to reach thermal equilibrium, then take a reading with a validated clinical thermometer at the same site. Call <code>calibrateAgainst(reference)</code> with that value. Repeat at a different ambient temperature and average the two k values — a single-point calibration is valid only near those conditions.'] },
    { h: 'Verify both sensors agree', p: ['Hold both sensors together in a water bath at body temperature. They should read within 0.2 °C of each other. A larger difference is a sensor offset that must be corrected in software before the heat-flux calculation means anything, because it is subtracting one from the other.'] },
    { h: 'Check the equilibration time', p: ['Attach the patch and log for an hour. The reading should stabilise within 15–25 minutes. Much longer means the thermal mass is too high — reduce the potting compound or use a thinner substrate.'] },
    { h: 'Validate the detach detection', p: ['Remove the patch and watch. It should report detached within two minutes, not report an ambient temperature as if it were a body temperature.'] },
  ],

  testing: [
    { step: 'Read both sensors in air', expect: 'Both within 0.2 °C of each other and of the ambient reference.' },
    { step: 'Attach the patch under an arm', expect: 'Skin temperature rises to 34–36 °C over 15–25 minutes; the attached flag becomes true within a few samples.' },
    { step: 'Compare the estimate with a clinical thermometer', expect: 'Within about 0.3 °C after calibration, at similar ambient conditions.' },
    { step: 'Remove the patch', expect: 'Detached reported within two minutes, and no temperature published — not an ambient reading.' },
    { step: 'Move to a much colder room while wearing it', expect: 'The gradient increases, the estimate holds within about 0.5 °C, and it does not collapse toward skin temperature.' },
    { step: 'Connect a generic BLE thermometer app', expect: 'The Health Thermometer Service is discovered and readings appear with no custom software.' },
    { step: 'Leave BLE out of range for two hours', expect: 'Readings buffer locally and flush on reconnection.' },
    { step: 'Measure average current', expect: 'Around 0.7–1.0 mA with radio every 10th wake, giving roughly a week on 150 mAh.' },
  ],

  troubleshoot: [
    {
      sym: 'Reported temperature is two degrees below a clinical thermometer',
      cause: 'Raw skin temperature is being reported, or k is far too low.',
      fix: 'Skin is genuinely 1.5–3 °C below core — that is physics, not a bug. Confirm the heat-flux term is being applied and calibrate k against a reference. If the gradient across the insulator is near zero, the insulating layer is too thin or the sensors are thermally shorted together.',
    },
    {
      sym: 'The gradient between the two sensors is nearly zero',
      cause: 'The sensors are thermally coupled — usually by a metal enclosure, a shared PCB copper pour, or potting compound bridging them.',
      fix: 'Separate them with the intended insulator and nothing else. Cut a slot in the PCB between them if they share a board. Any conductive path between the two defeats the entire measurement.',
    },
    {
      sym: 'Readings jump when the wearer moves',
      cause: 'The patch is losing and regaining contact.',
      fix: 'Use a better adhesive and a more flexible substrate. Under an arm is a high-movement site; behind the upper arm or on the chest is more stable. Also confirm the detach detection catches the loss rather than reporting a corrupted value.',
    },
    {
      sym: 'Only one DS18B20 is found',
      cause: 'Missing pull-up, a bad joint, or two sensors with the same address (rare but it happens with counterfeits).',
      fix: 'Fit a 4.7 kΩ pull-up from data to 3.3 V. Run a 1-Wire address scan and confirm two distinct 64-bit ROM codes. If both report identically, one is a clone and must be replaced.',
    },
    {
      sym: 'Battery lasts two days rather than a week',
      cause: 'The radio is waking every sample.',
      fix: 'Advertise every 10th wake and buffer in between. BLE advertising and connection dominate the power budget by roughly four to one over the sensor reads.',
    },
    {
      sym: 'The rate-of-rise alert fires spuriously',
      cause: 'A two-point difference on a quantised sensor, or a reattachment being read as a rise.',
      fix: 'Use the least-squares fit over 30 minutes, and clear the trend buffer whenever the patch detaches. Reattaching to a warm body looks exactly like a rapid fever if the buffer is not cleared.',
    },
  ],

  perf: [
    'Advertise the radio every 5 minutes and buffer readings between — it is the single largest power saving available and costs nothing in usefulness.',
    'Use 12-bit resolution only if you need 0.0625 °C. Dropping to 11-bit halves the 750 ms conversion time and the energy with it.',
    'Gate sensor power through a MOSFET. Two DS18B20s and an SHT31 left powered continuously is over 3 mA, which is several times the rest of the budget combined.',
  ],

  safety: [
    '<b>Not a clinical thermometer.</b> Confirm any concerning reading with a validated device before acting on it, and see a doctor for anyone genuinely unwell — especially an infant.',
    'Use hypoallergenic medical adhesive and check the skin daily. Days of continuous adhesive contact causes irritation, particularly on children and older adults.',
    'Encapsulate all electronics in skin-safe silicone. Bare copper against skin corrodes in sweat and can cause a contact reaction.',
    'Keep the lithium cell on the outer face and use a protected cell. A cell against skin for days is both a comfort and a thermal safety consideration.',
    'Do not use on broken skin, and remove it before any MRI scan.',
  ],

  future: [
    'Upgrade to <b>MAX30205</b> sensors, specified at ±0.1 °C in the 37–39 °C range, which is where accuracy actually matters for fever.',
    'Add a <b>zero-heat-flux heater</b> for genuinely accurate core measurement, accepting the much larger battery it requires.',
    'Add <b>heart rate</b> from a PPG sensor on the same patch — combined temperature and heart rate is far more informative clinically than either alone.',
    'Add a <b>phone app with a proper timeline</b> and antipyretic dose markers, so the effect of each dose is directly visible.',
    'Add <b>multi-patient support</b> for a ward or care home, with a single gateway aggregating many patches.',
  ],

  faq: [
    { q: 'Why not just use one sensor against the skin?', a: 'Because skin temperature is not body temperature. It sits 1.5–3 °C below core, and the offset changes with ambient temperature, blood flow and clothing. A single sensor with a fixed offset is accurate only under the exact conditions you calibrated it in, and it reports a plausible-looking wrong number outside them. The second sensor measures the gradient, which is what lets you correct for the conditions.' },
    { q: 'How accurate is the core estimate?', a: 'After per-wearer calibration, within about 0.3 °C under conditions similar to the calibration. It degrades when ambient temperature changes substantially, or when vasoconstriction changes — a shivering patient has very different core-to-skin resistance. Treat it as an accurate trend and a rough absolute.' },
    { q: 'Where should the patch go?', a: 'Under the arm (axilla) is the classic site and gives the smallest core offset. The chest and the upper back are more comfortable for long wear and more movement-stable, at the cost of a slightly larger offset — which the calibration absorbs. Forehead is worst: highly exposed to ambient and to evaporation.' },
    { q: 'Why does it take 20 minutes to stabilise?', a: 'Thermal mass. The patch, its potting and the adhesive all have to reach equilibrium with the skin, and the skin under the patch has to reach equilibrium with the reduced heat loss. Any reading in the first 15 minutes after attachment is transitional — the firmware should arguably suppress it entirely, as a clinical device would.' },
    { q: 'Can this replace a thermometer?', a: 'No. It is not validated, not calibrated to a traceable standard, and not regulated. What it does that a thermometer cannot is show you the shape of the curve overnight, which is genuinely useful information a spot check cannot provide. Use both.' },
    { q: 'Is BLE safe for continuous wear?', a: 'BLE transmits at about 1–10 mW, which is orders of magnitude below a mobile phone and far below any established thermal or non-thermal effect threshold. The bigger practical concern with continuous wear is adhesive irritation, not radio exposure.' },
  ],

  refs: [
    { t: 'DS18B20 programmable resolution 1-Wire digital thermometer — datasheet', u: 'https://www.analog.com/media/en/technical-documentation/data-sheets/DS18B20.pdf', s: 'Analog Devices' },
    { t: 'MAX30205 human body temperature sensor — datasheet', u: 'https://www.analog.com/media/en/technical-documentation/data-sheets/MAX30205.pdf', s: 'Analog Devices' },
    { t: 'Fox & Solman, "A new technique for monitoring the deep body temperature" (zero heat flux)', u: 'https://doi.org/10.1113/jphysiol.1971.sp009432', s: 'The Journal of Physiology, 1971' },
    { t: 'Sim et al., "Estimation of circadian body temperature rhythm based on heart rate"', u: 'https://doi.org/10.1109/JBHI.2016.2532933', s: 'IEEE JBHI, 2017' },
    { t: 'Bluetooth SIG — Health Thermometer Service specification', u: 'https://www.bluetooth.com/specifications/specs/health-thermometer-service-1-0/', s: 'Bluetooth SIG' },
    { t: 'Niven et al., "Accuracy of peripheral thermometers for estimating temperature: a systematic review"', u: 'https://doi.org/10.7326/M15-1150', s: 'Annals of Internal Medicine, 2015' },
  ],

  images: ['health', 'sensor', 'ecg'],
  imageCaptions: [
    'A body-worn wearable. A fever patch must be thin, light and comfortable enough to stay attached for days — the measurement is worthless if it is removed.',
    'A temperature sensor module. Two sensors separated by a known insulator measure heat flux, which is what makes a core estimate possible.',
    'A physiological trace. The shape of a temperature curve overnight is information a spot check simply cannot provide.',
  ],
},

];
