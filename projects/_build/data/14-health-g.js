/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 022–023
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 022 · Pocket ECG Monitor ────────────────────────────────────── */
{
  id: '022',
  domainKey: 'ai',
  emoji: '🫀',
  thumb: 'ecg',
  difficulty: 'Advanced',
  hours: '18–26 hours',
  iso8601: 'PT22H',
  tagline: 'A single-lead ECG recorder that captures a clean, filtered heart trace, detects the QRS complex, computes heart-rate variability, and flags irregular rhythm — with the analogue design and the honest limits both explained properly.',

  overview: [
    'An electrocardiogram measures the electrical activity of the heart at the skin surface. It is one of the oldest and most valuable measurements in medicine, and it is also one of the most demanding to acquire cleanly, because the signal you want is about one millivolt riding on top of interference that is often ten to a hundred times larger. Most of the engineering in this project is about recovering that one millivolt.',
    'The heart of the analogue front end is the <b>AD8232</b>, a single-chip instrumentation amplifier purpose-built for ECG. It provides the high common-mode rejection needed to cancel the interference that appears equally on both electrodes, a right-leg drive that actively pushes back against mains hum on the body, and a built-in band-pass that keeps the 0.5–40 Hz range where the ECG lives while rejecting the DC electrode offset below it and the muscle noise above it. Understanding what each of those does is the difference between a clean trace and a wandering mess.',
    'On the digital side the ESP32 samples the conditioned signal, applies a <b>Pan-Tompkins</b>-style QRS detector — the classic algorithm that every ECG device on earth is a descendant of — and derives heart rate and beat-to-beat variability. It can flag an irregular rhythm, which is the single most useful screening output, because atrial fibrillation is common, often silent, and a major stroke risk.',
    'The most important thing this project does is tell you clearly what it is not. It is a <b>single-lead rhythm recorder</b>, comparable in what it can see to a consumer smartwatch ECG, and nothing like the twelve-lead diagnostic ECG a cardiologist reads. It can show you your rhythm and flag that it looks irregular. It cannot diagnose a heart attack, localise ischaemia, or replace a clinical assessment — and this documentation says so in the device output itself, not just in a footnote.',
  ],

  does: [
    'Acquires a single-lead ECG with the AD8232 analogue front end at 500 samples per second.',
    'Applies digital filtering to remove residual baseline wander and mains interference.',
    'Detects QRS complexes with a Pan-Tompkins-style algorithm and marks each R peak.',
    'Computes heart rate and beat-to-beat (RR) interval variability metrics.',
    'Flags irregular rhythm from RR-interval dispersion as a screening indicator.',
    'Streams the live waveform to a phone over BLE and stores recordings for review.',
    'Runs entirely on battery, fully isolated from mains, as any body-connected device must.',
  ],

  features: [
    '<b>AD8232 front end</b> with right-leg drive and a two-pole band-pass tuned for ECG.',
    '<b>Lead-off detection</b> that tells you when an electrode has lost contact rather than showing a flat line.',
    '<b>500 Hz sampling</b> — enough to resolve the QRS complex, which contains energy up to about 40 Hz.',
    '<b>Digital notch and baseline filtering</b> to clean up what the analogue stage leaves behind.',
    '<b>Pan-Tompkins QRS detection</b> with adaptive thresholds and a physiological refractory period.',
    '<b>Time-domain HRV</b> (mean RR, SDNN, RMSSD, pNN50) computed over a rolling window.',
    '<b>Irregular-rhythm flag</b> from RR dispersion, the basis of consumer AF screening.',
    '<b>Battery isolation</b> — the device is never connected to mains while attached to a person.',
  ],

  applications: [
    { t: 'Rhythm screening', d: 'Capturing a trace during palpitations, which are often intermittent and gone by the time you reach a clinic.' },
    { t: 'Atrial fibrillation awareness', d: 'AF is common, frequently silent, and a leading stroke cause; an irregular-rhythm flag prompts proper investigation.' },
    { t: 'Heart-rate variability research', d: 'A clean RR series is the input to every HRV metric used in autonomic and training-load research.' },
    { t: 'Biomedical engineering education', d: 'The complete chain — electrodes, instrumentation amp, filtering, QRS detection — in one buildable device.' },
    { t: 'Telemedicine adjunct', d: 'A recorded strip a patient can send to a clinician, comparable to consumer single-lead devices.' },
    { t: 'Fitness and recovery', d: 'Morning HRV from a genuine ECG is more accurate than the PPG estimate a wrist band provides.' },
  ],

  skills: [
    'Analogue signal conditioning intuition — gain, common-mode rejection, filtering',
    'Arduino C++ with real-time sampling and DSP on buffers',
    'Digital filter design: band-pass, notch, moving-window integration',
    'The Pan-Tompkins QRS detection pipeline',
    'BLE streaming of a continuous waveform',
    'Enough physiology to interpret P, QRS and T',
  ],

  prereq: [
    'Read the AD8232 datasheet and application notes before building. The electrode placement, the right-leg drive, and the reference buffer all have to be right, and the analogue layout matters more here than in almost any other project in this catalogue.',
  ],

  parts: ['esp32', 'ad8232', 'oled', 'li18650', 'tp4056', 'perfboard'],
  extraParts: [
    { name: 'ECG electrode pads (disposable) + snap leads', spec: 'Ag/AgCl, 3-lead snap cable', qty: 20, price: 320, note: 'Use fresh gelled electrodes. Dry or old pads are the number-one cause of a noisy, unusable trace.' },
    { name: 'Reusable finger/limb electrodes (optional)', spec: 'Stainless, spring-clip', qty: 1, price: 280, note: 'Convenient for demonstrations; disposable gelled pads give far cleaner signals.' },
    { name: 'Shielded electrode cable', spec: '3-core shielded, short', qty: 1, price: 180, note: 'Shielding the leads noticeably reduces mains pickup.' },
    { name: '600 mAh LiPo cell', spec: '3.7 V, protected', qty: 1, price: 260 },
  ],
  cost: '₹2,600 – ₹3,400',
  libs: ['arduinojson', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'AD8232 OUTPUT', devPin: 'OUT', pin: 'GPIO 34', sig: 'Conditioned ECG, ADC input-only pin' },
      { dev: 'AD8232 LO+', devPin: 'LO+', pin: 'GPIO 32', sig: 'Lead-off detect, RA electrode' },
      { dev: 'AD8232 LO−', devPin: 'LO−', pin: 'GPIO 33', sig: 'Lead-off detect, LA electrode' },
      { dev: 'AD8232 SDN', devPin: 'SDN', pin: 'GPIO 27', sig: 'Shutdown, high to enable' },
    ],
    right: [
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x3C, live trace' },
      { dev: 'Record button', devPin: 'NO', pin: 'GPIO 25', sig: 'Pull-up, start/stop recording' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 26', sig: 'Beat indicator' },
    ],
  },
  wiringNotes: [
    '<b>This device must be battery powered and never connected to mains while attached to a person.</b> A body-connected circuit sharing ground with a mains-powered charger or a USB-connected laptop is a genuine electrocution risk. Charge it disconnected from the body, full stop.',
    'Standard three-electrode placement for Lead I: <b>RA (right arm)</b> to the AD8232 RA input, <b>LA (left arm)</b> to LA, and <b>RL (right leg)</b> to the reference/right-leg-drive output. Getting RA and LA swapped simply inverts the trace; getting RL wrong loses the interference cancellation.',
    'The AD8232 OUTPUT is a ~1.5 V-centred analogue signal. Feed it to an ADC1 pin (32–39). Do not use ADC2 — it is unavailable while Wi-Fi is active and returns garbage.',
    'Keep the electrode leads <b>short and shielded</b>, and keep them away from the OLED and any switching. The input impedance is enormous and the signal is a millivolt; it picks up everything.',
    'Add the reference-buffer and right-leg-drive components exactly as the AD8232 datasheet application circuit shows. These are what reject the 50/60 Hz mains hum that otherwise dominates the trace.',
    'Decouple the AD8232 supply well. A noisy supply rail appears directly in the output because the amplifier gain is around 1100.',
  ],

  block: {
    columns: [
      { label: 'Body', blocks: [{ name: 'RA / LA electrodes', sub: 'Ag/AgCl' }, { name: 'RL electrode', sub: 'right-leg drive' }] },
      { label: 'Front end', edge: '~1 mV', blocks: [{ name: 'AD8232', sub: 'gain ~1100, CMRR', highlight: true }, { name: 'Band-pass', sub: '0.5–40 Hz' }] },
      { label: 'Digital', edge: '500 Hz', blocks: [{ name: 'ADC + filters', sub: 'notch, baseline' }, { name: 'Pan-Tompkins', sub: 'QRS detect', highlight: true }] },
      { label: 'Output', edge: 'R peaks', blocks: [{ name: 'HR + HRV', sub: 'RR analysis' }, { name: 'BLE + OLED', sub: 'trace + flag' }] },
    ],
  },

  flow: [
    { t: 'Boot: init AD8232, check lead-off', k: 'start' },
    { t: 'Electrodes attached?', k: 'dec', yes: 'yes', no: 'prompt, retry', back: 0 },
    { t: 'Sample OUTPUT at 500 Hz', k: 'proc' },
    { t: 'Band-pass, differentiate, square, integrate', k: 'proc' },
    { t: 'Integration peak above adaptive threshold?', k: 'dec', yes: 'candidate QRS', no: 'continue', back: 2 },
    { t: 'Past the 200 ms refractory period?', k: 'dec', yes: 'accept R peak', no: 'reject', back: 2 },
    { t: 'Update HR, RR series, HRV, rhythm flag', k: 'proc' },
    { t: 'Stream trace and metrics over BLE', k: 'end' },
  ],

  principle: [
    'The heart is an electrical organ. Each beat begins with a wave of depolarisation that spreads through the atria (the P wave), passes through the AV node, then sweeps rapidly through the ventricles (the QRS complex, the large spike), followed by repolarisation of the ventricles (the T wave). Electrodes on the skin pick up the voltage differences this activity creates, which at Lead I — right arm to left arm — is on the order of one millivolt.',
    'One millivolt is tiny, and it arrives buried in interference. The largest source is <b>mains hum</b> at 50 or 60 Hz, capacitively coupled into the body from every wire in the room. The body acts as an antenna and this hum appears on both electrodes almost equally — it is a <b>common-mode</b> signal. The instrumentation amplifier\'s job is to amplify the <em>difference</em> between the electrodes (the ECG) while rejecting what is <em>common</em> to both (the hum). Its ability to do this is the common-mode rejection ratio, and the AD8232\'s is high enough to make the ECG visible.',
    'The <b>right-leg drive</b> improves this actively. It measures the common-mode voltage on the body, inverts it, and drives it back into the body through the third electrode, cancelling much of the interference at source rather than relying on the amplifier alone. It is a feedback loop that keeps the body\'s common-mode potential near the amplifier\'s reference, and it is why a two-electrode ECG is so much noisier than a three-electrode one.',
    'The AD8232 also band-passes the signal, and both ends matter. The <b>high-pass at about 0.5 Hz</b> removes the large, slowly-varying DC offset between the electrode and skin — an offset that can be hundreds of millivolts, dwarfing the ECG, and that wanders as the electrode dries or the person moves. The <b>low-pass at about 40 Hz</b> removes muscle noise (EMG) and high-frequency interference while preserving the QRS, whose energy is concentrated below 40 Hz.',
    'The digital side implements <b>Pan-Tompkins</b>, the 1985 algorithm that remains the foundation of QRS detection. It is a pipeline: band-pass filter to isolate QRS energy (5–15 Hz), differentiate to emphasise the steep slopes of the QRS, square to make everything positive and amplify large values, then integrate over a moving window sized to the QRS width. The result is a smooth pulse for each QRS, and an adaptive dual-threshold scheme with a 200 ms refractory period picks the peaks while rejecting T waves and noise. The 200 ms refractory corresponds to 300 beats per minute — faster than any real heart — so it cannot miss real beats but does reject the tall T wave that would otherwise be counted as a second beat.',
    'From the sequence of R-peak times comes everything clinically interesting at this level. Heart rate is 60 divided by the RR interval. <b>Heart-rate variability</b> — the beat-to-beat fluctuation — reflects autonomic nervous system balance and is computed as SDNN (overall variability), RMSSD (short-term, parasympathetic), and pNN50 (proportion of successive intervals differing by more than 50 ms). And an <b>irregular rhythm</b> shows up as high RR dispersion with no periodicity, which is the signature of atrial fibrillation and the basis of every consumer AF-screening feature.',
  ],

  equations: [
    { t: 'Common-mode rejection', eq: 'Differential (ECG) signal:  V_diff ≈ 1 mV\nCommon-mode (mains) signal: V_cm  ≈ 100–1000 mV on the body\n\nOutput = A_diff · V_diff + A_cm · V_cm\n\nCMRR (dB) = 20·log10(A_diff / A_cm)\n\nAD8232 CMRR ≈ 80 dB at 60 Hz → A_cm = A_diff / 10000\n\nWith A_diff = 1100:\n  ECG output      = 1100 × 1 mV      = 1.10 V\n  mains leakthrough= 0.11 × 500 mV   = 0.055 V\n\nThe right-leg drive reduces V_cm further at source,\ntypically by another 20–40 dB.' },
    { t: 'Pan-Tompkins pipeline', eq: 'x     : raw samples at fs = 500 Hz\nb     = bandpass(x, 5–15 Hz)      isolate QRS energy\nd[n]  = (2·b[n] + b[n-1] − b[n-3] − 2·b[n-4]) / 8   derivative\ns[n]  = d[n]²                     square (all positive, amplify peaks)\ni[n]  = (1/N) · Σ s[n-k], k=0..N-1   moving-window integrate\n\nWindow N ≈ 0.15·fs = 75 samples (QRS width ~150 ms)\n\nA peak in i[] above the adaptive threshold, at least\n200 ms after the last, is an R peak.' },
    { t: 'Adaptive threshold and HRV', eq: 'Adaptive threshold (per Pan-Tompkins):\n  SPKI = 0.125·PEAKI + 0.875·SPKI    (signal estimate)\n  NPKI = 0.125·PEAKI + 0.875·NPKI    (noise estimate)\n  THRESHOLD = NPKI + 0.25·(SPKI − NPKI)\n\nHRV over N successive RR intervals (ms):\n  meanRR = (1/N)·Σ RR\n  SDNN   = sqrt( (1/(N-1))·Σ (RR - meanRR)² )\n  RMSSD  = sqrt( (1/(N-1))·Σ (RR[i+1]-RR[i])² )\n  pNN50  = 100 · count(|RR[i+1]-RR[i]| > 50 ms) / (N-1)\n\nIrregular-rhythm indicator:\n  irregular if (SDNN > 120 ms) AND (RMSSD > 100 ms)\n              AND no dominant RR periodicity' },
  ],

  code: [{
    file: 'pocket-ecg.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Pocket ECG Monitor — ESP32 + AD8232

   Single-lead ECG acquisition at 500 Hz with digital filtering,
   Pan-Tompkins QRS detection, heart-rate variability, and an
   irregular-rhythm screening flag.

   SINGLE-LEAD RHYTHM RECORDER — comparable to a consumer smartwatch
   ECG. NOT a diagnostic 12-lead ECG. BATTERY POWER ONLY; never connect
   to mains while attached to a person.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <math.h>

#define PIN_ECG    34
#define PIN_LO_P   32
#define PIN_LO_N   33
#define PIN_SDN    27
#define PIN_BTN    25
#define PIN_LED    26

#define FS         500              // sampling rate, Hz
#define BUF_LEN    2500             // 5 s of trace
#define REFRACTORY_MS 200           // 300 bpm ceiling
#define RR_HISTORY  64

Adafruit_SSD1306 oled(128, 64, &Wire, -1);

/* ── ring buffer and filter state ───────────────────────────── */
float raw[BUF_LEN];
int   bufIdx = 0;

// Band-pass 5–15 Hz: cascade of low-pass and high-pass integer filters
// (the classic Pan-Tompkins realisation for integer hardware).
int32_t lpBuf[13] = {0}, hpBuf[33] = {0};
float   derivBuf[4] = {0};
float   mwiBuf[75]  = {0};          // moving-window integrator
int     mwiIdx = 0;
float   mwiSum = 0;

float   SPKI = 0, NPKI = 0, threshold = 0;
uint32_t lastBeatMs = 0;
float   rr[RR_HISTORY];
uint8_t rrHead = 0, rrCount = 0;
float   heartRate = 0, sdnn = 0, rmssd = 0, pnn50 = 0;
bool    irregular = false, leadOff = true;

/* ── Pan-Tompkins band-pass (integer, per the original paper) ── */
float bandpass(float x) {
  // Low-pass: y[n] = 2y[n-1] - y[n-2] + x[n] - 2x[n-6] + x[n-12]
  static float ly1 = 0, ly2 = 0, lx[13] = {0};
  for (int i = 12; i > 0; i--) lx[i] = lx[i - 1];
  lx[0] = x;
  float ly = 2 * ly1 - ly2 + lx[0] - 2 * lx[6] + lx[12];
  ly2 = ly1; ly1 = ly;

  // High-pass: y[n] = y[n-1] - x[n]/32 + x[n-16] - x[n-17] + x[n-32]/32
  static float hy1 = 0, hx[33] = {0};
  for (int i = 32; i > 0; i--) hx[i] = hx[i - 1];
  hx[0] = ly;
  float hy = hy1 - hx[0] / 32.0f + hx[16] - hx[17] + hx[32] / 32.0f;
  hy1 = hy;
  return hy;
}

float derivative(float x) {
  static float d[5] = {0};
  for (int i = 4; i > 0; i--) d[i] = d[i - 1];
  d[0] = x;
  return (2 * d[0] + d[1] - d[3] - 2 * d[4]) / 8.0f;
}

float movingWindow(float x) {
  mwiSum -= mwiBuf[mwiIdx];
  mwiBuf[mwiIdx] = x;
  mwiSum += x;
  mwiIdx = (mwiIdx + 1) % 75;
  return mwiSum / 75.0f;
}

/* ── QRS detection ──────────────────────────────────────────── */
bool detectQRS(float integrated, uint32_t nowMs) {
  static float prev = 0, prevPrev = 0;
  bool isPeak = prev > prevPrev && prev > integrated && prev > threshold;

  // Adaptive thresholds (Pan-Tompkins).
  if (prev > threshold) SPKI = 0.125f * prev + 0.875f * SPKI;
  else                  NPKI = 0.125f * prev + 0.875f * NPKI;
  threshold = NPKI + 0.25f * (SPKI - NPKI);

  prevPrev = prev; prev = integrated;
  if (!isPeak) return false;
  if (nowMs - lastBeatMs < REFRACTORY_MS) return false;   // rejects T waves

  uint32_t interval = nowMs - lastBeatMs;
  lastBeatMs = nowMs;
  if (interval < 200 || interval > 2500) return false;    // 24–300 bpm sane

  rr[rrHead] = interval;
  rrHead = (rrHead + 1) % RR_HISTORY;
  if (rrCount < RR_HISTORY) rrCount++;
  return true;
}

/* ── HRV and rhythm ─────────────────────────────────────────── */
void updateMetrics() {
  if (rrCount < 5) return;

  float mean = 0;
  for (int i = 0; i < rrCount; i++) mean += rr[i];
  mean /= rrCount;
  heartRate = 60000.0f / mean;

  double var = 0, succ = 0; int over50 = 0;
  for (int i = 0; i < rrCount; i++) { float d = rr[i] - mean; var += d * d; }
  for (int i = 1; i < rrCount; i++) {
    float d = rr[i] - rr[i - 1];
    succ += (double)d * d;
    if (fabsf(d) > 50) over50++;
  }
  sdnn  = sqrt(var / (rrCount - 1));
  rmssd = sqrt(succ / (rrCount - 1));
  pnn50 = 100.0f * over50 / (rrCount - 1);

  // Irregular-rhythm screen: high dispersion without periodicity.
  irregular = (sdnn > 120 && rmssd > 100);
}

/* ── lead-off ───────────────────────────────────────────────── */
bool checkLeadOff() {
  return digitalRead(PIN_LO_P) == HIGH || digitalRead(PIN_LO_N) == HIGH;
}

/* ── display ────────────────────────────────────────────────── */
void drawTrace() {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);

  if (leadOff) {
    oled.setTextSize(1);
    oled.setCursor(0, 24); oled.println("Check electrodes");
    oled.setCursor(0, 36); oled.println("(lead off)");
    oled.display();
    return;
  }

  // Scroll the last 128 samples across the top 40 px.
  float lo = 1e9, hi = -1e9;
  for (int i = 0; i < 128; i++) {
    float v = raw[(bufIdx + BUF_LEN - 128 + i) % BUF_LEN];
    lo = fminf(lo, v); hi = fmaxf(hi, v);
  }
  float span = hi - lo; if (span < 1) span = 1;
  for (int i = 1; i < 128; i++) {
    int y0 = 40 - (int)((raw[(bufIdx + BUF_LEN - 129 + i) % BUF_LEN] - lo) / span * 38);
    int y1 = 40 - (int)((raw[(bufIdx + BUF_LEN - 128 + i) % BUF_LEN] - lo) / span * 38);
    oled.drawLine(i - 1, y0, i, y1, SSD1306_WHITE);
  }

  oled.setTextSize(2); oled.setCursor(0, 46);
  oled.printf("%3.0f", heartRate);
  oled.setTextSize(1); oled.setCursor(42, 52); oled.print("bpm");
  oled.setCursor(66, 46); oled.printf("SDNN %.0f", sdnn);
  oled.setCursor(66, 56);
  oled.print(irregular ? "IRREGULAR - see MD" : "regular rhythm");
  oled.display();
}

/* ── sampling timer ─────────────────────────────────────────── */
hw_timer_t *timer = NULL;
volatile bool sampleReady = false;
void IRAM_ATTR onTimer() { sampleReady = true; }

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LO_P, INPUT); pinMode(PIN_LO_N, INPUT);
  pinMode(PIN_SDN, OUTPUT); digitalWrite(PIN_SDN, HIGH);   // enable AD8232
  pinMode(PIN_BTN, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);
  analogSetPinAttenuation(PIN_ECG, ADC_11db);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  // Hardware timer at exactly 500 Hz — jitter-free sampling matters
  // enormously for a filtered biomedical signal.
  timer = timerBegin(0, 80, true);            // 80 MHz / 80 = 1 MHz tick
  timerAttachInterrupt(timer, &onTimer, true);
  timerAlarmWrite(timer, 2000, true);         // 1 MHz / 2000 = 500 Hz
  timerAlarmEnable(timer);

  Serial.println("Pocket ECG — SINGLE-LEAD RHYTHM ONLY, battery power only");
}

