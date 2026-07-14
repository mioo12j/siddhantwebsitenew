/* ============================================================
   One-off enrichment script — adds slug / url / level / domains
   to every entry in projects/projects-data.js, in place, while
   preserving the file's existing line-per-entry formatting,
   comments and blank-line groupings.
   Run:  node "projects/_build/enrich-data.js"
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DATA_FILE = path.resolve(__dirname, '..', 'projects-data.js');
const src = fs.readFileSync(DATA_FILE, 'utf8');

// ---- slug helper -------------------------------------------------
function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[’'"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// ---- level (Beginner / Intermediate / Advanced) -------------------
const IOT_LEVEL_DEFAULT = {
  'Smart Home': 'Beginner',
  'Health & Wearables': 'Intermediate',
  'Agriculture': 'Intermediate',
  'Environment': 'Intermediate',
  'Security': 'Intermediate',
  'Industrial': 'Advanced',
  'Energy': 'Intermediate',
  'Smart City': 'Advanced',
  'Automotive': 'Advanced',
  'Robotics': 'Advanced',
  'Retail': 'Beginner'
};
const AI_LEVEL_DEFAULT = 'Advanced';
const AI_INTERMEDIATE_OVERRIDES = new Set([
  'A10', // Sentiment Analysis Engine
  'A13', // Abstractive Text Summarizer
  'A18', // Music Genre Classifier
  'A08', // Handwriting & OCR Engine
  'A22'  // Recommendation Engine
]);
// A handful of IoT beginner->intermediate / intermediate->beginner nudges for variety
const IOT_LEVEL_OVERRIDES = {
  '013': 'Intermediate', // Smart Mirror (display+API integration)
  '009': 'Intermediate', // Smart Lighting Mesh (mesh networking)
  '051': 'Beginner',     // RFID Access Control (classic starter build)
  '055': 'Beginner',     // Door/Window Breach Alarm
  '100': 'Beginner'      // NFC Smart Attendance
};

function levelFor(p, isAI) {
  if (isAI) return AI_INTERMEDIATE_OVERRIDES.has(p.no) ? 'Intermediate' : AI_LEVEL_DEFAULT;
  if (IOT_LEVEL_OVERRIDES[p.no]) return IOT_LEVEL_OVERRIDES[p.no];
  return IOT_LEVEL_DEFAULT[p.cat] || 'Intermediate';
}

// ---- domains (cross-cutting category-page taxonomy) ---------------
function domainsFor(p, isAI) {
  const tagText = (p.tags || []).join(' ').toLowerCase();
  const text = (p.title + ' ' + p.desc).toLowerCase();
  const domains = [];

  if (isAI) {
    domains.push('AI');
    if (p.cat === 'Robotics & Autonomy') domains.push('Robotics');
    if (/vision|camera|face|plate|ocr|pose|sign language|leaf|crop disease/.test(text) || /vision|cnn|yolo/.test(tagText)) {
      domains.push('RaspberryPi', 'Electronics');
    }
    if (/robot|drone|autonomous|lane-keeping/.test(text)) {
      domains.push('RaspberryPi', 'Robotics', 'Electronics');
    }
    if (p.cat === 'Edge AI') domains.push('RaspberryPi', 'Electronics');
    return [...new Set(domains)];
  }

  // IoT
  domains.push('IoT', 'Electronics');
  if (p.cat === 'Robotics') domains.push('Robotics');
  if (/camera|vision|anpr/.test(tagText)) {
    domains.push('RaspberryPi');
  } else if (/wifi|app|cloud|ble|mqtt|dashboard|nfc|telemetry|edge/.test(tagText)) {
    domains.push('ESP32');
  } else {
    domains.push('Arduino');
  }
  if (/automat|scheduler|auto-shutoff|controller|optimizer/.test(text) || /automation/.test(tagText)) {
    domains.push('Automation');
  }
  if (/solar|renewable/.test(text + ' ' + tagText)) {
    domains.push('RenewableEnergy');
  }
  return [...new Set(domains)];
}

// ---- load current data for validation / uniqueness checks ---------
const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const seenSlugs = new Set();

// ---- line-by-line rewrite ------------------------------------------
const lines = src.split('\n');
let currentArray = null; // 'IOT' | 'AI'
let count = 0;

const out = lines.map(line => {
  if (/window\.IOT_PROJECTS\s*=/.test(line)) currentArray = 'IOT';
  if (/window\.AI_PROJECTS\s*=/.test(line)) currentArray = 'AI';

  const m = line.match(/^(\s*)\{no:"([^"]+)".*\}(,?)\s*$/);
  if (!m || !currentArray) return line;

  const [, indent, no, trailingComma] = m;
  const objText = line.trim().replace(/,\s*$/, '');
  let obj;
  try {
    obj = vm.runInNewContext('(' + objText + ')');
  } catch (e) {
    throw new Error('Failed to parse entry line: ' + line + '\n' + e.message);
  }

  const isAI = currentArray === 'AI';
  let slug = obj.no === 'A01' ? 'rover' : slugify(obj.title);
  if (seenSlugs.has(slug)) slug = slug + '-' + obj.no.toLowerCase();
  seenSlugs.add(slug);

  const level = levelFor(obj, isAI);
  const domains = domainsFor(obj, isAI);
  const needsUrl = !obj.url;
  const url = obj.url || ('p/' + slug + '.html');

  let extra = `,slug:"${slug}"`;
  if (needsUrl) extra += `,url:"${url}"`;
  extra += `,level:"${level}",domains:${JSON.stringify(domains)}`;

  // insert extra fields right before the final closing brace
  const lastBrace = objText.lastIndexOf('}');
  const newObjText = objText.slice(0, lastBrace) + extra + objText.slice(lastBrace);
  count++;
  return indent + newObjText + trailingComma;
});

fs.writeFileSync(DATA_FILE, out.join('\n'), 'utf8');
console.log(`✓ Enriched ${count} project entries with slug/url/level/domains.`);
