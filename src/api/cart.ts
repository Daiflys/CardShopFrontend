// src/api/cart.ts
import type { CartItem } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface CartResponse {
  success: boolean;
  message: string;
}

interface CheckoutItem {
  card_to_sell_id: number;
  quantity: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
}

interface CheckoutResponse {
  success: boolean;
  transaction_id?: string;
  purchases?: CartItem[];
  message: string;
}
const realAddToCart = async (card: CartItem): Promise<CartResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  console.log("🛒 AddToCart called with card:", card);
  const payload = { cardId: card.id, quantity: card.quantity || 1 };
  console.log("📦 Payload being sent:", payload);
  console.log("🌐 API URL:", `${API_BASE_URL}/cart/add`);

  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  console.log("📡 Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error response:", errorText);
    throw new Error(`Error adding to cart: ${response.status} - ${errorText}`);
  }

  const result = await response.json() as CartResponse;
  console.log("✅ Success response:", result);
  return result;
};

const realRemoveFromCart = async (cardId: string | number): Promise<CartResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/cart/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ cardId })
  });

  if (!response.ok) {
    throw new Error("Error removing from cart");
  }

  return response.json() as Promise<CartResponse>;
};

const realGetCart = async (): Promise<CartItem[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error fetching cart");
  }

  return response.json() as Promise<CartItem[]>;
};

const realUpdateQuantity = async (cardId: string | number, quantity: number): Promise<CartResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/cart/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ cardId, quantity })
  });

  if (!response.ok) {
    throw new Error("Error updating cart");
  }

  return response.json() as Promise<CartResponse>;
};

const realCheckout = async (items: CartItem[]): Promise<CheckoutResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  console.log("📦 Cart Items received:", items);

  const batchRequest: CheckoutRequest = {
    items: items.map(item => ({
      card_to_sell_id: typeof item.id === 'string' ? Number(item.id) : item.id as number,
      quantity: item.quantity || 1
    }))
  };

  console.log("🛒 Batch Purchase Request:", JSON.stringify(batchRequest, null, 2));

  const response = await fetch(`${API_BASE_URL}/purchases/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(batchRequest)
  });

  console.log("🌐 Response status:", response.status);
  console.log("🌐 Response headers:", response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Checkout failed:", errorText);
    throw new Error(`Error performing checkout: ${response.status} - ${errorText}`);
  }

  const result = await response.json() as CheckoutResponse;
  console.log("✅ Checkout response:", result);
  return result;
};

// Export functions
export const addToCart = realAddToCart;
export const removeFromCart = realRemoveFromCart;
export const getCart = realGetCart;
export const updateQuantity = realUpdateQuantity;
export const checkout = realCheckout;
