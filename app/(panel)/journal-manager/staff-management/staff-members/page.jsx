'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Search,
  Users,
  Mail,
  Calendar,
  Edit,
  UserPlus,
  Trash2,
  Shield,
  UserCog,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function StaffMembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState('all');

  // Mock data - replace with actual API calls
  const staffMembers = [
    {
      id: 1,
      name: 'Dr. Alice Brown',
      email: 'alice.brown@university.edu',
      role: 'Section Editor',
      journal: 'International Journal of Science',
      journalId: 1,
      assignedSince: '2023-06-15',
      sectionsManaged: 3,
      submissionsHandled: 25,
    },
    {
      id: 2,
      name: 'Dr. Bob Wilson',
      email: 'bob.wilson@institute.org',
      role: 'Associate Editor',
      journal: 'International Journal of Science',
      journalId: 1,
      assignedSince: '2023-08-20',
      sectionsManaged: 2,
      submissionsHandled: 18,
    },
    {
      id: 3,
      name: 'Dr. Carol Davis',
      email: 'carol.davis@college.edu',
      role: 'Section Editor',
      journal: 'Journal of Advanced Research',
      journalId: 2,
      assignedSince: '2023-04-10',
      sectionsManaged: 4,
      submissionsHandled: 32,
    },
    {
      id: 4,
      name: 'Dr. David Lee',
      email: 'david.lee@university.edu',
      role: 'Copy Editor',
      journal: 'Journal of Advanced Research',
      journalId: 2,
      assignedSince: '2023-09-05',
      sectionsManaged: 0,
      submissionsHandled: 45,
    },
    {
      id: 5,
      name: 'Dr. Emily Chen',
      email: 'emily.chen@institute.org',
      role: 'Production Editor',
      journal: 'International Journal of Science',
      journalId: 1,
      assignedSince: '2023-07-12',
      sectionsManaged: 0,
      submissionsHandled: 40,
    },
  ];

  const journals = [
    { id: 1, name: 'International Journal of Science' },
    { id: 2, name: 'Journal of Advanced Research' },
    { id: 3, name: 'Quarterly Review of Technology' },
  ];

  const staffRoles = [
    'Section Editor',
    'Associate Editor',
    'Copy Editor',
    'Production Editor',
    'Layout Editor',
    'Managing Editor',
  ];

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJournal =
      selectedJournal === 'all' || staff.journalId === parseInt(selectedJournal);

    return matchesSearch && matchesJournal;
  });

  const handleAddStaff = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStaff = (staff) => {
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveStaff = () => {
    // API call to add/edit staff member
    console.log('Saving staff member');
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedStaff(null);
  };

  const handleConfirmDelete = () => {
    // API call to delete staff member
    console.log('Deleting staff member:', selectedStaff);
    setIsDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Staff Member Management</h1>
        <p className="text-muted-foreground">
          Add, remove, and manage staff members across all journals
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Section Editors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staffMembers.filter((s) => s.role === 'Section Editor').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Associate Editors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staffMembers.filter((s) => s.role === 'Associate Editor').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Other Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                staffMembers.filter(
                  (s) => s.role !== 'Section Editor' && s.role !== 'Associate Editor'
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>Manage all staff members across journals</CardDescription>
            </div>
            <Button onClick={handleAddStaff}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedJournal} onValueChange={setSelectedJournal}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filter by journal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Journals</SelectItem>
                {journals.map((journal) => (
                  <SelectItem key={journal.id} value={journal.id.toString()}>
                    {journal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Journal</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {staff.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{staff.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{staff.journal}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {staff.assignedSince}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{staff.sectionsManaged}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{staff.submissionsHandled}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditStaff(staff)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStaff(staff)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Add a new staff member to a journal</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input placeholder="staff.member@university.edu" type="email" />
              <p className="text-xs text-muted-foreground">
                Enter the email of an existing user in the system
              </p>
            </div>

            <div className="space-y-2">
              <Label>Journal</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a journal" />
                </SelectTrigger>
                <SelectContent>
                  {journals.map((journal) => (
                    <SelectItem key={journal.id} value={journal.id.toString()}>
                      {journal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {staffRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStaff}>Add Staff Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff member information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedStaff?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedStaff?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Journal</Label>
              <Select defaultValue={selectedStaff?.journalId.toString()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {journals.map((journal) => (
                    <SelectItem key={journal.id} value={journal.id.toString()}>
                      {journal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue={selectedStaff?.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {staffRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStaff}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong>{selectedStaff?.name}</strong> from their role as{' '}
              <strong>{selectedStaff?.role}</strong> at <strong>{selectedStaff?.journal}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
              Remove Staff Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
