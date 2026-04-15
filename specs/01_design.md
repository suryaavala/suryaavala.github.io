# `DESIGN_SPEC.md`

**Document Owner:** Staff Software Engineer / Technical Program Manager

**Project:** `suryaavala.com` v2.0 (Personal Architecture Platform)

**Target Persona:** Principal AI Systems Architect / Staff ML Engineer

**Status:** APPROVED FOR IMPLEMENTATION

---

## 1. Context & Scope

### 1.1 Background

Surya Avala is a Principal AI Systems Architect whose work focuses on MLOps, Data Science, and eradicating "Hidden Technical Debt in Machine Learning." Operating across highly regulated domains (Healthcare, Energy, Finance), his digital presence must reflect a deeply technical, pragmatic, and mathematically rigorous engineering ethos. This rebuild transitions the site from a generic portfolio into a high-signal, developer-native web platform.

### 1.2 Goals

- **High-Signal Conversion:** The architecture and aesthetic must serve as a Tier-1 capability document for recruiters, CTOs, and peer researchers.
- **Maximum Performance:** Achieve 100/100 Lighthouse scores across all metrics (Performance, Accessibility, Best Practices, SEO) by shipping zero JavaScript by default.
- **Frictionless Authoring:** Establish a strict "Docs-as-Code" pipeline to minimize publishing friction, allowing content updates directly from an IDE (Obsidian/VS Code).

### 1.3 Non-Goals

- **NO Single Page Application (SPA):** We are explicitly avoiding React, Next.js, and client-side routing to eliminate Virtual DOM overhead, hydration costs, and unnecessary complexity.
- **NO Headless CMS Lock-in:** We are explicitly rejecting external API dependencies (e.g., Notion API, Contentful) to prevent build-time latency, network fragility, and vendor lock-in.
- **NO Generic Layouts:** We will not use standard chronological project feeds. Content must be categorized by architectural domain.

---

## 2. System Architecture

### 2.1 Tech Stack

- **Core Framework (Routing & SSG):** `Astro`. Required for its default zero-JS output and multi-page routing architecture.
- **Interactive Components (Islands):** `Svelte`. Required for clean, compiler-based execution, minimal boilerplate, and zero Virtual DOM overhead.
- **Styling Engine:** `Tailwind CSS`. Required for utility-first maintainability and native dark/light mode class toggling.
- **Content Pipeline:** Local `MDX` (Markdown + embedded Svelte components).
- **Deployment Target:** GitHub Pages via GitHub Actions CI/CD pipeline.

### 2.2 Data Flow

The system relies on a strictly decoupled **Local-First / GitOps** pipeline:

1.  **Authoring:** Content is written locally as `.mdx` files in `/src/content/notes/` and `/src/content/architecture/`.
2.  **Version Control:** Files are committed to Git and pushed to the `main` branch.
3.  **Build Step:** GitHub Actions triggers `npm run build`. Astro parses the MDX, applies Zod schema validation, injects Svelte components, and compiles to static HTML/CSS.
4.  **Delivery:** Fully static assets are served globally via the GitHub edge network.

---

## 3. UX/UI Specification

### 3.1 Visual Language (Design Tokens)

The aesthetic is a data-dense, minimalist "Bento Grid" utilizing a strict mathematical color palette derived from Surya's terminal environment.

- **Typography:**
  - _Body/Headings:_ `Inter` (Sans-serif) - chosen for high legibility in dense paragraphs.
  - _Metadata/Code/Tags:_ `Fira Code` (Monospace) - chosen to match the native IDE environment.
- **Dark Mode (Primary Theme):**
  - Base Background: `#0d1117` (GitHub Dark)
  - Surface/Cards: `#161b22` & `#282a36`
  - Structural Borders: `#30363d`
- **Light Mode (Secondary Theme):**
  - Base Background: `#f8f9fa` ("Paper" Off-white)
  - Surface/Cards: `#ffffff`
  - Text: `#1e293b` (Slate 800)
  - Structural Borders: `#e5e7eb`
- **Semantic Accents (Dracula Palette):**
  - Primary/Brand: `#bd93f9` (Purple)
  - Status/Availability: `#50fa7b` (Green)
  - Infrastructure/OSS: `#8be9fd` (Cyan)
  - Impact Metrics: `#ffb86c` (Orange)
  - Human Element: `#ff79c6` (Pink)
  - Tech Stack Tags: `#f1fa8c` (Yellow)

### 3.2 Component Library

- **Bento Grid:** An asymmetric CSS grid (`auto-rows-[220px]`) handling varying content density (1x1, 2x1, 2x2 spans) with `group-hover` Dracula border transitions.
- **Theme Switcher:** A Svelte-powered toggle injected into the `<head>` that toggles the `.dark` class on the root element, persisting state in `localStorage`.
- **Status Beacon:** A pure CSS absolute-positioned pulsing ring (`animate-ping`) utilizing the `#50fa7b` green token.
- **Terminal Prose:** Specialized typography for `/notes` utilizing Shiki syntax highlighting for code blocks and KaTeX for mathematical rendering.

### 3.3 Site Map (Multi-Page Routing)

