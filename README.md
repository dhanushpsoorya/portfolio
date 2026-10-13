# Dhanush P. Soorya — Portfolio

Personal profile and projects site for **Dhanush P. Soorya** (B.Tech CSE, Amity University Bengaluru).

**Live:** [https://dhanushpsoorya.pages.dev](https://dhanushpsoorya.pages.dev)

## What’s on the site

- Profile with real photos, education, internship, and certificates
- Four projects (unemployment analysis, resume builder, hospital booking, PDF → Excel)
- Harvard-style one-page resume (HTML + PDF download)
- Floating glass navigation dock (spotlight, magnetic links, Resume morph menu)

Only verified facts are listed. No invented dates, metrics, or stack claims.

## Stack

| Layer | Choice |
| --- | --- |
| App | Vite 7 + React 19 + TypeScript |
| Motion | Framer Motion |
| Styles | Shared `css/site.css` + Tailwind utilities (no preflight reset) |
| Hosting | Cloudflare Pages (`dhanushpsoorya`) |

The live production build is the Vite app under `web/`. Root `index.html` / `projects.html` are the earlier static HTML variants kept for reference.

## Local development

```bash
cd web
npm install
npm run dev
```

Production build (typecheck + Vite + copy static assets into `web/dist`):

```bash
cd web
npm run build
```

Serve the build:

```bash
cd web/dist
python -m http.server 8770
```

## Deploy (Cloudflare Pages)

From `web/`, with Wrangler authenticated as the Pages account that owns project `dhanushpsoorya`:

```bash
npx wrangler pages deploy dist --project-name dhanushpsoorya --branch main --commit-dirty=true
```

## Project layout

```
web/                 # Vite/React app (what Cloudflare serves)
  public/            # robots.txt, sitemap, favicon, OG image, manifest
  src/               # React pages + motion components
  scripts/           # copy-static.mjs (photos, resume, CSS into dist)
css/                 # site.css + resume.css (source of truth for chrome)
assets/              # Photos used on the live site (+ WebP variants)
resume.html          # One-page resume
resume.pdf           # Downloadable resume
docs/QA-REPORT.md    # QA audit findings and fix status
```

#GitDiagram
[![Architecture diagram of dhanushpsoorya/portfolio](https://gitdiagram.com/dhanushpsoorya/portfolio/diagram.png)](https://gitdiagram.com/dhanushpsoorya/portfolio?utm_source=readme&utm_medium=picture)

[![Architecture diagram](https://gitdiagram.com/diagram-badge.svg)](https://gitdiagram.com/dhanushpsoorya/portfolio?utm_source=readme&utm_medium=badge)

## QA

Full audit and remediation notes: [docs/QA-REPORT.md](docs/QA-REPORT.md).

All P1–P3 items from the 13 Oct 2026 audit were fixed and redeployed before this README.

## Contact

- Email: [dhanush.soorya@s.amity.edu](mailto:dhanush.soorya@s.amity.edu) · [dhanushpsoorya@gmail.com](mailto:dhanushpsoorya@gmail.com)
- LinkedIn: [linkedin.com/in/dhanush-p-soorya-100808298](https://www.linkedin.com/in/dhanush-p-soorya-100808298/)
- GitHub: [github.com/dhanushpsoorya](https://github.com/dhanushpsoorya)
