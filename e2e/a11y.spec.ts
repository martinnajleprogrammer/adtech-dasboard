import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './fixture';

// Waits for the streamed content and any finite animation/transition (e.g. card fade-in).
// Auditing mid-animation makes axe measure blended colors and report false contrast violations.
// Must run after the page reached its final state: infinite animations (animate-pulse skeletons)
// are cancelled on unmount and would make `finished` reject.
const waitForStableDom = async (page: Page) => {
  await expect(page.getByRole('status', { name: 'Loading ad slot' })).toHaveCount(0);
  await expect(page.getByRole('article')).toHaveCount(6);
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
};

const audit = async (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

test('dashboard has no WCAG A/AA violations', async ({ page }) => {
  await page.goto('/');
  await waitForStableDom(page);

  const results = await audit(page);
  expect(results.violations).toEqual([]);
});

test('dashboard with open suggestions has no WCAG A/AA violations', async ({ page, typeahead }) => {
  await page.goto('/');

  await typeahead.search('rea');
  await expect(typeahead.listbox).toBeVisible();
  await waitForStableDom(page);

  // The listbox must still be open, otherwise we would be auditing the closed state
  await expect(typeahead.listbox).toBeVisible();

  const results = await audit(page);
  expect(results.violations).toEqual([]);
});
