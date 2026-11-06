import { Link } from "react-router";
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

interface RecentSalesTableProps {
  sales: Sale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  return (
    <div>
      <div className="overflow-hidden rounded-md border border-neutral-200">
        <Table className="min-w-[620px]">
          <TableHead>
            <TableRow>
              <TableHeader>Sale ID</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium text-brand">
                  {sale.id}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-neutral-800">
                    {sale.customerName}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {sale.items.length} product
                    {sale.items.length === 1 ? "" : "s"}
                  </p>
                </TableCell>
                <TableCell className="whitespace-nowrap text-neutral-500">
                  {formatDateTime(sale.date)}
                </TableCell>
                <TableCell className="font-semibold text-neutral-800">
                  {formatCurrency(sale.totalAmount)}
                </TableCell>
                <TableCell>
                  <Badge tone={getPaymentStatusTone(sale.paymentStatus)}>
                    {sale.paymentStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Link
        to="/sales"
        className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
      >
        View complete sales history
      </Link>
    </div>
  );
}
