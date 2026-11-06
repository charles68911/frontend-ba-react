import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { ProductPerformance } from "@/types";

interface ProductPerformanceTableProps {
  rows: ProductPerformance[];
  emptyMessage?: string;
}

export function ProductPerformanceTable({
  rows,
  emptyMessage = "No product sales recorded for this period.",
}: ProductPerformanceTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-neutral-200">
      <Table className="min-w-[520px]">
        <TableHead>
          <TableRow>
            <TableHeader>Product</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Units sold</TableHeader>
            <TableHeader className="text-right">Revenue</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-neutral-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.productId}>
                <TableCell className="font-medium text-neutral-800">
                  {row.productName}
                </TableCell>
                <TableCell>
                  <Badge tone="neutral">{row.category}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatNumber(row.unitsSold)}
                </TableCell>
                <TableCell className="text-right font-semibold whitespace-nowrap text-neutral-800">
                  {formatCurrency(row.revenue)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
