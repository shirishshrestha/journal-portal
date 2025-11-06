import React from "react";
import { Badge } from "@/components/ui/badge";

const verificationStatusConfig = {
  PENDING: {
    color: "bg-amber-100 dark:bg-amber-950/30",
    textColor: "text-amber-800 dark:text-amber-200",
    badgeColor: "bg-amber-600 dark:bg-amber-700",
    borderColor: " border-amber-200 dark:border-amber-900/50",
  },
  VERIFIED: {
    color: "bg-emerald-100 dark:bg-emerald-950/30",
    textColor: "text-emerald-800 dark:text-emerald-200",
    badgeColor: "bg-emerald-600 dark:bg-emerald-700",
    borderColor: "border-emerald-200 dark:border-emerald-900/50",
  },
  REJECTED: {
    color: "bg-red-100 dark:bg-red-950/30",
    textColor: "text-red-800 dark:text-red-200",
    badgeColor: "bg-red-600 dark:bg-red-700",
    borderColor: "border-red-200 dark:border-red-900/50",
  },
};

export default function VerificationStatusBadge({ status }) {
  console.log("status", status);
  const config =
    verificationStatusConfig[status] || verificationStatusConfig.PENDING;
  return (
    <div
      className={`p-4 rounded-lg border ${config.borderColor} ${config.color}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className={config.textColor}>
          <p className="font-medium">Verification Status</p>
          <p className="text-sm">
            {status === "PENDING" &&
              "Your verification is pending admin review"}
            {status === "VERIFIED" && "Your profile has been verified"}
            {status === "REJECTED" && "Your verification request was rejected"}
          </p>
        </div>
        <Badge className={config.badgeColor}>{status}</Badge>
      </div>
    </div>
  );
}
