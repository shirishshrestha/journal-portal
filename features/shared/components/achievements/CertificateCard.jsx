'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PDFViewerModal } from '@/components/ui/pdf-viewer-modal';
import {
  Award,
  Download,
  FileText,
  Shield,
  Calendar,
  Hash,
  Eye,
  Copy,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  downloadCertificatePDF,
  previewCertificatePDF,
  fetchPDFWithAuth,
} from '../../api/achievementsApi';

export const CertificateCard = ({ certificate, onGeneratePDF, isGenerating }) => {
  const [showPDFModal, setShowPDFModal] = useState(false);

  const certificateTypeColors = {
    AWARD:
      'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800',
    BADGE:
      'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800',
    RECOGNITION:
      'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-300 dark:border-green-800',
    PARTICIPATION:
      'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-800',
  };

  const colorClass =
    certificateTypeColors[certificate.certificate_type] ||
    'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <Badge className={`${colorClass} border`}>
                {certificate.certificate_type_display || certificate.certificate_type}
              </Badge>
            </div>
            <CardTitle className="text-lg">{certificate.title}</CardTitle>
            <CardDescription className="mt-1">{certificate.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Certificate Number</p>
              <p className="font-mono font-medium">{certificate.certificate_number}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Issued Date</p>
              <p className="font-medium">
                {format(new Date(certificate.issued_date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Code */}
        {certificate.is_public && certificate.verification_code && (
          <div className="flex items-start gap-2 p-3 bg-muted/50 dark:bg-muted/30 rounded-md border border-muted-foreground/20">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Verification Code</p>
              <p className="font-mono text-sm font-medium break-all">
                {certificate.verification_code}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(certificate.verification_code);
                toast.success('Verification code copied to clipboard');
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Award/Badge Info */}
        {certificate.award && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-md">
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300 mb-1">
              Award Details
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {certificate.award.title}
            </p>
            {certificate.award.citation && (
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-1 italic">
                {certificate.award.citation}
              </p>
            )}
          </div>
        )}

        {certificate.badge && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">
              Badge Details
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {certificate.badge.badge.name}
            </p>
          </div>
        )}

        {/* Journal Info */}
        {certificate.journal && (
          <div className="text-xs text-muted-foreground">
            <FileText className="w-3 h-3 inline mr-1" />
            Issued by: <span className="font-medium">{certificate.journal.title}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {certificate.pdf_generated && certificate.file_url ? (
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => setShowPDFModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const blob = await fetchPDFWithAuth(downloadCertificatePDF(certificate.id));

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `certificate_${certificate.certificate_number}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    toast.success('Certificate downloaded successfully');
                  } catch (error) {
                    toast.error('Failed to download certificate');
                    console.error('Download error:', error);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => onGeneratePDF && onGeneratePDF(certificate.id)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate PDF
                </>
              )}
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const url = `${window.location.origin}/certificates/verify?code=${certificate.verification_code}`;
              navigator.clipboard.writeText(url);
              toast.success('Verification link copied to clipboard');
            }}
          >
            <Shield className="w-4 h-4 mr-2" />
            Copy Verification Link
          </Button>
        </div>
      </CardContent>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        open={showPDFModal}
        onOpenChange={setShowPDFModal}
        pdfUrl={previewCertificatePDF(certificate.id)}
        title={certificate.title}
        filename={`certificate_${certificate.certificate_number}.pdf`}
      />
    </Card>
  );
};

export const CertificateGrid = ({ certificates = [], onGeneratePDF, generatingIds = [] }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
        <p className="text-muted-foreground">No certificates available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onGeneratePDF={onGeneratePDF}
          isGenerating={generatingIds.includes(certificate.id)}
        />
      ))}
    </div>
  );
};
