# Editor Role Journal Access Implementation

## Overview

Implemented a comprehensive solution for editors (Managing Editor, Associate Editor, Section Editor, Guest Editor, Reviewer) to view and manage journals where they are assigned as staff members.

## What Was Created

### 1. Backend API Integration

**File:** `features/panel/editor/journal/api/journalsApi.js`

- Added `getMyAssignedJournals()` function
- Endpoint: `GET /journals/journals/my-assigned/`
- Returns journals where the current user is a staff member with any of these roles:
  - Editor-in-Chief
  - Managing Editor
  - Associate Editor
  - Section Editor
  - Guest Editor
  - Reviewer

### 2. React Query Hook

**File:** `features/panel/editor/journal/hooks/query/useGetMyAssignedJournals.js`

- Created custom hook to fetch assigned journals
- Includes caching, refetching, and error handling
- Exported from `features/panel/editor/journal/hooks/index.js`

### 3. My Journals Page

**File:** `app/(panel)/editor/my-journals/page.jsx`

- Displays all journals where the user is a staff member
- Features:
  - Role badge showing the user's role in each journal
  - Statistics cards (Total Journals, Total Submissions, Active Roles)
  - Searchable and filterable data table
  - Quick navigation to view submissions for each journal
  - Color-coded role badges:
    - Editor-in-Chief: Purple
    - Managing Editor: Blue
    - Associate Editor: Cyan
    - Section Editor: Green
    - Guest Editor: Yellow
    - Reviewer: Orange

### 4. Journal Submissions Page

**File:** `app/(panel)/editor/my-journals/[id]/submissions/page.jsx`

- Shows all submissions for a specific journal
- Features:
  - Journal information card
  - Current user's role badge in the header
  - Filterable submissions table (search by title/author, filter by status)
  - Pagination support
  - Quick actions to view submission details and reviews
  - Breadcrumb navigation back to "My Journals"

### 5. Navigation Updates

**File:** `features/shared/utils/sidebar-items.js`

- Added "My Journals" menu item for EDITOR role
- Renamed existing "Journals" to "All Journals" for clarity
- Both options available in the editor sidebar

## User Flow

1. **Editor logs in** with any of the staff roles (Managing Editor, Associate Editor, Section Editor, Guest Editor, Reviewer)

2. **Navigates to "My Journals"** from the sidebar

   - Sees a list of journals where they are assigned
   - Each journal shows their role, submission count, staff count, and status
   - View statistics at the top (total journals, submissions, active roles)

3. **Clicks "View Submissions"** on any journal

   - Navigates to `/editor/my-journals/[journalId]/submissions`
   - Sees their role badge in the header
   - Can search and filter submissions
   - Can view individual submission details

4. **Clicks "View"** on any submission
   - Redirects to `/editor/submissions/[submissionId]`
   - Uses the existing submission detail page (same as Editor-in-Chief)

## Backend Requirements

The frontend expects this API endpoint to be implemented:

```
GET /api/journals/journals/my-assigned/
```

**Expected Response Format:**

```json
{
  "results": [
    {
      "id": 1,
      "title": "Journal of Example Research",
      "abbreviation": "JER",
      "is_active": true,
      "submissions_count": 25,
      "staff_members": [
        {
          "id": 5,
          "profile": {
            "id": "uuid-here",
            "user_email": "editor@example.com",
            "user_name": "John Editor",
            "display_name": "John Editor",
            ...
          },
          "role": "MANAGING_EDITOR",
          "role_display": "Managing Editor",
          "is_active": true,
          "is_current_user": true
        }
      ],
      "my_staff_role": {
        "role": "MANAGING_EDITOR",
        "role_display": "Managing Editor",
        "email": "editor@example.com"
      }
    }
  ],
  "count": 1,
  "next": null,
  "previous": null
}
```

**Backend Implementation Notes:**

1. Filter journals where the current authenticated user appears in `staff_members`
2. Include a flag `is_current_user: true` on the staff member object that matches the current user
3. Optionally include `my_staff_role` object at the journal level for easier access
4. Support pagination (default page size: 10)

## Key Features

### Role-Based Access

- Each editor role sees only the journals they're assigned to
- Their specific role is displayed prominently
- All roles have the same view permissions for submissions in their assigned journals

### Data Table Features

- Search by journal title, abbreviation
- Filter by status (Active/Inactive)
- Sort by columns
- Responsive design
- Empty states with helpful messages

### Permissions

- Editors can VIEW submissions for their assigned journals
- Editors can VIEW submission details and reviews
- Actual editing permissions depend on their specific role and backend implementation

## Technical Details

### Caching Strategy

- `staleTime`: 5 minutes (journals don't change frequently)
- `gcTime`: 10 minutes (garbage collection)
- Auto-refetch on window focus and component mount

### Error Handling

- Graceful error states with retry options
- Loading skeletons for better UX
- Empty states with contextual messages

### Performance

- React Query handles caching automatically
- Pagination reduces initial load time
- Optimistic UI updates where applicable

## Testing Checklist

- [ ] Verify "My Journals" appears in editor sidebar
- [ ] Check that only assigned journals are displayed
- [ ] Verify role badges show correct colors and labels
- [ ] Test search functionality
- [ ] Test status filtering
- [ ] Test pagination
- [ ] Verify submission detail navigation works
- [ ] Check responsive design on mobile/tablet
- [ ] Verify error handling (network errors, no data)
- [ ] Test with different editor roles
- [ ] Verify statistics cards show correct counts

## Future Enhancements

1. **Bulk Actions**: Select multiple submissions and perform batch operations
2. **Advanced Filters**: Filter by submission date range, author, section
3. **Export**: Export submissions list to CSV/Excel
4. **Notifications**: Show badge count for pending actions
5. **Quick Actions**: Inline actions for common tasks (assign reviewers, etc.)
6. **Dashboard Widgets**: Add "My Journals" widget to editor dashboard
7. **Role-Specific Views**: Customize view based on specific role (e.g., Section Editor only sees submissions in their section)

## Related Files

### Created/Modified

- `features/panel/editor/journal/api/journalsApi.js` (modified)
- `features/panel/editor/journal/hooks/query/useGetMyAssignedJournals.js` (created)
- `features/panel/editor/journal/hooks/index.js` (modified)
- `app/(panel)/editor/my-journals/page.jsx` (created)
- `app/(panel)/editor/my-journals/[id]/submissions/page.jsx` (created)
- `features/shared/utils/sidebar-items.js` (modified)

### Reused Components

- `DataTable` - Shared table component
- `FilterToolbar` - Search and filter utilities
- `StatusBadge` - Submission status display
- `JournalInfoCard` - Journal details display
- `Pagination` - Page navigation
- `ErrorCard` - Error state handling
- `LoadingScreen` - Loading state

## Notes

- The "All Journals" link still works as before (shows all journals for Editor-in-Chief)
- Staff members with multiple roles in the same journal will see the highest-privilege role
- The implementation follows the existing pattern used in `/editor/journals/[id]/submissions`
- Backend must implement proper permissions to ensure users only see their assigned journals
