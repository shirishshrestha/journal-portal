import { instance } from "@/lib/instance";

/**
 * Get OJS connection status and configuration
 * @param {string} journalId
 * @returns {Promise}
 */
export async function getOJSStatus(journalId) {
  const { data } = await instance.get(
    `/journals/journals/${journalId}/ojs-status/`
  );
  return data;
}

/**
 * Configure OJS connection
 * @param {string} journalId
 * @param {Object} connectionData - OJS connection configuration
 * @returns {Promise}
 */
export async function configureOJSConnection(journalId, connectionData) {
  const { data } = await instance.post(
    `/journals/journals/${journalId}/ojs-connection/`,
    connectionData
  );
  return data;
}

/**
 * Disconnect OJS
 * @param {string} journalId
 * @returns {Promise}
 */
export async function disconnectOJS(journalId) {
  const { data } = await instance.post(
    `/journals/journals/${journalId}/disconnect-ojs/`
  );
  return data;
}

/**
 * Import submissions from OJS
 * @param {string} journalId
 * @param {Function} onComplete - Callback function when import completes
 * @returns {Promise}
 */
export async function importFromOJS(journalId, onComplete) {
  try {
    const { data } = await instance.post(
      `/journals/journals/${journalId}/import-from-ojs/`,
      {},
      {
        timeout: 300000, // 5 minutes
      }
    );

    // Signal completion to trigger 100%
    onComplete?.();

    return data;
  } catch (error) {
    throw error;
  }
}
