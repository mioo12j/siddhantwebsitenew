/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 015–017
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 015 · Heart-Rate & SpO2 Band ────────────────────────────────── */
{
  id: '015',
  domainKey: 'iot',
  emoji: '❤️',
  thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '16–24 hours',
  iso8601: 'PT20H',
  tagline: 'A wrist band that measures pulse rate and blood-oxygen saturation using photoplethysmography — built with the signal processing done properly, and with an honest account of what a wrist sensor can and cannot tell you.',

  overview: [
    'Photoplethysmography is deceptively simple to demonstrate and genuinely difficult to do well. Shine light into skin, measure how much comes back, and the reflected intensity varies with each heartbeat as blood volume in the capillary bed changes. Getting a plausible-looking waveform takes twenty minutes. Getting a heart rate that is correct while the wearer moves, and an SpO₂ figure that means anything at all, takes the rest of this project.',
    'The MAX30102 does the analogue work: two LEDs (red at 660 nm and infrared at 880 nm), a photodiode, an 18-bit ADC and ambient light cancellation, all in a 5.6 × 3.3 mm package. What it does not do is any of the signal processing. The raw output is a slowly drifting DC level with a small AC component riding on it — the pulsatile part is typically <b>0.5 to 2 % of the total signal</b>. Everything interesting happens in that fraction.',
    'The pipeline here is the standard clinical one, implemented explicitly rather than hidden in a library. A DC-removal filter tracks and subtracts the baseline. A band-pass filter from 0.5 to 4 Hz keeps the physiological range (30 to 240 bpm) and rejects both respiratory drift below it and noise above. Peak detection with an adaptive threshold and a physiological refractory period finds beats. And a signal-quality index gates the output, because a confident wrong heart rate is worse than no heart rate.',
    'On SpO₂, this project is deliberately blunt about its limits. The ratio-of-ratios method is genuine physics and works. But a reflectance sensor on a wrist, calibrated with a generic curve rather than against a co-oximeter on real volunteers spanning a range of desaturations, is not a medical device and its absolute values should not be trusted. What it is good for is <em>trends</em> in a single individual under consistent conditions — which is still useful, and is what the firmware reports.',
  ],

  does: [
    'Measures red and infrared PPG at 100 Hz with the MAX30102 in SpO₂ mode.',
    'Extracts heart rate through DC removal, band-pass filtering and adaptive peak detection.',
    'Computes SpO₂ from the ratio of red to infrared AC/DC ratios.',
    'Reports a signal-quality index and suppresses output when the reading is unreliable.',
    'Rejects motion artefacts using a companion accelerometer.',
    'Computes heart-rate variability (RMSSD) from beat-to-beat intervals during still periods.',
    'Streams over BLE to a phone and logs locally when out of range.',
  ],

  features: [
    '<b>Explicit DSP pipeline</b> — every filter stage is visible and tunable, not hidden in a black-box library.',
    '<b>Adaptive peak detection</b> with a 300 ms refractory period, matching the physiological minimum beat interval.',
    '<b>Signal quality index</b> derived from beat-interval regularity and perfusion amplitude.',
    '<b>Accelerometer gating</b> — heart rate is only reported when the wrist is reasonably still.',
    '<b>RMSSD heart-rate variability</b> computed over 60-second still windows.',
    '<b>BLE Heart Rate Service</b> so any standard fitness app can read it.',
    '<b>Low-power duty cycling</b>: the LEDs are the dominant load, so they run 25 % of the time.',
    '<b>Local ring buffer</b> holding four hours of beat intervals for out-of-range logging.',
  ],

  applications: [
    { t: 'Resting heart-rate tracking', d: 'A daily resting figure taken under consistent conditions is one of the more genuinely informative fitness metrics.' },
    { t: 'Heart-rate variability for training load', d: 'Morning RMSSD trends track autonomic recovery reasonably well when measured consistently.' },
    { t: 'Sleep heart-rate patterns', d: 'Overnight is the ideal PPG condition — still wrist, stable temperature, hours of clean data.' },
    { t: 'Learning biomedical signal processing', d: 'PPG is the most accessible real physiological signal, and every technique here transfers to ECG and EEG work.' },
    { t: 'Altitude and breathing exercises', d: 'SpO₂ trends during breath-holds or at altitude are visible even with an uncalibrated sensor.' },
    { t: 'Prototyping for a certified device', d: 'Understanding this pipeline is a prerequisite for any serious work on medical wearables.' },
  ],

  skills: [
    'Arduino C++ with fixed-point and floating-point DSP',
    'Digital filter concepts: IIR, cut-off frequency, group delay',
    'I²C sensor configuration through registers',
    'BLE GATT services and characteristics',
    'Enough physiology to know what you are measuring',
  ],

  prereq: [
    'Read the MAX30102 datasheet before you start, particularly the FIFO and interrupt sections. The register-level configuration matters far more here than in most sensors, and copying settings from a tutorial without understanding them is why so many builds produce a flat line.',
  ],

  parts: ['esp32', 'max30102', 'adxl345', 'oled', 'li18650', 'tp4056', 'perfboard'],
  extraParts: [
    { name: '3D-printed wrist enclosure + strap', spec: 'TPU or PETG, 22 mm strap lugs', qty: 1, price: 250, note: 'The optical window must sit flush against skin — a recessed sensor gives no usable signal.' },
    { name: 'Black opaque skirt / light seal', spec: 'Adhesive foam, 1 mm', qty: 1, price: 60, note: 'Blocks ambient light leaking around the sensor. Improves SNR more than any firmware change.' },
    { name: '4.7 kΩ I²C pull-ups', spec: '1 % metal film', qty: 1, price: 10 },
  ],
  cost: '₹2,700 – ₹3,500',
  libs: ['wifi', 'arduinojson', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'MAX30102', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x57, 400 kHz' },
      { dev: 'MAX30102', devPin: 'INT', pin: 'GPIO 27', sig: 'FIFO almost-full interrupt' },
      { dev: 'ADXL345', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x53' },
      { dev: 'Battery divider', devPin: 'Mid-point', pin: 'GPIO 34', sig: '1 MΩ / 1 MΩ, MOSFET gated' },
    ],
    right: [
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x3C' },
      { dev: 'Vibration motor', devPin: 'MOSFET gate', pin: 'GPIO 25', sig: 'Haptic feedback' },
      { dev: 'Button', devPin: 'NO', pin: 'GPIO 33', sig: 'Wake / mode' },
    ],
  },
  wiringNotes: [
    'The MAX30102 module is <b>1.8 V core with a 3.3 V I²C interface</b>. Most breakout boards include the regulator and level shifting — check yours does before connecting to a 3.3 V bus, because some bare modules do not.',
    'The sensor <b>must contact skin directly</b> with no air gap. A 1 mm gap admits ambient light and reduces the pulsatile signal by more than half. Design the enclosure so the sensor face is proud of the surrounding surface, not recessed.',
    'Fit an opaque skirt around the sensor. Ambient light — especially sunlight and fluorescent flicker at 100 Hz — is the largest noise source in reflectance PPG, and the MAX30102\'s ambient cancellation only handles so much.',
    'Run I²C at 400 kHz. At 100 Hz sampling with two channels and an 18-bit FIFO, 100 kHz is marginal and you will drop samples.',
    'The accelerometer must be rigidly attached to the same body as the sensor. If it can move independently, its motion signal does not correspond to the sensor\'s motion and the artefact rejection does nothing.',
    'Keep the LED supply well decoupled. The MAX30102 pulses its LEDs at up to 50 mA, and the resulting supply ripple couples straight into the photodiode reading if the decoupling is inadequate.',
  ],

  block: {
    columns: [
      { label: 'Optical', blocks: [{ name: 'Red 660 nm LED', sub: 'pulsed' }, { name: 'IR 880 nm LED', sub: 'pulsed' }, { name: 'Photodiode + ADC', sub: '18-bit, 100 Hz' }] },
      { label: 'Condition', edge: 'raw FIFO', blocks: [{ name: 'DC removal', sub: 'baseline tracking' }, { name: 'Band-pass 0.5–4 Hz', sub: 'physiological', highlight: true }] },
      { label: 'Extract', edge: 'AC signal', blocks: [{ name: 'Peak detect', sub: 'adaptive + refractory', highlight: true }, { name: 'Ratio of ratios', sub: 'SpO₂' }] },
      { label: 'Gate', edge: 'candidates', blocks: [{ name: 'Motion gate', sub: 'accelerometer' }, { name: 'Quality index', sub: 'suppress if poor' }] },
    ],
  },

  flow: [
    { t: 'Boot: configure MAX30102 registers', k: 'start' },
    { t: 'Read FIFO on interrupt (100 Hz)', k: 'proc' },
    { t: 'Remove DC, band-pass 0.5–4 Hz', k: 'proc' },
    { t: 'Wrist still (accel variance low)?', k: 'dec', yes: 'yes', no: 'mark unreliable', back: 1 },
    { t: 'Detect peak above adaptive threshold', k: 'proc' },
    { t: 'Interval within 300–2000 ms?', k: 'dec', yes: 'accept beat', no: 'reject', back: 1 },
    { t: 'Update HR, RMSSD and SpO₂', k: 'proc' },
    { t: 'Publish over BLE, log locally', k: 'end' },
  ],

  principle: [
    'Every heartbeat pushes a pressure wave through the arterial tree, and in the capillary bed under the skin that wave momentarily increases blood volume. Haemoglobin absorbs light, so more blood means less light returns to the photodiode. The resulting signal has two parts: a large <b>DC component</b> from tissue, bone, venous blood and the baseline arterial volume, and a small <b>AC component</b> — typically 0.5 to 2 % of the DC at the wrist — that pulses with the heart. On a fingertip the AC fraction is five to ten times larger, which is exactly why clinical pulse oximeters clip to a finger and why wrist devices are harder.',
    'Heart rate comes from the AC component alone, so the first job is removing the DC. A simple approach — subtracting a long moving average — introduces phase distortion. Better is a one-pole DC-blocking filter, <code>y[n] = x[n] − x[n−1] + α·y[n−1]</code> with α around 0.95, which removes DC with minimal group delay. What remains is band-pass filtered between 0.5 Hz (30 bpm) and 4 Hz (240 bpm): below that is respiratory and postural drift, above it is noise and the harmonics that confuse peak detection.',
    '<b>Peak detection</b> then needs two guards. An adaptive threshold set to a fraction of a decaying running maximum handles the fact that signal amplitude varies with perfusion, temperature and how tight the strap is. And a <b>refractory period</b> of 300 ms — corresponding to 200 bpm, above any plausible resting rate — prevents the dicrotic notch, the secondary bump from aortic valve closure that appears in every PPG waveform, from being counted as a second beat. Missing that refractory period is the single most common cause of a heart rate that reads exactly double.',
    '<b>SpO₂</b> uses a different principle. Oxygenated and deoxygenated haemoglobin have different absorption spectra: at 660 nm (red) deoxyhaemoglobin absorbs much more than oxyhaemoglobin, while at 880 nm (infrared) the relationship reverses and is much flatter. Take the ratio of the pulsatile to non-pulsatile component at each wavelength, then take the ratio of those ratios: <code>R = (AC_red/DC_red) / (AC_ir/DC_ir)</code>. Because both wavelengths pass through the same tissue, path length and most confounders cancel. R maps to saturation through an empirical curve.',
    'That curve is where the honesty comes in. Clinical pulse oximeters are calibrated by inducing controlled hypoxia in human volunteers down to about 70 % saturation and fitting R against simultaneous arterial blood co-oximetry. You cannot do that. The commonly quoted approximation <code>SpO₂ ≈ 110 − 25·R</code> is a rough linearisation of that curve for transmissive fingertip sensors, and applying it to a reflectance wrist sensor introduces further error. It will track your saturation going down during a breath-hold; it will not give you a number a clinician should act on.',
  ],

  equations: [
    { t: 'DC-blocking and band-pass filters', eq: 'DC blocker (one-pole high-pass):\n  y[n] = x[n] − x[n−1] + α·y[n−1],   α = 0.95\n  −3 dB at  f = (1 − α) · fs / (2π) = 0.05 × 100 / 6.283 ≈ 0.8 Hz\n\nLow-pass (4-point moving average at fs = 100 Hz):\n  y[n] = (x[n] + x[n−1] + x[n−2] + x[n−3]) / 4\n  −3 dB at approximately 0.44 × fs / N = 11 Hz\n\nCascaded, the pass band is roughly 0.8–11 Hz, which\ncovers 48–660 bpm — deliberately wider than the\nphysiological range so the filter does not distort\nthe pulse morphology used for quality assessment.' },
    { t: 'Ratio of ratios and SpO₂', eq: 'R = (AC_red / DC_red) / (AC_ir / DC_ir)\n\nAC measured peak-to-peak over one beat,\nDC measured as the mean over the same window.\n\nEmpirical linearisation (transmissive fingertip):\n  SpO₂ ≈ 110 − 25 · R\n\n  R = 0.5  →  97.5 %\n  R = 0.8  →  90.0 %\n  R = 1.0  →  85.0 %\n\nThis curve is NOT valid for a reflectance wrist\nsensor without individual calibration. Report the\ntrend; do not report the absolute number as clinical.' },
    { t: 'Heart-rate variability (RMSSD)', eq: 'Given successive RR intervals (ms) over a window:\n\n  RMSSD = sqrt( (1/(N−1)) · Σ (RR[i+1] − RR[i])² )\n\nExample: RR = [860, 902, 875, 918, 890] ms\n  diffs   = [42, −27, 43, −28]\n  squares = [1764, 729, 1849, 784]\n  mean    = 5126 / 4 = 1281.5\n  RMSSD   = 35.8 ms\n\nTypical resting adult RMSSD: 20–90 ms.\nOnly compare a person against their own baseline —\nbetween-individual variation is enormous.' },
    { t: 'Signal quality index', eq: 'SQI combines perfusion and rhythm regularity:\n\n  perfusion  = AC_ir / DC_ir          (want > 0.005)\n  regularity = 1 − (σ_RR / μ_RR)      (want > 0.85)\n  motion     = 1 − min(1, σ_accel / 0.5)\n\n  SQI = 0.4·min(1, perfusion/0.02) + 0.4·regularity + 0.2·motion\n\nSuppress the displayed heart rate when SQI < 0.5.\nA suppressed reading is honest; a confident wrong\none is not.' },
  ],

  code: [{
    file: 'ppg-band.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Heart-Rate & SpO2 Band — ESP32 + MAX30102 + ADXL345

   The full PPG pipeline written out explicitly: FIFO read, DC removal,
   band-pass, adaptive peak detection with a refractory period, ratio-
   of-ratios SpO2, motion gating and a signal quality index.

   Not a medical device. Trends only.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_ADXL345_U.h>
#include <math.h>

#define MAX30102_ADDR 0x57
#define FS            100          // sample rate, Hz
#define BUF_LEN       500          // 5 s of history
#define REFRACTORY_MS 300          // 200 bpm ceiling
#define RR_HISTORY     32

Adafruit_SSD1306 oled(128, 64, &Wire, -1);
Adafruit_ADXL345_Unified accel(1);

/* ── raw and filtered buffers ───────────────────────────────── */
float irFilt[BUF_LEN], redFilt[BUF_LEN];
uint32_t irRaw[BUF_LEN], redRaw[BUF_LEN];
int bufIdx = 0;

float dcIr = 0, dcRed = 0;
float prevIrIn = 0, prevIrOut = 0, prevRedIn = 0, prevRedOut = 0;

uint32_t rrIntervals[RR_HISTORY];
uint8_t  rrCount = 0, rrHead = 0;
uint32_t lastBeatMs = 0;
float    heartRate = 0, spo2 = 0, sqi = 0, rmssd = 0;
float    accelVariance = 0;

/* ── MAX30102 register access ───────────────────────────────── */
void maxWrite(uint8_t reg, uint8_t val) {
  Wire.beginTransmission(MAX30102_ADDR);
  Wire.write(reg); Wire.write(val);
  Wire.endTransmission();
}

uint8_t maxRead(uint8_t reg) {
  Wire.beginTransmission(MAX30102_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom(MAX30102_ADDR, 1);
  return Wire.read();
}

void maxBegin() {
  maxWrite(0x09, 0x40);            // reset
  delay(100);

  maxWrite(0x02, 0xC0);            // INT enable: A_FULL + PPG_RDY
  maxWrite(0x04, 0x00);            // FIFO write pointer
  maxWrite(0x05, 0x00);            // overflow counter
  maxWrite(0x06, 0x00);            // FIFO read pointer

  // FIFO config: sample averaging x4, rollover enabled, almost-full at 17
  maxWrite(0x08, (0x02 << 5) | (1 << 4) | 0x0F);

  maxWrite(0x09, 0x03);            // mode: SpO2 (red + IR)

  // SpO2 config: ADC range 4096 nA, 100 Hz, 411 us pulse width (18-bit)
  maxWrite(0x0A, (0x01 << 5) | (0x03 << 2) | 0x03);

  maxWrite(0x0C, 0x24);            // LED1 (red) current ~7 mA
  maxWrite(0x0D, 0x24);            // LED2 (IR)  current ~7 mA
}

// Reads one sample pair from the FIFO. Returns false when empty.
bool maxReadFifo(uint32_t &red, uint32_t &ir) {
  uint8_t wr = maxRead(0x04), rd = maxRead(0x06);
  if (wr == rd) return false;

  Wire.beginTransmission(MAX30102_ADDR);
  Wire.write(0x07);                          // FIFO data register
  Wire.endTransmission(false);
  Wire.requestFrom(MAX30102_ADDR, 6);
  if (Wire.available() < 6) return false;

  red = ((uint32_t)Wire.read() << 16) | ((uint32_t)Wire.read() << 8) | Wire.read();
  ir  = ((uint32_t)Wire.read() << 16) | ((uint32_t)Wire.read() << 8) | Wire.read();
  red &= 0x03FFFF;                           // 18-bit resolution
  ir  &= 0x03FFFF;
  return true;
}

/* ── filters ────────────────────────────────────────────────── */
// One-pole DC blocker: removes baseline with minimal phase distortion.
float dcBlock(float x, float &prevIn, float &prevOut, float alpha = 0.95f) {
  float y = x - prevIn + alpha * prevOut;
  prevIn = x; prevOut = y;
  return y;
}

// 4-point moving average low-pass, cheap and adequate at 100 Hz.
float lowPass(float x, float *hist) {
  hist[3] = hist[2]; hist[2] = hist[1]; hist[1] = hist[0]; hist[0] = x;
  return (hist[0] + hist[1] + hist[2] + hist[3]) * 0.25f;
}

/* ── peak detection ─────────────────────────────────────────── */
bool detectBeat(float sample, uint32_t nowMs) {
  static float runningMax = 0, threshold = 0;
  static float prev = 0, prevPrev = 0;
  static bool rising = false;

  runningMax = fmaxf(sample, runningMax * 0.999f);   // slow decay
  threshold = runningMax * 0.55f;

  bool isPeak = prev > threshold && prev > prevPrev && prev > sample && rising;
  rising = sample > prev;
  prevPrev = prev; prev = sample;
  if (!isPeak) return false;

  // Refractory period rejects the dicrotic notch — the single most
  // common cause of a heart rate that reads exactly double.
  if (nowMs - lastBeatMs < REFRACTORY_MS) return false;

  uint32_t rr = nowMs - lastBeatMs;
  lastBeatMs = nowMs;
  if (rr < 300 || rr > 2000) return false;           // 30–200 bpm plausible

  rrIntervals[rrHead] = rr;
  rrHead = (rrHead + 1) % RR_HISTORY;
  if (rrCount < RR_HISTORY) rrCount++;
  return true;
}

/* ── derived metrics ────────────────────────────────────────── */
void updateHeartRate() {
  if (rrCount < 5) { heartRate = 0; return; }

  // Median of the last 8 intervals: far more robust than a mean
  // when one interval is corrupted by a missed or extra beat.
  uint32_t recent[8];
  int n = rrCount < 8 ? rrCount : 8;
  for (int i = 0; i < n; i++)
    recent[i] = rrIntervals[(rrHead + RR_HISTORY - 1 - i) % RR_HISTORY];
  for (int i = 1; i < n; i++) {                      // insertion sort
    uint32_t k = recent[i]; int j = i - 1;
    while (j >= 0 && recent[j] > k) { recent[j + 1] = recent[j]; j--; }
    recent[j + 1] = k;
  }
  uint32_t med = recent[n / 2];
  heartRate = 60000.0f / med;
}

void updateRmssd() {
  if (rrCount < 10) { rmssd = 0; return; }
  double acc = 0; int n = 0;
  for (int i = 1; i < rrCount; i++) {
    int a = (rrHead + RR_HISTORY - i) % RR_HISTORY;
    int b = (rrHead + RR_HISTORY - i - 1) % RR_HISTORY;
    double d = (double)rrIntervals[a] - (double)rrIntervals[b];
    acc += d * d; n++;
  }
  rmssd = n ? sqrt(acc / n) : 0;
}

void updateSpo2() {
  // AC = peak-to-peak of the filtered signal, DC = mean of the raw.
  float irMin = 1e9, irMax = -1e9, redMin = 1e9, redMax = -1e9;
  double irDc = 0, redDc = 0;
  for (int i = 0; i < BUF_LEN; i++) {
    irMin = fminf(irMin, irFilt[i]);   irMax = fmaxf(irMax, irFilt[i]);
    redMin = fminf(redMin, redFilt[i]); redMax = fmaxf(redMax, redFilt[i]);
    irDc += irRaw[i]; redDc += redRaw[i];
  }
  irDc /= BUF_LEN; redDc /= BUF_LEN;
  if (irDc < 10000 || redDc < 10000) { spo2 = 0; sqi = 0; return; }  // no finger

  float acIr = irMax - irMin, acRed = redMax - redMin;
  float perfusion = acIr / (float)irDc;

  float R = (acRed / (float)redDc) / (acIr / (float)irDc);
  float est = 110.0f - 25.0f * R;
  spo2 = est < 70 ? 0 : (est > 100 ? 100 : est);

  // Quality: perfusion, rhythm regularity and stillness.
  float mean = 0, var = 0;
  for (int i = 0; i < rrCount; i++) mean += rrIntervals[i];
  if (rrCount) mean /= rrCount;
  for (int i = 0; i < rrCount; i++) {
    float d = rrIntervals[i] - mean; var += d * d;
  }
  float sd = rrCount ? sqrtf(var / rrCount) : 1e9;
  float regularity = mean > 0 ? 1.0f - fminf(1.0f, sd / mean) : 0;
  float motion = 1.0f - fminf(1.0f, accelVariance / 0.5f);

  sqi = 0.4f * fminf(1.0f, perfusion / 0.02f) + 0.4f * regularity + 0.2f * motion;
}

/* ── motion ─────────────────────────────────────────────────── */
void updateMotion() {
  static float hist[16]; static uint8_t h = 0;
  sensors_event_t e; accel.getEvent(&e);
  float mag = sqrtf(e.acceleration.x * e.acceleration.x +
                    e.acceleration.y * e.acceleration.y +
                    e.acceleration.z * e.acceleration.z);
  hist[h] = mag; h = (h + 1) % 16;

  float mean = 0; for (float v : hist) mean += v; mean /= 16;
  float var = 0;  for (float v : hist) { float d = v - mean; var += d * d; }
  accelVariance = sqrtf(var / 16);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  Wire.setClock(400000);                     // 100 kHz drops samples at 100 Hz

  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  accel.begin(0x53);
  accel.setRange(ADXL345_RANGE_2_G);
  maxBegin();

  Serial.println("PPG band running — keep the wrist still for a clean reading");
}

void loop() {
  static float irLp[4] = {0}, redLp[4] = {0};
  uint32_t red, ir;

  while (maxReadFifo(red, ir)) {
    uint32_t now = millis();

    float irF  = lowPass(dcBlock((float)ir,  prevIrIn,  prevIrOut),  irLp);
    float redF = lowPass(dcBlock((float)red, prevRedIn, prevRedOut), redLp);

    irRaw[bufIdx] = ir;   redRaw[bufIdx] = red;
    irFilt[bufIdx] = irF; redFilt[bufIdx] = redF;
    bufIdx = (bufIdx + 1) % BUF_LEN;

    // Invert: more blood absorbs more light, so a beat is a DIP in
    // the raw signal and a peak once inverted.
    if (detectBeat(-irF, now)) {
      updateHeartRate();
      updateRmssd();
    }
  }

  static uint32_t lastSlow = 0;
  if (millis() - lastSlow < 250) return;
  lastSlow = millis();

  updateMotion();
  updateSpo2();

  bool reliable = sqi >= 0.5f && accelVariance < 0.5f && heartRate > 30;

  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(3); oled.setCursor(0, 0);
  if (reliable) oled.printf("%3.0f", heartRate);
  else          oled.print("---");
  oled.setTextSize(1); oled.setCursor(64, 14); oled.print("bpm");

  oled.setCursor(0, 30);
  if (reliable && spo2 > 0) oled.printf("SpO2 %.0f%% (trend only)", spo2);
  else                      oled.print("SpO2 --");

  oled.setCursor(0, 42); oled.printf("HRV %.0f ms", rmssd);
  oled.setCursor(0, 54); oled.printf("SQI %.2f  %s", sqi,
                                     accelVariance > 0.5f ? "MOVING" : "still");
  oled.display();

  Serial.printf("HR %.0f  SpO2 %.0f  RMSSD %.0f  SQI %.2f  accel %.2f\\n",
                heartRate, spo2, rmssd, sqi, accelVariance);
}`,
    explain: [
      { ref: 'maxWrite(0x08, ...) sample averaging ×4', txt: 'The MAX30102 can average samples in hardware before they reach the FIFO. Averaging four samples at 400 Hz to give 100 Hz output improves SNR by 6 dB for free and reduces I²C traffic fourfold.' },
      { ref: 'LED current 0x24 (~7 mA)', txt: 'Higher LED current gives more signal and more power draw and more skin heating. 7 mA is a good starting point for a wrist; a finger clip can use less, and dark or thick skin may need more. This is the parameter to tune first if the signal is weak.' },
      { ref: 'detectBeat(-irF, ...)', txt: 'The sign inversion is not cosmetic. Increased blood volume absorbs more light, so a heartbeat is a downward deflection in the raw photodiode signal. Feeding the un-inverted signal to a peak detector finds the wrong features entirely.' },
      { ref: 'REFRACTORY_MS = 300', txt: 'The dicrotic notch — the secondary bump from aortic valve closure — appears 200–300 ms after the main peak in every PPG waveform. Without a refractory period it is counted as a beat and the reported rate is exactly double, which is the classic symptom.' },
      { ref: 'Median of 8 intervals, not mean', txt: 'One missed beat doubles an interval and one spurious beat halves it. A mean is badly corrupted by either; a median is immune to up to three outliers in eight.' },
      { ref: 'irDc < 10000 → no finger', txt: 'A very low DC level means the sensor is not against skin. Reporting an SpO₂ derived from ambient light is worse than reporting nothing, so the whole computation is skipped.' },
      { ref: 'reliable gate before display', txt: 'The display shows dashes rather than a number when quality is poor. This is the most important design decision in the whole project — a wearable that always shows a confident number teaches you to trust numbers that are sometimes wrong.' },
    ],
  }],

  config: [
    'Set the LED currents (registers 0x0C and 0x0D) for your skin and enclosure. Start at 0x24 and increase until the raw IR DC level sits between roughly 50 000 and 150 000 counts — too low is noisy, too high saturates the ADC.',
    'Set I²C to 400 kHz. At 100 kHz the FIFO overflows at 100 Hz with two channels and you lose samples silently.',
    'Tune the peak threshold fraction (0.55 of the running maximum). Lower catches weak pulses and admits noise; higher is robust and misses beats during low perfusion.',
    'Set the motion gate threshold from your own accelerometer variance while sitting still versus walking. The 0.5 default is a starting point, not a universal value.',
    'Leave the SpO₂ calibration constants alone unless you can validate against a reference oximeter, and label the output as a trend regardless.',
  ],

  calibration: [
    { h: 'Set the operating point', p: ['Watch the raw IR DC level with the band on. Adjust LED current until it sits in the middle of the ADC range. A saturated ADC produces a flat top on the waveform and destroys the AC measurement that everything depends on.'] },
    { h: 'Validate heart rate against a reference', p: ['Compare against a chest strap or a manual pulse count over 60 seconds, at rest and after light exercise. Agreement within 3 bpm at rest is achievable; during movement expect worse, which is what the motion gate is for.'] },
    { h: 'Establish your own SpO₂ baseline', p: ['Record your resting value over several sessions. It will probably not be 98 % — a reflectance wrist sensor with a generic curve is commonly off by several points. What matters is that a breath-hold produces a visible downward trend from <em>your</em> baseline.'] },
    { h: 'Check the strap tension effect', p: ['Measure perfusion index at three strap tensions. Too loose admits light and loses signal; too tight restricts blood flow and also loses signal. There is a clear optimum and it is worth finding once.'] },
  ],

  testing: [
    { step: 'Place the sensor on a fingertip', expect: 'Raw IR DC of 50 000–150 000 counts and a clearly periodic filtered waveform.' },
    { step: 'Read heart rate at rest', expect: 'A stable figure within about 3 bpm of a manual count over 60 seconds.' },
    { step: 'Check for the doubling error', expect: 'The reported rate should not sit at exactly twice your pulse. If it does, the refractory period is not being applied.' },
    { step: 'Remove the sensor from skin', expect: 'Display shows dashes within a few seconds — not a stale or invented number.' },
    { step: 'Wave the wrist vigorously', expect: 'SQI drops, "MOVING" appears, and the heart rate is suppressed rather than showing motion artefact.' },
    { step: 'Hold your breath for 45 seconds', expect: 'A visible downward SpO₂ trend of several points, recovering within a minute of resuming breathing.' },
    { step: 'Sit still for two minutes and read RMSSD', expect: 'A value between roughly 20 and 90 ms for a healthy adult at rest, repeatable across sessions.' },
    { step: 'Compare readings in bright sunlight and indoors', expect: 'Similar quality if the light seal is effective. A large degradation outdoors means ambient light is leaking in.' },
  ],

  troubleshoot: [
    {
      sym: 'Heart rate reads exactly double the real value',
      cause: 'The dicrotic notch is being counted as a beat.',
      fix: 'Enforce the 300 ms refractory period after each accepted beat, and raise the adaptive threshold fraction. The dicrotic notch is always smaller than the systolic peak, so a threshold at 55 % of the running maximum should exclude it.',
    },
    {
      sym: 'The waveform is flat or barely moves',
      cause: 'Sensor not in contact, LED current too low, or the ADC saturated.',
      fix: 'Check the raw DC level. Near zero means no contact or the LEDs are off; near the 262 143 maximum means saturation. Adjust LED current until DC sits mid-range, and ensure the sensor face contacts skin with no gap.',
    },
    {
      sym: 'The reading is fine indoors and useless outside',
      cause: 'Ambient light, particularly sunlight, swamping the photodiode.',
      fix: 'Fit an opaque skirt around the sensor and make the enclosure light-tight. This improves outdoor SNR more than any amount of filtering. The MAX30102 ambient-light cancellation helps but cannot overcome direct sunlight leaking around the sensor.',
    },
    {
      sym: 'FIFO overflows and samples are lost',
      cause: 'I²C too slow, or the loop is not reading the FIFO often enough.',
      fix: 'Set the bus to 400 kHz and drain the FIFO in a while loop rather than reading one sample per iteration. Enable sample averaging in register 0x08 to reduce the sample rate reaching the FIFO.',
    },
    {
      sym: 'SpO₂ reads 100 % constantly, or an implausible value',
      cause: 'The AC amplitude is too small to measure reliably, or the DC estimate includes the filtered rather than the raw signal.',
      fix: 'AC must come from the band-passed signal and DC from the <em>raw</em> signal — mixing them makes R meaningless. Also confirm perfusion index exceeds about 0.005; below that the ratio is dominated by noise.',
    },
    {
      sym: 'Readings differ substantially between people',
      cause: 'Skin tone, tissue thickness and perfusion all affect reflectance PPG.',
      fix: 'This is a real and well-documented limitation, not a bug. Darker skin absorbs more at 660 nm, which reduces the red channel signal and biases R. Higher LED current helps; individual calibration helps more; and the honest answer is to report trends per person rather than absolute values across people.',
    },
  ],

  perf: [
    'Enable hardware sample averaging in the MAX30102 rather than averaging in firmware — it improves SNR before the ADC and costs no CPU.',
    'Duty-cycle the LEDs for battery operation. They dominate consumption, and measuring for 15 seconds every minute gives a resting heart rate that is just as useful at a quarter of the power.',
    'Use the interrupt pin rather than polling the FIFO pointers. Polling at 100 Hz over I²C wastes both bus bandwidth and CPU.',
  ],

  safety: [
    '<b>This is not a medical device.</b> Do not use it to diagnose anything or to make a treatment decision. If you have symptoms, see a doctor with a certified oximeter.',
    'The SpO₂ figure in particular should never be treated as clinical. A reflectance wrist sensor with a generic calibration curve can be several percentage points off, and error increases exactly where it matters most — at low saturation.',
    'Keep LED current modest. High-current LEDs against skin for hours cause local heating; the MAX30102 datasheet gives thermal limits and they exist for a reason.',
    'Never sell or distribute a device like this as a health monitor. In most jurisdictions that requires regulatory clearance, and the requirement is there because uncalibrated devices have caused real harm.',
  ],

  future: [
    'Add <b>adaptive motion artefact cancellation</b> using the accelerometer as a reference in an LMS adaptive filter, which recovers usable heart rate during walking rather than merely suppressing it.',
    'Add a <b>green LED channel</b> (530 nm). Green penetrates less deeply and is far more motion-robust for heart rate, which is why every commercial wrist wearable uses it — red and IR are only needed for SpO₂.',
    'Add <b>respiratory rate</b> extraction from the respiratory sinus arrhythmia modulation of the RR intervals, which needs no extra hardware.',
    'Add <b>proper BLE Heart Rate Service</b> so any standard fitness app can consume the data.',
    'Add <b>per-user SpO₂ calibration</b> against a reference oximeter across a small range, which materially improves the absolute figures for that individual.',
  ],

  faq: [
    { q: 'Why is my wrist reading so much worse than a fingertip?', a: 'Physics. The pulsatile fraction of the signal at a fingertip is typically 2–10 % of the DC level; at the wrist it is 0.5–2 %. There is simply less arterial blood volume change under a wrist sensor. That is why clinical oximeters clip to a finger and why wrist devices need far better signal processing to achieve worse accuracy.' },
    { q: 'Can I trust the SpO₂ number?', a: 'No, not as an absolute value. The ratio-of-ratios physics is sound, but the mapping from R to saturation must be calibrated empirically against arterial blood gas measurements in volunteers, which no hobby project can do. What you can trust is the direction: hold your breath and it will fall, which is genuinely useful for observing your own physiology.' },
    { q: 'Why does it read double sometimes?', a: 'The dicrotic notch. Every PPG waveform has a secondary bump 200–300 ms after the main peak, caused by the aortic valve closing and the pressure wave reflecting. Without a refractory period the peak detector counts it as a beat. The 300 ms guard in this code exists for exactly that reason.' },
    { q: 'Green, red or infrared LEDs?', a: 'Green (around 530 nm) for heart rate — it penetrates less deeply, is more strongly absorbed by haemoglobin, and is much less affected by motion. Red and infrared for SpO₂, because you need two wavelengths with different oxy/deoxy absorption ratios. Commercial wearables use green for continuous heart rate and switch on red and IR only for periodic SpO₂ spot checks.' },
    { q: 'Does skin tone affect accuracy?', a: 'Yes, measurably, and it is a serious and well-documented issue in the field. Higher melanin absorbs more light, particularly at shorter wavelengths, which reduces signal and biases the red/IR ratio. Studies have found clinically significant SpO₂ overestimation in patients with darker skin using commercial devices. Raising LED current and calibrating per individual both help; pretending the problem does not exist does not.' },
    { q: 'How much battery does it use?', a: 'The LEDs dominate: at 7 mA each running continuously in SpO₂ mode, plus the ESP32, expect 25–40 mA average, which is about a day from a 1000 mAh cell. Duty-cycling to 15 seconds per minute takes it to roughly four days without losing anything useful for resting-rate tracking.' },
  ],

  refs: [
    { t: 'MAX30102 high-sensitivity pulse oximeter and heart-rate sensor — datasheet', u: 'https://www.analog.com/media/en/technical-documentation/data-sheets/MAX30102.pdf', s: 'Analog Devices' },
    { t: 'Allen, "Photoplethysmography and its application in clinical physiological measurement"', u: 'https://doi.org/10.1088/0967-3334/28/3/R01', s: 'Physiological Measurement, 2007' },
    { t: 'Tamura et al., "Wearable Photoplethysmographic Sensors — Past and Present"', u: 'https://doi.org/10.3390/electronics3020282', s: 'Electronics, 2014' },
    { t: 'Sjoding et al., "Racial Bias in Pulse Oximetry Measurement"', u: 'https://doi.org/10.1056/NEJMc2029240', s: 'New England Journal of Medicine, 2020' },
    { t: 'Shaffer & Ginsberg, "An Overview of Heart Rate Variability Metrics and Norms"', u: 'https://doi.org/10.3389/fpubh.2017.00258', s: 'Frontiers in Public Health, 2017' },
    { t: 'Elgendi, "On the Analysis of Fingertip Photoplethysmogram Signals"', u: 'https://doi.org/10.2174/157340312801215782', s: 'Current Cardiology Reviews, 2012' },
    { t: 'FDA guidance on pulse oximeters for medical purposes', u: 'https://www.fda.gov/medical-devices/safety-communications/pulse-oximeter-accuracy-and-limitations-fda-safety-communication', s: 'US FDA' },
  ],

  images: ['health', 'ecg', 'sensor'],
  imageCaptions: [
    'A wrist-worn fitness tracker. The optical sensor window must contact skin directly — a recess of even one millimetre halves the usable signal.',
    'A physiological waveform trace. PPG has a similar periodic structure to an ECG but measures blood volume rather than electrical activity.',
    'A sensor breakout module. The MAX30102 packages two LEDs, a photodiode and an 18-bit ADC in under 6 mm.',
  ],
},

];
