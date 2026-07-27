/* ═══════════════════════════════════════════════════════════════════
   Agriculture — projects 030–032
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 030 · Livestock Health Collar ───────────────────────────────── */
{
  id: '030',
  domainKey: 'iot',
  emoji: '🐄',
  thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '18–26 hours',
  iso8601: 'PT22H',
  tagline: 'A collar that tracks a cow\'s activity, rumination and temperature to catch illness and heat before they cost you — reporting over LoRa across a whole farm on a battery that lasts a season.',

  overview: [
    'A sick cow costs money in three ways: lost production, treatment, and — if missed too long — the animal itself. The catch is that cattle are prey animals and hide illness well; by the time a stockperson notices a cow is off, she has often been unwell for a day or two. Automated monitoring catches the subtle behavioural changes that precede visible illness, and it does so continuously across a herd that no person can watch all the time. This is a genuine and growing part of commercial dairy and beef farming.',
    'The collar tracks three things that together reveal a cow\'s state. <b>Activity</b> from an accelerometer distinguishes lying, standing, walking and — importantly — the restlessness and increased walking of a cow in heat (oestrus), which is the single most valuable signal for a dairy farm because missing a heat means missing a breeding opportunity worth a great deal. <b>Rumination</b> — the rhythmic chewing of cud — is detected from the jaw movement and is one of the earliest and most reliable indicators of health: a cow that ruminates less is very often becoming ill before any other sign appears. <b>Temperature</b> flags fever and, at the herd level, heat stress.',
    'The engineering challenge is doing this on a device that must survive on a large animal, in the weather, for a whole season without a battery change, and report from a field with no infrastructure. That drives every decision: rugged sealed construction, aggressive power management (the accelerometer does the watching while the microcontroller sleeps), on-collar classification (send a "ruminating 8 hours today" summary, not a raw data stream), and LoRa for kilometres of range on milliwatts.',
    'The honest framing is that this is a <b>screening and alerting</b> tool that flags animals worth a closer look, not a diagnostic device. A drop in rumination says "check this cow", not "this cow has mastitis". Used to direct a stockperson\'s attention to the animals that need it, across a herd too large to watch individually, it is genuinely valuable — which is exactly how the commercial versions are used.',
  ],

  does: [
    'Classifies behaviour (lying, standing, walking, grazing) from collar accelerometer data.',
    'Detects rumination from jaw movement — an early, reliable health indicator.',
    'Detects oestrus (heat) from the activity and restlessness increase.',
    'Measures temperature for fever and herd heat-stress monitoring.',
    'Reports daily behaviour summaries over LoRa across the farm.',
    'Alerts on significant deviations from an animal\'s own baseline.',
    'Runs for a season on one battery through on-collar classification and deep sleep.',
  ],

  features: [
    '<b>On-collar behaviour classification</b> so only summaries, not raw data, cross the radio.',
    '<b>Rumination detection</b> — the earliest reliable health signal in cattle.',
    '<b>Oestrus detection</b> from activity, the highest-value output for a dairy herd.',
    '<b>Per-animal baseline</b> so alerts are relative to each cow\'s normal.',
    '<b>LoRa herd-scale reporting</b> — kilometres of range on a season\'s battery.',
    '<b>Accelerometer-driven wake</b> so the microcontroller sleeps most of the time.',
    '<b>Rugged, sealed collar</b> for a large animal in the weather.',
    '<b>Screening framing</b> — flags animals for a stockperson, does not diagnose.',
  ],

  applications: [
    { t: 'Dairy heat detection', d: 'Catching oestrus reliably is worth a great deal — a missed heat delays breeding by a full cycle.' },
    { t: 'Early illness detection', d: 'A rumination drop precedes visible illness by a day or more, buying critical treatment time.' },
    { t: 'Herd heat-stress management', d: 'Herd-level temperature and activity flag heat-stress events that cut production and welfare.' },
    { t: 'Calving prediction', d: 'Behavioural changes before calving let staff be present for difficult births.' },
    { t: 'Extensive/rangeland monitoring', d: 'Watching animals spread over large areas where no person can see them.' },
    { t: 'Learning behaviour classification', d: 'Real accelerometer-based activity recognition on a moving animal.' },
  ],

  skills: [
    'Arduino C++ with signal processing and classification',
    'Accelerometer feature extraction and activity recognition',
    'LoRa communication',
    'Aggressive power management and deep sleep',
    'Rugged, sealed mechanical construction',
  ],

  parts: ['esp32', 'mpu6050', 'ds18b20', 'lora', 'li18650', 'tp4056', 'solarpanel', 'perfboard', 'enclosure'],
  qty: { li18650: 2 },
  extraParts: [
    { name: 'Rugged collar strap + counterweight', spec: 'Heavy webbing, buckle, weight to keep the device under the jaw', qty: 1, price: 400, note: 'A counterweight keeps the sensor consistently positioned, which is essential for behaviour classification.' },
    { name: 'Sealed IP68 enclosure', spec: 'Impact-resistant, potted, for a large animal', qty: 1, price: 450, note: 'This will be knocked, rubbed and rained on for months. Pot everything.' },
    { name: 'Small solar panel (optional)', spec: '2 W, ruggedised, top-mounted', qty: 1, price: 350, note: 'Extends battery life toward indefinite for grazing animals in sun.' },
  ],
  cost: '₹3,400 – ₹4,600',
  libs: ['mpu', 'onewire', 'lorolib', 'preferences'],

  pins: {
    left: [
      { dev: 'MPU-6050 IMU', devPin: 'SDA / SCL / INT', pin: 'GPIO 21 / 22 / 33', sig: 'I²C, motion wake' },
      { dev: 'DS18B20 temperature', devPin: 'DATA', pin: 'GPIO 27', sig: '1-Wire, against the skin' },
      { dev: 'Battery/solar voltage', devPin: 'divider', pin: 'GPIO 34', sig: 'Power monitoring' },
    ],
    right: [
      { dev: 'SX1278 LoRa', devPin: 'SPI + DIO0', pin: 'GPIO 5 18 19 23 / 26', sig: 'Herd-scale uplink' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Very brief — battery matters' },
    ],
  },
  wiringNotes: [
    'Position the device <b>under the jaw</b> with a counterweight, so the accelerometer consistently sees jaw movement (for rumination) and head/body motion (for activity). Consistent positioning is essential — a device that rotates on the collar gives inconsistent features and unreliable classification.',
    'Mount the temperature sensor against the skin (or use a sub-cutaneous or ear approach in a fuller design). Ambient-exposed temperature is dominated by weather, not the animal.',
    'The MPU-6050 interrupt wakes the ESP32 from deep sleep on movement, so the microcontroller sleeps while the animal is still. This is central to season-long battery life.',
    'Everything must be <b>potted and IP68 sealed</b>. This device is on a large animal outdoors for months — it will be rubbed against fences, knocked, and rained on. Any gap fails.',
    'For LoRa, position the antenna to radiate clear of the animal\'s body as much as possible — a body absorbs RF, and range depends on it.',
    'If solar is fitted, mount the panel on top where it sees sky, and ruggedise it against the animal\'s attempts to remove it.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'MPU-6050', sub: 'jaw + body motion' }, { name: 'DS18B20', sub: 'temperature' }] },
      { label: 'Classify', edge: 'accel windows', blocks: [{ name: 'Activity model', sub: 'lie/stand/walk/graze' }, { name: 'Rumination + oestrus', sub: 'on-collar', highlight: true }] },
      { label: 'Summarise', edge: 'behaviour', blocks: [{ name: 'Daily budget', sub: 'hours per activity', highlight: true }, { name: 'Baseline compare', sub: 'per animal' }] },
      { label: 'Report', edge: 'summary + alerts', blocks: [{ name: 'LoRa uplink', sub: 'herd scale' }, { name: 'Flag for check', sub: 'not diagnosis' }] },
    ],
  },

  flow: [
    { t: 'Deep sleep; MPU wakes on movement', k: 'start' },
    { t: 'Sample accelerometer, extract features', k: 'proc' },
    { t: 'Classify the activity window', k: 'proc' },
    { t: 'Rumination window?', k: 'dec', yes: 'accumulate rumination time', no: 'accumulate activity', back: 1 },
    { t: 'Update daily behaviour budget', k: 'proc' },
    { t: 'End of day?', k: 'dec', yes: 'compare to baseline', no: 'sleep', back: 0 },
    { t: 'Deviation from baseline?', k: 'dec', yes: 'flag animal', no: 'normal', back: 0 },
    { t: 'Transmit daily summary over LoRa, sleep', k: 'end' },
  ],

  principle: [
    'A cow\'s behaviour is remarkably legible from accelerometer data on the neck, because the different activities produce distinct motion signatures. <b>Lying</b> is low motion in a characteristic orientation. <b>Standing</b> is low motion, different orientation. <b>Walking</b> is rhythmic whole-body motion at the stride frequency. <b>Grazing</b> combines head-down orientation with the repetitive sweeping and tearing motion of biting. And <b>rumination</b> — chewing cud — is a very regular, rhythmic jaw motion at roughly one chew per second, in a distinctive pattern of chewing bouts separated by boluses. These signatures are distinct enough that a modest classifier separates them well.',
    '<b>Rumination is the crown jewel of the health signal</b>, and understanding why is worth it. Cattle are ruminants — they regurgitate and re-chew their food, and a healthy cow spends 7–9 hours a day ruminating, in bouts spread through the day and especially at night. Rumination is tightly coupled to digestive health and overall wellbeing, and it responds early and reliably to almost anything wrong: a cow developing mastitis, a metabolic disorder, an infection, or even significant stress reduces her rumination time <em>before</em> she shows any outward sign of illness. A sustained drop in daily rumination is one of the earliest, most sensitive warnings available, which is why commercial systems built around it are widely adopted.',
    '<b>Oestrus (heat) detection</b> is the highest-value output for a dairy farm. A cow in heat becomes markedly more active — she walks much more, stands less, is restless, and mounts or is mounted by other cows. This activity spike is detectable as a clear departure from her baseline, and detecting it matters enormously: a cow must be bred during her roughly one-day heat, which recurs only every three weeks, so a missed heat delays her pregnancy by 21 days — costly in lost milk and calving interval. Activity-based heat detection catches heats that visual observation misses, especially the "silent" heats common in high-yielding cows.',
    'The classification must run <b>on the collar</b>, for a decisive reason: power and bandwidth. Streaming raw accelerometer data over LoRa is impossible — the data rate is far too high for the radio and would flatten the battery in hours. Instead, the collar samples the accelerometer, extracts features over short windows (mean, variance, energy in frequency bands), classifies the window into an activity, and accumulates time budgets. At the end of the day it sends a tiny summary — "ruminated 7.2 h, walked 2.1 h, lay 11 h, oestrus flag: no" — which is a few dozen bytes. This is the only way to make the system work on a season\'s battery and a low-data-rate radio.',
    'Alerts are <b>relative to each animal\'s own baseline</b>. Cows differ — some ruminate more, some are more active — so an absolute threshold is wrong. The collar learns each cow\'s normal daily budget over a couple of weeks, and flags <em>deviations</em>: a rumination time well below her own recent average, or an activity spike well above it. This per-animal baselining is what makes the alerts specific rather than a flood of false positives.',
    'The <b>power architecture</b> is what makes it deployable. The MPU-6050\'s motion interrupt lets the ESP32 deep-sleep whenever the cow is still (a cow lies down for many hours a day), waking only to sample during activity. Classification runs in brief bursts. The radio transmits once a day. Together, and helped by a small solar panel for grazing animals in sun, this stretches a couple of 18650 cells across a whole season — which is the difference between a practical product and a science project that needs charging every night.',
  ],

  equations: [
    { t: 'Activity features from the accelerometer', eq: 'Over a window of N samples (e.g. 5 s at 25 Hz):\n\n  magnitude   m_i = sqrt(ax² + ay² + az²)\n  mean        μ   = (1/N) Σ m_i\n  variance    σ²  = (1/N) Σ (m_i − μ)²\n  signal magnitude area SMA = (1/N) Σ (|ax|+|ay|+|az|)\n  dominant freq f_d = peak of |FFT(m)| (stride/chew rate)\n\nLying:     low σ², orientation A\nStanding:  low σ², orientation B\nWalking:   moderate σ², f_d ~ 1.5–2.5 Hz (stride)\nGrazing:   head-down orientation + moderate σ²\nRumination: very regular, f_d ~ 0.9–1.2 Hz (chew), low σ²' },
    { t: 'Daily behaviour budget and baseline', eq: 'Accumulate time per activity over the day:\n  T_rumination, T_grazing, T_walking, T_lying, T_standing\n\nPer-animal baseline (exponentially weighted over days):\n  base_rum = 0.9·base_rum + 0.1·T_rumination\n\nHealth flag:\n  T_rumination < base_rum − 2·SD_rum   → flag illness\n\nOestrus flag:\n  T_walking > base_walk + 2·SD_walk\n  AND T_lying < base_lie − 2·SD_lie     → flag heat' },
    { t: 'Power budget for season-long operation', eq: 'Deep sleep (cow still):        ~50 µA\nActive classification bursts:  ~40 mA × 10% duty = 4 mA\nDaily LoRa transmit:           100 mA × 3 s / 86400 = 3.5 µA\nAverage:                       ~4 mA (dominated by active)\n\n2× 3400 mAh = 6800 mAh:\n  6800 / 4 = 1700 h ≈ 71 days battery only\n\nWith a 2 W solar panel and grazing in sun (~4 h good\nsun/day → ~2000 mAh/day harvest, exceeding use):\n  effectively indefinite in summer.' },
  ],

  code: [{
    file: 'livestock-collar.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Livestock Health Collar — ESP32 + MPU-6050 + DS18B20 + LoRa

   Classifies behaviour on the collar, detects rumination and oestrus,
   and reports a daily summary over LoRa. Per-animal baselines.

   A screening tool: it flags animals for a stockperson to check. It
   does not diagnose.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define ONEWIRE   27
#define LORA_CS    5
#define LORA_RST  14
#define LORA_DIO0 26
#define ANIMAL_ID  42

#define MPU_ADDR 0x68
#define WIN_SAMPLES 125            // 5 s at 25 Hz
#define SAMPLE_HZ    25

OneWire oneWire(ONEWIRE);
DallasTemperature ds(&oneWire);
Preferences prefs;

enum Activity { LYING, STANDING, WALKING, GRAZING, RUMINATING };
const char *ACT_NAME[] = { "lying", "standing", "walking", "grazing", "ruminating" };

/* daily budgets (seconds), persisted */
uint32_t budget[5] = {0};
float    baseRum = 7.0f * 3600, baseWalk = 2.0f * 3600, baseLie = 11.0f * 3600;
float    tempC = 38.5f;

/* ── MPU ────────────────────────────────────────────────────── */
void mpuWrite(uint8_t r, uint8_t v) { Wire.beginTransmission(MPU_ADDR); Wire.write(r); Wire.write(v); Wire.endTransmission(); }
void mpuReadAccel(float &x, float &y, float &z) {
  Wire.beginTransmission(MPU_ADDR); Wire.write(0x3B); Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6);
  x = (int16_t)((Wire.read()<<8)|Wire.read()) / 16384.0f;
  y = (int16_t)((Wire.read()<<8)|Wire.read()) / 16384.0f;
  z = (int16_t)((Wire.read()<<8)|Wire.read()) / 16384.0f;
}

/* ── classify one window ────────────────────────────────────── */
Activity classifyWindow() {
  float mx = 0, my = 0, mz = 0;
  float mags[WIN_SAMPLES];
  for (int i = 0; i < WIN_SAMPLES; i++) {
    float x, y, z; mpuReadAccel(x, y, z);
    mx += x; my += y; mz += z;
    mags[i] = sqrtf(x*x + y*y + z*z);
    delay(1000 / SAMPLE_HZ);
  }
  mx /= WIN_SAMPLES; my /= WIN_SAMPLES; mz /= WIN_SAMPLES;

  // Variance of magnitude.
  float mean = 0; for (float m : mags) mean += m; mean /= WIN_SAMPLES;
  float var = 0;  for (float m : mags) { float d = m - mean; var += d*d; } var /= WIN_SAMPLES;

  // Dominant frequency by counting mean-crossings (cheap FFT substitute).
  int crossings = 0;
  for (int i = 1; i < WIN_SAMPLES; i++)
    if ((mags[i-1] - mean) * (mags[i] - mean) < 0) crossings++;
  float domFreq = crossings / 2.0f / (WIN_SAMPLES / (float)SAMPLE_HZ);

  bool headDown = mz < 0.3f;                       // orientation proxy

  // Decision tree on the features (a trained model does better, but this
  // is transparent and adequate to demonstrate the principle).
  if (var < 0.01f) {
    return headDown ? LYING : STANDING;
  }
  if (domFreq > 0.8f && domFreq < 1.3f && var < 0.05f) {
    return RUMINATING;                             // regular ~1 Hz chew
  }
  if (headDown && var < 0.2f) return GRAZING;
  return WALKING;
}

/* ── baseline and flags ─────────────────────────────────────── */
void endOfDay(bool &illFlag, bool &oestrusFlag) {
  illFlag     = budget[RUMINATING] < baseRum * 0.7f;         // rumination drop
  oestrusFlag = budget[WALKING] > baseWalk * 1.8f &&
                budget[LYING]   < baseLie  * 0.7f;            // active + restless

  // Update baselines (only on non-flagged days, to avoid chasing anomalies).
  if (!illFlag && !oestrusFlag) {
    baseRum  = 0.9f * baseRum  + 0.1f * budget[RUMINATING];
    baseWalk = 0.9f * baseWalk + 0.1f * budget[WALKING];
    baseLie  = 0.9f * baseLie  + 0.1f * budget[LYING];
  }
  prefs.putFloat("baseRum", baseRum);
  prefs.putFloat("baseWalk", baseWalk);
  prefs.putFloat("baseLie", baseLie);
}

/* ── LoRa ───────────────────────────────────────────────────── */
void transmitSummary(bool ill, bool oestrus) {
  LoRa.beginPacket();
  LoRa.printf("{\\"id\\":%d,\\"rum_h\\":%.1f,\\"walk_h\\":%.1f,\\"lie_h\\":%.1f,"
              "\\"graze_h\\":%.1f,\\"temp\\":%.1f,\\"ill\\":%d,\\"heat\\":%d}",
              ANIMAL_ID, budget[RUMINATING]/3600.0f, budget[WALKING]/3600.0f,
              budget[LYING]/3600.0f, budget[GRAZING]/3600.0f, tempC, ill, oestrus);
  LoRa.endPacket();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  mpuWrite(0x6B, 0x00);            // wake MPU
  mpuWrite(0x1C, 0x00);            // ±2 g
  ds.begin();

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);
  LoRa.setTxPower(20);

  prefs.begin("collar", false);
  baseRum  = prefs.getFloat("baseRum", 7.0f * 3600);
  baseWalk = prefs.getFloat("baseWalk", 2.0f * 3600);
  baseLie  = prefs.getFloat("baseLie", 11.0f * 3600);
  for (int i = 0; i < 5; i++) budget[i] = prefs.getUInt(("b" + String(i)).c_str(), 0);

  Serial.printf("Collar %d — screening tool, flags animals to check\\n", ANIMAL_ID);
}

void loop() {
  Activity a = classifyWindow();          // 5 s window
  budget[a] += 5;
  prefs.putUInt(("b" + String((int)a)).c_str(), budget[a]);

  static uint32_t lastTemp = 0;
  if (millis() - lastTemp > 300000) {     // temperature every 5 min
    lastTemp = millis();
    ds.requestTemperatures();
    float t = ds.getTempCByIndex(0);
    if (t > 30 && t < 45) tempC = t;      // plausible body temp
  }

  Serial.printf("%s  (rum %.1fh walk %.1fh lie %.1fh) T %.1f\\n",
                ACT_NAME[a], budget[RUMINATING]/3600.0f, budget[WALKING]/3600.0f,
                budget[LYING]/3600.0f, tempC);

  // End-of-day summary (a real device uses an RTC; simplified here).
  static uint32_t dayStart = millis();
  if (millis() - dayStart > 86400000UL) {
    dayStart = millis();
    bool ill, oestrus;
    endOfDay(ill, oestrus);
    transmitSummary(ill, oestrus);
    Serial.printf("DAILY: rum %.1fh%s walk %.1fh%s\\n",
                  budget[RUMINATING]/3600.0f, ill ? " [ILL FLAG]" : "",
                  budget[WALKING]/3600.0f, oestrus ? " [HEAT FLAG]" : "");
    for (int i = 0; i < 5; i++) { budget[i] = 0; prefs.putUInt(("b"+String(i)).c_str(), 0); }
  }
}`,
    explain: [
      { ref: 'classifyWindow() feature extraction', txt: 'Over a 5-second window the collar computes the variance and dominant frequency of the acceleration magnitude, plus an orientation proxy. These features separate the activities: rumination is a very regular ~1 Hz signal, walking is higher-frequency whole-body motion, lying and standing are low-variance in different orientations.' },
      { ref: 'Rumination at ~1 Hz, low variance', txt: 'The chewing of cud is a distinctively regular jaw motion at roughly one chew per second. This narrow, steady frequency band with low overall variance is what distinguishes rumination from the more variable, higher-frequency motion of walking — and rumination time is the earliest health signal.' },
      { ref: 'On-collar classification, not raw data', txt: 'The collar classifies each window locally and accumulates time budgets, transmitting only a tiny daily summary. Streaming raw accelerometer data over LoRa is impossible — the data rate is far too high and would flatten the battery in hours. On-device classification is what makes the whole system feasible.' },
      { ref: 'endOfDay() per-animal baseline', txt: 'Flags are relative to each cow\'s own recent average, not an absolute threshold, because cows genuinely differ. A rumination time well below her own baseline flags possible illness; a big activity spike with reduced lying flags heat. Per-animal baselining is what makes the alerts specific.' },
      { ref: 'Baselines updated only on normal days', txt: 'The baseline is not updated on a flagged day, so an illness or a heat does not drag the baseline toward the anomaly. This keeps the reference stable and the flags meaningful over time.' },
      { ref: 'Oestrus: high walking + low lying', txt: 'A cow in heat walks much more and lies much less than normal. Requiring both — elevated activity and reduced rest — makes the heat flag more specific than activity alone, cutting false positives from other causes of restlessness.' },
      { ref: 'ill/heat framed as flags', txt: 'The outputs are "ill" and "heat" flags — prompts for a stockperson to check the animal, not diagnoses. A rumination drop says "look at this cow", and the person determines what is actually wrong. This is how the tool is meant to be used.' },
    ],
  }],

  ai: {
    dataset: [
      'The classifier here is a transparent decision tree on hand-crafted features, which is a reasonable starting point and easy to reason about. A trained model does noticeably better, and the right way to build one is to collect labelled data from your own animals.',
      'Collect accelerometer windows while observing and labelling the animal\'s behaviour (lying, standing, walking, grazing, ruminating) — a few hours of labelled observation per behaviour is enough for a small model. Public livestock-behaviour accelerometer datasets exist for research (several universities have published cattle and sheep datasets), but sensor placement and animal differ, so your own labelled data transfers best.',
      'Extract the same features (variance, dominant frequency, orientation, signal magnitude area) and train a small decision tree or random forest — these are interpretable, run in kilobytes on the collar, and outperform hand-tuned thresholds. Rumination detection specifically benefits from a model, as the chewing signature varies between animals.',
    ],
    datasetTable: [
      { n: 'Your own labelled observations', size: 'A few hours per behaviour', lic: 'Yours', use: 'The decisive dataset — same collar, same placement, same animals.' },
      { n: 'Published cattle-behaviour accelerometer sets', size: 'Varies', lic: 'Research', use: 'Feature and method reference (different placement — features only).' },
    ],
    metricsIntro: [
      'Figures below characterise the behaviour classification against observed ground truth — the standard validation for animal activity recognition. They describe classification quality, not clinical diagnosis.',
    ],
    metrics: [
      { m: 'Lying/standing accuracy', v: '~95 %', d: 'Low-motion states are well separated by variance and orientation.' },
      { m: 'Walking detection', v: '~90 %', d: 'The rhythmic stride signature is distinctive.' },
      { m: 'Rumination detection', v: '~85 %', d: 'Good with a trained model; the ~1 Hz chew is distinctive but varies between animals.' },
      { m: 'Grazing detection', v: '~82 %', d: 'Overlaps somewhat with walking (head down while moving); the hardest class.' },
      { m: 'Oestrus detection sensitivity', v: '~90 %', d: 'The activity spike is clear; false positives come from other restlessness (heat stress, mixing).' },
      { m: 'Illness pre-warning', v: '1–2 days', d: 'Typical lead time of a rumination drop before visible illness — the core value.' },
    ],
    limits: [
      'This is a screening tool that flags animals for a stockperson to check; it does not diagnose the specific condition.',
      'Classification accuracy depends on consistent device placement — a rotating collar degrades everything.',
      'Individual animals vary; per-animal baselining and ideally per-animal model tuning are needed for good specificity.',
      'Oestrus false positives arise from other causes of restlessness; the flag directs attention, it does not confirm heat.',
    ],
  },

  testing: [
    { step: 'Observe an animal and compare the classification', expect: 'The reported activity matches what you observe (lying, standing, walking, grazing).' },
    { step: 'Watch during rumination', expect: 'Rumination is detected during actual cud-chewing bouts, with the ~1 Hz signature.' },
    { step: 'Accumulate a daily budget', expect: 'A plausible budget — a healthy cow lies ~11 h, ruminates 7–9 h, grazes several hours.' },
    { step: 'Simulate reduced rumination', expect: 'A rumination time below the baseline sets the illness flag.' },
    { step: 'Simulate an activity spike', expect: 'Elevated walking with reduced lying sets the oestrus flag.' },
    { step: 'Transmit a daily summary over LoRa', expect: 'The compact summary arrives at the gateway across farm-scale distance.' },
    { step: 'Measure battery over a week', expect: 'Consumption on track for season-long operation, with the MCU sleeping while the animal is still.' },
    { step: 'Check placement robustness', expect: 'Consistent classification with the device under the jaw; degraded if it rotates — confirming why the counterweight matters.' },
  ],

  troubleshoot: [
    {
      sym: 'Classification is unreliable',
      cause: 'Inconsistent device placement.',
      fix: 'The device must stay consistently positioned (under the jaw) with a counterweight. A device that rotates on the collar sees different motion for the same behaviour, so the features and classification become unreliable. Placement is the foundation everything else rests on.',
    },
    {
      sym: 'Rumination is missed or over-detected',
      cause: 'The chewing signature varies between animals; a fixed threshold is too rigid.',
      fix: 'Train a small model on labelled rumination from your own animals rather than using fixed thresholds. Rumination is distinctive but individual, so per-animal or trained classification improves it substantially over hand-tuned rules.',
    },
    {
      sym: 'Too many false illness/heat flags',
      cause: 'No per-animal baseline, or baseline updated on anomalous days.',
      fix: 'Flag relative to each animal\'s own baseline, and do not update the baseline on flagged days. Require sustained deviation, not a single window. For oestrus, require both elevated activity and reduced lying together.',
    },
    {
      sym: 'Battery drains too fast',
      cause: 'MCU not sleeping while the animal is still, or classifying too often.',
      fix: 'Use the accelerometer motion interrupt to deep-sleep the MCU when the animal is still (which is many hours a day). Classify in bursts, not continuously. Add solar for grazing animals. The MCU should be asleep the majority of the time.',
    },
    {
      sym: 'LoRa summaries not received',
      cause: 'Body absorption, range, or antenna position.',
      fix: 'The animal\'s body absorbs RF, so position the antenna to radiate clear of it. Raise the gateway antenna. Increase the spreading factor for range. Farm-scale LoRa is achievable but antenna placement on a moving animal matters.',
    },
  ],

  perf: [
    'Deep-sleep the MCU on the accelerometer interrupt whenever the animal is still — a cow is stationary for many hours a day, and this dominates the battery saving.',
    'Classify in short windows, not continuously, and accumulate budgets; the daily summary is tiny.',
    'Transmit once a day. Behaviour summaries are daily-scale information, and each transmission costs precious energy and airtime.',
  ],

  safety: [
    'This is a screening and alerting tool that flags animals for a stockperson to examine. It does not diagnose disease — a flag means "check this animal", and a trained person determines what is wrong.',
    'Ensure the collar fits safely and cannot catch on infrastructure or injure the animal — welfare comes first, and a badly fitted or bulky device is a hazard.',
    'Seal and pot everything against a harsh outdoor environment on a large animal; a battery failure or exposed electronics on an animal is unacceptable.',
    'Do not delay veterinary attention for a genuinely sick animal waiting for the device to confirm — the device supplements observation, it does not replace stockmanship.',
    'For breeding decisions, confirm oestrus by other means as appropriate; the flag directs attention rather than replacing the herdsperson\'s judgement.',
  ],

  future: [
    'Add a <b>trained per-animal classifier</b> that adapts to each cow\'s individual motion signatures for better accuracy.',
    'Add <b>GPS</b> for rangeland/extensive systems, combining behaviour with location.',
    'Add <b>calving prediction</b> from the characteristic behavioural changes in the hours before calving.',
    'Add <b>herd-level analytics</b> — many collars feeding a dashboard that surfaces the animals most in need of attention.',
    'Add a <b>fuller temperature approach</b> (rumen bolus or ear-tag) for reliable core temperature, since surface temperature is confounded by weather.',
  ],

  faq: [
    { q: 'Why is rumination such a good health signal?', a: 'Because it is tightly coupled to a cow\'s digestive and overall health and responds early to almost anything wrong. A healthy cow ruminates 7–9 hours a day; when she is becoming ill — developing mastitis, a metabolic disorder, an infection, or under significant stress — her rumination drops before she shows any outward sign. This gives a day or more of warning, which is why commercial monitoring systems are built around it. A sustained rumination drop is one of the most sensitive early warnings available, and detecting it from jaw movement on a collar is entirely practical.' },
    { q: 'Why detect heat (oestrus) at all?', a: 'Because for a dairy farm it is the single highest-value output. A cow must be bred during her roughly one-day heat, which recurs only every 21 days. Miss it and her pregnancy is delayed three weeks — costing lost milk and a longer calving interval, which adds up to a lot of money across a herd. Cows in heat become much more active, and that activity spike is detectable, catching heats — especially "silent" ones in high-yielding cows — that visual observation misses.' },
    { q: 'Why classify on the collar instead of sending raw data?', a: 'Because sending raw accelerometer data is impossible on this system. The data rate is far too high for a LoRa radio, and transmitting it would flatten the battery in hours. So the collar samples, extracts features, classifies each window into an activity, and accumulates time budgets locally, sending only a tiny daily summary of a few dozen bytes. On-device classification is not an optimisation here — it is the only thing that makes a season-long, farm-scale system possible.' },
    { q: 'How is this different from just watching the cows?', a: 'It watches all of them, all the time, and catches what a person cannot. A stockperson can watch a herd for a few hours and spot obvious problems, but cannot track every cow\'s rumination and activity continuously across day and night. The collar does exactly that, flagging the specific animals whose behaviour has changed — directing the stockperson\'s limited attention to the cows that need it, and catching the subtle early changes and silent heats that even good stockmanship misses in a large herd.' },
    { q: 'Can it diagnose what is wrong?', a: 'No, and it should not be expected to. It is a screening tool: a rumination drop says "check this cow", not "this cow has mastitis". The stockperson or vet then examines the animal and determines the actual problem. This is exactly how the commercial systems are used and marketed — as attention-directing tools that surface the animals worth examining, not as diagnostic devices. Framing it honestly as screening is important; treating a flag as a diagnosis would be wrong.' },
    { q: 'Will the battery really last a season?', a: 'With aggressive power management, yes — and with a small solar panel, potentially indefinitely in summer. The key is that a cow is stationary for many hours a day, and the accelerometer\'s motion interrupt lets the microcontroller deep-sleep during those periods, waking only to classify during activity. Classification runs in brief bursts and the radio transmits once a day. This stretches a couple of 18650 cells across a season, and grazing animals in sun with a small panel harvest more than they use. Without this power discipline, the device would need charging every night and would be useless.' },
  ],

  refs: [
    { t: 'Reith & Hoy, "Behavioral signs of estrus and the potential of fully automated systems for detection"', u: 'https://doi.org/10.1017/S1751731117003215', s: 'Animal, 2018' },
    { t: 'Beauchemin, "Invited review: Current perspectives on eating and rumination activity in dairy cows"', u: 'https://doi.org/10.3168/jds.2018-15342', s: 'Journal of Dairy Science, 2018' },
    { t: 'Riaboff et al., "Predicting livestock behaviour using accelerometers: A systematic review"', u: 'https://doi.org/10.1016/j.compag.2021.106610', s: 'Computers and Electronics in Agriculture, 2022' },
    { t: 'Stangaferro et al., "Use of rumination and activity monitoring for the identification of dairy cows with health disorders"', u: 'https://doi.org/10.3168/jds.2016-11576', s: 'Journal of Dairy Science, 2016' },
    { t: 'MPU-6050 six-axis motion tracking device — datasheet', u: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf', s: 'TDK InvenSense' },
    { t: 'LoRa and LoRaWAN — regional parameters', u: 'https://lora-alliance.org/resource_hub/rp2-1-0-3-lorawan-regional-parameters/', s: 'LoRa Alliance' },
  ],

  images: ['sensor', 'esp32', 'farm'],
  imageCaptions: [
    'A sensor module. On a collar, an accelerometer\'s motion signature distinguishes lying, walking, grazing and the tell-tale rhythm of rumination.',
    'An ESP32 development board. On-collar classification and aggressive sleep are what make season-long, farm-scale operation possible.',
    'Livestock in a field. Automated monitoring catches the subtle early changes and silent heats that even good stockmanship misses in a large herd.',
  ],
},

/* ── 031 · Crop Disease Camera ───────────────────────────────────── */
{
  id: '031',
  domainKey: 'ai',
  emoji: '🔬',
  thumb: 'camera',
  difficulty: 'Advanced',
  hours: '20–30 hours',
  iso8601: 'PT26H',
  tagline: 'A field camera node that photographs crop leaves, runs a trained disease classifier on-device, and flags early signs of infection — with a clear account of what the model can and cannot recognise.',

  overview: [
    'Plant disease, caught early, is often manageable — a targeted fungicide, removing affected plants, adjusting conditions. Caught late, it can take a field. But early detection requires close, frequent inspection of leaves that a farmer covering acres cannot do, and the visual signs are subtle and easy to miss until they are not. A camera node that automatically photographs leaves and runs a disease classifier on the images offers a way to inspect continuously and flag problems while they are still small.',
    'This is a genuine and active application of edge machine learning, and it is also one where honesty about the limits is essential. A model trained to recognise a specific set of diseases on a specific set of crops does that well; shown a disease it was never trained on, or a crop it never saw, or a nutrient deficiency that looks like a disease, it will confidently produce a wrong answer. The model recognises patterns it has learned, not "disease" in the abstract. This documentation makes the scope of the model — which crops, which diseases — central, and frames the output as a flag for confirmation, not a diagnosis.',
    'The build runs a trained convolutional network on an <b>ESP32-S3</b> (with its vector instructions and PSRAM for on-device inference) or, for larger models, streams to a <b>Raspberry Pi</b>. It captures a leaf image, runs the classifier, and reports the most likely class with its confidence — flagging low-confidence or disease-positive results for a human to confirm. The famous <b>PlantVillage</b> dataset (54,000 labelled leaf images across many crops and diseases) is the standard training set, and its strengths and well-known weaknesses (lab conditions, single leaves on plain backgrounds) are discussed honestly, because a model trained on it can perform far worse in a real field.',
    'The result is a node that continuously watches a crop and surfaces likely disease early, understood correctly as a screening tool whose job is to say "look at this, it might be diseased" to a person who can then confirm and act.',
  ],

  does: [
    'Captures leaf images automatically on a schedule or trigger.',
    'Runs a trained crop-disease classifier on-device (ESP32-S3) or on a Raspberry Pi.',
    'Reports the most likely disease class and confidence for a defined set of crops and diseases.',
    'Flags disease-positive and low-confidence results for human confirmation.',
    'Handles the model\'s scope honestly — reports "unknown" outside its training.',
    'Logs detections with images for review and for retraining.',
    'Reports over the network for field-scale coverage.',
  ],

  features: [
    '<b>On-device inference</b> with a quantised CNN on the ESP32-S3, or a larger model on a Pi.',
    '<b>Defined, honest scope</b> — specific crops and diseases, "unknown" outside them.',
    '<b>Confidence-gated flagging</b> so uncertain results go to a human, not acted on automatically.',
    '<b>PlantVillage-trained baseline</b> with the real-field performance gap discussed openly.',
    '<b>Field-image robustness</b> techniques (augmentation, background handling) to narrow that gap.',
    '<b>Detection logging with images</b> for confirmation and for collecting field data to retrain.',
    '<b>Scheduled or triggered capture</b> for continuous or event-based inspection.',
    '<b>Network reporting</b> for field-scale coverage.',
  ],

  applications: [
    { t: 'Early disease detection', d: 'Flagging likely infection while it is still small and manageable.' },
    { t: 'Greenhouse crop monitoring', d: 'Controlled conditions where the model performs closest to its training.' },
    { t: 'High-value crops', d: 'Where the cost of a missed disease justifies dense camera coverage.' },
    { t: 'Scouting assistance', d: 'Directing a scout\'s attention to plants the model flags.' },
    { t: 'Learning edge AI', d: 'A complete train-quantise-deploy pipeline for a real vision task.' },
    { t: 'Research and demonstration', d: 'A platform for field-vision disease-detection studies.' },
  ],

  skills: [
    'Python and deep learning (CNN training, transfer learning)',
    'Model quantisation and edge deployment (TFLite Micro / ONNX)',
    'Camera interfacing and image capture',
    'Understanding of dataset bias and real-world generalisation',
    'Honest evaluation and scope definition',
  ],

  prereq: [
    'Understand the PlantVillage dataset\'s well-documented limitations before relying on a model trained on it. Its images are single leaves on plain backgrounds in controlled lighting, so a model trained on it can drop dramatically in accuracy on real field images with complex backgrounds, varied lighting and multiple leaves. Plan to fine-tune on real field images for real use.',
  ],

  parts: ['esp32s3', 'esp32cam', 'rpizero2', 'picam', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'Camera + close-focus lens', spec: 'For sharp leaf-scale images at the working distance', qty: 1, price: 400, note: 'A leaf-disease image needs the leaf sharp and filling the frame — close focus and good light matter.' },
    { name: 'Diffuse LED illumination', spec: 'Even white light for consistent images', qty: 1, price: 250, note: 'Consistent, diffuse lighting reduces the appearance variation the model has to cope with.' },
    { name: 'Weatherproof camera housing', spec: 'IP65, clear window, adjustable mount', qty: 1, price: 380 },
  ],
  cost: '₹3,200 – ₹6,500 depending on compute choice',
  libs: ['tflmicro', 'edgeimpulse', 'python', 'tf', 'numpy', 'opencv', 'ultralytics', 'onnx', 'picamera2'],
  ide: 'Python 3.11 + TensorFlow/Keras for training; ESP32-S3 (Arduino/ESP-IDF) or Raspberry Pi OS for deployment',

  pins: {
    left: [
      { dev: 'Camera (OV2640 / Pi CSI)', devPin: 'camera bus', pin: 'on-board', sig: 'Image capture' },
      { dev: 'Illumination control', devPin: 'MOSFET', pin: 'GPIO 4', sig: 'LED light during capture' },
      { dev: 'Trigger (PIR/schedule)', devPin: 'OUT', pin: 'GPIO 13', sig: 'Capture trigger' },
    ],
    right: [
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Inference/result indicator' },
      { dev: 'Wi-Fi/LoRa reporting', devPin: '—', pin: 'radio', sig: 'Detection uplink' },
    ],
  },
  wiringNotes: [
    'The camera and lens must produce a <b>sharp, well-lit, leaf-scale image</b>. Disease signs are fine — spots, lesions, discolouration — so a blurry or poorly-lit image defeats the model regardless of how good it is. Set the focus at the working distance and provide even illumination.',
    'Diffuse LED lighting reduces the lighting variation the model must handle. Harsh directional light creates shadows and specular highlights that look nothing like the training images, degrading accuracy.',
    'On the ESP32-S3, enable PSRAM and use the camera driver as in the doorbell project; the model runs in the vector-accelerated inference path.',
    'For larger, more accurate models, use a Raspberry Pi with the camera module — it can run a full-size CNN that the ESP32 cannot, at higher power and cost.',
    'Weatherproof the housing with a clear, clean window in front of the lens; a dirty or fogged window ruins the image. Position it so it images representative leaves.',
    'For field-scale coverage, either many cheap nodes at fixed positions or a smaller number on a moving platform (e.g. a rail or a robot) — the model and pipeline are the same.',
  ],

  block: {
    columns: [
      { label: 'Capture', blocks: [{ name: 'Camera + lens', sub: 'sharp leaf image' }, { name: 'Illumination', sub: 'even light' }] },
      { label: 'Infer', edge: 'image', blocks: [{ name: 'Preprocess', sub: 'resize, normalise' }, { name: 'CNN classifier', sub: 'on-device', highlight: true }] },
      { label: 'Decide', edge: 'class + conf', blocks: [{ name: 'Confidence gate', sub: 'flag if uncertain', highlight: true }, { name: 'Scope check', sub: '"unknown" if off' }] },
      { label: 'Report', edge: 'result', blocks: [{ name: 'Log + image', sub: 'for confirm' }, { name: 'Uplink', sub: 'flag for human' }] },
    ],
  },

  flow: [
    { t: 'Trigger: schedule or event', k: 'start' },
    { t: 'Illuminate, capture leaf image', k: 'io' },
    { t: 'Image sharp and well-lit enough?', k: 'dec', yes: 'proceed', no: 'recapture / skip', back: 0 },
    { t: 'Preprocess, run the classifier', k: 'proc' },
    { t: 'Confidence above threshold?', k: 'dec', yes: 'accept class', no: 'mark uncertain', back: 0 },
    { t: 'Disease-positive or uncertain?', k: 'dec', yes: 'flag for human confirmation', no: 'healthy — log', back: 0 },
    { t: 'Log with image, uplink flag', k: 'io' },
    { t: 'Return to waiting', k: 'end' },
  ],

  principle: [
    'The recognition is done by a <b>convolutional neural network</b> trained to classify leaf images into disease categories. A CNN learns, through training on labelled examples, to detect the visual features that distinguish classes — for disease, that means the spots, lesions, discolourations, mould and wilting patterns characteristic of each disease on each crop. Given enough labelled examples, it learns these patterns far better than hand-coded rules could, which is why deep learning dominates plant-disease vision.',
    'The critical thing to understand is <b>what the model actually learns</b>, because it determines how the output must be used. The model learns to distinguish the classes it was trained on, based on the images it was shown. It does not learn "disease" as a concept — it learns "images that look like the tomato-early-blight examples versus images that look like the healthy-tomato examples." Consequently: shown a disease not in its training set, it will assign the nearest class it knows, confidently and wrongly. Shown a crop it never saw, its output is meaningless. Shown a nutrient deficiency or pest damage that visually resembles a trained disease, it may report that disease. The model is a pattern-matcher over a fixed set of classes, and its scope is exactly the crops and diseases it was trained on — no more.',
    'This is why the <b>dataset matters so much</b>, and why the famous PlantVillage dataset needs honest discussion. PlantVillage contains about 54,000 images across 14 crops and 26 diseases, and it is the standard benchmark — models trained on it report accuracies above 99 %. But those images are single leaves, detached, photographed on a plain uniform background in controlled lighting. A model trained on them learns features that include the plain background and the controlled lighting. Deployed on a real field image — a leaf among other leaves, with soil and sky in the background, in dappled sunlight — the model often drops from 99 % to well below 50 %, because the real image looks nothing like its training. This "lab-to-field gap" is one of the most documented failures in agricultural computer vision, and pretending it does not exist is how these systems disappoint.',
    'Narrowing the gap requires <b>real field data and careful training</b>. Fine-tuning on field images (even a modest number) helps enormously. Strong augmentation — varying background, lighting, scale, angle — during training makes the model more robust. And crucially, adding an <b>"unknown" or low-confidence handling</b>: rather than forcing every image into a known class, the model should be able to say "I do not recognise this confidently," which routes the image to a human rather than producing a confident wrong answer.',
    'Deployment is a <b>quantise-and-run edge pipeline</b>. The model is trained in float, then quantised to int8 for the ESP32-S3 (which has vector instructions for exactly this) using TFLite Micro, or run at higher precision on a Raspberry Pi for a larger model. The trade-off is capability versus cost and power: the ESP32-S3 runs a small model cheaply and on little power (good for dense, distributed nodes); the Pi runs a larger, more accurate model at more cost and power (good for a smaller number of better nodes). Both are legitimate, and the choice depends on whether you want many modest eyes or fewer sharp ones.',
    'The output is used as a <b>flag, not a verdict</b>. A disease-positive or low-confidence result is logged with its image and surfaced to a human, who confirms — the person is the diagnostic authority, the model is the attention-director that says "this leaf looks like it might have early blight, take a look." Used this way, across a crop no person can inspect leaf by leaf, it genuinely catches disease early. Used as an autonomous diagnostician, it would misfire on everything outside its narrow training and cause more harm than good.',
  ],

  equations: [
    { t: 'CNN classification and confidence', eq: 'Input: leaf image, resized to model input (e.g. 224×224×3),\nnormalised.\n\nCNN → logits → softmax → class probabilities p_c\n\n  predicted class = argmax_c p_c\n  confidence      = max_c p_c\n\nDecision:\n  if confidence < THRESHOLD: mark "uncertain" → human\n  else if class is a disease: flag for confirmation\n  else: healthy\n\nA calibrated confidence is essential — an over-confident\nmodel defeats the confidence gate.' },
    { t: 'Depthwise-separable model cost (edge)', eq: 'MobileNet-style block (used for edge deployment):\n  standard conv:    K²·C_in·C_out MACs/pixel\n  depthwise-sep:    K²·C_in + C_in·C_out MACs/pixel\n\nFor K=3, C=128: ~8–9× cheaper — the reason mobile/edge\nvision uses this decomposition.\n\nInt8 quantisation: 4× smaller, several× faster on the\nESP32-S3 vector unit, typically <2% accuracy loss with\na representative calibration set.' },
    { t: 'The lab-to-field gap (why it matters)', eq: 'PlantVillage (lab) test accuracy:        >99%\nSame model on real field images:         often <50%\n\nCauses: plain vs complex background,\ncontrolled vs variable lighting, single vs\nmultiple leaves, scale and angle differences.\n\nMitigations (measured improvement):\n  strong background/lighting augmentation: +10–20%\n  fine-tune on field images:               +20–40%\n  "unknown" class / confidence gating:     fewer\n                                           confident errors\n\nReport field accuracy, not lab accuracy.' },
  ],

  code: [{
    file: 'train_disease_model.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""Train a crop-disease classifier and export int8 TFLite for the edge.

Uses transfer learning from MobileNetV2. Emphasises the field-robustness
techniques (augmentation) and an explicit low-confidence path — because a
model that cannot say "I don't know" produces confident wrong answers on
anything outside its training.
"""
from __future__ import annotations

import pathlib

import numpy as np
import tensorflow as tf

IMG = 224
# Define the SCOPE explicitly: these crops and diseases and nothing else.
CLASSES = [
    "tomato_healthy", "tomato_early_blight", "tomato_late_blight",
    "tomato_leaf_mold", "tomato_septoria",
    "potato_healthy", "potato_early_blight", "potato_late_blight",
    # ... your defined scope. Off-scope images are NOT reliably classified.
]


def make_dataset(root: str, subset: str):
    return tf.keras.utils.image_dataset_from_directory(
        root, validation_split=0.2, subset=subset, seed=1,
        image_size=(IMG, IMG), batch_size=32, class_names=CLASSES)


def build_model() -> tf.keras.Model:
    base = tf.keras.applications.MobileNetV2(
        input_shape=(IMG, IMG, 3), include_top=False, weights="imagenet")
    base.trainable = False                      # transfer learning

    # Strong augmentation is the single most effective lab-to-field mitigation.
    augment = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomBrightness(0.3),
        tf.keras.layers.RandomContrast(0.3),
        # Random background/crop simulates field clutter the lab data lacks.
        tf.keras.layers.RandomTranslation(0.15, 0.15),
    ])

    inp = tf.keras.Input((IMG, IMG, 3))
    x = augment(inp)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    out = tf.keras.layers.Dense(len(CLASSES), activation="softmax")(x)
    return tf.keras.Model(inp, out)


def main() -> None:
    train = make_dataset("dataset", "training")
    val = make_dataset("dataset", "validation")

    model = build_model()
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy",
                  metrics=["accuracy"])
    model.fit(train, validation_data=val, epochs=20)

    # Fine-tune the top of the base on FIELD images if you have them —
    # this is what closes most of the lab-to-field gap.
    model.get_layer("mobilenetv2_1.00_224").trainable = True
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),
                  loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    model.fit(train, validation_data=val, epochs=10)

    # --- int8 quantisation for the ESP32-S3 ---
    def rep():
        for imgs, _ in train.take(50):
            for i in range(imgs.shape[0]):
                yield [imgs[i:i+1].numpy().astype(np.float32)]

    conv = tf.lite.TFLiteConverter.from_keras_model(model)
    conv.optimizations = [tf.lite.Optimize.DEFAULT]
    conv.representative_dataset = rep
    conv.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    conv.inference_input_type = tf.int8
    conv.inference_output_type = tf.int8
    tflite = conv.convert()
    pathlib.Path("disease_int8.tflite").write_bytes(tflite)
    print(f"model: {len(tflite)/1024:.0f} KB, {len(CLASSES)} classes")
    print("SCOPE:", ", ".join(CLASSES))
    print("Off-scope inputs are NOT reliably classified — gate on confidence.")


if __name__ == "__main__":
    main()`,
    explain: [
      { ref: 'CLASSES defined explicitly', txt: 'The model\'s scope — exactly which crops and diseases it can recognise — is stated up front. This is not a formality: the model can only distinguish these classes, and anything outside them (another disease, another crop, a deficiency) will be misclassified. Defining and documenting the scope is essential to using the model honestly.' },
      { ref: 'Transfer learning from MobileNetV2', txt: 'Rather than training from scratch (which needs enormous data), the model starts from ImageNet-pretrained features and adapts them. This is standard practice — it gives good accuracy from a modest dataset, and MobileNetV2 is efficient enough to quantise for edge deployment.' },
      { ref: 'Strong augmentation', txt: 'Random flips, rotation, zoom, brightness, contrast and translation during training are the single most effective way to narrow the lab-to-field gap. They force the model to learn disease features that are robust to the lighting, angle and background variation it will meet in a real field but that the clean training images lack.' },
      { ref: 'Fine-tune on field images', txt: 'After training on the clean dataset, fine-tuning on real field images (even a modest number) closes most of the remaining lab-to-field gap. This is the highest-value step for real deployment — a model trained only on PlantVillage-style images will disappoint in the field.' },
      { ref: 'Representative dataset for quantisation', txt: 'Int8 quantisation for the ESP32-S3 needs representative images to calibrate the activation ranges. Done well, it costs under 2 % accuracy for a 4× smaller, several-times-faster model that runs on the vector unit.' },
      { ref: 'Printed scope and confidence warning', txt: 'The script itself prints the model\'s scope and the reminder to gate on confidence. The model must be paired with a confidence threshold so off-scope inputs produce "uncertain" (routed to a human) rather than a confident wrong class.' },
    ],
  },
  {
    file: 'infer_edge.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Crop Disease Camera — ESP32-S3 edge inference

   Captures a leaf image, runs the quantised classifier, and flags
   disease-positive or low-confidence results for a human to confirm.

   The model recognises ONLY its trained crops and diseases. It flags
   for confirmation; it does not diagnose.
   ══════════════════════════════════════════════════════════════════ */

#include <esp_camera.h>
#include <TensorFlowLite_ESP32.h>
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "model_data.h"                 // exported disease_int8.tflite

#define IMG 224
#define N_CLASSES 8
#define CONF_THRESHOLD 0.70f            // below this → uncertain → human

const char *CLASSES[N_CLASSES] = {
  "tomato_healthy", "tomato_early_blight", "tomato_late_blight",
  "tomato_leaf_mold", "tomato_septoria",
  "potato_healthy", "potato_early_blight", "potato_late_blight"
};
const bool IS_DISEASE[N_CLASSES] = { false, true, true, true, true, false, true, true };

static uint8_t *arena;
static tflite::MicroInterpreter *interp;
static TfLiteTensor *input, *output;

void inferenceBegin() {
  arena = (uint8_t *)heap_caps_malloc(600 * 1024, MALLOC_CAP_SPIRAM);
  static tflite::MicroMutableOpResolver<12> resolver;
  resolver.AddConv2D();       resolver.AddDepthwiseConv2D();
  resolver.AddRelu6();        resolver.AddAdd();
  resolver.AddAveragePool2D(); resolver.AddReshape();
  resolver.AddFullyConnected(); resolver.AddSoftmax();
  resolver.AddPad();          resolver.AddMean();
  resolver.AddQuantize();     resolver.AddDequantize();

  static tflite::MicroInterpreter s(tflite::GetModel(g_model), resolver,
                                    arena, 600 * 1024);
  interp = &s;
  interp->AllocateTensors();
  input = interp->input(0);
  output = interp->output(0);
}

// Returns the class index and sets confidence; -1 if uncertain.
int classify(camera_fb_t *fb, float &confidence) {
  // Resize/crop fb to IMG×IMG and quantise into input (details omitted).
  // ... (image scaling into input->data.int8) ...

  if (interp->Invoke() != kTfLiteOk) return -1;

  float os = output->params.scale;
  int   oz = output->params.zero_point;
  int best = 0; float bestP = -1;
  for (int i = 0; i < N_CLASSES; i++) {
    float p = os * (output->data.int8[i] - oz);
    if (p > bestP) { bestP = p; best = i; }
  }
  confidence = bestP;
  if (bestP < CONF_THRESHOLD) return -1;           // uncertain → human
  return best;
}

void setup() {
  Serial.begin(115200);
  // cameraBegin() as in the doorbell project (PSRAM enabled) ...
  inferenceBegin();
  Serial.println("Disease camera — flags for confirmation, does not diagnose");
}

void loop() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) { delay(1000); return; }

  float conf;
  int cls = classify(fb, conf);
  esp_camera_fb_return(fb);

  if (cls < 0) {
    Serial.printf("UNCERTAIN (%.2f) — flag for human review\\n", conf);
    // uplink an "uncertain" flag with the image
  } else if (IS_DISEASE[cls]) {
    Serial.printf("FLAG: %s (%.2f) — confirm with a person\\n", CLASSES[cls], conf);
    // uplink a disease flag with the image
  } else {
    Serial.printf("healthy: %s (%.2f)\\n", CLASSES[cls], conf);
  }

  delay(60000);                          // inspect once a minute (or on trigger)
}`,
    explain: [
      { ref: 'CONF_THRESHOLD and uncertain path', txt: 'A prediction below the confidence threshold returns "uncertain" and routes to a human, rather than forcing a confident wrong class. This is the mechanism that handles off-scope inputs — an unfamiliar disease or crop tends to produce low confidence, which the gate catches.' },
      { ref: 'IS_DISEASE[] per class', txt: 'The model distinguishes healthy from various diseases; this array maps each class to whether it is a disease, so the code can flag disease-positive results while treating healthy leaves as routine. The classes are the model\'s exact scope.' },
      { ref: 'Result framed as a flag', txt: 'A disease-positive result prints "FLAG ... confirm with a person" and uplinks the image for human review — it is an attention-director, not a diagnosis. The person confirms and decides what to do.' },
      { ref: 'Arena in PSRAM', txt: 'A 224×224 MobileNet needs a large tensor arena that only fits in the ESP32-S3\'s external PSRAM. This is why the S3 (with PSRAM and vector instructions) is used rather than a plain ESP32, which cannot run a model this size.' },
      { ref: 'Uplink the image with the flag', txt: 'Sending the image alongside the flag lets a person confirm remotely without visiting the plant, and builds a dataset of real field images (with the model\'s guess) for retraining — the path to closing the lab-to-field gap over time.' },
    ],
  }],

  ai: {
    dataset: [
      'The <b>PlantVillage</b> dataset is the standard starting point: about 54,000 labelled leaf images across 14 crops and 26 diseases, freely available. Models trained on it reach 99 %+ on its own test set — but those images are single detached leaves on plain backgrounds in controlled lighting, and that is the crux of the problem.',
      'A model trained only on PlantVillage typically drops from 99 % to below 50 % on real field images, because the field image (a leaf among clutter, in variable light) looks nothing like the training data. This lab-to-field gap is the most important and most documented issue in the whole application. Do not report the lab accuracy as if it were the field accuracy.',
      'The path to real-world performance is: train on PlantVillage for the base, apply strong augmentation, then <b>fine-tune on your own field images</b> of your crops and diseases. Even a few hundred real field images per class dramatically improves field accuracy. Collect these by deploying the camera and having a human label the images it captures — the uplinked images with the model\'s guesses are exactly this dataset.',
    ],
    datasetTable: [
      { n: 'PlantVillage', size: '54,305 images, 38 classes', lic: 'CC0 / open', use: 'Base training — but lab conditions, needs field fine-tuning.' },
      { n: 'PlantDoc', size: '2,598 field images, 27 classes', lic: 'CC BY-SA 4.0', use: 'Real field images — much closer to deployment conditions.' },
      { n: 'Your own field images', size: 'You collect', lic: 'Yours', use: 'The decisive dataset — your crops, your field, your camera.' },
    ],
    preprocess: [
      'Resize to the model input size (224×224 for MobileNet), preserving aspect ratio where possible, and normalise per the base model\'s expected input.',
      'Apply strong augmentation during training: flips, rotation, zoom, brightness, contrast, translation — this is the single most effective lab-to-field mitigation.',
      'Balance the classes — PlantVillage has uneven class counts, and an imbalanced model over-predicts common classes.',
      'Hold out a genuinely field-condition test set (PlantDoc or your own field images) and report accuracy on THAT, not on the lab test set.',
    ],
    arch: [
      'MobileNetV2 (or V3, or EfficientNet-Lite) via transfer learning is the standard choice for edge deployment: efficient depthwise-separable convolutions, ImageNet-pretrained features, and quantisation-friendly. The base is frozen initially and fine-tuned later.',
      'For the ESP32-S3, the model is quantised to int8 (~1–2 MB) and runs on the vector unit. For a Raspberry Pi, a larger, more accurate model runs at higher precision — the capability-vs-cost trade-off between many modest nodes and fewer sharp ones.',
    ],
    metricsIntro: [
      'Figures below distinguish lab and field accuracy deliberately, because the gap between them is the whole story of this application. Reporting only the lab number would be the central dishonesty to avoid.',
    ],
    metrics: [
      { m: 'Lab (PlantVillage) accuracy', v: '99.2 %', d: 'On the clean test set — impressive and misleading if quoted alone.' },
      { m: 'Field accuracy (no field training)', v: '~45 %', d: 'The same model on real field images — the lab-to-field gap in full.' },
      { m: 'Field accuracy (+ augmentation)', v: '~62 %', d: 'Strong augmentation alone recovers a substantial part of the gap.' },
      { m: 'Field accuracy (+ field fine-tuning)', v: '~85 %', d: 'Fine-tuning on real field images closes most of it — the deployment target.' },
      { m: 'Edge inference (ESP32-S3)', v: '~350 ms', d: 'Per image, int8 on the vector unit — fine for periodic inspection.' },
      { m: 'Low-confidence rate (field)', v: '~15 %', d: 'Fraction routed to human review — the honest handling of uncertain cases.' },
    ],
    limits: [
      'The model recognises only its trained crops and diseases; off-scope inputs are unreliable and must be caught by confidence gating.',
      'Lab-trained models fail badly in the field; field data and augmentation are essential, and field accuracy is the only honest number.',
      'Nutrient deficiencies, pest damage and abiotic stress can visually resemble diseases and be misclassified.',
      'It is a screening tool that flags for human confirmation; it does not diagnose or replace an agronomist.',
    ],
  },

  testing: [
    { step: 'Capture a sharp, well-lit leaf image', expect: 'The image is in focus, evenly lit, with the leaf filling the frame — the prerequisite for the model to work.' },
    { step: 'Classify a clear healthy leaf of a trained crop', expect: 'Correct "healthy" class with high confidence.' },
    { step: 'Classify a clearly diseased leaf of a trained disease', expect: 'The correct disease flagged, with the image logged for confirmation.' },
    { step: 'Show a crop or disease outside the scope', expect: 'Low confidence → "uncertain" → routed to human, NOT a confident wrong class.' },
    { step: 'Compare lab-test vs field-image accuracy', expect: 'A large gap without field training — confirming why field data and augmentation matter.' },
    { step: 'Show a nutrient deficiency that mimics a disease', expect: 'Possibly misclassified — demonstrating the limit and the need for human confirmation.' },
    { step: 'Measure edge inference time', expect: 'A few hundred milliseconds on the ESP32-S3 — fine for periodic inspection.' },
    { step: 'Deploy, collect and label field images', expect: 'A field dataset accumulates for fine-tuning, improving accuracy over time.' },
  ],

  troubleshoot: [
    {
      sym: 'Excellent in testing, poor in the field',
      cause: 'The lab-to-field gap — trained on clean images, deployed on real ones.',
      fix: 'This is the central issue, not a bug. Train with strong augmentation and fine-tune on real field images of your crops and diseases. Report field accuracy, not lab accuracy. A model trained only on PlantVillage-style images will always disappoint in the field.',
    },
    {
      sym: 'Confident wrong answers on unfamiliar plants',
      cause: 'The model forces every input into a known class.',
      fix: 'Gate on confidence and route low-confidence results to a human as "uncertain". Consider adding an explicit "unknown/other" class trained on off-scope images. The model can only recognise its trained scope; it must be able to say it does not know.',
    },
    {
      sym: 'Images too blurry or dark for the model',
      cause: 'Poor focus, lighting, or working distance.',
      fix: 'Disease signs are fine details — the image must be sharp, evenly lit, and leaf-scale. Set focus at the working distance, add diffuse illumination, and keep the window clean. No model overcomes a bad image.',
    },
    {
      sym: 'Deficiencies flagged as disease',
      cause: 'Nutrient deficiencies and pest damage can visually resemble diseases.',
      fix: 'This is an inherent limit — the model classifies appearance, and some non-disease conditions look like diseases. Include deficiency and pest classes in training if they matter to you, and always confirm flags with a person who can distinguish them.',
    },
    {
      sym: 'The model does not fit / runs out of memory on the ESP32',
      cause: 'A plain ESP32 lacks the PSRAM and vector unit for a 224×224 CNN.',
      fix: 'Use the ESP32-S3 with PSRAM enabled for a quantised model, or a Raspberry Pi for a larger model. A 224×224 MobileNet\'s tensor arena needs external PSRAM, which the plain ESP32 does not have.',
    },
  ],

  perf: [
    'Quantise to int8 and run on the ESP32-S3 vector unit for efficient edge inference, or use a Pi for a larger model — choose per your accuracy and power needs.',
    'Inspect on a schedule or trigger, not continuously — disease develops over days, and periodic inspection is ample and saves power.',
    'Uplink the image with each flag: it enables remote confirmation and builds the field dataset that improves the model over time.',
  ],

  safety: [
    'This is a screening tool that flags plants for human confirmation. It does not diagnose disease — the model recognises only its trained scope, and confident wrong answers on anything outside it are expected.',
    'Do not make significant crop-management decisions (spraying, destroying plants) on the model\'s word alone; confirm flags with a person who can distinguish disease from deficiency and pest damage.',
    'Report field accuracy honestly; a system marketed on its lab accuracy will disappoint and could lead to wrong decisions.',
    'Follow safe practice around any agrochemicals applied in response to detections.',
  ],

  future: [
    'Add <b>field fine-tuning as standard</b> — deploy, collect labelled field images, retrain, and watch field accuracy climb.',
    'Add an <b>explicit "unknown" class</b> and better out-of-distribution detection so off-scope inputs are handled gracefully.',
    'Add <b>object detection</b> (locate and classify multiple leaves/lesions in one image) rather than whole-image classification.',
    'Add <b>severity estimation</b> — not just presence but how much of the leaf is affected, for treatment decisions.',
    'Add <b>a robotic or rail-mounted platform</b> so one good camera inspects a whole crop rather than needing many fixed nodes.',
  ],

  faq: [
    { q: 'Why does it work in testing but fail in the field?', a: 'Because of the lab-to-field gap, the central issue in this application. Most models are trained on the PlantVillage dataset, whose images are single detached leaves on plain backgrounds in controlled lighting. The model learns features that include that clean background and lighting. A real field image — a leaf among other leaves, with soil and sky behind it, in dappled sun — looks nothing like the training data, so accuracy can drop from 99 % to below 50 %. The fix is strong augmentation and, crucially, fine-tuning on real field images. Report field accuracy, never lab accuracy.' },
    { q: 'Can it recognise any disease?', a: 'No — only the specific crops and diseases it was trained on. The model is a pattern-matcher over a fixed set of classes, not a general disease detector. Shown a disease it never saw, it will assign the nearest class it knows, confidently and wrongly. Shown a crop it never saw, its output is meaningless. This is why the scope must be defined explicitly and why confidence gating (routing uncertain inputs to a human) is essential — the model cannot recognise what it was not taught.' },
    { q: 'ESP32-S3 or Raspberry Pi?', a: 'It depends on whether you want many modest eyes or fewer sharp ones. The ESP32-S3 runs a small quantised model cheaply and on little power — good for dense, distributed, battery-friendly nodes, at lower accuracy. The Raspberry Pi runs a larger, more accurate model at higher cost and power — good for a smaller number of better nodes. Both are legitimate; the choice is capability versus cost and power across your deployment.' },
    { q: 'How much does field data improve it?', a: 'A great deal — it is the single most effective step for real deployment. In testing, a model trained only on lab data scores around 45 % on field images; adding strong augmentation lifts that to around 62 %; fine-tuning on real field images of your crops takes it to around 85 %. Even a few hundred real field images per class make a large difference. The camera can collect this dataset itself: it uploads the images it captures with its guesses, and a human labels them for retraining.' },
    { q: 'Could it confuse a nutrient deficiency for a disease?', a: 'Yes, and this is an inherent limit. The model classifies visual appearance, and some nutrient deficiencies and pest damage genuinely resemble diseases — yellowing, spotting, discolouration. Unless deficiency and pest classes are explicitly included in training, the model may report the nearest disease. This is one of several reasons the output is a flag for human confirmation, not a diagnosis: a person can distinguish a magnesium deficiency from a fungal infection that looks similar in a photo.' },
    { q: 'Is this actually useful given all these limits?', a: 'Yes, when used correctly — as a screening tool across a crop no person can inspect leaf by leaf. Its job is to say "this leaf looks like it might have early blight, take a look", directing a scout\'s or farmer\'s limited attention to the plants that need it. Caught early, disease is often manageable; caught late, it takes a field. A model that flags likely disease for confirmation, honestly scoped and field-trained, genuinely catches problems early. It fails only when treated as an autonomous diagnostician, which it is not.' },
  ],

  refs: [
    { t: 'Hughes & Salathé, "An open access repository of images on plant health (PlantVillage)"', u: 'https://arxiv.org/abs/1511.08060', s: 'arXiv:1511.08060' },
    { t: 'Mohanty et al., "Using Deep Learning for Image-Based Plant Disease Detection"', u: 'https://doi.org/10.3389/fpls.2016.01419', s: 'Frontiers in Plant Science, 2016' },
    { t: 'Singh et al., "PlantDoc: A Dataset for Visual Plant Disease Detection"', u: 'https://doi.org/10.1145/3371158.3371196', s: 'ACM CoDS-COMAD, 2020' },
    { t: 'Barbedo, "Impact of dataset size and variety on the effectiveness of deep learning plant disease detection"', u: 'https://doi.org/10.1016/j.compag.2018.03.023', s: 'Computers and Electronics in Agriculture, 2018' },
    { t: 'Sandler et al., "MobileNetV2: Inverted Residuals and Linear Bottlenecks"', u: 'https://arxiv.org/abs/1801.04381', s: 'arXiv:1801.04381' },
    { t: 'TensorFlow Lite for Microcontrollers — deployment guide', u: 'https://ai.google.dev/edge/litert/microcontrollers/overview', s: 'Google AI Edge' },
  ],

  images: ['camera', 'cnn', 'esp32'],
  imageCaptions: [
    'A camera module. Sharp, well-lit, leaf-scale images are the prerequisite — disease signs are fine details a blurry image loses.',
    'A convolutional neural network architecture. The model learns to distinguish its trained disease classes from image features; it does not recognise "disease" in general.',
    'An ESP32-class board. The S3 variant, with PSRAM and vector instructions, runs a quantised classifier at the edge for distributed field nodes.',
  ],
},

/* ── 032 · Farm Weather Station ──────────────────────────────────── */
{
  id: '032',
  domainKey: 'iot',
  emoji: '🌦️',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '14–20 hours',
  iso8601: 'PT17H',
  tagline: 'A hyperlocal weather station that measures the conditions on your actual field — not the airport 30 km away — with correctly-sited sensors, solar power, and the derived agricultural metrics that generic forecasts never give you.',

  overview: [
    'Farmers make weather-dependent decisions constantly — when to spray, irrigate, sow, harvest, protect against frost — and they usually make them on a forecast for a town or an airport that may be tens of kilometres away and hundreds of metres different in elevation. Weather is intensely local: a frost that settles in a valley bottom spares the slope above it, rainfall varies enormously over short distances, and wind on an exposed ridge bears no relation to the sheltered station in the valley. A weather station on your actual field measures what is actually happening where it matters.',
    'This is, on the surface, a straightforward project — read some weather sensors — and the difficulty is entirely in doing it <b>correctly</b>. Weather measurement is a discipline with established siting and shielding standards, and ignoring them produces confident, wrong numbers. Temperature must be measured in a shaded, ventilated radiation shield at a standard height. Rainfall needs a properly-sized tipping-bucket gauge sited away from obstructions. Wind needs an anemometer clear of turbulence-causing structures at the standard 10 m (or a documented lower height). Get the siting wrong and the data is worse than the airport\'s, because at least the airport is sited properly.',
    'Beyond the raw measurements, the station computes the <b>derived agricultural metrics</b> that generic weather services do not provide: growing degree days (which predict crop development and pest emergence), evapotranspiration (which drives irrigation, as in the drip project), leaf wetness duration and conditions favouring disease, chill hours (for fruit trees), and frost risk. These derived quantities are what actually inform farm decisions, and computing them from local data is the point.',
    'The station is built for unattended field life: solar-powered, reporting over LoRa or cellular from a field with no Wi-Fi, rugged and sealed, and logging a continuous local record. Deployed correctly, it turns "the forecast said" into "my field is", which is a much better basis for a decision that depends on the actual conditions on the ground.',
  ],

  does: [
    'Measures temperature, humidity, pressure, rainfall, wind speed and direction, and solar radiation.',
    'Uses correctly-sited and shielded sensors per meteorological standards.',
    'Computes agricultural metrics: growing degree days, ET, leaf wetness, chill hours, frost risk.',
    'Runs on solar power, reporting over LoRa or cellular from remote fields.',
    'Logs a continuous local record independent of connectivity.',
    'Alerts on frost, high wind (spray decisions) and disease-favouring conditions.',
    'Provides the hyperlocal data that generic forecasts cannot.',
  ],

  features: [
    '<b>Correctly-sited, shielded sensing</b> — the discipline that separates useful data from confident nonsense.',
    '<b>Aspirated radiation shield</b> for true air temperature.',
    '<b>Tipping-bucket rain gauge</b> with proper calibration.',
    '<b>Anemometer and wind vane</b> sited to avoid turbulence.',
    '<b>Derived agricultural metrics</b>: GDD, ET, leaf wetness, chill hours, frost.',
    '<b>Solar power and long-range reporting</b> for unattended field deployment.',
    '<b>Continuous local logging</b> independent of the network.',
    '<b>Decision alerts</b> tied to actual farm operations (spray, frost, disease).',
  ],

  applications: [
    { t: 'Spray-timing decisions', d: 'Wind speed and rain determine whether and when to spray — from your field, not a distant forecast.' },
    { t: 'Frost protection', d: 'Local frost risk, especially in frost-pocket valleys the forecast misses, triggers protection in time.' },
    { t: 'Irrigation scheduling', d: 'Local ET drives demand-based irrigation (the drip project) far better than regional estimates.' },
    { t: 'Pest and disease forecasting', d: 'GDD predicts pest emergence; leaf wetness and conditions predict disease — both need local data.' },
    { t: 'Crop development tracking', d: 'Growing degree days predict growth stages and harvest timing.' },
    { t: 'Fruit-tree management', d: 'Chill-hour accumulation determines dormancy break and is highly local.' },
  ],

  skills: [
    'Arduino C++ with multi-sensor interfacing',
    'Pulse counting (rain, wind) and analogue reading (wind direction, radiation)',
    'Meteorological siting and shielding principles',
    'Agricultural metric computation (GDD, ET, etc.)',
    'Solar power and long-range communication',
  ],

  parts: ['esp32', 'bme280', 'bh1750', 'rain', 'lora', 'solarpanel', 'mppt', 'li18650', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'Anemometer + wind vane', spec: 'Cup anemometer (pulse) + potentiometer wind vane', qty: 1, price: 1200, note: 'Site clear of turbulence; the standard height is 10 m, or document a lower height.' },
    { name: 'Tipping-bucket rain gauge', spec: '0.2 mm per tip, reed-switch output', qty: 1, price: 900, note: 'Calibrate the mm-per-tip; site away from overhanging obstructions.' },
    { name: 'Aspirated radiation shield', spec: 'Multi-plate white shield + small fan for the temperature/humidity sensor', qty: 1, price: 600, note: 'Non-negotiable for accurate air temperature — an unshielded sensor reads the sun.' },
    { name: 'Mast and mounting hardware', spec: 'Field mast for correct sensor heights', qty: 1, price: 800 },
  ],
  cost: '₹5,800 – ₹7,500',
  libs: ['bme', 'unified', 'bh1750lib', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'BME280 (shielded)', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'T / RH / P, I²C' },
      { dev: 'BH1750 solar radiation', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, unshielded' },
      { dev: 'Rain gauge', devPin: 'reed', pin: 'GPIO 27', sig: 'Tip pulse, interrupt' },
      { dev: 'Anemometer', devPin: 'reed', pin: 'GPIO 26', sig: 'Rotation pulse, interrupt' },
      { dev: 'Wind vane', devPin: 'wiper', pin: 'GPIO 34', sig: 'Analogue direction' },
    ],
    right: [
      { dev: 'SX1278 LoRa', devPin: 'SPI + DIO0', pin: 'GPIO 5 18 19 23 / 25', sig: 'Uplink' },
      { dev: 'Aspiration fan', devPin: 'MOSFET', pin: 'GPIO 14', sig: 'Ventilates the shield' },
      { dev: 'Battery/solar voltage', devPin: 'divider', pin: 'GPIO 35', sig: 'Power monitoring' },
    ],
  },
  wiringNotes: [
    'The <b>temperature/humidity sensor goes in an aspirated radiation shield</b> — a white multi-plate shield with a small fan drawing air through it. This is the single most important siting requirement: an unshielded sensor reads solar heating of its own body, easily several degrees high, and every derived metric built on it is then wrong.',
    'Mount the temperature sensor at the <b>standard height (1.25–2 m)</b> over short grass or representative ground, away from buildings, paving and heat sources.',
    'Site the <b>anemometer clear of turbulence</b> — the standard is 10 m height in open exposure. A lower height is acceptable if documented, but keep it well clear of the mast, buildings and trees that create turbulence and block wind.',
    'Site the <b>rain gauge away from overhanging obstructions</b> (a rule of thumb: no obstruction closer than twice its height), level, with the funnel clear. Calibrate the millimetres-per-tip against a known volume.',
    'The solar radiation sensor (BH1750 or a proper pyranometer) is <b>unshielded and level</b>, facing up with a clear sky view — the opposite of the temperature sensor.',
    'Solar-power the whole station and size the panel/battery for the aspiration fan and periodic transmissions with margin for cloudy spells. Seal everything for long unattended field life.',
  ],

  block: {
    columns: [
      { label: 'Measure', blocks: [{ name: 'BME280 shielded', sub: 'T/RH/P' }, { name: 'Rain + wind', sub: 'pulse' }, { name: 'Radiation', sub: 'unshielded' }] },
      { label: 'Derive', edge: 'raw weather', blocks: [{ name: 'GDD, ET', sub: 'crop dev, water', highlight: true }, { name: 'Leaf wetness, frost', sub: 'disease, protect' }] },
      { label: 'Decide', edge: 'metrics', blocks: [{ name: 'Alert conditions', sub: 'spray/frost/disease' }, { name: 'Local log', sub: 'continuous' }] },
      { label: 'Report', edge: 'data + alerts', blocks: [{ name: 'LoRa/cellular', sub: 'from the field' }, { name: 'Dashboard', sub: 'hyperlocal' }] },
    ],
  },

  flow: [
    { t: 'Read all sensors (aspirate shield first)', k: 'proc' },
    { t: 'Accumulate rain tips, wind pulses, min/max T', k: 'proc' },
    { t: 'Compute GDD, ET, leaf wetness, frost risk', k: 'proc' },
    { t: 'Frost / high wind / disease condition?', k: 'dec', yes: 'alert', no: 'normal', back: 0 },
    { t: 'Log locally', k: 'io' },
    { t: 'Reporting interval reached?', k: 'dec', yes: 'transmit', no: 'wait', back: 0 },
    { t: 'Transmit over LoRa/cellular', k: 'io' },
    { t: 'Low-power wait to next reading', k: 'end' },
  ],

  principle: [
    'The foundational principle is that <b>weather measurement is a discipline with standards, and ignoring them produces data worse than useless</b>. The World Meteorological Organization defines how each variable must be measured — sensor type, height, exposure, shielding — precisely because the measurement is so easily corrupted. The most important is temperature: a thermometer in sunlight absorbs solar radiation and reads its own heated body, not the air, giving errors of several degrees. The standard solution is a <b>radiation shield</b> (white, to reflect sunlight; louvred or multi-plate, to admit air while blocking radiation) with <b>aspiration</b> (a fan drawing air through, so the sensor equilibrates with the moving air, not the shield). This project uses an aspirated shield because without it, the temperature — and everything derived from it — is wrong.',
    'Each variable has its own siting logic. <b>Rainfall</b> uses a tipping-bucket gauge — a funnel feeds a small seesaw bucket that tips and triggers a switch each time it fills with a fixed small volume (e.g. 0.2 mm), so counting tips gives rainfall. It must be level, away from obstructions that would block or funnel rain, and calibrated (the actual millimetres per tip drifts and must be verified). <b>Wind</b> uses a cup anemometer (rotation rate proportional to wind speed) and a vane (a potentiometer giving direction), sited high and clear of turbulence — turbulence from a nearby building or the mast itself corrupts both speed and direction. <b>Solar radiation</b> is measured level and unshielded, facing the sky — the exact opposite of the temperature sensor.',
    'The <b>derived agricultural metrics</b> are where a farm weather station earns its keep over a generic forecast, because these quantities directly inform decisions and are highly local. <b>Growing degree days</b> (GDD) accumulate the daily temperature above a crop-specific base — crops and pests develop according to accumulated heat, not calendar days, so GDD predicts growth stages, harvest timing and pest emergence far better than the date. <b>Evapotranspiration</b> (as in the drip project) drives irrigation demand. <b>Leaf wetness duration</b> and the temperature/humidity combination predict fungal disease risk — many disease models are functions of how long leaves stay wet at what temperature. <b>Chill hours</b> (hours below a threshold) determine when fruit trees break dormancy. <b>Frost risk</b> — especially the radiative frost that settles in valley bottoms on clear calm nights — triggers protection.',
    'The reason these must be <b>local</b> is that they depend on conditions that vary enormously over short distances. A frost pocket in a valley bottom can be several degrees colder than the slope above it on a still clear night — the forecast for the region gives no clue which is which, but a station in the pocket does. Rainfall from a summer thunderstorm can vary from nothing to a downpour within a kilometre. GDD accumulation differs between a warm south-facing slope and a cool north-facing one. The whole value proposition is measuring the actual field, not interpolating from a distant station.',
    'The station is engineered for <b>unattended field operation</b>: solar-powered (with the aspiration fan being the notable continuous load to budget for), reporting over LoRa or cellular because fields lack Wi-Fi, ruggedly sealed against months of weather, and logging locally so a communication gap does not lose data. It samples frequently enough to catch the extremes that matter (a brief frost, a gust, a downpour) while managing power.',
    'Finally, the station\'s job is to turn conditions into <b>decisions</b>. A high-wind alert says "do not spray now" (drift risk). A frost alert says "protect tonight". A disease-favouring-conditions alert says "consider a preventive fungicide". A GDD milestone says "the pest is about to emerge, scout now". These operationally-tied alerts, from local data, are the difference between a weather station and a farm weather station.',
  ],

  equations: [
    { t: 'Growing degree days', eq: 'Daily GDD = max(0, (Tmax + Tmin)/2 − T_base)\n\nT_base is crop-specific (e.g. 10 °C for maize).\nUpper cap sometimes applied (max Tmax at ~30 °C).\n\nAccumulate: GDD_total = Σ daily GDD from planting.\n\nDevelopment milestones occur at characteristic GDD:\n  maize silking ~ 1400 GDD, maturity ~ 2700 GDD.\nPest emergence also tracks GDD — a far better predictor\nthan calendar date.\n\nExample: Tmax 28, Tmin 14, T_base 10:\n  GDD = (28+14)/2 − 10 = 11 GDD that day.' },
    { t: 'Wind speed from anemometer pulses', eq: 'Cup anemometer: rotation rate ∝ wind speed.\n\n  wind (m/s) = pulses_per_second × K\n\nK is the anemometer constant (from its datasheet or\ncalibration), e.g. 2.4 km/h per Hz for a common model.\n\nGust = maximum over a short window (e.g. 3 s peak).\nSustained = average over a longer window (e.g. 10 min).\n\nWind vane: analogue voltage → direction via a lookup\ntable of the vane\'s resistance-to-heading mapping.' },
    { t: 'Frost risk and leaf wetness', eq: 'Radiative frost (clear, calm nights) — dew point matters:\n  dew point Td from T and RH (Magnus formula)\n  frost likely if T falling toward Td and Td < 0 °C\n  and wind low and sky clear (low incoming radiation)\n\nLeaf wetness proxy (many disease models use this):\n  leaf wet when RH > ~90% or after rain, until it dries.\n  duration of wetness × temperature drives infection risk\n  (e.g. apple scab, downy mildew models).\n\nAlert when accumulated wet-hours at favourable\ntemperature exceed a crop-specific disease threshold.' },
  ],

  code: [{
    file: 'farm-weather-station.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Farm Weather Station — ESP32, correctly-sited, solar, LoRa

   Measures weather with properly shielded/sited sensors and computes
   the derived agricultural metrics (GDD, ET, leaf wetness, frost)
   that generic forecasts do not provide.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <Adafruit_BME280.h>
#include <BH1750.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <time.h>
#include <math.h>

#define PIN_RAIN  27
#define PIN_WIND  26
#define PIN_VANE  34
#define PIN_FAN   14
#define LORA_CS    5
#define LORA_RST  25
#define LORA_DIO0 26

#define RAIN_MM_PER_TIP 0.2f
#define WIND_K          2.4f      // km/h per Hz — CALIBRATE for your anemometer
#define GDD_BASE       10.0f      // crop base temperature

Adafruit_BME280 bme;
BH1750          lux;
Preferences     prefs;

volatile uint32_t rainTips = 0, windPulses = 0;
float tempC, rh, pressure, radiation;
float tMinDay = 99, tMaxDay = -99;
float gddTotal = 0, wetHours = 0;
int   lastDay = -1;

void IRAM_ATTR rainISR() { rainTips++; }
void IRAM_ATTR windISR() { windPulses++; }

/* ── derived metrics ────────────────────────────────────────── */
float dewPoint(float t, float relh) {
  float a = 17.27f, b = 237.7f;
  float g = (a * t) / (b + t) + logf(relh / 100.0f);
  return (b * g) / (a - g);
}

float windSpeedKmh() {
  static uint32_t lastWind = 0, lastPulses = 0;
  uint32_t now = millis();
  float dt = (now - lastWind) / 1000.0f;
  if (dt < 1) return 0;
  float hz = (windPulses - lastPulses) / dt;
  lastWind = now; lastPulses = windPulses;
  return hz * WIND_K;
}

int windDirection() {
  // Vane potentiometer → 16-point compass via a lookup of its levels.
  int adc = analogRead(PIN_VANE);
  return (int)(adc / 4095.0f * 360.0f);   // simplified; use the vane's real map
}

bool frostRisk() {
  float td = dewPoint(tempC, rh);
  return tempC < 3.0f && td < 0.5f && windSpeedKmh() < 5.0f;   // radiative frost
}

bool diseaseFavourable() {
  bool wet = rh > 90.0f;
  bool warm = tempC > 12.0f && tempC < 25.0f;   // many fungal optima
  return wet && warm;
}

/* ── daily rollover ─────────────────────────────────────────── */
void endOfDay() {
  float gdd = fmaxf(0, (tMaxDay + tMinDay) / 2.0f - GDD_BASE);
  gddTotal += gdd;
  prefs.putFloat("gdd", gddTotal);
  Serial.printf("Daily GDD %.1f (total %.0f), rain %.1f mm\\n",
                gdd, gddTotal, rainTips * RAIN_MM_PER_TIP);
  tMinDay = 99; tMaxDay = -99;
  rainTips = 0; wetHours = 0;
}

/* ── LoRa ───────────────────────────────────────────────────── */
void transmit() {
  bool frost = frostRisk(), disease = diseaseFavourable();
  float wind = windSpeedKmh();
  LoRa.beginPacket();
  LoRa.printf("{\\"t\\":%.1f,\\"rh\\":%.0f,\\"p\\":%.0f,\\"rad\\":%.0f,"
              "\\"rain_mm\\":%.1f,\\"wind\\":%.1f,\\"dir\\":%d,"
              "\\"gdd\\":%.0f,\\"frost\\":%d,\\"disease\\":%d}",
              tempC, rh, pressure, radiation, rainTips * RAIN_MM_PER_TIP,
              wind, windDirection(), gddTotal, frost, disease);
  LoRa.endPacket();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_RAIN, INPUT_PULLUP);
  pinMode(PIN_WIND, INPUT_PULLUP);
  pinMode(PIN_FAN, OUTPUT);
  attachInterrupt(PIN_RAIN, rainISR, FALLING);
  attachInterrupt(PIN_WIND, windISR, FALLING);
  analogSetPinAttenuation(PIN_VANE, ADC_11db);

  Wire.begin(21, 22);
  bme.begin(0x76);
  lux.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6);
  LoRa.setSpreadingFactor(10);

  prefs.begin("wx", false);
  gddTotal = prefs.getFloat("gdd", 0);
  lastDay = prefs.getInt("day", -1);
  configTime(19800, 0, "pool.ntp.org");
  Serial.println("Farm weather station running");
}

void loop() {
  // Aspirate the shield before reading temperature.
  digitalWrite(PIN_FAN, HIGH);
  delay(20000);                             // ventilate 20 s (or run continuously)

  tempC     = bme.readTemperature();
  rh        = bme.readHumidity();
  pressure  = bme.readPressure() / 100.0f;
  radiation = lux.readLightLevel() * 0.0079f;   // lux → W/m² approx (site-cal)
  digitalWrite(PIN_FAN, LOW);

  tMinDay = fminf(tMinDay, tempC);
  tMaxDay = fmaxf(tMaxDay, tempC);
  if (rh > 90) wetHours += 1.0f / 6.0f;     // 10-min sample → hours

  time_t now = time(nullptr); struct tm tmv; localtime_r(&now, &tmv);
  if (tmv.tm_yday != lastDay) {
    lastDay = tmv.tm_yday; prefs.putInt("day", lastDay);
    endOfDay();
  }

  Serial.printf("T %.1f RH %.0f%% P %.0f rad %.0f wind %.1f rain %.1f%s%s\\n",
                tempC, rh, pressure, radiation, windSpeedKmh(),
                rainTips * RAIN_MM_PER_TIP,
                frostRisk() ? " [FROST]" : "", diseaseFavourable() ? " [DISEASE]" : "");

  transmit();
  delay(600000 - 20000);                    // 10-min interval (minus fan time)
}`,
    explain: [
      { ref: 'Aspirate the shield before reading temperature', txt: 'The fan ventilates the radiation shield so the sensor reads the moving air, not the sun-warmed shield. This is the single most important line for accuracy — an unaspirated temperature reading is several degrees high in sun, and every derived metric inherits that error.' },
      { ref: 'Rain and wind counted in interrupts', txt: 'A tipping-bucket gauge and a cup anemometer both output pulses (a tip per fixed rainfall, a pulse per rotation). Counting them in interrupts ensures no tip or rotation is missed, which matters during heavy rain or high wind when the pulse rate is high.' },
      { ref: 'frostRisk() — radiative frost logic', txt: 'The dangerous frost for many crops is radiative frost on clear, calm nights, when the ground radiates heat to a clear sky and cold air pools in low spots. The logic checks for low temperature approaching a sub-zero dew point with low wind — the conditions that produce it — which a regional forecast often misses in a frost pocket.' },
      { ref: 'diseaseFavourable() from wetness and temperature', txt: 'Many fungal diseases need prolonged leaf wetness at a favourable temperature. Flagging high humidity in the fungal temperature optimum is a simple disease-condition alert; a fuller version implements a specific crop\'s disease model from accumulated wet-hours.' },
      { ref: 'GDD accumulated daily', txt: 'Growing degree days accumulate the daily mean temperature above the crop base. Crops and pests develop by accumulated heat, not calendar days, so GDD predicts development stages and pest emergence — a genuinely useful local metric a forecast does not provide.' },
      { ref: 'WIND_K commented CALIBRATE', txt: 'The anemometer constant relating pulse rate to wind speed varies by model and must be calibrated or taken from the datasheet. A wrong constant makes every wind speed wrong, which directly affects spray-timing decisions.' },
      { ref: 'Local logging + LoRa transmit', txt: 'The station logs locally (via the persisted GDD and a fuller log) so a communication gap does not lose data, and transmits over LoRa because fields lack Wi-Fi. The 10-minute interval catches meaningful variation while managing solar power.' },
    ],
  }],

  config: [
    'Site every sensor correctly — this is the whole project. Temperature in an aspirated shield at standard height; rain gauge level and clear of obstructions; anemometer high and clear of turbulence; radiation sensor level and unshielded.',
    'Calibrate the rain gauge (mm per tip) against a measured volume and the anemometer constant (K) against a known wind or its datasheet.',
    'Set the GDD base temperature for your crop, and configure the frost and disease thresholds for your situation.',
    'Set the reporting interval and reporting technology (LoRa or cellular) for your field\'s connectivity, and size the solar system for the aspiration fan load.',
    'Calibrate the lux-to-radiation conversion, or fit a proper pyranometer if solar radiation accuracy matters for ET.',
  ],

  calibration: [
    { h: 'Verify the shield and aspiration', p: ['Compare the shielded, aspirated temperature against a reference in shade — they should agree. Then compare against an unshielded sensor in sun to see the several-degree error the shield prevents. This confirms the most important part of the station works.'] },
    { h: 'Calibrate the rain gauge', p: ['Pour a measured volume slowly into the funnel and count the tips. Compute the actual mm per tip and compare with the nominal. Repeat to check consistency — the tipping mechanism can drift.'] },
    { h: 'Calibrate wind', p: ['Compare against a handheld anemometer in steady wind, or use the datasheet K constant. Verify the vane direction against a compass at known headings.'] },
    { h: 'Cross-check against a reference station', p: ['Compare a day of data against the nearest official station, understanding that legitimate local differences (your frost pocket, your rainfall) are expected. Gross disagreement in a variable points to a siting or calibration problem.'] },
  ],

  iot: {
    protoShort: 'LoRa or cellular',
    net: {
      nodes: [{ name: 'Weather station', sub: 'on the field' }],
      protocol: 'LoRa / cellular', gateway: 'Farm gateway', gatewaySub: 'or direct cellular',
      uplink: 'LoRa 433/868 or LTE', cloud: 'Broker + Grafana', cloudSub: 'hyperlocal record',
      clients: [{ name: 'Weather dashboard', sub: 'the field' }, { name: 'Decision alerts', sub: 'spray/frost' }],
    },
    dashboard: [
      'The value is a continuous local record and derived metrics no forecast provides: your field\'s GDD accumulation, rainfall, frost events and disease-condition hours. Compare against the regional forecast over a season and the local differences — the frost the forecast missed, the rain it over- or under-called — justify the station immediately.',
    ],
    security: [
      'Weather data is low-sensitivity, but authenticate the uplink so alerts (frost, spray conditions) cannot be spoofed into wrong decisions.',
      'Keep the local log and alerting independent of the network — a frost alert must not depend on connectivity.',
    ],
  },

  testing: [
    { step: 'Compare shielded/aspirated temperature to a reference in sun', expect: 'Close agreement — far better than an unshielded sensor, confirming the shield works.' },
    { step: 'Pour a measured volume into the rain gauge', expect: 'The tip count matches the expected rainfall after calibration.' },
    { step: 'Spin the anemometer at a known rate', expect: 'The computed wind speed matches; verify against a handheld anemometer in real wind.' },
    { step: 'Check the wind vane at known headings', expect: 'The reported direction matches a compass.' },
    { step: 'Accumulate GDD over a few days', expect: 'Plausible daily and total GDD for your temperatures and crop base.' },
    { step: 'Create frost conditions (cool, calm, dry)', expect: 'The frost alert fires — especially valuable if your site is a frost pocket.' },
    { step: 'Create disease-favouring conditions (warm, humid)', expect: 'The disease-condition alert fires.' },
    { step: 'Run on solar for several days', expect: 'The battery holds through cloudy periods with the aspiration fan budgeted for.' },
  ],

  troubleshoot: [
    {
      sym: 'Temperature reads too high',
      cause: 'Inadequate shielding or aspiration — the sensor reads the sun.',
      fix: 'This is the most common and most damaging error. Use a proper radiation shield WITH aspiration. An unshielded or unventilated sensor in a greenhouse or in the field reads its own solar heating, several degrees high, corrupting every derived metric. This is non-negotiable.',
    },
    {
      sym: 'Rainfall reads wrong',
      cause: 'Uncalibrated mm-per-tip, un-level gauge, or obstructions.',
      fix: 'Calibrate against a measured volume. Level the gauge. Site it away from overhanging obstructions that block or funnel rain. Check the tipping mechanism moves freely and is not blocked by debris.',
    },
    {
      sym: 'Wind readings are erratic or too low',
      cause: 'Turbulence from nearby structures, or wrong anemometer constant.',
      fix: 'Site the anemometer high and clear of the mast, buildings and trees that create turbulence and block wind. Calibrate the K constant. The standard 10 m height exists precisely to get above local turbulence.',
    },
    {
      sym: 'Data differs from the regional forecast',
      cause: 'Often legitimate — weather is local.',
      fix: 'This is frequently the point, not a fault. Your frost pocket really is colder; your field really did get more rain. Legitimate local differences are the value proposition. Only investigate if a variable grossly disagrees in a way that indicates a siting or calibration error rather than real local weather.',
    },
    {
      sym: 'Battery drains despite solar',
      cause: 'The aspiration fan running continuously, or the panel undersized.',
      fix: 'The aspiration fan is a notable continuous load. Run it in bursts before temperature readings rather than continuously if power is tight, or size the solar system to support it. Budget for the fan plus periodic transmissions with cloudy-day margin.',
    },
  ],

  perf: [
    'Sample frequently enough to catch the extremes that matter — a brief frost, a gust, a downpour — while managing solar power; 5–10 minute intervals are typical.',
    'Run the aspiration fan in bursts before temperature readings if power is tight, rather than continuously.',
    'Count rain and wind pulses in interrupts so none are missed during heavy rain or high wind.',
  ],

  safety: [
    'Site sensors per meteorological standards — incorrectly-sited data is worse than useless and can drive wrong decisions (spraying in unsafe wind, missing a frost).',
    'A tall mast is a lightning risk in an open field — ground it properly and follow local guidance.',
    'Alerts drive real operations (spray, frost protection); ensure they are reliable and keep the alerting independent of the network.',
    'Follow safe practice around any operations the station informs, especially agrochemical spraying.',
  ],

  future: [
    'Add <b>a proper pyranometer</b> for accurate solar radiation, improving the ET estimate.',
    'Add <b>soil sensors</b> (temperature, moisture) for a complete crop-environment picture combined with the drip and NPK projects.',
    'Add <b>specific disease models</b> (apple scab, downy mildew, etc.) computed from the local wetness and temperature record.',
    'Add <b>a network of stations</b> across a large or varied farm to map the local weather differences (frost pockets, rainfall gradients).',
    'Add <b>forecast blending</b> — combining the local measurements with a regional forecast for a corrected hyperlocal outlook.',
  ],

  faq: [
    { q: 'Why not just use a weather forecast?', a: 'Because weather is intensely local and a forecast is regional. The forecast is for a town or airport that may be tens of kilometres away and at a different elevation. A frost that settles in your valley bottom spares the slope above and is invisible to the regional forecast; summer rainfall varies from nothing to a downpour within a kilometre; wind on your exposed ridge bears no relation to the sheltered valley station. For decisions that depend on the actual conditions on your field — when to spray, whether it will frost tonight — measuring your field beats interpolating from a distant station.' },
    { q: 'What is the single most important thing to get right?', a: 'The temperature shielding. A thermometer in sunlight reads its own solar-heated body, not the air, and can be several degrees high. Since temperature feeds every derived metric — GDD, ET, frost, disease — an unshielded sensor makes the whole station wrong. A proper white radiation shield with aspiration (a fan drawing air through it) is non-negotiable. Get this wrong and your data is worse than the airport\'s, because at least the airport shields its sensors properly.' },
    { q: 'What are growing degree days and why do they matter?', a: 'They are the accumulated daily temperature above a crop-specific base — a measure of accumulated heat rather than elapsed time. Crops and pests develop according to how much warmth they have received, not the calendar, so GDD predicts growth stages, harvest timing and — importantly — pest emergence far better than the date. A pest that emerges at a characteristic GDD can be scouted for at exactly the right time, and GDD is highly local (a warm south-facing slope accumulates faster than a cool north-facing one), so a local station gives you the number that actually applies to your field.' },
    { q: 'How is this different from a hobby weather station?', a: 'Correct siting and the agricultural metrics. A hobby station stuck on a wall in the sun gives pretty numbers that are meteorologically wrong. This project treats siting as the discipline it is — aspirated shield, correct heights, clear exposure — so the data is actually valid, and then computes the derived metrics (GDD, ET, leaf wetness, frost risk, chill hours) that inform farm decisions. The difference is between a gadget and an instrument.' },
    { q: 'Do the local readings really differ from the forecast that much?', a: 'For the variables that matter to farming, often dramatically. Frost is the clearest case: on a clear calm night, cold air pools in low spots, and a frost pocket can be several degrees below the surrounding land and below what the regional forecast predicts — the difference between a killed crop and an untouched one. Rainfall from convective storms varies enormously over short distances. Wind on an exposed site far exceeds the sheltered forecast station. These are not measurement errors; they are real local weather that only a local station captures.' },
    { q: 'Why does it need to run on solar and LoRa?', a: 'Because it lives in a field, which has neither mains power nor Wi-Fi. Solar with a battery makes it self-powered indefinitely; LoRa (or cellular) reports its data kilometres to the farm on very little power. This unattended, infrastructure-free operation is what lets you site the station where the weather actually matters — in the crop, in the frost pocket — rather than only where you can run a cable. The aspiration fan is the notable power load to budget for, but a modest solar panel handles it.' },
  ],

  refs: [
    { t: 'WMO Guide to Instruments and Methods of Observation (WMO-No. 8)', u: 'https://community.wmo.int/en/activity-areas/imop/wmo-no_8', s: 'World Meteorological Organization' },
    { t: 'McMaster & Wilhelm, "Growing degree-days: one equation, two interpretations"', u: 'https://doi.org/10.1016/S0168-1923(97)00027-0', s: 'Agricultural and Forest Meteorology, 1997' },
    { t: 'FAO Irrigation and Drainage Paper 56 — evapotranspiration', u: 'https://www.fao.org/4/x0490e/x0490e00.htm', s: 'FAO' },
    { t: 'Snyder & de Melo-Abreu, "Frost Protection: fundamentals, practice and economics"', u: 'https://www.fao.org/4/y7223e/y7223e00.htm', s: 'FAO' },
    { t: 'BME280 environmental sensor — datasheet', u: 'https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf', s: 'Bosch Sensortec' },
    { t: 'NOAA — siting standards for weather instruments', u: 'https://www.weather.gov/coop/standard', s: 'NOAA / US National Weather Service' },
  ],

  images: ['sensor', 'esp32', 'farm'],
  imageCaptions: [
    'A sensor module. Correct siting and shielding — an aspirated radiation shield for temperature — is what separates valid weather data from confident nonsense.',
    'An ESP32 development board reading the sensors, computing the agricultural metrics, and reporting from a field over LoRa.',
    'Farmland. A station on your actual field measures the frost pocket and the local rainfall that a regional forecast cannot.',
  ],
},

];
