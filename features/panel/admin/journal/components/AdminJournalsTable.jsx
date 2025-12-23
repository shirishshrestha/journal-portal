'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, MoreVertical, UserPlus, UserCog } from 'lucide-react';
import { DataTable } from '@/features/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Custom color classes for status badges
const statusBadgeColors = {
  active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
  inactive: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
  accepting: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
  closed: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
};

export default function AdminJournalsTable({
  journals = [],
  onViewDrawer,
  onDelete,
  onAssignManager,
  onViewManager,
  isPending = false,
  error = null,
  sortColumn,
  sortOrder,
  onSort,
}) {
  // Helper function to check if journal has a manager
  const hasJournalManager = (journal) => {
    return (
      journal.staff_members &&
      journal.staff_members.some((staff) => staff.role === 'JOURNAL_MANAGER')
    );
  };

  // Helper function to get journal manager
  const getJournalManager = (journal) => {
    if (!journal.staff_members) return null;
    return journal.staff_members.find((staff) => staff.role === 'JOURNAL_MANAGER');
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      cellClassName: 'font-medium text-foreground',
    },
    {
      key: 'short_name',
      header: 'Short Name',
      cellClassName: 'text-muted-foreground',
    },
    {
      key: 'publisher',
      header: 'Publisher',
      cellClassName: 'text-muted-foreground',
    },
    {
      key: 'editor_in_chief',
      header: 'Editor-in-Chief',
      render: (row) => (
        <div className="text-sm">
          <p className="font-medium">{row.editor_in_chief?.name || '-'}</p>
          <p className="text-xs text-muted-foreground">{row.editor_in_chief?.email || '-'}</p>
        </div>
      ),
    },
    {
      key: 'submission_count',
      header: 'Submissions',
      align: 'center',
      cellClassName: 'font-medium text-center',
    },
    {
      key: 'is_active',
      header: 'Active',
      align: 'center',
      render: (row) => (
        <Badge className={row.is_active ? statusBadgeColors.active : statusBadgeColors.inactive}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
      cellClassName: 'text-center',
    },
    {
      key: 'is_accepting_submissions',
      header: 'Accepting',
      align: 'center',
      render: (row) => (
        <Badge
          className={
            row.is_accepting_submissions ? statusBadgeColors.accepting : statusBadgeColors.closed
          }
        >
          {row.is_accepting_submissions ? 'Accepting' : 'Closed'}
        </Badge>
      ),
      cellClassName: 'text-center',
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDrawer(row)} className="gap-2">
              <Eye className="h-4 w-4" /> View Details
            </DropdownMenuItem>
            {hasJournalManager(row) ? (
              <DropdownMenuItem
                onClick={() => onViewManager(row, getJournalManager(row))}
                className="gap-2"
              >
                <UserCog className="h-4 w-4" /> View Manager
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onAssignManager(row)} className="gap-2">
                <UserPlus className="h-4 w-4" /> Assign Manager
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(row.id)} className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={journals}
      columns={columns}
      emptyMessage="No journals found"
      isPending={isPending}
      error={error}
      errorMessage="Error loading journals"
      hoverable={true}
      tableClassName="bg-card border flex justify-center"
    />
  );
}
