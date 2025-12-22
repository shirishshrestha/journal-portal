import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Award, Star } from 'lucide-react';
import { format } from 'date-fns';

/**
 * BadgeCard Component - Displays a single badge with details
 */
export const BadgeCard = ({ badge, earned, earnedAt, isFeatured }) => {
  const badgeTypeColors = {
    REVIEWER: 'bg-blue-100 text-blue-800 border-blue-300',
    AUTHOR: 'bg-green-100 text-green-800 border-green-300',
    EDITOR: 'bg-purple-100 text-purple-800 border-purple-300',
    CONTRIBUTOR: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  const levelColors = {
    BRONZE: 'bg-amber-700 text-white',
    SILVER: 'bg-gray-400 text-gray-900',
    GOLD: 'bg-yellow-500 text-gray-900',
    PLATINUM: 'bg-slate-700 text-white',
  };

  console.log('BadgeCard props:', { badge, earned, earnedAt, isFeatured });

  return (
    <Card
      className={`relative transition-all hover:shadow-lg ${
        isFeatured ? 'ring-2 ring-yellow-400' : ''
      } ${!earned ? 'opacity-60' : ''}`}
    >
      {isFeatured && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-yellow-500 text-yellow-900">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {badge.name}
            </CardTitle>
            {badge.level && (
              <Badge className={`mt-2 ${levelColors[badge.level]}`}>{badge.level}</Badge>
            )}
          </div>
        </div>
        <CardDescription>{badge.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={badgeTypeColors[badge.badge_type]}>
            {badge.badge_type.replace('_', ' ')}
          </Badge>
        </div>

        {badge.criteria && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Criteria:</p>
            <div className="space-y-1">
              {Object.entries(badge.criteria).map(([key, value]) => (
                <p key={key}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value}
                </p>
              ))}
            </div>
          </div>
        )}

        {earnedAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <Calendar className="w-4 h-4" />
            <span>Earned: {format(new Date(earnedAt), 'MMM dd, yyyy')}</span>
          </div>
        )}

        {!earned && (
          <div className="text-sm text-muted-foreground pt-2 border-t">
            <p className="font-medium text-gray-900">Not yet earned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * BadgeGrid Component - Displays a grid of badges
 */
export const BadgeGrid = ({ badges = [], userBadges = [] }) => {

    console.log('BadgeGrid props:', { badges, userBadges });
  // Create a map of earned badges for quick lookup
  const earnedBadgesMap = userBadges.reduce((acc, userBadge) => {
    acc[userBadge.badge.id] = {
      earnedAt: userBadge.earned_at,
      isFeatured: userBadge.is_featured,
    };
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No badges available</p>
        </div>
      ) : (
        badges.map((badge) => {
          const earnedInfo = earnedBadgesMap[badge.id];
          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={!!earnedInfo}
              earnedAt={earnedInfo?.earnedAt}
              isFeatured={earnedInfo?.isFeatured}
            />
          );
        })
      )}
    </div>
  );
};
