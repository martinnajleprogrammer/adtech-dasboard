'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import MyButton from './mybutton';

export default function LiveRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const [paused, setPaused] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (isPending || paused) return;
    const liveTimeout = setTimeout(() => {
      startTransition(() => {
        router.refresh();
      })
    }, intervalMs);

    return () => clearTimeout(liveTimeout);
  }, [intervalMs, isPending, paused, router]);
  return (
    <MyButton
      intent={'secondary'}
      size={'sm'}
      type='button'
      onClick={() => setPaused(paused => !paused)}>{paused ? 'Resume' : 'Pause'} live updates
    </MyButton>);
}