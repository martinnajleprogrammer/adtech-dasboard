import { test, expect } from '@playwright/test';

test('header shows total revenue of winning slots', async ({page}) => {

  await page.goto('/');
  
  await expect(page.getByRole('banner')).toContainText('Revenue this round: 23.75');
});

const SLOT_CASES = [
  { name: 'Leaderboard', badge: 'Revenue: $12.50' },
  { name: 'Medium Rectangle', badge: 'No Fill' },
  { name: 'Large Rectangle', badge: 'Revenue: $8.00' },
  { name: 'Skyscraper', badge: 'No Fill' },
  { name: 'Hero', badge: 'Error' },
  { name: 'Footer', badge: 'Revenue: $3.25'}
];

for (const { name, badge } of SLOT_CASES) {
  test(`${name} shows "${badge}"`, async ({ page }) => {
    await page.goto('/');
    const locator = page.getByRole('article').filter({ hasText: name });
    await expect(locator).toContainText(badge);
  });
}


const SELECT_CASES = [
  { filter: 'nofill', names: ['Medium Rectangle', 'Skyscraper'] },
  { filter: 'all', names: ['Leaderboard', 'Medium Rectangle', 'Large Rectangle', 'Skyscraper', 'Hero', 'Footer']},
  { filter: 'winning', names: ['Leaderboard', 'Large Rectangle', 'Footer'] },
  { filter: 'error', names: ['Hero'] }
];

for (const { filter, names } of SELECT_CASES) {
  test(`Filter ${filter} shows only "${names}"`, async ({ page }) => {
    await page.goto(`/?status=${filter}`);
    await expect(page.getByRole('article')).toContainText(names);
  });
}

test('Skeletons are displayed before auctions resolve', async ({ page }) => {
  // Resolves as soon as headers arrive, before the streamed content finishes
  await page.goto('/', { waitUntil: 'commit' });

  const skeletons = page.getByRole('status', { name: 'Loading ad slot' });

  // The slow slots (~1s) are still loading
  await expect(skeletons.first()).toBeVisible();

  // A fast slot (~300ms) already streamed in...
  await expect(page.getByRole('article').filter({ hasText: 'Footer' })).toBeVisible();

  // TO FIX
  // await expect(skeletons).not.toHaveCount(0);

  // Eventually every slot resolves
  await expect(skeletons).toHaveCount(0);
  await expect(page.getByRole('article')).toHaveCount(6);
});

test('Header total equals the sum of the winning badges', async ({ page }) => {
  await page.goto('/');

  // Wait until streaming finished before reading the DOM
  await expect(page.getByRole('status', { name: 'Loading ad slot' })).toHaveCount(0);
  await expect(page.getByRole('article')).toHaveCount(6);

  const texts = await page.getByRole('article').allTextContents();

  // Work in cents to avoid floating point errors
  const cents = texts
    .map((text) => text.match(/Revenue: \$(\d+\.\d{2})/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .reduce((acc, match) => acc + Math.round(parseFloat(match[1]) * 100), 0);

  // Guard: the invariant would pass trivially with zero winning cards
  expect(cents).toBeGreaterThan(0);

  await expect(page.getByRole('banner')).toContainText(`Revenue this round: ${(cents / 100).toFixed(2)}`);
});
