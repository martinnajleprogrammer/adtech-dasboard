'use client';

import AdSlotContainer from "@/components/ad-slot-container";
import { mockAdSlots } from "@/lib/mock-ad-slots";
import useFilter, { type FilterType } from "@/hooks/useFilter";
import { useEffect, useRef, useState } from "react";
import useAuctions from "@/hooks/useAuctions";
import TypeAhead from "@/components/typeahead";

const TIMEOUT_AUCTION = 5000; // 5 seconds

export default function Home() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { addAuction, latestResults, error, lastSuccessAt, revenueTotal } = useAuctions(TIMEOUT_AUCTION);

  // IN DEV only once the auctions is loaded
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      mockAdSlots.forEach((adSlot) => {
        addAuction({ adslotId: adSlot.id, floorPrice: adSlot.floorPrice });
      });
    }
  }, [addAuction]);

  const filteredAdSlots = useFilter(mockAdSlots, filter);


  return (
    <>
      <header className="flex p-2 border-2 border-amber-500 dark:border-amber-700 justify-between items-center">
        <h1 className="text-2xl font-bold">AdTech Publisher Dashboard</h1>
        <div>Latest Revenue:${revenueTotal.toFixed(2)}</div>
      </header >
      <TypeAhead limit={10} url="/api/search" />

      {error && (
        <div className="p-2 text-sm text-red-700 bg-red-50 border-b-2 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-800">
          Last auction request failed: {error}.{" "}
          {lastSuccessAt
            ? `Last successful update: ${lastSuccessAt.toLocaleTimeString()}.`
            : "No successful update yet."}
        </div>
      )}

      <main className="flex flex-col p-2 md:p-4 lg:p-6 gap-2 mx-auto w-full max-w-6xl">
        <label htmlFor="filter">Filter by status:</label>
        <select id="filter" className="p-2 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-gray-700 dark:text-gray-300"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
        >
          <option value="all">All</option>
          <option value="winning">Winning</option>
          <option value="nofill">No Fill</option>
          <option value="error">Error</option>
          <option value="pending">Pending</option>
        </select>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 w-full">
          {
            filteredAdSlots.map((adSlot) => {
              const result = latestResults.find(res => res.adslotId === adSlot.id)
              return (
                <div className="@container" key={adSlot.id}>
                  <AdSlotContainer adSlot={adSlot} result={result} />
                </div>
              );
            })
          }
        </div>
      </main>
    </>
  );
}


