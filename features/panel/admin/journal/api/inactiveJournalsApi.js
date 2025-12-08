import { instance } from "@/lib/instance";

/**
 * Fetch inactive journals
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getInactiveJournals = async (params = {}) => {
  const response = await instance.get("journals/journals/", {
    params: { ...params, is_active: false },
  });
  return response.data;
};

/**
 * Get journal by ID
 * @param {string} id - Journal ID
 * @returns {Promise} API response
 */
export const getJournalById = async (id) => {
  const response = await instance.get(`journals/journals/${id}/`);
  return response.data;
};

/**
 * Activate a journal
 * @param {string} id - Journal ID
 * @returns {Promise} API response
 */
export const activateJournal = async (id) => {
  const response = await instance.patch(`journals/journals/${id}/`, {
    is_active: true,
  });
  return response.data;
};

/**
 * Update journal details
 * @param {string} id - Journal ID
 * @param {Object} data - Journal data to update
 * @returns {Promise} API response
 */
export const updateJournal = async (id, data) => {
  const response = await instance.patch(`journals/journals/${id}/`, data);
  return response.data;
};
