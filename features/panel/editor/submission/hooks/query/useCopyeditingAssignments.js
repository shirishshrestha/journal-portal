import { useQuery } from "@tanstack/react-query";
import {
  listCopyeditingAssignments,
  getCopyeditingAssignment,
  getCopyeditingAssignmentFiles,
  getCopyeditingAssignmentDiscussions,
  getCopyeditingAssignmentParticipants,
} from "../../api";

/**
 * Hook to fetch copyediting assignments list
 */
export function useCopyeditingAssignments(options = {}) {
  return useQuery({
    queryKey: ["copyediting-assignments"],
    queryFn: () => listCopyeditingAssignments(),
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single copyediting assignment
 */
export function useCopyeditingAssignment(assignmentId, options = {}) {
  return useQuery({
    queryKey: ["copyediting-assignment", assignmentId],
    queryFn: () => getCopyeditingAssignment(assignmentId),
    enabled: !!assignmentId && options.enabled !== false,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch files for a copyediting assignment
 */
export function useCopyeditingAssignmentFiles(assignmentId, options = {}) {
  return useQuery({
    queryKey: ["copyediting-assignment-files", assignmentId],
    queryFn: () => getCopyeditingAssignmentFiles(assignmentId),
    enabled: !!assignmentId && options.enabled !== false,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch discussions for a copyediting assignment
 */
export function useCopyeditingAssignmentDiscussions(
  assignmentId,
  options = {}
) {
  return useQuery({
    queryKey: ["copyediting-assignment-discussions", assignmentId],
    queryFn: () => getCopyeditingAssignmentDiscussions(assignmentId),
    enabled: !!assignmentId && options.enabled !== false,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch participants for a copyediting assignment
 */
export function useCopyeditingAssignmentParticipants(
  assignmentId,
  options = {}
) {
  return useQuery({
    queryKey: ["copyediting-assignment-participants", assignmentId],
    queryFn: () => getCopyeditingAssignmentParticipants(assignmentId),
    enabled: !!assignmentId && options.enabled !== false,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
