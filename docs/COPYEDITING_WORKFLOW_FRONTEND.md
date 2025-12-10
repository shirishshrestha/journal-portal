# Copyediting Workflow - Frontend Implementation

## Overview

This document provides comprehensive documentation for the copyediting workflow frontend implementation, including components, APIs, hooks, workflow diagrams, and permissions management.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Components](#components)
3. [API Integration](#api-integration)
4. [Hooks](#hooks)
5. [SuperDoc Integration](#superdoc-integration)
6. [Permissions Matrix](#permissions-matrix)
7. [Workflow Diagrams](#workflow-diagrams)
8. [Usage Examples](#usage-examples)

---

## Architecture Overview

The copyediting workflow is built with a modular architecture:

```
├── app/
│   └── (panel)/
│       ├── editor/submissions/[id]/copyediting/     # Editor view
│       └── author/submissions/active/[id]/copyediting/  # Author view
├── features/
│   ├── panel/editor/submission/
│   │   ├── api/
│   │   │   ├── copyeditingApi.js                   # API functions
│   │   │   └── productionApi.js                    # Production API
│   │   ├── components/copyediting/
│   │   │   ├── AddParticipantDialog.jsx            # Add participants
│   │   │   ├── AssignCopyeditorDialog.jsx          # Assign copyeditor
│   │   │   ├── CopyeditingAssignmentCard.jsx       # Assignment info
│   │   │   ├── CopyeditingDiscussions.jsx          # Discussion thread
│   │   │   ├── CopyeditingDraftFiles.jsx           # Draft file management
│   │   │   ├── CopyeditingParticipants.jsx         # Participant list
│   │   │   └── CopyeditedFiles.jsx                 # Copyedited files
│   │   └── hooks/
│   │       ├── mutation/
│   │       │   ├── useCopyeditingAssignments.js    # Assignment mutations
│   │       │   ├── useCopyeditingFiles.js          # File mutations
│   │       │   └── useCopyeditingDiscussions.js    # Discussion mutations
│   │       └── query/
│   │           ├── useCopyeditingAssignments.js    # Assignment queries
│   │           └── useCopyeditingAssignmentParticipants.js
│   └── shared/components/SuperDoc/
│       ├── SuperDocEditor.jsx                      # Base SuperDoc editor
│       ├── CopyeditingSuperDocEditor.jsx           # Copyediting editor
│       └── ProductionSuperDocEditor.jsx            # Production editor
```

---

## Components

### 1. AddParticipantDialog

**Location:** `features/panel/editor/submission/components/copyediting/AddParticipantDialog.jsx`

**Purpose:** Dialog to add additional participants/collaborators to a copyediting assignment.

**Props:**

- `isOpen` (boolean): Controls dialog visibility
- `onClose` (function): Callback when dialog closes
- `assignmentId` (string): UUID of the copyediting assignment

**API Used:** `POST /api/v1/submissions/copyediting/assignments/{id}/add_participant/`

**Request Body:**

```json
{
  "profile_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Features:**

- SearchableSelect component for user selection
- Validates user selection before submission
- Invalidates queries on success for real-time updates
- Shows loading state during API call

**Usage:**

```jsx
import { AddParticipantDialog } from "@/features/panel/editor/submission/components/copyediting";

<AddParticipantDialog
  isOpen={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  assignmentId={assignmentId}
/>;
```

---

### 2. CopyeditingParticipants

**Location:** `features/panel/editor/submission/components/copyediting/CopyeditingParticipants.jsx`

**Purpose:** Display and manage all participants in a copyediting workflow.

**Props:**

- `assignmentId` (string): UUID of the copyediting assignment
- `isAuthorView` (boolean, optional): If true, hides add/remove participant buttons

**Features:**

- Lists all participants (copyeditor, assigned_by, author, additional participants)
- Shows participant roles with badges
- Displays assigned dates
- Add participant button (editor view only)
- Remove participant functionality (disabled by default, can be enabled)

**Usage:**

```jsx
// Editor view (with add participant button)
<CopyeditingParticipants assignmentId={assignmentId} />

// Author view (read-only)
<CopyeditingParticipants assignmentId={assignmentId} isAuthorView={true} />
```

---

### 3. CopyeditingSuperDocEditor

**Location:** `features/shared/components/SuperDoc/CopyeditingSuperDocEditor.jsx`

**Purpose:** Specialized SuperDoc editor for copyediting files with integrated load/save functionality.

**Props:**

- `fileId` (string): UUID of the copyediting file
- `userData` (object): Current user information (`{ first_name, email }`)
- `className` (string, optional): Additional CSS classes
- `readOnly` (boolean, optional): If true, editor is in view-only mode
- `commentsReadOnly` (boolean, optional): If true, comments cannot be edited
- `onSaveSuccess` (function, optional): Callback after successful save

**API Endpoints:**

- Load: `GET /api/v1/submissions/copyediting/files/{id}/load/`
- Save: `POST /api/v1/submissions/copyediting/files/{id}/save/`

**Features:**

- Automatic file loading on mount
- Manual save workflow (replaces existing file)
- Tracks `last_edited_by` and `last_edited_at`
- Shows unsaved changes badge
- Displays last editor info
- Export as DOCX format
- Full SuperDoc capabilities (track changes, comments, etc.)

**Save Workflow:**

1. User edits document in SuperDoc
2. `hasUnsavedChanges` becomes true
3. User clicks "Save Document" button
4. Document is exported as DOCX blob
5. Blob is sent via FormData to save endpoint
6. Server replaces existing file
7. `last_edited_by` and `last_edited_at` are updated
8. Queries are invalidated to refresh file lists

**Usage:**

```jsx
import CopyeditingSuperDocEditor from "@/features/shared/components/SuperDoc/CopyeditingSuperDocEditor";

<CopyeditingSuperDocEditor
  fileId={fileId}
  userData={{
    first_name: "John",
    email: "john@example.com",
  }}
  readOnly={false}
  onSaveSuccess={(updatedFile) => {
    console.log("File saved:", updatedFile);
  }}
/>;
```

---

### 4. ProductionSuperDocEditor

**Location:** `features/shared/components/SuperDoc/ProductionSuperDocEditor.jsx`

**Purpose:** Specialized SuperDoc editor for production files (galley creation and editing).

**Props:** Same as CopyeditingSuperDocEditor

**API Endpoints:**

- Load: `GET /api/v1/submissions/production/files/{id}/load/`
- Save: `POST /api/v1/submissions/production/files/{id}/save/`

**Features:** Same as CopyeditingSuperDocEditor but for production phase

**Usage:**

```jsx
import ProductionSuperDocEditor from "@/features/shared/components/SuperDoc/ProductionSuperDocEditor";

<ProductionSuperDocEditor
  fileId={galleyFileId}
  userData={userData}
  readOnly={false}
/>;
```

---

### 5. Author Copyediting Page

**Location:** `app/(panel)/author/submissions/active/[id]/copyediting/page.jsx`

**Purpose:** Author-facing copyediting workflow page with appropriate permissions.

**Route:** `/author/submissions/active/{submissionId}/copyediting`

**Features:**

- Same UI as editor copyediting page
- Tab-based interface (Draft Files, Copyedited Files, Discussions)
- **Draft Files:** Read-only for authors
- **Copyedited Files:** Editable for authors
- **Discussions:** Authors can reply
- Help sheet with copyediting guide
- No add/remove participant buttons (author view)

**Permissions:**

- ✅ View draft files (read-only)
- ✅ Edit copyedited files
- ✅ Reply to discussions
- ✅ View participants
- ❌ Edit draft files
- ❌ Assign/remove participants

---

## API Integration

### Copyediting API Functions

**Location:** `features/panel/editor/submission/api/copyeditingApi.js`

#### Assignment Management

```javascript
// List assignments
listCopyeditingAssignments(params);

// Create assignment
createCopyeditingAssignment(data);

// Get assignment
getCopyeditingAssignment(assignmentId);

// Update assignment
updateCopyeditingAssignment(assignmentId, data);

// Start assignment
startCopyeditingAssignment(assignmentId);

// Complete assignment
completeCopyeditingAssignment(assignmentId, data);

// Get assignment files
getCopyeditingAssignmentFiles(assignmentId);

// Get assignment discussions
getCopyeditingAssignmentDiscussions(assignmentId);

// Get assignment participants
getCopyeditingAssignmentParticipants(assignmentId);

// Add participant (NEW)
addCopyeditingParticipant(assignmentId, data);
// Request: { profile_id: "uuid" }
// Response: { detail: "Participant added successfully." }

// Remove participant (NEW)
removeCopyeditingParticipant(assignmentId, data);
// Request: { profile_id: "uuid" }
// Response: { detail: "Participant removed successfully." }
```

#### File Management

```javascript
// List files
listCopyeditingFiles(assignmentId);

// Upload file
uploadCopyeditingFile(formData);

// Get file
getCopyeditingFile(fileId);

// Update file
updateCopyeditingFile(fileId, data);

// Approve file
approveCopyeditingFile(fileId);

// Delete file
deleteCopyeditingFile(fileId);

// Load file for editing (NEW)
loadCopyeditingFile(fileId);
// Returns: { id, file_url, last_edited_by, last_edited_at, ... }

// Save file (manual save - replaces existing) (NEW)
saveCopyeditingFile(fileId, formData);
// Request: FormData with 'file' field
// Response: { status: "saved", message: "...", file: {...} }

// Download file (NEW)
downloadCopyeditingFile(fileId);
// Returns: Blob with file data
```

#### Discussion Management

```javascript
// List discussions
listCopyeditingDiscussions(assignmentId);

// Create discussion
createCopyeditingDiscussion(data);

// Get discussion
getCopyeditingDiscussion(discussionId);

// Update discussion
updateCopyeditingDiscussion(discussionId, data);

// Add message
addCopyeditingMessage(discussionId, data);

// Close discussion
closeCopyeditingDiscussion(discussionId);

// Reopen discussion
reopenCopyeditingDiscussion(discussionId);

// Delete discussion
deleteCopyeditingDiscussion(discussionId);
```

---

### Production API Functions

**Location:** `features/panel/editor/submission/api/productionApi.js`

Similar structure to copyediting API with production-specific endpoints:

```javascript
// Load production file (NEW)
loadProductionFile(fileId);

// Save production file (NEW)
saveProductionFile(fileId, formData);

// Download production file (NEW)
downloadProductionFile(fileId);

// Plus all standard assignment, file, and discussion functions
```

---

## Hooks

### Assignment Hooks

**Location:** `features/panel/editor/submission/hooks/mutation/useCopyeditingAssignments.js`

```javascript
import {
  useCreateCopyeditingAssignment,
  useUpdateCopyeditingAssignment,
  useStartCopyeditingAssignment,
  useCompleteCopyeditingAssignment,
  useAddCopyeditingParticipant, // NEW
  useRemoveCopyeditingParticipant, // NEW
} from "@/features/panel/editor/submission/hooks";

// Example usage
const addParticipant = useAddCopyeditingParticipant();

addParticipant.mutate(
  {
    assignmentId: "uuid",
    data: { profile_id: "uuid" },
  },
  {
    onSuccess: () => {
      console.log("Participant added");
    },
  }
);
```

**Hook Features:**

- Automatic query invalidation on success
- Toast notifications for success/error
- Loading states via `isPending`
- Error handling

---

## SuperDoc Integration

### Manual Save Workflow

The copyediting and production SuperDoc editors implement a **manual save workflow** instead of automatic version creation:

**Key Differences:**

| Feature          | Standard SuperDoc    | Copyediting/Production SuperDoc       |
| ---------------- | -------------------- | ------------------------------------- |
| Save Behavior    | Creates new version  | Replaces existing file                |
| Version Tracking | Automatic versioning | Manual version creation               |
| File History     | Multiple versions    | Single file with last_edited tracking |
| Load Endpoint    | Document-specific    | File-specific with /load/             |
| Save Endpoint    | Document-specific    | File-specific with /save/             |

**Why Manual Save?**

- Copyediting requires iterative editing without creating dozens of versions
- Authors and copyeditors collaborate on the same file
- Final version is explicitly created when copyediting is complete
- Reduces database clutter and storage costs

**Tracking Changes:**

Instead of versions, the system tracks:

- `last_edited_by`: Profile object of last editor
- `last_edited_at`: Timestamp of last save
- These fields are displayed in the editor header

---

## Permissions Matrix

### Editor vs Author Permissions

| Action                | Editor | Author         | Copyeditor |
| --------------------- | ------ | -------------- | ---------- |
| View draft files      | ✅     | ✅ (read-only) | ✅         |
| Edit draft files      | ✅     | ❌             | ✅         |
| View copyedited files | ✅     | ✅             | ✅         |
| Edit copyedited files | ✅     | ✅             | ✅         |
| Create assignment     | ✅     | ❌             | ❌         |
| Start assignment      | ✅     | ❌             | ✅         |
| Complete assignment   | ✅     | ❌             | ✅         |
| Add participant       | ✅     | ❌             | ❌         |
| Remove participant    | ✅     | ❌             | ❌         |
| View participants     | ✅     | ✅             | ✅         |
| Create discussion     | ✅     | ✅\*           | ✅         |
| Reply to discussion   | ✅     | ✅             | ✅         |
| Close discussion      | ✅     | ❌             | ❌         |
| Approve file          | ✅     | ❌             | ❌         |

\*Authors may have restrictions on starting new discussions depending on implementation

---

## Workflow Diagrams

### Complete Copyediting Flow

```
1. MANUSCRIPT ACCEPTED
   ├─> Editor creates copyediting assignment
   └─> System creates INITIAL_DRAFT file from submission

2. COPYEDITOR ASSIGNED
   ├─> Copyeditor receives notification
   ├─> Copyeditor starts assignment
   └─> Status: IN_PROGRESS

3. COPYEDITOR EDITS FILES
   ├─> Load draft file via CopyeditingSuperDocEditor
   ├─> Make edits with track changes
   ├─> Save progress (manual saves replace file)
   ├─> Continue editing
   └─> Save again (file updated, last_edited_at refreshed)

4. COPYEDITOR COMPLETES WORK
   ├─> Create COPYEDITED_VERSION file
   ├─> Mark assignment as complete
   └─> Author receives notification

5. AUTHOR REVIEWS COPYEDITED VERSION
   ├─> Author accesses /author/submissions/active/{id}/copyediting
   ├─> Views copyedited file (with track changes)
   ├─> Accepts/rejects changes
   ├─> Makes additional edits if needed
   ├─> Saves changes
   └─> Uses discussions for queries

6. DISCUSSION THREAD
   ├─> Copyeditor/Author exchange messages
   ├─> Clarify edits and queries
   ├─> Resolve issues
   └─> Editor closes discussion when resolved

7. FINAL APPROVAL
   ├─> Editor reviews all changes
   ├─> Creates FINAL_VERSION file
   ├─> Approves file
   └─> Moves to production phase

8. PRODUCTION PHASE
   ├─> Production assignment created
   ├─> Galleys created (PDF, HTML, etc.)
   └─> Article scheduled for publication
```

### Participant Management Flow

```
1. INITIAL PARTICIPANTS (Auto-assigned)
   ├─> Copyeditor (assigned via assignment creation)
   ├─> Assigned By (editor who created assignment)
   └─> Author (submission author)

2. ADD ADDITIONAL PARTICIPANTS
   ├─> Editor clicks "Add Participant" button
   ├─> AddParticipantDialog opens
   ├─> Editor searches for user by name/email
   ├─> Selects user from SearchableSelect
   ├─> Submit with profile_id
   ├─> POST /assignments/{id}/add_participant/
   └─> Participant added to assignment

3. PARTICIPANT ACCESS
   ├─> All participants can:
   │   ├─> View files
   │   ├─> View discussions
   │   └─> Reply to discussions
   └─> Access controlled by role permissions

4. REMOVE PARTICIPANTS (Optional)
   ├─> Editor clicks remove button (if enabled)
   ├─> Confirmation dialog
   ├─> POST /assignments/{id}/remove_participant/
   └─> Participant removed from assignment
```

### File Save Workflow (SuperDoc)

```
1. LOAD FILE
   ├─> Component calls loadCopyeditingFile(fileId)
   ├─> GET /api/v1/submissions/copyediting/files/{id}/load/
   ├─> Response: { id, file_url, last_edited_by, last_edited_at, ... }
   └─> SuperDoc initializes with file_url

2. USER EDITS
   ├─> User makes changes in SuperDoc editor
   ├─> onEditorUpdate() callback fires
   ├─> hasUnsavedChanges = true
   └─> "Unsaved Changes" badge appears

3. MANUAL SAVE
   ├─> User clicks "Save Document" button
   ├─> superDoc.export({ triggerDownload: false })
   ├─> Get DOCX blob
   ├─> Create FormData with blob
   └─> POST /api/v1/submissions/copyediting/files/{id}/save/

4. BACKEND PROCESSING
   ├─> Server receives file
   ├─> Validates file
   ├─> Stores old file path
   ├─> Replaces file in database
   ├─> Updates: file_size, mime_type, original_filename
   ├─> Sets: last_edited_by = current_user
   ├─> Sets: last_edited_at = now()
   └─> Deletes old file from disk

5. FRONTEND UPDATE
   ├─> Save mutation onSuccess fires
   ├─> hasUnsavedChanges = false
   ├─> fileData updated with new last_edited info
   ├─> Queries invalidated
   ├─> "File saved successfully" toast
   └─> Badge shows new last_edited_by info
```

---

## Usage Examples

### Example 1: Editor Assigning Copyeditor

```jsx
import { useState } from "react";
import { AssignCopyeditorDialog } from "@/features/panel/editor/submission/components/copyediting";

function EditorCopyeditingPage() {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const submissionId = "uuid";

  return (
    <>
      <Button onClick={() => setIsAssignDialogOpen(true)}>
        Assign Copyeditor
      </Button>

      <AssignCopyeditorDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        submissionId={submissionId}
      />
    </>
  );
}
```

### Example 2: Adding Participant to Assignment

```jsx
import { useState } from "react";
import { AddParticipantDialog } from "@/features/panel/editor/submission/components/copyediting";

function ParticipantManagement({ assignmentId }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsAddDialogOpen(true)}>Add Participant</Button>

      <AddParticipantDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        assignmentId={assignmentId}
      />
    </>
  );
}
```

### Example 3: Copyeditor Editing File

```jsx
import CopyeditingSuperDocEditor from "@/features/shared/components/SuperDoc/CopyeditingSuperDocEditor";
import { useUser } from "@/features";

function CopyeditorEditPage({ fileId }) {
  const { data: user } = useUser();

  const handleSaveSuccess = (updatedFile) => {
    console.log("File saved by:", updatedFile.last_edited_by.name);
    console.log("Saved at:", updatedFile.last_edited_at);
  };

  return (
    <CopyeditingSuperDocEditor
      fileId={fileId}
      userData={{
        first_name: user?.first_name,
        email: user?.email,
      }}
      readOnly={false}
      onSaveSuccess={handleSaveSuccess}
    />
  );
}
```

### Example 4: Author Reviewing Copyedited File

```jsx
import CopyeditingSuperDocEditor from "@/features/shared/components/SuperDoc/CopyeditingSuperDocEditor";

function AuthorReviewPage({ fileId, userData }) {
  return (
    <div>
      <h2>Review Copyedited File</h2>
      <p>You can accept/reject tracked changes and make additional edits.</p>

      <CopyeditingSuperDocEditor
        fileId={fileId}
        userData={userData}
        readOnly={false}
        commentsReadOnly={false}
      />
    </div>
  );
}
```

### Example 5: Production Galley Creation

```jsx
import ProductionSuperDocEditor from "@/features/shared/components/SuperDoc/ProductionSuperDocEditor";

function GalleyCreationPage({ galleyFileId, userData }) {
  const handleGalleySave = (updatedGalley) => {
    console.log("Galley updated:", updatedGalley);
    // Trigger PDF generation or other post-processing
  };

  return (
    <div>
      <h2>Create Production Galley</h2>

      <ProductionSuperDocEditor
        fileId={galleyFileId}
        userData={userData}
        readOnly={false}
        onSaveSuccess={handleGalleySave}
      />
    </div>
  );
}
```

---

## Best Practices

### 1. Error Handling

Always handle errors from mutations:

```jsx
const addParticipant = useAddCopyeditingParticipant();

addParticipant.mutate(
  { assignmentId, data: { profile_id } },
  {
    onSuccess: () => {
      // Success handling
    },
    onError: (error) => {
      console.error("Failed to add participant:", error);
      // Error is already toasted by the hook
    },
  }
);
```

### 2. Query Invalidation

When data changes, invalidate relevant queries:

```jsx
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// After adding participant
queryClient.invalidateQueries({
  queryKey: ["copyediting-participants"],
});
queryClient.invalidateQueries({
  queryKey: ["copyediting-assignment", assignmentId],
});
```

### 3. Loading States

Show loading indicators during async operations:

```jsx
const { data, isPending, error } = useCopyeditingAssignments({
  submission: submissionId,
});

if (isPending) return <LoadingScreen />;
if (error) return <ErrorCard onRetry={refetch} />;
```

### 4. Permissions Checks

Always check user permissions before rendering actions:

```jsx
// Example: Only show add participant button for editors
{
  currentRole === "EDITOR" && !isAuthorView && (
    <Button onClick={() => setIsAddDialogOpen(true)}>Add Participant</Button>
  );
}
```

### 5. SuperDoc Cleanup

SuperDoc editors handle cleanup automatically, but be aware:

```jsx
useEffect(() => {
  // SuperDoc initialization

  return () => {
    // Cleanup is handled by the component
    // superDocInstanceRef.current.destroy() is called automatically
  };
}, [fileId]);
```

---

## Troubleshooting

### Issue: SuperDoc Editor Not Loading

**Symptoms:** Blank editor area, console errors

**Solutions:**

1. Check `file_url` is valid and accessible
2. Verify CORS settings for file downloads
3. Ensure SuperDoc package is installed: `@harbour-enterprises/superdoc`
4. Check network tab for failed file requests

### Issue: Participant Not Added

**Symptoms:** Error toast "Failed to add participant"

**Solutions:**

1. Verify `profile_id` is valid UUID
2. Check user is not already a participant
3. Confirm user is not the copyeditor or assigned_by
4. Check backend logs for validation errors

### Issue: File Save Fails

**Symptoms:** Save button disabled, error toast

**Solutions:**

1. Ensure file size is within limits
2. Verify user has edit permissions
3. Check network connectivity
4. Confirm backend `/save/` endpoint is working
5. Validate FormData is constructed correctly

### Issue: Author Cannot Edit Copyedited Files

**Symptoms:** Editor is in read-only mode for author

**Solutions:**

1. Verify `readOnly` prop is set to `false` on author copyediting page
2. Check assignment status allows author editing
3. Confirm author has access to copyediting phase

---

## Future Enhancements

### Planned Features

1. **Real-time Collaboration**

   - WebSocket integration for live editing
   - Show active users editing the same file
   - Real-time cursor positions

2. **Version Comparison**

   - Side-by-side diff view
   - Track changes timeline
   - Rollback to previous saves

3. **Automated Notifications**

   - Email alerts for new assignments
   - Push notifications for discussion replies
   - Deadline reminders

4. **Advanced Permissions**

   - Granular file-level permissions
   - Role-based access control (RBAC)
   - Custom permission sets

5. **Analytics Dashboard**
   - Copyediting turnaround times
   - Participant activity metrics
   - File edit statistics

---

## Conclusion

This document provides a comprehensive guide to the copyediting workflow frontend implementation. The modular architecture, clear separation of concerns, and well-defined APIs make it easy to maintain and extend the system.

For questions or contributions, please refer to the main project documentation or contact the development team.

**Last Updated:** December 10, 2025  
**Version:** 1.0.0
