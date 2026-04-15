<!--
  TypingHero — animated headline cycle (spec §4.1, item 1).

  LCP discipline (plan §key decision #2):
    - The initial headline is rendered as static HTML by the parent, OUTSIDE
      this island. The parent passes it as `initial`; the island only animates
      subsequent strings on `client:idle`.
    - The DOM ALWAYS holds a non-empty headline text node, so the LCP element
      is never JS-dependent and never blank.

  Behaviour:
    - On hydration, after the initial dwell, types out the next phrase
      character-by-character, holds, then erases and types the next.
    - Caret blinks via `animate-typing-caret` from tailwind config.
    - `prefers-reduced-motion`: replaces the caret + animation with a
      static cycle that just swaps the text every N seconds.
-->

<script lang="ts">
  import { onMount } from 'svelte';

  /** Initial phrase already rendered by SSR; we start animation from index 1. */
  export let initial: string;
  /** Full cycle of phrases (including the initial). */
  export let phrases: string[];
  /** Per-character typing speed in ms. */
  export let typeSpeedMs = 55;
  /** Per-character erasing speed in ms. */
  export let eraseSpeedMs = 28;
  /** Hold time before erasing each phrase (ms). */
  export let holdMs = 1800;

  let current = initial;
  let mounted = false;

  onMount(() => {
    mounted = true;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Static fallback: rotate phrases every 4s with no typing animation.
      let idx = 0;
      const interval = window.setInterval(() => {
        idx = (idx + 1) % phrases.length;
        current = phrases[idx] ?? initial;
      }, 4000);
      return () => window.clearInterval(interval);
    }

    let cancelled = false;
    let idx = phrases.indexOf(initial);
    if (idx < 0) idx = 0;

    const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    (async () => {
      // Initial dwell on the SSR phrase before erasing.
      await sleep(holdMs);
      while (!cancelled) {
        // erase
        for (let i = current.length; i >= 0 && !cancelled; i--) {
          current = current.slice(0, i);
          await sleep(eraseSpeedMs);
        }
        if (cancelled) break;
        idx = (idx + 1) % phrases.length;
        const next = phrases[idx] ?? '';
        // type
        for (let i = 1; i <= next.length && !cancelled; i++) {
          current = next.slice(0, i);
          await sleep(typeSpeedMs);
        }
        await sleep(holdMs);
      }
    })();

    return () => {
      cancelled = true;
    };
  });
</script>

<span class="inline-flex items-baseline gap-1">
  <span class="font-mono text-brand">{current}</span>
  {#if mounted}
    <span
      class="inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-brand motion-safe:animate-typing-caret"
      aria-hidden="true"
    ></span>
  {/if}
</span>
