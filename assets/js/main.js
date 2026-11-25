// Ayaan Sulman: portfolio. Everything works without this file; it adds the theme switch and the Sakuga VFX controls.
(function () {
  "use strict";

  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var fx = window.SakugaFX;                               // assets/vendor/sakuga/sakuga.js
  var here = document.currentScript && document.currentScript.src;
  var $ = function (sel) { return document.querySelector(sel); };
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };

  if (fx) root.classList.add("fx");

  // ---- Theme --------------------------------------------------------------
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return media && media.matches ? "dark" : "light";
  }

  function syncToggle() {
    var dark = currentTheme() === "dark";
    each(".theme-toggle", function (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("title", dark ? "Switch to light theme" : "Switch to dark theme");
    });
    each(".theme-fx sakuga-toggle", function (t) { if (t.checked !== dark) t.checked = dark; });
    each('meta[name="theme-color"]', function (m) {
      m.setAttribute("content", dark ? "#0D1526" : "#F6F7F9");
      m.removeAttribute("media");
    });
  }

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncToggle();
  }

  each(".theme-toggle", function (btn) {
    btn.addEventListener("click", function () { setTheme(currentTheme() === "dark" ? "light" : "dark"); });
  });

  if (media) {
    var onChange = function () { if (!root.hasAttribute("data-theme")) syncToggle(); };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }
  syncToggle();

  // The painted switch is a big file, so the plain button stands in until it arrives.
  if (fx && here && $(".theme-toggle")) {
    customElements.whenDefined("sakuga-toggle").then(function () {
      each(".theme-toggle", function (btn) {
        var holder = document.createElement("span");
        var t = document.createElement("sakuga-toggle");
        holder.className = "theme-fx";
        t.setAttribute("label", "Dark theme");
        t.checked = currentTheme() === "dark";
        t.addEventListener("change", function () { setTheme(t.checked ? "dark" : "light"); });
        holder.appendChild(t);
        btn.replaceWith(holder);
      });
    });
    var s = document.createElement("script");
    s.src = new URL("../vendor/sakuga/toggle.js", here).href;
    s.async = true;
    document.head.appendChild(s);
  }

  // ---- Toast --------------------------------------------------------------
  function toast(message) {
    var el = $(".site-toast");
    if (fx && el && el.show) el.show(message);
  }

  function download(href) {
    var a = document.createElement("a");
    a.href = href;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ---- Buttons ------------------------------------------------------------
  // Turn a .btn link or button into a <sakuga-button>.
  function toSakuga(el) {
    var b = document.createElement("sakuga-button");
    b.textContent = el.textContent;
    if (el.dataset.fx !== "primary" && (el.classList.contains("btn-ghost") || el.classList.contains("btn-small"))) b.setAttribute("variant", "secondary");
    if (el.classList.contains("btn-small")) b.classList.add("small");
    el.replaceWith(b);
    return b;
  }

  var HIT = 620;                                          // let the impact land before leaving the page

  if (fx) {
    each("a.btn", function (a) {
      var href = a.href, file = a.hasAttribute("download");
      var b = toSakuga(a);
      var inner = b.shadowRoot.querySelector("button");
      inner.setAttribute("role", "link");
      b.addEventListener("click", function () {
        if (file) { download(href); toast("Resume downloading"); return; }
        setTimeout(function () { location.href = href; }, fx.calm ? 0 : HIT);
      });
    });
  }

  // ---- Copy email ---------------------------------------------------------
  each(".copy-email", function (btn) {
    var label = btn.textContent;
    var email = btn.getAttribute("data-email");
    var status = btn.parentNode.querySelector(".copy-status");
    var link = btn.parentNode.querySelector(".email-link");
    var target = fx ? toSakuga(btn) : btn;
    var timer;

    function done(ok) {
      target.textContent = ok ? "Copied" : "Address selected";
      if (fx) toast(ok ? "Email copied" : "Address selected");   // the toast is read out
      else if (status) status.textContent = ok ? "Email address copied" : "";
      clearTimeout(timer);
      timer = setTimeout(function () {
        target.textContent = label;
        if (status) status.textContent = "";
      }, 2000);
    }

    function fallback() {
      // Select the address so the visitor can copy it themselves.
      if (link && window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(link);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      done(false);
    }

    target.addEventListener("click", function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, fallback);
      } else {
        fallback();
      }
    });
  });

  // ---- Where you are: mark the section in the menu --------------------------
  var links = {};
  each('.site-nav a[href^="#"]', function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if (window.IntersectionObserver && Object.keys(links).length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (!a) return;
        if (e.isIntersecting) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -64.9% 0px" });             // a line a third of the way down
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // ---- Footer year --------------------------------------------------------
  each(".year", function (el) { el.textContent = String(new Date().getFullYear()); });

  if (!fx) return;

  // ---- Phone bar: up once the hero's buttons are gone, down again at Contact ---
  var quick = $("#quick-bar"), hero = $(".hero-actions"), contact = $("#contact");
  if (quick && hero && contact && window.IntersectionObserver) {
    var gone = false, near = false;
    var place = function () { root.classList.toggle("bar-up", gone && !near); };
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      gone = !e.isIntersecting && e.boundingClientRect.top < 0;
      place();
    }).observe(hero);
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      near = e.isIntersecting || e.boundingClientRect.top < 0;
      place();
    }, { rootMargin: "0px 0px -30% 0px" }).observe(contact);
  }

  // ---- Proof strip: the numbers count up once, and the last one lands ---------
  var proof = $("#proof");
  if (proof && !fx.calm && window.IntersectionObserver) {
    var nums = Array.prototype.slice.call(proof.querySelectorAll("b"));
    var play = function () {
      nums.forEach(function (b, i) {
        var final = b.textContent, to = Number(b.dataset.count) || 0;
        var spring = new fx.Spring(1, 420, 14);
        var start = performance.now() + i * 170, last = 0, popped = false;
        if (to) b.style.minWidth = b.offsetWidth + "px";
        var step = function (now) {
          var u = Math.max(0, Math.min(1, (now - start) / 750));
          if (u < 1) {
            if (to) b.textContent = final.replace(/^[\d,]+/, Math.round(to * (1 - Math.pow(1 - u, 3))).toLocaleString("en-US"));
          } else if (!popped) {
            popped = true;
            b.textContent = final;
            spring.x = 1.32;
            var c = fx.at(b, 1, 0);
            fx.ticks(c.x + 2, c.y + 4, { dir: -1.05, n: 3, r: 5, len: 17, fan: 0.36, life: 0.5 });
            if (i === nums.length - 1) {
              var m = fx.at(b);
              fx.burst(m.x, m.y, { r: 46, life: 0.36 });
              fx.puff(m.x - m.w / 2 - 6, m.y + 20, { size: 11, n: 4, vx: -26, vy: -8, life: 0.8 });
              fx.puff(m.x + m.w / 2 + 6, m.y + 20, { size: 11, n: 4, vx: 26, vy: -8, life: 0.8 });
              fx.sfx("don", m.x + 6, m.y - 74, { size: 150, rot: -0.12, life: 1.05 });
            }
          }
          var y = popped ? spring.step(Math.min(0.034, (now - last) / 1000)) : 1;
          last = now;
          b.style.transform = Math.abs(y - 1) < 0.001 ? "" : "scale(" + y + ")";
          if (!popped || Math.abs(y - 1) > 0.001 || Math.abs(spring.v) > 0.01) requestAnimationFrame(step);
          else b.style.transform = "";
        };
        requestAnimationFrame(step);
      });
    };
    var arm = function () {
      var seen = new IntersectionObserver(function (es) {
        if (!es[es.length - 1].isIntersecting) return;
        seen.disconnect();
        if (!root.classList.contains("is-reading")) play();   // not over an open project
      }, { threshold: 0.55 });
      seen.observe(proof);
    };
    if (root.classList.contains("is-loading")) document.addEventListener("intro:end", arm, { once: true });
    else arm();
  }

  // ---- The manga page -------------------------------------------------------
  // One sheet of panels per chapter (who the work was for). Each project is a four-cornered panel.
  // layout() cuts every sheet into slanted rows, again whenever the filters or the width change.
  var page = $("#panels");
  var all = function (s) { return page ? Array.prototype.slice.call(page.querySelectorAll(s)) : []; };
  var chapters = all(".chapter"), sheets = all(".panels"), panels = all(".panel");

  // Rows for n panels. "side" is one big panel with two stacked beside it.
  function rowsFor(n, width) {
    var rows = [], k = 0;
    if (width < 560) {
      while (n > 0) {
        if (k % 3 === 0 || n === 1) { rows.push({ n: 1, h: 250 }); n -= 1; }
        else { rows.push({ n: 2, h: 206 }); n -= 2; }
        k++;
      }
      return rows;
    }
    if (width < 860) {
      while (n > 0) {
        if (n % 2) { rows.push({ n: 1, h: 350 }); n -= 1; }
        else { rows.push({ n: 2, h: 250, at: k % 2 ? 0.44 : 0.56 }); n -= 2; }
        k++;
      }
      return rows;
    }
    if (n === 7) return [{ n: 3, side: true, h: 440, at: 0.58 }, { n: 4, h: 240 }];
    if (n === 4) return [{ n: 2, h: 400, at: 0.6 }, { n: 2, h: 310, at: 0.42 }];
    while (n > 0) {
      if (n === 1) { rows.push({ n: 1, h: 420 }); n = 0; }
      else if (n === 2 || n === 4) { rows.push({ n: 2, h: 330, at: k % 2 ? 0.45 : 0.56 }); n -= 2; }
      else { rows.push(k % 2 ? { n: 3, h: 260 } : { n: 3, side: true, h: 480, at: 0.6 }); n -= 3; }
      k++;
    }
    return rows;
  }

  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

  // Cut a panel [top left, top right, bottom right, bottom left] in two, leaving a gutter.
  function cutAcross(q, t, lean, gap) {                   // a near-vertical cut; the top moves by lean, the bottom the other way
    var w = q[1][0] - q[0][0], a = mix(q[0], q[1], t + lean / w), b = mix(q[3], q[2], t - lean / w), g = gap / 2;
    return [[q[0], [a[0] - g, a[1]], [b[0] - g, b[1]], q[3]], [[a[0] + g, a[1]], q[1], q[2], [b[0] + g, b[1]]]];
  }
  function cutDown(q, t, lean, gap) {                     // a near-horizontal cut
    var h = q[3][1] - q[0][1], a = mix(q[0], q[3], t + lean / h), b = mix(q[1], q[2], t - lean / h), g = gap / 2;
    return [[q[0], q[1], [b[0], b[1] - g], [a[0], a[1] - g]], [[a[0], a[1] + g], [b[0], b[1] + g], q[2], q[3]]];
  }

  // Move every edge of a panel inwards by d: the paper inside the ink line.
  function inset(q, d) {
    var edges = q.map(function (p, i) {
      var r = q[(i + 1) % 4], dx = r[0] - p[0], dy = r[1] - p[1], len = Math.hypot(dx, dy) || 1;
      return { x: p[0] - dy / len * d, y: p[1] + dx / len * d, dx: dx, dy: dy };
    });
    return edges.map(function (e, i) {
      var f = edges[(i + 3) % 4], det = f.dx * e.dy - f.dy * e.dx || 1e-6;
      var t = ((e.x - f.x) * e.dy - (e.y - f.y) * e.dx) / det;
      return [f.x + f.dx * t, f.y + f.dy * t];
    });
  }
  function polygon(q) { return "polygon(" + q.map(function (p) { return p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px"; }).join(", ") + ")"; }

  function layout() { sheets.forEach(layoutSheet); }
  function layoutSheet(sheet, nth) {
    var W = sheet.clientWidth;
    if (!W) return;                                       // its chapter is filtered out
    var small = W < 560, gap = small ? 13 : 18, lean = small ? 9 : 20, tilt = small ? 5 : 12, line = 3;
    var shown = Array.prototype.filter.call(sheet.children, function (p) { return !p.hidden; });
    var rows = rowsFor(shown.length, W), quads = [], y = 0;

    rows.forEach(function (row, r) {
      // neighbouring rows share a tilted edge, so the gutter stays even
      var top = r === 0 ? 0 : (r % 2 ? tilt : -tilt), end = r === rows.length - 1 ? 0 : (r % 2 ? -tilt : tilt);
      var y2 = y + row.h;
      var q = [[0, y + top], [W, y - top], [W, y2 - end], [0, y2 + end]];
      var s = (r + nth) % 2 ? -lean : lean, two, rest;     // chapters open leaning different ways
      if (row.side) {
        two = cutAcross(q, row.at, s, gap);
        rest = cutDown(two[1], 0.5, s * 0.6, gap);
        quads.push(two[0], rest[0], rest[1]);
      } else {
        rest = q;
        for (var i = row.n; i > 1; i--) {
          two = cutAcross(rest, row.n === 2 && row.at ? row.at : 1 / i, i % 2 ? -s : s, gap);
          quads.push(two[0]);
          rest = two[1];
        }
        quads.push(rest);
      }
      y = y2 + gap;
    });

    shown.forEach(function (p, i) {
      var q = quads[i], xs = q.map(function (c) { return c[0]; }), ys = q.map(function (c) { return c[1]; });
      var x0 = Math.min.apply(0, xs), y0 = Math.min.apply(0, ys), w = Math.max.apply(0, xs) - x0, h = Math.max.apply(0, ys) - y0;
      var own = q.map(function (c) { return [c[0] - x0, c[1] - y0]; }), paper = inset(own, line);
      p.style.cssText = "left:" + x0.toFixed(1) + "px;top:" + y0.toFixed(1) + "px;width:" + w.toFixed(1) + "px;height:" + h.toFixed(1) + "px";
      // the biggest upright box inside the panel, for the words and the drawing
      p.style.setProperty("--l", Math.max(paper[0][0], paper[3][0]).toFixed(1) + "px");
      p.style.setProperty("--r", (w - Math.min(paper[1][0], paper[2][0])).toFixed(1) + "px");
      p.style.setProperty("--t", Math.max(paper[0][1], paper[1][1]).toFixed(1) + "px");
      p.style.setProperty("--b", (h - Math.min(paper[2][1], paper[3][1])).toFixed(1) + "px");
      p.classList.toggle("is-big", w * h > (small ? 85000 : 235000));
      p.querySelector(".panel-ink").style.clipPath = polygon(own);
      p.place = { x: x0, y: y0, w: w, h: h };             // where it sits untilted
      p.querySelector(".panel-in").style.clipPath = polygon(paper);
    });
    sheet.style.height = Math.max(0, y - gap) + "px";
    sheet.classList.add("is-laid");
  }

  if (page) {
    layout();
    if (window.ResizeObserver) {
      var lastW = 0;
      new ResizeObserver(function () {
        if (page.clientWidth === lastW) return;           // its own height changes don't count
        lastW = page.clientWidth;
        sheets.forEach(function (s) { s.classList.remove("is-moving"); });
        layout();
      }).observe(page);
    } else addEventListener("resize", layout);

    // ---- Depth: a panel leans towards the cursor; on touch it leans with the speed of the scroll
    var live = [], looping = false, lastT = 0;
    var tiltOf = function (p) {
      return p.tilt || (p.tilt = { x: new fx.Spring(0, 190, 15), y: new fx.Spring(0, 190, 15), lift: new fx.Spring(0, 240, 17) });
    };
    var wake = function (p) {
      if (live.indexOf(p) === -1) { live.push(p); p.classList.add("is-live"); }
      if (!looping) { looping = true; lastT = performance.now(); requestAnimationFrame(tick); }
    };
    var rest = function (p) {
      p.classList.remove("is-live");
      p.style.transform = "";
      ["--lift", "--px", "--py", "--sx", "--sy"].forEach(function (v) { p.style.removeProperty(v); });
    };
    var tick = function (now) {
      var dt = Math.max(0.001, Math.min(0.034, (now - lastT) / 1000));
      lastT = now;
      var slim = page.clientWidth < 560;                  // narrow gutters: keep the shadow short
      live = live.filter(function (p) {
        var t = tiltOf(p), rx = t.x.step(dt), ry = t.y.step(dt), up = t.lift.step(dt);
        var still = !t.lift.to && [t.x, t.y, t.lift].every(function (s) { return !s.to && Math.abs(s.x) < 0.02 && Math.abs(s.v) < 0.05; });
        if (still || fx.calm || p.hidden) {
          [t.x, t.y, t.lift].forEach(function (s) { s.x = s.v = s.to = 0; });
          rest(p);
          return false;
        }
        p.style.transform = "perspective(900px) translateZ(" + (up * 14).toFixed(2) + "px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
        p.style.setProperty("--lift", Math.max(0, up).toFixed(3));
        p.style.setProperty("--px", (-ry * 1.3).toFixed(1) + "px");
        p.style.setProperty("--py", (rx * 1.3).toFixed(1) + "px");
        p.style.setProperty("--sx", (slim ? 4 : 5 + up * 3 - ry * 0.9).toFixed(1) + "px");
        p.style.setProperty("--sy", (slim ? 4 + rx * 0.4 : 6 + up * 4 + rx * 0.9).toFixed(1) + "px");
        return true;
      });
      if (live.length) requestAnimationFrame(tick); else looping = false;
    };

    panels.forEach(function (p) {
      p.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse" || fx.calm || !p.place) return;
        var r = p.parentNode.getBoundingClientRect(), d = p.place, t = tiltOf(p);
        var most = Math.max(3.4, Math.min(7.5, 1900 / d.w));  // wide panels need less
        var u = Math.max(-1, Math.min(1, ((e.clientX - r.left - d.x) / d.w - 0.5) * 2));
        var v = Math.max(-1, Math.min(1, ((e.clientY - r.top - d.y) / d.h - 0.5) * 2));
        t.y.to = u * most;
        t.x.to = -v * most;
        t.lift.to = 1;
        wake(p);
      });
      p.addEventListener("pointerleave", function () {
        var t = tiltOf(p);
        t.x.to = t.y.to = t.lift.to = 0;
      });
      p.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse") return;
        var c = fx.at(p, 1, 0), px = function (v) { return parseFloat(p.style.getPropertyValue(v)) || 0; };
        fx.kira(c.x - px("--r") - 16, c.y + px("--t") + 16, { r: 13, life: 0.6 });
      });
    });
  }

  if (page && window.matchMedia("(hover: none)").matches) {
    var fromY = scrollY, fromT = performance.now(), settle;
    addEventListener("scroll", function () {
      var now = performance.now(), dt = now - fromT;
      if (dt < 12) return;
      var speed = (scrollY - fromY) / dt;                 // px a millisecond
      fromY = scrollY;
      fromT = now;
      if (fx.calm || dt > 200) return;
      var r = page.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      panels.forEach(function (p) {
        if (p.hidden || !p.place) return;
        var top = p.parentNode.getBoundingClientRect().top + p.place.y;
        if (top > innerHeight || top + p.place.h < 0) return;
        var t = tiltOf(p);
        t.x.to = Math.max(-6, Math.min(6, speed * 3.2));
        t.lift.to = Math.min(0.7, Math.abs(speed) * 0.5);
        wake(p);
      });
      clearTimeout(settle);
      settle = setTimeout(function () { live.forEach(function (p) { var t = tiltOf(p); t.x.to = t.lift.to = 0; }); }, 90);
    }, { passive: true });
  }

  // ---- Work filters -------------------------------------------------------
  var kind = $("#filter-kind");
  if (kind && page) {
    var text = $("#filter-text"), linked = $("#filter-link");
    var count = $("#filter-count"), empty = $("#filter-empty"), list = $("#project-list");
    var projects = panels.map(function (p) {
      var el = document.getElementById(p.dataset.for);
      return {
        panel: p,
        kind: el.dataset.kind,
        linked: !!el.querySelector(".project-links"),
        words: (p.textContent + " " + el.textContent).toLowerCase().replace(/\s+/g, " ")
      };
    });
    list.setAttribute("role", "tabpanel");
    list.setAttribute("aria-label", "Projects");

    var apply = function () {
      var k = kind.value, terms = text.value.toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0, left = 0, changed = false;
      projects.forEach(function (p) {
        var ok = (k === "all" || p.kind === k) &&
          (!linked.checked || p.linked) &&
          terms.every(function (t) { return p.words.indexOf(t) !== -1; });
        if (p.panel.hidden === ok) {
          changed = true;
          if (!ok && left < 5) {                          // panels that go leave a little smoke
            var c = fx.at(p.panel), top = c.y - scrollY;
            if (top > 0 && top < innerHeight) { left++; fx.puff(c.x, c.y, { size: 15, n: 5, life: 0.6 }); }
          }
        }
        p.panel.hidden = !ok;
        if (ok) shown++;
      });
      chapters.forEach(function (c) { c.hidden = !c.querySelector(".panel:not([hidden])"); });
      if (changed) { sheets.forEach(function (s) { s.classList.add("is-moving"); }); layout(); }
      empty.hidden = shown > 0;
      count.textContent = shown === projects.length
        ? "Showing all " + shown + " projects"
        : "Showing " + shown + " of " + projects.length + " projects";
    };

    var reset = function () {
      kind.selected = 0;
      text.value = "";
      linked.checked = false;
      apply();
    };

    // input events are composed, so they reach the host from inside the control
    kind.addEventListener("change", apply);
    text.addEventListener("input", apply);
    linked.addEventListener("change", apply);
    $("#filter-clear").addEventListener("click", function () { reset(); kind.shadowRoot.querySelector("[tabindex='0']").focus(); });
    apply();
  }

  // ---- The reader: a panel opens into the whole project -----------------------
  // The address says which project is open (#kira), so links, Back and sharing all work.
  var reader = $("#reader");
  if (reader && page) {
    var shelf = $("#reader-body"), sheet = reader.querySelector(".reader-page");
    var open = null, spot = null, opener = null, steps = 0, closing = 0;

    var others = function () {
      return Array.prototype.filter.call(document.body.children, function (el) {
        return el !== reader && !/^(SCRIPT|CANVAS|SAKUGA-TOAST)$/.test(el.tagName);
      });
    };
    var put = function () {                               // back to its place in the page
      if (open && spot) spot.replaceWith(open);
      open = spot = null;
    };
    var finish = function () {
      clearTimeout(closing);
      closing = 0;
      put();
      reader.hidden = true;
      reader.classList.remove("is-closing");
    };

    var show = function (id) {
      if (closing) finish();
      var el = document.getElementById(id);
      if (!el || el === open) return;
      var fresh = !open, panel = page.querySelector('[data-for="' + id + '"]');
      if (fresh) opener = document.activeElement;
      put();
      spot = document.createComment(id);
      el.replaceWith(spot);
      open = el;
      shelf.appendChild(el);
      reader.setAttribute("aria-label", el.querySelector(".project-name").textContent);
      reader.hidden = false;
      reader.scrollTop = 0;
      if (!fresh) return;
      root.classList.add("is-reading");
      others().forEach(function (o) { o.inert = true; });
      $("#reader-close").focus();
      if (panel && !panel.hidden) {
        var c = fx.at(panel), y = c.y - scrollY;
        if (y > 0 && y < innerHeight) fx.burst(c.x, c.y, { r: Math.min(150, c.w * 0.4), spikes: 17, life: 0.4 });
      }
      fx.sfx("shu", scrollX + innerWidth / 2, scrollY + Math.min(150, innerHeight * 0.2), { size: Math.min(220, innerWidth * 0.5), life: 0.7, rot: -0.16, col: "#5a4fd8", edge: "#ffffff" });
      fx.lines(scrollX + innerWidth / 2, scrollY + innerHeight / 2, { n: 12, dir: -Math.PI / 2, len: 160, spread: innerWidth * 0.4, life: 0.4 });
    };

    var hide = function () {
      if (!open || closing) return;
      root.classList.remove("is-reading");
      others().forEach(function (o) { o.inert = false; });
      reader.classList.add("is-closing");
      fx.puff(scrollX + innerWidth / 2, scrollY + innerHeight / 2, { size: 26, n: 6, life: 0.6 });
      var id = open.id;
      closing = setTimeout(finish, fx.calm ? 0 : 170);
      var panel = page.querySelector('[data-for="' + id + '"]');
      var back = opener && opener !== document.body && opener.isConnected ? opener : panel && !panel.hidden && panel.firstElementChild;
      if (back) back.focus({ preventScroll: true });
      opener = null;
    };

    var sync = function () {
      var id = location.hash.slice(1), el = id && document.getElementById(id);
      if (el && el.classList.contains("project")) { if (!open) steps++; show(id); }
      else { steps = 0; hide(); }
    };
    var close = function () {
      if (steps > 0) { steps = 0; history.back(); }       // the hash goes, and sync() closes it
      else { history.replaceState(null, "", location.pathname + location.search); hide(); }
    };
    var turn = function (d) {
      var shown = panels.filter(function (p) { return !p.hidden; });
      if (!shown.length) shown = panels;
      var ids = shown.map(function (p) { return p.dataset.for; }), i = ids.indexOf(open && open.id);
      location.replace("#" + ids[(i + d + ids.length) % ids.length]);
    };

    addEventListener("hashchange", sync);
    $("#reader-close").addEventListener("click", close);
    $("#reader-prev").addEventListener("click", function () { turn(-1); });
    $("#reader-next").addEventListener("click", function () { turn(1); });
    reader.addEventListener("click", function (e) {
      if (e.target === reader) { close(); return; }
      var link = e.target.closest('a[href^="#"]'), el = link && document.getElementById(link.hash.slice(1));
      if (!el || !el.classList.contains("project") || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();                                 // one project to another: turn the page, so Close and Back still close
      location.replace(link.hash);
      $("#reader-close").focus();
    });
    addEventListener("keydown", function (e) {
      if (!open || closing || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") turn(1);
      else if (e.key === "ArrowLeft") turn(-1);
    });

    // arriving on a link to a project
    var arrive = function () {
      var el = location.hash && document.getElementById(location.hash.slice(1));
      if (el && el.classList.contains("project")) show(el.id);
    };
    if (root.classList.contains("is-loading")) document.addEventListener("intro:end", arrive, { once: true });
    else arrive();
  }

  // ---- Resumes ------------------------------------------------------------
  var pick = $("#resume-pick"), get = $("#resume-get");
  if (pick && get) {
    get.addEventListener("click", function () {
      download(pick.value);
      setTimeout(function () { get.done(); toast("Resume downloading"); }, fx.calm ? 0 : HIT);
    });
  }

  // ---- The note: it is written in the visitor's own email app ---------------
  var note = $("#note");
  if (note) {
    var send = note.querySelector("sakuga-button");
    note.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(note);
      var name = (data.get("name") || "").trim();
      var rating = data.get("rating");
      var body = [
        (data.get("message") || "").trim(),
        rating ? "I rate your site " + rating + " out of 5." : "",
        name
      ].filter(Boolean).join("\n\n");
      var to = $(".email-link").getAttribute("href");
      setTimeout(function () {
        toast("Opening your email app");
        location.href = to + "?subject=" + encodeURIComponent(data.get("about")) + "&body=" + encodeURIComponent(body);
      }, fx.calm ? 0 : HIT);
    });
    // Enter in a field submits, as it would in a plain form
    Array.prototype.forEach.call(note.querySelectorAll("sakuga-input"), function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.isComposing) { send.impact(); note.requestSubmit(); }
      });
    });
  }

  // ---- Small reactions for the plain links ----------------------------------
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".site-nav a, .brand, .project-links a, .link-list a, .email-link, .proof a");
    if (!a) return;
    var c = fx.at(a, 1, 0);
    fx.ticks(c.x, c.y, { dir: -1.05, n: 3, r: 5, len: 15, fan: 0.36, life: 0.5 });
  });

  // Jumping to a section lands it: streaks off its title and a little dust under it.
  each('.site-nav a[href^="#"]', function (a) {
    a.addEventListener("click", function () {
      var section = document.getElementById(a.getAttribute("href").slice(1));
      var title = section && section.querySelector(".section-title");
      if (!title) return;
      var landed = false;
      var land = function () {
        if (landed) return;
        landed = true;
        removeEventListener("scrollend", land);
        var range = document.createRange();               // the words, not the full-width heading box
        range.selectNodeContents(title);
        var r = range.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var x = r.left + scrollX, y = r.bottom + scrollY;
        fx.lines(x + r.width + 14, y - r.height / 2, { n: 6, dir: 0, len: 60, spread: 14 });
        fx.puff(x + 6, y, { size: 9, n: 4, vx: -22, vy: -8, life: 0.7 });
        fx.puff(x + r.width, y, { size: 11, n: 4, vx: 26, vy: -10, life: 0.8 });
      };
      addEventListener("scrollend", land);
      setTimeout(land, 1200);                             // no scrollend, or already there
    });
  });

  // Opening "See everything" pops its mark.
  each("details.more", function (d) {
    d.addEventListener("toggle", function () {
      var mark = d.querySelector(".toggle-mark"), c = fx.at(mark);
      if (d.open) {
        fx.ticks(c.x, c.y, { dir: -2.3, n: 4, r: 14, len: 13, fan: 0.36, life: 0.5 });
        fx.puff(c.x + 4, c.y + 10, { size: 7, n: 3, vx: 14, vy: -10, life: 0.6 });
      } else {
        fx.puff(c.x, c.y, { size: 6, n: 3, life: 0.4 });
      }
    });
  });
})();
