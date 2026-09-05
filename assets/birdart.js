/* ═══════════════════════════════════════════════════════════════════════════
   Original vector bird illustrations — hand-built SVG, one construction,
   recoloured per species with correct markings. Injected into [data-bird]
   plate frames; idle animation lives in style.css (.b-body/.b-wing/.b-tail/.b-head).
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function scaffold(cfg) {
    var s = cfg.sky;
    return '' +
      '<rect width="300" height="380" fill="url(#sky_' + cfg.id + ')"/>' +
      '<rect width="300" height="380" fill="url(#glow_' + cfg.id + ')"/>' +
      '<path d="M0 330 Q60 300 120 322 T300 316 V380 H0Z" fill="#9aa877" opacity=".4"/>' +
      '<path d="M0 352 Q80 332 170 350 T300 344 V380 H0Z" fill="#6f7d4e" opacity=".38"/>' +
      '<path d="M40 360 C 110 300 150 250 210 120" fill="none" stroke="#5b4327" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M188 168 C 210 150 236 150 258 138" fill="none" stroke="#5b4327" stroke-width="6" stroke-linecap="round"/>' +
      '<g><circle cx="250" cy="132" r="10" fill="#f3ecd9" stroke="#cdbf9f"/><circle cx="266" cy="146" r="8" fill="#f3ecd9" stroke="#cdbf9f"/>' +
      '<circle cx="250" cy="132" r="3" fill="#caa24c"/><path d="M232 150 q-10 -8 -18 -2 q8 -12 20 -4z" fill="#6f7d4e"/></g>';
  }

  function defs(cfg) {
    var s = cfg.sky;
    return '<defs>' +
      '<linearGradient id="sky_' + cfg.id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + s[0] + '"/><stop offset="55%" stop-color="' + s[1] + '"/><stop offset="100%" stop-color="' + s[2] + '"/></linearGradient>' +
      '<radialGradient id="glow_' + cfg.id + '" cx="78%" cy="20%" r="45%">' +
      '<stop offset="0" stop-color="#f6ecd2" stop-opacity=".85"/><stop offset="100%" stop-color="#f6ecd2" stop-opacity="0"/></radialGradient>' +
      '</defs>';
  }

  function bird(cfg) {
    var c = cfg.colors, out = '<g class="b-body">';

    /* tail */
    out += '<g class="b-tail">';
    if (cfg.tailShort) {
      out += '<path d="M160 214 L188 262 L172 268 L150 220 Z" fill="' + c.tail + '"/>' +
             '<path d="M160 214 L188 262 L180 264 L166 218 Z" fill="' + shade(c.tail) + '"/>';
    } else {
      out += '<path d="M168 210 L214 300 L196 306 L156 220 Z" fill="' + c.tail + '"/>' +
             '<path d="M168 210 L214 300 L206 302 L180 214 Z" fill="' + shade(c.tail) + '"/>';
    }
    out += '</g>';

    /* belly */
    out += '<path d="M96 168 C 78 196 92 244 128 244 C 170 244 186 214 176 182 C 168 156 120 150 96 168 Z" fill="' + c.belly + '"/>';
    /* mantle / back */
    out += '<path d="M120 158 C 150 150 182 160 178 190 C 176 208 150 214 132 206 C 112 196 106 168 120 158 Z" fill="' + c.back + '"/>';

    /* wing */
    out += '<g class="b-wing">' +
      '<path d="M128 168 C 158 162 184 176 180 208 C 178 226 156 232 140 224 C 120 214 112 178 128 168 Z" fill="' + c.wing + '"/>';
    if (c.wingBar) out += '<path d="M150 178 C 166 178 176 190 176 204" fill="none" stroke="' + c.wingBar + '" stroke-width="4" opacity=".9"/>';
    out += '<path d="M142 200 L172 210 M146 210 L170 218 M152 218 L166 224" stroke="' + shade(c.wing) + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '</g>';

    /* optional face wash (robin/kingfisher breast+face colour) */
    if (c.face) out += '<path d="M104 150 C 90 176 96 232 128 240 C 116 214 116 180 122 160 C 118 150 110 146 104 150 Z" fill="' + c.face + '"/>';
    /* optional central breast stripe */
    if (c.stripe) out += '<path d="M104 172 C 112 200 120 230 130 244 C 138 232 138 206 132 184 C 128 172 112 166 104 172 Z" fill="' + c.stripe + '"/>';
    /* optional rump patch */
    if (c.rump) out += '<ellipse cx="150" cy="205" rx="14" ry="10" fill="' + c.rump + '"/>';

    /* head group */
    out += '<g class="b-head">';
    out += '<path d="M74 150 C 74 122 100 108 124 118 C 142 126 146 150 138 168 C 130 150 108 146 96 154 C 86 160 82 150 74 150 Z" fill="' + c.cap + '"/>';
    out += '<path d="M100 150 C 96 168 104 180 118 182 C 108 176 106 164 110 152 Z" fill="' + c.cap + '"/>';
    if (c.cheek) out += '<ellipse cx="98" cy="150" rx="18" ry="15" fill="' + c.cheek + '"/>';
    if (c.mask) out += '<path d="M70 150 C 70 138 84 132 96 138 C 92 150 92 158 96 166 C 82 168 70 162 70 150 Z" fill="' + c.mask + '"/>';
    /* eye */
    out += '<circle cx="92" cy="140" r="4.6" fill="#171310"/><circle cx="90.5" cy="138.5" r="1.5" fill="#f4eddb"/>';
    if (!c.cheek && !c.mask) out += '<circle cx="92" cy="140" r="6.2" fill="none" stroke="' + shade(c.cap) + '" stroke-width="1"/>';
    /* beak */
    if (cfg.beakLong) out += '<path d="M74 148 L40 152 L74 158 Z" fill="' + (c.beak || '#2b2117') + '"/>';
    else out += '<path d="M74 146 L58 150 L74 156 Z" fill="' + (c.beak || '#2b2117') + '"/>';
    out += '</g>';

    /* legs */
    out += '<path d="M126 244 L128 268 M128 268 L120 278 M128 268 L134 278 M128 268 L130 280" fill="none" stroke="#6f6350" stroke-width="3" stroke-linecap="round"/>';
    out += '<path d="M146 240 L150 266 M150 266 L142 276 M150 266 L158 274 M150 266 L152 280" fill="none" stroke="#6f6350" stroke-width="3" stroke-linecap="round"/>';

    out += '</g>';
    return out;
  }

  /* darken a hex colour a little for feather shading */
  function shade(hex) {
    if (!hex || hex[0] !== '#' || hex.length < 7) return '#5e6474';
    var r = parseInt(hex.substr(1, 2), 16), g = parseInt(hex.substr(3, 2), 16), b = parseInt(hex.substr(5, 2), 16);
    r = Math.max(0, r - 34); g = Math.max(0, g - 34); b = Math.max(0, b - 34);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  var SPECIES = {
    'great-tit': { id: 'gt', sky: ['#e6c3b8', '#e7d3ba', '#dfe0c8'],
      colors: { belly: '#d8b03b', back: '#7d8a4d', wing: '#8b94a3', tail: '#8790a0', cap: '#1f1a16', cheek: '#f4eddb', stripe: '#211a13' } },
    'kingfisher': { id: 'kf', sky: ['#cfe0dc', '#d7e0cf', '#e2e2c9'], beakLong: true, tailShort: true,
      colors: { belly: '#c9822f', back: '#2f7d86', wing: '#2b6f79', tail: '#2b6f79', cap: '#2f6f6a', cheek: '#f0ead4', face: '#c9822f', beak: '#26201a' } },
    'goldfinch': { id: 'gf', sky: ['#e7d9b6', '#e9dcbb', '#dfe0c8'],
      colors: { belly: '#efe7d0', back: '#c2a468', wing: '#2a2620', tail: '#2a2620', cap: '#1f1a16', mask: '#a5402c', wingBar: '#e0b73a', beak: '#cbb488' } },
    'bullfinch': { id: 'bf', sky: ['#e6c3b8', '#e7d1bd', '#dfe0c8'],
      colors: { belly: '#c07364', back: '#7a8390', wing: '#2a2620', tail: '#211a13', cap: '#1f1a16', face: '#b6685b', wingBar: '#e9e2cf', rump: '#f0ead6' } },
    'robin': { id: 'rb', sky: ['#dcdcc4', '#e4d9bd', '#dfe0c8'],
      colors: { belly: '#efe6cf', back: '#8a7a52', wing: '#93825a', tail: '#8a7a52', cap: '#8a7a52', face: '#c66a35' } }
  };

  function build(name) {
    var cfg = SPECIES[name] || SPECIES['great-tit'];
    return '<svg class="bird-svg" viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" role="img">' +
      defs(cfg) + scaffold(cfg) + bird(cfg) + '</svg>';
  }

  function init() {
    var nodes = document.querySelectorAll('[data-bird]');
    Array.prototype.forEach.call(nodes, function (el, i) {
      el.innerHTML = build(el.getAttribute('data-bird'));
      var svg = el.querySelector('svg');
      if (svg) {
        var label = el.getAttribute('data-bird-label');
        if (label) svg.setAttribute('aria-label', label);
        /* stagger idle animation so the flock isn't in lockstep */
        var d = (i % 5) * -1.3 + 's';
        var groups = svg.querySelectorAll('.b-body, .b-wing, .b-tail, .b-head');
        Array.prototype.forEach.call(groups, function (g) { g.style.animationDelay = d; });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
