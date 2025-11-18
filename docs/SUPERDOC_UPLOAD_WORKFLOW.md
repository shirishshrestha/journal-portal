# SuperDoc Document Upload and Initialization Workflow

## Overview

This document provides a comprehensive guide to the document upload workflow in the Journal Portal, covering the complete lifecycle from initial DOCX upload to SuperDoc editor initialization with Yjs collaborative state.

## Architecture Components

### Frontend Components

1. **DocumentUploadModal** - Single document upload with automatic Yjs initialization
2. **SuperDocEditorPage** - Full-page collaborative editor with @harbour-enterprises/superdoc
3. **superdocApi** - API layer for all SuperDoc operations

### Backend Components

1. **Document Model** - Stores document metadata, DOCX files, and Yjs binary state
2. **SuperDocViewSet** - RESTful API endpoints for document operations
3. **Storage** - Handles DOCX file storage and retrieval

---

## Complete Upload Workflow

### Step 1: Document Upload

**Location:** `features/panel/author/components/submission/DocumentUploadModal.jsx`

```javascript
// 1. User selects DOCX file and fills metadata
const data = new FormData();
data.append("title", "My Manuscript");
data.append("document_type", "MANUSCRIPT");
data.append("description", "Initial submission");
data.append("file", docxFile); // DOCX file blob

// 2. Upload to backend
const response = await uploadMutation.mutateAsync({
  id: submissionId,
  data,
});
```

**Backend Endpoint:** `POST /api/v1/submissions/{submissionId}/upload-document/`

**What happens:**

- Backend receives DOCX file and metadata
- Creates new `Document` record in database
- Stores DOCX file in storage (e.g., AWS S3, local filesystem)
- Returns document ID and metadata
- **Note:** `yjs_state` field is initially `NULL`

**Backend Response:**

```json
{
  "id": "uuid-of-document",
  "title": "My Manuscript",
  "document_type": "MANUSCRIPT",
  "file_url": "https://storage/documents/2024/01/manuscript.docx",
  "file_name": "manuscript.docx",
  "file_size": 524288,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Step 2: Yjs State Initialization

**Location:** `features/panel/author/components/submission/DocumentUploadModal.jsx`

```javascript
// 3. After successful upload, initialize empty Yjs state
if (response?.id) {
  const emptyYjsState = ""; // Empty string for new documents
  await initYjsStateMutation.mutateAsync({
    documentId: response.id,
    yjsState: emptyYjsState,
  });
}
```

**Backend Endpoint:** `POST /api/v1/submissions/documents/{documentId}/save-state/`

**Request Body:**

```json
{
  "yjs_state": "" // Empty base64 string for initialization
}
```

**What happens:**

- Backend receives empty Yjs state (base64 encoded)
- If empty string, stores `NULL` in `yjs_state` field
- Updates `last_edited_at` and `last_edited_by`
- Document is now ready for SuperDoc editor

**Why initialize with empty state?**

- Ensures document is properly registered in the system
- Prevents issues when loading in SuperDoc editor
- First edit will create actual Yjs state with document content

---

## SuperDoc Editor Workflow

### Step 3: Loading Document in Editor

**Location:** `app/(panel)/author/submissions/drafts/[id]/editor/[documentId]/page.jsx`

```javascript
// 1. Fetch document data from backend
const loadDocumentQuery = useQuery({
  queryKey: ["document", documentId],
  queryFn: () => loadDocument(documentId),
});

