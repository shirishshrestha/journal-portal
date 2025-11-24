"use client";

import { RoleBasedRoute } from "@/features";

export default function ReaderLayout({ children }) {
  return <RoleBasedRoute allowedRoles={["READER"]}>{children}</RoleBasedRoute>;
}
