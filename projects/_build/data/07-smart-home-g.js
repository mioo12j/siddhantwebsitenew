/* ═══════════════════════════════════════════════════════════════════
   Smart Home — projects 013–014
════════════════════════════════════════════════════════════════════ */
'use strict';

module.exports = [

/* ── 013 · Smart Mirror ──────────────────────────────────────────── */
{
  id: '013',
  domainKey: 'iot',
  emoji: '🪞',
  thumb: 'dashboard',
  difficulty: 'Intermediate',
  hours: '14–20 hours',
  iso8601: 'PT17H',
  tagline: 'A two-way mirror with a display behind it showing weather, calendar, transit and reminders — built so it is genuinely readable, genuinely private, and switches itself off when nobody is standing there.',

  overview: [
    'A smart mirror is one of the few projects where the software is easy and the physics is not. Getting a browser to render a dashboard takes an afternoon. Getting text that is crisp and bright through a semi-reflective surface, in a bathroom, without the mirror looking like a dark grey rectangle when it is off, is where all the real decisions are.',
    'The core component is a <b>two-way mirror</b> — a sheet of glass or acrylic with a partial metallic coating that reflects most incident light and transmits the rest. The transmission ratio is the fundamental trade-off. A 70/30 mirror (70 % reflected, 30 % transmitted) looks like a proper mirror and needs a very bright display behind it. A 50/50 looks slightly grey as a mirror but shows text beautifully. There is no setting that is excellent at both, and choosing deliberately is the single most consequential decision in the build.',
    'Everything else follows from that constraint. The display must be bright, so an old laptop panel or a cheap monitor with its bezel removed is used at maximum backlight. The interface must be <b>white or light grey text on pure black</b>, because black pixels transmit no light and read as mirror — any coloured background becomes a washed-out haze. And font sizes need to be far larger than a normal dashboard, because contrast through the mirror is inherently reduced.',
    'The controller is a Raspberry Pi running a full browser in kiosk mode, which is the pragmatic choice: you get real web rendering, real fonts, and access to any API you want with a few lines of JavaScript. A presence sensor blanks the display when nobody is there, which both saves power and — more importantly — means the mirror is a mirror when you are not using it.',
  ],

  does: [
    'Displays time, date, weather, forecast, calendar events, transit departures and a reminder list.',
    'Blanks the display when nobody has been detected for two minutes, so it reads as a plain mirror.',
    'Dims automatically with ambient light so it is not dazzling in a dark bathroom at 6 a.m.',
    'Pulls data from local and public APIs on a schedule, with a cached fallback when offline.',
    'Serves a small configuration page on the LAN so layout and feeds can be changed without a keyboard.',
    'Runs entirely on your own hardware with no third-party mirror service or account.',
    'Recovers automatically from a crash, a network outage or a power cut with no interaction.',
  ],

  features: [
    '<b>Pure-black interface</b> with high-contrast white type — the only design that reads well through a two-way mirror.',
    '<b>Presence-gated display</b> via mmWave or PIR, with a slow fade rather than an abrupt switch.',
    '<b>Ambient light dimming</b> using a BH1750, mapped through a perceptual curve.',
    '<b>Offline cache</b> so a network outage shows the last known data with a staleness indicator rather than an error.',
    '<b>Modular widget layout</b> defined in a single JSON file, editable from a phone.',
    '<b>Systemd supervision</b> with automatic restart, so a browser crash is invisible.',
    '<b>Read-only root filesystem option</b> so an unclean power cut cannot corrupt the SD card.',
    '<b>No cloud dependency</b> — every API key stays on the device and every request is made from it.',
  ],

  applications: [
    { t: 'Bathroom or hallway morning dashboard', d: 'The information you actually want while getting ready, in a place you are already looking.' },
    { t: 'Entrance-hall departure board', d: 'Live transit times at the door remove the "should I run" question entirely.' },
    { t: 'Family calendar and chores', d: 'A shared display in a shared space gets read; a shared calendar app does not.' },
    { t: 'Office reception', d: 'Meeting room status and visitor information without an obvious screen.' },
    { t: 'Gym or studio', d: 'A mirror is already required; the workout timer and metrics come free.' },
    { t: 'Accessible information display', d: 'Very large high-contrast type at a fixed location suits users who struggle with a phone.' },
  ],

  skills: [
    'Raspberry Pi OS setup and the command line',
    'HTML, CSS and enough JavaScript to fetch and render JSON',
    'systemd service files and autostart',
    'Basic woodworking or frame assembly',
    'Working with glass or acrylic safely',
  ],

  parts: ['rpi4', 'bh1750', 'pir', 'sdcard', 'psu5v', 'perfboard'],
  extraParts: [
    { name: 'Two-way acrylic mirror, 3 mm', spec: '600 × 400 mm, 50/50 or 70/30 transmission', qty: 1, price: 2400, note: 'Acrylic is lighter, cheaper and safer than glass; glass is scratch-resistant and optically better. Choose deliberately.' },
    { name: 'LCD monitor or laptop panel + driver board', spec: '15–24″, 1080p, bezel removable', qty: 1, price: 3500, note: 'A second-hand monitor is usually cheaper than a bare panel plus driver board.' },
    { name: 'Timber frame stock + black felt', spec: '40 × 20 mm pine, self-adhesive felt', qty: 1, price: 600, note: 'The felt lines the cavity — any reflective internal surface shows through as a grey patch.' },
    { name: 'LD2410 mmWave presence sensor', spec: '24 GHz, 0.75–6 m, UART', qty: 1, price: 550, note: 'Detects a stationary person, which a PIR cannot. Worth the upgrade for a mirror.' },
    { name: 'HDMI cable (right-angle) and short power leads', spec: 'Low profile to fit the cavity depth', qty: 1, price: 300 },
  ],
  cost: '₹11,000 – ₹16,000',
  libs: ['python', 'flask', 'gpiozero', 'sqlite'],
  ide: 'Raspberry Pi OS Bookworm (64-bit) + Chromium kiosk mode + Python 3.11',

  pins: {
    left: [
      { dev: 'LD2410 presence sensor', devPin: 'TX / RX', pin: 'GPIO 15 / 14', sig: 'UART 256000 baud' },
      { dev: 'BH1750 light sensor', devPin: 'SDA / SCL', pin: 'GPIO 2 / 3', sig: 'I²C at 0x23' },
      { dev: 'Optional PIR fallback', devPin: 'OUT', pin: 'GPIO 17', sig: 'High on motion' },
    ],
    right: [
      { dev: 'Monitor via HDMI', devPin: 'HDMI', pin: 'HDMI0', sig: 'Display output' },
      { dev: 'Monitor backlight control', devPin: 'DDC/CI over HDMI', pin: '—', sig: 'Software brightness' },
      { dev: 'Status LED (build only)', devPin: 'Anode', pin: 'GPIO 27', sig: 'Remove before final assembly' },
    ],
  },
  wiringNotes: [
    'The <b>cavity behind the mirror must be matte black</b>. Any bare timber, any shiny screw head, any reflective cable will appear as a visible grey patch through the mirror. Line everything with black felt or paint it matte black.',
    'Mount the panel so its surface is <b>as close to the mirror as possible</b> — ideally touching through a thin felt gasket. Any air gap creates a secondary reflection and a visible ghost image offset from the text.',
    'Remove the monitor bezel entirely. A bezel edge inside the cavity shows as a hard rectangle outline through the mirror.',
    'Heat is a real issue in a sealed frame. A Pi 4 plus a monitor driver board in a closed cavity will reach 60 °C. Cut ventilation slots at the top and bottom of the frame, hidden behind the frame lip.',
    'Route the HDMI with a right-angle connector — a standard plug adds 25 mm of depth and is usually what forces a thicker frame than you wanted.',
    'The LD2410 mmWave sensor must be behind the mirror but not behind the metal-coated area if you use glass — a metallic coating attenuates 24 GHz significantly. Acrylic two-way mirror film is far more transparent to it.',
  ],

  block: {
    columns: [
      { label: 'Input', blocks: [{ name: 'LD2410 presence', sub: 'mmWave 24 GHz' }, { name: 'BH1750', sub: 'ambient lux' }, { name: 'Config page', sub: 'from phone' }] },
      { label: 'Fetch', edge: 'schedule', blocks: [{ name: 'Python daemon', sub: 'API polling', highlight: true }, { name: 'SQLite cache', sub: 'offline fallback' }] },
      { label: 'Render', edge: 'JSON', blocks: [{ name: 'Chromium kiosk', sub: 'black-on-black UI', highlight: true }, { name: 'Brightness map', sub: 'perceptual' }] },
      { label: 'Show', edge: 'rendered frame', blocks: [{ name: 'LCD panel', sub: 'max backlight' }, { name: 'Two-way mirror', sub: '50/50 or 70/30' }] },
    ],
  },

  flow: [
    { t: 'Boot: start daemon, launch Chromium kiosk', k: 'start' },
    { t: 'Poll APIs on their own schedules', k: 'proc' },
    { t: 'Fetch succeeded?', k: 'dec', yes: 'cache it', no: 'serve cached + staleness flag', back: 1 },
    { t: 'Read presence sensor and lux', k: 'proc' },
    { t: 'Person present in the last 2 min?', k: 'dec', yes: 'display on', no: 'fade to black', back: 3 },
    { t: 'Map lux to backlight, apply smoothly', k: 'io' },
    { t: 'Push updated JSON to the page over SSE', k: 'io' },
    { t: 'Loop', k: 'end' },
  ],

  principle: [
    'A <b>two-way mirror</b> is a partially reflective coating — usually a very thin aluminium or silver layer — on a transparent substrate. It has no directional property at all, which is the most common misconception about it. What makes one side look like a mirror and the other like a window is purely the <b>lighting ratio</b>: the side that is brighter sees a reflection, and the side that is darker sees through. That is why a smart mirror works — the room is lit and the cavity is dark, so from the room you see a mirror, except where the bright display overcomes the reflection.',
    'The transmission figure sets everything else. With a 70/30 mirror, only 30 % of the display\'s light reaches your eye, and it competes with 70 % of the room light reflecting back. To read comfortably the display must be substantially brighter than the reflected room light at that point. In a bright bathroom that requires a genuinely bright panel at full backlight. A 50/50 mirror halves the problem but leaves the mirror function noticeably dimmer than a real mirror.',
    'That is why the interface must be <b>black with white text</b>. A black pixel emits nothing, so the mirror coating reflects normally and that area looks like ordinary mirror. A white pixel emits at full brightness and punches through. Any intermediate colour produces a grey haze that reads as neither. This is also why photographs, coloured charts and background images look terrible on a smart mirror even though they look fine on the same monitor.',
    'The <b>presence sensor choice</b> is more interesting than it appears. A PIR detects change in infrared, so it detects a person walking in and then stops detecting them thirty seconds later while they stand still brushing their teeth — precisely when you want the display on. An LD2410 mmWave sensor transmits a 24 GHz signal and measures the Doppler shift and phase of the return, which detects the micro-movements of breathing. It reports a stationary person indefinitely, and that single difference transforms the experience.',
    'Finally, <b>ambient brightness mapping</b>. Perceived brightness is roughly logarithmic in luminance, and ambient light in a bathroom spans four orders of magnitude between night and a sunny morning. A linear mapping from lux to backlight leaves the display either dazzling at night or invisible in daylight. Mapping through a logarithm, with a floor so it never goes fully dark while in use, is what makes it comfortable at both extremes.',
  ],

  equations: [
    { t: 'Contrast through a two-way mirror', eq: 'Let  T = transmission, R = reflection (T + R ≈ 1 − absorption)\n\nApparent display luminance  = L_display × T\nApparent reflected room light = L_room × R\n\nContrast ratio at a white pixel:\n  C = (L_display × T + L_room × R) / (L_room × R)\n\n70/30 mirror, 250 cd/m² panel, 150 cd/m² room reflection source:\n  display contribution = 250 × 0.30 = 75\n  reflected            = 150 × 0.70 = 105\n  C = (75 + 105) / 105 = 1.71   ← poor, text looks washed out\n\n50/50 mirror, same panel:\n  display  = 125,  reflected = 75\n  C = (125 + 75) / 75 = 2.67    ← readable\n\nThis is the entire argument for choosing 50/50 in a bright room.' },
    { t: 'Perceptual brightness mapping', eq: 'Ambient range: 0.5 lx (night) to 2000 lx (sunny bathroom)\nBacklight range: 8 % (minimum comfortable) to 100 %\n\n  b = b_min + (b_max − b_min) × log10(1 + lux/λ) / log10(1 + lux_max/λ)\n\nWith λ = 10, lux_max = 2000:\n  lux =    1 → b = 8 + 92 × 0.041/1.32 =  10.9 %\n  lux =   50 → b = 8 + 92 × 0.778/1.32 =  62.2 %\n  lux =  400 → b = 8 + 92 × 1.613/1.32 = 100.0 % (clamped)\n\nA linear map would put 50 lx at 2.3 % — invisible.' },
  ],

  steps: [
    {
      h: 'Prepare the Pi for kiosk operation',
      p: ['The goal is a machine that boots straight into a full-screen browser, never shows a cursor or a desktop, and recovers from anything without a keyboard.'],
      code: {
        file: '01-setup.sh', lang: 'bash',
        body: `#!/usr/bin/env bash
set -euo pipefail

# Raspberry Pi OS Bookworm (64-bit), Wayland/labwc session.
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y chromium-browser unclutter python3-venv python3-lgpio \\
                    python3-smbus i2c-tools ddcutil

# Enable I2C and the hardware UART; disable the serial console so the
# LD2410 has the port to itself.
sudo raspi-config nonint do_i2c 0
sudo raspi-config nonint do_serial_hw 0
sudo raspi-config nonint do_serial_cons 1

# Never blank the screen or start a screensaver — we control blanking.
sudo tee /etc/X11/xorg.conf.d/10-blanking.conf >/dev/null <<'EOF'
Section "ServerFlags"
    Option "BlankTime"   "0"
    Option "StandbyTime" "0"
    Option "SuspendTime" "0"
    Option "OffTime"     "0"
EndSection
EOF

python3 -m venv ~/mirror-venv
~/mirror-venv/bin/pip install flask requests icalendar pytz smbus2

# Rotate the display if the panel is mounted portrait.
# sudo sed -i 's/^display_rotate=.*//' /boot/firmware/config.txt
# echo "display_rotate=1" | sudo tee -a /boot/firmware/config.txt

echo "Reboot, then install the systemd units."`,
        explain: [
          { ref: 'do_serial_cons 1', txt: 'Disables the login console on the UART while leaving the hardware UART enabled. Without this the kernel prints boot messages to the same port the presence sensor uses, and the sensor never syncs.' },
          { ref: 'BlankTime 0 etc.', txt: 'The display must never blank on its own schedule, because the presence logic owns blanking. Two things independently deciding when to turn the screen off produces a mirror that flickers on and off unpredictably.' },
          { ref: 'ddcutil', txt: 'Controls monitor backlight over DDC/CI, which is the correct way to dim an external panel. Software gamma dimming reduces contrast, which is exactly what you cannot afford through a mirror.' },
          { ref: 'venv rather than system pip', txt: 'Bookworm marks the system Python as externally managed and refuses global pip installs. A virtual environment is not optional here.' },
        ],
      },
    },
    {
      h: 'Write the data daemon with an offline cache',
      p: ['A dashboard that shows a stack-trace or a blank panel when the internet hiccups is worse than one that shows yesterday\'s weather with a small "stale" marker. Cache everything.'],
      code: {
        file: 'mirror_daemon.py', lang: 'python',
        body: `#!/usr/bin/env python3
"""Smart mirror data daemon.

Polls each feed on its own schedule, caches every successful response in
SQLite, and serves the merged state to the browser over Server-Sent
Events. A failed fetch never removes data — it only marks it stale.
"""
from __future__ import annotations

import json
import sqlite3
import threading
import time
from dataclasses import dataclass
from pathlib import Path

import requests
from flask import Flask, Response, jsonify, request, send_from_directory

DB = Path.home() / "mirror.db"
CONF = Path.home() / "mirror-config.json"
app = Flask(__name__, static_folder=str(Path.home() / "mirror-ui"))

state: dict = {}
state_lock = threading.Lock()


@dataclass
class Feed:
    key: str
    url: str
    period: int          # seconds between polls
    parse: str           # name of the transform to apply


def db() -> sqlite3.Connection:
    con = sqlite3.connect(DB, check_same_thread=False)
    con.execute("CREATE TABLE IF NOT EXISTS cache"
                "(key TEXT PRIMARY KEY, payload TEXT, fetched REAL)")
    return con


def cache_put(key: str, payload: dict) -> None:
    with db() as con:
        con.execute("INSERT OR REPLACE INTO cache VALUES (?,?,?)",
                    (key, json.dumps(payload), time.time()))


def cache_get(key: str) -> tuple[dict | None, float]:
    with db() as con:
        row = con.execute("SELECT payload, fetched FROM cache WHERE key=?",
                          (key,)).fetchone()
    return (json.loads(row[0]), row[1]) if row else (None, 0.0)


# ---- transforms -----------------------------------------------------
def parse_weather(raw: dict) -> dict:
    cur = raw["current"]
    daily = raw["daily"]
    return {
        "temp": round(cur["temperature_2m"]),
        "feels": round(cur["apparent_temperature"]),
        "code": cur["weather_code"],
        "wind": round(cur["wind_speed_10m"]),
        "today_min": round(daily["temperature_2m_min"][0]),
        "today_max": round(daily["temperature_2m_max"][0]),
        "rain_mm": round(daily["precipitation_sum"][0], 1),
        "forecast": [
            {"day": d[:10], "min": round(lo), "max": round(hi)}
            for d, lo, hi in zip(daily["time"][1:4],
                                 daily["temperature_2m_min"][1:4],
                                 daily["temperature_2m_max"][1:4])
        ],
    }


TRANSFORMS = {"weather": parse_weather}


def poll(feed: Feed) -> None:
    """One worker thread per feed. Never dies; never clears the cache."""
    while True:
        try:
            r = requests.get(feed.url, timeout=12)
            r.raise_for_status()
            data = r.json()
            if feed.parse in TRANSFORMS:
                data = TRANSFORMS[feed.parse](data)
            cache_put(feed.key, data)
            with state_lock:
                state[feed.key] = {"data": data, "stale": False, "at": time.time()}
        except Exception as exc:                       # noqa: BLE001
            cached, when = cache_get(feed.key)
            with state_lock:
                state[feed.key] = {
                    "data": cached,
                    "stale": True,
                    "age_min": round((time.time() - when) / 60) if when else None,
                    "error": type(exc).__name__,
                }
        time.sleep(feed.period)


# ---- HTTP -----------------------------------------------------------
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/state")
def api_state():
    with state_lock:
        return jsonify(state)


@app.route("/api/events")
def api_events():
    """Server-Sent Events: the browser never polls, it just listens."""
    def stream():
        last = None
        while True:
            with state_lock:
                snapshot = json.dumps(state, default=str)
            if snapshot != last:
                last = snapshot
                yield f"data: {snapshot}\\n\\n"
            time.sleep(1)
    return Response(stream(), mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache",
                             "X-Accel-Buffering": "no"})


@app.route("/api/config", methods=["GET", "POST"])
def api_config():
    if request.method == "POST":
        CONF.write_text(json.dumps(request.get_json(), indent=2))
        return jsonify({"ok": True, "restart_required": True})
    return jsonify(json.loads(CONF.read_text()))


def main() -> None:
    cfg = json.loads(CONF.read_text())
    for f in cfg["feeds"]:
        feed = Feed(**f)
        threading.Thread(target=poll, args=(feed,), daemon=True).start()
    app.run(host="0.0.0.0", port=8080, threaded=True)


if __name__ == "__main__":
    main()`,
        explain: [
          { ref: 'One thread per feed', txt: 'Feeds have wildly different natural rates — weather every 15 minutes, transit every 60 seconds, calendar every 5 minutes. Independent threads mean a slow or failing feed cannot delay the others.' },
          { ref: 'cache_get on exception', txt: 'The failure path serves the last good value and marks it stale with an age. A dashboard showing 40-minute-old weather is useful; one showing an error is not.' },
          { ref: 'Server-Sent Events rather than polling', txt: 'SSE is one long-lived HTTP response the server writes into. It is far simpler than WebSockets for one-way data, reconnects automatically in every browser, and means the page never polls.' },
          { ref: 'json.dumps comparison before yield', txt: 'Only push when something actually changed. Pushing every second forces a re-render, and on a Pi that is wasted CPU and, at night, a visible flicker.' },
        ],
      },
    },
    {
      h: 'Control presence and brightness',
      p: ['This is the part that makes it feel finished rather than like a monitor with a mirror stuck on it.'],
      code: {
        file: 'presence.py', lang: 'python',
        body: `#!/usr/bin/env python3
"""Presence-gated display blanking and ambient brightness control."""
import math
import subprocess
import time

import serial
import smbus2

I2C_BUS, BH1750_ADDR = 1, 0x23
PRESENT_HOLD_S = 120
B_MIN, B_MAX = 8, 100
LUX_MAX, LAMBDA = 2000.0, 10.0

bus = smbus2.SMBus(I2C_BUS)
ld2410 = serial.Serial("/dev/serial0", 256000, timeout=0.2)


def read_lux() -> float:
    bus.write_byte(BH1750_ADDR, 0x10)          # continuous high-res mode
    time.sleep(0.15)
    hi, lo = bus.read_i2c_block_data(BH1750_ADDR, 0x00, 2)
    return ((hi << 8) | lo) / 1.2


def read_presence() -> bool:
    """LD2410 engineering frames start F4 F3 F2 F1 and end F8 F7 F6 F5."""
    data = ld2410.read(64)
    idx = data.find(b"\\xf4\\xf3\\xf2\\xf1")
    if idx < 0 or len(data) < idx + 12:
        return False
    target_state = data[idx + 8]
    return target_state in (1, 2, 3)           # moving, stationary, or both


def brightness_for(lux: float) -> int:
    lux = max(0.0, min(lux, LUX_MAX))
    frac = math.log10(1 + lux / LAMBDA) / math.log10(1 + LUX_MAX / LAMBDA)
    return int(B_MIN + (B_MAX - B_MIN) * frac)


def set_backlight(pct: int) -> None:
    # DDC/CI keeps full contrast, unlike gamma dimming.
    subprocess.run(["ddcutil", "setvcp", "10", str(pct)],
                   check=False, capture_output=True)


def set_display(on: bool) -> None:
    subprocess.run(["wlr-randr", "--output", "HDMI-A-1",
                    "--on" if on else "--off"],
                   check=False, capture_output=True)


def main() -> None:
    last_seen = 0.0
    display_on = True
    current_b = B_MAX
    set_display(True)

    while True:
        if read_presence():
            last_seen = time.time()

        should_be_on = (time.time() - last_seen) < PRESENT_HOLD_S
        if should_be_on != display_on:
            display_on = should_be_on
            set_display(display_on)

        if display_on:
            want = brightness_for(read_lux())
            # Move at most 5 points per second so it is never a visible jump.
            if abs(want - current_b) > 1:
                current_b += 5 if want > current_b else -5
                current_b = max(B_MIN, min(B_MAX, current_b))
                set_backlight(current_b)

        time.sleep(1.0)


if __name__ == "__main__":
    main()`,
        explain: [
          { ref: 'target_state in (1, 2, 3)', txt: 'The LD2410 distinguishes moving targets, stationary targets, and both. Accepting stationary is the entire reason for using mmWave over a PIR — a person standing still at a mirror is exactly the case a PIR fails.' },
          { ref: 'ddcutil setvcp 10', txt: 'VCP code 0x10 is the standard DDC/CI brightness control. It adjusts the actual backlight, preserving full contrast — unlike gamma dimming, which crushes the black level you depend on for the mirror effect.' },
          { ref: 'brightness moves 5 points per second', txt: 'A step change in backlight is very visible in a dark room. Ramping makes it imperceptible, which is the difference between a device that feels considered and one that feels twitchy.' },
          { ref: 'PRESENT_HOLD_S = 120', txt: 'Two minutes of grace after the last detection. Shorter and the display blanks while you are looking at it during a lull in detection; longer and the mirror is a screen for too much of the day.' },
        ],
      },
    },
  ],

  code: [{
    file: 'index.html', lang: 'html',
    body: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Mirror</title>
<style>
  /* Pure black everywhere. Any non-black pixel becomes visible haze
     through the two-way mirror, so the palette is deliberately tiny. */
  :root{
    --fg:#ffffff; --dim:#8a8a8a; --faint:#4a4a4a;
    --gap:2.4rem;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%;background:#000;color:var(--fg);overflow:hidden;
    font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:200;
    -webkit-font-smoothing:antialiased;cursor:none}
  #grid{height:100%;display:grid;padding:var(--gap);gap:var(--gap);
    grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto}

  .clock{grid-column:1/-1;text-align:center}
  .clock .time{font-size:8rem;line-height:1;font-weight:100;letter-spacing:-.03em}
  .clock .date{font-size:1.6rem;color:var(--dim);margin-top:.4rem;letter-spacing:.06em}

  .panel h2{font-size:.85rem;letter-spacing:.28em;text-transform:uppercase;
    color:var(--faint);margin-bottom:.9rem;font-weight:400}

  .wx{display:flex;align-items:baseline;gap:1.2rem}
  .wx .now{font-size:4.5rem;font-weight:100;line-height:1}
  .wx .meta{font-size:1.15rem;color:var(--dim);line-height:1.6}
  .fc{display:flex;gap:2rem;margin-top:1.2rem;font-size:1.05rem;color:var(--dim)}
  .fc div{text-align:center}
  .fc .d{color:var(--faint);font-size:.85rem;letter-spacing:.1em}

  .cal li,.dep li{list-style:none;font-size:1.3rem;padding:.45rem 0;
    display:flex;justify-content:space-between;gap:1.4rem;
    border-bottom:1px solid #141414}
  .cal li:last-child,.dep li:last-child{border-bottom:0}
  .cal .when,.dep .in{color:var(--dim);font-variant-numeric:tabular-nums;white-space:nowrap}
  .dep .soon{color:#fff;font-weight:400}

  .footer{grid-column:1/-1;display:flex;justify-content:space-between;
    align-items:flex-end;font-size:1rem;color:var(--faint)}
  .stale{color:#9a7a2a}

  /* Fade the whole page rather than cutting the backlight abruptly. */
  body{transition:opacity 1.2s ease}
  body.away{opacity:0}
</style>
</head>
<body>
<div id="grid">
  <div class="clock">
    <div class="time" id="time">--:--</div>
    <div class="date" id="date"></div>
  </div>

  <section class="panel">
    <h2>Weather</h2>
    <div class="wx">
      <div class="now" id="wxTemp">--°</div>
      <div class="meta">
        <div id="wxDesc">—</div>
        <div id="wxRange">—</div>
        <div id="wxWind">—</div>
      </div>
    </div>
    <div class="fc" id="wxForecast"></div>
  </section>

  <section class="panel">
    <h2>Today</h2>
    <ul class="cal" id="calList"><li><span>No events</span></li></ul>
    <h2 style="margin-top:2rem">Departures</h2>
    <ul class="dep" id="depList"><li><span>—</span></li></ul>
  </section>

  <div class="footer">
    <span id="reminders"></span>
    <span id="status"></span>
  </div>
</div>

<script>
const WX_CODE = {
  0:'Clear', 1:'Mainly clear', 2:'Partly cloudy', 3:'Overcast',
  45:'Fog', 48:'Rime fog', 51:'Light drizzle', 61:'Light rain',
  63:'Rain', 65:'Heavy rain', 71:'Snow', 80:'Showers', 95:'Thunderstorm'
};

function tick() {
  const d = new Date();
  document.getElementById('time').textContent =
    d.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
  document.getElementById('date').textContent =
    d.toLocaleDateString('en-GB', {weekday:'long', day:'numeric', month:'long'});
}
setInterval(tick, 1000); tick();

function renderWeather(w, stale, ageMin) {
  if (!w) return;
  document.getElementById('wxTemp').textContent = w.temp + '°';
  document.getElementById('wxDesc').textContent = WX_CODE[w.code] || '—';
  document.getElementById('wxRange').textContent = w.today_min + '° / ' + w.today_max + '°';
  document.getElementById('wxWind').textContent = w.wind + ' km/h wind';
  document.getElementById('wxForecast').innerHTML = (w.forecast || []).map(f =>
    '<div><div class="d">' +
    new Date(f.day).toLocaleDateString('en-GB',{weekday:'short'}) +
    '</div>' + f.max + '° <span style="color:var(--faint)">' + f.min + '°</span></div>'
  ).join('');
}

function renderCalendar(items) {
  const el = document.getElementById('calList');
  if (!items || !items.length) { el.innerHTML = '<li><span>Nothing scheduled</span></li>'; return; }
  el.innerHTML = items.slice(0, 5).map(e =>
    '<li><span>' + e.title + '</span><span class="when">' + e.when + '</span></li>'
  ).join('');
}

function renderDepartures(items) {
  const el = document.getElementById('depList');
  if (!items || !items.length) { el.innerHTML = '<li><span>No departures</span></li>'; return; }
  el.innerHTML = items.slice(0, 4).map(d =>
    '<li><span>' + d.route + ' ' + d.dest + '</span>' +
    '<span class="in ' + (d.mins <= 5 ? 'soon' : '') + '">' + d.mins + ' min</span></li>'
  ).join('');
}

/* Server-Sent Events: the server pushes, the page never polls. */
const es = new EventSource('/api/events');
es.onmessage = ev => {
  const s = JSON.parse(ev.data);
  const stale = [];

  if (s.weather)   { renderWeather(s.weather.data, s.weather.stale, s.weather.age_min);
                     if (s.weather.stale) stale.push('weather'); }
  if (s.calendar)  { renderCalendar(s.calendar.data);
                     if (s.calendar.stale) stale.push('calendar'); }
  if (s.transit)   { renderDepartures(s.transit.data);
                     if (s.transit.stale) stale.push('transit'); }
  if (s.reminders) document.getElementById('reminders').textContent =
                     (s.reminders.data || []).join('  ·  ');

  document.getElementById('status').innerHTML = stale.length
    ? '<span class="stale">stale: ' + stale.join(', ') + '</span>' : '';
};
es.onerror = () => {
  document.getElementById('status').innerHTML =
    '<span class="stale">daemon unreachable</span>';
};

/* Presence blanking is driven by a query parameter the daemon flips,
   so the browser fades rather than the backlight cutting hard. */
const params = new URLSearchParams(location.search);
if (params.get('away') === '1') document.body.classList.add('away');
</script>
</body>
</html>`,
    explain: [
      { ref: 'Pure #000 background, no images', txt: 'The single most important CSS decision. A black pixel emits nothing, so that area of the panel reads as ordinary mirror. Any background colour, gradient or photograph becomes a visible grey rectangle.' },
      { ref: 'font-weight 100–200 at large sizes', txt: 'Counter-intuitive but correct: through a mirror, thin strokes at large size read better than bold at small size. Bold text at small size blooms and loses definition.' },
      { ref: '--faint #4a4a4a for labels', txt: 'Section labels are deliberately dim. They are context, not information — keeping them near the visibility floor stops them competing with the data and keeps more of the surface reading as mirror.' },
      { ref: 'EventSource rather than setInterval fetch', txt: 'One long-lived connection, automatic reconnection, and updates only when something changed. On a Pi driving a 1080p panel, avoiding a full re-render every few seconds is a measurable CPU saving.' },
      { ref: 'body.away opacity transition', txt: 'Fading the page over 1.2 s is far less jarring than cutting the display output, and it means the mirror appears to gently return to being a mirror rather than snapping off.' },
      { ref: 'tabular-nums on times', txt: 'Proportional digits make a countdown jitter horizontally as the numbers change. Tabular figures keep the column stable, which matters a lot on a display you glance at.' },
    ],
  }],

  config: [
    'Choose the mirror transmission before anything else. 50/50 for a bright room where readability matters most; 70/30 for a bedroom or hallway where the mirror function matters most. You cannot have both.',
    'Set the panel backlight to maximum in its own OSD, then control brightness through DDC/CI. Reducing it in the OSD and then again in software wastes the range you need.',
    'Edit <code>mirror-config.json</code> to define your feeds. Open-Meteo needs no API key and is a good starting weather source; transit APIs vary by city.',
    'Set <code>PRESENT_HOLD_S</code>. Two minutes suits a bathroom; a hallway wants thirty seconds so it spends most of the day as a mirror.',
    'Enable a read-only root filesystem (<code>raspi-config</code> → Performance → Overlay File System) once the configuration is settled. A mirror gets power-cycled at the wall and SD-card corruption is the most common long-term failure.',
  ],

  calibration: [
    { h: 'Test readability before you build the frame', p: ['Hold the mirror sheet loosely in front of the running display in the actual room, at the actual lighting, at the actual viewing distance. If the text is marginal now it will be worse once mounted. This five-minute test has saved many people a rebuild.'] },
    { h: 'Set the brightness curve endpoints', p: ['Log lux at 3 a.m. and at the brightest point of a sunny morning. Set <code>LUX_MAX</code> to your observed maximum and <code>B_MIN</code> to the lowest backlight that is still readable in darkness — typically 6–10 %.'] },
    { h: 'Tune the mmWave sensitivity', p: ['The LD2410 has per-gate sensitivity settings covering 0.75 m increments. Reduce sensitivity on the far gates so it does not detect someone walking past a doorway three metres away, which otherwise keeps the mirror lit all day.'] },
    { h: 'Check for ghosting', p: ['Any visible double image of the text means there is an air gap between the panel and the mirror. Press them together with a thin felt gasket; the gap should be effectively zero.'] },
  ],

  iot: {
    protoShort: 'HTTP + SSE',
    net: {
      nodes: [{ name: 'Mirror (Pi 4)', sub: 'kiosk + daemon' }],
      protocol: 'Wi-Fi / Ethernet', gateway: 'Router', gatewaySub: 'wired preferred',
      uplink: 'HTTPS to APIs', cloud: 'Public APIs', cloudSub: 'weather, transit',
      clients: [{ name: 'Phone config page', sub: 'LAN only' }, { name: 'Home Assistant', sub: 'optional feed' }],
    },
    protocol: [
      'Everything is plain HTTP. The daemon fetches from upstream APIs on a schedule and pushes merged state to the browser over Server-Sent Events, which is a single long-lived HTTP response — no WebSocket library, no polling, and automatic browser-side reconnection.',
      'API keys live only in <code>mirror-config.json</code> on the device. Nothing about your calendar or location leaves the mirror except the requests it makes directly to the providers you chose.',
    ],
    topics: [
      { t: 'GET /api/state', dir: 'browser → daemon', payload: 'Full merged state with per-feed staleness' },
      { t: 'GET /api/events', dir: 'daemon → browser (SSE)', payload: 'Pushed state updates, only on change' },
      { t: 'GET/POST /api/config', dir: 'phone → daemon (LAN)', payload: 'Feed definitions and layout' },
    ],
    security: [
      'Bind the config endpoint to the LAN only and put it behind basic authentication. It holds your API keys.',
      'Do not port-forward the mirror. If you need remote access, use a VPN.',
      'A mirror with a camera is a different project with different consent implications. This one deliberately has no camera, and if you add one, tell everyone who uses the room.',
      'Use a read-only root filesystem so a stolen or discarded SD card does not carry your credentials in a writable state — and encrypt the config file if the mirror is in a shared space.',
    ],
  },

  testing: [
    { step: 'Boot with no keyboard attached', expect: 'Straight to full-screen dashboard within about 40 seconds, no desktop, no cursor.' },
    { step: 'Unplug the network', expect: 'Data remains visible with a "stale: weather, transit" marker in the footer — never an error page or a blank panel.' },
    { step: 'Walk up and stand still for three minutes', expect: 'Display comes on immediately and stays on. If it blanks while you are standing there, you are using a PIR rather than mmWave.' },
    { step: 'Leave the room', expect: 'Display fades out about two minutes later and the surface reads as an ordinary mirror.' },
    { step: 'Turn the room lights off and on', expect: 'Backlight ramps between levels over a few seconds with no visible step.' },
    { step: 'Look at the mirror off-axis in a bright room', expect: 'Text still legible at 45°. If it washes out badly, the transmission ratio is too low for that room.' },
    { step: 'Pull the power without a shutdown, ten times', expect: 'Boots normally every time. If not, enable the read-only overlay filesystem.' },
    { step: 'Check cavity temperature after two hours', expect: 'Below 55 °C. Higher means the ventilation slots are inadequate and the Pi will throttle.' },
  ],

  troubleshoot: [
    {
      sym: 'Text is barely readable through the mirror',
      cause: 'Transmission ratio too low for the room brightness, panel backlight not at maximum, or a coloured background.',
      fix: 'Confirm the background is pure #000 and the panel OSD brightness is at 100 %. If it is still marginal, the mirror is the problem: a 70/30 needs a very bright panel in a bright room. Swapping to 50/50 roughly doubles the effective contrast, at the cost of a slightly dimmer mirror.',
    },
    {
      sym: 'A visible ghost image offset from the text',
      cause: 'An air gap between the panel and the mirror creating a second reflection.',
      fix: 'Clamp the panel directly against the mirror with a thin felt gasket. Even a 3 mm gap produces a clearly visible double image at normal viewing distance.',
    },
    {
      sym: 'Grey patches visible in the mirror',
      cause: 'Reflective surfaces inside the cavity — bare timber, screw heads, cable sheaths, the panel bezel.',
      fix: 'Line the entire cavity in matte black felt and remove the bezel completely. Anything that reflects light back through the mirror will show.',
    },
    {
      sym: 'The display blanks while someone is standing at it',
      cause: 'A PIR sensor, which stops detecting a stationary person.',
      fix: 'Replace with an LD2410 or similar mmWave module. This is the specific failure PIR cannot solve, and no amount of hold-time tuning fixes it without leaving the display on permanently.',
    },
    {
      sym: 'The mmWave sensor detects people in the next room',
      cause: '24 GHz passes through plasterboard easily, and the default sensitivity is high on all range gates.',
      fix: 'Use the LD2410 configuration tool to lower the sensitivity of gates beyond your intended range, and set the maximum detection distance to just past where you actually stand.',
    },
    {
      sym: 'Chromium shows a "restore pages" bar after a power cut',
      cause: 'Unclean shutdown flags in the browser profile.',
      fix: 'Add <code>--disable-session-crashed-bubble --disable-infobars</code> to the launch flags and clear the exit-type flag in the Preferences file on each boot via the systemd unit\'s ExecStartPre.',
    },
  ],

  perf: [
    'Use Server-Sent Events, not polling. A 1080p page re-rendering every five seconds keeps a Pi 4 busy for no benefit.',
    'Cache aggressively and poll each feed at its natural rate. Weather every 15 minutes is plenty; transit every 60 seconds is necessary. Polling everything at the fastest rate wastes API quota and CPU.',
    'Enable the GPU driver and hardware compositing. Software-composited full-screen rendering on a Pi is noticeably jerkier during transitions.',
    'Run the root filesystem read-only. It eliminates the most common long-term failure, and it makes boot faster.',
  ],

  safety: [
    'Glass mirror is heavy and sharp. Two people for handling, gloves, and a frame rated for the weight — a 600 × 400 mm glass sheet plus a monitor is well over 8 kg on a wall fixing.',
    'Cutting acrylic produces fine dust and static; cut it slowly with a scoring tool rather than a fast saw, which melts the edge.',
    'A sealed cavity with a Pi and a driver board gets hot. Vent it, and never mount it directly against combustible cladding without an air gap.',
    'Do not fit a smart mirror in a shower enclosure. Even a bathroom install needs the electronics well outside the splash zone and the frame sealed at the top.',
  ],

  future: [
    'Add <b>voice control</b> using the offline wake-word engine from the voice hub project — a mirror is the natural place for it and it avoids adding a touchscreen.',
    'Add <b>gesture control</b> with a VL53L0X time-of-flight sensor: a hand wave at a fixed distance to page between screens, with no touch surface to smear.',
    'Add <b>per-person profiles</b> triggered by a phone\'s Bluetooth presence, so the mirror shows your calendar rather than the household one.',
    'Add a <b>local weather station</b> feed from the outdoor sensor in another project, which is far more relevant than a forecast for the nearest city.',
    'Move the UI to a <b>static generator with no JavaScript framework</b> — the whole interface here fits in one file, and keeping it that way is why it starts in under a second.',
  ],

  faq: [
    { q: 'Glass or acrylic two-way mirror?', a: 'Acrylic is lighter, safer, cheaper and easier to cut, but scratches easily and can bow over a large span. Glass is optically better and scratch-resistant but heavy, fragile and expensive to cut to size. For a first build under 600 mm, acrylic. For a permanent installation you will keep for a decade, glass.' },
    { q: 'What transmission ratio should I buy?', a: '50/50 if readability is the priority or the room is bright; 70/30 if the mirror function is the priority and the room is dimmer. The contrast calculation in the equations section shows why: at 70/30 in a bright room the display contributes less light than the reflection does, and text washes out.' },
    { q: 'Can I use MagicMirror² instead of writing this?', a: 'Absolutely, and for many people it is the right call — it has a large module ecosystem and solves the same problem. The reason to write your own is that the whole interface here is one HTML file with no build step and no framework, which starts in under a second and is trivial to modify. Both approaches are legitimate.' },
    { q: 'Why not a cheap tablet behind the mirror?', a: 'You can, and it is a much simpler build. The problems are brightness (most tablets are dimmer than a monitor at the same nominal figure once you account for the panel size), the impossibility of removing the bezel, and no DDC/CI for backlight control. It works for a small mirror and struggles for a large one.' },
    { q: 'Does it need to be always on?', a: 'No, and it should not be. A mirror that is a screen all day is just a screen. Presence gating is what makes it read as a mirror for the 95 % of the time nobody is standing there, and it also roughly halves the power consumption.' },
    { q: 'How much does it cost to run?', a: 'A Pi 4 plus a 22-inch panel at full backlight is around 30–35 W while active. With presence gating and a typical household pattern that is perhaps two hours a day, so roughly 25 kWh a year — a few hundred rupees. Leaving it on continuously would be ten times that.' },
  ],

  refs: [
    { t: 'Two-way mirror physics and transmission ratios', u: 'https://en.wikipedia.org/wiki/One-way_mirror', s: 'Wikipedia' },
    { t: 'Raspberry Pi kiosk mode — official documentation', u: 'https://www.raspberrypi.com/documentation/computers/configuration.html', s: 'Raspberry Pi Foundation' },
    { t: 'HLK-LD2410 24 GHz human presence sensor — datasheet and protocol', u: 'https://www.hlktech.net/index.php?id=988', s: 'Hi-Link' },
    { t: 'DDC/CI and VESA MCCS — monitor control command set', u: 'https://www.ddcutil.com/', s: 'ddcutil' },
    { t: 'Server-Sent Events — MDN reference', u: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events', s: 'MDN Web Docs' },
    { t: 'Open-Meteo — free weather API with no key required', u: 'https://open-meteo.com/en/docs', s: 'Open-Meteo' },
    { t: 'MagicMirror² — the established open-source smart mirror platform', u: 'https://docs.magicmirror.builders/', s: 'MagicMirror²' },
  ],

  images: ['rpi', 'dashboard', 'camera'],
  imageCaptions: [
    'A Raspberry Pi single-board computer — the mirror controller, running Chromium in kiosk mode.',
    'A dashboard layout. On a smart mirror the same information must be rendered as white on pure black, at much larger sizes than a normal screen.',
    'A small camera module. This build deliberately has none — adding one to a bathroom mirror is a consent question before it is a technical one.',
  ],
},

/* ── 014 · Smart Pet Feeder & Monitor ────────────────────────────── */
{
  id: '014',
  domainKey: 'iot',
  emoji: '🐾',
  thumb: 'motor',
  difficulty: 'Intermediate',
  hours: '12–18 hours',
  iso8601: 'PT15H',
  tagline: 'A portion-controlled feeder that weighs what it actually dispensed rather than guessing, detects a jam before the bowl stays empty all day, and shows you a photo of your pet eating it.',

  overview: [
    'The failure mode that matters in a pet feeder is not over-feeding — it is silent under-feeding. An auger that jams on a large kibble, a hopper that bridges and stops flowing, a servo that stalls: all of them produce a feeder that reports "fed successfully" to an app while the bowl stays empty. If you are away for three days, that is a serious problem.',
    'This design closes the loop with a <b>load cell under the bowl</b>. Every feed cycle runs the auger in short bursts and weighs the bowl between them, stopping when the target mass is reached and raising an alarm if the mass has not increased after several attempts. The feeder knows what it delivered rather than what it intended to deliver, and that single change eliminates the entire class of silent failures.',
    'The second design decision is the dispensing mechanism. A <b>screw auger</b> gives a repeatable volume per revolution and handles a wide kibble size range; a rotating drum with pockets is simpler but jams on irregular kibble; a simple gate is uncontrollable. The auger is driven by a geared DC motor with encoder feedback rather than a servo, because a servo has no way to report that it is stalling against a jammed kibble.',
    'Around that sits the rest of what makes a feeder actually usable: a camera so you can see whether the food was eaten, a hopper level sensor so you know before it runs out, a schedule that survives a power cut, and manual dispensing that works with the network completely down.',
  ],

  does: [
    'Dispenses a target mass of food, verified by a load cell rather than assumed from motor run time.',
    'Detects jams and bridging by checking that mass actually increased between auger bursts.',
    'Runs a daily schedule stored on-device, so a network outage never means a missed meal.',
    'Measures hopper level with an ultrasonic sensor and warns days before it empties.',
    'Captures a photo when the pet approaches, so you can confirm the food was eaten.',
    'Logs every feed with target mass, delivered mass, duration and any retries.',
    'Allows manual dispensing from a physical button that works with no network at all.',
  ],

  features: [
    '<b>Closed-loop mass dispensing</b> with a 5 kg load cell and HX711, accurate to about ±2 g.',
    '<b>Burst-and-weigh algorithm</b> — short auger runs with a settle and weigh between each.',
    '<b>Jam detection</b> after three bursts with no mass increase, with an auger reverse-and-retry.',
    '<b>Hopper level</b> by ultrasonic time-of-flight, reported in days of food remaining.',
    '<b>Anti-gorge lockout</b> preventing more than a configured mass in any rolling six-hour window.',
    '<b>Camera capture</b> on approach, triggered by a change in bowl weight rather than by motion.',
    '<b>Schedule in NVS</b> with a DS3231 RTC, so meals happen on time with no network and no NTP.',
    '<b>Full audit log</b> of target versus delivered mass, which is what tells you the mechanism is degrading.',
  ],

  applications: [
    { t: 'Scheduled feeding while away', d: 'The core case, and the one where verified delivery rather than assumed delivery genuinely matters.' },
    { t: 'Portion control for weight management', d: 'Vets prescribe grams per day; a feeder that measures grams is the only way to actually comply.' },
    { t: 'Multi-pet households', d: 'Combine with RFID collar tags so each animal gets its own portion from its own bowl.' },
    { t: 'Medication timing', d: 'Food-motivated dosing requires the meal to happen at a specific time, reliably.' },
    { t: 'Feeding behaviour monitoring', d: 'A change in how fast or how completely a pet eats is often the earliest sign of illness.' },
    { t: 'Animal shelters and catteries', d: 'Per-animal records of what was offered and what was consumed.' },
  ],

  skills: [
    'Arduino C++ with state machines',
    'Load cell calibration and the HX711 interface',
    'Driving a geared DC motor with an H-bridge',
    'Basic mechanical assembly and 3D printing',
    'MQTT and scheduling',
  ],

  parts: ['esp32', 'loadcell', 'n20', 'tb6612', 'hcsr04', 'esp32cam', 'oled', 'rtc', 'buzzer', 'buck', 'psu12v', 'perfboard'],
  extraParts: [
    { name: '3D-printed auger, hopper and chute', spec: 'PETG or food-safe PLA, 20 mm auger diameter', qty: 1, price: 400, note: 'Print the auger solid at 100 % infill — a hollow auger flexes and the pitch changes under load.' },
    { name: 'Stainless steel bowl', spec: '15 cm, dishwasher safe', qty: 1, price: 250, note: 'Stainless only. Plastic bowls harbour bacteria and many animals react to them.' },
    { name: 'Sealed hopper container', spec: '3–5 L, airtight lid', qty: 1, price: 450 },
    { name: 'Manual feed button', spec: 'NO momentary, large', qty: 1, price: 80 },
  ],
  cost: '₹6,400 – ₹8,200',
  libs: ['wifi', 'pubsub', 'arduinojson', 'hx711', 'ssd1306', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'HX711 load cell amp', devPin: 'DT / SCK', pin: 'GPIO 16 / 4', sig: 'Bit-banged 24-bit ADC' },
      { dev: 'HC-SR04 hopper level', devPin: 'TRIG / ECHO', pin: 'GPIO 5 / 18', sig: 'Echo through a divider' },
      { dev: 'N20 motor encoder', devPin: 'A / B', pin: 'GPIO 34 / 35', sig: 'Quadrature, interrupt' },
      { dev: 'Manual feed button', devPin: 'NO', pin: 'GPIO 32', sig: 'Pull-up' },
      { dev: 'DS3231 RTC + OLED', devPin: 'SDA / SCL', pin: 'GPIO 21 / 22', sig: 'Shared I²C' },
    ],
    right: [
      { dev: 'TB6612FNG', devPin: 'AIN1 / AIN2 / PWMA', pin: 'GPIO 26 / 27 / 25', sig: 'Auger motor drive' },
      { dev: 'TB6612FNG', devPin: 'STBY', pin: 'GPIO 33', sig: 'Must be high to enable' },
      { dev: 'Buzzer', devPin: '+', pin: 'GPIO 14', sig: 'Feed chime + alarms' },
      { dev: 'ESP32-CAM', devPin: 'Trigger', pin: 'GPIO 12', sig: 'Separate board, pulse to capture' },
    ],
  },
  wiringNotes: [
    'Mount the load cell so the bowl loads it in the direction its strain gauges are oriented — there is an arrow on the body. Loading it sideways gives readings that change when the bowl is nudged.',
    'The load cell must be bolted to a <b>rigid</b> plate at the fixed end and to the bowl platform at the free end, with a gap so it can flex. Screwing both ends to the same rigid surface means it never bends and reads a constant value.',
    'Use a <b>TB6612FNG</b> rather than an L298N. The L298N drops about 2 V across its output transistors, which on a 6 V motor is a third of your voltage and a large fraction of your torque — exactly what you need when clearing a jam.',
    'The HC-SR04 echo pin outputs 5 V. Divide it to 3.3 V before the ESP32 or you will damage the input.',
    'GPIO 34 and 35 are input-only, which suits the encoder channels. They need external pull-ups if the encoder is open-collector.',
    'Keep the HX711 leads short and away from the motor wiring. It is a 24-bit amplifier reading microvolts, and motor PWM coupling into those leads produces weight readings that jump by tens of grams whenever the auger runs.',
  ],

  block: {
    columns: [
      { label: 'Sense', blocks: [{ name: 'Load cell + HX711', sub: 'bowl mass' }, { name: 'HC-SR04', sub: 'hopper level' }, { name: 'Encoder', sub: 'auger turns' }] },
      { label: 'Decide', edge: 'mass, time', blocks: [{ name: 'Schedule + RTC', sub: 'meals' }, { name: 'Burst controller', sub: 'target mass', highlight: true }] },
      { label: 'Act', edge: 'dispense', blocks: [{ name: 'TB6612 → auger', sub: 'short bursts', highlight: true }, { name: 'Jam recovery', sub: 'reverse + retry' }] },
      { label: 'Verify', edge: 'delivered mass', blocks: [{ name: 'Weigh + log', sub: 'audit trail' }, { name: 'Camera + MQTT', sub: 'confirmation' }] },
    ],
  },

  flow: [
    { t: 'Boot: tare bowl, load schedule', k: 'start' },
    { t: 'Wait for scheduled time or manual button', k: 'proc' },
    { t: 'Anti-gorge window clear?', k: 'dec', yes: 'yes', no: 'refuse and log', back: 1 },
    { t: 'Run auger for a 400 ms burst', k: 'io' },
    { t: 'Settle 800 ms, weigh the bowl', k: 'proc' },
    { t: 'Target mass reached?', k: 'dec', yes: 'done', no: 'check for jam', back: 3 },
    { t: 'Mass increased since last burst?', k: 'dec', yes: 'continue', no: 'reverse, retry, then alarm', back: 3 },
    { t: 'Log delivered mass, trigger camera', k: 'end' },
  ],

  principle: [
    'A <b>load cell</b> is an aluminium beam with four strain gauges bonded to it in a Wheatstone bridge. When the beam flexes, two gauges stretch and two compress, unbalancing the bridge and producing a differential voltage proportional to load. The output is tiny — a 5 kg cell rated at 1.0 mV/V excited at 5 V produces 5 mV at full scale, which is 1 µV per gram. That is why the HX711 exists: it is a 24-bit ADC with a programmable gain amplifier of 128, specifically designed for bridge sensors.',
    'Calibration is a two-point affair: <b>tare</b> (record the raw reading with the empty bowl in place) and <b>scale</b> (place a known mass and compute counts per gram). Both must be redone if you change the bowl, because the tare includes the bowl\'s own weight and any change in mounting stiffness changes the scale factor slightly.',
    'The <b>burst-and-weigh</b> algorithm is what makes the feeder honest. Running the auger continuously and stopping at a target mass overshoots badly, because kibble in flight after the motor stops still lands in the bowl, and because the mass reading during motion is corrupted by vibration. Running in 400 ms bursts with an 800 ms settle before weighing gives a stable reading and bounds the overshoot to roughly one burst\'s worth of food — typically 2–4 g.',
    '<b>Jam detection</b> then falls out for free. If a burst produces no measurable mass increase, either the hopper has bridged (kibble arching over the auger inlet), a piece is wedged in the auger, or the hopper is empty. The response is to reverse the auger briefly — which usually breaks a bridge or frees a wedged piece — and retry. After three failed retries the feeder stops and raises an alarm, which is the correct behaviour: continuing to grind against a jam destroys the mechanism and still delivers nothing.',
    'The <b>anti-gorge lockout</b> exists because the most dangerous failure of an automatic feeder is dispensing repeatedly. A bug, a duplicated MQTT command, or a cat that has learned to trigger the manual button can all deliver a day\'s food in an hour, which for some animals causes bloat — a genuine emergency. A hard cap on total mass in any rolling six-hour window, enforced independently of the schedule logic, makes that impossible.',
  ],

  equations: [
    { t: 'Load cell sensitivity and resolution', eq: 'Cell: 5 kg, 1.0 mV/V, excitation 5 V\n  Full-scale output = 5 V × 1.0 mV/V = 5 mV\n  Per gram          = 5 mV / 5000 g = 1 µV/g\n\nHX711 at gain 128, 24-bit, ±0.5 V/gain differential range:\n  input range = ±20 mV\n  LSB = 40 mV / 2^24 = 2.38 nV\n\nTheoretical resolution = 1 µV / 2.38 nV ≈ 420 counts/g\n\nIn practice noise limits usable resolution to about\n±2 g — which is far better than a pet feeder needs,\nand the extra headroom absorbs mechanical drift.' },
    { t: 'Auger volume per revolution', eq: 'Auger outer diameter D = 20 mm, shaft d = 6 mm, pitch p = 15 mm\n\nSwept volume per revolution:\n  V = π/4 × (D² − d²) × p\n    = 0.7854 × (400 − 36) × 15 = 4288 mm³ ≈ 4.29 mL\n\nDry kibble bulk density ≈ 0.35 g/mL\n  mass per revolution ≈ 1.5 g\n\nMotor at 200 rpm = 3.33 rev/s → 5.0 g/s\n400 ms burst      ≈ 2.0 g\n\nSo a 40 g meal takes about 20 bursts —\nwhich at ~1.2 s per burst-and-weigh cycle is 24 s.' },
    { t: 'Hopper level in days', eq: 'Hopper cross-section A = 150 × 150 mm = 22 500 mm²\nUltrasonic distance to surface h_air (mm)\nHopper internal height H = 300 mm\n\n  volume_remaining = A × (H − h_air) mm³\n  mass_remaining   = volume × 0.35 g/mL / 1000\n\nh_air = 90 mm:\n  V = 22500 × 210 = 4 725 000 mm³ = 4725 mL\n  m = 4725 × 0.35 = 1654 g\n\nDaily ration 120 g → 13.8 days remaining.\nWarn at 4 days, alarm at 1 day.' },
  ],

  code: [{
    file: 'pet-feeder.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Pet Feeder — ESP32 + 5 kg load cell + auger

   Dispenses a target MASS, verified by weighing between short auger
   bursts. Detects jams and bridging, reverses to clear them, and
   refuses to exceed a rolling anti-gorge limit. The schedule lives
   on-device so a network outage never means a missed meal.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <HX711.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>
#include <time.h>

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"
#define MQTT_HOST "192.168.1.50"
#define DEVICE_ID "feeder-cat"

#define PIN_HX_DT   16
#define PIN_HX_SCK   4
#define PIN_TRIG     5
#define PIN_ECHO    18
#define PIN_ENC_A   34
#define PIN_BTN     32
#define PIN_AIN1    26
#define PIN_AIN2    27
#define PIN_PWMA    25
#define PIN_STBY    33
#define PIN_BUZZER  14
#define PIN_CAM_TRIG 12

#define BURST_MS        400
#define SETTLE_MS       800
#define MAX_BURSTS       60          // hard cap on one feed cycle
#define JAM_RETRIES       3
#define MIN_GAIN_G      0.8f         // a burst must add at least this
#define GORGE_WINDOW_MS (6UL*3600UL*1000UL)
#define GORGE_MAX_G     120.0f
#define HOPPER_HEIGHT_MM 300.0f
#define HOPPER_AREA_MM2 22500.0f
#define KIBBLE_G_PER_ML  0.35f

HX711            scale;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
WiFiClient       net;
PubSubClient     mqtt(net);
Preferences      prefs;

float calFactor = 420.0f;            // counts per gram, from calibration
float bowlG = 0, hopperG = 0;
float dailyRationG = 120.0f;

struct Meal { uint8_t hour, minute; float grams; bool enabled; };
Meal meals[4] = {
  { 7, 30, 40, true }, { 12, 30, 30, true },
  { 18, 30, 50, true }, { 22,  0,  0, false }
};

struct GorgeEntry { uint32_t at; float grams; } gorge[16];
uint8_t gorgeHead = 0;
volatile uint32_t encoderTicks = 0;
bool jamAlarm = false;

void IRAM_ATTR encoderISR() { encoderTicks++; }

/* ── weighing ───────────────────────────────────────────────── */
float readBowlGrams() {
  if (!scale.is_ready()) return bowlG;
  long raw = scale.read_average(8);
  return (raw - scale.get_offset()) / calFactor;
}

void tareBowl() {
  scale.tare(20);
  bowlG = 0;
  Serial.println("Bowl tared");
}

/* ── auger ──────────────────────────────────────────────────── */
void augerRun(bool forward, uint16_t ms, uint8_t duty = 200) {
  digitalWrite(PIN_STBY, HIGH);
  digitalWrite(PIN_AIN1, forward ? HIGH : LOW);
  digitalWrite(PIN_AIN2, forward ? LOW : HIGH);
  ledcWrite(0, duty);
  delay(ms);
  ledcWrite(0, 0);
  digitalWrite(PIN_AIN1, LOW);
  digitalWrite(PIN_AIN2, LOW);
}

/* ── anti-gorge ─────────────────────────────────────────────── */
float gorgeInWindow() {
  uint32_t now = millis();
  float total = 0;
  for (auto &g : gorge)
    if (g.at && now - g.at < GORGE_WINDOW_MS) total += g.grams;
  return total;
}

void gorgeRecord(float grams) {
  gorge[gorgeHead] = { millis(), grams };
  gorgeHead = (gorgeHead + 1) % 16;
}

/* ── the feed cycle ─────────────────────────────────────────── */
float dispense(float targetG, const char *trigger) {
  if (jamAlarm) { publishEvent(trigger, targetG, 0, "jam-alarm-latched"); return 0; }

  float already = gorgeInWindow();
  if (already + targetG > GORGE_MAX_G) {
    publishEvent(trigger, targetG, 0, "anti-gorge-refused");
    tone(PIN_BUZZER, 400, 500);
    return 0;
  }

  float startG = readBowlGrams();
  float lastG = startG;
  uint8_t bursts = 0, retries = 0;

  tone(PIN_BUZZER, 2200, 120);       // feed chime — pets learn it fast
  delay(300);

  while (bursts < MAX_BURSTS) {
    augerRun(true, BURST_MS);
    delay(SETTLE_MS);                // vibration must die before weighing
    bursts++;

    float nowG = readBowlGrams();
    float delivered = nowG - startG;

    if (delivered >= targetG) {
      bowlG = nowG;
      gorgeRecord(delivered);
      publishEvent(trigger, targetG, delivered, "ok");
      digitalWrite(PIN_CAM_TRIG, HIGH); delay(50); digitalWrite(PIN_CAM_TRIG, LOW);
      return delivered;
    }

    if (nowG - lastG < MIN_GAIN_G) {           // nothing came out
      if (++retries > JAM_RETRIES) {
        jamAlarm = true;
        publishEvent(trigger, targetG, delivered, "jam");
        for (int i = 0; i < 6; i++) { tone(PIN_BUZZER, 600, 200); delay(300); }
        return delivered;
      }
      augerRun(false, 600, 255);               // reverse hard to clear
      delay(400);
      augerRun(true, 200);
      delay(SETTLE_MS);
    } else {
      retries = 0;
    }
    lastG = nowG;
  }

  float delivered = readBowlGrams() - startG;
  publishEvent(trigger, targetG, delivered, "burst-limit");
  return delivered;
}

/* ── hopper level ───────────────────────────────────────────── */
float hopperGrams() {
  digitalWrite(PIN_TRIG, LOW); delayMicroseconds(3);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long us = pulseIn(PIN_ECHO, HIGH, 30000);
  if (!us) return hopperG;                     // no echo: keep last value

  float mm = us * 0.1715f;                     // 343 m/s, there and back
  if (mm < 20 || mm > HOPPER_HEIGHT_MM + 40) return hopperG;

  float fillMm = HOPPER_HEIGHT_MM - mm;
  if (fillMm < 0) fillMm = 0;
  float ml = HOPPER_AREA_MM2 * fillMm / 1000.0f;
  return ml * KIBBLE_G_PER_ML;
}

/* ── MQTT ───────────────────────────────────────────────────── */
void publishEvent(const char *trigger, float target, float delivered, const char *result) {
  JsonDocument d;
  d["trigger"]   = trigger;
  d["target_g"]  = roundf(target * 10) / 10.0f;
  d["delivered_g"] = roundf(delivered * 10) / 10.0f;
  d["result"]    = result;
  d["bowl_g"]    = roundf(bowlG);
  d["hopper_g"]  = roundf(hopperG);
  d["days_left"] = dailyRationG > 0 ? roundf(hopperG / dailyRationG * 10) / 10.0f : 0;
  char b[256]; size_t n = serializeJson(d, b, sizeof(b));
  mqtt.publish("home/pet/" DEVICE_ID "/feed", (uint8_t *)b, n, false);
  Serial.printf("%s: target %.1f g, delivered %.1f g — %s\\n",
                trigger, target, delivered, result);
}

void onMessage(char *topic, byte *payload, unsigned int len) {
  JsonDocument d;
  if (deserializeJson(d, payload, len)) return;
  const char *action = d["action"] | "";

  if (!strcmp(action, "feed"))       dispense(d["grams"] | 20.0f, "remote");
  else if (!strcmp(action, "tare"))  tareBowl();
  else if (!strcmp(action, "clear")) { jamAlarm = false; Serial.println("Jam alarm cleared"); }
  else if (!strcmp(action, "schedule")) {
    int i = d["index"] | -1;
    if (i >= 0 && i < 4) {
      meals[i] = { (uint8_t)(d["hour"] | 7), (uint8_t)(d["minute"] | 0),
                   (float)(d["grams"] | 30.0f), (bool)(d["enabled"] | true) };
      prefs.putBytes("meals", meals, sizeof(meals));
    }
  }
}

/* ── setup / loop ───────────────────────────────────────────── */
void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT); pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_BTN, INPUT_PULLUP);
  pinMode(PIN_AIN1, OUTPUT); pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_STBY, OUTPUT); digitalWrite(PIN_STBY, LOW);
  pinMode(PIN_CAM_TRIG, OUTPUT);
  pinMode(PIN_ENC_A, INPUT);
  attachInterrupt(PIN_ENC_A, encoderISR, RISING);

  ledcSetup(0, 20000, 8);
  ledcAttachPin(PIN_PWMA, 0);

  scale.begin(PIN_HX_DT, PIN_HX_SCK);
  Wire.begin(21, 22);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  prefs.begin("feeder", false);
  calFactor = prefs.getFloat("cal", 420.0f);
  if (prefs.getBytesLength("meals") == sizeof(meals))
    prefs.getBytes("meals", meals, sizeof(meals));

  delay(1500);
  tareBowl();

  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) delay(250);
  configTime(19800, 0, "pool.ntp.org");
  mqtt.setServer(MQTT_HOST, 1883);
  mqtt.setCallback(onMessage);

  Serial.println("Feeder ready");
}

void loop() {
  if (!mqtt.connected() && WiFi.status() == WL_CONNECTED) {
    if (mqtt.connect(DEVICE_ID)) mqtt.subscribe("home/pet/" DEVICE_ID "/cmd");
  }
  mqtt.loop();

  if (digitalRead(PIN_BTN) == LOW) {           // manual: works with no network
    delay(40);
    if (digitalRead(PIN_BTN) == LOW) {
      dispense(20.0f, "manual");
      while (digitalRead(PIN_BTN) == LOW) delay(10);
    }
  }

  static uint32_t lastSlow = 0;
  if (millis() - lastSlow < 5000) return;
  lastSlow = millis();

  bowlG   = readBowlGrams();
  hopperG = hopperGrams();

  // Scheduled meals — checked against the RTC, fired once per minute slot.
  static int lastFiredMinute = -1;
  time_t t = time(nullptr); struct tm tm; localtime_r(&t, &tm);
  int slot = tm.tm_hour * 60 + tm.tm_min;
  if (slot != lastFiredMinute) {
    for (auto &m : meals) {
      if (!m.enabled || m.grams <= 0) continue;
      if (m.hour == tm.tm_hour && m.minute == tm.tm_min) {
        lastFiredMinute = slot;
        dispense(m.grams, "scheduled");
      }
    }
  }

  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(2); oled.setCursor(0, 0);
  oled.printf("%.0f g", bowlG);
  oled.setTextSize(1);
  oled.setCursor(0, 22); oled.printf("hopper %.0f g", hopperG);
  oled.setCursor(0, 34); oled.printf("%.1f days left",
                                     dailyRationG > 0 ? hopperG / dailyRationG : 0);
  oled.setCursor(0, 46);
  oled.print(jamAlarm ? "JAM - clear via app" : "ready");
  oled.setCursor(0, 56); oled.printf("%02d:%02d", tm.tm_hour, tm.tm_min);
  oled.display();
}`,
    explain: [
      { ref: 'dispense() returns delivered, not target', txt: 'Every caller gets the mass that actually landed in the bowl. That is the whole design principle — the feeder never reports success based on what it intended to do.' },
      { ref: 'delay(SETTLE_MS) before weighing', txt: 'The load cell picks up motor vibration and kibble still in flight. Weighing during or immediately after a burst gives readings that swing by tens of grams. Eight hundred milliseconds is enough for both to settle.' },
      { ref: 'nowG − lastG < MIN_GAIN_G', txt: 'Jam detection in one line: a burst that adds less than 0.8 g delivered nothing. Whether the cause is a bridge, a wedged kibble or an empty hopper, the response — reverse and retry — is the same.' },
      { ref: 'augerRun(false, 600, 255)', txt: 'Reverse at full duty for longer than a forward burst. Breaking a bridge needs more torque than normal dispensing, and reversing is the only motion that reliably does it without grinding.' },
      { ref: 'gorgeInWindow() checked before every dispense', txt: 'The anti-gorge limit is enforced at the single entry point to dispensing, so it applies equally to scheduled, remote and manual feeds. A cat that learns to press the button cannot defeat it.' },
      { ref: 'jamAlarm latched until cleared remotely', txt: 'A jam needs a human to look at the mechanism. Auto-clearing would mean the feeder grinds against an obstruction every meal until something breaks.' },
      { ref: 'Manual button before the 5 s slow loop', txt: 'The manual feed path is checked every loop and never depends on Wi-Fi, MQTT or the RTC. If everything else fails, the button still feeds the animal.' },
    ],
  }],

  config: [
    'Calibrate the load cell first: tare with the empty bowl in place, put a known mass on it (a 100 g weight, or a measured volume of water), and set <code>calFactor = raw_counts / grams</code>.',
    'Measure your kibble\'s bulk density by weighing a known volume — the 0.35 g/mL default varies by 30 % between brands and it feeds directly into the hopper-days estimate.',
    'Set <code>GORGE_MAX_G</code> to about 1.2× the daily ration. Tight enough to prevent a runaway, loose enough that a legitimate extra meal is not refused.',
    'Tune <code>BURST_MS</code> for your auger and motor. Aim for roughly 2 g per burst — larger bursts overshoot the target, smaller ones make a meal take too long.',
    'Set the meal schedule through the MQTT command topic, which persists it to NVS. Verify it survives a power cut before you rely on it.',
  ],

  calibration: [
    { h: 'Two-point load cell calibration', p: ['Place the empty bowl and tare. Then place a known mass and read the raw counts. <code>calFactor = (raw_loaded − raw_tare) / known_grams</code>. Repeat with a different mass to confirm linearity — the two factors should agree within about 1 %.'] },
    { h: 'Measure grams per burst', p: ['Tare the bowl, run exactly ten bursts, and weigh. Divide by ten. This number tells you both your effective auger throughput and whether <code>MIN_GAIN_G</code> is set sensibly — it should be roughly 40 % of a normal burst.'] },
    { h: 'Calibrate the hopper depth', p: ['Fill the hopper to a known mass and record the ultrasonic distance. Repeat at half and empty. If the relationship is not close to linear, the hopper walls are not vertical or the sensor is seeing the wall rather than the surface.'] },
    { h: 'Verify jam recovery', p: ['Deliberately wedge a piece of kibble or a small object in the auger and run a feed. The feeder should reverse, retry, and after three attempts latch a jam alarm — not grind indefinitely.'] },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT',
    net: {
      nodes: [{ name: 'Feeder', sub: 'ESP32 + load cell' }, { name: 'Camera', sub: 'ESP32-CAM' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'IoT VLAN',
      uplink: 'MQTT 1883', cloud: 'Local broker', cloudSub: 'Mosquitto + HA',
      clients: [{ name: 'Phone app', sub: 'feed + photo' }, { name: 'Grafana', sub: 'consumption trend' }],
    },
    topics: [
      { t: 'home/pet/feeder-cat/feed', dir: 'device → broker', payload: 'JSON: trigger, target_g, delivered_g, result, bowl_g, hopper_g, days_left' },
      { t: 'home/pet/feeder-cat/cmd', dir: 'broker → device', payload: 'JSON: action = feed | tare | clear | schedule' },
      { t: 'home/pet/feeder-cat/status', dir: 'device → broker (retained)', payload: '"online" / "offline" (LWT)' },
    ],
    dashboard: [
      'Plot delivered mass against target mass over time. A widening gap is the mechanism degrading — the auger wearing, the hopper geometry changing as the food settles differently, or the motor losing torque. It gives you weeks of warning before an outright failure.',
      'Plot bowl mass continuously. The decay curve after a meal tells you how fast the animal ate, and a change in that curve is one of the earliest detectable signs of illness in cats.',
    ],
    security: [
      'The command topic can dispense food. Use broker authentication — an open topic is a cat that gets fed by anyone on your network.',
      'Keep the anti-gorge limit in firmware, not in the automation layer. It must hold even if the broker sends a hundred feed commands.',
      'Add a Last Will so a dead feeder is visibly dead. Silence from a feeder while you are away is exactly the failure you cannot afford to miss.',
    ],
  },

  testing: [
    { step: 'Tare with an empty bowl, then add a known 100 g mass', expect: 'Reading within about 2 g of 100 g.' },
    { step: 'Request a 40 g feed', expect: 'Roughly 20 bursts over about 25 s, delivering 40–44 g. Overshoot beyond one burst means the settle time is too short.' },
    { step: 'Block the auger with a wedged object', expect: 'Reverse, retry three times, then a jam alarm and a distinctive buzzer pattern — no grinding.' },
    { step: 'Request feeds until the anti-gorge limit is reached', expect: 'The next request is refused, logged as <code>anti-gorge-refused</code>, and a low tone sounds.' },
    { step: 'Fill the hopper and check the estimate', expect: 'Days-remaining figure within about 20 % of your own calculation from the actual mass and daily ration.' },
    { step: 'Power-cycle and check the schedule', expect: 'Meals still fire at the right times from the RTC, with no network required.' },
    { step: 'Disconnect Wi-Fi and press the manual button', expect: 'A normal feed cycle. The manual path must never depend on the network.' },
    { step: 'Watch bowl mass for an hour after a meal', expect: 'A decay curve as the animal eats, which is the data that makes the load cell worth having beyond dosing.' },
  ],

  troubleshoot: [
    {
      sym: 'Weight readings jump by tens of grams when the auger runs',
      cause: 'Motor PWM noise coupling into the HX711 leads, or mechanical vibration reaching the load cell.',
      fix: 'Shorten and separate the HX711 leads from the motor wiring, twist the load cell pairs, and add a 100 nF capacitor across the HX711 supply. Then confirm you are only reading during the settle window, never during a burst.',
    },
    {
      sym: 'The reading drifts steadily over hours',
      cause: 'Temperature affecting the load cell, or mechanical creep in the mounting.',
      fix: 'Some drift is inherent — aluminium cells have a temperature coefficient. Re-tare before each feed cycle rather than only at boot, which removes drift entirely from the measurement that matters.',
    },
    {
      sym: 'The load cell reads a constant value regardless of load',
      cause: 'Both ends bolted to the same rigid surface, so the beam cannot flex.',
      fix: 'One end must be fixed and the other must carry the load with an air gap beneath it. This is the single most common load cell mounting error and it produces a perfectly stable, entirely useless reading.',
    },
    {
      sym: 'The auger jams constantly with large kibble',
      cause: 'Auger pitch or clearance too small for the kibble size.',
      fix: 'Increase the auger pitch and the clearance between the auger and its housing to at least 1.5× the largest kibble dimension. Also add a stirrer or a sloped hopper — bridging is a hopper geometry problem more than an auger problem.',
    },
    {
      sym: 'Delivered mass consistently overshoots the target',
      cause: 'Burst too long, or settle time too short so kibble in flight is not counted.',
      fix: 'Reduce <code>BURST_MS</code> until each burst delivers about 2 g, and increase <code>SETTLE_MS</code> until repeated weighings of a static bowl agree within 1 g.',
    },
    {
      sym: 'The hopper level reading is erratic',
      cause: 'The ultrasonic sensor is seeing the hopper wall or an uneven food surface.',
      fix: 'Mount it centrally, pointing straight down, at least 30 mm from any wall, and above the 25 cm blind zone. Median-filter several readings — a food surface is not flat and single readings scatter.',
    },
  ],

  perf: [
    'Re-tare before every feed cycle rather than only at boot. It removes thermal drift from the measurement that actually matters, at a cost of two seconds.',
    'Average eight HX711 samples per reading. The HX711 runs at 10 SPS by default, so eight samples takes 800 ms — which is exactly the settle time you already need.',
    'Keep the schedule check gated to one firing per minute slot, or a slow loop iteration can fire the same meal twice.',
  ],

  safety: [
    'A feeder that fails silently is the real hazard. Verify the Last Will alert reaches your phone before relying on it while away, and always have a person who can check.',
    'Never leave a jam alarm unattended for days. Keep a backup manual feeding arrangement for any absence longer than 24 hours.',
    'Use food-safe materials for anything the kibble touches. Standard PLA is generally regarded as food-contact acceptable for dry, short-contact use, but layer lines harbour bacteria — smooth them, or use a food-grade liner.',
    'Keep the motor and electronics fully enclosed. Animals chew cables, and a chewed 12 V lead in a water bowl is a genuine hazard.',
  ],

  maintenance: [
    'Wash the bowl and chute weekly. Fat from kibble builds up and goes rancid, and animals refuse food from a dirty bowl long before a human notices.',
    'Check the auger for wear every few months — a worn auger delivers less per revolution, which shows up as more bursts per meal in the log.',
    'Re-verify the load cell calibration quarterly with a known mass.',
  ],

  future: [
    'Add <b>RFID collar recognition</b> so each animal in a multi-pet household gets its own portion, and one cannot eat another\'s prescription food.',
    'Add a <b>water bowl with its own load cell</b> — declining water intake is a very early indicator of feline kidney disease and is much harder to notice by eye than food intake.',
    'Add <b>eating-rate analysis</b>: the shape of the mass decay curve after a meal changes measurably when an animal is unwell.',
    'Add a <b>hopper stirrer</b> driven off the same motor through a one-way clutch, which nearly eliminates bridging.',
    'Add <b>battery backup</b> so a power cut during an absence does not mean missed meals.',
  ],

  faq: [
    { q: 'Why weigh at all? Timed dispensing is much simpler.', a: 'Because timed dispensing cannot detect its own failure. An auger that jams, a hopper that bridges, or a motor that stalls all produce a feeder that runs for the right duration and delivers nothing — and reports success. If you are away for three days, that is the difference between an inconvenience and a genuine welfare problem.' },
    { q: 'Auger, drum or gate?', a: 'Auger. A rotating drum with pockets is simpler to print but jams badly on irregular or large kibble, and its volume per rotation is fixed so you cannot fine-tune portions. A gate is uncontrollable — it either flows or it does not. An auger gives repeatable volume per revolution, handles a wide kibble range, and can be reversed to clear a jam.' },
    { q: 'How accurate is the portioning?', a: 'About ±2 g on the load cell measurement and ±2 g on the overshoot from the final burst, so roughly ±4 g on a 40 g meal — around 10 %. That is well inside what any veterinary portion guidance requires and dramatically better than a volumetric feeder, which is typically ±25 %.' },
    { q: 'What happens if the Wi-Fi is down?', a: 'Everything except remote control and logging. The schedule lives in NVS and fires from the DS3231 RTC; the manual button works unconditionally; the anti-gorge and jam logic are entirely local. The network is for visibility, never for feeding.' },
    { q: 'Will the motor noise scare my pet?', a: 'Usually the opposite — most animals learn the sound within days and treat it as a dinner bell, which is why the firmware sounds a chime before dispensing. If your animal is genuinely noise-averse, reduce the PWM duty and lengthen the bursts; a slower auger is much quieter.' },
    { q: 'Can it handle wet food?', a: 'No. An auger and a hopper are dry-food mechanisms — wet food will not flow, will clog the auger and will spoil in the hopper. A wet-food feeder is a completely different design based on sealed portion trays and a rotating lid, and it needs refrigeration for anything beyond a few hours.' },
  ],

  refs: [
    { t: 'HX711 24-bit ADC for weigh scales — datasheet', u: 'https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf', s: 'Avia Semiconductor' },
    { t: 'Load cell theory, Wheatstone bridges and mounting', u: 'https://www.hbm.com/en/6768/load-cells-and-force-transducers/', s: 'HBM' },
    { t: 'TB6612FNG dual motor driver — datasheet', u: 'https://www.sparkfun.com/datasheets/Robotics/TB6612FNG.pdf', s: 'Toshiba' },
    { t: 'Screw conveyor (auger) capacity and design fundamentals', u: 'https://www.cemanet.org/publications/', s: 'Conveyor Equipment Manufacturers Association' },
    { t: 'Feline nutrition and portion guidance', u: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/', s: 'WSAVA Global Nutrition Committee' },
    { t: 'Bulk solids flow and hopper bridging', u: 'https://www.jenike.com/bulk-solids-flow-properties/', s: 'Jenike & Johanson' },
  ],

  images: ['motor', 'esp32', 'camera'],
  imageCaptions: [
    'A DC gear motor. The feeder uses one with an encoder to drive the auger, chosen over a servo because a servo cannot report that it is stalling.',
    'An ESP32 development board running the weighing, dispensing and scheduling logic.',
    'A camera module. Confirming the food was actually eaten is as useful as confirming it was dispensed.',
  ],
},

];
