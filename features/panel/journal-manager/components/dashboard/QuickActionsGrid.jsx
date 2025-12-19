'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export function QuickActionsGrid() {
  const quickLinks = [
    {
      title: 'Manage Editor-in-Chief',
      description: 'Assign or change editor-in-chief for journals',
      icon: UserCheck,
      href: '/journal-manager/staff-management/editor-in-chief',
      iconClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Staff Management',
      description: 'Add, remove, or modify staff member roles',
      icon: Users,
      href: '/journal-manager/staff-management/staff-members',
      iconClass: 'text-green-600 dark:text-green-400',
      bgClass: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Journal Settings',
      description: 'Configure journal settings and policies',
      icon: Settings,
      href: '/journal-manager/journals',
      iconClass: 'text-purple-600 dark:text-purple-400',
      bgClass: 'bg-purple-100 dark:bg-purple-950',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quickLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <Link key={index} href={link.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${link.bgClass}`}>
                    <Icon className={`h-6 w-6 ${link.iconClass}`} />
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
