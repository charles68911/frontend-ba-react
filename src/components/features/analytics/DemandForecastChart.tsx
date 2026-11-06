import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/format";
import type { DemandForecast } from "@/types";

interface DemandForecastChartProps {
  data: DemandForecast[];
}

export function DemandForecastChart({ data }: DemandForecastChartProps) {
  const chartData = data.slice(0, 8).map((item) => ({
    name: item.productName,
    units: item.forecast30Days,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke="#e5e5e5" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={116}
            tick={{ fontSize: 11, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [
              `${formatNumber(Number(value))} units`,
              "Forecast demand (30d)",
            ]}
            contentStyle={{
              borderRadius: 6,
              border: "1px solid #e5e5e5",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="units"
            fill="#111111"
            radius={[0, 5, 5, 0]}
            barSize={16}
            background={{ fill: "#f5f5f5", radius: 5 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
