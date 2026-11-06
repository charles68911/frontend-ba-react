import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { MonthlySalesPoint } from "@/types";

interface MonthlySalesChartProps {
  data: MonthlySalesPoint[];
}

export function MonthlySalesChart({ data }: MonthlySalesChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            labelFormatter={(label) => `Month: ${String(label)}`}
            contentStyle={{
              borderRadius: 6,
              border: "1px solid #e5e5e5",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="sales"
            fill="#111111"
            radius={[6, 6, 0, 0]}
            barSize={34}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
