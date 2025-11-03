import { create } from 'zustand';
import {
  loadConfig,
  saveConfig,
  clearConfig,
  resetToDefaults,
  updateConfigSection,
} from '../utils/storageManager';

/**
 * Storefront Editor Store
 *
 * Manages the state of the visual editor.
 */
export const useEditorStore = create((set, get) => ({
  // Configuration state
  config: loadConfig(),

  // Editor UI state
  selectedSection: 'logo', // Current section in sidebar (logo, colors, typography)
  isDirty: false,          // Has unsaved changes
  isSaving: false,         // Currently saving
  lastSaved: null,         // Timestamp of last save

  // Actions

  /**
   * Update logo configuration
   */
  updateLogo: (logoData) => {
    set((state) => ({
      config: {
        ...state.config,
        logo: { ...state.config.logo, ...logoData }
      },
      isDirty: true
    }));
  },

  /**
   * Update favicon
   */
  updateFavicon: (faviconData) => {
    set((state) => ({
      config: {
        ...state.config,
        favicon: { ...state.config.favicon, ...faviconData }
      },
      isDirty: true
    }));
  },

  /**
   * Update active color scheme
   */
  setActiveColorScheme: (schemeId) => {
    set((state) => ({
      config: {
        ...state.config,
        colors: {
          ...state.config.colors,
          activeSchemeId: schemeId
        }
      },
      isDirty: true
    }));
  },

  /**
   * Update a specific color scheme
   */
  updateColorScheme: (schemeId, colors) => {
    set((state) => ({
      config: {
        ...state.config,
        colors: {
          ...state.config.colors,
          schemes: state.config.colors.schemes.map(scheme =>
            scheme.id === schemeId
              ? { ...scheme, colors: { ...scheme.colors, ...colors } }
              : scheme
          )
        }
      },
      isDirty: true
    }));
  },

  /**
   * Add new color scheme
   */
  addColorScheme: (name, colors) => {
    set((state) => {
      const newId = Math.max(...state.config.colors.schemes.map(s => s.id)) + 1;
      return {
        config: {
          ...state.config,
          colors: {
            ...state.config.colors,
            schemes: [
              ...state.config.colors.schemes,
              { id: newId, name, colors }
            ]
          }
        },
        isDirty: true
      };
    });
  },

  /**
   * Update typography settings
   */
  updateTypography: (section, data) => {
    set((state) => ({
      config: {
        ...state.config,
        typography: {
          ...state.config.typography,
          [section]: { ...state.config.typography[section], ...data }
        }
      },
      isDirty: true
    }));
  },

  /**
   * Header settings
   */
  updateHeader: (data) => {
    set((state) => ({
      config: {
        ...state.config,
        header: { ...state.config.header, ...data },
      },
      isDirty: true,
    }));
  },

  /**
   * Buttons settings
   */
  updateButtons: (data) => {
    set((state) => ({
      config: {
        ...state.config,
        buttons: { ...state.config.buttons, ...data },
      },
      isDirty: true,
    }));
  },

  /**
   * Layout settings
   */
  updateLayout: (data) => {
    set((state) => ({
      config: {
        ...state.config,
        layout: { ...state.config.layout, ...data },
      },
      isDirty: true,
    }));
  },

  /**
   * Product cards settings
   */
  updateProductCards: (data) => {
    set((state) => ({
      config: {
        ...state.config,
        productCards: { ...state.config.productCards, ...data },
      },
      isDirty: true,
    }));
  },

  /**
   * Save configuration to localStorage
   */
  save: () => {
    set({ isSaving: true });

    const { config } = get();
    const success = saveConfig(config);

    if (success) {
      set({
        isSaving: false,
        isDirty: false,
        lastSaved: new Date().toISOString()
      });
      return true;
    } else {
      set({ isSaving: false });
      return false;
    }
  },

  /**
   * Toggle whether config applies to the live site
   */
  setApplyToSite: (value) => {
    set((state) => ({
      config: {
        ...state.config,
        applyToSite: !!value,
      },
      isDirty: true,
    }));
  },

  /**
   * Reload configuration from localStorage
   */
  reload: () => {
    const config = loadConfig();
    set({ config, isDirty: false });
  },

  /**
   * Reset to default configuration
   */
  reset: () => {
    const config = resetToDefaults();
    set({ config, isDirty: false, lastSaved: null });
  },

  /**
   * Clear all configuration
   */
  clear: () => {
    clearConfig();
    const config = loadConfig(); // Will return defaults
    set({ config, isDirty: false, lastSaved: null });
  },

  /**
   * Set selected section in sidebar
   */
  setSelectedSection: (section) => {
    set({ selectedSection: section });
  },

  /**
   * Get active color scheme
   */
  getActiveColorScheme: () => {
    const { config } = get();
    return config.colors.schemes.find(
      s => s.id === config.colors.activeSchemeId
    );
  },

  /**
   * Toggle applyToSite and persist immediately so non-preview tabs react via storage event
   */
  setApplyToSiteAndSave: (value) => {
    // Update state first
    set((state) => ({
      config: {
        ...state.config,
        applyToSite: !!value,
      },
      isDirty: true,
    }));

    // Save immediately
    const { config } = get();
    const ok = saveConfig(config);
    if (ok) {
      set({ isDirty: false, lastSaved: new Date().toISOString() });
    }
    return ok;
  },
}));

export default useEditorStore;