const documentData = loadDocumentQuery.data;
```

**Backend Endpoint:** `GET /api/v1/submissions/documents/{documentId}/load/`

**Backend Response:**

```json
{
  "id": "uuid",
  "title": "My Manuscript",
  "document_type": "MANUSCRIPT",
  "can_edit": true,
  "file_url": "https://storage/documents/2024/01/manuscript.docx",
  "file_name": "manuscript.docx",
  "file_size": 524288,
  "yjs_state": null, // NULL for new documents, base64 string for existing
  "last_edited_at": "2024-01-15T10:35:00Z",
  "last_edited_by": {
    "id": "user-uuid",
    "name": "John Doe"
  }
}
```

### Step 4: SuperDoc Initialization

**Location:** `app/(panel)/author/submissions/drafts/[id]/editor/[documentId]/page.jsx`

```javascript
// 2. Initialize SuperDoc with DOCX file
useEffect(() => {
  if (!documentData?.file_url || !editorRef.current) return;

  const superdoc = new SuperDoc({
    container: editorRef.current,
    fileUrl: documentData.file_url, // Original DOCX from backend
    editable: documentData.can_edit,
    user: {
      id: user.id,
      name: user.name,
      role: "author",
    },
    onReady: () => {
      console.log("SuperDoc initialized");

      // 3. Load existing Yjs state if available
      if (documentData.yjs_state) {
        const yjsState = base64ToUint8Array(documentData.yjs_state);
        superdoc.applyUpdate(yjsState);
      }

      // 4. Setup auto-save
      setupAutoSave(superdoc);
    },
  });

  return () => superdoc.destroy();
}, [documentData]);
```

**What happens:**

1. SuperDoc downloads DOCX file from `file_url`
2. SuperDoc parses DOCX and renders it in the browser
3. If `yjs_state` exists, SuperDoc applies it (restores edits, comments, versions)
4. If `yjs_state` is null, SuperDoc starts with original DOCX content
5. Auto-save timer starts (saves every 30 seconds)

---

## Data Conversion: DOCX Binary ↔ Base64 ↔ Uint8Array

### Understanding the Data Formats

1. **DOCX Binary** - Original Word document format (binary)
2. **Yjs State (Uint8Array)** - SuperDoc's internal CRDT state (binary)
3. **Base64 String** - Text representation of binary for API transmission

### Conversion Flow

#### Frontend: Yjs State → Base64 (for API)

**Location:** `app/(panel)/author/submissions/drafts/[id]/editor/[documentId]/page.jsx`

```javascript
// Get Yjs state from SuperDoc (Uint8Array)
const yjsState = superdoc.getUpdate();

// Convert Uint8Array to base64 string
const base64String = btoa(String.fromCharCode(...new Uint8Array(yjsState)));

// Send to backend
await saveYjsState(documentId, base64String);
```

**Why base64?**

- Binary data cannot be sent in JSON
- Base64 is text-safe encoding of binary data
- HTTP/JSON compatible

#### Backend: Base64 → Binary (for storage)

**Location:** `journal-portal-backend/apps/submissions/superdoc_views.py`

```python
# Receive base64 string from frontend
yjs_state_b64 = request.data.get('yjs_state')

# Decode base64 to binary
document.yjs_state = base64.b64decode(yjs_state_b64)

# Store binary in database (BinaryField)
document.save()
```

#### Backend: Binary → Base64 (for API response)

```python
# Load binary from database
if document.yjs_state:
    # Encode binary to base64
    response_data['yjs_state'] = base64.b64encode(
        document.yjs_state
    ).decode('utf-8')
else:
    response_data['yjs_state'] = None
```

#### Frontend: Base64 → Yjs State (for SuperDoc)

```javascript
// Receive base64 from backend
const { yjs_state } = documentData;

if (yjs_state) {
  // Convert base64 to Uint8Array
  const yjsState = Uint8Array.from(atob(yjs_state), (c) => c.charCodeAt(0));

  // Apply to SuperDoc
  superdoc.applyUpdate(yjsState);
}
```

### Complete Data Flow Diagram

```
┌─────────────────┐
│   User Edits    │
│   in SuperDoc   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Yjs State (Uint8Array)     │
│  [Binary CRDT data]         │
└────────┬────────────────────┘
         │ btoa(String.fromCharCode(...array))
         ▼
┌─────────────────────────────┐
│  Base64 String              │
│  "SGVsbG8gV29ybGQ..."       │
└────────┬────────────────────┘
         │ HTTP POST
         ▼
┌─────────────────────────────┐
│  Backend Receives           │
│  base64.b64decode()         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Database BinaryField       │
│  [Raw binary data]          │
└────────┬────────────────────┘
         │
         ▼ (on next load)
┌─────────────────────────────┐
│  Backend Retrieves          │
│  base64.b64encode()         │
└────────┬────────────────────┘
         │ HTTP GET
         ▼
