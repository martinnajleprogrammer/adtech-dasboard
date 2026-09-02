import { cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import type { AdSlotStatus } from "@/lib/mock-ad-slots";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  intent?: AdSlotStatus
}

const badgeStyles = cva("inline-block px-2 py-1 font-semibold rounded-full text-xs", {
  variants: {
    intent: {
      winning: "text-white bg-green-500",
      nofill: "text-gray-800 bg-gray-200",
    } as Record<AdSlotStatus, string>
  },
  defaultVariants: {
    intent: "nofill"
  },
});

const Badge = ({ intent, text, className, ...props }: BadgeProps) => {
  return (
    <span className={badgeStyles({ intent, className })} {...props}>
      {text}
    </span>
  );
}
export default Badge;