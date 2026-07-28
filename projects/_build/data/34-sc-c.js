/* Smart City batch C — 081 Smart Streetlight Network, 082 Water Pipeline
   Leak Detector, 083 Manhole Safety Monitor. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   081 — Smart Streetlight Network
   ══════════════════════════════════════════════════════════════════ */
{
  id: '081',
  domainKey: 'iot',
  emoji: '🌃', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Puts every streetlight on one network so a city can control brightness centrally, and — crucially — knows the instant a light fails instead of waiting for a resident to complain.',

  overview: [
    'A city runs tens of thousands of streetlights, and its two biggest lighting headaches are <b>control</b> and <b>faults</b>. Control: adjusting schedules and brightness across a whole city means sending someone to every pole, so in practice nothing changes. Faults: when a light fails, the city usually has no idea until a resident phones in — so dark spots persist for days or weeks, and maintenance crews drive around inspecting working lights to find the broken ones. This project networks every streetlight into a central system that solves both: brightness and schedules are controlled centrally, and every light reports its own status so a failure is known the instant it happens.',
    'Each light becomes a networked node that does two things beyond switching on and off. It accepts <b>central control</b> — brightness levels, dimming schedules, and group commands (a whole street, zone, or the whole city) pushed from a management system, so a city-wide policy change is a click, not a fleet of vans. And it <b>reports its own state</b> — whether it is on, its brightness, its power draw, and above all whether it has <b>failed</b> (a commanded-on light drawing no current is a dead lamp) — so the central system always knows the true condition of every light. Fault reporting turns maintenance from reactive and blind into proactive and targeted: the city knows which lights are out, where, before anyone complains.',
    'Networked over a low-power wide-area technology (LoRa) or a mesh, this scales to a whole city\'s lights on a live map — controllable, self-reporting, and analysable (energy, fault rates, burn-hours). The savings are real: proactive fault repair, remote brightness/scheduling policy, and the analytics to manage the asset. It is honest that a city deployment integrates with the lighting infrastructure and CMS properly, that safety/minimum-lighting rules and fail-safe behaviour apply, and that fault detection depends on reliable current sensing. But as a central-control-plus-fault-reporting streetlight network, it turns a sprawling, unmanaged, complaint-driven lighting estate into a centrally-managed one that fixes its own dark spots before they become problems.',
  ],
  does: [
    'Networks every streetlight into a central management system',
    'Controls brightness and schedules centrally (per light, group or city-wide)',
    'Reports each light\'s status: on/off, brightness, power',
    'Detects and reports faults (failed lamp) with location, proactively',
    'Turns maintenance from complaint-driven to targeted',
    'Provides a live city-wide map and analytics (energy, faults, burn-hours)',
    'Applies safety/minimum-lighting rules and fails safe',
  ],
  features: [
    'Central brightness/schedule control (group + city-wide)',
    'Per-light status/brightness/power reporting',
    'Proactive located fault detection',
    'Live city-wide lighting map',
    'Energy/fault/burn-hour analytics',
    'LoRa/mesh scalability',
    'Safety/minimum-level and fail-safe',
  ],
  applications: [
    { t: 'Municipal lighting management', d: 'Central control and fault reporting across a city\'s streetlights.' },
    { t: 'Proactive maintenance', d: 'Knowing which lights are out, where, before residents complain.' },
    { t: 'Policy/energy management', d: 'City-wide brightness/schedule changes and energy analytics.' },
    { t: 'Campus / estate lighting', d: 'Centrally-managed, self-reporting lighting for large sites.' },
  ],
  skills: [
    'Networked light control and central management',
    'Group/city-wide command distribution',
    'Status and fault reporting (current sensing)',
    'LoRa/mesh scalability',
    'Safety/minimum-level and fail-safe',
  ],
  prereq: [
    'The two big wins are central control and PROACTIVE fault reporting (know a failure before a complaint).',
    'Fault detection needs reliable current sensing (commanded-on light drawing nothing = failed).',
    'Safety/minimum-lighting rules apply and the system must fail safe (on) — never dark a street unsafely.',
    'A city deployment integrates with the lighting infrastructure/CMS properly.',
  ],

  parts: ['esp32', 'acs712', 'ldr', 'relay1', 'oled', 'lora', 'psu5v'],
  extraParts: [
    { name: 'Dimmable driver interface', spec: '0-10V/PWM/DALI to the luminaire driver', qty: 1, price: 600, note: 'Match to the luminaire' },
    { name: 'Current sensor (fault)', spec: 'Confirms the lamp draws current (fault detection)', qty: 1, price: 200 },
    { name: 'LoRa/mesh module + gateway', spec: 'Node radio and city gateway/CMS', qty: 1, price: 900 },
    { name: 'Central management system', spec: 'CMS mapping/controlling all lights and faults', qty: 1, price: 0, note: 'Software/platform' },
  ],
  cost: '₹2,200 – ₹4,000 per light (+ CMS/gateway)',
  libs: ['wifi', 'pubsub', 'ssd1306', 'lorolib', 'ntp', 'arduinojson'],

  pins: {
    left: [
      { dev: 'Light sensor (LDR)', devPin: 'AOUT', pin: 'GPIO 34', sig: 'Ambient (dusk/dawn backup)' },
      { dev: 'Current sensor', devPin: 'AOUT', pin: 'GPIO 35', sig: 'Lamp current (fault/power)' },
    ],
    right: [
      { dev: 'Dimming (0-10V/PWM)', devPin: 'ctrl', pin: 'GPIO 25', sig: 'Brightness' },
      { dev: 'Relay/contactor', devPin: 'IN', pin: 'GPIO 26', sig: 'On/off' },
      { dev: 'LoRa', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Central control/report' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Status' },
    ],
  },
  wiringNotes: [
    'Each light accepts central commands (brightness/schedule/group) over LoRa/mesh and reports its status back.',
    'Sense lamp current to report power and detect a failed lamp (commanded on, drawing nothing).',
    'Drive the luminaire\'s dimming input (0-10V/PWM/DALI) for central brightness control; match the luminaire.',
    'Keep local dusk/dawn and minimum-level/fail-safe behaviour so a lost network never darkens a street unsafely.',
    'Integrate with the city CMS and gateway; respect the lighting infrastructure.',
  ],

  block: { columns: [
    { label: 'Node', edge: 'right', blocks: [
      { name: 'Light control', sub: 'brightness/on', highlight: true },
      { name: 'Current', sub: 'fault/power' },
    ] },
    { label: 'Network', edge: 'right', blocks: [
      { name: 'LoRa/mesh', sub: 'commands + reports' },
      { name: 'Gateway', sub: 'to CMS' },
    ] },
    { label: 'Manage', edge: 'right', blocks: [
      { name: 'CMS', sub: 'central control', highlight: true },
      { name: 'Fault map', sub: 'proactive' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Policy', sub: 'group/city' },
      { name: 'Maintenance', sub: 'targeted' },
    ] },
  ] },
  flow: [
    { t: 'Node: apply command / dusk-dawn', k: 'start' },
    { t: 'Set brightness/on; sense current', k: 'proc' },
    { t: 'Commanded on but no current? → fault', k: 'dec', yes: 'Report located fault', no: 'Report status' },
    { t: 'Report located fault', k: 'io' },
    { t: 'Report status', k: 'io' },
    { t: 'CMS: map, control, analytics', k: 'proc' },
    { t: 'Push policy; dispatch maintenance', k: 'end', back: 'Node: apply command / dusk-dawn' },
  ],

  principle: [
    'A city\'s streetlight estate is a huge, distributed asset that is traditionally managed with almost no information and no remote control, and the two consequences of that — <b>you cannot change anything without visiting every pole</b>, and <b>you do not know a light has failed until someone tells you</b> — are exactly what networking the lights fixes. Connecting every light to a central management system replaces "send a van" with "send a command" and replaces "wait for a complaint" with "the system already knows". Those two shifts — central control and proactive fault awareness — are the entire value proposition.',
    '<b>Central control</b> means brightness and schedules become software, applied at any scale. A single light, a street, a zone, or the whole city can be re-dimmed or re-scheduled from the management system — to implement a night-time dimming policy, brighten an area for an event, or respond to a change — without touching hardware. Group and city-wide commands make policy changes trivial, and the same channel lets the city verify that lights actually applied the change. This turns a static, unadjustable estate into one that can be operated.',
    'The higher-value shift is <b>proactive fault reporting</b>. Each light reports its own state — on/off, brightness, power draw — and, critically, whether it has <b>failed</b>: a light commanded on that draws no current is a dead lamp, and it says so, with its location. This inverts maintenance. Instead of the city being blind (dark spots persist for weeks until a resident complains, and crews drive around inspecting <i>working</i> lights to find the broken ones), the management system holds a live, accurate picture of every fault, so maintenance is <b>targeted</b> — dispatch a crew straight to the lights that are actually out. Faster repairs, no wasted inspection driving, and dark spots fixed before they become safety and complaint problems.',
    'Networked at city scale over a low-power technology (LoRa) or a mesh, all of this becomes a <b>live map and an analytics platform</b>: energy consumption, fault rates, lamp burn-hours (predicting end-of-life replacements), and policy compliance across the whole estate. The design keeps the non-negotiables of street lighting intact — <b>safety and minimum lighting levels</b> are respected, and the node behaves <b>fail-safe</b> (holding local dusk-to-dawn and never dimming below the safe minimum, staying on if the network is lost) so central control can never accidentally darken a street. It is candid that a real deployment integrates with the lighting infrastructure and a proper CMS, and that reliable current sensing underpins fault detection. But the core contribution is a genuine, widely-proven smart-city win: turn a sprawling, unmanaged, complaint-driven lighting estate into a centrally-controlled, self-reporting network that operates at a click and fixes its own dark spots before the city hears about them.',
  ],
  equations: [
    { t: 'Fault detection', eq: 'Commanded ON but the lamp draws no current → failed:\n\n  fault if (commanded_on AND I_lamp < I_min)\n  report fault WITH location → proactive, targeted repair.\n\nAlso report I_lamp as power for energy analytics.' },
    { t: 'Group / city-wide command', eq: 'A command targets a scope:\n  {scope: light|street|zone|city, brightness/schedule}\n\n  each node in scope applies it and ACKs\n  city-wide policy = one command, verified by ACKs.' },
    { t: 'Safety / fail-safe', eq: 'Local invariants the network cannot override:\n  brightness ≥ minimum safe level (road type)\n  hold local dusk-to-dawn if command/network lost\n  fault/network loss → stay ON (fail-safe), never dark.' },
  ],

  assembly: [
    { h: 'Build the networked node', p: [
      'Each light: dimming interface, current sensing (fault/power), a light sensor (dusk/dawn backup), and a LoRa/mesh radio for central commands and status reporting.',
      'Keep local dusk/dawn, minimum-level and fail-safe behaviour independent of the network.',
    ], warn: 'Central control must never be able to darken a street unsafely. Enforce minimum lighting levels and fail-safe (on) locally, independent of the network.' },
    { h: 'Set up the network and CMS', p: [
      'Aggregate nodes via a gateway to a central management system that maps and controls all lights and collects status/faults.',
    ] },
    { h: 'Enable control, fault reporting and analytics', p: [
      'Support per-light/group/city commands with ACKs, proactive located fault reporting, and analytics (energy, faults, burn-hours).',
    ] },
  ],
  steps: [
    { h: 'Apply commands, report status and faults', p: [
      'Apply central brightness/schedule (within safety), sense current, report status, and report a located fault when a commanded-on light draws no current.',
    ], code: {
      file: 'streetlight-node.ino', lang: 'cpp',
      body: `#define B_MIN 40      // % minimum safe brightness
#define I_MIN 0.05f   // A: below when on = fault

int commandedBrightness = 100; bool commandedOn = true;

void applyCommand(int brightness, bool on){
  commandedOn = on;
  commandedBrightness = max(brightness, on ? B_MIN : 0);  // never below safe min
  setBrightness(commandedBrightness);
  digitalWrite(PIN_RELAY, commandedBrightness>0 ? HIGH : LOW);
}

const char* reportStatus(float iLamp, char* out, size_t n){
  const char* fault = (commandedBrightness>0 && iLamp < I_MIN)
                      ? "lamp failed" : nullptr;
  float watts = (commandedBrightness/100.0f) * LAMP_W;   // via current in reality
  snprintf(out, n,
    "{\\"id\\":\\"%s\\",\\"on\\":%s,\\"bright\\":%d,\\"W\\":%.0f,\\"fault\\":\\"%s\\"}",
    LIGHT_ID, commandedBrightness>0?"true":"false", commandedBrightness,
    watts, fault?fault:"none");
  return fault;
}`,
      explain: [
        { ref: 'commandedBrightness = max(brightness, on ? B_MIN : 0);  // never below safe min', txt: 'A central command is clamped to the minimum safe brightness, so remote control can never dim a street below its safe level.' },
        { ref: 'const char* fault = (commandedBrightness>0 && iLamp < I_MIN)', txt: 'A commanded-on light drawing no current is a failed lamp — proactive fault detection from current sensing.' },
        { ref: 'reportStatus(', txt: 'Each light reports its on/brightness/power and fault state, so the CMS always knows the true condition of the estate.' },
        { ref: 'return fault;', txt: 'The fault (with the light\'s id/location) is surfaced so maintenance can be dispatched straight to the dark light before anyone complains.' },
      ],
    } },
    { h: 'Distribute commands and manage centrally', p: [
      'Accept per-light/group/city commands with ACKs, report status/faults to the CMS, and drive the live map, policy and analytics; hold fail-safe on network loss.',
    ], tip: 'ACK group/city commands so the CMS can verify a policy actually applied and flag lights that did not respond (possibly failed).' },
  ],

  code: [{
    file: 'smart-streetlight-network.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Streetlight Network — ESP32 node

   Central brightness/schedule control (per light/group/city) with ACKs,
   per-light status and PROACTIVE located fault reporting (failed lamp).
   Local dusk/dawn, minimum-level and fail-safe (on) independent of the
   network. LoRa to a city management system.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <LoRa.h>
#include <SPI.h>

#define PIN_ILAMP 35
#define PIN_DIM   25
#define PIN_RELAY 26
#define B_MIN 40
#define I_MIN 0.05f

const char *LIGHT_ID = "SL-8842";
const char *ZONE = "Z4";
int brightness = 100; bool on = true; bool networkOk = true;
WiFiClient net; PubSubClient mqtt(net);

void setBrightness(int pct){ ledcWrite(0, pct*1023/100); }

void applyCommand(int b, bool o){
  on = o; brightness = o ? max(b, B_MIN) : 0;   // never below safe minimum
  setBrightness(brightness);
  digitalWrite(PIN_RELAY, brightness>0?HIGH:LOW);
}

void onCommand(const char* payload){
  // parse {scope,target,brightness,on} and apply if this node is in scope
  int b; bool o; if (commandForMe(payload, ZONE, LIGHT_ID, b, o)){
    applyCommand(b, o);
    mqtt.publish("light/ack", LIGHT_ID);        // ACK so CMS can verify
  }
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_RELAY, OUTPUT);
  ledcSetup(0,1000,10); ledcAttachPin(PIN_DIM,0);
  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  mqtt.setCallback([](char*,byte*p,unsigned int l){
    char b[128]; memcpy(b,p,min(l,127u)); b[min(l,127u)]=0; onCommand(b); });
}

void loop(){
  networkOk = (WiFi.status()==WL_CONNECTED) && mqtt.connected();
  if (!networkOk && WiFi.status()==WL_CONNECTED) mqtt.connect("light-1");
  if (mqtt.connected()){ mqtt.subscribe("light/cmd"); mqtt.loop(); }

  // fail-safe: if network lost, hold local dusk/dawn at safe level (never dark)
  if (!networkOk) applyCommand(B_MIN, true);   // stay lit at safe minimum

  float iLamp = analogRead(PIN_ILAMP)/4095.0f * I_FS;
  const char* fault = (brightness>0 && iLamp < I_MIN) ? "lamp failed" : nullptr;
  float watts = iLamp * MAINS_V;               // power for analytics

  char m[200];
  snprintf(m,sizeof m,
    "{\\"id\\":\\"%s\\",\\"zone\\":\\"%s\\",\\"on\\":%s,\\"bright\\":%d,"
    "\\"W\\":%.0f,\\"fault\\":\\"%s\\"}",
    LIGHT_ID, ZONE, brightness>0?"true":"false", brightness, watts,
    fault?fault:"none");
  LoRa.beginPacket(); LoRa.print(m); LoRa.endPacket();
  if (mqtt.connected()){ mqtt.publish("light/status", m);
    if (fault) mqtt.publish("light/fault", m); }

  delay(5000);
}`,
    explain: [
      { ref: 'void onCommand(const char* payload)', txt: 'The node applies central commands addressed to its light/zone/city scope and ACKs, so a city-wide policy change is one command the CMS can verify per light.' },
      { ref: 'brightness = o ? max(b, B_MIN) : 0;   // never below safe minimum', txt: 'Central brightness is clamped to the safe minimum, so remote control can never dim a street below its safe level.' },
      { ref: 'if (!networkOk) applyCommand(B_MIN, true);   // stay lit at safe minimum', txt: 'If the network is lost, the light fails safe — staying lit at the safe minimum on local dusk/dawn rather than going dark.' },
      { ref: 'const char* fault = (brightness>0 && iLamp < I_MIN)', txt: 'A commanded-on light drawing no current is a failed lamp, reported proactively with its id/zone for targeted maintenance.' },
      { ref: 'if (fault) mqtt.publish("light/fault", m)', txt: 'Faults are pushed to the CMS the moment they occur, so the city knows which lights are out before any resident complains.' },
    ],
  }],

  config: [
    'Configure the dimming interface, current sensing, and the LoRa/mesh network and gateway/CMS.',
    'Set the minimum safe brightness and local dusk/dawn/fail-safe behaviour.',
    'Configure command scopes (light/group/city) with ACKs and status/fault reporting.',
    'Set analytics (energy, faults, burn-hours) at the CMS.',
  ],
  calibration: [
    { h: 'Fault/power sensing', p: [
      'Calibrate current sensing so a failed lamp is detected and power is accurate for analytics.',
    ] },
    { h: 'Control/ACK', p: [
      'Verify per-light/group/city commands apply and ACK; confirm minimum-level clamping.',
    ] },
    { h: 'Fail-safe', p: [
      'Confirm the node stays safely lit on network loss and holds local dusk/dawn.',
    ] },
  ],
  testing: [
    { step: 'Send a group brightness command', expect: 'Lights in scope dim/brighten and ACK; verifiable at CMS' },
    { step: 'Command below minimum', expect: 'Clamped to the safe minimum' },
    { step: 'Disable a lamp', expect: 'Located fault reported proactively' },
    { step: 'Drop the network', expect: 'Light stays safely lit (fail-safe) on local dusk/dawn' },
    { step: 'City-wide schedule change', expect: 'Applied and verified across the estate' },
    { step: 'Review analytics', expect: 'Energy, fault rates, burn-hours available' },
  ],
  output: [
    'The CMS shows a live map of every light\'s state/brightness/power and faults, supports group/city control, and provides energy/fault/burn-hour analytics.',
    { file: 'light.json', lang: 'json', body: `{
  "id": "SL-8842",
  "zone": "Z4",
  "on": true,
  "bright": 60,
  "W": 82,
  "fault": "none"
}` },
    'A light at 60% (per a central policy) reporting its power and no fault; a failed lamp would appear as a located fault in the CMS immediately, dispatching a crew before a resident notices the dark spot.',
  ],
  troubleshoot: [
    { sym: 'Faults not known until complaints', cause: 'No fault reporting', fix: 'Sense current; report commanded-on-but-no-current as a located fault' },
    { sym: 'Policy changes need site visits', cause: 'No central control', fix: 'Network lights to a CMS; use group/city commands with ACKs' },
    { sym: 'Street darkened unsafely', cause: 'Central control below safe minimum', fix: 'Clamp to minimum level locally; fail safe (on) on network loss' },
    { sym: 'Commands not verified', cause: 'No ACK', fix: 'ACK commands; flag non-responding (possibly failed) lights' },
    { sym: 'Power analytics wrong', cause: 'Uncalibrated current sensing', fix: 'Calibrate current/power sensing' },
  ],

  iot: {
    protoShort: 'LoRa/mesh → city lighting CMS',
    net: {
      nodes: [{ name: 'Light node', sub: 'ESP32' }, { name: 'Other lights', sub: 'city estate' }],
      protocol: 'LoRa / mesh', gateway: 'City gateway', gatewaySub: 'to CMS',
      uplink: 'MQTT', cloud: 'Lighting CMS', cloudSub: 'control + faults',
      clients: [{ name: 'CMS', sub: 'map/control' }, { name: 'Maintenance', sub: 'faults' }],
    },
    protocol: ['Nodes accept scoped commands (light/group/city) with ACKs and report status/power/faults; the CMS controls policy and holds a live fault picture. Safety/fail-safe is local.'],
    topics: [
      { t: 'light/cmd', dir: 'CMS → nodes', payload: 'scope, brightness/schedule' },
      { t: 'light/status', dir: 'node → CMS', payload: 'on, brightness, power' },
      { t: 'light/fault', dir: 'node → maintenance', payload: 'failed lamp (located)' },
    ],
    cloud: ['A CMS maps and controls every light (group/city policy with ACK verification), holds a live fault picture for targeted maintenance, and provides energy/fault/burn-hour analytics.'],
    dashboard: ['A city lighting map with state/brightness/power, a fault list, group/city controls, and estate analytics.'],
    mobile: ['Fault alerts (dark spots) and estate/energy summaries.'],
    security: [
      'Authenticate commands so only the city can control lights; keep safety/fail-safe local.',
      'Verify commands via ACKs; flag non-responding lights.',
      'Alert on light silence (possible fault).',
    ],
  },

  perf: [
    'Report status/faults on a slow cadence, faults immediately; ACK commands.',
    'Keep safety/minimum-level/fail-safe local and independent of the network.',
    'Scale over LoRa/mesh; aggregate at the CMS.',
    'Provide estate analytics for management.',
  ],
  safety: [
    'Enforce minimum lighting levels and fail-safe (on) locally — central control must never darken a street unsafely, and network loss must not either.',
    'Lighting levels are standards-governed and policy is municipal; honour both.',
    'Integrate with the lighting infrastructure/CMS and mains safely (qualified power work).',
    'Fault-report dark spots for proactive maintenance.',
  ],
  maintenance: [
    'Act on fault reports — proactive, targeted repair is the point.',
    'Verify control/ACK and fail-safe behaviour.',
    'Calibrate current/power sensing; check dimming.',
    'Review estate analytics (burn-hours) to plan replacements.',
  ],
  future: [
    'Add adaptive/motion dimming (as in the energy optimiser) within the network.',
    'Add predictive lamp end-of-life from burn-hours.',
    'Integrate with other smart-city assets on the poles.',
    'Add power-quality/energy analytics per light.',
  ],
  faq: [
    { q: 'What are the two big wins?', a: 'Central control — changing brightness/schedules across the city from software instead of visiting every pole — and proactive fault reporting: the system knows a light has failed (and where) the instant it happens, instead of waiting for a resident to complain.' },
    { q: 'How does it know a light has failed?', a: 'By sensing whether the lamp actually draws current when commanded on. A commanded-on light drawing nothing is a dead lamp, reported with its location so maintenance goes straight to it.' },
    { q: 'Can central control accidentally darken a street?', a: 'No — the node clamps any command to the road\'s minimum safe brightness and fails safe (stays lit at the safe minimum on local dusk/dawn) if the network is lost. Safety is enforced locally, independent of the network.' },
    { q: 'How does it change maintenance?', a: 'From reactive and blind to proactive and targeted. Instead of crews driving around inspecting working lights to find broken ones, the CMS shows exactly which lights are out, where — so crews are dispatched straight to them.' },
    { q: 'How does it scale to a whole city?', a: 'Lights network over a low-power technology (LoRa) or a mesh to a central management system that maps and controls the whole estate and holds a live fault picture and analytics.' },
  ],
  refs: [
    { t: 'Smart street lighting / CMS', u: 'https://en.wikipedia.org/wiki/Smart_street_lighting', s: 'Reference' },
    { t: 'Streetlight fault management', u: 'https://en.wikipedia.org/wiki/Street_light', s: 'Reference' },
    { t: 'LoRa / mesh city networks', u: 'https://en.wikipedia.org/wiki/LoRa', s: 'Reference' },
    { t: 'LED dimming (0-10V/DALI)', u: 'https://en.wikipedia.org/wiki/Digital_Addressable_Lighting_Interface', s: 'Reference' },
    { t: 'Road lighting standards', u: 'https://en.wikipedia.org/wiki/Road_lighting', s: 'Reference' },
  ],
  images: ['streetlight', 'esp32', 'city'],
  imageCaptions: [
    'Every streetlight on one network — centrally controlled and self-reporting.',
    'ESP32 node applying central brightness commands and detecting a failed lamp from its current.',
    'A CMS maps and controls the whole estate and knows every dark spot before a resident complains.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   082 — Water Pipeline Leak Detector
   ══════════════════════════════════════════════════════════════════ */
{
  id: '082',
  domainKey: 'iot',
  emoji: '💧', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'Uses pressure analytics across the water network to find leaks that waste an enormous share of treated water — pinpointing roughly where a pipe is losing, not just that the system leaks.',

  overview: [
    'Water utilities lose a staggering amount of treated water to leaks — often a fifth to a third of everything pumped, so-called <b>non-revenue water</b> — and most of it drips away underground, unseen, for years. A burst main is obvious; the slow, hidden leaks that add up to the biggest losses are not, and finding them across kilometres of buried pipe is the hard part. This project attacks that with <b>pressure analytics</b>: pressure sensors across the network, and the insight that leaks leave a signature in how pressure behaves — so you can detect that a district is leaking and narrow down roughly where.',
    'The physics is the lever. A leak is a continuous loss of water and pressure, so it shows up in the pressure field: a district with a leak has a characteristically <b>lower and differently-behaving pressure</b> than a healthy one, and the pattern of pressures across sensors, especially at <b>night</b> when legitimate demand is low, reveals leakage that daytime demand masks. Sudden pressure <b>transients</b> mark a new burst; a persistent depression localises to the leaking area. Combined with <b>district metering</b> (comparing water flowing into a zone against what is legitimately consumed — the difference is loss), pressure analytics can both quantify leakage and point to the district, and sometimes the stretch, where it is happening.',
    'The nodes are pressure sensors at hydrants, valves and district boundaries, reporting over LoRa/cellular (buried infrastructure has no power or network), with analytics that compare pressures across the network and over time. The output is not "somewhere there\'s a leak" but "district 7 is losing ~X, concentrated toward the north end" — enough to send a crew with acoustic gear to the right place instead of the whole city. It is honest that pressure analytics <b>localises</b> rather than pinpoints to the exact fitting (final location needs acoustic correlation), that good results need adequate sensor density and modelling, and that this is one layer of a leakage-management programme. But as a pressure-analytics leak detector, it directs scarce leak-hunting effort at the districts and stretches actually losing water — turning a huge, invisible, expensive loss into a findable, prioritised one.',
  ],
  does: [
    'Senses pressure across the water network at key points',
    'Detects leakage from pressure behaviour (especially at night)',
    'Localises leaks to a district/stretch (pressure pattern + transients)',
    'Combines with district metering (inflow vs consumption = loss)',
    'Quantifies non-revenue water and prioritises leak hunting',
    'Reports over LoRa/cellular from buried, powerless infrastructure',
    'Directs crews with acoustic gear to the right area',
  ],
  features: [
    'Pressure-analytics leak detection',
    'Night-flow/minimum-pressure analysis',
    'District localisation (not just "somewhere")',
    'District metering integration (NRW quantification)',
    'Burst-transient detection',
    'LoRa/cellular for buried infrastructure',
    'Honest: localises, acoustic gear pinpoints',
  ],
  applications: [
    { t: 'Utility leakage management', d: 'Detecting/localising leaks to cut non-revenue water across a network.' },
    { t: 'District metered areas (DMA)', d: 'Zone-level inflow-vs-consumption and pressure analytics.' },
    { t: 'Burst detection', d: 'Catching new bursts from pressure transients quickly.' },
    { t: 'Water-efficiency programmes', d: 'Prioritising leak repair by quantified loss.' },
  ],
  skills: [
    'Network pressure sensing (buried, powerless)',
    'Pressure-analytics leak detection and localisation',
    'District metering and night-flow analysis',
    'LoRa/cellular telemetry',
    'Interpreting results for leak hunting',
  ],
  prereq: [
    'Pressure analytics LOCALISES a leak to a district/stretch; final pinpointing needs acoustic correlation gear.',
    'Night analysis (low demand) reveals leakage that daytime demand masks.',
    'District metering (inflow − legitimate consumption = loss) quantifies non-revenue water.',
    'Buried infrastructure has no power/network — sensors are battery + LoRa/cellular; results need adequate density/modelling.',
  ],

  parts: ['esp32', 'zmpt101b', 'ds18b20', 'lora', 'sim800', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Pressure transducer (network)', spec: 'Pressure sensor at hydrant/valve/DMA boundary (rated for the main)', qty: 6, price: 1200, note: 'Multiple points enable localisation' },
    { name: 'DMA flow meter', spec: 'Zone inflow metering for non-revenue-water quantification', qty: 1, price: 3000 },
    { name: 'Battery + LoRa/cellular', spec: 'Buried infrastructure has no power/network', qty: 1, price: 700 },
    { name: 'Analytics platform', spec: 'Server correlating pressures/flows to detect/localise leaks', qty: 1, price: 0 },
  ],
  cost: '₹8,000 – ₹14,000 (multi-node)',
  libs: ['wifi', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'Pressure transducer', devPin: '4-20mA/AOUT', pin: 'GPIO 34 (ADC)', sig: 'Network pressure' },
      { dev: 'Temp', devPin: 'DQ', pin: 'GPIO 4', sig: 'Compensation' },
    ],
    right: [
      { dev: 'LoRa/cellular', devPin: 'bus', pin: 'SPI/UART', sig: 'Pressure report' },
      { dev: 'Solar + TP4056', devPin: 'OUT', pin: '3V3 reg', sig: 'Charged supply' },
      { dev: 'Battery sense', devPin: 'ADC', pin: 'GPIO 35', sig: 'Supervision' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Health' },
    ],
  },
  wiringNotes: [
    'Fit pressure transducers rated for the main at hydrants, valves and DMA boundaries; multiple points enable localisation.',
    'Sample frequently enough to catch pressure transients (bursts) as well as slow trends.',
    'Battery + LoRa/cellular and solar where possible — buried water infrastructure has no power/network.',
    'Integrate a DMA inflow meter for non-revenue-water quantification (inflow vs legitimate consumption).',
    'Analytics run on a server correlating pressures/flows across the network and over time (especially at night).',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Pressure', sub: 'network points', highlight: true },
      { name: 'DMA flow', sub: 'inflow' },
    ] },
    { label: 'Analyse', edge: 'right', blocks: [
      { name: 'Server', sub: 'pressure pattern' },
      { name: 'Night/transient', sub: 'leak signature' },
    ] },
    { label: 'Localise', edge: 'right', blocks: [
      { name: 'District/stretch', sub: 'where', highlight: true },
      { name: 'NRW', sub: 'quantify' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Prioritise', sub: 'crews' },
      { name: 'Acoustic', sub: 'pinpoint' },
    ] },
  ] },
  flow: [
    { t: 'Sense pressure (and DMA flow)', k: 'start' },
    { t: 'Report to analytics', k: 'io' },
    { t: 'Night min-flow / pressure anomaly?', k: 'dec', yes: 'Flag leakage; localise district', no: 'Trend' },
    { t: 'Flag leakage; localise district', k: 'io' },
    { t: 'Trend', k: 'proc' },
    { t: 'Quantify NRW; prioritise', k: 'proc' },
    { t: 'Dispatch acoustic pinpointing', k: 'end' },
  ],

  principle: [
    'The scale of the problem is what motivates a network approach: water utilities routinely lose a fifth to a third of treated water to leaks — <b>non-revenue water</b> — and the bulk of it is not dramatic bursts but slow, hidden leaks dripping away underground for years. The challenge is that these leaks are invisible and spread across kilometres of buried pipe, so the question is not usually "is the system leaking?" (it is) but "<b>where</b>, and how much, so we can fix the biggest ones first?". Digging up the whole network is impossible; the value is in <b>localising</b> the loss so scarce leak-hunting effort goes to the right place.',
    'Pressure is the signal that makes this possible, because a leak is fundamentally a continuous loss of water and therefore <b>leaves a signature in the pressure field</b>. A district with significant leakage runs at a characteristically <b>lower pressure</b> and responds differently to demand than a tight one; a new burst causes a sudden pressure <b>transient</b> that propagates through the network; and a persistent, localised pressure <b>depression</b> points toward the leaking area. Reading the pattern of pressures across multiple sensors, and how it changes, converts an invisible underground loss into an observable, analysable phenomenon — you cannot see the leak, but you can see its effect on pressure.',
    'The single most powerful technique is <b>night analysis</b>. During the day, legitimate consumption dominates the flow and pressure picture and masks leakage; but in the small hours, when almost no one is using water, whatever is still flowing and depressing pressure is overwhelmingly <b>leakage</b>. So the <b>minimum night flow</b> into a district, and the night-time pressure behaviour, are direct measures of how much that district leaks — a healthy zone goes quiet at night, a leaky one does not. Combined with <b>district metering</b> — comparing the metered <b>inflow</b> to a zone against the legitimate <b>consumption</b> within it, the difference being loss — pressure analytics both <b>quantifies</b> the leakage (litres per hour of non-revenue water) and, from the pressure pattern, <b>localises</b> it to a district and often a stretch.',
    'The honest output and deployment shape complete the picture. The system does not pinpoint the exact leaking fitting — pressure analytics <b>localises</b> to an area, and the final metres are found by a crew with <b>acoustic correlation</b> gear (listening for the leak\'s sound) sent to that area rather than roaming the city. That division of labour — analytics to narrow it down, acoustics to pinpoint — is what makes leak hunting tractable and cheap. The nodes themselves must live in <b>buried, powerless infrastructure</b>, so they are battery-powered and report over LoRa or cellular, and good results depend on adequate <b>sensor density</b> and modelling. The design is candid that this is one layer of a broader leakage-management programme, and that localisation quality scales with how many pressure points you have. But the contribution is exactly what utilities need: turning a huge, invisible, expensive loss into a <b>quantified, prioritised, localised</b> one — telling you which districts and stretches are actually bleeding water, so you fix the biggest losses first instead of guessing.',
  ],
  equations: [
    { t: 'Minimum night flow (leakage)', eq: 'At night, legitimate demand ≈ 0, so residual flow ≈ leakage:\n\n  leakage ≈ min_night_flow(zone) − small legitimate night use\n\nA healthy zone goes quiet at night; a leaky one keeps\nflowing/depressing pressure → measure it in the small hours.' },
    { t: 'District metering (non-revenue water)', eq: 'NRW(zone) = inflow − legitimate consumption\n\n  inflow from the DMA meter; consumption from billed use.\n  the difference is loss (leakage + theft + meter error).\nQuantifies how much each district is losing.' },
    { t: 'Pressure localisation', eq: 'A leak depresses/behaves-differently in the pressure field:\n\n  compare pressures across sensors vs a healthy baseline/model\n  a persistent local depression → leak in that area\n  a sudden transient → new burst; timing across sensors hints\n    at direction. Localises to a district/stretch (not exact).' },
  ],

  assembly: [
    { h: 'Deploy pressure sensing and metering', p: [
      'Fit pressure transducers at hydrants/valves/DMA boundaries (rated for the main) and a DMA inflow meter, battery-powered with LoRa/cellular and solar where possible.',
      'Sample fast enough for transients and log/report to the analytics server.',
    ], warn: 'Buried water infrastructure has no power or network — design for battery + LoRa/cellular and long life, and use pressure transducers rated for the main.' },
    { h: 'Set up analytics', p: [
      'On the server, baseline healthy pressures, run night-flow and pressure-pattern analysis, and integrate district metering for non-revenue-water quantification.',
    ] },
    { h: 'Localise and dispatch', p: [
      'Localise leakage to a district/stretch, prioritise by quantified loss, and dispatch acoustic pinpointing to the right area.',
    ] },
  ],
  steps: [
    { h: 'Analyse night flow and pressure pattern', p: [
      'Measure minimum night flow and compare district pressures to a healthy baseline to detect and localise leakage; catch transients for bursts.',
    ], code: {
      file: 'leak-analytics.py', lang: 'python',
      body: `def minimum_night_flow(inflow_series, night_window):
    night = inflow_series.between(*night_window)     # e.g. 02:00-04:00
    return night.min()                               # residual ~ leakage

def leakage_estimate(dma):
    mnf = minimum_night_flow(dma.inflow, ("02:00","04:00"))
    legit_night = dma.expected_night_use              # small
    return max(0, mnf - legit_night)                  # L/h leakage

def localise(pressures, baseline_model):
    # persistent local depression vs healthy model => leak area
    dev = {sid: p - baseline_model[sid] for sid, p in pressures.items()}
    worst = min(dev, key=dev.get)                     # most depressed sensor
    if dev[worst] < -PRESS_THRESH:
        return area_around(worst)                     # district/stretch
    return None

def detect_burst(pressure_series):
    dP = pressure_series.diff()
    return (dP < -BURST_STEP).any()                   # sudden drop = burst`,
      explain: [
        { ref: 'def minimum_night_flow(', txt: 'The minimum night flow into a district is measured when legitimate demand is near zero, so the residual is essentially leakage.' },
        { ref: 'return max(0, mnf - legit_night)                  # L/h leakage', txt: 'Subtracting the small legitimate night use gives a direct quantitative leakage estimate for the district.' },
        { ref: 'worst = min(dev, key=dev.get)                     # most depressed sensor', txt: 'The sensor most depressed below the healthy model localises the leak to its area — turning "somewhere" into a district/stretch.' },
        { ref: 'return (dP < -BURST_STEP).any()                   # sudden drop = burst', txt: 'A sudden pressure drop flags a new burst quickly, distinct from slow background leakage.' },
      ],
    } },
    { h: 'Quantify NRW, prioritise and pinpoint', p: [
      'Combine night flow and district metering to quantify non-revenue water per district, prioritise repairs by loss, and dispatch acoustic gear to the localised area for exact pinpointing.',
    ], tip: 'Prioritise districts by quantified loss (litres/day) — fixing the biggest leaks first gives the most water and money back per crew-day.' },
  ],

  code: [{
    file: 'pipeline-pressure-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Water Pipeline Pressure Node — ESP32, LoRa/cellular, solar

   Reports network pressure (and catches bursts) for server-side leak
   analytics: night-flow/pressure-pattern localises leakage to a
   district/stretch, quantified with district metering. Acoustic gear
   pinpoints the exact leak.
   ══════════════════════════════════════════════════════════════════ */

#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_PRESSURE 34
#define P_FS 16.0f            // bar full-scale
#define BURST_STEP 0.5f       // bar sudden drop = burst
#define NODE_ID 7
#define SLEEP_S 300           // 5 min (faster if a transient)

Preferences prefs;
RTC_DATA_ATTR float prevP = NAN;

float readPressureBar(){
  long s=0; for(int i=0;i<64;i++) s+=analogRead(PIN_PRESSURE);
  return (s/64.0f)/4095.0f * P_FS;
}

void report(float p, bool burst){
  LoRa.beginPacket();
  LoRa.printf("{\\"node\\":%d,\\"bar\\":%.2f,\\"burst\\":%d}",
              NODE_ID, p, burst?1:0);
  LoRa.endPacket();
}

void setup(){
  Serial.begin(115200);
  analogSetPinAttenuation(PIN_PRESSURE, ADC_11db);
  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6); LoRa.setSpreadingFactor(10);

  float p = readPressureBar();
  bool burst = !isnan(prevP) && (p - prevP) < -BURST_STEP;   // sudden drop
  prevP = p;
  report(p, burst);

  // sample faster briefly after a suspected burst
  uint32_t sleep_s = burst ? 30 : SLEEP_S;
  esp_sleep_enable_timer_wakeup((uint64_t)sleep_s*1000000ULL);
  esp_deep_sleep_start();
}
void loop(){}`,
    explain: [
      { ref: 'float readPressureBar()', txt: 'Averages many ADC samples for a stable network-pressure reading, the raw signal the server\'s leak analytics work on.' },
      { ref: 'bool burst = !isnan(prevP) && (p - prevP) < -BURST_STEP;   // sudden drop', txt: 'A sudden pressure drop between reads flags a possible new burst, which the node reports immediately.' },
      { ref: 'uint32_t sleep_s = burst ? 30 : SLEEP_S;', txt: 'After a suspected burst the node samples faster to capture the event, then returns to a slow, battery-saving cadence.' },
      { ref: 'esp_deep_sleep_start();', txt: 'Deep sleep between reads gives the long battery life a buried, powerless network node needs.' },
      { ref: 'report(p, burst)', txt: 'The pressure (and burst flag) go to the server, where cross-sensor and night-flow analytics detect and localise leakage.' },
    ],
  }],

  config: [
    'Configure pressure transducers and sampling (fast enough for transients), and DMA inflow metering.',
    'Set up server-side baselines, night windows, thresholds and localisation.',
    'Configure LoRa/cellular reporting and battery/solar supervision.',
    'Integrate consumption data for non-revenue-water quantification.',
  ],
  calibration: [
    { h: 'Pressure', p: [
      'Calibrate transducers against a reference; verify readings across the network.',
    ] },
    { h: 'Baselines/night', p: [
      'Establish healthy pressure baselines and typical night flows so anomalies stand out.',
    ] },
    { h: 'Localisation', p: [
      'Validate localisation against known leaks/bursts; adjust density/model as needed.',
    ] },
  ],
  testing: [
    { step: 'Baseline a healthy district', expect: 'Stable pressures; low night flow' },
    { step: 'Induce/observe a leak', expect: 'Higher night flow / local pressure depression; localised to the district' },
    { step: 'Simulate a burst', expect: 'Pressure transient flagged; node reports quickly' },
    { step: 'Compute NRW (inflow vs consumption)', expect: 'Loss quantified per district' },
    { step: 'Dispatch acoustic gear', expect: 'Exact leak pinpointed in the localised area' },
    { step: 'Solar/battery cycle', expect: 'Nodes report over a season; supervision works' },
  ],
  output: [
    'The platform maps district pressures and night flows, flags/localises leakage, quantifies non-revenue water, and prioritises repairs; bursts alert quickly.',
    { file: 'pressure.json', lang: 'json', body: `{
  "node": 7,
  "bar": 2.9,
  "burst": 0
}` },
    'Node 7\'s pressure feeds analytics that, with its neighbours and the DMA night flow, localise leakage to a district and quantify it — directing a crew with acoustic gear to the right stretch instead of the whole city.',
  ],
  troubleshoot: [
    { sym: 'Leaks not localised', cause: 'Too few sensors / no model', fix: 'Increase sensor density; baseline a healthy model; use night analysis' },
    { sym: 'Daytime data misleading', cause: 'Demand masks leakage', fix: 'Analyse minimum night flow when legitimate demand is near zero' },
    { sym: 'NRW not quantified', cause: 'No district metering', fix: 'Meter inflow vs consumption per DMA' },
    { sym: 'Bursts missed', cause: 'Sampling too slow', fix: 'Sample fast enough for transients; report bursts immediately' },
    { sym: 'Nodes die', cause: 'Battery/power', fix: 'Battery + LoRa/cellular + solar; deep sleep; supervise' },
  ],

  iot: {
    protoShort: 'LoRa/cellular → leakage-analytics platform',
    net: {
      nodes: [{ name: 'Pressure node', sub: 'ESP32' }, { name: 'DMA meter', sub: 'inflow' }],
      protocol: 'LoRa / cellular', gateway: 'City gateway', gatewaySub: 'to server',
      uplink: 'MQTT', cloud: 'Leakage platform', cloudSub: 'pressure + NRW',
      clients: [{ name: 'Dashboard', sub: 'leak map' }, { name: 'Crews', sub: 'localise + pinpoint' }],
    },
    protocol: ['Nodes report pressure on a cadence (faster on transients); the server runs night-flow and pressure-pattern analytics and district metering to detect, quantify and localise leakage.'],
    topics: [
      { t: 'water/node/<id>/pressure', dir: 'node → server', payload: 'pressure, burst flag' },
      { t: 'water/dma/<id>/flow', dir: 'meter → server', payload: 'inflow (NRW)' },
      { t: 'water/leak/alert', dir: 'server → crews', payload: 'localised leakage + quantity' },
    ],
    cloud: ['A leakage platform maps pressures/flows, detects and localises leaks (night analysis, pressure pattern), quantifies non-revenue water, and prioritises repairs; crews pinpoint with acoustics.'],
    dashboard: ['A network map of pressures/leakage, district NRW, burst alerts, and prioritised repair list.'],
    mobile: ['Burst and leakage alerts with localisation; repair priorities.'],
    security: [
      'Authenticate node data; secure the analytics.',
      'Supervise battery/health; alert on silent nodes.',
      'Combine with acoustic pinpointing for final location.',
    ],
  },

  perf: [
    'Deep-sleep between pressure reads; sample faster on transients.',
    'Run night-flow and pattern analytics on the server; combine with district metering.',
    'Localise to a district/stretch; hand off to acoustics for pinpointing.',
    'Quantify and prioritise by loss.',
  ],
  safety: [
    'Use pressure transducers rated for the main; install safely on live water infrastructure (qualified work).',
    'Pressure analytics localises; final pinpointing needs acoustic correlation gear.',
    'Buried infrastructure has no power/network — design battery + LoRa/cellular for long life.',
    'This is one layer of a leakage-management programme.',
  ],
  maintenance: [
    'Verify transducer calibration and node battery/health.',
    'Update healthy baselines/models as the network changes.',
    'Act on leak alerts; pinpoint and repair; verify loss reduction.',
    'Maintain district metering and consumption data.',
  ],
  future: [
    'Add acoustic/correlating sensors for automated pinpointing.',
    'Add hydraulic modelling for better localisation.',
    'Fuse smart-meter consumption for tighter NRW.',
    'Add pressure management to reduce leakage rates.',
  ],
  faq: [
    { q: 'How can pressure find a buried leak?', a: 'A leak continuously loses water and depresses pressure, so it leaves a signature in the pressure field — a district runs lower and behaves differently, a burst causes a transient, and a persistent local depression points to the leaking area.' },
    { q: 'Why analyse at night?', a: 'During the day, legitimate consumption masks leakage. At night, when almost no one uses water, whatever is still flowing and depressing pressure is essentially leakage — so night flow and night pressure directly measure how much a district leaks.' },
    { q: 'Does it pinpoint the exact leak?', a: 'No — it localises to a district or stretch. The final metres are found by a crew with acoustic correlation gear sent to that area, which is far cheaper than searching the whole network. Analytics narrows it down; acoustics pinpoints.' },
    { q: 'How does it quantify the loss?', a: 'With district metering: comparing the metered inflow to a zone against the legitimate consumption within it. The difference is loss (non-revenue water), which lets you prioritise the biggest-losing districts.' },
    { q: 'Why is this worth doing?', a: 'Utilities lose a fifth to a third of treated water to mostly-hidden leaks. Localising and quantifying that loss lets them fix the biggest leaks first — recovering large amounts of water and money that would otherwise drip away for years.' },
  ],
  refs: [
    { t: 'Non-revenue water', u: 'https://en.wikipedia.org/wiki/Non-revenue_water', s: 'Reference' },
    { t: 'Water leak detection', u: 'https://en.wikipedia.org/wiki/Leak_detection', s: 'Reference' },
    { t: 'District metered areas / minimum night flow', u: 'https://en.wikipedia.org/wiki/Water_metering', s: 'Reference' },
    { t: 'Acoustic leak correlation', u: 'https://en.wikipedia.org/wiki/Acoustic_location', s: 'Reference' },
    { t: 'Pressure management in water networks', u: 'https://en.wikipedia.org/wiki/Water_distribution_system', s: 'Reference' },
  ],
  images: ['city', 'esp32', 'grafana'],
  imageCaptions: [
    'Pressure analytics across the network finds the hidden leaks that waste a third of treated water.',
    'ESP32 pressure nodes report from buried, powerless infrastructure over LoRa/cellular on solar.',
    'Night-flow and pressure-pattern analytics localise and quantify leakage, directing crews to pinpoint it.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   083 — Manhole Safety Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '083',
  domainKey: 'iot',
  emoji: '🕳️', thumb: 'sensor',
  difficulty: 'Advanced',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Watches sewer level and toxic gas inside a manhole — warning of flooding before it hits the street and of the lethal atmosphere before a worker climbs in.',

  overview: [
    'A manhole is two hazards in one hole. As a sewer or drainage access, its <b>level</b> rising toward the surface is an early sign of a blockage or a flood about to back up into streets and homes — caught early, it can be cleared before it overflows. And as a confined space, its <b>atmosphere</b> can be lethal: sewers generate hydrogen sulphide (toxic and, at higher levels, deadly), methane (explosive), carbon monoxide, and oxygen-deficient pockets — and workers die every year entering manholes with a bad atmosphere they could not see. This project monitors both continuously: the level, for flood/blockage early warning, and the toxic gases, for worker and public safety.',
    'The monitor sits in the manhole and senses <b>level</b> (an ultrasonic or pressure sensor tracking how high the water/sewage has risen) and the <b>gases</b> that matter in a sewer — hydrogen sulphide, methane/combustible gas, carbon monoxide, and oxygen level. A rising level trending toward overflow triggers a flood/blockage alert with enough lead time to respond; a dangerous gas concentration triggers a safety alert. Because a manhole is a classic <b>confined space</b>, the gas data does double duty: it feeds a live picture for public/flood safety, and — critically — it can tell a worker (and their supervisor) the atmosphere <i>before</i> anyone descends, complementing the personal gas detector that confined-space entry legally requires.',
    'Manholes are buried, wet, corrosive and without power, so the monitor is battery-powered and reports over LoRa, ruggedised and sealed, with cover-open detection as a bonus (an opened cover may mean unauthorised entry or theft). It is emphatic about scope and safety: this is a monitoring and early-warning aid, <b>not</b> a substitute for the certified, calibrated, personal gas detectors and the confined-space entry procedures that law and life-safety demand — no one should ever enter a manhole relying on a fixed monitor instead of proper detection and procedure. But as a manhole safety monitor, it delivers two genuinely valuable things a city otherwise lacks: early warning of sewer flooding before it reaches the street, and continuous awareness of the toxic atmosphere in a space that kills workers who cannot see the danger.',
  ],
  does: [
    'Monitors manhole/sewer level for flood/blockage early warning',
    'Senses toxic/explosive gases (H₂S, methane, CO) and oxygen level',
    'Alerts on rising level trending toward overflow',
    'Alerts on dangerous gas concentrations',
    'Provides atmosphere awareness before confined-space entry',
    'Detects cover-open (unauthorised entry/theft)',
    'Runs on battery + LoRa from buried, powerless infrastructure',
  ],
  features: [
    'Dual hazard: flood level + toxic atmosphere',
    'Sewer gas sensing (H₂S/CH₄/CO/O₂)',
    'Flood/blockage early warning with lead time',
    'Pre-entry atmosphere awareness (complements personal detectors)',
    'Cover-open detection',
    'Battery + LoRa, rugged/sealed',
    'Explicit: aid, NOT a substitute for certified detectors/procedures',
  ],
  applications: [
    { t: 'Sewer flood/blockage early warning', d: 'Catching rising levels before they back up into streets/homes.' },
    { t: 'Confined-space / worker safety awareness', d: 'Atmosphere awareness before/around manhole entry (with certified detectors and procedures).' },
    { t: 'Utility asset monitoring', d: 'Level, gas and cover status across a network of manholes.' },
    { t: 'Public safety / smart city', d: 'City-wide sewer and drainage safety monitoring.' },
  ],
  skills: [
    'Level sensing (ultrasonic/pressure) in a manhole',
    'Sewer gas sensing (H₂S/CH₄/CO/O₂)',
    'Flood early warning and gas alarming',
    'LoRa + battery for buried infrastructure',
    'Confined-space safety awareness (scope/limits)',
  ],
  prereq: [
    'THIS IS A MONITORING/EARLY-WARNING AID — NOT a substitute for certified, calibrated PERSONAL gas detectors and confined-space entry procedures, which law and life-safety require.',
    'Rising level is early warning of flooding/blockage; gas concentrations are worker/public safety.',
    'Manholes are buried, wet, corrosive, powerless — sensors are battery + LoRa, sealed and rugged.',
    'Never enter a manhole relying on a fixed monitor instead of proper detection and procedure.',
  ],

  parts: ['esp32', 'jsnsr04t', 'mq4', 'co', 'dissolvedo2', 'reed', 'lora', 'li18650'],
  extraParts: [
    { name: 'Sewer gas sensors', spec: 'H₂S, methane/combustible, CO and O₂ sensors (rated for the environment)', qty: 1, price: 1500, note: 'Educational-grade; certified personal detectors required for entry' },
    { name: 'Level sensor', spec: 'Non-contact ultrasonic or hydrostatic level (rated, sealed)', qty: 1, price: 800 },
    { name: 'Cover-open sensor', spec: 'Reed/tilt to detect an opened cover', qty: 1, price: 150 },
    { name: 'Sealed rugged enclosure + LoRa', spec: 'Corrosion/water-proof housing and LoRa; long-life battery', qty: 1, price: 900 },
  ],
  cost: '₹4,500 – ₹7,000',
  libs: ['wifi', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'Level sensor', devPin: 'TRIG/ECHO/AOUT', pin: 'GPIO 26/25/34', sig: 'Sewer level' },
      { dev: 'Gas sensors', devPin: 'AOUT', pin: 'GPIO 35/32/33', sig: 'H₂S/CH₄/CO/O₂' },
      { dev: 'Cover reed', devPin: 'NC', pin: 'GPIO 27', sig: 'Cover open' },
    ],
    right: [
      { dev: 'LoRa', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Alerts/status' },
      { dev: 'Battery', devPin: 'sense', pin: 'ADC', sig: 'Supervision' },
      { dev: 'Local beacon (opt)', devPin: 'IN', pin: 'GPIO 13', sig: 'On-site alarm' },
      { dev: 'Supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Monitor level (non-contact ultrasonic or hydrostatic) for flood/blockage warning and the sewer gases (H₂S, methane, CO, O₂) for safety.',
    'Seal and ruggedise everything against the wet, corrosive sewer environment; use appropriately-rated sensors.',
    'Battery + LoRa — manholes have no power/network; deep-sleep and report on change/schedule for long life.',
    'Add cover-open detection (reed/tilt) to flag an opened cover.',
    'THIS IS AN AID — certified, calibrated personal gas detectors and confined-space procedures are required for any entry, never this fixed monitor alone.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Level', sub: 'flood/blockage', highlight: true },
      { name: 'Gases', sub: 'H₂S/CH₄/CO/O₂' },
      { name: 'Cover', sub: 'open' },
    ] },
    { label: 'Assess', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'level trend / gas' },
    ] },
    { label: 'Alert', edge: 'right', blocks: [
      { name: 'Flood warning', sub: 'lead time' },
      { name: 'Gas/safety', sub: 'atmosphere' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'City map', sub: 'manholes' },
      { name: 'Pre-entry', sub: 'awareness' },
    ] },
  ] },
  flow: [
    { t: 'Wake; read level, gases, cover', k: 'start' },
    { t: 'Level rising toward overflow?', k: 'dec', yes: 'Flood/blockage alert', no: 'Check gas' },
    { t: 'Flood/blockage alert', k: 'io' },
    { t: 'Check gas', k: 'proc' },
    { t: 'Dangerous gas / low O₂?', k: 'dec', yes: 'Safety alert (atmosphere)', no: 'Report status' },
    { t: 'Safety alert (atmosphere)', k: 'io' },
    { t: 'Report status', k: 'io' },
    { t: 'Sleep (faster if alarmed)', k: 'end', back: 'Wake; read level, gases, cover' },
  ],

  principle: [
    'A manhole concentrates two very different hazards into one small space, and the monitor addresses both because both are otherwise invisible until it is too late. The first is <b>flooding/blockage</b>: a sewer or drain backing up shows first as a <b>rising level</b> inside the manhole, well before it overflows onto the street or into homes, so watching the level gives early warning with time to clear a blockage or mobilise a response. The second is the <b>lethal atmosphere</b> of a confined space: sewers generate hydrogen sulphide, methane, carbon monoxide and oxygen-deficient pockets, and these gases are odour-fooling and deadly — H₂S in particular deadens the sense of smell at dangerous concentrations, so a worker can climb in unaware. Monitoring both level and gas turns two invisible, high-consequence hazards into observable, alertable conditions.',
    '<b>Flood early warning</b> comes from the level and its <b>trend</b>. A non-contact ultrasonic or hydrostatic sensor tracks how high the water/sewage has risen; a level rising steadily toward the overflow point, especially faster than normal, signals a developing blockage or flood. Alerting on that trend — not just a high mark — gives lead time to act before it reaches the surface, which is the difference between a cleared blockage and a flooded street.',
    'The <b>atmosphere</b> side senses the gases that matter in a sewer — <b>H₂S</b> (toxic), <b>methane/combustible</b> (explosive), <b>CO</b>, and <b>oxygen</b> level — and alarms on dangerous concentrations. This data serves public/flood safety, but its most important role is around <b>confined-space entry</b>: it can tell a worker and their supervisor what the atmosphere is <i>before</i> anyone descends, and monitor it while work happens. Here the design draws an emphatic line: continuous atmosphere awareness is a valuable <b>complement</b> to, but never a <b>substitute</b> for, the certified, calibrated <b>personal gas detector</b> each worker must carry and the <b>confined-space entry procedures</b> (ventilation, permit, standby, rescue plan) that law and life-safety require. No one should ever enter relying on a fixed monitor instead of proper detection and procedure — the monitor informs and warns; it does not certify a space safe to enter.',
    'The deployment realities and honest scope complete it. Manholes are <b>buried, wet, corrosive and powerless</b>, so the monitor is battery-powered, reports over <b>LoRa</b>, and is sealed and ruggedised for the environment, deep-sleeping and reporting on change/schedule for long life; <b>cover-open detection</b> adds a flag for unauthorised entry or cover theft. And the scope is stated plainly and repeatedly: this is a <b>monitoring and early-warning aid</b> — for flooding, and for atmosphere awareness — not a certified safety instrument and not a replacement for the personal detectors and procedures that confined-space work legally and morally demands. Within that frame, it delivers two things a city otherwise lacks and that genuinely save property and lives: warning of sewer flooding before it hits the street, and continuous awareness of a toxic atmosphere in a space that kills the workers who cannot see the danger.',
  ],
  equations: [
    { t: 'Flood/blockage early warning', eq: 'Level L rising toward the overflow point L_of:\n\n  alert if L > L_warn OR dL/dt > R_warn (rising fast)\n  time_to_overflow ≈ (L_of − L) / (dL/dt)\n\nEarly warning with lead time to clear a blockage/respond.' },
    { t: 'Gas / atmosphere safety', eq: 'Alarm on dangerous concentrations:\n\n  H2S > exposure limit (toxic; deadly higher)\n  CH4 > %LEL alarm (explosive)\n  CO  > exposure limit\n  O2  < 19.5% (deficient) or > 23.5%\n\nAtmosphere AWARENESS — NOT a substitute for personal\ndetectors + confined-space procedures for entry.' },
    { t: 'Cover-open + battery life', eq: 'cover_open from reed/tilt → flag (unauthorised entry/theft)\n\nBuried + powerless → battery + LoRa:\n  deep-sleep; report on change/schedule; faster if alarmed.' },
  ],

  assembly: [
    { h: 'Deploy sealed, rugged sensing', p: [
      'Fit a level sensor (non-contact/hydrostatic) and sewer gas sensors (H₂S/CH₄/CO/O₂), sealed and ruggedised against the wet, corrosive environment, plus a cover-open sensor.',
      'Battery-power with deep sleep and LoRa reporting; supervise the battery.',
    ], warn: 'THIS IS AN AID, NOT a certified detector. Confined-space entry requires certified, calibrated personal gas detectors and proper procedures (ventilation, permit, standby, rescue) — never rely on this fixed monitor for entry safety.' },
    { h: 'Set up alerts', p: [
      'Alert on rising level trending toward overflow (with lead time) and on dangerous gas/low-oxygen concentrations; flag cover-open.',
    ] },
    { h: 'Report and map', p: [
      'Report level/gas/cover status and alerts over LoRa to a city map, with pre-entry atmosphere awareness for authorised workers/supervisors.',
    ] },
  ],
  steps: [
    { h: 'Assess flood and atmosphere', p: [
      'Compute the level trend and time-to-overflow for flood warning, and evaluate gas concentrations for safety, sampling faster when alarmed.',
    ], code: {
      file: 'manhole-assess.ino', lang: 'cpp',
      body: `#define L_OVERFLOW 20.0f     // cm below cover = overflow risk
#define R_WARN 5.0f          // cm/min rising fast

const char* floodCheck(float level, float rate){
  if (level > (100.0f - L_OVERFLOW)) return "level near overflow";
  if (rate > R_WARN) return "level rising fast (blockage?)";
  return nullptr;
}

// Atmosphere AWARENESS (not entry certification).
const char* gasCheck(float h2s, float ch4_lel, float co, float o2){
  if (o2 < 19.5f || o2 > 23.5f) return "oxygen out of range";
  if (h2s > H2S_LIMIT)          return "H2S toxic";
  if (ch4_lel > LEL_ALARM)      return "methane explosive";
  if (co > CO_LIMIT)            return "CO high";
  return nullptr;
}`,
      explain: [
        { ref: 'if (rate > R_WARN) return "level rising fast (blockage?)"', txt: 'A fast-rising level warns of a developing blockage/flood with lead time, before it overflows onto the street.' },
        { ref: 'if (o2 < 19.5f || o2 > 23.5f) return "oxygen out of range"', txt: 'Oxygen deficiency (or enrichment) is a primary confined-space killer and is checked first.' },
        { ref: 'if (h2s > H2S_LIMIT)          return "H2S toxic"', txt: 'Hydrogen sulphide — the classic lethal sewer gas that fools the sense of smell — is alarmed at its toxic limit.' },
        { ref: 'Atmosphere AWARENESS (not entry certification)', txt: 'The comment states the scope in the code: this informs and warns about the atmosphere; it does not certify a space safe to enter, which requires personal detectors and procedures.' },
      ],
    } },
    { h: 'Alert, report and supervise', p: [
      'Raise flood and gas/safety alerts, flag cover-open, report status/alerts over LoRa to a city map, and supervise battery — sampling faster while alarmed.',
    ], tip: 'Always accompany the gas data with a clear statement that entry requires certified personal detectors and confined-space procedures — never this monitor alone.' },
  ],

  code: [{
    file: 'manhole-safety-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Manhole Safety Monitor — ESP32, LoRa, battery (sealed/rugged)

   Monitors sewer LEVEL (flood/blockage early warning) and toxic/
   explosive GASES + oxygen (worker/public safety awareness), plus
   cover-open. AN AID — NOT a substitute for certified personal gas
   detectors and confined-space entry procedures.
   ══════════════════════════════════════════════════════════════════ */

#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define PIN_TRIG 26
#define PIN_ECHO 25
#define PIN_H2S  35
#define PIN_CH4  32
#define PIN_CO   33
#define PIN_O2   34
#define PIN_COVER 27
#define DEPTH_CM 100.0f
#define NODE_ID 23

Preferences prefs;
RTC_DATA_ATTR float prevLevel = NAN; RTC_DATA_ATTR uint32_t prevMs = 0;

float levelCm(){
  digitalWrite(PIN_TRIG,LOW); delayMicroseconds(2);
  digitalWrite(PIN_TRIG,HIGH); delayMicroseconds(10); digitalWrite(PIN_TRIG,LOW);
  long us=pulseIn(PIN_ECHO,HIGH,30000);
  if(!us) return NAN;
  return DEPTH_CM - us/58.0f;                    // water height
}
float gas(int pin, float fs){ long s=0; for(int i=0;i<32;i++) s+=analogRead(pin);
  return (s/32.0f)/4095.0f*fs; }

void report(float lvl,float h2s,float ch4,float co,float o2,bool cover,
            const char* flood,const char* gasAlert){
  LoRa.beginPacket();
  LoRa.printf("{\\"mh\\":%d,\\"level\\":%.0f,\\"h2s\\":%.1f,\\"ch4_lel\\":%.0f,"
              "\\"co\\":%.0f,\\"o2\\":%.1f,\\"cover_open\\":%d,"
              "\\"flood\\":\\"%s\\",\\"gas\\":\\"%s\\"}",
              NODE_ID, lvl, h2s, ch4, co, o2, cover?1:0,
              flood?flood:"none", gasAlert?gasAlert:"none");
  LoRa.endPacket();
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_TRIG,OUTPUT); pinMode(PIN_ECHO,INPUT); pinMode(PIN_COVER,INPUT_PULLUP);
  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6); LoRa.setSpreadingFactor(10);

  float lvl = levelCm();
  uint32_t now = millis();
  float rate = (!isnan(prevLevel)&&prevMs)? (lvl-prevLevel)/((now-prevMs)/60000.0f):0;
  prevLevel=lvl; prevMs=now;

  float h2s=gas(PIN_H2S,H2S_FS), ch4=gas(PIN_CH4,100), co=gas(PIN_CO,CO_FS),
        o2=gas(PIN_O2,25);
  bool cover = digitalRead(PIN_COVER)==HIGH;

  const char* flood = (lvl > 80.0f) ? "near overflow" :
                      (rate > 5.0f) ? "rising fast" : nullptr;
  const char* gasAlert = (o2<19.5f||o2>23.5f)?"oxygen out of range":
                         (h2s>H2S_LIMIT)?"H2S toxic":
                         (ch4>LEL_ALARM)?"methane explosive":
                         (co>CO_LIMIT)?"CO high":nullptr;

  report(lvl,h2s,ch4,co,o2,cover,flood,gasAlert);

  bool alarmed = flood || gasAlert || cover;
  esp_sleep_enable_timer_wakeup((uint64_t)(alarmed?120:900)*1000000ULL);
  esp_deep_sleep_start();
}
void loop(){}`,
    explain: [
      { ref: 'float rate = ... (lvl-prevLevel)/((now-prevMs)/60000.0f)', txt: 'The level\'s rate of rise (persisted across sleep) gives flood/blockage early warning before the level actually reaches overflow.' },
      { ref: 'const char* gasAlert = (o2<19.5f||o2>23.5f)?"oxygen out of range":', txt: 'The atmosphere is evaluated for the sewer killers — oxygen deficiency, H₂S, methane, CO — as safety awareness.' },
      { ref: 'bool cover = digitalRead(PIN_COVER)==HIGH', txt: 'A cover-open flag catches unauthorised entry or cover theft alongside the environmental hazards.' },
      { ref: 'esp_sleep_enable_timer_wakeup((uint64_t)(alarmed?120:900)', txt: 'The node deep-sleeps for long battery life but samples faster when a flood or gas hazard is present.' },
      { ref: 'AN AID — NOT a substitute for certified personal gas detectors', txt: 'The header states the scope: entry safety requires certified personal detectors and confined-space procedures, never this fixed monitor.' },
    ],
  }],

  config: [
    'Configure level sensing and the overflow/rate thresholds, and the gas sensors and safety limits (H₂S/CH₄/CO/O₂).',
    'Configure cover-open detection, LoRa reporting and battery supervision.',
    'Set faster sampling when alarmed and the city-map integration.',
    'State the scope clearly: aid, not a substitute for certified detectors/procedures.',
  ],
  calibration: [
    { h: 'Level', p: [
      'Calibrate the level scale and overflow point; verify the rate-of-rise warning.',
    ] },
    { h: 'Gas', p: [
      'Understand these are educational-grade sensors; set conservative safety limits and test response. Certified personal detectors are required for entry.',
    ] },
    { h: 'Battery/report', p: [
      'Verify long battery life with deep sleep and faster-when-alarmed reporting.',
    ] },
  ],
  testing: [
    { step: 'Raise the level toward overflow', expect: 'Flood/blockage early warning with lead time' },
    { step: 'Introduce test gas / low oxygen (safely)', expect: 'Gas/safety alert' },
    { step: 'Open the cover', expect: 'Cover-open flag' },
    { step: 'Alarmed vs quiet', expect: 'Faster sampling when alarmed; long life when quiet' },
    { step: 'Confirm scope in output/UI', expect: 'Clear "aid, not a substitute for personal detectors/procedures" messaging' },
    { step: 'Solar/battery cycle', expect: 'Node reports over a season; supervision works' },
  ],
  output: [
    'The city map shows each manhole\'s level, gas readings, cover status and alerts (flood, gas, cover), with pre-entry atmosphere awareness clearly framed as an aid.',
    { file: 'manhole.json', lang: 'json', body: `{
  "mh": 23,
  "level": 84,
  "h2s": 12.0,
  "ch4_lel": 8,
  "co": 5,
  "o2": 20.6,
  "cover_open": 0,
  "flood": "near overflow",
  "gas": "none"
}` },
    'Manhole 23 near overflow (flood early warning) with a currently-safe atmosphere; a dangerous gas reading would raise a safety alert — but entry always requires certified personal detectors and confined-space procedures, never this monitor alone.',
  ],
  troubleshoot: [
    { sym: 'Flood not caught early', cause: 'Alerting only on high level', fix: 'Use the rate of rise for early warning with lead time' },
    { sym: 'Gas readings drift', cause: 'Sensor ageing/environment', fix: 'Recalibrate; conservative limits; certified personal detectors for entry' },
    { sym: 'Node corrodes/fails', cause: 'Wet/corrosive environment', fix: 'Seal and ruggedise; rated sensors; supervise battery' },
    { sym: 'Treated as entry-safe device', cause: 'Scope misunderstanding', fix: 'It is an AID — entry requires certified detectors and confined-space procedures' },
    { sym: 'Battery dies', cause: 'Reporting too often', fix: 'Deep sleep; report on change/schedule; faster only when alarmed' },
  ],

  iot: {
    protoShort: 'LoRa → city sewer/safety dashboard',
    net: {
      nodes: [{ name: 'Manhole node', sub: 'ESP32' }, { name: 'Other manholes', sub: 'network' }],
      protocol: 'LoRa', gateway: 'City gateway', gatewaySub: 'to dashboard',
      uplink: 'MQTT', cloud: 'Sewer/safety dashboard', cloudSub: 'level + gas',
      clients: [{ name: 'Ops', sub: 'flood/gas alerts' }, { name: 'Crews', sub: 'awareness' }],
    },
    protocol: ['Nodes report level/gas/cover on change/schedule (faster when alarmed); flood and gas/safety alerts publish immediately. Framed as an aid, not entry certification.'],
    topics: [
      { t: 'manhole/<id>/status', dir: 'node → dashboard', payload: 'level, gases, O₂, cover' },
      { t: 'manhole/<id>/alert', dir: 'node → ops', payload: 'flood/blockage / gas / cover-open' },
      { t: 'manhole/<id>/health', dir: 'node → ops', payload: 'battery/supervision' },
    ],
    cloud: ['A dashboard maps manhole level, atmosphere and cover status across the city, raises flood and gas alerts, and provides atmosphere awareness — clearly as an aid, not a substitute for certified detectors/procedures.'],
    dashboard: ['A city map of manhole level/gas/cover, flood/gas alerts, and sensor/battery health.'],
    mobile: ['Flood/blockage and gas/safety alerts; cover-open notifications.'],
    security: [
      'Authenticate node data; supervise battery/health.',
      'Frame gas data as awareness, never entry certification.',
      'Alert on silent nodes.',
    ],
  },

  perf: [
    'Deep-sleep between reads; sample faster when a flood or gas hazard is present.',
    'Persist level state for rate-of-rise across sleep.',
    'Report on change/schedule and alerts immediately.',
    'Supervise battery/health across the network.',
  ],
  safety: [
    'THIS IS A MONITORING/EARLY-WARNING AID — NOT a substitute for certified, calibrated PERSONAL gas detectors and confined-space entry procedures (ventilation, permit, standby, rescue). Never enter relying on a fixed monitor.',
    'Confined spaces and toxic/explosive atmospheres are lethal — H₂S deadens smell; follow the law and life-safety procedures.',
    'Seal/ruggedise for the wet, corrosive environment; use rated sensors.',
    'Provide flood early warning and atmosphere awareness; escalate real hazards to proper procedures.',
  ],
  maintenance: [
    'Recalibrate/replace gas sensors regularly; verify level sensing.',
    'Inspect seals/enclosure for corrosion; supervise battery.',
    'Test alerts and cover-open detection.',
    'Reinforce scope: aid, not a substitute for personal detectors/procedures.',
  ],
  future: [
    'Add flow/rainfall data for better flood prediction.',
    'Add H₂S corrosion monitoring for asset management.',
    'Integrate with confined-space entry management (still requiring personal detectors).',
    'City-wide sewer analytics and predictive maintenance.',
  ],
  faq: [
    { q: 'What two hazards does it cover?', a: 'Flooding/blockage (a rising sewer level backing up toward the street) and the lethal confined-space atmosphere (H₂S, methane, CO, low oxygen). Both are otherwise invisible until too late.' },
    { q: 'Can workers rely on it to enter safely?', a: 'Absolutely not. It is a monitoring and early-warning aid. Confined-space entry legally and morally requires certified, calibrated personal gas detectors and proper procedures (ventilation, permit, standby, rescue). It complements those; it never replaces them.' },
    { q: 'How does it warn of flooding early?', a: 'By watching the level and its rate of rise. A fast-rising level signals a developing blockage or flood before it overflows onto the street, giving lead time to respond.' },
    { q: 'Why is H₂S so dangerous?', a: 'It is toxic and deadly at higher concentrations, and it deadens the sense of smell, so a worker can be overcome without warning. That is exactly why certified personal detection and procedures are mandatory for entry.' },
    { q: 'How does it work in a buried, powerless manhole?', a: 'Battery power, LoRa reporting, deep sleep and a sealed, ruggedised enclosure — reporting on change/schedule and faster when a hazard is present for long life.' },
  ],
  refs: [
    { t: 'Confined space and sewer gas hazards (OSHA)', u: 'https://www.osha.gov/confined-spaces', s: 'OSHA' },
    { t: 'Hydrogen sulphide (H₂S) safety', u: 'https://en.wikipedia.org/wiki/Hydrogen_sulfide', s: 'Reference' },
    { t: 'Sewer gas', u: 'https://en.wikipedia.org/wiki/Sewer_gas', s: 'Reference' },
    { t: 'Manhole / sewer monitoring', u: 'https://en.wikipedia.org/wiki/Manhole', s: 'Reference' },
    { t: 'Gas detection and exposure limits', u: 'https://en.wikipedia.org/wiki/Gas_detector', s: 'Reference' },
  ],
  images: ['city', 'esp32', 'factory'],
  imageCaptions: [
    'A manhole monitor watches sewer level (flood warning) and toxic gas (safety) in one hole.',
    'ESP32 node sensing level trend and H₂S/methane/CO/oxygen, reporting over LoRa on battery.',
    'A monitoring and early-warning aid — never a substitute for certified personal detectors and confined-space procedures.',
  ],
},

];
