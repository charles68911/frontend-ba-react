import type { BadgeTone } from "@/components/ui/Badge";
import type { PaymentStatus } from "@/types";

/**
 * Payment status uses two visual states only:
 * - info (outlined) for a normal, paid record
 * - danger (solid black) for a refunded record
 * Everything else stays neutral gray.
 */
export function getPaymentStatusTone(status: PaymentStatus): BadgeTone {
  if (status === "Paid") return "info";
  if (status === "Refunded") return "danger";
  return "neutral";
}

export function getStockStatus(stock: number, reorderPoint: number) {
  if (stock <= 0) {
    return { label: "Out of stock", tone: "danger" as BadgeTone };
  }

  if (stock <= reorderPoint) {
    return { label: "Low stock", tone: "info" as BadgeTone };
  }

  return { label: "In stock", tone: "neutral" as BadgeTone };
}
