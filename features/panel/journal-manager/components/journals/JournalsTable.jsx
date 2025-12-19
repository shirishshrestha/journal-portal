'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Settings } from 'lucide-react';
import { DataTable } from '@/features/shared';
import EllipsisTooltip from '@/components/ui/EllipsisTooltip';

export function JournalsTable({ journals = [], isLoading = false, error = null }) {
  const columns = [
    {
      key: 'title',
      header: 'Journal Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div>
            <EllipsisTooltip
              text={row.title || row.name || '-'}
              spanProps={{ className: 'font-medium' }}
            />
            <div className="text-sm text-muted-foreground">
              <EllipsisTooltip text={row.short_name || row.abbreviation || ''} maxLength={24} />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'issn',
      header: 'ISSN',
      render: (row) => {
        const issn = row.issn_print || row.issn || row.issn_online || '';
        return issn || '-';
      },
    },
    {
      key: 'is_active',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <Badge className="capitalize">{row.is_active ? 'active' : 'inactive'}</Badge>
      ),
    },
    {
      key: 'editor_in_chief',
      header: 'Editor-in-Chief',
      render: (row) => row.editor_in_chief?.name || '-',
    },
    {
      key: 'staff_count',
      header: 'Staff',
      align: 'center',
      render: (row) => (row.staff_members ? row.staff_members.length : row.staff_count || 0),
    },
    {
      key: 'submission_count',
      header: 'Submissions',
      align: 'center',
      render: (row) => row.submission_count || 0,
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      render: (row) =>
        row.updated_at
          ? new Date(row.updated_at).toLocaleDateString()
          : row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-1" /> Settings
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={journals}
      columns={columns}
      emptyMessage="No journals found"
      isPending={isLoading}
      error={error}
      errorMessage="Error loading journals"
      tableClassName="bg-card border flex justify-center "
      hoverable
    />
  );
}
