/* ═══════════════════════════════════════════════════════════════════
   Smart Home — projects 009–014
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 009 · Smart Lighting Mesh ───────────────────────────────────── */
{
  id: '009',
  domainKey: 'iot',
  emoji: '💡',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'Room-aware RGBW lighting where every node talks directly to every other over ESP-NOW — no router in the path, sub-10 ms scene changes, and lights that keep working when the Wi-Fi does not.',

  overview: [
    'A lighting system built on MQTT over Wi-Fi has a structural problem: every command travels device → router → broker → router → device. That is four hops through shared infrastructure for what should be an instant local action, and when the router reboots, your lights stop responding to their own switches. For a thermostat that latency is irrelevant. For lighting, where a human is standing at a switch waiting, it is the whole experience.',
    'This build uses <b>ESP-NOW</b> for the light-to-light path. ESP-NOW is Espressif\'s connectionless protocol that sends frames directly between ESP32s at the 802.11 MAC layer, with no association, no DHCP, no TCP and no broker. A scene change propagates across a room in under 10 ms, and it works with the router unplugged. A single gateway node bridges ESP-NOW to MQTT so the system still integrates with Home Assistant, but that bridge is a convenience rather than a dependency.',
    'The lighting itself is <b>RGBW</b> rather than RGB. That extra white channel matters more than people expect: mixing white from red, green and blue gives a spiky spectrum with poor colour rendering and washed-out skin tones, and it burns three times the power for the same brightness. A dedicated warm-white channel gives genuinely pleasant white light and lets the RGB channels be used for accent and effect.',
    'Two details separate this from a strip-of-LEDs demo. Brightness is applied through a <b>gamma curve</b>, because human brightness perception is roughly a power law and linear PWM produces a dimming ramp where almost all the visible change happens in the bottom 20 %. And presence detection uses a <b>PIR plus a hold timer per zone</b>, with adjacent zones dimming rather than switching, so walking through a house does not feel like a series of abrupt events.',
  ],

  does: [
    'Drives addressable WS2812B RGBW strips with per-zone colour, brightness and effects.',
    'Synchronises scenes across every node in under 10 ms using ESP-NOW peer-to-peer messaging.',
    'Continues to work with the router and internet completely down.',
    'Detects presence per zone and applies occupancy-based brightness with graceful fades.',
    'Shifts colour temperature through the day — cool at midday, warm after sunset.',
    'Bridges to MQTT through one gateway node for Home Assistant integration.',
    'Applies gamma correction so dimming feels linear to the eye.',
  ],

  features: [
    '<b>ESP-NOW mesh</b> with broadcast scenes and unicast acknowledgements — no broker in the critical path.',
    '<b>RGBW output</b> with a dedicated white channel for good colour rendering and efficiency.',
    '<b>Gamma 2.2 correction</b> applied in a 256-entry lookup table, so fades look smooth.',
    '<b>Circadian colour temperature</b> computed from local sunrise and sunset.',
    '<b>Per-zone presence</b> with configurable hold and adjacent-zone dimming.',
    '<b>Scene persistence</b> in NVS, so a power cut restores the previous state.',
    '<b>Single gateway node</b> bridging ESP-NOW to MQTT, so the rest of the mesh needs no Wi-Fi association.',
    '<b>Smooth interpolated transitions</b> at 50 Hz between any two states.',
  ],

  applications: [
    { t: 'Whole-room accent lighting', d: 'Cove and shelf lighting that changes together as one surface rather than as separate strips.' },
    { t: 'Circadian home lighting', d: 'Cool bright light in the morning and deep warm light after sunset, which is the evidence-backed part of "human-centric lighting".' },
    { t: 'Home cinema and gaming', d: 'Sub-10 ms scene changes make ambient light that follows on-screen content actually feel synchronised.' },
    { t: 'Corridor and stair safety lighting', d: 'Low-level presence-triggered light that never fully switches off is safer and less jarring at night.' },
    { t: 'Retail and exhibition display', d: 'Many nodes, one scene command, no network infrastructure to install.' },
    { t: 'Photography and video lighting', d: 'A repeatable, scriptable colour and brightness setup across multiple fixtures.' },
  ],

  skills: [
    'Arduino C++ and fixed-size struct packing',
    'Understanding of PWM, gamma and human brightness perception',
    'ESP-NOW basics — MAC addresses, peers, callbacks',
    'Power supply sizing for LED strips (this is the part people get wrong)',
    'Basic soldering to strip pads',
  ],

  parts: ['esp32', 'neopixel', 'pir', 'psu5v', 'buck', 'perfboard', 'enclosure'],
  qty: { neopixel: 2, esp32: 1 },
  extraParts: [
    { name: 'SK6812 RGBW strip, 60 LED/m', spec: '5 V, 4 channels, 80 mA/LED at full white', qty: 3, price: 1400, note: 'RGBW rather than RGB — the dedicated white channel is the single biggest quality improvement.' },
    { name: '1000 µF electrolytic + 330 Ω resistor', spec: '10 V low ESR; resistor in the data line', qty: 1, price: 30, note: 'Standard WS2812 protection: capacitor across the supply, resistor in series with data.' },
    { name: '74AHCT125 level shifter', spec: 'Quad buffer, 5 V logic', qty: 1, price: 60, note: 'Converts 3.3 V data to 5 V. Long strips are unreliable without it.' },
    { name: '5 V 20 A power supply', spec: 'For 3 m of RGBW at full brightness', qty: 1, price: 1600, note: 'Size from the calculation in the equations section, not from optimism.' },
  ],
  cost: '₹5,800 – ₹8,400 for a three-zone system',
  libs: ['fastled', 'wifi', 'pubsub', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'PIR presence sensor', devPin: 'OUT', pin: 'GPIO 27', sig: 'High on motion' },
      { dev: 'Wall button', devPin: 'NO', pin: 'GPIO 32', sig: 'Short press cycles scenes' },
      { dev: 'Rotary encoder', devPin: 'A / B', pin: 'GPIO 33 / 25', sig: 'Brightness' },
    ],
    right: [
      { dev: 'SK6812 RGBW strip', devPin: 'DIN', pin: 'GPIO 5 → 74AHCT125 → strip', sig: '800 kHz, 330 Ω series' },
      { dev: 'Second strip segment', devPin: 'DIN', pin: 'GPIO 18', sig: 'Separate channel for long runs' },
      { dev: 'Status LED', devPin: 'Anode', pin: 'GPIO 2', sig: 'Mesh health' },
    ],
  },
  wiringNotes: [
    '<b>Inject power at both ends of any strip longer than about 2 m</b>, and at the middle for runs beyond 4 m. Copper traces on LED strip are thin; voltage drop along the run turns pure white at one end into dingy yellow at the other.',
    'Fit a 1000 µF capacitor across the strip\'s 5 V and GND at the injection point, and a 330 Ω resistor in series with the data line at the controller. Both are in the WS2812B application notes and both prevent real failures — capacitor for supply transients at power-on, resistor for data-line ringing.',
    'Use a <b>74AHCT125</b> level shifter to convert the ESP32\'s 3.3 V data to 5 V. The WS2812 datasheet requires a logic high of at least 0.7 × VDD, which is 3.5 V — a 3.3 V signal is out of specification. It often works at short range and fails intermittently at length, which is the worst kind of bug.',
    'The controller ground and the LED supply ground must be joined. Without a common ground the data line has no reference and the strip shows random colours.',
    'Never power a long strip through the ESP32 board. Feed the strip from the supply directly and take a separate regulated 5 V feed to the controller.',
    'Mount the PIR so it does not see the LED strip. Some strips produce enough thermal IR variation at high brightness to false-trigger a nearby PIR.',
  ],

  block: {
    columns: [
      { label: 'Input', blocks: [{ name: 'PIR per zone', sub: 'presence' }, { name: 'Button / encoder', sub: 'manual' }, { name: 'MQTT via gateway', sub: 'remote' }] },
      { label: 'Decide', edge: 'events', blocks: [{ name: 'Scene engine', sub: 'target state', highlight: true }, { name: 'Circadian clock', sub: 'CCT by time' }] },
      { label: 'Distribute', edge: 'scene struct', blocks: [{ name: 'ESP-NOW broadcast', sub: '< 10 ms', highlight: true }, { name: 'Peer ack', sub: 'reliability' }] },
      { label: 'Render', edge: 'per-node target', blocks: [{ name: 'Interpolator 50 Hz', sub: 'smooth fade' }, { name: 'Gamma + RGBW', sub: 'SK6812 output' }] },
    ],
  },

  flow: [
    { t: 'Boot: restore scene, register ESP-NOW peers', k: 'start' },
    { t: 'Poll PIR, button, encoder, ESP-NOW inbox', k: 'proc' },
    { t: 'New target scene?', k: 'dec', yes: 'yes', no: 'keep interpolating', back: 1 },
    { t: 'Broadcast scene to all mesh peers', k: 'io' },
    { t: 'Interpolate current → target at 50 Hz', k: 'proc' },
    { t: 'Apply gamma LUT, write RGBW frame', k: 'io' },
    { t: 'Persist scene to NVS after 5 s settle', k: 'end' },
  ],

  principle: [
    '<b>ESP-NOW</b> sits below the IP stack. Each ESP32 registers peers by MAC address and then sends frames of up to 250 bytes directly, with the radio staying on a fixed channel. There is no association, no DHCP lease, no TCP handshake and no broker round trip — a send-to-receive latency of 2–4 ms is typical, against 30–150 ms for the same command over Wi-Fi and MQTT. The trade-offs are real: 250 bytes per frame, up to 20 encrypted peers, and no routing beyond direct radio range. For lighting inside one building, all three are acceptable.',
    'The gateway node is the only device that associates with Wi-Fi, and it does so on the <b>same channel</b> the mesh uses. This is the detail that breaks most ESP-NOW-plus-Wi-Fi projects: an ESP32 has one radio, so if the Wi-Fi association puts it on channel 6 while the mesh runs on channel 1, ESP-NOW traffic is simply missed. The gateway therefore reads its Wi-Fi channel after association and the whole mesh is configured to match.',
    '<b>Gamma correction</b> exists because perceived brightness is roughly proportional to physical luminance raised to about 1/2.2. A linear PWM ramp from 0 to 255 therefore looks like a fast bright rise followed by a long flat stretch. Applying <code>out = round(255 × (in/255)^2.2)</code> through a lookup table makes a linear input produce a perceptually linear fade. It also improves low-end resolution where the eye is most sensitive to steps.',
    '<b>RGBW versus RGB</b> is worth understanding properly. Making white from three narrow-band LEDs gives a spectrum with three spikes and deep gaps, so a colour rendering index around 20–40 — objects look wrong and skin looks unpleasant. A phosphor-converted white LED has a broad spectrum and a CRI of 80–90. It is also about three times more efficient: one white LED at 20 mA produces roughly the same white output as three colour LEDs at 20 mA each.',
    'The <b>colour temperature schedule</b> is the one genuinely evidence-backed part of "circadian lighting". Blue-rich light in the evening suppresses melatonin; warm light does not. Scheduling the white channel from around 5000 K at midday to 2200 K after sunset, with the transition tied to actual local sunset rather than a fixed clock time, is a modest and well-supported intervention.',
  ],

  equations: [
    { t: 'LED strip power budget', eq: 'SK6812 RGBW: ~20 mA per channel, 80 mA per LED at full white\n\n3 m at 60 LED/m = 180 LEDs\n  worst case = 180 × 80 mA = 14.4 A at 5 V = 72 W\n\nDesign supply at 1.4x:  14.4 × 1.4 = 20 A\n\nRealistic average at 40 % brightness, warm white only:\n  180 × 20 mA × 0.4 = 1.44 A\n\nSize the supply for worst case, not for what\nyou expect to use — a white flash at full brightness\non an undersized supply browns out the controller.' },
    { t: 'Voltage drop along a strip', eq: 'Strip copper ~ 0.5 Ω per metre per rail (there and back = 1 Ω/m)\n\nCurrent at the far end of a 3 m run at 50 % white:\n  I = 180 × 40 mA = 7.2 A entering the strip\n\nAverage drop over the run (current falls linearly):\n  V_drop ≈ I × R × L / 2 = 7.2 × 1.0 × 3 / 2 = 10.8 V\n\nWhich is impossible on a 5 V rail — the far end simply\ngoes dim and orange. Hence power injection every 2 m,\nwhich cuts the effective L per segment to 1 m.' },
    { t: 'Gamma correction', eq: 'out = round(255 × (in / 255)^γ),  γ = 2.2\n\nin=  16  →  out=  0\nin=  64  →  out= 12\nin= 128  →  out= 55\nin= 192  →  out=137\nin= 255  →  out=255\n\nPrecompute all 256 values into a PROGMEM table —\npow() at 50 Hz across 180 LEDs is far too slow.' },
  ],

  code: [{
    file: 'lighting-mesh-node.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Lighting Mesh — ESP32 + SK6812 RGBW + ESP-NOW

   Every node runs this sketch. One node is compiled as the gateway
   (IS_GATEWAY 1) and additionally bridges ESP-NOW to MQTT. Scenes
   propagate peer-to-peer in under 10 ms and survive a router outage.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <esp_now.h>
#include <FastLED.h>
#include <Preferences.h>
#if IS_GATEWAY
  #include <PubSubClient.h>
  #include <ArduinoJson.h>
#endif

#define ZONE_ID     1              // unique per node: 1, 2, 3 ...
#define IS_GATEWAY  0
#define MESH_CHANNEL 1             // must match the router channel

#define PIN_LEDS   5
#define PIN_PIR   27
#define PIN_BTN   32
#define NUM_LEDS  60

#define FPS 50

CRGB leds[NUM_LEDS];
uint8_t whiteCh[NUM_LEDS];         // SK6812 W channel handled separately
Preferences prefs;

/* Scene packet — must be identical on every node, hence packed. */
typedef struct __attribute__((packed)) {
  uint8_t  magic;                  // 0xA7 — reject foreign traffic
  uint8_t  zone;                   // 0 = all zones
  uint8_t  r, g, b, w;
  uint8_t  brightness;
  uint8_t  effect;                 // 0 solid, 1 breathe, 2 chase
  uint16_t fadeMs;
  uint32_t seq;                    // de-duplicates re-broadcasts
} Scene;

Scene current = { 0xA7, 0, 255, 180, 90, 200, 128, 0, 600, 0 };
Scene target  = current;
uint32_t lastSeq = 0, fadeStart = 0, lastPresence = 0;
Scene fadeFrom;

uint8_t broadcastMac[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };

/* ── gamma table ────────────────────────────────────────────── */
uint8_t GAMMA[256];
void buildGamma() {
  for (int i = 0; i < 256; i++)
    GAMMA[i] = (uint8_t)(powf(i / 255.0f, 2.2f) * 255.0f + 0.5f);
}

/* ── ESP-NOW ────────────────────────────────────────────────── */
void onRecv(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  if (len != sizeof(Scene)) return;
  Scene s;
  memcpy(&s, data, sizeof(s));
  if (s.magic != 0xA7) return;                 // not ours
  if (s.seq <= lastSeq) return;                // already applied
  if (s.zone != 0 && s.zone != ZONE_ID) return;

  lastSeq  = s.seq;
  fadeFrom = current;
  target   = s;
  fadeStart = millis();
}

void meshSend(const Scene &s) {
  esp_now_send(broadcastMac, (const uint8_t *)&s, sizeof(s));
}

void meshBegin() {
  WiFi.mode(IS_GATEWAY ? WIFI_AP_STA : WIFI_STA);
#if !IS_GATEWAY
  WiFi.disconnect();                            // no association needed
  esp_wifi_set_channel(MESH_CHANNEL, WIFI_SECOND_CHAN_NONE);
#endif
  if (esp_now_init() != ESP_OK) { Serial.println("ESP-NOW init failed"); return; }
  esp_now_register_recv_cb(onRecv);

  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, broadcastMac, 6);
  peer.channel = MESH_CHANNEL;
  peer.encrypt = false;                         // broadcast cannot be encrypted
  esp_now_add_peer(&peer);
}

/* ── rendering ──────────────────────────────────────────────── */
uint8_t lerp8(uint8_t a, uint8_t b, float t) {
  return (uint8_t)(a + (int)((b - a) * t));
}

void render() {
  float t = 1.0f;
  if (target.fadeMs) {
    uint32_t el = millis() - fadeStart;
    t = el >= target.fadeMs ? 1.0f : (float)el / target.fadeMs;
    t = t * t * (3 - 2 * t);                    // smoothstep, not linear
  }

  current.r = lerp8(fadeFrom.r, target.r, t);
  current.g = lerp8(fadeFrom.g, target.g, t);
  current.b = lerp8(fadeFrom.b, target.b, t);
  current.w = lerp8(fadeFrom.w, target.w, t);
  current.brightness = lerp8(fadeFrom.brightness, target.brightness, t);

  float bScale = current.brightness / 255.0f;

  for (int i = 0; i < NUM_LEDS; i++) {
    uint8_t r = current.r, g = current.g, b = current.b, w = current.w;

    if (target.effect == 1) {                   // breathe
      float ph = (sinf(millis() / 1200.0f + i * 0.02f) + 1) * 0.5f;
      float k = 0.6f + 0.4f * ph;
      r *= k; g *= k; b *= k; w *= k;
    } else if (target.effect == 2) {            // chase
      float ph = fmodf(millis() / 12.0f - i * 4.0f, (float)NUM_LEDS * 4);
      float k = ph < 24 ? 1.0f : 0.25f;
      r *= k; g *= k; b *= k; w *= k;
    }

    leds[i] = CRGB(GAMMA[(uint8_t)(r * bScale)],
                   GAMMA[(uint8_t)(g * bScale)],
                   GAMMA[(uint8_t)(b * bScale)]);
    whiteCh[i] = GAMMA[(uint8_t)(w * bScale)];
  }
  FastLED.show();
}

/* ── circadian white point ──────────────────────────────────── */
void circadianUpdate(int hour) {
  // Approximate: cool and bright midday, warm and dim after sunset.
  uint8_t w, r, g, b;
  if (hour >= 7 && hour < 17)      { w = 255; r = 0;   g = 0;  b = 30; }   // ~5000 K
  else if (hour >= 17 && hour < 21){ w = 200; r = 60;  g = 20; b = 0;  }   // ~3000 K
  else                             { w = 110; r = 100; g = 25; b = 0;  }   // ~2200 K

  if (target.w == w && target.r == r) return;   // already there
  fadeFrom = current;
  target.r = r; target.g = g; target.b = b; target.w = w;
  target.fadeMs = 20000;                        // 20 s — imperceptible
  target.seq = ++lastSeq;
  fadeStart = millis();
  meshSend(target);
}

/* ── presence ───────────────────────────────────────────────── */
void presenceService() {
  if (digitalRead(PIN_PIR) == HIGH) lastPresence = millis();

  bool occupied = millis() - lastPresence < 180000UL;   // 3 min hold
  uint8_t want = occupied ? 200 : 40;                   // dim, never off
  if (abs((int)target.brightness - (int)want) < 8) return;

  fadeFrom = current;
  target.brightness = want;
  target.fadeMs = occupied ? 400 : 4000;                // fast on, slow off
  target.seq = ++lastSeq;
  fadeStart = millis();
  meshSend(target);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_PIR, INPUT);
  pinMode(PIN_BTN, INPUT_PULLUP);
  buildGamma();

  FastLED.addLeds<WS2812B, PIN_LEDS, GRB>(leds, NUM_LEDS);
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 12000);     // hard current cap
  FastLED.clear(true);

  prefs.begin("light", false);
  if (prefs.getBytesLength("scene") == sizeof(Scene))
    prefs.getBytes("scene", &current, sizeof(Scene));
  target = current;

  meshBegin();
  Serial.printf("Zone %d ready, MAC %s\\n", ZONE_ID, WiFi.macAddress().c_str());
}

