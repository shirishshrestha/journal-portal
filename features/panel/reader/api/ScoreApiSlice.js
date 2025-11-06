import { instance } from "@/lib/instance";

/**
 * Get user's auto score and profile status
 * @returns {Promise} API response
 */
export const getUserScoreStatus = async () => {
  const response = await instance.get("verification/status/");
  return response.data;
};
