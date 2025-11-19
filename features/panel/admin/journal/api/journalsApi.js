import { instance } from "@/lib/instance";

/**
 * Fetch all journals
 * @returns {Promise} API response
 */
export const getJournals = async () => {
  const response = await instance.get("journals/journals/");
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

/**
 * Get journal by ID
 * @param {string} id - Journal ID
 * @returns {Promise} API response
 */
export const getJournalById = async (id) => {
  const response = await instance.get(`journals/journals/${id}/`);
  return response.data;
};

// ==================== TAXONOMY APIs ====================

/**
 * Get all sections for a journal
 * @param {string} journalId - Journal ID
 * @returns {Promise} API response
 */
export const getSections = async (journalId) => {
  const response = await instance.get(
    `journals/sections/?journal=${journalId}`
  );
  return response.data;
};

/**
 * Create a new section
 * @param {Object} sectionData - Section data
 * @returns {Promise} API response
 */
export const createSection = async (sectionData) => {
  const response = await instance.post("journals/sections/", sectionData);
  return response.data;
};

/**
 * Update a section
 * @param {string} id - Section ID
 * @param {Object} sectionData - Section data
 * @returns {Promise} API response
 */
export const updateSection = async ({ id, ...sectionData }) => {
  const response = await instance.patch(
    `journals/sections/${id}/`,
    sectionData
  );
  return response.data;
};

/**
 * Delete a section
 * @param {string} id - Section ID
 * @returns {Promise} API response
 */
export const deleteSection = async (id) => {
  const response = await instance.delete(`journals/sections/${id}/`);
  return response.data;
};

/**
 * Get section by ID
 * @param {string} id - Section ID
 * @returns {Promise} API response
 */
export const getSectionById = async (id) => {
  const response = await instance.get(`journals/sections/${id}/`);
  return response.data;
};

/**
 * Get all categories for a section or journal
 * @param {string} sectionId - Section ID (optional)
 * @param {string} journalId - Journal ID (optional)
 * @returns {Promise} API response
 */
export const getCategories = async ({ sectionId, journalId }) => {
  let url = "journals/categories/";
  const params = new URLSearchParams();
  if (sectionId) params.append("section", sectionId);
  if (journalId) params.append("journal", journalId);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await instance.get(url);
  return response.data;
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise} API response
 */
export const createCategory = async (categoryData) => {
  const response = await instance.post("journals/categories/", categoryData);
  return response.data;
};

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Category data
 * @returns {Promise} API response
 */
export const updateCategory = async ({ id, ...categoryData }) => {
  const response = await instance.patch(
    `journals/categories/${id}/`,
    categoryData
  );
  return response.data;
};

/**
 * Delete a category
 * @param {string} id - Category ID
 * @returns {Promise} API response
 */
export const deleteCategory = async (id) => {
  const response = await instance.delete(`journals/categories/${id}/`);
  return response.data;
};

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise} API response
 */
export const getCategoryById = async (id) => {
  const response = await instance.get(`journals/categories/${id}/`);
  return response.data;
};

/**
 * Get all research types for a category, section, or journal
 * @param {string} categoryId - Category ID (optional)
 * @param {string} journalId - Journal ID (optional)
 * @returns {Promise} API response
 */
export const getResearchTypes = async ({ categoryId, journalId }) => {
  let url = "journals/research-types/";
  const params = new URLSearchParams();
  if (categoryId) params.append("category", categoryId);
  if (journalId) params.append("journal", journalId);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await instance.get(url);
  return response.data;
};

/**
 * Create a new research type
 * @param {Object} researchTypeData - Research type data
 * @returns {Promise} API response
 */
export const createResearchType = async (researchTypeData) => {
  const response = await instance.post(
    "journals/research-types/",
    researchTypeData
  );
  return response.data;
};

/**
 * Update a research type
 * @param {string} id - Research type ID
 * @param {Object} researchTypeData - Research type data
 * @returns {Promise} API response
 */
export const updateResearchType = async ({ id, ...researchTypeData }) => {
  const response = await instance.patch(
    `journals/research-types/${id}/`,
    researchTypeData
  );
  return response.data;
};

/**
 * Delete a research type
 * @param {string} id - Research type ID
 * @returns {Promise} API response
 */
export const deleteResearchType = async (id) => {
  const response = await instance.delete(`journals/research-types/${id}/`);
  return response.data;
};

/**
 * Get research type by ID
 * @param {string} id - Research type ID
 * @returns {Promise} API response
 */
export const getResearchTypeById = async (id) => {
  const response = await instance.get(`journals/research-types/${id}/`);
  return response.data;
};

