// src/authProviders/index.ts
// Provider registry - dynamically loads enabled auth providers

import type { AuthProvider } from './types';
import { AUTH_PROVIDERS_CONFIG } from '../config/authProviders.config';

/**
 * Registry of all active auth providers
 * Providers are only loaded if they are enabled in the configuration
 */
class AuthProviderRegistry {
  private providers: AuthProvider[] = [];
  private initialized = false;

  /**
   * Initialize and register all enabled providers
   * Only imports code for enabled providers (tree-shaking friendly)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Register Shopify if enabled
    if (AUTH_PROVIDERS_CONFIG.shopify.enabled) {
      try {
        const { ShopifyAuthProvider } = await import('./shopify');
        const provider = new ShopifyAuthProvider(AUTH_PROVIDERS_CONFIG.shopify);
        this.providers.push(provider);
        console.log('✓ Shopify auth provider registered');
      } catch (error) {
        console.error('Failed to load Shopify auth provider:', error);
      }
    }

    // Register WordPress if enabled (future)
    if (AUTH_PROVIDERS_CONFIG.wordpress.enabled) {
      try {
        // const { WordPressAuthProvider } = await import('./wordpress');
        // const provider = new WordPressAuthProvider(AUTH_PROVIDERS_CONFIG.wordpress);
        // this.providers.push(provider);
        console.warn('WordPress auth provider not implemented yet');
      } catch (error) {
        console.error('Failed to load WordPress auth provider:', error);
      }
    }

    // Add more providers here as needed...

    this.initialized = true;
  }

  /**
   * Get all registered and enabled providers
   */
  getProviders(): AuthProvider[] {
    return this.providers;
  }

  /**
   * Get a specific provider by ID
   */
  getProvider(id: string): AuthProvider | undefined {
    return this.providers.find((p) => p.id === id);
  }

  /**
   * Check if any external auth providers are available
   */
  hasProviders(): boolean {
    return this.providers.length > 0;
  }

  /**
   * Reset the registry (useful for testing)
   */
  reset(): void {
    this.providers = [];
    this.initialized = false;
  }
}

// Singleton instance
const registry = new AuthProviderRegistry();

/**
 * Get all active auth providers
 * Automatically initializes the registry on first call
 */
export async function getActiveAuthProviders(): Promise<AuthProvider[]> {
  await registry.initialize();
  return registry.getProviders();
}

/**
 * Get a specific auth provider by ID
 */
export async function getAuthProvider(id: string): Promise<AuthProvider | undefined> {
  await registry.initialize();
  return registry.getProvider(id);
}

/**
 * Check if any external auth providers are enabled
 */
export async function hasExternalAuthProviders(): Promise<boolean> {
  await registry.initialize();
  return registry.hasProviders();
}

// Export types
export type { AuthProvider, LoginCredentials, AuthResponse, AuthButtonProps } from './types';
