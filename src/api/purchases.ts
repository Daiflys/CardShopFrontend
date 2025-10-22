// src/api/purchases.ts
import type { PurchaseResponse, PageResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// ============================================
// BUYER FLOW - Checkout with payment
// ============================================

export interface CheckoutItem {
  card_to_sell_id: number;  // snake_case as per backend @JsonProperty
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  payment_provider_id: string;  // snake_case as per backend @JsonProperty
  payment_provider: string;      // snake_case as per backend @JsonProperty
}

export interface CheckoutResponse {
  transactionId: string;
  purchases: PurchaseResponse[];
  success: boolean;
  message: string;
}

/**
 * Creates pending purchase orders for all items in cart (batch checkout)
 * @param request Checkout request with all cart items and payment info
 */
export const batchCheckout = async (request: CheckoutRequest): Promise<CheckoutResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  console.log("🌐 API Call - batchCheckout");
  console.log("   URL:", `${API_BASE_URL}/purchases/checkout`);
  console.log("   Request body:", JSON.stringify(request, null, 2));

  const response = await fetch(`${API_BASE_URL}/purchases/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });

  console.log("   Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("   Error response:", errorText);
    throw new Error(`Error creating purchases: ${response.status} - ${errorText}`);
  }

  const result = await response.json() as CheckoutResponse;
  console.log("   Response data:", JSON.stringify(result, null, 2));

  return result;
};

// ============================================
// SELLER FLOW - Manage pending orders
// ============================================

/**
 * Get all pending purchases for the seller
 * @param page Page number (0-indexed)
 * @param size Items per page
 */
export const getPendingPurchases = async (
  page: number = 0,
  size: number = 20
): Promise<PageResponse<PurchaseResponse>> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(
    `${API_BASE_URL}/purchases/pending?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error fetching pending purchases: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<PageResponse<PurchaseResponse>>;
};

/**
 * Confirm a pending purchase
 * @param purchaseId ID of the purchase to confirm
 */
export const confirmPurchase = async (purchaseId: number): Promise<PurchaseResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/purchases/${purchaseId}/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error confirming purchase: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<PurchaseResponse>;
};

/**
 * Cancel a pending purchase (restores stock)
 * @param purchaseId ID of the purchase to cancel
 */
export const cancelPurchase = async (purchaseId: number): Promise<PurchaseResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/purchases/${purchaseId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error cancelling purchase: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<PurchaseResponse>;
};
