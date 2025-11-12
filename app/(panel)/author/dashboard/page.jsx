"use client";

import { Button } from "@/components/ui/button";
import { AuthorDashboardStats, AuthorDashboardTable } from "@/features";
import { Plus } from "lucide-react";
import Link from "next/link";

// Mock data for submissions
const MOCK_SUBMISSIONS = {
  count: 5,
  results: [
    {
      id: "1",
      title: "AI-Assisted Peer Review",
      journal_name: "Journal of Computational Science",
      corresponding_author_name: "Dr. Maya Singh",
      status: "DRAFT",
      status_display: "Draft",
      submission_number: "SUB-001",
      document_count: "2",
      created_at: "2025-11-01T10:00:00Z",
      submitted_at: "2025-11-02T12:00:00Z",
      updated_at: "2025-11-05T14:30:00Z",
    },
    {
      id: "2",
      title: "Quantum Error Correction Advances",
      journal_name: "Physics Letters A",
      corresponding_author_name: "Prof. Rajesh Thapa",
      status: "UNDER_REVIEW",
      status_display: "Under Review",
      submission_number: "SUB-002",
      document_count: "3",
      created_at: "2025-10-20T09:15:00Z",
      submitted_at: "2025-10-21T08:45:00Z",
      updated_at: "2025-11-04T11:00:00Z",
    },
    {
      id: "3",
      title: "Blockchain in Academic Publishing",
      journal_name: "Open Access Tech Journal",
      corresponding_author_name: "Sita Bhandari",
      status: "REVISION_REQUIRED",
      status_display: "Revision Required",
      submission_number: "SUB-003",
      document_count: "1",
      created_at: "2025-09-15T07:30:00Z",
      submitted_at: "2025-09-17T09:00:00Z",
      updated_at: "2025-11-03T10:20:00Z",
    },
    {
      id: "4",
      title: "Deep Learning for Bioinformatics",
      journal_name: "BioData Journal",
      corresponding_author_name: "Dr. Anish Shrestha",
      status: "ACCEPTED",
      status_display: "Accepted",
      submission_number: "SUB-004",
      document_count: "4",
      created_at: "2025-08-01T12:00:00Z",
      submitted_at: "2025-08-05T14:00:00Z",
      updated_at: "2025-10-10T09:45:00Z",
    },
  ],
};

// Calculate counts by status
const getStatusCounts = () => {
  const counts = {
    draft: 0,
    underReview: 0,
    revisionRequired: 0,
    accepted: 0,
  };

  MOCK_SUBMISSIONS.results.forEach((submission) => {
    if (submission.status === "DRAFT") counts.draft++;
    else if (submission.status === "UNDER_REVIEW") counts.underReview++;
    else if (submission.status === "REVISION_REQUIRED")
      counts.revisionRequired++;
    else if (submission.status === "ACCEPTED") counts.accepted++;
  });

  return counts;
};

export default function AuthorDashboard() {
  const counts = getStatusCounts();

  return (
    <div className="">
      <div className="space-y-5">
        {/* Header */}
        <div className="">
          <h1 className="text-3xl font-bold mb-2">Author Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your manuscript submissions
          </p>
        </div>

        {/* Stats Cards */}
        <AuthorDashboardStats counts={counts} />

        {/* Submissions Table Section */}
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-bold">Recent Submissions</h2>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Submission
          </Button>
        </div>
        <AuthorDashboardTable submissions={MOCK_SUBMISSIONS.results} />
        <Link href="/author/submissions/">
          <Button variant="secondary" className="mx-auto ">
            View All Submissions
          </Button>
        </Link>
      </div>
    </div>
  );
}
