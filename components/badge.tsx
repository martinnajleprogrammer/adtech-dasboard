import { cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  intent?: 'winning' | 'nofill';
}

const badgeStyles = cva("inline-block px-2 py-1 font-semibold rounded-full text-xs", {
  variants: {
    intent: {
      winning: "text-white bg-green-500",
      nofill: "text-gray-800 bg-gray-200",
    }
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