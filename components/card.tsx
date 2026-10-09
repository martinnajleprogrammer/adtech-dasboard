import { AdSlot } from "@/lib/mock-ad-slots";
import type { HTMLAttributes } from "react";
import Badge from "./badge";
import type { AuctionResult } from "@/lib/auctions";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  adSlot: AdSlot & AuctionResult;
}

const Card = ({ className, adSlot, ...props }: CardProps) => {
  const badgeText = adSlot.status === "winning" ? `Revenue: $${adSlot.cpm.toFixed(2)}` :
    adSlot.status === 'error' ? 'Error' : "No Fill";
  const badge = <Badge intent={adSlot.status} text={badgeText} />;
  return (
    <article
      className={`p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800 ${className || ""}`}
      {...props}
    >
      <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
        <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">{adSlot.name}</p>
        {badge}
      </div>
      <p className=" text-gray-700  dark:text-gray-300"><span className="pr-2">Size:</span>{adSlot.size}</p>
    </article>
  );
};
export default Card;