import api from "@/lib/axios";

export interface DashboardAnalytics {
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  totalInventory: number;
  lowStockCount: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalTransactions: number;
  averageSale: number;
  totalUnitsSold: number;
}

export const analyticsService = {
  async getDashboard() {
    const { data } = await api.get<DashboardAnalytics>("/analytics/dashboard");
    return data;
  },

  async getSummary(period: "daily" | "monthly" = "monthly") {
    const { data } = await api.get<AnalyticsSummary>("/analytics/summary", {
      params: { period },
    });
    return data;
  },
};
