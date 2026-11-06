
import { formatShortDate, toDateKey } from "@/lib/format";
import type {
  CustomerPerformance,
  DailySalesPoint,
  DemandForecast,
  MonthlySalesPoint,
  Product,
  ProductPerformance,
  RestockRecommendation,
  Sale,
  Transaction,
} from "@/types";

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(value: Date, amount: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

// Filter sales within the selected period.
// Excludes sales before the starting date and future-dated sales.
export function filterSalesByDays(sales: Sale[], days: number) {
  const today = startOfDay(new Date());

  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - (days - 1));

  return sales.filter((sale) => {
    const saleDate = startOfDay(new Date(sale.date));

    return saleDate >= cutoff && saleDate <= today;
  });
}

// Exclude refunded sales from revenue calculations.
function getRevenueSales(sales: Sale[]) {
  return sales.filter(
    (sale) => sale.paymentStatus !== "Refunded",
  );
}

// Calculate daily sales for the selected period.
export function getDailySales(
  sales: Sale[],
  days: number,
): DailySalesPoint[] {
  const revenueSales = getRevenueSales(
    filterSalesByDays(sales, days),
  );

  const totals = new Map<
    string,
    { sales: number; transactions: number }
  >();

  revenueSales.forEach((sale) => {
    const key = toDateKey(sale.date);
    const current = totals.get(key) ?? {
      sales: 0,
      transactions: 0,
    };

    totals.set(key, {
      sales: current.sales + sale.totalAmount,
      transactions: current.transactions + 1,
    });
  });

  const start = startOfDay(new Date());
  start.setDate(start.getDate() - (days - 1));

  return Array.from({ length: days }, (_, index) => {
    const date = addDays(start, index);
    const key = toDateKey(date);
    const total = totals.get(key);

    return {
      date: key,
      label: formatShortDate(date),
      sales: Math.round((total?.sales ?? 0) * 100) / 100,
      transactions: total?.transactions ?? 0,
    };
  });
}

// Calculate monthly sales for the last selected number of months.
export function getMonthlySales(
  sales: Sale[],
  months = 6,
): MonthlySalesPoint[] {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth() - (months - 1),
    1,
  );

  const end = startOfDay(now);

  const revenueSales = getRevenueSales(sales).filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= start && saleDate <= end;
  });

  const totals = new Map<
    string,
    { sales: number; transactions: number }
  >();

  revenueSales.forEach((sale) => {
    const date = new Date(sale.date);
    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    const current = totals.get(key) ?? {
      sales: 0,
      transactions: 0,
    };

    totals.set(key, {
      sales: current.sales + sale.totalAmount,
      transactions: current.transactions + 1,
    });
  });

  return Array.from({ length: months }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1 - index),
      1,
    );

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    const total = totals.get(key);

    return {
      month: key,
      label: new Intl.DateTimeFormat("en-PH", {
        month: "short",
      }).format(date),
      sales: Math.round((total?.sales ?? 0) * 100) / 100,
      transactions: total?.transactions ?? 0,
    };
  });
}

// Calculate sales performance for every product.
export function getProductPerformance(
  sales: Sale[],
  products: Product[],
  days?: number,
): ProductPerformance[] {
  const sourceSales = days
    ? filterSalesByDays(getRevenueSales(sales), days)
    : getRevenueSales(sales);

  const categoryMap = new Map(
    products.map((product) => [
      product.id,
      product.category,
    ]),
  );

  const nameMap = new Map(
    products.map((product) => [
      product.id,
      product.name,
    ]),
  );

  const performance = new Map<
    string,
    {
      name: string;
      units: number;
      revenue: number;
    }
  >();

  sourceSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const current = performance.get(item.productId) ?? {
        name: nameMap.get(item.productId) ?? item.productName,
        units: 0,
        revenue: 0,
      };

      performance.set(item.productId, {
        name: current.name,
        units: current.units + item.quantity,
        revenue: current.revenue + item.subtotal,
      });
    });
  });

  return Array.from(performance.entries())
    .map(([productId, value]) => ({
      productId,
      productName: value.name,
      category: categoryMap.get(productId) ?? "Others",
      unitsSold: value.units,
      revenue: Math.round(value.revenue * 100) / 100,
    }))
    .sort((a, b) => b.unitsSold - a.unitsSold);
}

