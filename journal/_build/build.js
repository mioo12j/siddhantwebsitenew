/* ============================================================
   Journal article generator — Siddhant Kumar
   Reads articles.js → writes each journal/<slug>.html,
   injects the article cards into journal/index.html, and the
   <url> entries into ../sitemap.xml (between marker comments).
   Run:  node "journal/_build/build.js"
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const BUILD_DIR = __dirname;
const JOURNAL_DIR = path.resolve(BUILD_DIR, '..');
const ROOT_DIR = path.resolve(JOURNAL_DIR, '..');
const SITE = 'https://siddhantkumar.in';

const articles = require('./articles.js');
const { cr, MAP } = require('./images.js');

// ---- apply per-article image assignments (unique hero + inline images) ----
for (const a of articles) {
  const m = MAP[a.slug];
  if (!m) continue;
  if (m.hero) {
    const f = m.hero[0];
    const contain = m.hero[2] === 'contain';
    a.hero = {
      src: 'assets/' + f,
      alt: m.hero[1],
      credit: cr[f] || '',
      cardContain: contain,
      style: contain ? 'aspect-ratio:auto;max-height:430px;object-fit:contain;background:linear-gradient(160deg,#0d1a3a,#0a1124);padding:2rem' : undefined
    };
  }
  if (m.inline && m.inline.length && Array.isArray(a.body)) {
    const imgs = m.inline.map(x => ({ img: { src: 'assets/' + x[0], alt: x[1], credit: cr[x[0]] || '' } }));
    const n = a.body.length;
    imgs.forEach((blk, k) => {
      let pos = Math.round((n * (k + 1)) / (imgs.length + 1)) + k;
      pos = Math.max(1, Math.min(pos, a.body.length));
      a.body.splice(pos, 0, blk);
    });
    a.imageCredit = 'All images via Wikimedia Commons, used under the licences shown in each caption.';
  }
}

// ---- helpers -------------------------------------------------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const titleMap = Object.fromEntries(articles.map(a => [a.slug, a.cardTitle || a.plainTitle || a.title]));

function humanDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Render the body blocks (array of {h2|h3|p|quote|verse|ul|img})
function renderBody(blocks) {
  return blocks.map(b => {
    if (b.h2) return `      <h2>${b.h2}</h2>`;
    if (b.h3) return `      <h3>${b.h3}</h3>`;
    if (b.p) return `      <p>${b.p}</p>`;
    if (b.quote) return `      <blockquote>${b.quote}</blockquote>`;
    if (b.verse) return `      <figure class="inline" style="border:none;background:rgba(201,168,76,.05);border-left:3px solid var(--gold);border-radius:0 8px 8px 0;padding:1.3rem 1.6rem;margin:2rem 0">\n        <p style="font-style:italic;color:var(--gold-light);white-space:pre-line;margin:0;font-size:1.18rem;line-height:1.9">${b.verse}</p>\n        ${b.cite ? `<figcaption style="background:none;padding:.6rem 0 0;color:var(--slate)">${b.cite}</figcaption>` : ''}\n      </figure>`;
    if (b.ul) return `      <ul>\n${b.ul.map(li => `        <li>${li}</li>`).join('\n')}\n      </ul>`;
    if (b.img) return `      <figure class="inline">\n        <img src="${b.img.src}" alt="${esc(b.img.alt)}" loading="lazy" decoding="async" />\n        <figcaption>${b.img.credit}</figcaption>\n      </figure>`;
    return '';
  }).join('\n');
}

function renderSources(sources) {
  if (!sources || !sources.length) return '';
  const items = sources.map(s => `        <li id="s${s.n}">${s.html}</li>`).join('\n');
  return `\n    <section class="sources">\n      <h2>Sources &amp; further reading</h2>\n      <ol>\n${items}\n      </ol>\n      ${'' /*credit*/}<p class="credit-note">${'%CREDIT%'}</p>\n    </section>`;
}

function renderRelated(slugs) {
  if (!slugs || !slugs.length) return '';
  const links = slugs.filter(s => titleMap[s]).map(s =>
    `        <a href="${s}.html">${titleMap[s]} →</a>`).join('\n');
  if (!links) return '';
  return `\n    <section class="related">\n      <h2>Read next</h2>\n      <div class="related-links">\n${links}\n      </div>\n    </section>`;
}

function articleHtml(a) {
  const url = `${SITE}/journal/${a.slug}.html`;
  const img = a.hero ? `${SITE}/journal/${a.hero.src.replace('./', '')}` : `${SITE}/assets/book-cover.jpg`;
  const heroFig = a.hero ? `
    <figure class="hero-fig">
      <img src="${a.hero.src}" alt="${esc(a.hero.alt)}"${a.hero.style ? ` style="${a.hero.style}"` : ''} />
      <figcaption>${a.hero.credit}</figcaption>
    </figure>` : '';

  const intro = (a.intro || []).map(p => `      <p>${p}</p>`).join('\n');
  const sources = renderSources(a.sources).replace('%CREDIT%', a.imageCredit || '');

  return `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(a.title)} | Siddhant Kumar</title>
  <meta name="title" content="${esc(a.title)}" />
  <meta name="description" content="${esc(a.desc)}" />
  <meta name="keywords" content="${esc(a.keywords)}" />
  <meta name="author" content="Siddhant Kumar" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="theme-color" content="#0a0f1e" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Siddhant Kumar — Journal" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(a.title)}" />
  <meta property="og:description" content="${esc(a.ogDesc || a.desc)}" />
  <meta property="og:image" content="${img}" />
  <meta property="article:published_time" content="${a.date}" />
  <meta property="article:author" content="Siddhant Kumar" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(a.title)}" />
  <meta name="twitter:description" content="${esc(a.ogDesc || a.desc)}" />
  <meta name="twitter:image" content="${img}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="article.css" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%230a0f1e'/><text x='50' y='68' text-anchor='middle' font-family='serif' font-size='54' font-weight='700' fill='%23c9a84c'>SK</text></svg>" />

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BlogPosting","headline":${JSON.stringify(a.plainTitle || a.title)},"image":${JSON.stringify(img)},"datePublished":"${a.date}","dateModified":"${a.date}","author":{"@type":"Person","name":"Siddhant Kumar","url":"${SITE}/"},"publisher":{"@type":"Person","name":"Siddhant Kumar"},"mainEntityOfPage":"${url}","articleSection":${JSON.stringify(a.category || 'History')},"description":${JSON.stringify(a.desc)}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Siddhant Kumar","item":"${SITE}/"},{"@type":"ListItem","position":2,"name":"Journal","item":"${SITE}/journal/"},{"@type":"ListItem","position":3,"name":${JSON.stringify(a.plainTitle || a.cardTitle || a.title)}}]}
  </script>
