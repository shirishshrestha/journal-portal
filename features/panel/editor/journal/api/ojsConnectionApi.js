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
 * @returns {Promise}
 */
export async function importFromOJS(journalId, onProgress) {
  const { data } = await instance.post(
    `/journals/journals/${journalId}/import-from-ojs/`,
    {},
    {
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        } else {
          // If total is not available, simulate progress
          const loaded = progressEvent.loaded;
          const estimatedProgress = Math.min(
            Math.round((loaded / 1024 / 1024) * 10), // Rough estimate based on MB
            90 // Cap at 90% until complete
          );
          onProgress?.(estimatedProgress);
        }
      },
      // Optional: Set a timeout for long-running imports
      timeout: 300000, // 5 minutes
    }
  );
  // Set to 100% when complete
  onProgress?.(100);

  return data;
}
