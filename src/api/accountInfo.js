import { 
  createPaginationParams, 
  processPaginatedResponse 
} from '../utils/pagination.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- REAL ---
const realGetUserPurchases = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("authToken");
  const params = createPaginationParams(page, limit);
  const response = await fetch(`${API_BASE_URL}/purchases/myorders?${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my orders");
  const data = await response.json();
  console.log(`🛒 MYORDERS Request - UI Page: ${page}`);
  console.log("🛒 MYORDERS Response - Full content:", JSON.stringify(data, null, 2));
  console.log("🛒 MYORDERS Response - Type:", typeof data);
  console.log("🛒 MYORDERS Response - Keys:", Object.keys(data));
  return data;
};

const realGetUserSells = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("authToken");
  const params = createPaginationParams(page, limit);
  const response = await fetch(`${API_BASE_URL}/purchases/mysells?${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my sells");
  const data = await response.json();
  console.log(`💰 MYSELLS Request - UI Page: ${page}`);
  console.log("💰 MYSELLS Response - Full content:", JSON.stringify(data, null, 2));
  console.log("💰 MYSELLS Response - Type:", typeof data);
  console.log("💰 MYSELLS Response - Keys:", Object.keys(data));
  return data;
};

const realGetUserTransactions = async (page = 1, limit = 10) => {
  const [purchasesResponse, sellsResponse] = await Promise.all([
    realGetUserPurchases(page, limit),
    realGetUserSells(page, limit)
  ]);
  
  // Process both responses using centralized pagination utilities
  const purchasesData = processPaginatedResponse(purchasesResponse, page);
  const sellsData = processPaginatedResponse(sellsResponse, page);
  
  return {
    purchases: purchasesData.data,
    sells: sellsData.data,
    pagination: {
      purchases: purchasesData.pagination,
      sells: sellsData.pagination
    }
  };
};

export const getUserTransactions = realGetUserTransactions; 