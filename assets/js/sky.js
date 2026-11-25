// The sky behind the page: day in the light theme, night in the dark one. Flat tones and ink, like the panels.
// Four still canvases at different depths (screentone, sun or moon, stars and far clouds, near clouds).
// They only slide: a little with the scroll, and a little away from the cursor.
(function () {
  "use strict";

  var root = document.documentElement;
  var scheme = window.matchMedia("(prefers-color-scheme: dark)");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  var TAU = Math.PI * 2, DRIFT = 0.3, PAD = 44;           // how far the nearest layer travels, in screens; spare paint round the edges

  var DAY = { tone: "#E7E7F5", sun: "#E4E1FA", line: "#D3D0F0", shade: "#ECEAFA", fill: "#FFFFFF" };
  var NIGHT = { tone: "#172240", moon: "#2B3764", crater: "#222D54", line: "#2A3662", shade: "#111A31", fill: "#17213D", star: "#8E98C4", dim: "#323D66", glint: "#C9CEF0" };

  var sky = document.createElement("div");
  sky.className = "sky";
  sky.setAttribute("aria-hidden", "true");
  // depth: how far each travels with the scroll (of DRIFT) and with the cursor (in px)
  var layers = [[0, 4], [0.2, 9], [0.45, 15], [1, 32]].map(function (d) {
    var c = document.createElement("canvas");
    sky.appendChild(c);
    return { c: c, scroll: d[0], cursor: d[1] };
  });
  var meteor = document.createElement("i");
  sky.appendChild(meteor);
  document.body.prepend(sky);

  function isDark() {
    var t = root.getAttribute("data-theme");
    return t === "dark" || (t !== "light" && scheme.matches);
  }

  // the same sky every time
  function seeded(s) {
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function prepare(c, w, h, x, y) {
    var d = Math.min(w > 1600 ? 1.5 : 2, window.devicePixelRatio || 1);
    c.width = Math.round(w * d);
    c.height = Math.round(h * d);
    c.style.width = w + "px";
    c.style.height = h + "px";
    c.style.left = x + "px";
    c.style.top = y + "px";
    var g = c.getContext("2d");
    g.setTransform(d, 0, 0, d, -x * d, -y * d);           // drawn in window coordinates
    g.lineJoin = g.lineCap = "round";
    return g;
  }

  // Screentone: dots whose size, never their colour, carries the shade.
  function halftone(g, w, h, step, color, amount) {
    g.fillStyle = color;
    g.beginPath();
    for (var row = 0, y = -PAD; y < h + PAD; row++, y += step / 2) {
      for (var x = (row % 2 ? step / 2 : 0) - PAD; x < w + PAD; x += step) {
        var r = amount(x, y) * step * 0.4;
        if (r < 0.45) continue;
        g.moveTo(x + r, y);
        g.arc(x, y, r, 0, TAU);
      }
    }
    g.fill();
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  // A cumulus: one outline round a row of circles, a shadow tone, then the lit side slid up.
  function cloud(g, p, x, y, s, rnd) {
    var n = 6, u = new Path2D();
    for (var i = 0; i < n; i++) {
      var k = i / (n - 1), r = s * (0.36 + 0.5 * Math.sin(k * Math.PI)) * (0.85 + rnd() * 0.3);
      var cx = x + (k - 0.5) * s * 3.3, cy = y - r * 0.55;
      u.moveTo(cx + r, cy);
      u.arc(cx, cy, r, 0, TAU);
    }
    g.save();
    g.beginPath();
    g.rect(x - s * 4, y - s * 4, s * 8, s * 4);           // flat underneath
    g.clip();
    g.strokeStyle = p.line;
    g.lineWidth = 5;
    g.stroke(u);
    g.clip(u);
    g.fillStyle = p.shade;
    g.fillRect(x - s * 4, y - s * 4, s * 8, s * 4);
    g.translate(-s * 0.1, -s * 0.24);
    g.fillStyle = p.fill;
    g.fill(u);
    g.restore();
    g.strokeStyle = p.line;
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(x - s * 1.95, y);
    g.lineTo(x + s * 1.95, y);
    g.moveTo(x - s * 1.1, y + s * 0.2);
    g.lineTo(x + s * 0.9, y + s * 0.2);
    g.stroke();
  }

  function glint(g, x, y, s) {
    var q = s * 0.16;
    g.beginPath();
    g.moveTo(x, y - s);
    g.quadraticCurveTo(x + q, y - q, x + s * 0.7, y);
    g.quadraticCurveTo(x + q, y + q, x, y + s);
    g.quadraticCurveTo(x - q, y + q, x - s * 0.7, y);
    g.quadraticCurveTo(x - q, y - q, x, y - s);
    g.fill();
  }

  function draw() {
    var w = root.clientWidth, h = window.innerHeight, H = Math.ceil(h * (1 + DRIFT)), dark = isDark();
    var rnd = seeded(dark ? 11 : 4), small = w < 700, gutter = Math.max(0, (w - 1184) / 2);
    var p = dark ? NIGHT : DAY, g, i;
    sky.classList.toggle("is-night", dark);

    // ---- far: screentone
    g = prepare(layers[0].c, w + PAD * 2, h + PAD * 2, -PAD, -PAD);
    if (dark) {                                           // the Milky Way, corner to corner
      var nx = h, ny = w, len = Math.hypot(nx, ny), wide = Math.min(w, h) * 0.34;
      halftone(g, w, h, 13, p.tone, function (x, y) {
        var off = (x * nx + (y - h) * ny) / len;          // distance from the diagonal
        var along = (x * ny - y * nx) / len;
        var edge = wide * (1 + 0.3 * Math.sin(along / 130) + 0.16 * Math.sin(along / 47 + 2));
        var rift = Math.abs(off - 22 * Math.sin(along / 90)) < wide * 0.09 ? 0.35 : 1;
        return clamp(1 - Math.abs(off) / edge) * 0.95 * rift;
      });
    } else {                                              // haze, thicker towards the bottom left
      halftone(g, w, h, 13, p.tone, function (x, y) { return clamp((y / h - x / w) * 0.75 + 0.22) * 0.85; });
    }

    // ---- near: sun or moon, then clouds and stars, kept to the edges of the text
    var R = small ? 58 : 96, sx = gutter > 130 ? w - gutter / 2 : w - R * 0.3, sy = small ? h * 0.2 : h * 0.22;
    if (gutter > 130) R = Math.min(R, gutter * 0.4);
    g = prepare(layers[1].c, Math.ceil(R * 3), Math.ceil(R * 3), Math.round(sx - R * 1.5), Math.round(sy - R * 1.5));
    if (dark) {
      g.fillStyle = p.moon;
      g.beginPath();
      g.arc(sx, sy, R * 0.8, 0, TAU);
      g.fill();
      g.globalCompositeOperation = "destination-out";     // the bite that makes it a crescent
      g.beginPath();
      g.arc(sx + R * 0.36, sy - R * 0.2, R * 0.68, 0, TAU);
      g.fill();
      g.globalCompositeOperation = "source-atop";
      g.fillStyle = p.crater;
      [[-0.55, 0.12, 0.13], [-0.3, 0.52, 0.1], [-0.62, -0.22, 0.08]].forEach(function (c) {
        g.beginPath();
        g.arc(sx + c[0] * R, sy + c[1] * R, c[2] * R, 0, TAU);
        g.fill();
      });
      g = prepare(layers[2].c, w + PAD * 2, H + PAD * 2, -PAD, -PAD);
      var count = Math.round(w * H / (small ? 9000 : 11500));
      for (i = 0; i < count; i++) {
        var x = rnd() * w, y = rnd() * H, r = 0.5 + rnd() * rnd() * 1.1;
        var edge = Math.max(gutter + 16, small ? 14 : 30);
        g.fillStyle = x < edge || x > w - edge ? p.star : p.dim;   // dim behind the words, or they read as full stops
        g.beginPath();
        g.arc(x, y, r, 0, TAU);
        g.fill();
      }
      g.fillStyle = p.glint;
      for (i = 0; i < (small ? 5 : 12); i++) {            // the bright ones stay in the margins
        var m = Math.max(gutter, small ? 14 : 64) * rnd(), side = i % 2;
        glint(g, side ? w - m : m, (i + 0.2 + rnd() * 0.6) / (small ? 5 : 12) * H, 4 + rnd() * (gutter > 60 ? 9 : 5));
      }
    } else {
      g.fillStyle = p.sun;
      g.beginPath();
      g.arc(sx, sy, R * 0.62, 0, TAU);
      g.fill();
      g.beginPath();                                      // rays, as wedges
      for (i = 0; i < 18; i++) {
        var a = i / 18 * TAU, half = 0.062, r0 = R * 0.74, r1 = R * (i % 2 ? 1.05 : 1.28);
        g.moveTo(sx + Math.cos(a - half) * r0, sy + Math.sin(a - half) * r0);
        g.lineTo(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1);
        g.lineTo(sx + Math.cos(a + half) * r0, sy + Math.sin(a + half) * r0);
      }
      g.fill();
      g = prepare(layers[2].c, w + PAD * 2, H + PAD * 2, -PAD, -PAD);
    }
    var s = small ? 30 : 46, close = prepare(layers[3].c, w + PAD * 2, H + PAD * 2, -PAD, -PAD);
    [[0, 0.62, 1], [1, 0.47, 0.8], [1, 0.93, 1.25], [0, 1.08, 0.9], [0, 0.3, 0.55]].forEach(function (c) {
      if (dark && c[2] < 0.85) return;
      var k = s * c[2], reach = gutter > k * 1.4 ? gutter * 0.5 : small ? -k * 0.8 : k * 0.1;
      cloud(c[2] >= 0.95 ? close : g, p, c[0] ? w - reach : reach, H * c[1] * 0.92, k, rnd);
    });
  }

  // ---- Movement -------------------------------------------------------------
  var queued = false, cx = 0, cy = 0, tx = 0, ty = 0;      // cursor: where the sky is, and where it is going, -1 to 1
  function slide() {
    queued = false;
    var still = calm.matches, room = root.scrollHeight - window.innerHeight;
    var t = room > 0 && !still ? Math.min(1, window.scrollY / room) : 0;
    if (still) cx = cy = tx = ty = 0;
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    layers.forEach(function (l) {
      l.c.style.transform = "translate3d(" + (-cx * l.cursor).toFixed(1) + "px, " +
        (-t * l.scroll * DRIFT * window.innerHeight - cy * l.cursor * 0.6).toFixed(1) + "px, 0)";
    });
    if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.004) ask();
  }
  function ask() { if (!queued) { queued = true; requestAnimationFrame(slide); } }
  addEventListener("scroll", ask, { passive: true });
  addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || calm.matches) return;
    tx = e.clientX / window.innerWidth * 2 - 1;
    ty = e.clientY / window.innerHeight * 2 - 1;
    ask();
  }, { passive: true });
  if (calm.addEventListener) calm.addEventListener("change", ask);

  // a shooting star: a tapered streak that runs out and thins away
  function shoot() {
    if (calm.matches || document.hidden || !isDark()) return;
    var left = Math.random() < 0.5;
    meteor.style.left = (left ? 4 + Math.random() * 30 : 50 + Math.random() * 30) + "vw";
    meteor.style.top = 10 + Math.random() * 34 + "vh";
    meteor.classList.remove("is-on");
    void meteor.offsetWidth;                              // start it again
    meteor.classList.add("is-on");
  }
  setInterval(shoot, 26000);

  var was = isDark();
  function themed() {
    if (isDark() === was) return;
    was = !was;
    draw();
    sky.classList.remove("is-rising");
    void sky.offsetWidth;
    sky.classList.add("is-rising");                       // the new sun or moon comes up
    if (was) setTimeout(shoot, 700);
  }
  new MutationObserver(themed).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  if (scheme.addEventListener) scheme.addEventListener("change", themed);

  var lastW = 0, lastH = 0, wait;
  function resized() {
    var w = root.clientWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 130) return; // phones hide their toolbar as you scroll
    lastW = w;
    lastH = h;
    draw();
    slide();
  }
  addEventListener("resize", function () { clearTimeout(wait); wait = setTimeout(resized, 120); });
  resized();
})();
