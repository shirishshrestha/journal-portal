"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ErrorLogsTable,
  ErrorDetailsModal,
} from "@/features/panel/admin/error-logs";
import {
  useSentryProjects,
  useSentryIssues,
} from "@/features/panel/admin/error-logs/hooks/useSentry";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingScreen, FilterToolbar } from "@/features";
import { useSearchParams, useRouter } from "next/navigation";

export default function ErrorLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL
  const statusFilter = searchParams.get("status") || "unresolved";
  const levelFilter = searchParams.get("level") || "all";
  const projectSlug = searchParams.get("project") || null;

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch projects
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useSentryProjects();

  // Auto-select first project if none in params
  useEffect(() => {
    if (projectsData?.results?.length > 0 && !projectSlug) {
      const firstSlug = projectsData.results[0].slug;
      const params = new URLSearchParams(searchParams.toString());
      params.set("project", firstSlug);
      router.replace(`?${params.toString()}`);
    }
  }, [projectsData?.results, projectSlug, searchParams, router]);

  // Fetch issues for selected project
  const {
    data: issuesData,
    isLoading: issuesLoading,
    error: issuesError,
    refetch: refetchIssues,
  } = useSentryIssues(projectSlug, {
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 100,
  });

  const issues = useMemo(() => issuesData?.results || [], [issuesData]);

  // Filter issues by level (client-side filtering)
  const filteredIssues = useMemo(() => {
    if (levelFilter === "all") return issues;
    return issues.filter((issue) => issue.level === levelFilter);
  }, [issues, levelFilter]);

  const handleViewDetail = (issue) => {
    setSelectedIssue(issue);
    setIsDetailOpen(true);
  };

  const handleRefresh = () => {
    if (projectSlug) {
      refetchIssues();
    }
    refetchProjects();
  };

  const handleProjectChange = (slug) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", slug);
    router.push(`?${params.toString()}`);
  };

  const isLoading = projectsLoading || issuesLoading;
  const error = projectsError || issuesError;

  return (
    <div className="space-y-6">
      {/* Header */}
      {isLoading && <LoadingScreen />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Error Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage application errors in real-time via Sentry
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

      {/* Project Selector */}
      {projectsData?.results?.length > 0 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Project:</label>
          <Select
            value={projectSlug || undefined}
            onValueChange={handleProjectChange}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projectsData.results.map((project) => (
                <SelectItem key={project.id} value={project.slug}>
                  {project.name} ({project.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please check your Sentry configuration and ensure the API
            credentials are correct.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading state for projects */}
      {projectsLoading && (
        <Alert>
          <AlertDescription>Loading Sentry projects...</AlertDescription>
        </Alert>
      )}

      {/* No projects found */}
      {!projectsLoading && projectsData?.results?.length === 0 && (
        <Alert>
          <AlertDescription>
            No Sentry projects found. Please check your Sentry organization
            configuration.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      {projectSlug && (
        <FilterToolbar>
          <FilterToolbar.Select
            paramName="status"
            label="Status"
            options={[
              { value: "all", label: "All Status" },
              { value: "unresolved", label: "Unresolved" },
              { value: "resolved", label: "Resolved" },
              { value: "ignored", label: "Ignored" },
            ]}
          />
          <FilterToolbar.Select
            paramName="level"
            label="Level"
            options={[
              { value: "all", label: "All Levels" },
              { value: "fatal", label: "Fatal" },
              { value: "error", label: "Error" },
              { value: "warning", label: "Warning" },
              { value: "info", label: "Info" },
            ]}
          />
        </FilterToolbar>
      )}

      {/* Error Logs Table */}
      {projectSlug && (
        <ErrorLogsTable
          issues={filteredIssues}
          onViewDetails={handleViewDetail}
          isPending={issuesLoading}
          error={issuesError}
        />
      )}

      {/* Issue Detail Modal */}
      <ErrorDetailsModal
        issue={selectedIssue}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
