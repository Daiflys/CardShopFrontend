const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockSetCardToSell = async (oracle_id, cardId, setName, cardName, imageUrl, price, condition, quantity, comments) => {
  await new Promise(res => setTimeout(res, 1000));
  return { success: true };
};

const realSetCardToSell = async (oracle_id, cardId, setName, cardName, imageUrl, price, condition, quantity, comments) => {
  const token = localStorage.getItem("authToken");
  console.log("oracle id: " + cardId);
  const response = await fetch(`${API_BASE_URL}/cardsToSell/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}`, },
    body: JSON.stringify({ card_id: cardId, oracle_id: oracle_id, set_name: setName, card_name: cardName, image_url: imageUrl, price: price, condition: condition, quantity: quantity, comments: comments }),
  });
  if (!response.ok) throw new Error("Error posting card to sell");
  return response.json();
};

export const setCardToSell = realSetCardToSell; 