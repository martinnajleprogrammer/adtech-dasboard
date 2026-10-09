'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { FILTER_OPTIONS, parseFilter, type FilterType } from '@/lib/filter';

export default function StatusFilter({ current }: { current: FilterType }) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticFilter, setOptimisticFilter] = useOptimistic(current);

  return <>
    <label htmlFor="filter">Filter by status:</label>
    <select id="filter" className={`${isPending ? 'opacity-60' : ''} p-2 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-gray-700 dark:text-gray-300`}
      value={optimisticFilter}
      onChange={(e) => startTransition(() => {
        const val = parseFilter(e.target.value)
        setOptimisticFilter(val);
        router.replace(`/?status=${val}`);
      })}
      aria-busy={isPending}
    > {
        FILTER_OPTIONS.map((filter: { value: string; label: string }) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
          </option>
        ))
      }
    </select>
  </>
}