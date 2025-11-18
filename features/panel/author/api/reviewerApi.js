import { instance } from "@/lib/instance";

/**
 * Get reviewer recommendations for a submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response with recommended reviewers
 */
export const getReviewerRecommendations = async (submissionId) => {
  const response = await instance.get(`ml/reviewer-recommendations/${submissionId}/`);
  return response.data;
};
