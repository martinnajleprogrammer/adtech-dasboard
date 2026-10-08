
import { getAuctionResult } from "@/lib/auctions";
import { mockAdSlots } from "@/lib/mock-ad-slots";
const RevenueTotal = async () => {

  const results = await Promise.all(mockAdSlots.map((slot) => getAuctionResult(slot.id)));

  const totalRevenue = results.reduce((acc, result) => acc + (result.status === 'winning' ? result.cpm : 0), 0);

  return <span>{`Revenue this round: ${totalRevenue.toFixed(2)}`}</span>;
};

export default RevenueTotal;