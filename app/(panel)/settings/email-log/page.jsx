"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function EmailLogPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Log</CardTitle>
        <CardDescription>
          View history of all emails sent to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Email log feature coming soon...
        </p>
      </CardContent>
    </Card>
  );
}
