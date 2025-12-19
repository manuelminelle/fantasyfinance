import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { NetWorthPoint } from "../../types/engine";
import { formatCurrency } from "../../utils/format";

type NetWorthChartProps = {
  data: NetWorthPoint[];
};

export default function NetWorthChart({ data }: NetWorthChartProps) {
  const chartData = data.map((point) => ({ week: `W${point.week}`, value: point.value }));
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="netWorth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-accent))" stopOpacity={0.45} />
              <stop offset="100%" stopColor="rgb(var(--color-accent-2))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: "rgb(var(--color-muted))", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "rgb(var(--color-muted))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(17, 25, 40, 0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              color: "white",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            formatter={(value) => [
              formatCurrency(typeof value === "number" ? value : 0),
              "Valore netto",
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(var(--color-accent))"
            strokeWidth={2}
            fill="url(#netWorth)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
