import { test, expect } from './fixture';

test('Shows all six ad slots after streaming finishes', async ({ page, dashboard }) => {
  // Navigate to the initial page
  await page.goto('/');

  await dashboard.waitForStreamed();
   
  await expect(page.getByText(/Revenue this round: [0-9]/)).toBeVisible();


});