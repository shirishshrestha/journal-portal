# Journal Portal - Frontend Application

A comprehensive Next.js frontend for a full-featured academic journal management system built with modern React patterns, role-based architecture, and collaborative document editing capabilities.

## 🎯 Project Overview

**Purpose**: Provide a complete multi-role journal management portal supporting the entire academic publishing workflow from submission to publication, including peer review, copyediting, production, and achievement tracking.

**Architecture**: Feature-based folder structure with Next.js 16 App Router, client-side data fetching (React Query + axios), global state management (Redux Toolkit + redux-persist), and real-time collaborative editing (SuperDoc).

**Supported Roles**:

- **Reader**: Browse and read published articles
- **Author**: Submit manuscripts, manage submissions, track review status
- **Reviewer**: Accept review invitations, submit reviews, provide feedback
- **Editor**: Manage journals, assign reviewers, make editorial decisions, oversee copyediting and production
- **Journal Manager**: Manage journal settings, staff, OJS integration
- **Admin**: System administration, user management, verification requests, analytics, anomaly detection

## 🛠 Tech Stack

### Core Framework & Language

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: React 19.2.0 (JSX)
- **Build Tool**: Webpack (via Next.js)

### Styling & UI

- **Styling**: Tailwind CSS v4 with custom theme variables
- **UI Components**: Radix UI primitives + shadcn-style components
- **Icons**: lucide-react (v0.548.0)
- **Animations**: framer-motion (v12.23.24), tw-animate-css
- **Theming**: next-themes (dark/light mode support)
- **Notifications**: sonner (v2.0.7)

### State Management & Data Fetching

- **Global State**: Redux Toolkit (v2.9.2) + redux-persist (v6.0.0) for auth
- **Server State**: @tanstack/react-query (v5.90.5) for caching, mutations, optimistic updates
- **HTTP Client**: axios (v1.13.1)

### Forms & Validation

- **Forms**: react-hook-form (v7.65.0)
- **Validation**: zod (v4.1.12)
- **Resolvers**: @hookform/resolvers (v5.2.2)

### Document Editing & Collaboration

- **Rich Text Editor**: Lexical (v0.38.2) with @lexical/react
- **Collaborative Editing**: SuperDoc (@harbour-enterprises/superdoc v0.29.0)
- **Real-time Collaboration**: Y.js (v13.6.19) for CRDT-based sync

### PDF & Document Handling

- **PDF Rendering**: react-pdf (v10.2.0), pdfjs-dist (v4.6.82)
- **Document Generation**: Server-side PDF generation via backend

### Charts & Visualization

- **Charts**: recharts (v3.3.0)
- **Analytics**: Custom dashboard components

### Utilities

- **Date Handling**: date-fns (v4.1.0)
- **Class Management**: class-variance-authority, clsx, tailwind-merge
- **Debouncing**: use-debounce (v10.0.6)
- **Country Flags**: react-country-flag (v3.1.0)
- **Animations**: lottie-react (v2.4.1)
- **Command Palette**: cmdk (v1.1.1)
- **Drawer**: vaul (v1.1.2)

### Monitoring & Error Tracking

- **Error Tracking**: @sentry/nextjs (v10.27.0)

### Development Dependencies

- **Linting**: ESLint (v9), eslint-config-next
- **Formatting**: Prettier (v3.7.4)
- **Type Support**: @types/node, @types/react

## 📁 Project Structure

### Feature-Based Organization

The codebase is organized by domain features under `features/`, keeping related code colocated:

