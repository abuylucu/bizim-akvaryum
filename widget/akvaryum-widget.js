// Bizim Akvaryum — iPhone widget'ı (Scriptable uygulaması için)
// Kurulum: widget'ı eklerken "Parameter" kutusuna akvaryum kodunu yazın.
// İsterseniz kodu aşağıdaki KOD satırına da yazabilirsiniz.
const KOD = "";

const DB = "https://bizim-akvaryum-2afb2-default-rtdb.europe-west1.firebasedatabase.app/rooms/";
const GAME = "https://abuylucu.github.io/bizim-akvaryum/";
const HUNGER_MS = 8 * 3600e3, DIRT_INT = 12 * 60e3, DIRT_MAX = 40, DIRT_HP = 3;
// tür: [boy çarpanı, büyüme süresi (dk)]
const SP = {
  lepistes: [0.7, 180],
  neon: [0.6, 180],
  zebra: [0.65, 180],
  moli: [0.75, 180],
  japon: [0.85, 180],
  platy: [0.7, 180],
  kilic: [0.8, 180],
  sumatra: [0.7, 180],
  gurami: [0.75, 180],
  kpapagan: [0.9, 180],
  gramma: [0.7, 180],
  melek: [0.9, 600],
  beta: [0.85, 600],
  palyaco: [0.75, 600],
  cerrah: [0.9, 600],
  kelebek: [0.8, 600],
  gokkusagi: [0.85, 600],
  balon: [0.8, 600],
  diskus: [1.0, 600],
  koi: [1.2, 600],
  mandarin: [0.7, 600],
  arowana: [1.4, 600],
  papagan: [1.1, 600],
  aslan: [1.0, 600],
  imparator: [1.0, 600],
  alev: [0.95, 1680],
  gece: [0.95, 1680],
  ejder: [1.5, 1680],
  yildiz: [0.9, 1680],
  ayisigi: [1.0, 1680],
  kristal: [1.2, 1680],
  prenses: [1.0, 1680],
  pirana: [0.85, 600],
  oskar: [1.25, 600],
  murena: [1.6, 600],
  kopek: [1.8, 1680],
  salyangoz: [0.45, 180],
  karides: [0.45, 180],
  yengec: [0.6, 600],
  kaplankarides: [0.5, 600],
  istakoz: [1.0, 600],
  kristalyengec: [0.75, 1680],
};

const code = ((args.widgetParameter || KOD || "") + "").trim().toUpperCase();

