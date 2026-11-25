// The intro: a Sakuga progress bar over the page, then a slash that cuts the cover in two.
// The <head> adds .is-loading before first paint (never with reduced motion). Click, tap or any key skips it.
(function () {
  "use strict";

  var root = document.documentElement;
  var loader = document.getElementById("loader");
  if (!loader) return;
  window.loaderReady = true;

  var fx = window.SakugaFX;
  var bar = loader.querySelector("sakuga-progress");
  function ended() { document.dispatchEvent(new Event("intro:end")); }   // main.js waits for this

  if (!fx || !root.classList.contains("is-loading")) {
    root.classList.remove("is-loading");
    loader.remove();
    ended();
    return;
  }

  // Nothing behind the cover takes focus while it is up.
  var behind = Array.prototype.filter.call(document.body.children, function (el) {
    return el !== loader && el.tagName !== "SCRIPT" && el.tagName !== "CANVAS";
  });
  behind.forEach(function (el) { el.inert = true; });

  // ---- What is really loading --------------------------------------------
  var photo = document.querySelector(".hero-photo img");
  var jobs = [
    document.fonts ? document.fonts.ready : null,
    photo && photo.decode ? photo.decode() : null,
    document.querySelector(".theme-toggle, .theme-fx") && window.customElements
      ? customElements.whenDefined("sakuga-toggle") : null
  ];
  var finished = 0;
  jobs.forEach(function (job) {
    var tick = function () { finished++; };
    Promise.resolve(job).then(tick, tick);
  });

  // The bar never outruns the real work, and takes at least MIN so the cloud gets its ride.
  // After the first visit it is over in about a second.
  var short = root.classList.contains("is-short");
  var MIN = short ? 450 : 1800, MAX = short ? 1500 : 6000, HOLD = short ? 260 : 850;
  var began = performance.now();
  var over = false;

  function pump() {
    if (over) return;
    if (short) bar.said = true;                           // no time for the rumble
    var t = performance.now() - began;
    var u = Math.min(1, t / MIN);
    var paced = u + Math.sin(u * Math.PI * 4) * 0.045;    // in surges
    var real = t > MAX ? 1 : finished / jobs.length;
    bar.set(u >= 1 && real >= 1 ? 1 : Math.min(paced, 0.12 + real * 0.83), short);
    requestAnimationFrame(pump);
  }
  requestAnimationFrame(pump);

  bar.addEventListener("sakuga:done", function () { setTimeout(cut, HOLD); });
  setTimeout(cut, MAX + 2500);                            // whatever happens, let people in

  // ---- Skipping -----------------------------------------------------------
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key === "Shift" || e.key === "Tab") return;
    cut();
  }
  loader.addEventListener("click", cut);
  addEventListener("keydown", onKey);

  // ---- The cut ------------------------------------------------------------
  function cut() {
    if (over) return;
    over = true;
    removeEventListener("keydown", onKey);
    try { localStorage.setItem("intro", "seen"); } catch (e) {}

    var w = innerWidth, h = innerHeight, diag = Math.hypot(w, h);
    var ang = -Math.atan2(h, w);
    var x = scrollX + w / 2, y = scrollY + h / 2;
    var lean = diag * 0.04, normal = ang - Math.PI / 2;   // the crescent bows; centre it on the seam

    loader.classList.add("is-cut", "is-hit");
    bar.remove();                                         // takes its cloud and ground line with it
    fx.advance(3);                                        // run out anything still rumbling, so it doesn't hang over the page
    fx.slash(x - Math.cos(normal) * lean, y - Math.sin(normal) * lean, { len: diag * 0.95, ang: ang, thick: Math.max(26, diag * 0.03), life: 0.5 });
    fx.shards(x, y, { n: 14, speed: diag * 0.3, size: 9, arc: 6.28, grav: 320, life: 1 });

    setTimeout(function () {
      loader.classList.remove("is-hit");
      root.classList.remove("is-loading");
      behind.forEach(function (el) { el.inert = false; });
      loader.classList.add("is-apart");
      for (var i = -2; i <= 2; i++) {
        var f = i * 0.19 * diag;
        fx.puff(x + Math.cos(ang) * f, y + Math.sin(ang) * f, { size: fx.rnd(14, 24), n: 5, vx: i * 30, vy: -26, life: fx.rnd(0.7, 1) });
      }
    }, 110);
    setTimeout(function () { loader.remove(); ended(); }, 900);
  }
})();
