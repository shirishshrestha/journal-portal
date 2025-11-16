"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

export function SubmissionStatusChart({ data }) {
  const chartData = [
    { name: "Pending", value: data?.pending || 0 },
    { name: "Accepted", value: data?.accepted || 0 },
    { name: "Rejected", value: data?.rejected || 0 },
    { name: "Under Review", value: data?.under_review || 0 },
  ];

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-3)",
    "var(--chart-2)",
    "var(--chart-4)",
  ];

  return (
    <Card className="shadow-new">
      <CardHeader>
        <CardTitle>Submission Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            />
            <Legend />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Submission Status">
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
