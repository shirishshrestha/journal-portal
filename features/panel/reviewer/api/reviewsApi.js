import { instance } from "@/lib/instance";

/**
 * Get all review assignments for the current user
 * @returns {Promise} API response
 */
export const getReviewAssignments = async () => {
  const response = await instance.get("/reviews/assignments/");
  return response.data;
};

/**
 * Get review assignment by ID
 * @param {string} id - Assignment ID
 * @returns {Promise} API response
 */
export const getReviewAssignmentById = async (id) => {
  const response = await instance.get("/reviews/assignments/" + id + "/");
  return response.data;
};

/**
 * Accept a review assignment
 * @param {string} id - Assignment ID
 * @returns {Promise} API response
 */
export const acceptReviewAssignment = async (id) => {
  const response = await instance.post(
    "/reviews/assignments/" + id + "/accept/"
  );
  return response.data;
};

/**
 * Decline a review assignment
 * @param {string} id - Assignment ID
 * @param {Object} data - Decline reason
 * @returns {Promise} API response
 */
export const declineReviewAssignment = async (id, data) => {
  const response = await instance.post(
    "/reviews/assignments/" + id + "/decline/",
    data
  );
  return response.data;
};

/**
 * Get user's submitted reviews
 * @returns {Promise} API response
 */
export const getMyReviews = async () => {
  const response = await instance.get("/reviews/my_reviews/");
  return response.data;
};

/**
 * Submit a review
 * @param {Object} data - Review data
 * @returns {Promise} API response
 */
export const submitReview = async (data) => {
  const response = await instance.post("/reviews/reviews/", data);
  return response.data;
};
