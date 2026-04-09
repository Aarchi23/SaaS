import { test, expect } from '@playwright/test';

test('runs playwright', async ({ page }) => {
  await page.setContent('<h1>FinDash</h1>');
  await expect(page.getByRole('heading', { name: 'FinDash' })).toBeVisible();
});
