import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { RestockRecommendation } from "@/types";

interface RestockRecommendationsTableProps {
  rows: RestockRecommendation[];
  onApply: (recommendation: RestockRecommendation) => void;
}

const priorityTones: Record<
  RestockRecommendation["priority"],
  BadgeTone
> = {
  High: "danger",
  Medium: "neutral",
  Low: "neutral",
};

export function RestockRecommendationsTable({
  rows,
  onApply,
}: RestockRecommendationsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-neutral-200">
      <Table className="min-w-[980px]">
        <TableHead>
          <TableRow>
            <TableHeader>Priority</TableHeader>
            <TableHeader>Product</TableHeader>
            <TableHeader>Current stock</TableHeader>
            <TableHeader>30-day forecast</TableHeader>
            <TableHeader>Days cover</TableHeader>
            <TableHeader>Suggested order</TableHeader>
            <TableHeader>Estimated cost</TableHeader>
            <TableHeader className="text-right">Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center text-neutral-500">
                No restocking is needed based on the current forecast.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.product.id}>
                <TableCell>
                  <Badge tone={priorityTones[row.priority]}>
                    {row.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-neutral-800">
                    {row.product.name}
                  </p>
                  <p className="max-w-60 truncate text-xs text-neutral-500">
                    {row.reason}
                  </p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatNumber(row.product.stock)} {row.product.unit}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatNumber(row.forecast30Days)} {row.product.unit}
                </TableCell>
                <TableCell className="whitespace-nowrap text-neutral-600">
                  {row.daysOfStock >= 999
                    ? "No demand"
                    : `${row.daysOfStock} days`}
                </TableCell>
                <TableCell className="font-semibold whitespace-nowrap text-neutral-800">
                  +{formatNumber(row.suggestedQuantity)} {row.product.unit}
                </TableCell>
                <TableCell className="whitespace-nowrap text-neutral-700">
                  {formatCurrency(row.suggestedQuantity * row.product.cost)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApply(row)}
                    >
                      Restock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
