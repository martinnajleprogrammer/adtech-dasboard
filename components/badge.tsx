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
      winning: "text-white bg-green-500 dark:bg-green-600",
      nofill: "text-gray-800 bg-gray-200 dark:bg-gray-700 dark:text-gray-200",
      error: "bg-red-500 text-white dark:bg-red-600",
      pending: "bg-orange-500 text-white dark:bg-orange-600",
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