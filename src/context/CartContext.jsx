import React, { createContext, useContext, useState, useEffect } from "react";
import { addToCart, removeFromCart, getCart, updateQuantity } from "../api/cart";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await getCart();
      setCartItems(items);
    } catch (err) {
      // Only show error if user is authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        setError(err.message);
      }
      // If not authenticated, just set empty cart (this is normal)
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (card) => {
    try {
      setLoading(true);
      await addToCart(card);
      await loadCart(); // Reload cart to get updated state
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (cardId) => {
    try {
      setLoading(true);
      await removeFromCart(cardId);
      await loadCart();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (cardId, quantity) => {
    try {
      setLoading(true);
      await updateQuantity(cardId, quantity);
      await loadCart();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setError("");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Assuming each item has a price property
      const price = item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (cardId) => {
    return cartItems.some(item => item.id === cardId);
  };

  const value = {
    cartItems,
    loading,
    error,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
