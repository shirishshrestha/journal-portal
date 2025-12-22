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
    BEST_REVIEWER: 'bg-blue-100 text-blue-800 border-blue-300',
    RESEARCHER_OF_YEAR: 'bg-purple-100 text-purple-800 border-purple-300',
    TOP_CONTRIBUTOR: 'bg-green-100 text-green-800 border-green-300',
    EXCELLENCE_REVIEW: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    RISING_STAR: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    LIFETIME_ACHIEVEMENT: 'bg-red-100 text-red-800 border-red-300',
  };

  const hasCertificate = award.certificate_id !== null;

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
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
