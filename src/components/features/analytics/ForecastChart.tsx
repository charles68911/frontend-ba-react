import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { ForecastPoint } from "@/components/features/analytics/analyticsUtils";

interface ForecastChartProps {
  data: ForecastPoint[];
}

export function ForecastChart({ data }: ForecastChartProps) {
  const lastActualLabel = [...data]
    .reverse()
    .find((point) => point.actual !== null)?.label;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
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
            minTickGap={30}
          />
          <YAxis
            width={62}
            tick={{ fontSize: 11, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === "actual" ? "Actual sales" : "Forecast",
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
              value === "actual" ? "Actual sales" : "Forecast"
            }
          />
          {lastActualLabel && (
            <ReferenceLine
              x={lastActualLabel}
              stroke="#a3a3a3"
              strokeDasharray="3 3"
              label={{
                value: "Today",
                position: "insideTopRight",
                fill: "#525252",
                fontSize: 11,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#111111"
            strokeWidth={2.5}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#111111"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
