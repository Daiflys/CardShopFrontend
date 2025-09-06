const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockBulkSell = async (selectedCardEntries, filteredCards) => {
  // Filter selected cards for mock response
  const selectedCards = selectedCardEntries.filter(([cardId, data]) => data.selected && data.quantity > 0);
  await new Promise(res => setTimeout(res, 2000));
  return { success: true, message: `Successfully listed ${selectedCards.length} cards for sale` };
};

const realBulkSell = async (selectedCardEntries, filteredCards) => {
  const token = localStorage.getItem("authToken");
  
  // Map the selected cards data similar to BulkSell.jsx logic
  const cardsData = selectedCardEntries
    .filter(([cardId, data]) => data.selected && data.quantity > 0)
    .map(([cardId, data]) => {
      const card = filteredCards.find(c => c.id === cardId);
      return {
        card_id: cardId,
        oracle_id: card.oracle_id,
        set_name: card.set_name,
        set: card.set,
        card_name: card.name,
        image_url: card.image_url,
        price: parseFloat(data.price),
        condition: data.condition,
        quantity: parseInt(data.quantity),
        comments: data.comments,
        language: data.language
      };
    });

  const response = await fetch(`${API_BASE_URL}/cardsToSell/auth/bulk`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
    body: JSON.stringify({ cards: cardsData }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error posting cards to sell");
  }
  
  return response.json();
};

export const bulkSellCards = realBulkSell;