```
features/
├── auth/                          # Authentication & authorization
│   ├── components/                # Login, Register, Password reset forms
│   ├── api/                       # userApi.js, passwordApi.js
│   ├── hooks/                     # useLoginUser, useRegisterUser, etc.
│   ├── redux/                     # authSlice.js (Redux state)
│   └── utils/                     # Auth utilities
│
├── panel/                         # Role-specific dashboards and features
│   ├── admin/                     # Admin panel
│   │   ├── dashboard/            # Admin analytics, user stats
│   │   ├── user/                 # User management
│   │   ├── journal/              # Journal management
│   │   ├── activity-logs/        # System activity tracking
│   │   ├── error-logs/           # Error monitoring
│   │   ├── anomaly-detection/    # ML-based anomaly detection
│   │   └── verification-requests/ # User verification workflow
│   │
│   ├── author/                    # Author dashboard
│   │   ├── components/           # Submission forms, status tracking
│   │   ├── api/                  # Author-specific API calls
│   │   └── hooks/                # useCreateSubmission, useGetMySubmissions
│   │
│   ├── reviewer/                  # Reviewer dashboard
│   │   ├── components/           # Review forms, assignment cards
│   │   ├── api/                  # Review API
│   │   └── hooks/                # useGetMyReviews, useSubmitReview
│   │
│   ├── editor/                    # Editor dashboard
│   │   ├── dashboard/            # Editor overview
│   │   ├── journal/              # Journal management, OJS integration
│   │   │   └── api/              # journalsApi.js, ojsConnectionApi.js
│   │   ├── submission/           # Submission workflow management
│   │   │   ├── components/       # Review assignment, decision forms
│   │   │   └── api/              # submissionsApi.js, reviewsApi.js,
│   │   │                         # copyeditingApi.js, productionApi.js,
│   │   │                         # publicationScheduleApi.js
│   │   └── verification-requests/ # Reviewer/author verification
│   │
│   ├── journal-manager/           # Journal manager dashboard
│   │   ├── components/           # Staff management, settings
│   │   └── api/                  # journalManagerApi.js
│   │
│   ├── reader/                    # Reader dashboard
│   │   ├── components/           # Article browsing, search
│   │   ├── api/                  # Reader-specific API
│   │   ├── hooks/                # useGetArticles, useSearch
│   │   └── utils/                # Reader utilities
│   │
│   ├── profile/                   # User profile management (all roles)
│   │   ├── components/           # ProfileForm, OrcidConnect, Settings
│   │   └── hooks/                # useUpdateProfile, useOrcidAuth
│   │
│   └── settings/                  # Application settings (all roles)
│       └── components/           # Email preferences, notifications
│
└── shared/                        # Cross-feature shared code
    ├── components/               # Reusable UI components
    │   ├── RoleBasedAuth.jsx    # Route protection wrapper
    │   ├── UnifiedAppbar.jsx    # Top navigation bar
    │   ├── UnifiedSidebar.jsx   # Side navigation
    │   ├── SuperDoc/            # SuperDoc editor components
    │   ├── achievements/        # Badge, Award, Certificate cards
    │   ├── RichTextEditor/      # Lexical-based editor
    │   └── [50+ more]           # Tables, forms, modals, etc.
    │
    ├── api/                      # Shared API modules
    │   ├── achievementsApi.js   # Badges, awards, leaderboards
    │   ├── analyticsApi.js      # Analytics data
    │   ├── superDocApi.js       # Document collaboration
    │   ├── meApi.js             # Current user data
    │   ├── healthApi.js         # Health checks
    │   ├── doajApi.js           # DOAJ integration
    │   └── rorApi.js            # ROR organization search
    │
    ├── hooks/                    # Shared custom hooks
    │   ├── query/               # React Query hooks
    │   │   ├── useGetBadges.js
    │   │   ├── useGetAwards.js
    │   │   ├── useGetLeaderboards.js
    │   │   └── [30+ more]
    │   ├── mutation/            # Mutation hooks
    │   │   ├── useSaveSuperdocDocument.js
    │   │   └── [20+ more]
    │   ├── useCurrentRole.js    # Role management
    │   ├── useToggle.js         # Toggle state
    │   ├── useCrossTabAuth.js   # Cross-tab sync
    │   └── useRoleRedirect.js   # Role-based navigation
    │
    ├── data/                     # Static data & configurations
    │   └── SidebarLinks.js      # Navigation menu structure
    │
    └── utils/                    # Utility functions
        └── Various helpers
```

### App Router Structure (`app/`)

