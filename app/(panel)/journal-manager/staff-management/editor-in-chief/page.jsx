'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Search,
  UserCheck,
  Users,
  Mail,
  Calendar,
  ArrowUpDown,
  Edit,
  UserPlus,
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

export default function EditorInChiefPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  // Mock data - replace with actual API calls
  const journals = [
    {
      id: 1,
      name: 'International Journal of Science',
      abbreviation: 'IJS',
      editorInChief: {
        name: 'Dr. John Doe',
        email: 'john.doe@university.edu',
        since: '2023-01-15',
        submissionsHandled: 45,
      },
    },
    {
      id: 2,
      name: 'Journal of Advanced Research',
      abbreviation: 'JAR',
      editorInChief: {
        name: 'Dr. Jane Smith',
        email: 'jane.smith@institute.org',
        since: '2022-06-20',
        submissionsHandled: 67,
      },
    },
    {
      id: 3,
      name: 'Quarterly Review of Technology',
      abbreviation: 'QRT',
      editorInChief: null,
    },
  ];

  // Mock list of available editors
  const availableEditors = [
    { id: 1, name: 'Dr. Alice Brown', email: 'alice.brown@university.edu' },
    { id: 2, name: 'Dr. Bob Wilson', email: 'bob.wilson@institute.org' },
    { id: 3, name: 'Dr. Carol Davis', email: 'carol.davis@college.edu' },
  ];

  const filteredJournals = journals.filter(
    (journal) =>
      journal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.editorInChief?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignEditor = (journal) => {
    setSelectedJournal(journal);
    setIsAssignDialogOpen(true);
  };

  const handleSaveAssignment = () => {
    // API call to assign/change editor-in-chief
    console.log('Assigning editor to journal:', selectedJournal);
    setIsAssignDialogOpen(false);
    setSelectedJournal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Editor-in-Chief Management</h1>
        <p className="text-muted-foreground">Assign and manage editor-in-chief for all journals</p>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Journals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{journals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              With Editor-in-Chief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {journals.filter((j) => j.editorInChief).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Needs Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {journals.filter((j) => !j.editorInChief).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Editor-in-Chief Table */}
      <Card>
        <CardHeader>
          <CardTitle>Editor-in-Chief Assignments</CardTitle>
          <CardDescription>Manage editor-in-chief assignments for all journals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by journal name or editor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Journal</TableHead>
                  <TableHead>Editor-in-Chief</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Submissions Handled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJournals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No journals found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJournals.map((journal) => (
                    <TableRow key={journal.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{journal.name}</p>
                            <p className="text-sm text-muted-foreground">{journal.abbreviation}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {journal.editorInChief ? (
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{journal.editorInChief.name}</span>
                          </div>
                        ) : (
                          <Badge variant="destructive">Not Assigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {journal.editorInChief ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {journal.editorInChief.email}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {journal.editorInChief ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {journal.editorInChief.since}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {journal.editorInChief ? (
                          <span className="font-medium">
                            {journal.editorInChief.submissionsHandled}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignEditor(journal)}
                        >
                          {journal.editorInChief ? (
                            <>
                              <Edit className="h-4 w-4 mr-1" />
                              Change
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-1" />
                              Assign
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assign/Change Editor Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedJournal?.editorInChief ? 'Change' : 'Assign'} Editor-in-Chief
            </DialogTitle>
            <DialogDescription>
              {selectedJournal?.editorInChief
                ? 'Select a new editor-in-chief for this journal'
                : 'Select an editor-in-chief for this journal'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Journal</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedJournal?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedJournal?.abbreviation}</p>
              </div>
            </div>

            {selectedJournal?.editorInChief && (
              <div className="space-y-2">
                <Label>Current Editor-in-Chief</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedJournal.editorInChief.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedJournal.editorInChief.email}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>New Editor-in-Chief</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an editor" />
                </SelectTrigger>
                <SelectContent>
                  {availableEditors.map((editor) => (
                    <SelectItem key={editor.id} value={editor.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{editor.name}</span>
                        <span className="text-xs text-muted-foreground">{editor.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
