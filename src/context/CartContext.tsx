import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { addToCart, removeFromCart, getCart, updateQuantity } from "../api/cart.ts";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  set?: string;
  condition?: string;
  sellerId?: string;
  available?: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  loading: boolean;
  error: string;
  addItemToCart: (card: any) => Promise<{ success: boolean; error?: string }>;
  removeItemFromCart: (cardId: string) => Promise<{ success: boolean; error?: string }>;
  updateItemQuantity: (cardId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (cardId: string) => boolean;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async (): Promise<void> => {
    try {
      setLoading(true);
      const items = await getCart();
      setCartItems(items);
    } catch (err) {
      // Only show error if user is authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        setError((err as Error).message);
      }
      // If not authenticated, just set empty cart (this is normal)
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (card: any): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      await addToCart(card);
      await loadCart(); // Reload cart to get updated state
      return { success: true };
    } catch (err) {
      setError((err as Error).message);
      return { success: false, error: (err as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (cardId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      await removeFromCart(cardId);
      await loadCart();
      return { success: true };
    } catch (err) {
      setError((err as Error).message);
      return { success: false, error: (err as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (cardId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      await updateQuantity(cardId, quantity);
      await loadCart();
      return { success: true };
    } catch (err) {
      setError((err as Error).message);
      return { success: false, error: (err as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = (): void => {
    setCartItems([]);
    setError("");
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      // Assuming each item has a price property
      const price = item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (cardId: string): boolean => {
    return cartItems.some(item => item.id === cardId);
  };

  const value: CartContextValue = {
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
