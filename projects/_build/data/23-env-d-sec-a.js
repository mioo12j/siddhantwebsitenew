/* Environment 048 + Security 049–050. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   048 — High-Altitude Telemetry Node
   ══════════════════════════════════════════════════════════════════ */
{
  id: '048',
  domainKey: 'iot',
  emoji: '🏔️', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'A weather station engineered to survive a glacier or a mountain ridge — extreme cold, wind, ice and total isolation — and still report reliably for a full season.',

  overview: [
    'The places we most need mountain weather data are the places hardest to put an instrument: a glacier surface, a high ridge, an avalanche start zone, a remote pass. These sites drive water supply, avalanche risk and climate research, yet they sit far above any power line or cell tower, in temperatures that flatten ordinary batteries, under winds that tear away anything not built to hold, and under snow and rime ice that bury or freeze the very sensors you came to read. A weather station that works fine in a backyard will be dead within a week up there. This project is about the engineering that lets a node <i>survive</i> — because in high-altitude telemetry, ruggedness and power are the hard problems, and the sensing is almost the easy part.',
    'The node measures the mountain essentials — temperature, humidity and barometric pressure, wind speed and direction, and snow depth (an ultrasonic sensor looking down at the snow surface, which is what actually matters for hydrology and avalanche work) — but every one of those measurements is shaped by the environment. The temperature sensor must be shielded and, ideally, aspirated so sun on the housing does not fake a warm reading; the anemometer must shed rime ice or its bearings freeze; the snow sensor\'s ultrasonic pulse must be temperature-corrected because the speed of sound changes sharply across the huge temperature range of a mountain day. The design treats each sensor\'s failure mode in the cold as a first-class problem.',
    'The two dominant engineering constraints are <b>power</b> and <b>communication</b>. Lithium batteries lose capacity in the cold and — critically — must not be charged below freezing, so the power system has to manage temperature, not just voltage, and the node must sip energy through long, dark, storm-bound periods. And with no cellular coverage, the node reports over long-range LoRa to a valley gateway or, where even that is impossible, over a <b>satellite</b> link (e.g. Iridium) that costs real power and money per message, forcing a discipline of infrequent, compact, prioritised reporting. Everything is logged locally so a week-long storm that severs the link loses nothing. The result is a station that does the unglamorous thing brilliantly: it stays alive and keeps reporting from a place that is actively trying to kill it, turning a blank spot on the weather map into a season of data.',
  ],
  does: [
    'Measures temperature, humidity, pressure, wind and snow depth in extreme conditions',
    'Shields/aspirates the temperature sensor and temperature-corrects the snow reading',
    'Manages battery temperature — never charging lithium below freezing',
    'Sips power through long, dark, storm-bound periods on solar + battery',
    'Reports over long-range LoRa, or satellite where there is no other link',
    'Logs locally so a multi-day link outage loses no data',
    'Prioritises and compacts messages when every satellite byte costs power and money',
  ],
  features: [
    'Cold-survival power design (temperature-aware charging, deep sleep)',
    'Rime-ice-tolerant, wind-resistant sensor mounting',
    'Aspirated/shielded temperature and temperature-corrected snow depth',
    'LoRa or satellite backhaul for total isolation',
    'Local logging for multi-day outages',
    'Prioritised, compact reporting to conserve energy and airtime',
    'Season-long unattended operation in a hostile environment',
  ],
  applications: [
    { t: 'Glaciology and climate research', d: 'Surface energy-balance and mass-balance data from glaciers and ice fields where no permanent station exists.' },
    { t: 'Avalanche forecasting', d: 'Wind, temperature and snow-depth data from start zones and ridges that feed avalanche risk assessment.' },
    { t: 'Mountain hydrology / water supply', d: 'Snowpack and weather data that drive melt and runoff forecasts for downstream water and hydropower.' },
    { t: 'Remote alpine infrastructure', d: 'Weather awareness for high passes, huts, telescopes and communication sites in the mountains.' },
  ],
  skills: [
    'Cold-weather battery and solar management (temperature-aware charging)',
    'Ruggedising and mounting sensors against wind and rime ice',
    'Aspirated temperature measurement and temperature-corrected ranging',
    'Low-power design and prioritised, compact telemetry',
    'LoRa and satellite (e.g. Iridium) backhaul with local logging',
  ],
  prereq: [
    'Do not charge lithium-ion below 0 °C — it damages the cell. The power system must sense temperature and gate charging (or use a cold-charge-capable chemistry/heater).',
    'Sun on an unshielded temperature sensor reads far too warm; shield and, ideally, aspirate it.',
    'Rime ice and wind are the mechanical killers — mount for them, or the moving parts freeze and the fragile parts break.',
    'Satellite airtime costs power and money per byte; report infrequently, compactly and by priority, and log everything locally.',
  ],

  parts: ['esp32', 'bme280', 'jsnsr04t', 'ds18b20', 'lora', 'solarpanel', 'mppt', 'li18650'],
  extraParts: [
    { name: 'Anemometer + wind vane (rugged)', spec: 'Ice-shedding cup/sonic anemometer and vane rated for alpine wind', qty: 1, price: 3500, note: 'Sonic anemometers avoid frozen bearings but cost more' },
    { name: 'Cold-capable battery + heater/insulation', spec: 'LiFePO4 or cold-rated pack, insulated box, charge-gate/heater below 0 °C', qty: 1, price: 2500, note: 'The single hardest sub-system; get it right' },
    { name: 'Satellite modem (optional)', spec: 'Iridium SBD modem for sites with no LoRa path to a gateway', qty: 1, price: 12000, note: 'Only where LoRa cannot reach; airtime is metered' },
    { name: 'Aspirated radiation shield', spec: 'Solar radiation shield with a low-power aspiration fan for true air temperature', qty: 1, price: 1500 },
    { name: 'Guyed mast + rugged enclosure', spec: 'Wind-rated mast, guy wires, sealed UV/cold enclosure, rime-shedding surfaces', qty: 1, price: 3000 },
  ],
  cost: '₹18,000 – ₹35,000 (site-dependent)',
  libs: ['wifi', 'bme', 'onewire', 'unified', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'BME280', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Air temp/RH/pressure (I²C, shielded)' },
      { dev: 'Snow depth (ultrasonic)', devPin: 'TRIG/ECHO', pin: 'GPIO 26/25', sig: 'Distance to snow surface' },
      { dev: 'Anemometer', devPin: 'PULSE/UART', pin: 'GPIO 27 / 16-17', sig: 'Wind speed (+ direction)' },
      { dev: 'DS18B20 (battery)', devPin: 'DQ', pin: 'GPIO 4', sig: 'Battery temperature (charge gate)' },
    ],
    right: [
      { dev: 'LoRa / Sat modem', devPin: 'SPI / UART', pin: 'GPIO 18/19/23 / 16-17', sig: 'Backhaul' },
      { dev: 'Aspiration fan', devPin: 'IN', pin: 'GPIO 13', sig: 'Low-power fan for temp shield' },
      { dev: 'Charge enable', devPin: 'EN', pin: 'GPIO 12', sig: 'Gate charging on battery temp' },
      { dev: 'MPPT + panel', devPin: 'OUT', pin: 'Battery bus', sig: 'Solar charging' },
    ],
  },
  wiringNotes: [
    'Sense battery temperature (DS18B20 on the pack) and gate charging via the charge-enable line — never let the MPPT charge the lithium pack below 0 °C.',
    'Mount the BME280 inside an aspirated radiation shield; run the low-power fan only when needed so its draw does not dominate the energy budget.',
    'Temperature-correct the snow-depth ultrasonic reading using air temperature — the speed of sound varies enough across a mountain day to matter to centimetres.',
    'Choose an ice-shedding or sonic anemometer and mount all moving parts to shed rime; frozen bearings are the classic alpine failure.',
    'Guy the mast for peak gusts and seal the enclosure against spindrift; route the satellite/LoRa antenna clear of the mast and ice build-up.',
  ],

  block: { columns: [
    { label: 'Measure (hardened)', edge: 'right', blocks: [
      { name: 'T/RH/pressure', sub: 'aspirated BME280', highlight: true },
      { name: 'Wind', sub: 'ice-shedding' },
      { name: 'Snow depth', sub: 'temp-corrected' },
      { name: 'Battery temp', sub: 'charge gate' },
    ] },
    { label: 'Survive + decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'sip power, log' },
      { name: 'Power mgmt', sub: 'cold charging' },
    ] },
    { label: 'Backhaul', edge: 'right', blocks: [
      { name: 'LoRa', sub: 'valley gateway' },
      { name: 'Satellite', sub: 'if no LoRa' },
    ] },
    { label: 'Users', edge: 'none', blocks: [
      { name: 'Forecast/research', sub: 'weather + snow' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Read weather + snow + battery temp', k: 'proc' },
    { t: 'Battery above 0 °C?', k: 'dec', yes: 'Allow charging', no: 'Inhibit charging' },
    { t: 'Allow charging', k: 'io' },
    { t: 'Inhibit charging', k: 'io' },
    { t: 'Log locally', k: 'proc' },
    { t: 'Reporting slot and power OK?', k: 'dec', yes: 'Send compact prioritised packet', no: 'Defer, keep logging' },
    { t: 'Send compact prioritised packet', k: 'io' },
    { t: 'Defer, keep logging', k: 'io' },
    { t: 'Deep sleep', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'At altitude the sensing is standard meteorology; the difficulty is that the environment corrupts or destroys naive measurements, so each sensor needs a survival strategy. Air temperature must come from an <b>aspirated, shielded</b> sensor: mountain sun is intense and an unshielded probe heats its own body several degrees above the true air temperature, and even a passive shield can read warm in still, sunny conditions, which is why a small fan drawing air past the sensor gives the honest reading energy budget permitting. Snow depth — often the whole point of the station — is measured by timing an ultrasonic echo off the snow surface, but the speed of sound falls with temperature, so the same echo time means a different distance at −25 °C than at +5 °C; without temperature correction the snow record drifts by centimetres over a day, which is the difference between useful and useless for hydrology. Wind is measured by an anemometer whose enemy is <b>rime ice</b> that locks the bearings; ice-shedding designs or sonic anemometers (no moving parts) are chosen precisely for that.',
    'The <b>power</b> problem is the one that most often kills alpine stations, and it has a cruel twist: lithium-ion batteries not only lose capacity in the cold but <i>must not be charged below 0 °C</i>, because charging a frozen cell plates lithium metal and permanently damages (and can be a safety hazard) it. So the power system cannot just track voltage — it must sense the battery\'s temperature and <b>gate charging</b>, refusing solar charge when the pack is below freezing (or warming the pack, or using a cold-charge-tolerant chemistry). Combined with short winter days, frequent storm-obscured sun, and deep cold sapping capacity, this forces a design that sleeps almost all the time, wakes briefly to sample and log, and treats every milliwatt-hour as scarce. The station\'s longevity is decided here, not in the sensors.',
    '<b>Communication</b> is the second dominant constraint and shapes the whole reporting philosophy. In a valley-visible site, long-range LoRa reaches a gateway cheaply, and the node can report fairly often. Where terrain blocks any LoRa path — deep in a range, on the far side of a ridge — the only option is a <b>satellite</b> link such as Iridium Short-Burst Data, and satellite airtime costs meaningful power and money <i>per message and per byte</i>. That inverts the usual telemetry mindset: instead of streaming, the node hoards data locally and transmits infrequently, compactly, and by <b>priority</b> — sending a hazardous change (a rapid pressure drop, a wind spike, a snow-loading event) promptly while batching routine observations into rare, dense packets. Local logging underpins all of it: a storm that severs the link for a week must not create a hole in the record, so the node always writes first and transmits when it can.',
    'The unifying principle is that a high-altitude node is judged almost entirely on <b>uptime in adversity</b>. A backyard station is judged on accuracy; an alpine station is judged on whether it is still reporting after the first blizzard, the first −30 °C night, the first week without sun, the first rime event. So the engineering effort goes where the failures are: temperature-managed power, ice-and-wind-hardened mechanics, honest shielded sensing, and a frugal, resilient reporting discipline. Get those right and the ordinary weather sensors inside will deliver a season of data from a place that has never had any — which is exactly why these stations are worth the trouble.',
  ],
  equations: [
    { t: 'Temperature-corrected snow depth', eq: 'Ultrasonic distance to the snow surface:\n\n  c(T) = 331.3 + 0.606·T_air   (m/s)\n  distance = c(T) · t_echo / 2\n  snow_depth = sensor_height − distance\n\nAcross a mountain day T_air can swing 30 °C+, changing c by\n~5% — several cm of apparent depth if uncorrected.' },
    { t: 'Cold-charge gate', eq: 'Protect the lithium pack:\n\n  allow_charge = (T_batt > T_CHG_MIN)    (T_CHG_MIN ~ 0–5 °C)\n\nBelow the threshold, inhibit the charger (or warm the pack).\nDischarge is usually permitted colder than charge, but\ncapacity falls — budget for reduced usable Ah in the cold.' },
    { t: 'Energy budget in the dark', eq: 'Survive the worst dark/storm run of D days:\n\n  usable_Wh ≥ D · daily_consumption\n  daily_consumption = wake_energy·N + comms_energy·M + sleep·24h\n\nSatellite comms dominate M-term energy → keep M small.\nSize battery for cold-derated capacity AND the longest\nexpected sunless period, not the average.' },
  ],

  assembly: [
    { h: 'Build the power system first', p: [
      'Assemble a cold-capable battery in an insulated box with a temperature sensor on the pack, charged through an MPPT controller whose charge path is gated by a charge-enable line the ESP32 controls.',
      'Verify that below 0 °C the charger is inhibited, and size the pack for cold-derated capacity across your longest expected sunless period.',
    ], warn: 'Charging a lithium pack below freezing damages it. Prove the charge-gate works cold before deploying — this is the sub-system that most often ends an alpine station\'s life.' },
    { h: 'Mount and harden the sensors', p: [
      'Fit the temperature/humidity sensor in an aspirated radiation shield; mount an ice-shedding or sonic anemometer and vane; aim the snow-depth ultrasonic sensor straight down at the snow from a fixed, known height.',
      'Guy the mast for peak gusts and ensure surfaces shed rime; seal the enclosure against spindrift.',
    ] },
    { h: 'Set up backhaul and logging', p: [
      'Fit LoRa for valley-visible sites or a satellite modem where terrain blocks it; mount the antenna clear of the mast and ice. Confirm local logging works before relying on any link.',
    ] },
  ],
  steps: [
    { h: 'Gate charging on battery temperature', p: [
      'Read the battery temperature every cycle and enable charging only above the safe threshold, inhibiting it (or warming the pack) when the battery is too cold.',
    ], code: {
      file: 'cold-power.ino', lang: 'cpp',
      body: `#define T_CHG_MIN 2.0f      // never charge lithium below this (deg C)
#define PIN_CHG_EN 12

// Called each wake before allowing any solar charge current.
void manageCharging(float battTempC) {
  bool allow = battTempC > T_CHG_MIN;
  digitalWrite(PIN_CHG_EN, allow ? HIGH : LOW);   // gate the MPPT charge path
  // Optionally: if cold but sun is available and a heater exists,
  // warm the pack toward T_CHG_MIN before enabling charge.
}`,
      explain: [
        { ref: 'bool allow = battTempC > T_CHG_MIN', txt: 'Charging is permitted only when the battery is above the safe threshold, protecting the cell from the permanent damage of cold-charging.' },
        { ref: 'digitalWrite(PIN_CHG_EN, allow ? HIGH : LOW)', txt: 'The ESP32 physically gates the charge path, so temperature — not just voltage — governs whether solar energy reaches the battery.' },
        { ref: '// warm the pack toward T_CHG_MIN', txt: 'Where a small heater exists and sun is available, the pack can be warmed into the safe range so charging can resume, trading a little energy for battery health.' },
      ],
    } },
    { h: 'Sample, correct and log', p: [
      'Read weather and snow depth, temperature-correct the snow reading, run the aspiration fan only as needed, and write every observation to local storage before considering transmission.',
    ], tip: 'Log first, always. A severed link during a storm must degrade to a backlog to forward, never a gap in the record.' },
    { h: 'Report by priority within the energy/airtime budget', p: [
      'Send routine observations in infrequent, compact batches; promote a hazardous change (rapid pressure drop, wind spike, snow-loading) to an immediate compact message — but only if the power budget allows.',
    ] },
  ],

  code: [{
    file: 'high-altitude-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   High-Altitude Telemetry Node — ESP32, hardened weather, LoRa/sat

   Survives extreme cold, wind and isolation: temperature-gated
   charging, aspirated/corrected sensing, deep-sleep power sipping,
   local logging, and infrequent prioritised backhaul over LoRa or
   satellite.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <Adafruit_BME280.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_TRIG   26
#define PIN_ECHO   25
#define PIN_WIND   27
#define OW_BATT     4
#define PIN_CHG_EN 12
#define PIN_FAN    13
#define LORA_CS     5
#define LORA_RST   14
#define LORA_DIO0   2

#define SENSOR_HEIGHT_CM 300.0f   // snow sensor height above ground
#define T_CHG_MIN         2.0f
#define WIND_K            2.4f     // km/h per Hz — calibrate
#define ROUTINE_EVERY     6        // send routine batch every 6 wakes (e.g. hourly*6)

Adafruit_BME280 bme;
OneWire ow(OW_BATT); DallasTemperature battT(&ow);
Preferences prefs;

RTC_DATA_ATTR uint16_t wakeCount = 0;
RTC_DATA_ATTR float prevPressure = NAN;
volatile uint32_t windPulses = 0;
void IRAM_ATTR windISR(){ windPulses++; }

float snowDepthCm(float tAir) {
  float c = (331.3f + 0.606f * tAir) / 10000.0f;    // cm/us
  digitalWrite(PIN_TRIG,LOW); delayMicroseconds(2);
  digitalWrite(PIN_TRIG,HIGH); delayMicroseconds(10); digitalWrite(PIN_TRIG,LOW);
  long us = pulseIn(PIN_ECHO,HIGH,40000);
  if(!us) return NAN;
  float dist = us * c / 2.0f;
  return SENSOR_HEIGHT_CM - dist;
}

float windKmh() {
  windPulses = 0;
  attachInterrupt(PIN_WIND, windISR, FALLING);
  delay(3000);                                        // 3 s count window
  detachInterrupt(PIN_WIND);
  return (windPulses / 3.0f) * WIND_K;
}

void logLocal(float t,float rh,float p,float wind,float snow) { /* append */ }

void sendPacket(bool hazard, float t,float rh,float p,float wind,float snow) {
  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  LoRa.begin(433E6); LoRa.setSpreadingFactor(11);     // long range
  LoRa.beginPacket();
  LoRa.printf("{\\"n\\":48,\\"t\\":%.1f,\\"rh\\":%.0f,\\"p\\":%.0f,"
              "\\"wind\\":%.1f,\\"snow\\":%.0f,\\"haz\\":%d}",
              t, rh, p, wind, snow, hazard?1:0);
  LoRa.endPacket();
  LoRa.sleep();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG,OUTPUT); pinMode(PIN_ECHO,INPUT);
  pinMode(PIN_WIND,INPUT_PULLUP);
  pinMode(PIN_CHG_EN,OUTPUT); pinMode(PIN_FAN,OUTPUT);
  Wire.begin(21,22); bme.begin(0x76);
  battT.begin();
  wakeCount++;

  // ── manage cold charging FIRST ──
  battT.requestTemperatures();
  float tBatt = battT.getTempCByIndex(0);
  digitalWrite(PIN_CHG_EN, tBatt > T_CHG_MIN ? HIGH : LOW);

  // ── aspirate then read air temperature honestly ──
  digitalWrite(PIN_FAN, HIGH); delay(20000);          // fan 20 s (budget)
  float tAir = bme.readTemperature();
  float rh   = bme.readHumidity();
  float p    = bme.readPressure()/100.0f;             // hPa
  digitalWrite(PIN_FAN, LOW);

  float snow = snowDepthCm(tAir);
  float wind = windKmh();

  logLocal(tAir, rh, p, wind, snow);                  // always log first

  // ── hazard detection promotes an immediate message ──
  float dP = isnan(prevPressure)? 0 : p - prevPressure;
  prevPressure = p;
  bool hazard = (dP < -3.0f) || (wind > 80.0f);       // fast drop or gale

  bool routineSlot = (wakeCount % ROUTINE_EVERY) == 0;
  if (hazard || routineSlot)
    sendPacket(hazard, tAir, rh, p, wind, snow);      // else just log + sleep

  // ── deep sleep to sip power ──
  esp_sleep_enable_timer_wakeup(600ULL * 1000000ULL); // 10 min base
  esp_deep_sleep_start();
}

void loop() {}   // deep sleep restarts setup()`,
    explain: [
      { ref: 'digitalWrite(PIN_CHG_EN, tBatt > T_CHG_MIN', txt: 'The very first action each wake is to gate charging on battery temperature, so a frozen pack is never charged even for an instant.' },
      { ref: 'digitalWrite(PIN_FAN, HIGH); delay(20000)', txt: 'The aspiration fan runs briefly before the temperature read so sun on the shield does not fake a warm reading — a deliberate, budgeted energy spend for an honest number.' },
      { ref: 'float snow = snowDepthCm(tAir)', txt: 'Snow depth is measured with the speed of sound corrected for the current air temperature, keeping the record accurate across the huge daily temperature swing.' },
      { ref: 'bool hazard = (dP < -3.0f) || (wind > 80.0f)', txt: 'A rapid pressure drop or a gale promotes an immediate report even outside the routine slot — hazardous change is worth the airtime; calm weather waits.' },
      { ref: 'esp_sleep_enable_timer_wakeup(600ULL', txt: 'The node deep-sleeps between short wakes, sipping power so it can survive long dark, cold, storm-bound stretches on a cold-derated battery.' },
    ],
  }],

  config: [
    'Set the snow-sensor height, wind constant, and the routine reporting cadence (balance freshness against energy/airtime).',
    'Set T_CHG_MIN and, if used, heater behaviour for your battery chemistry.',
    'Choose LoRa (long spreading factor) or satellite backhaul and the hazard-promotion thresholds.',
    'Size the battery and panel for cold-derated capacity across your longest expected sunless period.',
  ],
  calibration: [
    { h: 'Snow depth', p: [
      'Verify the temperature-corrected distance against a physical measurement at a couple of temperatures; confirm the sensor height and correction.',
    ] },
    { h: 'Temperature shield', p: [
      'Compare the aspirated reading against a reference in strong sun and calm air; if it reads warm without the fan, the aspiration is doing its job.',
    ] },
    { h: 'Power in the cold', p: [
      'Test the charge-gate at sub-zero temperatures and measure real capacity cold, so the energy budget reflects reality, not datasheet room-temperature figures.',
    ] },
  ],
  testing: [
    { step: 'Chill the battery below 0 °C', expect: 'Charging is inhibited; discharge still works' },
    { step: 'Put the temperature sensor in strong sun', expect: 'Aspirated reading stays near true air temp; unaspirated reads warm' },
    { step: 'Vary air temperature and range to a target', expect: 'Corrected snow depth stays accurate across temperatures' },
    { step: 'Simulate a rapid pressure drop / gale', expect: 'Node promotes an immediate hazard message' },
    { step: 'Sever the link for a simulated multi-day period', expect: 'Local log continues; backlog forwards on reconnect' },
    { step: 'Run a long low-sun cold cycle', expect: 'Node survives on budget; power sub-system holds up' },
  ],
  output: [
    'The dashboard shows the station\'s weather (temperature, humidity, pressure, wind) and snow depth over time, flags hazard-promoted messages, and shows battery temperature/charge state and link health.',
    { file: 'alt-packet.json', lang: 'json', body: `{
  "n": 48,
  "t": -18.4,
  "rh": 72,
  "p": 631,
  "wind": 46.2,
  "snow": 184,
  "haz": 0
}` },
    'A compact routine observation at −18 °C, low mountain pressure (631 hPa reflects the altitude), moderate wind and 184 cm of snow — the kind of data these sites have never before provided, delivered on a tight energy and airtime budget.',
  ],
  troubleshoot: [
    { sym: 'Station dies in the first cold spell', cause: 'Battery cold-charged/damaged or undersized for cold', fix: 'Verify the charge-gate; use cold-capable chemistry/insulation/heater; size for cold-derated capacity and long dark runs' },
    { sym: 'Temperature reads too warm on sunny days', cause: 'Shield not aspirated / poor radiation shield', fix: 'Add aspiration; improve the radiation shield; run the fan before reading' },
    { sym: 'Snow depth drifts with the day', cause: 'No temperature correction of the ultrasonic reading', fix: 'Apply the speed-of-sound correction with air temperature' },
    { sym: 'Anemometer stops in cold', cause: 'Rime ice freezing the bearings', fix: 'Use an ice-shedding or sonic anemometer; mount to shed rime' },
    { sym: 'Data gaps after storms', cause: 'Link severed without local logging', fix: 'Ensure local logging + backlog forwarding; log before transmitting' },
  ],

  iot: {
    protoShort: 'LoRa (long SF) or satellite → gateway → weather system',
    net: {
      nodes: [{ name: 'Alpine node', sub: 'ESP32 hardened' }, { name: 'Other nodes', sub: 'network' }],
      protocol: 'LoRa SF11 / sat', gateway: 'Valley gateway', gatewaySub: 'or Iridium ground',
      uplink: 'MQTT/SBD', cloud: 'Weather/research store', cloudSub: 'archive + alerts',
      clients: [{ name: 'Forecast/research', sub: 'weather + snow' }, { name: 'Phone', sub: 'hazard alerts' }],
    },
    protocol: ['Routine observations batch into infrequent compact packets; hazardous changes promote to immediate messages. Over satellite, every byte costs power and money, so payloads are minimal and prioritised, and local logging backs the whole record.'],
    topics: [
      { t: 'alt/node/48/obs', dir: 'node → gateway', payload: 'compact weather + snow observation' },
      { t: 'alt/node/48/hazard', dir: 'node → gateway', payload: 'promoted rapid-change event' },
      { t: 'alt/node/48/health', dir: 'node → gateway', payload: 'battery temp/charge, RSSI, backlog size' },
    ],
    cloud: ['A store archives the season\'s data for forecasting and research, raises hazard alerts, and tracks each node\'s power and link health so a struggling station is noticed before it goes silent.'],
    dashboard: ['Weather and snow-depth trends per station, hazard markers, and a power/link-health panel (battery temperature, charge state, backlog).'],
    mobile: ['Hazard alerts (rapid pressure drop, gale, snow-loading) and a warning if a node\'s battery or link health is failing.'],
    security: [
      'Sign observations so research/forecast data cannot be spoofed.',
      'Keep local logging authoritative so a lost or metered link never loses the record.',
      'Alert on node silence or falling battery health so a rescue/service visit can be planned before total failure.',
    ],
  },

  perf: [
    'Deep-sleep almost all the time; the aspiration fan and any comms are the main awake-energy costs, so budget them explicitly.',
    'Minimise satellite messages — batch routine data, promote only genuine hazards.',
    'Size everything for cold-derated capacity and the longest sunless period, not average conditions.',
    'Log locally and forward backlogs rather than blocking on a metered or intermittent link.',
  ],
  safety: [
    'Never charge lithium below freezing — protect the pack and avoid the safety hazard of cold-charging.',
    'Install and service in the mountains only with proper alpine safety, avalanche awareness and never alone.',
    'Guy masts and secure enclosures for peak wind and ice loads so the station cannot become a hazard.',
    'Treat the station as an input to expert forecasting (e.g. avalanche), not an authority in itself.',
  ],
  maintenance: [
    'Service before and after the season: inspect for ice/wind damage, reseal enclosures, check guy tension.',
    'Re-verify the charge-gate and battery health each season; cold ages packs.',
    'Clear rime from sensors and antenna; confirm the snow sensor\'s line of sight and height.',
    'Check local logging and backlog forwarding, and clean the solar panel of snow/rime.',
  ],
  future: [
    'Add incoming/outgoing radiation and surface-temperature sensors for full energy-balance research.',
    'Add a small pack heater with a smart budget to enable cold-day charging.',
    'Combine LoRa and satellite adaptively — LoRa when a gateway is reachable, satellite as fallback.',
    'On-device detection of snow-loading/avalanche-relevant events for smarter hazard promotion.',
  ],
  faq: [
    { q: 'What is the hardest part of a high-altitude station?', a: 'Power and survival, not sensing. Keeping a lithium battery healthy (never charging it below freezing), sipping energy through dark storms, and mounting sensors to survive wind and rime are what decide whether the station lives.' },
    { q: 'Why can\'t you charge the battery when it\'s cold?', a: 'Charging lithium-ion below 0 °C plates lithium metal, permanently damaging the cell and risking safety. So the node senses battery temperature and gates charging, or warms the pack first.' },
    { q: 'Why does snow depth need temperature correction?', a: 'It is measured by an ultrasonic echo, and the speed of sound changes with temperature. Across a mountain day\'s huge temperature swing, an uncorrected reading drifts by centimetres — enough to spoil hydrology data.' },
    { q: 'How does it report with no cell coverage?', a: 'Long-range LoRa to a valley gateway where terrain allows, or a satellite modem (e.g. Iridium) where it does not. Satellite airtime is costly, so reporting is infrequent, compact and prioritised, with everything logged locally.' },
    { q: 'What happens during a week-long storm?', a: 'It keeps sampling and logging locally on its energy budget, promotes any hazard it detects if power allows, and forwards the backlog once the link and sun return — so the storm leaves no gap.' },
  ],
  refs: [
    { t: 'Automatic weather stations in mountains — overview', u: 'https://en.wikipedia.org/wiki/Weather_station', s: 'Reference' },
    { t: 'Lithium-ion charging at low temperature', u: 'https://en.wikipedia.org/wiki/Lithium-ion_battery', s: 'Reference' },
    { t: 'Ultrasonic snow-depth sensing and temperature correction', u: 'https://www.usgs.gov/', s: 'USGS' },
    { t: 'Iridium Short-Burst Data (SBD) telemetry', u: 'https://en.wikipedia.org/wiki/Iridium_satellite_constellation', s: 'Reference' },
    { t: 'Radiation shields and aspirated temperature measurement', u: 'https://en.wikipedia.org/wiki/Stevenson_screen', s: 'Reference' },
  ],
  images: ['solar', 'esp32', 'lora'],
  imageCaptions: [
    'Solar power on a cold-managed battery keeps the station alive through dark, storm-bound alpine winters.',
    'ESP32 module sipping power: gating cold charging, sampling hardened sensors, logging and reporting frugally.',
    'A LoRa (or satellite) link carries compact, prioritised weather and snow data out of total isolation.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   049 — Smart CCTV Motion Alerts
   ══════════════════════════════════════════════════════════════════ */
{
  id: '049',
  domainKey: 'ai',
  emoji: '📹', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'Edge camera intelligence that records and alerts only when something real happens — a person, not a swaying tree — so you get few, meaningful notifications instead of a hundred false ones.',

  overview: [
    'The reason people stop trusting their security cameras is false alarms. A basic motion-triggered camera fires on everything: a tree swaying, headlights sweeping a wall, a cloud shadow, rain, an insect on the lens, the day-to-night exposure shift. After the tenth pointless 3 a.m. alert, the owner mutes notifications — and then misses the one that mattered. This project fixes that at the source with <b>edge intelligence</b>: the camera itself decides whether motion is worth your attention, recording and alerting only on genuine events (typically a person), so the handful of alerts you do get are ones you actually act on.',
    'It works in two stages, cheap-then-smart. A fast, low-power <b>motion gate</b> (a PIR sensor and/or frame-differencing) wakes the system only when the scene changes, so the expensive part runs rarely. Then an on-device <b>classifier</b> — a small neural network doing person/object detection — confirms whether the motion is something you care about before anything is recorded or sent. This two-stage design is what makes it practical on modest hardware: the classifier is not grinding through every frame of an empty driveway, only the frames where something moved. The whole decision happens on the device, which also means the video and the analysis stay local — a privacy property that matters for a camera watching your home.',
    'Because it only records and notifies on confirmed events, the benefits compound: storage is a timeline of real events rather than gigabytes of empty footage, notifications are trustworthy enough to leave switched on, and review is fast because there is little to review. It is honest about its limits — a small edge model is not a cloud-scale detector, it can miss or misclassify in hard conditions (heavy rain, thermal glare, unusual angles), and it must be tuned to the scene — and it is built with privacy front of mind, keeping footage on local storage rather than a third-party cloud by default. But as a way to turn a noisy, ignored camera into a calm, reliable one, edge-filtered alerting is exactly the right architecture.',
  ],
  does: [
    'Wakes on a cheap motion gate (PIR and/or frame-differencing) before doing heavy work',
    'Confirms real events with an on-device person/object classifier',
    'Records and notifies only on confirmed events — not on every movement',
    'Keeps video and analysis local for privacy by default',
    'Builds an event timeline instead of hours of empty footage',
    'Tunes detection to the scene (zones, sensitivity, classes of interest)',
    'Sends few, trustworthy notifications with a snapshot',
  ],
  features: [
    'Two-stage cheap-then-smart pipeline for practical edge performance',
    'On-device classification to reject trees, shadows, headlights, weather',
    'Local-first storage and processing for privacy',
    'Event-only recording — a meaningful timeline, minimal storage',
    'Region-of-interest zones and per-class alerting',
    'Trustworthy notifications you can leave enabled',
    'Honest about edge-model limits and scene tuning',
  ],
  applications: [
    { t: 'Home security', d: 'A camera that alerts on a person at the door or in the yard but ignores pets, trees and passing cars, so notifications stay meaningful.' },
    { t: 'Small business / premises', d: 'After-hours intrusion alerts with event-only recording, reducing storage and review time for a shopkeeper or office.' },
    { t: 'Package / porch monitoring', d: 'Detecting a person approaching the door (and, with tuning, a delivery) without a flood of false triggers.' },
    { t: 'Remote property / outbuildings', d: 'Low-bandwidth sites where sending only confirmed-event snapshots, not continuous video, is essential.' },
  ],
  skills: [
    'Building a two-stage motion-gate → classifier pipeline',
    'Running a quantised object-detection model on the edge (ESP32-S3 / Raspberry Pi)',
    'Frame-differencing and PIR gating',
    'Region-of-interest and per-class alert logic',
    'Local storage, notification and privacy-preserving design',
  ],
  prereq: [
    'Gate the expensive classifier behind a cheap motion trigger, or you will burn power/compute on empty scenes.',
    'A small edge model is not infallible — expect to tune zones, thresholds and classes to the scene, and accept some miss/false rate in hard conditions.',
    'Keep footage local by default; if any cloud is used, be explicit and secure it — this camera watches private space.',
    'Respect privacy and law: point cameras at your own property, not neighbours or public spaces where prohibited.',
  ],

  parts: ['esp32s3', 'esp32cam', 'pir', 'sdcard', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Camera module (OV2640/OV5640 or Pi cam)', spec: 'Matched to the compute board; wide-ish FOV for coverage', qty: 1, price: 500, note: 'ESP32-S3 for lightweight models; Raspberry Pi for larger detectors' },
    { name: 'Raspberry Pi (optional, heavier models)', spec: 'Pi 4/5 for full object detection where ESP32-S3 is too limited', qty: 1, price: 4500, note: 'Choose the board to match the model you need' },
    { name: 'IR illuminator (night)', spec: 'Invisible IR LEDs for low-light detection', qty: 1, price: 250 },
    { name: 'Weatherproof housing', spec: 'IP-rated, clear window, shades the lens from sun/rain', qty: 1, price: 400 },
  ],
  cost: '₹2,500 – ₹7,000 (board-dependent)',
  libs: ['wifi', 'pubsub', 'tflmicro', 'esptask', 'arduinojson', 'sdcard'],

  pins: {
    left: [
      { dev: 'Camera', devPin: 'parallel/CSI', pin: 'DVP / CSI', sig: 'Image capture' },
      { dev: 'PIR', devPin: 'OUT', pin: 'GPIO 13', sig: 'Cheap motion wake gate' },
      { dev: 'IR illuminator', devPin: 'EN', pin: 'GPIO 12', sig: 'Night lighting' },
    ],
    right: [
      { dev: 'microSD', devPin: 'SPI/SDIO', pin: 'GPIO 39-42', sig: 'Local event storage' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Notifications (snapshot)' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Recording/alert indicator' },
      { dev: 'TP4056/mains', devPin: 'OUT', pin: '3V3 reg', sig: 'Supply' },
    ],
  },
  wiringNotes: [
    'Wake the compute on the PIR (and/or a light frame-difference check) so the classifier is not running on an empty scene draining power/compute.',
    'On ESP32-S3, use PSRAM for the frame buffer and the model; a detector will not fit or run without it.',
    'Add an IR illuminator for night detection and switch it via a GPIO tied to a light sensor or schedule.',
    'Store events to local SD first; treat any cloud/notification path as secondary and secured.',
    'Shade the lens and keep the housing window clean — rain, glare and a dirty window are the classifier\'s worst enemies.',
  ],

  block: { columns: [
    { label: 'Cheap gate', edge: 'right', blocks: [
      { name: 'PIR / frame-diff', sub: 'wake on change', highlight: true },
    ] },
    { label: 'Smart confirm', edge: 'right', blocks: [
      { name: 'Camera', sub: 'capture frame' },
      { name: 'Edge model', sub: 'person/object' },
    ] },
    { label: 'Act (only if real)', edge: 'right', blocks: [
      { name: 'Record event', sub: 'local SD' },
      { name: 'Notify', sub: 'snapshot' },
    ] },
    { label: 'Owner', edge: 'none', blocks: [
      { name: 'Event timeline', sub: 'few, real' },
    ] },
  ] },
  flow: [
    { t: 'Sleep / low-power watch', k: 'start' },
    { t: 'Motion gate tripped?', k: 'dec', yes: 'Capture frame(s)', no: 'Sleep / low-power watch' },
    { t: 'Capture frame(s)', k: 'proc' },
    { t: 'Run edge classifier', k: 'proc' },
    { t: 'Object of interest present?', k: 'dec', yes: 'Record + notify with snapshot', no: 'Discard; back to watch' },
    { t: 'Record + notify with snapshot', k: 'io' },
    { t: 'Discard; back to watch', k: 'io', back: 'Sleep / low-power watch' },
  ],

  principle: [
    'The whole design exists to raise the <b>signal-to-noise ratio of alerts</b>. A camera is useless as a security tool if its notifications are 99% false, because the owner learns to ignore them and thereby misses the 1% that matters. Naive motion detection — triggering on any pixel change — is a false-alarm machine: vegetation moves, light changes, shadows sweep, weather intrudes, exposure auto-adjusts. Turning that into a trustworthy stream of alerts means adding <b>semantic understanding</b>: not "did pixels change?" but "is there a person (or a car, or a specific class) in the scene?". That question can only be answered by a classifier, and answering it well is what makes the camera worth trusting.',
    'Running a classifier on every frame, though, is expensive — in power on a battery device and in compute on a cheap board — and mostly wasted, because most of the time nothing is happening. Hence the <b>two-stage cheap-then-smart</b> architecture. A very cheap gate — a PIR sensor that reacts to warm bodies, and/or a lightweight frame-differencing check that flags gross pixel change — runs continuously at negligible cost and does nothing but decide <i>when to look properly</i>. Only when the gate trips does the system wake the camera and run the neural network on a frame or two. This keeps the average power and compute low while still bringing real intelligence to bear at the moments that matter, which is exactly the trade that makes edge AI practical on modest hardware.',
    'The <b>edge model</b> itself is a small, quantised object detector — the kind that runs in TensorFlow Lite Micro on an ESP32-S3, or a fuller detector on a Raspberry Pi. It takes a captured frame, and outputs the classes and locations of objects it recognises, with confidence scores. The system then applies scene-aware logic: is the detection above a confidence threshold, is it inside a region of interest you care about (the doorway, not the far pavement), and is it a class you want alerts for (a person, perhaps not a cat)? Only when all of that passes does it record the event and send a notification with a snapshot. This layered gating — motion, then class, then confidence, then zone — is what compresses a hundred raw movements into the two or three that genuinely warrant your attention.',
    'Two properties fall out of doing this on the edge, and both matter for a camera. First, <b>privacy</b>: because the frames are captured, analysed and (only if a real event) recorded locally, the video never has to leave the device or go to a third-party cloud — a meaningful assurance for something pointed at your front door. Second, <b>efficiency of everything downstream</b>: storage becomes a compact timeline of real events instead of endless empty footage, bandwidth is spent only on confirmed-event snapshots (vital at low-bandwidth remote sites), and review is fast because there is little to review. The system is candid that a small edge model is fallible — it can miss a person in heavy rain or misjudge an odd angle, and it needs tuning to each scene — and that where higher accuracy is essential a larger model or a cloud stage may be warranted. But the core insight holds: put the intelligence where the camera is, gate it cheaply, and you convert an ignored, noisy sensor into a calm, trustworthy one.',
  ],
  equations: [
    { t: 'Two-stage expected cost', eq: 'Let p = fraction of time the cheap gate trips.\n\n  avg_cost ≈ gate_cost + p · classifier_cost\n\nBecause p is small (scene mostly static) and\nclassifier_cost >> gate_cost, the gate slashes average\npower/compute versus running the model every frame.' },
    { t: 'Frame-difference motion gate', eq: 'Between frames f_t and f_{t-1} (grayscale):\n\n  D = Σ |f_t(x,y) − f_{t-1}(x,y)|  over the region of interest\n  motion if D > D_thresh   (with a warm-up/adaptation for light)\n\nSlowly adapt a reference frame to absorb gradual lighting\nchanges so a drifting sun does not count as motion.' },
    { t: 'Alert decision (layered gating)', eq: 'alert if:\n  motion_gate AND\n  detect(class ∈ classes_of_interest) AND\n  confidence > C_thresh AND\n  bbox_centre ∈ region_of_interest\n\nEach clause removes a class of false alarm (empty motion,\nwrong object, low-confidence, out-of-zone). Tune per scene.' },
  ],

  assembly: [
    { h: 'Choose and set up the compute + camera', p: [
      'Pick the board to match the model: an ESP32-S3 with PSRAM for a lightweight person detector, or a Raspberry Pi for a fuller object detector. Wire the camera and confirm you can capture frames into a buffer the model can consume.',
      'Add an IR illuminator for night operation, switched by a light sensor or schedule.',
    ] },
    { h: 'Wire the cheap motion gate', p: [
      'Connect a PIR to a wake/interrupt pin, and/or implement a lightweight frame-difference check, so the classifier only runs after the gate trips.',
    ], warn: 'Without the gate, a battery camera will flatten its cells running the model on an empty scene, and a cheap board may not keep up. The gate is what makes edge inference viable.' },
    { h: 'Set up storage, notification and housing', p: [
      'Store events to local SD and configure a secured notification path (snapshot on confirmed event). House everything weatherproof with a clean, shaded window.',
    ] },
  ],
  steps: [
    { h: 'Implement the gate-then-classify pipeline', p: [
      'On a gate trip, capture a frame, run the classifier, and apply the layered gating (class, confidence, zone) before recording and notifying.',
    ], code: {
      file: 'edge-pipeline.ino', lang: 'cpp',
      body: `// Runs only after the cheap motion gate trips.
struct Detection { int cls; float conf; int cx, cy; };

bool inROI(int cx, int cy) {                 // region of interest test
  return cx > ROI_X0 && cx < ROI_X1 && cy > ROI_Y0 && cy < ROI_Y1;
}

void onMotion() {
  captureFrame(frameBuf);                    // wake camera, grab a frame
  Detection dets[MAX_DETS];
  int n = runDetector(frameBuf, dets, MAX_DETS);   // TFLite Micro / Pi model

  bool realEvent = false;
  for (int i = 0; i < n; i++) {
    bool wanted = isClassOfInterest(dets[i].cls);   // e.g. person
    if (wanted && dets[i].conf > C_THRESH &&
        inROI(dets[i].cx, dets[i].cy)) {
      realEvent = true; break;
    }
  }

  if (realEvent) {
    recordEvent(frameBuf);                   // save clip/snapshot locally
    notify(frameBuf);                        // send snapshot notification
  }                                          // else: discard, back to watch
}`,
      explain: [
        { ref: 'void onMotion()', txt: 'This runs only after the cheap gate trips, so the expensive capture-and-classify work happens at the rare moments something actually moved.' },
        { ref: 'int n = runDetector(frameBuf, dets, MAX_DETS)', txt: 'The on-device detector returns the objects it recognises with confidence and location — the semantic understanding a raw motion trigger lacks.' },
        { ref: 'if (wanted && dets[i].conf > C_THRESH && inROI', txt: 'A detection must be the right class, confident enough, and inside the region of interest — the layered gating that removes trees, low-confidence noise and out-of-zone activity.' },
        { ref: 'if (realEvent) {', txt: 'Only a confirmed real event triggers recording and a notification, so storage stays a timeline of meaningful events and alerts stay trustworthy.' },
      ],
    } },
    { h: 'Tune to the scene', p: [
      'Set the region of interest, the classes of interest, and the confidence threshold for your camera\'s view; adapt the frame-difference reference to absorb slow lighting changes.',
    ], tip: 'Review a day of events and adjust: if a swaying tree still triggers motion, tighten the ROI; if a distant person is missed, lower the confidence threshold slightly and accept a few more false positives.' },
  ],

  code: [{
    file: 'smart-cctv-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart CCTV Motion Alerts — ESP32-S3 + camera, edge person detection

   Two-stage pipeline: a cheap PIR/frame-difference gate wakes an
   on-device detector that confirms a real event before recording and
   notifying. Local-first for privacy; few, trustworthy alerts.
   ══════════════════════════════════════════════════════════════════ */

#include "esp_camera.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include "person_detect_model.h"        // quantised TFLite Micro model
#include <tensorflow/lite/micro/micro_interpreter.h>

#define PIN_PIR  13
#define PIN_IR   12
#define C_THRESH 0.6f
#define ROI_X0 40
#define ROI_X1 200
#define ROI_Y0 20
#define ROI_Y1 160

WiFiClient net; PubSubClient mqtt(net);
// (TFLite Micro interpreter setup elided for brevity — model in PSRAM)

bool detectPerson(camera_fb_t *fb, float &conf) {
  // Preprocess fb->buf into the model's input tensor (resize, grayscale,
  // quantise), invoke the interpreter, read the person-class score.
  preprocessToInput(fb);
  invokeModel();
  conf = readPersonScore();
  return conf > C_THRESH;
}

void recordEvent(camera_fb_t *fb) {
  // Save the JPEG to local SD with a timestamped name (event timeline).
  saveJpegToSD(fb);
}

void notify(camera_fb_t *fb) {
  // Publish a small snapshot + metadata; footage stays local.
  mqtt.publish("cctv/1/event", "{\\"type\\":\\"person\\",\\"conf\\":true}");
  publishSnapshot(fb);                   // thumbnail only over the network
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_PIR, INPUT);
  pinMode(PIN_IR, OUTPUT);
  cameraInit();                          // PSRAM frame buffer
  modelInit();                           // load model into PSRAM
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
  // Configure PIR as a wake source for deep sleep between events.
  esp_sleep_enable_ext0_wakeup((gpio_num_t)PIN_PIR, 1);
}

void loop() {
  if (!mqtt.connected() && WiFi.status()==WL_CONNECTED) mqtt.connect("cctv-1");
  mqtt.loop();

  // ── cheap gate: only proceed if the PIR sees motion ──
  if (digitalRead(PIN_PIR) == LOW) {
    esp_light_sleep_start();             // sleep until PIR wakes us
    return;
  }

  if (isDark()) digitalWrite(PIN_IR, HIGH);   // night: illuminate
  camera_fb_t *fb = esp_camera_fb_get();      // capture a frame
  digitalWrite(PIN_IR, LOW);

  if (fb) {
    float conf;
    if (detectPerson(fb, conf)) {        // ── smart confirm ──
      recordEvent(fb);                   // real event: record locally
      notify(fb);                        // and send a snapshot
    }                                    // else: discard silently
    esp_camera_fb_return(fb);
  }
}`,
    explain: [
      { ref: 'if (digitalRead(PIN_PIR) == LOW) {\n    esp_light_sleep_start();', txt: 'The cheap PIR gate keeps the device asleep until it sees warm-body motion, so the camera and model only ever run when something might be there.' },
      { ref: 'bool detectPerson(camera_fb_t *fb, float &conf)', txt: 'The captured frame is preprocessed and run through the quantised on-device model, returning whether a person is present above the confidence threshold — the semantic confirmation.' },
      { ref: 'if (isDark()) digitalWrite(PIN_IR, HIGH)', txt: 'The IR illuminator is switched on only for the moment of capture at night, giving the detector a usable image without wasting power lighting an empty scene.' },
      { ref: 'recordEvent(fb);                   // real event: record locally', txt: 'Footage is saved to local SD, keeping the video private and building an event-only timeline instead of continuous storage.' },
      { ref: 'publishSnapshot(fb);                   // thumbnail only', txt: 'Only a small snapshot leaves the device on a confirmed event, keeping bandwidth low and full footage local.' },
    ],
  }],

  config: [
    'Choose the board/model, set the confidence threshold, the region of interest, and the classes you want alerts for.',
    'Configure the motion gate (PIR sensitivity and/or frame-difference threshold with light adaptation).',
    'Set local storage retention and the (secured) notification path; keep footage local by default.',
    'Configure night IR behaviour and any schedule/arming windows.',
  ],
  ai: {
    dataset: [
      'The edge detector is a small, quantised person/object model. You can start from a pre-trained lightweight detector (e.g. a MobileNet-SSD or a TFLite Micro person-detection model) and, if needed, fine-tune it on frames from your own cameras so it performs well on your scenes, angles and lighting.',
      'For a home camera, the classes of interest are usually just "person" (and perhaps "vehicle"); a narrower model is smaller, faster and more reliable than a general 80-class detector on constrained hardware.',
    ],
    datasetTable: [
      { n: 'COCO (person/vehicle subset)', size: '~120k images', lic: 'CC BY 4.0 (annotations)', use: 'Base classes for person/vehicle detection' },
      { n: 'Your-camera fine-tune set', size: 'Hundreds–thousands', lic: 'Your own footage', use: 'Adapt to scene, angle, night IR' },
      { n: 'Visual Wake Words', size: '~100k images', lic: 'CC BY 4.0', use: 'Tiny person-present model for MCUs' },
    ],
    preprocess: [
      'Resize captured frames to the model\'s small input (e.g. 96×96 to 300×300 depending on the model and board).',
      'Convert to the expected format (grayscale for tiny MCU models; RGB for larger detectors) and normalise/quantise to the input tensor\'s type (usually int8).',
      'Optionally restrict inference to the region of interest to cut work and false detections.',
    ],
    pipeline: [
      { name: 'Motion gate', sub: 'PIR / frame-diff', highlight: true },
      { name: 'Capture', sub: 'frame from camera' },
      { name: 'Preprocess', sub: 'resize + quantise' },
      { name: 'Detect', sub: 'edge model' },
      { name: 'Gate result', sub: 'class/conf/ROI' },
      { name: 'Record + notify', sub: 'if real', highlight: true },
    ],
    arch: [
      'A lightweight single-shot detector (MobileNet-SSD-class) or, on the tiniest hardware, a binary "person present?" classifier (the Visual Wake Words approach). Both are quantised to int8 so they fit and run in real time on constrained edge hardware.',
      'On a Raspberry Pi you can afford a fuller detector for better accuracy and multiple classes; on an ESP32-S3 you trade down to a tiny model gated hard by the PIR.',
    ],
    archTable: [
      { l: 'Input', s: '96×96×1 (MCU) / 300×300×3 (Pi)', p: 'Small input keeps inference feasible on the edge' },
      { l: 'Backbone', s: 'MobileNet (depthwise-separable)', p: 'Efficient feature extraction for edge' },
      { l: 'Head', s: 'SSD boxes / binary person score', p: 'Detection or simple person-present decision' },
      { l: 'Quantisation', s: 'int8 (full-integer)', p: 'Fits MCU memory; fast integer inference' },
    ],
    hyper: [
      { k: 'input size', v: '96–300 px', w: 'Smaller = faster/feasible on MCU; larger = more accurate on Pi' },
      { k: 'quantisation', v: 'int8', w: 'Required for MCU; big speed/size win' },
      { k: 'confidence threshold', v: '~0.6', w: 'Trade false positives vs misses per scene' },
      { k: 'NMS IoU', v: '~0.45', w: 'Merge overlapping boxes' },
    ],
    training: [
      'Start from a pre-trained detector to avoid needing huge data; fine-tune on your own labelled frames to close the gap to your specific scenes and night-IR imagery.',
      'Quantisation-aware training (or careful post-training int8 quantisation with a representative dataset) preserves accuracy after shrinking the model for the edge.',
      'Validate on held-out frames from the actual cameras, including hard cases (rain, glare, distant/partial people), not just clean images.',
    ],
    metricsIntro: [
      'The metrics that matter here are not just detection accuracy but the alert experience: how many false alerts per day, and how many real events missed.',
    ],
    metrics: [
      { m: 'Person mAP (scene set)', v: '~0.6–0.8', d: 'Detection quality on your fine-tune data (edge model)' },
      { m: 'False alerts / day', v: 'target < 1–2', d: 'The number that decides whether alerts stay trusted' },
      { m: 'Missed real events', v: 'target ~0', d: 'A missed intrusion is the costly error' },
      { m: 'Inference time', v: '~50–300 ms', d: 'Per frame on the chosen board' },
    ],
    chart: {
      title: 'Alerts per day: naive motion vs edge-confirmed',
      desc: 'Illustrative reduction in false alerts from adding on-device confirmation.',
      unit: '/day',
      bars: [
        { label: 'Naive motion', value: 120 },
        { label: '+ frame-diff ROI', value: 40 },
        { label: '+ edge classifier', value: 2 },
      ],
    },
    deploy: [
      'Deploy the quantised model to the board (TFLite Micro on ESP32-S3, TFLite/ONNX on Raspberry Pi) and run it only behind the motion gate.',
      'Keep the model and footage on-device; send only confirmed-event snapshots off-device.',
      'Provide a simple way to update the model and re-tune thresholds as scenes/seasons change.',
    ],
    inference: {
      file: 'infer.py', lang: 'python',
      body: `# Raspberry Pi variant: gated edge inference with TFLite.
import tflite_runtime.interpreter as tflite
import numpy as np

interp = tflite.Interpreter("person_detect_int8.tflite")
interp.allocate_tensors()
inp = interp.get_input_details()[0]
out = interp.get_output_details()

def is_person(frame, roi, conf_thresh=0.6):
    x = preprocess(frame, inp['shape'])          # resize + int8 quantise
    interp.set_tensor(inp['index'], x)
    interp.invoke()
    boxes, classes, scores = read_outputs(interp, out)
    for b, c, s in zip(boxes, classes, scores):
        if c == PERSON and s > conf_thresh and in_roi(b, roi):
            return True, s
    return False, 0.0

# Only called after the cheap motion gate trips.
def on_motion(frame, roi):
    real, score = is_person(frame, roi)
    if real:
        record_event(frame)        # local storage
        notify(frame, score)       # snapshot only`,
    },
    limits: [
      'A small edge model is not a cloud-scale detector: it can miss or misclassify in heavy rain, strong backlight/IR glare, unusual angles, or with distant/partial figures.',
      'It must be tuned per scene (ROI, thresholds, classes); a model that works on one camera may need adjustment on another.',
      'It confirms classes, not identities — it is not face recognition, and should not be repurposed as covert surveillance.',
    ],
  },
  calibration: [
    { h: 'Scene tuning', p: [
      'Set the ROI to the area you care about and the confidence threshold to balance false alerts against misses; iterate over a day of real events.',
    ] },
    { h: 'Motion gate', p: [
      'Adjust PIR sensitivity/placement and the frame-difference threshold and light-adaptation so ordinary lighting changes and distant vegetation do not wake the classifier constantly.',
    ] },
    { h: 'Night performance', p: [
      'Validate detection under IR illumination; fine-tune with night frames if the model was trained mostly on daytime images.',
    ] },
  ],
  testing: [
    { step: 'Wave a tree branch / shine headlights', expect: 'Motion gate may trip but the classifier rejects it — no alert' },
    { step: 'Walk a person through the ROI', expect: 'Detected, recorded, and a snapshot notification sent' },
    { step: 'Person outside the ROI', expect: 'No alert (zone gating), unless you widen the ROI' },
    { step: 'Leave the scene empty for hours', expect: 'Few/no classifier runs; minimal storage growth' },
    { step: 'Night with IR', expect: 'Person still detected; day-trained model may need night fine-tuning' },
    { step: 'Count false alerts over a day', expect: 'Far fewer than naive motion — the core success metric' },
  ],
  output: [
    'The app shows an event timeline (thumbnails of confirmed detections with time and class), not a continuous stream; storage holds only event clips.',
    { file: 'cctv-event.json', lang: 'json', body: `{
  "camera": 1,
  "type": "person",
  "confidence": 0.82,
  "roi": true,
  "time": "2026-07-27T02:14:07",
  "clip": "/sd/events/20260727-021407.jpg"
}` },
    'Each entry is a confirmed event with its class, confidence and local clip path — a short, meaningful list, which is exactly what makes the alerts worth leaving switched on.',
  ],
  troubleshoot: [
    { sym: 'Still too many false alerts', cause: 'Threshold too low, ROI too wide, or gate too sensitive', fix: 'Raise the confidence threshold, tighten the ROI, and reduce motion-gate sensitivity' },
    { sym: 'Misses real people', cause: 'Threshold too high, model weak at night/angle', fix: 'Lower the threshold slightly; fine-tune the model on your scenes/night frames' },
    { sym: 'Battery drains fast', cause: 'Classifier running too often (weak gate)', fix: 'Strengthen the PIR/frame-diff gate so the model runs rarely; deep-sleep between events' },
    { sym: 'Model won\'t fit / run on the board', cause: 'Model too big for the MCU', fix: 'Use a smaller/int8 model or a person-present classifier; move to a Pi for fuller detection' },
    { sym: 'Privacy concern about footage', cause: 'Assuming cloud upload', fix: 'Keep footage local by default; send only snapshots; secure any network path' },
  ],
  perf: [
    'Gate hard: the PIR/frame-diff stage should keep the classifier idle almost always.',
    'Use int8 quantised models and PSRAM; keep the input small enough to hit your latency target.',
    'Deep-sleep between events on battery devices, waking on the PIR.',
    'Send only snapshots, not video, over the network; keep full footage local.',
  ],
  safety: [
    'Respect privacy and law: point the camera at your own property, avoid neighbours\' windows and public spaces where recording is restricted.',
    'Keep footage local by default; if any cloud is used, disclose it and secure it — this device watches private space.',
    'This confirms object classes, not identities; do not repurpose it as covert or biometric surveillance.',
    'Do not rely on a single edge camera as a life-safety system; it is a deterrent and awareness tool.',
  ],
  maintenance: [
    'Clean the lens/window; rain, dust and cobwebs degrade detection and cause false motion.',
    'Re-tune ROI/thresholds seasonally as foliage, sun angle and scene change.',
    'Update the model periodically and re-validate on recent footage.',
    'Manage local storage retention so the event timeline does not fill the card.',
  ],
  future: [
    'Add on-device tracking to reduce duplicate alerts for one person crossing the scene.',
    'Add package/vehicle/animal classes with per-class alert rules.',
    'Add a privacy-preserving option that stores only blurred/redacted footage except on confirmed intrusion.',
    'Federate several cameras so an event is corroborated across views.',
  ],
  faq: [
    { q: 'Why does it still use a PIR if it has a smart model?', a: 'To keep it practical. Running the neural network on every frame would drain a battery and overwhelm a cheap board. The PIR/frame-diff gate runs for almost nothing and only wakes the model when something might be there.' },
    { q: 'How does it avoid alerting on trees and headlights?', a: 'It confirms the class before alerting — it asks "is there a person?" not "did pixels change?" — and applies confidence and region-of-interest gating, so swaying branches and sweeping lights are rejected.' },
    { q: 'Does my video go to the cloud?', a: 'By default, no. Frames are captured, analysed and (only on a real event) recorded locally, and just a snapshot is sent as a notification. Keeping footage local is a deliberate privacy choice.' },
    { q: 'Will it catch everything?', a: 'No — a small edge model can miss or misclassify in hard conditions (heavy rain, glare, odd angles) and needs tuning per scene. It hugely improves the alert-to-noise ratio, but it is not an infallible detector.' },
    { q: 'Do I need a Raspberry Pi or will an ESP32 do?', a: 'An ESP32-S3 with PSRAM can run a tiny person model gated by a PIR; a Raspberry Pi affords a fuller, more accurate detector and multiple classes. Match the board to the accuracy you need.' },
  ],
  refs: [
    { t: 'TensorFlow Lite for Microcontrollers', u: 'https://www.tensorflow.org/lite/microcontrollers', s: 'TensorFlow' },
    { t: 'Visual Wake Words — person-present on MCUs', u: 'https://arxiv.org/abs/1906.05721', s: 'Research' },
    { t: 'MobileNet-SSD object detection', u: 'https://arxiv.org/abs/1704.04861', s: 'Research' },
    { t: 'PIR motion sensors — principles', u: 'https://en.wikipedia.org/wiki/Passive_infrared_sensor', s: 'Reference' },
    { t: 'Edge AI and privacy — overview', u: 'https://en.wikipedia.org/wiki/Edge_computing', s: 'Reference' },
  ],
  images: ['cctv', 'camera', 'esp32'],
  imageCaptions: [
    'A security camera becomes trustworthy when it alerts only on real events, not every movement.',
    'The camera module captures a frame only when the cheap motion gate trips.',
    'An ESP32-S3 (or Raspberry Pi) runs the on-device detector that confirms a person before recording or notifying.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   050 — Perimeter Laser Trip Sensor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '050',
  domainKey: 'electronics',
  emoji: '🔦', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Invisible modulated light beams strung along a boundary that sound the alarm the instant someone crosses them — and that cannot be quietly fooled by ambient light or a covered emitter.',

  overview: [
    'A perimeter trip sensor is one of the oldest ideas in security — a beam of light across a boundary that, when broken, means something crossed it — and it is still one of the most useful, because it detects an intrusion at the fence line rather than after the intruder is already inside. This project builds a robust, multi-zone version: emitters send beams across the gaps you want to protect (a gateway, a wall-top, a garden boundary) to receivers on the far side, and the instant a beam is interrupted the system raises a located alarm. The difference between a toy and a real security device is entirely in how it handles the ways such a beam can be defeated or falsely triggered, and that is what this design focuses on.',
    'The core robustness trick is <b>modulation</b>. A naive beam — a laser or LED shining steadily at a receiver — is trivially fooled: bright sunlight or a torch can swamp the receiver so it never notices the real beam breaking, and it false-triggers on every passing shadow or cloud. So the emitter is switched on and off at a specific frequency, and the receiver looks <i>only</i> for light pulsing at that exact frequency, ignoring steady ambient light entirely. This makes the beam robust in daylight, and — crucially — makes it far harder to defeat: an attacker cannot simply shine their own light to hold the receiver "made", because it must be the right frequency. The system also detects the two tell-tales of tampering: a beam that goes and stays broken (something is blocking it, or the emitter is covered/failed) and a receiver that suddenly sees an unmodulated flood (someone trying to spoof it).',
    'Around that core sits practical security engineering: multiple beams as separate <b>zones</b> so the alarm tells you <i>where</i> the perimeter was crossed; retroreflective operation (emitter and receiver on the same side, beam bounced off a reflector) to simplify wiring on long runs; supervision so a cut wire or dead emitter raises a fault rather than a silent blind spot; and a networked alarm output to a control panel or siren. It is honest about a beam sensor\'s nature — it detects a crossing, not who or what crossed, and a determined intruder aware of the beam can try to step over or under it, which is why beams are layered and combined with other sensors — but as a fast, all-weather, hard-to-fool line-of-sight detector, a well-built modulated beam perimeter is a genuinely strong first line of defence.',
  ],
  does: [
    'Projects modulated light beams across the boundaries you want to protect',
    'Detects a beam break instantly and raises a located, per-zone alarm',
    'Rejects ambient light (and daylight) by detecting only the modulation frequency',
    'Resists spoofing (wrong-frequency floods) and detects blocked/covered beams',
    'Supervises for cut wires / dead emitters (fault, not silent blind spot)',
    'Supports multiple zones and retroreflective long runs',
    'Drives a networked alarm / control-panel output',
  ],
  features: [
    'Modulated beam — robust in daylight and hard to spoof',
    'Per-zone located alarms (which beam was crossed)',
    'Tamper detection: blocked beam and spoof-flood recognition',
    'Supervision so faults are never silent blind spots',
    'Retroreflective option for simple long-run wiring',
    'Networked alarm output to panel/siren',
    'Honest layering with other sensors for real security',
  ],
  applications: [
    { t: 'Property and yard perimeters', d: 'Beams along a wall-top, gateway or garden boundary that alarm the moment someone crosses, before they reach the building.' },
    { t: 'Doorways and corridors', d: 'A single beam across an entry that detects passage, for shops, storerooms or restricted corridors.' },
    { t: 'Industrial / site boundaries', d: 'Multi-zone perimeter protection around yards, compounds and equipment, with located alarms.' },
    { t: 'Machine-guarding-style safety (adapted)', d: 'Beam-break to stop or warn when someone enters a hazardous zone (with proper safety-rated hardware for true safety use).' },
  ],
  skills: [
    'Building a modulated optical emitter and a frequency-selective receiver',
    'Rejecting ambient light and detecting spoofing/tamper',
    'Multi-zone alarm logic and supervision',
    'Retroreflective beam alignment',
    'Driving alarm outputs and networking events',
  ],
  prereq: [
    'Modulate the beam and detect only that frequency — an unmodulated beam is defeated by daylight and easily spoofed.',
    'Supervise every zone so a cut wire or dead emitter raises a fault, never a silent gap in coverage.',
    'A beam detects a crossing, not who crossed; layer beams and combine with other sensors for real security.',
    'For genuine machine-safety use, only properly safety-rated light curtains/guards are acceptable — this is a security sensor, not a certified safety device.',
  ],

  parts: ['esp32', 'ldr', 'relay1', 'buzzer', 'oled', 'reed', 'psu5v'],
  extraParts: [
    { name: 'Laser/IR emitter modules', spec: 'Modulated laser or IR LED emitters, one per beam/zone', qty: 4, price: 400, note: 'IR is covert; visible laser is easy to align' },
    { name: 'Modulation-tuned receivers', spec: 'Photodiode/phototransistor front-ends (or IR receiver ICs tuned to the carrier)', qty: 4, price: 400, note: 'An IR-remote-style demodulator gives strong ambient rejection' },
    { name: 'Retroreflectors (optional)', spec: 'Corner-cube reflectors for same-side emitter/receiver runs', qty: 4, price: 300 },
    { name: 'Weatherproof beam housings', spec: 'Aligned, hooded housings that shade the receiver and hold aim', qty: 4, price: 600 },
  ],
  cost: '₹2,800 – ₹4,500',
  libs: ['wifi', 'pubsub', 'ssd1306', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Emitter drive', devPin: 'PWM', pin: 'GPIO 25', sig: 'Modulated carrier to all emitters' },
      { dev: 'Receiver z1', devPin: 'OUT', pin: 'GPIO 34', sig: 'Zone 1 demodulated beam' },
      { dev: 'Receiver z2', devPin: 'OUT', pin: 'GPIO 35', sig: 'Zone 2 demodulated beam' },
      { dev: 'Receiver z3/z4', devPin: 'OUT', pin: 'GPIO 32/33', sig: 'Zones 3–4' },
    ],
    right: [
      { dev: 'Siren relay', devPin: 'IN', pin: 'GPIO 26', sig: 'Alarm output' },
      { dev: 'Buzzer', devPin: 'IN', pin: 'GPIO 27', sig: 'Local sounder' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Zone status' },
      { dev: 'Tamper/supervision', devPin: 'in', pin: 'ADC/EOL', sig: 'Wire/emitter fault detect' },
    ],
  },
  wiringNotes: [
    'Drive all emitters from one modulated carrier (a PWM at a few kHz) so every receiver can lock to the same frequency and reject ambient light.',
    'Use frequency-selective receivers — an IR-remote-style demodulator IC, or a photodiode front-end with a band-pass — so only the modulated beam registers as "made".',
    'Hood and align each receiver to shade it from direct sun and hold aim; a receiver staring at bright sky is easily blinded.',
    'Supervise each zone (e.g. end-of-line resistor / expected signal level) so a cut wire or a dead emitter reads as a fault distinct from a clean beam.',
    'For long runs, use retroreflective beams (emitter+receiver together, reflector opposite) to keep wiring on one side.',
  ],

  block: { columns: [
    { label: 'Beam', edge: 'right', blocks: [
      { name: 'Modulated emitter', sub: 'carrier freq', highlight: true },
      { name: 'Tuned receiver', sub: 'freq-selective' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'break/tamper/fault' },
      { name: 'Zones', sub: 'per-beam state' },
    ] },
    { label: 'Alarm', edge: 'right', blocks: [
      { name: 'Siren/relay', sub: 'located alarm' },
      { name: 'Supervision', sub: 'fault not silent' },
    ] },
    { label: 'Control', edge: 'none', blocks: [
      { name: 'Panel', sub: 'zone + status' },
    ] },
  ] },
  flow: [
    { t: 'Emit modulated beams', k: 'start' },
    { t: 'Read each receiver (demodulated)', k: 'proc' },
    { t: 'Beam made at correct frequency?', k: 'dec', yes: 'Zone clear', no: 'Beam broken → alarm (zone)' },
    { t: 'Zone clear', k: 'proc' },
    { t: 'Beam broken → alarm (zone)', k: 'io' },
    { t: 'Unmodulated flood or supervision fail?', k: 'dec', yes: 'Tamper/fault alarm', no: 'Continue' },
    { t: 'Tamper/fault alarm', k: 'io' },
    { t: 'Continue', k: 'end', back: 'Emit modulated beams' },
  ],

  principle: [
    'A beam sensor is a line-of-sight detector: light travels from an emitter to a receiver, and an object crossing the line interrupts it. The value is <b>where</b> it detects — at the boundary, the moment of crossing — and its speed and all-weather reliability. But a beam is only as good as its resistance to the two failure modes that plague naive designs: being blinded/false-triggered by <b>ambient light</b>, and being <b>defeated</b> by an aware adversary. The engineering that separates a real perimeter sensor from a photocell toy is almost entirely about those two problems, and modulation is the key to both.',
    '<b>Modulation</b> means switching the emitter on and off at a chosen carrier frequency (a few kilohertz is typical, exactly as an infrared TV remote does) and building the receiver to respond only to light flickering at that frequency. Steady light — sunlight, room lighting, a torch — is at "DC" from the receiver\'s point of view and is filtered out entirely, so the beam works in bright daylight where a steady beam would be swamped. This is not just about daylight: it is a security property. An attacker who wants to hold the receiver "made" while they cut the real beam cannot just shine any bright light at it; they would have to reproduce the exact modulation, which is far harder and can be made harder still (rolling codes, unusual frequencies). Modulation turns the beam from something a shadow can trip and a torch can spoof into something robust and defensible.',
    'Good perimeter design then treats the receiver\'s state as three-valued, not two. A properly-made, correctly-modulated beam is <b>clear</b>. A beam that is interrupted is a <b>break</b> — the intrusion alarm. But a receiver seeing a strong <i>unmodulated</i> flood, or a beam that has gone dark and stayed dark, is a <b>tamper/fault</b>, not a normal clear or break — someone may be trying to spoof it, or the emitter is covered, or a wire is cut. Recognising this third state is what stops the classic defeat where an intruder blinds or disables a sensor and the system reports "all clear". Coupled with <b>supervision</b> — continuously checking that each zone\'s wiring and signal are healthy (an end-of-line reference, an expected modulated level) — a fault becomes an alarm-worthy event rather than a silent blind spot. A perimeter you cannot trust to notice its own sabotage is not a perimeter.',
    'The rest is practical layering. Multiple beams become independent <b>zones</b> so an alarm is located ("east gate beam broken"), which matters for response. <b>Retroreflective</b> operation — emitter and receiver together, the beam bounced back off a corner-cube reflector — halves the wiring on long runs. And the whole thing feeds a networked alarm output to a panel or siren. The design is candid about what a beam is and is not: it detects a <i>crossing</i>, not an identity, so it cannot tell you whether the thing that broke the beam was an intruder, a large animal or a wind-blown branch (which is why beam height, hooding, and combination with other sensors matter); and a determined, aware intruder may try to step over or crawl under a single beam (which is why beams are layered at multiple heights and paired with volumetric sensors). Used with those limits in mind, though, a modulated, supervised, multi-zone beam perimeter is a fast, robust, and genuinely hard-to-fool first line of detection.',
  ],
  equations: [
    { t: 'Modulated detection (ambient rejection)', eq: 'Emitter driven at carrier f_c (e.g. 4 kHz).\nReceiver band-passes / synchronously detects at f_c:\n\n  beam_made  when demod amplitude @ f_c > A_hi\n  beam_broken when it falls below A_lo   (hysteresis)\n\nSteady ambient light is at ~0 Hz → rejected. Only light\npulsing at f_c counts, giving daylight robustness and\nspoof resistance.' },
    { t: 'Three-state zone logic', eq: 'For each zone, from the demodulated level and supervision:\n\n  CLEAR  : modulated beam present at expected level\n  BREAK  : modulated beam interrupted → intrusion alarm\n  TAMPER : unmodulated flood high, OR supervision fails\n           (beam dark+static, wire fault, emitter covered)\n\nTAMPER is alarm-worthy — it is how a defeat attempt shows.' },
    { t: 'Supervision (end-of-line)', eq: 'Expect a known healthy signature per zone:\n\n  healthy if  A_lo < demod_level < A_sat  AND wiring intact\n  fault  if   level ~0 static (cut/dead) OR saturated (flood)\n\nContinuous supervision means a disabled zone raises a fault\ninstead of silently ceasing to protect.' },
  ],

  assembly: [
    { h: 'Build the modulated emitter/receiver pairs', p: [
      'Drive each emitter (laser or IR LED) from a common carrier frequency, and pair it with a frequency-selective receiver (an IR-demodulator IC or a photodiode front-end with a band-pass) that responds only to that frequency.',
      'Hood and align each receiver to shade it from direct sun and hold its aim on the beam.',
    ], warn: 'An unmodulated beam is not a security sensor — daylight blinds it and a torch spoofs it. Modulation and a frequency-selective receiver are the whole point.' },
    { h: 'Lay out zones and supervision', p: [
      'Run separate beams for each area you want located independently, and wire each zone with supervision (end-of-line reference/expected level) so a cut wire or dead emitter is detectable.',
      'For long runs, use retroreflective beams to keep emitter and receiver on the same side.',
    ] },
    { h: 'Wire alarm output and status', p: [
      'Connect a siren/relay and local buzzer for alarms, an OLED for zone status, and Wi-Fi to a panel. Ensure the alarm sounds locally regardless of the network.',
    ] },
  ],
  steps: [
    { h: 'Drive the carrier and demodulate', p: [
      'Emit a steady carrier on all beams and evaluate each receiver\'s demodulated level, classifying each zone as clear, broken, or tampered, with hysteresis to avoid flicker.',
    ], code: {
      file: 'beam-zones.ino', lang: 'cpp',
      body: `enum Zone { CLEAR, BREAK, TAMPER };
#define A_LO   400        // ADC counts: below = beam broken
#define A_HI   700        // above = beam made
#define A_SAT 3800        // near-saturation with no modulation = flood

// Evaluate one zone from its demodulated receiver level + modulation check.
Zone evalZone(int demodLevel, bool modulationPresent) {
  if (demodLevel > A_SAT && !modulationPresent) return TAMPER;  // spoof flood
  if (demodLevel < A_LO)  return BREAK;                         // interrupted
  if (demodLevel > A_HI && modulationPresent) return CLEAR;     // healthy beam
  return TAMPER;                                                // ambiguous/fault
}

void scanZones(int levels[], bool mod[], int n) {
  for (int z = 0; z < n; z++) {
    Zone s = evalZone(levels[z], mod[z]);
    if (s == BREAK)  raiseAlarm(z, "intrusion");
    if (s == TAMPER) raiseAlarm(z, "tamper/fault");
    setZoneStatus(z, s);
  }
}`,
      explain: [
        { ref: 'if (demodLevel > A_SAT && !modulationPresent) return TAMPER', txt: 'A strong but unmodulated flood is the signature of a spoofing attempt — bright light held on the receiver at the wrong frequency — and is treated as tamper, not clear.' },
        { ref: 'if (demodLevel < A_LO)  return BREAK', txt: 'A collapse of the demodulated level means the modulated beam is interrupted — the intrusion alarm.' },
        { ref: 'if (demodLevel > A_HI && modulationPresent) return CLEAR', txt: 'Only a strong signal that is genuinely modulated at the carrier counts as a healthy, clear beam — steady ambient light cannot fake it.' },
        { ref: 'return TAMPER;                                                // ambiguous/fault', txt: 'Anything that is neither a clean make nor a clean break — a marginal or static signal — is treated as a fault rather than silently ignored, so a disabled zone cannot masquerade as clear.' },
      ],
    } },
    { h: 'Supervise, alarm and network', p: [
      'Continuously supervise each zone\'s wiring/signal, sound the local alarm on break or tamper, latch the located event, and report zone states to the panel.',
    ], tip: 'Latch alarms until acknowledged so a brief break (someone stepping through) is not missed if you glance away.' },
  ],

  code: [{
    file: 'perimeter-laser-trip.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Perimeter Laser Trip Sensor — ESP32, modulated multi-zone beams

   Emits modulated beams, detects breaks per zone, rejects ambient
   light and spoof floods, supervises for wire/emitter faults, and
   raises located alarms to a local siren and a networked panel.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define PIN_CARRIER 25     // modulated emitter drive (all beams)
#define PIN_SIREN   26
#define PIN_BUZZER  27
#define NZONES       4
#define CARRIER_HZ 4000
#define A_LO   400
#define A_HI   700
#define A_SAT 3800

const int RX[NZONES] = {34, 35, 32, 33};
WiFiClient net; PubSubClient mqtt(net);
Adafruit_SSD1306 oled(128,64,&Wire);

enum Zone { CLEAR, BREAK, TAMPER };
const char *ZS[] = {"clear","BREAK","TAMPER"};
Zone state[NZONES];
bool latched[NZONES] = {false};

// Synchronous detection: sample the receiver in phase with the carrier
// to measure how much of the signal is at the carrier frequency.
int demodLevel(int pin, bool &modulationPresent) {
  long onSum = 0, offSum = 0; const int N = 64;
  for (int i = 0; i < N; i++) {
    digitalWrite(PIN_CARRIER, HIGH); delayMicroseconds(125); // half period @4kHz
    onSum  += analogRead(pin);
    digitalWrite(PIN_CARRIER, LOW);  delayMicroseconds(125);
    offSum += analogRead(pin);
  }
  int amplitude = (onSum - offSum) / N;        // modulated component
  int average   = (onSum + offSum) / (2 * N);  // total incl. ambient
  modulationPresent = amplitude > 60;          // real carrier present?
  // Report the modulated amplitude as the "beam level"; average detects flood.
  if (average > A_SAT && !modulationPresent) return A_SAT + 1; // signal flood
  return constrain(amplitude, 0, 4095);
}

Zone evalZone(int level, bool mod) {
  if (level > A_SAT && !mod) return TAMPER;
  if (level < A_LO)          return BREAK;
  if (level > A_HI && mod)   return CLEAR;
  return TAMPER;
}

void raiseAlarm(int z, const char *why) {
  latched[z] = true;
  digitalWrite(PIN_SIREN, HIGH);
  digitalWrite(PIN_BUZZER, HIGH);
  char m[100];
  snprintf(m, sizeof m, "{\\"zone\\":%d,\\"event\\":\\"%s\\"}", z+1, why);
  mqtt.publish("perimeter/alarm", m);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_CARRIER, OUTPUT);
  pinMode(PIN_SIREN, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  for (int z = 0; z < NZONES; z++) analogSetPinAttenuation(RX[z], ADC_11db);
  Wire.begin(21,22); oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  mqtt.setServer(MQTT_HOST, 1883);
}

void loop() {
  if (!mqtt.connected() && WiFi.status()==WL_CONNECTED) mqtt.connect("perim-1");
  mqtt.loop();

  bool anyAlarm = false;
  oled.clearDisplay(); oled.setCursor(0,0);
  for (int z = 0; z < NZONES; z++) {
    bool mod;
    int level = demodLevel(RX[z], mod);
    Zone s = evalZone(level, mod);
    state[z] = s;
    if (s == BREAK)  { raiseAlarm(z, "intrusion");   anyAlarm = true; }
    if (s == TAMPER) { raiseAlarm(z, "tamper/fault"); anyAlarm = true; }
    if (latched[z]) anyAlarm = true;
    oled.printf("Z%d: %s\\n", z+1, ZS[s]);
  }
  oled.display();

  // siren stays on while any zone is latched (until acknowledged)
  if (!anyAlarm) { digitalWrite(PIN_SIREN, LOW); digitalWrite(PIN_BUZZER, LOW); }
  delay(50);      // ~20 Hz scan — fast enough to catch a crossing
}`,
    explain: [
      { ref: 'int demodLevel(int pin, bool &modulationPresent)', txt: 'Samples the receiver in phase with the carrier — measuring on-phase minus off-phase — so it extracts only the light that is actually pulsing at the beam\'s frequency, rejecting steady ambient light.' },
      { ref: 'if (average > A_SAT && !modulationPresent)', txt: 'A high total level with no modulated component is a flood-spoof attempt, flagged so a bright light held on the receiver cannot fake a made beam.' },
      { ref: 'Zone evalZone(int level, bool mod)', txt: 'Classifies each zone into the three meaningful states — clear, break, tamper — so a defeat attempt or a fault is an alarm, never a silent clear.' },
      { ref: 'void raiseAlarm(int z, const char *why)', txt: 'Latches and sounds a located alarm and publishes which zone and why, so response knows exactly where the perimeter was crossed or tampered.' },
      { ref: 'if (latched[z]) anyAlarm = true;', txt: 'Alarms latch until acknowledged, so a momentary beam break by someone stepping through is not missed when you look away.' },
    ],
  }],

  config: [
    'Set the carrier frequency and the A_LO/A_HI/A_SAT thresholds to your emitters/receivers and range.',
    'Define the zones (which receiver is which boundary) and their supervision expectations.',
    'Configure alarm latching/acknowledgement and the siren/panel outputs.',
    'Choose visible-laser (easy alignment) vs IR (covert) emitters and set beam heights/layering.',
  ],
  calibration: [
    { h: 'Beam levels', p: [
      'With each beam aligned and clear, record the demodulated level; set A_HI below it and A_LO above the broken level, with margin, for reliable make/break.',
    ] },
    { h: 'Ambient/spoof rejection', p: [
      'Shine steady light (torch/sun) at a receiver and confirm it does not read "made"; confirm an unmodulated flood registers as tamper.',
    ] },
    { h: 'Supervision', p: [
      'Disconnect/cover an emitter and confirm the zone reads fault/tamper, not clear — proving the perimeter notices its own sabotage.',
    ] },
  ],
  testing: [
    { step: 'Break a beam by walking through', expect: 'That zone alarms instantly and is located; alarm latches' },
    { step: 'Shine a torch at a receiver', expect: 'No "clear" spoof; steady light rejected, flood flagged as tamper' },
    { step: 'Cover/disable an emitter', expect: 'Zone reads tamper/fault — not a silent clear' },
    { step: 'Cut a zone wire (bench)', expect: 'Supervision raises a fault' },
    { step: 'Operate in bright daylight', expect: 'Beams stay reliable thanks to modulation' },
    { step: 'Acknowledge an alarm', expect: 'Latched siren clears; zones resume normal monitoring' },
  ],
  output: [
    'The panel/OLED shows each zone\'s state (clear/break/tamper); alarms are located by zone and latched until acknowledged.',
    { file: 'perimeter-alarm.json', lang: 'json', body: `{
  "zone": 2,
  "event": "intrusion",
  "time": "2026-07-27T02:14:31"
}` },
    'A located intrusion on zone 2 (say the east gate beam) — the operator knows exactly where the perimeter was crossed, and a tamper event would be flagged the same way if someone tried to blind or cut a beam.',
  ],
  troubleshoot: [
    { sym: 'False alarms in sunlight', cause: 'Beam not truly modulated / receiver not frequency-selective', fix: 'Ensure emitter modulation and synchronous/band-pass detection; hood the receiver' },
    { sym: 'Beam can be spoofed with a torch', cause: 'Detecting brightness, not modulation', fix: 'Detect only the modulated component; flag unmodulated floods as tamper' },
    { sym: 'Intermittent breaks (flicker)', cause: 'Misalignment, vibration, or thresholds too tight', fix: 'Re-align and steady the mounts; widen make/break hysteresis' },
    { sym: 'Disabled zone reads clear', cause: 'No supervision', fix: 'Add end-of-line/expected-signal supervision so faults alarm' },
    { sym: 'Range too short / weak signal', cause: 'Insufficient emitter power or dirty optics', fix: 'Increase emitter power within eye-safety limits; clean optics; use retroreflectors' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → alarm panel / control room',
    net: {
      nodes: [{ name: 'Beam controller', sub: 'ESP32' }, { name: 'Zones', sub: 'per-beam receivers' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'local-first alarm',
      uplink: 'MQTT 1883', cloud: 'Panel / control room', cloudSub: 'zone state + events',
      clients: [{ name: 'Panel', sub: 'zone map' }, { name: 'Phone/SMS', sub: 'alarms' }],
    },
    protocol: ['Zone states and located alarm/tamper events publish immediately; the local siren fires independent of the network so a crossing is signalled even if the link is down.'],
    topics: [
      { t: 'perimeter/alarm', dir: 'node → panel', payload: 'zone, event (intrusion/tamper), time' },
      { t: 'perimeter/zones', dir: 'node → panel', payload: 'per-zone clear/break/tamper state' },
      { t: 'perimeter/ack', dir: 'panel → node', payload: 'acknowledge/clear a latched alarm' },
    ],
    cloud: ['A panel shows the perimeter as a zone map, logs every located alarm and tamper, and lets an operator acknowledge alarms; multiple controllers cover a large site.'],
    dashboard: ['A boundary/zone map coloured by state, an event log of located intrusions and tampers, and supervision/health indicators per zone.'],
    mobile: ['Immediate located alerts on intrusion or tamper, with acknowledge.'],
    security: [
      'Keep the local siren and alarm logic independent of the network so a lost link cannot disable protection.',
      'Authenticate acknowledgements so only authorised operators can clear alarms.',
      'Treat tamper/supervision events as first-class alarms — they are how a defeat attempt appears.',
    ],
  },

  perf: [
    'Scan fast enough (tens of Hz) to catch a quick crossing, but no faster than needed.',
    'Use synchronous detection with enough samples to reject ambient reliably without heavy CPU.',
    'Drive all emitters from one carrier to keep timing simple and receivers comparable.',
    'Latch alarms so brief breaks are never missed between scans.',
  ],
  safety: [
    'A beam sensor detects a crossing, not an identity or intent; layer beams and combine with other sensors for real security.',
    'Use eye-safe emitter power, especially with lasers; never aim a laser where it could reach eyes at close range.',
    'For genuine machine-safety, use only properly safety-rated light curtains/guards — this is a security sensor, not a certified safety device.',
    'Keep the local alarm functional independent of the network so protection does not depend on connectivity.',
  ],
  maintenance: [
    'Clean emitter/receiver optics and reflectors; dirt reduces range and causes false breaks.',
    'Re-verify alignment after weather/vibration; check beam levels against the calibration.',
    'Test each zone\'s tamper/supervision periodically so faults still alarm.',
    'Confirm the siren, latching and acknowledge paths work.',
  ],
  future: [
    'Add rolling-code modulation for even stronger anti-spoof security.',
    'Add beam-height layering and pairing with PIR/camera for classification of what crossed.',
    'Add battery backup so the perimeter survives mains loss (a classic attack).',
    'Auto-alignment feedback to speed installation and flag drift.',
  ],
  faq: [
    { q: 'Why modulate the beam instead of just shining it?', a: 'A steady beam is blinded by daylight and spoofed by a torch. Modulating it and detecting only that frequency makes it work in bright sun and much harder to fool — the receiver ignores any light that is not pulsing at the right frequency.' },
    { q: 'Can an intruder just cover the sensor and disable it?', a: 'That is exactly what the tamper/supervision logic catches. A covered emitter, a spoof flood, or a cut wire reads as a tamper/fault alarm, not a silent clear — a disabled zone is an alarm, not a blind spot.' },
    { q: 'Does it know who or what crossed the beam?', a: 'No — it detects a crossing, not an identity. That is why beams are layered at different heights and combined with other sensors (PIR, cameras) so an intruder cannot simply step over or crawl under one beam unnoticed.' },
    { q: 'Why multiple zones?', a: 'So the alarm is located. Knowing "the east gate beam was broken" rather than just "something happened" lets you respond to the right place — essential on any real perimeter.' },
    { q: 'Is this good enough for machine safety?', a: 'No. For protecting people from machinery you must use properly safety-rated light curtains and guards. This is a security intrusion sensor, not a certified safety device.' },
  ],
  refs: [
    { t: 'Photoelectric / beam-break sensors — principles', u: 'https://en.wikipedia.org/wiki/Photoelectric_sensor', s: 'Reference' },
    { t: 'Modulated IR detection and ambient rejection (IR remotes)', u: 'https://en.wikipedia.org/wiki/Consumer_IR', s: 'Reference' },
    { t: 'Perimeter intrusion detection systems — overview', u: 'https://en.wikipedia.org/wiki/Perimeter_intrusion_detection', s: 'Reference' },
    { t: 'Retroreflectors (corner cubes)', u: 'https://en.wikipedia.org/wiki/Retroreflector', s: 'Reference' },
    { t: 'Laser safety and eye-safe power', u: 'https://en.wikipedia.org/wiki/Laser_safety', s: 'Reference' },
  ],
  images: ['cctv', 'esp32', 'factory'],
  imageCaptions: [
    'Modulated beams along a boundary detect a crossing at the perimeter, before an intruder reaches the building.',
    'ESP32 module driving the carrier and demodulating each zone to distinguish clear, break and tamper.',
    'Multi-zone located alarms feed a control panel so response knows exactly where the perimeter was crossed.',
  ],
},

];
