/* ============================================================
   Category-page generator — Siddhant Kumar / Projects portal
   Reads projects-data.js + categories-data.js, writes each
   projects/categories/<slug>.html plus a categories/index.html hub.
   Run:  node "projects/_build/build-categories.js"
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BUILD_DIR = __dirname;
const PROJ_DIR = path.resolve(BUILD_DIR, '..');
const CAT_DIR = path.join(PROJ_DIR, 'categories');
const SITE = 'https://siddhantkumar.in';

const dataSrc = fs.readFileSync(path.join(PROJ_DIR, 'projects-data.js'), 'utf8');
const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);
const ALL = sandbox.ALL_PROJECTS;

const CATEGORIES = require('./categories-data.js');

const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

function whyGrid(items) {
  return items.map(w => `          <div class="why-card reveal-up"><h4>${esc(w.h4)}</h4><p>${esc(w.p)}</p></div>`).join('\n');
}

function relatedChips(cat) {
  const linkFor = slug => {
    if (slug === 'ai-projects-hub') return { href: '../ai.html', label: 'AI & Advanced' };
    const found = CATEGORIES.find(c => c.slug === slug);
    return found ? { href: found.slug + '.html', label: found.label } : null;
  };
  return cat.related.map(linkFor).filter(Boolean)
    .map(l => `<a href="${l.href}">${esc(l.label)} →</a>`).join('\n          ');
}

function categoryHtml(cat) {
  const url = `${SITE}/projects/categories/${cat.slug}.html`;
  const projects = ALL.filter(cat.filter);
  const introHtml = cat.intro.map(p => `        <p>${p}</p>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(cat.metaTitle)}</title>
  <meta name="title" content="${esc(cat.metaTitle)}" />
  <meta name="description" content="${esc(cat.metaDescription)}" />
  <meta name="keywords" content="${esc(cat.keywords)}" />
  <meta name="author" content="Siddhant Kumar" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="theme-color" content="#0a0f1e" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Siddhant Kumar" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(cat.metaTitle)}" />
  <meta property="og:description" content="${esc(cat.metaDescription)}" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%230a0f1e'/><text x='50' y='70' text-anchor='middle' font-size='52'>${cat.icon}</text></svg>" />
  <link rel="stylesheet" href="../projects.css" />

  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"CollectionPage",
    "name":"${esc(cat.metaTitle)}",
    "url":"${url}",
    "description":"${esc(cat.metaDescription)}",
    "isPartOf":{"@type":"WebSite","name":"Siddhant Kumar","url":"${SITE}/"},
    "author":{"@type":"Person","name":"Siddhant Kumar","url":"${SITE}/"}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Siddhant Kumar","item":"${SITE}/"},
      {"@type":"ListItem","position":2,"name":"Projects","item":"${SITE}/projects/"},
      {"@type":"ListItem","position":3,"name":"Categories","item":"${SITE}/projects/categories/"},
      {"@type":"ListItem","position":4,"name":"${esc(cat.label)}"}
    ]
  }
  </script>
  <style>:root{--acc:#22d3ee;--acc-light:#67e8f9;--acc-rgb:34,211,238}</style>
</head>
<body>

  <a href="#main" class="skip-link">Skip to content</a>
  <div id="cursor" aria-hidden="true"></div>
  <div id="cursor-trail" aria-hidden="true"></div>
  <div id="scroll-progress" aria-hidden="true"></div>

  <header class="topnav" id="topnav">
    <nav class="nav-inner" aria-label="Main navigation">
      <a href="../../index.html" class="brand" aria-label="Back to Siddhant Kumar's portfolio">
        <span class="mono">SK</span><span>Siddhant Kumar</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Toggle menu"><span></span><span></span><span></span></button>
      <ul class="nav-links" id="navMenu">
        <li><a href="../../index.html">Portfolio</a></li>
        <li><a href="../">All Projects</a></li>
        <li><a href="../iot.html">IoT</a></li>
        <li><a href="../ai.html">AI &amp; Advanced</a></li>
        <li><a href="./" class="active" aria-current="page">Categories</a></li>
        <li><a href="../../index.html#contact" class="nav-cta">Work With Me</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <section class="phero">
      <canvas id="bgCanvas" aria-hidden="true"></canvas>
      <div class="container phero-inner">
        <p class="crumbs"><a href="../../index.html">Home</a> / <a href="../">Projects</a> / <a href="./">Categories</a> / ${esc(cat.label)}</p>
        <span class="eyebrow">${esc(cat.eyebrow)}</span>
        <h1>${esc(cat.h1[0])} <span class="grad">${esc(cat.h1[1])}</span></h1>
        <p class="lead">${cat.lead}</p>

        <div class="controls">
          <div class="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <input type="search" id="search" placeholder="Search ${projects.length} ${esc(cat.label).toLowerCase()}…" aria-label="Search ${esc(cat.label)}" />
          </div>
          <span class="count-pill" id="count">${projects.length} / ${projects.length} projects</span>
        </div>
        <div class="filters" id="filters" role="group" aria-label="Filter by category"></div>
      </div>
    </section>

    <section class="proj-section" style="padding-bottom:1rem">
      <div class="container">
        <div class="shead reveal-up">
          <span class="lbl">About This Category</span>
          <h2>Why <em>${esc(cat.label)}</em></h2>
        </div>
        <div class="cat-intro reveal-up">
${introHtml}
        </div>
        <div class="why-grid">
${whyGrid(cat.why)}
        </div>
        <div class="related-cats reveal-up">
          ${relatedChips(cat)}
        </div>
      </div>
    </section>

    <section class="proj-section" style="padding-top:1rem">
      <div class="container">
        <div class="shead reveal-up">
          <span class="lbl">Browse</span>
          <h2>All ${esc(cat.label)}</h2>
        </div>
        <div class="proj-grid" id="grid" aria-live="polite"></div>
      </div>
    </section>

    <section class="proj-section" style="padding-top:0">
      <div class="container">
        <div class="cta-band reveal-up">
          <span class="eyebrow" style="justify-content:center">Explore Further</span>
          <h2>Browse the Full<br/><em>Project Library</em></h2>
          <p>100+ IoT builds and 25+ AI projects, fully documented — or get in touch to collaborate on something new.</p>
          <a class="btn" href="../../index.html#contact"><span>Start a Conversation</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="mono" aria-hidden="true">SK</div>
      <p><strong>${esc(cat.label)}</strong> — part of the Siddhant Kumar engineering project library</p>
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="../../index.html">Portfolio</a>
        <a href="../">All Projects</a>
        <a href="./">Categories</a>
        <a href="../iot.html">IoT</a>
        <a href="../ai.html">AI &amp; Advanced</a>
        <a href="../../index.html#contact">Contact</a>
      </nav>
      <p>&copy; <span id="year">2026</span> Siddhant Kumar. All rights reserved.</p>
    </div>
  </footer>

  <button class="back-to-top" id="backToTop" aria-label="Back to top">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 15V5M6 9l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>

  <script>window.PROJECT_DATA = ${JSON.stringify(projects.map(p => ({ no: p.no, cat: p.cat, title: p.title, desc: p.desc, tags: p.tags, url: '../' + p.url, featured: p.featured || false })))};</script>
  <script src="../projects.js"></script>
</body>
</html>
`;
}

function hubHtml() {
  const url = `${SITE}/projects/categories/`;
  const cards = CATEGORIES.map(cat => {
    const n = ALL.filter(cat.filter).length;
    return `          <a class="hub-card reveal-up" href="${cat.slug}.html">
            <span class="hc-count">${n} projects</span>
            <h3>${cat.icon} ${esc(cat.label)}</h3>
            <p>${esc(cat.eyebrow)}</p>
          </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Project Categories — Arduino, ESP32, Raspberry Pi, AI &amp; More | Siddhant Kumar</title>
  <meta name="title" content="Project Categories — Siddhant Kumar" />
  <meta name="description" content="Browse the engineering project library by category — Arduino, ESP32, Raspberry Pi, IoT, AI, Robotics, Electronics, Automation, Renewable Energy, and by skill level from beginner to final-year." />
  <meta name="keywords" content="Arduino projects, ESP32 projects, Raspberry Pi projects, IoT projects, AI projects, robotics projects, electronics projects, automation projects, beginner projects, final year projects" />
  <meta name="author" content="Siddhant Kumar" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="theme-color" content="#0a0f1e" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Siddhant Kumar" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="Project Categories — Siddhant Kumar" />
  <meta property="og:description" content="Browse 125+ engineering projects by platform, discipline, skill level and audience." />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%230a0f1e'/><text x='50' y='68' text-anchor='middle' font-family='serif' font-size='52' font-weight='700' fill='%2322d3ee'>SK</text></svg>" />
  <link rel="stylesheet" href="../projects.css" />

  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"CollectionPage",
    "name":"Project Categories — Siddhant Kumar",
    "url":"${url}",
    "description":"Browse the engineering project library by platform, discipline, skill level and audience.",
    "isPartOf":{"@type":"WebSite","name":"Siddhant Kumar","url":"${SITE}/"},
    "author":{"@type":"Person","name":"Siddhant Kumar","url":"${SITE}/"}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Siddhant Kumar","item":"${SITE}/"},
      {"@type":"ListItem","position":2,"name":"Projects","item":"${SITE}/projects/"},
      {"@type":"ListItem","position":3,"name":"Categories"}
    ]
  }
  </script>
  <style>:root{--acc:#22d3ee;--acc-light:#67e8f9;--acc-rgb:34,211,238}</style>
</head>
<body>

  <a href="#main" class="skip-link">Skip to content</a>
  <div id="cursor" aria-hidden="true"></div>
  <div id="cursor-trail" aria-hidden="true"></div>
  <div id="scroll-progress" aria-hidden="true"></div>

  <header class="topnav" id="topnav">
    <nav class="nav-inner" aria-label="Main navigation">
      <a href="../../index.html" class="brand" aria-label="Back to Siddhant Kumar's portfolio">
        <span class="mono">SK</span><span>Siddhant Kumar</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Toggle menu"><span></span><span></span><span></span></button>
      <ul class="nav-links" id="navMenu">
        <li><a href="../../index.html">Portfolio</a></li>
        <li><a href="../">All Projects</a></li>
        <li><a href="../iot.html">IoT</a></li>
        <li><a href="../ai.html">AI &amp; Advanced</a></li>
        <li><a href="./" class="active" aria-current="page">Categories</a></li>
        <li><a href="../../index.html#contact" class="nav-cta">Work With Me</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <section class="phero">
      <canvas id="bgCanvas" aria-hidden="true"></canvas>
      <div class="container phero-inner">
        <p class="crumbs"><a href="../../index.html">Home</a> / <a href="../">Projects</a> / Categories</p>
        <span class="eyebrow">Browse By Category</span>
        <h1>Find Your <span class="grad">Next Build</span></h1>
        <p class="lead">
          125+ projects, organised by platform, discipline, skill level and audience. Start with a platform you own,
          a discipline you want to learn, or a skill level that matches where you're at.
        </p>
      </div>
    </section>

    <section class="proj-section" style="padding-top:1rem">
      <div class="container">
        <div class="shead reveal-up">
          <span class="lbl">Platform &amp; Discipline</span>
          <h2>Browse by <em>Category</em></h2>
        </div>
        <div class="hub-grid">
${cards}
        </div>
      </div>
    </section>

    <section class="proj-section" style="padding-top:0">
      <div class="container">
        <div class="cta-band reveal-up">
          <span class="eyebrow" style="justify-content:center">Not Sure Where to Start?</span>
          <h2>See the Full<br/><em>Catalogue</em></h2>
          <p>Search and filter all 125 projects directly, or jump into the IoT or AI &amp; Advanced labs.</p>
          <a class="btn" href="../"><span>Browse All Projects</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="mono" aria-hidden="true">SK</div>
      <p><strong>Project Categories</strong> — the engineering workshop of Siddhant Kumar</p>
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="../../index.html">Portfolio</a>
        <a href="../">All Projects</a>
        <a href="../iot.html">IoT</a>
        <a href="../ai.html">AI &amp; Advanced</a>
        <a href="../../index.html#contact">Contact</a>
      </nav>
      <p>&copy; <span id="year">2026</span> Siddhant Kumar. All rights reserved.</p>
    </div>
  </footer>

  <button class="back-to-top" id="backToTop" aria-label="Back to top">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 15V5M6 9l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>

  <script src="../projects.js"></script>
</body>
</html>
`;
}

// ---- run -----------------------------------------------------
if (!fs.existsSync(CAT_DIR)) fs.mkdirSync(CAT_DIR, { recursive: true });

let written = 0;
for (const cat of CATEGORIES) {
  fs.writeFileSync(path.join(CAT_DIR, cat.slug + '.html'), categoryHtml(cat), 'utf8');
  written++;
}
fs.writeFileSync(path.join(CAT_DIR, 'index.html'), hubHtml(), 'utf8');

console.log(`✓ Generated ${written} category pages + 1 hub page.`);
module.exports = { CATEGORIES, ALL };