```
app/
├── (auth)/                        # Auth route group (no layout)
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── forgot-password/          # Password reset request
│   ├── reset-password/           # Password reset confirmation
│   ├── setup-password/           # Initial password setup
│   ├── verify-email/             # Email verification
│   └── pending-verification/     # Verification pending page
│
├── (panel)/                       # Main panel route group (shared layout)
│   ├── layout.jsx                # Panel layout with sidebar + appbar
│   │
│   ├── admin/                    # Admin routes
│   │   ├── layout.jsx            # Admin-only protection
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── users/                # User management
│   │   ├── journals/             # Journal management
│   │   ├── activity-logs/        # Activity monitoring
│   │   ├── error-logs/           # Error monitoring
│   │   ├── anomaly-detection/    # Anomaly detection
│   │   └── verification-requests/ # Verification management
│   │
│   ├── author/                   # Author routes
│   │   ├── layout.jsx            # Author-only protection
│   │   ├── dashboard/            # Author dashboard
│   │   ├── submissions/          # My submissions
│   │   │   ├── [id]/            # Submission details
│   │   │   └── new/             # New submission
│   │   └── achievements/         # My badges, certificates
│   │
│   ├── reviewer/                 # Reviewer routes
│   │   ├── layout.jsx            # Reviewer-only protection
│   │   ├── dashboard/            # Reviewer dashboard
│   │   ├── assignments/          # Review assignments
│   │   │   └── [id]/            # Review submission
│   │   └── achievements/         # My achievements
│   │
│   ├── editor/                   # Editor routes
│   │   ├── layout.jsx            # Editor-only protection
│   │   ├── dashboard/            # Editor dashboard
│   │   ├── journals/             # My journals
│   │   │   ├── [id]/            # Journal details
│   │   │   │   ├── submissions/ # Journal submissions
│   │   │   │   ├── staff/       # Staff management
│   │   │   │   ├── settings/    # Journal settings
│   │   │   │   └── ojs-sync/    # OJS integration
│   │   ├── submissions/          # All submissions
│   │   │   └── [id]/            # Submission management
│   │   │       ├── reviews/     # Review management
│   │   │       ├── copyediting/ # Copyediting stage
│   │   │       ├── production/  # Production stage
│   │   │       └── decision/    # Editorial decisions
│   │   └── verification-requests/ # Verify authors/reviewers
│   │
│   ├── journal_manager/          # Journal Manager routes
│   │   ├── layout.jsx            # Journal Manager-only protection
│   │   ├── dashboard/            # Manager dashboard
│   │   ├── journals/             # Managed journals
│   │   │   └── [id]/            # Journal management
│   │   │       ├── settings/    # Journal configuration
│   │   │       ├── staff/       # Staff management
│   │   │       └── ojs-sync/    # OJS synchronization
│   │   └── reports/              # Journal analytics
│   │
│   ├── reader/                   # Reader routes
│   │   ├── layout.jsx            # Reader-only protection
│   │   ├── dashboard/            # Reader dashboard
│   │   ├── articles/             # Browse articles
│   │   │   └── [id]/            # Article view
│   │   └── search/               # Search articles
│   │
│   ├── profile/                  # Profile pages (all roles)
│   │   ├── edit/                 # Edit profile
│   │   ├── orcid/                # ORCID connection
│   │   └── settings/             # User settings
│   │
│   └── settings/                 # App settings (all roles)
│       ├── notifications/        # Notification preferences
│       ├── email/                # Email preferences
│       └── security/             # Security settings
│
├── api/                          # API routes (if any)
├── certificates/                 # Certificate verification (public)
│   └── verify/                   # Public certificate verification
├── choose-role/                  # Role selection page
├── unauthorized/                 # Access denied page
├── layout.jsx                    # Root layout (providers, fonts)
├── providers.jsx                 # App providers (Redux, React Query, Theme)
├── globals.css                   # Global styles + Tailwind
└── global-error.jsx              # Global error boundary
```

### Component Library (`components/ui/`)

Radix UI-based reusable components following shadcn patterns:

- **Layout**: `sidebar.jsx`, `drawer.jsx`, `sheet.jsx`, `separator.jsx`, `scroll-area.jsx`
- **Forms**: `form.jsx`, `input.jsx`, `textarea.jsx`, `select.jsx`, `checkbox.jsx`, `radio-group.jsx`, `switch.jsx`, `slider.jsx`, `calendar.jsx`
- **Feedback**: `alert.jsx`, `alert-dialog.jsx`, `dialog.jsx`, `sonner.jsx`, `progress.jsx`, `skeleton.jsx`, `tooltip.jsx`
- **Navigation**: `dropdown-menu.jsx`, `tabs.jsx`, `command.jsx`, `popover.jsx`
- **Display**: `card.jsx`, `badge.jsx`, `avatar.jsx`, `table.jsx`, `accordion.jsx`, `collapsible.jsx`, `toggle.jsx`, `toggle-group.jsx`
- **Custom**: `button.jsx`, `label.jsx`, `pdf-viewer-modal.jsx`, `EllipsisTooltip.jsx`