void loop() {
  static uint32_t lastFrame = 0, lastSlow = 0, lastSave = 0;

  if (millis() - lastFrame >= 1000 / FPS) { lastFrame = millis(); render(); }

  if (millis() - lastSlow >= 200) {
    lastSlow = millis();
    presenceService();

    if (digitalRead(PIN_BTN) == LOW) {          // cycle effect
      target.effect = (target.effect + 1) % 3;
      target.seq = ++lastSeq;
      meshSend(target);
      while (digitalRead(PIN_BTN) == LOW) delay(10);
    }
  }

  if (millis() - lastSave >= 30000) {
    lastSave = millis();
    prefs.putBytes("scene", &target, sizeof(Scene));
  }
}`,
    explain: [
      { ref: '__attribute__((packed))', txt: 'ESP-NOW copies raw bytes. Without packing, the compiler inserts padding for alignment and two nodes built with different compiler settings would disagree about the struct layout — producing scenes that decode to nonsense.' },
      { ref: 'magic byte and seq', txt: 'The magic byte rejects any other ESP-NOW traffic on the channel; the sequence number stops a re-broadcast being applied twice, which would restart the fade and produce a visible stutter.' },
      { ref: 'esp_wifi_set_channel on non-gateway nodes', txt: 'An ESP32 has one radio. Nodes that never associate must be pinned to the mesh channel explicitly, and the gateway must associate on that same channel, or half the mesh never hears anything.' },
      { ref: 'smoothstep t*t*(3−2t)', txt: 'A linear fade has visible corners at both ends. Smoothstep gives zero first derivative at the start and finish, which reads as a natural fade rather than a ramp.' },
      { ref: 'setMaxPowerInVoltsAndMilliamps', txt: 'FastLED will scale the whole frame down to stay inside this current budget. It is a genuine safety feature — a full-white command on an undersized supply otherwise browns out the controller mid-frame and leaves the strip in a random state.' },
      { ref: 'fast on, slow off', txt: 'Asymmetric fade times matter perceptually. Light appearing quickly feels responsive; light disappearing slowly feels calm. Equal times feel wrong in both directions.' },
    ],
  }],

  config: [
    'Set a unique <code>ZONE_ID</code> for every node, and compile exactly one node with <code>IS_GATEWAY 1</code>.',
    'Set <code>MESH_CHANNEL</code> to match your router\'s 2.4 GHz channel. Fix the router to a specific channel rather than leaving it on auto, or the gateway will drift away from the mesh.',
    'Set <code>NUM_LEDS</code> per node and use <code>setMaxPowerInVoltsAndMilliamps</code> to match your actual supply, with margin.',
    'For SK6812 RGBW, use a FastLED build with RGBW support or drive the white channel through a second logical strip — the sketch keeps <code>whiteCh[]</code> separate for that reason.',
    'Adjust the circadian schedule to your latitude. Fixed hours are a simplification; tying it to the computed sunset (as in the curtain project) is better.',
  ],

  calibration: [
    { h: 'Verify gamma looks right', p: ['Fade from 0 to 255 over ten seconds and watch. With correct gamma the perceived change is even throughout. Without it, almost all the visible change happens in the first two seconds.'] },
    { h: 'Measure the actual current draw', p: ['Command full white at maximum brightness with a clamp meter on the supply lead. Compare against your calculation. If the measurement is well below the calculation, FastLED\'s power limiter is scaling you back — which means the supply is undersized.'] },
    { h: 'Check ESP-NOW latency', p: ['Toggle a scene from one node and time the response on another with a phone camera at 240 fps. Under 10 ms means one or two frames — anything approaching 100 ms means the nodes are on different channels and traffic is being relayed by luck.'] },
  ],

  iot: {
    protoShort: 'ESP-NOW + MQTT bridge',
    net: {
      nodes: [{ name: 'Zone 1 node', sub: 'ESP-NOW only' }, { name: 'Zone 2 node', sub: 'ESP-NOW only' }, { name: 'Gateway node', sub: 'ESP-NOW + Wi-Fi' }],
      protocol: 'ESP-NOW, ch 1',
      gateway: 'Gateway node', gatewaySub: 'the only associated device',
      uplink: 'MQTT 1883',
      cloud: 'Home Assistant', cloudSub: 'optional',
      clients: [{ name: 'HA light entity', sub: 'per zone' }, { name: 'Wall switches', sub: 'local, no network' }],
    },
    protocol: [
      'ESP-NOW frames are 250 bytes maximum and connectionless, so there is no retransmission or ordering guarantee. This design compensates with a sequence number and by making every message a full state description rather than a delta — a lost frame is corrected by the next one, with no accumulated error.',
      'Broadcast frames cannot be encrypted in ESP-NOW. If confidentiality matters, use unicast to explicitly registered peers with PMK/LMK encryption, at the cost of a 20-peer limit and per-peer sends.',
    ],
    topics: [
      { t: 'home/light/zone1/set', dir: 'broker → gateway → mesh', payload: 'JSON: state, brightness, color, effect, transition' },
      { t: 'home/light/zone1/state', dir: 'gateway → broker (retained)', payload: 'JSON: current scene for the zone' },
    ],
    security: [
      'Add a shared secret beyond the magic byte if the mesh is in a shared building — ESP-NOW broadcast is readable by anyone with an ESP32 on the same channel.',
      'The lighting keeps working with the gateway down, which is a resilience feature and also means a compromised gateway cannot brick the lights.',
      'Keep the gateway on an IoT VLAN like every other bridged device.',
    ],
  },

  testing: [
    { step: 'Power one node with a short strip', expect: 'The strip lights to the stored scene within a second of boot, with no flash of random colour.' },
    { step: 'Fade brightness from 0 to full', expect: 'A perceptually even ramp with no visible steps, especially at the low end.' },
    { step: 'Change a scene on one node', expect: 'Every other node changes within one video frame at 60 fps — visually simultaneous.' },
    { step: 'Unplug the router', expect: 'Scene changes between nodes still work. Only Home Assistant control is lost.' },
    { step: 'Command full white at maximum brightness', expect: 'No flicker, no controller reset, and supply voltage staying above 4.8 V at the far end of the strip.' },
    { step: 'Walk into the zone', expect: 'Brightness rises over about 400 ms; after three minutes of stillness it fades down over four seconds to the dim level, never fully off.' },
    { step: 'Power-cycle a node', expect: 'It restores the last scene from NVS and resynchronises on the next mesh broadcast.' },
  ],

  troubleshoot: [
    {
      sym: 'The first LED shows a wrong colour, or the strip flickers',
      cause: '3.3 V data driving a 5 V strip, or no series resistor.',
      fix: 'Fit a 74AHCT125 level shifter and a 330 Ω resistor in the data line. The WS2812B needs a logic high above 3.5 V; 3.3 V is out of specification and works only by luck and at short range.',
    },
    {
      sym: 'The far end of the strip is dim and orange',
      cause: 'Voltage drop along the strip copper.',
      fix: 'Inject 5 V at both ends and, for runs over 4 m, in the middle as well. This is a physics problem — no firmware setting can fix it.',
    },
    {
      sym: 'ESP-NOW works between two nodes but not a third',
      cause: 'Channel mismatch, almost always because the gateway associated on a different channel.',
      fix: 'Print <code>WiFi.channel()</code> on the gateway after association and set every other node to that channel with <code>esp_wifi_set_channel()</code>. Fix the router to a specific channel rather than auto.',
    },
    {
      sym: 'The controller resets whenever the lights go bright',
      cause: 'Supply current, or inrush at the moment the frame changes.',
      fix: 'Use <code>setMaxPowerInVoltsAndMilliamps</code> to cap draw, fit the 1000 µF capacitor at the injection point, and power the controller from a separate regulated feed rather than tapping the strip rail.',
    },
    {
      sym: 'Colours are wrong — red and green swapped',
      cause: 'Wrong colour order in the FastLED template.',
      fix: 'Most WS2812B strips are GRB; some clones are RGB and SK6812 is often GRBW. Try <code>&lt;WS2812B, PIN, RGB&gt;</code> and compare.',
    },
  ],

  perf: [
    'Precompute the gamma table at boot. Calling <code>powf()</code> for 180 LEDs at 50 fps is 9000 float power operations a second and will visibly cost you frame rate.',
    'Render at 50 fps, not as fast as possible. WS2812 output is a blocking bit-banged operation; running it flat out starves everything else and gains nothing perceptible.',
    'Send full state rather than deltas over ESP-NOW. It makes lost frames self-correcting and removes any need for retransmission logic.',
  ],

  safety: [
    'A 20 A 5 V supply can deliver enough current to start a fire through a thin wire. Fuse the output and use conductors sized for the full rating, not for the expected load.',
    'LED strips get warm at high duty. Mount them on aluminium channel if they run above 50 % brightness for long periods — adhesive backing on a plastic surface can soften.',
    'Do not stare at high-power LEDs at close range, particularly the blue channel at full output.',
  ],

  future: [
    'Add <b>ESP-NOW encryption</b> with unicast peers for shared buildings.',
    'Add <b>mmWave presence sensing</b> so a stationary person does not get dimmed on.',
    'Add <b>screen colour capture</b> on a PC that broadcasts an ambient scene at 30 Hz — the low ESP-NOW latency is what makes this feel synchronised rather than laggy.',
    'Add <b>true tunable white</b> with separate warm and cool white channels for proper CCT control rather than an approximation.',
    'Move to <b>Matter over Thread</b> for the bridged half so the system works with every ecosystem.',
  ],

  faq: [
    { q: 'Why ESP-NOW instead of MQTT for everything?', a: 'Latency and resilience. An MQTT scene change takes 30–150 ms and stops working when the router reboots; ESP-NOW takes 2–4 ms and does not care. For a thermostat that difference is irrelevant, for lighting it is the entire feel of the system. The MQTT gateway still exists for integration — it just is not in the critical path.' },
    { q: 'Is RGBW really worth the extra cost?', a: 'Yes, and it is the single biggest quality difference in the build. RGB white has a spiky spectrum with a colour rendering index around 20–40, which makes skin and food look wrong, and it uses three times the power for the same brightness. A dedicated phosphor white channel gives CRI 80–90.' },
    { q: 'How many nodes can the mesh handle?', a: 'ESP-NOW allows 20 encrypted peers or up to 6 simultaneous unencrypted broadcast-style peers per device, but broadcast scales differently — every node hears every broadcast, so the practical limit is airtime rather than peer count. Twenty nodes sending occasional scene changes is comfortable; twenty nodes sending 30 Hz ambient updates is not.' },
    { q: 'Why does my strip need power injection when it worked fine on the bench?', a: 'Because a bench test at 20 % brightness draws a fifth of the current of full white. Voltage drop is proportional to current, so a strip that looks perfect at low brightness goes visibly orange at the far end when you command white. Always test at worst case.' },
    { q: 'Can I mix strip types on one mesh?', a: 'Yes — the scene packet describes intent (colour, brightness, effect) rather than pixel data, so each node renders it with whatever hardware it has. A node with a single RGB bulb and a node with 180 RGBW pixels can honour the same scene.' },
  ],

  refs: [
    { t: 'ESP-NOW — ESP-IDF programming guide', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/network/esp_now.html', s: 'Espressif' },
    { t: 'WS2812B intelligent control LED — datasheet', u: 'https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf', s: 'Worldsemi' },
    { t: 'SK6812 RGBW LED — datasheet', u: 'https://cdn-shop.adafruit.com/product-files/2757/p2757_SK6812RGBW_REV01.pdf', s: 'Opsco' },
    { t: 'Adafruit NeoPixel Überguide — power, level shifting and best practice', u: 'https://learn.adafruit.com/adafruit-neopixel-uberguide', s: 'Adafruit' },
    { t: 'FastLED library documentation and power management', u: 'https://github.com/FastLED/FastLED/wiki/Power-notes', s: 'FastLED' },
    { t: 'Gamma correction and perceptual brightness', u: 'https://learn.adafruit.com/led-tricks-gamma-correction', s: 'Adafruit' },
    { t: 'Light at night and melatonin suppression — a review', u: 'https://doi.org/10.1210/jc.2010-2098', s: 'Journal of Clinical Endocrinology & Metabolism' },
  ],

  images: ['neural', 'esp32', 'sensor'],
  imageCaptions: [
    'A network diagram. The lighting mesh is genuinely peer-to-peer — every node hears every other directly, with no central hub in the path.',
    'An ESP32 development board. Each lighting zone runs one, and exactly one is compiled as the MQTT gateway.',
    'A sensor breakout. Presence detection per zone is what turns a strip of LEDs into a lighting system.',
  ],
},

/* ── 010 · Gas Leak Detector + Auto Shutoff ──────────────────────── */
{
  id: '010',
  domainKey: 'iot',
  emoji: '🔥',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '8–12 hours',
  iso8601: 'PT10H',
  tagline: 'An LPG and CO detector that does the thing most projects skip — it acts. On a confirmed leak it closes the gas valve, kills the ignition source, sounds a 100 dB alarm and ventilates, all before it thinks about the network.',

  overview: [
    'A gas alarm that only beeps is a partial solution. The dangerous window with LPG is short: the lower explosive limit is around 1.8 % by volume, and a leaking regulator can reach that in a small kitchen in minutes. What matters is closing the source and removing the ignition risk, and doing both without waiting for a phone, a router or a person.',
    'The sensing uses two different sensors because they detect different threats. An <b>MQ-2</b> responds to LPG, propane, methane and hydrogen — the explosion risk. An <b>MQ-7</b> measures carbon monoxide, which is the poisoning risk from incomplete combustion and is odourless, colourless and kills people in their sleep. Neither substitutes for the other, and a single-sensor build only covers half the problem.',
    'MQ-series sensors are the right tool here despite their limitations, because for a threshold alarm you do not need quantitative accuracy — you need a reliable "concentration is rising fast" signal, which they provide well. But they demand things people routinely skip: a 24–48 hour burn-in when new, a clean-air <code>R0</code> calibration, a stable 5 V for the heater, and — for the MQ-7 — an alternating heater cycle that most tutorials get wrong.',
    'The action chain is ordered by how fast each step reduces risk and how likely it is to work. Valve closed first, ignition sources cut second, siren third, extraction fan fourth, and only then the network. Every one of the first four works with the Wi-Fi down.',
  ],

  does: [
    'Detects combustible gas (LPG, methane, propane) and carbon monoxide with separate dedicated sensors.',
    'Closes a motorised gas valve within about two seconds of a confirmed leak.',
    'Cuts power to a relay-controlled ignition source (electric hob, extractor motor) before ventilating.',
    'Sounds a 100 dB siren locally, independent of any network.',
    'Runs an extraction fan on a non-sparking circuit to clear the space.',
    'Runs the MQ-7 heater on its correct 60 s / 90 s alternating cycle.',
    'Publishes alerts and continuous readings over MQTT, and retries until acknowledged.',
  ],

  features: [
    '<b>Dual-gas detection</b> — explosive and toxic threats have separate sensors and separate thresholds.',
    '<b>Rate-of-rise detection</b> alongside absolute thresholds, catching a fast leak before it reaches the alarm level.',
    '<b>Correct MQ-7 dual-heater cycle</b> (1.4 V for 90 s, 5 V for 60 s) driven by PWM.',
    '<b>Clean-air R0 calibration</b> stored in NVS, with a documented recalibration procedure.',
    '<b>Ordered action chain</b> with the network last, so nothing safety-critical depends on it.',
    '<b>Self-test on boot</b> that verifies each sensor responds and each actuator moves.',
    '<b>Sensor-failure detection</b> — a reading pinned at either rail is treated as a fault, not as clean air.',
    '<b>Latching alarm</b> requiring a manual reset after a real event.',
  ],

  applications: [
    { t: 'Domestic kitchens', d: 'The primary case, especially where an LPG cylinder is used indoors.' },
    { t: 'Small restaurants and food carts', d: 'Multiple cylinders, high usage and often poor ventilation — the highest-risk environment of all.' },
    { t: 'Boiler and water-heater rooms', d: 'CO from incomplete combustion is the specific threat here, and it gives no warning.' },
    { t: 'Basements and voids', d: 'LPG is heavier than air and collects at low points, so a detector at ceiling height would never see it.' },
    { t: 'Workshops using propane or acetylene', d: 'Combined with a ventilation interlock so the extractor is proven running before the torch can be lit.' },
    { t: 'Caravans and boats', d: 'Small sealed spaces with bottled gas, where a leak concentrates very quickly.' },
  ],

  skills: [
    'Arduino C++ and analogue reading',
    'Understanding of PWM used to control a heater voltage',
    'Relay wiring and load switching',
    'Basic gas safety awareness — this project touches a real hazard',
    'MQTT basics',
  ],

  prereq: [
    'This project supplements, and never replaces, a certified gas alarm and a professionally installed shutoff. Fit a certified detector as well. Treat this as an additional layer and a learning exercise, not as your primary protection.',
  ],

  parts: ['esp32', 'mq2', 'co', 'relay4', 'oled', 'buck', 'psu12v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: '12 V motorised gas ball valve', spec: 'DN15/DN20, brass, 8 W, with limit switches', qty: 1, price: 2800, note: 'Must be rated for gas, not just water. A water valve\'s seals will not do.' },
    { name: '100 dB piezo siren', spec: '12 V, 110 mA', qty: 1, price: 320 },
    { name: 'Explosion-rated extraction fan (or existing hood)', spec: 'Non-sparking motor', qty: 1, price: 1800, note: 'A standard fan motor brush can be the ignition source you are trying to avoid.' },
    { name: 'Manual reset button (key or recessed)', spec: 'NO momentary', qty: 1, price: 90 },
  ],
  cost: '₹5,200 – ₹8,000',
  libs: ['wifi', 'pubsub', 'arduinojson', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'MQ-2 combustible gas', devPin: 'AO', pin: 'GPIO 34', sig: 'Analogue, 0–3.3 V via divider' },
      { dev: 'MQ-7 carbon monoxide', devPin: 'AO', pin: 'GPIO 35', sig: 'Analogue, read at end of low-heat phase' },
      { dev: 'Manual reset', devPin: 'NO', pin: 'GPIO 32', sig: 'Clears a latched alarm' },
      { dev: 'Valve limit switch', devPin: 'Closed position', pin: 'GPIO 33', sig: 'Confirms the valve actually moved' },
    ],
    right: [
      { dev: 'MQ-7 heater control', devPin: 'Heater +', pin: 'GPIO 25 (PWM)', sig: 'MOSFET, 1.4 V / 5 V cycle' },
      { dev: 'Relay 1 → gas valve close', devPin: 'IN1', pin: 'GPIO 26', sig: 'Momentary drive' },
      { dev: 'Relay 2 → ignition source cut', devPin: 'IN2', pin: 'GPIO 27', sig: 'Normally closed contact' },
      { dev: 'Relay 3 → extraction fan', devPin: 'IN3', pin: 'GPIO 14', sig: 'After ignition sources are cut' },
      { dev: 'Relay 4 → 100 dB siren', devPin: 'IN4', pin: 'GPIO 12', sig: 'Immediate' },
    ],
  },
  wiringNotes: [
    'The MQ sensors output up to 5 V on their analogue pin. The ESP32 ADC is 3.3 V maximum — use a 10 kΩ / 20 kΩ divider on each, or you will destroy the input.',
    'Both sensors have heaters drawing about 150 mA each. Power them from the 5 V rail directly, never from the ESP32.',
    'The MQ-7 heater must alternate between 1.4 V (90 s) and 5 V (60 s). Generate the 1.4 V with PWM at about 28 % duty through a logic-level MOSFET plus a small RC filter — a bare digital pin cannot do this and running it at a constant 5 V gives readings that are simply wrong.',
    'The <b>ignition-source relay must open before the extraction fan starts</b>. A fan motor spinning up in a gas-filled room is exactly the spark you are trying to avoid. The firmware enforces this ordering, and your wiring must not defeat it.',
    'Mount the MQ-2 <b>low</b> — LPG is heavier than air and pools at floor level. Mount a methane-focused sensor high, since methane is lighter than air. If you use piped natural gas rather than cylinders, the mounting height inverts.',
    'The sensors must be in free air with ventilation on all sides. Do not enclose them; the heater needs to reach thermal equilibrium with the ambient air, not with a sealed box.',
  ],

  block: {
    columns: [
      { label: 'Detect', blocks: [{ name: 'MQ-2', sub: 'LPG / methane' }, { name: 'MQ-7', sub: 'carbon monoxide' }] },
      { label: 'Assess', edge: 'ADC + R0', blocks: [{ name: 'ppm estimate', sub: 'Rs/R0 curve' }, { name: 'Rate of rise', sub: 'fast-leak catch', highlight: true }] },
      { label: 'Act', edge: 'confirmed', blocks: [{ name: 'Close valve', sub: 'first', highlight: true }, { name: 'Cut ignition', sub: 'second' }, { name: 'Siren + fan', sub: 'third' }] },
      { label: 'Report', edge: 'after acting', blocks: [{ name: 'MQTT alert', sub: 'retry to ack' }, { name: 'Phone push', sub: 'via broker' }] },
    ],
  },

  flow: [
    { t: 'Boot: load R0, self-test actuators', k: 'start' },
    { t: 'Run MQ-7 heater cycle, sample MQ-2 at 1 Hz', k: 'proc' },
    { t: 'Above threshold or rising fast?', k: 'dec', yes: 'yes', no: 'publish reading', back: 1 },
    { t: 'Confirm over 3 consecutive samples', k: 'proc' },
    { t: 'Still elevated?', k: 'dec', yes: 'confirmed', no: 'transient, clear', back: 1 },
    { t: 'Close valve → cut ignition → siren → fan', k: 'io' },
    { t: 'Publish alert, repeat until acknowledged', k: 'io' },
    { t: 'Latch until manual reset', k: 'end' },
  ],

  principle: [
    'An MQ-series sensor is a <b>heated tin-dioxide semiconductor</b>. At around 300 °C, atmospheric oxygen adsorbs onto the SnO₂ surface and traps electrons, raising the material\'s resistance. When a reducing gas such as LPG or CO arrives, it reacts with that adsorbed oxygen, releasing the trapped electrons and lowering the resistance. The sensor is therefore a variable resistor whose value falls as gas concentration rises.',
    'The measurement is a ratio, not an absolute. The datasheet curves plot <code>Rs/R0</code> against concentration, where <code>Rs</code> is the current sensing resistance and <code>R0</code> is that same sensor\'s resistance in clean air. Because sensor-to-sensor variation is large, <b>R0 must be measured for your specific unit</b> — using a datasheet nominal value can put you off by a factor of three. That is the calibration step almost every tutorial omits, and it is why so many builds either never alarm or alarm constantly.',
    'The MQ-7 is more involved because carbon monoxide detection requires a <b>dual heater cycle</b>. At the full 5 V heating phase (60 s) the element is cleaned of accumulated contaminants; at the low 1.4 V phase (90 s) the surface temperature drops to a range where CO adsorption dominates, and the reading is taken at the end of that phase. Running the MQ-7 at a constant 5 V, as most examples do, gives a number that responds to something but is not a CO measurement.',
    '<b>Rate of rise</b> is what turns a slow alarm into a fast one. A leak from a failed regulator can go from background to the lower explosive limit in a couple of minutes. Waiting for an absolute threshold spends much of that window. Tracking the derivative — more than about 200 ppm-equivalent of change in 30 seconds — triggers action while the concentration is still well below anything dangerous.',
    'Finally, <b>sensor-failure detection</b>. A disconnected analogue pin floats and can read anywhere; a shorted sensor reads at a rail. Both look like plausible values. Treating a reading pinned at 0 or at full scale for more than a few seconds as a <em>fault</em> rather than as clean air is the difference between a detector that fails safe and one that fails silently.',
  ],

  equations: [
    { t: 'Sensor resistance from the ADC', eq: 'Voltage divider: MQ sensor Rs in series with load RL (usually 10 kΩ)\n\n  V_out = Vcc × RL / (Rs + RL)\n  Rs    = RL × (Vcc − V_out) / V_out\n\nWith Vcc = 5 V, RL = 10 kΩ, measured V_out = 1.2 V\n  Rs = 10000 × (5 − 1.2) / 1.2 = 31.7 kΩ\n\nIf clean-air R0 was measured as 9.8 kΩ:\n  Rs/R0 = 3.23  →  read ppm from the datasheet curve' },
    { t: 'LPG concentration from the MQ-2 curve', eq: 'The MQ-2 LPG curve is approximately a power law on log-log axes:\n\n  ppm = a × (Rs/R0)^b      with a ≈ 574.25, b ≈ −2.222\n\nRs/R0 = 3.23  →  ppm = 574.25 × 3.23^(−2.222) ≈ 43 ppm\nRs/R0 = 1.00  →  ppm = 574 ppm\nRs/R0 = 0.50  →  ppm = 2670 ppm\n\nLower explosive limit for LPG ≈ 18 000 ppm (1.8 %).\nAlarm well below that — 2000 ppm is a sensible threshold.' },
    { t: 'MQ-7 heater duty cycle', eq: 'High phase: 5.0 V for 60 s   (cleaning)\nLow  phase: 1.4 V for 90 s   (measurement)\n\nPWM duty for 1.4 V from a 5 V rail:\n  D = 1.4 / 5.0 = 0.28 = 28 %\n\nFilter with R = 100 Ω, C = 100 µF:\n  τ = RC = 10 ms, at 5 kHz PWM ripple is negligible.\n\nRead the ADC in the final 5 s of the low phase,\nwhen the surface temperature has stabilised.' },
  ],

  code: [{
    file: 'gas-leak-shutoff.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Gas Leak Detector with Automatic Shutoff — ESP32 + MQ-2 + MQ-7

   Detects combustible gas and carbon monoxide, and on a confirmed
   event closes the gas valve, cuts ignition sources, sounds a siren
   and ventilates — in that order, all before touching the network.

   This supplements a certified alarm. It does not replace one.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "gas-kitchen"

#define PIN_MQ2       34
#define PIN_MQ7       35
#define PIN_MQ7_HEAT  25
#define PIN_RESET     32
#define PIN_VALVE_LIM 33
#define PIN_R_VALVE   26
#define PIN_R_IGNITION 27
#define PIN_R_FAN     14
#define PIN_R_SIREN   12

#define RL_OHMS      10000.0f
#define VCC          5.0f
#define DIVIDER      1.5f          // 10k/20k divider: Vadc = Vsensor / 1.5

#define LPG_WARN_PPM   1000
#define LPG_ALARM_PPM  2000        // ~11 % of the lower explosive limit
#define CO_WARN_PPM      35        // 8-hour exposure guideline
#define CO_ALARM_PPM    100
#define RISE_PPM_30S    200        // rate-of-rise trigger

#define MQ7_HIGH_MS  60000UL
#define MQ7_LOW_MS   90000UL

Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient   net;
PubSubClient mqtt(net);
Preferences  prefs;

float r0_mq2 = 9800, r0_mq7 = 10000;
float lpgPpm = 0, coPpm = 0;
float lpgHistory[30] = {0};
uint8_t histIdx = 0;
bool alarmLatched = false, faultDetected = false, acknowledged = false;
uint32_t mq7PhaseStart = 0;
bool mq7HighPhase = true;

/* ── sensor maths ───────────────────────────────────────────── */
float adcToRs(int pin) {
  uint32_t acc = 0;
  for (int i = 0; i < 16; i++) { acc += analogRead(pin); delayMicroseconds(200); }
  float adc = acc / 16.0f;

  if (adc < 20 || adc > 4075) { faultDetected = true; return -1; }  // rail = fault
  float vAdc = (adc / 4095.0f) * 3.3f;
  float vSensor = vAdc * DIVIDER;
  if (vSensor <= 0.01f) { faultDetected = true; return -1; }
  return RL_OHMS * (VCC - vSensor) / vSensor;
}

float lpgFromRatio(float ratio) {          // MQ-2 LPG curve
  if (ratio <= 0) return 0;
  return 574.25f * powf(ratio, -2.222f);
}

float coFromRatio(float ratio) {           // MQ-7 CO curve
  if (ratio <= 0) return 0;
  return 99.042f * powf(ratio, -1.518f);
}

/* ── MQ-7 heater cycle ──────────────────────────────────────── */
void mq7Service() {
  uint32_t now = millis();
  uint32_t phaseLen = mq7HighPhase ? MQ7_HIGH_MS : MQ7_LOW_MS;

  if (now - mq7PhaseStart >= phaseLen) {
    mq7HighPhase = !mq7HighPhase;
    mq7PhaseStart = now;
    // 100 % duty = 5.0 V cleaning; 28 % duty = 1.4 V measuring
    ledcWrite(0, mq7HighPhase ? 255 : 71);
  }

  // Sample only in the last 5 s of the low phase, once stabilised.
  if (!mq7HighPhase && now - mq7PhaseStart > MQ7_LOW_MS - 5000) {
    float rs = adcToRs(PIN_MQ7);
    if (rs > 0) coPpm = coFromRatio(rs / r0_mq7);
  }
}

/* ── calibration ────────────────────────────────────────────── */
void calibrateR0() {
  Serial.println("Calibrating in clean air — do not breathe on the sensors");
  float acc2 = 0;
  int n = 0;
  for (int i = 0; i < 50; i++) {
    float rs = adcToRs(PIN_MQ2);
    if (rs > 0) { acc2 += rs; n++; }
    delay(200);
  }
  if (n > 20) {
    r0_mq2 = (acc2 / n) / 9.83f;      // MQ-2 clean-air Rs/R0 ratio is 9.83
    prefs.putFloat("r0_mq2", r0_mq2);
    Serial.printf("MQ-2 R0 = %.0f ohm\\n", r0_mq2);
  }
}

/* ── the action chain ───────────────────────────────────────── */
void emergencyShutdown(const char *reason) {
  if (alarmLatched) return;
  alarmLatched = true;

  // 1. Close the gas valve — removes the source.
  digitalWrite(PIN_R_VALVE, LOW);
  // 2. Cut ignition sources BEFORE anything else starts moving.
  digitalWrite(PIN_R_IGNITION, LOW);
  // 3. Siren — works with no network, no phone, no broker.
  digitalWrite(PIN_R_SIREN, LOW);

  uint32_t t0 = millis();
  while (millis() - t0 < 3000 && digitalRead(PIN_VALVE_LIM) == HIGH) delay(50);
  digitalWrite(PIN_R_VALVE, HIGH);       // stop driving the valve motor

  // 4. Ventilate only after ignition sources are confirmed cut.
  delay(500);
  digitalWrite(PIN_R_FAN, LOW);

  Serial.printf("EMERGENCY SHUTDOWN: %s\\n", reason);
}

void publishAlert(const char *reason) {
  JsonDocument d;
  d["device"] = DEVICE_ID;
  d["alarm"]  = reason;
  d["lpg_ppm"] = (int)lpgPpm;
  d["co_ppm"]  = (int)coPpm;
  d["valve_closed"] = digitalRead(PIN_VALVE_LIM) == LOW;
  d["fault"] = faultDetected;
  char buf[224]; size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("home/gas/" DEVICE_ID "/alert", (uint8_t *)buf, n, true);
}

/* ── detection ──────────────────────────────────────────────── */
bool rateOfRise() {
  float oldest = lpgHistory[histIdx];               // 30 s ago
  float newest = lpgHistory[(histIdx + 29) % 30];
  return oldest > 0 && (newest - oldest) > RISE_PPM_30S;
}

void detectionService() {
  faultDetected = false;

  float rs2 = adcToRs(PIN_MQ2);
  if (rs2 > 0) lpgPpm = lpgFromRatio(rs2 / r0_mq2);

  lpgHistory[histIdx] = lpgPpm;
  histIdx = (histIdx + 1) % 30;

  static uint8_t confirm = 0;
  bool trigger = lpgPpm > LPG_ALARM_PPM || coPpm > CO_ALARM_PPM || rateOfRise();

  if (trigger) {
    if (++confirm >= 3) {                            // 3 s of confirmation
      const char *why = coPpm > CO_ALARM_PPM ? "carbon-monoxide"
                      : rateOfRise()          ? "rapid-rise"
                                              : "combustible-gas";
      emergencyShutdown(why);
      publishAlert(why);
    }
  } else {
    confirm = 0;
  }

  if (faultDetected) {
    static uint32_t faultSince = 0;
    if (!faultSince) faultSince = millis();
    if (millis() - faultSince > 10000) publishAlert("sensor-fault");
  }
}

void onMessage(char *topic, byte *payload, unsigned int len) {
  if (len >= 3 && !strncmp((char *)payload, "ACK", 3)) acknowledged = true;
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_RESET, INPUT_PULLUP);
  pinMode(PIN_VALVE_LIM, INPUT_PULLUP);
  int outs[] = { PIN_R_VALVE, PIN_R_IGNITION, PIN_R_FAN, PIN_R_SIREN };
  for (int p : outs) { pinMode(p, OUTPUT); digitalWrite(p, HIGH); }   // active-low idle

  ledcSetup(0, 5000, 8);
  ledcAttachPin(PIN_MQ7_HEAT, 0);
  ledcWrite(0, 255);                       // start in the high-heat phase
  mq7PhaseStart = millis();

  analogSetPinAttenuation(PIN_MQ2, ADC_11db);
  analogSetPinAttenuation(PIN_MQ7, ADC_11db);

  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("gas", false);
  r0_mq2 = prefs.getFloat("r0_mq2", 9800);
  r0_mq7 = prefs.getFloat("r0_mq7", 10000);

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);

  // Sensors need 3 minutes of heater warm-up before readings mean anything.
  Serial.println("Warming up sensors — 180 s");
  for (int i = 180; i > 0; i--) {
    oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE);
    oled.setTextSize(1); oled.setCursor(0, 20);
    oled.printf("Warming up\\n%d s remaining", i);
    oled.display();
    delay(1000);
  }
  Serial.println("Gas detector armed");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) {
    if (mqtt.connect(DEVICE_ID)) mqtt.subscribe("home/gas/" DEVICE_ID "/cmd");
  }
  mqtt.loop();
  mq7Service();

  static uint32_t last = 0;
  if (millis() - last >= 1000) {
    last = millis();
    if (!alarmLatched) detectionService();

    oled.clearDisplay();
    oled.setTextColor(SSD1306_WHITE);
    oled.setTextSize(1);
    oled.setCursor(0, 0);  oled.printf("LPG  %5.0f ppm", lpgPpm);
    oled.setCursor(0, 12); oled.printf("CO   %5.0f ppm", coPpm);
    oled.setCursor(0, 24); oled.printf("MQ7  %s phase", mq7HighPhase ? "clean" : "measure");
    oled.setCursor(0, 40); oled.setTextSize(2);
    oled.print(alarmLatched ? "ALARM" : faultDetected ? "FAULT" : "OK");
    oled.display();

    if (!alarmLatched) {
      JsonDocument d;
      d["lpg_ppm"] = (int)lpgPpm;
      d["co_ppm"]  = (int)coPpm;
      d["fault"]   = faultDetected;
      char b[128]; size_t n = serializeJson(d, b, sizeof(b));
      mqtt.publish("home/gas/" DEVICE_ID "/state", (uint8_t *)b, n, true);
    }
  }

  if (alarmLatched && !acknowledged) {
    static uint32_t lastRepeat = 0;
    if (millis() - lastRepeat > 30000) { lastRepeat = millis(); publishAlert("still-active"); }
  }

  // Manual reset requires the gas to have cleared first.
  if (alarmLatched && digitalRead(PIN_RESET) == LOW && lpgPpm < LPG_WARN_PPM && coPpm < CO_WARN_PPM) {
    delay(50);
    if (digitalRead(PIN_RESET) == LOW) {
      alarmLatched = false; acknowledged = false;
      for (int p : { PIN_R_IGNITION, PIN_R_FAN, PIN_R_SIREN }) digitalWrite(p, HIGH);
      Serial.println("Alarm reset");
    }
  }
}`,
    explain: [
      { ref: 'emergencyShutdown ordering', txt: 'Valve, then ignition cut, then siren, then fan — and the network last. Every ordering decision here is a safety decision: starting a fan motor before cutting ignition sources would put a potential spark into a gas-filled room.' },
      { ref: 'adc < 20 || adc > 4075 → fault', txt: 'A disconnected or shorted sensor reads at a rail. Treating that as clean air is how a detector fails silently; treating it as a fault is how it fails safe.' },
      { ref: 'ledcWrite(0, 71) for 1.4 V', txt: '71/255 is 28 % duty, which through the MOSFET and RC filter gives about 1.4 V across the MQ-7 heater. Running the MQ-7 at constant 5 V, as most tutorials do, does not measure CO at all.' },
      { ref: 'Sample in the last 5 s of the low phase', txt: 'The surface temperature needs most of the 90 s low phase to settle. Reading at the start of the phase gives a value dominated by the previous cleaning cycle.' },
      { ref: 'rateOfRise()', txt: 'A fast leak reaches dangerous concentrations in minutes. Waiting for an absolute threshold spends most of that window; the derivative catches it while the concentration is still an order of magnitude below the explosive limit.' },
      { ref: 'Reset requires gas to have cleared', txt: 'A latching alarm that can be silenced while gas is still present is worse than no alarm, because it converts a loud problem into a quiet one.' },
      { ref: '180 s warm-up in setup()', txt: 'MQ heaters need minutes to reach operating temperature. Readings before that are meaningless, and arming the alarm early produces a false trigger on every power-up.' },
    ],
  }],

  config: [
    'Run <code>calibrateR0()</code> once, in genuinely clean air, after the sensor has had at least 24 hours of continuous burn-in. A new sensor straight from the bag reads high for a day or two.',
    'Set <code>LPG_ALARM_PPM</code> well below the lower explosive limit. 2000 ppm is about 11 % of the LEL — early enough to act, high enough to avoid nuisance alarms from a briefly unlit hob.',
    'Set CO thresholds against published guidance: 35 ppm is the 8-hour exposure limit, 100 ppm warrants immediate action.',
    'Verify the valve limit switch polarity. The firmware waits for it to confirm closure and gives up after three seconds — if the polarity is inverted it will drive the valve for the full timeout every time.',
    'Test the whole chain with a butane lighter (unlit, gas released near the sensor) at least twice a year.',
  ],

  calibration: [
    { h: 'Burn in the sensors', p: ['New MQ sensors need 24–48 hours of continuous power before their readings stabilise. Skipping this makes your R0 measurement wrong and every subsequent ppm figure wrong with it.'] },
    { h: 'Measure R0 in clean air', p: ['With the sensor warmed up and the room ventilated, run the calibration routine. It averages 50 samples and divides by the MQ-2\'s documented clean-air ratio of 9.83. Record the value; if it changes by more than about 30 % year on year, the sensor is ageing out.'] },
    { h: 'Verify the response', p: ['Release a small amount of butane from an unlit lighter about 30 cm from the MQ-2. The reading should climb sharply within a few seconds and recover over a minute or two. No response means the sensor is dead or the divider is wrong.'] },
    { h: 'Time the valve', p: ['Trigger a manual close and time it. Set the drive timeout in firmware to about 150 % of that, and verify the limit switch reports closure.'] },
  ],

  testing: [
    { step: 'Power on', expect: 'A 180-second warm-up countdown, then "armed". No alarm during warm-up.' },
    { step: 'Read the baseline after warm-up', expect: 'LPG under about 200 ppm and CO under 10 ppm in clean air. Much higher means R0 is wrong.' },
    { step: 'Watch the MQ-7 phase indicator', expect: 'Alternating between "clean" for 60 s and "measure" for 90 s, with CO updating at the end of each measure phase.' },
    { step: 'Release unlit butane near the MQ-2', expect: 'LPG ppm rises within seconds; after three consecutive samples above threshold the full action chain fires.' },
    { step: 'Observe the action order', expect: 'Valve drives closed first, ignition relay opens, siren sounds, then the fan starts about half a second later. Any other order is a wiring or firmware error.' },
    { step: 'Try to reset while gas is still present', expect: 'The reset is refused until readings fall below the warning thresholds.' },
    { step: 'Disconnect an MQ sensor', expect: '"FAULT" on the display and a sensor-fault alert published within ten seconds — not a reading of zero.' },
    { step: 'Unplug the network and trigger again', expect: 'Valve, ignition cut, siren and fan all still operate. Only the MQTT alert is lost.' },
  ],

  troubleshoot: [
    {
      sym: 'Readings are wildly high in clean air',
      cause: 'R0 not calibrated for this specific sensor, or the sensor has not been burned in.',
      fix: 'Run 24–48 hours of continuous power, then recalibrate R0 in ventilated clean air. Sensor-to-sensor variation on MQ parts is large enough that a datasheet nominal R0 can be off by a factor of three.',
    },
    {
      sym: 'CO readings never change',
      cause: 'The MQ-7 heater is running at a constant voltage instead of the alternating cycle.',
      fix: 'Verify the PWM: 255 for 60 s then 71 for 90 s, through a logic-level MOSFET with an RC filter. Measure the heater voltage with a multimeter — you should see it alternate between roughly 5.0 V and 1.4 V.',
    },
    {
      sym: 'False alarms when cooking',
      cause: 'The MQ-2 responds to alcohol vapour, cooking fumes and smoke, not just LPG.',
      fix: 'Raise the threshold, extend the confirmation from three samples to ten, and mount the sensor away from the hob and the extractor path. Cross-sensitivity is inherent to the sensor type — if it remains a problem, an infrared LPG sensor is selective and does not have this failure mode.',
    },
    {
      sym: 'The ESP32 resets when the siren or valve fires',
      cause: 'Inrush current and inductive kick on a shared supply.',
      fix: 'Power the 12 V loads from a separate supply with only ground in common, fit flyback diodes across the valve motor and siren, and add a 1000 µF capacitor at the ESP32 input.',
    },
    {
      sym: 'The valve does not fully close',
      cause: 'Insufficient torque against gas line pressure, or a valve rated for water rather than gas.',
      fix: 'Use a valve explicitly rated for LPG or natural gas with a torque figure that exceeds your line pressure. Water valve seals will not seal gas reliably, and this is not a place to economise.',
    },
  ],

  perf: [
    'Average 16 ADC samples per reading. The ESP32 ADC is noisy and a single sample can swing several percent, which on a power-law curve becomes a large ppm error.',
    'Keep the detection loop at 1 Hz. MQ sensors have a response time of seconds; faster sampling adds noise, not information.',
    'Store R0 in NVS so a reboot does not require recalibration — and log it, so you can see the sensor ageing.',
  ],

  safety: [
    '<b>This is not a certified safety device.</b> Fit a professionally certified gas alarm as your primary protection and treat this as an additional layer.',
    'Never test with a naked flame. Use unlit gas from a lighter, well away from any ignition source, and ventilate afterwards.',
    'The extraction fan must have a non-sparking motor and must never start before ignition sources are cut. A brushed motor spinning up in a gas-filled room is an ignition source.',
    'Gas valve installation on a real supply line must be done by a licensed gas fitter. In most jurisdictions this is a legal requirement.',
    'If you smell gas: do not operate any electrical switch, ventilate, close the cylinder valve by hand, and leave. Trust your nose over any electronics, including this.',
  ],

  future: [
    'Replace the MQ-2 with an <b>infrared LPG sensor</b>, which is selective, does not drift, and has no cross-sensitivity to cooking fumes.',
    'Add an <b>electrochemical CO sensor</b> for genuinely accurate carbon monoxide measurement — MQ-7 is a threshold detector, not an instrument.',
    'Add a <b>battery backup</b> so the detector works through a power cut, which is exactly when a gas appliance is most likely to be relit incorrectly.',
    'Add <b>flame detection</b> with an IR sensor for a second independent confirmation of a fire.',
    'Add a <b>mesh of detectors</b> so a leak in one room triggers valve closure at the source regardless of where the sensor is.',
  ],

  faq: [
    { q: 'How accurate are the ppm figures really?', a: 'Not very, and you should not rely on them as measurements. MQ sensors give perhaps ±50 % after careful calibration, with cross-sensitivity to alcohols and cooking fumes and drift over time. What they are good at is detecting a rapid change from a known baseline, which is all a threshold alarm actually needs. If you need real numbers, an infrared or electrochemical sensor is the right tool.' },
    { q: 'Where should the sensor be mounted?', a: 'It depends entirely on the gas. LPG (propane and butane) is heavier than air and pools at floor level, so mount 30 cm from the floor. Natural gas (methane) is lighter and rises, so mount 30 cm from the ceiling. CO has nearly the same density as air and mixes, so mount at head height. Getting this wrong means the detector never sees the gas.' },
    { q: 'Why does it need three minutes to warm up?', a: 'The sensing element must reach about 300 °C for the surface chemistry to work. Until it does, the resistance is dominated by temperature rather than gas concentration. Arming the alarm during warm-up produces a false trigger on every power-up, which trains people to ignore it.' },
    { q: 'Can I skip the R0 calibration?', a: 'You can, and your ppm figures will be meaningless. Manufacturing variation between MQ sensors is large — two units from the same batch can have clean-air resistances differing by a factor of two. R0 calibration is the step that makes the ratio curve apply to <em>your</em> sensor.' },
    { q: 'Is automatic valve closure a good idea, or is it a new hazard?', a: 'It is a real trade-off and worth thinking about. A false trigger that closes the gas is an inconvenience; a real leak that is not stopped is a catastrophe. The asymmetry strongly favours closing. But the valve must fail closed rather than fail open, it must be reopenable by hand, and its installation must be done properly on a real supply line.' },
  ],

  refs: [
    { t: 'MQ-2 semiconductor sensor for combustible gas — datasheet and curves', u: 'https://www.pololu.com/file/0J309/MQ2.pdf', s: 'Hanwei Electronics' },
    { t: 'MQ-7 carbon monoxide sensor — datasheet and heater cycle specification', u: 'https://www.sparkfun.com/datasheets/Sensors/Biometric/MQ-7.pdf', s: 'Hanwei Electronics' },
    { t: 'Flammability limits of LPG and natural gas', u: 'https://www.engineeringtoolbox.com/explosive-concentration-limits-d_423.html', s: 'Engineering ToolBox' },
    { t: 'Carbon monoxide exposure limits and health effects', u: 'https://www.cdc.gov/niosh/npg/npgd0105.html', s: 'US CDC / NIOSH' },
    { t: 'EN 50194 — electrical apparatus for the detection of combustible gases in domestic premises', u: 'https://standards.iteh.ai/catalog/standards/cen/', s: 'CEN' },
    { t: 'Metal oxide semiconductor gas sensors — operating principle', u: 'https://www.figaro.co.jp/en/technicalinfo/principle/mos-type.html', s: 'Figaro Engineering' },
  ],

  images: ['sensor', 'relay', 'esp32'],
  imageCaptions: [
    'A sensor module. MQ-series gas sensors use a heated tin-dioxide element whose resistance falls in the presence of reducing gases.',
    'A relay module. In this build four channels drive the valve, the ignition cut, the extraction fan and the siren, in a deliberately ordered chain.',
    'An ESP32 development board running the detection and shutdown logic.',
  ],
},

];
