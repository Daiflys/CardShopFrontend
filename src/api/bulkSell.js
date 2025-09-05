const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockBulkSell = async (cardsData) => {
  await new Promise(res => setTimeout(res, 2000));
  return { success: true, message: `Successfully listed ${cardsData.length} cards for sale` };
};

const realBulkSell = async (cardsData) => {
  const token = localStorage.getItem("authToken");
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