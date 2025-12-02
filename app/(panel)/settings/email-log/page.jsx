"use client";

import {
  EmailDetailModal,
  EmailLogStats,
  EmailLogTable,
  ErrorCard,
  useGetUserEmailLogStats,
  FilterToolbar,
  Pagination,
} from "@/features";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function EmailLogTab() {
  const searchParams = useSearchParams();
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Get filter values from URL
  const searchValue = searchParams.get("search") || "";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const params = {
    search: searchValue,
    page: currentPage,
  };

  const {
    data: EmailLogData,
    isPending: isEmailLogPending,
    isError: isEmailLogError,
    error: emailLogError,
    refetch: refetchEmailLogStats,
  } = useGetUserEmailLogStats({ params });

  // Pagination data - TODO: Replace with actual API pagination data
  const totalItems = EmailLogData?.recent_emails?.length || 0;
  const pageSize = 10;

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

      {/* Filter Toolbar */}
      <FilterToolbar>
        <FilterToolbar.Search
          placeholder="Search by subject, recipient..."
          paramName="search"
        />
      </FilterToolbar>

      {/* Email Table Section */}
      <div className="border border-border rounded-lg">
        <EmailLogTable
          emails={EmailLogData?.results}
          onViewEmail={setSelectedEmail}
          isPending={isEmailLogPending}
          error={emailLogError}
        />
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      )}

      {/* Email Detail Modal */}
      <EmailDetailModal
        email={selectedEmail}
        open={!!selectedEmail}
        onOpenChange={() => setSelectedEmail(null)}
      />
    </div>
  );
}
