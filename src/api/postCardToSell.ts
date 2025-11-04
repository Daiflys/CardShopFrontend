// src/api/postCardToSell.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface SetCardToSellResponse {
  success: boolean;
  [key: string]: any;
}

const realSetCardToSell = async (
  oracleId: string,
  cardId: string,
  setName: string,
  setCode: string,
  cardName: string,
  imageUrl: string,
  price: number,
  condition: string,
  quantity: number,
  comments: string,
  language: string
): Promise<SetCardToSellResponse> => {
  const token = localStorage.getItem("authToken");

  const requestBody = {
    cardId: cardId,
    oracleId: oracleId,
    setName: setName,
    setCode: setCode,
    cardName: cardName,
    imageUrl: imageUrl,
    price: price,
    condition: condition,
    quantity: quantity,
    comments: comments,
    language: language || 'en'
  };

  console.log("=== POST /cardsToSell/auth REQUEST ===");
  console.log("Request body:", JSON.stringify(requestBody, null, 2));

  const response = await fetch(`${API_BASE_URL}/cardsToSell/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) throw new Error("Error posting card to sell");
  return response.json();
};

export const setCardToSell = realSetCardToSell;
