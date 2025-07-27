// components/ui/badge.jsx
import React from "react";
import { cn } from "../../lib/utils";

export const Badge = ({ variant = "default", className, children, ...props }) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    default: "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-white",
    secondary: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  };

  return (
    <span className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
