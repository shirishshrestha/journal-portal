# Backend API Filter & Search Parameters

## Overview

This document lists all supported query parameters for filtering, searching, and pagination for each API endpoint based on the Django backend implementation.

## Common Parameters (All Endpoints)

- `page`: Page number for pagination (default: 1)
- `page_size`: Number of items per page (default: 10)

---

## Users API (`/api/v1/users/`)

### Filterable Fields

- `is_active`: Boolean (true/false)
- `is_staff`: Boolean (true/false)
- `profile__verification_status`: String (PENDING, GENUINE, REJECTED)
- `role`: String (role name from query param, not filterset)

### Searchable Fields

- `username`
- `email`
- `first_name`
- `last_name`

### Ordering Fields

- `date_joined`
- `last_login`
- `username`
- `email`

### Default Ordering

`-date_joined` (newest first)

### Example Query

```
/api/v1/users/?search=john&is_active=true&profile__verification_status=GENUINE&page=1
```

---

## Journals API (`/api/v1/journals/journals/`)

### Filterable Fields

- `is_active`: Boolean (true/false)
- `is_accepting_submissions`: Boolean (true/false)

### Searchable Fields

- `title`
- `short_name`
- `description`
- `issn`
- `e_issn`

### Ordering Fields

- `title`
- `created_at`
- `updated_at`

### Default Ordering

`-created_at` (newest first)

### Additional Query Params

- `active_role`: String (AUTHOR, EDITOR) - affects visibility

### Example Query

```
/api/v1/journals/journals/?search=science&is_active=true&is_accepting_submissions=true&page=1
```

---

## Review Assignments API (`/api/v1/reviews/assignments/`)

### Filterable Fields

- `status`: String (PENDING, ACCEPTED, DECLINED, COMPLETED)
- `submission`: Integer (submission ID)
- `reviewer`: Integer (reviewer profile ID)

### Searchable Fields

- `submission__title`
- `reviewer__user__first_name`
- `reviewer__user__last_name`
- `reviewer__user__email`

### Ordering Fields

- `invited_at`
- `due_date`
- `accepted_at`
- `completed_at`
- `status`

### Default Ordering

`-invited_at` (newest first)

### Special Endpoints

- `/api/v1/reviews/assignments/pending/` - Auto-filters to status=PENDING
- `/api/v1/reviews/assignments/accepted/` - Auto-filters to status=ACCEPTED
- `/api/v1/reviews/assignments/completed/` - Auto-filters to status=COMPLETED
- `/api/v1/reviews/assignments/declined/` - Auto-filters to status=DECLINED

### Example Query

```
/api/v1/reviews/assignments/?search=cancer&status=PENDING&page=1
/api/v1/reviews/assignments/pending/?page=1
```

---

## Submissions API (`/api/v1/submissions/`)

### Filterable Fields

- `status`: String (DRAFT, SUBMITTED, UNDER_REVIEW, REVISED, ACCEPTED, REJECTED, PUBLISHED, WITHDRAWN)
- `journal`: Integer (journal ID)

### Searchable Fields

- `title`
- `abstract`
- `submission_number`
- `corresponding_author__user__first_name`
- `corresponding_author__user__last_name`
- `corresponding_author__user__email`

### Ordering Fields

- `title`
- `created_at`
- `submitted_at`
- `updated_at`
- `status`

### Default Ordering

`-created_at` (newest first)

### Special Endpoints

- `/api/v1/submissions/drafts/` - Auto-filters to status=DRAFT
- `/api/v1/submissions/unassigned/` - Submissions without reviewers
- `/api/v1/submissions/active/` - Submissions with reviewers
- `/api/v1/submissions/archived/` - Completed submissions

### Example Query

```
/api/v1/submissions/?search=cancer&status=UNDER_REVIEW&journal=1&page=1
/api/v1/submissions/drafts/?page=1
```

---

## Verification Requests API (`/api/v1/admin/verifications/`)

### Filterable Fields

- `status`: String (PENDING, APPROVED, REJECTED, INFO_REQUESTED)
- `profile`: Integer (profile ID)

### Searchable Fields

(Based on Profile model - need to verify backend implementation)

- `profile__user__first_name`
- `profile__user__last_name`
- `profile__user__email`
- `profile__display_name`

### Example Query

```
/api/v1/admin/verifications/?search=john&status=PENDING&page=1
```

---

## Implementation Notes

### Frontend Hook Pattern

All hooks should follow this pattern:

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

### API Function Pattern

All API functions should follow this pattern:

```javascript
export const getResource = async (params = {}) => {
  const response = await instance.get("/endpoint/", { params });
  return response.data;
};
```

### Page Component Usage

```javascript
const searchParams = useSearchParams();
const pageParam = searchParams.get("page");
const searchParam = searchParams.get("search");
const statusParam = searchParams.get("status");

const params = {
  page: pageParam ? parseInt(pageParam) : 1,
  search: searchParam || "",
  status: statusParam || "",
  // ... other filters
};

const { data } = useGetResource({ params });
```

---

## Status Values Reference

### User Verification Status

- `PENDING` - Awaiting verification
- `GENUINE` - Verified genuine user
- `REJECTED` - Verification rejected

### Review Assignment Status

- `PENDING` - Invitation sent, awaiting response
- `ACCEPTED` - Reviewer accepted
- `DECLINED` - Reviewer declined
- `COMPLETED` - Review submitted

### Submission Status

- `DRAFT` - Being prepared
- `SUBMITTED` - Submitted for review
- `UNDER_REVIEW` - In review process
- `REVISION_REQUESTED` - Revisions needed
- `REVISED` - Revisions submitted
- `ACCEPTED` - Accepted for publication
- `REJECTED` - Rejected
- `PUBLISHED` - Published
- `WITHDRAWN` - Withdrawn by author

### Verification Request Status

- `PENDING` - Awaiting admin review
- `APPROVED` - Approved by admin
- `REJECTED` - Rejected by admin
- `INFO_REQUESTED` - Additional info requested
