# Achievements System - Testing Checklist

## Pre-Test Setup
- [ ] Backend server is running
- [ ] Frontend dev server is running (`npm run dev`)
- [ ] User is logged in with appropriate role (AUTHOR, REVIEWER, etc.)
- [ ] Database has some test data (badges, awards, leaderboards)

## API Layer Tests

### Achievements API (`features/shared/api/achievementsApi.js`)
- [ ] API file exists
- [ ] All 14 functions are exported
- [ ] Functions use correct axios instance from `@/lib/instance`
- [ ] Functions use correct endpoint paths

## Hooks Tests

### Query Hooks (`features/shared/hooks/query/`)
- [ ] `useGetBadges.js` exists
- [ ] `useGetMyBadges.js` exists
- [ ] `useGetAwards.js` exists
- [ ] `useGetLeaderboards.js` exists
- [ ] `useGetTopReviewers.js` exists
- [ ] `useGetMyCertificates.js` exists
- [ ] All hooks use `useQuery` from `@tanstack/react-query`
- [ ] All hooks have appropriate `queryKey` and `queryFn`
- [ ] All hooks have `staleTime` configuration

### Mutation Hooks (`features/shared/hooks/mutation/`)
- [ ] `useGenerateAwardCertificate.js` exists
- [ ] Hook uses `useMutation` from `@tanstack/react-query`
- [ ] Hook has `onSuccess` with toast notification
- [ ] Hook has `onError` with toast notification
- [ ] Hook invalidates appropriate queries on success

### Exports
- [ ] All hooks are exported in `features/shared/hooks/index.js`
- [ ] All components are exported in `features/shared/components/index.js`

## Component Tests

### BadgeCard (`features/shared/components/achievements/BadgeCard.jsx`)
- [ ] `BadgeCard` component renders correctly
- [ ] Badge type colors display (Review=blue, Publication=green, Special=purple)
- [ ] Badge levels display (Bronze, Silver, Gold, Platinum) with correct colors
- [ ] Featured badge shows star indicator
- [ ] Earned badges show earned date
- [ ] Not-earned badges show "Not yet earned"
- [ ] `BadgeGrid` component renders correctly
- [ ] Grid shows all badges (earned and not earned)
- [ ] Empty state shows when no badges

### LeaderboardTable (`features/shared/components/achievements/LeaderboardTable.jsx`)
- [ ] Component renders correctly
- [ ] Top 3 positions show crown/medal icons
- [ ] User avatar displays (or fallback)
- [ ] User name and email display
- [ ] Score displays with formatting
- [ ] Additional stats display (if available)
- [ ] Period badge displays
- [ ] Empty state shows when no data

### AwardCard (`features/shared/components/achievements/AwardCard.jsx`)
- [ ] `AwardCard` component renders correctly
- [ ] Award type colors display correctly
- [ ] Year badge displays
- [ ] Journal, discipline, country info displays
- [ ] Awarded date displays
- [ ] Certificate generation button shows
- [ ] Button disabled after certificate generated
- [ ] `AwardGrid` component renders correctly
- [ ] Empty state shows when no awards

### AchievementStats (`features/shared/components/achievements/AchievementStats.jsx`)
- [ ] Component renders correctly
- [ ] Total badges stat card displays
- [ ] Awards stat card displays
- [ ] Featured badges stat card displays
- [ ] Leaderboard rank displays (if provided)
- [ ] Badge level breakdown displays (Bronze/Silver/Gold/Platinum)
- [ ] Icons display correctly
- [ ] Colors are consistent

## Page Tests

### Achievements Page (`app/(panel)/achievements/page.jsx`)
- [ ] Page accessible at `/achievements`
- [ ] Page loads without errors
- [ ] Three tabs display: Overview, Badges, Awards
- [ ] Loading state shows during fetch
- [ ] Error state shows on fetch error

#### Overview Tab
- [ ] Achievement statistics component displays
- [ ] Recent badges section shows (if badges exist)
- [ ] Recent awards section shows (if awards exist)
- [ ] "No achievements" message shows (if no data)