### Other Key Directories

- **`store/`**: Redux store configuration, auth persistence
- **`lib/`**: Core utilities (axios instance, auth helpers)
- **`hooks/`**: App-level custom hooks
- **`public/`**: Static assets (images, fonts, icons)
- **`docs/`**: Documentation (features, components, workflows)

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: JWT-based authentication with access + refresh tokens
2. **Token Storage**: Tokens stored in HTTP-only cookies (secure)
3. **Redux State**: User data persisted via redux-persist
4. **Cross-Tab Sync**: `useCrossTabAuth` hook syncs auth state across browser tabs
5. **Auto-Refresh**: Axios interceptor automatically refreshes expired tokens

### Role-Based Access Control (RBAC)

#### Role Hierarchy

- **READER**: Basic access, read published articles
- **AUTHOR**: Submit manuscripts, track submissions
- **REVIEWER**: Review assigned manuscripts
- **EDITOR**: Manage submissions, assign reviewers, editorial decisions
- **JOURNAL_MANAGER**: Manage journal settings, staff, OJS integration
- **ADMIN**: Full system access, user management, analytics

#### Protection Mechanisms

1. **Route Protection**: Each role has a dedicated layout with `<RoleBasedRoute>` wrapper

   ```jsx
   // app/(panel)/editor/layout.jsx
   <RoleBasedRoute allowedRoles={['EDITOR']}>{children}</RoleBasedRoute>
   ```

2. **Middleware Protection**: `proxy.js` middleware checks JWT and redirects based on roles
   - Unauthenticated → `/login`
   - Single role → Role-specific dashboard
   - Multiple roles → `/choose-role` for selection
   - Unverified reader → `/pending-verification`

3. **Component-Level Protection**: Components check roles before rendering

   ```jsx
   const userRoles = useSelector((state) => state.auth?.userData?.roles);
   const hasAccess = userRoles.includes('EDITOR');
   ```

4. **API-Level Protection**: Backend enforces permissions on all endpoints

#### Role Management

- **`useCurrentRole()`** hook:
  - Derives role from URL pathname
  - Persists selected role in localStorage
  - Provides `setCurrentRole()` for manual switching
  - Clears query cache on role change (prevents data leakage)

- **Role Switching**: Users with multiple roles can switch via appbar dropdown
  - Triggers cache invalidation
  - Redirects to role-specific dashboard
  - Updates localStorage

## 📡 Data Fetching & State Management

### Server State (React Query)

**Pattern**: All API calls wrapped in React Query hooks for caching, refetching, and optimistic updates.

**Query Hooks** (`features/*/hooks/query/`):

```javascript
export const useGetSubmissions = (params = {}) => {
  return useQuery({
    queryKey: ['submissions', params],
    queryFn: () => getSubmissions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};
```

**Mutation Hooks** (`features/*/hooks/mutation/`):

```javascript
export const useCreateSubmission = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createSubmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Submission created successfully');
    },
    ...options,
  });
};
```

**Configuration**:

- Query keys follow hierarchical pattern: `['resource', params]`
- Automatic background refetching
- Cache invalidation on mutations
- Optimistic updates for better UX
- Error handling with toast notifications

### Global State (Redux Toolkit)

**Auth Slice** (`features/auth/redux/authSlice.js`):

```javascript
{
  status: 'authenticated' | 'unauthenticated',
  userData: {
    id, email, first_name, last_name,
    roles: ['AUTHOR', 'REVIEWER'],
    email_verified: boolean,
    orcid_id, profile_picture, ...
  },
  token: 'jwt-access-token',
  refreshToken: 'jwt-refresh-token',
}
```

**Persistence**: redux-persist stores auth state in localStorage

**Actions**:

