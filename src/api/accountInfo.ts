// src/api/accountInfo.ts
import {
  createPaginationParams,
  processPaginatedResponse
} from '../utils/pagination.js';
import type { PageResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface Purchase {
  id: number;
  cardName: string;
  setName: string;
  condition: string;
  quantity: number;
  price: number;
  totalPrice: number;
  purchaseDate: string;
  sellerId: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentProvider?: string;
  transactionId?: string;
  cardId?: number;
  buyerId?: number;
}

export interface Sell {
  id: number;
  cardName: string;
  setName: string;
  condition: string;
  quantity: number;
  price: number;
  totalPrice: number;
  saleDate: string;
  buyerId: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentProvider?: string;
  transactionId?: string;
  cardId?: number;
  sellerId?: number;
  purchaseDate?: string;
}

export interface TransactionsResponse {
  purchases: Purchase[];
  sells: Sell[];
  pagination: {
    purchases: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    sells: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// --- REAL ---
const realGetUserPurchases = async (page: number = 1, limit: number = 10): Promise<PageResponse<Purchase>> => {
  const token = localStorage.getItem("authToken");
  const params = createPaginationParams(page, limit);
  const response = await fetch(`${API_BASE_URL}/purchases/myorders?${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my orders");
  const data = await response.json() as PageResponse<Purchase>;
  console.log(`🛒 MYORDERS Request - UI Page: ${page}`);
  console.log("🛒 MYORDERS Response - Full content:", JSON.stringify(data, null, 2));
  console.log("🛒 MYORDERS Response - Type:", typeof data);
  console.log("🛒 MYORDERS Response - Keys:", Object.keys(data));
  return data;
};

const realGetUserSells = async (page: number = 1, limit: number = 10): Promise<PageResponse<Sell>> => {
  const token = localStorage.getItem("authToken");
  const params = createPaginationParams(page, limit);
  const response = await fetch(`${API_BASE_URL}/purchases/mysells?${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Error getting my sells");
  const data = await response.json() as PageResponse<Sell>;
  console.log(`💰 MYSELLS Request - UI Page: ${page}`);
  console.log("💰 MYSELLS Response - Full content:", JSON.stringify(data, null, 2));
  console.log("💰 MYSELLS Response - Type:", typeof data);
  console.log("💰 MYSELLS Response - Keys:", Object.keys(data));
  return data;
};

const realGetUserTransactions = async (page: number = 1, limit: number = 10): Promise<TransactionsResponse> => {
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
