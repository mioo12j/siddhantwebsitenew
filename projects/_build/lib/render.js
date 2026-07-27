/* ═══════════════════════════════════════════════════════════════════
   render.js — turns a project specification into a complete, static
   documentation page.

   Everything a page needs is inlined at build time: syntax colouring,
   SVG diagrams, structured data and the table of contents. The only
   runtime assets are doc.css and doc.js.
════════════════════════════════════════════════════════════════════ */
'use strict';

const { COMPONENTS, LIBRARIES, IMAGES } = require('./db');
const { highlight, esc } = require('./highlight');
const S = require('./svg');

const SITE = 'https://siddhantkumar.in';
const AUTHOR = 'Siddhant Kumar';

/* ── small helpers ─────────────────────────────────────────────── */
const p = (t) => `<p>${t}</p>`;
const paras = (arr) => (arr || []).map(p).join('\n');
const ul = (arr, cls) => arr && arr.length ? `<ul class="${cls || 'plain'}">${arr.map(i => `<li>${i}</li>`).join('')}</ul>` : '';
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

function callout(kind, title, body) {
  const ICONS = {
    tip: '<path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2ZM9 21h6" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/>',
    warn: '<path d="M12 3 2.5 20h19L12 3Zm0 6v5m0 3v.5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    danger: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M12 7v6m0 3v.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    note: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M12 11v5m0-8v.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  };
  return `<aside class="callout ${kind}">
    <svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[kind] || ICONS.note}</svg>
    <div class="bd"><span class="tt">${esc(title)}</span>${body}</div>
  </aside>`;
}

function table(headers, rows, caption, numCols) {
  const nc = numCols || [];
  return `<div class="table-wrap"><table>
    <thead><tr>${headers.map((h, i) => `<th${nc.includes(i) ? ' class="num"' : ''} scope="col">${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${nc.includes(i) ? ' class="num"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>${caption ? `<p class="tbl-caption">${caption}</p>` : ''}`;
}

/* ── code block ────────────────────────────────────────────────── */
function codeBlock(c) {
  const lang = c.lang || 'cpp';
  const lines = String(c.body).split('\n').length;
  const long = lines > 34;
  return `<div class="codeblock${long ? '' : ' tall'}" data-file="${esc(c.file)}">
  <div class="code-head">
    <span class="fname"><span class="lang">${esc(lang)}</span><span class="nm">${esc(c.file)}</span></span>
    <span class="code-actions">
      <button class="code-btn" data-copy type="button" aria-label="Copy ${esc(c.file)} to clipboard">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-6A3.5 3.5 0 0 0 3 6.5v6A2.5 2.5 0 0 0 5.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span class="lbl">Copy</span></button>
      <button class="code-btn" data-download="${esc(c.file)}" type="button" aria-label="Download ${esc(c.file)}">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 19h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="lbl">Download</span></button>
    </span>
  </div>
  <pre><code>${highlight(c.body, lang)}</code></pre>
  ${long ? `<button class="code-expand" type="button" aria-expanded="false">Expand full listing (${lines} lines)</button>` : ''}
</div>
${c.explain && c.explain.length ? `<div class="code-explain">${c.explain.map(e =>
    `<div><span class="ref">${esc(e.ref)}</span><span class="txt">${e.txt}</span></div>`).join('')}</div>` : ''}`;
}

/* ── images with graceful offline fallback ─────────────────────── */
function photo(key, caption) {
  const im = IMAGES[key];
  if (!im) return '';
  const fallback = S.boardIllustration(im.illus || 'sensor', caption || im.alt);
  return `<figure class="photo">
  <img src="${im.src}" alt="${esc(im.alt)}" loading="lazy" decoding="async" width="900" height="600" />
  <template class="fallback">${fallback}</template>
  <figcaption>${esc(caption || im.alt)}
    <span class="credit">Photograph sourced from <a href="${im.page}" rel="noopener nofollow" target="_blank">${esc(im.source)} — ${esc(im.file)}</a>. Reused under the licence stated on that page; please check it before republishing.</span>
  </figcaption>
</figure>`;
}

/* ── derived tables ────────────────────────────────────────────── */
function bomRows(spec) {
  const rows = [];
  (spec.parts || []).forEach(id => {
    const c = COMPONENTS[id];
    if (!c) { rows.push([`<b>${esc(id)}</b>`, '—', '1', '—']); return; }
    const qty = (spec.qty && spec.qty[id]) || 1;
    rows.push([
      `<b>${esc(c.name)}</b>${c.note ? `<br/><span style="font-size:.82em;opacity:.78">${esc(c.note)}</span>` : ''}`,
      esc(c.spec),
      String(qty),
      inr(c.price * qty),
    ]);
  });
  (spec.extraParts || []).forEach(x => {
    rows.push([`<b>${esc(x.name)}</b>${x.note ? `<br/><span style="font-size:.82em;opacity:.78">${esc(x.note)}</span>` : ''}`,
      esc(x.spec || '—'), String(x.qty || 1), x.price ? inr(x.price * (x.qty || 1)) : '—']);
  });
  return rows;
}

function bomTotal(spec) {
  let t = 0;
  (spec.parts || []).forEach(id => { const c = COMPONENTS[id]; if (c) t += c.price * ((spec.qty && spec.qty[id]) || 1); });
  (spec.extraParts || []).forEach(x => { if (x.price) t += x.price * (x.qty || 1); });
  return t;
}

function powerRows(spec) {
  const rows = [];
  let total = 0;
  (spec.parts || []).forEach(id => {
    const c = COMPONENTS[id];
    if (!c || !c.current_mA) return;
    const qty = (spec.qty && spec.qty[id]) || 1;
    const mA = c.current_mA * qty;
    total += mA;
    rows.push([esc(c.name), esc(c.volts), String(mA), esc(c.note || '')]);
  });
  return { rows, total };
}

function libRows(spec) {
  return (spec.libs || []).map(id => {
    const l = LIBRARIES[id];
    if (!l) return [`<b>${esc(id)}</b>`, '—', '—'];
    return [`<b>${esc(l.name)}</b> <span style="opacity:.7">${esc(l.v)}</span>`, esc(l.why), `<code>${esc(l.install)}</code>`];
  });
}

/* ── section registry ──────────────────────────────────────────── */
function section(id, title, body) {
  if (!body) return null;
  return { id, title, html: `<section id="${id}" aria-labelledby="h-${id}"><h2 id="h-${id}">${esc(title)}</h2>${body}</section>` };
}

function buildSections(spec, ctx) {
  const out = [];
  const add = (s) => { if (s) out.push(s); };
  const D = spec;

  /* 1 ── Overview */
  add(section('overview', 'Project Overview', [
    `<p class="lede">${D.tagline}</p>`,
    paras(D.overview),
    D.images && D.images[0] ? photo(D.images[0], D.imageCaptions && D.imageCaptions[0]) : '',
    D.does && D.does.length ? `<h3>What this project does</h3>${ul(D.does, 'check')}` : '',
  ].join('\n')));

  /* 2 ── Applications */
  add(section('applications', 'Real-World Applications',
    (D.applications && D.applications.length ? table(['Setting', 'How it is used'],
      D.applications.map(a => [`<b>${esc(a.t)}</b>`, a.d]),
      'Deployment contexts where a build of this kind earns its keep.') : '') +
    (D.applicationsNote ? p(D.applicationsNote) : '')));

  /* 3 ── Features */
  add(section('features', 'Features & Capabilities', ul(D.features, 'check')));

  /* 4 ── Skills & difficulty */
  add(section('requirements', 'Difficulty, Time & Required Skills', [
    table(['Attribute', 'Value'], [
      ['<b>Difficulty level</b>', esc(D.difficulty)],
      ['<b>Estimated completion time</b>', esc(D.hours)],
      ['<b>Indicative build cost</b>', esc(D.cost || inr(bomTotal(D)) + ' (2026 Indian retail)')],
      ['<b>Primary discipline</b>', esc(D.cat)],
      ['<b>Reference platform</b>', esc(D.platformName || (COMPONENTS[(D.parts || [])[0]] || {}).name || '—')],
    ]),
    '<h3>Skills you should have (or will pick up)</h3>',
    ul(D.skills, 'check'),
    D.prereq ? callout('note', 'Before you start', paras(D.prereq)) : '',
  ].join('\n')));

  /* 5 ── BOM */
  const rows = bomRows(D);
  add(section('bom', 'Bill of Materials', [
    p('Every part below is commonly available from Indian and international hobby-electronics suppliers. Prices are indicative 2026 retail figures in Indian rupees and will drift — treat them as a budgeting guide, not a quotation.'),
    table(['Component', 'Key specification', 'Qty', 'Approx. cost'], rows, `Estimated total: <b>${inr(bomTotal(D))}</b>, excluding tools, shipping and consumables.`, [2, 3]),
    D.bomNotes ? ul(D.bomNotes) : '',
    D.tools ? `<h3>Tools and consumables</h3>${ul(D.tools)}` : '',
  ].join('\n')));

  /* 6 ── Hardware specs */
  const hwRows = (D.parts || []).map(id => COMPONENTS[id]).filter(Boolean).map(c => [
    `<b>${esc(c.name)}</b>`, esc(c.spec), esc(c.volts), esc(c.iface),
    c.datasheet ? `<a href="${c.datasheet}" rel="noopener nofollow" target="_blank">Datasheet</a>` : '—',
  ]);
  add(section('hardware', 'Hardware Specifications', [
    hwRows.length ? table(['Part', 'Specification', 'Supply', 'Interface', 'Reference'], hwRows,
      'Consolidated electrical and interface specifications for every active part in the build.') : '',
    D.hardwareNotes ? paras(D.hardwareNotes) : '',
  ].join('\n')));

  /* 7 ── Power budget */
  const pw = powerRows(D);
  if (pw.rows.length) {
    const headroom = Math.ceil((pw.total * 1.5) / 100) * 100;
    add(section('power', 'Power Budget & Supply Sizing', [
      p('Add up the typical active current of every part, then size the supply with at least 50 % headroom so transmit bursts and motor inrush never brown out the controller.'),
      table(['Load', 'Supply rail', 'Typical current (mA)', 'Notes'], pw.rows, '', [2]),
      p(`Summed typical draw is <b>${pw.total} mA</b>. With a 1.5× design margin the supply should deliver at least <b>${headroom} mA</b> continuously at the stated rail voltage.`),
      D.powerNotes ? ul(D.powerNotes) : '',
      callout('warn', 'Peak is not average', '<p>Wi-Fi transmit bursts, servo stalls and relay coil inrush all draw several times the figures above for a few milliseconds. A bulk electrolytic capacitor (470–1000 µF) across the supply rail near the noisy load absorbs those transients far better than a bigger adapter does.</p>'),
    ].join('\n')));
  }

  /* 8 ── Software & environment */
  add(section('software', 'Software Requirements & Development Environment', [
    p(`Reference toolchain: <b>${esc(D.ide || 'Arduino IDE 2.3.x')}</b>. Anything newer normally works; anything older may lack the board definitions used here.`),
    D.env ? ul(D.env) : '',
    libRows(D).length ? `<h3>Required libraries</h3>${table(['Library', 'Why it is needed', 'Install'], libRows(D))}` : '',
    D.install ? `<h3>Installation & dependency setup</h3>${D.install.map(codeBlock).join('\n')}` : '',
    D.envNotes ? paras(D.envNotes) : '',
  ].join('\n')));

  /* 9 ── Block diagram */
  add(section('block-diagram', 'Block Diagram', [
    p(D.blockIntro || 'The block diagram shows the functional decomposition of the system — what senses, what decides, what acts, and where the data ends up.'),
    D.block ? `<div class="diagram-scroll">${S.blockDiagram(Object.assign({ title: D.title + ' — system block diagram', desc: 'Functional block diagram of the ' + D.title + ' system.' }, D.block))}</div>` : '',
  ].join('\n')));

  /* 10 ── Circuit / wiring */
  add(section('circuit', 'Circuit Diagram & Wiring', [
    p(D.wiringIntro || 'Every signal line in the build is shown below, followed by a pin-by-pin connection table you can work through with a multimeter in hand.'),
    D.pins ? `<div class="diagram-scroll">${S.wiringDiagram(Object.assign({
      title: D.title + ' — wiring schematic',
      desc: 'Connection schematic showing which controller pin drives each peripheral.',
      mcu: D.platformName || 'Controller', power: D.supply || '',
    }, D.pins))}</div>` : '',
    D.pins ? table(['Peripheral', 'Peripheral pin', 'Controller pin', 'Signal'],
      [].concat(D.pins.left || [], D.pins.right || []).map(c =>
        [`<b>${esc(c.dev)}</b>`, esc(c.devPin || '—'), `<code>${esc(c.pin)}</code>`, esc(c.sig || '—')]),
      'Wire one row at a time and tick it off — most "it does not work" reports trace back to a single swapped pair.') : '',
    D.wiringNotes ? `<h3>Wiring explanation</h3>${ul(D.wiringNotes)}` : '',
    D.timing ? S.timingDiagram(D.timing) : '',
    D.images && D.images[1] ? photo(D.images[1], D.imageCaptions && D.imageCaptions[1]) : '',
  ].join('\n')));

  /* 11 ── Architecture */
  add(section('architecture', 'System Architecture', [
    p(D.archIntro || 'Read the stack from the bottom up: physical hardware, the firmware that drives it, the transport that moves data off the device, and the software a human actually looks at.'),
    D.layers ? S.layerDiagram({ title: D.title + ' — architecture stack', desc: 'Layered architecture from hardware to user interface.', layers: D.layers }) : '',
    D.archNotes ? paras(D.archNotes) : '',
  ].join('\n')));

  /* 12 ── Working principle */
  add(section('principle', 'Working Principle', [
    paras(D.principle),
    D.principleTable ? table(D.principleTable.head, D.principleTable.rows, D.principleTable.caption) : '',
    D.equations ? `<h3>The maths behind it</h3>${D.equations.map(e =>
      `<h4>${esc(e.t)}</h4>${codeBlock({ file: e.t, lang: 'plain', body: e.eq })}${e.d ? p(e.d) : ''}`).join('')}` : '',
  ].join('\n')));

  /* 13 ── Flowchart */
  add(section('flowchart', 'Program Flowchart', [
    p(D.flowIntro || 'The firmware is a single cooperative loop. Nothing blocks for long, so networking, sensing and the user interface all stay responsive.'),
    D.flow ? S.flowchart({ title: D.title + ' — firmware flowchart', desc: 'Control flow through the main program loop.', steps: D.flow }) : '',
  ].join('\n')));

  /* 14 ── Assembly */
  add(section('assembly', 'Assembly Instructions', [
    p(D.assemblyIntro || 'Build on a breadboard first and only commit to solder once the whole system has run for an hour without a fault.'),
    D.assembly ? `<ol class="steps">${D.assembly.map(a =>
      `<li><h4>${esc(a.h)}</h4>${paras(a.p)}${a.warn ? callout('warn', 'Watch out', p(a.warn)) : ''}</li>`).join('')}</ol>` : '',
  ].join('\n')));

  /* 15 ── Implementation steps */
  add(section('implementation', 'Step-by-Step Implementation Guide', [
    p(D.stepsIntro || 'Work through these in order. Each step ends in something you can observe, so a failure is always localised to the step you just finished.'),
    D.steps ? `<ol class="steps">${D.steps.map(s =>
      `<li><h4>${esc(s.h)}</h4>${paras(s.p)}${s.code ? codeBlock(s.code) : ''}${s.tip ? callout('tip', 'Tip', p(s.tip)) : ''}</li>`).join('')}</ol>` : '',
  ].join('\n')));

  /* 16 ── Source code */
  add(section('source', 'Complete Source Code', [
    p(D.codeIntro || 'The listing below is complete and compiles as written — there are no elided sections. Read the annotations under each block before you upload it.'),
    (D.code || []).map(codeBlock).join('\n'),
    callout('note', 'Licence', '<p>This code is published for learning. Reuse it freely in your own projects and course work; a link back to this page is appreciated when you publish something derived from it.</p>'),
  ].join('\n')));

  /* 17 ── Configuration */
  add(section('configuration', 'Configuration & Calibration', [
    D.config ? `<h3>Configuration steps</h3>${ul(D.config)}` : '',
    D.calibration ? `<h3>Calibration procedure</h3>${p(D.calibrationIntro || 'An uncalibrated sensor produces confident, precise, wrong numbers. Do this once per physical unit and record the constants.')}<ol class="steps">${D.calibration.map(c => `<li><h4>${esc(c.h)}</h4>${paras(c.p)}${c.code ? codeBlock(c.code) : ''}</li>`).join('')}</ol>` : '',
  ].join('\n')));

  /* 18 ── Domain extras: IoT */
  if (D.iot) {
    const N = D.iot;
    add(section('connectivity', 'Network Architecture & Connectivity', [
      N.intro ? paras(N.intro) : '',
      N.net ? `<div class="diagram-scroll">${S.networkDiagram(Object.assign({ title: D.title + ' — network topology', desc: 'Path taken by telemetry from field node to end user.' }, N.net))}</div>` : '',
      N.protocol ? `<h3>Communication protocol</h3>${paras(N.protocol)}` : '',
      N.topics ? table(['Topic / endpoint', 'Direction', 'Payload'], N.topics.map(t => [`<code>${esc(t.t)}</code>`, esc(t.dir), esc(t.payload)]), 'Message contract between the device and the broker.') : '',
      N.cloud ? `<h3>Cloud platform configuration</h3>${paras(N.cloud)}` : '',
      N.cloudCode ? N.cloudCode.map(codeBlock).join('\n') : '',
      N.dashboard ? `<h3>Dashboard setup</h3>${paras(N.dashboard)}` : '',
      N.mobile ? `<h3>Mobile app integration</h3>${paras(N.mobile)}` : '',
      N.security ? `<h3>Security considerations</h3>${ul(N.security, 'check')}` : '',
    ].join('\n')));
  }

  /* 19 ── Domain extras: AI */
  if (D.ai) {
    const A = D.ai;
    add(section('model', 'Dataset, Model & Training', [
      A.dataset ? `<h3>Dataset</h3>${paras(A.dataset)}` : '',
      A.datasetTable ? table(['Dataset', 'Size', 'Licence', 'Use here'], A.datasetTable.map(d => [`<b>${esc(d.n)}</b>`, esc(d.size), esc(d.lic), esc(d.use)])) : '',
      A.preprocess ? `<h3>Data preprocessing</h3>${ul(A.preprocess)}` : '',
      A.preprocessCode ? codeBlock(A.preprocessCode) : '',
      A.pipeline ? `<div class="diagram-scroll">${S.pipelineDiagram({ title: D.title + ' — ML pipeline', desc: 'From raw data through training to deployed inference.', stages: A.pipeline })}</div>` : '',
      A.arch ? `<h3>Model architecture</h3>${paras(A.arch)}` : '',
      A.archTable ? table(['Layer / stage', 'Shape or configuration', 'Purpose'], A.archTable.map(l => [`<b>${esc(l.l)}</b>`, `<code>${esc(l.s)}</code>`, esc(l.p)])) : '',
      A.trainCode ? A.trainCode.map(codeBlock).join('\n') : '',
      A.hyper ? `<h3>Hyperparameters</h3>${table(['Hyperparameter', 'Value', 'Why'], A.hyper.map(h => [`<b>${esc(h.k)}</b>`, `<code>${esc(h.v)}</code>`, esc(h.w)]))}` : '',
      A.training ? `<h3>Training process</h3>${ul(A.training)}` : '',
    ].join('\n')));

    add(section('evaluation', 'Evaluation, Metrics & Deployment', [
      A.metricsIntro ? paras(A.metricsIntro) : '',
      A.metrics ? table(['Metric', 'Value', 'What it tells you'], A.metrics.map(m => [`<b>${esc(m.m)}</b>`, `<code>${esc(m.v)}</code>`, esc(m.d)]), 'Figures from the reference training run described above — reproduce them before trusting your own changes.') : '',
      A.chart ? S.barChart(A.chart) : '',
      A.evalCode ? codeBlock(A.evalCode) : '',
      A.deploy ? `<h3>Deployment</h3>${ul(A.deploy)}` : '',
      A.inference ? `<h3>Inference example</h3>${codeBlock(A.inference)}` : '',
      A.limits ? callout('warn', 'Known limitations', paras(A.limits)) : '',
    ].join('\n')));
  }

  /* 20 ── Domain extras: robotics */
  if (D.robotics) {
    const R = D.robotics;
    add(section('mechanics', 'Mechanical Assembly & Motion', [
      R.mechanical ? `<h3>Mechanical assembly</h3>${ul(R.mechanical)}` : '',
      R.motion ? `<h3>Motion logic</h3>${paras(R.motion)}` : '',
      R.motionTable ? table(['State', 'Left motor', 'Right motor', 'Result'], R.motionTable.map(m => [`<b>${esc(m.s)}</b>`, esc(m.l), esc(m.r), esc(m.o)])) : '',
      R.sensors ? `<h3>Sensor integration</h3>${ul(R.sensors)}` : '',
      R.actuators ? `<h3>Actuator explanation</h3>${paras(R.actuators)}` : '',
      R.kinematics ? `<h3>Kinematics</h3>${paras(R.kinematics.text)}${R.kinematics.eq ? codeBlock({ file: 'kinematics', lang: 'plain', body: R.kinematics.eq }) : ''}` : '',
    ].join('\n')));
  }

  /* 21 ── Domain extras: electronics */
  if (D.electronics) {
    const E = D.electronics;
    add(section('electronics', 'Electronics: PCB, Ratings & Pin Detail', [
      E.pcb ? `<h3>PCB information</h3>${ul(E.pcb)}` : '',
      E.calcs ? `<h3>Power calculations</h3>${E.calcs.map(c => `<h4>${esc(c.t)}</h4>${codeBlock({ file: c.t, lang: 'plain', body: c.eq })}${c.d ? p(c.d) : ''}`).join('')}` : '',
      E.ratings ? table(['Parameter', 'Rating', 'Design margin'], E.ratings.map(r => [`<b>${esc(r.p)}</b>`, esc(r.r), esc(r.m)]), 'Never operate a part beyond about 70 % of its absolute maximum rating.') : '',
      E.pinout ? `<h3>Pin diagram</h3>${table(['Pin', 'Function', 'Note'], E.pinout.map(x => [`<code>${esc(x.p)}</code>`, esc(x.f), esc(x.n || '—')]))}` : '',
    ].join('\n')));
  }

  /* 22 ── Testing */
  add(section('testing', 'Testing Procedure & Expected Output', [
    p(D.testIntro || 'Test from the bottom up. Confirm power, then each sensor in isolation, then the integrated loop — the first failing step tells you exactly where to look.'),
    D.testing ? table(['Test', 'What you should see'], D.testing.map(t => [`<b>${esc(t.step)}</b>`, t.expect]), 'Bench-test checklist. If a row fails, stop and fix it before moving on.') : '',
    D.output ? `<h3>Expected output</h3>${D.output.map(o => typeof o === 'string' ? p(o) : codeBlock(o)).join('\n')}` : '',
    D.images && D.images[2] ? photo(D.images[2], D.imageCaptions && D.imageCaptions[2]) : '',
  ].join('\n')));

  /* 23 ── Troubleshooting */
  add(section('troubleshooting', 'Troubleshooting: Common Errors & Fixes',
    D.troubleshoot ? `<div class="faq">${D.troubleshoot.map(t =>
      `<details class="expand"><summary>${esc(t.sym)}</summary><div class="inner">
        <p><strong>Likely cause.</strong> ${t.cause}</p>
        <p><strong>Fix.</strong> ${t.fix}</p></div></details>`).join('')}</div>` : ''));

  /* 24 ── Optimisation */
  add(section('optimisation', 'Performance Optimisation', [
    D.perfIntro ? paras(D.perfIntro) : '',
    ul(D.perf, 'check'),
  ].join('\n')));

  /* 25 ── Safety */
  add(section('safety', 'Safety Precautions', [
    D.safetyLead ? callout('danger', 'Read this first', paras(D.safetyLead)) : '',
    ul(D.safety),
  ].join('\n')));

  /* 26 ── Maintenance */
  add(section('maintenance', 'Maintenance', ul(D.maintenance)));

  /* 27 ── Future work */
  add(section('future', 'Future Improvements & Upgrades', [
    p(D.futureIntro || 'A working v1 is a platform, not a finish line. These are the upgrades that add the most capability for the least rework.'),
    ul(D.future, 'check'),
  ].join('\n')));

  /* 28 ── FAQ */
  add(section('faq', 'Frequently Asked Questions',
    D.faq ? `<div class="faq">${D.faq.map(f =>
      `<details class="expand"><summary>${esc(f.q)}</summary><div class="inner">${paras([f.a])}</div></details>`).join('')}</div>` : ''));

  /* 29 ── References */
  add(section('references', 'References & Learning Resources', [
    p('These are the primary sources worth reading in full. Manufacturer datasheets always outrank forum posts when the two disagree.'),
    D.refs ? `<ol class="reflist">${D.refs.map(r =>
      `<li><a href="${r.u}" rel="noopener nofollow" target="_blank">${esc(r.t)}</a><span class="src">${esc(r.s || new URL(r.u).hostname.replace(/^www\./, ''))}</span></li>`).join('')}</ol>` : '',
    callout('note', 'On originality', '<p>This guide was written from first principles against the datasheets and official documentation listed above. Where a technique is standard practice in the maker community it is described in the author\'s own words rather than reproduced, and any photograph carries a link to its source.</p>'),
  ].join('\n')));

  return out;
}

/* ── table of contents ─────────────────────────────────────────── */
function tocHTML(sections, idSuffix) {
  return `<nav class="toc-nav" aria-label="Table of contents${idSuffix ? ' (mobile)' : ''}">
    <ol>${sections.map((s, i) =>
    `<li><a href="#${s.id}"><span style="opacity:.55;font-variant-numeric:tabular-nums">${String(i + 1).padStart(2, '0')}</span>&nbsp; ${esc(s.title)}</a></li>`).join('')}</ol>
  </nav>`;
}

/* ── structured data ───────────────────────────────────────────── */
function jsonld(spec, ctx) {
  const url = `${SITE}/projects/docs/${spec.slug}.html`;
  const howToSteps = (spec.steps || []).slice(0, 12).map((s, i) => ({
    '@type': 'HowToStep', position: i + 1, name: s.h,
    text: (s.p && s.p[0] || s.h).replace(/<[^>]+>/g, '').slice(0, 300),
  }));
  const supplies = (spec.parts || []).map(id => COMPONENTS[id]).filter(Boolean)
    .map(c => ({ '@type': 'HowToSupply', name: c.name }));

  const blocks = [{
    '@context': 'https://schema.org', '@type': 'TechArticle',
    '@id': url + '#article',
    headline: `${spec.title} — Complete Build Guide`,
    name: spec.title,
    description: spec.seoDesc,
    url, inLanguage: 'en',
    articleSection: spec.cat,
    keywords: (spec.keywords || []).join(', '),
    proficiencyLevel: spec.difficulty,
    dependencies: (spec.libs || []).map(l => (LIBRARIES[l] || {}).name).filter(Boolean).join(', '),
    author: { '@type': 'Person', name: AUTHOR, url: SITE + '/' },
    publisher: { '@type': 'Person', name: AUTHOR, url: SITE + '/' },
    datePublished: ctx.published, dateModified: ctx.modified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@type': 'Collection', name: 'Project Documentation', url: SITE + '/projects/docs/' },
  }, {
    '@context': 'https://schema.org', '@type': 'HowTo',
    '@id': url + '#howto',
    name: `How to build a ${spec.title}`,
    description: spec.seoDesc,
    totalTime: spec.iso8601 || 'PT8H',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: String(bomTotal(spec)) },
    supply: supplies,
    tool: (spec.tools || []).slice(0, 8).map(t => ({ '@type': 'HowToTool', name: String(t).replace(/<[^>]+>/g, '').slice(0, 80) })),
    step: howToSteps,
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: AUTHOR, item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: SITE + '/projects/' },
      { '@type': 'ListItem', position: 3, name: 'Documentation', item: SITE + '/projects/docs/' },
      { '@type': 'ListItem', position: 4, name: spec.title, item: url },
    ],
  }];

  if (spec.faq && spec.faq.length) {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: spec.faq.map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: String(f.a).replace(/<[^>]+>/g, '') },
      })),
    });
  }
  return blocks.map(b => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n  ');
}

