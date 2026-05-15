import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input — Quiet direction. Flat 1px rule border, focuses to ink without
 * a saturated ring. Used everywhere a generic text input is needed.
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-11 px-4 rounded-[14px] border border-rule bg-surface text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none transition-colors font-display",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
