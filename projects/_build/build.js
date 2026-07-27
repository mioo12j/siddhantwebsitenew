#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   build.js — generates every project documentation page.

     node projects/_build/build.js

   Outputs
     projects/docs/<slug>.html      one page per project
     projects/docs/index.html       documentation portal
     projects/docs-map.js           slug lookup consumed by projects.js
     sitemap.xml                    regenerated with the new URLs
════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const { renderPage, bomTotal, inr } = require('./lib/render');
const { normalise } = require('./lib/defaults');
const { esc } = require('./lib/highlight');

const ROOT = path.resolve(__dirname, '..', '..');
const PROJ = path.join(ROOT, 'projects');
const OUT = path.join(PROJ, 'docs');
const SITE = 'https://siddhantkumar.in';

/* ── load the shared catalogue (plain browser globals) ─────────── */
function loadCatalogue() {
  const src = fs.readFileSync(path.join(PROJ, 'projects-data.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.window;
}

/* ── load every documentation data module ──────────────────────── */
function loadDocs() {
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.js'))
    .sort()
    .flatMap(f => {
      const mod = require(path.join(dir, f));
      return Array.isArray(mod) ? mod : (mod.projects || []);
    });
}

const slugify = (s) => String(s).toLowerCase()
  .replace(/&/g, ' and ').replace(/\+/g, ' plus ')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const catSlug = (c) => slugify(c);

/* accent palette per top-level domain */
const ACCENTS = {
  iot: { c: '#22d3ee', l: '#67e8f9', rgb: '34,211,238' },
  ai: { c: '#818cf8', l: '#a5b4fc', rgb: '129,140,248' },
  robotics: { c: '#34d399', l: '#6ee7b7', rgb: '52,211,153' },
  electronics: { c: '#fbbf24', l: '#fcd34d', rgb: '251,191,36' },
};

function main() {
  const cat = loadCatalogue();
  const all = cat.ALL_PROJECTS || [];
  const byNo = new Map(all.map(p => [p.no, p]));

  const docs = loadDocs();
  const seenSlug = new Set();
  const missing = [];

  /* merge catalogue metadata into each documentation spec */
  const specs = docs.map(d => {
    const base = byNo.get(d.id) || {};
    const merged = Object.assign({}, base, d, {
      no: d.id,
      title: d.title || base.title,
      cat: d.cat || base.cat,
      desc: base.desc || d.tagline,
      tags: d.tags || base.tags || [],
    });
    merged.slug = merged.slug || slugify(merged.title);
    if (seenSlug.has(merged.slug)) throw new Error('Duplicate slug: ' + merged.slug);
    seenSlug.add(merged.slug);
    if (!byNo.has(d.id)) missing.push(d.id);
    return normalise(merged);
  });

  /* keep catalogue order (IoT 001-100, then AI A01-A25) */
  const order = new Map(all.map((p, i) => [p.no, i]));
  specs.sort((a, b) => (order.get(a.no) ?? 999) - (order.get(b.no) ?? 999));

  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const now = new Date();
  const modified = now.toISOString().slice(0, 10);
  const modifiedLabel = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const published = '2026-02-14';

  /* ── render each page ────────────────────────────────────────── */
  specs.forEach((spec, i) => {
    const sameCat = specs.filter(s => s.cat === spec.cat && s.slug !== spec.slug);
    const others = specs.filter(s => s.cat !== spec.cat && s.domainKey === spec.domainKey && s.slug !== spec.slug);
    const related = sameCat.slice(0, 3)
      .concat(others.slice(0, Math.max(0, 3 - sameCat.length)))
      .slice(0, 3)
      .map(s => ({ slug: s.slug, title: s.title, cat: s.cat, desc: s.desc || s.tagline.replace(/<[^>]+>/g, '').slice(0, 120) }));

    const html = renderPage(spec, {
      prev: specs[i - 1] ? { slug: specs[i - 1].slug, title: specs[i - 1].title } : null,
      next: specs[i + 1] ? { slug: specs[i + 1].slug, title: specs[i + 1].title } : null,
      related,
      accent: ACCENTS[spec.domainKey || 'iot'] || ACCENTS.iot,
      catSlug: catSlug(spec.cat),
      published, modified, modifiedLabel,
      total: all.length,
    });
    fs.writeFileSync(path.join(OUT, spec.slug + '.html'), html);
  });

  /* ── documentation portal ────────────────────────────────────── */
  fs.writeFileSync(path.join(OUT, 'index.html'), renderIndex(specs, all, { modified, modifiedLabel }));

  /* ── slug map for the project grid ───────────────────────────── */
  const map = {};
  specs.forEach(s => { map[s.no] = s.slug; });
  writeDocsMap(map);

  /* ── sitemap ─────────────────────────────────────────────────── */
  writeSitemap(specs, modified);

  console.log(`✓ ${specs.length} documentation pages written to projects/docs/`);
  console.log(`✓ docs-map.js covers ${Object.keys(map).length} of ${all.length} catalogue entries`);
  const undocumented = all.filter(p => !map[p.no]);
  if (undocumented.length) {
    console.log(`… ${undocumented.length} still undocumented: ${undocumented.slice(0, 10).map(p => p.no).join(', ')}${undocumented.length > 10 ? ' …' : ''}`);
  }
  if (missing.length) console.log(`! doc ids not present in the catalogue: ${missing.join(', ')}`);
}

/* ── documentation portal page ─────────────────────────────────── */
function renderIndex(specs, all, ctx) {
  const cats = [];
  specs.forEach(s => { if (!cats.includes(s.cat)) cats.push(s.cat); });

  const groups = cats.map(c => ({
    cat: c, slug: catSlug(c),
    items: specs.filter(s => s.cat === c),
  }));

  const totalCost = specs.reduce((n, s) => n + bomTotal(s), 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Project Documentation Library — ${specs.length} Full Build Guides | Siddhant Kumar</title>
  <meta name="description" content="A searchable documentation library of ${specs.length} engineering build guides — IoT, AI, robotics and electronics. Every guide carries a bill of materials, wiring diagram, working principle, complete annotated source code, testing procedure and troubleshooting." />
  <meta name="keywords" content="project documentation, IoT project guides, AI project tutorials, robotics build guides, electronics projects, Arduino, ESP32, Raspberry Pi, source code, circuit diagram" />
  <meta name="author" content="Siddhant Kumar" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="theme-color" content="#060c1a" />
  <link rel="canonical" href="${SITE}/projects/docs/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE}/projects/docs/" />
  <meta property="og:title" content="Project Documentation Library — ${specs.length} Full Build Guides" />
  <meta property="og:description" content="Bill of materials, circuit diagrams, complete source code and troubleshooting for every project." />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" /></noscript>
  <link rel="stylesheet" href="../doc.css" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='14' fill='%23060c1a'/><text x='50' y='68' text-anchor='middle' font-size='50'>📚</text></svg>" />
  <script>(function(){try{var t=localStorage.getItem('sk-doc-theme');
    if(!t)t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
    if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();</script>
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Project Documentation Library',
    url: SITE + '/projects/docs/',
    description: `Documentation library of ${specs.length} engineering build guides across IoT, AI, robotics and electronics.`,
    author: { '@type': 'Person', name: 'Siddhant Kumar', url: SITE + '/' },
    hasPart: specs.map(s => ({ '@type': 'TechArticle', name: s.title, url: `${SITE}/projects/docs/${s.slug}.html` })),
  })}</script>
</head>
<body>
<a href="#main" class="skip-link">Skip to content</a>
<div id="readprog" aria-hidden="true"></div>

<header class="docnav">
  <div class="docnav-in">
    <a href="../../index.html" class="brand"><span class="mono" aria-hidden="true">SK</span><span>Siddhant Kumar</span></a>
    <ul class="docnav-links">
      <li><a href="../index.html">All Projects</a></li>
      <li><a href="../iot.html">IoT</a></li>
      <li><a href="../ai.html">AI &amp; Advanced</a></li>
      <li><a href="../../journal/index.html">Journal</a></li>
    </ul>
    <div class="docnav-tools">
      <button class="icon-btn" id="themeToggle" type="button" aria-label="Switch colour theme" title="Toggle light / dark">
        <svg class="t-light" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <svg class="t-dark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>
</header>

<main id="main">
  <div class="doc-hero">
    <div class="doc-hero-in">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="../../index.html">Home</a><span class="sep">/</span>
        <a href="../index.html">Projects</a><span class="sep">/</span>
        <span aria-current="page">Documentation</span>
      </nav>
      <span class="kicker">Documentation Library</span>
      <h1>Every project, <span class="grad">documented properly</span></h1>
      <p class="tagline">Not a gallery of cards — a working reference. Each guide carries a costed bill of materials,
        a wiring schematic, the working principle, complete annotated source code, a calibration and testing procedure,
        and the troubleshooting notes you actually need at 1 a.m. when it will not boot.</p>
      <div class="infopanel">
        <dl>
          <div class="infocell"><dt>Documented builds</dt><dd>${specs.length}</dd></div>
          <div class="infocell"><dt>Catalogue size</dt><dd>${all.length} projects</dd></div>
          <div class="infocell"><dt>Categories</dt><dd>${cats.length}</dd></div>
          <div class="infocell"><dt>Total parts value</dt><dd>${inr(totalCost)}</dd></div>
          <div class="infocell"><dt>Last built</dt><dd>${esc(ctx.modifiedLabel)}</dd></div>
        </dl>
      </div>
      <div class="toc-search" style="max-width:440px;margin-top:1.4rem">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.6-3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <input type="search" id="docSearch" placeholder="Search all guides — try &ldquo;solar&rdquo;, &ldquo;MQTT&rdquo;, &ldquo;YOLO&rdquo;…" aria-label="Search documentation" />
      </div>
      <p id="docCount" class="tagline" style="margin-top:.7rem;font-size:.85rem">${specs.length} guides</p>
    </div>
  </div>

  <div class="container" style="padding:2.4rem 0 3rem">
    ${groups.map(g => `<section id="${g.slug}" class="docgroup" style="margin-bottom:2.6rem">
      <h2 style="font-family:var(--f-display);font-size:1.5rem;margin-bottom:.2rem">${esc(g.cat)}</h2>
      <p style="color:var(--fg-mute);font-size:.85rem;margin-bottom:1rem">${g.items.length} guide${g.items.length === 1 ? '' : 's'}</p>
      <div class="relgrid">
        ${g.items.map(s => `<a class="relcard doc-item" href="${s.slug}.html"
          data-search="${esc((s.title + ' ' + s.cat + ' ' + (s.tags || []).join(' ') + ' ' + (s.keywords || []).join(' ')).toLowerCase())}">
          <span class="rc">${esc(s.no)} · ${esc(s.difficulty)}</span>
          <h4>${esc(s.title)}</h4>
          <p>${esc((s.desc || '').slice(0, 118))}</p>
        </a>`).join('')}
      </div>
    </section>`).join('')}
    <p id="noResults" style="display:none;color:var(--fg-mute)">No guide matches that search. Try a component name, a protocol, or a category.</p>
  </div>
</main>

<footer class="doc-footer">
  <div class="container">
    <div class="mono" aria-hidden="true">SK</div>
    <p><strong>Project Documentation Library</strong> — ${specs.length} full build guides by Siddhant Kumar.</p>
    <nav class="footer-nav" aria-label="Footer navigation">
      <a href="../../index.html">Portfolio</a><a href="../index.html">All Projects</a>
      <a href="../iot.html">IoT</a><a href="../ai.html">AI &amp; Advanced</a>
      <a href="../../journal/index.html">Journal</a><a href="../../index.html#contact">Contact</a>
    </nav>
    <p>&copy; <span class="yr">2026</span> Siddhant Kumar. Documentation published for educational use.</p>
  </div>
</footer>

<script src="../doc.js" defer></script>
<script>
(function(){
  var input=document.getElementById('docSearch');
  if(!input)return;
  var items=[].slice.call(document.querySelectorAll('.doc-item'));
  var groups=[].slice.call(document.querySelectorAll('.docgroup'));
  var count=document.getElementById('docCount');
  var none=document.getElementById('noResults');
  var t;
  input.addEventListener('input',function(){
    clearTimeout(t);
    t=setTimeout(function(){
      var q=input.value.trim().toLowerCase(),n=0;
      items.forEach(function(el){
        var ok=!q||el.dataset.search.indexOf(q)!==-1;
        el.style.display=ok?'':'none'; if(ok)n++;
      });
      groups.forEach(function(g){
        var vis=g.querySelectorAll('.doc-item:not([style*="none"])').length;
        g.style.display=vis?'':'none';
      });
      count.textContent=n+' guide'+(n===1?'':'s')+(q?' matching “'+input.value.trim()+'”':'');
      none.style.display=n?'none':'block';
    },140);
  });
})();
</script>
</body>
</html>`;
}

/* ── slug map ──────────────────────────────────────────────────────
   Appended to projects-data.js inside a delimited block so the existing
   project pages pick it up with no change to their HTML: they already
   load projects-data.js before projects.js.
─────────────────────────────────────────────────────────────────── */
function writeDocsMap(map) {
  const file = path.join(PROJ, 'projects-data.js');
  let src = fs.readFileSync(file, 'utf8');

  const block = [
    '/* docs:start — generated by projects/_build/build.js, do not edit by hand.',
    '   Maps a catalogue project number to its documentation page slug so that',
    '   projects.js can turn every card into a link to its full build guide. */',
    'window.PROJECT_DOCS = ' + JSON.stringify(map) + ';',
    '/* docs:end */',
  ].join('\n') + '\n';

  const re = /\/\* docs:start[\s\S]*?\/\* docs:end \*\/\n?/;
  src = re.test(src) ? src.replace(re, block) : src.replace(/\s*$/, '\n\n') + block;
  fs.writeFileSync(file, src);
}

/* ── sitemap ───────────────────────────────────────────────────── */
function writeSitemap(specs, modified) {
  const file = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(file, 'utf8');

  /* strip any previously generated documentation block, then re-add */
  xml = xml.replace(/\n?\s*<!-- docs:start -->[\s\S]*?<!-- docs:end -->/g, '');

  const entries = ['  <!-- docs:start -->',
    '  <url>',
    `    <loc>${SITE}/projects/docs/</loc>`,
    `    <lastmod>${modified}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.9</priority>',
    '  </url>',
  ];
  specs.forEach(s => {
    entries.push('  <url>',
      `    <loc>${SITE}/projects/docs/${s.slug}.html</loc>`,
      `    <lastmod>${modified}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>');
  });
  entries.push('  <!-- docs:end -->');

  xml = xml.replace(/<\/urlset>/, entries.join('\n') + '\n</urlset>');
  fs.writeFileSync(file, xml);
}

main();
