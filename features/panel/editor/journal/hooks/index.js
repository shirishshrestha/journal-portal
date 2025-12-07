export { useGetJournals } from "./query/useGetJournals";
export { useGetJournalById } from "./query/useGetJournalById";
export { useGetTaxonomyTree } from "./query/useGetTaxonomyTree";
export { useGetJournalStaff } from "./query/useGetJournalStaff";
export { useGetJournalSubmissions } from "./query/useGetJournalSubmissions";
export { useGetJournalStatistics } from "./query/useGetJournalStatistics";
export { useGetMyAssignedJournals } from "./query/useGetMyAssignedJournals";
export { useCreateJournal } from "./mutation/useCreateJournal";
export { useUpdateJournal } from "./mutation/useUpdateJournal";
export { useDeleteJournal } from "./mutation/useDeleteJournal";
export {
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
} from "./mutation/useSectionMutations";
export {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./mutation/useCategoryMutations";
export {
  useCreateResearchType,
  useUpdateResearchType,
  useDeleteResearchType,
} from "./mutation/useResearchTypeMutations";
export {
  useCreateArea,
  useUpdateArea,
  useDeleteArea,
} from "./mutation/useAreaMutations";
export {
  useAddJournalStaff,
  useUpdateJournalStaff,
  useRemoveJournalStaff,
} from "./mutation/useStaffMutations";
