
import { Alert } from "@/components/common/Alert";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { useAppData } from "@/components/context/AppDataContext";
import {
  getDemandForecasts,
  getSalesForecast,
  getSalesTrend,
} from "@/components/features/analytics/analyticsUtils";
import { DemandForecastChart } from "@/components/features/analytics/DemandForecastChart";
import { DemandForecastTable } from "@/components/features/analytics/DemandForecastTable";
import { ForecastChart } from "@/components/features/analytics/ForecastChart";
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from "@/lib/format";

export function PredictiveAnalyticsPage() {
  const { sales, products } = useAppData();

  const forecast = getSalesForecast(sales, 30);
  const demandForecasts = getDemandForecasts(sales, products);
  const trend = getSalesTrend(sales);

  const topDemand = demandForecasts[0];

  const lowCoverage = demandForecasts.filter(
    (item) => item.daysOfStock <= 7,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Predictive Analytics"
        description="What might happen? Explore projected sales and product demand based on historical patterns."
      />

      <Alert tone="info" title="Forecast method">
        Sales forecasts use simple linear regression based on daily sales
        from the last 30 days. Product demand forecasts use average daily
        quantities sold during the same period. These are academic
        projections based on historical records, not guaranteed outcomes.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projected 30-Day Sales"
          value={formatCompactCurrency(forecast.projectedRevenue)}
          helper="Based on the recent daily sales trend"
        />

        <StatCard
          title="Average Daily Sales"
          value={formatCompactCurrency(forecast.averageDailySales)}
          helper="Average revenue per day over the last 30 days"
        />

        <StatCard
          title="Daily Trend"
          value={`${forecast.dailyTrend >= 0 ? "+" : ""}${formatCompactCurrency(forecast.dailyTrend)}`}
          helper="Estimated daily revenue change"
          trend={{
            direction: forecast.direction,
            label:
              forecast.direction === "up"
                ? "Rising"
                : forecast.direction === "down"
                  ? "Softening"
                  : "Stable",
          }}
        />

        <StatCard
          title="30-Day Sales Growth"
          value={`${trend.percentage >= 0 ? "+" : ""}${trend.percentage.toFixed(1)}%`}
          helper="Compared with the previous 30 days"
          trend={{
            direction: trend.direction,
            label:
              trend.direction === "up"
                ? "Growing"
                : trend.direction === "down"
                  ? "Declining"
                  : "Stable",
          }}
        />
      </div>

      <SectionCard
        title="Sales Forecast"
        description="Actual sales for the last 30 days and projected sales for the next 30 days"
        action={
          <span className="text-xs text-neutral-500">
            Projected: {formatCompactCurrency(forecast.projectedRevenue)}
          </span>
        }
      >
        <ForecastChart data={forecast.points} />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Product Demand Forecast"
          description="Estimated product demand for the next 30 days, ranked from highest to lowest"
        >
          <DemandForecastChart data={demandForecasts} />
        </SectionCard>

        <SectionCard
          title="Forecast Summary"
          description="Key predictions to watch"
        >
          <div className="space-y-4">
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">
                Projected 30-day revenue
              </p>

              <p className="mt-1 text-xl font-semibold text-neutral-800">
                {formatCurrency(forecast.projectedRevenue)}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {forecast.direction === "up"
                  ? "Upward"
                  : forecast.direction === "down"
                    ? "Downward"
                    : "Stable"}{" "}
                daily trend of{" "}
                {formatCurrency(Math.abs(forecast.dailyTrend))}
              </p>
            </div>

            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-medium text-neutral-800">
                Top demand product
              </p>

              <p className="mt-0.5 text-xs text-neutral-500">
                {topDemand && topDemand.forecast30Days > 0
                  ? `${topDemand.productName}: about ${formatNumber(topDemand.forecast30Days)} ${topDemand.unit} over 30 days`
                  : "No recent product demand recorded."}
              </p>
            </div>

            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-medium text-neutral-800">
                Low stock coverage
              </p>

              <p className="mt-0.5 text-xs text-neutral-500">
                {lowCoverage} product{lowCoverage === 1 ? "" : "s"}{" "}
                {lowCoverage === 1 ? "has" : "have"} 7 days or less
                of estimated stock coverage based on recent demand.
              </p>
            </div>

            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-medium text-neutral-800">
                Planning horizon
              </p>

              <p className="mt-0.5 text-xs text-neutral-500">
                Forecasts cover the next 30 days. Review Prescriptive
                Analytics for suggested restocking actions.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Product Demand Table"
        description="Estimated demand by product for the next 30 days, sorted from highest to lowest"
        contentClassName="p-5"
      >
        <DemandForecastTable rows={demandForecasts} />
      </SectionCard>

      <p className="text-xs text-neutral-500">
        Forecast values are calculated using sales and product records
        retrieved from the database. Predictions are estimates based on
        historical sales patterns and are not guaranteed outcomes.
      </p>
    </div>
  );
}
