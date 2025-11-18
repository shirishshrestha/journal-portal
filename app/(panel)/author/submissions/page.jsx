"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/features";

export default function SubmissionsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to drafts page by default
    router.replace("/author/submissions/drafts");
  }, [router]);

  return <LoadingScreen />;
}
