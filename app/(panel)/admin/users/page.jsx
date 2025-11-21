"use client";

import { useState } from "react";
import { useToggle } from "@/features/shared/hooks/useToggle";
import { FilterToolbar } from "@/features/shared";
import {
  ConfirmationPopup,
  LoadingScreen,
  useDeleteUser,
  useGetUsers,
  UserDetailsModal,
  UserTable,
  useUpdateUser,
} from "@/features";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function UserManagementPage() {
  const queryClient = useQueryClient();

  const {
    data: users,
    isPending: isUsersDataPending,
    error: UserDataError,
  } = useGetUsers({ userRole: "" });

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

  return (
    <div className="space-y-5">
      {/* Header */}
      {isUsersDataPending && <LoadingScreen />}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">
          Manage all registered users, roles, and verification statuses.
        </p>
      </div>

      {/* Toolbar */}
      <FilterToolbar>
        <FilterToolbar.Search
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or email..."
          label="Search"
        />
        <FilterToolbar.Select
          label="Verification Status"
          value={verificationFilter}
          onChange={setVerificationFilter}
          options={[
            { value: "all", label: "All" },
            { value: "VERIFIED", label: "Verified" },
            { value: "PENDING", label: "Pending" },
            { value: "REJECTED", label: "Rejected" },
          ]}
        />
        <FilterToolbar.Select
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
    </div>
  );
}
