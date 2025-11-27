"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash,
  Send,
  FileCheck,
  CheckCircle,
  XCircle,
  Globe,
  Archive,
  Eye,
  User,
  Clock,
  MapPin,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/features/shared";

export function ActivityLogsTable({ logs, onViewDetails, isPending, error }) {
  const getActionIcon = (actionType) => {
    const icons = {
      LOGIN: <LogIn className="h-4 w-4" />,
      LOGOUT: <LogOut className="h-4 w-4" />,
      CREATE: <Plus className="h-4 w-4" />,
      UPDATE: <Edit className="h-4 w-4" />,
      DELETE: <Trash className="h-4 w-4" />,
      SUBMIT: <Send className="h-4 w-4" />,
      REVIEW: <FileCheck className="h-4 w-4" />,
      APPROVE: <CheckCircle className="h-4 w-4" />,
      REJECT: <XCircle className="h-4 w-4" />,
      PUBLISH: <Globe className="h-4 w-4" />,
      WITHDRAW: <Archive className="h-4 w-4" />,
      READ: <Eye className="h-4 w-4" />,
    };
    return icons[actionType] || <Activity className="h-4 w-4" />;
  };

  const getActionColor = (actionType) => {
    const colors = {
      CREATE: "default",
      SUBMIT: "default",
      APPROVE: "success",
      UPDATE: "secondary",
      REVIEW: "secondary",
      DELETE: "destructive",
      REJECT: "destructive",
      WITHDRAW: "destructive",
      LOGIN: "outline",
      LOGOUT: "outline",
      PUBLISH: "default",
      READ: "outline",
    };
    return colors[actionType] || "outline";
  };

  const getResourceColor = (resourceType) => {
    const colors = {
      USER: "default",
      PROFILE: "default",
      SUBMISSION: "secondary",
      DOCUMENT: "secondary",
      REVIEW: "outline",
      JOURNAL: "outline",
      PLAGIARISM_REPORT: "warning",
      FORMAT_CHECK: "warning",
    };
    return colors[resourceType] || "outline";
  };

  const columns = [
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <Badge variant={getActionColor(row.action_type)} className="gap-1">
          {getActionIcon(row.action_type)}
          {row.action_type_display || row.action_type}
        </Badge>
      ),
    },
    {
      key: "resource",
      header: "Resource",
      render: (row) => (
        <div className="space-y-1">
          <Badge
            variant={getResourceColor(row.resource_type)}
            className="text-xs"
          >
            {row.resource_type_display || row.resource_type}
          </Badge>
          {row.resource_id && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                {row.resource_id.length > 20
                  ? `${row.resource_id.slice(0, 20)}...`
                  : row.resource_id}
              </code>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (row) => (
        <div className="space-y-1">
          {row.user_email ? (
            <>
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium">{row.user_email}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {row.actor_type_display || row.actor_type}
              </Badge>
            </>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Activity className="h-3 w-3" />
              {row.actor_type_display || row.actor_type}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "timestamp",
      header: "Timestamp",
      render: (row) => {
        try {
          const date = new Date(row.created_at);
          if (isNaN(date.getTime())) {
            return (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                Unknown
              </div>
            );
          }
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {format(date, "PPp")}
              </div>
            </div>
          );
        } catch (err) {
          return (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              Invalid date
            </div>
          );
        }
      },
    },
    {
      key: "ip",
      header: "IP Address",
      render: (row) =>
        row.ip_address ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              {row.ip_address}
            </code>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">N/A</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row)}
          className=""
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={logs}
      columns={columns}
      emptyMessage="No activity logs found"
      isPending={isPending}
      error={error}
      errorMessage="Error loading activity logs"
      hoverable={true}
      tableClassName="bg-card border"
    />
  );
}
