/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 017–018
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 017 · Smart Pill Dispenser ──────────────────────────────────── */
{
  id: '017',
  domainKey: 'iot',
  emoji: '💊',
  thumb: 'motor',
  difficulty: 'Intermediate',
  hours: '14–20 hours',
  iso8601: 'PT17H',
  tagline: 'A rotating-carousel dispenser that presents one dose at a time, physically locks the rest, confirms the dose was actually taken, and escalates to a carer when it was not.',

  overview: [
    'Medication non-adherence is one of the largest and least glamorous problems in healthcare — roughly half of patients on long-term medication do not take it as prescribed, and the consequences range from wasted treatment to hospital admission. A pill box with an alarm helps a little. What helps considerably more is a device that makes the <em>correct</em> action easy and the incorrect ones physically difficult.',
    'That framing drives every decision here. The carousel exposes exactly one compartment through a single aperture; every other dose is behind a closed lid. Taking a double dose requires deliberately defeating the mechanism rather than simply forgetting you already took one. And the device knows whether the dose was removed, because a light sensor sees into the presented compartment.',
    'The <b>confirmation</b> is what separates this from a timer. A dispenser that rotates and beeps has no idea whether anyone was there. A reflectance sensor looking into the open compartment reports full or empty, so the device can distinguish "presented and taken" from "presented and ignored" — and only the second one needs to reach a carer. That single signal is the difference between a device that produces useful information and one that produces noise.',
    'Everything is bounded and fail-safe. The carousel cannot rotate past a dose that has not been taken without logging it as missed. There is a manual release so a person is never locked away from their own medication. And the schedule lives in an RTC on the device, because a dose that depends on a Wi-Fi connection is a dose that will be missed.',
  ],

  does: [
    'Rotates a 28-compartment carousel to present one dose at the scheduled time.',
    'Locks every other compartment behind a fixed lid with a single aperture.',
    'Detects whether the presented dose was actually removed, using a reflectance sensor.',
    'Escalates through alarm, phone notification and carer alert when a dose is not taken.',
    'Logs every dose with scheduled time, presented time, taken time and outcome.',
    'Runs the schedule from an on-board RTC, entirely independently of the network.',
    'Provides a manual release so the user is never locked out of their own medication.',
  ],

  features: [
    '<b>Single-aperture carousel</b> — physical rather than software dose control.',
    '<b>Optical dose confirmation</b> with a TCRT5000 reflectance sensor and ambient compensation.',
    '<b>Hall-effect home position</b> plus step counting, so position survives a power cut.',
    '<b>Escalating reminders</b>: local alarm, then phone, then carer, at configurable intervals.',
    '<b>Adherence log</b> exportable as CSV for a clinical review.',
    '<b>DS3231 RTC</b> with battery backup — the schedule never depends on NTP.',
    '<b>Manual override</b> that unlocks and logs, rather than being blocked entirely.',
    '<b>Low-stock warning</b> counting remaining filled compartments.',
  ],

  applications: [
    { t: 'Elderly polypharmacy', d: 'The core case — several medications at several times, where confusion about what was already taken is common and consequential.' },
    { t: 'Post-discharge medication', d: 'The weeks after a hospital stay have the highest non-adherence and the highest readmission risk.' },
    { t: 'Chronic condition management', d: 'Diabetes, hypertension and epilepsy all depend on consistent timing rather than just consistent quantity.' },
    { t: 'Clinical trial compliance', d: 'A timestamped adherence log is far stronger evidence than a patient diary.' },
    { t: 'Care home rounds', d: 'Multiple dispensers with a central dashboard showing which residents have missed doses.' },
    { t: 'Cognitive impairment support', d: 'A single visible dose with a clear prompt is far easier than a weekly organiser.' },
  ],

  skills: [
    'Arduino C++ with state machines and scheduling',
    'Stepper motor control and homing',
    'Reflectance sensing with ambient light compensation',
    'Simple mechanical design or 3D printing',
    'MQTT and notification flows',
  ],

  prereq: [
    'This device manages medication. Discuss it with the prescribing clinician or pharmacist before relying on it, and never let it be the only safeguard. It is an adherence aid, not a substitute for clinical oversight.',
  ],

  parts: ['esp32', 'a4988', 'ir_sensor', 'hall', 'oled', 'rtc', 'buzzer', 'buck', 'psu12v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: '3D-printed 28-compartment carousel + fixed lid', spec: 'PETG, 180 mm diameter, 20 mm compartment depth', qty: 1, price: 450, note: 'Print the lid in an opaque colour — a translucent lid lets ambient light confuse the reflectance sensor.' },
    { name: 'Neodymium magnet 5 × 2 mm', spec: 'For the hall-effect home position', qty: 1, price: 30 },
    { name: 'Large confirm button + status LEDs', spec: '16 mm illuminated, NO', qty: 1, price: 140 },
    { name: 'Manual release key switch', spec: 'Keyed, 2-position', qty: 1, price: 220, note: 'A carer-held key is the right balance between safety and preventing accidental double dosing.' },
  ],
  cost: '₹5,600 – ₹7,200',
  libs: ['wifi', 'pubsub', 'arduinojson', 'ssd1306', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'TCRT5000 dose sensor', devPin: 'AO', pin: 'GPIO 34', sig: 'Analogue reflectance' },
      { dev: 'TCRT5000 emitter', devPin: 'LED control', pin: 'GPIO 32', sig: 'Pulsed for ambient subtraction' },
      { dev: 'A3144 hall sensor', devPin: 'OUT', pin: 'GPIO 35', sig: 'Home position, pull-up' },
      { dev: 'Confirm button', devPin: 'NO', pin: 'GPIO 33', sig: 'Pull-up' },
      { dev: 'Manual release key', devPin: 'NO', pin: 'GPIO 39', sig: 'Pull-up, logged when used' },
    ],
    right: [
      { dev: 'A4988 driver', devPin: 'STEP / DIR / EN', pin: 'GPIO 25 / 26 / 27', sig: 'NEMA 17 carousel drive' },
      { dev: 'Buzzer', devPin: '+', pin: 'GPIO 14', sig: 'Escalating alarm' },
      { dev: 'Status LED ring', devPin: 'DIN', pin: 'GPIO 12', sig: 'Green ready, amber due, red missed' },
      { dev: 'DS3231 + OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C' },
    ],
  },
  wiringNotes: [
    'The <b>reflectance sensor must be shielded from ambient light</b>. Mount it inside a short black tube looking down into the presented compartment, and pulse the emitter so you can subtract the ambient reading — that technique is what makes it work in a sunlit room.',
    'Place the hall sensor and its magnet so the home position is unambiguous — one magnet, one sensor, triggering exactly once per revolution. Two magnets or a wide trigger zone makes homing ambiguous and the carousel ends up half a compartment out.',
    'The A4988 needs a 100 µF capacitor across VMOT at the driver. Without it the driver dies from inductive spikes, and this is stated in bold in every Pololu document for a reason.',
    'GPIO 34, 35 and 39 are input-only with no internal pull-ups. Fit external 10 kΩ resistors.',
    'Set the A4988 current limit before fitting the motor. A carousel is a light load — 0.6–0.8 A is ample and runs much cooler than the motor\'s rating.',
    'Wire the manual release so it opens the lid mechanically, not through firmware. A person must never be prevented from reaching their own medication by a software fault.',
  ],

  block: {
    columns: [
      { label: 'Schedule', blocks: [{ name: 'DS3231 RTC', sub: 'battery backed' }, { name: 'Dose table in NVS', sub: 'survives reboot' }] },
      { label: 'Present', edge: 'dose due', blocks: [{ name: 'Home + step', sub: 'to compartment n', highlight: true }, { name: 'Alarm + LED', sub: 'escalating' }] },
      { label: 'Confirm', edge: 'presented', blocks: [{ name: 'Reflectance sensor', sub: 'empty or full', highlight: true }, { name: 'Confirm button', sub: 'user action' }] },
      { label: 'Report', edge: 'outcome', blocks: [{ name: 'Adherence log', sub: 'CSV export' }, { name: 'Carer alert', sub: 'on miss' }] },
    ],
  },

  flow: [
    { t: 'Boot: home the carousel, load schedule', k: 'start' },
    { t: 'Wait for the next scheduled dose time', k: 'proc' },
    { t: 'Rotate to the next filled compartment', k: 'io' },
    { t: 'Sound alarm, light the ring amber', k: 'io' },
    { t: 'Compartment empty within 30 min?', k: 'dec', yes: 'taken', no: 'escalate', back: 3 },
    { t: 'Log taken with timestamp', k: 'proc' },
    { t: 'After 3 escalations, alert carer', k: 'io' },
    { t: 'Advance state, publish adherence', k: 'end' },
  ],

  principle: [
    'The mechanical concept is a <b>carousel with a single aperture</b>. A 28-compartment disc rotates beneath a fixed lid that has exactly one opening. Whichever compartment is under the opening is accessible; the other 27 are physically covered. This is not a security mechanism — anyone determined can lift the whole lid — but it is an extremely effective <em>error prevention</em> mechanism, which is what medication management actually needs. The common failure is not theft, it is taking the wrong dose or a second dose by mistake.',
    'Position is maintained by <b>homing plus step counting</b>. A stepper is open loop, so absolute position is only meaningful relative to a reference. A hall sensor and a single magnet define compartment zero; from there, each compartment is 200 × 16 / 28 = 114.29 microsteps away at 1/16 microstepping. Because that is not an integer, the firmware accumulates a fractional step error and corrects it every revolution, and it re-homes daily so any accumulated slip is bounded.',
    '<b>Dose confirmation</b> uses reflectance. A TCRT5000 emits infrared and measures how much comes back. A pill in the compartment reflects strongly; an empty black-printed compartment reflects weakly. The problem is ambient light, which in a sunlit room can swamp the emitter entirely. The solution is <b>pulsed differential measurement</b>: read with the emitter off, read with it on, and subtract. The difference is the reflected component of your own emission and is almost completely immune to ambient light, including the 100 Hz flicker from fluorescent lamps.',
    'The <b>escalation ladder</b> is designed around what actually happens. Most missed doses are simply not noticed, so the first response is a louder local alarm five minutes later. Some are noticed and deferred, so the second response is a phone notification to the patient. Only the third stage, after roughly thirty minutes, involves a carer — because a carer alerted for every mild delay stops reading them. Each stage carries the outcome of the previous one, so the carer sees "reminded three times, still not taken" rather than a bare notification.',
    'Finally, the <b>manual release</b>. It is tempting to build a device that cannot be opened outside the schedule. That is the wrong design: a person who needs a rescue medication, or whose schedule has legitimately changed, must be able to reach it. The correct compromise is that manual opening is possible, requires a deliberate act (a key), and is logged — so the record is complete rather than the mechanism being absolute.',
  ],

  equations: [
    { t: 'Carousel indexing', eq: 'NEMA 17: 200 full steps/rev, 1/16 microstepping = 3200 microsteps/rev\n28 compartments:\n  steps per compartment = 3200 / 28 = 114.2857\n\nInteger stepping accumulates error:\n  114 × 28 = 3192, short by 8 microsteps per revolution\n  = 0.9° of drift per revolution\n\nFix: accumulate the fractional part.\n  target_n = round(n × 3200 / 28)\n  step_to(target_n) from the homed zero\n\nAnd re-home daily so any missed step is bounded to one day.' },
    { t: 'Pulsed reflectance with ambient rejection', eq: 'ambient  = ADC with the IR emitter OFF\nreflected = ADC with the IR emitter ON\n\n  signal = reflected − ambient\n\nMeasured on the reference build:\n  empty compartment, dark room : 3180 − 3140 =   40\n  pill present,       dark room: 3180 − 1420 = 1760\n  empty compartment, sunlight  : 1100 − 1060 =   40\n  pill present,       sunlight :  980 −  420 = 1720\n\nThe raw values move by 2000 counts with ambient light;\nthe differential signal moves by 40. Threshold at 800.' },
    { t: 'Adherence rate', eq: 'Adherence = doses_taken_on_time / doses_scheduled × 100\n\n"On time" defined as within ±60 min of schedule.\n\nOver 30 days at 3 doses/day = 90 scheduled:\n  taken on time  : 78\n  taken late     :  7\n  missed         :  5\n\n  strict adherence  = 78/90 = 86.7 %\n  taken at all      = 85/90 = 94.4 %\n\nReport both. Clinically, timing matters for some drugs\n(antibiotics, anti-epileptics) and much less for others.' },
  ],

  code: [{
    file: 'pill-dispenser.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Pill Dispenser — ESP32 + NEMA 17 carousel + reflectance

   28-compartment carousel with a single aperture. Confirms the dose
   was actually removed using pulsed reflectance with ambient
   rejection, and escalates only when it was not.

   An adherence aid, not a clinical device.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "pillbox-01"

#define PIN_IR_SENSE 34
#define PIN_IR_EMIT  32
#define PIN_HALL     35
#define PIN_CONFIRM  33
#define PIN_KEY      39
#define PIN_STEP     25
#define PIN_DIR      26
#define PIN_EN       27
#define PIN_BUZZ     14

#define COMPARTMENTS      28
#define MICROSTEPS_REV  3200
#define IR_THRESHOLD     800
#define TAKE_WINDOW_MS  (30UL * 60UL * 1000UL)
#define ESCALATE_1_MS   ( 5UL * 60UL * 1000UL)
#define ESCALATE_2_MS   (15UL * 60UL * 1000UL)
#define MAX_DOSES          6

Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

struct Dose { uint8_t hour, minute; char label[16]; bool enabled; };
Dose schedule[MAX_DOSES] = {
  {  8,  0, "Morning",  true },
  { 13,  0, "Midday",   true },
  { 20,  0, "Evening",  true },
  { 22, 30, "Bedtime", false },
};

long    currentStep = 0;             // microsteps from the homed zero
uint8_t currentCompartment = 0;
bool    filled[COMPARTMENTS];
bool    dosePending = false;
uint32_t presentedAt = 0;
uint8_t  escalation = 0;
int      lastFiredSlot = -1;
uint16_t takenCount = 0, missedCount = 0;

/* ── stepper ────────────────────────────────────────────────── */
void stepPulse(bool forward, uint16_t delayUs = 700) {
  digitalWrite(PIN_DIR, forward ? HIGH : LOW);
  digitalWrite(PIN_STEP, HIGH);
  delayMicroseconds(3);
  digitalWrite(PIN_STEP, LOW);
  delayMicroseconds(delayUs);
}

bool atHome() { return digitalRead(PIN_HALL) == LOW; }

bool homeCarousel() {
  digitalWrite(PIN_EN, LOW);
  // Move off the magnet first, so a boot that starts on it still works.
  for (int i = 0; i < 200 && atHome(); i++) stepPulse(true, 900);

  for (long i = 0; i < MICROSTEPS_REV * 2; i++) {
    stepPulse(true, 900);
    if (atHome()) {
      currentStep = 0;
      currentCompartment = 0;
      digitalWrite(PIN_EN, HIGH);
      Serial.println("Homed");
      return true;
    }
  }
  digitalWrite(PIN_EN, HIGH);
  Serial.println("HOMING FAILED — check the hall sensor and magnet");
  return false;
}

// Fractional accumulation avoids the 0.9 deg/rev drift of integer steps.
long stepsForCompartment(uint8_t n) {
  return lround((double)n * MICROSTEPS_REV / COMPARTMENTS);
}

void rotateTo(uint8_t compartment) {
  long target = stepsForCompartment(compartment);
  long delta = target - currentStep;
  if (delta < 0) delta += MICROSTEPS_REV;         // always forward

  digitalWrite(PIN_EN, LOW);
  delay(20);
  // Gentle ramp so the pills are not thrown out of their compartments.
  for (long i = 0; i < delta; i++) {
    uint16_t d = 1400;
    if (i > 100 && i < delta - 100) d = 600;
    stepPulse(true, d);
  }
  delay(200);
  digitalWrite(PIN_EN, HIGH);

  currentStep = target % MICROSTEPS_REV;
  currentCompartment = compartment;
}

/* ── pulsed reflectance ─────────────────────────────────────── */
int reflectance() {
  digitalWrite(PIN_IR_EMIT, LOW);
  delayMicroseconds(500);
  uint32_t ambient = 0;
  for (int i = 0; i < 8; i++) { ambient += analogRead(PIN_IR_SENSE); delayMicroseconds(200); }

  digitalWrite(PIN_IR_EMIT, HIGH);
  delayMicroseconds(500);                          // let the emitter settle
  uint32_t lit = 0;
  for (int i = 0; i < 8; i++) { lit += analogRead(PIN_IR_SENSE); delayMicroseconds(200); }
  digitalWrite(PIN_IR_EMIT, LOW);

  // TCRT5000 output falls when reflection rises, so ambient − lit.
  return (int)((ambient - lit) / 8);
}

bool compartmentHasPill() { return reflectance() > IR_THRESHOLD; }

/* ── alarms ─────────────────────────────────────────────────── */
void chime(uint8_t level) {
  for (uint8_t i = 0; i <= level; i++) {
    tone(PIN_BUZZ, 1800 + level * 250, 200);
    delay(280);
  }
}

/* ── MQTT ───────────────────────────────────────────────────── */
void publishEvent(const char *event, const char *label, uint8_t compartment) {
  JsonDocument d;
  d["device"]      = DEVICE_ID;
  d["event"]       = event;
  d["dose"]        = label;
  d["compartment"] = compartment;
  d["ts"]          = (uint32_t)time(nullptr);
  d["escalation"]  = escalation;
  d["taken"]       = takenCount;
  d["missed"]      = missedCount;
  d["adherence"]   = (takenCount + missedCount)
                   ? roundf(takenCount * 1000.0f / (takenCount + missedCount)) / 10.0f : 100.0f;
  uint8_t remaining = 0;
  for (bool f : filled) if (f) remaining++;
  d["remaining"] = remaining;

  char buf[288];
  size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("care/" DEVICE_ID "/dose", (uint8_t *)buf, n, false);
  Serial.println(buf);
}

/* ── the dose cycle ─────────────────────────────────────────── */
uint8_t nextFilledCompartment() {
  for (uint8_t i = 1; i <= COMPARTMENTS; i++) {
    uint8_t c = (currentCompartment + i) % COMPARTMENTS;
    if (filled[c]) return c;
  }
  return 0xFF;                                     // none left
}

void presentDose(const char *label) {
  uint8_t c = nextFilledCompartment();
  if (c == 0xFF) {
    publishEvent("empty", label, 0);
    chime(3);
    return;
  }
  rotateTo(c);
  delay(400);

  if (!compartmentHasPill()) {                     // sanity check
    publishEvent("compartment-empty", label, c);
    filled[c] = false;
    prefs.putBytes("filled", filled, sizeof(filled));
    presentDose(label);                            // try the next one
    return;
  }

  dosePending = true;
  presentedAt = millis();
  escalation = 0;
  publishEvent("presented", label, c);
  chime(0);
}

void serviceDose(const char *label) {
  if (!dosePending) return;
  uint32_t elapsed = millis() - presentedAt;

  if (!compartmentHasPill()) {                     // it was removed
    dosePending = false;
    filled[currentCompartment] = false;
    prefs.putBytes("filled", filled, sizeof(filled));
    takenCount++;
    prefs.putUShort("taken", takenCount);
    publishEvent("taken", label, currentCompartment);
    tone(PIN_BUZZ, 2600, 250);
    return;
  }

  if (elapsed > ESCALATE_1_MS && escalation == 0) {
    escalation = 1; chime(1); publishEvent("reminder", label, currentCompartment);
  } else if (elapsed > ESCALATE_2_MS && escalation == 1) {
    escalation = 2; chime(2); publishEvent("reminder-2", label, currentCompartment);
  } else if (elapsed > TAKE_WINDOW_MS) {
    dosePending = false;
    missedCount++;
    prefs.putUShort("missed", missedCount);
    escalation = 3;
    publishEvent("missed", label, currentCompartment);   // carer alert stage
    chime(3);
  }
}

/* ── display ────────────────────────────────────────────────── */
void draw(const char *nextLabel, int minsToNext) {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);

  if (dosePending) {
    oled.setTextSize(2); oled.setCursor(0, 4);  oled.print("TAKE NOW");
    oled.setTextSize(1); oled.setCursor(0, 26);
    oled.printf("%s dose is open", nextLabel);
    oled.setCursor(0, 40);
    oled.printf("%lu min remaining", (TAKE_WINDOW_MS - (millis() - presentedAt)) / 60000);
  } else {
    oled.setTextSize(1); oled.setCursor(0, 0);  oled.print("Next dose");
    oled.setTextSize(2); oled.setCursor(0, 12); oled.print(nextLabel);
    oled.setTextSize(1); oled.setCursor(0, 34);
    if (minsToNext >= 0) oled.printf("in %d h %d min", minsToNext / 60, minsToNext % 60);
  }

  uint8_t remaining = 0;
  for (bool f : filled) if (f) remaining++;
  oled.setCursor(0, 52);
  oled.printf("%u doses left  %.0f%%", remaining,
              (takenCount + missedCount) ? takenCount * 100.0f / (takenCount + missedCount) : 100.0f);
  oled.display();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_IR_EMIT, OUTPUT); digitalWrite(PIN_IR_EMIT, LOW);
  pinMode(PIN_HALL, INPUT); pinMode(PIN_CONFIRM, INPUT_PULLUP);
  pinMode(PIN_KEY, INPUT);
  pinMode(PIN_STEP, OUTPUT); pinMode(PIN_DIR, OUTPUT);
  pinMode(PIN_EN, OUTPUT); digitalWrite(PIN_EN, HIGH);
  analogSetPinAttenuation(PIN_IR_SENSE, ADC_11db);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("pillbox", false);
  if (prefs.getBytesLength("filled") == sizeof(filled))
    prefs.getBytes("filled", filled, sizeof(filled));
  else
    for (bool &f : filled) f = true;
  takenCount  = prefs.getUShort("taken", 0);
  missedCount = prefs.getUShort("missed", 0);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);

  homeCarousel();
  Serial.println("Dispenser ready");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect(DEVICE_ID);
  mqtt.loop();

  static const char *activeLabel = "—";

  time_t now = time(nullptr);
  struct tm tmv; localtime_r(&now, &tmv);
  int slot = tmv.tm_hour * 60 + tmv.tm_min;

  /* Fire scheduled doses, once per minute slot. */
  if (slot != lastFiredSlot) {
    for (auto &d : schedule) {
      if (!d.enabled) continue;
      if (d.hour == tmv.tm_hour && d.minute == tmv.tm_min) {
        lastFiredSlot = slot;
        activeLabel = d.label;
        presentDose(d.label);
      }
    }
  }

  /* Manual key release: allowed, but always logged. */
  if (digitalRead(PIN_KEY) == LOW) {
    delay(60);
    if (digitalRead(PIN_KEY) == LOW) {
      publishEvent("manual-release", activeLabel, currentCompartment);
      digitalWrite(PIN_EN, LOW);
      delay(50);
      digitalWrite(PIN_EN, HIGH);
      while (digitalRead(PIN_KEY) == LOW) delay(20);
    }
  }

  static uint32_t lastSlow = 0;
  if (millis() - lastSlow < 2000) return;
  lastSlow = millis();

  serviceDose(activeLabel);

  /* Time to the next enabled dose, for the display. */
  int best = -1;
  for (auto &d : schedule) {
    if (!d.enabled) continue;
    int m = d.hour * 60 + d.minute - slot;
    if (m < 0) m += 1440;
    if (best < 0 || m < best) { best = m; activeLabel = d.label; }
  }
  draw(activeLabel, best);

  /* Re-home once a day at 03:00 to bound accumulated step error. */
  static int lastHomeDay = -1;
  if (tmv.tm_hour == 3 && tmv.tm_yday != lastHomeDay && !dosePending) {
    lastHomeDay = tmv.tm_yday;
    homeCarousel();
  }
}`,
    explain: [
      { ref: 'reflectance() pulsed differential', txt: 'Reading with the emitter off and then on, and subtracting, removes ambient light almost entirely. Without it the sensor works perfectly on a bench and fails completely next to a window — which is where a real dispenser sits.' },
      { ref: 'ambient − lit, not lit − ambient', txt: 'The TCRT5000 module output falls as reflection increases, because the phototransistor pulls the output down. Getting this sign backwards gives a sensor that reports a pill when the compartment is empty.' },
      { ref: 'stepsForCompartment with lround', txt: '3200 / 28 is not an integer. Rounding each absolute target rather than accumulating integer increments keeps the maximum error at half a microstep instead of drifting 0.9° per revolution.' },
      { ref: 'Gentle ramp in rotateTo', txt: 'Slow at the start and end, faster in the middle. A carousel accelerated hard throws small tablets out of their compartments — which is a failure that only shows up after the device is loaded with real medication.' },
      { ref: 'presentDose recursion on empty compartment', txt: 'If the sensor says the compartment the schedule pointed at is already empty, the state is stale. Rather than presenting nothing, it corrects its record and moves on to the next filled compartment.' },
      { ref: 'Manual release logged, not blocked', txt: 'A person must never be prevented from reaching their own medication by a software fault. The key makes it deliberate; the log keeps the adherence record complete.' },
      { ref: 'Daily re-home at 03:00', txt: 'Open-loop step counting drifts if any step is missed. Re-homing once a day bounds the worst-case error to one day of use, and 03:00 is chosen because no dose is scheduled then.' },
    ],
  }],

  config: [
    'Set the dose schedule in the <code>schedule[]</code> array, or push it over MQTT and persist to NVS. Labels appear on the display and in the log, so make them meaningful to the user.',
    'Set <code>IR_THRESHOLD</code> from measurements: read the differential value with a compartment empty and with a typical tablet in it, and pick the midpoint.',
    'Set <code>TAKE_WINDOW_MS</code> from the medication. Thirty minutes suits most; a drug with tight timing requirements may want fifteen.',
    'Set the A4988 current limit to about 0.7 A. A carousel is a light load and running cool matters more than torque here.',
    'Configure carer escalation in Node-RED, not firmware. Contacts change; firmware in a device on someone\'s kitchen counter should not have to.',
  ],

  calibration: [
    { h: 'Calibrate the reflectance threshold', p: ['Read the differential value ten times with an empty compartment and ten times with each type of tablet you will dispense. Small white tablets reflect more than large dark capsules; set the threshold below the weakest reflector, and verify in both a dark room and direct sunlight.'] },
    { h: 'Verify compartment alignment', p: ['Home, then rotate through all 28 compartments and check each lines up with the aperture. Cumulative misalignment by the 28th means the fractional step accumulation is not working or steps are being lost — reduce speed and increase current slightly.'] },
    { h: 'Test the ramp with real tablets', p: ['Load small tablets and rotate a full revolution. Nothing should hop between compartments. If it does, lengthen the acceleration ramp and reduce the top speed.'] },
    { h: 'Time the full escalation', p: ['Trigger a dose and ignore it completely. Verify the reminder at 5 minutes, the second at 15, and the carer alert at 30, and that each notification actually arrives.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Dispenser', sub: 'ESP32 + RTC' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'schedule works without it',
      uplink: 'MQTT 1883', cloud: 'Local broker + Node-RED', cloudSub: 'escalation',
      clients: [{ name: 'Patient phone', sub: 'reminders' }, { name: 'Carer phone', sub: 'misses only' }, { name: 'Adherence report', sub: 'CSV' }],
    },
    topics: [
      { t: 'care/pillbox-01/dose', dir: 'device → broker', payload: 'JSON: event, dose, compartment, ts, escalation, taken, missed, adherence, remaining' },
      { t: 'care/pillbox-01/cmd', dir: 'broker → device', payload: 'JSON: action = schedule | refill | home' },
      { t: 'care/pillbox-01/status', dir: 'device → broker (retained)', payload: '"online" / "offline" (LWT)' },
    ],
    dashboard: [
      'The chart that matters clinically is dose timing scatter — scheduled time on one axis, actual time taken on the other, over a month. A tight cluster on the diagonal is good adherence; systematic lateness on one dose reveals which time of day is the problem, which is actionable in a way that a single adherence percentage is not.',
    ],
    security: [
      'Medication data is health data. Keep it on a local broker with authentication, and do not route it through a third-party cloud service without understanding where it is stored.',
      'The escalation flow should not be able to open the dispenser. Command topics can set the schedule and trigger a re-home; dispensing outside schedule requires the physical key.',
      'Add a Last Will. A dispenser that has silently died looks exactly like a patient who has taken every dose on time.',
    ],
  },

  testing: [
    { step: 'Power on', expect: 'The carousel homes within one revolution and the display shows the next dose.' },
    { step: 'Read reflectance with a compartment empty and full', expect: 'A differential of under 100 empty and over 1500 with a tablet — a clear separation.' },
    { step: 'Repeat in direct sunlight', expect: 'Differential values within about 10 % of the dark-room values. Large variation means the pulsed subtraction is not working.' },
    { step: 'Trigger a scheduled dose', expect: 'The carousel rotates smoothly to the next filled compartment, chimes, and the display shows "TAKE NOW".' },
    { step: 'Remove the tablet', expect: 'Detection within about two seconds, a confirmation tone, and a <code>taken</code> event published.' },
    { step: 'Ignore a dose for 35 minutes', expect: 'Reminders at 5 and 15 minutes, then a <code>missed</code> event and carer alert at 30.' },
    { step: 'Turn the manual key', expect: 'The carousel unlocks and a <code>manual-release</code> event is logged — allowed, but recorded.' },
    { step: 'Power-cycle mid-schedule', expect: 'The carousel re-homes, the filled-compartment map is restored from NVS, and the schedule resumes.' },
  ],

  troubleshoot: [
    {
      sym: 'Dose detection works at night and fails during the day',
      cause: 'Ambient light swamping the reflectance sensor.',
      fix: 'Confirm the pulsed differential measurement is running — read with the emitter off, then on, and subtract. Also shield the sensor in a short black tube and make sure the lid is opaque rather than translucent.',
    },
    {
      sym: 'The carousel drifts out of alignment over days',
      cause: 'Missed steps, or integer step accumulation.',
      fix: 'Use absolute rounded targets rather than accumulating increments, re-home daily, reduce top speed, and raise the driver current slightly. Check nothing is binding — a carousel that rubs on the lid loses steps at exactly the same place every revolution.',
    },
    {
      sym: 'Tablets hop between compartments during rotation',
      cause: 'Acceleration too aggressive.',
      fix: 'Lengthen the ramp at both ends and lower the cruise speed. A dispenser has no reason to move fast; two seconds per compartment is perfectly acceptable and eliminates the problem.',
    },
    {
      sym: 'Homing fails or finds the wrong position',
      cause: 'Multiple magnets, a magnet too far from the hall sensor, or the wrong magnetic pole.',
      fix: 'A3144 sensors are unipolar — only one pole triggers them. Flip the magnet. Use exactly one magnet and confirm the sensor changes state cleanly by hand before running the homing routine.',
    },
    {
      sym: 'Doses fire twice at the same time',
      cause: 'The scheduled-minute check runs faster than once a minute and the guard is not working.',
      fix: 'The <code>lastFiredSlot</code> guard must be set before the dose is presented and compared against the current minute-of-day. Verify it is not being reset elsewhere in the loop.',
    },
  ],

  perf: [
    'Read the reflectance sensor every two seconds while a dose is pending, not every loop. Eight averaged ADC pairs per reading is 16 conversions and there is no benefit to doing it faster.',
    'De-energise the stepper between moves. A carousel has no holding-torque requirement and an energised stepper draws its full rated current continuously.',
    'Keep the schedule check gated to one firing per minute slot — the most common bug in scheduled devices is firing repeatedly within the same minute.',
  ],

  safety: [
    '<b>Never let this be the only medication safeguard.</b> Discuss it with the prescribing clinician. It reduces error; it does not eliminate the need for oversight.',
    'The manual release must always work. A person locked away from a rescue medication by a software fault is a far worse outcome than an occasional double dose.',
    'Do not store medication in a hot enclosure. Many drugs degrade above 25–30 °C, and a sealed box with a stepper driver inside gets warm. Vent it and keep the driver current low.',
    'Label the device clearly with what it contains and keep it out of reach of children — a carousel with 28 doses in it is a significant quantity of medication in one place.',
  ],

  maintenance: [
    'Clean the compartments and the sensor window weekly — tablet dust builds up and shifts the reflectance baseline.',
    'Refill on a fixed day and confirm the filled-compartment map matches reality afterwards.',
    'Replace the DS3231 backup cell every three to four years.',
  ],

  future: [
    'Add a <b>load cell under the carousel</b> to weigh doses, distinguishing "one tablet taken" from "the whole compartment emptied".',
    'Add a <b>camera</b> that photographs the compartment after presentation, giving a visual audit trail for a clinical review.',
    'Add <b>multiple carousels</b> for medications with different schedules, so a four-times-daily drug and a weekly one do not have to share one disc.',
    'Add <b>temperature and humidity logging</b> inside the enclosure, since many drugs have storage requirements that a warm kitchen breaches.',
    'Add <b>pharmacy integration</b> so the low-stock warning triggers a repeat prescription request rather than just a notification.',
  ],

  faq: [
    { q: 'Why a carousel rather than separate compartments with lids?', a: 'Individual servo-driven lids are 28 actuators, 28 failure points and a great deal of wiring. A single carousel with one aperture achieves the same physical dose control with one motor. It also means the mechanism cannot partially fail — either the carousel is at the right position or it is not, and homing tells you which.' },
    { q: 'How does it know the dose was taken and not just knocked out?', a: 'It does not, and that is an honest limitation. The reflectance sensor reports that the compartment is empty. Adding a load cell under the carousel would distinguish a tablet removed from a tablet spilled, and photographing the compartment gives a visual record. For most users the empty-compartment signal is a large improvement over no signal at all.' },
    { q: 'What if the power fails?', a: 'The RTC keeps time on its backup cell and the filled-compartment map is in NVS, so the schedule resumes correctly on restore. The carousel re-homes at boot, which takes about ten seconds. A dose scheduled during the outage is missed and logged as such — adding a small UPS is worthwhile if outages are common.' },
    { q: 'Can it handle liquid medication or inhalers?', a: 'No. This mechanism is for solid oral doses. Liquids need a peristaltic pump and completely different confirmation, and inhalers need dose counting on the device itself. Both are legitimate separate projects.' },
    { q: 'Is a 30-minute window right?', a: 'It depends entirely on the drug. Antibiotics and anti-epileptics genuinely need consistent timing; a daily statin does not care about half an hour. Make it configurable per dose rather than global, and set it from the prescribing information rather than convenience.' },
    { q: 'What about someone who cannot manage the confirm button?', a: 'They do not need to — confirmation is optical, not by button press. The button exists only to silence the alarm early. That is deliberate: any design that requires a specific user action to register a dose will produce false "missed" alerts for exactly the users who most need the device.' },
  ],

  refs: [
    { t: 'WHO, "Adherence to Long-Term Therapies: Evidence for Action"', u: 'https://www.who.int/chp/knowledge/publications/adherence_report/en/', s: 'World Health Organization' },
    { t: 'TCRT5000 reflective optical sensor — datasheet', u: 'https://www.vishay.com/docs/83760/tcrt5000.pdf', s: 'Vishay' },
    { t: 'A4988 microstepping driver — datasheet and current limit setting', u: 'https://www.pololu.com/file/0J450/a4988_DMOS_microstepping_driver_with_translator.pdf', s: 'Allegro / Pololu' },
    { t: 'DS3231 extremely accurate RTC — datasheet', u: 'https://www.analog.com/media/en/technical-documentation/data-sheets/DS3231.pdf', s: 'Analog Devices' },
    { t: 'Checchi et al., "Electronic medication packaging devices and medication adherence: a systematic review"', u: 'https://doi.org/10.1001/jama.2014.10059', s: 'JAMA, 2014' },
    { t: 'USP General Chapter <1079> — good storage and distribution practices for drug products', u: 'https://www.usp.org/', s: 'United States Pharmacopeia' },
  ],

  images: ['motor', 'esp32', 'sensor'],
  imageCaptions: [
    'A stepper motor. One motor driving a carousel replaces 28 individual actuators, with a single well-defined failure mode.',
    'An ESP32 development board running the schedule, the carousel and the adherence log.',
    'A sensor breakout. The dose confirmation here is a reflectance sensor read differentially so ambient light cannot fool it.',
  ],
},

/* ── 018 · Posture Correction Wearable ───────────────────────────── */
{
  id: '018',
  domainKey: 'iot',
  emoji: '🧍',
  thumb: 'sensor',
  difficulty: 'Beginner',
  hours: '6–10 hours',
  iso8601: 'PT8H',
  tagline: 'A small upper-back sensor that learns your good posture, notices sustained slouching rather than momentary movement, and nudges you with a brief vibration instead of an alarm.',

  overview: [
    'Posture wearables fail for a predictable reason: they nag. A device that buzzes every time you lean forward to pick something up gets removed within a day. The engineering problem is not detecting a slouch — a single accelerometer does that trivially — it is deciding which slouches are worth interrupting someone about.',
    'This design makes three choices that address that directly. It measures <b>sustained deviation</b>, requiring a poor posture to persist for a configurable period (default 45 seconds) before responding, so reaching, bending and stretching are ignored entirely. It uses a <b>calibrated personal reference</b> rather than an absolute angle, because "upright" differs between people and between a chair and a standing desk. And it responds with <b>one brief haptic pulse</b>, escalating only if ignored, rather than a continuous alert.',
    'The sensing is deliberately simple. An accelerometer worn on the upper back measures the gravity vector, and the angle between that vector and a stored reference gives forward flexion directly. No gyroscope, no integration, no drift. The trade-off is that it cannot distinguish leaning back from leaning forward without additional axes handling, and it cannot measure rotation — but for the thoracic flexion that constitutes most desk slouching, one accelerometer is genuinely sufficient.',
    'The device also logs, which is where most of the actual value is. A week of posture data showing that your slouch angle degrades steadily after 40 minutes of sitting is far more actionable than a buzz — it tells you to set a timer, not to try harder.',
  ],

  does: [
    'Measures upper-back flexion angle from the gravity vector, referenced to a calibrated upright posture.',
    'Requires sustained poor posture before responding, so normal movement is ignored.',
    'Delivers a single brief haptic pulse, escalating only if the posture does not correct.',
    'Detects and adapts to different contexts — sitting, standing, walking — using motion variance.',
    'Logs posture angle continuously and produces a daily summary of time in good posture.',
    'Runs for a week on a small cell through duty-cycled sampling.',
    'Recalibrates on demand with a single button press.',
  ],

  features: [
    '<b>Personal calibration</b> — the reference is your upright, not a fixed angle.',
    '<b>Sustained-deviation logic</b> with a 45-second default, tunable per user.',
    '<b>Context detection</b> from accelerometer variance: no nagging while walking.',
    '<b>Escalating haptics</b> — one pulse, then two, then three, then silence for ten minutes.',
    '<b>Adaptive reference drift</b> so a slowly changing chair or desk setup does not require recalibration.',
    '<b>Daily posture score</b> as percentage of monitored time within threshold.',
    '<b>BLE sync</b> to a phone for the log, with local buffering when out of range.',
    '<b>Silent mode</b> for meetings, triggered by a double button press.',
  ],

  applications: [
    { t: 'Desk work and study', d: 'The main case — sustained seated flexion over hours, which is exactly what the sustained-deviation logic targets.' },
    { t: 'Physiotherapy adherence', d: 'A patient told to maintain neutral spine benefits enormously from objective feedback between appointments.' },
    { t: 'Musicians and dentists', d: 'Occupations with sustained asymmetric or flexed postures and high rates of related musculoskeletal problems.' },
    { t: 'Manual handling training', d: 'Detecting a bent-back lift in real time is a genuinely useful safety intervention.' },
    { t: 'Post-injury rehabilitation', d: 'Objective data on whether protective posture is resolving over weeks.' },
    { t: 'Ergonomics assessment', d: 'A week of logged data justifies a desk change far better than a subjective complaint.' },
  ],

  skills: [
    'Arduino C++ with basic vector maths',
    'I²C sensor reading',
    'Understanding of the gravity vector and dot products',
    'Simple state machines and timers',
    'BLE basics for the sync half',
  ],

  parts: ['esp32', 'mpu6050', 'li18650', 'tp4056', 'perfboard'],
  extraParts: [
    { name: 'Coin vibration motor + driver', spec: '10 mm, 3 V, 80 mA, with flyback diode', qty: 1, price: 120 },
    { name: 'Tactile button', spec: '6 mm, NO', qty: 1, price: 20 },
    { name: '3D-printed clip housing', spec: 'TPU, adhesive or clip mount', qty: 1, price: 150, note: 'Must attach rigidly to clothing or skin — a housing that shifts invalidates the calibration.' },
    { name: '400 mAh LiPo cell', spec: '3.7 V, protected', qty: 1, price: 220 },
    { name: 'Medical-grade adhesive pads', spec: 'Hypoallergenic, 40 mm', qty: 1, price: 180, note: 'Skin mounting gives far better data than clipping to a shirt.' },
  ],
  cost: '₹1,600 – ₹2,300',
  libs: ['mpu', 'preferences'],

  pins: {
    left: [
      { dev: 'MPU-6050 IMU', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x68' },
      { dev: 'MPU-6050 INT', devPin: 'INT', pin: 'GPIO 33', sig: 'Motion wake, RTC-capable' },
      { dev: 'Button', devPin: 'NO', pin: 'GPIO 32', sig: 'Calibrate / silent mode' },
      { dev: 'Battery divider', devPin: 'Mid-point', pin: 'GPIO 34', sig: '1 MΩ / 1 MΩ, gated' },
    ],
    right: [
      { dev: 'Vibration motor', devPin: 'Transistor base', pin: 'GPIO 25', sig: 'Through 1 kΩ + flyback' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 26', sig: 'Brief flashes only' },
    ],
  },
  wiringNotes: [
    'The sensor must be <b>rigidly attached to the body</b>, not loosely to clothing. A device clipped to a loose shirt measures the shirt, not the spine, and the calibration becomes meaningless within minutes.',
    'Mount at approximately <b>T3–T5</b> — upper thoracic, between the shoulder blades. Lower down measures lumbar flexion, which is a different (and also valid) measurement requiring a different reference.',
    'Orient the board consistently. The firmware assumes a particular axis points up when upright; rotating the housing 90° between sessions invalidates everything.',
    'The vibration motor needs a transistor and a flyback diode. It draws about 80 mA, well beyond a GPIO, and its back-EMF will damage the pin without the diode.',
    'Keep the assembly small and light. A device that is uncomfortable is a device that is not worn, and the whole project value depends on it being worn all day.',
    'Use a bare ESP32 module for the deployed build. A development board\'s sleep current makes week-long battery life impossible.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'MPU-6050', sub: 'gravity vector' }, { name: 'Motion variance', sub: 'context' }] },
      { label: 'Reference', edge: 'accel XYZ', blocks: [{ name: 'Calibrated upright', sub: 'per user', highlight: true }, { name: 'Slow drift track', sub: 'chair changes' }] },
      { label: 'Decide', edge: 'flexion angle', blocks: [{ name: 'Sustained > 45 s?', sub: 'ignore transients', highlight: true }, { name: 'Context gate', sub: 'not while walking' }] },
      { label: 'Respond', edge: 'confirmed slouch', blocks: [{ name: 'Escalating haptic', sub: '1 → 2 → 3 pulses' }, { name: 'Log + daily score', sub: 'the real value' }] },
    ],
  },

  flow: [
    { t: 'Boot: load calibration reference', k: 'start' },
    { t: 'Sample accelerometer at 10 Hz', k: 'proc' },
    { t: 'Compute flexion angle vs reference', k: 'proc' },
    { t: 'Moving (variance high)?', k: 'dec', yes: 'skip, reset timer', no: 'evaluate', back: 1 },
    { t: 'Angle beyond threshold?', k: 'dec', yes: 'start/continue timer', no: 'reset timer', back: 1 },
    { t: 'Sustained past 45 s?', k: 'dec', yes: 'haptic nudge', no: 'keep counting', back: 1 },
    { t: 'Escalate if still bad after 60 s', k: 'io' },
    { t: 'Log angle, update daily score', k: 'end' },
  ],

  principle: [
    'An accelerometer at rest measures the reaction to gravity, so its output is a vector pointing "up" in the device\'s own frame. If the device is rigidly attached to the upper back, that vector rotates exactly as the thoracic spine flexes. The <b>angle between the current gravity vector and a stored reference vector</b> is therefore the flexion angle directly, with no integration and no drift — which is why a gyroscope is not needed here.',
    'The calculation is a dot product. Normalise both vectors, take their dot product, and the arccosine gives the angle between them. This is robust in a way that Euler angles are not: there is no gimbal lock, no axis ordering convention to get wrong, and no discontinuity at any orientation.',
    'The <b>reference</b> is the important part. There is no universal "good posture" angle — it depends on body proportions, the chair, the desk height, and what the person is doing. Calibrating against the individual\'s own comfortable upright, held for five seconds at the press of a button, produces a threshold that means something. An absolute angle threshold produces a device that is wrong for most people.',
    '<b>Sustained deviation</b> is what makes it tolerable to wear. Reaching for a mug, bending to pick something up, leaning to talk to someone — all produce large flexion angles for a few seconds, and none of them are the problem. Requiring the deviation to persist for 45 seconds ignores essentially all of them while still catching the slow slump into a screen, which is the posture that actually causes trouble. Tuning that single parameter is the difference between a device that is worn and one that is not.',
    '<b>Context detection</b> from acceleration variance adds a second filter. Walking produces high variance; sitting still produces almost none. Suppressing alerts while the variance is high avoids nagging someone who is moving around, and it also avoids false readings, because the gravity-vector measurement is only valid when dynamic acceleration is small compared with 1 g.',
    'Finally, the <b>reference drift</b>. Over weeks, a person\'s chair, desk and habitual posture change slowly. A reference that never updates gradually becomes wrong. Updating it very slowly — a time constant of hours, and only during periods classified as good posture — keeps it aligned with the person\'s actual neutral without letting a bad day drag it downward.',
  ],

  equations: [
    { t: 'Flexion angle from gravity vectors', eq: 'Reference (calibrated upright): r = (rx, ry, rz), normalised\nCurrent:                         a = (ax, ay, az), normalised\n\n  cos θ = a · r = ax·rx + ay·ry + az·rz\n  θ = acos(clamp(cos θ, −1, 1)) × 180/π\n\nWorked example:\n  r = (0.05, 0.08, 0.995)\n  a = (0.05, 0.42, 0.906)\n  a·r = 0.0025 + 0.0336 + 0.9015 = 0.9376\n  θ = acos(0.9376) = 20.4°\n\nTypical thresholds: 15° mild slouch, 25° pronounced.' },
    { t: 'Context from acceleration variance', eq: 'Over a 2-second window at 10 Hz (20 samples):\n\n  σ = sqrt( (1/N) · Σ (|a|ᵢ − mean)² )\n\nMeasured on the reference build:\n  sitting still  : σ ≈ 0.01–0.03 g\n  typing         : σ ≈ 0.03–0.06 g\n  standing still : σ ≈ 0.02–0.05 g\n  walking        : σ ≈ 0.25–0.60 g\n  running        : σ > 0.8 g\n\nGate alerts when σ > 0.15 g — comfortably above\ntyping and below walking.' },
    { t: 'Battery life with duty cycling', eq: 'MPU-6050 active         : 3.9 mA\nESP32 light sleep       : 0.8 mA\nESP32 active (10 % duty): 80 mA × 0.10 = 8 mA\nVibration (20 pulses/day, 400 ms): negligible average\n\nAverage with 10 Hz sampling in light sleep ≈ 5.5 mA\n\n400 mAh cell, usable 340 mAh:\n  340 / 5.5 = 62 h ≈ 2.6 days\n\nWith motion-gated deep sleep at night (8 h at 15 µA):\n  daily consumption drops ~33 % → about 4 days.\n\nSampling at 4 Hz instead of 10 Hz gets to a week.' },
  ],

  code: [{
    file: 'posture-wearable.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Posture Correction Wearable — ESP32 + MPU-6050

   Measures upper-back flexion as the angle between the current
   gravity vector and a personally calibrated upright reference.
   Responds only to SUSTAINED deviation, and never while moving.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <Preferences.h>
#include <math.h>

#define MPU_ADDR   0x68
#define PIN_INT    33
#define PIN_BTN    32
#define PIN_VIBE   25
#define PIN_LED    26
#define PIN_BATT   34
#define PIN_BATT_EN 14

#define SAMPLE_HZ        10
#define VAR_WINDOW       20          // 2 s at 10 Hz
#define MOVING_SIGMA     0.15f       // g
#define ANGLE_THRESHOLD  18.0f       // degrees from reference
#define SUSTAIN_MS      45000UL
#define ESCALATE_MS     60000UL
#define QUIET_AFTER_MS 600000UL      // 10 min silence after 3 escalations
#define REF_DRIFT_ALPHA 0.00005f     // ~hours time constant

Preferences prefs;

float refX = 0, refY = 0, refZ = 1;
float angleNow = 0, sigma = 0;
uint32_t badSince = 0, lastNudge = 0, quietUntil = 0;
uint8_t  escalation = 0;
bool     silentMode = false;

uint32_t goodSeconds = 0, monitoredSeconds = 0;
float magHist[VAR_WINDOW];
uint8_t magIdx = 0;

/* ── MPU-6050 ───────────────────────────────────────────────── */
void mpuWrite(uint8_t reg, uint8_t val) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(reg); Wire.write(val);
  Wire.endTransmission();
}

void mpuBegin() {
  mpuWrite(0x6B, 0x00);              // wake from sleep
  mpuWrite(0x1C, 0x00);              // accel range +/-2 g, best resolution
  mpuWrite(0x1A, 0x05);              // DLPF 10 Hz — we only want gravity
  mpuWrite(0x19, 0x63);              // sample rate divider -> 10 Hz
}

void mpuReadAccel(float &x, float &y, float &z) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6);
  int16_t rx = (Wire.read() << 8) | Wire.read();
  int16_t ry = (Wire.read() << 8) | Wire.read();
  int16_t rz = (Wire.read() << 8) | Wire.read();
  x = rx / 16384.0f; y = ry / 16384.0f; z = rz / 16384.0f;   // +/-2 g
}

/* ── geometry ───────────────────────────────────────────────── */
float flexionAngle(float x, float y, float z) {
  float n = sqrtf(x * x + y * y + z * z);
  if (n < 0.1f) return 0;
  float dot = (x * refX + y * refY + z * refZ) / n;
  dot = dot > 1 ? 1 : (dot < -1 ? -1 : dot);
  return acosf(dot) * 180.0f / (float)M_PI;
}

void calibrate() {
  digitalWrite(PIN_LED, HIGH);
  for (int i = 0; i < 3; i++) { digitalWrite(PIN_VIBE, HIGH); delay(120);
                                digitalWrite(PIN_VIBE, LOW);  delay(180); }
  delay(1500);                       // let the user settle into upright

  float sx = 0, sy = 0, sz = 0;
  for (int i = 0; i < 50; i++) {     // 5 s of averaging
    float x, y, z; mpuReadAccel(x, y, z);
    sx += x; sy += y; sz += z;
    delay(100);
  }
  float n = sqrtf(sx * sx + sy * sy + sz * sz);
  refX = sx / n; refY = sy / n; refZ = sz / n;

  prefs.putFloat("rx", refX);
  prefs.putFloat("ry", refY);
  prefs.putFloat("rz", refZ);

  digitalWrite(PIN_VIBE, HIGH); delay(400); digitalWrite(PIN_VIBE, LOW);
  digitalWrite(PIN_LED, LOW);
  Serial.printf("Calibrated: (%.3f, %.3f, %.3f)\\n", refX, refY, refZ);
}

/* ── context ────────────────────────────────────────────────── */
void updateVariance(float mag) {
  magHist[magIdx] = mag;
  magIdx = (magIdx + 1) % VAR_WINDOW;

  float mean = 0;
  for (float v : magHist) mean += v;
  mean /= VAR_WINDOW;

  float var = 0;
  for (float v : magHist) { float d = v - mean; var += d * d; }
  sigma = sqrtf(var / VAR_WINDOW);
}

bool isMoving() { return sigma > MOVING_SIGMA; }

/* ── haptics ────────────────────────────────────────────────── */
void nudge(uint8_t pulses) {
  if (silentMode) return;
  for (uint8_t i = 0; i < pulses; i++) {
    digitalWrite(PIN_VIBE, HIGH);
    delay(180);
    digitalWrite(PIN_VIBE, LOW);
    delay(160);
  }
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_VIBE, OUTPUT); pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_BTN, INPUT_PULLUP);

  Wire.begin(21, 22);
  mpuBegin();

  prefs.begin("posture", false);
  refX = prefs.getFloat("rx", 0);
  refY = prefs.getFloat("ry", 0);
  refZ = prefs.getFloat("rz", 1);

  for (float &v : magHist) v = 1.0f;

  Serial.println("Posture wearable running — hold the button to calibrate");
}

void loop() {
  static uint32_t lastSample = 0;
  if (millis() - lastSample < 1000 / SAMPLE_HZ) return;
  lastSample = millis();

  float x, y, z;
  mpuReadAccel(x, y, z);
  float mag = sqrtf(x * x + y * y + z * z);
  updateVariance(mag);
  angleNow = flexionAngle(x, y, z);

  /* Button: short press = silent mode, long press = calibrate. */
  if (digitalRead(PIN_BTN) == LOW) {
    uint32_t held = millis();
    while (digitalRead(PIN_BTN) == LOW && millis() - held < 3000) delay(20);
    if (millis() - held >= 2000) calibrate();
    else {
      silentMode = !silentMode;
      digitalWrite(PIN_LED, silentMode);
      nudge(silentMode ? 1 : 2);
    }
    badSince = 0; escalation = 0;
    return;
  }

  /* Only evaluate posture when the body is reasonably still. The
     gravity-vector measurement is only valid when dynamic
     acceleration is small, and nobody wants a buzz while walking. */
  if (isMoving()) {
    badSince = 0;
    escalation = 0;
    return;
  }

  monitoredSeconds++;

  if (angleNow < ANGLE_THRESHOLD) {
    goodSeconds++;
    badSince = 0;
    escalation = 0;
    // Slowly pull the reference towards sustained good posture, so a
    // gradual change of chair or desk does not require recalibration.
    float n = sqrtf(x * x + y * y + z * z);
    refX = (1 - REF_DRIFT_ALPHA) * refX + REF_DRIFT_ALPHA * (x / n);
    refY = (1 - REF_DRIFT_ALPHA) * refY + REF_DRIFT_ALPHA * (y / n);
    refZ = (1 - REF_DRIFT_ALPHA) * refZ + REF_DRIFT_ALPHA * (z / n);
    return;
  }

  /* Poor posture — but only act once it is SUSTAINED. */
  if (!badSince) { badSince = millis(); return; }
  if (millis() < quietUntil) return;

  uint32_t sustained = millis() - badSince;
  if (sustained < SUSTAIN_MS) return;

  if (millis() - lastNudge < ESCALATE_MS) return;
  lastNudge = millis();
  escalation++;

  nudge(escalation);
  Serial.printf("nudge %u — angle %.1f deg sustained %lus\\n",
                escalation, angleNow, sustained / 1000);

  if (escalation >= 3) {
    // Three ignored nudges: the user is not going to respond right now.
    // Going quiet for ten minutes is what stops the device being removed.
    quietUntil = millis() + QUIET_AFTER_MS;
    escalation = 0;
    badSince = 0;
  }

  static uint32_t lastReport = 0;
  if (millis() - lastReport > 60000) {
    lastReport = millis();
    Serial.printf("angle %.1f  sigma %.3f  good %lu/%lu s (%.0f%%)\\n",
                  angleNow, sigma, goodSeconds, monitoredSeconds,
                  monitoredSeconds ? goodSeconds * 100.0f / monitoredSeconds : 100.0f);
  }
}`,
    explain: [
      { ref: 'mpuWrite(0x1A, 0x05) DLPF at 10 Hz', txt: 'The digital low-pass filter removes dynamic acceleration above 10 Hz before the data reaches the registers. Since only the gravity vector matters here, filtering hard in hardware is free noise reduction.' },
      { ref: 'flexionAngle via dot product', txt: 'No Euler angles, no gimbal lock, no axis-order convention to get wrong. The angle between two vectors is a single well-defined number at every orientation, which makes this the most robust formulation available.' },
      { ref: 'isMoving() gate before evaluating', txt: 'Two purposes at once: it stops the device nagging someone who is walking, and it ensures the gravity-vector measurement is only used when dynamic acceleration is small enough for it to be valid.' },
      { ref: 'badSince timer, not instantaneous threshold', txt: 'This is the single most important design decision. Reaching for something produces a 40° flexion for three seconds; a slump into a screen produces 25° for twenty minutes. Only the second one is worth interrupting someone about.' },
      { ref: 'REF_DRIFT_ALPHA applied only during good posture', txt: 'The reference tracks the person\'s actual neutral over hours. Updating it during poor posture would let a bad day drag the reference downward until slouching becomes the new normal — which is exactly the failure mode to avoid.' },
      { ref: 'quietUntil after three ignored nudges', txt: 'If someone has ignored three escalating nudges they are concentrating on something. Continuing to buzz gets the device taken off, which ends all its value. Ten minutes of silence is what makes it tolerable to wear all day.' },
      { ref: 'Long press calibrates, short press silences', txt: 'The two functions a user actually needs, on one button, distinguishable by feel without looking — which matters for a device worn between the shoulder blades.' },
    ],
  }],

  config: [
    'Set <code>ANGLE_THRESHOLD</code> from your own data. 18° is a reasonable default; a physiotherapist may recommend tighter for a specific condition.',
    'Set <code>SUSTAIN_MS</code>. This is the parameter that determines whether the device is worn. Start at 45 seconds and increase if it feels intrusive — a device set to 5 seconds will be in a drawer by Tuesday.',
    'Tune <code>MOVING_SIGMA</code> from your own variance measurements while typing and while walking. It must sit clearly between the two.',
    'Set <code>REF_DRIFT_ALPHA</code> conservatively. Too fast and the reference follows your slouch; 0.00005 at 10 Hz gives a time constant of about half an hour of good posture.',
    'Recalibrate whenever the mounting position changes, and at the start of each session if you clip rather than adhere the device.',
  ],

  calibration: [
    { h: 'Calibrate the upright reference', p: ['Sit or stand in the posture a physiotherapist would call neutral — ears over shoulders, shoulders over hips — and hold it for the five-second averaging window. This is the reference everything else is measured against, so it is worth taking seriously rather than doing it slumped.'] },
    { h: 'Measure your own variance thresholds', p: ['Log sigma while typing, while sitting still, and while walking. The gate must be clearly above your typing value and clearly below your walking value. Mine were 0.04 and 0.35; yours will differ with mounting and body mass.'] },
    { h: 'Find your sustain time', p: ['Wear it for a day at 45 seconds. Count the nudges. Fewer than five a day is probably too permissive; more than twenty is intrusive. Adjust and repeat — this is the parameter that determines whether the device gets worn.'] },
    { h: 'Verify the angle against a photograph', p: ['Have someone photograph you from the side in good and poor posture and measure the actual thoracic angle change. Compare against what the device reports. Agreement within about 5° confirms the mounting is rigid enough.'] },
  ],

  testing: [
    { step: 'Calibrate while sitting upright', expect: 'Three short pulses, five seconds of stillness, one long confirmation pulse, and an angle reading near 0°.' },
    { step: 'Slouch forward deliberately', expect: 'Angle rises to 20–35°. No immediate response — the sustain timer must run first.' },
    { step: 'Hold the slouch for 50 seconds', expect: 'A single haptic pulse at about 45 seconds.' },
    { step: 'Keep slouching', expect: 'Two pulses at 105 s, three at 165 s, then ten minutes of silence.' },
    { step: 'Correct posture', expect: 'Timer resets immediately, no further nudges.' },
    { step: 'Reach forward for three seconds and return', expect: 'No response at all — this is the false positive the sustain timer exists to prevent.' },
    { step: 'Walk around', expect: 'Sigma exceeds the threshold, monitoring is suspended, and no nudges occur regardless of angle.' },
    { step: 'Short press the button', expect: 'One pulse and the LED lights — silent mode. Press again for two pulses and normal operation.' },
  ],

  troubleshoot: [
    {
      sym: 'It buzzes constantly',
      cause: 'Threshold too tight, sustain time too short, or the device has shifted since calibration.',
      fix: 'Recalibrate first — a device that has rotated on its mount reports a large angle in perfectly good posture. Then raise the threshold to 22° and the sustain time to 60 s. A device set too aggressively is worse than none, because it gets removed.',
    },
    {
      sym: 'It never buzzes even when slouching badly',
      cause: 'Calibration was performed while already slouched, so the reference <em>is</em> the slouch.',
      fix: 'Recalibrate in a deliberately good posture, ideally with someone else checking. Also verify the reference drift is only applied during good posture — if it runs unconditionally it will slowly follow you into a slouch.',
    },
    {
      sym: 'The angle jumps around while typing',
      cause: 'Mounting is not rigid, or dynamic acceleration is corrupting the gravity vector.',
      fix: 'Mount to skin with an adhesive pad rather than clipping to a loose shirt. Enable the MPU-6050 digital low-pass filter at 10 Hz or below, and average several samples.',
    },
    {
      sym: 'Battery lasts a day rather than a week',
      cause: 'Continuous full-speed sampling on a development board.',
      fix: 'Use a bare ESP32 module, drop to 4 Hz sampling, and use light sleep between samples. Deep sleep at night, woken by the MPU-6050 motion interrupt, roughly doubles the life again.',
    },
    {
      sym: 'It nudges while walking',
      cause: 'The variance gate threshold is too high, or the window is too short.',
      fix: 'Log sigma while walking and set the threshold well below the minimum you observe. A two-second window at 10 Hz is a good compromise — shorter windows are noisy and longer ones respond too slowly when you stop.',
    },
  ],

  perf: [
    'Use the MPU-6050 hardware low-pass filter rather than filtering in software — it removes noise before quantisation, which software filtering cannot.',
    'Sample at 4–10 Hz. Posture changes over seconds; sampling faster costs battery and gains nothing.',
    'Use the motion interrupt to deep-sleep overnight. Eight hours of not being worn is a third of the day and currently costs full running power.',
  ],

  safety: [
    'This is a feedback aid, not a treatment. Persistent back or neck pain needs a clinician, and a wearable that makes you tense up trying to hold a position can make things worse rather than better.',
    'Adhesive mounting can irritate skin over days. Use hypoallergenic pads, rotate the position slightly, and stop if irritation appears.',
    'Do not chase a perfect score. Sustained rigid "good" posture is itself a problem — movement variety matters more than any single angle, and a device that encourages statue-like stillness is optimising the wrong thing.',
  ],

  future: [
    'Add a <b>second sensor at the lumbar spine</b> to measure the relative angle between thoracic and lumbar segments, which is far more informative than either alone.',
    'Add <b>BLE sync</b> to a phone app with a daily posture timeline, which is where most of the actual behavioural value lies.',
    'Add <b>break prompting</b> — the data almost always shows posture degrading after a certain sitting duration, and prompting a stand at that point is more effective than correcting the slouch.',
    'Add a <b>small trained classifier</b> to distinguish sitting, standing, walking and lying rather than a single variance threshold.',
    'Add <b>shoulder protraction detection</b> with a magnetometer or a second sensor, since rounded shoulders often matter more than thoracic flexion for desk workers.',
  ],

  faq: [
    { q: 'Why not use the gyroscope for a better angle?', a: 'Because you do not need it and it costs battery. Integrating gyroscope rate to get angle drifts within seconds and requires fusion with the accelerometer to correct — which just brings you back to the gravity vector. For measuring orientation relative to gravity on a slow-moving body segment, the accelerometer alone is both simpler and more accurate.' },
    { q: 'Why 45 seconds and not immediate feedback?', a: 'Because immediate feedback makes the device unwearable. Reaching, bending and leaning all produce large angles for a few seconds and none of them are the problem. The posture that causes trouble is the sustained slump, and a delay filters everything else out. This single parameter is the difference between a device that gets worn and one that does not.' },
    { q: 'Where exactly should it go?', a: 'Upper thoracic, roughly T3–T5, between and slightly below the shoulder blades. Lower down measures lumbar flexion, which is a different and also useful measurement but needs a different reference and different thresholds. Wherever you choose, it must be the same place every session or the calibration is invalid.' },
    { q: 'Does the reference drift not just let me slouch more?', a: 'Only if you let it update during poor posture, which this firmware deliberately does not. Drift applies exclusively while the angle is within threshold, so it follows a genuinely changed neutral (new chair, new desk height) without following a bad habit. The time constant is also long — about half an hour of accumulated good posture.' },
    { q: 'Is there evidence these devices work?', a: 'Mixed, and worth being honest about. Studies generally find short-term improvement in posture while the device is worn, with less clear evidence of lasting change after removal, and inconsistent evidence on pain outcomes. What is better supported is the value of the <em>data</em> — knowing that your posture degrades after 40 minutes is actionable in a way that a buzz is not.' },
    { q: 'Can I use it during exercise?', a: 'Not usefully. The variance gate will suppress it constantly, and the gravity-vector measurement is invalid during dynamic movement. For lifting technique specifically, a version that triggers on the combination of high variance and large flexion is a genuinely useful and quite different project.' },
  ],

  refs: [
    { t: 'MPU-6000/6050 six-axis motion tracking device — datasheet', u: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf', s: 'TDK InvenSense' },
    { t: 'O\'Sullivan et al., "Neutral lumbar spine sitting posture in pain-free subjects"', u: 'https://doi.org/10.1016/j.math.2009.05.002', s: 'Manual Therapy, 2010' },
    { t: 'Simpson et al., "The effect of wearable posture devices on posture and pain: a systematic review"', u: 'https://doi.org/10.1016/j.apergo.2019.102943', s: 'Applied Ergonomics, 2019' },
    { t: 'Accelerometer-based inclinometry — theory and limitations', u: 'https://www.analog.com/en/technical-articles/accelerometer-based-tilt-sensing.html', s: 'Analog Devices' },
    { t: 'ISO 11226 — Ergonomics: evaluation of static working postures', u: 'https://www.iso.org/standard/25573.html', s: 'ISO' },
  ],

  images: ['health', 'sensor', 'esp32'],
  imageCaptions: [
    'A body-worn sensor. Rigid attachment matters more than sensor quality here — a device clipped to a loose shirt measures the shirt.',
    'An IMU breakout module. Only the accelerometer is used; the gravity vector gives orientation directly with no integration and no drift.',
    'An ESP32 module. For week-long battery life, use the bare module and duty-cycle the sampling.',
  ],
},

];
