/* ═══════════════════════════════════════════════════════════════════
   Smart Home — projects 007–010
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 007 · Smart Video Doorbell ──────────────────────────────────── */
{
  id: '007',
  domainKey: 'iot',
  emoji: '🔔',
  thumb: 'camera',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'An ESP32-CAM doorbell that captures a visitor snapshot on the button press or on motion, streams MJPEG on demand, and pushes the image straight to your phone — with everything stored on your own hardware.',

  overview: [
    'Commercial video doorbells work well and put a permanently-connected camera pointed at your front door under someone else\'s control, with the recordings behind a subscription. This build does the same job for under ₹2,500, keeps every frame on a machine you own, and — because the whole thing is about 300 lines of firmware — you can see exactly what it does.',
    'The ESP32-CAM is a compromise and it is worth being honest about which parts. It has a 2 MP OV2640, 4 MB of PSRAM, and enough processing power to serve MJPEG at around 12–15 fps at VGA. It cannot do H.264, it cannot do continuous 24/7 recording, and it will not match a commercial unit for night performance. What it does well is exactly what a doorbell needs: capture a good still when something happens, and serve a short live view when you ask for it.',
    'The design therefore centres on <b>event capture rather than continuous streaming</b>. A button press or a PIR trigger causes the board to grab several JPEG frames, publish the best one over MQTT (or POST it to a local endpoint), and sound a chime inside the house. Live view is opt-in: the stream endpoint exists but nothing subscribes to it unless you open the page.',
    'Two practical problems dominate real installs. The first is <b>power</b>: the ESP32-CAM draws 180–310 mA while streaming and browns out on a weak supply, which is the cause of the vast majority of "my ESP32-CAM keeps rebooting" reports. The second is <b>Wi-Fi range</b>, because a front door is usually the furthest point from the router and often behind a masonry wall — which is why this build specifies the antenna-connector variant of the board and an external antenna.',
  ],

  does: [
    'Captures a JPEG snapshot when the doorbell button is pressed, and again 1.5 s later to catch a moving visitor.',
    'Captures on PIR motion with a configurable cooldown so a windy tree does not fill your phone.',
    'Publishes images over MQTT as base64, or POSTs them to a local HTTP endpoint for storage.',
    'Serves an MJPEG live stream and a single-shot JPEG endpoint on demand.',
    'Rings a separate mains-powered chime node over MQTT, so the doorbell works even if your phone does not.',
    'Timestamps every event from NTP and names the stored files accordingly.',
    'Sleeps between events to keep the module cool and the power draw low.',
  ],

  features: [
    '<b>Dual capture on press</b> — one immediate, one 1.5 s later — which massively improves the odds of a usable face.',
    '<b>Frame quality ramp</b>: the sensor is given three throwaway frames to settle exposure before the kept frame.',
    '<b>PSRAM frame buffering</b> allowing UXGA (1600×1200) stills alongside VGA streaming.',
    '<b>Motion cooldown and quiet hours</b> to keep notification volume sane.',
    '<b>External antenna support</b> with the on-board jumper resistor moved — worth 10–15 dB at the door.',
    '<b>Separate chime node</b> so the audible bell does not depend on the camera board.',
    '<b>Local-only storage</b> via an HTTP POST to a Node-RED or Python endpoint on your own machine.',
    '<b>Brown-out detector disabled deliberately</b>, with a properly sized supply instead — see the notes.',
  ],

  applications: [
    { t: 'Front-door visitor capture', d: 'The core case: know who called while you were out, with the image on your own storage.' },
    { t: 'Parcel delivery evidence', d: 'A timestamped image of the courier and where they left the parcel settles most delivery disputes.' },
    { t: 'Gate intercom for a compound', d: 'Combine with the smart door lock project so a recognised visitor can be admitted remotely.' },
    { t: 'Elderly care check-in', d: 'A motion event with an image confirms a carer arrived without any recording of the interior.' },
    { t: 'Workshop or store-room entry log', d: 'Cheap enough to put one on every door that matters.' },
    { t: 'Wildlife and pet monitoring', d: 'The same firmware pointed at a garden captures whatever triggers the PIR.' },
  ],

  skills: [
    'Arduino C++ and the ESP32 camera driver API',
    'Flashing a board that has no USB — using an FTDI adapter and the BOOT/GND jumper',
    'Basic HTTP: multipart MJPEG and POST with a binary body',
    'MQTT publish with a large payload',
    'Power supply sizing and decoupling',
  ],

  prereq: [
    'The ESP32-CAM has no USB-serial chip. You need an FTDI or CP2102 adapter set to <b>3.3 V logic</b>, and you must bridge IO0 to GND to enter the bootloader. Flashing at 5 V logic will damage the board.',
  ],

  parts: ['esp32cam', 'pir', 'buzzer', 'buck', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'FTDI / CP2102 USB-serial adapter (3.3 V)', spec: 'Programming only, not part of the finished unit', qty: 1, price: 250 },
    { name: 'Doorbell push button, weatherproof', spec: 'NO momentary, IP54, illuminated', qty: 1, price: 180 },
    { name: '2.4 GHz external antenna + u.FL pigtail', spec: '3 dBi, SMA', qty: 1, price: 220, note: 'Only usable on the ESP32-CAM variant that has the u.FL connector.' },
    { name: '1000 µF electrolytic + 100 nF ceramic', spec: '10 V, low ESR', qty: 1, price: 40, note: 'Across the 5 V rail at the board. Not optional.' },
    { name: 'Second ESP32 + buzzer for the indoor chime', spec: 'Any ESP32 or ESP8266', qty: 1, price: 400 },
  ],
  cost: '₹2,300 – ₹3,400',
  libs: ['wifi', 'pubsub', 'arduinojson', 'ntp', 'httpclient'],
  ide: 'Arduino IDE 2.3.x, board: AI Thinker ESP32-CAM, PSRAM enabled',

  pins: {
    left: [
      { dev: 'Doorbell button', devPin: 'NO contact', pin: 'GPIO 13', sig: 'Pull-up, active-low' },
      { dev: 'HC-SR501 PIR', devPin: 'OUT', pin: 'GPIO 12', sig: 'High on motion' },
      { dev: 'OV2640 camera', devPin: 'Ribbon', pin: 'On-board', sig: 'Fixed camera bus' },
    ],
    right: [
      { dev: 'Chime relay / buzzer', devPin: 'IN', pin: 'GPIO 2', sig: 'Local audible feedback' },
      { dev: 'IR illuminator LEDs', devPin: 'Gate', pin: 'GPIO 15', sig: 'MOSFET-driven, night only' },
      { dev: 'On-board flash LED', devPin: '—', pin: 'GPIO 4', sig: 'Very bright — use sparingly' },
    ],
  },
  wiringNotes: [
    '<b>GPIO 0 must be free at boot.</b> It is the bootloader strap; anything holding it low keeps the board in flash mode. Do not use it for a peripheral.',
    'GPIO 1 and 3 are the UART. Keep them clear or you cannot see serial output or flash the board.',
    'GPIO 4 drives the on-board flash LED, which is genuinely dazzling and draws about 250 mA. It is also shared with the SD card data line, so you cannot use both the flash and the SD slot in 4-bit mode.',
    'The available spare pins on an AI-Thinker ESP32-CAM are 2, 12, 13, 14, 15 and 16 — and 12 is a strapping pin that must not be high at boot. Plan the wiring around those six.',
    '<b>Power is the number one failure cause.</b> Feed 5 V into the 5V pin from a supply rated at 1 A or more, with a 1000 µF capacitor physically at the board. A 3.3 V feed from an FTDI adapter cannot supply the peak current and will brown out mid-capture.',
    'To use an external antenna, move the tiny zero-ohm resistor next to the u.FL connector from the PCB-trace position to the connector position. This is fiddly SMD work but worth 10–15 dB at a front door.',
  ],

  block: {
    columns: [
      { label: 'Trigger', blocks: [{ name: 'Doorbell button', sub: 'GPIO 13' }, { name: 'PIR motion', sub: 'GPIO 12, cooldown' }] },
      { label: 'Capture', edge: 'event', blocks: [{ name: 'OV2640 + PSRAM', sub: 'settle then grab', highlight: true }, { name: 'JPEG encode', sub: 'on-sensor' }] },
      { label: 'Deliver', edge: 'JPEG buffer', blocks: [{ name: 'HTTP POST', sub: 'local storage' }, { name: 'MQTT event', sub: 'notify + chime' }] },
      { label: 'Consume', edge: 'notification', blocks: [{ name: 'Phone push', sub: 'with image' }, { name: 'Chime node', sub: 'indoor bell' }] },
    ],
  },

  flow: [
    { t: 'Boot: init camera, join Wi-Fi, sync NTP', k: 'start' },
    { t: 'Serve HTTP, poll button and PIR', k: 'proc' },
    { t: 'Button pressed or motion?', k: 'dec', yes: 'yes', no: 'keep serving', back: 1 },
    { t: 'Discard 3 frames to settle exposure', k: 'proc' },
    { t: 'Capture JPEG at UXGA', k: 'io' },
    { t: 'POST image to local store', k: 'io' },
    { t: 'Publish MQTT event, ring chime node', k: 'io' },
    { t: 'Start cooldown, return to serving', k: 'end' },
  ],

  principle: [
    'The OV2640 does the hard work. It is not a raw image sensor that hands you pixels — it contains a full image pipeline including automatic exposure, white balance, and a JPEG encoder. The ESP32 configures it over SCCB (an I²C variant) and then receives already-compressed JPEG frames over a parallel bus into a DMA buffer. That is why an 8-bit-era microcontroller-class chip can serve video at all: it never touches the pixels.',
    'The consequence is that <b>the first frame after a trigger is almost always bad</b>. The sensor\'s automatic exposure loop needs several frames to converge, especially when the scene changes from an empty doorway to a person filling it. Grabbing and discarding three frames before keeping one costs about 200 ms and transforms the hit rate from roughly half usable to nearly all usable.',
    'PSRAM is what makes higher resolutions possible. A UXGA JPEG frame buffer needs a few hundred kilobytes, which does not fit in the ESP32\'s internal SRAM alongside the Wi-Fi stack. With PSRAM enabled the driver allocates the frame buffers externally and you can capture at 1600×1200 while still streaming VGA. Without PSRAM the driver silently falls back and refuses anything above SVGA.',
    'MJPEG streaming is deliberately primitive: the server sends a <code>multipart/x-mixed-replace</code> response and simply keeps appending JPEG frames separated by a boundary marker. Every browser has supported this since the 1990s, there is no negotiation, no codec, and no latency budget beyond the frame time. It is bandwidth-hungry — VGA at 12 fps is roughly 2–3 Mbit/s — which is exactly why this design streams on demand rather than continuously.',
    'The chime being a separate node is a design decision worth defending. A doorbell that only notifies a phone fails when the phone is silent, out of battery, or in another room. Splitting the audible bell onto a cheap mains-powered ESP32 inside the house means the doorbell function survives a flat phone, and it also means the outdoor unit does not need a speaker or the power to drive one.',
  ],

  equations: [
    { t: 'Stream bandwidth', eq: 'VGA (640×480) JPEG at quality 12 ≈ 25 kB/frame\n\n12 fps  → 25 kB × 12 = 300 kB/s = 2.4 Mbit/s\n\nUXGA (1600×1200) at quality 10 ≈ 180 kB/frame\n  single snapshot over MQTT, base64 encoded:\n  180 kB × 4/3 = 240 kB payload\n\nThis is why stills go over HTTP POST and only a small\nthumbnail goes over MQTT — a 240 kB MQTT publish will\nstall a broker that other devices depend on.' },
    { t: 'Power budget', eq: 'Idle, Wi-Fi connected       :  80 mA\nStreaming VGA               : 180 mA\nCapture UXGA (peak)         : 250 mA\nFlash LED on                : +250 mA\nWi-Fi TX burst              : +200 mA (few ms)\n\nWorst case (capture + flash + TX) ≈ 700 mA\n\nSupply must be ≥ 1 A with a 1000 uF bulk capacitor.\nThe classic failure — "Brownout detector was triggered" —\nis this peak, not an average problem.' },
  ],

  code: [{
    file: 'video-doorbell.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Video Doorbell — ESP32-CAM (AI Thinker) + PIR + MQTT

   Captures a still on button press or motion, POSTs it to a local
   store, publishes an MQTT event that rings a separate chime node,
   and serves an on-demand MJPEG stream.

   Board: AI Thinker ESP32-CAM   PSRAM: enabled   Partition: Huge APP
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <esp_camera.h>
#include <esp_http_server.h>
#include <time.h>

#define WIFI_SSID  "YOUR_WIFI"
#define WIFI_PASS  "YOUR_PASSWORD"
#define MQTT_HOST  "192.168.1.50"
#define STORE_URL  "http://192.168.1.50:1880/doorbell"   // Node-RED endpoint
#define DEVICE_ID  "doorbell-front"

#define PIN_BUTTON 13
#define PIN_PIR    12
#define PIN_CHIME   2
#define PIN_IR_LED 15

#define MOTION_COOLDOWN_MS 60000UL
#define QUIET_START_H 22
#define QUIET_END_H    7

/* AI Thinker ESP32-CAM pin map — do not change for this board */
#define PWDN_GPIO 32
#define RESET_GPIO -1
#define XCLK_GPIO  0
#define SIOD_GPIO 26
#define SIOC_GPIO 27
#define Y9_GPIO   35
#define Y8_GPIO   34
#define Y7_GPIO   39
#define Y6_GPIO   36
#define Y5_GPIO   21
#define Y4_GPIO   19
#define Y3_GPIO   18
#define Y2_GPIO    5
#define VSYNC_GPIO 25
#define HREF_GPIO  23
#define PCLK_GPIO  22

WiFiClient   net;
PubSubClient mqtt(net);
httpd_handle_t server = NULL;
uint32_t lastMotion = 0;

/* ── camera ─────────────────────────────────────────────────── */
bool cameraBegin() {
  camera_config_t c = {};
  c.ledc_channel = LEDC_CHANNEL_0;
  c.ledc_timer   = LEDC_TIMER_0;
  c.pin_d0 = Y2_GPIO;  c.pin_d1 = Y3_GPIO;  c.pin_d2 = Y4_GPIO;  c.pin_d3 = Y5_GPIO;
  c.pin_d4 = Y6_GPIO;  c.pin_d5 = Y7_GPIO;  c.pin_d6 = Y8_GPIO;  c.pin_d7 = Y9_GPIO;
  c.pin_xclk = XCLK_GPIO;  c.pin_pclk = PCLK_GPIO;
  c.pin_vsync = VSYNC_GPIO; c.pin_href = HREF_GPIO;
  c.pin_sccb_sda = SIOD_GPIO; c.pin_sccb_scl = SIOC_GPIO;
  c.pin_pwdn = PWDN_GPIO;  c.pin_reset = RESET_GPIO;
  c.xclk_freq_hz = 20000000;
  c.pixel_format = PIXFORMAT_JPEG;

  if (psramFound()) {
    c.frame_size   = FRAMESIZE_UXGA;   // 1600x1200 for stills
    c.jpeg_quality = 10;               // lower number = better quality
    c.fb_count     = 2;                // double buffer
    c.fb_location  = CAMERA_FB_IN_PSRAM;
    c.grab_mode    = CAMERA_GRAB_LATEST;
  } else {
    c.frame_size   = FRAMESIZE_SVGA;   // fall back without PSRAM
    c.jpeg_quality = 14;
    c.fb_count     = 1;
  }

  if (esp_camera_init(&c) != ESP_OK) { Serial.println("camera init failed"); return false; }

  sensor_t *s = esp_camera_sensor_get();
  s->set_vflip(s, 1);            // most modules mount the sensor inverted
  s->set_brightness(s, 1);
  s->set_saturation(s, -1);      // slightly desaturated reads better at a door
  return true;
}

/* Throw away frames so auto-exposure converges before we keep one. */
camera_fb_t *captureSettled(int discard = 3) {
  for (int i = 0; i < discard; i++) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (fb) esp_camera_fb_return(fb);
    delay(60);
  }
  return esp_camera_fb_get();
}

/* ── delivery ───────────────────────────────────────────────── */
bool postImage(camera_fb_t *fb, const char *reason) {
  HTTPClient http;
  char url[192];
  time_t now = time(nullptr);
  struct tm t; localtime_r(&now, &t);
  snprintf(url, sizeof(url), "%s?device=%s&reason=%s&ts=%04d%02d%02d-%02d%02d%02d",
           STORE_URL, DEVICE_ID, reason,
           t.tm_year + 1900, t.tm_mon + 1, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec);

  http.begin(url);
  http.addHeader("Content-Type", "image/jpeg");
  http.setTimeout(8000);
  int code = http.POST(fb->buf, fb->len);
  http.end();

  Serial.printf("POST %s -> %d (%u bytes)\\n", reason, code, (unsigned)fb->len);
  return code > 0 && code < 300;
}

void publishEvent(const char *reason, size_t bytes, bool stored) {
  JsonDocument d;
  d["device"] = DEVICE_ID;
  d["event"]  = reason;
  d["ts"]     = (uint32_t)time(nullptr);
  d["bytes"]  = bytes;
  d["stored"] = stored;
  d["rssi"]   = WiFi.RSSI();
  char buf[192];
  size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("home/doorbell/" DEVICE_ID "/event", (uint8_t *)buf, n, false);
}

bool inQuietHours() {
  time_t now = time(nullptr);
  struct tm t; localtime_r(&now, &t);
  return QUIET_START_H > QUIET_END_H
       ? (t.tm_hour >= QUIET_START_H || t.tm_hour < QUIET_END_H)
       : (t.tm_hour >= QUIET_START_H && t.tm_hour < QUIET_END_H);
}

void handleTrigger(const char *reason, bool chime) {
  digitalWrite(PIN_IR_LED, inQuietHours() ? HIGH : LOW);   // IR fill at night
  delay(40);

  camera_fb_t *fb = captureSettled();
  if (!fb) { Serial.println("capture failed"); return; }
  bool ok = postImage(fb, reason);
  esp_camera_fb_return(fb);

  // A second frame 1.5 s later catches a visitor who was still moving.
  if (!strcmp(reason, "button")) {
    delay(1500);
    camera_fb_t *fb2 = esp_camera_fb_get();
    if (fb2) { postImage(fb2, "button-2"); esp_camera_fb_return(fb2); }
  }

  digitalWrite(PIN_IR_LED, LOW);
  publishEvent(reason, fb ? fb->len : 0, ok);

  if (chime && !inQuietHours()) {
    mqtt.publish("home/doorbell/chime", "ring", false);
    for (int i = 0; i < 2; i++) { tone(PIN_CHIME, 1800, 180); delay(240); }
  }
}

/* ── HTTP: single shot and MJPEG stream ─────────────────────── */
static esp_err_t jpgHandler(httpd_req_t *req) {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) return httpd_resp_send_500(req);
  httpd_resp_set_type(req, "image/jpeg");
  httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=door.jpg");
  esp_err_t r = httpd_resp_send(req, (const char *)fb->buf, fb->len);
  esp_camera_fb_return(fb);
  return r;
}

