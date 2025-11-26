/**
 * ReviewerRecommendationsCard - Displays AI-powered reviewer recommendations
 * @module features/panel/author/components/submission/ReviewerRecommendationsCard
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Star, Mail, Building2 } from "lucide-react";

/**
 * @param {Object} props
 * @param {Object} props.recommendations - Recommendations data
 * @param {boolean} props.isLoading - Loading state
 * @param {Object} props.error - Error object
 * @param {string} props.reviewType - Review type (OPEN, SINGLE_BLIND, DOUBLE_BLIND)
 */
export default function ReviewerRecommendationsCard({
  recommendations,
  isLoading,
  error,
  reviewType,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recommended Reviewers</CardTitle>
            <CardDescription>
              AI-powered reviewer recommendations based on expertise
            </CardDescription>
          </div>
          {reviewType === "OPEN" && isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviewType === "SINGLE_BLIND" ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Single-Blind Review Process</h3>
            <p className="text-sm text-muted-foreground">
              Reviewer identities are kept confidential from authors during the
              review process. Reviewer recommendations are not displayed to
              maintain the integrity of the blind review.
            </p>
          </div>
        ) : reviewType === "DOUBLE_BLIND" ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Double-Blind Review Process</h3>
            <p className="text-sm text-muted-foreground">
              Both reviewer and author identities are kept confidential during
              the review process. Reviewer recommendations are not displayed to
              maintain the integrity of the blind review.
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              Failed to load reviewer recommendations
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Analyzing submission and finding suitable reviewers...
            </p>
          </div>
        ) : !recommendations?.recommendations ||
          recommendations.recommendations.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No recommendations available</h3>
            <p className="text-sm text-muted-foreground">
              The system couldn&apos;t find suitable reviewer recommendations
              for this submission
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.recommendations
              .slice(0, 5)
              .map((reviewer, index) => {
                const compositeScore = reviewer.scores?.composite;
                const similarityScore = reviewer.scores?.similarity;
                const scorePercent = compositeScore
                  ? (compositeScore * 100).toFixed(1)
                  : null;

                return (
                  <div
                    key={reviewer.reviewer_id || index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">
                            {reviewer.reviewer_name || "Unknown Reviewer"}
                          </h4>
                          {scorePercent && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              {scorePercent}% Match
                            </Badge>
                          )}
                        </div>

                        {reviewer.reviewer_email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {reviewer.reviewer_email}
                          </div>
                        )}

                        {reviewer.affiliation && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            {reviewer.affiliation}
                          </div>
                        )}

                        {/* Score Details */}
                        {reviewer.scores && (
                          <div className="flex flex-wrap gap-3 mt-2 text-xs">
                            {similarityScore != null && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <span className="font-medium">Expertise:</span>
                                <span>
                                  {(similarityScore * 100).toFixed(0)}%
                                </span>
                              </div>
                            )}
                            {reviewer.scores.availability != null && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <span className="font-medium">
                                  Availability:
                                </span>
                                <span>
                                  {(reviewer.scores.availability * 100).toFixed(
                                    0
                                  )}
                                  %
                                </span>
                              </div>
                            )}
                            {reviewer.scores.quality != null && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <span className="font-medium">Quality:</span>
                                <span>
                                  {(reviewer.scores.quality * 100).toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {reviewer.expertise_areas &&
                          reviewer.expertise_areas.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {reviewer.expertise_areas.map((area, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          )}

                        {reviewer.recommendation_reason && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">
                              Why recommended:
                            </span>{" "}
                            {reviewer.recommendation_reason}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">
                          Rank #{index + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
