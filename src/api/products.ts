// src/api/products.ts
import { Product } from './types.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// --- MOCKS ---
const mockProducts: Product[] = [
  {
    id: "dragon-wings",
    name: "Dragon Wings",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/4F46E5/FFFFFF?text=Dragon+Wings",
    price: 15.99,
    set: "Core Set"
  },
  {
    id: "dragonspeaker-shaman",
    name: "Dragonspeaker Shaman",
    icon: "📷",
    image_url: "https://via.placeholder.com/120x160/DC2626/FFFFFF?text=Dragonspeaker",
    price: 8.50,
    set: "Expansion 1"
  },
  {
    id: "eternal-dragon",
    name: "Eternal Dragon",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/059669/FFFFFF?text=Eternal+Dragon",
    price: 22.75,
    set: "Core Set"
  },
  {
    id: "dragon-shadow",
    name: "Dragon Shadow",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/7C3AED/FFFFFF?text=Dragon+Shadow",
    price: 12.25,
    set: "Expansion 2"
  },
  {
    id: "dragon-breath",
    name: "Dragon Breath",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/EA580C/FFFFFF?text=Dragon+Breath",
    price: 6.99,
    set: "Core Set"
  },
  {
    id: "covetous-dragon",
    name: "Covetous Dragon",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/B91C1C/FFFFFF?text=Covetous+Dragon",
    price: 18.50,
    set: "Expansion 1"
  },
  {
    id: "dragon-fangs",
    name: "Dragon Fangs",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/1E40AF/FFFFFF?text=Dragon+Fangs",
    price: 9.75,
    set: "Core Set"
  },
  {
    id: "balefire-dragon",
    name: "Balefire Dragon",
    icon: "🐲",
    image_url: "https://via.placeholder.com/120x160/991B1B/FFFFFF?text=Balefire+Dragon",
    price: 35.00,
    set: "Expansion 2"
  },
  {
    id: "dragon-scales",
    name: "Dragon Scales",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/047857/FFFFFF?text=Dragon+Scales",
    price: 14.25,
    set: "Core Set"
  },
  {
    id: "dragonstorm",
    name: "Dragonstorm",
    icon: "⏳",
    image_url: "https://via.placeholder.com/120x160/6B21A8/FFFFFF?text=Dragonstorm",
    price: 28.99,
    set: "Expansion 1"
  },
  {
    id: "scion-of-the-ur-dragon",
    name: "Scion of the Ur-Dragon",
    icon: "⏳",
    image_url: "https://via.placeholder.com/120x160/92400E/FFFFFF?text=Scion+Ur-Dragon",
    price: 45.50,
    set: "Expansion 2"
  },
  {
    id: "dragon-arch",
    name: "Dragon Arch",
    icon: "📷",
    image_url: "https://via.placeholder.com/120x160/1E3A8A/FFFFFF?text=Dragon+Arch",
    price: 11.25,
    set: "Core Set"
  },
  {
    id: "worldgorger-dragon",
    name: "Worldgorger Dragon",
    icon: "📷",
    image_url: "https://via.placeholder.com/120x160/7F1D1D/FFFFFF?text=Worldgorger",
    price: 32.75,
    set: "Expansion 1"
  },
  {
    id: "dragon-tyrant",
    name: "Dragon Tyrant",
    icon: "🐉",
    image_url: "https://via.placeholder.com/120x160/065F46/FFFFFF?text=Dragon+Tyrant",
    price: 19.99,
    set: "Core Set"
  },
  {
    id: "dragonskull-summit",
    name: "Dragonskull Summit",
    icon: "🅰️",
    image_url: "https://via.placeholder.com/120x160/374151/FFFFFF?text=Dragonskull+Summit",
    price: 7.50,
    set: "Expansion 2"
  },
];

const mockGetProducts = async (): Promise<Product[]> => {
  await new Promise(res => setTimeout(res, 500));
  return mockProducts;
};

// --- REAL ---
const realGetProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error("Error fetching products");
  return response.json();
};

export const getProducts = USE_MOCK ? mockGetProducts : realGetProducts;
