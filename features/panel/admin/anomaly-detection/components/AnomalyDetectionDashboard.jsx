"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAnomalyDetectionScan } from "../hooks/useAnomalyDetectionScan";
import { DataTable, FilterToolbar, Pagination } from "@/features/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users, Eye, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { AnomalySummaryCards } from "./AnomalySummaryCards";
import { AnomalyDetailsModal } from "./AnomalyDetailsModal";
import EllipsisTooltip from "@/components/ui/EllipsisTooltip";

export const AnamolyDetectionDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const typeParam = searchParams.get("type") || "all";
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const pageSize = 10;

  // Build params for API
  const params = useMemo(() => {
    const p = {
      page: currentPage,
      page_size: pageSize,
    };
    if (searchParam) p.search = searchParam;
    if (typeParam && typeParam !== "all") p.type = typeParam;
    return p;
  }, [currentPage, pageSize, searchParam, typeParam]);

  const { data, isPending, error, refetch, isFetching } =
    useAnomalyDetectionScan(params, true);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "default";
      case "LOW":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "HIGH":
        return <AlertTriangle className="h-4 w-4" />;
      case "MEDIUM":
        return <Shield className="h-4 w-4" />;
      case "LOW":
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // State for selected anomaly modal
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table columns - only essential data
  const columns = [
    {
      key: "type",
      header: "Type",
      cellClassName: "font-medium",
      render: (row) => (
        <div className="max-w-[150px] truncate">
          {row.type?.replace(/_/g, " ")}
        </div>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (row) => (
        <Badge
          variant={getSeverityColor(row.severity)}
          className={`text-xs ${
            row.severity === "HIGH" ? "animate-pulse" : ""
          } ${
            row.severity === "MEDIUM" &&
            "text-yellow-700 dark:text-primary-foreground bg-yellow-100 dark:bg-yellow-600"
          }`}
        >
          <span className="flex items-center gap-1">
            {getSeverityIcon(row.severity)}
            {row.severity}
          </span>
        </Badge>
      ),
      align: "center",
    },
    {
      key: "description",
      header: "Description",
      cellClassName: "text-muted-foreground",
      render: (row) => <EllipsisTooltip text={row.description || "-"} />,
    },
    {
      key: "affected_user",
      header: "Affected User",
      render: (row) => (
        <div className="text-sm">
          {row.reviewer || row.user_email || (
            <span className="text-muted-foreground italic">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "submission",
      header: "Submission",
      render: (row) => <EllipsisTooltip text={row.submission_title || "-"} />,
    },
    {
      key: "metric",
      header: "Key Metric",
      align: "center",
      render: (row) => {
        if (row.similarity_score !== undefined) {
          return (
            <Badge variant="outline" className="text-xs">
              {(row.similarity_score * 100).toFixed(1)}% similar
            </Badge>
          );
        }
        if (row.hours_taken !== undefined) {
          return (
            <Badge variant="outline" className="text-xs">
              {row.hours_taken.toFixed(2)}h
            </Badge>
          );
        }
        if (row.accept_rate !== undefined) {
          return (
            <Badge variant="outline" className="text-xs">
              {(row.accept_rate * 100).toFixed(0)}% accept
            </Badge>
          );
        }
        if (row.total_reviews !== undefined) {
          return (
            <Badge variant="outline" className="text-xs">
              {row.total_reviews} reviews
            </Badge>
          );
        }
        return <span className="text-muted-foreground text-xs">-</span>;
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
          className="gap-2"
          onClick={() => {
            setSelectedAnomaly(row);
            setIsModalOpen(true);
          }}
        >
          <Eye className="h-4 w-4" />
          Details
        </Button>
      ),
    },
  ];

  // Flatten all anomalies for table
  const anomalies = useMemo(() => {
    if (!data) return [];
    let arr = [];
    if (typeParam === "all" || !typeParam) {
      arr = [
        ...(data.author_anomalies || []),
        ...(data.reviewer_anomalies || []),
        ...(data.review_ring_anomalies || []),
      ];
    } else if (typeParam === "authors") {
      arr = data.author_anomalies || [];
    } else if (typeParam === "reviewers") {
      arr = data.reviewer_anomalies || [];
    } else if (typeParam === "rings") {
      arr = data.review_ring_anomalies || [];
    }
    return arr;
  }, [data, typeParam]);

  // Handle filter changes
  const handleFilterChange = (param, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(param, value);
    if (param !== "page") params.set("page", "1"); // Reset page on filter/search
    router.push(`?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (page) => {
    handleFilterChange("page", page.toString());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Anomaly Detection</h1>
          <p className="text-muted-foreground">
            {data?.scan_completed_at &&
              `Last scan: ${format(new Date(data.scan_completed_at), "PPp")}`}
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Scanning..." : "Refresh Scan"}
        </Button>
      </div>

      {/* Summary Cards */}
      <AnomalySummaryCards
        anomalySummary={{
          high_severity_count: data?.severity_counts?.HIGH || 0,
          medium_severity_count: data?.severity_counts?.MEDIUM || 0,
          low_severity_count: data?.severity_counts?.LOW || 0,
        }}
      />

      {/* Filters */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          label="Search"
          placeholder="Search anomalies..."
          value={searchParam || ""}
          onChange={(val) => handleFilterChange("search", val)}
        />
        <FilterToolbar.Select
          paramName="type"
          label="Type"
          value={typeParam}
          onChange={(val) => handleFilterChange("type", val)}
          options={[
            { value: "all", label: "All Types" },
            { value: "authors", label: "Authors" },
            { value: "reviewers", label: "Reviewers" },
            { value: "rings", label: "Review Rings" },
          ]}
        />
      </FilterToolbar>

      {/* DataTable */}
      <DataTable
        data={anomalies}
        columns={columns}
        isPending={isPending}
        error={error}
        emptyMessage="No anomalies found"
        tableClassName="bg-card border"
        hoverable={true}
      />

      {/* Pagination */}
      {data && data.total_count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.total_count / pageSize)}
          totalCount={data.total_count}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
      )}

      {/* Anomaly Details Modal */}
      <AnomalyDetailsModal
        anomaly={selectedAnomaly}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getSeverityColor={getSeverityColor}
        getSeverityIcon={getSeverityIcon}
      />
    </div>
  );
};
