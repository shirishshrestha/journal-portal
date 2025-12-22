# Achievements System - Frontend Implementation

## Overview
Complete frontend implementation of the achievements system following the existing Next.js and React Query patterns in the project.

## Structure

### 1. API Layer (`features/shared/api/achievementsApi.js`)
**Functions implemented:**
- `getBadges(params)` - Get all badges with filtering
- `getBadgeById(id)` - Get single badge details
- `getMyBadges(params)` - Get user's earned badges
- `getUserBadges(params)` - Get all user badges (admin)
- `getAwards(params)` - Get awards with filtering
- `getAwardById(id)` - Get single award details
- `getBestReviewer(journalId, year)` - Get best reviewer for journal/year
- `getResearcherOfYear(journalId, year)` - Get researcher of year
- `getLeaderboards(params)` - Get leaderboards with filtering
- `getTopReviewers(params)` - Get top reviewers leaderboard
- `getMyCertificates(params)` - Get user's certificates
- `getCertificateById(id)` - Get single certificate
- `generateAwardCertificate(awardId)` - Generate certificate for award
- `verifyCertificate(code)` - Verify certificate by code

**Pattern:** All functions use the axios instance from `@/lib/instance` and follow the standard pattern:
```javascript
export const getFunctionName = async (params) => {
  const response = await instance.get('/endpoint/', { params });
  return response.data;
};
```

### 2. Query Hooks (`features/shared/hooks/query/`)
**Hooks created:**
- `useGetBadges(params)` - Fetch all badges
- `useGetMyBadges(params)` - Fetch user's badges
- `useGetAwards(params)` - Fetch awards
- `useGetLeaderboards(params)` - Fetch leaderboards
- `useGetTopReviewers(params)` - Fetch top reviewers
- `useGetMyCertificates(params)` - Fetch user's certificates

**Pattern:** All hooks use `@tanstack/react-query` with consistent configuration:
```javascript
import { useQuery } from '@tanstack/react-query';
import { getFunction } from '../../api/achievementsApi';

export const useGetData = (params = {}) => {
  return useQuery({
    queryKey: ['key', params],
    queryFn: () => getFunction(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
```

### 3. Mutation Hooks (`features/shared/hooks/mutation/`)
**Hooks created:**
- `useGenerateAwardCertificate()` - Generate certificate with success/error handling

**Pattern:** Uses `useMutation` with toast notifications and query invalidation:
```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useMutationHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiFunction,
    onSuccess: (data) => {
      toast.success('Success message');
      queryClient.invalidateQueries({ queryKey: ['related-queries'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Error message');
    },
  });
};
```

### 4. Components (`features/shared/components/achievements/`)

#### BadgeCard.jsx
- **BadgeCard** - Display a single badge with:
  - Badge name, description, and level
  - Color-coded badge types (Review, Publication, Special)
  - Level badges (Bronze, Silver, Gold, Platinum)
  - Featured badge indicator
  - Earned date
  - Criteria information
  
- **BadgeGrid** - Display grid of badges:
  - Shows all badges (earned and not earned)
  - Highlights earned badges
  - Marks featured badges
  - Empty state handling

#### LeaderboardTable.jsx
- **LeaderboardTable** - Display leaderboard rankings:
  - Crown/medal icons for top 3 positions
  - User avatar, name, and email
  - Score with formatting
  - Additional stats (if available)
  - Period indicator
  - Empty state handling

#### AwardCard.jsx
- **AwardCard** - Display a single award:
  - Award title, description, and type
  - Year, journal, discipline, country info
  - Color-coded award types
  - Certificate generation button
  - Awarded date
  
- **AwardGrid** - Display grid of awards:
  - Shows all awards
  - Certificate generation integration
  - Empty state handling

#### AchievementStats.jsx
- **AchievementStats** - Display user statistics:
  - Total badges count
  - Awards count
  - Featured badges count
  - Leaderboard position (optional)
  - Badge level breakdown (Bronze/Silver/Gold/Platinum)
  - Visual stat cards with icons

### 5. Pages

#### `/achievements` page (`app/(panel)/achievements/page.jsx`)
**Features:**
- Three tabs: Overview, Badges, Awards
- Overview tab:
  - Achievement statistics
  - Recent badges (top 3)
  - Recent awards (top 3)
