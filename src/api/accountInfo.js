const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- REAL ---
const realGetUserTransactions = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/purchases/myorders`, {
    method: "GET",
    headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}`, }
  });
  if (!response.ok) throw new Error("Error getting my orders");
  return response.json();
};

export const getUserTransactions = realGetUserTransactions; 