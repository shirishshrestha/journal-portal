import { instance } from "@/lib/instance";

// ==================== PRODUCTION ASSIGNMENTS ====================

/**
 * List all production assignments
 * @param {Object} params - Query parameters
 * @param {string} params.submission - Filter by submission ID
 * @param {string} params.production_assistant - Filter by production assistant ID
 * @param {string} params.status - Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
 * @param {string} params.search - Search term
 * @param {string} params.ordering - Sort field
 * @returns {Promise} API response with production assignments list
 */
export const listProductionAssignments = async (params = {}) => {
  const response = await instance.get("submissions/production/assignments/", {
    params,
  });
  return response.data;
};

/**
 * Create a new production assignment
 * @param {Object} data - Assignment data
 * @param {string} data.submission - Submission ID
 * @param {string} data.production_assistant_id - Production assistant profile ID
 * @param {string} data.due_date - Due date (ISO format)
 * @param {string} data.instructions - Instructions for production assistant
 * @returns {Promise} API response with created assignment
 */
export const createProductionAssignment = async (data) => {
  const response = await instance.post(
    "submissions/production/assignments/",
    data
  );
  return response.data;
};

/**
 * Get a single production assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with assignment details
 */
export const getProductionAssignment = async (assignmentId) => {
  const response = await instance.get(
    `submissions/production/assignments/${assignmentId}/`
  );
  return response.data;
};

/**
 * Update a production assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Updated assignment data
 * @returns {Promise} API response with updated assignment
 */
export const updateProductionAssignment = async (assignmentId, data) => {
  const response = await instance.patch(
    `submissions/production/assignments/${assignmentId}/`,
    data
  );
  return response.data;
};

/**
 * Start production assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response
 */
export const startProductionAssignment = async (assignmentId) => {
  const response = await instance.post(
    `submissions/production/assignments/${assignmentId}/start/`
  );
  return response.data;
};

/**
 * Complete production assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Completion data
 * @param {string} data.completion_notes - Notes about completion
 * @returns {Promise} API response
 */
export const completeProductionAssignment = async (assignmentId, data) => {
  const response = await instance.post(
    `submissions/production/assignments/${assignmentId}/complete/`,
    data
  );
  return response.data;
};

/**
 * Get files for a production assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with files list
 */
export const getProductionAssignmentFiles = async (assignmentId) => {
  const response = await instance.get(
    `submissions/production/assignments/${assignmentId}/files/`
  );
  return response.data;
};

/**
 * Get discussions for a production assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with discussions list
 */
export const getProductionAssignmentDiscussions = async (assignmentId) => {
  const response = await instance.get(
    `submissions/production/assignments/${assignmentId}/discussions/`
  );
  return response.data;
};

/**
 * Get participants for a production assignment
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} API response with participants
 */
export const getProductionAssignmentParticipants = async (assignmentId) => {
  const response = await instance.get(
    `submissions/production/assignments/${assignmentId}/participants/`
  );
  return response.data;
};

// ==================== PRODUCTION FILES (GALLEYS) ====================

/**
 * List all production files
 * @param {Object} params - Query parameters
 * @param {string} params.assignment - Filter by assignment ID
 * @param {string} params.submission - Filter by submission ID
 * @param {string} params.file_type - Filter by file type (PRODUCTION_READY, GALLEY)
 * @param {string} params.galley_format - Filter by format (PDF, HTML, XML, EPUB, MOBI, OTHER)
 * @param {boolean} params.is_published - Filter by publication status
 * @param {boolean} params.is_approved - Filter by approval status
 * @param {string} params.search - Search term
 * @returns {Promise} API response with files list
 */
export const listProductionFiles = async (params = {}) => {
  const response = await instance.get("submissions/production/files/", {
    params,
  });
  return response.data;
};

/**
 * Upload a production file (galley)
 * @param {FormData} formData - Form data with file and metadata
 * @returns {Promise} API response with uploaded file
 */
