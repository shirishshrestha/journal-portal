"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Users } from "lucide-react";

export function AnomalySummaryCards({ anomalySummary }) {
  if (!anomalySummary) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Severity</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {anomalySummary.high_severity_count}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Require immediate attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medium Severity</CardTitle>
          <Shield className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {anomalySummary.medium_severity_count}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Need monitoring</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Severity</CardTitle>
          <Users className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {anomalySummary.low_severity_count}
          </div>
          <p className="text-xs text-muted-foreground mt-1">For review</p>
        </CardContent>
      </Card>
    </div>
  );
}
