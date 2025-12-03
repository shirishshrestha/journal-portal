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
export const verifyEmail = async ({ uid, token }) => {
  const response = await instance.post(`/auth/verify-email/${uid}/${token}/`);
  return response.data;
};

/**
 * Resend verification email
 * POST /api/auth/resend-verification/
 * Note: Requires authentication, gets email from authenticated user
 */
export const resendVerificationEmail = async (email) => {
  const response = await instance.post("/auth/resend-verification/", {
    email,
  });
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

/**
 * Request password setup for imported OJS users
 * POST /api/auth/password/setup/request/
 */
export const requestPasswordSetup = async (email) => {
  const response = await instance.post("/auth/password/setup/request/", {
    email,
  });
  return response.data;
};

/**
 * Setup password for imported OJS users with token
 * POST /api/auth/password/setup/
 */
export const setupPassword = async ({ uid, token, password }) => {
  const response = await instance.post("/auth/password/setup/", {
    uid,
    token,
    password,
  });
  return response.data;
};
