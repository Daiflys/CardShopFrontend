// src/api/products.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// --- MOCKS ---
const mockProducts = [
  { name: "Dragon Wings", icon: "🐉" },
  { name: "Dragonspeaker Shaman", icon: "📷" },
  { name: "Eternal Dragon", icon: "🐉" },
  { name: "Dragon Shadow", icon: "🐉" },
  { name: "Dragon Breath", icon: "🐉" },
  { name: "Covetous Dragon", icon: "🐉" },
  { name: "Dragon Fangs", icon: "🐉" },
  { name: "Balefire Dragon", icon: "🐲" },
  { name: "Dragon Scales", icon: "🐉" },
  { name: "Dragonstorm", icon: "⏳" },
  { name: "Scion of the Ur-Dragon", icon: "⏳" },
  { name: "Dragon Arch", icon: "📷" },
  { name: "Worldgorger Dragon", icon: "📷" },
  { name: "Dragon Tyrant", icon: "🐉" },
  { name: "Dragonskull Summit", icon: "🅰️" },
];

const mockGetProducts = async () => {
  await new Promise(res => setTimeout(res, 500));
  return mockProducts;
};

// --- REAL ---
const realGetProducts = async () => {
  const response = await fetch("https://tu-backend.com/api/products");
  if (!response.ok) throw new Error("Error al obtener productos");
  return response.json();
};

export const getProducts = USE_MOCK ? mockGetProducts : realGetProducts; 