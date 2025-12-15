"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Mail,
  Building2,
  Briefcase,
  Users,
  Award,
  FileText,
  Lightbulb,
  Info,
  BookOpen,
} from "lucide-react";
import InfoItem from "@/features/panel/admin/verification-requests/components/InfoItem";

const statusColors = {
  PENDING:
    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
  APPROVED: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  REJECTED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
  INFO_REQUESTED:
    "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
};

export function EditorVerificationDetailsModal({
  verification,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  isLoading = false,
}) {
  if (!verification) return null;

  // Helper to render score details
  const renderScoreDetails = (scoreDetails) => {
    if (!scoreDetails || Object.keys(scoreDetails).length === 0) {
      return (
        <p className="text-xs text-muted-foreground mt-2">
          No score breakdown available
        </p>
      );
    }

    return (
      <div className="mt-3 space-y-2">
        {Object.entries(scoreDetails).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between py-1.5 px-2 bg-muted/50 rounded"
          >
            <span className="text-xs font-medium capitalize text-muted-foreground">
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-sm ">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-4 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold">
                {verification.profile_name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-3.5 w-3.5" />
                {verification.profile_email}
              </DialogDescription>
            </div>
            <Badge
              className={`text-xs ${statusColors[verification.status]} mr-4`}
            >
              {verification.status}
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        <div className="px-3">
          <div className="space-y-5 ">
            {/* Journal Information */}
            {verification.journal_name && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Journal
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {verification.journal_name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardContent className=" grid grid-cols-2 gap-6">
                <InfoItem
                  icon={Building2}
                  label="Affiliation"
                  value={verification.affiliation}
                />
                <InfoItem
                  icon={Mail}
                  label="Affiliation Email"
                  value={verification.affiliation_email}
                />
                <InfoItem
                  icon={Briefcase}
                  label="Academic Position"
                  value={verification.academic_position}
                />
                <InfoItem
                  icon={Users}
                  label="Requested Roles"
                  value={verification.requested_roles?.join(", ")}
                />
              </CardContent>
            </Card>

            {/* ORCID Card */}
            <Card>
              <CardContent className=" space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    ORCID Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
                    <span className="text-sm font-medium">Verified</span>
                    <Badge
                      variant={
                        verification.orcid_verified ? "default" : "outline"
                      }
                    >
                      {verification.orcid_verified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
                    <span className="text-sm font-medium">ORCID ID</span>
                    <span className="font-mono text-sm">
                      {verification.orcid_id || (
                        <span className="text-muted-foreground italic">
                          N/A
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research & Score Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Auto Score Card */}
              <Card>
                <CardContent className="">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Auto Score
                      </h3>
                    </div>
                    <div className="text-xl font-semibold">
                      {verification.auto_score}
                    </div>
                  </div>
                  {renderScoreDetails(verification.score_details)}
                </CardContent>
              </Card>

              {/* Research Interests */}
              <Card>
                <CardContent className="">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Research Interests
                    </h3>
                  </div>
                  <ScrollArea className="max-h-32 overflow-auto w-full rounded border bg-muted/30 p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {verification.research_interests}
                    </p>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Supporting Letter */}
            <Card>
              <CardContent className="">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Supporting Letter
                  </h3>
                </div>
                <ScrollArea className="min-h-80 max-h-[500px] overflow-auto w-full rounded border bg-muted/30 p-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: verification.supporting_letter,
                    }}
                  />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card className={"p-3!"}>
              <CardContent className="px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Created At
                  </label>
                  <p className="text-sm font-mono">
                    {new Date(verification.created_at).toLocaleString()}
                  </p>
                </div>
                {verification.reviewed_at && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Reviewed At
                    </label>
                    <p className="text-sm font-mono">
                      {new Date(verification.reviewed_at).toLocaleString()}
                    </p>
                  </div>
                )}
                {verification.reviewed_by_email && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Reviewed By
                    </label>
                    <p className="text-sm font-mono">
                      {verification.reviewed_by_email}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rejection Reason (if rejected) */}
            {verification.rejection_reason && (
              <Card className="border-red-200 dark:border-red-800 py-4 bg-red-50 dark:bg-red-950/30">
                <CardContent className="px-4 ">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <h3 className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
                      Rejection Reason
                    </h3>
                  </div>
                  <p className="text-sm text-red-900 dark:text-red-100 leading-relaxed">
                    {verification.rejection_reason}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Admin Notes (if present) */}
            {verification.admin_notes && (
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
                <CardContent className="">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                      Admin Notes
                    </h3>
                  </div>
                  <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                    {verification.admin_notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="px-6 pb-4">
          {verification.status === "PENDING" && (
            <div className="flex gap-3 justify-end">
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={isLoading}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                variant=""
                onClick={onRequestInfo}
                disabled={isLoading}
                className="gap-2"
              >
                <Info className="h-4 w-4" />
                Request Info
              </Button>
              <Button
                variant="default"
                onClick={onApprove}
                disabled={isLoading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isLoading ? "Processing..." : "Approve"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