// Calculate purchasing patterns for each customer.
export function getCustomerPerformance(
  sales: Sale[],
  days?: number,
): CustomerPerformance[] {
  const sourceSales = days
    ? filterSalesByDays(getRevenueSales(sales), days)
    : getRevenueSales(sales);

  const performance = new Map<
    string,
    {
      name: string;
      orders: number;
      totalSpent: number;
      lastPurchase: string;
    }
  >();

  sourceSales.forEach((sale) => {
    const current = performance.get(sale.customerId) ?? {
      name: sale.customerName,
      orders: 0,
      totalSpent: 0,
      lastPurchase: sale.date,
    };

    performance.set(sale.customerId, {
      name: current.name,
      orders: current.orders + 1,
      totalSpent: current.totalSpent + sale.totalAmount,
      lastPurchase:
        new Date(sale.date) > new Date(current.lastPurchase)
          ? sale.date
          : current.lastPurchase,
    });
  });

  return Array.from(performance.entries())
    .map(([customerId, value]) => ({
      customerId,
      customerName: value.name,
      orders: value.orders,
      totalSpent: Math.round(value.totalSpent * 100) / 100,
      lastPurchase: value.lastPurchase,
      averageOrder:
        value.orders > 0
          ? Math.round(
              (value.totalSpent / value.orders) * 100,
            ) / 100
          : 0,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

// Compare sales from the current and previous 30-day periods.
export function getSalesTrend(sales: Sale[]) {
  const history = getDailySales(sales, 60);

  const previousPeriod = history
    .slice(0, 30)
    .reduce((total, point) => total + point.sales, 0);

  const currentPeriod = history
    .slice(30, 60)
    .reduce((total, point) => total + point.sales, 0);

  const percentage =
    previousPeriod > 0
      ? ((currentPeriod - previousPeriod) / previousPeriod) * 100
      : currentPeriod > 0
        ? 100
        : 0;

  return {
    currentPeriod: Math.round(currentPeriod * 100) / 100,
    previousPeriod: Math.round(previousPeriod * 100) / 100,
    percentage: Math.round(percentage * 10) / 10,
    direction:
      percentage > 0.5
        ? ("up" as const)
        : percentage < -0.5
          ? ("down" as const)
          : ("flat" as const),
  };
}

// Calculate the main sales summary.
export function getSalesSummary(
  sales: Sale[],
  days?: number,
) {
  const source = days
    ? filterSalesByDays(getRevenueSales(sales), days)
    : getRevenueSales(sales);

  const totalRevenue = source.reduce(
    (total, sale) => total + sale.totalAmount,
    0,
  );

  const totalUnits = source.reduce(
    (total, sale) =>
      total +
      sale.items.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0,
      ),
    0,
  );

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalTransactions: source.length,
    averageSale:
      source.length > 0
        ? Math.round(
            (totalRevenue / source.length) * 100,
          ) / 100
        : 0,
    totalUnitsSold: totalUnits,
  };
}

export interface ForecastPoint {
  date: string;
  label: string;
  actual: number | null;
  forecast: number | null;
}

// Predict future sales using a simple linear trend.
export function getSalesForecast(
  sales: Sale[],
  forecastDays = 14,
) {
  const history = getDailySales(sales, 30);
  const values = history.map((point) => point.sales);
  const count = values.length;

  const averageX = (count - 1) / 2;

  const averageY =
    values.reduce((total, value) => total + value, 0) /
    Math.max(count, 1);

  let numerator = 0;
  let denominator = 0;

  values.forEach((value, index) => {
    numerator +=
      (index - averageX) * (value - averageY);

    denominator += (index - averageX) ** 2;
  });

  const slope =
    denominator > 0 ? numerator / denominator : 0;

  const intercept = averageY - slope * averageX;

  const points: ForecastPoint[] = history.map((point) => ({
    date: point.date,
    label: point.label,
    actual: point.sales,
    forecast: null,
  }));

  if (points.length > 0) {
    points[points.length - 1].forecast =
      points[points.length - 1].actual;
  }

  const today = startOfDay(new Date());
  let projectedRevenue = 0;

  for (let index = 0; index < forecastDays; index += 1) {
    const projected = Math.max(
      0,
      intercept + slope * (count + index),
    );

    const date = addDays(today, index + 1);

    projectedRevenue += projected;

    points.push({
      date: toDateKey(date),
      label: formatShortDate(date),
      actual: null,
      forecast: Math.round(projected * 100) / 100,
    });
  }

  return {
    points,
    projectedRevenue:
      Math.round(projectedRevenue * 100) / 100,
    averageDailySales:
      Math.round(averageY * 100) / 100,
    dailyTrend: Math.round(slope * 100) / 100,
    direction:
      slope > 1
        ? ("up" as const)
        : slope < -1
          ? ("down" as const)
          : ("flat" as const),
  };
}

// Estimate product demand using the last 30 days of sales.
export function getDemandForecasts(
  sales: Sale[],
  products: Product[],
): DemandForecast[] {
  const last30Days = filterSalesByDays(
    getRevenueSales(sales),
    30,
  );

  const unitsByProduct = new Map<string, number>();

  last30Days.forEach((sale) => {
    sale.items.forEach((item) => {
      unitsByProduct.set(
        item.productId,
        (unitsByProduct.get(item.productId) ?? 0) +
          item.quantity,
      );
    });
  });

  return products
    .map((product) => {
      const units = unitsByProduct.get(product.id) ?? 0;
      const averageDailyDemand = units / 30;
      const forecast7Days = averageDailyDemand * 7;
      const forecast30Days = averageDailyDemand * 30;

      const daysOfStock =
        averageDailyDemand > 0
          ? Math.round(
              (product.stock / averageDailyDemand) * 10,
            ) / 10
          : 999;

      return {
        productId: product.id,
        productName: product.name,
        unit: product.unit,
        averageDailyDemand:
          Math.round(averageDailyDemand * 100) / 100,
        forecast7Days:
          Math.round(forecast7Days * 10) / 10,
        forecast30Days:
          Math.round(forecast30Days * 10) / 10,
        currentStock: product.stock,
        daysOfStock,
      };
    })
    .sort((a, b) => b.forecast30Days - a.forecast30Days);
}

// Recommend products that need restocking.
export function getRestockRecommendations(
  products: Product[],
  forecasts: DemandForecast[],
): RestockRecommendation[] {
  const forecastMap = new Map(
    forecasts.map((forecast) => [
      forecast.productId,
      forecast,
    ]),
  );

  return products
    .map((product) => {
      const forecast = forecastMap.get(product.id);
      const forecast30Days =
        forecast?.forecast30Days ?? 0;

      const daysOfStock = forecast?.daysOfStock ?? 999;

      const suggestedQuantity = Math.max(
        0,
        Math.ceil(
          forecast30Days +
            product.reorderPoint -
            product.stock,
        ),
      );

      let priority: RestockRecommendation["priority"] = "Low";
      let reason =
        "Stock is sufficient for projected demand.";

      if (product.stock <= 0) {
        priority = "High";
        reason =
          "Out of stock. Reorder immediately to avoid lost sales.";
      } else if (daysOfStock <= 3) {
        priority = "High";
        reason =
          "Less than 3 days of stock remaining at current demand.";
      } else if (daysOfStock <= 7) {
        priority = "Medium";
        reason =
          "Stock may run out within the next week.";
      } else if (suggestedQuantity > 0) {
        priority = "Low";
        reason =
          "Below recommended buffer for the next 30 days.";
      }

      return {
        product,
        forecast30Days,
        suggestedQuantity,
        daysOfStock,
        priority,
        reason,
      };
    })
    .filter(
      (recommendation) =>
        recommendation.suggestedQuantity > 0,
    )
    .sort((a, b) => {
      const priorityOrder = {
        High: 0,
        Medium: 1,
        Low: 2,
      };

      const priorityDifference =
        priorityOrder[a.priority] -
        priorityOrder[b.priority];

      return priorityDifference !== 0
        ? priorityDifference
        : b.suggestedQuantity -
            a.suggestedQuantity;
    });
}

// Summarize the current inventory condition.
export function getInventorySummary(products: Product[]) {
  const lowStock = products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= product.reorderPoint,
  );

  const outOfStock = products.filter(
    (product) => product.stock <= 0,
  );

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0,
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.stock * product.cost,
    0,
  );

  return {
    totalUnits: Math.round(totalUnits * 100) / 100,
    inventoryValue:
      Math.round(inventoryValue * 100) / 100,
    lowStock,
    outOfStock,
    healthy:
      products.length -
      lowStock.length -
      outOfStock.length,
  };
}

// Summarize transaction payment statuses and outstanding sale balances.
export function getTransactionSummary(
  transactions: Transaction[],
  sales: Sale[],
) {
  return {
    paid: transactions.filter(
      (item) => item.paymentStatus === "Paid",
    ).length,

    pending: transactions.filter(
      (item) => item.paymentStatus === "Pending",
    ).length,

    partial: transactions.filter(
      (item) => item.paymentStatus === "Partial",
    ).length,

    refunded: transactions.filter(
      (item) => item.paymentStatus === "Refunded",
    ).length,

    outstanding: sales
      .filter(
        (sale) =>
          sale.paymentStatus === "Pending" ||
          sale.paymentStatus === "Partial",
      )
      .reduce(
        (total, sale) => total + sale.remainingBalance,
        0,
      ),
  };
}
