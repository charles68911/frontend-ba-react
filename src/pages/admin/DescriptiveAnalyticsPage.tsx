import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { useAppData } from "@/components/context/AppDataContext";
import {
  getCustomerPerformance,
  getDailySales,
  getMonthlySales,
  getProductPerformance,
  getSalesSummary,
} from "@/components/features/analytics/analyticsUtils";
import { BestSellersChart } from "@/components/features/analytics/BestSellersChart";
import { CustomerPatternsTable } from "@/components/features/analytics/CustomerPatternsTable";
import { InventoryStatusPanel } from "@/components/features/analytics/InventoryStatusPanel";
import { MonthlySalesChart } from "@/components/features/analytics/MonthlySalesChart";
import { ProductPerformanceTable } from "@/components/features/analytics/ProductPerformanceTable";
import { SalesOverviewChart } from "@/components/features/analytics/SalesOverviewChart";
import { Select } from "@/components/ui/Select";
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from "@/lib/format";

const rangeOptions = [30, 90, 180];

export function DescriptiveAnalyticsPage() {
  const { sales, products } = useAppData();
  const [rangeDays, setRangeDays] = useState(30);

  const summary = getSalesSummary(sales, rangeDays);
  const dailySales = getDailySales(sales, rangeDays);
  const monthlySales = getMonthlySales(sales, 6);
  const customerPatterns = getCustomerPerformance(sales, rangeDays);
  const productPerformance = getProductPerformance(sales, products, rangeDays);

  const allProductPerformance = useMemo(() => {
    const performanceMap = new Map(
      productPerformance.map((item) => [item.productId, item]),
    );

    return products.map(
      (product) =>
        performanceMap.get(product.id) ?? {
          productId: product.id,
          productName: product.name,
          category: product.category,
          unitsSold: 0,
          revenue: 0,
        },
    );
  }, [products, productPerformance]);

  const bestSellers = allProductPerformance
    .filter((product) => product.unitsSold > 0)
    .sort((a, b) => b.unitsSold - a.unitsSold);
  const leastSellers = [...allProductPerformance]
    .sort((a, b) => a.unitsSold - b.unitsSold)
    .slice(0, 6);
  const topCustomerShare =
    summary.totalRevenue > 0 && customerPatterns.length > 0
      ? (customerPatterns
          .slice(0, 5)
          .reduce((total, customer) => total + customer.totalSpent, 0) /
          summary.totalRevenue) *
        100
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Descriptive Analytics"
        description="What happened? Review historical sales, product performance, customer behavior, and inventory status."
        action={
          <Select
            aria-label="Select analysis period"
            value={String(rangeDays)}
            onChange={(event) => setRangeDays(Number(event.target.value))}
            containerClassName="w-full sm:w-40"
          >
            {rangeOptions.map((days) => (
              <option key={days} value={days}>
                Last {days} days
              </option>
            ))}
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCompactCurrency(summary.totalRevenue)}
          helper={`Last ${rangeDays} days`}
        />
        <StatCard
          title="Transactions"
          value={formatNumber(summary.totalTransactions)}
          helper={`Average ${formatCurrency(summary.averageSale)}`}
        />
        <StatCard
          title="Units Sold"
          value={formatNumber(summary.totalUnitsSold)}
          helper="Combined kg, packs, and pieces"
        />
        <StatCard
          title="Top 5 Customer Share"
          value={`${topCustomerShare.toFixed(1)}%`}
          helper="Share of period revenue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Daily Sales History"
          description={`Daily sales for the last ${rangeDays} days`}
        >
          <SalesOverviewChart data={dailySales} />
        </SectionCard>

        <SectionCard
          title="Monthly Sales"
          description="Sales totals for the last six months"
        >
          <MonthlySalesChart data={monthlySales} />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Best-Selling Products"
          description="Top products by units sold in the selected period"
        >
          <BestSellersChart
            data={bestSellers.slice(0, 8).map((product) => ({
              name: product.productName,
              units: product.unitsSold,
            }))}
          />
        </SectionCard>

        <SectionCard
          title="Least-Selling Products"
          description="Lowest unit movement in the selected period"
          contentClassName="p-5"
        >
          <ProductPerformanceTable
            rows={leastSellers}
            emptyMessage="No product sales recorded for this period."
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Customer Purchasing Patterns"
          description={`Top customers by spending in the last ${rangeDays} days`}
          contentClassName="p-5"
          action={
            <span className="text-xs text-neutral-500">
              Top 8 customers shown
            </span>
          }
        >
          <CustomerPatternsTable rows={customerPatterns.slice(0, 8)} />
        </SectionCard>

        <SectionCard
          title="Inventory Status"
          description="Current stock health across the product catalog"
        >
          <InventoryStatusPanel products={products} />
        </SectionCard>
      </div>

      <SectionCard
        title="Product Movement Detail"
        description="Complete best-to-least selling product summary for the selected period"
        contentClassName="p-5"
      >
        <ProductPerformanceTable rows={bestSellers} />
      </SectionCard>

      <p className="text-xs text-neutral-500">
         Descriptive metrics are calculated using sales and product
  records retrieved from the database. Refunded sales are
  excluded from revenue figures.
      </p>
    </div>
  );
}
