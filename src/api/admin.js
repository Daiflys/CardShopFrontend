// src/api/admin.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * CSV card search using the new /cards/csv-search endpoint
 * @param {Array} cards - Array of card objects with setName, cardName, and collectorNumber
 * @param {string} language - Language code for the cards
 * @returns {Promise} Response with results array containing matched cards
 */
export const csvCardSearch = async (cards, language = 'en') => {
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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    // Re-throw custom errors
    throw error;
  }
};
