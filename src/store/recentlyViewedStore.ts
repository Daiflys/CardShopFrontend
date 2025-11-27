import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentlyViewedCard {
  cardId: string;
  image: string;
  cardName: string;
}

export interface CardInput {
  id?: string;
  cardId?: string;
  imageUrl?: string;
  image?: string;
  cardName: string;
}

export interface RecentlyViewedStore {
  recentlyViewed: RecentlyViewedCard[];
  addRecentlyViewed: (card: CardInput) => void;
  getRecentlyViewed: () => RecentlyViewedCard[];
  clearRecentlyViewed: () => void;
}

const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],

      // Add a card to recently viewed list
      addRecentlyViewed: (card: CardInput) => {
        const { recentlyViewed } = get();

        // Create card object with required fields
        const cardToAdd: RecentlyViewedCard = {
          cardId: card.id || card.cardId || '',
          image: card.imageUrl || card.image || '',
          cardName: card.cardName
        };

        // Remove if already exists to avoid duplicates
        const filtered = recentlyViewed.filter(item => item.cardId !== cardToAdd.cardId);

        // Add to beginning and keep only last 18 (multiple of 3 and 6 for grid layout)
        const updated = [cardToAdd, ...filtered].slice(0, 18);

        set({ recentlyViewed: updated });
      },

      // Get all recently viewed cards
      getRecentlyViewed: (): RecentlyViewedCard[] => {
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
