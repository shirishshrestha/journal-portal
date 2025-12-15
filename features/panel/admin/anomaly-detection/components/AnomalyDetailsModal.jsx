"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Shield,
  Users,
  FileText,
  Eye,
  BarChart,
} from "lucide-react";

export function AnomalyDetailsModal({
  anomaly,
  isOpen,
  onClose,
  getSeverityColor,
  getSeverityIcon,
}) {
  if (!anomaly) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[50%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSeverityIcon(anomaly.severity)}
            {anomaly.type?.replace(/_/g, " ")}
          </DialogTitle>
          <DialogDescription>
            Complete details about this detected anomaly
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] overflow-auto">
          <div className="space-y-4 pr-4">
            {/* Severity and Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Severity:</span>
                <Badge
                  variant={getSeverityColor(anomaly.severity)}
                  className={` ${
                    anomaly.severity === "MEDIUM" &&
                    "text-yellow-700 dark:text-primary-foreground bg-yellow-100 dark:bg-yellow-600"
                  }`}
                >
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
            {(anomaly.reviewer || anomaly.user_email) && (
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
                </div>
              </div>
            )}

            {/* Submission Details */}
            {(anomaly.submission_title || anomaly.similar_submission_title) && (
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
                        <p className="font-semibold">{anomaly.total_reviews}</p>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