┌─────────────────────────────┐
│  Frontend Receives Base64   │
│  atob() + Uint8Array.from() │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  SuperDoc Applies Update    │
│  superdoc.applyUpdate()     │
└─────────────────────────────┘
```

---

## Auto-Save Implementation

**Location:** `app/(panel)/author/submissions/drafts/[id]/editor/[documentId]/page.jsx`

```javascript
// Auto-save every 30 seconds
useEffect(() => {
  if (!documentData?.can_edit || !superdocRef.current) return;

  const interval = setInterval(async () => {
    try {
      // Get current Yjs state
      const yjsState = superdocRef.current.getUpdate();

      // Convert to base64
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(yjsState))
      );

      // Save to backend
      await saveYjsState(documentId, base64String);

      setLastSaved(new Date());
      toast.success("Document auto-saved");
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Failed to auto-save");
    }
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, [documentData, documentId]);
```

**Manual Save Button:**

```javascript
const handleSave = async () => {
  setIsSaving(true);
  try {
    const yjsState = superdocRef.current.getUpdate();
    const base64String = btoa(String.fromCharCode(...new Uint8Array(yjsState)));
    await saveYjsState(documentId, base64String);
    setLastSaved(new Date());
    toast.success("Document saved successfully");
  } catch (error) {
    toast.error("Failed to save document");
  } finally {
    setIsSaving(false);
  }
};
```

---

## Download and Export Workflow

### Download Original DOCX

**Location:** `app/(panel)/author/submissions/drafts/[id]/editor/[documentId]/page.jsx`

```javascript
const handleDownload = async () => {
  try {
    // Get DOCX blob from backend
    const blob = await downloadDocx(documentId);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentData.file_name}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("Document downloaded");
  } catch (error) {
    toast.error("Failed to download document");
  }
};
```

**Backend Endpoint:** `GET /api/v1/submissions/documents/{documentId}/download/`

**Returns:** DOCX file as binary blob

### Export Edited Document

**When to use:** Author wants to create a new version with all edits applied

```javascript
const handleExport = async () => {
  try {
    // Export from SuperDoc (includes all edits)
    const docxBlob = await superdocRef.current.exportDocx();

    // Upload to backend
    const formData = new FormData();
    formData.append("file", docxBlob, "exported.docx");

    await exportDocx(documentId, formData);

    toast.success("Document exported and saved");
  } catch (error) {
    toast.error("Failed to export document");
  }
};
```

**Backend Endpoint:** `POST /api/v1/submissions/documents/{documentId}/export/`

**What happens:**

- SuperDoc generates DOCX with all edits applied
- Backend replaces `original_file` with new version
- Yjs state is preserved for continued editing

---

## Permission System

### Backend Permission Logic

**Location:** `journal-portal-backend/apps/submissions/superdoc_views.py`

```python
def can_access_document(user, document):
    """
    Check if user can view and/or edit the document.

    Returns:
        tuple: (can_view: bool, can_edit: bool)
    """
    submission = document.submission
    profile = user.profile

    # Staff and superusers have full access
    if user.is_staff or user.is_superuser:
        return True, True

    # Corresponding author has full access
    if submission.corresponding_author == profile:
        return True, True

    # Co-authors can view only
    if submission.author_contributions.filter(author=profile).exists():
        return True, False

    # Reviewers can view only
    if submission.reviews.filter(reviewer=profile).exists():
        return True, False

    # Journal editors have full access
    if submission.journal.editors.filter(id=profile.id).exists():
        return True, True

    # No access
    return False, False
```

### Frontend Permission Display

```javascript
// Show edit controls only if user can edit
{
  documentData?.can_edit && (
    <>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={handleExport}>Export</Button>
    </>
  );
}

// Show read-only message for viewers
{
  !documentData?.can_edit && (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        You have read-only access to this document
      </AlertDescription>
    </Alert>
  );
}
```

---

## API Reference

### All SuperDoc Endpoints

#### 1. Load Document

```
GET /api/v1/submissions/documents/{documentId}/load/
Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "title": "string",
  "document_type": "MANUSCRIPT",
  "can_edit": boolean,
  "file_url": "string",
  "file_name": "string",
  "file_size": number,
  "yjs_state": "base64string" | null,
  "last_edited_at": "datetime",
  "last_edited_by": { "id": "uuid", "name": "string" }
}
```

#### 2. Save Yjs State

```
POST /api/v1/submissions/documents/{documentId}/save-state/
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "yjs_state": "base64string"
}

Response:
{
  "status": "saved",
  "last_edited_at": "datetime"
}
```

#### 3. Upload DOCX

```
POST /api/v1/submissions/documents/{documentId}/upload/
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- file: DOCX file blob

