/**
 * StorefrontEditor LocalStorage Manager
 *
 * Manages all storefront configuration in a single, clean localStorage key.
 * Easy to inspect, backup, and clear.
 */

const STORAGE_KEY = 'STOREFRONT_EDITOR_CONFIG';
const STORAGE_VERSION = '1.0.0';

// Default configuration
const DEFAULT_CONFIG = {
  version: STORAGE_VERSION,
  lastModified: null,
  applyToSite: true,

  logo: {
    file: null,      // Will store base64 or URL
    width: 90,       // pixels
  },

  favicon: {
    file: null,      // Will store base64 or URL
  },

  colors: {
    activeSchemeId: 1,
    schemes: [
      {
        id: 1,
        name: 'Scheme 1',
        colors: {
          background: '#ffffff',
          text: '#000000',
          accent1: '#0284c7',
          accent2: '#0ea5e9',
          border: '#e2e8f0',
        }
      },
      {
        id: 2,
        name: 'Scheme 2',
        colors: {
          background: '#f8fafc',
          text: '#1e293b',
          accent1: '#0f172a',
          accent2: '#475569',
          border: '#cbd5e1',
        }
      },
      {
        id: 3,
        name: 'Scheme 3',
        colors: {
          background: '#0f172a',
          text: '#f8fafc',
          accent1: '#0ea5e9',
          accent2: '#38bdf8',
          border: '#334155',
        }
      },
      {
        id: 4,
        name: 'Scheme 4',
        colors: {
          background: '#fef3c7',
          text: '#78350f',
          accent1: '#f59e0b',
          accent2: '#fbbf24',
          border: '#fde68a',
        }
      },
      {
        id: 5,
        name: 'Scheme 5',
        colors: {
          background: '#ecfdf5',
          text: '#064e3b',
          accent1: '#059669',
          accent2: '#10b981',
          border: '#a7f3d0',
        }
      },
    ]
  },

  typography: {
    headings: {
      font: 'Assistant',
      scale: 100,
    },
    body: {
      font: 'Assistant',
      scale: 100,
    }
  },

  // New sections for Shopify-like customization
  header: {
    showAnnouncementBar: false,
    announcementText: 'Welcome to our shop! Free shipping over $50',
    announcementBg: '#0ea5e9',
    announcementTextColor: '#ffffff',
    stickyHeader: true,
    headerBg: '#ffffff',
    headerText: '#0f172a',
    headerBorder: '#e2e8f0'
  },

  buttons: {
    radius: '8px',
    uppercase: false,
    fontWeight: 600,
    primaryBg: '#0284c7',
    primaryBgHover: '#0ea5e9',
    primaryText: '#ffffff'
  },

  layout: {
    containerMaxWidth: 1200, // px
    sectionSpacing: 32, // px top/bottom
    cardGap: 16 // px
  },

  productCards: {
    imageRatio: '3/4', // '1/1', '3/4', '2/3'
    density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
    showCondition: true,
    showSet: true,
    showSeller: false
  },

  // Page-level customizable sections (start with Home page)
  pages: {
    home: {
      sections: [
        // Example section structure
        // { id: 'sec_1', type: 'miniBanner', enabled: true, settings: { imageUrl: '', linkUrl: '', height: 160, background: '#f3f4f6', text: '', align: 'center' } }
      ]
    }
  }
};

/**
 * Load configuration from localStorage
 * @returns {Object} Configuration object
 */
export const loadConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { ...DEFAULT_CONFIG };
    }

    const parsed = JSON.parse(stored);

    // Version migration logic (if needed in future)
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Config version mismatch, using defaults');
      return { ...DEFAULT_CONFIG };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load config from localStorage:', error);
    return { ...DEFAULT_CONFIG };
  }
};

/**
 * Save configuration to localStorage
 * @param {Object} config - Configuration object to save
 * @returns {boolean} Success status
 */
export const saveConfig = (config) => {
  try {
    const toSave = {
      ...config,
      version: STORAGE_VERSION,
      lastModified: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    console.log('✅ Storefront config saved to localStorage');
    return true;
  } catch (error) {
    console.error('Failed to save config to localStorage:', error);
    return false;
  }
};

/**
 * Clear all storefront configuration
 * @returns {boolean} Success status
 */
export const clearConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Storefront config cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Failed to clear config from localStorage:', error);
    return false;
  }
};

/**
 * Reset to default configuration
 * @returns {Object} Default configuration
 */
export const resetToDefaults = () => {
  const defaults = { ...DEFAULT_CONFIG };
  saveConfig(defaults);
  return defaults;
};

/**
 * Export configuration as JSON file
 * @param {Object} config - Configuration to export
 */
export const exportConfig = (config) => {
  const dataStr = JSON.stringify(config, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `storefront-config-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

/**
 * Import configuration from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} Imported configuration
 */
export const importConfig = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        saveConfig(imported);
        resolve(imported);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Get a specific configuration section
 * @param {string} section - Section name (logo, colors, typography)
 * @returns {*} Section data
 */
export const getConfigSection = (section) => {
  const config = loadConfig();
  return config[section];
};

/**
 * Update a specific configuration section
 * @param {string} section - Section name
 * @param {*} data - Data to update
 * @returns {boolean} Success status
 */
export const updateConfigSection = (section, data) => {
  const config = loadConfig();
  config[section] = data;
  return saveConfig(config);
};

export default {
  loadConfig,
  saveConfig,
  clearConfig,
  resetToDefaults,
  exportConfig,
  importConfig,
  getConfigSection,
  updateConfigSection,
  STORAGE_KEY,
  DEFAULT_CONFIG,
};
