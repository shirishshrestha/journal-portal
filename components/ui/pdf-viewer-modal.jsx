'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPDFWithAuth } from '@/features/shared/api/achievementsApi';

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  import('react-pdf').then((pdfjs) => {
    pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

/**
 * PDFViewerModal - Responsive PDF viewer in a modal dialog using react-pdf
 * @param {boolean} open - Modal open state
 * @param {function} onOpenChange - Callback when modal state changes
 * @param {string} pdfUrl - URL to fetch the PDF
 * @param {string} title - Modal title
 * @param {string} filename - Filename for download
 */
export function PDFViewerModal({ open, onOpenChange, pdfUrl, title, filename }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  // Fetch PDF as blob when modal opens
  useEffect(() => {
    if (open && pdfUrl) {
      setPageNumber(1);
      setScale(1.0);
      setError(null);
      setIsLoading(true);
      setPdfBlob(null);

      // Fetch PDF with authentication using axios
      const fetchPDF = async () => {
        try {
          const blob = await fetchPDFWithAuth(pdfUrl);
          setPdfBlob(blob);
          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching PDF:', err);
          setError('Failed to load PDF. Please try again.');
          setIsLoading(false);
          toast.error('Failed to load PDF');
        }
      };

      fetchPDF();
    }
  }, [open, pdfUrl]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(URL.createObjectURL(pdfBlob));
      }
    };
  }, [pdfBlob]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to render PDF. Please try again.');
    toast.error('Failed to render PDF');
  };

  const handleDownload = async () => {
    try {
      // Use already fetched blob if available
      const blob = pdfBlob || (await fetchPDFWithAuth(pdfUrl));

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Failed to download PDF');
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handlePrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[1400px] h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg md:text-xl truncate">{title}</DialogTitle>
              <DialogDescription className="text-sm truncate">{filename}</DialogDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Page navigation */}
              {numPages && (
                <div className="hidden sm:flex items-center gap-1 border rounded-md px-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handlePrevPage}
                    disabled={pageNumber <= 1}
                    className="h-8 px-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs px-2 min-w-12 text-center">
                    {pageNumber} / {numPages}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleNextPage}
                    disabled={pageNumber >= numPages}
                    className="h-8 px-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Zoom controls */}
              <div className="hidden sm:flex items-center gap-1 border rounded-md">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  className="h-8"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2 min-w-12 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomIn}
                  disabled={scale >= 2.5}
                  className="h-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Download */}
              <Button size="sm" onClick={handleDownload} disabled={isLoading} className="h-8">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-4">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-4">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => setError(null)} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <Document
              file={pdfBlob}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading PDF...</p>
                  </div>
                </div>
              }
              className="flex flex-col items-center"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />
            </Document>
          )}
        </div>

        {/* Mobile-only controls at bottom */}
        <div className="sm:hidden flex flex-col gap-2 p-3 border-t bg-background shrink-0">
          {/* Page navigation */}
          {numPages && (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-3">
                {pageNumber} / {numPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextPage}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center justify-center gap-2">
            <Button size="sm" variant="outline" onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm px-3">{Math.round(scale * 100)}%</span>
            <Button size="sm" variant="outline" onClick={handleZoomIn} disabled={scale >= 2.5}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
