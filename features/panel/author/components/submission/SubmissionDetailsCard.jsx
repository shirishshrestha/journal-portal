/**
 * SubmissionDetailsCard - Displays submission details, journal info, abstract, and keywords
 * @module features/panel/author/components/submission/SubmissionDetailsCard
 */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge, statusConfig } from "@/features/shared";
import { JournalInfoCard } from "@/features/panel/reviewer";

/**
 * @param {Object} props
 * @param {Object} props.submission - Submission data
 */
export default function SubmissionDetailsCard({
  submission,
  isSubmissionPending,
}) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  // Helper to get plain text preview from HTML
  const getDescriptionPreview = (html, maxLength = 150) => {
    if (typeof window === "undefined") return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{submission?.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {submission && submission?.submitted_at
                  ? `Submitted ${format(
                      new Date(submission.submitted_at),
                      "PPP"
                    )}`
                  : "Not Submitted"}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {submission?.corresponding_author_name}
              </div>
            </div>
          </div>
          <StatusBadge
            status={submission?.status}
            statusConfig={statusConfig}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Journal Information */}
        <JournalInfoCard
          journal={submission?.journal}
          isPending={isSubmissionPending}
        />

        <Separator />

        {/* Abstract */}
        <div>
          <h3 className="font-semibold mb-2">Abstract</h3>
          <ScrollArea className="min-h-[200px] overflow-auto max-h-[500px] w-full rounded border bg-muted/30 p-4">
            <div
              dangerouslySetInnerHTML={{ __html: submission?.abstract }}
              className="text-muted-foreground whitespace-pre-wrap"
            />
          </ScrollArea>
        </div>

        {/* Keywords */}
        {submission?.metadata_json?.keywords && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {submission.metadata_json.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Description Modal */}
      <Dialog
        open={showDescriptionModal}
        onOpenChange={setShowDescriptionModal}
      >
        <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Journal Description</DialogTitle>
            <DialogDescription>{submission?.journal.title}</DialogDescription>
          </DialogHeader>
          <div
            dangerouslySetInnerHTML={{
              __html: submission?.journal.description,
            }}
            className="text-sm leading-relaxed mt-4"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
