"use client";

import { ChangePassword, VerifyEmail } from "@/features";

export default function AccountTab() {
  return (
    <div className="space-y-6">
      <VerifyEmail />
      <ChangePassword />
    </div>
  );
}
