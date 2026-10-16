import { test, expect } from '../fixture';

// These specs run in the `chromium-live` project: its server has LIVE_REFRESH_MS=5000,
// so the live refresh and its pause button are rendered.

test('pause button toggles its label', async ({ page }) => {
  await page.goto('/');

  const pause = page.getByRole('button', { name: 'Pause live updates' });
  const resume = page.getByRole('button', { name: 'Resume live updates' });

  await expect(pause).toBeVisible();

  await pause.click();
  await expect(resume).toBeVisible();
  await expect(pause).toHaveCount(0);

  await resume.click();
  await expect(pause).toBeVisible();
  await expect(resume).toHaveCount(0);
});

test('pausing stops the automatic refresh and resuming brings it back', async ({ page }) => {
  // router.refresh() fetches the RSC payload of the current route: that request is what we count
  const refreshes: string[] = [];
  page.on('request', (req) => {
    const headers = req.headers();
    const isRsc = headers['rsc'] === '1' || req.url().includes('_rsc=');
    if (isRsc && !headers['next-router-prefetch']) refreshes.push(req.url());
  });

  // Fake timers, installed before the page loads. Time keeps flowing until we pause it.
  await page.clock.install();
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(6);

  // From here on timers only fire when we call runFor(): no real 5s timer can sneak in
  const now = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(now + 100);

  // Advance the fake clock until a refresh happens. Polling absorbs the (real) network time
  // a refresh takes: the next timer is only armed once the previous transition has finished.
  const advanceUntilRefreshAfter = async (count: number) =>
    expect
      .poll(async () => {
        await page.clock.runFor(5_000);
        return refreshes.length;
      }, { message: 'a refresh request should happen after advancing the clock' })
      .toBeGreaterThan(count);

  // 1. Positive control: unpaused, the refresh happens
  await advanceUntilRefreshAfter(0);

  // 2. Paused: a lot of fake time passes and no request is made
  await page.getByRole('button', { name: 'Pause live updates' }).click();
  await expect(page.getByRole('button', { name: 'Resume live updates' })).toBeVisible();
  const countWhenPaused = refreshes.length;

  await page.clock.runFor(30_000); // six intervals
  expect(refreshes.length).toBe(countWhenPaused);

  // 3. Resumed: the same procedure produces a request again, so step 2 was a meaningful absence
  await page.getByRole('button', { name: 'Resume live updates' }).click();
  await expect(page.getByRole('button', { name: 'Pause live updates' })).toBeVisible();
  await advanceUntilRefreshAfter(countWhenPaused);
});
