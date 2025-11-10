import { instance } from "@/lib/instance";

/**
 * Approve a verification request
 * @param {string} id - Verification request ID
 * @param {Object} data - Approval data (admin_notes)
 * @returns {Promise}
 */
export const approveVerification = async (id, data) => {
  const response = await instance.post(
    `/admin/verifications/${id}/approve/`,
    data
  );
  return response.data;
};

/**
 * Reject a verification request
 * @param {string} id - Verification request ID
 * @param {Object} data - Rejection data (rejection_reason, admin_notes)
 * @returns {Promise}
 */
export const rejectVerification = async (id, data) => {
  const response = await instance.post(
    `/admin/verifications/${id}/reject/`,
    data
  );
  return response.data;
};
