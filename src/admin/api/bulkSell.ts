// src/admin/api/bulkSell.ts
import Card from '../../models/Card.js';
import { BulkSellResponse, BulkSellCardData } from '../../api/types.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface CardSelectionData {
  selected: boolean;
  quantity: number;
  price: string | number;
  condition: string;
  comments?: string;
  language: string;
}

type CardSelectionEntry = [string, CardSelectionData];

interface CardWithReactKey {
  id?: string;
  reactKey?: string;
  [key: string]: any;
}

/**
 * Bulk sell cards from BulkSell page (processes Card instances)
 */
const realBulkSell = async (
  selectedCardEntries: CardSelectionEntry[],
  filteredCards: CardWithReactKey[]
): Promise<BulkSellResponse> => {
  const token = localStorage.getItem("authToken");

  // Map the selected cards data using Card class
  const cardsData = selectedCardEntries
    .filter(([cardKey, data]) => data.selected && data.quantity > 0)
    .map(([cardKey, data]) => {
      // Find card by id or reactKey (for copied cards)
      const card = filteredCards.find(c =>
        (c.reactKey && c.reactKey === cardKey) || c.id === cardKey
      );

      // Use Card instance to format bulk sell data
      const cardInstance = card instanceof Card ? card : new Card(card);
      return cardInstance.toBulkSellFormat({
        price: parseFloat(String(data.price)),
        condition: data.condition,
        quantity: parseInt(String(data.quantity)),
        comments: data.comments,
        language: data.language
      });
    });

  const response = await fetch(`${API_BASE_URL}/cardsToSell/auth/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ cards: cardsData }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error posting cards to sell");
  }

  return response.json();
};

/**
 * Bulk sell cards from CSV upload (receives pre-formatted array)
 * @param {Array} cards - Array of card objects already formatted for bulk sell
 * @param {string} language - Language code for the cards (unused, kept for backward compatibility)
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

export const bulkSellCards = realBulkSell;
