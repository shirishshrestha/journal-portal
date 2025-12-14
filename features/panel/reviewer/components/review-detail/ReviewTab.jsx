"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { ReviewSubmissionForm } from "../ReviewSubmissionForm";

export function ReviewTab({ assignment }) {
  if (!assignment) return null;

  const canReview =
    assignment?.submission_details?.status === "UNDER_REVIEW" ||
    assignment?.submission_details?.status === "REVISED";

  if (!canReview) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Review Already Submitted
            </h3>
            <p className="text-muted-foreground">
              You have already submitted your review for this manuscript
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <ReviewSubmissionForm assignment={assignment} />;
}
