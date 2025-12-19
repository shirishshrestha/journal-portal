'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StaffStatsCards({ staffMembers, isLoading }) {
  const totalStaff = staffMembers?.length || 0;
  const sectionEditors = staffMembers?.filter((s) => s.role === 'SECTION_EDITOR').length || 0;
  const associateEditors = staffMembers?.filter((s) => s.role === 'ASSOCIATE_EDITOR').length || 0;
  const otherRoles =
    staffMembers?.filter((s) => s.role !== 'SECTION_EDITOR' && s.role !== 'ASSOCIATE_EDITOR')
      .length || 0;

  const stats = [
    {
      title: 'Total Staff',
      value: totalStaff,
    },
    {
      title: 'Section Editors',
      value: sectionEditors,
    },
    {
      title: 'Associate Editors',
      value: associateEditors,
    },
    {
      title: 'Other Roles',
      value: otherRoles,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
