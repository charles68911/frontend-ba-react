import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export function Textarea({
  label,
  error,
  hint,
  containerClassName,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = `${textareaId}-description`;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        className={cn(
          "min-h-24 w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 transition-colors placeholder:text-neutral-400 focus:border-brand focus:ring-1 focus:ring-brand/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50",
          error && "border-neutral-500 focus:border-neutral-900 focus:ring-neutral-200",
          className,
        )}
        {...props}
      />

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
