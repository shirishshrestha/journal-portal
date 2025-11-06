import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export function ScoreBreakdownList({ scoreBreakdown }) {
  if (!scoreBreakdown || scoreBreakdown.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No score breakdown available
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 shrink-0" />
        );
      case "missing":
        return (
          <XCircle className="h-5 w-5 text-muted-foreground/50 shrink-0" />
        );
      case "partial":
        return (
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
        );
      default:
        return (
          <XCircle className="h-5 w-5 text-muted-foreground/50 shrink-0" />
        );
    }
  };

  const getWeightColor = (weight) => {
    switch (weight) {
      case "highest":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-blue-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="space-y-2">
      {scoreBreakdown.map((item, index) => (
        <div
          key={item.criterion || index}
          className={`flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors border-l-2 ${getWeightColor(
            item.weight
          )}`}
        >
          <div className="flex items-start gap-3 flex-1">
            {getStatusIcon(item.status)}
            <div className="flex-1">
              <div
                className={`text-sm font-medium ${
                  item.status === "completed"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.criterion}
              </div>
              {item.description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </div>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`text-sm font-semibold tabular-nums ${
                item.status === "completed"
                  ? "text-green-600 dark:text-green-500"
                  : "text-muted-foreground"
              }`}
            >
              {item.points_earned}/{item.points_possible}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