/* ── hero thumbnail ────────────────────────────────────────────── */
function thumbnail(spec) {
  const label = spec.no || spec.id;
  return `<div class="thumb">${S.boardIllustration(spec.thumb || 'sensor', `${spec.title} — reference build illustration`).replace('<figcaption>', '<figcaption hidden>')}</div>`;
}

/* ── the page ──────────────────────────────────────────────────── */
function renderPage(spec, ctx) {
  const sections = buildSections(spec, ctx);
  const url = `${SITE}/projects/docs/${spec.slug}.html`;
  const accent = ctx.accent || { c: '#22d3ee', l: '#67e8f9', rgb: '34,211,238' };
  const words = sections.reduce((n, s) => n + s.html.replace(/<[^>]+>/g, ' ').split(/\s+/).length, 0);
  const readMin = Math.max(6, Math.round(words / 220));

  const prev = ctx.prev, next = ctx.next;
  const related = ctx.related || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>${esc(spec.seoTitle)}</title>
  <meta name="description" content="${esc(spec.seoDesc)}" />
  <meta name="keywords" content="${esc((spec.keywords || []).join(', '))}" />
  <meta name="author" content="${AUTHOR}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="theme-color" content="#060c1a" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${AUTHOR}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(spec.seoTitle)}" />
  <meta property="og:description" content="${esc(spec.seoDesc)}" />
  <meta property="og:locale" content="en_IN" />
  <meta property="article:author" content="${AUTHOR}" />
  <meta property="article:section" content="${esc(spec.cat)}" />
  <meta property="article:published_time" content="${ctx.published}" />
  <meta property="article:modified_time" content="${ctx.modified}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(spec.title)} — Complete Build Guide" />
  <meta name="twitter:description" content="${esc(spec.seoDesc)}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" /></noscript>

  <link rel="stylesheet" href="../doc.css" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='14' fill='%23060c1a'/><text x='50' y='68' text-anchor='middle' font-size='50'>${spec.emoji || '🔧'}</text></svg>" />
  <style>:root{--acc:${accent.c};--acc-light:${accent.l};--acc-rgb:${accent.rgb}}</style>
  <script>(function(){try{var t=localStorage.getItem('sk-doc-theme');
    if(!t)t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
    if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();</script>

  ${jsonld(spec, ctx)}
</head>
<body>

<a href="#main" class="skip-link">Skip to documentation</a>
<div id="readprog" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100"></div>

<header class="docnav">
  <div class="docnav-in">
    <a href="../../index.html" class="brand" aria-label="${AUTHOR} — home">
      <span class="mono" aria-hidden="true">SK</span><span>${AUTHOR}</span>
    </a>
    <ul class="docnav-links">
      <li><a href="../index.html">All Projects</a></li>
      <li><a href="../iot.html">IoT</a></li>
      <li><a href="../ai.html">AI &amp; Advanced</a></li>
      <li><a href="index.html">Docs Index</a></li>
      <li><a href="../../journal/index.html">Journal</a></li>
    </ul>
    <div class="docnav-tools">
      <button class="icon-btn" id="findToggle" type="button" aria-label="Search within this page" title="Search this page (Ctrl+F)">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.6-3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
      <button class="icon-btn" id="printBtn" type="button" aria-label="Print this guide" title="Print / save as PDF">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 9V4h10v5M7 19H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 15h10v5H7z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
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
        <a href="index.html">Documentation</a><span class="sep">/</span>
        <a href="index.html#${esc(ctx.catSlug)}">${esc(spec.cat)}</a><span class="sep">/</span>
        <span aria-current="page">${esc(spec.title)}</span>
      </nav>

      <div class="hero-grid">
        <div>
          <span class="kicker">Project ${esc(spec.no || spec.id)} · ${esc(spec.cat)}</span>
          <h1>${esc(spec.title)}<span class="grad">.</span></h1>
          <p class="tagline">${spec.tagline}</p>
          <div class="hero-chips">
            <span class="chip lv-${spec.difficulty.toLowerCase()}">${esc(spec.difficulty)}</span>
            <span class="chip">${esc(spec.hours)}</span>
            <span class="chip neutral">${readMin} min read</span>
            ${(spec.tags || []).map(t => `<span class="chip neutral">${esc(t)}</span>`).join('')}
          </div>
          <div class="hero-actions">
            <button class="btn solid" id="downloadAll" type="button">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 19h16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Download all code
            </button>
            <a class="btn" href="#source">Jump to source</a>
            <a class="btn ghost" href="#bom">Bill of materials</a>
          </div>
        </div>
        <div>${thumbnail(spec)}</div>
      </div>

      <div class="infopanel">
        <dl>
          <div class="infocell"><dt>Difficulty</dt><dd>${esc(spec.difficulty)}</dd></div>
          <div class="infocell"><dt>Build time</dt><dd>${esc(spec.hours)}</dd></div>
          <div class="infocell"><dt>Indicative cost</dt><dd>${esc(spec.cost || inr(bomTotal(spec)))}</dd></div>
          <div class="infocell"><dt>Platform</dt><dd>${esc(spec.platformName || '—')}</dd></div>
          <div class="infocell"><dt>Category</dt><dd>${esc(spec.cat)}</dd></div>
          <div class="infocell"><dt>Last updated</dt><dd>${esc(ctx.modifiedLabel)}</dd></div>
        </dl>
      </div>
    </div>
  </div>

  <div class="doc-layout">

    <div class="doc-toc-wrap">
      <p class="toc-head">On this page</p>
      <div class="toc-search">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.6-3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <input type="search" placeholder="Filter sections…" aria-label="Filter table of contents" />
      </div>
      ${tocHTML(sections)}
      <div class="toc-progress">
        <div class="bar"><i id="tocProgBar"></i></div>
        <span id="tocProgPct">0% read</span>
      </div>
    </div>

    <article class="doc-body">
      <details class="toc-mobile">
        <summary>Contents — ${sections.length} sections</summary>
        <div class="toc-search" style="margin-top:.7rem">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.6-3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <input type="search" placeholder="Filter sections…" aria-label="Filter table of contents" />
        </div>
        ${tocHTML(sections, 'm')}
      </details>

      ${sections.map(s => s.html).join('\n\n')}

      <nav class="pagenav" aria-label="Previous and next project">
        ${prev ? `<a class="prev" href="${prev.slug}.html"><span class="dir">← Previous project</span><span class="ttl">${esc(prev.title)}</span></a>`
      : '<span class="prev disabled"></span>'}
        ${next ? `<a class="next" href="${next.slug}.html"><span class="dir">Next project →</span><span class="ttl">${esc(next.title)}</span></a>`
      : '<span class="next disabled"></span>'}
      </nav>
    </article>

    <aside class="doc-aside-right" aria-label="Project summary">
      <div class="rail-card">
        <h4>At a glance</h4>
        <div class="rail-stat"><span>Level</span><b>${esc(spec.difficulty)}</b></div>
        <div class="rail-stat"><span>Time</span><b>${esc(spec.hours)}</b></div>
        <div class="rail-stat"><span>Parts</span><b>${(spec.parts || []).length + (spec.extraParts || []).length}</b></div>
        <div class="rail-stat"><span>Cost</span><b>${esc(spec.cost || inr(bomTotal(spec)))}</b></div>
        <div class="rail-stat"><span>Sections</span><b>${sections.length}</b></div>
      </div>
      ${related.length ? `<div class="rail-card">
        <h4>Related builds</h4>
        <ul>${related.map(r => `<li><a href="${r.slug}.html">${esc(r.title)}</a></li>`).join('')}</ul>
      </div>` : ''}
      <div class="rail-card">
        <h4>Shortcuts</h4>
        <p class="meta"><code>Ctrl</code>+<code>F</code> search this page · <code>←</code> <code>→</code> previous / next project · <code>/</code> quick find</p>
      </div>
    </aside>
  </div>

  ${related.length ? `<section class="container" style="padding:2.4rem 0 1rem" aria-labelledby="h-related">
    <h2 id="h-related" style="font-family:var(--f-display);font-size:1.55rem;margin-bottom:1rem">Related Projects</h2>
    <div class="relgrid">
      ${related.map(r => `<a class="relcard" href="${r.slug}.html">
        <span class="rc">${esc(r.cat)}</span>
        <h4>${esc(r.title)}</h4>
        <p>${esc(r.desc)}</p></a>`).join('')}
    </div>
  </section>` : ''}

</main>

<div id="findbar" role="search" aria-label="Find on page">
  <input type="search" placeholder="Find in this guide…" aria-label="Find text in this guide" />
  <span class="fcount" aria-live="polite"></span>
  <button type="button" data-find-prev aria-label="Previous match">↑</button>
  <button type="button" data-find-next aria-label="Next match">↓</button>
  <button type="button" data-find-close aria-label="Close find bar">✕</button>
</div>

<button class="back-to-top" id="backToTop" type="button" aria-label="Back to top">
  <svg viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true"><path d="M10 15V5M6 9l4-4 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>

<footer class="doc-footer">
  <div class="container">
    <div class="mono" aria-hidden="true">SK</div>
    <p><strong>${esc(spec.title)}</strong> — part of the ${ctx.total}-project engineering documentation library by ${AUTHOR}.</p>
    <nav class="footer-nav" aria-label="Footer navigation">
      <a href="../../index.html">Portfolio</a>
      <a href="../index.html">All Projects</a>
      <a href="index.html">Docs Index</a>
      <a href="../iot.html">IoT</a>
      <a href="../ai.html">AI &amp; Advanced</a>
      <a href="../../journal/index.html">Journal</a>
      <a href="../../index.html#contact">Contact</a>
    </nav>
    <p>&copy; <span class="yr">2026</span> ${AUTHOR}. Documentation published for educational use.</p>
  </div>
</footer>

<script src="../doc.js" defer></script>
</body>
</html>`;
}

module.exports = { renderPage, buildSections, bomTotal, codeBlock, table, callout, photo, inr };
