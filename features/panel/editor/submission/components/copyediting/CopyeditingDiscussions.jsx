"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Reply, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DiscussionThreadDialog } from "./DiscussionThreadDialog";
import { AddDiscussionDialog } from "./AddDiscussionDialog";
import { useCopyeditingDiscussions } from "../../hooks";

/**
 * Component to display and manage copyediting discussions
 * Shows discussion threads between copyeditors, editors, and authors
 */
export function CopyeditingDiscussions({ assignmentId }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false);

  // Fetch discussions from API
  const {
    data: discussions = [],
    isLoading,
    error,
  } = useCopyeditingDiscussions(assignmentId);

  const handleViewThread = (discussion) => {
    setSelectedDiscussion(discussion);
    setIsThreadDialogOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: "bg-blue-100 text-blue-800 border-blue-200",
      RESOLVED: "bg-green-100 text-green-800 border-green-200",
      CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.OPEN;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Copyediting Discussions</CardTitle>
              <CardDescription>
                Communication threads between copyeditors, editors, and authors
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading discussions...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading discussions</p>
            </div>
          ) : discussions?.results?.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No discussions yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start a discussion to communicate with the copyeditor and author
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start First Discussion
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {discussions?.results?.map((discussion) => (
                <div
                  key={discussion.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3 cursor-pointer"
                  onClick={() => handleViewThread(discussion)}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <p className="font-medium flex-1">
                          {discussion.subject || "Untitled Discussion"}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs shrink-0 ${getStatusColor(
                            discussion.status || "OPEN"
                          )}`}
                        >
                          {discussion.status || "OPEN"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          From: {discussion.created_by?.user?.first_name}{" "}
                          {discussion.created_by?.user?.last_name}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <Reply className="h-3 w-3" />
                          {discussion.messages?.length || 0}{" "}
                          {(discussion.messages?.length || 0) === 1
                            ? "reply"
                            : "replies"}
                        </span>
                        {discussion.updated_at && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              Last reply:{" "}
                              {format(
                                new Date(discussion.updated_at),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </>
                        )}
                      </div>
                      {discussion.topic && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Topic: {discussion.topic_display || discussion.topic}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {discussions?.results?.length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
              <h4 className="font-medium text-sm mb-2">Discussion Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  Click on any discussion to view the full thread and reply
                </li>
                <li>
                  Use discussions to clarify queries instead of making direct
                  changes
                </li>
                <li>
                  Mark discussions as resolved once the issue is addressed
                </li>
                <li>
                  Tag specific participants to notify them about important
                  messages
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Discussion Dialog */}
      <AddDiscussionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        assignmentId={assignmentId}
      />

      {/* Discussion Thread Dialog */}
      {selectedDiscussion && (
        <DiscussionThreadDialog
          isOpen={isThreadDialogOpen}
          onClose={() => {
            setIsThreadDialogOpen(false);
            setSelectedDiscussion(null);
          }}
          discussion={selectedDiscussion}
          assignmentId={assignmentId}
        />
      )}
    </>
  );
}
