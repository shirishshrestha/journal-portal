import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { FilterToolbar } from '@/features';
import { AwardCard } from './AwardCard';

export default function AwardsTab({
  awards,
  yearOptions,
  awardTypeOptions,
  onGenerateCertificate,
}) {
  return (
    <div className="space-y-6">
      {/* Award Filters using FilterToolbar */}
      <FilterToolbar>
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
        <FilterToolbar.Select
          label="Filter by Type"
          paramName="award_type"
          options={awardTypeOptions}
        />
      </FilterToolbar>

      {awards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="w-12 h-12 mb-3 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground">No awards received yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {awards.map((award) => (
            <AwardCard key={award.id} award={award} onGenerateCertificate={onGenerateCertificate} />
          ))}
        </div>
      )}
    </div>
  );
}
