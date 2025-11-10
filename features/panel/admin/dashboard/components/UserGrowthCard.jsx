"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

export function UserGrowthChart({ dateRange }) {
  return (
    <Card className={"shadow-new"}>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data[dateRange]}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="var(--primary)"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
