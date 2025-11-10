"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Download, Mail } from "lucide-react";
import {
  LoadingScreen,
  useGetUsers,
  UserDetailsModal,
  UserTable,
  useUpdateUser,
} from "@/features";

export default function UserManagementPage() {
  const {
    data: users,
    isPending: isUsersDataPending,
    error: UserDataError,
  } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Verification Status",
      "Account Status",
      "Joined",
      "Last Login",
    ];
    const csvContent = [
      headers.join(","),
      ...users?.results.map((user) =>
        [
          user.profile.display_name || `${user.first_name} ${user.last_name}`,
          user.email,
          user.profile.verification_status,
          user.is_active ? "Active" : "Inactive",
          new Date(user.date_joined).toLocaleDateString(),
          user.last_login
            ? new Date(user.last_login).toLocaleDateString()
            : "Never",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isUsersDataPending) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">
          Manage all registered users, roles, and verification statuses.
        </p>
      </div>

      {/* Toolbar */}
      <Card className="">
        <CardContent className=" space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Verification Status
              </label>
              <Select
                value={verificationFilter}
                onValueChange={setVerificationFilter}
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-48">
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Account Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={"w-full"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
