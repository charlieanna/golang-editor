// src/utils/url.js

/**
 * Extracts the 'site' and 'id' parameters from the current URL path.
 * Assumes the URL path follows the pattern: /questions/:site/:id
 * @returns {object} - An object containing 'site' and 'id', or empty strings if not found.
 */
export const getSiteAndIdFromURL = () => {
  const pathname = window.location.pathname;
  
  // Split the pathname into segments, removing any leading/trailing slashes
  const pathSegments = pathname.replace(/^\/+|\/+$/g, '').split('/');
  
  /**
   * Expected pathSegments for URL http://localhost:3001/questions/stackoverflow/18926303:
   * ['questions', 'stackoverflow', '18926303']
   */
  
  // Check if the path matches the expected pattern
  if (pathSegments.length >= 3 && pathSegments[0] === 'questions') {
    const site = pathSegments[1];
    const id = pathSegments[2];
    return { site, id };
  }
  
  // Return empty strings if the pattern doesn't match
  return { site: '', id: '' };
};
