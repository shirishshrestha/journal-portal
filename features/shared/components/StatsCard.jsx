/**
 * StatsCard - Global stats card component for displaying a stat value with icon and label
 * @module features/shared/components/StatsCard
 */
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.title - Label for the stat
 * @param {React.ReactNode|string|number} props.value - Value to display
 * @param {string} [props.valueClass] - Optional class for value styling
 * @param {string} [props.iconClass] - Optional class for icon styling
 * @param {string} [props.cardClass] - Optional class for card styling
 * @param {boolean} [props.isLoading] - Show loading skeleton
 */
export default function StatsCard({
  icon: Icon,
  title,
  value,
  iconClass = "text-primary",
  valueClass = "text-foreground",
  cardClass = "",
  isLoading = false,
}) {
  return (
    <Card className={`shadow-new transition-shadow ${cardClass}`}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-7 w-16" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground">
                  {title}
                </p>
                <p className={`text-2xl font-semibold ${valueClass}`}>
                  {value}
                </p>
              </>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3 flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="h-5 w-5 rounded" />
            ) : (
              Icon && <Icon className={`h-5 w-5 ${iconClass}`} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
