import { mockAdSlots } from "@/lib/mock-ad-slots";
import { getAuctionResult } from "@/lib/auctions";
import Card from "@/components/card";
import type { FilterType } from "@/lib/filter";

export default async function AdSlotCard({ slotId, filter, forceError }: { slotId: string, filter: FilterType, forceError: boolean }) {

  const anAdSlot = mockAdSlots.find(adSlot => adSlot.id === slotId);

  if (!anAdSlot) {
    throw new Error(`Unknown ad slot: ${slotId}`);
  }

  if (forceError) {
    throw new Error(`TESTING: Forced Error for ad slot: ${slotId}`);
  }

  const result = await getAuctionResult(slotId);
  if (filter !== 'all' && result.status !== filter) return null;
  return (
    <div className="@container opacity-100 transition-opacity duration-1000 starting:opacity-0">
      <Card adSlot={{ ...anAdSlot, ...result }} />
    </div>
  );

}