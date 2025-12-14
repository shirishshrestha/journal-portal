"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, FileText, User as UserIcon, Lock, Palette } from "lucide-react";

const settingsNav = [
  {
    name: "Email Preferences",
    path: "/settings/email-preferences",
    icon: Mail,
  },
  {
    name: "Email Log",
    path: "/settings/email-log",
    icon: FileText,
  },
  {
    name: "Account",
    path: "/settings/account",
    icon: UserIcon,
  },

  {
    name: "Appearance",
    path: "/settings/appearance",
    icon: Palette,
  },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Settings Navigation */}
        <Card className="py-4">
          <CardContent className="px-4">
            <nav className="space-y-1 grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden lg:w-fit lg:flex  ">
              {settingsNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 m-0 border-r last:border-r-0 border-border transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="">{children}</div>
      </div>
    </div>
  );
}
