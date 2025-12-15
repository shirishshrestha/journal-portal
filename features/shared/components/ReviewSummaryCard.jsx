"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DecisionBadge, reviewRecommendationConfig } from "@/features";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

/**
 * ReviewSummaryCard Component
 *
 * Displays a summary of review(s) with quality scores, detailed review text, and confidential comments.
 *
 * @param {Array} reviews - Array of review objects (displays only the first/latest review)
 * @param {boolean} showViewFullReview - Whether to show the "View Full Review" button (default: false)
 * @param {Function} onViewFullReview - Callback function when "View Full Review" is clicked
 * @param {boolean} showConfidentialComments - Whether to show confidential comments section (default: false)
 * @param {string} title - Custom title for the card (default: "Reviews Summary")
 */
export function ReviewSummaryCard({
  reviews = [],
  showViewFullReview = false,
  onViewFullReview,
  showConfidentialComments = false,
  title = "Reviews Summary",
  cardPadding = true,
}) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const review = reviews[0]; // Always show the first/latest review

  return (
    <Card className={`gap-4 border-none ${cardPadding ? "" : "p-0"}`}>
      <CardHeader className={`gap-0 ${cardPadding ? "" : "p-0"}`}>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className={`${cardPadding ? "" : "p-0"}`}>
        <div className="p-4 border rounded-lg space-y-3">
          {/* Review Header */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">Review 1 (Latest)</h4>
              <p className="text-sm text-muted-foreground">
                Submitted on{" "}
                {new Date(
                  review.submitted_at || review.created_at
                ).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <DecisionBadge
                decisionType={review.recommendation}
                config={reviewRecommendationConfig}
                className="mb-1"
              />
              <p className="text-xs text-muted-foreground">
                Confidence: {review.confidence_level}/5
              </p>
            </div>
          </div>

          <div className="border-t my-2" />

          {/* Quality Assessment Scores */}
          {review.scores && (
            <>
              <div>
                <h5 className="text-sm font-semibold mb-2">
                  Quality Assessment
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Novelty</p>
                    <p className="text-lg font-semibold">
                      {review.scores.novelty}/10
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Methodology</p>
                    <p className="text-lg font-semibold">
                      {review.scores.methodology}/10
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Clarity</p>
                    <p className="text-lg font-semibold">
                      {review.scores.clarity}/10
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">
                      Significance
                    </p>
                    <p className="text-lg font-semibold">
                      {review.scores.significance}/10
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Originality</p>
                    <p className="text-lg font-semibold">
                      {review.scores.originality}/10
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t my-2" />
            </>
          )}

          {/* Detailed Review Text */}
          <div>
            <h5 className="text-sm font-semibold mb-2">Detailed Review</h5>
            <ScrollArea className="min-h-[200px] max-h-[500px] overflow-auto w-full rounded border bg-muted/30 p-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: review.review_text,
                }}
                className="text-muted-foreground whitespace-pre-wrap"
              />
            </ScrollArea>
          </div>

          {/* Confidential Comments (only if showConfidentialComments is true) */}
          {showConfidentialComments && review.confidential_comments && (
            <>
              <div className="border-t my-2" />
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <h5 className="text-sm font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
                  Confidential Comments (For Editor Only)
                </h5>
                <ScrollArea className="min-h-[200px] overflow-auto max-h-[500px] w-full rounded border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 p-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: review.confidential_comments,
                    }}
                    className="text-muted-foreground whitespace-pre-wrap"
                  />
                </ScrollArea>
              </div>
            </>
          )}

          {/* View Full Review Button (only if showViewFullReview is true) */}
          {showViewFullReview && onViewFullReview && (
            <>
              <div className="border-t my-2" />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewFullReview(review.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Review
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
