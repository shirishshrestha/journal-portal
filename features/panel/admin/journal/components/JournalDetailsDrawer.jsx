"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function JournalDetailsDrawer({ journal, isOpen, onClose }) {
  if (!journal) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-full max-w-xl">
        <DrawerHeader>
          <DrawerTitle>{journal?.title || "-"}</DrawerTitle>
          <DrawerDescription>{journal?.publisher || "-"}</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 px-4 pb-6 overflow-y-auto">
          {/* Status Badges */}
          <div className="flex gap-2">
            <Badge variant={journal?.is_active ? "default" : "outline"}>
              {journal?.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant={
                journal?.is_accepting_submissions ? "default" : "secondary"
              }
            >
              {journal?.is_accepting_submissions
                ? "Accepting Submissions"
                : "Not Accepting"}
            </Badge>
          </div>

          {/* Basic Information */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Short Name
                </p>
                <p className="text-sm font-mono">
                  {journal?.short_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Publisher
                </p>
                <p className="text-sm">{journal?.publisher || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Submission Count
                </p>
                <p className="text-2xl font-bold text-primary">
                  {journal?.submission_count ?? "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ISSNs */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  ISSN Print
                </p>
                <p className="text-sm font-mono">
                  {journal?.issn_print || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  ISSN Online
                </p>
                <p className="text-sm font-mono">
                  {journal?.issn_online || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Editor-in-Chief */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Editor-in-Chief
                </p>
                <p className="text-sm font-medium">
                  {journal?.editor_in_chief?.name || "-"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {journal?.editor_in_chief?.email || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </p>
                <p className="text-sm leading-relaxed">
                  {journal?.description || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Contact Email
                </p>
                <p className="text-sm">{journal?.contact_email || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Website
                </p>
                <a
                  href={journal?.website_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {journal?.website_url || "-"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Created At
                </p>
                <p className="text-sm">
                  {journal?.created_at
                    ? new Date(journal.created_at).toLocaleString()
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
