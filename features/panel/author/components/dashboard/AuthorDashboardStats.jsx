import React from "react";
import StatsCard from "@/features/shared/components/StatsCard";
import { FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function AuthorDashboardStats({ counts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
      <StatsCard
        icon={FileText}
        title="Draft Submissions"
        value={counts.draft}
        iconClass="text-gray-500"
      />
      <StatsCard
        icon={Clock}
        title="Under Review"
        value={counts.underReview}
        iconClass="text-blue-500"
      />
      <StatsCard
        icon={AlertCircle}
        title="Revision Required"
        value={counts.revisionRequired}
        iconClass="text-amber-500"
      />
      <StatsCard
        icon={CheckCircle}
        title="Accepted"
        value={counts.accepted}
        iconClass="text-green-500"
      />
    </div>
  );
}
