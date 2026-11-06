import { useNavigate } from "react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { useAppData } from "@/components/context/AppDataContext";
import {
  getDailySales,
  getInventorySummary,
  getProductPerformance,
  getSalesSummary,
  getSalesTrend,
} from "@/components/features/analytics/analyticsUtils";
import { BestSellersChart } from "@/components/features/analytics/BestSellersChart";
import { SalesOverviewChart } from "@/components/features/analytics/SalesOverviewChart";
import { LowStockList } from "@/components/features/inventory/LowStockList";
import { RecentSalesTable } from "@/components/features/sales/RecentSalesTable";
import { Button } from "@/components/ui/Button";
import { formatCompactCurrency, formatNumber } from "@/lib/format";

export function DashboardPage() {
  const { sales, products, customers } = useAppData();
  const navigate = useNavigate();

  const summary = getSalesSummary(sales);
  const trend = getSalesTrend(sales);
  const inventory = getInventorySummary(products);
  const dailySales = getDailySales(sales, 30);
  const bestSellers = getProductPerformance(sales, products, 30)
    .slice(0, 6)
    .map((product) => ({
      name: product.productName,
      units: product.unitsSold,
    }));

  const lowStockProducts = products
    .filter((product) => product.stock <= product.reorderPoint)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Dashboard"
        description="A quick view of sales performance, inventory health, and customer activity."
        action={
          <Button onClick={() => navigate("/sales")}>Record Sale</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Sales"
          value={formatCompactCurrency(summary.totalRevenue)}
          helper="vs previous 30 days"
          trend={{
            direction: trend.direction,
            label: `${Math.abs(trend.percentage).toFixed(1)}%`,
          }}
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(customers.length)}
          helper={`${new Set(sales.map((sale) => sale.customerId)).size} active buyers`}
        />
        <StatCard
          title="Total Products"
          value={formatNumber(products.length)}
          helper="Seafood product catalog"
        />
        <StatCard
          title="Total Inventory"
          value={formatNumber(inventory.totalUnits)}
          helper="Units on hand (kg / packs / pcs)"
          trend={{
            direction: "flat",
            label: formatCompactCurrency(inventory.inventoryValue),
          }}
        />
        <StatCard
          title="Low Stock Products"
          value={formatNumber(
            inventory.lowStock.length + inventory.outOfStock.length,
          )}
          helper={`${inventory.outOfStock.length} out of stock`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Sales Overview"
          description="Daily sales for the last 30 days"
          action={
            <span className="text-xs text-neutral-500">
              This period: {formatCompactCurrency(trend.currentPeriod)}
            </span>
          }
        >
          <SalesOverviewChart data={dailySales} />
        </SectionCard>

        <SectionCard
          title="Best-Selling Products"
          description="Top products by units sold (last 30 days)"
          action={
            <button
              type="button"
              onClick={() => navigate("/analytics/descriptive")}
              className="text-xs font-medium text-brand hover:underline"
            >
              View details
            </button>
          }
        >
          <BestSellersChart data={bestSellers} />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Recent Sales"
          description="Latest transactions recorded in the system"
          contentClassName="p-5"
        >
          <RecentSalesTable sales={sales.slice(0, 5)} />
        </SectionCard>

        <SectionCard
          title="Low Stock Alerts"
          description="Products at or below their reorder point"
          contentClassName="p-5"
        >
          {lowStockProducts.length > 0 ? (
            <LowStockList products={lowStockProducts} />
          ) : (
            <p className="py-8 text-center text-sm text-neutral-500">
              All products are above their reorder points.
            </p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
