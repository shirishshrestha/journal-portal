import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { ScoreBreakdownList } from "./score/ScoreBreakDownList";
import { AutoScoreChart } from "./score/AutoScoreChart";
import { useEffect, useState } from "react";

export function ScoreCard({
  scoreItems,
  completionPercentage,
  completedItems,
}) {
  const totalScore = scoreItems.reduce(
    (sum, item) => sum + (item.completed ? item.points : 0),
    0
  );

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(completionPercentage);
    }, 100);
    return () => clearTimeout(timeout);
  }, [completionPercentage]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Auto-Score</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete tasks to unlock premium features
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-primary tabular-nums">
              {totalScore}/100
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {completedItems} of {scoreItems.length} completed
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
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
          <div className="order-2 md:order-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Score Breakdown
            </h3>
            <ScoreBreakdownList scoreItems={scoreItems} />
          </div>

          <div className="order-1 md:order-2 flex items-center justify-center">
            <div className="w-full max-w-[280px]">
              <AutoScoreChart scoreItems={scoreItems} totalScore={totalScore} />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
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
