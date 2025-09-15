// Pagination utilities to handle consistent pagination across the app

/**
 * Converts UI page (1-based) to server page (0-based)
 * @param {number} uiPage - Page number from UI (starts at 1)
 * @returns {number} - Server page number (starts at 0)
 */
export const uiPageToServerPage = (uiPage) => {
  return Math.max(0, (uiPage || 1) - 1);
};

/**
 * Converts server page (0-based) to UI page (1-based)
 * @param {number} serverPage - Page number from server (starts at 0)
 * @returns {number} - UI page number (starts at 1)
 */
export const serverPageToUIPage = (serverPage) => {
  return (serverPage || 0) + 1;
};

/**
 * Extracts data from paginated response, handling different response structures
 * @param {Object} response - API response
 * @returns {Array} - Extracted data array
 */
export const extractPaginatedData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  
  // Try different possible data properties
  return response?.content || 
         response?.data || 
         response?.transactions || 
         response?.results || 
         [];
};

/**
 * Normalizes pagination metadata from different API response structures
 * @param {Object} response - API response object
 * @param {number} fallbackPage - Fallback page if not found in response
 * @param {Array} data - Extracted data array for fallback calculations
 * @returns {Object} - Normalized pagination object
 */
export const normalizePaginationMetadata = (response, fallbackPage = 1, data = []) => {
  if (Array.isArray(response)) {
    // Non-paginated response
    return {
      currentPage: fallbackPage,
      totalPages: 1,
      totalItems: data.length,
      hasNext: false,
      hasPrev: false
    };
  }

  return {
    currentPage: serverPageToUIPage(response?.page) || 
                 response?.currentPage || 
                 fallbackPage,
    totalPages: response?.totalPages || 1,
    totalItems: response?.totalElements || 
                response?.totalItems || 
                response?.total || 
                data.length,
    hasNext: response?.hasNext || 
             response?.hasNextPage || 
             (!response?.last && response?.last !== undefined) || 
             false,
    hasPrev: response?.hasPrevious || 
             response?.hasPreviousPage || 
             response?.hasPrev || 
             (!response?.first && response?.first !== undefined) || 
             false
  };
};

/**
 * Processes a paginated API response and returns normalized data and pagination
 * @param {Object} response - Raw API response
 * @param {number} requestedUIPage - The UI page that was requested
 * @returns {Object} - Object with { data, pagination }
 */
export const processPaginatedResponse = (response, requestedUIPage = 1) => {
  const data = extractPaginatedData(response);
  const pagination = normalizePaginationMetadata(response, requestedUIPage, data);
  
  return {
    data,
    pagination
  };
};

/**
 * Creates URL search params with proper pagination parameters
 * @param {number} uiPage - UI page number (1-based)
 * @param {number} limit - Items per page
 * @param {Object} additionalParams - Additional parameters to include
 * @returns {URLSearchParams} - Ready to use URL search params
 */
export const createPaginationParams = (uiPage = 1, limit = 20, additionalParams = {}) => {
  const params = new URLSearchParams();
  
  // Convert UI page to server page
  const serverPage = uiPageToServerPage(uiPage);
  params.append('page', serverPage.toString());
  params.append('size', limit.toString());
  
  // Add any additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  return params;
};