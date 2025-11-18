import { useMemo } from "react";

/**
 * Hook to categorize submissions by status and review assignments
 * @param {Array} submissions - Array of submissions
 * @returns {Object} Categorized submissions and counts
 */
export const useCategorizedSubmissions = (submissions = []) => {
  const categorized = useMemo(() => {
    return {
      drafts: submissions.filter((s) => s.status === "DRAFT"),
      unassigned: submissions.filter(
        (s) =>
          ["SUBMITTED", "UNDER_REVIEW"].includes(s.status) &&
          (!s.review_assignment_count || s.review_assignment_count === 0)
      ),
      active: submissions.filter(
        (s) =>
          ["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUIRED", "REVISED"].includes(
            s.status
          ) && s.review_assignment_count > 0
      ),
      archived: submissions.filter((s) =>
        ["ACCEPTED", "REJECTED", "WITHDRAWN", "PUBLISHED"].includes(s.status)
      ),
    };
  }, [submissions]);

  const counts = useMemo(
    () => ({
      drafts: categorized.drafts.length,
      unassigned: categorized.unassigned.length,
      active: categorized.active.length,
      archived: categorized.archived.length,
    }),
    [categorized]
  );

  return { categorized, counts };
};
