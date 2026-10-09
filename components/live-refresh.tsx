'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

export default function LiveRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (isPending) return;
    const liveTimeout = setTimeout(() => {
      startTransition(() => {
        router.refresh();
      })
    }, intervalMs);

    return () => clearTimeout(liveTimeout);
  }, [intervalMs, isPending, router]);
  return null;
}