'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Settings,
  Users,
  BarChart3,
  FileText,
  UserCheck,
  Building2,
} from 'lucide-react';

export function RoleInformationCard() {
  const canDoItems = [
    { icon: Settings, text: 'View and manage journal settings' },
    { icon: UserCheck, text: 'Assign and change editor-in-chief for journals' },
    { icon: Users, text: 'Add, remove, and modify staff members' },
    { icon: Building2, text: 'Configure organizational structure' },
    { icon: BarChart3, text: 'Monitor journal performance metrics' },
  ];

  const cannotDoItems = [
    { text: 'Make editorial decisions on submissions' },
    { text: 'Review or approve manuscripts' },
    { text: 'Assign reviewers to submissions' },
    { text: 'Participate in the peer review process' },
  ];

  return (
    <Card className="border-2">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span>Role Information</span>
            <Badge variant="outline" className="w-fit mt-1 text-xs font-normal">
              Journal Manager
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-6">
        {/* Permissions Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
            <h3 className="font-semibold text-sm text-green-700 dark:text-green-500">
              Your Permissions
            </h3>
          </div>
          <div className="space-y-2">
            {canDoItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 transition-all hover:shadow-sm"
              >
                <item.icon className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm text-green-900 dark:text-green-100">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restrictions Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
            <h3 className="font-semibold text-sm text-red-700 dark:text-red-500">Not Permitted</h3>
          </div>
          <div className="space-y-2">
            {cannotDoItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
              >
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm text-red-900 dark:text-red-100">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      {/* Info Footer */}
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground text-center">
          <FileText className="h-3 w-3 inline mr-1" />
          Your role focuses on administrative and organizational management
        </p>
      </div>
    </Card>
  );
}
