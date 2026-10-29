import { getAuctionResult } from "@/lib/auctions";
import { STATUS_LABELS } from "@/lib/mock-ad-slots";
import { getBidderName } from "@/lib/mock-bidders";
import Badge from "@/components/badge";
import NoValue from "@/components/no-value";

const CurrentRound = async ({ slotId, forceError }: { slotId: string, forceError: boolean }) => {
  if (forceError) throw new Error('Failed Slot in current round.');
  const result = await getAuctionResult(slotId);
  const won = result.status === "winning";

  return (
    <section aria-labelledby="current-round" className="mx-auto mt-6 w-full max-w-xl">
      <h2 id="current-round" className="mb-2 font-semibold">Current round</h2>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 p-4 border-2">
        <dt className="font-semibold">Status</dt>
        <dd className="flex items-center"><Badge intent={result.status} text={STATUS_LABELS[result.status]} /></dd>
        <dt className="font-semibold">CPM</dt>
        <dd>{won ? `$${result.cpm.toFixed(2)}` : <NoValue />}</dd>
        <dt className="font-semibold">Winner</dt>
        <dd>{won ? getBidderName(result.bidId) : <NoValue />}</dd>
      </dl>
    </section>
  );
};

export default CurrentRound;
