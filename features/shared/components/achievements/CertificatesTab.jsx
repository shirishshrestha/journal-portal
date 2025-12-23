'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CertificateGrid } from './CertificateCard';

export default function CertificatesTab({ certificates, onGeneratePDF }) {
  const [generatingIds, setGeneratingIds] = useState([]);

  const handleGeneratePDF = async (certificateId) => {
    setGeneratingIds((prev) => [...prev, certificateId]);
    try {
      await onGeneratePDF(certificateId);
    } finally {
      // Remove from generating list after a delay to show the loading state
      setTimeout(() => {
        setGeneratingIds((prev) => prev.filter((id) => id !== certificateId));
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>Your achievement certificates</CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No certificates yet. Earn awards to receive certificates!
            </p>
          ) : (
            <CertificateGrid
              certificates={certificates}
              onGeneratePDF={handleGeneratePDF}
              generatingIds={generatingIds}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
