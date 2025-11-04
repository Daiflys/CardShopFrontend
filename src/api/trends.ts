// src/api/trends.ts
import { formatTrendingCardsResponse } from '../utils/cardFormatters.js';
import { TrendingCard } from './types.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
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
