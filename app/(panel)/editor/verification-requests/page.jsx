"use client";

import { useMemo, useState } from "react";
import { FilterToolbar, Pagination } from "@/features/shared";
import { ActionConfirmationPopup, LoadingScreen } from "@/features";
import {
  useGetEditorVerificationRequests,
  useGetEditorJournals,
  useApproveEditorVerification,
  useRejectEditorVerification,
  useRequestInfoEditorVerification,
  EditorVerificationRequestsTable,
  EditorVerificationDetailsModal,
} from "@/features/panel/editor/verification-requests";

import { useSearchParams, useRouter } from "next/navigation";

export default function EditorVerificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const searchParam = searchParams.get("search");
  const status = searchParams.get("status");
  const journal = searchParams.get("journal");

  const params = {
    search: searchParam,
    status: status,
    journal: journal,
    page: pageParam,
  };

  const {
    data: verificationsData,
    isPending: isVerificationRequestsPending,
    error,
  } = useGetEditorVerificationRequests({ params });

  const { data: journalsData, isPending: isJournalsLoading } =
    useGetEditorJournals();

  const verifications = useMemo(
    () => verificationsData?.results || [],
    [verificationsData]
  );

  const journals = useMemo(() => journalsData?.results || [], [journalsData]);

  // Mutations
  const { mutate: approveVerification, isPending: isApproving } =
    useApproveEditorVerification();
  const { mutate: rejectVerification, isPending: isRejecting } =
    useRejectEditorVerification();
  const { mutate: requestInfoVerification, isPending: isRequestingInfo } =
    useRequestInfoEditorVerification();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [journalFilter, setJournalFilter] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleViewDetails = (verification) => {
    setSelectedVerification(verification);
    setIsDetailsOpen(true);
  };

  const handleApprove = () => {
    setConfirmAction("approve");
    setIsConfirmOpen(true);
  };

  const handleRequestInfo = () => {
    setConfirmAction("request-info");
    setIsConfirmOpen(true);
  };

  const handleReject = () => {
    setConfirmAction("reject");
    setIsConfirmOpen(true);
  };

  // These handlers receive form values from ActionConfirmationPopup
  const handleApproveConfirm = (values) => {
    if (!selectedVerification?.id) return;

    approveVerification(
      {
        id: selectedVerification.id,
        data: values,
      },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setConfirmAction(null);
          setIsDetailsOpen(false);
        },
      }
    );
  };

  const handleRequestInfoConfirm = (values) => {
    if (!selectedVerification?.id) return;

    requestInfoVerification(
      {
        id: selectedVerification.id,
        data: values,
      },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setConfirmAction(null);
          setIsDetailsOpen(false);
        },
      }
    );
  };

  const handleRejectConfirm = (values) => {
    if (!selectedVerification?.id) return;

    rejectVerification(
      {
        id: selectedVerification.id,
        data: values,
      },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setConfirmAction(null);
          setIsDetailsOpen(false);
        },
      }
    );
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const journalOptions = [
    { value: "all", label: "All Journals" },
    ...journals.map((j) => ({ value: j.id.toString(), label: j.name })),
  ];

  return (
    <div className="space-y-6">
      {isVerificationRequestsPending && <LoadingScreen />}
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Verification Requests
        </h1>
        <p className="text-muted-foreground">
          Review and manage user verification requests for your journals
        </p>
      </div>

      {/* Filters and Search */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or email..."
          label="Search"
        />
        <FilterToolbar.Select
          paramName="journal"
          label="Journal"
          value={journalFilter}
          onChange={setJournalFilter}
          options={journalOptions}
          disabled={isJournalsLoading}
        />
        <FilterToolbar.Select
          paramName="status"
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "PENDING", label: "Pending" },
            { value: "APPROVED", label: "Approved" },
            { value: "REJECTED", label: "Rejected" },
            { value: "INFO_REQUESTED", label: "Info Requested" },
          ]}
        />
      </FilterToolbar>

      {/* Verifications Table */}
      <EditorVerificationRequestsTable
        requests={verifications}
        onViewDetails={handleViewDetails}
        isPending={isVerificationRequestsPending}
        error={error}
      />

      {/* Modals */}
      <EditorVerificationDetailsModal
        verification={selectedVerification}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestInfo={handleRequestInfo}
        isLoading={isApproving || isRejecting || isRequestingInfo}
      />

      <ActionConfirmationPopup
        isOpen={isConfirmOpen}
        action={confirmAction}
        userName={selectedVerification?.profile_name || ""}
        onApprove={handleApproveConfirm}
        onReject={handleRejectConfirm}
        onRequestInfo={handleRequestInfoConfirm}
        onCancel={() => {
          setIsConfirmOpen(false);
          setConfirmAction(null);
        }}
        isLoading={isApproving || isRejecting || isRequestingInfo}
      />

      {/* Pagination */}
      {verificationsData && verificationsData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(verificationsData.count / 10)}
          totalCount={verificationsData.count}
          pageSize={10}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
      )}
    </div>
  );
}
