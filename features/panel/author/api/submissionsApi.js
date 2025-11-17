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
 * Get a single submission by ID
 * @param {string} id - Submission ID
 * @returns {Promise} API response
 */
export const getSubmissionById = async (id) => {
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
