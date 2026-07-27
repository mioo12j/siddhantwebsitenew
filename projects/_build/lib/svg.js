/* ═══════════════════════════════════════════════════════════════════
   svg.js — programmatic diagram generators for project documentation.

   Every diagram is emitted as inline, theme-aware SVG. Colours come from
   CSS custom properties (--dg-*) declared in doc.css so a single SVG
   renders correctly in both light and dark mode, and prints cleanly.

   Exports:
     blockDiagram(spec)     — column-based system block diagram
     flowchart(steps)       — vertical program flowchart with decisions
     wiringDiagram(spec)    — MCU-centred wiring/connection schematic
     layerDiagram(spec)     — layered architecture stack
     networkDiagram(spec)   — IoT node → gateway → cloud → client topology
     pipelineDiagram(spec)  — left-to-right ML/data pipeline
     barChart(spec)         — small metric bar chart
     timingDiagram(spec)    — digital timing / protocol waveform
     boardIllustration(id)  — stylised board / component illustration
════════════════════════════════════════════════════════════════════ */
'use strict';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── shared <defs>: arrow markers, glows, gradients ───────────────── */
function defs(id) {
  return `<defs>
    <marker id="ar-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0.6 L10 5 L0 9.4 z" fill="var(--dg-line)"/>
    </marker>
    <marker id="arh-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0.6 L10 5 L0 9.4 z" fill="var(--dg-accent)"/>
    </marker>
    <linearGradient id="gb-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--dg-box-a)"/><stop offset="100%" stop-color="var(--dg-box-b)"/>
    </linearGradient>
    <linearGradient id="ga-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--dg-acc-a)"/><stop offset="100%" stop-color="var(--dg-acc-b)"/>
    </linearGradient>
  </defs>`;
}

/* Wrap text to a pixel width, returning an array of lines. */
function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (!line) { line = w; continue; }
    if ((line + ' ' + w).length <= maxChars) line += ' ' + w;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(text, x, y, maxChars, lh) {
  const lines = wrap(text, maxChars);
  const start = y - ((lines.length - 1) * lh) / 2;
  return lines.map((l, i) =>
    `<tspan x="${x}" y="${(start + i * lh).toFixed(1)}">${esc(l)}</tspan>`).join('');
}

let uid = 0;
const nextId = () => 'd' + (++uid);

function frame(w, h, title, desc, body, cls) {
  const id = nextId();
  return `<figure class="diagram ${cls || ''}">
  <svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t${id} s${id}" preserveAspectRatio="xMidYMid meet" class="dg">
    <title id="t${id}">${esc(title)}</title><desc id="s${id}">${esc(desc)}</desc>
    ${defs(id)}
    ${body(id)}
  </svg>
  <figcaption>${esc(title)}</figcaption>
</figure>`;
}

/* ═════════════════════════════════════════════════════════════════
   1. BLOCK DIAGRAM
   spec = { title, desc, columns:[{ label, blocks:[{name, sub}] }] }
   Blocks flow left → right, one arrow per column boundary.
═══════════════════════════════════════════════════════════════════ */
function blockDiagram(spec) {
  const cols = spec.columns;
  const BW = 178, GAPX = 62, PADX = 26, PADY = 54, BH = 62, GAPY = 18;
  const rows = Math.max(...cols.map(c => c.blocks.length));
  const W = PADX * 2 + cols.length * BW + (cols.length - 1) * GAPX;
  const H = PADY + rows * BH + (rows - 1) * GAPY + 34;

  return frame(W, H, spec.title, spec.desc, (id) => {
    let out = '';
    const colX = i => PADX + i * (BW + GAPX);

    cols.forEach((c, ci) => {
      const x = colX(ci);
      out += `<text class="dg-col" x="${x + BW / 2}" y="26" text-anchor="middle">${esc(c.label)}</text>`;
      const n = c.blocks.length;
      const totalH = n * BH + (n - 1) * GAPY;
      const y0 = PADY + ((rows * BH + (rows - 1) * GAPY) - totalH) / 2;

      c.blocks.forEach((b, bi) => {
        const y = y0 + bi * (BH + GAPY);
        const hi = !!b.highlight;
        out += `<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="12"
          fill="url(#${hi ? 'ga' : 'gb'}-${id})" stroke="${hi ? 'var(--dg-accent)' : 'var(--dg-stroke)'}" stroke-width="1.2"/>`;
        const hasSub = !!b.sub;
        out += `<text class="dg-b" x="${x + BW / 2}" y="${y + (hasSub ? 25 : BH / 2 + 1)}" text-anchor="middle">${tspans(b.name, x + BW / 2, y + (hasSub ? 25 : BH / 2 + 1), 22, 13)}</text>`;
        if (hasSub) out += `<text class="dg-s" x="${x + BW / 2}" y="${y + 44}" text-anchor="middle">${tspans(b.sub, x + BW / 2, y + 44, 28, 11)}</text>`;
      });
    });

    /* arrows between adjacent columns */
    for (let ci = 0; ci < cols.length - 1; ci++) {
      const xa = colX(ci) + BW, xb = colX(ci + 1);
      const a = cols[ci].blocks.length, b = cols[ci + 1].blocks.length;
      const cy = k => {
        const n = k === 0 ? a : b;
        const totalH = n * BH + (n - 1) * GAPY;
        return PADY + ((rows * BH + (rows - 1) * GAPY) - totalH) / 2;
      };
      const ya = cy(0) + (a * BH + (a - 1) * GAPY) / 2;
      const yb = cy(1) + (b * BH + (b - 1) * GAPY) / 2;
      const mid = (xa + xb) / 2;
      out += `<path d="M${xa + 4} ${ya} C ${mid} ${ya}, ${mid} ${yb}, ${xb - 8} ${yb}"
        fill="none" stroke="var(--dg-line)" stroke-width="1.5" marker-end="url(#ar-${id})"/>`;
      if (cols[ci + 1].edge)
        out += `<text class="dg-e" x="${mid}" y="${(ya + yb) / 2 - 8}" text-anchor="middle">${esc(cols[ci + 1].edge)}</text>`;
    }
    return out;
  }, 'diagram-block');
}