- `loginSuccess(userData)` - Set authenticated user
- `logout()` - Clear auth state
- `updateUserData(data)` - Update user profile
- `setRoles(roles)` - Update user roles

### API Client Configuration

**Axios Instance** (`lib/instance.js`):

- Base URL from environment variable
- Automatic token injection in headers
- Request/response interceptors
- Token refresh on 401
- Error handling and toast notifications

```javascript
instance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## ✨ Key Features

### 1. **Submission Management System**

**Author Features**:

- Create new submissions with rich metadata (title, abstract, keywords)
- Upload manuscript files (DOCX, PDF)
- Add co-authors with email invitations
- Track submission status in real-time
- Respond to revision requests
- View review comments (if not blinded)

**Editor Features**:

- View all submissions for managed journals
- Assign reviewers based on expertise
- Track review progress
- Make editorial decisions (Accept/Reject/Revision)
- Manage revision rounds
- Generate decision letters
- Move to copyediting stage

**Reviewer Features**:

- Accept/decline review invitations
- Access assigned manuscripts
- Submit structured reviews with scores
- Upload review documents
- Track review history

### 2. **Copyediting Workflow**

- **SuperDoc Integration**: Real-time collaborative editing
- **File Version Control**: Track all changes and versions
- **Copyeditor Assignment**: Assign dedicated copyeditors
- **Stage Management**: Manage copyediting rounds
- **File Export**: Export to multiple formats (DOCX, PDF, HTML)
- **Comments & Annotations**: In-editor collaboration
- **Approval Workflow**: Author review and approval

### 3. **Production Workflow**

- **Layout & Formatting**: Prepare final manuscript layout
- **Proofreading**: Final review before publication
- **Galley Management**: Generate publication-ready files
- **Metadata Finalization**: Complete publication metadata
- **DOI Assignment**: Integrate with DOI providers
- **Publication Scheduling**: Schedule publication date
- **Multi-Format Output**: PDF, HTML, XML, ePub

### 4. **Achievements System**

**Badges**:

- Automatic badge earning based on activities
- Badge types: Submissions, Reviews, Citations, Collaboration
- Badge levels: Bronze, Silver, Gold, Platinum
- View earned badges in profile
- Featured badge selection

**Awards**:

- Best Reviewer of the Year (by journal)
- Researcher of the Year (by journal)
- Outstanding Contribution
- Award announcements and notifications

**Leaderboards**:

- Top Reviewers (global, journal-specific, field-specific)
- Top Authors by citations
- Period filters: All-time, Yearly, Monthly
- Country and field filtering

**Certificates**:

- Auto-generated PDF certificates for awards
- QR code verification
- Public verification portal
- Download and share certificates
- Certificate preview with PDF viewer modal

### 5. **OJS Integration**

- **Journal Synchronization**: Sync journals from OJS
- **Submission Sync**: Bi-directional submission sync
- **User Sync**: Sync authors, reviewers, editors
- **Review Sync**: Sync review assignments and submissions
- **Article Sync**: Sync published articles
- **Metadata Mapping**: Automatic field mapping
- **Conflict Resolution**: Handle sync conflicts

### 6. **External Integrations**

**ORCID**:

- OAuth authentication flow
- Auto-fill profile from ORCID data
- Link/unlink ORCID
- Privacy controls

**ROR (Research Organization Registry)**:

- Organization search and autocomplete
- Affiliation validation
- Organization details (location, type, aliases)

**DOAJ (Directory of Open Access Journals)**:

- Journal search and validation
- Article metadata fetch
- Submission to DOAJ
- Journal inclusion checking

**OpenAlex**:

- Author search and profile enrichment
- Institution lookup
- Publication/work search
- Citation data

### 7. **Admin Features**

**User Management**:

- View all users with filtering
- Edit user roles and permissions
- Activate/deactivate accounts
- View user activity logs

**Verification Requests**:

- Review author/reviewer verification requests
- Auto-scoring system (0-100 based on criteria)
- Approve/reject with comments
- Request additional information
- ORCID verification bonus points

**Anomaly Detection**:

- ML-based detection of suspicious activity
- Author anomalies: Rapid submissions, self-citations, duplicate content
- Reviewer anomalies: Bias, rushed reviews, extreme ratings
- System anomalies: Review rings, coordination
- Risk scoring: LOW/MEDIUM/HIGH
- Admin intervention tools

**Activity Logs**:

- Track all system activities
- User actions, API calls, errors
- Filter by user, action type, date range
- Export logs for audit

**Error Logs**:

- Centralized error monitoring
- Stack traces and request details
- Error frequency tracking
- Integration with Sentry

**Analytics Dashboard**:

- User growth metrics
- Submission statistics
- Review turnaround times
- Journal performance
- Custom date ranges
- Visual charts (recharts)

### 8. **Document Collaboration (SuperDoc)**

- **Real-Time Editing**: Multiple users edit simultaneously
- **CRDT Technology**: Conflict-free replicated data types (Y.js)
- **Change Tracking**: View all changes with timestamps
- **Comments**: In-line comments and discussions
- **Version History**: Access previous versions
- **Export Options**: DOCX, PDF, HTML, Markdown
- **Offline Support**: Edit offline, sync when online
- **Presence Awareness**: See who's editing in real-time

### 9. **Rich Text Editor**

**Lexical-Based Editor**:

- Clean, extensible architecture
- Markdown support
- Code blocks with syntax highlighting
- Links, lists, formatting
- Paste from Word
- Character/word count
- Undo/redo with history

### 10. **Responsive Design**

- Mobile-first approach
- Tailwind responsive utilities
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Dark mode support (next-themes)

## 🚀 Routing & Navigation

### App Router (Next.js 16)

- **File-based Routing**: Routes defined by folder structure in `app/`
- **Layouts**: Shared UI across routes (persistent sidebar, appbar)
- **Route Groups**: `(auth)`, `(panel)` for layout control
- **Dynamic Routes**: `[id]` for parameterized pages
- **Parallel Routes**: Future support for modal routes
- **Intercepting Routes**: Future support for intercepted modals

### Navigation Patterns

**Client-Side Navigation**:

```jsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<Link href="/editor/submissions">Submissions</Link>;

