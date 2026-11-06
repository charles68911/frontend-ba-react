import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export function Select({
  label,
  error,
  hint,
  containerClassName,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = `${selectId}-description`;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        className={cn(
          "h-10 w-full rounded-md border border-neutral-300 bg-white py-0 pr-9 pl-3.5 text-sm text-neutral-800 transition-colors focus:border-brand focus:ring-1 focus:ring-brand/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50",
          error && "border-neutral-500 focus:border-neutral-900 focus:ring-neutral-200",
          className,
        )}
        {...props}
      >
        {children}
      </select>

      {(error || hint) && (
        <p
          id={descriptionId}
          className={cn(
            "text-xs",
            error ? "text-neutral-900" : "text-neutral-500",
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
