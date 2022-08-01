import { test, expect } from '@playwright/test';

test('index page has title and description', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('Surya Avala');
	expect(await page.textContent('p')).toBe(
		'Machine Learning Engineer | Pastry Enthusiast | Philosopher | Human'
	);
});

test('index page has link to my linktree', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('a')).toContain('MY LINKTREE');
	expect(await page.getAttribute('a', 'href')).toBe('https://linktr.ee/suryaavala');
});

test('index page has right background image', async ({ page }) => {
	await page.goto('/');
	const background_div = page.locator('.hero');
	expect(await background_div.getAttribute('style')).toContain('construction.jpeg');
});
