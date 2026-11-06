
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getStockStatus } from "@/lib/status";
import type { Product } from "@/types";

interface LowStockProductsProps {
  products: Product[];
  onRestock: (product: Product) => void;
}

export function LowStockProducts({
  products,
  onRestock,
}: LowStockProductsProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        All products are above their reorder points. No low-stock alerts right
        now.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const status = getStockStatus(product.stock, product.reorderPoint);

        return (
          <div
            key={product.id}
            className="flex flex-col justify-between gap-3 rounded-md border border-neutral-200 p-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-neutral-800">{product.name}</p>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>

              <p className="mt-1 text-xs text-neutral-500">
                {product.stock} {product.unit} on hand · reorder at{" "}
                {product.reorderPoint} {product.unit}
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onRestock(product)}
            >
              Add stock
            </Button>
          </div>
        );
      })}
    </div>
  );
}
