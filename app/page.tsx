'use client';

import AdSlotContainer from "@/components/ad-slot-container";
import { mockAdSlots } from "@/lib/mock-ad-slots";
import useFilter, { type FilterType } from "@/components/useFilter";
import { useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState<FilterType>("all");
  const filteredAdSlots = useFilter(mockAdSlots, filter);
  return (
    <>
      <header className="flex p-2 border-2 border-amber-500 dark:border-amber-700 justify-between items-center">
        <h1 className="text-2xl font-bold">AdTech Publisher Dashboard</h1>
        <div>Total Revenue Today: ${mockAdSlots.reduce((accumulator, adSlot) => { return adSlot.status === 'winning' ? accumulator + adSlot.revenue : accumulator; }, 0).toFixed(2)}</div>
      </header >

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
          {/* Add your ad slots here */}
          {
            filteredAdSlots.map((adSlot) => {

              return (
                <div className="@container" key={adSlot.id}>
                  <AdSlotContainer adSlot={adSlot} />
                </div>
              );
            })
          }
        </div>
      </main>
    </>
  );
}


