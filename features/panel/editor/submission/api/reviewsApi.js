import { instance } from "@/lib/instance";

// ==================== REVIEW APIs ====================

/**
 * Get reviews for a specific submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response
 */
export const getSubmissionReviews = async (submissionId) => {
  const response = await instance.get(
    `reviews/reviews/?submission_id=${submissionId}`
  );
  return response.data;
};

/**
 * Get a specific review by ID
 * @param {string} reviewId - Review ID
 * @returns {Promise} API response
 */
export const getReviewById = async (reviewId) => {
  const response = await instance.get(`reviews/${reviewId}/`);
  return response.data;
};

// ==================== EDITORIAL DECISION APIs ====================

/**
 * Get editorial decisions for a submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response
 */
export const getSubmissionDecisions = async (submissionId) => {
  const response = await instance.get(
    `reviews/decisions/submission_decisions/?submission_id=${submissionId}`
  );
  return response.data;
};

/**
 * Create an editorial decision
 * @param {Object} data - { submission, decision_type, decision_letter, confidential_notes, revision_deadline, letter_template }
 * @returns {Promise} API response
 */
export const createEditorialDecision = async (data) => {
  const response = await instance.post(`reviews/decisions/`, data);
  return response.data;
};

/**
 * Send decision letter to author
 * @param {string} decisionId - Editorial decision ID
 * @returns {Promise} API response
 */
export const sendDecisionLetter = async (decisionId) => {
  const response = await instance.post(
    `reviews/decisions/${decisionId}/send_letter/`
  );
  return response.data;
};

/**
 * Get decision letter templates
 * @param {Object} params - { journal_id, decision_type }
 * @returns {Promise} API response
 */
export const getDecisionLetterTemplates = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await instance.get(
    `reviews/decision-templates/?${queryString}`
  );
  return response.data;
};
