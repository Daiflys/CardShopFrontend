// src/api/cart.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- MOCK DATA ---
let mockCart = [];

const mockAddToCart = async (card) => {
  await new Promise(res => setTimeout(res, 200));
  
  const quantityToAdd = card.quantity || 1;
  const availableStock = card.availableStock || card.available || Infinity;
  
  const existingItem = mockCart.find(item => item.id === card.id);
  const currentInCart = existingItem ? existingItem.quantity : 0;
  
  // Check if we have enough stock
  if (currentInCart + quantityToAdd > availableStock) {
    const remaining = availableStock - currentInCart;
    throw new Error(`Only ${remaining} items available. You already have ${currentInCart} in cart.`);
  }
  
  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    mockCart.push({
      ...card,
      quantity: quantityToAdd,
      addedAt: new Date().toISOString()
    });
  }
  
  return { success: true, message: "Card added to cart" };
};

const mockRemoveFromCart = async (cardId) => {
  await new Promise(res => setTimeout(res, 200));
  
  mockCart = mockCart.filter(item => item.id !== cardId);
  return { success: true, message: "Card removed from cart" };
};

const mockGetCart = async () => {
  await new Promise(res => setTimeout(res, 300));
  return mockCart;
};

const mockUpdateQuantity = async (cardId, quantity) => {
  await new Promise(res => setTimeout(res, 200));
  
  const item = mockCart.find(item => item.id === cardId);
  if (item) {
    if (quantity <= 0) {
      mockCart = mockCart.filter(item => item.id !== cardId);
    } else {
      item.quantity = quantity;
    }
  }
  
  return { success: true, message: "Cart updated" };
};

// --- REAL API ---
const realAddToCart = async (card) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const payload = { cardId: card.id, quantity: card.quantity || 1 };

  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Error adding to cart");
  }

  return response.json();
};

const realRemoveFromCart = async (cardId) => {
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

  return response.json();
};

const realGetCart = async () => {
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

  return response.json();
};

const realUpdateQuantity = async (cardId, quantity) => {
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

  return response.json();
};

// --- CHECKOUT ---
const mockCheckout = async (items) => {
  await new Promise(res => setTimeout(res, 300));
  return { 
    success: true, 
    transaction_id: "mock-transaction-" + Date.now(),
    purchases: items,
    message: "All items purchased successfully"
  };
};

const realCheckout = async (items) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  console.log("📦 Cart Items received:", items);

  const batchRequest = {
    items: items.map(item => ({
      card_to_sell_id: typeof item.id === 'string' ? Number(item.id) : item.id,
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

  const result = await response.json();
  console.log("✅ Checkout response:", result);
  return result;
};

// Export functions
export const addToCart = USE_MOCK ? mockAddToCart : realAddToCart;
export const removeFromCart = USE_MOCK ? mockRemoveFromCart : realRemoveFromCart;
export const getCart = USE_MOCK ? mockGetCart : realGetCart;
export const updateQuantity = USE_MOCK ? mockUpdateQuantity : realUpdateQuantity;
export const checkout = realCheckout;
