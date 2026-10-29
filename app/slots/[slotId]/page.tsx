import { getAdSlot, STATUS_LABELS } from "@/lib/mock-ad-slots";
import { notFound } from "next/navigation";
import Badge from "@/components/badge";
import type { Metadata } from "next";
import Link from "next/link";
import { parseFilter } from "@/lib/filter";
import { getSlotHistory } from "@/lib/history";
import { getBidderName } from "@/lib/mock-bidders";
import CurrentRound from "@/components/current-round";
import NoValue from '@/components/no-value'
import { Suspense } from "react";
import CurrentRoundSkeleton from "@/components/current-round-skeleton";

type SlotParams = { params: Promise<{ slotId: string }> };
type SlotProps = SlotParams & { searchParams: Promise<{ status?: string | string[] }> };

export const generateMetadata = async ({ params }: SlotParams): Promise<Metadata> => {
  const { slotId } = await params;
  const adSlot = getAdSlot(slotId);
  return { title: adSlot ? adSlot.name : "Slot not found" };
};

export default async function SlotPage({ params, searchParams }: SlotProps) {
  const { slotId } = await params;

  const { status } = await searchParams;
  const filter = parseFilter(status);

  const query = filter === 'all' ? '' : `?status=${filter}`;

  const adSlot = getAdSlot(slotId);
  if (!adSlot) notFound();

  const history = getSlotHistory(adSlot);

  return (
    <main className="p-6">
      <Link className="mb-4 inline-block underline" href={`/${query}`}>Back to dashboard</Link>
      <h1 className="text-2xl font-bold">{adSlot.name}</h1>
      <div className="flex justify-center">
        <dl className="mt-4 p-4 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 w-full max-w-xl border-2">
          <dt className="font-semibold">Size</dt>
          <dd>{adSlot.size}</dd>
          <dt className="font-semibold">Floor price</dt>
          <dd>${adSlot.floorPrice.toFixed(2)}</dd>
        </dl>
      </div>
      <Suspense fallback={<CurrentRoundSkeleton />}>
        <CurrentRound slotId={adSlot.id} />
      </Suspense>
      <div
        role="region"
        aria-labelledby="history-caption"
        tabIndex={0}
        className="mx-auto mt-6 w-full max-w-xl overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <table className="w-full text-left">
          <caption id="history-caption" className="mb-2 text-left font-semibold">
            History: last {history.length} rounds
          </caption>
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th scope="col" className="px-2 py-1">Round</th>
              <th scope="col" className="px-2 py-1">Status</th>
              <th scope="col" className="px-2 py-1">CPM</th>
              <th scope="col" className="px-2 py-1">Winner</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row) => (
              <tr key={row.auctionId} className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-2 py-1 font-normal">{row.round}</th>
                <td className="px-2 py-1">
                  <Badge intent={row.status} text={STATUS_LABELS[row.status]} />
                </td>
                <td className="px-2 py-1">
                  {row.status === "winning" ? `$${row.cpm.toFixed(2)}` : <NoValue />}
                </td>
                <td className="px-2 py-1">
                  {row.status === "winning" ? getBidderName(row.bidId) : <NoValue />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
