"use client";

import { useState } from "react";
import { useAnomalyDetectionScan } from "../hooks/useAnomalyDetectionScan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Shield,
  Users,
  FileText,
  Eye,
  RefreshCw,
  BarChart,
  Info,
} from "lucide-react";
import { format } from "date-fns";

export function AnomalyDetectionDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { data, isPending, error, refetch, isFetching } =
    useAnomalyDetectionScan(true);

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

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>
            Failed to load anomaly detection data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || "An error occurred"}
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anomaly Detection</h1>
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Anomalies</CardDescription>
            <CardTitle className="text-3xl">{data?.total_count || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Detected issues requiring attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>High Severity</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {data?.severity_counts?.HIGH || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Critical security risks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Medium Severity</CardDescription>
            <CardTitle className="text-3xl text-amber-600">
              {data?.severity_counts?.MEDIUM || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Suspicious patterns detected
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Anomalies</CardTitle>
          <CardDescription>
            Review and investigate suspicious activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                All ({data?.total_count || 0})
              </TabsTrigger>
              <TabsTrigger value="authors">
                Authors ({data?.author_anomalies?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="reviewers">
                Reviewers ({data?.reviewer_anomalies?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="rings">
                Review Rings ({data?.review_ring_anomalies?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {data?.total_count === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p>No anomalies detected. System is healthy!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Author Anomalies */}
                  {data?.author_anomalies?.map((anomaly, index) => (
                    <AnomalyCard
                      key={`author-${index}`}
                      anomaly={anomaly}
                      type="author"
                      getSeverityColor={getSeverityColor}
                      getSeverityIcon={getSeverityIcon}
                    />
                  ))}

                  {/* Reviewer Anomalies */}
                  {data?.reviewer_anomalies?.map((anomaly, index) => (
                    <AnomalyCard
                      key={`reviewer-${index}`}
                      anomaly={anomaly}
                      type="reviewer"
                      getSeverityColor={getSeverityColor}
                      getSeverityIcon={getSeverityIcon}
                    />
                  ))}

                  {/* Review Ring Anomalies */}
                  {data?.review_ring_anomalies?.map((anomaly, index) => (
                    <AnomalyCard
                      key={`ring-${index}`}
                      anomaly={anomaly}
                      type="ring"
                      getSeverityColor={getSeverityColor}
                      getSeverityIcon={getSeverityIcon}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="authors" className="space-y-4 mt-4">
              {data?.author_anomalies?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>No author anomalies detected</p>
                </div>
              ) : (
                data?.author_anomalies?.map((anomaly, index) => (
                  <AnomalyCard
                    key={index}
                    anomaly={anomaly}
                    type="author"
                    getSeverityColor={getSeverityColor}
                    getSeverityIcon={getSeverityIcon}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="reviewers" className="space-y-4 mt-4">
              {data?.reviewer_anomalies?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>No reviewer anomalies detected</p>
                </div>
              ) : (
                data?.reviewer_anomalies?.map((anomaly, index) => (
                  <AnomalyCard
                    key={index}
                    anomaly={anomaly}
                    type="reviewer"
                    getSeverityColor={getSeverityColor}
                    getSeverityIcon={getSeverityIcon}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="rings" className="space-y-4 mt-4">
              {data?.review_ring_anomalies?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4" />
                  <p>No review rings detected</p>
                </div>
              ) : (
                data?.review_ring_anomalies?.map((anomaly, index) => (
                  <AnomalyCard
                    key={index}
                    anomaly={anomaly}
                    type="ring"
                    getSeverityColor={getSeverityColor}
                    getSeverityIcon={getSeverityIcon}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function AnomalyCard({ anomaly, type, getSeverityColor, getSeverityIcon }) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      className="border-l-4"
      style={{
        borderLeftColor:
          anomaly.severity === "HIGH"
            ? "#ef4444"
            : anomaly.severity === "MEDIUM"
            ? "#f59e0b"
            : "#6b7280",
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {anomaly.type?.replace(/_/g, " ")}
              </CardTitle>
              <Badge variant={getSeverityColor(anomaly.severity)}>
                <span className="flex items-center gap-1">
                  {getSeverityIcon(anomaly.severity)}
                  {anomaly.severity}
                </span>
              </Badge>
            </div>
            <CardDescription>{anomaly.description}</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getSeverityIcon(anomaly.severity)}
                  {anomaly.type?.replace(/_/g, " ")}
                </DialogTitle>
                <DialogDescription>
                  Complete details about this detected anomaly
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-4 pr-4">
                  {/* Severity and Description */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Severity:</span>
                      <Badge variant={getSeverityColor(anomaly.severity)}>
                        <span className="flex items-center gap-1">
                          {getSeverityIcon(anomaly.severity)}
                          {anomaly.severity}
                        </span>
                      </Badge>
                    </div>
                    <div>
                      <span className="font-semibold">Description:</span>
                      <p className="mt-1 text-muted-foreground">
                        {anomaly.description}
                      </p>
                    </div>
                  </div>

                  {/* Involved Parties */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Involved Parties</h4>
                    <div className="space-y-2">
                      {anomaly.reviewer && (
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <span className="text-sm text-muted-foreground">
                              Reviewer:
                            </span>
                            <p className="font-medium">{anomaly.reviewer}</p>
                            {anomaly.reviewer_id && (
                              <p className="text-xs text-muted-foreground mt-1">
                                ID: {anomaly.reviewer_id}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {anomaly.user_email && (
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <span className="text-sm text-muted-foreground">
                              User:
                            </span>
                            <p className="font-medium">{anomaly.user_email}</p>
                            {anomaly.user_id && (
                              <p className="text-xs text-muted-foreground mt-1">
                                ID: {anomaly.user_id}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Fallback for author anomalies: show author from submission info if no user_email/reviewer */}
                      {!anomaly.user_email &&
                        !anomaly.reviewer &&
                        anomaly.submission_title && (
                          <div className="flex items-start gap-2">
                            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <span className="text-sm text-muted-foreground">
                                Author (from submission):
                              </span>
                              <p className="font-medium">
                                {anomaly.submission_title}
                              </p>
                              {anomaly.submission_id && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Submission ID: {anomaly.submission_id}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Submission Details */}
                  {(anomaly.submission_title ||
                    anomaly.similar_submission_title) && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Submission Details</h4>
                      <div className="space-y-3">
                        {anomaly.submission_title && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <span className="text-sm text-muted-foreground">
                                Submission:
                              </span>
                              <p className="font-medium">
                                {anomaly.submission_title}
                              </p>
                              {anomaly.submission_id && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  ID: {anomaly.submission_id}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {anomaly.similar_submission_title && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <span className="text-sm text-muted-foreground">
                                Similar Submission:
                              </span>
                              <p className="font-medium">
                                {anomaly.similar_submission_title}
                              </p>
                              {anomaly.similar_submission_id && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  ID: {anomaly.similar_submission_id}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  {(anomaly.similarity_score !== undefined ||
                    anomaly.hours_taken !== undefined ||
                    anomaly.accept_rate !== undefined ||
                    anomaly.total_reviews !== undefined ||
                    anomaly.review_id) && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Metrics & Data</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {anomaly.similarity_score !== undefined && (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <BarChart className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Similarity Score
                              </p>
                              <p className="font-semibold">
                                {(anomaly.similarity_score * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        )}
                        {anomaly.hours_taken !== undefined && (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Time Taken
                              </p>
                              <p className="font-semibold">
                                {anomaly.hours_taken.toFixed(2)} hours
                              </p>
                            </div>
                          </div>
                        )}
                        {anomaly.accept_rate !== undefined && (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <BarChart className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Accept Rate
                              </p>
                              <p className="font-semibold">
                                {(anomaly.accept_rate * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        )}
                        {anomaly.total_reviews !== undefined && (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Total Reviews
                              </p>
                              <p className="font-semibold">
                                {anomaly.total_reviews}
                              </p>
                            </div>
                          </div>
                        )}
                        {anomaly.review_id && (
                          <div className="flex items-start gap-2 p-3 bg-muted rounded-md sm:col-span-2">
                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">
                                Review ID
                              </p>
                              <p className="font-mono text-xs break-all">
                                {anomaly.review_id}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {anomaly.recommendation && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Recommendation</h4>
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-900">
                        <Shield className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                        <p className="text-sm text-foreground">
                          {anomaly.recommendation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Raw Data */}
                  {/* <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Raw Data</h4>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(anomaly, null, 2)}
                      </pre>
                    </div>
                  </div> */}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Reviewer Information */}
          {anomaly.reviewer && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Reviewer:</span>
              <span className="font-medium">{anomaly.reviewer}</span>
            </div>
          )}

          {/* User Email */}
          {anomaly.user_email && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">User:</span>
              <span className="font-medium">{anomaly.user_email}</span>
            </div>
          )}

          {/* Submission Information */}
          {anomaly.submission_title && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Submission:</span>
              <span className="font-medium">{anomaly.submission_title}</span>
            </div>
          )}

          {/* Similar Submission (for duplicate content) */}
          {anomaly.similar_submission_title && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Similar to:</span>
              <span className="font-medium">
                {anomaly.similar_submission_title}
              </span>
            </div>
          )}

          {/* Similarity Score */}
          {anomaly.similarity_score !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Similarity:</span>
              <span className="font-medium">
                {(anomaly.similarity_score * 100).toFixed(1)}%
              </span>
            </div>
          )}

          {/* Hours Taken (for rushed reviews) */}
          {anomaly.hours_taken !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time Taken:</span>
              <span className="font-medium">
                {anomaly.hours_taken.toFixed(2)} hours
              </span>
            </div>
          )}

          {/* Accept Rate (for biased reviewers) */}
          {anomaly.accept_rate !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Accept Rate:</span>
              <span className="font-medium">
                {(anomaly.accept_rate * 100).toFixed(1)}%
              </span>
            </div>
          )}

          {/* Total Reviews */}
          {anomaly.total_reviews !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total Reviews:</span>
              <span className="font-medium">{anomaly.total_reviews}</span>
            </div>
          )}

          {/* Recommendation */}
          {anomaly.recommendation && (
            <div className="mt-3 p-3 bg-muted rounded-md">
              <div className="flex items-start gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground font-medium">
                    Recommendation:
                  </span>
                  <p className="mt-1 text-foreground">
                    {anomaly.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
