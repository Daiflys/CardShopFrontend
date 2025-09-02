// src/api/cart.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- MOCK DATA ---
let mockCart = [];

const mockAddToCart = async (card) => {
  await new Promise(res => setTimeout(res, 200));
  
  const existingItem = mockCart.find(item => item.id === card.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    mockCart.push({
      ...card,
      quantity: 1,
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

  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ cardId: card.id, quantity: card.quantity || 1 })
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
const mockCheckout = async (cardId, quantity = 1) => {
  await new Promise(res => setTimeout(res, 300));
  return { success: true };
};

const realCheckout = async (cardId, quantity = 1) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/purchases/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ cardId, quantity })
  });

  if (!response.ok) {
    throw new Error("Error performing checkout");
  }

  return response.json();
};

// Export functions
export const addToCart = USE_MOCK ? mockAddToCart : realAddToCart;
export const removeFromCart = USE_MOCK ? mockRemoveFromCart : realRemoveFromCart;
export const getCart = USE_MOCK ? mockGetCart : realGetCart;
export const updateQuantity = USE_MOCK ? mockUpdateQuantity : realUpdateQuantity;
export const checkout = realCheckout;
