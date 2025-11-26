"use client";

import { useSystemHealth } from "../hooks/useSystemHealth";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const SystemHealth = () => {
  const { data, isPending, isError, refetch, isFetching } = useSystemHealth();

  const getStatusColor = (status) => {
    if (!status) return "text-muted-foreground";

    const statusLower = status.toLowerCase();
    if (statusLower === "healthy" || statusLower === "ok") {
      return "text-green-500";
    } else if (statusLower === "degraded" || statusLower === "warning") {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return Activity;

    const statusLower = status.toLowerCase();
    if (statusLower === "healthy" || statusLower === "ok") {
      return CheckCircle2;
    } else if (statusLower === "degraded" || statusLower === "warning") {
      return AlertCircle;
    } else {
      return AlertCircle;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking system health...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 text-sm text-red-500">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>System health unavailable</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-transparent hover:text-foreground"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", isFetching ? "animate-spin" : "")}
          />
        </Button>
      </div>
    );
  }

  const status = data?.status || "Unknown";
  const StatusIcon = getStatusIcon(status);
  const statusColor = getStatusColor(status);

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">System Health:</span>
        <div
          className={cn("flex items-center gap-1.5 font-medium", statusColor)}
        >
          <StatusIcon className="h-4 w-4" />
          <span>{status}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 hover:bg-transparent hover:text-foreground"
        onClick={handleRefresh}
        disabled={isFetching}
        title="Refresh system health"
      >
        <RefreshCw
          className={cn("h-3.5 w-3.5", isFetching ? "animate-spin" : "")}
        />
      </Button>
    </div>
  );
};
