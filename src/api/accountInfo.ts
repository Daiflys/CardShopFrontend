// src/api/accountInfo.ts
import {
  createPaginationParams,
  processPaginatedResponse
} from '../utils/pagination.js';
import type { PageResponse, PurchaseStatus } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Base interface for transactions
 * Contains all common fields between purchases and sales
 */
export interface Transaction {
  id: number;
  cardName: string;
  setName: string;
  condition: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: PurchaseStatus;
  paymentProvider?: string;
  transactionId?: string;
  cardId?: number;
}

/**
 * Purchase interface - represents a user's purchase
 */
export interface Purchase extends Transaction {
  purchaseDate: string;
  sellerId: number;
  buyerId?: number;
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

/**
 * Get user's purchases with pagination
 * Only accessible to authenticated users
 */
export const getUserPurchases = realGetUserPurchases;
