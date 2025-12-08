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
  Files,
  FilePlus2Icon,
  File,
  Inbox,
  Book,
  AlertTriangle,
  Bug,
  LogsIcon,
  BookCheck,
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
      path: "/profile",
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
      icon: Inbox,
      children: [
        {
          name: "Submissions",
          path: "/author/submissions/drafts",
          icon: Files,
        },
        {
          name: "New Submission",
          path: "/author/new-submission",
          icon: FilePlus2Icon,
        },
      ],
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
      name: "Journal",
      path: "/editor/journals",
      icon: Book,
    },
    {
      name: "Assigned Journals",
      path: "/editor/my-journals",
      icon: BookCheck,
    },
    {
      name: "Verification Requests",
      path: "/editor/verification-requests",
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
      name: "Journals",
      path: "/admin/journals",
      icon: BookOpen,
    },
    {
      name: "Anomaly Detection",
      path: "/admin/anomaly-detection",
      icon: AlertTriangle,
    },
    {
      name: "Error Logs",
      path: "/admin/error-logs",
      icon: Bug,
    },
    {
      name: "Activity Logs",
      path: "/admin/activity-logs",
      icon: LogsIcon,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      children: [
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
};
