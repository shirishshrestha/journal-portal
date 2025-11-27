"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import {
  ActivityLogsTable,
  ActivityLogDetailsModal,
  ActivityLogFilters,
  useActivityLogs,
} from "@/features/panel/admin/activity-logs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingScreen } from "@/features";

export default function ActivityLogsPage() {
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      page,
      page_size: 10,
      ordering: "-created_at",
    };

    if (actionFilter !== "all") {
      params.action_type = actionFilter;
    }

    if (resourceFilter !== "all") {
      params.resource_type = resourceFilter;
    }

    if (actorFilter !== "all") {
      params.actor_type = actorFilter;
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    return params;
  }, [actionFilter, resourceFilter, actorFilter, searchQuery, page]);

  // Fetch activity logs
  const {
    data: logsData,
    isLoading,
    error,
    refetch,
  } = useActivityLogs(queryParams);

  const logs = useMemo(() => logsData?.results || [], [logsData]);

  const handleViewDetail = (log) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleFilterChange = () => {
    // Reset to page 1 when filters change
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {isLoading && <LoadingScreen />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">
            Monitor all system events and user activities
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Error loading activity logs"}. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <ActivityLogFilters
        actionFilter={actionFilter}
        resourceFilter={resourceFilter}
        actorFilter={actorFilter}
        searchQuery={searchQuery}
        onActionChange={(value) => {
          setActionFilter(value);
          handleFilterChange();
        }}
        onResourceChange={(value) => {
          setResourceFilter(value);
          handleFilterChange();
        }}
        onActorChange={(value) => {
          setActorFilter(value);
          handleFilterChange();
        }}
        onSearchChange={(value) => {
          setSearchQuery(value);
          handleFilterChange();
        }}
      />

      {/* Activity Logs Table */}
      <ActivityLogsTable
        logs={logs}
        onViewDetails={handleViewDetail}
        isPending={isLoading}
        error={error}
      />

      {/* Pagination Info */}
      {logsData && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {logs.length} of {logsData.count} total logs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!logsData.previous || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!logsData.next || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      <ActivityLogDetailsModal
        log={selectedLog}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
