// src/api/trends.ts
import { formatTrendingCardsResponse } from '../utils/cardFormatters.js';
import { TrendingCard } from './types.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// --- MOCKS ---
const bestSellers: TrendingCard[] = [
  { id: 1, card_name: "Edge of Eternities Play Bo...", image_url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80" },
  { id: 2, card_name: "The Wind Crystal", image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" },
  { id: 3, card_name: "The Fire Crystal", image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80" },
];

const bestBargains: TrendingCard[] = [
  { id: 1, card_name: "Firemane Commando", image_url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80" },
  { id: 2, card_name: "Filth", image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" },
  { id: 3, card_name: "Mind Grind", image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80" },
];

const mockGetBestSellers = async (): Promise<TrendingCard[]> => {
  await new Promise(res => setTimeout(res, 300));
  return bestSellers;
};
const mockGetBestBargains = async (): Promise<TrendingCard[]> => {
  await new Promise(res => setTimeout(res, 300));
  return bestBargains;
};

// --- REAL ---
const realGetBestSellers = async (): Promise<TrendingCard[]> => {
  const response = await fetch(`${API_BASE_URL}/trends/cards/random?amount=3`);
  if (!response.ok) throw new Error("Error fetching best sellers");
  const data = await response.json();
  return formatTrendingCardsResponse(data);
};
const realGetBestBargains = async (): Promise<TrendingCard[]> => {
  const response = await fetch(`${API_BASE_URL}/trends/cards-to-sell/random?amount=3`);
  if (!response.ok) throw new Error("Error fetching best bargains");
  const data = await response.json();
  return formatTrendingCardsResponse(data);
};

export const getBestSellers = realGetBestSellers;
export const getBestBargains = realGetBestBargains;
