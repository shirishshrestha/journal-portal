/**
 * API slice for email log user stats
 * @module features/panel/settings/api/EmailLogApiSlice
 */
import { instance } from "@/lib/instance";

/**
 * Fetch user email log statistics
 * @returns {Promise<Object>} User email log stats
 */
export const getUserEmailLogStats = async (params) => {
  const response = await instance.get("notifications/email-logs/user_stats/", {
    params,
  });
  return response.data;
};
