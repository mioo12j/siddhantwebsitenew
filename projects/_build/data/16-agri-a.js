/* ═══════════════════════════════════════════════════════════════════
   Agriculture — projects 027–029
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 027 · Smart Greenhouse Controller ───────────────────────────── */
{
  id: '027',
  domainKey: 'iot',
  emoji: '🌿',
  thumb: 'greenhouse',
  difficulty: 'Intermediate',
  hours: '16–24 hours',
  iso8601: 'PT20H',
  tagline: 'A greenhouse controller that manages temperature, humidity, light and ventilation together — respecting how they interact — rather than as four independent thermostats fighting each other.',

  overview: [
    'A greenhouse is a coupled system, and that is what makes controlling it interesting. Opening a vent to drop the temperature also drops the humidity and admits outside CO₂. Running a heater raises the temperature and lowers the relative humidity. Misting to raise humidity cools the air. A naive controller with four independent loops — one for each variable — spends its day fighting itself: the vent opens to cool, the humidity alarm fires, the mister runs, which cools further, so the heater comes on. This project treats the greenhouse as the coupled system it is.',
    'The controller manages <b>temperature, humidity, light and ventilation</b> with an awareness of how each actuator affects multiple variables. It uses a priority-and-deadband scheme rather than four independent PID loops: at any moment it decides which variable is furthest outside its acceptable band, chooses the actuator that best corrects it with the least disruption to the others, and moves in small steps. This is how commercial greenhouse computers actually work, and it produces stable conditions instead of oscillation.',
    'The measurements are done properly — the temperature and humidity sensor is shielded and aspirated (a small fan draws air past it) so it reads the greenhouse air rather than a sun-warmed enclosure, and the light sensor measures photosynthetically active radiation so supplemental lighting is driven by what plants actually use, not by lux.',
    'The design also respects the day/night cycle that plants live by. Target temperatures, humidity and CO₂ differ between day and night, ventilation strategy changes, and supplemental lighting extends the photoperiod to a target daily light integral. The result is a controller that maintains a genuinely good growing environment with a handful of cheap actuators, and that logs everything so you can see what your greenhouse actually does over a season.',
  ],

  does: [
    'Measures air temperature, humidity, light (PAR), soil moisture and optionally CO₂.',
    'Controls heating, ventilation, misting/humidification and supplemental lighting.',
    'Coordinates actuators with awareness of their coupled effects, avoiding self-defeating loops.',
    'Applies separate day and night targets and manages the photoperiod.',
    'Drives supplemental lighting toward a target daily light integral.',
    'Logs all conditions and actuator states over the season.',
    'Alerts on out-of-range conditions that risk crop damage (frost, overheating, condensation).',
  ],

  features: [
    '<b>Coordinated multi-variable control</b> — priority-and-deadband, not four fighting loops.',
    '<b>Aspirated, shielded sensing</b> so the reading is the greenhouse air, not a hot box.',
    '<b>PAR-based lighting</b> driven by photosynthetically active radiation, not lux.',
    '<b>Daily light integral</b> tracking, the metric that actually governs plant growth.',
    '<b>Day/night regime</b> with separate targets and a managed photoperiod.',
    '<b>Vapour-pressure-deficit awareness</b>, the humidity metric that matters for transpiration and disease.',
    '<b>Frost, overheat and condensation protection</b> with priority overrides.',
    '<b>Full seasonal logging</b> and a dashboard for optimisation.',
  ],

  applications: [
    { t: 'Hobby and market-garden greenhouses', d: 'Stable conditions and extended seasons with cheap, coordinated automation.' },
    { t: 'Propagation and seedling raising', d: 'Tight environmental control is what germination and young plants need.' },
    { t: 'Research and controlled-environment growing', d: 'Repeatable conditions and full logging for experiments.' },
    { t: 'Polytunnels and high tunnels', d: 'Even passive structures benefit hugely from coordinated ventilation control.' },
    { t: 'Educational growing', d: 'A complete, legible example of coupled-system control with a living result.' },
    { t: 'Specialty crops', d: 'Orchids, carnivorous plants and others with specific, coupled environmental needs.' },
  ],

  skills: [
    'Arduino C++ with state machines and coordinated control',
    'Multi-sensor interfacing (I²C, analogue)',
    'Relay and PWM actuator control',
    'Understanding of VPD, DLI and the coupling between greenhouse variables',
    'MQTT and dashboarding',
  ],

  parts: ['esp32', 'sht31', 'bh1750', 'soil', 'relay4', 'oled', 'buck', 'psu12v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'Aspiration fan + radiation shield', spec: '40 mm 5 V fan drawing air past the SHT31 in a shield', qty: 1, price: 200, note: 'Without aspiration and shielding, the temperature reads the sun on the enclosure, not the air.' },
    { name: 'PAR sensor (or calibrated quantum sensor)', spec: 'Photosynthetic photon flux, or a calibrated BH1750 approximation', qty: 1, price: 900, note: 'A true PAR sensor is best; a BH1750 with a crop-specific lux-to-PAR factor is a budget approximation.' },
    { name: 'Greenhouse actuators', spec: '12 V vent opener/fan, heater relay, misting pump, grow-light relay', qty: 1, price: 2500, note: 'Actuator choice depends on greenhouse size; the controller logic is the same.' },
    { name: 'MH-Z19B CO₂ sensor (optional)', spec: 'NDIR, for CO₂ enrichment control', qty: 1, price: 2600 },
  ],
  cost: '₹4,600 – ₹8,500 depending on actuators',
  libs: ['wifi', 'pubsub', 'arduinojson', 'bme', 'unified', 'bh1750lib', 'ssd1306', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'SHT31 (aspirated)', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x44' },
      { dev: 'BH1750 / PAR sensor', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x23' },
      { dev: 'Soil moisture', devPin: 'AOUT', pin: 'GPIO 34', sig: 'Analogue' },
      { dev: 'MH-Z19B CO₂ (optional)', devPin: 'TX / RX', pin: 'GPIO 16 / 17', sig: 'UART' },
    ],
    right: [
      { dev: 'Relay 1 → vent/exhaust fan', devPin: 'IN1', pin: 'GPIO 25', sig: 'Ventilation' },
      { dev: 'Relay 2 → heater', devPin: 'IN2', pin: 'GPIO 26', sig: 'Heating' },
      { dev: 'Relay 3 → misting/humidifier', devPin: 'IN3', pin: 'GPIO 27', sig: 'Humidification' },
      { dev: 'Relay 4 → grow lights', devPin: 'IN4', pin: 'GPIO 14', sig: 'Supplemental lighting' },
    ],
  },
  wiringNotes: [
    'The temperature/humidity sensor <b>must be aspirated and shielded</b>. Mount it inside a small white radiation shield with a 40 mm fan drawing greenhouse air past it. An unshielded sensor in a greenhouse reads the sun on its own body — easily 10 °C high — and every control decision built on that is wrong.',
    'Place the sensor at plant-canopy height, in the middle of the greenhouse, away from the door, the heater and direct sun. Where you measure determines what you control.',
    'For lighting control, a true PAR (quantum) sensor is best. If using a BH1750, apply a crop-appropriate lux-to-PAR conversion — the factor differs between sunlight and grow-light spectra, so it is an approximation.',
    'The vent/fan, heater, mister and lights are on separate relays. Size the relays and wiring for the actual actuator loads, and apply all the mains-safety practices from the smart-plug project for any mains actuators.',
    'A misting pump near electronics is a real hazard — mount all electronics high and sealed, and route wiring so water cannot track back to it.',
    'Give the CO₂ sensor (if fitted) a stable 5 V and disable its automatic baseline correction — a greenhouse rarely reaches outdoor CO₂, so ABC would drag its baseline wrong, exactly as in the air-quality project.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'SHT31 aspirated', sub: 'T / RH / VPD' }, { name: 'PAR', sub: 'light' }, { name: 'Soil + CO₂', sub: 'root + air' }] },
      { label: 'Assess', edge: 'all variables', blocks: [{ name: 'Day/night regime', sub: 'targets' }, { name: 'Priority selector', sub: 'worst deviation', highlight: true }] },
      { label: 'Coordinate', edge: 'chosen fix', blocks: [{ name: 'Coupled-effect logic', sub: 'least disruption', highlight: true }, { name: 'Safety overrides', sub: 'frost/overheat' }] },
      { label: 'Act', edge: 'commands', blocks: [{ name: 'Vent / heat / mist', sub: 'climate' }, { name: 'Lights → DLI', sub: 'photoperiod' }] },
    ],
  },

  flow: [
    { t: 'Read all sensors, compute VPD and DLI', k: 'proc' },
    { t: 'Day or night regime? Select targets', k: 'proc' },
    { t: 'Safety: frost or overheat?', k: 'dec', yes: 'override, act immediately', no: 'normal', back: 0 },
    { t: 'Which variable is furthest out of band?', k: 'proc' },
    { t: 'Choose the actuator that fixes it with least side-effect', k: 'proc' },
    { t: 'Would it worsen another variable past its band?', k: 'dec', yes: 'pick alternative or compromise', no: 'apply', back: 3 },
    { t: 'Step the actuator, hold deadband', k: 'io' },
    { t: 'Manage lighting toward DLI target, log', k: 'end' },
  ],

  principle: [
    'The essential insight is that greenhouse variables are <b>coupled through the actuators</b>. Ventilation is the clearest example: opening a vent or running an exhaust fan lowers temperature, but it also lowers humidity (drier outside air comes in) and changes CO₂ (toward outdoor levels). Heating raises temperature and lowers relative humidity (warmer air holds more moisture, so the same absolute humidity is a lower relative humidity). Misting raises humidity but cools through evaporation. No actuator affects only one variable, so controlling them independently guarantees conflict.',
    'The right humidity metric is <b>vapour pressure deficit</b> (VPD), not relative humidity. VPD is the difference between how much moisture the air could hold at its temperature and how much it actually holds — it is what drives transpiration (and thus water and nutrient uptake) and what governs the risk of fungal disease. The same relative humidity means very different things at different temperatures; VPD captures the physiologically relevant quantity. A well-run greenhouse targets a VPD band (roughly 0.8–1.2 kPa for many crops), and because VPD depends on both temperature and humidity, controlling it inherently couples the two.',
    'The <b>control strategy</b> is priority-and-deadband coordination rather than parallel PID loops. Each variable has a target band with a deadband (a range within which no action is taken, preventing constant twitching). At each control step, the controller identifies the variable furthest outside its band, and chooses the actuator that best corrects it — but before acting, it checks whether that action would push another variable out of <em>its</em> band, and if so, either picks a different actuator or accepts a compromise. This mirrors how commercial greenhouse computers arbitrate between competing demands, and it is what produces stability instead of the oscillation that independent loops cause.',
    'Light control works to a <b>daily light integral</b> (DLI) target. DLI is the total amount of photosynthetically active light delivered over a day, measured in moles of photons per square metre — and it, not instantaneous light level, is what governs plant growth. The controller integrates the measured PAR through the day and, if the accumulated DLI is falling short of the crop\'s target as the natural light wanes, runs supplemental lighting to make up the deficit. This is far more efficient than running lights on a fixed schedule regardless of the sunlight already received.',
    'The <b>day/night regime</b> reflects plant physiology. Plants use a lower night temperature (the day-night temperature difference, "DIF", influences plant height and morphology), higher night humidity is tolerable, CO₂ enrichment only helps during light (photosynthesis needs light), and ventilation strategy differs. The controller switches target sets between day and night, using the light level (or a schedule) to determine which regime is active.',
    'Finally, <b>safety overrides</b> sit above the coordination logic. Frost that would kill the crop and overheating that would cook it are emergencies that bypass the polite arbitration — the heater comes full on against frost, the vents open fully against overheat — regardless of what that does to humidity. And condensation control matters because a greenhouse that lets its surfaces reach dew point invites fungal disease; the controller ventilates to keep the air VPD above the condensation threshold.',
  ],

  equations: [
    { t: 'Vapour pressure deficit (VPD)', eq: 'Saturation vapour pressure at temperature T (°C):\n  SVP = 0.6108 · exp(17.27·T / (T + 237.3))   kPa\n\nActual vapour pressure:\n  AVP = SVP · RH/100\n\nVPD = SVP − AVP = SVP · (1 − RH/100)\n\nExample: T = 24 °C, RH = 65 %\n  SVP = 0.6108 · exp(17.27·24/261.3) = 2.985 kPa\n  VPD = 2.985 · (1 − 0.65) = 1.04 kPa   (good range)\n\nSame RH at T = 30 °C gives VPD = 1.48 kPa (too dry) —\nwhich is why VPD, not RH, is the right target.' },
    { t: 'Daily light integral (DLI)', eq: 'PAR measured as photosynthetic photon flux density (PPFD),\nin µmol·m⁻²·s⁻¹.\n\nDLI = Σ PPFD · Δt / 1,000,000   mol·m⁻²·day⁻¹\n\nOver a day, sampling every minute (Δt = 60 s):\n  DLI = Σ (PPFD × 60) / 1e6\n\nCrop targets (mol·m⁻²·day⁻¹):\n  low-light (lettuce, herbs) : 12–17\n  medium (tomatoes)          : 20–30\n  high-light (peppers)       : 25–35\n\nIf accumulated DLI < target as sun wanes, run\nsupplemental lighting to close the gap.' },
    { t: 'Coordinated actuator selection', eq: 'For each variable v: error e_v = distance outside its band.\nPriority = variable with the largest e_v (weighted by\ncrop-criticality and by how fast damage accrues).\n\nFor the chosen actuator a, predict its effect on every\nvariable: Δv = effect_matrix[a][v].\n\nApply a only if it does not push any variable from\ninside its band to outside by more than a tolerance;\notherwise pick the next-best actuator or a partial step.\n\nSafety overrides (frost, overheat) skip this arbitration.' },
  ],

  code: [{
    file: 'greenhouse-controller.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Greenhouse Controller — ESP32

   Coordinates temperature, humidity (via VPD), light (via DLI) and
   ventilation, respecting how each actuator affects multiple
   variables. Priority-and-deadband arbitration, not four fighting
   PID loops.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <BH1750.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "greenhouse-1"

#define R_VENT   25
#define R_HEAT   26
#define R_MIST   27
#define R_LIGHT  14

/* Crop targets — set for your crop. */
#define T_DAY     24.0f
#define T_NIGHT   18.0f
#define VPD_LOW    0.8f
#define VPD_HIGH   1.2f
#define DLI_TARGET 22.0f          // mol/m2/day
#define T_FROST     4.0f          // emergency heat below this
#define T_OVERHEAT 35.0f          // emergency vent above this
#define DEADBAND    1.0f          // °C hysteresis

Adafruit_SHT31   sht = Adafruit_SHT31();
BH1750           lux;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

float tempC = 20, rh = 60, ppfd = 0, vpd = 0, dli = 0;
bool  isDay = true;
bool  ventOn = false, heatOn = false, mistOn = false, lightOn = false;
int   lastDay = -1;

/* ── derived quantities ─────────────────────────────────────── */
float computeVPD(float t, float relh) {
  float svp = 0.6108f * expf(17.27f * t / (t + 237.3f));
  return svp * (1.0f - relh / 100.0f);
}

float luxToPPFD(float luxVal) {
  // Approximate: sunlight ~0.0185 µmol/s per lux. Grow lights differ;
  // a true PAR sensor removes this uncertainty.
  return luxVal * 0.0185f;
}

/* ── actuators ──────────────────────────────────────────────── */
void set(int pin, bool &state, bool on) {
  if (state == on) return;
  state = on;
  digitalWrite(pin, on ? LOW : HIGH);          // active-low relays
}

/* ── coordinated control ────────────────────────────────────── */
void control() {
  float tTarget = isDay ? T_DAY : T_NIGHT;

  /* --- Safety overrides (bypass arbitration) --- */
  if (tempC < T_FROST) {
    set(R_HEAT, heatOn, true);
    set(R_VENT, ventOn, false);
    return;
  }
  if (tempC > T_OVERHEAT) {
    set(R_VENT, ventOn, true);
    set(R_HEAT, heatOn, false);
    set(R_MIST, mistOn, false);
    return;
  }

  /* --- Determine what is worst out of band --- */
  float tempErr = tempC - tTarget;             // + too hot, − too cold
  float vpdErr  = vpd < VPD_LOW  ? vpd - VPD_LOW
               : vpd > VPD_HIGH ? vpd - VPD_HIGH : 0;

  bool tempOut = fabsf(tempErr) > DEADBAND;
  bool vpdOut  = fabsf(vpdErr) > 0.1f;

  /* --- Temperature has priority (fast damage), with coupling awareness --- */
  if (tempOut && tempErr > 0) {
    // Too hot: ventilate. This also lowers humidity (raises VPD).
    // Only OK if VPD is not already too high.
    if (vpd < VPD_HIGH) { set(R_VENT, ventOn, true); set(R_HEAT, heatOn, false); }
    else {
      // Venting would over-dry. Mist while venting to hold VPD.
      set(R_VENT, ventOn, true); set(R_MIST, mistOn, true);
    }
    return;
  }
  if (tempOut && tempErr < 0) {
    // Too cold: heat. This lowers RH (raises VPD) — mist if that over-dries.
    set(R_HEAT, heatOn, true); set(R_VENT, ventOn, false);
    if (vpd > VPD_HIGH) set(R_MIST, mistOn, true); else set(R_MIST, mistOn, false);
    return;
  }

  /* --- Temperature in band: address VPD without disturbing temp much --- */
  if (vpdOut && vpdErr > 0) {
    // Too dry: mist (small cooling — acceptable inside the temp deadband).
    set(R_MIST, mistOn, true); set(R_VENT, ventOn, false);
  } else if (vpdOut && vpdErr < 0) {
    // Too humid (condensation/disease risk): ventilate gently.
    set(R_MIST, mistOn, false); set(R_VENT, ventOn, true);
  } else {
    set(R_MIST, mistOn, false);
    if (tempErr < DEADBAND * 0.5f) set(R_VENT, ventOn, false);
  }
}

/* ── lighting toward DLI ────────────────────────────────────── */
void lightControl(int hour) {
  // Supplement only when natural light is low AND we are behind on DLI.
  bool photoperiod = hour >= 6 && hour < 22;   // 16 h max
  bool behind = dli < DLI_TARGET * (hour - 6) / 16.0f;   // pro-rata target
  set(R_LIGHT, lightOn, photoperiod && ppfd < 200 && behind);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  int relays[] = { R_VENT, R_HEAT, R_MIST, R_LIGHT };
  for (int p : relays) { pinMode(p, OUTPUT); digitalWrite(p, HIGH); }
  analogSetPinAttenuation(34, ADC_11db);

  Wire.begin(21, 22);
  sht.begin(0x44);
  sht.setSampling ? 0 : 0;                       // (SHT31 has no forced mode API here)
  lux.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("gh", false);
  dli = prefs.getFloat("dli", 0);
  lastDay = prefs.getInt("day", -1);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);
  Serial.println("Greenhouse controller running");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect(DEVICE_ID);
  mqtt.loop();

  static uint32_t last = 0;
  if (millis() - last < 5000) return;           // control every 5 s
  last = millis();

  tempC = sht.readTemperature();
  rh    = sht.readHumidity();
  float luxVal = lux.readLightLevel();
  ppfd  = luxToPPFD(luxVal);
  vpd   = computeVPD(tempC, rh);
  isDay = ppfd > 50;

  // Accumulate DLI (5 s interval).
  dli += ppfd * 5.0f / 1e6f;

  time_t now = time(nullptr); struct tm tmv; localtime_r(&now, &tmv);
  if (tmv.tm_yday != lastDay) {                 // new day: reset DLI
    lastDay = tmv.tm_yday;
    prefs.putInt("day", lastDay);
    Serial.printf("DLI yesterday: %.1f mol/m2\\n", dli);
    dli = 0;
  }
  prefs.putFloat("dli", dli);

  control();
  lightControl(tmv.tm_hour);

  oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(1);
  oled.setCursor(0, 0);  oled.printf("%.1fC  %.0f%%RH  %s", tempC, rh, isDay ? "day" : "night");
  oled.setCursor(0, 12); oled.printf("VPD %.2f kPa", vpd);
  oled.setCursor(0, 22); oled.printf("PPFD %.0f  DLI %.1f/%.0f", ppfd, dli, DLI_TARGET);
  oled.setCursor(0, 36); oled.printf("vent%s heat%s mist%s light%s",
    ventOn?"*":"-", heatOn?"*":"-", mistOn?"*":"-", lightOn?"*":"-");
  oled.display();

  JsonDocument d;
  d["temp"]=tempC; d["rh"]=rh; d["vpd"]=vpd; d["ppfd"]=ppfd; d["dli"]=dli;
  d["vent"]=ventOn; d["heat"]=heatOn; d["mist"]=mistOn; d["light"]=lightOn;
  char b[192]; size_t n = serializeJson(d, b, sizeof(b));
  mqtt.publish("farm/" DEVICE_ID "/state", (uint8_t*)b, n, true);
}`,
    explain: [
      { ref: 'Safety overrides first, bypassing arbitration', txt: 'Frost and overheat are emergencies. The heater comes full on against frost and the vents open fully against overheat, regardless of what that does to humidity. Fast crop damage takes priority over polite coordination.' },
      { ref: 'Coupling-aware venting', txt: 'When venting to cool, the controller checks whether that would push VPD too high (over-dry the air). If so, it runs the mister simultaneously to hold humidity while venting. This is the whole point — an actuator is chosen with awareness of its side effects, not in isolation.' },
      { ref: 'Temperature priority within the deadband', txt: 'Temperature is addressed first because plants are damaged faster by temperature extremes than by humidity ones. Only once temperature is inside its deadband does the controller act on VPD, and then it prefers actions that do not disturb temperature much.' },
      { ref: 'computeVPD()', txt: 'The controller targets vapour pressure deficit, not relative humidity, because VPD is what governs transpiration and disease risk. The same RH means very different things at different temperatures, so controlling RH directly would be controlling the wrong quantity.' },
      { ref: 'lightControl() pro-rata DLI', txt: 'Supplemental lighting runs only when natural light is low AND the accumulated daily light integral is behind its pro-rata target for the time of day. This is far more efficient than a fixed schedule — on a sunny day the lights barely run; on a dull one they make up the deficit.' },
      { ref: 'DEADBAND prevents twitching', txt: 'The one-degree deadband means the controller does not toggle actuators for tiny fluctuations. Without it, a greenhouse controller cycles its relays constantly, wearing them out and destabilising the environment.' },
      { ref: 'isDay from PPFD, not just a clock', txt: 'The day/night regime switches on actual light level, so a dull day or an early dusk correctly triggers night targets. Using light rather than only a schedule makes the regime track reality.' },
    ],
  }],

  config: [
    'Set the crop targets: <code>T_DAY</code>, <code>T_NIGHT</code>, the VPD band and <code>DLI_TARGET</code>. These are crop-specific — look up your crop\'s requirements rather than using generic values.',
    'Aspirate and shield the temperature/humidity sensor. This is the single most important setup step — an unshielded greenhouse sensor is useless.',
    'Calibrate the lux-to-PAR factor for your light sources, or fit a true PAR sensor. Grow-light spectra differ from sunlight, so one factor is an approximation.',
    'Set the safety thresholds (<code>T_FROST</code>, <code>T_OVERHEAT</code>) conservatively for your crop — these prevent catastrophic loss and should trigger well before real damage.',
    'Tune the deadband so actuators do not cycle rapidly. Larger greenhouses have more thermal mass and tolerate larger deadbands.',
  ],

  calibration: [
    { h: 'Verify sensor placement and aspiration', p: ['Compare the aspirated sensor against a reference thermometer in shade. They should agree closely. Then check the sensor in sun without aspiration — the difference (often 5–10 °C) shows why aspiration is essential.'] },
    { h: 'Calibrate PAR', p: ['If using a BH1750, compare against a borrowed quantum sensor under both sunlight and your grow lights, and derive separate conversion factors. If using a true PAR sensor, verify its calibration is current.'] },
    { h: 'Map the actuator effects', p: ['Run each actuator alone and log how it changes temperature, humidity and VPD over ten minutes. This gives you the real coupling for your greenhouse, which you can use to tune the coordination logic.'] },
    { h: 'Tune the deadbands over a day', p: ['Watch the actuator states over a full day. If any actuator cycles more than a few times an hour, widen its deadband. Stable conditions with infrequent switching is the goal.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Greenhouse controller', sub: 'ESP32' }, { name: 'Outdoor weather', sub: 'optional' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'or LoRa for remote',
      uplink: 'MQTT 1883', cloud: 'Local broker + Grafana', cloudSub: 'seasonal logging',
      clients: [{ name: 'Grafana', sub: 'season trends' }, { name: 'Phone alerts', sub: 'frost/overheat' }],
    },
    dashboard: [
      'The most useful panel overlays temperature, VPD and actuator states over a day. You can see the coordination working — venting bringing temperature down, misting holding VPD as it does — and spot any fighting between actuators that needs tuning.',
      'A seasonal DLI chart against target shows whether your supplemental lighting strategy is actually delivering the light the crop needs, which correlates directly with yield.',
    ],
    security: [
      'Use broker authentication — an open control topic lets anyone open your vents on a frosty night.',
      'Keep frost and overheat protection local and independent of the network; a greenhouse can be killed in an hour by a failed connection during a cold snap.',
      'Alert on communication loss so you know if the controller has gone silent.',
    ],
  },

  testing: [
    { step: 'Compare the aspirated sensor to a reference in sun', expect: 'Close agreement, unlike an unshielded sensor which reads far too high — confirming aspiration works.' },
    { step: 'Raise the temperature above target', expect: 'The vent opens; if VPD is already high, the mister runs alongside it — coordination, not just venting.' },
    { step: 'Lower the temperature below target', expect: 'The heater runs; if that over-dries the air, the mister supports VPD.' },
    { step: 'Drop humidity so VPD exceeds the band, temperature in range', expect: 'The mister runs without the heater or vent fighting it.' },
    { step: 'Simulate frost (cool the sensor below T_FROST)', expect: 'The heater goes full on immediately, bypassing normal arbitration.' },
    { step: 'Simulate overheat', expect: 'The vents open fully immediately, the heater and mister off.' },
    { step: 'Cover the light sensor during the day', expect: 'The grow lights come on only if the DLI is behind its pro-rata target — not automatically.' },
    { step: 'Watch actuator states over a day', expect: 'Stable conditions with infrequent switching and no oscillation between actuators.' },
  ],

  troubleshoot: [
    {
      sym: 'Temperature reads far too high',
      cause: 'Sensor not aspirated or shielded — reading the sun on its own body.',
      fix: 'This is the most common and most damaging error. Fit a radiation shield and an aspiration fan drawing greenhouse air past the sensor. An unshielded sensor in a greenhouse is worse than useless because every decision built on it is wrong.',
    },
    {
      sym: 'Actuators fight each other (vent and heater cycling)',
      cause: 'Independent control logic, or deadbands too tight.',
      fix: 'Ensure the coordination logic is checking coupled effects — venting to cool should not trigger the heater. Widen the deadbands. The whole design goal is to prevent this; if it happens, the arbitration is being bypassed somewhere.',
    },
    {
      sym: 'Humidity control never settles',
      cause: 'Controlling RH instead of VPD, or fighting the temperature loop.',
      fix: 'Target VPD, not RH — RH changes with temperature even at constant moisture, so an RH loop chases the temperature loop. Address VPD only once temperature is in its band, with actions that do not disturb temperature.',
    },
    {
      sym: 'Grow lights run all day even in sun',
      cause: 'Lighting on a fixed schedule rather than a DLI target.',
      fix: 'Drive lighting from the daily light integral: only supplement when natural PAR is low and the accumulated DLI is behind its pro-rata target. This is both more efficient and better for the plants than a fixed schedule.',
    },
    {
      sym: 'The greenhouse froze despite the controller',
      cause: 'Network dependency, or the heater actuator failed.',
      fix: 'Frost protection must be entirely local and must not depend on the network. Verify the heater relay and actuator work, add a temperature alarm to your phone, and consider a mechanical thermostat as an independent backup for the frost case — a lost crop is expensive.',
    },
  ],

  perf: [
    'Control on a slow cadence (5–30 s). Greenhouse thermal dynamics are minutes-scale; faster control just cycles actuators.',
    'Use deadbands generously — greenhouses have thermal mass and tolerate wide bands, and infrequent switching extends relay and actuator life.',
    'Persist the DLI accumulator so a reboot mid-day does not lose the day\'s light record and wrongly run the lights.',
  ],

  safety: [
    'Frost and overheat protection must be local, independent of any network, and reliable — a crop can be lost in an hour, and a network outage during a cold snap must not be able to cause that.',
    'Apply all mains-safety practices from the smart-plug project for any mains-powered actuators (heaters, fans, pumps). A greenhouse is a wet environment, which makes mains safety more critical, not less.',
    'Keep all electronics high and sealed against misting and condensation. Water tracking back to a mains actuator in a greenhouse is a serious hazard.',
    'Fit an independent mechanical or thermal backup for the frost case if the crop is valuable — belt and braces.',
    'Do not enrich CO₂ to levels that are unsafe for people entering the greenhouse; interlock enrichment with occupancy if used.',
  ],

  future: [
    'Add <b>predictive control</b> using a weather forecast — pre-heat before a forecast frost, pre-ventilate before a hot afternoon, rather than only reacting.',
    'Add <b>CO₂ enrichment control</b> that only enriches during light and at a level the crop can use, coordinated with ventilation (venting wastes enrichment).',
    'Add <b>irrigation integration</b> (the drip irrigation project) so the root zone is managed together with the aerial environment.',
    'Add <b>multiple zones</b> for greenhouses with different crops or a propagation area needing different conditions.',
    'Add a <b>disease-risk model</b> from leaf wetness and VPD history, alerting when conditions favour fungal disease.',
  ],

  faq: [
    { q: 'Why VPD instead of relative humidity?', a: 'Because VPD is what plants actually respond to and RH is not. Vapour pressure deficit is the difference between how much moisture the air can hold and how much it does — it drives transpiration (and thus water and nutrient uptake) and governs fungal disease risk. The same 70 % RH means a comfortable VPD at 20 °C and an over-dry one at 30 °C. Controlling RH directly controls the wrong quantity; controlling VPD controls the physiologically relevant one.' },
    { q: 'Why not just use four separate thermostats?', a: 'Because the greenhouse variables are coupled through the actuators, and four independent loops fight each other. Venting to cool also dries the air, so the humidity loop responds, which cools further, so the heating loop responds. The result is constant oscillation and unstable conditions. Coordinated control — deciding which variable is worst and choosing an actuator with awareness of its side effects — is what commercial greenhouse computers do and what produces stable conditions.' },
    { q: 'What is DLI and why does it matter more than light level?', a: 'Daily light integral is the total amount of photosynthetically useful light delivered over a whole day, in moles of photons per square metre. Plant growth depends on the total light received, not the instantaneous level — a plant does the same photosynthesis whether it gets moderate light all day or intense light for half of it, as long as the total is the same. Driving supplemental lighting to a DLI target is efficient (you only add what the day fell short by) and matches what the plant actually needs.' },
    { q: 'How important is the aspirated sensor really?', a: 'It is the difference between a working controller and a broken one. A temperature sensor sitting in a greenhouse in sunlight absorbs radiation and reads its own hot body — easily 5–10 °C above the actual air temperature. Every control decision built on that reading is wrong: the controller vents when it should not, and the plants cook while the display says everything is fine. Aspirating and shielding the sensor so it reads the moving air is non-negotiable.' },
    { q: 'Can this handle a large commercial greenhouse?', a: 'The control logic scales, but the actuators and the sensing do not directly — a large greenhouse needs multiple sensor points (conditions vary across a big space), multiple actuator zones, and much larger ventilation and heating. The coordination principle is exactly what commercial greenhouse computers use, so the approach is sound; the implementation would grow into a multi-zone, multi-sensor system, which is a natural extension.' },
    { q: 'What happens if the Wi-Fi drops?', a: 'Everything keeps running — control, safety overrides and lighting are all local. The network only adds remote monitoring and alerting. This is deliberate and essential: frost protection especially must never depend on a connection, because a cold snap during an outage could kill the crop. For a valuable crop, an independent mechanical frost backup is worth adding on top.' },
  ],

  refs: [
    { t: 'Runkle, "Daily Light Integral: A Useful Concept for Greenhouse Lighting"', u: 'https://www.canr.msu.edu/floriculture/uploads/files/dli%20greenhouse.pdf', s: 'Michigan State University Extension' },
    { t: 'Prenger & Ling, "Greenhouse Condensation Control" and VPD management', u: 'https://ohioline.osu.edu/factsheet/aex-800', s: 'Ohio State University Extension' },
    { t: 'SHT31 humidity and temperature sensor — datasheet', u: 'https://sensirion.com/media/documents/213E6A3B/63A5A569/Datasheet_SHT3x_DIS.pdf', s: 'Sensirion' },
    { t: 'FAO, "Good Agricultural Practices for greenhouse vegetable production"', u: 'https://www.fao.org/3/i3284e/i3284e.pdf', s: 'FAO' },
    { t: 'Körner & Challa, "Process-based humidity control regime for a greenhouse"', u: 'https://doi.org/10.1016/S0168-1699(03)00006-1', s: 'Computers and Electronics in Agriculture, 2003' },
    { t: 'Vapour pressure deficit — background and calculation', u: 'https://en.wikipedia.org/wiki/Vapour-pressure_deficit', s: 'Wikipedia' },
  ],

  images: ['greenhouse', 'sensor', 'grafana'],
  imageCaptions: [
    'The interior of a greenhouse. Coordinated control of temperature, humidity, light and ventilation keeps conditions stable across the whole space.',
    'A sensor module. In a greenhouse the temperature/humidity sensor must be aspirated and shielded, or it reads the sun rather than the air.',
    'A dashboard. Overlaying conditions and actuator states over a day reveals whether the coordination is working or the actuators are fighting.',
  ],
},

/* ── 028 · Soil NPK Sensor Node ──────────────────────────────────── */
{
  id: '028',
  domainKey: 'iot',
  emoji: '🧪',
  thumb: 'farm',
  difficulty: 'Intermediate',
  hours: '10–16 hours',
  iso8601: 'PT13H',
  tagline: 'A soil node that reads nitrogen, phosphorus and potassium over industrial Modbus, alongside pH, moisture and temperature — with a frank account of what these low-cost NPK probes actually measure.',

  overview: [
    'Fertiliser is one of the largest costs and largest environmental impacts in agriculture, and most of it is applied by guesswork. Knowing the nutrient status of the soil lets you apply what the crop actually needs, where it needs it — the principle of precision agriculture. This node reads soil nitrogen, phosphorus and potassium, along with pH, moisture, temperature and conductivity, and reports them for site-specific nutrient management.',
    'It is essential to be honest about what the low-cost NPK sensors on the market measure. A laboratory soil test extracts nutrients chemically and measures them precisely. These field probes are <b>capacitive/conductivity sensors with a calibration model</b> that estimates NPK from the soil\'s electrical properties. They are useful for detecting <em>relative</em> nutrient status and <em>changes</em> over time and space, but their absolute accuracy is limited and soil-dependent. Treated as a relative, comparative instrument they are genuinely useful; treated as a lab test they will mislead. This documentation makes that distinction central.',
    'The sensor communicates over <b>RS-485 Modbus-RTU</b>, the industrial standard for rugged field instruments. This is a deliberately different communication layer from the consumer I²C and analogue sensors elsewhere in the catalogue, and learning it is valuable: RS-485 runs reliably over hundreds of metres of cheap twisted pair, tolerates electrical noise, and lets many sensors share one bus — exactly what a field of soil nodes needs.',
    'The node is built for the field: rugged, low-power for solar operation, and reporting over a long-range link (LoRa) because farmland rarely has Wi-Fi. It maps nutrient status across a field so fertiliser can be varied by zone rather than applied uniformly — which is where the cost and environmental savings come from.',
  ],

  does: [
    'Reads soil nitrogen, phosphorus, potassium, pH, moisture, temperature and conductivity over RS-485 Modbus.',
    'Reports readings honestly as relative/comparative values, not laboratory measurements.',
    'Communicates over LoRa for long range without field Wi-Fi.',
    'Runs on solar power with deep-sleep duty cycling between readings.',
    'Maps nutrient variation across a field when multiple nodes are deployed.',
    'Flags large deviations that warrant a confirmatory laboratory test.',
    'Logs readings over the season for trend analysis.',
  ],

  features: [
    '<b>RS-485 Modbus-RTU</b> — the industrial standard, rugged over long cable runs and shared buses.',
    '<b>Seven soil parameters</b> from one probe: N, P, K, pH, moisture, temperature, EC.',
    '<b>Honest framing</b> — relative and comparative use, with lab confirmation for absolute decisions.',
    '<b>LoRa long-range reporting</b> for fields without connectivity.',
    '<b>Solar-powered, deep-sleep operation</b> for unattended seasonal deployment.',
    '<b>Multi-node field mapping</b> to guide variable-rate application.',
    '<b>Temperature and moisture compensation</b>, since both strongly affect the readings.',
    '<b>Deviation flagging</b> that prompts a lab test when a reading is surprising.',
  ],

  applications: [
    { t: 'Precision fertiliser management', d: 'Applying nutrients by zone based on relative status, cutting cost and runoff.' },
    { t: 'Field nutrient mapping', d: 'Building a spatial picture of variation across a field over a season.' },
    { t: 'Soil health monitoring', d: 'Tracking how nutrient status and pH change under a management practice.' },
    { t: 'Fertigation control', d: 'Feeding nutrient status into an automated fertigation system.' },
    { t: 'Research and demonstration plots', d: 'Comparing treatments with dense, continuous sensing between lab tests.' },
    { t: 'Learning industrial protocols', d: 'RS-485 and Modbus are the backbone of industrial and agricultural instrumentation.' },
  ],

  skills: [
    'Arduino C++ with Modbus-RTU',
    'RS-485 wiring and bus termination',
    'LoRa communication',
    'Solar power and deep-sleep design',
    'A clear understanding of what field NPK probes actually measure',
  ],

  parts: ['esp32', 'rs485', 'lora', 'solarpanel', 'mppt', 'li18650', 'perfboard', 'enclosure'],
  extraParts: [
    { name: '7-in-1 soil NPK/pH/EC/moisture/temp sensor', spec: 'RS-485 Modbus, stainless probe', qty: 1, price: 3200, note: 'These are conductivity-model sensors — relative accuracy, not laboratory precision. Buy accordingly.' },
    { name: '12 V supply for the sensor', spec: 'Most industrial soil probes need 5–24 V, often 12 V', qty: 1, price: 200, note: 'Boost from the battery or a separate solar rail.' },
    { name: '120 Ω termination resistors', spec: 'For the RS-485 bus ends', qty: 2, price: 20 },
    { name: 'IP67 enclosure + cable glands', spec: 'For unattended field deployment', qty: 1, price: 320 },
  ],
  cost: '₹5,400 – ₹6,800',
  libs: ['modbus', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'MAX485 (to sensor)', devPin: 'RO / DI', pin: 'GPIO 16 / 17', sig: 'UART to RS-485' },
      { dev: 'MAX485 DE/RE', devPin: 'DE+RE', pin: 'GPIO 4', sig: 'Transmit/receive control' },
      { dev: 'Battery/solar voltage', devPin: 'divider', pin: 'GPIO 34', sig: 'Power monitoring' },
    ],
    right: [
      { dev: 'SX1278 LoRa', devPin: 'SPI + DIO0', pin: 'GPIO 5 18 19 23 / 26', sig: 'Long-range uplink' },
      { dev: 'Sensor power gate', devPin: 'MOSFET', pin: 'GPIO 25', sig: 'Powers the 12 V sensor only during a read' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Brief flash on read' },
    ],
  },
  wiringNotes: [
    'The RS-485 A and B lines connect the MAX485 transceiver to the soil sensor. Twist the pair, and fit 120 Ω termination resistors at both ends of the bus — an unterminated RS-485 bus reflects signals and produces read errors, especially over long cable.',
    'The DE/RE pin controls transmit versus receive on the MAX485. It must be driven high before sending a Modbus request and low to receive the response; getting this timing wrong is the classic RS-485 bug.',
    'Most industrial soil probes need <b>12 V or more</b> and draw significant current during a reading. Gate the sensor\'s 12 V supply through a MOSFET so it is only powered during a read — leaving it on drains a solar system quickly.',
    'The probe must be inserted to its full sensing depth in firm contact with soil. Air gaps around the probe corrupt all the readings, especially conductivity-derived ones.',
    'For solar operation, size the panel and battery for the sensor\'s read current plus the LoRa transmit bursts, with margin for cloudy days — the sensor is the largest load.',
    'Seal everything to IP67. This lives in a field, in the weather, for a season.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: '7-in-1 probe', sub: 'N P K pH EC moisture T' }, { name: 'MAX485', sub: 'RS-485' }] },
      { label: 'Read', edge: 'Modbus', blocks: [{ name: 'ESP32', sub: 'Modbus master', highlight: true }, { name: 'Compensate', sub: 'temp + moisture' }] },
      { label: 'Interpret', edge: 'raw values', blocks: [{ name: 'Relative status', sub: 'not lab values', highlight: true }, { name: 'Deviation flag', sub: 'lab-test prompt' }] },
      { label: 'Report', edge: 'reading', blocks: [{ name: 'LoRa uplink', sub: 'long range' }, { name: 'Field map', sub: 'multi-node' }] },
    ],
  },

  flow: [
    { t: 'Deep sleep (solar, hours between reads)', k: 'start' },
    { t: 'Wake: power the sensor, wait to stabilise', k: 'proc' },
    { t: 'Read all parameters over Modbus', k: 'io' },
    { t: 'Read valid?', k: 'dec', yes: 'yes', no: 'retry, then flag', back: 2 },
    { t: 'Apply temperature/moisture compensation', k: 'proc' },
    { t: 'Deviation from expected range?', k: 'dec', yes: 'flag for lab test', no: 'normal', back: 4 },
    { t: 'Power off sensor, transmit over LoRa', k: 'io' },
    { t: 'Deep sleep until the next read', k: 'end' },
  ],

  principle: [
    'The first thing to understand is <b>what these sensors actually do</b>, because it determines how their output should be used. A laboratory soil test physically extracts nutrients with chemical reagents and measures the extracted amount — this is the reference method. A field NPK probe does something quite different: it measures the soil\'s electrical properties (capacitance and conductivity) and applies a calibration model to <em>estimate</em> nitrogen, phosphorus and potassium. The relationship between electrical properties and actual nutrient content is real but loose, soil-type dependent, and affected by moisture, temperature and salinity. So the probe reports an estimate with modest absolute accuracy, not a measurement.',
    'This does not make them useless — it makes them a <b>relative, comparative instrument</b>. If two locations in a field read differently, that difference is meaningful even if neither absolute value is precise. If a location\'s reading changes over a season, that change is meaningful. What the probe supports well is detecting spatial variation (which part of the field is nutrient-poor) and temporal change (is the status improving under a treatment). What it does not support is a precise "your soil has X kg/ha of nitrogen" claim on which to base an exact fertiliser dose — that needs a lab test. Using the probe for the former and confirming with a lab test for the latter is the correct workflow, and the node\'s deviation flagging exists to prompt exactly that confirmation.',
    '<b>RS-485 with Modbus-RTU</b> is the communication layer, and it is worth understanding because it is the industrial standard. RS-485 is a differential signalling scheme: data is sent as the voltage difference between two wires (A and B), so noise that affects both wires equally cancels out. This is why it runs reliably over hundreds of metres of cheap twisted pair in electrically noisy environments where a single-ended signal (like plain UART) would fail. It is half-duplex — the same pair carries data both ways — so a control line (DE/RE) switches the transceiver between transmit and receive. Modbus-RTU is the protocol on top: a simple master-slave scheme where the master (the ESP32) sends a request naming a slave address and register, and the slave responds. Many sensors can share one bus at different addresses.',
    'The readings need <b>compensation</b> because the same soil reads differently under different conditions. Conductivity (and the NPK estimates derived from it) rises with temperature and with moisture — wet soil conducts better than dry, warm better than cold. A reading taken after rain differs from one taken in drought even with identical nutrient content. The node reads temperature and moisture alongside NPK and applies compensation, and — as importantly — timestamps readings so you compare like conditions.',
    'The node is designed for <b>unattended field deployment</b>: solar-powered, deep-sleeping for hours between readings (soil nutrients change over days and weeks, not minutes), and reporting over LoRa because farmland has no Wi-Fi. LoRa trades data rate for range and power — it sends small packets tens of kilometres, on a coin-cell-scale energy budget, which is exactly the profile of an infrequent soil reading from a remote field.',
    'Deployed as a <b>network</b> across a field, the nodes build a nutrient map. Because the probes are good at relative comparison, a map of readings reveals the field\'s variation even if absolute values are approximate — and that map is what enables <b>variable-rate application</b>: instead of spreading fertiliser uniformly, apply more where the map shows deficiency and less where it shows sufficiency. This is where precision agriculture saves money and reduces the runoff that pollutes waterways.',
  ],

  equations: [
    { t: 'Modbus-RTU frame and CRC', eq: 'Master request (read holding registers):\n  [addr][0x03][reg_hi][reg_lo][count_hi][count_lo][crc_lo][crc_hi]\n\nSlave response:\n  [addr][0x03][bytecount][data...][crc_lo][crc_hi]\n\nCRC-16 (Modbus):\n  crc = 0xFFFF\n  for each byte: crc ^= byte\n    for 8 bits: if crc & 1: crc = (crc>>1) ^ 0xA001\n                else:       crc >>= 1\n\nDE/RE high to send, low to receive, with a short\nturnaround delay so the last byte fully transmits.' },
    { t: 'Temperature/moisture compensation', eq: 'Conductivity-derived readings rise with T and moisture:\n\n  EC_25 = EC_measured / (1 + 0.02·(T − 25))\n\n(2 %/°C is a common soil EC temperature coefficient.)\n\nMoisture affects the NPK estimate strongly — the probes\nare calibrated at a reference moisture. Readings taken\nfar from that moisture are less reliable; note the\nmoisture with every reading and compare like with like.\n\nThe honest approach: report readings WITH their\ntemperature and moisture, and compare readings taken\nunder similar conditions.' },
    { t: 'Variable-rate application from a field map', eq: 'For each zone z with relative nutrient index R_z (from the map):\n\n  application_z = base_rate · (target − R_z) / target,  clamped ≥ 0\n\nA deficient zone (low R_z) gets more; a sufficient zone\ngets less or none.\n\nSavings vs uniform application ≈\n  1 − (Σ application_z) / (n_zones · base_rate)\n\nTypically 10–30 % fertiliser reduction with maintained\nyield — the economic case for the whole system. But\nCALIBRATE the map against lab tests before setting rates.' },
  ],

  code: [{
    file: 'soil-npk-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Soil NPK Sensor Node — ESP32 + RS-485 Modbus + LoRa

   Reads a 7-in-1 soil probe (N, P, K, pH, EC, moisture, temperature)
   over Modbus-RTU, applies temperature compensation, and reports over
   LoRa. Solar-powered with deep-sleep duty cycling.

   These probes give RELATIVE nutrient status, not lab measurements.
   Use for mapping and trends; confirm absolute values with a lab test.
   ══════════════════════════════════════════════════════════════════ */

#include <ModbusMaster.h>
#include <LoRa.h>
#include <SPI.h>
#include <esp_sleep.h>
#include <math.h>

#define RS485_RX 16
#define RS485_TX 17
#define RS485_DE  4
#define SENSOR_PWR 25
#define LORA_CS   5
#define LORA_RST 14
#define LORA_DIO0 26
#define PIN_BATT 34

#define SENSOR_ADDR 0x01
#define SLEEP_HOURS  6
#define NODE_ID      1

ModbusMaster sensor;

struct Soil {
  float moisture, tempC, ec, ph, n, p, k;
  bool  ok;
};

/* ── RS-485 direction control ───────────────────────────────── */
void preTx()  { digitalWrite(RS485_DE, HIGH); }
void postTx() { digitalWrite(RS485_DE, LOW);  }

Soil readSensor() {
  Soil s = {};
  digitalWrite(SENSOR_PWR, HIGH);
  delay(2000);                         // industrial probes need warm-up

  Serial2.begin(4800, SERIAL_8N1, RS485_RX, RS485_TX);
  sensor.begin(SENSOR_ADDR, Serial2);
  sensor.preTransmission(preTx);
  sensor.postTransmission(postTx);

  // Register map varies by sensor; this is a common layout.
  // Registers: 0x00 moisture, 0x01 temp, 0x02 EC, 0x03 pH,
  //            0x04 N, 0x05 P, 0x06 K.
  uint8_t rc = sensor.readHoldingRegisters(0x0000, 7);
  digitalWrite(SENSOR_PWR, LOW);       // power off immediately after

  if (rc != sensor.ku8MBSuccess) { s.ok = false; return s; }

  s.moisture = sensor.getResponseBuffer(0) / 10.0f;    // %
  s.tempC    = (int16_t)sensor.getResponseBuffer(1) / 10.0f;
  s.ec       = sensor.getResponseBuffer(2);            // µS/cm
  s.ph       = sensor.getResponseBuffer(3) / 10.0f;
  s.n        = sensor.getResponseBuffer(4);            // mg/kg (estimate!)
  s.p        = sensor.getResponseBuffer(5);
  s.k        = sensor.getResponseBuffer(6);
  s.ok = true;

  // Temperature-compensate EC to 25 °C (2 %/°C).
  s.ec = s.ec / (1.0f + 0.02f * (s.tempC - 25.0f));
  return s;
}

/* ── plausibility / deviation flag ──────────────────────────── */
bool plausible(const Soil &s) {
  return s.moisture >= 0 && s.moisture <= 100 &&
         s.ph >= 3 && s.ph <= 10 &&
         s.n >= 0 && s.n <= 2000 && s.p >= 0 && s.p <= 2000 && s.k >= 0 && s.k <= 2000;
}

/* ── LoRa uplink ────────────────────────────────────────────── */
float batteryVolts() {
  uint32_t acc = 0;
  for (int i = 0; i < 8; i++) acc += analogRead(PIN_BATT);
  return (acc / 8.0f / 4095.0f) * 3.3f * 2.0f * 1.05f;
}

void transmit(const Soil &s, bool deviation) {
  LoRa.beginPacket();
  LoRa.printf("{\\"node\\":%d,\\"m\\":%.1f,\\"t\\":%.1f,\\"ec\\":%.0f,\\"ph\\":%.1f,"
              "\\"n\\":%.0f,\\"p\\":%.0f,\\"k\\":%.0f,\\"batt\\":%.2f,\\"flag\\":%d}",
              NODE_ID, s.moisture, s.tempC, s.ec, s.ph, s.n, s.p, s.k,
              batteryVolts(), deviation ? 1 : 0);
  LoRa.endPacket();
}

/* ── setup runs once per wake ───────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(RS485_DE, OUTPUT); digitalWrite(RS485_DE, LOW);
  pinMode(SENSOR_PWR, OUTPUT); digitalWrite(SENSOR_PWR, LOW);
  analogSetPinAttenuation(PIN_BATT, ADC_11db);

  SPI.begin();
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(433E6)) { Serial.println("LoRa failed"); }
  LoRa.setSpreadingFactor(10);         // range vs airtime trade-off
  LoRa.setTxPower(20);

  Soil s = readSensor();
  if (!s.ok) {
    s = readSensor();                  // one retry
  }

  bool deviation = false;
  if (s.ok && plausible(s)) {
    // Flag a reading that is far from a stored running expectation —
    // a prompt to take a confirmatory laboratory sample.
    // (A fuller version stores per-node history; here a simple range check.)
    deviation = (s.ph < 5.5 || s.ph > 7.5 || s.n > 500 || s.k > 500);
    transmit(s, deviation);
    Serial.printf("moisture %.1f%% T %.1f EC %.0f pH %.1f N %.0f P %.0f K %.0f%s\\n",
                  s.moisture, s.tempC, s.ec, s.ph, s.n, s.p, s.k,
                  deviation ? "  [FLAG: confirm with lab]" : "");
  } else {
    Serial.println("Read failed or implausible — sensor or contact fault");
  }

  LoRa.sleep();
  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_HOURS * 3600ULL * 1000000ULL);
  Serial.flush();
  esp_deep_sleep_start();
}

void loop() { /* never reached */ }`,
    explain: [
      { ref: 'preTx / postTx direction control', txt: 'RS-485 is half-duplex on one wire pair, so the DE/RE line must go high to transmit a request and low to receive the response. The ModbusMaster library calls these callbacks around each transaction — getting this direction timing wrong is the single most common RS-485 bug.' },
      { ref: 'Serial2 at 4800 baud', txt: 'Industrial soil probes typically default to 4800 or 9600 baud — much slower than consumer sensors, chosen for reliability over long cable. The exact baud, address and register map vary by sensor and must be read from its documentation.' },
      { ref: 'delay(2000) sensor warm-up', txt: 'Powering the probe only during a read saves solar energy, but industrial probes need a couple of seconds to stabilise after power-up before their readings are valid. Reading too soon gives a wrong value.' },
      { ref: 'EC temperature compensation', txt: 'Conductivity rises about 2 % per degree, so the raw EC (and the NPK estimates derived from conductivity) depends on soil temperature. Normalising to 25 °C makes readings comparable across a warm afternoon and a cool morning.' },
      { ref: 'N, P, K commented as (estimate!)', txt: 'The code itself flags that the nutrient values are estimates from a conductivity model, not measurements. This honesty is deliberate and central: the readings are for relative comparison and mapping, and the deviation flag prompts a lab test for absolute decisions.' },
      { ref: 'deviation flag → confirm with lab', txt: 'When a reading is surprising (extreme pH, very high nutrient estimate), the node flags it. The flag does not mean the reading is wrong — it means it is worth confirming with the reference method (a lab test) before acting on it. This is the correct workflow for a relative instrument.' },
      { ref: 'Everything in setup(), then deep sleep', txt: 'Soil nutrients change over days and weeks, so the node reads once every few hours and deep-sleeps between — the standard solar-field-node pattern that makes unattended seasonal operation possible.' },
    ],
  }],

  config: [
    'Read your specific sensor\'s Modbus documentation — the slave address, baud rate and register map all vary between manufacturers. The register layout in the code is a common one, not universal.',
    'Fit 120 Ω termination at both ends of the RS-485 bus, especially for long cable runs. Reflections on an unterminated bus cause intermittent read failures.',
    'Set the deep-sleep interval to match how fast your soil changes — hours to daily is appropriate; soil nutrients do not change by the minute.',
    'Set the LoRa frequency to your region\'s licence-free band (433 MHz shown; 868/915 MHz elsewhere) and respect the duty-cycle limits.',
    'Establish a per-node expected range from early readings so the deviation flag is meaningful, and pair the system with occasional lab tests to anchor the relative readings.',
  ],

  calibration: [
    { h: 'Anchor against a lab test', p: ['Take a soil sample from beside the probe and send it for a laboratory NPK and pH analysis. Compare with the probe reading. This does not calibrate the probe to lab accuracy, but it tells you the offset and lets you interpret the probe\'s relative readings against a known point.'] },
    { h: 'Check the probe contact', p: ['Insert the probe fully into firm, moist soil with no air gaps. Read, then reinsert nearby and read again — consistent readings mean good contact; scatter means air gaps or variable insertion depth are corrupting the readings.'] },
    { h: 'Verify Modbus communication', p: ['Confirm you get valid responses with correct CRC. A common failure is the DE/RE timing — if reads fail intermittently, check the direction control and bus termination first.'] },
    { h: 'Map the temperature effect', p: ['Read the same soil at different temperatures (morning and afternoon). The change shows the temperature sensitivity and validates your compensation. Uncompensated EC can shift 20 %+ across a day.'] },
  ],

  iot: {
    protoShort: 'LoRa + Modbus',
    net: {
      nodes: [{ name: 'Soil node ×N', sub: 'across the field' }],
      protocol: 'RS-485 (to sensor)', gateway: 'LoRa gateway', gatewaySub: 'at the farm',
      uplink: 'LoRa 433/868 MHz', cloud: 'LoRa → MQTT bridge', cloudSub: 'field map',
      clients: [{ name: 'Field map dashboard', sub: 'variable-rate' }, { name: 'Lab-test prompts', sub: 'confirmation' }],
    },
    protocol: [
      'Two protocols in one node, each right for its job. RS-485 Modbus connects to the sensor — rugged, short-to-medium range, wired. LoRa carries the reading back to the farm — long range, wireless, low power. The node bridges the industrial sensor bus to the long-range radio.',
      'LoRa\'s spreading factor trades data rate for range and airtime. A higher spreading factor reaches further and penetrates obstacles better but takes longer to transmit (and uses more airtime, which is duty-cycle limited). For infrequent small soil readings, a high spreading factor is the right choice.',
    ],
    topics: [
      { t: 'LoRa → gateway → farm/soil/node-N', dir: 'node → gateway → broker', payload: 'JSON: moisture, temp, EC, pH, N, P, K, batt, flag' },
    ],
    dashboard: [
      'The key output is a spatial field map: node readings plotted on the field geometry, interpolated between nodes, showing where nutrients are high and low. This map, calibrated against lab tests, drives variable-rate fertiliser application — the economic and environmental payoff of the whole system.',
    ],
    security: [
      'Field telemetry is generally low-sensitivity, but authenticate the LoRa uplink so readings cannot be spoofed into driving wrong fertiliser rates.',
      'Keep the lab-test anchoring in the workflow — a system that acts on uncalibrated relative readings can misapply fertiliser expensively.',
    ],
  },

  testing: [
    { step: 'Read the sensor over Modbus', expect: 'Valid responses with correct CRC for all seven parameters.' },
    { step: 'Insert in known-moist vs dry soil', expect: 'The moisture reading tracks the difference; NPK estimates shift too, illustrating the moisture dependence.' },
    { step: 'Read at two temperatures', expect: 'Raw EC shifts with temperature; compensated EC is stable — confirming the compensation.' },
    { step: 'Compare against a lab test', expect: 'The probe and lab agree in direction and rough magnitude; absolute values differ, confirming the relative-instrument framing.' },
    { step: 'Test the deviation flag', expect: 'An extreme reading (very high nutrient estimate or out-of-range pH) sets the flag prompting a lab confirmation.' },
    { step: 'Transmit over LoRa and receive at the gateway', expect: 'The packet arrives with the full reading; range meets your field size at the chosen spreading factor.' },
    { step: 'Measure solar/battery over a few days', expect: 'The battery holds through cloudy days with the sensor gated off between reads.' },
    { step: 'Deploy multiple nodes and build a map', expect: 'Spatial variation is visible and consistent with known field differences.' },
  ],

  troubleshoot: [
    {
      sym: 'Modbus reads fail intermittently',
      cause: 'DE/RE timing, missing bus termination, or noise on long cable.',
      fix: 'Verify DE/RE goes high before transmit and low before receive, with a short turnaround delay. Fit 120 Ω termination at both bus ends. Use twisted pair and keep the cable away from power lines. These are the classic RS-485 issues.',
    },
    {
      sym: 'NPK values seem implausible or vary wildly',
      cause: 'Poor probe contact, moisture variation, or expecting lab accuracy.',
      fix: 'Ensure full, firm probe insertion with no air gaps. Remember these are conductivity-model estimates, not measurements — they are moisture- and soil-dependent. Use them for relative comparison and trends, note the moisture with each reading, and anchor against a lab test.',
    },
    {
      sym: 'Readings differ from a lab test by a lot',
      cause: 'Expected — the probe estimates from electrical properties.',
      fix: 'This is not a fault. Field NPK probes have limited absolute accuracy that is soil-dependent. The correct use is relative comparison across the field and over time. Anchor with periodic lab tests and interpret the probe readings relative to those anchors.',
    },
    {
      sym: 'LoRa packets not received',
      cause: 'Frequency mismatch, obstruction, or spreading factor too low for the range.',
      fix: 'Confirm node and gateway are on the same frequency and spreading factor. Raise the spreading factor for more range at the cost of airtime. Elevate the gateway antenna — LoRa range depends heavily on line of sight.',
    },
    {
      sym: 'Battery drains despite solar',
      cause: 'Sensor left powered, or the panel undersized for the sensor load.',
      fix: 'Gate the sensor\'s 12 V supply so it is only on during a read. The industrial probe is the largest load by far. Size the panel and battery for the read current plus LoRa transmit, with margin for cloudy days.',
    },
  ],

  perf: [
    'Power the sensor only during a read (2–3 s including warm-up) and deep-sleep between — the probe is the dominant load and gating it is what makes solar operation viable.',
    'Read every few hours, not continuously. Soil nutrients change over days; frequent reads waste energy and add no information.',
    'Choose the LoRa spreading factor for your actual range need — higher than necessary wastes airtime and energy.',
  ],

  safety: [
    'Interpret these sensors honestly: they estimate nutrient status from electrical properties and are relative instruments, not laboratory tests. Do not base an exact fertiliser dose on an uncalibrated probe reading — over- or under-application is both costly and environmentally harmful.',
    'Anchor the system with periodic laboratory soil tests, especially before making significant fertiliser decisions.',
    'Follow safe practice around any high-voltage field wiring and around fertiliser and agrochemicals themselves.',
    'Respect the LoRa duty-cycle and power limits for your region\'s licence-free band.',
  ],

  future: [
    'Add <b>per-node history and machine-learning calibration</b> that improves the relative-to-absolute mapping using accumulated lab-test anchors.',
    'Add <b>variable-rate application integration</b> that feeds the field map directly to a fertiliser spreader\'s controller.',
    'Add <b>more nodes and interpolation</b> for a denser, more accurate field map.',
    'Add <b>weather and irrigation context</b> so readings are interpreted alongside rainfall and irrigation events that affect them.',
    'Add a <b>proper lab-comparison study</b> for your soil type to characterise the probe\'s accuracy honestly and set expectations.',
  ],

  faq: [
    { q: 'Are these NPK sensors accurate?', a: 'Not in the way a laboratory test is. They estimate nitrogen, phosphorus and potassium from the soil\'s electrical properties using a calibration model, and the relationship is loose and soil-dependent. Their absolute accuracy is limited. What they are good at is relative comparison — telling you that one part of a field differs from another, or that a location is changing over time. Used for mapping and trends they are genuinely useful; used as a substitute for a lab test they will mislead.' },
    { q: 'So why use them at all?', a: 'Because relative, spatial and temporal information is valuable and a lab test cannot provide it continuously. You cannot afford a lab test for every square metre every week, but you can deploy probes to reveal where a field varies and how it changes, and then use a few lab tests to anchor the map. That combination — dense relative sensing plus sparse absolute anchoring — is how precision agriculture actually works, and it can cut fertiliser use 10–30 % with maintained yield.' },
    { q: 'Why RS-485 and Modbus instead of I²C?', a: 'Range and robustness. I²C works over a few tens of centimetres in a clean environment; a field soil sensor might be a hundred metres from the controller in an electrically noisy setting. RS-485 uses differential signalling that rejects common-mode noise and runs reliably over hundreds of metres of cheap twisted pair, and Modbus is the simple, universal industrial protocol on top of it. It is the right tool for rugged field instrumentation, and learning it opens up the whole world of industrial sensors.' },
    { q: 'Why LoRa instead of Wi-Fi?', a: 'Farmland rarely has Wi-Fi coverage, and even where it does, the range is inadequate for a field. LoRa sends small packets many kilometres on very little power — perfect for an infrequent soil reading from a remote node. It trades data rate (which you do not need for a few numbers every few hours) for range and battery life (which you need a great deal of).' },
    { q: 'How often should I read the soil?', a: 'Every few hours to daily is plenty. Soil nutrient status changes over days and weeks — after fertilising, after rain, as the crop takes up nutrients — not over minutes. Reading frequently wastes solar energy and adds no information. The value is in the trend over the season and the spatial pattern across the field, both of which are well captured by infrequent readings.' },
    { q: 'Can I skip the lab tests?', a: 'You can, but then you are flying blind on absolute values. The probes give you relative information reliably, but without at least occasional lab anchoring you do not know what the relative numbers mean in real terms, and you risk misapplying fertiliser based on a reading that is systematically off for your soil. A few lab tests per season to anchor the probe map is a small cost that makes the whole system trustworthy.' },
  ],

  refs: [
    { t: 'Modbus Application Protocol Specification V1.1b3', u: 'https://www.modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf', s: 'Modbus Organization' },
    { t: 'TIA/EIA-485-A — RS-485 differential signalling standard', u: 'https://www.ti.com/lit/an/slla070d/slla070d.pdf', s: 'TI application note' },
    { t: 'Adamchuk et al., "On-the-go soil sensors for precision agriculture"', u: 'https://doi.org/10.1016/j.compag.2004.03.002', s: 'Computers and Electronics in Agriculture, 2004' },
    { t: 'Kim et al., "Evaluation of on-the-go soil nitrate sensors — accuracy and limitations"', u: 'https://doi.org/10.13031/2013.20268', s: 'Transactions of the ASABE' },
    { t: 'LoRa and LoRaWAN — regional parameters and spreading factors', u: 'https://lora-alliance.org/resource_hub/rp2-1-0-3-lorawan-regional-parameters/', s: 'LoRa Alliance' },
    { t: 'USDA NRCS — Soil Testing and interpretation', u: 'https://www.nrcs.usda.gov/resources/education-and-teaching-materials/soil-testing', s: 'USDA NRCS' },
  ],

  images: ['farm', 'sensor', 'esp32'],
  imageCaptions: [
    'A field with crops. Precision nutrient management applies fertiliser by zone based on relative status, cutting cost and runoff.',
    'A sensor probe. Field NPK sensors estimate nutrients from soil electrical properties — relative instruments, not laboratory tests.',
    'An ESP32 development board bridging an industrial RS-485 sensor bus to a long-range LoRa uplink.',
  ],
},

