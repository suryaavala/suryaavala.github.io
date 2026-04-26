# suryaavala.com

> **Principal AI Systems Architect & Staff ML Engineer** — a data-dense, zero-JS-default personal architecture platform targeting top-tier ML / Infra leadership roles (VP AI Platform, Principal Architect, Staff Engineer).

Built as a single static site on **Astro v4 + Svelte islands + MDX + Tailwind (Dracula + GitHub-Paper themes)**, deployed to GitHub Pages via the `gh-pages` branch. Every page targets **Lighthouse 100/100/100/100** with a strict **≤ 15 KB gz** client-JS budget and full **WCAG 2.1 AA** compliance.

The source of truth for the design is [`specs/01_design.md`](./specs/01_design.md) (568 lines, status `APPROVED FOR IMPLEMENTATION`). Implementation deviations are tracked in the PR description at `specs/prs/pr-11-v2-bento-platform.md`.

---

## Stack

| Layer        | Choice                                 |
| ------------ | -------------------------------------- |
| SSG / Router | Astro v4.16                            |
| Islands      | Svelte 4 via `@astrojs/svelte`         |
| Styling      | Tailwind v3 with `darkMode: 'class'`   |
| Content      | MDX via `@astrojs/mdx`                 |
| Math         | `remark-math` + `rehype-katex`         |
| Syntax       | Shiki (`github-dark-dimmed`, SSR-only) |
| Schemas      | Zod (build-time data gate)             |
| Unit tests   | Vitest                                 |
| E2E + a11y   | Playwright + `@axe-core/playwright`    |
| Perf gate    | `@lhci/cli` with budget assertions     |
| Visual       | Playwright `toHaveScreenshot`          |
| Link audit   | lychee                                 |
| Size budget  | size-limit                             |
| OG images    | satori + resvg                         |

Node version is pinned in `.nvmrc` (`20.12.2`). Every dependency is **exact-pinned** (no `^`, no `~`, no ranges); the pre-commit hook `scripts/check-dep-pinning.mjs` rejects drift.

---

## Quick start

```bash
nvm use                  # respects .nvmrc
make install             # npm ci
make dev                 # http://localhost:4321
```

The main developer-facing entrypoint is the [`Makefile`](./Makefile). Run `make help` for the full target list.

| Target             | What it does                                                          |
| ------------------ | --------------------------------------------------------------------- |
| `make install`     | `npm ci` (use this, never `npm install` — drifts the lockfile)        |
| `make dev`         | Astro dev server on `:4321`                                           |
| `make build`       | Production build into `dist/` (runs Zod validation + staleness audit) |
| `make preview`     | Preview the `dist/` bundle on `:4321`                                 |
| `make test`        | Vitest unit + Playwright e2e                                          |
| `make test-unit`   | Vitest (single run)                                                   |
| `make test-e2e`    | Playwright (e2e + a11y + visual regression)                           |
| `make lint`        | `prettier --check` + ESLint + `astro check`                           |
| `make check`       | Zod data validation + lastVerified staleness audit                    |
| `make lighthouse`  | Run Lighthouse CI with all budget assertions                          |
| `make size`        | Enforce the 15 KB gz JS budget on `dist/_astro/*.js`                  |
| `make verify`      | Full local mirror of the CI gate set (what CI runs, in order)         |
| `make generate-og` | Rebuild the default OG image (`public/og/og-default.svg`)             |
| `make clean`       | Remove `dist/`, `.astro/`, playwright report, etc.                    |

Pre-commit hooks live in [`.pre-commit-config.yaml`](./.pre-commit-config.yaml); install once with `pre-commit install` and they'll fire on every commit.

---

## Project layout

```
.
├── astro.config.mjs           — Astro + integrations config (MDX, Svelte, Tailwind, sitemap)
├── tailwind.config.mjs        — Dracula + Paper design tokens (CSS vars)
├── playwright.config.ts       — 3 browsers × 3 viewports
├── lighthouserc.json          — LHCI budget assertions (cat ≥ 100, LCP < 2.5s, CLS < 0.1, TBT < 200ms)
├── src/
│   ├── components/            — .astro components + /islands/*.svelte
│   ├── content/notes/         — MDX long-form articles (Zod-validated frontmatter)
│   ├── data/                  — metrics, experiences, projects, competency, stack (+ schemas.ts)
│   ├── layouts/               — BaseLayout (FOUC-safe theme script, JSON-LD) + NoteLayout
│   ├── pages/                 — 6 primary routes + /rss.xml.ts + 404.astro
│   └── styles/                — fonts.css (self-hosted Inter + Fira Code) + global.css
├── public/
│   ├── fonts/                 — variable WOFF2s (Inter, Fira Code, KaTeX)
│   ├── og/                    — build-time-rendered OG images
│   ├── CNAME                  — www.suryaavala.com
│   ├── robots.txt
│   └── manifest.webmanifest
├── scripts/                   — validate-data, check-staleness, check-dep-pinning, generate-og
├── tests/
│   ├── unit/                  — Vitest (Zod schemas, utils, JSON-LD shape)
│   └── e2e/                   — Playwright (homepage, nav, theme, a11y, notes, visual)
└── specs/
    ├── 01_design.md           — design spec (authoritative)
    ├── prs/                   — untracked PR descriptions
    └── reviews/               — untracked Mentor reviews
```