/* ═════════════════════════════════════════════════════════════════
   2. FLOWCHART
   steps = [{ t:'text', k:'start|proc|io|dec|end', yes:'', no:'' }]
   A decision node draws a right-hand loop-back arrow labelled `no`.
═══════════════════════════════════════════════════════════════════ */
function flowchart(spec) {
  const steps = spec.steps;
  const W = 560, BW = 250, CX = 210, GAP = 30;
  const hOf = s => (s.k === 'dec' ? 84 : 56);
  let H = 30;
  const ys = steps.map(s => { const y = H; H += hOf(s) + GAP; return y; });
  H += 10;

  return frame(W, H, spec.title || 'Program flowchart', spec.desc || 'Flow of control through the firmware main loop.', (id) => {
    let out = '';
    steps.forEach((s, i) => {
      const y = ys[i], h = hOf(s), cx = CX, cy = y + h / 2;
      const x = cx - BW / 2;
      if (s.k === 'dec') {
        const hw = BW / 2 + 14, hh = h / 2;
        out += `<path d="M${cx} ${cy - hh} L${cx + hw} ${cy} L${cx} ${cy + hh} L${cx - hw} ${cy} z"
          fill="url(#ga-${id})" stroke="var(--dg-accent)" stroke-width="1.2"/>`;
      } else if (s.k === 'start' || s.k === 'end') {
        out += `<rect x="${x}" y="${y}" width="${BW}" height="${h}" rx="${h / 2}"
          fill="url(#ga-${id})" stroke="var(--dg-accent)" stroke-width="1.2"/>`;
      } else if (s.k === 'io') {
        out += `<path d="M${x + 16} ${y} L${x + BW} ${y} L${x + BW - 16} ${y + h} L${x} ${y + h} z"
          fill="url(#gb-${id})" stroke="var(--dg-stroke)" stroke-width="1.2"/>`;
      } else {
        out += `<rect x="${x}" y="${y}" width="${BW}" height="${h}" rx="10"
          fill="url(#gb-${id})" stroke="var(--dg-stroke)" stroke-width="1.2"/>`;
      }
      out += `<text class="dg-b" x="${cx}" y="${cy}" text-anchor="middle">${tspans(s.t, cx, cy, s.k === 'dec' ? 26 : 30, 13)}</text>`;

      if (i < steps.length - 1) {
        const ny = ys[i + 1];
        out += `<path d="M${cx} ${y + h} L${cx} ${ny - 6}" stroke="var(--dg-line)" stroke-width="1.5" fill="none" marker-end="url(#ar-${id})"/>`;
        if (s.k === 'dec') out += `<text class="dg-e" x="${cx + 10}" y="${y + h + GAP / 2 + 4}">${esc(s.yes || 'yes')}</text>`;
      }
      /* decision "no" branch loops back to the target step */
      if (s.k === 'dec' && s.no) {
        const back = typeof s.back === 'number' ? s.back : i;
        const by = ys[back] - 6;
        const rx = CX + BW / 2 + 62;
        out += `<path d="M${cx + BW / 2 + 14} ${cy} H${rx} V${by + 4} H${cx + 8}"
          stroke="var(--dg-line)" stroke-width="1.4" fill="none" stroke-dasharray="5 4" marker-end="url(#ar-${id})"/>`;
        out += `<text class="dg-e" x="${rx + 6}" y="${cy - 6}">${esc(s.no)}</text>`;
      }
    });
    return out;
  }, 'diagram-flow');
}

