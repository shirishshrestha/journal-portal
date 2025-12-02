import { instance } from "@/lib/instance";

/**
 * Create a new submission
 * @param {Object} data - Submission data
 * @returns {Promise} API response
 */
export const createSubmission = async (data) => {
  const response = await instance.post("submissions/", data);
  return response.data;
};

/**
 * Get all submissions for the current user
 * @returns {Promise} API response
 */
export const getSubmissions = async () => {
  const response = await instance.get("submissions/");
  return response.data;
};

/**
 * Get draft submissions
 * @param {Object} params - Query parameters (e.g., { page: 1, search: 'keyword' })
 * @returns {Promise} API response
 */
export const getDraftSubmissions = async (params = {}) => {
  const response = await instance.get("submissions/drafts/", { params });
  return response.data;
};

/**
 * Get unassigned submissions (no reviewers assigned)
 * @returns {Promise} API response
 */
export const getUnassignedSubmissions = async (params) => {
  const response = await instance.get("submissions/unassigned/", { params });
  return response.data;
};

/**
 * Get active submissions (with reviewers assigned)
 * @returns {Promise} API response
 */
export const getActiveSubmissions = async (params) => {
  const response = await instance.get("submissions/active/", { params });
  return response.data;
};

/**
 * Get archived submissions (completed)
 * @returns {Promise} API response
 */
export const getArchivedSubmissions = async (params) => {
  const response = await instance.get("submissions/archived/", { params });
  return response.data;
};

/**
 * Get a single submission by ID
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const getSingleSubmissionById = async (id) => {
  const response = await instance.get("submissions/" + id + "/");
  return response.data;
};

/**
 * Update a submission
 * @param {string} id - Submission ID
 * @param {Object} data - Updated submission data
 * @returns {Promise} API response
 */
export const updateSubmission = async (id, data) => {
  const response = await instance.patch("submissions/" + id + "/", data);
  return response.data;
};

/**
 * Delete a submission
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const deleteSubmission = async (id) => {
  const response = await instance.delete("submissions/" + id + "/");
  return response.data;
};

/**
 * Submit a draft for review
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const submitForReview = async (id) => {
  const response = await instance.post("submissions/" + id + "/submit/");
  return response.data;
};

/**
 * Withdraw a submission
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const withdrawSubmission = async (id) => {
  const response = await instance.post("submissions/" + id + "/withdraw/");
  return response.data;
};

/**
 * Upload documents to a submission
 * @param {string} id - Submission ID
 * @param {FormData} data - Form data with files
 * @returns {Promise} API response
 */
export const uploadDocument = async (id, data) => {
  const response = await instance.post(
    "submissions/" + id + "/upload_document/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Get documents for a submission
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const getSubmissionDocuments = async (id) => {
  const response = await instance.get("submissions/" + id + "/documents/");
  return response.data;
};