function hsl(h, s, l, a = 1) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, hp = (((h % 360) + 360) % 360) / 60, x = c * (1 - Math.abs(hp % 2 - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) { r = c; g = x; } else if (hp < 2) { r = x; g = c; } else if (hp < 3) { g = c; b = x; }
  else if (hp < 4) { g = x; b = c; } else if (hp < 5) { r = x; b = c; } else { r = c; b = x; }
  const m = l - c / 2, hx = v => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return new Color("#" + hx(r) + hx(g) + hx(b), a);
}
function rng(seed) {
  let a = 0; for (let i = 0; i < seed.length; i++) a = (a * 31 + seed.charCodeAt(i)) | 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const P = (x, y) => new Point(x, y);

async function main() {
  const W = 700, H = 330;
  const ctx = new DrawContext();
  ctx.size = new Size(W, H);
  ctx.opaque = true;
  ctx.respectScreenScale = true;

  // su (dikey geçiş)
  const top = [63, 176, 217], bot = [10, 58, 92];
  for (let i = 0; i < 40; i++) {
    const t = i / 39, c = top.map((v, k) => Math.round(v + (bot[k] - v) * t));
    ctx.setFillColor(new Color("#" + c.map(v => v.toString(16).padStart(2, "0")).join("")));
    ctx.fillRect(new Rect(0, i * H / 40, W, H / 40 + 1));
  }
  // ışık
  ctx.setFillColor(new Color("#ffffff", 0.07));
  for (let i = 0; i < 4; i++) {
    const p = new Path(), x = 50 + i * 175;
    p.addLines([P(x, 0), P(x + 45, 0), P(x + 120, H * 0.84), P(x + 35, H * 0.84)]); p.closeSubpath();
    ctx.addPath(p); ctx.fillPath();
  }
  // bitkiler
  const pr = rng("bitki");
  for (let i = 0; i < 8; i++) {
    const bx = 30 + i * 90 + pr() * 25, h = 50 + pr() * 100;
    ctx.setFillColor(hsl(100 + pr() * 50, 55, 30 + pr() * 15, 0.9));
    for (let k = -1; k <= 1; k++) {
      const p = new Path();
      p.move(P(bx + k * 9 - 5, H * 0.86));
      p.addQuadCurve(P(bx + k * 20 + 5, H * 0.86 - h), P(bx + k * 12, H * 0.86 - h * 0.5));
      p.addQuadCurve(P(bx + k * 9 + 5, H * 0.86), P(bx + k * 12 + 8, H * 0.86 - h * 0.5));
      ctx.addPath(p); ctx.fillPath();
    }
  }
  // kum
  ctx.setFillColor(new Color("#d9c08a")); ctx.fillRect(new Rect(0, H * 0.84, W, H * 0.16));
  ctx.setFillColor(new Color("#e3cc95")); ctx.fillRect(new Rect(0, H * 0.84, W, 8));

  const text = (s, x, y, size, color = Color.white(), bg = null) => {
    ctx.setFont(Font.boldSystemFont(size));
    if (bg) {
      const w = s.length * size * 0.62 + 24;
      const p = new Path(); p.addRoundedRect(new Rect(x - 12, y - 6, w, size + 14), (size + 14) / 2, (size + 14) / 2);
      ctx.setFillColor(bg); ctx.addPath(p); ctx.fillPath();
    }
    ctx.setTextColor(color); ctx.drawText(s, P(x, y));
  };

  if (!code || code.length < 8) {
    text("Widget'ı düzenle → Parameter: akvaryum kodu", 40, H / 2 - 14, 24);
    return ctx.getImage();
  }
  let room = null;
  try { room = await new Request(DB + code + ".json").loadJSON(); } catch (e) { }
  if (!room) {
    text("Akvaryuma ulaşılamadı (kod / internet)", 60, H / 2 - 14, 24);
    return ctx.getImage();
  }

  const now = Date.now();
  // çoklu akvaryum: ilk akvaryumu göster (eski sürümde room.tank)
  const tids = Object.keys(room.tanks || {}).sort((a, b) => ((room.tanks[a].order || 0) - (room.tanks[b].order || 0)));
  const tid = tids[0] || 't1', tank = (room.tanks && room.tanks[tid]) || room.tank || {};
  const fish = {};
  for (const id in room.fish || {}) if ((room.fish[id].tank || 't1') === tid) fish[id] = room.fish[id];
  let hungry = 0, sick = 0, count = 0;

  // süsler (sade)
  for (const id in tank.decor || {}) {
    const d = tank.decor[id], x = (d.x || 0.5) * W, y = H * 0.9 + (d.y || 0.3) * 18;
    const col = { kale: "#9aa3ad", gemi: "#5a3d25", fener: "#e0403a", kristal: "#b070ff", sandik: "#7a4a22", mercan_k: "#e05a3a", mercan_y: "#d65cc8", anemon: "#ff8fc0", mercan_b: "#b5cf5a", sutun: "#efe4cc" }[d.type] || "#ffc9b0";
    const h = { kale: 75, gemi: 40, fener: 90, kristal: 60, sandik: 30, sutun: 70 }[d.type] || 35;
    const w = { gemi: 120, kale: 80, sandik: 55 }[d.type] || 34;
    ctx.setFillColor(new Color(col));
    const p = new Path(); p.addRoundedRect(new Rect(x - w / 2, y - h, w, h), 8, 8); ctx.addPath(p); ctx.fillPath();
  }

  // balıklar
  for (const id of Object.keys(fish).sort()) {
    const f = fish[id], sp = SP[f.species], g = f.genes;
    if (!sp || !g) continue;
    count++;
    const full = Math.max(0, (f.full ?? 100) - (now - (f.fedAt || now)) / HUNGER_MS * 100);
    if (full < 25) hungry++;
    if ((f.health ?? 100) < 30 || full <= 0) sick++;
    const growth = Math.min(1, (f.growth || 0) + (now - (f.growthAt || now)) / (sp[1] * 60000));
    const r = rng(id);
    const L = 85 * sp[0] * (0.35 + 0.65 * growth), Hh = L * 0.45;
    const x = 55 + r() * (W - 110), y = 65 + r() * (H * 0.84 - 105), dir = r() < 0.5 ? -1 : 1;
    const a = full <= 0 ? 0.65 : 1;
    const X = v => x + v * dir;
    // kuyruk
    ctx.setFillColor(hsl(g.h2, g.s2, g.l2, 0.85 * a));
    let p = new Path();
    p.move(P(X(-L * 0.38), y)); p.addLine(P(X(-L * 0.72), y - Hh * 0.6)); p.addQuadCurve(P(X(-L * 0.72), y + Hh * 0.6), P(X(-L * 0.6), y)); p.closeSubpath();
    ctx.addPath(p); ctx.fillPath();
    // sırt yüzgeci
    p = new Path();
    p.move(P(X(L * 0.12), y - Hh * 0.45)); p.addQuadCurve(P(X(-L * 0.22), y - Hh * 0.72), P(X(-L * 0.02), y - Hh * 0.9)); p.addLine(P(X(-L * 0.25), y - Hh * 0.3)); p.closeSubpath();
    ctx.addPath(p); ctx.fillPath();
    // gövde
    ctx.setFillColor(hsl(g.h1, g.s1, g.l1, a));
    ctx.fillEllipse(new Rect(dir > 0 ? x - L * 0.45 : x - L * 0.5, y - Hh / 2, L * 0.95, Hh));
    if (["vstripes", "bands", "split", "gradient"].includes(g.pattern)) {
      ctx.setFillColor(hsl(g.h2, g.s2, g.l2, 0.75 * a));
      ctx.fillEllipse(new Rect(dir > 0 ? x - L * 0.42 : x + L * 0.02, y - Hh * 0.35, L * 0.4, Hh * 0.7));
    }
    // göz
    ctx.setFillColor(Color.white()); ctx.fillEllipse(new Rect(X(L * 0.3) - L * 0.06, y - Hh * 0.1 - L * 0.06, L * 0.12, L * 0.12));
    ctx.setFillColor(new Color("#111111")); ctx.fillEllipse(new Rect(X(L * 0.31) - L * 0.035, y - Hh * 0.1 - L * 0.035, L * 0.07, L * 0.07));
  }

  // kir
  const cnt = Math.min(DIRT_MAX, Math.max(0, Math.floor((now - (tank.dirtAt || now)) / DIRT_INT)));
  const wiped = tank.wiped || {};
  let amount = 0;
  const dr = rng(String(tank.dirtAt || 0));
  for (let j = 0; j < cnt; j++) {
    const hits = wiped[j] === true ? DIRT_HP : (wiped[j] || 0);
    const bx = 40 + dr() * (W - 80), by = 30 + dr() * (H * 0.72), br = 25 + dr() * 30;
    if (hits >= DIRT_HP) continue;
    const al = 1 - hits / DIRT_HP; amount += al;
    ctx.setFillColor(hsl(80, 45, 30, 0.35 * al));
    ctx.fillEllipse(new Rect(bx - br, by - br, br * 2, br * 2));
  }
  const dirtPct = Math.round(amount / DIRT_MAX * 100);

  text(`🪙 ${Math.floor(room.coins || 0)}   🍤 ${Math.floor(room.food || 0)}   🐟 ${count}`, 26, 18, 24, Color.white(), new Color("#042030", 0.6));
  const warn = [];
  if (sick) warn.push(`🤒 ${sick} hasta`);
  if (hungry) warn.push(`🍤 ${hungry} aç`);
  if (dirtPct >= 30) warn.push(`🧽 kir %${dirtPct}`);
  text(warn.length ? warn.join("  ") : "Herkes mutlu 💗", 26, H - 50, 22, Color.white(), new Color(warn.length ? "#8a2040" : "#106030", 0.8));
  return ctx.getImage();
}

const img = await main();
const w = new ListWidget();
w.backgroundImage = img;
w.url = GAME + (code ? "?oda=" + code : "");
w.refreshAfterDate = new Date(Date.now() + 15 * 60e3);
Script.setWidget(w);
if (!config.runsInWidget) await w.presentMedium();
Script.complete();
