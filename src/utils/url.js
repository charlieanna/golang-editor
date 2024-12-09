// src/utils/url.js

/**
 * Extracts the 'articleContent' parameter from the current URL.
 * @returns {string} - The value of the 'articleContent' parameter or an empty string if not found.
 */
export const getArticleContentFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('articleContent') || '';
};
