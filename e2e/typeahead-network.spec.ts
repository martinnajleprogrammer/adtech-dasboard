import { test, expect } from '@playwright/test';

test('/api/search no results', async ({ page }) => {
  
  // Mock route
  await page.route(/\/api\/search/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({results:[], total: 0}),
    });
  });

  await page.goto('/');

  // Locate the typeahead input field
  const typeaheadInput = page.getByRole('combobox', { name: 'Search tools' });

  // Type into the input field
  const valueToFill = 'react';
  await typeaheadInput.fill(valueToFill);

  await expect(page.getByText(`No results for ${valueToFill}.`)).toBeVisible();
  await expect(page.getByRole('listbox')).not.toBeVisible()


});