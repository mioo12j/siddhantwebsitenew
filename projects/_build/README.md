# Project documentation generator

Generates a full documentation page for every project in the catalogue.

```bash
node projects/_build/build.js
```

## What it produces

| Output | Purpose |
| --- | --- |
| `projects/docs/<slug>.html` | One complete build guide per project |
| `projects/docs/index.html` | Searchable documentation portal |
| `projects/projects-data.js` | Slug map appended inside a `docs:start … docs:end` block |
| `sitemap.xml` | Documentation URLs inserted inside a `docs:start … docs:end` block |

Both generated blocks are delimited and rewritten in place, so the build is
idempotent and never duplicates entries.

## Layout

```
_build/
  build.js              entry point — merges catalogue + specs, renders, writes
  lib/
    render.js           page renderer: 26 sections, structured data, chrome
    svg.js              programmatic diagrams (block, flow, wiring, layers,
                        network, pipeline, chart, timing, illustrations)
    db.js               component + library knowledge base, reference images
    highlight.js        build-time syntax highlighting (no runtime JS shipped)
    defaults.js         derives platform-specific defaults from declared parts
  data/*.js             per-project content, grouped by category
```

Runtime assets live one level up: `projects/doc.css` and `projects/doc.js`.

## Adding a project

Create or extend a file in `data/`, exporting an array of specs. Only `id`
(matching the catalogue `no`) is strictly required — everything else either
comes from the catalogue or is derived by `defaults.js`. In practice a good
page needs the fields below.

```js
{
  id: '023',                     // must match projects-data.js `no`
  domainKey: 'iot',              // iot | ai | robotics | electronics → accent colour
  emoji: '🌱', thumb: 'sensor',  // favicon + hero illustration (see svg.js ILLUS)
  difficulty: 'Intermediate',
  hours: '8–12 hours', iso8601: 'PT10H',
  tagline: 'One sentence that says what it does and why it is not trivial.',

  overview:    ['para', 'para', 'para'],
  does:        ['...'], features: ['...'],
  applications:[{ t: 'Setting', d: 'How it is used' }],
  skills:      ['...'],
  prereq:      ['...'],                    // optional callout before the BOM

  parts:      ['esp32', 'bme280', ...],    // keys into db.js COMPONENTS
  qty:        { relay1: 4 },               // optional, defaults to 1
  extraParts: [{ name, spec, qty, price, note }],
  cost:       '₹3,100 – ₹4,000',           // omit to use the summed BOM
  libs:       ['wifi', 'pubsub', ...],     // keys into db.js LIBRARIES

  pins: { left: [{ dev, devPin, pin, sig }], right: [...] },  // → wiring SVG + table
  wiringNotes: ['...'],

  block:  { columns: [{ label, edge, blocks: [{ name, sub, highlight }] }] },
  flow:   [{ t: 'step', k: 'start|proc|io|dec|end', yes, no, back }],
  layers: [{ name, items: [...] }],        // omit to derive from parts

  principle:  ['para', ...],
  equations:  [{ t: 'title', eq: 'worked maths', d: 'what it means' }],

  assembly:   [{ h, p: ['...'], warn }],
  steps:      [{ h, p: ['...'], code: {...}, tip }],
  code:       [{ file, lang, body, explain: [{ ref, txt }] }],

  config: ['...'],
  calibration: [{ h, p: ['...'] }],
  testing: [{ step, expect }],
  output:  ['prose', { file, lang, body }],
  troubleshoot: [{ sym, cause, fix }],

  // Optional domain blocks — each renders an extra section
  iot:         { protoShort, net, protocol, topics, cloud, dashboard, mobile, security },
  ai:          { dataset, datasetTable, preprocess, pipeline, arch, archTable,
                 hyper, training, metrics, chart, deploy, inference, limits },
  robotics:    { mechanical, motion, motionTable, sensors, actuators, kinematics },
  electronics: { pcb, calcs, ratings, pinout },

  perf: ['...'], safety: ['...'], maintenance: ['...'], future: ['...'],
  faq:  [{ q, a }],
  refs: [{ t, u, s }],
  images: ['esp32', 'relay', 'grafana'],   // keys into db.js IMAGES
  imageCaptions: ['...', '...', '...'],
}
```

`defaults.js` fills in the development environment, architecture layers,
performance tips, safety notes, maintenance, common troubleshooting and future
work from the declared platform and parts, so those sections are never empty
and are still specific to the build. Anything written by hand always wins.

## Adding a component or library

Extend `COMPONENTS` or `LIBRARIES` in `lib/db.js`. Components drive the bill of
materials, hardware specification table, power budget and datasheet links, so
the `price`, `current_mA`, `volts`, `iface` and `datasheet` fields all matter.

## Reference images

`IMAGES` in `db.js` maps a key to a Wikimedia Commons file, served through
`Special:FilePath`. Every embedded photograph carries a link to its source file
page, and each one has an inline SVG fallback that replaces it automatically if
the image fails to load — so a page never shows a broken image.

**These URLs were not verified from the build environment** (outbound access to
`upload.wikimedia.org` is blocked by the network policy here). Check them from a
browser before publishing, and correct any filename that 404s — the fallback
means a wrong filename degrades to a diagram rather than breaking the page.

## Verifying a build

```bash
node projects/_build/build.js
# then, with playwright-core available:
#   - check for horizontal overflow at 390 px
#   - confirm the TOC, find bar, copy buttons and theme toggle work
#   - confirm every internal link resolves
```
