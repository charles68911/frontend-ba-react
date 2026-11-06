import { Badge } from "@/components/ui/Badge";
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

interface SaleHistoryTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
}

export function SaleHistoryTable({ sales, onView }: SaleHistoryTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Sale ID</TableHeader>
          <TableHeader>Customer</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Items</TableHeader>
          <TableHeader>Total</TableHeader>
          <TableHeader>Payment</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader className="text-right">View</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium whitespace-nowrap text-brand">
              {sale.id}
            </TableCell>
            <TableCell>
              <p className="max-w-44 truncate font-medium text-neutral-800">
                {sale.customerName}
              </p>
            </TableCell>
            <TableCell className="whitespace-nowrap text-neutral-500">
              {formatDateTime(sale.date)}
            </TableCell>
            <TableCell>
              <p className="text-neutral-700">
                {sale.items.length} line{sale.items.length === 1 ? "" : "s"}
              </p>
              <p className="max-w-44 truncate text-xs text-neutral-500">
                {sale.items.map((item) => item.productName).join(", ")}
              </p>
            </TableCell>
            <TableCell className="font-semibold whitespace-nowrap text-neutral-800">
              {formatCurrency(sale.totalAmount)}
            </TableCell>
            <TableCell className="whitespace-nowrap text-neutral-600">
              {sale.paymentMethod}
            </TableCell>
            <TableCell>
              <Badge tone={getPaymentStatusTone(sale.paymentStatus)}>
                {sale.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onView(sale)}
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  aria-label={`View sale ${sale.id}`}
                  title="View sale details"
                >
                  View
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
