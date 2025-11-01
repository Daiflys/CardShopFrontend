/**
 * Search Utilities
 *
 * Centralized functions for building search URLs and handling search parameters.
 */

/**
 * Builds a search URL from search criteria object
 *
 * @param {Object} criteria - Search criteria object
 * @param {string} [criteria.name] - Card name
 * @param {string} [criteria.setCode] - Set code
 * @param {string} [criteria.rarity] - Rarity
 * @param {string[]} [criteria.colors] - Array of color codes
 * @param {string[]} [criteria.languages] - Array of language codes
 * @param {string} [criteria.cmcEquals] - CMC exact value
 * @param {string} [criteria.cmcMin] - CMC minimum value
 * @param {string} [criteria.cmcMax] - CMC maximum value
 * @param {string} [criteria.typeLine] - Type line text
 * @param {string} [criteria.artist] - Artist name
 * @param {string} [criteria.legalityFormat] - Legality format
 * @param {string} [criteria.legalityStatus] - Legality status
 * @returns {string} - Complete search URL with query params (e.g., "/search?name=bolt&colors=R")
 */
export const buildSearchUrl = (criteria) => {
  const params = new URLSearchParams();

  // Basic search fields
  if (criteria.name) params.set('name', criteria.name);
  if (criteria.setCode) params.set('setCode', criteria.setCode);
  if (criteria.rarity) params.set('rarity', criteria.rarity);

  // Colors (array)
  if (criteria.colors && criteria.colors.length > 0) {
    params.set('colors', criteria.colors.join(','));
  }

  // Languages (array)
  if (criteria.languages && criteria.languages.length > 0) {
    params.set('languages', criteria.languages.join(','));
  }

  // CMC (Converted Mana Cost)
  if (criteria.cmcEquals) params.set('cmcEquals', criteria.cmcEquals);
  if (criteria.cmcMin) params.set('cmcMin', criteria.cmcMin);
  if (criteria.cmcMax) params.set('cmcMax', criteria.cmcMax);

  // Type and Artist
  if (criteria.typeLine) params.set('typeLine', criteria.typeLine);
  if (criteria.artist) params.set('artist', criteria.artist);

  // Legality
  if (criteria.legalityFormat) params.set('legalityFormat', criteria.legalityFormat);
  if (criteria.legalityStatus) params.set('legalityStatus', criteria.legalityStatus);

  // Build final URL
  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : '/search';
};

/**
 * Converts SearchFilters format (from SearchFilters component) to criteria format
 *
 * @param {Object} filters - Filters object from SearchFilters component
 * @param {string} [filters.query] - Search query
 * @param {string} [filters.collection] - Collection/set code
 * @param {string[]} [filters.colors] - Array of color codes
 * @param {string} [filters.rarity] - Rarity
 * @param {Object} [filters.languages] - Languages object with boolean values
 * @returns {Object} - Criteria object compatible with buildSearchUrl
 */
export const convertFiltersToCriteria = (filters) => {
  const criteria = {};

  if (filters.query && filters.query.trim()) {
    criteria.name = filters.query.trim();
  }

  if (filters.collection && filters.collection !== 'All Collections') {
    criteria.setCode = filters.collection;
  }

  if (filters.colors && filters.colors.length > 0) {
    criteria.colors = filters.colors;
  }

  if (filters.rarity) {
    criteria.rarity = filters.rarity;
  }

  // Convert languages object to array
  if (filters.languages && Object.keys(filters.languages).length > 0) {
    const activeLanguages = Object.entries(filters.languages)
      .filter(([, isEnabled]) => isEnabled)
      .map(([lang]) => lang);
    if (activeLanguages.length > 0) {
      criteria.languages = activeLanguages;
    }
  }

  return criteria;
};
