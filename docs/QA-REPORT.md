# QA audit report — dhanushpsoorya.pages.dev

| Field | Value |
| --- | --- |
| Target | https://dhanushpsoorya.pages.dev |
| Framework | Vite 7 + React 19 + Framer Motion |
| Host | Cloudflare Pages (`dhanushpsoorya`) |
| Audit date | 13 October 2026 |
| Remediation | 13–14 October 2026 |
| Status | **All 12 logged defects fixed and verified in production** |

This report supersedes `QA Audit Report.pdf` for current status.

---

## 1. Overall quality scores

### Before remediation (13 Oct 2026)

| Area | Score |
| --- | --- |
| Functionality | 7.5 / 10 |
| Visual quality | 6.5 / 10 |
| Performance | 6.0 / 10 |
| Accessibility | 5.5 / 10 |
| SEO / metadata | 3.5 / 10 |

### After remediation (14 Oct 2026)

| Area | Score | Notes |
| --- | --- | --- |
| Functionality | **9.0 / 10** | Pretty URLs; external links safe; Resume menu touch/keyboard OK |
| Visual quality | **8.5 / 10** | Mobile nav clearance; resume reflow; overflow clipped |
| Performance | **8.0 / 10** | Hero WebP + srcset; lazy below-fold images |
| Accessibility | **8.5 / 10** | Focus rings; contrast; inert submenu; skip link |
| SEO / metadata | **9.0 / 10** | robots, sitemap, favicon, OG/Twitter, canonical, JSON-LD |

---

## 2. Defect log and fix status

| ID | Category | Sev | Finding | Status | What was fixed |
| --- | --- | --- | --- | --- | --- |
| **BUG-01** | SEO | P1 | `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, manifests returned homepage HTML | **Fixed** | Real files in `web/public/` (copied to `dist`). Production returns `text/plain`, `application/xml`, icon, and manifest JSON. |
| **BUG-02** | Responsiveness | P1 | Projects page at 375px: wrapped glass dock overlapped “Four separate pieces.” | **Fixed** | `--nav-offset` + larger mobile `page-intro` padding; nav link `min-height: 44px`. |
| **BUG-03** | Responsiveness | P1 | Resume HTML had `width: 8.5in` → ~817px horizontal scroll on phones | **Fixed** | `.page { width: 100%; max-width: 8.5in; }` + mobile toolbar wrap in `css/resume.css`. |
| **BUG-04** | SEO | P2 | Missing Open Graph, Twitter Card, canonical; resume had no description | **Fixed** | Meta tags on `web/index.html`, `web/projects.html`, `resume.html`; `og-image.jpg` (1200×630). |
| **BUG-05** | Functional | P2 | Nav used `*.html` → Cloudflare 308 to pretty URLs | **Fixed** | Links use `/`, `/projects`, `/resume`, `/#facts`, `/#contact`. |
| **BUG-06** | Accessibility | P2 | External links missing `target="_blank"` + `rel="noopener noreferrer"` | **Fixed** | Coursera, LinkedIn, GitHub (MagneticLink + plain anchors). |
| **BUG-07** | Accessibility | P2 | Weak focus rings; closed Resume items still tabbable | **Fixed** | `:focus-visible` outlines; `inert` + `tabIndex={-1}` when closed; click/outside/Esc for touch. |
| **BUG-08** | Accessibility | P2 | Grey labels ~3.34:1 on black (fail AA) | **Fixed** | `--grey` → `#a8a39b` (~6.87:1). Sage kept for accents/borders only. |
| **BUG-09** | Performance | P2 | ~596 KB hero JPEG; no WebP/srcset; eager below-fold images | **Fixed** | Hero WebP 800w/1600w + `fetchPriority="high"`; film/portrait/certificate/project images `loading="lazy"`. |
| **BUG-10** | Responsiveness | P2 | Nav tap targets ~19–24px tall on mobile | **Fixed** | Mobile nav/wordmark/pill `min-height: 44px` and extra padding. |
| **BUG-11** | Visual | P3 | Resume menu was hover-first; weak touch open/close | **Fixed** | First pill click opens menu; outside pointer + Escape close. |
| **BUG-12** | SEO | P3 | No JSON-LD / apple-touch-icon | **Fixed** | Person JSON-LD on home; `apple-touch-icon.png`, `favicon.svg`, `site.webmanifest`. |

---

## 3. Production verification (post-fix)

Probed against https://dhanushpsoorya.pages.dev after deploy:

| Path | Result |
| --- | --- |
| `/robots.txt` | 200 `text/plain` — contains `User-agent` + Sitemap |
| `/sitemap.xml` | 200 XML — urlset with `/`, `/projects`, `/resume`, `/resume.pdf` |
| `/favicon.ico` | 200 image icon (not HTML) |
| `/og-image.jpg` | 200 JPEG |
| `/site.webmanifest` | 200 `application/manifest+json` |
| `/` | 200 HTML with `og:title` |
| `/projects` | 200 |
| `/resume` | 200 |

Viewports checked during remediation: 375, 768, 1280, 1440 (Edge headless + local `web/dist`).

---

## 4. Out of scope / N/A

| Area | Result |
| --- | --- |
| Contact / newsletter forms | N/A — none on the site |
| Dark/light theme toggle | N/A — single dark theme |
| Hamburger drawer | Not added; wrapped dock + offset used instead |
| Safari / Firefox matrix | Edge Chromium measured; WebKit `backdrop-filter` recommended as a quick follow-up |

---

## 5. Key code locations

| Fix | Primary files |
| --- | --- |
| SEO assets | `web/public/*` |
| Meta / JSON-LD | `web/index.html`, `web/projects.html`, `resume.html` |
| Nav / Resume dock | `web/src/components/SiteChrome.tsx` |
| External + magnetic links | `web/src/components/HeroMotion.tsx` |
| Contrast, focus, mobile nav | `css/site.css` |
| Resume overflow | `css/resume.css` |
| Image pipeline | `web/src/pages/HomePage.tsx`, `HeroMotion.tsx`, `assets/*.webp` |
| Dist copy | `web/scripts/copy-static.mjs` |

---

## 6. Residual recommendations (non-blocking)

1. Optional dedicated mobile hamburger if the dock wrap grows further.
2. Compress project cover PNGs to WebP if Lighthouse still flags them.
3. Spot-check glass dock `backdrop-filter` on Safari iOS.
4. Keep `QA Audit Report.pdf` as a historical artifact only; use this markdown file for current truth.
