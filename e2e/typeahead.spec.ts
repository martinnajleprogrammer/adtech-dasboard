import { test, expect } from '@playwright/test';

test('Typeahead functionality', async ({ page }) => {
  // Navigate to the page containing the typeahead component
  await page.goto('/');

  // Locate the typeahead input field
  const typeaheadInput = page.getByRole('combobox', { name: 'Search tools'});

  // Type into the input field
  await typeaheadInput.fill('rea');

  // Wait for the suggestions to appear
  const suggestions = page.getByRole('listbox');
  await expect(suggestions).toBeVisible();

  // Move the arrow to the first suggestion
  await typeaheadInput.press('ArrowDown');
  
  await expect(page.getByRole('option').first()).toHaveAttribute('aria-selected', 'true');
  await expect(typeaheadInput).toHaveAttribute('aria-activedescendant', 'item_0');

  // Press enter to select the first suggestion
  await typeaheadInput.press('Enter');
  await expect(typeaheadInput).toHaveValue('react'); 

  await expect(page.getByRole('listbox')).not.toBeVisible()

});

