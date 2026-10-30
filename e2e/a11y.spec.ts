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

    test('slot detail has no WCAG A/AA violations', async ({ page, slotDetail }) => {
      await slotDetail.open('slot-1');
      await slotDetail.waitForLoaded();
      const results = await audit(page);
      expect(results.violations).toEqual([]);


    })
    test('slot detail with a failed current round has no WCAG A/AA violations', async ({ page, slotDetail }) => {
      await slotDetail.open('slot-1', '?e2eFail=slot-1');
      
      await expect(slotDetail.errorAlert).toBeVisible();
      const results = await audit(page);
      expect(results.violations).toEqual([]);

    })
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

test('a card shows its focus ring on the whole card and opens the slot with Enter', async ({ page, typeahead, dashboard }) => {
  await page.goto('/');
  await dashboard.waitForStreamed();

  await page.keyboard.press('Tab');
  await expectFocusRing(typeahead.input);

  await page.keyboard.press('Tab');
  await expectFocusRing(page.getByLabel('Filter by status:'));

  await page.keyboard.press('Tab');

  const card = dashboard.cards.filter({ has: dashboard.cardLink('Leaderboard') });
  await expect(card).not.toHaveCSS('outline-style', 'none');
  await expect(card).not.toHaveCSS('outline-width', '0px');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/slots/slot-1');

});

test('focus order in the slot detail: back link, then the scrollable history', async ({ page, slotDetail }) => {
  await slotDetail.open('slot-1');
  await slotDetail.waitForLoaded();

  await page.keyboard.press('Tab');
  await expectFocusRing(slotDetail.backLink);

  await page.keyboard.press('Tab');
  await expectFocusRing(slotDetail.historyRegion);
});