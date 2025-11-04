// src/authProviders/shopify/ShopifyAuthProvider.ts
// Shopify Storefront API authentication provider

import { ComponentType } from 'react';
import {
  BaseAuthProvider,
  LoginCredentials,
  AuthResponse,
  AuthButtonProps,
} from '../types';
import type { ShopifyProviderConfig } from '../../config/authProviders.config';
import type {
  ShopifyGraphQLResponse,
  ShopifyAccessTokenCreateResponse,
  ShopifyCustomerQueryResponse,
  ShopifyCustomer,
} from './types';

/**
 * Shopify Storefront API Authentication Provider
 *
 * Uses Shopify's Storefront API to authenticate customers
 * without requiring Shopify Plus or Multipass.
 *
 * Flow:
 * 1. User enters email/password
 * 2. Call Shopify customerAccessTokenCreate mutation
 * 3. Receive Shopify access token
 * 4. Fetch customer data
 * 5. Send to backend for verification and JWT generation
 */
export class ShopifyAuthProvider extends BaseAuthProvider {
  readonly id = 'shopify';
  readonly name = 'Shopify';

  private shopifyConfig: ShopifyProviderConfig;
  private graphqlEndpoint: string;

  constructor(config: ShopifyProviderConfig) {
    super(config);
    this.shopifyConfig = config;

    // Build GraphQL endpoint URL
    const apiVersion = config.apiVersion || '2024-01';
    this.graphqlEndpoint = `https://${config.shop}.myshopify.com/api/${apiVersion}/graphql.json`;
  }

  /**
   * Login with Shopify using email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    try {
      // Step 1: Create customer access token with Shopify
      const tokenResponse = await this.createCustomerAccessToken(email, password);

      if (!tokenResponse.success || !tokenResponse.accessToken) {
        return {
          success: false,
          error: tokenResponse.error || 'Failed to authenticate with Shopify',
        };
      }

      // Step 2: Fetch customer data using the access token
      const customerData = await this.fetchCustomerData(tokenResponse.accessToken);

      if (!customerData) {
        return {
          success: false,
          error: 'Failed to fetch customer data from Shopify',
        };
      }

      // Step 3: Verify with backend and get JWT
      const authResponse = await this.verifyWithBackend(
        tokenResponse.accessToken,
        customerData
      );

      return authResponse;
    } catch (error) {
      console.error('Shopify login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Validate Shopify access token
   */
  async validate(token: string): Promise<boolean> {
    try {
      const customer = await this.fetchCustomerData(token);
      return customer !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get the login button component
   * Lazy-loaded to avoid bundling if provider is disabled
   */
  getButtonComponent(): ComponentType<AuthButtonProps> {
    // Dynamic import to support code splitting
    // Will be implemented in ShopifyLoginButton.tsx
    return require('./ShopifyLoginButton').default;
  }

  /**
   * Create customer access token using Shopify Storefront API
   */
  private async createCustomerAccessToken(
    email: string,
    password: string
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    const mutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.shopifyConfig.storefrontAccessToken,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: { email, password },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const result: ShopifyGraphQLResponse<ShopifyAccessTokenCreateResponse> =
        await response.json();

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        const errorMessages = result.errors.map((e) => e.message).join(', ');
        return {
          success: false,
          error: errorMessages,
        };
      }

      // Check for customer user errors
      const { customerAccessToken, customerUserErrors } =
        result.data?.customerAccessTokenCreate || {};

      if (customerUserErrors && customerUserErrors.length > 0) {
        const errorMessage = customerUserErrors.map((e) => e.message).join(', ');
        return {
          success: false,
          error: errorMessage,
        };
      }

      if (!customerAccessToken) {
        return {
          success: false,
          error: 'No access token received from Shopify',
        };
      }

      return {
        success: true,
        accessToken: customerAccessToken.accessToken,
      };
    } catch (error) {
      console.error('Error creating Shopify access token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch customer data using access token
   */
  private async fetchCustomerData(accessToken: string): Promise<ShopifyCustomer | null> {
    const query = `
      query {
        customer(customerAccessToken: "${accessToken}") {
          id
          email
          firstName
          lastName
          displayName
          phone
          acceptsMarketing
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.shopifyConfig.storefrontAccessToken,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const result: ShopifyGraphQLResponse<ShopifyCustomerQueryResponse> =
        await response.json();

      if (result.errors && result.errors.length > 0) {
        console.error('Shopify GraphQL errors:', result.errors);
        return null;
      }

      return result.data?.customer || null;
    } catch (error) {
      console.error('Error fetching Shopify customer data:', error);
      return null;
    }
  }
}
