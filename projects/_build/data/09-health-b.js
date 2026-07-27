/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 016–018
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 016 · Fall Detection Pendant ────────────────────────────────── */
{
  id: '016',
  domainKey: 'iot',
  emoji: '🆘',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'A pendant that distinguishes an actual fall from sitting down heavily, gives the wearer thirty seconds to cancel, and then escalates to family with a location — running for months on one charge.',

  overview: [
    'Fall detection is a classification problem with a brutally asymmetric cost function. A missed fall can mean hours on a floor; a false alarm at 2 a.m. means a frightened family and, after the third one, a device that gets taken off and left in a drawer. Almost every published fall-detection algorithm optimises sensitivity and quietly ignores what its false-positive rate does to real-world adoption.',
    'This design uses the <b>three-phase signature</b> that distinguishes a genuine fall from every common false positive. A real fall has a free-fall phase where total acceleration drops well below 1 g, followed within a few hundred milliseconds by an impact spike, followed by a period of altered orientation and near-stillness. Sitting down heavily has the impact but no free-fall. Dropping the pendant has free-fall and impact but the orientation afterwards is random and it is picked up quickly. Requiring all three phases in sequence, with timing constraints, removes most false positives without sacrificing much sensitivity.',
    'The other half of the design is the <b>escalation protocol</b>, which matters as much as the detection. On a detected fall the pendant vibrates and beeps for thirty seconds with a large cancel button — because most detected events are recoverable and the wearer is fine. Only on timeout does it alert, and then it alerts progressively: a family member first, then a second contact, then a broader group, each with the previous alert\'s outcome attached.',
    'Power is the constraint that shapes everything else. A pendant that needs charging nightly gets left off the charger. The design targets months, which means the accelerometer\'s own interrupt engine does the watching while the microcontroller sleeps at microamps, waking only when something happens.',
  ],

  does: [
    'Detects falls using a three-phase free-fall, impact and post-impact orientation signature.',
    'Rejects sitting, lying down, dropping the device and normal walking through explicit timing and orientation tests.',
    'Gives a thirty-second cancel window with escalating vibration and audible prompts.',
    'Escalates through a contact list, attaching the outcome of each previous stage.',
    'Includes a manual SOS button that bypasses detection entirely.',
    'Reports approximate location from Wi-Fi access-point scanning without needing GPS.',
    'Runs for two to four months on a 500 mAh cell through hardware-interrupt wake.',
  ],

  features: [
    '<b>Three-phase detection</b> with timing constraints between phases, not a single acceleration threshold.',
    '<b>ADXL345 activity and free-fall interrupts</b> so the MCU sleeps at about 12 µA until something happens.',
    '<b>Orientation change test</b> using the gravity vector before and after impact.',
    '<b>Post-impact stillness window</b> — a person who gets straight up did not need help.',
    '<b>Thirty-second cancel</b> with a large, findable button and escalating haptics.',
    '<b>Multi-stage escalation</b> with per-contact acknowledgement.',
    '<b>Wi-Fi RSSI fingerprint location</b>, accurate to a room indoors, with no GPS power cost.',
    '<b>Daily heartbeat with battery voltage</b>, so a dead pendant is visibly dead.',
  ],

  applications: [
    { t: 'Independent elderly living', d: 'The core use case, and the one where the false-positive rate determines whether the device is actually worn.' },
    { t: 'Epilepsy and syncope monitoring', d: 'The same signature detects a collapse from loss of consciousness.' },
    { t: 'Lone worker safety', d: 'Industrial man-down detection, often a regulatory requirement, with the same algorithm and a rugged enclosure.' },
    { t: 'Post-surgical recovery at home', d: 'A temporary safety net during the weeks when balance is impaired.' },
    { t: 'Care home monitoring', d: 'Many pendants, one gateway, with per-resident alerting.' },
    { t: 'Teaching sensor fusion and classification', d: 'A real problem where a naive threshold demonstrably fails and the reason why is physically intuitive.' },
  ],

  skills: [
    'Arduino C++ with interrupt handling and deep sleep',
    'Understanding of accelerometer axes, gravity and dynamic acceleration',
    'Configuring sensor hardware interrupts through registers',
    'Simple state machines',
    'MQTT and notification services',
  ],

  parts: ['esp32', 'adxl345', 'buzzer', 'li18650', 'tp4056', 'perfboard'],
  extraParts: [
    { name: 'Coin vibration motor + driver transistor', spec: '10 mm, 3 V, 80 mA', qty: 1, price: 120 },
    { name: 'Large tactile SOS / cancel button', spec: '12 mm cap, NO, high travel', qty: 1, price: 60, note: 'Must be findable by touch alone, by someone who has just fallen and may be disoriented.' },
    { name: '3D-printed pendant shell + lanyard', spec: 'PETG, break-away lanyard clasp', qty: 1, price: 180, note: 'The lanyard must break away under load — a fixed cord around a neck is a strangulation risk.' },
    { name: '500 mAh LiPo cell', spec: '3.7 V, with protection circuit', qty: 1, price: 260 },
  ],
  cost: '₹2,200 – ₹2,900',
  libs: ['wifi', 'pubsub', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'ADXL345 accelerometer', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x53' },
      { dev: 'ADXL345 INT1', devPin: 'INT1', pin: 'GPIO 33', sig: 'Free-fall / activity, RTC wake' },
      { dev: 'SOS / cancel button', devPin: 'NO', pin: 'GPIO 32', sig: 'Pull-up, also an RTC wake source' },
      { dev: 'Battery divider', devPin: 'Mid-point', pin: 'GPIO 34', sig: '1 MΩ / 1 MΩ, MOSFET gated' },
    ],
    right: [
      { dev: 'Vibration motor', devPin: 'Transistor base', pin: 'GPIO 25', sig: 'Through 1 kΩ, with flyback' },
      { dev: 'Piezo buzzer', devPin: '+', pin: 'GPIO 26', sig: 'LEDC PWM' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 27', sig: 'Brief flashes only' },
    ],
  },
  wiringNotes: [
    'Wire INT1 to an <b>RTC-capable GPIO</b> (33 here) so it can wake the ESP32 from deep sleep via <code>ext0</code>. A non-RTC pin means the pendant sleeps and never wakes, which is a silent and total failure.',
    'Configure the ADXL345 interrupt as <b>active high</b> and wake on high. The default is active low, which conflicts with the pull-up arrangement used for the button on the same wake mechanism.',
    'The vibration motor is inductive and draws about 80 mA. Drive it through an NPN transistor or a small MOSFET with a flyback diode — a GPIO cannot supply it and the back-EMF will damage the pin.',
    'The lanyard clasp <b>must break away</b> under roughly 3 kg of load. A pendant on a fixed cord is a genuine strangulation hazard, particularly for the population this device is for.',
    'Mount the accelerometer rigidly to the shell. A sensor that can rattle inside the case produces impact spikes from ordinary handling.',
    'Use a bare ESP32 module rather than a development board. A DevKit draws 8–20 mA in deep sleep because of its regulator and USB chip, which turns three months of battery life into three days.',
  ],

  block: {
    columns: [
      { label: 'Watch', blocks: [{ name: 'ADXL345', sub: 'HW free-fall INT' }, { name: 'ESP32 deep sleep', sub: '~12 µA', highlight: true }] },
      { label: 'Classify', edge: 'wake on event', blocks: [{ name: 'Phase 1 free-fall', sub: '< 0.6 g' }, { name: 'Phase 2 impact', sub: '> 2.5 g' }, { name: 'Phase 3 stillness', sub: 'orientation changed', highlight: true }] },
      { label: 'Confirm', edge: 'fall candidate', blocks: [{ name: '30 s cancel window', sub: 'haptic + audible' }, { name: 'Button pressed?', sub: 'user is fine' }] },
      { label: 'Escalate', edge: 'no cancel', blocks: [{ name: 'Contact 1 → 2 → all', sub: 'with location' }, { name: 'Wi-Fi AP scan', sub: 'room-level fix' }] },
    ],
  },

  flow: [
    { t: 'Deep sleep, ADXL345 watching', k: 'start' },
    { t: 'Wake on free-fall interrupt', k: 'proc' },
    { t: 'Sample at 100 Hz for 3 s', k: 'proc' },
    { t: 'Impact > 2.5 g within 800 ms?', k: 'dec', yes: 'yes', no: 'not a fall, sleep', back: 0 },
    { t: 'Orientation changed by > 30°?', k: 'dec', yes: 'yes', no: 'not a fall, sleep', back: 0 },
    { t: 'Still for 2 s after impact?', k: 'dec', yes: 'fall candidate', no: 'recovered, sleep', back: 0 },
    { t: '30 s cancel window with haptics', k: 'io' },
    { t: 'Escalate with location, then sleep', k: 'end' },
  ],

  principle: [
    'An accelerometer at rest measures <b>1 g</b> — not zero. It senses the normal force opposing gravity, so a stationary sensor reads 9.81 m/s² along whichever axis points up. This is the key to the whole algorithm: during genuine free fall, nothing opposes gravity, so the measured total acceleration drops towards <b>0 g</b>. A body falling towards the floor is in partial free fall for 200–400 ms, and total acceleration typically dips to 0.3–0.7 g. Nothing else in daily life produces that signature.',
    'The <b>impact</b> follows. Deceleration on hitting the floor produces a spike of 2–6 g depending on the surface and how the person lands. On its own this is a poor discriminator — sitting down heavily on a chair produces 2–3 g, and setting the pendant down on a table produces more. It is only the <em>sequence</em> free-fall then impact, with under 800 ms between them, that is specific to a fall.',
    'The <b>third phase</b> is what removes the remaining false positives. After a real fall the person is on the floor, so the pendant\'s orientation relative to gravity has changed substantially — typically by more than 30° — and they are largely still for at least a couple of seconds. Someone who sits down heavily has a small orientation change and continues to move normally. Someone who drops the pendant picks it up within seconds. Requiring sustained stillness in a changed orientation is the single most effective false-positive filter available.',
    'Orientation is computed from the <b>gravity vector</b>: with the device roughly still, the measured acceleration vector points along "up" in the device frame. Comparing the unit vector before the event with the one after gives the angle change directly through the dot product. This works without a gyroscope and without any integration, which matters because integrating accelerometer data to get orientation drifts badly within seconds.',
    'The <b>power architecture</b> uses the ADXL345\'s own interrupt engine. The sensor has hardware free-fall and activity detection with configurable thresholds and time windows, running from its own 40 µA supply. It watches continuously while the ESP32 sleeps at around 10 µA. The microcontroller only wakes when the accelerometer says something happened, which is a handful of times a day, and each wake costs a few hundred milliamp-milliseconds.',
  ],

  equations: [
    { t: 'Free-fall and impact thresholds', eq: 'Total acceleration magnitude:\n  |a| = sqrt(ax² + ay² + az²)\n\nAt rest        : |a| ≈ 1.00 g\nFree fall      : |a| →  0 g  (in practice 0.3–0.7 g for a body)\nImpact         : |a| =  2–6 g\n\nADXL345 free-fall register settings:\n  THRESH_FF (0x28) = 0x08  → 8 × 62.5 mg = 0.50 g\n  TIME_FF   (0x29) = 0x14  → 20 × 5 ms   = 100 ms\n\nRequiring 100 ms below 0.5 g rejects the brief dips\nfrom ordinary arm swing, which last under 40 ms.' },
    { t: 'Orientation change from the gravity vector', eq: 'Before: g₁ = (x₁, y₁, z₁) normalised\nAfter : g₂ = (x₂, y₂, z₂) normalised\n\n  cos θ = g₁ · g₂ = x₁x₂ + y₁y₂ + z₁z₂\n  θ = acos(cos θ)\n\nExample — pendant upright, then lying on its side:\n  g₁ = (0.02, 0.05, 0.998)\n  g₂ = (0.97, 0.11, 0.21)\n  cos θ = 0.019 + 0.006 + 0.210 = 0.235\n  θ = 76.4°   → clearly a fall-consistent change\n\nSitting down typically gives θ under 20°.' },
    { t: 'Battery life', eq: 'ADXL345 in measurement mode with interrupts: 40 µA\nESP32 deep sleep (bare module)              : 10 µA\nTotal idle                                  : 50 µA\n\nWakes: ~6 false triggers/day × 3 s at 90 mA\n  = 6 × 3 × 90 / 86400 = 18.75 µA average\nDaily heartbeat: 1 × 8 s at 130 mA\n  = 8 × 130 / 86400 = 12.0 µA average\n\nTotal ≈ 81 µA\n\n500 mAh cell, usable to 3.4 V ≈ 430 mAh\nLife = 430 / 0.081 = 5309 h ≈ 7.4 months\n\nDerate for self-discharge and cold: 3–5 months realistic.' },
  ],

  code: [{
    file: 'fall-pendant.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Fall Detection Pendant — ESP32 + ADXL345

   Three-phase detection: free fall, impact, then a sustained change
   in orientation with stillness. The accelerometer's own interrupt
   engine watches while the ESP32 sleeps at ~10 uA.

   Not a medical device. A supplement to human care, never a
   replacement for it.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <esp_sleep.h>
#include <driver/rtc_io.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "pendant-01"

#define ADXL_ADDR 0x53
#define PIN_INT   GPIO_NUM_33
#define PIN_BTN   GPIO_NUM_32
#define PIN_VIBE  25
#define PIN_BUZZ  26
#define PIN_LED   27
#define PIN_BATT  34
#define PIN_BATT_EN 14

#define FF_THRESH_G     0.60f
#define IMPACT_THRESH_G 2.50f
#define IMPACT_WINDOW_MS 800
#define ORIENT_CHANGE_DEG 30.0f
#define STILL_THRESH_G  0.18f
#define STILL_WINDOW_MS 2000
#define CANCEL_WINDOW_S  30
#define HEARTBEAT_S  86400ULL

RTC_DATA_ATTR uint32_t bootCount = 0, fallCount = 0, cancelCount = 0;

WiFiClient   net;
PubSubClient mqtt(net);
volatile bool acknowledged = false;

/* ── ADXL345 ────────────────────────────────────────────────── */
void adxlWrite(uint8_t reg, uint8_t val) {
  Wire.beginTransmission(ADXL_ADDR);
  Wire.write(reg); Wire.write(val);
  Wire.endTransmission();
}

uint8_t adxlRead(uint8_t reg) {
  Wire.beginTransmission(ADXL_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom(ADXL_ADDR, 1);
  return Wire.read();
}

void adxlReadXYZ(float &x, float &y, float &z) {
  Wire.beginTransmission(ADXL_ADDR);
  Wire.write(0x32);                     // DATAX0
  Wire.endTransmission(false);
  Wire.requestFrom(ADXL_ADDR, 6);
  int16_t rx = Wire.read() | (Wire.read() << 8);
  int16_t ry = Wire.read() | (Wire.read() << 8);
  int16_t rz = Wire.read() | (Wire.read() << 8);
  x = rx * 0.0039f; y = ry * 0.0039f; z = rz * 0.0039f;   // 3.9 mg/LSB
}

void adxlBegin() {
  adxlWrite(0x2D, 0x00);                // standby while configuring
  adxlWrite(0x31, 0x08);                // full resolution, +/-2 g
  adxlWrite(0x2C, 0x0A);                // 100 Hz output data rate

  // Hardware free-fall detection does the watching while we sleep.
  adxlWrite(0x28, 0x09);                // THRESH_FF: 9 x 62.5 mg = 0.56 g
  adxlWrite(0x29, 0x14);                // TIME_FF:  20 x 5 ms   = 100 ms
  adxlWrite(0x2E, 0x04);                // INT_ENABLE: FREE_FALL only
  adxlWrite(0x2F, 0x00);                // map all interrupts to INT1
  adxlWrite(0x31, adxlRead(0x31) & ~0x20);   // INT active HIGH

  adxlWrite(0x2D, 0x08);                // measurement mode
  adxlRead(0x30);                       // clear any pending interrupt
}

/* ── feedback ───────────────────────────────────────────────── */
void vibe(uint16_t ms) { digitalWrite(PIN_VIBE, HIGH); delay(ms); digitalWrite(PIN_VIBE, LOW); }

void alertPattern(uint8_t intensity) {
  // Escalates as the cancel window runs down.
  for (uint8_t i = 0; i <= intensity; i++) {
    tone(PIN_BUZZ, 2000 + intensity * 300, 150);
    vibe(160);
    delay(120);
  }
}

/* ── battery ────────────────────────────────────────────────── */
float batteryVolts() {
  pinMode(PIN_BATT_EN, OUTPUT);
  digitalWrite(PIN_BATT_EN, HIGH);
  delay(5);
  uint32_t acc = 0;
  for (int i = 0; i < 16; i++) { acc += analogRead(PIN_BATT); delay(2); }
  digitalWrite(PIN_BATT_EN, LOW);
  return (acc / 16.0f / 4095.0f) * 3.3f * 2.0f * 1.04f;
}

/* ── the three-phase classifier ─────────────────────────────── */
struct FallResult {
  bool     isFall;
  float    peakG, orientationDeg;
  uint16_t impactDelayMs;
  const char *rejectedBecause;
};

FallResult classify() {
  FallResult r = { false, 0, 0, 0, nullptr };

  float x, y, z;
  adxlReadXYZ(x, y, z);
  float mag = sqrtf(x * x + y * y + z * z);

  // --- Phase 1: confirm the free fall that woke us ---------------
  uint32_t t0 = millis();
  bool sawFreeFall = false;
  while (millis() - t0 < 400) {
    adxlReadXYZ(x, y, z);
    mag = sqrtf(x * x + y * y + z * z);
    if (mag < FF_THRESH_G) { sawFreeFall = true; break; }
    delay(5);
  }
  if (!sawFreeFall) { r.rejectedBecause = "no-freefall"; return r; }

  // --- Phase 2: impact within the window -------------------------
  uint32_t ffEnd = millis();
  float g1x = 0, g1y = 0, g1z = 0;
  while (millis() - ffEnd < IMPACT_WINDOW_MS) {
    adxlReadXYZ(x, y, z);
    mag = sqrtf(x * x + y * y + z * z);
    if (mag > r.peakG) { r.peakG = mag; }
    if (mag > IMPACT_THRESH_G) { r.impactDelayMs = millis() - ffEnd; break; }
    delay(5);
  }
  if (r.peakG < IMPACT_THRESH_G) { r.rejectedBecause = "no-impact"; return r; }

  delay(300);                                  // let the ringing settle
  adxlReadXYZ(g1x, g1y, g1z);                  // orientation just after impact

  // --- Phase 3: stillness in a changed orientation ---------------
  uint32_t stillStart = millis();
  float sumX = 0, sumY = 0, sumZ = 0;
  int n = 0;
  bool moved = false;
  while (millis() - stillStart < STILL_WINDOW_MS) {
    adxlReadXYZ(x, y, z);
    mag = sqrtf(x * x + y * y + z * z);
    if (fabsf(mag - 1.0f) > STILL_THRESH_G) { moved = true; break; }
    sumX += x; sumY += y; sumZ += z; n++;
    delay(20);
  }
  if (moved || n < 40) { r.rejectedBecause = "recovered"; return r; }

  // Orientation change: dot product of normalised gravity vectors.
  float ax = sumX / n, ay = sumY / n, az = sumZ / n;
  float na = sqrtf(ax * ax + ay * ay + az * az);
  // Reference "upright" orientation captured at the last calm heartbeat.
  static float refX = 0, refY = 0, refZ = 1;
  float dot = (ax * refX + ay * refY + az * refZ) / (na > 0 ? na : 1);
  dot = dot > 1 ? 1 : (dot < -1 ? -1 : dot);
  r.orientationDeg = acosf(dot) * 180.0f / (float)M_PI;

  if (r.orientationDeg < ORIENT_CHANGE_DEG) {
    r.rejectedBecause = "no-orientation-change";
    return r;
  }

  r.isFall = true;
  return r;
}

/* ── location from Wi-Fi access points ──────────────────────── */
String scanLocation() {
  int n = WiFi.scanNetworks(false, false, false, 200);
  String out = "[";
  for (int i = 0; i < n && i < 5; i++) {
    if (i) out += ",";
    out += "{\\"bssid\\":\\"" + WiFi.BSSIDstr(i) + "\\",\\"rssi\\":" + String(WiFi.RSSI(i)) + "}";
  }
  WiFi.scanDelete();
  return out + "]";
}

/* ── alerting ───────────────────────────────────────────────── */
void onMessage(char *topic, byte *payload, unsigned int len) {
  if (len >= 3 && !strncmp((char *)payload, "ACK", 3)) acknowledged = true;
}

bool netUp() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  if (WiFi.status() != WL_CONNECTED) return false;
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);
  mqtt.setBufferSize(1024);
  if (!mqtt.connect(DEVICE_ID)) return false;
  mqtt.subscribe("care/" DEVICE_ID "/cmd");
  return true;
}

void publishAlert(const char *event, const FallResult &r, uint8_t stage) {
  JsonDocument d;
  d["device"] = DEVICE_ID;
  d["event"]  = event;
  d["stage"]  = stage;
  d["peak_g"] = roundf(r.peakG * 100) / 100.0f;
  d["orient_deg"] = roundf(r.orientationDeg);
  d["impact_ms"]  = r.impactDelayMs;
  d["batt_v"] = roundf(batteryVolts() * 100) / 100.0f;
  d["falls"]  = fallCount;
  d["cancels"]= cancelCount;
  char buf[400];
  size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("care/" DEVICE_ID "/alert", (uint8_t *)buf, n, true);

  String loc = scanLocation();
  mqtt.publish("care/" DEVICE_ID "/location", loc.c_str(), true);
}

/* Returns true if the wearer cancelled. */
bool cancelWindow() {
  uint32_t start = millis();
  uint8_t intensity = 0;
  while (millis() - start < CANCEL_WINDOW_S * 1000UL) {
    if (digitalRead(PIN_BTN) == LOW) {
      vibe(400);
      tone(PIN_BUZZ, 1200, 300);
      return true;
    }
    // Escalate every 6 s so it becomes progressively harder to ignore.
    uint8_t want = (millis() - start) / 6000;
    if (want != intensity) intensity = want;
    alertPattern(intensity);
    delay(400);
  }
  return false;
}

/* ── sleep ──────────────────────────────────────────────────── */
void sleepNow() {
  adxlRead(0x30);                       // clear latched interrupt
  rtc_gpio_pullup_dis(PIN_INT);
  rtc_gpio_pulldown_en(PIN_INT);
  esp_sleep_enable_ext0_wakeup(PIN_INT, 1);        // wake on HIGH
  esp_sleep_enable_timer_wakeup(HEARTBEAT_S * 1000000ULL);
  Serial.flush();
  esp_deep_sleep_start();
}

/* ── setup runs once per wake ───────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_VIBE, OUTPUT); pinMode(PIN_LED, OUTPUT);
  pinMode((int)PIN_BTN, INPUT_PULLUP);
  bootCount++;

  Wire.begin(21, 22);
  adxlBegin();

  esp_sleep_wakeup_cause_t why = esp_sleep_get_wakeup_cause();

  /* Manual SOS: the button bypasses detection entirely. */
  if (digitalRead((int)PIN_BTN) == LOW) {
    FallResult manual = { true, 0, 0, 0, nullptr };
    vibe(600);
    if (netUp()) publishAlert("manual-sos", manual, 1);
    for (int i = 0; i < 20 && !acknowledged; i++) { alertPattern(2); mqtt.loop(); delay(500); }
    sleepNow();
  }

  /* Timer wake: heartbeat only. */
  if (why != ESP_SLEEP_WAKEUP_EXT0) {
    FallResult idle = {};
    if (netUp()) { publishAlert("heartbeat", idle, 0); mqtt.loop(); }
    delay(200);
    sleepNow();
  }

  /* Interrupt wake: run the classifier. */
  digitalWrite(PIN_LED, HIGH);
  FallResult r = classify();
  digitalWrite(PIN_LED, LOW);

  if (!r.isFall) {
    Serial.printf("rejected: %s (peak %.2f g)\\n", r.rejectedBecause, r.peakG);
    sleepNow();
  }

  fallCount++;
  Serial.printf("FALL: peak %.2f g, orientation %.0f deg, impact +%u ms\\n",
                r.peakG, r.orientationDeg, r.impactDelayMs);

  if (cancelWindow()) {
    cancelCount++;
    if (netUp()) { publishAlert("cancelled", r, 0); mqtt.loop(); }
    sleepNow();
  }

  /* No cancel — escalate. */
  bool online = netUp();
  for (uint8_t stage = 1; stage <= 3 && !acknowledged; stage++) {
    if (online) publishAlert("fall", r, stage);
    uint32_t t0 = millis();
    while (millis() - t0 < 60000UL && !acknowledged) {
      alertPattern(3);
      if (online) mqtt.loop();
      if (digitalRead((int)PIN_BTN) == LOW) { acknowledged = true; break; }
      delay(600);
    }
  }

  if (online) { publishAlert(acknowledged ? "acknowledged" : "unanswered", r, 4); mqtt.loop(); }
  sleepNow();
}

void loop() { /* never reached */ }`,
    explain: [
      { ref: 'adxlWrite(0x28/0x29) free-fall registers', txt: 'The ADXL345 detects free fall in hardware at about 40 µA. Doing this in firmware would require the ESP32 to stay awake sampling at 100 Hz, which is roughly two thousand times more power and turns months of battery into hours.' },
      { ref: 'Three sequential phases with early returns', txt: 'Each phase can only reject, never confirm alone. That structure is what gives the low false-positive rate: sitting down passes phase 2 and fails phase 1; dropping the pendant passes 1 and 2 and fails 3.' },
      { ref: 'delay(300) before reading orientation', txt: 'The impact makes the whole assembly ring mechanically for a couple of hundred milliseconds. Reading the gravity vector during that ringing gives a meaningless orientation.' },
      { ref: 'moved || n < 40 → "recovered"', txt: 'Someone who gets straight back up did not need an alert. Requiring two full seconds of stillness removes a large fraction of the remaining false positives at almost no cost in sensitivity, because a person who has genuinely fallen is rarely up within two seconds.' },
      { ref: 'alertPattern(intensity) escalating', txt: 'The cancel prompt gets progressively louder and more insistent over the thirty seconds. A single quiet beep is easy to sleep through; a pattern that escalates is not.' },
      { ref: 'Manual SOS checked before everything', txt: 'The button path runs before any classification, so a wearer who feels unwell but has not fallen can still summon help. It is also the simplest possible code path, which is what you want for the function that matters most.' },
      { ref: 'scanLocation() Wi-Fi BSSIDs', txt: 'Scanning access points costs about 200 ms and a few tens of milliamps, against seconds and hundreds of milliamps for a GPS fix that will not work indoors anyway. Indoors, known BSSIDs give room-level accuracy, which is exactly what a responder needs.' },
    ],
  }],

  config: [
    'Tune <code>FF_THRESH_G</code> and the ADXL345 <code>THRESH_FF</code> register together. Lower catches gentler falls and admits more false wakes; 0.5–0.6 g is the usual compromise.',
    'Set <code>IMPACT_THRESH_G</code> for the flooring. Carpet absorbs impact and may need 2.0 g; hard tile produces 4–6 g and tolerates a higher threshold.',
    'Set <code>CANCEL_WINDOW_S</code>. Thirty seconds is long enough for a recovered wearer to react and short enough that a real emergency is not delayed.',
    'Configure the escalation contacts in your Node-RED or Home Assistant flow, not in firmware. The contact list changes far more often than the firmware does.',
    'Capture the reference upright orientation during a calm heartbeat, and re-capture it if the wearer changes how the pendant hangs.',
  ],

  calibration: [
    { h: 'Collect real fall data safely', p: ['Drop the pendant onto a thick mattress from chest height, in several orientations, twenty times. Log peak g, free-fall duration and orientation change for each. That distribution tells you where your thresholds should sit far better than any published figure.'] },
    { h: 'Collect the false-positive set', p: ['Wear it for a normal day, then deliberately sit down heavily twenty times, lie down on a bed twenty times, and set it on a table twenty times. Every one of these must be rejected. If any pass, note which phase failed to reject them and tighten that phase.'] },
    { h: 'Verify sleep current', p: ['Break the battery positive lead and measure in series. You should see 50–90 µA. Above 500 µA means something is still powered — usually a dev board regulator or a permanently connected divider.'] },
    { h: 'Test the escalation end to end', p: ['Trigger a real alert and confirm the notification actually reaches the phone, with the location attached, and that acknowledging it stops the pendant. Do this before the device is relied upon, and repeat quarterly.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Pendant', sub: 'battery, sleeps' }, { name: 'Second pendant', sub: 'optional' }],
      protocol: 'Wi-Fi, on demand',
      gateway: 'Home router', gatewaySub: 'coverage matters',
      uplink: 'MQTT 1883',
      cloud: 'Local broker + Node-RED', cloudSub: 'escalation logic',
      clients: [{ name: 'Family phones', sub: 'push, staged' }, { name: 'Care dashboard', sub: 'history' }],
    },
    protocol: [
      'Alerts are published retained so a phone that comes online after the event still sees it. Escalation staging lives in Node-RED rather than firmware, because contact lists and schedules change often and reflashing a pendant on someone\'s neck is not practical.',
      'The pendant only joins Wi-Fi when it has something to report. Association costs two to four seconds and a few hundred milliamp-milliseconds, which is acceptable a handful of times a day and unaffordable continuously.',
    ],
    topics: [
      { t: 'care/pendant-01/alert', dir: 'device → broker (retained)', payload: 'JSON: event, stage, peak_g, orient_deg, impact_ms, batt_v, falls, cancels' },
      { t: 'care/pendant-01/location', dir: 'device → broker (retained)', payload: 'JSON array of nearby BSSIDs with RSSI' },
      { t: 'care/pendant-01/cmd', dir: 'broker → device', payload: '"ACK" to stop escalation' },
    ],
    mobile: [
      'A Node-RED flow subscribed to the alert topic drives the escalation: stage 1 notifies the primary contact with an urgent-priority ntfy push, waits 60 seconds for an acknowledgement, then stage 2 adds a second contact, then stage 3 notifies everyone. Each notification carries the peak g, the orientation change and the nearest access points.',
      'Add a missed-heartbeat alarm. If a pendant has not reported in 36 hours it is flat, out of range or broken — and a silent pendant is the most dangerous failure this device has.',
    ],
    security: [
      'Use broker authentication. An unauthenticated ACK topic means anyone on the network can silence a real emergency alert.',
      'The location data reveals when someone is home and where in the house. Keep it on a local broker, not a cloud service.',
      'Make the acknowledgement require a deliberate action in the notification, not a swipe-away — an alert dismissed by accident is worse than one that keeps ringing.',
    ],
  },

  testing: [
    { step: 'Measure sleep current', expect: '50–90 µA. Above 500 µA and the battery target is unreachable.' },
    { step: 'Drop the pendant onto a mattress from chest height', expect: 'Wake, classify as a fall, and enter the cancel window within about three seconds.' },
    { step: 'Sit down heavily wearing it, twenty times', expect: 'Zero alerts. Every one should be rejected as <code>no-freefall</code>.' },
    { step: 'Set it down firmly on a table, twenty times', expect: 'Zero alerts, rejected as <code>recovered</code> or <code>no-orientation-change</code>.' },
    { step: 'Lie down on a bed slowly', expect: 'Rejected as <code>no-impact</code> — a controlled descent has no impact spike.' },
    { step: 'Trigger a fall and press cancel', expect: 'Alerts stop immediately, a <code>cancelled</code> event is published, and the pendant returns to sleep.' },
    { step: 'Trigger a fall and do not cancel', expect: 'Escalation through three stages over about three minutes, with the phone notification arriving at stage 1.' },
    { step: 'Press the SOS button while idle', expect: 'Immediate alert with no classification, which is the point of the manual path.' },
  ],

  troubleshoot: [
    {
      sym: 'The pendant never wakes on a fall',
      cause: 'The interrupt pin is not RTC-capable, the ADXL345 interrupt polarity is wrong, or the latched interrupt was never cleared.',
      fix: 'Use an RTC GPIO (32–39, 25–27, 12–15, 4, 2, 0). Set INT_INVERT off so the interrupt is active high and wake on HIGH. Read register 0x30 before sleeping to clear the latch — an uncleared latch means the pin is already high and the next event produces no edge.',
    },
    {
      sym: 'Constant false alarms while walking',
      cause: 'Free-fall threshold too high or the time window too short, so ordinary arm swing triggers it.',
      fix: 'Lower <code>THRESH_FF</code> to 0.5 g and raise <code>TIME_FF</code> to 100 ms or more. Arm-swing dips last under 40 ms; a real fall sustains it for 200 ms or longer. The time window is a more effective discriminator than the threshold.',
    },
    {
      sym: 'Genuine falls are missed',
      cause: 'A fall onto a soft surface or a partly-broken fall never reaches the impact threshold.',
      fix: 'Lower <code>IMPACT_THRESH_G</code> to 2.0 g and verify against your own logged drop data. Accept that a slow slide down a wall may produce neither free fall nor impact — no accelerometer-only device catches that, which is why the manual SOS button is essential rather than optional.',
    },
    {
      sym: 'Battery lasts days rather than months',
      cause: 'A development board rather than a bare module, or the accelerometer is being polled instead of interrupting.',
      fix: 'A DevKit draws 8–20 mA asleep from its regulator and USB chip. Use a bare ESP32-WROOM with an efficient LDO. Confirm the classifier only runs after an interrupt wake, never on a timer.',
    },
    {
      sym: 'Orientation change reads near zero for a real fall',
      cause: 'The reference orientation is stale or was captured while the pendant was already lying down.',
      fix: 'Capture the reference during a calm heartbeat when the device has been still and upright for a while, and re-capture whenever the wearer reports the pendant hangs differently.',
    },
    {
      sym: 'The alert never reaches the phone',
      cause: 'Wi-Fi association is slower than the allowance, or the escalation flow is not running.',
      fix: 'Cache the channel and BSSID in RTC memory to halve association time. Test the whole chain end to end monthly — an escalation flow that silently stopped working is the single most dangerous failure mode this system has.',
    },
  ],

  perf: [
    'Let the accelerometer do the watching. Its hardware free-fall detection at 40 µA replaces continuous 100 Hz sampling on the MCU, which is the entire reason this runs for months.',
    'Cache the Wi-Fi channel and BSSID in RTC memory so an alert connects in about one second instead of four.',
    'Scan access points rather than acquiring GPS. A GPS cold fix costs 30 seconds and hundreds of milliamps and does not work indoors, which is where most falls happen.',
  ],

  safety: [
    '<b>This is not a medical device and must never be the only safety measure.</b> No accelerometer algorithm catches every fall — a slow slide down a wall produces neither free fall nor impact.',
    'The lanyard must break away under load. A fixed cord around the neck of a person who has fallen is a strangulation hazard, and this population is exactly the one at risk.',
    'Test the full escalation chain monthly, including that the notification arrives and can be acknowledged. A pendant that alerts into a broken flow is worse than none, because everyone believes it is working.',
    'Never disable the manual SOS path to save power or code. It is the function that works when the classifier does not.',
  ],

  maintenance: [
    'Charge when a heartbeat reports below 3.5 V; do not wait for the device to die.',
    'Test a real fall and a real escalation quarterly, with the intended recipients.',
    'Check the lanyard break-away clasp still releases under load every few months — they stiffen with wear.',
  ],

  future: [
    'Add a <b>gyroscope</b> (upgrade to an MPU-6050 or IMU with sensor fusion). Angular velocity during a fall is a strong additional feature and improves discrimination of the slow-slide case.',
    'Add a <b>small on-device classifier</b> trained on your own labelled fall and non-fall data. A decision tree with ten features outperforms hand-tuned thresholds and still runs in kilobytes.',
    'Add <b>LoRa</b> as a fallback transport so an alert works outside Wi-Fi range, in a garden or a stairwell.',
    'Add a <b>speaker and two-way audio</b> so a responder can talk to the wearer immediately, which is what commercial systems do and what most reassures families.',
    'Add <b>barometric altitude</b> — a rapid pressure increase of a few pascals is a direct measurement of descending, and it disambiguates a fall from a fall down stairs.',
  ],

  faq: [
    { q: 'Why not just use a single acceleration threshold?', a: 'Because it does not work. Sitting down heavily produces 2–3 g, which overlaps completely with a fall onto carpet. Setting a pendant on a table produces more. Any single threshold either misses real falls or fires constantly, and a device that fires constantly gets removed and left in a drawer — which is a worse outcome than no device.' },
    { q: 'What is the actual accuracy?', a: 'With the three-phase approach and thresholds tuned on your own data, published implementations of this class typically report 85–95 % sensitivity with under one false alarm per week. That is good enough to be useful and not good enough to be relied upon alone. The manual SOS button covers the gap.' },
    { q: 'Why not add a gyroscope?', a: 'You should, if you want the best result — angular velocity during a fall is genuinely informative and the MPU-6050 costs the same as the ADXL345. The reason this build uses an accelerometer alone is power: the ADXL345 has hardware free-fall detection at 40 µA, while running a gyroscope continuously costs several milliamps. A hybrid that wakes the gyroscope on the accelerometer interrupt gets both.' },
    { q: 'How is the location determined without GPS?', a: 'By scanning nearby Wi-Fi access points and reporting their BSSIDs and signal strengths. Indoors this gives room-level accuracy once you have mapped which access points are strongest where, and it costs 200 ms instead of the 30 seconds and high current a GPS cold fix needs — and GPS does not work indoors anyway, which is where most falls happen.' },
    { q: 'What happens if the wearer falls out of Wi-Fi range?', a: 'The local alarm still sounds, which is the most important part, but no remote alert is sent. This is the main argument for adding LoRa, which covers a whole property and garden from one gateway. It is also why the pendant should be tested in every room the wearer uses.' },
    { q: 'Is thirty seconds too long to wait before alerting?', a: 'It is a genuine trade-off and worth thinking about. Thirty seconds delays real help slightly; a shorter window means every recoverable stumble becomes a family emergency. The escalating haptic pattern matters more than the duration — a wearer who is conscious will cancel within a few seconds, and one who cannot cancel is exactly the case where the delay costs least relative to the benefit.' },
  ],

  refs: [
    { t: 'ADXL345 3-axis digital accelerometer — datasheet with free-fall and activity registers', u: 'https://www.analog.com/media/en/technical-documentation/data-sheets/ADXL345.pdf', s: 'Analog Devices' },
    { t: 'Bourke et al., "Evaluation of a threshold-based tri-axial accelerometer fall detection algorithm"', u: 'https://doi.org/10.1016/j.gaitpost.2006.03.009', s: 'Gait & Posture, 2007' },
    { t: 'Noury et al., "Fall detection — Principles and Methods"', u: 'https://doi.org/10.1109/IEMBS.2007.4352627', s: 'IEEE EMBS, 2007' },
    { t: 'Chaudhuri et al., "Fall detection devices and their use with older adults: a systematic review"', u: 'https://doi.org/10.1519/JPT.0b013e3182website', s: 'Journal of Geriatric Physical Therapy' },
    { t: 'ESP32 deep sleep and ext0 wake sources', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/sleep_modes.html', s: 'Espressif' },
    { t: 'WHO — Falls fact sheet', u: 'https://www.who.int/news-room/fact-sheets/detail/falls', s: 'World Health Organization' },
  ],

  images: ['health', 'sensor', 'esp32'],
  imageCaptions: [
    'A wrist-worn wearable. A pendant form factor is generally preferred for fall detection because chest-level mounting gives a cleaner orientation signal than a wrist.',
    'A sensor breakout module. The ADXL345 used here has hardware free-fall detection, which is what makes months of battery life possible.',
    'An ESP32 module. For a battery build, use the bare module rather than a development board — the board\'s regulator alone would flatten the cell in days.',
  ],
},

];
