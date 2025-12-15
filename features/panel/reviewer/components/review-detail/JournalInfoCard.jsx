"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { useCurrentRole } from "@/features/shared";
import { Skeleton } from "@/components/ui/skeleton";

export function JournalInfoCard({ journal, isPending = false }) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const { currentRole } = useCurrentRole();

  if (isPending) {
    return (
      <>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Skeleton className="h-5 w-5" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          {[...Array(10)].map((_, i) => (
            <div
              className="flex flex-col sm:flex-row items-start gap-2"
              key={i}
            >
              <Skeleton className="min-w-[140px] h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-24 mt-2" />
        </div>
      </>
    );
  }

  // Helper to get plain text preview from HTML
  const getDescriptionPreview = (html, maxLength = 150) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Journal Information</h3>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div className="flex flex-col sm:flex-row items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            Title:
          </span>
          <span className="text-foreground font-medium">{journal.title}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            Short Name:
          </span>
          <Badge variant="secondary" className="font-medium">
            {journal.short_name}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            Publisher:
          </span>
          <span className="text-muted-foreground">
            {journal.publisher || "N/A"}
          </span>
        </div>

        {currentRole !== "AUTHOR" && (
          <div className="flex  items-start gap-2">
            <span className="font-medium text-foreground/80 min-w-[140px]">
              Submission Count:
            </span>
            <Badge variant="outline" className="font-medium">
              {journal.submission_count}
            </Badge>
          </div>
        )}

        <div className="flex  items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            ISSN (Print):
          </span>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {journal.issn_print || "N/A"}
          </code>
        </div>

        <div className="flex  items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            ISSN (Online):
          </span>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {journal.issn_online || "N/A"}
          </code>
        </div>

        {journal.website_url && (
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <span className="font-medium text-foreground/80 min-w-[140px]">
              Website:
            </span>
            <a
              href={journal.website_url || "N/A"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              {journal.website_url || "N/A"}
            </a>
          </div>
        )}

        {journal.contact_email && (
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <span className="font-medium text-foreground/80 min-w-[140px]">
              Contact Email:
            </span>
            <a
              href={`mailto:${journal.contact_email || "N/A"}`}
              className="text-primary hover:underline"
            >
              {journal.contact_email || "N/A"}
            </a>
          </div>
        )}

        <div className="flex items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            Status:
          </span>
          <Badge
            variant={journal.is_active ? "default" : "secondary"}
            className="gap-1"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                journal.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
            {journal.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            Submissions:
          </span>
          <Badge
            variant={journal.is_accepting_submissions ? "default" : "secondary"}
            className="gap-1"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                journal.is_accepting_submissions
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            ></span>
            {journal.is_accepting_submissions ? "Accepting" : "Not Accepting"}
          </Badge>
        </div>

        {journal.editor_in_chief && (
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <span className="font-medium text-foreground/80 min-w-[140px]">
              Editor in Chief:
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground">
                {journal.editor_in_chief.name}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2">
          <span className="font-medium text-foreground/80 min-w-[140px]">
            Created:
          </span>
          <span className="text-muted-foreground">
            {journal.created_at
              ? format(new Date(journal.created_at), "PPP")
              : "N/A"}
          </span>
        </div>
      </div>
      {journal.description && (
        <div className="mt-5 pt-5 border-t">
          <span className="font-medium text-foreground/80 block mb-2">
            Description:
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm leading-relaxed pl-4 border-l-2 border-primary/30 italic">
              {getDescriptionPreview(journal.description)}
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowDescriptionModal(true)}
              className="self-start pl-4"
            >
              View More
            </Button>
          </div>
        </div>
      )}
      {/* Description Modal */}
      <Dialog
        open={showDescriptionModal}
        onOpenChange={setShowDescriptionModal}
      >
        <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Journal Description</DialogTitle>
            <DialogDescription>{journal.title}</DialogDescription>
          </DialogHeader>
          <div
            dangerouslySetInnerHTML={{ __html: journal.description }}
            className="text-sm leading-relaxed mt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
