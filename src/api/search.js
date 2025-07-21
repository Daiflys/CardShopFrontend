// src/api/search.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// --- MOCK ---
const DUMMY_CARDS = [
  { id: 1, name: "Dragon1" },
  { id: 2, name: "Dragon2" },
  { id: 3, name: "Dragon3" },
];

const mockSearchCards = async (query) => {
  await new Promise(res => setTimeout(res, 300));
  if (!query) return [];
  return DUMMY_CARDS.filter(card =>
    card.name.toLowerCase().includes(query.trim().toLowerCase())
  );
};

// --- REAL ---
const realSearchCards = async (query) => {
  const response = await fetch(`${API_BASE_URL}/cards/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Error en la búsqueda");
  return response.json();
};

export const searchCards = USE_MOCK ? mockSearchCards : realSearchCards; 