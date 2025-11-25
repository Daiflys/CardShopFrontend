/**
 * Shared Payment Types
 * These types are provider-agnostic and used by all payment providers
 * This ensures no payment provider depends on another
 */

/**
 * Parameters for initiating a payment
 * Used by all payment providers (Stripe, Redsys, PayPal, etc.)
 */
export interface PaymentInitParams {
  amount: number;
  currency: string;
  cartItems: any[];
  shippingAddress?: any;
  orderId?: string;
  // payment intent: 'preauth' (default) or 'sale'
  intent?: 'preauth' | 'sale';
  // transaction ID from the purchases/checkout call
  transactionId?: string;
}

/**
 * Result returned after payment processing
 * Used by all payment providers
 */
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  provider: string;
  testMode?: boolean;
}

/**
 * Payment Provider Configuration
 * Generic configuration interface for all providers
 */
export interface PaymentProviderConfig {
  testMode?: boolean;
  [key: string]: any;
}
