// src/api/card.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- MOCK ---
const mockCard = {
  id: "dragon-wings",
  name: "Dragon Wings",
  set: "Scourge",
  rarity: "Common",
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
  const response = await fetch(`${API_BASE_URL}/cards/id/multi/${cardId}`);
  if (!response.ok) throw new Error("Error fetching card details");
  const responseRead = await response.json();
  console.log("response json: ", responseRead);
  return responseRead;
};

const realGetCardsToSell = async (cardName) => {
  console.log("going to search for cards to sell with name", cardName);
  const response = await fetch(`${API_BASE_URL}/cardsToSell/${encodeURIComponent(cardName)}`);
  if (!response.ok) throw new Error("Error fetching cards to sell");
  return response.json();
};

//export const getCardDetail = USE_MOCK ? mockGetCardDetail : realGetCardDetail; 
export const getCardDetail = realGetCardDetail;
export const getCardsToSell = realGetCardsToSell; 