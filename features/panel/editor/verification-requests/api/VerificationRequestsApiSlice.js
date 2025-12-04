import { instance } from "@/lib/instance";

/**
 * Get editor verification requests for all their journals
 * @param {object} params - Query parameters (search, status, journal, page)
 * @returns {Promise<Object>} Verification requests data
 */
export const getEditorVerificationRequests = async (params) => {
  try {
    const response = await instance.get(`editor/verifications/`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve a verification request
 * @param {number} id - Verification request ID
 * @param {object} data - Approval data (admin_notes)
 * @returns {Promise<Object>} Updated verification request
 */
export const approveEditorVerification = async (id, data) => {
  try {
    const response = await instance.post(
      `editor/verifications/${id}/approve/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a verification request
 * @param {number} id - Verification request ID
 * @param {object} data - Rejection data (admin_notes)
 * @returns {Promise<Object>} Updated verification request
 */
export const rejectEditorVerification = async (id, data) => {
  try {
    const response = await instance.post(
      `editor/verifications/${id}/reject/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
/**
 * Request more information for a verification request
 * @param {number} id - Verification request ID
 * @param {object} data - Request info data (admin_notes)
 * @returns {Promise<Object>} Updated verification request
 */
export const requestInfoEditorVerification = async (id, data) => {
  try {
    const response = await instance.post(
      `editor/verifications/${id}/request_info/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get editor's journals list for filtering
 * @returns {Promise<Array>} List of editor's journals
 */
export const getEditorJournals = async () => {
  try {
    const response = await instance.get(`editor/journals/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
