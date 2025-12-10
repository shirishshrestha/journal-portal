import { instance } from "@/lib/instance";

// ==================== COPYEDITING ASSIGNMENTS ====================

/**
 * List all copyediting assignments
 * @param {Object} params - Query parameters
 * @param {string} params.submission - Filter by submission ID
 * @param {string} params.copyeditor - Filter by copyeditor ID
 * @param {string} params.status - Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
 * @param {string} params.search - Search term
 * @param {string} params.ordering - Sort field
 * @returns {Promise} API response with copyediting assignments list
 */
export const listCopyeditingAssignments = async (params = {}) => {
  const response = await instance.get("submissions/copyediting/assignments/", {
    params,
  });
  return response.data;
};

/**
 * Create a new copyediting assignment
 * @param {Object} data - Assignment data
 * @param {string} data.submission - Submission ID
 * @param {string} data.copyeditor_id - Copyeditor profile ID
 * @param {string} data.due_date - Due date (ISO format)
 * @param {string} data.instructions - Instructions for copyeditor
 * @returns {Promise} API response with created assignment
 */
export const createCopyeditingAssignment = async (data) => {
  const response = await instance.post(
    "submissions/copyediting/assignments/",
    data
  );
  return response.data;
};

/**
 * Get a single copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with assignment details
 */
export const getCopyeditingAssignment = async (assignmentId) => {
  const response = await instance.get(
    `submissions/copyediting/assignments/${assignmentId}/`
  );
  return response.data;
};

/**
 * Update a copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Updated assignment data
 * @returns {Promise} API response with updated assignment
 */
export const updateCopyeditingAssignment = async (assignmentId, data) => {
  const response = await instance.patch(
    `submissions/copyediting/assignments/${assignmentId}/`,
    data
  );
  return response.data;
};

/**
 * Start copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response
 */
export const startCopyeditingAssignment = async (assignmentId) => {
  const response = await instance.post(
    `submissions/copyediting/assignments/${assignmentId}/start/`
  );
  return response.data;
};

/**
 * Complete copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Completion data
 * @param {string} data.completion_notes - Notes about completion
 * @returns {Promise} API response
 */
export const completeCopyeditingAssignment = async (assignmentId, data) => {
  const response = await instance.post(
    `submissions/copyediting/assignments/${assignmentId}/complete/`,
    data
  );
  return response.data;
};

/**
 * Get files for a copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with files list
 */
export const getCopyeditingAssignmentFiles = async (assignmentId) => {
  const response = await instance.get(
    `submissions/copyediting/assignments/${assignmentId}/files/`
  );
  return response.data;
};

/**
 * Get discussions for a copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with discussions list
 */
export const getCopyeditingAssignmentDiscussions = async (assignmentId) => {
  const response = await instance.get(
    `submissions/copyediting/assignments/${assignmentId}/discussions/`
  );
  return response.data;
};

/**
 * Get participants for a copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with participants
 */
export const getCopyeditingAssignmentParticipants = async (assignmentId) => {
  const response = await instance.get(
    `submissions/copyediting/assignments/${assignmentId}/participants/`
  );
  return response.data;
};

/**
 * Add a participant to a copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Participant data
 * @param {string} data.profile_id - Profile UUID of the user to add
 * @returns {Promise} API response
 */
export const addCopyeditingParticipant = async (assignmentId, data) => {
  const response = await instance.post(
    `submissions/copyediting/assignments/${assignmentId}/add_participant/`,
    data
  );
  return response.data;
};

/**
 * Remove a participant from a copyediting assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Participant data
 * @param {string} data.profile_id - Profile UUID of the user to remove
 * @returns {Promise} API response
 */
export const removeCopyeditingParticipant = async (assignmentId, data) => {
  const response = await instance.post(
    `submissions/copyediting/assignments/${assignmentId}/remove_participant/`,
    data
  );
  return response.data;
};

