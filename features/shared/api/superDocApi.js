import { instance } from "@/lib/instance";

/**
 * Save SuperDoc document with multiple format exports
 * @param {string} documentId - The document ID
 * @param {Object} payload - Document payload
 * @param {Blob} payload.blob - DOCX blob from SuperDoc export
 * @param {string} payload.fileName - File name for the document
 * @param {Object} payload.json - Document JSON content
 * @param {string} payload.html - Document HTML content
 * @returns {Promise} API response
 */
export const saveSuperdocDocument = async (documentId, payload) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.blob, payload.fileName);

    const response = await instance.post(
      `submissions/documents/${documentId}/save/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
