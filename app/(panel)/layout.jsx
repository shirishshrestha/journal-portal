"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedRoute } from "@/features";
import { useSelector } from "react-redux";
import { UnifiedSidebar } from "@/features/shared/components/UnifiedSidebar";
import { UnifiedAppbar } from "@/features/shared/components/UnifiedAppbar";
import {
  LayoutDashboard,
  User,
  CheckCircle,
  Settings,
  FileText,
  UserCheck,
  Users,
  BookOpen,
  BarChart,
} from "lucide-react";

// Sidebar configuration for each role
const sidebarConfig = {
  READER: [
    {
      name: "Overview",
      path: "/reader/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Profile", path: "/reader/profile", icon: User },
    {
      name: "Verification",
      path: "/reader/verification",
      icon: CheckCircle,
    },
    {
      name: "Settings",
      path: "/settings/email-preferences",
      icon: Settings,
    },
  ],
  AUTHOR: [
    {
      name: "Overview",
      path: "/author/overview",
      icon: LayoutDashboard,
    },
    {
      name: "Submissions",
      path: "/author/submissions",
      icon: FileText,
    },
    { name: "Profile", path: "/author/profile", icon: User },
    {
      name: "Settings",
      path: "/settings/email-preferences",
      icon: Settings,
    },
  ],
  REVIEWER: [
    {
      name: "Overview",
      path: "/reviewer/overview",
      icon: LayoutDashboard,
    },
    {
      name: "Assignments",
      path: "/reviewer/assignments",
      icon: UserCheck,
    },
    { name: "Profile", path: "/reviewer/profile", icon: User },
    {
      name: "Settings",
      path: "/settings/email-preferences",
      icon: Settings,
    },
  ],
  EDITOR: [
    {
      name: "Overview",
      path: "/editor/overview",
      icon: LayoutDashboard,
    },
    {
      name: "Manuscripts",
      path: "/editor/manuscripts",
      icon: BookOpen,
    },
    {
      name: "Reviewers",
      path: "/editor/reviewers",
      icon: Users,
    },
    { name: "Profile", path: "/editor/profile", icon: User },
    {
      name: "Settings",
      path: "/settings/email-preferences",
      icon: Settings,
    },
  ],
  ADMIN: [
    {
      name: "Overview",
      path: "/admin/overview",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart,
    },
    {
      name: "Settings",
      path: "/settings/email-preferences",
      icon: Settings,
    },
  ],
};

export default function PanelLayout({ children }) {
  const userData = useSelector((state) => state.auth?.userData);

  // Get the primary role (first role in the array)
  const userRole = userData?.roles?.[0] || "READER";
  const userName = userData
    ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "User"
    : "User";
  const userAvatar = userData?.avatar || null;

  // Get menu items for the current role
  const menuItems = sidebarConfig[userRole] || sidebarConfig.READER;

  // Allowed roles - user can access if they have any role
  const allowedRoles = ["READER", "AUTHOR", "REVIEWER", "EDITOR", "ADMIN"];

  return (
    <RoleBasedRoute allowedRoles={allowedRoles}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <UnifiedSidebar
            menuItems={menuItems}
            userRole={userRole}
            userName={userName}
            userAvatar={userAvatar}
          />
          <div className="flex-1 pt-3 flex flex-col overflow-auto px-2">
            <UnifiedAppbar
              userRole={userRole}
              userName={userName}
              userAvatar={userAvatar}
              roles={userData?.roles || []}
              userDetails={userData}
            />
            <main className="flex-1 p-5 px-0">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </RoleBasedRoute>
  );
}
