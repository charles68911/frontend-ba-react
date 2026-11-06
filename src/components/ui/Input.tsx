import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  rightElement,
  containerClassName,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? descriptionId : undefined}
          className={cn(
            "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-800 transition-colors placeholder:text-neutral-400 focus:border-brand focus:ring-1 focus:ring-brand/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50",
            rightElement && "pr-16",
            error && "border-neutral-500 focus:border-neutral-900 focus:ring-neutral-200",
            className,
          )}
          {...props}
        />

        {rightElement && (
          <span className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center">
            {rightElement}
          </span>
        )}
      </div>

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
