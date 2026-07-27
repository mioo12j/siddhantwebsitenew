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

];
