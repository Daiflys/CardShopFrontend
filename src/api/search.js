// src/api/search.js
import { createPaginationParams, createPaginationParamsRaw } from '../utils/pagination.js';
import { formatPaginatedCardsResponse } from '../utils/cardFormatters.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

// --- MOCK DATA ---
const MOCK_CARDS = [
  { 
    id: "dragon-wings", 
    name: "Dragon Wings",
    image_url: "https://via.placeholder.com/120x160/4F46E5/FFFFFF?text=Dragon+Wings",
    price: 15.99,
    set: "Core Set"
  },
  { 
    id: "dragon-shadow", 
    name: "Dragon Shadow",
    image_url: "https://via.placeholder.com/120x160/7C3AED/FFFFFF?text=Dragon+Shadow",
    price: 12.25,
    set: "Expansion 2"
  },
  { 
    id: "eternal-dragon", 
    name: "Eternal Dragon",
    image_url: "https://via.placeholder.com/120x160/059669/FFFFFF?text=Eternal+Dragon",
    price: 22.75,
    set: "Core Set"
  },
  { 
    id: "balefire-dragon", 
    name: "Balefire Dragon",
    image_url: "https://via.placeholder.com/120x160/991B1B/FFFFFF?text=Balefire+Dragon",
    price: 35.00,
    set: "Expansion 2"
  },
  { 
    id: "covetous-dragon", 
    name: "Covetous Dragon",
    image_url: "https://via.placeholder.com/120x160/B91C1C/FFFFFF?text=Covetous+Dragon",
    price: 18.50,
    set: "Expansion 1"
  },
  { 
    id: "dragon-breath", 
    name: "Dragon Breath",
    image_url: "https://via.placeholder.com/120x160/EA580C/FFFFFF?text=Dragon+Breath",
    price: 6.99,
    set: "Core Set"
  },
  { 
    id: "dragon-fangs", 
    name: "Dragon Fangs",
    image_url: "https://via.placeholder.com/120x160/1E40AF/FFFFFF?text=Dragon+Fangs",
    price: 9.75,
    set: "Core Set"
  },
  { 
    id: "dragon-scales", 
    name: "Dragon Scales",
    image_url: "https://via.placeholder.com/120x160/047857/FFFFFF?text=Dragon+Scales",
    price: 14.25,
    set: "Core Set"
  },
];

const mockSearchCards = async (name) => {
  await new Promise(res => setTimeout(res, 300));
  if (!name || !name.trim()) return [];
  const query = name.trim().toLowerCase();
  return MOCK_CARDS.filter(card =>
    card.name.toLowerCase().includes(query)
  );
};

// --- REAL ---
const realSearchCards = async (name, filters = {}, page = 0, size = 21) => {
  // Build additional parameters for search
  const additionalParams = {};
  
  console.log('Search filters received:', filters);
  
  if (name && name.trim()) {
    additionalParams.name = name.trim();
  }
  
  if (filters.collection && filters.collection !== 'All Collections') {
    additionalParams.set = filters.collection;
  }
  
  // Handle language filters
  if (filters.languages && Object.keys(filters.languages).length > 0) {
    // Only include languages that are enabled (true)
    const activeLanguages = Object.entries(filters.languages)
      .filter(([, isEnabled]) => isEnabled === true)
      .map(([lang]) => lang)
      .join(',');
    
    console.log('Active languages:', activeLanguages);
    
    if (activeLanguages) {
      additionalParams.languages = activeLanguages;
    }
  }
  
  // Create pagination parameters with additional search params (page is already 0-based)
  const params = createPaginationParamsRaw(page, size, additionalParams);
  
  const finalUrl = `${API_BASE_URL}/cards/search?${params.toString()}`;
  console.log('Final search URL:', finalUrl);
  
  const response = await fetch(finalUrl);
  if (!response.ok) throw new Error("Search error");
  const data = await response.json();
  
  console.log('API response data:', data);

  return formatPaginatedCardsResponse(data);
};

const mockSearchCardsWithFilters = async (name, filters = {}) => {
  await new Promise(res => setTimeout(res, 300));
  if (!name?.trim() && !filters.collection) return [];
  
  let results = [...MOCK_CARDS];
  
  // Filter by name
  if (name && name.trim()) {
    const query = name.trim().toLowerCase();
    results = results.filter(card =>
      card.name.toLowerCase().includes(query)
    );
  }
  
  // Filter by collection
  if (filters.collection) {
    results = results.filter(card => card.set === filters.collection);
  }
  
  // Language filtering would be implemented here if we had language data in mock
  
  return results;
};

