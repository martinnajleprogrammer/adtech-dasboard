import { test, expect } from '@playwright/test';


test('/api/search query valid ', async ({ request }) => {
  
  const res = await request.get('/api/search', {
    params: { q: 're', limit: '5' },
  });
  
  await expect(res).toBeOK();


  const response = await res.json();

  await expect(response.results).toBeInstanceOf(Array);
  await expect(typeof response.total).toBe('number')
  await expect(response.results.length).toBeLessThanOrEqual(5);

  await expect(response.total).toBeGreaterThanOrEqual(response.results.length);  
});

test('/api/search query min length < 2 ', async ({ request }) => {

  const res = await request.get('/api/search', {
    params: { q: 'r', limit: '5' },
  });

  await expect(res.status()).toBe(400);


});

test('/api/search limit not numeric', async ({ request }) => {

  const res = await request.get('/api/search', {
    params: { q: 're', limit: 'invalid' },
  });

  await expect(res.status()).toBe(400);


});

test('/api/search lists prefix matches before partial matches', async ({ request }) => {
  const query = 'rea';

  // A large limit so both groups (prefix and partial matches) fit in the response.
  const res = await request.get('/api/search', {
    params: { q: query, limit: '50' },
  });
  await expect(res).toBeOK();

  const { results } = (await res.json()) as { results: string[] };

  // Every result must match the query somewhere.
  for (const item of results) {
    expect(item).toContain(query);
  }

  // Index of the first result that does NOT start with the query (-1 if none).
  const firstPartial = results.findIndex((item) => !item.startsWith(query));

  expect(firstPartial).toBeGreaterThan(0);

  // From the first partial match on, no prefix match may appear again.
  const afterFirstPartial = results.slice(firstPartial);
  expect(afterFirstPartial.some((item) => item.startsWith(query))).toBe(false);
});
