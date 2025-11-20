"use client";

import { DoughnutChart } from "@/features/shared";
import { useMemo } from "react";

export function AutoScoreChart({
  scoreBreakdown,
  totalScore,
  isLoading,
  isError,
}) {
  // Compute chart data efficiently
  const chartData = useMemo(() => {
    if (!scoreBreakdown || scoreBreakdown.length === 0) {
      return [{ name: "No Data", value: 100 }];
    }

    const completedItems = scoreBreakdown.filter(
      (item) => item.status === "completed"
    );
    const maxPossibleScore = scoreBreakdown.reduce(
      (sum, item) => sum + item.points_possible,
      0
    );
    const remainingPoints = maxPossibleScore - totalScore;

    const data = completedItems.map((item) => ({
      name: item.criterion,
      value: item.points_earned,
    }));

    if (remainingPoints > 0) {
      data.push({ name: "Remaining", value: remainingPoints });
    }

    return data;
  }, [scoreBreakdown, totalScore]);

  const maxPossibleScore = useMemo(() => {
    if (!scoreBreakdown || scoreBreakdown.length === 0) return 100;
    return scoreBreakdown.reduce((sum, item) => sum + item.points_possible, 0);
  }, [scoreBreakdown]);

  // Color palette
  const COLORS = [
    "hsl(142, 76%, 36%)",
    "hsl(142, 70%, 45%)",
    "hsl(142, 65%, 50%)",
    "hsl(160, 60%, 45%)",
    "hsl(173, 58%, 39%)",
    "hsl(197, 71%, 33%)",
    "hsl(221, 83%, 53%)",
  ];

  // Center label component
  const centerContent = (
    <div className="text-center">
      <div className="text-4xl font-bold text-foreground tabular-nums">
        {totalScore}
      </div>
      <div className="text-sm text-muted-foreground font-medium">
        out of {maxPossibleScore}
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[300px]">
      <DoughnutChart
        title=""
        data={chartData}
        colors={COLORS}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No score data available"
        innerRadius={65}
        outerRadius={90}
        labelFormatter={false}
        showLegend={false}
        height={300}
        centerContent={centerContent}
        className="border-0 shadow-none"
      />
    </div>
  );
}
