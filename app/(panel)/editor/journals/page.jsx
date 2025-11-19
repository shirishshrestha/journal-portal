"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  JournalDetailsDrawer,
  JournalFormModal,
  JournalsTable,
  useGetJournals,
} from "@/features";
import { FilterToolbar, RoleBasedRoute } from "@/features/shared";

export default function JournalsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [acceptingFilter, setAcceptingFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: JournalData,
    isPending: isJournalDataPending,
    error: JournalDataError,
  } = useGetJournals();

  const itemsPerPage = 10;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleSaveJournal = () => {
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    console.log("Delete journal:", id);
    // TODO: Implement delete API call
  };

  const journals = JournalData?.results || [];
  const totalPages = Math.ceil(journals.length / itemsPerPage);
  const paginatedJournals = journals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <RoleBasedRoute allowedRoles={["EDITOR"]}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Journal Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all academic journals and their submission settings.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsFormOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Journal
          </Button>
        </div>

        {/* Toolbar */}
        <FilterToolbar>
          <FilterToolbar.Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by title, short name, or publisher..."
            label="Search"
          />

          <FilterToolbar.Select
            label="Status"
            value={activeFilter}
            onChange={setActiveFilter}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />

          <FilterToolbar.Select
            label="Submissions"
            value={acceptingFilter}
            onChange={setAcceptingFilter}
            options={[
              { value: "all", label: "All" },
              { value: "accepting", label: "Accepting" },
              { value: "not-accepting", label: "Not Accepting" },
            ]}
          />
        </FilterToolbar>

        {/* Journals Table */}
        <JournalsTable
          journals={journals}
          onViewSubmissions={(row) => {
            router.push(`/editor/journals/${row.id}/submissions`);
          }}
          onEdit={(row) => {
            router.push(`/editor/journals/${row.id}/settings`);
          }}
          onSettings={(row) => {
            router.push(`/editor/journals/${row.id}/settings`);
          }}
          onDelete={handleDelete}
          isPending={isJournalDataPending}
          error={JournalDataError}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {paginatedJournals.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}{" "}
            to {Math.min(currentPage * itemsPerPage, journals.length)} of{" "}
            {journals.length} journals
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Modals */}
        <JournalFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveJournal}
        />

        <JournalDetailsDrawer
          journal={selectedJournal}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      </div>
    </RoleBasedRoute>
  );
}
