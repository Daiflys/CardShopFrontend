// src/authProviders/types.ts
// Base types and interfaces for all auth providers

import { ComponentType } from 'react';

/**
 * Credentials for login - different providers may use different fields
 */
export interface LoginCredentials {
  email?: string;
  password?: string;
  username?: string;
  [key: string]: any; // Allow provider-specific fields
}

/**
 * Standard auth response from any provider
 */
export interface AuthResponse {
  success: boolean;
  token?: string;           // JWT token from backend
  user?: {
    id: string;
    email?: string;
    name?: string;
    [key: string]: any;     // Allow provider-specific user data
  };
  error?: string;
}

/**
 * Props for auth button components
 */
export interface AuthButtonProps {
  onSuccess?: (response: AuthResponse) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Configuration for a provider (passed from config file)
 */
export interface ProviderConfig {
  enabled: boolean;
  [key: string]: any; // Provider-specific config fields
}

/**
 * Main interface that all auth providers must implement
 * This ensures consistency across all external auth integrations
 */
export interface AuthProvider {
  /** Unique identifier for the provider */
  readonly id: string;

  /** Display name of the provider */
  readonly name: string;

  /** Whether this provider is currently enabled */
  readonly enabled: boolean;

  /**
   * Perform login with the provider
   * @param credentials - Login credentials (provider-specific)
   * @returns Promise with auth response
   */
  login(credentials: LoginCredentials): Promise<AuthResponse>;

  /**
   * Validate an existing token with the provider
   * @param token - Token to validate
   * @returns Promise<boolean> - true if valid
   */
  validate(token: string): Promise<boolean>;

  /**
   * Get the React component for the login button
   * @returns Component type that can be rendered
   */
  getButtonComponent(): ComponentType<AuthButtonProps>;

  /**
   * Optional: Get provider-specific configuration
   */
  getConfig?(): ProviderConfig;
}

/**
 * Abstract base class for auth providers
 * Provides common functionality and enforces interface
 */
export abstract class BaseAuthProvider implements AuthProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  readonly enabled: boolean;

  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.enabled = config.enabled;
  }

  abstract login(credentials: LoginCredentials): Promise<AuthResponse>;
  abstract validate(token: string): Promise<boolean>;
  abstract getButtonComponent(): ComponentType<AuthButtonProps>;

  getConfig(): ProviderConfig {
    return this.config;
  }

  /**
   * Helper: Send auth result to backend for verification and JWT generation
   */
  protected async verifyWithBackend(
    providerToken: string,
    providerUserData: any
  ): Promise<AuthResponse> {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/${this.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: providerToken,
          userData: providerUserData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText || 'Authentication failed',
        };
      }

      const data = await response.json();

      // Store token in localStorage (standard pattern)
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error(`${this.name} backend verification error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
