// Built from figma-plugin/src by `npm run figma:build`. Do not edit by hand.
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // figma-plugin/src/tokens.ts
  var COLORS = {
    paper: "#F4F5F7",
    card: "#FFFFFF",
    line: "#E4E7EB",
    lineStrong: "#D3D8DE",
    track: "#ECEEF1",
    ink: "#101418",
    ink2: "#54606C",
    muted: "#6B7683",
    disabled: "#C9CFD6",
    caneta: "#2649E5",
    canetaPress: "#1932A8",
    canetaSoft: "#EDF0FE",
    aprovado: "#0E9F6E",
    aprovadoInk: "#07784F",
    aprovadoSoft: "#E7F6F0",
    corretor: "#D92D20",
    corretorInk: "#A81C1C",
    corretorSoft: "#FDECEA",
    streak: "#E8891A",
    streakInk: "#A35C08",
    streakSoft: "#FBF0E2",
    marcaTexto: "#FFE9A8",
    noite: "#111722",
    noiteInner: "#1B2432",
    luz: "#E6EAF0",
    luzMuted: "#9AA6B6"
  };
  var TYPE = {
    display: 30,
    title: 24,
    lead: 19,
    body: 15,
    meta: 13,
    micro: 11
  };
  var TRACKING = { title: -3, lead: -2, body: -1.1 };
  var SHAPE = { card: 14, button: 12, tile: 10, chip: 999 };
  var LAYOUT = {
    contentMax: 544,
    contentMaxWide: 672,
    pageMax: 1056,
    rail: 352,
    landingMax: 1200
  };
  var LANDING_SCALE = {
    phone: { hero: 40, headline: 32, stat: 36, quote: 30 },
    tablet: { hero: 54, headline: 32, stat: 36, quote: 30 },
    desktop: { hero: 66, headline: 46, stat: 44, quote: 48 }
  };

  // figma-plugin/src/devices.ts
  var DEVICES = [
    { id: "phone", label: "Celular · 390 × 844", width: 390, height: 844, nav: "tabbar" },
    { id: "tablet", label: "Tablet · 834 × 1112", width: 834, height: 1112, nav: "topbar" },
    { id: "desktop", label: "Desktop · 1440 × 900", width: 1440, height: 900, nav: "rail" }
  ];
  var RULES = {
    document: {
      phone: { max: LAYOUT.contentMax, padX: 20, padTop: 24, padBottom: 48, gap: 16 },
      tablet: { max: LAYOUT.contentMax, padX: 20, padTop: 24, padBottom: 56, gap: 16 },
      desktop: { max: LAYOUT.contentMax, padX: 20, padTop: 24, padBottom: 64, gap: 16 }
    },
    reading: {
      phone: { max: LAYOUT.contentMax, padX: 20, padTop: 18, padBottom: 40, gap: 14 },
      tablet: { max: LAYOUT.contentMaxWide, padX: 24, padTop: 32, padBottom: 48, gap: 16 },
      desktop: { max: LAYOUT.contentMaxWide, padX: 24, padTop: 40, padBottom: 56, gap: 16 }
    },
    wide: {
      phone: { max: LAYOUT.contentMax, padX: 20, padTop: 18, padBottom: 40, gap: 14 },
      tablet: { max: LAYOUT.contentMaxWide, padX: 24, padTop: 28, padBottom: 48, gap: 16 },
      desktop: { max: LAYOUT.pageMax, padX: 32, padTop: 36, padBottom: 48, gap: 20 }
    },
    narrow: {
      phone: { max: 400, padX: 20, padTop: 24, padBottom: 48, gap: 16 },
      tablet: { max: 400, padX: 20, padTop: 32, padBottom: 48, gap: 16 },
      desktop: { max: 400, padX: 20, padTop: 40, padBottom: 48, gap: 16 }
    },
    landing: {
      phone: { max: LAYOUT.landingMax, padX: 20, padTop: 0, padBottom: 0, gap: 0 },
      tablet: { max: LAYOUT.landingMax, padX: 40, padTop: 0, padBottom: 0, gap: 0 },
      desktop: { max: LAYOUT.landingMax, padX: 40, padTop: 0, padBottom: 0, gap: 0 }
    }
  };
  function columnFor(device, shape) {
    const rule = RULES[shape][device.id];
    return {
      width: Math.min(rule.max, device.width) - 2 * rule.padX,
      padX: rule.padX,
      padTop: rule.padTop,
      padBottom: rule.padBottom,
      gap: rule.gap
    };
  }

  // figma-plugin/src/nodes.ts
  var STYLE = {
    400: "Regular",
    500: "Medium",
    600: "Semi Bold",
    700: "Bold",
    800: "Extra Bold"
  };
  var RESOLVED = /* @__PURE__ */ new Map();
  async function loadFonts() {
    var _a;
    const available = await figma.listAvailableFontsAsync();
    const inter = available.filter((font) => font.fontName.family === "Inter");
    const styles = new Set(inter.map((font) => font.fontName.style));
    const order = [400, 500, 600, 700, 800];
    for (const weight of order) {
      const wanted = [STYLE[weight], ...order.map((other) => STYLE[other])];
      const style = (_a = wanted.find((candidate) => styles.has(candidate))) != null ? _a : "Regular";
      RESOLVED.set(weight, { family: "Inter", style });
    }
    for (const font of new Set(RESOLVED.values())) await figma.loadFontAsync(font);
  }
  function fontOf(weight) {
    var _a;
    return (_a = RESOLVED.get(weight)) != null ? _a : { family: "Inter", style: "Regular" };
  }
  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 };
  }
  function paint(color, opacity) {
    const solid = { type: "SOLID", color: rgb(COLORS[color]) };
    return [opacity === void 0 ? solid : __spreadProps(__spreadValues({}, solid), { opacity })];
  }
  function edges(padding) {
    if (typeof padding === "number") return [padding, padding, padding, padding];
    if (padding.length === 2) return [padding[0], padding[1], padding[0], padding[1]];
    return padding;
  }
  function stack(options = {}) {
    var _a, _b, _c, _d, _e, _f;
    const frame = figma.createFrame();
    const [top, right, bottom, left] = edges((_a = options.padding) != null ? _a : 0);
    frame.name = (_b = options.name) != null ? _b : "stack";
    frame.layoutMode = (_c = options.direction) != null ? _c : "VERTICAL";
    frame.itemSpacing = (_d = options.gap) != null ? _d : 0;
    frame.paddingTop = top;
    frame.paddingRight = right;
    frame.paddingBottom = bottom;
    frame.paddingLeft = left;
    frame.counterAxisAlignItems = options.align === "BASELINE" ? "BASELINE" : (_e = options.align) != null ? _e : "MIN";
    frame.primaryAxisAlignItems = (_f = options.justify) != null ? _f : "MIN";
    frame.clipsContent = false;
    frame.fills = options.fill === void 0 || options.fill === null ? [] : paint(options.fill);
    if (options.radius !== void 0) frame.cornerRadius = options.radius;
    if (options.wrap === true) frame.layoutWrap = "WRAP";
    setSize(frame, { width: options.width });
    if (options.border) applyBorder(frame, options.border);
    return frame;
  }
  function setSize(frame, size) {
    var _a, _b;
    const sideways = frame.layoutMode === "HORIZONTAL";
    frame.resize((_a = size.width) != null ? _a : frame.width, (_b = size.height) != null ? _b : frame.height);
    const primary = sideways ? size.width : size.height;
    const counter = sideways ? size.height : size.width;
    frame.primaryAxisSizingMode = primary === void 0 ? "AUTO" : "FIXED";
    frame.counterAxisSizingMode = counter === void 0 ? "AUTO" : "FIXED";
  }
  function states(frame, dimension) {
    if (frame.layoutMode === "NONE") return true;
    const primary = dimension === (frame.layoutMode === "HORIZONTAL" ? "width" : "height");
    return primary ? frame.primaryAxisSizingMode === "FIXED" : frame.counterAxisSizingMode === "FIXED";
  }
  function room(frame, dimension = "width") {
    const sideways = dimension === "width";
    const pad = sideways ? frame.paddingLeft + frame.paddingRight : frame.paddingTop + frame.paddingBottom;
    if (frame.strokes.length === 0 || frame.strokeAlign !== "INSIDE") return frame[dimension] - pad;
    const sides = sideways ? [frame.strokeLeftWeight, frame.strokeRightWeight] : [frame.strokeTopWeight, frame.strokeBottomWeight];
    const weight = typeof frame.strokeWeight === "number" ? frame.strokeWeight : 0;
    const border = sides.reduce((carried, side) => carried + (side > 0 ? side : weight), 0);
    return frame[dimension] - pad - border;
  }
  function laidOut(node) {
    return "layoutAlign" in node && "layoutSizingHorizontal" in node;
  }
  function settleSizing(frame) {
    const cross = frame.layoutMode === "HORIZONTAL" ? "height" : "width";
    const main2 = frame.layoutMode === "HORIZONTAL" ? "width" : "height";
    for (const child of frame.children) {
      const marks = laidOut(child) ? child.getPluginData(SIZING).split(" ") : [];
      if (laidOut(child)) {
        if (marks.includes("fill") && states(frame, cross)) fillDimension(child, cross);
        if (marks.includes("grow") && states(frame, main2)) fillDimension(child, main2);
      }
      if (child.type === "FRAME") settleSizing(child);
    }
    return frame;
  }
  function fillDimension(node, dimension) {
    if (dimension === "width") node.layoutSizingHorizontal = "FILL";
    else node.layoutSizingVertical = "FILL";
  }
  function applyBorder(node, border) {
    node.strokes = paint(border.color);
    node.strokeAlign = "INSIDE";
    if (border.dashed === true) node.dashPattern = [3, 3];
    const sides = border.sides;
    if (sides === void 0) {
      node.strokeWeight = border.weight;
      return;
    }
    node.strokeTopWeight = sides.includes("top") ? border.weight : 0;
    node.strokeRightWeight = sides.includes("right") ? border.weight : 0;
    node.strokeBottomWeight = sides.includes("bottom") ? border.weight : 0;
    node.strokeLeftWeight = sides.includes("left") ? border.weight : 0;
  }
  function text(content, options) {
    var _a, _b, _c, _d;
    const node = figma.createText();
    node.name = (_a = options.name) != null ? _a : content.slice(0, 40);
    node.fontName = fontOf((_b = options.weight) != null ? _b : 400);
    node.fontSize = options.size;
    node.characters = content;
    node.fills = paint((_c = options.color) != null ? _c : "ink");
    node.textAlignHorizontal = (_d = options.align) != null ? _d : "LEFT";
    if (options.lineHeight !== void 0) {
      node.lineHeight = { value: options.lineHeight * 100, unit: "PERCENT" };
    }
    if (options.tracking !== void 0) {
      node.letterSpacing = { value: options.tracking, unit: "PERCENT" };
    }
    if (options.width === void 0) {
      node.textAutoResize = "WIDTH_AND_HEIGHT";
    } else {
      node.textAutoResize = "HEIGHT";
      node.resize(options.width, node.height);
    }
    return node;
  }
  function fill(node) {
    return mark(node, "fill");
  }
  function grow(node) {
    return mark(node, "grow");
  }
  var SIZING = "sizing";
  function mark(node, sizing) {
    const marks = new Set(node.getPluginData(SIZING).split(" ").filter(Boolean));
    marks.add(sizing);
    node.setPluginData(SIZING, [...marks].join(" "));
    return node;
  }
  function rect(width, height, color, radius = 0) {
    const node = figma.createRectangle();
    node.resize(width, height);
    node.fills = paint(color);
    if (radius > 0) node.cornerRadius = radius;
    node.name = "rect";
    return node;
  }
  function pressShadow(color = "canetaPress") {
    return [
      {
        type: "DROP_SHADOW",
        color: __spreadProps(__spreadValues({}, rgb(COLORS[color])), { a: 1 }),
        offset: { x: 0, y: 3 },
        radius: 0,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      }
    ];
  }
  function icon(svg, size, color) {
    const node = figma.createNodeFromSvg(svg);
    node.name = "icon";
    node.resize(size, size);
    for (const child of node.findAll(() => true)) {
      if ("strokes" in child && child.strokes.length > 0) child.strokes = paint(color);
      if ("fills" in child && Array.isArray(child.fills) && child.fills.length > 0) {
        child.fills = paint(color);
      }
    }
    return node;
  }

  // figma-plugin/src/chrome.ts
  function navWordmark(size, onNight = false) {
    return text("argumenta", {
      size,
      weight: 800,
      color: onNight ? "luz" : "ink",
      tracking: TRACKING.title,
      name: "wordmark"
    });
  }
  function brandWordmark(size, onNight = false) {
    const ink = onNight ? "luz" : "ink";
    const frame = figma.createFrame();
    frame.name = "brand/Argumenta";
    frame.fills = [];
    frame.clipsContent = false;
    const argu = text("Argu", { size, weight: 800, color: ink, tracking: TRACKING.title });
    const menta = text("menta", { size, weight: 800, color: ink, tracking: TRACKING.title });
    const pad = size * 0.08;
    const stripe = rect(argu.width + pad * 2, size * 0.48, "marcaTexto");
    frame.resize(argu.width + menta.width, argu.height);
    frame.appendChild(stripe);
    frame.appendChild(argu);
    frame.appendChild(menta);
    stripe.x = -pad;
    stripe.y = argu.height * 0.42;
    argu.x = 0;
    argu.y = 0;
    menta.x = argu.width;
    menta.y = 0;
    return frame;
  }
  function penMark(width) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 110"><path d="M18 86 q70 -20 152 -8" fill="none" stroke="${COLORS.marcaTexto}" stroke-width="16" stroke-linecap="round"/><g transform="rotate(38 172 74)"><rect x="166" y="28" width="13" height="40" rx="4" fill="${COLORS.caneta}"/><path d="M166 68 h13 l-6.5 14 z" fill="${COLORS.ink}"/><circle cx="172.5" cy="79" r="1.6" fill="${COLORS.paper}"/></g></svg>`;
    const node = figma.createNodeFromSvg(svg);
    node.name = "PenMark";
    node.resize(width, width * (110 / 220));
    return node;
  }
  var STROKE = `stroke="${COLORS.ink2}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`;
  var TABS = [
    {
      id: "trilha",
      label: "Trilha",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M6 20.5V4.5m0 .8h10.2l-1.6 3.4 1.6 3.4H6" ${STROKE}/></svg>`
    },
    {
      id: "progresso",
      label: "Progresso",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M4 16.4 9.2 10l4 3.6L20 5.4" ${STROKE}/><path d="M4 20h16" ${STROKE}/></svg>`
    },
    {
      id: "conta",
      label: "Conta",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.4" r="3.5" ${STROKE}/><path d="M5.4 19.4c1.1-3.3 3.5-5 6.6-5s5.5 1.7 6.6 5" ${STROKE}/></svg>`
    }
  ];
  function tabPill(tab, active, size, height, gap) {
    const ink = active ? "caneta" : "ink2";
    const pill = stack({
      name: `tab/${tab.id}`,
      direction: "HORIZONTAL",
      gap,
      padding: [0, height >= 46 ? 12 : 14],
      fill: active ? "canetaSoft" : null,
      radius: height >= 46 ? SHAPE.button : SHAPE.tile,
      align: "CENTER"
    });
    setSize(pill, { height });
    pill.appendChild(icon(tab.svg, size, ink));
    pill.appendChild(text(tab.label, { size: TYPE.body, weight: 600, color: ink, tracking: TRACKING.body }));
    return pill;
  }
  function tabBar(device, active) {
    const bar = stack({
      name: "nav/tabbar",
      direction: "HORIZONTAL",
      padding: [10, 12, 18, 12],
      fill: "card",
      border: { color: "line", weight: 1, sides: ["top"] },
      width: device.width
    });
    for (const tab of TABS) {
      const isActive = tab.id === active;
      const ink = isActive ? "caneta" : "ink2";
      const cell = stack({ name: `tab/${tab.id}`, gap: 5, align: "CENTER", justify: "CENTER" });
      setSize(cell, { height: 44 });
      cell.appendChild(icon(tab.svg, 23, ink));
      cell.appendChild(text(tab.label, { size: TYPE.micro, weight: isActive ? 700 : 500, color: ink }));
      bar.appendChild(grow(cell));
    }
    return bar;
  }
  function topBar(device, active) {
    const bar = stack({
      name: "nav/topbar",
      direction: "HORIZONTAL",
      gap: 30,
      padding: [0, 28],
      fill: "card",
      border: { color: "line", weight: 1, sides: ["bottom"] },
      align: "CENTER",
      width: device.width
    });
    setSize(bar, { width: device.width, height: 66 });
    bar.appendChild(navWordmark(TYPE.lead));
    const tabs = stack({ name: "tabs", direction: "HORIZONTAL", gap: 4, align: "CENTER" });
    for (const tab of TABS) tabs.appendChild(tabPill(tab, tab.id === active, 20, 40, 9));
    bar.appendChild(tabs);
    return bar;
  }
  function rail(active) {
    const nav = stack({
      name: "nav/rail",
      gap: 28,
      padding: [26, 16, 22, 16],
      fill: "card",
      border: { color: "line", weight: 1, sides: ["right"] },
      width: 248
    });
    const mark2 = navWordmark(TYPE.lead);
    const markRow = stack({ name: "wordmark", padding: [0, 12] });
    markRow.appendChild(mark2);
    nav.appendChild(markRow);
    const tabs = stack({ name: "tabs", gap: 4, width: 216 });
    for (const tab of TABS) tabs.appendChild(fill(tabPill(tab, tab.id === active, 22, 46, 12)));
    nav.appendChild(fill(tabs));
    return nav;
  }
  function deviceFrame(device, spec) {
    var _a, _b;
    const frame = figma.createFrame();
    frame.name = `${spec.name} · ${device.width}`;
    frame.fills = paint("paper");
    frame.clipsContent = false;
    frame.layoutMode = spec.axis;
    frame.counterAxisAlignItems = (_a = spec.align) != null ? _a : "MIN";
    frame.primaryAxisAlignItems = (_b = spec.justify) != null ? _b : "MIN";
    setSize(frame, { width: device.width });
    return frame;
  }
  function screenFrame(device, spec) {
    var _a, _b, _c;
    const column = columnFor(device, spec.shape);
    const frame = deviceFrame(device, {
      name: spec.name,
      axis: device.nav === "rail" && spec.shell ? "HORIZONTAL" : "VERTICAL"
    });
    const body = stack({
      name: "body",
      padding: [column.padTop, column.padX, column.padBottom, column.padX],
      align: "CENTER",
      justify: spec.centred === true ? "CENTER" : "MIN"
    });
    const content = stack({ name: "content", gap: column.gap, width: column.width });
    const sideways = frame.layoutMode === "HORIZONTAL";
    if (spec.shell && device.nav === "topbar") frame.appendChild(fill(topBar(device, (_a = spec.tab) != null ? _a : null)));
    if (spec.shell && sideways) frame.appendChild(fill(rail((_b = spec.tab) != null ? _b : null)));
    body.appendChild(content);
    frame.appendChild(sideways ? grow(body) : grow(fill(body)));
    if (spec.shell && device.nav === "tabbar") frame.appendChild(fill(tabBar(device, (_c = spec.tab) != null ? _c : null)));
    return { frame, content, width: column.width };
  }
  function fitToDevice(frame, device) {
    setSize(frame, { width: device.width });
    if (frame.height < device.height) setSize(frame, { width: device.width, height: device.height });
    return settleSizing(frame);
  }
  function settle(screen, device) {
    return fitToDevice(screen.frame, device);
  }
  function screenBar(width, back, right) {
    const bar = stack({
      name: "bar",
      direction: "HORIZONTAL",
      gap: 12,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width
    });
    if (back !== null) {
      bar.appendChild(text(back, { size: TYPE.meta, weight: 600, color: "ink2" }));
    } else {
      bar.appendChild(stack({ name: "spacer" }));
    }
    const chips = stack({ name: "chips", direction: "HORIZONTAL", gap: 6, align: "CENTER" });
    for (const node of right) chips.appendChild(node);
    bar.appendChild(chips);
    return bar;
  }
  function nightPanel(body, options) {
    var _a;
    const pad = (_a = options.padding) != null ? _a : 20;
    const frame = stack({
      name: "narration",
      padding: pad,
      fill: "noite",
      radius: SHAPE.card,
      width: options.width
    });
    frame.appendChild(
      text(body, {
        size: options.size,
        color: "luz",
        lineHeight: 1.62,
        tracking: TRACKING.body,
        width: room(frame)
      })
    );
    return frame;
  }
  function speechRow(options) {
    const frame = stack({
      name: `speech/${options.who}`,
      gap: 13,
      padding: [18, 18, 15, 18],
      fill: "card",
      radius: SHAPE.card,
      border: { color: "line", weight: 1 },
      width: options.width
    });
    const quoted = text(`“${options.speech}”`, {
      size: options.size,
      weight: 600,
      lineHeight: 1.48,
      tracking: TRACKING.lead,
      width: room(frame)
    });
    quoted.setRangeFills(0, 1, paint("lineStrong"));
    quoted.setRangeFills(quoted.characters.length - 1, quoted.characters.length, paint("lineStrong"));
    frame.appendChild(quoted);
    const whoRow = stack({ name: "who", direction: "HORIZONTAL", gap: 9, align: "CENTER" });
    whoRow.appendChild(rect(18, 1, "lineStrong"));
    whoRow.appendChild(text(options.who, { size: TYPE.meta, weight: 700, color: "ink2" }));
    frame.appendChild(whoRow);
    return frame;
  }
  var COVER_DONE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m5.5 12.4 4.2 4.1L18.5 7.6" stroke="${COLORS.aprovado}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  var COVER_LOCKED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="4.8" y="10.6" width="14.4" height="9.4" rx="2.6" stroke="${COLORS.muted}" stroke-width="1.75"/><path d="M8.6 10.6V7.9a3.4 3.4 0 0 1 6.8 0v2.7" stroke="${COLORS.muted}" stroke-width="1.75"/></svg>`;
  function storyCover(position, state) {
    const done = state === "completed";
    const locked = state === "locked";
    const frame = stack({
      name: "cover",
      direction: "HORIZONTAL",
      fill: done ? "aprovadoSoft" : locked ? "paper" : "noite",
      radius: SHAPE.tile,
      align: "CENTER",
      justify: "CENTER",
      width: 52
    });
    setSize(frame, { width: 52, height: 52 });
    if (done) frame.appendChild(icon(COVER_DONE, 22, "aprovado"));
    else if (locked) frame.appendChild(icon(COVER_LOCKED, 22, "muted"));
    else frame.appendChild(text(String(position), { size: TYPE.lead, weight: 800, color: "luz", tracking: TRACKING.title }));
    return frame;
  }
  function bandLabel(label) {
    return text(label, { size: 28, weight: 700, color: "muted", tracking: TRACKING.title, name: `band/${label}` });
  }
  function frameLabel(label) {
    return text(label, { size: 16, weight: 600, color: "muted", name: `label/${label}` });
  }

  // figma-plugin/src/samples.ts
  var SCENE = {
    narration: "Dona Marta cedeu, com uma condição: “Se o Tenório topar cuidar da estrutura, eu autorizo.” O zelador está consertando um portão e nem levanta os olhos quando você chega.",
    speech: "Festival? Tô fora. Ano passado sumiu cadeira, pichação no banheiro e adivinha quem varreu tudo sozinho no sábado? Escreve aí no seu papelzinho: o pátio é meu.",
    speaker: "Seu Tenório",
    objective: "Escreva para Seu Tenório: por que ele pode confiar o pátio ao grêmio este ano, com compromissos concretos de cuidado e limpeza.",
    hint: "Um compromisso que dá para verificar convence mais que uma promessa de boa vontade. Pense em quem assina, quando, e o que acontece se falhar."
  };
  var TRACK = [
    {
      title: "O Grêmio",
      badge: "Concluída",
      badgeTone: "ok",
      line: "Tutorial · 3 capítulos",
      position: 1,
      state: "completed",
      percent: 100,
      cta: null
    },
    {
      title: "Cuidado Invisível",
      badge: "Cap. 2/5",
      badgeTone: "caneta",
      line: "Uma família decide, no almoço de domingo, quem cuida da avó. Ninguém quer dizer em voz alta que já decidiram.",
      position: 2,
      state: "in_progress",
      percent: 40,
      cta: "Continuar capítulo 2"
    },
    {
      title: "Sinal Fechado",
      badge: "Bloqueada",
      badgeTone: "warn",
      line: "Conclua Cuidado Invisível para abrir esta história.",
      position: 3,
      state: "locked",
      percent: 0,
      cta: null
    }
  ];
  var SCORE_MAX = 200;
  var SCORE_FLOOR = 100;
  var SCORE_ROWS = [
    { code: "C1", label: "Norma culta", score: 160, belowFloor: false },
    { code: "C2", label: "Repertório", score: 80, belowFloor: true },
    { code: "C3", label: "Coerência", score: 160, belowFloor: false },
    { code: "C4", label: "Coesão", score: 140, belowFloor: false },
    { code: "C5", label: "Persuasão situada", score: 150, belowFloor: false, extra: "critério Argumenta" }
  ];
  var DRAFT = "Seu Tenório, o senhor tem razão sobre o ano passado, mais este ano o grêmio começa pelo que falhou: uma escala de limpeza assinada por turma e um termo de responsabilidade pelas cadeiras. Como lembra Paulo Freire, a escola também educa fora da sala.";
  var SLIP = "mais";
  var PRAISE = "Paulo Freire";
  var MARKS = [
    {
      number: 1,
      kind: "Ortografia.",
      message: "Troque “mais” por “mas”: aqui a conjunção é adversativa.",
      tone: "slip"
    },
    {
      number: 2,
      kind: "Repertório bem usado.",
      message: "Freire sustenta a sua tese e está explicado no próprio parágrafo.",
      tone: "praise"
    }
  ];
  var TO_PASS = [
    "Troque “mais” por “mas”: aqui a conjunção é adversativa.",
    "Explique o repertório: o que Freire diz e por que isso deve convencer o zelador."
  ];
  var TRENDS = [
    { code: "C1", label: "Norma culta", latest: 80, delta: 10, points: [55, 60, 70, 65, 80] },
    { code: "C2", label: "Repertório", latest: 40, delta: -10, points: [60, 55, 50, 45, 40] },
    { code: "C3", label: "Coerência", latest: 80, delta: 0, points: [75, 80, 78, 80, 80] },
    { code: "C4", label: "Coesão", latest: 70, delta: 20, points: [50, 55, 60, 65, 70] },
    { code: "C5", label: "Persuasão situada", latest: 75, delta: 5, points: [65, 70, 68, 72, 75] }
  ];
  var MILESTONES = [
    { label: "1 de 3 histórias concluídas", done: false },
    { label: "Tutorial concluído", done: true },
    { label: "Primeiro repertório elogiado", done: true },
    { label: "Uma semana sem faltar", done: false },
    { label: "Primeira redação-chefe", done: false }
  ];
  var WEEK = [
    { label: "Seg", done: true, today: false },
    { label: "Ter", done: true, today: false },
    { label: "Qua", done: true, today: false },
    { label: "Qui", done: false, today: false },
    { label: "Sex", done: true, today: false },
    { label: "Sáb", done: true, today: false },
    { label: "Dom", done: true, today: true }
  ];
  var CONSEQUENCE = {
    narration: "Segunda-feira, 7h05. O pátio está trancado com um cadeado novo e um aviso escrito à mão: “USO SUSPENSO ATÉ NOVA ORDEM”. O grêmio perdeu o espaço antes de ter o festival.",
    speech: "Promessa de estudante dura até a primeira prova. Sem garantia, sem pátio. Volte quando tiver algo escrito que eu possa cobrar.",
    speaker: "Seu Tenório",
    score: 72,
    evidence: "Você defendeu o festival, mas não respondeu ao que Seu Tenório mede: quem assina o compromisso, e o que acontece se o pátio amanhecer sujo de novo."
  };
  var ATTEMPTS = [
    {
      attempt: "Tentativa 2",
      verdict: "Desvios de escrita",
      score: "138/200",
      body: "Seu Tenório, o senhor tem razão sobre o ano passado, mais este ano o grêmio começa pelo que falhou: uma escala de limpeza assinada por turma."
    },
    {
      attempt: "Tentativa 1",
      verdict: "Falha de persuasão",
      score: "96/200",
      body: "O festival é importante para a escola e todos os alunos querem que aconteça de novo neste ano."
    }
  ];
  var LEGAL = {
    title: "Política de privacidade",
    summary: "Pedimos o mínimo para o treino funcionar: e-mail, apelido, os vestibulares que você quer prestar e os textos que você escreve. Nada é vendido e nada vai para anunciante.",
    updatedAt: "Atualizado em 22 de agosto de 2026",
    sections: [
      {
        heading: "Dados que coletamos",
        paragraph: "Só o que a prática de redação precisa:",
        items: [
          "seu e-mail, para você entrar na conta e nós conseguirmos falar com você",
          "seu apelido, que é o nome que aparece no app",
          "seus vestibulares alvo (por exemplo ENEM 2027), que definem em qual escala a correção é mostrada",
          "os textos que você envia para correção, e a correção que o motor devolveu"
        ]
      },
      {
        heading: "Para que usamos e com que base legal",
        paragraph: "Usamos os seus dados para executar o contrato do serviço: corrigir os seus textos, mostrar a sua evolução e manter a sua conta de pé."
      },
      {
        heading: "Telemetria de escrita",
        paragraph: "Registramos sinais de como o texto foi escrito, como colagens e ritmo de digitação, para distinguir treino de cópia. Nada disso aparece para você como acusação."
      }
    ]
  };

  // figma-plugin/src/ui.ts
  var CARD_PAD = 18;
  function cardInner(width, active = false) {
    return width - 2 * (CARD_PAD + (active ? 1.5 : 1));
  }
  function card(options = {}) {
    var _a, _b, _c;
    const border = options.active === true ? { color: "caneta", weight: 1.5 } : { color: "line", weight: 1 };
    return stack({
      name: (_a = options.name) != null ? _a : "card",
      gap: (_b = options.gap) != null ? _b : 12,
      padding: (_c = options.padding) != null ? _c : CARD_PAD,
      fill: "card",
      radius: SHAPE.card,
      border,
      width: options.width
    });
  }
  function kicker(label, tone = "caneta") {
    return text(label, {
      size: TYPE.meta,
      weight: 700,
      color: tone === "caneta" ? "caneta" : "streakInk",
      name: "kicker"
    });
  }
  var CHIP = {
    caneta: { background: "canetaSoft", ink: "caneta", weight: 600 },
    ok: { background: "aprovadoSoft", ink: "aprovadoInk", weight: 700 },
    warn: { background: "streakSoft", ink: "streakInk", weight: 700 },
    streak: { background: "streakSoft", ink: "streakInk", weight: 700 },
    neutral: { background: "track", ink: "ink2", weight: 600 }
  };
  function chip(label, tone = "caneta") {
    const style = CHIP[tone];
    const frame = stack({
      name: `chip/${label}`,
      direction: "HORIZONTAL",
      padding: [5, 11],
      fill: style.background,
      radius: SHAPE.chip,
      align: "CENTER"
    });
    frame.appendChild(text(label, { size: TYPE.meta, weight: style.weight, color: style.ink }));
    return frame;
  }
  function button(label, variant = "primary") {
    const quiet = variant === "quiet";
    const ghost = variant === "ghost";
    const height = quiet ? 32 : ghost ? 44 : 50;
    const frame = stack({
      name: `button/${label}`,
      direction: "HORIZONTAL",
      gap: 8,
      padding: quiet ? [6, 8] : [8, 20],
      fill: variant === "primary" ? "caneta" : variant === "danger" ? "corretor" : variant === "disabled" ? "disabled" : quiet ? null : "card",
      radius: quiet ? 0 : SHAPE.button,
      align: "CENTER",
      justify: "CENTER"
    });
    setSize(frame, { height });
    if (ghost) applyBorder(frame, { color: "lineStrong", weight: 1 });
    if (variant === "primary") frame.effects = pressShadow("canetaPress");
    if (variant === "danger") frame.effects = pressShadow("corretorInk");
    const ink = variant === "primary" || variant === "danger" || variant === "disabled" ? "card" : quiet ? "caneta" : "ink2";
    frame.appendChild(
      text(label, {
        size: quiet ? TYPE.meta : TYPE.body,
        weight: ghost || quiet ? 600 : 700,
        color: ink,
        tracking: quiet ? 0 : TRACKING.body
      })
    );
    return frame;
  }
  var BAR_FILL = {
    caneta: "caneta",
    alert: "corretor",
    streak: "streak",
    done: "aprovado"
  };
  function progressBar(options) {
    var _a;
    const height = 6;
    const frame = figma.createFrame();
    frame.name = "progress";
    frame.resize(options.width, height);
    frame.cornerRadius = SHAPE.chip;
    frame.fills = paint("track");
    frame.clipsContent = true;
    const width = Math.max(0, Math.min(100, options.percent)) / 100 * options.width;
    if (width > 0) {
      const bar = rect(width, height, BAR_FILL[(_a = options.tone) != null ? _a : "caneta"], SHAPE.chip);
      frame.appendChild(bar);
      bar.x = 0;
      bar.y = 0;
    }
    if (options.floor !== void 0) {
      const tick2 = rect(2, height, "ink");
      tick2.opacity = 0.35;
      frame.appendChild(tick2);
      tick2.x = options.floor / 100 * options.width;
      tick2.y = 0;
    }
    return frame;
  }
  function field(options) {
    const frame = stack({ name: `field/${options.label}`, gap: 6, width: options.width });
    frame.appendChild(text(options.label, { size: TYPE.meta, weight: 600, color: "ink2" }));
    const control = stack({
      direction: "HORIZONTAL",
      padding: [12, 14],
      fill: "card",
      radius: SHAPE.button,
      border: { color: "lineStrong", weight: 1 },
      align: "CENTER",
      justify: options.select === true ? "SPACE_BETWEEN" : "MIN",
      width: options.width
    });
    setSize(control, { width: options.width, height: 46 });
    control.appendChild(
      text(options.value, {
        size: TYPE.body,
        color: options.value === "" ? "muted" : "ink",
        tracking: TRACKING.body
      })
    );
    if (options.select === true) control.appendChild(chevron());
    frame.appendChild(fill(control));
    if (options.hint !== void 0) {
      frame.appendChild(
        fill(text(options.hint, { size: TYPE.meta, color: "muted", width: options.width }))
      );
    }
    return frame;
  }
  function chevron() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m6 9.5 6 5.5 6-5.5" stroke="${COLORS.ink2}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const node = figma.createNodeFromSvg(svg);
    node.name = "chevron";
    node.resize(16, 16);
    return node;
  }
  function textarea(body, width, height) {
    const frame = stack({
      name: "editor",
      padding: [16, 18],
      fill: "card",
      radius: SHAPE.card,
      border: { color: "caneta", weight: 1.5 },
      width
    });
    setSize(frame, { width, height });
    frame.appendChild(
      text(body, {
        size: TYPE.body,
        color: body === "" ? "muted" : "ink",
        lineHeight: 1.72,
        tracking: -0.8,
        width: room(frame)
      })
    );
    return frame;
  }
  var NOTICE = {
    error: { background: "corretorSoft", border: "corretor", ink: "corretorInk" },
    ok: { background: "aprovadoSoft", border: "aprovado", ink: "aprovadoInk" },
    warn: { background: "streakSoft", border: "streak", ink: "streakInk" }
  };
  function notice(body, tone, width) {
    const style = NOTICE[tone];
    const frame = stack({
      name: `notice/${tone}`,
      padding: [12, 15],
      fill: style.background,
      radius: SHAPE.button,
      border: { color: style.border, weight: 1 },
      width
    });
    frame.appendChild(
      text(body, { size: TYPE.body, color: style.ink, lineHeight: 1.55, width: room(frame) })
    );
    return frame;
  }
  function markBadge(number, tone) {
    const frame = stack({
      name: `mark/${number}`,
      direction: "HORIZONTAL",
      fill: tone === "slip" ? "corretor" : "caneta",
      radius: SHAPE.chip,
      align: "CENTER",
      justify: "CENTER",
      width: 15
    });
    setSize(frame, { width: 15, height: 15 });
    frame.appendChild(text(String(number), { size: 9.5, weight: 700, color: "card" }));
    return frame;
  }
  var CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m5.5 12.4 4.2 4.1L18.5 7.6" stroke="${COLORS.card}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  function tick(done) {
    const frame = stack({
      name: done ? "tick/done" : "tick/pending",
      direction: "HORIZONTAL",
      fill: done ? "aprovado" : null,
      radius: SHAPE.chip,
      align: "CENTER",
      justify: "CENTER",
      width: 20
    });
    setSize(frame, { width: 20, height: 20 });
    if (!done) applyBorder(frame, { color: "lineStrong", weight: 1.75, dashed: true });
    if (done) {
      const glyph = figma.createNodeFromSvg(CHECK_SVG);
      glyph.resize(13, 13);
      frame.appendChild(glyph);
    }
    return frame;
  }
  function arrowBullet() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 8" fill="none"><path d="M0 4h12M8.5 1 12 4l-3.5 3" stroke="${COLORS.caneta}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const node = figma.createNodeFromSvg(svg);
    node.name = "arrow";
    node.resize(13, 8);
    return node;
  }
  function checkGlyph(size = 20) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m5.5 12.4 4.2 4.1L18.5 7.6" stroke="${COLORS.caneta}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const node = figma.createNodeFromSvg(svg);
    node.name = "check";
    node.resize(size, size);
    return node;
  }

  // figma-plugin/src/screens/layout.ts
  function readingSize(device) {
    return device.id === "desktop" ? TYPE.title : TYPE.lead;
  }
  function screenTitle(label, device) {
    return text(label, {
      size: device.id === "desktop" ? TYPE.display : TYPE.title,
      weight: 800,
      tracking: TRACKING.title,
      lineHeight: 1.15
    });
  }
  function cellWidth(width, perRow, gap) {
    return Math.floor((width - gap * (perRow - 1)) / perRow);
  }
  function columns(grid) {
    const cell = cellWidth(grid.width, grid.perRow, grid.gap);
    const rows = [];
    for (let index = 0; index < grid.items.length; index += grid.perRow) {
      const row2 = stack({
        name: "row",
        direction: "HORIZONTAL",
        gap: grid.gap,
        align: "MIN",
        width: grid.width
      });
      for (const item of grid.items.slice(index, index + grid.perRow)) {
        row2.appendChild(fill(grid.build(item, cell)));
      }
      rows.push(evenHeights(row2, grid.width));
    }
    return rows;
  }
  function evenHeights(row2, width) {
    const tallest = Math.max(...row2.children.map((child) => child.height));
    setSize(row2, { width, height: tallest });
    return row2;
  }

  // figma-plugin/src/screens/profile.ts
  function nicknameCard(width) {
    const shell = card({ gap: 12, width, name: "card/apelido" });
    shell.appendChild(kicker("Como quer ser chamado"));
    const row2 = stack({ name: "row", direction: "HORIZONTAL", gap: 8, align: "MAX", width: cardInner(width) });
    const input = field({ label: "Apelido", value: "Kauã", width: cardInner(width) - 8 - 92 });
    row2.appendChild(grow(input));
    const save = button("Salvar", "ghost");
    save.layoutSizingHorizontal = "HUG";
    row2.appendChild(save);
    shell.appendChild(fill(row2));
    return shell;
  }
  function targetsCard(width) {
    const inner = cardInner(width);
    const shell = card({ gap: 12, width, name: "card/vestibulares" });
    shell.appendChild(kicker("A lente da sua correção"));
    shell.appendChild(text("Seus vestibulares", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }));
    const row2 = stack({ name: "row", direction: "HORIZONTAL", gap: 8, align: "MAX", width: inner });
    const half = Math.floor((inner - 16 - 108) / 2);
    row2.appendChild(grow(field({ label: "Vestibular", value: "ENEM", width: half, select: true })));
    row2.appendChild(grow(field({ label: "Ano", value: "2026", width: half, select: true })));
    const add = button("Adicionar", "ghost");
    add.layoutSizingHorizontal = "HUG";
    row2.appendChild(add);
    shell.appendChild(fill(row2));
    const list = stack({ name: "list", gap: 8, width: inner });
    list.appendChild(fill(targetItem("ENEM 2026", true, inner, false)));
    list.appendChild(fill(targetItem("FUVEST 2027", false, inner, true)));
    shell.appendChild(fill(list));
    return shell;
  }
  function targetItem(name, active, width, ruled) {
    const item = stack({
      name: `target/${name}`,
      direction: "HORIZONTAL",
      gap: 8,
      padding: ruled ? [8, 0, 0, 0] : 0,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width,
      border: ruled ? { color: "line", weight: 1, sides: ["top"] } : void 0
    });
    item.appendChild(text(name, { size: TYPE.body, weight: 600 }));
    const actions = stack({ name: "acoes", direction: "HORIZONTAL", gap: 8, align: "CENTER" });
    actions.appendChild(active ? chip("Lente ativa") : button("Usar esta lente", "quiet"));
    actions.appendChild(button("Remover", "quiet"));
    item.appendChild(actions);
    return item;
  }
  function dangerCard(width) {
    const shell = card({ gap: 12, width, name: "card/conta" });
    shell.appendChild(text("Sessão e conta", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }));
    shell.appendChild(fill(button("Sair da conta", "ghost")));
    const quiet = button("Excluir minha conta", "quiet");
    quiet.layoutSizingHorizontal = "HUG";
    shell.appendChild(quiet);
    return shell;
  }

  // figma-plugin/src/screens/app.ts
  function storyCard(options) {
    const { story, width, featured, device } = options;
    const shell = card({
      active: story.state === "in_progress",
      gap: 14,
      width,
      name: `story/${story.title}`
    });
    const lying = featured && device.id !== "phone";
    const inner = stack({
      name: "story",
      direction: lying ? "HORIZONTAL" : "VERTICAL",
      gap: 14,
      align: lying ? "CENTER" : "MIN",
      width: cardInner(width)
    });
    const top = stack({ name: "top", direction: "HORIZONTAL", gap: 14, align: "MIN" });
    top.appendChild(storyCover(story.position, story.state));
    const bodyWidth = room(inner) - (lying ? 220 : 0) - 66;
    const body = stack({ name: "body", gap: 8, width: bodyWidth });
    const titleRow = stack({
      name: "titleRow",
      direction: "HORIZONTAL",
      gap: 8,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width: bodyWidth
    });
    titleRow.appendChild(
      text(story.title, {
        size: featured && device.id === "desktop" ? TYPE.lead : TYPE.body,
        weight: 700,
        tracking: -1.8
      })
    );
    titleRow.appendChild(chip(story.badge, story.badgeTone));
    body.appendChild(fill(titleRow));
    body.appendChild(
      fill(
        text(story.line, {
          size: TYPE.meta,
          weight: 500,
          color: "muted",
          lineHeight: 1.45,
          width: bodyWidth
        })
      )
    );
    body.appendChild(progressBar({ percent: story.percent, width: bodyWidth, tone: story.state === "completed" ? "done" : "caneta" }));
    top.appendChild(grow(body));
    inner.appendChild(lying ? grow(top) : fill(top));
    if (story.cta !== null) {
      const cta = button(story.cta);
      if (lying) {
        cta.layoutSizingHorizontal = "HUG";
        inner.appendChild(cta);
      } else {
        inner.appendChild(fill(cta));
      }
    }
    shell.appendChild(fill(inner));
    return shell;
  }
  var SPARK = { width: 120, height: 26, inset: 2, max: 100 };
  function sparkline(points, down, width = SPARK.width) {
    const step = (width - SPARK.inset * 2) / (points.length - 1);
    const usable = SPARK.height - SPARK.inset * 2;
    const drawn = points.map((score, index) => {
      const y = SPARK.inset + usable * (1 - Math.min(Math.max(score, 0), SPARK.max) / SPARK.max);
      return `${SPARK.inset + step * index},${y}`;
    }).join(" ");
    const stroke = down ? COLORS.corretor : COLORS.caneta;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${SPARK.height}"><polyline points="${drawn}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const node = figma.createNodeFromSvg(svg);
    node.name = "sparkline";
    node.resize(width, SPARK.height);
    return node;
  }
  function milestoneRow(label, done, width) {
    const row2 = stack({ name: "milestone", direction: "HORIZONTAL", gap: 12, align: "CENTER", width });
    row2.appendChild(tick(done));
    row2.appendChild(
      fill(
        text(label, {
          size: TYPE.body,
          weight: done ? 600 : 500,
          color: done ? "ink" : "muted",
          width: width - 32
        })
      )
    );
    return row2;
  }
  function dayBox(day, width, height) {
    const cell = stack({ name: `day/${day.label}`, gap: 7, align: "CENTER", width });
    cell.appendChild(text(day.label, { size: TYPE.micro, weight: 600, color: "muted" }));
    const box = rect(width, height, day.today && day.done ? "caneta" : day.done ? "canetaSoft" : "track", SHAPE.tile);
    cell.appendChild(box);
    if (day.today) applyBorder(box, { color: "caneta", weight: 1.5 });
    return cell;
  }
  function trilha(device) {
    const screen = screenFrame(device, { name: "Trilha", shell: true, tab: "trilha", shape: "wide" });
    const width = screen.width;
    const bar = stack({
      name: "bar",
      direction: "HORIZONTAL",
      gap: 12,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width,
      wrap: true
    });
    bar.appendChild(
      text("Sua trilha", {
        size: device.id === "desktop" ? TYPE.display : TYPE.lead,
        weight: 800,
        tracking: device.id === "desktop" ? TRACKING.title : TRACKING.lead
      })
    );
    const chips = stack({ name: "chips", direction: "HORIZONTAL", gap: 6, align: "CENTER" });
    chips.appendChild(chip("3 dias", "streak"));
    chips.appendChild(chip("1/3 envios hoje"));
    bar.appendChild(chips);
    screen.content.appendChild(fill(bar));
    const perRow = device.id === "desktop" ? 3 : device.id === "tablet" ? 2 : 1;
    const gap = device.id === "phone" ? 12 : device.id === "tablet" ? 16 : 20;
    const featured = TRACK.find((story) => story.state === "in_progress");
    const rest = TRACK.filter((story) => story.state !== "in_progress");
    if (featured !== void 0) {
      screen.content.appendChild(
        fill(storyCard({ story: featured, width, featured: true, device }))
      );
    }
    const rows = columns({
      items: rest,
      perRow,
      width,
      gap,
      build: (story, cell) => storyCard({ story, width: cell, featured: false, device })
    });
    for (const row2 of rows) screen.content.appendChild(fill(row2));
    return settle(screen, device);
  }
  function streakCard(width, device) {
    const inner = cardInner(width);
    const shell = card({ gap: 16, width, name: "card/sequencia" });
    const head = stack({ name: "head", gap: 4, width: inner });
    head.appendChild(text("7 dias seguidos", { size: TYPE.title, weight: 800, tracking: TRACKING.title }));
    head.appendChild(text("Seu recorde é 9 dias", { size: TYPE.meta, weight: 500, color: "muted" }));
    shell.appendChild(fill(head));
    const week = stack({ name: "week", direction: "HORIZONTAL", gap: 7, width: inner });
    const boxWidth = Math.floor((inner - 7 * 6) / 7);
    const height = device.id === "desktop" ? 48 : 34;
    for (const day of WEEK) week.appendChild(dayBox(day, boxWidth, height));
    shell.appendChild(fill(week));
    shell.appendChild(
      fill(
        text("Escreveu hoje. Volte amanhã para não zerar a sequência.", {
          size: TYPE.meta,
          weight: 500,
          color: "muted",
          width: inner
        })
      )
    );
    return shell;
  }
  function trendsCard(width) {
    const inner = cardInner(width);
    const shell = card({ gap: 16, width, name: "card/competencias" });
    const head = stack({ name: "head", gap: 3, width: inner });
    head.appendChild(
      text("Como cada competência anda", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead })
    );
    head.appendChild(
      text("Últimos 5 dias com envio · escala 0 a 100", { size: TYPE.meta, weight: 500, color: "muted" })
    );
    shell.appendChild(fill(head));
    const list = stack({ name: "trends", gap: 14, width: inner });
    const codes = TRENDS.map((trend) => text(trend.code, { size: TYPE.meta, weight: 700, color: "muted" }));
    const names = TRENDS.map((trend) => text(trend.label, { size: TYPE.meta, weight: 600 }));
    const codeWidth = Math.max(...codes.map((code) => code.width));
    const nameWidth = Math.max(...names.map((name) => name.width));
    const chart = Math.max(56, Math.floor(inner - codeWidth - nameWidth - 28 - 36 - 40));
    for (const [index, trend] of TRENDS.entries()) {
      const row2 = stack({ name: `trend/${trend.code}`, direction: "HORIZONTAL", gap: 10, align: "CENTER", width: inner });
      const code = codes[index];
      code.resize(codeWidth, code.height);
      row2.appendChild(code);
      const name = names[index];
      name.resize(nameWidth, name.height);
      row2.appendChild(name);
      row2.appendChild(sparkline(trend.points, trend.delta < 0, chart));
      row2.appendChild(text(String(trend.latest), { size: TYPE.meta, weight: 700, align: "RIGHT", width: 28 }));
      const delta = trend.delta === 0 ? "" : trend.delta > 0 ? `+${trend.delta}` : `−${Math.abs(trend.delta)}`;
      row2.appendChild(
        text(delta, {
          size: TYPE.meta,
          weight: 600,
          color: trend.delta < 0 ? "corretorInk" : "aprovadoInk",
          align: "RIGHT",
          width: 36
        })
      );
      list.appendChild(fill(row2));
    }
    shell.appendChild(fill(list));
    return shell;
  }
  function milestonesCard(width) {
    const inner = cardInner(width);
    const shell = card({ gap: 16, width, name: "card/marcos" });
    shell.appendChild(text("Marcos", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }));
    const list = stack({ name: "milestones", gap: 14, width: inner });
    for (const milestone of MILESTONES) {
      list.appendChild(fill(milestoneRow(milestone.label, milestone.done, inner)));
    }
    shell.appendChild(fill(list));
    return shell;
  }
  function progresso(device) {
    const screen = screenFrame(device, {
      name: "Progresso",
      shell: true,
      tab: "progresso",
      shape: "wide"
    });
    const width = screen.width;
    const bar = stack({
      name: "bar",
      direction: "HORIZONTAL",
      gap: 12,
      align: "BASELINE",
      justify: "SPACE_BETWEEN",
      width
    });
    bar.appendChild(screenTitle("Progresso", device));
    bar.appendChild(text("Lente ENEM", { size: TYPE.meta, weight: 600, color: "muted" }));
    screen.content.appendChild(fill(bar));
    screen.content.appendChild(fill(streakCard(width, device)));
    if (device.id === "desktop") {
      const row2 = stack({ name: "row", direction: "HORIZONTAL", gap: 20, align: "MIN", width });
      row2.appendChild(trendsCard(width - LAYOUT.rail - 20));
      row2.appendChild(milestonesCard(LAYOUT.rail));
      screen.content.appendChild(fill(row2));
    } else {
      screen.content.appendChild(fill(trendsCard(width)));
      screen.content.appendChild(fill(milestonesCard(width)));
    }
    return settle(screen, device);
  }
  function conta(device) {
    const screen = screenFrame(device, { name: "Conta", shell: true, tab: "conta", shape: "document" });
    const width = screen.width;
    screen.content.appendChild(screenTitle("Sua conta", device));
    screen.content.appendChild(fill(nicknameCard(width)));
    screen.content.appendChild(fill(targetsCard(width)));
    screen.content.appendChild(fill(dangerCard(width)));
    return settle(screen, device);
  }
  function onboarding(device) {
    const screen = screenFrame(device, { name: "Onboarding", shell: false, shape: "document" });
    const width = screen.width;
    screen.content.appendChild(screenTitle("Quase lá", device));
    screen.content.appendChild(
      fill(
        text(
          "Duas coisas e a primeira história abre: como te chamar, e qual vestibular você vai prestar.",
          { size: TYPE.body, color: "ink2", lineHeight: 1.6, width }
        )
      )
    );
    screen.content.appendChild(fill(nicknameCard(width)));
    screen.content.appendChild(fill(targetsCard(width)));
    screen.content.appendChild(fill(button("Começar a treinar")));
    return settle(screen, device);
  }

  // figma-plugin/src/screens/auth.ts
  var GOOGLE_G = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>`;
  function googleButton() {
    const frame = button("Entrar com Google");
    const tile = stack({
      name: "googleTile",
      direction: "HORIZONTAL",
      fill: "card",
      radius: 5,
      align: "CENTER",
      justify: "CENTER",
      width: 22
    });
    setSize(tile, { width: 22, height: 22 });
    const glyph = figma.createNodeFromSvg(GOOGLE_G);
    glyph.resize(13, 13);
    tile.appendChild(glyph);
    frame.insertChild(0, tile);
    return frame;
  }
  function entrada(device) {
    const wide = device.id === "desktop";
    const frame = deviceFrame(device, {
      name: "Entrada",
      axis: wide ? "HORIZONTAL" : "VERTICAL",
      justify: wide ? "MIN" : "CENTER"
    });
    const brandWidth = wide ? Math.round(device.width * 0.52) : device.width;
    const brand = stack({
      name: "brand",
      gap: wide ? 22 : 18,
      padding: [32, 20, 16, 20],
      fill: wide ? "noite" : null,
      align: "CENTER",
      justify: "CENTER",
      width: brandWidth
    });
    brand.appendChild(penMark(200));
    brand.appendChild(brandWordmark(wide ? 56 : 44, wide));
    brand.appendChild(
      text("Vença a discussão dentro da história. Passe no vestibular fora dela.", {
        size: wide ? 22 : TYPE.lead,
        color: wide ? "luzMuted" : "ink2",
        lineHeight: 1.55,
        align: "CENTER",
        width: wide ? 380 : Math.min(300, device.width - 80)
      })
    );
    const listWidth = wide ? 400 - 96 : columnFor(device, "narrow").width;
    const actions = stack({
      name: "actions",
      gap: 10,
      padding: wide ? 48 : [0, 20, 24, 20],
      align: "CENTER",
      justify: "CENTER",
      width: wide ? device.width - brandWidth : device.width
    });
    const list = stack({ name: "list", gap: 10, width: listWidth });
    list.appendChild(fill(googleButton()));
    list.appendChild(fill(button("Criar conta com e-mail", "ghost")));
    list.appendChild(
      fill(
        text("Só pedimos e-mail, apelido e o ano do seu vestibular. Nada mais.", {
          size: TYPE.meta,
          color: "muted",
          lineHeight: 1.5,
          align: "CENTER",
          width: listWidth
        })
      )
    );
    const quiet = button("Já tenho conta", "quiet");
    quiet.layoutSizingHorizontal = "HUG";
    const quietRow = stack({ name: "quietRow", align: "CENTER", width: listWidth });
    quietRow.appendChild(quiet);
    list.appendChild(fill(quietRow));
    actions.appendChild(list);
    frame.appendChild(fill(brand));
    frame.appendChild(wide ? grow(fill(actions)) : fill(actions));
    return fitToDevice(frame, device);
  }
  function entrarEmail(device) {
    const screen = screenFrame(device, {
      name: "Entrar com e-mail",
      shell: false,
      shape: "narrow",
      centred: true
    });
    const width = screen.width;
    screen.content.appendChild(text("← Voltar", { size: TYPE.meta, weight: 600, color: "ink2" }));
    screen.content.appendChild(
      text("Entrar", { size: TYPE.title, weight: 800, tracking: TRACKING.title, lineHeight: 1.15 })
    );
    const form = stack({ name: "form", gap: 14, width });
    form.appendChild(fill(field({ label: "E-mail", value: "kaua@exemplo.com", width })));
    form.appendChild(fill(field({ label: "Senha", value: "••••••••", width })));
    form.appendChild(fill(button("Entrar")));
    screen.content.appendChild(fill(form));
    return settle(screen, device);
  }
  function consentRow(width) {
    const row2 = stack({ name: "consent", direction: "HORIZONTAL", gap: 10, align: "MIN", width });
    const box = stack({ name: "checkbox", radius: 4, fill: "card", width: 18 });
    setSize(box, { width: 18, height: 18 });
    applyBorder(box, { color: "lineStrong", weight: 1 });
    row2.appendChild(box);
    const body = "Li e aceito os termos de uso e a política de privacidade. Se você tem menos de 18 anos, mostre as duas páginas para quem responde por você.";
    const copy = text(body, { size: TYPE.meta, lineHeight: 1.5, width: width - 28 });
    for (const link of ["termos de uso", "política de privacidade"]) {
      const at = body.indexOf(link);
      copy.setRangeFills(at, at + link.length, paint("caneta"));
      copy.setRangeTextDecoration(at, at + link.length, "UNDERLINE");
    }
    row2.appendChild(fill(copy));
    return row2;
  }
  function criarConta(device) {
    const screen = screenFrame(device, {
      name: "Criar conta",
      shell: false,
      shape: "narrow",
      centred: true
    });
    const width = screen.width;
    screen.content.appendChild(text("← Voltar", { size: TYPE.meta, weight: 600, color: "ink2" }));
    screen.content.appendChild(
      text("Criar conta", { size: TYPE.title, weight: 800, tracking: TRACKING.title, lineHeight: 1.15 })
    );
    screen.content.appendChild(
      fill(
        text("Três campos e você já está dentro da primeira história.", {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.6,
          width
        })
      )
    );
    const form = stack({ name: "form", gap: 14, width });
    form.appendChild(
      fill(field({ label: "Apelido", value: "Kauã", hint: "É como o Argumenta vai te chamar.", width }))
    );
    form.appendChild(fill(field({ label: "E-mail", value: "kaua@exemplo.com", width })));
    form.appendChild(
      fill(field({ label: "Senha", value: "••••••••", hint: "Pelo menos 8 caracteres.", width }))
    );
    form.appendChild(fill(consentRow(width)));
    form.appendChild(fill(button("Criar conta")));
    screen.content.appendChild(fill(form));
    return settle(screen, device);
  }
  function googleCallback(device) {
    const screen = screenFrame(device, {
      name: "Entrando com Google",
      shell: false,
      shape: "narrow",
      centred: true
    });
    screen.content.appendChild(
      fill(
        text("Entrando com o Google…", {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.6,
          align: "CENTER",
          width: screen.width
        })
      )
    );
    return settle(screen, device);
  }
  function legal(device) {
    var _a;
    const screen = screenFrame(device, { name: "Privacidade", shell: false, shape: "document" });
    const width = screen.width;
    screen.content.appendChild(screenBar(width, "← Argumenta", []));
    screen.content.appendChild(
      fill(
        text(LEGAL.title, {
          size: device.id === "phone" ? TYPE.title : 36,
          weight: 800,
          tracking: TRACKING.title,
          lineHeight: 1.12,
          width
        })
      )
    );
    screen.content.appendChild(
      fill(text(LEGAL.summary, { size: TYPE.lead, color: "ink2", lineHeight: 1.6, width }))
    );
    screen.content.appendChild(
      text(LEGAL.updatedAt, { size: TYPE.meta, weight: 600, color: "muted" })
    );
    for (const section2 of LEGAL.sections) {
      const block = stack({ name: `secao/${section2.heading}`, gap: 10, padding: [16, 0, 0, 0], width });
      block.appendChild(
        text(section2.heading, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead })
      );
      block.appendChild(
        fill(text(section2.paragraph, { size: TYPE.body, lineHeight: 1.6, color: "ink2", width }))
      );
      for (const item of (_a = section2.items) != null ? _a : []) {
        const bullet = stack({ name: "item", direction: "HORIZONTAL", gap: 8, align: "MIN", width });
        bullet.appendChild(text("•", { size: TYPE.body, color: "muted" }));
        bullet.appendChild(
          fill(text(item, { size: TYPE.body, lineHeight: 1.6, color: "ink2", width: width - 20 }))
        );
        block.appendChild(fill(bullet));
      }
      screen.content.appendChild(fill(block));
    }
    return settle(screen, device);
  }
  function notFound(device) {
    const screen = screenFrame(device, {
      name: "404",
      shell: false,
      shape: "document",
      centred: true
    });
    const inner = Math.min(416, screen.width);
    const block = stack({ name: "block", gap: 16, align: "CENTER", width: inner });
    block.appendChild(
      fill(
        text("Essa página não existe. Talvez o link esteja velho, ou a tela ainda esteja por vir.", {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.6,
          align: "CENTER",
          width: inner
        })
      )
    );
    const cta = button("Voltar para a trilha", "ghost");
    cta.layoutSizingHorizontal = "HUG";
    block.appendChild(cta);
    screen.content.appendChild(block);
    return settle(screen, device);
  }

  // figma-plugin/src/landingContent.ts
  var HERO_TAGLINE = "Vença a discussão dentro da história. Passe no vestibular fora dela.";
  var HERO_LEAD = "Você vive um personagem, encontra um conflito e precisa convencer alguém escrevendo. Um corretor avalia o seu texto na hora, com os critérios do ENEM e da FUVEST, e a história muda conforme o argumento que você fez.";
  var HERO_SCENE = {
    narration: "Sexta-feira, 7h20. O aviso no mural ainda tem cheiro de impressora: “FESTIVAL CULTURAL, CANCELADO”. Você é presidente do grêmio há exatamente onze dias.",
    speech: "Se veio falar do festival, economize saliva. Ano passado foi reclamação de barulho, pátio imundo e três pais na minha sala. Por que este ano seria diferente?",
    speaker: "Dona Marta",
    objective: "Escreva para Dona Marta: por que o festival merece uma segunda chance, e como o grêmio vai evitar os problemas do ano passado."
  };
  var FACTS = [
    { number: "2", label: "vestibulares", note: "ENEM e FUVEST. Você escolhe a lente em que a nota aparece." },
    {
      number: "5",
      label: "dimensões avaliadas",
      note: "Norma culta, coesão, coerência, repertório e persuasão."
    },
    {
      number: "3",
      label: "correções grátis por dia",
      note: "Qualquer envio mantém a sua sequência, aprovado ou não."
    },
    {
      number: "15 a 25 min",
      label: "por capítulo",
      note: "Histórias curtas, de 3 a 5 capítulos, com uma redação completa no fim."
    }
  ];
  var CHAPTER_ROWS = [
    [
      {
        story: "O Grêmio",
        tag: "Tutorial",
        boss: false,
        title: "A porta da diretoria",
        objective: "Convença Dona Marta a reabrir a discussão do festival cancelado."
      },
      {
        story: "Cuidado Invisível",
        tag: "ENEM 2023",
        boss: false,
        title: "O almoço de domingo",
        objective: "Convença a tia Bete a assumir um dia fixo de cuidado com a vó."
      },
      {
        story: "Sinal Fechado",
        tag: "FUVEST 2021",
        boss: false,
        title: "A pressa no trânsito",
        objective: "Convença Luciana de que a hipervelocidade e a produtividade a qualquer custo geram desordem."
      },
      {
        story: "O Grêmio",
        tag: "Tutorial",
        boss: false,
        title: "O pátio do Tenório",
        objective: "Convença Seu Tenório a liberar o pátio, assumindo compromissos com o espaço."
      }
    ],
    [
      {
        story: "Sinal Fechado",
        tag: "FUVEST 2021",
        boss: false,
        title: "A ordem do guarda",
        objective: "Mostre ao sargento que crises complexas não se resolvem com repressão."
      },
      {
        story: "O Grêmio",
        tag: "Redação-chefe",
        boss: true,
        title: "A assembleia",
        objective: "Defenda o festival para os pais, respondendo às objeções sobre provas, custo e segurança."
      },
      {
        story: "Cuidado Invisível",
        tag: "Redação-chefe",
        boss: true,
        title: "A sala do CRAS",
        objective: "Redação completa sobre a invisibilidade do trabalho de cuidado, com proposta de intervenção."
      },
      {
        story: "Sinal Fechado",
        tag: "Redação-chefe",
        boss: true,
        title: "A banca da FUVEST",
        objective: "Redação completa: o mundo contemporâneo está fora de ordem?"
      }
    ]
  ];
  var STEPS = [
    {
      number: "01",
      title: "Entre na cena",
      text: "Cada capítulo abre com uma situação e um personagem que discorda de você. Ele tem motivos, memória do que deu errado e uma pergunta que você precisa responder por escrito."
    },
    {
      number: "02",
      title: "Escreva o argumento",
      text: "De 120 a 250 palavras, dirigidas a essa pessoa: tese, justificativa e repertório explicado. O rascunho salva sozinho, e o contador mostra quanto falta."
    },
    {
      number: "03",
      title: "Receba a correção na hora",
      text: "O placar sai na lente do seu vestibular, com o piso de cada critério à vista. O seu texto volta anotado no lugar do erro, e você vê o que precisa mudar para passar."
    },
    {
      number: "04",
      title: "A história responde",
      text: "Convenceu? O personagem cede e o próximo capítulo abre. Não convenceu? A história segue pelo caminho ruim e você ganha uma cena de recuperação, com nova chance. Erro de português não gera consequência: o texto volta anotado para você revisar."
    }
  ];
  var STEP_SCENE = {
    narration: "Dona Marta cedeu, com uma condição: “Se o Tenório topar cuidar da estrutura, eu autorizo.” O zelador está consertando um portão e nem levanta os olhos quando você chega.",
    speech: "Festival? Tô fora. Ano passado sumiu cadeira, pichação no banheiro e adivinha quem varreu tudo sozinho no sábado? Escreve aí no seu papelzinho: o pátio é meu.",
    speaker: "Seu Tenório",
    objective: "Escreva para Seu Tenório: por que ele pode confiar o pátio ao grêmio este ano, com compromissos concretos de cuidado e limpeza."
  };
  var VERDICT_OK = {
    title: "Você convenceu.",
    line: "Seu Tenório libera o pátio. Capítulo 3 desbloqueado: A assembleia, a redação-chefe da história."
  };
  var VERDICT_WARN = {
    title: "Ele ainda não se move.",
    line: "“Promessa de estudante dura até a primeira prova. Sem garantia, sem pátio.” A história segue pelo caminho ruim, e uma cena de recuperação te dá nova chance."
  };
  var DIMENSIONS = [
    {
      number: "01",
      title: "Norma culta",
      text: "Ortografia, acentuação, pontuação e morfossintaxe. Um corretor ortográfico determinístico ancora os erros objetivos.",
      argumentaOnly: false
    },
    {
      number: "02",
      title: "Coesão",
      text: "Conectivos, referenciação e paragrafação: se o texto se segura de uma frase para a outra.",
      argumentaOnly: false
    },
    {
      number: "03",
      title: "Coerência",
      text: "Lógica do argumento, ausência de contradição e progressão do tema.",
      argumentaOnly: false
    },
    {
      number: "04",
      title: "Repertório sociocultural",
      text: "Presença, explicação e ligação com a tese. Fato inventado derruba a nota; caso duvidoso vira um alerta para verificar.",
      argumentaOnly: false
    },
    {
      number: "05",
      title: "Persuasão situada",
      text: "Adequação ao interlocutor, viabilidade no contexto da história e verossimilhança.",
      argumentaOnly: true
    }
  ];
  var PLANS = [
    {
      name: "Grátis",
      price: "R$ 0",
      priceNote: "para sempre",
      description: "Para conhecer o jogo e criar o hábito de escrever todo dia.",
      features: [
        "3 correções por dia",
        "As três histórias, incluindo as redações-chefe",
        "Placar, texto anotado e “Para passar”",
        "Sequência diária"
      ],
      startable: true
    },
    {
      name: "Vestibulando",
      price: null,
      priceNote: "por mês",
      description: "Para quem treina de verdade e quer ver a nota subir dimensão por dimensão.",
      features: [
        "10 correções por dia",
        "Tudo do Grátis",
        "Gráfico de evolução por dimensão",
        "Histórico de todas as tentativas",
        "Marcos por história concluída"
      ],
      startable: false
    },
    {
      name: "PRO",
      price: null,
      priceNote: "por mês",
      description: "Para a reta final: sem limite, nas duas lentes, com tudo o que sair primeiro.",
      features: [
        "Correções sem limite diário",
        "Tudo do Vestibulando",
        "Nota nas duas lentes, ENEM e FUVEST",
        "Novas histórias assim que saem"
      ],
      startable: false
    }
  ];
  var FAQ = [
    {
      number: "01",
      question: "A nota é a mesma que eu tiraria na prova?",
      answer: "Não. É uma estimativa do Argumenta na escala do seu vestibular, calibrada com redações reais já avaliadas. Serve para treinar e comparar as suas tentativas, não para prever a banca."
    },
    {
      number: "02",
      question: "Quanto custa?",
      answer: "Nada durante o beta. O plano Grátis dá 3 correções por dia, e qualquer envio mantém a sua sequência, aprovado ou não. Os planos Vestibulando e PRO vão ampliar o limite diário e abrir a evolução por dimensão."
    },
    {
      number: "03",
      question: "E se eu não convencer o personagem?",
      answer: "A história segue pelo ramo ruim e você recebe uma cena de recuperação, com nova chance. Se o problema for de português, não há consequência: o texto volta anotado para você revisar e reenviar."
    }
  ];
  var CLOSING_FACTS = [
    { number: "R$ 0", label: "no beta", note: "Sem cartão e sem assinatura." },
    { number: "3", label: "correções por dia", note: "O limite que faz do treino um hábito." },
    { number: "13", label: "capítulos para vencer", note: "Em três histórias, com três redações completas." },
    { number: "15 a 25 min", label: "por capítulo", note: "Cabe entre uma aula e outra." }
  ];
  var NAV_LINKS = ["Como funciona", "Histórias", "Planos", "Perguntas"];

  // figma-plugin/src/screens/correction.ts
  function annotatedDraft(width, size, lineHeight) {
    const body = text(DRAFT, { size, lineHeight, tracking: -0.8, width });
    const slip = DRAFT.indexOf(SLIP);
    body.setRangeFills(slip, slip + SLIP.length, paint("corretor"));
    body.setRangeTextDecoration(slip, slip + SLIP.length, "UNDERLINE");
    const praise = DRAFT.indexOf(PRAISE);
    body.setRangeFills(praise, praise + PRAISE.length, paint("caneta"));
    body.setRangeFontName(praise, praise + PRAISE.length, fontOf(600));
    return body;
  }
  function scoreRow(row2, width, style) {
    const line = stack({ name: `criterio/${row2.code}`, gap: 7, width });
    const score = text(style.showMax ? `${row2.score}/${SCORE_MAX}` : String(row2.score), {
      size: TYPE.meta,
      weight: 700,
      color: row2.belowFloor ? "corretorInk" : "ink"
    });
    const head = stack({
      name: "head",
      direction: "HORIZONTAL",
      gap: 8,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width
    });
    const named = stack({
      name: "nome",
      direction: "HORIZONTAL",
      gap: 8,
      align: "CENTER",
      wrap: true,
      width: width - score.width - 8
    });
    named.appendChild(text(row2.code, { size: TYPE.meta, weight: 700, color: "muted" }));
    named.appendChild(
      text(row2.label, { size: TYPE.meta, weight: 600, color: row2.belowFloor ? "corretorInk" : "ink" })
    );
    const aside = style.aside === "criterion" ? row2.extra : row2.belowFloor ? "abaixo do piso" : void 0;
    if (aside !== void 0) {
      named.appendChild(text(aside, { size: TYPE.meta, weight: 500, color: "muted" }));
    }
    head.appendChild(named);
    head.appendChild(score);
    line.appendChild(fill(head));
    line.appendChild(
      progressBar({
        percent: row2.score / SCORE_MAX * 100,
        floor: SCORE_FLOOR / SCORE_MAX * 100,
        width,
        tone: row2.belowFloor ? "alert" : "caneta"
      })
    );
    return line;
  }
  function scoreTotal(rows, width, disclaimer) {
    const total = stack({
      name: "total",
      direction: "HORIZONTAL",
      gap: 10,
      padding: [14, 0, 0, 0],
      align: "BASELINE",
      justify: "SPACE_BETWEEN",
      width,
      border: { color: "track", weight: 1, sides: ["top"] }
    });
    const sum = rows.reduce((carried, row2) => carried + row2.score, 0);
    const figure = text(`${sum}/${SCORE_MAX * rows.length}`, {
      size: TYPE.lead,
      weight: 800,
      tracking: TRACKING.lead
    });
    const rest = width - figure.width - 10;
    const label = stack({ name: "label", gap: 2, width: rest });
    label.appendChild(fill(text("Soma dos critérios", { size: TYPE.meta, weight: 700, width: rest })));
    label.appendChild(
      fill(text(disclaimer, { size: TYPE.micro, weight: 500, color: "muted", width: rest }))
    );
    total.appendChild(label);
    total.appendChild(figure);
    return total;
  }
  function editorFoot(width) {
    const foot = stack({
      name: "foot",
      direction: "HORIZONTAL",
      justify: "SPACE_BETWEEN",
      gap: 8,
      width
    });
    foot.appendChild(text("47 / 250 palavras", { size: TYPE.meta, weight: 600, color: "muted" }));
    foot.appendChild(text("Rascunho salvo", { size: TYPE.meta, weight: 600, color: "muted" }));
    return foot;
  }
  function technicalVerdict(width, titleSize) {
    const frame = stack({
      name: "headline",
      gap: 9,
      padding: 18,
      fill: "corretorSoft",
      radius: SHAPE.card,
      border: { color: "corretor", weight: 1.5 },
      width
    });
    frame.appendChild(
      text("Quase. A norma culta segurou você.", {
        size: titleSize,
        weight: 800,
        color: "corretorInk",
        tracking: TRACKING.title,
        lineHeight: 1.18,
        width: cardInner(width)
      })
    );
    frame.appendChild(
      fill(
        text(
          "O argumento convence Seu Tenório, mas 1 desvio de escrita derrubou a nota abaixo do piso. Corrija e reenvie: a história continua esperando.",
          { size: TYPE.body, lineHeight: 1.55, width: cardInner(width) }
        )
      )
    );
    return frame;
  }
  function legendCard(width) {
    const inner = cardInner(width);
    const shell = card({ gap: 16, width, name: "card/marcacoes" });
    shell.appendChild(text("As marcações", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }));
    const list = stack({ name: "legend", gap: 14, width: inner });
    for (const mark2 of MARKS) {
      const row2 = stack({
        name: `mark/${mark2.number}`,
        direction: "HORIZONTAL",
        gap: 11,
        align: "MIN",
        width: inner
      });
      row2.appendChild(markBadge(mark2.number, mark2.tone));
      const line = text(`${mark2.kind} ${mark2.message}`, {
        size: TYPE.meta,
        color: "ink2",
        lineHeight: 1.55,
        width: inner - 26
      });
      line.setRangeFills(0, mark2.kind.length, paint("ink"));
      row2.appendChild(fill(line));
      list.appendChild(fill(row2));
    }
    shell.appendChild(fill(list));
    return shell;
  }
  function paraPassarCard(width, steps) {
    const inner = cardInner(width);
    const shell = card({ gap: 16, width, name: "card/para-passar" });
    shell.appendChild(text("Para passar", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }));
    const list = stack({ name: "steps", gap: 14, width: inner });
    for (const step of steps) {
      const row2 = stack({ name: "step", direction: "HORIZONTAL", gap: 11, align: "MIN", width: inner });
      row2.appendChild(arrowBullet());
      row2.appendChild(fill(text(step, { size: TYPE.body, lineHeight: 1.55, width: inner - 24 })));
      list.appendChild(fill(row2));
    }
    shell.appendChild(fill(list));
    return shell;
  }

  // figma-plugin/src/screens/thumbnails.ts
  var REQUIREMENTS = ["Tese", "Justificativa", "Repertório explicado"];
  function scene(width) {
    const frame = stack({ name: "scene", gap: 10, width });
    frame.appendChild(
      fill(nightPanel(STEP_SCENE.narration, { width, size: TYPE.body, padding: 15 }))
    );
    frame.appendChild(
      fill(speechRow({ speech: STEP_SCENE.speech, who: STEP_SCENE.speaker, width, size: TYPE.body }))
    );
    return frame;
  }
  function editor(width) {
    const frame = stack({ name: "editor", gap: 10, width });
    const objective = card({ gap: 8, width, name: "objetivo" });
    objective.appendChild(kicker("Seu objetivo"));
    objective.appendChild(
      fill(
        text(STEP_SCENE.objective, {
          size: TYPE.body,
          weight: 500,
          lineHeight: 1.5,
          width: cardInner(width)
        })
      )
    );
    frame.appendChild(fill(objective));
    const chips = stack({ name: "requisitos", direction: "HORIZONTAL", gap: 6, wrap: true, width });
    for (const requirement of REQUIREMENTS) chips.appendChild(chip(requirement, "neutral"));
    frame.appendChild(fill(chips));
    const sheet = stack({
      name: "sheet",
      padding: [14, 16],
      fill: "card",
      radius: SHAPE.card,
      border: { color: "caneta", weight: 1.5 },
      width
    });
    sheet.appendChild(
      fill(text(DRAFT, { size: TYPE.body, lineHeight: 1.72, tracking: -0.8, width: width - 32 }))
    );
    frame.appendChild(fill(sheet));
    frame.appendChild(fill(editorFoot(width)));
    return frame;
  }
  var SHOWN = SCORE_ROWS.slice(0, 4);
  function board(width) {
    const inner = cardInner(width);
    const shell = card({ gap: 14, width, name: "placar" });
    const bar = stack({
      name: "bar",
      direction: "HORIZONTAL",
      gap: 8,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width: inner
    });
    const attempt = text("2ª tentativa", { size: TYPE.meta, weight: 600, color: "muted" });
    bar.appendChild(
      text("Capítulo 2 · O pátio do Tenório", {
        size: TYPE.body,
        weight: 700,
        tracking: TRACKING.lead,
        width: inner - attempt.width - 8
      })
    );
    bar.appendChild(attempt);
    shell.appendChild(fill(bar));
    const rows = stack({ name: "rows", gap: 12, width: inner });
    for (const row2 of SHOWN) {
      rows.appendChild(fill(scoreRow(row2, inner, { showMax: false, aside: "floor" })));
    }
    shell.appendChild(fill(rows));
    shell.appendChild(
      fill(scoreTotal(SHOWN, inner, "Estimativa do Argumenta, não nota de banca"))
    );
    return shell;
  }
  function correction(width) {
    const frame = stack({ name: "correcao", gap: 10, width });
    frame.appendChild(fill(board(width)));
    const marked = card({ gap: 8, width, name: "texto" });
    marked.appendChild(fill(annotatedDraft(cardInner(width), TYPE.body, 1.85)));
    frame.appendChild(fill(marked));
    const pass = card({ gap: 10, width, name: "para-passar" });
    pass.appendChild(kicker("Para passar"));
    for (const step of TO_PASS) {
      pass.appendChild(fill(text(`→ ${step}`, { size: TYPE.body, lineHeight: 1.5, width: cardInner(width) })));
    }
    frame.appendChild(fill(pass));
    return frame;
  }
  function verdictBlock(verdict, tone, width) {
    const frame = stack({
      name: `verdict/${tone}`,
      gap: 9,
      padding: 18,
      fill: tone === "ok" ? "aprovadoSoft" : "streakSoft",
      radius: SHAPE.card,
      border: { color: tone === "ok" ? "aprovado" : "streak", weight: 1.5 },
      width
    });
    frame.appendChild(
      text(verdict.title, {
        size: TYPE.lead,
        weight: 800,
        color: tone === "ok" ? "aprovadoInk" : "streakInk",
        tracking: TRACKING.lead,
        lineHeight: 1.2
      })
    );
    frame.appendChild(
      fill(text(verdict.line, { size: TYPE.meta, color: "ink2", lineHeight: 1.5, width: cardInner(width) }))
    );
    return frame;
  }
  function verdicts(width) {
    const frame = stack({ name: "verdicts", gap: 10, width });
    frame.appendChild(fill(verdictBlock(VERDICT_OK, "ok", width)));
    frame.appendChild(fill(verdictBlock(VERDICT_WARN, "warn", width)));
    return frame;
  }
  var THUMBNAILS = [scene, editor, correction, verdicts];

  // figma-plugin/src/screens/landing.ts
  function sizesOf(device) {
    return LANDING_SCALE[device.id];
  }
  function navBar(width, device) {
    const bar = stack({
      name: "nav",
      direction: "HORIZONTAL",
      gap: 16,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width
    });
    setSize(bar, { width, height: 72 });
    bar.appendChild(brandWordmark(22));
    if (device.id === "desktop") {
      const links = stack({ name: "links", direction: "HORIZONTAL", gap: 28, align: "CENTER" });
      for (const link of NAV_LINKS) {
        links.appendChild(text(link, { size: TYPE.body, weight: 600, color: "ink2" }));
      }
      bar.appendChild(links);
    }
    const actions = stack({ name: "actions", direction: "HORIZONTAL", gap: 8, align: "CENTER" });
    if (device.id !== "phone") {
      const quiet = button("Já tenho conta", "quiet");
      quiet.layoutSizingHorizontal = "HUG";
      actions.appendChild(quiet);
    }
    const cta = button("Começar grátis");
    cta.layoutSizingHorizontal = "HUG";
    cta.resize(cta.width, 44);
    actions.appendChild(cta);
    bar.appendChild(actions);
    return bar;
  }
  function ghostLink(label) {
    const frame = stack({
      name: `link/${label}`,
      direction: "HORIZONTAL",
      padding: [8, 20],
      fill: "card",
      radius: SHAPE.button,
      border: { color: "lineStrong", weight: 1 },
      align: "CENTER",
      justify: "CENTER"
    });
    setSize(frame, { height: 44 });
    frame.appendChild(
      text(label, { size: TYPE.body, weight: 600, color: "ink2", tracking: TRACKING.body })
    );
    return frame;
  }
  function heroShot(width) {
    const shot = stack({
      name: "shot",
      padding: 10,
      fill: "card",
      radius: SHAPE.card,
      border: { color: "line", weight: 1 },
      width
    });
    const screen = stack({
      name: "screen",
      gap: 14,
      padding: 18,
      fill: "paper",
      radius: SHAPE.tile,
      width: room(shot)
    });
    const column = room(screen);
    const bar = stack({
      name: "screenBar",
      direction: "HORIZONTAL",
      gap: 8,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width: column
    });
    bar.appendChild(text("Trilha", { size: TYPE.meta, weight: 600, color: "ink2" }));
    const chips = stack({ name: "chips", direction: "HORIZONTAL", gap: 6, align: "CENTER" });
    chips.appendChild(chip("3 dias", "streak"));
    chips.appendChild(chip("1/3 envios hoje"));
    bar.appendChild(chips);
    screen.appendChild(fill(bar));
    screen.appendChild(fill(nightPanel(HERO_SCENE.narration, { width: column, size: TYPE.lead })));
    screen.appendChild(
      fill(speechRow({ speech: HERO_SCENE.speech, who: HERO_SCENE.speaker, width: column, size: TYPE.lead }))
    );
    const objective = card({ active: true, gap: 8, width: column, name: "objetivo" });
    objective.appendChild(kicker("Seu objetivo"));
    objective.appendChild(
      fill(
        text(HERO_SCENE.objective, {
          size: TYPE.body,
          weight: 600,
          lineHeight: 1.5,
          width: cardInner(column, true)
        })
      )
    );
    screen.appendChild(fill(objective));
    const fake = stack({
      name: "fakeButton",
      direction: "HORIZONTAL",
      fill: "caneta",
      radius: SHAPE.button,
      align: "CENTER",
      justify: "CENTER",
      width: column
    });
    setSize(fake, { width: column, height: 50 });
    fake.effects = pressShadow("canetaPress");
    fake.appendChild(text("Argumentar", { size: TYPE.body, weight: 700, color: "card" }));
    screen.appendChild(fill(fake));
    shot.appendChild(fill(screen));
    return shot;
  }
  function hero(width, device) {
    const sizes = sizesOf(device);
    const wide = device.id === "desktop";
    const copyWidth = wide ? Math.round((width - 72) * (7 / 13)) : width;
    const shotWidth = wide ? width - 72 - copyWidth : width;
    const copy = stack({ name: "heroCopy", gap: 22, width: copyWidth });
    copy.appendChild(chip("Beta gratuito · 3 correções por dia"));
    copy.appendChild(
      fill(
        text(HERO_TAGLINE, {
          size: sizes.hero,
          weight: 800,
          lineHeight: 1.04,
          tracking: -3.5,
          width: copyWidth
        })
      )
    );
    copy.appendChild(
      text(HERO_LEAD, {
        size: TYPE.lead,
        color: "ink2",
        lineHeight: 1.55,
        tracking: TRACKING.lead,
        width: Math.min(544, copyWidth)
      })
    );
    const ctaRow = stack({ name: "ctaRow", direction: "HORIZONTAL", gap: 12, align: "CENTER", wrap: true, width: copyWidth });
    const cta = button("Começar grátis");
    cta.layoutSizingHorizontal = "HUG";
    ctaRow.appendChild(cta);
    ctaRow.appendChild(ghostLink("Ver como funciona"));
    copy.appendChild(fill(ctaRow));
    copy.appendChild(
      fill(
        text("Sem cartão. Só pedimos e-mail, apelido e o ano do seu vestibular.", {
          size: TYPE.meta,
          color: "muted",
          lineHeight: 1.5,
          width: copyWidth
        })
      )
    );
    const frame = stack({
      name: "hero",
      direction: wide ? "HORIZONTAL" : "VERTICAL",
      gap: wide ? 72 : 40,
      padding: wide ? [72, 0, 96, 0] : [32, 0, 56, 0],
      align: wide ? "CENTER" : "MIN",
      width
    });
    frame.appendChild(copy);
    frame.appendChild(heroShot(shotWidth));
    return frame;
  }
  function factBlock(fact, width, size) {
    const block = stack({ name: `fact/${fact.label}`, gap: 8, width });
    block.appendChild(
      text(fact.number, { size, weight: 800, tracking: TRACKING.title, lineHeight: 1.05, width })
    );
    block.appendChild(fill(text(fact.label, { size: TYPE.body, weight: 700, width })));
    block.appendChild(
      fill(text(fact.note, { size: TYPE.meta, color: "muted", lineHeight: 1.45, width }))
    );
    return block;
  }
  function factsStrip(width, device) {
    const desktop = device.id === "desktop";
    const strip = stack({
      name: "facts",
      gap: 28,
      padding: desktop ? [44, 0] : [32, 0],
      width,
      border: { color: "line", weight: 1, sides: ["top", "bottom"] }
    });
    const perRow = desktop ? 4 : 2;
    const gap = desktop ? 40 : 20;
    const rows = columns({
      items: FACTS,
      perRow,
      width,
      gap,
      build: (fact, cell) => factBlock(fact, cell, sizesOf(device).stat)
    });
    for (const row2 of rows) strip.appendChild(fill(row2));
    return strip;
  }
  function sectionHead(title, sub, width, device) {
    const head = stack({
      name: "sectionHead",
      gap: 14,
      padding: [0, 0, device.id === "desktop" ? 56 : 40, 0],
      width
    });
    const inner = Math.min(736, width);
    head.appendChild(
      text(title, {
        size: sizesOf(device).headline,
        weight: 800,
        lineHeight: 1.08,
        tracking: TRACKING.title,
        width: inner
      })
    );
    if (sub !== null) {
      head.appendChild(
        text(sub, {
          size: TYPE.lead,
          color: "ink2",
          lineHeight: 1.55,
          tracking: TRACKING.lead,
          width: inner
        })
      );
    }
    return head;
  }
  function section(width, device, tight = false) {
    const pad = device.id === "desktop" ? 112 : 72;
    return stack({
      name: "section",
      gap: 0,
      padding: [tight ? 0 : pad, 0, pad, 0],
      width
    });
  }
  function chapterCard(entry, width) {
    const shell = card({ gap: 10, width, name: `capitulo/${entry.title}` });
    const tag = stack({ name: "tag", direction: "HORIZONTAL", gap: 8, align: "CENTER", wrap: true });
    tag.appendChild(text(entry.story, { size: TYPE.meta, weight: 700, color: "muted" }));
    tag.appendChild(chip(entry.tag, entry.boss ? "caneta" : "neutral"));
    shell.appendChild(tag);
    shell.appendChild(
      text(entry.title, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead, lineHeight: 1.3 })
    );
    shell.appendChild(
      fill(
        text(entry.objective, {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.5,
          width: cardInner(width)
        })
      )
    );
    return shell;
  }
  function marquee(device) {
    const cardWidth = device.id === "phone" ? 300 : 340;
    const frame = stack({ name: "marquee", gap: 16, width: device.width });
    frame.clipsContent = true;
    for (const [index, row2] of CHAPTER_ROWS.entries()) {
      const line = stack({
        name: `row/${index + 1}`,
        direction: "HORIZONTAL",
        gap: 16,
        align: "MIN"
      });
      for (const entry of row2) line.appendChild(fill(chapterCard(entry, cardWidth)));
      const span = row2.length * cardWidth + (row2.length - 1) * 16;
      frame.appendChild(evenHeights(line, span));
    }
    return frame;
  }
  function howItWorks(width, device) {
    const desktop = device.id === "desktop";
    const steps = stack({ name: "steps", gap: desktop ? 24 : 20, width });
    for (const [index, step] of STEPS.entries()) {
      const pad = desktop ? 40 : 24;
      const shell = stack({
        name: `step/${step.number}`,
        direction: desktop ? "HORIZONTAL" : "VERTICAL",
        gap: desktop ? 56 : 22,
        padding: pad,
        fill: "card",
        radius: SHAPE.card,
        border: { color: "line", weight: 1 },
        align: desktop ? "CENTER" : "MIN",
        width
      });
      const inner = room(shell);
      const headWidth = desktop ? Math.round((inner - 56) * (5 / 12)) : inner;
      const miniWidth = desktop ? inner - 56 - headWidth : inner;
      const head = stack({ name: "head", gap: 10, width: headWidth });
      head.appendChild(text(step.number, { size: TYPE.meta, weight: 700, color: "caneta" }));
      head.appendChild(
        fill(
          text(step.title, {
            size: TYPE.title,
            weight: 800,
            tracking: TRACKING.title,
            lineHeight: 1.15,
            width: headWidth
          })
        )
      );
      head.appendChild(
        fill(
          text(step.text, {
            size: TYPE.body,
            color: "ink2",
            lineHeight: 1.58,
            width: headWidth
          })
        )
      );
      shell.appendChild(head);
      const mini = stack({
        name: "mini",
        gap: 10,
        padding: 14,
        fill: "paper",
        radius: SHAPE.tile,
        border: { color: "line", weight: 1 },
        width: miniWidth
      });
      mini.appendChild(fill(THUMBNAILS[index](room(mini))));
      shell.appendChild(mini);
      steps.appendChild(fill(shell));
    }
    return steps;
  }
  function thesis(width, device) {
    const desktop = device.id === "desktop";
    const sizes = sizesOf(device);
    const frame = stack({
      name: "thesis",
      gap: desktop ? 28 : 24,
      padding: desktop ? [88, 96] : [40, 24],
      fill: "noite",
      radius: SHAPE.card,
      width
    });
    const inner = room(frame);
    frame.appendChild(
      text("Treinar redação hoje é solitário e abstrato: um tema, uma folha em branco e uma nota dias depois.", {
        size: sizes.quote,
        weight: 800,
        color: "luz",
        lineHeight: 1.2,
        tracking: TRACKING.title,
        width: Math.min(inner, desktop ? 620 : inner)
      })
    );
    frame.appendChild(
      text("Com um interlocutor que responde, consequência imediata e correção na hora, treino vira hábito. É para isso que o Argumenta existe.", {
        size: TYPE.lead,
        color: "luzMuted",
        lineHeight: 1.55,
        tracking: TRACKING.lead,
        width: Math.min(inner, 608)
      })
    );
    const who = stack({ name: "who", direction: "HORIZONTAL", gap: 9, align: "CENTER" });
    who.appendChild(rect(18, 1, "luzMuted"));
    who.appendChild(text("A tese do Argumenta", { size: TYPE.meta, weight: 700, color: "luzMuted" }));
    frame.appendChild(who);
    return frame;
  }
  function dimensionCard(width, entry) {
    const shell = stack({
      name: `dimensao/${entry.number}`,
      gap: 10,
      padding: 20,
      fill: "card",
      radius: SHAPE.card,
      border: { color: "line", weight: 1 },
      width
    });
    const top = stack({
      name: "top",
      direction: "HORIZONTAL",
      gap: 8,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      wrap: true,
      width: width - 40
    });
    top.appendChild(text(entry.number, { size: TYPE.meta, weight: 700, color: "muted" }));
    if (entry.argumentaOnly) top.appendChild(chip("critério Argumenta"));
    shell.appendChild(fill(top));
    shell.appendChild(
      fill(
        text(entry.title, {
          size: TYPE.lead,
          weight: 700,
          tracking: TRACKING.lead,
          lineHeight: 1.25,
          width: width - 40
        })
      )
    );
    shell.appendChild(
      fill(
        text(entry.text, {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.5,
          width: width - 40
        })
      )
    );
    return shell;
  }
  function planCard(width, plan) {
    const shell = stack({
      name: `plano/${plan.name}`,
      gap: 22,
      padding: 28,
      fill: "card",
      radius: SHAPE.card,
      border: { color: plan.startable ? "caneta" : "line", weight: plan.startable ? 1.5 : 1 },
      width
    });
    const inner = room(shell);
    const head = stack({ name: "head", gap: 10, width: inner });
    const top = stack({
      name: "top",
      direction: "HORIZONTAL",
      gap: 8,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width: inner
    });
    top.appendChild(
      text(plan.name, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead, lineHeight: 1.2 })
    );
    top.appendChild(chip(plan.startable ? "Beta" : "Em breve", plan.startable ? "neutral" : "caneta"));
    head.appendChild(fill(top));
    const price = stack({
      name: "price",
      direction: "HORIZONTAL",
      gap: 8,
      align: "BASELINE",
      wrap: true,
      width: inner
    });
    if (plan.price === null) {
      price.appendChild(
        text("Preço a definir", {
          size: TYPE.lead,
          weight: 700,
          color: "ink2",
          tracking: TRACKING.lead
        })
      );
    } else {
      price.appendChild(
        text(plan.price, { size: 36, weight: 800, tracking: TRACKING.title, lineHeight: 1 })
      );
    }
    price.appendChild(text(plan.priceNote, { size: TYPE.meta, weight: 600, color: "muted" }));
    head.appendChild(price);
    head.appendChild(
      fill(
        text(plan.description, {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.5,
          width: inner
        })
      )
    );
    shell.appendChild(fill(head));
    const features = stack({ name: "features", gap: 10, width: inner });
    for (const feature of plan.features) {
      const row2 = stack({ name: "feature", direction: "HORIZONTAL", gap: 10, align: "MIN", width: inner });
      row2.appendChild(checkGlyph(20));
      row2.appendChild(
        fill(text(feature, { size: TYPE.body, lineHeight: 1.5, width: inner - 30 }))
      );
      features.appendChild(fill(row2));
    }
    shell.appendChild(fill(features));
    if (plan.startable) {
      shell.appendChild(fill(button("Começar grátis")));
    } else {
      const waiting = stack({ name: "waiting", align: "CENTER", justify: "CENTER", width: inner });
      setSize(waiting, { width: inner, height: 50 });
      waiting.appendChild(
        text("Disponível depois do beta.", { size: TYPE.meta, weight: 600, color: "muted" })
      );
      shell.appendChild(fill(waiting));
    }
    return shell;
  }
  function faqList(width, device) {
    const desktop = device.id === "desktop";
    const list = stack({
      name: "faq",
      width,
      border: { color: "line", weight: 1, sides: ["top"] }
    });
    for (const entry of FAQ) {
      const row2 = stack({
        name: `pergunta/${entry.number}`,
        direction: desktop ? "HORIZONTAL" : "VERTICAL",
        gap: desktop ? 32 : 10,
        padding: desktop ? [40, 0] : [28, 0],
        align: "MIN",
        width,
        border: { color: "line", weight: 1, sides: ["bottom"] }
      });
      row2.appendChild(
        text(entry.number, {
          size: TYPE.meta,
          weight: 700,
          color: "caneta",
          width: desktop ? 96 : void 0
        })
      );
      const rest = desktop ? width - 96 - 64 : width;
      const questionWidth = desktop ? Math.round(rest * (5 / 12)) : rest;
      const answerWidth = desktop ? rest - questionWidth : rest;
      row2.appendChild(
        text(entry.question, {
          size: TYPE.title,
          weight: 800,
          tracking: TRACKING.title,
          lineHeight: 1.2,
          width: questionWidth
        })
      );
      row2.appendChild(
        text(entry.answer, {
          size: desktop ? TYPE.lead : TYPE.body,
          color: "ink2",
          lineHeight: desktop ? 1.55 : 1.6,
          tracking: desktop ? TRACKING.lead : void 0,
          width: answerWidth
        })
      );
      list.appendChild(fill(row2));
    }
    return list;
  }
  function closing(width, device) {
    const desktop = device.id === "desktop";
    const frame = stack({
      name: "closing",
      gap: 20,
      padding: desktop ? [120, 0, 80, 0] : [80, 0, 64, 0],
      align: "CENTER",
      width
    });
    frame.appendChild(penMark(160));
    frame.appendChild(
      text("Pare de treinar no vazio. Comece a convencer alguém.", {
        size: sizesOf(device).hero,
        weight: 800,
        align: "CENTER",
        lineHeight: 1.08,
        tracking: TRACKING.title,
        width: Math.min(width, desktop ? 800 : width)
      })
    );
    frame.appendChild(
      text("Pronto quando você estiver.", {
        size: TYPE.lead,
        color: "ink2",
        align: "CENTER",
        lineHeight: 1.55
      })
    );
    const cta = button("Começar grátis");
    cta.layoutSizingHorizontal = "HUG";
    frame.appendChild(cta);
    frame.appendChild(
      text("Entre com Google ou crie uma conta com e-mail.", {
        size: TYPE.meta,
        color: "muted",
        align: "CENTER"
      })
    );
    const factsWidth = Math.min(width, 960);
    const strip = stack({
      name: "closingFacts",
      gap: 28,
      padding: [desktop ? 40 : 32, 0, 0, 0],
      width: factsWidth,
      border: { color: "line", weight: 1, sides: ["top"] }
    });
    const closingPerRow = desktop ? 4 : 2;
    const closingGap = desktop ? 40 : 20;
    const closingRows = columns({
      items: CLOSING_FACTS,
      perRow: closingPerRow,
      width: factsWidth,
      gap: closingGap,
      build: (fact, cell) => factBlock(fact, cell, 36)
    });
    for (const row2 of closingRows) strip.appendChild(fill(row2));
    frame.appendChild(strip);
    return frame;
  }
  function footerColumn(title, links) {
    const column = stack({ name: `footer/${title}`, gap: 12 });
    column.appendChild(text(title, { size: TYPE.meta, weight: 700 }));
    for (const link of links) {
      column.appendChild(text(link, { size: TYPE.body, color: "ink2" }));
    }
    return column;
  }
  function footer(width, device) {
    const desktop = device.id === "desktop";
    const frame = stack({
      name: "footer",
      direction: device.id === "phone" ? "VERTICAL" : "HORIZONTAL",
      gap: desktop ? 40 : 32,
      padding: [40, 0, 48, 0],
      align: "MIN",
      wrap: device.id === "tablet",
      width,
      border: { color: "line", weight: 1, sides: ["top"] }
    });
    const brandWidth = desktop ? Math.round((width - 80) * 0.5) : Math.min(416, width);
    const brand = stack({ name: "brand", gap: 14, width: brandWidth });
    brand.appendChild(brandWordmark(22));
    brand.appendChild(
      fill(
        text("Treino de argumentação escrita para o ENEM e a FUVEST, dentro de histórias.", {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.5,
          width: brandWidth
        })
      )
    );
    brand.appendChild(text("© 2026 Argumenta", { size: TYPE.meta, color: "muted" }));
    frame.appendChild(brand);
    frame.appendChild(footerColumn("Produto", [...NAV_LINKS, "Entrar"]));
    frame.appendChild(footerColumn("Legal", ["Política de privacidade", "Termos de uso"]));
    return frame;
  }
  function landing(device) {
    const width = columnFor(device, "landing").width;
    const frame = deviceFrame(device, {
      name: "Landing",
      axis: "VERTICAL",
      align: "CENTER"
    });
    frame.appendChild(navBar(width, device));
    frame.appendChild(hero(width, device));
    frame.appendChild(factsStrip(width, device));
    const stories = section(width, device);
    stories.appendChild(
      fill(
        sectionHead(
          "Cada capítulo é uma discussão que você precisa vencer.",
          "Três histórias no beta. Cada uma embrulha um tema que já caiu de verdade no ENEM ou na FUVEST, e termina com a redação completa no formato da prova.",
          width,
          device
        )
      )
    );
    frame.appendChild(stories);
    frame.appendChild(marquee(device));
    const how = section(width, device, true);
    how.appendChild(fill(sectionHead("Como funciona", "Você escreve. O personagem responde. A história segue, ou não.", width, device)));
    how.appendChild(fill(howItWorks(width, device)));
    frame.appendChild(how);
    frame.appendChild(thesis(width, device));
    const criteria = section(width, device);
    criteria.appendChild(
      fill(
        sectionHead(
          "Corrigido com a régua da banca, explicado como um professor explicaria.",
          "Um motor único avalia cinco dimensões. ENEM e FUVEST são lentes: mudam como a nota aparece, nunca o veredito.",
          width,
          device
        )
      )
    );
    const perRow = device.id === "desktop" ? 5 : device.id === "tablet" ? 2 : 1;
    const dimensionRows = columns({
      items: DIMENSIONS,
      perRow,
      width,
      gap: 16,
      build: (entry, cell) => dimensionCard(cell, entry)
    });
    for (const row2 of dimensionRows) criteria.appendChild(fill(row2));
    criteria.appendChild(
      text("Toda nota vem com o trecho do seu texto que a justifica. Sem evidência, sem desconto.", {
        size: TYPE.body,
        color: "ink2",
        lineHeight: 1.55,
        width: Math.min(736, width)
      })
    );
    frame.appendChild(criteria);
    const plans = section(width, device, true);
    plans.appendChild(
      fill(
        sectionHead(
          "Comece de graça. Pague só quando o hábito pegar.",
          "O beta é gratuito, com limite diário de correções. Os planos pagos vão ampliar o limite e abrir a sua evolução por dimensão.",
          width,
          device
        )
      )
    );
    const planPerRow = device.id === "phone" ? 1 : 3;
    const planRows = columns({
      items: PLANS,
      perRow: planPerRow,
      width,
      gap: 20,
      build: (plan, cell) => planCard(cell, plan)
    });
    for (const row2 of planRows) plans.appendChild(fill(row2));
    plans.appendChild(
      text("Qualquer envio mantém a sua sequência, em qualquer plano.", {
        size: TYPE.meta,
        color: "muted",
        lineHeight: 1.55,
        width: Math.min(736, width)
      })
    );
    frame.appendChild(plans);
    const questions = section(width, device, true);
    questions.appendChild(fill(sectionHead("As três perguntas que todo mundo faz", null, width, device)));
    questions.appendChild(fill(faqList(width, device)));
    frame.appendChild(questions);
    frame.appendChild(closing(width, device));
    frame.appendChild(footer(width, device));
    return settleSizing(frame);
  }

  // figma-plugin/src/screens/writing.ts
  function sceneBeats(width, device) {
    const size = readingSize(device);
    const pad = device.id === "desktop" ? 28 : 20;
    const objective = card({ active: true, gap: 8, padding: 17, width, name: "beat/objetivo" });
    objective.appendChild(kicker("Seu objetivo"));
    objective.appendChild(
      fill(text(SCENE.objective, { size: TYPE.body, weight: 600, lineHeight: 1.5, width: width - 34 }))
    );
    const hint = card({ gap: 8, padding: 17, width, name: "beat/dica" });
    hint.appendChild(kicker("Dica de repertório", "streak"));
    hint.appendChild(
      fill(text(SCENE.hint, { size: TYPE.body, color: "ink2", lineHeight: 1.58, width: width - 34 }))
    );
    return [
      nightPanel(SCENE.narration, { width, size, padding: pad }),
      speechRow({ speech: SCENE.speech, who: SCENE.speaker, width, size }),
      objective,
      hint
    ];
  }
  function cena(device) {
    const screen = screenFrame(device, { name: "Cena", shell: false, shape: "reading" });
    const width = screen.width;
    screen.content.appendChild(fill(screenBar(width, "← Trilha", [chip("Cap. 2")])));
    for (const beat of sceneBeats(width, device)) screen.content.appendChild(fill(beat));
    const history = stack({ name: "history", padding: [18, 0, 0, 0], align: "CENTER", width });
    const link = text("Ver minhas tentativas anteriores", { size: 16, color: "muted" });
    link.textDecoration = "UNDERLINE";
    history.appendChild(link);
    screen.content.appendChild(fill(history));
    screen.content.appendChild(fill(button("Argumentar")));
    return settle(screen, device);
  }
  var REQUIREMENTS2 = ["Tese", "Justificativa", "Repertório explicado"];
  function briefCard(width) {
    const shell = card({ gap: 12, width, name: "card/objetivo" });
    shell.appendChild(
      fill(
        text(
          "Escreva para Seu Tenório: por que ele pode confiar o pátio ao grêmio este ano, com compromissos concretos de cuidado e limpeza.",
          { size: TYPE.body, weight: 500, lineHeight: 1.5, width: cardInner(width) }
        )
      )
    );
    const chips = stack({
      name: "requisitos",
      direction: "HORIZONTAL",
      gap: 6,
      width: cardInner(width),
      wrap: true
    });
    for (const requirement of REQUIREMENTS2) chips.appendChild(chip(requirement));
    shell.appendChild(fill(chips));
    return shell;
  }
  var SHEET_HEIGHT = { phone: 256, tablet: 352, desktop: 416 };
  function editor2(device) {
    const screen = screenFrame(device, { name: "Editor", shell: false, shape: "wide" });
    const width = screen.width;
    screen.content.appendChild(fill(screenBar(width, "← Cena", [chip("1/3 envios hoje")])));
    screen.content.appendChild(fill(screenTitle("Convença Seu Tenório", device)));
    const deskWidth = device.id === "desktop" ? width - LAYOUT.rail - 24 : width;
    const desk = stack({ name: "desk", gap: 14, width: deskWidth });
    desk.appendChild(fill(textarea(DRAFT, deskWidth, SHEET_HEIGHT[device.id])));
    desk.appendChild(fill(editorFoot(deskWidth)));
    desk.appendChild(fill(button("Enviar para Seu Tenório")));
    if (device.id === "desktop") {
      const row2 = stack({ name: "row", direction: "HORIZONTAL", gap: 24, align: "MIN", width });
      row2.appendChild(briefCard(LAYOUT.rail));
      row2.appendChild(desk);
      screen.content.appendChild(fill(row2));
    } else {
      screen.content.appendChild(fill(briefCard(width)));
      screen.content.appendChild(fill(desk));
    }
    return settle(screen, device);
  }
  function scoreboardCard(width) {
    const inner = cardInner(width);
    const shell = card({ gap: 16, width, name: "card/placar" });
    shell.appendChild(text("Placar", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }));
    const rows = stack({ name: "rows", gap: 16, width: inner });
    for (const row2 of SCORE_ROWS) {
      rows.appendChild(fill(scoreRow(row2, inner, { showMax: true, aside: "criterion" })));
    }
    shell.appendChild(fill(rows));
    shell.appendChild(
      fill(scoreTotal(SCORE_ROWS, inner, "Estimativa Argumenta, não é nota oficial do vestibular"))
    );
    return shell;
  }
  function markedTextCard(width, device) {
    const inner = cardInner(width);
    const shell = card({ gap: 16, width, name: "card/texto-corrigido" });
    shell.appendChild(
      text("Seu texto, corrigido", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead })
    );
    const desktop = device.id === "desktop";
    shell.appendChild(fill(annotatedDraft(inner, desktop ? TYPE.lead : TYPE.body, desktop ? 1.9 : 1.85)));
    const explanation = stack({
      name: "explicacao",
      padding: [10, 12],
      fill: "track",
      radius: SHAPE.tile,
      width: inner
    });
    explanation.appendChild(
      fill(
        text(MARKS[0].message, {
          size: TYPE.meta,
          color: "ink2",
          lineHeight: 1.55,
          width: inner - 24
        })
      )
    );
    shell.appendChild(fill(explanation));
    return shell;
  }
  function correcao(device) {
    const screen = screenFrame(device, { name: "Correção", shell: false, shape: "wide" });
    const width = screen.width;
    const bar = stack({
      name: "bar",
      direction: "HORIZONTAL",
      gap: 12,
      align: "CENTER",
      justify: "SPACE_BETWEEN",
      width
    });
    bar.appendChild(text("O pátio do Tenório", { size: TYPE.body, weight: 700, tracking: TRACKING.lead }));
    bar.appendChild(text("Tentativa 2", { size: TYPE.meta, weight: 600, color: "muted" }));
    screen.content.appendChild(fill(bar));
    screen.content.appendChild(
      fill(technicalVerdict(width, device.id === "desktop" ? TYPE.display : TYPE.title))
    );
    const desktop = device.id === "desktop";
    const mainWidth = desktop ? width - LAYOUT.rail - 20 : width;
    const main2 = stack({ name: "main", gap: desktop ? 20 : 16, width: mainWidth });
    main2.appendChild(fill(markedTextCard(mainWidth, device)));
    main2.appendChild(fill(legendCard(mainWidth)));
    main2.appendChild(fill(paraPassarCard(mainWidth, TO_PASS)));
    const actions = stack({
      name: "actions",
      direction: desktop ? "HORIZONTAL" : "VERTICAL",
      gap: 10,
      width: mainWidth
    });
    const revise = button("Revisar meu texto");
    const back = button("Rever a cena", "ghost");
    if (desktop) {
      actions.appendChild(grow(revise));
      actions.appendChild(grow(back));
    } else {
      actions.appendChild(fill(revise));
      actions.appendChild(fill(back));
    }
    main2.appendChild(fill(actions));
    if (desktop) {
      const row2 = stack({ name: "row", direction: "HORIZONTAL", gap: 20, align: "MIN", width });
      row2.appendChild(main2);
      row2.appendChild(scoreboardCard(LAYOUT.rail));
      screen.content.appendChild(fill(row2));
    } else {
      screen.content.appendChild(fill(scoreboardCard(width)));
      screen.content.appendChild(fill(main2));
    }
    return settle(screen, device);
  }
  function consequencia(device) {
    const screen = screenFrame(device, { name: "Consequência", shell: false, shape: "reading" });
    const width = screen.width;
    const size = readingSize(device);
    screen.content.appendChild(
      fill(screenBar(width, "← Trilha", [chip("Não convenceu", "warn")]))
    );
    screen.content.appendChild(
      fill(nightPanel(CONSEQUENCE.narration, { width, size, padding: device.id === "desktop" ? 28 : 20 }))
    );
    screen.content.appendChild(
      fill(speechRow({ speech: CONSEQUENCE.speech, who: CONSEQUENCE.speaker, width, size }))
    );
    const inner = cardInner(width);
    const stalled = card({ gap: 12, width, name: "card/onde-parou" });
    stalled.appendChild(
      text("Onde o argumento parou", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead })
    );
    const row2 = stack({ name: "row", gap: 7, width: inner });
    const head = stack({
      name: "head",
      direction: "HORIZONTAL",
      gap: 10,
      align: "BASELINE",
      justify: "SPACE_BETWEEN",
      width: inner
    });
    head.appendChild(text("Persuasão", { size: TYPE.meta, weight: 600 }));
    head.appendChild(
      text(`${CONSEQUENCE.score}/100`, { size: TYPE.meta, weight: 700, color: "streakInk" })
    );
    row2.appendChild(fill(head));
    row2.appendChild(progressBar({ percent: CONSEQUENCE.score, floor: 50, width: inner, tone: "streak" }));
    stalled.appendChild(fill(row2));
    stalled.appendChild(
      fill(
        text(CONSEQUENCE.evidence, {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.58,
          width: inner
        })
      )
    );
    screen.content.appendChild(fill(stalled));
    screen.content.appendChild(fill(button("Encarar Seu Tenório de novo")));
    return settle(screen, device);
  }
  function historico(device) {
    const screen = screenFrame(device, { name: "Histórico", shell: false, shape: "reading" });
    const width = screen.width;
    screen.content.appendChild(fill(screenBar(width, "← Voltar", [])));
    screen.content.appendChild(fill(screenTitle("Tentativas anteriores", device)));
    for (const attempt of ATTEMPTS) {
      const inner = cardInner(width);
      const shell = card({ gap: 16, width, padding: 18, name: `tentativa/${attempt.attempt}` });
      const head = stack({
        name: "head",
        direction: "HORIZONTAL",
        gap: 10,
        align: "CENTER",
        justify: "SPACE_BETWEEN",
        width: inner
      });
      const left = stack({ name: "left", gap: 2 });
      left.appendChild(text(attempt.attempt, { size: TYPE.body, weight: 600 }));
      left.appendChild(text(attempt.verdict, { size: TYPE.meta, color: "muted" }));
      head.appendChild(left);
      head.appendChild(chip(attempt.score));
      shell.appendChild(fill(head));
      shell.appendChild(
        fill(
          text(attempt.body, {
            size: TYPE.body,
            color: "ink2",
            lineHeight: 1.6,
            width: inner
          })
        )
      );
      screen.content.appendChild(fill(shell));
    }
    return settle(screen, device);
  }

  // figma-plugin/src/screens/index.ts
  var LANDING = {
    label: "Landing",
    routes: ["/"],
    build: landing
  };
  var SCREENS = [
    LANDING,
    { label: "Entrada", routes: ["/entrar"], build: entrada },
    { label: "Criar conta", routes: ["/criar-conta"], build: criarConta },
    { label: "Entrar com e-mail", routes: ["/entrar/email"], build: entrarEmail },
    { label: "Entrando com Google", routes: ["/entrar/google"], build: googleCallback },
    { label: "Onboarding", routes: ["/onboarding"], build: onboarding },
    { label: "Trilha", routes: ["/trilha"], build: trilha },
    { label: "Cena", routes: ["/capitulos/:chapterId"], build: cena },
    { label: "Editor", routes: ["/capitulos/:chapterId/escrever"], build: editor2 },
    { label: "Correção", routes: ["/capitulos/:chapterId/correcao"], build: correcao },
    { label: "Consequência", routes: ["/capitulos/:chapterId/consequencia"], build: consequencia },
    { label: "Histórico", routes: ["/capitulos/:chapterId/historico"], build: historico },
    { label: "Progresso", routes: ["/progresso"], build: progresso },
    { label: "Conta", routes: ["/conta"], build: conta },
    { label: "Privacidade e Termos", routes: ["/privacidade", "/termos"], build: legal },
    { label: "404", routes: ["*"], build: notFound }
  ];
  var DEVICE_SCREENS = SCREENS.filter((screen) => screen !== LANDING);

  // figma-plugin/src/styles.ts
  function styleName(token) {
    return `Argumenta/${token.replace(/[A-Z0-9]/g, (char) => `-${char.toLowerCase()}`)}`;
  }
  var TEXT_STYLES = [
    { name: "display", size: TYPE.display, weight: 800, lineHeight: 1.15, tracking: TRACKING.title },
    { name: "title", size: TYPE.title, weight: 800, lineHeight: 1.18, tracking: TRACKING.title },
    { name: "lead", size: TYPE.lead, weight: 600, lineHeight: 1.48, tracking: TRACKING.lead },
    { name: "body", size: TYPE.body, weight: 400, lineHeight: 1.55, tracking: TRACKING.body },
    { name: "meta", size: TYPE.meta, weight: 600, lineHeight: 1.45, tracking: 0 },
    { name: "micro", size: TYPE.micro, weight: 500, lineHeight: 1.3, tracking: 0 }
  ];
  function createStyles() {
    for (const style of figma.getLocalPaintStyles()) {
      if (style.name.startsWith("Argumenta/")) style.remove();
    }
    for (const style of figma.getLocalTextStyles()) {
      if (style.name.startsWith("Argumenta/")) style.remove();
    }
    for (const token of Object.keys(COLORS)) {
      const style = figma.createPaintStyle();
      style.name = styleName(token);
      style.paints = paint(token);
    }
    for (const spec of TEXT_STYLES) {
      const style = figma.createTextStyle();
      style.name = `Argumenta/${spec.name}`;
      style.fontName = fontOf(spec.weight);
      style.fontSize = spec.size;
      style.lineHeight = { value: spec.lineHeight * 100, unit: "PERCENT" };
      style.letterSpacing = { value: spec.tracking, unit: "PERCENT" };
    }
  }

  // figma-plugin/src/screens/system.ts
  var BOARD = 1240;
  var INNER = BOARD - 96;
  function cssName(token) {
    return `--color-${token.replace(/[A-Z0-9]/g, (char) => `-${char.toLowerCase()}`)}`;
  }
  var GROUPS = [
    { title: "Superfícies", tokens: ["paper", "card", "line", "lineStrong", "track"] },
    { title: "Tinta", tokens: ["ink", "ink2", "muted", "disabled"] },
    { title: "Caneta, a única cor de ação", tokens: ["caneta", "canetaPress", "canetaSoft"] },
    {
      title: "Vereditos",
      tokens: ["aprovado", "aprovadoInk", "aprovadoSoft", "corretor", "corretorInk", "corretorSoft"]
    },
    { title: "Hábito e repertório", tokens: ["streak", "streakInk", "streakSoft", "marcaTexto"] },
    { title: "Noite", tokens: ["noite", "noiteInner", "luz", "luzMuted"] }
  ];
  function swatch(token) {
    const frame = stack({ name: `cor/${token}`, gap: 8, width: 168 });
    const chipRect = rect(168, 64, token, SHAPE.tile);
    applyBorder(chipRect, { color: "line", weight: 1 });
    frame.appendChild(chipRect);
    const label = stack({ name: "label", gap: 2, width: 168 });
    label.appendChild(text(token, { size: TYPE.meta, weight: 700 }));
    label.appendChild(text(cssName(token), { size: TYPE.micro, color: "muted" }));
    label.appendChild(text(COLORS[token], { size: TYPE.micro, color: "muted" }));
    frame.appendChild(fill(label));
    return frame;
  }
  function sectionTitle(label) {
    return text(label, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead });
  }
  function colours() {
    const frame = stack({ name: "cores", gap: 24, width: INNER });
    frame.appendChild(sectionTitle("Cores, semânticas e não decorativas"));
    for (const group of GROUPS) {
      const block = stack({ name: group.title, gap: 12, width: INNER });
      block.appendChild(text(group.title, { size: TYPE.meta, weight: 700, color: "muted" }));
      const row2 = stack({ name: "row", direction: "HORIZONTAL", gap: 16, wrap: true, width: INNER });
      for (const token of group.tokens) row2.appendChild(swatch(token));
      block.appendChild(fill(row2));
      frame.appendChild(fill(block));
    }
    frame.appendChild(
      fill(
        text(
          "As variantes -ink existem porque a cor base é para preenchimento, não para texto: texto sempre usa a variante -ink.",
          { size: TYPE.meta, color: "muted", lineHeight: 1.5, width: INNER }
        )
      )
    );
    return frame;
  }
  var STEPS2 = [
    { token: "--text-display", label: "Display · 30 / 800", size: TYPE.display, weight: 800, sample: "Sua trilha" },
    { token: "--text-title", label: "Título · 24 / 800", size: TYPE.title, weight: 800, sample: "Convença Seu Tenório" },
    { token: "--text-lead", label: "Lead · 19 / 600", size: TYPE.lead, weight: 700, sample: "O que o estudante lê devagar" },
    { token: "--text-body", label: "Corpo · 15 / 400", size: TYPE.body, weight: 400, sample: "Texto corrido, campos e botões" },
    { token: "--text-meta", label: "Meta · 13 / 600", size: TYPE.meta, weight: 700, sample: "Rótulos, critérios e contadores" },
    { token: "--text-micro", label: "Micro · 11 / 500", size: TYPE.micro, weight: 400, sample: "Só os rótulos da tab bar" }
  ];
  function typography() {
    const frame = stack({ name: "tipografia", gap: 18, width: INNER });
    frame.appendChild(sectionTitle("Tipografia: uma família, Inter, e quatro passos"));
    for (const step of STEPS2) {
      const row2 = stack({
        name: step.token,
        direction: "HORIZONTAL",
        gap: 24,
        align: "BASELINE",
        width: INNER
      });
      row2.appendChild(text(step.label, { size: TYPE.meta, weight: 600, color: "muted", width: 200 }));
      row2.appendChild(text(step.token, { size: TYPE.micro, color: "muted", width: 130 }));
      row2.appendChild(
        grow(
          text(step.sample, {
            size: step.size,
            weight: step.weight,
            tracking: step.size >= TYPE.title ? TRACKING.title : TRACKING.body
          })
        )
      );
      frame.appendChild(fill(row2));
    }
    return frame;
  }
  function shapes() {
    const frame = stack({ name: "forma", gap: 16, width: INNER });
    frame.appendChild(sectionTitle("Forma"));
    const row2 = stack({ name: "row", direction: "HORIZONTAL", gap: 16, width: INNER });
    const tiles = [
      ["--radius-card 14", SHAPE.card],
      ["--radius-button 12", SHAPE.button],
      ["--radius-tile 10", SHAPE.tile],
      ["--radius-chip 999", SHAPE.chip]
    ];
    for (const [label, radius] of tiles) {
      const cell = stack({ name: label, gap: 8, width: 168 });
      const tile = rect(168, 64, "card", radius);
      applyBorder(tile, { color: "lineStrong", weight: 1 });
      cell.appendChild(tile);
      cell.appendChild(text(label, { size: TYPE.micro, color: "muted" }));
      row2.appendChild(cell);
    }
    frame.appendChild(fill(row2));
    return frame;
  }
  function controls() {
    const frame = stack({ name: "componentes", gap: 24, width: INNER });
    frame.appendChild(sectionTitle("Componentes"));
    const buttons = stack({ name: "botoes", direction: "HORIZONTAL", gap: 12, align: "CENTER", wrap: true, width: INNER });
    for (const variant of ["primary", "ghost", "danger", "disabled", "quiet"]) {
      const node = button(
        variant === "primary" ? "Enviar argumento" : variant === "ghost" ? "Rever a cena" : variant === "danger" ? "Excluir para sempre" : variant === "disabled" ? "Enviar argumento" : "Já tenho conta",
        variant
      );
      node.layoutSizingHorizontal = "HUG";
      buttons.appendChild(node);
    }
    frame.appendChild(fill(buttons));
    const chips = stack({ name: "chips", direction: "HORIZONTAL", gap: 8, align: "CENTER", wrap: true, width: INNER });
    const tones = [
      ["1/3 envios hoje", "caneta"],
      ["Concluída", "ok"],
      ["Não convenceu", "warn"],
      ["7 dias", "streak"],
      ["ENEM 2026", "neutral"]
    ];
    for (const [label, tone] of tones) chips.appendChild(chip(label, tone));
    frame.appendChild(fill(chips));
    const row2 = stack({ name: "cartoes", direction: "HORIZONTAL", gap: 16, align: "MIN", width: INNER });
    const plain = card({ gap: 8, width: 360 });
    plain.appendChild(text("Cartão", { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }));
    plain.appendChild(
      fill(
        text("Borda de 1px em --color-line. Nenhum cartão recebe sombra.", {
          size: TYPE.body,
          color: "ink2",
          lineHeight: 1.5,
          width: cardInner(360)
        })
      )
    );
    row2.appendChild(plain);
    const active = card({ active: true, gap: 8, width: 360 });
    active.appendChild(kicker("Seu objetivo"));
    active.appendChild(
      fill(
        text("O cartão em que o estudante deve agir troca a borda por 1,5px de caneta.", {
          size: TYPE.body,
          weight: 600,
          lineHeight: 1.5,
          width: cardInner(360, true)
        })
      )
    );
    row2.appendChild(active);
    const covers = stack({ name: "capas", gap: 12, width: 320 });
    const coverRow = stack({ name: "row", direction: "HORIZONTAL", gap: 12, align: "CENTER" });
    coverRow.appendChild(storyCover(2, "in_progress"));
    coverRow.appendChild(storyCover(1, "completed"));
    coverRow.appendChild(storyCover(3, "locked"));
    covers.appendChild(coverRow);
    covers.appendChild(
      fill(
        text("A capa carrega a posição na trilha ou o estado, nunca um desenho fingindo ser arte de capa.", {
          size: TYPE.meta,
          color: "muted",
          lineHeight: 1.5,
          width: 320
        })
      )
    );
    row2.appendChild(covers);
    frame.appendChild(fill(row2));
    const inputs = stack({ name: "campos", direction: "HORIZONTAL", gap: 16, align: "MIN", width: INNER });
    inputs.appendChild(field({ label: "Apelido", value: "Kauã", hint: "É como o Argumenta vai te chamar.", width: 300 }));
    inputs.appendChild(field({ label: "Vestibular", value: "ENEM", width: 220, select: true }));
    const bars = stack({ name: "barras", gap: 14, width: 400 });
    bars.appendChild(text("Placar, com o piso do critério", { size: TYPE.meta, weight: 600, color: "muted" }));
    bars.appendChild(progressBar({ percent: 80, floor: 50, width: 400 }));
    bars.appendChild(progressBar({ percent: 40, floor: 50, width: 400, tone: "alert" }));
    bars.appendChild(progressBar({ percent: 72, floor: 50, width: 400, tone: "streak" }));
    bars.appendChild(progressBar({ percent: 100, width: 400, tone: "done" }));
    inputs.appendChild(bars);
    frame.appendChild(fill(inputs));
    const notices = stack({ name: "avisos", gap: 10, width: INNER });
    notices.appendChild(fill(notice("Não conseguimos salvar agora. Tente de novo.", "error", INNER)));
    notices.appendChild(fill(notice("Apelido salvo.", "ok", INNER)));
    notices.appendChild(
      fill(
        notice(
          "Sem nenhum vestibular, a sua correção volta para a lente padrão (ENEM) e o Argumenta vai pedir um alvo de novo.",
          "warn",
          INNER
        )
      )
    );
    frame.appendChild(fill(notices));
    const marks = stack({ name: "marcacoes", direction: "HORIZONTAL", gap: 16, align: "CENTER", width: INNER });
    marks.appendChild(markBadge(1, "slip"));
    marks.appendChild(markBadge(2, "praise"));
    marks.appendChild(tick(true));
    marks.appendChild(tick(false));
    const highlight = stack({
      name: "marca-texto",
      direction: "HORIZONTAL",
      padding: [1, 3],
      fill: "marcaTexto",
      align: "CENTER"
    });
    highlight.appendChild(text("Paulo Freire", { size: TYPE.body }));
    marks.appendChild(highlight);
    const slip = text("mais", { size: TYPE.body, color: "corretor" });
    slip.textDecoration = "UNDERLINE";
    marks.appendChild(slip);
    marks.appendChild(
      grow(
        text("Erro sublinhado em corretor, repertório elogiado sobre marca-texto, marcas numeradas em círculo de 15px.", {
          size: TYPE.meta,
          color: "muted",
          lineHeight: 1.5
        })
      )
    );
    frame.appendChild(fill(marks));
    const narrative = stack({ name: "narrativa", direction: "HORIZONTAL", gap: 16, align: "MIN", width: INNER });
    narrative.appendChild(
      nightPanel(
        "Sexta-feira, 7h20. O aviso no mural ainda tem cheiro de impressora: “FESTIVAL CULTURAL, CANCELADO”.",
        { width: 540, size: TYPE.lead }
      )
    );
    narrative.appendChild(
      speechRow({
        speech: "Se veio falar do festival, economize saliva. Por que este ano seria diferente?",
        who: "Dona Marta",
        width: INNER - 540 - 16,
        size: TYPE.lead
      })
    );
    frame.appendChild(fill(narrative));
    return frame;
  }
  function systemBoard() {
    const board2 = stack({
      name: "Sistema visual",
      gap: 48,
      padding: 48,
      fill: "paper",
      radius: 0,
      width: BOARD
    });
    const head = stack({ name: "head", gap: 14, width: INNER });
    head.appendChild(brandWordmark(40));
    head.appendChild(
      text("Sistema visual · design system v3", {
        size: TYPE.title,
        weight: 800,
        tracking: TRACKING.title
      })
    );
    head.appendChild(
      fill(
        text(
          "Gerado a partir de src/styles/tokens.css. Elevação é uma borda OU uma sombra, nunca as duas: cartões usam borda de 1px, e a única sombra do sistema é o degrau de 3px sob uma ação primária.",
          { size: TYPE.body, color: "ink2", lineHeight: 1.6, width: Math.min(INNER, 780) }
        )
      )
    );
    board2.appendChild(fill(head));
    board2.appendChild(fill(colours()));
    board2.appendChild(fill(typography()));
    board2.appendChild(fill(shapes()));
    board2.appendChild(fill(controls()));
    board2.fills = paint("card");
    return board2;
  }

  // figma-plugin/src/main.ts
  var PAGE_NAME = "Argumenta · v3";
  var FRAME_GAP = 96;
  var LABEL_GAP = 44;
  var BAND_GAP = 200;
  function freshPage() {
    const page = figma.createPage();
    page.name = PAGE_NAME;
    figma.currentPage = page;
    for (const existing of [...figma.root.children]) {
      if (existing !== page && existing.name === PAGE_NAME) existing.remove();
    }
    return page;
  }
  function band(cursor, label) {
    const heading = bandLabel(label);
    cursor.page.appendChild(heading);
    heading.x = 0;
    heading.y = cursor.y;
    cursor.placed.push(heading);
    cursor.y += 56;
  }
  function row(cursor, frames) {
    let x = 0;
    let tallest = 0;
    for (const entry of frames) {
      const label = frameLabel(entry.label);
      cursor.page.appendChild(label);
      label.x = x;
      label.y = cursor.y;
      cursor.page.appendChild(entry.frame);
      entry.frame.x = x;
      entry.frame.y = cursor.y + LABEL_GAP;
      cursor.placed.push(label, entry.frame);
      x += entry.frame.width + FRAME_GAP;
      tallest = Math.max(tallest, entry.frame.height);
    }
    cursor.y += LABEL_GAP + tallest + BAND_GAP;
  }
  async function main() {
    await loadFonts();
    const page = freshPage();
    createStyles();
    const cursor = { page, y: 0, placed: [] };
    band(cursor, "Sistema visual");
    row(cursor, [{ label: "Tokens, tipografia e componentes", frame: systemBoard() }]);
    band(cursor, "Landing · a página de marca");
    row(
      cursor,
      DEVICES.map((device) => ({ label: device.label, frame: LANDING.build(device) }))
    );
    for (const device of DEVICES) {
      band(cursor, device.label);
      row(
        cursor,
        DEVICE_SCREENS.map((screen) => ({ label: screen.label, frame: screen.build(device) }))
      );
    }
    figma.viewport.scrollAndZoomIntoView(cursor.placed);
    const count = 3 + DEVICES.length * DEVICE_SCREENS.length;
    figma.closePlugin(`Argumenta v3: ${count} telas em uma página, mais o sistema visual.`);
  }
  main().catch((failure) => {
    const message = failure instanceof Error ? failure.message : String(failure);
    figma.closePlugin(`Erro ao desenhar: ${message}`);
  });
})();
