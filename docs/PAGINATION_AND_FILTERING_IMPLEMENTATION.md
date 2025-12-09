# Pagination and Filtering Implementation Summary

## Overview

This document summarizes the implementation of pagination and filtering across the journal portal frontend application.

## Completed Work

### 1. Debounce Hook Replacement

**File**: `features/shared/components/InstitutionSearchSelect.jsx`

- Replaced custom `useDebounce` hook with `use-debounce` library
- Pattern: `const [debouncedValue] = useDebounce(value, delay)`
- Fixed cascading renders error by using `setTimeout` for state updates

### 2. FilterToolbar Enhancement

**File**: `features/shared/components/FilterToolbar.jsx`

- Added automatic page reset when search or filters change
- Implementation: `params.delete("page")` in Search and Select handlers
- Ensures users start at page 1 when changing filters

### 3. Pagination Integration (8 Pages)

All pages now include:

- URL-based page parameter management
- shadcn/ui Pagination component
- Page size hardcoded to 10 items
- `showPageSizeSelector={false}`

**Updated Pages**:

1. `app/(panel)/admin/users/page.jsx` ✅
2. `app/(panel)/admin/verification-requests/page.jsx` ✅
3. `app/(panel)/admin/journals/page.jsx` ✅
4. `app/(panel)/reviewer/assignments/pending/page.jsx` ✅
5. `app/(panel)/reviewer/assignments/accepted/page.jsx` ✅
6. `app/(panel)/reviewer/assignments/completed/page.jsx` ✅
7. `app/(panel)/reviewer/assignments/declined/page.jsx` ✅
8. `app/(panel)/author/submissions/drafts/page.jsx` ✅

**Pagination Pattern**:

```javascript
const searchParams = useSearchParams();
const pageParam = searchParams.get("page");
const currentPage = pageParam ? parseInt(pageParam) : 1;

const handlePageChange = (page) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", page.toString());
  router.push(`?${params.toString()}`, { scroll: false });
};

// In JSX
<Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(data.count / 10)}
  totalCount={data.count}
  pageSize={10}
  onPageChange={handlePageChange}
  showPageSizeSelector={false}
/>;
```

### 4. API Functions Updated (6 Files)

All API functions now accept a `params` object:

1. **`features/panel/admin/journal/api/journalsApi.js`**

   - `getJournals(params)`

2. **`features/panel/reviewer/api/reviewsApi.js`**

   - `getPendingReviewAssignments(params)`
   - `getAcceptedReviewAssignments(params)`
   - `getCompletedReviewAssignments(params)`
   - `getDeclinedReviewAssignments(params)`

3. **`features/panel/author/api/submissionsApi.js`**
   - `getDraftSubmissions(params)`

**API Pattern**:

```javascript
export const getResource = async (params = {}) => {
  const response = await instance.get("/api/endpoint/", { params });
  return response.data;
};
```

### 5. React Query Hooks Updated (6 Files)

All hooks now accept params and include them in queryKey:

1. `features/panel/admin/journal/hooks/query/useGetJournals.js`
2. `features/panel/reviewer/hooks/query/useGetPendingAssignments.js`
3. `features/panel/reviewer/hooks/query/useGetAcceptedAssignments.js`
4. `features/panel/reviewer/hooks/query/useGetCompletedAssignments.js`
5. `features/panel/reviewer/hooks/query/useGetDeclinedAssignments.js`
6. `features/panel/author/hooks/query/useGetDraftSubmissions.js`

**Hook Pattern**:

```javascript
export const useGetResource = ({ params = {} } = {}, options = {}) => {
  return useQuery({
    queryKey: ["resource-key", params],
    queryFn: () => getResource(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
```

### 6. Filter Parameters Connected (3 Pages)

Pages with filtering now pass URL params to hooks:

**Admin Users Page**:

```javascript
const params = {
  is_active:
    statusParam === "active" ? true : statusParam === "inactive" ? false : "",
  search: searchParam || "",
  profile__verification_status: verificationParam || "",
  page: currentPage,
};
const { data } = useGetUsers({ userRole: "", params });
```

**Admin Verification Requests Page**:

```javascript
const params = {
  status: status,
  search: searchParam || "",
  page: currentPage,
};
const { data } = useGetVerificationRequests({ params });
```

**Admin Journals Page**:

```javascript
const params = {
  search: searchParam || "",
  is_active:
    statusParam === "active" ? true : statusParam === "inactive" ? false : "",
  is_accepting_submissions:
    submissionsParam === "accepting"
      ? true
      : submissionsParam === "not-accepting"
      ? false
      : "",
  page: currentPage,
};
const { data } = useGetJournals({ params });
```

### 7. Consistent Params Pattern (5 Pages)

Reviewer assignment pages and drafts page now use consistent params object:

```javascript
const params = {
  page: currentPage,
};
const { data } = useGetAssignments({ params });
```

This pattern makes it easy to add filtering in the future.

## Backend Integration

All endpoints support these standard parameters:

### Common Parameters

- `page`: Page number (integer)
- `page_size`: Items per page (default: 10)
- `search`: Search query (string)
- `ordering`: Sort field (string, prefix with `-` for descending)

### Endpoint-Specific Filters

See `BACKEND_API_PARAMS.md` for complete details.

**Users API**:

