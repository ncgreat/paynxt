// components/ui/card.jsx
import React from "react";
import { cn } from "../../lib/utils";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
