import React from "react";
import StatsCard from "@/features/shared/components/StatsCard";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Book,
} from "lucide-react";

/**
 * @param {Object} props
 * @param {Object} props.counts - Editor stats counts
 * @param {boolean} [props.isLoading] - Show loading skeletons
 */
export default function EditorDashboardStats({ counts, isLoading = false }) {
  const cards = [
    {
      icon: Clock,
      title: "Pending Submissions",
      value: counts?.pending_submissions ?? 0,
      iconClass: "text-amber-500",
    },
    {
      icon: CheckCircle,
      title: "Submissions Managed",
      value: counts?.submissions_managed ?? 0,
      iconClass: "text-green-500",
    },
    {
      icon: Book,
      title: " Total Journals",
      value: counts?.journals ?? 0,
      iconClass: "text-blue-500",
    },
    {
      icon: BookOpen,
      title: "Decisions Made",
      value: counts?.decisions_made ?? 0,
      iconClass: "text-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
      {cards.map((card) => (
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
