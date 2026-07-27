/* Industrial batch C — 063 Digital Twin Gateway, 064 Remote Tank Level
   Telemetry, 065 OEE Productivity Tracker. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   063 — Digital Twin Gateway
   ══════════════════════════════════════════════════════════════════ */
{
  id: '063',
  domainKey: 'iot',
  emoji: '🔗', thumb: 'board',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'Bridges the messy, multi-protocol reality of plant-floor sensors into one clean, timestamped, real-time stream that a digital twin can actually consume.',

  overview: [
    'A "digital twin" — a live virtual model of a physical plant — is only as good as the data feeding it, and on a real factory floor that data is a mess: a dozen protocols (Modbus RTU on RS-485, Modbus TCP, OPC-UA, proprietary PLC registers, a few MQTT sensors, some 4-20 mA analogue), inconsistent units and scaling, no common timestamps, and equipment that predates the internet. The twin, meanwhile, wants one thing: a clean, unified, timestamped stream of tags it can consume in real time. The <b>gateway</b> is the piece that bridges those two worlds — it speaks every dialect the plant floor speaks, normalises the readings, timestamps them consistently, and publishes them upward in the single format the twin understands. It is unglamorous plumbing, and it is the difference between a digital twin that works and a slideshow.',
    'The gateway\'s job is protocol translation and data conditioning done reliably. It <b>polls or subscribes</b> to each source in that source\'s own protocol (reading Modbus registers, browsing OPC-UA nodes, subscribing to MQTT topics), <b>maps</b> each raw value to a meaningful tag with correct engineering units and scaling (a raw register 0-27648 becomes 0-100% or 0-10 bar), attaches a <b>consistent timestamp</b> (disciplined to a common clock so data from different machines can be correlated), and <b>republishes</b> the unified tags to the twin/historian over one modern protocol (typically MQTT, often MQTT Sparkplug B for industrial context). It buffers locally so a network hiccup does not lose data, and it reports its own health so a dead source is visible.',
    'The design emphasises the things that make industrial data trustworthy: <b>store-and-forward buffering</b> (data survives connectivity loss and back-fills in order), <b>consistent time</b> (the single hardest and most valuable property — data is useless for a twin if you cannot line up events across machines), a <b>clean tag model</b> (self-describing names, units, quality flags), and <b>edge normalisation</b> so the twin receives ready-to-use values rather than raw registers. It is honest that it complements, not replaces, plant SCADA and that industrial protocols carry real safety/operational weight (it should read/observe, not blindly write to control systems without rigorous safeguards). But as the translation-and-conditioning layer between a heterogeneous plant floor and a real-time digital twin, the gateway does the essential, underappreciated work that turns scattered sensor readings into a coherent live model.',
  ],
  does: [
    'Connects to plant sources in their own protocols (Modbus RTU/TCP, OPC-UA, MQTT, analogue)',
    'Maps raw values to meaningful tags with correct units and scaling',
    'Applies consistent, clock-disciplined timestamps for cross-machine correlation',
    'Republishes a unified tag stream to the twin/historian (e.g. MQTT Sparkplug)',
    'Buffers locally (store-and-forward) so connectivity loss loses no data',
    'Reports source and gateway health so a dead feed is visible',
    'Normalises at the edge so the twin gets ready-to-use values',
  ],
  features: [
    'Multi-protocol ingestion (the plant-floor reality)',
    'Edge normalisation: units, scaling, quality flags',
    'Consistent timestamps — the key to a usable twin',
    'Store-and-forward buffering for reliable delivery',
    'Clean, self-describing tag model',
    'Health/heartbeat of sources and gateway',
    'Read-first, safety-aware integration with control systems',
  ],
  applications: [
    { t: 'Digital-twin / historian ingestion', d: 'Feeding a real-time twin or time-series historian from heterogeneous plant sensors and PLCs.' },
    { t: 'Legacy-plant modernisation', d: 'Bringing old Modbus/analogue equipment into a modern MQTT/cloud data platform.' },
    { t: 'Cross-line data unification', d: 'Correlating data across machines/lines with consistent tags and timestamps.' },
    { t: 'Analytics / ML data pipeline', d: 'Providing clean, labelled, timestamped plant data for analytics and models.' },
  ],
  skills: [
    'Industrial protocols (Modbus RTU/TCP, OPC-UA, MQTT)',
    'Tag mapping, unit scaling and quality flags',
    'Time discipline and consistent timestamping',
    'Store-and-forward buffering and reliable publishing',
    'Safe, read-first integration with control systems',
  ],
  prereq: [
    'Consistent timestamps are the single most valuable property — without them, cross-machine data cannot be correlated and the twin is useless.',
    'Normalise at the edge (units/scaling/quality) so the twin gets meaningful values, not raw registers.',
    'Read/observe by default; writing to control systems carries real safety weight and needs rigorous safeguards.',
    'Buffer locally so a network hiccup does not create gaps in the twin\'s data.',
  ],

  parts: ['rpi4', 'esp32', 'rs485', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Protocol interfaces', spec: 'RS-485 for Modbus RTU; Ethernet for Modbus TCP/OPC-UA/MQTT', qty: 1, price: 600, note: 'Match to your plant sources' },
    { name: 'Analogue input module (if needed)', spec: '4-20 mA / 0-10 V inputs for legacy analogue sensors', qty: 1, price: 800 },
    { name: 'Reliable time source', spec: 'NTP/PTP or a GPS/RTC for consistent timestamps', qty: 1, price: 300, note: 'Time discipline is critical' },
    { name: 'Industrial gateway host + DIN enclosure', spec: 'Rugged host (Pi/industrial PC) and DIN-rail enclosure', qty: 1, price: 3000 },
  ],
  cost: '₹6,000 – ₹10,000',
  libs: ['python', 'modbus', 'paho', 'influx', 'fastapi', 'sqlite', 'onnx'],

  pins: {
    left: [
      { dev: 'RS-485 (Modbus RTU)', devPin: 'A/B', pin: 'UART', sig: 'Serial field bus' },
      { dev: 'Ethernet', devPin: 'RJ45', pin: '—', sig: 'Modbus TCP/OPC-UA/MQTT' },
      { dev: 'Analogue in', devPin: '4-20mA', pin: 'ADC/module', sig: 'Legacy analogue' },
    ],
    right: [
      { dev: 'Uplink', devPin: 'Eth/Wi-Fi', pin: '—', sig: 'MQTT to twin/historian' },
      { dev: 'Time source', devPin: 'NTP/GPS', pin: '—', sig: 'Consistent timestamps' },
      { dev: 'Storage', devPin: 'SD/SSD', pin: '—', sig: 'Store-and-forward buffer' },
      { dev: 'Status', devPin: 'LED', pin: 'GPIO', sig: 'Health indicator' },
    ],
  },
  wiringNotes: [
    'Terminate and bias the RS-485 bus correctly for reliable Modbus RTU; keep it separate from noisy power wiring.',
    'Give the gateway a reliable time source (NTP/PTP, or a GPS/RTC) — consistent timestamps are the whole point.',
    'Read from control systems by default; if any write path exists, isolate and safeguard it rigorously.',
    'Provide local storage for the store-and-forward buffer so an uplink outage loses no data.',
    'Use an industrial-grade host and enclosure suited to the plant environment.',
  ],

  block: { columns: [
    { label: 'Plant floor', edge: 'right', blocks: [
      { name: 'Modbus RTU/TCP', sub: 'PLCs/meters', highlight: true },
      { name: 'OPC-UA / MQTT', sub: 'newer devices' },
      { name: 'Analogue', sub: '4-20 mA' },
    ] },
    { label: 'Gateway', edge: 'right', blocks: [
      { name: 'Ingest', sub: 'poll/subscribe' },
      { name: 'Normalise', sub: 'units + tag + time' },
      { name: 'Buffer', sub: 'store-and-forward' },
    ] },
    { label: 'Publish', edge: 'right', blocks: [
      { name: 'MQTT (Sparkplug)', sub: 'unified stream' },
    ] },
    { label: 'Twin', edge: 'none', blocks: [
      { name: 'Digital twin', sub: 'real-time model' },
      { name: 'Historian', sub: 'time series' },
    ] },
  ] },
  flow: [
    { t: 'Poll/subscribe each source', k: 'start' },
    { t: 'Map raw → tag (units/scale)', k: 'proc' },
    { t: 'Attach consistent timestamp + quality', k: 'proc' },
    { t: 'Uplink available?', k: 'dec', yes: 'Publish unified tags', no: 'Buffer (store-and-forward)' },
    { t: 'Publish unified tags', k: 'io' },
    { t: 'Buffer (store-and-forward)', k: 'io' },
    { t: 'Back-fill on reconnect; heartbeat health', k: 'end', back: 'Poll/subscribe each source' },
  ],

  principle: [
    'A digital twin is a live model, and a model is only as trustworthy as its inputs — so the gateway\'s entire purpose is to convert the <b>heterogeneous, raw reality</b> of the plant floor into the <b>clean, unified, timestamped stream</b> a twin can consume. The plant floor is genuinely messy: equipment spans decades and vendors, speaks incompatible protocols (Modbus RTU over RS-485, Modbus TCP, OPC-UA, proprietary registers, bare analogue), scales values in device-specific ways, and keeps no common notion of time. The twin wants none of that complexity; it wants tags with meaning, units, quality and a timeline. Bridging that gap is a translation-and-conditioning problem, and doing it reliably is the whole job.',
    'The first half is <b>protocol translation</b>: speaking each source\'s language to get its data. That means polling Modbus registers over RS-485 or TCP, browsing and subscribing to OPC-UA nodes, subscribing to MQTT topics, reading analogue inputs — each with its own addressing, timing and quirks. The gateway abstracts these behind a common internal representation so that, from that point on, a value from a 1990s PLC and a value from a modern OPC-UA server look the same to the rest of the pipeline. This is the plumbing that lets a twin ingest a whole diverse plant without knowing or caring how each device talks.',
    'The second half — and the part that actually determines whether the twin is usable — is <b>data conditioning</b>, of which <b>consistent time</b> is the crown jewel. A twin exists to correlate: to see that when machine A\'s pressure spiked, machine B\'s temperature rose two seconds later. That correlation is impossible unless every reading carries a timestamp on a <i>common, disciplined clock</i>; data timestamped by each device\'s own drifting clock, or only at arrival, cannot be lined up, and the twin\'s core value evaporates. So the gateway disciplines its clock (NTP/PTP, or GPS/RTC) and stamps every reading consistently. Alongside time, it applies <b>edge normalisation</b> — mapping each raw value to a self-describing tag with correct engineering units and scaling, and a <b>quality flag</b> (good / stale / bad) so downstream consumers know whether to trust it. The twin then receives "Line3.Motor2.WindingTemp = 78.4 °C, good, at 12:00:03.120" instead of "register 40012 = 27412".',
    'Two more properties make the gateway <b>industrial-grade</b> rather than a script. <b>Store-and-forward buffering</b> means a network outage — common on a plant floor — does not create holes: readings are persisted locally and back-filled, in order, when the uplink returns, so the twin\'s history stays complete. And <b>health reporting</b> (heartbeats, per-source status) makes silent failures visible — a dead sensor or a disconnected PLC becomes a flagged condition, not a quietly frozen tag the twin keeps trusting. Finally, the design is <b>safety-honest</b>: industrial control systems carry real operational and safety weight, so the gateway reads and observes by default, and any write path back to control is isolated and rigorously safeguarded, never a casual feature. Positioned this way — a reliable, time-disciplined, normalising, buffering translator that reads the plant and publishes a clean unified stream — the gateway is the unspectacular but essential foundation on which any real digital twin stands.',
  ],
  equations: [
    { t: 'Tag mapping (raw → engineering units)', eq: 'Each source value is scaled to real units:\n\n  value_eng = raw · scale + offset      (linear)\n  e.g. reg 0–27648 → 0–100%:  pct = reg/27648·100\n       4–20 mA → 0–10 bar:     bar = (mA−4)/16·10\n\nStore the mapping (tag, unit, scale, offset) per point.' },
    { t: 'Consistent timestamp + quality', eq: 'Every reading: { tag, value_eng, unit, t_common, quality }\n\n  t_common from a disciplined clock (NTP/PTP/GPS)\n  quality = GOOD | STALE (age > max) | BAD (comm fail)\n\nCross-machine correlation REQUIRES a shared clock —\nwithout it the twin cannot align events.' },
    { t: 'Store-and-forward completeness', eq: 'On uplink loss, persist readings locally:\n\n  buffer.append(reading)   while offline\n  on reconnect: publish buffer in timestamp order, then live\n\nGuarantees the twin\'s history has no gaps despite outages.' },
  ],

  assembly: [
    { h: 'Connect the plant sources', p: [
      'Wire and configure each source in its protocol — RS-485 (terminated/biased) for Modbus RTU, Ethernet for Modbus TCP/OPC-UA/MQTT, analogue module for 4-20 mA — and confirm you can read each reliably.',
    ], warn: 'Read/observe by default. Do not enable any write-back to control systems without rigorous, reviewed safeguards — plant control carries safety weight.' },
    { h: 'Set up time and normalisation', p: [
      'Discipline the gateway clock (NTP/PTP or GPS/RTC), and define the tag map (name, unit, scale, offset, quality rules) for every point.',
    ] },
    { h: 'Set up publishing and buffering', p: [
      'Publish the unified tags to the twin/historian over MQTT (Sparkplug B where appropriate), with local store-and-forward buffering and health heartbeats.',
    ] },
  ],
  steps: [
    { h: 'Normalise a reading into a unified tag', p: [
      'For each source value, apply its scale/offset, attach the common timestamp and a quality flag, and emit a self-describing tag.',
    ], code: {
      file: 'normalise.py', lang: 'python',
      body: `import time

class TagMap:
    def __init__(self, name, unit, scale, offset, max_age):
        self.name, self.unit = name, unit
        self.scale, self.offset, self.max_age = scale, offset, max_age

def normalise(raw, tm, read_ok, now):
    quality = "GOOD"
    if not read_ok:
        return {"tag": tm.name, "quality": "BAD"}     # comm failure
    value = raw * tm.scale + tm.offset                # → engineering units
    return {
        "tag": tm.name,
        "value": round(value, 3),
        "unit": tm.unit,
        "t": now,                                     # common disciplined clock
        "quality": quality,
    }

def poll_source(source, tagmaps, clock):
    now = clock.now()                                 # disciplined timestamp
    out = []
    for point in source.points:
        raw, ok = source.read(point)                  # protocol-specific read
        out.append(normalise(raw, tagmaps[point], ok, now))
    return out`,
      explain: [
        { ref: 'if not read_ok:\n        return {"tag": tm.name, "quality": "BAD"}', txt: 'A failed read produces a tag with BAD quality rather than a stale or fabricated value, so the twin knows not to trust it.' },
        { ref: 'value = raw * tm.scale + tm.offset', txt: 'The raw device value is scaled to real engineering units per the tag map, so the twin receives a meaningful number, not a register count.' },
        { ref: '"t": now,                                     # common disciplined clock', txt: 'Every reading is stamped from one disciplined clock, the property that lets the twin correlate events across different machines.' },
        { ref: 'now = clock.now()                                 # disciplined timestamp', txt: 'All points polled in a cycle share the cycle\'s timestamp, keeping their relationship consistent.' },
      ],
    } },
    { h: 'Publish with buffering and health', p: [
      'Publish unified tags to the twin, buffering to local storage during uplink loss and back-filling in order on reconnect, and heartbeat gateway/source health.',
    ], tip: 'Emit quality flags and heartbeats prominently — a twin that keeps trusting a frozen tag is worse than one that knows the feed is dead.' },
  ],

  code: [{
    file: 'digital_twin_gateway.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Digital Twin Gateway — Raspberry Pi / industrial host

Ingests heterogeneous plant sources (Modbus, OPC-UA, MQTT, analogue),
normalises to unified tags with consistent timestamps and quality,
publishes to the twin/historian over MQTT, with store-and-forward
buffering and health heartbeats. Read-first, safety-aware.
"""
import time, json, sqlite3
import paho.mqtt.client as mqtt
from sources import ModbusSource, OpcUaSource, MqttSource   # protocol adapters

class Clock:
    def now(self): return time.time()      # NTP/PTP-disciplined system clock

class Buffer:
    def __init__(self, path): self.db = sqlite3.connect(path)
    def append(self, rec): self.db.execute(
        "INSERT INTO buf(t,payload) VALUES(?,?)", (rec["t"], json.dumps(rec)))
    def drain(self):                        # oldest-first for ordered backfill
        for row in self.db.execute("SELECT payload FROM buf ORDER BY t"):
            yield json.loads(row[0])
    def clear(self, upto_t): self.db.execute("DELETE FROM buf WHERE t<=?", (upto_t,))

def normalise(raw, tm, ok, now):
    if not ok: return {"tag": tm.name, "quality": "BAD", "t": now}
    return {"tag": tm.name, "value": round(raw*tm.scale+tm.offset, 3),
            "unit": tm.unit, "t": now, "quality": "GOOD"}

class Gateway:
    def __init__(self, sources, mqtt_client, buffer, clock):
        self.sources, self.mqtt = sources, mqtt_client
        self.buf, self.clock = buffer, clock
        self.online = False

    def publish(self, rec):
        if self.online:
            self.mqtt.publish(f"twin/{rec['tag']}", json.dumps(rec), qos=1)
        else:
            self.buf.append(rec)            # store-and-forward

    def backfill(self):                     # on reconnect, ordered replay
        for rec in self.buf.drain():
            self.mqtt.publish(f"twin/{rec['tag']}", json.dumps(rec), qos=1)
        self.buf.clear(self.clock.now())

    def run(self):
        while True:
            now = self.clock.now()          # one disciplined timestamp per cycle
            for src in self.sources:
                for point, tm in src.points():
                    raw, ok = src.read(point)          # read-only
                    self.publish(normalise(raw, tm, ok, now))
            self.mqtt.publish("twin/_gateway/heartbeat",
                              json.dumps({"t": now, "sources": len(self.sources)}))
            time.sleep(1.0)                 # 1 Hz scan (tune per plant)

def on_connect(gw):
    gw.online = True; gw.backfill()         # replay buffered data in order

if __name__ == "__main__":
    clock = Clock()
    sources = [ModbusSource(...), OpcUaSource(...), MqttSource(...)]
    client = mqtt.Client()
    buf = Buffer("/var/gw/buffer.db")
    gw = Gateway(sources, client, buf, clock)
    client.on_connect = lambda *a: on_connect(gw)
    client.on_disconnect = lambda *a: setattr(gw, "online", False)
    client.connect(TWIN_BROKER); client.loop_start()
    gw.run()`,
    explain: [
      { ref: 'raw, ok = src.read(point)          # read-only', txt: 'The gateway reads from every source; by default it never writes to control systems, keeping the plant\'s safety-critical behaviour untouched.' },
      { ref: 'def publish(self, rec):', txt: 'When online, tags go straight to the twin; when offline, they are buffered — store-and-forward so an outage never loses data.' },
      { ref: 'def backfill(self):                     # on reconnect, ordered replay', txt: 'On reconnect the buffered readings are replayed in timestamp order before live data resumes, keeping the twin\'s history complete and correctly ordered.' },
      { ref: 'now = self.clock.now()          # one disciplined timestamp per cycle', txt: 'All points in a scan share one disciplined timestamp, the consistent-time property that makes cross-machine correlation possible.' },
      { ref: 'self.mqtt.publish("twin/_gateway/heartbeat"', txt: 'A heartbeat lets the twin/monitoring know the gateway is alive and how many sources it is serving, so a dead gateway is visible rather than a silently frozen model.' },
    ],
  }],

  config: [
    'Define each source (protocol, address, points) and the tag map (name, unit, scale, offset, quality rules).',
    'Configure the disciplined time source (NTP/PTP/GPS) and the scan rate per source.',
    'Configure the uplink (MQTT/Sparkplug broker) and the store-and-forward buffer location/size.',
    'Keep the gateway read-only unless a rigorously-safeguarded write path is explicitly required.',
  ],
  calibration: [
    { h: 'Tag scaling', p: [
      'Verify each tag\'s scaled value against a known reference/manual reading; correct scale/offset until they agree.',
    ] },
    { h: 'Time discipline', p: [
      'Confirm the clock is disciplined and timestamps across sources align (correlate two known simultaneous events).',
    ] },
    { h: 'Buffering', p: [
      'Simulate an uplink outage and confirm data buffers and back-fills in order with no gaps.',
    ] },
  ],
  testing: [
    { step: 'Read each protocol source', expect: 'Values ingested and normalised to correct tags/units' },
    { step: 'Correlate two simultaneous events', expect: 'Timestamps align — consistent-time verified' },
    { step: 'Disconnect a source', expect: 'Its tags flagged BAD/STALE, not silently frozen' },
    { step: 'Drop the uplink', expect: 'Data buffers locally; back-fills in order on reconnect' },
    { step: 'Check the gateway heartbeat', expect: 'Twin/monitoring sees gateway and source health' },
    { step: 'Attempt a write (should be blocked)', expect: 'Read-only by default; writes require explicit safeguards' },
  ],
  output: [
    'The twin/historian receives a unified stream of self-describing tags with values, units, timestamps and quality; the gateway exposes health.',
    { file: 'unified-tag.json', lang: 'json', body: `{
  "tag": "Line3.Motor2.WindingTemp",
  "value": 78.4,
  "unit": "degC",
  "t": 1785312003.120,
  "quality": "GOOD"
}` },
    'A raw PLC register becomes a meaningful, unit-bearing, timestamped, quality-flagged tag the twin can consume directly — the transformation that makes a live digital twin possible.',
  ],
  troubleshoot: [
    { sym: 'Twin can\'t correlate events', cause: 'Inconsistent/arrival timestamps', fix: 'Discipline the clock and stamp at read time on a common clock; the whole value depends on this' },
    { sym: 'Values wrong/meaningless', cause: 'Missing or wrong scale/offset', fix: 'Fix the tag map; verify scaled values against references' },
    { sym: 'Gaps in the twin history', cause: 'No store-and-forward', fix: 'Buffer locally and back-fill in order on reconnect' },
    { sym: 'Frozen tag trusted as live', cause: 'No quality/staleness flag', fix: 'Emit quality (good/stale/bad) and heartbeats; flag dead sources' },
    { sym: 'Unsafe control interaction', cause: 'Casual write path', fix: 'Read-only by default; isolate and rigorously safeguard any write' },
  ],

  iot: {
    protoShort: 'Plant protocols in → unified MQTT (Sparkplug) out',
    net: {
      nodes: [{ name: 'Gateway', sub: 'Pi/industrial host' }, { name: 'Plant sources', sub: 'PLCs/sensors' }],
      protocol: 'Modbus/OPC-UA/MQTT', gateway: 'This gateway', gatewaySub: 'translate+normalise',
      uplink: 'MQTT/Sparkplug', cloud: 'Twin / historian', cloudSub: 'unified tags',
      clients: [{ name: 'Digital twin', sub: 'live model' }, { name: 'Historian', sub: 'time series' }],
    },
    protocol: ['The gateway ingests each source protocol and republishes unified, timestamped, quality-flagged tags over MQTT (often Sparkplug B). Store-and-forward buffering and heartbeats make delivery reliable and health visible.'],
    topics: [
      { t: 'twin/<tag>', dir: 'gateway → twin', payload: 'value, unit, timestamp, quality' },
      { t: 'twin/_gateway/heartbeat', dir: 'gateway → monitor', payload: 'gateway/source health' },
      { t: 'twin/_gateway/status', dir: 'gateway → monitor', payload: 'per-source connect/quality' },
    ],
    cloud: ['A twin/historian consumes the unified tags in real time to drive a live model and store history; the gateway\'s heartbeats and per-source status feed monitoring.'],
    dashboard: ['A tag browser with live values/units/quality, per-source connection health, and buffer/backfill status.'],
    mobile: ['Alerts on source disconnects, bad-quality tags, or gateway/heartbeat loss.'],
    security: [
      'Read-only by default; isolate and rigorously safeguard any write path to control.',
      'Secure the uplink (TLS/auth) and the gateway host; segment plant and IT networks.',
      'Emit quality/heartbeats so a dead feed or gateway is never mistaken for live data.',
    ],
  },

  perf: [
    'Scan each source at a rate matched to its data\'s dynamics; do not over-poll slow points.',
    'Normalise and timestamp at the edge so the twin gets ready-to-use tags.',
    'Buffer to durable local storage and back-fill in order; keep the buffer bounded.',
    'Publish with QoS/Sparkplug for reliable, stateful delivery.',
  ],
  safety: [
    'Read/observe by default; writing to control systems carries real safety weight and needs rigorous, reviewed safeguards and network segmentation.',
    'This complements, not replaces, plant SCADA/control; it must not interfere with control-critical timing.',
    'Emit quality and heartbeats so the twin never acts on a silently frozen tag.',
    'Follow industrial cybersecurity practice (segmentation, least privilege, secure uplink).',
  ],
  maintenance: [
    'Keep tag maps and source configs current as plant equipment changes.',
    'Verify time discipline and timestamp alignment periodically.',
    'Check buffer/backfill and heartbeat health.',
    'Review security segmentation and any write safeguards.',
  ],
  future: [
    'Add OPC-UA server/UNS publishing and a Unified Namespace model.',
    'Add edge analytics/ML inference on the normalised stream.',
    'Add schema/self-description (Sparkplug metrics) for auto-discovery.',
    'Add redundant gateways for high availability.',
  ],
  faq: [
    { q: 'Why is a gateway needed at all?', a: 'Because the plant floor speaks many incompatible protocols with inconsistent units and no common time, while a twin wants one clean, timestamped tag stream. The gateway translates and conditions the mess into what the twin can consume.' },
    { q: 'What is the single most important thing it does?', a: 'Consistent timestamps. A twin exists to correlate events across machines, which is impossible unless every reading is stamped on a common, disciplined clock. Everything else is secondary to getting time right.' },
    { q: 'What is store-and-forward and why does it matter?', a: 'The gateway buffers readings locally during a network outage and back-fills them in order when it reconnects, so the twin\'s history has no gaps despite the flaky connectivity common on plant floors.' },
    { q: 'Does the gateway control the plant?', a: 'By default, no — it reads and observes. Writing to control systems carries safety weight, so any write path is isolated and rigorously safeguarded, never a casual feature.' },
    { q: 'What does the twin actually receive?', a: 'Self-describing tags — name, value in engineering units, a common timestamp, and a quality flag — instead of raw registers, so it can build a live, trustworthy model directly.' },
  ],
  refs: [
    { t: 'Digital twin — overview', u: 'https://en.wikipedia.org/wiki/Digital_twin', s: 'Reference' },
    { t: 'Modbus protocol', u: 'https://en.wikipedia.org/wiki/Modbus', s: 'Reference' },
    { t: 'OPC-UA', u: 'https://en.wikipedia.org/wiki/OPC_Unified_Architecture', s: 'Reference' },
    { t: 'MQTT Sparkplug B for IIoT', u: 'https://www.eclipse.org/tahu/', s: 'Eclipse' },
    { t: 'Store-and-forward and time sync (PTP/NTP)', u: 'https://en.wikipedia.org/wiki/Precision_Time_Protocol', s: 'Reference' },
  ],
  images: ['factory', 'datacentre', 'esp32'],
  imageCaptions: [
    'The gateway bridges a heterogeneous plant floor into one clean, timestamped stream for a digital twin.',
    'Diverse plant protocols in; a unified, normalised, quality-flagged tag stream out.',
    'Store-and-forward buffering and consistent time make the twin\'s data complete and correlatable.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   064 — Remote Tank Level Telemetry
   ══════════════════════════════════════════════════════════════════ */
{
  id: '064',
  domainKey: 'iot',
  emoji: '🛢️', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Monitors fuel and chemical tank levels from anywhere, converts level to real volume, and flags the unexpected drops that mean a leak or theft — safely, even in hazardous atmospheres.',

  overview: [
    'Tanks of fuel, water, chemicals or lubricant sit at remote sites — a genset\'s diesel tank at a tower, a farm\'s chemical store, a plant\'s bulk storage — and running one dry, or losing product to a leak or theft, is expensive and sometimes dangerous. Yet checking them means someone driving out with a dipstick. This project puts a level sensor on the tank and telemeters the reading from anywhere, so you always know how much is in each tank, get warned before it runs low (in time to reorder), and — importantly — get alerted to the <b>unexpected drops</b> that signal a leak or theft rather than normal use.',
    'The measurement turns a raw level into something useful. A sensor reads the level — non-contact ultrasonic/radar from the top, or a hydrostatic pressure sensor at the bottom (pressure is proportional to the height of liquid above it) — and the firmware converts that height into a real <b>volume</b> using the tank\'s geometry or a <b>strapping table</b> (a lookup of level-to-volume for irregular or horizontal cylindrical tanks, where volume is very non-linear with height). So the report is "1,840 litres, 61%", not just a distance. It watches the <b>rate of change</b>: a slow decline matches expected consumption, a sudden step down when nothing should be drawing signals a leak or theft, and a rise means a refill (which it can log and reconcile against the delivery).',
    'Because these tanks are remote and often in hazardous locations, the design takes both seriously: it is solar-powered and reports over LoRa or cellular (no mains, no Wi-Fi), logs locally so nothing is lost, and — critically for fuels and flammable chemicals — it is explicit that any electronics in or near a potentially explosive atmosphere must use appropriately <b>intrinsically-safe/rated</b> equipment, keeping sparks away from vapour. It stages alerts (low level → reorder, sudden drop → leak/theft, high → overfill) and logs history for consumption analysis and reconciliation. It is honest that hazardous-area work is governed by law and standards and that a hobby build is not automatically compliant — but as a level-to-volume, leak-and-theft-aware, remote tank monitor, it replaces the dipstick run with knowing, from anywhere, exactly how much is in every tank and when something is wrong.',
  ],
  does: [
    'Monitors tank level remotely (non-contact or hydrostatic pressure)',
    'Converts level to real volume via geometry or a strapping table',
    'Warns before a tank runs low (reorder in time)',
    'Flags unexpected drops (leak/theft) vs normal consumption',
    'Logs refills and reconciles against deliveries',
    'Runs on solar and reports over LoRa/cellular with local logging',
    'Respects hazardous-area requirements for fuels/flammable chemicals',
  ],
  features: [
    'Level-to-volume conversion (strapping table for non-linear tanks)',
    'Rate-of-change leak/theft detection',
    'Low-level reorder and overfill alerts',
    'Refill logging and delivery reconciliation',
    'Solar + LoRa/cellular for remote, mains-free sites',
    'Local logging through outages',
    'Explicit intrinsically-safe/hazardous-area guidance',
  ],
  applications: [
    { t: 'Diesel / genset fuel tanks', d: 'Remote fuel level with reorder alerts and theft/leak detection at towers, sites and farms.' },
    { t: 'Chemical / agri storage', d: 'Level and usage of stored chemicals, with overfill and leak alerts.' },
    { t: 'Water / lubricant tanks', d: 'Level telemetry for water storage and industrial fluids.' },
    { t: 'Fuel distribution / fleets', d: 'Bulk-tank monitoring and delivery reconciliation across sites.' },
  ],
  skills: [
    'Non-contact and hydrostatic level measurement',
    'Level-to-volume conversion and strapping tables',
    'Rate-of-change leak/theft detection',
    'LoRa/cellular + solar remote telemetry',
    'Hazardous-area (intrinsic safety) awareness',
  ],
  prereq: [
    'For fuels/flammable chemicals, any device in or near the hazardous zone must be appropriately intrinsically-safe/rated — this is law, not optional; a hobby build is not automatically compliant.',
    'Convert level to volume with the correct geometry/strapping table — volume is very non-linear with height in horizontal cylindrical tanks.',
    'Watch rate of change: a sudden drop with no draw is leak/theft, not consumption.',
    'Log locally and report over LoRa/cellular — remote sites have no mains or Wi-Fi.',
  ],

  parts: ['esp32', 'jsnsr04t', 'ds18b20', 'lora', 'sim800', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Level sensor (non-contact or hydrostatic)', spec: 'Radar/ultrasonic from top, or a submersible hydrostatic pressure transducer', qty: 1, price: 1500, note: 'Choose intrinsically-safe/rated types for fuels/flammables' },
    { name: 'Intrinsic-safety barrier / rated enclosure', spec: 'IS barrier and rated enclosure where the atmosphere may be explosive', qty: 1, price: 2000, note: 'Mandatory in hazardous zones — follow standards/law' },
    { name: 'Strapping table (tank data)', spec: 'Manufacturer level-to-volume table for the specific tank', qty: 1, price: 0, note: 'Not hardware — essential for accurate volume' },
    { name: 'Cellular modem (optional)', spec: 'Where no LoRa gateway exists', qty: 1, price: 900 },
  ],
  cost: '₹5,000 – ₹9,000 (higher with IS-rated hardware)',
  libs: ['wifi', 'onewire', 'unified', 'lorolib', 'arduinojson', 'preferences', 'ntp'],

  pins: {
    left: [
      { dev: 'Level sensor', devPin: 'TRIG/ECHO or 4-20mA', pin: 'GPIO 26/25 or ADC', sig: 'Level (non-contact/hydrostatic)' },
      { dev: 'DS18B20', devPin: 'DQ', pin: 'GPIO 4', sig: 'Temp (density/sound-speed correction)' },
    ],
    right: [
      { dev: 'LoRa/cellular', devPin: 'bus', pin: 'SPI / UART', sig: 'Telemetry' },
      { dev: 'Solar + TP4056', devPin: 'OUT', pin: '3V3 reg', sig: 'Charged supply' },
      { dev: 'IS barrier', devPin: 'in-line', pin: '—', sig: 'Hazardous-area protection' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Health' },
    ],
  },
  wiringNotes: [
    'For fuels/flammable chemicals: any sensor/electronics in or near the hazardous zone must be intrinsically-safe/rated and installed via an IS barrier per standards — keep sparks away from vapour. This is legally required.',
    'Mount non-contact sensors above the max level aimed at the liquid; hydrostatic transducers sit at the tank bottom and read the pressure of liquid above.',
    'Temperature-correct as needed (ultrasonic sound speed; liquid density for mass) using the DS18B20.',
    'Keep the controller/battery outside the hazardous zone where possible, with only the rated sensor inside.',
    'Solar-power and antenna clear of the tank structure; log locally so nothing is lost.',
  ],

  block: { columns: [
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'Level sensor', sub: 'non-contact/hydrostatic', highlight: true },
      { name: 'Temp', sub: 'correction' },
    ] },
    { label: 'Convert', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'level → volume' },
      { name: 'Strapping', sub: 'table lookup' },
    ] },
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'Rate', sub: 'leak/theft vs use' },
      { name: 'Alerts', sub: 'low/overfill/drop' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'Dashboard', sub: 'volume + history' },
      { name: 'Reorder', sub: 'in time' },
    ] },
  ] },
  flow: [
    { t: 'Wake on schedule', k: 'start' },
    { t: 'Read level; temp-correct', k: 'proc' },
    { t: 'Level → volume (strapping)', k: 'proc' },
    { t: 'Sudden drop with no draw?', k: 'dec', yes: 'Leak/theft alert', no: 'Check thresholds' },
    { t: 'Leak/theft alert', k: 'io' },
    { t: 'Check thresholds', k: 'proc' },
    { t: 'Low/overfill?', k: 'dec', yes: 'Reorder / overfill alert', no: 'Log + report' },
    { t: 'Reorder / overfill alert', k: 'io' },
    { t: 'Log + report; sleep', k: 'end', back: 'Wake on schedule' },
  ],

  principle: [
    'The point of tank telemetry is to replace the dipstick run with continuous knowledge, and its usefulness depends on turning a raw level into <b>volume</b> and on interpreting the <b>change</b> in that volume. Measuring level is the easy part: a non-contact ultrasonic/radar sensor times an echo off the surface from the top, or a hydrostatic pressure transducer at the bottom measures the pressure of the liquid column above it (pressure is directly proportional to liquid height and density). Either gives a height. But a height is not what anyone acts on — you reorder against litres remaining, reconcile a delivery in litres, and quantify a loss in litres — so the firmware must convert height to volume.',
    'That conversion is where a subtlety lives: for many real tanks, <b>volume is strongly non-linear with height</b>. A horizontal cylindrical tank (the classic fuel tank) holds far more litres per centimetre near the middle than near the top or bottom, because its cross-section is a circle; a step-shaped or irregular tank is worse. So a simple "height × area" fails, and the correct approach is a <b>strapping table</b> — a lookup, provided by the tank manufacturer or measured, that maps level to volume for that specific tank — interpolated between entries. Using the right geometry or strapping table is the difference between a volume reading that is trustworthy and one that is comfortably wrong exactly where it matters.',
    'The high-value intelligence is in the <b>rate of change</b>. A tank\'s volume normally declines slowly as product is consumed, matching the expected draw, and jumps up on a refill. Against that backdrop, two anomalies stand out. A <b>sudden step down</b> when nothing should be drawing — overnight, or when the equipment is off — is the signature of a <b>leak or theft</b>, and catching it fast can save a lot of product (and, for fuel, a lot of money and a safety hazard). A gradual decline <i>faster</i> than expected consumption can indicate a slow leak. And a <b>rise</b> is a delivery, which the monitor logs so it can <b>reconcile</b> the measured increase against the invoiced quantity — catching short deliveries. Layered on this are the operational thresholds: a <b>low-level</b> alert with enough lead time to reorder before running dry, and a <b>high-level/overfill</b> alert during filling.',
    'Finally, the deployment realities are handled honestly, and one of them is <b>safety-critical</b>. Remote tanks have no mains and no Wi-Fi, so the monitor is solar-powered, reports over LoRa or cellular, and logs locally so an outage loses nothing — standard remote-telemetry design. But fuels and many chemicals create a <b>potentially explosive atmosphere</b> of vapour, and electronics placed in or near that zone can ignite it, so the design is emphatic that any in-zone sensor or wiring must be <b>intrinsically safe / appropriately rated</b> and installed through an IS barrier per the governing standards and law — keeping the electrical energy too low to ignite vapour, and keeping the battery and radio out of the hazardous zone where possible. This is not an optional nicety; it is a legal and life-safety requirement, and a hobby build is not automatically compliant. Within that frame, though, the monitor delivers exactly what tank operators need: from anywhere, the real volume in every tank, timely reordering, delivery reconciliation, and an immediate flag when a level drops for a reason that is not normal use.',
  ],
  equations: [
    { t: 'Hydrostatic level and volume', eq: 'Hydrostatic pressure at the bottom:\n  P = ρ·g·h   →   h = P / (ρ·g)   (ρ = liquid density)\n\nVolume from level via geometry/strapping:\n  simple vertical cylinder: V = A·h\n  horizontal cylinder / irregular: V = strapping_table(h)\n  → volume is NON-LINEAR with h; use the table.' },
    { t: 'Leak / theft detection', eq: 'Expected: slow decline matching consumption, rises on refill.\n\n  dV/dt ≈ −consumption   (normal)\n  ALERT leak/theft if dV/dt << expected while no draw\n     (sudden step down, or decline with equipment off)\n  ALERT refill if dV/dt > 0 (log; reconcile vs delivery)' },
    { t: 'Reorder lead time', eq: 'From current volume V and average consumption rate c:\n  days_to_empty ≈ V / c\n\n  reorder when days_to_empty < lead_time + safety_margin\nGives time to reorder before running dry.' },
  ],

  assembly: [
    { h: 'Install the level sensor safely', p: [
      'Fit a non-contact sensor above the max level (aimed at the liquid) or a hydrostatic transducer at the bottom. For fuels/flammables, use intrinsically-safe/rated equipment installed through an IS barrier per standards, and keep the controller/battery outside the hazardous zone where possible.',
      'Load the tank\'s strapping table (or exact geometry) for accurate volume.',
    ], warn: 'Hazardous-area safety is legally mandated for fuels/flammable chemicals. Non-IS electronics in a vapour zone can cause an explosion. Follow the governing standards and use rated equipment — a hobby build is not automatically compliant.' },
    { h: 'Set up level-to-volume and detection', p: [
      'Configure the strapping-table interpolation and temperature correction, and the rate-of-change leak/theft logic and thresholds.',
    ] },
    { h: 'Set up power, telemetry and logging', p: [
      'Solar-power the (out-of-zone) controller, report over LoRa/cellular, and log locally so nothing is lost.',
    ] },
  ],
  steps: [
    { h: 'Convert level to volume and detect anomalies', p: [
      'Read and temperature-correct the level, interpolate the strapping table to volume, and evaluate rate-of-change and threshold alerts.',
    ], code: {
      file: 'tank-volume.ino', lang: 'cpp',
      body: `// Strapping table: level (cm) -> volume (L), interpolated.
struct Strap { float level_cm; float volume_L; };
Strap TABLE[] = { {0,0},{20,180},{40,520},{60,980},{80,1520},
                  {100,2080},{120,2560},{140,2900},{160,3080} };
const int N = sizeof(TABLE)/sizeof(TABLE[0]);

float levelToVolume(float level_cm) {
  if (level_cm <= TABLE[0].level_cm) return TABLE[0].volume_L;
  for (int i = 1; i < N; i++) {
    if (level_cm <= TABLE[i].level_cm) {          // linear interpolation
      float f = (level_cm - TABLE[i-1].level_cm) /
                (TABLE[i].level_cm - TABLE[i-1].level_cm);
      return TABLE[i-1].volume_L +
             f*(TABLE[i].volume_L - TABLE[i-1].volume_L);
    }
  }
  return TABLE[N-1].volume_L;
}

const char* anomaly(float vol, float prevVol, float dtHrs,
                    float expectedDrawLph, bool equipmentOn) {
  float dV = vol - prevVol;                        // L change
  float rate = dtHrs>0 ? dV/dtHrs : 0;             // L/h
  if (rate > 5) return "refill";                    // rise -> delivery
  if (!equipmentOn && rate < -5) return "LEAK/THEFT (drop, no draw)";
  if (rate < -1.5f*expectedDrawLph) return "faster than expected (leak?)";
  return nullptr;
}`,
      explain: [
        { ref: 'float levelToVolume(float level_cm)', txt: 'Converts level to real volume by interpolating the tank\'s strapping table, correctly handling the strong non-linearity of horizontal/irregular tanks that a simple area calculation gets wrong.' },
        { ref: 'if (!equipmentOn && rate < -5) return "LEAK/THEFT (drop, no draw)"', txt: 'A volume drop while nothing should be drawing is the signature of a leak or theft — the high-value anomaly, distinct from normal consumption.' },
        { ref: 'if (rate > 5) return "refill"', txt: 'A rising volume is logged as a delivery so it can be reconciled against the invoiced quantity.' },
        { ref: 'if (rate < -1.5f*expectedDrawLph) return "faster than expected (leak?)"', txt: 'A decline faster than expected consumption flags a possible slow leak even without a sudden step.' },
      ],
    } },
    { h: 'Alert, reorder and report', p: [
      'Raise low-level (with reorder lead time), overfill, leak/theft and refill alerts, log the history for consumption analysis and reconciliation, and report over LoRa/cellular.',
    ], tip: 'Compute days-to-empty from recent consumption and alert with enough lead time to reorder — not just when the tank is nearly dry.' },
  ],

  code: [{
    file: 'tank-level-telemetry.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Remote Tank Level Telemetry — ESP32, level→volume, leak/theft, LoRa

   Reads tank level (non-contact/hydrostatic), converts to real volume
   via a strapping table, detects leaks/theft/refills by rate-of-change,
   alerts and reorders in time, and reports over LoRa/cellular on solar.
   HAZARDOUS AREAS: use intrinsically-safe/rated equipment (law).
   ══════════════════════════════════════════════════════════════════ */

#include <OneWire.h>
#include <DallasTemperature.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>

#define PIN_TRIG 26
#define PIN_ECHO 25
#define OW_PIN    4
#define SENSOR_HEIGHT_CM 170.0f
#define REORDER_DAYS 5
#define SLEEP_S 1800            // 30 min

OneWire ow(OW_PIN); DallasTemperature temp(&ow);
Preferences prefs;

struct Strap { float lvl, vol; };
Strap TABLE[] = { {0,0},{20,180},{40,520},{60,980},{80,1520},
                  {100,2080},{120,2560},{140,2900},{160,3080} };
const int N = 9;

RTC_DATA_ATTR float prevVol = -1; RTC_DATA_ATTR uint32_t prevEpoch = 0;
RTC_DATA_ATTR float avgDrawLph = 0;

float readLevelCm(float tAir){
  float c = (331.3f + 0.606f*tAir)/10000.0f;      // cm/us
  digitalWrite(PIN_TRIG,LOW); delayMicroseconds(2);
  digitalWrite(PIN_TRIG,HIGH); delayMicroseconds(10); digitalWrite(PIN_TRIG,LOW);
  long us = pulseIn(PIN_ECHO,HIGH,30000);
  if(!us) return NAN;
  float dist = us*c/2.0f;
  return SENSOR_HEIGHT_CM - dist;                  // liquid height
}

float levelToVolume(float lvl){
  if (lvl<=TABLE[0].lvl) return 0;
  for(int i=1;i<N;i++) if(lvl<=TABLE[i].lvl){
    float f=(lvl-TABLE[i-1].lvl)/(TABLE[i].lvl-TABLE[i-1].lvl);
    return TABLE[i-1].vol + f*(TABLE[i].vol-TABLE[i-1].vol);
  }
  return TABLE[N-1].vol;
}

void transmit(float vol,float pct,const char*alert,float days){
  LoRa.beginPacket();
  LoRa.printf("{\\"tank\\":1,\\"vol_L\\":%.0f,\\"pct\\":%.0f,"
              "\\"days\\":%.1f,\\"alert\\":\\"%s\\"}",
              vol,pct,days, alert?alert:"none");
  LoRa.endPacket();
}

void setup(){
  Serial.begin(115200);
  pinMode(PIN_TRIG,OUTPUT); pinMode(PIN_ECHO,INPUT);
  temp.begin();

  temp.requestTemperatures();
  float tAir = temp.getTempCByIndex(0);
  float lvl = readLevelCm(tAir);
  float vol = levelToVolume(lvl);
  float pct = vol / TABLE[N-1].vol * 100.0f;

  uint32_t nowE = timeEpoch();
  const char *alert = nullptr;
  if (prevVol >= 0 && prevEpoch){
    float dtHrs = (nowE - prevEpoch)/3600.0f;
    float rate = dtHrs>0 ? (vol-prevVol)/dtHrs : 0;   // L/h
    if (rate > 5)                     alert = "refill";
    else if (rate < -5 && equipmentOff()) alert = "LEAK/THEFT";
    else if (rate < 0) avgDrawLph = 0.8f*avgDrawLph + 0.2f*(-rate);
  }
  prevVol = vol; prevEpoch = nowE;

  float days = avgDrawLph>0.01f ? vol/(avgDrawLph*24.0f) : 999;
  if (!alert && days < REORDER_DAYS) alert = "reorder soon";
  if (!alert && pct > 98) alert = "overfill";

  logLocal(vol,pct,alert);

  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6); LoRa.setSpreadingFactor(10);
  transmit(vol,pct,alert,days);

  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_S*1000000ULL);
  esp_deep_sleep_start();
}
void loop(){}`,
    explain: [
      { ref: 'float levelToVolume(float lvl)', txt: 'Interpolates the strapping table so the reported volume is accurate even for a tank whose volume is highly non-linear with height.' },
      { ref: 'else if (rate < -5 && equipmentOff()) alert = "LEAK/THEFT"', txt: 'A drop while the equipment is off is flagged as leak/theft — the anomaly that distinguishes a loss from normal consumption.' },
      { ref: 'else if (rate < 0) avgDrawLph = 0.8f*avgDrawLph + 0.2f*(-rate)', txt: 'Normal declines update the running average consumption rate, which drives the days-to-empty and reorder logic.' },
      { ref: 'float days = avgDrawLph>0.01f ? vol/(avgDrawLph*24.0f) : 999', txt: 'Projects days-to-empty from real consumption so reorder alerts arrive with enough lead time, not when the tank is already low.' },
      { ref: 'esp_sleep_enable_timer_wakeup', txt: 'The monitor deep-sleeps between half-hourly reads, making a solar deployment last indefinitely at a remote site.' },
    ],
  }],

  config: [
    'Load the tank\'s strapping table (or exact geometry) and the sensor height/type.',
    'Set the reorder lead time/safety margin, overfill and leak/theft thresholds, and equipment-off signal.',
    'Choose LoRa/cellular telemetry, the sampling interval, and local logging.',
    'For fuels/flammables, specify intrinsically-safe/rated equipment and installation per standards.',
  ],
  calibration: [
    { h: 'Volume', p: [
      'Verify the strapping-table volume against known added/removed quantities at several levels; correct the table/geometry.',
    ] },
    { h: 'Anomaly thresholds', p: [
      'Set leak/theft and faster-than-expected thresholds from the tank\'s normal consumption so real losses alarm but normal draw does not.',
    ] },
    { h: 'Reorder', p: [
      'Confirm days-to-empty and the reorder lead time give enough warning before running dry.',
    ] },
  ],
  testing: [
    { step: 'Add/remove known volumes', expect: 'Reported volume matches via the strapping table' },
    { step: 'Draw down normally', expect: 'Slow decline; no anomaly; consumption rate learned' },
    { step: 'Remove product with equipment off', expect: 'Leak/theft alert' },
    { step: 'Refill the tank', expect: 'Refill logged; reconcile vs delivery' },
    { step: 'Approach low level', expect: 'Reorder alert with adequate lead time' },
    { step: 'Overfill', expect: 'Overfill alert' },
  ],
  output: [
    'The dashboard shows each tank\'s volume and %, days-to-empty, consumption/refill history, and alerts for reorder, overfill and leak/theft.',
    { file: 'tank.json', lang: 'json', body: `{
  "tank": 1,
  "vol_L": 1840,
  "pct": 61,
  "days": 6.2,
  "alert": "none"
}` },
    'A real volume (1,840 L, 61%) with a days-to-empty projection; a sudden drop with the equipment off would instead raise a leak/theft alert, and a low projection would trigger a reorder in time.',
  ],
  troubleshoot: [
    { sym: 'Volume wrong for the level', cause: 'Wrong/simple geometry, not a strapping table', fix: 'Use the tank\'s strapping table; interpolate correctly (volume is non-linear with height)' },
    { sym: 'Missed a theft/leak', cause: 'Thresholds too loose or no equipment-off signal', fix: 'Tune rate thresholds; use the equipment-off signal to distinguish loss from draw' },
    { sym: 'Reorders too late', cause: 'Alerting only on low level', fix: 'Project days-to-empty from consumption and reorder with lead time' },
    { sym: 'Noisy level readings', cause: 'Surface turbulence/foam, or temperature drift', fix: 'Median-filter; temperature-correct; damp the sensor input' },
    { sym: 'Safety concern (fuel)', cause: 'Non-IS electronics in a hazardous zone', fix: 'Use intrinsically-safe/rated equipment and an IS barrier per standards/law; keep electronics out of zone where possible' },
  ],

  iot: {
    protoShort: 'LoRa/cellular → tank dashboard',
    net: {
      nodes: [{ name: 'Tank monitor', sub: 'ESP32' }, { name: 'Other tanks', sub: 'per-tank' }],
      protocol: 'LoRa / cellular', gateway: 'Site/area GW', gatewaySub: 'or cellular',
      uplink: 'MQTT 1883', cloud: 'Tank dashboard', cloudSub: 'volume + alerts',
      clients: [{ name: 'Dashboard', sub: 'volume/history' }, { name: 'Phone', sub: 'leak/reorder' }],
    },
    protocol: ['Volume, %, days-to-empty and alerts report on a slow cadence; leak/theft and overfill publish immediately. Local logging covers outages.'],
    topics: [
      { t: 'tank/1/level', dir: 'node → dashboard', payload: 'volume, %, days-to-empty' },
      { t: 'tank/1/alert', dir: 'node → ops', payload: 'leak/theft, reorder, overfill, refill' },
      { t: 'tank/1/status', dir: 'node → ops', payload: 'battery, RSSI, sensor health' },
    ],
    cloud: ['A dashboard trends each tank\'s volume and consumption, projects reorder timing, reconciles refills against deliveries, and raises leak/theft alerts.'],
    dashboard: ['Per-tank volume/% gauges, consumption/refill history, days-to-empty, and alert log.'],
    mobile: ['Immediate leak/theft and overfill alerts, and reorder-in-time notifications.'],
    security: [
      'Sign readings so levels/alerts cannot be spoofed (relevant to theft).',
      'Keep hazardous-area electronics intrinsically safe and out of zone where possible.',
      'Alert on node silence — a disabled monitor could mask theft.',
    ],
  },

  perf: [
    'Deep-sleep between reads; a slow cadence suits tanks and preserves solar budget.',
    'Median-filter and temperature-correct level readings for stable volume.',
    'Keep consumption/level state in RTC memory so rate/reorder logic survives sleep.',
    'Report on change plus heartbeat; alerts immediately.',
  ],
  safety: [
    'FOR FUELS/FLAMMABLE CHEMICALS: any device in or near the hazardous atmosphere must be intrinsically-safe/rated and installed per governing standards and law — a hobby build is not automatically compliant.',
    'Keep the battery/radio out of the hazardous zone where possible; use IS barriers for in-zone sensors.',
    'Handle chemicals and fuels per their safety data; avoid overfill and spillage.',
    'Leak/theft alerts support, not replace, proper containment and site safety.',
  ],
  maintenance: [
    'Verify the strapping table and sensor calibration periodically.',
    'Inspect IS equipment/barriers and enclosures for compliance and integrity.',
    'Clean non-contact sensor faces; check hydrostatic transducers for fouling.',
    'Review consumption/leak thresholds and reorder lead times.',
  ],
  future: [
    'Add temperature-compensated mass (not just volume) for fuels.',
    'Add automated reordering/integration with suppliers.',
    'Fuse multiple tanks and deliveries for full inventory reconciliation.',
    'Add leak-rate quantification and location hints.',
  ],
  faq: [
    { q: 'Why convert level to volume?', a: 'Because you act in litres, not centimetres — reorder, reconcile deliveries and quantify losses all use volume. And volume is very non-linear with height in horizontal/irregular tanks, so a strapping table is needed for accuracy.' },
    { q: 'How does it tell a leak/theft from normal use?', a: 'By rate of change and context. Normal consumption is a slow decline; a sudden drop when nothing should be drawing (equipment off, overnight) is a leak or theft, and a decline faster than expected flags a possible slow leak.' },
    { q: 'Can I put this on a diesel tank myself?', a: 'Fuel tanks create a potentially explosive atmosphere, so any in-zone electronics must be intrinsically-safe/rated and installed per standards and law. This is a legal, life-safety requirement — a hobby build is not automatically compliant.' },
    { q: 'How does it help me not run dry?', a: 'It projects days-to-empty from your real consumption and alerts with enough lead time to reorder, instead of only warning when the tank is already nearly empty.' },
    { q: 'How does it work at a remote site with no power or Wi-Fi?', a: 'Solar power, LoRa or cellular telemetry, and local logging so nothing is lost during outages — standard remote-telemetry design.' },
  ],
  refs: [
    { t: 'Tank level measurement methods', u: 'https://en.wikipedia.org/wiki/Level_sensor', s: 'Reference' },
    { t: 'Tank strapping / calibration tables', u: 'https://en.wikipedia.org/wiki/Tank_gauging', s: 'Reference' },
    { t: 'Hydrostatic level measurement', u: 'https://en.wikipedia.org/wiki/Pressure_measurement', s: 'Reference' },
    { t: 'Intrinsic safety and hazardous areas (ATEX/IECEx)', u: 'https://en.wikipedia.org/wiki/Intrinsic_safety', s: 'Reference' },
    { t: 'Fuel theft/leak detection', u: 'https://en.wikipedia.org/wiki/Leak_detection', s: 'Reference' },
  ],
  images: ['factory', 'ultrasonic', 'lora'],
  imageCaptions: [
    'Remote tanks monitored from anywhere — real volume, reorder timing, and leak/theft alerts.',
    'A level sensor reads the tank; the firmware converts it to volume via the strapping table.',
    'A LoRa/cellular link on solar power reports each tank\'s volume and anomalies from mains-free sites.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   065 — OEE Productivity Tracker
   ══════════════════════════════════════════════════════════════════ */
{
  id: '065',
  domainKey: 'iot',
  emoji: '📊', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Automatically logs a machine\'s uptime, speed and quality and computes OEE — turning a factory\'s vague sense of "how are we doing?" into the exact numbers that show where output is lost.',

  overview: [
    'Every factory wants to make more with what it has, but most cannot say <i>where</i> their output is being lost — to stoppages, to running slow, or to scrap. <b>OEE (Overall Equipment Effectiveness)</b> is the standard metric that answers this, and it does so by decomposing productivity into three factors: <b>Availability</b> (was the machine running when it should have been?), <b>Performance</b> (did it run at its rated speed?), and <b>Quality</b> (were the parts good?). Multiply them and you get one number, 0-100%, that captures the true productive fraction of a machine — and, more usefully, three numbers that pinpoint which kind of loss is hurting you. This project measures the inputs automatically and computes OEE live, replacing gut feel and manual logs with the real figures.',
    'The tracker senses the three inputs from the machine. <b>Availability</b> comes from a run/stop signal (a machine-on input, a cycle sensor, or motor current) that logs exactly when the machine was running versus down, and for how long each stoppage lasted. <b>Performance</b> comes from counting output (a cycle/item counter) and comparing the actual rate to the machine\'s ideal rate. <b>Quality</b> comes from a good/reject signal (a reject-station input, or manual entry) giving the good-part fraction. From these it computes each factor and the overall OEE, live, per shift and per batch — and because it logs <i>why</i> the machine stopped (downtime reasons) it exposes the "six big losses" that OEE is designed to attack.',
    'The value is that OEE is <b>actionable</b>: a low Availability points at breakdowns and changeovers, a low Performance at minor stops and slow running, a low Quality at scrap and rework — so improvement effort goes where the loss actually is, and the same numbers verify whether a fix worked. The tracker reports to a dashboard, ranks losses, and gives operators a live OEE they can respond to. It is honest that OEE is only as good as its inputs (a correct ideal cycle time, an honest definition of planned production time, accurate good/reject counts) and that it measures effectiveness, not the whole business. But as an automatic, always-on OEE tracker, it converts a machine\'s activity into the industry-standard productivity numbers that show, precisely, where output is being lost and whether it is being recovered.',
  ],
  does: [
    'Logs machine run/stop (Availability) with per-stoppage duration and reason',
    'Counts output and compares to ideal rate (Performance)',
    'Captures good/reject counts (Quality)',
    'Computes Availability × Performance × Quality = OEE, live',
    'Reports OEE per shift/batch and ranks the losses',
    'Exposes the "six big losses" for targeted improvement',
    'Verifies whether improvements actually raised OEE',
  ],
  features: [
    'Automatic three-factor OEE (Availability/Performance/Quality)',
    'Downtime logging with reasons (six big losses)',
    'Live and per-shift/batch OEE',
    'Loss ranking to target improvement',
    'Before/after verification of fixes',
    'Dashboard and operator display',
    'Honest about input quality and OEE\'s scope',
  ],
  applications: [
    { t: 'Machine / line productivity', d: 'Live OEE per machine to find and reduce the biggest output losses.' },
    { t: 'Continuous improvement / lean', d: 'Data-driven targeting of the six big losses and verification of kaizen results.' },
    { t: 'Shift / management reporting', d: 'Objective per-shift/batch productivity figures instead of manual logs.' },
    { t: 'Capacity / bottleneck analysis', d: 'Understanding true available capacity across machines.' },
  ],
  skills: [
    'Sensing run/stop, output count and good/reject',
    'Computing Availability, Performance, Quality and OEE',
    'Downtime-reason capture and loss classification',
    'Live/shift aggregation and dashboards',
    'Defining ideal cycle time and planned production time correctly',
  ],
  prereq: [
    'OEE = Availability × Performance × Quality; get all three inputs, or the number is meaningless.',
    'The ideal cycle time and the definition of planned production time must be correct and agreed — they anchor Performance and Availability.',
    'Capture downtime reasons — OEE\'s power is telling you WHICH loss to attack (the six big losses).',
    'OEE measures effectiveness, not everything; use it to target losses, not as the sole business metric.',
  ],

  parts: ['esp32', 'reed', 'ir_sensor', 'acs712', 'oled', 'keypad', 'psu5v'],
  extraParts: [
    { name: 'Machine-state inputs', spec: 'Run/stop signal (machine-on / cycle sensor / motor current)', qty: 1, price: 400, note: 'Tap a clean signal for Availability' },
    { name: 'Output counter sensor', spec: 'Cycle/item sensor for Performance (count vs ideal rate)', qty: 1, price: 300 },
    { name: 'Reject/good input + reason selector', spec: 'Reject-station signal or operator buttons for Quality and downtime reasons', qty: 1, price: 350 },
    { name: 'Andon display', spec: 'Operator display/stack-light showing live OEE and state', qty: 1, price: 800 },
  ],
  cost: '₹2,500 – ₹4,500',
  libs: ['wifi', 'pubsub', 'ssd1306', 'ntp', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Run/stop signal', devPin: 'in', pin: 'GPIO 34', sig: 'Machine running state' },
      { dev: 'Output sensor', devPin: 'PULSE', pin: 'GPIO 27', sig: 'Cycle/item count' },
      { dev: 'Reject/good', devPin: 'in', pin: 'GPIO 26', sig: 'Quality count' },
      { dev: 'Reason selector', devPin: 'keypad', pin: 'GPIO matrix', sig: 'Downtime reason' },
    ],
    right: [
      { dev: 'OLED/Andon', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Live OEE + state' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard' },
      { dev: 'RTC', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Shift timing' },
      { dev: '5V supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Tap a clean, unambiguous run/stop signal for Availability — a machine-on contact, a cycle sensor, or a motor-current threshold.',
    'Use a reliable output sensor for counting cycles/items; debounce it like a counter.',
    'Provide a good/reject input (reject-station signal or operator confirmation) for Quality.',
    'Give operators an easy way to select the downtime reason so losses are classified (the six big losses).',
    'Show live OEE/state on an operator display/stack-light so the floor can respond.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Run/stop', sub: 'Availability', highlight: true },
      { name: 'Count', sub: 'Performance' },
      { name: 'Good/reject', sub: 'Quality' },
      { name: 'Reason', sub: 'downtime' },
    ] },
    { label: 'Compute', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'A×P×Q = OEE' },
      { name: 'Losses', sub: 'six big losses' },
    ] },
    { label: 'Show', edge: 'right', blocks: [
      { name: 'Andon', sub: 'live OEE' },
      { name: 'Dashboard', sub: 'shift/batch' },
    ] },
    { label: 'Improve', edge: 'none', blocks: [
      { name: 'Target loss', sub: 'rank' },
      { name: 'Verify', sub: 'before/after' },
    ] },
  ] },
  flow: [
    { t: 'Track run/stop, count, good/reject', k: 'start' },
    { t: 'On stop: capture reason', k: 'proc' },
    { t: 'Compute A, P, Q', k: 'proc' },
    { t: 'OEE = A × P × Q', k: 'proc' },
    { t: 'A/P/Q low → which loss?', k: 'dec', yes: 'Rank + flag loss', no: 'Update dashboard' },
    { t: 'Rank + flag loss', k: 'io' },
    { t: 'Update dashboard', k: 'io' },
    { t: 'Shift/batch rollups', k: 'end', back: 'Track run/stop, count, good/reject' },
  ],

  principle: [
    'OEE is powerful because it <b>decomposes</b> a single fuzzy question — "how productive is this machine?" — into three precise, multiplicative factors, each capturing a distinct family of loss. <b>Availability</b> = running time / planned production time, hurt by breakdowns and changeovers (down time). <b>Performance</b> = actual output / output at ideal speed, hurt by minor stops and slow running (speed loss). <b>Quality</b> = good parts / total parts, hurt by scrap and rework (quality loss). Their product, OEE = A × P × Q, is the fraction of planned time that produced good product at full speed — a brutally honest number (a "typical" machine often scores far lower than its operators assume). The decomposition is the point: a single OEE tells you <i>how much</i> you are losing; A, P and Q together tell you <i>which kind</i>, which is what you can act on.',
    'Measuring the three factors means sensing three things automatically. <b>Availability</b> needs a truthful run/stop signal and a truthful definition of <b>planned production time</b> (the time the machine was scheduled to run, excluding planned breaks) — from a machine-on input, a cycle sensor, or motor current, logging every stoppage and its duration. <b>Performance</b> needs the <b>output count</b> and the machine\'s <b>ideal cycle time</b> (the fastest it is designed to make one part): actual rate versus ideal rate gives the speed factor, and getting the ideal cycle time right is critical because it anchors the whole Performance number. <b>Quality</b> needs the <b>good/reject</b> split, from a reject-station signal or operator entry. Each is a modest sensing task, but all three are required — OEE with a factor missing or guessed is not OEE.',
    'The classification of loss is where OEE guides action, through the <b>six big losses</b> it is designed to expose: breakdowns and setup/changeover (Availability); minor stops and reduced speed (Performance); startup rejects and production rejects (Quality). By capturing the <b>reason</b> each time the machine stops — a quick operator selection — the tracker attributes downtime to specific causes and ranks them, so improvement effort targets the biggest real loss rather than the loudest complaint. This is the crucial link from measurement to improvement: OEE does not just score you, it tells you which of the six losses to attack first, and the same live numbers then <b>verify</b> whether the fix actually moved the needle.',
    'Finally, the tracker is honest about OEE\'s <b>dependencies and scope</b>. Its accuracy rests entirely on the honesty of its inputs: a wrong ideal cycle time inflates or deflates Performance, a loose definition of planned production time distorts Availability, and inaccurate good/reject counts corrupt Quality — so agreeing and getting these right is as important as the electronics. And OEE measures equipment <i>effectiveness</i>, not the whole business — it does not, by itself, capture demand, cost or whether you should be running the machine at all — so it is a targeting tool within a wider improvement effort, not the sole metric. Built with correct inputs and reason capture, though, an automatic OEE tracker converts a machine\'s raw activity into the standard, decomposable, actionable productivity numbers that show a factory exactly where its output is going and whether it is winning it back.',
  ],
  equations: [
    { t: 'The three factors', eq: 'Availability = Run Time / Planned Production Time\nPerformance  = (Ideal Cycle Time × Total Count) / Run Time\n             = Actual Rate / Ideal Rate\nQuality      = Good Count / Total Count\n\nEach is a fraction 0–1 capturing one loss family.' },
    { t: 'OEE', eq: 'OEE = Availability × Performance × Quality\n\nThe fraction of planned time producing GOOD parts at\nFULL speed. Multiplicative → each factor gates the result.\nWorld-class ~85%; many machines score far lower than assumed.' },
    { t: 'Six big losses (what to attack)', eq: 'Availability: breakdowns, setup/changeover\nPerformance : minor stops, reduced speed\nQuality     : startup rejects, production rejects\n\nCapture the downtime REASON to attribute and rank losses,\nthen fix the biggest and verify OEE improves.' },
  ],

  assembly: [
    { h: 'Wire the three inputs and a reason selector', p: [
      'Connect a clean run/stop signal (Availability), an output counter (Performance), and a good/reject input (Quality), plus operator buttons/keypad to select downtime reasons.',
      'Add an operator display/stack-light for live OEE and state.',
    ] },
    { h: 'Configure the anchors', p: [
      'Set the ideal cycle time and the planned-production-time definition (shift schedule, planned breaks) — agreed with the team, since these anchor the numbers.',
    ], warn: 'A wrong ideal cycle time or a fuzzy planned-time definition invalidates OEE. Get these agreed and correct before trusting the figures.' },
    { h: 'Set up computation and reporting', p: [
      'Compute A/P/Q and OEE live, roll up per shift/batch, rank losses, and report to a dashboard.',
    ] },
  ],
  steps: [
    { h: 'Compute the three factors and OEE', p: [
      'Accumulate run time, total and good counts, and stoppage reasons; compute Availability, Performance and Quality and multiply for OEE.',
    ], code: {
      file: 'oee.ino', lang: 'cpp',
      body: `struct OEE {
  uint32_t plannedS, runS;        // seconds
  uint32_t totalCount, goodCount;
  float idealCycleS;              // ideal seconds per part
};

float availability(const OEE &o){
  return o.plannedS ? (float)o.runS / o.plannedS : 0;
}
float performance(const OEE &o){
  if (!o.runS) return 0;
  float ideal = o.idealCycleS * o.totalCount;   // ideal run time for the count
  return ideal / o.runS;                         // capped at 1 in practice
}
float quality(const OEE &o){
  return o.totalCount ? (float)o.goodCount / o.totalCount : 0;
}
float oee(const OEE &o){
  return availability(o) * performance(o) * quality(o);
}

// Which factor is the biggest loss right now?
const char* biggestLoss(const OEE &o){
  float a=availability(o), p=performance(o), q=quality(o);
  if (a <= p && a <= q) return "Availability (downtime/changeover)";
  if (p <= a && p <= q) return "Performance (slow/minor stops)";
  return "Quality (scrap/rework)";
}`,
      explain: [
        { ref: 'return o.plannedS ? (float)o.runS / o.plannedS : 0', txt: 'Availability is run time over planned production time — the down-time factor, anchored on a correct definition of planned time.' },
        { ref: 'float ideal = o.idealCycleS * o.totalCount', txt: 'Performance compares the ideal run time for the parts made against the actual run time, capturing speed loss — and depends on a correct ideal cycle time.' },
        { ref: 'return o.totalCount ? (float)o.goodCount / o.totalCount : 0', txt: 'Quality is the good-part fraction, the scrap/rework factor.' },
        { ref: 'return availability(o) * performance(o) * quality(o)', txt: 'OEE multiplies the three, so a weakness in any one factor gates the whole result — which is exactly why the decomposition is so informative.' },
        { ref: 'const char* biggestLoss(const OEE &o)', txt: 'Identifying which factor is lowest points improvement effort at the family of loss that is actually costing the most output.' },
      ],
    } },
    { h: 'Capture reasons, rank losses, report', p: [
      'On each stop, capture the reason; aggregate downtime by cause into the six big losses, rank them, show live OEE on the andon, and report per shift/batch — using before/after to verify fixes.',
    ], tip: 'Make reason selection a one-touch operator action — if it is hard, reasons go uncaptured and OEE loses its diagnostic power.' },
  ],

  code: [{
    file: 'oee-tracker.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   OEE Productivity Tracker — ESP32

   Logs run/stop (Availability), output vs ideal (Performance), and
   good/reject (Quality) to compute OEE live, captures downtime reasons
   (six big losses), and reports per shift/batch to a dashboard.
   OEE = Availability x Performance x Quality.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Preferences.h>

#define PIN_RUN   34      // machine running (HIGH = running)
#define PIN_COUNT 27      // output pulse
#define PIN_GOOD  26      // good part (else counted as reject)
#define IDEAL_CYCLE_S 3.0f
#define SHIFT_S  (8*3600)

Adafruit_SSD1306 oled(128,64,&Wire);
Preferences prefs; WiFiClient net; PubSubClient mqtt(net);

uint32_t runS=0, downS=0, total=0, good=0, shiftStart=0, lastTick=0;
bool running=false; uint32_t stopStart=0;
volatile bool countFlag=false;
void IRAM_ATTR onCount(){ countFlag=true; }

float availability(){ uint32_t planned=runS+downS; return planned? (float)runS/planned:0; }
float performance(){ return runS? (IDEAL_CYCLE_S*total)/runS : 0; }
float quality(){ return total? (float)good/total : 0; }

void setup(){
  Serial.begin(115200);
  pinMode(PIN_RUN,INPUT); pinMode(PIN_COUNT,INPUT_PULLUP); pinMode(PIN_GOOD,INPUT);
  attachInterrupt(PIN_COUNT,onCount,FALLING);
  Wire.begin(21,22); oled.begin(SSD1306_SWITCHCAPVCC,0x3C);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  shiftStart=millis(); lastTick=millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("oee-1");
  mqtt.loop();
  uint32_t now=millis();
  uint32_t dt=(now-lastTick)/1000; if(dt){ lastTick+=dt*1000; }

  bool isRunning = digitalRead(PIN_RUN)==HIGH;
  if (isRunning) runS+=dt; else downS+=dt;

  // state transition -> capture stop / reason
  if (running && !isRunning){ stopStart=now; }        // just stopped
  if (!running && isRunning && stopStart){            // just restarted
    uint32_t dur=(now-stopStart)/1000;
    const char* reason = getSelectedReason();         // operator selection
    logDowntime(dur, reason);                          // attribute the loss
    stopStart=0;
  }
  running=isRunning;

  if (countFlag){                                     // an output part
    countFlag=false; total++;
    if (digitalRead(PIN_GOOD)==HIGH) good++;          // else it's a reject
  }

  float a=availability(), p=performance(), q=quality();
  float oee=a*p*q;

  oled.clearDisplay(); oled.setCursor(0,0);
  oled.printf("OEE %.0f%%\\nA %.0f P %.0f Q %.0f\\n%s",
    oee*100, a*100, p*100, q*100, isRunning?"RUN":"DOWN");
  oled.display();

  char m[220];
  snprintf(m,sizeof m,
    "{\\"oee\\":%.3f,\\"a\\":%.3f,\\"p\\":%.3f,\\"q\\":%.3f,"
    "\\"total\\":%u,\\"good\\":%u,\\"run\\":%s}",
    oee,a,p,q,total,good, isRunning?"true":"false");
  mqtt.publish("oee/machine1/live", m);

  // shift rollup
  if (now-shiftStart >= SHIFT_S*1000UL){
    mqtt.publish("oee/machine1/shift", m);
    runS=downS=total=good=0; shiftStart=now;          // reset for next shift
  }
  delay(1000);
}`,
    explain: [
      { ref: 'if (isRunning) runS+=dt; else downS+=dt', txt: 'Every second is attributed to run or down time, building the Availability numerator/denominator from a truthful run/stop signal.' },
      { ref: 'logDowntime(dur, reason)', txt: 'When the machine restarts, the stoppage duration and the operator-selected reason are logged, attributing the loss to one of the six big losses.' },
      { ref: 'if (digitalRead(PIN_GOOD)==HIGH) good++;', txt: 'Each output part is counted as good or reject, feeding the Quality factor.' },
      { ref: 'float oee=a*p*q', txt: 'OEE is the product of the three factors, computed live so the andon and dashboard always show the current effectiveness.' },
      { ref: 'runS=downS=total=good=0; shiftStart=now', txt: 'At shift end the totals roll up and reset, giving clean per-shift OEE for reporting and comparison.' },
    ],
  }],

  config: [
    'Set the ideal cycle time and the planned-production-time/shift definition (agreed with the team).',
    'Configure the run/stop, output and good/reject inputs and the downtime-reason list (six big losses).',
    'Set shift/batch boundaries and the andon/dashboard reporting.',
    'Decide how good/reject is determined (reject station vs operator entry).',
  ],
  calibration: [
    { h: 'Ideal cycle time', p: [
      'Confirm the machine\'s true ideal cycle time (fastest sustainable per-part time); it anchors Performance.',
    ] },
    { h: 'Planned time', p: [
      'Agree what counts as planned production time (schedule minus planned breaks) so Availability is meaningful.',
    ] },
    { h: 'Counts', p: [
      'Verify output and good/reject counts against a manual check so Performance and Quality are accurate.',
    ] },
  ],
  testing: [
    { step: 'Run at ideal speed, all good', expect: 'A, P, Q and OEE near 100%' },
    { step: 'Introduce a stoppage', expect: 'Availability drops; downtime logged with reason' },
    { step: 'Run slow / minor stops', expect: 'Performance drops' },
    { step: 'Produce rejects', expect: 'Quality drops' },
    { step: 'End a shift', expect: 'Per-shift OEE rolled up and reset' },
    { step: 'Apply a fix and compare', expect: 'OEE change verifies whether the fix worked' },
  ],
  output: [
    'The andon shows live OEE and A/P/Q; the dashboard trends OEE per shift/batch, ranks downtime reasons (six big losses), and compares before/after.',
    { file: 'oee.json', lang: 'json', body: `{
  "oee": 0.62,
  "a": 0.82,
  "p": 0.86,
  "q": 0.88,
  "total": 1240,
  "good": 1091,
  "run": true
}` },
    'An OEE of 62% with A/P/Q of 82/86/88 shows Availability is the biggest loss here — so the ranked downtime reasons point straight at the breakdowns/changeovers to attack first.',
  ],
  troubleshoot: [
    { sym: 'OEE looks implausible', cause: 'Wrong ideal cycle time or planned time', fix: 'Agree and set the correct ideal cycle time and planned-production-time definition' },
    { sym: 'Losses not attributable', cause: 'Downtime reasons not captured', fix: 'Make reason selection one-touch; require a reason on restart' },
    { sym: 'Performance > 100%', cause: 'Ideal cycle time set too slow', fix: 'Correct the ideal cycle time to the true fastest rate' },
    { sym: 'Quality wrong', cause: 'Good/reject miscounted', fix: 'Verify the good/reject input against a manual count' },
    { sym: 'Availability distorted', cause: 'Planned time includes/excludes wrong periods', fix: 'Define planned production time consistently (exclude planned breaks)' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → OEE dashboard/MES',
    net: {
      nodes: [{ name: 'OEE tracker', sub: 'ESP32' }, { name: 'Other machines', sub: 'per-machine' }],
      protocol: 'Wi-Fi 2.4 GHz', gateway: 'Router', gatewaySub: 'to MQTT',
      uplink: 'MQTT 1883', cloud: 'OEE dashboard/MES', cloudSub: 'A/P/Q + losses',
      clients: [{ name: 'Dashboard', sub: 'OEE trends' }, { name: 'Andon', sub: 'live OEE' }],
    },
    protocol: ['Live OEE and A/P/Q publish continuously; shift/batch rollups and downtime-with-reason publish at boundaries and on events, feeding loss ranking.'],
    topics: [
      { t: 'oee/machine1/live', dir: 'node → dashboard', payload: 'OEE, A, P, Q, counts, run state' },
      { t: 'oee/machine1/downtime', dir: 'node → dashboard', payload: 'stoppage duration + reason' },
      { t: 'oee/machine1/shift', dir: 'node → MES', payload: 'per-shift/batch OEE rollup' },
    ],
    cloud: ['A dashboard/MES trends OEE and its factors per machine/shift/batch, ranks the six big losses, and supports before/after verification of improvements.'],
    dashboard: ['Live OEE and A/P/Q per machine, a Pareto of downtime reasons, shift/batch trends, and improvement comparisons.'],
    mobile: ['Alerts on prolonged downtime or a significant OEE drop; shift summaries.'],
    security: [
      'Authenticate nodes so productivity data is trustworthy.',
      'Agree input definitions (ideal cycle time, planned time) so numbers are comparable.',
      'Alert on tracker silence so a machine goes not-unmonitored.',
    ],
  },

  perf: [
    'Accumulate time and counts at 1 Hz; OEE does not need high-rate sampling.',
    'Debounce the output counter and use interrupts for accurate counts.',
    'Roll up per shift/batch and report live plus on events.',
    'Keep reason capture one-touch so it actually happens.',
  ],
  safety: [
    'Sense machine signals safely and without interfering with machine control.',
    'OEE is only as good as its inputs — agree the ideal cycle time and planned-time definition, and keep counts accurate.',
    'Use OEE to target losses, not to blame operators; capture reasons constructively.',
    'OEE measures effectiveness, not the whole business — keep it in context.',
  ],
  maintenance: [
    'Re-verify ideal cycle time and planned-time definitions after process changes.',
    'Check count/quality inputs against manual counts periodically.',
    'Keep the downtime-reason list meaningful and current.',
    'Review loss rankings and confirm improvements with before/after OEE.',
  ],
  future: [
    'Auto-classify downtime causes from signals to reduce manual reason entry.',
    'Integrate with MES/ERP for scheduling-aware OEE and TEEP.',
    'Add micro-stop detection for finer Performance analysis.',
    'Benchmark OEE across machines/lines and shifts.',
  ],
  faq: [
    { q: 'What exactly is OEE?', a: 'Overall Equipment Effectiveness = Availability × Performance × Quality — the fraction of planned time that produced good parts at full speed. One number for how productive a machine is, and three factors for which kind of loss is hurting it.' },
    { q: 'Why decompose into three factors?', a: 'Because the fix differs by factor: low Availability means downtime/changeovers, low Performance means slow running/minor stops, low Quality means scrap. The decomposition tells you which loss to attack.' },
    { q: 'What are the "six big losses"?', a: 'Breakdowns and setup/changeover (Availability), minor stops and reduced speed (Performance), and startup and production rejects (Quality). Capturing downtime reasons attributes losses to these so you target the biggest.' },
    { q: 'Why must the ideal cycle time be right?', a: 'It anchors Performance. If it is wrong, Performance (and OEE) is meaningless — too slow an ideal makes Performance exceed 100%, too fast under-reports it. Agree the true fastest rate.' },
    { q: 'Is OEE the only metric I need?', a: 'No — it measures equipment effectiveness, not demand, cost or whether you should run the machine at all. It is a powerful targeting tool within a wider improvement effort, not the whole picture.' },
  ],
  refs: [
    { t: 'Overall Equipment Effectiveness (OEE)', u: 'https://en.wikipedia.org/wiki/Overall_equipment_effectiveness', s: 'Reference' },
    { t: 'The six big losses', u: 'https://www.oee.com/oee-six-big-losses/', s: 'Reference' },
    { t: 'Total Productive Maintenance (TPM)', u: 'https://en.wikipedia.org/wiki/Total_productive_maintenance', s: 'Reference' },
    { t: 'Lean manufacturing and continuous improvement', u: 'https://en.wikipedia.org/wiki/Lean_manufacturing', s: 'Reference' },
    { t: 'Andon (visual management)', u: 'https://en.wikipedia.org/wiki/Andon_(manufacturing)', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'grafana'],
  imageCaptions: [
    'OEE turns a vague sense of productivity into three precise factors that show where output is lost.',
    'ESP32 module logging run/stop, output and good/reject to compute OEE live.',
    'A dashboard ranks the six big losses and verifies whether improvements raised OEE.',
  ],
},

];
