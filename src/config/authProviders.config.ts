// src/config/authProviders.config.ts
// ⚙️ CENTRAL AUTH PROVIDERS CONFIGURATION
// This is the ONLY file you need to modify to enable/disable auth providers

/**
 * Configuration for Shopify Storefront API
 */
export interface ShopifyProviderConfig {
  enabled: boolean;
  shop: string;                    // Your Shopify shop name (e.g., 'my-store')
  storefrontAccessToken: string;   // Storefront API access token
  apiVersion?: string;             // API version (default: '2024-01')
}

/**
 * Configuration for WordPress (future)
 */
export interface WordPressProviderConfig {
  enabled: boolean;
  siteUrl?: string;
  clientId?: string;
  clientSecret?: string;
}

/**
 * Main configuration object
 * Add new providers here as needed
 */
export interface AuthProvidersConfig {
  shopify: ShopifyProviderConfig;
  wordpress: WordPressProviderConfig;
  // Add more providers here...
}

/**
 * ⚙️ CONFIGURATION
 *
 * To enable a provider:
 * 1. Set enabled: true
 * 2. Add the required environment variables to .env
 * 3. Restart dev server
 *
 * To disable a provider:
 * 1. Set enabled: false
 * 2. The provider will be completely removed from the build
 */
export const AUTH_PROVIDERS_CONFIG: AuthProvidersConfig = {
  // ===== SHOPIFY =====
  shopify: {
    enabled: false,  // ← Set to false to disable Shopify auth
    shop: import.meta.env.VITE_SHOPIFY_SHOP || '',
    storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '',
    apiVersion: '2024-01',
  },

  // ===== WORDPRESS ===== (Not implemented yet)
  wordpress: {
    enabled: false,  // ← Not implemented yet
    siteUrl: import.meta.env.VITE_WORDPRESS_URL,
    clientId: import.meta.env.VITE_WORDPRESS_CLIENT_ID,
    clientSecret: import.meta.env.VITE_WORDPRESS_CLIENT_SECRET,
  },
};

/**
 * Helper function to check if any external auth provider is enabled
 */
export const hasExternalAuthProviders = (): boolean => {
  return Object.values(AUTH_PROVIDERS_CONFIG).some(config => config.enabled);
};

/**
 * Get list of enabled provider IDs
 */
export const getEnabledProviderIds = (): string[] => {
  return Object.entries(AUTH_PROVIDERS_CONFIG)
    .filter(([_, config]) => config.enabled)
    .map(([id, _]) => id);
};
