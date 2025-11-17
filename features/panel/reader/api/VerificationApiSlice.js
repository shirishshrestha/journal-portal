import { instance } from "@/lib/instance";

/**
 * Submit a new verification request
 * @param {Object} data - Role request data
 * @returns {Promise} API response
 */
export const submitVerificationRequest = async (data) => {
  const response = await instance.post("verification-requests/", data);
  return response.data;
};

/**
 * Get all verification requests for the current user
 * @returns {Promise} API response with pagination
 */
export const getUserVerificationRequests = async () => {
  const response = await instance.get("verification-requests/my_requests");
  return response.data;
};

/**
 * Respond to an info request for a verification request
 * @param {string} id - Verification request ID
 * @param {Object} data - Response data (fields to update)
 * @returns {Promise} API response
 */
export const respondToInfoRequest = async (id, data) => {
  const response = await instance.patch(`verification-requests/${id}/`, data);
  return response.data;
};

/**
 * Withdraw a verification request
 * @param {string} id - Verification request ID
 * @returns {Promise} API response
 */
export const withdrawVerificationRequest = async (id) => {
  const response = await instance.post(`verification-requests/${id}/withdraw/`);
  return response.data;
};