/**
 * Get all areas
 * @param {string} researchTypeId - Research type ID (optional)
 * @param {string} journalId - Journal ID (optional)
 * @returns {Promise} API response
 */
export const getAreas = async ({ researchTypeId, journalId }) => {
  let url = "journals/areas/";
  const params = new URLSearchParams();
  if (researchTypeId) params.append("research_type", researchTypeId);
  if (journalId) params.append("journal", journalId);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await instance.get(url);
  return response.data;
};

/**
 * Create a new area
 * @param {Object} areaData - Area data
 * @returns {Promise} API response
 */
export const createArea = async (areaData) => {
  const response = await instance.post("journals/areas/", areaData);
  return response.data;
};

/**
 * Update an area
 * @param {string} id - Area ID
 * @param {Object} areaData - Area data
 * @returns {Promise} API response
 */
export const updateArea = async ({ id, ...areaData }) => {
  const response = await instance.patch(`journals/areas/${id}/`, areaData);
  return response.data;
};

/**
 * Delete an area
 * @param {string} id - Area ID
 * @returns {Promise} API response
 */
export const deleteArea = async (id) => {
  const response = await instance.delete(`journals/areas/${id}/`);
  return response.data;
};

/**
 * Get area by ID
 * @param {string} id - Area ID
 * @returns {Promise} API response
 */
export const getAreaById = async (id) => {
  const response = await instance.get(`journals/areas/${id}/`);
  return response.data;
};

/**
 * Get complete taxonomy tree for a journal
 * @param {string} journalId - Journal ID
 * @returns {Promise} API response
 */
export const getTaxonomyTree = async (journalId) => {
  const response = await instance.get(
    `journals/areas/taxonomy-tree/?journal_id=${journalId}`
  );
  return response.data;
};

// ==================== STAFF APIs ====================

/**
 * Get all staff members for a journal
 * @param {string} journalId - Journal ID
 * @returns {Promise} API response
 */
export const getJournalStaff = async (journalId) => {
  const response = await instance.get(`journals/journals/${journalId}/staff/`);
  return response.data;
};

/**
 * Add staff member to journal
 * @param {string} journalId - Journal ID
 * @param {Object} staffData - Staff member data
 * @returns {Promise} API response
 */
export const addJournalStaff = async ({ journalId, ...staffData }) => {
  const response = await instance.post(
    `journals/journals/${journalId}/add_staff/`,
    staffData
  );
  return response.data;
};

/**
 * Update staff member
 * @param {string} journalId - Journal ID
 * @param {string} userId - User/Profile ID
 * @param {Object} staffData - Staff member data
 * @returns {Promise} API response
 */
export const updateJournalStaff = async ({
  journalId,
  userId,
  ...staffData
}) => {
  const response = await instance.patch(
    `journals/journals/${journalId}/staff/${userId}/update/`,
    staffData
  );
  return response.data;
};

/**
 * Remove staff member from journal
 * @param {string} journalId - Journal ID
 * @param {string} userId - User/Profile ID
 * @returns {Promise} API response
 */
export const removeJournalStaff = async ({ journalId, userId }) => {
  const response = await instance.delete(
    `journals/journals/${journalId}/staff/${userId}/`
  );
  return response.data;
};

// ==================== SUBMISSION SETTINGS APIs ====================

/**
 * Get submission settings for a journal
 * @param {string} journalId - Journal ID
 * @returns {Promise} API response
 */
export const getSubmissionSettings = async (journalId) => {
  const response = await instance.get(`journals/journals/${journalId}/`);
  return response.data.settings || {};
};

/**
 * Update submission settings for a journal
 * @param {string} journalId - Journal ID
 * @param {Object} settings - Submission settings
 * @returns {Promise} API response
 */
export const updateSubmissionSettings = async ({ journalId, settings }) => {
  const response = await instance.patch(`journals/journals/${journalId}/`, { settings });
  return response.data;
};

// ==================== JOURNAL SUBMISSIONS APIs ====================

/**
 * Get submissions for a specific journal
 * @param {string} journalId - Journal ID
 * @param {Object} params - Query parameters (status, etc.)
 * @returns {Promise} API response
 */
export const getJournalSubmissions = async (journalId, params = {}) => {
  const response = await instance.get("submissions/", {
    params: {
      journal: journalId,
      ...params,
    },
  });
  return response.data;
};

/**
 * Get journal statistics
 * @param {string} journalId - Journal ID
 * @returns {Promise} API response
 */
export const getJournalStatistics = async (journalId) => {
  const response = await instance.get(`journals/journals/${journalId}/statistics/`);
  return response.data;
};
