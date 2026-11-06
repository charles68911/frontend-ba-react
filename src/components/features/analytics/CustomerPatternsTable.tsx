import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { CustomerPerformance } from "@/types";

interface CustomerPatternsTableProps {
  rows: CustomerPerformance[];
}

export function CustomerPatternsTable({ rows }: CustomerPatternsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-neutral-200">
      <Table className="min-w-[680px]">
        <TableHead>
          <TableRow>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Orders</TableHeader>
            <TableHeader>Total spent</TableHeader>
            <TableHeader>Average order</TableHeader>
            <TableHeader>Last purchase</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-neutral-500">
                No customer purchases recorded for this period.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.customerId}>
                <TableCell className="font-medium text-neutral-800">
                  {row.customerName}
                </TableCell>
                <TableCell>{formatNumber(row.orders)}</TableCell>
                <TableCell className="whitespace-nowrap text-neutral-700">
                  {formatCurrency(row.totalSpent)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-neutral-700">
                  {formatCurrency(row.averageOrder)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-neutral-500">
                  {formatDate(row.lastPurchase)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
