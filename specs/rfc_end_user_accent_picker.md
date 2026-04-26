
# RFC: End-User Accent Picker for `suryaavala.com`

**Document Owner:** Staff Software Engineer / TPM

**Project:** `suryaavala.com` v2.1 — End-User Accent Personalisation

**Status:** DRAFT

**Source:** Resolves `[OPEN]` item in [02_design.md §7 line 573](02_design.md). Builds on the dev-only Tweaks panel defined in [02_design.md §3.5 lines 213–231](02_design.md) without modifying it.

**Date:** 2026-04-26

**Reviewers:** @VP_AIPlatform, @PrincipalArchitect, @StaffFullStack, @DistinguishedMentor

---

## 1. Context & Motivation

### 1.1 What exists today

The site ships with a **dev-only Tweaks panel** ([02_design.md §3.5](02_design.md), [app.js:700–732](design/suryaavala-com/project/app.js)) bottom-right, fixed-positioned, 260px wide. It exposes two controls:

| Control | Storage Key | Values |
|---|---|---|
| Homepage variant | `localStorage["sa-home-variant"]` | `safe` \| `bold` |
| Brand accent | `localStorage["sa-accent"]` | `purple` \| `cyan` \| `green` \| `orange` \| `pink` |

The accent control mutates `--brand` and `--brand-body` via `applyAccent()` ([app.js:41–46](design/suryaavala-com/project/app.js)):

```javascript
function applyAccent(k) {
  const a = ACCENT_MAP[k] || ACCENT_MAP.purple;
  document.documentElement.style.setProperty("--brand", a.brand);
  document.documentElement.style.setProperty("--brand-body", a.body);
}
```

Because every component that renders in the brand colour reads `var(--brand)` (Hero gradient, nav active-link underline, focus rings, project-card hover glow, radar polygon stroke, contact CTA, etc.), a single `documentElement.style.setProperty` recolours the entire site without any DOM rewrite.

The five preset `(brand, brand-body)` pairs (canonical reference, copied verbatim from [app.js:34–40](design/suryaavala-com/project/app.js)):

| Key      | `--brand`  | `--brand-body` |
|----------|------------|----------------|
| `purple` | `#bd93f9`  | `#c4a0ff`      |
| `cyan`   | `#8be9fd`  | `#b4f0ff`      |
| `green`  | `#50fa7b`  | `#7effa0`      |
| `orange` | `#ffb86c`  | `#ffce99`      |
| `pink`   | `#ff79c6`  | `#ffa2d6`      |

The panel itself is **gated** by a `parent.postMessage({type: "__activate_edit_mode"})` event from the Claude Design preview iframe ([app.js:721–727](design/suryaavala-com/project/app.js)). Because GH Pages → Cloudflare never sends that message, production users cannot reach it. The panel and its swatches are inert in the production DOM (CSS sets `.tweaks { display: none; }` until `.open` is added — [styles.css:409, 413](design/suryaavala-com/project/styles.css)).

### 1.2 Why a user-facing accent picker might matter

Three weak forces pull in this direction; one strong force pushes back.

**Pulls:**

