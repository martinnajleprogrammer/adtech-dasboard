'use client'

import { catchError, type ErrorInfo } from 'next/error'

const SlotErrorFallback = (props: { slotName: string }, { retry }: ErrorInfo) => {
  const { slotName } = props;

  return (
    <div>
      <p role='alert' >An error occurred while loading the slot: {slotName}</p>
      <button onClick={() => retry()}>Retry</button>
    </div>
  );
}

export default catchError(SlotErrorFallback)
