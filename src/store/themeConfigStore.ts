import { create } from 'zustand';
import {
  ThemeConfig,
  getUserThemes,
  getActiveTheme,
  createTheme,
  updateTheme,
  deleteTheme,
  activateTheme,
  CreateThemeRequest,
  UpdateThemeRequest,
} from '../api/themeConfig';

interface ThemeConfigState {
  themes: ThemeConfig[];
  activeTheme: ThemeConfig | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchThemes: () => Promise<void>;
  fetchActiveTheme: () => Promise<void>;
  createTheme: (request: CreateThemeRequest) => Promise<ThemeConfig>;
  updateTheme: (id: number, request: UpdateThemeRequest) => Promise<ThemeConfig>;
  deleteTheme: (id: number) => Promise<void>;
  activateTheme: (id: number) => Promise<ThemeConfig>;
  clearError: () => void;
}

export const useThemeConfigStore = create<ThemeConfigState>((set, get) => ({
  themes: [],
  activeTheme: null,
  loading: false,
  error: null,

  fetchThemes: async () => {
    set({ loading: true, error: null });
    try {
      const themes = await getUserThemes();
      set({ themes, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch themes', loading: false });
      throw error;
    }
  },

  fetchActiveTheme: async () => {
    set({ loading: true, error: null });
    try {
      const activeTheme = await getActiveTheme();
      set({ activeTheme, loading: false });
    } catch (error: any) {
      // It's OK if there's no active theme
      set({ activeTheme: null, loading: false });
    }
  },

  createTheme: async (request: CreateThemeRequest) => {
    set({ loading: true, error: null });
    try {
      const newTheme = await createTheme(request);
      set((state) => ({
        themes: [...state.themes, newTheme],
        loading: false,
      }));
      return newTheme;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create theme', loading: false });
      throw error;
    }
  },

  updateTheme: async (id: number, request: UpdateThemeRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedTheme = await updateTheme(id, request);
      set((state) => ({
        themes: state.themes.map((t) => (t.id === id ? updatedTheme : t)),
        activeTheme: state.activeTheme?.id === id ? updatedTheme : state.activeTheme,
        loading: false,
      }));
      return updatedTheme;
    } catch (error: any) {
      set({ error: error.message || 'Failed to update theme', loading: false });
      throw error;
    }
  },

  deleteTheme: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteTheme(id);
      set((state) => ({
        themes: state.themes.filter((t) => t.id !== id),
        activeTheme: state.activeTheme?.id === id ? null : state.activeTheme,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete theme', loading: false });
      throw error;
    }
  },

  activateTheme: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const activatedTheme = await activateTheme(id);
      set((state) => ({
        themes: state.themes.map((t) => ({
          ...t,
          isActive: t.id === activatedTheme.id,
        })),
        activeTheme: activatedTheme,
        loading: false,
      }));
      return activatedTheme;
    } catch (error: any) {
      set({ error: error.message || 'Failed to activate theme', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
