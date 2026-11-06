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

interface BestSellersChartProps {
  data: Array<{ name: string; units: number }>;
}

export function BestSellersChart({ data }: BestSellersChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke="#e5e5e5" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={112}
            tick={{ fontSize: 11, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [
              `${formatNumber(Number(value))} units`,
              "Sold",
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
