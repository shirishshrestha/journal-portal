'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EditorStatsCards({ journals, isLoading }) {
  const totalJournals = journals?.length || 0;
  const withEditor = journals?.filter((j) => j.editor_in_chief_name).length || 0;
  const needsAssignment = totalJournals - withEditor;

  const stats = [
    {
      title: 'Total Journals',
      value: totalJournals,
      color: '',
    },
    {
      title: 'With Editor-in-Chief',
      value: withEditor,
      color: '',
    },
    {
      title: 'Needs Assignment',
      value: needsAssignment,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {isLoading ? '...' : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
