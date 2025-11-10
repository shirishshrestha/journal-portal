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
  Mail,
  Shield,
  Palette,
} from "lucide-react";

// Sidebar configuration for each role
export const sidebarConfig = {
  READER: [
    {
      name: "Overview",
      path: "/reader/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Profile",
      path: "/reader/profile",
      icon: User,
    },
    {
      name: "Verification",
      path: "/reader/verification",
      icon: CheckCircle,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      children: [
        {
          name: "Email Preferences",
          path: "/settings/email-preferences",
          icon: Mail,
        },
        {
          name: "Email Logs",
          path: "/settings/email-log",
          icon: FileText,
        },
        {
          name: "Account",
          path: "/settings/account",
          icon: User,
        },
        {
          name: "Appearance",
          path: "/settings/appearance",
          icon: Palette,
        },
      ],
    },
  ],
  AUTHOR: [
    {
      name: "Overview",
      path: "/author/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Submissions",
      path: "/author/submissions",
      icon: FileText,
    },
    {
      name: "Profile",
      path: "/author/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      children: [
        {
          name: "Email Preferences",
          path: "/settings/email-preferences",
          icon: Mail,
        },
        {
          name: "Email Logs",
          path: "/settings/email-log",
          icon: FileText,
        },
        {
          name: "Account",
          path: "/settings/account",
          icon: User,
        },
        {
          name: "Appearance",
          path: "/settings/appearance",
          icon: Palette,
        },
      ],
    },
  ],
  REVIEWER: [
    {
      name: "Overview",
      path: "/reviewer/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Assignments",
      path: "/reviewer/assignments",
      icon: UserCheck,
    },
    {
      name: "Profile",
      path: "/reviewer/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      children: [
        {
          name: "Email Preferences",
          path: "/settings/email-preferences",
          icon: Mail,
        },
        {
          name: "Email Logs",
          path: "/settings/email-log",
          icon: FileText,
        },
        {
          name: "Account",
          path: "/settings/account",
          icon: User,
        },
        {
          name: "Appearance",
          path: "/settings/appearance",
          icon: Palette,
        },
      ],
    },
  ],
  EDITOR: [
    {
      name: "Overview",
      path: "/editor/dashboard",
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
    {
      name: "Profile",
      path: "/editor/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      children: [
        {
          name: "Email Preferences",
          path: "/settings/email-preferences",
          icon: Mail,
        },
        {
          name: "Email Logs",
          path: "/settings/email-log",
          icon: FileText,
        },
        {
          name: "Account",
          path: "/settings/account",
          icon: User,
        },
        {
          name: "Appearance",
          path: "/settings/appearance",
          icon: Palette,
        },
      ],
    },
  ],
  ADMIN: [
    {
      name: "Overview",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
      children: [
        {
          name: "User Management",
          path: "/admin/users",
          icon: Users,
        },
        {
          name: "Verification Requests",
          path: "/admin/verification-requests",
          icon: CheckCircle,
        },
      ],
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      children: [
        {
          name: "Email Preferences",
          path: "/settings/email-preferences",
          icon: Mail,
        },
        {
          name: "Email Logs",
          path: "/settings/email-log",
          icon: FileText,
        },
        {
          name: "Account",
          path: "/settings/account",
          icon: User,
        },
        {
          name: "Appearance",
          path: "/settings/appearance",
          icon: Palette,
        },
        {
          name: "Security",
          path: "/settings/security",
          icon: Shield,
        },
      ],
    },
  ],
};
