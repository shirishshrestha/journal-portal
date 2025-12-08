"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  JournalDetailsDrawer,
  JournalFormModal,
  JournalsTable,
  useGetJournals,
  useDeleteJournal,
} from "@/features";
import {
  FilterToolbar,
  RoleBasedRoute,
  ConfirmationPopup,
  Pagination,
} from "@/features/shared";

export default function JournalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const statusParam = searchParams.get("status");
  const submissionsParam = searchParams.get("submissions");

  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const is_active =
    statusParam === "active" ? true : statusParam === "inactive" ? false : "";
  const is_accepting_submissions =
    submissionsParam === "accepting"
      ? true
      : submissionsParam === "not-accepting"
      ? false
      : "";

  const params = {
    search: searchParam || "",
    is_active: is_active,
    is_accepting_submissions: is_accepting_submissions,
    page: currentPage,
  };

  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState(null);

  const {
    data: JournalData,
    isPending: isJournalDataPending,
    error: JournalDataError,
  } = useGetJournals({ params });

  const deleteJournalMutation = useDeleteJournal();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
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

  return (
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
        {journals?.length < 1 && (
          <Button
            variant="secondary"
            onClick={() => setIsFormOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Journal
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          placeholder="Search by title, short name, or publisher..."
          label="Search"
        />

        <FilterToolbar.Select
          label="Status"
          paramName="status"
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />

        <FilterToolbar.Select
          label="Submissions"
          paramName="submissions"
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
      />

      {/* Pagination */}
      {JournalData && JournalData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(JournalData.count / 10)}
          totalCount={JournalData.count}
          pageSize={10}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
      )}

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

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            deleteJournalMutation.reset();
          }
        }}
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
  );
}
