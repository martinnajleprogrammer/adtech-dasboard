import { test, expect } from './fixture';

test('Typeahead functionality', async ({ page, typeahead }) => {
  // Navigate to the page containing the typeahead component
  await page.goto('/');

  // Locate the typeahead input field
  typeahead.search('rea'); 

  // Wait for the suggestions to appear
  const suggestions = page.getByRole('listbox');
  await expect(suggestions).toBeVisible();

  // Move the arrow to the first suggestion
  await typeahead.input.press('ArrowDown');
  
  await expect(page.getByRole('option').first()).toHaveAttribute('aria-selected', 'true');
  await expect(typeahead.input).toHaveAttribute('aria-activedescendant', 'item_0');

  // Press enter to select the first suggestion
  await typeahead.input.press('Enter');
  await expect(typeahead.input).toHaveValue('react'); 

  await expect(page.getByRole('listbox')).not.toBeVisible()

});

