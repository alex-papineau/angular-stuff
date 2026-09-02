import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Angular Stuff/);
});

test('has main heading', async ({ page }) => {
  await page.goto('/');

  // Expect heading to contain Angular Stuff
  await expect(page.getByRole('heading', { name: 'Angular Stuff', level: 1 })).toBeVisible();
});

