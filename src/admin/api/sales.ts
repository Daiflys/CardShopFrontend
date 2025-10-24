// src/admin/api/sales.ts
import {
  createPaginationParams,
  processPaginatedResponse
} from '../../utils/pagination.js';
import type { PurchaseStatus } from '../../api/types';
import type { PageResponse as AdminPageResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Sale interface - represents a completed sale in the system
 * Used by admin to view all sales across the platform
 */
export interface Sale {
  id: number;
  cardName: string;
  setName: string;
  condition: string;
  quantity: number;
  price: number;
  totalPrice: number;
  saleDate: string;
  buyerId: number;
  sellerId: number;
  status: PurchaseStatus;
  paymentProvider?: string;
  transactionId?: string;
  cardId?: number;
}

/**
 * Get all sales in the system (admin only)
 * This endpoint returns ALL sales/purchases made on the platform
 *
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 * @returns Paginated list of all sales
 */
export const getAllSales = async (
  page: number = 1,
  limit: number = 10
): Promise<AdminPageResponse<Sale>> => {
  const token = localStorage.getItem("authToken");
  const params = createPaginationParams(page, limit);

  const response = await fetch(`${API_BASE_URL}/admin/sales?${params}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Error fetching all sales");
  }

  const data = await response.json() as AdminPageResponse<Sale>;
  console.log(`🛍️  ADMIN SALES Request - UI Page: ${page}`);
  console.log("🛍️  ADMIN SALES Response:", JSON.stringify(data, null, 2));

  return data;
};

/**
 * Get sales statistics for admin dashboard
 * Optional: implement when needed
 */
export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
}

/**
 * Get sales statistics (admin only)
 * @returns Sales statistics
 */
export const getSalesStats = async (): Promise<SalesStats> => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/admin/sales/stats`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Error fetching sales statistics");
  }

  return await response.json();
};
