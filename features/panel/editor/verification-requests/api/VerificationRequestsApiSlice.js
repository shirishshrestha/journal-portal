import { instance } from "@/lib/instance";

/**
 * Get editor verification requests for a specific journal
 * @param {string} journalId - Journal ID
 * @param {object} params - Query parameters (status)
 * @returns {Promise<Object>} Verification requests data
 */
export const getEditorVerificationRequests = async (journalId, params = {}) => {
  try {
    const response = await instance.get(
      `journals/journals/${journalId}/verification-requests/`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve a verification request
 * @param {string} journalId - Journal ID
 * @param {string} requestId - Verification request ID
 * @param {object} data - Approval data (admin_notes)
 * @returns {Promise<Object>} Updated verification request
 */
export const approveEditorVerification = async (journalId, requestId, data) => {
  try {
    const response = await instance.post(
      `journals/journals/${journalId}/verification-requests/${requestId}/approve/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a verification request
 * @param {string} journalId - Journal ID
 * @param {string} requestId - Verification request ID
 * @param {object} data - Rejection data (rejection_reason, admin_notes)
 * @returns {Promise<Object>} Updated verification request
 */
export const rejectEditorVerification = async (journalId, requestId, data) => {
  try {
    const response = await instance.post(
      `journals/journals/${journalId}/verification-requests/${requestId}/reject/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request more information for a verification request
 * @param {string} journalId - Journal ID
 * @param {string} requestId - Verification request ID
 * @param {object} data - Request info data (info_request)
 * @returns {Promise<Object>} Updated verification request
 */
export const requestInfoEditorVerification = async (
  journalId,
  requestId,
  data
) => {
  try {
    const response = await instance.post(
      `journals/journals/${journalId}/verification-requests/${requestId}/request-info/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get editor's journals list
 * @returns {Promise<Array>} List of editor's journals
 */
export const getEditorJournals = async () => {
  try {
    const response = await instance.get(`journals/journals/`, {
      params: { role: "editor" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