static esp_err_t streamHandler(httpd_req_t *req) {
  static const char *BOUNDARY = "--frameboundary";
  httpd_resp_set_type(req, "multipart/x-mixed-replace;boundary=frameboundary");

  sensor_t *s = esp_camera_sensor_get();
  s->set_framesize(s, FRAMESIZE_VGA);        // stream small, capture large
  char part[80];

  while (true) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) break;
    size_t hl = snprintf(part, sizeof(part),
      "\\r\\n%s\\r\\nContent-Type: image/jpeg\\r\\nContent-Length: %u\\r\\n\\r\\n",
      BOUNDARY, (unsigned)fb->len);
    esp_err_t e = httpd_resp_send_chunk(req, part, hl);
    if (e == ESP_OK) e = httpd_resp_send_chunk(req, (const char *)fb->buf, fb->len);
    esp_camera_fb_return(fb);
    if (e != ESP_OK) break;                  // client disconnected
  }
  s->set_framesize(s, FRAMESIZE_UXGA);       // restore stills resolution
  return ESP_OK;
}

void httpBegin() {
  httpd_config_t cfg = HTTPD_DEFAULT_CONFIG();
  cfg.server_port = 80;
  if (httpd_start(&server, &cfg) != ESP_OK) return;
  httpd_uri_t jpg    = { "/jpg",    HTTP_GET, jpgHandler,    NULL };
  httpd_uri_t stream = { "/stream", HTTP_GET, streamHandler, NULL };
  httpd_register_uri_handler(server, &jpg);
  httpd_register_uri_handler(server, &stream);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUTTON, INPUT_PULLUP);
  pinMode(PIN_PIR, INPUT);
  pinMode(PIN_CHIME, OUTPUT);
  pinMode(PIN_IR_LED, OUTPUT);
  digitalWrite(PIN_IR_LED, LOW);

  if (!cameraBegin()) { delay(3000); ESP.restart(); }

  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);                       // sleep kills stream latency
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 60 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  Serial.printf("IP %s  RSSI %d dBm\\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());

  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);
  httpBegin();
  Serial.println("Doorbell ready — /jpg and /stream available");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED)
    mqtt.connect(DEVICE_ID, NULL, NULL,
                 "home/doorbell/" DEVICE_ID "/status", 0, true, "offline");
  mqtt.loop();

  if (digitalRead(PIN_BUTTON) == LOW) {
    delay(30);
    if (digitalRead(PIN_BUTTON) == LOW) {
      handleTrigger("button", true);
      while (digitalRead(PIN_BUTTON) == LOW) delay(10);
    }
  }

  if (digitalRead(PIN_PIR) == HIGH && millis() - lastMotion > MOTION_COOLDOWN_MS) {
    lastMotion = millis();
    handleTrigger("motion", false);
  }

  delay(20);
}`,
    explain: [
      { ref: 'CAMERA_FB_IN_PSRAM + fb_count 2', txt: 'Double buffering in PSRAM lets the sensor DMA the next frame while the current one is being sent. Without it, streaming frame rate roughly halves.' },
      { ref: 'CAMERA_GRAB_LATEST', txt: 'Returns the newest frame rather than the oldest queued one. For a live view that is what you want — an MJPEG stream that falls behind should drop frames, not accumulate lag.' },
      { ref: 'captureSettled(3)', txt: 'The single most valuable twelve lines in this sketch. Auto-exposure needs several frames to converge after the scene changes; keeping the first frame gives you a washed-out or black image roughly half the time.' },
      { ref: 'set_framesize VGA then UXGA', txt: 'The stream drops to VGA while a client is watching, then restores UXGA for stills. Streaming UXGA is technically possible and yields about 2 fps, which is worse than useless.' },
      { ref: 'WiFi.setSleep(false)', txt: 'Modem sleep saves power but adds up to 100 ms of latency to every packet, which makes an MJPEG stream stutter visibly. This board is mains powered, so the trade is easy.' },
      { ref: 'POST rather than MQTT for the image', txt: 'A 180 kB base64 MQTT publish will block a shared broker for a noticeable time. HTTP POST to a storage endpoint keeps the large payload off the message bus entirely, and MQTT carries only the small event notification.' },
      { ref: 'LWT on the status topic', txt: 'A doorbell that has silently died looks exactly like a doorbell nobody has rung. The Last Will makes the difference visible.' },
    ],
  }],

  config: [
    'Select <b>Board: AI Thinker ESP32-CAM</b>, <b>PSRAM: Enabled</b>, and <b>Partition Scheme: Huge APP (3 MB)</b>. The camera driver plus the HTTP server does not fit in the default partition.',
    'To flash: connect FTDI TX→U0R, RX→U0T, 5 V→5V, GND→GND, and bridge <b>IO0 to GND</b>. Press reset, upload, then remove the IO0 jumper and reset again.',
    'Set <code>STORE_URL</code> to a local endpoint. A three-node Node-RED flow (HTTP In → File → HTTP Response) is enough to write timestamped JPEGs to disk.',
    'Set the NTP offset for your timezone; the stored filenames depend on it.',
    'Tune <code>MOTION_COOLDOWN_MS</code> upward if a road or a tree is in frame. Sixty seconds is a starting point, not an answer.',
    'Adjust <code>set_vflip</code> and <code>set_hmirror</code> to match how you physically mount the module.',
  ],

  calibration: [
    { h: 'Frame the shot', p: ['Mount at about 1.4 m and tilt down roughly 15°. Open <code>/stream</code> on a laptop and adjust until a person standing at the door fills the middle third of the frame. Too high and you photograph the tops of heads; too low and tall visitors are decapitated.'] },
    { h: 'Set exposure for backlight', p: ['A doorway with bright sky behind it is the worst case for auto-exposure. If faces come out as silhouettes, set <code>s->set_ae_level(s, 2)</code> to bias exposure brighter, and consider <code>s->set_wb_mode(s, 1)</code> for a fixed sunny white balance.'] },
    { h: 'Tune the PIR', p: ['Set the sensitivity trimmer to roughly mid-travel, the time-delay trimmer to minimum, and the jumper to H (retrigger). Then walk the approach path and check that you trigger at the range you want and not from the pavement.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT + HTTP',
    net: {
      nodes: [{ name: 'Doorbell', sub: 'ESP32-CAM' }, { name: 'Chime node', sub: 'indoor ESP32' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'external antenna advised',
      uplink: 'MQTT + HTTP POST', cloud: 'Node-RED + broker', cloudSub: 'on a local Pi',
      clients: [{ name: 'Phone push', sub: 'image attached' }, { name: 'Web view', sub: '/stream' }],
    },
    protocol: [
      'Two transports, deliberately. Small, frequent messages (events, chime commands, status) go over MQTT where the persistent connection gives low latency. Large, infrequent payloads (JPEG images) go over HTTP POST, where a slow transfer inconveniences nobody else.',
      'Mixing these is a common mistake: publishing a 240 kB base64 image over MQTT works on a bench and starves every other device on a real broker.',
    ],
    topics: [
      { t: 'home/doorbell/doorbell-front/event', dir: 'device → broker', payload: 'JSON: event, ts, bytes, stored, rssi' },
      { t: 'home/doorbell/chime', dir: 'device → broker', payload: '"ring" — consumed by the indoor chime node' },
      { t: 'home/doorbell/doorbell-front/status', dir: 'device → broker (retained)', payload: '"online" / "offline" (LWT)' },
    ],
    cloud: [
      'A Node-RED flow of four nodes does the whole backend: an HTTP In node at <code>/doorbell</code>, a File node writing <code>/srv/doorbell/{{ts}}.jpg</code>, an HTTP Response node, and a call to ntfy.sh with the image attached. Nothing leaves your network unless you choose to send the notification.',
    ],
    mobile: [
      'ntfy.sh supports file attachments, so the push notification itself can carry the visitor image. That is the difference between "someone rang the bell" and a doorbell you actually rely on.',
    ],
    security: [
      'The MJPEG endpoint has no authentication. Do not port-forward it. Reach it through a VPN or a reverse proxy with authentication if you need remote access.',
      'Put the camera on an IoT VLAN with no route to your file server or NAS management interfaces.',
      'Consider what the camera can see. A doorbell that also frames a neighbour\'s window or a public footpath raises real privacy and, in some jurisdictions, legal issues — angle it down and mask what you do not need.',
      'Store images locally. The whole point of this build over a commercial unit is that the footage stays on hardware you control.',
    ],
  },

  testing: [
    { step: 'Open <code>http://&lt;ip&gt;/jpg</code>', expect: 'A single UXGA JPEG loads in a second or two.' },
    { step: 'Open <code>http://&lt;ip&gt;/stream</code>', expect: 'Live VGA video at roughly 10–15 fps with about half a second of latency.' },
    { step: 'Press the button', expect: 'Two images appear in your store 1.5 s apart, an MQTT event is published, and the chime node sounds.' },
    { step: 'Walk past the PIR', expect: 'One motion image, no chime, and no further captures for the cooldown period.' },
    { step: 'Trigger during quiet hours', expect: 'Image captured and stored, IR illuminator on, but no audible chime.' },
    { step: 'Check the first frame after a scene change', expect: 'Correctly exposed, not black or washed out — this verifies the settle logic.' },
    { step: 'Measure supply voltage at the board during a capture', expect: 'Stays above 4.7 V. A dip below that is why the board reboots.' },
    { step: 'Check RSSI at the mounted location', expect: 'Better than −70 dBm. Worse and you will get intermittent stream failures no amount of firmware fixes.' },
  ],

  troubleshoot: [
    {
      sym: '"Brownout detector was triggered" and constant rebooting',
      cause: 'The supply cannot deliver peak current — this accounts for the large majority of ESP32-CAM problems.',
      fix: 'Feed 5 V from a supply rated at 1 A or more, use short thick wires, and fit a 1000 µF electrolytic capacitor at the board. Do not power from an FTDI adapter\'s 3.3 V pin. Disabling the brown-out detector in software hides the symptom and leaves you with corrupted frames instead.',
    },
    {
      sym: 'Camera init fails with 0x105 or 0x20004',
      cause: 'Wrong board selected, PSRAM disabled, or the camera ribbon is not seated.',
      fix: 'Select <b>AI Thinker ESP32-CAM</b> and enable PSRAM. Then reseat the ribbon — lift the black retainer, insert the cable fully with contacts facing the board, and press the retainer down. A partially seated ribbon gives exactly this error.',
    },
    {
      sym: 'Images are green, pink or heavily striped',
      cause: 'XCLK too fast for the wiring, or a marginal supply.',
      fix: 'Reduce <code>xclk_freq_hz</code> from 20 MHz to 10 MHz. If that fixes it, the parallel bus is marginal — usually a supply or a solder-joint problem on the module.',
    },
    {
      sym: 'The board will not enter flash mode',
      cause: 'IO0 not held low at reset, or FTDI at 5 V logic.',
      fix: 'Bridge IO0 to GND <em>before</em> pressing reset, and hold it until the IDE prints "Connecting". Set the FTDI jumper to 3.3 V logic — 5 V on the UART pins damages the module.',
    },
    {
      sym: 'Stream works on the bench, fails at the door',
      cause: 'Wi-Fi signal. A masonry wall between the router and the door costs 10–20 dB.',
      fix: 'Check RSSI in the boot log. Below −75 dBm you need an external antenna (move the zero-ohm resistor to the u.FL position) or a mesh node nearer the door. No firmware change fixes a link budget problem.',
    },
    {
      sym: 'Captured images are always dark or always blown out',
      cause: 'Auto-exposure has not converged, or the scene is strongly backlit.',
      fix: 'Confirm the settle-and-discard loop is running. For backlight, raise <code>set_ae_level</code> and consider a fixed exposure with <code>set_aec2</code> disabled and a manual <code>set_aec_value</code> chosen for the daylight case.',
    },
  ],

  perf: [
    'Stream at VGA and capture at UXGA. Streaming full resolution gives about 2 fps and no benefit at a doorbell viewing distance.',
    'Use <code>CAMERA_GRAB_LATEST</code> with two frame buffers — the combination keeps latency low without dropping to single buffering.',
    'Keep the MJPEG handler free of any MQTT or file work; every millisecond in that loop is a frame you do not send.',
  ],

  safety: [
    'A camera pointed at a public footpath or a neighbour\'s property has legal implications in many countries. Angle it to cover your own threshold and mask the rest.',
    'Mount the outdoor unit so no mains wiring is accessible, and use a proper IP-rated gland for the cable entry.',
    'IR illuminator LEDs are invisible and still emit real optical power. Do not look into them at close range.',
  ],

  future: [
    'Add <b>on-device person detection</b> with a small TFLite model so motion events only fire for people, not cats and headlights.',
    'Add <b>two-way audio</b> with an INMP441 microphone and a small amplifier, streamed over a WebRTC or simple UDP path.',
    'Add <b>face recognition</b> on the receiving server (not the ESP32) to label known visitors.',
    'Integrate with the <b>smart door lock</b> project so a recognised visitor can be admitted from the notification.',
    'Move to an <b>ESP32-S3 with a better sensor</b> for genuinely usable low-light performance.',
  ],

  faq: [
    { q: 'Can this record continuously like a commercial doorbell?', a: 'Not usefully. The ESP32-CAM has no H.264 encoder, so continuous recording means storing MJPEG at roughly 300 kB/s — around 25 GB a day. Event-based capture is not a compromise forced by the hardware so much as the right design for a doorbell: you want the moment someone arrived, not eight hours of an empty porch.' },
    { q: 'Why does everyone say the ESP32-CAM is unreliable?', a: 'Because almost every reliability report traces to power. The board has genuinely high peak current, a marginal on-board regulator, and no bulk capacitance. Give it a real 1 A supply and a 1000 µF capacitor and it becomes a well-behaved device. The second most common cause is Wi-Fi signal at a front door, which is a physics problem, not a board problem.' },
    { q: 'How good is night vision?', a: 'Poor without help. The OV2640 has a small sensor and no IR-cut filter removal on most modules. Adding IR illuminator LEDs helps if your module\'s IR filter has been removed (some "night vision" variants ship this way); on a standard module the IR filter blocks most of what the illuminator emits. Be realistic: this is a daytime-good, night-marginal camera.' },
    { q: 'Can I run it on battery?', a: 'Only with deep sleep between events, and then you lose the live stream and the PIR must be the wake source. A doorbell that takes four seconds to boot and connect before capturing will miss the visitor. Mains power, ideally from an existing doorbell transformer stepped to 5 V, is the right answer.' },
    { q: 'Why a separate chime node instead of a speaker on the doorbell?', a: 'Because the audible bell is the one function that must never depend on a phone, an app, or an internet connection — and putting the speaker outdoors means the visitor hears it and you may not. A ₹400 ESP32 with a buzzer inside the house subscribed to one MQTT topic solves it completely.' },
  ],

  refs: [
    { t: 'ESP32 Camera Driver (esp32-camera) — API and configuration', u: 'https://github.com/espressif/esp32-camera', s: 'Espressif on GitHub' },
    { t: 'OV2640 CMOS image sensor — datasheet', u: 'https://www.uctronics.com/download/cam_module/OV2640DS.pdf', s: 'OmniVision' },
    { t: 'ESP32-CAM (AI Thinker) product specification and pin map', u: 'https://loboris.eu/ESP32/ESP32-CAM%20Product%20Specification.pdf', s: 'AI Thinker' },
    { t: 'RFC 2046 — multipart media types (the basis of MJPEG streaming)', u: 'https://www.rfc-editor.org/rfc/rfc2046', s: 'IETF' },
    { t: 'ESP-IDF HTTP Server component', u: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/protocols/esp_http_server.html', s: 'Espressif' },
    { t: 'Node-RED HTTP endpoints and file nodes', u: 'https://nodered.org/docs/user-guide/nodes', s: 'Node-RED' },
  ],

  images: ['camera', 'esp32', 'cctv'],
  imageCaptions: [
    'A USB webcam — the same class of small CMOS sensor and lens assembly used in the ESP32-CAM module.',
    'An ESP32 development board. The ESP32-CAM uses the same SoC with a camera interface and PSRAM added.',
    'A wall-mounted surveillance camera. This build targets the same job at a doorway, with the recordings kept on your own hardware.',
  ],
},

/* ── 008 · Indoor Air Quality Monitor ────────────────────────────── */
{
  id: '008',
  domainKey: 'iot',
  emoji: '🫁',
  thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '8–12 hours',
  iso8601: 'PT10H',
  tagline: 'A monitor that measures the three indoor pollutants that actually matter — CO₂, PM2.5 and VOCs — with real NDIR and laser sensors rather than the cheap resistive parts that produce confident, meaningless numbers.',

  overview: [
    'Almost every "air quality" project on the internet uses an MQ-135 and reports a CO₂ figure in parts per million. That number is fiction. The MQ-135 is a tin-dioxide resistive sensor with broad, overlapping sensitivity to alcohols, ammonia, benzene and CO₂, no selectivity between them, and a response that drifts with humidity and temperature. It is a useful "something changed" detector and a useless quantitative instrument.',
    'This build uses sensors that measure what they claim to. An <b>MH-Z19B</b> uses non-dispersive infrared absorption to measure CO₂ specifically, at ±(50 ppm + 5 %). A <b>PMS5003</b> uses laser scattering with a fan and a counting chamber to size and count particles, giving genuine PM1.0, PM2.5 and PM10 mass concentrations. A <b>BME280</b> supplies temperature, humidity and pressure — which matter both directly for comfort and as compensation inputs.',
    'CO₂ is the most actionable of the three, and the least intuitive. It is not itself very harmful at indoor concentrations, but it is an excellent proxy for <b>ventilation rate</b>: humans exhale it continuously, so if CO₂ is rising, the air you are breathing is increasingly air someone else has already breathed. That matters for cognitive performance — there is reasonable evidence of measurable decision-making decline above roughly 1000 ppm — and, since 2020, it has become the standard proxy for airborne-disease transmission risk in a shared room.',
    'The system reports each pollutant separately rather than collapsing them into a single "AQI" number. That is deliberate: the actions are different. High CO₂ means open a window. High PM2.5 means close the window and run a filter. A single index that averages them can point you in exactly the wrong direction.',
  ],

  does: [
    'Measures CO₂ by NDIR, PM1.0/PM2.5/PM10 by laser scattering, and temperature, humidity and pressure.',
    'Displays live values with colour-coded thresholds on an OLED.',
    'Publishes everything over MQTT with Home Assistant discovery for each measurement.',
    'Duty-cycles the particulate sensor fan to extend its service life from months to years.',
    'Applies the correct disable of the CO₂ sensor\'s automatic baseline calibration for continuously occupied rooms.',
    'Estimates the room\'s air-change rate from the CO₂ decay curve after occupants leave.',
    'Alerts when CO₂ exceeds a ventilation threshold or PM2.5 exceeds a health threshold.',
  ],

  features: [
    '<b>True NDIR CO₂</b> rather than a resistive proxy — the single most important choice in the build.',
    '<b>Laser particle counting</b> with mass concentrations for three size fractions.',
    '<b>Fan duty cycling</b> on the PMS5003: 30 s of measurement every 5 minutes, roughly a tenfold life extension.',
    '<b>ABC disable</b> for the MH-Z19B, with a documented manual calibration procedure instead.',
    '<b>Air-change-rate estimation</b> from the exponential CO₂ decay after a room empties.',
    '<b>Per-pollutant thresholds</b> based on published guidance rather than an invented composite index.',
    '<b>Home Assistant discovery</b> for six separate sensor entities.',
    '<b>Local historical buffer</b> so a broker outage does not lose the trend.',
  ],

  applications: [
    { t: 'Bedroom ventilation', d: 'CO₂ in a closed bedroom routinely reaches 2000–3000 ppm overnight. Seeing that number is usually enough to change behaviour.' },
    { t: 'Classrooms and meeting rooms', d: 'CO₂ is the standard proxy for ventilation adequacy and is now used in many school ventilation guidelines.' },
    { t: 'Cooking and indoor PM', d: 'Frying produces PM2.5 concentrations that would be a public-health emergency outdoors. Extractor fans are usually not run long enough.' },
    { t: 'Wildfire and outdoor pollution episodes', d: 'Tells you whether keeping windows shut is actually working.' },
    { t: 'Workshop and 3D-printer rooms', d: 'Resin printers and soldering both produce measurable VOC and particulate loads.' },
    { t: 'Rental and property disputes', d: 'A logged record of damp-driving humidity and inadequate ventilation is far more persuasive than an opinion.' },
  ],

  skills: [
    'UART communication with two devices, or one UART plus software serial',
    'I²C sensor reading',
    'Arduino C++ with non-blocking scheduling',
    'Understanding of what a sensor specification actually promises',
    'MQTT and Home Assistant discovery',
  ],

  parts: ['esp32', 'mhz19', 'pms5003', 'bme280', 'oled', 'buck', 'psu5v', 'perfboard', 'enclosure'],
  extraParts: [
    { name: 'Small 40 mm fan (optional)', spec: '5 V, 0.1 A, for enclosure airflow', qty: 1, price: 120, note: 'Only needed if the enclosure is tight — the PMS5003 has its own fan.' },
    { name: 'Ventilation mesh and grommets', spec: 'Stainless mesh, 1 mm', qty: 1, price: 80 },
  ],
  cost: '₹6,200 – ₹7,600',
  libs: ['wifi', 'pubsub', 'arduinojson', 'bme', 'unified', 'ssd1306', 'preferences'],

  pins: {
    left: [
      { dev: 'MH-Z19B CO₂', devPin: 'TX / RX', pin: 'GPIO 16 / 17', sig: 'UART2, 9600 8N1' },
      { dev: 'PMS5003 particulate', devPin: 'TX / RX', pin: 'GPIO 25 / 26', sig: 'UART1, 9600 8N1' },
      { dev: 'PMS5003', devPin: 'SET', pin: 'GPIO 27', sig: 'Low = sleep (fan off)' },
      { dev: 'BME280', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'I²C at 0x76' },
    ],
    right: [
      { dev: 'SSD1306 OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C, 0x3C' },
      { dev: 'Status LED (RGB)', devPin: 'R / G / B', pin: 'GPIO 12 / 13 / 14', sig: 'Threshold indication' },
      { dev: 'Buzzer', devPin: '+', pin: 'GPIO 15', sig: 'Threshold alert' },
    ],
  },
  wiringNotes: [
    'Both gas sensors want a solid <b>5 V</b> supply. The MH-Z19B draws about 60 mA average with peaks over 150 mA during its IR lamp pulse; the PMS5003 draws about 100 mA with the fan running. Do not power either from the ESP32 3V3 rail.',
    'Both sensors output <b>3.3 V logic</b> on their TX lines, so they connect directly to ESP32 RX pins with no level shifting. Their RX inputs tolerate 3.3 V from the ESP32.',
    'The ESP32 has three hardware UARTs. Use UART1 and UART2 for the two sensors and leave UART0 for the USB serial monitor — software serial on an ESP32 is unnecessary and unreliable at these rates.',
    'The PMS5003 <b>SET</b> pin is the sleep control. Driving it low stops the fan and the laser; this is what makes duty cycling possible and it is the difference between a sensor that lasts eight months and one that lasts five years.',
    'Mount the PMS5003 with its inlet and outlet unobstructed and at least 20 mm from any wall. Its measurement depends on a defined airflow through the chamber, and blocking either port silently biases the readings.',
    'Keep the BME280 away from the MH-Z19B — the CO₂ sensor\'s lamp makes it a real heat source and will bias the temperature reading upward by two or three degrees.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'MH-Z19B', sub: 'NDIR CO₂' }, { name: 'PMS5003', sub: 'laser PM' }, { name: 'BME280', sub: 'T / RH / P' }] },
      { label: 'Acquire', edge: 'UART / I²C', blocks: [{ name: 'ESP32', sub: 'schedule + parse', highlight: true }, { name: 'Duty cycler', sub: 'fan life' }] },
      { label: 'Assess', edge: 'raw values', blocks: [{ name: 'Threshold logic', sub: 'per pollutant' }, { name: 'ACH estimator', sub: 'decay fit' }] },
      { label: 'Report', edge: 'assessed state', blocks: [{ name: 'OLED + RGB', sub: 'local' }, { name: 'MQTT → HA', sub: 'history' }] },
    ],
  },

  flow: [
    { t: 'Boot: init UARTs, disable MH-Z19B ABC', k: 'start' },
    { t: 'Read CO₂ and BME280 every 10 s', k: 'proc' },
    { t: 'PM measurement window due (5 min)?', k: 'dec', yes: 'wake fan', no: 'keep fan asleep', back: 1 },
    { t: 'Run fan 30 s, then read PM frame', k: 'io' },
    { t: 'Evaluate thresholds per pollutant', k: 'proc' },
    { t: 'Any threshold exceeded?', k: 'dec', yes: 'LED + buzzer + alert', no: 'normal display', back: 1 },
    { t: 'Publish all values over MQTT', k: 'io' },
    { t: 'Update CO₂ decay history for ACH', k: 'end' },
  ],

  principle: [
    '<b>NDIR CO₂ measurement</b> exploits the fact that CO₂ absorbs infrared strongly at 4.26 µm and almost nothing else in indoor air does. The sensor contains an IR lamp, a gas chamber of known path length, an optical filter centred at that wavelength, and a detector. More CO₂ in the chamber means less IR reaches the detector, following the Beer-Lambert law. Because the absorption band is narrow and specific, the measurement is genuinely selective — that specificity is the entire reason NDIR costs ₹2,600 and an MQ-135 costs ₹180.',
    'NDIR sensors drift, mostly because the lamp ages. Manufacturers compensate with <b>automatic baseline correction</b>: the sensor assumes that over any two-week window the lowest reading it saw corresponds to outdoor air at about 400 ppm, and it rescales accordingly. In an office that empties every night this works beautifully. In a bedroom that never drops to outdoor levels, or a greenhouse, or a continuously occupied space, it is actively harmful — the sensor will drag its baseline down and under-report by hundreds of ppm. Disabling ABC and calibrating manually once a year is the correct choice for most home installs.',
    '<b>Laser scattering</b> in the PMS5003 works differently. A fan draws a controlled airflow past a laser beam; particles crossing the beam scatter light onto a photodiode, and the amplitude of each scattering pulse relates to particle size while the pulse rate gives count. The sensor bins particles into size classes and then converts counts to mass concentration using an assumed particle density and shape. That conversion is where the uncertainty lives: the ±10 % specification assumes typical urban aerosol, and readings for an unusual aerosol such as cooking oil smoke can be systematically off. It remains far more trustworthy than any resistive alternative.',
    'The fan is a mechanical wear item with a rated life around 8000 hours — under a year of continuous running. <b>Duty cycling</b> is therefore not an optimisation but a requirement for a device meant to last. The sensor needs roughly 30 seconds of running airflow to give a stable reading, so a 30-second window every five minutes gives a tenth of the running hours and loses essentially nothing, because indoor particulate levels do not change meaningfully in five minutes.',
    'The <b>air-change rate</b> estimate falls out of the CO₂ data for free. When people leave a room, CO₂ decays exponentially towards the outdoor concentration with a time constant set by the ventilation rate. Fitting <code>ln(C − C_out)</code> against time during a decay period gives air changes per hour directly. A bedroom at 0.3 ACH is badly ventilated; 3 ACH is well ventilated. This is a genuinely useful number that almost no commercial monitor reports.',
  ],

  equations: [
    { t: 'Beer-Lambert absorption', eq: 'I = I₀ · e^(−ε · c · L)\n\nI₀ = source intensity, I = detected intensity\nε  = molar absorptivity of CO₂ at 4.26 µm\nc  = concentration, L = optical path length\n\nRearranged for the sensor:\n  c ∝ −ln(I / I₀) / (ε · L)\n\nLonger L gives more sensitivity, which is why\nhigh-accuracy NDIR sensors are physically larger.' },
    { t: 'Air-change rate from CO₂ decay', eq: 'C(t) = C_out + (C₀ − C_out) · e^(−ACH · t)\n\nln(C(t) − C_out) = ln(C₀ − C_out) − ACH · t\n\nWorked example — bedroom after occupants leave:\n  t = 0 min : 1850 ppm\n  t = 30 min: 1180 ppm\n  C_out     :  420 ppm\n\n  ACH = −ln((1180−420)/(1850−420)) / 0.5 h\n      = −ln(0.531) / 0.5 = 1.27 air changes/hour\n\nUnder 0.5 ACH is poor; 1–2 is typical; ASHRAE 62.1\nresidential guidance is around 0.35 ACH minimum.' },
    { t: 'CO₂ generation and steady state', eq: 'One adult at rest produces ≈ 0.005 L/s of CO₂\n\nSteady-state concentration:\n  C_ss = C_out + (G / Q)\n\nG = generation rate, Q = ventilation flow rate\n\nBedroom, 30 m³, 2 people, 0.5 ACH:\n  Q = 30 × 0.5 / 3600 = 0.00417 m³/s\n  G = 2 × 0.005 L/s = 0.00001 m³/s\n  C_ss = 420 + (0.00001 / 0.00417) × 10⁶\n       = 420 + 2400 = 2820 ppm\n\nWhich is exactly what closed bedrooms measure.' },
  ],

  code: [{
    file: 'air-quality-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Indoor Air Quality Monitor — ESP32 + MH-Z19B + PMS5003 + BME280

   Real NDIR CO2 and laser particulate measurement, with the
   particulate fan duty-cycled for service life and the CO2 sensor's
   automatic baseline correction deliberately disabled.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <Adafruit_SSD1306.h>
#include <math.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "air-bedroom"

#define PIN_PMS_SET 27
#define PIN_LED_R   12
#define PIN_LED_G   13
#define PIN_LED_B   14
#define PIN_BUZZER  15

#define CO2_WARN   1000       // ppm — ventilation guidance threshold
#define CO2_ALERT  1500
#define PM25_WARN    15       // ug/m3 — WHO 2021 24-h guideline
#define PM25_ALERT   35

#define PM_PERIOD_MS   300000UL   // measure every 5 minutes
#define PM_WARMUP_MS    30000UL   // fan must run 30 s before a valid read

HardwareSerial co2Serial(2);      // GPIO 16/17
HardwareSerial pmsSerial(1);      // GPIO 25/26

Adafruit_BME280  bme;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);

int   co2 = 0, pm1 = 0, pm25 = 0, pm10 = 0;
float tempC = 0, rh = 0, hPa = 0;
bool  pmValid = false;

uint32_t pmWindowStart = 0;
bool     pmFanOn = false;

/* CO2 decay history for the air-change-rate estimate */
struct Sample { uint32_t t; int ppm; };
Sample history[60];               // 10 minutes at 10 s intervals
uint8_t histHead = 0;
float   achEstimate = 0;
float   co2Outdoor = 420;

/* ── MH-Z19B ────────────────────────────────────────────────── */
uint8_t mhzChecksum(const uint8_t *p) {
  uint8_t s = 0;
  for (int i = 1; i < 8; i++) s += p[i];
  return 0xFF - s + 1;
}

void mhzSend(uint8_t cmd, uint8_t b3 = 0, uint8_t b4 = 0) {
  uint8_t f[9] = { 0xFF, 0x01, cmd, b3, b4, 0, 0, 0, 0 };
  f[8] = mhzChecksum(f);
  co2Serial.write(f, 9);
}

void mhzDisableABC() {
  // 0x79 0x00 = ABC off. Essential for rooms that never reach
  // outdoor CO2 levels, such as an occupied bedroom.
  mhzSend(0x79, 0x00);
  delay(50);
}

void mhzCalibrateZero() {
  // Only valid after 20+ minutes in genuine outdoor air (~400 ppm).
  mhzSend(0x87);
  delay(50);
}

int mhzRead() {
  while (co2Serial.available()) co2Serial.read();   // flush stale bytes
  mhzSend(0x86);

  uint8_t r[9];
  uint32_t t0 = millis();
  int got = 0;
  while (got < 9 && millis() - t0 < 300)
    if (co2Serial.available()) r[got++] = co2Serial.read();

  if (got < 9 || r[0] != 0xFF || r[1] != 0x86) return -1;
  if (r[8] != mhzChecksum(r)) return -1;
  return r[2] * 256 + r[3];
}

/* ── PMS5003 ────────────────────────────────────────────────── */
void pmsSleep(bool sleep) {
  digitalWrite(PIN_PMS_SET, sleep ? LOW : HIGH);
  pmFanOn = !sleep;
}

bool pmsRead() {
  // Frames are 32 bytes starting 0x42 0x4D.
  uint32_t t0 = millis();
  while (millis() - t0 < 2000) {
    if (pmsSerial.available() < 32) { delay(10); continue; }
    if (pmsSerial.read() != 0x42) continue;
    if (pmsSerial.read() != 0x4D) continue;

    uint8_t b[30];
    for (int i = 0; i < 30; i++) b[i] = pmsSerial.read();

    uint16_t sum = 0x42 + 0x4D;
    for (int i = 0; i < 28; i++) sum += b[i];
    uint16_t given = (b[28] << 8) | b[29];
    if (sum != given) continue;                      // corrupt frame

    // Atmospheric-environment values start at offset 8.
    pm1  = (b[8]  << 8) | b[9];
    pm25 = (b[10] << 8) | b[11];
    pm10 = (b[12] << 8) | b[13];
    return true;
  }
  return false;
}

void pmService() {
  uint32_t now = millis();

  if (!pmFanOn && now - pmWindowStart >= PM_PERIOD_MS) {
    pmsSleep(false);
    pmWindowStart = now;
    return;
  }
  if (pmFanOn && now - pmWindowStart >= PM_WARMUP_MS) {
    pmValid = pmsRead();
    pmsSleep(true);
    pmWindowStart = now - PM_WARMUP_MS;    // next window a full period later
  }
}

/* ── air change rate from CO2 decay ─────────────────────────── */
void achUpdate() {
  history[histHead] = { millis(), co2 };
  histHead = (histHead + 1) % 60;

  // Find the oldest and newest samples; only fit a genuine decay.
  Sample oldest = history[histHead];
  Sample newest = history[(histHead + 59) % 60];
  if (!oldest.t || newest.t <= oldest.t) return;

  float dropPpm = oldest.ppm - newest.ppm;
  if (dropPpm < 100) return;                     // not decaying meaningfully
  if (oldest.ppm - co2Outdoor < 200) return;     // too close to outdoor

  float hours = (newest.t - oldest.t) / 3600000.0f;
  float ratio = (newest.ppm - co2Outdoor) / (float)(oldest.ppm - co2Outdoor);
  if (ratio <= 0.01f || ratio >= 1.0f) return;

  float ach = -logf(ratio) / hours;
  if (ach > 0.05f && ach < 20.0f)
    achEstimate = 0.8f * achEstimate + 0.2f * ach;   // smooth
}

/* ── presentation ───────────────────────────────────────────── */
void setLed(uint8_t r, uint8_t g, uint8_t b) {
  digitalWrite(PIN_LED_R, r); digitalWrite(PIN_LED_G, g); digitalWrite(PIN_LED_B, b);
}

void assess() {
  bool alert = co2 >= CO2_ALERT || (pmValid && pm25 >= PM25_ALERT);
  bool warn  = co2 >= CO2_WARN  || (pmValid && pm25 >= PM25_WARN);

  if      (alert) setLed(1, 0, 0);
  else if (warn)  setLed(1, 1, 0);
  else            setLed(0, 1, 0);

  static bool wasAlert = false;
  if (alert && !wasAlert) { tone(PIN_BUZZER, 2000, 400); }
  wasAlert = alert;
}

void draw() {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(2); oled.setCursor(0, 0);
  oled.printf("%d", co2);
  oled.setTextSize(1); oled.setCursor(58, 8); oled.print("ppm CO2");

  oled.setCursor(0, 22);
  if (pmValid) oled.printf("PM2.5 %d  PM10 %d ug", pm25, pm10);
  else         oled.print("PM  measuring...");

  oled.setCursor(0, 34); oled.printf("%.1fC  %.0f%%RH  %.0fhPa", tempC, rh, hPa);
  oled.setCursor(0, 46); oled.printf("ACH %.2f  fan %s", achEstimate, pmFanOn ? "on" : "off");
  oled.setCursor(0, 56);
  oled.print(co2 >= CO2_ALERT ? "VENTILATE NOW"
           : co2 >= CO2_WARN  ? "open a window"
           : "air is fine");
  oled.display();
}

/* ── MQTT ───────────────────────────────────────────────────── */
void publishDiscovery() {
  struct { const char *id, *name, *unit, *cls, *field; } S[] = {
    { "co2",  "CO2",         "ppm",    "carbon_dioxide", "co2"   },
    { "pm25", "PM2.5",       "µg/m³",  "pm25",           "pm25"  },
    { "pm10", "PM10",        "µg/m³",  "pm10",           "pm10"  },
    { "temp", "Temperature", "°C",     "temperature",    "temp"  },
    { "hum",  "Humidity",    "%",      "humidity",       "rh"    },
    { "pres", "Pressure",    "hPa",    "pressure",       "hpa"   },
  };
  for (auto &s : S) {
    JsonDocument d;
    d["name"] = s.name;
    d["unique_id"] = String(DEVICE_ID) + "_" + s.id;
    d["state_topic"] = "home/air/" DEVICE_ID "/state";
    d["unit_of_measurement"] = s.unit;
    d["device_class"] = s.cls;
    d["state_class"] = "measurement";
    d["value_template"] = String("{{ value_json.") + s.field + " }}";
    char buf[420]; size_t n = serializeJson(d, buf, sizeof(buf));
    mqtt.publish((String("homeassistant/sensor/") + DEVICE_ID + "_" + s.id + "/config").c_str(),
                 (uint8_t *)buf, n, true);
  }
}

void publishState() {
  JsonDocument d;
  d["co2"]  = co2;
  d["pm1"]  = pm1;  d["pm25"] = pm25;  d["pm10"] = pm10;
  d["pm_valid"] = pmValid;
  d["temp"] = roundf(tempC * 10) / 10.0f;
  d["rh"]   = roundf(rh);
  d["hpa"]  = roundf(hPa);
  d["ach"]  = roundf(achEstimate * 100) / 100.0f;
  char buf[256]; size_t n = serializeJson(d, buf, sizeof(buf));
  mqtt.publish("home/air/" DEVICE_ID "/state", (uint8_t *)buf, n, true);
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_PMS_SET, OUTPUT);
  pinMode(PIN_LED_R, OUTPUT); pinMode(PIN_LED_G, OUTPUT); pinMode(PIN_LED_B, OUTPUT);

  co2Serial.begin(9600, SERIAL_8N1, 16, 17);
  pmsSerial.begin(9600, SERIAL_8N1, 25, 26);

  Wire.begin(21, 22);
  bme.begin(0x76);
  bme.setSampling(Adafruit_BME280::MODE_FORCED, Adafruit_BME280::SAMPLING_X1,
                  Adafruit_BME280::SAMPLING_X1, Adafruit_BME280::SAMPLING_X1,
                  Adafruit_BME280::FILTER_OFF);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  pmsSleep(true);
  delay(3000);                    // MH-Z19B needs a moment before commands
  mhzDisableABC();
  Serial.println("ABC disabled — calibrate manually once a year");

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setBufferSize(768);

  Serial.println("Warming up — CO2 readings valid after ~3 minutes");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) {
    if (mqtt.connect(DEVICE_ID)) publishDiscovery();
  }
  mqtt.loop();
  pmService();

  static uint32_t last = 0;
  if (millis() - last >= 10000) {
    last = millis();

    int c = mhzRead();
    if (c > 300 && c < 10000) co2 = c;      // reject obvious garbage

    bme.takeForcedMeasurement();
    tempC = bme.readTemperature();
    rh    = bme.readHumidity();
    hPa   = bme.readPressure() / 100.0f;

    achUpdate();
    assess();
    draw();
    publishState();

    Serial.printf("CO2 %d ppm  PM2.5 %d  T %.1f  RH %.0f  ACH %.2f\\n",
                  co2, pm25, tempC, rh, achEstimate);
  }
}`,
    explain: [
      { ref: 'mhzDisableABC()', txt: 'The most consequential line in the sketch. With ABC enabled in a bedroom that never reaches outdoor CO₂, the sensor progressively rescales its baseline downward and under-reports by hundreds of ppm — while looking perfectly plausible.' },
      { ref: 'mhzChecksum', txt: 'The MH-Z19B protocol has a simple additive checksum. Verifying it rejects the corrupted frames you get when the UART is shared or the supply dips, which otherwise appear as wild CO₂ spikes.' },
      { ref: 'pmService() duty cycle', txt: 'Thirty seconds of fan every five minutes. The PMS5003 fan is rated for around 8000 hours; this turns under a year of continuous life into roughly a decade.' },
      { ref: 'Atmospheric values at offset 8', txt: 'The PMS5003 frame contains both "standard particle" (CF=1, factory calibration) values at offset 4 and "atmospheric environment" values at offset 8. For indoor air the atmospheric set is the correct one — mixing them up gives readings that are consistently wrong by a fixed ratio.' },
      { ref: 'achUpdate() guards', txt: 'The air-change fit only runs during a genuine decay with enough amplitude. Fitting an exponential to noise produces confident nonsense, which is worse than reporting nothing.' },
      { ref: 'if (c > 300 && c < 10000)', txt: 'Physical plausibility check. Outdoor air is about 420 ppm and nothing indoors reaches 10 000 ppm without an emergency, so anything outside that band is a communication error rather than a measurement.' },
    ],
  }],

  config: [
    'Disable ABC (as the sketch does) for bedrooms, greenhouses and any continuously occupied space. Leave it enabled only for an office that genuinely empties overnight.',
    'Set <code>co2Outdoor</code> to your local background — roughly 420 ppm globally, but 450–500 ppm in a dense city. The ACH calculation is sensitive to this.',
    'Adjust <code>PM_PERIOD_MS</code>. Five minutes suits a home; during a cooking event or a wildfire episode you may want one minute, at the cost of fan life.',
    'Thresholds here follow WHO 2021 guidance for PM2.5 and common ventilation guidance for CO₂. Adjust deliberately, and record why.',
    'Allow a three-minute warm-up before trusting CO₂ readings, and thirty seconds of fan before trusting PM readings. Both are in the datasheets and both are routinely ignored.',
  ],

  calibration: [
    { h: 'Manual CO₂ zero calibration (once a year)', p: ['Take the unit outdoors, away from roads and people, and leave it running for at least 20 minutes. Then trigger the zero calibration command (<code>mhzCalibrateZero()</code>), which tells the sensor that what it is currently seeing is 400 ppm. Do this in genuine outdoor air only — running it indoors permanently miscalibrates the sensor and there is no undo.'] },
    { h: 'Sanity-check against a second source', p: ['If you can borrow another CO₂ meter, compare in the same room. Agreement within about 100 ppm is expected. A large offset that does not respond to zero calibration means the sensor is at end of life.'] },
    { h: 'Verify the PM sensor responds', p: ['Light a match near (not at) the inlet. PM2.5 should rise into the hundreds within a minute and decay over ten to twenty minutes. No response means the fan is not running or the SET pin logic is inverted.'] },
    { h: 'Check the temperature offset', p: ['Compare the BME280 against a reference thermometer. If it reads consistently high, the MH-Z19B or the regulator is heating it — move it before applying a software offset.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Bedroom monitor', sub: 'ESP32' }, { name: 'Kitchen monitor', sub: 'optional 2nd' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'IoT VLAN',
      uplink: 'MQTT 1883', cloud: 'Mosquitto + InfluxDB', cloudSub: 'local Pi',
      clients: [{ name: 'Home Assistant', sub: 'six entities' }, { name: 'Grafana', sub: 'overnight trends' }],
    },
    topics: [
      { t: 'home/air/air-bedroom/state', dir: 'device → broker (retained)', payload: 'JSON: co2, pm1, pm25, pm10, pm_valid, temp, rh, hpa, ach' },
      { t: 'homeassistant/sensor/air-bedroom_*/config', dir: 'device → broker (retained)', payload: 'Discovery documents, one per measurement' },
    ],
    dashboard: [
      'The panel that changes behaviour is an overnight CO₂ chart with the bedroom door state overlaid. Watching CO₂ climb from 500 to 2800 ppm between 23:00 and 06:00 with the door closed, and stay under 900 with it ajar, is more persuasive than any amount of explanation.',
      'A second useful panel plots PM2.5 with cooking times marked. Most people substantially underestimate how long indoor particulates persist after frying — typically 45–90 minutes without extraction.',
    ],
    security: [
      'These are environmental readings rather than personal data, but CO₂ is a very good occupancy signal — it reveals when a house is empty. Keep it on your own broker rather than a public cloud service.',
      'Use broker authentication so a neighbour cannot infer your schedule from your ventilation data.',
    ],
  },

  testing: [
    { step: 'Power on and wait three minutes', expect: 'CO₂ settles to a plausible indoor value (450–900 ppm in a ventilated room), not 400 or 5000.' },
    { step: 'Breathe gently towards the CO₂ inlet from 20 cm', expect: 'A rise into the thousands within 30 s, decaying back over a minute or two.' },
    { step: 'Watch a full PM duty cycle', expect: 'Fan audibly starts, runs 30 s, PM values update, fan stops. Repeats five minutes later.' },
    { step: 'Light a match near the PM inlet', expect: 'PM2.5 rises sharply and decays over 10–20 minutes.' },
    { step: 'Close a bedroom door overnight with the monitor inside', expect: 'CO₂ climbing steadily to 1500–3000 ppm by morning — the reading that makes the project worthwhile.' },
    { step: 'Open the door and window in the morning', expect: 'Exponential decay, and an ACH estimate appearing after about ten minutes of decline.' },
    { step: 'Check Home Assistant', expect: 'Six separate sensor entities appear automatically with correct units and device classes.' },
    { step: 'Compare BME280 temperature to a reference', expect: 'Within about 1 °C, with no upward drift after an hour.' },
  ],

  troubleshoot: [
    {
      sym: 'CO₂ always reads exactly 400 or 410 ppm indoors',
      cause: 'The sensor is still in its warm-up period, or ABC has miscalibrated it after a bad zero calibration.',
      fix: 'Wait three minutes from power-on. If it persists, the sensor has been zero-calibrated in indoor air, which permanently offsets it. Take it genuinely outdoors for 20 minutes and re-run the zero calibration correctly.',
    },
    {
      sym: 'CO₂ reads −1 or the value jumps wildly',
      cause: 'Failed checksum or a partial UART frame.',
      fix: 'The sketch already validates the checksum and returns −1. Flush the buffer before each request, confirm the sensor has a solid 5 V supply, and verify TX and RX are crossed — MH-Z19B TX goes to ESP32 RX.',
    },
    {
      sym: 'PM values are always zero',
      cause: 'The fan is not running, or the SET pin logic is inverted.',
      fix: 'Listen for the fan. If silent, check that SET is HIGH for normal operation and that the sensor has 5 V. Some clone modules invert SET; try tying it to 5 V permanently as a test before adding the duty cycling back.',
    },
    {
      sym: 'PM readings look plausible but are consistently double or half a reference meter',
      cause: 'Reading the wrong set of values from the frame.',
      fix: 'Use the atmospheric-environment values at byte offset 8, not the standard-particle values at offset 4. The two differ by a roughly constant factor, which makes this bug look like a calibration problem.',
    },
    {
      sym: 'CO₂ readings drift downward over months',
      cause: 'ABC is still enabled and the room never reaches outdoor levels, so the sensor keeps rescaling its baseline.',
      fix: 'Verify the ABC-disable command is being sent after the sensor has finished booting — sending it in the first second is often ignored. Add a three-second delay before the command and confirm it takes effect by checking that readings stop drifting over a fortnight.',
    },
    {
      sym: 'Temperature reads two or three degrees high',
      cause: 'The MH-Z19B lamp or the buck converter is heating the BME280.',
      fix: 'Physically separate them. The CO₂ sensor is a real heat source. Ventilation slots in the enclosure between the two also help; a software offset is the wrong fix because the error varies with duty cycle.',
    },
  ],

  perf: [
    'Duty cycle the particulate fan. It is the only mechanical part and its life dominates the device\'s service interval.',
    'Read the CO₂ sensor no more than once every ten seconds. Its internal update rate is around 5 s and polling faster adds UART traffic for no new information.',
    'Keep the two sensors on separate hardware UARTs rather than software serial — a dropped byte on a shared or bit-banged port shows up as a wild reading.',
  ],

  safety: [
    'This is a monitor, not a life-safety device. It does not detect carbon <em>monoxide</em>, which is the one that kills — fit a separate certified CO alarm.',
    'Do not use CO₂ readings to justify sealing a room. High CO₂ means more ventilation is needed, never less.',
    'The PMS5003 contains a class-1 laser inside a sealed chamber. Do not disassemble it.',
  ],

  maintenance: [
    'Zero-calibrate the CO₂ sensor outdoors once a year with ABC disabled.',
    'Blow out the PM sensor inlet with clean dry air every six months; do not use a brush inside it.',
    'Replace the PMS5003 after about five years of duty-cycled use — the fan and the laser both degrade.',
  ],

  future: [
    'Add an <b>SGP41 or BME688</b> for a genuine VOC index. Unlike an MQ-135 these are calibrated, temperature-compensated and give a meaningful relative index.',
    'Add <b>automatic ventilation control</b> — an ERV or an extractor fan driven by the CO₂ threshold closes the loop.',
    'Add <b>radon measurement</b> with an RD200M, which is the one indoor pollutant with a clear long-term mortality link and no perceptible signature.',
    'Log <b>PM2.5 indoors and outdoors simultaneously</b> and compute the infiltration ratio — that number tells you exactly how much a filter or better sealing would achieve.',
    'Add a <b>formaldehyde sensor</b> if you have new furniture or flooring; it is a common and long-lasting indoor pollutant that none of these sensors detect.',
  ],

  faq: [
    { q: 'Can I use an MQ-135 instead of the MH-Z19B and save ₹2,400?', a: 'You can build something, but it will not measure CO₂. The MQ-135 responds to alcohols, ammonia, benzene, smoke and CO₂ with no way to distinguish them, and its output drifts with humidity and temperature. Every "MQ-135 CO₂ in ppm" tutorial applies a formula derived from a datasheet curve that does not represent CO₂ at all. It is a fine "something is different" sensor and a useless CO₂ meter.' },
    { q: 'What CO₂ level should I actually worry about?', a: 'Outdoor is about 420 ppm. Below 800 ppm indoors indicates good ventilation. Above 1000 ppm is the common trigger for "open a window", and there is reasonable evidence of measurable cognitive effects in that range and above. Above 2000 ppm people report stuffiness and headaches. It is not directly toxic until far higher — the number matters because of what it implies about ventilation, not because of the CO₂ itself.' },
    { q: 'Should I disable ABC or not?', a: 'Disable it for a bedroom, a greenhouse, or any space that does not empty regularly. Leave it enabled for an office or classroom that is genuinely unoccupied for several hours most days. With ABC off you must zero-calibrate manually about once a year, which takes twenty minutes outdoors.' },
    { q: 'Why not combine everything into one AQI number?', a: 'Because the correct responses are opposite. High CO₂ means open a window; high outdoor-origin PM2.5 means close it. A composite index that averages them can tell you to do the wrong thing, and it hides which pollutant is actually elevated. Report them separately and let the reader act.' },
    { q: 'How long does the particulate sensor last?', a: 'The fan is rated around 8000 hours, so continuous running gives under a year. With the 30-seconds-in-300 duty cycle used here that becomes roughly a decade of wall-clock time, though the laser diode and the optical chamber will also degrade — plan on about five years in practice.' },
    { q: 'Is the air-change-rate number trustworthy?', a: 'It is a good estimate under the right conditions: a genuine decay, at least 200 ppm above outdoor, and no one entering the room. The sketch checks all three before fitting. It assumes perfect mixing, which a real room does not have, so treat it as accurate to within about 30 % — which is still far more useful than no number at all.' },
  ],

  refs: [
    { t: 'MH-Z19B intelligent infrared CO₂ module — user manual', u: 'https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19b-co2-ver1_0.pdf', s: 'Winsen' },
    { t: 'Plantower PMS5003 digital universal particle concentration sensor — manual', u: 'https://www.aqmd.gov/docs/default-source/aq-spec/resources-page/plantower-pms5003-manual_v2-3.pdf', s: 'Plantower / South Coast AQMD' },
    { t: 'WHO global air quality guidelines 2021 — PM2.5, PM10, NO₂, O₃', u: 'https://www.who.int/publications/i/item/9789240034228', s: 'World Health Organization' },
    { t: 'Allen et al., "Associations of Cognitive Function Scores with Carbon Dioxide, Ventilation, and VOC Exposures"', u: 'https://doi.org/10.1289/ehp.1510037', s: 'Environmental Health Perspectives, 2016' },
    { t: 'ASHRAE Standard 62.1 — ventilation for acceptable indoor air quality', u: 'https://www.ashrae.org/technical-resources/bookstore/standards-62-1-62-2', s: 'ASHRAE' },
    { t: 'Using CO₂ as a ventilation and infection-risk proxy', u: 'https://www.cdc.gov/niosh/ventilation/', s: 'US CDC / NIOSH' },
    { t: 'Beer-Lambert law and NDIR gas measurement', u: 'https://en.wikipedia.org/wiki/Nondispersive_infrared_sensor', s: 'Wikipedia' },
  ],

  images: ['sensor', 'esp32', 'grafana'],
  imageCaptions: [
    'A sensor breakout module. The NDIR and laser sensors used here are considerably larger, because optical path length and a controlled airflow chamber cannot be miniaturised away.',
    'An ESP32 development board, which supplies the three hardware UARTs this build needs.',
    'A time-series dashboard. The overnight CO₂ chart is the single most behaviour-changing output of this project.',
  ],
},

];
