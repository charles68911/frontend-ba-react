import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/format";
import type { RestockRecommendation } from "@/types";

interface RestockChartProps {
  recommendations: RestockRecommendation[];
}

export function RestockChart({ recommendations }: RestockChartProps) {
  const chartData = recommendations.slice(0, 8).map((item) => ({
    name: item.product.name,
    current: item.product.stock,
    afterRestock: item.product.stock + item.suggestedQuantity,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
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
            formatter={(value, name) => [
              `${formatNumber(Number(value))} units`,
              name === "current" ? "Current stock" : "After restock",
            ]}
            contentStyle={{
              borderRadius: 6,
              border: "1px solid #e5e5e5",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) =>
              value === "current" ? "Current stock" : "After restock"
            }
          />
          <Bar
            dataKey="current"
            fill="#d4d4d4"
            radius={[0, 4, 4, 0]}
            barSize={12}
          />
          <Bar
            dataKey="afterRestock"
            fill="#111111"
            radius={[0, 4, 4, 0]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
