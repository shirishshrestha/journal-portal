'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Settings, Mail, Globe, Calendar, Users, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button as UIButton } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingScreen, useGetJournalById } from '@/features';
import ErrorCard from '@/features/shared/components/ErrorCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function JournalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const journalId = params.id;

  // Fetch journal data from backend
  const { data: journal, isPending, error } = useGetJournalById(journalId);

  // State for description dialog
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  // Helper to get plain text preview from HTML
  const getDescriptionPreview = (html, maxLength = 150) => {
    if (!html) return '';
    const div =
      typeof window !== 'undefined'
        ? document.createElement('div')
        : { innerHTML: '', textContent: '' };
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    // Split by whitespace to count words
    const words = text.split(/\s+/);
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(' ') + '...';
    }
    return text;
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <LoadingScreen />
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorCard
        title="Failed to load journal"
        description={error.message}
        onBack={() => router.push('/journal_manager/journals')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/journal_manager/journals')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{journal?.title}</h1>
              <p className="text-muted-foreground mt-1">{journal?.short_name}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push(`/journal_manager/journals/${journalId}/settings`)}>
          <Settings className="h-4 w-4 mr-2" />
          Manage Settings
        </Button>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        <Badge variant={journal?.is_active ? 'default' : 'secondary'} className="capitalize">
          {journal?.is_active ? 'Active' : 'Inactive'}
        </Badge>
        {journal?.is_accepting_submissions && (
          <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
            Accepting Submissions
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General journal details and identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Publisher</div>
              <div className="text-base">{journal?.publisher || '-'}</div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">ISSN</div>
              <div className="space-y-1">
                {journal?.issn_print && (
                  <div className="text-sm">
                    <span className="font-medium">Print:</span> {journal.issn_print}
                  </div>
                )}
                {journal?.issn_online && (
                  <div className="text-sm">
                    <span className="font-medium">Online:</span> {journal.issn_online}
                  </div>
                )}
                {!journal?.issn_print && !journal?.issn_online && <div className="text-sm">-</div>}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <div className="text-base">
                {journal?.created_at
                  ? new Date(journal.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '-'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Ways to reach the journal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <div className="text-base">
                {journal?.contact_email ? (
                  <a
                    href={`mailto:${journal.contact_email}`}
                    className="text-primary hover:underline"
                  >
                    {journal.contact_email}
                  </a>
                ) : (
                  '-'
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </div>
              <div className="text-base">
                {journal?.website_url ? (
                  <a
                    href={journal.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {journal.website_url}
                  </a>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Journal activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Staff Members
                </div>
                <div className="text-2xl font-bold">{journal?.staff_count || 0}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Submissions
                </div>
                <div className="text-2xl font-bold">{journal?.submission_count || 0}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Editor-in-Chief</div>
              <div className="text-base">
                {journal?.editor_in_chief?.name ||
                  journal?.editor_in_chief?.display_name ||
                  'Not assigned'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>About this journal</CardDescription>
          </CardHeader>
          <CardContent>
            {journal?.description ? (
              <div className="flex flex-col gap-2">
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground border-l-2 border-primary/30 italic pl-4">
                  {getDescriptionPreview(journal.description, 150)}
                </div>
                <UIButton
                  variant="link"
                  size="sm"
                  onClick={() => setShowDescriptionModal(true)}
                  className="self-start pl-4"
                >
                  View More
                </UIButton>
                <Dialog open={showDescriptionModal} onOpenChange={setShowDescriptionModal}>
                  <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Journal Description</DialogTitle>
                      <DialogDescription>{journal?.title}</DialogDescription>
                    </DialogHeader>
                    <div
                      dangerouslySetInnerHTML={{ __html: journal?.description }}
                      className="text-sm leading-relaxed mt-4"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <p className="text-muted-foreground">No description available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
