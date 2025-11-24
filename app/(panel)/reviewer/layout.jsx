"use client";

import { RoleBasedRoute } from "@/features";

export default function ReviewerLayout({ children }) {
  return (
    <RoleBasedRoute allowedRoles={["REVIEWER"]}>{children}</RoleBasedRoute>
  );
}
