"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export function AutoScoreChart({ scoreItems, totalScore }) {
  // Compute chart data efficiently
  const chartData = useMemo(() => {
    const earnedItems = scoreItems.filter((item) => item.completed);
    const earnedPoints = earnedItems.map((item) => item.points);
    const earnedLabels = earnedItems.map((item) => item.label);
    const remainingPoints = 100 - totalScore;

    return {
      labels: [...earnedLabels, "Remaining"],
      datasets: [
        {
          data: [...earnedPoints, remainingPoints > 0 ? remainingPoints : 0],
          backgroundColor: [
            "hsl(142, 76%, 36%)",
            "hsl(142, 70%, 45%)",
            "hsl(142, 65%, 50%)",
            "hsl(160, 60%, 45%)",
            "hsl(173, 58%, 39%)",
            "hsl(197, 71%, 33%)",
            "hsl(221, 83%, 53%)",
            "hsl(262, 83%, 58%)",
            "hsl(var(--muted))",
          ],
          hoverOffset: 8,
        },
      ],
    };
  }, [scoreItems, totalScore]);

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      cutout: "70%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "hsl(var(--popover))",
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ${value} points`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="relative">
      {/* Doughnut chart */}
      <Doughnut data={chartData} options={chartOptions} />

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground tabular-nums">
            {totalScore}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            out of 100
          </div>
        </div>
      </div>
    </div>
  );
}
