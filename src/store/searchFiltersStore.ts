import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LanguageFilters {
  en: boolean;
  es: boolean;
  fr: boolean;
  de: boolean;
  it: boolean;
  ja: boolean;
  pt: boolean;
  ru: boolean;
  zh: boolean;
  ko: boolean;
}

export interface CurrentFilters {
  query: string;
  collection: string;
  languages: LanguageFilters | Record<string, never>;
}

export interface SearchFiltersStore {
  // Filter states
  searchText: string;
  selectedCollection: string;
  anyLanguage: boolean;
  languageFilters: LanguageFilters;

  // Actions
  setSearchText: (text: string) => void;
  setSelectedCollection: (collection: string) => void;
  setAnyLanguage: (value: boolean) => void;
  setLanguageFilters: (filters: LanguageFilters) => void;
  toggleLanguage: (language: keyof LanguageFilters) => void;
  getCurrentFilters: () => CurrentFilters;
  resetFilters: () => void;
}

const defaultLanguageFilters: LanguageFilters = {
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
};

const useSearchFiltersStore = create<SearchFiltersStore>()(
  persist(
    (set, get) => ({
      // Filter states
      searchText: '',
      selectedCollection: '',
      anyLanguage: false,
      languageFilters: defaultLanguageFilters,

      // Actions
      setSearchText: (text: string) => set({ searchText: text }),
      setSelectedCollection: (collection: string) => set({ selectedCollection: collection }),
      setAnyLanguage: (value: boolean) => set({ anyLanguage: value }),
      setLanguageFilters: (filters: LanguageFilters) => set({ languageFilters: filters }),

      // Update a single language filter
      toggleLanguage: (language: keyof LanguageFilters) => set((state) => ({
        languageFilters: {
          ...state.languageFilters,
          [language]: !state.languageFilters[language]
        }
      })),

      // Get current filters as object
      getCurrentFilters: (): CurrentFilters => {
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
        languageFilters: defaultLanguageFilters
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
