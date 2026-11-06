import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface StatCardProps {
  title: string;
  value: string;
  helper?: string;
  trend?: {
    direction: "up" | "down" | "flat";
    label: string;
  };
}

export function StatCard({ title, value, helper, trend }: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-1 truncate text-2xl font-semibold text-neutral-900">
        {value}
      </p>

      <div className="mt-2 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {trend && (
          <span
            className={cn(
              "font-medium",
              trend.direction === "up" && "text-neutral-900",
              trend.direction === "down" && "text-neutral-500",
              trend.direction === "flat" && "text-neutral-500",
            )}
          >
            {trend.label}
          </span>
        )}
        {helper && <span className="text-neutral-500">{helper}</span>}
      </div>
    </Card>
  );
}
