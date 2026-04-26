
# DESIGN_SPEC.md

**Document Owner:** Staff Software Engineer / TPM

**Project:** `suryaavala.com` v2.0 (Personal Architecture Platform)

**Target Audience:** CTOs, Executive Recruiters, Peer Researchers, Staff Engineers

**Status:** APPROVED FOR IMPLEMENTATION

**Source:** [gemini](https://gemini.google.com/share/75da85120928)

---

## 1. Context & Scope

### 1.1 Background

Surya Avala is a **Principal AI Systems Architect, Staff Machine Learning Engineer, and Engineering Leader**. Operating at the apex of machine learning engineering, mathematically rigorous system design, and strategic technical leadership, Surya specialises in eradicating "Hidden Technical Debt in Machine Learning" across highly regulated industries (Healthcare, Energy, Finance). For over a decade, Surya has navigated these domains — from low-level systems optimisation and distributed infrastructure, to ML platforms, recommender engines, clinical NLP services, and multi-agent GenAI systems.

Surya's unique edge — the **"Full-Stack Regulated Convergence (Math + Agents + Scale + Security)"** — is the rare convergence of: mathematical depth (re-deriving algorithms, Causal Inference to prove ROI), low-level systems knowledge (vLLM, GPU, distributed infra), and architectural vision (mission-critical hybrid-cloud Multi-Agent systems). The `suryaavala.com` platform must reflect this with precision: it is both a high-signal capability document and a developer-native engineering artefact.

### 1.2 Goals

* **High-Signal Conversion:** Serve as an authoritative capability document for top-tier roles: _Head of AI Platform / VP of ML Engineering_, _Principal AI Solutions Architect_, _Staff AI Engineer_. Target audience: executive recruiters, CTOs, and peer researchers.
* **Maximum Performance:** Achieve a strict 100/100 Lighthouse score across Performance, Accessibility, Best Practices, and SEO.
* **Frictionless Authoring:** Utilise a "Docs-as-Code" (Local MDX) pipeline enabling content creation directly from an IDE (Obsidian/VS Code) with zero external network latency.
* **Immutable Infrastructure:** Guarantee deterministic deployments and mathematically eliminate bit-rot.

### 1.3 Non-Goals

* **NO Single Page Application (SPA):** Explicitly avoiding React, Next.js, and client-side routing to eliminate Virtual DOM overhead, hydration costs, and unnecessary complexity.
* **NO Headless CMS Lock-in:** Explicitly rejecting Notion API or Contentful to prevent build-time latency, network fragility, and vendor lock-in.
* **NO Generic Layouts:** No chronological project feeds. Content must be categorised by deep architectural domain.

---

## 2. System Architecture

### 2.1 Tech Stack

* **Core Framework (Routing & SSG):** `Astro` (v4+). Required for its default zero-JS static output and multi-page routing architecture.
* **Interactive Components (Islands):** `Svelte`. Required for clean, compiler-based execution, minimal boilerplate, and zero Virtual DOM overhead.
* **Styling Engine:** `Tailwind CSS`. Required for utility-first maintainability and native dark/light mode class toggling.
* **Content Pipeline:** Local `MDX` (Markdown + embedded Svelte components).
* **Package Manager:** `npm` with strict lockfile enforcement.

### 2.2 Data Flow & Infrastructure

* **Source of Truth:** Content lives as local `.mdx` files within the Git repository (`/src/content/notes/`, `/src/content/architecture/`). Typed data objects live in `/src/data/` (`experiences.ts`, `projects.ts`, `metrics.ts`).
* **CI/CD (GitOps):** GitHub Actions triggers `npm run build` upon pushes to the `main` branch. Output is pushed to the `gh-pages` branch.
* **Hosting:** GitHub Pages natively serving the fully static HTML/CSS/JS assets.
* **DNS & Edge Security:** Cloudflare. A custom domain (`suryaavala.com`) will be configured with a CNAME record pointing to GitHub Pages. Cloudflare will enforce strict HTTPS/SSL (Full/Strict mode), edge caching, and DDoS protection. A `CNAME` file containing `suryaavala.com` will be committed to the Astro `public/` directory.

---

## 3. UX/UI Specification

### 3.1 Visual Language (Design Tokens)

The aesthetic is a data-dense, minimalist **"Bento Grid"** utilising a mathematical colour palette derived from Surya's native terminal environment (Dracula). Dark mode is the primary experience; "Paper" light mode is a UX affordance.

* **Typography:**
  * *Body/Headings:* `Inter` (Sans-serif) — High legibility for dense technical paragraphs.
  * *Metadata/Code/Tags:* `Fira Code` (Monospace) — IDE-native feel, matching GitHub README badge aesthetic.
* **Dark Mode (Primary Theme):**
  * Base Background: `#0d1117` (GitHub Dark)
  * Surface/Cards: `#161b22` & `#282a36` (Dracula Surface)
  * Structural Borders: `#30363d`
  * Primary Text: `#f8f8f2`
* **Light Mode (Secondary Theme — "Paper"):**
  * Base Background: `#f8f9fa` (Off-white / Paper to reduce eye strain)
  * Surface/Cards: `#ffffff` (Pure White)
  * Text: `#1e293b` (Slate 800)
  * Structural Borders: `#e5e7eb` (Gray 200)
* **Semantic Accents (Dracula Palette):**
  * Primary/Brand: `#bd93f9` (Purple) — Name, hero tagline, links. **WCAG Note:** Contrast ratio ~5.1:1 on `#0d1117` — passes AA for large text (≥18px/14px bold). For body-size Purple text, use brightened variant `#c4a0ff` (~6.3:1) to guarantee AA compliance at all sizes.
  * Status/Availability: `#50fa7b` (Green) — Status pulse, OSS contributions (~11.5:1 ✅)
  * Infrastructure/OSS: `#8be9fd` (Cyan) — Infrastructure tags, systems labels (~10.3:1 ✅)
  * Impact Metrics: `#ffb86c` (Orange) — Quantified metrics, call-to-action (~8.4:1 ✅)
  * Human Element: `#ff79c6` (Pink) — Philosophy, social good, human-anchored content (~6.2:1 ✅)
  * Tech Stack Tags: `#f1fa8c` (Yellow) — Technology pills/badges (~12.8:1 ✅)

### 3.2 Component Library

* **Bento Grid:** Asymmetric CSS grid (`auto-rows-[220px]`) handling varying content density (1x1, 2x1, 2x2 spans) with `group-hover` Dracula border transitions. On mobile (< 768px), collapses to a single-column layout with a curated top-4 card priority (Hero → Impact → Agentic Highlight → Status) and a "Show more" affordance for remaining cards.
* **Theme Switcher:** Svelte toggle injecting the `.dark` class on the root HTML element, persisting user preference in `localStorage`.
* **Terminal Prose:** Specialised typography for `/notes` utilising Shiki syntax highlighting for code blocks and KaTeX for math rendering.
* **Status Beacon:** Pure CSS absolute-positioned pulsing ring (`animate-ping`) utilising `#50fa7b`.
* **Metric Counter:** Svelte Island with `IntersectionObserver` triggering an animated count-up on first scroll-into-view. Used for impact metric display across Bento and `/runtime`. Must include `aria-live="polite"` for screen reader compatibility.
* **Tech Badge:** Reusable component rendering Dracula-styled inline badges matching README badge aesthetic (`#282a36` background, Dracula accent logo colour).
* **Typing Hero:** Svelte Island replicating the README typing SVG effect. Cycles through headlines: `Healthcare · Energy · Fintech · Tech`, `Staff Machine Learning Engineer`, `Principal AI Systems Architect`, `Engineering Leader`, `Pastry Enthusiast · Human · Philosopher`. Uses `Fira Code` at `22px`, `#bd93f9` text, with configurable pause/speed matching the README `pause=42&speed=1` cadence.
* **Gradient Divider:** CSS `<hr>` element rendering a horizontal Dracula rainbow gradient (`#ff5555 → #ffb86c → #f1fa8c → #50fa7b → #8be9fd → #bd93f9 → #ff79c6`), replacing the external `andreasbm/readme` rainbow PNG from the README.
* **Radar Chart:** Svelte Island rendering an inline `<svg>` radar/spider chart from hardcoded `competencyData` in `/src/data/competency.ts`. Computes polygon vertices via `cos(θ)` / `sin(θ)`, renders Dracula-styled grid rings, axis labels in `Fira Code` at `#8be9fd`, and a filled polygon with `rgba(189,147,249,0.35)` fill / `#bd93f9` stroke. Zero external dependencies. Full CSP compliance. Includes hover tooltips showing score and self-assessment methodology footnote. Placed on `/stack`.
* **Featured Badge:** Small overlaid label (`"Featured"` in `#ffb86c` / `"Latest"` in `#8be9fd`) on Bento project cards to differentiate commercial-grade systems from learning exercises.

### 3.3 Site Map (Multi-Page Routing)

1. **`/` (Home):** Executive Summary Bento Grid — 8-second signal for any audience segment.
2. **`/architecture`:** Domain-categorised deep-dive into ML pipelines, K8s infra, and upstream OSS PRs.
3. **`/notes`:** Docs-as-code engineering blog (MDX) — mathematical and practitioner-anchored.
4. **`/stack`:** Full Infrastructure Stack across languages, cloud, MLOps, and GenAI tooling.
5. **`/runtime`:** Career timeline — institutional context + commercial impact metrics per role.
6. **`/ping`:** Full contact matrix (GitHub, LinkedIn, Email, BuyMeACoffee, GitHub Sponsors).

> **Audience routing intent (analytics-only, no personalisation):**
> - Recruiters: Entry via `/runtime` (metrics + institutional impact)
> - Engineers: Entry via `/architecture` (systems depth)
> - Researchers: Entry via `/notes` (mathematical reasoning + practitioner posts)

---

## 4. Detailed Design

### 4.1 Homepage Bento Logic (The `/` Route)

The grid requires exactly **8 semantic nodes** reflecting both the persona's signal hierarchy and the README's impact surface. **Signal hierarchy principle:** visual weight (span size) must correlate with commercial/conversion impact — enterprise platform work and quantified metrics receive the largest spans; learning exercises and secondary signals receive smaller spans.

> **Mobile responsive behaviour (< 768px):** The grid collapses to a single column. Only the top 4 cards (Hero → Impact → Agentic Highlight → Status) render above the fold. Remaining cards are accessible via a "Show more" `<details>` toggle to preserve the 8-second scanning promise on mobile.

1. **Engine (full-width banner, 3x1) — Hero Card:**
   * Name: `Surya Avala`
   * Typing Animation (Svelte `<TypingHero />` Island): Cycles through `Healthcare · Energy · Fintech · Tech`, `Staff Machine Learning Engineer`, `Principal AI Systems Architect`, `Engineering Leader`, `Pastry Enthusiast · Human · Philosopher`. `Fira Code`, `#bd93f9`, matching README typing SVG cadence.
   * Title: `Principal AI Systems Architect · Staff ML Engineer · Engineering Leader`
   * Sub-headline (Purple italic): *"Full-Stack Regulated Convergence: Math + Agents + Scale + Security"*
   * Opening Quote (Fira Code, muted `#6272a4`): *"I've always been passionate about computers and the ability to make them solve problems for us."* — sourced from README.
   * Industries: `Healthcare · Energy · Finance · Tech`
   * Stack Pills (Fira Code): `Python`, `C++`, `Kubernetes`, `PyTorch`, `vLLM`, `LangGraph`
   * Accent: Purple border glow on hover.
   * Gradient Divider below (Dracula rainbow CSS gradient).

2. **Impact Cluster (2x2) — Metrics Grid:**
   * **Six** animated count-up numbers (orange `#ffb86c`) on scroll, expanded from README's full impact surface:
     - `67%` ↓ Feature lead times (Montu — GCP ML Platform, DORA metrics)
     - `93%` Clinical NLP Accuracy (outperforming Google Healthcare NLP by 14%)
     - `40%` avg cost optimisation (Amber — Energy Forecasting, 10k+ sites)
     - `71.3%` Clinician adoption (Montu — Prescription Recommender, 100k+ patients)
     - `70%` Clinician reviews automated (Montu — Care Quality Assessment)
     - `0.87+` F1 PII redaction score (Montu — Clinical log sanitisation)
   * Each metric anchored with a `(2-3 word context tag)` in Cyan `#8be9fd` and methodology string in muted `#6272a4`.
   * Metrics rendered via the enhanced `Metric` type with `methodology` and optional `confidenceBound` fields (see §6.2).

3. **Status Card (1x1) — Availability:**
   * Green Pulse indicator (`animate-ping`, `#50fa7b`).
   * Copy: `"Open to Work"` — targeting VP/Principal/Staff roles.
   * Sub-copy: `"Volunteering for Social Good"` — links to Beyond Code narrative.
   * `lastVerified: Date` field enforced (see §6.3) — CI warns if > 90 days stale.

4. **Agentic System Highlight (2x1):**
   * **Featured Badge** overlay (`"Featured"` in `#ffb86c`).
   * Feature card: [`scaling-succotash`](https://github.com/suryaavala/scaling-succotash)
   * Description: Production agentic search engine — GraphRAG, Celery DLQ, Circuit Breakers, K8s.
   * Tags: `GraphRAG`, `LangGraph`, `Kubernetes`.
   * Accent: Cyan border.

5. **Infrastructure Highlight (1x1):**
   * **Latest Badge** overlay (`"Latest"` in `#8be9fd`).
   * Feature card: [`traffic_counter`](https://github.com/suryaavala/traffic_counter)
   * Description: O(1) stdlib optimisation — zero GC thrashing, pure CPython heap/deque.
   * Tags: `Python`, `Systems`, `O(1)`.

6. **Human Element (1x1) — Philosophy Card:**
   * Accent: Pink `#ff79c6`.
   * Title: `Beyond Code`
   * Copy: *"AI for Social Good · Climate Action · Rational Thinking · Public Policy"*
   * Extended Copy: *"I want to use whatever skills and resources I have to help build a fairer world for everyone. That means fighting for climate action, standing against racism and inequality, spreading awareness about rational thinking and empathy."* — sourced directly from README §Beyond Code.
   * Sub-copy (Fira Code): `"Pastry Enthusiast 🥐 · Philosopher · Human"`

7. **OSS Upstream Signal (1x1):**
   * Accent: Green `#50fa7b`.
   * Title: `Upstream Contributions`
   * Inline list of 5 PRs (abbreviated): `tfx #3813`, `kubeflow #4702`, `kubeflow #4706`, `dask #5828`, `iterative/katacoda`.
   * Links to `/architecture#oss`.

8. **Leadership Signal (1x1) — Staff+ Card:**
   * Accent: Orange `#ffb86c`.
   * Title: `Technical Leadership`
   * Copy: RFC authorship, ML Guild mentoring, cross-functional Build vs. Buy negotiation.
   * Sub-copy: *"Hired, onboarded and mentored teams of Data Scientists & ML Engineers across multiple orgs."* — sourced from README §Impact.
   * Links to `/runtime` for full leadership detail per role.

### 4.2 Portfolio Logic (`/architecture`)

Projects are hardcoded typed data objects (`/src/data/projects.ts`) categorised strictly by domain, replacing standard chronological feeds:

* **GenAI & Agentic Systems:** `scaling-succotash` (GraphRAG, Celery DLQ, K8s), `openclaude` (multi-model orchestration mesh).
* **Systems & Infrastructure:** `traffic_counter` (O(1) stdlib optimisation, zero GC thrashing), `decloud` (FinOps), `advancedcpp` (Advanced C++ patterns).
* **ML & Data Science:** `suncorp`, `stockprediction`, `som` (Kohonen Networks), `prodr` (Productionising R models), `legimages` (ML Legos for Images).
* **Data Engineering & Tooling:** `zen_search` (High-performance ticketing search — Bento feature card), `fwfparser`, `ah_chambers_of_law`, `template_cookiecutter`.
* **Enterprise ML & Document Intelligence:** ANZ Enterprise ID Fraud Detection (Kubeflow/GKE), HammondCare Customer Triaging Chatbot, nib SageMaker Platform Extensions, Eliiza "Thea" Document Mining Framework, Cricket Australia DataJam 2020 (2nd Place).
* **Upstream Contributions (anchor: `#oss`):**
  * `tensorflow/tfx (#3813)` — Resolved strict dependency pinning conflicts for TF-Hub.
  * `kubeflow/pipelines (#4702)` — Fixed GCP inverse proxy URL routing priorities.
  * `kubeflow/pipelines (#4706)` — Reconciled SDK linting conflicts between pylint and yapf.
  * `dask/dask (#5828)` — Fixed multi-dimensional array ValueErrors in delayed map reductions.
  * `iterative/katacoda-scenarios` — DVC learning scenarios.

**Full Catalogue (collapsible `<details>` section):** Mirrors the README Full Catalogue table. Renders all 17+ additional repositories (including `blog`, `suryaavala.github.io`, `powr`, `Stellartube`, `TimeStamper`, `textparsing`, `network`, `utilities`, `CS231n`, `18s1-9417`, `17s1-cs9417`, `16s2-comp2041-*`, `egl_test`, `finder_test`, `tcal`) in a Dracula-badged table with language icons, matching the README aesthetic. This provides a completeness signal for academic rigour and breadth of exploration without cluttering the primary domain-categorised view.

### 4.3 Career Timeline (`/runtime`)

Experiences are structured typed data objects (`/src/data/experiences.ts`), validated at build-time via Zod (see §6.2):

```typescript
interface Experience {
  company: string;
  role: string;
  period: string;
  industry: 'Healthcare' | 'Energy' | 'Finance' | 'Consumer Tech' | 'Consulting';
  metrics: Metric[];                  // Uses enhanced Metric type with methodology + confidence bounds
  techHighlights: string[];
  leadershipHighlights?: string[];    // RFC authorship, team building, cross-functional negotiation
  lastVerified: string;               // ISO date — CI warns if > 90 days stale
}
```

**Data nodes** (sourced directly from README impact table, expanded with NLP/GenAI and Privacy metrics):

| Company | Key Metrics | Leadership Highlights |
|---|---|---|
| **Montu** | 67% ↓ lead times, 97%+ ↓ change-failure, 93% NLP accuracy (+14% vs Google), 71.3% clinician adoption, 18–23% repeat order uplift, 32% consultation time reduction, 70% clinician reviews automated, 0.87+ F1 PII redaction | Hired/mentored Data Scientists & ML Engineers, RFC authorship, Privacy-by-Design architect |
| **Amber** | 40% avg cost optimisation, energy forecasting for 10k+ sites | Event-driven architecture leadership, FinOps strategy |
| **Linktree** | 33% link adoption gains, 19% profile subscription uplift | End-to-end recommender system ownership, cross-functional product negotiation |
| **ANZ** | Enterprise ID Fraud Detection Platform (Kubeflow/GKE) | Enterprise ML platform architecture |
| **nib Group** | ML infrastructure, SageMaker platform extensions | Platform engineering leadership |
| **HammondCare** | Customer request triaging chatbot | |
| **Eliiza** | "Thea" document mining framework, Cricket Australia DataJam 2020 (2nd Place) | ML Guild mentoring |

#### GitHub Streak Widget

The GitHub Streak Stats widget from the README is rendered at the footer of `/runtime` as a lazy-loaded external image:

```html
<img
  src="https://streak-stats.demolab.com?user=suryaavala&theme=onedark&hide_border=true&border_radius=4.8&background=0d1117&ring=bd93f9&fire=ffb86c&currStreakNum=fff&sideNums=fff&currStreakLabel=bd93f9&sideLabels=bd93f9&dates=8be9fd"
  alt="GitHub Streak Stats for suryaavala"
  loading="lazy"
  width="495"
  height="195"
/>
```

**CSP Requirement:** The Content-Security-Policy header (Cloudflare or `<meta>`) must allowlist the external image source:
```
img-src 'self' https://streak-stats.demolab.com;
```

The `loading="lazy"` attribute ensures the widget does not block initial page render or impact Lighthouse Performance score. Placement on `/runtime` (not `/`) isolates the external dependency from the homepage Lighthouse audit.

### 4.4 Full Stack Page (`/stack`)

Reflects the complete README Infrastructure Stack badge set, grouped by category:

* **Languages & CS Primitives:** Python (Advanced internals, Asyncio, Metaprogramming), C/C++, TypeScript, Advanced SQL (Window Functions, CTEs), Bash/Shell, Perl.
* **AI/ML & HPC:** PyTorch, TensorFlow, Keras, Scikit-Learn, XGBoost/LightGBM, vLLM, FlashAttention, Quantisation (INT8/FP4), GPU Profiling (`torch.profiler`).
* **Agentic & GenAI:** LangChain, LangGraph, DSPy, MCP, A2A (Agent-to-Agent), RAG, GraphRAG (Knowledge Graphs + LLMs), Guardrails, Prompt Engineering, Evals, Federated Learning, Differential Privacy.
* **MLOps & Data Engineering:** Kubeflow, ClearML, TFx, MLflow, DVC, Airflow/Prefect, Feast/Tecton, Kafka, BigQuery, Snowflake, PostgreSQL, Redis, Dask. Data contracts, schema validation, drift monitoring.
* **Cloud & Infrastructure:** GCP (GKE, Cloud Run, VertexAI, Pub/Sub), AWS (EKS, SageMaker, Lambda, DynamoDB), Docker, Kubernetes (StatefulSets, Operators, CRDs), Terraform, Helm, CloudWatch, Datadog.
* **Advanced DL Paradigms:** PEFT (LoRA/QLoRA), RLHF (PPO/DPO), Transformer Architectures, custom Autograd/Attention blocks.
* **Systems Architecture & Theory:** Distributed Systems Theory (CAP, PACELC, Paxos/Raft), Event-Driven Architecture, Domain-Driven Design (DDD), Gang of Four Design Patterns, LSM/B-Trees.

Display: Dracula-styled badge grid matching README badge aesthetic (`#282a36` background, per-category Dracula accent logos).

#### Radar Chart (Inline SVG — `<RadarChart />` Svelte Island)

The competency radar chart from the README (previously rendered via QuickChart.io external CDN) is re-implemented as an inline SVG Svelte Island for full CSP compliance and zero external dependencies.

**Data Source (`/src/data/competency.ts`):**

```typescript
export interface CompetencyAxis {
  label: string;
  score: number;          // 0-100
  methodology: string;    // Self-assessment rubric footnote
}

export const competencyData: CompetencyAxis[] = [
  { label: 'Platform MLOps',        score: 95, methodology: 'Production systems across 5+ orgs, upstream Kubeflow/TFx PRs' },
  { label: 'Dist. Systems (CAP)',   score: 94, methodology: 'K8s StatefulSets, Kafka, event-driven at Amber/Montu scale' },
  { label: 'Privacy & Compliance',  score: 92, methodology: '0.87+ F1 PII redaction, RBAC, Privacy-by-Design in healthcare' },
  { label: 'HPC Compute Opt.',      score: 82, methodology: 'vLLM PagedAttention, FlashAttention, INT8/FP4 quantisation' },
  { label: 'FinOps & Strategy',     score: 90, methodology: '40% cost reduction at Amber, Build vs Buy RFC authorship' },
  { label: 'DL Math & Internals',   score: 78, methodology: 'Custom autograd/attention, SVD/PCA derivations, Causal Inference' },
  { label: 'Agentic Orchestration', score: 88, methodology: 'scaling-succotash prod system, LangGraph/DSPy/MCP/A2A' },
  { label: 'SWE & Data Eng.',       score: 93, methodology: 'O(1) stdlib optimisation, upstream dask PR, full-stack TS/Python' },
];
```

**Rendering:** The `<RadarChart />` component:
1. Computes 8 polygon vertices via `cos(2πi/8)` / `sin(2πi/8)` scaled by `score/100`.
2. Renders concentric grid rings at 20/40/60/80/100 with `rgba(255,255,255,0.1)` stroke.
3. Axis labels in `Fira Code` at `10px`, coloured `#8be9fd`.
4. Filled data polygon: `rgba(189,147,249,0.35)` fill, `#bd93f9` stroke.
5. Point markers: `#f1fa8c` (Yellow).
6. Hover interaction: tooltip showing `{label}: {score}/100 — {methodology}`.
7. Background: `#0d1117`, matching the dark theme.
8. Wrapped in `@media (prefers-reduced-motion: reduce)` guard for any transition effects.

> **Self-Assessment Methodology Note:** Competency scores are self-assessed based on production execution breadth, not academic certification. Each axis includes a `methodology` string providing the evidence basis. A footnote on the `/stack` page will read: *"Scores reflect self-assessed production execution breadth across 10+ years. Hover for evidence basis per axis."*

### 4.5 Blog Architecture (`/notes`)

* Markdown parsed by Astro's built-in `remark` and `rehype`.
* Must implement `remark-math` and `rehype-katex` to support native rendering of mathematical equations (Linear Algebra, Matrix Calculus, Bayesian Inference, Do-Calculus).
* Must implement `shiki` for build-time syntax highlighting in code blocks.

### 4.6 Contact Matrix (`/ping`)

Full five-channel matrix matching README header:

| Channel | Link |
|---|---|
| GitHub | [github.com/suryaavala](https://github.com/suryaavala) |
| LinkedIn | [linkedin.com/in/suryaavala](https://linkedin.com/in/suryaavala) |
| Email | [suryaavinashavala@gmail.com](mailto:suryaavinashavala@gmail.com) |
| Buy Me a Coffee | [buymeacoffee.com/suryaavala](https://buymeacoffee.com/suryaavala) |
| GitHub Sponsors | [github.com/sponsors/suryaavala](https://github.com/sponsors/suryaavala) |

Display: Dracula badge-style cards with hover glows matching README badge accent colours.

---

## 5. Cross-Cutting Concerns

### 5.1 Accessibility (a11y)

* **Contrast:** All token colour pairings (Dracula accents on GitHub Dark base / Slate text on Paper base) must pass **WCAG 2.1 AA** contrast ratios (minimum 4.5:1).
* **Semantics:** Bento cards must use HTML5 `<article>`, `<header>`, and `<nav>` tags. Theme toggle requires `aria-label="Toggle Theme"`. Metric counters must include `aria-live="polite"` for screen reader compatibility.
* **Motion:** CSS animations and JS count-up animations must be wrapped in `@media (prefers-reduced-motion: reduce)` / `matchMedia` guards.

### 5.2 SEO & Performance

* 100% Server-Side Generated (SSG) HTML ensures zero layout-shift, instant rendering, and optimal TTFB.
* Automated `<title>` and `<meta name="description">` tags populated dynamically from MDX Frontmatter and typed data objects.
* `JSON-LD` structured data mapping to `Person` (Homepage) and `Article` (`/notes`).
* Open Graph tags for all pages to enable social previews.

#### JSON-LD Person Schema (Homepage)

The homepage must include a `<script type="application/ld+json">` block mapping persona data to Schema.org `Person` type, sourced from `00_persona.md`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Surya Avala",
  "jobTitle": "Principal AI Systems Architect & Engineering Leader",
  "description": "Full-Stack Regulated Convergence: Math + Agents + Scale + Security. Over a decade eliminating Hidden Technical Debt in Machine Learning across Healthcare, Energy, and Finance.",
  "knowsAbout": [
    "Machine Learning Engineering", "MLOps", "GenAI", "Multi-Agent Systems",
    "Distributed Systems", "Healthcare AI", "Energy Forecasting",
    "Causal Inference", "Kubernetes", "Privacy-by-Design",
    "Recommender Systems", "Clinical NLP", "FinOps"
  ],
  "alumniOf": { "@type": "Organization", "name": "UNSW Sydney" },
  "url": "https://suryaavala.com",
  "sameAs": [
    "https://github.com/suryaavala",
    "https://linkedin.com/in/suryaavala"
  ]
}
```

#### Content-Security-Policy (CSP)

CSP header (Cloudflare or `<meta http-equiv="Content-Security-Policy">`) must be configured with:
```
default-src 'self';
img-src 'self' https://streak-stats.demolab.com;
font-src 'self' https://fonts.gstatic.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
script-src 'self';
```

The `streak-stats.demolab.com` allowlist is required only for the `/runtime` page GitHub Streak widget. All other external dependencies (QuickChart.io radar chart) have been eliminated by the inline SVG implementation.

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
      'Mathematical Substrates',    // Linear Algebra, Causal Inference, Bayesian Methods
      'Philosophy & Public Policy'
    ]),
    commercialContext: z.string().optional(), // Anchor posts to real production experience
    isDraft: z.boolean().default(false),
    requiresMath: z.boolean().default(false)  // Lazy-loads KaTeX CSS only when true
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
commercialContext: "Lessons from the Montu GCP ML Platform (67% ↓ lead times)"
isDraft: false
requiresMath: true
---
```

### 6.2 Typed Data Objects (`/src/data/`)

All hard-coded content is stored as strictly typed TypeScript objects rather than raw strings, enabling compile-time validation. All types are validated at build-time via Zod schemas (see §6.4).

```typescript
// /src/data/metrics.ts
export interface ConfidenceBound {
  lower: string;           // e.g. "62%"
  upper: string;           // e.g. "71%"
  note?: string;           // e.g. "95% CI across 6-month rolling window"
}

export interface Metric {
  value: string;           // e.g. "67%"
  direction: '↑' | '↓';
  label: string;           // e.g. "reduction in feature lead times"
  context: string;         // e.g. "Montu — GCP ML Platform (2023–2025)"
  methodology?: string;    // e.g. "Measured via DORA metrics pre/post migration"
  confidenceBound?: ConfidenceBound;  // Optional statistical grounding
  accent: string;          // Dracula token e.g. "#ffb86c"
}

// /src/data/experiences.ts
export interface Experience {
  company: string;
  role: string;
  period: string;
  industry: 'Healthcare' | 'Energy' | 'Finance' | 'Consumer Tech' | 'Consulting';
  metrics: Metric[];
  techHighlights: string[];
  leadershipHighlights?: string[];  // RFC authorship, team building, mentoring
  lastVerified: string;             // ISO date string — CI warns if > 90 days stale
}

// /src/data/projects.ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  domain: 'GenAI & Agentic Systems' | 'Systems & Infrastructure' | 'ML & Data Science' | 'Data Engineering & Tooling' | 'Enterprise ML & Document Intelligence';
  repoUrl: string;
  tags: string[];
  accentColor: string;
  featured: boolean;               // Renders "Featured" badge on Bento Grid
  badgeLabel?: 'Featured' | 'Latest';  // Optional overlay badge for signal hierarchy
}

// /src/data/competency.ts
export interface CompetencyAxis {
  label: string;
  score: number;           // 0-100
  methodology: string;     // Evidence basis for self-assessment
}
```

### 6.3 Drift Detection & Maintenance Strategy

To honour the MLOps principle of mitigating technical debt over a 6-to-24 month horizon, the site must be mathematically immune to bit-rot in production:

1. **Strict Dependency Pinning:** All `npm` dependencies in `package.json` will be strictly pinned to exact versions (no `^` or `~` caret operators allowed). This mirrors the dependency conflict resolution philosophy in the `tensorflow/tfx (#3813)` PR.
2. **Lockfile Integrity:** `package-lock.json` will be strictly enforced in CI/CD via `npm ci` to guarantee deterministic builds.
3. **Automated Dependency Management:** Dependabot configured via `.github/dependabot.yml` to run monthly, testing updates in isolated PRs.
4. **CI Build Gates:** GitHub Actions will run `npx astro check` (TypeScript type-checking & Zod schema validation) and `npm run build` on every PR. If validation fails, the PR fails.
5. **Content Staleness Guard:** A CI script will parse all `lastVerified` date fields from typed data objects (`experiences.ts`, status card config). If any `lastVerified` date is > 90 days in the past relative to the build date, the CI pipeline will emit a **warning** (not a failure) logged to the GitHub Actions summary. This prevents misleading "Open to Work" beacons or stale metrics from persisting silently in production. The staleness threshold is configurable via an environment variable `CONTENT_STALE_DAYS` (default: `90`).

### 6.4 Build-Time Data Validation (Zod Schemas for Typed Data)

In addition to the Zod schema for `/notes` frontmatter (§6.1), all typed data objects in `/src/data/` are validated at build-time using Zod schemas. This ensures compile-time safety for hard-coded content that bypasses the Content Collections API:

```typescript
// /src/data/schemas.ts
import { z } from 'zod';

const hexColorRegex = /^#[0-9a-fA-F]{6}$/;

export const ConfidenceBoundSchema = z.object({
  lower: z.string(),
  upper: z.string(),
  note: z.string().optional(),
});

export const MetricSchema = z.object({
  value: z.string().min(1),
  direction: z.enum(['↑', '↓']),
  label: z.string().min(10, 'Metric label must be descriptive (≥10 chars)'),
  context: z.string().min(5, 'Context must identify the company/project'),
  methodology: z.string().min(10, 'Methodology must explain measurement approach').optional(),
  confidenceBound: ConfidenceBoundSchema.optional(),
  accent: z.string().regex(hexColorRegex, 'Accent must be a valid hex colour'),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  industry: z.enum(['Healthcare', 'Energy', 'Finance', 'Consumer Tech', 'Consulting']),
  metrics: z.array(MetricSchema).min(1, 'Each experience must have at least one metric'),
  techHighlights: z.array(z.string()).min(1),
  leadershipHighlights: z.array(z.string()).optional(),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'lastVerified must be ISO date YYYY-MM-DD'),
});

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(10),
  domain: z.enum([
    'GenAI & Agentic Systems',
    'Systems & Infrastructure',
    'ML & Data Science',
    'Data Engineering & Tooling',
    'Enterprise ML & Document Intelligence',
  ]),
  repoUrl: z.string().url(),
  tags: z.array(z.string()).min(1).max(8),
  accentColor: z.string().regex(hexColorRegex),
  featured: z.boolean(),
  badgeLabel: z.enum(['Featured', 'Latest']).optional(),
});

export const CompetencyAxisSchema = z.object({
  label: z.string().min(1),
  score: z.number().int().min(0).max(100),
  methodology: z.string().min(10, 'Methodology must provide evidence basis'),
});
```

**Validation Hook:** A build-time script (`/scripts/validate-data.ts`) imports all typed data arrays and parses them through their respective Zod schemas. This script is invoked by `npm run build` via a `prebuild` npm script hook. If any validation fails, the build halts with a descriptive error message.

---

## 7. Open Questions / Risks

* **[RESOLVED]** Content Pipeline: Notion API abandoned. Proceeding with Local MDX for zero tech-debt.
* **[RESOLVED]** Light Mode: "Paper" aesthetic (`#f8f9fa`) approved over pure white.
* **[RESOLVED]** DNS Routing: Custom domain (`suryaavala.com`) configured with HTTPS via Cloudflare proxying GitHub Pages.
* **[RESOLVED]** GitHub Streak Widget: Placed on `/runtime` page footer as a lazy-loaded `<img>` with explicit CSP `img-src` allowlist for `streak-stats.demolab.com`. Isolated from homepage Lighthouse audit. See §4.3.
* **[RESOLVED]** Radar Chart: Re-implemented as an inline SVG `<RadarChart />` Svelte Island on `/stack` page, sourced from hardcoded `/src/data/competency.ts`. QuickChart.io external dependency eliminated. Full CSP compliance. Each axis includes a `methodology` string for self-assessment transparency. See §4.4.
* **[RESOLVED]** Metrics with confidence bounds: `Metric` type extended with `methodology: string` and `confidenceBound: { lower, upper, note }` fields. All existing metrics to be annotated with measurement methodology before first public deploy. Zod validation enforces `methodology` is ≥10 chars when provided. See §6.2 and §6.4.
