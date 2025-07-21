// src/api/search.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

// --- MOCK DATA ---
const MOCK_CARDS = [
  { id: "dragon-wings", name: "Dragon Wings" },
  { id: "dragon-shadow", name: "Dragon Shadow" },
  { id: "eternal-dragon", name: "Eternal Dragon" },
  { id: "balefire-dragon", name: "Balefire Dragon" },
  { id: "covetous-dragon", name: "Covetous Dragon" },
  // ...añade más cartas mock
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

//export const searchCards = USE_MOCK ? mockSearchCards : realSearchCards;
export const searchCards = realSearchCards;