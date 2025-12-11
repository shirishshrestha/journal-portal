"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  MessageSquare,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { AddProductionDiscussionDialog } from "./AddProductionDiscussionDialog";
import DataTable from "@/features/shared/components/DataTable";
import {
  useProductionDiscussions,
  useProductionAssignments,
} from "../../hooks";

export function ProductionDiscussions({ submissionId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get the production assignment for this submission
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useProductionAssignments({ submission: submissionId });

  const assignment = assignmentsData?.results?.[0];
  const assignmentId = assignment?.id;

  // Fetch discussions from API
  const {
    data: discussionsData,
    isLoading: discussionsLoading,
    error,
  } = useProductionDiscussions(
    { submission: submissionId },
    { enabled: !!submissionId }
  );

  const discussions = discussionsData?.results || [];
  const isLoading = assignmentsLoading || discussionsLoading;

  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "subject",
      header: "Name",
      cellClassName: "font-medium",
      render: (row) => (
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-xs">
            {row.subject || "Untitled Discussion"}
          </span>
        </div>
      ),
    },
    {
      key: "created_by",
      header: "From",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.created_by?.user?.first_name} {row.created_by?.user?.last_name}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Last Reply",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.updated_at
            ? format(new Date(row.updated_at), "MMM d, yyyy")
            : "No replies"}
        </span>
      ),
    },
    {
      key: "messages",
      header: "Replies",
      align: "center",
      render: (row) => (
        <Badge variant="secondary">{row.messages?.length || 0}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (row) => (
        <Badge variant={row.status === "CLOSED" ? "secondary" : "default"}>
          {row.status_display || row.status}
        </Badge>
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
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDiscussion(row.id);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const handleOpenDiscussion = (discussionId) => {
    // Navigate to discussion detail or open modal
    console.log("Open discussion:", discussionId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Production Discussions</CardTitle>
              <CardDescription className="mt-1">
                Communicate with production assistants about the manuscript
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Discussion
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <DataTable
            data={filteredDiscussions}
            columns={columns}
            emptyMessage={
              searchQuery
                ? "No discussions match your search criteria."
                : "No discussions yet. Start a discussion to communicate with production assistants about this manuscript."
            }
            isPending={isLoading}
            hoverable={true}
            tableClassName="bg-card border flex justify-center"
          />
        </CardContent>
      </Card>
      <AddProductionDiscussionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        assignmentId={assignmentId}
        submissionId={submissionId}
      />
    </>
  );
}