- Badges tab:
  - All badges with earn status
  - Progress indicator (X of Y earned)
- Awards tab:
  - All user awards
  - Certificate generation
- Loading and error states
- Uses shadcn/ui tabs component

#### `/leaderboards` page (`app/(panel)/leaderboards/page.jsx`)
**Features:**
- Two tabs: Top Reviewers, All Leaderboards
- Filters:
  - Period (Weekly, Monthly, Yearly, All Time)
  - Category (Reviews, Publications, Citations)
- Top Reviewers tab:
  - Dedicated top reviewers leaderboard
  - Ranking with positions
- All Leaderboards tab:
  - Shows all available leaderboards
  - Period indicators
- Loading and error states

### 6. Integration into Existing Pages

#### Profile Page (`app/(panel)/profile/page.jsx`)
**Additions:**
- "My Achievements" section below profile form
- Achievement statistics component
- Featured badges display (top 3)
- "View All" button linking to achievements page
- Only shown when not in edit mode
- Loading skeleton during fetch

#### Author Dashboard (`app/(panel)/author/dashboard/page.jsx`)
**Additions:**
- "My Achievements" card at bottom
- Shows recent badges (top 3)
- Empty state message encouraging publication
- "View All" button linking to achievements page
- Loading skeleton during fetch

#### Reviewer Dashboard (`app/(panel)/reviewer/dashboard/page.jsx`)
**Additions:**
- "My Achievements" card at bottom
- Shows recent review badges (top 3)
- Two action buttons: "Leaderboards" and "View All"
- Empty state message encouraging reviews
- Loading skeleton during fetch

### 7. Exports Configuration

#### `features/shared/hooks/index.js`
Added exports:
```javascript
// Achievements
useGetBadges,
useGetMyBadges,
useGetAwards,
useGetLeaderboards,
useGetTopReviewers,
useGetMyCertificates,
useGenerateAwardCertificate,
```

#### `features/shared/components/index.js`
Added export:
```javascript
export * from './achievements';
```

#### `features/shared/components/achievements/index.js`
Exports all achievement components:
```javascript
export { BadgeCard, BadgeGrid } from './BadgeCard';
export { LeaderboardTable } from './LeaderboardTable';
export { AwardCard, AwardGrid } from './AwardCard';
export { AchievementStats } from './AchievementStats';
```

## UI Components Used

All components use shadcn/ui components for consistency:
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Badge`
- `Button`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Avatar`, `AvatarFallback`, `AvatarImage`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`

Icons from `lucide-react`:
- `Trophy`, `Award`, `Medal`, `Star`, `Crown`
- `Calendar`, `TrendingUp`, `Plus`
- `FileCheck`, `Download`

## Backend API Endpoints Required

The frontend expects these backend endpoints:

### Badges
- `GET /achievements/badges/` - List all badges
- `GET /achievements/badges/:id/` - Get badge details
- `GET /achievements/user-badges/my_badges/` - Get user's badges
- `GET /achievements/user-badges/` - Get all user badges (admin)

### Awards
- `GET /achievements/awards/` - List all awards
- `GET /achievements/awards/:id/` - Get award details
- `GET /achievements/awards/best-reviewer/:journalId/` - Get best reviewer
- `GET /achievements/awards/researcher-of-year/:journalId/` - Get researcher of year

### Leaderboards
- `GET /achievements/leaderboards/` - List leaderboards
- `GET /achievements/leaderboards/top_reviewers/` - Get top reviewers

### Certificates
- `GET /achievements/certificates/` - List user's certificates
- `GET /achievements/certificates/:id/` - Get certificate details
- `POST /achievements/certificates/generate-award/:awardId/` - Generate certificate
- `GET /achievements/certificates/verify/?code=XXX` - Verify certificate

## Features

✅ **Complete API integration** - All backend endpoints covered
✅ **React Query caching** - Efficient data fetching with stale time management
✅ **Toast notifications** - User feedback for all actions
✅ **Loading states** - Skeleton loaders and spinners
✅ **Error handling** - Error cards with retry functionality
✅ **Empty states** - User-friendly messages when no data
✅ **Responsive design** - Grid layouts adapt to screen size
✅ **Type-safe** - Consistent data structures
✅ **Consistent patterns** - Follows existing codebase conventions
✅ **Accessible** - Semantic HTML and ARIA labels via shadcn/ui
✅ **Visual hierarchy** - Icons, colors, and spacing for clarity
✅ **Badge levels** - Bronze, Silver, Gold, Platinum with colors
✅ **Featured badges** - Star indicator for special achievements
✅ **Leaderboard rankings** - Crown/medal icons for top 3
✅ **Certificate generation** - One-click certificate creation
✅ **Filtering** - Period and category filters on leaderboards
✅ **Navigation** - Links between related pages
✅ **Integration** - Seamlessly integrated into existing dashboards

## Usage Examples

### Fetching user's badges
```javascript
import { useGetMyBadges } from '@/features';

