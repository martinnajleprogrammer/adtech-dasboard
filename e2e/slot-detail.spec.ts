import { test, expect } from './fixture';

test('With filter', async ({ page, slotDetail, dashboard }) => {
  
  await page.goto('/?status=winning');
  await dashboard.waitForStable(3);

  await dashboard.cardLink('Leaderboard').click();

  await expect(page).toHaveURL('/slots/slot-1?status=winning');
  await expect(slotDetail.title).toHaveText('Leaderboard');
  await slotDetail.waitForLoaded();

  await slotDetail.backLink.click();
  await dashboard.waitForStreamed(3);

  await expect(page).toHaveURL('/?status=winning');
  await expect(dashboard.filter).toHaveValue('winning')

})

test('Without filter', async ({ page, slotDetail, dashboard }) => {

  await page.goto('/');
  await dashboard.waitForStable();

  await dashboard.cardLink('Medium Rectangle').click();

  await expect(page).toHaveURL('/slots/slot-2');
  await expect(slotDetail.title).toHaveText('Medium Rectangle');
  await slotDetail.waitForLoaded();

  await slotDetail.backLink.click();
  await dashboard.waitForStreamed();
  await expect(page).toHaveURL('/');

})

test('shows the slot data, the current round and a deterministic history', async ({ page, slotDetail }) => {

  await slotDetail.open('slot-1');
  await slotDetail.waitForLoaded();

  // Static data and current round (fixed auctions: Leaderboard wins with $12.50 from AppNexus).
  await expect(slotDetail.title).toHaveText('Leaderboard');
  await expect(page.getByRole('main')).toContainText('728x90');
  await expect(page.getByRole('main')).toContainText('$10.00');
  await expect(slotDetail.currentRound).toContainText('Winning');
  await expect(slotDetail.currentRound).toContainText('$12.50');
  await expect(slotDetail.currentRound).toContainText('AppNexus');

  // History: 10 rounds, newest first.
  await expect(slotDetail.historyRows).toHaveCount(10);
  await expect(slotDetail.historyRows.getByRole('rowheader')).toHaveText(['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);

  // Golden row: pins the seeded generator (hash + rng + auction logic). If it changes on purpose, update it.
  await expect(slotDetail.history.getByRole('row', { name: '10 Winning $10.43 Rubicon Project', exact: true })).toBeVisible();

  // Invariants of the real auction logic: a win beats the floor price ($10), a non-win shows no value.
  const cpms = await slotDetail.history.getByRole('cell', { name: /^\$\d/ }).allTextContents();
  expect(cpms.length).toBeGreaterThan(0);
  for (const cpm of cpms) expect(Number(cpm.replace('$', ''))).toBeGreaterThan(10);

  const noFillWithValue = slotDetail.historyRows.filter({ hasText: 'No Fill' }).filter({ hasNotText: 'Not available' });
  await expect(noFillWithValue).toHaveCount(0);

});

test('an unknown slot returns a real 404 and no slot content', async ({ slotDetail }) => {

  const response = await slotDetail.open('zzz');

  expect(response?.status()).toBe(404);
  await expect(slotDetail.history).toHaveCount(0);

});

// Compares the skeleton box with the real block it is replaced by.
test("skeleton and current round have the same size", async ({ slotDetail }) => {

  await slotDetail.open('slot-1');

  await expect(slotDetail.skeleton).toBeVisible();
  // In dev the CSS arrives after the HTML: wait for Tailwind (max-w-xl = 36rem) before measuring.
  await expect(slotDetail.skeleton).toHaveCSS('max-width', '576px');
  const before = await slotDetail.skeleton.boundingBox();

  await expect(slotDetail.currentRound).toBeVisible();
  const after = await slotDetail.currentRound.boundingBox();

  if (!before || !after) throw new Error('Error in skeleton size');
  expect(after!.x).toBeCloseTo(before!.x, 0);
  expect(after!.y).toBeCloseTo(before!.y, 0);
  expect(after!.width).toBeCloseTo(before!.width, 0);
  expect(after!.height).toBeCloseTo(before!.height, 0); // |diff| < 0.5px
});

test('Slot fails with error boundary', async ({page, slotDetail }) => { 

  await slotDetail.open('slot-1', '?e2eFail=slot-1');

  // Only the current round failed: the rest of the page stays.
  await expect(slotDetail.errorAlert).toContainText('Leaderboard');
  await expect(page.getByRole('main')).toContainText('728x90');
  await expect(page.getByRole('main')).toContainText('$10.00');
  
  await expect(slotDetail.retryButton).toBeVisible();
  await expect(slotDetail.skeleton).toHaveCount(0);

  await expect(slotDetail.currentRound).toHaveCount(0);

  await expect(slotDetail.historyRows).toHaveCount(10);

  await expect(slotDetail.title).toHaveText('Leaderboard');

})

test('Slot fails with error boundary, retry button', async ({page, slotDetail }) => {

  await slotDetail.open('slot-1', '?e2eFail=slot-1');

  await expect(slotDetail.errorAlert).toBeVisible();

  // retry() re-fetches the boundary's children: an RSC request (prefetches don't count).
  // Register the wait BEFORE the click, or the request could go out before we listen.
  const rscRequest = page.waitForRequest((req) => {
    const headers = req.headers();
    return (headers['rsc'] === '1' || req.url().includes('_rsc=')) && !headers['next-router-prefetch'];
  });

  await slotDetail.retryButton.click();

  await rscRequest;

  // The failure comes from the URL, so it fails again after retrying.
  await expect(slotDetail.errorAlert).toBeVisible();

})
