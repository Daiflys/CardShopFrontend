const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- REAL ---
const realGetUserPurchases = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("authToken");
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  const response = await fetch(`${API_BASE_URL}/purchases/myorders?${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my orders");
  return response.json();
};

const realGetUserSells = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("authToken");
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  const response = await fetch(`${API_BASE_URL}/purchases/mysells?${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my sells");
  return response.json();
};

const realGetUserTransactions = async (page = 1, limit = 10) => {
  const [purchasesResponse, sellsResponse] = await Promise.all([
    realGetUserPurchases(page, limit),
    realGetUserSells(page, limit)
  ]);
  
  // Handle different response structures
  const purchases = Array.isArray(purchasesResponse) ? purchasesResponse : 
                   (purchasesResponse?.data || purchasesResponse?.transactions || []);
  const sells = Array.isArray(sellsResponse) ? sellsResponse : 
               (sellsResponse?.data || sellsResponse?.transactions || []);
  
  return {
    purchases,
    sells,
    pagination: {
      purchases: {
        currentPage: purchasesResponse?.currentPage || page,
        totalPages: purchasesResponse?.totalPages || 1,
        totalItems: purchasesResponse?.totalItems || purchases.length,
        hasNext: purchasesResponse?.hasNext || false,
        hasPrev: purchasesResponse?.hasPrev || false
      },
      sells: {
        currentPage: sellsResponse?.currentPage || page,
        totalPages: sellsResponse?.totalPages || 1,
        totalItems: sellsResponse?.totalItems || sells.length,
        hasNext: sellsResponse?.hasNext || false,
        hasPrev: sellsResponse?.hasPrev || false
      }
    }
  };
};

export const getUserTransactions = realGetUserTransactions; 