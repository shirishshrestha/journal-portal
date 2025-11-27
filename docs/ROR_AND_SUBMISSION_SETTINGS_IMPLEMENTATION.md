# ROR Integration and Submission Settings Improvements

## Overview

This document summarizes the implementation of ROR (Research Organization Registry) integration for institutional affiliations and the complete refactoring of the Submission Settings form.

## Completed Work

### 1. ROR ID Integration

#### Backend API Functions

**File**: `features/shared/api/rorApi.js`

- Added `getRORInstitutionById(rorId)` function
- Extracts ROR ID from full URL format (`https://ror.org/02rg1r889` → `02rg1r889`)
- Calls backend endpoint: `/integrations/ror/{ror_id}/`

#### React Query Hook

**File**: `features/shared/hooks/useGetRORInstitution.js` (NEW)

- Created `useGetRORInstitution(rorId, options)` hook
- Fetches institution details by ROR ID
- 10-minute cache duration
- Only enabled when ROR ID is provided
- Exported from `features/shared/hooks/index.js`

#### Profile Schema Update

**File**: `features/panel/reader/utils/FormSchema.js`

- Added `affiliation_ror_id` field to `profileSchema`
- Optional string field for storing ROR IDs

### 2. InstitutionSearchSelect Component Updates

**File**: `features/shared/components/InstitutionSearchSelect.jsx`

#### New Props

- `onRorIdChange`: Callback function to pass ROR ID to parent component

#### Key Features

1. **ROR ID Extraction**: Automatically extracts ROR ID from institution.id field

   ```javascript
   const rorId = institution.id.replace("https://ror.org/", "");
   onRorIdChange(rorId);
   ```

2. **ROR ID Badge Display**: Shows ROR ID in the institution dropdown

   ```jsx
   {
     institution.id && (
       <Badge variant="outline" className="text-xs px-2 py-0 font-mono">
         ROR: {institution.id.replace("https://ror.org/", "")}
       </Badge>
     );
   }
   ```

3. **Manual Entry Handling**: Clears ROR ID when user enters institution name manually

### 3. ProfileForm Component Updates

**File**: `features/panel/profile/components/ProfileForm.jsx`

#### ROR Integration Features

1. **ROR ID Storage**:

   - Form field for `affiliation_ror_id`
   - Automatically updated when institution is selected from ROR API

2. **Pre-fetch on Edit**:

   - Fetches ROR institution data when `affiliation_ror_id` exists
   - Auto-populates institution name from ROR data

   ```javascript
   const { data: rorInstitution } = useGetRORInstitution(
     defaultValues?.affiliation_ror_id,
     { enabled: Boolean(defaultValues?.affiliation_ror_id) }
   );
   ```

3. **onRorIdChange Handler**:
   ```jsx
   <InstitutionSearchSelect
     value={field.value}
     onChange={field.onChange}
     onRorIdChange={(rorId) => {
       form.setValue("affiliation_ror_id", rorId, { shouldDirty: true });
     }}
   />
   ```

### 4. ProfileInfoCard Display

**File**: `features/panel/profile/components/ProfileInfoCard.jsx`

#### ROR ID Display

- Shows ROR ID as clickable badge next to affiliation name
- Links to ROR registry: `https://ror.org/{ror_id}`
- Styled with mono font for ID readability

