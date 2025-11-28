import { instance } from "@/lib/instance";

/**
 * Change user password
 * POST /api/auth/password/change/
 */
export const changePassword = async (data) => {
  const response = await instance.post("/auth/password/change/", data);
  return response.data;
};

/**
 * Verify email with token
 * POST /api/auth/verify-email/
 */
export const verifyEmail = async () => {
  const response = await instance.post("/auth/verify-email/");
  return response.data;
};

/**
 * Request password reset
 * POST /api/auth/password/reset/
 */
export const requestPasswordReset = async (email) => {
  const response = await instance.post("/auth/password/reset/", { email });
  return response.data;
};

/**
 * Confirm password reset with token
 * POST /api/auth/password/reset/confirm/
 */
export const confirmPasswordReset = async ({
  uid,
  token,
  new_password,
  confirm_password,
}) => {
  const response = await instance.post("/auth/password/reset/confirm/", {
    uid,
    token,
    new_password,
    confirm_password,
  });
  return response.data;
};
