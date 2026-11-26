/* Uptime: one line, from the visitor's own request, through a real Pitwall GameDay (the Kafka
 * broker killed mid-race, the page, the recovery), to four healthy services.
 *
 * Everything in the opening is drawn from one number, p (0 to 1): how far through it the
 * visitor is. The scroll sets a target; p eases towards it every frame, so the line moves
 * smoothly whatever the input. ?jump=<scrollY> lands settled (for screenshots); window.__ready
 * is set once the page is ready.
 */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const params = new URLSearchParams(location.search);
  const JUMP = params.get("jump");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || params.has("still");
  const root = document.documentElement;
  if (still) root.classList.add("still");
  else root.classList.add("motion");
  if (JUMP !== null) history.scrollRestoration = "manual";

  // ---- The visitor's own request ----------------------------------------------------------
  // Time to first byte from the browser's own navigation timing, and the CDN edge that served
  // the page (GitHub Pages sits behind Fastly, which names its point of presence in
  // x-served-by: "cache-bom4734-BOM"). Shown only when actually measured.
  const EDGES = {
    BOM: "Mumbai", DEL: "Delhi", MAA: "Chennai", BLR: "Bengaluru", HYD: "Hyderabad", CCU: "Kolkata",
    SIN: "Singapore", HKG: "Hong Kong", NRT: "Tokyo", HND: "Tokyo", ICN: "Seoul", SYD: "Sydney", MEL: "Melbourne",
    DXB: "Dubai", FJR: "Fujairah", LHR: "London", LCY: "London", AMS: "Amsterdam", FRA: "Frankfurt", CDG: "Paris",
    MAD: "Madrid", MXP: "Milan", ARN: "Stockholm", CPH: "Copenhagen", DUB: "Dublin", IAD: "Washington",
    JFK: "New York", EWR: "New York", BOS: "Boston", ORD: "Chicago", ATL: "Atlanta", DFW: "Dallas",
    LAX: "Los Angeles", SJC: "San Jose", SEA: "Seattle", YYZ: "Toronto", GRU: "São Paulo", JNB: "Johannesburg",
  };
  async function measure() {
    const nav = performance.getEntriesByType("navigation")[0];
    const ms = nav && nav.responseStart > 0 ? Math.round(nav.responseStart - nav.startTime) : null;
    let edge = null;
    try {
      const r = await fetch(`${location.pathname}?edge=${Date.now()}`, { method: "HEAD", cache: "no-store" });
      const served = r.headers.get("x-served-by");
      const code = served && served.trim().split(/[\s,]+/).pop().split("-").pop();
      if (code && /^[A-Z]{3}$/.test(code)) edge = EDGES[code] ?? code;
    } catch {
      /* offline or blocked: say only what was measured */
    }
    if (ms == null && !edge) return;
    const parts = [];
    if (ms != null) parts.push(ms <= 1 ? "This page reached you instantly" : `This page reached you in ${ms} ms`);
    if (edge) parts.push(`${ms != null ? "from" : "Served from"} the ${edge} edge`);
    $(".measure__text").textContent = `${parts.join(" ")}.`;
    $(".measure").hidden = false;
  }
  measure();

  // ---- The line -------------------------------------------------------------------------
  // A schematic of the GameDay run's freshness at the browser: steady and fresh; a gap while
  // the broker was gone (no data); a spike as the backlog arrived; back to fresh. Lower is
  // fresher. No values on its axes: the documented numbers are told in words.
  const BASE = 452;
  const KILL = 560;
  const BACK = 800;
  const FRESH = 1000;
  const wobble = (x) => Math.sin(x * 0.031) * 3 + Math.sin(x * 0.113 + 1.7) * 2 + Math.sin(x * 0.007) * 4;
  const yAt = (x) => {
    if (x <= KILL) return BASE + wobble(x);
    if (x < BACK) return BASE;
    if (x < BACK + 26) return BASE - (BASE - 140) * ((x - BACK) / 26) ** 0.6; // the backlog lands at once
    const k = (x - BACK - 26) / (FRESH - BACK - 26);
    const settle = BASE + wobble(x) * Math.min(1, Math.max(0, (x - FRESH) / 120));
    return k < 1 ? 140 + (BASE - 140) * (1 - Math.exp(-4.2 * k)) / (1 - Math.exp(-4.2)) : settle;
  };
  const pathOf = (from, to) => {
    let d = "";
    for (let x = from; x <= to; x += 4) d += `${d ? "L" : "M"}${x} ${yAt(x).toFixed(1)}`;
    return d;
  };
  $(".trace__live").setAttribute("d", pathOf(0, KILL));
  $(".trace__heal").setAttribute("d", `M${BACK} ${BASE}` + pathOf(BACK, 1600).replace(/^M/, "L"));
  const clip = $(".trace__clip");
  const head = $(".trace__head");
  const dots = $(".trace__dots");
  const DOTS = 9;
  for (let i = 0; i < DOTS; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", "3");
    dots.append(c);
  }

  // ---- The opening, as a function of p --------------------------------------------------------
  const ramp = (stops, p) => {
    if (p <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      const [p1, v1] = stops[i];
      const [p0, v0] = stops[i - 1];
      if (p <= p1) return v0 + ((v1 - v0) * (p - p0)) / (p1 - p0 || 1);
    }
    return stops[stops.length - 1][1];
  };
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const DRAWN = [[0, 300], [0.2, KILL], [0.22, KILL], [0.4, BACK], [0.58, 1120], [0.74, 1600]];
  const CLOCK = [[0.22, 0], [0.4, 90], [0.555, 140]];
  const bar = $(".bar");
  const statusText = $(".status__text");
  const clock = $(".status__clock");
  const beats = $$(".beat").map((el) => ({ el, a: +el.dataset.in, b: +el.dataset.peak, c: +el.dataset.out }));
  const show = (sel, on) => $$(sel).forEach((el) => (el.style.opacity = on ? 1 : 0));
  const trace = $(".trace");
  const consoleEl = $(".console");
  const cards = $$(".svc");
  const tilesEl = $(".tiles");
  const tiles = Object.fromEntries($$(".tile").map((t) => [t.dataset.tile, t]));
  /** A readout: its value, and its tone (bad, good, quiet, or plain). Written only on change. */
  const tile = (name, [value, tone = ""]) => {
    const t = tiles[name];
    if (t.dataset.value === value && (t.dataset.tone ?? "") === tone) return;
    t.dataset.value = value;
    t.dataset.tone = tone;
    t.querySelector("dd").textContent = value;
  };
  let intro = still || JUMP !== null ? 1 : 0;
  let state = "";

  function setState(next, clockText) {
    if (next !== state) {
      state = next;
      bar.dataset.state = next;
      statusText.textContent = { normal: "All systems normal", incident: "Incident · broker down", recovered: "Recovered" }[next];
    }
    clock.textContent = clockText;
  }

  function render(p, t) {
    // Beats: in, peak, out, with a small lift against the direction of travel.
    for (const { el, a, b, c } of beats) {
      let alpha = 0;
      if (p >= a && p <= c) alpha = p < b ? (p - a) / Math.max(1e-4, b - a) : 1 - (p - b) / Math.max(1e-4, c - b);
      alpha = clamp01(alpha);
      el.style.opacity = alpha.toFixed(3);
      el.style.transform = `translateY(${((1 - alpha) * (p < b ? 18 : -18)).toFixed(1)}px)`;
      el.style.visibility = alpha > 0.001 ? "visible" : "hidden";
    }
    // The line, drawn as far as the story has reached.
    const x = Math.min(ramp(DRAWN, p), 300 + (ramp(DRAWN, p) - 300) * 1) * (p < 0.001 ? intro : 1);
    clip.setAttribute("width", x.toFixed(1));
    head.setAttribute("cx", x.toFixed(1));
    head.setAttribute("cy", yAt(x).toFixed(1));
    head.style.fill = p >= 0.22 && p < 0.4 ? "var(--faint)" : "var(--ink)";
    // Events moving along it; none cross the outage while the broker is gone.
    const live = x;
    Array.from(dots.children).forEach((c, i) => {
      const dx = (t * 0.11 + (i * live) / DOTS) % Math.max(live, 1);
      const off = dx > KILL && dx < BACK;
      c.setAttribute("cx", dx.toFixed(1));
      c.setAttribute("cy", yAt(dx).toFixed(1));
      c.style.opacity = off || still ? 0 : 0.55;
    });
    const incident = p >= 0.22;
    show(".trace__mark--kill, .tl--kill, .trace__outage", incident);
    show(".tl--alert", p >= 0.26);
    show(".trace__mark--back, .tl--back", p >= 0.4);
    show(".tl--fresh", p >= 0.555);
    $(".tl--you").style.opacity = String(1 - clamp01((p - 0.06) / 0.06));
    // The hand-over: the line steps back, four services come up.
    const hand = clamp01((p - 0.74) / 0.12);
    trace.style.opacity = (1 - hand * 0.82).toFixed(3);
    trace.style.transform = `scaleY(${(1 - hand * 0.6).toFixed(3)})`;
    consoleEl.style.opacity = hand.toFixed(3);
    consoleEl.classList.toggle("live", hand > 0.6);
    tilesEl.style.opacity = (1 - hand).toFixed(3);
    tile("broker", p < 0.22 ? ["Up"] : p < 0.4 ? ["Down", "bad"] : ["Up", "good"]);
    tile("pager", p < 0.26 ? ["Quiet", "quiet"] : p < 0.555 ? ["Paged", "bad"] : ["Resolved", "good"]);
    tile("fresh", p < 0.22 ? ["~0.1 s"] : p < 0.4 ? ["No data", "quiet"] : p < 0.555 ? ["Catching up", "bad"] : ["~0.1 s", "good"]);
    cards.forEach((card, i) => {
      const k = clamp01((p - 0.75 - i * 0.02) / 0.06);
      card.style.opacity = k.toFixed(3);
      card.style.transform = `translateY(${((1 - k) * 24).toFixed(1)}px)`;
    });
    // The site's own status, in the bar.
    const secs = Math.round(ramp(CLOCK, p));
    const tplus = `T+${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    if (p < 0.22) setState("normal", "LIVE");
    else if (p < 0.555) setState("incident", tplus);
    else if (p < 0.86) setState("recovered", tplus);
    else setState("normal", "LIVE");
  }

  // ---- Reduced motion: the whole story laid out, nothing moving -------------------------
  if (still) {
    for (const { el } of beats) el.style.visibility = "visible";
    clip.setAttribute("width", "1600");
    head.setAttribute("cx", "1600");
    head.setAttribute("cy", String(yAt(1600)));
    $$(".trace__dots circle").forEach((c) => (c.style.opacity = 0));
    $$(".svc").forEach((c) => (c.style.opacity = 1));
    setState("normal", "LIVE");
    wireCommon();
    window.__ready = true;
    return;
  }

  // ---- Motion: pinned opening, smooth scroll ---------------------------------------------
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (JUMP === null) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // Pinned scenes first; everything else after (creation order is refresh order).
  let target = 0;
  const film = ScrollTrigger.create({
    trigger: ".film",
    start: "top top",
    end: () => `+=${Math.round(innerHeight * 5.2)}`,
    pin: ".stage",
    pinSpacing: true,
    onUpdate: (self) => (target = self.progress),
  });

  // Content arriving below the opening.
  const rising = $$(".section-head > *, .project__text > *, .shot, .log li, .toolbelt, .hire > *, .contact > *");
  rising.forEach((el) => el.classList.add("rise"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );
  rising.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.08}s`;
    io.observe(el);
  });

  let p = 0;
  let worst = 0;
  let last = performance.now();
  const debug = params.has("debug");
  gsap.ticker.add(() => {
    const now = performance.now();
    worst = Math.max(worst, now - last);
    last = now;
    p += (target - p) * 0.12;
    if (Math.abs(target - p) < 0.0004) p = target;
    render(p, now);
  });
  if (debug) setInterval(() => (console.log(`[jank] worst frame ${worst.toFixed(1)} ms`), (worst = 0)), 2000);

  // The line draws itself in on arrival.
  if (JUMP === null) gsap.to({ v: 0 }, { v: 1, duration: 1.4, ease: "power3.out", onUpdate() { intro = this.targets()[0].v; } });

  wireCommon(lenis);

  const ready = () => {
    ScrollTrigger.refresh();
    if (JUMP !== null) {
      window.scrollTo(0, +JUMP || 0);
      ScrollTrigger.update();
      target = p = film.progress;
      rising.forEach((el) => el.getBoundingClientRect().top < innerHeight && el.classList.add("in"));
      render(p, performance.now());
    }
    window.__ready = true;
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(ready));

  // ---- Shared: in-page links, copying the address -------------------------------------
  function wireCommon(smooth) {
    for (const a of $$('a[href^="#"]')) {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const to = id === "#top" ? 0 : $(id);
        if (to === null) return;
        e.preventDefault();
        if (smooth) smooth.scrollTo(to, { offset: id === "#top" ? 0 : -70, duration: 1.4 });
        else if (to === 0) window.scrollTo({ top: 0 });
        else to.scrollIntoView();
        history.replaceState(null, "", id === "#top" ? location.pathname : id);
      });
    }
    const copy = $(".copy");
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        copy.textContent = "Copied";
      } catch {
        copy.textContent = "Select and copy above";
      }
      setTimeout(() => (copy.textContent = "Copy address"), 1800);
    });
  }
})();
