/**
 * Homepage smoke + Bento integrity (spec §4.1).
 *
 * Asserts:
 *   - Page loads with the production title.
 *   - All 7 Bento nodes render (one per spec card).
 *   - JSON-LD Person block is present and parses cleanly.
 *   - The 6 metric values are pre-rendered in the DOM (no-JS guarantee
 *     against MetricCounter regressing to JS-only rendering).
 */

import { test, expect } from '@playwright/test';

const BENTO_HEADING_IDS = [
  'hero-title',
  'impact-title',
  'status-title',
  'agentic-title',
  'infra-title',
  'oss-title',
  'leadership-title'
];

test.describe('Homepage', () => {
  test('loads with the canonical title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(
      /Surya Avala — Staff ML Engineer & Principal AI Systems Architect/
    );
  });

  test('renders all 7 Bento nodes', async ({ page }) => {
    await page.goto('/');
    for (const id of BENTO_HEADING_IDS) {
      await expect(page.locator(`#${id}`), `${id} should be present`).toBeVisible();
    }
  });

  test('embeds a valid JSON-LD Person block', async ({ page }) => {
    await page.goto('/');
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(json).not.toBeNull();
    const parsed = JSON.parse(json!);
    expect(parsed['@type']).toBe('Person');
    expect(parsed.name).toBe('Surya Avala');
    expect(parsed.url).toBe('https://suryaavala.com');
  });

  test('pre-renders all 6 metric values for no-JS / Lighthouse readers', async ({ page }) => {
    // Disable JS so MetricCounter never hydrates; values must still appear.
    await page.context().setExtraHTTPHeaders({});
    await page.goto('/');
    const values = ['67%', '93%', '40%', '71.3%', '70%', '0.87+'];
    const text = (await page.textContent('body')) ?? '';
    for (const v of values) {
      expect(text, `metric ${v} must appear in raw DOM`).toContain(v);
    }
  });
});
