/* ============================================================
   Project detail page generator — Siddhant Kumar / Projects portal
   Reads projects-data.js + every projects/_build/content/<slug>.js,
   writes projects/p/<slug>.html for each, and injects sitemap entries.
   Rover (A01) is hand-authored and intentionally skipped.
   Run:  node "projects/_build/build.js"
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BUILD_DIR = __dirname;
const PROJ_DIR = path.resolve(BUILD_DIR, '..');
const ROOT_DIR = path.resolve(PROJ_DIR, '..');
const CONTENT_DIR = path.join(BUILD_DIR, 'content');
const OUT_DIR = path.join(PROJ_DIR, 'p');
const SITE = 'https://siddhantkumar.in';

const dataSrc = fs.readFileSync(path.join(PROJ_DIR, 'projects-data.js'), 'utf8');
const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);
const ALL = sandbox.ALL_PROJECTS;
const bySlug = Object.fromEntries(ALL.map(p => [p.slug, p]));

const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const parasHtml = arr => (arr || []).map(p => `        <p>${p}</p>`).join('\n');
const listHtml = (arr, cls) => `        <ul class="${cls || ''}">\n${(arr || []).map(li => `          <li>${li}</li>`).join('\n')}\n        </ul>`;

function stepsHtml(arr) {
  if (!arr || !arr.length) return '';
  return `        <div class="steps">\n${arr.map((s, i) => `          <div class="step-card"><span class="sn">${i + 1}</span><p>${s}</p></div>`).join('\n')}\n        </div>`;
}

function tableHtml(headers, rows, footRow) {
  const thead = `<thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i === r.length - 1 && /^[\d₹$,. ]+$/.test(String(c)) ? ' class="num"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
  const tfoot = footRow ? `<tfoot><tr>${footRow.map(c => `<td>${c}</td>`).join('')}</tr></tfoot>` : '';
  return `        <div class="table-wrap"><table class="data-table">${thead}${tbody}${tfoot}</table></div>`;
}

function faqHtml(faqs) {
  if (!faqs || !faqs.length) return '';
  return `        <div class="faq-list">\n${faqs.map(f => `          <details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${f.a}</div></details>`).join('\n')}\n        </div>`;
}

function diagramBox(icon, title, caption) {
  return `        <div class="diagram-box reveal-up">
          <div class="db-icon" aria-hidden="true">${icon}</div>
          <h4>${esc(title)}</h4>
          <p>${caption}</p>
        </div>`;
}

function galleryPlaceholder(n, label) {
  return `        <div class="gallery-grid">\n${Array.from({ length: n }, (_, i) => `          <div class="gallery-tile" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#8090b0" stroke-width="1.4"/><circle cx="9" cy="10" r="1.6" stroke="#8090b0" stroke-width="1.4"/><path d="M21 16l-5.5-5-4 4-2.5-2L3 17" stroke="#8090b0" stroke-width="1.4"/></svg><span>${label} ${i + 1}</span></div>`).join('\n')}\n        </div>`;
}

function relatedHtml(slugs) {
  const items = (slugs || []).map(s => bySlug[s]).filter(Boolean);
  if (!items.length) return '<p style="color:var(--slate);font-size:.9rem">Related projects will be linked here as the library grows.</p>';
  return `        <div class="related-grid">\n${items.map(p => {
    const href = p.url === 'rover.html' ? '../rover.html' : '../' + p.url;
    return `          <a class="related-card reveal-up" href="${href}">
            <span class="rc-cat">${esc(p.cat)}</span>
            <h4>${esc(p.title)}</h4>
            <p>${esc(p.desc)}</p>
            <span class="rc-more">View project →</span>
          </a>`;
  }).join('\n')}\n        </div>`;
}

function tocHtml(items) {
  return `      <nav class="toc-bar" aria-label="On this page">\n${items.map(([id, label]) => `        <a href="#${id}">${label}</a>`).join('\n')}\n      </nav>`;
}

function section(id, label, title, body) {
  return `\n    <section class="pd-section" id="${id}" aria-labelledby="${id}-h">
      <div class="container">
        <div class="shead reveal-up">
          <span class="lbl">${esc(label)}</span>
          <h2 id="${id}-h">${title}</h2>
        </div>
        <div class="pd-prose reveal-up">
${body}
        </div>
      </div>
    </section>`;
}

function pageHtml(p, c) {
  const url = `${SITE}/projects/p/${p.slug}.html`;
  const isAI = p.no.startsWith('A');
  const hubHref = isAI ? '../ai.html' : '../iot.html';
  const hubLabel = isAI ? 'AI & Advanced' : 'IoT';
  const accent = isAI ? '#818cf8' : '#22d3ee';
  const accentLight = isAI ? '#a5b4fc' : '#67e8f9';
  const accentRgb = isAI ? '129,140,248' : '34,211,238';

  const costLine = c.estimatedCost
    ? `₹${c.estimatedCost.low}–₹${c.estimatedCost.high}${c.estimatedCost.note ? ' · ' + c.estimatedCost.note : ''}`
    : 'See Bill of Materials';

  const metaChips = `
        <div class="meta-chips reveal-up" style="--delay:.2s">
          <span class="meta-chip level-${p.level}">${p.level}</span>
          <span class="meta-chip">${esc(p.cat)}</span>
          ${(p.domains || []).filter(d => !['IoT', 'AI', 'Electronics'].includes(d)).map(d => `<span class="meta-chip">${esc(d.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))}</span>`).join('\n          ')}
          <span class="meta-chip">Est. Cost: ${costLine}</span>
        </div>`;

  const toc = tocHtml([
    ['introduction', 'Introduction'],
    ['problem', 'Problem & Applications'],
    ['working', 'Working Principle'],
    ['architecture', 'Architecture'],
    ['components', 'Components & BOM'],
    ['tools', 'Tools & Software'],
    ['power-wiring', 'Power & Wiring'],
    ['build', 'Build Guide'],
    ['testing', 'Testing & Calibration'],
    ['troubleshooting', 'Troubleshooting & Safety'],
    ['performance', 'Performance'],
    ['faq', 'FAQ'],
    ['conclusion', 'Conclusion'],
    ['related', 'Related Projects'],
    ['resources', 'Resources']
  ]);

  const componentsTable = tableHtml(
    ['Component', 'Qty', 'Notes'],
    (c.components || []).map(x => [esc(x.name), esc(String(x.qty)), x.note || ''])
  );
  const bomTable = tableHtml(
    ['Item', 'Qty', 'Specification', 'Est. Cost (₹)'],
    (c.bom || []).map(x => [esc(x.item), esc(String(x.qty)), x.specNote || '', esc(String(x.estCostINR))]),
    c.estimatedCost ? ['Total (approx.)', '', '', `₹${c.estimatedCost.low}–₹${c.estimatedCost.high}`] : null
  );
  const specsTable = (c.specifications && c.specifications.length)
    ? tableHtml(['Parameter', 'Detail'], c.specifications.map(x => [esc(x.name), x.detail]))
    : '';
  const troubleshootTable = tableHtml(
    ['Symptom', 'Likely Cause & Fix'],
    (c.troubleshooting || []).map(x => [esc(x.issue), x.fix])
  );

  return `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(c.metaTitle)}</title>
  <meta name="title" content="${esc(c.metaTitle)}" />
  <meta name="description" content="${esc(c.metaDescription)}" />
  <meta name="keywords" content="${esc(c.keywords)}" />
  <meta name="author" content="Siddhant Kumar" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="theme-color" content="#0a0f1e" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Siddhant Kumar" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(c.metaTitle)}" />
  <meta property="og:description" content="${esc(c.metaDescription)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(c.metaTitle)}" />
  <meta name="twitter:description" content="${esc(c.metaDescription)}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%230a0f1e'/><text x='50' y='68' text-anchor='middle' font-family='serif' font-size='52' font-weight='700' fill='%23${accent.replace('#', '')}'>SK</text></svg>" />
  <link rel="stylesheet" href="../projects.css" />
  <link rel="stylesheet" href="../project-detail.css" />

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"TechArticle","headline":${JSON.stringify(p.title)},"description":${JSON.stringify(c.metaDescription)},"about":${JSON.stringify(p.cat)},"proficiencyLevel":${JSON.stringify(p.level)},"author":{"@type":"Person","name":"Siddhant Kumar","url":"${SITE}/"},"publisher":{"@type":"Person","name":"Siddhant Kumar"},"mainEntityOfPage":"${url}","keywords":${JSON.stringify(c.keywords)}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Siddhant Kumar","item":"${SITE}/"},
    {"@type":"ListItem","position":2,"name":"Projects","item":"${SITE}/projects/"},
    {"@type":"ListItem","position":3,"name":"${hubLabel}","item":"${SITE}/projects/${isAI ? 'ai' : 'iot'}.html"},
    {"@type":"ListItem","position":4,"name":${JSON.stringify(p.title)}}
  ]}
  </script>
  ${c.faqs && c.faqs.length ? `<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":${JSON.stringify((c.faqs || []).map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })))}}
  </script>` : ''}
  <style>:root{--acc:${accent};--acc-light:${accentLight};--acc-rgb:${accentRgb}}</style>
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
        <li><a href="../categories/">Categories</a></li>
        <li><a href="../../index.html#contact" class="nav-cta">Work With Me</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <section class="phero pd-hero" style="padding-bottom:1rem">
      <canvas id="bgCanvas" aria-hidden="true"></canvas>
      <div class="container phero-inner">
        <p class="crumbs"><a href="../../index.html">Home</a> / <a href="../">Projects</a> / <a href="${hubHref}">${esc(hubLabel)}</a> / ${esc(p.title)}</p>
        <span class="eyebrow">${esc(p.cat)} · Project Guide</span>
        <h1>${c.h1 || esc(p.title)}</h1>
        <p class="lead">${c.overview}</p>
${metaChips}
      </div>
    </section>

${toc}

${section('introduction', 'Introduction', 'Introduction &amp; Objectives', `${parasHtml(c.introduction)}
${c.objectives && c.objectives.length ? `        <h3>Objectives</h3>\n${listHtml(c.objectives, 'pill-list')}` : ''}`)}

${section('problem', 'Context', 'Problem Statement &amp; Applications', `        <h3>Problem Statement</h3>
${parasHtml(c.problemStatement)}
        <h3>Applications</h3>
${listHtml(c.applications, 'pill-list good')}
        <h3>Real-World Use Cases</h3>
${parasHtml(c.useCases)}`)}

${section('working', 'How It Works', 'Working Principle', `${parasHtml(c.workingPrinciple)}
${diagramBox('<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 18l4-8 4 4 4-9 4 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>', 'Flowchart — ' + p.title, 'A step-by-step logic flowchart for this build will be added here. Until then, follow the Working Principle and Algorithm Explanation sections below for the full decision logic.')}`)}

${section('architecture', 'Design', 'System Architecture &amp; Design Methodology', `${parasHtml(c.systemArchitecture)}
${diagramBox('<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/></svg>', 'Block Diagram — ' + p.title, 'A labelled system block diagram showing the sensor, controller, connectivity and output stages will be added here as the build documentation is illustrated.')}
        <h3>Design Methodology</h3>
${parasHtml(c.designMethodology)}
        <h3>Hardware Architecture</h3>
${parasHtml(c.hardwareArchitecture)}
        <h3>Software Architecture</h3>
${parasHtml(c.softwareArchitecture)}
${diagramBox('<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>', 'Circuit Diagram — ' + p.title, 'A full schematic showing pin-level wiring between every component will be added here. Use the Wiring Explanation section below for the complete connection reference in the meantime.')}`)}

${section('components', 'Build List', 'Components &amp; Bill of Materials', `        <h3>Components Required</h3>
${componentsTable}
        <h3>Complete Bill of Materials</h3>
${bomTable}
        ${specsTable ? `<h3>Component Specifications</h3>\n${specsTable}` : ''}
        <h3>Estimated Cost</h3>
        <p>${c.estimatedCost ? `A complete build typically costs <strong>₹${c.estimatedCost.low}–₹${c.estimatedCost.high}</strong> (approximate, India retail pricing).${c.estimatedCost.note ? ' ' + c.estimatedCost.note : ''} Prices vary by supplier, region and whether parts are sourced individually or as a kit.` : 'See the Bill of Materials table above for a full cost breakdown.'}</p>`)}

${section('tools', 'Setup', 'Tools &amp; Software', `        <h3>Tools Required</h3>
${listHtml(c.tools)}
        <h3>Software Used</h3>
${listHtml(c.software)}
        <h3>Programming Language(s)</h3>
${listHtml(c.languages)}
        <h3>IDE Used</h3>
${listHtml(c.ide)}
        <h3>Libraries Used</h3>
${listHtml(c.libraries)}
        <h3>Communication Protocols</h3>
${listHtml(c.protocols)}`)}

${section('power-wiring', 'Electrical', 'Power Requirements &amp; Wiring', `        <h3>Power Requirements</h3>
${parasHtml(c.power)}
        <h3>Wiring Explanation</h3>
${parasHtml(c.wiring)}`)}

${section('build', 'Build It', 'Assembly &amp; Implementation Guide', `        <h3>Assembly Process</h3>
${stepsHtml(c.assembly)}
        <h3>Step-by-Step Implementation Guide</h3>
${stepsHtml(c.implementation)}
        <h3>Coding Methodology</h3>
${parasHtml(c.codingMethodology)}
        <h3>Algorithm Explanation</h3>
${parasHtml(c.algorithm)}`)}

${section('testing', 'Verify', 'Testing, Calibration &amp; Results', `        <h3>Testing Methodology</h3>
${parasHtml(c.testing)}
        <h3>Calibration Process</h3>
${parasHtml(c.calibration)}
        <h3>Sample Output</h3>
${parasHtml(c.sampleOutput)}
        <h3>Expected Results</h3>
${listHtml(c.expectedResults, 'pill-list good')}`)}

${section('troubleshooting', 'Fix It', 'Troubleshooting, Mistakes &amp; Safety', `        <h3>Troubleshooting Guide</h3>
${troubleshootTable}
        <h3>Common Mistakes</h3>
${listHtml(c.commonMistakes, 'pill-list warn')}
        <h3>Safety Precautions</h3>
${listHtml(c.safety, 'pill-list warn')}`)}

${section('performance', 'Evaluate', 'Performance Analysis', `${parasHtml(c.performance)}
        <div class="two-col">
          <div class="advantages"><h4>Advantages</h4>${listHtml(c.advantages)}</div>
          <div class="limitations"><h4>Limitations</h4>${listHtml(c.limitations)}</div>
        </div>
        <h3>Future Improvements</h3>
${listHtml(c.future)}`)}

${section('faq', 'FAQ', 'Frequently Asked Questions', faqHtml(c.faqs))}

${section('conclusion', 'Wrap-Up', 'Conclusion', `${parasHtml(c.conclusion)}
        <h3>References</h3>
        <ol class="ref-list">${(c.references || []).map(r => `<li>${r}</li>`).join('')}</ol>`)}

    <section class="pd-section" id="related" aria-labelledby="related-h">
      <div class="container">
        <div class="shead reveal-up">
          <span class="lbl">Keep Building</span>
          <h2 id="related-h">Related Projects</h2>
        </div>
${relatedHtml(c.relatedSlugs)}
      </div>
    </section>

    <section class="pd-section" id="resources" aria-labelledby="resources-h" style="border-bottom:0">
      <div class="container">
        <div class="shead reveal-up">
          <span class="lbl">More</span>
          <h2 id="resources-h">Gallery, Code &amp; Downloads</h2>
        </div>
        <div class="resource-grid reveal-up">
          <div class="resource-card"><div class="rc-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 12A10 10 0 1 1 12 2" stroke="currentColor" stroke-width="1.6"/><path d="M22 12a10 10 0 0 0-10-10v10z" fill="currentColor" opacity=".25"/></svg></div><h4>Source Code &amp; GitHub</h4><p>A public repository with the full firmware/software for this build will be linked here once published. Until then, follow the Coding Methodology and Algorithm Explanation sections above.</p></div>
          <div class="resource-card"><div class="rc-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 3v4a1 1 0 0 0 1 1h4M6 3h8l6 6v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5"/></svg></div><h4>Full Documentation (PDF)</h4><p>A downloadable build report — suitable for a lab submission or personal reference — is planned for this project.</p></div>
          <div class="resource-card"><div class="rc-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/></svg></div><h4>Video Demonstration</h4><p>A build walkthrough and working demo video will be embedded here as the project is filmed.</p></div>
          <div class="resource-card"><div class="rc-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h4>Download Kit</h4><p>Schematic files, BOM spreadsheet and firmware archive will be made downloadable here once the build is finalised.</p></div>
        </div>
        <h3 style="font-family:var(--f-display);font-size:1.15rem;color:var(--ivory);margin:2.2rem 0 .5rem">Gallery</h3>
${galleryPlaceholder(4, 'Build photo')}
      </div>
    </section>

    <section class="proj-section" style="padding-top:0">
      <div class="container">
        <div class="cta-band reveal-up">
          <span class="eyebrow" style="justify-content:center">Build Along</span>
          <h2>Questions About<br/><em>This Build?</em></h2>
          <p>Get in touch, or explore more ${esc(hubLabel)} projects in the library.</p>
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
      <p><strong>${esc(p.title)}</strong> — a project guide by Siddhant Kumar</p>
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="../../index.html">Portfolio</a>
        <a href="../">All Projects</a>
        <a href="../iot.html">IoT</a>
        <a href="../ai.html">AI &amp; Advanced</a>
        <a href="../categories/">Categories</a>
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
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });

const contentFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.js'));
let written = 0;
const generatedSlugs = [];
const missing = [];

for (const p of ALL) {
  if (p.slug === 'rover') continue; // hand-authored flagship page — never overwritten
  const contentPath = path.join(CONTENT_DIR, p.slug + '.js');
  if (!fs.existsSync(contentPath)) { missing.push(p.slug); continue; }
  delete require.cache[require.resolve(contentPath)];
  const c = require(contentPath);
  fs.writeFileSync(path.join(OUT_DIR, p.slug + '.html'), pageHtml(p, c), 'utf8');
  generatedSlugs.push(p.slug);
  written++;
}

// ---- sitemap injection ----------------------------------------
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const START = '<!--PROJECT_PAGES_START-->';
const END = '<!--PROJECT_PAGES_END-->';
if (sitemap.includes(START)) {
  const urls = generatedSlugs.map(slug =>
    `  <url>\n    <loc>${SITE}/projects/p/${slug}.html</loc>\n    <lastmod>2026-07-14</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
  ).concat(
    require('./categories-data.js').map(cat =>
      `  <url>\n    <loc>${SITE}/projects/categories/${cat.slug}.html</loc>\n    <lastmod>2026-07-14</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>`
    )
  ).concat([`  <url>\n    <loc>${SITE}/projects/categories/</loc>\n    <lastmod>2026-07-14</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`]).join('\n');
  const s = sitemap.indexOf(START), e = sitemap.indexOf(END);
  sitemap = sitemap.slice(0, s + START.length) + '\n' + urls + '\n  ' + sitemap.slice(e);
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
}

console.log(`✓ Generated ${written} project pages.`);
if (missing.length) console.log(`  ⚠ ${missing.length} project(s) still missing content files: ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '…' : ''}`);
