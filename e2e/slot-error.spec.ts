import { test, expect } from './fixture';

test('a failing slot shows its own fallback and leaves the other cards and the total unaffected', async ({ page }) => {

  await page.goto('/?e2eFail=slot-1');

  await expect(page.getByRole('alert').filter({ hasText: 'Leaderboard' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();

  await expect(page.getByRole('article')).toHaveCount(5);

  // The total comes from the auctions (RevenueTotal), not from the rendered cards: the failure is
  // injected in the card, so Leaderboard's $12.50 is still counted. The badges-sum invariant does not apply here.
  await expect(page.getByRole('banner')).toContainText('Revenue this round: 23.75');

  await expect(page.getByRole('article')).toContainText(['Medium Rectangle', 'Large Rectangle', 'Skyscraper', 'Hero', 'Footer']);

});

