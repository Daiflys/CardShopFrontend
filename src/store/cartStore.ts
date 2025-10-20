import { create } from 'zustand';
import { addToCart, removeFromCart, getCart, updateQuantity } from '../api/cart.ts';

export interface CartItem {
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

export interface CartStore {
  // State
  cartItems: CartItem[];
  loading: boolean;
  error: string;

  // Actions
  loadCart: () => Promise<void>;
  addItemToCart: (card: any) => Promise<{ success: boolean; error?: string }>;
  removeItemFromCart: (cardId: string) => Promise<{ success: boolean; error?: string }>;
  updateItemQuantity: (cardId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => void;

  // Computed values (getters)
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (cardId: string) => boolean;
}

const useCartStore = create<CartStore>((set, get) => ({
  // State
  cartItems: [],
  loading: false,
  error: '',

  // Actions
  loadCart: async () => {
    try {
      set({ loading: true });
      const items = await getCart();
      set({ cartItems: items, error: '' });
    } catch (err) {
      // Only show error if user is authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        set({ error: (err as Error).message });
      }
      // If not authenticated, just set empty cart (this is normal)
      set({ cartItems: [] });
    } finally {
      set({ loading: false });
    }
  },

  addItemToCart: async (card: any) => {
    try {
      set({ loading: true });
      await addToCart(card);
      // Reload cart to get updated state
      await get().loadCart();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return { success: false, error: (err as Error).message };
    }
  },

  removeItemFromCart: async (cardId: string) => {
    try {
      set({ loading: true });
      await removeFromCart(cardId);
      await get().loadCart();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return { success: false, error: (err as Error).message };
    }
  },

  updateItemQuantity: async (cardId: string, quantity: number) => {
    try {
      set({ loading: true });
      await updateQuantity(cardId, quantity);
      await get().loadCart();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return { success: false, error: (err as Error).message };
    }
  },

  clearCart: () => {
    set({ cartItems: [], error: '' });
  },

  // Computed values (getters)
  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  },

  getCartCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  },

  isInCart: (cardId: string) => {
    const { cartItems } = get();
    return cartItems.some(item => item.id === cardId);
  }
}));

export default useCartStore;
