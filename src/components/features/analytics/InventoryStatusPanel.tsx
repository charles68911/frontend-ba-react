import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge";
import { getStockStatus } from "@/lib/status";
import type { Product } from "@/types";

interface InventoryStatusPanelProps {
  products: Product[];
}

export function InventoryStatusPanel({ products }: InventoryStatusPanelProps) {
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= product.reorderPoint,
  );
  const outOfStock = products.filter((product) => product.stock <= 0);
  const healthy = products.length - lowStock.length - outOfStock.length;
  const total = Math.max(products.length, 1);

  const healthyPercent = (healthy / total) * 100;
  const lowPercent = (lowStock.length / total) * 100;
  const outPercent = (outOfStock.length / total) * 100;

  const alerts = products
    .filter((product) => product.stock <= product.reorderPoint)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const counts = [
    { label: "Healthy", value: healthy },
    { label: "Low stock", value: lowStock.length },
    { label: "Out of stock", value: outOfStock.length },
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="flex h-2 overflow-hidden rounded-sm bg-neutral-100">
          <div
            className="bg-neutral-900"
            style={{ width: `${healthyPercent}%` }}
            aria-hidden="true"
          />
          <div
            className="bg-neutral-500"
            style={{ width: `${lowPercent}%` }}
            aria-hidden="true"
          />
          <div
            className="bg-neutral-300"
            style={{ width: `${outPercent}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {counts.map((item) => (
            <div key={item.label} className="border border-neutral-200 p-3">
              <p className="text-xl font-semibold text-neutral-800">
                {item.value}
              </p>
              <p className="text-xs text-neutral-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {alerts.length === 0 ? (
        <p className="rounded-md border border-neutral-200 p-3 text-sm text-neutral-600">
          Inventory levels are healthy across the catalog.
        </p>
      ) : (
        <div className="space-y-2">
          {alerts.map((product) => {
            const status = getStockStatus(product.stock, product.reorderPoint);

            return (
              <div
                key={product.id}
                className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {product.stock} {product.unit} on hand
                  </p>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>
            );
          })}
        </div>
      )}

      <Link to="/inventory" className="inline-block text-sm font-medium text-brand hover:underline">
        Open inventory management
      </Link>
    </div>
  );
}
