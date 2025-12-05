"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Building2, BookOpen } from "lucide-react";
import { JournalInfoCard } from "./JournalInfoCard";

export function SubmissionDetailsTab({ submission, isPending }) {
  if (!submission) return null;

  return (
    <div className="space-y-4">
      {/* Journal Information */}
      {submission.journal && (
        <Card>
          <CardContent>
            <JournalInfoCard
              journal={submission.journal}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Manuscript Information */}
      <Card className="">
        <CardContent className=" px-6 ">
          <div className="flex items-center gap-3 mb-5">
            <div className=" rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Submission Information</h3>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-foreground/80">
                    Title:
                  </h3>
                </div>
                <p className="text-foreground font-medium pl-6">
                  {submission.title}
                </p>
              </div>
              <Separator className="bg-primary/10" />
              {/* Submission Number */}
              <div className="flex items-start gap-2">
                <div>
                  <h3 className="font-semibold text-sm text-foreground/80 mb-1">
                    Submission Number:
                  </h3>
                  <code className="text-xs bg-white dark:bg-slate-950 px-2.5 py-1 rounded border shadow-sm font-medium">
                    {submission.submission_number}
                  </code>
                </div>
              </div>
            </div>

            <Separator className="bg-primary/10" />

            {/* Abstract */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Abstract
              </h3>
              <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded-lg border border-border bg-white/50 dark:bg-black/20 p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: submission.abstract }}
                  className="text-foreground/80 whitespace-pre-wrap leading-relaxed"
                />
              </ScrollArea>
            </div>

            {/* Keywords */}
            {submission.metadata_json?.keywords &&
              submission.metadata_json.keywords.length > 0 && (
                <>
                  <Separator className="bg-primary/10" />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {submission.metadata_json.keywords.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="shadow-sm"
                          >
                            {keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

            <Separator className="bg-primary/10" />

            {/* Corresponding Author */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Corresponding Author
              </h3>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border">
                <p className="font-semibold text-foreground mb-2">
                  {submission.corresponding_author?.display_name ||
                    submission.corresponding_author?.user_name ||
                    "N/A"}
                </p>
                {submission.corresponding_author?.user_email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <a
                      href={`mailto:${submission.corresponding_author.user_email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {submission.corresponding_author.user_email}
                    </a>
                  </p>
                )}
                {submission.corresponding_author?.affiliation_name && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                    <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    {submission.corresponding_author.affiliation_name}
                  </p>
                )}
              </div>
            </div>

            {/* Co-Authors */}
            {submission.author_contributions &&
              submission.author_contributions.length > 0 && (
                <>
                  <Separator className="bg-primary/10" />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      Co-Authors
                      <Badge variant="secondary" className="ml-1">
                        {submission.author_contributions.length}
                      </Badge>
                    </h3>
                    <div className="space-y-2">
                      {submission.author_contributions.map((author, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg flex items-center gap-3 bg-white/50 dark:bg-black/20 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {author.profile?.display_name || "Unknown Author"}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {author.contrib_role_display}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Order: {author.order}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
