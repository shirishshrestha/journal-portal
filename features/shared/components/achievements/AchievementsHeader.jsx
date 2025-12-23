import React from 'react';
import { Trophy } from 'lucide-react';

export default function AchievementsHeader({ title, description }) {
  return (
    <div>
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-500" />
        {title}
      </h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
