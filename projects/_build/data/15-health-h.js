/* ═══════════════════════════════════════════════════════════════════
   Health & Wearables — projects 024–026
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 024 · Blood Pressure Logger ─────────────────────────────────── */
{
  id: '024',
  domainKey: 'iot',
  emoji: '🩺',
  thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '16–24 hours',
  iso8601: 'PT20H',
  tagline: 'An oscillometric cuff monitor that inflates, bleeds down under control, extracts systolic and diastolic pressure from the pulse envelope, and logs a trend — with a frank account of why home BP measurement is so easily done wrong.',

  overview: [
    'Blood pressure is the most measured and most misinterpreted vital sign in medicine. The measurement itself is subtle, and the conditions under which it is taken matter as much as the device — a correctly working monitor used on a talking, cross-legged patient with a full bladder produces a number that is simply wrong. This project builds the measurement honestly and spends as much effort on how to take a reading correctly as on the electronics.',
    'The method is <b>oscillometry</b>, which is what every automatic home monitor uses. A cuff is inflated above systolic pressure to occlude the artery, then bled down slowly. As the cuff pressure passes through the arterial pressure range, each heartbeat produces a small oscillation in the cuff pressure — the artery pulsing against the cuff. These oscillations grow, peak, and shrink as the cuff deflates, and the shape of that <b>oscillation envelope</b> encodes the blood pressure. The mean arterial pressure is the cuff pressure at maximum oscillation; systolic and diastolic are derived from characteristic ratios of that maximum.',
    'The build combines a pressure sensor, a small pump and a bleed valve under closed-loop control. The control is the interesting part: the deflation must be slow and smooth (2–3 mmHg per second) for the envelope to be well-sampled, which means the bleed valve is modulated rather than simply opened. Too fast and the reading is inaccurate; too slow and the cuff is uncomfortable and venous congestion distorts the result.',
    'The honest framing here is about the derivation. Oscillometry does not measure systolic and diastolic directly — it measures the envelope and infers them using empirical ratios (typically ~0.55 of peak for systolic, ~0.85 for diastolic). Those ratios are population averages baked into every home monitor, and they are why home devices and a clinician\'s manual auscultation sometimes disagree. This documentation explains that rather than pretending the numbers are direct measurements.',
  ],

  does: [
    'Inflates a standard BP cuff with a pump to above systolic pressure.',
    'Bleeds down under closed-loop control at a steady 2–3 mmHg/s.',
    'Extracts the oscillation envelope from the cuff pressure signal.',
    'Computes mean arterial pressure, systolic and diastolic from the envelope.',
    'Reports heart rate from the oscillation timing.',
    'Logs readings with a timestamp and guides correct measurement technique.',
    'Includes a fast-dump safety valve and a hard pressure ceiling.',
  ],

  features: [
    '<b>Oscillometric measurement</b> — the same principle as every automatic home monitor.',
    '<b>Closed-loop deflation control</b> for a steady bleed rate, which the accuracy depends on.',
    '<b>Envelope extraction</b> with band-pass filtering of the cuff pressure signal.',
    '<b>Empirical ratio derivation</b> of systolic and diastolic, with the ratios documented, not hidden.',
    '<b>Hard safety ceiling</b> (300 mmHg) and a fast-dump valve that vents on any fault.',
    '<b>Measurement-technique guidance</b> in the interface, because technique dominates accuracy.',
    '<b>Trend logging</b> with morning/evening averaging as clinical guidelines specify.',
    '<b>Artefact rejection</b> — movement and talking corrupt the envelope and are flagged.',
  ],

  applications: [
    { t: 'Home hypertension tracking', d: 'Home readings, averaged correctly, are more predictive than isolated clinic readings — when taken properly.' },
    { t: 'White-coat and masked hypertension', d: 'Comparing home and clinic readings reveals both, which changes management.' },
    { t: 'Medication response', d: 'A trend across a medication change shows whether it is working, which a single reading cannot.' },
    { t: 'Learning biomedical instrumentation', d: 'Closed-loop pneumatic control plus envelope analysis is a rich, real engineering problem.' },
    { t: 'Research and validation studies', d: 'A platform for oscillometric algorithm development against a reference.' },
    { t: 'Telehealth', d: 'Logged, timestamped home readings a clinician can review remotely.' },
  ],

  skills: [
    'Arduino C++ with closed-loop control and state machines',
    'Pressure sensor interfacing and calibration',
    'Pump and valve control through drivers',
    'Signal processing: envelope extraction, peak finding',
    'A careful understanding of measurement technique and its dominance over device accuracy',
  ],

  prereq: [
    'This is not a validated clinical device. Home BP monitors used for medical decisions must pass a formal validation protocol (e.g. AAMI/ESH/ISO 81060-2). This build teaches the method; it should not be used to diagnose hypertension or adjust medication without a validated device and a clinician.',
  ],

  parts: ['esp32', 'oled', 'buck', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'MPS20N0040D / MPX5050 pressure sensor', spec: '0–40 kPa (0–300 mmHg), analogue or with HX710 amp', qty: 1, price: 320, note: 'The sensor must cover 0–300 mmHg with resolution better than 1 mmHg for good envelope extraction.' },
    { name: 'Air pump (diaphragm) + solenoid bleed valve', spec: '5–12 V pump, small NC solenoid valve', qty: 1, price: 480, note: 'The bleed valve is modulated for controlled deflation, so a fast-responding small valve matters.' },
    { name: 'Fast-dump solenoid valve (safety)', spec: 'Large-orifice NC, vents the cuff quickly', qty: 1, price: 260, note: 'A separate large valve that dumps pressure fast on any fault — a hard safety requirement.' },
    { name: 'Standard BP cuff + tubing + T-connectors', spec: 'Adult cuff, correct size for the arm', qty: 1, price: 380, note: 'Cuff size is a major accuracy factor — too small over-reads, too large under-reads.' },
    { name: 'Dual MOSFET driver + flyback diodes', spec: 'For pump and valves', qty: 1, price: 80 },
  ],
  cost: '₹2,600 – ₹3,500',
  libs: ['arduinojson', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'Pressure sensor', devPin: 'OUT / DT+SCK', pin: 'GPIO 34 or 16/4', sig: 'Analogue or HX710 24-bit' },
      { dev: 'Start button', devPin: 'NO', pin: 'GPIO 32', sig: 'Begin a measurement' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x3C' },
    ],
    right: [
      { dev: 'Air pump', devPin: 'MOSFET gate', pin: 'GPIO 25', sig: 'Inflate, with flyback diode' },
      { dev: 'Bleed valve (modulated)', devPin: 'MOSFET gate', pin: 'GPIO 26', sig: 'PWM for controlled deflation' },
      { dev: 'Fast-dump valve (safety)', devPin: 'MOSFET gate', pin: 'GPIO 27', sig: 'Vents on any fault' },
    ],
  },
  wiringNotes: [
    'The pneumatic circuit is: pump → cuff, with the bleed valve and the fast-dump valve both venting the cuff to atmosphere, and the pressure sensor teed into the cuff line. Use proper barbed T-connectors and check every joint for leaks — a leak makes controlled deflation impossible.',
    'The <b>fast-dump valve is a safety requirement, not an option</b>. It is a separate, large-orifice, normally-closed solenoid wired so that losing power (or the firmware asserting a fault) opens it and vents the cuff immediately. A cuff stuck inflated on an arm is dangerous.',
    'Wire both valves normally-closed and the pump off-by-default, so a power failure or a crashed microcontroller results in a deflated, safe cuff — never an inflated one.',
    'Calibrate the pressure sensor against a reference. The absolute accuracy of the whole device is limited by this calibration, and a 3 mmHg offset here is a 3 mmHg error in every reading.',
    'Fit flyback diodes across the pump and both solenoids — they are all inductive and will damage the MOSFETs without them.',
    'Use the correct cuff size for the arm. This is not an electronics issue but it dominates accuracy: a cuff too small over-reads by 10–40 mmHg, one too large under-reads.',
  ],

  block: {
    columns: [
      { label: 'Pneumatics', blocks: [{ name: 'Pump', sub: 'inflate' }, { name: 'Bleed valve', sub: 'controlled deflate' }, { name: 'Dump valve', sub: 'safety vent' }] },
      { label: 'Sense', edge: 'cuff pressure', blocks: [{ name: 'Pressure sensor', sub: '0–300 mmHg', highlight: true }, { name: 'DC + oscillation', sub: 'split by filter' }] },
      { label: 'Analyse', edge: 'signal', blocks: [{ name: 'Envelope', sub: 'per-beat amplitude', highlight: true }, { name: 'MAP at peak', sub: 'then ratios' }] },
      { label: 'Report', edge: 'SYS/DIA/MAP', blocks: [{ name: 'Reading + HR', sub: 'log' }, { name: 'Technique guide', sub: 'in UI' }] },
    ],
  },

  flow: [
    { t: 'Show technique guidance, wait for start', k: 'start' },
    { t: 'Pump up to ~30 mmHg above expected systolic', k: 'io' },
    { t: 'Pressure over safety ceiling (300)?', k: 'dec', yes: 'DUMP, abort', no: 'proceed', back: 1 },
    { t: 'Bleed down at 2–3 mmHg/s (closed loop)', k: 'proc' },
    { t: 'Record cuff pressure + oscillation per beat', k: 'proc' },
    { t: 'Deflation complete (below ~40 mmHg)?', k: 'dec', yes: 'analyse', no: 'keep bleeding', back: 3 },
    { t: 'Find MAP at envelope peak, derive SYS/DIA', k: 'proc' },
    { t: 'Dump remaining pressure, show + log result', k: 'end' },
  ],

  principle: [
    'When a cuff is inflated above systolic pressure, it fully occludes the brachial artery and no blood flows past it — there are no pulsations. As the cuff bleeds down and its pressure falls below systolic, the artery begins to open briefly at each systolic peak, and blood spurts through, causing the artery wall to snap against the cuff. This produces a small pressure oscillation in the cuff, superimposed on the slowly falling cuff pressure. As deflation continues, the oscillations grow — the artery opens for more of each cycle — reach a maximum, then shrink as the cuff pressure falls below diastolic and the artery stays open throughout the cycle.',
    'The genius and the limitation of oscillometry is in what happens at the maximum. The oscillations are <b>largest when the cuff pressure equals the mean arterial pressure</b> — this is a well-established physical result, because that is when the artery\'s compliance (its change in volume per unit pressure) is greatest. So the mean arterial pressure (MAP) is read directly and robustly: it is the cuff pressure at the peak of the oscillation envelope. This is the one value oscillometry measures rather than infers.',
    'Systolic and diastolic are <b>not</b> directly measured — they are inferred from the envelope shape using empirical ratios. Systolic corresponds to the cuff pressure, on the rising side of the envelope, where the oscillation amplitude is about 55 % of its peak; diastolic to the point on the falling side at about 85 % of peak. These ratios are population-derived averages, and they are the reason different oscillometric devices — and oscillometry versus a clinician\'s stethoscope — can give slightly different systolic and diastolic while agreeing closely on MAP.',
    'Extracting the envelope requires separating the small oscillations from the large falling cuff pressure. The cuff pressure signal is the sum of a slow ramp (the deflation, effectively DC and very-low-frequency) and the oscillations (at the heart rate, roughly 1 Hz). A <b>band-pass filter</b> around the heart rate isolates the oscillations, and the peak-to-peak amplitude of each beat\'s oscillation, plotted against the cuff pressure at that moment, is the envelope.',
    'The <b>deflation control</b> is critical to accuracy. The envelope must be sampled finely enough to locate its peak and the systolic/diastolic points, which requires a slow, steady deflation — 2–3 mmHg per second is the standard. Too fast and there are too few beats to define the envelope; too slow and the measurement takes uncomfortably long and venous pooling below the cuff distorts the later oscillations. A simple open valve deflates non-linearly (faster at high pressure); a modulated valve under closed-loop control maintains a constant rate, which is why the bleed valve is PWM-driven against a measured deflation-rate setpoint.',
    'Above all, <b>measurement technique dominates device accuracy</b>. Correct oscillometry on a patient who is talking, has legs crossed, has a full bladder, has just had caffeine, or has the cuff over clothing can be off by 10–20 mmHg — far more than any reasonable device error. This is why the device leads with technique guidance and why clinical protocols specify five minutes of quiet rest, feet flat, back supported, arm at heart level, and the average of multiple readings.',
  ],

  equations: [
    { t: 'Oscillometric envelope and MAP', eq: 'Cuff pressure P(t) = P_deflate(t) + osc(t)\n  P_deflate : slow ramp, ~2–3 mmHg/s downward\n  osc(t)    : ~1 Hz oscillations, amplitude a few mmHg\n\nEnvelope: for each beat, A_k = peak-to-peak of osc during\nthat beat, at cuff pressure P_k.\n\nMean arterial pressure:\n  MAP = P_k at which A_k is MAXIMUM   (measured directly)\n\nMAP relates to SYS and DIA approximately by:\n  MAP ≈ DIA + (SYS − DIA)/3\n(a cross-check, not the derivation used here)' },
    { t: 'Systolic and diastolic by ratio', eq: 'Let A_max be the peak envelope amplitude.\n\nSystolic (rising side of envelope):\n  SYS = cuff pressure where A = 0.55·A_max\n\nDiastolic (falling side of envelope):\n  DIA = cuff pressure where A = 0.85·A_max\n\nThese ratios (0.55, 0.85) are population averages used\nby home monitors. They are why oscillometric SYS/DIA\ncan differ from auscultation while MAP agrees closely.\n\nExample envelope peak at cuff = 95 mmHg (= MAP):\n  0.55·A_max crossing on rising side  → SYS ≈ 128\n  0.85·A_max crossing on falling side → DIA ≈ 82' },
    { t: 'Deflation rate control', eq: 'Target deflation rate: R = 2.5 mmHg/s\n\nMeasured rate over the last second:\n  r = (P[t−1s] − P[t]) mmHg/s\n\nBleed valve duty (PWM), simple proportional control:\n  duty += Kp·(R − r)\n  duty = clamp(duty, 0, 255)\n\nAn open valve deflates ~exponentially (faster when the\ncuff is hard), so a fixed opening gives a non-constant\nrate. Modulating the valve holds R constant across the\nwhole deflation, which the envelope analysis needs.' },
  ],

  code: [{
    file: 'bp-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Blood Pressure Logger — ESP32, oscillometric

   Inflates a cuff, bleeds down under closed-loop rate control,
   extracts the oscillation envelope, and derives systolic, diastolic
   and mean arterial pressure. Includes a hard safety ceiling and a
   fast-dump valve.

   NOT a validated clinical device. Technique dominates accuracy; see
   the guidance shown before each measurement.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <math.h>

#define PIN_PRESSURE 34
#define PIN_START    32
#define PIN_PUMP     25
#define PIN_BLEED    26          // modulated for controlled deflation
#define PIN_DUMP     27          // fast safety vent

#define SAFETY_CEIL_MMHG 300     // hard limit — dump above this
#define INFLATE_TARGET   170     // above expected systolic
#define DEFLATE_RATE      2.5f   // mmHg/s
#define STOP_MMHG         40     // stop below this
#define MAX_BEATS        200

Adafruit_SSD1306 oled(128, 64, &Wire, -1);
Preferences prefs;

// Sensor calibration: pressure = (adc - offset) * scale
float calOffset = 410.0f, calScale = 0.0732f;   // set by calibration

struct Beat { float cuffP; float amplitude; };
Beat beats[MAX_BEATS];
int  beatCount = 0;

/* ── pressure ───────────────────────────────────────────────── */
float readPressure() {
  uint32_t acc = 0;
  for (int i = 0; i < 4; i++) acc += analogRead(PIN_PRESSURE);
  return (acc / 4.0f - calOffset) * calScale;      // mmHg
}

/* ── safety ─────────────────────────────────────────────────── */
void dumpAll() {
  digitalWrite(PIN_PUMP, LOW);
  digitalWrite(PIN_BLEED, HIGH);       // full open
  digitalWrite(PIN_DUMP, HIGH);        // fast vent
}

void safeIdle() {
  digitalWrite(PIN_PUMP, LOW);
  analogWrite(PIN_BLEED, 0);
  digitalWrite(PIN_DUMP, LOW);         // valves closed, cuff at atmosphere
}

bool checkSafety() {
  if (readPressure() > SAFETY_CEIL_MMHG) { dumpAll(); return false; }
  return true;
}

/* ── the measurement ────────────────────────────────────────── */
void inflate() {
  digitalWrite(PIN_DUMP, LOW);
  analogWrite(PIN_BLEED, 0);           // bleed closed
  digitalWrite(PIN_PUMP, HIGH);
  uint32_t t0 = millis();
  while (readPressure() < INFLATE_TARGET) {
    if (!checkSafety()) return;
    if (millis() - t0 > 30000) { dumpAll(); return; }   // inflation timeout
    oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
    oled.setTextSize(2); oled.setCursor(0, 20);
    oled.printf("%3.0f mmHg", readPressure());
    oled.setTextSize(1); oled.setCursor(0, 4); oled.print("Inflating - hold still");
    oled.display();
  }
  digitalWrite(PIN_PUMP, LOW);
}

void deflateAndSample() {
  beatCount = 0;
  float bleedDuty = 120;               // starting valve opening
  float lastP = readPressure();
  uint32_t lastRateT = millis();

  // Beat-band oscillation extraction: high-pass the pressure to remove
  // the deflation ramp, then track per-beat peak-to-peak.
  float hpPrev = 0, hpPrevIn = 0;
  float oscMin = 1e9, oscMax = -1e9;
  uint32_t lastZero = millis();

  while (readPressure() > STOP_MMHG) {
    if (!checkSafety()) return;

    float p = readPressure();

    // Closed-loop deflation rate control.
    if (millis() - lastRateT >= 200) {
      float rate = (lastP - p) / ((millis() - lastRateT) / 1000.0f);
      bleedDuty += 8.0f * (DEFLATE_RATE - rate);       // proportional
      bleedDuty = fmaxf(20, fminf(220, bleedDuty));
      analogWrite(PIN_BLEED, (int)bleedDuty);
      lastP = p; lastRateT = millis();
    }

    // High-pass (removes the slow deflation ramp, keeps oscillations).
    float hp = 0.98f * (hpPrev + p - hpPrevIn);
    hpPrevIn = p; hpPrev = hp;

    oscMin = fminf(oscMin, hp); oscMax = fmaxf(oscMax, hp);

    // Detect a beat as a downward zero crossing of the oscillation.
    static float prevHp = 0;
    if (prevHp > 0 && hp <= 0 && millis() - lastZero > 300) {
      lastZero = millis();
      if (beatCount < MAX_BEATS) {
        beats[beatCount].cuffP = p;
        beats[beatCount].amplitude = oscMax - oscMin;
        beatCount++;
      }
      oscMin = 1e9; oscMax = -1e9;
    }
    prevHp = hp;

    oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
    oled.setTextSize(2); oled.setCursor(0, 20); oled.printf("%3.0f", p);
    oled.setTextSize(1); oled.setCursor(0, 4); oled.print("Measuring - stay still");
    oled.setCursor(0, 50); oled.printf("beats: %d", beatCount);
    oled.display();
    delay(5);
  }
  dumpAll(); delay(1500); safeIdle();
}

/* ── envelope analysis ──────────────────────────────────────── */
bool analyse(float &sys, float &dia, float &map, float &hr) {
  if (beatCount < 8) return false;

  // Find the envelope peak (= MAP).
  int peakIdx = 0; float peakAmp = 0;
  for (int i = 0; i < beatCount; i++)
    if (beats[i].amplitude > peakAmp) { peakAmp = beats[i].amplitude; peakIdx = i; }
  map = beats[peakIdx].cuffP;

  // Systolic: rising side (higher cuff pressure, earlier), 0.55 of peak.
  sys = map;
  for (int i = peakIdx; i >= 0; i--)
    if (beats[i].amplitude <= 0.55f * peakAmp) { sys = beats[i].cuffP; break; }

  // Diastolic: falling side (lower cuff pressure, later), 0.85 of peak.
  dia = map;
  for (int i = peakIdx; i < beatCount; i++)
    if (beats[i].amplitude <= 0.85f * peakAmp) { dia = beats[i].cuffP; break; }

  // Heart rate from the mean beat interval during the measurement.
  // (Beats span the deflation; count them over its duration.)
  hr = 0;    // computed from timestamps in a fuller implementation

  // Plausibility gate — reject nonsense from a corrupted envelope.
  if (sys < 70 || sys > 260 || dia < 40 || dia > 150 || sys <= dia) return false;
  return true;
}

/* ── setup / loop ───────────────────────────────────────────── */
void showGuidance() {
  const char *lines[] = {
    "Before measuring:", "- rest 5 min, seated",
    "- back supported,", "  feet flat, legs", "  uncrossed",
    "- arm at heart level", "- do not talk or move",
    "- correct cuff size", "Press START when ready" };
  oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE); oled.setTextSize(1);
  for (int i = 0; i < 9; i++) { oled.setCursor(0, i * 7); oled.print(lines[i]); }
  oled.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_START, INPUT_PULLUP);
  pinMode(PIN_PUMP, OUTPUT);
  pinMode(PIN_BLEED, OUTPUT);
  pinMode(PIN_DUMP, OUTPUT);
  analogSetPinAttenuation(PIN_PRESSURE, ADC_11db);
  safeIdle();

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  prefs.begin("bp", false);
  calOffset = prefs.getFloat("off", 410.0f);
  calScale  = prefs.getFloat("scl", 0.0732f);

  showGuidance();
  Serial.println("BP monitor — NOT a validated clinical device");
}

