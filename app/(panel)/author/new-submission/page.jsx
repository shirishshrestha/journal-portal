"use client";
import { NewSubmissionForm, RoleBasedRoute } from "@/features";
export default function NewSubmissionPage() {
  return (
    <RoleBasedRoute allowedRoles={["AUTHOR"]}>
      <NewSubmissionForm />
    </RoleBasedRoute>
  );
}