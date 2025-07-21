// src/api/card.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

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

const mockGetCardDetail = async (cardId) => {
  await new Promise(res => setTimeout(res, 500));
  return mockCard;
};

// --- REAL ---
const realGetCardDetail = async (cardId) => {
  const response = await fetch(`https://tu-backend.com/api/cards/${cardId}`);
  if (!response.ok) throw new Error("Error al obtener detalle de carta");
  return response.json();
};

export const getCardDetail = USE_MOCK ? mockGetCardDetail : realGetCardDetail; 