---

## Design decisions worth flagging

These are the non-obvious ones — the rest follow the spec verbatim.

1. **FOUC-safe theme toggle.** `BaseLayout.astro` ships an inline `<script is:inline>` in `<head>` that reads `localStorage.theme` and sets `.dark` on `<html>` **before first paint**. `ThemeToggle.svelte` is the only island loaded with `client:load`; every other island uses `client:visible` or `client:idle`.
2. **LCP discipline.** `TypingHero` renders the initial headline as static HTML; the Svelte island (`client:idle`) only animates _subsequent_ phrases. The LCP element is never JS-dependent.
3. **MetricCounter never regresses.** The final metric value is pre-rendered in the DOM so the Lighthouse crawler and no-JS users see truth; animation runs on `IntersectionObserver` and counts **up** to the already-rendered value. Tested via `homepage.spec.ts` against the raw DOM.
4. **Conditional KaTeX CSS.** `NoteLayout.astro` inspects `entry.data.requiresMath`; if `true`, emits `<link rel="stylesheet" href="/katex.min.css">`, else skips. Homepage and non-math notes pay zero KaTeX cost (~25 KB gz saved). Verified by `tests/e2e/notes.spec.ts`.
5. **Self-hosted fonts.** Inter + Fira Code as variable WOFF2 in `/public/fonts/`, `font-display: optional`. No `fonts.gstatic.com` call — simpler CSP, faster paint, deterministic offline dev.
6. **Strict exact-version pinning.** `.npmrc` sets `save-exact=true`. Pre-commit hook `scripts/check-dep-pinning.mjs` runs `semver.valid()` on every dependency entry and rejects any range (`^`, `~`, `>=`, `x - y`, or a tag). Dependabot uses `versioning-strategy: increase` to bump exact pins in lockstep.
7. **Signal-hierarchy mobile layout.** Below 768px the Bento collapses to a single column with the top-4 cards above the fold and `<details>` for the rest. Spec §4.1.

---

## Deployment

### GitHub Pages

`main` → CI → `gh-pages` branch → [`www.suryaavala.com`](https://www.suryaavala.com).

The deploy job in `.github/workflows/ci.yml` gates on _every_ upstream job (lint, type-check, unit tests, build, e2e across 3 browsers, Lighthouse CI, link check, size-limit). The site never ships if any of them fail.

### Cloudflare Transform Rule — CSP and security headers

GitHub Pages cannot set HTTP headers, so the Content Security Policy is emitted via `<meta http-equiv="Content-Security-Policy">` from `BaseLayout.astro`. That works but is weaker than an HTTP-header CSP (no protection for the HTML response itself).

For production hardening, add the following **Cloudflare Transform Rule** (_Rules → Transform Rules → Modify Response Header_) once the domain is behind Cloudflare:

```
Rule name:        Static security headers
If:               (http.host eq "www.suryaavala.com")
Then — Set static:
  Content-Security-Policy:   default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://streak-stats.demolab.com; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
  Referrer-Policy:           strict-origin-when-cross-origin
  Permissions-Policy:        accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()
  X-Content-Type-Options:    nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

This step is **documented, not automated** — it requires Cloudflare dashboard access.

---

## Content: `/notes`

`/notes` is a long-form MDX blog. Each post is a `.mdx` file in `src/content/notes/` with Zod-validated frontmatter (`src/content/config.ts`). Math posts set `requiresMath: true` in their frontmatter to trigger the conditional KaTeX CSS path.

```yaml
---
title: 'Hidden technical debt in ML systems'
description: 'A first-principles take on the Sculley et al. 2015 paper...'
publishDate: 2026-03-14
category: 'Distributed Systems'
tags: ['mlops', 'platform', 'tech-debt']
requiresMath: true
commercialContext: 'Montu — 67% lead-time reduction'
---
```

RSS is auto-generated at `/rss.xml`.

---

## License

Code: [MIT](./LICENSE). Prose in `/src/content/notes/` and spec docs: CC-BY 4.0 (attribution appreciated).
