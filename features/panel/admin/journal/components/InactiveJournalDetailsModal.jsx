"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function InactiveJournalDetailsModal({
  journal,
  isOpen,
  onClose,
  onActivate,
  isActivating,
}) {
  if (!journal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{journal.title}</DialogTitle>
          <DialogDescription>{journal.short_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Banner */}
          <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Inactive Journal
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This journal is currently inactive and not visible to users.
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Publisher
                </p>
                <p className="text-sm font-medium">
                  {journal.publisher || "-"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Submissions
                </p>
                <p className="text-2xl font-bold text-primary">
                  {journal.submission_count || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  ISSN Print
                </p>
                <p className="text-sm font-mono">{journal.issn_print || "-"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  ISSN Online
                </p>
                <p className="text-sm font-mono">
                  {journal.issn_online || "-"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Editor-in-Chief */}
          {journal.editor_in_chief && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Editor-in-Chief
                </p>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {journal.editor_in_chief.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {journal.editor_in_chief.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Staff Members */}
          {journal.staff_members && journal.staff_members.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Staff Members ({journal.staff_members.length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {journal.staff_members.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {staff.email}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {staff.role.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {journal.description && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {journal.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            {journal.contact_email && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Contact Email
                  </p>
                  <p className="text-sm">{journal.contact_email}</p>
                </CardContent>
              </Card>
            )}

            {journal.website_url && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Website
                  </p>
                  <a
                    href={journal.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Metadata */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Created
                  </p>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(journal.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {journal.is_accepting_submissions
                        ? "Accepting Submissions"
                        : "Not Accepting"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isActivating}>
            Close
          </Button>
          <Button
            onClick={() => onActivate(journal)}
            disabled={isActivating}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {isActivating ? "Activating..." : "Activate Journal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
