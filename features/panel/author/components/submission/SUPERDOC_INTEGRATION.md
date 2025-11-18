# SuperDoc Integration for Author Submissions

## Overview

This integration allows authors to edit their submitted documents using SuperDoc editor with read-only access to reviewer comments.

## Files Created

### 1. `superdocApi.js`

API functions for SuperDoc operations:

- `loadDocument(documentId)` - Load document with metadata, file URL, and Yjs state
- `saveYjsState(documentId, yjsStateBase64)` - Save Yjs state to backend
- `exportDocx(documentId, docxBlob)` - Export document as DOCX
- `downloadDocx(documentId)` - Download document as DOCX

### 2. `SuperDocEditorModal.jsx`

Modal component for SuperDoc editor:

- Loads document data from backend
- Shows document info and edit permissions
- Provides save and download functionality
- **Note**: Currently shows placeholder - actual SuperDoc library integration needed

### 3. Updated `DocumentViewModal.jsx`

- Added "Edit" button for each document
- Opens SuperDocEditorModal when clicked
- Maintains existing download functionality

## Backend Endpoints Used

All endpoints are under `/api/v1/submissions/documents/{document_id}/`:

1. **GET** `/load/` - Load document for editing
   - Returns: document metadata, file URL, Yjs state (if exists), edit permissions
2. **POST** `/save-state/` - Save Yjs state
   - Body: `{ "yjs_state": "base64_encoded_state" }`
3. **POST** `/export/` - Export as DOCX
   - Body: FormData with DOCX file
4. **GET** `/download/` - Download DOCX
   - Returns: DOCX file blob

## Permissions

Based on backend `SuperDocPermission` class:

- **Corresponding Author**: Full access (view + edit)
- **Co-authors**: View and comment only (edit=False)
- **Reviewers**: View and comment only (edit=False)
- **Admin/Staff**: Full access
- **Journal Editors**: Full access

## Author Role Restrictions

- Authors can **edit** document content
- Authors can **view** reviewer comments (read-only)
- Authors **cannot add** new comments
- Comment creation is disabled for author role

## Next Steps - SuperDoc Library Integration

To complete the integration, you need to:

### 1. Install SuperDoc Library

```bash
npm install superdoc
# or
yarn add superdoc
```

### 2. Update SuperDocEditorModal.jsx

Replace the placeholder section with actual SuperDoc initialization:

```jsx
import { SuperDoc } from "superdoc";

// In component:
useEffect(() => {
  if (documentData && documentData.file_url) {
    const superdoc = new SuperDoc({
      container: document.getElementById("superdoc-editor"),
      fileUrl: documentData.file_url,
      editable: documentData.can_edit,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        role: "author", // Disable comment creation for author
      },
      comments: {
        enabled: true,
        readOnly: true, // Authors can only read comments
      },
      onSave: async (yjsState) => {
        const base64State = btoa(
          String.fromCharCode.apply(null, new Uint8Array(yjsState))
        );
        await saveMutation.mutateAsync({
          docId: documentId,
          yjsState: base64State,
        });
      },
    });

    return () => superdoc.destroy();
  }
}, [documentData]);
```

### 3. Configure Comment Permissions

Ensure SuperDoc is configured to:

- Show existing comments from reviewers
- Disable comment creation UI for authors
- Allow read-only access to all comments

### 4. Auto-save Implementation

Add periodic auto-save:

```jsx
useEffect(() => {
  if (!documentData?.can_edit) return;

  const interval = setInterval(() => {
    const yjsState = superdoc.getYjsState();
    const base64State = btoa(
      String.fromCharCode.apply(null, new Uint8Array(yjsState))
    );
    saveMutation.mutate({ docId: documentId, yjsState: base64State });
  }, 30000); // Save every 30 seconds

  return () => clearInterval(interval);
}, [documentData]);
```

## Testing

1. **As Author**:

   - Go to Author Submissions page
   - Click "View Documents" on any submission
   - Click "Edit" button on a document
   - Verify SuperDoc editor opens
   - Verify you can edit content
   - Verify reviewer comments are visible but read-only
   - Verify you cannot add new comments

2. **As Reviewer** (for comparison):
   - Should be able to add comments
   - Should be able to view document

## Document Type Support

Currently supports: **DOCX files only**

SuperDoc handles DOCX conversion in the browser, no backend conversion needed.

## Security Notes

- Backend enforces permissions via `SuperDocPermission` class
- Frontend `can_edit` flag controls editor mode
- Yjs state is stored as binary data in backend
- Original DOCX file is preserved separately

## API Response Example

```json
{
  "id": "uuid",
  "title": "Research Paper",
  "document_type": "MANUSCRIPT",
  "can_edit": true,
  "file_url": "https://example.com/media/documents/file.docx",
  "file_name": "research-paper.docx",
  "file_size": 245760,
  "yjs_state": "base64_encoded_binary_data",
  "created_at": "2025-11-18T10:00:00Z",
  "updated_at": "2025-11-18T10:30:00Z",
  "last_edited_at": "2025-11-18T10:30:00Z",
  "last_edited_by": {
    "id": "user_uuid",
    "name": "John Doe"
  }
}
```