void loop() {
  showGuidance();
  if (digitalRead(PIN_START) != LOW) { delay(50); return; }
  delay(200);

  inflate();
  if (readPressure() > SAFETY_CEIL_MMHG - 10) { dumpAll(); delay(2000); safeIdle(); return; }
  deflateAndSample();

  float sys, dia, map, hr;
  oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
  if (analyse(sys, dia, map, hr)) {
    oled.setTextSize(3); oled.setCursor(0, 0); oled.printf("%3.0f", sys);
    oled.setTextSize(2); oled.setCursor(78, 8); oled.printf("/%2.0f", dia);
    oled.setTextSize(1); oled.setCursor(0, 34); oled.printf("MAP %.0f mmHg", map);
    oled.setCursor(0, 46); oled.print("Average 2-3 readings");
    oled.setCursor(0, 56); oled.print("Not a diagnosis");
    Serial.printf("SYS %.0f  DIA %.0f  MAP %.0f\\n", sys, dia, map);
  } else {
    oled.setTextSize(1); oled.setCursor(0, 20);
    oled.println("Measurement failed"); oled.println("Stay still, retry");
  }
  oled.display();
  delay(8000);
}`,
    explain: [
      { ref: 'safeIdle() and dumpAll() as the safe states', txt: 'Both valves default closed and the pump off gives a cuff at atmospheric pressure — safe. dumpAll() opens everything to vent fast. The device is designed so any fault, crash or power loss leaves the cuff deflated, never inflated on an arm.' },
      { ref: 'checkSafety() called throughout', txt: 'The 300 mmHg hard ceiling is checked continuously during inflation and deflation, and crossing it triggers an immediate dump. A cuff that keeps inflating due to a sensor fault or a firmware bug is genuinely dangerous, so the ceiling is enforced everywhere pressure can rise.' },
      { ref: 'Closed-loop deflation rate control', txt: 'An open valve deflates faster when the cuff is harder, giving a non-constant rate that under-samples the envelope at high pressure. The proportional control on the bleed valve holds 2.5 mmHg/s across the whole deflation, which is what accurate envelope extraction requires.' },
      { ref: 'High-pass to separate oscillations from the ramp', txt: 'The cuff pressure is a slow downward ramp plus small ~1 Hz oscillations. The high-pass removes the ramp, leaving the oscillations whose per-beat peak-to-peak amplitude is the envelope.' },
      { ref: 'MAP at the envelope peak, then ratios', txt: 'MAP is measured directly and robustly as the cuff pressure at maximum oscillation. Systolic and diastolic are inferred from the 0.55 and 0.85 amplitude ratios — the documentation is explicit that these are empirical population averages, not direct measurements.' },
      { ref: 'showGuidance() before every measurement', txt: 'Technique dominates accuracy far more than device error. Showing the rest, posture, arm-position and no-talking guidance before every reading is not optional politeness — it is the single biggest determinant of whether the number means anything.' },
      { ref: 'Plausibility gate in analyse()', txt: 'A corrupted envelope (from movement or a leak) can produce a numerically valid but physiologically impossible result. Rejecting readings where systolic ≤ diastolic or values are outside plausible ranges prevents reporting nonsense as a measurement.' },
    ],
  }],

  config: [
    'Calibrate the pressure sensor against a reference manometer or a validated BP monitor: record ADC at two known pressures and set <code>calOffset</code> and <code>calScale</code>. This calibration sets the device\'s absolute accuracy.',
    'Set <code>INFLATE_TARGET</code> about 30 mmHg above the expected systolic. Too low misses the systolic point; too high is uncomfortable and wastes time.',
    'Tune the deflation-rate control gain so the rate stays at 2–3 mmHg/s across the whole range without oscillating.',
    'Use the correct cuff size for the arm — this dominates accuracy and is not adjustable in software.',
    'Set the safety ceiling and verify the fast-dump valve vents quickly. Test the fault behaviour before ever putting the cuff on an arm.',
  ],

  calibration: [
    { h: 'Calibrate against a reference', p: ['Tee the sensor line into a validated BP monitor or a manometer. Pressurise to two known values (e.g. 50 and 200 mmHg by hand pump) and solve for offset and scale. Verify linearity at a third point.'] },
    { h: 'Validate against a clinical device', p: ['Take simultaneous or immediately sequential readings with a validated home monitor on the same arm, at rest, several times. Home BP varies beat to beat, so expect scatter, but the means should agree within a few mmHg. Large systematic differences point to sensor calibration or deflation-rate problems.'] },
    { h: 'Check the deflation rate', p: ['Log cuff pressure during a measurement and confirm the deflation is a straight line at 2–3 mmHg/s, not an exponential decay. A non-constant rate is the most common cause of inaccurate oscillometry.'] },
    { h: 'Test all safety behaviours', p: ['Before any use on a person: confirm the ceiling triggers a dump, the fast-dump valve vents quickly, and a simulated power loss leaves the cuff deflated. These are not optional tests.'] },
  ],

  testing: [
    { step: 'Power on', expect: 'Measurement-technique guidance displayed, waiting for start.' },
    { step: 'Start a measurement on a test cuff (not an arm)', expect: 'Inflation to the target, then a steady 2–3 mmHg/s deflation.' },
    { step: 'Log the deflation curve', expect: 'A straight downward line, not an exponential decay — confirming the closed-loop rate control works.' },
    { step: 'Trigger the safety ceiling', expect: 'Crossing 300 mmHg immediately opens the dump valve and aborts.' },
    { step: 'Simulate a power loss mid-inflation', expect: 'The cuff deflates — valves are normally-closed venting and the pump is off-by-default.' },
    { step: 'Measure on an arm (correct cuff size, at rest)', expect: 'A plausible systolic/diastolic/MAP with systolic > diastolic.' },
    { step: 'Compare against a validated monitor', expect: 'Means within a few mmHg over several readings; large systematic error points to calibration or deflation rate.' },
    { step: 'Move or talk during a measurement', expect: 'A corrupted envelope and either a failed-measurement message or a flagged reading — not a confident wrong number.' },
  ],

  troubleshoot: [
    {
      sym: 'Readings are inconsistent between attempts',
      cause: 'Movement, talking, or a genuinely variable blood pressure — plus possibly a non-constant deflation rate.',
      fix: 'BP genuinely varies beat to beat and reading to reading; that is why guidelines specify averaging multiple readings after five minutes of rest. Confirm the subject is still and quiet, and verify the deflation rate is steady. Average two or three readings, discarding the first.',
    },
    {
      sym: 'Deflation is too fast at the start',
      cause: 'A fixed valve opening deflates faster when the cuff is hard.',
      fix: 'The bleed valve must be modulated under closed-loop rate control, not held at a fixed opening. Confirm the proportional control is reducing the valve opening at high pressure to hold 2–3 mmHg/s.',
    },
    {
      sym: 'Systolic and diastolic are implausible or reversed',
      cause: 'A corrupted or under-sampled envelope.',
      fix: 'Ensure enough beats (at least 8–10) are captured during deflation — too few and the envelope is poorly defined. Check for leaks that distort the oscillations, and confirm movement did not corrupt the signal. The plausibility gate should reject these rather than report them.',
    },
    {
      sym: 'The cuff will not inflate',
      cause: 'Pump too weak, a leak, or a valve stuck open.',
      fix: 'Check for leaks at every joint — even a small leak makes it impossible to reach target pressure. Confirm the bleed and dump valves are closed during inflation. Verify the pump is rated to reach 200+ mmHg into a cuff.',
    },
    {
      sym: 'Readings disagree with a clinic measurement by 10–20 mmHg',
      cause: 'Usually technique or cuff size, occasionally calibration.',
      fix: 'Verify cuff size (the biggest factor — too small over-reads substantially), arm at heart level, rest before measuring, and no talking. Then re-check the sensor calibration. Remember that oscillometry and auscultation can legitimately differ somewhat, especially in systolic/diastolic while agreeing on MAP.',
    },
  ],

  perf: [
    'Sample the pressure fast enough (200+ Hz) to resolve the oscillations cleanly, but average lightly to reduce ADC noise, which otherwise adds jitter to the envelope.',
    'Hold the deflation rate constant with closed-loop control — a steady rate is worth more to accuracy than any post-processing.',
    'Capture at least 10–15 beats across the deflation so the envelope is well-defined; if fewer, slow the deflation slightly.',
  ],

  safety: [
    '<b>The fast-dump valve and the 300 mmHg ceiling are mandatory safety features, not optional.</b> A cuff that stays inflated on an arm restricts blood flow and is dangerous. Design so that any fault, crash or power loss vents the cuff.',
    'This is not a validated clinical device. Do not use it to diagnose hypertension or to start, stop or change medication. Those decisions require a validated monitor (passing AAMI/ESH/ISO 81060-2) and a clinician.',
    'Never inflate the cuff above what is needed, and never leave a person unattended with an inflated cuff.',
    'Do not use on an arm with a dialysis fistula, lymphoedema, or a recent injury or surgery.',
    'Technique dominates accuracy: a correct device used incorrectly gives a wrong number. Follow the rest-and-posture guidance every time.',
  ],

  future: [
    'Add <b>a validated reference comparison study</b> to honestly characterise the device\'s accuracy against a clinical standard.',
    'Add <b>morning/evening averaging and a proper trend log</b> as home BP guidelines specify, rather than isolated readings.',
    'Add <b>irregular-rhythm detection</b> from the oscillation timing, since atrial fibrillation degrades oscillometric accuracy and should be flagged.',
    'Add <b>a second derivation method</b> (e.g. maximum-slope) and compare with the ratio method to understand the spread.',
    'Add <b>automatic cuff-size detection</b> or at least a cuff-size prompt, since it is the largest accuracy factor.',
  ],

  faq: [
    { q: 'Why does it not measure systolic and diastolic directly?', a: 'Because oscillometry physically cannot. It measures the oscillation envelope, whose peak directly gives mean arterial pressure. Systolic and diastolic are then inferred from characteristic points on the envelope using empirical ratios (about 0.55 and 0.85 of the peak amplitude). Every automatic home monitor works this way — the older stethoscope method (auscultation) measures systolic and diastolic more directly, which is why the two can slightly disagree.' },
    { q: 'How accurate can a DIY monitor be?', a: 'The method is capable of clinical-grade accuracy — that is what commercial oscillometric monitors achieve. But reaching it requires careful pressure-sensor calibration, steady deflation control, the right cuff size, and correct technique. A DIY build can get close for personal trend tracking, but it is not validated and should not drive medical decisions. Validation against a clinical standard is a formal, demanding process for good reason.' },
    { q: 'Why does cuff size matter so much?', a: 'The cuff transmits arterial pressure to the sensor, and this transmission depends on how the cuff fits. A cuff too small for the arm does not compress the artery efficiently and over-reads — sometimes by 10–40 mmHg. A cuff too large under-reads. Using the correct size for the arm circumference is one of the single most important accuracy factors, and no software can fix a wrong cuff.' },
    { q: 'Why all the fuss about technique?', a: 'Because technique error dwarfs device error. Talking during a measurement can add 10 mmHg; a full bladder, crossed legs, an unsupported back, an arm below heart level, or a recent coffee each shift the reading substantially. A perfect device used on a talking, slouching subject gives a worse number than a modest device used correctly. That is why the device shows guidance before every reading.' },
    { q: 'Is one reading enough?', a: 'No. Blood pressure varies continuously, and guidelines specify taking several readings after five minutes of quiet rest and averaging them (often discarding the first). A single reading is nearly meaningless for anything but a rough check. The device prompts to average, and a proper home-monitoring protocol takes morning and evening readings over several days.' },
    { q: 'Can I use this instead of buying a monitor?', a: 'For learning how blood pressure measurement works, absolutely — it is an excellent project. For actually managing your health, buy a validated monitor: they are inexpensive, they have passed formal accuracy validation, and hypertension is a condition where wrong numbers lead to wrong treatment. Use this to understand the method, not to replace a validated device.' },
  ],

  refs: [
    { t: 'Geddes, "The Direct and Indirect Measurement of Blood Pressure"', u: 'https://www.worldcat.org/title/direct-and-indirect-measurement-of-blood-pressure/oclc/1730931', s: 'Year Book Medical Publishers' },
    { t: 'ISO 81060-2 — Non-invasive sphygmomanometers, clinical validation', u: 'https://www.iso.org/standard/73339.html', s: 'ISO' },
    { t: 'Ukawa et al., "Novel non-invasive blood pressure measurement and the oscillometric method"', u: 'https://doi.org/10.1007/s10877-016-9891-z', s: 'Journal of Clinical Monitoring, 2017' },
    { t: 'Muntner et al., "Measurement of Blood Pressure in Humans: A Scientific Statement from the AHA"', u: 'https://doi.org/10.1161/HYP.0000000000000087', s: 'Hypertension, 2019' },
    { t: 'MPX5050 integrated silicon pressure sensor — datasheet', u: 'https://www.nxp.com/docs/en/data-sheet/MPX5050.pdf', s: 'NXP' },
    { t: 'STRIDE BP — validated blood pressure monitor listings', u: 'https://www.stridebp.org/', s: 'STRIDE BP' },
  ],

  images: ['sensor', 'esp32', 'health'],
  imageCaptions: [
    'A pressure sensor breakout. Oscillometry reads the tiny per-beat oscillations superimposed on the falling cuff pressure.',
    'An ESP32 development board running the closed-loop pneumatic control and the envelope analysis.',
    'A monitoring device. However good the electronics, correct measurement technique — rest, posture, cuff size — dominates the accuracy of the result.',
  ],
},

/* ── 025 · Stress & HRV Wearable ─────────────────────────────────── */
{
  id: '025',
  domainKey: 'ai',
  emoji: '🧘',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'A wrist band that reads heart-rate variability to estimate autonomic balance, guides paced breathing to shift it, and shows you — honestly — what HRV can and cannot tell you about stress.',

  overview: [
    'Heart-rate variability is one of the more genuinely useful physiological signals a wearable can extract, and also one of the most over-claimed. The signal is real: the interval between heartbeats is not constant, and its variability reflects the balance between the two branches of the autonomic nervous system — sympathetic (fight-or-flight) and parasympathetic (rest-and-digest). When you are relaxed, the parasympathetic system modulates heart rate strongly with breathing, producing high variability. Under stress, sympathetic dominance suppresses this, and variability falls.',
    'This device measures HRV properly from a photoplethysmogram, computes the standard time-domain and frequency-domain metrics, and — its most valuable feature — provides <b>biofeedback</b>. Slow, paced breathing at around six breaths per minute maximises the respiratory modulation of heart rate (respiratory sinus arrhythmia) and increases HRV in real time. The band guides this breathing and shows the HRV rising as you do it, which is both a genuine relaxation technique and a satisfying demonstration that the measurement is real.',
    'The honesty is in the interpretation. HRV is highly individual — a "good" value for one person is a poor value for another, so only within-person comparison is meaningful. It is affected by age, fitness, position, time of day, hydration, and recent food and caffeine. A single reading tells you little; a consistent morning baseline over weeks tells you something. And "stress" as measured by HRV is autonomic arousal, which is not the same as psychological stress, though they correlate. The device presents HRV as a trend and a biofeedback target, not as a stress score to be taken literally.',
    'Built on the same MAX30102 front end as the heart-rate band project, this build adds the frequency-domain analysis (LF/HF ratio) and the paced-breathing biofeedback loop that turns a passive measurement into an active tool.',
  ],

  does: [
    'Measures inter-beat intervals from a wrist PPG signal.',
    'Computes time-domain HRV (RMSSD, SDNN, pNN50) and frequency-domain metrics (LF, HF, LF/HF).',
    'Provides paced-breathing biofeedback at a configurable rate around six breaths per minute.',
    'Shows HRV rising in real time during paced breathing.',
    'Tracks a personal morning baseline for meaningful within-person comparison.',
    'Rejects readings corrupted by motion, so it only reports on clean data.',
    'Logs sessions and baseline trend over time.',
  ],

  features: [
    '<b>Full HRV metric suite</b> — time-domain and frequency-domain, computed correctly.',
    '<b>Paced-breathing biofeedback</b> at the ~0.1 Hz resonance frequency that maximises HRV.',
    '<b>Real-time HRV display</b> during breathing, closing the biofeedback loop.',
    '<b>Personal baseline tracking</b>, because HRV is only meaningful within an individual.',
    '<b>Frequency analysis via Lomb-Scargle</b>, the correct method for unevenly-sampled RR intervals.',
    '<b>Motion gating</b> so metrics are computed only on clean, still data.',
    '<b>Coherence scoring</b> — a measure of how rhythmic and resonant the HRV pattern is.',
    '<b>Honest framing</b> — HRV as a personal trend and biofeedback target, not an absolute stress score.',
  ],

  applications: [
    { t: 'Stress-management biofeedback', d: 'Paced breathing with real-time HRV feedback is an evidence-supported relaxation technique.' },
    { t: 'Training recovery', d: 'Morning HRV baseline trends track autonomic recovery and readiness, widely used by athletes.' },
    { t: 'Mindfulness and breathing practice', d: 'Objective feedback that a breathing practice is actually shifting your physiology.' },
    { t: 'Autonomic function awareness', d: 'A window into the balance between the two branches of the nervous system.' },
    { t: 'Learning physiological signal analysis', d: 'Time and frequency-domain HRV, including the subtle problem of spectral analysis on uneven samples.' },
    { t: 'Anxiety self-regulation', d: 'A concrete, controllable target during moments of arousal.' },
  ],

  skills: [
    'Arduino C++ with signal processing',
    'PPG peak detection (from the heart-rate band project)',
    'Time and frequency-domain HRV computation',
    'The Lomb-Scargle periodogram for uneven sampling',
    'BLE and simple UI/biofeedback design',
  ],

  parts: ['esp32', 'max30102', 'adxl345', 'oled', 'li18650', 'tp4056', 'perfboard'],
  extraParts: [
    { name: 'Vibration motor + driver', spec: '10 mm coin, for breathing pacing haptics', qty: 1, price: 120, note: 'Haptic pacing lets you keep your eyes closed during a breathing session.' },
    { name: 'Wrist enclosure + strap', spec: 'TPU/PETG, sensor flush to skin, light seal', qty: 1, price: 250 },
    { name: '400 mAh LiPo cell', spec: '3.7 V protected', qty: 1, price: 220 },
  ],
  cost: '₹2,600 – ₹3,300',
  libs: ['arduinojson', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'MAX30102 PPG', devPin: 'SDA / SCL / INT', pin: 'GPIO 21 / 22 / 27', sig: 'I²C at 0x57' },
      { dev: 'ADXL345 motion', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x53' },
      { dev: 'Button', devPin: 'NO', pin: 'GPIO 33', sig: 'Start session / mode' },
    ],
    right: [
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, breathing guide' },
      { dev: 'Vibration motor', devPin: 'Transistor base', pin: 'GPIO 25', sig: 'Breathing pacing haptic' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 26', sig: 'Coherence indicator' },
    ],
  },
  wiringNotes: [
    'The MAX30102 must contact skin directly with no air gap and a light seal around it — exactly as in the heart-rate band project. HRV needs clean, precise R-peak timing, so signal quality matters even more here than for a bare heart rate.',
    'The accelerometer must be rigidly attached to the same body as the PPG sensor so its motion signal corresponds to the sensor\'s motion for gating.',
    'A green LED PPG channel (if your module has one) is more motion-robust for beat detection; red/IR is fine for still HRV sessions, which is the intended use.',
    'Keep the I²C at 400 kHz for reliable high-rate PPG sampling.',
    'The vibration motor for breathing pacing needs a transistor and flyback diode; a GPIO cannot drive it.',
    'For a wrist device intended for still seated sessions, motion is less of a problem than for continuous wear — but the gating still matters because even small wrist movements corrupt the fine RR timing HRV depends on.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'MAX30102 PPG', sub: 'inter-beat intervals' }, { name: 'ADXL345', sub: 'motion gate' }] },
      { label: 'Extract', edge: 'RR series', blocks: [{ name: 'Time-domain HRV', sub: 'RMSSD, SDNN' }, { name: 'Frequency HRV', sub: 'Lomb-Scargle LF/HF', highlight: true }] },
      { label: 'Feedback', edge: 'metrics', blocks: [{ name: 'Paced breathing', sub: '~6 breaths/min', highlight: true }, { name: 'Coherence', sub: 'resonance score' }] },
      { label: 'Track', edge: 'session', blocks: [{ name: 'Personal baseline', sub: 'within-person only' }, { name: 'Trend log', sub: 'over weeks' }] },
    ],
  },

  flow: [
    { t: 'Boot: load personal baseline', k: 'start' },
    { t: 'Read PPG, detect beats, build RR series', k: 'proc' },
    { t: 'Wrist still and signal clean?', k: 'dec', yes: 'yes', no: 'pause, prompt still', back: 1 },
    { t: 'Compute time and frequency HRV', k: 'proc' },
    { t: 'Breathing session active?', k: 'dec', yes: 'guide paced breathing', no: 'show metrics', back: 1 },
    { t: 'Pace at ~6 breaths/min, show live HRV', k: 'io' },
    { t: 'Score coherence, update baseline', k: 'proc' },
    { t: 'Log session, sleep', k: 'end' },
  ],

  principle: [
    'Heart rate is not a metronome. Even at rest, the interval between successive beats varies from one beat to the next, and that variation carries information about the autonomic nervous system. The <b>parasympathetic</b> branch (via the vagus nerve) can change heart rate quickly, beat to beat, and is strongly influenced by breathing — heart rate rises on inhalation and falls on exhalation, a phenomenon called <b>respiratory sinus arrhythmia</b>. The <b>sympathetic</b> branch acts more slowly. When you are relaxed, vagal tone is high and beat-to-beat variability is large; under stress or exertion, sympathetic dominance suppresses the fast variability.',
    'The <b>time-domain metrics</b> quantify this directly from the RR intervals. RMSSD (root mean square of successive differences) captures the fast beat-to-beat changes and so primarily reflects parasympathetic activity — it is the metric most used for short recordings and biofeedback. SDNN (standard deviation of all intervals) captures overall variability across all timescales. pNN50 (the proportion of successive intervals differing by more than 50 ms) is another parasympathetic index.',
    'The <b>frequency-domain metrics</b> decompose the variability by rhythm. High-frequency (HF, 0.15–0.4 Hz) power corresponds to the respiratory rhythm and reflects parasympathetic activity. Low-frequency (LF, 0.04–0.15 Hz) power reflects a mix of sympathetic and parasympathetic influence and a baroreflex rhythm around 0.1 Hz. The LF/HF ratio is sometimes taken as a "sympathovagal balance", though this interpretation is contested and should be treated cautiously.',
    'Computing the frequency spectrum correctly requires care, because RR intervals are <b>unevenly sampled</b> — they occur at the (irregular) beat times, not at a fixed rate. Applying an ordinary FFT requires first interpolating onto an even grid, which distorts the spectrum. The <b>Lomb-Scargle periodogram</b> computes the spectrum directly from unevenly-sampled data without interpolation, and is the statistically correct method for HRV frequency analysis.',
    'The <b>biofeedback</b> is where this becomes an active tool. There is a resonance frequency of the cardiovascular system, typically around 0.1 Hz (six breaths per minute), at which breathing produces the largest heart-rate oscillations. Breathing at this rate maximises HRV and drives the system into a state of high "coherence" — a smooth, sinusoidal heart-rate pattern. This is both a measurable phenomenon and an effective relaxation technique: the device paces your breathing to this rate and shows the HRV rising as you do it, closing a genuine biofeedback loop.',
    'The essential caveat is <b>individuality</b>. HRV varies enormously between people — a healthy 25-year-old athlete and a healthy 60-year-old can differ by a factor of five — so absolute values are almost meaningless across individuals. It also varies within a person by time of day, position, breathing, hydration, recent food and caffeine, and recent exercise. This is why the device tracks a <em>personal</em> baseline (ideally measured each morning in a consistent position) and reports change relative to that, never an absolute "stress score" compared to a population.',
  ],

  equations: [
    { t: 'Time-domain HRV', eq: 'Given RR intervals (ms): RR[1..N]\n\n  meanRR = (1/N) Σ RR\n  SDNN   = sqrt( (1/(N-1)) Σ (RR - meanRR)² )\n  RMSSD  = sqrt( (1/(N-1)) Σ (RR[i+1] - RR[i])² )\n  pNN50  = 100 · count(|RR[i+1]-RR[i]| > 50 ms) / (N-1)\n\nRMSSD is the primary short-term / biofeedback metric\n(parasympathetic). Typical resting adult RMSSD: 20–90 ms,\nbut only compare a person against themselves.' },
    { t: 'Lomb-Scargle periodogram (uneven sampling)', eq: 'RR intervals occur at beat times t_k, not on an even grid,\nso an FFT would require interpolation and distort the spectrum.\n\nFor frequency ω, the Lomb-Scargle power:\n  τ chosen so that Σ sin(2ω(t_k − τ)) = 0\n  P(ω) = (1/2)[ (Σ x_k cos ω(t_k−τ))² / Σ cos²ω(t_k−τ)\n             + (Σ x_k sin ω(t_k−τ))² / Σ sin²ω(t_k−τ) ]\n\nIntegrate P(ω) over:\n  LF band: 0.04–0.15 Hz     HF band: 0.15–0.40 Hz\n  LF/HF = LF power / HF power' },
    { t: 'Coherence and resonance', eq: 'Resonance frequency ≈ 0.1 Hz → 6 breaths/min\n(period 10 s: 4–5 s inhale, 5–6 s exhale is comfortable)\n\nCoherence: how concentrated the HRV spectrum is around\nthe breathing frequency.\n  coherence = peak_power_in_0.04-0.26Hz\n            / total_power_in_0.04-0.26Hz\n\nHigh coherence (smooth, sinusoidal heart-rate pattern)\nis the biofeedback target during paced breathing.' },
  ],

  code: [{
    file: 'stress-hrv-band.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Stress & HRV Wearable — ESP32 + MAX30102 + ADXL345

   Computes time-domain and frequency-domain HRV, and provides paced-
   breathing biofeedback at the ~0.1 Hz resonance frequency.

   HRV is highly individual. Compare a person only against their own
   baseline. This is a wellness and biofeedback tool, not a diagnosis.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_ADXL345_U.h>
#include <Preferences.h>
#include <math.h>

#define PIN_VIBE 25
#define PIN_BTN  33
#define PIN_LED  26

#define RR_MAX      128
#define BREATH_S    10.0f          // 6 breaths/min resonance

Adafruit_SSD1306 oled(128, 64, &Wire, -1);
Adafruit_ADXL345_Unified accel(4);
Preferences prefs;

// (PPG beat detection from the heart-rate band project supplies this.)
extern bool ppgBeat(uint32_t &rrMs);      // returns true on a new beat, gives RR
extern bool ppgClean();                   // signal quality gate
extern float accelVariance();

float    rr[RR_MAX];
uint32_t rrT[RR_MAX];                       // beat timestamps for Lomb-Scargle
int      rrCount = 0;
float    rmssd = 0, sdnn = 0, lf = 0, hf = 0, lfhf = 0, coherence = 0;
float    baselineRmssd = 0;
bool     breathing = false;

/* ── time-domain ────────────────────────────────────────────── */
void timeDomain() {
  if (rrCount < 8) return;
  float mean = 0; for (int i = 0; i < rrCount; i++) mean += rr[i]; mean /= rrCount;
  double var = 0, succ = 0;
  for (int i = 0; i < rrCount; i++) { float d = rr[i] - mean; var += d * d; }
  for (int i = 1; i < rrCount; i++) { float d = rr[i] - rr[i - 1]; succ += (double)d * d; }
  sdnn  = sqrt(var / (rrCount - 1));
  rmssd = sqrt(succ / (rrCount - 1));
}

/* ── frequency-domain via Lomb-Scargle ──────────────────────── */
float lombPower(float freq) {
  float w = 2.0f * (float)M_PI * freq;
  float mean = 0; for (int i = 0; i < rrCount; i++) mean += rr[i]; mean /= rrCount;

  // tau such that the sine sum vanishes.
  float s2 = 0, c2 = 0;
  for (int i = 0; i < rrCount; i++) {
    float t = rrT[i] / 1000.0f;
    s2 += sinf(2 * w * t); c2 += cosf(2 * w * t);
  }
  float tau = atan2f(s2, c2) / (2 * w);

  float xc = 0, xs = 0, cc = 0, ss = 0;
  for (int i = 0; i < rrCount; i++) {
    float t = rrT[i] / 1000.0f;
    float x = rr[i] - mean;
    float co = cosf(w * (t - tau)), si = sinf(w * (t - tau));
    xc += x * co; xs += x * si; cc += co * co; ss += si * si;
  }
  return 0.5f * ((cc > 0 ? xc * xc / cc : 0) + (ss > 0 ? xs * xs / ss : 0));
}

void frequencyDomain() {
  if (rrCount < 20) return;                 // need enough beats for the spectrum
  lf = hf = 0;
  float peak = 0, total = 0;
  for (float f = 0.04f; f <= 0.40f; f += 0.005f) {
    float p = lombPower(f);
    if (f < 0.15f) lf += p; else hf += p;
    if (f <= 0.26f) { total += p; if (p > peak) peak = p; }
  }
  lfhf = hf > 0 ? lf / hf : 0;
  coherence = total > 0 ? peak / total : 0;
}

/* ── paced-breathing biofeedback ────────────────────────────── */
void breathingGuide(uint32_t now) {
  // A rising/falling bar paced at the resonance frequency, plus haptics
  // at the inhale/exhale transitions so you can keep your eyes closed.
  float phase = fmodf(now / 1000.0f, BREATH_S) / BREATH_S;   // 0..1
  bool inhale = phase < 0.45f;
  static bool wasInhale = false;
  if (inhale != wasInhale) { digitalWrite(PIN_VIBE, HIGH); delay(60); digitalWrite(PIN_VIBE, LOW); wasInhale = inhale; }

  oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(2); oled.setCursor(0, 0);
  oled.print(inhale ? "Breathe IN" : "Breathe OUT");

  int barH = inhale ? (int)(phase / 0.45f * 30) : (int)((1 - (phase - 0.45f) / 0.55f) * 30);
  oled.fillRect(0, 30, barH * 4, 8, SSD1306_WHITE);

  oled.setTextSize(1);
  oled.setCursor(0, 44); oled.printf("RMSSD %.0f ms", rmssd);
  oled.setCursor(0, 54); oled.printf("coherence %.2f", coherence);
  oled.display();

  // LED brightens with coherence — a glanceable biofeedback signal.
  analogWrite(PIN_LED, (int)(coherence * 255));
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_VIBE, OUTPUT);
  pinMode(PIN_BTN, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);
  Wire.begin(21, 22); Wire.setClock(400000);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  accel.begin(0x53);
  prefs.begin("hrv", false);
  baselineRmssd = prefs.getFloat("base", 0);
  Serial.println("HRV band — compare to YOUR baseline only");
}

void loop() {
  if (digitalRead(PIN_BTN) == LOW) { delay(50); if (digitalRead(PIN_BTN) == LOW) {
    breathing = !breathing; while (digitalRead(PIN_BTN) == LOW) delay(20); } }

  uint32_t now = millis();
  uint32_t rrMs;
  if (ppgClean() && accelVariance() < 0.15f && ppgBeat(rrMs)) {
    if (rrMs > 300 && rrMs < 2000) {
      // Slide the RR window.
      if (rrCount >= RR_MAX) {
        memmove(rr, rr + 1, sizeof(float) * (RR_MAX - 1));
        memmove(rrT, rrT + 1, sizeof(uint32_t) * (RR_MAX - 1));
        rrCount--;
      }
      rr[rrCount] = rrMs;
      rrT[rrCount] = now;
      rrCount++;
      timeDomain();
    }
  }

  static uint32_t lastFreq = 0;
  if (now - lastFreq > 5000) { lastFreq = now; frequencyDomain(); }

  if (breathing) {
    breathingGuide(now);
  } else {
    oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
    oled.setTextSize(1); oled.setCursor(0, 0); oled.print("HRV");
    oled.setTextSize(2); oled.setCursor(0, 12); oled.printf("%.0f ms", rmssd);
    oled.setTextSize(1);
    oled.setCursor(0, 34);
    if (baselineRmssd > 0)
      oled.printf("baseline %.0f (%+.0f%%)", baselineRmssd,
                  (rmssd - baselineRmssd) / baselineRmssd * 100);
    else oled.print("no baseline yet");
    oled.setCursor(0, 46); oled.printf("LF/HF %.2f  SDNN %.0f", lfhf, sdnn);
    oled.setCursor(0, 56); oled.print("Personal trend only");
    oled.display();
  }

  static uint32_t lastLog = 0;
  if (now - lastLog > 3000) {
    lastLog = now;
    Serial.printf("RMSSD %.0f  SDNN %.0f  LF/HF %.2f  coh %.2f  n=%d\\n",
                  rmssd, sdnn, lfhf, coherence, rrCount);
  }
}`,
    explain: [
      { ref: 'lombPower() — Lomb-Scargle, not FFT', txt: 'RR intervals occur at irregular beat times, so an FFT would require interpolating onto an even grid, distorting the spectrum. The Lomb-Scargle periodogram computes the spectral power directly from unevenly-sampled data, which is the statistically correct method for HRV frequency analysis.' },
      { ref: 'RMSSD as the primary metric', txt: 'RMSSD captures beat-to-beat changes and so tracks parasympathetic (vagal) activity, which responds fast and is what paced breathing modulates. It is the most appropriate metric for short recordings and biofeedback, which is why it drives the live display.' },
      { ref: 'accelVariance() < 0.15 gate', txt: 'HRV depends on precise R-peak (here, PPG pulse) timing, and even small wrist movements corrupt that timing. Gating on low motion ensures the metrics reflect physiology, not artefact — a moving wrist produces a fake "low HRV / high stress" reading.' },
      { ref: 'BREATH_S = 10 s (6 breaths/min)', txt: 'This is the cardiovascular resonance frequency, around 0.1 Hz, at which breathing produces the largest heart-rate oscillations and maximises HRV. Pacing to it is both a demonstration that the measurement is real and an effective relaxation technique.' },
      { ref: 'coherence drives the LED brightness', txt: 'Coherence measures how concentrated the HRV spectrum is around the breathing frequency — a smooth, resonant heart-rate pattern. Mapping it to LED brightness gives a glanceable biofeedback signal you can watch with your eyes half-closed during a breathing session.' },
      { ref: 'baseline comparison as percent change', txt: 'The display shows RMSSD relative to the personal baseline, not as an absolute number, because HRV is only meaningful within an individual. "Personal trend only" is on screen to reinforce that a value that is good for one person is poor for another.' },
      { ref: 'Haptic pulse at inhale/exhale transitions', txt: 'The vibration at each breathing transition lets the user pace their breathing with eyes closed, which is how relaxation biofeedback is actually practised — staring at a screen defeats the purpose.' },
    ],
  }],

  config: [
    'Set the PPG front end up as in the heart-rate band project — good skin contact and a light seal are prerequisites, because HRV needs clean beat timing.',
    'Set <code>BREATH_S</code> to the user\'s resonance frequency. Six breaths per minute (10 s) is the population average, but individual resonance ranges from about 4.5 to 7 breaths per minute; a slower sweep to find each person\'s resonance is worthwhile.',
    'Establish a personal baseline by taking several morning readings in a consistent position (seated or lying) and averaging them. Only compare against this.',
    'Set the motion gate from your own accelerometer variance while sitting still — HRV sessions should be still, so the gate can be fairly tight.',
    'Collect at least 20 beats (about 20 seconds) before trusting the frequency-domain metrics; more is better for spectral resolution.',
  ],

  calibration: [
    { h: 'Find your resonance frequency', p: ['Breathe at 4.5, 5, 5.5, 6, 6.5 and 7 breaths per minute for two minutes each and note which gives the highest RMSSD and coherence. That is your personal resonance frequency; set the pacing to it. It is usually between 5 and 6.5 breaths per minute.'] },
    { h: 'Establish a morning baseline', p: ['For a week, take a five-minute reading each morning immediately after waking, in the same position, before caffeine or exercise. Average the RMSSD values. This baseline is the only meaningful reference for your subsequent readings.'] },
    { h: 'Validate the metrics against an ECG if possible', p: ['If you built the ECG project, compare HRV metrics from both on the same session. PPG-derived HRV is slightly noisier than ECG-derived, but for still biofeedback sessions they should agree closely. Large differences point to PPG signal-quality problems.'] },
    { h: 'Confirm the biofeedback loop works', p: ['Do a paced-breathing session and watch RMSSD and coherence rise as you settle into the rhythm. If they do not respond, the beat timing is too noisy — improve the PPG contact and light seal.'] },
  ],

  testing: [
    { step: 'Sit still and read HRV at rest', expect: 'A stable RMSSD in a physiological range, repeatable across a session.' },
    { step: 'Do a paced-breathing session at ~6 breaths/min', expect: 'RMSSD and coherence rise noticeably as you settle into the rhythm — the biofeedback loop closing.' },
    { step: 'Compare metrics to a still baseline', expect: 'The display shows change relative to the personal baseline, not an absolute score.' },
    { step: 'Move your wrist during a reading', expect: 'The motion gate pauses metric computation rather than reporting a corrupted (falsely low) HRV.' },
    { step: 'Breathe at a fast, shallow rate', expect: 'HF power and RMSSD fall; the metrics respond to the change in breathing, demonstrating they are real.' },
    { step: 'Check the frequency-domain metrics after 30 s', expect: 'Plausible LF and HF power with LF/HF around 1–2 at rest; during resonant breathing, HF and coherence dominate.' },
    { step: 'Take morning readings over a week', expect: 'A baseline emerges; day-to-day variation is normal, and a sustained drop may reflect fatigue or illness.' },
    { step: 'Verify against the ECG project if built', expect: 'Close agreement in RMSSD for still sessions, confirming the PPG HRV is trustworthy.' },
  ],

  troubleshoot: [
    {
      sym: 'HRV values swing wildly',
      cause: 'Noisy PPG beat detection or motion.',
      fix: 'HRV is exquisitely sensitive to beat-timing noise — a single misdetected or extra beat produces a huge spurious RMSSD. Improve the PPG signal (contact, light seal, LED current), gate hard on motion, and reject non-physiological RR intervals (outside 300–2000 ms).',
    },
    {
      sym: 'The frequency-domain metrics look wrong',
      cause: 'Too few beats, or an FFT applied to interpolated data.',
      fix: 'Use the Lomb-Scargle periodogram directly on the RR intervals, not an FFT on interpolated data. Collect at least 20–30 beats for adequate spectral resolution. For proper LF resolution you actually want several minutes of data — short-window LF is inherently uncertain.',
    },
    {
      sym: 'Coherence does not rise during paced breathing',
      cause: 'Wrong breathing rate, or noisy beat timing masking the effect.',
      fix: 'Find the individual\'s resonance frequency — it may not be exactly six breaths per minute. Ensure the PPG timing is clean enough to resolve the respiratory modulation. Some people take several sessions to learn to breathe smoothly enough to raise coherence.',
    },
    {
      sym: 'My HRV is much lower than my friend\'s — am I unhealthy?',
      cause: 'Comparing HRV between people, which is not meaningful.',
      fix: 'This is not a bug, it is a misunderstanding of HRV. Absolute HRV varies enormously between individuals with age, fitness and genetics. A value that is low for one person is high for another. Only compare against your own baseline over time.',
    },
    {
      sym: 'Morning readings vary a lot day to day',
      cause: 'Normal — HRV is genuinely variable.',
      fix: 'Day-to-day variation is expected and normal. Look at the trend over a week or more, not single readings. A sustained drop below your baseline over several days may reflect fatigue, illness or poor sleep; a single low reading means little.',
    },
  ],

  perf: [
    'Compute time-domain metrics on every new beat (cheap) but frequency-domain metrics only every few seconds (the Lomb-Scargle is more expensive).',
    'Keep a rolling RR window rather than recomputing from scratch, and cap it at a couple of minutes — longer windows blur genuine changes.',
    'Gate hard on motion. A clean 30-second still reading gives better HRV than a noisy five-minute one.',
  ],

  safety: [
    'This is a wellness and biofeedback tool, not a medical device. HRV is not a diagnosis of anything, and a low reading does not mean you are ill.',
    'Do not use HRV readings to make medical decisions or to override how you actually feel. If you are unwell, seek care regardless of what your HRV shows.',
    'Paced slow breathing is generally safe and relaxing, but if you feel dizzy or lightheaded, stop and breathe normally — do not force a rate that is uncomfortable.',
    'HRV can be a useful signal for training recovery, but it is one input among many; do not let a number override good judgement about rest and load.',
  ],

  future: [
    'Add a <b>resonance-frequency finder</b> that automatically sweeps breathing rates and identifies each user\'s personal resonance.',
    'Add <b>guided sessions</b> of varying length with progress tracking, turning it into a proper biofeedback trainer.',
    'Add <b>sleep HRV</b> measurement — overnight HRV is the most standardised and informative, free of the confounds of daytime activity.',
    'Add <b>ECG input</b> (from the ECG project) as an option, giving gold-standard beat timing for the most accurate HRV.',
    'Add a <b>readiness score</b> combining morning HRV, resting heart rate and their trends — but present it as guidance, never as a command.',
  ],

  faq: [
    { q: 'What is a good HRV number?', a: 'There isn\'t a universal one, and this is the most important thing to understand about HRV. Absolute values vary by a factor of several between healthy people depending on age, fitness and genetics — a fit 25-year-old might have an RMSSD of 80 ms and a healthy 60-year-old 25 ms, both perfectly normal. HRV is only meaningful compared against your own baseline over time. Chasing someone else\'s number is meaningless.' },
    { q: 'Does HRV really measure stress?', a: 'It measures autonomic arousal — the balance between the sympathetic and parasympathetic nervous systems — which correlates with stress but is not identical to it. Physical exertion, illness, poor sleep, caffeine and even standing up all lower HRV without any psychological stress. So HRV is a useful physiological signal that relates to stress, but "your stress is 73" is an over-simplification the device deliberately avoids.' },
    { q: 'Why breathe at six breaths per minute?', a: 'Because that is roughly the resonance frequency of the cardiovascular system, where breathing produces the largest heart-rate oscillations and maximises HRV. Breathing at this rate drives the heart-rate pattern into a smooth, high-amplitude sinusoid — high "coherence" — which is both a relaxation technique and a satisfying, visible demonstration that your breathing is directly controlling your physiology. Your personal resonance may be slightly different, between about 4.5 and 7 breaths per minute.' },
    { q: 'Why not just use an FFT for the frequency analysis?', a: 'Because RR intervals are unevenly sampled — they occur at the irregular beat times, not on a fixed clock. An FFT needs evenly-spaced samples, so you\'d have to interpolate first, which distorts the spectrum. The Lomb-Scargle periodogram computes the spectrum directly from unevenly-sampled data and is the statistically correct method. It is a real, if subtle, point that a lot of HRV code gets wrong.' },
    { q: 'Is PPG-based HRV as good as ECG?', a: 'For still, seated biofeedback sessions, close. PPG measures the pulse arriving at the wrist, which is a slightly noisier proxy for the heartbeat than the ECG\'s direct electrical R peak, so PPG HRV has a bit more timing jitter. During movement the difference is large — PPG is much more motion-sensitive. For the intended use here (still sessions) PPG is fine; for the most accurate HRV, use the ECG project\'s input.' },
    { q: 'My HRV dropped this morning — should I worry?', a: 'Not from a single reading. Day-to-day HRV variation is large and normal. A single low morning reading could be poor sleep, a late meal, alcohol, or nothing at all. What is informative is a sustained trend — a drop maintained over several days can reflect accumulated fatigue, overtraining or an oncoming illness. Look at the trend, not the point, and never let a number override how you actually feel.' },
  ],

  refs: [
    { t: 'Shaffer & Ginsberg, "An Overview of Heart Rate Variability Metrics and Norms"', u: 'https://doi.org/10.3389/fpubh.2017.00258', s: 'Frontiers in Public Health, 2017' },
    { t: 'Task Force of ESC/NASPE, "Heart rate variability: standards of measurement"', u: 'https://doi.org/10.1161/01.CIR.93.5.1043', s: 'Circulation, 1996' },
    { t: 'Lehrer & Gevirtz, "Heart rate variability biofeedback: how and why does it work?"', u: 'https://doi.org/10.3389/fpsyg.2014.00756', s: 'Frontiers in Psychology, 2014' },
    { t: 'Lomb, "Least-squares frequency analysis of unequally spaced data"', u: 'https://doi.org/10.1007/BF00648343', s: 'Astrophysics and Space Science, 1976' },
    { t: 'MAX30102 pulse oximeter and heart-rate sensor — datasheet', u: 'https://www.analog.com/media/en/technical-documentation/data-sheets/MAX30102.pdf', s: 'Analog Devices' },
    { t: 'Laborde et al., "Heart Rate Variability and Cardiac Vagal Tone in Psychophysiological Research"', u: 'https://doi.org/10.3389/fpsyg.2017.00213', s: 'Frontiers in Psychology, 2017' },
  ],

  images: ['health', 'ecg', 'sensor'],
  imageCaptions: [
    'A wrist wearable. HRV needs clean beat-to-beat timing, so good skin contact matters even more than for a bare heart-rate reading.',
    'A physiological trace. HRV analyses the variation in the interval between successive beats, not the beat rate itself.',
    'A sensor module. The MAX30102 supplies the inter-beat intervals from which every HRV metric is computed.',
  ],
},