#### Badges Tab
- [ ] Badge grid displays all badges
- [ ] Progress indicator shows (X of Y earned)
- [ ] Earned badges are highlighted
- [ ] Not-earned badges are dimmed

#### Awards Tab
- [ ] Award grid displays all awards
- [ ] Certificate generation button works
- [ ] Toast notification shows on success
- [ ] Toast notification shows on error
- [ ] "No awards yet" message shows (if no awards)

### Leaderboards Page (`app/(panel)/leaderboards/page.jsx`)
- [ ] Page accessible at `/leaderboards`
- [ ] Page loads without errors
- [ ] Two tabs display: Top Reviewers, All Leaderboards
- [ ] Period filter works (Weekly, Monthly, Yearly, All Time)
- [ ] Category filter works (Reviews, Publications, Citations)
- [ ] Filters trigger re-fetch
- [ ] Loading state shows during fetch
- [ ] Error state shows on fetch error

#### Top Reviewers Tab
- [ ] Top reviewers leaderboard displays
- [ ] Rankings show correctly
- [ ] User info displays

#### All Leaderboards Tab
- [ ] All leaderboards display
- [ ] Each leaderboard has period indicator
- [ ] "No leaderboards available" shows (if no data)

## Integration Tests

### Profile Page (`app/(panel)/profile/page.jsx`)
- [ ] Page accessible at `/profile`
- [ ] "My Achievements" section displays
- [ ] Section only shows when not in edit mode
- [ ] Achievement stats display
- [ ] Featured badges display (top 3)
- [ ] "View All" button links to `/achievements`
- [ ] Loading skeleton shows during fetch
- [ ] No errors when no badges

### Author Dashboard (`app/(panel)/author/dashboard/page.jsx`)
- [ ] Page accessible at `/author/dashboard`
- [ ] "My Achievements" card displays at bottom
- [ ] Recent badges display (top 3)
- [ ] "View All" button links to `/achievements`
- [ ] Loading skeleton shows during fetch
- [ ] Empty state message shows when no badges
- [ ] No errors when no badges

### Reviewer Dashboard (`app/(panel)/reviewer/dashboard/page.jsx`)
- [ ] Page accessible at `/reviewer/dashboard`
- [ ] "My Achievements" card displays at bottom
- [ ] Recent badges display (top 3)
- [ ] "Leaderboards" button links to `/leaderboards`
- [ ] "View All" button links to `/achievements`
- [ ] Loading skeleton shows during fetch
- [ ] Empty state message shows when no badges
- [ ] No errors when no badges

## Functionality Tests

### Badge Display
- [ ] Earned badges have full opacity
- [ ] Not-earned badges have reduced opacity (60%)
- [ ] Featured badges have yellow ring
- [ ] Badge criteria text displays
- [ ] Earned date formats correctly (MMM dd, yyyy)

### Certificate Generation
- [ ] Click "Generate Certificate" button
- [ ] Toast notification shows success
- [ ] Button changes to "Certificate Generated"
- [ ] Button becomes disabled
- [ ] My certificates query invalidates and refetches

### Leaderboard Filtering
- [ ] Change period filter
- [ ] Leaderboard refetches with new data
- [ ] Change category filter
- [ ] Leaderboard refetches with new data
- [ ] Loading state shows during refetch

### Navigation
- [ ] All "View All" buttons navigate correctly
- [ ] All "Leaderboards" buttons navigate correctly
- [ ] Browser back button works
- [ ] Direct URL access works

## Responsive Design Tests

### Mobile (< 768px)
- [ ] Badge grids show 1 column
- [ ] Award grids show 1 column
- [ ] Stat cards stack vertically
- [ ] Tabs work on mobile
- [ ] Filters stack vertically
- [ ] Leaderboard table scrolls horizontally if needed

### Tablet (768px - 1024px)
- [ ] Badge grids show 2 columns
- [ ] Award grids show 2 columns
- [ ] Stat cards show 2 columns
- [ ] Layout looks balanced

### Desktop (> 1024px)
- [ ] Badge grids show 3 columns
- [ ] Award grids show 3 columns
- [ ] Stat cards show 4 columns (achievements page) or 5 (reviewer dashboard)
- [ ] Layout uses full width appropriately

