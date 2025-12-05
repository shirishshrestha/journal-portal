import { instance } from "@/lib/instance";

// ==================== SUBMISSION DETAIL APIs ====================

/**
 * Get a single submission by ID (admin view)
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const getSubmissionById = async (id) => {
  const response = await instance.get(`submissions/${id}/`);
  return response.data;
};

/**
 * Update submission status (admin only)
 * @param {string} id - Submission ID
 * @param {Object} data - { status: string }
 * @returns {Promise} API response
 */
export const updateSubmissionStatus = async (id, data) => {
  const response = await instance.patch(`submissions/${id}/`, data);
  return response.data;
};

/**
 * Assign reviewers to a submission (admin/editor only)
 * @param {string} id - Submission ID
 * @param {Object} data - { reviewer_ids: string[] }
 * @returns {Promise} API response
 */
export const assignReviewers = async (data) => {
  console.log("Assign Reviewers API - Data:", data);
  const response = await instance.post(`reviews/assignments/`, data);
  return response.data;
};

/**
 * Get reviewer recommendations for a submission
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const getReviewerRecommendations = async (id) => {
  const response = await instance.get(`ml/reviewer-recommendations/${id}`);
  return response.data;
};

/**
 * Sync a single submission to OJS
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const syncSubmissionToOJS = async (id) => {
  const response = await instance.post(
    `submissions/${id}/sync-to-ojs/`,
    {},
    {
      timeout: 60000, // 60 seconds
    }
  );
  return response.data;
};
