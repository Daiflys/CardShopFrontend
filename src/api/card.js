// src/api/card.js
import { createPaginationParams } from '../utils/pagination.js';
import { formatCardDetailResponse } from '../utils/cardFormatters.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- MOCK ---
const mockCard = {
  id: "dragon-wings",
  name: "Dragon Wings",
  set: "Scourge",
  rarity: "common",
  number: 34,
  printedIn: "Scourge",
  available: 2685,
  from: 0.02,
  priceTrend: 0.20,
  avg30: 0.20,
  avg7: 0.13,
  avg1: 0.27,
  image: "https://cards.scryfall.io/large/front/2/2/22b7e2e2-2e7e-4e2e-8e2e-2e7e2e2e2e2e.jpg?1682206500",
  rules: [
    "Enchanted creature has flying.",
    "Cycling {2}{U} ({2}{U}, Discard this card: Draw a card.)",
    "When a creature with converted mana cost 6 or more enters the battlefield, you may return Dragon Wings from your graveyard to play enchanting that creature."
  ],
  sellers: [
    { name: "NibiruCardsTCG", country: "FR", offer: 0.02, quantity: 1 },
    { name: "NibiruCardsTCG", country: "FR", offer: 0.02, quantity: 4 },
    { name: "NibiruCardsTCG", country: "FR", offer: 0.02, quantity: 1 },
    { name: "ledouble6", country: "FR", offer: 0.02, quantity: 1 },
  ],
};

const mockCardsToSell = [
  {
    id: "sell-1",
    oracleId: "12345",
    setName: "Scourge",
    name: "Dragon Wings",
    imageUrl: "https://cards.scryfall.io/large/front/2/2/22b7e2e2-2e7e-4e2e-8e2e-2e7e2e2e2e2e.jpg?1682206500",
    cardPrice: 0.02,
    userId: 1
  },
  {
    id: "sell-2",
    oracleId: "12345",
    setName: "Scourge",
    name: "Dragon Wings",
    imageUrl: "https://cards.scryfall.io/large/front/2/2/22b7e2e2-2e7e-4e2e-8e2e-2e7e2e2e2e2e.jpg?1682206500",
    cardPrice: 0.03,
    userId: 2
  }
];

const mockGetCardDetail = async (cardId) => {
  await new Promise(res => setTimeout(res, 500));
  return mockCard;
};

const mockGetCardsToSell = async (cardName) => {
  await new Promise(res => setTimeout(res, 300));
  return mockCardsToSell;
};

// --- REAL ---
const realGetCardDetail = async (cardId) => {
  console.log("going to search for cardId", cardId);
  const response = await fetch(`${API_BASE_URL}/cards/id/${cardId}`);
  if (!response.ok) throw new Error("Error fetching card details");
  const responseRead = await response.json();
  console.log("response json: ", responseRead);

  return formatCardDetailResponse(responseRead);
};

const realGetCardsToSell = async (cardName, page = 1, size = 20) => {
  console.log("going to search for cards to sell with name", cardName);
  const params = createPaginationParams(page, size);
  
  const response = await fetch(`${API_BASE_URL}/cardsToSell/${encodeURIComponent(cardName)}?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching cards to sell");
  return response.json();
};

const realGetCardsToSellById = async (cardId, page = 1, size = 20) => {
  console.log("going to search for cards to sell with id", cardId);
  const params = createPaginationParams(page, size);
  
  const response = await fetch(`${API_BASE_URL}/cardsToSell/card/${encodeURIComponent(cardId)}?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching cards to sell");
  return response.json();
};

const realGetAllCards = async (page = 1, size = 20) => {
  console.log("fetching all cards with pagination", { page, size });
  const params = createPaginationParams(page, size);

  const response = await fetch(`${API_BASE_URL}/cards?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching all cards");
  return response.json();
};

const realGetCardsByOracleId = async (oracleId, page = 1, size = 50) => {
  console.log("going to search for cards with oracle ID", oracleId);
  const params = createPaginationParams(page, size, { sortBy: 'name' });

  const response = await fetch(`${API_BASE_URL}/cards/oracleId/${encodeURIComponent(oracleId)}?${params.toString()}`);
  if (!response.ok) throw new Error("Error fetching cards by oracle ID");
  const data = await response.json();
  console.log("Oracle ID response:", data);
  return data;
};

//export const getCardDetail = USE_MOCK ? mockGetCardDetail : realGetCardDetail; 
export const getCardDetail = realGetCardDetail;
export const getCardsToSell = realGetCardsToSell;
export const getCardsToSellById = realGetCardsToSellById;
export const getAllCards = realGetAllCards;
export const getCardsByOracleId = realGetCardsByOracleId;