"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, FileText, UserX, Clock, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Drafts",
    href: "/author/submissions/drafts",
    icon: FileText,
  },
  {
    label: "Unassigned",
    href: "/author/submissions/unassigned",
    icon: UserX,
  },
  {
    label: "Active",
    href: "/author/submissions/active",
    icon: Clock,
  },
  {
    label: "Archived",
    href: "/author/submissions/archived",
    icon: Archive,
  },
];

export default function SubmissionsLayout({ children, title, description, counts = {} }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button
          onClick={() => router.push("/author/new-submission/")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Submission
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const count = counts[item.label.toLowerCase()];

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
