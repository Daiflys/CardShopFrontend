const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- REAL ---
const realGetUserPurchases = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/purchases/myorders`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my orders");
  return response.json();
};

const realGetUserSells = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/purchases/mysells`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my sells");
  return response.json();
};

const realGetUserTransactions = async () => {
  const [purchases, sells] = await Promise.all([
    realGetUserPurchases(),
    realGetUserSells()
  ]);
  
  return {
    purchases: purchases || [],
    sells: sells || []
  };
};

export const getUserTransactions = realGetUserTransactions; 