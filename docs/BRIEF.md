# Uptime — build brief

The decisions for Utkarsh Paighan's portfolio, kept here so they survive a long build.

## The person
Utkarsh Paighan · Site Reliability / DevOps Engineer · B.Tech CSE 2026 (CGPA 8.81), Nagpur.
Audience: recruiters (30 seconds) and engineering managers (click into projects).
Name, role and the résumé button stay in the fixed header from the first frame.

## Concept: Uptime (chosen 26 Nov 2026; Lane A, pure code)
One line carried through the whole opening:
1. **Request** — the visitor's own page load, measured live (time to first byte from the
   Navigation Timing API; the GitHub Pages edge from the `x-served-by` header, e.g. BOM =
   Mumbai). Shown only when measured; never a made-up number.
2. **Live** — the line becomes Pitwall's live stream (events moving along it).
3. **Fault** — the real broker-kill GameDay (docs/scale-and-chaos.md in pitwall):
   broker gone about 90 s; `PitwallLinkDown` paged as designed.
4. **Recovery** — the broker returned; the uplink re-sent what wasn't confirmed; ingest
   dropped 20 duplicates and the projectors 6 (26); nothing lost; browsers fresh again 50 s
   after it came back. Every service reconnected on its own.
5. **Services** — the line settles; four project cards come up as running services.

The trace is a schematic of that run's freshness, drawn from the documented events. No
numbers on its axes: only the documented ones appear, as labels.

Then: projects in depth (Pitwall, Launchbay, Dishpatch, SentryAI), experience and
education, résumé download, contact (email, GitHub, LinkedIn).

## Art direction
- Monochrome, exact, one red moment. Grafana-like restraint, no glowing-mesh cyber look.
- Colours: bg #0a0b0c · panel #111316 · ink #ecebe6 · dim #8b8f96 · faint #50555c ·
  incident red #ff4a3d · healthy green #46d68c (status only).
- Type: Instrument Serif (display, the human voice) · Geist (body/UI) · Geist Mono (data).
- Mark: a status pill, "● UP": the dot is the site's own health — green, red in the fault,
  green again. "UP" is his initials.
- Header status readout: ALL SYSTEMS NORMAL → INCIDENT → RECOVERED, with a T+ clock.

## Do not
- Narrate the mechanic (no "scroll", "as you scroll", camera words). Run copy-gate.js.
- Invent metrics. Every number comes from the pitwall docs, the READMEs, or the visitor's
  own measurement.
- Hide the hiring facts behind the animation.
- Ship without prefers-reduced-motion (static, fully drawn trace, everything visible).

## Mechanics
- Vendored: gsap 3.15.1 (+ScrollTrigger), lenis 1.3.27 in assets/vendor.
- Dev contract: ?jump=<scrollY> lands settled; window.__ready = true when ready.
- Fonts from Google Fonts. Published to GitHub Pages from the repo
  paighanutkarsh2410-lab.github.io (replaces the Next.js site; old one stays in history).