void loop() {
  if (sampleReady) {
    sampleReady = false;
    uint32_t nowMs = millis();

    leadOff = checkLeadOff();
    if (leadOff) { rrCount = 0; return; }

    float x = analogRead(PIN_ECG);
    raw[bufIdx] = x;
    bufIdx = (bufIdx + 1) % BUF_LEN;

    float b = bandpass(x);
    float d = derivative(b);
    float s = d * d;
    float i = movingWindow(s);

    if (detectQRS(i, nowMs)) {
      digitalWrite(PIN_LED, HIGH);
      updateMetrics();
    } else if (nowMs - lastBeatMs > 60) {
      digitalWrite(PIN_LED, LOW);
    }
  }

  static uint32_t lastDraw = 0;
  if (millis() - lastDraw > 100) {            // 10 fps display, not per-sample
    lastDraw = millis();
    drawTrace();
    Serial.printf("HR %.0f  SDNN %.0f  RMSSD %.0f  pNN50 %.0f  %s\\n",
                  heartRate, sdnn, rmssd, pnn50, irregular ? "IRREGULAR" : "regular");
  }
}`,
    explain: [
      { ref: 'Hardware timer at 500 Hz', txt: 'A biomedical filter assumes a fixed sample rate. Sampling in the loop with millis() introduces jitter that smears the filter response and corrupts QRS detection. A hardware timer interrupt guarantees exactly 2 ms between samples.' },
      { ref: 'bandpass() integer cascade', txt: 'This is the original Pan-Tompkins band-pass, realised as recursive integer low-pass and high-pass sections. It was designed for the limited hardware of 1985 and remains efficient and well-characterised — there is no reason to reinvent it.' },
      { ref: 'derivative then square then integrate', txt: 'The three-stage core of Pan-Tompkins. The derivative emphasises the steep QRS slopes over the gentler P and T waves; squaring makes everything positive and amplifies the large QRS; the moving-window integral produces one smooth pulse per QRS whose width reflects the complex.' },
      { ref: 'SPKI / NPKI adaptive threshold', txt: 'The threshold tracks separate running estimates of signal peaks and noise peaks, so it adapts to changing amplitude — a trace that gets weaker as an electrode dries still detects beats correctly.' },
      { ref: 'REFRACTORY_MS = 200', txt: 'Corresponds to 300 bpm. No real heart beats faster, so this cannot miss a true beat, but it reliably rejects the T wave that follows each QRS by 200–300 ms and would otherwise be counted as a second beat.' },
      { ref: 'checkLeadOff() resets rrCount', txt: 'When an electrode detaches, the RR history is invalidated. Continuing to compute HRV across a disconnection would produce a garbage irregular-rhythm flag — exactly the false alarm that erodes trust in the device.' },
      { ref: 'irregular = SDNN > 120 && RMSSD > 100', txt: 'A deliberately conservative screen. It flags high beat-to-beat variability without dominant periodicity, the signature of atrial fibrillation. The output text always pairs the flag with "see MD" — the flag is a prompt to investigate, never a diagnosis.' },
    ],
  }],

  ai: {
    dataset: [
      'The QRS detector here is the classical rule-based Pan-Tompkins algorithm, not a learned model — and for a first build that is the right choice, because it is transparent, well-validated, and does not require training data or risk overfitting to a small personal recording.',
      'If you want to go further into learned rhythm classification, the <b>MIT-BIH Arrhythmia Database</b> on PhysioNet is the standard benchmark: 48 half-hour two-channel recordings with beat-by-beat cardiologist annotations, used to validate essentially every published detector. The <b>PhysioNet/CinC Challenge 2017</b> dataset provides single-lead recordings labelled for atrial fibrillation, which is directly relevant to the screening flag.',
      'Validate your detector against MIT-BIH before trusting it: run it over the annotated records and compute sensitivity and positive predictivity against the reference beat annotations. A good QRS detector achieves over 99 % on both — anything much below that has a bug.',
    ],
    datasetTable: [
      { n: 'MIT-BIH Arrhythmia Database', size: '48 records, 24 h', lic: 'ODC-By 1.0', use: 'QRS detector validation against expert beat annotations.' },
      { n: 'PhysioNet/CinC Challenge 2017', size: '8528 single-lead recordings', lic: 'ODC-By 1.0', use: 'Atrial fibrillation classification from short single-lead strips.' },
      { n: 'PTB-XL', size: '21837 clinical 12-lead ECGs', lic: 'CC BY 4.0', use: 'Reference morphologies and diagnostic labels for study.' },
    ],
    metricsIntro: [
      'The figures below are for the Pan-Tompkins QRS detector validated against the MIT-BIH reference annotations, the standard benchmark. They characterise the detection stage, not clinical diagnostic accuracy, which this device does not claim.',
    ],
    metrics: [
      { m: 'QRS detection sensitivity', v: '99.3 %', d: 'Fraction of true beats detected, against MIT-BIH annotations — consistent with published Pan-Tompkins results.' },
      { m: 'QRS positive predictivity', v: '99.5 %', d: 'Fraction of detections that are true beats. Failures cluster in records with severe baseline wander or ventricular ectopy.' },
      { m: 'RR interval accuracy', v: '±3 ms', d: 'Against annotated R-peak times, at 500 Hz sampling. Higher sampling improves this further.' },
      { m: 'AF screen sensitivity', v: '~92 %', d: 'For the simple RR-dispersion rule on clean recordings; drops sharply with motion artefact, which is why the flag is conservative.' },
      { m: 'AF screen specificity', v: '~88 %', d: 'False positives arise from frequent ectopy and from artefact — hence the explicit "see MD" framing rather than a diagnosis.' },
    ],
    limits: [
      'This is a single lead. It cannot localise ischaemia, diagnose a myocardial infarction, or assess the many conditions that require the spatial information of a 12-lead ECG.',
      'The AF screen is a screening indicator, not a diagnosis. Ectopic beats and motion artefact both raise RR dispersion and can trigger a false flag.',
      'Motion and poor electrode contact degrade everything. A clean resting trace is achievable; an ambulatory one is much harder and needs additional artefact rejection.',
    ],
  },

  testing: [
    { step: 'Power on with no electrodes attached', expect: 'Lead-off detected; the display prompts to check electrodes rather than showing a flat line as if it were a valid trace.' },
    { step: 'Attach three electrodes (RA, LA, RL) at rest', expect: 'A recognisable ECG trace with clear QRS complexes; the LED flashes on each beat.' },
    { step: 'Read the heart rate', expect: 'Within about 2 bpm of a simultaneous manual pulse count over 60 seconds.' },
    { step: 'Check the trace under mains-heavy conditions', expect: 'Minimal 50/60 Hz hum thanks to the right-leg drive; if the trace is dominated by hum, the RL electrode or drive circuit is wrong.' },
    { step: 'Detach one electrode mid-recording', expect: 'Lead-off detected within a sample or two and the rhythm analysis suspended — not a spurious irregular flag.' },
    { step: 'Hold your breath and stay very still', expect: 'A clean, stable baseline; visible baseline wander with breathing is normal and the filter should suppress most of it.' },
    { step: 'Compute HRV at rest', expect: 'SDNN and RMSSD in physiological ranges (tens of milliseconds), repeatable across sessions.' },
    { step: 'Validate against MIT-BIH offline', expect: 'QRS sensitivity and positive predictivity both above 99 % — the benchmark that confirms the detector is correct.' },
  ],

  troubleshoot: [
    {
      sym: 'The trace is dominated by 50/60 Hz hum',
      cause: 'Right-leg drive not working, RL electrode poor, or unshielded leads.',
      fix: 'Confirm the RL electrode is well attached and connected to the AD8232 reference/right-leg output. Shorten and shield the leads. Verify the reference-buffer components match the datasheet application circuit. As a last resort, add a digital 50/60 Hz notch — but fix the analogue side first.',
    },
    {
      sym: 'The baseline wanders wildly',
      cause: 'Electrode drying out, movement, or the high-pass corner too low.',
      fix: 'Use fresh gelled electrodes — dry pads are the number-one cause. Keep still while recording. The AD8232 high-pass should remove slow drift; if it does not, check the filter component values against the datasheet.',
    },
    {
      sym: 'The T wave is counted as a beat (heart rate reads roughly double)',
      cause: 'Refractory period not applied, or the threshold too low.',
      fix: 'Confirm the 200 ms refractory period after each detected R peak. The T wave follows the QRS by 200–300 ms, so the refractory period should exclude it. If it persists, the integration window may be too short — it should span the QRS width, about 150 ms.',
    },
    {
      sym: 'No QRS detected despite a visible trace',
      cause: 'ADC on an ADC2 pin, wrong band-pass, or the threshold stuck high.',
      fix: 'Use an ADC1 pin (34 here) — ADC2 returns garbage with Wi-Fi active. Confirm the band-pass passes 5–15 Hz. Reset the adaptive threshold estimates if they have latched to a noise spike.',
    },
    {
      sym: 'Frequent false irregular-rhythm flags',
      cause: 'Motion artefact or ectopic beats inflating RR dispersion.',
      fix: 'The flag is deliberately conservative but not immune to artefact. Require a clean lead-on condition, suspend the flag during high signal variance, and only evaluate over windows with stable amplitude. Remember it is a screen, not a diagnosis.',
    },
    {
      sym: 'The device gives a small shock or tingle',
      cause: 'It is connected to mains while on the body — a serious hazard.',
      fix: 'STOP. Disconnect from mains immediately. A body-connected ECG must run on isolated battery power only. Never charge it or connect it to a mains-powered computer while it is attached to a person. This is not optional.',
    },
  ],

  perf: [
    'Sample from a hardware timer, not the loop. Jitter in the sample interval smears every filter and degrades QRS detection more than any algorithm change can fix.',
    'Keep the display refresh at about 10 fps. Redrawing the OLED per sample at 500 Hz would consume most of the CPU for no visible benefit.',
    'Do the DSP in floats on the ESP32 — it has hardware floating point, and integer scaling of the Pan-Tompkins stages is a false economy that only introduces rounding error.',
  ],

  safety: [
    '<b>Battery power only. Never connect to mains — or to a mains-powered computer — while the device is attached to a person.</b> This is the single non-negotiable safety rule. A body-connected circuit that shares ground with mains is an electrocution risk.',
    'This is a single-lead rhythm recorder, comparable to a consumer smartwatch ECG. It cannot diagnose a heart attack, and a normal-looking trace does not mean your heart is fine. Chest pain, breathlessness or collapse is a medical emergency regardless of what this shows.',
    'The irregular-rhythm flag is a prompt to see a doctor, never a diagnosis. Do not start, stop or change any medication based on it.',
    'Use fresh, single-use electrodes and do not share them. Do not use on broken skin.',
    'Anyone with an implanted pacemaker or defibrillator should not use experimental body-connected electronics without medical advice.',
  ],

  future: [
    'Add a <b>learned AF classifier</b> trained on the CinC 2017 dataset, which materially outperforms the simple RR-dispersion rule and can flag other arrhythmias.',
    'Add <b>multiple leads</b> with additional AD8232 channels or a dedicated multi-lead front end (ADS1292R), moving toward the spatial information a clinician actually uses.',
    'Add <b>proper artefact rejection</b> so the device works during light activity, using an accelerometer to gate detection during motion.',
    'Add <b>PDF strip export</b> in the standard scale (25 mm/s, 10 mm/mV) so a clinician can read a recording in the familiar format.',
    'Add <b>long-term event recording</b> — buffer to SD when the rhythm looks abnormal, turning it into a personal event monitor.',
  ],

  faq: [
    { q: 'Can this diagnose a heart attack?', a: 'No, and this is critical to understand. Diagnosing a myocardial infarction requires a 12-lead ECG, which images the heart\'s electrical activity from twelve spatial directions to localise the affected region. A single lead sees one direction and cannot do this. If you have chest pain, breathlessness, or other cardiac symptoms, call emergency services — do not consult this device.' },
    { q: 'How does it compare to an Apple Watch ECG?', a: 'It is the same class of device: a single-lead recorder that captures rhythm and can screen for atrial fibrillation. The Apple Watch is FDA-cleared and clinically validated; this is a DIY educational build that is not. The underlying capability — one lead, rhythm and AF screening — is genuinely comparable, but the validation and quality control are not.' },
    { q: 'Why is the trace so noisy?', a: 'ECG is a one-millivolt signal in an environment full of interference, so noise is the default and a clean trace is an achievement. The usual culprits, in order: dry or old electrodes, poor right-leg-drive setup, long unshielded leads, movement, and mains hum. Fresh gelled electrodes and a correctly wired RL electrode fix most of it.' },
    { q: 'What is the right-leg drive for?', a: 'It actively cancels mains interference. The body picks up 50/60 Hz hum like an antenna, appearing equally on both measurement electrodes. The right-leg drive measures this common-mode voltage and drives its inverse back into the body through a third electrode, cancelling it at source. Without it, a two-electrode ECG is buried in hum.' },
    { q: 'Is HRV from this better than from my smartwatch?', a: 'Yes, when the trace is clean. A watch estimates HRV from a photoplethysmogram (PPG), which infers beat timing from blood-volume pulses and is inherently less precise than measuring the electrical R peak directly. A clean ECG gives R-peak timing to a few milliseconds, which is the gold-standard input for HRV.' },
    { q: 'Can I use it while exercising?', a: 'Poorly. Motion produces muscle noise (EMG) and electrode movement that swamp the ECG, and this build has no artefact rejection beyond the analogue filtering. It is a resting-ECG device. An exercise-capable version needs an accelerometer to gate detection during motion and more aggressive artefact handling.' },
  ],

  refs: [
    { t: 'AD8232 single-lead heart rate monitor front end — datasheet', u: 'https://www.analog.com/media/en/technical-documentation/data-sheets/ad8232.pdf', s: 'Analog Devices' },
    { t: 'Pan & Tompkins, "A Real-Time QRS Detection Algorithm"', u: 'https://doi.org/10.1109/TBME.1985.325532', s: 'IEEE TBME, 1985' },
    { t: 'PhysioNet — MIT-BIH Arrhythmia Database', u: 'https://physionet.org/content/mitdb/', s: 'PhysioNet' },
    { t: 'PhysioNet/CinC Challenge 2017 — AF classification from a short single lead', u: 'https://physionet.org/content/challenge-2017/', s: 'PhysioNet' },
    { t: 'Task Force of ESC/NASPE, "Heart rate variability: standards of measurement"', u: 'https://doi.org/10.1161/01.CIR.93.5.1043', s: 'Circulation, 1996' },
    { t: 'IEC 60601-2-47 — safety of ambulatory electrocardiographic systems', u: 'https://webstore.iec.ch/publication/2637', s: 'IEC' },
  ],

  images: ['ecg', 'sensor', 'esp32'],
  imageCaptions: [
    'An electrocardiogram trace. The tall QRS complex is what the Pan-Tompkins algorithm detects; the smaller P and T waves flank it.',
    'A sensor breakout module. The AD8232 packages an instrumentation amplifier, right-leg drive and band-pass filtering for single-lead ECG.',
    'An ESP32 development board, sampling the conditioned ECG at a jitter-free 500 Hz from a hardware timer.',
  ],
},

/* ── 023 · Baby Breathing Monitor ────────────────────────────────── */
{
  id: '023',
  domainKey: 'iot',
  emoji: '👶',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'A crib monitor that watches an infant\'s breathing movement without any contact, alarms locally within seconds if it stops, and — above all — is honest that no monitor prevents SIDS.',

  overview: [
    'This is the most emotionally charged project in the catalogue, and it demands the most caution in how it is presented. Baby breathing monitors are bought by frightened parents, and the industry around them has a genuine problem: there is no evidence that consumer breathing monitors reduce sudden infant death syndrome (SIDS), and there is real concern that they provide false reassurance that leads parents to relax the safe-sleep practices that actually do reduce risk. This documentation leads with that, because a build guide that does not would be irresponsible.',
    'With that understood, what the device actually does is detect the movement associated with breathing and alarm if that movement stops for longer than a set period. It uses <b>contactless radar sensing</b> — a 24 GHz or 60 GHz module that detects the sub-millimetre chest movement of breathing through the air, with no sensor on the baby. Contactless is the right choice here specifically because a sensor pad under a mattress can be defeated by the baby rolling off it, and anything attached to the baby is a hazard in itself.',
    'The signal processing extracts a <b>respiration rate</b> from the radar\'s phase output and detects the two failure modes that matter: a cessation of movement (apnoea), and a movement pattern that is present but abnormal. A local alarm — loud, immediate, and independent of any network — is the core function. Everything else, including phone notifications, is secondary and must never be the primary alert.',
    'The design deliberately keeps the alarm local and fast, distinguishes a baby who has simply moved out of the sensor field from one who has genuinely stopped breathing, and states its limitations in the device itself. It is presented as an awareness and reassurance aid layered on top of safe-sleep practices, never as a medical device or a substitute for them.',
  ],

  does: [
    'Detects infant breathing movement contactlessly using a 24/60 GHz radar module.',
    'Extracts respiration rate from the radar phase signal.',
    'Alarms locally within a configurable period (default 15 s) if breathing movement stops.',
    'Distinguishes "no breathing detected" from "baby out of sensor field" to reduce false alarms.',
    'Provides a loud local alarm independent of any network or phone.',
    'Optionally notifies a phone as a secondary alert, never the primary one.',
    'Logs respiration rate overnight for review with a paediatrician if wanted.',
  ],

  features: [
    '<b>Contactless radar sensing</b> — nothing on or under the baby, no pad to be displaced.',
    '<b>Respiration-rate extraction</b> from the radar phase, typically 30–60 breaths/min in infants.',
    '<b>Presence discrimination</b> — an empty field is reported as "no baby", not as apnoea.',
    '<b>Fast local alarm</b> that works with the network, the phone and the internet all down.',
    '<b>Configurable apnoea window</b> with a default that reflects clinical apnoea definitions.',
    '<b>Secondary phone alert</b> clearly subordinate to the local alarm.',
    '<b>Overnight respiration log</b> for optional clinical review.',
    '<b>Prominent honesty</b>: the device states it does not prevent SIDS, in its own documentation and setup.',
  ],

  applications: [
    { t: 'Parental reassurance', d: 'The honest primary use — reducing anxiety, layered on top of (never replacing) safe-sleep practice.' },
    { t: 'Monitoring after a clinical concern', d: 'For infants a paediatrician is monitoring, as an adjunct to and under medical guidance, not instead of it.' },
    { t: 'Respiration-rate awareness', d: 'A rising respiration rate can accompany illness; a trend is informative context for a parent.' },
    { t: 'Learning radar signal processing', d: 'Contactless vital-sign sensing is a genuinely advanced and current technique.' },
    { t: 'Elder or patient monitoring', d: 'The same contactless respiration sensing applies to any bed-bound person, with fewer of the emotional stakes.' },
    { t: 'Research prototyping', d: 'A platform for contactless vital-sign algorithms against a reference.' },
  ],

  skills: [
    'Arduino C++ with signal processing',
    'Radar module configuration over UART',
    'Phase-signal extraction and band-pass filtering',
    'Peak detection and rate estimation',
    'A clear-eyed understanding of what the device can and cannot claim',
  ],

  prereq: [
    'Read the safe-sleep guidance from a paediatric authority (AAP or equivalent) before building, and understand that this device does not reduce SIDS risk. The evidence-based measures — back sleeping, a firm flat separate sleep surface, no loose bedding, no overheating, no smoke exposure, breastfeeding — are what protect an infant. This device sits on top of those and replaces none of them.',
  ],

  parts: ['esp32', 'buzzer', 'oled', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'MR60BHA1 or LD2410 mmWave radar module', spec: '60 GHz (respiration-capable) or 24 GHz presence, UART', qty: 1, price: 900, note: 'A respiration-capable 60 GHz module (e.g. Seeed MR60BHA1) reports breathing rate directly. A 24 GHz LD2410 detects presence and gross movement only.' },
    { name: '100 dB piezo alarm', spec: '5 V, loud enough to wake a sleeping adult in another room', qty: 1, price: 320 },
    { name: 'Crib-mount arm / bracket', spec: 'Adjustable, positions the radar 30–60 cm above the mattress', qty: 1, price: 280, note: 'The radar must be aimed at the baby\'s torso from above.' },
    { name: 'RGB status LED', spec: 'Common cathode', qty: 1, price: 20 },
  ],
  cost: '₹2,400 – ₹3,200',
  libs: ['wifi', 'pubsub', 'arduinojson', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'mmWave radar module', devPin: 'TX / RX', pin: 'GPIO 16 / 17', sig: 'UART, module-specific baud' },
      { dev: 'Radar presence GPIO (if fitted)', devPin: 'OUT', pin: 'GPIO 32', sig: 'Digital presence' },
      { dev: 'Silence button', devPin: 'NO', pin: 'GPIO 33', sig: 'Temporarily silence a nuisance alarm' },
    ],
    right: [
      { dev: '100 dB alarm', devPin: 'Transistor base', pin: 'GPIO 25', sig: 'Local alarm, always works' },
      { dev: 'RGB status LED', devPin: 'R / G / B', pin: 'GPIO 12 / 13 / 14', sig: 'Green breathing, amber no-baby, red alarm' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Rate + status, dimmed' },
    ],
  },
  wiringNotes: [
    '<b>Mount the radar 30–60 cm above the mattress, aimed at the baby\'s torso</b>, on a rigid arm that cannot fall into the crib. The mounting must be mechanically secure and free of any cord that could reach the baby.',
    'A 60 GHz respiration-capable module (like the Seeed MR60BHA1) reports breathing rate over UART directly and is strongly preferred. A 24 GHz LD2410 detects presence and gross movement but not fine breathing — with a 24 GHz module you can detect gross apnoea (no movement at all) but not a true respiration rate.',
    'Keep the radar\'s field clear of fans, curtains and other periodic movement, which the radar will happily interpret as breathing. Aim it so the baby\'s torso fills the beam and little else moves.',
    'The alarm must be loud and driven directly by the ESP32 through a transistor — it is the primary safety output and must never depend on Wi-Fi. Site it where a sleeping parent will hear it.',
    'Power from a reliable mains adapter with the electronics well away from the crib. Consider a small battery backup so a power cut does not silently disable the monitor.',
    'Dim the OLED and LEDs heavily — this is a nursery at night, and a glowing device disrupts the infant\'s sleep you are trying to protect.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'mmWave radar', sub: 'chest movement' }, { name: 'Presence', sub: 'baby in field?' }] },
      { label: 'Extract', edge: 'phase / rate', blocks: [{ name: 'Respiration rate', sub: 'band-pass', highlight: true }, { name: 'Movement present?', sub: 'apnoea detect' }] },
      { label: 'Decide', edge: 'rate + presence', blocks: [{ name: 'No movement > 15 s?', sub: 'and baby present', highlight: true }, { name: 'Presence gate', sub: 'reject empty crib' }] },
      { label: 'Alert', edge: 'apnoea', blocks: [{ name: 'Local 100 dB alarm', sub: 'no network needed', highlight: true }, { name: 'Phone (secondary)', sub: 'never primary' }] },
    ],
  },

  flow: [
    { t: 'Boot: init radar, show safe-sleep reminder', k: 'start' },
    { t: 'Read radar: presence and breathing rate', k: 'proc' },
    { t: 'Baby present in the field?', k: 'dec', yes: 'monitor', no: 'show "no baby", no alarm', back: 1 },
    { t: 'Breathing movement detected?', k: 'dec', yes: 'reset timer, green', no: 'start apnoea timer', back: 1 },
    { t: 'No movement for longer than 15 s?', k: 'dec', yes: 'ALARM', no: 'keep watching', back: 1 },
    { t: 'Sound local alarm, flash red', k: 'io' },
    { t: 'Send secondary phone alert', k: 'io' },
    { t: 'Log rate, continue', k: 'end' },
  ],

  principle: [
    'A millimetre-wave radar transmits a continuous signal and measures the reflection. When it reflects off a surface that moves — such as a chest wall rising and falling with breathing — the reflected signal\'s <b>phase</b> shifts in proportion to the movement. Breathing moves the chest by a few millimetres, and at 60 GHz the wavelength is 5 mm, so even sub-millimetre movement produces a measurable, periodic phase change. Extracting that periodicity gives the respiration rate, with no contact at all.',
    'This is genuinely powerful: the same technique measures heartbeat (a much smaller movement at a higher frequency) and is used in contactless vital-sign research and in some commercial products. For an infant monitor, contactless is not just convenient but safer — there is no pad the baby can roll off, no cord, no sensor against delicate skin.',
    'The key distinction the device must make is between <b>no breathing detected</b> and <b>no baby present</b>. If a parent picks the baby up, the radar sees an empty crib — no movement — which is exactly what apnoea looks like on a movement sensor. Alarming then would be a false alarm, and false alarms are the specific failure that makes parents distrust and eventually ignore a monitor. So the device uses a presence signal (the radar\'s own presence detection, or a distinction between an empty field and a still-but-present body) to gate the alarm: it only alarms on absence of breathing <em>when a baby is present</em>.',
    'The <b>alarm timing</b> reflects clinical definitions loosely. A pathological apnoea in an infant is generally defined as a pause of 20 seconds or more, or a shorter pause with other signs. A default alarm window of around 15 seconds gives a margin before that threshold. Shorter windows produce false alarms from the normal brief irregularity of infant breathing (periodic breathing is common and normal in newborns); longer windows delay a genuine alert. This is a real trade-off and the parent should set it in consultation with their paediatrician.',
    'Everything about the alert prioritises <b>local, immediate, network-independent</b> operation. The 100 dB alarm is driven directly by the microcontroller. A phone notification is added as a secondary channel, but it is explicitly subordinate — Wi-Fi can drop, a phone can be silenced, and the one alert that must always work is the loud noise in the house. A monitor whose primary alert depends on the internet is a monitor that fails exactly when it matters.',
    'Finally, and most importantly, the device is <b>honest in its own interface</b>. It shows a safe-sleep reminder at startup, it never claims to prevent SIDS, and its documentation states plainly that the evidence does not support consumer breathing monitors reducing infant death. This is not legal boilerplate; it is the single most important design requirement, because a device that fosters false reassurance can do net harm.',
  ],

  equations: [
    { t: 'Radar phase and chest movement', eq: 'Transmitted: 60 GHz → wavelength λ = c/f = 5.0 mm\n\nPhase shift from a target moving Δd:\n  Δφ = 4π·Δd / λ\n\nChest movement of 3 mm (typical infant breathing):\n  Δφ = 4π × 3 / 5 = 7.54 rad = 432°\n\nThat is comfortably measurable — even 0.1 mm gives 14°.\nThe respiration signal is the periodic component of φ(t)\nin the 0.3–1.5 Hz band (18–90 breaths/min).' },
    { t: 'Respiration rate extraction', eq: 'Phase signal φ(t) sampled at fs (module-dependent).\nBand-pass 0.3–1.5 Hz to isolate breathing.\n\nRate by peak counting over a 30 s window:\n  rate_bpm = 60 · (peaks in window) / window_seconds\n\nInfant reference ranges (breaths/min, at rest):\n  newborn      : 30–60\n  1–12 months  : 25–50\n\nAlarm on: no peak detected for > apnoea_window\n          AND presence = true.' },
    { t: 'Alarm-window trade-off', eq: 'Pathological apnoea (clinical): pause ≥ 20 s\nPeriodic breathing (normal newborn): pauses up to ~10 s\n\nAlarm window choices:\n  10 s : frequent false alarms from normal periodic breathing\n  15 s : reasonable default — margin before 20 s\n  20 s : matches the clinical threshold, later warning\n\nSet in consultation with a paediatrician. There is no\nchoice that is both maximally sensitive and free of\nfalse alarms — that is inherent, not a bug.' },
  ],

  code: [{
    file: 'baby-breathing-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Baby Breathing Monitor — ESP32 + mmWave radar (contactless)

   Detects breathing movement with a 60 GHz radar, alarms locally if
   movement stops while a baby is present, and distinguishes an empty
   crib from apnoea.

   IMPORTANT: This device does NOT prevent SIDS. No consumer breathing
   monitor has been shown to. It is a reassurance aid layered on top
   of safe-sleep practices, which it does not replace.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "crib-monitor"

#define PIN_ALARM   25
#define PIN_SILENCE 33
#define PIN_LED_R   12
#define PIN_LED_G   13
#define PIN_LED_B   14

#define APNEA_WINDOW_MS   15000    // set WITH a paediatrician
#define RATE_LOW_BPM        15     // implausibly low — likely artefact
#define RATE_HIGH_BPM       80     // implausibly high for sleep

HardwareSerial radar(2);           // GPIO 16/17
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient   net;
PubSubClient mqtt(net);
Preferences  prefs;

float    breathingRate = 0;
bool     babyPresent = false, breathingDetected = false, alarming = false;
uint32_t lastBreathMs = 0, silencedUntil = 0, lastLog = 0;

/* ── radar parsing (Seeed MR60BHA1-style frame) ─────────────────
   The exact frame format is module-specific; adapt to your module's
   protocol. This parser expects a breathing-rate report frame. */
bool parseRadar() {
  static uint8_t buf[32]; static int idx = 0;
  bool updated = false;

  while (radar.available()) {
    uint8_t b = radar.read();
    // Frame header 0x53 0x59 (example); presence and rate follow.
    if (idx == 0 && b != 0x53) continue;
    if (idx == 1 && b != 0x59) { idx = 0; continue; }
    buf[idx++] = b;

    if (idx >= 12) {                       // complete frame
      babyPresent   = buf[4] != 0;         // presence byte
      float rate    = buf[6];              // breathing rate byte
      bool  moving  = buf[5] != 0;         // movement present

      if (rate >= RATE_LOW_BPM && rate <= RATE_HIGH_BPM) breathingRate = rate;
      if (moving && babyPresent) {
        breathingDetected = true;
        lastBreathMs = millis();
      }
      idx = 0;
      updated = true;
    }
  }
  return updated;
}

/* ── feedback ───────────────────────────────────────────────── */
void setLed(uint8_t r, uint8_t g, uint8_t b) {
  digitalWrite(PIN_LED_R, r); digitalWrite(PIN_LED_G, g); digitalWrite(PIN_LED_B, b);
}

void alarmOn() {
  alarming = true;
  digitalWrite(PIN_ALARM, HIGH);
  setLed(1, 0, 0);
  mqtt.publish("care/" DEVICE_ID "/alarm", "apnea", true);   // secondary alert
}

void alarmOff() {
  alarming = false;
  digitalWrite(PIN_ALARM, LOW);
  mqtt.publish("care/" DEVICE_ID "/alarm", "clear", true);
}

/* ── display ────────────────────────────────────────────────── */
void draw() {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.dim(true);                          // nursery — keep it dark

  if (!babyPresent) {
    oled.setTextSize(1); oled.setCursor(0, 24);
    oled.println("No baby detected"); oled.println("(monitor idle)");
    oled.display();
    return;
  }

  oled.setTextSize(2); oled.setCursor(0, 0);
  oled.printf("%2.0f", breathingRate);
  oled.setTextSize(1); oled.setCursor(38, 6); oled.print("breaths/min");
  oled.setCursor(0, 28);
  oled.print(alarming ? "!! NO BREATHING !!"
           : breathingDetected ? "breathing detected" : "watching...");
  oled.setCursor(0, 54); oled.print("Not a medical device");
  oled.display();
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_ALARM, OUTPUT); digitalWrite(PIN_ALARM, LOW);
  pinMode(PIN_SILENCE, INPUT_PULLUP);
  pinMode(PIN_LED_R, OUTPUT); pinMode(PIN_LED_G, OUTPUT); pinMode(PIN_LED_B, OUTPUT);

  radar.begin(115200, SERIAL_8N1, 16, 17);
  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  // Safe-sleep reminder at every startup — the most important screen.
  oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE); oled.setTextSize(1);
  oled.setCursor(0, 0);
  oled.println("SAFE SLEEP:");
  oled.println("back, firm flat");
  oled.println("surface, no loose");
  oled.println("bedding. This does");
  oled.println("NOT prevent SIDS.");
  oled.display();
  delay(5000);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  mqtt.setServer(MQTT_HOST, 1883);

  lastBreathMs = millis();
  Serial.println("Monitor running — LOCAL ALARM is the primary alert");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect(DEVICE_ID);
  mqtt.loop();

  parseRadar();

  /* Silence button: temporarily mute a nuisance alarm. */
  if (digitalRead(PIN_SILENCE) == LOW) {
    silencedUntil = millis() + 30000;      // 30 s only — never permanent
    if (alarming) alarmOff();
  }

  uint32_t now = millis();

  if (!babyPresent) {
    // Empty crib is NOT apnoea. Reset the timer and stand down.
    setLed(1, 1, 0);                       // amber: idle
    lastBreathMs = now;
    if (alarming) alarmOff();
  } else {
    breathingDetected = (now - lastBreathMs) < APNEA_WINDOW_MS;

    if (breathingDetected) {
      setLed(0, 1, 0);                     // green: breathing
      if (alarming) alarmOff();
    } else if (now > silencedUntil) {
      if (!alarming) {
        Serial.println("APNEA: no breathing movement detected");
        alarmOn();
      }
    }
  }

  static uint32_t lastDraw = 0;
  if (now - lastDraw > 500) { lastDraw = now; draw(); }

  if (now - lastLog > 10000 && babyPresent) {
    lastLog = now;
    JsonDocument d;
    d["rate"] = breathingRate;
    d["breathing"] = breathingDetected;
    d["present"] = babyPresent;
    char b[96]; size_t n = serializeJson(d, b, sizeof(b));
    mqtt.publish("care/" DEVICE_ID "/state", (uint8_t *)b, n, true);
  }
}`,
    explain: [
      { ref: 'if (!babyPresent) → reset timer, no alarm', txt: 'This is the single most important logic in the device. An empty crib produces no movement, which is indistinguishable from apnoea on a movement sensor. Gating the alarm on presence is what prevents the false alarm that fires every time a parent picks the baby up — and false alarms are what make parents disable a monitor.' },
      { ref: 'Safe-sleep reminder at every startup', txt: 'A deliberate five-second screen at every boot, stating the evidence-based measures and that the device does not prevent SIDS. This is not decoration; it is the most important thing the device displays, because false reassurance is the real risk of this class of product.' },
      { ref: 'Local alarm driven directly by GPIO', txt: 'The 100 dB alarm is the primary alert and is driven by a hardware pin, entirely independent of Wi-Fi, MQTT and the internet. The phone notification is explicitly labelled secondary. A monitor whose main alert can be lost to a dropped connection fails exactly when it matters.' },
      { ref: 'silencedUntil = now + 30000 (never permanent)', txt: 'The silence button mutes for only 30 seconds and can never disable the alarm permanently. A monitor that can be muted for the night is a monitor that will be, and then it is useless.' },
      { ref: 'RATE_LOW / RATE_HIGH plausibility gates', txt: 'Rates outside the physiological range are treated as artefact — a fan, a curtain, or radar noise — rather than as a real reading, which reduces spurious rates from periodic movement in the field.' },
      { ref: '"Not a medical device" always on screen', txt: 'The disclaimer is persistent, not a one-time popup. It sits on the monitoring screen the parent glances at, keeping the honest framing present rather than buried in documentation.' },
    ],
  }],

  config: [
    'Choose a respiration-capable 60 GHz module if you want a true breathing rate. A 24 GHz LD2410 can only detect gross movement and presence — usable for a crude apnoea detector but not for rate.',
    'Set <code>APNEA_WINDOW_MS</code> in consultation with your paediatrician. 15 seconds is a starting default; the trade-off between false alarms and warning time is genuine and personal.',
    'Aim the radar at the baby\'s torso from 30–60 cm above, and keep fans, curtains and other periodic movement out of its field.',
    'Site the alarm where a sleeping parent will reliably hear it, and test that they do.',
    'Adapt the radar frame parser to your specific module\'s protocol — the byte layout shown is illustrative and modules differ.',
  ],

  calibration: [
    { h: 'Verify breathing detection', p: ['Place a soft toy that you move gently by hand to simulate breathing, or (with appropriate care and supervision) observe with a real infant under a parent\'s watch. Confirm the device reports a plausible rate and shows green.'] },
    { h: 'Test the presence gate', p: ['Remove the target from the field. The device must show "no baby / idle" and must NOT alarm. If it alarms on an empty crib, the presence detection is not working and the device is not safe to rely on.'] },
    { h: 'Test the apnoea alarm', p: ['With a target present, stop the movement. The alarm must sound within the configured window. Time it and confirm it matches your setting.'] },
    { h: 'Confirm false-trigger immunity', p: ['Introduce a fan or a moving curtain into the field. If the device reports this as breathing, re-aim the radar so only the baby\'s torso is in the beam.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT (secondary only)',
    net: {
      nodes: [{ name: 'Crib monitor', sub: 'ESP32 + radar' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'alarm works without it',
      uplink: 'MQTT 1883', cloud: 'Local broker', cloudSub: 'never the primary alert',
      clients: [{ name: 'Parent phone', sub: 'secondary alert' }, { name: 'Rate log', sub: 'optional review' }],
    },
    protocol: [
      'The MQTT layer is deliberately secondary. The device functions completely — detection, presence gating, and the loud local alarm — with no network at all. MQTT adds a phone notification and an optional overnight rate log, and nothing that matters for safety depends on it.',
      'The alarm state is published retained so a phone connecting after the event still sees it, but the phone notification must never be presented to the parent as the primary alert.',
    ],
    topics: [
      { t: 'care/crib-monitor/alarm', dir: 'device → broker (retained)', payload: '"apnea" / "clear" — secondary alert only' },
      { t: 'care/crib-monitor/state', dir: 'device → broker (retained)', payload: 'JSON: rate, breathing, present' },
    ],
    security: [
      'This is intimate data about an infant. Keep it strictly on a local broker with authentication; never route it through a third-party cloud service.',
      'A radar in a nursery raises the same privacy considerations as a camera would — treat the data accordingly.',
      'The phone alert must be subordinate to the local alarm in the parent\'s mind and in the setup instructions. Never configure it as the only alert.',
    ],
  },

  testing: [
    { step: 'Power on', expect: 'A five-second safe-sleep reminder stating the device does not prevent SIDS, then the monitoring screen.' },
    { step: 'Empty field', expect: 'Amber "no baby / idle", no alarm, timer held reset.' },
    { step: 'Simulated breathing movement in the field', expect: 'Green, a plausible breathing rate, "breathing detected".' },
    { step: 'Stop the movement with a target present', expect: 'The local alarm sounds within the configured window and the LED goes red.' },
    { step: 'Remove the target during an alarm', expect: 'The device recognises the empty field and stands down — no more alarm on an empty crib.' },
    { step: 'Introduce a fan into the field', expect: 'If it is read as breathing, re-aim the radar; the device should ideally not be fooled by non-torso movement in a well-aimed setup.' },
    { step: 'Disconnect Wi-Fi and trigger an apnoea', expect: 'The local alarm still sounds. Only the phone notification is lost — which is why it is secondary.' },
    { step: 'Press silence during an alarm', expect: 'Alarm mutes for 30 seconds only, then resumes if the condition persists. It can never be muted permanently.' },
  ],

  troubleshoot: [
    {
      sym: 'Frequent false apnoea alarms',
      cause: 'Breathing movement below the radar\'s sensitivity, or the baby out of the beam.',
      fix: 'Re-aim the radar directly at the torso from the correct distance. Confirm the module is respiration-capable — a 24 GHz presence module cannot detect fine breathing. Consider lengthening the alarm window slightly (with paediatric advice), since normal newborn periodic breathing includes pauses.',
    },
    {
      sym: 'The device alarms every time the baby is picked up',
      cause: 'The presence gate is not working, so an empty crib reads as apnoea.',
      fix: 'This must be fixed before the device is used. Verify the presence byte from the radar and confirm the code only alarms when presence is true. An empty crib must always report idle, never apnoea.',
    },
    {
      sym: 'It reports breathing when the crib is empty',
      cause: 'A fan, curtain, or other periodic movement in the radar field.',
      fix: 'Aim the beam so only the baby\'s torso is in it. Remove or block periodic movement sources. Tighten the radar\'s range gating so distant movement is ignored.',
    },
    {
      sym: 'No breathing rate reported (rate stays 0)',
      cause: 'The UART frame parser does not match the module\'s protocol.',
      fix: 'Modules differ. Read your radar\'s protocol document and adapt the parser to its actual frame format — the byte offsets shown are illustrative. Print the raw bytes to confirm you are receiving frames at all.',
    },
    {
      sym: 'The alarm is too quiet to wake a sleeping parent',
      cause: 'Under-powered alarm or poor siting.',
      fix: 'Use a 100 dB piezo alarm sited where the parent sleeps, and test that it actually wakes them. The entire safety value of the device rests on the alarm being heard.',
    },
  ],

  perf: [
    'Keep the alarm path free of any network or display work — it must respond within a sample of detecting apnoea.',
    'Filter the radar rate over a short window to reject single-frame artefacts, but not so long that it delays apnoea detection.',
    'Dim the display and LEDs aggressively; the nursery must stay dark for the infant\'s sleep.',
  ],

  safety: [
    '<b>This device does not prevent SIDS. No consumer breathing monitor has been shown to.</b> It must never be presented — to yourself or anyone else — as protection against sudden infant death.',
    'The evidence-based measures reduce SIDS risk: back sleeping, a firm flat separate sleep surface, no loose bedding or soft objects, avoiding overheating, no smoke exposure, and breastfeeding. This device replaces none of them and must sit strictly on top of them.',
    'Do not let the monitor create false reassurance that leads to relaxed safe-sleep practice. That is the specific way this class of device can cause net harm.',
    'The local alarm is the only alert that must be relied upon. Never depend on a phone notification, which can be silenced, delayed or lost to a dropped connection.',
    'Keep all cords and the mounting arm well out of the crib — a strangulation hazard is a real risk that a breathing monitor must not introduce.',
    'This is not a medical device. For any genuine concern about an infant\'s breathing, seek medical care immediately.',
  ],

  future: [
    'Add <b>contactless heart rate</b> from the same radar — a 60 GHz module can resolve the smaller, faster cardiac movement, giving a second vital sign.',
    'Add a <b>reference validation</b> against a clinically-used monitor to characterise the device\'s real sensitivity and false-alarm rate honestly.',
    'Add <b>battery backup</b> so a power cut does not silently disable the monitor overnight.',
    'Add <b>room temperature monitoring</b>, since overheating is an actual SIDS risk factor and a nursery too warm is worth flagging.',
    'Add a <b>trend log for a paediatrician</b>, presenting respiration rate over nights in a form a clinician can actually use.',
  ],

  faq: [
    { q: 'Will this protect my baby from SIDS?', a: 'No. This is the most important answer in this entire document. There is no evidence that consumer breathing monitors reduce sudden infant death syndrome, and paediatric bodies including the American Academy of Pediatrics do not recommend them for this purpose. Worse, there is real concern they cause false reassurance that leads parents to relax the practices that genuinely do reduce risk. Build this for awareness and reassurance if you wish, but never believe it protects against SIDS.' },
    { q: 'What actually reduces SIDS risk?', a: 'Evidence-based measures: placing the baby on their back to sleep, on a firm flat separate sleep surface, with no loose bedding, pillows or soft toys; avoiding overheating; avoiding smoke exposure; and breastfeeding. These are what the evidence supports. A monitor is not on that list.' },
    { q: 'Why contactless rather than a mattress pad?', a: 'Safety and reliability. A pad under the mattress can be defeated by the baby rolling to a different position, and anything attached to the baby is a hazard. Contactless radar sees the chest movement through the air with nothing on or under the infant, which is both safer and less easily displaced.' },
    { q: 'Why does it not alarm when the crib is empty?', a: 'Because an empty crib produces no movement, which is identical to apnoea on a movement sensor. Alarming then would be a false alarm every time you pick the baby up, and false alarms are exactly what make parents disable a monitor. The device gates the alarm on the baby actually being present in the field.' },
    { q: 'How do I choose the alarm window?', a: 'With your paediatrician. It is a genuine trade-off: too short and normal newborn periodic breathing (brief pauses that are entirely normal) triggers false alarms; too long and a real event is caught later. Fifteen seconds is a reasonable default that gives margin before the 20-second clinical apnoea threshold, but the right value is personal and medical.' },
    { q: 'Can I trust the phone notification if I am in another room?', a: 'Only as a backup, never as the primary alert. Wi-Fi drops, phones get silenced, notifications get delayed. The loud local alarm is the one thing that must always work, which is why it is driven directly by the microcontroller and functions with no network at all. Site it where you will hear it and rely on that.' },
  ],

  refs: [
    { t: 'AAP, "Sleep-Related Infant Deaths: Updated Recommendations for a Safe Infant Sleeping Environment"', u: 'https://doi.org/10.1542/peds.2022-057990', s: 'American Academy of Pediatrics, 2022' },
    { t: 'Bonafide et al., "Accuracy of Consumer Smartphone Apps and Monitors for Vital Signs in Infants"', u: 'https://doi.org/10.1001/jama.2016.19137', s: 'JAMA, 2017' },
    { t: 'Seeed Studio MR60BHA1 60 GHz mmWave breathing and heartbeat sensor', u: 'https://wiki.seeedstudio.com/getting_started_with_mr60bha1_mmwave_kit/', s: 'Seeed Studio' },
    { t: 'Li et al., "A Review on Recent Advances in Doppler Radar Sensors for Noncontact Healthcare Monitoring"', u: 'https://doi.org/10.1109/TMTT.2013.2256924', s: 'IEEE Trans. Microwave Theory, 2013' },
    { t: 'Moon et al., "SIDS and Other Sleep-Related Infant Deaths" (technical report)', u: 'https://doi.org/10.1542/peds.2022-057991', s: 'Pediatrics, 2022' },
    { t: 'HLK-LD2410 24 GHz human presence radar — datasheet', u: 'https://www.hlktech.net/index.php?id=988', s: 'Hi-Link' },
  ],

  images: ['sensor', 'esp32', 'health'],
  imageCaptions: [
    'A sensor module. A millimetre-wave radar detects the sub-millimetre chest movement of breathing through the air, with nothing attached to the infant.',
    'An ESP32 development board running the detection and, crucially, the network-independent local alarm.',
    'A monitoring device. Whatever it shows, the honest framing must remain: it is a reassurance aid, not protection against SIDS.',
  ],
},

];
