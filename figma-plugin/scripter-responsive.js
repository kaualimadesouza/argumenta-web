// Argumenta UI - responsive screens (desktop, notebook, tablet)
// Run inside the Scripter plugin. Creates the page "Argumenta · Responsivo"
// with the key screens at 1920x1080 (PC), 1440x900 (notebook) and 834x1112
// (tablet). Mobile 9:16 lives on the page "Argumenta · UI v2".
// Source of truth for the visuals: design/ui-mockups.html in the repo.

/* ---------------- palette ---------------- */

var HEX = {
  paper: '#F6F6F3', card: '#FFFFFF', ink: '#1D2530', muted: '#61707A',
  caneta: '#2149C4', canetaSoft: '#E8EDFB', marcatexto: '#FFE45C',
  corretor: '#C2402A', corretorSoft: '#F9E9E5', aprovado: '#2E7D5B',
  aprovadoSoft: '#E4F1EA', line: '#E5E4DC', noite: '#232D3B',
  noiteInner: '#26303F', track: '#ECEBE4', luz: '#F3F1E8'
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
  if (opts.width) { t.textAutoResize = 'HEIGHT'; t.resize(opts.width, t.height); }
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
function fixW(node, w) { node.counterAxisSizingMode = 'FIXED'; node.resize(w, node.height); }

function svgNode(svg, name, scale) {
  var n = figma.createNodeFromSvg(svg);
  n.name = name;
  if (scale && scale !== 1) n.rescale(scale);
  return n;
}

function card(opts) {
  opts = opts || {};
  return stack('VERTICAL', {
    gap: opts.gap !== undefined ? opts.gap : 8,
    padding: opts.padding || [18, 20, 18, 20],
    bg: opts.bg || C.card,
    radius: 14,
    stroke: opts.stroke || C.line,
    strokeWeight: opts.strokeWeight || 1,
    name: opts.name || 'card'
  });
}

function chip(label, fg, bg) {
  var f = stack('HORIZONTAL', { gap: 0, padding: [5, 10, 5, 10], bg: bg, radius: 999, name: 'chip/' + label });
  f.appendChild(text(label, FONT.monoMd, 10, fg, { upper: true, letterSpacing: 6 }));
  return f;
}

function kicker(label, color) {
  return text(label, FONT.monoMd, 10, color || C.muted, { upper: true, letterSpacing: 10 });
}

function button(label, opts) {
  opts = opts || {};
  var f = stack('HORIZONTAL', {
    gap: 9, padding: [14, 22, 14, 22],
    bg: opts.ghost ? C.card : (opts.bg || C.caneta),
    radius: 10, justify: 'CENTER', align: 'CENTER', name: 'btn/' + label
  });
  if (opts.ghost) { f.strokes = solid(C.ink); f.strokeWeight = 1.5; }
  if (opts.leading) f.appendChild(opts.leading);
  f.appendChild(text(label, FONT.displayB, 15, opts.ghost ? C.ink : (opts.fg || rgb('#FFFFFF'))));
  return f;
}

function spaceBetweenRow(name) {
  return stack('HORIZONTAL', { gap: 8, justify: 'SPACE_BETWEEN', align: 'CENTER', name: name || 'row' });
}

function dimBar(label, scoreText, pct, low, width) {
  var wrap = stack('VERTICAL', { gap: 5, name: 'dim/' + label });
  var head = spaceBetweenRow('head');
  head.appendChild(text(label, FONT.mono, 11, C.ink));
  head.appendChild(text(scoreText, FONT.mono, 11, C.muted));
  width = width || 320;
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

function progressBar(pct, color, width) {
  width = width || 226;
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
  var f = stack('HORIZONTAL', { gap: 0, padding: [2, 7, 2, 7], bg: info ? C.caneta : C.corretor, radius: 999, name: 'mark/' + n, justify: 'CENTER', align: 'CENTER' });
  f.appendChild(text(String(n), FONT.monoSB, 9, rgb('#FFFFFF')));
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

function avatar(scalePx) {
  var n = svgNode(SVG_AVATAR_MARCOS, 'avatar/tio-marcos', scalePx / 64);
  n.cornerRadius = scalePx / 2;
  n.clipsContent = true;
  n.strokes = solid(C.ink);
  n.strokeWeight = scalePx >= 40 ? 2 : 1.5;
  return n;
}

/* ---------------- responsive building blocks ---------------- */

function viewport(name, w, h) {
  var f = stack('VERTICAL', { gap: 0, bg: C.paper, name: name, align: 'CENTER' });
  f.primaryAxisSizingMode = 'FIXED';
  f.counterAxisSizingMode = 'FIXED';
  f.resize(w, h);
  f.clipsContent = true;
  f.strokes = solid(C.line);
  f.strokeWeight = 1;
  return f;
}

function topbar(active) {
  var wrap = stack('VERTICAL', { gap: 0, bg: C.card, name: 'topbar' });
  var bar = stack('HORIZONTAL', { gap: 24, padding: [16, 40, 16, 40], justify: 'SPACE_BETWEEN', align: 'CENTER', name: 'bar' });
  bar.appendChild(highlightText('Argumenta', FONT.displayXB, 20, 0.48));

  var nav = stack('HORIZONTAL', { gap: 28, align: 'CENTER', name: 'nav' });
  var labels = ['Trilha', 'Progresso', 'Conta'];
  for (var i = 0; i < labels.length; i++) {
    var on = labels[i] === active;
    nav.appendChild(text(labels[i], on ? FONT.monoSB : FONT.mono, 10.5, on ? C.caneta : C.muted, { upper: true, letterSpacing: 8 }));
  }
  bar.appendChild(nav);

  var chips = stack('HORIZONTAL', { gap: 8, align: 'CENTER', name: 'chips' });
  chips.appendChild(chip('7 dias', C.ink, C.marcatexto));
  chips.appendChild(chip('2/3 envios hoje', C.caneta, C.canetaSoft));
  chips.appendChild(avatar(30));
  bar.appendChild(chips);

  wrap.appendChild(bar); fillW(bar);
  var line = figma.createRectangle();
  line.resize(100, 1); line.fills = solid(C.line);
  wrap.appendChild(line); fillW(line);
  return wrap;
}

function storyRowCard(cover, title, chipNode, subtitle, pct, pctColor, opts) {
  opts = opts || {};
  var c = card({ name: 'story/' + title, gap: 0, stroke: opts.stroke || C.line, strokeWeight: opts.strokeWeight || 1, padding: [16, 18, 16, 18] });
  c.layoutMode = 'HORIZONTAL';
  c.itemSpacing = 14;
  if (opts.dim) c.opacity = 0.55;
  var cv = svgNode(cover, 'cover/' + title, 1);
  cv.cornerRadius = 12; cv.clipsContent = true;
  c.appendChild(cv);
  var body = stack('VERTICAL', { gap: 7, name: 'body' });
  var row = spaceBetweenRow('titlerow');
  row.appendChild(text(title, FONT.displayB, 16, C.ink));
  row.appendChild(chipNode);
  body.appendChild(row); fillW(row);
  body.appendChild(text(subtitle, FONT.displayR, 12, C.muted));
  var pb = progressBar(pct, pctColor, 240);
  body.appendChild(pb);
  c.appendChild(body); fillW(body);
  return c;
}

function falaTioMarcos(width) {
  var row = stack('HORIZONTAL', { gap: 12, name: 'fala', align: 'MIN' });
  row.appendChild(avatar(48));
  var bubble = stack('VERTICAL', { gap: 5, padding: [14, 16, 14, 16], bg: C.card, stroke: C.line, name: 'bubble' });
  bubble.cornerRadius = 14;
  bubble.topLeftRadius = 2;
  bubble.appendChild(kicker('Tio Marcos', C.corretor));
  var q = text('"Cuidar da vó nem é trabalho de verdade. Trabalho é o que eu faço: saio às seis, volto às oito."', FONT.serifIt, 15, C.ink, { lineHeight: 158 });
  bubble.appendChild(q); fillW(q);
  row.appendChild(bubble); fillW(bubble);
  fixW(row, width);
  return row;
}

function editorCard(width) {
  var editor = stack('VERTICAL', { gap: 10, padding: [20, 24, 20, 24], bg: C.card, radius: 14, stroke: C.caneta, strokeWeight: 1.5, name: 'editor' });
  var draft = text(
    'Tio, eu entendo que o senhor trabalha muito, mas a mãe também trabalha e ainda cuida da vó todos os dias sem descanso. Concerteza o senhor já percebeu que ela esta cansada. Segundo o IBGE, as mulheres brasileiras dedicam quase o dobro de horas ao trabalho de cuidado em comparação aos homens, oque mostra que essa divisão desigual não acontece só na nossa familia.',
    FONT.serif, 16, C.ink, { lineHeight: 168 });
  editor.appendChild(draft); fillW(draft);
  var pad = figma.createRectangle(); pad.resize(10, 90); pad.fills = [];
  editor.appendChild(pad);
  var foot = spaceBetweenRow('editor-foot');
  foot.appendChild(text('118 / 250 palavras', FONT.mono, 11, C.muted));
  foot.appendChild(text('rascunho salvo', FONT.mono, 11, C.muted));
  editor.appendChild(foot); fillW(foot);
  fixW(editor, width);
  return editor;
}

function objetivoSidebar(width) {
  var side = stack('VERTICAL', { gap: 14, name: 'sidebar' });
  var head = card({ name: 'objetivo', gap: 10 });
  var who = stack('HORIZONTAL', { gap: 10, align: 'CENTER', name: 'who' });
  who.appendChild(avatar(32));
  who.appendChild(kicker('Convença o tio Marcos'));
  head.appendChild(who);
  var objText = text('Convencer o tio Marcos de que o cuidado com a vó é trabalho de verdade, e que precisa ser dividido.', FONT.displayR, 13.5, C.ink, { lineHeight: 148 });
  head.appendChild(objText); fillW(objText);
  var reqs = stack('HORIZONTAL', { gap: 6, name: 'reqs' });
  reqs.appendChild(chip('Tese', C.caneta, C.canetaSoft));
  reqs.appendChild(chip('Justificativa', C.caneta, C.canetaSoft));
  head.appendChild(reqs);
  var reqs2 = stack('HORIZONTAL', { gap: 6, name: 'reqs2' });
  reqs2.appendChild(chip('Repertório explicado', C.caneta, C.canetaSoft));
  head.appendChild(reqs2);
  side.appendChild(head); fillW(head);

  var envios = card({ name: 'envios', gap: 6 });
  envios.appendChild(kicker('Envios de hoje'));
  envios.appendChild(text('2 de 3 usados · renova à meia-noite', FONT.displayR, 12.5, C.ink));
  side.appendChild(envios); fillW(envios);

  var cta = button('Enviar para o tio Marcos', {});
  side.appendChild(cta); fillW(cta);
  fixW(side, width);
  return side;
}

function textoCorrigidoCard(width) {
  var texto = card({ name: 'texto-corrigido', gap: 10 });
  texto.appendChild(kicker('Seu texto, corrigido'));
  var full = 'Concerteza o senhor já percebeu que ela esta cansada. Segundo o IBGE, as mulheres dedicam quase o dobro de horas ao trabalho de cuidado, oque mostra que essa divisão não acontece só na nossa familia.';
  var corrected = text(full, FONT.serif, 15, C.ink, { lineHeight: 165 });
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
    var row = stack('HORIZONTAL', { gap: 9, align: 'MIN', name: 'item' });
    row.appendChild(markNum(items[n][0], items[n][1]));
    var it = text(items[n][2], FONT.displayR, 12.5, C.ink, { lineHeight: 142 });
    row.appendChild(it); fillW(it);
    texto.appendChild(row); fillW(row);
  }
  fixW(texto, width);
  return texto;
}

function placarSidebar(width) {
  var side = stack('VERTICAL', { gap: 14, name: 'placar-side' });
  var verdict = card({ name: 'veredito', bg: C.corretorSoft, stroke: C.corretor });
  verdict.appendChild(text('Quase. A norma culta segurou você.', FONT.displayXB, 17, C.corretor, { lineHeight: 122 }));
  var vs = text('Argumento bom, mas a escrita ficou abaixo do piso. Revise e reenvie.', FONT.displayR, 12.5, C.ink, { lineHeight: 148 });
  verdict.appendChild(vs); fillW(vs);
  side.appendChild(verdict); fillW(verdict);

  var placar = card({ name: 'placar', gap: 9 });
  placar.appendChild(kicker('Placar · lente ENEM · capítulo'));
  var dims = [
    ['C1 Norma culta', '100/200 · piso 120', 0.5, true],
    ['C2 Repertório', '160/200', 0.8, false],
    ['C3 Coerência', '150/200', 0.75, false],
    ['C4 Coesão', '140/200', 0.7, false],
    ['Persuasão · Argumenta', '78/100', 0.78, false]
  ];
  for (var i = 0; i < dims.length; i++) {
    var d = dimBar(dims[i][0], dims[i][1], dims[i][2], dims[i][3], width - 44);
    placar.appendChild(d); fillW(d);
  }
  side.appendChild(placar); fillW(placar);

  var cta = button('Revisar meu texto', { bg: C.corretor });
  side.appendChild(cta); fillW(cta);
  fixW(side, width);
  return side;
}

/* ---------------- screens ---------------- */

function screenEntradaDesktop(w, h) {
  var s = viewport('Entrada · ' + w, w, h);
  s.layoutMode = 'HORIZONTAL';
  s.itemSpacing = 0;

  var left = stack('VERTICAL', { gap: 20, padding: [0, 60, 0, 60], bg: C.noite, align: 'CENTER', justify: 'CENTER', name: 'brand' });
  left.appendChild(svgNode(SVG_PEN, 'illu/caneta', 300 / 220));
  left.appendChild(highlightText('Argumenta', FONT.displayXB, 52, 0.48));
  var tagline = text('Vença a discussão dentro da história. Passe no vestibular fora dela.', FONT.serif, 18, C.luz, { lineHeight: 165, align: 'CENTER', width: 380 });
  left.appendChild(tagline);
  s.appendChild(left);
  fixW(left, Math.round(w * 0.52));
  left.layoutSizingVertical = 'FILL';

  var right = stack('VERTICAL', { gap: 0, align: 'CENTER', justify: 'CENTER', name: 'auth' });
  var box = stack('VERTICAL', { gap: 12, name: 'authbox' });
  box.appendChild(text('Entrar', FONT.displayXB, 26, C.ink));
  box.appendChild(text('Treine argumentação para o ENEM e a FUVEST.', FONT.displayR, 13.5, C.muted, { lineHeight: 145, width: 340 }));
  var gtile = figma.createFrame();
  gtile.name = 'gtile'; gtile.resize(22, 22); gtile.cornerRadius = 5; gtile.fills = solid(C.card);
  var g = svgNode(SVG_GOOGLE_G, 'google-g', 13 / 18);
  gtile.appendChild(g); g.x = 4.5; g.y = 4.5;
  var b1 = button('Entrar com Google', { leading: gtile });
  box.appendChild(b1); fillW(b1);
  var b2 = button('Criar conta com e-mail', { ghost: true });
  box.appendChild(b2); fillW(b2);
  var note = text('Só pedimos e-mail, apelido e os seus vestibulares alvo.', FONT.mono, 10.5, C.muted, { lineHeight: 150, width: 340 });
  box.appendChild(note);
  fixW(box, 360);
  right.appendChild(box);
  s.appendChild(right);
  fillW(right);
  right.layoutSizingVertical = 'FILL';
  return s;
}

function screenTrilhaDesktop(w, h, contentW) {
  var s = viewport('Trilha · ' + w, w, h);
  var tb = topbar('Trilha');
  s.appendChild(tb); fillW(tb);

  var content = stack('VERTICAL', { gap: 18, padding: [36, 0, 36, 0], name: 'content' });
  content.appendChild(text('Sua trilha', FONT.displayXB, 26, C.ink));

  var active = stack('VERTICAL', { gap: 14, padding: [18, 22, 18, 22], bg: C.card, radius: 14, stroke: C.caneta, strokeWeight: 1.5, name: 'story/ativa' });
  var inner = stack('HORIZONTAL', { gap: 16, name: 'inner', align: 'CENTER' });
  var cv = svgNode(SVG_COVER_CUIDADO, 'cover/Cuidado Invisível', 96 / 74);
  cv.cornerRadius = 12; cv.clipsContent = true;
  inner.appendChild(cv);
  var body = stack('VERTICAL', { gap: 8, name: 'body' });
  var row = spaceBetweenRow('titlerow');
  row.appendChild(text('Cuidado Invisível', FONT.displayB, 20, C.ink));
  row.appendChild(chip('Cap. 2/5', C.caneta, C.canetaSoft));
  body.appendChild(row); fillW(row);
  body.appendChild(text('Tema ENEM 2023 · convença o tio Marcos', FONT.displayR, 13, C.muted));
  body.appendChild(progressBar(0.4, C.caneta, 420));
  inner.appendChild(body); fillW(body);
  var cta = button('Continuar capítulo 2', {});
  inner.appendChild(cta);
  active.appendChild(inner); fillW(inner);
  content.appendChild(active); fillW(active);

  var grid = stack('HORIZONTAL', { gap: 18, name: 'grid', align: 'MIN' });
  var c1 = storyRowCard(SVG_COVER_GREMIO, 'O Grêmio', chip('Concluída', C.aprovado, C.aprovadoSoft), 'Tutorial · 3 capítulos', 1, C.aprovado);
  var c3 = storyRowCard(SVG_COVER_SINAL, 'Sinal Fechado', chip('Bloqueada', C.corretor, C.corretorSoft), 'Tema FUVEST · conclua Cuidado Invisível', 0, C.caneta, { dim: true });
  grid.appendChild(c1); grid.appendChild(c3);
  fixW(c1, (contentW - 18) / 2);
  fixW(c3, (contentW - 18) / 2);
  content.appendChild(grid); fillW(grid);

  s.appendChild(content);
  fixW(content, contentW);
  return s;
}

function screenCenaDesktop(w, h) {
  var s = viewport('Cena · ' + w, w, h);
  var tb = topbar('Trilha');
  s.appendChild(tb); fillW(tb);

  var col = stack('VERTICAL', { gap: 16, padding: [32, 0, 32, 0], name: 'reading-column' });
  var bar = spaceBetweenRow('breadcrumb');
  bar.appendChild(text('← Trilha · Cuidado Invisível', FONT.mono, 11.5, C.muted));
  bar.appendChild(chip('Cap. 2 de 5', C.caneta, C.canetaSoft));
  col.appendChild(bar); fillW(bar);

  var panel = svgNode(SVG_KITCHEN, 'illu/cozinha-a-noite', 680 / 390);
  panel.cornerRadius = 14; panel.clipsContent = true;
  col.appendChild(panel);

  var narr = text('Domingo à noite. A pia ainda cheia, a vó já dormindo. Sua mãe apaga a luz da cozinha com o rosto fechado de quem repete aquilo há meses.', FONT.serif, 17, C.ink, { lineHeight: 172 });
  col.appendChild(narr); fillW(narr);

  var fala = falaTioMarcos(680);
  col.appendChild(fala); fillW(fala);

  var obj = card({ name: 'objetivo' });
  obj.appendChild(kicker('Seu objetivo'));
  var objText = text('Convencer o tio Marcos de que o cuidado com a vó é trabalho de verdade, e que precisa ser dividido.', FONT.displayR, 14.5, C.ink, { lineHeight: 148 });
  obj.appendChild(objText); fillW(objText);
  col.appendChild(obj); fillW(obj);

  var cta = button('Argumentar', {});
  col.appendChild(cta); fillW(cta);

  s.appendChild(col);
  fixW(col, 680);
  return s;
}

function screenEditorDesktop(w, h) {
  var s = viewport('Editor · ' + w, w, h);
  var tb = topbar('Trilha');
  s.appendChild(tb); fillW(tb);

  var wrap = stack('HORIZONTAL', { gap: 28, padding: [32, 0, 32, 0], name: 'columns', align: 'MIN' });
  wrap.appendChild(editorCard(740));
  wrap.appendChild(objetivoSidebar(340));
  s.appendChild(wrap);
  return s;
}

function screenCorrecaoDesktop(w, h) {
  var s = viewport('Correção · ' + w, w, h);
  var tb = topbar('Trilha');
  s.appendChild(tb); fillW(tb);

  var wrap = stack('HORIZONTAL', { gap: 28, padding: [32, 0, 32, 0], name: 'columns', align: 'MIN' });
  wrap.appendChild(textoCorrigidoCard(700));
  wrap.appendChild(placarSidebar(380));
  s.appendChild(wrap);
  return s;
}

function screenTrilhaTablet(w, h) {
  var s = viewport('Trilha · tablet ' + w, w, h);
  var tb = topbar('Trilha');
  s.appendChild(tb); fillW(tb);

  var content = stack('VERTICAL', { gap: 16, padding: [28, 0, 28, 0], name: 'content' });
  content.appendChild(text('Sua trilha', FONT.displayXB, 24, C.ink));
  var c1 = storyRowCard(SVG_COVER_GREMIO, 'O Grêmio', chip('Concluída', C.aprovado, C.aprovadoSoft), 'Tutorial · 3 capítulos', 1, C.aprovado);
  content.appendChild(c1); fillW(c1);

  var active = stack('VERTICAL', { gap: 12, padding: [16, 18, 16, 18], bg: C.card, radius: 14, stroke: C.caneta, strokeWeight: 1.5, name: 'story/ativa' });
  var inner = stack('HORIZONTAL', { gap: 14, name: 'inner' });
  var cv = svgNode(SVG_COVER_CUIDADO, 'cover/Cuidado Invisível', 1);
  cv.cornerRadius = 12; cv.clipsContent = true;
  inner.appendChild(cv);
  var body = stack('VERTICAL', { gap: 7, name: 'body' });
  var row = spaceBetweenRow('titlerow');
  row.appendChild(text('Cuidado Invisível', FONT.displayB, 17, C.ink));
  row.appendChild(chip('Cap. 2/5', C.caneta, C.canetaSoft));
  body.appendChild(row); fillW(row);
  body.appendChild(text('Tema ENEM 2023 · convença o tio Marcos', FONT.displayR, 12, C.muted));
  body.appendChild(progressBar(0.4, C.caneta, 300));
  inner.appendChild(body); fillW(body);
  active.appendChild(inner); fillW(inner);
  var cta = button('Continuar capítulo 2', {});
  active.appendChild(cta); fillW(cta);
  content.appendChild(active); fillW(active);

  var c3 = storyRowCard(SVG_COVER_SINAL, 'Sinal Fechado', chip('Bloqueada', C.corretor, C.corretorSoft), 'Tema FUVEST · conclua Cuidado Invisível', 0, C.caneta, { dim: true });
  content.appendChild(c3); fillW(c3);

  s.appendChild(content);
  fixW(content, 700);
  return s;
}

function screenEditorTablet(w, h) {
  var s = viewport('Editor · tablet ' + w, w, h);
  var tb = topbar('Trilha');
  s.appendChild(tb); fillW(tb);
  var content = stack('VERTICAL', { gap: 16, padding: [28, 0, 28, 0], name: 'content' });
  var side = objetivoSidebar(700);
  content.appendChild(side);
  var ed = editorCard(700);
  content.appendChild(ed);
  s.appendChild(content);
  fixW(content, 700);
  return s;
}

function screenCorrecaoTablet(w, h) {
  var s = viewport('Correção · tablet ' + w, w, h);
  var tb = topbar('Trilha');
  s.appendChild(tb); fillW(tb);
  var content = stack('VERTICAL', { gap: 16, padding: [28, 0, 28, 0], name: 'content' });
  content.appendChild(placarSidebar(700));
  content.appendChild(textoCorrigidoCard(700));
  s.appendChild(content);
  fixW(content, 700);
  return s;
}

/* ---------------- main ---------------- */

async function main() {
  await resolveFonts();

  var PAGE_NAME = 'Argumenta · Responsivo';
  var pages = figma.root.children;
  for (var i = pages.length - 1; i >= 0; i--) {
    if (pages[i].name === PAGE_NAME) pages[i].remove();
  }
  var page = figma.createPage();
  page.name = PAGE_NAME;
  figma.currentPage = page;

  function label(txt, x, y) {
    var t = text(txt, FONT.monoSB, 18, C.muted, { upper: true, letterSpacing: 12 });
    page.appendChild(t); t.x = x; t.y = y;
  }

  var placed = [];
  function place(node, x, y) {
    page.appendChild(node);
    node.x = x; node.y = y;
    placed.push(node);
  }

  /* Notebook 1440x900 */
  label('Notebook · 1440x900', 0, -60);
  place(screenEntradaDesktop(1440, 900), 0, 0);
  place(screenTrilhaDesktop(1440, 900, 1120), 1560, 0);
  place(screenCenaDesktop(1440, 900), 3120, 0);
  place(screenEditorDesktop(1440, 900), 4680, 0);
  place(screenCorrecaoDesktop(1440, 900), 6240, 0);

  /* PC 1920x1080: same layout, content capped at the same max width */
  label('PC · 1920x1080 (coluna limitada a 1120)', 0, 1040);
  place(screenTrilhaDesktop(1920, 1080, 1120), 0, 1100);

  /* Tablet 834x1112 (portrait) */
  label('Tablet · 834x1112', 0, 2320);
  place(screenTrilhaTablet(834, 1112), 0, 2380);
  place(screenEditorTablet(834, 1112), 954, 2380);
  place(screenCorrecaoTablet(834, 1112), 1908, 2380);

  figma.viewport.scrollAndZoomIntoView(placed);
  figma.notify('Argumenta responsivo: 9 telas em 3 tamanhos desenhadas.');
}

await main();