</head>
<body>
  <a href="#start" class="skip-link">Skip to content</a>
  <div class="read-progress" id="readProgress" aria-hidden="true"></div>

  <nav class="topnav" id="topnav" aria-label="Main navigation">
    <a href="${SITE}/" class="brand"><span class="mono">SK</span><span>Siddhant Kumar</span></a>
    <a href="index.html" class="back">← All Journal</a>
  </nav>

  <article class="wrap" id="start">
    <p class="eyebrow">${esc(a.eyebrow || a.category || 'History')}</p>
    <h1 class="headline">${a.h1 || esc(a.title)}</h1>
    <p class="meta"><span class="by">By Siddhant Kumar</span><span>·</span><span>${humanDate(a.date)}</span><span>·</span><span>${a.readTime || '7 min read'}</span></p>
${heroFig}

    <div class="prose">
${intro}
${renderBody(a.body)}
    </div>
${sources}
    <div class="author-box">
      <span class="ab-mono" aria-hidden="true">SK</span>
      <div>
        <div class="ab-name">Siddhant Kumar</div>
        <p class="ab-bio">Poet and author of <a href="https://guardians.siddhantkumar.in/">Guardians in the Gale</a>, a collection of 21 poems on the armed forces, sacrifice, and remembrance.</p>
      </div>
    </div>
${renderRelated(a.related)}
  </article>

  <footer class="foot">
    <div class="wrap">
      <a href="${SITE}/">Home</a>
      <a href="index.html">Journal</a>
      <a href="https://guardians.siddhantkumar.in/">Guardians in the Gale</a>
      <a href="${SITE}/#contact">Contact</a>
      <p class="copy">&copy; <span id="yr">2026</span> Siddhant Kumar. All rights reserved.</p>
    </div>
  </footer>

  <button class="back-to-top" id="backToTop" aria-label="Back to top">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 15V5M6 9l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <script src="article.js"></script>
