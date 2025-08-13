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
const realSearchCards = async (name) => {
  const response = await fetch(`${API_BASE_URL}/cards/search?name=${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error("Error en la búsqueda");
  return response.json();
};

export const searchCards = realSearchCards;