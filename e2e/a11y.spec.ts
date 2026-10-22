import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect, expectFocusRing } from './fixture';

const audit = async (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`${colorScheme} mode`, () => {
    test.use({ colorScheme });

    test('dashboard has no WCAG A/AA violations', async ({ page, dashboard }) => {
      await page.goto('/');
      await dashboard.waitForStable();

      const results = await audit(page);
      expect(results.violations).toEqual([]);
    });

    test('dashboard with open suggestions has no WCAG A/AA violations', async ({ page, typeahead, dashboard }) => {
      await page.goto('/');

      await typeahead.search('rea');
      await expect(typeahead.listbox).toBeVisible();
      await dashboard.waitForStable();

      // The listbox must still be open, otherwise we would be auditing the closed state
      await expect(typeahead.listbox).toBeVisible();

      const results = await audit(page);
      expect(results.violations).toEqual([]);
    });
  });
}

test('revenue live region is mounted before the total streams in and is not remounted', async ({ page }) => {
  // 'commit' returns as soon as the response starts, before the Suspense boundary resolves
  await page.goto('/', { waitUntil: 'commit' });

  const status = page.getByRole('banner').getByRole('status');

  // Precondition: we are looking at the fallback. Otherwise the test would pass without proving anything.
  await expect(status).toHaveText('Revenue this round: -');
  const handle = await status.elementHandle();

  await expect(status).toHaveText('Revenue this round: 23.75');

  // Same DOM node as before the content streamed in: a screen reader only announces changes
  // inside a live region that already existed, not one that was just created.
  expect(await handle?.evaluate((el) => el.isConnected)).toBe(true);
});

test('keyboard focus is visible and follows the visual order', async ({ page, typeahead }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expectFocusRing(typeahead.input);

  await page.keyboard.press('Tab');
  await expectFocusRing(page.getByLabel('Filter by status:'));
});