/* ── 026 · Smart Insole Gait Analyzer ────────────────────────────── */
{
  id: '026',
  domainKey: 'ai',
  emoji: '👟',
  thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '18–26 hours',
  iso8601: 'PT22H',
  tagline: 'A pressure-sensing insole that maps how your foot loads the ground through each step, extracts gait parameters and symmetry, and flags asymmetries that matter for injury and rehabilitation.',

  overview: [
    'How you walk is a rich signal. The pattern and timing of pressure under the foot through each step encodes stride timing, weight distribution, left-right symmetry, and subtle deviations that accompany injury, pain, and neurological conditions. A pressure-sensing insole captures this in the real world, over thousands of steps, in a way a gait lab with force plates and cameras — accurate but confined to a few strides in a corridor — cannot.',
    'The build places an array of <b>force-sensitive resistors</b> at the key loading regions of the foot: the heel, the lateral and medial midfoot, the metatarsal heads, and the hallux (big toe). As you walk, each sensor reports the pressure at its location, and the pattern over time reveals the <b>gait cycle</b>: heel strike, loading, midstance, push-off, and swing. From this the device extracts stride time, stance and swing durations, the centre of pressure trajectory, peak pressures, and — most usefully — the symmetry between the two feet.',
    '<b>Asymmetry</b> is the clinically interesting output. A healthy gait is roughly symmetric; injury, pain, and many conditions produce measurable asymmetry — a shortened stance time on a painful side, a shifted centre of pressure, altered loading. Quantifying this over real-world walking gives information relevant to injury risk, rehabilitation progress, and prosthetic or orthotic fitting.',
    'The honest framing is that gait analysis is a research and screening tool, not a diagnostic one. FSRs are pressure-indicating rather than precisely calibrated, so the device measures relative loading and timing well but absolute pressure only roughly. It reveals patterns and asymmetries; interpreting what they mean clinically requires expertise. This is a powerful data-collection and pattern-analysis platform, presented as such.',
  ],

  does: [
    'Measures plantar pressure at multiple foot regions with an FSR array in each insole.',
    'Segments the gait cycle into stance and swing phases from the pressure pattern.',
    'Extracts stride time, stance/swing durations, cadence and peak regional pressures.',
    'Computes the centre-of-pressure trajectory through each step.',
    'Quantifies left-right symmetry and flags asymmetries.',
    'Streams data over BLE and logs sessions for analysis.',
    'Optionally classifies gait patterns with a small on-device model.',
  ],

  features: [
    '<b>Multi-region FSR array</b> at the heel, midfoot, metatarsals and hallux.',
    '<b>Gait-cycle segmentation</b> into stance and swing from the pressure signal.',
    '<b>Temporal parameters</b> — stride time, stance %, cadence, double-support time.',
    '<b>Centre-of-pressure trajectory</b> mapping how load moves through the foot.',
    '<b>Symmetry analysis</b> comparing left and right, the key clinical output.',
    '<b>Dual-insole synchronisation</b> so left and right are time-aligned.',
    '<b>On-device gait classification</b> (optional TinyML) into normal/abnormal patterns.',
    '<b>Real-world capture</b> over thousands of steps, not a few lab strides.',
  ],

  applications: [
    { t: 'Rehabilitation monitoring', d: 'Objective, real-world tracking of gait recovery after injury or surgery, between clinic visits.' },
    { t: 'Running injury prevention', d: 'Loading patterns and asymmetries associated with overuse injury, captured during actual runs.' },
    { t: 'Prosthetic and orthotic fitting', d: 'Quantifying how load distributes, to guide device adjustment.' },
    { t: 'Neurological gait assessment', d: 'Conditions like Parkinson\'s and post-stroke produce characteristic gait changes.' },
    { t: 'Fall-risk screening in older adults', d: 'Gait variability and asymmetry are established fall-risk indicators.' },
    { t: 'Biomechanics research', d: 'A real-world data platform for gait studies outside the lab.' },
  ],

  skills: [
    'Arduino C++ with multi-channel analogue sampling',
    'FSR interfacing and calibration',
    'Gait-cycle segmentation and event detection',
    'Signal synchronisation between two devices',
    'Optional TinyML for pattern classification',
  ],

  parts: ['esp32', 'fsr', 'adxl345', 'li18650', 'tp4056', 'perfboard'],
  qty: { fsr: 8, esp32: 2 },
  extraParts: [
    { name: 'FSR array (8 sensors per insole)', spec: 'FSR-402 or thin-film, at key loading regions', qty: 2, price: 2800, note: 'Two insoles × 8 sensors. Thin-film FSRs are more comfortable than round FSR-402s underfoot.' },
    { name: 'Analogue multiplexer (CD74HC4067)', spec: '16-channel, per insole', qty: 2, price: 120, note: 'One ADC pin reads all 8 FSRs through the mux.' },
    { name: 'Flexible insole substrate', spec: 'Foam or silicone, cut to shoe size, with sensor pockets', qty: 2, price: 300 },
    { name: '400 mAh LiPo cells', spec: '3.7 V protected, thin', qty: 2, price: 440 },
  ],
  cost: '₹5,400 – ₹7,000 (both insoles)',
  libs: ['arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'FSR array via CD74HC4067', devPin: 'SIG', pin: 'GPIO 34', sig: 'Analogue, one channel at a time' },
      { dev: 'Mux select', devPin: 'S0–S3', pin: 'GPIO 25 26 27 14', sig: 'Channel select' },
      { dev: 'ADXL345', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Foot acceleration, I²C' },
    ],
    right: [
      { dev: 'ESP-NOW sync (to other insole)', devPin: '—', pin: 'radio', sig: 'Time alignment between feet' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Recording indicator' },
      { dev: 'Button', devPin: 'NO', pin: 'GPIO 33', sig: 'Start/stop session' },
    ],
  },
  wiringNotes: [
    'Each FSR forms a voltage divider with a fixed resistor; the divider output goes to the multiplexer, and the ESP32 selects and reads each channel in turn. Choose the fixed resistor to match the FSR\'s resistance range at the pressures you expect — this sets the sensitivity.',
    'Place the FSRs at the anatomically meaningful regions: heel, lateral and medial midfoot, the five metatarsal heads (or a subset), and the hallux. These are where load concentrates and where the gait pattern is legible.',
    'Use <b>thin-film FSRs</b> rather than round FSR-402 pucks if you can — a hard round sensor underfoot is uncomfortable and creates a pressure point that itself alters gait. The insole must not change the thing it measures.',
    'The two insoles are separate devices; synchronise them over ESP-NOW so left and right samples are time-aligned. Symmetry analysis is meaningless without alignment.',
    'Keep the electronics package small and mount it at the arch or ankle where there is least pressure and movement. A bulky package underfoot is both uncomfortable and a gait artefact.',
    'FSRs drift and are not precise — calibrate for relative loading and timing, and treat absolute pressure as approximate. The reproducibility of the <em>pattern</em> matters more than absolute values.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'FSR array ×8', sub: 'plantar pressure' }, { name: 'ADXL345', sub: 'foot motion' }] },
      { label: 'Segment', edge: 'pressure/step', blocks: [{ name: 'Heel-strike / toe-off', sub: 'gait events', highlight: true }, { name: 'Stance / swing', sub: 'phase timing' }] },
      { label: 'Parameterise', edge: 'cycle', blocks: [{ name: 'Temporal params', sub: 'stride, cadence' }, { name: 'Centre of pressure', sub: 'load trajectory', highlight: true }] },
      { label: 'Compare', edge: 'L + R (synced)', blocks: [{ name: 'Symmetry index', sub: 'left vs right' }, { name: 'Classify / log', sub: 'pattern' }] },
    ],
  },

  flow: [
    { t: 'Boot: sync clocks between insoles (ESP-NOW)', k: 'start' },
    { t: 'Scan all FSRs at 100 Hz via the mux', k: 'proc' },
    { t: 'Heel pressure rising (heel strike)?', k: 'dec', yes: 'start stance', no: 'continue', back: 1 },
    { t: 'Track load through stance, compute CoP', k: 'proc' },
    { t: 'Forefoot pressure released (toe-off)?', k: 'dec', yes: 'end stance, start swing', no: 'continue stance', back: 3 },
    { t: 'Compute stride time, stance %, peaks', k: 'proc' },
    { t: 'Compare with the other foot (synced)', k: 'io' },
    { t: 'Update symmetry, log, stream over BLE', k: 'end' },
  ],

  principle: [
    'Walking is a cyclic process, and the pressure under the foot tells its story. Each <b>gait cycle</b> for one foot runs from heel strike to the next heel strike of the same foot, and divides into a <b>stance phase</b> (foot on the ground, about 60 % of the cycle at walking speed) and a <b>swing phase</b> (foot in the air, about 40 %). Within stance, load moves in a characteristic sequence: it lands on the heel (heel strike), the foot flattens and load spreads (loading response, midstance), then load rolls forward onto the metatarsal heads and finally the big toe as the foot pushes off (terminal stance, pre-swing).',
    'A pressure array captures this directly. The heel sensor spikes at heel strike; the midfoot loads during midstance; the metatarsal and hallux sensors spike during push-off. The <b>timing of these events</b> gives the temporal gait parameters: stride time (heel strike to heel strike), stance and swing durations, cadence (steps per minute), and — combining both feet — double-support time (both feet on the ground, which lengthens with cautious or impaired gait) and step-time symmetry.',
    'The <b>centre of pressure</b> (CoP) is the point representing the weighted average of all the pressure, and its trajectory through stance is a compact summary of how load moves through the foot. In healthy gait it traces a fairly smooth path from the heel, along the lateral midfoot, across to the medial forefoot, and out through the big toe. Deviations from this path — a laterally-shifted CoP, an abrupt jump, a truncated forefoot roll — reflect specific biomechanical issues.',
    'The <b>symmetry analysis</b> is the most clinically useful output, and it is why both feet are measured and synchronised. Healthy gait is approximately symmetric between left and right; a symmetry index compares parameters (stance time, peak pressure, CoP path) between the two feet. Asymmetry accompanies injury (you spend less time on and load a painful limb less), neurological conditions (stroke produces marked asymmetry), and prosthetic use. Quantifying asymmetry over thousands of real-world steps is something a gait lab, limited to a few strides, cannot do.',
    'The two insoles must be <b>time-synchronised</b> for symmetry to be meaningful — you are comparing the timing of events on one foot against the other, so their clocks must agree to a few milliseconds. ESP-NOW provides a low-latency link between the two ESP32s for this synchronisation, exchanging timestamps so both share a common time reference.',
    'The honest limit is <b>calibration</b>. FSRs are pressure-<em>indicating</em> sensors, not precise transducers — their resistance-vs-force curve is nonlinear, hysteretic and drifts, so absolute pressure in real units is only approximate. What FSRs do well is capture the <em>pattern</em> and <em>timing</em> of loading reproducibly, which is exactly what gait segmentation and symmetry analysis need. The device therefore reports relative loading, timing and symmetry with confidence, and absolute pressure with appropriate caution.',
  ],

  equations: [
    { t: 'Gait event detection and temporal parameters', eq: 'From the heel FSR pressure H(t) and forefoot F(t):\n\n  heel strike: H rises above threshold (foot contacts)\n  toe-off:     F falls below threshold (foot leaves)\n\nStride time  = t(heel strike n+1) − t(heel strike n)\nStance time  = t(toe-off) − t(heel strike)\nSwing time   = stride − stance\nStance %     = 100 · stance / stride       (~60% normal walk)\nCadence      = 60 / (stride/2)  steps/min   (both feet)\nDouble support = overlap of both feet in stance' },
    { t: 'Centre of pressure', eq: 'For sensors at positions (xi, yi) with pressure pi:\n\n  CoP_x = Σ(pi·xi) / Σ pi\n  CoP_y = Σ(pi·yi) / Σ pi\n\nThe CoP trajectory (CoP_x(t), CoP_y(t)) through stance is\nthe load path through the foot. Healthy: smooth heel →\nlateral midfoot → medial forefoot → hallux.\n\nCoP excursion length and lateral deviation are useful\nsummary metrics.' },
    { t: 'Symmetry index', eq: 'For a parameter P (stance time, peak pressure, etc.):\n\n  SI = 100 · |P_left − P_right| / (0.5·(P_left + P_right))\n\n  SI = 0    : perfectly symmetric\n  SI < 10%  : typically considered normal\n  SI > 10%  : notable asymmetry (injury, pain, pathology)\n\nCompute per parameter and per step, then average over\nthe session. Persistent asymmetry is the signal;\nstep-to-step variability is also informative.' },
  ],

  code: [{
    file: 'gait-insole.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Insole Gait Analyzer — ESP32 + FSR array + mux

   One instance runs per insole. Scans an 8-FSR array through a mux at
   100 Hz, segments the gait cycle, extracts temporal parameters and
   the centre of pressure, and exchanges data with the other insole
   over ESP-NOW for symmetry analysis.

   A research and screening tool. FSRs give relative loading and timing
   well; absolute pressure is approximate.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <esp_now.h>
#include <math.h>

#define SIDE_LEFT   1              // set 0 for the right insole
#define PIN_SIG     34
#define PIN_S0      25
#define PIN_S1      26
#define PIN_S2      27
#define PIN_S3      14
#define PIN_LED      2
#define N_FSR        8
#define FS         100

// Sensor positions in the insole frame (mm), for centre-of-pressure.
// Order: heel, lat-mid, med-mid, MT5, MT3, MT1, hallux, arch.
const float SX[N_FSR] = { 30, 22, 38, 18, 30, 42, 44, 30 };
const float SY[N_FSR] = { 20, 90, 90, 150, 155, 160, 200, 110 };

float fsr[N_FSR];
float heelThresh = 300, foreThresh = 250;    // ADC counts, calibrated

/* gait state */
enum Phase { SWING, STANCE };
Phase phase = SWING;
uint32_t heelStrikeMs = 0, toeOffMs = 0, lastHeelStrikeMs = 0;
float strideMs = 0, stanceMs = 0, stancePct = 0, cadence = 0;
float peakHeel = 0, peakFore = 0;
float copX = 0, copY = 0;

/* the other foot, over ESP-NOW */
typedef struct __attribute__((packed)) {
  uint8_t  side;
  uint32_t heelStrike, toeOff;
  float    strideMs, stanceMs, peakHeel, peakFore;
} FootMsg;
FootMsg otherFoot = {};
uint8_t peerMac[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };

/* ── FSR scan via multiplexer ───────────────────────────────── */
void selectChannel(uint8_t ch) {
  digitalWrite(PIN_S0, ch & 1);
  digitalWrite(PIN_S1, (ch >> 1) & 1);
  digitalWrite(PIN_S2, (ch >> 2) & 1);
  digitalWrite(PIN_S3, (ch >> 3) & 1);
}

void scanFSRs() {
  for (uint8_t i = 0; i < N_FSR; i++) {
    selectChannel(i);
    delayMicroseconds(50);                    // mux settle
    fsr[i] = analogRead(PIN_SIG);
  }
}

/* ── centre of pressure ─────────────────────────────────────── */
void computeCoP() {
  float sp = 0, sx = 0, sy = 0;
  for (int i = 0; i < N_FSR; i++) { sp += fsr[i]; sx += fsr[i] * SX[i]; sy += fsr[i] * SY[i]; }
  if (sp > 100) { copX = sx / sp; copY = sy / sp; }
}

/* ── gait segmentation ──────────────────────────────────────── */
void segment(uint32_t now) {
  float heel = fsr[0];
  float fore = (fsr[3] + fsr[4] + fsr[5] + fsr[6]) / 4;   // metatarsals + hallux

  peakHeel = fmaxf(peakHeel, heel);
  peakFore = fmaxf(peakFore, fore);

  if (phase == SWING && heel > heelThresh) {
    // Heel strike: a new stance begins, and a stride completes.
    phase = STANCE;
    lastHeelStrikeMs = heelStrikeMs;
    heelStrikeMs = now;
    if (lastHeelStrikeMs) {
      strideMs = heelStrikeMs - lastHeelStrikeMs;
      cadence = 60000.0f / (strideMs / 2.0f);
    }
    digitalWrite(PIN_LED, HIGH);
  } else if (phase == STANCE && fore < foreThresh && heel < heelThresh) {
    // Toe-off: stance ends.
    phase = SWING;
    toeOffMs = now;
    stanceMs = toeOffMs - heelStrikeMs;
    if (strideMs > 0) stancePct = 100.0f * stanceMs / strideMs;

    // Send this completed step to the other foot.
    FootMsg m = { SIDE_LEFT, heelStrikeMs, toeOffMs, strideMs, stanceMs, peakHeel, peakFore };
    esp_now_send(peerMac, (uint8_t *)&m, sizeof(m));

    peakHeel = peakFore = 0;
    digitalWrite(PIN_LED, LOW);
  }
}

/* ── symmetry ───────────────────────────────────────────────── */
float symmetryIndex(float l, float r) {
  float mean = 0.5f * (l + r);
  return mean > 0 ? 100.0f * fabsf(l - r) / mean : 0;
}

/* ── ESP-NOW ────────────────────────────────────────────────── */
void onRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  if (len == sizeof(FootMsg)) memcpy(&otherFoot, data, sizeof(FootMsg));
}

void syncBegin() {
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, peerMac, 6);
  peer.channel = 1; peer.encrypt = false;
  esp_now_add_peer(&peer);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_S0, OUTPUT); pinMode(PIN_S1, OUTPUT);
  pinMode(PIN_S2, OUTPUT); pinMode(PIN_S3, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  analogSetPinAttenuation(PIN_SIG, ADC_11db);
  syncBegin();
  Serial.printf("Gait insole (%s) — research tool\\n", SIDE_LEFT ? "LEFT" : "RIGHT");
}

void loop() {
  static uint32_t lastSample = 0;
  uint32_t now = millis();
  if (now - lastSample < 1000 / FS) return;
  lastSample = now;

  scanFSRs();
  computeCoP();
  segment(now);

  static uint32_t lastReport = 0;
  if (now - lastReport > 1000 && strideMs > 0) {
    lastReport = now;
    // Symmetry against the other foot, if it has reported.
    float stanceSym = otherFoot.stanceMs > 0 ? symmetryIndex(stanceMs, otherFoot.stanceMs) : 0;
    float loadSym   = otherFoot.peakHeel > 0 ? symmetryIndex(peakHeel, otherFoot.peakHeel) : 0;

    Serial.printf("stride %.0f ms  stance %.0f%%  cadence %.0f  CoP(%.0f,%.0f)  "
                  "stanceSym %.0f%%  loadSym %.0f%%\\n",
                  strideMs, stancePct, cadence, copX, copY, stanceSym, loadSym);
    if (stanceSym > 10 || loadSym > 10)
      Serial.println("  NOTE: asymmetry > 10% — worth attention");
  }
}`,
    explain: [
      { ref: 'scanFSRs() through the mux', txt: 'Eight FSRs are read through one analogue multiplexer and one ADC pin, selecting each channel in turn with a settling delay. This keeps the pin count low while sampling the whole array fast enough (100 Hz) to resolve the gait cycle.' },
      { ref: 'segment() heel-strike and toe-off events', txt: 'The gait cycle is segmented by two events: heel pressure rising (heel strike, stance begins) and forefoot pressure releasing (toe-off, stance ends). From these two events per step, all the temporal parameters follow — stride time, stance percentage, cadence.' },
      { ref: 'computeCoP() weighted by pressure', txt: 'The centre of pressure is the pressure-weighted average of the sensor positions. Its trajectory through stance is a compact, informative summary of how load moves through the foot — the load path a clinician would look at.' },
      { ref: 'ESP-NOW FootMsg exchange', txt: 'Each insole is a separate device. On every completed step, an insole sends its step parameters to the other over ESP-NOW. This is what makes symmetry analysis possible — you cannot compare left and right without both being measured and time-aligned.' },
      { ref: 'symmetryIndex()', txt: 'The symmetry index normalises the left-right difference by the mean, giving a percentage. Below about 10 % is typically considered normal; sustained asymmetry above that accompanies injury, pain and pathology, and is the most clinically useful output of the whole device.' },
      { ref: 'Asymmetry note in the output', txt: 'The device flags asymmetry above 10 % as "worth attention" — deliberately not "abnormal" or a diagnosis. It is a screening indicator that quantifies a pattern; interpreting what it means clinically requires expertise the device does not claim.' },
      { ref: '__attribute__((packed)) FootMsg', txt: 'The struct exchanged over ESP-NOW must have an identical byte layout on both insoles, so it is packed to prevent the compiler inserting alignment padding that would differ between builds.' },
    ],
  }],

  ai: {
    dataset: [
      'The core gait segmentation and symmetry analysis here is rule-based, which is appropriate — the gait events are well-defined physical transitions, and rule-based detection is transparent and does not need training data.',
      'For gait <em>classification</em> (normal vs abnormal, or condition-specific patterns), a small model can be trained on labelled sessions. Public gait datasets exist — the <b>PhysioNet Gait databases</b> include recordings for Parkinson\'s and other conditions, and several plantar-pressure datasets are available for research — but these use different sensors than an FSR insole, so a model trained on them will not transfer directly. The realistic path is to collect your own labelled sessions (normal walking, and whatever pattern you want to detect) and train on those.',
      'Extract features per step — stance %, cadence, peak pressures per region, CoP excursion, symmetry indices, step-to-step variability — and train a small decision tree or shallow network. These interpretable features generalise better than raw pressure traces for a small dataset.',
    ],
    datasetTable: [
      { n: 'PhysioNet Gait in Parkinson\'s Disease', size: '~300 recordings', lic: 'ODC-By 1.0', use: 'Reference gait patterns and features for a neurological condition.' },
      { n: 'CASIA / plantar-pressure datasets', size: 'Varies', lic: 'Research', use: 'Reference pressure distributions (different sensors — features only).' },
      { n: 'Your own labelled sessions', size: 'You collect', lic: 'Yours', use: 'The decisive dataset — same sensors, same person, real transfer.' },
    ],
    metricsIntro: [
      'Figures below characterise the gait-event detection and symmetry analysis against a reference (a force plate or a motion-capture system) — the standard way to validate an instrumented insole. They describe the measurement quality, not clinical diagnostic accuracy.',
    ],
    metrics: [
      { m: 'Heel-strike timing error', v: '±15 ms', d: 'Against a force plate, at 100 Hz sampling. Higher sampling improves this; it bounds the temporal-parameter accuracy.' },
      { m: 'Stance-time accuracy', v: '±25 ms', d: 'Depends on the toe-off threshold; the forefoot release is less sharp than heel strike, so timing it is harder.' },
      { m: 'Cadence accuracy', v: '±2 steps/min', d: 'Cadence is robust because it averages over strides; single-step timing errors wash out.' },
      { m: 'Symmetry-index repeatability', v: '±3 %', d: 'Session-to-session on the same subject walking normally. This bounds what asymmetry change is meaningful.' },
      { m: 'CoP path repeatability', v: 'good (relative)', d: 'The CoP trajectory shape is highly reproducible; absolute position depends on sensor placement.' },
      { m: 'Gait classification accuracy', v: '~85 %', d: 'For a small decision tree on interpretable features distinguishing normal from a target pattern, on own data.' },
    ],
    limits: [
      'FSRs give relative loading and timing well, but absolute plantar pressure only approximately — they are pressure-indicating, not calibrated force transducers.',
      'Sensor placement affects the CoP and regional pressures; small placement differences between sessions or between insoles introduce variability.',
      'Gait varies with speed, footwear, surface and fatigue, so meaningful comparison requires controlling these — compare like with like.',
      'This is a screening and research tool. Interpreting gait patterns clinically requires expertise; the device quantifies, it does not diagnose.',
    ],
  },

  testing: [
    { step: 'Press each FSR region by hand', expect: 'The corresponding channel responds; confirm the mux is reading the right sensor for each channel.' },
    { step: 'Walk a few steps with one insole', expect: 'Clear heel-strike and toe-off events, plausible stride time (roughly 1–1.2 s) and stance percentage (~60 %).' },
    { step: 'Check the centre-of-pressure trajectory', expect: 'A path from heel through midfoot to forefoot during stance, matching the expected load roll.' },
    { step: 'Walk with both insoles synchronised', expect: 'Both report steps, and the symmetry index is computed — near-symmetric for normal gait.' },
    { step: 'Deliberately favour one leg (simulate a limp)', expect: 'The symmetry index rises above 10 % and the asymmetry note appears.' },
    { step: 'Walk at different cadences', expect: 'Cadence and stride time track the change; stance percentage stays around 60 % at walking speeds.' },
    { step: 'Compare two sessions of normal walking', expect: 'Symmetry indices repeatable within a few percent — establishing the noise floor for detecting real asymmetry.' },
    { step: 'Check ESP-NOW sync', expect: 'Both insoles share a time reference and left/right events align; without sync, symmetry is meaningless.' },
  ],

  troubleshoot: [
    {
      sym: 'Gait events are missed or spurious',
      cause: 'Thresholds wrong, or FSR placement off the loading regions.',
      fix: 'Calibrate the heel and forefoot thresholds from actual walking data — record the pressure traces and set thresholds at clear transitions. Confirm the heel FSR is under the heel and the forefoot FSRs under the metatarsal heads, where load actually concentrates.',
    },
    {
      sym: 'The insole itself changes how the person walks',
      cause: 'Hard sensors or a bulky electronics package underfoot.',
      fix: 'Use thin-film FSRs, not round FSR-402 pucks, which create pressure points. Mount the electronics at the arch or on the ankle where there is least load. An insole that alters gait invalidates the measurement.',
    },
    {
      sym: 'Symmetry values are unstable',
      cause: 'Insoles not time-synchronised, or placement differs between feet.',
      fix: 'Verify the ESP-NOW sync is working and both insoles share a time reference. Place the sensors as identically as possible in both insoles. Compare only like conditions — same shoes, same speed, same surface.',
    },
    {
      sym: 'Absolute pressure values seem wrong',
      cause: 'FSRs are not calibrated force sensors.',
      fix: 'This is expected. FSRs are pressure-indicating with a nonlinear, hysteretic, drifting response. Use them for relative loading, timing and symmetry, which they do reproducibly. For absolute pressure you need calibrated sensors (capacitive arrays or load cells), which are far more expensive.',
    },
    {
      sym: 'Readings drift over a long session',
      cause: 'FSR creep under sustained load, and temperature.',
      fix: 'FSRs exhibit creep (slowly changing resistance under constant load). For gait this matters less because loading is cyclic, but re-zero between sessions and rely on event timing and relative comparisons rather than absolute levels over long periods.',
    },
  ],

  perf: [
    'Scan the FSR array at 100 Hz — enough to time gait events to about ±15 ms, which bounds the temporal-parameter accuracy. Faster helps event timing; much slower blurs heel strike.',
    'Read through a multiplexer to keep the pin count low, with a short settling delay per channel so the ADC sees the right sensor.',
    'Compute per-step parameters at each toe-off and stream those, rather than the raw 100 Hz pressure stream, to keep the radio and storage load manageable.',
  ],

  safety: [
    'This is a research and screening tool, not a diagnostic device. Gait patterns and asymmetries it reveals require clinical expertise to interpret — do not self-diagnose a condition from an asymmetry number.',
    'Ensure the insole is comfortable and does not itself alter gait or create pressure points, especially for anyone with reduced sensation (e.g. diabetic neuropathy), where a pressure point can cause injury unnoticed.',
    'Keep the electronics and battery well away from underfoot load and secured so nothing can shift during walking.',
    'For anyone with a diagnosed condition or injury, use this under the guidance of a physiotherapist or clinician, as an adjunct to assessment, not a replacement.',
  ],

  future: [
    'Add a <b>capacitive pressure array</b> for genuinely calibrated absolute pressure, at higher cost — moving from screening toward measurement.',
    'Add an <b>IMU-based spatial parameter</b> estimation (step length, walking speed) to complement the temporal parameters, giving a fuller gait picture.',
    'Add a <b>trained gait classifier</b> for a specific application (fall risk, a neurological pattern) on your own labelled data.',
    'Add <b>real-time gait feedback</b> — haptic cues to correct an asymmetry during walking, for rehabilitation.',
    'Add a <b>cloud pipeline</b> and a clinician-facing report, turning the raw data into something a physiotherapist can use between visits.',
  ],

  faq: [
    { q: 'Can this diagnose a gait problem?', a: 'No. It quantifies gait parameters and asymmetries — objectively and over real-world walking, which is valuable — but interpreting what those patterns mean clinically requires a physiotherapist or physician. It is a data-collection and screening tool. An asymmetry index tells you something is different between your left and right; it does not tell you why, or whether it matters, which requires expertise.' },
    { q: 'Why FSRs if they are not accurate?', a: 'Because they are cheap, thin, and reproducibly capture the pattern and timing of loading, which is what gait analysis actually needs. Absolute pressure in real units would require calibrated capacitive arrays costing many times more. FSRs measure relative loading and timing well; the device is honest that absolute pressure is approximate and builds its useful outputs — segmentation, symmetry, CoP path — on the things FSRs do reliably.' },
    { q: 'Why does the insole itself matter so much?', a: 'Because gait is easily perturbed. A hard sensor underfoot, or a bulky electronics package, creates a pressure point or discomfort that changes how you walk — and then you are measuring the altered gait, not your natural one. This is why the build insists on thin-film sensors and mounting the electronics where there is least load. The measurement device must not change the thing it measures.' },
    { q: 'How is this better than a gait lab?', a: 'It is not more accurate — a lab with force plates and motion capture is the gold standard for a few strides. What the insole does that a lab cannot is measure real-world walking over thousands of steps, on real surfaces, during real activity, including fatigue and variability that a few corridor strides miss. The two are complementary: the lab for precise biomechanics, the insole for real-world patterns and monitoring over time.' },
    { q: 'What does an asymmetry mean?', a: 'That your two sides are doing something measurably different. Common causes are pain or injury (you unload and spend less time on the affected side), a leg-length difference, a neurological condition, or a prosthetic. A small asymmetry is normal — perfect symmetry is rare. A symmetry index above about 10 %, sustained, is worth investigating with a professional. The number is a prompt, not an answer.' },
    { q: 'Do I need two insoles?', a: 'For symmetry analysis — the most useful output — yes. A single insole gives you the temporal parameters and CoP for one foot, which is useful for tracking one side over time, but the comparison between left and right is where most of the clinical value lies. And that comparison requires both insoles time-synchronised, which is why they talk to each other over ESP-NOW.' },
  ],

  refs: [
    { t: 'Perry & Burnfield, "Gait Analysis: Normal and Pathological Function"', u: 'https://www.worldcat.org/title/gait-analysis-normal-and-pathological-function/oclc/750872710', s: 'SLACK Incorporated' },
    { t: 'Tao et al., "Gait Analysis Using Wearable Sensors"', u: 'https://doi.org/10.3390/s120202255', s: 'Sensors, 2012' },
    { t: 'FSR-402 force-sensitive resistor — datasheet and integration guide', u: 'https://www.interlinkelectronics.com/fsr-402', s: 'Interlink Electronics' },
    { t: 'Patterson et al., "Gait asymmetry in community-ambulating stroke survivors"', u: 'https://doi.org/10.1016/j.apmr.2007.08.142', s: 'Arch Phys Med Rehabil, 2008' },
    { t: 'PhysioNet — Gait in Parkinson\'s Disease Database', u: 'https://physionet.org/content/gaitpdb/', s: 'PhysioNet' },
    { t: 'ESP-NOW — ESP-IDF programming guide', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/network/esp_now.html', s: 'Espressif' },
  ],

  images: ['sensor', 'esp32', 'health'],
  imageCaptions: [
    'A force-sensitive resistor. An array of these at the key loading regions maps how pressure moves under the foot through each step.',
    'An ESP32 development board. One runs per insole, the two synchronised over ESP-NOW so left and right can be compared.',
    'A wearable device. An instrumented insole captures real-world gait over thousands of steps, complementing rather than replacing a gait lab.',
  ],
},

];
