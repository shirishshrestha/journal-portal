import { instance } from "@/lib/instance";

/**
 * Activity Logs API Service
 * Handles all API calls to the activity logs endpoints
 */

const ACTIVITY_LOGS_BASE = "activity-logs";

/**
 * Fetch activity logs with optional filtering
 * @param {Object} params - Query parameters
 * @param {string} params.user - Filter by user ID
 * @param {string} params.action_type - Filter by action type
 * @param {string} params.resource_type - Filter by resource type
 * @param {string} params.actor_type - Filter by actor type
 * @param {string} params.created_at__gte - Filter by start date
 * @param {string} params.created_at__lte - Filter by end date
 * @param {string} params.ip_address - Filter by IP address
 * @param {string} params.search - Search query
 * @param {string} params.ordering - Sort order
 * @param {number} params.page - Page number
 * @param {number} params.page_size - Items per page
 * @returns {Promise} API response
 */
export const fetchActivityLogs = async (params = {}) => {
  const response = await instance.get(`${ACTIVITY_LOGS_BASE}/`, { params });
  return response.data;
};

/**
 * Fetch detailed information about a specific activity log
 * @param {string} id - The activity log ID
 * @returns {Promise} API response
 */
export const fetchActivityLogDetail = async (id) => {
  const response = await instance.get(`${ACTIVITY_LOGS_BASE}/${id}/`);
  return response.data;
};
