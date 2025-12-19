import { instance } from '@/lib/instance';

/**
 * Get all journals (JOURNAL_MANAGER can view all journals)
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getJournals = async (params = {}) => {
  const response = await instance.get('journals/journals/', { params });
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
 * Create a new journal
 * @param {Object} journalData - Journal data to create
 * @returns {Promise} API response
 */
export const createJournal = async (journalData) => {
  const response = await instance.post('journals/journals/', journalData);
  return response.data;
};

/**
 * Update an existing journal
 * @param {string} id - Journal ID
 * @param {Object} journalData - Journal data to update
 * @returns {Promise} API response
 */
export const updateJournal = async ({ id, journalData }) => {
  const response = await instance.patch(`journals/journals/${id}/`, journalData);
  return response.data;
};

/**
 * Delete a journal
 * @param {string} id - Journal ID
 * @returns {Promise} API response
 */
export const deleteJournal = async (id) => {
  const response = await instance.delete(`journals/journals/${id}/`);
  return response.data;
};

/**
 * Get staff members for a journal
 * @param {string} journalId - Journal ID
 * @returns {Promise} API response
 */
export const getJournalStaff = async (journalId) => {
  const response = await instance.get(`journals/journals/${journalId}/staff/`);
  return response.data;
};

/**
 * Add staff member to journal
 * @param {string} journalId - Journal ID
 * @param {Object} staffData - Staff member data (user_id, role, etc.)
 * @returns {Promise} API response
 */
export const addJournalStaff = async ({ journalId, ...staffData }) => {
  const response = await instance.post(`journals/journals/${journalId}/add_staff/`, staffData);
  return response.data;
};

/**
 * Update staff member (including Editor-in-Chief)
 * @param {string} journalId - Journal ID
 * @param {string} userId - User/Profile ID
 * @param {Object} staffData - Staff member data to update
 * @returns {Promise} API response
 */
export const updateJournalStaff = async ({ journalId, userId, ...staffData }) => {
  const response = await instance.patch(
    `journals/journals/${journalId}/staff/${userId}/update/`,
    staffData
  );
  return response.data;
};

/**
 * Remove staff member from journal
 * @param {string} journalId - Journal ID
 * @param {string} userId - User/Profile ID
 * @returns {Promise} API response
 */
export const removeJournalStaff = async ({ journalId, userId }) => {
  const response = await instance.delete(`journals/journals/${journalId}/staff/${userId}/`);
  return response.data;
};

/**
 * Get journal statistics
 * @param {string} journalId - Journal ID
 * @returns {Promise} API response
 */
export const getJournalStatistics = async (journalId) => {
  const response = await instance.get(`journals/journals/${journalId}/statistics/`);
  return response.data;
};

/**
 * Search for users to add as staff members
 * @param {Object} params - Search parameters (query, role, etc.)
 * @returns {Promise} API response
 */
export const searchUsers = async (params = {}) => {
  const response = await instance.get('users/profiles/', { params });
  return response.data;
};
