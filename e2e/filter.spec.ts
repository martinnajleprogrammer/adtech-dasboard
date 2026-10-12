import { test, expect } from '@playwright/test';

test('Filter functionality', async ({ page }) => {
  // Navigate to the page containing the filter component
  await page.goto('/');

  const selectOptions = page.getByLabel('Filter by status:');
  
  await selectOptions.selectOption('nofill');

  // URL with the active filter 
  await expect(page).toHaveURL(/.*status=nofill.*/);  

  // The selected value in the select should be nofill, uses locator to retry
  await expect(selectOptions).toHaveValue('nofill');

  // All cards different to no fill.
  const cardsWithoutNoFill = page.getByRole('article').filter({hasNotText: 'No Fill'});

  // Cards should be 0
  await expect(cardsWithoutNoFill).toHaveCount(0);
  

});