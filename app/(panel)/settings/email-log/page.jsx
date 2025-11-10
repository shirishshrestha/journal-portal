"use client";

import {
  EmailDetailModal,
  EmailLogFilters,
  EmailLogPagination,
  EmailLogStats,
  EmailLogTable,
  ErrorCard,
  useGetUserEmailLogStats,
} from "@/features";
import { useState } from "react";

// TODO: Replace with API data

const mockEmailLogs = [
  {
    id: "eeac2caf-1f5d-48a8-9461-25f4f7320f16",
    recipient: "testuser2@example.com",
    user_email: "testuser2@example.com",
    template_type: "EMAIL_VERIFICATION",
    subject: "Verify Your Email Address - Journal Publication Portal",
    status: "FAILED",
    status_display: "Failed",
    sent_at: null,
    retry_count: 0,
    error_message: 'Invalid address ""',
    created_at: "2025-11-02T06:19:25.325095Z",
  },
  {
    id: "abc123-def456-ghi789",
    recipient: "researcher@university.edu",
    user_email: "researcher@university.edu",
    template_type: "EMAIL_VERIFICATION",
    subject: "Verify Your Email Address - Journal Publication Portal",
    status: "DELIVERED",
    status_display: "Delivered",
    sent_at: "2025-11-01T10:30:00Z",
    retry_count: 0,
    created_at: "2025-11-01T10:25:00Z",
  },
  {
    id: "xyz789-abc123-def456",
    recipient: "editor@journal.org",
    user_email: "editor@journal.org",
    template_type: "EMAIL_VERIFICATION",
    subject: "Verify Your Email Address - Journal Publication Portal",
    status: "OPENED",
    status_display: "Opened",
    sent_at: "2025-10-30T14:15:00Z",
    retry_count: 0,
    created_at: "2025-10-30T14:10:00Z",
  },
];

export default function EmailLogTab() {
  const {
    data: EmailLogData,
    isPending: isEmailLogPending,
    isError: isEmailLogError,
    error: emailLogError,
    refetch: refetchEmailLogStats,
  } = useGetUserEmailLogStats();

  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: Replace with API data and pagination
  const filteredEmails = mockEmailLogs.filter((email) => {
    if (statusFilter !== "all" && email.status !== statusFilter) return false;
    if (templateFilter !== "all" && email.template_type !== templateFilter)
      return false;
    if (
      searchValue &&
      !email.subject.toLowerCase().includes(searchValue.toLowerCase())
    )
      return false;
    return true;
  });

  if (isEmailLogError) {
    return (
      <ErrorCard
        title="Failed to load email logs"
        error={emailLogError}
        onRetry={refetchEmailLogStats}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Email History
        </h2>
      </div>
      {/* Statistics Section */}
      <EmailLogStats
        data={EmailLogData}
        isPending={isEmailLogPending}
        isError={isEmailLogError}
        error={emailLogError}
      />
      {/* Filters Section */}
      <EmailLogFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        templateFilter={templateFilter}
        setTemplateFilter={setTemplateFilter}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {/* Email Table Section */}
      <div className="border border-border rounded-lg">
        <EmailLogTable
          emails={EmailLogData?.recent_emails}
          onViewEmail={setSelectedEmail}
        />
      </div>
      {/* Pagination Section */}
      <EmailLogPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalEmails={mockEmailLogs.length}
        shownEmails={filteredEmails.length}
      />
      {/* Email Detail Modal */}
      <EmailDetailModal
        email={selectedEmail}
        open={!!selectedEmail}
        onOpenChange={() => setSelectedEmail(null)}
      />
    </div>
  );
}
