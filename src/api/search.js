// src/api/search.js
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
  if (!name) return [];
  const query = name.trim().toLowerCase();
  return MOCK_CARDS.filter(card =>
    card.name.toLowerCase().includes(query)
  );
};

// --- REAL ---
const realSearchCards = async (name, filters = {}) => {
  // Build query parameters
  const params = new URLSearchParams();
  
  console.log('Search filters received:', filters);
  
  if (name) {
    params.append('name', name);
  }
  
  if (filters.collection && filters.collection !== 'All Collections') {
    params.append('collection', filters.collection);
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
      params.append('languages', activeLanguages);
    }
  }
  
  const finalUrl = `${API_BASE_URL}/cards/search?${params.toString()}`;
  console.log('Final search URL:', finalUrl);
  
  const response = await fetch(finalUrl);
  if (!response.ok) throw new Error("Search error");
  return response.json();
};

const mockSearchCardsWithFilters = async (name, filters = {}) => {
  await new Promise(res => setTimeout(res, 300));
  if (!name && !filters.collection) return [];
  
  let results = [...MOCK_CARDS];
  
  // Filter by name
  if (name) {
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
const realSearchCardsBySet = async (setCode) => {
  const response = await fetch(`${API_BASE_URL}/cards/search/set?set=${setCode}`);
  if (!response.ok) throw new Error("Search by set error");
  return response.json();
};

export const searchCards = realSearchCards;
export const searchCardsBySet = realSearchCardsBySet;