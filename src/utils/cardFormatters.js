/**
 * Centralized card formatting utilities
 * Handles transformation of card data with availability information
 */

/**
 * Formats a single card with availability data from API response
 * @param {Object} cardWithAvailability - API response item with card and availability data
 * @param {Object} cardWithAvailability.card - The card object
 * @param {Array} cardWithAvailability.cardsToSell - Array of cards available for sale
 * @param {number} cardWithAvailability.available - Available count
 * @returns {Object} - Formatted card object
 */
export const formatCardWithAvailability = (cardWithAvailability) => {
  const card = cardWithAvailability.card || cardWithAvailability;
  const cardsToSell = cardWithAvailability.cardsToSell || [];
  const available = cardWithAvailability.available ?? (cardsToSell ? cardsToSell.length : 0);

  return {
    // Spread all card properties
    ...card,

    // Add availability information
    cardsToSell,
    available,

    // Map new Card entity fields (will be available from backend)
    flavorText: card.flavorText || card.flavor_text,
    manaCost: card.manaCost || card.mana_cost,
    oracleText: card.oracleText || card.oracle_text,
    typeLine: card.typeLine || card.type_line,
    cardColors: card.cardColors || card.colors,
    convertedManaCost: card.convertedManaCost || card.cmc,
    artistName: card.artistName || card.artist
  };
};

/**
 * Formats multiple cards with availability data from API response
 * @param {Array} cardsWithAvailability - Array of API response items
 * @returns {Array} - Array of formatted card objects
 */
export const formatCardsWithAvailability = (cardsWithAvailability) => {
  if (!Array.isArray(cardsWithAvailability)) {
    console.warn('formatCardsWithAvailability: Expected array, got:', typeof cardsWithAvailability);
    return [];
  }

  return cardsWithAvailability.map(formatCardWithAvailability);
};

/**
 * Formats cards from paginated API response
 * Handles both paginated (with .content) and non-paginated responses
 * @param {Object|Array} apiResponse - API response
 * @param {Array} apiResponse.content - Paginated response content (optional)
 * @returns {Object|Array} - Formatted response
 */
export const formatPaginatedCardsResponse = (apiResponse) => {
  if (!apiResponse) {
    return [];
  }

  // If response has pagination structure (content property)
  if (apiResponse.content) {
    return {
      ...apiResponse,
      content: formatCardsWithAvailability(apiResponse.content)
    };
  }

  // If response is a direct array
  if (Array.isArray(apiResponse)) {
    return formatCardsWithAvailability(apiResponse);
  }

  // If response is a single card
  return formatCardWithAvailability(apiResponse);
};

/**
 * Formats a single card detail response (for card detail pages)
 * @param {Object} cardResponse - Single card API response
 * @returns {Object} - Formatted card object
 */
export const formatCardDetailResponse = (cardResponse) => {
  if (!cardResponse) {
    return null;
  }

  return formatCardWithAvailability(cardResponse);
};

/**
 * Formats trending cards response
 * @param {Array} trendingCards - Array of trending cards
 * @returns {Array} - Formatted trending cards
 */
export const formatTrendingCardsResponse = (trendingCards) => {
  if (!Array.isArray(trendingCards)) {
    console.warn('formatTrendingCardsResponse: Expected array, got:', typeof trendingCards);
    return [];
  }

  return formatCardsWithAvailability(trendingCards);
};