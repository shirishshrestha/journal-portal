'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, UserCheck, FileText } from 'lucide-react';

export function DashboardStatsCards({ stats, isLoading }) {
  const statsConfig = [
    {
      title: 'Active Journals',
      value: stats?.activeJournals || '0',
      icon: BookOpen,
      valueClass: 'text-chart-1',
      iconClass: 'text-chart-1',
      description: 'Journals under management',
    },
    {
      title: 'Total Staff',
      value: stats?.totalStaff || '0',
      icon: Users,
      valueClass: 'text-chart-2',
      iconClass: 'text-chart-2',
      description: 'Editors and staff members',
    },
    {
      title: 'Editor-in-Chief',
      value: stats?.editorInChiefCount || '0',
      icon: UserCheck,
      valueClass: 'text-chart-3',
      iconClass: 'text-chart-3',
      description: 'Active chief editors',
    },
    {
      title: 'Pending Changes',
      value: stats?.pendingChanges || '0',
      icon: FileText,
      valueClass: 'text-chart-4',
      iconClass: 'text-chart-4',
      description: 'Staff updates pending',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.iconClass}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.valueClass}`}>
                {isLoading ? '...' : stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
