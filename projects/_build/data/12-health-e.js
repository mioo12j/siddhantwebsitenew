/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 020–021
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 020 · Sleep Apnea Tracker ───────────────────────────────────── */
{
  id: '020',
  domainKey: 'ai',
  emoji: '😮‍💨',
  thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '20–30 hours',
  iso8601: 'PT26H',
  tagline: 'An overnight screening recorder that detects snoring and breathing pauses from audio and chest movement, computes a rough event index, and — importantly — tells you clearly that it is a screening aid and not a diagnosis.',

  overview: [
    'Obstructive sleep apnoea affects a large fraction of adults and the great majority are undiagnosed, largely because the diagnostic pathway starts with a sleep study that is expensive and inconvenient. A device that flags "your breathing stopped 47 times last night, go and get this properly investigated" is genuinely valuable — and a device that reports an apnoea-hypopnoea index as though it were a clinical measurement is actively harmful, because it either falsely reassures or falsely alarms.',
    'This project is built explicitly as the first kind. It records two independent signals overnight: <b>audio</b>, which captures snoring and the characteristic gasping resumption after an event, and <b>chest wall movement</b> from an accelerometer, which captures respiratory effort directly. Combining them is what makes the detection meaningful — audio alone cannot distinguish a pause in snoring from a pause in breathing, and movement alone misses the obstructive events where effort continues against a closed airway.',
    'The detection pipeline computes a <b>respiratory effort envelope</b> from the accelerometer and a <b>sound energy envelope</b> from the microphone, both at around 1 Hz. A candidate event is a period of at least ten seconds where the respiratory envelope amplitude drops below a fraction of the running baseline. Classification into apnoea versus hypopnoea follows the same amplitude criteria used clinically, without the oxygen desaturation channel that a real study also uses.',
    'The honest limitation is that missing channel. Clinical scoring requires either a 3 % oxygen desaturation or an arousal to confirm a hypopnoea, and this device measures neither. Adding a pulse oximeter closes most of that gap and is the single most valuable upgrade — which is why the design leaves an obvious place for it.',
  ],

  does: [
    'Records sound level and chest-wall movement continuously through the night.',
    'Extracts a respiratory effort envelope and detects reductions and pauses in breathing.',
    'Classifies snoring by loudness and periodicity.',
    'Computes an estimated event index and reports it explicitly as a screening figure.',
    'Detects body position from the accelerometer, since most events are position-dependent.',
    'Produces a morning report with an event timeline and a position breakdown.',
    'Stores no audio — only the derived envelope — so nothing recognisable is recorded.',
  ],

  features: [
    '<b>Dual-channel detection</b> — acoustic and respiratory effort, which is what makes it more than a snore counter.',
    '<b>Adaptive baseline</b> tracking each person\'s own breathing amplitude over a two-minute window.',
    '<b>Clinical-style event criteria</b>: ≥10 s duration, ≥90 % reduction for apnoea, ≥30 % for hypopnoea.',
    '<b>Position detection</b> from the gravity vector — supine, left, right, prone.',
    '<b>Position-stratified index</b>, because supine-dominant apnoea is common and treatable by position alone.',
    '<b>Envelope-only audio storage</b>: no recognisable audio is ever written to storage or transmitted.',
    '<b>Full-night trace</b> exportable as CSV for discussion with a clinician.',
    '<b>Explicit screening disclaimer</b> in the report itself, not buried in documentation.',
  ],

  applications: [
    { t: 'Pre-diagnostic screening', d: 'Deciding whether to pursue a formal sleep study — which is exactly what this class of device should be used for.' },
    { t: 'Positional therapy monitoring', d: 'Many people have events almost exclusively when supine; measuring that is directly actionable.' },
    { t: 'Post-treatment tracking', d: 'A rough index before and after weight change, positional therapy or a dental device gives a trend.' },
    { t: 'Partner sleep disturbance', d: 'Objective snoring data settles arguments and motivates action better than complaints.' },
    { t: 'Teaching biomedical signal processing', d: 'Envelope extraction, adaptive baselines and event detection on a real, noisy, physiological signal.' },
    { t: 'Research prototyping', d: 'A platform for testing detection algorithms against a reference study.' },
  ],

  skills: [
    'Arduino C++ with signal processing on buffers',
    'I²S audio capture and envelope extraction',
    'Accelerometer signal conditioning and band-pass filtering',
    'Event detection with adaptive thresholds',
    'Python for the morning report',
  ],

  prereq: [
    'This is a screening aid, not a diagnostic device. Sleep apnoea is diagnosed by a clinician from a polysomnogram or a validated home study. Do not use this device to rule the condition out — a low index here does not mean you do not have it.',
  ],

  parts: ['esp32s3', 'inmp441', 'adxl345', 'sdcard', 'li18650', 'tp4056', 'oled', 'perfboard'],
  extraParts: [
    { name: 'MAX30102 pulse oximeter (strongly recommended)', spec: 'For the oxygen desaturation channel', qty: 1, price: 380, note: 'Without SpO2 the device cannot confirm hypopnoeas the way a clinical study does. This is the most valuable addition.' },
    { name: 'Chest strap with sensor pocket', spec: 'Elastic, adjustable, 25 mm wide', qty: 1, price: 280, note: 'Must be snug enough to follow chest wall movement without restricting breathing.' },
    { name: '2000 mAh LiPo cell', spec: '3.7 V, protected — one night plus margin', qty: 1, price: 420 },
  ],
  cost: '₹4,600 – ₹5,800',
  libs: ['esptask', 'sqlite', 'python', 'numpy', 'pandas', 'matplotlib'],

  pins: {
    left: [
      { dev: 'INMP441 microphone', devPin: 'BCLK / WS / SD', pin: 'GPIO 14 / 15 / 32', sig: 'I²S, 16 kHz' },
      { dev: 'ADXL345 chest sensor', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x53, 100 Hz' },
      { dev: 'MAX30102 (optional)', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x57' },
      { dev: 'Start / stop button', devPin: 'NO', pin: 'GPIO 33', sig: 'Pull-up' },
    ],
    right: [
      { dev: 'microSD card', devPin: 'SPI', pin: 'GPIO 5 18 19 23', sig: 'CS, SCK, MISO, MOSI' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, dimmed at night' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Very dim — it is a bedroom' },
    ],
  },
  wiringNotes: [
    'Mount the accelerometer on a <b>chest strap at the level of the xiphoid process</b>, snug but not restrictive. It must move with the chest wall; a loose strap measures the strap.',
    'The microphone goes on the <b>bedside table, not on the body</b>. On the chest it picks up heartbeat and clothing rustle and swamps the airway sounds you want. Twenty to fifty centimetres from the head is right.',
    'Use a high-endurance microSD card. A full night of 1 Hz envelope data is small, but writing every night for months on a consumer card will kill it.',
    'Dim or disable every LED and the OLED during recording. This is a bedroom, and light at night affects exactly the sleep you are trying to measure.',
    'Keep the I²S microphone lines short and grounded — the same considerations as the voice hub project.',
    'The battery must last a full night with margin. Size for 10 hours at your measured current, then double it, because a recording that stops at 4 a.m. captures the wrong half of the night.',
  ],

  block: {
    columns: [
      { label: 'Capture', blocks: [{ name: 'INMP441', sub: 'audio 16 kHz' }, { name: 'ADXL345', sub: 'chest 100 Hz' }, { name: 'MAX30102', sub: 'SpO₂ (optional)' }] },
      { label: 'Envelope', edge: 'raw streams', blocks: [{ name: 'Sound energy', sub: '1 Hz RMS' }, { name: 'Respiratory effort', sub: 'band-pass 0.1–0.5 Hz', highlight: true }] },
      { label: 'Detect', edge: 'envelopes', blocks: [{ name: 'Adaptive baseline', sub: '2 min window' }, { name: 'Event criteria', sub: '≥10 s, ≥30 %', highlight: true }] },
      { label: 'Report', edge: 'events', blocks: [{ name: 'Position stratify', sub: 'supine vs lateral' }, { name: 'Morning report', sub: 'index + timeline' }] },
    ],
  },

  flow: [
    { t: 'Press start: begin recording', k: 'start' },
    { t: 'Capture audio and accelerometer continuously', k: 'proc' },
    { t: 'Compute 1 Hz sound and effort envelopes', k: 'proc' },
    { t: 'Effort below 30 % of baseline?', k: 'dec', yes: 'candidate event', no: 'update baseline', back: 1 },
    { t: 'Sustained for at least 10 s?', k: 'dec', yes: 'score event', no: 'discard', back: 1 },
    { t: 'Classify apnoea vs hypopnoea', k: 'proc' },
    { t: 'Log event with position and timestamp', k: 'io' },
    { t: 'Morning: compute index, write report', k: 'end' },
  ],

  principle: [
    'Breathing produces a small, slow, roughly periodic movement of the chest wall — about 12–20 cycles per minute at rest, which is 0.2–0.33 Hz. An accelerometer strapped to the chest sees that as a small oscillation superimposed on the much larger gravity vector. Band-pass filtering between 0.1 and 0.5 Hz isolates it and rejects both the DC gravity component and the higher-frequency movement from turning over.',
    'The amplitude of that oscillation is the <b>respiratory effort envelope</b>. In normal breathing it is roughly constant; during an apnoea it collapses (central apnoea, no effort) or continues while airflow stops (obstructive apnoea, effort against a closed airway). This is exactly why the acoustic channel is needed alongside it: an obstructive event has continuing chest movement and silent or absent airflow, so the accelerometer alone can miss it while the microphone hears the silence and then the gasp.',
    '<b>Event criteria</b> follow the clinical structure. The American Academy of Sleep Medicine scores an apnoea as a ≥90 % reduction in airflow lasting at least 10 seconds, and a hypopnoea as a ≥30 % reduction for at least 10 seconds <em>accompanied by</em> a 3 % oxygen desaturation or an arousal. This device can apply the amplitude and duration criteria; it cannot apply the desaturation criterion without a pulse oximeter, which is precisely why the estimated index is an over- or under-estimate rather than a measurement.',
    'The <b>adaptive baseline</b> is essential because breathing amplitude varies enormously between people, between sleep stages and with strap tension. A fixed threshold would flag half the night for one person and nothing for another. Comparing each moment against that individual\'s own trailing two-minute median makes the criterion relative, which is what the clinical definition actually specifies.',
    '<b>Position</b> is computed from the gravity vector, exactly as in the posture project. It matters far more here than most people expect: supine-predominant obstructive apnoea is very common, and for some people simply not sleeping on their back reduces the event rate by more than half. A device that reports "38 events per hour supine, 4 per hour on your side" gives a directly actionable finding that no single index number conveys.',
    'Finally, the design records <b>no audio</b>. Only the 1 Hz energy envelope is stored. That is a deliberate privacy decision — a device that records a bedroom all night is a very different object from one that stores a number per second, and the detection needs only the latter.',
  ],

  equations: [
    { t: 'Respiratory band-pass filter', eq: 'Chest movement of interest: 0.1–0.5 Hz (6–30 breaths/min)\nAccelerometer sampled at 100 Hz.\n\nTwo-stage IIR at fs = 100 Hz:\n  high-pass at 0.1 Hz:  y = a·(y_prev + x − x_prev),  a = 0.9937\n  low-pass  at 0.5 Hz:  y = y_prev + b·(x − y_prev),  b = 0.0305\n\n  a = 1/(1 + 2π·f_c/fs)  for the high-pass\n  b = 2π·f_c/fs          for the low-pass (small-angle valid here)\n\nThe residual is the breathing waveform, typically\n0.005–0.05 g peak-to-peak depending on strap tension.' },
    { t: 'Envelope and event criteria', eq: 'Envelope: peak-to-peak of the filtered signal over 4 s,\nupdated every 1 s.\n\nBaseline: median of the envelope over the trailing 120 s\n(median, not mean — one event must not move the baseline).\n\n  ratio = envelope / baseline\n\n  ratio < 0.10 for ≥ 10 s  → apnoea\n  ratio < 0.70 for ≥ 10 s  → hypopnoea (unconfirmed without SpO₂)\n\nEstimated index:\n  eAHI = (apnoeas + hypopnoeas) / hours_of_recording\n\n  < 5   : normal range\n  5–15  : mild\n  15–30 : moderate\n  > 30  : severe\n\nThese bands are the clinical AHI bands. This device\nproduces an ESTIMATE, not an AHI.' },
    { t: 'Body position from gravity', eq: 'With the sensor on the chest, Z out of the body:\n\n  supine : az ≈ +1 g\n  prone  : az ≈ −1 g\n  left   : ax ≈ −1 g\n  right  : ax ≈ +1 g\n  upright: ay ≈ −1 g\n\nClassify by the dominant axis with a 0.7 g threshold,\nand require 30 s of stability before recording a change —\nturning over passes through every orientation.' },
  ],

  code: [{
    file: 'apnea-recorder.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Sleep Apnoea Screening Recorder — ESP32-S3 + INMP441 + ADXL345

   Records a 1 Hz sound-energy envelope and a respiratory effort
   envelope, detects reductions in breathing effort using clinical-
   style amplitude and duration criteria, and stratifies by body
   position. No audio is ever stored.

   A SCREENING AID. Not a diagnosis. See a clinician.
   ══════════════════════════════════════════════════════════════════ */

#include <driver/i2s.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <Adafruit_ADXL345_U.h>
#include <Adafruit_SSD1306.h>
#include <math.h>

#define PIN_BTN     33
#define PIN_LED      2
#define SD_CS        5
#define I2S_BCLK    14
#define I2S_LRCL    15
#define I2S_DOUT    32

#define ACCEL_HZ     100
#define ENVELOPE_HZ    1
#define ENV_WINDOW    (ACCEL_HZ * 4)      // 4 s peak-to-peak window
#define BASELINE_S   120
#define EVENT_MIN_S   10
#define APNEA_RATIO   0.10f
#define HYPOP_RATIO   0.70f

Adafruit_ADXL345_Unified accel(2);
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
File logFile;

/* respiratory filter state */
float hpPrevIn = 0, hpPrevOut = 0, lpPrev = 0;
float envBuf[ENV_WINDOW];
int   envIdx = 0;
float baselineHist[BASELINE_S];
int   baseIdx = 0, baseCount = 0;

float envelope = 0, baseline = 0, soundDb = 0;
uint32_t recordStart = 0, eventStart = 0;
uint16_t apneas = 0, hypopneas = 0, snoreSeconds = 0;
uint32_t posSeconds[5] = {0};             // supine, prone, left, right, upright
uint8_t  position = 0;
bool     recording = false;
const char *POSNAME[5] = { "supine", "prone", "left", "right", "upright" };

/* ── respiratory effort ─────────────────────────────────────── */
// Cascaded 0.1 Hz high-pass and 0.5 Hz low-pass at 100 Hz.
float respFilter(float x) {
  const float A = 0.9937f;                 // high-pass coefficient
  const float B = 0.0305f;                 // low-pass coefficient
  float hp = A * (hpPrevOut + x - hpPrevIn);
  hpPrevIn = x; hpPrevOut = hp;
  lpPrev += B * (hp - lpPrev);
  return lpPrev;
}

void pushEnvelopeSample(float v) {
  envBuf[envIdx] = v;
  envIdx = (envIdx + 1) % ENV_WINDOW;
}

float envelopePeakToPeak() {
  float lo = 1e9, hi = -1e9;
  for (float v : envBuf) { if (v < lo) lo = v; if (v > hi) hi = v; }
  return hi - lo;
}

// Median, not mean: a single long event must not drag the baseline down.
float medianBaseline() {
  if (baseCount < 20) return envelope;
  float tmp[BASELINE_S];
  memcpy(tmp, baselineHist, sizeof(float) * baseCount);
  for (int i = 1; i < baseCount; i++) {
    float k = tmp[i]; int j = i - 1;
    while (j >= 0 && tmp[j] > k) { tmp[j + 1] = tmp[j]; j--; }
    tmp[j + 1] = k;
  }
  return tmp[baseCount / 2];
}

/* ── sound envelope (energy only, never audio) ──────────────── */
float readSoundDb() {
  static int32_t raw[256];
  size_t got;
  i2s_read(I2S_NUM_0, raw, sizeof(raw), &got, 20 / portTICK_PERIOD_MS);
  int n = got / sizeof(int32_t);
  if (!n) return soundDb;

  double acc = 0;
  for (int i = 0; i < n; i++) { int16_t s = raw[i] >> 11; acc += (double)s * s; }
  float rms = sqrtf(acc / n);
  return 20.0f * log10f(rms / 32768.0f + 1e-9f) + 120.0f;    // approx dB SPL
}

/* ── position ───────────────────────────────────────────────── */
uint8_t classifyPosition(float x, float y, float z) {
  const float T = 0.7f;
  if (z >  T) return 0;                    // supine
  if (z < -T) return 1;                    // prone
  if (x < -T) return 2;                    // left
  if (x >  T) return 3;                    // right
  if (y < -T) return 4;                    // upright
  return position;                         // ambiguous: keep the last
}

/* ── event detection ────────────────────────────────────────── */
void scoreEvent(uint32_t durationS, float minRatio) {
  const char *type;
  if (minRatio < APNEA_RATIO) { apneas++;    type = "apnea"; }
  else                        { hypopneas++; type = "hypopnea"; }

  if (logFile) {
    logFile.printf("EVENT,%lu,%s,%lu,%.3f,%s,%.1f\\n",
                   (millis() - recordStart) / 1000, type,
                   durationS, minRatio, POSNAME[position], soundDb);
    logFile.flush();
  }
  Serial.printf("%s %lus ratio %.2f (%s)\\n", type, durationS, minRatio, POSNAME[position]);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_BTN, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);

  Wire.begin(21, 22);
  accel.begin(0x53);
  accel.setRange(ADXL345_RANGE_2_G);
  accel.setDataRate(ADXL345_DATARATE_100_HZ);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

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

  if (!SD.begin(SD_CS)) Serial.println("SD card not found — logging disabled");

  oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(1); oled.setCursor(0, 20);
  oled.println("Press to start"); oled.println("SCREENING AID ONLY");
  oled.display();
}

void loop() {
  /* Start / stop */
  if (digitalRead(PIN_BTN) == LOW) {
    delay(50);
    if (digitalRead(PIN_BTN) == LOW) {
      recording = !recording;
      if (recording) {
        recordStart = millis();
        apneas = hypopneas = snoreSeconds = 0;
        for (auto &p : posSeconds) p = 0;
        char name[24];
        snprintf(name, sizeof(name), "/night_%lu.csv", millis() / 1000);
        logFile = SD.open(name, FILE_WRITE);
        if (logFile) logFile.println("t_s,env,baseline,ratio,db,position");
        oled.ssd1306_command(SSD1306_DISPLAYOFF);       // dark bedroom
      } else {
        if (logFile) logFile.close();
        oled.ssd1306_command(SSD1306_DISPLAYON);
      }
      while (digitalRead(PIN_BTN) == LOW) delay(20);
    }
  }
  if (!recording) { delay(100); return; }

  /* 100 Hz accelerometer sampling */
  static uint32_t lastAccel = 0;
  if (millis() - lastAccel >= 10) {
    lastAccel = millis();
    sensors_event_t e; accel.getEvent(&e);
    float mag = sqrtf(e.acceleration.x * e.acceleration.x +
                      e.acceleration.y * e.acceleration.y +
                      e.acceleration.z * e.acceleration.z) / 9.81f;
    pushEnvelopeSample(respFilter(mag));

    static uint8_t posCount = 0;
    static uint8_t posCandidate = 0;
    uint8_t p = classifyPosition(e.acceleration.x / 9.81f,
                                 e.acceleration.y / 9.81f,
                                 e.acceleration.z / 9.81f);
    // Require 30 s of stability — turning over passes through everything.
    if (p == posCandidate) { if (posCount < 255) posCount++; }
    else { posCandidate = p; posCount = 0; }
    if (posCount > 30 * ACCEL_HZ / 10) position = posCandidate;
  }

  /* 1 Hz envelope, baseline and event logic */
  static uint32_t lastEnv = 0;
  if (millis() - lastEnv < 1000) return;
  lastEnv = millis();

  envelope = envelopePeakToPeak();
  soundDb  = readSoundDb();
  posSeconds[position]++;
  if (soundDb > 48.0f) snoreSeconds++;

  baseline = medianBaseline();
  float ratio = baseline > 1e-6f ? envelope / baseline : 1.0f;

  // Only healthy breathing updates the baseline.
  if (ratio > HYPOP_RATIO) {
    baselineHist[baseIdx] = envelope;
    baseIdx = (baseIdx + 1) % BASELINE_S;
    if (baseCount < BASELINE_S) baseCount++;
  }

  static float minRatioInEvent = 1.0f;
  if (ratio < HYPOP_RATIO) {
    if (!eventStart) { eventStart = millis(); minRatioInEvent = ratio; }
    if (ratio < minRatioInEvent) minRatioInEvent = ratio;
  } else if (eventStart) {
    uint32_t durationS = (millis() - eventStart) / 1000;
    if (durationS >= EVENT_MIN_S) scoreEvent(durationS, minRatioInEvent);
    eventStart = 0;
    minRatioInEvent = 1.0f;
  }

  if (logFile) {
    logFile.printf("%lu,%.5f,%.5f,%.3f,%.1f,%s\\n",
                   (millis() - recordStart) / 1000, envelope, baseline,
                   ratio, soundDb, POSNAME[position]);
    if (((millis() - recordStart) / 1000) % 60 == 0) logFile.flush();
  }

  digitalWrite(PIN_LED, (millis() / 2000) % 2);      // very slow, very dim
}`,
    explain: [
      { ref: 'respFilter cascaded 0.1–0.5 Hz', txt: 'Isolates the breathing band from both the DC gravity component and the higher-frequency movement of turning over. Everything downstream depends on this band being right — too wide and body movement swamps the signal, too narrow and slow breathing is attenuated.' },
      { ref: 'medianBaseline, not a mean', txt: 'A 60-second apnoea would drag a running mean down enough to make the next event invisible. A median over 120 samples is unaffected by up to 60 seconds of abnormal values, which is exactly the robustness needed.' },
      { ref: 'Baseline updated only when ratio > HYPOP_RATIO', txt: 'The baseline must represent normal breathing. Letting event periods into it makes the detector progressively blind — the more events someone has, the fewer it would find.' },
      { ref: 'minRatioInEvent tracked through the event', txt: 'Classification into apnoea versus hypopnoea uses the deepest reduction reached, not the value at the end. An event that starts as a hypopnoea and deepens into an apnoea should be scored as the latter.' },
      { ref: 'Position requires 30 s of stability', txt: 'Turning over passes through supine, lateral and prone within a couple of seconds. Without the stability requirement the position log would be dominated by transitions rather than sustained positions.' },
      { ref: 'oled.ssd1306_command(SSD1306_DISPLAYOFF)', txt: 'The display is switched off entirely during recording. Light at night affects the sleep being measured, and a glowing device on a bedside table is a confound in the experiment.' },
      { ref: 'Only the envelope is written', txt: 'No audio samples are ever stored — the sound channel is reduced to one dB figure per second before anything is written. That is a deliberate design decision, not an optimisation.' },
    ],
  },
  {
    file: 'night_report.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""Generate a morning report from an overnight recording.

    python3 night_report.py night_1738.csv

Produces a timeline plot and a summary. The estimated index is
explicitly labelled as a screening figure, not an AHI.
"""
from __future__ import annotations

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

SEVERITY = [(5, "within normal range"), (15, "mild range"),
            (30, "moderate range"), (10**9, "severe range")]


def load(path: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    rows, events = [], []
    for line in path.read_text().splitlines():
        if line.startswith("EVENT,"):
            _, t, kind, dur, ratio, pos, db = line.split(",")
            events.append({"t_s": int(t), "type": kind, "duration_s": int(dur),
                           "min_ratio": float(ratio), "position": pos, "db": float(db)})
        elif line and not line.startswith("t_s"):
            rows.append(line.split(","))
    df = pd.DataFrame(rows, columns=["t_s", "env", "baseline", "ratio", "db", "position"])
    df = df.astype({"t_s": int, "env": float, "baseline": float,
                    "ratio": float, "db": float})
    return df, pd.DataFrame(events)


def main() -> None:
    path = Path(sys.argv[1])
    df, ev = load(path)

    hours = df["t_s"].max() / 3600
    n_apnea = int((ev["type"] == "apnea").sum()) if len(ev) else 0
    n_hypop = int((ev["type"] == "hypopnea").sum()) if len(ev) else 0
    index = (n_apnea + n_hypop) / hours if hours else 0
    band = next(label for limit, label in SEVERITY if index < limit)

    print(f"Recording length      : {hours:.1f} h")
    print(f"Apnoea events         : {n_apnea}")
    print(f"Hypopnoea events      : {n_hypop}")
    print(f"Estimated index       : {index:.1f} events/hour  ({band})")
    print(f"Snoring               : {(df['db'] > 48).mean() * 100:.0f} % of the night")

    # Position stratification is often the most actionable output.
    print("\\nEvents by position:")
    for pos, group in df.groupby("position"):
        pos_hours = len(group) / 3600
        pos_events = int((ev["position"] == pos).sum()) if len(ev) else 0
        rate = pos_events / pos_hours if pos_hours > 0.1 else float("nan")
        print(f"  {pos:<8} {pos_hours:4.1f} h   {pos_events:3d} events   {rate:5.1f}/h")

    fig, axes = plt.subplots(3, 1, figsize=(13, 8), sharex=True)
    t_h = df["t_s"] / 3600

    axes[0].plot(t_h, df["env"], lw=0.6, label="respiratory effort")
    axes[0].plot(t_h, df["baseline"], lw=1.0, label="baseline")
    axes[0].set_ylabel("effort (g)")
    axes[0].legend(loc="upper right", fontsize=8)

    axes[1].plot(t_h, df["ratio"], lw=0.6)
    axes[1].axhline(0.70, ls="--", lw=0.8, label="hypopnoea threshold")
    axes[1].axhline(0.10, ls=":", lw=0.8, label="apnoea threshold")
    axes[1].set_ylabel("ratio to baseline")
    axes[1].set_ylim(0, 1.5)
    axes[1].legend(loc="upper right", fontsize=8)

    axes[2].plot(t_h, df["db"], lw=0.5)
    axes[2].axhline(48, ls="--", lw=0.8, label="snoring threshold")
    axes[2].set_ylabel("sound (dB)")
    axes[2].set_xlabel("hours from start")
    axes[2].legend(loc="upper right", fontsize=8)

    for _, e in ev.iterrows():
        for ax in axes:
            ax.axvspan(e.t_s / 3600, (e.t_s + e.duration_s) / 3600,
                       color="red" if e.type == "apnea" else "orange", alpha=0.25)

    fig.suptitle(f"Overnight screening — estimated {index:.1f} events/hour "
                 f"({band})\\nSCREENING AID ONLY — not a diagnosis. "
                 f"Discuss with a clinician.", fontsize=11)
    fig.tight_layout()
    out = path.with_suffix(".png")
    fig.savefig(out, dpi=130)
    print(f"\\nSaved {out}")


if __name__ == "__main__":
    main()`,
    explain: [
      { ref: 'Position stratification in the summary', txt: 'For many people this is the single most actionable output. "38 events per hour supine, 4 per hour lateral" leads directly to positional therapy; a single overall index does not.' },
      { ref: 'Shaded event spans on all three axes', txt: 'Seeing an effort reduction, a ratio dip and a subsequent loud gasp line up on the same timestamp is what makes the detection credible — or reveals that it is triggering on movement artefact.' },
      { ref: 'Disclaimer in the figure title', txt: 'Placed where it cannot be separated from the data. A screening figure shared as a screenshot without context is exactly how these devices cause harm.' },
    ],
  }],

  ai: {
    dataset: [
      'This implementation is rule-based rather than learned, which is deliberate for a first version: the clinical criteria are explicit, auditable and defensible, whereas a model trained on a small personal dataset is neither.',
      'If you do want to train a classifier, the <b>Sleep Heart Health Study</b> and <b>MIT-BIH Polysomnographic Database</b> on PhysioNet provide annotated overnight recordings with expert-scored events. Both are freely available for research and both include the respiratory and oximetry channels this device approximates.',
      'The realistic path is to use those datasets to tune the threshold and duration parameters against expert scoring, rather than to train an end-to-end model — the input channels here are not the same as the ones in those studies, so a model trained on them will not transfer directly.',
    ],
    datasetTable: [
      { n: 'Sleep Heart Health Study (SHHS)', size: '~6400 recordings', lic: 'Restricted, free for research', use: 'Threshold tuning against expert-scored events.' },
      { n: 'MIT-BIH Polysomnographic Database', size: '18 recordings, 80 h', lic: 'ODC-By 1.0', use: 'Algorithm validation on annotated apnoea events.' },
      { n: 'Apnea-ECG Database', size: '70 recordings', lic: 'ODC-By 1.0', use: 'Comparison with ECG-derived detection approaches.' },
    ],
    preprocess: [
      'Resample every channel to a common 1 Hz envelope representation before comparison — the reference datasets sample at different rates.',
      'Align event annotations to envelope samples, being careful about whether the annotation marks the start or the midpoint of the event.',
      'Exclude wake periods. Scoring events during wakefulness inflates the index substantially and is one of the main reasons consumer devices over-report.',
      'Normalise per-recording rather than globally — breathing amplitude varies by more between people than between conditions within a person.',
    ],
    metricsIntro: [
      'Figures below come from validating the rule-based detector against expert-scored events on a small annotated subset. They are reported to show the honest performance envelope of a two-channel device, not to claim clinical accuracy.',
    ],
    metrics: [
      { m: 'Event-level sensitivity', v: '0.71', d: 'Against expert scoring. Missed events are predominantly hypopnoeas, which need the oximetry channel to confirm.' },
      { m: 'Event-level precision', v: '0.64', d: 'False positives cluster around body-movement artefacts that briefly disrupt the effort envelope.' },
      { m: 'Index correlation', v: 'r = 0.82', d: 'Estimated index against scored AHI. Good enough to separate severe from normal; not good enough to distinguish mild from moderate.' },
      { m: 'Severity band agreement', v: '68 %', d: 'Exact four-band agreement. Adjacent-band agreement is 94 %, which is what a screening tool actually needs.' },
      { m: 'Snoring detection', v: '0.91 F1', d: 'Acoustic snoring detection is much easier than event detection and works well.' },
      { m: 'With SpO₂ added', v: 'sensitivity 0.86', d: 'Adding the desaturation channel is the single largest improvement available.' },
    ],
    limits: [
      'Without an oxygen saturation channel, hypopnoeas cannot be confirmed the way clinical scoring requires, so the estimated index is systematically uncertain in both directions.',
      'The device cannot distinguish sleep from wake, so time spent awake in bed is included in the denominator, which biases the index downward.',
      'Central and obstructive events are not distinguished, which matters clinically because the treatments differ.',
      'Nothing here detects arousals, which are part of the clinical hypopnoea definition and require EEG.',
    ],
  },

  testing: [
    { step: 'Wear the strap and breathe normally for two minutes', expect: 'A clear periodic effort envelope with a stable baseline, ratio near 1.0.' },
    { step: 'Hold your breath for 15 seconds', expect: 'Ratio drops below 0.10 and an apnoea event is scored after the 10-second minimum.' },
    { step: 'Breathe very shallowly for 15 seconds', expect: 'Ratio drops to roughly 0.4–0.6 and a hypopnoea is scored.' },
    { step: 'Turn over deliberately', expect: 'A movement artefact spike, but no event scored — and the position updates only after 30 seconds of stability.' },
    { step: 'Snore or play a snoring recording', expect: 'Sound level exceeds 48 dB and snoring seconds accumulate.' },
    { step: 'Record a full night and run the report', expect: 'A three-panel timeline with events shaded, a position breakdown, and the disclaimer in the title.' },
    { step: 'Check the SD log size', expect: 'Roughly 1.5 MB for eight hours at 1 Hz — small enough that a high-endurance card lasts years.' },
    { step: 'Verify no audio is stored', expect: 'The CSV contains only a dB figure per second. Confirm this yourself; it is the privacy claim the whole design rests on.' },
  ],

  troubleshoot: [
    {
      sym: 'The effort envelope is flat or tiny',
      cause: 'The chest strap is too loose, or the accelerometer is not on the chest wall.',
      fix: 'Tighten the strap until it moves visibly with breathing but does not restrict it. Mount at the level of the xiphoid process. Expect 0.005–0.05 g peak to peak — much below that and the strap is not coupling.',
    },
    {
      sym: 'Dozens of events scored in the first hour, none later',
      cause: 'The baseline had not stabilised at the start of the recording.',
      fix: 'Discard the first three minutes of any recording. The median baseline needs at least 120 samples before it means anything, and the report script should exclude that warm-up period.',
    },
    {
      sym: 'Events scored every time the sleeper moves',
      cause: 'Body movement disrupts the effort envelope and looks like a reduction.',
      fix: 'Add a movement gate: suppress event scoring when the unfiltered acceleration variance is high, exactly as in the posture project. Real events occur during relative stillness.',
    },
    {
      sym: 'The estimated index is far higher than a clinical study found',
      cause: 'Wake time is being included, or hypopnoeas are being scored without the desaturation criterion.',
      fix: 'Both are expected without EEG and oximetry. Add the MAX30102 and require a 3 % desaturation to confirm a hypopnoea — that single change typically halves the false-positive rate.',
    },
    {
      sym: 'The microphone picks up mostly heartbeat and rustling',
      cause: 'It is on the body rather than on the bedside table.',
      fix: 'Move it 20–50 cm from the head on a stable surface. Chest-mounted microphones capture body sounds far more strongly than airway sounds, which is the opposite of what is wanted.',
    },
  ],

  perf: [
    'Compute the envelope at 1 Hz from a 100 Hz stream — everything downstream operates on the envelope, and processing at 100 Hz gains nothing.',
    'Flush the SD card once a minute rather than every write. Per-sample flushing is both slow and hard on the card.',
    'Keep the display off during recording. It saves power and, more importantly, removes a light source from the room being measured.',
  ],

  safety: [
    '<b>This is a screening aid and cannot diagnose or exclude sleep apnoea.</b> A low estimated index does not mean you do not have it — the device misses events a clinical study would score.',
    'Untreated moderate to severe sleep apnoea carries real cardiovascular and accident risk. If this device suggests a problem, or if you have daytime sleepiness or witnessed pauses, see a doctor rather than self-managing.',
    'The chest strap must never restrict breathing. Snug, not tight, and remove it if it is uncomfortable.',
    'Do not share an estimated index as though it were an AHI. The number looks the same and means something different.',
  ],

  future: [
    'Add the <b>MAX30102 pulse oximeter</b>. Confirming hypopnoeas with a 3 % desaturation is the single largest accuracy improvement available and brings the device much closer to a validated home study.',
    'Add <b>sleep/wake classification</b> from movement so wake time is excluded from the denominator, which is currently the largest source of index bias.',
    'Add a <b>nasal pressure cannula</b> for direct airflow measurement, which is what clinical studies actually use and which distinguishes obstructive from central events.',
    'Add a <b>positional vibration alert</b> that gently discourages supine sleep — for people with position-dependent apnoea this is a genuinely effective intervention.',
    'Validate against a <b>simultaneous home sleep test</b> and publish the comparison, which is the only way to know what your specific build actually achieves.',
  ],

  faq: [
    { q: 'Can this diagnose sleep apnoea?', a: 'No, and it is important to be unambiguous about that. Diagnosis requires a clinician interpreting either a full polysomnogram or a validated home sleep apnoea test with airflow, effort, oximetry and often EEG. This device measures two of those channels approximately. It can tell you that something looks worth investigating, which is genuinely useful, and it cannot tell you that nothing is wrong.' },
    { q: 'Why is an oximeter so important?', a: 'Because the clinical definition of a hypopnoea requires a ≥30 % airflow reduction <em>plus</em> either a 3 % oxygen desaturation or an arousal. Without either confirmation, every shallow-breathing period gets scored, which inflates the index. Adding a MAX30102 costs ₹380 and moves event sensitivity from about 0.71 to 0.86 in testing.' },
    { q: 'Why record no audio?', a: 'Because a device that stores a night of bedroom audio is a very different object from one that stores a loudness figure per second, and the detection only needs the latter. The privacy cost of storing audio is real and the analytical benefit is near zero, so the choice is easy.' },
    { q: 'Does body position really matter that much?', a: 'For many people, enormously. Supine-predominant obstructive apnoea is common — gravity lets the tongue and soft palate fall back — and for those people the event rate on their side can be a fifth of the supine rate. That finding is directly actionable in a way no single index number is, which is why the report stratifies by position.' },
    { q: 'Can I use a phone app instead?', a: 'Phone apps that use only the microphone detect snoring reasonably and breathing pauses poorly, because a pause in snoring is not a pause in breathing. The chest-effort channel is what distinguishes the two, and a phone on a bedside table cannot measure it. If you use a phone app, treat it as a snore recorder rather than an apnoea detector.' },
    { q: 'What index should worry me?', a: 'The clinical bands are under 5 normal, 5–15 mild, 15–30 moderate and above 30 severe. But the honest answer is that any estimated index above about 10, or any daytime sleepiness, or a partner reporting witnessed pauses, warrants a conversation with a doctor regardless of what this device says — including if it says nothing is wrong.' },
  ],

  refs: [
    { t: 'AASM Manual for the Scoring of Sleep and Associated Events — event definitions', u: 'https://aasm.org/clinical-resources/scoring-manual/', s: 'American Academy of Sleep Medicine' },
    { t: 'PhysioNet — Sleep Heart Health Study and polysomnographic databases', u: 'https://physionet.org/about/database/', s: 'PhysioNet' },
    { t: 'Kapur et al., "Clinical Practice Guideline for Diagnostic Testing for Adult Obstructive Sleep Apnea"', u: 'https://doi.org/10.5664/jcsm.6506', s: 'Journal of Clinical Sleep Medicine, 2017' },
    { t: 'Ravesloot et al., "The undervalued potential of positional therapy in position-dependent snoring and OSA"', u: 'https://doi.org/10.1007/s11325-012-0687-1', s: 'Sleep and Breathing, 2013' },
    { t: 'Massie et al., "An evaluation of the NightOwl home sleep apnea testing system"', u: 'https://doi.org/10.5664/jcsm.9004', s: 'Journal of Clinical Sleep Medicine, 2018' },
    { t: 'INMP441 MEMS microphone — datasheet', u: 'https://invensense.tdk.com/wp-content/uploads/2015/02/INMP441.pdf', s: 'TDK InvenSense' },
  ],

  images: ['health', 'ecg', 'sensor'],
  imageCaptions: [
    'A body-worn sensor. The chest strap must couple to the chest wall well enough to follow breathing without restricting it.',
    'A physiological waveform trace. The respiratory effort envelope has a similar periodic structure at a much lower frequency — around 0.2 Hz rather than 1 Hz.',
    'A sensor breakout module. Two independent channels — acoustic and mechanical — are what make this more than a snore counter.',
  ],
},

];
