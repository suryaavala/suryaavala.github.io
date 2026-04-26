/**
 * Visual regression (spec §4.1 Bento layout, plan §test strategy).
 *
 * Snapshots the homepage at three breakpoints (mobile, tablet, desktop) in
 * both colour schemes. Snapshots are committed to the repo so CI fails on
 * any unintended layout shift. To accept a change:
 *
 *   npx playwright test visual.spec.ts --update-snapshots
 *
 * The per-project viewport from playwright.config.ts is overridden here so
 * each breakpoint × theme combo produces exactly one snapshot rather than
 * three (one per project).
 */

import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

// Only run visual regression on chromium-desktop — running across all 3
// projects would triple the snapshot count for no extra coverage.
//
// On CI, skip until Linux baselines are committed. The first local run on
// Linux (or Docker mcr.microsoft.com/playwright) with --update-snapshots
// creates the baselines; commit them to enable CI enforcement.
//
// Playwright's `test.beforeEach` requires the first fixtures-destructure arg
// even when empty; the ESLint `no-empty-pattern` rule is a false positive here.
// eslint-disable-next-line no-empty-pattern
test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium-desktop',
    'visual snapshots are captured on chromium-desktop only'
  );
  test.skip(
    !!process.env.CI,
    'visual baselines not yet committed for Linux — run `npx playwright test visual.spec.ts --update-snapshots` in Docker to generate'
  );
});

for (const bp of BREAKPOINTS) {
  for (const theme of ['dark', 'light'] as const) {
    test(`homepage @ ${bp.name} / ${theme}`, async ({ page, context }) => {
      await context.addInitScript((t) => {
        window.localStorage.setItem('theme', t);
      }, theme);
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');

      // Wait for fonts + any IntersectionObserver-driven MetricCounter work
      // to settle before snapshotting.
      await page.evaluate(() => document.fonts.ready);
      // Scroll to bottom then back to top to trigger lazy-hydrated islands
      // deterministically, so counters show their final values.
      await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 150));
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 150));
      });

      await expect(page).toHaveScreenshot(`home-${bp.name}-${theme}.png`, {
        fullPage: true,
        // Homepage has no dynamic content besides the build-time metadata
        // in the footer, so a tight diff tolerance is safe.
        maxDiffPixelRatio: 0.02
      });
    });
  }
}
