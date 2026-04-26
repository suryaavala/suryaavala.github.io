# DESIGN_SPEC.md — v2 (Claude Design Variant)

**Document Owner:** Staff Software Engineer / TPM

**Project:** `suryaavala.com` v2.1 (Personal Architecture Platform — Editorial + Bento dual-variant)

**Target Audience:** CTOs, Executive Recruiters, Peer Researchers, Staff Engineers

**Status:** DRAFT — supersedes the visual / UX layers of [01_design.md](01_design.md)

**Source:** Claude Design handoff bundle at [specs/design/suryaavala-com/](design/suryaavala-com/) — `index.html`, `styles.css`, `home-safe.css`, `home-bold.css`, `pages.css`, `app.js`, `data.js`, `Design System.html`. Pixel-perfect parity with the bundle's HTML/CSS prototypes is the acceptance criterion for §3 and §4.

**Relationship to v1:** This document **inherits unchanged** the system architecture (§2), accessibility / SEO / CSP cross-cutting concerns (§5), and data integrity / Zod schema (§6) from [01_design.md](01_design.md), with the small typed-data deltas explicitly called out in §6.x. It **replaces** the visual language (§3.1), component library (§3.2), homepage Bento logic (§4.1), and per-page chrome of v1 with the Claude Design vocabulary.

---

## 1. Context & Scope

### 1.1 Background

Identical positioning to [01_design.md §1.1](01_design.md): Surya Avala — Principal AI Systems Architect, Staff ML Engineer, Engineering Leader. The "Full-Stack Regulated Convergence (Math + Agents + Scale + Security)" thesis is unchanged.

What changes here is **how** that thesis is expressed in the browser. Two parallel hero modes are now in scope:

- **Safe · Bento** — the v1-faithful 4×N grid, expanded to 9 semantic nodes with sparklines and a build-computed "By the Numbers" card.
- **Bold · Editorial** — an editorial typographic hero (clamp 48–108px italic gradient title), a flipping status board, a terminal-styled sidebar, a borderless 4-up KPI strip, and three section blocks below the fold.

Both variants serve the same data, the same audiences, and the same eight-second scanning promise. The variant switch lives in a developer-facing **Tweaks panel** (§3.5) and is persisted to `localStorage`. Default is `safe` for first-time visitors.

### 1.2 Goals

- **Visual parity with the handoff bundle.** The Astro implementation must match [specs/design/suryaavala-com/project/index.html](design/suryaavala-com/project/index.html) and its imports at the level of layout grids, token values, easing curves, hover transitions, and animation cadence. Recreate; do not reinterpret.
- **Maximum performance** (Lighthouse 100/100, all four pillars), inherited from v1.
- **Frictionless authoring** (Local MDX), inherited from v1.
- **Identity-preserving theming** — six brand-accent swatches and a light/dark theme toggle. Both must persist across navigations and survive a hard reload.

### 1.3 Non-Goals

Inherits all non-goals from [01_design.md §1.3](01_design.md). Additionally:

- **NO design-system CSS framework lock-in.** The Claude design is hand-authored CSS with custom properties, `color-mix(in oklab, …)`, and OKLAB blends. Tailwind is retained for utility classes (§2.1), but the canonical visual contract is the token set in §3.1 — consumed via Tailwind's `theme.extend` and via per-component `<style>` blocks. Do not rewrite the Claude CSS into utility-only Tailwind; that loses the OKLAB blends and the named-pseudo cascades the bundle relies on.
- **NO third hero variant.** Two variants only. If a third is requested, it gets its own RFC.

---

## 2. System Architecture

### 2.1 Tech Stack

Identical to [01_design.md §2.1](01_design.md), with one styling-engine clarification:

- **Core Framework (Routing & SSG):** `Astro` (v4+).
- **Interactive Components (Islands):** `Svelte`.
- **Styling Engine:** `Tailwind CSS` for utility classes, **layered over** a hand-authored token sheet (`/src/styles/tokens.css`) and per-component `<style>` blocks. Tokens from §3.1 are exposed both as CSS custom properties (for `color-mix`, OKLAB blends, gradient stops) and as Tailwind theme extensions (for `bg-brand`, `text-impact`, etc.). Per-component CSS — hero card, status board, KPI strip, terminal sidebar, contact modal, radar — is lifted verbatim from the handoff bundle and re-scoped to Astro components.
- **Content Pipeline:** Local `MDX` (Markdown + embedded Svelte components).
- **Package Manager:** `npm` with strict lockfile enforcement (`npm ci` in CI).

### 2.2 Data Flow & Infrastructure

Unchanged from [01_design.md §2.2](01_design.md). Source of truth in `/src/content/notes/` and `/src/data/`; GitHub Actions → `gh-pages` → GitHub Pages → Cloudflare proxy with Full/Strict TLS, edge cache, and DDoS protection. `CNAME` file in `public/`.

The Claude bundle's `data.js` is a **client-side mirror** of the typed-data modules; in production these are the same TypeScript modules in `/src/data/` (§6.2), imported at build-time and rendered into static HTML — no runtime fetch.

---

## 3. UX/UI Specification

### 3.1 Visual Language (Design Tokens)

Authoritative token sheet — copy verbatim into `/src/styles/tokens.css`. These values are lifted from [styles.css](design/suryaavala-com/project/styles.css) and confirmed against [Design System.html](design/suryaavala-com/project/Design%20System.html).

