"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

/**
 * Button — Quiet direction.
 *
 * Primary = green pill with the single allowed shadow.
 * Secondary = ink pill (no shadow).
 * Outline = transparent with 1px rule border.
 * Ghost = no border, hover lifts to ink.
 * Danger = ink pill — Quiet avoids loud reds; destructive actions get a
 *          confirm step instead of a colored button.
 */
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-green text-surface hover:brightness-95 shadow-[0_1px_2px_rgba(13,138,74,0.2),0_4px_14px_rgba(13,138,74,0.18)]",
  secondary: "bg-ink text-surface hover:brightness-110",
  ghost: "bg-transparent text-ink-soft hover:text-ink",
  outline:
    "bg-transparent text-ink border border-rule hover:border-ink",
  danger: "bg-ink text-surface hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-[13.5px] rounded-full",
  md: "h-11 px-5 text-[14.5px] rounded-full",
  lg: "h-12 px-6 text-[15px] rounded-full",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-display font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
