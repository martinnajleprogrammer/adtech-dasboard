'use client';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div role="alert">
      <p>Something went wrong: {error.message}</p>
      <button onClick={() => retry()}>Try Again</button>
    </div>
  );
}