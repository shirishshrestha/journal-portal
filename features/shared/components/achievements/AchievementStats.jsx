import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Medal, TrendingUp } from 'lucide-react';

/**
 * AchievementStats Component - Displays user's achievement statistics
 */
export const AchievementStats = ({ badges = [], awards = [], leaderboardPosition = null }) => {
  // Count badges by level
  const badgeCounts = badges.reduce(
    (acc, userBadge) => {
      const level = userBadge.badge.level;
      if (level) {
        acc[level] = (acc[level] || 0) + 1;
      }
      return acc;
    },
    { BRONZE: 0, SILVER: 0, GOLD: 0, PLATINUM: 0 }
  );

  // Count featured badges
  const featuredBadges = badges.filter((b) => b.is_featured).length;

  const stats = [
    {
      title: 'Total Badges',
      value: badges.length,
      icon: Trophy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Awards',
      value: awards.length,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Featured Badges',
      value: featuredBadges,
      icon: Medal,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  if (leaderboardPosition) {
    stats.push({
      title: 'Leaderboard Rank',
      value: `#${leaderboardPosition}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    });
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Badge Level Breakdown */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Badge Levels</CardTitle>
            <CardDescription>Breakdown of badges by level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-2xl font-bold text-amber-700">{badgeCounts.BRONZE}</div>
                <div className="text-sm text-muted-foreground mt-1">Bronze</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-300">
                <div className="text-2xl font-bold text-gray-600">{badgeCounts.SILVER}</div>
                <div className="text-sm text-muted-foreground mt-1">Silver</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-300">
                <div className="text-2xl font-bold text-yellow-700">{badgeCounts.GOLD}</div>
                <div className="text-sm text-muted-foreground mt-1">Gold</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-slate-100 border border-slate-400">
                <div className="text-2xl font-bold text-slate-700">{badgeCounts.PLATINUM}</div>
                <div className="text-sm text-muted-foreground mt-1">Platinum</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
