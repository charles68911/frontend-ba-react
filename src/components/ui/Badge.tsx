import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Only three badge styles are needed across the app. */
export type BadgeTone = "neutral" | "info" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  info: "bg-white text-neutral-900 ring-neutral-400",
  danger: "bg-neutral-900 text-white ring-neutral-900",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
