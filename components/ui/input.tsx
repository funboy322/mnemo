import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-12 px-4 rounded-2xl border-2 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-200/50 focus:outline-none transition-all",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
