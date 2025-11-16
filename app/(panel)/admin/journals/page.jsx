"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { JournalDetailsDrawer, JournalFormModal } from "@/features";
import JournalsTable from "@/features/panel/admin/journals/components/JournalsTable";
import { FilterToolbar } from "@/features/shared";

const mockJournals = [
  {
    id: "1",
    title: "Journal of Computer Science",
    short_name: "JCS",
    publisher: "TechPress",
    is_active: true,
    is_accepting_submissions: true,
    submission_count: 42,
    editor_in_chief: {
      id: "101",
      name: "Dr. Alice Johnson",
      email: "alice.johnson@example.com",
    },
    issn_print: "1234-5678",
    issn_online: "8765-4321",
    description:
      "A peer-reviewed journal focusing on computational theory and AI applications.",
    website: "https://jcs.techpress.org",
    contact_email: "contact@jcs.org",
    created_at: "2025-10-20T10:00:00Z",
  },
  {
    id: "2",
    title: "International Journal of AI Research",
    short_name: "IJAR",
    publisher: "OpenAI Publishing",
    is_active: false,
    is_accepting_submissions: false,
    submission_count: 12,
    editor_in_chief: {
      id: "102",
      name: "Dr. Bob Smith",
      email: "bob.smith@example.com",
    },
    issn_print: "2345-6789",
    issn_online: "9876-5432",
    description:
      "Covers advances in artificial intelligence, deep learning, and related fields.",
    website: "https://ijar.openai.org",
    contact_email: "editor@ijar.org",
    created_at: "2025-10-22T12:30:00Z",
  },
  {
    id: "3",
    title: "Journal of Environmental Studies",
    short_name: "JES",
    publisher: "EcoWorld",
    is_active: true,
    is_accepting_submissions: false,
    submission_count: 8,
    editor_in_chief: {
      id: "103",
      name: "Dr. Carol Davis",
      email: "carol.davis@example.com",
    },
    issn_print: "3456-7890",
    issn_online: "0987-6543",
    description:
      "Publishes interdisciplinary research on environmental science and sustainability.",
    website: "https://jes.ecoworld.org",
    contact_email: "info@jes.org",
    created_at: "2025-11-01T08:15:00Z",
  },
];

export default function JournalsPage() {
  const [journals, setJournals] = useState(mockJournals);
  const [filteredJournals, setFilteredJournals] = useState(mockJournals);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [acceptingFilter, setAcceptingFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  // Simulate loading and error state for demonstration
  const [isPending, setIsPending] = useState(false); // Set to true to show loading
  const [error, setError] = useState(null); // Set to error object/string to show error

  const itemsPerPage = 10;

  // Filter and sort journals
  useEffect(() => {
    let filtered = journals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.short_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Active filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((j) =>
        activeFilter === "active" ? j.is_active : !j.is_active
      );
    }

    // Accepting submissions filter
    if (acceptingFilter !== "all") {
      filtered = filtered.filter((j) =>
        acceptingFilter === "accepting"
          ? j.is_accepting_submissions
          : !j.is_accepting_submissions
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal = "";
      let bVal = "";

      switch (sortColumn) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "publisher":
          aVal = a.publisher.toLowerCase();
          bVal = b.publisher.toLowerCase();
          break;
        case "submissions":
          aVal = a.submission_count;
          bVal = b.submission_count;
          break;
        case "created_at":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredJournals(filtered);
    setCurrentPage(1);
  }, [
    journals,
    searchTerm,
    activeFilter,
    acceptingFilter,
    sortColumn,
    sortOrder,
  ]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleSaveJournal = (data) => {
    if (editingJournal) {
      setJournals(
        journals.map((j) =>
          j.id === editingJournal.id ? { ...editingJournal, ...data } : j
        )
      );
      toast.success("Journal updated successfully");
    } else {
      setJournals([...journals, { ...data, id: Date.now().toString() }]);
      toast.success("Journal created successfully");
    }
    setIsFormOpen(false);
    setEditingJournal(null);
  };

  const handleDelete = (id) => {
    setJournals(journals.filter((j) => j.id !== id));
    toast.success("Journal deleted successfully");
  };

  const paginatedJournals = filteredJournals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredJournals.length / itemsPerPage);

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
        <Button
          variant="secondary"
          onClick={() => {
            setEditingJournal(null);
            setIsFormOpen(true);
          }}
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
        journals={paginatedJournals}
        onViewDetails={(row) => {
          setSelectedJournal(row);
          setIsDetailsOpen(true);
        }}
        onEdit={(row) => {
          setEditingJournal(row);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
        isPending={isPending}
        error={error}
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
          to {Math.min(currentPage * itemsPerPage, filteredJournals.length)} of{" "}
          {filteredJournals.length} journals
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
        journal={editingJournal}
        onClose={() => {
          setIsFormOpen(false);
          setTimeout(() => {
            setEditingJournal(null);
          }, 500);
        }}
        onSave={handleSaveJournal}
      />

      <JournalDetailsDrawer
        journal={selectedJournal}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
