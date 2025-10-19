// src/api/admin.ts
import { CSVCardInput, CSVSearchResponse, BulkSellCardData, BulkSellResponse } from './types.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * CSV card search using the new /cards/csv-search endpoint
 * @param {Array} cards - Array of card objects with setName, cardName, and collectorNumber
 * @param {string} language - Language code for the cards
 * @returns {Promise} Response with results array containing matched cards
 */
export const csvCardSearch = async (cards: CSVCardInput[], language: string = 'en'): Promise<CSVSearchResponse> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    // Prepare the request body with the new structure
    const requestBody = {
      cards: cards.map(card => ({
        setName: card.setName,
        cardName: card.cardName,
        collectorNumber: card.collectorNumber ? String(card.collectorNumber) : undefined,
        language: language
      }))
    };

    console.log('CSV card search request:', requestBody);

    const response = await fetch(`${API_BASE_URL}/admin/cards/csv-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorMessage = `CSV card search failed with status ${response.status}`;

      // Try to parse error response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('CSV card search response:', data);

    return data;

  } catch (error) {
    // Network or other fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    // Re-throw custom errors
    throw error;
  }
};

/**
 * Bulk sell cards from CSV upload
 * @param {Array} cards - Array of card objects formatted for bulk sell
 * @param {string} language - Language code for the cards
 * @returns {Promise} Response with success status and message
 */
export const bulkSellFromCSV = async (cards: BulkSellCardData[], language: string = 'en'): Promise<BulkSellResponse> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    console.log('Bulk sell from CSV request:', { cards, language });

    const response = await fetch(`${API_BASE_URL}/cardsToSell/auth/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cards })
    });

    if (!response.ok) {
      let errorMessage = `Bulk sell failed with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Bulk sell from CSV response:', data);

    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};
