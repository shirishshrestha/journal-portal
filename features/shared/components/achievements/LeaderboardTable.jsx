import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Crown } from 'lucide-react';

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

  return (
    <Card>
      <CardHeader>
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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Score</TableHead>
              {leaderboard.data[0]?.stats && <TableHead>Details</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                    <Badge className={getRankBadgeColor(entry.rank)}>#{entry.rank}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={entry.user?.avatar} />
                      <AvatarFallback>
                        {entry.user?.first_name?.[0]}
                        {entry.user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {entry.user?.first_name} {entry.user?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{entry.user?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    {entry.score.toFixed(2)}
                  </Badge>
                </TableCell>
                {entry.stats && (
                  <TableCell>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {Object.entries(entry.stats).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}: </span>
                          {value}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
