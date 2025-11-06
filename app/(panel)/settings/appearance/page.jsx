"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AppearancePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Appearance settings coming soon...
        </p>
      </CardContent>
    </Card>
  );
}
