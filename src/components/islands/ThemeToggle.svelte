<!--
  ThemeToggle — the only island loaded with `client:load` (plan §key decision #1).

  Why client:load (not client:idle):
    1. The user might toggle within the first 100ms; visible affordance must be reactive.
    2. The inline FOUC script in BaseLayout has already set the correct class — this
       island only needs to mirror that state and react to user clicks.

  Persistence model:
    - localStorage.theme: 'light' | 'dark'
    - prefers-color-scheme as fallback
    - System changes propagate iff the user has not made an explicit choice.
-->

<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'light' | 'dark';
  let theme: Theme = 'dark';
  let mounted = false;

  onMount(() => {
    // Mirror the post-FOUC state set by BaseLayout's inline script.
    theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    mounted = true;

    // Listen for system theme changes only if the user hasn't expressed a preference.
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  });

  function applyTheme(next: Theme) {
    theme = next;
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
  }

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode etc. — silently ignore */
    }
    applyTheme(next);
  }
</script>

<button
  type="button"
  on:click={toggle}
  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
  aria-pressed={theme === 'dark'}
  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
  class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-base/60 bg-bg-surface/80 text-text-primary transition-colors hover:border-brand hover:text-brand"
>
  {#if !mounted}
    <!-- Pre-hydration glyph: matches dark default to avoid layout shift. -->
    <span aria-hidden="true">◐</span>
  {:else if theme === 'dark'}
    <!-- Sun icon — clicking switches to light. -->
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      ></path>
    </svg>
  {:else}
    <!-- Moon icon — clicking switches to dark. -->
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  {/if}
</button>
