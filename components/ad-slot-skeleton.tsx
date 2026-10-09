const AdSlotSkeleton = () => {
  return (
    <div role="status" aria-label='Loading ad slot' className="p-4 rounded-lg border-2 border-amber-200 dark:border-amber-800 motion-safe:animate-pulse">
      <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />       {/* placeholder del nombre */}
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />  {/* placeholder del badge */}
      </div>
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />    {/* placeholder del "Size: ..." */}
    </div>
  );
};
export default AdSlotSkeleton;