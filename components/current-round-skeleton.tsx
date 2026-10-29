const Bar = ({ className }: { className: string }) => (
  <div className={`rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
);

// Same structure and sizes as CurrentRound, so swapping them causes no layout shift.
const CurrentRoundSkeleton = () => {
  return (
    <section role="status" aria-label="Loading current round" className="mx-auto mt-6 w-full max-w-xl motion-safe:animate-pulse">
      <Bar className="mb-2 h-6 w-32" />
      <dl className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 p-4 border-2">
        <dt className="font-semibold">Status</dt>
        <dd className="flex items-center"><Bar className="h-6 w-20 rounded-full" /></dd>
        <dt className="font-semibold">CPM</dt>
        <dd><Bar className="h-6 w-16" /></dd>
        <dt className="font-semibold">Winner</dt>
        <dd><Bar className="h-6 w-28" /></dd>
      </dl>
    </section>
  );
};

export default CurrentRoundSkeleton;
