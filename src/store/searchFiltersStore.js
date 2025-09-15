import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSearchFiltersStore = create(
  persist(
    (set, get) => ({
      // Filter states
      searchText: '',
      selectedCollection: '',
      anyLanguage: false,
      languageFilters: {
        en: true,
        es: false,
        fr: false,
        de: false,
        it: false,
        ja: false,
        pt: false,
        ru: false,
        zh: false,
        ko: false
      },
      
      // Actions
      setSearchText: (text) => set({ searchText: text }),
      setSelectedCollection: (collection) => set({ selectedCollection: collection }),
      setAnyLanguage: (value) => set({ anyLanguage: value }),
      setLanguageFilters: (filters) => set({ languageFilters: filters }),
      
      // Update a single language filter
      toggleLanguage: (language) => set((state) => ({
        languageFilters: {
          ...state.languageFilters,
          [language]: !state.languageFilters[language]
        }
      })),
      
      // Get current filters as object
      getCurrentFilters: () => {
        const state = get();
        return {
          query: state.searchText,
          collection: state.selectedCollection || '',
          languages: state.anyLanguage ? {} : state.languageFilters
        };
      },
      
      // Reset all filters
      resetFilters: () => set({
        searchText: '',
        selectedCollection: '',
        anyLanguage: false,
        languageFilters: {
          en: true,
          es: false,
          fr: false,
          de: false,
          it: false,
          ja: false,
          pt: false,
          ru: false,
          zh: false,
          ko: false
        }
      })
    }),
    {
      name: 'search-filters-storage', // unique name for localStorage key
      partialize: (state) => ({
        selectedCollection: state.selectedCollection,
        anyLanguage: state.anyLanguage,
        languageFilters: state.languageFilters
      }), // only persist these fields, not searchText (which comes from URL)
    }
  )
);

export default useSearchFiltersStore;