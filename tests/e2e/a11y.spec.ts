/**
 * Axe-core a11y sweep (spec §5.1, plan §test strategy).
 *
 * Runs an a11y audit against every primary route. We assert ZERO serious or
 * critical violations; minor/moderate findings are surfaced in the report
 * but don't fail the build.
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// @axe-core/playwright imports `Page` from playwright-core, which lags the
// superset exposed by @playwright/test (ariaSnapshot et al.). The runtime
// surface is identical; this is a pure type bridge.
type AxePage = ConstructorParameters<typeof AxeBuilder>[0]['page'];
const asAxePage = (p: Page): AxePage => p as unknown as AxePage;

const ROUTES = ['/', '/architecture', '/runtime', '/stack', '/notes', '/ping'];

for (const route of ROUTES) {
  test(`a11y: ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page: asAxePage(page) })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const seriousOrWorse = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );

    await testInfo.attach(`a11y-${route.replace(/\//g, '_') || 'root'}.json`, {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json'
    });

    expect(
      seriousOrWorse,
      `Serious/critical a11y violations on ${route}: ${seriousOrWorse.map((v) => v.id).join(', ')}`
    ).toEqual([]);
  });
}
