"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import {
  ActivityLogsTable,
  ActivityLogDetailsModal,
  useActivityLogs,
} from "@/features/panel/admin/activity-logs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingScreen, FilterToolbar, Pagination } from "@/features";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ActivityLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const searchParam = searchParams.get("search");
  const actionType = searchParams.get("action_type");
  const resourceType = searchParams.get("resource_type");
  const actorType = searchParams.get("actor_type");

  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Build query parameters from URL
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: 10,
      ordering: "-created_at",
    };

    if (actionType && actionType !== "all") {
      params.action_type = actionType;
    }

    if (resourceType && resourceType !== "all") {
      params.resource_type = resourceType;
    }

    if (actorType && actorType !== "all") {
      params.actor_type = actorType;
    }

    if (searchParam?.trim()) {
      params.search = searchParam.trim();
    }

    return params;
  }, [actionType, resourceType, actorType, searchParam, currentPage]);

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

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
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
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          placeholder="Search activity logs..."
          label="Search"
        />
        <FilterToolbar.Select
          paramName="action_type"
          label="Action"
          options={[
            { value: "all", label: "All Actions" },
            { value: "CREATE", label: "Create" },
            { value: "READ", label: "Read" },
            { value: "UPDATE", label: "Update" },
            { value: "DELETE", label: "Delete" },
            { value: "LOGIN", label: "Login" },
            { value: "LOGOUT", label: "Logout" },
            { value: "SUBMIT", label: "Submit" },
            { value: "REVIEW", label: "Review" },
            { value: "APPROVE", label: "Approve" },
            { value: "REJECT", label: "Reject" },
            { value: "PUBLISH", label: "Publish" },
            { value: "WITHDRAW", label: "Withdraw" },
          ]}
        />
        <FilterToolbar.Select
          paramName="resource_type"
          label="Resource"
          options={[
            { value: "all", label: "All Resources" },
            { value: "USER", label: "User" },
            { value: "PROFILE", label: "Profile" },
            { value: "SUBMISSION", label: "Submission" },
            { value: "DOCUMENT", label: "Document" },
            { value: "REVIEW", label: "Review" },
            { value: "JOURNAL", label: "Journal" },
            { value: "PLAGIARISM_REPORT", label: "Plagiarism Report" },
            { value: "FORMAT_CHECK", label: "Format Check" },
          ]}
        />
        <FilterToolbar.Select
          paramName="actor_type"
          label="Actor"
          options={[
            { value: "all", label: "All Actors" },
            { value: "USER", label: "User" },
            { value: "SYSTEM", label: "System" },
            { value: "API", label: "API" },
            { value: "INTEGRATION", label: "Integration" },
          ]}
        />
      </FilterToolbar>

      {/* Activity Logs Table */}
      <ActivityLogsTable
        logs={logs}
        onViewDetails={handleViewDetail}
        isPending={isLoading}
        error={error}
      />

      {/* Pagination */}
      {logsData && logsData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(logsData.count / 10)}
          totalCount={logsData.count}
          pageSize={10}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
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
