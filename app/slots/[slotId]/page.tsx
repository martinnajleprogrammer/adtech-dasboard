import { getAdSlot } from "@/lib/mock-ad-slots";
import { notFound } from "next/navigation";
import Badge from "@/components/badge";
import type { Metadata } from "next";
import Link from "next/link";
import { parseFilter } from "@/lib/filter";

type SlotProps = { params: Promise<{ slotId: string }>, searchParams: Promise<{ status: string }> };
export const generateMetadata = async ({ params }: SlotProps): Promise<Metadata> => {
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

  return (
    <main className="p-6">
      <Link href={`/${query}`}>Back to dashboard</Link>
      <h1 className="text-2xl font-bold">{adSlot.name}</h1>
      <div className="flex justify-center">
        <dl className="mt-4 p-4 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 w-full max-w-xl border-2">
          <dt className="font-semibold">Size</dt>
          <dd>{adSlot.size}</dd>
          <dt className="font-semibold">Floor price</dt>
          <dd>${adSlot.floorPrice.toFixed(2)}</dd>
          <dt className="font-semibold">Status</dt>
          <dd>
            <Badge intent={adSlot.status} text={adSlot.status} />
          </dd>
        </dl>
      </div>
    </main >
  );
}
