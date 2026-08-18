// Argumenta UI Builder
// Draws the Argumenta design v2 (visual novel) natively in Figma:
// paint styles, text styles and the seven MVP screens with auto-layout.
// Source of truth for the visuals: design/ui-mockups.html in the repo.

/* ---------------- palette ---------------- */

var HEX = {
  paper: '#F6F6F3',
  card: '#FFFFFF',
  ink: '#1D2530',
  muted: '#61707A',
  caneta: '#2149C4',
  canetaSoft: '#E8EDFB',
  marcatexto: '#FFE45C',
  corretor: '#C2402A',
  corretorSoft: '#F9E9E5',
  aprovado: '#2E7D5B',
  aprovadoSoft: '#E4F1EA',
  line: '#E5E4DC',
  noite: '#232D3B',
  noiteInner: '#26303F',
  track: '#ECEBE4',
  luz: '#F3F1E8'
};

function rgb(hex) {
  var n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

var C = {};
for (var key in HEX) C[key] = rgb(HEX[key]);

function solid(color, opacity) {
  var paint = { type: 'SOLID', color: color };
  if (opacity !== undefined) paint.opacity = opacity;
  return [paint];
}

/* ---------------- fonts ---------------- */

var FONT = {};

function pickFrom(byFamily, families, wantedStyles) {
  for (var i = 0; i < families.length; i++) {
    var fam = families[i];
    var styles = byFamily[fam];
    if (!styles) continue;
    for (var j = 0; j < wantedStyles.length; j++) {
      var w = wantedStyles[j];
      for (var k = 0; k < styles.length; k++) if (styles[k] === w) return { family: fam, style: styles[k] };
      for (var k2 = 0; k2 < styles.length; k2++) if (styles[k2].indexOf(w) >= 0) return { family: fam, style: styles[k2] };
    }
    for (var k3 = 0; k3 < styles.length; k3++) if (styles[k3] === 'Regular') return { family: fam, style: 'Regular' };
    return { family: fam, style: styles[0] };
  }
  return { family: 'Inter', style: wantedStyles.indexOf('Regular') >= 0 ? 'Regular' : 'Bold' };
}

function resolveFonts() {
  return figma.listAvailableFontsAsync().then(function (all) {
    var byFamily = {};
    for (var i = 0; i < all.length; i++) {
      var fn = all[i].fontName;
      if (!byFamily[fn.family]) byFamily[fn.family] = [];
      byFamily[fn.family].push(fn.style);
    }
    var display = ['Bricolage Grotesque', 'Inter'];
    var serif = ['Source Serif 4', 'Source Serif Pro', 'PT Serif', 'Inter'];
    var mono = ['IBM Plex Mono', 'Roboto Mono', 'Inter'];

    FONT.displayXB = pickFrom(byFamily, display, ['ExtraBold', 'Bold']);
    FONT.displayB = pickFrom(byFamily, display, ['Bold', 'SemiBold']);
    FONT.displaySB = pickFrom(byFamily, display, ['SemiBold', 'Medium']);
    FONT.displayR = pickFrom(byFamily, display, ['Regular', 'Medium']);
    FONT.serif = pickFrom(byFamily, serif, ['Regular']);
    FONT.serifIt = pickFrom(byFamily, serif, ['Italic']);
    FONT.serifSB = pickFrom(byFamily, serif, ['SemiBold', 'Bold']);
    FONT.mono = pickFrom(byFamily, mono, ['Regular']);
    FONT.monoMd = pickFrom(byFamily, mono, ['Medium', 'SemiBold']);
    FONT.monoSB = pickFrom(byFamily, mono, ['SemiBold', 'Bold']);

    var uniq = {};
    for (var k in FONT) uniq[FONT[k].family + '::' + FONT[k].style] = FONT[k];
    var loads = [];
    for (var u in uniq) loads.push(figma.loadFontAsync(uniq[u]));
    return Promise.all(loads);
  });
}

/* ---------------- primitives ---------------- */

function text(chars, font, size, color, opts) {
  opts = opts || {};
  var t = figma.createText();
  t.fontName = font;
  t.characters = chars;
  t.fontSize = size;
  t.fills = solid(color || C.ink);
  if (opts.lineHeight) t.lineHeight = { unit: 'PERCENT', value: opts.lineHeight };
  if (opts.letterSpacing) t.letterSpacing = { unit: 'PERCENT', value: opts.letterSpacing };
  if (opts.upper) t.textCase = 'UPPER';
  if (opts.align) t.textAlignHorizontal = opts.align;
  return t;
}

function stack(dir, opts) {
  opts = opts || {};
  var f = figma.createFrame();
  f.layoutMode = dir;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.itemSpacing = opts.gap !== undefined ? opts.gap : 8;
  var p = opts.padding || [0, 0, 0, 0];
  f.paddingTop = p[0]; f.paddingRight = p[1]; f.paddingBottom = p[2]; f.paddingLeft = p[3];
  f.fills = opts.bg ? solid(opts.bg) : [];
  if (opts.radius !== undefined) f.cornerRadius = opts.radius;
  if (opts.stroke) { f.strokes = solid(opts.stroke); f.strokeWeight = opts.strokeWeight || 1; }
  if (opts.name) f.name = opts.name;
  if (opts.align) f.counterAxisAlignItems = opts.align;
  if (opts.justify) f.primaryAxisAlignItems = opts.justify;
  return f;
}

function fillW(node) { node.layoutSizingHorizontal = 'FILL'; }

function svgNode(svg, name, scale) {
  var n = figma.createNodeFromSvg(svg);
  n.name = name;
  if (scale && scale !== 1) n.rescale(scale);
  return n;
}

function card(opts) {
  opts = opts || {};
  return stack('VERTICAL', {
    gap: opts.gap !== undefined ? opts.gap : 6,
    padding: [14, 16, 14, 16],
    bg: opts.bg || C.card,
    radius: 14,
    stroke: opts.stroke || C.line,
    strokeWeight: opts.strokeWeight || 1,
    name: opts.name || 'card'
  });
}

function chip(label, fg, bg) {
  var f = stack('HORIZONTAL', { gap: 0, padding: [4, 9, 4, 9], bg: bg, radius: 999, name: 'chip/' + label });
  f.appendChild(text(label, FONT.monoMd, 9.5, fg, { upper: true, letterSpacing: 6 }));
  return f;
}

function kicker(label, color) {
  return text(label, FONT.monoMd, 9.5, color || C.muted, { upper: true, letterSpacing: 10 });
}

function button(label, opts) {
  opts = opts || {};
  var f = stack('HORIZONTAL', {
    gap: 9, padding: [13, 18, 13, 18],
    bg: opts.ghost ? C.card : (opts.bg || C.caneta),
    radius: 10, justify: 'CENTER', align: 'CENTER', name: 'btn/' + label
  });
  if (opts.ghost) { f.strokes = solid(C.ink); f.strokeWeight = 1.5; }
  if (opts.leading) f.appendChild(opts.leading);
  f.appendChild(text(label, FONT.displayB, 15, opts.ghost ? C.ink : (opts.fg || rgb('#FFFFFF'))));
  return f;
}

function spaceBetweenRow(name) {
  var r = stack('HORIZONTAL', { gap: 8, justify: 'SPACE_BETWEEN', align: 'CENTER', name: name || 'row' });
  return r;
}

function statusbar() {
  var r = spaceBetweenRow('statusbar');
  r.appendChild(text('9:41', FONT.mono, 9.5, C.muted));
  r.appendChild(text('5G · 100%', FONT.mono, 9.5, C.muted));
  return r;
}

function appbar(left, right) {
  var r = spaceBetweenRow('appbar');
  r.appendChild(left);
  if (right) r.appendChild(right);
  return r;
}

function tabbar(active) {
  var wrap = stack('VERTICAL', { gap: 10, name: 'tabbar' });
  var line = figma.createRectangle();
  line.resize(350, 1); line.fills = solid(C.line);
  wrap.appendChild(line); fillW(line);
  var r = spaceBetweenRow('tabs');
  var labels = ['Trilha', 'Progresso', 'Conta'];
  for (var i = 0; i < labels.length; i++) {
    var on = labels[i] === active;
    r.appendChild(text(labels[i], on ? FONT.monoSB : FONT.mono, 9, on ? C.caneta : C.muted, { upper: true, letterSpacing: 8 }));
  }
  wrap.appendChild(r); fillW(r);
  return wrap;
}

var SCREEN_W = 390;
var SCREEN_H = 694; // 9:16

function phone(name) {
  var f = stack('VERTICAL', { gap: 12, padding: [14, 20, 18, 20], bg: C.paper, radius: 28, stroke: C.line, name: name });
  f.primaryAxisSizingMode = 'FIXED';
  f.counterAxisSizingMode = 'FIXED';
  f.resize(SCREEN_W, SCREEN_H);
  f.clipsContent = true;
  return f;
}

function dimBar(label, scoreText, pct, low, width) {
  var wrap = stack('VERTICAL', { gap: 5, name: 'dim/' + label });
  var head = spaceBetweenRow('head');
  head.appendChild(text(label, FONT.mono, 10.5, C.ink));
  head.appendChild(text(scoreText, FONT.mono, 10.5, C.muted));
  width = width || 314;
  var bar = figma.createFrame();
  bar.name = 'bar'; bar.resize(width, 8); bar.cornerRadius = 4;
  bar.fills = solid(C.track); bar.clipsContent = false;
  var fillR = figma.createRectangle();
  fillR.resize(Math.max(6, width * pct), 8); fillR.cornerRadius = 4;
  fillR.fills = solid(low ? C.corretor : C.caneta);
  bar.appendChild(fillR); fillR.x = 0; fillR.y = 0;
  var tick = figma.createRectangle();
  tick.resize(2, 14); tick.fills = solid(C.ink, 0.55);
  bar.appendChild(tick); tick.x = width * 0.6; tick.y = -3;
  wrap.appendChild(head); fillW(head);
  wrap.appendChild(bar);
  return wrap;
}

function progressBar(pct, color) {
  var width = 226;
  var bar = figma.createFrame();
  bar.name = 'progress'; bar.resize(width, 6); bar.cornerRadius = 3;
  bar.fills = solid(C.track);
  if (pct > 0) {
    var f = figma.createRectangle();
    f.resize(Math.max(6, width * pct), 6); f.cornerRadius = 3;
    f.fills = solid(color || C.caneta);
    bar.appendChild(f); f.x = 0; f.y = 0;
  }
  return bar;
}

function highlightText(chars, font, size, hlFraction) {
  var t = text(chars, font, size, C.ink);
  var w = t.width, h = t.height;
  var f = figma.createFrame();
  f.fills = []; f.resize(w, h); f.name = 'hl/' + chars; f.clipsContent = false;
  var r = figma.createRectangle();
  r.resize(w * hlFraction, h * 0.46); r.fills = solid(C.marcatexto);
  f.appendChild(r); r.x = 0; r.y = h * 0.44;
  f.appendChild(t); t.x = 0; t.y = 0;
  return f;
}

function markNum(n, info) {
  var f = stack('HORIZONTAL', { gap: 0, padding: [2, 6, 2, 6], bg: info ? C.caneta : C.corretor, radius: 999, name: 'mark/' + n, justify: 'CENTER', align: 'CENTER' });
  f.appendChild(text(String(n), FONT.monoSB, 8.5, rgb('#FFFFFF')));
  return f;
}

/* ---------------- svg assets ---------------- */

var SVG_AVATAR_MARCOS =
  '<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
  '<rect width="64" height="64" fill="#E8EDFB"/>' +
  '<circle cx="32" cy="27" r="13" fill="#D9A47E"/>' +
  '<path d="M19 25 a13 13 0 0 1 26 0 l-5 -5 h-16 z" fill="#2A2118"/>' +
  '<path d="M12 60 a20 17 0 0 1 40 0 z" fill="#2149C4"/>' +
  '<circle cx="27" cy="27" r="1.7" fill="#1D2530"/>' +
  '<circle cx="37" cy="27" r="1.7" fill="#1D2530"/>' +
  '<path d="M24 23 l6 1.6" stroke="#1D2530" stroke-width="1.7" stroke-linecap="round" fill="none"/>' +
  '<path d="M40 23 l-6 1.6" stroke="#1D2530" stroke-width="1.7" stroke-linecap="round" fill="none"/>' +
  '<path d="M27 36 q5 3 10 0" fill="none" stroke="#2A2118" stroke-width="2.4" stroke-linecap="round"/>' +
  '</svg>';

var SVG_KITCHEN =
  '<svg width="390" height="210" viewBox="0 0 390 210" xmlns="http://www.w3.org/2000/svg">' +
  '<rect width="390" height="210" fill="#232D3B"/>' +
  '<rect x="28" y="24" width="118" height="86" rx="8" fill="#2E3D52"/>' +
  '<circle cx="116" cy="50" r="13" fill="#F6F6F3"/>' +
  '<circle cx="58" cy="42" r="2" fill="#F6F6F3" opacity="0.7"/>' +
  '<circle cx="84" cy="68" r="1.6" fill="#F6F6F3" opacity="0.5"/>' +
  '<circle cx="46" cy="88" r="1.6" fill="#F6F6F3" opacity="0.5"/>' +
  '<rect x="266" y="0" width="3" height="36" fill="#141B24"/>' +
  '<path d="M248 36 h39 l8 18 h-55 z" fill="#FFE45C"/>' +
  '<path d="M242 54 h51 l34 156 h-119 z" fill="#FFE45C" opacity="0.12"/>' +
  '<rect x="0" y="146" width="390" height="64" fill="#1A222E"/>' +
  '<rect x="186" y="138" width="150" height="10" rx="4" fill="#2E3D52"/>' +
  '<ellipse cx="332" cy="134" rx="24" ry="5" fill="#8FA3B8"/>' +
  '<ellipse cx="332" cy="127" rx="20" ry="5" fill="#77899D"/>' +
  '<ellipse cx="332" cy="120" rx="22" ry="5" fill="#8FA3B8"/>' +
  '<circle cx="252" cy="84" r="14" fill="#10151C"/>' +
  '<path d="M252 98 c-16 0 -23 14 -23 32 v16 h46 v-16 c0 -18 -7 -32 -23 -32 z" fill="#10151C"/>' +
  '<path d="M236 114 q-15 8 -13 24" stroke="#10151C" stroke-width="7" fill="none" stroke-linecap="round"/>' +
  '</svg>';

var SVG_CONSEQ =
  '<svg width="390" height="150" viewBox="0 0 390 150" xmlns="http://www.w3.org/2000/svg">' +
  '<rect width="390" height="150" fill="#26303F"/>' +
  '<rect x="252" y="18" width="104" height="72" rx="7" fill="#33415A"/>' +
  '<rect x="252" y="62" width="104" height="28" fill="#FFE45C" opacity="0.35"/>' +
  '<circle cx="304" cy="62" r="14" fill="#FFE45C"/>' +
  '<rect x="0" y="104" width="390" height="46" fill="#1A222E"/>' +
  '<rect x="36" y="96" width="230" height="10" rx="4" fill="#3A3128"/>' +
  '<rect x="52" y="106" width="9" height="44" fill="#2C251E"/>' +
  '<rect x="240" y="106" width="9" height="44" fill="#2C251E"/>' +
  '<g transform="rotate(-6 150 84)">' +
  '<rect x="118" y="70" width="64" height="42" rx="3" fill="#F6F6F3"/>' +
  '<rect x="126" y="80" width="46" height="3.5" rx="1.75" fill="#8B93A0"/>' +
  '<rect x="126" y="89" width="38" height="3.5" rx="1.75" fill="#8B93A0"/>' +
  '<rect x="126" y="98" width="42" height="3.5" rx="1.75" fill="#C2402A"/>' +
  '</g>' +
  '<path d="M330 118 h34 v32 h-8 v-24 h-18 v24 h-8 z" fill="#10151C"/>' +
  '</svg>';

var SVG_PEN =
  '<svg width="220" height="110" viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M18 86 q70 -20 152 -8" fill="none" stroke="#FFE45C" stroke-width="16" stroke-linecap="round"/>' +
  '<g transform="rotate(38 172 74)">' +
  '<rect x="166" y="28" width="13" height="40" rx="4" fill="#2149C4"/>' +
  '<path d="M166 68 h13 l-6.5 14 z" fill="#1D2530"/>' +
  '<circle cx="172.5" cy="79" r="1.6" fill="#F6F6F3"/>' +
  '</g>' +
  '</svg>';

var SVG_COVER_GREMIO =
  '<svg width="74" height="74" viewBox="0 0 74 74" xmlns="http://www.w3.org/2000/svg">' +
  '<rect width="74" height="74" fill="#E8EDFB"/>' +
  '<path d="M14 30 h9 l20 -13 v40 l-20 -13 h-9 z" fill="#2149C4"/>' +
  '<rect x="17" y="44" width="7" height="12" rx="2.5" fill="#1D2530"/>' +
  '<path d="M50 28 q9 9 0 18" fill="none" stroke="#FFE45C" stroke-width="4" stroke-linecap="round"/>' +
  '<path d="M57 22 q15 15 0 30" fill="none" stroke="#FFE45C" stroke-width="4" stroke-linecap="round"/>' +
  '</svg>';

var SVG_COVER_CUIDADO =
  '<svg width="74" height="74" viewBox="0 0 74 74" xmlns="http://www.w3.org/2000/svg">' +
  '<rect width="74" height="74" fill="#232D3B"/>' +
  '<rect x="16" y="18" width="34" height="30" rx="9" fill="#1D2530"/>' +
  '<rect x="10" y="34" width="12" height="22" rx="5" fill="#1D2530"/>' +
  '<rect x="44" y="34" width="12" height="22" rx="5" fill="#1D2530"/>' +
  '<rect x="16" y="48" width="40" height="9" rx="4" fill="#141B24"/>' +
  '<path d="M20 32 h22 l-4 16 h-18 z" fill="#FFE45C"/>' +
  '<circle cx="62" cy="26" r="5" fill="#F6F6F3"/>' +
  '</svg>';

var SVG_COVER_SINAL =
  '<svg width="74" height="74" viewBox="0 0 74 74" xmlns="http://www.w3.org/2000/svg">' +
  '<rect width="74" height="74" fill="#ECEBE4"/>' +
  '<rect x="34" y="46" width="6" height="22" fill="#61707A"/>' +
  '<rect x="24" y="8" width="26" height="42" rx="8" fill="#1D2530"/>' +
  '<circle cx="37" cy="19" r="6" fill="#C2402A"/>' +
  '<circle cx="37" cy="33" r="6" fill="#3A4552"/>' +
  '<circle cx="37" cy="44" r="4.5" fill="#3A4552"/>' +
  '</svg>';

var SVG_GOOGLE_G =
  '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">' +
  '<path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>' +
  '<path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>' +
  '<path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>' +
  '<path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>' +
  '</svg>';

function sparkSvg(points, lastY) {
  return '<svg width="120" height="22" viewBox="0 0 120 22" xmlns="http://www.w3.org/2000/svg">' +
    '<polyline points="' + points + '" fill="none" stroke="#2149C4" stroke-width="2"/>' +
    '<circle cx="120" cy="' + lastY + '" r="2.5" fill="#2149C4"/></svg>';
}

function avatar(scalePx) {
  var n = svgNode(SVG_AVATAR_MARCOS, 'avatar/tio-marcos', scalePx / 64);
  n.cornerRadius = scalePx / 2;
  n.clipsContent = true;
  n.strokes = solid(C.ink);
  n.strokeWeight = scalePx >= 40 ? 2 : 1.5;
  return n;
}

/* ---------------- document styles ---------------- */

function createStyles() {
  var paints = [
    ['Papel', C.paper], ['Tinta', C.ink], ['Caneta', C.caneta], ['Caneta suave', C.canetaSoft],
    ['Marca-texto', C.marcatexto], ['Corretor', C.corretor], ['Corretor suave', C.corretorSoft],
    ['Aprovado', C.aprovado], ['Aprovado suave', C.aprovadoSoft], ['Noite', C.noite],
    ['Neutro linha', C.line], ['Neutro texto', C.muted]
  ];
  for (var i = 0; i < paints.length; i++) {
    var s = figma.createPaintStyle();
    s.name = 'Argumenta/' + paints[i][0];
    s.paints = solid(paints[i][1]);
  }
  var texts = [
    ['Display XL', FONT.displayXB, 40, 105],
    ['Titulo', FONT.displayB, 17, 115],
    ['UI Bold', FONT.displayB, 15, 120],
    ['UI', FONT.displayR, 14, 135],
    ['Narrativa', FONT.serif, 15, 165],
    ['Narrativa italico', FONT.serifIt, 14.5, 155],
    ['Mono label', FONT.monoMd, 9.5, 130],
    ['Mono placar', FONT.mono, 10.5, 130]
  ];
  for (var j = 0; j < texts.length; j++) {
    var ts = figma.createTextStyle();
    ts.name = 'Argumenta/' + texts[j][0];
    ts.fontName = texts[j][1];
    ts.fontSize = texts[j][2];
    ts.lineHeight = { unit: 'PERCENT', value: texts[j][3] };
  }
}

/* ---------------- screens ---------------- */

function screenEntrada() {
  var s = phone('01 Entrada');
  s.appendChild(statusbar()); fillW(s.children[0]);

  var hero = stack('VERTICAL', { gap: 16, padding: [0, 0, 24, 0], align: 'CENTER', name: 'hero' });
  hero.appendChild(svgNode(SVG_PEN, 'illu/caneta', 200 / 220));
  hero.appendChild(highlightText('Argumenta', FONT.displayXB, 40, 0.48));
  var tagline = text('Vença a discussão dentro da história. Passe no vestibular fora dela.', FONT.serif, 15, C.muted, { lineHeight: 160, align: 'CENTER' });
  hero.appendChild(tagline);
  tagline.textAutoResize = 'HEIGHT';
  tagline.resize(240, tagline.height);
  hero.primaryAxisAlignItems = 'CENTER';
  s.appendChild(hero); fillW(hero);
  hero.layoutSizingVertical = 'FILL';

  var gtile = figma.createFrame();
  gtile.name = 'gtile'; gtile.resize(22, 22); gtile.cornerRadius = 5; gtile.fills = solid(C.card);
  var g = svgNode(SVG_GOOGLE_G, 'google-g', 13 / 18);
  gtile.appendChild(g); g.x = 4.5; g.y = 4.5;

  var b1 = button('Entrar com Google', { leading: gtile });
  s.appendChild(b1); fillW(b1);
  var b2 = button('Criar conta com e-mail', { ghost: true });
  s.appendChild(b2); fillW(b2);

  var note = text('Só pedimos e-mail, apelido e o ano do seu vestibular. Nada mais.', FONT.displayR, 11.5, C.muted, { align: 'CENTER', lineHeight: 145 });
  s.appendChild(note); fillW(note);
  return s;
}

function storyCard(cover, title, chipNode, subtitle, pct, pctColor, opts) {
  opts = opts || {};
  var c = card({ name: 'story/' + title, gap: 0, stroke: opts.stroke || C.line, strokeWeight: opts.strokeWeight || 1 });
  c.layoutMode = 'HORIZONTAL';
  c.itemSpacing = 12;
  if (opts.dim) c.opacity = 0.55;

  var cv = svgNode(cover, 'cover/' + title, 1);
  cv.cornerRadius = 12; cv.clipsContent = true;
  c.appendChild(cv);

  var body = stack('VERTICAL', { gap: 6, name: 'body' });
  var row = spaceBetweenRow('titlerow');
  row.appendChild(text(title, FONT.displayB, 16, C.ink));
  row.appendChild(chipNode);
  body.appendChild(row); fillW(row);
  body.appendChild(text(subtitle, FONT.displayR, 11.5, C.muted));
  body.appendChild(progressBar(pct, pctColor));
  c.appendChild(body); fillW(body);
  return c;
}

function screenTrilha() {
  var s = phone('02 Trilha');
  s.appendChild(statusbar()); fillW(s.children[0]);

  var bar = appbar(text('Sua trilha', FONT.displayB, 17, C.ink));
  var chips = stack('HORIZONTAL', { gap: 6, name: 'chips' });
  chips.appendChild(chip('7 dias', C.ink, C.marcatexto));
  chips.appendChild(chip('2/3 envios hoje', C.caneta, C.canetaSoft));
  bar.appendChild(chips);
  s.appendChild(bar); fillW(bar);

  var c1 = storyCard(SVG_COVER_GREMIO, 'O Grêmio', chip('Concluída', C.aprovado, C.aprovadoSoft), 'Tutorial · 3 capítulos', 1, C.aprovado);
  s.appendChild(c1); fillW(c1);

  var active = stack('VERTICAL', { gap: 12, padding: [14, 16, 14, 16], bg: C.card, radius: 14, stroke: C.caneta, strokeWeight: 1.5, name: 'story/ativa' });
  var inner = stack('HORIZONTAL', { gap: 12, name: 'inner' });
  var cv = svgNode(SVG_COVER_CUIDADO, 'cover/Cuidado Invisível', 1);
  cv.cornerRadius = 12; cv.clipsContent = true;
  inner.appendChild(cv);
  var body = stack('VERTICAL', { gap: 6, name: 'body' });
  var row = spaceBetweenRow('titlerow');
  row.appendChild(text('Cuidado Invisível', FONT.displayB, 16, C.ink));
  row.appendChild(chip('Cap. 2/5', C.caneta, C.canetaSoft));
  body.appendChild(row); fillW(row);
  body.appendChild(text('Tema ENEM 2023 · convença o tio Marcos', FONT.displayR, 11.5, C.muted));
  body.appendChild(progressBar(0.4));
  inner.appendChild(body); fillW(body);
  active.appendChild(inner); fillW(inner);
  var cta = button('Continuar capítulo 2', {});
  active.appendChild(cta); fillW(cta);
  s.appendChild(active); fillW(active);

  var c3 = storyCard(SVG_COVER_SINAL, 'Sinal Fechado', chip('Bloqueada', C.corretor, C.corretorSoft), 'Tema FUVEST · conclua Cuidado Invisível', 0, C.caneta, { dim: true });
  s.appendChild(c3); fillW(c3);

  var tb = tabbar('Trilha');
  s.appendChild(tb); fillW(tb);
  return s;
}

function falaTioMarcos() {
  var row = stack('HORIZONTAL', { gap: 10, name: 'fala', align: 'MIN' });
  row.appendChild(avatar(46));
  var bubble = stack('VERTICAL', { gap: 4, padding: [12, 14, 12, 14], bg: C.card, stroke: C.line, name: 'bubble' });
  bubble.cornerRadius = 14;
  bubble.topLeftRadius = 2;
  bubble.appendChild(kicker('Tio Marcos', C.corretor));
  var q = text('"Cuidar da vó nem é trabalho de verdade. Trabalho é o que eu faço: saio às seis, volto às oito."', FONT.serifIt, 14, C.ink, { lineHeight: 155 });
  bubble.appendChild(q); fillW(q);
  row.appendChild(bubble); fillW(bubble);
  return row;
}

function screenCena() {
  var s = phone('03 Cena');
  s.appendChild(statusbar()); fillW(s.children[0]);

  var bar = appbar(text('← Trilha', FONT.mono, 11.5, C.muted), chip('Cap. 2 de 5', C.caneta, C.canetaSoft));
  s.appendChild(bar); fillW(bar);

  var panel = svgNode(SVG_KITCHEN, 'illu/cozinha-a-noite', 350 / 390);
  panel.cornerRadius = 12; panel.clipsContent = true;
  s.appendChild(panel);

  var narr = text('Domingo à noite. A pia ainda cheia, a vó já dormindo. Sua mãe apaga a luz da cozinha com o rosto fechado de quem repete aquilo há meses.', FONT.serif, 15, C.ink, { lineHeight: 165 });
  s.appendChild(narr); fillW(narr);

  var fala = falaTioMarcos();
  s.appendChild(fala); fillW(fala);

  var obj = card({ name: 'objetivo' });
  obj.appendChild(kicker('Seu objetivo'));
  var objText = text('Convencer o tio Marcos de que o cuidado com a vó é trabalho de verdade, e que precisa ser dividido.', FONT.displayR, 13.5, C.ink, { lineHeight: 145 });
  obj.appendChild(objText); fillW(objText);
  s.appendChild(obj); fillW(obj);

  var cta = button('Argumentar', {});
  s.appendChild(cta); fillW(cta);
  return s;
}

function screenEditor() {
  var s = phone('04 Editor');
  s.appendChild(statusbar()); fillW(s.children[0]);

  var bar = appbar(text('← Cena', FONT.mono, 11.5, C.muted), chip('2/3 envios hoje', C.caneta, C.canetaSoft));
  s.appendChild(bar); fillW(bar);

  var head = card({ name: 'objetivo', gap: 8 });
  var who = stack('HORIZONTAL', { gap: 8, align: 'CENTER', name: 'who' });
  who.appendChild(avatar(28));
  who.appendChild(kicker('Convença o tio Marcos'));
  head.appendChild(who);
  var reqs = stack('HORIZONTAL', { gap: 6, name: 'reqs' });
  reqs.appendChild(chip('Tese', C.caneta, C.canetaSoft));
  reqs.appendChild(chip('Justificativa', C.caneta, C.canetaSoft));
  reqs.appendChild(chip('Repertório explicado', C.caneta, C.canetaSoft));
  head.appendChild(reqs);
  s.appendChild(head); fillW(head);

  var editor = stack('VERTICAL', { gap: 0, padding: [14, 16, 14, 16], bg: C.card, radius: 14, stroke: C.caneta, strokeWeight: 1.5, name: 'editor' });
  var draft = text(
    'Tio, eu entendo que o senhor trabalha muito, mas a mãe também trabalha e ainda cuida da vó todos os dias sem descanso. Concerteza o senhor já percebeu que ela esta cansada. Segundo o IBGE, as mulheres brasileiras dedicam quase o dobro de horas ao trabalho de cuidado em comparação aos homens, oque mostra que essa divisão desigual não acontece só na nossa familia.',
    FONT.serif, 14.5, C.ink, { lineHeight: 160 });
  editor.appendChild(draft); fillW(draft);
  var pad = figma.createRectangle(); pad.resize(10, 40); pad.fills = [];
  editor.appendChild(pad);
  s.appendChild(editor); fillW(editor);

  var foot = spaceBetweenRow('editor-foot');
  foot.appendChild(text('118 / 250 palavras', FONT.mono, 10, C.muted));
  foot.appendChild(text('rascunho salvo', FONT.mono, 10, C.muted));
  s.appendChild(foot); fillW(foot);

  var cta = button('Enviar para o tio Marcos', {});
  s.appendChild(cta); fillW(cta);
  return s;
}

function screenCorrecao() {
  var s = phone('05 Correção');
  s.appendChild(statusbar()); fillW(s.children[0]);

  var verdict = card({ name: 'veredito', bg: C.corretorSoft, stroke: C.corretor });
  verdict.appendChild(text('Quase. A norma culta segurou você.', FONT.displayXB, 16, C.corretor, { lineHeight: 120 }));
  var vs = text('Argumento bom, mas a escrita ficou abaixo do piso. Revise e reenvie.', FONT.displayR, 12, C.ink, { lineHeight: 145 });
  verdict.appendChild(vs); fillW(vs);
  s.appendChild(verdict); fillW(verdict);

  var placar = card({ name: 'placar', gap: 7 });
  placar.appendChild(kicker('Placar · lente ENEM · capítulo'));
  var dims = [
    ['C1 Norma culta', '100/200 · piso 120', 0.5, true],
    ['C2 Repertório', '160/200', 0.8, false],
    ['C3 Coerência', '150/200', 0.75, false],
    ['C4 Coesão', '140/200', 0.7, false],
    ['Persuasão · Argumenta', '78/100', 0.78, false]
  ];
  for (var i = 0; i < dims.length; i++) {
    var d = dimBar(dims[i][0], dims[i][1], dims[i][2], dims[i][3]);
    placar.appendChild(d); fillW(d);
  }
  s.appendChild(placar); fillW(placar);

  var texto = card({ name: 'texto-corrigido', gap: 8 });
  texto.appendChild(kicker('Seu texto, corrigido'));
  var full = 'Concerteza o senhor já percebeu que ela esta cansada. Segundo o IBGE, as mulheres dedicam quase o dobro de horas ao trabalho de cuidado, oque mostra que essa divisão não acontece só na nossa familia.';
  var corrected = text(full, FONT.serif, 12.5, C.ink, { lineHeight: 155 });
  var errs = ['Concerteza', 'esta cansada', 'oque', 'familia'];
  for (var e = 0; e < errs.length; e++) {
    var idx = full.indexOf(errs[e]);
    if (idx >= 0) {
      var end = idx + errs[e].length;
      corrected.setRangeFills(idx, end, solid(C.corretor));
      corrected.setRangeTextDecoration(idx, end, 'UNDERLINE');
    }
  }
  var rep = 'Segundo o IBGE, as mulheres dedicam quase o dobro de horas ao trabalho de cuidado';
  var ri = full.indexOf(rep);
  if (ri >= 0) {
    corrected.setRangeFontName(ri, ri + rep.length, FONT.serifSB);
    corrected.setRangeFills(ri, ri + rep.length, solid(C.caneta));
  }
  texto.appendChild(corrected); fillW(corrected);
  var items = [
    [1, false, 'Ortografia: "com certeza" e "o que" (separado).'],
    [2, false, 'Acentuação: "está" e "família".'],
    [3, true, 'Repertório: citado, explicado e ligado à tese.']
  ];
  for (var n = 0; n < items.length; n++) {
    var row = stack('HORIZONTAL', { gap: 8, align: 'MIN', name: 'item' });
    row.appendChild(markNum(items[n][0], items[n][1]));
    var it = text(items[n][2], FONT.displayR, 11.5, C.ink, { lineHeight: 140 });
    row.appendChild(it); fillW(it);
    texto.appendChild(row); fillW(row);
  }
  s.appendChild(texto); fillW(texto);

  var cta = button('Revisar meu texto', { bg: C.corretor });
  s.appendChild(cta); fillW(cta);
  return s;
}

function screenConsequencia() {
  var s = phone('06 Consequência');
  s.appendChild(statusbar()); fillW(s.children[0]);

  var bar = appbar(text('Cuidado Invisível', FONT.mono, 11.5, C.muted), chip('Não convenceu', C.corretor, C.corretorSoft));
  s.appendChild(bar); fillW(bar);

  var band = stack('VERTICAL', { gap: 0, bg: C.noite, radius: 14, name: 'consequência' });
  band.clipsContent = true;
  band.appendChild(svgNode(SVG_CONSEQ, 'illu/manhã-seguinte', 350 / 390));
  var inner = stack('VERTICAL', { gap: 6, padding: [14, 16, 16, 16], name: 'inner' });
  inner.appendChild(kicker('Consequência', C.marcatexto));
  var n1 = text('Segunda-feira, 6h. O tio Marcos saiu sem falar com ninguém. Na mesa, um bilhete: "cada um cuida da sua parte".', FONT.serif, 14.5, C.luz, { lineHeight: 160 });
  inner.appendChild(n1); fillW(n1);
  var n2 = text('Sua mãe lê, dobra o papel em silêncio e liga para o trabalho. Vai faltar de novo.', FONT.serif, 14.5, C.luz, { lineHeight: 160 });
  inner.appendChild(n2); fillW(n2);
  band.appendChild(inner); fillW(inner);
  s.appendChild(band); fillW(band);

  var falhou = card({ name: 'onde-falhou' });
  falhou.appendChild(kicker('Onde o argumento falhou'));
  var f1 = text('Você apelou para o cansaço, mas não mostrou por que cuidar é trabalho. Sem critério concreto, o tio manteve a definição dele.', FONT.displayR, 13, C.ink, { lineHeight: 150 });
  falhou.appendChild(f1); fillW(f1);
  s.appendChild(falhou); fillW(falhou);

  var dica = card({ name: 'dica-repertório' });
  dica.appendChild(kicker('Dica de repertório'));
  var d1 = text('O nome disso é economia do cuidado. Busque dados de trabalho não remunerado no Brasil.', FONT.displayR, 13, C.ink, { lineHeight: 150 });
  dica.appendChild(d1); fillW(d1);
  s.appendChild(dica); fillW(dica);

  var cta = button('Cena de recuperação: tentar reverter', {});
  s.appendChild(cta); fillW(cta);
  return s;
}

function screenProgresso() {
  var s = phone('07 Progresso');
  s.appendChild(statusbar()); fillW(s.children[0]);

  var bar = appbar(text('Seu progresso', FONT.displayB, 17, C.ink), chip('lente ENEM', C.caneta, C.canetaSoft));
  s.appendChild(bar); fillW(bar);

  var hero = stack('VERTICAL', { gap: 6, padding: [18, 0, 8, 0], align: 'CENTER', name: 'streak' });
  var numRow = stack('HORIZONTAL', { gap: 8, align: 'CENTER', name: 'num' });
  numRow.appendChild(highlightText('7', FONT.displayXB, 52, 1));
  numRow.appendChild(text('dias', FONT.displayXB, 52, C.ink));
  hero.appendChild(numRow);
  hero.appendChild(text('escrevendo sem falhar · recorde: 12', FONT.displayR, 12, C.muted));
  s.appendChild(hero); fillW(hero);

  var evo = card({ name: 'evolução', gap: 10 });
  evo.appendChild(kicker('Evolução por dimensão · últimos 30 dias'));
  var rows = [
    ['Norma culta', '0,18 20,16 40,17 60,12 80,10 100,7 120,5', 5, '96 → 128'],
    ['Coesão', '0,16 20,14 40,15 60,10 80,8 100,8 120,4', 4, '110 → 150'],
    ['Coerência', '0,14 20,13 40,11 60,11 80,9 100,7 120,6', 6, '122 → 148'],
    ['Repertório', '0,19 20,18 40,14 60,13 80,9 100,5 120,3', 3, '90 → 164'],
    ['Persuasão', '0,18 20,15 40,16 60,12 80,11 100,8 120,7', 7, '55 → 80']
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = spaceBetweenRow('spark/' + rows[i][0]);
    var lbl = text(rows[i][0], FONT.mono, 10.5, C.ink);
    lbl.textAutoResize = 'NONE';
    lbl.resize(92, 16);
    r.appendChild(lbl);
    r.appendChild(svgNode(sparkSvg(rows[i][1], rows[i][2]), 'spark', 1));
    r.appendChild(text(rows[i][3], FONT.monoSB, 10.5, C.aprovado));
    evo.appendChild(r); fillW(r);
  }
  s.appendChild(evo); fillW(evo);

  var marcos = card({ name: 'marcos', gap: 8 });
  marcos.appendChild(kicker('Marcos'));
  var ms = [
    [chip('Feito', C.aprovado, C.aprovadoSoft), 'O Grêmio concluída'],
    [chip('Feito', C.aprovado, C.aprovadoSoft), 'Primeiro repertório bem explicado'],
    [chip('A caminho', C.caneta, C.canetaSoft), 'Primeira redação-chefe']
  ];
  for (var m = 0; m < ms.length; m++) {
    var row = stack('HORIZONTAL', { gap: 8, align: 'CENTER', name: 'marco' });
    row.appendChild(ms[m][0]);
    row.appendChild(text(ms[m][1], FONT.displayR, 12.5, C.ink));
    marcos.appendChild(row); fillW(row);
  }
  s.appendChild(marcos); fillW(marcos);

  var tb = tabbar('Progresso');
  s.appendChild(tb); fillW(tb);
  return s;
}

/* ---------------- palette board ---------------- */

function paletteBoard() {
  var board = stack('VERTICAL', { gap: 16, padding: [24, 26, 26, 26], bg: C.paper, radius: 16, stroke: C.line, name: 'Design System' });
  board.appendChild(text('Argumenta · design system', FONT.displayXB, 22, C.ink));
  var row = stack('HORIZONTAL', { gap: 16, align: 'MIN', name: 'cards' });

  /* Paleta */
  var pal = card({ name: 'Paleta', gap: 8 });
  pal.counterAxisSizingMode = 'FIXED';
  pal.resize(250, pal.height);
  pal.appendChild(kicker('Paleta'));
  var items = [
    ['Papel', C.paper, '#F6F6F3'], ['Tinta', C.ink, '#1D2530'], ['Caneta', C.caneta, '#2149C4'],
    ['Marca-texto', C.marcatexto, '#FFE45C'], ['Corretor', C.corretor, '#C2402A'],
    ['Aprovado', C.aprovado, '#2E7D5B'], ['Noite', C.noite, '#232D3B']
  ];
  for (var i = 0; i < items.length; i++) {
    var r = spaceBetweenRow('swatch/' + items[i][0]);
    var left = stack('HORIZONTAL', { gap: 8, align: 'CENTER', name: 'left' });
    var sq = figma.createRectangle();
    sq.resize(22, 22); sq.cornerRadius = 6;
    sq.fills = solid(items[i][1]);
    sq.strokes = solid(C.line);
    left.appendChild(sq);
    left.appendChild(text(items[i][0], FONT.mono, 10.5, C.ink));
    r.appendChild(left);
    r.appendChild(text(items[i][2], FONT.mono, 10.5, C.muted));
    pal.appendChild(r); fillW(r);
  }
  row.appendChild(pal);

  /* Tipografia */
  var tip = card({ name: 'Tipografia', gap: 14 });
  tip.counterAxisSizingMode = 'FIXED';
  tip.resize(330, tip.height);
  tip.appendChild(kicker('Tipografia'));
  function typeRow(lbl, node) {
    var w = stack('VERTICAL', { gap: 4, name: 'type/' + lbl });
    w.appendChild(text(lbl, FONT.mono, 8.5, C.muted, { upper: true, letterSpacing: 8 }));
    w.appendChild(node); fillW(node);
    return w;
  }
  var t1 = typeRow('Display e UI · Bricolage Grotesque', text('Convença o tio Marcos', FONT.displayXB, 21, C.ink));
  tip.appendChild(t1); fillW(t1);
  var t2 = typeRow('Narrativa · Source Serif 4', text('Domingo à noite. A pia ainda cheia, a vó já dormindo.', FONT.serif, 15, C.ink, { lineHeight: 150 }));
  tip.appendChild(t2); fillW(t2);
  var t3 = typeRow('Notas e placares · IBM Plex Mono', text('C1 100/200 · piso 120', FONT.mono, 12, C.ink));
  tip.appendChild(t3); fillW(t3);
  row.appendChild(tip);

  /* Componentes */
  var comp = card({ name: 'Componentes', gap: 12 });
  comp.counterAxisSizingMode = 'FIXED';
  comp.resize(330, comp.height);
  comp.appendChild(kicker('Componentes'));
  comp.appendChild(button('Enviar argumento', {}));
  comp.appendChild(button('Revisar texto', { ghost: true }));
  var chipsRow = stack('HORIZONTAL', { gap: 6, name: 'chips' });
  chipsRow.appendChild(chip('Tese', C.caneta, C.canetaSoft));
  chipsRow.appendChild(chip('Aprovado', C.aprovado, C.aprovadoSoft));
  chipsRow.appendChild(chip('Falha técnica', C.corretor, C.corretorSoft));
  chipsRow.appendChild(chip('7 dias', C.ink, C.marcatexto));
  comp.appendChild(chipsRow);
  var sampleStr = 'Ela esta cansada, e segundo o IBGE isso é regra, não exceção.';
  var sample = text(sampleStr, FONT.serif, 13.5, C.ink, { lineHeight: 155 });
  var ei = sampleStr.indexOf('esta');
  sample.setRangeFills(ei, ei + 4, solid(C.corretor));
  sample.setRangeTextDecoration(ei, ei + 4, 'UNDERLINE');
  var si = sampleStr.indexOf('segundo o IBGE');
  sample.setRangeFontName(si, si + 14, FONT.serifSB);
  sample.setRangeFills(si, si + 14, solid(C.caneta));
  comp.appendChild(sample); fillW(sample);
  var db = dimBar('Norma culta', '100/200 · piso 120', 0.5, true, 296);
  comp.appendChild(db); fillW(db);
  row.appendChild(comp);

  board.appendChild(row);
  return board;
}

/* ---------------- main ---------------- */

function main() {
  return resolveFonts().then(function () {
    var page = figma.createPage();
    page.name = 'Argumenta · UI v2';
    figma.currentPage = page;

    createStyles();

    var board = paletteBoard();
    page.appendChild(board);
    board.x = 0; board.y = 0;

    var screens = [
      screenEntrada(), screenTrilha(), screenCena(),
      screenEditor(), screenCorrecao(), screenConsequencia(), screenProgresso()
    ];
    var x = 0;
    var y = board.height + 120;
    for (var i = 0; i < screens.length; i++) {
      page.appendChild(screens[i]);
      screens[i].x = x;
      screens[i].y = y;
      x += 390 + 90;
    }

    figma.viewport.scrollAndZoomIntoView([board].concat(screens));
    figma.notify('Argumenta UI v2 desenhada: 7 telas + estilos criados.');
  });
}

await main();
