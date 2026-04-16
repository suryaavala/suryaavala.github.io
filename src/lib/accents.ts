/**
 * Semantic accent tokens — single source for mapping logical colour names
 * to CSS custom properties defined in global.css.
 *
 * Data files store token names ('brand', 'infra', …) instead of hex values.
 * Components resolve tokens to `rgb(var(--accent-*))` via the helpers here,
 * so accents automatically adapt when the theme switches between dark/light.
 */

export const ACCENT_TOKENS = [
  'brand',
  'status',
  'infra',
  'impact',
  'human',
  'stack',
  'danger'
] as const;

export type AccentToken = (typeof ACCENT_TOKENS)[number];

/** Returns a CSS `rgb(var(--accent-<token>))` string, with optional alpha. */
export function accentVar(token: AccentToken, alpha?: number): string {
  const v = `var(--accent-${token})`;
  return alpha !== undefined ? `rgb(${v} / ${alpha})` : `rgb(${v})`;
}

/** Lookup map: token name -> CSS rgb(var(...)) string (full opacity). */
export const accent: Record<AccentToken, string> = Object.fromEntries(
  ACCENT_TOKENS.map((t) => [t, accentVar(t)])
) as Record<AccentToken, string>;
