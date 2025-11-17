import { instance } from "@/lib/instance";

/**
 * Fetch all journals
 * @returns {Promise} API response
 */
export const getJournals = async () => {
  const response = await instance.get("journals/journals");
  return response.data;
};

/**
 * Create a new journal
 * @param {Object} journalData - Journal data to create
 * @returns {Promise} API response
 */
export const createJournal = async (journalData) => {
  const response = await instance.post("journals/journals/", journalData);
  return response.data;
};

/**
 * Update an existing journal
 * @param {string} id - Journal ID
 * @param {Object} journalData - Journal data to update
 * @returns {Promise} API response
 */
export const updateJournal = async ({ id, journalData }) => {
  const response = await instance.patch(
    `journals/journals/${id}/`,
    journalData
  );
  return response.data;
};