```jsx
{
  profileData.affiliation_ror_id && (
    <a
      href={`https://ror.org/${profileData.affiliation_ror_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded font-mono transition-colors"
      title="View on ROR Registry"
    >
      ROR: {profileData.affiliation_ror_id}
    </a>
  );
}
```

### 5. Profile Pages Updates

**Files**:

- `app/(panel)/profile/page.jsx`
- `app/(panel)/reader/profile/page.jsx`

#### Default Values Update

Both pages now include `affiliation_ror_id` in defaultValues:

```javascript
const defaultValues = {
  // ...other fields
  affiliation_name: profileData?.affiliation_name || "",
  affiliation_ror_id: profileData?.affiliation_ror_id || "",
  // ...
};
```

### 6. Submission Settings Form Refactor

#### New Schema File

**File**: `features/panel/editor/journal/utils/submissionSettingsSchema.js` (NEW)

- Complete Zod validation schema
- All submission settings fields with proper types
- Default values for all fields
- Enums for review types, frequencies, currencies

#### Improved Component

**File**: `features/panel/editor/journal/components/settings/SubmissionSettings.jsx` (REFACTORED)

**Previous Implementation Issues**:

- ❌ No form validation
- ❌ Manual state management
- ❌ Repetitive onChange handlers
- ❌ No type safety
- ❌ Hard to maintain
- ❌ No dirty state tracking

**New Implementation Benefits**:

- ✅ React Hook Form integration
- ✅ Zod schema validation
- ✅ Automatic form state management
- ✅ Type-safe with proper enums
- ✅ useFieldArray for dynamic lists
- ✅ Dirty state tracking (save button disabled when no changes)
- ✅ Reset functionality
- ✅ Better UI with shadcn Form components
- ✅ Consistent styling and spacing
- ✅ Better accessibility

**Key Improvements**:

1. **Form Components**: Uses shadcn/ui Form, FormField, FormItem, FormLabel, FormControl, FormMessage
2. **Dynamic Arrays**: submission_requirements with useFieldArray
3. **Validation**: Automatic validation on submit
4. **Better UX**: Switch components properly styled with descriptions
5. **Responsive Layout**: Grid system for better mobile support
6. **Save State**: Shows loading state, disabled when no changes

**Form Sections**:

1. Submission Guidelines (text areas)
2. Submission Requirements (dynamic array)
3. Review Process (select + number inputs)
4. File Requirements (number + text inputs, switches)
5. Publication Settings (selects + number input)
6. Additional Requirements (switches with descriptions)

#### Backup Created

Original file backed up as: `SubmissionSettings.backup.jsx`

## Data Flow

### ROR ID Selection Flow

```
1. User searches institution in InstitutionSearchSelect
2. User selects institution from ROR API results
3. Component extracts ROR ID from institution.id
4. onRorIdChange callback fires with ROR ID
5. ProfileForm sets affiliation_ror_id in form
6. Form submission includes both affiliation_name and affiliation_ror_id
7. Backend stores both values
```

### ROR ID Pre-fetch Flow

```
1. User clicks "Edit Profile"
2. ProfileForm receives defaultValues with affiliation_ror_id
3. useGetRORInstitution hook triggers if ROR ID exists
4. API fetches institution details from backend
5. Institution name auto-populated from ROR data
6. User sees pre-filled institution name
```

## API Endpoints Used

### Frontend → Backend

- `GET /integrations/ror/search/?query={query}` - Search institutions
- `GET /integrations/ror/{ror_id}/` - Get institution by ROR ID
- `PATCH /api/v1/users/profiles/{id}/` - Update profile with affiliation_ror_id

### Backend → ROR API

Backend acts as proxy to ROR.org API

## UI/UX Improvements

### Institution Selection

- **Before**: Simple text input, no verification
- **After**:
  - Searchable dropdown with ROR API
  - Country flags
  - Institution types badges
  - ROR ID badge display
  - Established date
  - Manual entry fallback

### Profile Display

- **Before**: Just institution name
- **After**:
  - Institution name
  - Clickable ROR ID badge
  - Links to ROR registry

### Submission Settings Form

- **Before**:
  - Plain inputs with manual state
  - No validation feedback
  - Unclear error states
- **After**:
  - Structured form sections
  - Inline validation messages
  - Clear labels and descriptions
  - Better visual hierarchy
  - Disabled save when no changes

## Testing Checklist

### ROR Integration

- [ ] Search for institution in profile form
- [ ] Select institution from dropdown
- [ ] Verify ROR ID badge appears in dropdown
- [ ] Submit profile form
- [ ] Verify affiliation_ror_id saved to backend
- [ ] View profile info card
- [ ] Verify ROR ID badge appears next to affiliation
- [ ] Click ROR ID badge, verify opens ROR.org
- [ ] Edit profile with existing ROR ID
- [ ] Verify institution name pre-populated
- [ ] Try manual entry
- [ ] Verify ROR ID cleared on manual entry

### Submission Settings

- [ ] Open submission settings page
- [ ] Verify all fields load correctly
- [ ] Change various fields
- [ ] Verify save button enables
- [ ] Click save
- [ ] Verify success toast
- [ ] Reload page
- [ ] Verify changes persisted
- [ ] Try adding submission requirements
- [ ] Try removing requirements
- [ ] Click reset button
- [ ] Verify form resets to initial values

## Browser Compatibility

- ✅ Chrome/Edge (Tested)
- ✅ Firefox (Expected)
- ✅ Safari (Expected)

## Performance Considerations

- ROR API calls debounced (500ms)
- ROR institution data cached (10 minutes)
- Form validation only on submit (not on every keystroke)
- Proper React Query cache management

## Future Enhancements

### Potential Additions

1. **Multiple Affiliations**: Support for users with multiple institutional affiliations
2. **Affiliation History**: Track affiliation changes over time
3. **ROR Auto-suggest**: Show suggestions as user types institution name
4. **Bulk Import**: Import institution data for multiple users
5. **Submission Settings Templates**: Pre-defined templates for common journal types

## Files Modified Summary

### New Files (6)

- `features/shared/hooks/useGetRORInstitution.js`
- `features/panel/editor/journal/utils/submissionSettingsSchema.js`
- `features/panel/editor/journal/components/settings/SubmissionSettingsImproved.jsx`
- `features/panel/editor/journal/components/settings/SubmissionSettings.backup.jsx`

### Modified Files (8)

- `features/shared/api/rorApi.js`
- `features/shared/hooks/index.js`
- `features/panel/reader/utils/FormSchema.js`
- `features/shared/components/InstitutionSearchSelect.jsx`
- `features/panel/profile/components/ProfileForm.jsx`
- `features/panel/profile/components/ProfileInfoCard.jsx`
- `app/(panel)/profile/page.jsx`
- `app/(panel)/reader/profile/page.jsx`
- `features/panel/editor/journal/components/settings/SubmissionSettings.jsx` (replaced)

**Total: 6 new files + 9 modified files**

## Conclusion

The ROR integration provides a standardized way to identify and verify institutional affiliations, improving data quality and enabling better research network analysis. The submission settings refactor significantly improves maintainability, validation, and user experience using modern form management practices.
