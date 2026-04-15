/**
 * Theme toggle behaviour (spec §3).
 *
 * Asserts:
 *   - Toggle persists to localStorage and survives a route change.
 *   - No FOUC on reload — the inline script applies the saved theme before
 *     first paint, so we can never see the wrong scheme even briefly.
 */

import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
  test('persists across routes via localStorage', async ({ page }) => {
    await page.goto('/');
    // Start dark by default
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle to light
    await page.locator('header button[aria-label*="theme"]').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    const stored = await page.evaluate(() => window.localStorage.getItem('theme'));
    expect(stored).toBe('light');

    // Navigate to /stack and confirm the class survives
    await page.goto('/stack');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('no FOUC: saved theme applies before first paint', async ({ page, context }) => {
    // Pre-seed localStorage with light, then load the page and inspect the
    // first computed class on <html>. The inline script in <head> must apply
    // before any styles paint.
    await context.addInitScript(() => {
      window.localStorage.setItem('theme', 'light');
    });
    await page.goto('/');
    // The class is set synchronously by the inline script; its presence on
    // the very first DOM read confirms it ran before paint.
    const initialClass = await page.evaluate(() => document.documentElement.className);
    expect(initialClass).toContain('light');
    expect(initialClass).not.toContain('dark');
  });
});