1. **Audience-routing alignment.** [01_design.md §3.3](01_design.md) names three intended cohorts (recruiters / engineers / researchers). A picker plus query-param links lets the site nudge its own colour for a given share context — e.g. a LinkedIn post for executive recruiters carries `?accent=purple` (the brand default), an HN thread aimed at infra engineers carries `?accent=cyan` (`--infra` token). This is closer to "deliberate share-context theming" than personalisation.
2. **Personal expression / dwell time.** A small fraction of returning visitors enjoy theming controls (cf. GitHub theme picker, Linear's icon themes). Optionality is cheap in dwell-seconds even when used by <2% of sessions.
3. **Brand cohesion across share links.** When the site is screenshot-shared (Twitter card, LinkedIn preview, Slack unfurl), the OG image is the visual anchor. If a user sets `cyan` and then shares the URL, their preview should ideally match what they shared from. Otherwise the OG and the destination disagree, undermining the "I curated this" affordance the picker creates in the first place.

**Pushes back:**

1. **Design integrity.** The whole point of curated accents is that the canonical `purple` carries identity. Letting users freely pick risks fragmenting "what the site looks like" in screenshots and discussions. We *deliberately* ship five presets — not a colour wheel — to hold the line on cohesion.
2. **Analytics noise.** Per-session accent state pollutes session recordings and heat-map composites. Mitigated by tracking the dimension explicitly (see §9), not by avoiding it.
3. **OG image complexity.** The default GH Pages/Cloudflare deployment pipeline ships a *static* OG asset. Per-accent OGs cost build time, edge compute, or both. See §6.

The remit of this RFC is to land **(a)** a discoverability surface, **(b)** a query-param fallback, and **(c)** an OG-image policy — opinionated recommendations, not just option enumeration.

---

## 2. Goals / Non-Goals

### 2.1 Goals

* **G1.** Ship a production-visible UI surface that lets users pick any of the **five existing presets** and persist their choice across navigations and reloads.
* **G2.** Ship a `?accent=<key>` URL query-param that produces the same end state as a manual pick — usable for direct linking, share buttons, and QR codes.
* **G3.** Resolve the OG-image question with one decision and one rollback path.
* **G4.** Coexist with the dev-only Tweaks panel from [02_design.md §3.5](02_design.md). Both surfaces write to the same `localStorage["sa-accent"]` key; the dev panel remains dev-only.
* **G5.** Preserve all accessibility properties of the v2 design — WCAG AA contrast on every preset, focus-visible behaviour on the new control, `prefers-reduced-motion` handling on the swap transition.
* **G6.** Add zero new external dependencies. Implementation is hand-authored Astro + Svelte using existing tokens.

### 2.2 Non-Goals

* **NG1.** No full theme builder. No colour-wheel input, no hex entry, no per-channel HSL sliders.
* **NG2.** No new accent presets. Five only. If a sixth preset is ever needed, it gets its own RFC and a contrast audit ([01_design.md §3.1](01_design.md) WCAG note).
* **NG3.** No per-page accent overrides. The accent is **site-wide and per-user**, not per-page or per-route. A user who picked `cyan` sees `cyan` everywhere — including `/runtime`, `/stack`, `/notes`, etc.
* **NG4.** No theme builder for the **homepage variant** (`safe`/`bold`). That stays gated to the dev panel for v2.1. The variant decision is editorial; the accent decision is cosmetic.
* **NG5.** No change to the dev Tweaks panel UX, layout, or activation protocol. This RFC adds a *parallel* user surface, not a replacement.
* **NG6.** No server-side personalisation, no auth, no per-user persistence beyond `localStorage`. A user clearing site data loses their preference, by design.
* **NG7.** No cookie banner. `localStorage["sa-accent"]` is a strictly-necessary functional preference (UI personalisation, no PII, no tracking) — same legal posture as the existing `sa-theme` and `sa-home-variant` keys.

---

## 3. Design Options for (a) — Discoverability Surface

We need *one* place users can find the picker. Five candidates were considered:

| # | Option | Discoverability | Visual noise | Implementation cost | Mobile fit | Notes |
|---|---|---|---|---|---|---|
| 3.1 | **Nav-mounted swatch row** (5 dots inline next to theme toggle) | High | Medium-high | Low | Poor — eats sticky-nav width budget | Sticky nav is already dense (mono brand mark, slash-prefixed links, theme toggle, Open-to-Work CTA — [02_design.md §3.2 Glass Nav](02_design.md)). Adding 5 swatches at ≤1024px collides with the CTA, which already drops out below 1024px. |
| 3.2 | **Footer-mounted picker** (5 swatches in a `.footer` row) | Low–medium | Low | Low | Good | Below the fold for first-paint. Discoverable for engaged scrollers; invisible to bouncers. Cheap. |
| 3.3 | **Dedicated `/preferences` route** | Very low | Zero on every other page | Medium (one new route, page chrome, nav entry) | Good | Bloats site map (currently 6 routes — [02_design.md §3.3](02_design.md)). Discoverability requires a nav entry, looping back to 3.1's problem. Overkill for one toggle and five swatches. |
| 3.4 | **Hidden-until-keypress** (`?` opens a tray) | Very low for non-keyboard users | Zero | Low | Bad — no on-screen affordance on touch | Cute easter egg. Unsuitable as the *primary* surface; could supplement another. |
| 3.5 | **Footer command palette** (`Cmd-K` style, channels + accents + theme) | Low–medium | Zero on first paint | High | Awkward (requires pinned trigger) | Over-engineered for one decision. Worth reconsidering when the surface count exceeds three. |

### 3.6 Recommendation: **Footer-mounted picker (3.2), with a keyboard-shortcut accelerator (3.4) layered on top**

Rationale:

* **Honesty about who uses it.** Users who care about theming will scroll for it; users who don't shouldn't carry the cognitive cost in the nav. The footer is the conventional home for preferences (cf. dev.to, Stripe Docs, Tailwind).
* **Nav stays clean.** The Glass Nav row is already operating at its visual budget — five 24px swatches in there would force the Open-to-Work CTA off the layout earlier than 1024px, hurting the conversion signal.
* **Power-user accelerator costs ~10 LOC.** Pressing `?` (or `Shift-/`) scrolls smoothly to the footer picker and focuses the first swatch. This makes the feature feel "discovered" without making it loud. It is an accessibility win for keyboard users and a personality win for the developer-native audience.
* **Mobile parity.** The footer is reachable on mobile by definition (it's where you end up). The nav option has no graceful fallback on `≤640px` — mobile users would get no picker at all.

### 3.7 Visual & layout sketch (footer picker)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  © 2026 Surya Avala     ·     /architecture · /runtime · /stack · ...    │
│                                                                          │
│  Accent  ●  ●  ●  ●  ●     Theme  [☀ / ☾]                                │
│         purple cyan green orange pink                                    │
│                                                                          │
│  press ?  to jump here                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

* Five 24×24px swatches identical in dimension/markup to the existing dev-panel `.swatches button` ([styles.css:455–464](design/suryaavala-com/project/styles.css)) — reuses the CSS, no new tokens.
* The active swatch wears the same `.on` class (border `var(--text)` at 2px) used by the dev panel ([styles.css:464](design/suryaavala-com/project/styles.css)). This keeps the visual contract consistent across both surfaces.
* `aria-label` per swatch: `"Set accent to {name}"`. The active swatch additionally carries `aria-pressed="true"`.
* The "press `?` to jump here" hint is shown only on viewports ≥1024px and only on first session (gated by a `localStorage["sa-accent-hint-dismissed"]` flag flipped after first interaction or 5s view).

### 3.8 What the footer picker does NOT do

* It does **not** let users change the homepage variant. That stays dev-only.
* It does **not** let users enter a custom hex.
* It does **not** announce itself with a banner, toast, or first-visit modal. Discovery is via scroll, share-link param, or `?` keypress.

---

## 4. Design Options for (b) — URL Query Param

### 4.1 Param shape

Three candidate shapes:

| Shape | Pros | Cons |
|---|---|---|
| `?accent=cyan` | Self-describing, matches preset key namespace from [app.js:34–40](design/suryaavala-com/project/app.js), grep-friendly in analytics | Only handles accent; we may want similar mechanics for theme later |
| `?theme=cyan` | Reuses the `theme` mental model | Conflates light/dark theme with accent — the site already has a `sa-theme` storage key that means light vs dark. Collision risk. |
| `?ui=cyan-dark` | Compact, multi-axis-ready | Opaque, hard to share verbally, requires a parser |

**Recommendation: `?accent=<key>`.** Direct mapping to `ACCENT_MAP` keys, no parsing, no collision with the existing `sa-theme` semantic. If later we need a light/dark override via URL, it gets a separate `?theme=light|dark` param.

### 4.2 Validation

* Allowed values: exactly the five keys in `ACCENT_MAP` — `purple` | `cyan` | `green` | `orange` | `pink`.
* Unknown values are **silently ignored** (not redirected, not error-toasted). Defence against share-link bit-rot and link-shortener mutilation.
* Case-insensitive on read (`?accent=CYAN` works); we lowercase before lookup.

### 4.3 Precedence

The interesting question: what wins between the URL param, `localStorage`, and the per-document default?

Three candidate precedence rules:

| Rule | Behaviour | Pros | Cons |
|---|---|---|---|
| **(A) URL > localStorage > default**, consume-and-store | First load with `?accent=cyan` writes `cyan` to localStorage and strips the param from the URL via `history.replaceState`. Subsequent navigations see `cyan` in storage. | Maximum continuity — share link instantly becomes "your" theme. Clean URL after first paint. | Surprise: a user who *had* `pink` set, then clicked a `?accent=cyan` link, has now silently lost their preference. |
| **(B) URL > localStorage > default**, ephemeral (read every load, never stored) | The param wins for that single page-view; on next navigation without the param, localStorage (or default) takes over. | No silent override of saved preferences. Predictable. | Sharing a link doesn't give the recipient a *persistent* accent. They have to use the picker themselves to keep it. |
| **(C) localStorage > URL > default** | If the user has *ever* picked an accent, that wins forever. Param only seeds the *first* visit. | Preserves "I made a choice." Shared links work for fresh visitors. | Returning visitors with a stale localStorage value get a worse share-link experience than expected. |

### 4.4 Recommendation: Hybrid of (A) and (B) — **URL wins for the session; we offer to persist**

The mechanic:

1. On first paint, read `?accent=<k>` from the URL.
2. If `<k>` is valid:
   * Apply it immediately via `applyAccent(k)` ([app.js:41–46](design/suryaavala-com/project/app.js)).
   * Strip the param from the URL via `history.replaceState` (clean address bar, clean copy-paste, OG re-share continues to work because the param is consumed *after* the OG fetch).
   * **Do not write it to localStorage.** The session state diverges from the persisted state — exactly as in option (B).
3. Render a small, dismissible footer toast: `"Trying out cyan. Keep this accent?  [Keep]  [Dismiss]"`.
   * `Keep` → write `localStorage["sa-accent"] = k`, remove the toast.
   * `Dismiss` → revert to the localStorage value (or default `purple`) on next navigation, remove the toast.
   * Auto-dismiss after 12s (no implicit save — silence means revert).
4. If `?accent=<k>` is invalid or absent, behave normally: read `localStorage["sa-accent"]` or fall back to `purple`.

This is option (B) with a one-tap upgrade to (A). It is the only rule that:

* Lets share-links instantly recolour the destination (G2).
* Never silently overwrites a user's saved choice (Goal G6 spirit).
* Keeps the URL clean for re-share / SEO.
* Gives the recipient explicit consent before persistence.

The toast is a Svelte island, accent-tinted to the param-supplied colour (so the recipient sees the proposed colour on the toast itself). It uses the same focus-trap and keyboard-dismiss (`Esc`) primitives as the Contact Modal ([02_design.md §3.2 Contact Modal row](02_design.md), [app.js:734–817](design/suryaavala-com/project/app.js)) — minus the focus trap (toast is non-modal).

### 4.5 What about no-JS users?

The query param is processed in JS. No-JS users get the default purple regardless of `?accent=cyan`. This is acceptable: the entire `applyAccent` pipeline is JS-only ([app.js:41–46](design/suryaavala-com/project/app.js)) and the no-JS audience is already accepting the v2 site without animations, count-ups, or the typing hero. Adding an SSR-time accent override would require route-level pre-rendering of every accent variant — disproportionate for the audience size.

---

## 5. Decision for (c) — OG Image

### 5.1 The setup

The Open Graph image is a single static asset shipped from `/public/og.png` (1200×630, generated at build time per [01_design.md §5.2 Open Graph](01_design.md)). It carries the site logo, name, role line, and a brand-purple rim/glow.

Three candidate strategies:

| Option | Build-time cost | Runtime cost | SEO impact | Social-share fidelity | Operational complexity |
|---|---|---|---|---|---|
| **(i) One canonical purple OG** | 0 | 0 | None (canonical OG cached by Facebook, LinkedIn, Twitter, Slack) | Low: share `?accent=cyan`, recipient sees purple OG, then a cyan site | None |
| **(ii) Five static OGs, picked via param** | 5× build time for OG generation, 5× asset weight in `/public` | None (URL maps to file) | Slight: each accent has its own canonical OG URL — Twitter/Slack will cache them independently | High: share matches site colour | Medium: build script must produce 5 OGs and `<meta og:image>` must be set per param at SSR time |
| **(iii) Edge-generated OG via Cloudflare Workers** | 0 (no static assets) | ~50–200ms cold, free tier covers <100k req/day | Higher: every request to `/og.png?accent=cyan` is a Worker invocation; URL-cache discipline is essential | High: instant per-accent OGs, plus future variant axes (theme, etc.) | High: introduces a Worker to a previously zero-runtime stack — violates [02_design.md §2.2](02_design.md) "no runtime fetch" principle |

### 5.2 Recommendation: **(i) One canonical purple OG — for v2.1**

Rationale, in order of weight:

1. **Brand cohesion is the *whole point* of curating five presets.** `purple` is identity. The OG is the identity-bearing surface of every share. Letting a user repaint the OG at will is a category mistake — it converts the site's visual brand into per-user marketing collateral. The OG should always say "this is suryaavala.com," not "this is suryaavala.com as filtered by a stranger's preferences."
2. **Cost vs benefit.** Option (ii) ships 5× the OG asset weight and complicates the SSR pipeline for an effect most users will never notice. Option (iii) introduces a Worker — runtime infrastructure — into a stack whose explicit non-goal in [02_design.md §2.2](02_design.md) is *no runtime fetch*. Both costs are real; the benefit is "the share image matches the site for users who set a custom accent."
3. **The hybrid precedence rule (§4.4) absorbs the inconsistency cleanly.** When a recipient clicks a `?accent=cyan` link:
   * The OG that pulled them in was purple (canonical brand).
   * The site they land on is cyan (because the URL says so).
   * The toast asks: "Keep this accent?" — converting the discrepancy into an *explanation* rather than a glitch.
4. **SEO discipline.** A single canonical OG keeps Twitter card / LinkedIn / Slack unfurl caches consistent. Multi-OG strategies have a long history of cache-coherence bugs (Slack caches by URL, not by query-param; Twitter dedupes aggressively). Not worth it.
5. **Reversibility.** If post-launch analytics show >5% of sessions arriving via `?accent=` URLs *and* the brand team requests per-accent OGs, we can ship option (ii) as a follow-on RFC. Option (iii) remains the long-tail option if/when we add an OG that is itself dynamic for other reasons (per-page, per-note, per-role).

### 5.3 Out of scope for this RFC, flagged for the next one

* Per-page OG variations (e.g. `/runtime` showing the timeline, `/stack` showing the radar chart). Currently every route uses the homepage OG. That is an editorial gap unrelated to accent. If addressed in a future RFC, edge-generation (option iii) becomes the obvious vehicle.

---

## 6. Implementation Sketch

### 6.1 Files touched

| File | Change type | Notes |
|---|---|---|
| `/src/components/AccentPicker.svelte` | **NEW** Svelte island | Footer picker UI |
| `/src/components/AccentToast.svelte` | **NEW** Svelte island | "Keep this accent?" prompt |
| `/src/lib/accent.ts` | **NEW** TS module | `ACCENT_MAP`, `applyAccent`, `readAccentParam`, `applyFromContext` |
| `/src/layouts/Layout.astro` | EDIT | Mount `<AccentPicker>` in footer; mount `<AccentToast>` once at root |
| `/src/styles/tokens.css` | UNCHANGED | No new tokens — reuses `--brand`, `--brand-body` |
| `/src/data/accent.ts` (or co-located) | NEW const | Single source of truth for `ACCENT_MAP` — *replaces the duplicated map in [app.js:34–40](design/suryaavala-com/project/app.js)* once we port to Astro |
| `tweaks/Tweaks.svelte` (existing dev panel) | EDIT (1 LOC) | Import `ACCENT_MAP` from `/src/lib/accent.ts` instead of duplicating it |

The dev Tweaks panel and the user picker share the **same** `ACCENT_MAP` constant, the **same** `applyAccent()` function, and the **same** `localStorage["sa-accent"]` key. A change to any preset's hex automatically propagates to both surfaces. This is the load-bearing migration commitment of this RFC.

### 6.2 The accent module

```typescript
// /src/lib/accent.ts
export type AccentKey = 'purple' | 'cyan' | 'green' | 'orange' | 'pink';

export const ACCENT_MAP: Record<AccentKey, { brand: string; body: string }> = {
  purple: { brand: '#bd93f9', body: '#c4a0ff' },
  cyan:   { brand: '#8be9fd', body: '#b4f0ff' },
  green:  { brand: '#50fa7b', body: '#7effa0' },
  orange: { brand: '#ffb86c', body: '#ffce99' },
  pink:   { brand: '#ff79c6', body: '#ffa2d6' },
};

export const ACCENT_KEYS = Object.keys(ACCENT_MAP) as AccentKey[];
const STORAGE_KEY = 'sa-accent';
const DEFAULT_ACCENT: AccentKey = 'purple';

export function isAccentKey(s: unknown): s is AccentKey {
  return typeof s === 'string' && (ACCENT_KEYS as string[]).includes(s.toLowerCase());
}

export function applyAccent(k: AccentKey): void {
  const a = ACCENT_MAP[k];
  document.documentElement.style.setProperty('--brand',      a.brand);
  document.documentElement.style.setProperty('--brand-body', a.body);
}

export function readAccentParam(url: URL): AccentKey | null {
  const raw = url.searchParams.get('accent');
  if (!raw) return null;
  const lower = raw.toLowerCase();
  return isAccentKey(lower) ? (lower as AccentKey) : null;
}

export function readStoredAccent(): AccentKey {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isAccentKey(v) ? (v as AccentKey) : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;            // SSR / private mode / disabled storage
  }
}

export function persistAccent(k: AccentKey): void {
  try { localStorage.setItem(STORAGE_KEY, k); } catch { /* swallow */ }
}

/**
 * Boot-time entrypoint. Returns whether a query-param override is active
 * (so the layout can decide whether to mount the "Keep this accent?" toast).
 */
export function bootAccent(): { active: AccentKey; fromParam: boolean } {
  const url = new URL(window.location.href);
  const fromParam = readAccentParam(url);

  if (fromParam) {
    applyAccent(fromParam);
    // Strip the param from the URL — non-destructive for SSR cache, OG, and copy-paste UX.
    url.searchParams.delete('accent');
    history.replaceState({}, '', url.toString());
    return { active: fromParam, fromParam: true };
  }

  const stored = readStoredAccent();
  applyAccent(stored);
  return { active: stored, fromParam: false };
}
```

### 6.3 Inline pre-FOUC hook (in `<head>`)

To prevent a flash of purple before the swap runs (FOUC), `bootAccent()` is called from an inline blocking script in `<head>`, identical in spirit to the existing pre-FOUC theme script lifted from [index.html:15–21](design/suryaavala-com/project/index.html):

```html
<script is:inline>
  (function() {
    try {
      var url = new URL(location.href);
      var raw = url.searchParams.get('accent');
      var MAP = {
        purple: { brand: '#bd93f9', body: '#c4a0ff' },
        cyan:   { brand: '#8be9fd', body: '#b4f0ff' },
        green:  { brand: '#50fa7b', body: '#7effa0' },
        orange: { brand: '#ffb86c', body: '#ffce99' },
        pink:   { brand: '#ff79c6', body: '#ffa2d6' },
      };
      var k = raw && MAP[raw.toLowerCase()] ? raw.toLowerCase()
              : (localStorage.getItem('sa-accent') || 'purple');
      if (MAP[k]) {
        document.documentElement.style.setProperty('--brand',      MAP[k].brand);
        document.documentElement.style.setProperty('--brand-body', MAP[k].body);
      }
    } catch(e) {}
  })();
</script>
```

This duplicates the `ACCENT_MAP` constant once (intentionally) so the head-script remains zero-import. CI must enforce parity between this inline map and `/src/lib/accent.ts` via a unit test (`scripts/check-accent-parity.ts`) that string-greps both files and asserts identical hex pairs.

### 6.4 The footer picker (Svelte sketch)

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { ACCENT_KEYS, ACCENT_MAP, applyAccent, persistAccent, readStoredAccent }
    from '../lib/accent';
  import type { AccentKey } from '../lib/accent';

  let active: AccentKey = 'purple';

  onMount(() => {
    active = readStoredAccent();
    // Keyboard accelerator: '?' scrolls to and focuses the picker.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.target?.matches?.('input,textarea,[contenteditable]')) {
        document.getElementById('accent-picker')?.scrollIntoView({ behavior: 'smooth' });
        (document.querySelector<HTMLButtonElement>('#accent-picker button'))?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function pick(k: AccentKey) {
    active = k;
    applyAccent(k);
    persistAccent(k);
    // Emit analytics — see §9.
    window.dispatchEvent(new CustomEvent('accent:changed',
      { detail: { accent: k, source: 'picker' } }));
  }
</script>

<fieldset id="accent-picker" class="accent-picker swatches">
  <legend>Accent</legend>
  {#each ACCENT_KEYS as key}
    <button
      type="button"
      class:on={active === key}
      aria-label={`Set accent to ${key}`}
      aria-pressed={active === key}
      style={`background: ${ACCENT_MAP[key].brand};`}
      on:click={() => pick(key)}
    />
  {/each}
</fieldset>
```

The styles reuse `.swatches` and `.swatches button` from [styles.css:455–464](design/suryaavala-com/project/styles.css). A new wrapper class `.accent-picker` only handles footer-row spacing and the `<legend>` label — no token changes.

### 6.5 What changes in the existing prototype `applyAccent()` call site

The function body at [app.js:41–46](design/suryaavala-com/project/app.js) is reused **verbatim** in `/src/lib/accent.ts`. The only behavioural delta is the addition of:

* `readAccentParam(url)` — new
* `bootAccent()` — new
* The pre-FOUC `<script is:inline>` block — new

Crucially, the existing `initAccent()` at [app.js:46](design/suryaavala-com/project/app.js) becomes a thin wrapper around `bootAccent()` — it no longer needs to read localStorage directly, because `bootAccent()` does. The dev Tweaks panel's swatch click handler at [app.js:714–719](design/suryaavala-com/project/app.js) imports `applyAccent` and `persistAccent` from `/src/lib/accent.ts` instead of mutating localStorage directly. The dev panel becomes a *consumer* of the same API the user picker uses.

---

## 7. Accessibility Considerations

### 7.1 Contrast across all five accents

The light-mode token sheet ([02_design.md §3.1 lines 113–138](02_design.md)) was tuned for `purple` as `--brand`. Three of the five presets (`green`, `orange`, `pink`) have AA-borderline contrast ratios against the `#ffffff` light-mode card surface when used as small body text.

**Mitigation:** the `--brand-body` token is the brightened/darkened variant explicitly intended for "body-size purple text" ([01_design.md §3.1 WCAG note](01_design.md)). Every component that renders accent at body size already reads `--brand-body`, not `--brand`. We must **expand the same `--brand-body` discipline to the other four accents** and ship light-mode variants for each:

| Key      | `--brand` (dark) | `--brand-body` (dark) | `--brand` (light) | `--brand-body` (light) |
|----------|------------------|------------------------|-------------------|-------------------------|
| `purple` | `#bd93f9`        | `#c4a0ff`              | `#5b21b6`         | `#5b21b6`               |
| `cyan`   | `#8be9fd`        | `#b4f0ff`              | `#075e7a`         | `#075e7a`               |
| `green`  | `#50fa7b`        | `#7effa0`              | `#0f6b34`         | `#0f6b34`               |
| `orange` | `#ffb86c`        | `#ffce99`              | `#9a3412`         | `#9a3412`               |
| `pink`   | `#ff79c6`        | `#ffa2d6`              | `#9d174d`         | `#9d174d`               |

The light-mode hexes on the right come directly from the v2 light-mode token sheet ([02_design.md §3.1 lines 127–134](02_design.md)) — those are already shipped, AA-tuned, deeper variants. `applyAccent()` checks `documentElement.classList.contains('light')` and applies the appropriate column. CI runs an automated contrast audit (`axe-core` via `@playwright/test`) against all 10 combinations (5 accents × 2 themes) before every release.

### 7.2 Focus-visible

The site-wide `focus-visible` rule from [02_design.md §5.1](02_design.md) is `outline: 2px solid var(--brand)`. When a user picks `cyan`, every focus ring on the site instantly goes cyan. This is intended and desirable — it reinforces the accent choice on the action surface that needs it most.

The picker swatches themselves must show a focus ring **distinct** from their fill colour, otherwise the cyan swatch with a cyan focus ring is invisible. Solution: focus-ring on swatches uses `var(--text)` not `var(--brand)`, scoped via:

```css
.accent-picker button:focus-visible {
  outline: 2px solid var(--text);
  outline-offset: 3px;
}
```

### 7.3 Reduced motion

The accent swap is currently instantaneous — `applyAccent()` mutates inline styles, no transitions on `--brand` consumers. This is good for `prefers-reduced-motion: reduce`. **No additional motion is added by this RFC.** The footer picker's `:hover { transform: scale(1.12) }` ([styles.css:463](design/suryaavala-com/project/styles.css)) is already wrapped by the existing reduced-motion guard in [styles.css:118–124](design/suryaavala-com/project/styles.css).

The "Keep this accent?" toast uses a 200ms slide-in. It must be wrapped in:

```css
@media (prefers-reduced-motion: reduce) {
  .accent-toast { animation: none; opacity: 1; transform: none; }
}
```

### 7.4 Screen-reader semantics

* The picker is a `<fieldset>` with a `<legend>Accent</legend>`. SR users hear "Accent, group, 5 buttons."
* Each swatch is `<button aria-label="Set accent to cyan" aria-pressed="true|false">`. The current selection is announced.
* The `?` keyboard shortcut is documented in a visually-hidden `<p class="sr-only">` paragraph adjacent to the picker.
* The toast is `role="status" aria-live="polite"`, *not* `role="alert"` — it's an offer, not an emergency.

---

## 8. Analytics

The whole point of shipping the picker is to learn whether it matters. Without analytics, we can't decide whether to invest further (per-accent OGs, accent-based A/B tests, etc.).

### 8.1 Events

Three events. All fired client-side via the existing analytics shim (assumed: a thin wrapper over the chosen analytics provider; if no analytics provider is configured at production deploy, these become no-ops via feature flag).

| Event name | When fired | Properties |
|---|---|---|
| `accent_changed` | Any accent change (picker or dev panel) | `{ accent: AccentKey, source: 'picker' \| 'param' \| 'dev_panel', previous: AccentKey \| null }` |
| `accent_param_seen` | First paint where `?accent=<k>` was in the URL (whether or not the value was valid) | `{ raw: string, valid: boolean, accent: AccentKey \| null, referrer_host: string }` |
| `accent_keep_decision` | User clicks `Keep` or `Dismiss` on the toast (or auto-dismiss fires) | `{ accent: AccentKey, decision: 'keep' \| 'dismiss' \| 'auto_dismiss', dwell_ms: number }` |

### 8.2 Dimensions on every page-view

A single dimension `accent` (one of the five keys) is attached to every page-view event. This lets us slice existing metrics (bounce rate, scroll depth, `/ping` modal opens, time-on-page) by the user's chosen accent. **Critical**: this dimension reflects the *active* accent at the moment of the page-view, not any historical preference. This avoids retroactive contamination of the existing dataset.

### 8.3 What we will look at after 4 weeks

| Question | Metric |
|---|---|
| Does anyone use it? | `% sessions with ≥1 accent_changed event` |
| Which accents are picked? | Distribution of `accent_changed.accent` for `source = 'picker'` |
| Does the share-link mechanic work? | `count(accent_param_seen.valid=true) / count(sessions)` |
| Does the toast convert? | `count(accent_keep_decision.decision='keep') / count(accent_param_seen.valid=true)` |
| Does choice correlate with behaviour? | `bounce_rate by dimension(accent)`; `/ping` modal-open rate by `dimension(accent)` |

### 8.4 Privacy

* No PII stored. Accent key is a single enum, not even a free-form value (the `accent_param_seen.raw` field is the only place a raw user input appears, and it's truncated to 32 chars).
* No fingerprinting use of accent — explicitly **not** combined with viewport, UA, or theme to construct a synthetic ID. A note in the analytics SOP enforces this.
* No cross-site / cross-domain transmission of the accent key.

---

## 9. Migration Plan

### 9.1 Coexistence with the dev Tweaks panel

Both surfaces:

* Read from and write to the same `localStorage["sa-accent"]` key.
* Call the same `applyAccent()` function from `/src/lib/accent.ts`.
* Use the same five-preset `ACCENT_MAP`.

This means a developer running the Claude Design preview can change the accent in either place and observe the same end state. The dev panel remains gated by `parent.postMessage({type: "__activate_edit_mode"})`; production users never see it. The user picker is always visible in the footer in production. There is no scenario where both surfaces disagree about the active accent because there is one source of truth.

### 9.2 Phased rollout

| Phase | What ships | Gating | Verification |
|---|---|---|---|
| **0 — Refactor** | Extract `ACCENT_MAP`, `applyAccent`, `persistAccent` into `/src/lib/accent.ts`. Dev panel imports from the new module. **Behavioural no-op.** | None | Existing Tweaks panel still works in preview. Storybook snapshot of all 5 dev-panel swatches unchanged. |
| **1 — Pre-FOUC hook + boot logic** | Inline head script. `bootAccent()` runs on every page. **No new UI surface yet.** | None | Manual: `?accent=cyan` URL paints cyan immediately, strips param, no toast (toast not shipped yet). |
| **2 — Footer picker** | `<AccentPicker>` Svelte island mounted in `<Layout>` footer. | None | Playwright e2e: pick each of 5 accents, verify CSS variables update, verify localStorage write, verify nav active-link colour reflects the change. |
| **3 — Toast + keyboard accelerator** | `<AccentToast>` mounted at root; `?` keypress handler. | None | E2e: arrive at `?accent=cyan`, see toast, click Keep, verify localStorage. Same flow with Dismiss + auto-dismiss. |
| **4 — Analytics** | Three events wired through analytics shim. `accent` dimension on page-views. | Behind a `ANALYTICS_ENABLED` env flag, defaulting on in production. | Verify events appear in analytics provider dashboard within 1h of canary deploy. |

Each phase is independently revertible. If phase 3 misbehaves (toast covers a layout element, focus mis-restored, etc.) we revert just phase 3 without touching phases 0–2.

### 9.3 Backwards compatibility with shared links

There were no `?accent=*` links in production prior to this RFC. Phase 1 is the moment the param becomes meaningful. The team should announce the new param shape in `/notes` (a short post: *"You can now share suryaavala.com with a personal accent"*) only **after** Phase 4 lands, so analytics captures the attribution.

### 9.4 Rollback plan

If the picker creates more support burden than value (unlikely; flagged here for completeness):

* Remove `<AccentPicker>` from `<Layout>` (1-line revert).
* Remove the inline pre-FOUC script (1-line revert).
* `localStorage["sa-accent"]` values written by users persist harmlessly — the dev panel can still read them, and they have no effect because the production site reverts to the hard-coded `--brand: #bd93f9`.
* No data migration required.

---

## 10. Open Questions / Risks

* **[OPEN]** Picker placement on `/notes` long-form pages: the footer there is far below the fold for any long article. Should the picker be sticky on `/notes` only? Out of scope for this RFC; note for v2.2.
* **[OPEN]** Mobile footer-picker affordance: the `?` keyboard accelerator does not exist on mobile. Should there be a small "Theme" entry in a hamburger menu we don't yet have? Currently the site has no hamburger nav; adding one is bigger than this RFC. Defer.
* **[OPEN]** Per-accent OG (option 5.1.ii) revisit: if `accent_param_seen` exceeds 5% of sessions over 4 weeks, escalate to a follow-on RFC for static per-accent OGs.
* **[OPEN]** Light-mode contrast audit gap: the four non-purple accents have light-mode hexes proposed in §7.1, but those hexes have not been independently verified against every consumer of `--brand` in light mode (e.g., the Hero gradient-clipped text where contrast is harder to compute analytically). Phase 2 acceptance includes a manual axe-core sweep across all 10 (accent × theme) combinations, with any failure blocking the phase.
* **[RISK — low]** Cache poisoning via `?accent=`: a malicious link could embed `?accent=<key>` to manipulate a user's first impression. Mitigated because (i) only five values are accepted, (ii) the value is silently ignored if invalid, (iii) the toast asks before persisting, (iv) the worst-case impact is a different brand colour for one session.
* **[RISK — low]** Analytics dimension cardinality: adding an `accent` dimension to every page-view multiplies session-level reports by 5. Most analytics providers handle this trivially; flagged for completeness if our provider has cardinality limits.
* **[RISK — medium]** `ACCENT_MAP` drift between the inline pre-FOUC script (§6.3) and `/src/lib/accent.ts` (§6.2). **Mitigation:** dedicated CI test (`scripts/check-accent-parity.ts`) parses both and fails the build on mismatch. Required gate for Phase 1.

---

## 11. Decision Summary

| Sub-question | Recommendation |
|---|---|
| **(a)** Discoverability surface | **Footer-mounted picker** with a `?` keyboard accelerator. Reuses existing `.swatches` styles ([styles.css:455–464](design/suryaavala-com/project/styles.css)). No nav changes. |
| **(b)** URL query-param shape & precedence | **`?accent=<key>`** with the **hybrid precedence rule**: param applies for the session, strip from URL, do not auto-persist; show a "Keep this accent?" toast that converts to persistence on user consent. |
| **(c)** OG image strategy | **One canonical purple OG** for v2.1. Brand cohesion + zero runtime cost + reversible. Revisit per-accent OGs only if `accent_param_seen` exceeds 5% of sessions in the 4-week post-launch window. |