// ==================== COPYEDITING FILES ====================

/**
 * List all copyediting files
 * @param {Object} params - Query parameters
 * @param {string} params.assignment - Filter by assignment ID
 * @param {string} params.submission - Filter by submission ID
 * @param {string} params.file_type - Filter by file type (DRAFT, COPYEDITED, FINAL)
 * @param {boolean} params.is_approved - Filter by approval status
 * @param {string} params.search - Search term
 * @returns {Promise} API response with files list
 */
export const listCopyeditingFiles = async (assignmentId) => {
  const response = await instance.get(
    `submissions/copyediting/assignments/${assignmentId}/files/`
  );
  return response.data;
};

/**
 * Upload a copyediting file
 * @param {FormData} formData - Form data with file and metadata
 * @returns {Promise} API response with uploaded file
 */
export const uploadCopyeditingFile = async (formData) => {
  const response = await instance.post(
    "submissions/copyediting/files/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Get a single copyediting file
 * @param {string} fileId - File ID
 * @returns {Promise} API response with file details
 */
export const getCopyeditingFile = async (fileId) => {
  const response = await instance.get(
    `submissions/copyediting/files/${fileId}/`
  );
  return response.data;
};

/**
 * Update a copyediting file
 * @param {string} fileId - File ID
 * @param {Object} data - Updated file data
 * @returns {Promise} API response with updated file
 */
export const updateCopyeditingFile = async (fileId, data) => {
  const response = await instance.patch(
    `submissions/copyediting/files/${fileId}/`,
    data
  );
  return response.data;
};

/**
 * Approve a copyediting file
 * @param {string} fileId - File ID
 * @returns {Promise} API response
 */
export const approveCopyeditingFile = async (fileId) => {
  const response = await instance.post(
    `submissions/copyediting/files/${fileId}/approve/`
  );
  return response.data;
};

/**
 * Delete a copyediting file
 * @param {string} fileId - File ID
 * @returns {Promise} API response
 */
export const deleteCopyeditingFile = async (fileId) => {
  const response = await instance.delete(
    `submissions/copyediting/files/${fileId}/`
  );
  return response.data;
};

/**
 * Load a copyediting file for editing (SuperDoc editor)
 * @param {string} fileId - File ID
 * @returns {Promise} API response with file metadata and download URL
 */
export const loadCopyeditingFile = async (fileId) => {
  const response = await instance.get(
    `submissions/copyediting/files/${fileId}/load/`
  );
  return response.data;
};

/**
 * Save a copyediting file (manual save - replaces existing file)
 * @param {string} fileId - File ID
 * @param {FormData} formData - Form data with file
 * @returns {Promise} API response
 */
export const saveCopyeditingFile = async (fileId, formData) => {
  const response = await instance.post(
    `submissions/copyediting/files/${fileId}/save/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Download a copyediting file
 * @param {string} fileId - File ID
 * @returns {Promise} API response with file blob
 */
export const downloadCopyeditingFile = async (fileId) => {
  const response = await instance.get(
    `submissions/copyediting/files/${fileId}/download/`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};

// ==================== COPYEDITING DISCUSSIONS ====================

/**
 * List all copyediting discussions
 * @param {Object} params - Query parameters
 * @param {string} params.assignment - Filter by assignment ID
 * @param {string} params.submission - Filter by submission ID
 * @param {string} params.status - Filter by status (OPEN, CLOSED)
 * @param {string} params.search - Search term
 * @returns {Promise} API response with discussions list
 */
export const listCopyeditingDiscussions = async (id) => {
  const response = await instance.get(
    `submissions/copyediting/assignments/${id}/discussions`
  );
  return response.data;
};

/**
 * Create a new copyediting discussion
 * @param {Object} data - Discussion data
 * @param {string} data.assignment - Assignment ID
 * @param {string} data.submission - Submission ID
 * @param {string} data.subject - Discussion subject
 * @param {string[]} data.participant_ids - Array of participant profile IDs
 * @returns {Promise} API response with created discussion
 */
export const createCopyeditingDiscussion = async (data) => {
  const response = await instance.post(
    "submissions/copyediting/discussions/",
    data
  );
  return response.data;
};

/**
 * Get a single copyediting discussion with messages
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response with discussion details and messages
 */
export const getCopyeditingDiscussion = async (discussionId) => {
  const response = await instance.get(
    `submissions/copyediting/discussions/${discussionId}`
  );
  return response.data;
};

/**
 * Update a copyediting discussion
 * @param {string} discussionId - Discussion ID
 * @param {Object} data - Updated discussion data
 * @returns {Promise} API response with updated discussion
 */
export const updateCopyeditingDiscussion = async (discussionId, data) => {
  const response = await instance.patch(
    `submissions/copyediting/discussions/${discussionId}/`,
    data
  );
  return response.data;
};

/**
 * Add a message to a copyediting discussion
 * @param {string} discussionId - Discussion ID
 * @param {Object} data - Message data
 * @param {string} data.message - Message content (HTML)
 * @returns {Promise} API response with created message
 */
export const addCopyeditingMessage = async (discussionId, data) => {
  const response = await instance.post(
    `submissions/copyediting/discussions/${discussionId}/add_message/`,
    data
  );
  return response.data;
};

/**
 * Close a copyediting discussion
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response
 */
export const closeCopyeditingDiscussion = async (discussionId) => {
  const response = await instance.post(
    `submissions/copyediting/discussions/${discussionId}/close/`
  );
  return response.data;
};

/**
 * Reopen a copyediting discussion
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response
 */
export const reopenCopyeditingDiscussion = async (discussionId) => {
  const response = await instance.post(
    `submissions/copyediting/discussions/${discussionId}/reopen/`
  );
  return response.data;
};

/**
 * Delete a copyediting discussion
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response
 */
export const deleteCopyeditingDiscussion = async (discussionId) => {
  const response = await instance.delete(
    `submissions/copyediting/discussions/${discussionId}/`
  );
  return response.data;
};

// ==================== HELPER FUNCTIONS (Legacy Support) ====================

/**
 * Get copyediting participants for a submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response with copyeditors, editors, and authors
 */
export const getCopyeditingParticipants = async (submissionId) => {
  const response = await instance.get(
    `submissions/${submissionId}/copyediting/participants/`
  );
  return response.data;
};

/**
 * Assign a copyeditor to a submission (creates assignment)
 * @param {string} submissionId - Submission ID
 * @param {string} copyeditorId - Copyeditor profile ID
 * @param {Object} options - Additional options
 * @returns {Promise} API response
 */
export const assignCopyeditor = async (
  submissionId,
  copyeditorId,
  options = {}
) => {
  return createCopyeditingAssignment({
    submission: submissionId,
    copyeditor_id: copyeditorId,
    ...options,
  });
};

/**
 * Remove a copyeditor from a submission
 * @param {string} submissionId - Submission ID
 * @param {string} userId - User ID of the copyeditor
 * @returns {Promise} API response
 */
export const removeCopyeditor = async (submissionId, userId) => {
  const response = await instance.delete(
    `submissions/${submissionId}/copyediting/participants/${userId}/`
  );
  return response.data;
};

// Legacy aliases for backward compatibility
export const getCopyeditingDiscussions = (submissionId) =>
  listCopyeditingDiscussions({ submission: submissionId });

export const getDiscussionThread = getCopyeditingDiscussion;

export const createDiscussion = (data) =>
  createCopyeditingDiscussion({
    ...data,
    submission: data.submissionId,
    participant_ids: data.participants,
  });

export const addDiscussionReply = (discussionId, message) =>
  addCopyeditingMessage(discussionId, { message });

export const updateDiscussionStatus = updateCopyeditingDiscussion;
