
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency } from "@/lib/format";
import { getStockStatus } from "@/lib/status";
import type { Product } from "@/types";

interface InventoryTableProps {
  products: Product[];
  onAddStock: (product: Product) => void;
}

export function InventoryTable({
  products,
  onAddStock,
}: InventoryTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Product</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Available stock</TableHeader>
          <TableHeader>Reorder point</TableHeader>
          <TableHeader>Stock value</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {products.map((product) => {
          const status = getStockStatus(
            product.stock,
            product.reorderPoint,
          );

          return (
            <TableRow key={product.id}>
              <TableCell>
                <p className="font-medium text-neutral-800">
                  {product.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {product.supplier}
                </p>
              </TableCell>

              <TableCell className="whitespace-nowrap text-neutral-600">
                {product.category}
              </TableCell>

              <TableCell>
                <p className="font-semibold whitespace-nowrap text-neutral-800">
                  {product.stock} {product.unit}
                </p>
              </TableCell>

              <TableCell className="whitespace-nowrap text-neutral-600">
                {product.reorderPoint} {product.unit}
              </TableCell>

              <TableCell className="whitespace-nowrap text-neutral-600">
                {formatCurrency(product.stock * product.cost)}
              </TableCell>

              <TableCell>
                <Badge tone={status.tone}>
                  {status.label}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onAddStock(product)}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Add Stock
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
