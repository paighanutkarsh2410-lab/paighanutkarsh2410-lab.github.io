# Utkarsh Paighan — portfolio

Personal site for Utkarsh Paighan, Site Reliability & DevOps Engineer.
Live at https://paighanutkarsh2410-lab.github.io

The opening, *Uptime*, follows one line: your own request to this page (measured in your
browser), then a real Pitwall GameDay, the Kafka broker killed mid-race, the page, the
recovery, and finally the four projects running as healthy services. Every number comes
from the projects' own write-ups. The decisions behind it are in [docs/BRIEF.md](docs/BRIEF.md).

- Plain HTML, CSS and JavaScript: no build step. `index.html`, `assets/site.css`,
  `assets/site.js`.
- Motion: GSAP 3.15.1 with ScrollTrigger, and Lenis 1.3.27, vendored in `assets/vendor`.
- Respects `prefers-reduced-motion`: the whole story laid out still.
- `?jump=<scrollY>` opens the page settled at that position, and `window.__ready` is set once
  it is ready (for screenshots and tests).
- Deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

```bash
npx serve .    # or any static server, then open http://localhost:3000
```

The earlier version of this site (Next.js, on Dillion Verma's open-source template) is in the
Git history.

## Licences
The site's own code is MIT (see `LICENSE`). Vendored libraries keep theirs: GSAP under the
GSAP Standard License, Lenis under MIT. Fonts (Instrument Serif, Geist, Geist Mono) are loaded
from Google Fonts under the SIL Open Font License. The GitHub and LinkedIn marks belong to
their owners.
