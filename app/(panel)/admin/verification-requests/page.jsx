"use client";

import { useMemo, useState } from "react";
import { FilterToolbar, Pagination } from "@/features/shared";
import {
  ActionConfirmationPopup,
  VerificationDetailsModal,
  VerificationRequestsTable,
  LoadingScreen,
  useGetVerificationRequests,
  useApproveVerification,
  useRejectVerification,
  useRequestInfoVerification,
} from "@/features";

import { useSearchParams, useRouter } from "next/navigation";

export default function VerificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const searchParam = searchParams.get("search");
  const status = searchParams.get("status");

  const params = {
    search: searchParam,
    status: status,
    page: pageParam,
  };

  const {
    data: verificationsData,
    isPending: isVerificationRequestsPending,
    error,
  } = useGetVerificationRequests({ params });

  const verifications = useMemo(
    () => verificationsData?.results || [],
    [verificationsData]
  );

  // Mutations
  const { mutate: approveVerification, isPending: isApproving } =
    useApproveVerification();
  const { mutate: rejectVerification, isPending: isRejecting } =
    useRejectVerification();
  const { mutate: requestInfoVerification, isPending: isRequestingInfo } =
    useRequestInfoVerification();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  return (
    <div className="space-y-6">
      {isVerificationRequestsPending && <LoadingScreen />}
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Verification Requests
        </h1>
        <p className="text-muted-foreground">
          Review and manage user verification requests
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
      <VerificationRequestsTable
        requests={verifications}
        onViewDetails={handleViewDetails}
        isPending={isVerificationRequestsPending}
        error={error}
      />

      {/* Modals */}
      <VerificationDetailsModal
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
