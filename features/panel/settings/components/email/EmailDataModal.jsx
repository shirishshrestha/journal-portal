"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

export default function EmailDetailModal({ email, open, onOpenChange }) {
  if (!email) return null;

  const displayDate = email.sent_at
    ? new Date(email.sent_at)
    : new Date(email.created_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{email.subject}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {format(displayDate, "MMMM dd, yyyy 'at' HH:mm:ss")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Recipient
              </p>
              <p className="text-sm text-foreground">{email.recipient}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Template Type
              </p>
              <p className="text-sm text-foreground">
                {email.template_type.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Status
              </p>
              <Badge className="w-fit">{email.status_display}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Retry Count
              </p>
              <p className="text-sm text-foreground">{email.retry_count}</p>
            </div>
          </div>

          {email.status === "FAILED" && email.error_message && (
            <div className="border-l-4 border-red-500 bg-red-500/10 p-4 rounded">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Error Message
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {email.error_message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Email ID
            </p>
            <p className="font-mono text-xs text-muted-foreground break-all">
              {email.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
