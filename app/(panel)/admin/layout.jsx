"use client";

import { RoleBasedRoute } from "@/features";

export default function AdminLayout({ children }) {
  return <RoleBasedRoute allowedRoles={["ADMIN"]}>{children}</RoleBasedRoute>;
}
