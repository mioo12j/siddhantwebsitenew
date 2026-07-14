/* Content for: Smart Door Lock (001) */
'use strict';
module.exports = {
  metaTitle: 'Smart Door Lock Project — Keypad, RFID & App-Based Access Control Guide',
  metaDescription: 'A complete engineering guide to building a smart door lock with keypad, RFID and app-based unlock, cloud entry logs and remote access — components, wiring, code and testing explained.',
  keywords: 'smart door lock project, ESP32 door lock, RFID door lock Arduino, keypad door lock project, IoT door lock, smart lock DIY, home automation lock',
  h1: 'Smart Door Lock',
  overview: 'A keypad-and-RFID-based electronic door lock that unlocks with a PIN, a card tap, or a phone app — and keeps a cloud log of every entry.',

  introduction: [
    `A traditional mechanical lock has one obvious weakness: anyone with the right key — cut, copied, or stolen — can open it, and it can never tell you who opened it or when. A <strong>smart door lock</strong> replaces that single point of trust with several independent, revocable ones: a numeric PIN typed on a keypad, an RFID card or fob tapped against a reader, and, optionally, a command sent from a phone app over WiFi. Every one of those methods can be added, changed, or revoked without cutting a new key.`,
    `This project builds a self-contained electronic lock controller around an ESP32, driving a solenoid or electric strike lock through a relay, with a 4x4 matrix keypad and an RFID (RC522) reader as the two physical entry methods, and a cloud-connected app layer for remote unlock and entry logging. It is one of the most popular starter IoT builds precisely because it touches almost every fundamental skill in embedded electronics — digital input scanning, SPI communication, relay-driven actuation, and cloud connectivity — inside a single, genuinely useful device.`
  ],
  objectives: [
    'Build a working electronic door lock that can be opened by PIN, RFID card, or a remote app command.',
    'Log every entry attempt — successful and failed — with a timestamp to a cloud dashboard.',
    'Allow new RFID cards and PINs to be added or revoked without re-wiring or reflashing the device.',
    'Fail safely: the lock should default to a known, secure state if power or WiFi is lost.',
    'Keep the total build cost low enough to be a realistic home or hostel-room retrofit.'
  ],

  problemStatement: [
    `Physical keys cannot be selectively revoked. If a key is lost, copied, or given to someone who should no longer have access, the only real fix is replacing the entire lock cylinder. For shared spaces — hostel rooms, rented apartments, small offices, server rooms — that's expensive and slow, and it provides no record of who actually entered and when.`,
    `The problem this project solves is access control with accountability: multiple ways to authenticate (something you know — a PIN; something you have — an RFID card; something you can trigger remotely — an app command), each of which can be independently added or revoked in software, combined with a permanent, timestamped log of every access event.`
  ],
  applications: [
    'Home and apartment front-door access control with keyless entry for family members.',
    'Hostel and PG room locks where residents change every semester and keys are easy to lose.',
    'Small office or server-room access control with an audit trail of entries.',
    'Rental property smart locks that let an owner issue and revoke guest access remotely.',
    'Lab or workshop equipment cabinets that need a logged, restricted-access history.'
  ],
  useCases: [
    `A hostel warden issues each new resident an RFID card programmed to their room lock only; when the resident checks out, the card is deleted from the access list in seconds rather than requiring a cylinder change.`,
    `A homeowner traveling abroad grants a house-sitter a temporary PIN through the companion app, valid only for the dates they're away, and reviews the entry log afterward to confirm when the house was accessed.`,
    `A small startup uses the same platform on its server-room door, so that every entry is logged against an individual's card ID for security compliance rather than a shared physical key everyone carries.`
  ],

  workingPrinciple: [
    `The ESP32 continuously scans the 4x4 keypad matrix and listens for RFID tags on the RC522 reader's SPI bus, while also maintaining a WiFi connection to the cloud backend for remote-command polling. When a valid PIN is entered on the keypad, or a card with an authorised UID is tapped, the firmware checks it against a locally cached access list (synced periodically from the cloud, so the lock keeps working even during a brief WiFi outage), and — if authorised — energises the relay that drives the electric strike or solenoid lock for a fixed unlock duration, typically 3–5 seconds, before automatically re-locking.`,
    `Every attempt, successful or not, is timestamped and queued for upload to the cloud dashboard the next time the device has connectivity, so entry logs are never silently lost even if the network is briefly unavailable. The app layer works in the opposite direction: a command issued from the phone app is picked up by the ESP32 on its next poll (or pushed instantly if using MQTT) and treated exactly like a keypad or card authorisation for logging purposes.`
  ],
  systemArchitecture: [
    `The system has three layers. The <strong>edge layer</strong> is the ESP32 and its directly wired peripherals — keypad, RFID reader, relay/lock driver, and a status LED/buzzer for feedback. The <strong>connectivity layer</strong> is the ESP32's WiFi link to the internet, using either HTTPS polling or MQTT publish/subscribe to talk to the backend. The <strong>cloud layer</strong> is a lightweight backend (Firebase Realtime Database, or an MQTT broker such as HiveMQ paired with a small web dashboard) that stores the access list, receives entry logs, and issues remote-unlock commands from the app.`
  ],
  designMethodology: [
    `The design follows a fail-local, sync-when-possible principle common to reliable IoT access control: the ESP32 always keeps a local copy of the authorised PIN and RFID list in flash (via <code>Preferences</code>/NVS), so the door can still be unlocked by a known card or PIN even if the internet is down. The cloud is treated as the source of truth for adding/removing credentials and for long-term log storage, but never as a single point of failure for basic unlock functionality — a deliberate choice, since a door lock that stops working without WiFi is a worse product than a slightly-delayed log sync.`
  ],
  hardwareArchitecture: [
    `At the core is an <strong>ESP32 DevKit</strong>, chosen over a plain Arduino specifically for its WiFi radio. It drives a <strong>5V single-channel relay module</strong>, which in turn switches a 12V electric strike lock or solenoid lock (relays are used rather than driving the lock directly from a GPIO pin because the lock draws far more current than an ESP32 pin can safely supply). A <strong>4x4 matrix keypad</strong> is wired to 8 GPIO pins for row/column scanning, and an <strong>MFRC522 RFID reader</strong> is wired over the ESP32's SPI bus. A small buzzer and RGB or dual-colour LED give immediate audible/visual feedback for accepted and rejected entries.`
  ],
  softwareArchitecture: [
    `The firmware is structured as a small state machine: <em>Idle</em> (scanning keypad and RFID), <em>Authenticating</em> (checking an entered PIN or scanned UID against the local access list), <em>Unlocked</em> (relay energised, countdown timer running), and <em>Logging</em> (queuing the event for upload). WiFi and cloud-sync logic run as a loosely coupled background task so a slow or failed network call never blocks the keypad or RFID scan loop — a critical design choice, since nothing frustrates a user faster than a door that hesitates because a cloud API call is timing out.`
  ],

  components: [
    { name: 'ESP32 DevKit v1 (WiFi + BLE microcontroller)', qty: '1', note: 'Main controller' },
    { name: '4x4 matrix membrane keypad', qty: '1', note: 'PIN entry' },
    { name: 'MFRC522 RFID reader module + tags/cards', qty: '1 reader + 3 tags', note: 'SPI interface' },
    { name: '5V single-channel relay module', qty: '1', note: 'Switches the lock' },
    { name: '12V electric strike lock or solenoid lock', qty: '1', note: 'The physical locking mechanism' },
    { name: '12V 1A DC power adapter', qty: '1', note: 'Powers the lock coil' },
    { name: 'AMS1117 3.3V regulator / breadboard power module', qty: '1', note: 'Regulates logic power if not using dev board USB' },
    { name: 'Piezo buzzer', qty: '1', note: 'Audible feedback' },
    { name: 'Bi-colour (red/green) LED', qty: '1', note: 'Status indication' },
    { name: 'Jumper wires, breadboard/perfboard, enclosure', qty: 'assorted', note: 'Wiring and housing' }
  ],
  bom: [
    { item: 'ESP32 DevKit v1', qty: 1, specNote: '30-pin, WROOM-32', estCostINR: '450' },
    { item: '4x4 Matrix Keypad', qty: 1, specNote: 'Membrane type', estCostINR: '90' },
    { item: 'MFRC522 RFID Kit', qty: 1, specNote: 'Reader + 2 cards + 1 keyfob', estCostINR: '150' },
    { item: '5V Relay Module', qty: 1, specNote: '1-channel, opto-isolated', estCostINR: '80' },
    { item: '12V Electric Strike Lock', qty: 1, specNote: 'Fail-secure type', estCostINR: '600' },
    { item: '12V 1A Power Adapter', qty: 1, specNote: 'For lock coil', estCostINR: '250' },
    { item: 'Buzzer + LED + resistors', qty: 1, specNote: 'Misc feedback components', estCostINR: '60' },
    { item: 'Perfboard, wires, enclosure box', qty: 1, specNote: 'Assembly & housing', estCostINR: '350' }
  ],
  specifications: [
    { name: 'Controller', detail: 'ESP32-WROOM-32, dual-core 240MHz, WiFi 802.11 b/g/n, BLE 4.2' },
    { name: 'Keypad input', detail: '4x4 matrix, 8 GPIO pins (4 rows + 4 columns)' },
    { name: 'RFID frequency', detail: '13.56MHz (MIFARE Classic 1K compatible tags)' },
    { name: 'Lock actuation', detail: '12V DC electric strike, fail-secure (stays locked on power loss)' },
    { name: 'Unlock duration', detail: '3–5 seconds, configurable in firmware' },
    { name: 'Connectivity', detail: 'WiFi 2.4GHz; HTTPS polling or MQTT for cloud sync' }
  ],
  estimatedCost: { low: '1,800', high: '2,400', note: 'India retail pricing; costs drop noticeably when sourced as a kit.' },

  tools: ['Soldering iron and solder', 'Wire strippers', 'Small screwdriver set', 'Multimeter', 'Hot glue gun (for cable strain relief)', 'Drill (for enclosure and door-frame mounting)'],
  software: ['Arduino IDE (or PlatformIO)', 'Firebase console or an MQTT broker dashboard (e.g. HiveMQ Cloud)', 'A basic phone app — MIT App Inventor, Blynk, or a small custom Flutter/React Native app'],
  languages: ['C/C++ (ESP32 firmware, Arduino framework)', 'JavaScript/JSON (cloud backend & app configuration, if using Firebase)'],
  ide: ['Arduino IDE 2.x with the ESP32 board package installed', 'PlatformIO (VS Code extension) as an alternative for larger firmware'],
  libraries: ['<code>MFRC522</code> (RFID reader driver)', '<code>Keypad</code> (matrix keypad scanning)', '<code>WiFi.h</code> / <code>HTTPClient.h</code> (ESP32 core)', '<code>PubSubClient</code> (MQTT, if used)', '<code>Preferences.h</code> (NVS flash storage for the local access list)', '<code>ArduinoJson</code> (parsing cloud responses)'],
  protocols: ['SPI (RFID reader)', 'GPIO matrix scanning (keypad)', 'WiFi / HTTPS (cloud sync)', 'MQTT (optional, for instant remote unlock)'],

  power: [
    `The system needs two separate power rails. The <strong>ESP32 and logic-level components</strong> (keypad, RFID reader, LED, buzzer) run on 3.3V/5V, typically supplied via USB or a small 5V adapter. The <strong>electric strike lock</strong> needs its own 12V 1A supply, switched through the relay — never powered directly from the ESP32's 3.3V regulator, which cannot supply anywhere near the current a lock coil draws. Keep the two power domains electrically separate except through the relay's isolated contacts, and always add a flyback diode across the lock coil (most electric strikes include one internally, but verify before wiring) to protect the relay contacts from inductive kickback when the coil switches off.`
  ],
  wiring: [
    `Wire the keypad's 8 pins to 8 ESP32 GPIOs (e.g. GPIO 13,12,14,27 for rows and GPIO 26,25,33,32 for columns — any free digital pins work, since the <code>Keypad</code> library handles the matrix scan logic in software). Wire the MFRC522 over SPI: SDA→GPIO5, SCK→GPIO18, MOSI→GPIO23, MISO→GPIO19, RST→GPIO4, with 3.3V and GND shared with the ESP32 (the MFRC522 is a 3.3V-only module — do not run it from 5V). Wire the relay module's signal pin to a spare GPIO (e.g. GPIO2), with the relay's own VCC from 5V and GND common with the ESP32. The relay's normally-open (NO) and common (COM) contacts are wired in series with the 12V supply feeding the electric strike, so the lock only receives power when the relay is energised.`
  ],

  assembly: [
    'Mount the ESP32 and relay module on a perfboard or inside a project enclosure, keeping the 12V lock wiring physically separated from the 3.3V/5V logic wiring.',
    'Fix the keypad and RFID reader to the outward-facing side of the door frame or an external housing, running their wires back to the main enclosure.',
    'Install the electric strike lock into the door frame, replacing or supplementing the existing mechanical strike plate, following the lock\'s mounting template.',
    'Route the 12V power adapter to the relay\'s switched side, and confirm the lock is wired for "fail-secure" behaviour (stays locked with no power) unless your use case specifically needs fail-safe (unlocked with no power) for fire-egress reasons.',
    'Mount the buzzer and status LED where they are visible/audible from outside the door for clear unlock feedback.'
  ],
  implementation: [
    'Set up the Arduino IDE with the ESP32 board package and install the MFRC522, Keypad, PubSubClient and ArduinoJson libraries.',
    'Wire and test each peripheral individually first — print raw keypad presses to Serial, print scanned RFID UIDs to Serial — before integrating them into the full firmware.',
    'Write the local access-list storage logic using Preferences (NVS), and hard-code one test PIN and one test RFID UID to validate the unlock relay logic end-to-end.',
    'Add WiFi connection logic with automatic reconnection, and integrate either HTTPS polling or MQTT to sync the access list from the cloud backend and push entry logs.',
    'Build the minimal cloud backend (Firebase Realtime Database structure, or an MQTT topic scheme) to store the access list and receive logs.',
    'Build or configure the phone app to display the entry log and send remote-unlock commands, and test the full loop: app command → cloud → ESP32 → relay → lock.',
    'Mount everything in its final enclosure and do a full end-to-end test on the actual door before relying on it daily.'
  ],
  codingMethodology: [
    `The firmware is organised around a non-blocking main loop: keypad and RFID are polled every iteration with no <code>delay()</code> calls longer than a few milliseconds, WiFi/cloud communication happens on a timer-based schedule (e.g. every 5 seconds) rather than blocking the loop, and the relay unlock duration is handled with a <code>millis()</code>-based timer rather than a blocking <code>delay()</code> — this is the single most important habit in this build, since a blocking delay during an unlock would freeze keypad scanning and could make the lock feel unresponsive or double-trigger on a second keypress.`
  ],
  algorithm: [
    `On each loop iteration: (1) scan the keypad buffer for a completed PIN entry (terminated by <code>#</code>); (2) check the RFID reader for a newly presented card; (3) if either produces a candidate credential, hash or directly compare it against the locally cached access list; (4) on a match, energise the relay, start the unlock timer, log the event locally, and queue it for cloud upload; (5) on no match, trigger the buzzer's "denied" pattern and log the failed attempt; (6) independently, check the unlock timer and de-energise the relay once it expires; (7) on a fixed interval, check for pending remote-unlock commands and pending access-list updates from the cloud.`
  ],

  testing: [
    `Test each authentication path independently before combining them: confirm 10/10 successful unlocks with the correct PIN, 10/10 rejections with an incorrect PIN, and the same for the RFID card, including testing with an unauthorised card to confirm it's correctly rejected. Then test the network-dependent paths — remote app unlock, and log upload — including deliberately disconnecting WiFi mid-test to confirm the lock still works locally and queues logs for later upload rather than losing them.`
  ],
  calibration: [
    `There is no analog sensor to calibrate in this build, but two practical adjustments matter: tuning the unlock duration (long enough for a door to be pushed open, short enough to avoid holding the strike energised longer than necessary) and confirming the electric strike's mechanical alignment with the door frame so it releases cleanly every time rather than binding under spring tension.`
  ],
  sampleOutput: [
    `On a successful PIN entry, the Serial monitor shows a line such as <code>[AUTH] PIN match — user: Guest — unlocking (4s)</code>, followed by <code>[LOG] queued entry event for upload</code>. The cloud dashboard's entry log table then shows a new row with a timestamp, method (PIN/RFID/App), and result (Granted/Denied) within a few seconds of connectivity.`
  ],
  expectedResults: [
    'Correct PIN and authorised RFID cards unlock the door within under 1 second of entry.',
    'Incorrect PINs and unauthorised cards are rejected with clear audible/visual feedback and are still logged.',
    'The lock continues to function for known credentials during a WiFi outage, with logs syncing automatically once connectivity returns.',
    'Remote app unlock commands are reflected at the door within a few seconds under normal network conditions.'
  ],

  troubleshooting: [
    { issue: 'Relay clicks but the lock never releases', fix: 'Check the 12V supply is actually reaching the strike (measure with a multimeter under load) — a relay clicking with no lock movement is almost always a power-side wiring or fuse issue, not a firmware bug.' },
    { issue: 'RFID reader intermittently fails to detect cards', fix: 'Confirm the MFRC522 is wired to 3.3V, not 5V — this is the most common cause of unreliable reads, along with loose SPI wiring or an antenna placed too close to metal.' },
    { issue: 'Keypad registers phantom or missed keypresses', fix: 'Add a short software debounce delay per key event and double-check row/column pin assignments match the library configuration exactly.' },
    { issue: 'Device won\'t reconnect to WiFi after a router restart', fix: 'Implement an explicit reconnect routine with exponential backoff rather than relying on the default WiFi library behaviour, which can occasionally stall.' },
    { issue: 'Logs never appear on the cloud dashboard', fix: 'Verify the device\'s time is synced (NTP) if your backend requires accurate timestamps, and check the cloud API key/credentials haven\'t expired or been rate-limited.' }
  ],
  commonMistakes: [
    'Powering the electric strike lock directly from the ESP32 or a breadboard power rail instead of a dedicated 12V supply — this can brown out the microcontroller or damage the regulator.',
    'Skipping the flyback diode across the lock coil, risking relay contact damage over repeated cycles.',
    'Hard-coding a single master PIN into the firmware without an easy way to change it — always build in a secure way to update credentials.',
    'Forgetting to make the lock fail-secure by default, which could leave a door unlocked during a power cut.',
    'Not testing the local (offline) unlock path at all, only discovering it doesn\'t work after the WiFi goes down in real use.'
  ],
  safety: [
    'Always disconnect power before wiring or rewiring the relay and lock circuit.',
    'Keep the 12V lock wiring physically separated from the 3.3V/5V logic wiring to avoid accidental shorts.',
    'Choose fail-secure vs. fail-safe lock behaviour deliberately based on your building\'s fire-egress requirements — do not default to whatever the lock ships as without checking.',
    'Never rely on this as the sole security measure for a safety-critical space without a manual mechanical override or key bypass.',
    'Use a fused or current-limited 12V supply appropriately rated for the lock coil to avoid a wiring-fault fire risk.'
  ],

  performance: [
    `In typical use, PIN and RFID authentication complete in well under a second, since both are checked against a locally cached list rather than requiring a network round-trip. Cloud log sync latency depends on WiFi quality but is typically 1–5 seconds under normal conditions. The main real-world limitation is not speed but robustness of the physical lock mechanism itself — cheap electric strikes can develop mechanical play over thousands of cycles, which is worth inspecting periodically.`
  ],
  advantages: [
    'Multiple independent, revocable authentication methods in one device.',
    'Continues working locally during WiFi outages.',
    'Full timestamped audit trail of every entry attempt.',
    'Remote unlock and access management without physical key handovers.',
    'Relatively low total cost compared to commercial smart locks.'
  ],
  limitations: [
    'RFID (MIFARE Classic) tags used in budget kits are not cryptographically strong and can, with effort, be cloned — not suitable for high-security applications without upgrading to encrypted tags.',
    'A determined intruder with physical access to the door frame could still defeat the mechanical strike itself, independent of the electronics.',
    'Cloud dependency for remote unlock means that feature specifically requires internet connectivity, even though local PIN/RFID unlock does not.',
    'A dead backup battery (if one is added) or a prolonged power outage will eventually stop the whole system from functioning.'
  ],
  future: [
    'Add a battery backup with low-power sleep modes to keep the lock functional through power outages.',
    'Upgrade to encrypted RFID/NFC tags (e.g. MIFARE DESFire) for stronger anti-cloning security.',
    'Add biometric fingerprint authentication as a fourth entry method.',
    'Implement end-to-end encrypted communication between the device and cloud backend rather than plain HTTPS/MQTT.',
    'Add a mechanical key override cylinder as a physical fail-safe alongside the electronic lock.'
  ],

  faqs: [
    { q: 'Is this lock safe to use as my only front-door lock?', a: 'It can be, but most builders start by using it alongside their existing mechanical lock, and only rely on it exclusively once they\'ve tested it thoroughly through several WiFi outages, power cuts, and false-rejection scenarios.' },
    { q: 'What happens if the ESP32 loses power completely?', a: 'With a fail-secure electric strike (the recommended default), the door stays locked with no power — you would need a mechanical key override or a battery backup to enter until power is restored.' },
    { q: 'Can I add or remove RFID cards without reflashing the firmware?', a: 'Yes — the access list is stored separately from the firmware in flash (NVS) and synced from the cloud, so adding or revoking a card is a database change, not a firmware update.' },
    { q: 'Does this work without an internet connection?', a: 'PIN and RFID unlock both work fully offline using the locally cached access list; only remote app unlock and live log sync require connectivity.' },
    { q: 'How secure is the RFID authentication really?', a: 'Budget MIFARE Classic cards are convenient but not cryptographically strong; for anything security-critical, upgrade to an encrypted tag standard as noted in Future Improvements.' }
  ],

  conclusion: [
    `The Smart Door Lock is a genuinely practical entry point into IoT and embedded systems: it forces you to combine digital input scanning, SPI peripherals, relay-driven actuation, local data storage, and cloud connectivity into one device that solves a real problem the moment it's mounted on a door. Building it well — with a fail-secure default, an offline-capable local access list, and a non-blocking firmware structure — teaches habits that carry directly into far more complex connected-hardware projects.`
  ],
  references: [
    'Espressif Systems — ESP32 Technical Reference Manual (official chip documentation for GPIO, SPI and WiFi peripherals).',
    'NXP Semiconductors — MFRC522 datasheet (RFID reader IC specifications and SPI command set).',
    'Arduino Reference — Keypad and SPI library documentation.',
    'MQTT.org — MQTT protocol specification, for projects using MQTT-based cloud sync.',
    'General electric-strike lock installation guidelines from lock manufacturer datasheets (fail-secure vs. fail-safe wiring).'
  ],
  relatedSlugs: ['rfid-access-control', 'visitor-management-kiosk', 'smart-tamper-safe', 'door-window-breach-alarm', 'nfc-smart-attendance']
};
