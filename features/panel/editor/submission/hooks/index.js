export { useGetEditorSubmissionById } from "./query/useGetEditorSubmissionById";
export { useGetReviewerRecommendations } from "./query/useGetReviewerRecommendations";
export { useUpdateSubmissionStatus } from "./mutation/useUpdateSubmissionStatus";
export { useAssignReviewers } from "./mutation/useAssignReviewers";
export { useSyncSubmissionToOJS } from "./mutation/useSyncSubmissionToOJS";
export { useGetReviewById } from "./useGetReviewById";

// Copyediting hooks (legacy)
export { useGetCopyeditingParticipants } from "./query/useGetCopyeditingParticipants";
export { useGetCopyeditingDiscussions } from "./query/useGetCopyeditingDiscussions";
export { useGetDiscussionThread } from "./query/useGetDiscussionThread";
export { useAssignCopyeditor } from "./mutation/useAssignCopyeditor";
export { useRemoveCopyeditor } from "./mutation/useRemoveCopyeditor";
export { useCreateDiscussion } from "./mutation/useCreateDiscussion";
export { useAddDiscussionReply } from "./mutation/useAddDiscussionReply";
export { useUpdateDiscussionStatus } from "./mutation/useUpdateDiscussionStatus";

// Copyediting workflow hooks (new)
export * from "./mutation/useCopyeditingAssignments";
export * from "./mutation/useCopyeditingFiles";
export * from "./mutation/useCopyeditingDiscussions";
export * from "./query/useCopyeditingAssignments";
export * from "./query/useCopyeditingFiles";
export * from "./query/useCopyeditingDiscussions";

// Production workflow hooks
export * from "./mutation/useProductionAssignments";
export * from "./mutation/useProductionFiles";
export * from "./mutation/useProductionDiscussions";
export * from "./mutation/usePublicationSchedules";
export * from "./query/useProductionAssignments";
export * from "./query/useProductionFiles";
export * from "./query/useProductionDiscussions";
export * from "./query/usePublicationSchedules";
