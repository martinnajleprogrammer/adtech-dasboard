import { test, expect } from '@playwright/test';

test('Load initial', async ({ page }) => {
  // Navigate to the initial page
  await page.goto('/');

  await expect(page.getByRole('article')).toHaveCount(6);

  await expect(page.getByRole('status', { name: 'Loading ad slot' })).toHaveCount(0);
  
  await expect(page.getByText(/Revenue this round: [0-9]/)).toBeVisible();


});