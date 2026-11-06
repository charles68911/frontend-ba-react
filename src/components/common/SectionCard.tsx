import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
          )}
        </div>
        {action && (
          <div className="w-full shrink-0 sm:w-auto">{action}</div>
        )}
      </div>

      <div className={cn("p-5", contentClassName)}>{children}</div>
    </Card>
  );
}
