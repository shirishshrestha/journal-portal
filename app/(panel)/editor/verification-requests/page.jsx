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
  const journalParam = searchParams.get("journal");

  // Get editor's journals
  const { data: journalsData, isPending: isJournalsLoading } =
    useGetEditorJournals();

  const journals = useMemo(() => journalsData?.results || [], [journalsData]);

  // Select first journal by default or use the one from query params
  const [selectedJournalId, setSelectedJournalId] = useState(
    journalParam || null
  );

  // Set default journal when journals are loaded
  useMemo(() => {
    if (!selectedJournalId && journals.length > 0) {
      setSelectedJournalId(journals[0].id);
    }
  }, [journals, selectedJournalId]);

  const params = {
    status: status,
  };

  const {
    data: verificationsData,
    isPending: isVerificationRequestsPending,
    error,
  } = useGetEditorVerificationRequests({
    journalId: selectedJournalId,
    params,
  });

  const verifications = useMemo(
    () => verificationsData?.verification_requests || [],
    [verificationsData]
  );

  // Mutations
  const { mutate: approveVerification, isPending: isApproving } =
    useApproveEditorVerification();
  const { mutate: rejectVerification, isPending: isRejecting } =
    useRejectEditorVerification();
  const { mutate: requestInfoVerification, isPending: isRequestingInfo } =
    useRequestInfoEditorVerification();

  const [statusFilter, setStatusFilter] = useState(status || "all");
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
    if (!selectedVerification?.id || !selectedJournalId) return;

    approveVerification(
      {
        journalId: selectedJournalId,
        requestId: selectedVerification.id,
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
    if (!selectedVerification?.id || !selectedJournalId) return;

    requestInfoVerification(
      {
        journalId: selectedJournalId,
        requestId: selectedVerification.id,
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
    if (!selectedVerification?.id || !selectedJournalId) return;

    rejectVerification(
      {
        journalId: selectedJournalId,
        requestId: selectedVerification.id,
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

  const handleJournalChange = (value) => {
    setSelectedJournalId(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("journal", value);
    params.delete("page"); // Reset page when changing journal
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const journalOptions = journals.map((j) => ({
    value: j.id.toString(),
    label: j.title,
  }));

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

      {/* Journal and Status Filters */}
      <FilterToolbar>
        <FilterToolbar.Select
          paramName="journal"
          label="Journal"
          value={selectedJournalId || ""}
          onChange={handleJournalChange}
          options={journalOptions}
          disabled={isJournalsLoading}
          placeholder="Select a journal"
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

      {/* Journal Info */}
      {verificationsData && (
        <div className="bg-muted/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{verificationsData.journal?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Total imported users:{" "}
                {verificationsData.total_imported_users || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Verification requests: {verifications.length}
              </p>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
