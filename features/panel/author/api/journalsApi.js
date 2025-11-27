import { instance } from "@/lib/instance";

/**
 * Fetch journal details by ID (for authors)
 * GET /api/journals/journals/{id}/
 */
export const getJournalById = async (id) => {
  const response = await instance.get(`/journals/journals/${id}/`);
  return response.data;
};
