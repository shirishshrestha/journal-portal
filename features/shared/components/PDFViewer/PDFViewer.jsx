"use client";

import { useState, useEffect, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Loader2,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { toast } from "sonner";
import { LoadingScreen } from "..";
import { ThumbnailPage } from "./ThumbnailPage";

// Dynamic imports for react-pdf components (client-side only)
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

/**
 * PDF Viewer Component with Sidebar
 * @param {Object} props
 * @param {string} props.fileUrl - URL of the PDF file
 * @param {string} props.fileName - Name of the PDF file
 * @param {boolean} props.showDownload - Show download button
 * @param {string} props.className - Additional CSS classes
 */
export default function PDFViewer({
  fileUrl,
  fileName = "document.pdf",
  showDownload = true,
  className = "",
}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-pdf").then((pdfjs) => {
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;
      });
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    toast.success("PDF loaded successfully");
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    toast.error("Failed to load PDF");
  };

  const goToPrevPage = () => {
    const newPage = Math.max(pageNumber - 1, 1);
    setPageNumber(newPage);
    setPageInput(String(newPage));
  };

  const goToNextPage = () => {
    const newPage = Math.min(pageNumber + 1, numPages || 1);
    setPageNumber(newPage);
    setPageInput(String(newPage));
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(pageInput, 10);
      if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
        setPageNumber(page);
      } else {
        setPageInput(String(pageNumber));
        toast.error(`Please enter a page between 1 and ${numPages}`);
      }
    }
  };

  const jumpToPage = (page) => {
    setPageNumber(page);
    setPageInput(String(page));
  };

  // Memoize thumbnail array to prevent re-creating on each render
  const thumbnails = useMemo(() => {
    if (!numPages) return [];
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages]);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  return (
    <Card
      className={`${className} p-0 overflow-hidden gap-0 flex flex-col min-h-[90vh]`}
    >
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Sidebar Toggle & Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              title={showSidebar ? "Hide sidebar" : "Show sidebar"}
              className={"hidden md:inline-block"}
            >
              {showSidebar ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyDown={handlePageInputKeyDown}
                className="w-12 h-8 text-center text-sm p-1"
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">
                / {numPages || "..."}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1) || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={isLoading}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={isLoading}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Download Button */}
          {showDownload && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex justify-center items-center p-4  max-w-[85vw] lg:max-w-[70vw] w-full mx-auto overflow-auto relative">
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground mt-20">
            <LoadingScreen />
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Loading PDF...</p>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className={"flex justify-center items-cente"}
        >
          {/* Sidebar with Thumbnails */}
          {showSidebar && (
            <div className="w-48 border-r bg-card overflow-y-auto hidden md:absolute z-1 left-0 lg:relative md:inline-block h-full">
              <div className="p-2 space-y-2">
                {!isLoading &&
                  thumbnails.map((page) => (
                    <ThumbnailPage
                      key={page}
                      page={page}
                      isActive={page === pageNumber}
                      onClick={() => jumpToPage(page)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* PDF Viewer */}
          <div className="flex-1 flex justify-center items-start p-4 overflow-auto">
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="shadow-lg"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </div>
        </Document>
      </div>
    </Card>
  );
}