// --- SEARCH BY SET ---
const realSearchCardsBySet = async (setCode, page = 0, size = 21) => {
  const params = createPaginationParamsRaw(page, size, { set: setCode });
  
  const response = await fetch(`${API_BASE_URL}/cards/search/set?${params.toString()}`);
  if (!response.ok) throw new Error("Search by set error");
  const data = await response.json();

  return formatPaginatedCardsResponse(data);
};

// --- BULK SEARCH (for BulkSell - returns all cards with filters) ---
const realSearchCardsBulk = async (filters = {}, page = 0, size = 50) => {
  console.log('Bulk search filters:', filters);
  
  const additionalParams = {};
  
  if (filters.set) {
    additionalParams.set = filters.set;
  }
  
  if (filters.rarity && filters.rarity !== 'All') {
    additionalParams.rarity = filters.rarity;
  }
  
  if (filters.sortBy) {
    // Map UI sortBy values to server expected values
    const sortByMapping = {
      'Collectors Number': 'collector_number',
      'English Name': 'name',
      'Local Name': 'printed_name', 
      'Rarity, Number': 'rarity'
    };
    const serverSortBy = sortByMapping[filters.sortBy] || filters.sortBy;
    additionalParams.sortBy = serverSortBy;
  }
  
  // Create pagination parameters with bulk filters (page is already 0-based)
  const params = createPaginationParamsRaw(page, size, additionalParams);
  
  const finalUrl = `${API_BASE_URL}/cards/search/bulk?${params.toString()}`;
  console.log('Final bulk search URL:', finalUrl);
  
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(finalUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      let errorMessage = `Bulk search failed with status ${response.status}`;
      
      // Check if response has content and is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
          errorMessage = `Server error (${response.status}): Unable to parse error details`;
        }
      } else {
        // Response is not JSON, likely HTML error page or empty
        try {
          const textResponse = await response.text();
          if (textResponse.trim()) {
            errorMessage = `Server error (${response.status}): ${textResponse.substring(0, 100)}${textResponse.length > 100 ? '...' : ''}`;
          } else {
            errorMessage = `Server error (${response.status}): No response body`;
          }
        } catch (textError) {
          errorMessage = `Server error (${response.status}): Unable to read response`;
        }
      }
      
      // Add context about what failed
      const setName = filters.set ? ` for set "${filters.set}"` : '';
      const rarityFilter = filters.rarity && filters.rarity !== 'All' ? ` with rarity "${filters.rarity}"` : '';
      
      throw new Error(`${errorMessage}${setName}${rarityFilter}`);
    }
    
    // Check if successful response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response. Expected JSON data.');
    }
    
    try {
      const data = await response.json();
      
      return formatPaginatedCardsResponse(data);
    } catch (jsonError) {
      console.error('Failed to parse successful response as JSON:', jsonError);
      throw new Error('Server returned invalid JSON response. Please try again or contact support.');
    }
  } catch (error) {
    // Network or other fetch errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    
    // Re-throw our custom errors
    throw error;
  }
};

// --- ADVANCED SEARCH ---
const realAdvancedSearchCards = async (criteria = {}, page = 0, size = 20, sortBy = null, sortDirection = null) => {
  const additionalParams = {};

  // Add search criteria
  Object.keys(criteria).forEach(key => {
    const value = criteria[key];
    if (value !== undefined && value !== null && value !== '') {
      // Handle arrays (like languages, colors)
      if (Array.isArray(value) && value.length > 0) {
        additionalParams[key] = value.join(',');
      } else if (!Array.isArray(value)) {
        additionalParams[key] = value;
      }
    }
  });

  // Add sorting
  if (sortBy) {
    additionalParams.sortBy = sortBy;
  }
  if (sortDirection) {
    additionalParams.sortDirection = sortDirection;
  }

  const params = createPaginationParamsRaw(page, size, additionalParams);

  const finalUrl = `${API_BASE_URL}/cards/advanced-search?${params.toString()}`;
  console.log('Advanced search URL:', finalUrl);

  const response = await fetch(finalUrl);
  if (!response.ok) throw new Error("Advanced search failed");
  const data = await response.json();

  return formatPaginatedCardsResponse(data);
};

export const searchCards = realSearchCards;
export const searchCardsBySet = realSearchCardsBySet;
export const searchCardsBulk = realSearchCardsBulk;
export const advancedSearchCards = realAdvancedSearchCards;