import { instance } from "@/lib/instance";

/**
 * Search for institutions using ROR (Research Organization Registry) API
 * @param {string} query - Search query string
 * @returns {Promise} API response with institution search results
 */
export const searchRORInstitutions = async (query) => {
  if (!query || query.trim().length === 0) {
    return { count: 0, results: [] };
  }

  const response = await instance.get(`/integrations/ror/search/`, {
    params: { query: query.trim() },
  });
  return response.data;
};

/**
 * Get institution details by ROR ID
 * @param {string} rorId - ROR ID (can be full URL or just the ID)
 * @returns {Promise} API response with institution details
 */
export const getRORInstitutionById = async (rorId) => {
  if (!rorId) {
    throw new Error("ROR ID is required");
  }

  // Extract just the ID if full URL is provided
  const id = rorId.replace("https://ror.org/", "");

  const response = await instance.get(`/integrations/ror/${id}/`);
  return response.data;
};
