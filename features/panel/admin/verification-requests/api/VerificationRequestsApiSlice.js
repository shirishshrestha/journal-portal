import { instance } from "@/lib/instance";

/**
 * Get pending verification requests
 * @returns {Promise<Array>} Array of pending verification requests
 */
export const getPendingVerificationRequests = async () => {
  try {
    const response = await instance.get("admin/verifications/pending_review/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVerificationRequests = async () => {
  try {
    const response = await instance.get("admin/verifications/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
