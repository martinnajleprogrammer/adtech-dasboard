import { test, expect } from '@playwright/test';

test('/api/search no results', async ({ page }) => {
  
  // Mock route
  await page.route(/\/api\/search/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({results:[], total: 0}),
    });
  });

  await page.goto('/');

  // Locate the typeahead input field
  const typeaheadInput = page.getByRole('combobox', { name: 'Search tools' });

  // Type into the input field
  const valueToFill = 'react';
  await typeaheadInput.fill(valueToFill);

  await expect(page.getByText(`No results for ${valueToFill}.`)).toBeVisible();
  await expect(page.getByRole('listbox')).not.toBeVisible()

});

test('/api/search error 500', async ({ page }) => {
  // Mock route
  await page.route(/\/api\/search/, async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Error test' }),
    });
  });

  await page.goto('/');

  // Locate the typeahead input field
  const typeaheadInput = page.getByRole('combobox', { name: 'Search tools' });
  await typeaheadInput.fill('rea');

  await expect(page.getByRole('alert')).toBeVisible()

  await expect(page.getByText('Error: Error test')).toBeVisible();
  await expect(page.getByRole('listbox')).not.toBeVisible()
});

test('/api/search abort error', async ({ page }) => {
  // Mock route
  await page.route(/\/api\/search/, async (route) => {
    await route.abort();
  });

  await page.goto('/');

  // Locate the typeahead input field
  const typeaheadInput = page.getByRole('combobox', { name: 'Search tools' });
  await typeaheadInput.fill('rea');

  await expect(page.getByText('Error: Unknown error contacting /api/search')).toBeVisible();
});

test('/api/search slow rendering', async ({ page }) => {
  
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });

  // Mock route
  await page.route(/\/api\/search/, async (route) => {
    await gate; // stay waiting...
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ results: ['react', 'preact'], total: 2 }),
    });
  });

  await page.goto('/');

  // Locate the typeahead input field
  const typeaheadInput = page.getByRole('combobox', { name: 'Search tools' });
  await typeaheadInput.fill('rea');

  await expect(page.getByText('Searching...')).toBeVisible();
  await expect(page.getByRole('listbox')).not.toBeVisible()

  release();

  await expect(page.getByText('Searching...')).not.toBeVisible();
  await expect(page.getByRole('listbox')).toBeVisible();
  await expect(page.getByRole('option', { name: 'react', exact: true })).toBeVisible();
  await expect(page.getByRole('option', { name: 'preact', exact: true })).toBeVisible();
  await expect(page.getByRole('option', { name: 'rea' })).toHaveCount(2);

});

test('/api/search search is modified during the previous call is being fetched', async ({ page }) => {

  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });

  let staleServed!: () => void;
  const staleDone = new Promise<void>((resolve) => { staleServed = resolve; });

  // Mock route
  await page.route(/\/api\/search/, async (route) => {
    const q = new URL(route.request().url()).searchParams.get('q');
    if (q === 'rea') { 
      await gate; // stay waiting...
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: q === 'rea' ? JSON.stringify({ results: ['old-res', 'old-rest'], total: 2 }) :
        JSON.stringify({ results: ['new-one', 'new-two'], total: 2 }),
    });
    if (q === 'rea') {
      await staleServed(); // stay waiting...
    }
  });

  await page.goto('/');

  // Locate the typeahead input field
  const typeaheadInput = page.getByRole('combobox', { name: 'Search tools' });
  await typeaheadInput.fill('rea');
  
  await expect(page.getByText('Searching...')).toBeVisible();

  await typeaheadInput.fill('reac');
  await expect(page.getByRole('option', { name: 'new-one', exact: true })).toBeVisible();
  await expect(page.getByRole('option', { name: 'new-two', exact: true })).toBeVisible();

  release();
  await staleDone;
  
  await expect(page.getByRole('option', { name: 'new-one', exact: true })).toBeVisible();
  await expect(page.getByRole('option', { name: 'new-two', exact: true })).toBeVisible();

  await expect(page.getByRole('option', { name: 'old-res', exact: true })).not.toBeVisible();
  await expect(page.getByRole('option', { name: 'old-rest', exact: true })).not.toBeVisible();

});