/* ═════════════════════════════════════════════════════════════════
   3. WIRING DIAGRAM
   spec = { mcu:'ESP32-WROOM-32', left:[{pin,dev,sig}], right:[{pin,dev,sig}], power:'5 V' }
   Draws the controller in the middle with labelled wires fanning out.
═══════════════════════════════════════════════════════════════════ */
const WIRE_COLORS = ['#e0534f', '#f0a63c', '#4fb0e0', '#5ec27a', '#b07ae0', '#e07ab0', '#3cc7c0', '#c4a24a'];

function wiringDiagram(spec) {
  const L = spec.left || [], R = spec.right || [];
  const rows = Math.max(L.length, R.length, 3);
  const ROW = 52, PADT = 74, DEVW = 190, MCUW = 176, GAP = 136;
  const W = DEVW * 2 + MCUW + GAP * 2 + 40;
  const H = PADT + rows * ROW + 34;
  const mcuX = 20 + DEVW + GAP, mcuY = PADT - 16, mcuH = rows * ROW + 12;

  return frame(W, H, spec.title || `Wiring — ${spec.mcu}`, spec.desc || 'Signal-level connection map between the controller and every peripheral.', (id) => {
    let out = '';
    out += `<text class="dg-col" x="${20 + DEVW / 2}" y="30" text-anchor="middle">Sensors / Inputs</text>`;
    out += `<text class="dg-col" x="${mcuX + MCUW / 2}" y="30" text-anchor="middle">Controller</text>`;
    out += `<text class="dg-col" x="${W - 20 - DEVW / 2}" y="30" text-anchor="middle">Actuators / Outputs</text>`;

    /* controller body */
    out += `<rect x="${mcuX}" y="${mcuY}" width="${MCUW}" height="${mcuH}" rx="14"
      fill="url(#ga-${id})" stroke="var(--dg-accent)" stroke-width="1.4"/>`;
    out += `<rect x="${mcuX + 14}" y="${mcuY + 14}" width="${MCUW - 28}" height="26" rx="6" fill="var(--dg-chip)" opacity=".55"/>`;
    out += `<text class="dg-b" x="${mcuX + MCUW / 2}" y="${mcuY + 31}" text-anchor="middle">${tspans(spec.mcu, mcuX + MCUW / 2, mcuY + 31, 20, 12)}</text>`;
    if (spec.power)
      out += `<text class="dg-s" x="${mcuX + MCUW / 2}" y="${mcuY + mcuH - 12}" text-anchor="middle">${esc(spec.power)}</text>`;

    const drawSide = (list, side) => {
      list.forEach((c, i) => {
        const y = PADT + i * ROW + ROW / 2;
        const col = WIRE_COLORS[(side === 'L' ? i : i + 3) % WIRE_COLORS.length];
        const dx = side === 'L' ? 20 : W - 20 - DEVW;
        out += `<rect x="${dx}" y="${y - 17}" width="${DEVW}" height="34" rx="9"
          fill="url(#gb-${id})" stroke="var(--dg-stroke)" stroke-width="1.1"/>`;
        out += `<text class="dg-b" x="${dx + DEVW / 2}" y="${y + 1}" text-anchor="middle">${tspans(c.dev, dx + DEVW / 2, y + 1, 26, 12)}</text>`;

        const px = side === 'L' ? mcuX : mcuX + MCUW;
        const ex = side === 'L' ? dx + DEVW : dx;
        const mid = (px + ex) / 2;
        out += `<path d="M${ex} ${y} C ${mid} ${y}, ${mid} ${y}, ${px} ${y}" stroke="${col}" stroke-width="2" fill="none" opacity=".85"/>`;
        out += `<circle cx="${px}" cy="${y}" r="3.2" fill="${col}"/>`;
        out += `<text class="dg-p" x="${mid}" y="${y - 6}" text-anchor="middle">${esc(c.pin)}</text>`;
        if (c.sig) out += `<text class="dg-s" x="${mid}" y="${y + 15}" text-anchor="middle">${tspans(c.sig, mid, y + 15, 20, 11)}</text>`;
      });
    };
    drawSide(L, 'L'); drawSide(R, 'R');
    return out;
  }, 'diagram-wiring');
}

/* ═════════════════════════════════════════════════════════════════
   4. LAYER / ARCHITECTURE DIAGRAM
   spec = { title, layers:[{ name, items:[...], note }] }
═══════════════════════════════════════════════════════════════════ */
function layerDiagram(spec) {
  const L = spec.layers;
  const W = 660, PADX = 30, LH = 74, GAP = 14;
  const H = 46 + L.length * (LH + GAP);

  return frame(W, H, spec.title || 'System architecture', spec.desc || 'Layered view of the system from hardware up to the user interface.', (id) => {
    let out = '';
    L.forEach((l, i) => {
      const y = 30 + i * (LH + GAP);
      const hi = i === 0 || !!l.highlight;
      out += `<rect x="${PADX}" y="${y}" width="${W - PADX * 2}" height="${LH}" rx="12"
        fill="url(#${hi ? 'ga' : 'gb'}-${id})" stroke="${hi ? 'var(--dg-accent)' : 'var(--dg-stroke)'}" stroke-width="1.2"/>`;
      out += `<text class="dg-b" x="${PADX + 18}" y="${y + 26}">${esc(l.name)}</text>`;
      const items = (l.items || []).join('  ·  ');
      out += `<text class="dg-s" x="${PADX + 18}" y="${y + 48}">${tspans(items, PADX + 18, y + 48, 74, 12).replace(/text-anchor/g, '')}</text>`;
      if (i < L.length - 1) {
        const cx = W / 2;
        out += `<path d="M${cx} ${y + LH} L${cx} ${y + LH + GAP - 1}" stroke="var(--dg-line)" stroke-width="1.4" marker-end="url(#ar-${id})"/>`;
      }
    });
    return out;
  }, 'diagram-layers');
}

