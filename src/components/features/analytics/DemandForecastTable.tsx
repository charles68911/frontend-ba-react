import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatNumber } from "@/lib/format";
import type { DemandForecast } from "@/types";

interface DemandForecastTableProps {
  rows: DemandForecast[];
}

export function DemandForecastTable({ rows }: DemandForecastTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-neutral-200">
      <Table className="min-w-[760px]">
        <TableHead>
          <TableRow>
            <TableHeader>Product</TableHeader>
            <TableHeader>Avg. daily demand</TableHeader>
            <TableHeader>Next 7 days</TableHeader>
            <TableHeader>Next 30 days</TableHeader>
            <TableHeader>Current stock</TableHeader>
            <TableHeader>Days of stock</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const daysLabel =
              row.daysOfStock >= 999 ? "No demand" : `${row.daysOfStock} days`;
            const daysTone = row.daysOfStock <= 3 ? "danger" : "neutral";

            return (
              <TableRow key={row.productId}>
                <TableCell>
                  <p className="font-medium text-neutral-800">
                    {row.productName}
                  </p>
                  <p className="text-xs text-neutral-500">per {row.unit}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatNumber(row.averageDailyDemand)} {row.unit}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatNumber(row.forecast7Days)} {row.unit}
                </TableCell>
                <TableCell className="whitespace-nowrap font-semibold text-neutral-800">
                  {formatNumber(row.forecast30Days)} {row.unit}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatNumber(row.currentStock)} {row.unit}
                </TableCell>
                <TableCell>
                  <Badge tone={daysTone}>{daysLabel}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
