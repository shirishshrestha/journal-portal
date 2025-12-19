'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function RoleInformationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">What You Can Do:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>View and manage journal settings</li>
            <li>Assign and change editor-in-chief for journals</li>
            <li>Add, remove, and modify staff members</li>
            <li>Configure organizational structure</li>
            <li>Monitor journal performance metrics</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-destructive">What You Cannot Do:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Make editorial decisions on submissions</li>
            <li>Review or approve manuscripts</li>
            <li>Assign reviewers to submissions</li>
            <li>Participate in the peer review process</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
