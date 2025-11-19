"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Mail, User, Loader2 } from "lucide-react";
import { useGetJournalStaff, useAddJournalStaff, useRemoveJournalStaff, useGetUsers } from "@/features";
import { DataTable } from "@/features/shared";

const STAFF_ROLES = [
  { value: "EDITOR_IN_CHIEF", label: "Editor-in-Chief" },
  { value: "MANAGING_EDITOR", label: "Managing Editor" },
  { value: "ASSOCIATE_EDITOR", label: "Associate Editor" },
  { value: "SECTION_EDITOR", label: "Section Editor" },
  { value: "REVIEWER", label: "Reviewer" },
  { value: "GUEST_EDITOR", label: "Guest Editor" },
];

const ROLE_COLORS = {
  EDITOR_IN_CHIEF: "bg-purple-100 text-purple-800 border-purple-200",
  MANAGING_EDITOR: "bg-blue-100 text-blue-800 border-blue-200",
  ASSOCIATE_EDITOR: "bg-green-100 text-green-800 border-green-200",
  SECTION_EDITOR: "bg-yellow-100 text-yellow-800 border-yellow-200",
  REVIEWER: "bg-gray-100 text-gray-800 border-gray-200",
  GUEST_EDITOR: "bg-orange-100 text-orange-800 border-orange-200",
};

export function StaffSettings({ journalId }) {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Fetch staff data from backend
  const { data: staffData = [], isPending, error } = useGetJournalStaff(journalId);
  const addStaffMutation = useAddJournalStaff();
  const removeStaffMutation = useRemoveJournalStaff();

  console.log("StaffSettings - journalId:", journalId);
  console.log("StaffSettings - staffData:", staffData);
  console.log("StaffSettings - isPending:", isPending);
  console.log("StaffSettings - error:", error);

  const handleAddStaff = (data) => {
    console.log("Adding staff with data:", data);
    addStaffMutation.mutate({
      journalId,
      ...data,
    }, {
      onSuccess: () => {
        setIsAddStaffOpen(false);
      },
    });
  };

  const handleEditStaff = (data) => {
    // TODO: Implement staff update
    console.log("Editing staff:", data);
    toast.success("Staff member updated successfully");
    setIsEditStaffOpen(false);
    setSelectedStaff(null);
  };

  const handleRemoveStaff = (staff) => {
    if (confirm(`Are you sure you want to remove ${staff.profile?.first_name} ${staff.profile?.last_name}?`)) {
      removeStaffMutation.mutate({
        journalId,
        userId: staff.profile?.id,
      });
    }
  };

  const getRoleLabel = (role) => {
    return STAFF_ROLES.find((r) => r.value === role)?.label || role;
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (staff) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-medium">
            {staff.profile?.display_name || staff.profile?.user_name || 'No name'}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (staff) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Mail className="h-3 w-3" />
          {staff.profile?.user_email || 'N/A'}
        </div>
      ),
    },
    {
      key: "affiliation",
      header: "Affiliation",
      render: (staff) => <span className="text-sm">{staff.profile?.affiliation_name || 'N/A'}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (staff) => (
        <Badge className={ROLE_COLORS[staff.role]}>
          {getRoleLabel(staff.role)}
        </Badge>
      ),
    },
    {
      key: "added_date",
      header: "Added Date",
      render: (staff) => (
        <span className="text-sm text-muted-foreground">
          {new Date(staff.start_date || staff.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (staff) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedStaff(staff);
              setIsEditStaffOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleRemoveStaff(staff)}
            className="text-destructive hover:text-destructive"
            disabled={removeStaffMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Editorial Team</CardTitle>
            <CardDescription>
              Manage editors, reviewers, and other journal staff members
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddStaffOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={staffData}
            columns={columns}
            isPending={isPending}
            error={error}
            emptyMessage="No staff members yet. Click 'Add Staff' to get started."
          />
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <AddStaffDialog
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSubmit={handleAddStaff}
      />

      {/* Edit Staff Dialog */}
      {selectedStaff && (
        <EditStaffDialog
          isOpen={isEditStaffOpen}
          onClose={() => {
            setIsEditStaffOpen(false);
            setSelectedStaff(null);
          }}
          onSubmit={handleEditStaff}
          staff={selectedStaff}
        />
      )}
    </div>
  );
}

function AddStaffDialog({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    profile_id: "",
    role: "",
  });

  // Fetch real user profiles from API
  const { data: usersData, isPending: loadingUsers, error: usersError } = useGetUsers();
  const profiles = usersData?.results || usersData || [];

  console.log("AddStaffDialog - usersData:", usersData);
  console.log("AddStaffDialog - profiles:", profiles);
  console.log("AddStaffDialog - loadingUsers:", loadingUsers);
  console.log("AddStaffDialog - usersError:", usersError);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ profile_id: "", role: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>
            Select a user profile and assign a role to add them to the editorial team
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile">User Profile</Label>
            <Select
              value={formData.profile_id}
              onValueChange={(value) => setFormData({ ...formData, profile_id: value })}
              required
              disabled={loadingUsers}
            >
              <SelectTrigger id="profile">
                <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select a user"} />
              </SelectTrigger>
              <SelectContent>
                {loadingUsers ? (
                  <SelectItem value="loading" disabled>
                    Loading users...
                  </SelectItem>
                ) : usersError ? (
                  <SelectItem value="error" disabled>
                    Error loading users
                  </SelectItem>
                ) : profiles.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No users found
                  </SelectItem>
                ) : (
                  profiles.map((profile) => (
                    <SelectItem key={profile.profile.id} value={profile.profile.id}>
                      <div>
                        <p className="font-medium">
                          {profile.profile.display_name || profile.profile.user_name || 'No name'}
                        </p>
                        <p className="text-xs text-muted-foreground">{profile.profile.user_email}</p>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              required
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Staff</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditStaffDialog({ isOpen, onClose, onSubmit, staff }) {
  const [formData, setFormData] = useState({
    role: staff?.role || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: staff.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update the role for {staff?.profile?.display_name || staff?.profile?.user_name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>User</Label>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">
                  {staff?.profile?.display_name || staff?.profile?.user_name}
                </p>
                <p className="text-sm text-muted-foreground">{staff?.profile?.user_email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              required
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
