
# DESIGN_SPEC.md

**Document Owner:** Staff Software Engineer / TPM

**Project:** `suryaavala.com` v2.0 (Personal Architecture Platform)

**Target Persona:** Principal AI Systems Architect / Staff Machine Learning Engineer

**Status:** APPROVED FOR IMPLEMENTATION

**Source:** [gemini](https://gemini.google.com/share/75da85120928)

---

## 1. Context & Scope

### 1.1 Background

Surya Avala is a Principal AI Systems Architect, Staff Machine Learning Engineer and Engineering Leader. Operating at the apex of machine learning engineering, mathematically rigorous system design, and strategic technical leadership, Surya specializes in eradicating "Hidden Technical Debt in Machine Learning" across highly regulated industries (Healthcare, Energy, Finance). The `suryaavala.com` platform must transition from a generic portfolio to a high-signal, developer-native platform that accurately reflects his "Full-Stack Regulated Convergence" (Math + Agents + Scale + Security).

### 1.2 Goals

* **High-Signal Conversion:** Serve as an authoritative capability document for top-tier roles (Head of AI Platform, VP of ML Engineering, Principal AI Solutions Architect). Target audience includes executive recruiters, CTOs, and peer researchers.
* **Maximum Performance:** Achieve a strict 100/100 Lighthouse score across Performance, Accessibility, Best Practices, and SEO.
* **Frictionless Authoring:** Utilize a "Docs-as-Code" (Local MDX) pipeline, enabling content creation directly from an IDE (Obsidian/VS Code) with zero external network latency.
* **Immutable Infrastructure:** Guarantee deterministic deployments and mathematically eliminate bit-rot.

### 1.3 Non-Goals

* **NO Single Page Application (SPA):** Explicitly avoiding React, Next.js, and client-side routing to eliminate Virtual DOM overhead, hydration costs, and unnecessary complexity.
* **NO Headless CMS Lock-in:** Explicitly rejecting Notion API or Contentful to prevent build-time latency, network fragility, and vendor lock-in.
* **NO Generic Layouts:** We will not use chronological project feeds. Content must be categorized by deep architectural domain.

---

## 2. System Architecture

### 2.1 Tech Stack

* **Core Framework (Routing & SSG):** `Astro` (v4+). Required for its default zero-JS static output and multi-page routing architecture.
* **Interactive Components (Islands):** `Svelte`. Required for clean, compiler-based execution, minimal boilerplate, and zero Virtual DOM overhead.
* **Styling Engine:** `Tailwind CSS`. Required for utility-first maintainability and native dark/light mode class toggling.
* **Content Pipeline:** Local `MDX` (Markdown + embedded Svelte components).
* **Package Manager:** `npm` with strict lockfile enforcement.

### 2.2 Data Flow & Infrastructure

* **Source of Truth:** Content lives as local `.mdx` files within the Git repository (`/src/content/notes/`, `/src/content/architecture/`).
* **CI/CD (GitOps):** GitHub Actions triggers `npm run build` upon pushes to the `main` branch. Output is pushed to the `gh-pages` branch.
* **Hosting:** GitHub Pages natively serving the fully static HTML/CSS/JS assets.
* **DNS & Edge Security:** Cloudflare. A custom domain (`suryaavala.com`) will be configured with a CNAME record pointing to GitHub Pages. Cloudflare will enforce strict HTTPS/SSL (Full/Strict mode), edge caching, and DDoS protection. A `CNAME` file containing `suryaavala.com` will be committed to the Astro `public/` directory.

---

## 3. UX/UI Specification

### 3.1 Visual Language (Design Tokens)

The aesthetic is a data-dense, minimalist "Bento Grid" utilizing a mathematical color palette derived from Surya's native terminal environment.

* **Typography:**
  * *Body/Headings:* `Inter` (Sans-serif) - High legibility for dense technical paragraphs.
  * *Metadata/Code/Tags:* `Fira Code` (Monospace) - IDE-native feel.
* **Dark Mode (Primary Theme):**
  * Base Background: `#0d1117` (GitHub Dark)
  * Surface/Cards: `#161b22` & `#282a36` (Dracula Surface)
  * Structural Borders: `#30363d`
* **Light Mode (Secondary Theme - "Paper"):**
  * Base Background: `#f8f9fa` (Off-white / Paper to reduce eye strain)
  * Surface/Cards: `#ffffff` (Pure White)
  * Text: `#1e293b` (Slate 800)
  * Structural Borders: `#e5e7eb` (Gray 200)
* **Semantic Accents (Dracula Palette):**
  * Primary/Brand: `#bd93f9` (Purple)
  * Status/Availability: `#50fa7b` (Green)
  * Infrastructure/OSS: `#8be9fd` (Cyan)
  * Impact Metrics: `#ffb86c` (Orange)
  * Human Element: `#ff79c6` (Pink)
  * Tech Stack Tags: `#f1fa8c` (Yellow)

### 3.2 Component Library

* **Bento Grid:** Asymmetric CSS grid (`auto-rows-[220px]`) handling varying content density (1x1, 2x1, 2x2 spans) with `group-hover` Dracula border transitions.
* **Theme Switcher:** Svelte toggle injecting the `.dark` class on the root HTML element, persisting user preference in `localStorage`.
* **Terminal Prose:** Specialized typography for `/notes` utilizing Shiki syntax highlighting for code blocks and KaTeX for math rendering.
* **Status Beacon:** Pure CSS absolute-positioned pulsing ring (`animate-ping`) utilizing `#50fa7b`.

### 3.3 Site Map (Multi-Page Routing)

1. **`/` (Home):** Executive Summary Bento Grid.
2. **`/architecture`:** Categorized deep-dive into ML pipelines, K8s infra, and open-source upstream PRs.
3. **`/notes`:** Docs-as-code engineering blog (MDX).
4. **`/stack`:** Infrastructure Stack (Python, C++, GCP, AWS, K8s, PyTorch, vLLM) & hardware configs.
5. **`/runtime`:** Career CV timeline, demonstrating commercial impact (e.g., 67% reduction in lead times, 40% cost optimization, 93% NLP accuracy).
6. **`/ping`:** Plaintext contact matrix (GitHub, LinkedIn, Email).

---

## 4. Detailed Design

### 4.1 Homepage Bento Logic (The `/` Route)

The grid requires exactly 6 semantic nodes based on `README.md` data:

1. **Engine (2x2):** Surya Avala, "Principal AI Systems Architect", Stack Pills (Python, C++, Kubernetes, GenAI/Agents).
2. **Status Card (1x1):** Green Pulse indicator + "Open to Work" / "Volunteering for Social Good".
3. **Metric Card (1x1):** Orange typography highlight -> "93% Clinical NLP Accuracy".
4. **Agentic Highlight (2x1):** `scaling-succotash` feature card (Production agentic search engine: GraphRAG, Celery DLQ, K8s).
5. **Infra Highlight (1x1):** `zen_search` feature card (High-performance ticketing system search engine).
6. **Human Element (1x1):** "Pastry Enthusiast 🥐" / "Philosopher" card.

### 4.2 Portfolio Logic (`/architecture`)

Projects are hardcoded data objects categorized strictly by domain, replacing standard chronological feeds:

* **GenAI & Agentic Systems:** `scaling-succotash`, `openclaude`.
* **Systems & Infrastructure:** `traffic_counter` (O(1) stdlib optimization), `decloud` (FinOps), `advancedcpp`.
* **ML & Data Science:** `suncorp`, `stockprediction`, `som`, `prodr`, `legimages`.
* **Data Engineering & Tooling:** `zen_search`, `fwfparser`, `ah_chambers_of_law`, `template_cookiecutter`.
* **Upstream Contributions:** `tensorflow/tfx (#3813)`, `kubeflow/pipelines (#4702 & #4706)`, `dask/dask (#5828)`, `iterative/katacoda-scenarios`.

### 4.3 Blog Architecture (`/notes`)

* Markdown parsed by Astro's built-in `remark` and `rehype`.
* Must implement `remark-math` and `rehype-katex` to support native rendering of mathematical equations (Linear Algebra, Matrix Calculus, Bayesian Inference, Do-Calculus).
* Must implement `shiki` for build-time syntax highlighting in code blocks.

---

## 5. Cross-Cutting Concerns

### 5.1 Accessibility (a11y)

* **Contrast:** All token color pairings (Dracula accents on GitHub Dark base / Slate text on Paper base) must pass **WCAG 2.1 AA** contrast ratios (minimum 4.5:1).
* **Semantics:** Bento cards must use HTML5 `<article>`, `<header>`, and `<nav>` tags. Theme toggle requires `aria-label="Toggle Theme"`.
* **Motion:** CSS animations must be wrapped in `@media (prefers-reduced-motion: reduce)`.

### 5.2 SEO & Performance

* 100% Server-Side Generated (SSG) HTML ensures zero layout-shift, instant rendering, and optimal TTFB.
* Automated `<title>` and `<meta name="description">` tags populated dynamically from MDX Frontmatter.
* `JSON-LD` structured data mapping to `Person` (Homepage) and `Article` (`/notes`).

---

## 6. Data Integrity & Schema

### 6.1 Frontmatter Schema (YAML + Zod)

To ensure the CI/CD pipeline never deploys a malformed page, Astro's Content Collections API will enforce a strict Frontmatter schema for all files in `/src/content/notes/` using Zod validation. If a required field is missing, the build will explicitly fail.

**Zod Schema Implementation (`src/content/config.ts`):**

```typescript
import { z, defineCollection } from 'astro:content';

const notesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(100, "Title must be under 100 characters"),
    publishDate: z.date(),
    description: z.string().min(50).max(160, "Description must be under 160 characters for SEO"),
    tags: z.array(z.string()).min(1).max(5),
    category: z.enum([
      'Healthcare & Clinical NLP', 
      'Energy & Time-Series', 
      'Recommender Systems', 
      'Distributed Systems', 
      'GenAI Architecture', 
      'Philosophy & Public Policy'
    ]),
    isDraft: z.boolean().default(false),
    requiresMath: z.boolean().default(false) // Lazy-loads KaTeX CSS only when true
  })
});

export const collections = { 'notes': notesCollection };
```

**Target YAML Frontmatter Definition (Example):**

```yaml
---
title: "Hidden Technical Debt in Machine Learning"
publishDate: 2026-04-15
description: "Why elegant theoretical data science requires massive infrastructure to scale safely."
tags: ["MLOps", "Technical Debt", "Kubernetes", "Architecture"]
category: "Distributed Systems"
isDraft: false
requiresMath: true 
---
```

### 6.2 Drift Detection & Maintenance Strategy

To honor the MLOps principle of mitigating technical debt over a 6-to-24 month horizon, the site must be mathematically immune to bit-rot in production:

1. **Strict Dependency Pinning:** All `npm` dependencies in `package.json` will be strictly pinned to exact versions (no `^` or `~` caret operators allowed). This mirrors the dependency conflict resolution philosophy in the `tensorflow/tfx (#3813)` PR.
2. **Lockfile Integrity:** `package-lock.json` will be strictly enforced in CI/CD via `npm ci` to guarantee deterministic builds.
3. **Automated Dependency Management:** Dependabot configured via `.github/dependabot.yml` to run monthly, testing updates in isolated PRs.
4. **CI Build Gates:** GitHub Actions will run `npx astro check` (TypeScript type-checking & Zod schema validation) and `npm run build` on every PR. If validation fails, the PR fails.

---

## 7. Open Questions / Risks

* **[RESOLVED]** Content Pipeline: Notion API abandoned. Proceeding with Local MDX for zero tech-debt.
* **[RESOLVED]** Light Mode: "Paper" aesthetic (`#f8f9fa`) approved over pure white.
* **[RESOLVED]** DNS Routing: Custom domain (`suryaavala.com`) configured with HTTPS via Cloudflare proxying GitHub Pages.
