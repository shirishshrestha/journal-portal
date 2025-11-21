import React from "react";
import StatsCard from "@/features/shared/components/StatsCard";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { StatsErrorCard } from "@/features/shared";

/**
 * @param {Object} props
 * @param {Object} props.counts - Stats counts
 * @param {boolean} [props.isLoading] - Show loading skeletons
 */
export default function AuthorDashboardStats({
  counts,
  isLoading = false,
  isError = false,
  error,
}) {
  const cards = [
    {
      icon: FileText,
      title: "Draft Submissions",
      value: counts?.draft,
      iconClass: "text-gray-500",
    },
    {
      icon: Clock,
      title: "Under Review",
      value: counts?.underReview ?? counts?.under_review,
      iconClass: "text-blue-500",
    },
    {
      icon: CheckCircle,
      title: "Accepted",
      value: counts?.accepted,
      iconClass: "text-green-500",
    },
    {
      icon: XCircle,
      title: "Rejected",
      value: counts?.rejected,
      iconClass: "text-red-500",
    },

    {
      icon: Clock,
      title: "Pending",
      value: counts?.pending,
      iconClass: "text-yellow-500",
    },
  ];

  if (isError) {
    return (
      <StatsErrorCard
        title="Failed to load author stats"
        message={error?.message || "Unknown error"}
      />
    );
  } 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 ">
      {cards.map((card, i) => (
        <StatsCard
          key={card.title}
          icon={card.icon}
          title={card.title}
          value={card.value}
          iconClass={card.iconClass}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
