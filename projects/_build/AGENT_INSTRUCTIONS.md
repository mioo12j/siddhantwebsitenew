# Content-authoring instructions — Projects knowledge portal

You are writing educational engineering-project content for a personal portfolio site
(siddhantkumar.in). The site is a hand-authored static HTML site. A generator
(`projects/_build/build.js`) turns a per-project JS data file into a full,
professionally designed report-style HTML page (nav, hero, tables, diagrams, FAQ
accordion, etc. — the visual template is already built and does not need to change).

**Your job**: for each project assigned to you, write one file at
`projects/_build/content/<slug>.js` that exports a JS object with the fields listed
below. Do not touch any other files. Do not modify `build.js`, `projects-data.js`,
or any HTML file.

## Reference example (read this first)

Read `/home/user/siddhantwebsitenew/projects/_build/content/smart-door-lock.js` in
full — it is the golden-standard example, already reviewed and rendering correctly.
Match its depth, structure, and tone exactly. Every field it uses, you should use.

## Reference data

- `/home/user/siddhantwebsitenew/projects/_build/all-projects-index.json` — all 125
  project slugs/titles/categories in the catalogue. Use this to pick real, valid
  `relatedSlugs` (3–5 per project, same or adjacent category/domain). **Never invent
  a slug that isn't in this list.** Rover's slug is `"rover"` and its final URL is
  `rover.html` (not `p/rover.html`) — the generator already special-cases this, so
  just use `"rover"` as the slug like any other if it's genuinely relevant (e.g. for
  robotics projects).
- Your batch file (path given to you separately) lists the exact projects assigned to
  you, each with `{no, slug, cat, title, desc, tags, level, domains}` already decided
  — use these exactly as given (don't rename, don't change level/category).

## Writing approach — critical

Do not fabricate specific unverifiable claims (exact benchmark numbers from a "real"
build, named test results, etc.). Instead: **research the standard, generally-accepted
engineering approach** for building this type of project — the components a real
engineer/hobbyist would actually use (real chip names like ESP32/Arduino Uno/Raspberry
Pi, real sensor part numbers like DHT22, MQ-2, HC-SR04, MFRC522, real library names,
real protocols like MQTT/BLE/I2C/SPI), and write a genuine, technically accurate
implementation guide grounded in how these projects are actually built in practice.
Where a specific number (e.g. exact cost, exact accuracy) can't be a verified fact,
present it as a realistic estimate/typical range, phrased that way ("typically
costs...", "commonly achieves...") rather than as a measured result from a specific
build. This should read like a well-researched tutorial/reference guide, not a diary
of a real completed project — because most of these 125 projects are concepts in a
catalogue, not built devices.

Vary your prose across projects — don't reuse the same sentence templates for every
one of your 4–5 assigned projects. Each should feel individually written.

## JS syntax rule — avoid apostrophe bugs

**Use backtick template-literal strings (`` ` ``) for every prose text field**
(paragraphs, list items, troubleshooting/FAQ text, references) — this avoids bugs
from unescaped apostrophes like "device's" or "it's". Only use plain `'...'` or
`"..."` for short enum-like values (names, units, quantities, currency numbers).

## Required fields (module.exports = { ... })

```
metaTitle          string — unique, ~55-65 chars, format "X Project — Y | Siddhant Kumar" or similar
metaDescription    string — unique, ~150-160 chars, compelling and specific
keywords           string — comma-separated natural keywords (no stuffing)
h1                 string — usually just the project title (can omit; falls back to title)
overview           string — 1-2 sentence hero subtitle (backtick)

introduction       array of 2 paragraph strings
objectives         array of 4-6 short strings (bulleted list)

problemStatement    array of 1-2 paragraph strings
applications         array of 4-6 short strings
useCases             array of 2-3 paragraph strings (concrete scenarios/vignettes)

workingPrinciple     array of 1-2 paragraph strings
systemArchitecture   array of 1 paragraph string (describe the layers/stages)
designMethodology    array of 1 paragraph string
hardwareArchitecture array of 1 paragraph string
softwareArchitecture array of 1 paragraph string

components  array of {name, qty, note}  — 6-10 items, "Components Required" list
bom         array of {item, qty, specNote, estCostINR} — Bill of Materials, realistic
            India retail pricing in plain numbers (e.g. "450", "1,200"), 6-9 rows
specifications array of {name, detail} — 4-6 key technical specs
estimatedCost  {low, high, note} — plain numbers as strings e.g. {low:"1,800",high:"2,400",note:"..."}

tools      array of 4-6 strings
software   array of 2-4 strings
languages  array of 1-3 strings
ide        array of 1-2 strings
libraries  array of 4-7 strings (real library names, use <code>libName</code> inline)
protocols  array of 2-5 strings

power   array of 1 paragraph string
wiring  array of 1-2 paragraph strings (concrete pin-level description)

assembly        array of 4-6 short step strings
implementation  array of 5-8 short step strings (step-by-step build guide)
codingMethodology array of 1 paragraph string
algorithm         array of 1 paragraph string (describe the control/decision logic)

testing      array of 1 paragraph string
calibration  array of 1 paragraph string (if genuinely not applicable, say so briefly
             rather than omitting — e.g. "This build has no analog sensor requiring
             calibration; the main adjustment is ...")
sampleOutput array of 1 paragraph string (describe what a Serial monitor / dashboard
             / output would typically show)
expectedResults array of 3-5 short strings

troubleshooting array of {issue, fix} — 4-6 rows, realistic common problems
commonMistakes  array of 4-6 strings
safety          array of 4-6 strings

performance  array of 1 paragraph string
advantages   array of 4-6 strings
limitations  array of 3-5 strings
future       array of 4-6 strings

faqs  array of {q, a} — 5 items, genuinely useful questions

conclusion  array of 1 paragraph string
references  array of 3-5 strings (general standards/datasheets/docs — e.g.
            "Espressif ESP32 Technical Reference Manual", "Arduino official Wire
            library documentation" — not fake URLs to nonexistent specific articles)
relatedSlugs array of 3-5 valid slugs from all-projects-index.json
```

## After writing each file

Run `node -e "require('/home/user/siddhantwebsitenew/projects/_build/content/<slug>.js')"`
to confirm it parses with no syntax errors. Fix any errors before moving to the next
project. When all your assigned projects are done, reply with a short list of the
slugs you completed and confirm each passed the node syntax check.
