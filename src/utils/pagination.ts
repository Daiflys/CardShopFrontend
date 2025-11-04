// Pagination utilities to handle consistent pagination across the app

/**
 * Pagination metadata interface
 */
export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Converts UI page (1-based) to server page (0-based)
 * @param uiPage - Page number from UI (starts at 1)
 * @returns Server page number (starts at 0)
 */
export const uiPageToServerPage = (uiPage: number): number => {
  return Math.max(0, (uiPage || 1) - 1);
};

/**
 * Converts server page (0-based) to UI page (1-based)
 * @param serverPage - Page number from server (starts at 0)
 * @returns UI page number (starts at 1)
 */
export const serverPageToUIPage = (serverPage: number): number => {
  return (serverPage || 0) + 1;
};

/**
 * Extracts data from paginated response, handling different response structures
 * @param response - API response
 * @returns Extracted data array
 */
export const extractPaginatedData = <T>(response: any): T[] => {
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
 * @param response - API response object
 * @param fallbackPage - Fallback page if not found in response
 * @param data - Extracted data array for fallback calculations
 * @returns Normalized pagination object
 */
export const normalizePaginationMetadata = (
  response: any,
  fallbackPage: number = 1,
  data: any[] = []
): PaginationMetadata => {
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
 * @param response - Raw API response
 * @param requestedUIPage - The UI page that was requested
 * @returns Object with { data, pagination }
 */
export const processPaginatedResponse = <T>(
  response: any,
  requestedUIPage: number = 1
): PaginatedResponse<T> => {
  const data = extractPaginatedData<T>(response);
  const pagination = normalizePaginationMetadata(response, requestedUIPage, data);

  return {
    data,
    pagination
  };
};

/**
 * Creates URL search params with proper pagination parameters
 * @param uiPage - UI page number (1-based)
 * @param limit - Items per page
 * @param additionalParams - Additional parameters to include
 * @returns Ready to use URL search params
 */
export const createPaginationParams = (
  uiPage: number = 1,
  limit: number = 20,
  additionalParams: Record<string, any> = {}
): URLSearchParams => {
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

/**
 * Creates URL search params with pagination parameters (no conversion needed)
 * @param serverPage - Server page number (0-based, already converted)
 * @param limit - Items per page
 * @param additionalParams - Additional parameters to include
 * @returns Ready to use URL search params
 */
export const createPaginationParamsRaw = (
  serverPage: number = 0,
  limit: number = 20,
  additionalParams: Record<string, any> = {}
): URLSearchParams => {
  const params = new URLSearchParams();

  // Use page directly (no conversion)
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
