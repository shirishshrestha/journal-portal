"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterToolbar } from "@/features/shared";
import {
  ConfirmationPopup,
  LoadingScreen,
  useDeleteUser,
  useGetUsers,
  UserDetailsModal,
  UserTable,
} from "@/features";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Pagination from "@/features/shared/components/Pagination";

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchParams = useSearchParams();
  const statusParam = searchParams.get("account_status");
  const verificationParam = searchParams.get("verification_status");
  const searchParam = searchParams.get("search");
  const pageParam = searchParams.get("page");
  const is_active =
    statusParam === "active" ? true : statusParam === "inactive" ? false : "";
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const params = {
    is_active: is_active,
    search: searchParam || "",
    profile__verification_status: verificationParam || "",
    page: currentPage,
  };

  const {
    data: users,
    isPending: isUsersDataPending,
    error: UserDataError,
  } = useGetUsers({ userRole: "", params });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userNameToDelete, setUserNameToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const toggleDeleteDialog = () =>
    setDeleteDialogOpen((prevState) => !prevState);

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteDialogOpen(false);
      setUserIdToDelete(null);
      setUserNameToDelete(null);
      deleteUserMutation.reset();
    },
    onError: (error) => {
      toast.error(
        `Error deleting user: ${error.message}` || "Failed to delete user"
      );
    },
  });

  // Delete user handler with confirmation popup
  const handleDeleteUser = (user) => {
    setUserIdToDelete(user.id);
    setUserNameToDelete(
      user.profile.display_name || `${user.first_name} ${user.last_name}`
    );
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userIdToDelete) return;
    await deleteUserMutation.mutateAsync(userIdToDelete);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      {isUsersDataPending && <LoadingScreen />}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Manage all registered users, roles, and verification statuses.
        </p>
      </div>

      {/* Toolbar */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or email..."
          label="Search"
        />
        <FilterToolbar.Select
          paramName={"verification_status"}
          label="Verification Status"
          value={verificationFilter}
          onChange={setVerificationFilter}
          options={[
            { value: "all", label: "All" },
            { value: "GENUINE", label: "Genuine" },
            { value: "PENDING", label: "Pending" },
          ]}
        />
        <FilterToolbar.Select
          paramName="account_status"
          label="Account Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </FilterToolbar>

      {/* Users Table */}
      <UserTable
        users={users?.results || []}
        onViewDetails={(user) => {
          setSelectedUser(user);
          setIsDetailsOpen(true);
        }}
        onEdit={(user) => {
          setSelectedUser(user);
          setIsDetailsOpen(true);
        }}
        onDelete={(user) => handleDeleteUser(user)}
        isPending={isUsersDataPending}
        error={UserDataError}
      />

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setTimeout(() => {
              setUserIdToDelete(null);
              setUserNameToDelete(null);
            }, 500);
          }
        }}
        title={`Delete ${userNameToDelete?.toUpperCase()} `}
        description={`Are you sure you want to delete this user? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isPending={deleteUserMutation.isPending || false}
        isSuccess={deleteUserMutation.isSuccess || false}
        onConfirm={confirmDeleteUser}
        autoClose={true}
      />

      {/* Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(user) => {
          // Handle edit logic
          setIsDetailsOpen(false);
        }}
      />

      {/* Pagination */}
      {users && users.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(users.count / 10)}
          totalCount={users.count}
          pageSize={10}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
      )}
    </div>
  );
}
