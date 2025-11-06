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
export const getVerificationRequests = async () => {
  const response = await instance.get("verification-requests/");
  return response.data;
};
