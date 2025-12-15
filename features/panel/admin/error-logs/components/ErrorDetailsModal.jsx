"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

export function ErrorDetailsModal({ issue, open, onOpenChange }) {
  if (!issue) return null;

  const getLevelIcon = (level) => {
    const icons = {
      error: <AlertCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      fatal: <XCircle className="h-4 w-4" />,
    };
    return icons[level] || <AlertCircle className="h-4 w-4" />;
  };

  const getLevelColor = (level) => {
    const colors = {
      error: "destructive",
      warning: "warning",
      info: "default",
      fatal: "destructive",
    };
    return colors[level] || "default";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{issue.title}</DialogTitle>
          <DialogDescription>
            Detailed information about this error
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] overflow-auto">
          <div className="space-y-6 pr-4">
            {/* Level & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getLevelColor(issue.level)} className="gap-1">
                {getLevelIcon(issue.level)}
                {issue.level.toUpperCase()}
              </Badge>
              {issue.short_id && (
                <Badge variant="outline" className="font-mono">
                  {issue.short_id}
                </Badge>
              )}
              {(issue.metadata?.type || issue.type) && (
                <Badge variant="outline" className="font-mono">
                  {issue.metadata?.type || issue.type}
                </Badge>
              )}
              <Badge
                variant={issue.status === "resolved" ? "default" : "secondary"}
              >
                {issue.status}
              </Badge>
            </div>

            <Separator />

            {/* Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span>
                  <p className="text-muted-foreground">
                    {issue.metadata?.type || issue.type || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-muted-foreground">
                    {issue.status || "unknown"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Event Count:</span>
                  <p className="text-muted-foreground">{issue.count || 0}</p>
                </div>
                <div>
                  <span className="font-medium">Users Affected:</span>
                  <p className="text-muted-foreground">
                    {issue.user_count || issue.userCount || "N/A"}
                  </p>
                </div>
                {issue.culprit && (
                  <div className="col-span-2">
                    <span className="font-medium">Location:</span>
                    <code className="block mt-1 bg-muted px-3 py-2 rounded text-xs">
                      {issue.culprit}
                    </code>
                  </div>
                )}
                {issue.metadata?.filename && (
                  <div className="col-span-2">
                    <span className="font-medium">Filename:</span>
                    <code className="block mt-1 bg-muted px-3 py-2 rounded text-xs break-all">
                      {issue.metadata.filename}
                    </code>
                  </div>
                )}
                {issue.metadata?.function && (
                  <div className="col-span-2">
                    <span className="font-medium">Function:</span>
                    <code className="block mt-1 bg-muted px-3 py-2 rounded text-xs">
                      {issue.metadata.function}
                    </code>
                  </div>
                )}
                {issue.project && (
                  <div className="col-span-2">
                    <span className="font-medium">Project:</span>
                    <p className="text-muted-foreground mt-1">
                      {issue.project.name} ({issue.project.platform})
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">First Seen:</span>
                  <span className="text-muted-foreground">
                    {format(
                      new Date(issue.first_seen || issue.firstSeen),
                      "PPpp"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Last Seen:</span>
                  <span className="text-muted-foreground">
                    {format(
                      new Date(issue.last_seen || issue.lastSeen),
                      "PPpp"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Message */}
            {issue.metadata?.value && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Error Message</h3>
                  <div className="bg-muted p-4 rounded-lg text-sm font-mono">
                    {issue.metadata.value}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Tags */}
            {issue.tags && issue.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {issue.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.key}: {tag.value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <Button asChild size={"sm"} className="gap-2">
                <a
                  href={issue.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full Details in Sentry
                </a>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
