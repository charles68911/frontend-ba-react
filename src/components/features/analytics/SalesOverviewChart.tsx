import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { DailySalesPoint } from "@/types";

interface SalesOverviewChartProps {
  data: DailySalesPoint[];
}

export function SalesOverviewChart({ data }: SalesOverviewChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e5e5"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={26}
          />
          <YAxis
            width={62}
            tick={{ fontSize: 11, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Sales"]}
            labelFormatter={(label) => `Date: ${String(label)}`}
            contentStyle={{
              borderRadius: 6,
              border: "1px solid #e5e5e5",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#111111"
            strokeWidth={2}
            fill="#111111"
            fillOpacity={0.06}
            activeDot={{ r: 4, fill: "#111111", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
