/* ═══════════════════════════════════════════════════════════════════
   Smart Home — projects 005–010
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 005 · Smart Plug Energy Monitor ─────────────────────────────── */
{
  id: '005',
  domainKey: 'electronics',
  emoji: '🔌',
  thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '10–15 hours',
  iso8601: 'PT12H',
  tagline: 'A mains socket that measures true power — not the fiction you get from multiplying RMS voltage by RMS current — logs kilowatt-hours per appliance, and switches the load on a schedule or from your phone.',

  overview: [
    'Most "energy monitor" projects measure current with an ACS712 or a clamp, assume the mains is a clean 230 V sine, multiply, and report a number. For a resistive load such as a heater that number is roughly right. For anything with a switch-mode supply — a laptop charger, an LED bulb, a fridge — it can be wrong by 40 % or more, because the current is not in phase with the voltage and is not sinusoidal.',
    'This build uses a PZEM-004T v3, which samples voltage and current simultaneously and integrates their product over each cycle. That is the definition of <b>real power</b>, and it is the only measurement that corresponds to what your electricity meter bills you for. The module also reports apparent power, power factor and frequency, so you can see exactly how badly the naive calculation would have failed for each appliance.',
    'The safety architecture matters more here than in any other project in this catalogue, because the measurement side sits at mains potential. The PZEM\'s UART is opto-isolated, and that isolation boundary is the only thing between 230 V and your ESP32 — and, through the USB cable, your laptop. Respect it: never bridge the grounds, never probe the mains side with an oscilloscope that is earthed, and never work on this powered.',
    'The result is per-appliance data you can actually act on. Standby draw is usually the surprise: a television that reads 0.4 W on paper often measures 8 W in reality, which is 70 kWh a year doing nothing.',
  ],

  does: [
    'Measures true RMS voltage, current, real power, apparent power, power factor, frequency and cumulative energy.',
    'Switches the load through a 16 A relay with a schedule, a phone command, or a standby-power auto-off rule.',
    'Publishes a full metering payload over MQTT once per second and integrates kilowatt-hours locally.',
    'Detects appliance state — off, standby, active — from the power signature and reports it as a category.',
    'Estimates running cost from a configurable tariff, including a two-tier slab structure.',
    'Retains the energy counter through power cuts by writing to NVS.',
    'Alerts on over-current, over-voltage and unexpected standby draw.',
  ],

  features: [
    '<b>True power measurement</b> via the PZEM-004T v3, not a current-only approximation.',
    '<b>Opto-isolated Modbus-RTU link</b> at 9600 baud — the one safety boundary in the design.',
    '<b>16 A relay</b> with a snubber network across the contacts to suppress arcing on inductive loads.',
    '<b>Non-volatile energy accumulation</b> that survives power loss without wearing out flash.',
    '<b>Appliance state classification</b> from power thresholds with hysteresis.',
    '<b>Tariff-aware cost estimation</b> with slab rates.',
    '<b>Home Assistant discovery</b> for switch, power, energy, voltage, current and power-factor entities.',
    '<b>Over-current trip</b> in firmware that opens the relay well before the fuse would blow.',
  ],

  applications: [
    { t: 'Appliance auditing', d: 'Find out what is actually consuming your electricity. The results are usually not what people expect.' },
    { t: 'Standby elimination', d: 'Automatically cut power when a device drops below its standby threshold for ten minutes.' },
    { t: 'Solar self-consumption', d: 'Schedule high-draw appliances into the hours when your panels are producing.' },
    { t: 'Rental and shared-space billing', d: 'Per-socket kilowatt-hour records give a defensible basis for splitting a bill.' },
    { t: 'Fault detection', d: 'A motor whose power draw creeps up over months is a bearing failing. This catches it before it fails.' },
    { t: 'Server and lab equipment', d: 'Power-cycle a hung device remotely, with a record of how much it drew before it hung.' },
  ],

  skills: [
    'Mains wiring competence and genuine respect for it — this is not a beginner project',
    'Understanding of real, apparent and reactive power and power factor',
    'UART and the basics of Modbus-RTU register reads',
    'Arduino C++ with non-blocking timing',
    'MQTT and Home Assistant discovery',
    'Enclosure and creepage/clearance basics',
  ],

  prereq: [
    'If you are not confident working with mains, build this to measure only — omit the relay entirely, and use a commercially certified smart plug for switching. You lose nothing pedagogically and you keep your hands.',
  ],

  parts: ['esp32', 'pzem004t', 'relay1', 'oled', 'buck', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'IEC/mains inlet + socket outlet pair', spec: '16 A rated, screw terminals', qty: 1, price: 320 },
    { name: '5 V 1 A isolated AC-DC module (HLK-PM01)', spec: '100–264 VAC in, 5 V 0.6 A out, 3 kV isolation', qty: 1, price: 380, note: 'Replaces the buck converter and a separate adapter — one mains feed powers everything.' },
    { name: 'Snubber network (100 nF X2 + 100 Ω 2 W)', spec: 'RC across the relay contacts', qty: 1, price: 60, note: 'Suppresses contact arcing on inductive loads; roughly triples relay life.' },
    { name: 'MOV (275 V varistor) + 16 A fuse and holder', spec: 'S14K275 varistor, ceramic fuse', qty: 1, price: 120 },
    { name: 'Cable glands and 1.5 mm² mains cable', spec: 'PG9 glands, 3-core', qty: 1, price: 220 },
  ],
  cost: '₹3,800 – ₹4,900',
  libs: ['wifi', 'pubsub', 'arduinojson', 'modbus', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'PZEM-004T v3', devPin: 'TX', pin: 'GPIO 16 (RX2)', sig: 'Modbus-RTU 9600 8N1' },
      { dev: 'PZEM-004T v3', devPin: 'RX', pin: 'GPIO 17 (TX2)', sig: 'Through the opto-isolator' },
      { dev: 'PZEM-004T v3', devPin: '5V / GND', pin: '5 V / GND', sig: 'Logic side only' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x3C' },
    ],
    right: [
      { dev: 'Relay module → live conductor', devPin: 'IN', pin: 'GPIO 26', sig: 'Active-low' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Through 330 Ω' },
    ],
  },
  wiringNotes: [
    '<b>The PZEM current transformer goes around the live conductor only.</b> Passing both live and neutral through the CT gives a reading of zero, because the two currents cancel. This catches almost everyone the first time.',
    'The PZEM voltage sense terminals connect across live and neutral <em>upstream</em> of the relay, so voltage is still measured when the load is switched off.',
    'The relay switches the <b>live</b> conductor, never the neutral. Switching neutral leaves the appliance live at its terminals when "off", which is exactly the hazard the switch is supposed to remove.',
    'Maintain at least 6 mm of creepage between mains tracks and low-voltage tracks on perfboard, and route a slot in the board between the two domains if you can. Do not run a mains track under the ESP32.',
    'Fit the MOV between live and neutral upstream of everything, and the fuse in the live line before the MOV. A varistor without an upstream fuse fails as a short circuit and then as a fire.',
    'The HLK-PM01 supplies both the ESP32 and the PZEM logic side from mains, so there is only one cable into the box. Its output is isolated from mains, but treat its input terminals as live at all times.',
  ],

  block: {
    columns: [
      { label: 'Mains', blocks: [{ name: 'Inlet + fuse + MOV', sub: '16 A protection' }, { name: 'Current transformer', sub: 'live conductor only' }] },
      { label: 'Metering', edge: 'V and I', blocks: [{ name: 'PZEM-004T v3', sub: 'true power, PF', highlight: true }, { name: 'Opto-isolated UART', sub: 'safety boundary' }] },
      { label: 'Control', edge: 'Modbus', blocks: [{ name: 'ESP32', sub: 'integrate kWh', highlight: true }, { name: 'Rules engine', sub: 'schedule, standby' }] },
      { label: 'Output', edge: 'decisions', blocks: [{ name: '16 A relay', sub: 'switches live' }, { name: 'MQTT + OLED', sub: 'telemetry' }] },
    ],
  },

  flow: [
    { t: 'Boot: restore kWh counter from NVS', k: 'start' },
    { t: 'Read PZEM registers over Modbus (1 Hz)', k: 'proc' },
    { t: 'Read valid?', k: 'dec', yes: 'yes', no: 'retry, flag comms fault', back: 1 },
    { t: 'Integrate energy, classify appliance state', k: 'proc' },
    { t: 'Over-current or over-voltage?', k: 'dec', yes: 'trip relay open', no: 'continue', back: 1 },
    { t: 'Apply schedule and standby rules', k: 'proc' },
    { t: 'Publish metering payload over MQTT', k: 'io' },
    { t: 'Persist kWh every 10 minutes', k: 'end' },
  ],

  principle: [
    'Instantaneous power is <code>p(t) = v(t)·i(t)</code>. Real power is its average over a whole number of cycles. For a purely resistive load, current follows voltage exactly and that average equals <code>V_rms × I_rms</code>. For everything else it does not, and the ratio between the two is the <b>power factor</b>.',
    'Two separate effects reduce power factor. <b>Displacement</b> is a phase shift between voltage and current, caused by inductance (motors) or capacitance. <b>Distortion</b> is current that is not sinusoidal at all, which is what every switch-mode power supply produces: it draws current only near the voltage peaks, in short high spikes. A laptop charger can have a power factor of 0.55 purely from distortion, with no phase shift whatsoever.',
    'This is why a current-only measurement fails. An ACS712 tells you <code>I_rms</code>. Multiplying by an assumed 230 V gives apparent power in volt-amperes, not watts. For that laptop charger you would report almost twice its real consumption. The PZEM avoids this by digitising both channels and computing the true average of the product — the same thing your utility meter does.',
    'Energy is the time integral of real power: <code>E = ∫P dt</code>, in joules, or in kilowatt-hours if you divide by 3.6 million. The firmware integrates numerically using the trapezoidal rule at 1 Hz, which for a signal whose meaningful changes happen over seconds is more than accurate enough. The PZEM keeps its own energy counter too, and comparing the two is a useful sanity check on your integration.',
    'Appliance state classification exploits the fact that most devices have three distinct power regimes with large gaps between them. A television might draw 0.1 W truly off, 8 W in standby, and 90 W active. Two thresholds with hysteresis separate them robustly, and the classification is far more useful than raw watts when you are looking at a month of data.',
    'The snubber across the relay contacts deserves a note because it is routinely omitted. When a relay opens an inductive load, the collapsing field drives the voltage across the opening contacts high enough to strike an arc, which erodes the contact material. An RC network — typically 100 nF in series with 100 Ω — gives the energy somewhere to go during the microseconds while the gap is still small. It roughly triples contact life on a motor load.',
  ],

  equations: [
    { t: 'Real, apparent and reactive power', eq: 'P (real, W)      = (1/T) ∫ v(t)·i(t) dt\nS (apparent, VA) = V_rms × I_rms\nQ (reactive, var)= √(S² − P²)\nPF               = P / S\n\nExample — 65 W laptop charger measured:\n  V_rms = 231.4 V\n  I_rms = 0.51 A\n  S     = 118.0 VA\n  P     = 64.8 W        (measured, not derived)\n  PF    = 0.55\n\nA current-only monitor would report 118 W — 82 % too high.' },
    { t: 'Energy integration', eq: 'E(kWh) = Σ [ (P_n + P_(n−1)) / 2 ] × Δt / 3 600 000\n\nAt 1 Hz with P in watts and Δt = 1 s:\n  ΔE = P_avg / 3 600 000  kWh per sample\n\nA 100 W load for one hour:\n  3600 samples × 100 / 3 600 000 = 0.100 kWh  ✓' },
    { t: 'Relay and conductor sizing', eq: 'Load          = 16 A resistive at 230 V = 3680 W\nRelay rating  = 16 A @ 250 VAC  → utilisation 100 %  ✗\n\nDerate: a relay rated 16 A resistive should carry\n≤ 10 A continuously in an enclosed box at 40 °C.\n\nSafe continuous load: 10 A → 2300 W\nCable: 1.5 mm² is rated ~16 A in free air,\n       ~13 A enclosed — adequate for 10 A.\nFuse: 12 A, so it opens before the relay welds.' },
  ],

  steps: [
    {
      h: 'Read the PZEM before touching anything else',
      p: ['Wire only the PZEM and the ESP32, with the PZEM measuring a known load such as a 60 W lamp on a proper extension lead. Confirm the readings are sane before you build anything into an enclosure.'],
      code: {
        file: '01-pzem-read.ino', lang: 'cpp',
        body: `#include <ModbusMaster.h>

#define PZEM_RX 16     // ESP32 RX2  <- PZEM TX
#define PZEM_TX 17     // ESP32 TX2  -> PZEM RX
#define PZEM_ADDR 0xF8 // factory default broadcast address

ModbusMaster pzem;

struct Meter { float v, i, w, wh, hz, pf; bool ok; };

void meterBegin() {
  Serial2.begin(9600, SERIAL_8N1, PZEM_RX, PZEM_TX);
  pzem.begin(PZEM_ADDR, Serial2);
}

Meter meterRead() {
  Meter m = {0, 0, 0, 0, 0, 0, false};

  // Input registers 0x0000-0x0009 hold every measurement in one read.
  uint8_t rc = pzem.readInputRegisters(0x0000, 10);
  if (rc != pzem.ku8MBSuccess) return m;

  uint16_t r[10];
  for (int i = 0; i < 10; i++) r[i] = pzem.getResponseBuffer(i);

  m.v  =  r[0] / 10.0f;                                  // 0.1 V
  m.i  = ((uint32_t)r[2] << 16 | r[1]) / 1000.0f;        // 0.001 A, 32-bit
  m.w  = ((uint32_t)r[4] << 16 | r[3]) / 10.0f;          // 0.1 W,  32-bit
  m.wh = ((uint32_t)r[6] << 16 | r[5]);                  // 1 Wh,   32-bit
  m.hz =  r[7] / 10.0f;                                  // 0.1 Hz
  m.pf =  r[8] / 100.0f;                                 // 0.01
  m.ok = true;
  return m;
}`,
        explain: [
          { ref: 'readInputRegisters(0x0000, 10)', txt: 'One transaction fetches everything. Reading registers individually multiplies the bus traffic by ten and makes 1 Hz sampling marginal at 9600 baud.' },
          { ref: '(uint32_t)r[2] << 16 | r[1]', txt: 'Current, power and energy are 32-bit values split across two 16-bit registers, <b>low word first</b>. Getting the word order backwards produces values that look almost plausible, which makes it a nasty bug.' },
          { ref: 'PZEM_ADDR 0xF8', txt: 'The default broadcast address works with a single meter on the bus. If you put several on one RS-485 segment, each needs a unique address written to holding register 0x0002 first.' },
          { ref: 'm.ok = false on failure', txt: 'Never treat a failed Modbus read as zero watts. It will corrupt your energy total and, worse, make a running appliance look switched off to the standby rule.' },
        ],
      },
      tip: 'Compare the PZEM\'s own <code>wh</code> counter against your integrated total after an hour. They should agree within about 1 %. A large divergence means your sample loop is dropping reads.',
    },
    {
      h: 'Integrate energy and persist it safely',
      p: ['Flash has a finite erase-cycle budget. Writing the counter every second would exhaust an NVS partition in months.'],
      code: {
        file: '02-energy-accumulate.ino', lang: 'cpp',
        body: `#include <Preferences.h>
Preferences prefs;

double   energyKwh   = 0;
float    lastWatts   = 0;
uint32_t lastSample  = 0, lastPersist = 0;

void energyBegin() {
  prefs.begin("meter", false);
  energyKwh = prefs.getDouble("kwh", 0.0);
}

void energyAccumulate(float watts) {
  uint32_t now = millis();
  if (lastSample) {
    float dt = (now - lastSample) / 1000.0f;             // seconds
    if (dt > 0 && dt < 10) {                             // reject huge gaps
      double avg = (watts + lastWatts) / 2.0;            // trapezoidal
      energyKwh += avg * dt / 3600000.0;
    }
  }
  lastSample = now;
  lastWatts  = watts;

  // Persist every 10 minutes, and only if the value actually moved.
  if (now - lastPersist > 600000UL) {
    lastPersist = now;
    double stored = prefs.getDouble("kwh", 0.0);
    if (fabs(energyKwh - stored) > 0.0005) prefs.putDouble("kwh", energyKwh);
  }
}

float costOf(double kwh, float slab1Rate, float slab1Units, float slab2Rate) {
  if (kwh <= slab1Units) return kwh * slab1Rate;
  return slab1Units * slab1Rate + (kwh - slab1Units) * slab2Rate;
}`,
        explain: [
          { ref: 'dt > 0 && dt < 10', txt: 'Guards against both a millis() rollover and a long stall (a blocked Wi-Fi reconnect). Without it a single ten-second hiccup silently adds a fictitious chunk of energy.' },
          { ref: 'double, not float', txt: 'A float has about seven significant digits. After a few thousand kilowatt-hours, adding a 0.00003 kWh increment to a float total becomes a no-op — the increment is smaller than the representable step. A double pushes that failure past any realistic lifetime.' },
          { ref: 'fabs(energyKwh - stored) > 0.0005', txt: 'Skips the flash write when nothing meaningful changed, which matters for a socket that is switched off for weeks.' },
        ],
      },
    },
  ],

  code: [{
    file: 'smart-plug-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Plug Energy Monitor — ESP32 + PZEM-004T v3 + 16 A relay

   True-power metering over an opto-isolated Modbus link, local kWh
   integration with NVS persistence, appliance state classification,
   over-current trip, and Home Assistant discovery.

   MAINS VOLTAGE. Build it, close it, and never open it powered.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ModbusMaster.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "plug-office"

#define PZEM_RX 16
#define PZEM_TX 17
#define PIN_RELAY 26
#define PIN_LED    2

#define TRIP_AMPS      10.0f     // firmware trip, below the 12 A fuse
#define OVERVOLT       260.0f
#define STANDBY_W       15.0f    // below this and above OFF_W = standby
#define OFF_W            1.0f
#define STANDBY_CUT_MS 600000UL  // auto-off after 10 min in standby

#define TARIFF_1   4.50f         // INR per kWh, first slab
#define SLAB_1   100.0f          // units
#define TARIFF_2   6.80f

ModbusMaster     pzem;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

struct Meter { float v, i, w, va, wh, hz, pf; bool ok; };
Meter meter = {};

double   energyKwh = 0;
float    lastWatts = 0;
uint32_t lastSample = 0, lastPersist = 0, standbySince = 0, lastPub = 0;
bool     relayOn = true, tripped = false, autoStandbyCut = true;
const char *applianceState = "off";

/* ── metering ───────────────────────────────────────────────── */
Meter meterRead() {
  Meter m = {};
  if (pzem.readInputRegisters(0x0000, 10) != pzem.ku8MBSuccess) return m;
  uint16_t r[10];
  for (int i = 0; i < 10; i++) r[i] = pzem.getResponseBuffer(i);

  m.v  =  r[0] / 10.0f;
  m.i  = ((uint32_t)r[2] << 16 | r[1]) / 1000.0f;
  m.w  = ((uint32_t)r[4] << 16 | r[3]) / 10.0f;
  m.wh = ((uint32_t)r[6] << 16 | r[5]);
  m.hz =  r[7] / 10.0f;
  m.pf =  r[8] / 100.0f;
  m.va =  m.v * m.i;
  m.ok = true;
  return m;
}

void energyAccumulate(float watts) {
  uint32_t now = millis();
  if (lastSample) {
    float dt = (now - lastSample) / 1000.0f;
    if (dt > 0 && dt < 10) energyKwh += ((watts + lastWatts) / 2.0) * dt / 3600000.0;
  }
  lastSample = now;
  lastWatts = watts;

  if (now - lastPersist > 600000UL) {
    lastPersist = now;
    if (fabs(energyKwh - prefs.getDouble("kwh", 0.0)) > 0.0005)
      prefs.putDouble("kwh", energyKwh);
  }
}

/* ── protection and rules ───────────────────────────────────── */
void setRelay(bool on) {
  relayOn = on;
  digitalWrite(PIN_RELAY, on ? LOW : HIGH);
  digitalWrite(PIN_LED, on);
}

void protectionService() {
  if (!meter.ok) return;
  if (meter.i > TRIP_AMPS || meter.v > OVERVOLT) {
    tripped = true;
    setRelay(false);
    mqtt.publish("home/plug/" DEVICE_ID "/alert",
                 meter.i > TRIP_AMPS ? "overcurrent" : "overvoltage", true);
  }
}

void classifyAndRule() {
  if (!meter.ok) return;

  const char *prev = applianceState;
  if      (meter.w < OFF_W)      applianceState = "off";
  else if (meter.w < STANDBY_W)  applianceState = "standby";
  else                           applianceState = "active";

  if (strcmp(applianceState, "standby") != 0) { standbySince = 0; return; }
  if (prev != applianceState || !standbySince) standbySince = millis();

  if (autoStandbyCut && millis() - standbySince > STANDBY_CUT_MS && relayOn) {
    setRelay(false);
    mqtt.publish("home/plug/" DEVICE_ID "/alert", "standby-auto-off", false);
  }
}

/* ── MQTT ───────────────────────────────────────────────────── */
void publishDiscovery() {
  const char *base = "home/plug/" DEVICE_ID;

  JsonDocument sw;
  sw["name"] = "Office Plug"; sw["unique_id"] = DEVICE_ID "_sw";
  sw["command_topic"] = "home/plug/" DEVICE_ID "/set";
  sw["state_topic"]   = "home/plug/" DEVICE_ID "/state";
  sw["value_template"] = "{{ 'ON' if value_json.relay else 'OFF' }}";
  char b[512]; size_t n = serializeJson(sw, b, sizeof(b));
  mqtt.publish("homeassistant/switch/" DEVICE_ID "/config", (uint8_t *)b, n, true);

  struct { const char *id, *name, *unit, *devcls, *field; } sensors[] = {
    { "power",   "Power",        "W",   "power",       "watts"   },
    { "energy",  "Energy",       "kWh", "energy",      "kwh"     },
    { "voltage", "Voltage",      "V",   "voltage",     "volts"   },
    { "current", "Current",      "A",   "current",     "amps"    },
    { "pf",      "Power Factor", "",    "power_factor","pf"      },
  };
  for (auto &s : sensors) {
    JsonDocument d;
    d["name"] = s.name;
    d["unique_id"] = String(DEVICE_ID) + "_" + s.id;
    d["state_topic"] = String(base) + "/state";
    d["unit_of_measurement"] = s.unit;
    d["device_class"] = s.devcls;
    d["value_template"] = String("{{ value_json.") + s.field + " }}";
    if (!strcmp(s.id, "energy")) d["state_class"] = "total_increasing";
    else                          d["state_class"] = "measurement";
    char buf[512]; size_t k = serializeJson(d, buf, sizeof(buf));
    mqtt.publish((String("homeassistant/sensor/") + DEVICE_ID + "_" + s.id + "/config").c_str(),
                 (uint8_t *)buf, k, true);
  }
}

void publishState() {
  JsonDocument d;
  d["volts"]   = meter.v;
  d["amps"]    = meter.i;
  d["watts"]   = meter.w;
  d["va"]      = roundf(meter.va * 10) / 10.0f;
  d["pf"]      = meter.pf;
  d["hz"]      = meter.hz;
  d["kwh"]     = roundf(energyKwh * 1000) / 1000.0;
  d["cost"]    = roundf((energyKwh <= SLAB_1 ? energyKwh * TARIFF_1
                        : SLAB_1 * TARIFF_1 + (energyKwh - SLAB_1) * TARIFF_2) * 100) / 100.0;
  d["relay"]   = relayOn;
  d["tripped"] = tripped;
  d["state"]   = applianceState;
  d["comms"]   = meter.ok;
  char buf[320]; size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("home/plug/" DEVICE_ID "/state", (uint8_t *)buf, n, true);
}

void onMessage(char *topic, byte *payload, unsigned int len) {
  char v[16] = {0};
  memcpy(v, payload, len < 15 ? len : 15);
  if (!strcmp(v, "ON"))    { tripped = false; setRelay(true);  }
  if (!strcmp(v, "OFF"))   { setRelay(false); }
  if (!strcmp(v, "RESET")) { energyKwh = 0; prefs.putDouble("kwh", 0.0); }
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY, OUTPUT); pinMode(PIN_LED, OUTPUT);
  setRelay(true);

  Serial2.begin(9600, SERIAL_8N1, PZEM_RX, PZEM_TX);
  pzem.begin(0xF8, Serial2);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("meter", false);
  energyKwh = prefs.getDouble("kwh", 0.0);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);
  mqtt.setBufferSize(768);
  Serial.println("Smart plug metering");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) {
    if (mqtt.connect(DEVICE_ID, NULL, NULL,
                     "home/plug/" DEVICE_ID "/status", 0, true, "offline")) {
      mqtt.publish("home/plug/" DEVICE_ID "/status", "online", true);
      mqtt.subscribe("home/plug/" DEVICE_ID "/set");
      publishDiscovery();
    }
  }
  mqtt.loop();

  static uint32_t lastRead = 0;
  if (millis() - lastRead >= 1000) {
    lastRead = millis();
    meter = meterRead();
    if (meter.ok) {
      energyAccumulate(meter.w);
      protectionService();
      classifyAndRule();
    }

    oled.clearDisplay();
    oled.setTextColor(SSD1306_WHITE);
    oled.setTextSize(2); oled.setCursor(0, 2);
    oled.printf("%.0f W", meter.w);
    oled.setTextSize(1);
    oled.setCursor(0, 26); oled.printf("%.1f V  %.3f A  pf %.2f", meter.v, meter.i, meter.pf);
    oled.setCursor(0, 38); oled.printf("%.3f kWh", energyKwh);
    oled.setCursor(0, 50); oled.printf("%s  %s%s", applianceState,
                                       relayOn ? "ON" : "OFF", tripped ? " TRIP" : "");
    oled.display();
  }

  if (millis() - lastPub > 1000) { lastPub = millis(); publishState(); }
}`,
    explain: [
      { ref: 'state_class = "total_increasing"', txt: 'This tells Home Assistant the energy value only ever goes up, so its statistics engine can compute daily and monthly consumption correctly and handle the reset when you zero the counter.' },
      { ref: 'tripped flag cleared only by ON', txt: 'An over-current trip is latched. It must not clear itself when the current falls, because a fault that trips and re-closes repeatedly is far more dangerous than one that stays open.' },
      { ref: 'meter.va = m.v * m.i', txt: 'Apparent power is computed rather than read, so you can display it next to real power. Seeing 118 VA and 65 W on the same screen makes the power-factor concept concrete in a way no explanation does.' },
      { ref: 'd["comms"] = meter.ok', txt: 'Publishing the communication health explicitly means a dashboard can distinguish "the appliance is off" from "the meter stopped talking" — two situations that otherwise both look like zero watts.' },
      { ref: 'LWT on the status topic', txt: 'Combined with the retained state topic, this makes a dead plug visibly dead rather than a plug reporting stale figures forever.' },
    ],
  }],

  electronics: {
    pcb: [
      'Keep mains and low-voltage on physically separate regions of the board with a routed slot between them if you have the tooling — the slot raises the effective creepage distance far beyond what the surface alone gives.',
      'Minimum 6 mm creepage and 3 mm clearance between mains and SELV circuits for 230 V basic insulation in a pollution-degree-2 environment. More is better and costs nothing on a hand-built board.',
      'Mains traces carrying 10 A need generous copper. At 1 oz copper, a 10 A trace wants roughly 5 mm width for a 10 °C rise — most people undersize this by a factor of three.',
      'Put the fuse first in the live path, then the MOV, then everything else. A MOV upstream of a fuse is a fire waiting for a surge.',
      'Use screw terminals rated for the conductor size, torqued properly. A loose mains terminal is the single most common cause of fires in DIY electrical work.',
    ],
    calcs: [
      { t: 'Trace width for 10 A', eq: 'IPC-2221 external layer, 10 °C rise, 1 oz copper:\n  A (mils²) = (I / (k · ΔT^0.44))^(1/0.725),  k = 0.048\n  A = (10 / (0.048 × 10^0.44))^(1/0.725)\n    = (10 / 0.1325)^1.379 ≈ 528 mils²\n  width = 528 / 1.378 (mils thickness) ≈ 383 mils ≈ 9.7 mm\n\nUse 10 mm of copper, or reinforce the track with\nsolder or a soldered bus wire.' },
      { t: 'Relay contact derating', eq: 'Rating       : 16 A @ 250 VAC resistive\nEnclosed box : derate 40 %  → 9.6 A\nInductive    : derate a further 30 % → 6.7 A\n\nContinuous design load: 6 A (1380 W) inductive,\n                        9 A (2070 W) resistive.\nFuse at 12 A so the fuse opens before the contacts weld.' },
      { t: 'Snubber sizing', eq: 'Rule of thumb for a 230 VAC contact snubber:\n  C = I_load / 10   (µF, I in amperes)\n  R = V_load / (10 × I_load)   (Ω)\n\nFor a 2 A inductive load:\n  C = 0.2 µF  →  use 100–220 nF X2-rated\n  R = 230 / 20 = 11.5 Ω → use 100 Ω, 2 W\n\nThe capacitor MUST be X2 safety rated. A general\npurpose film capacitor across mains can fail short.' },
    ],
    ratings: [
      { p: 'Mains voltage', r: '230 V ±10 % (207–253 V)', m: 'MOV clamps at 275 V; firmware trips at 260 V.' },
      { p: 'Continuous current', r: '10 A design, 16 A relay rating', m: '38 % below rating — accounts for enclosure temperature rise.' },
      { p: 'Fuse', r: '12 A ceramic, HRC', m: 'Above the 10 A design load, below the relay welding threshold.' },
      { p: 'Creepage, mains to SELV', r: '≥ 6 mm', m: 'Basic insulation, pollution degree 2, per IEC 60664-1.' },
      { p: 'PZEM CT range', r: '0–100 A', m: 'Vastly over-specified for a 10 A socket, which keeps it in its linear region.' },
      { p: 'HLK-PM01 supply', r: '5 V, 600 mA, 3 kV isolation', m: 'ESP32 plus PZEM logic draws about 200 mA — a third of capacity.' },
    ],
    pinout: [
      { p: 'PZEM TX', f: 'Modbus response to ESP32 RX2 (GPIO 16)', n: 'Opto-isolated on the module' },
      { p: 'PZEM RX', f: 'Modbus request from ESP32 TX2 (GPIO 17)', n: 'Opto-isolated' },
      { p: 'PZEM CT', f: 'Split-core current transformer', n: 'Around the LIVE conductor only' },
      { p: 'PZEM V+/V−', f: 'Voltage sense', n: 'Upstream of the relay' },
      { p: 'Relay COM/NO', f: 'Switches the live conductor', n: 'Never switch neutral' },
    ],
  },

  testing: [
    { step: 'Read the meter with no load', expect: 'Voltage 220–250 V, frequency 49.8–50.2 Hz, current under 0.02 A, power under 1 W.' },
    { step: 'Plug in a 60 W incandescent lamp', expect: 'About 60 W with a power factor above 0.98 — a resistive load, so real and apparent power nearly match.' },
    { step: 'Plug in a laptop charger', expect: 'Power factor between 0.5 and 0.7, with apparent power well above real power. This is the demonstration that makes the whole project worthwhile.' },
    { step: 'Run a known load for exactly one hour', expect: 'Integrated kWh within about 1 % of load watts ÷ 1000, and matching the PZEM\'s own counter.' },
    { step: 'Publish OFF over MQTT', expect: 'The relay clicks, power drops to zero, and voltage continues to be reported (it is sensed upstream).' },
    { step: 'Leave a television in standby for eleven minutes', expect: 'The standby rule fires and the plug switches itself off, with an alert published.' },
    { step: 'Power-cycle the plug', expect: 'The kWh counter resumes within 0.001 kWh of its previous value.' },
    { step: 'Disconnect the PZEM UART', expect: '<code>comms</code> goes false and the display shows stale values — it must not report zero watts.' },
  ],

  troubleshoot: [
    {
      sym: 'Current always reads zero but voltage is correct',
      cause: 'The current transformer is around both conductors, or around neither.',
      fix: 'The CT must enclose the <b>live conductor only</b>. With both live and neutral inside, the magnetic fields cancel exactly and you measure nothing. Open the split core, pass only the live wire through, and click it shut.',
    },
    {
      sym: 'Modbus reads always fail',
      cause: 'TX and RX swapped, wrong baud rate, or the wrong UART pins.',
      fix: 'PZEM TX goes to ESP32 RX (GPIO 16) and PZEM RX to ESP32 TX (GPIO 17) — crossed, not straight. Baud is fixed at 9600 8N1. Verify with a USB-serial adapter first if you have one.',
    },
    {
      sym: 'Power readings are wildly wrong or negative',
      cause: 'The 32-bit registers are being assembled with the words in the wrong order.',
      fix: 'The PZEM sends the low word first: <code>(uint32_t)r[n+1] &lt;&lt; 16 | r[n]</code>. Swapping this gives plausible-looking nonsense, which is why it takes so long to spot.',
    },
    {
      sym: 'The ESP32 resets when the relay switches',
      cause: 'Contact arcing is coupling into the low-voltage supply, or the relay coil transient is reaching the regulator.',
      fix: 'Fit the RC snubber across the contacts, add a 470 µF capacitor at the ESP32 5 V input, and increase the physical separation between the relay and the microcontroller. If it persists, drive the relay from a genuinely separate isolated supply.',
    },
    {
      sym: 'The energy total resets after a power cut',
      cause: 'NVS was written too rarely, or not at all before the cut.',
      fix: 'The ten-minute persist interval means you can lose up to ten minutes of accumulation, which is normally acceptable. If it matters, add a supercapacitor across the 5 V rail and write on brown-out detection.',
    },
    {
      sym: 'Home Assistant shows the entities but the energy dashboard rejects them',
      cause: 'Missing <code>state_class</code> or <code>device_class</code> in the discovery payload.',
      fix: 'Energy entities need <code>device_class: energy</code>, <code>state_class: total_increasing</code> and <code>unit_of_measurement: kWh</code>. All three are required before Home Assistant will accept the sensor into its energy dashboard.',
    },
  ],

  perf: [
    'Read all ten registers in one Modbus transaction. Ten separate reads at 9600 baud take about 300 ms and make 1 Hz sampling unreliable.',
    'Publish at 1 Hz but persist at 1/600 Hz. Matching those rates is what wears out flash.',
    'Use a double for the energy accumulator. Float precision loss after a few thousand kilowatt-hours is a real, silent failure.',
  ],

  safety: [
    '<b>This project handles mains voltage.</b> If you are not competent and confident with 230 V wiring, build the metering half only and use a certified smart plug for switching.',
    'Never open the enclosure while it is plugged in. Never probe the mains side with an earthed oscilloscope — you will short live to earth through the probe ground.',
    'Fit the fuse in the live conductor, upstream of everything including the MOV.',
    'Use only an X2-rated capacitor in the snubber. A general-purpose film capacitor across mains can fail short circuit.',
    'The finished unit must be fully enclosed with cable glands and no accessible conductive parts. A test build on a bench with exposed terminals is a genuine electrocution hazard, not a theoretical one.',
    'Have the finished assembly checked by a qualified electrician before it carries a real load unattended.',
  ],

  future: [
    'Add <b>harmonic analysis</b> with a dedicated energy IC such as the ATM90E32AS, which reports individual harmonics rather than just power factor.',
    'Add <b>appliance disaggregation</b> — a small classifier on the power signature can identify <em>which</em> appliance is plugged in from its startup transient.',
    'Add a <b>zero-cross detector</b> and switch the relay at the voltage zero crossing, which nearly eliminates contact arcing.',
    'Replace the relay with a <b>triac and opto-isolated driver</b> for silent, unlimited-cycle switching (accepting the leakage current and heatsinking that brings).',
    'Add <b>local storage</b> so a month of per-minute data survives a broker outage.',
  ],

  faq: [
    { q: 'Why not just use an ACS712 or a current clamp?', a: 'Because current alone is not power. For a resistive load the approximation holds; for anything with a switch-mode supply it can be wrong by 80 %. The PZEM costs about ₹950 and measures the same quantity your utility meter does. If you only want to know when a motor is running, a clamp is fine — if you want watts, it is not.' },
    { q: 'Is the PZEM accurate enough to be trusted?', a: 'It is specified at ±0.5 % for voltage, current and power, which is comparable to a class-1 utility meter. It is not legally traceable and you cannot bill from it, but for auditing your own appliances it is far more accurate than anything else at the price.' },
    { q: 'Can I measure a whole house with this?', a: 'Yes — the PZEM-004T comes in a 100 A version with a larger split-core CT that clamps around the incoming main. The firmware is unchanged. The relay obviously is not, and you should never put a hobby relay in a main feed.' },
    { q: 'Why does my LED bulb show such a bad power factor?', a: 'Because its driver is a switch-mode supply that draws current in short pulses near the voltage peaks. That is distortion, not phase shift, and it is completely normal. It costs you nothing directly — domestic customers are billed on real power, not apparent — but it does load the grid disproportionately, which is why commercial tariffs include power-factor penalties.' },
    { q: 'How dangerous is this really?', a: 'Genuinely dangerous if done carelessly and entirely manageable if done properly. The specific risks are: touching a live terminal on an open unit; an under-rated conductor or loose terminal causing a fire; and bridging the isolation barrier so mains reaches your USB-connected laptop. All three are avoided by procedure rather than skill — never open it powered, torque the terminals, and never connect USB while it is plugged into mains.' },
  ],

  refs: [
    { t: 'PZEM-004T v3.0 — user manual and Modbus register map', u: 'https://innovatorsguru.com/wp-content/uploads/2019/06/PZEM-004T-V3.0-Datasheet-User-Manual.pdf', s: 'Peacefair / Innovators Guru' },
    { t: 'Modbus Application Protocol Specification V1.1b3', u: 'https://www.modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf', s: 'Modbus Organization' },
    { t: 'IEC 60664-1 — insulation coordination, creepage and clearance', u: 'https://webstore.iec.ch/publication/2790', s: 'IEC' },
    { t: 'IPC-2221 generic standard on printed board design — trace current capacity', u: 'https://www.ipc.org/TOC/IPC-2221B.pdf', s: 'IPC' },
    { t: 'Real, reactive and apparent power — AC power theory', u: 'https://en.wikipedia.org/wiki/AC_power', s: 'Wikipedia' },
    { t: 'Home Assistant MQTT Sensor — device_class and state_class reference', u: 'https://www.home-assistant.io/integrations/sensor.mqtt/', s: 'Home Assistant' },
    { t: 'Relay contact protection and snubber design', u: 'https://www.te.com/commerce/DocumentDelivery/DDEController?Action=showdoc&DocId=Data+Sheet', s: 'TE Connectivity application note' },
  ],

  images: ['esp32', 'relay', 'grafana'],
  imageCaptions: [
    'An ESP32 development board — the metering controller, kept strictly on the isolated side of the design.',
    'A relay module. In this build the relay switches the live conductor only, with an RC snubber across the contacts.',
    'A dashboard of the kind used to chart per-appliance power and cumulative energy.',
  ],
},

/* ── 006 · Water Leak & Flood Detector ───────────────────────────── */
{
  id: '006',
  domainKey: 'iot',
  emoji: '💧',
  thumb: 'sensor',
  difficulty: 'Beginner',
  hours: '5–8 hours',
  iso8601: 'PT7H',
  tagline: 'Battery-powered floor sensors that detect water within seconds, wake from deep sleep, sound a local alarm, push a phone alert, and — optionally — close a motorised valve before the damage spreads.',

  overview: [
    'Water damage is slow, silent and expensive. A washing machine hose that fails at 2 a.m. can put several hundred litres through a floor before anyone notices. The detection problem is trivial — water bridges two electrodes — so almost all the engineering here is about the parts people skip: making the node last a year on a battery, making the electrodes survive that year without corroding away, and making sure the alert actually reaches somebody.',
    'The power design is the interesting part. A node that polls a sensor every second draws milliamps and lasts weeks. This design instead uses the ESP32\'s <b>ULP-triggered external wake</b>: the chip sits in deep sleep at about 10 µA, and the sensor itself pulls a GPIO low when water bridges it, which wakes the chip in milliseconds. Detection latency is therefore under a second while average current is measured in microamps. Two 18650 cells give well over a year.',
    'Electrode corrosion is the failure nobody plans for. A DC-biased electrode in water electrolyses: metal migrates off the anode, and within weeks the sensor either reads permanently wet or permanently dry. The fix is to <b>never apply continuous DC</b>. Here the electrodes are driven only during the brief confirmation measurement after a wake, and the polarity alternates between measurements, so net metal transport is close to zero.',
    'Finally, escalation. A local buzzer is useless if nobody is home, and a phone notification is useless if the phone is on silent. The node therefore does all three: sounds locally, publishes an MQTT alert that retries until acknowledged, and can drive a motorised ball valve to shut the supply off entirely.',
  ],

  does: [
    'Detects water bridging a floor-level probe within about one second of contact.',
    'Sleeps at roughly 10 µA between events, giving over a year on two 18650 cells.',
    'Sounds a 90 dB local alarm immediately, independent of any network.',
    'Publishes an MQTT alert and repeats it until a human acknowledges.',
    'Optionally drives a 12 V motorised ball valve to close the mains water supply.',
    'Reports battery voltage and a daily heartbeat, so a dead node is visibly dead.',
    'Distinguishes a genuine leak from a transient splash using a confirmation delay.',
  ],

  features: [
    '<b>Deep sleep with external wake</b> (<code>ext0</code>) on the probe pin — microamp idle, sub-second detection.',
    '<b>Alternating-polarity electrode drive</b> that eliminates electrolytic corrosion.',
    '<b>Confirmation window</b>: water must remain detected for three seconds before an alarm, filtering splashes.',
    '<b>Daily heartbeat</b> with battery voltage, so silence is unambiguous.',
    '<b>Escalating alerts</b> — local buzzer, MQTT, and repeat-until-acknowledged.',
    '<b>Optional valve control</b> with a 60-second drive timeout and position feedback.',
    '<b>Multiple probes per node</b>, each individually identified in the alert.',
    '<b>Low-battery warning</b> at 3.4 V per cell, well before the node dies.',
  ],

  applications: [
    { t: 'Under a washing machine or dishwasher', d: 'The highest-risk location in most homes, and the one where a valve shutoff pays for itself the first time it fires.' },
    { t: 'Water heater and boiler drip trays', d: 'A tank failure is slow at first — hours of early warning is the difference between a mop and a floor replacement.' },
    { t: 'Basements and sumps', d: 'Combine with a level sensor to distinguish "damp" from "rising fast".' },
    { t: 'Server rooms and comms cabinets', d: 'Water on a raised floor near equipment justifies an immediate power-down automation.' },
    { t: 'Holiday homes', d: 'The classic scenario: nobody present for weeks. Remote alerting plus automatic shutoff is the entire value proposition.' },
    { t: 'Aquarium and hydroponics overflow', d: 'A pump that fails on rather than off empties a tank onto the floor.' },
  ],

  skills: [
    'Basic Arduino C++ and digital input reading',
    'Understanding of deep sleep and wake sources on the ESP32',
    'Voltage dividers and ADC reading for battery monitoring',
    'Simple soldering and waterproofing',
    'MQTT basics',
  ],

  parts: ['esp32', 'buzzer', 'li18650', 'tp4056', 'perfboard', 'enclosure'],
  qty: { li18650: 2 },
  extraParts: [
    { name: 'Water probe — stainless steel or gold-plated pads', spec: '2 × electrodes, 10 mm spacing, on a floor-contact PCB', qty: 3, price: 90, note: 'Gold or stainless only. Plain copper or tinned pads corrode within weeks even with polarity alternation.' },
    { name: '1 MΩ + 100 kΩ resistors', spec: '1 % metal film', qty: 1, price: 20, note: 'Probe pull-up and battery divider.' },
    { name: '12 V motorised ball valve (optional)', spec: 'DN20, 2-wire or 5-wire with feedback, 8 W', qty: 1, price: 2400 },
    { name: 'Silicone sealant and heat-shrink', spec: 'Neutral cure', qty: 1, price: 150 },
  ],
  cost: '₹2,400 (detect only) – ₹5,200 (with valve)',
  libs: ['wifi', 'pubsub', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Probe 1 sense', devPin: 'Electrode A', pin: 'GPIO 33', sig: 'Wake source, 1 MΩ pull-up' },
      { dev: 'Probe 1 drive', devPin: 'Electrode B', pin: 'GPIO 32', sig: 'Driven only during measurement' },
      { dev: 'Probe 2 / 3 sense', devPin: 'Electrode A', pin: 'GPIO 25 / 26', sig: 'Additional zones' },
      { dev: 'Battery divider', devPin: 'Mid-point', pin: 'GPIO 34', sig: '1 MΩ / 100 kΩ to ADC' },
    ],
    right: [
      { dev: 'Piezo buzzer', devPin: '+', pin: 'GPIO 27', sig: 'LEDC PWM, 2.3 kHz' },
      { dev: 'Valve open / close', devPin: 'Relay IN1 / IN2', pin: 'GPIO 18 / 19', sig: 'Momentary drive, 60 s timeout' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Flash only, never steady' },
    ],
  },
  wiringNotes: [
    'The sense electrode sits at 3.3 V through a 1 MΩ pull-up. Water bridging to the drive electrode (held at ground during sleep) pulls it low, which is what <code>esp_sleep_enable_ext0_wakeup(GPIO_NUM_33, 0)</code> wakes on.',
    'A 1 MΩ pull-up is deliberately high. It means the current through the water is under 3.3 µA, which keeps sleep current low and dramatically slows electrolysis. Tap water conducts well enough to pull the pin low even through 1 MΩ.',
    'Use <b>stainless steel or gold-plated</b> electrodes. Bare copper or HASL-finished pads will corrode visibly within a month of being wet, and the failure is silent — a corroded probe reads dry.',
    'Mount the probe flat on the floor with the electrodes facing down but with a 1–2 mm standoff, so surface tension does not hold a permanent bridge after the water has gone.',
    'GPIO 34 is input-only. The battery divider needs external resistors; there is no internal pull-up available.',
    'Only <b>RTC-capable GPIO</b> can be an ext0 wake source: 0, 2, 4, 12–15, 25–27, 32–39 on a classic ESP32. Choosing a non-RTC pin means the node sleeps and never wakes.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'Probe electrodes', sub: '1 MΩ pull-up' }, { name: 'Battery divider', sub: 'ADC on GPIO 34' }] },
      { label: 'Wake', edge: 'pin goes low', blocks: [{ name: 'ext0 wake', sub: '~10 µA sleep', highlight: true }, { name: 'Confirm 3 s', sub: 'reject splashes' }] },
      { label: 'Alert', edge: 'confirmed leak', blocks: [{ name: 'Local buzzer', sub: 'no network needed', highlight: true }, { name: 'MQTT publish', sub: 'retry until ack' }] },
      { label: 'Act', edge: 'optional', blocks: [{ name: 'Motorised valve', sub: 'close supply' }, { name: 'Phone / hub', sub: 'notification' }] },
    ],
  },

  flow: [
    { t: 'Deep sleep at ~10 µA', k: 'start' },
    { t: 'Wake: probe pin low, or 24 h timer', k: 'proc' },
    { t: 'Timer wake?', k: 'dec', yes: 'send heartbeat + battery', no: 'leak path', back: 0 },
    { t: 'Drive electrodes, measure 3 s', k: 'proc' },
    { t: 'Still wet after 3 s?', k: 'dec', yes: 'confirmed', no: 'splash — back to sleep', back: 0 },
    { t: 'Sound buzzer immediately', k: 'io' },
    { t: 'Join Wi-Fi, publish alert, close valve', k: 'io' },
    { t: 'Repeat alert until acknowledged', k: 'end' },
  ],

  principle: [
    'Water detection here is simple resistive sensing. Two electrodes are separated by air; air is an excellent insulator, so the sense pin sits at 3.3 V through its pull-up. Tap water has a resistance of roughly 1–50 kΩ across a 10 mm gap depending on its mineral content, which is far below the 1 MΩ pull-up, so the pin is pulled close to ground. Distilled water would not trigger it — but distilled water is not what leaks out of a washing machine.',
    'The corrosion problem is electrochemistry, not electronics. Any DC potential across two metal electrodes in an electrolyte drives electrolysis: metal ions leave the anode and either plate onto the cathode or precipitate. The rate is proportional to current and time. Two mitigations are used together here: a very high pull-up resistance limits the current to microamps, and the drive electrode is only actively grounded during a measurement, alternating polarity between measurements so the net charge transfer over time tends to zero.',
    'The power architecture is where a leak detector is won or lost. An ESP32 running normally draws around 80–160 mA; two 18650s at 6800 mAh would last about two days. In deep sleep with only the RTC domain powered it draws roughly 10 µA, which is about 78 years of battery capacity — so the real limits become self-discharge and the brief wake events. A node that wakes once a day for a five-second heartbeat at 120 mA averages under 20 µA total, and comfortably exceeds a year.',
    '<code>ext0</code> wake is the specific mechanism. It configures a single RTC GPIO to wake the chip when it reaches a chosen level, and it works with the entire digital core powered down. Detection latency is the RTC wake time plus boot, which is around 300 ms — indistinguishable from instant for this purpose.',
    'The confirmation window exists because a single momentary bridge is not a leak. Someone mopping the floor, a dropped glass of water, condensation running off a pipe — all produce brief contact. Requiring the probe to stay wet for three continuous seconds, sampled at 200 ms intervals, removes essentially all of those without adding meaningful delay to a real flood.',
    'Escalation follows the principle that the alert must not depend on anything that can fail silently. The buzzer sounds first and needs no network. Only then does the node join Wi-Fi — a process that takes two to five seconds and might fail entirely — and publish. And because an MQTT publish into a broker nobody is watching is not an alert, the node republishes every thirty seconds until it receives an acknowledgement on its command topic.',
  ],

  equations: [
    { t: 'Battery life estimate', eq: 'Deep sleep current       I_sleep = 10 µA\nHeartbeat: 1 per day, 6 s at 120 mA\n  charge per day = 6 × 120 mA / 86400 s = 8.3 µA average\nTotal average             ≈ 18.3 µA\n\nCapacity: 2 × 3400 mAh in parallel = 6800 mAh\nUsable (to 3.4 V/cell)    ≈ 5800 mAh\n\nLife = 5800 mAh / 0.0183 mA = 316 900 h ≈ 36 years\n\nIn practice self-discharge (~2 %/month) dominates:\nrealistic replacement interval 2–3 years.' },
    { t: 'Probe current and electrolysis', eq: 'R_pullup = 1 MΩ, V = 3.3 V\nWater resistance R_w ≈ 20 kΩ (typical tap water, 10 mm gap)\n\nI = 3.3 / (1 000 000 + 20 000) = 3.24 µA\n\nFaraday: mass transported m = (I · t · M) / (n · F)\nFor copper (M = 63.5 g/mol, n = 2, F = 96485 C/mol)\nover one year of continuous contact:\n  Q = 3.24 µA × 3.15e7 s = 102 C\n  m = (102 × 63.5) / (2 × 96485) = 0.034 g\n\n34 mg of copper is enough to visibly pit a small pad —\nwhich is why polarity alternation matters even at µA.' },
    { t: 'Battery divider', eq: 'V_batt max = 4.2 V (single cell) or 4.2 V (2 in parallel)\nESP32 ADC full scale ≈ 3.3 V with 11 dB attenuation\n\nDivider 1 MΩ / 100 kΩ:\n  V_adc = V_batt × 100k / 1100k = V_batt × 0.0909\n  4.2 V → 0.382 V   (poor resolution)\n\nBetter: 100 kΩ / 100 kΩ → V_adc = V_batt / 2\n  4.2 V → 2.10 V, 3.0 V → 1.50 V   ✓\n  divider current = 4.2 / 200 kΩ = 21 µA  ← too high!\n\nUse 1 MΩ / 1 MΩ: 2.1 µA, and switch the divider\nground through a MOSFET so it draws nothing while asleep.' },
  ],

  code: [{
    file: 'water-leak-detector.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Water Leak & Flood Detector — ESP32, deep sleep, ext0 wake

   Sleeps at ~10 uA. Wakes in under a second when water bridges a
   probe, confirms for 3 s to reject splashes, sounds a local alarm
   immediately, then joins Wi-Fi and repeats an MQTT alert until a
   human acknowledges. Optionally closes a motorised valve.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp_sleep.h>
#include <driver/rtc_io.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "leak-utility-room"

#define PIN_PROBE_SENSE GPIO_NUM_33     // must be an RTC-capable GPIO
#define PIN_PROBE_DRIVE 32
#define PIN_BUZZER      27
#define PIN_BATT_ADC    34
#define PIN_BATT_EN     14              // MOSFET gate: enables the divider
#define PIN_VALVE_CLOSE 18
#define PIN_VALVE_OPEN  19
#define PIN_LED          2

#define CONFIRM_MS       3000
#define ALERT_REPEAT_MS 30000
#define ALERT_MAX_MIN      30
#define HEARTBEAT_S     86400ULL        // 24 h
#define VALVE_DRIVE_MS  60000

/* Survives deep sleep — RTC slow memory is not cleared. */
RTC_DATA_ATTR uint32_t bootCount      = 0;
RTC_DATA_ATTR uint32_t leakCount      = 0;
RTC_DATA_ATTR bool     drivePolarity  = false;
RTC_DATA_ATTR bool     valveClosed    = false;

WiFiClient   net;
PubSubClient mqtt(net);
volatile bool acknowledged = false;

/* ── probe ──────────────────────────────────────────────────── */
void probeIdle() {
  // Drive electrode grounded so water pulls the sense pin low and
  // triggers ext0. Sense pin uses its internal RTC pull-up.
  pinMode(PIN_PROBE_DRIVE, OUTPUT);
  digitalWrite(PIN_PROBE_DRIVE, LOW);
  rtc_gpio_pullup_en(PIN_PROBE_SENSE);
  rtc_gpio_pulldown_dis(PIN_PROBE_SENSE);
}

// Alternates polarity each call so net electrolytic transport ~ 0.
bool probeWet() {
  drivePolarity = !drivePolarity;
  pinMode(PIN_PROBE_DRIVE, OUTPUT);
  digitalWrite(PIN_PROBE_DRIVE, drivePolarity ? HIGH : LOW);
  pinMode((int)PIN_PROBE_SENSE, drivePolarity ? INPUT_PULLDOWN : INPUT_PULLUP);
  delayMicroseconds(200);
  bool bridged = digitalRead((int)PIN_PROBE_SENSE) == (drivePolarity ? HIGH : LOW);
  pinMode(PIN_PROBE_DRIVE, INPUT);        // float between measurements
  return bridged;
}

bool confirmLeak() {
  uint32_t start = millis();
  int wet = 0, total = 0;
  while (millis() - start < CONFIRM_MS) {
    if (probeWet()) wet++;
    total++;
    tone(PIN_BUZZER, 3000, 40);           // audible while confirming
    delay(200);
  }
  return total && (wet * 100 / total) >= 80;   // wet for 80 % of the window
}

/* ── battery ────────────────────────────────────────────────── */
float batteryVolts() {
  pinMode(PIN_BATT_EN, OUTPUT);
  digitalWrite(PIN_BATT_EN, HIGH);        // connect the divider
  delay(5);
  analogSetPinAttenuation(PIN_BATT_ADC, ADC_11db);
  uint32_t acc = 0;
  for (int i = 0; i < 16; i++) { acc += analogRead(PIN_BATT_ADC); delay(2); }
  digitalWrite(PIN_BATT_EN, LOW);         // disconnect: no idle drain
  float adc = acc / 16.0f;
  return (adc / 4095.0f) * 3.3f * 2.0f * 1.045f;   // 1:1 divider + calibration
}

/* ── alarm ──────────────────────────────────────────────────── */
void wailOnce() {
  for (int f = 1800; f < 3400; f += 60) { tone(PIN_BUZZER, f, 18); delay(18); }
  for (int f = 3400; f > 1800; f -= 60) { tone(PIN_BUZZER, f, 18); delay(18); }
}

/* ── valve ──────────────────────────────────────────────────── */
void valveClose() {
  if (valveClosed) return;
  pinMode(PIN_VALVE_CLOSE, OUTPUT);
  digitalWrite(PIN_VALVE_CLOSE, HIGH);
  uint32_t t0 = millis();
  while (millis() - t0 < VALVE_DRIVE_MS) { wailOnce(); }
  digitalWrite(PIN_VALVE_CLOSE, LOW);     // motor must not stall energised
  valveClosed = true;
}

/* ── MQTT ───────────────────────────────────────────────────── */
void onMessage(char *topic, byte *payload, unsigned int len) {
  if (len >= 3 && !strncmp((char *)payload, "ACK", 3)) acknowledged = true;
}

bool netUp() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  if (WiFi.status() != WL_CONNECTED) return false;
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);
  if (!mqtt.connect(DEVICE_ID)) return false;
  mqtt.subscribe("home/leak/" DEVICE_ID "/cmd");
  return true;
}

void publish(const char *event, float batt) {
  JsonDocument d;
  d["device"] = DEVICE_ID;
  d["event"]  = event;
  d["boots"]  = bootCount;
  d["leaks"]  = leakCount;
  d["batt_v"] = roundf(batt * 100) / 100.0f;
  d["low_batt"] = batt < 3.4f;
  d["valve_closed"] = valveClosed;
  char buf[224];
  size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("home/leak/" DEVICE_ID "/state", (uint8_t *)buf, n, true);
}

/* ── sleep ──────────────────────────────────────────────────── */
void sleepNow() {
  probeIdle();
  esp_sleep_enable_ext0_wakeup(PIN_PROBE_SENSE, 0);      // wake on LOW
  esp_sleep_enable_timer_wakeup(HEARTBEAT_S * 1000000ULL);
  Serial.flush();
  esp_deep_sleep_start();
}

/* ── setup runs once per wake; there is no loop() work ──────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  bootCount++;

  esp_sleep_wakeup_cause_t why = esp_sleep_get_wakeup_cause();
  float batt = batteryVolts();
  Serial.printf("wake=%d boots=%lu batt=%.2f V\\n", why, (unsigned long)bootCount, batt);

  if (why != ESP_SLEEP_WAKEUP_EXT0) {
    // Timer wake or first boot: heartbeat only.
    if (netUp()) { publish(bootCount == 1 ? "boot" : "heartbeat", batt); mqtt.loop(); }
    delay(200);
    sleepNow();
  }

  /* --- leak path --- */
  digitalWrite(PIN_LED, HIGH);
  if (!confirmLeak()) {
    Serial.println("splash rejected");
    digitalWrite(PIN_LED, LOW);
    sleepNow();
  }

  leakCount++;
  Serial.println("LEAK CONFIRMED");

  bool online = netUp();
  if (online) publish("leak", batt);

  valveClose();                                  // sounds the alarm while driving

  uint32_t start = millis();
  uint32_t lastRepeat = 0;
  while (millis() - start < ALERT_MAX_MIN * 60000UL && !acknowledged) {
    wailOnce();
    if (online) {
      mqtt.loop();
      if (millis() - lastRepeat > ALERT_REPEAT_MS) {
        lastRepeat = millis();
        publish("leak", batteryVolts());
      }
    }
    delay(500);
  }

  if (online) { publish(acknowledged ? "acknowledged" : "alert-timeout", batteryVolts()); mqtt.loop(); }
  digitalWrite(PIN_LED, LOW);
  sleepNow();
}

void loop() { /* never reached — every wake ends in deep sleep */ }`,
    explain: [
      { ref: 'RTC_DATA_ATTR variables', txt: 'Deep sleep clears normal RAM but preserves the 8 KB RTC slow memory. Boot count, leak count, drive polarity and valve state all need to survive, and this is the only place they can.' },
      { ref: 'probeWet() polarity alternation', txt: 'Each measurement reverses which electrode is driven and which is sensed. Over many measurements the net charge through the water averages to zero, which is what stops the electrodes dissolving.' },
      { ref: 'pinMode(PIN_PROBE_DRIVE, INPUT) after measuring', txt: 'Floating the drive electrode between measurements means there is no potential across the water at all for most of the time — the single biggest factor in electrode life.' },
      { ref: 'wet * 100 / total >= 80', txt: 'Requiring 80 % rather than 100 % tolerates a probe that intermittently loses contact as water sloshes, while still rejecting a single momentary splash.' },
      { ref: 'digitalWrite(PIN_BATT_EN, LOW) after reading', txt: 'A permanently connected resistor divider draws current forever. Switching its ground through a MOSFET turns a 21 µA constant drain into a few microamp-seconds per day.' },
      { ref: 'Buzzer before Wi-Fi', txt: 'Deliberate ordering. Joining Wi-Fi takes two to five seconds and can fail entirely; the local alarm must never wait on it.' },
      { ref: 'digitalWrite(PIN_VALVE_CLOSE, LOW) after 60 s', txt: 'A motorised ball valve that reaches its end stop and stays energised will burn out its motor. The drive must be time-limited, or better, terminated by the valve\'s own limit feedback.' },
      { ref: 'Everything in setup(), loop() empty', txt: 'This is the deep-sleep idiom. Each wake is a fresh boot that runs setup() and then sleeps again, so there is no persistent loop at all.' },
    ],
  }],

  config: [
    'Choose an RTC-capable GPIO for the probe sense pin. On a classic ESP32 those are 0, 2, 4, 12–15, 25–27 and 32–39. A non-RTC pin will not wake the chip.',
    'Set <code>HEARTBEAT_S</code> to match how quickly you want to notice a dead node. Daily is a reasonable balance; hourly costs about 24× more heartbeat energy and still lasts years.',
    'Calibrate the battery reading: measure the actual pack voltage with a multimeter and adjust the 1.045 correction factor until the reported figure matches.',
    'Set <code>ALERT_MAX_MIN</code>. Thirty minutes of siren is enough to wake a household; leaving it indefinite flattens the battery after a false positive.',
    'If you fit the valve, test the close operation manually first and time it. Set <code>VALVE_DRIVE_MS</code> to about 150 % of the measured travel time.',
  ],

  calibration: [
    { h: 'Measure your water\'s conductivity', p: ['Put a multimeter across the probe electrodes and drip your actual tap water on them. Typical readings are 5–50 kΩ. If yours exceeds 200 kΩ (very soft or filtered water) reduce the pull-up from 1 MΩ to 470 kΩ so the pin is pulled convincingly low.'] },
    { h: 'Verify deep sleep current', p: ['Break the battery positive lead and put a multimeter in series on its µA range. You should read 10–20 µA. Anything above 100 µA means something is still powered — usually a permanently connected divider, an LED, or a peripheral module with its own regulator.'] },
    { h: 'Test wake latency', p: ['Drop water on the probe and time to the first buzzer chirp. Under one second is expected. Substantially longer means the wake source is misconfigured and the node is waking on the timer instead.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Utility room', sub: 'battery node' }, { name: 'Under sink', sub: 'battery node' }, { name: 'Water heater', sub: 'battery node' }],
      protocol: 'Wi-Fi, on demand only',
      gateway: 'Home router', gatewaySub: 'must be in range',
      uplink: 'MQTT 1883',
      cloud: 'Local broker', cloudSub: 'Mosquitto',
      clients: [{ name: 'Phone push', sub: 'ntfy / HA app' }, { name: 'Valve node', sub: 'mains powered' }],
    },
    protocol: [
      'The node only joins the network when it has something to say, because association and DHCP cost far more energy than the publish itself. That is a deliberate trade: latency to the phone is two to five seconds rather than instant, and battery life goes from weeks to years.',
      'Alerts are published <b>retained</b> so a dashboard connecting after the event still sees the leak state. They are also republished every thirty seconds until acknowledged, because a single publish into a broker with no active subscriber is not an alert.',
    ],
    topics: [
      { t: 'home/leak/<device>/state', dir: 'device → broker (retained)', payload: 'JSON: event, boots, leaks, batt_v, low_batt, valve_closed' },
      { t: 'home/leak/<device>/cmd', dir: 'broker → device', payload: '"ACK" to silence, "VALVE_OPEN" to reopen' },
    ],
    mobile: [
      'A Node-RED flow subscribed to <code>home/leak/+/state</code> that calls ntfy.sh on <code>event == "leak"</code> gives push notifications with no app development. Set the ntfy priority to <code>urgent</code> so it bypasses do-not-disturb — a flood at 3 a.m. is exactly the case that justifies it.',
      'Add a second automation on a missed heartbeat: if a node has not reported in 36 hours, notify. A silent leak detector is worse than none, because you believe you are covered.',
    ],
    security: [
      'Use broker authentication. An unauthenticated leak topic lets anyone on the network publish a fake ACK and silence a real alarm.',
      'Keep the valve control on a separate, mains-powered node rather than the battery sensor, so a flat battery cannot leave the valve half-driven.',
      'Never make the alarm depend on cloud availability. Local buzzer first, always.',
    ],
  },

  testing: [
    { step: 'Measure sleep current with a µA meter in series', expect: '10–20 µA. Above 100 µA means something is still drawing power.' },
    { step: 'Bridge the electrodes with a wet finger', expect: 'The buzzer chirps within about a second, confirming for three seconds before the full alarm.' },
    { step: 'Touch the probe briefly and remove', expect: 'Confirmation fails, "splash rejected" appears on serial, and the node returns to sleep with no alarm.' },
    { step: 'Pour water on the probe and leave it', expect: 'Full siren, MQTT alert published, valve drives closed if fitted, and the alert repeats every 30 s.' },
    { step: 'Publish ACK to the command topic', expect: 'The siren stops, an "acknowledged" state is published, and the node sleeps.' },
    { step: 'Wait for the daily timer wake', expect: 'A heartbeat with a plausible battery voltage, and no alarm.' },
    { step: 'Read battery voltage against a multimeter', expect: 'Agreement within about 0.05 V after calibration.' },
    { step: 'Leave the probe wet for a week, then inspect', expect: 'No visible pitting or discolouration on stainless or gold electrodes. Visible corrosion means the polarity alternation is not working.' },
  ],

  troubleshoot: [
    {
      sym: 'The node never wakes on water',
      cause: 'The probe pin is not RTC-capable, or ext0 is configured for the wrong level.',
      fix: 'Use GPIO 32–39, 25–27, 12–15, 4, 2 or 0. Confirm <code>esp_sleep_enable_ext0_wakeup(pin, 0)</code> — the 0 means wake on LOW, which matches a pull-up plus water-to-ground scheme. Print <code>esp_sleep_get_wakeup_cause()</code> at every boot to see what actually woke it.',
    },
    {
      sym: 'Sleep current is milliamps, not microamps',
      cause: 'A peripheral is still powered, or you are measuring a development board with its onboard regulator and USB-serial chip.',
      fix: 'A typical ESP32 DevKit draws 8–20 mA in deep sleep because of the AMS1117 regulator quiescent current and the CP2102. For a real battery build use a bare ESP32-WROOM module with an efficient LDO, or cut the power LED and regulator from the dev board. Also disconnect any resistor divider that is permanently connected.',
    },
    {
      sym: 'False alarms in a humid bathroom',
      cause: 'Condensation bridging the electrodes, or too small an electrode gap.',
      fix: 'Increase the gap to 15 mm, raise the confirmation threshold to five seconds, and mount the probe with a 2 mm standoff so a film of condensation cannot bridge it. Coating everything except the electrode faces with conformal coating also helps.',
    },
    {
      sym: 'The probe stops detecting after a few weeks',
      cause: 'Electrode corrosion or mineral scale.',
      fix: 'Inspect the electrodes. Green or white deposits mean corrosion — replace with stainless or gold-plated, and verify the polarity alternation is running. Scale from hard water can be removed with vinegar; if it recurs quickly, increase the electrode gap and clean quarterly.',
    },
    {
      sym: 'The MQTT alert never arrives',
      cause: 'Wi-Fi association takes longer than the 10 s allowance, or the broker rejects the connection.',
      fix: 'Print <code>WiFi.status()</code> at every retry. If association is slow, store the channel and BSSID from the last successful connection in RTC memory and pass them to <code>WiFi.begin()</code> — that typically cuts association from 4 s to under 1 s, which also saves battery.',
    },
    {
      sym: 'The valve motor buzzes and gets hot',
      cause: 'It has reached its end stop and is still energised.',
      fix: 'A motorised ball valve must be de-energised once travel completes. Either use a valve with internal limit switches (most 5-wire types have them and self-terminate), or keep the firmware timeout well matched to the real travel time.',
    },
  ],

  perf: [
    'Cache the Wi-Fi channel and BSSID in RTC memory. Passing them to <code>WiFi.begin()</code> skips the scan and typically halves both connection time and the energy each alert costs.',
    'Use a bare ESP32 module rather than a development board for the deployed unit. The dev board\'s regulator and USB chip alone are a thousand times the module\'s sleep current.',
    'Switch the battery divider through a MOSFET. A permanently connected 200 kΩ divider drains more than the sleeping ESP32 does.',
  ],

  safety: [
    'Water and mains electricity together are lethal. Keep this node battery-powered; if you must mains-power a valve controller, put it well above any possible water level and feed it through an RCD.',
    'A motorised valve that closes the water supply can create water hammer in a long pipe run. Use a slow-acting motorised ball valve, not a fast solenoid, on a mains supply.',
    'Test the valve manually every six months. A valve that has not moved in two years may be seized when you finally need it.',
  ],

  maintenance: [
    'Wipe the electrodes and check for corrosion every three months.',
    'Replace or recharge the cells when a heartbeat reports below 3.4 V.',
    'Pour a cup of water on each probe twice a year as a live end-to-end test — including checking that the phone notification actually arrives.',
  ],

  future: [
    'Move to <b>LoRa or Zigbee</b> instead of Wi-Fi. Association energy drops by an order of magnitude and range through concrete improves dramatically.',
    'Add a <b>capacitive rather than resistive</b> probe, which eliminates the corrosion problem entirely at the cost of a slightly more complex front end.',
    'Add an <b>ultrasonic or float level sensor</b> so the node reports how fast water is rising, not just that it is present.',
    'Combine with a <b>flow meter on the main</b> — continuous flow with no fixtures running is a leak inside the wall that a floor probe will never see.',
    'Add a <b>supercapacitor</b> so the node can send one final "battery dead" message when the cells fail.',
  ],

  faq: [
    { q: 'Why not just poll the sensor every second?', a: 'Because it costs about a thousand times more energy. A polled node keeps the CPU and radio alive; an ext0 wake keeps only the RTC domain, at roughly 10 µA. The detection latency is essentially identical — under a second either way — so polling buys nothing and costs the entire battery life.' },
    { q: 'Will it detect a slow drip?', a: 'Only once the drip accumulates enough to bridge the electrodes, which for a floor-mounted probe with a 10 mm gap means a few millilitres pooling under it. Placement therefore matters enormously: put the probe at the lowest point of the floor, not next to the appliance.' },
    { q: 'Can one node cover a whole room?', a: 'No. Water goes where the floor slopes, which is rarely where you would guess. Use several cheap nodes rather than one clever one — the marginal cost of a second probe on the same ESP32 is about ₹90.' },
    { q: 'Is the valve worth fitting?', a: 'If the property is ever empty for more than a day, yes — it is the only part of the system that limits damage rather than just reporting it. If someone is always home within minutes, the alert alone is probably enough.' },
    { q: 'My dev board draws 15 mA asleep. Is that normal?', a: 'Yes, and it is why battery projects should not use dev boards. The AMS1117 regulator has a quiescent current of about 5 mA, the CP2102 USB chip a few more, and the power LED another 3 mA. A bare ESP32-WROOM-32 module with an efficient LDO gets you to 10 µA.' },
  ],

  refs: [
    { t: 'ESP32 Deep Sleep and wake-up sources — ESP-IDF programming guide', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/sleep_modes.html', s: 'Espressif' },
    { t: 'ESP32 RTC GPIO reference — which pins can wake the chip', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/gpio.html', s: 'Espressif' },
    { t: 'Faraday\'s laws of electrolysis', u: 'https://en.wikipedia.org/wiki/Faraday%27s_laws_of_electrolysis', s: 'Wikipedia' },
    { t: 'Samsung INR18650-35E cell datasheet — capacity and discharge curves', u: 'https://www.orbtronic.com/content/Samsung-INR18650-35E-Datasheet-Gest.pdf', s: 'Samsung SDI' },
    { t: 'ntfy — simple HTTP-based push notifications', u: 'https://docs.ntfy.sh/', s: 'ntfy.sh' },
    { t: 'Water conductivity and total dissolved solids — background', u: 'https://www.usgs.gov/special-topics/water-science-school/science/conductivity-electrical-conductance-and-water', s: 'USGS' },
  ],

  images: ['esp32', 'battery', 'sensor'],
  imageCaptions: [
    'An ESP32 module. For a battery build, use a bare module rather than a development board — the board\'s regulator and USB chip dominate sleep current.',
    'An 18650 lithium-ion cell. Two in parallel give roughly 6800 mAh, comfortably more than this node needs for several years.',
    'A generic sensor breakout. The water probe here is simply two corrosion-resistant electrodes on a floor-contact board.',
  ],
},

];
