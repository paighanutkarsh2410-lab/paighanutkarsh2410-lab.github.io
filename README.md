# Utkarsh Paighan — portfolio

Personal site for Utkarsh Paighan, Site Reliability & DevOps Engineer.
Live at https://paighanutkarsh2410-lab.github.io

- All content lives in [`src/data/resume.tsx`](src/data/resume.tsx).
- Static export (`output: "export"`) deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

```bash
npm install
npm run dev          # http://localhost:3000
npx next build --webpack   # static site in ./out
```

Built on the open-source [portfolio template by Dillion Verma](https://github.com/dillionverma/portfolio) (MIT — see `LICENSE`), with Next.js, shadcn/ui and Magic UI. Tool icons from [Simple Icons](https://simpleicons.org) (CC0).
