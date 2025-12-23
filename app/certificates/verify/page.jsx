'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerifyCertificate } from '@/features';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Shield,
  CheckCircle,
  XCircle,
  Search,
  Award,
  Calendar,
  Hash,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

export default function CertificateVerifyPage() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code');

  // Initialize state directly from URL param without useEffect
  const [verificationCode, setVerificationCode] = useState(
    codeFromUrl ? codeFromUrl.toUpperCase() : ''
  );
  const [shouldVerify, setShouldVerify] = useState(!!codeFromUrl);
  const [showForm, setShowForm] = useState(!codeFromUrl);

  const {
    data: verificationResult,
    isPending,
    error,
    refetch,
  } = useVerifyCertificate(verificationCode, { enabled: shouldVerify });

  const handleVerify = () => {
    if (verificationCode.trim().length > 0) {
      setShouldVerify(true);
      setShowForm(false);
      refetch();
    }
  };

  const handleReset = () => {
    setVerificationCode('');
    setShouldVerify(false);
    setShowForm(true);
  };

  // Show results or error
  const hasResults = shouldVerify && !isPending && (verificationResult || error);

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-100 dark:bg-blue-950 p-4 rounded-full">
              <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Certificate Verification</h1>
          <p className="text-muted-foreground text-lg">
            Verify the authenticity of achievement certificates
          </p>
        </div>

        {/* Verification Form - Only show if no results or showForm is true */}
        {showForm && !hasResults && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Verification Code</CardTitle>
              <CardDescription>
                Enter the verification code found on the certificate to verify its authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="verification-code"
                    placeholder="Enter verification code (e.g., ABC123XYZ456)"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleVerify();
                      }
                    }}
                    className="font-mono"
                    maxLength={20}
                  />
                  <Button onClick={handleVerify} disabled={isPending || !verificationCode.trim()}>
                    {isPending && verificationCode.trim() ? (
                      <>Verifying...</>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Results */}
        {shouldVerify && !isPending && (
          <>
            {error || (verificationResult && !verificationResult.valid) ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  The verification code you entered is invalid or the certificate does not exist.
                  Please check the code and try again.
                </AlertDescription>
              </Alert>
            ) : verificationResult?.valid ? (
              <div className="space-y-6">
                {/* Success Alert */}
                <Alert className="border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-900 dark:text-green-300">
                    Certificate Verified
                  </AlertTitle>
                  <AlertDescription className="text-green-800 dark:text-green-400">
                    This certificate is authentic and was issued by the system.
                  </AlertDescription>
                </Alert>

                {/* Certificate Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          {verificationResult.certificate.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {verificationResult.certificate.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500 dark:bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Certificate Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                        <Hash className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Certificate Number
                          </p>
                          <p className="font-mono font-semibold">
                            {verificationResult.certificate.certificate_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Issued Date</p>
                          <p className="font-semibold">
                            {format(
                              new Date(verificationResult.certificate.issued_date),
                              'MMMM dd, yyyy'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                        <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Certificate Type
                          </p>
                          <Badge variant="outline">
                            {verificationResult.certificate.certificate_type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {verificationResult.certificate.journal && (
                        <div className="flex items-start gap-3 p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                          <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Issued By</p>
                            <p className="font-semibold">
                              {verificationResult.certificate.journal.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recipient Info */}
                    {verificationResult.certificate.recipient && (
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <p className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">
                          Awarded To
                        </p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-200">
                          {verificationResult.certificate.recipient.display_name}
                        </p>
                        {verificationResult.certificate.recipient.affiliation && (
                          <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                            {verificationResult.certificate.recipient.affiliation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Award/Badge Details */}
                    {verificationResult.certificate.award && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                          Award Details
                        </p>
                        <p className="text-base font-semibold text-blue-900 dark:text-blue-200">
                          {verificationResult.certificate.award.title}
                        </p>
                        {verificationResult.certificate.award.citation && (
                          <p className="text-sm text-blue-700 dark:text-blue-400 mt-2 italic">
                            {verificationResult.certificate.award.citation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Verification Code */}
                    <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border-2 border-dashed">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Verification Code
                          </p>
                          <p className="font-mono text-lg font-bold">{verificationCode}</p>
                        </div>
                        <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-center">
                  <Button onClick={handleReset} variant="outline">
                    Verify Another Certificate
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* Info Section - Only show when no verification has been attempted */}
        {!shouldVerify && showForm && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">How to Verify</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-sm">
                  Locate the verification code on your certificate (usually found at the bottom)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-sm">Enter the verification code in the field above</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-sm">
                  Click &quot;Verify&quot; to check the certificate&apos;s authenticity
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
