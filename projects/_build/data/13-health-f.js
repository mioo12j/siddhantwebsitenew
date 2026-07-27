/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 021–022
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 021 · Hydration Reminder Bottle ─────────────────────────────── */
{
  id: '021',
  domainKey: 'iot',
  emoji: '🚰',
  thumb: 'sensor',
  difficulty: 'Beginner',
  hours: '6–9 hours',
  iso8601: 'PT8H',
  tagline: 'A bottle cap that weighs what you actually drank rather than counting how many times you picked it up, adjusts the daily target for temperature and activity, and reminds you only when you are genuinely behind.',

  overview: [
    'Most smart bottles count sips using an accelerometer and a tilt threshold. That approach fails immediately in normal use: it counts picking the bottle up to move it, misses a long drink as one event, and has no idea whether you swallowed 20 ml or 300 ml. The result is a number that looks like data and is not.',
    'Weighing is the honest approach. A load cell in the base measures the bottle\'s mass continuously; a drop in mass between two stable readings is water that left the bottle. That distinguishes a 40 ml sip from a 300 ml gulp, ignores every pick-up that does not result in drinking, and — with a small amount of logic — distinguishes drinking from refilling, because refilling makes the mass go up.',
    'The second design decision is the <b>target</b>. A fixed "two litres a day" is a persistent myth with weak evidential support; actual requirement varies with body mass, ambient temperature, activity and diet. The controller computes a target from body mass with adjustments for measured temperature and for activity inferred from a paired phone or a simple step input, which produces a number that at least responds to the things that genuinely change requirement.',
    'Finally, the reminder policy. A bottle that buzzes hourly regardless is ignored within a week. This one compares your actual intake against a <b>time-of-day-weighted expected curve</b> and reminds only when you fall meaningfully behind — which in practice means a couple of prompts on a normal day and several on a hot one.',
  ],

  does: [
    'Measures bottle mass continuously with a load cell in the base and converts changes to millilitres.',
    'Distinguishes drinking from refilling, from setting the bottle down, and from being carried.',
    'Computes a personalised daily target adjusted for body mass and ambient temperature.',
    'Compares intake against a time-weighted expected curve and reminds only when genuinely behind.',
    'Displays progress on a small OLED in the cap and logs every drink event.',
    'Syncs to a phone over BLE with local buffering.',
    'Runs for two to three weeks on a small cell through motion-triggered wake.',
  ],

  features: [
    '<b>Mass-based measurement</b> — actual millilitres, not sip counts.',
    '<b>Refill detection</b> from an increase in mass, which resets the reference without counting as intake.',
    '<b>Stability gating</b>: mass is only read when the bottle has been still for two seconds.',
    '<b>Temperature-adjusted target</b> using an on-board sensor, because requirement rises sharply in heat.',
    '<b>Time-weighted expected curve</b> rather than a flat hourly target.',
    '<b>Motion-triggered wake</b> so the device sleeps at microamps when the bottle is untouched.',
    '<b>Drink-event log</b> with volume and timestamp, which is where the useful pattern lives.',
    '<b>Water-resistant cap assembly</b> with the electronics fully potted.',
  ],

  applications: [
    { t: 'Personal hydration tracking', d: 'The everyday case, where honest volume data is far more useful than a sip count.' },
    { t: 'Kidney stone prevention', d: 'Patients are often told to hit a specific daily fluid volume; measuring it is the only way to comply.' },
    { t: 'Elderly care', d: 'Dehydration is a common and serious problem in older adults and is frequently missed until it causes a fall or confusion.' },
    { t: 'Athletic training', d: 'Combined with body mass before and after exercise, this gives a real sweat-rate measurement.' },
    { t: 'Hot-climate outdoor work', d: 'A temperature-adjusted target and behind-schedule alerts have genuine safety value in heat.' },
    { t: 'Post-operative recovery', d: 'Fluid intake targets after surgery are common and adherence is usually unmeasured.' },
  ],

  skills: [
    'Arduino C++ with state machines',
    'Load cell calibration and the HX711 interface',
    'Basic filtering and stability detection',
    'BLE basics',
    'Waterproofing and mechanical assembly',
  ],

  parts: ['esp32', 'loadcell', 'sht31', 'adxl345', 'oled', 'li18650', 'tp4056', 'perfboard'],
  extraParts: [
    { name: '1 kg load cell (bar type)', spec: '1 kg, 1.0 mV/V, 55 × 12 × 6 mm', qty: 1, price: 260, note: 'A 1 kg cell suits a 750 ml bottle. A 5 kg cell wastes most of its range and resolution.' },
    { name: 'Silicone-sealed base housing', spec: 'IP54, machined or printed, with a rigid mounting plate', qty: 1, price: 350, note: 'The load cell must be rigidly fixed at one end and load the other — see the wiring notes.' },
    { name: '600 mAh LiPo cell + charging port', spec: '3.7 V protected, magnetic charge connector', qty: 1, price: 320, note: 'A magnetic connector avoids a USB port that fills with water.' },
    { name: 'Conformal coating / potting compound', spec: 'Silicone, electronics grade', qty: 1, price: 200 },
  ],
  cost: '₹2,900 – ₹3,800',
  libs: ['hx711', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'HX711 load cell amplifier', devPin: 'DT / SCK', pin: 'GPIO 16 / 4', sig: 'Bit-banged 24-bit ADC' },
      { dev: 'ADXL345 motion', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x53, wake source' },
      { dev: 'ADXL345 INT1', devPin: 'INT1', pin: 'GPIO 33', sig: 'Activity interrupt, RTC-capable' },
      { dev: 'SHT31 temperature', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x44' },
    ],
    right: [
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x3C' },
      { dev: 'Vibration motor', devPin: 'Transistor base', pin: 'GPIO 25', sig: 'Reminder haptic' },
      { dev: 'Button', devPin: 'NO', pin: 'GPIO 32', sig: 'Tare / display wake' },
    ],
  },
  wiringNotes: [
    'The load cell must be <b>rigidly fixed at one end and loaded at the other, with a gap so it can flex</b>. Bolting both ends to the same rigid plate means it never bends and reads a constant value — this is the single most common load cell mounting error.',
    'Use a <b>1 kg cell, not a 5 kg one</b>. A full 750 ml bottle plus its own mass is around 1 kg; a 5 kg cell would use a fifth of its range and give a fifth of the resolution.',
    'Keep the HX711 leads short and away from any switching. It amplifies microvolts, and even the OLED\'s charge pump can inject visible noise if the routing is careless.',
    'Pot the entire electronics assembly in silicone. This device lives on a desk with an open water bottle on top of it and will get wet.',
    'Use a magnetic charging connector rather than a USB port. A USB socket in the base of a water bottle fills with water and corrodes within weeks.',
    'Mount the temperature sensor on the outside of the housing, away from the electronics. It should measure the room, not the enclosure.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'Load cell + HX711', sub: 'bottle mass' }, { name: 'ADXL345', sub: 'stability + wake' }, { name: 'SHT31', sub: 'ambient temp' }] },
      { label: 'Interpret', edge: 'mass samples', blocks: [{ name: 'Stability gate', sub: 'still for 2 s', highlight: true }, { name: 'Drink vs refill', sub: 'sign of change' }] },
      { label: 'Target', edge: 'volume events', blocks: [{ name: 'Personal target', sub: 'mass + temp', highlight: true }, { name: 'Expected curve', sub: 'time-weighted' }] },
      { label: 'Prompt', edge: 'deficit', blocks: [{ name: 'Haptic reminder', sub: 'only when behind' }, { name: 'BLE + OLED', sub: 'progress' }] },
    ],
  },

  flow: [
    { t: 'Deep sleep until motion wakes the device', k: 'start' },
    { t: 'Wait for the bottle to be still for 2 s', k: 'proc' },
    { t: 'Read stable mass', k: 'io' },
    { t: 'Mass decreased by more than 15 ml?', k: 'dec', yes: 'drink event', no: 'check for refill', back: 1 },
    { t: 'Mass increased? Refill — reset reference', k: 'proc' },
    { t: 'Log volume, update daily total', k: 'proc' },
    { t: 'Behind the expected curve by 250 ml?', k: 'dec', yes: 'haptic reminder', no: 'no prompt', back: 0 },
    { t: 'Update display, sleep', k: 'end' },
  ],

  principle: [
    'The measurement is straightforward: 1 ml of water has a mass of very nearly 1 g at room temperature, so a mass change in grams is a volume change in millilitres to within about 0.4 % over the normal temperature range. A 1 kg load cell with an HX711 resolves to a few tenths of a gram in practice, which is far better than needed for a measurement whose useful granularity is about 10 ml.',
    'The engineering is in <b>knowing when the reading is meaningful</b>. A load cell in a bottle base reads garbage while the bottle is being carried, tilted, or set down — dynamic acceleration adds directly to the measured force. The solution is a <b>stability gate</b>: only accept a mass reading when the accelerometer has reported near-1 g total with low variance for two continuous seconds. Everything else is discarded.',
    '<b>Drinking versus refilling</b> then falls out of the sign of the change between two stable readings. A decrease is water that left the bottle. An increase is a refill, which resets the reference without counting as intake. A change smaller than about 15 ml is noise or evaporation and is ignored. This is much more robust than it sounds, because the intervening carried-around period is simply not measured at all.',
    'The <b>daily target</b> is where most hydration devices are weakest. The commonly repeated "eight glasses" or "two litres" figures have surprisingly weak evidential basis and take no account of body mass, climate or activity. A more defensible starting point is roughly 30–35 ml per kilogram of body mass per day, adjusted upward for ambient temperature above about 25 °C and for exercise. Even this is approximate — thirst is a reasonably good regulator in healthy adults — but it at least responds to the variables that genuinely matter.',
    'The <b>expected curve</b> is what makes reminders tolerable. Intake should not be flat across the day: people wake dehydrated, drink most between mid-morning and early evening, and should taper before bed. Comparing actual intake against a cumulative curve weighted to that shape means the device prompts when you are genuinely behind, not merely because an hour has passed. On a normal day that is two or three prompts; on a hot day it is more, which is exactly the behaviour you want.',
  ],

  equations: [
    { t: 'Daily target from body mass and temperature', eq: 'Base:   V_base = mass_kg × 33 ml\n\nTemperature adjustment above 25 °C:\n  V_temp = V_base × (1 + 0.03 × (T_mean − 25))   for T > 25\n\nActivity adjustment:\n  V_total = V_temp + 500 ml per hour of vigorous exercise\n\nWorked example — 70 kg, mean 32 °C, 1 h exercise:\n  V_base  = 70 × 33 = 2310 ml\n  V_temp  = 2310 × (1 + 0.03 × 7) = 2795 ml\n  V_total = 2795 + 500 = 3295 ml\n\nSame person at 20 °C with no exercise: 2310 ml.\nThe difference — 43 % — is why a fixed target is poor.' },
    { t: 'Time-weighted expected curve', eq: 'Waking hours 07:00–23:00 (16 h). Weight intake toward\nthe middle of the day and taper before sleep.\n\n  w(h) = sin(π × (h − 7) / 16)^0.7      for 7 ≤ h ≤ 23\n\nCumulative expected fraction:\n  E(h) = Σ w over [7, h]  /  Σ w over [7, 23]\n\n  09:00 → 12 %\n  12:00 → 34 %\n  15:00 → 58 %\n  18:00 → 79 %\n  21:00 → 95 %\n\nPrompt when  actual < E(h) × target − 250 ml.' },
    { t: 'Load cell resolution', eq: '1 kg cell, 1.0 mV/V, excited at 5 V:\n  full scale output = 5 mV\n  per gram = 5 µV\n\nHX711 gain 128, ±20 mV input range, 24-bit:\n  LSB = 40 mV / 2^24 = 2.38 nV\n  counts per gram = 5 µV / 2.38 nV ≈ 2100\n\nNoise-limited usable resolution ≈ ±0.3 g\n\nMinimum detectable drink: set at 15 ml, which is\n50× the noise floor — comfortably robust.' },
  ],

  code: [{
    file: 'hydration-bottle.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Hydration Reminder Bottle — ESP32 + 1 kg load cell + ADXL345

   Measures actual volume drunk by weighing the bottle, and only
   reads mass when the accelerometer confirms the bottle has been
   still for two seconds. Reminds against a time-weighted expected
   curve rather than on a fixed timer.
   ══════════════════════════════════════════════════════════════════ */

#include <HX711.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_ADXL345_U.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>
#include <math.h>

#define PIN_HX_DT   16
#define PIN_HX_SCK   4
#define PIN_VIBE    25
#define PIN_BTN     32

#define BODY_MASS_KG      70.0f
#define ML_PER_KG         33.0f
#define MIN_DRINK_ML      15.0f
#define STABLE_MS       2000
#define STABLE_SIGMA_G     0.06f
#define REMIND_DEFICIT_ML 250.0f
#define REMIND_COOLDOWN_MS (25UL * 60UL * 1000UL)
#define WAKE_HOUR  7
#define SLEEP_HOUR 23

HX711            scale;
Adafruit_SHT31   sht = Adafruit_SHT31();
Adafruit_ADXL345_Unified accel(3);
Adafruit_SSD1306 oled(128, 32, &Wire, -1);
Preferences      prefs;

float   calFactor = 2100.0f;          // counts per gram
float   lastStableG = -1;
float   ambientC = 24;
float   tempSum = 0; uint16_t tempN = 0;
uint16_t drunkToday = 0;
uint32_t lastRemind = 0, stableSince = 0;
int     lastDay = -1;

/* ── stability from the accelerometer ───────────────────────── */
bool bottleStill() {
  static float hist[20]; static uint8_t h = 0;
  sensors_event_t e; accel.getEvent(&e);
  float mag = sqrtf(e.acceleration.x * e.acceleration.x +
                    e.acceleration.y * e.acceleration.y +
                    e.acceleration.z * e.acceleration.z) / 9.81f;
  hist[h] = mag; h = (h + 1) % 20;

  float mean = 0; for (float v : hist) mean += v; mean /= 20;
  float var = 0;  for (float v : hist) { float d = v - mean; var += d * d; }
  float sigma = sqrtf(var / 20);

  // Upright and still: magnitude near 1 g and low variance.
  bool still = sigma < STABLE_SIGMA_G && fabsf(mean - 1.0f) < 0.08f;
  if (!still) { stableSince = 0; return false; }
  if (!stableSince) { stableSince = millis(); return false; }
  return millis() - stableSince >= STABLE_MS;
}

/* ── mass ───────────────────────────────────────────────────── */
float readMassG() {
  if (!scale.is_ready()) return -1;
  long raw = scale.read_average(12);
  return (raw - scale.get_offset()) / calFactor;
}

/* ── targets ────────────────────────────────────────────────── */
float dailyTargetMl() {
  float meanT = tempN ? tempSum / tempN : ambientC;
  float base = BODY_MASS_KG * ML_PER_KG;
  if (meanT > 25.0f) base *= (1.0f + 0.03f * (meanT - 25.0f));
  return base;
}

// Cumulative fraction of the day's intake that should be done by hour h.
float expectedFraction(float h) {
  if (h <= WAKE_HOUR) return 0;
  if (h >= SLEEP_HOUR) return 1;
  const float span = SLEEP_HOUR - WAKE_HOUR;
  // Integrate w(t) = sin(pi*(t-7)/16)^0.7 numerically; 32 slices is plenty.
  auto w = [&](float t) { return powf(sinf((float)M_PI * (t - WAKE_HOUR) / span), 0.7f); };
  float total = 0, upTo = 0;
  for (int i = 0; i < 32; i++) {
    float t = WAKE_HOUR + span * (i + 0.5f) / 32.0f;
    float v = w(t);
    total += v;
    if (t <= h) upTo += v;
  }
  return total > 0 ? upTo / total : 0;
}

/* ── feedback ───────────────────────────────────────────────── */
void remind() {
  for (int i = 0; i < 2; i++) {
    digitalWrite(PIN_VIBE, HIGH); delay(220);
    digitalWrite(PIN_VIBE, LOW);  delay(200);
  }
}

void draw(float h) {
  float target = dailyTargetMl();
  float expected = expectedFraction(h) * target;

  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(2); oled.setCursor(0, 0);
  oled.printf("%u ml", drunkToday);
  oled.setTextSize(1);
  oled.setCursor(78, 6); oled.printf("/%0.0f", target);

  // Progress bar with a tick marking where you should be by now.
  int w = (int)(126.0f * fminf(1.0f, drunkToday / target));
  oled.drawRect(0, 22, 128, 9, SSD1306_WHITE);
  oled.fillRect(1, 23, w, 7, SSD1306_WHITE);
  int mark = (int)(126.0f * fminf(1.0f, expected / target));
  oled.drawFastVLine(mark, 20, 13, SSD1306_WHITE);
  oled.display();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_VIBE, OUTPUT);
  pinMode(PIN_BTN, INPUT_PULLUP);

  scale.begin(PIN_HX_DT, PIN_HX_SCK);
  Wire.begin(21, 22);
  sht.begin(0x44);
  accel.begin(0x53);
  accel.setRange(ADXL345_RANGE_2_G);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("hydro", false);
  calFactor  = prefs.getFloat("cal", 2100.0f);
  drunkToday = prefs.getUShort("today", 0);
  lastDay    = prefs.getInt("day", -1);

  delay(1200);
  scale.tare(20);                     // tare with an EMPTY base
  Serial.println("Hydration bottle ready");
}

void loop() {
  /* Long press tares, short press wakes the display. */
  if (digitalRead(PIN_BTN) == LOW) {
    uint32_t t0 = millis();
    while (digitalRead(PIN_BTN) == LOW && millis() - t0 < 3000) delay(20);
    if (millis() - t0 >= 2000) { scale.tare(20); lastStableG = -1; remind(); }
  }

  static uint32_t lastSlow = 0;
  if (millis() - lastSlow < 500) return;
  lastSlow = millis();

  float t = sht.readTemperature();
  if (!isnan(t)) { ambientC = t; tempSum += t; tempN++; }

  time_t now = time(nullptr);
  struct tm tmv; localtime_r(&now, &tmv);
  float h = tmv.tm_hour + tmv.tm_min / 60.0f;

  if (tmv.tm_yday != lastDay) {       // midnight rollover
    lastDay = tmv.tm_yday;
    drunkToday = 0;
    tempSum = 0; tempN = 0;
    prefs.putUShort("today", 0);
    prefs.putInt("day", lastDay);
  }

  if (!bottleStill()) return;         // readings while carried are meaningless

  float g = readMassG();
  if (g < 0) return;

  if (lastStableG < 0) { lastStableG = g; draw(h); return; }

  float delta = lastStableG - g;      // positive = water left the bottle

  if (delta > MIN_DRINK_ML) {
    drunkToday += (uint16_t)delta;
    prefs.putUShort("today", drunkToday);
    Serial.printf("drank %.0f ml, total %u ml\\n", delta, drunkToday);
    lastStableG = g;
  } else if (delta < -MIN_DRINK_ML) {
    // Mass went up: a refill. Reset the reference, count nothing.
    Serial.printf("refill +%.0f ml\\n", -delta);
    lastStableG = g;
  }

  /* Remind only when genuinely behind the expected curve. */
  float target = dailyTargetMl();
  float expected = expectedFraction(h) * target;
  if (h >= WAKE_HOUR && h < SLEEP_HOUR
      && expected - drunkToday > REMIND_DEFICIT_ML
      && millis() - lastRemind > REMIND_COOLDOWN_MS) {
    lastRemind = millis();
    remind();
    Serial.printf("reminder: %u of %.0f ml expected by now\\n", drunkToday, expected);
  }

  draw(h);
}`,
    explain: [
      { ref: 'bottleStill() before any mass read', txt: 'Dynamic acceleration adds directly to the measured force, so a load cell reading while the bottle is being carried is meaningless. Requiring two seconds of low-variance, near-1 g stillness is what makes the measurement trustworthy.' },
      { ref: 'delta = lastStableG − g', txt: 'Positive means mass left the bottle — you drank it. Negative means mass arrived — a refill. Two lines of logic replace the entire sip-counting apparatus that other designs need, and they are correct rather than approximate.' },
      { ref: 'Refill resets the reference without counting', txt: 'Without this, refilling a bottle would register as a large negative drink or, worse, the subsequent drinking would be measured from the wrong baseline all day.' },
      { ref: 'expectedFraction integrating sin^0.7', txt: 'The exponent shapes the curve so intake is weighted toward the middle of the day and tapers before sleep, which matches how people actually drink and avoids prompting at 22:30.' },
      { ref: 'REMIND_COOLDOWN_MS 25 minutes', txt: 'Even when behind, prompting more than roughly every 25 minutes is nagging. The cooldown is what keeps the device on the desk rather than in a drawer.' },
      { ref: 'scale.tare with an EMPTY base', txt: 'The tare must be taken with nothing on the load cell, so the measured mass includes the bottle itself. That is deliberate — the bottle mass is constant and cancels out of every delta.' },
      { ref: 'read_average(12)', txt: 'The HX711 runs at 10 samples per second, so twelve averaged samples takes about 1.2 seconds. That is acceptable here because the stability gate has already established the bottle is not moving.' },
    ],
  }],

  config: [
    'Set <code>BODY_MASS_KG</code> for the user. The 33 ml/kg figure is a starting point; a clinician may specify a different target for a medical reason, in which case use theirs.',
    'Calibrate <code>calFactor</code> with a known mass — 500 g of water in a measuring jug works well.',
    'Set <code>MIN_DRINK_ML</code> at least 30 times your measured noise floor. 15 ml is comfortable for a 1 kg cell.',
    'Adjust <code>WAKE_HOUR</code> and <code>SLEEP_HOUR</code> to the user\'s actual day, or the expected curve will prompt at the wrong times.',
    'Tune <code>REMIND_DEFICIT_ML</code> and the cooldown together. Too sensitive and it nags; too permissive and it never prompts.',
  ],

  calibration: [
    { h: 'Calibrate the load cell', p: ['Tare with the base empty. Place a known mass — 500 ml of water weighed on a kitchen scale is ideal — and set <code>calFactor = raw_counts / grams</code>. Verify with a second, different mass; the two factors should agree within about 1 %.'] },
    { h: 'Measure the noise floor', p: ['Leave a full bottle sitting still and log the mass for ten minutes. The peak-to-peak spread is your noise floor. Set the minimum drink threshold at least 30 times that value.'] },
    { h: 'Tune the stability gate', p: ['Log the accelerometer sigma while the bottle sits on a desk, while someone types nearby, and while it is carried. The threshold must sit clearly above the desk value and below the carried value.'] },
    { h: 'Validate against a measuring jug', p: ['Pour exactly 200 ml out of the bottle and check the logged event. Agreement within 5 ml confirms both the calibration and the stability gating.'] },
  ],

  testing: [
    { step: 'Place an empty bottle on the base and tare', expect: 'Reading near 0 g, stable to within about 0.5 g.' },
    { step: 'Add 500 ml of water', expect: 'Reading of 500 ± 5 g once the stability gate opens.' },
    { step: 'Drink about 200 ml and set the bottle down', expect: 'A drink event of roughly 200 ml logged two seconds after it becomes still.' },
    { step: 'Pick the bottle up and put it back without drinking', expect: 'No event logged — the mass is unchanged and the readings while carried are discarded.' },
    { step: 'Refill the bottle', expect: 'A refill logged, the reference reset, and no intake counted.' },
    { step: 'Check the progress bar mid-afternoon', expect: 'The tick mark sits at the expected fraction for that hour, not at a flat proportion of the day.' },
    { step: 'Fall 300 ml behind the curve', expect: 'One haptic reminder, then silence for 25 minutes regardless of how far behind you remain.' },
    { step: 'Raise the ambient temperature to 33 °C', expect: 'The daily target rises by roughly 25 %, and the expected curve rises with it.' },
  ],

  troubleshoot: [
    {
      sym: 'Mass readings drift steadily upward or downward',
      cause: 'Temperature affecting the load cell, or mechanical creep in the mounting.',
      fix: 'Some drift is inherent in aluminium cells. Because this design measures <em>deltas</em> between consecutive stable readings, slow drift is largely cancelled — but if it exceeds a few grams an hour, check that nothing is pressing on the cell and that the mounting screws are not slowly loosening.',
    },
    {
      sym: 'Drinks are missed entirely',
      cause: 'The stability gate never opens, so no reading is ever taken.',
      fix: 'Log the accelerometer sigma on a desk. If it never drops below the threshold, the desk is vibrating (a nearby fan or a hollow table) or the threshold is too tight. Loosen it and lengthen the required stable period instead.',
    },
    {
      sym: 'Spurious large drink events',
      cause: 'A reading taken during a transient, or something briefly resting on the bottle.',
      fix: 'Increase the stable-period requirement to three seconds and average more HX711 samples. Also reject implausible deltas — nobody drinks 600 ml in one go from a 750 ml bottle, so a cap on single-event volume is a cheap sanity check.',
    },
    {
      sym: 'The load cell reads a constant value',
      cause: 'Both ends bolted to the same rigid surface, so it cannot flex.',
      fix: 'One end fixed, the other loaded, with a gap beneath. This is the most common load cell mounting error and it produces a perfectly stable, entirely useless reading.',
    },
    {
      sym: 'Water damage after a few weeks',
      cause: 'Unpotted electronics under an open water bottle.',
      fix: 'Pot everything in silicone, use a magnetic charge connector rather than a USB socket, and seal the load cell cable entry. This device will get wet — design for it rather than hoping.',
    },
  ],

  perf: [
    'Use motion-triggered wake. The bottle is untouched for most of the day, and sleeping at microamps between interactions turns days of battery into weeks.',
    'Average twelve HX711 samples per reading and only when the stability gate is open — the gate has already guaranteed the bottle is not moving, so the 1.2 seconds costs nothing.',
    'Wake the display only on interaction. An always-on OLED is most of the power budget in a device that is looked at for a few seconds at a time.',
  ],

  safety: [
    'Do not treat the target as a medical instruction. Fluid requirement varies and some conditions — heart failure and certain kidney conditions in particular — require fluid <em>restriction</em>. Follow a clinician\'s target over any formula.',
    'Over-hydration is real. Drinking far beyond thirst can cause hyponatraemia, which is dangerous. A device that encourages hitting a number regardless of thirst is not doing the user a favour.',
    'Keep the lithium cell sealed and away from water, and use a protected cell.',
  ],

  future: [
    'Add <b>temperature measurement of the water itself</b> so the bottle can tell you the drink is too hot, and so the volume conversion is exact.',
    'Add <b>activity integration</b> from a phone or a fitness tracker so exercise adjusts the target automatically rather than by manual entry.',
    'Add a <b>UV-C sterilisation LED</b> in the cap on a schedule — a genuinely useful addition for a bottle that is refilled repeatedly.',
    'Add <b>caffeine and alcohol logging</b> with their diuretic adjustment, which meaningfully changes net hydration.',
    'Move the load cell <b>into the cap</b> with a suspended inner vessel, so the bottle works anywhere rather than only on its base.',
  ],

  faq: [
    { q: 'Why weigh rather than count sips?', a: 'Because a sip count is not a volume. An accelerometer with a tilt threshold cannot tell a 20 ml sip from a 300 ml gulp, counts every pick-up that does not result in drinking, and merges a long drink into one event. Weighing gives actual millilitres, which is the number you wanted in the first place.' },
    { q: 'Is two litres a day actually the right target?', a: 'Not as a universal figure. The commonly repeated "eight glasses" advice has surprisingly weak evidential basis, and actual requirement scales with body mass, ambient temperature, activity and diet — food contributes roughly 20 % of intake for most people. The 33 ml/kg starting point with temperature adjustment is more defensible, but for a healthy adult thirst remains a reasonably good regulator.' },
    { q: 'Does it work if I take the bottle out with me?', a: 'It measures what happens on the base. Drinking away from the base is invisible, and when you return the mass difference is attributed as one drink event at that moment — so the daily total is right but the timing is not. Moving the load cell into the cap with a suspended inner vessel solves this properly and is the obvious next version.' },
    { q: 'How accurate is it?', a: 'Within about 5 ml per event after calibration, which is far better than the 10 ml granularity that matters. The larger error source is behavioural, not electrical — drinks taken away from the base are timestamped wrongly.' },
    { q: 'Why does it not remind me every hour?', a: 'Because a device that prompts on a timer regardless of whether you need it gets ignored, and then it is worthless. Comparing against an expected curve means it prompts when you are genuinely behind — a couple of times on a normal day, more on a hot one. That is the difference between a useful device and a nagging one.' },
    { q: 'Can I use it for coffee or juice?', a: 'The mass measurement works for any liquid — density varies by a few percent at most. What changes is the hydration accounting: caffeine is a mild diuretic and alcohol a substantial one, so the net contribution differs. Logging drink type and applying an adjustment factor is a worthwhile addition.' },
  ],

  refs: [
    { t: 'HX711 24-bit ADC for weigh scales — datasheet', u: 'https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf', s: 'Avia Semiconductor' },
    { t: 'EFSA Panel, "Scientific Opinion on Dietary Reference Values for water"', u: 'https://doi.org/10.2903/j.efsa.2010.1459', s: 'EFSA Journal, 2010' },
    { t: 'Valtin, "Drink at least eight glasses of water a day. Really?"', u: 'https://doi.org/10.1152/ajpregu.00365.2002', s: 'American Journal of Physiology, 2002' },
    { t: 'Institute of Medicine — Dietary Reference Intakes for Water, Potassium, Sodium', u: 'https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-electrolytes-and-water', s: 'National Academies' },
    { t: 'Load cell mounting and Wheatstone bridge fundamentals', u: 'https://www.hbm.com/en/6768/load-cells-and-force-transducers/', s: 'HBM' },
    { t: 'Hew-Butler et al., "Statement of the Third International Exercise-Associated Hyponatremia Consensus"', u: 'https://doi.org/10.1097/JSM.0000000000000221', s: 'Clinical Journal of Sport Medicine, 2015' },
  ],

  images: ['sensor', 'esp32', 'health'],
  imageCaptions: [
    'A sensor breakout module. A 1 kg load cell with an HX711 resolves fractions of a gram — far more than a hydration measurement needs.',
    'An ESP32 development board running the weighing, classification and reminder logic.',
    'A wearable tracker. Hydration data becomes considerably more useful when combined with activity data from a device like this.',
  ],
},

];
