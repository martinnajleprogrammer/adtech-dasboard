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
  test(`${filter} shows "${names}"`, async ({ page }) => {
    await page.goto(`/?status=${filter}`);
    await expect(page.getByRole('article')).toContainText(names);
  });
}