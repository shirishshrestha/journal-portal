import { instance } from "@/lib/instance";

/**
 * Fetch all journals
 * @param {Object} params - Query parameters (e.g., { active_role: 'AUTHOR', search: 'keyword', is_active: true, page: 1 })
 * @returns {Promise} API response
 */
export const getJournals = async (params = {}) => {
  const response = await instance.get("journals/journals/", { params });
  return response.data;
};
