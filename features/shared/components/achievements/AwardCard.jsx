import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Trophy, Download, FileCheck } from 'lucide-react';
import { format } from 'date-fns';

/**
 * AwardCard Component - Displays a single award with details
 */
export const AwardCard = ({ award, onGenerateCertificate }) => {
  const awardTypeColors = {
    BEST_REVIEWER:
      'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800',
    RESEARCHER_OF_YEAR:
      'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800',
    TOP_CONTRIBUTOR:
      'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-300 dark:border-green-800',
    EXCELLENCE_REVIEW:
      'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800',
    RISING_STAR:
      'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800',
    LIFETIME_ACHIEVEMENT:
      'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800',
  };

  const hasCertificate = award.certificate_generated || award.certificate_url;

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              {award.title}
            </CardTitle>
            <CardDescription className="mt-2">{award.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={awardTypeColors[award.award_type]}>
            <Award className="w-3 h-3 mr-1" />
            {award.award_type.replace(/_/g, ' ')}
          </Badge>
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            {award.year}
          </Badge>
        </div>

        {award.journal && (
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Journal: </span>
            <span>{award.journal.title}</span>
          </div>
        )}

        {award.discipline && (
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Discipline: </span>
            <span>{award.discipline}</span>
          </div>
        )}

        {award.country && (
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Country: </span>
            <span>{award.country}</span>
          </div>
        )}

        {onGenerateCertificate && (
          <div className="pt-2">
            {hasCertificate ? (
              <Button variant="outline" size="sm" className="w-full" disabled>
                <FileCheck className="w-4 h-4 mr-2" />
                Certificate Generated
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => onGenerateCertificate(award.id)}
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Certificate
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * AwardGrid Component - Displays a grid of awards
 */
export const AwardGrid = ({ awards = [], onGenerateCertificate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {awards.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No awards yet</p>
        </div>
      ) : (
        awards.map((award) => (
          <AwardCard key={award.id} award={award} onGenerateCertificate={onGenerateCertificate} />
        ))
      )}
    </div>
  );
};
