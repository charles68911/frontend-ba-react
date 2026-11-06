import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getPaymentStatusTone } from "@/lib/status";
import type { Sale } from "@/types";

interface SaleDetailsModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  return (
    <Modal
      open={Boolean(sale)}
      onClose={onClose}
      title={sale ? `Sale ${sale.id}` : "Sale details"}
      description={sale ? formatDateTime(sale.date) : undefined}
      size="lg"
    >
      {sale && (
        <div className="space-y-5">
          <div className="grid gap-3 rounded-md bg-neutral-50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-neutral-500">Customer</p>
              <p className="mt-0.5 font-medium text-neutral-800">
                {sale.customerName}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Payment</p>
              <p className="mt-0.5 flex items-center gap-2 font-medium text-neutral-800">
                {sale.paymentMethod}
                <Badge tone={getPaymentStatusTone(sale.paymentStatus)}>
                  {sale.paymentStatus}
                </Badge>
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-neutral-500">Notes</p>
              <p className="mt-0.5 text-sm text-neutral-700">
                {sale.notes || "No notes recorded."}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-neutral-200">
            <Table className="min-w-[480px]">
              <TableHead>
                <TableRow>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Qty</TableHeader>
                  <TableHeader>Unit price</TableHeader>
                  <TableHeader className="text-right">Subtotal</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium text-neutral-800">
                      {item.productName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-semibold whitespace-nowrap">
                      {formatCurrency(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="font-semibold text-neutral-700">Total amount</span>
            <span className="text-xl font-bold text-brand">
              {formatCurrency(sale.totalAmount)}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
