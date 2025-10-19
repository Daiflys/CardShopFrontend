// src/admin/api/bulkPrice.ts

import type {
  SetPriceBulkParams,
  IncrementPriceBulkParams,
  AdjustPricePercentageBulkParams,
  CardToSellDTO,
  PageResponse,
  ErrorResponse
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Set fixed price for cards matching criteria (admin only)
 * @param params - Set price parameters
 * @returns PageResponse with updated cards
 */
export const setPriceBulk = async ({
  language,
  set,
  rarity,
  condition,
  price
}: SetPriceBulkParams): Promise<PageResponse<CardToSellDTO>> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    if (!price || price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const params = new URLSearchParams({
      language,
      set,
      rarity,
      condition,
      price: price.toString()
    });

    const response = await fetch(`${API_BASE_URL}/cardsToSell/setPriceBulk?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to set prices with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as PageResponse<CardToSellDTO>;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Increment prices by fixed amount for cards matching criteria (admin only)
 * @param params - Increment price parameters
 * @returns PageResponse with updated cards
 */
export const incrementPriceBulk = async ({
  language,
  set,
  rarity,
  condition,
  increment,
  quantityLessThan
}: IncrementPriceBulkParams): Promise<PageResponse<CardToSellDTO>> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    if (increment === undefined || increment === null) {
      throw new Error('Increment value is required');
    }

    const params = new URLSearchParams({
      language,
      set,
      rarity,
      condition,
      increment: increment.toString()
    });

    if (quantityLessThan !== undefined && quantityLessThan !== null) {
      params.append('quantityLessThan', quantityLessThan.toString());
    }

    const response = await fetch(`${API_BASE_URL}/cardsToSell/incrementPriceBulk?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to increment prices with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as PageResponse<CardToSellDTO>;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Adjust prices by percentage for cards matching criteria (admin only)
 * @param params - Adjust price percentage parameters
 * @returns PageResponse with updated cards
 */
export const adjustPricePercentageBulk = async ({
  language,
  set,
  rarity,
  condition,
  percentage
}: AdjustPricePercentageBulkParams): Promise<PageResponse<CardToSellDTO>> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    if (percentage === undefined || percentage === null) {
      throw new Error('Percentage value is required');
    }

    const params = new URLSearchParams({
      language,
      set,
      rarity,
      condition,
      percentage: percentage.toString()
    });

    const response = await fetch(`${API_BASE_URL}/cardsToSell/adjustPricePercentageBulk?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to adjust prices with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as PageResponse<CardToSellDTO>;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};
