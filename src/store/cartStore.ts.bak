import { create } from 'zustand';

const CART_STORAGE_KEY = 'shopping_cart';

export interface CartItem {
  id: string;
  cardToSellId?: number; // The actual ID needed for checkout
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
  loadCart: () => void;
  addItemToCart: (card: any) => { success: boolean; error?: string };
  removeItemFromCart: (cardId: string) => { success: boolean; error?: string };
  updateItemQuantity: (cardId: string, quantity: number) => { success: boolean; error?: string };
  clearCart: () => void;

  // Computed values (getters)
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (cardId: string) => boolean;
}

// Helper functions for localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Error loading cart from localStorage:', err);
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving cart to localStorage:', err);
  }
};

const useCartStore = create<CartStore>((set, get) => ({
  // State
  cartItems: loadCartFromStorage(),
  loading: false,
  error: '',

  // Actions
  loadCart: () => {
    try {
      const items = loadCartFromStorage();
      set({ cartItems: items, error: '' });
    } catch (err) {
      set({ error: (err as Error).message, cartItems: [] });
    }
  },

  addItemToCart: (card: any) => {
    try {
      console.log("🛒 Adding item to cart - Input card data:", JSON.stringify(card, null, 2));

      const { cartItems } = get();
      const existingItem = cartItems.find(item => item.id === card.id);

      let updatedCart: CartItem[];

      if (existingItem) {
        // Update quantity if item already exists
        console.log("   Item already in cart, updating quantity");
        updatedCart = cartItems.map(item =>
          item.id === card.id
            ? { ...item, quantity: item.quantity + (card.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: card.id,
          cardToSellId: card.cardToSellId || (typeof card.id === 'number' ? card.id : Number(card.id)),
          name: card.card_name || card.name,
          price: card.price || card.cardPrice || 0,
          quantity: card.quantity || 1,
          imageUrl: card.image_url || card.imageUrl,
          set: card.set_name || card.setName || card.set,
          condition: card.condition,
          sellerId: card.userId?.toString() || card.sellerId,
          available: card.quantity
        };
        console.log("   Created new cart item:", JSON.stringify(newItem, null, 2));
        updatedCart = [...cartItems, newItem];
      }

      saveCartToStorage(updatedCart);
      set({ cartItems: updatedCart, error: '' });
      console.log("✅ Cart updated successfully. Total items:", updatedCart.length);
      return { success: true };
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      set({ error: (err as Error).message });
      return { success: false, error: (err as Error).message };
    }
  },

  removeItemFromCart: (cardId: string) => {
    try {
      const { cartItems } = get();
      const updatedCart = cartItems.filter(item => item.id !== cardId);

      saveCartToStorage(updatedCart);
      set({ cartItems: updatedCart, error: '' });
      return { success: true };
    } catch (err) {
      set({ error: (err as Error).message });
      return { success: false, error: (err as Error).message };
    }
  },

  updateItemQuantity: (cardId: string, quantity: number) => {
    try {
      const { cartItems } = get();

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return get().removeItemFromCart(cardId);
      }

      const updatedCart = cartItems.map(item =>
        item.id === cardId
          ? { ...item, quantity }
          : item
      );

      saveCartToStorage(updatedCart);
      set({ cartItems: updatedCart, error: '' });
      return { success: true };
    } catch (err) {
      set({ error: (err as Error).message });
      return { success: false, error: (err as Error).message };
    }
  },

  clearCart: () => {
    saveCartToStorage([]);
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
