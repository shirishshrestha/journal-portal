"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminJournalsTable,
  JournalDetailsDrawer,
  useGetJournals,
  useDeleteJournal,
} from "@/features";
import {
  FilterToolbar,
  RoleBasedRoute,
  ConfirmationPopup,
} from "@/features/shared";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState(null);

  const {
    data: JournalData,
    isPending: isJournalDataPending,
    error: JournalDataError,
  } = useGetJournals();

  const deleteJournalMutation = useDeleteJournal();

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

  const handleDelete = (journal) => {
    setJournalToDelete(journal);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (journalToDelete) {
      deleteJournalMutation.mutate(journalToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setJournalToDelete(null);
        },
      });
    }
  };

  const journals = JournalData?.results || [];
  const totalPages = Math.ceil(journals.length / itemsPerPage);
  const paginatedJournals = journals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <RoleBasedRoute allowedRoles={["ADMIN"]}>
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
        </div>

        {/* Toolbar */}
        <FilterToolbar>
          <FilterToolbar.Search
            paramName="search"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by title, short name, or publisher..."
            label="Search"
          />

          <FilterToolbar.Select
            label="Status"
            paramName="status"
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
            paramName="submissions"
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
        <AdminJournalsTable
          journals={journals}
          onViewDrawer={(row) => {
            setSelectedJournal(row);
            setIsDetailsOpen(true);
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

        <JournalDetailsDrawer
          journal={selectedJournal}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />

        {/* Delete Confirmation Popup */}
        <ConfirmationPopup
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Journal"
          description={`Are you sure you want to delete "${journalToDelete?.title}"? This action cannot be undone and will remove all associated data.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          isPending={deleteJournalMutation.isPending}
          isSuccess={deleteJournalMutation.isSuccess}
          icon={<Trash2 className="h-6 w-6 text-destructive" />}
        />
      </div>
    </RoleBasedRoute>
  );
}
