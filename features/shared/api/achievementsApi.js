import { instance } from '@/lib/instance';

/**
 * Get all badges
 * @param {Object} params - Query parameters (badge_type, level, search, etc.)
 * @returns {Promise} API response
 */
export const getBadges = async (params = {}) => {
  const response = await instance.get('/achievements/badges/', { params });
  return response.data;
};

/**
 * Get a single badge by ID
 * @param {string} id - Badge ID
 * @returns {Promise} API response
 */
export const getBadgeById = async (id) => {
  const response = await instance.get(`/achievements/badges/${id}/`);
  return response.data;
};

/**
 * Get user's badges
 * @param {Object} params - Query parameters (year, journal, is_featured, etc.)
 * @returns {Promise} API response
 */
export const getMyBadges = async (params = {}) => {
  const response = await instance.get('/achievements/user-badges/my_badges/', { params });
  return response.data;
};

/**
 * Get all user badges (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getUserBadges = async (params = {}) => {
  const response = await instance.get('/achievements/user-badges/', { params });
  return response.data;
};

/**
 * Get awards
 * @param {Object} params - Query parameters (year, award_type, journal, discipline, country, etc.)
 * @returns {Promise} API response
 */
export const getAwards = async (params = {}) => {
  const response = await instance.get('/achievements/awards/', { params });
  return response.data;
};

/**
 * Get award by ID
 * @param {string} id - Award ID
 * @returns {Promise} API response
 */
export const getAwardById = async (id) => {
  const response = await instance.get(`/achievements/awards/${id}/`);
  return response.data;
};

/**
 * Get best reviewer for a journal
 * @param {string} journalId - Journal ID
 * @param {number} year - Year (optional, defaults to current year)
 * @returns {Promise} API response
 */
export const getBestReviewer = async (journalId, year = null) => {
  const params = year ? { year } : {};
  const response = await instance.get(`/achievements/awards/best-reviewer/${journalId}/`, {
    params,
  });
  return response.data;
};

/**
 * Get researcher of the year for a journal
 * @param {string} journalId - Journal ID
 * @param {number} year - Year (optional, defaults to current year)
 * @returns {Promise} API response
 */
export const getResearcherOfYear = async (journalId, year = null) => {
  const params = year ? { year } : {};
  const response = await instance.get(`/achievements/awards/researcher-of-year/${journalId}/`, {
    params,
  });
  return response.data;
};

/**
 * Get leaderboards
 * @param {Object} params - Query parameters (category, period, journal, field, country, etc.)
 * @returns {Promise} API response
 */
export const getLeaderboards = async (params = {}) => {
  const response = await instance.get('/achievements/leaderboards/', { params });
  return response.data;
};

/**
 * Get top reviewers leaderboard
 * @param {Object} params - Query parameters (period, journal_id, field, country, limit, etc.)
 * @returns {Promise} API response
 */
export const getTopReviewers = async (params = {}) => {
  const response = await instance.get('/achievements/leaderboards/top_reviewers/', { params });
  return response.data;
};

/**
 * Get user's certificates
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getMyCertificates = async (params = {}) => {
  const response = await instance.get('/achievements/certificates/', { params });
  return response.data;
};

/**
 * Get certificate by ID
 * @param {string} id - Certificate ID
 * @returns {Promise} API response
 */
export const getCertificateById = async (id) => {
  const response = await instance.get(`/achievements/certificates/${id}/`);
  return response.data;
};

/**
 * Generate certificate for an award
 * @param {string} awardId - Award ID
 * @returns {Promise} API response
 */
export const generateAwardCertificate = async (awardId) => {
  const response = await instance.post(`/achievements/certificates/generate-award/${awardId}/`);
  return response.data;
};

/**
 * Verify certificate by verification code (public endpoint)
 * @param {string} code - Verification code
 * @returns {Promise} API response
 */
export const verifyCertificate = async (code) => {
  const response = await instance.get('/achievements/certificates/verify/', {
    params: { code },
  });
  return response.data;
};

/**
 * Generate PDF for certificate
 * @param {string} certificateId - Certificate ID
 * @returns {Promise} API response
 */
export const generateCertificatePDF = async (certificateId) => {
  const response = await instance.post(`/achievements/certificates/${certificateId}/generate_pdf/`);
  return response.data;
};

/**
 * Download certificate PDF
 * @param {string} certificateId - Certificate ID
 * @returns {string} Download URL
 */
export const downloadCertificatePDF = (certificateId) => {
  return `${instance.defaults.baseURL}achievements/certificates/${certificateId}/download_pdf/`;
};

/**
 * Preview certificate PDF
 * @param {string} certificateId - Certificate ID
 * @returns {string} Preview URL
 */
export const previewCertificatePDF = (certificateId) => {
  return `${instance.defaults.baseURL}achievements/certificates/${certificateId}/preview_pdf/`;
};

/**
 * Fetch PDF with authentication
 * @param {string} url - PDF URL
 * @returns {Promise<Blob>} PDF blob
 */
export const fetchPDFWithAuth = async (url) => {
  const response = await instance.get(url, {
    responseType: 'blob',
  });
  return response.data;
};