```css
:root {
  /* Type */
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, 'SF Mono', Menlo, monospace;

  /* Dark — primary theme */
  --bg: #0d1117; /* GitHub Dark base */
  --bg-2: #11161d;
  --surface: #161b22;
  --surface-2: #1b2129;
  --surface-3: #21262d;
  --border: #30363d;
  --border-soft: #222830;
  --text: #f8f8f2; /* Dracula foreground */
  --text-2: #c9d1d9;
  --text-muted: #7a8bc0;
  --text-faint: #4e5872;

  /* Dracula accents */
  --brand: #bd93f9; /* purple */
  --brand-body: #c4a0ff; /* AA on dark for body-size purple */
  --status: #50fa7b; /* green */
  --infra: #8be9fd; /* cyan */
  --impact: #ffb86c; /* orange */
  --human: #ff79c6; /* pink */
  --stack: #f1fa8c; /* yellow */
  --danger: #ff5555; /* red */

  /* Radii */
  --radius-sm: 6px;
  --radius: 10px;
  --radius-lg: 14px;

  /* Motion */
  --easing: cubic-bezier(0.2, 0.7, 0.2, 1);
  --shadow-glow: 0 0 0 1px rgba(189, 147, 249, 0.12), 0 24px 60px -30px rgba(189, 147, 249, 0.35);
}

:root.light {
  /* WCAG AA-tuned light palette — DEEPER accents than v1's brightened variants */
  --bg: #f6f7f9;
  --bg-2: #eceff4;
  --surface: #ffffff;
  --surface-2: #f1f3f7;
  --surface-3: #e6eaf0;
  --border: #c8d0db; /* stronger separation against #fff surfaces */
  --border-soft: #dde2ea;
  --text: #0b1220;
  --text-2: #1f2937;
  --text-muted: #3b475a; /* AA ≥7:1 on bg/surface */
  --text-faint: #6b7280; /* AA ≥4.5:1 on surface */

  --brand: #5b21b6; /* deeper purple — AA on white */
  --brand-body: #5b21b6;
  --status: #0f6b34;
  --infra: #075e7a;
  --impact: #9a3412;
  --human: #9d174d;
  --stack: #854d0e;
  --danger: #9b1c1c;

  --shadow-glow: 0 0 0 1px rgba(91, 33, 182, 0.14), 0 20px 40px -20px rgba(91, 33, 182, 0.28);
}
```

**Typography deltas vs v1:**

