/**
 * Centralized card formatting utilities
 * Uses Card model for consistent structure across the app
 */
import Card from '../models/Card.js';

/**
 * Formats a single card with availability data from API response
 * @param {Object} cardWithAvailability - API response item with card and availability data
 * @returns {Card} - Card instance
 */
export const formatCardWithAvailability = (cardWithAvailability) => {
  return Card.fromApiResponse(cardWithAvailability);
};

/**
 * Formats multiple cards with availability data from API response
 * @param {Array} cardsWithAvailability - Array of API response items
 * @returns {Array<Card>} - Array of Card instances
 */
export const formatCardsWithAvailability = (cardsWithAvailability) => {
  return Card.fromApiResponseArray(cardsWithAvailability);
};

/**
 * Formats cards from paginated API response
 * Handles both paginated (with .content) and non-paginated responses
 * @param {Object|Array} apiResponse - API response
 * @param {Array} apiResponse.content - Paginated response content (optional)
 * @returns {Object|Array<Card>} - Formatted response
 */
export const formatPaginatedCardsResponse = (apiResponse) => {
  if (!apiResponse) {
    return [];
  }

  // If response has pagination structure (content property)
  if (apiResponse.content) {
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
  return Card.fromApiResponse(apiResponse);
};

/**
 * Formats a single card detail response (for card detail pages)
 * @param {Object} cardResponse - Single card API response
 * @returns {Card|null} - Card instance or null
 */
export const formatCardDetailResponse = (cardResponse) => {
  if (!cardResponse) {
    return null;
  }

  return Card.fromApiResponse(cardResponse);
};

/**
 * Formats trending cards response
 * @param {Array} trendingCards - Array of trending cards
 * @returns {Array<Card>} - Array of Card instances
 */
export const formatTrendingCardsResponse = (trendingCards) => {
  return Card.fromApiResponseArray(trendingCards);
};