Response:
{
  "status": "uploaded",
  "file_name": "string",
  "file_size": number,
  "file_url": "string"
}
```

#### 4. Download DOCX

```
GET /api/v1/submissions/documents/{documentId}/download/
Authorization: Bearer {token}

Response:
Binary DOCX file (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
```

#### 5. Export DOCX

```
POST /api/v1/submissions/documents/{documentId}/export/
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- file: Exported DOCX blob from SuperDoc

Response:
{
  "status": "exported",
  "file_url": "string"
}
```

#### 6. Submit Updated Document

```
POST /api/v1/submissions/{submissionId}/submit-updated-document/
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "document_id": "uuid"
}

Response:
{
  "status": "submitted",
  "message": "Reviewers notified"
}
```

---

## Error Handling

### Frontend Error Handling

```javascript
// Upload error handling
try {
  const response = await uploadMutation.mutateAsync({ id: submissionId, data });

  if (response?.id) {
    await initYjsStateMutation.mutateAsync({
      documentId: response.id,
      yjsState: "",
    });
  }

  toast.success("Document uploaded successfully");
} catch (error) {
  if (error?.response?.status === 413) {
    toast.error("File too large. Maximum size is 10MB");
  } else if (error?.response?.status === 400) {
    toast.error(error.response.data.detail || "Invalid file format");
  } else {
    toast.error("Failed to upload document. Please try again.");
  }
}

// Auto-save error handling
const handleAutoSave = async () => {
  try {
    await saveYjsState(documentId, base64String);
    setLastSaved(new Date());
  } catch (error) {
    if (error?.response?.status === 403) {
      toast.error("You don't have permission to edit this document");
      setHasUnsavedChanges(true); // Prevent data loss
    } else {
      console.error("Auto-save failed:", error);
      setHasUnsavedChanges(true);
    }
  }
};
```

### Backend Error Responses

```python
# No edit permission
return Response(
    {'error': 'You do not have permission to edit this document'},
    status=status.HTTP_403_FORBIDDEN
)

# Invalid file format
return Response(
    {'error': 'File must be a .docx file'},
    status=status.HTTP_400_BAD_REQUEST
)

# Missing data
return Response(
    {'error': 'No yjs_state provided'},
    status=status.HTTP_400_BAD_REQUEST
)

# File too large (in Django settings)
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
```

---

## Testing Guide

### Test Upload Workflow

```javascript
// 1. Test document upload
test("uploads document and initializes Yjs state", async () => {
  const file = new File(["content"], "test.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const uploadResponse = await uploadDocument(submissionId, {
    title: "Test Document",
    document_type: "MANUSCRIPT",
    description: "Test",
    file,
  });

  expect(uploadResponse.id).toBeDefined();
  expect(uploadResponse.file_url).toContain(".docx");

  // 2. Verify Yjs state initialization
  const initResponse = await saveYjsState(uploadResponse.id, "");
  expect(initResponse.status).toBe("saved");
});

// 3. Test loading in editor
test("loads document in SuperDoc editor", async () => {
  const documentData = await loadDocument(documentId);

  expect(documentData.file_url).toBeDefined();
  expect(documentData.can_edit).toBe(true);
  expect(documentData.yjs_state).toBeNull(); // New document
});

// 4. Test auto-save
test("auto-saves Yjs state", async () => {
  const mockYjsState = new Uint8Array([1, 2, 3, 4]);
  const base64 = btoa(String.fromCharCode(...mockYjsState));

  const response = await saveYjsState(documentId, base64);

  expect(response.status).toBe("saved");
  expect(response.last_edited_at).toBeDefined();
});
```

### Test Backend Endpoints

```bash
# 1. Upload document
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "title=Test Document" \
  -F "document_type=MANUSCRIPT" \
  -F "description=Test" \
  -F "file=@test.docx" \
  http://localhost:8000/api/v1/submissions/{submissionId}/upload-document/

# 2. Initialize Yjs state
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"yjs_state": ""}' \
  http://localhost:8000/api/v1/submissions/documents/{documentId}/save-state/

# 3. Load document
curl -X GET \
  -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/v1/submissions/documents/{documentId}/load/

# 4. Download document
curl -X GET \
  -H "Authorization: Bearer {token}" \
  -o downloaded.docx \
  http://localhost:8000/api/v1/submissions/documents/{documentId}/download/
