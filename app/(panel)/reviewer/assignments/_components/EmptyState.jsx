"use client";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
