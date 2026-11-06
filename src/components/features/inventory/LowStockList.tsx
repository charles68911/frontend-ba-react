import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge";
import { getStockStatus } from "@/lib/status";
import type { Product } from "@/types";

interface LowStockListProps {
  products: Product[];
}

export function LowStockList({ products }: LowStockListProps) {
  return (
    <div>
      <div className="space-y-2.5">
        {products.map((product) => {
          const status = getStockStatus(product.stock, product.reorderPoint);

          return (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-800">
                  {product.name}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {product.stock} {product.unit} left · reorder at{" "}
                  {product.reorderPoint}
                </p>
              </div>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
          );
        })}
      </div>

      <Link
        to="/inventory"
        className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
      >
        Review inventory
      </Link>
    </div>
  );
}
