// src/api/card.ts
import { createPaginationParams } from '../utils/pagination.js';
import { formatCardDetailResponse } from '../utils/cardFormatters.js';
import { Card, PageResponse } from './types.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const realGetCardDetail = async (cardId: string): Promise<Card> => {
  console.log("going to search for cardId", cardId);
  const response = await fetch(`${API_BASE_URL}/cards/id/${cardId}`);
  if (!response.ok) throw new Error("Error fetching card details");
  const responseRead = await response.json();
  console.log("response json: ", responseRead);

  return formatCardDetailResponse(responseRead);
};

const realGetCardsToSell = async (cardName: string, page: number = 1, size: number = 20): Promise<PageResponse<Card>> => {
  console.log("going to search for cards to sell with name", cardName);
  const params = createPaginationParams(page, size);

  const response = await fetch(`${API_BASE_URL}/cardsToSell/${encodeURIComponent(cardName)}?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching cards to sell");
  return response.json();
};

const realGetCardsToSellById = async (cardId: string, page: number = 1, size: number = 20): Promise<PageResponse<Card>> => {
  console.log("going to search for cards to sell with id", cardId);
  const params = createPaginationParams(page, size);

  const response = await fetch(`${API_BASE_URL}/cardsToSell/card/${encodeURIComponent(cardId)}?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching cards to sell");
  return response.json();
};

const realGetAllCards = async (page: number = 1, size: number = 20): Promise<PageResponse<Card>> => {
  console.log("fetching all cards with pagination", { page, size });
  const params = createPaginationParams(page, size);

  const response = await fetch(`${API_BASE_URL}/cards?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching all cards");
  return response.json();
};

const realGetCardsByOracleId = async (oracleId: string, page: number = 1, size: number = 50): Promise<PageResponse<Card>> => {
  console.log("going to search for cards with oracle ID", oracleId);
  const params = createPaginationParams(page, size, { sortBy: 'name' });

  const response = await fetch(`${API_BASE_URL}/cards/oracleId/${encodeURIComponent(oracleId)}?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching cards by oracle ID");
  const data = await response.json();
  console.log("Oracle ID response:", data);
  return data;
};

export const getCardDetail = realGetCardDetail;
export const getCardsToSell = realGetCardsToSell;
export const getCardsToSellById = realGetCardsToSellById;
export const getAllCards = realGetAllCards;
export const getCardsByOracleId = realGetCardsByOracleId;
