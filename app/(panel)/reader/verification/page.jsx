'use client';

import { OrcidConnection, RoleRequestForm } from '@/features';

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-background px-0 ">
      <div className=" mx-auto space-y-5">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Verification & Access</h1>
          <p className="text-muted-foreground">
            Complete your verification to unlock additional roles and features
          </p>
        </div>

        {/* Section 1: Request Roles with Form */}
        <RoleRequestForm />

        {/* Section 2: ORCID Connection with Form */}
        <OrcidConnection />
      </div>
    </div>
  );
}