const router = useRouter();
router.push('/editor/dashboard');
```

**Role-Based Redirects**:

- `useRoleRedirect()` hook for programmatic navigation
- Middleware handles automatic redirects on login
- Role-specific default routes in `roleRouteMap`

**Navigation Menu**:

- `sidebarConfig` defines menu items per role
- Dynamic menu rendering based on current role
- Active route highlighting
- Collapsible sidebar (mobile)

## 🎨 Styling Approach

### Tailwind CSS v4

**Configuration** (`globals.css`):

```css
@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(221.2 83.2% 53.3%);
  /* ... more theme variables */
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: hsl(222.2 84% 4.9%);
    --color-foreground: hsl(210 40% 98%);
    /* ... dark theme variables */
  }
}
```

**Design Tokens**:

- CSS custom properties for theming
- Automatic dark mode via `prefers-color-scheme`
- Manual theme toggle with `next-themes`

**Component Styling**:

```jsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">Submit</Button>
```

**Utility Patterns**:

- `class-variance-authority` for component variants
- `tailwind-merge` for conditional classes
- `clsx` for class name composition

## 📦 How to Run Locally

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, pnpm, or bun
- Backend API running (see backend README)

### Environment Variables

Create `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn (optional)
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## 🧪 Development Workflow

### Adding New Features

1. **Create Feature Folder** (if needed): `features/my-feature/`
2. **Add API Functions**: `features/my-feature/api/myFeatureApi.js`
3. **Create Hooks**: `features/my-feature/hooks/query/useGetData.js`
4. **Build Components**: `features/my-feature/components/MyComponent.jsx`
5. **Add Routes**: `app/(panel)/my-feature/page.jsx`
6. **Update Navigation**: Add to `sidebarConfig` if needed

### Code Organization Best Practices

- **Colocate related code**: Keep components, hooks, and API calls together
- **Use barrel exports**: `index.js` files for clean imports
- **Separate concerns**: Business logic in hooks, UI in components
- **Reuse components**: Extract common patterns to `features/shared/components`
- **Type validation**: Use Zod schemas for form validation
- **Error handling**: Toast notifications for user feedback

### React Query Patterns

**Queries** (read data):

```javascript
const { data, isLoading, error, refetch } = useGetSubmissions({ status: 'submitted' });
```

