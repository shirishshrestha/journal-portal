import { CheckCircle2, XCircle } from "lucide-react";

export function ScoreBreakdownList({ scoreItems }) {
  return (
    <div className="space-y-2">
      {scoreItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-center gap-3">
            {item.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground/50 shrink-0" />
            )}
            <span
              className={`text-sm font-medium ${
                item.completed ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </div>
          <span
            className={`text-sm font-semibold tabular-nums ${
              item.completed
                ? "text-green-600 dark:text-green-500"
                : "text-muted-foreground"
            }`}
          >
            +{item.points}
          </span>
        </div>
      ))}
    </div>
  );
}
