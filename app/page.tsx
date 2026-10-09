import { mockAdSlots } from "@/lib/mock-ad-slots";
import TypeAhead from "@/components/typeahead";
import { Suspense } from "react";
import AdSlotCard from "@/components/ad-slot-card";
import AdSlotSkeleton from "@/components/ad-slot-skeleton";
import { parseFilter } from "@/lib/filter";
import StatusFilter from "@/components/status-filter";
import RevenueTotal from "@/components/revenue-total";
import LiveRefresh from "@/components/live-refresh";

export const Home = async ({ searchParams }:
  { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

  const filter = parseFilter((await searchParams).status);

  return (
    <>
      <header className="flex p-2 border-2 border-amber-500 dark:border-amber-700 justify-between items-center">
        <h1 className="text-2xl font-bold">AdTech Publisher Dashboard</h1>
        <Suspense fallback={<span className="animate-pulse">Revenue this round: - </span>}>
          <RevenueTotal />
        </Suspense>
      </header >
      <LiveRefresh />

      <main className="flex flex-col p-2 md:p-4 lg:p-6 gap-2 mx-auto w-full max-w-6xl">
        <TypeAhead limit={10} url="/api/search" />
        <StatusFilter current={filter} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 w-full">
          {
            mockAdSlots.map((adSlot) => {
              return (
                <Suspense
                  key={adSlot.id}
                  fallback={<div className="@container"><AdSlotSkeleton /></div>}
                >
                  <AdSlotCard slotId={adSlot.id} filter={filter} />
                </Suspense>
              );
            })
          }
        </div>
      </main>
    </>
  );
}


export default Home;