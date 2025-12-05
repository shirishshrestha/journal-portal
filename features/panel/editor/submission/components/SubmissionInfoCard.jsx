"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { StatusBadge, statusConfig } from "@/features";

/**
 * Component to display submission basic information
 */
export function SubmissionInfoCard({ submission }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-2xl">{submission.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Submitted {format(new Date(submission.submitted_at), "PPP")}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {submission.corresponding_author_name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge
              status={submission.status}
              statusConfig={statusConfig}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <h3 className="font-semibold mb-2">Submission Number</h3>
          <p className="text-muted-foreground">
            {submission.submission_number}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Journal</h3>
          <p className="text-muted-foreground">{submission.journal.title}</p>
        </div>

        {/* Abstract */}
        <div className="col-span-2">
          <h3 className="font-semibold mb-2">Abstract</h3>
          <ScrollArea className="min-h-[200px] max-h-[500px] overflow-y-auto w-full rounded border bg-muted/30 p-4">
            <div
              dangerouslySetInnerHTML={{ __html: submission?.abstract }}
              className="text-muted-foreground whitespace-pre-wrap"
            />
          </ScrollArea>
        </div>

        {submission.metadata_json?.keywords && (
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
        )}
      </CardContent>
    </Card>
  );
}
