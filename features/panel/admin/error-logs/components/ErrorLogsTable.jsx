"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Eye,
  MapPin,
  Hash,
  Users,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/features/shared";

export function ErrorLogsTable({ issues, onViewDetails, isPending, error }) {
  const getLevelIcon = (level) => {
    const icons = {
      error: <AlertCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      fatal: <XCircle className="h-4 w-4" />,
    };
    return icons[level] || <AlertCircle className="h-4 w-4" />;
  };

  const getLevelColor = (level) => {
    const colors = {
      error: "destructive",
      warning: "warning",
      info: "default",
      fatal: "destructive",
    };
    return colors[level] || "default";
  };

  const columns = [
    {
      key: "level",
      header: "Level",
      render: (row) => (
        <Badge variant={getLevelColor(row.level)} className="gap-1">
          {getLevelIcon(row.level)}
          {row.level?.toUpperCase() || "UNKNOWN"}
        </Badge>
      ),
    },
    {
      key: "title",
      header: "Error",
      render: (row) => (
        <div className="space-y-2 py-1">
          {row.title && row.title.length > 40 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="font-medium truncate cursor-help">
                    {row.title.slice(0, 40) + "..."}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-md">
                  <p>{row.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="font-medium">{row.title || "Unknown Error"}</div>
          )}
          {row.culprit && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {row.culprit.length > 40 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <code className="bg-muted px-2 py-0.5 rounded truncate cursor-help max-w-xs block">
                        {row.culprit.slice(0, 40) + "..."}
                      </code>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-md">
                      <code>{row.culprit}</code>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <code className="bg-muted px-2 py-0.5 rounded">
                  {row.culprit}
                </code>
              )}
            </div>
          )}
          {row.metadata?.value &&
            (row.metadata.value.length > 40 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground line-clamp-1 cursor-help">
                      {row.metadata.value.slice(0, 40) + "..."}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-md">
                    <p>{row.metadata.value}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {row.metadata.value}
              </p>
            ))}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.metadata?.type || row.short_id || "Unknown"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "resolved" ? "default" : "secondary"}>
          {row.status || "unknown"}
        </Badge>
      ),
    },
    {
      key: "stats",
      header: "Statistics",
      render: (row) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Hash className="h-3 w-3" />
            <strong>{row.count || 0}</strong> events
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <strong>
              {row.user_count === "***REDACTED***"
                ? "N/A"
                : row.user_count || 0}
            </strong>{" "}
            users
          </div>
        </div>
      ),
    },
    {
      key: "lastSeen",
      header: "Last Seen",
      render: (row) => {
        try {
          const date = new Date(row.last_seen);
          if (isNaN(date.getTime())) {
            return (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                Unknown
              </div>
            );
          }
          return (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(date, "PPp")}
            </div>
          );
        } catch (err) {
          return (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              Invalid date
            </div>
          );
        }
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row)}
          className=""
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={issues}
      columns={columns}
      emptyMessage="No error logs found"
      isPending={isPending}
      error={error}
      errorMessage="Error loading error logs"
      hoverable={true}
      tableClassName="bg-card border"
    />
  );
}
