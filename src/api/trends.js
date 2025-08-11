// src/api/trends.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- MOCKS ---
const bestSellers = [
  { id: 1, name: "Edge of Eternities Play Bo...", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "The Wind Crystal", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "The Fire Crystal", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80" },
];

const bestBargains = [
  { id: 1, name: "Firemane Commando", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Filth", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Mind Grind", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80" },
];

const mockGetBestSellers = async () => {
  await new Promise(res => setTimeout(res, 300));
  return bestSellers;
};
const mockGetBestBargains = async () => {
  await new Promise(res => setTimeout(res, 300));
  return bestBargains;
};

// --- REAL ---
const realGetBestSellers = async () => {
  const response = await fetch(`${API_BASE_URL}/trends/best-sellers`);
  if (!response.ok) throw new Error("Error fetching best sellers");
  return response.json();
};
const realGetBestBargains = async () => {
  const response = await fetch(`${API_BASE_URL}/trends/best-bargains`);
  if (!response.ok) throw new Error("Error fetching best bargains");
  return response.json();
};

export const getBestSellers = USE_MOCK ? mockGetBestSellers : realGetBestSellers;
export const getBestBargains = USE_MOCK ? mockGetBestBargains : realGetBestBargains; 