**Mutations** (write data):

```javascript
const { mutate, isPending } = useCreateSubmission({
  onSuccess: () => toast.success('Created!'),
  onError: (error) => toast.error(error.message),
});

mutate({ title: 'My Paper', ... });
```

**Invalidation** (refetch after mutation):

```javascript
queryClient.invalidateQueries({ queryKey: ['submissions'] });
```

### Common Hooks

- **`useCurrentRole()`**: Get and set current user role
- **`useCrossTabAuth()`**: Sync auth across tabs
- **`useToggle()`**: Boolean state toggle
- **`useRoleRedirect()`**: Role-based navigation
- **`useGetRoleList()`**: Fetch available roles

## 📚 Documentation

### Additional Documentation

- **Features**: `docs/Features.md` - Detailed feature documentation
- **Components**: `docs/Components.md` - Component API reference
- **Pages**: `docs/Pages.md` - Page structure and routing
- **State**: `docs/State.md` - State management guide
- **Styling**: `docs/Styling.md` - Styling conventions
- **SuperDoc**: `docs/SUPERDOC_*.md` - SuperDoc integration guides
- **Copyediting**: `docs/COPYEDITING_*.md` - Copyediting workflow
- **Production**: `docs/PRODUCTION_*.md` - Production workflow
- **Achievements**: `ACHIEVEMENTS_IMPLEMENTATION.md` - Achievements system

### Backend API Documentation

- **Backend Docs**: `../backend-journal-portal/docs/` - Backend documentation
- **API Params**: `docs/BACKEND_API_PARAMS.md` - API parameter reference
- **Frontend Spec**: `../backend-journal-portal/docs/FRONTEND_SPECIFICATION.md`

## 🔧 Configuration Files

- **`next.config.mjs`**: Next.js configuration, Sentry setup
- **`tailwind.config.js`**: Tailwind CSS configuration (if exists)
- **`eslint.config.mjs`**: ESLint rules
- **`.prettierrc`**: Prettier formatting rules
- **`jsconfig.json`**: JavaScript path aliases (`@/` → root)
- **`package.json`**: Dependencies and scripts

## 🎯 Key Technical Decisions

### Why Feature-Based Structure?

- **Scalability**: Easy to add new features without affecting others
- **Maintainability**: Related code stays together
- **Team Collaboration**: Multiple developers can work on different features
- **Code Discovery**: Clear where to find feature-specific code

### Why React Query?

- **Caching**: Automatic caching reduces API calls
- **Background Refetching**: Keeps data fresh
- **Optimistic Updates**: Instant UI feedback
- **Automatic Retries**: Resilient to network issues
- **DevTools**: Excellent debugging experience

### Why Redux + React Query?

- **Redux**: Global auth state that needs persistence
- **React Query**: Server state with caching and refetching
- **Separation**: Clear boundary between global and server state

### Why SuperDoc?

- **Real-Time Collaboration**: CRDT-based, no central server needed
- **Offline Support**: Works offline, syncs when online
- **Format Flexibility**: Export to multiple formats
- **Academic Focus**: Built for document-heavy workflows

### Why Lexical?

- **Modern Architecture**: Better than legacy editors (CKEditor, TinyMCE)
- **Extensibility**: Easy to add custom nodes and plugins
- **Performance**: Fast rendering for large documents
- **Framework Agnostic**: Works with any framework

## 🚢 Deployment

### Production Build

```bash
npm run build
# Creates optimized production build in .next/
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.yourjournal.com/api
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
NODE_ENV=production
```

### Hosting Options

- **Vercel**: Recommended (built by Next.js team)
- **Netlify**: Good Next.js support
- **AWS**: Full control (EC2, ECS, Lambda)
- **Docker**: Containerized deployment

### Performance Considerations

- **Code Splitting**: Automatic via Next.js
- **Image Optimization**: Use Next.js `<Image>` component
- **Font Optimization**: Automatic font loading
- **Bundle Analysis**: `npm run analyze` (if configured)

## 📞 Support & Contribution

### Common Issues

**Port already in use**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

**Module not found**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors**:

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📄 License

[Add your license information here]

---

**Last Updated**: December 26, 2025
**Version**: 0.1.0
**Status**: Active Development
