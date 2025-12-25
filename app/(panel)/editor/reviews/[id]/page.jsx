'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Eye,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingScreen, ErrorCard, DecisionBadge } from '@/features/shared';
import { reviewRecommendationConfig } from '@/features';
import { useGetReviewById } from '@/features/panel/editor/submission/hooks/useGetReviewById';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params?.id;

  const { data: review, isLoading, error } = useGetReviewById(reviewId);

  if (isLoading) {
    return <LoadingScreen message="Loading review details..." />;
  }

  if (error) {
    return (
      <ErrorCard
        title="Failed to load review"
        description={error?.message || 'Review not found'}
        onBack={() => router.back()}
      />
    );
  }

  if (!review) {
    return (
      <ErrorCard
        title="Review not found"
        description={'No review data was returned from the server.'}
        onBack={() => router.back()}
      />
    );
  }

  // Helper function to get recommendation icon
  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'ACCEPT':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'REJECT':
        return <XCircle className="h-4 w-4" />;
      case 'MINOR_REVISION':
      case 'MAJOR_REVISION':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Review Details</h1>
          <p className="text-muted-foreground">Detailed review submitted by the reviewer</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/editor/submissions/${review.submission}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Submission
        </Button>
      </div>

      {/* Review Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Review Overview</CardTitle>
              <CardDescription>
                Submitted on {format(new Date(review.submitted_at), "PPP 'at' p")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getRecommendationIcon(review.recommendation)}
              <DecisionBadge
                decisionType={review.recommendation}
                config={reviewRecommendationConfig}
                displayLabel={review.recommendation_display}
                className="text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Submission Info */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Submission</p>
              <p className="font-medium">{review.submission_title || 'N/A'}</p>
            </div>

            {/* Reviewer Info (if not anonymous) */}
            {!review.is_anonymous && review.reviewer_info && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reviewer</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {review.reviewer_info.full_name ||
                      review.reviewer_info.display_name ||
                      'Anonymous'}
                  </p>
                </div>
              </div>
            )}

            {review.is_anonymous && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reviewer</p>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-muted-foreground">Anonymous Review</p>
                </div>
              </div>
            )}

            {/* Review Round */}
            {review.review_round && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Review Round</p>
                <Badge variant="outline">Round {review.review_round}</Badge>
              </div>
            )}

            {/* Confidence Level */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Confidence Level</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full mr-1 ${
                        i < review.confidence_level ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {review.confidence_level}/5 - {review.confidence_display || 'N/A'}
                </span>
              </div>
            </div>

            {/* Review Time */}
            {review.review_time_days !== undefined && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Review Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{review.review_time_days} days</p>
                </div>
              </div>
            )}

            {/* Due Date */}
            {review.due_date && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{format(new Date(review.due_date), 'PPP')}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quality Scores Card */}
      {review.scores && Object.keys(review.scores).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Assessment Scores</CardTitle>
            <CardDescription>
              Reviewer&apos;s assessment of various quality criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(review.scores).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground capitalize mb-2">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-2xl font-semibold">
                    {typeof value === 'number' ? value.toFixed(1) : value}/10
                  </p>
                </div>
              ))}
            </div>
            {review.overall_score !== undefined && (
              <>
                <Separator className="my-4" />
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                  <p className="text-3xl font-semibold text-primary">
                    {review.overall_score.toFixed(1)}/10
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Review Card */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Review Comments</CardTitle>
          <CardDescription>Reviewer&apos;s detailed feedback for the authors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ScrollArea className="min-h-[200px] overflow-auto max-h-[500px] w-full rounded border bg-muted/30 p-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: review.review_text,
                }}
                className="text-muted-foreground whitespace-pre-wrap"
              />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Confidential Comments Card */}
      {review.confidential_comments && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <CardTitle className="text-yellow-900 dark:text-yellow-100">
                Confidential Comments
              </CardTitle>
            </div>
            <CardDescription className="text-yellow-800 dark:text-yellow-200">
              These comments are only visible to editors and not shared with authors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 overflow-auto p-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: review.confidential_comments,
                  }}
                  className="text-muted-foreground whitespace-pre-wrap"
                />
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto Summary (if available) */}
      {review.auto_summary && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Summary</CardTitle>
            <CardDescription>Automated summary of the review (for quick reference)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-muted-foreground italic">
                {review.auto_summary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attached Files (if any) */}
      {review.attached_files && review.attached_files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attached Files</CardTitle>
            <CardDescription>Additional files provided by the reviewer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {review.attached_files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {file.original_filename || `Attachment ${index + 1}`}
                      </p>
                      {file.file_size && (
                        <p className="text-xs text-muted-foreground">
                          {(file.file_size / 1024).toFixed(2)} KB
                        </p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle>Review Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Review ID</p>
              <p className="font-mono text-xs mt-1">{review.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Assignment ID</p>
              <p className="font-mono text-xs mt-1">{review.assignment_id || review.assignment}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Assigned At</p>
              <p className="font-medium mt-1">
                {review.assigned_at ? format(new Date(review.assigned_at), 'PPP') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Submitted At</p>
              <p className="font-medium mt-1">
                {format(new Date(review.submitted_at), "PPP 'at' p")}
              </p>
            </div>
            {review.quality_score !== undefined && review.quality_score !== null && (
              <div>
                <p className="text-muted-foreground">Quality Score</p>
                <p className="font-medium mt-1">{review.quality_score.toFixed(2)}/10</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Published Status</p>
              <Badge variant={review.is_published ? 'default' : 'secondary'} className="mt-1">
                {review.is_published ? 'Published' : 'Not Published'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
