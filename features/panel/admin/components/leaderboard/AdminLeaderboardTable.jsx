'use client';

import React from 'react';
import DataTable from '@/features/shared/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

export default function AdminLeaderboardTable({ leaderboards = [], isPending, error }) {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Award className="h-5 w-5 text-muted-foreground" />;
  };

  const getCategoryBadge = (category) => {
    const variants = {
      REVIEWER: 'secondary',
      AUTHOR: 'secondary',
    };
    return <Badge variant={variants[category] || 'outline'}>{category}</Badge>;
  };

  const getPeriodBadge = (period) => {
    const variants = {
      MONTHLY: 'outline',
      QUARTERLY: 'outline',
      YEARLY: 'default',
      ALL_TIME: 'secondary',
    };
    return <Badge variant={variants[period] || 'outline'}>{period?.replace('_', ' ')}</Badge>;
  };

  const columns = [
    {
      key: 'rank',
      header: 'Rank',
      headerClassName: 'w-20',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getRankIcon(row.rank)}
          <span className="font-semibold">{row.rank}</span>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <div>
          <div className="font-medium">
            {row.profile?.display_name ||
              `${row.profile?.user?.first_name || ''} ${row.profile?.user?.last_name || ''}`.trim() ||
              'Unknown User'}
          </div>
          <div className="text-sm text-muted-foreground">{row.profile?.user?.email}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => getCategoryBadge(row.category),
    },
    {
      key: 'period',
      header: 'Period',
      render: (row) => getPeriodBadge(row.period),
    },
    {
      key: 'score',
      header: 'Score',
      render: (row) => <span className="font-semibold">{row.score?.toFixed(1)}</span>,
    },
    {
      key: 'metrics',
      header: 'Metrics',
      render: (row) => (
        <div className="text-sm space-y-1">
          {row.metrics &&
            Object.entries(row.metrics).map(([key, value]) => (
              <div key={key}>
                <span className="text-muted-foreground">{key.replace('_', ' ')}: </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
        </div>
      ),
    },
    {
      key: 'journal',
      header: 'Journal',
      render: (row) =>
        row.journal ? (
          <div className="text-sm">{row.journal.title}</div>
        ) : (
          <span className="text-muted-foreground text-sm">All Journals</span>
        ),
    },
    {
      key: 'calculated_at',
      header: 'Calculated',
      headerClassName: 'w-32',
      cellClassName: 'text-sm text-muted-foreground',
      render: (row) => new Date(row.calculated_at).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      data={leaderboards}
      columns={columns}
      isPending={isPending}
      error={error}
      emptyMessage="No leaderboard data available. Click 'Update Leaderboards' to calculate rankings."
      tableClassName="bg-card border"
    />
  );
}
