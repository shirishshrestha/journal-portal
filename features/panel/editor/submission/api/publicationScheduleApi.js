import { instance } from "@/lib/instance";

const BASE_URL = `/submissions/production/schedules`;

/**
 * Get all publication schedules
 * @param {Object} params - Query parameters (status, year, volume, issue, search, ordering)
 * @returns {Promise} - API response
 */
export const getPublicationSchedules = async (params = {}) => {
  const response = await instance.get(BASE_URL, { params });
  return response.data;
};

/**
 * Get a single publication schedule by ID
 * @param {string} scheduleId - Schedule UUID
 * @returns {Promise} - API response
 */
export const getPublicationSchedule = async (scheduleId) => {
  const response = await instance.get(`${BASE_URL}/${scheduleId}/`);
  return response.data;
};

/**
 * Update publication schedule (partial update)
 * @param {string} scheduleId - Schedule UUID
 * @param {Object} data - Schedule data to update
 * @returns {Promise} - API response
 */
export const updatePublicationSchedule = async (scheduleId, data) => {
  const response = await instance.patch(`${BASE_URL}/${scheduleId}/`, data);
  return response.data;
};

/**
 * Update publication schedule (full update)
 * @param {string} scheduleId - Schedule UUID
 * @param {Object} data - Complete schedule data
 * @returns {Promise} - API response
 */
export const replacePublicationSchedule = async (scheduleId, data) => {
  const response = await instance.put(`${BASE_URL}/${scheduleId}/`, data);
  return response.data;
};

/**
 * Delete publication schedule
 * @param {string} scheduleId - Schedule UUID
 * @returns {Promise} - API response
 */
export const deletePublicationSchedule = async (scheduleId) => {
  const response = await instance.delete(`${BASE_URL}/${scheduleId}/`);
  return response.data;
};

/**
 * Cancel publication schedule
 * @param {string} scheduleId - Schedule UUID
 * @returns {Promise} - API response
 */
export const cancelPublicationSchedule = async (scheduleId) => {
  const response = await instance.post(`${BASE_URL}/${scheduleId}/cancel/`);
  return response.data;
};

/**
 * Publish immediately
 * @param {string} scheduleId - Schedule UUID
 * @returns {Promise} - API response
 */
export const publishNow = async (scheduleId) => {
  const response = await instance.post(
    `${BASE_URL}/${scheduleId}/publish_now/`
  );
  return response.data;
};
