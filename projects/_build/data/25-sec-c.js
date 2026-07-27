/* Security batch C — 054 Smart Tamper Safe, 055 Door/Window Breach
   Alarm, 056 Networked Fire & Smoke Alarm. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   054 — Smart Tamper Safe
   ══════════════════════════════════════════════════════════════════ */
{
  id: '054',
  domainKey: 'electronics',
  emoji: '🔒', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'A lockbox that records every legitimate opening and — the moment anyone tries to force, move or drill it — sounds an alarm and sends an instant, timestamped tamper alert.',

  overview: [
    'A safe protects valuables in two ways: it resists physical attack, and it tells you when an attack happens. Ordinary safes do only the first, silently — if someone forces, drills or carries one off, you find out when you next open it, often long after the thief is gone. This project adds the second, missing half: a lockbox that keeps a complete access log of who opened it and when, and that detects tampering in real time — a lid forced, the body struck or drilled, the whole safe lifted and moved — sounding a local alarm and firing an instant timestamped notification so you know at the moment it matters, not the morning after.',
    'The intelligence sits around a normal lock. Legitimate access is by keypad or card, and every successful and failed attempt is written to a tamper-evident log with a timestamp, so there is always an accountable record of openings. Tamper detection layers several sensors that together recognise attack: a lid/door contact that flags an opening that did not follow a valid unlock (i.e. it was forced), an accelerometer/vibration sensor that recognises the signatures of striking, drilling or the safe being tilted and carried, and enclosure/tamper switches that trip if the case is opened or the electronics interfered with. Fusing these distinguishes a real attack from an innocent bump, so the alarm is meaningful.',
    'Because a determined attacker will try to cut the power or the network, the design is built to defend itself: it runs on internal battery backup so pulling the mains does not disarm it (and loss of power is itself logged and alerted), the tamper alarm sounds locally regardless of connectivity, and alerts are sent the instant tamper is detected rather than on a schedule an attacker could wait out. Everything — openings, failed attempts, tamper events, power loss — is timestamped and, where possible, mirrored off-device so the record survives even if the safe is taken. It is honest that a DIY tamper layer does not turn a lockbox into a certified burglary-rated safe — physical resistance still depends on the box itself — but it converts a silent container into one that is accountable, self-defending and, crucially, tells you the moment something is wrong.',
  ],
  does: [
    'Logs every legitimate opening and failed attempt with a timestamp',
    'Detects a forced opening (lid opened without a valid unlock)',
    'Recognises attack signatures — striking, drilling, tilting/carrying',
    'Trips on enclosure/tamper interference',
    'Sounds a local alarm and sends an instant tamper notification',
    'Runs on battery backup so cutting power does not disarm it (and logs power loss)',
    'Keeps a tamper-evident record, mirrored off-device where possible',
  ],
  features: [
    'Complete, tamper-evident access log (openings + failed attempts)',
    'Forced-open detection: opening without a valid unlock',
    'Motion/vibration attack recognition (strike, drill, carry)',
    'Enclosure tamper and power-loss detection',
    'Instant local alarm + notification, not scheduled reporting',
    'Battery backup so power-cut attacks do not disarm it',
    'Honest scope: adds detection/accountability, not a burglary rating',
  ],
  applications: [
    { t: 'Home / office valuables and documents', d: 'A lockbox that both controls access and alerts instantly if it is attacked or moved.' },
    { t: 'Cash handling / small retail', d: 'A till-safe with an access log per user and immediate tamper alerts.' },
    { t: 'Pharmacy / controlled-item storage', d: 'Accountable access to medicines or controlled items with a tamper trail.' },
    { t: 'Shared / hostel lockers', d: 'Per-user access logging and movement/forced-open detection for shared storage.' },
  ],
  skills: [
    'Access logging with a real-time clock (tamper-evident)',
    'Fusing contact, vibration and accelerometer signals to detect attack',
    'Forced-open logic (opening without a valid unlock)',
    'Battery-backup and power-loss detection',
    'Instant local + remote alerting',
  ],
  prereq: [
    'Detection ≠ resistance: this adds accountability and alarms, not a burglary rating; physical strength is the box\'s.',
    'Fuse multiple sensors so an innocent bump is not an alarm and a real attack is not missed.',
    'Provide battery backup and detect/alert on power loss — cutting power is the obvious attack.',
    'Alert instantly and mirror the log off-device so the record survives even if the safe is taken.',
  ],

  parts: ['esp32', 'keypad', 'rc522', 'reed', 'mpu6050', 'vibration', 'solenoid', 'buzzer', 'rtc', 'li18650'],
  extraParts: [
    { name: 'Solenoid/motor lock + strike', spec: 'Electric lock for the lid/door, fail-secure', qty: 1, price: 700, note: 'Fail-secure so power loss does not open it' },
    { name: 'Enclosure tamper switches', spec: 'Micro-switches that trip if the case/electronics compartment is opened', qty: 2, price: 120 },
    { name: 'Battery backup + charger', spec: 'Internal pack so mains loss does not disarm; sensed for supervision', qty: 1, price: 350 },
    { name: 'Backup notification path', spec: 'GSM/secondary link so alerts get out even if Wi-Fi is cut', qty: 1, price: 700, note: 'Optional but defeats a Wi-Fi-jam attack' },
  ],
  cost: '₹3,200 – ₹5,000 (+ the lockbox)',
  libs: ['wifi', 'pubsub', 'mfrc522', 'mpu', 'ntp', 'preferences', 'sqlite'],

  pins: {
    left: [
      { dev: 'Keypad / RC522', devPin: 'matrix / SPI', pin: 'GPIO', sig: 'Access credential' },
      { dev: 'Lid reed', devPin: 'NC', pin: 'GPIO 34', sig: 'Open/closed state' },
      { dev: 'MPU-6050', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Motion/attack (I²C)' },
      { dev: 'Vibration', devPin: 'DOUT', pin: 'GPIO 35', sig: 'Strike/drill detection' },
    ],
    right: [
      { dev: 'Lock', devPin: 'IN', pin: 'GPIO 26', sig: 'Actuate (fail-secure)' },
      { dev: 'Tamper switches', devPin: 'NC', pin: 'GPIO 27/14', sig: 'Enclosure interference' },
      { dev: 'Buzzer/siren', devPin: 'IN', pin: 'GPIO 13', sig: 'Local alarm' },
      { dev: 'RTC + battery sense', devPin: 'I²C / ADC', pin: 'GPIO 21-22 / 32', sig: 'Timestamps + power supervision' },
    ],
  },
  wiringNotes: [
    'Use a fail-secure lock so a power cut cannot open the safe; run everything from a battery-backed supply so the electronics stay armed when mains is removed.',
    'Mount the accelerometer rigidly to the safe body so it faithfully feels strikes, drilling and tilting; place a vibration sensor for high-frequency drill/impact energy.',
    'Wire the lid reed so an opening is unambiguous, and cross-check it against the lock state to detect a forced open.',
    'Add enclosure tamper switches on the case and the electronics compartment, wired so opening either trips an alarm.',
    'Give the RTC coin-cell backup and sense the mains/battery so power loss is timestamped and alerted.',
  ],

  block: { columns: [
    { label: 'Access', edge: 'right', blocks: [
      { name: 'Keypad/card', sub: 'legitimate open', highlight: true },
      { name: 'Lid reed', sub: 'open/closed' },
    ] },
    { label: 'Detect attack', edge: 'right', blocks: [
      { name: 'Accelerometer', sub: 'strike/tilt/carry' },
      { name: 'Vibration', sub: 'drill/impact' },
      { name: 'Tamper switches', sub: 'case opened' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'fuse + forced-open' },
      { name: 'Log', sub: 'tamper-evident' },
    ] },
    { label: 'Respond', edge: 'none', blocks: [
      { name: 'Local alarm', sub: 'instant' },
      { name: 'Notify', sub: 'off-device' },
    ] },
  ] },
  flow: [
    { t: 'Armed / idle', k: 'start' },
    { t: 'Valid unlock?', k: 'dec', yes: 'Unlock; log opening', no: 'Check for attack' },
    { t: 'Unlock; log opening', k: 'io' },
    { t: 'Check for attack', k: 'proc' },
    { t: 'Lid opened w/o unlock, or strike/tilt/tamper/power-loss?', k: 'dec', yes: 'Alarm + instant alert + log', no: 'Armed / idle' },
    { t: 'Alarm + instant alert + log', k: 'io' },
    { t: 'Relock; re-arm', k: 'end', back: 'Armed / idle' },
  ],

  principle: [
    'The safe\'s premise is that a container should be <b>accountable and self-aware</b>, not just strong. Physical resistance — how long the box withstands a drill or a pry bar — is a property of the box\'s material and construction, and this project does not change it. What it adds is the two things a plain safe lacks: a <b>record</b> of every legitimate access, so you always know who opened it and when, and <b>real-time detection</b> of attack, so you learn about a break-in as it happens rather than at the next opening. Those two properties transform the safe from a passive vault into an active guardian of its contents.',
    'Detecting attack reliably means <b>sensor fusion</b>, because no single sensor cleanly separates an assault from ordinary life. A lid contact alone cannot tell a normal opening from a forced one; an accelerometer alone will trip on someone bumping the shelf; a vibration sensor alone fires on a slammed door nearby. The key discriminators come from combining them with <b>context</b>. The most powerful is the <b>forced-open</b> test: if the lid contact reports the safe is open but no valid unlock preceded it, that is an attack by definition — a legitimate opening always follows an authorised credential, so an opening without one is unauthorised. Layered on top, the accelerometer recognises the signatures of specific attacks — the repetitive high-energy impacts of striking, the sustained buzz of drilling, the slow tilt-and-lift of the whole safe being carried away — and the enclosure tamper switches catch attempts to open the case or disable the electronics. Fused, these turn "something moved" into "the safe is being forced / drilled / carried", which is an alarm worth acting on.',
    'A safe\'s alarm system must assume the attacker will <b>attack the alarm itself</b>, and the obvious move is to cut the power or the network. So the design defends those: <b>battery backup</b> keeps the electronics armed when the mains is pulled, and — importantly — the loss of mains is itself treated as a <b>tamper event</b>, logged and alerted, because an unexpected power cut to a safe is suspicious. The alarm sounds <b>locally</b> the instant tamper is detected, independent of any network, so jamming Wi-Fi does not buy silence. Alerts are sent <b>immediately</b> on detection rather than on a polling schedule an attacker could exploit, ideally over a path that a local jammer cannot easily kill (a secondary link). And because the safe might be carried off entirely, the log is <b>mirrored off-device</b> where possible, so the evidence survives even if the box does not.',
    'The whole thing is bound by <b>tamper-evident logging and honest scope</b>. Every event — each opening, each failed code, each tamper trip, each power loss — is timestamped against a backed-up clock and appended to storage that cannot be quietly rewritten, giving both an access-accountability trail and a forensic record of any attack. And the design is candid about what it is: a detection-and-accountability layer around a lockbox, not a certified burglary- or fire-rated safe. It will not make a thin box strong. But it makes any box <i>truthful</i> — it records who used it, and it shouts, immediately and unmissably, the moment someone tries to attack it, which is exactly the half that ordinary safes leave out.',
  ],
  equations: [
    { t: 'Forced-open detection', eq: 'A legitimate opening always follows a valid unlock:\n\n  forced_open = lid_open AND (time_since_valid_unlock > τ)\n\nIf the lid reports open but no authorised credential\npreceded it within τ, the opening is unauthorised → alarm.\nThis single context test catches the core attack.' },
    { t: 'Attack-signature fusion', eq: 'From accelerometer a(t) and vibration v(t):\n\n  strike : repeated high |a| impulses\n  drill  : sustained high-frequency v energy\n  carry  : orientation change (tilt) + low-freq motion\n           sustained over seconds\n\n  attack = strike OR drill OR carry OR tamper_switch\n           OR forced_open OR power_loss\n\nContext + fusion separate assault from an innocent bump.' },
    { t: 'Power-loss as tamper', eq: 'Battery backup keeps the safe armed; mains state is watched:\n\n  if mains_lost AND not(maintenance_mode):\n     log \"power loss\" ; raise tamper alert\n\nAn unexpected power cut to a safe is itself suspicious —\nit is the classic move to disable an alarm.' },
  ],

  assembly: [
    { h: 'Fit the lock and arm-through-power-loss electronics', p: [
      'Install a fail-secure lock so power loss cannot open the safe, and run all electronics from an internal battery-backed supply so removing mains leaves it armed. Sense the mains so its loss is detectable.',
    ], warn: 'If pulling the plug disarms the safe or opens the lock, the whole system is defeated by the simplest attack. Fail-secure lock and battery backup are non-negotiable.' },
    { h: 'Mount the detection sensors', p: [
      'Bolt the accelerometer rigidly to the safe body and add a vibration sensor for drill/impact energy; fit the lid reed and enclosure tamper switches on the case and the electronics compartment.',
    ] },
    { h: 'Set up access, clock, alarm and notification', p: [
      'Add the keypad/card reader for legitimate access, a backed-up RTC for timestamps, a loud local siren, and a notification path (ideally with a secondary link) so alerts get out even if Wi-Fi is cut.',
    ] },
  ],
  steps: [
    { h: 'Log legitimate access', p: [
      'On a valid credential, unlock and append a timestamped opening record; on a bad attempt, log the failure. Keep the log append-only and mirror it off-device.',
    ], tip: 'Record the credential and outcome for every attempt — repeated failures are themselves a warning sign worth alerting on.' },
    { h: 'Detect attack by fusion and context', p: [
      'Continuously evaluate the forced-open test, the accelerometer/vibration attack signatures, the tamper switches and power state, and raise an alarm on any of them.',
    ], code: {
      file: 'tamper-detect.ino', lang: 'cpp',
      body: `uint32_t lastValidUnlock = 0;
#define UNLOCK_GRACE_MS 8000     // opening must follow a valid unlock within this

bool forcedOpen(bool lidOpen) {
  return lidOpen && (millis() - lastValidUnlock > UNLOCK_GRACE_MS);
}

// Classify accelerometer/vibration activity into attack signatures.
bool attackMotion(float aMag, float vibEnergy, float tiltDeg) {
  static uint8_t impacts = 0; static uint32_t drillMs = 0;
  bool strike = aMag > 2.5f;                       // hard impulse (g)
  if (strike) impacts++; else if (impacts) impacts--;
  bool drilling = vibEnergy > VIB_THRESH;
  if (drilling) drillMs += 50; else drillMs = 0;
  bool carry = tiltDeg > 20.0f;                    // being tilted/lifted
  return (impacts > 4) || (drillMs > 1500) || carry;
}

bool tamperDetected(bool lidOpen, float aMag, float vib, float tilt,
                    bool caseTamper, bool mainsLost) {
  return forcedOpen(lidOpen) || attackMotion(aMag, vib, tilt)
         || caseTamper || mainsLost;
}`,
      explain: [
        { ref: 'return lidOpen && (millis() - lastValidUnlock > UNLOCK_GRACE_MS)', txt: 'The forced-open test: an opening that did not follow an authorised unlock within the grace window is unauthorised by definition, catching the core attack with simple context.' },
        { ref: 'if (strike) impacts++; else if (impacts) impacts--', txt: 'Repeated hard impulses accumulate toward a strike alarm while isolated bumps decay away, separating a real assault from an innocent knock.' },
        { ref: 'if (drilling) drillMs += 50; else drillMs = 0', txt: 'Sustained high-frequency vibration energy over time is the signature of drilling, distinct from a momentary vibration.' },
        { ref: 'bool carry = tiltDeg > 20.0f', txt: 'A sustained change in orientation means the whole safe is being tilted and carried away — an attack a stationary safe would never produce.' },
        { ref: 'return forcedOpen(lidOpen) || attackMotion', txt: 'Any one of forced-open, attack motion, case tamper, or power loss raises the alarm — fusion so no single evasion defeats detection.' },
      ],
    } },
    { h: 'Alarm instantly and alert off-device', p: [
      'On any tamper, sound the local siren immediately, append the event to the log, and fire an instant notification over the (ideally redundant) path — never wait for a schedule.',
    ] },
  ],

  code: [{
    file: 'smart-tamper-safe.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Tamper Safe — ESP32

   Logs legitimate access and detects attack in real time (forced open,
   strike, drill, carry, case tamper, power loss), sounding a local
   alarm and sending an instant tamper alert. Battery-backed so cutting
   power does not disarm it. Adds detection/accountability, not a rating.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <MPU6050.h>
#include <RTClib.h>
#include <Preferences.h>
#include <math.h>

#define PIN_LID    34
#define PIN_VIB    35
#define PIN_TAMPER 27
#define PIN_MAINS  32     // high when mains present
#define PIN_LOCK   26
#define PIN_SIREN  13
#define UNLOCK_GRACE_MS 8000

MPU6050    imu;
RTC_DS3231 rtc;
Preferences prefs;
WiFiClient net; PubSubClient mqtt(net);
uint32_t lastValidUnlock = 0, logSeq = 0;
bool alarmed = false;

void logEvent(const char *type, const char *detail) {
  DateTime t = rtc.now();
  // Append-only local record.
  appendLog(logSeq++, t, type, detail);
  // Instant off-device mirror/alert (redundant path if available).
  char m[160];
  snprintf(m, sizeof m, "{\\"type\\":\\"%s\\",\\"detail\\":\\"%s\\"}", type, detail);
  mqtt.publish("safe/1/event", m);
}

void unlock(const char *who) {
  lastValidUnlock = millis();
  digitalWrite(PIN_LOCK, HIGH); delay(4000); digitalWrite(PIN_LOCK, LOW);
  logEvent("open", who);                    // legitimate access logged
}

bool attackMotion() {
  int16_t ax,ay,az; imu.getAcceleration(&ax,&ay,&az);
  float g = 1.0f/16384.0f;
  float aMag = sqrtf((ax*g)*(ax*g)+(ay*g)*(ay*g)+(az*g)*(az*g));
  float tilt = acosf(constrain((az*g)/aMag,-1.0f,1.0f))*57.3f;  // from vertical
  bool vib = digitalRead(PIN_VIB) == HIGH;

  static uint8_t impacts=0; static uint32_t drillMs=0; static float tilt0=NAN;
  if (isnan(tilt0)) tilt0 = tilt;
  if (aMag > 2.5f) impacts++; else if (impacts) impacts--;
  if (vib) drillMs += 50; else drillMs = 0;
  bool carry = fabsf(tilt - tilt0) > 20.0f;
  return (impacts > 4) || (drillMs > 1500) || carry;
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LID, INPUT_PULLUP);
  pinMode(PIN_VIB, INPUT);
  pinMode(PIN_TAMPER, INPUT_PULLUP);
  pinMode(PIN_MAINS, INPUT);
  pinMode(PIN_LOCK, OUTPUT);
  pinMode(PIN_SIREN, OUTPUT);
  Wire.begin(21,22); imu.initialize(); rtc.begin();
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
}

void loop() {
  if (!mqtt.connected() && WiFi.status()==WL_CONNECTED) mqtt.connect("safe-1");
  mqtt.loop();

  // legitimate access (keypad/card handled elsewhere -> calls unlock())
  handleAccess();

  bool lidOpen   = digitalRead(PIN_LID) == HIGH;
  bool caseTamper = digitalRead(PIN_TAMPER) == HIGH;
  bool mainsLost = digitalRead(PIN_MAINS) == LOW;

  bool forced = lidOpen && (millis() - lastValidUnlock > UNLOCK_GRACE_MS);
  bool tamper = forced || attackMotion() || caseTamper || mainsLost;

  if (tamper && !alarmed) {
    alarmed = true;
    digitalWrite(PIN_SIREN, HIGH);          // instant local alarm
    const char *why = forced ? "forced open" :
                      caseTamper ? "case tamper" :
                      mainsLost ? "power loss" : "attack motion";
    logEvent("TAMPER", why);                // instant alert + log
  }
  if (!tamper) { alarmed = false; digitalWrite(PIN_SIREN, LOW); }

  delay(50);
}`,
    explain: [
      { ref: 'void unlock(const char *who)', txt: 'A legitimate opening records the time of the valid unlock and logs the access — this timestamp is what the forced-open test measures against.' },
      { ref: 'bool forced = lidOpen && (millis() - lastValidUnlock > UNLOCK_GRACE_MS)', txt: 'The lid opening without a recent authorised unlock is a forced entry — the single most decisive attack signal.' },
      { ref: 'bool carry = fabsf(tilt - tilt0) > 20.0f', txt: 'A sustained change from the safe\'s resting orientation means it is being tilted and carried off, a motion a static safe never makes.' },
      { ref: 'bool mainsLost = digitalRead(PIN_MAINS) == LOW', txt: 'Loss of mains is treated as a tamper condition, because the battery keeps the safe armed and an unexpected power cut to a safe is itself suspicious.' },
      { ref: 'digitalWrite(PIN_SIREN, HIGH);          // instant local alarm', txt: 'The siren sounds locally the instant tamper is detected, independent of any network, so jamming connectivity does not buy the attacker silence.' },
    ],
  }],

  config: [
    'Set the unlock grace window, the strike/drill/tilt thresholds, and which events alert.',
    'Configure access credentials and the tamper-evident log (RTC/NTP, off-device mirror).',
    'Ensure the lock is fail-secure and the battery backup sized for the armed run-time you need.',
    'Configure the notification path(s), ideally with a redundant link against Wi-Fi jamming.',
  ],
  calibration: [
    { h: 'Attack thresholds', p: [
      'Tune strike/drill/tilt thresholds by simulating each attack (safely) and confirming detection, while normal handling and nearby bumps do not alarm.',
    ] },
    { h: 'Forced-open grace', p: [
      'Set the grace window long enough for a legitimate open after unlocking but short enough that a forced open is caught quickly.',
    ] },
    { h: 'Power/backup', p: [
      'Verify the safe stays armed and detects/alerts on a simulated mains cut, and that battery run-time meets your requirement.',
    ] },
  ],
  testing: [
    { step: 'Open with a valid credential', expect: 'Unlocks; opening logged; no alarm' },
    { step: 'Open the lid without unlocking', expect: 'Forced-open alarm + instant alert + log' },
    { step: 'Strike/drill the body (simulated)', expect: 'Attack-motion alarm' },
    { step: 'Tilt and lift the safe', expect: 'Carry alarm' },
    { step: 'Cut mains power', expect: 'Stays armed on battery; power-loss tamper alert + log' },
    { step: 'Open the electronics compartment', expect: 'Case-tamper alarm' },
  ],
  output: [
    'The app shows an access log (openings/failed attempts) and a tamper log (forced open, strike, drill, carry, tamper, power loss), each timestamped; a tamper fires an instant alert.',
    { file: 'safe-event.json', lang: 'json', body: `{
  "type": "TAMPER",
  "detail": "forced open",
  "seq": 512,
  "time": "2026-07-27T02:41:09"
}` },
    'A forced-open event is logged and pushed instantly while the local siren sounds; legitimate openings appear as "open" events with the credential, giving both accountability and real-time attack alerts.',
  ],
  troubleshoot: [
    { sym: 'Nuisance alarms from bumps', cause: 'Thresholds too sensitive / single-sensor triggering', fix: 'Require accumulated impacts / sustained energy; fuse with context; raise thresholds' },
    { sym: 'Real attack missed', cause: 'Thresholds too high or sensor not rigidly mounted', fix: 'Mount the accelerometer solidly; lower thresholds; validate each attack signature' },
    { sym: 'Disarmed by pulling the plug', cause: 'No battery backup / not fail-secure', fix: 'Add battery backup and a fail-secure lock; treat power loss as tamper' },
    { sym: 'Alerts blocked by Wi-Fi jam', cause: 'Single network path', fix: 'Add a secondary link; sound the local alarm regardless; alert instantly' },
    { sym: 'Log lost when safe taken', cause: 'Only stored on-device', fix: 'Mirror the log off-device so the record survives loss of the box' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT (+ redundant link) → owner/monitoring',
    net: {
      nodes: [{ name: 'Smart safe', sub: 'ESP32' }, { name: 'Backup link', sub: 'GSM optional' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router / GSM', gatewaySub: 'redundant path',
      uplink: 'MQTT/TLS', cloud: 'Owner app / monitor', cloudSub: 'access + tamper logs',
      clients: [{ name: 'Owner', sub: 'instant alerts' }, { name: 'Monitor', sub: 'audit trail' }],
    },
    protocol: ['Access and tamper events publish immediately over TLS, ideally on a redundant path so a local jam cannot silence alerts; the local siren and logging are independent of the network.'],
    topics: [
      { t: 'safe/1/event', dir: 'safe → owner', payload: 'open / failed / tamper (type, detail, time)' },
      { t: 'safe/1/status', dir: 'safe → owner', payload: 'armed, battery, mains, RTC health' },
      { t: 'safe/1/cmd', dir: 'owner → safe', payload: 'arm/disarm, acknowledge, maintenance mode' },
    ],
    cloud: ['An owner app / monitoring service keeps the access and tamper trail (mirrored off-device so it survives the safe being taken) and pushes instant tamper alerts, with a maintenance/battery view.'],
    dashboard: ['Access history and tamper events with timestamps, current armed/battery/mains status, and alerting on any tamper.'],
    mobile: ['Instant push on any tamper (forced open, strike/drill, carry, power loss) and on repeated failed access.'],
    security: [
      'TLS and authenticated commands; append-only, off-device-mirrored logs.',
      'Redundant notification path and local alarm so jamming/power-cut cannot buy silence.',
      'Treat power loss and connectivity loss as suspicious events, not silent conditions.',
    ],
  },

  perf: [
    'Poll the detection sensors fast enough (tens of Hz) to catch a strike/drill promptly.',
    'Accumulate impact/vibration evidence over time to reject bumps without missing sustained attacks.',
    'Keep the local alarm and logging independent of the network; alert instantly on detection.',
    'Mirror the log off-device in near-real time so evidence is not lost with the box.',
  ],
  safety: [
    'This adds detection and accountability, not physical burglary resistance; the box\'s strength is its own.',
    'Use a fail-secure lock and battery backup so power loss neither opens nor disarms the safe.',
    'Do not store the only copy of critical logs on the device that may be stolen — mirror off-device.',
    'For high-value or regulated storage, use a certified safe; this is an enhancement, not a certification.',
  ],
  maintenance: [
    'Test each attack signature and the forced-open logic periodically.',
    'Check and replace the backup battery and RTC coin cell on schedule.',
    'Verify the off-device log mirror and the redundant notification path.',
    'Re-tune thresholds if the safe is relocated or its mounting changes.',
  ],
  future: [
    'Add a GPS/cellular tracker so a carried-off safe can be located.',
    'Add a camera snapshot on tamper for evidence.',
    'Cryptographically sign log records for a court-defensible trail.',
    'Add multi-user roles and duress codes (a code that opens but silently alarms).',
  ],
  faq: [
    { q: 'Does this make my box burglar-proof?', a: 'No — it adds detection and accountability, not physical resistance. It records every opening and alarms instantly on attack, but how long the box withstands a drill is down to the box itself.' },
    { q: 'How does it know an opening was forced?', a: 'A legitimate opening always follows a valid unlock. If the lid opens without an authorised credential just before it, that opening is unauthorised by definition — the core attack signal.' },
    { q: 'What stops a thief just unplugging it?', a: 'Battery backup keeps it armed, the loss of mains is itself logged and alerted as a tamper event, and the local siren sounds regardless of power or network.' },
    { q: 'What if they carry the whole safe away?', a: 'The accelerometer detects the tilt-and-lift of being carried and alarms, and the log is mirrored off-device so the record survives even if the box is taken; a GPS option can help locate it.' },
    { q: 'Won\'t it false-alarm on normal handling?', a: 'It fuses several sensors with context — accumulating impacts, sustained drill energy, sustained tilt — so a single bump does not trip it while a genuine, persistent attack does.' },
  ],
  refs: [
    { t: 'Safes and burglary ratings — overview', u: 'https://en.wikipedia.org/wiki/Safe', s: 'Reference' },
    { t: 'Tamper detection and tamper-evident design', u: 'https://en.wikipedia.org/wiki/Tamper-evident_technology', s: 'Reference' },
    { t: 'Accelerometers for shock/vibration detection', u: 'https://en.wikipedia.org/wiki/Accelerometer', s: 'Reference' },
    { t: 'MPU-6050 accelerometer/gyro (datasheet)', u: 'https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/', s: 'TDK InvenSense' },
    { t: 'Intrusion detection principles', u: 'https://en.wikipedia.org/wiki/Alarm_device', s: 'Reference' },
  ],
  images: ['warehouse', 'esp32', 'oled'],
  imageCaptions: [
    'A lockbox that both controls and records access and detects attack in real time.',
    'ESP32 module fusing lid, accelerometer, vibration and tamper signals to recognise a forced open, drill or carry.',
    'Every opening and every tamper is timestamped and pushed instantly, with a local siren independent of power and network.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   055 — Door/Window Breach Alarm
   ══════════════════════════════════════════════════════════════════ */
{
  id: '055',
  domainKey: 'iot',
  emoji: '🚪', thumb: 'board',
  difficulty: 'Beginner',
  hours: '8–14 hours', iso8601: 'PT12H',
  tagline: 'Magnetic contacts on doors and windows that instantly sound a networked, zoned alarm when one is opened — with supervision so a defeated or dead sensor is never a silent blind spot.',

  overview: [
    'The most reliable intrusion detection is also the simplest: a magnetic contact that knows whether a door or window is open or shut. A magnet on the moving part and a reed switch on the frame keep a circuit made while the two are together; open the door and the circuit breaks. It is fast, unambiguous, cheap and — done right — very hard to fool, which is why magnetic contacts are the backbone of virtually every real alarm system. This project builds a proper multi-zone version: contacts on every protected opening, an ESP32 that watches them all, and a networked alarm that sounds instantly and tells you <b>which</b> door or window was breached.',
    'The step from a toy to a real alarm is in the details that a bare reed switch skips. <b>Zones</b>: each contact is its own zone so the alarm is located — "kitchen window", not just "alarm" — which matters for response and for finding the breach. <b>Arm/disarm</b>: the system has states (armed-away, armed-home, disarmed) with an entry/exit delay so you can leave and enter through a designated door without tripping it, and it distinguishes perimeter openings from interior movement. And critically, <b>supervision</b>: the wiring is monitored (classically with an end-of-line resistor) so that cutting or shorting a sensor loop — the obvious way to defeat a contact — is detected as a fault and alarmed, rather than silently disabling that zone.',
    'Because it is networked, a breach does more than sound a local siren: it pushes an instant located alert to your phone or a control panel, logs the event, and can trigger other actions (lights, cameras). It supports battery backup so a power cut does not disarm it, and it supervises the sensors themselves so a flat wireless contact or a broken wire raises a maintenance warning before an intruder finds it. It is honest that magnetic contacts detect <i>opening</i>, not glass being smashed or a wall being breached (which is why they are layered with glass-break and motion sensors in a complete system), and that a DIY alarm is not a professionally-monitored installation. But as a fast, located, supervised, networked perimeter alarm, it is exactly the dependable first line that catches the overwhelmingly common intrusion: someone opening a door or window that should be shut.',
  ],
  does: [
    'Detects a door/window opening instantly with magnetic contacts',
    'Treats each contact as a located zone (which opening was breached)',
    'Supports armed-away/armed-home/disarmed with entry/exit delays',
    'Supervises the sensor loops so a cut/shorted wire is a fault, not a silent gap',
    'Sounds a local siren and pushes an instant located alert / logs it',
    'Runs on mains with battery backup so a power cut does not disarm it',
    'Distinguishes perimeter openings from interior zones',
  ],
  features: [
    'Reliable, hard-to-fool magnetic-contact detection',
    'Zoned, located alarms for fast response',
    'Arm/disarm states with entry/exit delays',
    'End-of-line supervision against tamper (cut/short)',
    'Networked instant alerts + local siren',
    'Battery backup against power-cut attacks',
    'Honest layering with glass-break/motion for full coverage',
  ],
  applications: [
    { t: 'Home intrusion alarm', d: 'Contacts on all external doors and windows, zoned and armable, with phone alerts and a siren.' },
    { t: 'Small shop / office', d: 'Perimeter protection with located alarms and an audit of open/close events.' },
    { t: 'Storeroom / cabinet monitoring', d: 'Alerting whenever a specific door or cabinet is opened, armed or always.' },
    { t: 'Vacation / second-home watch', d: 'Remote monitoring of a property\'s openings with battery backup and instant alerts.' },
  ],
  skills: [
    'Wiring magnetic (reed) contacts and multi-zone loops',
    'End-of-line supervision to detect cut/short tamper',
    'Arm/disarm state machines with entry/exit delays',
    'Networked alerting and event logging',
    'Battery-backup and power-loss handling',
  ],
  prereq: [
    'Supervise every zone (end-of-line resistor) so cutting or shorting a loop is a detected fault, not a silent blind spot.',
    'Contacts detect opening, not breaking glass or a breached wall — layer with glass-break/motion for full coverage.',
    'Provide battery backup and detect power loss — cutting power is a common attack.',
    'A DIY alarm is not a professionally-monitored system; use one where required.',
  ],

  parts: ['esp32', 'reed', 'buzzer', 'relay1', 'oled', 'keypad', 'li18650'],
  qty: { reed: 6 },
  extraParts: [
    { name: 'Magnetic door/window contacts', spec: 'Reed + magnet contact sets, one per opening (zone)', qty: 8, price: 480, note: 'Surface or recessed; recessed is harder to defeat' },
    { name: 'End-of-line resistors', spec: 'For supervised loops (detect cut/short)', qty: 8, price: 60 },
    { name: 'Siren + strobe', spec: 'Loud internal/external sounder', qty: 1, price: 500 },
    { name: 'Backup battery + charger', spec: 'So a mains cut does not disarm the panel', qty: 1, price: 300 },
  ],
  cost: '₹2,200 – ₹3,800',
  libs: ['wifi', 'pubsub', 'ssd1306', 'ntp', 'preferences'],

  pins: {
    left: [
      { dev: 'Zone loops (supervised)', devPin: 'EOL', pin: 'GPIO 34/35/32/33', sig: 'Per-zone contact + supervision (ADC)' },
      { dev: 'Keypad', devPin: 'matrix', pin: 'GPIO', sig: 'Arm/disarm code' },
      { dev: 'Tamper', devPin: 'NC', pin: 'GPIO 14', sig: 'Panel tamper' },
    ],
    right: [
      { dev: 'Siren relay', devPin: 'IN', pin: 'GPIO 26', sig: 'Sounder' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Status/zone display' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Alerts + logging' },
      { dev: 'Backup battery', devPin: 'sense', pin: 'ADC', sig: 'Power supervision' },
    ],
  },
  wiringNotes: [
    'Wire each zone as a supervised loop with an end-of-line resistor read on an ADC, so a normal closed contact, an open contact, a cut wire and a short each give a distinct level.',
    'Use recessed contacts where possible (harder to defeat than surface-mounted) and one contact per opening for located zones.',
    'Power the panel from mains with automatic battery backup and sense the supply so power loss is detected and alerted.',
    'Add a panel tamper switch, and drive the siren via a relay sized for it.',
    'Keep interior zones separate from perimeter zones so armed-home can watch the perimeter while allowing interior movement.',
  ],

  block: { columns: [
    { label: 'Sense openings', edge: 'right', blocks: [
      { name: 'Zone contacts', sub: 'reed, supervised', highlight: true },
      { name: 'Keypad', sub: 'arm/disarm' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'state machine' },
      { name: 'Entry/exit', sub: 'delays' },
    ] },
    { label: 'Respond', edge: 'right', blocks: [
      { name: 'Siren', sub: 'located alarm' },
      { name: 'Supervision', sub: 'cut/short fault' },
    ] },
    { label: 'Notify', edge: 'none', blocks: [
      { name: 'Phone/panel', sub: 'located alert' },
    ] },
  ] },
  flow: [
    { t: 'Read supervised zones', k: 'start' },
    { t: 'Loop fault (cut/short)?', k: 'dec', yes: 'Zone fault alarm', no: 'Check state' },
    { t: 'Zone fault alarm', k: 'io' },
    { t: 'Check state', k: 'proc' },
    { t: 'Armed and a monitored zone opened?', k: 'dec', yes: 'Entry delay then alarm (located)', no: 'Log open/close' },
    { t: 'Entry delay then alarm (located)', k: 'io' },
    { t: 'Log open/close', k: 'io' },
    { t: 'Siren + notify; await disarm', k: 'end', back: 'Read supervised zones' },
  ],

  principle: [
    'A magnetic contact is the archetypal intrusion sensor because it answers a binary, physical question with almost no ambiguity: is this opening open or shut? A magnet holds a reed switch closed while the door is shut; opening the door separates them and the switch opens. There is little to false-trigger on — no light, temperature or vibration to confuse it — which is why contacts are trusted as the primary perimeter sensor. The engineering that makes a <i>system</i> out of them is about three things the bare switch does not provide: knowing <b>where</b>, controlling <b>when</b> it is active, and detecting attempts to <b>defeat</b> it.',
    '<b>Zoning</b> gives the "where". Each contact is wired and tracked as its own zone, so an alarm is not just "something happened" but "the kitchen window opened", which is what lets a responder go straight to the breach and lets the owner tell a real event from a mistake. Zones are also typed — perimeter (doors/windows) versus interior — so the system can behave differently in different armed states.',
    '<b>Arm/disarm with entry/exit delays</b> gives the "when". A real alarm is not always on; it has states. <i>Disarmed</i>, openings are merely logged. <i>Armed-away</i>, every perimeter and interior zone is active. <i>Armed-home</i>, the perimeter is watched but interior zones are ignored so occupants can move around. And because you must be able to leave and enter through a door without tripping the alarm, a designated entry/exit zone gets a <b>delay</b>: an exit delay after arming to get out, and an entry delay on opening that door to reach the keypad and disarm — while any <i>other</i> zone opening alarms instantly, since an intruder coming through a window has no legitimate delay. This state machine is what makes an alarm livable rather than a constant nuisance.',
    'The "defeat" problem is where amateur systems fail and <b>supervision</b> earns its place. The obvious way to beat a contact is to stop the loop from ever seeing the door open — bypass the switch with a wire (a short), or cut the wire so the panel simply loses the sensor. A naive two-state input (open/closed) cannot tell a healthy closed contact from a shorted-out one, or a cut wire from a benign disconnect, so it can be silently disabled. The classic fix is an <b>end-of-line resistor</b>: a resistor at the far end of the loop so that a healthy closed contact reads one specific resistance, an open contact another, a short reads zero and a cut reads infinite — four distinguishable states from one wire. Now cutting or shorting a zone is a detected <b>tamper/fault</b>, alarmed like any breach, so a defeated sensor is never a silent blind spot. Coupled with <b>battery backup</b> (so cutting mains does not disarm the panel, and power loss is itself alerted) and supervision of wireless contacts\' batteries, this is what makes the perimeter trustworthy. The system is candid that contacts detect <i>opening</i> and not glass being smashed or a wall breached — which is why complete installations layer glass-break and motion sensors on top — and that a homebrew panel is not a professionally-monitored alarm. But as a fast, located, supervised, networked perimeter alarm, it reliably catches the most common intrusion of all: a door or window opened that should have stayed shut.',
  ],
  equations: [
    { t: 'End-of-line supervised zone', eq: 'One EOL resistor per loop gives four distinguishable states\nfrom the measured resistance/voltage:\n\n  R ≈ R_eol      → closed & healthy (normal)\n  R ≈ R_eol+R_x  → contact OPEN (breach)   [with series/parallel scheme]\n  R ≈ 0          → SHORT (tamper/bypass)\n  R ≈ ∞          → OPEN CIRCUIT (cut wire/tamper)\n\nCut and short are alarmed — a defeated zone is never silent.' },
    { t: 'Arm-state + entry/exit logic', eq: 'On a monitored zone opening while ARMED:\n\n  if zone == ENTRY_DELAY_ZONE: start entry timer T_e\n     alarm if not disarmed within T_e\n  else: alarm immediately (located)\n\nARMED_HOME ignores INTERIOR zones; ARMED_AWAY includes them.\nExit timer T_x after arming lets you leave without a trip.' },
    { t: 'Power-loss supervision', eq: 'Battery backup keeps the panel armed; watch the mains:\n\n  if mains_lost: log + alert \"power loss\" (stay armed)\n  if battery_low: maintenance alert before it fails\n\nCutting power must not disarm — and should itself warn.' },
  ],

  assembly: [
    { h: 'Fit supervised contacts on every opening', p: [
      'Mount a magnetic contact on each protected door and window (recessed where possible), wiring each as a supervised loop with an end-of-line resistor so cut/short is detectable.',
      'Assign each contact a zone name and type (perimeter/interior, and which is the entry/exit door).',
    ], warn: 'An unsupervised loop can be silently defeated by shorting or cutting it. The end-of-line resistor is what turns a bypass attempt into an alarm.' },
    { h: 'Wire the panel with backup power', p: [
      'Connect the zone loops, keypad, siren relay and OLED to the ESP32 panel, powered from mains with automatic battery backup and mains-sensing so power loss is detected.',
    ] },
    { h: 'Set up alerts and states', p: [
      'Configure Wi-Fi alerts/logging, and the armed-away/armed-home/disarmed states with the entry/exit door and delays.',
    ] },
  ],
  steps: [
    { h: 'Read supervised zones into four states', p: [
      'Measure each loop and classify it as normal, open (breach), short (tamper) or cut (tamper), so both breaches and defeat attempts are detected.',
    ], code: {
      file: 'supervised-zone.ino', lang: 'cpp',
      body: `enum ZoneState { NORMAL, OPEN, SHORT, CUT };

// One EOL-resistor loop read on an ADC → four distinguishable states.
ZoneState readZone(int pin) {
  int v = analogRead(pin);              // 0..4095
  if (v < 100)   return SHORT;          // near 0 -> shorted (tamper)
  if (v > 3900)  return CUT;            // near full -> open circuit (cut)
  if (v > 1600 && v < 2400) return NORMAL;   // EOL band -> closed & healthy
  return OPEN;                          // out of the EOL band -> contact open
}

// Classify all zones; return true if any needs to alarm given the state.
bool scanZones(ZoneState st[], int n, ArmState arm) {
  bool alarm = false;
  for (int z = 0; z < n; z++) {
    st[z] = readZone(zonePin[z]);
    if (st[z] == SHORT || st[z] == CUT) { raise(z, "tamper"); alarm = true; }
    else if (st[z] == OPEN && zoneActive(z, arm)) {
      raise(z, "breach"); alarm = true;         // located, arm-aware
    }
    logState(z, st[z]);
  }
  return alarm;
}`,
      explain: [
        { ref: 'if (v < 100)   return SHORT;', txt: 'A near-zero reading means the loop has been shorted — a bypass attempt — which is treated as tamper, not a benign closed contact.' },
        { ref: 'if (v > 3900)  return CUT;', txt: 'A near-full reading means the wire is cut/open — the sensor has been removed — again tamper, not silently ignored.' },
        { ref: 'if (v > 1600 && v < 2400) return NORMAL;', txt: 'Only a reading in the end-of-line resistor\'s band counts as a healthy closed contact; anything else is a meaningful, distinguishable state.' },
        { ref: 'if (st[z] == SHORT || st[z] == CUT) { raise(z, "tamper")', txt: 'Cut and short are alarmed like a breach, so a defeated zone can never become a silent blind spot.' },
        { ref: 'else if (st[z] == OPEN && zoneActive(z, arm))', txt: 'A contact opening alarms only if that zone is active in the current armed state, giving located, arm-aware breach detection.' },
      ],
    } },
    { h: 'Run the arm-state machine and alert', p: [
      'Apply the armed-away/armed-home rules and entry/exit delays, sound the siren and push a located alert on an alarm, and log every open/close and state change.',
    ], tip: 'Give the entry/exit door its delay but make every other zone instant — an intruder through a window should get no grace period.' },
  ],

  code: [{
    file: 'breach-alarm.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Door/Window Breach Alarm — ESP32, supervised multi-zone

   Magnetic contacts on doors/windows, each a supervised (EOL) zone,
   with armed-away/home/disarmed states and entry/exit delays. Cut/short
   tamper is alarmed. Located alerts + local siren; battery backup.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>

#define PIN_SIREN 26
#define PIN_MAINS 15
#define NZONES     6
#define ENTRY_ZONE 0        // the entry/exit door
#define ENTRY_MS 30000UL
#define EXIT_MS  30000UL

const int zonePin[NZONES] = {34,35,32,33,25,27};
const bool interior[NZONES] = {false,false,false,false,true,true};
const char *zoneName[NZONES] =
  {"Front door","Kitchen win","Bedroom win","Back door","Hall PIR","Landing PIR"};

enum ArmState { DISARMED, ARMED_HOME, ARMED_AWAY };
enum ZoneState { NORMAL, OPEN, SHORT, CUT };
ArmState arm = DISARMED;
Adafruit_SSD1306 oled(128,64,&Wire);
Preferences prefs;
WiFiClient net; PubSubClient mqtt(net);
uint32_t entryStart = 0; bool entryRunning = false, alarming = false;

ZoneState readZone(int pin) {
  int v = analogRead(pin);
  if (v < 100) return SHORT;
  if (v > 3900) return CUT;
  if (v > 1600 && v < 2400) return NORMAL;
  return OPEN;
}
bool zoneActive(int z) {
  if (arm == DISARMED) return false;
  if (arm == ARMED_HOME && interior[z]) return false;  // allow interior at home
  return true;
}

void alertLocated(int z, const char *why) {
  char m[120];
  snprintf(m,sizeof m,"{\\"zone\\":%d,\\"name\\":\\"%s\\",\\"event\\":\\"%s\\"}",
           z+1, zoneName[z], why);
  mqtt.publish("alarm/event", m);
}
void triggerAlarm(int z, const char *why) {
  alarming = true;
  digitalWrite(PIN_SIREN, HIGH);
  alertLocated(z, why);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_SIREN, OUTPUT);
  pinMode(PIN_MAINS, INPUT);
  for (int z=0; z<NZONES; z++) analogSetPinAttenuation(zonePin[z], ADC_11db);
  Wire.begin(21,22); oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
  prefs.begin("alarm", true);
  arm = (ArmState)prefs.getInt("arm", DISARMED);
  prefs.end();
}

void loop() {
  if (!mqtt.connected() && WiFi.status()==WL_CONNECTED) mqtt.connect("alarm-1");
  mqtt.loop();
  handleKeypad(&arm);                      // arm/disarm; sets exit delay etc.

  if (digitalRead(PIN_MAINS) == LOW)       // power-loss supervision
    mqtt.publish("alarm/status", "power loss (armed on battery)");

  oled.clearDisplay(); oled.setCursor(0,0);
  for (int z = 0; z < NZONES; z++) {
    ZoneState s = readZone(zonePin[z]);
    if (s == SHORT || s == CUT) triggerAlarm(z, "tamper");
    else if (s == OPEN && zoneActive(z)) {
      if (z == ENTRY_ZONE && !entryRunning) {   // entry delay on the door
        entryRunning = true; entryStart = millis();
        mqtt.publish("alarm/status", "entry delay");
      } else if (z != ENTRY_ZONE) {
        triggerAlarm(z, "breach");               // other zones: instant
      }
    }
    oled.printf("%s\\n", zoneName[z]);
  }
  oled.display();

  if (entryRunning && millis() - entryStart > ENTRY_MS && arm != DISARMED)
    triggerAlarm(ENTRY_ZONE, "breach (entry timeout)");
  if (arm == DISARMED) { entryRunning = false; alarming = false;
                         digitalWrite(PIN_SIREN, LOW); }
  delay(50);
}`,
    explain: [
      { ref: 'ZoneState readZone(int pin)', txt: 'Each supervised loop is resolved into four states — normal, open, short, cut — so both a real opening and a wire-cut/short bypass are detectable from one input.' },
      { ref: 'bool zoneActive(int z)', txt: 'Whether a zone can alarm depends on the armed state, so armed-home ignores interior zones while still watching every perimeter opening.' },
      { ref: 'if (s == SHORT || s == CUT) triggerAlarm(z, "tamper")', txt: 'Cut and short loops alarm as tamper, ensuring a defeated zone is never a silent gap in the perimeter.' },
      { ref: 'if (z == ENTRY_ZONE && !entryRunning)', txt: 'Opening the designated entry door starts an entry delay to reach the keypad, while any other zone alarms instantly — an intruder through a window gets no grace.' },
      { ref: 'if (digitalRead(PIN_MAINS) == LOW)', txt: 'Loss of mains is reported while the panel keeps running on battery, so a power-cut attack is both survived and announced.' },
    ],
  }],

  config: [
    'Define each zone\'s name, type (perimeter/interior) and the entry/exit door and delays.',
    'Set the end-of-line thresholds for your resistor values so normal/open/short/cut are distinct.',
    'Configure the armed states, keypad codes, siren and Wi-Fi alerts/logging.',
    'Ensure mains-sensing and battery backup with a low-battery maintenance alert.',
  ],
  calibration: [
    { h: 'EOL thresholds', p: [
      'Measure each zone\'s ADC value for closed, open, shorted and cut conditions and set the bands so all four are cleanly distinguished.',
    ] },
    { h: 'Delays', p: [
      'Set exit/entry delays long enough to leave/reach the keypad but no longer, and confirm non-entry zones alarm instantly.',
    ] },
    { h: 'Power backup', p: [
      'Verify the panel stays armed and reports power loss on a simulated mains cut, and set the low-battery threshold.',
    ] },
  ],
  testing: [
    { step: 'Open a perimeter window while armed', expect: 'Instant located alarm for that zone' },
    { step: 'Open the entry door while armed', expect: 'Entry delay starts; alarm only if not disarmed in time' },
    { step: 'Short or cut a zone loop', expect: 'Tamper alarm for that zone (not silently disabled)' },
    { step: 'Armed-home with interior movement', expect: 'Interior zones ignored; perimeter still armed' },
    { step: 'Cut mains power', expect: 'Stays armed on battery; power-loss alert' },
    { step: 'Disarm at the keypad', expect: 'Siren clears; system returns to disarmed/logging' },
  ],
  output: [
    'The app/panel shows each zone\'s state and the armed mode; a breach or tamper produces an instant located alert and log entry.',
    { file: 'alarm-event.json', lang: 'json', body: `{
  "zone": 2,
  "name": "Kitchen win",
  "event": "breach",
  "time": "2026-07-27T02:03:18"
}` },
    'A located breach on the kitchen window fires the siren and pushes an alert naming the zone; a cut or shorted loop would instead raise a tamper alarm for that zone, so a defeat attempt is never silent.',
  ],
  troubleshoot: [
    { sym: 'Zone can be bypassed silently', cause: 'Unsupervised loop', fix: 'Add end-of-line resistors and detect short/cut as tamper' },
    { sym: 'False alarms on the entry door', cause: 'No entry delay or delay too short', fix: 'Configure the entry/exit zone and a sensible delay' },
    { sym: 'Interior movement trips armed-home', cause: 'Interior zones not typed/excluded', fix: 'Mark interior zones and exclude them in armed-home' },
    { sym: 'Disarmed by pulling power', cause: 'No battery backup', fix: 'Add battery backup; alert on power loss; keep armed on battery' },
    { sym: 'Alarm not located', cause: 'Zones not individually tracked', fix: 'One contact per zone with a name; report the zone in the alert' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → phone / alarm panel',
    net: {
      nodes: [{ name: 'Alarm panel', sub: 'ESP32' }, { name: 'Zones', sub: 'contacts' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'local siren too',
      uplink: 'MQTT 1883', cloud: 'App / panel', cloudSub: 'zone state + alarms',
      clients: [{ name: 'Phone', sub: 'located alerts' }, { name: 'Panel', sub: 'arm/disarm' }],
    },
    protocol: ['Zone states, arm changes and alarms publish immediately; the local siren sounds independent of the network so connectivity loss cannot silence a breach.'],
    topics: [
      { t: 'alarm/event', dir: 'panel → app', payload: 'located breach / tamper (zone, name, event)' },
      { t: 'alarm/status', dir: 'panel → app', payload: 'armed state, entry delay, power loss' },
      { t: 'alarm/cmd', dir: 'app → panel', payload: 'arm/disarm, acknowledge' },
    ],
    cloud: ['An app/panel shows zone states and armed mode, logs open/close and alarm history, and pushes instant located alerts; multiple panels cover larger premises.'],
    dashboard: ['A floor plan of zones coloured by state, armed-mode control, and an event log of breaches, tampers and arm/disarm actions.'],
    mobile: ['Instant located breach/tamper alerts and power-loss/low-battery maintenance alerts, with remote arm/disarm.'],
    security: [
      'Authenticate arm/disarm commands; keep the local siren and supervision independent of the network.',
      'Supervise loops (EOL) and power so tamper and power-cut are alarmed, not silent.',
      'Alert on panel tamper and connectivity loss.',
    ],
  },

  perf: [
    'Poll zones fast enough to catch an opening instantly while keeping ADC work light.',
    'Debounce contacts to avoid chatter without adding perceptible delay.',
    'Keep the local siren and supervision independent of the network; alert immediately.',
    'Log open/close and state changes for a useful audit without flooding.',
  ],
  safety: [
    'Contacts detect opening, not glass-break or wall breach — layer with glass-break/motion for full coverage.',
    'Supervise loops so a defeated sensor is an alarm, and provide battery backup against power-cut attacks.',
    'A DIY alarm is not a professionally-monitored system; use one where required, and never rely on it alone for life-safety.',
    'Ensure sirens and alerts comply with local noise and alarm regulations.',
  ],
  maintenance: [
    'Test each zone (open, and cut/short) periodically to confirm detection and supervision.',
    'Check magnet alignment and replace weak wireless-contact batteries (supervised).',
    'Verify battery backup run-time and the low-battery/power-loss alerts.',
    'Keep zone names/floor plan accurate as the premises change.',
  ],
  future: [
    'Add glass-break and motion (PIR) sensors as additional zone types for full coverage.',
    'Add wireless supervised contacts to simplify retrofits.',
    'Integrate cameras so a breach pulls up the relevant view.',
    'Add smart-home actions (lights on, doors lock) on alarm.',
  ],
  faq: [
    { q: 'Why supervise the wiring?', a: 'Because the easy way to beat a contact is to short or cut its loop. An end-of-line resistor lets the panel tell a healthy closed contact from a shorted or cut one, so a bypass attempt becomes a tamper alarm instead of a silent blind spot.' },
    { q: 'What are entry/exit delays for?', a: 'So you can leave and enter through a designated door without tripping the alarm. That door gets a delay to reach the keypad; every other zone alarms instantly, since an intruder through a window has no legitimate delay.' },
    { q: 'Does a magnetic contact detect a smashed window?', a: 'No — it detects the window being opened. Breaking the glass without opening the sash may not trip it, which is why complete systems add glass-break and motion sensors alongside contacts.' },
    { q: 'What if the burglar cuts the power?', a: 'Battery backup keeps the panel armed and the loss of mains is itself alerted, so cutting power neither disarms the system nor goes unnoticed.' },
    { q: 'Why zone each opening separately?', a: 'So the alarm is located. Knowing "kitchen window" rather than just "alarm" speeds response and helps tell a real breach from a mistake.' },
  ],
  refs: [
    { t: 'Magnetic (reed) contacts in alarm systems', u: 'https://en.wikipedia.org/wiki/Reed_switch', s: 'Reference' },
    { t: 'Burglar alarm zones and supervision', u: 'https://en.wikipedia.org/wiki/Security_alarm', s: 'Reference' },
    { t: 'End-of-line resistor supervision', u: 'https://en.wikipedia.org/wiki/Alarm_device', s: 'Reference' },
    { t: 'Entry/exit delay and arming states', u: 'https://en.wikipedia.org/wiki/Security_alarm', s: 'Reference' },
    { t: 'Layered intrusion detection (contacts + glass-break + PIR)', u: 'https://en.wikipedia.org/wiki/Motion_detector', s: 'Reference' },
  ],
  images: ['esp32', 'cctv', 'city'],
  imageCaptions: [
    'Magnetic contacts on doors and windows give fast, hard-to-fool detection of an opening.',
    'ESP32 panel reads each supervised zone and runs the armed-state machine with entry/exit delays.',
    'A breach fires a located alert and siren; supervision turns any cut or shorted loop into a tamper alarm.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   056 — Networked Fire & Smoke Alarm
   ══════════════════════════════════════════════════════════════════ */
{
  id: '056',
  domainKey: 'iot',
  emoji: '🚨', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Interconnected smoke and heat detectors so that when one senses fire, every alarm in the building sounds — and everyone, including a control point, knows exactly where it started.',

  overview: [
    'The deadliest gap in home and building fire safety is not detection — it is <b>hearing the alarm in time</b>. A smoke detector in the basement can be screaming while people asleep upstairs hear nothing until the fire has spread. The single most important improvement, proven to save lives, is <b>interconnection</b>: when any one detector senses fire, <i>all</i> of them sound, everywhere, at once. This project builds a networked, interconnected fire and smoke alarm system where detectors in every room talk to each other, so a fire anywhere wakes everyone — and, because it is networked, it also announces <b>where</b> the fire started and can alert a control point or phones.',
    'Each node combines the sensing that catches fire in its different forms: a <b>smoke</b> sensor for the smouldering and flaming smoke that is the earliest and most common sign, and a <b>heat</b> channel that watches both absolute temperature and its <b>rate of rise</b> (a fast-climbing temperature signals a fast-developing fire even before heavy smoke), with an optional flame sensor. Fusing smoke and heat, and watching rate-of-change against each node\'s baseline, is what lets it alarm early on a real fire while resisting the nuisance trips — cooking steam, shower humidity, dust — that make people disable detectors, which is itself a major cause of fire deaths.',
    'Interconnection is the heart of it: nodes are networked (wired or wireless) so a detection propagates to every node in well under the critical few seconds, and a location-aware control point shows which room originated the alarm — invaluable for occupants deciding an escape route and for responders. The system supports battery backup so a power cut does not blind it, supervises every detector so a dead or removed unit is flagged (a missing detector is a silent risk), and can escalate to phones or a monitoring point. It is emphatic about its limits — a DIY system is <b>not</b> a certified, listed fire-alarm installation, and where codes require listed smoke alarms and professional monitoring you must use them; low-cost sensors are for supplementary awareness, not life-safety certification. But as a demonstration and a supplementary interconnected alarm, it embodies the one lesson that matters most in fire safety: when it detects fire, everyone hears it, everywhere, immediately.',
  ],
  does: [
    'Detects fire by smoke and by heat (absolute + rate-of-rise), optional flame',
    'Interconnects detectors so one detection sounds every alarm in the building',
    'Identifies and reports which room the alarm originated in',
    'Resists nuisance trips (steam, dust) by fusing smoke and heat and using rate-of-change',
    'Supervises every detector so a dead/removed unit is flagged',
    'Runs on battery backup so a power cut does not blind it',
    'Escalates a location-aware alert to a control point/phones',
  ],
  features: [
    'Interconnected sounding — the proven life-saver (all alarm when one detects)',
    'Smoke + heat + rate-of-rise fusion for early, robust detection',
    'Location-aware alarms (which room started it)',
    'Nuisance-resistant logic to stop people disabling detectors',
    'Per-detector supervision (a missing detector is a risk)',
    'Battery backup and escalation to a control point/phones',
    'Explicit: supplementary, not a certified/listed fire-alarm system',
  ],
  applications: [
    { t: 'Home fire safety (supplementary)', d: 'Interconnected detectors so a fire anywhere in the house wakes everyone, with location and phone alerts — alongside listed smoke alarms.' },
    { t: 'Small building / hostel / office', d: 'Building-wide interconnected detection with a control point showing the room of origin.' },
    { t: 'Workshops / labs', d: 'Early smoke/heat detection in areas with specific fire risks, networked to a coordinator.' },
    { t: 'Education / demonstration', d: 'Teaching fire-detection sensing, interconnection and rate-of-rise principles.' },
  ],
  skills: [
    'Smoke and heat sensing (absolute + rate-of-rise) and fusion',
    'Interconnecting detectors for all-sound-on-one-detect',
    'Nuisance-rejection logic and per-node baselines',
    'Detector supervision and battery backup',
    'Location-aware alerting and escalation',
  ],
  prereq: [
    'Interconnection (all sound when one detects) is the key life-safety feature — make propagation fast and reliable.',
    'Fuse smoke and heat and use rate-of-rise to catch real fires early while rejecting steam/dust nuisance trips.',
    'Supervise every detector and provide battery backup — a dead or removed detector is a silent risk.',
    'This is supplementary/educational, NOT a certified listed fire-alarm system; where codes require listed alarms and monitoring, use them.',
  ],

  parts: ['esp32', 'mq2', 'dht22', 'flame', 'buzzer', 'lora', 'oled', 'li18650'],
  extraParts: [
    { name: 'Photoelectric smoke sensor', spec: 'Photoelectric smoke chamber (good for smouldering fires) per node', qty: 4, price: 800, note: 'Photoelectric suits smouldering; combine sensing types for coverage' },
    { name: 'Loud interconnected sounders', spec: 'Piezo/horn sounder per node, loud enough to wake sleepers', qty: 4, price: 600 },
    { name: 'Backup batteries', spec: 'Per-node battery so a power cut does not blind detection', qty: 4, price: 400 },
    { name: 'Control point / annunciator', spec: 'Panel showing room-of-origin and building status', qty: 1, price: 1200 },
  ],
  cost: '₹3,500 – ₹6,000 (multi-node)',
  libs: ['wifi', 'pubsub', 'dhtlib', 'lorolib', 'ssd1306', 'ntp', 'preferences'],

  pins: {
    left: [
      { dev: 'Smoke sensor', devPin: 'AOUT', pin: 'GPIO 34', sig: 'Smoke concentration' },
      { dev: 'DHT22 / temp', devPin: 'DATA', pin: 'GPIO 4', sig: 'Heat + rate-of-rise' },
      { dev: 'Flame sensor', devPin: 'DOUT', pin: 'GPIO 27', sig: 'Flame (optional confirm)' },
    ],
    right: [
      { dev: 'Sounder', devPin: 'IN', pin: 'GPIO 26', sig: 'Local + interconnected alarm' },
      { dev: 'Interconnect', devPin: 'wired/LoRa', pin: 'bus / SPI', sig: 'All-sound propagation' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Status / origin' },
      { dev: 'Backup battery', devPin: 'sense', pin: 'ADC', sig: 'Power supervision' },
    ],
  },
  wiringNotes: [
    'Interconnect the detectors — a wired interconnect line/bus or a fast wireless (LoRa/ESP-NOW) mesh — so any node\'s detection makes every node sound within a couple of seconds.',
    'Mount smoke sensors per fire-code guidance (ceiling, away from kitchens/bathrooms to reduce nuisance trips) and give each a temperature sensor for heat/rate-of-rise.',
    'Power each node with battery backup and sense the supply so power loss is detected and the node stays alive.',
    'Make each sounder loud enough to wake a sleeping person through a closed door.',
    'Give each node an ID/location so the control point can name the room of origin.',
  ],

  block: { columns: [
    { label: 'Sense fire', edge: 'right', blocks: [
      { name: 'Smoke', sub: 'photoelectric', highlight: true },
      { name: 'Heat + rate', sub: 'temperature' },
      { name: 'Flame', sub: 'optional' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'fuse + nuisance-reject' },
      { name: 'Baseline', sub: 'rate-of-rise' },
    ] },
    { label: 'Interconnect', edge: 'right', blocks: [
      { name: 'All-sound', sub: 'every node alarms', highlight: true },
      { name: 'Origin', sub: 'which room' },
    ] },
    { label: 'Escalate', edge: 'none', blocks: [
      { name: 'Control point', sub: 'room of origin' },
      { name: 'Phones', sub: 'alert' },
    ] },
  ] },
  flow: [
    { t: 'Read smoke, temp, flame', k: 'start' },
    { t: 'Update rate-of-rise + baseline', k: 'proc' },
    { t: 'Fire confirmed (fused, nuisance-checked)?', k: 'dec', yes: 'Sound ALL nodes + report origin', no: 'Detection from another node?' },
    { t: 'Sound ALL nodes + report origin', k: 'io' },
    { t: 'Detection from another node?', k: 'dec', yes: 'Sound this node (interconnect)', no: 'Monitor + heartbeat' },
    { t: 'Sound this node (interconnect)', k: 'io' },
    { t: 'Monitor + heartbeat', k: 'proc' },
    { t: 'Escalate to control point/phones', k: 'end', back: 'Read smoke, temp, flame' },
  ],

  principle: [
    'Decades of fire-safety research converge on one finding above all: the biggest determinant of surviving a fire is <b>early warning that everyone hears</b>. Detection technology matters, but the fatal failures are usually that the alarm sounded somewhere no one could hear it in time, or that a nuisance-prone detector had been disabled. This system is built around those two lessons. Its defining feature is <b>interconnection</b> — the principle, now required by code for new homes in many places, that when any single detector senses fire, every detector in the building sounds simultaneously. A fire starting in a distant or closed room no longer relies on one local sounder to wake sleeping occupants across the house; the whole building alarms at once. Making that propagation <b>fast and reliable</b> (well under the few seconds that matter, over a wired interconnect or a fast wireless mesh) is the most important engineering goal in the project.',
    'Detecting fire early and robustly means <b>sensing its different signatures and fusing them</b>. Fires present differently: a smouldering couch produces smoke long before heat, while a flaming fire produces heat and flame fast. So each node watches <b>smoke</b> (the earliest sign of most fires, and the primary sensor) and <b>heat</b> — and heat is watched two ways: absolute temperature, and crucially its <b>rate of rise</b>. A rate-of-rise heat detector alarms on a rapid temperature climb even before the absolute temperature is high, catching a fast-developing fire early; it is a classic, powerful complement to a fixed-temperature threshold. An optional flame sensor adds direct confirmation. Fusing these — smoke OR a dangerous heat/rate-of-rise, corroborated where possible — gives both earlier and more reliable detection than any single sensor.',
    'The counter-intuitive but vital design goal is <b>rejecting nuisance alarms</b>, because nuisance trips kill. Detectors that cry wolf on cooking steam, shower humidity or dust get <b>disabled</b> by frustrated occupants — batteries removed, units unplugged — and a disabled detector is the leading contributor to fire deaths in homes that had alarms. So the system works to alarm on real fire while staying quiet on steam and dust: fusing smoke with heat/rate-of-rise (steam raises humidity but not the fire signature; a real fire moves both smoke and heat), using each node\'s <b>baseline</b> and rate-of-change rather than a bare threshold, and siting sensors away from kitchens and bathrooms. Reducing false alarms is not mere convenience — it is what keeps the detectors <i>enabled</i>, which is a prerequisite for them ever saving a life.',
    'Around these, the system adds the properties that make it dependable and useful: <b>location awareness</b> so the control point (and the alert to phones) names the room the fire started in, helping occupants choose a safe escape route and responders go straight to the seat of the fire; <b>supervision</b> so every detector\'s presence and health is continuously checked and a dead, removed or low-battery unit is flagged (a missing detector is a silent hole in coverage); and <b>battery backup</b> so a power cut — which can accompany a fire — does not blind the system. It must be said as plainly as possible, though, that this is a <b>supplementary and educational</b> system, not a certified, listed, professionally-monitored fire-alarm installation. Life-safety fire detection is governed by codes and standards for good reason, and where they require listed smoke alarms and monitoring, those must be used. Built with that honesty, this project is a faithful, hands-on realisation of fire safety\'s central principle: detect early, reject nuisances so it stays enabled, and when it does detect, make sure everyone, everywhere, hears it at once and knows where to run from.',
  ],
  equations: [
    { t: 'Rate-of-rise heat detection', eq: 'Watch both the absolute temperature and its rate of change:\n\n  fixed  : alarm if T > T_max        (e.g. 58 °C)\n  ROR    : alarm if dT/dt > R_max    (e.g. > 8 °C/min)\n\nROR catches a fast fire before T is high; fixed catches a\nslow one. Use BOTH — many real detectors do.' },
    { t: 'Smoke + heat fusion (nuisance rejection)', eq: 'fire likely if:\n  smoke > S_thresh AND (dT/dt > R_max OR T > T_max)\n  OR smoke >> S_high (heavy smoke alone)\n  OR flame_confirmed\n\nSteam raises humidity, not the smoke+heat signature →\nrejected. Baseline/rate-of-change per node adapts to the\nroom and avoids threshold nuisance trips.' },
    { t: 'Interconnection propagation', eq: 'On local fire detection at node i:\n  broadcast ALARM(origin=i) to all nodes\n  every node j: sound_local()  (target < ~2 s)\n\nReceiving an ALARM makes a node sound even with no local\nsmoke — the all-sound-on-one-detect life-safety behaviour.' },
  ],

  assembly: [
    { h: 'Build interconnected detector nodes', p: [
      'Give each node a smoke sensor, a temperature sensor (for heat and rate-of-rise), an optional flame sensor, a loud sounder, battery backup and a network interface (wired interconnect or fast wireless), plus an ID/location.',
      'Site smoke sensors per fire-code guidance, away from kitchens/bathrooms to reduce nuisance trips.',
    ], warn: 'The whole value is interconnection: any node\'s detection must sound every node within a couple of seconds. Make that path fast and reliable above all else.' },
    { h: 'Set up supervision and backup', p: [
      'Have each node heartbeat its presence and health; power each with battery backup and sense the supply so power loss and low battery are flagged.',
    ] },
    { h: 'Set up the control point and escalation', p: [
      'Provide a control point/annunciator that shows the room of origin and building status, and configure escalation to phones/a monitoring point.',
    ] },
  ],
  steps: [
    { h: 'Detect fire with fusion and rate-of-rise', p: [
      'Read smoke and temperature, compute the rate of rise, and confirm fire from the fused smoke+heat signature (with nuisance rejection) or heavy smoke or flame.',
    ], code: {
      file: 'fire-detect.ino', lang: 'cpp',
      body: `float prevTemp = NAN; uint32_t prevMs = 0;

// Rate of rise in deg C per minute, from successive temperature reads.
float rateOfRise(float t, uint32_t now) {
  if (isnan(prevTemp)) { prevTemp = t; prevMs = now; return 0; }
  float dtMin = (now - prevMs) / 60000.0f;
  float ror = dtMin > 0 ? (t - prevTemp) / dtMin : 0;
  prevTemp = t; prevMs = now;
  return ror;
}

// Fuse smoke + heat with nuisance rejection.
bool fireConfirmed(float smoke, float temp, float ror, bool flame) {
  bool heat = (temp > 58.0f) || (ror > 8.0f);         // fixed OR rate-of-rise
  if (smoke > SMOKE_THRESH && heat) return true;      // classic fire signature
  if (smoke > SMOKE_HEAVY)          return true;      // heavy smoke alone
  if (flame)                        return true;      // direct confirmation
  return false;                                       // steam/dust: rejected
}`,
      explain: [
        { ref: 'float rateOfRise(float t, uint32_t now)', txt: 'Computes how fast the temperature is climbing, the signal that catches a fast-developing fire before the absolute temperature is dangerous.' },
        { ref: 'bool heat = (temp > 58.0f) || (ror > 8.0f)', txt: 'Heat is flagged either by a fixed high temperature or by a rapid rate of rise, combining the two classic heat-detection methods.' },
        { ref: 'if (smoke > SMOKE_THRESH && heat) return true', txt: 'The primary confirmation requires smoke together with a heat signature — a real fire moves both, while steam raises humidity without the heat signature, so nuisance trips are rejected.' },
        { ref: 'if (smoke > SMOKE_HEAVY)          return true', txt: 'Overwhelming smoke alone is enough to alarm, since heavy smoke is unambiguous even before heat builds.' },
      ],
    } },
    { h: 'Interconnect and escalate', p: [
      'On local confirmation, broadcast an alarm with this node\'s origin so every node sounds, sound locally on receiving any node\'s alarm, and escalate a located alert to the control point/phones; heartbeat health continuously.',
    ], tip: 'A node must sound when it receives an interconnect alarm even with no local smoke — that all-sound behaviour is the life-safety feature.' },
  ],

  code: [{
    file: 'networked-fire-alarm.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Networked Fire & Smoke Alarm — ESP32, interconnected detectors

   Smoke + heat (fixed + rate-of-rise) + optional flame, fused with
   nuisance rejection. Any node's detection sounds EVERY node and
   reports the room of origin. Supervised, battery-backed.
   SUPPLEMENTARY / EDUCATIONAL — not a certified fire-alarm system.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_SMOKE 34
#define PIN_DHT    4
#define PIN_FLAME 27
#define PIN_SOUNDER 26
#define SMOKE_THRESH 1500
#define SMOKE_HEAVY  3000
#define HEARTBEAT_MS 60000UL

DHT dht(PIN_DHT, DHT22);
WiFiClient net; PubSubClient mqtt(net);
Preferences prefs;

const uint8_t NODE_ID = 1;
const char *ROOM = "Kitchen";
float prevTemp = NAN; uint32_t prevMs = 0, lastBeat = 0;
bool localFire = false;

float rateOfRise(float t, uint32_t now) {
  if (isnan(prevTemp)) { prevTemp = t; prevMs = now; return 0; }
  float dtMin = (now - prevMs) / 60000.0f;
  float ror = dtMin > 0 ? (t - prevTemp) / dtMin : 0;
  prevTemp = t; prevMs = now; return ror;
}

bool fireConfirmed(float smoke, float temp, float ror, bool flame) {
  bool heat = (temp > 58.0f) || (ror > 8.0f);
  return (smoke > SMOKE_THRESH && heat) || (smoke > SMOKE_HEAVY) || flame;
}

void soundLocal(bool on) { digitalWrite(PIN_SOUNDER, on ? HIGH : LOW); }

// Broadcast to interconnect (LoRa here; a wired bus works too).
void broadcastAlarm() {
  LoRa.beginPacket();
  LoRa.printf("{\\"t\\":\\"FIRE\\",\\"origin\\":%u,\\"room\\":\\"%s\\"}",
              NODE_ID, ROOM);
  LoRa.endPacket();
  mqtt.publish("fire/alarm", "");        // escalate to control point/phones
}

// Sound when ANY node reports fire (all-sound-on-one-detect).
void checkInterconnect() {
  if (LoRa.parsePacket()) {
    String p; while (LoRa.available()) p += (char)LoRa.read();
    if (p.indexOf("FIRE") >= 0) {
      soundLocal(true);                  // sound even without local smoke
      // relay origin to the control point / OLED for room-of-origin
      mqtt.publish("fire/echo", p.c_str());
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_FLAME, INPUT);
  pinMode(PIN_SOUNDER, OUTPUT);
  analogSetPinAttenuation(PIN_SMOKE, ADC_11db);
  dht.begin();
  SPI.begin();
  LoRa.setPins(5,14,2); LoRa.begin(433E6); LoRa.setSpreadingFactor(9);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
}

void loop() {
  if (!mqtt.connected() && WiFi.status()==WL_CONNECTED) mqtt.connect("fire-1");
  mqtt.loop();
  checkInterconnect();                   // sound on any node's alarm

  uint32_t now = millis();
  float smoke = analogRead(PIN_SMOKE);
  float temp  = dht.readTemperature();
  float ror   = rateOfRise(temp, now);
  bool flame  = digitalRead(PIN_FLAME) == LOW;

  if (fireConfirmed(smoke, temp, ror, flame)) {
    if (!localFire) {
      localFire = true;
      soundLocal(true);
      broadcastAlarm();                  // make EVERY node sound + report origin
    }
  }

  if (now - lastBeat > HEARTBEAT_MS) {   // supervision heartbeat
    char m[80];
    snprintf(m,sizeof m,"{\\"id\\":%u,\\"room\\":\\"%s\\",\\"ok\\":1}",NODE_ID,ROOM);
    mqtt.publish("fire/heartbeat", m);
    lastBeat = now;
  }
  delay(200);
}`,
    explain: [
      { ref: 'void checkInterconnect()', txt: 'Every loop the node listens for any other node\'s FIRE broadcast and sounds locally on receipt — even with no smoke of its own — which is the all-sound-on-one-detect behaviour that saves lives.' },
      { ref: 'bool heat = (temp > 58.0f) || (ror > 8.0f)', txt: 'Heat is confirmed by a fixed threshold or a rapid rate of rise, so both fast and slow fires are caught by the heat channel.' },
      { ref: 'broadcastAlarm();                  // make EVERY node sound + report origin', txt: 'A local detection is broadcast with this node\'s room, so the whole building sounds and the control point learns where the fire began.' },
      { ref: 'return (smoke > SMOKE_THRESH && heat) || (smoke > SMOKE_HEAVY) || flame', txt: 'The fused logic requires smoke plus heat for the common case, rejecting steam/dust, while heavy smoke or flame alone still alarm.' },
      { ref: 'mqtt.publish("fire/heartbeat", m)', txt: 'Regular heartbeats let a control point supervise every detector, so a dead or removed unit is flagged rather than silently leaving a gap.' },
    ],
  }],

  config: [
    'Set each node\'s ID/room, the smoke/heat/rate-of-rise thresholds, and the interconnect medium (wired/wireless).',
    'Tune nuisance-rejection (fusion, baselines) for each room\'s conditions and siting.',
    'Configure the control point, escalation to phones, and per-node supervision/heartbeat.',
    'Ensure battery backup and low-battery/power-loss alerts on every node.',
  ],
  calibration: [
    { h: 'Detection thresholds', p: [
      'With test smoke/heat sources (safely), confirm early detection while cooking steam/shower humidity and dust do not trip the fused logic.',
    ] },
    { h: 'Rate-of-rise', p: [
      'Verify a rapid temperature climb triggers the ROR path before the absolute threshold, and that slow ambient changes do not.',
    ] },
    { h: 'Interconnect timing', p: [
      'Measure the time from one node detecting to all nodes sounding; ensure it is within a couple of seconds across the building.',
    ] },
  ],
  testing: [
    { step: 'Trigger smoke at one node', expect: 'That node and ALL nodes sound within ~2 s; origin room reported' },
    { step: 'Rapidly heat a node', expect: 'Rate-of-rise alarms before the fixed threshold' },
    { step: 'Create steam/dust near a node', expect: 'No alarm (fused logic rejects the nuisance)' },
    { step: 'Remove/disable a node', expect: 'Control point flags the missing detector via heartbeat loss' },
    { step: 'Cut mains power', expect: 'Nodes keep detecting on battery; power-loss noted' },
    { step: 'Check the control point on alarm', expect: 'Room of origin clearly shown for escape/response' },
  ],
  output: [
    'The control point shows building status and, on alarm, the room of origin; every node sounds, and a located alert escalates to phones.',
    { file: 'fire-alarm.json', lang: 'json', body: `{
  "type": "FIRE",
  "origin": 3,
  "room": "Bedroom 2",
  "time": "2026-07-27T03:12:44"
}` },
    'A detection in Bedroom 2 sounds every node in the building at once and tells the control point (and phones) the room of origin — the interconnection and location awareness that turn detection into survivable warning.',
  ],
  troubleshoot: [
    { sym: 'Alarm not heard elsewhere', cause: 'Interconnection slow/unreliable', fix: 'Make the interconnect fast and robust; verify all-sound within ~2 s; add redundancy' },
    { sym: 'Frequent nuisance trips', cause: 'Single-sensor/threshold triggering near kitchen/bath', fix: 'Fuse smoke+heat, use rate-of-rise/baselines, re-site sensors' },
    { sym: 'Detectors get disabled by occupants', cause: 'Too many false alarms', fix: 'Reduce nuisance trips (the root cause); never solve it by removing detection' },
    { sym: 'A dead detector goes unnoticed', cause: 'No supervision', fix: 'Heartbeat every node; flag missing/low-battery units at the control point' },
    { sym: 'System blind after power cut', cause: 'No battery backup', fix: 'Add per-node battery backup; alert on power loss' },
  ],

  iot: {
    protoShort: 'Fast interconnect (LoRa/ESP-NOW/wired) + control point/phones',
    net: {
      nodes: [{ name: 'Detector node', sub: 'ESP32' }, { name: 'Other detectors', sub: 'interconnected' }],
      protocol: 'LoRa/ESP-NOW/wired', gateway: 'Control point', gatewaySub: 'room of origin',
      uplink: 'MQTT', cloud: 'Monitor / phones', cloudSub: 'located alarm',
      clients: [{ name: 'Control point', sub: 'origin + status' }, { name: 'Phones', sub: 'alerts' }],
    },
    protocol: ['A detection broadcasts to all nodes so every sounder fires within ~2 s, and escalates a located alert; heartbeats supervise every detector. The all-sound behaviour and local sounders do not depend on the internet.'],
    topics: [
      { t: 'fire/alarm', dir: 'node → all/control', payload: 'FIRE with origin node/room' },
      { t: 'fire/heartbeat', dir: 'node → control', payload: 'detector present/healthy (supervision)' },
      { t: 'fire/status', dir: 'node → control', payload: 'battery, power, sensor health' },
    ],
    cloud: ['A control point shows the room of origin and building status and escalates to phones/a monitoring point; heartbeats surface any missing or low-battery detector.'],
    dashboard: ['A building/floor plan with detector health and, on alarm, the origin room highlighted, plus an event and supervision log.'],
    mobile: ['Immediate located fire alerts and maintenance alerts for missing/low-battery detectors.'],
    security: [
      'Authenticate interconnect/alarm messages so false fire alarms cannot be injected.',
      'Keep all-sound and local sounders independent of the internet; supervise continuously.',
      'Treat missing heartbeats and power loss as safety-relevant events.',
    ],
  },

  perf: [
    'Prioritise interconnect latency — all nodes must sound within a couple of seconds of any detection.',
    'Read sensors frequently enough for rate-of-rise to be meaningful without excess power.',
    'Keep all-sound and local sounders independent of Wi-Fi/internet; escalation is secondary.',
    'Heartbeat continuously so detector presence/health is always known.',
  ],
  safety: [
    'THIS IS SUPPLEMENTARY/EDUCATIONAL — not a certified, listed, professionally-monitored fire-alarm system. Use listed smoke alarms and monitoring where codes require them.',
    'Interconnection (all sound when one detects) and low false-alarm rates (so detectors stay enabled) are the key life-safety properties — never compromise them.',
    'Provide battery backup and supervise every detector; a dead or removed detector is a silent, dangerous gap.',
    'Follow fire-code guidance on detector siting, quantity and placement.',
  ],
  maintenance: [
    'Test the whole interconnected system regularly (one node triggers all) and check sounder loudness.',
    'Replace/clean smoke sensors and check batteries; act on every supervision alert.',
    'Re-verify nuisance rejection after changes in room use or siting.',
    'Keep the room/location map accurate for correct origin reporting.',
  ],
  future: [
    'Add CO detection for a combined fire+CO safety system.',
    'Add voice evacuation messages naming the safe route away from the origin.',
    'Integrate with smart-home actions (lights on to escape routes, HVAC off).',
    'Add automatic escalation to a monitoring service or fire brigade where appropriate and permitted.',
  ],
  faq: [
    { q: 'What is the single most important feature?', a: 'Interconnection — when any detector senses fire, all of them sound. A local alarm in a distant room may not wake sleeping occupants; all-sound-on-one-detect does, and it is proven to save lives.' },
    { q: 'What is rate-of-rise detection?', a: 'Alarming on a rapid temperature climb, not just a high absolute temperature. It catches a fast-developing fire early, before the room is hot enough for a fixed threshold, and complements smoke detection.' },
    { q: 'Why obsess over false alarms?', a: 'Because nuisance trips make people disable detectors, and a disabled detector is a leading factor in fire deaths. Fusing smoke with heat and using rate-of-change keeps it accurate enough to stay enabled.' },
    { q: 'Can I use this instead of proper smoke alarms?', a: 'No. This is supplementary and educational, not a certified, listed, monitored fire-alarm system. Where codes require listed smoke alarms and monitoring, you must use them; run this alongside, not instead.' },
    { q: 'Why report the room of origin?', a: 'So occupants can choose an escape route away from the fire and responders go straight to its source. Knowing where it started is as valuable as knowing that it started.' },
  ],
  refs: [
    { t: 'Smoke detectors and interconnection — NFPA guidance', u: 'https://www.nfpa.org/', s: 'NFPA' },
    { t: 'Heat detectors and rate-of-rise', u: 'https://en.wikipedia.org/wiki/Heat_detector', s: 'Reference' },
    { t: 'Photoelectric vs ionization smoke detection', u: 'https://en.wikipedia.org/wiki/Smoke_detector', s: 'Reference' },
    { t: 'Nuisance alarms and disabled detectors — fire-safety research', u: 'https://www.usfa.fema.gov/', s: 'USFA' },
    { t: 'Fire alarm system fundamentals', u: 'https://en.wikipedia.org/wiki/Fire_alarm_system', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'city'],
  imageCaptions: [
    'Interconnected detectors mean a fire anywhere in the building sounds every alarm at once.',
    'ESP32 module fusing smoke and heat with rate-of-rise, and broadcasting a located alarm to all nodes.',
    'A control point shows the room of origin so occupants escape the right way and responders go to the source.',
  ],
},

];
