import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Award, TrendingUp } from 'lucide-react';
import { BadgeCard } from './BadgeCard';

export default function OverviewTab({ myBadges, allBadges, awards, leaderboards, emptyMessage }) {
  const userRank = leaderboards.find((lb) => lb.profile?.id)?.rank || 'N/A';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myBadges.length}</div>
            <p className="text-xs text-muted-foreground">{allBadges.length} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awards Won</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awards.length}</div>
            <p className="text-xs text-muted-foreground">Lifetime achievements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRank}</div>
            <p className="text-xs text-muted-foreground">Current position</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Badges</CardTitle>
          <CardDescription>Your latest achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myBadges.slice(0, 3).map((userBadge) => (
              <BadgeCard key={userBadge.id} badge={userBadge.badge} earned={true} />
            ))}
            {myBadges.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">{emptyMessage}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
