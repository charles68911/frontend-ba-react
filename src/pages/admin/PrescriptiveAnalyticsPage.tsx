
import { useState } from "react";
import { Alert } from "@/components/common/Alert";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { useAppData } from "@/components/context/AppDataContext";
import {
  getDemandForecasts,
  getProductPerformance,
  getRestockRecommendations,
} from "@/components/features/analytics/analyticsUtils";
import { RestockChart } from "@/components/features/analytics/RestockChart";
import { RestockRecommendationsTable } from "@/components/features/analytics/RestockRecommendationsTable";
import { Badge } from "@/components/ui/Badge";
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from "@/lib/format";
import type { RestockRecommendation } from "@/types";

export function PrescriptiveAnalyticsPage() {
  const { sales, products, addStock } = useAppData();

  const [restockTarget, setRestockTarget] =
    useState<RestockRecommendation | null>(null);
  const [notice, setNotice] = useState("");

  const demandForecasts = getDemandForecasts(sales, products);

  const recommendations = getRestockRecommendations(
    products,
    demandForecasts,
  );

  const highPriority = recommendations.filter(
    (recommendation) => recommendation.priority === "High",
  );

  const totalSuggestedUnits = recommendations.reduce(
    (total, recommendation) =>
      total + recommendation.suggestedQuantity,
    0,
  );

  const estimatedRestockCost = recommendations.reduce(
    (total, recommendation) =>
      total +
      recommendation.suggestedQuantity *
        recommendation.product.cost,
    0,
  );

  const recentPerformance = getProductPerformance(
    sales,
    products,
    30,
  );

  const performanceMap = new Map(
    recentPerformance.map((item) => [
      item.productId,
      item,
    ]),
  );

  const slowMoving = products
    .map((product) => ({
      product,
      unitsSold:
        performanceMap.get(product.id)?.unitsSold ?? 0,
    }))
    .filter(
      (item) =>
        item.product.stock > item.product.reorderPoint,
    )
    .sort((a, b) => a.unitsSold - b.unitsSold)
    .slice(0, 5);

  async function applyRestock() {
    if (!restockTarget) return;

    const result = await addStock(
      restockTarget.product.id,
      restockTarget.suggestedQuantity,
      "Applied prescriptive restock recommendation",
    );

    if (result.success) {
      setNotice(
        `${formatNumber(
          restockTarget.suggestedQuantity,
        )} ${restockTarget.product.unit} of ${
          restockTarget.product.name
        } was added to inventory.`,
      );
    }

    setRestockTarget(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescriptive Analytics"
        description="What should the business do? Turn forecast demand and current stock into clear restocking actions."
      />

      {notice && (
        <Alert
          tone="success"
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      <Alert
        tone="info"
        title="How recommendations are calculated"
      >
        Suggested order quantity = projected 30-day demand +
        reorder point − current stock. High priority applies
        to products that are out of stock or have 3 days of
        stock coverage or less. Medium priority applies to
        products with 7 days of coverage or less. Other
        recommended products are classified as Low priority.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="High Priority Items"
          value={String(highPriority.length)}
          helper="Restock as soon as possible"
        />

        <StatCard
          title="Suggested Restock Units"
          value={formatNumber(totalSuggestedUnits)}
          helper="Across all recommendations"
        />

        <StatCard
          title="Estimated Restock Cost"
          value={formatCompactCurrency(
            estimatedRestockCost,
          )}
          helper="Based on product cost prices"
        />

        <StatCard
          title="Products To Review"
          value={String(recommendations.length)}
          helper="Products with a suggested action"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Stock Before and After Recommended Restock"
          description="Top restocking recommendations by suggested quantity"
        >
          <RestockChart
            recommendations={recommendations}
          />
        </SectionCard>

        <SectionCard
          title="Action Plan"
          description="Recommended next steps for the business"
        >
          <div className="space-y-3">
            {recommendations.length === 0 ? (
              <p className="rounded-md border border-neutral-200 p-3 text-sm text-neutral-600">
                No restocking actions are required right now.
                Continue monitoring stock levels.
              </p>
            ) : (
              <div className="rounded-md border border-neutral-300 bg-neutral-100 p-3">
                <p className="text-sm font-semibold text-neutral-900">
                  Restock urgent products
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-900">
                  {highPriority.length > 0
                    ? `Prioritize ${highPriority
                        .slice(0, 3)
                        .map((item) => item.product.name)
                        .join(", ")}.`
                    : "No products are currently in the high-priority group."}
                </p>
              </div>
            )}

            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-semibold text-neutral-800">
                Place the suggested orders
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Ordering all suggested quantities would add{" "}
                {formatNumber(totalSuggestedUnits)} units at
                an estimated cost of{" "}
                {formatCurrency(estimatedRestockCost)}.
              </p>
            </div>

            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-semibold text-neutral-800">
                Promote slow-moving stock
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {slowMoving.length > 0
                  ? `Consider bundles or promotions for ${slowMoving
                      .slice(0, 3)
                      .map((item) => item.product.name)
                      .join(", ")}.`
                  : "No slow-moving products identified."}
              </p>
            </div>

            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-semibold text-neutral-800">
                Review reorder points
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Revisit reorder levels monthly as demand
                changes, especially for seasonal seafood
                products.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Restock Recommendations"
        description="Products that need additional inventory, ordered by priority"
        contentClassName="p-5"
      >
        <RestockRecommendationsTable
          rows={recommendations}
          onApply={setRestockTarget}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Slow-Moving Stock"
          description="Products with stock above the reorder point and the lowest recent unit sales"
          contentClassName="p-5"
        >
          <div className="space-y-2.5">
            {slowMoving.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-500">
                No slow-moving stock identified.
              </p>
            ) : (
              slowMoving.map(({ product, unitsSold }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-800">
                      {product.name}
                    </p>

                    <p className="mt-0.5 text-xs text-neutral-500">
                      {unitsSold} units sold in 30 days ·{" "}
                      {product.stock} {product.unit} on hand
                    </p>
                  </div>

                  <Badge>Promote</Badge>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Suggested Stock Adjustments"
          description="Practical adjustments based on current stock and demand"
          contentClassName="p-5"
        >
          <div className="space-y-3 text-sm text-neutral-600">
            <div className="rounded-md bg-neutral-50 p-3">
              <p className="font-medium text-neutral-800">
                Use the reorder point as a safety buffer
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Keep enough stock to cover supplier lead time
                plus a small buffer for unexpected orders.
              </p>
            </div>

            <div className="rounded-md bg-neutral-50 p-3">
              <p className="font-medium text-neutral-800">
                Apply the suggested quantities selectively
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Check storage capacity and shelf life before
                ordering the full recommendation for
                perishable products.
              </p>
            </div>

            <div className="rounded-md bg-neutral-50 p-3">
              <p className="font-medium text-neutral-800">
                Rebalance slow movers
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Consider reducing future orders for
                slow-moving items and offering bundles with
                best sellers.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <ConfirmDialog
        open={Boolean(restockTarget)}
        onClose={() => setRestockTarget(null)}
        onConfirm={applyRestock}
        title="Apply restock recommendation?"
        confirmLabel="Add Stock"
        destructive={false}
        description={
          restockTarget
            ? `This will add ${formatNumber(
                restockTarget.suggestedQuantity,
              )} ${restockTarget.product.unit} of ${
                restockTarget.product.name
              } to inventory at an estimated cost of ${formatCurrency(
                restockTarget.suggestedQuantity *
                  restockTarget.product.cost,
              )}.`
            : ""
        }
      />
    </div>
  );
}