/* ── 029 · Automated Drip Irrigation ─────────────────────────────── */
{
  id: '029',
  domainKey: 'iot',
  emoji: '💧',
  thumb: 'farm',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'A zone-based drip system that waters by crop stage and real evapotranspiration demand, verifies delivery with a flow meter, and catches the burst pipes and blocked emitters that silently waste water or kill crops.',

  overview: [
    'Drip irrigation is the most water-efficient way to water crops — it delivers water slowly to the root zone, minimising evaporation and runoff. But an automated drip system that runs on a fixed schedule wastes much of that advantage: it waters the same amount whether it is a cool damp week or a hot dry one, and it has no idea whether the water it commanded actually reached the plants. This project addresses both — it waters to real demand and it verifies delivery.',
    'The demand side uses <b>evapotranspiration</b> (ET), the combined water loss from soil evaporation and plant transpiration. ET is what a crop actually consumes, and it is driven by weather — temperature, humidity, solar radiation and wind. By estimating ET from local sensors (or a weather feed) and multiplying by a crop coefficient that reflects the crop\'s stage of growth, the system computes how much water the crop needs, and replaces that. This is how professional irrigation scheduling works, and it typically saves 20–40 % of water over fixed scheduling while improving yield.',
    'The verification side uses a <b>flow meter</b>. This is the feature that separates a real system from a hopeful one: the controller measures the water actually delivered, not just the time the valve was open. From the flow it detects the failures that silently ruin drip systems — a <b>burst pipe or fitting</b> (flow far higher than expected), a <b>blocked emitter or filter</b> (flow far lower), and a valve that failed to open or close. Without flow measurement, a burst main can run for days and a blocked line can starve a crop, both undetected until the damage is done.',
    'The system manages <b>multiple zones</b> independently — different crops, different growth stages, different soil, each with its own schedule and ET-based demand — sequenced so the water supply is not overloaded. It is built for the field: solar-capable, weather-aware, and reporting so you can see water use and catch faults remotely.',
  ],

  does: [
    'Waters multiple zones independently based on evapotranspiration demand and crop stage.',
    'Measures actual water delivered per zone with a flow meter.',
    'Detects burst pipes, blocked emitters and valve failures from the flow signal.',
    'Adjusts watering to real ET demand rather than a fixed schedule.',
    'Sequences zones so the water supply is not overloaded.',
    'Respects rain — skips or reduces watering after rainfall.',
    'Logs water use per zone and alerts on faults.',
  ],

  features: [
    '<b>ET-based scheduling</b> — waters to real crop demand, saving 20–40 % over fixed schedules.',
    '<b>Crop-coefficient staging</b> so demand tracks the crop through its growth cycle.',
    '<b>Flow verification</b> — measures delivered water, the difference between a real and a hopeful system.',
    '<b>Fault detection</b>: burst (high flow), blockage (low flow), valve failure (no flow).',
    '<b>Multi-zone sequencing</b> that respects supply capacity.',
    '<b>Rain skip</b> from a rain sensor or weather feed.',
    '<b>Per-zone water logging</b> for efficiency tracking and compliance.',
    '<b>Fail-safe valves</b> that close on power loss, so a fault cannot flood.',
  ],

  applications: [
    { t: 'Efficient crop irrigation', d: 'ET-based watering with delivery verification — the core precision-irrigation case.' },
    { t: 'Orchards and vineyards', d: 'Multiple zones with different demands, where burst detection prevents large losses.' },
    { t: 'Market gardens', d: 'Diverse crops at different stages, each zone scheduled to its own demand.' },
    { t: 'Landscape and turf', d: 'Water-restriction compliance with logged, demand-based use.' },
    { t: 'Water-scarce regions', d: 'Where the 20–40 % saving is not just economic but essential.' },
    { t: 'Research plots', d: 'Precise, logged, per-zone water delivery for experiments.' },
  ],

  skills: [
    'Arduino C++ with state machines and scheduling',
    'Flow-meter pulse counting with interrupts',
    'Valve and pump control',
    'Evapotranspiration estimation',
    'Fault detection from sensor signals',
  ],

  parts: ['esp32', 'waterflow', 'solenoid', 'sht31', 'bh1750', 'relay4', 'oled', 'buck', 'psu12v', 'perfboard', 'enclosure'],
  qty: { solenoid: 4, waterflow: 1 },
  extraParts: [
    { name: 'Drip irrigation kit', spec: 'Tubing, emitters, filter, pressure regulator per zone', qty: 1, price: 1200, note: 'A pressure regulator and filter per zone are essential — drip emitters clog and are pressure-sensitive.' },
    { name: 'Rain sensor', spec: 'Tipping-bucket or simple rain board', qty: 1, price: 350 },
    { name: 'Manifold + fittings', spec: 'For the multi-zone valve manifold', qty: 1, price: 400 },
    { name: 'MOSFET/relay drivers + flyback diodes', spec: 'For the solenoid valves', qty: 1, price: 80 },
  ],
  cost: '₹3,800 – ₹5,200',
  libs: ['wifi', 'pubsub', 'arduinojson', 'bme', 'unified', 'bh1750lib', 'ssd1306', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'YF-S201 flow meter', devPin: 'Pulse', pin: 'GPIO 27', sig: 'Open-collector pulse, interrupt' },
      { dev: 'SHT31 weather', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C, for ET estimate' },
      { dev: 'BH1750 solar radiation', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, for ET' },
      { dev: 'Rain sensor', devPin: 'OUT', pin: 'GPIO 32', sig: 'Rain skip' },
    ],
    right: [
      { dev: 'Zone 1–4 valves', devPin: 'IN1–IN4', pin: 'GPIO 25 26 14 12', sig: 'Solenoid valves, fail-closed' },
      { dev: 'Master pump/valve', devPin: 'Relay', pin: 'GPIO 33', sig: 'Supply' },
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C' },
    ],
  },
  wiringNotes: [
    'The flow meter outputs an open-collector pulse train — one pulse per fixed volume of water. Wire it to an interrupt-capable pin with a pull-up, and count pulses in the ISR. The pulses-per-litre (K-factor) is specified for the meter but changes with orientation and flow rate, so calibrate it.',
    'The solenoid valves must be <b>normally-closed and fail-closed</b> — losing power closes them. This means a power failure or a crashed controller cannot leave a valve open flooding a zone. Wire and choose valves accordingly.',
    'Each zone needs a <b>pressure regulator and filter</b> ahead of the drip line. Drip emitters are pressure-sensitive (too much pressure and they blow off or over-deliver) and clog easily (a filter is essential). These are irrigation-plumbing requirements, not electronics.',
    'Fit flyback diodes across the solenoid coils — they are inductive and will damage the drivers without them.',
    'Place the flow meter after the master valve but where it sees the flow to all zones (or one per zone for per-zone flow, which is better for fault localisation). Install it in the correct orientation per the arrow.',
    'For the ET estimate, place the weather sensors representatively — the temperature/humidity sensor shaded and aspirated, the light sensor unshaded. Or use a weather feed instead of local sensors.',
  ],

  block: {
    columns: [
      { label: 'Demand', blocks: [{ name: 'Weather sensors', sub: 'ET inputs' }, { name: 'Crop stage', sub: 'coefficient' }, { name: 'Rain sensor', sub: 'skip' }] },
      { label: 'Schedule', edge: 'ET + stage', blocks: [{ name: 'Water needed', sub: 'per zone', highlight: true }, { name: 'Sequence zones', sub: 'supply limit' }] },
      { label: 'Deliver', edge: 'zone + volume', blocks: [{ name: 'Open valve', sub: 'fail-closed' }, { name: 'Flow meter', sub: 'verify delivery', highlight: true }] },
      { label: 'Verify', edge: 'flow vs expected', blocks: [{ name: 'Fault detect', sub: 'burst/block/no-flow', highlight: true }, { name: 'Log + alert', sub: 'water use' }] },
    ],
  },

  flow: [
    { t: 'Read weather, compute ET, check rain', k: 'proc' },
    { t: 'Rained recently?', k: 'dec', yes: 'reduce/skip', no: 'proceed', back: 0 },
    { t: 'Compute water needed per zone (ET × Kc)', k: 'proc' },
    { t: 'For each zone in sequence: open valve', k: 'io' },
    { t: 'Flow within expected range?', k: 'dec', yes: 'continue', no: 'burst/block — alarm, close', back: 3 },
    { t: 'Delivered volume reached?', k: 'dec', yes: 'close valve', no: 'keep watering', back: 3 },
    { t: 'Next zone or done', k: 'proc' },
    { t: 'Log water use, publish', k: 'end' },
  ],

  principle: [
    '<b>Evapotranspiration</b> is the foundation of demand-based irrigation. It is the total water a crop loses — evaporation from the soil surface plus transpiration through the plant — and it is what the crop must have replaced. ET is driven by weather: it rises with temperature, solar radiation and wind, and falls with humidity. The reference ET (ET₀) is the water use of a standard reference crop under the current weather, computed from those variables. The FAO Penman-Monteith equation is the standard method; a simpler approximation (like Hargreaves, which needs only temperature) is adequate for many field uses. The controller estimates ET₀ from its weather sensors.',
    'The <b>crop coefficient</b> (Kc) converts reference ET into the actual crop\'s water need: <code>ETc = ET₀ × Kc</code>. Kc reflects the crop and its growth stage — a young seedling with little leaf area transpires little (Kc around 0.3–0.5), a mature crop at full canopy transpires most (Kc up to 1.1–1.2), and a senescing crop declines again. By tracking the crop stage and applying the right Kc, the system waters a seedling less and a mature crop more, matching real demand through the season. This staging is what a fixed schedule cannot do.',
    'The water to apply replaces the crop\'s consumption since the last watering, accounting for what came from rain. This is why <b>rain skip</b> matters — rain contributes to the crop\'s water and must be subtracted from the irrigation demand, or the system over-waters. A simple system skips watering after significant rain; a better one measures the rain and subtracts it from the deficit.',
    'The <b>flow verification</b> is the engineering heart of the project, and it is what most drip controllers lack. A flow meter counts pulses proportional to water volume, so the controller knows the actual delivered volume, not just the valve-open time. This enables three critical detections. A <b>burst</b> (a split pipe or blown fitting) shows as flow much higher than expected for the zone — the water is escaping, not reaching the plants, and left running it wastes enormous volumes and can wash out a field. A <b>blockage</b> (a clogged filter or emitters) shows as flow much lower than expected — the crop is being starved. A <b>valve failure</b> shows as no flow when a zone should be watering (valve stuck closed) or flow when none is commanded (valve stuck open). Detecting these promptly is the difference between a minor fix and a ruined crop or a flooded field.',
    'The system is <b>fail-safe by construction</b>. The valves are normally-closed, so any power loss or controller crash closes them — a fault can never leave a zone flooding. On detecting a burst, the controller closes the affected zone and alarms rather than continuing. And a hard maximum runtime per zone bounds the damage from any undetected fault.',
    '<b>Multi-zone sequencing</b> respects the water supply. A drip system\'s pump or supply main has a finite flow capacity, and running all zones at once may exceed it, dropping the pressure below what the emitters need. The controller waters zones in sequence, each for its computed volume, so the supply is never overloaded and each zone gets the pressure its emitters are designed for.',
  ],

  equations: [
    { t: 'Reference ET (Hargreaves approximation)', eq: 'ET0 = 0.0023 · Ra · (Tmean + 17.8) · sqrt(Tmax − Tmin)\n\n  Ra   = extraterrestrial radiation (from latitude & day)\n  Tmean, Tmax, Tmin = daily temperatures (°C)\n\nExample: Tmean 26, Tmax 33, Tmin 19, Ra ~40 MJ/m²/day:\n  ET0 = 0.0023 · 40 · 43.8 · sqrt(14)\n      = 0.0023 · 40 · 43.8 · 3.74 = 15.1 mm... (×0.408 to mm)\n      ≈ 6.2 mm/day\n\nCrop ET:  ETc = ET0 · Kc\n  seedling Kc 0.4 → 2.5 mm/day\n  mature   Kc 1.1 → 6.8 mm/day' },
    { t: 'Water volume and flow verification', eq: 'Water to apply (litres) for a zone of area A (m²):\n  V = ETc (mm) · A · 1 L/m²/mm − effective_rainfall\n\nFlow meter: pulses per litre = K (calibrate!)\n  delivered_L = pulse_count / K\n\nExpected flow rate for the zone: Q_expected (L/min)\n  burst:    Q_measured > 1.5 · Q_expected\n  blockage: Q_measured < 0.5 · Q_expected\n  no-flow:  Q_measured ≈ 0 when valve commanded open\n\nStop and alarm on any of these; do not keep watering\ninto a fault.' },
    { t: 'Multi-zone sequencing', eq: 'Supply capacity: Q_supply (L/min)\nEach zone needs Q_zone at its design pressure.\n\nIf Σ Q_zone > Q_supply, water zones SEQUENTIALLY:\n  total_time = Σ (V_zone / Q_zone)\n\nA zone gets its full design pressure (emitters uniform)\nrather than a shared, sagging pressure. Sequence during\nthe low-ET early morning to minimise evaporation and\navoid peak supply demand.' },
  ],

  code: [{
    file: 'drip-irrigation.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Automated Drip Irrigation — ESP32, ET-based, flow-verified

   Waters multiple zones to evapotranspiration demand, VERIFIES
   delivery with a flow meter, and detects bursts, blockages and
   valve failures. Fail-closed valves.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <BH1750.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "irrigation-field"

#define PIN_FLOW 27
#define PIN_RAIN 32
#define N_ZONES   4
#define FLOW_K   450.0f          // pulses per litre — CALIBRATE

const uint8_t ZONE_PIN[N_ZONES] = { 25, 26, 14, 12 };

struct Zone {
  float areaM2;          // zone area
  float kc;              // crop coefficient (updated by stage)
  float qExpected;       // expected flow L/min at design pressure
  float lToday;          // water delivered today
} zones[N_ZONES] = {
  { 50, 0.8f, 4.0f, 0 }, { 40, 1.1f, 3.5f, 0 },
  { 30, 0.4f, 2.5f, 0 }, { 60, 0.9f, 5.0f, 0 }
};

Adafruit_SHT31   sht = Adafruit_SHT31();
BH1750           lux;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

volatile uint32_t flowPulses = 0;
float tMin = 99, tMax = -99, tMean = 25;
bool  rainedRecently = false;
int   lastDay = -1;

void IRAM_ATTR flowISR() { flowPulses++; }

/* ── ET estimate (simplified Hargreaves) ────────────────────── */
float referenceET() {
  // Ra approximated as a constant for the site; a full implementation
  // computes it from latitude and day of year.
  const float Ra = 40.0f;                          // MJ/m2/day, site value
  float et = 0.0023f * Ra * (tMean + 17.8f) * sqrtf(fmaxf(0.1f, tMax - tMin));
  return et * 0.408f;                              // → mm/day
}

/* ── watering with flow verification ────────────────────────── */
enum Result { OK_DONE, BURST, BLOCKAGE, NO_FLOW };

Result waterZone(int z, float litres) {
  flowPulses = 0;
  digitalWrite(ZONE_PIN[z], LOW);                  // open (active-low)
  uint32_t start = millis(), lastCheck = millis();
  uint32_t lastPulses = 0;
  const uint32_t MAX_RUN_MS = 30UL * 60UL * 1000UL;   // hard runtime cap

  while ((flowPulses / FLOW_K) < litres) {
    delay(500);
    uint32_t now = millis();

    if (now - start > MAX_RUN_MS) {                // safety timeout
      digitalWrite(ZONE_PIN[z], HIGH);
      return BLOCKAGE;                             // too slow to finish
    }

    if (now - lastCheck >= 5000) {                 // check flow every 5 s
      float qNow = (flowPulses - lastPulses) / FLOW_K / (5.0f / 60.0f);  // L/min
      lastPulses = flowPulses; lastCheck = now;

      if (qNow > 1.5f * zones[z].qExpected) {       // BURST
        digitalWrite(ZONE_PIN[z], HIGH);
        return BURST;
      }
      if (millis() - start > 15000 && qNow < 0.1f) { // NO FLOW after 15 s
        digitalWrite(ZONE_PIN[z], HIGH);
        return NO_FLOW;                            // valve stuck closed
      }
      if (millis() - start > 15000 && qNow < 0.5f * zones[z].qExpected) {
        digitalWrite(ZONE_PIN[z], HIGH);
        return BLOCKAGE;                           // clogged filter/emitters
      }
    }
  }
  digitalWrite(ZONE_PIN[z], HIGH);                 // close
  zones[z].lToday += flowPulses / FLOW_K;
  return OK_DONE;
}

void alert(int z, Result r) {
  const char *msg = r == BURST ? "burst" : r == BLOCKAGE ? "blockage" : "valve-failure";
  JsonDocument d; d["zone"] = z; d["fault"] = msg;
  char b[96]; size_t n = serializeJson(d, b, sizeof(b));
  mqtt.publish("farm/" DEVICE_ID "/fault", (uint8_t *)b, n, true);
  Serial.printf("ZONE %d FAULT: %s — stopped and alarmed\\n", z, msg);
}

/* ── daily irrigation cycle ─────────────────────────────────── */
void runIrrigation() {
  if (rainedRecently) { Serial.println("Rain skip"); return; }

  float et0 = referenceET();
  Serial.printf("ET0 %.1f mm/day\\n", et0);

  for (int z = 0; z < N_ZONES; z++) {
    float etc = et0 * zones[z].kc;                 // mm/day for this crop
    float litres = etc * zones[z].areaM2;          // 1 L per m2 per mm
    if (litres < 1) continue;

    Serial.printf("Zone %d: %.1f L needed\\n", z, litres);
    Result r = waterZone(z, litres);
    if (r != OK_DONE) alert(z, r);
    delay(2000);                                   // pause between zones
  }
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_FLOW, INPUT_PULLUP);
  pinMode(PIN_RAIN, INPUT_PULLUP);
  attachInterrupt(PIN_FLOW, flowISR, FALLING);
  for (int z = 0; z < N_ZONES; z++) { pinMode(ZONE_PIN[z], OUTPUT); digitalWrite(ZONE_PIN[z], HIGH); }

  Wire.begin(21, 22);
  sht.begin(0x44);
  lux.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  prefs.begin("irrig", false);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);
  Serial.println("Drip irrigation controller running");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) mqtt.connect(DEVICE_ID);
  mqtt.loop();

  // Track daily min/max temperature for the ET estimate.
  float t = sht.readTemperature();
  if (!isnan(t)) { tMean = t; tMin = fminf(tMin, t); tMax = fmaxf(tMax, t); }
  rainedRecently = digitalRead(PIN_RAIN) == LOW;

  time_t now = time(nullptr); struct tm tmv; localtime_r(&now, &tmv);

  // Water once a day in the early morning (low ET, full supply pressure).
  static int lastWaterDay = -1;
  if (tmv.tm_hour == 5 && tmv.tm_yday != lastWaterDay) {
    lastWaterDay = tmv.tm_yday;
    runIrrigation();
    // Reset daily accumulators and temperature extremes.
    for (int z = 0; z < N_ZONES; z++) zones[z].lToday = 0;
    tMin = 99; tMax = -99;
  }

  static uint32_t lastDisplay = 0;
  if (millis() - lastDisplay > 2000) {
    lastDisplay = millis();
    oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE); oled.setTextSize(1);
    oled.setCursor(0, 0); oled.printf("ET0 %.1f mm  %s", referenceET(), rainedRecently ? "RAIN" : "");
    for (int z = 0; z < N_ZONES; z++) {
      oled.setCursor(0, 14 + z * 10);
      oled.printf("Z%d Kc%.1f  %.0fL today", z + 1, zones[z].kc, zones[z].lToday);
    }
    oled.display();
  }

  delay(1000);
}`,
    explain: [
      { ref: 'waterZone() returns a Result', txt: 'The core design decision: watering is verified, not fire-and-forget. The function waters until the measured delivered volume reaches the target, and returns whether it succeeded or hit a burst, blockage or valve failure — detected from the actual flow, not the valve-open time.' },
      { ref: 'Flow checked every 5 s during watering', txt: 'The controller continuously compares measured flow against the zone\'s expected flow. Flow far too high is a burst (water escaping); far too low is a blockage (crop starving); zero when the valve is open is a valve failure. Each is stopped immediately rather than watering into a fault.' },
      { ref: 'MAX_RUN_MS hard cap', txt: 'Even if the flow detection somehow misses a fault, a zone can never run longer than 30 minutes. This bounds the water wasted or the flooding caused by any undetected failure — a last line of defence.' },
      { ref: 'Fail-closed valves (HIGH = closed)', txt: 'The valves are normally-closed and driven closed by default, so a power loss or crash closes every valve. A fault can never leave a zone flooding — the system fails safe by construction.' },
      { ref: 'referenceET() Hargreaves', txt: 'ET is estimated from temperature (the Hargreaves method needs only temperature and radiation), giving the reference crop water use. Multiplying by the crop coefficient gives the actual crop demand — so watering tracks real weather and crop stage, not a fixed schedule.' },
      { ref: 'ETc × areaM2 = litres', txt: 'One millimetre of ET over one square metre is one litre of water, so the volume to apply is the crop ET in millimetres times the zone area. This directly converts the demand estimate into a litres target for the flow meter to verify.' },
      { ref: 'Water at 05:00, once a day', txt: 'Early-morning watering minimises evaporation loss (low ET, cool) and gets full supply pressure (no competing demand). Watering once a day to the accumulated demand, in sequence, is efficient and gentle on the supply.' },
    ],
  }],

  config: [
    'Calibrate the flow meter K-factor (pulses per litre) by running a known volume — the datasheet value is approximate and changes with orientation and flow rate.',
    'Set each zone\'s area, crop coefficient and expected flow. Update the crop coefficient as the crop advances through its growth stages — this is what makes the watering track demand.',
    'Set the ET method\'s site parameters (latitude for the radiation term) or feed ET from a weather service instead of local sensors.',
    'Configure the rain-skip threshold and duration to your climate — how much rain, for how long, should reduce or skip watering.',
    'Set the per-zone burst/blockage thresholds (multiples of expected flow) and the hard runtime cap conservatively — false fault alarms are annoying but a missed burst is expensive.',
  ],

  calibration: [
    { h: 'Calibrate the flow meter', p: ['Run water through a zone into a measured container for a fixed pulse count, and compute litres per pulse. Repeat at the flow rate you actually use — the K-factor varies with flow. This calibration sets the accuracy of both the water volume and the fault detection.'] },
    { h: 'Measure each zone\'s expected flow', p: ['Run each zone normally and record its steady flow rate. This is the baseline against which bursts and blockages are detected, so it must reflect the healthy system.'] },
    { h: 'Validate the ET estimate', p: ['Compare your ET₀ estimate against a reference (a local weather station\'s ET or an online ET calculator) over a week. The Hargreaves approximation is adequate but check it is in the right range for your site.'] },
    { h: 'Test fault detection', p: ['Deliberately induce a fault — disconnect a line (burst-like high flow or no flow), or partly block a filter (low flow) — and confirm the controller detects it, stops, and alarms. Verify the hard runtime cap works.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT (or LoRa)',
    net: {
      nodes: [{ name: 'Irrigation controller', sub: 'ESP32 + flow' }],
      protocol: 'Wi-Fi or LoRa', gateway: 'Router/gateway', gatewaySub: 'field-dependent',
      uplink: 'MQTT 1883', cloud: 'Local broker + Grafana', cloudSub: 'water logging',
      clients: [{ name: 'Water-use dashboard', sub: 'per zone' }, { name: 'Fault alerts', sub: 'burst/block' }],
    },
    dashboard: [
      'The key panels are per-zone water use over the season (efficiency tracking, and the evidence for the ET-based savings) and a fault log. A burst alert that reaches your phone in minutes rather than being discovered days later is the single most valuable output.',
      'Overlaying water delivered against estimated ET demand shows whether the system is meeting demand and reveals any systematic over- or under-watering to tune the crop coefficients.',
    ],
    security: [
      'Authenticate the control link — an open irrigation controller could be made to flood a field or withhold water.',
      'Keep the fail-safe (valves close on power/comms loss) entirely local; it must not depend on the network.',
      'Alert on communication loss and on any fault so problems are caught promptly.',
    ],
  },

  testing: [
    { step: 'Calibrate and verify the flow meter', expect: 'Measured litres match a known delivered volume within a few percent.' },
    { step: 'Run a zone to a target volume', expect: 'The valve closes when the measured delivered volume reaches the target, not on a timer.' },
    { step: 'Induce a burst (high flow)', expect: 'The controller detects flow far above expected, stops the zone, and alarms.' },
    { step: 'Induce a blockage (partly block the filter)', expect: 'Flow far below expected is detected as a blockage; the zone stops and alarms.' },
    { step: 'Prevent a valve from opening', expect: 'No flow when the valve is commanded open is detected as a valve failure.' },
    { step: 'Cut power mid-watering', expect: 'The valve closes (fail-closed) — no flooding.' },
    { step: 'Trigger the rain sensor', expect: 'Watering is skipped or reduced for that cycle.' },
    { step: 'Change a crop coefficient', expect: 'The computed water volume for that zone changes proportionally, demonstrating demand-based scheduling.' },
  ],

  troubleshoot: [
    {
      sym: 'Delivered water does not match commanded volume',
      cause: 'Flow-meter K-factor wrong, or measured at a different flow rate.',
      fix: 'Recalibrate the K-factor at your actual flow rate — it changes with flow and orientation. A wrong K-factor makes both the water volume and the fault thresholds wrong.',
    },
    {
      sym: 'False burst or blockage alarms',
      cause: 'Thresholds too tight, or the expected flow is wrong.',
      fix: 'Re-measure each zone\'s healthy expected flow and set the burst/blockage thresholds as clear multiples of it (e.g. 1.5× and 0.5×). Account for the normal flow ramp when a valve first opens — do not evaluate faults in the first few seconds.',
    },
    {
      sym: 'A zone floods when it should be off',
      cause: 'Valve stuck open, or wired normally-open.',
      fix: 'Use normally-closed, fail-closed valves. Confirm they close when de-energised. Add per-zone flow monitoring so a stuck-open valve (flow when none is commanded) is detected. The hard runtime cap limits the damage.',
    },
    {
      sym: 'Watering is uneven across a zone',
      cause: 'Pressure too high/low, or clogged emitters.',
      fix: 'Fit a pressure regulator per zone — drip emitters are pressure-sensitive. Fit and maintain a filter — emitters clog easily, and a clog shows as reduced flow (which the system should detect). Flush lines periodically.',
    },
    {
      sym: 'The system over- or under-waters consistently',
      cause: 'Wrong crop coefficient, ET estimate off, or rain not accounted for.',
      fix: 'Check the crop coefficient matches the current growth stage. Validate the ET estimate against a reference. Ensure rain is subtracted from demand. Fine-tune the crop coefficients from observed crop response over a season.',
    },
  ],

  perf: [
    'Count flow pulses in an interrupt — at high flow the pulse rate is too fast to poll reliably, and missed pulses under-report delivered water.',
    'Check for faults on a few-second cadence during watering, after an initial settle period so the valve-opening ramp is not mistaken for a fault.',
    'Water once a day to accumulated demand rather than in many small pulses — fewer valve cycles, less evaporation, and full supply pressure.',
  ],

  safety: [
    'Valves must be fail-closed so a power loss or crash cannot leave a zone flooding. This is a design requirement, not an option.',
    'A hard maximum runtime per zone bounds the damage from any undetected fault — always include it.',
    'A burst left running wastes enormous water and can erode or flood a field; prompt detection and shutoff is the core safety function.',
    'Apply mains-safety practices for any mains-powered pump, and keep electronics sealed against water in a wet field environment.',
    'Do not over-irrigate — beyond wasting water, it leaches nutrients into groundwater and can waterlog and damage crops.',
  ],

  future: [
    'Add <b>per-zone flow meters</b> for precise fault localisation — knowing which zone burst, not just that flow is wrong.',
    'Add <b>soil-moisture feedback</b> (the soil-moisture project) to close the loop — ET estimates demand, soil moisture confirms the root zone actually received it.',
    'Add <b>weather-forecast integration</b> to skip watering ahead of forecast rain and pre-water ahead of a heat wave.',
    'Add <b>fertigation</b> — injecting nutrients into the irrigation water, dosed from the soil-NPK node.',
    'Add <b>a full Penman-Monteith ET</b> with wind and radiation for more accurate demand than the temperature-only approximation.',
  ],

  faq: [
    { q: 'Why ET-based instead of a timer?', a: 'Because crop water demand varies enormously with weather, and a timer ignores that entirely. A fixed schedule waters the same amount on a cool damp week as a hot dry one — wasting water in the first and starving the crop in the second. Evapotranspiration-based scheduling estimates what the crop actually consumed and replaces that, which typically saves 20–40 % of water while improving yield because the crop is neither drought-stressed nor waterlogged.' },
    { q: 'Why is the flow meter so important?', a: 'Because without it, the system is hoping rather than knowing. A timer-based drip controller has no idea whether the water it commanded reached the plants. A burst pipe can run for days wasting thousands of litres and washing out a field; a blocked line can starve a crop — both undetected until the damage is visible. The flow meter measures actual delivery, catching bursts (high flow), blockages (low flow) and valve failures (no flow) in minutes. It is the difference between a real irrigation system and a hopeful one.' },
    { q: 'What is a crop coefficient?', a: 'A number that scales the reference evapotranspiration to a specific crop at a specific growth stage. A bare reference surface loses water at ET₀; a real crop loses ET₀ × Kc. A young seedling with little leaf area has a low Kc (around 0.4) and needs little water; a mature crop at full canopy has a high Kc (up to 1.1–1.2) and needs the most; a senescing crop declines. Tracking the crop stage and applying the right coefficient is what makes the watering follow real demand through the season.' },
    { q: 'How accurate does the ET estimate need to be?', a: 'Reasonably, but not perfectly. The temperature-only Hargreaves method is less accurate than the full Penman-Monteith equation, but it is adequate for field irrigation scheduling — you are replacing consumed water, and small errors accumulate slowly and are corrected as you observe crop response and tune the coefficients. For most crops, getting within 10–15 % of true ET, combined with soil-moisture feedback, gives excellent results. Precision matters more for high-value or water-scarce situations.' },
    { q: 'Do I need soil-moisture sensors too?', a: 'They are a valuable complement, not a replacement. ET-based scheduling estimates demand from the top down (weather → crop need); soil moisture measures the result from the bottom up (did the root zone actually get wetter). Using both closes the loop: ET tells you how much to apply, soil moisture confirms it arrived and did not run off or evaporate. The most robust systems use both, which is why the soil-moisture project is a natural companion.' },
    { q: 'What happens if a valve sticks open?', a: 'The system detects it and, failing that, bounds it. Per-zone flow monitoring detects flow when no zone is commanded open. The valves are fail-closed, so a power loss closes them. And a hard maximum runtime caps how long any zone can run. Together these mean a stuck-open valve is caught quickly or limited in damage — which matters because a valve stuck open on a drip main can flood a field or empty a water supply.' },
  ],

  refs: [
    { t: 'FAO Irrigation and Drainage Paper 56 — Crop evapotranspiration', u: 'https://www.fao.org/4/x0490e/x0490e00.htm', s: 'FAO' },
    { t: 'Hargreaves & Samani, "Reference crop evapotranspiration from temperature"', u: 'https://doi.org/10.13031/2013.26773', s: 'Applied Engineering in Agriculture, 1985' },
    { t: 'YF-S201 water flow sensor — datasheet and K-factor', u: 'https://www.hobbytronics.co.uk/datasheets/sensors/YF-S201.pdf', s: 'Hobbytronics' },
    { t: 'Netafim, "Drip Irrigation Design and Management"', u: 'https://www.netafim.com/en/knowledge-center/', s: 'Netafim' },
    { t: 'Allen et al., "Crop coefficients and Kc values by crop and stage"', u: 'https://www.fao.org/4/x0490e/x0490e0b.htm', s: 'FAO' },
    { t: 'USDA NRCS — Irrigation Water Management', u: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/water/irrigation', s: 'USDA NRCS' },
  ],

  images: ['farm', 'sensor', 'esp32'],
  imageCaptions: [
    'A field irrigation system. Drip delivers water efficiently to the root zone; ET-based scheduling and flow verification make an automated system genuinely efficient.',
    'A flow sensor. Measuring delivered water — not just valve-open time — is what lets the system catch bursts, blockages and valve failures.',
    'An ESP32 development board running the ET-based scheduling and flow-verified delivery for multiple zones.',
  ],
},

];
