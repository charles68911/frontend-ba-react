
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

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Product</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Price</TableHeader>
          <TableHeader>Available Stock</TableHeader>
          <TableHeader>Reorder Point</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {products.map((product) => {
          const status = getStockStatus(
            product.stock,
            product.reorderPoint
          );

          return (
            <TableRow key={product.id}>
              <TableCell>
                <p className="font-medium text-neutral-800">
                  {product.name}
                </p>
                <p className="max-w-56 truncate text-xs text-neutral-500">
                  {product.description || product.id}
                </p>
              </TableCell>

              <TableCell>
                <Badge>{product.category}</Badge>
              </TableCell>

              <TableCell>
                <p className="font-semibold whitespace-nowrap text-neutral-800">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-xs text-neutral-500">
                  per {product.unit}
                </p>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">
                    {product.stock} {product.unit}
                  </span>
                  <Badge tone={status.tone}>
                    {status.label}
                  </Badge>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap text-neutral-600">
                {product.reorderPoint} {product.unit}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 hover:underline"
                  >
                    Delete
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
