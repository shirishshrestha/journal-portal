"use client";

import { RoleBasedRoute } from "@/features";

export default function EditorLayout({ children }) {
  return <RoleBasedRoute allowedRoles={["EDITOR"]}>{children}</RoleBasedRoute>;
}
