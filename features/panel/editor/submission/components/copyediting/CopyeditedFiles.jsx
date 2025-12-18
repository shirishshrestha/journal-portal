'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, CheckCircle, Loader2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useApproveCopyeditingFile, useCopyEditedFiles } from '../../hooks';

/**
 * Component to display copyedited files
 * Shows edited manuscript files with tracking and version history
 */
export function CopyeditedFiles({ assignmentId, isAuthorView = false, readOnly = false, isCompleted = false }) {
  const router = useRouter();
  const params = useParams();
  const submissionIdFromParams = params?.id;

  // Fetch copyediting files
  const {
    data: filesData,
    isLoading,
    error,
  } = useCopyEditedFiles({
    assignmentId,
  });

  const files = filesData?.results || [];

  // Approve file mutation
  const approveMutation = useApproveCopyeditingFile();

  const handleApprove = (fileId) => {
    approveMutation.mutate(fileId);
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Copyedited Files</CardTitle>
              <CardDescription>
                Manuscript files with copyediting changes applied. Upload edited versions here.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading files...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading copyedited files</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">
                Copyeditor has not yet copyedited the files from draft
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once the copyeditor submits the draft files, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {files &&
                files?.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <FileText className="h-8 w-8 text-primary stroke-[1.5] shrink-0" />
                        {file.is_approved && (
                          <CheckCircle className="h-4 w-4 text-green-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium whitespace-normal">{file.original_filename}</p>
                          {file.version && (
                            <Badge variant="secondary" className="text-xs">
                              v{file.version}
                            </Badge>
                          )}
                          {file.file_type === 'AUTHOR_FINAL' && (
                            <Badge variant="success" className="text-xs">
                              Author Confirmed
                            </Badge>
                          )}
                          {file.file_type === 'COPYEDITED' && (
                            <Badge
                              variant="outline"
                              className="text-xs border-orange-500 text-orange-600"
                            >
                              Awaiting Author
                            </Badge>
                          )}
                          {file.file_type === 'FINAL' && (
                            <Badge className="text-xs bg-blue-600">Final</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="inline-flex items-center">
                            {file.file_type_display || file.file_type}
                          </span>
                          {file.file_size && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                            </>
                          )}
                          {file.created_at && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                            </>
                          )}
                        </div>
                        {file.uploaded_by && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded by: {file.uploaded_by.user?.first_name}{' '}
                            {file.uploaded_by.user?.last_name}
                          </p>
                        )}
                        {file.description && (
                          <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                      {!readOnly && file.file_type !== 'COPYEDITED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const route = isAuthorView
                              ? `/author/submissions/active/${submissionIdFromParams}/copyediting/edit/${file.id}`
                              : `/editor/submissions/${submissionIdFromParams}/copyediting/edit/${file.id}`;
                            router.push(route);
                          }}
                          title="Edit in SuperDoc"
                          disabled={isCompleted}
                        >
                          <Edit className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      )}
                      {!file.is_approved && !isAuthorView && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(file.id)}
                          disabled={approveMutation.isPending || isCompleted}
                          title="Approve this file"
                        >
                          <CheckCircle className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file.id, file.original_filename)}
                        title="Download file"
                      >
                        <Download className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