## Error Handling Tests

### Network Errors
- [ ] Disconnected from backend
- [ ] Error card displays on pages
- [ ] Error toast shows on mutations
- [ ] "Retry" button works on error cards

### Empty States
- [ ] No badges: Shows "No badges available"
- [ ] No awards: Shows "No awards yet. Keep up the great work!"
- [ ] No leaderboards: Shows "No leaderboards available"
- [ ] Empty states have appropriate icons

### Loading States
- [ ] All pages show LoadingScreen on initial load
- [ ] All cards show CardSkeleton during fetch
- [ ] Buttons show loading state during mutations

## Performance Tests

### Query Caching
- [ ] Navigate to achievements page
- [ ] Navigate away
- [ ] Navigate back to achievements page
- [ ] Data loads from cache (instant)
- [ ] Stale data refetches in background

### Query Invalidation
- [ ] Generate certificate
- [ ] My certificates query refetches
- [ ] Awards query refetches
- [ ] Data updates without page reload

### Parallel Fetching
- [ ] Multiple queries fetch in parallel
- [ ] Page doesn't wait for sequential fetches
- [ ] All data loads efficiently

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter key activates buttons
- [ ] Tab order is logical
- [ ] Focus indicators are visible

### Screen Reader
- [ ] Icons have appropriate labels
- [ ] Cards have meaningful content
- [ ] Tables have proper headers
- [ ] Empty states have descriptive text

### Color Contrast
- [ ] Badge colors have sufficient contrast
- [ ] Text is readable on all backgrounds
- [ ] Color is not the only indicator of status

## Cross-Browser Tests

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

## Integration with Backend

### API Responses
- [ ] Badges endpoint returns correct structure
- [ ] My badges endpoint returns correct structure
- [ ] Awards endpoint returns correct structure
- [ ] Leaderboards endpoint returns correct structure
- [ ] Top reviewers endpoint returns correct structure
- [ ] Certificate generation endpoint works
- [ ] All pagination works (if implemented)

### Authentication
- [ ] Authenticated requests include token
- [ ] Unauthorized requests redirect to login
- [ ] Token refresh works (if applicable)

### Real-Time Updates
- [ ] Earn a badge (trigger backend logic)
- [ ] Badge appears in my badges
- [ ] Stats update correctly
- [ ] Featured badge indicator updates

## Final Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] No TypeScript errors (if applicable)
- [ ] No React errors
- [ ] All images load correctly
- [ ] All icons display correctly
- [ ] All links work
- [ ] All buttons work
- [ ] All filters work
- [ ] All tabs work
- [ ] Toast notifications appear and disappear
- [ ] Loading states appear and disappear
- [ ] Error states can be dismissed
- [ ] Page titles are correct
- [ ] Meta descriptions are appropriate

## Documentation

- [ ] ACHIEVEMENTS_IMPLEMENTATION.md is complete
- [ ] Code comments are clear
- [ ] Component JSDoc comments are present
- [ ] API function comments are present

## Performance Metrics

- [ ] Page load time < 2s
- [ ] Time to interactive < 3s
- [ ] No memory leaks
- [ ] No excessive re-renders
- [ ] Bundle size is reasonable

## Known Issues / Future Enhancements

Track any issues found during testing:

### Issues
- [ ] List any bugs found
- [ ] List any styling inconsistencies
- [ ] List any UX improvements needed

### Future Enhancements
- [ ] Certificate PDF download
- [ ] Social sharing for achievements
- [ ] Achievement notifications
- [ ] Progress bars for badge requirements
- [ ] Animations for badge unlocks
- [ ] Search/filter on badges page
- [ ] Certificate preview modal
- [ ] User comparison on leaderboards
- [ ] Achievement streaks
- [ ] Badge collections/sets

## Sign-Off

- [ ] All critical tests passed
- [ ] All blockers resolved
- [ ] Ready for production deployment

**Tested by:** _________________
**Date:** _________________
**Version:** _________________
**Notes:** _________________
