import { instance } from "@/lib/instance";

/**
 * Load document for SuperDoc editor
 * @param {string} documentId - Document ID
 * @returns {Promise} API response with document data, file URL, and Yjs state
 */
export const loadDocument = async (documentId) => {
  const response = await instance.get(
    `submissions/documents/${documentId}/load/`
  );
  return response.data;
};

/**
 * Save Yjs state to backend
 * @param {string} documentId - Document ID
 * @param {string} yjsStateBase64 - Base64 encoded Yjs state
 * @returns {Promise} API response
 */
export const saveYjsState = async (documentId, yjsStateBase64) => {
  const response = await instance.post(
    `submissions/documents/${documentId}/save-state/`,
    {
      yjs_state: yjsStateBase64,
    }
  );
  return response.data;
};

/**
 * Export document as DOCX
 * @param {string} documentId - Document ID
 * @param {Blob} docxBlob - DOCX file blob
 * @returns {Promise} API response with download URL
 */
export const exportDocx = async (documentId, docxBlob) => {
  const formData = new FormData();
  formData.append("file", docxBlob, "document.docx");

  const response = await instance.post(
    `submissions/documents/${documentId}/export/`,
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
 * Download document as DOCX
 * @param {string} documentId - Document ID
 * @returns {Promise} File download
 */
export const downloadDocx = async (documentId) => {
  const response = await instance.get(
    `submissions/documents/${documentId}/download/`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};

/**
 * Submit updated document and notify reviewer
 * @param {string} documentId - Document ID
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response
 */
export const submitUpdatedDocument = async (documentId, submissionId) => {
  const response = await instance.post(
    `submissions/${submissionId}/submit-updated-document/`,
    {
      document_id: documentId,
    }
  );
  return response.data;
};

/**
 * Get review comments for a submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} API response with review comments
 */
export const getReviewComments = async (submissionId) => {
  const response = await instance.get(`reviews/?submission_id=${submissionId}`);
  return response.data;
};
