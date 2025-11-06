"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your password and security preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Security settings coming soon...
        </p>
      </CardContent>
    </Card>
  );
}
