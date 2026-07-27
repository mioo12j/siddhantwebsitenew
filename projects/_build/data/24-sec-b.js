/* Security batch B — 051 RFID Access Control, 052 Number-Plate Gate
   Logger, 053 Panic Button Network. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   051 — RFID Access Control
   ══════════════════════════════════════════════════════════════════ */
{
  id: '051',
  domainKey: 'electronics',
  emoji: '🔑', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Card-based door access with per-person roles and a complete audit trail — built with the security realities of RFID (cloneable cards, fail-safe doors, offline operation) taken seriously.',

  overview: [
    'An access-control system answers a deceptively simple question at every door: should this person be let in, right now? Getting that right is more than reading a card and clicking a relay. It means knowing <b>who</b> each credential belongs to and what they are allowed to open, keeping an <b>audit trail</b> of every entry and every refusal, deciding what happens to the door when the power or network fails, and — the part hobby projects usually skip — being honest that a plain RFID card\'s ID is trivially cloneable, so the design cannot treat "I saw a valid card number" as proof of identity. This project builds a real door controller with those realities front of mind.',
    'At the door, an RFID reader presents a credential; the controller checks it against a list of authorised users and their <b>roles</b> (who may open which doors, and when), actuates the lock if permitted, and writes a timestamped record of the event — granted or denied — to storage that cannot be quietly edited. Roles matter because access is rarely all-or-nothing: a cleaner may enter the lobby but not the server room, a contractor only during working hours, a manager everywhere. The audit log matters because access control without accountability is half a system: when something goes wrong, the log is how you know who went where and when.',
    'The security-honest details are what separate this from a toy. Simple RFID cards broadcast a fixed ID that a cheap cloner can copy, so for anything sensitive the design points to <b>authenticated smart cards</b> (which perform a cryptographic challenge instead of just announcing a number) and to defence-in-depth (card plus PIN, anti-passback, tamper detection). The door\'s <b>fail mode</b> is a deliberate choice — fail-secure (locked on power loss) for a secure store, fail-safe (unlocked on power loss) for a fire-egress door, and the code must make that explicit. And because a door must keep working when the network is down, the controller keeps a local copy of permissions and logs offline, syncing when the link returns. It is candid that a DIY controller is not a substitute for certified security hardware where that is required — but as a genuinely-architected access system, it teaches and does the real job: the right people through the right doors, with a record you can trust.',
  ],
  does: [
    'Reads RFID/smart-card credentials at the door',
    'Checks each credential against authorised users and their roles/schedules',
    'Actuates the lock only when access is permitted',
    'Writes a timestamped, tamper-evident audit log of every grant and denial',
    'Chooses a deliberate door fail mode (fail-safe vs fail-secure)',
    'Operates offline with a local permissions copy, syncing when online',
    'Supports defence-in-depth (card+PIN, anti-passback, tamper) and warns about cloneable cards',
  ],
  features: [
    'Role- and schedule-based permissions, not all-or-nothing access',
    'Complete, tamper-evident audit trail of entries and refusals',
    'Explicit fail-safe/fail-secure door behaviour',
    'Offline operation with local permissions + log sync',
    'Honest RFID security: authenticated smart cards and layered defences',
    'Anti-passback and tamper options',
    'Networked management with local autonomy',
  ],
  applications: [
    { t: 'Office / lab / server-room doors', d: 'Role-based entry where different staff have different rights, with an audit trail for compliance and incident review.' },
    { t: 'Society / apartment common areas', d: 'Resident cards for gates, gyms and clubhouses with schedules and logs, and easy revocation of lost cards.' },
    { t: 'Makerspaces / shared facilities', d: 'Access to rooms and machines gated by training/role, logged per user.' },
    { t: 'Small business premises', d: 'Controlled entry with the right fail mode and offline resilience where a network drop must not lock everyone out (or in).' },
  ],
  skills: [
    'Reading RFID/smart cards (and understanding their cloneability)',
    'Designing role/schedule-based permissions',
    'Tamper-evident logging and offline sync',
    'Choosing and wiring fail-safe vs fail-secure locks',
    'Defence-in-depth (card+PIN, anti-passback, tamper)',
  ],
  prereq: [
    'A plain RFID card\'s ID is easily cloned — do not treat a valid ID as proof of identity for anything sensitive; use authenticated smart cards and/or a second factor.',
    'Choose the door fail mode deliberately: fail-secure locks on power loss (security), fail-safe unlocks (fire egress). Life-safety egress must never be trapped.',
    'The controller must keep working offline — hold permissions and logs locally and sync when connected.',
    'A DIY controller is not certified security/fire hardware; where codes require certified equipment, use it.',
  ],

  parts: ['esp32', 'rc522', 'relay1', 'oled', 'buzzer', 'keypad', 'rtc', 'sdcard'],
  extraParts: [
    { name: 'Electric door lock (fail-safe or fail-secure)', spec: 'Electric strike or maglock chosen for the required fail mode and door', qty: 1, price: 1200, note: 'Fail mode is a security AND life-safety decision' },
    { name: 'Authenticated smart-card reader/cards', spec: 'MIFARE DESFire / cards supporting cryptographic auth (vs plain UID)', qty: 1, price: 900, note: 'For real security; plain UID cards are cloneable' },
    { name: 'Request-to-exit + door sensor', spec: 'REX button and reed contact for safe egress and door-ajar/forced logging', qty: 1, price: 300 },
    { name: 'Tamper switch + backup power', spec: 'Enclosure tamper and battery backup so power loss is handled by design', qty: 1, price: 400 },
  ],
  cost: '₹3,500 – ₹5,500',
  libs: ['wifi', 'pubsub', 'mfrc522', 'ssd1306', 'ntp', 'preferences', 'sqlite'],

  pins: {
    left: [
      { dev: 'RC522 reader', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Card read (SPI)' },
      { dev: 'RC522', devPin: 'RST', pin: 'GPIO 4', sig: 'Reader reset' },
      { dev: 'Keypad (PIN)', devPin: 'rows/cols', pin: 'GPIO matrix', sig: 'Optional second factor' },
      { dev: 'Door sensor / REX', devPin: 'in', pin: 'GPIO 34/35', sig: 'Door contact + request-to-exit' },
    ],
    right: [
      { dev: 'Lock relay', devPin: 'IN', pin: 'GPIO 26', sig: 'Actuate strike/maglock' },
      { dev: 'DS3231 RTC', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Timestamps for the log' },
      { dev: 'microSD', devPin: 'SPI', pin: 'shared SPI + CS', sig: 'Local permissions + audit log' },
      { dev: 'OLED + buzzer', devPin: 'I²C / IN', pin: 'GPIO 21-22 / 27', sig: 'Prompt + grant/deny feedback' },
    ],
  },
  wiringNotes: [
    'Wire the lock through a relay sized for it, and choose the strike/maglock and relay-normal state to give the intended fail mode: fail-secure (locked on power loss) or fail-safe (unlocked on power loss).',
    'Always provide a request-to-exit path and never let a fail-secure door trap people against fire-egress rules.',
    'Give the RTC a coin-cell backup so audit timestamps survive power loss — a log with wrong times is worthless.',
    'Add a tamper switch on the enclosure and battery backup so power/tamper events are handled and logged by design.',
    'For real security, use an authenticated smart-card reader; a plain UID reader is convenient for learning but cloneable.',
  ],

  block: { columns: [
    { label: 'Present', edge: 'right', blocks: [
      { name: 'Card/smart-card', sub: 'RC522', highlight: true },
      { name: 'PIN (opt)', sub: 'second factor' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'role + schedule' },
      { name: 'Permissions', sub: 'local copy' },
    ] },
    { label: 'Act + record', edge: 'right', blocks: [
      { name: 'Lock relay', sub: 'fail mode set' },
      { name: 'Audit log', sub: 'tamper-evident' },
    ] },
    { label: 'Manage', edge: 'none', blocks: [
      { name: 'Server', sub: 'users + logs' },
    ] },
  ] },
  flow: [
    { t: 'Card presented', k: 'start' },
    { t: 'Credential known?', k: 'dec', yes: 'Check role + schedule', no: 'Deny + log' },
    { t: 'Check role + schedule', k: 'proc' },
    { t: 'Allowed here and now (and PIN if required)?', k: 'dec', yes: 'Unlock + log grant', no: 'Deny + log' },
    { t: 'Unlock + log grant', k: 'io' },
    { t: 'Deny + log', k: 'io' },
    { t: 'Relock; sync log when online', k: 'end', back: 'Card presented' },
  ],

  principle: [
    'Access control is an <b>authentication-then-authorisation</b> problem, and both halves have to be right. Authentication asks "is this really who they claim to be?"; authorisation asks "is this identity allowed through this door now?". A toy reads a card ID and, if it is in a list, opens the door — collapsing both questions into one weak check. A real system separates them: it first establishes the credential\'s identity as securely as the hardware allows, then evaluates that identity against a permissions model. Conflating the two is how systems get both insecure (any cloned card works) and inflexible (no roles, no schedules).',
    'The uncomfortable truth about ordinary RFID is that it fails the authentication half. A basic card (a 125 kHz tag or a MIFARE Classic in UID mode) simply <b>broadcasts a fixed serial number</b> when energised, and a cheap handheld cloner can read and replay it — so treating a valid UID as proof of identity is like treating a shouted name as proof. That is fine for low-stakes convenience (a gym locker) and useless for a server room. The honest design therefore distinguishes stakes: for sensitive access it uses <b>authenticated smart cards</b> (e.g. DESFire) that never reveal a static secret but instead perform a cryptographic challenge-response the reader verifies, and/or adds a <b>second factor</b> (a PIN) so a cloned or stolen card alone is not enough. Naming this limitation, rather than hiding it, is part of building the system responsibly.',
    'Authorisation is where <b>roles and schedules</b> live, because access is almost never binary. Each credential maps to a person with a role, and the role defines which doors they may open and when — a cleaner in the lobby but not the lab, a contractor only 9-to-5, a manager everywhere, a lost card revoked instantly. Modelling permissions this way (rather than a flat allow-list per door) makes the system both more secure (least privilege — people can open only what they need) and vastly more manageable (change a role, not every door). Layered options like <b>anti-passback</b> (a card cannot enter twice without exiting, defeating card-sharing) extend the same principle.',
    'Finally, a door controller must be trustworthy in two operational senses. It must keep an <b>audit trail</b> — every grant and every denial, timestamped and tamper-evident — because access without accountability is only half a control, and the log is the evidence when an incident is investigated; that means append-only local storage with a backed-up clock, mirrored to a server. And it must handle <b>failure deliberately</b>: what does the door do when power or network is lost? A <b>fail-secure</b> lock stays locked (protecting a secure store), a <b>fail-safe</b> lock releases (allowing fire egress) — a choice dictated by security needs <i>and</i> life-safety law, and one the design must make explicit, never accidental. And because a network outage must not lock everyone out (or leave the door unmanaged), the controller holds its permissions and logs <b>locally</b> and operates offline, syncing when the link returns. Roles, audit, fail mode, offline resilience — these unglamorous properties are what make an access controller real rather than a relay that clicks on a card.',
  ],
  equations: [
    { t: 'Authorisation decision', eq: 'grant if:\n  authenticated(credential) AND\n  role_of(credential) permits door D AND\n  now ∈ schedule(role, D) AND\n  (second_factor_ok if required) AND\n  anti_passback_ok(credential, D)\n\nElse deny. Every path — grant or deny — is logged.' },
    { t: 'Cloneability of plain UID', eq: 'Plain card: presents fixed UID U.\n  attacker reads U (proximity) → writes clone → replays U\n  system sees U → cannot distinguish clone from original.\n\nAuthenticated card: reader sends nonce N; card returns\n  MAC_k(N) using secret k it never reveals.\n  clone without k fails → replay/clone defeated.' },
    { t: 'Fail mode choice', eq: 'Power/controller loss:\n  FAIL-SECURE  lock stays LOCKED (security priority)\n  FAIL-SAFE    lock RELEASES  (life-safety egress priority)\n\nDriven by: is this a secure store or a fire-egress route?\nLife-safety egress must never be trapped — law governs this.' },
  ],

  assembly: [
    { h: 'Wire the lock for the right fail mode', p: [
      'Select an electric strike or maglock and wire it through the relay so the door\'s behaviour on power loss matches its purpose — fail-secure for a secure room, fail-safe for a fire-egress door — and provide a request-to-exit path.',
      'Add battery backup and a tamper switch so power and tamper events are handled by design.',
    ], warn: 'The fail mode is a life-safety decision as much as a security one. A fail-secure lock on a fire-egress door can trap people. Follow local codes.' },
    { h: 'Fit reader, clock and storage', p: [
      'Connect the RFID/smart-card reader, a real-time clock with coin-cell backup for accurate log timestamps, and local storage (SD/flash) for the permissions copy and the append-only audit log. Add a keypad if using a PIN second factor.',
    ] },
    { h: 'Set up feedback and networking', p: [
      'Add an OLED and buzzer for clear grant/deny feedback, and Wi-Fi to a management server for user/role administration and log sync — while keeping the door fully functional offline.',
    ] },
  ],
  steps: [
    { h: 'Authenticate the credential', p: [
      'For plain cards, read the UID (and treat it as low-assurance); for smart cards, perform the card\'s challenge-response authentication so a clone without the secret fails.',
    ], tip: 'Never store card secrets in plaintext; if using authenticated cards, protect the reader keys and rotate them.' },
    { h: 'Authorise against role, schedule and factors', p: [
      'Look up the credential\'s role, check it permits this door at this time, verify any required second factor and anti-passback, then decide — and log the decision either way.',
    ], code: {
      file: 'authorise.ino', lang: 'cpp',
      body: `struct Cred { char id[24]; int role; };
struct Decision { bool grant; const char *reason; };

Decision authorise(const Cred &c, int door, time_t now,
                   bool pinOk, bool pinRequired) {
  if (c.role < 0)                       return {false, "unknown credential"};
  if (!rolePermitsDoor(c.role, door))   return {false, "role not allowed here"};
  if (!withinSchedule(c.role, door, now)) return {false, "outside allowed hours"};
  if (pinRequired && !pinOk)            return {false, "second factor failed"};
  if (!antiPassbackOk(c.id, door))      return {false, "anti-passback"};
  return {true, "granted"};
}

void handleCard(const Cred &c, int door, bool pinOk, bool pinRequired) {
  time_t now = timeNow();
  Decision d = authorise(c, door, now, pinOk, pinRequired);
  logEvent(c.id, door, now, d.grant, d.reason);   // append-only, always
  if (d.grant) unlockDoor(door);                  // per configured fail mode
  feedback(d.grant, d.reason);
}`,
      explain: [
        { ref: 'if (c.role < 0)                       return {false, "unknown credential"}', txt: 'An unrecognised credential is denied and logged — the first authorisation gate, and itself a security-relevant event worth recording.' },
        { ref: 'if (!rolePermitsDoor(c.role, door))', txt: 'Authorisation is by role and door, enforcing least privilege so a person can open only what their role needs.' },
        { ref: 'if (!withinSchedule(c.role, door, now))', txt: 'Time-of-day schedules mean access can be granted only when appropriate — a contractor in hours, not at 2 a.m.' },
        { ref: 'logEvent(c.id, door, now, d.grant, d.reason);   // append-only, always', txt: 'Every decision, grant or deny, is written to the tamper-evident log before the door acts — accountability is not optional.' },
        { ref: 'if (d.grant) unlockDoor(door);                  // per configured fail mode', txt: 'The lock is actuated according to the door\'s deliberate fail mode, keeping security and life-safety behaviour explicit.' },
      ],
    } },
    { h: 'Log tamper-evidently and sync', p: [
      'Append each event with a sequence number/timestamp to local storage, mirror to the server when online, and forward any offline backlog on reconnect.',
    ] },
  ],

  code: [{
    file: 'rfid-access-control.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   RFID Access Control — ESP32, role-based, audited, offline-capable

   Authenticates a credential, authorises against role + schedule +
   optional PIN and anti-passback, actuates the lock per a deliberate
   fail mode, and writes a tamper-evident audit log (local + synced).
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <RTClib.h>
#include <SD.h>
#include <Preferences.h>

#define RC522_SS   5
#define RC522_RST  4
#define PIN_LOCK  26
#define SD_CS     15
#define DOOR_ID    1
#define PIN_REQUIRED false        // set true for two-factor doors

MFRC522   rfid(RC522_SS, RC522_RST);
RTC_DS3231 rtc;
Preferences perms;                // local permissions cache
WiFiClient net; PubSubClient mqtt(net);
uint32_t logSeq = 0;

// Look up a credential's role from the local cache (synced from server).
int roleOf(const String &uid) {
  perms.begin("acl", true);
  int r = perms.getInt(uid.c_str(), -1);   // -1 = unknown
  perms.end();
  return r;
}
bool rolePermitsDoor(int role, int door) { /* role→door map */ return role >= 0; }
bool withinSchedule(int role, int door, DateTime now) { /* schedule */ return true; }
bool antiPassbackOk(const String &uid, int door) { /* track in/out */ return true; }

void logEvent(const String &uid, bool grant, const char *reason, DateTime t) {
  File f = SD.open("/access.csv", FILE_APPEND);   // append-only
  if (f) {
    f.printf("%lu,%04d-%02d-%02d %02d:%02d:%02d,%s,%d,%d,%s\\n",
      (unsigned long)logSeq++, t.year(),t.month(),t.day(),
      t.hour(),t.minute(),t.second(), uid.c_str(), DOOR_ID,
      grant?1:0, reason);
    f.close();
  }
  if (mqtt.connected()) {                          // mirror to server
    char m[160];
    snprintf(m,sizeof m,
      "{\\"uid\\":\\"%s\\",\\"door\\":%d,\\"grant\\":%d,\\"reason\\":\\"%s\\"}",
      uid.c_str(), DOOR_ID, grant?1:0, reason);
    mqtt.publish("acl/door1/event", m);
  }
}

void unlockDoor() {
  digitalWrite(PIN_LOCK, HIGH);    // energise per configured fail mode
  delay(3000);                     // relock timeout
  digitalWrite(PIN_LOCK, LOW);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_LOCK, OUTPUT);
  SPI.begin();
  rfid.PCD_Init();
  Wire.begin(21,22); rtc.begin();
  SD.begin(SD_CS);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
}

void loop() {
  if (!mqtt.connected() && WiFi.status()==WL_CONNECTED) mqtt.connect("acl-1");
  mqtt.loop();

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(50); return;
  }

  // NOTE: for plain cards this UID is cloneable — low assurance.
  // For real security, do the smart-card challenge-response here instead.
  String uid;
  for (byte i = 0; i < rfid.uid.size; i++) {
    char b[3]; snprintf(b,sizeof b,"%02X", rfid.uid.uidByte[i]); uid += b;
  }
  rfid.PICC_HaltA();

  DateTime now = rtc.now();
  int role = roleOf(uid);
  bool pinOk = PIN_REQUIRED ? checkPin() : true;

  bool grant = false; const char *reason;
  if (role < 0)                              reason = "unknown credential";
  else if (!rolePermitsDoor(role, DOOR_ID))  reason = "not allowed here";
  else if (!withinSchedule(role, DOOR_ID, now)) reason = "outside hours";
  else if (PIN_REQUIRED && !pinOk)           reason = "second factor failed";
  else if (!antiPassbackOk(uid, DOOR_ID))    reason = "anti-passback";
  else { grant = true; reason = "granted"; }

  logEvent(uid, grant, reason, now);         // always log the decision
  feedback(grant, reason);
  if (grant) unlockDoor();
}`,
    explain: [
      { ref: 'int roleOf(const String &uid)', txt: 'Permissions come from a local cache synced from the server, so the door authorises correctly even with the network down — offline resilience by design.' },
      { ref: '// NOTE: for plain cards this UID is cloneable', txt: 'The code is explicit that a plain UID is low-assurance and points to where real smart-card authentication belongs — honesty about the security limit, in the code itself.' },
      { ref: 'File f = SD.open("/access.csv", FILE_APPEND);   // append-only', txt: 'Events are appended with a sequence number and timestamp, never overwritten, so the audit trail is tamper-evident.' },
      { ref: 'logEvent(uid, grant, reason, now);         // always log the decision', txt: 'Both grants and denials are logged before any feedback or unlock, so every access attempt is accountable.' },
      { ref: 'digitalWrite(PIN_LOCK, HIGH);    // energise per configured fail mode', txt: 'The lock is driven according to the door\'s chosen fail mode, keeping the security-versus-egress behaviour a deliberate configuration, not an accident.' },
    ],
  }],

  config: [
    'Define roles, the role→door map and schedules; sync them to each controller\'s local cache.',
    'Set PIN_REQUIRED per door and configure anti-passback where needed.',
    'Choose and wire the fail mode (fail-safe/fail-secure) appropriate to each door and local code.',
    'Configure the RTC/NTP, tamper-evident logging, and server sync.',
  ],
  calibration: [
    { h: 'Clock', p: [
      'Sync the RTC (NTP when online) and confirm it holds time on its coin cell through a power-off, so audit timestamps are accurate.',
    ] },
    { h: 'Reader/credentials', p: [
      'Verify reliable reads at the intended range; for smart cards, confirm the challenge-response authenticates genuine cards and rejects clones.',
    ] },
    { h: 'Fail mode', p: [
      'Physically verify the door behaves as intended on power loss (locked vs released) and that egress is never trapped.',
    ] },
  ],
  testing: [
    { step: 'Present an authorised card in hours', expect: 'Granted, door unlocks, event logged as grant' },
    { step: 'Present an authorised card out of hours', expect: 'Denied with "outside hours"; logged' },
    { step: 'Present an unknown/revoked card', expect: 'Denied with "unknown credential"; logged' },
    { step: 'Two-factor door without PIN', expect: 'Denied "second factor failed"; logged' },
    { step: 'Pull the network', expect: 'Door still authorises from local cache; log queues and syncs later' },
    { step: 'Cut power', expect: 'Door assumes its configured fail mode; egress not trapped' },
  ],
  output: [
    'The management dashboard lists users/roles and shows a live audit log of grants and denials per door; the controller shows a grant/deny prompt locally.',
    { file: 'access-log.csv', lang: 'plain', body: `seq,timestamp,uid,door,grant,reason
10231,2026-07-27 09:02:11,04A3F2C1,1,1,granted
10232,2026-07-27 21:44:03,04A3F2C1,1,0,outside hours
10233,2026-07-27 21:45:10,9F1177AA,1,0,unknown credential` },
    'The log records both successful entries and refusals with their reasons — the accountability that turns a door opener into an access-control system.',
  ],
  troubleshoot: [
    { sym: 'Cloned card opens the door', cause: 'Plain UID trusted as identity', fix: 'Use authenticated smart cards (challenge-response) and/or add a PIN; plain UID is low-assurance' },
    { sym: 'Everyone locked out during a network drop', cause: 'No local permissions cache', fix: 'Hold permissions locally and authorise offline; sync logs later' },
    { sym: 'Audit timestamps wrong', cause: 'RTC coin cell missing/dead', fix: 'Fit a fresh coin cell; re-sync from NTP; verify time survives power-off' },
    { sym: 'Door traps people on power loss', cause: 'Wrong fail mode on an egress door', fix: 'Use fail-safe (release) on egress routes per code; verify physically' },
    { sym: 'Log can be edited', cause: 'Overwritable storage', fix: 'Append-only with sequence numbers; mirror to a server; consider signing records' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → access-management server (local-first)',
    net: {
      nodes: [{ name: 'Door controller', sub: 'ESP32' }, { name: 'Other doors', sub: 'more controllers' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'local autonomy',
      uplink: 'MQTT/TLS', cloud: 'ACL server', cloudSub: 'users, roles, logs',
      clients: [{ name: 'Admin', sub: 'manage + audit' }, { name: 'Security', sub: 'live events' }],
    },
    protocol: ['Doors authorise locally from a synced permissions cache and publish each event; the server distributes user/role/schedule updates and collects audit logs. Losing the network degrades management, not the door.'],
    topics: [
      { t: 'acl/door1/event', dir: 'node → server', payload: 'uid, door, grant/deny, reason, time' },
      { t: 'acl/door1/perms', dir: 'server → node', payload: 'role/schedule/revocation updates' },
      { t: 'acl/door1/status', dir: 'node → server', payload: 'tamper, door-forced, battery, RTC health' },
    ],
    cloud: ['A server manages users, roles, schedules and instant revocations, pushes them to controllers, and aggregates every door\'s audit log for compliance and incident review.'],
    dashboard: ['User/role management, per-door live event stream and searchable audit history, and door-status/tamper indicators.'],
    mobile: ['Alerts on tamper, door-forced/held-open, or repeated denials at a door.'],
    security: [
      'Use TLS and authenticate controllers to the server; protect reader/card keys.',
      'Keep logs append-only and mirrored so records cannot be silently altered.',
      'Support instant revocation and least-privilege roles; keep the door functional and audited offline.',
    ],
  },

  perf: [
    'Authorise from the local cache for instant, network-independent decisions.',
    'Keep the audit log append-only and rotate by day/month to stay fast and tamper-evident.',
    'Debounce reads and set a sensible relock timeout so the door is responsive but secure.',
    'Sync permissions and log backlogs in the background, never blocking a door decision.',
  ],
  safety: [
    'Choose the door fail mode for both security and life-safety; never trap people against fire-egress requirements.',
    'A plain RFID UID is not proof of identity — use authenticated cards and/or a second factor for anything sensitive.',
    'A DIY controller is not certified security/fire hardware; use certified equipment where codes require it.',
    'Protect the audit log and card keys; an access system is only as trustworthy as its records and secrets.',
  ],
  maintenance: [
    'Review the audit log and revoke lost/stale credentials promptly.',
    'Replace the RTC coin cell on schedule; verify time accuracy.',
    'Test the fail mode, REX and tamper periodically; check battery backup.',
    'Rotate reader/card keys where supported and keep permission syncs current.',
  ],
  future: [
    'Add biometric or mobile-credential (NFC phone) second factors.',
    'Add full anti-passback and occupancy tracking across doors.',
    'Cryptographically sign each log record for a court-defensible audit trail.',
    'Integrate with HR/identity systems for automatic provisioning and de-provisioning.',
  ],
  faq: [
    { q: 'Aren\'t RFID cards easy to clone?', a: 'Plain UID cards are — they just broadcast a fixed number. That is why, for anything sensitive, this design uses authenticated smart cards (which prove a secret without revealing it) and/or a PIN, and it says so plainly rather than pretending a UID is secure.' },
    { q: 'What happens if the network goes down?', a: 'The door keeps working. Permissions are cached locally so it authorises offline, and it queues the audit log to sync when the network returns. A network drop must never lock everyone out.' },
    { q: 'Fail-safe or fail-secure — which do I use?', a: 'It depends on the door. Fail-secure (locked on power loss) protects a secure store; fail-safe (released on power loss) is required for fire-egress routes so people are never trapped. Local codes govern this.' },
    { q: 'Why log denials, not just entries?', a: 'Refusals are security-relevant: repeated denials at a door, or an unknown card, may indicate an attempt. A complete audit trail of grants and denials is what makes the system accountable.' },
    { q: 'What are roles for?', a: 'Least privilege and manageability. Roles let each person open only the doors they need, at the times they need, and let you change access by editing a role rather than every door.' },
  ],
  refs: [
    { t: 'RFID and card cloning (MIFARE Classic weaknesses)', u: 'https://en.wikipedia.org/wiki/MIFARE', s: 'Reference' },
    { t: 'Access control — authentication vs authorisation', u: 'https://en.wikipedia.org/wiki/Access_control', s: 'Reference' },
    { t: 'Fail-safe vs fail-secure locks and egress', u: 'https://en.wikipedia.org/wiki/Electric_strike', s: 'Reference' },
    { t: 'MFRC522 RFID reader (datasheet)', u: 'https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-reader-ics/standard-performance-mifare-and-ntag-frontend:MFRC52202HN1', s: 'NXP' },
    { t: 'Role-based access control (RBAC)', u: 'https://en.wikipedia.org/wiki/Role-based_access_control', s: 'Reference' },
  ],
  images: ['esp32', 'oled', 'warehouse'],
  imageCaptions: [
    'A door controller reads a card and decides access by role and schedule — not just whether a number is on a list.',
    'An OLED gives clear grant/deny feedback while the event is written to a tamper-evident audit log.',
    'Networked management administers users and roles and collects every door\'s audit trail, while doors work offline.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   052 — Number-Plate Gate Logger
   ══════════════════════════════════════════════════════════════════ */
{
  id: '052',
  domainKey: 'ai',
  emoji: '🚗', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'Reads vehicle number plates at a gate to log and automate entry and exit — with the OCR, whitelist and privacy realities of real ANPR handled honestly.',

  overview: [
    'Automatic number-plate recognition (ANPR) turns a gate into something that recognises vehicles: it reads the plate of an approaching car, logs the entry or exit with a timestamp and image, and — for known vehicles on a whitelist — opens the gate automatically, so residents or staff never stop while visitors are handled by exception. It is one of the most visibly useful pieces of computer vision, and also one where the gap between a demo and a dependable system is wide, because plates in the real world are dirty, angled, glared, motion-blurred, and lit by headlights at night. This project builds a gate logger that treats those realities — and the privacy implications of recording vehicle movements — as core design problems, not afterthoughts.',
    'The pipeline is a classic two-stage vision problem: first <b>detect</b> where the plate is in the camera frame (a small object-detection step that finds the plate region against a busy scene), then <b>read</b> the characters on it (an OCR step, ideally a recogniser trained on plates rather than generic text). Doing detection first is what makes the OCR reliable — feeding a tightly-cropped, deskewed plate to the recogniser instead of a whole noisy frame dramatically cuts errors. The result is matched against a <b>whitelist</b> of authorised plates to decide whether to open the gate, and every read — recognised or not — is logged with its confidence and a captured image so a human can verify or override.',
    'The honesty is in the edges. OCR is never perfect, so the system reports a <b>confidence</b> and is designed to fail gracefully: a low-confidence or unrecognised read does not fling the gate open or slam it shut — it falls back to a human (an intercom, a guard, a visitor flow) rather than trusting a shaky guess, and near-matches (one ambiguous character) are handled deliberately. Because ANPR records where and when specific vehicles go, it is <b>personal data</b>, so the design keeps the plate database and logs access-controlled, is explicit about retention, and is framed for legitimate access control on private premises — not covert tracking. It is candid that lighting, angle and plate condition set a hard ceiling on accuracy, and that a good camera, IR illumination and a controlled approach geometry matter as much as the model. But built with those constraints respected, a plate-reading gate is a genuinely convenient, well-logged, and responsibly-run piece of access automation.',
  ],
  does: [
    'Detects the number plate in the camera frame, then reads its characters (OCR)',
    'Matches the plate against a whitelist to automate gate entry/exit',
    'Logs every read (recognised or not) with confidence, time and image',
    'Falls back to a human on low-confidence/unknown plates instead of guessing',
    'Handles day and night with a suitable camera and IR illumination',
    'Treats plate data as personal data — access-controlled, retention-explicit',
    'Automates known vehicles while visitors are handled by exception',
  ],
  features: [
    'Two-stage detect-then-read pipeline for reliable OCR',
    'Confidence-gated decisions with graceful human fallback',
    'Whitelist automation for residents/staff; exception flow for visitors',
    'Full audit log with captured images',
    'Day/night operation with IR and controlled approach geometry',
    'Privacy-aware: access-controlled data, explicit retention',
    'Honest about accuracy limits (lighting, angle, plate condition)',
  ],
  applications: [
    { t: 'Residential society / gated community gates', d: 'Auto-opening for residents\' registered vehicles, logged entry/exit, and a visitor exception flow.' },
    { t: 'Office / campus parking', d: 'Staff whitelist automation and complete vehicle logs for a controlled car park.' },
    { t: 'Small toll / access barriers', d: 'Automated barrier operation for authorised vehicles with an audited fallback.' },
    { t: 'Fleet / yard access', d: 'Logging and gating company vehicles in and out of a depot or yard.' },
  ],
  skills: [
    'Building a plate-detection + OCR (ANPR) pipeline',
    'Camera/geometry/lighting setup for readable plates',
    'Confidence gating and graceful fallback logic',
    'Whitelist matching with near-match handling',
    'Privacy-aware data handling and retention',
  ],
  prereq: [
    'Detect the plate first, then OCR the crop — reading a whole noisy frame is far less reliable.',
    'OCR is never perfect; gate decisions must be confidence-gated with a human fallback, never a blind trust of a guess.',
    'Plate/movement data is personal data — access-control it, set retention, and use it for legitimate access control, not covert tracking.',
    'Camera choice, angle, and IR lighting set the accuracy ceiling as much as the model; control the approach geometry.',
  ],

  parts: ['rpi4', 'picam', 'relay1', 'esp32', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'ANPR-suitable camera + IR', spec: 'Global-shutter or fast camera with IR-pass/illumination for night plates', qty: 1, price: 2500, note: 'Motion blur and night are the main failure sources' },
    { name: 'Gate/barrier interface', spec: 'Relay/dry-contact to the gate motor controller, with safety interlocks', qty: 1, price: 600 },
    { name: 'Vehicle-present trigger', spec: 'Loop detector / IR beam to capture at the right moment', qty: 1, price: 700, note: 'Trigger capture when a vehicle is in position' },
    { name: 'Weatherproof camera housing', spec: 'IP-rated, sun-hooded, positioned for a controlled plate view', qty: 1, price: 500 },
  ],
  cost: '₹6,000 – ₹10,000',
  libs: ['python', 'opencv', 'torch', 'ultralytics', 'fastapi', 'sqlite', 'picamera2'],

  pins: {
    left: [
      { dev: 'Pi camera', devPin: 'CSI', pin: 'CSI', sig: 'Plate image capture' },
      { dev: 'Vehicle trigger', devPin: 'OUT', pin: 'GPIO', sig: 'Capture-now (loop/beam)' },
      { dev: 'IR illuminator', devPin: 'EN', pin: 'GPIO', sig: 'Night lighting' },
    ],
    right: [
      { dev: 'Gate relay', devPin: 'IN', pin: 'GPIO', sig: 'Open barrier (whitelisted)' },
      { dev: 'ESP32 (gate I/O)', devPin: 'UART', pin: 'GPIO', sig: 'Barrier control + interlocks' },
      { dev: 'microSD/SSD', devPin: 'bus', pin: '—', sig: 'Log + image store' },
      { dev: '5V supply', devPin: '+/–', pin: '—', sig: 'Pi power' },
    ],
  },
  wiringNotes: [
    'Trigger capture from a loop detector or IR beam when the vehicle is in the read position, rather than processing video continuously — cleaner images, less compute.',
    'Add IR illumination for night plates (many plates are retroreflective and read well under IR) and control camera exposure to freeze motion.',
    'Interface the gate through a relay/dry-contact to the barrier\'s own controller, keeping the barrier\'s safety interlocks (obstruction sensing) intact.',
    'Position and hood the camera for a controlled, near-frontal plate view at the trigger point; geometry is half the accuracy.',
    'Store images and logs on reliable local storage (SD/SSD); treat them as personal data with access control.',
  ],

  block: { columns: [
    { label: 'Capture', edge: 'right', blocks: [
      { name: 'Trigger + camera', sub: 'vehicle in position', highlight: true },
      { name: 'IR (night)', sub: 'illumination' },
    ] },
    { label: 'Read', edge: 'right', blocks: [
      { name: 'Detect plate', sub: 'localise region' },
      { name: 'OCR', sub: 'read characters + conf' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'Whitelist', sub: 'known vehicle?' },
      { name: 'Gate / fallback', sub: 'open or human' },
    ] },
    { label: 'Record', edge: 'none', blocks: [
      { name: 'Log + image', sub: 'audited' },
    ] },
  ] },
  flow: [
    { t: 'Vehicle trigger fires', k: 'start' },
    { t: 'Capture frame(s)', k: 'proc' },
    { t: 'Detect plate region', k: 'proc' },
    { t: 'OCR the plate crop (confidence)', k: 'proc' },
    { t: 'Confident and on whitelist?', k: 'dec', yes: 'Open gate; log entry', no: 'Human fallback; log read' },
    { t: 'Open gate; log entry', k: 'io' },
    { t: 'Human fallback; log read', k: 'io' },
    { t: 'Store image + result', k: 'end', back: 'Vehicle trigger fires' },
  ],

  principle: [
    'ANPR is a pipeline, and its reliability comes from <b>doing the easy discriminative step before the hard generative one</b>. Detection first: a lightweight object detector finds the plate\'s bounding box in the frame — a well-defined, robust task even in a cluttered scene. Only then does the OCR run, and it runs on a small, tightly-cropped, deskewed image of just the plate. This ordering matters enormously: a character recogniser fed a whole scene must cope with background text, varied scale and clutter and fails often, while the same recogniser fed a clean plate crop is far more accurate. Detection also lets the system normalise geometry (rotate/warp the plate to a canonical front-on view) before reading, removing much of the angle-induced error.',
    'The <b>OCR</b> stage is where real-world plates fight back. Plates are read by a model that maps the cropped image to a character string, ideally one trained on plates (their fonts, spacing, regional formats) rather than generic text. Its accuracy is bounded by the input: motion blur from a moving car, glare and low contrast in bright sun, darkness and headlight flare at night, and dirt or damage on the plate itself all degrade the read. This is why the physical setup — a fast enough exposure to freeze motion, IR illumination that exploits plates\' retroreflectivity at night, and a controlled approach geometry so the plate is near-frontal at the trigger point — is not optional polish but a determinant of accuracy equal to the model. The system also uses <b>format priors</b> (a region\'s plates follow patterns) to catch and correct impossible reads.',
    'Because OCR is probabilistic, the whole system is designed around <b>confidence and graceful failure</b>. Every read carries a confidence, and the gate logic is gated on it: a high-confidence match to a whitelisted plate opens the gate automatically; anything below the confidence bar, or not on the whitelist, does <i>not</i> trigger a blind action but falls back to a human path — an intercom to a guard, a visitor-registration flow, a manual open. Near-matches (a single ambiguous character, an O/0 or 8/B confusion) are handled deliberately, either by choosing the whitelist entry within an edit-distance of one if unambiguous, or by escalating to a human. This "automate the confident majority, human-handle the uncertain minority" design is what makes ANPR useful without being dangerous — it never lets a shaky guess open a barrier or wrongly turn a resident away, and it always logs the captured image so a person can adjudicate.',
    'ANPR also carries a duty because it is <b>surveillance of people via their vehicles</b>. A log of which plates passed a gate, when, is personal data that reveals movements and patterns, so responsible design keeps the plate database and the read logs <b>access-controlled</b>, sets an explicit <b>retention</b> policy (keep what the access-control purpose needs, no more), and frames the system for legitimate premises access rather than covert tracking of individuals. Combined with the accuracy honesty — that lighting, angle and plate condition impose a real ceiling and a good camera and geometry matter as much as any model — this yields a system that is convenient and well-logged where it works, safe where it is unsure, and respectful of the fact that reading plates means recording people.',
  ],
  equations: [
    { t: 'Two-stage recognition', eq: 'frame → detector → plate box → crop+deskew → OCR → string,conf\n\nDetection localises; OCR reads the CROP, not the frame.\nGeometry normalisation (perspective warp to front-on)\nbefore OCR removes much angle-induced error.' },
    { t: 'Confidence-gated decision', eq: 'read (plate P, confidence c):\n\n  if c > C_HI and P ∈ whitelist        → open gate, log entry\n  elif c > C_HI and dist(P, whitelist)=1 (unambiguous) → open, flag\n  else                                  → human fallback, log read\n\nNever open on low confidence or a blind guess.' },
    { t: 'Near-match (edit distance) handling', eq: 'For read P and whitelist W:\n  best = argmin_{w∈W} levenshtein(P, w)\n  d    = levenshtein(P, best)\n\n  d = 0            → exact match\n  d = 1 & unique   → likely OCR slip (O/0, 8/B): accept w/ flag\n  d ≥ 2 or tie     → treat as unknown → human fallback\n\nFormat priors (regional plate pattern) reject impossible reads.' },
  ],

  assembly: [
    { h: 'Set up capture geometry and trigger', p: [
      'Mount the camera for a controlled, near-frontal view of the plate at the point a vehicle stops, hooded against sun. Add a loop detector or IR beam to trigger capture when the vehicle is in position.',
      'Add IR illumination for night, and set the exposure fast enough to freeze approach motion.',
    ], warn: 'Geometry and lighting cap the accuracy. A cheap camera at a good, controlled angle with IR beats an expensive one pointed badly. Get the physical setup right first.' },
    { h: 'Build the detect-then-read pipeline', p: [
      'Run a plate detector to localise and crop the plate, deskew it to a front-on view, then OCR the crop to a string with a confidence. Apply regional format priors to sanity-check the read.',
    ] },
    { h: 'Wire the gate and logging', p: [
      'Interface the barrier through a relay to its own controller (keeping its safety interlocks), and store every read — image, string, confidence, decision — to access-controlled local storage.',
    ] },
  ],
  steps: [
    { h: 'Decide with confidence gating and fallback', p: [
      'Match the read against the whitelist with near-match handling, open the gate only on a confident (exact or unambiguous near) match, and otherwise fall back to a human — logging the image and result either way.',
    ], code: {
      file: 'gate-decision.py', lang: 'python',
      body: `from Levenshtein import distance

C_HI = 0.85          # confidence bar for automatic action

def decide(plate, conf, whitelist):
    if conf < C_HI:
        return "human", "low confidence"          # never guess the gate open
    if plate in whitelist:
        return "open", "exact match"
    # tolerate a single unambiguous OCR slip (O/0, 8/B, ...)
    near = [w for w in whitelist if distance(plate, w) == 1]
    if len(near) == 1:
        return "open", f"near match -> {near[0]} (flagged)"
    return "human", "unknown vehicle"

def handle_read(plate, conf, image, whitelist, log, gate):
    action, reason = decide(plate, conf, whitelist)
    log.append(plate=plate, conf=conf, action=action,
               reason=reason, image=image)          # always log + image
    if action == "open":
        gate.open()
    else:
        gate.request_human()                        # intercom / visitor flow`,
      explain: [
        { ref: 'if conf < C_HI:', txt: 'Any read below the confidence bar goes straight to a human — a shaky OCR result never operates the barrier.' },
        { ref: 'if plate in whitelist:', txt: 'A confident exact match to an authorised vehicle opens the gate automatically — the convenient common case.' },
        { ref: 'near = [w for w in whitelist if distance(plate, w) == 1]', txt: 'A single unambiguous character slip (a classic O/0 or 8/B confusion) is tolerated and flagged, so common OCR errors do not needlessly turn a resident away.' },
        { ref: 'log.append(', txt: 'Every read — automatic or human-handled — is logged with its image, so decisions are auditable and a person can verify or correct.' },
        { ref: 'gate.request_human()', txt: 'The uncertain minority falls back to an intercom or visitor flow rather than a blind action, the graceful-failure design at the heart of usable ANPR.' },
      ],
    } },
    { h: 'Log, store and respect privacy', p: [
      'Store the image, plate, confidence and decision to access-controlled storage with an explicit retention policy, and expose logs only to authorised operators.',
    ], tip: 'Set retention to what the access-control purpose needs and purge older records automatically — do not accumulate a movement database beyond its purpose.' },
  ],

  code: [{
    file: 'anpr_gate.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Number-Plate Gate Logger — Raspberry Pi ANPR

Two-stage detect-then-read pipeline, confidence-gated gate control with
human fallback, whitelist (with near-match) matching, and audited,
privacy-aware logging with captured images.
"""
import time, cv2
from Levenshtein import distance
from ultralytics import YOLO          # plate detector (fine-tuned)
from plate_ocr import read_plate      # OCR model returning (text, conf)

C_HI = 0.85
detector = YOLO("plate_detect.pt")

def capture():
    # triggered by loop/beam when a vehicle is in position
    return picam_capture()            # returns a BGR frame

def detect_and_read(frame):
    res = detector(frame, verbose=False)[0]
    if not len(res.boxes):
        return None, 0.0, None
    # take the most confident plate box
    box = max(res.boxes, key=lambda b: float(b.conf))
    x1, y1, x2, y2 = map(int, box.xyxy[0])
    crop = frame[y1:y2, x1:x2]
    crop = deskew(crop)               # warp to a front-on view
    text, conf = read_plate(crop)     # OCR the clean crop
    return normalise(text), conf, crop

def decide(plate, conf, whitelist):
    if plate is None or conf < C_HI:
        return "human", "low confidence / no plate"
    if plate in whitelist:
        return "open", "exact match"
    near = [w for w in whitelist if distance(plate, w) == 1]
    if len(near) == 1:
        return "open", f"near match -> {near[0]} (flagged)"
    return "human", "unknown vehicle"

def main(whitelist, gate, db):
    while True:
        wait_for_vehicle_trigger()               # loop/beam
        set_ir(is_dark())
        frame = capture()
        plate, conf, crop = detect_and_read(frame)
        action, reason = decide(plate, conf, whitelist)

        db.log(plate=plate, conf=conf, action=action,
               reason=reason, image=crop, ts=time.time())   # audit + image
        if action == "open":
            gate.open()                          # barrier keeps its interlocks
        else:
            gate.request_human()                 # intercom / visitor flow
        db.enforce_retention()                   # purge beyond policy

if __name__ == "__main__":
    main(load_whitelist(), Gate(), PlateDB())`,
    explain: [
      { ref: 'def detect_and_read(frame):', txt: 'Runs detection first to find and crop the plate, then OCRs only that clean, deskewed crop — the two-stage ordering that makes the read reliable.' },
      { ref: 'box = max(res.boxes, key=lambda b: float(b.conf))', txt: 'Picks the most confident plate region when several are found, avoiding reading a reflection or a background sign.' },
      { ref: 'crop = deskew(crop)               # warp to a front-on view', txt: 'Normalises the plate\'s geometry before OCR, removing much of the error a tilted or angled plate would cause.' },
      { ref: 'if plate is None or conf < C_HI:', txt: 'No plate or low confidence means a human handles it — the gate is never operated on an uncertain read.' },
      { ref: 'db.enforce_retention()                   # purge beyond policy', txt: 'Old records are purged per the retention policy, so the system keeps only the movement data its access-control purpose needs — privacy by design.' },
    ],
  }],

  config: [
    'Set the confidence bar (C_HI), the whitelist, and regional plate-format priors.',
    'Configure the camera exposure/IR and the vehicle trigger for your gate geometry.',
    'Set the retention policy and access controls for the plate database and image logs.',
    'Configure the gate interface and ensure the barrier\'s own safety interlocks remain active.',
  ],
  ai: {
    dataset: [
      'ANPR uses two learned components: a plate detector and a character recogniser. Both benefit from data matching your region\'s plates and your camera\'s conditions (angle, night IR), so fine-tuning on locally-captured plates markedly improves accuracy over a generic model.',
      'Regional plate formats (character counts, allowed patterns) act as strong priors that catch impossible reads.',
    ],
    datasetTable: [
      { n: 'Open ANPR / plate datasets', size: 'Thousands–tens of thousands', lic: 'Varies (check per set)', use: 'Base plate detection + OCR' },
      { n: 'Your-gate capture set', size: 'Hundreds–thousands', lic: 'Your own footage', use: 'Fine-tune to camera, angle, night' },
      { n: 'Synthetic plates', size: 'Generated', lic: 'Self-generated', use: 'Augment character coverage/formats' },
    ],
    preprocess: [
      'Crop to the detected plate box and deskew/warp to a canonical front-on rectangle.',
      'Normalise contrast (and handle IR imagery for night), then resize to the OCR model\'s input.',
      'Apply regional format priors to validate/repair the character string.',
    ],
    pipeline: [
      { name: 'Trigger + capture', sub: 'vehicle in position', highlight: true },
      { name: 'Detect plate', sub: 'object detector' },
      { name: 'Deskew crop', sub: 'front-on warp' },
      { name: 'OCR', sub: 'chars + confidence' },
      { name: 'Format prior', sub: 'validate/repair' },
      { name: 'Decide + log', sub: 'gate / human', highlight: true },
    ],
    arch: [
      'A compact object detector (e.g. a small YOLO) localises the plate; a sequence recogniser (CNN + CTC, or a small transformer OCR) reads the characters from the crop.',
      'On a Raspberry Pi, use lightweight/quantised models and trigger inference only on a vehicle event to stay real-time.',
    ],
    archTable: [
      { l: 'Detector', s: 'small YOLO (plate class)', p: 'Localise the plate region robustly' },
      { l: 'Rectify', s: 'perspective warp', p: 'Front-on normalisation before OCR' },
      { l: 'OCR', s: 'CNN + CTC / small OCR transformer', p: 'Read variable-length plate strings' },
      { l: 'Priors', s: 'regional format regex', p: 'Reject/repair impossible reads' },
    ],
    hyper: [
      { k: 'detector input', v: '~640 px', w: 'Balance speed and small-plate recall' },
      { k: 'OCR input', v: '~normalised 32×128', w: 'Standard plate-crop size' },
      { k: 'C_HI (confidence bar)', v: '~0.85', w: 'Trade auto-open rate vs wrong-open risk' },
      { k: 'near-match edit distance', v: '1', w: 'Tolerate a single unambiguous OCR slip' },
    ],
    training: [
      'Fine-tune the detector on plates in your scene geometry and lighting; train/fine-tune the OCR on plate crops including night-IR imagery.',
      'Augment with blur, glare, rotation and partial occlusion so the models are robust to real approach conditions.',
      'Validate on held-out real gate captures, tracking read accuracy separately for day and night.',
    ],
    metricsIntro: [
      'The decisive metrics are end-to-end plate-read accuracy and, operationally, the auto-open rate versus the wrong-open rate.',
    ],
    metrics: [
      { m: 'Plate read accuracy (day)', v: '~95%+', d: 'Exact-string accuracy on good day captures' },
      { m: 'Plate read accuracy (night)', v: 'lower', d: 'IR/exposure dependent; the hard case' },
      { m: 'Auto-open rate', v: 'target high for known', d: 'Fraction of known vehicles handled without a human' },
      { m: 'Wrong-open rate', v: 'target ~0', d: 'The costly error — gated hard by confidence' },
    ],
    chart: {
      title: 'Read accuracy by condition (illustrative)',
      desc: 'Why lighting and geometry dominate ANPR accuracy.',
      unit: '%',
      bars: [
        { label: 'Good day, frontal', value: 97 },
        { label: 'Angle/glare', value: 82 },
        { label: 'Night (no IR)', value: 55 },
        { label: 'Night (with IR)', value: 88 },
      ],
    },
    deploy: [
      'Run detection + OCR on the Pi triggered by a vehicle event; keep models quantised for real-time performance.',
      'Keep the plate database and image logs on access-controlled local storage with enforced retention.',
      'Provide a human-in-the-loop path for low-confidence/unknown reads and a way to correct/label captures to improve the models.',
    ],
    inference: {
      file: 'read.py', lang: 'python',
      body: `# End-to-end read for one capture (detect -> deskew -> OCR -> validate).
def read(frame, region_regex):
    box = detect_plate(frame)                 # localise
    if box is None:
        return None, 0.0
    crop = deskew(frame[box.slice])           # front-on warp
    text, conf = ocr(crop)                    # chars + confidence
    text = repair_with_prior(text, region_regex)   # format validation
    return text, conf`,
    },
    limits: [
      'Accuracy is bounded by lighting, angle, motion blur and plate condition; night and oblique angles are materially worse without IR and good geometry.',
      'OCR confusions (O/0, 8/B, I/1) happen; near-match logic and format priors mitigate but do not eliminate them — hence the human fallback.',
      'It reads plates, not drivers; it must not be used for covert individual tracking, and its data is personal data to be minimised and protected.',
    ],
  },
  calibration: [
    { h: 'Geometry and exposure', p: [
      'Tune camera position, angle and exposure at the trigger point until day plates are captured sharp and near-frontal; verify IR gives readable night plates.',
    ] },
    { h: 'Confidence bar', p: [
      'Set C_HI by reviewing real captures: high enough that wrong-opens are ~zero, low enough that most known vehicles auto-open.',
    ] },
    { h: 'Whitelist / near-match', p: [
      'Validate that exact and single-slip near-matches behave as intended and that ambiguous cases go to a human.',
    ] },
  ],
  testing: [
    { step: 'Known plate, good day light', expect: 'Read confidently, gate auto-opens, logged with image' },
    { step: 'Known plate with one OCR slip', expect: 'Near-match accepted and flagged; gate opens' },
    { step: 'Unknown plate', expect: 'Human fallback; read logged with image' },
    { step: 'Low-confidence/blurred read', expect: 'No auto action; falls back to human' },
    { step: 'Night capture', expect: 'IR gives a readable plate; day-only model may need night data' },
    { step: 'Check retention/access', expect: 'Old records purged; logs only accessible to authorised operators' },
  ],
  output: [
    'The dashboard shows a log of entries/exits with plate, confidence, time, decision and a captured image, and lets an operator handle fallbacks and correct reads.',
    { file: 'gate-log.json', lang: 'json', body: `{
  "plate": "MH12AB1234",
  "confidence": 0.93,
  "action": "open",
  "reason": "exact match",
  "time": "2026-07-27T09:02:41",
  "image": "/logs/20260727-090241.jpg"
}` },
    'A confident exact match auto-opens for a resident and is logged with its image; a low-confidence or unknown read would instead route to a human, still logged, never blindly acted on.',
  ],
  troubleshoot: [
    { sym: 'Poor read accuracy', cause: 'Bad geometry, blur, glare or night without IR', fix: 'Fix camera angle/exposure; add IR; trigger capture when the vehicle is in position' },
    { sym: 'Wrong vehicle let in', cause: 'Confidence bar too low or near-match too loose', fix: 'Raise C_HI; require unambiguous near-match; add format priors' },
    { sym: 'Residents often sent to human', cause: 'Confidence bar too high or plates dirty', fix: 'Tune C_HI; improve capture; add their plates as captured and label corrections' },
    { sym: 'OCR confuses O/0, 8/B', cause: 'Inherent character ambiguity', fix: 'Use plate-format priors and single-edit near-matching; train on more examples' },
    { sym: 'Privacy concern', cause: 'Unbounded retention / open access to logs', fix: 'Set explicit retention, purge automatically, restrict log access to authorised operators' },
  ],
  perf: [
    'Trigger inference on a vehicle event, not on continuous video, to save compute and get cleaner frames.',
    'Detect then OCR the crop; do not OCR whole frames.',
    'Use quantised/lightweight models on the Pi for real-time reads.',
    'Store images efficiently and enforce retention so storage does not grow unbounded.',
  ],
  safety: [
    'Plate/movement data is personal data — access-control it, set explicit retention, and use it for legitimate premises access, not covert tracking.',
    'Keep the barrier\'s own safety interlocks (obstruction sensing) active; ANPR only requests open/close.',
    'Never auto-act on a low-confidence read; always provide a human fallback and an audit image.',
    'Comply with local ANPR/CCTV and data-protection law, including signage where required.',
  ],
  maintenance: [
    'Clean the camera/IR optics; dirt and glare degrade reads.',
    'Re-tune geometry/exposure seasonally and after any camera movement.',
    'Retrain/fine-tune the models with corrected captures, especially for night.',
    'Review retention/access and purge as policy requires.',
  ],
  future: [
    'Add make/model/colour as corroborating features to catch cloned plates.',
    'Add a resident self-service portal to register/deregister vehicles.',
    'Add two-camera capture (front/rear) for higher read reliability.',
    'Federate multiple gates with a shared, access-controlled vehicle registry.',
  ],
  faq: [
    { q: 'Why detect the plate before reading it?', a: 'Feeding OCR a whole noisy frame is unreliable. Localising and cropping the plate first — and warping it front-on — gives the recogniser a clean input and dramatically improves accuracy.' },
    { q: 'What happens when the read is uncertain?', a: 'It falls back to a human. The gate only auto-opens on a confident exact (or single-slip near) match to the whitelist; anything else goes to an intercom or visitor flow, always logged with the captured image.' },
    { q: 'Why is night harder?', a: 'Low light and headlight glare wreck ordinary captures. IR illumination exploits plates\' retroreflectivity and a fast exposure freezes motion — geometry and lighting matter as much as the model.' },
    { q: 'Isn\'t this surveillance?', a: 'It records vehicle movements, which is personal data, so it must be run responsibly: access-controlled logs, explicit retention, legitimate access-control purpose, and compliance with local law — not covert tracking of individuals.' },
    { q: 'Can someone beat it with a cloned plate?', a: 'A plate alone is spoofable, which is why higher-security setups corroborate with make/model/colour or pair ANPR with a second credential, and why every read is logged with an image for human review.' },
  ],
  refs: [
    { t: 'Automatic number-plate recognition — overview', u: 'https://en.wikipedia.org/wiki/Automatic_number-plate_recognition', s: 'Reference' },
    { t: 'Optical character recognition', u: 'https://en.wikipedia.org/wiki/Optical_character_recognition', s: 'Reference' },
    { t: 'YOLO object detection', u: 'https://docs.ultralytics.com/', s: 'Ultralytics' },
    { t: 'CTC sequence recognition (OCR)', u: 'https://en.wikipedia.org/wiki/Connectionist_temporal_classification', s: 'Reference' },
    { t: 'ANPR and data protection considerations', u: 'https://ico.org.uk/', s: 'ICO' },
  ],
  images: ['car', 'camera', 'cctv'],
  imageCaptions: [
    'A gate camera reads an approaching vehicle\'s plate to log and automate entry and exit.',
    'The camera captures the plate at the trigger point; detection then OCR turns the image into characters.',
    'Confident whitelisted reads open the barrier automatically while uncertain ones fall back to a human — every read logged.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   053 — Panic Button Network
   ══════════════════════════════════════════════════════════════════ */
{
  id: '053',
  domainKey: 'iot',
  emoji: '🆘', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'SOS buttons across a campus or society that route a located, acknowledged alarm to a control room in seconds — engineered so that when it is pressed, it works.',

  overview: [
    'A panic button has exactly one job, and it must never fail at it: when someone in trouble presses it, a located alarm has to reach whoever can help, fast, and the person who sent it should know help is coming. That single-mindedness drives the whole design. Scattered across a campus, a housing society, a hospital or a school — in stairwells, car parks, corridors, hostel rooms — the buttons form a network that turns a press into an instant, located alert at a staffed control room, with acknowledgement flowing back so the sender is not left wondering whether anyone saw it.',
    'The engineering challenge is <b>reliability under the worst conditions</b>, because a panic system is judged only by the moments it is used, which are emergencies. So every part is built to keep working when things are going wrong: each button reports its <b>location</b> so responders go straight to the right place; the alert is <b>acknowledged</b> end-to-end so both the control room and the sender have confirmation; the network is <b>supervised</b> so a button with a flat battery or a broken link is detected and fixed <i>before</i> an emergency, not discovered during one; and the communication path is chosen for coverage and resilience (a LoRa mesh or wired bus across a site, with redundancy) rather than a single fragile link. Buttons run on mains with battery backup so a power cut does not disarm them.',
    'The behaviours around the core press are what make it dependable in practice: a button press is unmistakable and hard to trigger accidentally yet easy in a panic; an alert latches until a human acknowledges it, so it cannot be missed by a glance away; the control room sees a clear, prioritised, located alarm with the button\'s ID and place; and periodic self-tests and battery/link supervision keep the whole network provably healthy. It is honest that a DIY system is not a substitute for a monitored, certified life-safety installation where regulations demand one — but as a responsive, located, supervised SOS network for a campus or community, it does the thing that matters most: when the button is pressed, the alarm gets through, someone knows, and help is dispatched to the right place.',
  ],
  does: [
    'Sends an instant, located alarm to a control room when a button is pressed',
    'Acknowledges end-to-end so the sender knows help is coming',
    'Supervises every button (battery, link) so faults are found before emergencies',
    'Latches alarms until a human acknowledges — never missed by a glance away',
    'Uses a resilient path (LoRa mesh / wired bus) with redundancy',
    'Runs on mains with battery backup so a power cut does not disarm it',
    'Prioritises and locates alarms clearly at the control room',
  ],
  features: [
    'Single-purpose reliability: when pressed, it works',
    'Located alarms so responders go straight to the place',
    'End-to-end acknowledgement to the sender',
    'Network supervision (battery/link) — faults found in advance',
    'Latched, prioritised alarms at a staffed control room',
    'Resilient comms with backup power',
    'Honest scope vs certified life-safety systems',
  ],
  applications: [
    { t: 'Campus / university safety', d: 'Emergency SOS points across grounds, car parks and buildings routing to campus security with location.' },
    { t: 'Residential society / gated community', d: 'Panic buttons in common areas and homes alerting a guard control room instantly.' },
    { t: 'Hospitals / care facilities', d: 'Staff-assist and patient SOS points with located, acknowledged alerts.' },
    { t: 'Schools / workplaces', d: 'Lockdown/assistance buttons in classrooms and offices routing to a coordinator.' },
  ],
  skills: [
    'Designing single-purpose reliable alerting',
    'Located alarms and end-to-end acknowledgement',
    'Network supervision (battery/link heartbeats)',
    'Resilient comms (LoRa mesh / wired bus) with backup power',
    'Control-room prioritisation and latching',
  ],
  prereq: [
    'A panic system is judged only when used — engineer for reliability under the worst conditions, and supervise so faults are found before an emergency.',
    'The sender must get acknowledgement; a silent send leaves a person in danger unsure help is coming.',
    'Provide backup power so a mains cut does not disarm buttons, and choose a resilient, ideally redundant, comms path.',
    'A DIY system is not a certified monitored life-safety installation; where regulations require one, use it.',
  ],

  parts: ['esp32', 'buzzer', 'oled', 'lora', 'reed', 'rtc', 'psu5v', 'li18650'],
  extraParts: [
    { name: 'Robust panic button + housing', spec: 'Large, tamper-resistant, hard-to-trigger-accidentally, easy-in-panic button', qty: 1, price: 350, note: 'Optionally protected/latching to prevent casual presses' },
    { name: 'LoRa mesh gateway (control room)', spec: 'Gateway with backhaul to the control-room console', qty: 1, price: 2500 },
    { name: 'Backup battery + charger per button', spec: 'Battery + charger so a mains cut does not disarm the button', qty: 1, price: 300 },
    { name: 'Control-room console/annunciator', spec: 'Screen/panel showing located, prioritised, latched alarms with ack', qty: 1, price: 1500 },
  ],
  cost: '₹2,800 – ₹4,500 per button (+ shared gateway/console)',
  libs: ['wifi', 'pubsub', 'ssd1306', 'lorolib', 'ntp', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Panic button', devPin: 'NO/NC', pin: 'GPIO 27', sig: 'SOS press' },
      { dev: 'Tamper switch', devPin: 'NC', pin: 'GPIO 14', sig: 'Enclosure tamper' },
      { dev: 'DS3231 RTC', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Event timestamps' },
    ],
    right: [
      { dev: 'LoRa SX1276', devPin: 'SPI+CTRL', pin: 'GPIO 18/19/23/5/14/2', sig: 'Resilient alert path' },
      { dev: 'OLED + buzzer', devPin: 'I²C / IN', pin: 'GPIO 21-22 / 26', sig: 'Local ack + status' },
      { dev: 'Backup battery', devPin: 'sense', pin: 'ADC', sig: 'Battery supervision' },
      { dev: 'Mains 5V + charger', devPin: 'OUT', pin: '3V3 reg', sig: 'Powered + backup' },
    ],
  },
  wiringNotes: [
    'Wire the button so a press is unambiguous and debounced; consider a protected/latching actuator to prevent casual/accidental presses while staying easy in a real emergency.',
    'Power from mains with automatic battery backup, and sense the battery so low-power is supervised and reported.',
    'Use a resilient comms path — a LoRa mesh (each button relaying) or a supervised wired bus — with redundancy where possible.',
    'Add a tamper switch and give the RTC a coin-cell backup for accurate event times.',
    'Provide clear local feedback (buzzer/OLED) that the alert was sent and acknowledged.',
  ],

  block: { columns: [
    { label: 'Press', edge: 'right', blocks: [
      { name: 'Panic button', sub: 'located', highlight: true },
      { name: 'Backup power', sub: 'mains + battery' },
    ] },
    { label: 'Deliver', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'send + latch' },
      { name: 'LoRa mesh', sub: 'resilient path' },
    ] },
    { label: 'Respond', edge: 'right', blocks: [
      { name: 'Control room', sub: 'located, prioritised' },
      { name: 'Acknowledge', sub: 'back to sender' },
    ] },
    { label: 'Assure', edge: 'none', blocks: [
      { name: 'Supervision', sub: 'battery/link health' },
    ] },
  ] },
  flow: [
    { t: 'Idle (supervised)', k: 'start' },
    { t: 'Button pressed?', k: 'dec', yes: 'Send located SOS (retry)', no: 'Send periodic heartbeat' },
    { t: 'Send located SOS (retry)', k: 'proc' },
    { t: 'Control room ack received?', k: 'dec', yes: 'Confirm to sender; latch at room', no: 'Retry / escalate path' },
    { t: 'Confirm to sender; latch at room', k: 'io' },
    { t: 'Retry / escalate path', k: 'io', back: 'Send located SOS (retry)' },
    { t: 'Send periodic heartbeat', k: 'io' },
    { t: 'Supervise battery/link', k: 'end', back: 'Idle (supervised)' },
  ],

  principle: [
    'A panic button is a <b>life-safety alerting</b> device, and life-safety design is dominated by one idea: the system must work in the rare, adverse moment it is needed, so everything is engineered for that moment rather than for the common case where nothing happens. That inverts normal priorities. Convenience, features, and efficiency are secondary; <b>reliability, supervision, and confirmation</b> are paramount. The measure of the system is not how it behaves on an ordinary Tuesday but whether, at 3 a.m. during a power cut when someone is in danger, a press still produces a located alarm at a staffed console and a confirmation back to the sender.',
    'Three properties turn a button-and-buzzer into a dependable SOS system. First, <b>location</b>: an alarm that just says "someone pressed a button somewhere" wastes the seconds that matter, so every button carries its identity and place, and the control room sees exactly where help is needed. Second, <b>acknowledgement</b>: the alert is confirmed end-to-end — the control room\'s console shows and latches it, and a confirmation flows back to the button so the person who pressed it <i>knows</i> their call was received, which is both reassurance and evidence the path worked. A one-way send that might have been lost is not good enough when a life may depend on it. Third, <b>latching and prioritisation</b>: an alarm holds until a human explicitly acknowledges it, so it cannot be missed by a glance away, and it is presented prominently above routine information.',
    'The property that separates a real system from a hopeful one is <b>supervision</b>. A panic network sits idle almost all the time, and the danger is that a button quietly dies — flat backup battery, broken antenna, severed wire — and nobody notices until the emergency reveals it, too late. So every button periodically sends a <b>heartbeat</b> reporting that it is alive and healthy (battery level, link quality), and the control room tracks these and raises a maintenance alarm the moment a button goes silent or reports a low battery. This turns "is the system working?" from an assumption into a continuously-verified fact. Combined with <b>backup power</b> (so a mains cut does not silently disarm the network) and a <b>resilient comms path</b> (a LoRa mesh where each button relays for others, or a supervised wired bus, ideally with redundancy so one failure does not create a dead zone), supervision is what lets you trust the system on the day it is used.',
    'The design is finally about <b>honest scope and human factors</b>. The button must be unmistakable and hard to trigger by accident yet effortless to press in a panic; the alarm must reach a place where a human will actually act; and the whole thing must be regularly self-tested. It is candid that a DIY panic network, however well-built, is not a substitute for a professionally-monitored, certified life-safety installation where regulations or duty of care require one — a certified system carries guarantees and monitoring a homebrew cannot. But within its scope — a responsive, located, acknowledged, supervised SOS network for a campus or community — it delivers exactly what a panic button must: pressed in trouble, it gets through, someone knows, and help is sent to the right place.',
  ],
  equations: [
    { t: 'Reliable delivery (retry + ack)', eq: 'On press:\n  repeat up to N times:\n    send SOS(button_id, location, seq)\n    wait for ACK(seq) up to T\n    if ACK received → confirm to sender, stop\n  if no ACK after N → escalate (alt path / audible / SMS)\n\nOne-way sends are not enough; require and surface the ACK.' },
    { t: 'Supervision heartbeat', eq: 'Each button, every H minutes:\n  send HEARTBEAT(button_id, battery, rssi)\n\nControl room:\n  if no heartbeat within k·H  → button UNHEALTHY (maintenance)\n  if battery < B_min          → low-battery maintenance alarm\n\nSilence is itself an alarm — a dead button must be noticed.' },
    { t: 'Mesh relay for coverage/resilience', eq: 'SOS packets flood the LoRa mesh with dedup + hop limit:\n  each button relays neighbours\' unseen SOS (hops < HOP_MAX)\n  → reaches the control-room gateway even if one path fails\n\nRedundant paths mean a single broken link is not a dead zone.' },
  ],

  assembly: [
    { h: 'Build a reliable, supervised button', p: [
      'Fit a robust, unmistakable panic button (protected against casual/accidental presses but effortless in an emergency), power it from mains with automatic battery backup, and sense the battery for supervision. Add a tamper switch and a backed-up RTC.',
    ], warn: 'A panic button that is disarmed by a power cut, or that nobody notices has a flat battery, is worse than none — it creates false confidence. Backup power and supervision are mandatory.' },
    { h: 'Set up the resilient comms', p: [
      'Use a LoRa mesh (each button relaying) or a supervised wired bus to reach the control-room gateway, with redundancy so a single failure is not a dead zone. Encode each button\'s location/ID.',
    ] },
    { h: 'Set up the control-room console', p: [
      'Provide a console/annunciator that shows located, prioritised, latched alarms and lets an operator acknowledge them, plus a maintenance view of button health.',
    ] },
  ],
  steps: [
    { h: 'Send with retry and require acknowledgement', p: [
      'On a press, send the located SOS and wait for an acknowledgement, retrying and escalating if none arrives, and confirm to the sender when the control room acknowledges.',
    ], code: {
      file: 'panic-send.ino', lang: 'cpp',
      body: `#define N_RETRY 5
#define ACK_TIMEOUT_MS 1500

bool sendSOS(uint32_t seq) {
  for (int attempt = 0; attempt < N_RETRY; attempt++) {
    txSOS(BUTTON_ID, LOCATION, seq);            // located alert into the mesh
    localFeedback("sending...");
    if (waitForAck(seq, ACK_TIMEOUT_MS)) {      // control room received it
      localFeedback("HELP COMING");             // confirm to the sender
      return true;
    }
  }
  escalate();                                   // alt path / audible / SMS
  localFeedback("escalating");
  return false;
}

void onButtonPress() {
  static uint32_t seq = 0;
  latchLocalAlarm();                            // local sounder on
  sendSOS(++seq);                               // deliver, confirm or escalate
}`,
      explain: [
        { ref: 'for (int attempt = 0; attempt < N_RETRY; attempt++)', txt: 'The SOS is retried several times, because a single transmission can be lost and a life-safety alert cannot depend on one lucky packet.' },
        { ref: 'if (waitForAck(seq, ACK_TIMEOUT_MS))', txt: 'Delivery is confirmed by an acknowledgement from the control room, not assumed — the difference between hoping the alert arrived and knowing it did.' },
        { ref: 'localFeedback("HELP COMING")', txt: 'The sender is told their call was received, which both reassures the person in danger and proves the path worked end-to-end.' },
        { ref: 'escalate();                                   // alt path / audible / SMS', txt: 'If no acknowledgement arrives after all retries, the button escalates to an alternate path rather than failing silently.' },
      ],
    } },
    { h: 'Heartbeat and supervise', p: [
      'Send periodic heartbeats with battery and link status; at the control room, flag any button that goes silent or reports low battery as a maintenance alarm so faults are fixed before an emergency.',
    ], tip: 'Treat a missing heartbeat as an alarm in its own right — a silently dead button is the failure mode that must never surprise you.' },
  ],

  code: [{
    file: 'panic-button-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Panic Button Network — ESP32 node, LoRa mesh, supervised

   Single-purpose reliable SOS: on press, sends a located alert with
   retry until acknowledged (confirming to the sender), escalates if
   not, and periodically heartbeats battery/link so a dead button is
   noticed before an emergency. Mains + battery backup.
   ══════════════════════════════════════════════════════════════════ */

#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>

#define PIN_BTN    27
#define PIN_TAMPER 14
#define PIN_BUZZER 26
#define PIN_VBAT   34
#define LORA_CS     5
#define LORA_RST   14
#define LORA_DIO0   2
#define N_RETRY     5
#define ACK_MS   1500
#define HEARTBEAT_MS 300000UL      // 5 min health beat

const uint16_t BUTTON_ID = 12;
const char *LOCATION = "Block C stairwell";
Adafruit_SSD1306 oled(128,64,&Wire);
Preferences prefs;
uint32_t seq = 0, lastBeat = 0;
volatile bool pressed = false;

void IRAM_ATTR onPress() { pressed = true; }

float batteryV() { return analogRead(PIN_VBAT)/4095.0f*3.3f*2.0f; }

void showLocal(const char *msg) {
  oled.clearDisplay(); oled.setCursor(0,0);
  oled.printf("Btn %d\\n%s\\n%s", BUTTON_ID, LOCATION, msg); oled.display();
}

void txSOS(uint32_t s) {
  LoRa.beginPacket();
  LoRa.printf("{\\"t\\":\\"SOS\\",\\"id\\":%u,\\"loc\\":\\"%s\\",\\"seq\\":%lu}",
              BUTTON_ID, LOCATION, (unsigned long)s);
  LoRa.endPacket();
}

bool waitForAck(uint32_t s, uint32_t timeout) {
  uint32_t t0 = millis();
  while (millis() - t0 < timeout) {
    if (LoRa.parsePacket()) {
      String p; while (LoRa.available()) p += (char)LoRa.read();
      if (p.indexOf("\\"ACK\\"") >= 0 && p.indexOf(String(s)) >= 0) return true;
    }
  }
  return false;
}

bool sendSOS() {
  digitalWrite(PIN_BUZZER, HIGH);              // local sounder latches on
  uint32_t s = ++seq;
  for (int a = 0; a < N_RETRY; a++) {
    showLocal("sending...");
    txSOS(s);
    if (waitForAck(s, ACK_MS)) { showLocal("HELP COMING"); return true; }
  }
  escalate();                                  // alt path / audible / SMS
  showLocal("escalating");
  return false;
}

void heartbeat() {
  LoRa.beginPacket();
  LoRa.printf("{\\"t\\":\\"HB\\",\\"id\\":%u,\\"vbat\\":%.2f}",
              BUTTON_ID, batteryV());
  LoRa.endPacket();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BTN, INPUT_PULLUP);
  pinMode(PIN_TAMPER, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);
  attachInterrupt(PIN_BTN, onPress, FALLING);
  Wire.begin(21,22); oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6); LoRa.setSpreadingFactor(10);
  showLocal("ready");
}

void loop() {
  if (pressed) { pressed = false; sendSOS(); }

  if (millis() - lastBeat > HEARTBEAT_MS) {    // supervision heartbeat
    heartbeat();
    lastBeat = millis();
  }

  // relay neighbours' SOS packets (dedup + hop limit) for mesh resilience
  relayMeshIfNeeded();
}`,
    explain: [
      { ref: 'attachInterrupt(PIN_BTN, onPress, FALLING)', txt: 'A press is captured by interrupt so the alert is sent immediately, even while the node is busy heartbeating or relaying.' },
      { ref: 'digitalWrite(PIN_BUZZER, HIGH);              // local sounder latches on', txt: 'A local sounder fires on press regardless of the network, giving immediate on-site alarm and reassurance.' },
      { ref: 'if (waitForAck(s, ACK_MS)) { showLocal("HELP COMING"); return true; }', txt: 'The button retries until the control room acknowledges and then confirms to the sender — reliable, confirmed delivery, not a hopeful one-way send.' },
      { ref: 'void heartbeat()', txt: 'Periodic health beats report the button is alive and its battery level, so the control room can flag a silent or low-battery button for maintenance before it is ever needed.' },
      { ref: 'relayMeshIfNeeded();', txt: 'Each button relays others\' SOS packets, giving the mesh redundant paths so one broken link does not create a coverage dead zone.' },
    ],
  }],

  config: [
    'Set each button\'s ID and human-readable location; configure the control-room gateway/console.',
    'Set retry count/timeout, heartbeat interval, and low-battery/silence thresholds for supervision.',
    'Choose the resilient comms (LoRa mesh / wired bus) and any escalation path (audible, SMS).',
    'Configure alarm latching/acknowledgement and prioritisation at the console.',
  ],
  calibration: [
    { h: 'Delivery reliability', p: [
      'Verify that a press is acknowledged within the timeout across the whole site, including the farthest/most-shadowed buttons; add relays where needed.',
    ] },
    { h: 'Supervision thresholds', p: [
      'Set the heartbeat interval and the silence/low-battery thresholds so a genuinely dead or dying button is flagged promptly without nuisance alarms.',
    ] },
    { h: 'Backup power', p: [
      'Confirm each button keeps working on battery through a simulated mains cut for the required duration.',
    ] },
  ],
  testing: [
    { step: 'Press a button', expect: 'Located alarm at the console within seconds; sender sees "HELP COMING"' },
    { step: 'Block the primary path', expect: 'Mesh relays / escalation still delivers; sender still acknowledged' },
    { step: 'Remove a button\'s battery/mains', expect: 'On battery it still works; total loss is flagged by missing heartbeat' },
    { step: 'Let a button go silent', expect: 'Control room raises a maintenance alarm for that button' },
    { step: 'Low battery', expect: 'Heartbeat reports it; maintenance alarm before it fails' },
    { step: 'Acknowledge at the console', expect: 'Alarm de-latches; sender confirmation stands' },
  ],
  output: [
    'The control-room console shows located, prioritised, latched alarms with button ID/place and time, plus a health view of every button\'s battery and link.',
    { file: 'panic-event.json', lang: 'json', body: `{
  "type": "SOS",
  "button": 12,
  "location": "Block C stairwell",
  "seq": 41,
  "time": "2026-07-27T02:14:55",
  "acknowledged": true
}` },
    'A located SOS from button 12 reaches the console and is acknowledged — the sender is told help is coming, and the event is recorded; a silent or low-battery button would instead appear as a maintenance alarm before any emergency.',
  ],
  troubleshoot: [
    { sym: 'Alarm sometimes not received', cause: 'One-way send / weak single path', fix: 'Use retry+ack and a mesh/redundant path; add relays for shadowed buttons' },
    { sym: 'Dead button discovered during a drill', cause: 'No supervision', fix: 'Add heartbeats and treat silence/low-battery as maintenance alarms' },
    { sym: 'Button disarmed by power cut', cause: 'No backup power', fix: 'Add battery backup and verify battery run-time' },
    { sym: 'Accidental presses', cause: 'Too-easy actuator', fix: 'Use a protected/guarded button that is still easy in a real emergency' },
    { sym: 'Alarm missed at the console', cause: 'Not latched/prioritised', fix: 'Latch until acknowledged; present prominently above routine info' },
  ],

  iot: {
    protoShort: 'LoRa mesh (or wired bus) → control-room console',
    net: {
      nodes: [{ name: 'Panic button', sub: 'ESP32' }, { name: 'Relay buttons', sub: 'mesh peers' }],
      protocol: 'LoRa mesh / bus', gateway: 'Control-room GW', gatewaySub: 'to console',
      uplink: 'MQTT/console', cloud: 'Control room', cloudSub: 'located, latched alarms',
      clients: [{ name: 'Console', sub: 'located alarms' }, { name: 'Responders', sub: 'dispatch' }],
    },
    protocol: ['SOS packets are delivered with retry and acknowledgement and flood the mesh with dedup for resilience; heartbeats supervise health. The local sounder and delivery are independent of any single link.'],
    topics: [
      { t: 'panic/sos', dir: 'button → console', payload: 'located SOS (id, location, seq)' },
      { t: 'panic/ack', dir: 'console → button', payload: 'acknowledgement (seq) → confirms to sender' },
      { t: 'panic/heartbeat', dir: 'button → console', payload: 'battery, link — supervision' },
    ],
    cloud: ['A control-room console presents located, prioritised, latched alarms and lets operators acknowledge them, and maintains a health map that flags any silent or low-battery button for maintenance.'],
    dashboard: ['A site map of buttons with instant located alarms, an alarm queue with acknowledge, and a supervision view of battery/link health per button.'],
    mobile: ['Located SOS alerts and maintenance alerts (silent/low-battery button) to responders and facilities staff.'],
    security: [
      'Authenticate buttons and acknowledgements so alarms cannot be spoofed or falsely acknowledged.',
      'Keep the local sounder and delivery independent of any single link; supervise continuously.',
      'Protect against tamper and ensure backup power so the network cannot be silently disarmed.',
    ],
  },

  perf: [
    'Prioritise latency and delivery certainty over everything — retry with acknowledgement, not fire-and-forget.',
    'Keep the mesh quiet except for heartbeats and alarms so an SOS propagates instantly.',
    'Supervise continuously so the network\'s health is a known fact, not an assumption.',
    'Debounce presses but never delay the alert.',
  ],
  safety: [
    'A panic system is life-safety: engineer for the emergency, supervise so faults are found first, and provide backup power and resilient comms.',
    'Require and surface acknowledgement so the sender knows help is coming.',
    'A DIY network is not a certified, professionally-monitored life-safety system; use a certified installation where regulations or duty of care require one.',
    'Test regularly (drills and self-tests) so the system is provably ready.',
  ],
  maintenance: [
    'Act on every supervision alarm — replace flat batteries and fix silent buttons promptly.',
    'Run periodic end-to-end drills and self-tests across all buttons.',
    'Verify backup-power run-time and comms resilience after any site change.',
    'Keep button locations and the console map accurate as the site evolves.',
  ],
  future: [
    'Add two-way voice/intercom at the button for the control room to talk to the sender.',
    'Add wearable/mobile panic triggers linked into the same network.',
    'Integrate with door locks/lighting/CCTV to guide responders to the location.',
    'Add automatic escalation to external emergency services where appropriate.',
  ],
  faq: [
    { q: 'What makes this different from a button and a buzzer?', a: 'Reliability engineering: located alarms so responders go to the right place, end-to-end acknowledgement so the sender knows help is coming, supervision so dead buttons are found before an emergency, backup power, and a resilient comms path.' },
    { q: 'Why does supervision matter so much?', a: 'A panic network is idle almost always, so a button can quietly die and go unnoticed until it fails in an emergency. Heartbeats let the control room detect a silent or low-battery button and fix it in advance.' },
    { q: 'Why acknowledge back to the sender?', a: 'A one-way send might be lost, leaving a person in danger unsure anyone saw it. Confirming end-to-end reassures the sender and proves the alert actually reached a staffed console.' },
    { q: 'What if the power or a link fails?', a: 'Buttons run on battery backup so a mains cut does not disarm them, and the mesh/redundant path routes around a broken link. Both conditions are also supervised and alarmed.' },
    { q: 'Can this replace a professional alarm system?', a: 'For a campus or community it is a responsive, located, supervised SOS network — but it is not a certified, professionally-monitored life-safety installation. Where regulations or duty of care require one, use a certified system.' },
  ],
  refs: [
    { t: 'Panic alarm / duress systems — overview', u: 'https://en.wikipedia.org/wiki/Panic_button', s: 'Reference' },
    { t: 'Life-safety systems and supervision principles', u: 'https://en.wikipedia.org/wiki/Life_safety_code', s: 'Reference' },
    { t: 'LoRa mesh networking', u: 'https://en.wikipedia.org/wiki/LoRa', s: 'Reference' },
    { t: 'Reliable messaging: retries and acknowledgements', u: 'https://en.wikipedia.org/wiki/Acknowledgement_(data_networks)', s: 'Reference' },
    { t: 'Alarm annunciation and prioritisation', u: 'https://en.wikipedia.org/wiki/Alarm_management', s: 'Reference' },
  ],
  images: ['city', 'esp32', 'cctv'],
  imageCaptions: [
    'SOS points across a campus or society route a located alarm to a staffed control room in seconds.',
    'ESP32 module delivering the alert with retry and acknowledgement and heartbeating its own health.',
    'A control-room console shows located, prioritised, latched alarms and every button\'s battery and link health.',
  ],
},

];
