/**
 * Centralized card formatting utilities
 * Uses Card model for consistent structure across the app
 */
import Card, { CardData } from '../models/Card.ts';

/**
 * Formats a single card with availability data from API response
 * @param cardWithAvailability - API response item with card and availability data
 * @returns Card instance
 */
export const formatCardWithAvailability = (cardWithAvailability: CardData): Card => {
  return Card.fromApiResponse(cardWithAvailability);
};

/**
 * Formats multiple cards with availability data from API response
 * @param cardsWithAvailability - Array of API response items
 * @returns Array of Card instances
 */
export const formatCardsWithAvailability = (cardsWithAvailability: CardData[]): Card[] => {
  return Card.fromApiResponseArray(cardsWithAvailability);
};

interface PaginatedResponse<T> {
  content?: T[];
  [key: string]: any;
}

/**
 * Formats cards from paginated API response
 * Handles both paginated (with .content) and non-paginated responses
 * @param apiResponse - API response
 * @returns Formatted response
 */
export const formatPaginatedCardsResponse = (
  apiResponse: PaginatedResponse<CardData> | CardData[] | CardData | null
): PaginatedResponse<Card> | Card[] | Card | null => {
  if (!apiResponse) {
    return [];
  }

  // If response has pagination structure (content property)
  if (typeof apiResponse === 'object' && 'content' in apiResponse && apiResponse.content) {
    return {
      ...apiResponse,
      content: Card.fromApiResponseArray(apiResponse.content)
    };
  }

  // If response is a direct array
  if (Array.isArray(apiResponse)) {
    return Card.fromApiResponseArray(apiResponse);
  }

  // If response is a single card
  return Card.fromApiResponse(apiResponse as CardData);
};

/**
 * Formats a single card detail response (for card detail pages)
 * @param cardResponse - Single card API response
 * @returns Card instance or null
 */
export const formatCardDetailResponse = (cardResponse: CardData | null): Card | null => {
  if (!cardResponse) {
    return null;
  }

  return Card.fromApiResponse(cardResponse);
};

/**
 * Formats trending cards response
 * @param trendingCards - Array of trending cards
 * @returns Array of Card instances
 */
export const formatTrendingCardsResponse = (trendingCards: CardData[]): Card[] => {
  return Card.fromApiResponseArray(trendingCards);
};
