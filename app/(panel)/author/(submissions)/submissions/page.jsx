"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { AuthorSubmissionsTable } from "@/features";

const MOCK_SUBMISSIONS = [
  {
    id: "1",
    title: "Machine Learning in Healthcare Applications",
    journal_name: "Journal of AI Research",
    status: "UNDER_REVIEW",
    submission_number: "SUB-001",
    submitted_at: "2025-11-01T10:00:00Z",
    updated_at: "2025-11-05T14:30:00Z",
  },
  {
    id: "2",
    title: "Data Privacy in Cloud Computing",
    journal_name: "Data Science Review",
    status: "DRAFT",
    submission_number: "SUB-002",
    submitted_at: "2025-11-03T09:00:00Z",
    updated_at: "2025-11-03T09:00:00Z",
  },
  {
    id: "3",
    title: "Ethical Considerations in AI",
    journal_name: "Computational Ethics",
    status: "REVISION_REQUIRED",
    submission_number: "SUB-003",
    submitted_at: "2025-10-20T08:00:00Z",
    updated_at: "2025-11-04T11:00:00Z",
  },
  {
    id: "4",
    title: "Natural Language Processing Advances",
    journal_name: "Journal of AI Research",
    status: "ACCEPTED",
    submission_number: "SUB-004",
    submitted_at: "2025-09-15T07:30:00Z",
    updated_at: "2025-11-02T10:00:00Z",
  },
];

const JOURNALS = [
  "All Journals",
  "Journal of AI Research",
  "Data Science Review",
  "Computational Ethics",
];
const STATUSES = [
  "All",
  "Draft",
  "Under Review",
  "Revision Required",
  "Accepted",
];

const statusColors = {
  Draft: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  "Under Review":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Revision Required":
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function SubmissionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [journalFilter, setJournalFilter] = useState("All Journals");

  const filteredSubmissions = MOCK_SUBMISSIONS.filter((sub) => {
    const matchesSearch = sub.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    const matchesJournal =
      journalFilter === "All Journals" || sub.journal === journalFilter;
    return matchesSearch && matchesStatus && matchesJournal;
  });

  const handleDelete = (id) => {
    console.log("Delete submission:", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Submissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your manuscript submissions
          </p>
        </div>
        <Button
          onClick={() => router.push("/author/new-submission/")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Submission
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-background border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={journalFilter} onValueChange={setJournalFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JOURNALS.map((journal) => (
                <SelectItem key={journal} value={journal}>
                  {journal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <AuthorSubmissionsTable submissions={filteredSubmissions} />
    </div>
  );
}