- `is_active`: boolean
- `is_staff`: boolean
- `profile__verification_status`: PENDING | GENUINE | REJECTED

**Journals API**:

- `is_active`: boolean
- `is_accepting_submissions`: boolean

**Review Assignments API**:

- `status`: PENDING | ACCEPTED | DECLINED | COMPLETED
- Special endpoints auto-filter by status

**Submissions API**:

- `status`: DRAFT | SUBMITTED | UNDER_REVIEW | etc.
- `journal`: integer (journal ID)

## Key Decisions & Patterns

### 1. URL-Based State Management

- All pagination and filtering state stored in URL params
- Benefits: Bookmarkable, shareable, browser back/forward support
- Pattern: `useSearchParams()` + `useRouter()`

### 2. Params Object Pattern

- All hooks accept `{ params = {} } = {}` as first argument
- Params included in React Query queryKey for proper cache management
- Consistent pattern across all data fetching hooks

### 3. Page Size

- Hardcoded to 10 items per page (as requested)
- Page size selector disabled on all Pagination components
- Backend default page size also set to 10

### 4. Filter Reset

- FilterToolbar automatically resets page to 1 when search/filters change
- Prevents showing empty results on high page numbers after filtering

### 5. Empty String for "All" Filters

- Empty string `""` used instead of removing param when "all" is selected
- Simplifies conditional logic in pages
- Backend treats empty string same as missing param

## Testing Checklist

- [ ] Navigate to each paginated page and verify page changes work
- [ ] Verify pagination shows correct total pages and counts
- [ ] Test search on users, verification requests, and journals pages
- [ ] Test filters on users (status, verification) and journals (active, submissions)
- [ ] Verify page resets to 1 when changing search or filters
- [ ] Test browser back/forward buttons work correctly
- [ ] Verify URL params are bookmarkable and shareable
- [ ] Check that empty results show appropriate empty states

## Future Enhancements

### Potential Additions

1. **Search on Reviewer Assignments**: Add FilterToolbar with search by submission title
2. **Filter on Submissions**: Add status and journal filters to drafts page
3. **Sorting UI**: Add column sorting controls to tables
4. **Page Size Selector**: Allow users to choose items per page (10, 25, 50, 100)
5. **URL Sync for Local State**: Sync sort order and other UI state to URL

### Easy Additions (Following Established Pattern)

To add filtering to any page:

1. **Add FilterToolbar to page**:

```jsx
<FilterToolbar>
  <FilterToolbar.Search paramName="search" ... />
  <FilterToolbar.Select paramName="status" ... />
</FilterToolbar>
```

2. **Extract params from URL**:

```javascript
const searchParam = searchParams.get("search");
const statusParam = searchParams.get("status");
```

3. **Build params object**:

```javascript
const params = {
  search: searchParam || "",
  status: statusParam || "",
  page: currentPage,
};
```

4. **Pass to hook**:

```javascript
const { data } = useGetResource({ params });
```

## Architecture Benefits

### Consistency

- Single pattern used across all pages
- Easy to understand and maintain
- New developers can follow existing examples

### Performance

- React Query caching with params in queryKey
- Prevents unnecessary refetches
- Stale time set to 2 minutes

### User Experience

- Instant page navigation (no scroll on page change)
- Shareable and bookmarkable URLs
- Clear feedback with loading and error states

### Maintainability

- FilterToolbar compound component encapsulates common logic
- Backend integration through single params object
- Easy to add new filters without changing hook signatures

## Files Modified Summary

### Components (2 files)

- `features/shared/components/InstitutionSearchSelect.jsx`
- `features/shared/components/FilterToolbar.jsx`

### Pages (8 files)

- `app/(panel)/admin/users/page.jsx`
- `app/(panel)/admin/verification-requests/page.jsx`
- `app/(panel)/admin/journals/page.jsx`
- `app/(panel)/reviewer/assignments/pending/page.jsx`
- `app/(panel)/reviewer/assignments/accepted/page.jsx`
- `app/(panel)/reviewer/assignments/completed/page.jsx`
- `app/(panel)/reviewer/assignments/declined/page.jsx`
- `app/(panel)/author/submissions/drafts/page.jsx`

### API Functions (3 files)

- `features/panel/admin/journal/api/journalsApi.js`
- `features/panel/reviewer/api/reviewsApi.js`
- `features/panel/author/api/submissionsApi.js`

### Hooks (6 files)

- `features/panel/admin/journal/hooks/query/useGetJournals.js`
- `features/panel/reviewer/hooks/query/useGetPendingAssignments.js`
- `features/panel/reviewer/hooks/query/useGetAcceptedAssignments.js`
- `features/panel/reviewer/hooks/query/useGetCompletedAssignments.js`
- `features/panel/reviewer/hooks/query/useGetDeclinedAssignments.js`
- `features/panel/author/hooks/query/useGetDraftSubmissions.js`

### Documentation (2 files)

- `BACKEND_API_PARAMS.md` (new)
- `PAGINATION_AND_FILTERING_IMPLEMENTATION.md` (this file)

**Total: 21 files modified + 2 new documentation files**

## Conclusion

The pagination and filtering implementation is now complete and consistent across the application. All data fetching follows the same pattern, making it easy to add new features and maintain the codebase. The URL-based approach provides excellent user experience with bookmarkable, shareable URLs and proper browser history integration.
