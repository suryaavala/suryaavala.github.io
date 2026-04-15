<!--
  MetricCounter — count-up animation that respects the no-JS / Lighthouse contract
  (plan §key decision #3).

  Contract:
    1. The DOM always contains the FINAL value text node — no-JS users and the
       Lighthouse crawler see the truth.
    2. On hydration we parse the numeric portion (preserving prefix/suffix like
       "67%", "0.87+") and animate from 0 → final on intersection.
    3. `prefers-reduced-motion` short-circuits the animation entirely.
    4. We never overshoot the final string — we always restore the original
       text on completion to handle string-only values like "Production".
-->

<script lang="ts">
  import { onMount } from 'svelte';

  /** Final, definitive metric value (string — may include suffix like "%", "+"). */
  export let finalValue: string;
  /** Aria label for screen readers (e.g. "67% decrease: feature lead times reduction"). */
  export let ariaLabel: string;
  /** Optional className passthrough so the parent owns typography. */
  let extraClass = '';
  export { extraClass as class };
  /** Optional inline style passthrough so the parent owns colour. */
  export let style: string = '';
  /** Animation duration in ms. */
  export let durationMs = 1200;

  let el: HTMLSpanElement;

  // Parse "67%" -> { num: 67, prefix: '', suffix: '%', isInteger: true }
  // Parse "0.87+" -> { num: 0.87, prefix: '', suffix: '+', isInteger: false }
  // Parse "Production" -> { num: NaN } → no animation, just static render.
  function parse(value: string) {
    const match = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
    if (!match) return { num: NaN, prefix: value, suffix: '', isInteger: true };
    const [, prefix, numStr, suffix] = match;
    const num = parseFloat(numStr);
    const isInteger = !numStr.includes('.');
    return { num, prefix: prefix ?? '', suffix: suffix ?? '', isInteger };
  }

  onMount(() => {
    if (!el) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const parsed = parse(finalValue);
    if (Number.isNaN(parsed.num)) return; // string-only metric — leave alone

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        animate(parsed);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  function animate(parsed: ReturnType<typeof parse>) {
    const start = performance.now();
    const { num, prefix, suffix, isInteger } = parsed;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // ease-out cubic — feels honest, not bouncy
      const eased = 1 - Math.pow(1 - t, 3);
      const current = num * eased;
      const display = isInteger ? Math.round(current).toString() : current.toFixed(1);
      if (el) el.textContent = `${prefix}${display}${suffix}`;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else if (el) {
        // Restore the exact original string to avoid floating-point drift.
        el.textContent = finalValue;
      }
    };

    requestAnimationFrame(tick);
  }
</script>

<span
  bind:this={el}
  class={extraClass}
  {style}
  aria-label={ariaLabel}
  aria-live="polite"
  role="img"
>
  {finalValue}
</span>
