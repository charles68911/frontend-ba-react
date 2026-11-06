
import { useMemo, useState } from "react";

import { Alert } from "@/components/common/Alert";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";

import { useAppData } from "@/components/context/AppDataContext";

import { getInventorySummary } from "@/components/features/analytics/analyticsUtils";
import { InventoryTable } from "@/components/features/inventory/InventoryTable";
import { LowStockProducts } from "@/components/features/inventory/LowStockProducts";
import { StockAdjustmentModal } from "@/components/features/inventory/StockAdjustmentModal";

import { Select } from "@/components/ui/Select";
import {
  formatCompactCurrency,
  formatNumber,
} from "@/lib/format";

import type { Product } from "@/types";

type StockFilter = "All" | "In stock" | "Low stock" | "Out of stock";

export function InventoryPage() {
  const {
    products,
    inventoryRecords,
    addStock,
  } = useAppData();

  const [productSearch, setProductSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All");
  const [stockTarget, setStockTarget] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");

  // Match products with their actual inventory records from the backend
  const inventoryProducts = useMemo(() => {
    return products.map((product) => {
      const inventoryRecord = inventoryRecords.find(
        (record) => String(record.productId) === product.id,
      );

      if (!inventoryRecord) {
        return product;
      }

      return {
        ...product,
        stock: inventoryRecord.currentStock,
        reorderPoint: inventoryRecord.reorderLevel,
      };
    });
  }, [products, inventoryRecords]);

  // Calculate inventory summary
  const summary = getInventorySummary(inventoryProducts);

  // Find products that need restocking
  const lowStockProducts = inventoryProducts
    .filter((product) => product.stock <= product.reorderPoint)
    .sort((a, b) => a.stock - b.stock);

  // Filter inventory products
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();

    return inventoryProducts.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.supplier.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Out of stock" && product.stock <= 0) ||
        (stockFilter === "Low stock" &&
          product.stock > 0 &&
          product.stock <= product.reorderPoint) ||
        (stockFilter === "In stock" &&
          product.stock > product.reorderPoint);

      return matchesSearch && matchesStock;
    });
  }, [inventoryProducts, productSearch, stockFilter]);

  // Open Add Stock modal
  function openStockModal(product: Product) {
    setStockTarget(product);
  }

  // Handle Add Stock form
  async function handleStockSubmit(
    quantity: number,
    reason: string,
  ) {
    if (!stockTarget) {
      return {
        success: false,
        message: "No product selected.",
      };
    }

    const result = await addStock(
      stockTarget.id,
      quantity,
      reason,
    );

    if (result.success) {
      setNotice(
        `${quantity} ${stockTarget.unit} of ${stockTarget.name} was added to inventory.`,
      );
    }

    return result;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Monitor available stock and replenish low-stock products."
      />

      {notice && (
        <Alert tone="success" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {/* Inventory Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Units On Hand"
          value={formatNumber(summary.totalUnits)}
          helper="Across all products"
        />

        <StatCard
          title="Inventory Value"
          value={formatCompactCurrency(summary.inventoryValue)}
          helper="Estimated at cost price"
        />

        <StatCard
          title="Low Stock"
          value={String(summary.lowStock.length)}
          helper="At or below reorder point"
        />

        <StatCard
          title="Out of Stock"
          value={String(summary.outOfStock.length)}
          helper="Requires immediate restocking"
        />
      </div>

      {/* Current Stock */}
      <SectionCard
        title="Current Stock"
        description={`${filteredProducts.length} of ${inventoryProducts.length} products shown`}
        contentClassName="p-0 sm:p-0"
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <SearchInput
              value={productSearch}
              onChange={setProductSearch}
              placeholder="Search stock..."
              className="sm:w-52"
            />

            <Select
              aria-label="Filter stock status"
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value as StockFilter)
              }
              containerClassName="sm:w-40"
            >
              <option value="All">All stock</option>
              <option value="In stock">In stock</option>
              <option value="Low stock">Low stock</option>
              <option value="Out of stock">Out of stock</option>
            </Select>
          </div>
        }
      >
        {filteredProducts.length > 0 ? (
          <InventoryTable
            products={filteredProducts}
            onAddStock={openStockModal}
          />
        ) : (
          <EmptyState
            title="No inventory records found"
            description="Try a different search term or stock filter."
          />
        )}
      </SectionCard>

      {/* Low Stock Products */}
      <SectionCard
        title="Low Stock Products"
        description="Products at or below their reorder point, sorted by urgency."
        contentClassName="p-5"
      >
        <LowStockProducts
          products={lowStockProducts}
          onRestock={openStockModal}
        />
      </SectionCard>

      {/* Add Stock Modal */}
      <StockAdjustmentModal
        open={Boolean(stockTarget)}
        product={stockTarget}
        onClose={() => setStockTarget(null)}
        onSubmit={handleStockSubmit}
      />
    </div>
  );
}
