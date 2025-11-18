# SuperDoc Full Integration Guide

## Overview

This document outlines the complete SuperDoc integration for the Journal Portal, enabling collaborative document editing with live comments, auto-save functionality, and reviewer notifications.

## Architecture

### Components

#### 1. SuperDocEditorModal (`features/panel/author/components/submission/SuperDocEditorModal.jsx`)

The main editor modal component with the following features:

**Features:**

- **Three-column layout**: Editor (66%) + Comments sidebar (33%)
- **Auto-save**: Saves changes every 30 seconds automatically
- **Live collaboration**: Ready for Yjs CRDT integration
- **Review comments display**: Shows reviewer feedback in sidebar
- **Permission-based editing**: Authors can edit, co-authors view-only
- **Submit workflow**: Submit button notifies reviewers of updates

**Props:**

```javascript
{
  open: boolean,              // Modal visibility
  onOpenChange: function,     // Close handler
  documentId: string,         // Document ID to edit
  submissionId: string        // Submission ID for comments
}
```

**State Management:**

- `hasUnsavedChanges`: Tracks if document has modifications
- `editorRef`: Reference to SuperDoc editor instance
- `autoSaveIntervalRef`: Auto-save timer reference

**API Integration:**

- `loadDocument(documentId)`: Load document, file URL, Yjs state
- `saveYjsState(documentId, yjsState)`: Save collaborative state
- `downloadDocx(documentId)`: Download DOCX file
- `getReviewComments(submissionId)`: Fetch reviewer comments
- `submitUpdatedDocument(documentId, submissionId)`: Submit and notify

#### 2. DocumentViewModal (`features/panel/author/components/submission/DocumentViewModal.jsx`)

Lists all submission documents with Edit and Download actions.

**Updated:**

- Passes `submissionId` prop to `SuperDocEditorModal`
- Opens editor modal when Edit button clicked

#### 3. SuperDoc API (`features/panel/author/api/superdocApi.js`)

Complete API layer for SuperDoc operations.

**Functions:**

```javascript
// Load document with Yjs state
loadDocument(documentId) → {
  id, title, document_type, can_edit,
  file_url, file_name, file_size,
  yjs_state (base64), last_edited_at, last_edited_by
}

// Save Yjs collaborative state
saveYjsState(documentId, yjsStateBase64)

// Export edited document
exportDocx(documentId, docxBlob)

// Download document
downloadDocx(documentId) → Blob

// Submit document for review
submitUpdatedDocument(documentId, submissionId)

// Get reviewer comments
getReviewComments(submissionId) → {
  results: [{ id, reviewer_name, review_text,
             recommendation, created_at }]
}
```

## Backend API Endpoints

### SuperDoc Endpoints (`/api/submissions/documents/{id}/`)

#### 1. Load Document

```
GET /api/submissions/documents/{id}/load/
Response:
{
  "id": "uuid",
  "title": "Manuscript.docx",
  "document_type": "MANUSCRIPT",
  "can_edit": true,
  "file_url": "https://.../document.docx",
  "file_name": "Manuscript.docx",
  "file_size": 1024000,
  "yjs_state": "base64_encoded_state",
  "last_edited_at": "2024-01-01T12:00:00Z",
  "last_edited_by": { "id": 1, "name": "John Doe" }
}
```

#### 2. Save Yjs State

```
POST /api/submissions/documents/{id}/save-state/
Body: { "yjs_state": "base64_encoded_state" }
Response: { "success": true, "saved_at": "timestamp" }
```

#### 3. Export Document

```
POST /api/submissions/documents/{id}/export/
Body: FormData with "file" = docx blob
Response: { "download_url": "...", "version": 2 }
```

#### 4. Download Document

```
GET /api/submissions/documents/{id}/download/
Response: DOCX file blob
```

### Submission Endpoints

#### Submit Updated Document

```
POST /api/submissions/{id}/submit-updated-document/
Body: { "document_id": "uuid" }
Response: { "success": true, "notified_reviewers": [...] }
```

