'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard, useGetMyAnalytics } from '@/features';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function AssignmentsLayout({ children }) {
  const pathname = usePathname();

  const { data: analytics, isPending, error, refetch } = useGetMyAnalytics();
  const reviewerStats = analytics?.reviewer_stats || {};

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname.includes('/pending')) return 'pending';
    if (pathname.includes('/accepted')) return 'accepted';
    if (pathname.includes('/completed')) return 'completed';
    if (pathname.includes('/declined')) return 'declined';
    return 'overview';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Review Assignments</h1>
        <p className="text-muted-foreground">Manage your peer review invitations and assignments</p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4  md:grid-cols-4">
        {/* Stats Cards */}
        <StatsCard
          icon={Clock}
          title="Pending Invitations"
          value={reviewerStats.pending || 0}
          iconClass="text-yellow-500"
          valueClass="text-foreground"
          isLoading={isPending}
        />
        <StatsCard
          icon={CheckCircle2}
          title="Accepted Reviews"
          value={reviewerStats.accepted || 0}
          iconClass="text-blue-500"
          valueClass="text-foreground"
          isLoading={isPending}
        />
        <StatsCard
          icon={Clock}
          title="Completed Reviews"
          value={reviewerStats.completed || 0}
          iconClass="text-green-500"
          valueClass="text-foreground"
          isLoading={isPending}
        />
        <StatsCard
          icon={AlertCircle}
          title="Overdue Reviews"
          value={reviewerStats.overdue || 0}
          iconClass="text-red-500"
          valueClass="text-foreground"
          isLoading={isPending}
        />
      </div>

      {/* Navigation Tabs */}
      <Tabs value={getActiveTab()} className="w-full h-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-full">
          <Link href="/reviewer/assignments">
            <TabsTrigger className="w-full" value="overview">
              Overview
            </TabsTrigger>
          </Link>
          <Link href="/reviewer/assignments/pending">
            <TabsTrigger className="w-full" value="pending">
              Pending ({isPending ? '...' : reviewerStats.pending})
            </TabsTrigger>
          </Link>
          <Link href="/reviewer/assignments/accepted">
            <TabsTrigger className="w-full" value="accepted">
              Accepted ({isPending ? '...' : reviewerStats.accepted})
            </TabsTrigger>
          </Link>
          <Link href="/reviewer/assignments/completed">
            <TabsTrigger className="w-full" value="completed">
              Completed ({isPending ? '...' : reviewerStats.completed})
            </TabsTrigger>
          </Link>
          <Link href="/reviewer/assignments/declined">
            <TabsTrigger className="w-full" value="declined">
              Declined ({isPending ? '...' : reviewerStats.declined})
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {/* Page Content */}
      {children}
    </div>
  );
}
