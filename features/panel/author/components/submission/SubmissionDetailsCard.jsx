/**
 * SubmissionDetailsCard - Displays submission details, journal info, abstract, and keywords
 * @module features/panel/author/components/submission/SubmissionDetailsCard
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";

/**
 * @param {Object} props
 * @param {Object} props.submission - Submission data
 */
export default function SubmissionDetailsCard({ submission }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{submission?.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {submission?.submitted_at
                  ? `Submitted ${format(
                      new Date(submission.submitted_at),
                      "PPP"
                    )}`
                  : `Created ${format(new Date(submission.created_at), "PPP")}`}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {submission?.corresponding_author_name}
              </div>
            </div>
          </div>
          <Badge variant="secondary">{submission?.status_display}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Journal Information */}
        <div className="rounded-lg border bg-linear-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Journal Information</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Title:
              </span>
              <span className="text-foreground font-medium">
                {submission?.journal.title}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Short Name:
              </span>
              <Badge variant="secondary" className="font-medium">
                {submission?.journal.short_name}
              </Badge>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Publisher:
              </span>
              <span className="text-muted-foreground">
                {submission?.journal.publisher}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Submission Count:
              </span>
              <Badge variant="outline" className="font-medium">
                {submission?.journal.submission_count}
              </Badge>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                ISSN (Print):
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {submission?.journal.issn_print}
              </code>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                ISSN (Online):
              </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {submission?.journal.issn_online}
              </code>
            </div>

            {submission?.journal.website_url && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground/80 min-w-[140px]">
                  Website:
                </span>
                <a
                  href={submission.journal.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {submission.journal.website_url}
                </a>
              </div>
            )}

            {submission?.journal.contact_email && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground/80 min-w-[140px]">
                  Contact Email:
                </span>
                <a
                  href={`mailto:${submission.journal.contact_email}`}
                  className="text-primary hover:underline"
                >
                  {submission.journal.contact_email}
                </a>
              </div>
            )}

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Status:
              </span>
              <Badge
                variant={
                  submission?.journal.is_active ? "default" : "secondary"
                }
                className="gap-1"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    submission?.journal.is_active
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                {submission?.journal.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Submissions:
              </span>
              <Badge
                variant={
                  submission?.journal.is_accepting_submissions
                    ? "default"
                    : "secondary"
                }
                className="gap-1"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    submission?.journal.is_accepting_submissions
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                {submission?.journal.is_accepting_submissions
                  ? "Accepting"
                  : "Not Accepting"}
              </Badge>
            </div>

            <div className="flex items-start gap-2 ">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Editor in Chief:
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">
                  {submission?.journal.editor_in_chief?.name}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-medium text-foreground/80 min-w-[140px]">
                Created:
              </span>
              <span className="text-muted-foreground">
                {submission?.journal.created_at
                  ? format(new Date(submission.journal.created_at), "PPP")
                  : "N/A"}
              </span>
            </div>
          </div>

          {submission?.journal.description && (
            <div className="mt-5 pt-5 border-t">
              <span className="font-medium text-foreground/80 block mb-2">
                Description:
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed pl-4 border-l-2 border-primary/30 italic">
                {submission.journal.description}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Abstract */}
        <div>
          <h3 className="font-semibold mb-2">Abstract</h3>
          <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded border bg-muted/30 p-4">
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
    </Card>
  );
}
