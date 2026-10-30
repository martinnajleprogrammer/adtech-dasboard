import { test, expect } from '@playwright/test';
import { getSlotHistory } from '@/lib/history';
import { AdSlot } from '@/lib/mock-ad-slots';

const slot: AdSlot = {
  id: 'test-slot',
  name: 'Leaderboard',
  floorPrice: 10,
  status: 'winning',
  size: '300x250'
};

test('Same history for the same slot', () => {
  expect(getSlotHistory(slot)).toEqual(getSlotHistory(slot));
});


test('rows are numbered from rounds down to 1, newest first', () => {
  expect(getSlotHistory(slot, 4).map((row) => row.round)).toEqual([4, 3, 2, 1]);
});

test('Different slots different stories', () => {
  const slot2 = { ...slot, id: 'other-slot' };
  const h1 = getSlotHistory(slot).map(row => ({ status: row.status, cpm: row.status === 'winning' ? row.cpm : null }));
  const h2 = getSlotHistory(slot2).map(row => ({ status: row.status, cpm: row.status === 'winning' ? row.cpm : null }));
  expect(h1).not.toEqual(h2);
});