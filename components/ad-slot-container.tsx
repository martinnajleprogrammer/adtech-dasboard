// components/ad-slot-container.tsx
"use client";

import { AdSlot } from "@/lib/mock-ad-slots";
import type { AuctionResult } from "@/lib/auctions";
import Card from "./card";
import AdSlotSkeleton from "./ad-slot-skeleton";

export default function AdSlotContainer({ adSlot, result }: { adSlot: AdSlot; result?: AuctionResult }) {

  if (!result) return <AdSlotSkeleton />; // no auction result for this slot yet

  return (
    <div className="opacity-100 transition-opacity duration-1000 starting:opacity-0">
      <Card adSlot={{ ...adSlot, ...result }} />
    </div>
  );
}
