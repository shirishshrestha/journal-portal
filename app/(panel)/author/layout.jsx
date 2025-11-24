"use client";

import { RoleBasedRoute } from "@/features";

export default function AuthorLayout({ children }) {
  return <RoleBasedRoute allowedRoles={["AUTHOR"]}>{children}</RoleBasedRoute>;
}
