/**
 * Strip HTML tags from a string and return plain text
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
export const stripHtmlTags = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * Get the plain text length of an HTML string
 * @param {string} html - HTML string to measure
 * @returns {number} Length of plain text
 */
export const getPlainTextLength = (html) => {
  return stripHtmlTags(html).length;
};
