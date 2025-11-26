import { instance } from "@/lib/instance";

/**
 * Get system health status
 * @returns {Promise} API response with system health information
 */
export const getSystemHealth = async () => {
  const response = await instance.get("/health");
  return response.data;
};
