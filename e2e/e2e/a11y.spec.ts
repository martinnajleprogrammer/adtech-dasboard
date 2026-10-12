import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixture';

test('A11y Audtion', async ({ page }) => {
  
  // Navigate to the initial page
  await page.goto('/');

  // wait for streaming to finish (skeletons gone, 6 articles) so axe audits the final DOM
  await expect(page.getByRole('article')).toHaveCount(6);

  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations).toEqual([]);

});

test('A11y Audtion open suggestion', async ({ page, typeahead }) => {

  // Navigate to the initial page
  await page.goto('/');

  // make visible suggestions
  await typeahead.search('rea')
  await expect(typeahead.listbox).toBeVisible();

  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations).toEqual([]);
});
