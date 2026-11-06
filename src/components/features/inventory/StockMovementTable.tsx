import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatDateTime } from "@/lib/format";
import type { StockMovement } from "@/types";

interface StockMovementTableProps {
  movements: StockMovement[];
}

export function StockMovementTable({ movements }: StockMovementTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Type</TableHeader>
          <TableHeader>Product</TableHeader>
          <TableHeader>Quantity change</TableHeader>
          <TableHeader>Reason</TableHeader>
          <TableHeader>Reference</TableHeader>
          <TableHeader>Date</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {movements.map((movement) => {
          const signedQuantity =
            movement.type === "Stock Out"
              ? -movement.quantity
              : movement.quantity;

          return (
            <TableRow key={movement.id}>
              <TableCell>
                <Badge>{movement.type}</Badge>
              </TableCell>
              <TableCell>
                <p className="font-medium text-slate-800">
                  {movement.productName}
                </p>
              </TableCell>
              <TableCell>
                <span
                  className={
                    signedQuantity < 0
                      ? "font-semibold whitespace-nowrap text-rose-600"
                      : "font-semibold whitespace-nowrap text-slate-800"
                  }
                >
                  {signedQuantity > 0 ? "+" : ""}
                  {signedQuantity} {movement.unit}
                </span>
              </TableCell>
              <TableCell>
                <span className="block max-w-52 truncate text-slate-600">
                  {movement.reason}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap text-slate-500">
                {movement.reference}
              </TableCell>
              <TableCell className="whitespace-nowrap text-slate-500">
                {formatDateTime(movement.date)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
