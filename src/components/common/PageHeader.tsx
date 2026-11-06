import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-brand sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">{description}</p>
      </div>

      {action && (
        <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
