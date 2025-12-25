'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  LoadingScreen,
  CopyeditingSuperDocEditor,
  useGetMe,
} from '@/features';
import { useApproveCopyeditingFile } from '@/features/panel/editor/submission/hooks';
import { toast } from 'sonner';

/**
 * Editor Copyediting File Editor Page
 * Uses CopyeditingSuperDocEditor for editing copyediting files
 * Route: /editor/submissions/[id]/copyediting/edit/[fileId]
 */
export default function CopyeditingEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const submissionId = params?.id;
  const fileId = params?.fileId;

  const { data: user, isPending: isUserPending } = useGetMe();

  // Get readOnly from URL query parameter (defaults to true for safety)
  const isReadOnly = searchParams?.get('readOnly') !== 'false';

  // Editor uses approve endpoint
  const approveMutation = useApproveCopyeditingFile();

  const handleBack = () => {
    router.push(`/editor/submissions/${submissionId}/copyediting`);
  };

  const handleApprove = async (fileId) => {
    return new Promise((resolve, reject) => {
      approveMutation.mutate(fileId, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          const message =
            error?.response?.data?.detail || error?.message || 'Failed to approve file';
          toast.error(message);
          reject(error);
        },
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {isUserPending && <LoadingScreen />}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={handleBack} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Copyediting Workflow
        </Button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Copyediting File</h1>
        </div>
      </div>

      <Card className="flex flex-col">
        <CardContent className="overflow-hidden">
          {/* CopyeditingSuperDocEditor */}
          <CopyeditingSuperDocEditor
            fileId={fileId}
            userData={{
              first_name: user?.first_name,
              email: user?.email,
            }}
            readOnly={isReadOnly}
            commentsReadOnly={false}
            className="border rounded-lg"
            goBack={`/editor/submissions/${submissionId}/copyediting`}
            onApprove={handleApprove}
            approveButtonText="Approve Copyediting"
            approveDialogTitle="Approve Copyediting File"
            approveDialogDescription="Are you sure you want to approve this copyediting file? This will mark it as copyedited and ready for author review."
            showApproveButton={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
