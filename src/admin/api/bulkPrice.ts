// src/admin/api/bulkPrice.ts

import type { BulkPriceChangeParams, CardToSellDTO, PageResponse, ErrorResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Change prices in bulk for cards matching criteria (admin only)
 * @param params - Bulk price change parameters
 * @param params.language - Language code (e.g., "en", "es")
 * @param params.set - Set code (e.g., "MOM", "BRO")
 * @param params.newPrice - New price (must be > 0)
 * @param params.rarity - Rarity (e.g., "common", "rare", "mythic")
 * @param params.condition - Condition (MT, NM, EX, GD, LP, PL, PO)
 * @returns PageResponse with updated cards
 */
export const changePriceBulk = async ({
  language,
  set,
  newPrice,
  rarity,
  condition
}: BulkPriceChangeParams): Promise<PageResponse<CardToSellDTO>> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    // Validate newPrice
    if (!newPrice || newPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Build query parameters
    const params = new URLSearchParams({
      language,
      set,
      newPrice: newPrice.toString(),
      rarity,
      condition
    });

    const response = await fetch(`${API_BASE_URL}/cardsToSell/changePriceBulk?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to change prices with status ${response.status}`;

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
