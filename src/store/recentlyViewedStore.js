import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      recentlyViewed: [],

      // Add a card to recently viewed list
      addRecentlyViewed: (card) => {
        const { recentlyViewed } = get();

        // Create card object with required fields
        const cardToAdd = {
          cardId: card.id || card.cardId,
          image: card.imageUrl || card.image,
          name: card.name
        };

        // Remove if already exists to avoid duplicates
        const filtered = recentlyViewed.filter(item => item.cardId !== cardToAdd.cardId);

        // Add to beginning and keep only last 20
        const updated = [cardToAdd, ...filtered].slice(0, 20);

        set({ recentlyViewed: updated });
      },

      // Get all recently viewed cards
      getRecentlyViewed: () => {
        return get().recentlyViewed;
      },

      // Clear all recently viewed cards
      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      }
    }),
    {
      name: 'recently-viewed-cards', // localStorage key
      version: 1,
    }
  )
);

export default useRecentlyViewedStore;