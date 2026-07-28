/* Smart City 084 + Automotive 085–086. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   084 — Digital Signage Controller
   ══════════════════════════════════════════════════════════════════ */
{
  id: '084',
  domainKey: 'iot',
  emoji: '📺', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Manages a fleet of public displays from one place — scheduling content remotely, keeping every screen showing the right thing, and never a blank or frozen screen in public.',

  overview: [
    'A network of public displays — in transit stations, malls, campuses, lobbies, on the street — is only useful if the right content reaches the right screen at the right time, and stays showing. Manage them by walking a USB stick to each screen and you have a system that is always out of date, and where a crashed player leaves a blank or frozen screen in a public place for days. This project builds the controller that fixes that: each display becomes a networked node that plays scheduled content pushed from a central system, and that keeps itself showing correctly — the two things digital signage lives or dies by, <b>remote content management</b> and <b>reliability</b>.',
    'On the content side, a central CMS defines <b>playlists</b> and <b>schedules</b> — what plays, in what order, and when (dayparting: different content by time of day; different content per screen or group) — and pushes them to the players over the network, so updating every screen in a city is a few clicks, not a fleet of trips. Each player caches its content <b>locally</b> so it keeps playing correctly even if the network drops (a signage screen must not go blank because the Wi-Fi hiccupped), and syncs new content and schedules when connected.',
    'On the reliability side, each player <b>watches itself and reports health</b> — is it online, is it actually displaying (not frozen or crashed), what is it showing — so the operator knows the true state of every screen and a fault is caught centrally instead of by an embarrassed passer-by. A watchdog restarts a hung player and falls back to safe default content rather than showing a blank screen or a desktop/error in public. Networked over Wi-Fi/Ethernet to the CMS, this scales to a whole estate of screens, remotely scheduled and health-monitored. It is honest that real signage integrates with a proper CMS and content pipeline and that content licensing/appropriateness is the operator\'s responsibility. But as a remote-scheduling, self-healing, health-reporting signage controller, it turns a set of unmanaged screens into a fleet that always shows the right, current content — and never an embarrassing blank in public.',
  ],
  does: [
    'Plays scheduled content (playlists, dayparting) pushed from a central CMS',
    'Targets content per screen or group remotely',
    'Caches content locally so it keeps playing through network drops',
    'Watches itself — restarts a hung player, falls back to safe default content',
    'Reports health and what it is showing to the operator',
    'Catches faults centrally instead of via a passer-by',
    'Scales to a whole estate of remotely-managed screens',
  ],
  features: [
    'Remote playlist/schedule management (dayparting, per-screen/group)',
    'Local content caching (plays through outages)',
    'Self-healing watchdog + safe fallback (never blank/error in public)',
    'Health/status reporting (online, displaying, showing what)',
    'Central fault visibility',
    'Estate-scale management',
    'Honest about CMS integration and content responsibility',
  ],
  applications: [
    { t: 'Public information displays', d: 'Transit, campus and civic screens with remotely-scheduled, always-current content.' },
    { t: 'Retail / advertising signage', d: 'Dayparted, per-location content and reliable uptime across many screens.' },
    { t: 'Corporate / lobby displays', d: 'Central management and health monitoring of building screens.' },
    { t: 'Menu boards / wayfinding', d: 'Remotely-updated, self-healing displays that never show a blank.' },
  ],
  skills: [
    'Networked media playback and scheduling',
    'Playlist/dayparting and per-screen targeting',
    'Local caching and offline playback',
    'Watchdog/self-healing and safe fallback',
    'Health reporting and central management',
  ],
  prereq: [
    'The two things that matter are remote content management and reliability — never a blank/frozen screen in public.',
    'Cache content locally so a screen keeps playing correctly through a network drop.',
    'Self-heal: a watchdog restarts a hung player and falls back to safe default content, not a desktop/error.',
    'Report health so faults are caught centrally, not by a passer-by.',
  ],

  parts: ['rpi4', 'esp32', 'tft', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Display + media player', spec: 'Public display + a media player (Raspberry Pi common) per screen', qty: 1, price: 4500, note: 'Pi plays media; ESP32 can drive simple/text displays' },
    { name: 'CMS + content pipeline', spec: 'Central system for playlists/schedules/health', qty: 1, price: 0, note: 'Software/platform' },
    { name: 'Network + mount', spec: 'Wi-Fi/Ethernet and secure screen mounting', qty: 1, price: 500 },
    { name: 'Watchdog/health hardware', spec: 'Hardware watchdog for self-healing (or software)', qty: 1, price: 200 },
  ],
  cost: '₹5,000 – ₹8,000 per screen (+ CMS)',
  libs: ['python', 'fastapi', 'sqlite', 'docker', 'ffmpeg'],

  pins: {
    left: [
      { dev: 'Display', devPin: 'HDMI/TFT', pin: '—', sig: 'Content output' },
      { dev: 'Storage', devPin: 'SD/SSD', pin: '—', sig: 'Local content cache' },
    ],
    right: [
      { dev: 'Network', devPin: 'Wi-Fi/Eth', pin: '—', sig: 'CMS sync + health' },
      { dev: 'Watchdog', devPin: 'reset', pin: 'GPIO', sig: 'Self-healing restart' },
      { dev: 'Status', devPin: 'LED', pin: 'GPIO', sig: 'Health' },
      { dev: 'Supply', devPin: '5V', pin: '—', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Each player drives its display and caches content locally so it plays correctly offline.',
    'Connect to the CMS over Wi-Fi/Ethernet for schedule/content sync and health reporting.',
    'Use a watchdog (hardware or software) to restart a hung player and fall back to safe default content.',
    'Never show a desktop, error or blank in public — always fall back to known-good content.',
    'Integrate with a proper CMS/content pipeline for a real deployment.',
  ],

  block: { columns: [
    { label: 'Manage', edge: 'right', blocks: [
      { name: 'CMS', sub: 'playlists/schedules', highlight: true },
      { name: 'Target', sub: 'screen/group' },
    ] },
    { label: 'Distribute', edge: 'right', blocks: [
      { name: 'Push + sync', sub: 'to players' },
      { name: 'Local cache', sub: 'offline play' },
    ] },
    { label: 'Play + heal', edge: 'right', blocks: [
      { name: 'Player', sub: 'schedule', highlight: true },
      { name: 'Watchdog', sub: 'safe fallback' },
    ] },
    { label: 'Monitor', edge: 'none', blocks: [
      { name: 'Health', sub: 'online/showing' },
      { name: 'Faults', sub: 'central' },
    ] },
  ] },
  flow: [
    { t: 'CMS: define playlist/schedule', k: 'start' },
    { t: 'Push to targeted players', k: 'io' },
    { t: 'Player: cache + play by schedule', k: 'proc' },
    { t: 'Player healthy/displaying?', k: 'dec', yes: 'Report health', no: 'Watchdog restart / safe fallback' },
    { t: 'Watchdog restart / safe fallback', k: 'io' },
    { t: 'Report health', k: 'io' },
    { t: 'Operator: monitor + update', k: 'end', back: 'CMS: define playlist/schedule' },
  ],

  principle: [
    'Digital signage is deceptively simple to demo and hard to run at scale, and the two properties that separate a real system from a laptop showing a slideshow are exactly what this controller provides: <b>remote content management</b> and <b>reliability</b>. Everything else — nice transitions, fancy layouts — is secondary to getting the right content onto every screen without visiting it, and keeping every screen showing correctly without an operator watching it.',
    '<b>Remote content management</b> means content is defined centrally and pushed to players over the network. A CMS holds <b>playlists</b> (what plays and in what order) and <b>schedules</b> (when) — including <b>dayparting</b> (different content by time of day) and <b>targeting</b> (different content per screen or group) — and distributes them to the players. Updating a campaign across a city becomes a few clicks in the CMS rather than a trip to each screen with a USB stick, which is the entire operational value: content stays current everywhere, effortlessly. Crucially, each player caches its content <b>locally</b>, so it plays from local storage and keeps showing correctly even when the network drops — a public screen must never go blank because the Wi-Fi hiccupped — syncing new content and schedules opportunistically when connected.',
    '<b>Reliability</b> is the other half, and it is about a player <b>looking after itself</b> in an unattended public place. A media player can crash, hang, or exit to a desktop or an error dialog — and a frozen or blank or error-showing screen in public is worse than embarrassing, it undermines the whole point. So each player runs a <b>watchdog</b> that detects a hung or failed player and <b>restarts</b> it, and — critically — falls back to <b>safe default content</b> (a known-good loop, a logo, an "information coming soon" card) rather than ever exposing a blank, a desktop, or an error. The screen is designed so that its worst failure mode is still presentable.',
    'Tying it together is <b>health reporting and central visibility</b>. Each player reports its status — is it online, is it actually <i>displaying</i> (not merely powered), what is it currently showing — so the operator has a live, accurate picture of the whole estate and a fault is <b>caught centrally</b> (an alert in the CMS) rather than by an embarrassed member of the public phoning in. This closes the loop: the operator knows every screen\'s true state, faults surface to them first, and content is verifiably where it should be. The design is honest that a real deployment integrates with a proper CMS and content pipeline, and that content licensing and appropriateness are the operator\'s responsibility. But the core contribution is exactly what running public screens requires: manage content remotely so every screen is always current, and make each screen self-healing and self-reporting so it never shows an embarrassing blank and its faults reach the operator, not the public.',
  ],
  equations: [
    { t: 'Schedule / dayparting resolution', eq: 'For a player P at time t:\n\n  active_playlist = schedule(P, t)   (dayparting + targeting)\n  play items in order from the LOCAL cache\n\nContent is defined centrally, resolved locally → current\ncontent everywhere without visiting screens.' },
    { t: 'Offline continuity', eq: 'Player plays from a local cache:\n  if online: sync new content/schedules opportunistically\n  if offline: keep playing cached content correctly\n\nA network drop must NOT blank the screen.' },
    { t: 'Self-healing + safe fallback', eq: 'watchdog: if player hung/exited → restart it\nif no valid content/schedule → show SAFE DEFAULT content\n(never a blank/desktop/error in public)\n\nreport health: {online, displaying, current_item} → CMS' },
  ],

  assembly: [
    { h: 'Build the self-healing player', p: [
      'Each player: drive the display, cache content locally, play by schedule, and run a watchdog that restarts a hung player and falls back to safe default content.',
    ], warn: 'Never show a blank, desktop or error in public. Design the worst failure mode to be safe default content, and cache locally so a network drop never blanks the screen.' },
    { h: 'Set up remote content management', p: [
      'A CMS defines playlists/schedules (dayparting, per-screen/group) and pushes them to players, which sync opportunistically.',
    ] },
    { h: 'Set up health monitoring', p: [
      'Each player reports online/displaying/current-item health to the CMS so faults are caught centrally.',
    ] },
  ],
  steps: [
    { h: 'Play by schedule with local cache and fallback', p: [
      'Resolve the active playlist for the current time (dayparting/targeting) from the local cache, play it, and fall back to safe default content if none is valid.',
    ], code: {
      file: 'player.py', lang: 'python',
      body: `import time

class Player:
    def __init__(self, cache, watchdog):
        self.cache, self.wd = cache, watchdog

    def active_playlist(self, now):
        # dayparting + targeting resolved from the synced schedule
        return self.cache.schedule_for(now, this_screen())

    def run(self):
        while True:
            self.wd.pet()                      # tell the watchdog we're alive
            pl = self.active_playlist(time.time())
            if not pl or not self.cache.valid(pl):
                self.show_safe_default()       # never blank/error in public
                continue
            for item in pl.items:
                if not self.cache.has(item):   # missing media -> skip safely
                    continue
                self.display(item)             # play from LOCAL cache
                self.report_health(showing=item.id)
                self.wd.pet()`,
      explain: [
        { ref: 'self.wd.pet()                      # tell the watchdog we\'re alive', txt: 'The player regularly pets the watchdog; if it hangs and stops petting, the watchdog restarts it — the self-healing that keeps an unattended screen running.' },
        { ref: 'if not pl or not self.cache.valid(pl):\n                self.show_safe_default()', txt: 'With no valid playlist or content, the player shows safe default content instead of ever exposing a blank, desktop or error in public.' },
        { ref: 'self.display(item)             # play from LOCAL cache', txt: 'Content plays from the local cache, so a network drop never blanks the screen — offline continuity by design.' },
        { ref: 'self.report_health(showing=item.id)', txt: 'The player reports what it is actually showing, so the operator knows the true state of every screen centrally.' },
      ],
    } },
    { h: 'Manage centrally and monitor health', p: [
      'Define/push playlists and schedules from the CMS, sync to players, and monitor each player\'s health (online/displaying/showing) so faults surface centrally.',
    ], tip: 'Report "displaying" (actually showing content), not just "online" — a powered-but-frozen player is online yet failing, and only a displaying check catches it.' },
  ],

  code: [{
    file: 'signage_controller.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Digital Signage Controller — player node (Raspberry Pi)

Plays centrally-scheduled content from a local cache (offline-continuous),
self-heals with a watchdog + safe fallback (never blank/error in public),
and reports health (online/displaying/showing) to the CMS.
"""
import time, threading, requests

class Watchdog:
    def __init__(self, timeout=30): self.timeout=timeout; self.last=time.time()
    def pet(self): self.last=time.time()
    def watch(self, on_hang):
        while True:
            if time.time()-self.last > self.timeout: on_hang()  # restart player
            time.sleep(5)

class SignagePlayer:
    def __init__(self, cms, screen_id):
        self.cms, self.screen = cms, screen_id
        self.wd = Watchdog()
        threading.Thread(target=self.wd.watch, args=(self.restart,), daemon=True).start()
        threading.Thread(target=self.sync_loop, daemon=True).start()

    def sync_loop(self):                       # pull schedule/content when online
        while True:
            try:
                sched = requests.get(f"{self.cms}/schedule/{self.screen}", timeout=5).json()
                self.cache_schedule(sched)     # store locally for offline play
            except requests.RequestException:
                pass                           # offline: keep playing cached
            time.sleep(60)

    def report(self, displaying, showing):
        try: requests.post(f"{self.cms}/health/{self.screen}",
                           json={"online": True, "displaying": displaying,
                                 "showing": showing}, timeout=5)
        except requests.RequestException: pass

    def show_safe_default(self):
        self.render("safe_default.mp4")        # known-good; never blank/error
        self.report(displaying=True, showing="safe_default")

    def restart(self): self.render_restart()   # watchdog fired -> restart player

    def run(self):
        while True:
            self.wd.pet()
            pl = self.local_playlist(time.time())      # dayparting/targeting
            if not pl:
                self.show_safe_default(); time.sleep(5); continue
            for item in pl:
                if not self.cached(item): continue     # skip missing safely
                self.render(item)                      # from LOCAL cache
                self.report(displaying=True, showing=item)
                self.wd.pet()

if __name__ == "__main__":
    SignagePlayer(CMS_URL, SCREEN_ID).run()`,
    explain: [
      { ref: 'class Watchdog:', txt: 'A watchdog thread restarts the player if it stops petting — self-healing that keeps an unattended public screen running without an operator.' },
      { ref: 'except requests.RequestException:\n                pass                           # offline: keep playing cached', txt: 'When the CMS is unreachable the player keeps playing its cached content, so a network drop never blanks the screen.' },
      { ref: 'def show_safe_default(self):', txt: 'The fallback renders known-good content rather than ever exposing a blank, desktop or error in public — the safe worst-case.' },
      { ref: 'def report(self, displaying, showing):', txt: 'The player reports whether it is actually displaying and what it is showing, so faults are visible centrally, not to a passer-by.' },
      { ref: 'pl = self.local_playlist(time.time())      # dayparting/targeting', txt: 'The active playlist is resolved locally for the current time and screen, so content stays current everywhere without visiting screens.' },
    ],
  }],

  config: [
    'Configure the CMS URL, screen ID/group, and the local content cache.',
    'Define playlists/schedules (dayparting, targeting) in the CMS.',
    'Configure the watchdog timeout and safe default content.',
    'Configure health reporting (online/displaying/showing).',
  ],
  calibration: [
    { h: 'Offline continuity', p: [
      'Verify the player keeps playing correct content when the CMS/network is unavailable, and syncs on reconnect.',
    ] },
    { h: 'Self-healing', p: [
      'Confirm the watchdog restarts a hung player and that it falls back to safe default content — never a blank/error.',
    ] },
    { h: 'Health accuracy', p: [
      'Confirm health reflects actual display state (displaying/showing), not just power/network.',
    ] },
  ],
  testing: [
    { step: 'Push a new schedule/playlist', expect: 'Targeted screens update remotely' },
    { step: 'Drop the network', expect: 'Screen keeps playing cached content; syncs on reconnect' },
    { step: 'Hang the player', expect: 'Watchdog restarts it; safe fallback meanwhile' },
    { step: 'Remove content', expect: 'Safe default shown — never blank/error' },
    { step: 'Freeze the player (powered but stuck)', expect: 'Health shows not-displaying; fault caught centrally' },
    { step: 'Daypart change', expect: 'Correct content plays for the time of day' },
  ],
  output: [
    'The CMS shows each screen\'s online/displaying status and current content, supports remote scheduling/targeting, and alerts on faults.',
    { file: 'screen-health.json', lang: 'json', body: `{
  "screen": "S-118",
  "online": true,
  "displaying": true,
  "showing": "campaign_autumn_02",
  "last_sync": "2026-07-27T14:00:00"
}` },
    'Screen S-118 online, actually displaying the scheduled campaign — verifiable centrally; a frozen or offline screen would surface as a fault in the CMS before any passer-by noticed.',
  ],
  troubleshoot: [
    { sym: 'Blank/error screen in public', cause: 'No safe fallback / not caching', fix: 'Fall back to safe default content; cache locally; never expose desktop/error' },
    { sym: 'Screens out of date', cause: 'Manual content updates', fix: 'Manage centrally via CMS; push schedules; sync players' },
    { sym: 'Frozen player looks "online"', cause: 'Only checking power/network', fix: 'Report and check "displaying" (actually showing content)' },
    { sym: 'Network drop blanks screen', cause: 'No local cache', fix: 'Cache content locally; play offline; sync on reconnect' },
    { sym: 'Hung player stays hung', cause: 'No watchdog', fix: 'Add a watchdog that restarts a hung player' },
  ],

  iot: {
    protoShort: 'Wi-Fi/Ethernet → signage CMS',
    net: {
      nodes: [{ name: 'Player', sub: 'Pi/ESP32' }, { name: 'Other screens', sub: 'estate' }],
      protocol: 'Wi-Fi/Ethernet', gateway: 'Network', gatewaySub: 'to CMS',
      uplink: 'HTTPS', cloud: 'Signage CMS', cloudSub: 'schedules + health',
      clients: [{ name: 'CMS', sub: 'manage' }, { name: 'Ops', sub: 'health/faults' }],
    },
    protocol: ['Players pull schedules/content and push health (online/displaying/showing); content plays from a local cache so outages do not blank screens.'],
    topics: [
      { t: 'signage/<screen>/schedule', dir: 'CMS → player', payload: 'playlists/schedules (dayparting/targeting)' },
      { t: 'signage/<screen>/health', dir: 'player → CMS', payload: 'online, displaying, showing' },
      { t: 'signage/<screen>/alert', dir: 'player → ops', payload: 'fault (offline/frozen)' },
    ],
    cloud: ['A CMS manages content/schedules across the estate, verifies what each screen shows, and alerts on faults — content current everywhere, faults caught centrally.'],
    dashboard: ['An estate view of screen status/content, remote scheduling/targeting, and fault alerts.'],
    mobile: ['Fault alerts (offline/frozen screens) and content-update confirmations.'],
    security: [
      'Authenticate content pushes and health; secure the CMS/content pipeline.',
      'Cache locally and fail safe so outages never blank screens.',
      'Operator is responsible for content licensing/appropriateness.',
    ],
  },

  perf: [
    'Play from a local cache; sync opportunistically for offline continuity.',
    'Watchdog + safe fallback so the worst failure is presentable.',
    'Report "displaying" health, not just online.',
    'Scale via the CMS across the estate.',
  ],
  safety: [
    'Never show a blank, desktop or error in public — fail safe to known-good content.',
    'Content licensing and appropriateness are the operator\'s responsibility.',
    'Mount screens securely; follow electrical/installation safety.',
    'Secure the CMS/content pipeline against unauthorised content.',
  ],
  maintenance: [
    'Monitor screen health; act on faults caught centrally.',
    'Verify safe-fallback and watchdog behaviour.',
    'Keep content/schedules current via the CMS.',
    'Check caching/sync and player health across the estate.',
  ],
  future: [
    'Add interactive/触ouch and sensor-triggered content.',
    'Add proof-of-play logging for advertising.',
    'Add content approval workflows and templating.',
    'Add richer analytics (audience/engagement) where appropriate.',
  ],
  faq: [
    { q: 'What two things matter most in signage?', a: 'Remote content management (getting the right, current content onto every screen without visiting it) and reliability (never a blank, frozen or error screen in public). This controller provides both.' },
    { q: 'What happens when the network drops?', a: 'The screen keeps playing its locally-cached content correctly and syncs new content when the connection returns. A public screen must never go blank because the Wi-Fi hiccupped.' },
    { q: 'How does it avoid embarrassing failures?', a: 'A watchdog restarts a hung player, and the worst failure mode is designed to be safe default content (a known-good loop or card) — never a blank, a desktop, or an error dialog in public.' },
    { q: 'How does the operator know a screen has failed?', a: 'Each player reports whether it is actually displaying content (not just powered/online) and what it is showing, so a frozen or offline screen surfaces as a fault in the CMS before any passer-by notices.' },
    { q: 'What is dayparting?', a: 'Scheduling different content by time of day (and per screen/group), so a screen shows the right thing at the right time — all defined centrally and pushed to the players.' },
  ],
  refs: [
    { t: 'Digital signage', u: 'https://en.wikipedia.org/wiki/Digital_signage', s: 'Reference' },
    { t: 'Content management systems for signage', u: 'https://en.wikipedia.org/wiki/Digital_signage#Content_management', s: 'Reference' },
    { t: 'Watchdog timers / self-healing', u: 'https://en.wikipedia.org/wiki/Watchdog_timer', s: 'Reference' },
    { t: 'Dayparting', u: 'https://en.wikipedia.org/wiki/Dayparting', s: 'Reference' },
    { t: 'Raspberry Pi media playback', u: 'https://www.raspberrypi.com/', s: 'Raspberry Pi' },
  ],
  images: ['city', 'esp32', 'retail'],
  imageCaptions: [
    'A fleet of public displays managed from one place — always showing the right, current content.',
    'Each player caches content locally and self-heals so a network drop or crash never blanks the screen.',
    'The CMS verifies what every screen is showing and catches faults before a passer-by does.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   085 — OBD-II Fleet Tracker
   ══════════════════════════════════════════════════════════════════ */
{
  id: '085',
  domainKey: 'iot',
  emoji: '🚚', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Plugs into a vehicle\'s OBD-II port to stream health, location and driving behaviour — turning a fleet into data a manager can actually act on.',

  overview: [
    'Every car and truck built in the last two decades carries a rich diagnostic computer and a standard socket to read it — the <b>OBD-II</b> port — yet most fleets throw that data away, managing vehicles by guesswork: they learn a van is broken when it breaks down, learn a driver speeds when there is a complaint, and have no idea which vehicle is where. This project plugs a tracker into the OBD-II port to stream the three things a fleet actually needs: <b>vehicle health</b> (fault codes and live engine data), <b>location</b> (GPS), and <b>driving behaviour</b> (telematics) — turning each vehicle into a live data feed a manager can act on.',
    'On <b>health</b>, the tracker reads the OBD-II diagnostic trouble codes (DTCs) — the same codes a garage reads — so a fault (a check-engine condition, an emissions problem) is known the moment it appears, not at the next breakdown, enabling proactive maintenance. It also reads live parameters (engine RPM, coolant temperature, fuel/consumption, speed) for condition and efficiency insight. On <b>location</b>, a GPS gives real-time position for dispatch, routing and utilisation. On <b>driving behaviour</b>, it derives <b>telematics</b> — harsh braking, harsh acceleration, cornering, speeding, idling — from the OBD speed and an accelerometer, which is what drives safety, fuel economy and insurance outcomes.',
    'Streamed over cellular to a fleet platform, this gives a manager a live picture of every vehicle\'s health, whereabouts and driving — the foundation of modern fleet management: fewer breakdowns (proactive maintenance from DTCs), lower costs (efficiency and reduced harsh driving/idling), better utilisation and safety, and evidence for coaching and disputes. It is honest that OBD-II parameter support varies by vehicle, that reading the port must not interfere with vehicle systems, and that driver-behaviour data is sensitive and must be handled fairly and lawfully. But as an OBD-II tracker unifying health, location and telematics, it converts a fleet from a set of unmonitored vehicles into a managed, data-driven operation.',
  ],
  does: [
    'Reads OBD-II diagnostic trouble codes (health/faults)',
    'Reads live engine parameters (RPM, temp, fuel, speed)',
    'Tracks GPS location for dispatch/utilisation',
    'Derives driving telematics (harsh braking/accel, speeding, idling)',
    'Streams health/location/behaviour to a fleet platform over cellular',
    'Enables proactive maintenance, efficiency and safety',
    'Provides evidence for coaching and disputes',
  ],
  features: [
    'OBD-II DTC + live-parameter reading',
    'GPS location/utilisation',
    'Driving telematics (harsh events, speeding, idling)',
    'Cellular streaming to a fleet platform',
    'Proactive maintenance from fault codes',
    'Efficiency/safety insight',
    'Honest about OBD support, non-interference, data sensitivity',
  ],
  applications: [
    { t: 'Fleet management', d: 'Health, location and driving behaviour across a fleet for cost, safety and uptime.' },
    { t: 'Proactive maintenance', d: 'Acting on fault codes before breakdowns.' },
    { t: 'Insurance telematics (UBI)', d: 'Driving-behaviour data for usage-based insurance/coaching.' },
    { t: 'Logistics / dispatch', d: 'Live location and utilisation for routing.' },
  ],
  skills: [
    'OBD-II (ELM327/CAN) reading of DTCs and PIDs',
    'GPS tracking',
    'Telematics (harsh events, speeding, idling) from OBD + accelerometer',
    'Cellular streaming to a platform',
    'Handling driver data fairly/lawfully',
  ],
  prereq: [
    'The fleet value is unifying health + location + behaviour into actionable data.',
    'OBD-II parameter (PID) support varies by vehicle — handle unsupported PIDs gracefully.',
    'Reading the port must NOT interfere with vehicle systems; read, don\'t disrupt.',
    'Driver-behaviour data is sensitive — handle it fairly, transparently and lawfully.',
  ],

  parts: ['esp32', 'neo6m', 'sim800', 'mpu6050', 'oled', 'li18650'],
  extraParts: [
    { name: 'OBD-II interface (ELM327/CAN)', spec: 'OBD-II reader (ELM327 or a CAN transceiver) to the vehicle port', qty: 1, price: 500, note: 'Reads DTCs and live PIDs' },
    { name: 'GPS + cellular', spec: 'GPS module and cellular modem/SIM for location + streaming', qty: 1, price: 1200 },
    { name: 'Accelerometer', spec: 'For harsh-event telematics', qty: 1, price: 150 },
    { name: 'OBD-powered enclosure', spec: 'Powered from the OBD port; compact in-vehicle housing', qty: 1, price: 300 },
  ],
  cost: '₹2,500 – ₹4,500 per vehicle',
  libs: ['wifi', 'pubsub', 'tinygps', 'mpu', 'arduinojson', 'ntp'],

  pins: {
    left: [
      { dev: 'OBD-II (ELM327/CAN)', devPin: 'UART/CAN', pin: 'GPIO 16/17', sig: 'DTCs + live PIDs' },
      { dev: 'GPS', devPin: 'TX/RX', pin: 'GPIO 26/25', sig: 'Location' },
      { dev: 'Accelerometer', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Harsh events' },
    ],
    right: [
      { dev: 'Cellular modem', devPin: 'UART', pin: 'GPIO 27/14', sig: 'Stream to platform' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Status' },
      { dev: 'OBD power', devPin: '12V', pin: 'reg', sig: 'From OBD port' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Health' },
    ],
  },
  wiringNotes: [
    'Interface the OBD-II port (ELM327 or CAN) to read DTCs and live PIDs; read only — do not write to or interfere with vehicle systems.',
    'Add GPS for location and a cellular modem for streaming; power from the OBD port (with a safe regulator).',
    'Add an accelerometer for harsh-event telematics alongside OBD speed.',
    'Handle unsupported PIDs gracefully — support varies by vehicle.',
    'Treat driver-behaviour data as sensitive; handle fairly and lawfully.',
  ],

  block: { columns: [
    { label: 'Read vehicle', edge: 'right', blocks: [
      { name: 'OBD-II', sub: 'DTCs + PIDs', highlight: true },
      { name: 'GPS', sub: 'location' },
      { name: 'Accel', sub: 'harsh events' },
    ] },
    { label: 'Derive', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'health/telematics' },
    ] },
    { label: 'Stream', edge: 'right', blocks: [
      { name: 'Cellular', sub: 'to platform' },
    ] },
    { label: 'Manage', edge: 'none', blocks: [
      { name: 'Fleet platform', sub: 'health/loc/behaviour' },
      { name: 'Act', sub: 'maintenance/safety' },
    ] },
  ] },
  flow: [
    { t: 'Read OBD (DTCs+PIDs), GPS, accel', k: 'start' },
    { t: 'New fault code (DTC)?', k: 'dec', yes: 'Health alert (proactive maintenance)', no: 'Derive telematics' },
    { t: 'Health alert (proactive maintenance)', k: 'io' },
    { t: 'Derive telematics', k: 'proc' },
    { t: 'Harsh event / speeding / idling?', k: 'dec', yes: 'Flag behaviour event', no: 'Report status/location' },
    { t: 'Flag behaviour event', k: 'io' },
    { t: 'Report status/location', k: 'io' },
    { t: 'Stream to platform', k: 'end', back: 'Read OBD (DTCs+PIDs), GPS, accel' },
  ],

  principle: [
    'A modern vehicle is already a dense sensor network with a standard interface — the <b>OBD-II</b> port mandated on cars and light trucks — reporting engine and emissions data and storing <b>diagnostic trouble codes</b> when something is wrong. A fleet that ignores this manages blind; a fleet that reads it gains exactly the three data streams that matter operationally. The tracker\'s job is to unify them: <b>health</b> from OBD, <b>location</b> from GPS, and <b>behaviour</b> from telematics — because a manager needs all three together (where is the vehicle, is it healthy, is it being driven well) to actually run a fleet.',
    '<b>Health</b> is the highest-value stream. Reading the OBD-II DTCs gives the same fault information a garage sees — the moment a fault appears (a check-engine condition, a sensor fault, an emissions problem), the fleet knows, rather than discovering it at the next roadside breakdown. That enables <b>proactive maintenance</b>: schedule the repair before the failure, avoiding the far larger cost and downtime of a breakdown. Live parameters (RPM, coolant temperature, fuel trims, consumption) add condition and efficiency insight, though the design must handle the reality that <b>PID support varies by vehicle</b> — not every parameter is available on every make, so unsupported reads are handled gracefully.',
    '<b>Location</b> is the obvious stream and the enabler of dispatch, routing and utilisation, and <b>behaviour telematics</b> is the stream that changes outcomes. From the OBD speed and an accelerometer, the tracker derives the events that drive fleet safety and cost: <b>harsh braking and acceleration</b>, hard cornering, <b>speeding</b>, and excessive <b>idling</b>. These are the levers of fuel economy (harsh driving and idling waste fuel), safety (harsh events and speeding cause crashes), wear (aggressive driving wears vehicles), and insurance (usage-based insurance prices on exactly this behaviour). Turning raw motion into these named events is what lets a manager coach drivers, cut fuel, and evidence disputes.',
    'Streamed to a <b>fleet platform</b> over cellular, the three streams together transform operations: proactive maintenance from DTCs cuts breakdowns; efficiency and reduced harsh-driving/idling cut fuel and wear; live location improves utilisation and routing; and behaviour data supports safety coaching and insurance. The design is honest about its constraints and responsibilities: OBD parameter support varies, so the tracker degrades gracefully; reading the port must <b>never interfere</b> with vehicle systems (it reads, it does not disrupt safety-critical buses); and driver-behaviour data is <b>sensitive personal data</b> that must be handled <b>fairly, transparently and lawfully</b> (drivers informed, data used for legitimate fleet purposes, privacy respected). Within that frame, it does what fleet management fundamentally requires — turn a set of unmonitored vehicles into a live, unified feed of health, location and behaviour that a manager can act on.',
  ],
  equations: [
    { t: 'Health from OBD-II', eq: 'Read DTCs (mode 03) and live PIDs (mode 01):\n\n  new DTC → fault alert (proactive maintenance)\n  live: RPM, coolant temp, speed, fuel/consumption\n  handle unsupported PIDs gracefully (support varies).' },
    { t: 'Driving telematics', eq: 'From OBD speed v and accelerometer a:\n\n  harsh braking if a_long < −A_HB\n  harsh accel   if a_long >  A_HA\n  hard corner   if |a_lat| > A_C\n  speeding      if v > speed_limit(location)\n  idling        if engine on AND v ≈ 0 for > t_idle\n\nThese drive safety, fuel and insurance outcomes.' },
    { t: 'Actionable value', eq: 'proactive_maintenance: fix on DTC before breakdown\nfuel/safety: coach out harsh events + idling\nutilisation: from location + status\ninsurance/UBI: price on behaviour (handled lawfully).' },
  ],

  assembly: [
    { h: 'Interface the OBD-II port (read-only)', p: [
      'Connect an ELM327/CAN interface to read DTCs and live PIDs, powered from the OBD port. Read only — never write to or disrupt vehicle systems.',
      'Handle unsupported PIDs gracefully.',
    ], warn: 'Read, do not disrupt. The tracker must not interfere with vehicle systems or safety-critical buses. And driver-behaviour data is sensitive — handle it fairly and lawfully.' },
    { h: 'Add location and telematics sensing', p: [
      'Add GPS for location and an accelerometer for harsh-event telematics alongside OBD speed.',
    ] },
    { h: 'Stream and manage', p: [
      'Stream health/location/behaviour to a fleet platform over cellular; alert on new DTCs and behaviour events.',
    ] },
  ],
  steps: [
    { h: 'Read health and derive telematics', p: [
      'Read DTCs and live PIDs, and derive harsh-event/speeding/idling telematics from OBD speed and the accelerometer.',
    ], code: {
      file: 'obd-telematics.ino', lang: 'cpp',
      body: `#define A_HB 0.35f    // g harsh braking
#define A_HA 0.30f    // g harsh acceleration
#define T_IDLE_S 180  // idling threshold

// Read stored fault codes (health).
int readDTCs(char codes[][6], int max){
  return obdReadMode03(codes, max);      // e.g. "P0301"
}

// Derive a driving event from OBD speed + accelerometer.
const char* drivingEvent(float speed_kmh, float aLong, float aLat,
                         float limit_kmh, uint32_t idleSecs){
  if (aLong < -A_HB) return "harsh braking";
  if (aLong >  A_HA) return "harsh acceleration";
  if (fabsf(aLat) > 0.35f) return "hard cornering";
  if (limit_kmh>0 && speed_kmh > limit_kmh + 10) return "speeding";
  if (speed_kmh < 3 && engineOn() && idleSecs > T_IDLE_S) return "excessive idling";
  return nullptr;
}`,
      explain: [
        { ref: 'int readDTCs(char codes[][6], int max)', txt: 'Reads the stored diagnostic trouble codes — the same fault information a garage sees — so a fault is known the moment it appears, enabling proactive maintenance.' },
        { ref: 'if (aLong < -A_HB) return "harsh braking"', txt: 'Harsh braking/acceleration are derived from the accelerometer, the safety- and fuel-relevant events a manager coaches out.' },
        { ref: 'if (limit_kmh>0 && speed_kmh > limit_kmh + 10) return "speeding"', txt: 'Speeding is flagged against the location\'s limit — a core safety and insurance signal.' },
        { ref: 'if (speed_kmh < 3 && engineOn() && idleSecs > T_IDLE_S)', txt: 'Excessive idling wastes fuel and is flagged from engine-on with near-zero speed over a threshold.' },
      ],
    } },
    { h: 'Stream and alert', p: [
      'Stream health (DTCs/PIDs), location and behaviour events to the fleet platform over cellular, alerting on new faults and behaviour events; handle driver data lawfully.',
    ], tip: 'Alert on a new DTC immediately — that is the proactive-maintenance win that prevents a roadside breakdown.' },
  ],

  code: [{
    file: 'obd-fleet-tracker.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   OBD-II Fleet Tracker — ESP32

   Reads vehicle HEALTH (DTCs + live PIDs), LOCATION (GPS) and driving
   BEHAVIOUR (telematics), and streams them to a fleet platform over
   cellular. Read-only (no interference); driver data handled lawfully.
   ══════════════════════════════════════════════════════════════════ */

#include <TinyGPS++.h>
#include <Wire.h>
#include <MPU6050.h>

#define A_HB 0.35f
#define A_HA 0.30f
#define T_IDLE_S 180
#define VEHICLE_ID 42

TinyGPSPlus gps; HardwareSerial gpsSer(2);
MPU6050 imu;
uint32_t idleSince=0;

int readDTCs(char c[][6], int max){ return obdMode03(c, max); }     // faults
float obdSpeed(){ return obdPID(0x0D); }                            // km/h
float coolant(){ return obdPID(0x05); }                             // degC
float rpm(){ return obdPID(0x0C); }

const char* drivingEvent(float v, float aL, float aLat, float limit,
                         uint32_t idleS){
  if (aL < -A_HB) return "harsh braking";
  if (aL >  A_HA) return "harsh acceleration";
  if (fabsf(aLat) > 0.35f) return "hard cornering";
  if (limit>0 && v > limit+10) return "speeding";
  if (v < 3 && engineOn() && idleS > T_IDLE_S) return "excessive idling";
  return nullptr;
}

void stream(const char* json){ sendOverCellular("fleet/telemetry", json); }

void setup(){
  Serial.begin(115200);
  gpsSer.begin(9600, SERIAL_8N1, 26, 25);
  Wire.begin(21,22); imu.initialize();
  obdInit();                                    // ELM327/CAN, read-only
}

void loop(){
  while (gpsSer.available()) gps.encode(gpsSer.read());

  // HEALTH: new DTCs -> proactive maintenance alert
  static char codes[8][6]; int n = readDTCs(codes, 8);
  if (n > 0){
    char m[160]; snprintf(m,sizeof m,
      "{\\"veh\\":%d,\\"dtc\\":\\"%s\\",\\"health\\":\\"fault\\"}",
      VEHICLE_ID, codes[0]);
    stream(m);
  }

  // BEHAVIOUR: telematics from OBD speed + accelerometer
  int16_t ax,ay,az; imu.getAcceleration(&ax,&ay,&az);
  float aL = ax/16384.0f, aLat = ay/16384.0f;
  float v = obdSpeed();
  if (v < 3){ if(!idleSince) idleSince=millis(); } else idleSince=0;
  uint32_t idleS = idleSince? (millis()-idleSince)/1000 : 0;
  const char* ev = drivingEvent(v, aL, aLat, speedLimitAt(gps.location), idleS);

  char m[260];
  snprintf(m,sizeof m,
    "{\\"veh\\":%d,\\"lat\\":%.6f,\\"lon\\":%.6f,\\"kmh\\":%.0f,"
    "\\"rpm\\":%.0f,\\"coolant\\":%.0f,\\"event\\":\\"%s\\"}",
    VEHICLE_ID, gps.location.lat(), gps.location.lng(), v, rpm(), coolant(),
    ev?ev:"none");
  stream(m);
  if (ev) sendOverCellular("fleet/event", m);

  delay(2000);
}`,
    explain: [
      { ref: 'int n = readDTCs(codes, 8);', txt: 'The tracker reads stored fault codes and streams a health alert on a new one — proactive maintenance before a breakdown.' },
      { ref: 'float obdSpeed(){ return obdPID(0x0D); }', txt: 'Live parameters are read via OBD PIDs (speed, RPM, coolant), degrading gracefully where a vehicle does not support a PID.' },
      { ref: 'const char* ev = drivingEvent(v, aL, aLat, speedLimitAt', txt: 'Driving behaviour (harsh events, speeding, idling) is derived from OBD speed and the accelerometer — the telematics that drive safety and fuel outcomes.' },
      { ref: 'obdInit();                                    // ELM327/CAN, read-only', txt: 'The OBD interface is read-only, so the tracker never writes to or interferes with vehicle systems.' },
      { ref: 'stream(m)', txt: 'Health, location and behaviour are streamed together to the fleet platform — the unified feed a manager acts on.' },
    ],
  }],

  config: [
    'Configure the OBD interface (ELM327/CAN), the PIDs to read, and DTC handling.',
    'Configure GPS, cellular streaming, and telematics thresholds (harsh/speeding/idling).',
    'Handle unsupported PIDs gracefully per vehicle.',
    'Configure lawful/transparent handling of driver-behaviour data.',
  ],
  calibration: [
    { h: 'OBD/PIDs', p: [
      'Verify DTC reading and which PIDs the vehicle supports; handle unsupported ones.',
    ] },
    { h: 'Telematics', p: [
      'Calibrate accelerometer orientation and harsh-event thresholds so real events flag without excess false positives.',
    ] },
    { h: 'Location/streaming', p: [
      'Verify GPS fix and cellular streaming across the operating area.',
    ] },
  ],
  testing: [
    { step: 'Induce/read a DTC', expect: 'Health alert (proactive maintenance)' },
    { step: 'Read live PIDs', expect: 'RPM/speed/coolant streamed; unsupported handled' },
    { step: 'Harsh brake/accelerate', expect: 'Behaviour event flagged' },
    { step: 'Speed over the limit', expect: 'Speeding event' },
    { step: 'Idle the engine', expect: 'Excessive-idling event' },
    { step: 'Track location', expect: 'Live position for dispatch/utilisation' },
  ],
  output: [
    'The fleet platform shows each vehicle\'s health (faults), location, live parameters and driving events, enabling maintenance, dispatch and safety coaching.',
    { file: 'fleet-telemetry.json', lang: 'json', body: `{
  "veh": 42,
  "lat": 28.61390,
  "lon": 77.20900,
  "kmh": 58,
  "rpm": 2100,
  "coolant": 92,
  "event": "harsh braking"
}` },
    'A vehicle\'s live health, location and a harsh-braking event — the unified feed a fleet manager acts on; a new DTC would raise a proactive-maintenance alert before a breakdown.',
  ],
  troubleshoot: [
    { sym: 'Some PIDs missing', cause: 'Vehicle doesn\'t support them', fix: 'Handle unsupported PIDs gracefully; rely on supported ones' },
    { sym: 'No DTCs read', cause: 'OBD interface/protocol', fix: 'Verify ELM327/CAN and the vehicle\'s OBD protocol' },
    { sym: 'False harsh events', cause: 'Accelerometer orientation/thresholds', fix: 'Calibrate orientation; tune thresholds' },
    { sym: 'Interfering with the vehicle', cause: 'Writing to the bus', fix: 'Read-only; never write to or disrupt vehicle systems' },
    { sym: 'Driver-data concerns', cause: 'Unfair/opaque handling', fix: 'Inform drivers; use data for legitimate purposes; comply with law' },
  ],

  iot: {
    protoShort: 'Cellular → fleet management platform',
    net: {
      nodes: [{ name: 'OBD tracker', sub: 'ESP32' }, { name: 'Fleet', sub: 'all vehicles' }],
      protocol: 'Cellular', gateway: 'Carrier', gatewaySub: 'to platform',
      uplink: 'MQTT/HTTPS', cloud: 'Fleet platform', cloudSub: 'health/loc/behaviour',
      clients: [{ name: 'Manager', sub: 'dashboard' }, { name: 'Maintenance', sub: 'DTC alerts' }],
    },
    protocol: ['Trackers stream health (DTCs/PIDs), location and behaviour events; the platform unifies them for maintenance, dispatch and safety.'],
    topics: [
      { t: 'fleet/telemetry', dir: 'tracker → platform', payload: 'location, PIDs, health, event' },
      { t: 'fleet/event', dir: 'tracker → platform', payload: 'behaviour event (harsh/speeding/idling)' },
      { t: 'fleet/dtc', dir: 'tracker → maintenance', payload: 'new fault code' },
    ],
    cloud: ['A fleet platform unifies health, location and behaviour, driving proactive maintenance (DTCs), dispatch/utilisation (location), and safety/fuel coaching (telematics).'],
    dashboard: ['A fleet map with per-vehicle health/faults, location, live parameters, and driving-event scoring.'],
    mobile: ['DTC/maintenance alerts, harsh-event/speeding alerts, and location.'],
    security: [
      'Authenticate trackers; secure telemetry.',
      'Read-only OBD; never interfere with vehicle systems.',
      'Handle driver-behaviour data fairly, transparently and lawfully.',
    ],
  },

  perf: [
    'Stream at a sensible rate; alert on DTCs and events immediately.',
    'Read supported PIDs; handle unsupported gracefully.',
    'Derive telematics on-device from OBD speed + accelerometer.',
    'Keep OBD read-only and non-interfering.',
  ],
  safety: [
    'Read-only OBD — never write to or interfere with vehicle systems, especially safety-critical buses.',
    'Driver-behaviour data is sensitive personal data — handle it fairly, transparently and lawfully; inform drivers.',
    'Install the tracker without obstructing driving or the OBD port\'s intended use.',
    'OBD parameter support varies by vehicle — degrade gracefully.',
  ],
  maintenance: [
    'Act on DTC/maintenance alerts proactively.',
    'Verify OBD/PID support and telematics thresholds per vehicle type.',
    'Check GPS/cellular coverage.',
    'Review driver-data handling for fairness/compliance.',
  ],
  future: [
    'Add fuel-efficiency and eco-driving scoring.',
    'Add crash detection and emergency alerting.',
    'Integrate maintenance scheduling from DTCs/mileage.',
    'Add usage-based-insurance scoring (lawfully).',
  ],
  faq: [
    { q: 'What does OBD-II give you?', a: 'The vehicle\'s own diagnostic data through a standard port: fault codes (the same a garage reads) and live parameters (RPM, speed, coolant, fuel). It is the built-in health data most fleets throw away.' },
    { q: 'How does it enable proactive maintenance?', a: 'By reading fault codes the moment they appear, so a developing problem is known before it becomes a roadside breakdown — you schedule the repair instead of suffering the failure.' },
    { q: 'What is driving telematics?', a: 'Derived driving-behaviour events — harsh braking/acceleration, hard cornering, speeding, idling — from OBD speed and an accelerometer. They drive fuel economy, safety, wear and insurance outcomes, and support coaching.' },
    { q: 'Can it damage the vehicle?', a: 'No — it is read-only. It reads the OBD data and must never write to or interfere with vehicle systems. Reading, not disrupting.' },
    { q: 'Is tracking drivers legal?', a: 'Driver-behaviour data is sensitive personal data. It must be handled fairly and transparently (drivers informed), used for legitimate fleet purposes, and comply with local law.' },
  ],
  refs: [
    { t: 'OBD-II', u: 'https://en.wikipedia.org/wiki/On-board_diagnostics', s: 'Reference' },
    { t: 'Diagnostic trouble codes (DTCs)', u: 'https://en.wikipedia.org/wiki/OBD-II_PIDs', s: 'Reference' },
    { t: 'Fleet telematics', u: 'https://en.wikipedia.org/wiki/Telematics', s: 'Reference' },
    { t: 'Usage-based insurance', u: 'https://en.wikipedia.org/wiki/Usage-based_insurance', s: 'Reference' },
    { t: 'ELM327 OBD interface', u: 'https://en.wikipedia.org/wiki/ELM327', s: 'Reference' },
  ],
  images: ['car', 'gps', 'esp32'],
  imageCaptions: [
    'An OBD-II tracker unifies vehicle health, location and driving behaviour into actionable fleet data.',
    'ESP32 module reading fault codes and live parameters, GPS location, and deriving telematics.',
    'A fleet platform turns the feed into proactive maintenance, dispatch and safety coaching.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   086 — Driver Drowsiness Alert
   ══════════════════════════════════════════════════════════════════ */
{
  id: '086',
  domainKey: 'ai',
  emoji: '😴', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'Watches a driver\'s eyes and head for the signs of fatigue — prolonged eye closure, nodding, slow blinks — and warns before drowsiness becomes a crash.',

  overview: [
    'Drowsy driving is a leading cause of serious crashes, and its danger is that the driver is the last to know — fatigue impairs the very judgement needed to recognise it, and a microsleep of a few seconds at highway speed covers the length of a football field with no one at the controls. The visible signs of that creeping fatigue, though, are readable on the driver\'s face and head: the eyes start to <b>close for longer</b>, blinks <b>slow</b>, the gaze drifts, and the head begins to <b>nod</b>. This project builds a system that watches for those signs with a camera and warns the driver before drowsiness becomes a crash.',
    'The core is <b>computer vision on the driver\'s face</b>. A camera watches the driver; the system detects the face and eyes and measures the tell-tale signals of fatigue: how open the eyes are (the eye-aspect ratio), how long they stay closed, the blink rate and duration, and the head pose (nodding forward). The single most validated measure is <b>PERCLOS</b> — the proportion of time the eyes are closed over a window — which correlates strongly with drowsiness; combined with prolonged-closure detection (a microsleep) and head-nod detection, it gives a robust read on the driver\'s state. When the signs cross a threshold, the system issues an immediate, attention-grabbing <b>alert</b> (a loud tone, a voice, a seat/vibration) to rouse the driver.',
    'The value is catching fatigue <i>before</i> the driver would — an objective observer that does not itself get tired. It runs on the edge (an ESP32-S3 or a small single-board computer with a camera) so the video and analysis stay in the vehicle for privacy. It is honest about hard limits: it works best with a clear view of the face, is challenged by darkness (needs IR), sunglasses, and awkward angles; it detects <i>signs</i> of drowsiness, not the internal state itself, so it can miss or false-alarm; and it is a <b>warning aid, not a substitute</b> for the real fix — a rested driver who stops and sleeps. But as a fatigue-monitoring alert that reads the eyes and head and warns in time, it addresses one of the deadliest and most under-detected causes of road crashes with exactly the objective vigilance a drowsy driver lacks.',
  ],
  does: [
    'Watches the driver\'s face with a camera',
    'Measures eye openness (eye-aspect ratio) and prolonged closure',
    'Tracks blink rate/duration and head pose (nodding)',
    'Computes PERCLOS (proportion of eye closure), the key drowsiness measure',
    'Warns the driver immediately when fatigue signs cross a threshold',
    'Runs on the edge (video stays in-vehicle) for privacy',
    'Catches fatigue before the impaired driver would',
  ],
  features: [
    'Eye-aspect-ratio and prolonged-closure (microsleep) detection',
    'PERCLOS — the validated drowsiness measure',
    'Head-nod detection',
    'Immediate attention-grabbing alert',
    'Edge/on-device (privacy)',
    'Objective vigilance a tired driver lacks',
    'Honest: warning aid, needs clear view, not a substitute for rest',
  ],
  applications: [
    { t: 'Driver fatigue warning', d: 'Alerting drivers to drowsiness before a crash — cars, trucks, buses.' },
    { t: 'Commercial/long-haul safety', d: 'Fatigue monitoring for professional drivers on long routes.' },
    { t: 'Fleet safety systems', d: 'Drowsiness alerts as part of driver-safety programmes.' },
    { t: 'Research / education', d: 'Studying fatigue detection (PERCLOS, EAR) and alerting.' },
  ],
  skills: [
    'Face/eye detection and landmark tracking',
    'Eye-aspect ratio, PERCLOS, blink and head-pose measures',
    'Edge computer vision (ESP32-S3/Pi)',
    'Alerting and thresholds',
    'Privacy-preserving on-device processing',
  ],
  prereq: [
    'It detects SIGNS of drowsiness (eye closure, nodding), not the internal state — it can miss/false-alarm; it is a warning aid, not a substitute for stopping and resting.',
    'PERCLOS (proportion of eye closure) is the most validated measure; combine with prolonged-closure and head-nod.',
    'It needs a clear view of the face — challenged by darkness (needs IR), sunglasses, angles.',
    'Process on the edge and keep video in-vehicle for privacy.',
  ],

  parts: ['esp32s3', 'esp32cam', 'rpi4', 'buzzer', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Driver-facing camera + IR', spec: 'Camera aimed at the driver with IR for night operation', qty: 1, price: 600, note: 'IR is essential for darkness' },
    { name: 'Compute (ESP32-S3 or Pi)', spec: 'Edge compute for face/eye analysis', qty: 1, price: 0, note: 'Pi affords fuller models; ESP32-S3 a lightweight one' },
    { name: 'Alert (loud + haptic)', spec: 'Loud tone/voice and seat/steering vibration', qty: 1, price: 300, note: 'Must reliably rouse a drowsy driver' },
    { name: 'In-vehicle mount', spec: 'Positioned for a clear, unobtrusive view of the face', qty: 1, price: 200 },
  ],
  cost: '₹3,000 – ₹6,000',
  libs: ['python', 'opencv', 'mediapipe', 'tflmicro', 'numpy'],

  pins: {
    left: [
      { dev: 'Camera + IR', devPin: 'CSI/DVP', pin: '—', sig: 'Driver face' },
    ],
    right: [
      { dev: 'Alert (buzzer/voice)', devPin: 'IN', pin: 'GPIO', sig: 'Warn driver' },
      { dev: 'Haptic', devPin: 'IN', pin: 'GPIO', sig: 'Seat/steering vibration' },
      { dev: 'Storage (opt)', devPin: 'SD', pin: '—', sig: 'Event log (in-vehicle)' },
      { dev: 'Supply', devPin: '12V/5V', pin: '—', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Aim the camera at the driver\'s face with a clear, unobtrusive view; add IR for night operation (darkness needs IR).',
    'Process on the edge (ESP32-S3/Pi) so video and analysis stay in the vehicle — a privacy requirement for a driver-facing camera.',
    'Provide a loud and haptic alert that reliably rouses a drowsy driver.',
    'Handle sunglasses/angles/occlusion gracefully; it detects signs, not the internal state.',
    'This is a warning aid — it does not replace stopping and resting.',
  ],

  block: { columns: [
    { label: 'Watch', edge: 'right', blocks: [
      { name: 'Camera + IR', sub: 'driver face', highlight: true },
    ] },
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'Face/eyes', sub: 'EAR, closure' },
      { name: 'PERCLOS/head', sub: 'drowsiness' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'Edge', sub: 'threshold' },
    ] },
    { label: 'Warn', edge: 'none', blocks: [
      { name: 'Alert', sub: 'loud+haptic', highlight: true },
      { name: 'Before crash', sub: 'in time' },
    ] },
  ] },
  flow: [
    { t: 'Capture driver frame', k: 'start' },
    { t: 'Detect face/eyes', k: 'proc' },
    { t: 'EAR/closure + head pose', k: 'proc' },
    { t: 'Update PERCLOS', k: 'proc' },
    { t: 'Drowsiness signs over threshold?', k: 'dec', yes: 'Alert driver (loud+haptic)', no: 'Continue' },
    { t: 'Alert driver (loud+haptic)', k: 'io' },
    { t: 'Continue', k: 'end', back: 'Capture driver frame' },
  ],

  principle: [
    'Drowsy driving is uniquely dangerous because <b>the driver cannot reliably detect it in themselves</b> — fatigue impairs the judgement needed to notice fatigue, and the failure mode is the microsleep, a brief involuntary lapse of a few seconds during which no one is driving. At highway speed that is a long, unguided distance. So the value of an external monitor is precisely that it is an <b>objective observer that does not get tired</b>: it watches for the signs the driver is missing and warns while there is still time to act.',
    'Those signs are readable on the <b>face and head</b>, which is why computer vision is the right tool. As fatigue sets in, the eyes <b>close for longer</b>, blinks become <b>slower and longer</b>, the gaze drifts, and the head begins to <b>nod</b> forward. The system detects the face and eyes and quantifies these: the <b>eye-aspect ratio</b> (EAR) measures how open the eyes are (it drops toward zero as the eyes close), from which prolonged closure — a likely microsleep — and slow blinks are detected; head-pose estimation catches nodding. The most validated single measure is <b>PERCLOS</b>, the <i>proportion of time the eyes are closed</i> over a rolling window, which correlates strongly with drowsiness because it captures the sustained, creeping eye-closure of fatigue rather than a single blink. Combining PERCLOS with prolonged-closure and head-nod detection gives a robust, multi-signal read on the driver\'s state.',
    'When the signals cross a threshold, the response is an <b>immediate, unmissable alert</b> designed to rouse a drowsy person — a loud tone or voice, ideally reinforced by haptic feedback (a vibrating seat or steering wheel), because a subtle warning may not penetrate the very fatigue it is warning about. Timing is everything: the alert must fire on the <i>early</i> signs (rising PERCLOS, the first prolonged closures) to give the driver time to respond — pull over, take a break — before the fatigue becomes a lapse at the wheel. Catching it before the impaired driver would is the whole point.',
    'The design is honest about its <b>limits and its place</b>, which matters for a safety system. It detects <b>signs</b> of drowsiness, not the internal state itself, so it can both miss real fatigue (a stoic driver) and false-alarm (someone squinting in sun), and it depends on a <b>clear view</b> of the face — darkness requires <b>IR</b> illumination, and sunglasses, awkward angles and occlusion degrade it. It runs on the <b>edge</b> (an ESP32-S3 or a small SBC with the camera) so the driver-facing video and its analysis stay <b>in the vehicle</b>, a real privacy requirement for a camera pointed at a person. And above all, it is a <b>warning aid, not a cure</b>: the only real remedy for drowsiness is to stop and rest, and the system exists to prompt exactly that, not to license driving tired. Within those honest bounds, it does something genuinely valuable against one of the deadliest, most under-detected crash causes — it provides the objective, tireless vigilance a fatigued driver has lost, and warns them in time.',
  ],
  equations: [
    { t: 'Eye-aspect ratio (EAR)', eq: 'From eye landmarks (vertical vs horizontal distances):\n\n  EAR = (‖p2−p6‖ + ‖p3−p5‖) / (2·‖p1−p4‖)\n\nHigh when open, drops toward 0 as the eye closes.\nProlonged EAR < threshold ⇒ eyes closed (microsleep).' },
    { t: 'PERCLOS (drowsiness measure)', eq: 'Proportion of time eyes are closed over a window T:\n\n  PERCLOS = (time eyes closed) / T\n\nStrongly correlated with drowsiness. Alert when PERCLOS\nexceeds a threshold (rising with fatigue).' },
    { t: 'Multi-signal drowsiness + timing', eq: 'drowsy if:\n  PERCLOS > P_thresh\n  OR prolonged closure > t_micro (microsleep)\n  OR sustained head-nod\n\nAlert on EARLY signs → time to pull over. Loud + haptic to\nrouse. It is a WARNING AID, not a substitute for rest.' },
  ],

  assembly: [
    { h: 'Set up the driver-facing camera + IR', p: [
      'Aim a camera at the driver\'s face with a clear, unobtrusive view and IR for night. Process on the edge (ESP32-S3/Pi) so video stays in the vehicle.',
    ], warn: 'A driver-facing camera is sensitive. Process on the edge and keep video in-vehicle for privacy. And this is a warning aid — it never replaces stopping and resting.' },
    { h: 'Detect eyes and measure fatigue signals', p: [
      'Detect face/eyes, compute EAR and prolonged closure, blink rate, head pose, and PERCLOS over a rolling window.',
    ] },
    { h: 'Alert in time', p: [
      'Warn immediately with a loud and haptic alert when the multi-signal drowsiness threshold is crossed, on early signs.',
    ] },
  ],
  steps: [
    { h: 'Compute EAR and PERCLOS and decide', p: [
      'Measure eye-aspect ratio per frame, track closed frames for PERCLOS and prolonged closure, add head-nod, and alert when drowsiness signs cross the threshold.',
    ], code: {
      file: 'drowsiness.py', lang: 'python',
      body: `import numpy as np

def ear(eye):                              # eye landmarks p1..p6
    v = np.linalg.norm(eye[1]-eye[5]) + np.linalg.norm(eye[2]-eye[4])
    h = 2.0*np.linalg.norm(eye[0]-eye[3])
    return v/h                             # high=open, low=closed

class Drowsiness:
    def __init__(self, ear_thresh=0.20, window=1800):  # ~60s at 30fps
        self.ear_thresh, self.window = ear_thresh, window
        self.closed = []                    # rolling closed/open flags
        self.closed_run = 0                 # consecutive closed frames

    def update(self, ear_val, head_nod):
        closed = ear_val < self.ear_thresh
        self.closed.append(closed)
        if len(self.closed) > self.window: self.closed.pop(0)
        self.closed_run = self.closed_run+1 if closed else 0

        perclos = sum(self.closed)/len(self.closed)     # proportion closed
        microsleep = self.closed_run > 45               # ~1.5s eyes closed
        return {"perclos": perclos, "microsleep": microsleep, "nod": head_nod,
                "drowsy": perclos > 0.15 or microsleep or head_nod}`,
      explain: [
        { ref: 'def ear(eye):', txt: 'The eye-aspect ratio drops as the eye closes, giving a per-frame measure of eye openness from face landmarks.' },
        { ref: 'perclos = sum(self.closed)/len(self.closed)', txt: 'PERCLOS — the proportion of recent frames with eyes closed — is the most validated drowsiness measure, capturing sustained fatigue rather than a single blink.' },
        { ref: 'microsleep = self.closed_run > 45', txt: 'A run of consecutive closed frames flags a prolonged closure — a likely microsleep, the acute danger.' },
        { ref: '"drowsy": perclos > 0.15 or microsleep or head_nod', txt: 'The decision fuses PERCLOS, microsleep and head-nod, so drowsiness is caught from multiple signs on the early side.' },
      ],
    } },
    { h: 'Warn and keep it private', p: [
      'On a drowsy verdict, fire a loud + haptic alert immediately; keep all video and analysis on-device, and remind that the real fix is to stop and rest.',
    ], tip: 'Alert on the early rise of PERCLOS and the first prolonged closures — waiting for obvious nodding may be too late.' },
  ],

  code: [{
    file: 'driver_drowsiness_alert.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Driver Drowsiness Alert — edge (Pi/ESP32-S3) computer vision

Watches the driver's face; measures eye-aspect ratio, PERCLOS, prolonged
closure (microsleep) and head-nod; warns (loud+haptic) on early signs.
Edge/on-device (video stays in-vehicle). A WARNING AID, not a substitute
for stopping and resting.
"""
import cv2, numpy as np
from face import detect_face_landmarks   # face/eye landmark detector
from alert import warn_driver            # loud + haptic

EAR_THRESH = 0.20
class Monitor:
    def __init__(self, fps=30, window_s=60):
        self.window = fps*window_s; self.closed=[]; self.run=0

    def ear(self, eye):
        v = np.linalg.norm(eye[1]-eye[5]) + np.linalg.norm(eye[2]-eye[4])
        return v/(2.0*np.linalg.norm(eye[0]-eye[3]))

    def step(self, frame):
        lm = detect_face_landmarks(frame)      # on-device; video stays local
        if lm is None: return None             # no clear face view
        left, right, nod = lm.left_eye, lm.right_eye, lm.head_nod
        e = (self.ear(left) + self.ear(right)) / 2.0
        closed = e < EAR_THRESH
        self.closed.append(closed)
        if len(self.closed) > self.window: self.closed.pop(0)
        self.run = self.run+1 if closed else 0

        perclos = sum(self.closed)/len(self.closed)
        microsleep = self.run > 45              # ~1.5s closed
        drowsy = perclos > 0.15 or microsleep or nod
        return {"ear": e, "perclos": perclos, "microsleep": microsleep,
                "nod": nod, "drowsy": drowsy}

def main():
    cap = cv2.VideoCapture(0)                   # IR camera for night
    mon = Monitor()
    while True:
        ok, frame = cap.read()
        if not ok: continue
        r = mon.step(frame)
        if r and r["drowsy"]:
            warn_driver(loud=True, haptic=True)  # rouse the driver, in time
        # NOTE: video never leaves the device (privacy)

if __name__ == "__main__":
    main()`,
    explain: [
      { ref: 'lm = detect_face_landmarks(frame)      # on-device; video stays local', txt: 'Face/eye detection runs on the edge, so the driver-facing video and its analysis never leave the vehicle — a privacy requirement.' },
      { ref: 'if lm is None: return None             # no clear face view', txt: 'With no clear view of the face (darkness, sunglasses, angle) the system does not fabricate a result — it detects signs and degrades honestly.' },
      { ref: 'perclos = sum(self.closed)/len(self.closed)', txt: 'PERCLOS over the rolling window is the primary drowsiness measure driving the decision.' },
      { ref: 'if r and r["drowsy"]:\n            warn_driver(loud=True, haptic=True)', txt: 'A drowsy verdict triggers an immediate loud and haptic alert designed to rouse a fatigued driver in time.' },
      { ref: '# NOTE: video never leaves the device (privacy)', txt: 'The privacy property is explicit: the camera feed stays on-device, only the alert acts.' },
    ],
  }],

  config: [
    'Configure the camera/IR and edge compute; set EAR and PERCLOS thresholds and the window.',
    'Set microsleep/head-nod thresholds and the alert (loud+haptic) behaviour.',
    'Keep processing on-device (video in-vehicle) for privacy.',
    'Handle no-clear-view cases gracefully.',
  ],
  ai: {
    dataset: [
      'The system uses face/eye landmark detection (to compute EAR and head pose) and thresholds/PERCLOS; a learned drowsiness classifier can be trained on labelled drowsy/alert driver imagery for a more robust verdict.',
      'Datasets of driver faces with drowsiness labels (and night-IR imagery) help tune thresholds and train models to real conditions.',
    ],
    datasetTable: [
      { n: 'Driver drowsiness datasets (e.g. NTHU-DDD)', size: 'Many subjects', lic: 'Research (check terms)', use: 'Train/validate drowsiness detection' },
      { n: 'Face-landmark datasets', size: 'Large', lic: 'Varies', use: 'Eye/head landmark models' },
      { n: 'Your-vehicle set (night/IR)', size: 'Hundreds+', lic: 'In-vehicle', use: 'Adapt to camera/lighting' },
    ],
    preprocess: [
      'Detect the face and eye/facial landmarks; compute EAR and head pose per frame.',
      'Handle IR imagery for night; reject frames with no clear face view.',
      'Aggregate EAR into PERCLOS over a rolling window.',
    ],
    pipeline: [
      { name: 'Camera (IR)', sub: 'driver face', highlight: true },
      { name: 'Face/landmarks', sub: 'eyes/head' },
      { name: 'EAR/head pose', sub: 'per frame' },
      { name: 'PERCLOS/microsleep', sub: 'window' },
      { name: 'Drowsy decision', sub: 'threshold/model', highlight: true },
    ],
    arch: [
      'A landmark model (e.g. a lightweight face-mesh) yields eye/head geometry, feeding EAR/PERCLOS thresholds. Optionally a small classifier (CNN or on the temporal signals) predicts drowsiness for robustness.',
      'On a Pi, fuller models are feasible; on ESP32-S3, a tiny landmark/eye-state model gated to real time.',
    ],
    archTable: [
      { l: 'Face/landmarks', s: 'lightweight face mesh', p: 'Eye/head geometry' },
      { l: 'EAR/PERCLOS', s: 'geometric + window', p: 'Validated drowsiness measures' },
      { l: 'Classifier (opt)', s: 'small CNN/temporal', p: 'Robust drowsy/alert verdict' },
      { l: 'Runtime', s: 'edge (Pi/ESP32-S3)', p: 'Real-time, video stays local' },
    ],
    hyper: [
      { k: 'EAR threshold', v: '~0.20', w: 'Eye-closed cutoff; tune per subject/camera' },
      { k: 'PERCLOS threshold', v: '~0.15', w: 'Drowsiness alert level' },
      { k: 'microsleep frames', v: '~1.5 s', w: 'Prolonged-closure alarm' },
      { k: 'window', v: '~60 s', w: 'PERCLOS averaging window' },
    ],
    training: [
      'Tune EAR/PERCLOS thresholds on labelled data and per driver/camera; optionally train a classifier on drowsy/alert sequences.',
      'Include night-IR, glasses and angle variation so the system is robust to real conditions.',
      'Validate on held-out drivers; weigh missed-drowsiness (dangerous) heavily.',
    ],
    metricsIntro: [
      'The decisive trade-off is catching real drowsiness (few misses) without excessive false alarms that get the system ignored.',
    ],
    metrics: [
      { m: 'Drowsiness detection rate', v: 'high (target)', d: 'Catch real fatigue early' },
      { m: 'False-alarm rate', v: 'low (target)', d: 'Or drivers ignore it' },
      { m: 'PERCLOS correlation', v: 'strong', d: 'Validated drowsiness measure' },
      { m: 'Latency', v: 'real-time', d: 'Alert in time to act' },
    ],
    chart: {
      title: 'Detection by condition (illustrative)',
      desc: 'Clear-face detection is strong; darkness/glasses/angle challenge it.',
      unit: '%',
      bars: [
        { label: 'Clear face, day', value: 92 },
        { label: 'Night + IR', value: 82 },
        { label: 'Sunglasses/angle', value: 55 },
      ],
    },
    deploy: [
      'Run on the edge (Pi/ESP32-S3) with the camera; keep video and analysis in-vehicle.',
      'Alert loud + haptic on early signs; degrade honestly when the face view is poor.',
      'Present as a warning aid; never a substitute for rest.',
    ],
    inference: {
      file: 'infer.py', lang: 'python',
      body: `def is_drowsy(frame, monitor):
    r = monitor.step(frame)            # EAR/PERCLOS/microsleep/nod (edge)
    if r is None:                      # no clear face view
        return False
    return r["drowsy"]                 # loud+haptic alert if True`,
    },
    limits: [
      'Detects signs of drowsiness, not the internal state — it can miss real fatigue or false-alarm.',
      'Needs a clear face view: darkness (needs IR), sunglasses, angles and occlusion degrade it.',
      'A warning aid, not a substitute for stopping and resting — the only real fix for drowsiness.',
    ],
  },
  calibration: [
    { h: 'EAR/PERCLOS', p: [
      'Tune the EAR threshold per driver/camera and the PERCLOS/microsleep thresholds so real drowsiness is caught early without excessive false alarms.',
    ] },
    { h: 'Night/IR', p: [
      'Verify detection under IR at night and handle glasses/angles; reject no-clear-view frames.',
    ] },
    { h: 'Alert', p: [
      'Confirm the loud + haptic alert reliably rouses and is timely.',
    ] },
  ],
  testing: [
    { step: 'Close eyes for >1.5 s', expect: 'Microsleep detected; alert' },
    { step: 'Simulate rising PERCLOS (frequent closures)', expect: 'Drowsy verdict; alert on early signs' },
    { step: 'Nod the head', expect: 'Head-nod contributes to drowsy verdict' },
    { step: 'Night with IR', expect: 'Detection works; without IR it degrades' },
    { step: 'Sunglasses/angle', expect: 'Degrades honestly (no clear view) rather than fabricating' },
    { step: 'Confirm privacy', expect: 'Video stays on-device; only the alert acts' },
  ],
  output: [
    'In-vehicle: an immediate loud + haptic alert on drowsiness; optionally an in-vehicle log of PERCLOS/events (no video leaves the device).',
    { file: 'drowsy-event.json', lang: 'json', body: `{
  "ear": 0.12,
  "perclos": 0.22,
  "microsleep": true,
  "nod": false,
  "drowsy": true
}` },
    'Low EAR (0.12), high PERCLOS (0.22) and a microsleep → a drowsy verdict and an immediate alert to rouse the driver in time; all computed on-device, with the video never leaving the vehicle.',
  ],
  troubleshoot: [
    { sym: 'Misses drowsiness', cause: 'Thresholds too lax / poor view', fix: 'Tune EAR/PERCLOS; ensure a clear face view and IR at night; weigh misses heavily' },
    { sym: 'Too many false alarms', cause: 'Thresholds too strict / squinting', fix: 'Tune thresholds; use PERCLOS window; add head-nod for corroboration' },
    { sym: 'Fails at night', cause: 'No IR', fix: 'Add IR illumination; validate under IR' },
    { sym: 'Glasses/angle break it', cause: 'No clear view', fix: 'Position camera well; degrade honestly (no fabricated result)' },
    { sym: 'Privacy concern', cause: 'Video leaving device', fix: 'Process on the edge; keep video in-vehicle; only the alert acts' },
  ],
  perf: [
    'Run detection in real time on the edge; keep video local.',
    'Use PERCLOS over a window plus microsleep/head-nod for a robust, early verdict.',
    'Alert immediately (loud+haptic) on early signs.',
    'Degrade honestly when the face view is poor.',
  ],
  safety: [
    'This detects SIGNS of drowsiness, not the internal state — it can miss or false-alarm, and it is a WARNING AID, not a substitute for stopping and resting.',
    'The only real fix for drowsiness is to stop and sleep — the alert exists to prompt that.',
    'Keep the driver-facing video on-device (privacy); do not use it for other surveillance.',
    'Position the camera without obstructing driving; do not rely on it to drive tired.',
  ],
  maintenance: [
    'Re-tune thresholds per driver/camera and validate night/IR.',
    'Verify the alert rouses reliably.',
    'Keep processing on-device; confirm privacy.',
    'Improve models with in-vehicle-condition data (kept local).',
  ],
  future: [
    'Add gaze/attention (distraction) detection.',
    'Add a trained temporal drowsiness model for robustness.',
    'Integrate with vehicle systems (lane, speed) for corroboration.',
    'Add fatigue trend/rest-break recommendations.',
  ],
  faq: [
    { q: 'Why can\'t drivers just notice they\'re drowsy?', a: 'Because fatigue impairs the judgement needed to notice fatigue, and it fails via microsleeps — brief involuntary lapses. An external monitor that does not get tired watches for the signs the driver is missing and warns in time.' },
    { q: 'What is PERCLOS?', a: 'The proportion of time the eyes are closed over a window — the most validated drowsiness measure, because it captures the sustained, creeping eye-closure of fatigue rather than a single blink.' },
    { q: 'Does it work at night or with sunglasses?', a: 'It needs a clear view of the face. Darkness requires IR illumination; sunglasses, awkward angles and occlusion degrade it. It detects signs, not the internal state, so it degrades honestly rather than fabricating a result.' },
    { q: 'Is it a substitute for resting?', a: 'No — emphatically. It is a warning aid whose purpose is to prompt the only real fix: stop and sleep. It must never be used to license driving tired.' },
    { q: 'Where does the video go?', a: 'Nowhere — it is processed on the edge and stays in the vehicle. Only the alert acts. Keeping a driver-facing camera\'s video local is a privacy requirement.' },
  ],
  refs: [
    { t: 'Drowsy driving', u: 'https://en.wikipedia.org/wiki/Sleep-deprived_driving', s: 'Reference' },
    { t: 'PERCLOS drowsiness measure', u: 'https://en.wikipedia.org/wiki/PERCLOS', s: 'Reference' },
    { t: 'Eye-aspect ratio / blink detection', u: 'https://en.wikipedia.org/wiki/Blinking', s: 'Reference' },
    { t: 'Driver monitoring systems', u: 'https://en.wikipedia.org/wiki/Driver_drowsiness_detection', s: 'Reference' },
    { t: 'Facial landmark detection', u: 'https://en.wikipedia.org/wiki/Facial_recognition_system', s: 'Reference' },
  ],
  images: ['car', 'health', 'esp32'],
  imageCaptions: [
    'A camera watches the driver for the eye and head signs of fatigue the driver cannot detect in themselves.',
    'Edge computer vision measures eye-aspect ratio, PERCLOS and head-nod on-device (video stays in-vehicle).',
    'A loud, haptic alert rouses the driver in time — a warning aid, never a substitute for stopping and resting.',
  ],
},

];
