import { instance } from "@/lib/instance";

// ==================== COPYEDITING APIs ====================

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
 * Assign a copyeditor to a submission
 * @param {string} submissionId - Submission ID
 * @param {string} userId - User ID of the copyeditor
 * @returns {Promise} API response
 */
export const assignCopyeditor = async (submissionId, userId) => {
  const response = await instance.post(
    `submissions/${submissionId}/copyediting/assign/`,
    { user_id: userId }
  );
  return response.data;
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

/**
 * Get all discussions for a submission's copyediting workflow
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response with discussion list
 */
export const getCopyeditingDiscussions = async (submissionId) => {
  const response = await instance.get(
    `submissions/${submissionId}/copyediting/discussions/`
  );
  return response.data;
};

/**
 * Get a single discussion thread with all messages
 * @param {string} discussionId - Discussion ID
 * @returns {Promise} API response with discussion and messages
 */
export const getDiscussionThread = async (discussionId) => {
  const response = await instance.get(
    `copyediting/discussions/${discussionId}/`
  );
  return response.data;
};

/**
 * Create a new discussion thread
 * @param {Object} data - Discussion data
 * @param {string} data.submissionId - Submission ID
 * @param {string} data.subject - Discussion subject
 * @param {string} data.message - Initial message (HTML)
 * @param {string[]} data.participants - Array of participant user IDs
 * @param {string} data.status - Discussion status (OPEN, RESOLVED, CLOSED)
 * @returns {Promise} API response
 */
export const createDiscussion = async (data) => {
  const response = await instance.post(
    `submissions/${data.submissionId}/copyediting/discussions/`,
    {
      subject: data.subject,
      message: data.message,
      participants: data.participants,
      status: data.status || "OPEN",
    }
  );
  return response.data;
};

/**
 * Add a reply to a discussion thread
 * @param {string} discussionId - Discussion ID
 * @param {string} message - Reply message (HTML)
 * @returns {Promise} API response
 */
export const addDiscussionReply = async (discussionId, message) => {
  const response = await instance.post(
    `copyediting/discussions/${discussionId}/replies/`,
    { message }
  );
  return response.data;
};

/**
 * Update discussion status (mark as resolved/closed)
 * @param {string} discussionId - Discussion ID
 * @param {string} status - New status (OPEN, RESOLVED, CLOSED)
 * @returns {Promise} API response
 */
export const updateDiscussionStatus = async (discussionId, status) => {
  const response = await instance.patch(
    `copyediting/discussions/${discussionId}/`,
    { status }
  );
  return response.data;
};