const { data, isPending, error } = useGetMyBadges({ year: 2024 });
const myBadges = data?.results || [];
```

### Displaying badges
```javascript
import { BadgeGrid, useGetBadges, useGetMyBadges } from '@/features';

const { data: badgesData } = useGetBadges();
const { data: myBadgesData } = useGetMyBadges();

<BadgeGrid 
  badges={badgesData?.results || []} 
  userBadges={myBadgesData?.results || []} 
/>
```

### Generating certificates
```javascript
import { useGenerateAwardCertificate } from '@/features';

const { mutate: generateCertificate } = useGenerateAwardCertificate();

<Button onClick={() => generateCertificate(awardId)}>
  Generate Certificate
</Button>
```

### Showing leaderboard
```javascript
import { LeaderboardTable, useGetTopReviewers } from '@/features';

const { data: topReviewers } = useGetTopReviewers({ period: 'monthly' });

<LeaderboardTable leaderboard={topReviewers} showPeriod={false} />
```

## Next Steps

1. **Test the implementation:**
   - Start frontend dev server
   - Navigate to `/achievements` page
   - Navigate to `/leaderboards` page
   - Check profile page for achievements section
   - Check author/reviewer dashboards for achievements

2. **Backend verification:**
   - Ensure all API endpoints are working
   - Test badge auto-awarding on review completion
   - Test award calculations
   - Test certificate generation

3. **Optional enhancements:**
   - Add certificate PDF download
   - Add social sharing for achievements
   - Add achievement notifications
   - Add progress bars for badge requirements
   - Add animations for badge unlocks
   - Add search/filter on badges page
   - Add certificate preview modal
   - Add user comparison on leaderboards

## File Structure Summary

```
frontend/
├── app/(panel)/
│   ├── achievements/
│   │   └── page.jsx                     # Main achievements page
│   ├── leaderboards/
│   │   └── page.jsx                     # Leaderboards page
│   ├── profile/
│   │   └── page.jsx                     # Updated with achievements section
│   ├── author/
│   │   └── dashboard/
│   │       └── page.jsx                 # Updated with achievements
│   └── reviewer/
│       └── dashboard/
│           └── page.jsx                 # Updated with achievements
│
├── features/shared/
│   ├── api/
│   │   └── achievementsApi.js           # All API functions
│   ├── hooks/
│   │   ├── query/
│   │   │   ├── useGetBadges.js
│   │   │   ├── useGetMyBadges.js
│   │   │   ├── useGetAwards.js
│   │   │   ├── useGetLeaderboards.js
│   │   │   ├── useGetTopReviewers.js
│   │   │   └── useGetMyCertificates.js
│   │   ├── mutation/
│   │   │   └── useGenerateAwardCertificate.js
│   │   └── index.js                     # Updated exports
│   └── components/
│       ├── achievements/
│       │   ├── BadgeCard.jsx
│       │   ├── LeaderboardTable.jsx
│       │   ├── AwardCard.jsx
│       │   ├── AchievementStats.jsx
│       │   └── index.js
│       └── index.js                     # Updated exports
```

## Notes

- All components follow the existing codebase patterns
- Uses `@tanstack/react-query` for state management
- Uses `sonner` for toast notifications
- Uses `shadcn/ui` for UI components
- Uses `lucide-react` for icons
- Uses `date-fns` for date formatting
- Fully responsive with Tailwind CSS
- Works with all user roles (AUTHOR, REVIEWER, EDITOR, etc.)
- Integrates seamlessly with existing navigation
