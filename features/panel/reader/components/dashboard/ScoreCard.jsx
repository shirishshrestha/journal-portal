"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { ScoreBreakdownList } from "./score/ScoreBreakDownList";
import { AutoScoreChart } from "./score/AutoScoreChart";
import { useEffect, useState } from "react";

export function ScoreCard({ scoreData, pending }) {
  // Hooks must always be called
  const totalScore = scoreData?.latest_request?.auto_score || 0;
  const scoreBreakdown = scoreData?.latest_request?.score_breakdown || [];
  const maxPossibleScore = scoreBreakdown.reduce(
    (sum, item) => sum + item.points_possible,
    0
  );
  const completedItems = scoreBreakdown.filter(
    (item) => item.status === "completed"
  ).length;
  const completionPercentage =
    scoreBreakdown.length > 0
      ? (completedItems / scoreBreakdown.length) * 100
      : 0;

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(completionPercentage);
    }, 100);
    return () => clearTimeout(timeout);
  }, [completionPercentage]);

  if (pending) {
    return (
      <Card className="w-full animate-pulse opacity-80">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="h-6 w-32 bg-muted rounded mb-2" />
              <div className="h-4 w-40 bg-muted rounded" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
              <div className="h-8 w-16 bg-muted rounded" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-10 bg-muted rounded" />
            </div>
            <div className="w-full bg-primary/20 rounded-full h-2 overflow-hidden">
              <div className="bg-primary/40 h-2 rounded-full w-1/3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
            <div className="order-2 lg:order-1">
              <div className="h-5 w-32 bg-muted rounded mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            </div>
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div className="w-full max-w-[280px] h-32 bg-muted rounded" />
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="h-4 w-3/4 bg-muted rounded mb-2" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Auto-Score</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete tasks to unlock premium features
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-2xl font-semibold text-primary tabular-nums">
              {totalScore}/{maxPossibleScore}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {completedItems} of {scoreBreakdown.length} completed
            </span>
            <span className="font-medium text-foreground">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <div className="w-full bg-primary/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary dark:bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${width}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
          <div className="order-2 lg:order-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Score Breakdown
            </h3>
            <ScoreBreakdownList scoreBreakdown={scoreBreakdown} />
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="w-full max-w-[280px]">
              <AutoScoreChart
                scoreBreakdown={scoreBreakdown}
                totalScore={totalScore}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border relative">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">How it works:</span>{" "}
            Your auto-score is calculated based on profile completeness and
            research credential verification. Higher scores unlock advanced
            features and improve your visibility to research opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