export const uploadProductionFile = async (formData) => {
  const response = await instance.post(
    "submissions/production/files/",
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
 * Get a single production file
 * @param {string} fileId - File ID
 * @returns {Promise} API response with file details
 */
export const getProductionFile = async (fileId) => {
  const response = await instance.get(
    `submissions/production/files/${fileId}/`
  );
  return response.data;
};

/**
 * Update a production file
 * @param {string} fileId - File ID
 * @param {Object} data - Updated file data
 * @returns {Promise} API response with updated file
 */
export const updateProductionFile = async (fileId, data) => {
  const response = await instance.patch(
    `submissions/production/files/${fileId}/`,
    data
  );
  return response.data;
};

/**
 * Approve a production file
 * @param {string} fileId - File ID
 * @returns {Promise} API response
 */
export const approveProductionFile = async (fileId) => {
  const response = await instance.post(
    `submissions/production/files/${fileId}/approve/`
  );
  return response.data;
};

/**
 * Publish a galley file
 * @param {string} fileId - File ID
 * @returns {Promise} API response
 */
export const publishGalleyFile = async (fileId) => {
  const response = await instance.post(
    `submissions/production/files/${fileId}/publish/`
  );
  return response.data;
};

/**
 * Delete a production file
 * @param {string} fileId - File ID
 * @returns {Promise} API response
 */
export const deleteProductionFile = async (fileId) => {
  const response = await instance.delete(
    `submissions/production/files/${fileId}/`
  );
  return response.data;
};

// ==================== PRODUCTION DISCUSSIONS ====================

/**
 * List all production discussions
 * @param {Object} params - Query parameters
 * @param {string} params.assignment - Filter by assignment ID
 * @param {string} params.submission - Filter by submission ID
 * @param {string} params.status - Filter by status (OPEN, CLOSED)
 * @param {string} params.search - Search term
 * @returns {Promise} API response with discussions list
 */
export const listProductionDiscussions = async (params = {}) => {
  const response = await instance.get("submissions/production/discussions/", {
    params,
  });
  return response.data;
};

/**
 * Create a new production discussion
 * @param {Object} data - Discussion data
 * @param {string} data.assignment - Assignment ID
 * @param {string} data.submission - Submission ID
 * @param {string} data.subject - Discussion subject
 * @param {string[]} data.participant_ids - Array of participant profile IDs
 * @returns {Promise} API response with created discussion
 */
export const createProductionDiscussion = async (data) => {
  const response = await instance.post(
    "submissions/production/discussions/",
    data
  );
  return response.data;
};

/**
 * Get a single production discussion with messages
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response with discussion details and messages
 */
export const getProductionDiscussion = async (discussionId) => {
  const response = await instance.get(
    `submissions/production/discussions/${discussionId}/`
  );
  return response.data;
};

/**
 * Update a production discussion
 * @param {string} discussionId - Discussion ID
 * @param {Object} data - Updated discussion data
 * @returns {Promise} API response with updated discussion
 */
export const updateProductionDiscussion = async (discussionId, data) => {
  const response = await instance.patch(
    `submissions/production/discussions/${discussionId}/`,
    data
  );
  return response.data;
};

/**
 * Add a message to a production discussion
 * @param {string} discussionId - Discussion ID
 * @param {Object} data - Message data
 * @param {string} data.message - Message content (HTML)
 * @returns {Promise} API response with created message
 */
export const addProductionMessage = async (discussionId, data) => {
  const response = await instance.post(
    `submissions/production/discussions/${discussionId}/add_message/`,
    data
  );
  return response.data;
};

/**
 * Close a production discussion
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response
 */
export const closeProductionDiscussion = async (discussionId) => {
  const response = await instance.post(
    `submissions/production/discussions/${discussionId}/close/`
  );
  return response.data;
};

/**
 * Reopen a production discussion
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response
 */
export const reopenProductionDiscussion = async (discussionId) => {
  const response = await instance.post(
    `submissions/production/discussions/${discussionId}/reopen/`
  );
  return response.data;
};

/**
 * Delete a production discussion
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response
 */
export const deleteProductionDiscussion = async (discussionId) => {
  const response = await instance.delete(
    `submissions/production/discussions/${discussionId}/`
  );
  return response.data;
};

// ==================== PUBLICATION SCHEDULES ====================

/**
 * List all publication schedules
 * @param {Object} params - Query parameters
 * @param {string} params.submission - Filter by submission ID
 * @param {string} params.status - Filter by status (SCHEDULED, PUBLISHED, CANCELLED)
 * @param {number} params.year - Filter by year
 * @param {string} params.volume - Filter by volume
 * @param {string} params.issue - Filter by issue
 * @param {string} params.search - Search term
 * @param {string} params.ordering - Sort field
 * @returns {Promise} API response with schedules list
 */
export const listPublicationSchedules = async (params = {}) => {
  const response = await instance.get("submissions/production/schedules/", {
    params,
  });
  return response.data;
};

/**
 * Schedule a publication
 * @param {Object} data - Schedule data
 * @param {string} data.submission - Submission ID
 * @param {string} data.scheduled_date - Scheduled publication date (ISO format)
 * @param {string} data.volume - Volume number
 * @param {string} data.issue - Issue number
 * @param {number} data.year - Publication year
 * @param {string} data.doi - Digital Object Identifier
 * @param {string} data.pages - Page range (e.g., "45-67")
 * @returns {Promise} API response with created schedule
 */
export const schedulePublication = async (data) => {
  const response = await instance.post(
    "submissions/production/schedules/",
    data
  );
  return response.data;
};

/**
 * Get a single publication schedule
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise} API response with schedule details
 */
export const getPublicationSchedule = async (scheduleId) => {
  const response = await instance.get(
    `submissions/production/schedules/${scheduleId}/`
  );
  return response.data;
};

/**
 * Update a publication schedule
 * @param {string} scheduleId - Schedule ID
 * @param {Object} data - Updated schedule data
 * @returns {Promise} API response with updated schedule
 */
export const updatePublicationSchedule = async (scheduleId, data) => {
  const response = await instance.patch(
    `submissions/production/schedules/${scheduleId}/`,
    data
  );
  return response.data;
};

/**
 * Publish now (immediately publish a scheduled submission)
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise} API response
 */
export const publishNow = async (scheduleId) => {
  const response = await instance.post(
    `submissions/production/schedules/${scheduleId}/publish_now/`
  );
  return response.data;
};

/**
 * Cancel a publication schedule
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise} API response
 */
export const cancelPublication = async (scheduleId) => {
  const response = await instance.post(
    `submissions/production/schedules/${scheduleId}/cancel/`
  );
  return response.data;
};

/**
 * Delete a publication schedule
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise} API response
 */
export const deletePublicationSchedule = async (scheduleId) => {
  const response = await instance.delete(
    `submissions/production/schedules/${scheduleId}/`
  );
  return response.data;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get production participants for a submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response with production participants
 */
export const getProductionParticipants = async (submissionId) => {
  const response = await instance.get(
    `submissions/${submissionId}/production/participants/`
  );
  return response.data;
};

/**
 * Get production status for a submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response with production status
 */
export const getProductionStatus = async (submissionId) => {
  const response = await instance.get(
    `submissions/${submissionId}/production/status/`
  );
  return response.data;
};
