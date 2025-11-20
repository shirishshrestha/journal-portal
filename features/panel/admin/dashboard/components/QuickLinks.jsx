"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  CheckCircle,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    title: "User Management",
    description: "Manage platform users",
    icon: Users,
    href: "/admin/users",
    color:
      "from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10",
    iconBg: "bg-blue-500/20 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Verification Requests",
    description: "Review submissions",
    icon: CheckCircle,
    href: "/admin/verification-requests",
    color:
      "from-amber-500/20 to-amber-600/20 dark:from-amber-500/10 dark:to-amber-600/10",
    iconBg: "bg-amber-500/20 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Journal Management",
    description: "Configure journals",
    icon: BookOpen,
    href: "/admin/journals",
    color:
      "from-purple-500/20 to-purple-600/20 dark:from-purple-500/10 dark:to-purple-600/10",
    iconBg: "bg-purple-500/20 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  // {
  //   title: "Reviews",
  //   description: "Manage reviews",
  //   icon: CheckCircle,
  //   href: "/admin/reviews",
  //   color:
  //     "from-green-500/20 to-green-600/20 dark:from-green-500/10 dark:to-green-600/10",
  //   iconBg: "bg-green-500/20 dark:bg-green-500/10",
  //   iconColor: "text-green-600 dark:text-green-400",
  // },
  {
    title: "Settings",
    description: "Platform settings",
    icon: Settings,
    href: "/settings/email-log",
    color:
      "from-slate-500/20 to-slate-600/20 dark:from-slate-500/10 dark:to-slate-600/10",
    iconBg: "bg-slate-500/20 dark:bg-slate-500/10",
    iconColor: "text-slate-600 dark:text-slate-400",
  },
];

export function QuickLinksPanel() {
  return (
    <Card className=" shadow-new  py-4 gap-3">
      <CardHeader className="border-b border-border/50 py-0! pb-2!">
        <CardTitle className="text-xl">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2 xl:space-y-0 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`group relative block overflow-hidden rounded-lg border border-border/50 p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md dark:hover:shadow-lg bg-linear-to-br ${link.color}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${link.iconBg}`}
                  >
                    <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {link.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {link.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
