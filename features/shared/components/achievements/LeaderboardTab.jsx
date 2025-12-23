import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { FilterToolbar } from '@/features';
import { LeaderboardTable } from './LeaderboardTable';

export default function LeaderboardTab({
  leaderboards,
  period,
  title = 'Rankings',
  description = 'See where you stand',
}) {
  return (
    <div className="space-y-6">
      {/* Period Selector using FilterToolbar */}
      <FilterToolbar>
        <FilterToolbar.Select
          label="Leaderboard Period"
          paramName="period"
          options={[
            { value: 'MONTHLY', label: 'Monthly' },
            { value: 'QUARTERLY', label: 'Quarterly' },
            { value: 'YEARLY', label: 'Yearly' },
            { value: 'ALL_TIME', label: 'All Time' },
          ]}
        />
      </FilterToolbar>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="w-12 h-12 mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No leaderboard data available</p>
            </div>
          ) : (
            <LeaderboardTable
              leaderboard={{
                name: `${title} - ${period.replace('_', ' ')}`,
                description: description,
                period: period.toLowerCase(),
                data: leaderboards,
              }}
              showPeriod={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
