import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { DataTable, StatusBadge, statusConfig } from '@/features/shared';
import EllipsisTooltip from '@/components/ui/EllipsisTooltip';

// Table columns config
const columns = [
  {
    key: 'title',
    header: 'Title',
    render: (row) => (
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <div>
          <EllipsisTooltip text={row.title || '-'} />
          <p className="text-xs text-muted-foreground">{row.submission_number}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'journal_name',
    header: 'Journal',
    cellClassName: 'text-sm',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} statusConfig={statusConfig} />,
  },
  {
    key: 'submitted_at',
    header: 'Submission Date',
    cellClassName: 'text-sm',
    render: (row) => (row.submitted_at ? format(new Date(row.submitted_at), 'PPP p') : '-'),
  },
  {
    key: 'updated_at',
    header: 'Last Updated',
    cellClassName: 'text-sm',
    render: (row) => (row.updated_at ? format(new Date(row.updated_at), 'PPP p') : '-'),
  },
];

export default function AuthorDashboardTable({
  submissions = [],
  isPending = false,
  error = null,
}) {
  return (
    <DataTable
      data={submissions}
      columns={columns}
      emptyMessage="No submissions yet. Create your first submission to get started."
      tableClassName="bg-card border flex justify-center"
      hoverable
      isPending={isPending}
      error={error}
      errorMessage="Error loading submissions"
    />
  );
}
