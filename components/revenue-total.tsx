
import { getAuctionResult } from "@/lib/auctions";
import { mockAdSlots } from "@/lib/mock-ad-slots";
const RevenueTotal = async () => {

  const results = await Promise.all(mockAdSlots.map((slot) => getAuctionResult(slot.id)));

  const totalRevenue = results.reduce((acc, result) => acc + (result.status === 'winning' ? result.cpm : 0), 0);

  return (
    <span>
      Revenue this round: <span className="inline-block min-w-[6ch] tabular-nums">{totalRevenue.toFixed(2)}</span>
    </span>
  );
};

export default RevenueTotal;