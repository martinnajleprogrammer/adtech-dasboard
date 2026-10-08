// import AdSlotContainer from "@/components/ad-slot-container";
import { mockAdSlots } from "@/lib/mock-ad-slots";
// import useFilter, { type FilterType } from "@/hooks/useFilter";
// import { useEffect, useRef, useState } from "react";
// import useAuctions from "@/hooks/useAuctions";
// import TypeAhead from "@/components/typeahead";
import { Suspense } from "react";
import AdSlotCard from "@/components/ad-slot-card";
import AdSlotSkeleton from "@/components/ad-slot-skeleton";
import { parseFilter } from "@/lib/filter";
import StatusFilter from "@/components/status-filter";

// const TIMEOUT_AUCTION = 5000; // 5 seconds

export const Home = async ({ searchParams }:
  { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

  const filter = parseFilter((await searchParams).status);
  // const [filter, setFilter] = useState<FilterType>("all");
  // const { addAuction, latestResults, error, lastSuccessAt, revenueTotal } = useAuctions(TIMEOUT_AUCTION);

  // const loadedRef = useRef(false);

  // useEffect(() => {
  //   if (!loadedRef.current) {
  //     loadedRef.current = true;
  //     mockAdSlots.forEach((adSlot) => {
  //       addAuction({ adslotId: adSlot.id, floorPrice: adSlot.floorPrice });
  //     });
  //   }
  // }, [addAuction]);

  // const filteredAdSlots = useFilter(mockAdSlots, filter);


  return (
    <>
      <header className="flex p-2 border-2 border-amber-500 dark:border-amber-700 justify-between items-center">
        <h1 className="text-2xl font-bold">AdTech Publisher Dashboard</h1>
        {/* <div>Revenue Total:${revenueTotal.toFixed(2)}</div> */}
      </header >
      {/* <TypeAhead limit={10} url="/api/search" /> */}

      {/* {error && (
        <div className="p-2 text-sm text-red-700 bg-red-50 border-b-2 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-800">
          Last auction request failed: {error}.{" "}
          {lastSuccessAt
            ? `Last successful update: ${lastSuccessAt.toLocaleTimeString()}.`
            : "No successful update yet."}
        </div>
      )} */}

      <main className="flex flex-col p-2 md:p-4 lg:p-6 gap-2 mx-auto w-full max-w-6xl">
        <StatusFilter current={filter} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 w-full">
          {
            mockAdSlots.map((adSlot) => {
              // const result = latestResults.find(res => res.adslotId === adSlot.id)
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