import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={`p-4 rounded-lg bg-amber-50 border-2 border-amber-200 hover:shadow-lg text-blue-500 ${className || ""}`}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
};
export default Card;