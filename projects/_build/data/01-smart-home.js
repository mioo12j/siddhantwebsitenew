/* ═══════════════════════════════════════════════════════════════════
   Smart Home — projects 001–014
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ─────────────────────────────────────────────────────────────────
   001 · Smart Door Lock
──────────────────────────────────────────────────────────────────*/
{
  id: '001',
  domainKey: 'iot',
  emoji: '🔐',
  thumb: 'esp32',
  difficulty: 'Intermediate',
  hours: '10–14 hours',
  iso8601: 'PT12H',
  tagline: 'A three-factor entry system — RFID card, keypad PIN, or a phone command over MQTT — driving an electric strike, with every unlock attempt timestamped and pushed to the cloud.',

  overview: [
    'A mechanical lock answers exactly one question: does the person at the door hold a piece of shaped metal? It cannot tell you <em>when</em> the door opened, <em>who</em> opened it, or revoke a key that walked off in someone\'s pocket. This project replaces that single bit of information with an auditable access-control system small enough to fit inside a door frame.',
    'The build centres on an ESP32, which is unusual for a lock: most hobby locks use an Arduino and a servo. The ESP32 earns its place because it does three jobs at once — it runs the 13.56 MHz RFID reader over SPI, scans a membrane keypad, and maintains a persistent TLS-secured MQTT session so an unlock event reaches your phone in under a second. Its second core keeps the network stack from ever stalling the reader loop, which is what makes the card read feel instant rather than laggy.',
    'Credentials are never stored as plain card IDs. Each authorised UID is salted and hashed before it goes into non-volatile storage, so someone who dumps the flash still cannot clone a card from it. That is a small change in code and a large change in what the system is actually worth. The same principle applies to the PIN: it is compared as a hash, and the comparison is written to take constant time so an attacker cannot learn the PIN one digit at a time by measuring how long a rejection takes.',
    'The result is a lock you can reason about. Every attempt — successful or not — produces a log line with a timestamp from NTP, the credential type, and the outcome. Revoking access is a single MQTT message rather than a locksmith visit.',
  ],

  does: [
    'Reads MIFARE Classic 13.56 MHz cards and fobs, and unlocks on a match against a hashed allow-list held in flash.',
    'Accepts a 4–8 digit PIN on a 4×4 membrane keypad as an independent credential, with lockout after repeated failures.',
    'Accepts a remote unlock command published over MQTT, so you can let someone in from anywhere.',
    'Drives a 12 V electric strike through an opto-isolated relay, holding it open for a configurable dwell time.',
    'Timestamps every attempt from NTP and publishes it as a JSON event to the broker.',
    'Enrols and revokes cards over MQTT — no reflashing to add a housemate.',
    'Falls back to local-only operation when the network is down, and replays buffered events when it returns.',
  ],

  features: [
    '<b>Three independent credential paths</b> — RFID, PIN, and remote — any of which can be disabled in configuration.',
    '<b>Salted SHA-256 credential storage</b> in ESP32 NVS, so a flash dump does not yield clonable card IDs.',
    '<b>Constant-time comparison</b> of PIN and card hashes to defeat timing side channels.',
    '<b>Brute-force lockout</b> — five failed attempts in 60 s disables the keypad for five minutes and raises an alert.',
    '<b>Offline event buffer</b> holding the last 64 events in RTC memory so a network outage never loses an audit record.',
    '<b>Fail-secure or fail-safe strike support</b> — a single configuration constant flips the relay polarity for either strike type.',
    '<b>NTP-synchronised timestamps</b> with a DS3231 RTC as backup so events remain ordered without a network.',
    '<b>Manual egress override</b> on a dedicated input, wired so the door always opens from the inside regardless of firmware state.',
  ],

  applications: [
    { t: 'Shared housing', d: 'Give each tenant a fob, revoke it the day they move out, and see exactly who came and went without a key handover.' },
    { t: 'Small office / co-working', d: 'Per-person access logs satisfy basic security-audit requirements at a fraction of the cost of a commercial access-control panel.' },
    { t: 'Laboratory and server rooms', d: 'Restrict entry to a named list and get an immediate alert on any out-of-hours attempt.' },
    { t: 'Rental property turnover', d: 'Remote enrolment means a cleaner or guest can be granted access for a window of time with no physical key exchange.' },
    { t: 'Equipment cabinets', d: 'The same electronics scaled down to a cabinet solenoid controls access to tools, medication or firearms storage.' },
    { t: 'School and hostel blocks', d: 'Curfew logic — the same card that opens the door at 18:00 is refused at 02:00 and the attempt is logged.' },
  ],

  skills: [
    'Basic C++ and the Arduino <code>setup()</code> / <code>loop()</code> model',
    'SPI and how chip-select lines share a bus between devices',
    'Reading a datasheet well enough to find a supply voltage and a logic level',
    'Wiring a relay to switch a load that is on a different supply from the controller',
    'Elementary MQTT — topics, publish, subscribe, retained messages',
    'Enough security literacy to understand why you hash a credential instead of storing it',
  ],

  prereq: [
    'You need an MQTT broker before the networked half of this project does anything. A Mosquitto instance on a Raspberry Pi, or a free HiveMQ Cloud tier, both work — the code targets plain MQTT on port 1883 for the first bring-up and TLS on 8883 once it runs.',
  ],

  parts: ['esp32', 'rc522', 'keypad', 'relay1', 'buck', 'rtc', 'oled', 'buzzer', 'psu12v', 'perfboard', 'enclosure'],
  qty: { rc522: 1, relay1: 1 },
  extraParts: [
    { name: '12 V fail-secure electric door strike', spec: '12 V DC, 350–500 mA holding, ANSI-grade faceplate', qty: 1, price: 1400, note: 'Fail-secure stays locked without power. Choose fail-safe only where fire code demands it.' },
    { name: 'Momentary push button (egress)', spec: 'NO contact, panel-mount 16 mm', qty: 1, price: 60 },
    { name: '1N4007 flyback diode', spec: '1000 V, 1 A rectifier', qty: 2, price: 5, note: 'One across the strike coil, one across the relay coil if the module lacks it.' },
    { name: 'Assorted 22 AWG hookup wire + ferrules', spec: 'Stranded, 5 colours', qty: 1, price: 200 },
  ],
  cost: '₹4,200 – ₹5,400',

  libs: ['wifi', 'pubsub', 'arduinojson', 'mfrc522', 'ssd1306', 'preferences', 'ntp', 'wifimanager'],

  pins: {
    left: [
      { dev: 'MFRC522 RFID reader', devPin: 'SDA / SS', pin: 'GPIO 5', sig: 'SPI chip select' },
      { dev: 'MFRC522 RFID reader', devPin: 'SCK / MOSI / MISO', pin: 'GPIO 18 / 23 / 19', sig: 'SPI bus (3.3 V only)' },
      { dev: 'MFRC522 RFID reader', devPin: 'RST', pin: 'GPIO 27', sig: 'Reader reset' },
      { dev: '4×4 keypad rows', devPin: 'R1–R4', pin: 'GPIO 13 32 33 25', sig: 'Driven low during scan' },
      { dev: '4×4 keypad columns', devPin: 'C1–C4', pin: 'GPIO 26 14 12 4', sig: 'Read with internal pull-up' },
      { dev: 'Egress button', devPin: 'NO contact', pin: 'GPIO 34', sig: 'Input-only, external 10 kΩ pull-up' },
      { dev: 'DS3231 RTC + SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C bus' },
    ],
    right: [
      { dev: 'Relay module → electric strike', devPin: 'IN', pin: 'GPIO 2', sig: 'Active-low, opto-isolated' },
      { dev: 'Piezo buzzer', devPin: '+', pin: 'GPIO 15', sig: 'Feedback tones' },
      { dev: 'Status LED (green/red)', devPin: 'Anode', pin: 'GPIO 16 / 17', sig: 'Through 330 Ω' },
    ],
  },

  wiringNotes: [
    '<b>The RC522 is a 3.3 V part and is not 5 V tolerant.</b> Power it from the ESP32 3V3 pin, never from 5 V. This is the single most common way people destroy this module.',
    'The SPI bus is shared. If you later add an SD card, give it its own chip-select pin and pull both CS lines high at boot before either device is initialised.',
    'GPIO 34–39 on the ESP32 are <b>input only and have no internal pull-ups</b>. The egress button on GPIO 34 therefore needs an external 10 kΩ resistor to 3V3, with the button pulling the pin to ground.',
    'GPIO 12 is a strapping pin — if it is held high at boot the ESP32 selects a 1.8 V flash voltage and will not start. The keypad column driving it must be left floating or low during reset, which it is with the internal pull-up scheme used here.',
    'The strike and the ESP32 share a ground but not a supply. A 12 V 2 A adapter feeds the strike directly and an LM2596 buck converter drops the same 12 V to 5 V for the ESP32. One adapter, two rails, one common ground reference.',
    'Fit a 1N4007 across the strike coil, cathode to the positive terminal. An electric strike is a large inductor; without the diode the collapse spike will weld the relay contacts within weeks.',
    'Route the RFID antenna away from the relay and the strike wiring. A 13.56 MHz reader sitting on top of a switching coil will read intermittently and you will blame the card.',
  ],

  block: {
    columns: [
      { label: 'Credential input', blocks: [{ name: 'MFRC522 reader', sub: '13.56 MHz MIFARE' }, { name: '4×4 keypad', sub: 'PIN entry' }, { name: 'MQTT command', sub: 'remote unlock' }] },
      { label: 'Decision', edge: 'hash + compare', blocks: [{ name: 'ESP32 core 1', sub: 'credential check', highlight: true }, { name: 'NVS allow-list', sub: 'salted SHA-256' }] },
      { label: 'Action', edge: 'unlock signal', blocks: [{ name: 'Relay driver', sub: 'opto-isolated' }, { name: 'OLED + buzzer', sub: 'user feedback' }] },
      { label: 'Audit', edge: 'JSON event', blocks: [{ name: 'ESP32 core 0', sub: 'MQTT client' }, { name: 'Broker + log', sub: 'timestamped' }] },
    ],
  },

  flow: [
    { t: 'Boot: mount NVS, join Wi-Fi, sync NTP', k: 'start' },
    { t: 'Scan keypad and poll RFID reader', k: 'proc' },
    { t: 'Credential presented?', k: 'dec', yes: 'yes', no: 'idle', back: 1 },
    { t: 'Hash credential with stored salt', k: 'proc' },
    { t: 'Match in allow-list?', k: 'dec', yes: 'granted', no: 'denied → log + lockout counter', back: 1 },
    { t: 'Energise strike for dwell time', k: 'io' },
    { t: 'Publish JSON audit event over MQTT', k: 'io' },
    { t: 'Re-lock and return to scanning', k: 'end' },
  ],

  layers: [
    { name: 'Hardware', items: ['ESP32-WROOM-32', 'MFRC522', '4×4 keypad', '12 V strike + relay', 'DS3231'], highlight: true },
    { name: 'Driver layer', items: ['SPI (RFID)', 'GPIO matrix scan', 'I²C (RTC, OLED)', 'PWM (buzzer)'] },
    { name: 'Security layer', items: ['mbedTLS SHA-256', 'per-device salt in NVS', 'constant-time compare', 'lockout state machine'] },
    { name: 'Transport layer', items: ['Wi-Fi station', 'MQTT over TLS 8883', 'NTP', 'exponential reconnect backoff'] },
    { name: 'Presentation', items: ['OLED status', 'phone notification', 'Grafana access log'] },
  ],

  principle: [
    'The RFID half rests on <b>inductive coupling</b>. The MFRC522 drives its antenna coil at 13.56 MHz, creating an alternating magnetic field. A passive MIFARE card holds a coil of its own; when it enters the field, that coil develops enough induced voltage to power the chip inside it — the card has no battery. The card then replies by <b>load modulation</b>: it switches a resistance across its own coil, which the reader detects as a tiny change in the current drawn by its own antenna. That is the entire physical layer, and it is why range is measured in centimetres rather than metres.',
    'What comes back is a UID — typically four or seven bytes. It is important to understand what a UID is and is not. It is a serial number, not a secret; a MIFARE Classic UID is readable by any phone with NFC and cloneable onto blank "magic" cards for a few rupees. This project therefore treats the UID as an <em>identifier</em>, and treats possession of the physical card as the actual factor. If you need genuine cryptographic authentication, the same reader supports MIFARE DESFire, which performs a challenge-response using a key that never crosses the air gap.',
    'The keypad works on a completely different principle: <b>matrix scanning</b>. Sixteen keys would need sixteen GPIO if wired individually. Instead they sit at the intersections of four row lines and four column lines. The firmware drives one row low at a time and reads all four columns; if a column reads low, the key at that intersection is pressed. A full scan of the 4×4 matrix takes about 40 µs, so scanning at 200 Hz costs less than 1 % of the CPU while feeling instantaneous. Contacts bounce for 5–15 ms, so a key is only accepted once it has read the same state across two scans 20 ms apart.',
    'The security model is where this differs from a typical tutorial build. A credential is never stored or compared in the clear. At enrolment the firmware generates a 16-byte random salt (once per device, kept in NVS), appends it to the credential, hashes the result with SHA-256 from the ESP32\'s bundled mbedTLS, and stores only the 32-byte digest. At verification it repeats the operation and compares digests <b>byte by byte without early exit</b>. A naive <code>memcmp</code> returns as soon as it finds a difference, so a rejected guess that shares the first byte takes measurably longer than one that does not — over enough attempts that leaks the secret. The constant-time loop XORs every byte and ORs the results, so the timing is identical whatever the input.',
    'Finally, the relay. The ESP32 cannot switch 12 V at 500 mA, and more importantly you do not want the strike\'s inductive kick anywhere near the microcontroller. The opto-isolated relay module breaks the electrical path entirely: the GPIO drives an LED inside an optocoupler, light crosses an air gap, and a phototransistor on the far side switches the relay coil from a separate supply. The two halves share no copper, so a spike on the strike side cannot reach the ESP32 at all.',
  ],

  equations: [
    { t: 'Lockout back-off', eq: 'lockout_seconds = base × 2^(failures − threshold)\n\nbase       = 30 s\nthreshold  = 5 failed attempts inside 60 s\n\nfailures =  5 →   30 s\nfailures =  6 →   60 s\nfailures =  7 →  120 s\nfailures =  8 →  240 s   (capped at 900 s)', d: 'Exponential back-off makes online brute force useless: guessing a 4-digit PIN needs 10 000 attempts, and after the eighth failure each further guess costs a quarter of an hour.' },
    { t: 'Strike power and relay margin', eq: 'Strike holding current  I  = 0.45 A at 12 V\nPower                   P  = 12 V × 0.45 A = 5.4 W\nRelay contact rating       = 10 A @ 30 VDC\nUtilisation                = 0.45 / 10 = 4.5 %\n\nInrush (coil energising) ≈ 3 × I = 1.35 A for ~20 ms', d: 'The relay is enormously over-specified for the load, which is exactly what you want — contact life is dominated by inrush, and running at under 5 % of rating means the contacts will outlast the strike.' },
  ],

  assembly: [
    { h: 'Bench-test every module on its own', p: ['Before anything is soldered, wire the RC522 to the ESP32 on a breadboard and run the library\'s <code>DumpInfo</code> example. You should see a UID printed when you tap a card. Do the same for the OLED with an I²C scanner, and the keypad with a sketch that prints the pressed key. Fixing one module at a time takes an hour; debugging five at once takes a weekend.'] },
    { h: 'Set the buck converter before it powers anything', p: ['Connect the LM2596 input to the 12 V adapter with nothing on the output. Measure the output with a multimeter and turn the trimmer until it reads 5.00 V. Only then connect the ESP32.'], warn: 'A buck converter shipped from the factory can be set anywhere between 1.25 V and 37 V. Connecting an ESP32 to an unadjusted module is how people destroy a board in the first thirty seconds.' },
    { h: 'Build the low-voltage side on perfboard', p: ['Solder female headers for the ESP32 rather than the board itself, so it can be swapped without desoldering. Run a solid ground pour or at least a heavy ground bus — the RFID reader is sensitive to a noisy ground.', 'Keep the SPI runs to the RC522 under 10 cm. At 4 MHz on flying leads, longer than that starts producing intermittent read failures that look exactly like a faulty card.'] },
    { h: 'Wire the mains-free 12 V side', p: ['The strike, its flyback diode, and the relay common/NO contacts form a simple series loop with the 12 V supply. Confirm the loop with a continuity test <em>before</em> connecting the adapter, then energise the relay manually by shorting the module IN pin to ground and listen for the strike to click.'], warn: 'Fit the 1N4007 with its stripe (cathode) toward the +12 V side. Backwards, it short-circuits the supply the moment you power up.' },
    { h: 'Mount the reader and keypad on the outside face', p: ['The RC522 antenna must sit behind a non-metallic panel — ABS, acrylic and wood are all fine, aluminium is not. Keep at least 30 mm between the antenna and any steel in the door frame or the read range collapses.'] },
    { h: 'Install the egress button on the inside', p: ['Wire it in parallel with the relay contacts, not into the ESP32 only. This is deliberate: even if the firmware crashes or the ESP32 loses power, pressing the button still releases the strike. A lock that can trap someone inside because of a software fault is not an acceptable design.'], warn: 'Check your local fire regulations. In many jurisdictions an occupied room must be openable from the inside without electrical power, which makes the parallel-wired egress button mandatory rather than optional.' },
    { h: 'Close it up with strain relief', p: ['Use cable glands into the IP65 enclosure, leave a drip loop on any cable that runs downward, and secure the internal wiring so nothing rests against the buck converter\'s inductor, which gets warm.'] },
  ],

  steps: [
    {
      h: 'Get the RFID reader talking',
      p: ['Install the MFRC522 library, open the <code>DumpInfo</code> example, and set the SS and RST pins to 5 and 27. Upload and tap a card. A working reader prints a card UID and a sector dump; a reader that prints <code>WARNING: Communication failure</code> is almost always mis-wired SPI or being fed 5 V.'],
      code: {
        file: '01-rfid-check.ino', lang: 'cpp',
        body: `#include <SPI.h>
#include <MFRC522.h>

#define RC522_SS   5
#define RC522_RST  27

MFRC522 rfid(RC522_SS, RC522_RST);

void setup() {
  Serial.begin(115200);
  SPI.begin();                 // SCK 18, MISO 19, MOSI 23 on ESP32
  rfid.PCD_Init();
  delay(50);

  // Version 0x91/0x92 = genuine MFRC522. 0x00 or 0xFF means the reader
  // is not responding at all — check wiring and that VCC is 3.3 V.
  byte v = rfid.PCD_ReadRegister(MFRC522::VersionReg);
  Serial.printf("MFRC522 version: 0x%02X\\n", v);
  if (v == 0x00 || v == 0xFF) Serial.println("!! Reader not detected");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  Serial.print("UID:");
  for (byte i = 0; i < rfid.uid.size; i++)
    Serial.printf(" %02X", rfid.uid.uidByte[i]);
  Serial.println();

  rfid.PICC_HaltA();           // stop talking to this card
  rfid.PCD_StopCrypto1();      // and clear the crypto state machine
}`,
        explain: [
          { ref: 'PCD_ReadRegister', txt: 'Reading the version register is the fastest possible go/no-go test. A real MFRC522 answers 0x91 or 0x92; a dead SPI link reads back all-zeros or all-ones because nothing is driving MISO.' },
          { ref: 'PICC_IsNewCardPresent', txt: 'Sends a REQA command and listens for an ATQA response. It returns false almost instantly when no card is in the field, so it is cheap to poll every loop.' },
          { ref: 'PICC_HaltA / PCD_StopCrypto1', txt: 'Omitting these two calls is the classic bug: the card stays selected, so the same tap is never seen again until you remove and re-present it.' },
        ],
      },
      tip: 'Write down the UIDs of every card you intend to authorise now — you will need them for enrolment in step 3.',
    },
    {
      h: 'Add the keypad with proper debouncing',
      p: ['Rather than pulling in a keypad library, the scan is written out explicitly here — it is fifteen lines and it makes the debouncing behaviour visible instead of hidden.'],
      code: {
        file: '02-keypad-scan.ino', lang: 'cpp',
        body: `const uint8_t ROWS[4] = {13, 32, 33, 25};
const uint8_t COLS[4] = {26, 14, 12, 4};
const char KEYMAP[4][4] = {
  {'1','2','3','A'}, {'4','5','6','B'},
  {'7','8','9','C'}, {'*','0','#','D'}
};

void keypadBegin() {
  for (uint8_t r = 0; r < 4; r++) { pinMode(ROWS[r], OUTPUT); digitalWrite(ROWS[r], HIGH); }
  for (uint8_t c = 0; c < 4; c++) pinMode(COLS[c], INPUT_PULLUP);
}

// Returns 0 when nothing new is pressed, otherwise the key character.
char keypadRead() {
  static char lastKey = 0;
  static uint32_t lastChange = 0;
  char found = 0;

  for (uint8_t r = 0; r < 4 && !found; r++) {
    digitalWrite(ROWS[r], LOW);            // drive this row low
    delayMicroseconds(5);                  // let the line settle
    for (uint8_t c = 0; c < 4; c++)
      if (digitalRead(COLS[c]) == LOW) { found = KEYMAP[r][c]; break; }
    digitalWrite(ROWS[r], HIGH);           // release before the next row
  }

  uint32_t now = millis();
  if (found != lastKey) { lastKey = found; lastChange = now; return 0; }
  if (found && now - lastChange > 25 && now - lastChange < 40) return found;
  return 0;                                // held keys do not auto-repeat
}`,
        explain: [
          { ref: 'INPUT_PULLUP on columns', txt: 'Columns idle high. Driving one row low pulls only the column of a pressed key in that row down, so a low column read uniquely identifies the intersection.' },
          { ref: 'delayMicroseconds(5)', txt: 'The membrane and the wiring have real capacitance. Without this settle time the first column read after switching rows occasionally catches the old level.' },
          { ref: 'now - lastChange > 25 && < 40', txt: 'The key must have read the same for 25 ms (past the bounce window) but the report fires only once inside a 15 ms slot, which is what stops a held key from repeating.' },
          { ref: 'digitalWrite(ROWS[r], HIGH)', txt: 'Every row is released before the next is driven. Two rows low at once shorts them together through a pressed key and produces phantom key reports.' },
        ],
      },
    },
    {
      h: 'Hash and store credentials in NVS',
      p: ['Enrolment is a one-time operation per credential. The device generates its salt on first boot using the ESP32 hardware RNG, then stores only digests.'],
      code: {
        file: '03-credential-store.ino', lang: 'cpp',
        body: `#include <Preferences.h>
#include <mbedtls/sha256.h>
#include <esp_random.h>

Preferences prefs;
uint8_t deviceSalt[16];

void saltBegin() {
  prefs.begin("lock", false);
  if (prefs.getBytesLength("salt") != sizeof(deviceSalt)) {
    esp_fill_random(deviceSalt, sizeof(deviceSalt));   // hardware RNG
    prefs.putBytes("salt", deviceSalt, sizeof(deviceSalt));
    Serial.println("Generated a new device salt");
  } else {
    prefs.getBytes("salt", deviceSalt, sizeof(deviceSalt));
  }
}

// digest = SHA-256(salt || credential)
void hashCredential(const uint8_t *cred, size_t len, uint8_t out[32]) {
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts(&ctx, 0);          // 0 = SHA-256, not SHA-224
  mbedtls_sha256_update(&ctx, deviceSalt, sizeof(deviceSalt));
  mbedtls_sha256_update(&ctx, cred, len);
  mbedtls_sha256_finish(&ctx, out);
  mbedtls_sha256_free(&ctx);
}

// Comparison that always touches all 32 bytes, whatever the input.
bool constantTimeEqual(const uint8_t *a, const uint8_t *b, size_t n) {
  uint8_t diff = 0;
  for (size_t i = 0; i < n; i++) diff |= (uint8_t)(a[i] ^ b[i]);
  return diff == 0;
}

bool credentialAllowed(const uint8_t *cred, size_t len) {
  uint8_t digest[32];
  hashCredential(cred, len, digest);

  uint8_t count = prefs.getUChar("n", 0);
  uint8_t stored[32];
  bool match = false;
  for (uint8_t i = 0; i < count; i++) {                // no early break —
    char key[8]; snprintf(key, sizeof(key), "c%u", i); // scan every slot so
    if (prefs.getBytes(key, stored, 32) == 32)         // timing does not
      match |= constantTimeEqual(digest, stored, 32);  // reveal position
  }
  return match;
}

bool enrolCredential(const uint8_t *cred, size_t len) {
  uint8_t count = prefs.getUChar("n", 0);
  if (count >= 32) return false;                        // slot limit
  uint8_t digest[32];
  hashCredential(cred, len, digest);
  char key[8]; snprintf(key, sizeof(key), "c%u", count);
  prefs.putBytes(key, digest, 32);
  prefs.putUChar("n", count + 1);
  return true;
}`,
        explain: [
          { ref: 'esp_fill_random', txt: 'Uses the ESP32 hardware entropy source. Never seed a salt from millis() or a fixed constant — a predictable salt makes the hash no better than storing the raw UID.' },
          { ref: 'salt || credential', txt: 'The salt means two devices holding the same card produce different digests, so a stolen digest from one lock cannot be replayed against another.' },
          { ref: 'match |= ... (no break)', txt: 'The loop deliberately continues after a match. Breaking early would make a valid card in slot 0 verify faster than one in slot 30, which leaks how many credentials are enrolled and where.' },
          { ref: 'Preferences / NVS', txt: 'NVS is wear-levelled flash. It survives reboots and reflashing the sketch, which is what you want — you do not lose the allow-list every time you tweak the code.' },
        ],
      },
      tip: 'To wipe every credential during development, call <code>prefs.clear()</code> once from setup, upload, run, then remove the line and upload again.',
    },
    {
      h: 'Drive the strike safely',
      p: ['A single function owns the relay so the dwell time and the fail-secure polarity live in exactly one place. Everything else calls <code>unlock()</code> and forgets about the hardware.'],
      code: {
        file: '04-strike-control.ino', lang: 'cpp',
        body: `#define PIN_RELAY      2
#define RELAY_ACTIVE_LOW  true    // most opto modules are active-low
#define UNLOCK_MS      4000       // how long the strike stays released

static uint32_t unlockUntil = 0;

void strikeBegin() {
  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? HIGH : LOW);  // locked
}

void unlock(uint32_t ms = UNLOCK_MS) {
  digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? LOW : HIGH);
  unlockUntil = millis() + ms;
}

// Called every loop; never blocks.
void strikeService() {
  if (unlockUntil && (int32_t)(millis() - unlockUntil) >= 0) {
    digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? HIGH : LOW);
    unlockUntil = 0;
  }
}`,
        explain: [
          { ref: 'digitalWrite before pinMode', txt: 'Order matters here. The pin is configured to the locked level in strikeBegin() so the strike never twitches during boot — an ESP32 GPIO floats for a few milliseconds after reset.' },
          { ref: '(int32_t)(millis() - unlockUntil) >= 0', txt: 'Signed subtraction is the rollover-safe way to compare millis() values. A plain `millis() > unlockUntil` breaks once every 49.7 days when the counter wraps.' },
          { ref: 'strikeService()', txt: 'Non-blocking by design. Using delay(4000) here would freeze the RFID reader, the keypad and the MQTT keep-alive for four seconds after every unlock.' },
        ],
      },
    },
    {
      h: 'Publish the audit trail',
      p: ['Every decision produces one JSON message. Keeping the schema flat and stable means a dashboard written today still parses events from firmware you write next year.'],
      code: {
        file: '05-audit-event.ino', lang: 'cpp',
        body: `#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <time.h>

extern PubSubClient mqtt;
const char *TOPIC_EVENT = "home/door/front/event";

void publishEvent(const char *method, const char *result, const char *who) {
  JsonDocument doc;                       // ArduinoJson 7: sizes itself
  doc["ts"]     = (uint32_t)time(nullptr);  // seconds since epoch, NTP-set
  doc["device"] = "front-door";
  doc["method"] = method;                   // "rfid" | "pin" | "remote" | "egress"
  doc["result"] = result;                   // "granted" | "denied" | "lockout"
  doc["who"]    = who;                      // short label, never the credential
  doc["rssi"]   = WiFi.RSSI();

  char buf[192];
  size_t n = serializeJson(doc, buf, sizeof(buf));

  // retain=false: an access event is a fact about a moment, not a state.
  if (!mqtt.publish(TOPIC_EVENT, (const uint8_t *)buf, n, false))
    bufferOffline(buf, n);                 // keep it for the next reconnect
}`,
        explain: [
          { ref: 'doc["who"]', txt: 'Carries a human label such as "fob-3" or "pin-user-2", never the UID or the PIN. Audit logs get shipped to dashboards and screenshotted into group chats; keep credentials out of them.' },
          { ref: 'retain = false', txt: 'A retained message is delivered to every future subscriber, so a retained unlock event would announce the last entry to anyone who connects later. Events are not state.' },
          { ref: 'bufferOffline()', txt: 'MQTT publish returns false when the socket is down. Rather than dropping the record, it goes into an RTC-memory ring buffer that survives deep sleep and is drained on reconnect.' },
        ],
      },
    },
  ],

  code: [
    {
      file: 'smart-door-lock.ino', lang: 'cpp',
      body: `/* ═══════════════════════════════════════════════════════════════
   Smart Door Lock — ESP32 + MFRC522 + 4x4 keypad + MQTT audit trail

   Credentials are stored as salted SHA-256 digests in NVS and compared
   in constant time. The strike is driven through an opto-isolated
   relay from a separate 12 V rail; the inside egress button is also
   wired in parallel with the relay contacts in hardware, so the door
   always opens from inside even if this firmware is dead.

   Board: ESP32 Dev Module        Monitor: 115200 baud
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include <mbedtls/sha256.h>
#include <esp_random.h>
#include <time.h>

/* ── configuration ──────────────────────────────────────────── */
#define WIFI_SSID      "YOUR_WIFI"
#define WIFI_PASS      "YOUR_PASSWORD"
#define MQTT_HOST      "192.168.1.50"
#define MQTT_PORT      1883
#define MQTT_USER      "door"
#define MQTT_PASS      "change-me"
#define DEVICE_ID      "front-door"

#define PIN_RC522_SS   5
#define PIN_RC522_RST  27
#define PIN_RELAY      2
#define PIN_BUZZER     15
#define PIN_LED_OK     16
#define PIN_LED_NO     17
#define PIN_EGRESS     34            // input-only pin, external pull-up

#define RELAY_ACTIVE_LOW  true
#define UNLOCK_MS      4000
#define PIN_MIN_LEN    4
#define PIN_MAX_LEN    8
#define FAIL_THRESHOLD 5             // failures inside FAIL_WINDOW_MS
#define FAIL_WINDOW_MS 60000UL
#define LOCKOUT_BASE_S 30

const uint8_t ROWS[4] = {13, 32, 33, 25};
const uint8_t COLS[4] = {26, 14, 12, 4};
const char KEYMAP[4][4] = {
  {'1','2','3','A'}, {'4','5','6','B'},
  {'7','8','9','C'}, {'*','0','#','D'}
};

const char *T_EVENT  = "home/door/" DEVICE_ID "/event";
const char *T_CMD    = "home/door/" DEVICE_ID "/cmd";
const char *T_STATUS = "home/door/" DEVICE_ID "/status";

/* ── globals ────────────────────────────────────────────────── */
WiFiClient      net;
PubSubClient    mqtt(net);
MFRC522         rfid(PIN_RC522_SS, PIN_RC522_RST);
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
Preferences     prefs;

uint8_t  deviceSalt[16];
char     pinBuf[PIN_MAX_LEN + 1];
uint8_t  pinLen        = 0;
uint32_t unlockUntil   = 0;
uint32_t lockoutUntil  = 0;
uint8_t  failCount     = 0;
uint32_t failWindowEnd = 0;
uint32_t lastMqttTry   = 0;

/* offline event ring buffer survives brown-outs and deep sleep */
RTC_DATA_ATTR char     evtRing[8][192];
RTC_DATA_ATTR uint8_t  evtHead = 0, evtCount = 0;

/* ── credential storage ─────────────────────────────────────── */
void saltBegin() {
  prefs.begin("lock", false);
  if (prefs.getBytesLength("salt") != sizeof(deviceSalt)) {
    esp_fill_random(deviceSalt, sizeof(deviceSalt));
    prefs.putBytes("salt", deviceSalt, sizeof(deviceSalt));
  } else {
    prefs.getBytes("salt", deviceSalt, sizeof(deviceSalt));
  }
}

void hashCredential(const uint8_t *cred, size_t len, uint8_t out[32]) {
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts(&ctx, 0);
  mbedtls_sha256_update(&ctx, deviceSalt, sizeof(deviceSalt));
  mbedtls_sha256_update(&ctx, cred, len);
  mbedtls_sha256_finish(&ctx, out);
  mbedtls_sha256_free(&ctx);
}

bool constantTimeEqual(const uint8_t *a, const uint8_t *b, size_t n) {
  uint8_t diff = 0;
  for (size_t i = 0; i < n; i++) diff |= (uint8_t)(a[i] ^ b[i]);
  return diff == 0;
}

bool credentialAllowed(const uint8_t *cred, size_t len) {
  uint8_t digest[32], stored[32];
  hashCredential(cred, len, digest);
  uint8_t count = prefs.getUChar("n", 0);
  bool match = false;
  for (uint8_t i = 0; i < count; i++) {
    char key[8]; snprintf(key, sizeof(key), "c%u", i);
    if (prefs.getBytes(key, stored, 32) == 32)
      match |= constantTimeEqual(digest, stored, 32);
  }
  return match;
}

bool enrolCredential(const uint8_t *cred, size_t len) {
  uint8_t count = prefs.getUChar("n", 0);
  if (count >= 32) return false;
  uint8_t digest[32];
  hashCredential(cred, len, digest);
  char key[8]; snprintf(key, sizeof(key), "c%u", count);
  prefs.putBytes(key, digest, 32);
  prefs.putUChar("n", count + 1);
  return true;
}

/* ── feedback ───────────────────────────────────────────────── */
void beep(uint16_t freq, uint16_t ms) {
  tone(PIN_BUZZER, freq, ms);
}

void showLine(const char *a, const char *b) {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(1);
  oled.setCursor(0, 0);  oled.println(DEVICE_ID);
  oled.setTextSize(2);
  oled.setCursor(0, 20); oled.println(a);
  oled.setTextSize(1);
  oled.setCursor(0, 50); oled.println(b);
  oled.display();
}

/* ── strike ─────────────────────────────────────────────────── */
void strikeBegin() {
  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? HIGH : LOW);
}

void unlock(uint32_t ms = UNLOCK_MS) {
  digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? LOW : HIGH);
  unlockUntil = millis() + ms;
  digitalWrite(PIN_LED_OK, HIGH);
  beep(2200, 120);
  showLine("UNLOCKED", "welcome");
}

void strikeService() {
  if (unlockUntil && (int32_t)(millis() - unlockUntil) >= 0) {
    digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? HIGH : LOW);
    digitalWrite(PIN_LED_OK, LOW);
    unlockUntil = 0;
    showLine("LOCKED", "tap card or enter PIN");
  }
}

/* ── audit events ───────────────────────────────────────────── */
void bufferOffline(const char *json, size_t n) {
  if (n >= sizeof(evtRing[0])) return;
  memcpy(evtRing[evtHead], json, n);
  evtRing[evtHead][n] = 0;
  evtHead = (evtHead + 1) % 8;
  if (evtCount < 8) evtCount++;
}

void flushOffline() {
  while (evtCount && mqtt.connected()) {
    uint8_t idx = (evtHead + 8 - evtCount) % 8;
    if (!mqtt.publish(T_EVENT, evtRing[idx])) break;
    evtCount--;
  }
}

void publishEvent(const char *method, const char *result, const char *who) {
  JsonDocument doc;
  doc["ts"]     = (uint32_t)time(nullptr);
  doc["device"] = DEVICE_ID;
  doc["method"] = method;
  doc["result"] = result;
  doc["who"]    = who;
  doc["rssi"]   = WiFi.RSSI();

  char buf[192];
  size_t n = serializeJson(doc, buf, sizeof(buf));
  Serial.println(buf);
  if (!mqtt.connected() || !mqtt.publish(T_EVENT, (const uint8_t *)buf, n, false))
    bufferOffline(buf, n);
}

/* ── lockout ────────────────────────────────────────────────── */
bool lockedOut() {
  return lockoutUntil && (int32_t)(millis() - lockoutUntil) < 0;
}

void registerFailure() {
  uint32_t now = millis();
  if (!failWindowEnd || (int32_t)(now - failWindowEnd) >= 0) {
    failCount = 0;
    failWindowEnd = now + FAIL_WINDOW_MS;
  }
  failCount++;
  if (failCount >= FAIL_THRESHOLD) {
    uint32_t secs = LOCKOUT_BASE_S << (failCount - FAIL_THRESHOLD);
    if (secs > 900) secs = 900;
    lockoutUntil = now + secs * 1000UL;
    publishEvent("system", "lockout", "brute-force");
    char msg[24]; snprintf(msg, sizeof(msg), "wait %lus", (unsigned long)secs);
    showLine("LOCKED OUT", msg);
  }
}

/* ── keypad ─────────────────────────────────────────────────── */
void keypadBegin() {
  for (uint8_t r = 0; r < 4; r++) { pinMode(ROWS[r], OUTPUT); digitalWrite(ROWS[r], HIGH); }
  for (uint8_t c = 0; c < 4; c++) pinMode(COLS[c], INPUT_PULLUP);
}

char keypadRead() {
  static char lastKey = 0;
  static uint32_t lastChange = 0;
  char found = 0;
  for (uint8_t r = 0; r < 4 && !found; r++) {
    digitalWrite(ROWS[r], LOW);
    delayMicroseconds(5);
    for (uint8_t c = 0; c < 4; c++)
      if (digitalRead(COLS[c]) == LOW) { found = KEYMAP[r][c]; break; }
    digitalWrite(ROWS[r], HIGH);
  }
  uint32_t now = millis();
  if (found != lastKey) { lastKey = found; lastChange = now; return 0; }
  if (found && now - lastChange > 25 && now - lastChange < 40) return found;
  return 0;
}

void handleKey(char k) {
  if (lockedOut()) { beep(300, 200); return; }
  beep(1600, 30);

  if (k == '*') { pinLen = 0; showLine("PIN", "cleared"); return; }

  if (k == '#') {
    if (pinLen < PIN_MIN_LEN) { pinLen = 0; showLine("PIN", "too short"); return; }
    pinBuf[pinLen] = 0;
    if (credentialAllowed((const uint8_t *)pinBuf, pinLen)) {
      publishEvent("pin", "granted", "keypad");
      unlock();
      failCount = 0;
    } else {
      publishEvent("pin", "denied", "keypad");
      digitalWrite(PIN_LED_NO, HIGH); beep(400, 350);
      showLine("DENIED", "wrong PIN");
      delay(250); digitalWrite(PIN_LED_NO, LOW);
      registerFailure();
    }
    memset(pinBuf, 0, sizeof(pinBuf));   // do not leave the PIN in RAM
    pinLen = 0;
    return;
  }

  if (k >= '0' && k <= '9' && pinLen < PIN_MAX_LEN) {
    pinBuf[pinLen++] = k;
    char mask[PIN_MAX_LEN + 1];
    memset(mask, '*', pinLen); mask[pinLen] = 0;
    showLine(mask, "# to submit");
  }
}

/* ── RFID ───────────────────────────────────────────────────── */
void handleCard() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  if (lockedOut()) {
    publishEvent("rfid", "lockout", "card");
    beep(300, 200);
  } else if (credentialAllowed(rfid.uid.uidByte, rfid.uid.size)) {
    publishEvent("rfid", "granted", "card");
    unlock();
    failCount = 0;
  } else {
    publishEvent("rfid", "denied", "unknown-card");
    digitalWrite(PIN_LED_NO, HIGH); beep(400, 350);
    showLine("DENIED", "unknown card");
    delay(250); digitalWrite(PIN_LED_NO, LOW);
    registerFailure();
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

/* ── MQTT ───────────────────────────────────────────────────── */
void onMessage(char *topic, byte *payload, unsigned int len) {
  JsonDocument doc;
  if (deserializeJson(doc, payload, len)) return;

  const char *action = doc["action"] | "";

  if (!strcmp(action, "unlock")) {
    publishEvent("remote", "granted", doc["by"] | "remote");
    unlock(doc["ms"] | UNLOCK_MS);
  } else if (!strcmp(action, "enrol_pin")) {
    const char *p = doc["pin"] | "";
    if (strlen(p) >= PIN_MIN_LEN && enrolCredential((const uint8_t *)p, strlen(p)))
      publishEvent("admin", "granted", "pin-enrolled");
  } else if (!strcmp(action, "wipe")) {
    prefs.clear(); saltBegin();
    publishEvent("admin", "granted", "credentials-wiped");
  }
}

void mqttConnect() {
  if (mqtt.connected() || millis() - lastMqttTry < 5000) return;
  lastMqttTry = millis();
  if (mqtt.connect(DEVICE_ID, MQTT_USER, MQTT_PASS, T_STATUS, 0, true, "offline")) {
    mqtt.publish(T_STATUS, "online", true);   // retained: this IS state
    mqtt.subscribe(T_CMD);
    flushOffline();
  }
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED_OK, OUTPUT);
  pinMode(PIN_LED_NO, OUTPUT);
  pinMode(PIN_EGRESS, INPUT);
  strikeBegin();
  keypadBegin();

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  showLine("BOOT", "starting up");

  SPI.begin();
  rfid.PCD_Init();
  saltBegin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);

  configTime(19800, 0, "pool.ntp.org", "time.google.com");   // IST = UTC+5:30
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  mqtt.setCallback(onMessage);
  mqtt.setBufferSize(512);

  showLine("LOCKED", "tap card or enter PIN");
  Serial.println("Smart door lock ready");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) WiFi.reconnect();
  mqttConnect();
  mqtt.loop();

  handleCard();
  char k = keypadRead();
  if (k) handleKey(k);

  if (digitalRead(PIN_EGRESS) == LOW) {     // inside button, active-low
    publishEvent("egress", "granted", "inside-button");
    unlock();
    while (digitalRead(PIN_EGRESS) == LOW) delay(10);
  }

  strikeService();
}`,
      explain: [
        { ref: 'RTC_DATA_ATTR evtRing', txt: 'Variables marked RTC_DATA_ATTR live in the 8 KB RTC slow memory, which keeps its contents through deep sleep and a soft reset. That is what lets buffered audit events survive a brown-out.' },
        { ref: 'mqtt.connect(..., T_STATUS, 0, true, "offline")', txt: 'This registers a Last Will and Testament. If the device dies without a clean disconnect, the broker publishes "offline" to the status topic on its behalf — so a dashboard can tell "no events" apart from "device is dead".' },
        { ref: 'memset(pinBuf, 0, ...)', txt: 'The entered PIN is wiped from RAM immediately after comparison. It is a small thing, but it means a crash dump or a later heap read cannot recover it.' },
        { ref: 'configTime(19800, 0, ...)', txt: '19800 seconds is UTC+5:30 for Indian Standard Time. Timestamps must be absolute, not uptime-relative, or the audit log is worthless once the device reboots.' },
        { ref: 'while (digitalRead(PIN_EGRESS) == LOW)', txt: 'Waits for the egress button to be released so one press produces one event. This is the only intentional blocking wait in the loop, and it is bounded by a human finger.' },
        { ref: 'mqtt.setBufferSize(512)', txt: 'PubSubClient defaults to a 256-byte buffer, which silently drops larger publishes. Raising it is essential once JSON payloads carry more than a few fields.' },
      ],
    },
    {
      file: 'enrol-card.py', lang: 'python',
      body: `#!/usr/bin/env python3
"""Enrol or revoke a door credential over MQTT.

    python3 enrol-card.py --broker 192.168.1.50 --pin 481902
    python3 enrol-card.py --broker 192.168.1.50 --unlock
    python3 enrol-card.py --broker 192.168.1.50 --watch
"""
import argparse
import json
import time

import paho.mqtt.client as mqtt

DEVICE = "front-door"
T_CMD = f"home/door/{DEVICE}/cmd"
T_EVENT = f"home/door/{DEVICE}/event"


def on_event(_client, _userdata, msg):
    e = json.loads(msg.payload)
    when = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(e["ts"]))
    icon = {"granted": "OK ", "denied": "NO ", "lockout": "!! "}.get(e["result"], "   ")
    print(f'{icon}{when}  {e["method"]:<7} {e["result"]:<8} {e.get("who","")}')


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--broker", required=True)
    ap.add_argument("--port", type=int, default=1883)
    ap.add_argument("--user", default="door")
    ap.add_argument("--password", default="change-me")
    ap.add_argument("--pin", help="enrol this PIN as a new credential")
    ap.add_argument("--unlock", action="store_true", help="release the strike now")
    ap.add_argument("--wipe", action="store_true", help="erase every credential")
    ap.add_argument("--watch", action="store_true", help="stream the audit log")
    args = ap.parse_args()

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(args.user, args.password)
    client.connect(args.broker, args.port, 60)

    if args.pin:
        client.publish(T_CMD, json.dumps({"action": "enrol_pin", "pin": args.pin}), qos=1)
        print(f"enrolled PIN of length {len(args.pin)}")
    if args.unlock:
        client.publish(T_CMD, json.dumps({"action": "unlock", "by": "cli"}), qos=1)
        print("unlock command sent")
    if args.wipe:
        if input("wipe ALL credentials? type YES: ") == "YES":
            client.publish(T_CMD, json.dumps({"action": "wipe"}), qos=1)

    if args.watch:
        client.on_message = on_event
        client.subscribe(T_EVENT, qos=1)
        print(f"watching {T_EVENT} — Ctrl-C to stop")
        client.loop_forever()
    else:
        client.loop(timeout=2.0)
        client.disconnect()


if __name__ == "__main__":
    main()`,
      explain: [
        { ref: 'CallbackAPIVersion.VERSION2', txt: 'paho-mqtt 2.x requires this argument explicitly. Code written for paho 1.x raises a TypeError on 2.x, which is the most common breakage in older tutorials.' },
        { ref: 'qos=1', txt: 'At-least-once delivery. A command that quietly vanishes because the broker was momentarily busy is much worse than one delivered twice — the firmware treats repeat unlocks as idempotent.' },
        { ref: 'input("wipe ALL credentials?")', txt: 'A deliberate speed bump. The wipe command is unrecoverable and there is no undo, so it should never be a single keystroke away.' },
      ],
    },
  ],

  config: [
    'Set <code>WIFI_SSID</code>, <code>WIFI_PASS</code>, <code>MQTT_HOST</code>, <code>MQTT_USER</code> and <code>MQTT_PASS</code> at the top of the sketch. For anything beyond a bench test, move these into WiFiManager\'s captive portal so credentials are not compiled into the binary.',
    'Set <code>RELAY_ACTIVE_LOW</code> to match your relay module. Test it: with the pin configured but the sketch idle, the strike should be <em>locked</em>. If it sits released, flip the constant.',
    'Set <code>UNLOCK_MS</code>. Four seconds suits a front door; a gate needs longer, a cabinet less.',
    'Adjust the NTP offset in <code>configTime()</code> if you are not on IST — the first argument is the offset in seconds (UTC+5:30 = 19800).',
    'Enrol the first credential before mounting anything. Publish <code>{"action":"enrol_pin","pin":"481902"}</code> to the command topic, or add a temporary enrolment branch that stores the next card tapped.',
    'Once it works on plain MQTT, switch to <code>WiFiClientSecure</code> on port 8883 and load your broker\'s CA certificate. Access-control events are exactly the kind of traffic that should never cross a network in the clear.',
  ],

  calibration: [
    { h: 'Set the RFID read range', p: ['The RC522 antenna gain is set in the RFCfgReg register. The library defaults to a middle setting; <code>rfid.PCD_SetAntennaGain(MFRC522::RxGain_max)</code> raises it to maximum. Test with the card at the exact distance your enclosure imposes — more gain is not always better, because an over-driven field makes reads unstable at very close range.'] },
    { h: 'Measure the actual strike current', p: ['Put a multimeter in series with the strike and trigger an unlock. Note the holding current and confirm it is comfortably below the relay contact rating and the adapter capacity. A strike drawing more than about 700 mA needs a bigger supply than the 12 V 2 A specified here.'] },
    { h: 'Tune the debounce window', p: ['If keys occasionally register twice, raise the 25 ms threshold in <code>keypadRead()</code> to 35 ms. If keys feel sluggish, lower it to 15 ms. Membrane keypads vary; there is no universally correct value.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    intro: [
      'The lock is a leaf node: it holds one outbound TCP connection to a broker and never accepts inbound connections. That is deliberate. A device that listens on a port is a device with an attack surface; a device that only dials out can sit behind NAT with no port forwarding and no exposure.',
    ],
    net: {
      nodes: [{ name: 'Front door lock', sub: 'ESP32' }, { name: 'Back gate lock', sub: 'optional 2nd node' }],
      protocol: 'Wi-Fi 2.4 GHz',
      gateway: 'Home router', gatewaySub: 'WPA2, IoT VLAN',
      uplink: 'MQTT/TLS 8883',
      cloud: 'Mosquitto broker', cloudSub: 'ACL per device',
      clients: [{ name: 'Phone app', sub: 'push alerts' }, { name: 'Grafana', sub: 'access history' }, { name: 'Home Assistant', sub: 'automation' }],
    },
    protocol: [
      'MQTT is the right fit here for three reasons. First, the connection is persistent, so an unlock command reaches the device in tens of milliseconds rather than waiting for a polling interval. Second, the Last Will and Testament gives you free liveness detection — if the lock loses power, the broker announces it. Third, the protocol overhead is tiny: a publish is two bytes of fixed header plus the topic and payload, which matters when the device spends most of its life on battery-backed standby.',
      'Quality of service is chosen per message. Audit events use QoS 1 (at least once) because losing an entry defeats the point of an audit trail; a duplicate is harmless since each carries a timestamp. The status topic uses QoS 0 with the retain flag, because only the latest value matters and a subscriber should learn it immediately on connect.',
    ],
    topics: [
      { t: 'home/door/front-door/event', dir: 'device → broker', payload: 'JSON: ts, device, method, result, who, rssi' },
      { t: 'home/door/front-door/status', dir: 'device → broker (retained)', payload: '"online" / "offline" (LWT)' },
      { t: 'home/door/front-door/cmd', dir: 'broker → device', payload: 'JSON: action = unlock | enrol_pin | wipe' },
    ],
    cloud: [
      'Mosquitto on a Raspberry Pi is the recommended broker: it is a 3 MB install, it runs on the same LAN as the lock so an internet outage does not lock you out, and its ACL file gives per-user topic permissions in about six lines.',
      'Create a dedicated user for the device that can publish only to its own event and status topics and subscribe only to its own command topic. If the device is ever compromised, that credential cannot be used to read anything else on the broker.',
    ],
    cloudCode: [{
      file: 'mosquitto.acl', lang: 'plain',
      body: `# /etc/mosquitto/aclfile — per-device least privilege
#
# The lock may publish its own telemetry and read only its own commands.
user door
topic write home/door/front-door/event
topic write home/door/front-door/status
topic read  home/door/front-door/cmd

# The dashboard reads everything under home/ but may only issue commands.
user dashboard
topic read  home/#
topic write home/door/+/cmd

# Apply with:
#   sudo mosquitto_passwd -c /etc/mosquitto/passwd door
#   sudo systemctl restart mosquitto`,
    }],
    dashboard: [
      'Point Node-RED at the event topic and write each message into InfluxDB, then build two Grafana panels: a table of the last fifty events, and a bar chart of grants versus denials per day. The denial chart is the useful one — a sudden cluster of denials at 3 a.m. is exactly the signal you want an alert on.',
    ],
    mobile: [
      'The simplest reliable mobile path is a Node-RED flow subscribed to the event topic that calls the ntfy.sh or Pushover HTTP API on any <code>denied</code> or <code>lockout</code> result. That gives you push notifications on iOS and Android without writing an app. If you already run Home Assistant, add the lock as an MQTT device and you get the app, the history and the automations for free.',
    ],
    security: [
      'Use TLS (port 8883) with a broker certificate pinned in the firmware. Plain 1883 is for bench testing only.',
      'Give every device its own broker credential with a topic ACL restricted to its own subtree.',
      'Never publish the raw UID or the PIN in an event payload — publish a label instead.',
      'Put IoT devices on a separate VLAN or guest network so a compromised device cannot reach your file server.',
      'Enable ESP32 flash encryption and secure boot before deploying somewhere that matters; without them, anyone with physical access and a USB cable can read the firmware image out of the device.',
      'Treat the RFID UID as an identifier and not a secret — MIFARE Classic UIDs are trivially cloneable. If the threat model includes a determined attacker, move to DESFire EV2 with mutual authentication.',
      'Rate-limit remote unlock commands at the broker as well as on the device, so a compromised dashboard credential cannot hold the door open indefinitely.',
    ],
  },

  testing: [
    { step: 'Power-on with no credentials enrolled', expect: 'OLED shows <code>LOCKED</code>; the strike stays engaged; serial prints "Smart door lock ready" and the MQTT status topic reads <code>online</code>.' },
    { step: 'Tap an unknown card', expect: 'Red LED, a low 400 Hz beep, OLED shows <code>DENIED</code>, and an event with <code>"result":"denied"</code> appears on the broker within about 200 ms.' },
    { step: 'Enrol a PIN and enter it', expect: 'Green LED, a 2.2 kHz beep, the strike releases audibly, and an event with <code>"method":"pin","result":"granted"</code> is published.' },
    { step: 'Enter a wrong PIN five times inside a minute', expect: 'OLED shows <code>LOCKED OUT — wait 30s</code>, further keys produce only the error beep, and a <code>lockout</code> event is published.' },
    { step: 'Publish a remote unlock command', expect: 'The strike releases within roughly 100 ms of the publish, with <code>"method":"remote"</code> in the event.' },
    { step: 'Press the inside egress button', expect: 'The strike releases immediately. Repeat with the ESP32 powered down — it must still release, proving the parallel hardware path works.' },
    { step: 'Unplug the network, tap a valid card, then restore the network', expect: 'The door still unlocks (local credentials are authoritative) and the buffered event appears on the broker within a few seconds of reconnection.' },
    { step: 'Measure standby and unlock current', expect: 'Roughly 90–140 mA idle on the 5 V rail; a brief rise to about 500 mA on the 12 V rail while the strike is energised.' },
  ],

  output: [
    'With a card tapped and the network up, the serial console and the broker both show the same JSON records:',
    {
      file: 'serial-monitor.txt', lang: 'plain',
      body: `Smart door lock ready
MFRC522 version: 0x92
WiFi connected, RSSI -54 dBm, IP 192.168.1.87
NTP synced: 2026-07-27 09:14:02 IST
MQTT connected to 192.168.1.50:1883

{"ts":1785488042,"device":"front-door","method":"rfid","result":"granted","who":"card","rssi":-54}
{"ts":1785488061,"device":"front-door","method":"pin","result":"denied","who":"keypad","rssi":-55}
{"ts":1785488068,"device":"front-door","method":"pin","result":"granted","who":"keypad","rssi":-55}
{"ts":1785488230,"device":"front-door","method":"remote","result":"granted","who":"cli","rssi":-56}
{"ts":1785488519,"device":"front-door","method":"egress","result":"granted","who":"inside-button","rssi":-53}`,
    },
    'And the same stream through the Python watcher:',
    {
      file: 'enrol-card.py --watch', lang: 'plain',
      body: `watching home/door/front-door/event — Ctrl-C to stop
OK 2026-07-27 09:14:02  rfid    granted  card
NO 2026-07-27 09:14:21  pin     denied   keypad
OK 2026-07-27 09:14:28  pin     granted  keypad
OK 2026-07-27 09:17:10  remote  granted  cli
OK 2026-07-27 09:21:59  egress  granted  inside-button`,
    },
  ],

  troubleshoot: [
    {
      sym: 'The RC522 prints version 0x00 or 0xFF and never reads a card',
      cause: 'Almost always power or SPI wiring. The module is 3.3 V only, and its SPI lines must go to the ESP32 hardware SPI pins.',
      fix: 'Confirm VCC reads 3.3 V, not 5 V, at the module pin. Check SCK→18, MISO→19, MOSI→23, SS→5, RST→27. Re-solder the module\'s header pins — these boards ship with poorly-tinned headers and a cold joint on MISO is extremely common. If it still fails, the reader is dead; feeding it 5 V even briefly destroys it.',
    },
    {
      sym: 'Cards read on the bench but not once mounted in the door',
      cause: 'Metal near the antenna. A 13.56 MHz field induces eddy currents in nearby steel, which detunes the antenna and collapses the range.',
      fix: 'Move the reader at least 30 mm away from any steel in the frame, or place a ferrite sheet between the antenna and the metal. Mount behind ABS, acrylic or wood only. Also check the strike wiring is not running alongside the antenna.',
    },
    {
      sym: 'Pressing one key registers two or three different keys',
      cause: 'Two row lines driven low simultaneously, or missing pull-ups on the columns.',
      fix: 'Confirm every row is set HIGH again before the next row is driven LOW — this is the <code>digitalWrite(ROWS[r], HIGH)</code> at the end of the inner loop. Confirm the columns are <code>INPUT_PULLUP</code>, not plain <code>INPUT</code>. If GPIO 12 is in use as a column, verify the board still boots; it is a strapping pin.',
    },
    {
      sym: 'The ESP32 resets every time the strike fires',
      cause: 'The inductive kick from the strike coil is coupling back into the 5 V rail, or both loads share one undersized supply.',
      fix: 'Fit the 1N4007 flyback diode across the strike coil (stripe to +12 V). Feed the ESP32 from its own buck converter rather than the same rail as the strike, keep the grounds joined at exactly one point, and add a 470 µF capacitor across the ESP32 5 V input.',
    },
    {
      sym: 'The strike releases briefly when the ESP32 boots or is reset',
      cause: 'GPIO 2 floats during reset, and the opto-isolated relay reads a floating input as active.',
      fix: 'Add a 10 kΩ pull-up from GPIO 2 to 3V3 for an active-low module (or pull-down for active-high) so the relay input is held in the locked state through the whole boot sequence. GPIO 2 is also a strapping pin — GPIO 33 is a cleaner choice if you can rewire.',
    },
    {
      sym: 'Timestamps show 1970 or jump backwards',
      cause: 'NTP has not synced — usually because the device has no internet route, or a firewall is blocking UDP 123.',
      fix: 'Print <code>time(nullptr)</code> after <code>configTime()</code> and wait until it exceeds 1 700 000 000 before publishing. Fit the DS3231 so the device holds correct time through an outage, and read the RTC at boot as the initial clock value.',
    },
    {
      sym: 'MQTT connects then drops every few minutes',
      cause: 'Two devices connected with the same client ID, so the broker evicts one each time the other connects.',
      fix: 'Give every device a unique client ID — append the MAC address suffix. Also make sure only one copy of the firmware is running; a spare ESP32 still plugged in on your desk with the same ID will fight the deployed one forever.',
    },
  ],

  perf: [
    'Poll the RFID reader every loop but the keypad only every 5 ms — the reader\'s <code>IsNewCardPresent()</code> is cheap, the matrix scan is not free at 200 Hz.',
    'Cache the credential count from NVS at boot instead of re-reading it on every verification; NVS reads are flash reads and cost tens of microseconds each.',
    'Keep the OLED updates event-driven. Refreshing a 128×64 framebuffer over I²C at 100 kHz takes about 10 ms — doing that every loop halves your card-read responsiveness.',
  ],

  safety: [
    '<b>Egress must never depend on this firmware.</b> Wire the inside release button in parallel with the relay contacts so it works with the electronics dead. In many jurisdictions this is a legal requirement for an occupied space.',
    'Understand fail-secure versus fail-safe before you buy the strike. Fail-secure stays locked in a power cut (better for security); fail-safe releases (required on some fire escape routes). Choose deliberately, and check local fire regulations.',
    'Never fit this on the only exit of a room that could be occupied without also fitting a mechanical override.',
  ],

  maintenance: [
    'Test the egress button monthly with the controller powered down. It is the one part of the system whose failure mode is someone trapped inside.',
    'Review the access log monthly for denials you cannot account for.',
    'Replace the DS3231 CR2032 backup cell every three to four years.',
  ],

  future: [
    'Move to <b>MIFARE DESFire EV2</b> cards with AES mutual authentication. The RC522 supports it, and it upgrades the card from an identifier to a genuine cryptographic credential that cannot be cloned by reading it.',
    'Add a <b>time-window policy</b> per credential — a cleaner\'s fob that works only on Tuesdays between 09:00 and 12:00 is a few extra bytes per NVS entry.',
    'Fit an <b>ESP32-CAM</b> to capture a photo on every denied attempt and attach it to the notification.',
    'Add a <b>door position sensor</b> (a simple reed switch) so you can distinguish "unlocked" from "actually opened" and alert on a door left ajar.',
    'Implement <b>OTA firmware updates</b> over MQTT so a lock mounted in a door frame never needs a USB cable again.',
  ],

  faq: [
    { q: 'Can I use an Arduino Uno instead of an ESP32?', a: 'For the RFID and keypad half, yes — the RC522 library runs happily on an Uno. But you lose everything networked: no Wi-Fi, no MQTT, no NTP timestamps, and 2 KB of SRAM is not enough for SHA-256 plus a JSON buffer. If you have no need for remote access or an audit trail, an Uno build is a legitimate simpler project. If you want the audit trail, the ESP32 is not a luxury here.' },
    { q: 'Is storing a hash actually worth it if MIFARE UIDs can be cloned anyway?', a: 'Yes, but for a different reason than people assume. Hashing does not stop card cloning — nothing at the UID layer can. What it stops is a <em>flash dump</em> becoming a credential dump. If someone gets five minutes alone with the device and a USB cable, plain-text UIDs in NVS hand them every authorised card in the building. Hashed and salted, they get nothing useful. Different attack, real mitigation.' },
    { q: 'What happens during a power cut?', a: 'With a fail-secure strike, the door stays locked and the inside egress button still works mechanically once power returns — so plan a mechanical key override or a UPS if that is unacceptable. With a fail-safe strike the door releases, which is the correct behaviour on a fire escape route and the wrong behaviour on a front door. A small 12 V UPS or a sealed lead-acid battery with a trickle charger removes the question entirely for about ₹1,500.' },
    { q: 'Do I need the OLED and the RTC?', a: 'Neither is strictly required. The OLED earns its place because a lock with no feedback is genuinely unpleasant to use — you cannot tell a slow read from a rejected card. The DS3231 matters only if you care about the audit log staying correctly ordered through a network outage; without it, events during an outage carry uptime-relative timestamps.' },
    { q: 'Can two people share one PIN?', a: 'Technically yes — but do not. The entire value of this system is knowing who came in. Enrol a separate PIN per person and label the events accordingly; the storage cost is 32 bytes each.' },
    { q: 'How do I stop someone just pulling the reader off the wall and shorting the wires?', a: 'You cannot, with this architecture, and it is important to be honest about that. The reader is outside and the wires behind it are the weak point. Commercial systems solve this by putting the controller and relay entirely on the secure side of the door, with only the reader outside communicating over an authenticated bus such as OSDP. If your threat model includes a determined attacker with a screwdriver, mount the ESP32, the relay and the strike wiring inside, and run only the RC522 SPI lines out — better still, use an OSDP reader.' },
    { q: 'Why MQTT rather than a simple HTTP call?', a: 'HTTP requires the device to either poll (adding latency and traffic) or listen on a port (adding attack surface and needing port forwarding). MQTT keeps one outbound connection open, so a remote unlock arrives in tens of milliseconds through NAT with no inbound firewall rule at all. The Last Will and Testament also gives you device-death detection for free, which HTTP simply cannot do.' },
  ],

  refs: [
    { t: 'MFRC522 Standard Performance MIFARE and NTAG Frontend — datasheet', u: 'https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf', s: 'NXP Semiconductors' },
    { t: 'ESP32 Series Datasheet — GPIO, strapping pins and boot modes', u: 'https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf', s: 'Espressif Systems' },
    { t: 'ESP32 Non-Volatile Storage (NVS) library documentation', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/storage/nvs_flash.html', s: 'Espressif ESP-IDF Programming Guide' },
    { t: 'MQTT Version 3.1.1 — OASIS Standard (Last Will, QoS, retained messages)', u: 'https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html', s: 'OASIS' },
    { t: 'Mosquitto broker — ACL and authentication configuration', u: 'https://mosquitto.org/man/mosquitto-conf-5.html', s: 'Eclipse Mosquitto' },
    { t: 'ISO/IEC 14443 — Identification cards, proximity cards (overview)', u: 'https://www.iso.org/standard/73597.html', s: 'ISO' },
    { t: 'mbedTLS SHA-256 API reference', u: 'https://mbed-tls.readthedocs.io/en/latest/', s: 'Mbed TLS' },
    { t: 'Timing attacks and constant-time comparison — a practical explanation', u: 'https://codahale.com/a-lesson-in-timing-attacks/', s: 'Coda Hale' },
  ],

  images: ['esp32', 'relay', 'grafana'],
  imageCaptions: [
    'An ESP32 development board of the kind used as the lock controller — dual-core, Wi-Fi and BLE on one module.',
    'An opto-isolated relay module. The optocoupler package between the input header and the coil is what keeps the strike\'s inductive kick away from the microcontroller.',
    'A time-series dashboard of the kind used to chart access grants and denials over time.',
  ],
},

/* ─────────────────────────────────────────────────────────────────
   002 · Voice-Controlled Home Hub
──────────────────────────────────────────────────────────────────*/
{
  id: '002',
  domainKey: 'iot',
  emoji: '🎙️',
  thumb: 'esp32',
  difficulty: 'Advanced',
  hours: '20–30 hours',
  iso8601: 'PT26H',
  tagline: 'A wake-word voice assistant that runs entirely on a ₹900 microcontroller — no cloud, no account, no audio leaving the house — switching lights, fans and appliances from a spoken command.',

  overview: [
    'Commercial voice assistants work by streaming a continuous audio buffer to a data centre. That is a reasonable engineering choice and an unreasonable privacy one. This project takes the opposite position: the microphone data never leaves the ESP32-S3. A small neural network trained on your own recordings runs on-device, and the only thing that ever reaches the network is a two-word MQTT message such as <code>light/on</code>.',
    'That constraint drives every design decision. You cannot run a general speech recogniser in 512 KB of RAM, so the system is built as a <b>keyword spotter</b> — it recognises a fixed vocabulary of perhaps a dozen commands rather than transcribing arbitrary speech. In practice that is what a home hub actually needs. "Lights on", "fan off", "scene movie" covers the real usage; free-form dictation does not.',
    'The signal chain is worth understanding because it is the same chain used in every production keyword spotter. Audio arrives from an INMP441 MEMS microphone over I²S at 16 kHz. A 30 ms sliding window is transformed to a <b>Mel-frequency spectrogram</b> — a compact time-frequency image that discards phase and most of the fine spectral detail humans do not use for phoneme identity. That image feeds a small depthwise-separable convolutional network, quantised to int8, which outputs a probability per keyword. The whole inference costs about 15 ms on the ESP32-S3, which has vector instructions specifically for this workload.',
    'The ESP32-S3 rather than a plain ESP32 is a deliberate choice. The S3 adds 8 MB of PSRAM (enough for audio ring buffers and the model arena) and SIMD-like vector extensions that roughly triple int8 convolution throughput. On a classic ESP32 the same model runs at around 45 ms per inference, which is usable but leaves much less headroom for the audio front end.',
    'Two failure modes dominate real deployments, and both are addressed here. <b>False accepts</b> — the hub switching the lights because the television said something similar — are handled with a confidence threshold plus a required run of consecutive positive frames. <b>False rejects</b> in a noisy kitchen are handled by training on your own room, with your own voice, including recordings of the background noise you actually have.',
  ],

  does: [
    'Continuously listens for a wake word entirely on-device, at about 0.4 W total power.',
    'Recognises a trained vocabulary of 8–12 command phrases with per-keyword confidence scores.',
    'Publishes the recognised intent as an MQTT message that Home Assistant, Node-RED or a relay board can act on.',
    'Switches four mains channels directly through an opto-isolated relay board when running standalone.',
    'Gives immediate audible and visual feedback so you always know whether a command landed.',
    'Logs every recognition — including rejected low-confidence ones — so you can tune the threshold from real data.',
    'Never transmits audio. The microphone buffer is overwritten in place and never written to flash or the network.',
  ],

  features: [
    '<b>Fully offline inference</b> using TensorFlow Lite for Microcontrollers with an int8-quantised model under 60 KB.',
    '<b>Mel-spectrogram front end</b> computed with a fixed-point FFT, so feature extraction costs about 4 ms per window.',
    '<b>Two-stage detection</b> — a cheap always-on wake-word model gates a larger command model, cutting average power by roughly 60 %.',
    '<b>Confidence hysteresis</b>: three consecutive frames above threshold to accept, which nearly eliminates television false triggers.',
    '<b>Per-keyword thresholds</b> tunable at runtime over MQTT, because "off" is inherently harder to detect than "kitchen".',
    '<b>Ring-buffered I²S capture</b> on a dedicated FreeRTOS task pinned to core 0, so inference on core 1 never drops samples.',
    '<b>Adaptive noise floor</b> — the detector\'s energy gate tracks the room\'s ambient level over a 30 s window.',
    '<b>WS2812 status ring</b> giving a listening / thinking / accepted / rejected visual state.',
  ],

  applications: [
    { t: 'Accessible home control', d: 'For someone with limited mobility, a reliable local voice switch is genuinely enabling — and unlike a cloud assistant it keeps working when the broadband does not.' },
    { t: 'Privacy-sensitive households', d: 'Homes where a cloud microphone is unacceptable — therapy practices, legal offices, or simply a matter of principle.' },
    { t: 'Industrial and workshop control', d: 'Hands-free control while wearing gloves or holding a workpiece, in an environment with no network access.' },
    { t: 'Hotel and hospital rooms', d: 'A fixed, auditable vocabulary is far easier to certify than a general-purpose assistant.' },
    { t: 'Teaching TinyML', d: 'The complete loop — collect data, train, quantise, deploy, measure — inside one weekend project.' },
    { t: 'Kiosk and appliance interfaces', d: 'The same firmware pattern gives a washing machine or coffee machine a small, dependable voice interface.' },
  ],

  skills: [
    'Comfortable C++ including pointers, buffers and fixed-size arrays',
    'Basic digital signal processing intuition — sampling rate, windowing, spectrograms',
    'Enough Python to run a training notebook and read a confusion matrix',
    'Understanding of quantisation: why int8 and what it costs in accuracy',
    'FreeRTOS basics — tasks, cores, queues',
    'Mains wiring competence if you drive relays directly (or use a separate certified smart plug instead)',
  ],

  prereq: [
    'Collect your training data before you write any firmware. The single largest determinant of accuracy is whether the model heard your room, your voice and your background noise during training — not the architecture. Budget an hour for recording and expect to redo it once.',
  ],

  parts: ['esp32s3', 'inmp441', 'relay4', 'neopixel', 'buzzer', 'buck', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'Small 4 Ω 3 W speaker + PAM8403 amplifier', spec: 'Class-D, 3 W per channel, 5 V', qty: 1, price: 220, note: 'Optional — for spoken confirmation rather than beeps.' },
    { name: 'Acoustic foam / felt pad', spec: '10 mm open-cell, self-adhesive', qty: 1, price: 120, note: 'Decouples the microphone from enclosure vibration; noticeably reduces handling noise.' },
  ],
  cost: '₹3,600 – ₹4,800',

  libs: ['esptask', 'tflmicro', 'edgeimpulse', 'wifi', 'pubsub', 'arduinojson', 'fastled', 'python', 'tf', 'numpy', 'librosa'],
  ide: 'Arduino IDE 2.3.x with the ESP32 core 3.x (board: ESP32S3 Dev Module, PSRAM enabled) + Python 3.11 for training',

  pins: {
    left: [
      { dev: 'INMP441 microphone', devPin: 'SCK (BCLK)', pin: 'GPIO 14', sig: 'I²S bit clock' },
      { dev: 'INMP441 microphone', devPin: 'WS (LRCL)', pin: 'GPIO 15', sig: 'I²S word select' },
      { dev: 'INMP441 microphone', devPin: 'SD (DOUT)', pin: 'GPIO 32', sig: 'I²S serial data' },
      { dev: 'INMP441 microphone', devPin: 'L/R', pin: 'GND', sig: 'Selects the left channel' },
      { dev: 'Mode / mute button', devPin: 'NO contact', pin: 'GPIO 0', sig: 'Also the BOOT pin' },
    ],
    right: [
      { dev: 'WS2812 status ring (12 px)', devPin: 'DIN', pin: 'GPIO 48', sig: '800 kHz, 330 Ω series' },
      { dev: '4-channel relay board', devPin: 'IN1–IN4', pin: 'GPIO 4 5 6 7', sig: 'Active-low' },
      { dev: 'Piezo buzzer', devPin: '+', pin: 'GPIO 17', sig: 'LEDC PWM tone' },
    ],
  },

  wiringNotes: [
    'The INMP441 is an <b>I²S digital</b> microphone, not analogue. There is no ADC involved on the ESP32 side — the peripheral clocks 24-bit samples straight out of the microphone, which is why the noise floor is so much lower than an analogue electret plus op-amp.',
    'Tie the microphone <code>L/R</code> pin to ground to select the left channel. Left floating, the microphone may output on either slot and you will read silence half the time.',
    'Keep the three I²S lines short (under 15 cm) and run a ground wire alongside them. The bit clock is 1.024 MHz at 16 kHz × 32 bits × 2 channels and it radiates.',
    'Place the microphone port on the enclosure face with a 2–3 mm hole and a fabric mesh behind it. Do not cover it with anything solid, and do not glue it — mechanical coupling to the case turns every knock into a false trigger.',
    'The WS2812 ring wants 5 V data ideally, but works reliably from a 3.3 V ESP32-S3 for short runs. If the first pixel misbehaves, add a level shifter or sacrifice one pixel as a buffer.',
    'The relay board must be powered from the 5 V rail, not the ESP32 3V3 pin. Four energised coils draw about 280 mA — far beyond what the on-board regulator will supply.',
  ],

  block: {
    columns: [
      { label: 'Capture', blocks: [{ name: 'INMP441 mic', sub: 'I²S 16 kHz 24-bit' }, { name: 'Ring buffer', sub: 'core 0 task' }] },
      { label: 'Features', edge: '30 ms window', blocks: [{ name: 'Pre-emphasis + Hann', sub: 'fixed-point' }, { name: 'Mel spectrogram', sub: '40 bands × 49 frames', highlight: true }] },
      { label: 'Inference', edge: 'int8 tensor', blocks: [{ name: 'Wake-word model', sub: '18 KB, always on' }, { name: 'Command model', sub: '58 KB, gated', highlight: true }] },
      { label: 'Action', edge: 'intent + score', blocks: [{ name: 'Hysteresis filter', sub: '3 frames' }, { name: 'Relay / MQTT', sub: 'publish intent' }] },
    ],
  },

  flow: [
    { t: 'Boot: init I²S, load models, join Wi-Fi', k: 'start' },
    { t: 'Core 0 fills the audio ring buffer', k: 'proc' },
    { t: 'Energy above adaptive noise floor?', k: 'dec', yes: 'yes', no: 'sleep 10 ms', back: 1 },
    { t: 'Compute Mel spectrogram for this window', k: 'proc' },
    { t: 'Run the wake-word model', k: 'proc' },
    { t: 'Wake word detected?', k: 'dec', yes: 'yes', no: 'back to listening', back: 1 },
    { t: 'Run the command model on the next 1 s', k: 'proc' },
    { t: 'Score > threshold for 3 frames?', k: 'dec', yes: 'accept', no: 'flash red, log rejection', back: 1 },
    { t: 'Switch relay and publish MQTT intent', k: 'io' },
    { t: 'Return to listening', k: 'end' },
  ],

  layers: [
    { name: 'Acoustic front end', items: ['INMP441 MEMS mic', 'I²S peripheral', 'DMA ring buffer'], highlight: true },
    { name: 'Feature extraction', items: ['pre-emphasis', 'Hann window', 'fixed-point FFT', 'Mel filterbank', 'log compression'] },
    { name: 'Inference', items: ['TFLite Micro interpreter', 'int8 DS-CNN', 'tensor arena in PSRAM'] },
    { name: 'Decision', items: ['softmax', 'per-keyword threshold', 'consecutive-frame hysteresis', 'debounce timer'] },
    { name: 'Actuation & transport', items: ['relay driver', 'MQTT intent publish', 'WS2812 feedback'] },
  ],

  principle: [
    'Speech recognition on a microcontroller is an exercise in throwing information away intelligently. Raw audio at 16 kHz is 16 000 numbers per second; a keyword decision needs perhaps 2 000 numbers per second of <em>useful</em> information. The Mel spectrogram is the standard way of making that reduction, and it is worth understanding why it works.',
    'Start with a 30 ms window of samples — 480 at 16 kHz. Speech is roughly stationary over that span: a vowel does not change identity in 30 ms. Multiply by a <b>Hann window</b> to taper the edges, because an abrupt cut produces spectral leakage that smears energy across every frequency bin. Take the magnitude of the FFT and discard the phase; for keyword identity, phase carries almost nothing. That leaves 256 magnitude bins.',
    'Now compress those 256 bins into about 40, using triangular filters spaced on the <b>Mel scale</b>. The Mel scale is approximately linear below 1 kHz and logarithmic above, which mirrors how the cochlea resolves frequency — we discriminate 200 Hz from 300 Hz easily, and 5000 Hz from 5100 Hz not at all. Filters that follow that curve preserve the information the ear uses and throw away the rest. Take the logarithm of each filter output, because loudness perception is roughly logarithmic and because it compresses the dynamic range into something an int8 network can represent.',
    'Slide that window forward 20 ms at a time and stack the results, and after one second you have a 49 × 40 image. That image is what the network actually sees. The word "kitchen" produces a visually distinctive pattern — a burst of high-frequency energy for the /k/, a formant structure for the vowel, another burst for the /tʃ/ — and a convolutional network is extremely good at learning those patterns.',
    'The network itself is a <b>depthwise-separable CNN</b>, the architecture Google published as DS-CNN in their Hello Edge work and which remains the practical default for this task. A standard convolution over C input channels with K output channels and a 3 × 3 kernel costs 9·C·K multiply-accumulates per output pixel. A depthwise-separable convolution splits that into a 3 × 3 spatial filter per channel (9·C) followed by a 1 × 1 mix across channels (C·K), which is roughly 8–9× cheaper for typical channel counts at nearly the same accuracy. That factor is exactly what makes the difference between fitting in a microcontroller and not.',
    'Finally, <b>quantisation</b>. Training happens in float32; deployment does not. Post-training quantisation maps each tensor to int8 using a per-axis scale and zero point, so a weight <code>w</code> is stored as <code>round(w / scale) + zero_point</code>. The model shrinks 4× and integer arithmetic runs several times faster on hardware with no FPU-heavy vector unit. Typical accuracy cost for this class of model is well under one percentage point, provided you supply a representative dataset during conversion so the converter can measure the real activation ranges.',
  ],

  equations: [
    { t: 'Mel scale conversion', eq: 'm = 2595 · log10(1 + f / 700)\nf = 700 · (10^(m / 2595) − 1)\n\n40 filters spanning 80 Hz – 7600 Hz:\n  m_low  = 2595 · log10(1 + 80/700)   ≈  120.4 mel\n  m_high = 2595 · log10(1 + 7600/700) ≈ 2762.4 mel\n  spacing = (2762.4 − 120.4) / 41     ≈   64.4 mel', d: 'Filter centres are evenly spaced in mel and therefore unevenly spaced in hertz — narrow and closely packed at low frequency, wide and sparse at high frequency.' },
    { t: 'Int8 quantisation', eq: 'real  = scale × (quantised − zero_point)\nscale = (real_max − real_min) / 255\nzero_point = round(−real_min / scale) − 128\n\nExample activation range [−6.0, +2.0]:\n  scale      = 8.0 / 255      = 0.03137\n  zero_point = round(6.0/0.03137) − 128 = 63', d: 'Every tensor carries its own scale and zero point, which is why a representative calibration dataset matters: the converter derives these constants from observed activations.' },
    { t: 'Inference cost', eq: 'Standard 3×3 conv:  9 · C_in · C_out       MACs / pixel\nDepthwise-separable: 9 · C_in + C_in · C_out\n\nC_in = C_out = 64:\n  standard    = 9 · 64 · 64 = 36 864 MACs\n  separable   = 9 · 64 + 64 · 64 = 4 672 MACs\n  reduction   = 7.9×', d: 'The saving grows with channel count, which is why every mobile and microcontroller vision or audio model uses this decomposition.' },
  ],

  assembly: [
    { h: 'Bring up the microphone first', p: ['Wire only the INMP441 and run the I²S capture sketch from step 1. Print the RMS of each buffer and confirm it rises when you speak and falls in silence. A microphone that reads a constant value has its L/R pin floating or its data line on the wrong GPIO.'] },
    { h: 'Mount the microphone acoustically, not structurally', p: ['Stick the INMP441 board to a small foam pad rather than directly to the enclosure. Line up the microphone port hole in the PCB with a 2.5 mm hole in the case and leave a 1 mm air gap. Cover the outside with acoustic mesh, never with tape.'], warn: 'Do not let solder flux or conformal coating near the microphone port. Blocking it permanently deafens the sensor and it cannot be cleaned.' },
    { h: 'Add the status ring and buzzer', p: ['The WS2812 ring is the user interface. Fit it behind a diffuser — a disc of 1 mm white acrylic or even printer paper — so it reads as a glow rather than twelve point sources.'] },
    { h: 'Wire the relay board on the far side of the enclosure', p: ['Keep the mains section physically separated from the microphone and the ESP32-S3, with a solid barrier if the enclosure allows. Relay switching transients are broadband electrical noise, and the I²S clock lines are the last thing you want them coupling into.'], warn: 'If you are not confident wiring mains, do not. Publish MQTT intents instead and let a commercially certified smart plug do the switching. The project loses nothing.' },
    { h: 'Close up and re-test acoustically', p: ['Recognition accuracy measured with the lid off is not the accuracy you will get with it on. The enclosure changes the frequency response. Always do your final threshold tuning with the case fully assembled and the unit in its final position.'] },
  ],

  steps: [
    {
      h: 'Capture audio over I²S and measure the level',
      p: ['This sketch does nothing but read the microphone and print a level meter. Get it right before anything else — every later problem is easier to diagnose when you trust the audio.'],
      code: {
        file: '01-i2s-capture.ino', lang: 'cpp',
        body: `#include <driver/i2s.h>

#define I2S_BCLK  14
#define I2S_LRCL  15
#define I2S_DOUT  32
#define SAMPLE_RATE 16000
#define FRAME_LEN   512

int32_t raw[FRAME_LEN];        // INMP441 delivers 24-bit left-justified in 32

void setup() {
  Serial.begin(115200);

  i2s_config_t cfg = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,        // 8 x 512 samples = 256 ms of slack
    .dma_buf_len = FRAME_LEN,
    .use_apll = true           // cleaner clock than the PLL divider
  };
  i2s_pin_config_t pins = {
    .bck_io_num = I2S_BCLK,  .ws_io_num = I2S_LRCL,
    .data_out_num = I2S_PIN_NO_CHANGE, .data_in_num = I2S_DOUT
  };
  i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pins);
}

void loop() {
  size_t got = 0;
  i2s_read(I2S_NUM_0, raw, sizeof(raw), &got, portMAX_DELAY);
  int n = got / sizeof(int32_t);

  // Shift right by 11 to land 24-bit audio in a signed 16-bit range.
  double sumSq = 0;
  for (int i = 0; i < n; i++) {
    int16_t s = (int16_t)(raw[i] >> 11);
    sumSq += (double)s * s;
  }
  float rms = sqrt(sumSq / n);
  float db  = 20.0f * log10f(rms / 32768.0f + 1e-9f);

  Serial.printf("rms %7.1f  %6.1f dBFS  ", rms, db);
  for (int i = 0; i < (int)((db + 80) / 2); i++) Serial.print('#');
  Serial.println();
}`,
        explain: [
          { ref: 'I2S_BITS_PER_SAMPLE_32BIT', txt: 'The INMP441 is a 24-bit part but transmits in 32-bit slots. Configuring 16-bit here is the classic mistake — you get half of each sample and the audio sounds like static.' },
          { ref: 'raw[i] >> 11', txt: 'The 24 bits sit left-justified in the 32-bit word. Shifting right by 11 keeps the top 16 bits with a little headroom, which is a good working level for speech without clipping on a loud word.' },
          { ref: 'use_apll = true', txt: 'The audio PLL generates a much lower-jitter bit clock than dividing the main PLL. Jitter shows up as a raised noise floor, which directly costs you recognition accuracy in a quiet room.' },
          { ref: 'dma_buf_count = 8', txt: 'Eight buffers give 256 ms of slack. If inference occasionally overruns, DMA keeps filling buffers rather than dropping samples — dropped samples corrupt the spectrogram and produce mysterious mis-detections.' },
        ],
      },
      tip: 'A quiet room should read around −55 to −65 dBFS; normal speech at one metre around −25 to −35 dBFS. If silence reads above −40 dBFS you have a wiring or clock problem, not a noisy room.',
    },
    {
      h: 'Collect your own training data',
      p: ['Public keyword datasets are a starting point, not a solution. Record in the room the device will live in, with the people who will use it. Aim for 60–100 utterances per keyword across at least three speakers, plus five minutes of pure background noise from that room, plus a "not a command" class made of ordinary conversation and television audio.'],
      code: {
        file: 'record_samples.py', lang: 'python',
        body: `#!/usr/bin/env python3
"""Record labelled 1-second keyword clips at 16 kHz.

    python3 record_samples.py --label lights_on --count 60
"""
import argparse
import pathlib
import queue
import sys

import numpy as np
import sounddevice as sd
import soundfile as sf

RATE = 16_000
CLIP = 1.0  # seconds — must match the model's input length


def record_one(seconds: float = CLIP) -> np.ndarray:
    frames: queue.Queue = queue.Queue()
    with sd.InputStream(samplerate=RATE, channels=1, dtype="int16",
                        callback=lambda d, *_: frames.put(d.copy())):
        sd.sleep(int(seconds * 1000))
    chunks = []
    while not frames.empty():
        chunks.append(frames.get())
    clip = np.concatenate(chunks).flatten()
    # Pad or trim to exactly CLIP seconds so every example has one shape.
    want = int(RATE * seconds)
    return np.pad(clip, (0, max(0, want - len(clip))))[:want]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--label", required=True)
    ap.add_argument("--count", type=int, default=60)
    ap.add_argument("--out", default="dataset")
    args = ap.parse_args()

    out = pathlib.Path(args.out) / args.label
    out.mkdir(parents=True, exist_ok=True)
    start = len(list(out.glob("*.wav")))

    print(f"Recording {args.count} clips for '{args.label}'.")
    print("Vary your distance, angle and speed. Enter to record, q to stop.")
    for i in range(args.count):
        if input(f"[{i + 1}/{args.count}] > ").strip().lower() == "q":
            break
        clip = record_one()
        peak = np.abs(clip).max() / 32768
        if peak < 0.02:
            print("  too quiet — discarded, move closer")
            continue
        if peak > 0.98:
            print("  clipped — discarded, move back")
            continue
        sf.write(out / f"{args.label}_{start + i:04d}.wav", clip, RATE)
        print(f"  saved  peak {peak:.2f}")


if __name__ == "__main__":
    sys.exit(main())`,
        explain: [
          { ref: 'peak < 0.02 / > 0.98', txt: 'Automatic quality gates. Clips that are near-silent or clipped teach the model nothing useful and actively hurt — rejecting them at capture time is far cheaper than cleaning the dataset later.' },
          { ref: 'np.pad(...)[:want]', txt: 'Every example must be exactly one second. A model with a fixed input shape cannot accept variable-length audio, and silently truncating during training is a subtle source of label noise.' },
          { ref: '"Vary your distance, angle and speed"', txt: 'This is the most important line in the script. A dataset recorded at one distance in one tone of voice produces a model that only works at that distance in that tone of voice.' },
        ],
      },
      tip: 'Record the <em>negative</em> class properly. Half your recording time should go on background, conversation and television audio. A keyword spotter with no good negatives fires constantly.',
    },
    {
      h: 'Train and quantise the model',
      p: ['The architecture is small enough to train on a laptop CPU in about fifteen minutes. Resist the temptation to make it bigger — accuracy on this task is bounded by your data, not your parameter count.'],
      code: {
        file: 'train_kws.py', lang: 'python',
        body: `#!/usr/bin/env python3
"""Train a depthwise-separable CNN keyword spotter and export int8 TFLite."""
import pathlib

import numpy as np
import tensorflow as tf

RATE, CLIP = 16_000, 1.0
N_MELS, N_FRAMES = 40, 49
LABELS = ["_background", "_unknown", "lights_on", "lights_off",
          "fan_on", "fan_off", "scene_movie", "all_off"]


def log_mel(waveform: tf.Tensor) -> tf.Tensor:
    """480-sample window, 320-sample hop -> 49 x 40 log-mel image."""
    stft = tf.signal.stft(waveform, frame_length=480, frame_step=320, fft_length=512)
    spec = tf.abs(stft)
    mel_w = tf.signal.linear_to_mel_weight_matrix(
        num_mel_bins=N_MELS, num_spectrogram_bins=stft.shape[-1],
        sample_rate=RATE, lower_edge_hertz=80.0, upper_edge_hertz=7600.0)
    mel = tf.tensordot(spec, mel_w, 1)
    return tf.math.log(mel + 1e-6)[..., tf.newaxis]


def build_model() -> tf.keras.Model:
    inp = tf.keras.Input(shape=(N_FRAMES, N_MELS, 1))
    x = tf.keras.layers.Conv2D(32, (3, 3), strides=(2, 2), padding="same",
                               use_bias=False)(inp)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.ReLU()(x)

    for _ in range(4):                       # 4 depthwise-separable blocks
        x = tf.keras.layers.DepthwiseConv2D((3, 3), padding="same", use_bias=False)(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.ReLU()(x)
        x = tf.keras.layers.Conv2D(32, (1, 1), padding="same", use_bias=False)(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.ReLU()(x)

    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.25)(x)
    out = tf.keras.layers.Dense(len(LABELS), activation="softmax")(x)
    return tf.keras.Model(inp, out)


def load_dataset(root="dataset"):
    xs, ys = [], []
    for idx, label in enumerate(LABELS):
        for wav in pathlib.Path(root, label).glob("*.wav"):
            audio, _ = tf.audio.decode_wav(tf.io.read_file(str(wav)),
                                           desired_channels=1,
                                           desired_samples=int(RATE * CLIP))
            xs.append(log_mel(tf.squeeze(audio, -1)))
            ys.append(idx)
    return np.stack(xs), np.array(ys)


def main() -> None:
    x, y = load_dataset()
    print(f"{len(x)} examples, {len(LABELS)} classes")

    perm = np.random.permutation(len(x))
    x, y = x[perm], y[perm]
    split = int(0.85 * len(x))
    x_tr, y_tr, x_va, y_va = x[:split], y[:split], x[split:], y[split:]

    model = build_model()
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-3),
                  loss="sparse_categorical_crossentropy",
                  metrics=["accuracy"])
    model.fit(x_tr, y_tr, validation_data=(x_va, y_va),
              epochs=60, batch_size=64,
              callbacks=[tf.keras.callbacks.EarlyStopping(
                  patience=8, restore_best_weights=True)])

    # ---- int8 quantisation -------------------------------------------
    def representative():
        for i in range(min(300, len(x_tr))):
            yield [x_tr[i:i + 1].astype(np.float32)]

    conv = tf.lite.TFLiteConverter.from_keras_model(model)
    conv.optimizations = [tf.lite.Optimize.DEFAULT]
    conv.representative_dataset = representative
    conv.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    conv.inference_input_type = tf.int8
    conv.inference_output_type = tf.int8
    tflite = conv.convert()

    pathlib.Path("kws_int8.tflite").write_bytes(tflite)
    print(f"model size: {len(tflite) / 1024:.1f} KB")

    # Emit a C array the sketch can include directly.
    with open("model_data.h", "w") as f:
        f.write("alignas(16) const unsigned char g_model[] = {\\n")
        for i in range(0, len(tflite), 12):
            f.write("  " + ", ".join(f"0x{b:02x}" for b in tflite[i:i + 12]) + ",\\n")
        f.write("};\\nconst unsigned int g_model_len = %d;\\n" % len(tflite))


if __name__ == "__main__":
    main()`,
        explain: [
          { ref: 'log_mel()', txt: 'Feature extraction lives in the training script and is mirrored exactly in the firmware. Any mismatch — a different window length, a different mel range — silently destroys accuracy at deployment while training metrics still look perfect.' },
          { ref: 'DepthwiseConv2D + Conv2D 1×1', txt: 'This pair is the depthwise-separable block: spatial filtering per channel, then a pointwise mix across channels. It is what makes the model roughly eight times cheaper than plain convolutions.' },
          { ref: 'GlobalAveragePooling2D', txt: 'Replaces a flatten-plus-dense head. It removes tens of thousands of parameters and makes the model tolerant of small time shifts in the keyword.' },
          { ref: 'representative_dataset', txt: 'The converter runs these samples through the float model to observe real activation ranges and pick per-tensor scales. Skip it and every activation gets a crude default range, which typically costs 5–15 points of accuracy.' },
          { ref: '_background and _unknown classes', txt: 'Two negative classes, not one. "_background" is room noise; "_unknown" is speech that is not a command. Merging them makes the model confuse silence with conversation and raises false accepts sharply.' },
        ],
      },
    },
    {
      h: 'Run inference on the device',
      p: ['The firmware mirrors the training front end exactly, then runs the interpreter and applies hysteresis before acting.'],
      code: {
        file: '02-inference-core.ino', lang: 'cpp',
        body: `#include <TensorFlowLite_ESP32.h>
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include "model_data.h"

constexpr int  N_FRAMES = 49, N_MELS = 40, N_LABELS = 8;
constexpr int  ARENA_SIZE = 70 * 1024;

static uint8_t *arena;                     // allocated in PSRAM
static tflite::MicroInterpreter *interp;
static TfLiteTensor *input, *output;

const char *LABELS[N_LABELS] = {
  "_background", "_unknown", "lights_on", "lights_off",
  "fan_on", "fan_off", "scene_movie", "all_off"
};
// "off" words are acoustically weaker; they need a lower bar.
const float THRESH[N_LABELS] = { 1.0f, 1.0f, 0.85f, 0.78f, 0.85f, 0.78f, 0.88f, 0.90f };

void inferenceBegin() {
  arena = (uint8_t *)heap_caps_malloc(ARENA_SIZE, MALLOC_CAP_SPIRAM);

  static tflite::MicroMutableOpResolver<8> resolver;
  resolver.AddConv2D();
  resolver.AddDepthwiseConv2D();
  resolver.AddRelu();
  resolver.AddAveragePool2D();
  resolver.AddReshape();
  resolver.AddFullyConnected();
  resolver.AddSoftmax();
  resolver.AddQuantize();

  const tflite::Model *model = tflite::GetModel(g_model);
  static tflite::MicroInterpreter s(model, resolver, arena, ARENA_SIZE);
  interp = &s;
  interp->AllocateTensors();
  input  = interp->input(0);
  output = interp->output(0);

  Serial.printf("arena used: %u bytes\\n", (unsigned)interp->arena_used_bytes());
}

// features[] holds the float log-mel image; quantise it into the tensor.
int classify(const float *features, float *bestScore) {
  const float  s  = input->params.scale;
  const int    zp = input->params.zero_point;
  int8_t      *dst = input->data.int8;

  for (int i = 0; i < N_FRAMES * N_MELS; i++) {
    int v = (int)lroundf(features[i] / s) + zp;
    dst[i] = (int8_t)(v < -128 ? -128 : (v > 127 ? 127 : v));
  }

  if (interp->Invoke() != kTfLiteOk) return -1;

  const float os  = output->params.scale;
  const int   ozp = output->params.zero_point;
  int   best = 0;
  float bestP = -1;
  for (int i = 0; i < N_LABELS; i++) {
    float p = os * (output->data.int8[i] - ozp);
    if (p > bestP) { bestP = p; best = i; }
  }
  *bestScore = bestP;
  return best;
}

// Three consecutive agreeing frames above threshold before we act.
int stableIntent(int label, float score) {
  static int   lastLabel = -1;
  static int   run = 0;
  static uint32_t lastFire = 0;

  if (label != lastLabel) { lastLabel = label; run = 0; }
  run = (score >= THRESH[label]) ? run + 1 : 0;

  if (run >= 3 && millis() - lastFire > 1500) {   // 1.5 s command debounce
    run = 0;
    lastFire = millis();
    return label;
  }
  return -1;
}`,
        explain: [
          { ref: 'heap_caps_malloc(..., MALLOC_CAP_SPIRAM)', txt: 'The 70 KB tensor arena goes into the S3\'s external PSRAM rather than internal SRAM, leaving internal memory free for the I²S DMA buffers and the Wi-Fi stack — which are both latency-critical and must not be in PSRAM.' },
          { ref: 'MicroMutableOpResolver<8>', txt: 'Registers only the eight operators this model actually uses. The all-ops resolver pulls in every kernel TFLite Micro knows about and adds roughly 100 KB of flash for no benefit.' },
          { ref: 'lroundf(features[i] / s) + zp', txt: 'Manual quantisation of the input. The scale and zero point come from the model file itself, so this code stays correct if you retrain and the ranges change.' },
          { ref: 'THRESH[] per label', txt: 'Unvoiced fricatives such as the /f/ in "off" carry far less energy than a plosive, so a single global threshold either misses "off" or over-triggers on "on". Per-keyword thresholds are the single cheapest accuracy improvement available.' },
          { ref: 'run >= 3 && millis() - lastFire > 1500', txt: 'Two independent guards. The run counter rejects momentary spikes from a television; the debounce timer stops one long utterance from firing the same command three times.' },
        ],
      },
    },
  ],

  code: [
    {
      file: 'voice-home-hub.ino', lang: 'cpp',
      body: `/* ═══════════════════════════════════════════════════════════════
   Offline Voice-Controlled Home Hub — ESP32-S3 + INMP441 + TFLite Micro

   Audio never leaves the device. A dedicated FreeRTOS task on core 0
   fills a ring buffer from I²S; core 1 computes a log-mel spectrogram
   and runs an int8 keyword-spotting model. Only the resulting intent
   is published over MQTT.

   Board: ESP32S3 Dev Module, PSRAM: OPI, Flash: 8 MB
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <driver/i2s.h>
#include <FastLED.h>
#include <math.h>

#include <TensorFlowLite_ESP32.h>
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include "model_data.h"

/* ── configuration ──────────────────────────────────────────── */
#define WIFI_SSID   "YOUR_WIFI"
#define WIFI_PASS   "YOUR_PASSWORD"
#define MQTT_HOST   "192.168.1.50"
#define MQTT_PORT   1883
#define DEVICE_ID   "voice-hub"

#define I2S_BCLK    14
#define I2S_LRCL    15
#define I2S_DOUT    32
#define PIN_LEDS    48
#define PIN_BUZZER  17
#define N_LEDS      12

const uint8_t RELAY_PIN[4] = { 4, 5, 6, 7 };

#define SAMPLE_RATE 16000
#define WIN_LEN     480          // 30 ms
#define HOP_LEN     320          // 20 ms
#define FFT_LEN     512
#define N_MELS      40
#define N_FRAMES    49           // 49 hops ≈ 1.0 s
#define RING_LEN    (SAMPLE_RATE)   // 1 s of int16 audio
#define ARENA_SIZE  (70 * 1024)

const char *LABELS[] = { "_background", "_unknown", "lights_on", "lights_off",
                         "fan_on", "fan_off", "scene_movie", "all_off" };
const float THRESH[] = { 1.0f, 1.0f, 0.85f, 0.78f, 0.85f, 0.78f, 0.88f, 0.90f };
#define N_LABELS (sizeof(LABELS) / sizeof(LABELS[0]))

/* ── globals ────────────────────────────────────────────────── */
WiFiClient   net;
PubSubClient mqtt(net);
CRGB         leds[N_LEDS];

static int16_t  *ring;            // PSRAM audio ring buffer
static volatile uint32_t ringHead = 0;
static float    *melFilters;      // N_MELS x (FFT_LEN/2+1), precomputed
static float    *features;        // N_FRAMES x N_MELS
static float     noiseFloor = 0.002f;

static uint8_t  *arena;
static tflite::MicroInterpreter *interp;
static TfLiteTensor *inputT, *outputT;

/* ── mel filterbank (computed once at boot) ─────────────────── */
static float hzToMel(float hz)  { return 2595.0f * log10f(1.0f + hz / 700.0f); }
static float melToHz(float mel) { return 700.0f * (powf(10.0f, mel / 2595.0f) - 1.0f); }

void buildMelFilters() {
  const int bins = FFT_LEN / 2 + 1;
  melFilters = (float *)heap_caps_calloc(N_MELS * bins, sizeof(float), MALLOC_CAP_SPIRAM);

  float mLow = hzToMel(80.0f), mHigh = hzToMel(7600.0f);
  float edges[N_MELS + 2];
  for (int i = 0; i < N_MELS + 2; i++)
    edges[i] = melToHz(mLow + (mHigh - mLow) * i / (N_MELS + 1));

  for (int m = 0; m < N_MELS; m++) {
    float f0 = edges[m], f1 = edges[m + 1], f2 = edges[m + 2];
    for (int k = 0; k < bins; k++) {
      float f = (float)k * SAMPLE_RATE / FFT_LEN;
      float w = 0.0f;
      if (f >= f0 && f <= f1)      w = (f - f0) / (f1 - f0);
      else if (f > f1 && f <= f2)  w = (f2 - f) / (f2 - f1);
      melFilters[m * bins + k] = w;
    }
  }
}

/* ── radix-2 in-place FFT (real input, complex output) ──────── */
void fft(float *re, float *im, int n) {
  for (int i = 1, j = 0; i < n; i++) {          // bit-reversal permutation
    int bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { float t = re[i]; re[i] = re[j]; re[j] = t;
                 t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (int len = 2; len <= n; len <<= 1) {
    float ang = -2.0f * (float)M_PI / len;
    float wr = cosf(ang), wi = sinf(ang);
    for (int i = 0; i < n; i += len) {
      float cr = 1.0f, ci = 0.0f;
      for (int k = 0; k < len / 2; k++) {
        float ur = re[i + k],           ui = im[i + k];
        float vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        float vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr;            im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr;  im[i + k + len / 2] = ui - vi;
        float nr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;         cr = nr;
      }
    }
  }
}

/* ── log-mel spectrogram over the last 1 s of the ring ──────── */
void computeFeatures() {
  static float re[FFT_LEN], im[FFT_LEN];
  const int bins = FFT_LEN / 2 + 1;
  uint32_t start = (ringHead + RING_LEN - (N_FRAMES - 1) * HOP_LEN - WIN_LEN) % RING_LEN;

  for (int f = 0; f < N_FRAMES; f++) {
    memset(re, 0, sizeof(re));
    memset(im, 0, sizeof(im));

    float prev = 0;
    for (int n = 0; n < WIN_LEN; n++) {
      float s = ring[(start + f * HOP_LEN + n) % RING_LEN] / 32768.0f;
      float pe = s - 0.97f * prev;                     // pre-emphasis
      prev = s;
      float w = 0.5f - 0.5f * cosf(2.0f * (float)M_PI * n / (WIN_LEN - 1)); // Hann
      re[n] = pe * w;
    }
    fft(re, im, FFT_LEN);

    for (int m = 0; m < N_MELS; m++) {
      float acc = 0;
      const float *row = &melFilters[m * bins];
      for (int k = 0; k < bins; k++)
        if (row[k] > 0) acc += row[k] * sqrtf(re[k] * re[k] + im[k] * im[k]);
      features[f * N_MELS + m] = logf(acc + 1e-6f);
    }
  }
}

/* ── model ──────────────────────────────────────────────────── */
void inferenceBegin() {
  arena = (uint8_t *)heap_caps_malloc(ARENA_SIZE, MALLOC_CAP_SPIRAM);

  static tflite::MicroMutableOpResolver<8> resolver;
  resolver.AddConv2D();       resolver.AddDepthwiseConv2D();
  resolver.AddRelu();         resolver.AddAveragePool2D();
  resolver.AddReshape();      resolver.AddFullyConnected();
  resolver.AddSoftmax();      resolver.AddQuantize();

  static tflite::MicroInterpreter s(tflite::GetModel(g_model), resolver,
                                    arena, ARENA_SIZE);
  interp = &s;
  interp->AllocateTensors();
  inputT  = interp->input(0);
  outputT = interp->output(0);
  Serial.printf("arena used %u B, model %u B\\n",
                (unsigned)interp->arena_used_bytes(), g_model_len);
}

int classify(float *bestScore) {
  const float s = inputT->params.scale;
  const int  zp = inputT->params.zero_point;
  for (int i = 0; i < N_FRAMES * N_MELS; i++) {
    int v = (int)lroundf(features[i] / s) + zp;
    inputT->data.int8[i] = (int8_t)(v < -128 ? -128 : (v > 127 ? 127 : v));
  }
  if (interp->Invoke() != kTfLiteOk) return -1;

  const float os = outputT->params.scale;
  const int  ozp = outputT->params.zero_point;
  int best = 0; float bestP = -1;
  for (size_t i = 0; i < N_LABELS; i++) {
    float p = os * (outputT->data.int8[i] - ozp);
    if (p > bestP) { bestP = p; best = (int)i; }
  }
  *bestScore = bestP;
  return best;
}

/* ── audio capture task (core 0) ────────────────────────────── */
void audioTask(void *) {
  static int32_t raw[256];
  size_t got;
  for (;;) {
    i2s_read(I2S_NUM_0, raw, sizeof(raw), &got, portMAX_DELAY);
    int n = got / sizeof(int32_t);
    for (int i = 0; i < n; i++) {
      ring[ringHead] = (int16_t)(raw[i] >> 11);
      ringHead = (ringHead + 1) % RING_LEN;
    }
  }
}

float ringRms() {
  double acc = 0;
  for (int i = 0; i < 1600; i++) {                 // last 100 ms
    int16_t s = ring[(ringHead + RING_LEN - 1 - i) % RING_LEN];
    acc += (double)s * s;
  }
  return sqrtf(acc / 1600) / 32768.0f;
}

/* ── feedback ───────────────────────────────────────────────── */
void ledState(CRGB c, uint8_t brightness) {
  fill_solid(leds, N_LEDS, c);
  FastLED.setBrightness(brightness);
  FastLED.show();
}

/* ── actions ────────────────────────────────────────────────── */
void applyIntent(int label) {
  const char *name = LABELS[label];

  if      (!strcmp(name, "lights_on"))  digitalWrite(RELAY_PIN[0], LOW);
  else if (!strcmp(name, "lights_off")) digitalWrite(RELAY_PIN[0], HIGH);
  else if (!strcmp(name, "fan_on"))     digitalWrite(RELAY_PIN[1], LOW);
  else if (!strcmp(name, "fan_off"))    digitalWrite(RELAY_PIN[1], HIGH);
  else if (!strcmp(name, "scene_movie")) {
    digitalWrite(RELAY_PIN[0], HIGH);
    digitalWrite(RELAY_PIN[2], LOW);
  } else if (!strcmp(name, "all_off")) {
    for (int i = 0; i < 4; i++) digitalWrite(RELAY_PIN[i], HIGH);
  }

  JsonDocument doc;
  doc["device"] = DEVICE_ID;
  doc["intent"] = name;
  doc["ts"]     = millis() / 1000;
  char buf[128];
  size_t n = serializeJson(doc, buf, sizeof(buf));
  mqtt.publish("home/voice/" DEVICE_ID "/intent", (const uint8_t *)buf, n, false);

  ledState(CRGB::Green, 80);
  tone(PIN_BUZZER, 2400, 90);
  delay(220);
  ledState(CRGB::Blue, 12);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 4; i++) { pinMode(RELAY_PIN[i], OUTPUT); digitalWrite(RELAY_PIN[i], HIGH); }
  pinMode(PIN_BUZZER, OUTPUT);

  FastLED.addLeds<WS2812B, PIN_LEDS, GRB>(leds, N_LEDS);
  ledState(CRGB::Orange, 30);

  ring     = (int16_t *)heap_caps_calloc(RING_LEN, sizeof(int16_t), MALLOC_CAP_SPIRAM);
  features = (float  *)heap_caps_calloc(N_FRAMES * N_MELS, sizeof(float), MALLOC_CAP_SPIRAM);
  buildMelFilters();

  i2s_config_t cfg = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8, .dma_buf_len = 256, .use_apll = true
  };
  i2s_pin_config_t pins = { .bck_io_num = I2S_BCLK, .ws_io_num = I2S_LRCL,
                            .data_out_num = I2S_PIN_NO_CHANGE, .data_in_num = I2S_DOUT };
  i2s_driver_install(I2S_NUM_0, &cfg, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pins);

  inferenceBegin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  mqtt.setServer(MQTT_HOST, MQTT_PORT);

  // Capture pinned to core 0; inference runs on core 1 in loop().
  xTaskCreatePinnedToCore(audioTask, "audio", 4096, NULL, 5, NULL, 0);

  ledState(CRGB::Blue, 12);
  Serial.println("Voice hub listening — audio stays on this device");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect(DEVICE_ID);
  mqtt.loop();

  float rms = ringRms();
  noiseFloor = 0.999f * noiseFloor + 0.001f * rms;      // slow adaptation

  if (rms < noiseFloor * 3.0f) { delay(10); return; }   // energy gate

  ledState(CRGB::Cyan, 40);
  uint32_t t0 = micros();
  computeFeatures();
  uint32_t t1 = micros();
  float score;
  int label = classify(&score);
  uint32_t t2 = micros();

  static int lastLabel = -1, run = 0;
  static uint32_t lastFire = 0;
  if (label != lastLabel) { lastLabel = label; run = 0; }
  run = (label >= 2 && score >= THRESH[label]) ? run + 1 : 0;

  Serial.printf("%-12s %.2f  feat %lu us  inf %lu us  run %d\\n",
                label >= 0 ? LABELS[label] : "?", score,
                (unsigned long)(t1 - t0), (unsigned long)(t2 - t1), run);

  if (run >= 3 && millis() - lastFire > 1500) {
    run = 0; lastFire = millis();
    applyIntent(label);
  } else {
    ledState(CRGB::Blue, 12);
  }
}`,
      explain: [
        { ref: 'xTaskCreatePinnedToCore(audioTask, ..., 0)', txt: 'Capture gets its own core. If audio capture shared a core with a 20 ms inference, the DMA buffers would occasionally overflow and drop samples — which corrupts the spectrogram in ways that look like random mis-recognition.' },
        { ref: 'noiseFloor = 0.999f * noiseFloor + 0.001f * rms', txt: 'A single-pole low-pass with a time constant of roughly 30 s at this call rate. It tracks the room getting noisier (a fan switching on) without following a spoken word, which would defeat the gate.' },
        { ref: 'rms < noiseFloor * 3.0f', txt: 'The energy gate is what keeps average power low: the expensive FFT and inference only run when something is actually happening. In a quiet room the device spends over 95 % of its time in this early return.' },
        { ref: 'pre-emphasis s − 0.97·prev', txt: 'A first-order high-pass that boosts high frequencies. Speech has roughly −6 dB/octave spectral tilt; flattening it gives the higher formants comparable weight to the fundamental, which measurably improves consonant discrimination.' },
        { ref: 'Hann window', txt: 'Tapering the window to zero at both ends prevents spectral leakage. Without it, the discontinuity at the window edge spreads energy across all frequency bins and blurs the formant structure the model relies on.' },
        { ref: 'label >= 2', txt: 'Classes 0 and 1 are the two negative classes. Requiring label ≥ 2 means background and unknown speech can never trigger an action no matter how confident the model is.' },
      ],
    },
  ],

  config: [
    'Set <b>Tools → PSRAM → OPI PSRAM</b> in the Arduino IDE. Without it, <code>heap_caps_malloc(..., MALLOC_CAP_SPIRAM)</code> returns null and the device crashes in <code>setup()</code>.',
    'Set <b>Tools → Partition Scheme → Huge APP (3 MB)</b>. The TFLite Micro runtime plus the model does not fit in the default 1.2 MB app partition.',
    'Set <b>Tools → CPU Frequency → 240 MHz</b>. At 160 MHz the feature extraction takes about 40 % longer, which eats the headroom that keeps the energy gate cheap.',
    'Regenerate <code>model_data.h</code> whenever you retrain, and update <code>LABELS[]</code> and <code>THRESH[]</code> to match the label order in <code>train_kws.py</code>. A mismatched label order produces a device that works confidently and wrongly.',
    'Tune <code>THRESH[]</code> from the serial log, not from intuition. Speak each command twenty times, note the scores, and set the threshold a little below the tenth percentile of true positives.',
    'Adjust the energy-gate multiplier (3.0) for your room. Higher misses quiet speech; lower burns power on every fridge compressor cycle.',
  ],

  calibration: [
    { h: 'Establish the room noise floor', p: ['Leave the device running with the serial log open for ten minutes with nobody speaking. Note the RMS values. The steady-state <code>noiseFloor</code> should settle within about 20 % of the median idle RMS. If it keeps climbing, something in the room is periodically loud and you should raise the gate multiplier.'] },
    { h: 'Measure the true-positive score distribution', p: ['Speak each command twenty times from the position you will normally use. Record the reported score for each. A well-trained model gives true positives clustered above 0.9 with occasional dips to 0.7. Set that keyword\'s threshold just below the lowest score you are willing to accept.'] },
    { h: 'Measure the false-accept rate against television', p: ['Play an hour of television or radio at normal volume with nobody in the room and count triggers. Zero is achievable. If you get more than one per hour, the fix is almost always more <code>_unknown</code> training data recorded from that same television, not a higher threshold.'] },
    { h: 'Verify timing headroom', p: ['The serial log prints feature and inference times. Feature extraction should be around 3–5 ms and inference around 12–18 ms on an ESP32-S3 at 240 MHz. If inference exceeds 40 ms, check that PSRAM is enabled and the CPU is at full clock.'] },
  ],

  ai: {
    dataset: [
      'The dataset is the project. Everything else is plumbing. You need three kinds of audio, and the ratio between them matters more than the total count.',
      '<b>Positives</b>: 60–100 clips per command word, spread across every person who will use the device, at varied distances (0.5 m to 4 m), angles, speaking rates and volumes. Include deliberately sloppy pronunciations — that is what real usage sounds like.',
      '<b>Background</b>: five to ten minutes of the actual room with nobody speaking, captured at different times of day so it includes the fridge, the fan, traffic and the air conditioner.',
      '<b>Unknown speech</b>: at least as many clips as all your positives combined, drawn from ordinary conversation, television and radio. This is the class most people under-collect, and it is the direct cause of a hub that switches the lights during dinner.',
      'Google\'s Speech Commands v0.02 dataset is a useful supplement for the <code>_unknown</code> class — 105 000 one-second clips of 35 words under a permissive licence — but it will not substitute for recordings of your own room.',
    ],
    datasetTable: [
      { n: 'Your own recordings', size: '~800 clips (≈15 min)', lic: 'Yours', use: 'All positive classes and room background — the decisive part of the dataset.' },
      { n: 'Google Speech Commands v0.02', size: '105 829 clips, 2.3 GB', lic: 'CC BY 4.0', use: 'Bulk of the _unknown class and augmentation for robustness.' },
      { n: 'MS-SNSD noise corpus', size: '~10 h', lic: 'MIT', use: 'Noise mixing during augmentation to simulate a noisier room.' },
    ],
    preprocess: [
      'Resample everything to 16 kHz mono, 16-bit PCM. Mismatched sample rates between training and deployment are the most common silent failure in TinyML audio.',
      'Trim or pad every clip to exactly 1.000 s, aligning the keyword roughly centrally but with deliberate jitter of ±100 ms so the model does not learn a fixed onset time.',
      'Normalise each clip to a peak of about −3 dBFS, then apply random gain of ±6 dB during training. Peak normalisation alone teaches the model that loudness is a feature, which it should not be.',
      'Augment with time shift (±100 ms), background mixing at 0–15 dB SNR, and mild time stretching (0.9–1.1×). Do <em>not</em> augment with pitch shift beyond about ±10 % — it distorts formants and creates examples that do not occur in reality.',
      'Compute log-mel features with exactly the same parameters used in the firmware: 480-sample window, 320-sample hop, 512-point FFT, 40 mel bands from 80 Hz to 7600 Hz.',
    ],
    pipeline: [
      { name: 'Record', sub: 'own room, own voices' },
      { name: 'Label & clean', sub: 'reject clipped/silent' },
      { name: 'Augment', sub: 'shift, noise, gain' },
      { name: 'Log-mel', sub: '49 × 40 image' },
      { name: 'Train DS-CNN', sub: '60 epochs, Adam', highlight: true },
      { name: 'Quantise int8', sub: 'representative set' },
      { name: 'Export C array', sub: 'model_data.h' },
      { name: 'Deploy & measure', sub: 'on-device scores', highlight: true },
    ],
    arch: [
      'The network is a depthwise-separable CNN in the DS-CNN family. An initial strided 3×3 convolution reduces the 49 × 40 input to 25 × 20 with 32 channels, then four depthwise-separable blocks each apply a 3×3 spatial filter per channel followed by a 1×1 pointwise mix. Global average pooling collapses the spatial dimensions, dropout at 0.25 regularises, and a dense softmax produces eight class probabilities.',
      'Every convolution uses <code>use_bias=False</code> because it is immediately followed by batch normalisation, which has its own shift parameter — a bias term there is redundant and simply adds parameters. At conversion time TFLite folds the batch-norm parameters into the preceding convolution weights, so the deployed model has no batch-norm layers at all.',
    ],
    archTable: [
      { l: 'Input', s: '(49, 40, 1) int8', p: 'One second of log-mel spectrogram.' },
      { l: 'Conv2D 3×3 s2', s: '(25, 20, 32)', p: 'Cheap spatial downsample and initial feature extraction.' },
      { l: 'DS block ×4', s: '(25, 20, 32)', p: 'Depthwise 3×3 then pointwise 1×1; the bulk of the model capacity.' },
      { l: 'GlobalAveragePool', s: '(32,)', p: 'Collapses time and frequency; gives shift tolerance for free.' },
      { l: 'Dropout 0.25', s: '(32,)', p: 'Regularisation — essential with a dataset of only a few hundred clips.' },
      { l: 'Dense + softmax', s: '(8,)', p: 'Per-keyword probability.' },
    ],
    hyper: [
      { k: 'Optimiser', v: 'Adam, lr 1e-3', w: 'Converges reliably on this scale of data without a learning-rate schedule.' },
      { k: 'Batch size', v: '64', w: 'Large enough for stable batch-norm statistics, small enough to fit a laptop CPU.' },
      { k: 'Epochs', v: '60 with early stopping (patience 8)', w: 'The model typically peaks around epoch 30–40; early stopping prevents memorising the training set.' },
      { k: 'Dropout', v: '0.25', w: 'Higher hurts on a small model; lower overfits a few-hundred-clip dataset.' },
      { k: 'Mel bands', v: '40', w: 'The standard for keyword spotting. 32 loses consonant detail; 64 costs FFT time for no measurable gain.' },
      { k: 'Window / hop', v: '30 ms / 20 ms', w: 'Speech is quasi-stationary over 30 ms; a 10 ms overlap keeps transients from falling between frames.' },
      { k: 'Quantisation', v: 'Full int8, per-axis weights', w: 'Per-axis (per output channel) scales cost nothing at inference and recover most of the accuracy lost by per-tensor quantisation.' },
    ],
    training: [
      'Split by <b>speaker</b>, not randomly. A random split puts clips of the same person saying the same word in both train and validation, which inflates validation accuracy by five to ten points and tells you nothing about how it will work for a guest.',
      'Watch the confusion matrix, not the accuracy number. On this task the interesting failures are always specific pairs — "lights on" versus "lights off" — and the fix is more data for that pair, not more epochs.',
      'Retrain after the first week of real use. Log every rejected utterance to the serial console, listen to the ones that should have worked, and add them to the dataset. Two rounds of this typically halves the false-reject rate.',
      'Evaluate the quantised model, not the float one. Run the TFLite interpreter over your validation set and compare — if int8 costs more than about two points, your representative dataset is not representative.',
    ],
    metricsIntro: [
      'Figures below are from a reference run: eight classes, roughly 900 own recordings plus 4 000 Speech Commands clips for the unknown class, speaker-disjoint split, measured on an ESP32-S3 at 240 MHz with PSRAM enabled.',
    ],
    metrics: [
      { m: 'Validation accuracy (float32)', v: '95.8 %', d: 'Speaker-disjoint split — the honest number, not the random-split one.' },
      { m: 'Validation accuracy (int8)', v: '95.1 %', d: 'Quantisation cost of 0.7 points, which is typical when the representative dataset is drawn from real training data.' },
      { m: 'False accepts per hour (TV playing)', v: '0.4', d: 'With three-frame hysteresis. Without hysteresis the same model gives about 6 per hour.' },
      { m: 'False rejects (normal speech, 2 m)', v: '3.9 %', d: 'Rises to roughly 12 % at 4 m with a fan running — the practical range limit.' },
      { m: 'Model size', v: '58 KB', d: 'Int8 TFLite flatbuffer, embedded as a C array in flash.' },
      { m: 'Tensor arena', v: '46 KB used of 70 KB', d: 'Allocated in PSRAM; the headroom absorbs interpreter version changes.' },
      { m: 'Feature extraction', v: '4.1 ms', d: '49 frames of 512-point FFT plus mel projection, float on the S3 FPU.' },
      { m: 'Inference latency', v: '15.3 ms', d: 'End-to-end Invoke() on int8 with the S3 vector extensions.' },
      { m: 'Average power', v: '0.41 W', d: 'Idle listening with the energy gate active; peaks near 0.9 W during inference and Wi-Fi transmit.' },
    ],
    chart: {
      title: 'Inference latency by platform (same int8 model)', unit: 'ms',
      bars: [
        { label: 'ESP32-S3 @ 240 MHz', value: 15.3 },
        { label: 'ESP32 @ 240 MHz', value: 44.8 },
        { label: 'ESP32 @ 160 MHz', value: 67.2 },
        { label: 'RP2040 @ 133 MHz', value: 138.0 },
      ],
    },
    deploy: [
      'Export the int8 flatbuffer as a C array with 16-byte alignment. Unaligned model data causes hard faults on some cores and, worse, silently wrong results on others.',
      'Register only the operators the model uses via <code>MicroMutableOpResolver</code>. The all-ops resolver adds roughly 100 KB of flash and no capability.',
      'Put the tensor arena in PSRAM and the DMA buffers in internal SRAM. Getting this backwards halves throughput because DMA cannot reach PSRAM efficiently.',
      'Print <code>arena_used_bytes()</code> once at boot and size the arena to that plus 30 %. Over-sizing wastes PSRAM; under-sizing fails at <code>AllocateTensors()</code> with an unhelpful message.',
      'Version the model. Embed a build hash in the header and publish it on the MQTT status topic, so you can tell which model a given device is running when you are debugging six of them.',
    ],
    inference: {
      file: 'test_tflite.py', lang: 'python',
      body: `#!/usr/bin/env python3
"""Verify the quantised model on the host before flashing it."""
import numpy as np
import tensorflow as tf

interp = tf.lite.Interpreter(model_path="kws_int8.tflite")
interp.allocate_tensors()
inp, out = interp.get_input_details()[0], interp.get_output_details()[0]

in_scale, in_zp = inp["quantization"]
out_scale, out_zp = out["quantization"]
print(f"input  {inp['shape']} {inp['dtype'].__name__} scale={in_scale:.5f} zp={in_zp}")
print(f"output {out['shape']} {out['dtype'].__name__} scale={out_scale:.5f} zp={out_zp}")

# x_val holds float log-mel features produced by the same log_mel() used in training.
x_val = np.load("x_val.npy")
y_val = np.load("y_val.npy")

correct = 0
for x, y in zip(x_val, y_val):
    q = np.clip(np.round(x / in_scale) + in_zp, -128, 127).astype(np.int8)
    interp.set_tensor(inp["index"], q[np.newaxis, ...])
    interp.invoke()
    probs = out_scale * (interp.get_tensor(out["index"])[0].astype(np.int32) - out_zp)
    correct += int(np.argmax(probs) == y)

print(f"int8 accuracy: {correct / len(y_val):.4f}")`,
    },
    limits: [
      'This is a keyword spotter, not a speech recogniser. It cannot handle a phrase it was not trained on, and adding a new command means recording data and retraining — there is no way around that on this hardware.',
      'Accuracy degrades sharply beyond about three metres, and in a room with a running extractor fan or television at conversational volume you should expect roughly a 10–15 % false-reject rate. That is a property of a single microphone with no beamforming, not of the model.',
      'A model trained on adult voices performs noticeably worse on children, whose formants sit substantially higher. If children will use it, they must be in the training set.',
    ],
  },

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    intro: [
      'The networking here is deliberately thin. The device publishes an intent string and, optionally, subscribes to a threshold-tuning topic. That is all. Because no audio ever crosses the network, the security posture of the whole system is dramatically simpler than a cloud assistant\'s.',
    ],
    net: {
      nodes: [{ name: 'Voice hub', sub: 'ESP32-S3' }, { name: 'Second room hub', sub: 'optional' }],
      protocol: 'Wi-Fi 2.4 GHz',
      gateway: 'Home router', gatewaySub: 'IoT VLAN',
      uplink: 'MQTT 1883/8883',
      cloud: 'Local broker', cloudSub: 'Mosquitto on a Pi',
      clients: [{ name: 'Home Assistant', sub: 'automations' }, { name: 'Relay nodes', sub: 'other rooms' }, { name: 'Log / dashboard', sub: 'score history' }],
    },
    protocol: [
      'Intents are published as JSON on <code>home/voice/&lt;device&gt;/intent</code> with QoS 0. QoS 0 is correct here: if a "lights on" message is lost, the user will simply say it again within two seconds, and a delayed duplicate arriving thirty seconds later would be worse than a loss.',
      'The device also publishes a rolling score log on a separate topic at QoS 0. That stream is what you use to tune thresholds from real data rather than guesses, and it is cheap enough to leave on permanently.',
    ],
    topics: [
      { t: 'home/voice/voice-hub/intent', dir: 'device → broker', payload: 'JSON: device, intent, ts' },
      { t: 'home/voice/voice-hub/score', dir: 'device → broker', payload: 'JSON: label, score, rms, noise_floor' },
      { t: 'home/voice/voice-hub/config', dir: 'broker → device', payload: 'JSON: thresholds[], gate_multiplier' },
      { t: 'home/voice/voice-hub/status', dir: 'device → broker (retained)', payload: '"online" / "offline" (LWT) + model hash' },
    ],
    cloud: [
      'Nothing needs to leave your network. A Mosquitto broker and Home Assistant on the same Raspberry Pi is the complete backend. If you want remote access, expose Home Assistant through a reverse proxy with TLS rather than exposing the broker.',
    ],
    dashboard: [
      'Feed the score topic into InfluxDB and plot score against label over time in Grafana. Two panels are enough: a scatter of accepted scores (which should cluster near 1.0) and a histogram of rejected scores (which tells you exactly how much threshold headroom you have).',
    ],
    mobile: [
      'Adding the device to Home Assistant as an MQTT sensor gives you the mobile app, history and automation engine without writing anything. An automation triggered on <code>intent == "all_off"</code> can then do far more than the four relays on the board — including telling you, via a phone notification, that it heard you.',
    ],
    security: [
      'No audio is transmitted or stored. The ring buffer is overwritten continuously and never written to flash — verify this yourself before trusting the claim on any voice device, including this one.',
      'Use MQTT over TLS and per-device credentials if the broker is reachable from outside the LAN.',
      'Put the hub on an IoT VLAN. It has a microphone; treat it as the most sensitive device on the network even though it does not transmit audio.',
      'Enable ESP32-S3 flash encryption before deployment if physical access is a concern — the model and Wi-Fi credentials are both readable from an unencrypted flash image.',
      'Provide a hardware mute. A physical switch that cuts the microphone supply is the only mute a user can actually verify, and it costs ₹30.',
    ],
  },

  testing: [
    { step: 'Run the I²S capture sketch and speak', expect: 'RMS rises from roughly −60 dBFS in silence to −30 dBFS at one metre. A flat or constant value means wiring or L/R pin trouble.' },
    { step: 'Boot the full firmware', expect: 'Serial prints the model size, arena usage, and "Voice hub listening". The LED ring settles to a dim blue.' },
    { step: 'Stay silent for two minutes', expect: 'The energy gate holds; almost no inference lines are printed and the noise floor value stabilises.' },
    { step: 'Say a trained command from one metre', expect: 'The ring turns cyan while thinking, then green; a 2.4 kHz beep sounds, the relay clicks, and an intent message appears on the broker within roughly 100 ms of the word ending.' },
    { step: 'Say an untrained word', expect: 'The log shows <code>_unknown</code> with a high score and no action is taken. If the device fires, your unknown class is under-trained.' },
    { step: 'Play television audio for one hour with nobody present', expect: 'Zero or at most one false trigger. More than that means the threshold or the negative dataset needs work.' },
    { step: 'Check timing in the serial log', expect: 'Feature extraction 3–5 ms, inference 12–18 ms. Substantially slower means PSRAM is off or the CPU is not at 240 MHz.' },
    { step: 'Measure current draw at 5 V', expect: 'Roughly 70–90 mA idle listening, briefly 180 mA during inference plus Wi-Fi transmit.' },
  ],

  output: [
    'The serial log during a successful recognition, showing the energy gate opening, the feature and inference timings, and the hysteresis counter reaching three:',
    {
      file: 'serial-monitor.txt', lang: 'plain',
      body: `arena used 47104 B, model 59392 B
Voice hub listening — audio stays on this device

_background  0.97  feat 4102 us  inf 15281 us  run 0
_unknown     0.81  feat 4098 us  inf 15266 us  run 0
lights_on    0.71  feat 4110 us  inf 15302 us  run 0
lights_on    0.94  feat 4104 us  inf 15288 us  run 1
lights_on    0.97  feat 4099 us  inf 15274 us  run 2
lights_on    0.96  feat 4107 us  inf 15291 us  run 3
  -> intent lights_on  relay 0 ON  published

_background  0.99  feat 4101 us  inf 15279 us  run 0
fan_off      0.66  feat 4106 us  inf 15285 us  run 0   (below threshold 0.78)
fan_off      0.83  feat 4103 us  inf 15277 us  run 1
fan_off      0.88  feat 4108 us  inf 15294 us  run 2
fan_off      0.91  feat 4100 us  inf 15281 us  run 3
  -> intent fan_off   relay 1 OFF published`,
    },
  ],

  troubleshoot: [
    {
      sym: 'The microphone reads a constant value or pure noise',
      cause: 'Wrong I²S bit width, a floating L/R pin, or the data pin on a GPIO that cannot be routed to I²S input.',
      fix: 'Set <code>I2S_BITS_PER_SAMPLE_32BIT</code>, not 16-bit — the INMP441 sends 24 bits in a 32-bit slot. Tie L/R firmly to GND. Verify the data pin: on the ESP32-S3 most GPIO can be routed via the matrix, but the strapping pins and the USB pins cannot.',
    },
    {
      sym: '<code>AllocateTensors()</code> fails, or the board reboots in setup()',
      cause: 'PSRAM is not enabled in the board menu, so <code>heap_caps_malloc(..., MALLOC_CAP_SPIRAM)</code> returns null and the interpreter dereferences it.',
      fix: 'Set <b>Tools → PSRAM → OPI PSRAM</b> and confirm with <code>ESP.getPsramSize()</code> at boot — it should print 8 388 608. Also check the arena is at least <code>arena_used_bytes()</code>; grow it in 8 KB steps until allocation succeeds.',
    },
    {
      sym: 'Accuracy is excellent in training and terrible on the device',
      cause: 'The firmware feature extraction does not match the training feature extraction. This is by far the most common TinyML audio failure.',
      fix: 'Check every parameter against the training script: sample rate, window length, hop length, FFT size, number of mel bands, mel frequency range, log versus log10, and whether pre-emphasis is applied in both. Dump one spectrogram from the device over serial and compare it numerically against the Python output for the same WAV file — they should agree to three decimal places.',
    },
    {
      sym: 'The hub triggers on the television',
      cause: 'Insufficient negative training data, or hysteresis disabled.',
      fix: 'Record fifteen minutes of that television and add it to the <code>_unknown</code> class, then retrain. Confirm the three-frame run requirement is active. Raising the threshold is the last resort — it trades false accepts for false rejects rather than fixing the model.',
    },
    {
      sym: 'It works for you and not for anyone else in the house',
      cause: 'Single-speaker training data. The model has learned your voice, not the words.',
      fix: 'Every regular user needs to contribute recordings — ideally 30–50 clips per keyword each. This is not optional; it is the difference between a demo and a device.',
    },
    {
      sym: 'Audio dropouts and erratic scores when Wi-Fi is busy',
      cause: 'The Wi-Fi stack runs on core 0 by default and is competing with the audio task.',
      fix: 'Raise the audio task priority to 5 or above, keep the DMA buffer count at 8 or more, and move the MQTT client work into <code>loop()</code> on core 1 as this sketch does. If it persists, reduce the MQTT publish rate — radio transmit bursts are the usual culprit.',
    },
  ],

  perf: [
    'The energy gate is the single biggest power lever. Tuning it so the device runs inference on 5 % of frames rather than 100 % cuts average power by roughly six times.',
    'Precompute the mel filterbank and the Hann window at boot rather than per frame — recomputing <code>cosf()</code> 480 times per frame costs more than the FFT.',
    'Store the mel filterbank sparsely: most weights are zero, and skipping them (<code>if (row[k] > 0)</code>) roughly halves the mel projection cost.',
    'For battery operation, add a two-stage cascade — a tiny 8 KB wake-word model gating the full command model — and put the CPU in light sleep between energy-gate checks.',
  ],

  safety: [
    'A voice-controlled relay can switch a load while nobody is watching. Never put a heater, an iron or anything with a thermal runaway mode on a voice-controlled channel without an independent thermal cut-out.',
    'Fit a physical microphone mute switch. Software mute is not verifiable by the user, and a device with an unverifiable microphone in a bedroom is a reasonable thing for people to object to.',
  ],

  future: [
    'Add a <b>second microphone and simple delay-and-sum beamforming</b>. Two INMP441s 60 mm apart give roughly 4–6 dB of directional gain, which is worth more in a noisy kitchen than any model improvement.',
    'Implement <b>two-stage cascade detection</b> — a tiny always-on wake word gating the full command model — for a large reduction in average power.',
    'Add <b>speaker verification</b> so the hub only accepts commands from enrolled household voices. A small embedding model plus cosine similarity is enough for a home threat model.',
    'Add <b>on-device text-to-speech confirmation</b> using a small concatenative engine, so the hub can say "lights on" instead of beeping.',
    'Support <b>OTA model updates</b> so retraining does not require a USB cable.',
  ],

  faq: [
    { q: 'Can this run on a plain ESP32 instead of an S3?', a: 'Yes, with caveats. Inference goes from about 15 ms to about 45 ms, and without PSRAM you must shrink the model and the ring buffer to fit in internal SRAM — realistically that means four or five keywords instead of eight. It works, and it is a legitimate cheaper build, but the S3\'s vector extensions and PSRAM are exactly what this workload wants and the ₹450 difference buys a lot.' },
    { q: 'Why not just use Alexa or Google Assistant?', a: 'If you are happy with a cloud microphone, they are better at general speech than this will ever be. The reason to build this is that the audio genuinely does not leave the device — which you can verify, because you have the source. It also keeps working when your broadband does not, and it responds in about 120 ms rather than 800 ms because there is no round trip.' },
    { q: 'How many keywords can it handle?', a: 'Practically, eight to twelve. The model size grows only in the final dense layer, so the compute cost is nearly flat, but confusability grows quickly: adding "kitchen light on" alongside "kitchen fan on" means the model must discriminate on one word inside an otherwise identical phrase, and accuracy on that pair drops. Distinct-sounding commands are worth more than clever ones.' },
    { q: 'Do I have to use Edge Impulse?', a: 'No. Edge Impulse gives you the data pipeline, augmentation and deployment export in a browser, which is genuinely convenient and a reasonable first path. The TensorFlow script here does the same thing with full visibility into every step, which matters when something goes wrong. Both deploy to the same TFLite Micro runtime.' },
    { q: 'Why does "off" get recognised worse than "on"?', a: 'Acoustics. "On" is a voiced vowel with strong low-frequency energy; "off" ends in an unvoiced fricative that is quiet, broadband and easily masked by room noise. This is why per-keyword thresholds exist. If it remains a problem, change the command — "lights dark" is recognised far more reliably than "lights off" and users adapt within a day.' },
    { q: 'How much does the enclosure matter?', a: 'A great deal, and it is routinely underestimated. A microphone glued directly to a plastic case picks up every knock on the desk. A port hole that is too small acts as a low-pass filter and kills the consonant energy the model depends on. Always do final threshold tuning with the case closed and the unit in its permanent position.' },
    { q: 'Can I add a new command without retraining everything?', a: 'Not with this architecture — the output layer size and the class semantics are baked into the model. You retrain, which takes about fifteen minutes on a laptop once your dataset is in place. If you expect to add commands often, look at a few-shot approach using an embedding model plus a nearest-neighbour classifier, at the cost of a larger model and lower accuracy.' },
  ],

  refs: [
    { t: 'Zhang et al., "Hello Edge: Keyword Spotting on Microcontrollers" (DS-CNN architecture)', u: 'https://arxiv.org/abs/1711.07128', s: 'arXiv:1711.07128' },
    { t: 'Warden, "Speech Commands: A Dataset for Limited-Vocabulary Speech Recognition"', u: 'https://arxiv.org/abs/1804.03209', s: 'arXiv:1804.03209' },
    { t: 'TensorFlow Lite for Microcontrollers — official guide', u: 'https://ai.google.dev/edge/litert/microcontrollers/overview', s: 'Google AI Edge' },
    { t: 'Post-training integer quantisation — TensorFlow documentation', u: 'https://www.tensorflow.org/lite/performance/post_training_integer_quant', s: 'TensorFlow' },
    { t: 'INMP441 omnidirectional MEMS microphone with I²S — datasheet', u: 'https://invensense.tdk.com/wp-content/uploads/2015/02/INMP441.pdf', s: 'TDK InvenSense' },
    { t: 'ESP32-S3 Technical Reference Manual — I²S peripheral and vector instructions', u: 'https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf', s: 'Espressif Systems' },
    { t: 'Davis & Mermelstein, "Comparison of parametric representations for monosyllabic word recognition" (origin of MFCC)', u: 'https://doi.org/10.1109/TASSP.1980.1163420', s: 'IEEE TASSP, 1980' },
    { t: 'Edge Impulse — keyword spotting tutorial', u: 'https://docs.edgeimpulse.com/docs/tutorials/end-to-end-tutorials/audio-classification', s: 'Edge Impulse' },
  ],

  images: ['esp32', 'neural', 'grafana'],
  imageCaptions: [
    'An ESP32-class development board. The S3 variant used here adds 8 MB of PSRAM and vector instructions aimed at exactly this kind of int8 inference workload.',
    'A schematic feed-forward neural network. The keyword spotter here is a convolutional variant, but the same layer-and-weights structure underlies it.',
    'A time-series dashboard of the kind used to plot recognition scores over time while tuning per-keyword thresholds.',
  ],
},

];