- Mono family is **`JetBrains Mono`** (not Fira Code). Fira Code remains as a fallback only.
- Inter is loaded with weights `400;500;600;700` and the OpenType features `cv02 cv03 cv04 cv11 ss01` enabled at the `<html>` level (matching the Claude bundle's `font-feature-settings`).

**Background ambient layer:** A fixed full-viewport CSS grid pattern (`64px × 64px` lines at `color-mix(in oklab, var(--border) 50%, transparent)`) masked with a top-anchored radial fade. Opacity `0.35` in dark mode, `0.55` in light mode. Painted via `body::before`. Pure CSS, zero JS, zero asset weight.

**WCAG note:** Light-mode accents above are intentionally darker than v1's brightened token set — these are tuned to pass AA against the `#ffffff` surface used for cards, not just the `#f6f7f9` page background. Dark-mode contrast claims from [01_design.md §3.1](01_design.md) carry over unchanged.

### 3.2 Component Library

Components below are the Claude vocabulary. Each is implemented as either a server-rendered Astro component (no JS) or a Svelte Island (interactive). Pixel parity targets the noted source files in [specs/design/suryaavala-com/project/](design/suryaavala-com/project/).

| Component                                                            | Astro / Svelte                 | Source CSS                                                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Glass Nav** (sticky, `backdrop-filter: blur(16px) saturate(160%)`) | Astro                          | `styles.css` `.nav`                                       | Mono `~/suryaavala.com` brand, slash-prefixed mono links (`/architecture`, `/runtime`, …), gradient underline `linear-gradient(90deg, var(--brand), var(--infra))` on `.active`. Hides `.cta-btn` below 1024px (status board carries it on mobile).                                                                                                                                                                                                        |
| **Brand Mark Logo**                                                  | Astro                          | `.brand-mark .logo`                                       | 28×28 rounded square, `linear-gradient(135deg, var(--brand), var(--human))`, bg-coloured "SA" glyph.                                                                                                                                                                                                                                                                                                                                                       |
| **Theme Toggle**                                                     | Svelte                         | `styles.css` `.icon-btn`                                  | Sun/moon SVG swap. Persists to `localStorage["sa-theme"]`. Inline pre-FOUC script applies the saved class on `<html>` before paint (lift verbatim from [index.html:15-21](design/suryaavala-com/project/index.html)).                                                                                                                                                                                                                                      |
| **CTA Pill** ("Open to Work")                                        | Astro                          | `.cta-btn`                                                | Border + bg `var(--surface)`, 8px pulsing dot in `var(--status)` with 2s `ease-in-out` ring animation.                                                                                                                                                                                                                                                                                                                                                     |
| **Bento Grid (Safe variant)**                                        | Astro                          | `home-safe.css` `.bento`                                  | `grid-template-columns: repeat(4, minmax(0,1fr))`, `grid-auto-rows: minmax(200px, auto)`, `gap: 16px`. Per-card spans listed in §4.1.A.                                                                                                                                                                                                                                                                                                                    |
| **Hero Card (Safe)**                                                 | Astro + Svelte typing island   | `.hero-card`, `.hero-name`, `.hero-type`, `.hero-tagline` | Two radial gradients overlay `var(--surface)`. Name with gradient-clipped first word (`background-clip: text`, `linear-gradient(90deg, var(--brand), var(--human))`). Italic mono tagline left-bordered with `2px solid var(--brand)`.                                                                                                                                                                                                                     |
| **Typing Hero**                                                      | Svelte Island                  | `.hero-type .cursor`                                      | Cycles `D.hero.phrases`. `Fira Code → JetBrains Mono`, color `var(--brand-body)`. Char-add cadence ~55ms, char-delete ~30ms, end-of-word pause 1400ms. Cursor: 2px-wide block with `blink 1s steps(2)`.                                                                                                                                                                                                                                                    |
| **Metric (Bento Impact card)**                                       | Astro + Svelte count-up island | `.metric`, `.metric-value`, `.spark`                      | 32px mono value in `var(--impact)` with mini-arrow `direction`, descriptive `label`, cyan `metric-ctx` (sourced from `metric.context`), faint `metric-method` (sourced from `metric.method`), 22px-tall inline SVG sparkline (`stroke: var(--impact)`, `opacity: 0.55`). Sparkline path computed from `metric.spark: number[]` via §3.6 helper. Count-up triggered by `IntersectionObserver` on first scroll-into-view; `aria-live="polite"` for SR.       |
| **Status Beacon**                                                    | Astro                          | `.status-beacon`                                          | 10px green dot, 3px ring, 2s `pulse` keyframe.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Status Board (Bold variant)**                                      | Svelte Island                  | `home-bold.css` `.status-board`                           | Horizontal bar: pulsing LED · `Open to Work` · location flipper · separator · role flipper · primary CTA. Two flippers run independently — location (4.2s interval, 1.8s delay), role (3.2s interval, 1.2s delay). Items rotate via `transform: translateY(60%) rotateX(-70deg) → translateY(0) rotateX(0)` with 0.42s `cubic-bezier(0.5, 0, 0.2, 1)`. The CTA opens the Contact Modal (§3.2 row below). All animations gated by `prefers-reduced-motion`. |
| **Editorial Title (Bold)**                                           | Astro                          | `.bold-title`                                             | `font-family: var(--font-sans)`, `font-size: clamp(48px, 8vw, 108px)`, weight 500, `letter-spacing: -0.04em`, `line-height: 0.92`. Italicised `<em>` segment uses gradient-clipped text `linear-gradient(90deg, var(--brand) 0%, var(--human) 55%, var(--impact) 100%)`. Mono sub-headline at `0.35em`.                                                                                                                                                    |
| **Terminal Sidebar (Bold hero)**                                     | Astro                          | `.terminal`, `.term-bar`, `.term-body`                    | Card with macOS traffic-light dots, mono prompt lines, JSON-syntax-coloured output (`.k` cyan / `.s` yellow / `.v` orange). Static — no JS.                                                                                                                                                                                                                                                                                                                |
| **KPI Strip (Bold)**                                                 | Astro + count-up               | `.kpi-strip`, `.kpi`                                      | Borderless 4-up `display: grid` with internal soft borders. Big mono number with directional arrow + unit, label, ctx. Per-cell accent class `k-impact`/`k-status`/`k-infra`/`k-human` colours the number.                                                                                                                                                                                                                                                 |
| **Featured / Latest Badge**                                          | Astro                          | `.card-badge.featured`, `.card-badge.latest`              | Absolute-positioned mono chip top-right; orange for Featured, cyan for Latest.                                                                                                                                                                                                                                                                                                                                                                             |
| **Card with Accent Hover**                                           | Astro                          | `.card`, `.card--brand`, `.card--status`, …               | Each card variant lifts a colour-mix shadow + border on hover: `box-shadow: 0 0 0 1px color-mix(in oklab, var(--accent) 30%, transparent), 0 20px 40px -20px color-mix(in oklab, var(--accent) 45%, transparent)`.                                                                                                                                                                                                                                         |
| **Pill** (`.pill` + `.pill-{accent}`)                                | Astro                          | `styles.css` `.pill`                                      | `font-family: var(--font-mono)`, 11.5px, color-mix accent border. Used everywhere tags appear.                                                                                                                                                                                                                                                                                                                                                             |
| **Rainbow HR**                                                       | Astro                          | `.rainbow-hr`                                             | 2px-tall `<hr>` with full Dracula gradient `linear-gradient(90deg, var(--danger), var(--impact), var(--stack), var(--status), var(--infra), var(--brand), var(--human))`, opacity 0.7. Used inside the Safe hero card.                                                                                                                                                                                                                                     |
| **Mission Slab (Bold §3)**                                           | Astro                          | `home-bold.css` `.mission-slab`                           | Pink-tinted gradient surface, two-column layout: oversized mono glyph quote on the left, italic blockquote + mono `<cite>` on the right. Collapses to one column ≤ 700px.                                                                                                                                                                                                                                                                                  |
| **Section Header** (`.sec-head`)                                     | Astro                          | `home-bold.css` `.sec-head`                               | Numbered eyebrow (`01 /`, `02 /`, `03 /`) in mono muted colour, 22–30px clamp section title, dashed soft underline. Used between Bold-variant sections.                                                                                                                                                                                                                                                                                                    |
| **Timeline Entry** (`/runtime`)                                      | Astro                          | `pages.css` `.timeline`, `.tl-entry`                      | Vertical gradient line `linear-gradient(to bottom, var(--brand), var(--infra), var(--human))` at 0.5 opacity. Per-entry node colour driven by `data-accent`. 4-up metric grid per role with dashed-bordered detail row. Two-column tech / leadership lists.                                                                                                                                                                                                |
| **Project Card** (`/architecture`)                                   | Astro                          | `.proj`                                                   | Mono title, hover lifts 2px and switches border to `var(--brand)`, accent-coloured pill row.                                                                                                                                                                                                                                                                                                                                                               |
| **Stack Category** + **Radar Chart** (`/stack`)                      | Astro + Svelte radar island    | `pages.css` `.stack-page`, `.radar-wrap`                  | Two-column desktop layout `1.1fr 1fr`. Categories left, sticky radar right. Radar = inline SVG (§3.4) with hover tooltips bound to dot circles.                                                                                                                                                                                                                                                                                                            |
| **Note Row** (`/notes`)                                              | Astro                          | `.note`                                                   | 3-column grid (date · body · `read →`). Hover lifts border to `var(--brand)`, translates `+2px` on X. Mono `∫ KaTeX` tag if `frontmatter.requiresMath`.                                                                                                                                                                                                                                                                                                    |
| **Shield Row + Contact Card** (`/ping`)                              | Astro                          | `pages.css` `.shield`, `.contact`                         | README-style shields in a wrap row at hero foot; below, a 3-up grid of cards with channel-specific `c-{accent}` modifier — left 3px accent ribbon, accent-tinted handle, channel-coloured hover glow. SVG glyphs (GitHub, LinkedIn, Gmail, Firefox, Coffee, Sponsor) lifted from [app.js:516-528](design/suryaavala-com/project/app.js).                                                                                                                   |
| **Traceroute Block** (`/ping` foot)                                  | Astro                          | `.ping-fun`                                               | Dashed-border block with diagonal `repeating-linear-gradient` brand-tinted background. Three mono rows: `1 github.com … 1.2ms`, `2 linkedin.com … 2.4ms`, `3 inbox … ~24h`. Editorial easter egg, zero JS.                                                                                                                                                                                                                                                 |
| **Contact Modal**                                                    | Svelte Island                  | `home-bold.css` `.contact-modal`, `.cm-*`                 | Centred 580px panel with backdrop blur + brand-tinted radial wash. Pop-in `cm-pop-in 0.28s` keyframe. Six rows, each: hotkey chip (G/L/E/W/C/S) · channel name + handle · SLA + action arrow. Esc closes. Hotkeys jump to channel. Focus is moved to first row on open and restored on close. `body.is-modal-open` locks scroll.                                                                                                                           |
| **Tweaks Panel**                                                     | Svelte Island                  | `styles.css` `.tweaks`                                    | Fixed bottom-right, 260px wide. Two controls: **Homepage variant** segmented toggle (Safe · Bold), **Brand accent** swatch row (Purple / Cyan / Green / Orange / Pink). Persists to `localStorage["sa-home-variant"]` and `localStorage["sa-accent"]`. Visible only when `parent.postMessage({type: "__activate_edit_mode"})` is received from the dev harness — production users see no tweaks panel. (See §3.5.)                                         |
| **Page Transition**                                                  | CSS                            | `styles.css` `.page`                                      | `page-in 0.45s var(--easing) both`: from `opacity:0; translateY(8px); filter: blur(4px)` → `opacity:1; translateY(0); filter: blur(0)`. Re-triggered after each route change by removing/re-adding the class and forcing a reflow (`void container.offsetWidth`).                                                                                                                                                                                          |

### 3.3 Site Map (Multi-Page Routing)

Six routes — same as v1.

1. **`/` (Home)** — Two variants (Safe Bento, Bold Editorial) selected by the Tweaks panel; default Safe.
2. **`/architecture`** — Domain-grouped projects; OSS upstream block at anchor `#oss`.
3. **`/runtime`** — Vertical timeline, 7 roles, accent-coloured nodes.
4. **`/stack`** — Two-column layout: 7 stack categories + sticky radar chart.
5. **`/notes`** — MDX list with category and KaTeX/Shiki support.
6. **`/ping`** — Shields row + 6 contact cards + traceroute block.

> **Audience routing intent (analytics-only, no personalisation):** unchanged from [01_design.md §3.3](01_design.md).

The Claude bundle uses an SPA hash router for prototyping (`location.hash`, `render()` rebuilds `#page`); the Astro implementation **must** ship one HTML file per route — no client-side router. Keep the same URL shapes but drop the leading `#`. The Tweaks panel and Contact Modal continue to mount globally on every page.

### 3.4 Radar Chart (Inline SVG, Svelte Island)

Located on `/stack`, sticky in the right column at desktop ≥1000px. Identical mathematical shape to [01_design.md §4.4](01_design.md), but with the Claude colour treatment:

- `viewBox="0 0 340 340"`, radius `120`, centred at `(170, 170)`.
- Five concentric rings at `pct ∈ {20, 40, 60, 80, 100}`, stroked `var(--border-soft)` with `opacity: 0.6 - i*0.08`.
- Axis lines stroked `var(--border)`.
- Filled data polygon: `fill="var(--brand)"` at `fill-opacity="0.28"`, `stroke="var(--brand)"` `stroke-width="1.8"`, `stroke-linejoin="round"`.
- Per-axis dot: `circle r="4.5"` filled `var(--stack)` (yellow), stroked `var(--bg)` 2px to punch out from the polygon.
- Axis labels: `<text fill="var(--infra)" font-family="var(--font-mono)" font-size="10">`, anchored `start | end | middle` based on `Math.cos(a)` quadrant.
- Hover tooltip: floats inside `#radar-container`, mono 11.5px, brand-bordered, displays `<b>{label}</b> <span class="score">{score}/100</span> <br>{method}` (the `method` field — see §6.x note on the v1→v2 field rename). Position tracked via `mouseenter` + `mousemove` listeners on each dot.

Reference implementation in [app.js:453-489](design/suryaavala-com/project/app.js) (`radarSVG(axes)` and `initRadar()`). Self-assessment methodology footnote (§4.4) carries over unchanged.

### 3.5 Tweaks Panel — variant + accent swap

The Tweaks panel is **a developer affordance**, not a user-facing feature. It must be:

1. **Hidden by default** in production. The panel only opens on receipt of a `parent.postMessage({type: "__activate_edit_mode"})` event — used by Claude Design's hosted preview iframe. In production hosting (`suryaavala.com` on GH Pages via Cloudflare), this message never arrives, so the panel never appears.
2. **State-only persistence.** Selecting `Bold` variant writes `localStorage["sa-home-variant"] = "bold"`; on next page render, the home route reads this and renders the Bold template instead of Safe. Selecting an accent swatch writes `localStorage["sa-accent"]` and immediately mutates `--brand` and `--brand-body` on `:root.style`.
3. **Five accent presets** with the following `(brand, brand-body)` pairs (lifted from [app.js:34-40](design/suryaavala-com/project/app.js)):

   | Key      | `--brand` | `--brand-body` |
   | -------- | --------- | -------------- |
   | `purple` | `#bd93f9` | `#c4a0ff`      |
   | `cyan`   | `#8be9fd` | `#b4f0ff`      |
   | `green`  | `#50fa7b` | `#7effa0`      |
   | `orange` | `#ffb86c` | `#ffce99`      |
   | `pink`   | `#ff79c6` | `#ffa2d6`      |

4. **Defaults** stored under `EDITMODE-BEGIN ... EDITMODE-END` markers in source (so the Claude editor can rewrite them): `{"variant": "safe", "accent": "purple"}`.

If the user wants an end-user-facing accent picker post-launch, it gets a separate RFC and a UI surface that is not the dev tweaks panel.

### 3.6 Helpers & Animation Primitives

Centralise in `/src/lib/`:

- **`sparkPath(values, w=120, h=22)`** — returns an SVG `path d` string for a min-max-normalised polyline. Reference: [app.js:103-112](design/suryaavala-com/project/app.js).
- **`animateCountUp(el, target, duration=1400)`** — `IntersectionObserver`-driven cubic ease-out, formatted decimals based on magnitude. Reference: [app.js:77-100](design/suryaavala-com/project/app.js).
- **`startTyping(el, phrases)`** — typewriter effect with 55/30 ms cadence and 1400 ms pause. Reference: [app.js:56-74](design/suryaavala-com/project/app.js).
- **`initRoleFlip()`** — manages flipboard rotation for the bold-hero status board. Reference: [app.js:633-665](design/suryaavala-com/project/app.js).
- **`pingLogo(name)`** — returns one of the six channel SVG glyphs. Reference: [app.js:516-528](design/suryaavala-com/project/app.js).

Every animation listed above must be wrapped in a `@media (prefers-reduced-motion: reduce)` guard that disables transform/opacity transitions while still flipping state — never hide content from users with motion sensitivity.

---

## 4. Detailed Design

### 4.1 Homepage Logic — TWO variants

The homepage is rendered by `pageHome()` which dispatches to `homeSafe()` or `homeBold()` based on `localStorage["sa-home-variant"]` (default `safe`). The header shell, footer, nav, and Contact Modal mount around either variant identically.

#### 4.1.A — Safe Bento (default)

The Bento grid is **9 semantic nodes** (one more than v1), arranged in a 4-column desktop grid that reflects signal hierarchy: enterprise platform work and quantified metrics get the largest spans. The new node — "By the Numbers" — surfaces _build-time computed_ totals (number of distinct industries, number of roles, number of measured metrics, number of upstream PRs), giving the grid completeness without inventing claims.

```
┌─────────────────────────────────────────────────┐
│                  hero (span 4)                  │
├─────────────┬─────────────┬─────────┬───────────┤
│             │             │ status  │  numbers  │
│   impact    │   impact    ├─────────┴───────────┤
│  (2x2 grid  │  cont.)     │      agentic        │
│             │             │      (span 2)       │
├─────────────┴─────────────┼─────────┬───────────┤
│         lead              │ infra-hl│    oss    │
│        (span 2)           │         │           │
├───────────────────────────┴─────────┴───────────┤
│                 beyond (span 2)                 │
└─────────────────────────────────────────────────┘
```

| #   | Card                  | Source                   | Span              | Accent | Notes                                                                                                                                                                                                                                                                         |
| --- | --------------------- | ------------------------ | ----------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**              | `hero-card .hero`        | `span 4`          | brand  | Mono `~/whoami → surya` prompt eyebrow, `<h1>` with gradient-clipped first word, typing line, italic mono tagline, hero-sub, industries row, stack-pill row, rainbow `<hr>` foot.                                                                                             |
| 2   | **Impact Cluster**    | `impact-card .impact`    | `span 2 × span 2` | impact | 6 metrics in a 2-column inner grid. Each metric: count-up value + dir + unit, label, mono cyan `metric-ctx`, faint `metric-method`, 22px sparkline.                                                                                                                           |
| 3   | **Status**            | `status-card .status`    | `span 1`          | status | Beacon, primary copy, mono "last verified" footer, link to `/ping`.                                                                                                                                                                                                           |
| 4   | **By the Numbers**    | `nums .numbers`          | `span 1`          | human  | `<dl>` with `decade`, `industries shipped` (`new Set(D.experiences.map(e => e.industry)).size`), `shipped roles` (`D.experiences.length`), `measured outcomes` (`D.metrics.length`), `upstream PRs` (`D.upstream.length`). Foot: `computed at build · not a marketing claim`. |
| 5   | **Agentic Highlight** | `agentic .feature-card`  | `span 2`          | infra  | `Featured` badge. The featured project (`projects.find(p => p.badge === "Featured")` → `scaling-succotash`). Cyan eyebrow `⬢ Agentic · Prod`, mono mark `›`, infra pill row.                                                                                                  |
| 6   | **Infra Highlight**   | `infra-hl .feature-card` | `span 1`          | infra  | `Latest` badge. The latest project (`projects.find(p => p.badge === "Latest")` → `traffic_counter`).                                                                                                                                                                          |
| 7   | **OSS Upstream**      | `oss-card .oss`          | `span 1`          | status | Top-5 PRs from `D.upstream`, mono list, status-coloured arrows. Foot count: `5 merged PRs across MLOps + data infra`.                                                                                                                                                         |
| 8   | **Leadership**        | `lead`                   | `span 2`          | impact | `⌘ Technical Leadership` eyebrow, `Staff+ signal` heading, RFC + ML Guild + Build vs Buy copy, hire/mentor quote.                                                                                                                                                             |
| 9   | **Beyond Code**       | `beyond`                 | `span 2`          | human  | `♁ Beyond Code` eyebrow, `Equitable outcomes` heading, mission line including `🥐 Pastry Enthusiast`.                                                                                                                                                                         |

Reference: [app.js:119-215](design/suryaavala-com/project/app.js) (`homeSafe()`).

**Mobile collapse:** Below 1000px, `bento` becomes 2 columns (`hero/impact/agentic/lead/beyond` each `span 2`). Below 680px, a single column (`> *` becomes `span 1`). The `<details>` "Show more" toggle from v1 is **dropped** in this variant — the editorial weight is carried by the Bold variant for users who want a longer-form story.

#### 4.1.B — Bold Editorial

```
┌─────────────────────────────┬───────────────┐
│   ┌──────────────────────┐  │               │
│   │   status-board       │  │   terminal    │
│   ├──────────────────────┤  │   (whoami     │
│   │  bold-title          │  │    --verbose) │
│   │  (clamp 48-108px)    │  │               │
│   ├──────────────────────┤  │               │
│   │  bold-lede           │  │               │
│   ├──────────────────────┤  │               │
│   │  CTA primary + ghost │  │               │
│   └──────────────────────┘  │               │
└─────────────────────────────┴───────────────┘
┌──────┬──────┬──────┬──────────────────────────┐
│ KPI  │ KPI  │ KPI  │     KPI                  │
└──────┴──────┴──────┴──────────────────────────┘

§01 Featured work    [feat-row: featured | latest]
§02 Upstream signal  [oss-list: 5 rows]
§03 Beyond code      [mission-slab]
```

- **Hero grid:** `1.6fr 1fr` two-column, 48px gap, 48px top / 64px bottom padding. Collapses to single column ≤1000px.
- **Status Board** (top-left of left column): described in §3.2; takes `bold-meta` slot.
- **Bold Title:** `clamp(48px, 8vw, 108px)`, weight 500, italic gradient `<em>`, mono `<span class="sub">` sub-line at `0.35em`.
- **Bold Lede:** 19px, max-width 620px, `text-wrap: pretty`. Bold inline strongs land in `var(--text)`.
- **CTAs:** `.btn-primary` (filled brand bg, bg-coloured text) → `/architecture`; `.btn-ghost` → `/ping`.
- **Terminal Sidebar:** macOS chrome (red/yellow/green dots), mono content, three command blocks with JSON-coloured output (`whoami --verbose`, `cat impact.json | jq .top`, blinking prompt).
- **KPI Strip:** Borderless 4-up `grid-template-columns: repeat(4, 1fr)` inside a single bordered card. Internal soft borders `border-right: 1px solid var(--border-soft)`. Picks `D.metrics[0..3]` and assigns accents `[impact, status, infra, human]` in order. Below 900px: 2 columns. Below 540px: 1 column.
- **Sections (`§01–§03`):** numbered `sec-head` titles, dashed soft underline, content row beneath:
  - **§01 Featured work** — 2:1 grid (featured | latest), reusing `.feature-card`.
  - **§02 Upstream signal** — vertical list of 5 `.oss-row` rows, mono, status-coloured PR numbers.
  - **§03 Beyond code** — `.mission-slab`: pink-tinted gradient card with oversized mono glyph quote on the left, italic blockquote + uppercase mono `<cite>` on the right.

Reference: [app.js:217-351](design/suryaavala-com/project/app.js) (`homeBold()`).

### 4.2 Architecture (`/architecture`)

- `page-head` with mono `/architecture` eyebrow, `<h1>` with brand-coloured `<span class="accent">` for "architectural domain".
- Projects grouped by `Project.domain`, rendered as `.proj` cards in a 3-column grid (2 col ≤1000px, 1 col ≤680px).
- OSS section pinned at `#oss` anchor with status-coloured heading and 5 `.oss-row` entries linking to GitHub PRs in new tabs.
- Domain order (deterministic): `GenAI & Agentic Systems → Systems & Infrastructure → ML & Data Science → Data Engineering & Tooling → Enterprise ML & Document Intelligence`.
- Reference: [app.js:353-389](design/suryaavala-com/project/app.js).

The "Full Catalogue" `<details>` table from [01_design.md §4.2](01_design.md) is retained and rendered below the OSS section — no Claude-design loss here.

### 4.3 Runtime (`/runtime`)

Vertical timeline driven by `D.experiences`:

- `<h1>` reads "The career, as <span class="accent">uptime</span>." — playing on the `/runtime` route name.
- Sub: `Seven roles. Four regulated industries. Measured outcomes per role — not just titles.`
- Each `.tl-entry`: company headline, role + industry pill, period (mono right-aligned), 4-up `tl-metrics` grid (each metric shows value, label, dashed-bordered detail), two-column `tl-cols` for tech and leadership lists.
- Per-entry node colour driven by `data-accent` (`brand | status | infra | human | impact | stack`) — controls the dot ring at `tl-entry::before`.
- Vertical line: `linear-gradient(to bottom, var(--brand), var(--infra), var(--human))` at 0.5 opacity.
- Reference: [app.js:391-424](design/suryaavala-com/project/app.js).
- **Per-role metric count varies** (Montu carries 4, Linktree/Eliiza 2, Amber/ANZ/nib/HammondCare 1). The `tl-metrics` grid is `grid-template-columns: repeat(4, 1fr)` and gracefully fills 1–4 cells; ≤800px it collapses to 2 columns. No padding cells — empty space stays empty.
- **Sub-line accuracy:** the page sub reads "Seven roles. Five regulated industries." — sourced from `aggregates.roleCount` and `aggregates.industryCount` (§6.y), **not** hard-coded. The unique industry set across `D.experiences` is `{Healthcare, Energy, Consumer Tech, Finance, Consulting} = 5`. The Claude prototype's hard-coded "Four regulated industries." string in [app.js:396](design/suryaavala-com/project/app.js) is a **prototype bug** and is corrected in this spec to match the build-time aggregate, mirroring the same fix applied to the "By the Numbers" Bento card in commit `9ab9d9e`.

**GitHub Streak Widget:** Continues to live at the **footer** of `/runtime` per [01_design.md §4.3](01_design.md), with the same CSP allowlist for `streak-stats.demolab.com`.

### 4.4 Stack (`/stack`)

Two-column desktop layout (`1.1fr 1fr`):

- **Left:** 7 stack categories from `D.stackCategories`, each: square-bullet mono heading colour-keyed to category accent, then a wrap row of accent-tinted pills.
- **Right (sticky `top: 80px`):** Radar chart inside `.radar-wrap`, with an evidence footnote in mono muted: _"Scores reflect production execution breadth across 10+ years — not academic certification."_
- Reference: [app.js:426-489](design/suryaavala-com/project/app.js).

Stack category list and competency scores are sourced from `D.stackCategories` and `D.competency` in `data.js` (see §6.x for the typed-data delta from v1).

### 4.5 Notes (`/notes`)

- `<h1>`: "Long-form, <span class="accent">practitioner-anchored</span>."
- `.note` rows in a vertical list: 3-col grid `120px 1fr auto` (date · body · `read →`).
- Body: 18px sans heading, 14px sans description, meta row with mono brand-coloured `› {category}`, infra pills for tags, and `∫ KaTeX` mono yellow tag if `frontmatter.requiresMath`.
- Hover lifts border to `var(--brand)` and translates `+2px X`.
- Reference: [app.js:491-514](design/suryaavala-com/project/app.js).

MDX content pipeline (remark-math, rehype-katex, Shiki) inherited verbatim from [01_design.md §4.5](01_design.md).

### 4.6 Ping (`/ping`)

Three vertical sections:

1. **Hero + Shields row** — `page-head` followed by `ping-shields`: 6 inline `<a class="shield shield-{accent}">` chips, each with an inline SVG channel logo and a mono uppercase label (`follow`, `connect`, `get in touch`, `read`, `caffeinate`, `sponsor`).
2. **Contact Grid** — section eyebrow `$ cat channels.md // 6 endpoints · 1 human`, then a 3-up grid (2-up ≤900px, 1-up ≤600px) of `.contact c-{accent}` cards. Each card: 3px left accent ribbon, 34×34 logo block, mono channel name eyebrow, big handle in accent colour, dashed-bordered foot with SLA + `↗`. Hover lifts `-3px Y`, switches border + shadow to channel accent.
3. **Stack badges row** — section eyebrow `$ stack --badges`, followed by a flat row of 12 `.stack-badge` chips (Python · TypeScript · Kubernetes · Terraform · PyTorch · GCP · AWS · Kafka · Airflow · Kubeflow · Datadog · LangChain), each on `#282a36` background with a per-chip accent dot. The Claude prototype renders these with empty `<i></i>` placeholder dots ([app.js:586](design/suryaavala-com/project/app.js)) — `pingLogo()` only ships the 6 contact-channel glyphs ([app.js:516-528](design/suryaavala-com/project/app.js)). **v2 must extend `pingLogo()` (or introduce a parallel `stackLogo()`) with the 12 stack glyphs** so the chips read as proper README-style shields rather than coloured dots. Each glyph rendered at 14×14, `currentColor`, in the chip-accent token.
4. **Traceroute easter egg** — `.ping-fun` block (dashed border, diagonal-stripe brand-tinted bg) rendering three mono rows — `1 github.com … 1.2ms`, `2 linkedin.com … 2.4ms`, `3 inbox … ~24h business day SLA`.

Reference: [app.js:530-596](design/suryaavala-com/project/app.js).

The full five-channel matrix from [01_design.md §4.6](01_design.md) is preserved; this version adds a sixth channel (Website / `firefox` icon) and re-frames the channels as a "ping → response" latency story.

### 4.7 Contact Modal (overlay, mounts globally)

Triggered by **any** element with `data-open-contact` (in v2 that is the Bold-hero status board CTA, but additional triggers can be added without changing the modal). Closed by:

- the `.cm-close` button,
- clicking the `.cm-backdrop`,
- pressing `Esc`,
- navigating to a different route.

Hotkeys when open: `G | L | E | W | C | S` open the corresponding channel in a new tab (or `window.location.href` for `mailto:`).

Accessibility:

- `role="dialog" aria-modal="true" aria-labelledby="contact-modal-title"`.
- On open, `_cmLastFocus` saves `document.activeElement` and focus moves to the first row; on close, focus is restored.
- `body.is-modal-open` locks scroll.

Reference: [app.js:734-817](design/suryaavala-com/project/app.js), [home-bold.css:438-662](design/suryaavala-com/project/home-bold.css), [index.html:84-102](design/suryaavala-com/project/index.html).

---

## 5. Cross-Cutting Concerns

Inherits §5 of [01_design.md](01_design.md) verbatim — accessibility, SEO, JSON-LD Person schema, Open Graph, CSP. Three small additions specific to v2:

### 5.1 Accessibility (additions)

- **Reduced motion:** Required guards on the typing animation, count-up, status-board flippers, page-in transition, status beacon pulse, modal pop-in, sparkline reveal, and CTA pulse. The Claude bundle's `@media (prefers-reduced-motion: reduce)` block in [styles.css:118-124](design/suryaavala-com/project/styles.css) is the baseline; per-component overrides in [home-bold.css:151-155](design/suryaavala-com/project/home-bold.css) extend it.
- **Focus-visible:** `outline: 2px solid var(--brand); outline-offset: 2px; border-radius: 3px` on every focusable element. Already token-driven, but must survive any utility-class override.
- **Modal trap:** The Contact Modal must trap focus within `.cm-panel` while open and restore on close. The Claude prototype implements focus restoration but **not** focus trap — this is a v2 must-fix in the Astro implementation.

### 5.2 CSP

CSP from [01_design.md §5.2](01_design.md) carries over. The `font-src` allowlist already covers `https://fonts.gstatic.com`; the v2 typography additions (Inter italic weights for the Bold title, JetBrains Mono) come from the same origin. No new CSP changes required.

### 5.3 SEO

`<title>` and `<meta description>` lifted from [index.html:6-7](design/suryaavala-com/project/index.html):

- Title: `Surya Avala — Staff ML Engineer & Principal AI Systems Architect`
- Description: `A decade of making ML systems survive production in healthcare and energy — where the plumbing matters more than the model.`

JSON-LD Person schema unchanged from [01_design.md §5.2](01_design.md).

---

## 6. Data Integrity & Schema

Inherits the Zod-validated Content Collections (§6.1), typed data modules (§6.2), drift detection (§6.3), and build-time validation (§6.4) from [01_design.md](01_design.md). The deltas are listed below — additive only; no breaking changes to v1 schemas.

### 6.x Typed-Data Deltas vs v1

To support the new sparklines, Bold-variant KPI strip, status-board flipper, and contact modal, three typed shapes pick up small additions. Bumping the Zod schema in `/src/data/schemas.ts` is the single point of change.

```typescript
// Metric — additive: unit + spark for inline sparkline rendering
export interface Metric {
  value: string;
  direction: '↑' | '↓' | '=' | ''; // '=' for "Prod"-style status metrics, '' for none
  unit: string; // NEW — e.g. "%", "+", "x", ""
  label: string;
  context: string;
  methodology?: string;
  confidenceBound?: ConfidenceBound;
  accent: string;
  spark?: number[]; // NEW — 5–9 normalised values for sparkPath()
}

// Project — accent renamed to align with token names
export interface Project {
  slug: string;
  title: string;
  description: string;
  domain:
    | 'GenAI & Agentic Systems'
    | 'Systems & Infrastructure'
    | 'ML & Data Science'
    | 'Data Engineering & Tooling'
    | 'Enterprise ML & Document Intelligence';
  repoUrl: string;
  tags: string[];
  accent: 'brand' | 'status' | 'infra' | 'impact' | 'human' | 'stack'; // NEW — token key, not hex
  featured: boolean;
  badge?: 'Featured' | 'Latest'; // RENAMED from badgeLabel for parity with data.js
}

// Contact — new module, mirrors D.contacts in the Claude bundle
export interface Contact {
  channel: string; // e.g. "GitHub"
  handle: string; // e.g. "@suryaavala"
  label: string; // mono CTA — e.g. "follow", "connect"
  url: string; // https:// or mailto:
  accent: 'brand' | 'status' | 'infra' | 'impact' | 'human' | 'stack';
  logo: 'github' | 'linkedin' | 'gmail' | 'firefox' | 'coffee' | 'sponsor';
  sla: string; // e.g. "replies < 24h"
}

// HeroPhrases — new module, drives the typing island
export interface HeroConfig {
  name: string;
  prompt: string; // e.g. "~/whoami → surya"
  headlineSafe: string; // displayed in Safe variant
  headlineBold: string; // displayed in Bold variant
  subhead: string;
  tagline: string;
  phrases: string[]; // typing cycle
  industries: string[];
  stack: { label: string; accent: 'brand' | 'status' | 'infra' | 'impact' | 'human' | 'stack' }[];
}

// CompetencyAxis — unchanged from v1; methodology stays required (≥10 chars)

// StackCategory — new module, drives /stack left column
export interface StackCategory {
  name: string;
  accent: 'brand' | 'status' | 'infra' | 'impact' | 'human' | 'stack';
  items: string[];
}
```

Corresponding Zod additions:

```typescript
const accentEnum = z.enum(['brand', 'status', 'infra', 'impact', 'human', 'stack']);

export const MetricSchema = z.object({
  value: z.string().min(1),
  direction: z.enum(['↑', '↓', '=', '']),
  unit: z.string(),
  label: z.string().min(10),
  context: z.string().min(5),
  methodology: z.string().min(10).optional(),
  confidenceBound: ConfidenceBoundSchema.optional(),
  accent: accentEnum,
  spark: z.array(z.number()).min(5).max(9).optional()
});

export const ContactSchema = z.object({
  channel: z.string().min(1),
  handle: z.string().min(1),
  label: z.string().min(1),
  url: z
    .string()
    .refine(
      (s) => s.startsWith('http') || s.startsWith('mailto:'),
      'url must be http(s) or mailto'
    ),
  accent: accentEnum,
  logo: z.enum(['github', 'linkedin', 'gmail', 'firefox', 'coffee', 'sponsor']),
  sla: z.string().min(3)
});

export const StackCategorySchema = z.object({
  name: z.string().min(1),
  accent: accentEnum,
  items: z.array(z.string().min(1)).min(1)
});

// HeroConfigSchema, ProjectSchema, ExperienceSchema → trivial Zod equivalents
```

Two notes on the rename / shape changes:

1. **`Project.accent` is now a token key, not a hex.** This decouples projects from the brand-accent swap (§3.5). When the user picks `cyan` as their brand accent, `--brand` flips to `#8be9fd`, and any project with `accent: 'brand'` re-tints automatically. Hard-coded hexes would silently fight the swap.
2. **`Project.badgeLabel` → `Project.badge`** for parity with [data.js:220-237](design/suryaavala-com/project/data.js). The v1 field is renamed in a single migration commit; CI validation catches any stragglers.

Build-time validation hook (`/scripts/validate-data.ts`) and `prebuild` npm hook are unchanged from [01_design.md §6.4](01_design.md).

### 6.y Build-Time Computed Aggregates

The "By the Numbers" Bento card (§4.1.A row 4) and the `/runtime` "Seven roles. Four regulated industries." sub-line are both **build-time computed** from the typed data, not hard-coded:

```typescript
// /src/lib/aggregates.ts
import { experiences } from '../data/experiences';
import { metrics } from '../data/metrics';
import { upstream } from '../data/upstream';

export const aggregates = {
  decadeYears: 10, // hard-coded; review annually
  industryCount: new Set(experiences.map((e) => e.industry)).size,
  roleCount: experiences.length,
  metricCount: metrics.length,
  upstreamPRCount: upstream.length
} as const;
```

Each consumer (`homeSafe.astro` for the Bento card, `runtime.astro` for the sub-line) imports `aggregates` and renders the value. CI's existing `lastVerified` staleness check (§6.3) catches stale `decadeYears` once a year — when the date drift exceeds threshold, the lint warning surfaces it.

---

## 7. Open Questions / Risks

- **[RESOLVED]** Two homepage variants vs one: ship both, gate behind dev-only Tweaks panel. Production users land on `safe` by default; users who want the editorial pitch can be linked directly to `/?variant=bold` (a small URL-param hook reads the param once on first paint and writes it to localStorage). See §3.5.
- **[RESOLVED]** Tailwind vs hand-authored CSS: layered approach — Tailwind for utilities, hand-authored CSS for tokens, animations, OKLAB blends, and component shells. See §2.1.
- **[RESOLVED]** Mono font swap (Fira Code → JetBrains Mono): JetBrains Mono is the Claude bundle's choice. Adopt it; keep Fira Code as fallback for offline / fontless contexts.
- **[RESOLVED]** Project `accent` schema (hex vs token key): token key. Keeps the brand-swap honest. See §6.x.
- **[OPEN]** End-user accent picker: the Tweaks panel is dev-only. If we want users to pick a personal accent, it needs (a) a discoverable UI surface in the nav or footer, (b) a query-param fallback for direct linking, (c) an analytics decision on whether per-user accents should affect the OG image. Decision deferred to post-launch RFC.
- **[OPEN]** Mobile Bold variant: the editorial typography (`clamp(48px, 8vw, 108px)`) is striking on desktop but reads heavy on phones. Tablet/mobile breakpoints in [home-bold.css](design/suryaavala-com/project/home-bold.css) handle layout collapse, but we should validate the "wow" reads on a phone before defaulting any cohort to Bold.
- **[OPEN]** Contact modal vs inline `/ping`: with the modal, fewer users will navigate to `/ping`, which weakens the analytics signal for "who reached out". If we care about funnel attribution, add an event hook on each modal channel click before launch.