### Review Endpoints

#### Get Review Comments

```
GET /api/reviews/?submission_id={id}
Response: {
  "results": [
    {
      "id": 1,
      "reviewer_name": "Dr. Smith",
      "review_text": "Please clarify section 3...",
      "recommendation": "MINOR_REVISION",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

## SuperDoc Library Integration

### Installation

```bash
npm install @superdoc/editor
# or
yarn add @superdoc/editor
```

### Implementation Steps

#### 1. Initialize SuperDoc Editor

Replace the placeholder in `SuperDocEditorModal.jsx`:

```jsx
import { SuperDocEditor } from "@superdoc/editor";
import "@superdoc/editor/dist/styles.css";

// Inside component
const [editor, setEditor] = useState(null);

useEffect(() => {
  if (!documentData || !editorRef.current) return;

  // Initialize SuperDoc
  const editorInstance = new SuperDocEditor({
    container: editorRef.current,

    // Load DOCX from URL
    documentUrl: documentData.file_url,

    // Collaborative editing with Yjs
    collaboration: {
      enabled: true,
      yjsState: documentData.yjs_state
        ? Uint8Array.from(atob(documentData.yjs_state), (c) => c.charCodeAt(0))
        : null,
      userName: userData?.name || "Anonymous",
      userColor: generateUserColor(userData?.id),
    },

    // Permissions
    readOnly: !documentData.can_edit,

    // Comments
    comments: {
      enabled: true,
      readOnly: true, // Authors cannot add comments
      loadComments: async () => {
        const data = await getReviewComments(submissionId);
        return data.results.map((c) => ({
          id: c.id,
          author: c.reviewer_name,
          text: c.review_text,
          timestamp: new Date(c.created_at),
          position: c.position, // Requires backend support
        }));
      },
    },

    // Auto-save on change
    onChange: () => {
      handleEditorChange();
    },
  });

  setEditor(editorInstance);
  editorRef.current = editorInstance;

  return () => {
    editorInstance.destroy();
  };
}, [documentData, submissionId]);
```

#### 2. Implement Save Handler

```jsx
const handleSave = useCallback(
  (silent = false) => {
    if (!editorRef.current) return;

    try {
      // Extract Yjs state
      const yjsState = editorRef.current.getYjsState();
      const base64State = btoa(
        String.fromCharCode.apply(null, new Uint8Array(yjsState))
      );

      // Save to backend
      saveMutation.mutate({
        docId: documentId,
        yjsState: base64State,
      });

      if (!silent) {
        toast.success("Document saved successfully");
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Save failed:", error);
      if (!silent) {
        toast.error("Failed to save document");
      }
    }
  },
  [documentId, saveMutation]
);
```

#### 3. Export Document on Submit

```jsx
const handleSubmit = async () => {
  if (hasUnsavedChanges) {
    toast.error("Please save your changes before submitting");
    return;
  }

  try {
    // Export DOCX
    const docxBlob = await editorRef.current.exportDocx();

    // Upload to backend
    await exportDocx(documentId, docxBlob);

    // Submit for review
    await submitMutation.mutateAsync();
  } catch (error) {
    toast.error("Submission failed: " + error.message);
  }
};
```

## UI Layout

### Editor Modal Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Document Editor [Unsaved Changes]                    [×]    │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────┐ ┌──────────────────────────┐  │
│ │                          │ │  Reviewer Comments (3)   │  │
│ │                          │ ├──────────────────────────┤  │
│ │                          │ │  Dr. Smith               │  │
│ │   SuperDoc Editor        │ │  [MINOR_REVISION]        │  │
│ │   (Collaborative DOCX)   │ │  "Please clarify..."     │  │
│ │                          │ ├──────────────────────────┤  │
│ │                          │ │  Dr. Jones               │  │
│ │                          │ │  [ACCEPT]                │  │
│ │                          │ │  "Excellent work..."     │  │
│ │                          │ └──────────────────────────┘  │
│ └──────────────────────────┘                              │
├─────────────────────────────────────────────────────────────┤
│ [Close]    [Download] [Save] [Submit for Review]          │
└─────────────────────────────────────────────────────────────┘
```

### Features

#### Auto-Save Indicator

- Shows "Unsaved Changes" badge when document is modified
- Auto-saves every 30 seconds
- Save button disabled when no changes

#### Comments Sidebar

- Displays all reviewer comments
- Shows reviewer name, recommendation badge
- Read-only for authors
- Scrollable list

#### Action Buttons

- **Close**: Exit without saving (warns if unsaved changes)
- **Download**: Download current DOCX version
- **Save**: Manual save (disabled if no changes)
- **Submit for Review**: Export, upload, and notify reviewers

## Permissions

### Backend Permissions (`apps/superdoc/permissions.py`)

```python
class SuperDocPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Corresponding author: full edit access
        if obj.submission.corresponding_author == request.user:
            return True

        # Co-authors: view-only
        if request.user in obj.submission.co_authors.all():
            return request.method in SAFE_METHODS

        # Reviewers: view + comment (handled separately)
        if Review.objects.filter(
            submission=obj.submission,
            reviewer=request.user
        ).exists():
            return request.method in SAFE_METHODS

        return False
```

### Frontend Permissions

```javascript
// Edit button visibility
{
  documentData?.can_edit && (
    <Button onClick={() => handleEdit(doc.id)}>
      <Edit className="h-4 w-4" />
    </Button>
  );
}

// SuperDoc readOnly mode
readOnly: !documentData.can_edit;

// Comments readOnly for authors
comments: {
  readOnly: true;
}
```

## Workflow

### 1. Author Opens Document

```
Author clicks "Edit" → DocumentViewModal opens SuperDocEditorModal
→ loadDocument(documentId) fetches file_url, yjs_state, permissions
→ SuperDoc initializes with DOCX from file_url
→ Yjs state loaded for collaboration
→ Reviewer comments fetched and displayed in sidebar
```

### 2. Author Edits Document

```
Author types in editor → onChange fired → hasUnsavedChanges = true
→ Auto-save triggers every 30 seconds → saveYjsState(yjsState)
→ Backend stores Yjs binary state
→ "Unsaved Changes" badge shown
```

### 3. Author Submits for Review

```
Author clicks "Submit for Review" → Validate no unsaved changes
→ Export DOCX from SuperDoc editor
→ exportDocx(documentId, docxBlob) uploads new version
→ submitUpdatedDocument(documentId, submissionId)
→ Backend creates notification for assigned reviewers
→ Email sent to reviewers
→ Modal closes, submissions list refreshes
```

### 4. Reviewer Receives Notification

```
Reviewer receives email → Opens submission
→ Sees updated document with new version number
→ Can view document in SuperDoc (read-only)
→ Adds comments (stored separately in reviews table)
```

## Testing

### Manual Testing Steps

1. **Load Document**

   ```
   - Open author submissions page
   - Click on a submission
   - Click "Edit" on a document
   - Verify SuperDoc modal opens
   - Verify document info displayed
   - Verify comments sidebar visible
   ```

2. **Edit Document**

   ```
   - Make changes to document text
   - Verify "Unsaved Changes" badge appears
   - Wait 30 seconds
   - Verify toast shows "Auto-saved"
   - Click "Save" manually
   - Verify badge disappears
   ```

3. **View Comments**

   ```
   - Check comments sidebar
   - Verify reviewer name, recommendation badge shown
   - Verify comment text displayed
   - Verify comments are read-only
   ```

4. **Download Document**

   ```
   - Click "Download" button
   - Verify DOCX file downloads
   - Open in Word/LibreOffice
   - Verify content matches editor
   ```

5. **Submit for Review**
   ```
   - Make changes and save
   - Click "Submit for Review"
   - Verify success toast
   - Check reviewer email
   - Verify notification received
   ```

### API Testing

```bash
# Load document
curl -X GET http://localhost:8000/api/submissions/documents/{id}/load/ \
  -H "Authorization: Bearer {token}"

# Save Yjs state
curl -X POST http://localhost:8000/api/submissions/documents/{id}/save-state/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"yjs_state": "base64_encoded_state"}'

# Get review comments
curl -X GET http://localhost:8000/api/reviews/?submission_id={id} \
  -H "Authorization: Bearer {token}"

# Submit document
curl -X POST http://localhost:8000/api/submissions/{id}/submit-updated-document/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"document_id": "uuid"}'
```

## Future Enhancements

### 1. Real-time Collaboration

- Implement WebSocket connections for live presence
- Show active users editing the document
- Display cursors and selections in real-time

### 2. Version History

- Track all document versions
- Allow authors to view/restore previous versions
- Show diff between versions

### 3. Advanced Comments

- Allow authors to reply to reviewer comments
- Mark comments as "Resolved"
- Thread discussions on specific text ranges

### 4. Offline Support

- Cache Yjs state in IndexedDB
- Queue save operations when offline
- Sync when connection restored

### 5. Export Formats

- Export to PDF
- Export to LaTeX
- Export to XML (JATS format for journals)

## Troubleshooting

### Common Issues

#### 1. Document Not Loading

```
Problem: Modal opens but document doesn't load
Solution:
- Check documentId is valid UUID
- Verify file_url is accessible
- Check browser console for CORS errors
- Ensure backend permissions correct
```

#### 2. Auto-Save Not Working

```
Problem: Changes not auto-saving
Solution:
- Verify editorRef.current is set
- Check hasUnsavedChanges state updating
- Verify auto-save interval running
- Check saveYjsState API not returning errors
```

#### 3. Comments Not Displaying

```
Problem: Sidebar empty despite reviews existing
Solution:
- Check submissionId prop passed correctly
- Verify getReviewComments API returns data
- Check review_text field not null in database
- Verify Review queryset filtered correctly
```

#### 4. Submit Button Disabled

```
Problem: Cannot click "Submit for Review"
Solution:
- Save document first (hasUnsavedChanges must be false)
- Verify can_edit permission is true
- Check submitMutation not already pending
```

## Security Considerations

### 1. File Access Control

- Verify user has permission before serving file_url
- Use signed URLs with expiration for document downloads
- Validate document ownership in all API endpoints

### 2. Yjs State Validation

- Validate base64 encoding before storage
- Limit Yjs state size (e.g., max 10MB)
- Sanitize state before applying to editor

### 3. Comment Access

- Never show confidential_comments to authors
- Filter review comments by submission access
- Validate reviewer identity before creating comments

### 4. Rate Limiting

- Limit auto-save frequency (max 1 per 30 seconds)
- Throttle submit-document API (max 5 per hour)
- Prevent spam submissions

## Deployment

### Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.journalportal.com
NEXT_PUBLIC_SUPERDOC_CDN=https://cdn.superdoc.com

# Backend (settings.py)
SUPERDOC_STORAGE_BACKEND='s3'  # or 'local'
SUPERDOC_S3_BUCKET='journal-documents'
SUPERDOC_MAX_FILE_SIZE=10485760  # 10MB
```

### Build & Deploy

```bash
# Frontend
cd journal-portal-frontend
npm install @superdoc/editor
npm run build
npm run start

# Backend
cd journal-portal-backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
gunicorn journal_portal.wsgi
```

## Conclusion

This SuperDoc integration provides a complete solution for collaborative document editing in the Journal Portal. Authors can edit manuscripts with live collaboration, view reviewer feedback, and submit updates seamlessly. The system is designed for extensibility, security, and performance.

**Status**: Ready for SuperDoc library integration
**Next Steps**:

1. Install SuperDoc library
2. Replace placeholder with actual SuperDoc initialization
3. Test collaborative editing with multiple users
4. Implement real-time WebSocket connections
5. Deploy to production

---

**Documentation Version**: 1.0  
**Last Updated**: 2024  
**Author**: GitHub Copilot
