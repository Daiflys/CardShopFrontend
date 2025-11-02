// src/authProviders/shopify/types.ts
// Shopify-specific types

/**
 * Shopify Customer Access Token (returned from Storefront API)
 */
export interface ShopifyCustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

/**
 * Shopify Customer User Error
 */
export interface ShopifyCustomerUserError {
  code?: string;
  field?: string[];
  message: string;
}

/**
 * Response from customerAccessTokenCreate mutation
 */
export interface ShopifyAccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken?: ShopifyCustomerAccessToken;
    customerUserErrors: ShopifyCustomerUserError[];
  };
}

/**
 * Shopify Customer data (from Storefront API)
 */
export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response from customer query
 */
export interface ShopifyCustomerQueryResponse {
  customer: ShopifyCustomer | null;
}

/**
 * GraphQL response wrapper
 */
export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}
