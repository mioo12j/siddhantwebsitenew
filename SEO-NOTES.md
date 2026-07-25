# SEO Log & Roadmap — siddhantkumar.in

_Last updated: 2026-07-25_

---

## 🆕 Round 3 (2026-07-25) — Entity & AI-search hardening

Goal: make the site the unambiguous, machine-readable source of truth for **this** Siddhant Kumar, for both classic search engines and AI answer engines (ChatGPT, Claude, Perplexity, Gemini, etc.).

1. **New `/about/` page** — the canonical biography. Full prose bio, "At a Glance" fact table, milestones timeline, visible FAQ, and an explicit **name-disambiguation section** ("Which Siddhant Kumar?"). Ships `ProfilePage` + full `Person` + `FAQPage` + `BreadcrumbList` JSON-LD, all tied to the site-wide entity id `https://siddhantkumar.in/#person`.
2. **Person schema hardened on home page** — added `givenName`/`familyName`, `alternateName`, `disambiguatingDescription`, and `mainEntityOfPage → /about/`. This is the single strongest signal search engines use to separate same-name entities.
3. **`/llms.txt`** — machine-readable identity summary following the emerging llms.txt convention, including an explicit disambiguation instruction for AI systems.
4. **`robots.txt`** — explicit `Allow: /` for AI/answer-engine crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, Amazonbot, CCBot, etc.) and a pointer to llms.txt.
5. **Proper 1200×630 share image** — `assets/og-image.png` (brand navy/gold banner: name, roles, domain). Home page `og:image`/`twitter:image` now use it, with width/height/alt. (Closes Round-2 action item #1.)
6. **`humans.txt`**, sitemap entry for `/about/` (priority 0.9), and internal links to the biography from the home About section and footer.

### Still open (needs your action, not code)
- Replace social `href="#"` placeholders with real Instagram/LinkedIn/X profile URLs, then add them as `sameAs` in the Person schema — the #1 remaining entity signal.
- Google Search Console + Bing Webmaster verification; submit sitemap.
- Wikidata entry, Amazon Author Central, Goodreads author page — link them via `sameAs` too.
- Ask outlets/institutions that covered the book to link to siddhantkumar.in (backlinks remain the biggest ranking lever).
- Drop a real portrait at `assets/siddhant.jpg` (the About section shows it automatically) and add it as `image` in the Person schema.

This file documents the SEO work done across the site and the steps left to climb on Google.

---

## ✅ What's already in place (good foundation)

| Page | Title | Meta description | Canonical | Open Graph | Twitter | JSON-LD structured data |
|------|-------|------------------|-----------|------------|---------|--------------------------|
| Home (`/index.html`) | ✅ | ✅ | ✅ | ✅ (fixed) | ✅ (fixed) | ✅ Person, WebSite, WebPage, Book ×3, FAQPage |
| Guardians book (`book 1/`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ WebSite, Person, Book+Offer, FAQPage |
| Book 2 teaser (`book 2/`) | ✅ | ✅ | ⚠️ update on deploy | ✅ | ✅ | ✅ Book, BreadcrumbList |
| Journal (`journal/`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Blog, BreadcrumbList |
| 404 (`404.html`) | ✅ | `noindex,follow` | — | — | — | — |

---

## 🔧 Changes made this round

1. **Fixed broken share image** — Home page `og:image`/`twitter:image` pointed to `og-image.jpg` (missing → blank link previews). Now points to the real `assets/book-cover.jpg`, with `og:image:alt`.
2. **New pages, fully optimised** — Book 2 teaser and Journal each ship with complete title/description/canonical/OG/Twitter tags + JSON-LD (`Book`, `Blog`, `BreadcrumbList`).
3. **Internal linking** — Home now links to Journal (nav + footer) and the Book 2 teaser. Journal and Book 2 link back to Home and the Guardians book. (Internal links spread "link equity" and help crawling.)
4. **Sitemaps**
   - `/sitemap.xml` — added the Journal; Book 2 entry templated (uncomment once its URL is final).
   - `book 1/sitemap.xml` + `book 1/robots.txt` — **new**, for the `guardians.` subdomain (previously had none).
5. **Crawlability & UX signals** — lazy-loaded heavy images, reading-progress + back-to-top, skip-to-content link, visible keyboard focus, `prefers-reduced-motion` support. These improve Core Web Vitals & accessibility, both ranking factors.
6. **Semantic HTML** — headings, `aria-label`s, descriptive image `alt` text already in good shape; review ARIA labels on the book page were corrected.

---

## ⚠️ Action items (need your input / hosting)

1. **Make a proper 1200×630 share image** (`og-image.jpg`) and update the `og:image` URLs. A book cover works but a wide banner (cover + name + tagline) previews better. Tools: Canva → 1200×630.
2. **Decide the Book 2 URL** (e.g. `gunfire.siddhantkumar.in` or `siddhantkumar.in/in-the-absence-of-gunfire/`), then:
   - update the `canonical`/`og:url` in `book 2/index.html`,
   - update the link in the Home "Explore the Book" button,
   - uncomment the Book 2 entry in `/sitemap.xml`.
3. **Compress images** — `assets/letter-5.jpg` is ~22 MB (huge). Target < 500 KB. Faster pages rank better. (A background task was already flagged for this.)
4. **Replace social `href="#"` placeholders** in the Home contact section with your real Instagram / LinkedIn / X URLs. (Social profiles + consistent name = entity/brand signals.)
5. **Real mailing list** — Book 2 waitlist & Journal newsletter currently post to FormSubmit (emails you). Swap the form `action` for Mailchimp/Buttondown/ConvertKit to actually build a list.
6. **Analytics** — add privacy-friendly analytics so you can see what's working. Either:
   - Plausible: `<script defer data-domain="siddhantkumar.in" src="https://plausible.io/js/script.js"></script>`
   - or Google Analytics 4 (needs a Measurement ID).

---

## 🚀 To actually climb on Google (off-page / ongoing)

1. **Google Search Console** — verify `siddhantkumar.in` AND `guardians.siddhantkumar.in` (separate properties), submit both sitemaps. Same for Bing Webmaster Tools.
2. **Google Knowledge Panel** — the `Person` + `Book` schema is the groundwork. Strengthen your entity by keeping name + role consistent everywhere and getting a Wikidata entry / author pages (Amazon Author Central, Goodreads).
3. **Backlinks** — the press coverage you already have is gold. Ask outlets/institutions that featured the book to link to `siddhantkumar.in`. Each quality link lifts rankings.
4. **Fresh content** — publish real Journal posts on a cadence. New, indexable text targeting phrases like "patriotic poetry book India", "poems about soldiers" pulls in search traffic.
5. **Amazon / Goodreads** — claim author profiles and link back; these rank highly for your book name and feed buyer intent.
6. **Target long-tail keywords** in Journal posts (e.g. "poem about a soldier's farewell letter", "Kargil Operation Vijay poem") — lower competition, high relevance.