```

---

## Performance Considerations

### File Size Limits

**Frontend:**

```javascript
// Validate file size before upload (10MB limit)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (file.size > MAX_FILE_SIZE) {
  toast.error("File too large. Maximum size is 10MB");
  return;
}
```

**Backend (Django settings):**

```python
# settings.py
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
```

### Auto-Save Optimization

```javascript
// Debounce auto-save to prevent excessive API calls
let saveTimeout;

superdoc.on("update", (update) => {
  clearTimeout(saveTimeout);

  // Wait 30 seconds after last edit before saving
  saveTimeout = setTimeout(() => {
    saveYjsState(documentId, base64String);
  }, 30000);
});
```

### Yjs State Compression

**Future Enhancement:**

```javascript
// Consider compressing Yjs state before sending to backend
import pako from "pako";

const yjsState = superdoc.getUpdate();
const compressed = pako.deflate(yjsState);
const base64 = btoa(String.fromCharCode(...compressed));

// Backend would decompress before storing
```

---

## Troubleshooting

### Common Issues

#### 1. "Document failed to load in SuperDoc"

**Cause:** Invalid DOCX file or missing file_url

**Solution:**

```javascript
// Verify file exists before initializing SuperDoc
if (!documentData?.file_url) {
  toast.error("Document file not found");
  return;
}

// Test file URL accessibility
const testResponse = await fetch(documentData.file_url, { method: "HEAD" });
if (!testResponse.ok) {
  toast.error("Document file is not accessible");
  return;
}
```

#### 2. "Auto-save keeps failing"

**Cause:** Token expired or permission revoked

**Solution:**

```javascript
// Check response status and refresh token if needed
try {
  await saveYjsState(documentId, base64String);
} catch (error) {
  if (error?.response?.status === 401) {
    // Token expired - refresh and retry
    await refreshAuthToken();
    await saveYjsState(documentId, base64String);
  } else if (error?.response?.status === 403) {
    // Permission revoked - show error
    toast.error("You no longer have edit access");
    router.push("/author/submissions");
  }
}
```

#### 3. "Yjs state not loading correctly"

**Cause:** Base64 decoding error or corrupted state

**Solution:**

```javascript
// Validate base64 before decoding
const isValidBase64 = (str) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

if (documentData.yjs_state && !isValidBase64(documentData.yjs_state)) {
  console.error("Invalid Yjs state format");
  toast.error("Document state is corrupted. Starting fresh.");
  // Continue without loading state
}
```

#### 4. "Upload succeeds but Yjs init fails"

**Cause:** Document created but Yjs initialization failed

**Solution:**

```javascript
// Retry Yjs initialization with exponential backoff
const retryInit = async (documentId, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await initYjsStateMutation.mutateAsync({
        documentId,
        yjsState: "",
      });
      return; // Success
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## Security Considerations

### File Validation

**Backend:**

```python
# Validate file extension
if not docx_file.name.endswith('.docx'):
    raise ValidationError('Only .docx files allowed')

# Validate MIME type
import magic
file_type = magic.from_buffer(docx_file.read(1024), mime=True)
if file_type not in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
    raise ValidationError('Invalid DOCX file')
```

### Access Control

**Always check permissions:**

```python
# Backend
def save_state(self, request, pk=None):
    document = get_object_or_404(Document, pk=pk)
    can_view, can_edit = can_access_document(request.user, document)

    if not can_edit:
        return Response({'error': 'Forbidden'}, status=403)

    # Proceed with save
```

### Data Sanitization

**Frontend:**

```javascript
// Sanitize user input before uploading
const sanitizeFileName = (name) => {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").substring(0, 255);
};

const sanitizedFile = new File([file], sanitizeFileName(file.name), {
  type: file.type,
});
```

---

## Conclusion

This workflow ensures:

1. ✅ **Reliable Upload** - Single document upload with proper error handling
2. ✅ **Automatic Initialization** - Yjs state initialized immediately after upload
3. ✅ **Seamless Editing** - SuperDoc loads DOCX and applies Yjs state
4. ✅ **Auto-Save** - Changes saved every 30 seconds automatically
5. ✅ **Data Integrity** - Binary data properly converted between formats
6. ✅ **Permission Control** - Edit access enforced on both frontend and backend
7. ✅ **Error Recovery** - Comprehensive error handling and retry logic

The system is production-ready and handles all edge cases for collaborative document editing.
