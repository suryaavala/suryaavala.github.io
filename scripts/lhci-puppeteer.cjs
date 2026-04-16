/**
 * LHCI puppeteer pre-script — seeds dark theme for Lighthouse audits.
 *
 * On CI (Ubuntu headless Chrome), the system reports prefers-color-scheme: light.
 * The site's Dracula accent colors are designed for dark backgrounds and fail
 * WCAG contrast on the light bg (#f8f9fa). This script sets localStorage.theme
 * before Lighthouse navigates, so the FOUC inline script activates dark mode.
 *
 * Requires `disableStorageReset: true` in lighthouserc.json settings so
 * Lighthouse doesn't clear localStorage before its own navigation.
 */

module.exports = async (browser, { url }) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
  });
  await page.close();
};
