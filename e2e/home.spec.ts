import { test, expect } from '@playwright/test';

test.describe('home page', () => {
	test('loads and shows main content', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/MS Kanzlei/);
		await expect(page.getByRole('heading', { name: 'Rechtsgebiete' })).toBeVisible();
	});

	test('navigates to impressum', async ({ page }) => {
		await page.goto('/');
		await page.goto('/impressum');
		await expect(page).toHaveURL(/\/impressum/);
		await expect(page.getByRole('heading', { name: /Impressum/ })).toBeVisible();
	});
});
