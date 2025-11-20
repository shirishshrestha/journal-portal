"use client";

import { LineChart } from "recharts";

const data = {
  "7d": [
    { date: "Mon", users: 240 },
    { date: "Tue", users: 321 },
    { date: "Wed", users: 200 },
    { date: "Thu", users: 278 },
    { date: "Fri", users: 189 },
    { date: "Sat", users: 239 },
    { date: "Sun", users: 349 },
  ],
  "30d": Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    users: Math.floor(Math.random() * 500) + 100,
  })),
};

export function UserGrowthChart({ dateRange, isLoading, isError }) {
  return (
    <LineChart
      title="User Growth"
      data={data[dateRange]}
      lines={[{ dataKey: "users", color: "var(--primary)" }]}
      xAxisKey="date"
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No user growth data available"
      className="shadow-new"
    />
  );
}
