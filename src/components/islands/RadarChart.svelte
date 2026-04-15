<!--
  RadarChart — pure-SVG competency radar (spec §4.4).

  Zero external dependencies. The polygon vertices are computed via cos/sin
  from the 8-axis competency data. Hover on a vertex reveals a tooltip with
  the methodology string for self-assessment transparency.

  Server-rendered SVG: the chart appears immediately on first paint without
  hydration. Hover-tooltip behaviour requires JS, so we still hydrate; if JS
  is disabled, all axis labels + scores remain readable on the SVG itself.
-->

<script lang="ts">
  import type { CompetencyAxis } from '@data/schemas';

  export let axes: CompetencyAxis[];
  /** SVG viewport. Component scales to container width. */
  export let size = 460;

  const center = size / 2;
  const radius = size / 2 - 60;

  // Convert axis index → (x, y) on the unit circle, rotated so axis 0 is at top.
  function pointFor(index: number, magnitude: number) {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    const r = radius * magnitude;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }

  // Concentric grid rings at 20/40/60/80/100.
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Build the data polygon points string.
  $: dataPoints = axes
    .map((a, i) => {
      const { x, y } = pointFor(i, a.score / 100);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  // Axis spokes.
  $: spokes = axes.map((_, i) => pointFor(i, 1));
  // Label positions (slightly past the outer ring).
  $: labels = axes.map((a, i) => ({ ...pointFor(i, 1.16), label: a.label, score: a.score }));
  // Vertex marker positions.
  $: markers = axes.map((a, i) => ({ ...pointFor(i, a.score / 100), axis: a }));

  let activeIndex: number | null = null;
</script>

<figure
  class="relative mx-auto w-full max-w-[460px]"
  aria-label="Competency radar across 8 self-assessed axes"
>
  <svg
    viewBox={`0 0 ${size} ${size}`}
    class="h-auto w-full"
    role="img"
    aria-labelledby="radar-title radar-desc"
  >
    <title id="radar-title">Competency radar — 8 axes, scores 0–100</title>
    <desc id="radar-desc">
      {axes.map((a) => `${a.label}: ${a.score} of 100`).join('. ')}
    </desc>

    <!-- Concentric grid rings -->
    {#each rings as r}
      <polygon
        points={axes
          .map((_, i) => {
            const { x, y } = pointFor(i, r);
            return `${x.toFixed(2)},${y.toFixed(2)}`;
          })
          .join(' ')}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="1"
      />
    {/each}

    <!-- Spokes -->
    {#each spokes as s}
      <line
        x1={center}
        y1={center}
        x2={s.x}
        y2={s.y}
        stroke="rgba(255,255,255,0.06)"
        stroke-width="1"
      />
    {/each}

    <!-- Data polygon -->
    <polygon
      points={dataPoints}
      fill="rgba(189,147,249,0.30)"
      stroke="#bd93f9"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- Vertex markers -->
    {#each markers as m, i}
      <circle
        cx={m.x}
        cy={m.y}
        r={activeIndex === i ? 6 : 4}
        fill="#f1fa8c"
        stroke="#0d1117"
        stroke-width="1.5"
        on:mouseenter={() => (activeIndex = i)}
        on:mouseleave={() => (activeIndex = null)}
        on:focus={() => (activeIndex = i)}
        on:blur={() => (activeIndex = null)}
        tabindex="0"
        role="button"
        aria-label={`${m.axis.label}: ${m.axis.score} of 100. ${m.axis.methodology}`}
        class="cursor-pointer transition-all duration-150"
      />
    {/each}

    <!-- Axis labels (numbered for fallback parsing; visually positioned around perimeter) -->
    {#each labels as l, i}
      <text
        x={l.x}
        y={l.y}
        text-anchor="middle"
        dominant-baseline="middle"
        class="font-mono"
        font-size="10"
        fill={activeIndex === i ? '#bd93f9' : '#8be9fd'}
      >
        {l.label}
      </text>
      <text
        x={l.x}
        y={l.y + 12}
        text-anchor="middle"
        dominant-baseline="middle"
        class="font-mono"
        font-size="9"
        fill="rgb(98,114,164)"
      >
        {l.score}/100
      </text>
    {/each}
  </svg>

  {#if activeIndex !== null}
    <figcaption
      class="absolute inset-x-0 bottom-0 translate-y-full rounded-md border border-border-base/60 bg-bg-surface/95 p-3 font-mono text-xs leading-relaxed text-text-primary shadow-glow"
      aria-live="polite"
    >
      <span class="text-brand">{axes[activeIndex]?.label}:</span>
      {axes[activeIndex]?.score}/100
      <span class="block pt-1 text-text-muted">{axes[activeIndex]?.methodology}</span>
    </figcaption>
  {/if}
</figure>
