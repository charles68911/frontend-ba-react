import { cn } from "@/lib/cn";

type AlertTone = "success" | "error" | "info";

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: string;
  onClose?: () => void;
}

// Messages are neutral gray by default. Errors are emphasized with a dark border.
const toneClasses: Record<AlertTone, string> = {
  success: "border-neutral-300 bg-white text-neutral-700",
  info: "border-neutral-300 bg-white text-neutral-600",
  error: "border-neutral-900 bg-white text-neutral-900",
};

export function Alert({
  tone = "info",
  title,
  children,
  onClose,
}: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-md border px-3 py-2.5 text-sm",
        toneClasses[tone],
      )}
    >
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className={cn(title && "mt-0.5")}>{children}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
          aria-label="Dismiss message"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
