import { create } from 'zustand';
import { addToCart, removeFromCart, getCart, updateQuantity } from '../api/cart';

const useCartStore = create((set, get) => ({
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
        set({ error: err.message });
      }
      // If not authenticated, just set empty cart (this is normal)
      set({ cartItems: [] });
    } finally {
      set({ loading: false });
    }
  },

  addItemToCart: async (card) => {
    try {
      set({ loading: true });
      await addToCart(card);
      // Reload cart to get updated state
      await get().loadCart();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  removeItemFromCart: async (cardId) => {
    try {
      set({ loading: true });
      await removeFromCart(cardId);
      await get().loadCart();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  updateItemQuantity: async (cardId, quantity) => {
    try {
      set({ loading: true });
      await updateQuantity(cardId, quantity);
      await get().loadCart();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
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

  isInCart: (cardId) => {
    const { cartItems } = get();
    return cartItems.some(item => item.id === cardId);
  }
}));

export default useCartStore;