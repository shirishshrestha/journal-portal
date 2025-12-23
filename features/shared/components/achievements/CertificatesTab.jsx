import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CertificateGrid } from './CertificateCard';

export default function CertificatesTab({ certificates, onGeneratePDF }) {
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
            <CertificateGrid certificates={certificates} onGeneratePDF={onGeneratePDF} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
