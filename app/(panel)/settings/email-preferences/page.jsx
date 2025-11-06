"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function EmailPreferencesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
          Manage your email notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-submission">New Submission</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new manuscript submissions
              </p>
            </div>
            <Switch id="new-submission" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="status-updates">Status Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when submission status changes
              </p>
            </div>
            <Switch id="status-updates" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="review-requests">Review Requests</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails for new review assignments
              </p>
            </div>
            <Switch id="review-requests" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="comments">Comments</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new comments and feedback
              </p>
            </div>
            <Switch id="comments" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newsletter">Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Receive periodic newsletters and updates
              </p>
            </div>
            <Switch id="newsletter" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
