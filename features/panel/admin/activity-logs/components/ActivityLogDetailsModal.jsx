"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  User,
  Clock,
  MapPin,
  Globe,
  Activity,
  FileJson,
  Hash,
} from "lucide-react";

export function ActivityLogDetailsModal({ log, open, onOpenChange }) {
  if (!log) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return format(date, "PPpp");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this system event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Log ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  {log.id}
                </code>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Timestamp</p>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3 w-3" />
                  {formatDate(log.created_at)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Action Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Action Type</p>
                <Badge variant="default">
                  {log.action_type_display || log.action_type}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Actor Type</p>
                <Badge variant="secondary">
                  {log.actor_type_display || log.actor_type}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resource Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resource Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Resource Type</p>
                <Badge variant="outline">
                  {log.resource_type_display || log.resource_type}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Resource ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                  {log.resource_id}
                </code>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">User Information</h3>
            <div className="grid grid-cols-1 gap-4">
              {log.user_email ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">User Email</p>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      <span className="text-sm">{log.user_email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      {log.user_id}
                    </code>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No user associated (System action)
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Request Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Request Information</h3>
            <div className="space-y-4">
              {log.ip_address && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {log.ip_address}
                    </code>
                  </div>
                </div>
              )}
              {log.user_agent && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User Agent</p>
                  <div className="flex items-start gap-1.5">
                    <Globe className="h-3 w-3 mt-1" />
                    <code className="text-xs bg-muted px-2 py-1 rounded block break-all flex-1">
                      {log.user_agent}
                    </code>
                  </div>
                </div>
              )}
              {log.session_id && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Session ID</p>
                  <div className="flex items-center gap-1.5">
                    <Hash className="h-3 w-3" />
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {log.session_id}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <FileJson className="h-4 w-4" />
                  Metadata
                </h3>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
