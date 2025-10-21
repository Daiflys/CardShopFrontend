// src/api/bulkSell.ts
import Card from '../models/Card.js';
import { BulkSellResponse } from './types.js';

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

export const bulkSellCards = realBulkSell;