/* ═════════════════════════════════════════════════════════════════
   5. NETWORK DIAGRAM (IoT topology)
   spec = { nodes:[...], gateway, protocol, cloud, clients:[...] }
═══════════════════════════════════════════════════════════════════ */
function networkDiagram(spec) {
  const nodes = spec.nodes || [], clients = spec.clients || [];
  const W = 760, H = 60 + Math.max(nodes.length, clients.length, 2) * 66 + 40;
  const midY = H / 2 + 6;

  return frame(W, H, spec.title || 'Network architecture', spec.desc || 'How data travels from field nodes to the cloud and back to the user.', (id) => {
    let out = '';
    const box = (x, y, w, h, t, s, hi) => {
      let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11"
        fill="url(#${hi ? 'ga' : 'gb'}-${id})" stroke="${hi ? 'var(--dg-accent)' : 'var(--dg-stroke)'}" stroke-width="1.2"/>`;
      o += `<text class="dg-b" x="${x + w / 2}" y="${y + (s ? 22 : h / 2 + 1)}" text-anchor="middle">${tspans(t, x + w / 2, y + (s ? 22 : h / 2 + 1), 22, 12)}</text>`;
      if (s) o += `<text class="dg-s" x="${x + w / 2}" y="${y + 40}" text-anchor="middle">${esc(s)}</text>`;
      return o;
    };
    const NW = 168, GW = 150, CW = 150, KW = 158;
    const x0 = 16, x1 = x0 + NW + 62, x2 = x1 + GW + 72, x3 = x2 + CW + 72;

    out += `<text class="dg-col" x="${x0 + NW / 2}" y="26" text-anchor="middle">Edge nodes</text>`;
    out += `<text class="dg-col" x="${x1 + GW / 2}" y="26" text-anchor="middle">Gateway</text>`;
    out += `<text class="dg-col" x="${x2 + CW / 2}" y="26" text-anchor="middle">Cloud</text>`;
    out += `<text class="dg-col" x="${x3 + KW / 2}" y="26" text-anchor="middle">Clients</text>`;

    const startY = 52;
    nodes.forEach((n, i) => {
      const y = startY + i * 66;
      out += box(x0, y, NW, 52, n.name || n, n.sub || '');
      out += `<path d="M${x0 + NW} ${y + 26} H${x1 - 8}" stroke="var(--dg-line)" stroke-width="1.5" fill="none" marker-end="url(#ar-${id})"/>`;
    });
    if (spec.protocol)
      out += `<text class="dg-e" x="${(x0 + NW + x1) / 2}" y="${startY - 6}" text-anchor="middle">${esc(spec.protocol)}</text>`;

    out += box(x1, midY - 30, GW, 60, spec.gateway || 'Wi-Fi router', spec.gatewaySub || '', true);
    out += `<path d="M${x1 + GW} ${midY} H${x2 - 8}" stroke="var(--dg-accent)" stroke-width="1.6" fill="none" marker-end="url(#arh-${id})"/>`;
    if (spec.uplink)
      out += `<text class="dg-e" x="${(x1 + GW + x2) / 2}" y="${midY - 10}" text-anchor="middle">${esc(spec.uplink)}</text>`;

    out += box(x2, midY - 34, CW, 68, spec.cloud || 'Cloud broker', spec.cloudSub || '', true);

    clients.forEach((c, i) => {
      const y = startY + i * 66;
      out += box(x3, y, KW, 52, c.name || c, c.sub || '');
      out += `<path d="M${x2 + CW} ${midY} C ${x2 + CW + 34} ${midY}, ${x3 - 34} ${y + 26}, ${x3 - 8} ${y + 26}"
        stroke="var(--dg-line)" stroke-width="1.5" fill="none" marker-end="url(#ar-${id})"/>`;
    });
    return out;
  }, 'diagram-network');
}

/* ═════════════════════════════════════════════════════════════════
   6. PIPELINE DIAGRAM (ML / data flow)
   spec = { stages:[{name, sub}] }
═══════════════════════════════════════════════════════════════════ */
function pipelineDiagram(spec) {
  const S = spec.stages;
  const BW = 150, GAP = 44, PADX = 20;
  const perRow = Math.min(S.length, 4);
  const rowsN = Math.ceil(S.length / perRow);
  const W = PADX * 2 + perRow * BW + (perRow - 1) * GAP;
  const H = 44 + rowsN * 90 + (rowsN - 1) * 26;

  return frame(W, H, spec.title || 'Processing pipeline', spec.desc || 'Stage-by-stage data flow through the system.', (id) => {
    let out = '';
    S.forEach((s, i) => {
      const r = Math.floor(i / perRow), c = i % perRow;
      const x = PADX + c * (BW + GAP), y = 36 + r * 116;
      out += `<rect x="${x}" y="${y}" width="${BW}" height="82" rx="12"
        fill="url(#${s.highlight ? 'ga' : 'gb'}-${id})" stroke="${s.highlight ? 'var(--dg-accent)' : 'var(--dg-stroke)'}" stroke-width="1.2"/>`;
      out += `<circle cx="${x + 18}" cy="${y + 18}" r="11" fill="var(--dg-chip)"/>`;
      out += `<text class="dg-n" x="${x + 18}" y="${y + 22}" text-anchor="middle">${i + 1}</text>`;
      out += `<text class="dg-b" x="${x + BW / 2}" y="${y + 46}" text-anchor="middle">${tspans(s.name, x + BW / 2, y + 46, 20, 13)}</text>`;
      if (s.sub) out += `<text class="dg-s" x="${x + BW / 2}" y="${y + 68}" text-anchor="middle">${tspans(s.sub, x + BW / 2, y + 68, 24, 11)}</text>`;

      if (i < S.length - 1) {
        if (c < perRow - 1) {
          out += `<path d="M${x + BW + 4} ${y + 41} H${x + BW + GAP - 8}" stroke="var(--dg-line)" stroke-width="1.5" marker-end="url(#ar-${id})"/>`;
        } else {
          out += `<path d="M${x + BW / 2} ${y + 86} V${y + 100} H${PADX + BW / 2} V${y + 112}"
            stroke="var(--dg-line)" stroke-width="1.5" fill="none" marker-end="url(#ar-${id})"/>`;
        }
      }
    });
    return out;
  }, 'diagram-pipeline');
}

/* ═════════════════════════════════════════════════════════════════
   7. BAR CHART — small metric visualisation
   spec = { title, unit, bars:[{label, value, max}] }
═══════════════════════════════════════════════════════════════════ */
function barChart(spec) {
  const B = spec.bars, max = Math.max(...B.map(b => b.value)) * 1.15;
  const W = 620, PADL = 190, PADR = 66, ROW = 38;
  const H = 40 + B.length * ROW;

  return frame(W, H, spec.title || 'Measured performance', spec.desc || 'Benchmark figures recorded on the reference build.', (id) => {
    let out = `<line x1="${PADL}" y1="26" x2="${PADL}" y2="${H - 14}" stroke="var(--dg-stroke)" stroke-width="1"/>`;
    B.forEach((b, i) => {
      const y = 30 + i * ROW;
      const w = Math.max(4, ((W - PADL - PADR) * b.value) / max);
      out += `<text class="dg-b" x="${PADL - 12}" y="${y + 15}" text-anchor="end">${esc(b.label)}</text>`;
      out += `<rect x="${PADL + 1}" y="${y + 3}" width="${w}" height="20" rx="5" fill="url(#ga-${id})" stroke="var(--dg-accent)" stroke-width=".9"/>`;
      out += `<text class="dg-s" x="${PADL + w + 10}" y="${y + 17}">${esc(b.value + (spec.unit ? ' ' + spec.unit : ''))}</text>`;
    });
    return out;
  }, 'diagram-chart');
}

/* ═════════════════════════════════════════════════════════════════
   8. TIMING DIAGRAM — digital waveform for protocol explanation
   spec = { lines:[{name, pattern:'10101100'}], note }
═══════════════════════════════════════════════════════════════════ */
function timingDiagram(spec) {
  const L = spec.lines;
  const PADL = 130, UNIT = 34, HI = 16;
  const steps = Math.max(...L.map(l => l.pattern.length));
  const W = PADL + steps * UNIT + 30;
  const H = 34 + L.length * 58;

  return frame(W, H, spec.title || 'Signal timing', spec.desc || 'Logic-level timing of the bus signals.', (id) => {
    let out = '';
    L.forEach((l, i) => {
      const base = 46 + i * 58;
      out += `<text class="dg-b" x="${PADL - 12}" y="${base - 4}" text-anchor="end">${esc(l.name)}</text>`;
      let d = '', prev = null;
      for (let s = 0; s < l.pattern.length; s++) {
        const v = l.pattern[s] === '1' ? base - HI : base;
        const x = PADL + s * UNIT;
        if (prev === null) d += `M${x} ${v}`;
        else if (prev !== v) d += ` L${x} ${prev} L${x} ${v}`;
        d += ` L${x + UNIT} ${v}`;
        prev = v;
      }
      out += `<path d="${d}" fill="none" stroke="var(--dg-accent)" stroke-width="2" stroke-linejoin="round"/>`;
      out += `<line x1="${PADL}" y1="${base + 8}" x2="${PADL + steps * UNIT}" y2="${base + 8}" stroke="var(--dg-stroke)" stroke-width=".7" stroke-dasharray="3 4"/>`;
    });
    for (let s = 0; s <= steps; s++) {
      const x = PADL + s * UNIT;
      out += `<line x1="${x}" y1="26" x2="${x}" y2="${H - 16}" stroke="var(--dg-stroke)" stroke-width=".5" opacity=".45"/>`;
    }
    if (spec.note) out += `<text class="dg-s" x="${PADL}" y="${H - 4}">${esc(spec.note)}</text>`;
    return out;
  }, 'diagram-timing');
}

/* ═════════════════════════════════════════════════════════════════
   9. BOARD ILLUSTRATIONS — stylised component renderings used as
      in-page figures when a photograph is not available offline.
═══════════════════════════════════════════════════════════════════ */
function pins(x, y, n, dx, dy, r) {
  let o = '';
  for (let i = 0; i < n; i++) o += `<circle cx="${x + i * dx}" cy="${y + i * dy}" r="${r || 2.4}" fill="#d8b04a"/>`;
  return o;
}

const ILLUS = {
  esp32: () => `
    <rect x="60" y="46" width="280" height="168" rx="10" fill="#1d4a3e" stroke="#123028" stroke-width="2"/>
    <rect x="112" y="60" width="176" height="76" rx="5" fill="#c9ccd1" stroke="#9aa0a8"/>
    <rect x="128" y="76" width="86" height="44" rx="3" fill="#2b2f36"/>
    <text x="171" y="103" font-size="12" fill="#c9ccd1" text-anchor="middle" font-family="monospace">ESP32</text>
    <path d="M228 78 h44 v10 h-44z M228 92 h44 v10 h-44z M228 106 h44 v10 h-44z" fill="#9aa0a8"/>
    <rect x="164" y="150" width="72" height="34" rx="4" fill="#2b2f36"/>
    <text x="200" y="171" font-size="9" fill="#7f8894" text-anchor="middle" font-family="monospace">USB</text>
    <rect x="86" y="150" width="48" height="20" rx="3" fill="#1a1d22"/>
    <rect x="266" y="150" width="48" height="20" rx="3" fill="#1a1d22"/>
    ${pins(70, 40, 15, 18, 0)}${pins(70, 220, 15, 18, 0)}
    <circle cx="330" cy="60" r="4" fill="#e03b3b"/><circle cx="330" cy="76" r="4" fill="#3be07a"/>`,
  arduino: () => `
    <rect x="56" y="52" width="288" height="156" rx="10" fill="#0f7d8c" stroke="#0a5a66" stroke-width="2"/>
    <rect x="62" y="34" width="60" height="40" rx="4" fill="#b9bec6" stroke="#8f959d"/>
    <rect x="286" y="40" width="52" height="34" rx="4" fill="#1c1f24"/>
    <rect x="150" y="112" width="104" height="42" rx="4" fill="#22262c"/>
    <text x="202" y="138" font-size="11" fill="#a8b0ba" text-anchor="middle" font-family="monospace">ATmega328P</text>
    <rect x="86" y="60" width="228" height="16" rx="3" fill="#12222b"/>
    <rect x="86" y="182" width="228" height="16" rx="3" fill="#12222b"/>
    ${pins(96, 68, 13, 17, 0, 2.6)}${pins(96, 190, 13, 17, 0, 2.6)}
    <circle cx="326" cy="176" r="12" fill="#c9ccd1"/><circle cx="326" cy="176" r="6" fill="#0f7d8c"/>
    <circle cx="120" cy="164" r="4" fill="#e0a03b"/><circle cx="136" cy="164" r="4" fill="#3be07a"/>`,
  rpi: () => `
    <rect x="48" y="56" width="304" height="148" rx="9" fill="#1f6b3f" stroke="#144a2c" stroke-width="2"/>
    <rect x="66" y="46" width="212" height="18" rx="3" fill="#1c1f24"/>
    ${pins(76, 51, 20, 10, 0, 2.1)}${pins(76, 60, 20, 10, 0, 2.1)}
    <rect x="150" y="106" width="76" height="60" rx="5" fill="#1a1d22"/>
    <text x="188" y="140" font-size="10" fill="#9aa3ad" text-anchor="middle" font-family="monospace">BCM2711</text>
    <rect x="286" y="82" width="60" height="46" rx="4" fill="#4a4f57"/>
    <rect x="286" y="140" width="60" height="46" rx="4" fill="#4a4f57"/>
    <text x="316" y="110" font-size="9" fill="#d8dce1" text-anchor="middle" font-family="monospace">USB</text>
    <text x="316" y="168" font-size="9" fill="#d8dce1" text-anchor="middle" font-family="monospace">LAN</text>
    <rect x="56" y="150" width="34" height="46" rx="4" fill="#2b2f36"/>
    <circle cx="70" cy="80" r="5" fill="#e03b3b"/><circle cx="86" cy="80" r="5" fill="#3be07a"/>`,
  breadboard: () => `
    <rect x="40" y="40" width="320" height="180" rx="8" fill="#e8e6df" stroke="#c3c0b6" stroke-width="2"/>
    <rect x="40" y="118" width="320" height="24" fill="#dad7cd"/>
    <line x1="52" y1="56" x2="348" y2="56" stroke="#e05050" stroke-width="1.4"/>
    <line x1="52" y1="204" x2="348" y2="204" stroke="#4a6ee0" stroke-width="1.4"/>
    ${Array.from({ length: 30 }, (_, c) => Array.from({ length: 5 }, (_, r) =>
      `<rect x="${52 + c * 10}" y="${68 + r * 9}" width="4" height="4" fill="#9a9789"/>`).join('') +
      Array.from({ length: 5 }, (_, r) =>
        `<rect x="${52 + c * 10}" y="${148 + r * 9}" width="4" height="4" fill="#9a9789"/>`).join('')).join('')}`,
  sensor: () => `
    <rect x="96" y="70" width="208" height="120" rx="8" fill="#1c4a86" stroke="#12315a" stroke-width="2"/>
    <rect x="118" y="92" width="76" height="76" rx="6" fill="#d8dce1" stroke="#a8aeb6"/>
    <circle cx="156" cy="130" r="24" fill="#2b2f36"/><circle cx="156" cy="130" r="12" fill="#5a6270"/>
    <rect x="212" y="98" width="70" height="30" rx="4" fill="#22262c"/>
    <text x="247" y="118" font-size="10" fill="#9aa3ad" text-anchor="middle" font-family="monospace">MCU</text>
    ${pins(220, 176, 4, 18, 0, 3)}
    <text x="200" y="204" font-size="10" fill="var(--dg-muted)" text-anchor="middle">VCC · GND · SIG · NC</text>`,
  dashboard: () => `
    <rect x="30" y="34" width="340" height="192" rx="10" fill="var(--dg-box-b)" stroke="var(--dg-stroke)"/>
    <rect x="30" y="34" width="340" height="28" rx="10" fill="var(--dg-chip)"/>
    <circle cx="48" cy="48" r="4" fill="#e05f5f"/><circle cx="62" cy="48" r="4" fill="#e0b45f"/><circle cx="76" cy="48" r="4" fill="#5fe08a"/>
    <rect x="44" y="76" width="140" height="62" rx="7" fill="var(--dg-box-a)" stroke="var(--dg-stroke)"/>
    <text x="58" y="98" font-size="10" fill="var(--dg-muted)">TEMPERATURE</text>
    <text x="58" y="126" font-size="24" fill="var(--dg-accent)" font-family="monospace">27.4°</text>
    <rect x="198" y="76" width="158" height="62" rx="7" fill="var(--dg-box-a)" stroke="var(--dg-stroke)"/>
    <polyline points="210,126 236,110 262,118 288,94 314,104 340,86" fill="none" stroke="var(--dg-accent)" stroke-width="2"/>
    <rect x="44" y="152" width="312" height="60" rx="7" fill="var(--dg-box-a)" stroke="var(--dg-stroke)"/>
    <polyline points="56,196 86,180 116,188 146,160 176,172 206,146 236,158 266,138 296,150 340,128"
      fill="none" stroke="var(--dg-accent)" stroke-width="2" opacity=".8"/>`,
  robot: () => `
    <rect x="128" y="88" width="144" height="82" rx="14" fill="#26405e" stroke="#16283c" stroke-width="2"/>
    <rect x="146" y="104" width="108" height="34" rx="6" fill="#0f1a28"/>
    <circle cx="172" cy="121" r="8" fill="#3ad0e0"/><circle cx="228" cy="121" r="8" fill="#3ad0e0"/>
    <rect x="96" y="118" width="34" height="24" rx="8" fill="#1c3149"/>
    <rect x="270" y="118" width="34" height="24" rx="8" fill="#1c3149"/>
    <circle cx="146" cy="186" r="24" fill="#1a1d22" stroke="#3a4150" stroke-width="4"/>
    <circle cx="254" cy="186" r="24" fill="#1a1d22" stroke="#3a4150" stroke-width="4"/>
    <rect x="192" y="58" width="16" height="32" rx="6" fill="#1c3149"/><circle cx="200" cy="54" r="8" fill="#3ad0e0"/>`,
  neural: () => `
    ${[0, 1, 2, 3].map(l => {
      const n = [4, 6, 6, 3][l], x = 70 + l * 90;
      return Array.from({ length: n }, (_, i) => {
        const y = 130 - ((n - 1) * 26) / 2 + i * 26;
        const nx = [4, 6, 6, 3][l + 1];
        let e = '';
        if (l < 3) for (let j = 0; j < nx; j++) {
          const yy = 130 - ((nx - 1) * 26) / 2 + j * 26;
          e += `<line x1="${x + 9}" y1="${y}" x2="${x + 81}" y2="${yy}" stroke="var(--dg-line)" stroke-width=".5" opacity=".4"/>`;
        }
        return e + `<circle cx="${x}" cy="${y}" r="9" fill="var(--dg-acc-a)" stroke="var(--dg-accent)" stroke-width="1.2"/>`;
      }).join('');
    }).join('')}
    <text x="70" y="230" font-size="10" fill="var(--dg-muted)" text-anchor="middle">input</text>
    <text x="205" y="230" font-size="10" fill="var(--dg-muted)" text-anchor="middle">hidden</text>
    <text x="340" y="230" font-size="10" fill="var(--dg-muted)" text-anchor="middle">output</text>`,
  camera: () => `
    <rect x="88" y="78" width="224" height="120" rx="12" fill="#22262c" stroke="#3a4150" stroke-width="2"/>
    <circle cx="200" cy="138" r="42" fill="#0f1418" stroke="#4a525e" stroke-width="4"/>
    <circle cx="200" cy="138" r="26" fill="#132030"/>
    <circle cx="188" cy="126" r="7" fill="#5fd0e0" opacity=".7"/>
    <rect x="104" y="90" width="26" height="12" rx="3" fill="#3a4150"/>
    <circle cx="292" cy="96" r="5" fill="#e05050"/>`,
  solar: () => `
    <g transform="skewX(-12)">
      <rect x="110" y="60" width="200" height="130" rx="6" fill="#16385e" stroke="#0d2340" stroke-width="2"/>
      ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) =>
        `<rect x="${118 + c * 64}" y="${68 + r * 31}" width="58" height="26" rx="2" fill="#1f4f86" stroke="#2f6aa8"/>`).join('')).join('')}
    </g>
    <rect x="150" y="192" width="120" height="8" rx="3" fill="#4a525e"/>
    <rect x="196" y="198" width="10" height="28" fill="#4a525e"/>
    <circle cx="330" cy="60" r="20" fill="#e8b64a" opacity=".85"/>`,
  motor: () => `
    <rect x="120" y="96" width="130" height="84" rx="10" fill="#4a525e" stroke="#333a45" stroke-width="2"/>
    <rect x="250" y="126" width="52" height="24" rx="4" fill="#8a919b"/>
    <circle cx="302" cy="138" r="18" fill="#2b2f36" stroke="#6a727e" stroke-width="3"/>
    <rect x="96" y="112" width="26" height="52" rx="4" fill="#2b2f36"/>
    <line x1="96" y1="126" x2="60" y2="126" stroke="#e05050" stroke-width="3"/>
    <line x1="96" y1="150" x2="60" y2="150" stroke="#2b2f36" stroke-width="3"/>
    ${Array.from({ length: 6 }, (_, i) => `<line x1="${132 + i * 20}" y1="96" x2="${132 + i * 20}" y2="180" stroke="#333a45" stroke-width="2"/>`).join('')}`,
  cloud: () => `
    <path d="M120 152 a38 38 0 0 1 6-75 a52 52 0 0 1 98-14 a44 44 0 0 1 52 44 a34 34 0 0 1-8 45 z"
      fill="var(--dg-acc-a)" stroke="var(--dg-accent)" stroke-width="2"/>
    <rect x="150" y="172" width="100" height="44" rx="8" fill="var(--dg-box-a)" stroke="var(--dg-stroke)"/>
    <text x="200" y="199" font-size="12" fill="var(--dg-muted)" text-anchor="middle" font-family="monospace">broker</text>
    <line x1="200" y1="152" x2="200" y2="170" stroke="var(--dg-accent)" stroke-width="2"/>`,
};

function boardIllustration(kind, caption) {
  const draw = ILLUS[kind] || ILLUS.sensor;
  const id = nextId();
  return `<figure class="diagram diagram-illus">
  <svg viewBox="0 0 400 260" role="img" aria-labelledby="t${id}" preserveAspectRatio="xMidYMid meet" class="dg">
    <title id="t${id}">${esc(caption || kind)}</title>
    <rect width="400" height="260" rx="14" fill="var(--dg-illus-bg)"/>
    ${draw()}
  </svg>
  <figcaption>${esc(caption || kind)}</figcaption>
</figure>`;
}

module.exports = {
  esc, blockDiagram, flowchart, wiringDiagram, layerDiagram,
  networkDiagram, pipelineDiagram, barChart, timingDiagram, boardIllustration,
};
