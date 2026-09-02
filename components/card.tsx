import { AdSlot } from "@/lib/mock-ad-slots";
import type { HTMLAttributes } from "react";
import Badge from "./badge";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  adSlot: AdSlot;
}

const Card = ({ className, adSlot, ...props }: CardProps) => {
  const badgeText = adSlot.status === "winning" ? `Revenue: $${adSlot.revenue.toFixed(2)}` : "No Fill";
  const badge = <Badge intent={adSlot.status} text={badgeText} />;
  return (
    <div
      className={`p-4 rounded-lg bg-amber-50 border-2 border-amber-200 hover:shadow-lg text-blue-500 ${className || ""}`} {...props}
    >
      <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
        <p>{adSlot.name}</p>
        {badge}
      </div>
      <p><span>Size:</span>{adSlot.size}</p>
    </div>
  );
};
export default Card;