"use client";

import {
  ProfileCompletionCard,
  ProfileLinksCard,
  ScoreCard,
  useGetUserScoreStatus,
} from "@/features/panel";
import { Loader2 } from "lucide-react";

export default function ReaderDashboard() {
  const { data: scoreData, isLoading: isLoadingScore } =
    useGetUserScoreStatus();

  const userDatas = {
    links: {
      googleScholar: "https://scholar.google.com/citations?user=...",
      researchGate: "https://www.researchgate.net/profile/...",
    },
  };

  // Calculate completion percentage from score breakdown
  const scoreBreakdown = scoreData?.latest_request?.score_breakdown || [];
  const completedItems = scoreBreakdown.filter(
    (item) => item.status === "completed"
  ).length;
  const completionPercentage =
    scoreBreakdown.length > 0
      ? (completedItems / scoreBreakdown.length) * 100
      : 0;

  return (
    <div className=" mx-auto space-y-5">
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
      <div>
        <div className="lg:col-span-2">
          <ProfileCompletionCard completionPercentage={completionPercentage} />
        </div>
        {/* <div>
          <ProfileLinksCard links={userDatas.links} />
        </div> */}
      </div>

      {isLoadingScore ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">
            Loading score data...
          </span>
        </div>
      ) : (
        <ScoreCard scoreData={scoreData} />
      )}
    </div>
  );
}
