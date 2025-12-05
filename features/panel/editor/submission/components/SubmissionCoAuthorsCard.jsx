"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Component to display submission co-authors
 */
export function SubmissionCoAuthorsCard({ submission }) {
  if (
    !submission.author_contributions ||
    submission.author_contributions.length === 0
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Co-authors</CardTitle>
        <CardDescription>
          Authors contributing to this manuscript
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {submission.author_contributions.map((author) => (
            <div
              key={author.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {author.profile?.display_name || "Unknown Author"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {author.contrib_role_display} • Order: {author.order}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
