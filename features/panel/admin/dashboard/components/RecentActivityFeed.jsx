"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, UserPlus, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    type: "submission",
    title: "New submission created",
    description:
      'Dr. Sarah Chen submitted "Neural Networks in Quantum Computing"',
    timestamp: "2 hours ago",
    icon: FileText,
    user: "SC",
    status: "new",
  },
  {
    id: 2,
    type: "review",
    title: "Review completed",
    description: "Prof. James Wilson completed peer review for Nature Science",
    timestamp: "4 hours ago",
    icon: CheckCircle,
    user: "JW",
    status: "completed",
  },
  {
    id: 3,
    type: "user",
    title: "New user registered",
    description: "Dr. Emma Martinez joined the platform as Researcher",
    timestamp: "6 hours ago",
    icon: UserPlus,
    user: "EM",
    status: "new",
  },
  {
    id: 4,
    type: "milestone",
    title: "Submission accepted",
    description: "Paper accepted for publication in Nature Science",
    timestamp: "1 day ago",
    icon: TrendingUp,
    user: "SYS",
    status: "success",
  },
];

const statusConfig = {
  new: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    badge: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
  },
  completed: {
    bg: "bg-green-500/10 dark:bg-green-500/20",
    badge: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  },
  success: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    badge:
      "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100",
  },
};

export function RecentActivityFeed() {
  return (
    <Card className="shadow-new py-4 gap-3">
      <CardHeader className="border-b border-border/50 py-0! pb-2! ">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            Last 24 hours
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {activities.map((activity, index) => {
            const config = statusConfig[activity.status] || statusConfig.new;
            return (
              <div
                key={activity.id}
                className="group relative flex gap-4 border-l-2 border-transparent p-4 transition-all  hover:bg-muted/50 dark:hover:bg-muted/30"
              >
                {/* User Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-sm ${config.bg}`}
                >
                  {activity.user}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {activity.title}
                    </p>
                    <Badge
                      className={`shrink-0 text-xs ${config.badge}`}
                      variant="secondary"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${config.bg}`}
                >
                  <activity.icon className="h-4 w-4 text-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
