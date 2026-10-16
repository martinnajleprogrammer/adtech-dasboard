import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';
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

// Checks that the element has keyboard focus AND that the browser draws a focus indicator on it.
// We assert the ring was not removed (e.g. by `outline-none`), not a browser-specific value.
const expectFocusRing = async (locator: Locator) => {
  await expect(locator).toBeFocused();
  await expect(locator).not.toHaveCSS('outline-style', 'none');
  await expect(locator).not.toHaveCSS('outline-width', '0px');
};

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
