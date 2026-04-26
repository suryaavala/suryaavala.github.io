/**
 * Notes pipeline integrity (spec §4.5, plan §key decision #5).
 *
 * The spec pays for KaTeX CSS (~25 KB gz) on math-bearing notes only. This
 * test is the load-bearing proof that the conditional path works:
 *
 *   - A note with `requiresMath: true` → katex.min.css <link> present AND
 *     at least one rendered `.katex` element in the body.
 *   - A note with `requiresMath: false` → NO katex.min.css link, NO `.katex`
 *     elements — if either appears, we've regressed to unconditional loading
 *     and the homepage/non-math pages are paying CSS weight for nothing.
 *
 * Also asserts Shiki highlighting is applied server-side (tokens have inline
 * `color:` style attributes — the zero-JS syntax highlighting guarantee).
 */

import { test, expect } from '@playwright/test';

const MATH_NOTE = '/notes/hidden-technical-debt-in-ml';
const NON_MATH_NOTE = '/notes/first-principles-multi-agent-orchestration';

test.describe('Notes pipeline', () => {
  test('math note loads KaTeX CSS and renders equations', async ({ page }) => {
    await page.goto(MATH_NOTE);

    const katexLinks = await page.locator('link[rel="stylesheet"][href*="katex"]').count();
    expect(katexLinks, 'math note must include katex.min.css').toBeGreaterThan(0);

    const katexElements = await page.locator('.katex').count();
    expect(katexElements, 'math note must render at least one .katex block').toBeGreaterThan(0);
  });

  test('non-math note omits KaTeX CSS entirely', async ({ page }) => {
    await page.goto(NON_MATH_NOTE);

    const katexLinks = await page.locator('link[rel="stylesheet"][href*="katex"]').count();
    expect(katexLinks, 'non-math note must NOT include katex.min.css (conditional CSS path)').toBe(
      0
    );

    const katexElements = await page.locator('.katex').count();
    expect(katexElements, 'non-math note must NOT render any .katex blocks').toBe(0);
  });

  test('homepage omits KaTeX CSS entirely', async ({ page }) => {
    await page.goto('/');
    const katexLinks = await page.locator('link[rel="stylesheet"][href*="katex"]').count();
    expect(katexLinks).toBe(0);
  });

  test('code blocks have Shiki-applied inline token colours', async ({ page }) => {
    await page.goto(NON_MATH_NOTE);
    // Shiki renders <pre class="astro-code ..."> with <span style="color:#..."> tokens.
    const shikiPre = page.locator('pre.astro-code').first();
    await expect(shikiPre).toBeVisible();

    // At least one nested span must carry an inline color style — proof that
    // highlighting happened at build time, not via a client JS runtime.
    const colouredSpans = await shikiPre.locator('span[style*="color"]').count();
    expect(colouredSpans, 'Shiki must inline colour tokens on code spans').toBeGreaterThan(0);
  });

  test('notes index lists all published notes', async ({ page }) => {
    await page.goto('/notes');
    // Both non-draft notes must be linked from the index.
    await expect(page.locator(`a[href*="hidden-technical-debt-in-ml"]`)).toBeVisible();
    await expect(
      page.locator(`a[href*="first-principles-multi-agent-orchestration"]`)
    ).toBeVisible();
    await expect(page.locator(`a[href*="causal-inference-over-deep-learning"]`)).toBeVisible();
  });

  test('RSS feed is reachable and well-formed', async ({ request }) => {
    const res = await request.get('/rss.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('hidden-technical-debt-in-ml');
  });
});