1.  **`/` (Home):** The Bento Grid executive summary.
2.  **`/architecture`:** Categorized deep-dive into ML pipelines, K8s infra, and open-source upstream PRs.
3.  **`/notes`:** Docs-as-code engineering blog/research space.
4.  **`/stack`:** Hardware, CLI tools, and infrastructure configurations.
5.  **`/runtime`:** Career CV timeline and publications.
6.  **`/ping`:** Minimalist plaintext contact matrix (GitHub, LinkedIn, Email).

---

## 4. Detailed Design

### 4.1 Blog Architecture (`/notes`)

- Markdown parsing is handled by Astro's built-in `remark` and `rehype`.
- Must implement `remark-math` and `rehype-katex` to support native rendering of mathematical equations (e.g., Linear Algebra, Bayesian Inference).
- MDX is required to allow injecting interactive Svelte data-visualizations directly into technical paragraphs.

### 4.2 Portfolio Logic (`/architecture`)

Projects are hardcoded data objects categorized strictly by domain (extracted from the CV), not chronologically:

1.  _GenAI & Agentic Systems_ (e.g., `scaling-succotash`, `openclaude`)
2.  _Systems & Infrastructure_ (e.g., `zen_search`, `traffic_counter`)
3.  _ML & Data Science_ (e.g., `suncorp`, `stockprediction`)
4.  _Data Engineering & Tooling_ (e.g., `fwfparser`)

### 4.3 Homepage Bento Logic

The `/` route grid requires exactly 6 semantic nodes based on the CV data:

1.  **Engine (2x2):** Surya Avala, "Principal AI Systems Architect", Stack Pills (Python, C++, K8s, GenAI).
2.  **Status Card (1x1):** Green Pulse indicator + "Volunteering for Social Good".
3.  **Metric Card (1x1):** Orange typography highlight -> "93% Clinical NLP Accuracy".
4.  **Agentic Highlight (2x1):** `scaling-succotash` feature card (GraphRAG, K8s).
5.  **Infra Highlight (1x1):** `zen_search` feature card.
6.  **Human Element (1x1):** "Pastry Enthusiast 🥐" card.

---

## 5. Cross-Cutting Concerns

### 5.1 Accessibility (a11y)

- **Contrast:** All token color pairings (Dracula accents on GitHub Dark base / Slate text on Paper base) must pass **WCAG 2.1 AA** contrast ratios (minimum 4.5:1).
- **Semantics:** Bento cards must use standard HTML5 `<article>`, `<header>`, and `<nav>` tags. Svelte components like the Theme Toggle must use explicit `aria-label="Toggle Dark Mode"`.
- **Motion:** CSS animations (e.g., the pinging status dot, hover transforms) must be wrapped in `@media (prefers-reduced-motion: reduce)` media queries.

### 5.2 SEO Strategy

- 100% Server-Side Generated (SSG) HTML ensures zero layout-shift and instant crawling.
- Automated generation of `<title>` and `<meta name="description">` tags populated dynamically from the MDX Frontmatter.
- `JSON-LD` structured data mapping to the `Person` schema (Homepage) and `Article` schema (`/notes`) injected into the `<head>`.

---

## 6. Data Integrity & Schema

### 6.1 Frontmatter Schema (YAML + Zod)

To ensure the CI/CD pipeline never deploys a malformed page, Astro's Content Collections API will enforce a strict Frontmatter schema for all files in `/src/content/notes/` using Zod validation. If a required field is missing, the build will explicitly fail.

**Target YAML Frontmatter Definition:**

```yaml
---
title: "The hidden cost of Jupyter Notebooks in Prod"
publishDate: 2026-04-15
description: "Why elegant theoretical data science requires massive infrastructure to scale."
tags: ["MLOps", "Technical Debt", "Kubernetes"]
category: "Systems Engineering" # Must validate against defined enums
isDraft: false
requiresMath: true # Lazy-loads KaTeX CSS only when true to preserve performance
---
```

### 6.2 Drift Detection & Maintenance Strategy

To honor the MLOps principle of mitigating technical debt over a 6-to-24 month horizon, the site must be mathematically immune to bit-rot in production:

1.  **Strict Dependency Pinning:** All `npm` dependencies in `package.json` will be strictly pinned to exact versions (no `^` or `~` caret operators allowed). This mirrors the philosophy in the `tensorflow/tfx (#3813)` PR.
2.  **Lockfile Integrity:** `package-lock.json` will be strictly enforced to guarantee deterministic builds.
3.  **Automated Dependency Management:** Dependabot will be configured via `.github/dependabot.yml` to run monthly, testing updates in isolated PRs.
4.  **CI Build Gates:** GitHub Actions will run `npx astro check` (TypeScript type-checking & Zod schema validation) and `npm run build` on every PR. If validation fails, the PR turns red and cannot be merged into `main`.

---

## 7. Open Questions / Risks (Awaiting Client Confirmation)

1.  **Content Pipeline Sign-off:** This EDD formally specifies **Local MDX** over the Notion API to guarantee zero tech-debt, zero API latency, and version control. _Awaiting final explicit confirmation to abandon the Notion API integration._
2.  **Light Mode Palette Sign-off:** The "Paper" aesthetic (`#f8f9fa`) is specified for Light Mode to reduce eye strain. _Awaiting final explicit confirmation over a stark pure white (`#ffffff`) background._
3.  **Domain & DNS Routing:** We are targeting GitHub Pages. _Awaiting confirmation if the final deployment will live at `suryaavala.github.io` natively or if a custom domain (`suryaavala.com`) CNAME needs to be configured in the GitHub settings._
