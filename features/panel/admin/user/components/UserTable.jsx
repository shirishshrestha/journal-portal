"use client";

import DataTable from "@/features/shared/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function UserTable({ users, onViewDetails, onEdit, onDelete }) {
  const getVerificationColor = (status) => {
    switch (status) {
      case "GENUINE":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100";
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.profile.avatar || ""} />
            <AvatarFallback className="bg-primary/20">
              {(
                row.profile.display_name || `${row.first_name} ${row.last_name}`
              )
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">
            {row.profile.display_name || `${row.first_name} ${row.last_name}`}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      cellClassName: "text-sm text-muted-foreground",
    },
    {
      key: "verification",
      header: "Verification",
      render: (row) => (
        <Badge
          className={getVerificationColor(row.profile.verification_status)}
          variant="secondary"
        >
          {row.profile.verification_status}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "default" : "outline"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (row) =>
        formatDistanceToNow(new Date(row.date_joined), { addSuffix: true }),
      cellClassName: "text-sm text-muted-foreground",
    },
    {
      key: "last_login",
      header: "Last Login",
      render: (row) =>
        row.last_login
          ? formatDistanceToNow(new Date(row.last_login), { addSuffix: true })
          : "Never",
      cellClassName: "text-sm text-muted-foreground",
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onViewDetails(row)}
              className="gap-2 group"
            >
              <Eye className="h-4 w-4 group-hover:text-primary-foreground" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(row)}
              className="gap-2 group"
            >
              <Edit2 className="h-4 w-4 group-hover:text-primary-foreground" />
              Edit Info
            </DropdownMenuItem>
            {row.is_active ? (
              <DropdownMenuItem
                onClick={() => onDelete(row.id)}
                className="gap-2 text-destructive group"
              >
                <Trash2 className="h-4 w-4 group-hover:text-primary-foreground" />
                Delete
              </DropdownMenuItem>
            ) : (
              <></>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      headerClassName: "w-12",
      cellClassName: "w-12",
      align: "right",
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      tableClassName="bg-card border flex justify-center"
    />
  );
}