</body>
</html>
`;
}

function cardHtml(a) {
  const style = a.hero && a.hero.cardContain ? ' style="object-fit:contain;background:linear-gradient(160deg,#0d1a3a,#0a1124);padding:1.5rem"' : '';
  const thumb = a.hero ? a.hero.src : '../assets/book-cover.jpg';
  const alt = a.hero ? a.hero.alt : a.plainTitle || a.title;
  return `          <a class="entry reveal" href="${a.slug}.html">
            <div class="thumb"><img src="${thumb}" alt="${esc(alt)}" loading="lazy" decoding="async"${style} /></div>
            <div class="body">
              <time datetime="${a.date}">${humanDate(a.date)}</time>
              <h3>${esc(a.cardTitle || a.plainTitle || a.title)}</h3>
              <p>${esc(a.excerpt)}</p>
              <span class="more">Read article →</span>
            </div>
          </a>`;
}

// Homepage card (paths are relative to site root, not /journal/)
function homeCardHtml(a) {
  const thumb = a.hero ? 'journal/' + a.hero.src : 'assets/book-cover.jpg';
  const alt = a.hero ? a.hero.alt : a.plainTitle || a.title;
  return `          <a class="home-journal-card" href="journal/${a.slug}.html">
            <div class="hj-thumb"><img src="${thumb}" alt="${esc(alt)}" loading="lazy" decoding="async" /></div>
            <div class="hj-body">
              <span class="hj-date">${humanDate(a.date)}</span>
              <h3 class="hj-title">${esc(a.cardTitle || a.plainTitle || a.title)}</h3>
              <p class="hj-excerpt">${esc(a.excerpt)}</p>
              <span class="hj-more">Read article →</span>
            </div>
          </a>`;
}

function injectBetween(content, startMarker, endMarker, payload) {
  const s = content.indexOf(startMarker);
  const e = content.indexOf(endMarker);
  if (s === -1 || e === -1) throw new Error('Markers not found: ' + startMarker);
  return content.slice(0, s + startMarker.length) + '\n' + payload + '\n          ' + content.slice(e);
}

// ---- run -----------------------------------------------------
const ordered = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

let written = 0;
for (const a of articles) {
  if (a.prewritten) continue; // hand-authored file already exists — don't overwrite
  fs.writeFileSync(path.join(JOURNAL_DIR, a.slug + '.html'), articleHtml(a), 'utf8');
  written++;
}

// Inject cards into journal/index.html
const indexPath = path.join(JOURNAL_DIR, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const cards = ordered.map(cardHtml).join('\n');
indexHtml = injectBetween(indexHtml, '<!--ARTICLES_START-->', '<!--ARTICLES_END-->', cards);
fs.writeFileSync(indexPath, indexHtml, 'utf8');

// Inject the latest 6 article cards into the homepage (index.html)
const homePath = path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(homePath)) {
  let homeHtml = fs.readFileSync(homePath, 'utf8');
  if (homeHtml.includes('<!--HOME_ARTICLES_START-->')) {
    const homeCards = ordered.slice(0, 6).map(homeCardHtml).join('\n');
    homeHtml = injectBetween(homeHtml, '<!--HOME_ARTICLES_START-->', '<!--HOME_ARTICLES_END-->', homeCards);
    fs.writeFileSync(homePath, homeHtml, 'utf8');
  }
}

// Inject sitemap entries
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = ordered.map(a => `  <url>\n    <loc>${SITE}/journal/${a.slug}.html</loc>\n    <lastmod>${a.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`).join('\n');
sitemap = injectBetween(sitemap, '<!--JOURNAL_ARTICLES_START-->', '<!--JOURNAL_ARTICLES_END-->', urls).replace(/\n {10}<!--JOURNAL_ARTICLES_END-->/, '\n  <!--JOURNAL_ARTICLES_END-->');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log(`✓ Generated ${written} articles, ${ordered.length} index cards, ${ordered.length} sitemap entries.`);
