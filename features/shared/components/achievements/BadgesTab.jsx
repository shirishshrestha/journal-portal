import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterToolbar } from '@/features';
import { BadgeCard } from './BadgeCard';

export default function BadgesTab({ allBadges, myBadges, yearOptions, badgeTypeLabel = 'Author' }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My {badgeTypeLabel} Badges</CardTitle>
          <CardDescription>Badges you have earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myBadges.map((userBadge) => (
              <BadgeCard
                key={userBadge.id}
                badge={userBadge.badge}
                earned={true}
                earnedAt={userBadge.earned_at}
                isFeatured={userBadge.is_featured}
              />
            ))}
            {myBadges.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No badges earned yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters using FilterToolbar */}
      {/* <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          placeholder="Search badges by name..."
          label="Search Badges"
        />
        <FilterToolbar.Select
          label="Filter by Level"
          paramName="level"
          options={[
            { value: 'all', label: 'All Levels' },
            { value: 'BRONZE', label: 'Bronze' },
            { value: 'SILVER', label: 'Silver' },
            { value: 'GOLD', label: 'Gold' },
            { value: 'PLATINUM', label: 'Platinum' },
            { value: 'DIAMOND', label: 'Diamond' },
          ]}
        />
        <FilterToolbar.Select
          label="Filter by Year"
          paramName="year"
          options={[
            { value: 'all', label: 'All Years' },
            ...yearOptions.map((year) => ({
              value: year.toString(),
              label: year.toString(),
            })),
          ]}
        />
      </FilterToolbar> */}

      <Card>
        <CardHeader>
          <CardTitle>Available {badgeTypeLabel} Badges</CardTitle>
          <CardDescription>Badges you can earn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {allBadges.length > 0 ? (
              allBadges.map((badge) => {
                const earned = myBadges.some((ub) => ub.badge.id === badge.id);
                return <BadgeCard key={badge.id} badge={badge} earned={earned} />;
              })
            ) : (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No badges found matching your filters
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
