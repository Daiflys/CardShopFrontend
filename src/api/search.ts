// src/api/search.ts
import { createPaginationParams, createPaginationParamsRaw } from '../utils/pagination.js';
import { formatPaginatedCardsResponse } from '../utils/cardFormatters.js';
import { Card, PageResponse, AdvancedSearchCriteria } from './types.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// --- BULK SEARCH (for BulkSell - returns all cards with filters) ---
interface BulkSearchFilters {
  set?: string;
  rarity?: string;
  sortBy?: string;
}

const realSearchCardsBulk = async (filters: BulkSearchFilters = {}, page: number = 0, size: number = 50): Promise<PageResponse<Card>> => {
  console.log('Bulk search filters:', filters);

  const additionalParams: Record<string, string> = {};

  if (filters.set) {
    additionalParams.set = filters.set;
  }

  if (filters.rarity && filters.rarity !== 'All') {
    additionalParams.rarity = filters.rarity;
  }

  if (filters.sortBy) {
    // Map UI sortBy values to server expected values
    const sortByMapping: Record<string, string> = {
      'Collectors Number': 'collectorNumber',
      'English Name': 'name',
      'Local Name': 'printedName',
      'Rarity, Number': 'rarity'
    };
    const serverSortBy = sortByMapping[filters.sortBy] || filters.sortBy;
    additionalParams.sortBy = serverSortBy;
  }

  // Create pagination parameters with bulk filters (page is already 0-based)
  const params = createPaginationParamsRaw(page, size, additionalParams);

  const finalUrl = `${API_BASE_URL}/cards/search/bulk?${params.toString()}`;
  console.log('Final bulk search URL:', finalUrl);

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(finalUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Bulk search failed with status ${response.status}`;

      // Check if response has content and is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
          errorMessage = `Server error (${response.status}): Unable to parse error details`;
        }
      } else {
        // Response is not JSON, likely HTML error page or empty
        try {
          const textResponse = await response.text();
          if (textResponse.trim()) {
            errorMessage = `Server error (${response.status}): ${textResponse.substring(0, 100)}${textResponse.length > 100 ? '...' : ''}`;
          } else {
            errorMessage = `Server error (${response.status}): No response body`;
          }
        } catch (textError) {
          errorMessage = `Server error (${response.status}): Unable to read response`;
        }
      }

      // Add context about what failed
      const setName = filters.set ? ` for set "${filters.set}"` : '';
      const rarityFilter = filters.rarity && filters.rarity !== 'All' ? ` with rarity "${filters.rarity}"` : '';

      throw new Error(`${errorMessage}${setName}${rarityFilter}`);
    }

    // Check if successful response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response. Expected JSON data.');
    }

    try {
      const data = await response.json();

      return formatPaginatedCardsResponse(data);
    } catch (jsonError) {
      console.error('Failed to parse successful response as JSON:', jsonError);
      throw new Error('Server returned invalid JSON response. Please try again or contact support.');
    }
  } catch (error) {
    // Network or other fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    // Re-throw our custom errors
    throw error;
  }
};

// --- ADVANCED SEARCH ---
const realAdvancedSearchCards = async (
  criteria: AdvancedSearchCriteria = {},
  page: number = 0,
  size: number = 20,
  sortBy: string | null = null,
  sortDirection: string | null = null
): Promise<PageResponse<Card>> => {
  const additionalParams: Record<string, string> = {};

  // Add search criteria
  Object.keys(criteria).forEach(key => {
    const value = criteria[key];
    if (value !== undefined && value !== null && value !== '') {
      // Handle arrays (like languages, colors)
      if (Array.isArray(value) && value.length > 0) {
        additionalParams[key] = value.join(',');
      } else if (!Array.isArray(value)) {
        additionalParams[key] = String(value);
      }
    }
  });

  // Add sorting
  if (sortBy) {
    additionalParams.sortBy = sortBy;
  }
  if (sortDirection) {
    additionalParams.sortDirection = sortDirection;
  }

  const params = createPaginationParamsRaw(page, size, additionalParams);

  const finalUrl = `${API_BASE_URL}/cards/advanced-search?${params.toString()}`;
  console.log('Advanced search URL:', finalUrl);

  const response = await fetch(finalUrl);
  if (!response.ok) throw new Error("Advanced search failed");
  const data = await response.json();

  return formatPaginatedCardsResponse(data);
};

export const searchCardsBulk = realSearchCardsBulk;
export const advancedSearchCards = realAdvancedSearchCards;
