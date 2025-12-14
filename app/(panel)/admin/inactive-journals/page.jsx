"use client";

import { useState } from "react";
import { FilterToolbar, LoadingScreen } from "@/features/shared";
import {
  InactiveJournalsTable,
  InactiveJournalDetailsModal,
  useGetInactiveJournals,
  useActivateJournal,
} from "@/features/panel/admin/journal";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function InactiveJournalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const params = {
    search: searchQuery || undefined,
  };

  const {
    data: journalsData,
    isPending,
    error,
    refetch,
  } = useGetInactiveJournals({ params });

  const { mutate: activateJournal, isPending: isActivating } =
    useActivateJournal();

  const journals = journalsData?.results || [];

  const handleViewDetails = (journal) => {
    setSelectedJournal(journal);
    setIsDetailsOpen(true);
  };

  const handleActivate = (journal) => {
    activateJournal(journal.id, {
      onSuccess: () => {
        setIsDetailsOpen(false);
        setSelectedJournal(null);
      },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {isPending && <LoadingScreen />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">
            Inactive Journals
          </h1>
          <p className="text-muted-foreground">
            Review and activate inactive journals
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      {!isPending && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Inactive
              </p>
            </div>
            <p className="text-3xl font-semibold mt-2">
              {journalsData?.count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search journals..."
          label="Search"
        />
      </FilterToolbar>

      {/* Journals Table */}
      <InactiveJournalsTable
        journals={journals}
        onViewDetails={handleViewDetails}
        onActivate={handleActivate}
        isPending={isPending}
        error={error}
      />

      {/* Details Modal */}
      <InactiveJournalDetailsModal
        journal={selectedJournal}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedJournal(null);
        }}
        onActivate={handleActivate}
        isActivating={isActivating}
      />
    </div>
  );
}
