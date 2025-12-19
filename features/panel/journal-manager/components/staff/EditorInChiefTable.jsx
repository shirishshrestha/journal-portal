'use client';

import { BookOpen, UserCheck, Mail, Calendar, Edit, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function EditorInChiefTable({ journals, isLoading, onAssignEditor }) {
  if (isLoading) {
    return (
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
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Loading journals...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!journals || journals.length === 0) {
    return (
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
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No journals found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
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
          {journals.map((journal) => (
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
                {journal.editor_in_chief_name ? (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{journal.editor_in_chief_name}</span>
                  </div>
                ) : (
                  <Badge variant="destructive">Not Assigned</Badge>
                )}
              </TableCell>
              <TableCell>
                {journal.editor_in_chief_email ? (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {journal.editor_in_chief_email}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {journal.editor_in_chief_since ? (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(journal.editor_in_chief_since).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {journal.submissions_handled ? (
                  <span className="font-medium">{journal.submissions_handled}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => onAssignEditor(journal)}>
                  {journal.editor_in_chief_name ? (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
