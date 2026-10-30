import { test, expect } from '@playwright/test';
import { createRng } from '@/lib/seeded-random';

// First `count` values of a generator created from `seed`.
const take = (seed: string, count = 10): number[] => {
  const rng = createRng(seed);
  return Array.from({ length: count }, () => rng());
};

test('the same seed produces the same sequence', () => {
  expect(take('slot-1:1')).toEqual(take('slot-1:1'));
});

test('different seeds produce different sequences', () => {
  expect(take('slot-1:1')).not.toEqual(take('slot-1:2'));
});

test('every value is >=0 < 1', () => {
  const outOfRange = take('slot-1:1', 10000).filter((n) => n < 0 || n >= 1);
  expect(outOfRange).toEqual([]);
});

test('two interleaved generators with the same seed do not affect each other', () => { 
  const seed = 'slot-1:1';
  const rngA = createRng(seed);
  const rngB = createRng(seed);

  for (let i = 0; i < 10; i++) { 
    expect(rngA()).toEqual(rngB());
  }
})

test('average close to 0.5', () => { 

  const total = take('slot-1:1', 10000).reduce((acc, n ) => acc + n, 0);
  const avg = total / 10000;
  expect(Math.abs(avg - 0.5)).toBeLessThan(0.02);
})

test('the first values of a known seed are pinned (algorithm golden)', () => {


  expect(take('slot-1:1', 3)).toEqual([
    0.3879723141435534,
    0.4765178030356765,
    0.7023993034381419,
  ]);
})