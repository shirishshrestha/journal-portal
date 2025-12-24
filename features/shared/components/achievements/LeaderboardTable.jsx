import React from 'react';
import DataTable from '@/features/shared/components/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';

/**
 * LeaderboardTable Component - Displays leaderboard rankings
 */
export const LeaderboardTable = ({ leaderboard, showPeriod = true }) => {
  if (!leaderboard || !leaderboard.data || leaderboard.data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="w-12 h-12 mb-3 opacity-50 text-muted-foreground" />
          <p className="text-muted-foreground">No leaderboard data available</p>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500 text-yellow-900';
      case 2:
        return 'bg-gray-400 text-gray-900';
      case 3:
        return 'bg-amber-700 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const columns = [
    {
      key: 'rank',
      header: 'Rank',
      headerClassName: 'w-[80px]',
      render: (entry) => (
        <div className="flex items-center gap-2">
          {getRankIcon(entry.rank)}
          <Badge className={getRankBadgeColor(entry.rank)}>#{entry.rank}</Badge>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (entry) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={entry.profile?.avatar_url} />
            <AvatarFallback>
              {entry.profile?.display_name?.[0]}
              {entry.profile?.display_name?.[1]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{entry.profile?.display_name}</p>
            <p className="text-sm text-muted-foreground">{entry.profile?.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      render: (entry) => (
        <Badge variant="secondary" className="font-mono">
          {entry.score.toFixed(2)}
        </Badge>
      ),
    },
  ];

  // Add metrics column if data has metrics
  if (leaderboard.data[0]?.metrics) {
    columns.push({
      key: 'metrics',
      header: 'Details',
      render: (entry) => (
        <div className="text-sm text-muted-foreground space-y-1">
          {Object.entries(entry.metrics).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key.replace(/_/g, ' ')}: </span>
              {value}
            </div>
          ))}
        </div>
      ),
    });
  }

  return (
    <>
      <Card>
        <CardHeader className={'gap-0!'}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {leaderboard.name || 'Leaderboard'}
              </CardTitle>
              <CardDescription>{leaderboard.description}</CardDescription>
            </div>
            {showPeriod && leaderboard.period && (
              <Badge variant="outline">{leaderboard.period.toUpperCase()}</Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <DataTable
        data={leaderboard.data}
        columns={columns}
        emptyMessage="No leaderboard data available"
        tableClassName="bg-card flex justify-center"
      />
    </>
  );
};
