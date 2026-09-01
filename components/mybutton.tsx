import { cva, VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

export const INTENTS = ["primary", "secondary", "danger"] as const;
export const SIZES = ["sm", "md", "lg"] as const;

type Intent = (typeof INTENTS)[number];
type Size = (typeof SIZES)[number];

interface MyButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof myButtonStyles> { }

const myButtonStyles = cva('py-2 px-4 rounded font-bold', {
  variants: {
    intent: {
      primary: "text-white bg-green-500",
      secondary: "text-gray-800 bg-gray-200",
      danger: "text-white bg-red-500",
    } satisfies Record<Intent, string>,
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg px-6 py-3",
    } satisfies Record<Size, string>
  },
  defaultVariants: {
    intent: "primary",
    size: "md"
  },
}
);
const MyButton = ({ intent, size, className, children, ...props }: MyButtonProps) => {
  return (
    <button
      {...props}
      className={`${myButtonStyles({ intent, size })} ${className || ''}`}
    >
      {children}
    </button>
  );
}
export default MyButton;