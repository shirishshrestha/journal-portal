'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Download, FileText, Shield, Calendar, Hash, Eye, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { downloadCertificatePDF, previewCertificatePDF } from '../../api/achievementsApi';

export const CertificateCard = ({ certificate, onGeneratePDF }) => {
  const certificateTypeColors = {
    AWARD: 'bg-purple-100 text-purple-800 border-purple-300',
    BADGE: 'bg-blue-100 text-blue-800 border-blue-300',
    RECOGNITION: 'bg-green-100 text-green-800 border-green-300',
    PARTICIPATION: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  const colorClass = certificateTypeColors[certificate.certificate_type] || 'bg-gray-100 text-gray-800 border-gray-300';

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
            <CardDescription className="mt-1">
              {certificate.description}
            </CardDescription>
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
          <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
            <Shield className="w-4 h-4 text-green-600 mt-0.5" />
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
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-xs font-medium text-purple-900 mb-1">Award Details</p>
            <p className="text-sm text-purple-800">{certificate.award.title}</p>
            {certificate.award.citation && (
              <p className="text-xs text-purple-700 mt-1 italic">{certificate.award.citation}</p>
            )}
          </div>
        )}

        {certificate.badge && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs font-medium text-blue-900 mb-1">Badge Details</p>
            <p className="text-sm text-blue-800">{certificate.badge.badge.name}</p>
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
              <Button
                size="sm"
                className="flex-1"
                onClick={() => window.open(certificate.file_url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(previewCertificatePDF(certificate.id), '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => onGeneratePDF && onGeneratePDF(certificate.id)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
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
    </Card>
  );
};

export const CertificateGrid = ({ certificates = [], onGeneratePDF }) => {
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
        />
      ))}
    </div>
  );
};
