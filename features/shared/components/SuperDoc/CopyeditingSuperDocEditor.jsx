'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Download, CheckCircle2 } from 'lucide-react';
import '@harbour-enterprises/superdoc/style.css';
import { loadCopyeditingFile, saveCopyeditingFile } from '@/features/panel/editor/submission/api';
import { useApproveCopyeditingFile } from '@/features/panel/editor/submission/hooks/mutation/useCopyeditingFiles';
import ConfirmationPopup from '@/features/shared/components/ConfirmationPopup';
import { ErrorCard } from '..';
import { useRouter } from 'next/navigation';

/**
 * Copyediting SuperDoc Editor Component
 * Specialized SuperDoc editor for copyediting files with load/save API integration
 *
 * Features:
 * - Loads copyediting files via GET /api/v1/submissions/copyediting/files/{id}/load/
 * - Saves files via POST /api/v1/submissions/copyediting/files/{id}/save/
 * - Manual save workflow (replaces file instead of creating versions)
 * - Tracks last_edited_by and last_edited_at
 */
export default function CopyeditingSuperDocEditor({
  fileId,
  userData,
  className = '',
  readOnly = false,
  commentsReadOnly = false,
  goBack,
  onApprove, // Pass approve/confirm function from parent
  approveButtonText = 'Approve Copyediting', // Customizable button text
  approveDialogTitle = 'Approve Copyediting File',
  approveDialogDescription = 'Are you sure you want to approve this copyediting file? This action cannot be undone.',
  showApproveButton = true, // Show/hide approve button
}) {
  const queryClient = useQueryClient();
  const superDocInstanceRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (!fileId) return;

    if (onApprove) {
      // Use custom approve function from parent
      setIsApproving(true);
      try {
        await onApprove(fileId);
        setIsApproveDialogOpen(false);
        if (goBack) {
          router.push(goBack);
        }
      } catch (error) {
        toast.error('Failed to approve copyediting file');
        console.error('Approve error:', error);
      } finally {
        setIsApproving(false);
      }
    }
  };

  // Load file mutation
  const {
    data: fileData,
    isPending: isFileLoadPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['copyediting-file', fileId],
    queryFn: () => loadCopyeditingFile(fileId),
  });

  // Save file mutation
  const saveMutation = useMutation({
    mutationFn: (formData) => saveCopyeditingFile(fileId, formData),

    onSuccess: (data) => {
      setHasUnsavedChanges(false);
      toast.success('File saved successfully');

      // Invalidate queries to refresh file lists
      queryClient.invalidateQueries({
        queryKey: ['copyediting-files'],
      });

      queryClient.invalidateQueries({
        queryKey: ['copyediting-file'],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to save file');
    },
  });

  // Handle save button click
  const handleSave = async () => {
    if (!superDocInstanceRef.current) {
      toast.error('Editor not ready');
      return;
    }

    if (!superDocInstanceRef.current.activeEditor) {
      toast.error('Editor not initialized');
      return;
    }

    try {
      // Export as DOCX blob
      const blob = await superDocInstanceRef.current.export({
        commentsType: 'external',
        triggerDownload: false,
      });

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', blob, fileData.original_filename);

      // Save using mutation
      saveMutation.mutate(formData);
    } catch (error) {
      console.error('Error preparing document:', error);
      toast.error('Failed to prepare document for saving');
    }
  };

  // Initialize SuperDoc editor
  useEffect(() => {
    if (!fileData || isInitializedRef.current) {
      return;
    }

    let mounted = true;

    const initializeEditor = async () => {
      try {
        const { SuperDoc } = await import('@harbour-enterprises/superdoc');

        if (!mounted) return;

        // Initialize SuperDoc
        const editor = new SuperDoc({
          selector: '#copyediting-superdoc-editor',
          document: fileData.file_url,
          pagination: true,
          theme: 'light',
          role: readOnly ? 'viewer' : 'editor',
          user: {
            name: userData?.first_name || 'User',
            email: userData?.email || 'user@example.com',
          },
          modules: {
            comments: { readOnly: commentsReadOnly },
            toolbar: readOnly
              ? false
              : {
                  selector: '#copyediting-superdoc-toolbar',
                  excludeItems: [
                    'documentMode',
                    'acceptTrackedChangeBySelection',
                    'rejectTrackedChangeOnSelection',
                  ],
                },
          },
          onReady: () => {
            const superdocRoot = document.getElementById('copyediting-superdoc-editor');
            if (superdocRoot) {
              superdocRoot.style.setProperty('color', '#222', 'important');
              const allElements = superdocRoot.querySelectorAll('*');
              allElements.forEach((el) => {
                el.style.setProperty('color', '#222', 'important');
              });
            }
            toast.success('Document loaded successfully');
          },
          onEditorUpdate: () => {
            setHasUnsavedChanges(true);
          },
          onError: (error) => {
            console.error('SuperDoc error:', error);
            toast.error('Failed to load document');
          },
        });

        superDocInstanceRef.current = editor;
        isInitializedRef.current = true;
      } catch (error) {
        console.error('Failed to initialize editor:', error);
        toast.error('Failed to initialize document editor');
      }
    };

    initializeEditor();

    return () => {
      mounted = false;
      if (superDocInstanceRef.current) {
        try {
          superDocInstanceRef.current.destroy?.();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
        superDocInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [fileData, readOnly, commentsReadOnly, userData]);

  if (isFileLoadPending) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorCard
        title="Failed to load files"
        description={error.message || ' Unable to load the document. Please try again.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <div className="p-3 border rounded-lg bg-muted/50 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="font-medium">File:</span> {fileData.original_filename}
          </div>
          <div>
            <span className="font-medium">Size:</span>{' '}
            {(fileData.file_size / (1024 * 1024)).toFixed(2)} MB
          </div>
          <div>
            <span className="font-medium">Last Edited:</span>{' '}
            {new Date(fileData.last_edited_at).toLocaleString()}
          </div>
        </div>
      </div>
      {!readOnly && (
        <div className="flex items-center justify-between p-3 border-b bg-card">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-xs">
                Unsaved Changes
              </Badge>
            )}
            {saveMutation.isPending && (
              <Badge variant="secondary" className="text-xs">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Saving...
              </Badge>
            )}
            {fileData?.last_edited_by && (
              <Badge variant="secondary" className="text-xs">
                Last edited by {fileData.last_edited_by.name} at{' '}
                {new Date(fileData.last_edited_at).toLocaleString()}
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={saveMutation.isPending || !hasUnsavedChanges}
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Document
            </Button>
            {showApproveButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsApproveDialogOpen(true)}
                disabled={isApproving}
              >
                {isApproving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                {approveButtonText}
              </Button>
            )}
          </div>
        </div>
      )}

      {readOnly && (
        <div className="flex items-center justify-between p-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              View Only Mode
            </Badge>
            {fileData?.last_edited_by && (
              <Badge variant="secondary" className="text-xs">
                Last edited by {fileData.last_edited_by.name}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div
        className={`${className} bg-white flex overflow-x-auto overflow-y-auto max-h-[95vh] flex-col `}
        id="copyediting-superdoc__container"
      >
        {/* Editor Container */}
        <div className="flex flex-col items-center relative">
          <div
            id="copyediting-superdoc-toolbar"
            className="bg-white border-b sticky left-0 top-0 z-4 border-gray-200 overflow-x-auto max-w-[300px]  md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-5xl"
          />
          <div
            id="copyediting-superdoc-editor"
            className="text-black max-w-[320px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-5xl mx-auto"
            style={{
              minHeight: '600px',
              padding: '20px',
              background: '#fff',
              color: '#222',
            }}
          />
        </div>
      </div>

      <ConfirmationPopup
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        title={approveDialogTitle}
        description={approveDialogDescription}
        confirmText="Confirm"
        cancelText="Cancel"
        isPending={isApproving}
        isSuccess={false}
        onConfirm={handleApprove}
        variant="primary"
        icon={<CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />}
      />
    </>
  );
}
