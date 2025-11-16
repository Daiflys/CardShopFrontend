/**
 * Stripe Payment Provider
 * Modular payment provider for Stripe
 * This provider is completely independent from other payment providers (Redsys, PayPal, etc.)
 */

import { createRoot } from 'react-dom/client';
import React from 'react';
import { createPaymentIntent } from '../api/stripe';
import type { PaymentInitParams, PaymentResult } from './types';

export interface StripeConfig {
  publishableKey?: string;
  testMode?: boolean;
}

/**
 * Stripe Test Provider (simulated for development)
 */
export const stripeTestProvider = {
  key: 'stripe',
  label: 'Credit/Debit Card (Stripe)',
  isTest: true,
  behavior: 'local' as const,
  async pay(params: PaymentInitParams): Promise<PaymentResult> {
    // Simulate slight processing latency
    const delay = Math.random() * 250 + 150;
    await new Promise((r) => setTimeout(r, delay));

    const ts = Date.now();
    const rnd = Math.random().toString(36).slice(2, 10);
    const id = `stripe_test_${ts}_${rnd}`;

    console.log('[Stripe Test] Simulated payment successful:', id);

    return {
      success: true,
      transactionId: id,
      provider: 'stripe',
      testMode: true,
    };
  },
};

/**
 * Stripe Production Provider (uses Stripe API)
 */
export const stripeProductionProvider = {
  key: 'stripe',
  label: 'Credit/Debit Card (Stripe)',
  isTest: false,
  behavior: 'local' as const,
  async pay(params: PaymentInitParams): Promise<PaymentResult> {
    console.log('[Stripe] Starting payment flow...', params);

    try {
      // Step 1: Create PaymentIntent on backend
      console.log('[Stripe] Creating PaymentIntent on backend...');
      const paymentIntent = await createPaymentIntent({
        amount: params.amount,
        currency: params.currency || 'EUR',
        orderId: params.orderId,
        description: 'MTG Card Purchase',
        customerId: undefined, // Could be added if user management is enhanced
      });

      console.log('[Stripe] PaymentIntent created:', {
        orderId: paymentIntent.orderId,
        paymentIntentId: paymentIntent.paymentIntentId,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      });

      // Step 2: Show payment modal and wait for user to complete payment
      console.log('[Stripe] Opening payment modal...');
      const result = await showStripePaymentModal({
        clientSecret: paymentIntent.clientSecret,
        amount: paymentIntent.amount,
        orderId: paymentIntent.orderId,
      });

      console.log('[Stripe] Payment completed:', result);

      return {
        success: true,
        transactionId: paymentIntent.paymentIntentId,
        provider: 'STRIPE',
        testMode: false,
      };
    } catch (error) {
      console.error('[Stripe] Payment failed:', error);
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  },
};

/**
 * Show Stripe payment modal and return a promise that resolves when payment completes
 */
function showStripePaymentModal(options: {
  clientSecret: string;
  amount: number;
  orderId: string;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'stripe-payment-modal-container';
    document.body.appendChild(modalContainer);

    // Create React root
    const root = createRoot(modalContainer);

    // Cleanup function
    const cleanup = () => {
      root.unmount();
      document.body.removeChild(modalContainer);
    };

    // Success handler
    const handleSuccess = (paymentIntent: any) => {
      console.log('[Stripe Modal] Payment successful:', paymentIntent);
      cleanup();
      resolve(paymentIntent);
    };

    // Error handler
    const handleError = (error: any) => {
      console.error('[Stripe Modal] Payment error:', error);
      cleanup();
      reject(error);
    };

    // Close handler (user cancelled)
    const handleClose = () => {
      console.log('[Stripe Modal] User cancelled payment');
      cleanup();
      reject(new Error('Payment cancelled by user'));
    };

    // Dynamically import and render modal
    import('../components/StripePaymentModal.jsx').then((module) => {
      const StripePaymentModal = module.default;

      root.render(
        React.createElement(StripePaymentModal, {
          clientSecret: options.clientSecret,
          amount: options.amount,
          orderId: options.orderId,
          onSuccess: handleSuccess,
          onError: handleError,
          onClose: handleClose,
        })
      );
    }).catch((err) => {
      console.error('[Stripe] Failed to load modal component:', err);
      cleanup();
      reject(new Error('Failed to load payment modal'));
    });
  });
}

export type StripeProvider = typeof stripeTestProvider | typeof stripeProductionProvider;

/**
 * Get Stripe provider based on environment configuration
 */
export const stripeProviderFromEnv = (): StripeProvider => {
  const mode = (import.meta.env.VITE_STRIPE_MODE || 'local').toLowerCase();
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  console.log('[Stripe] Initializing provider in mode:', mode);

  if (mode === 'local' || !publishableKey) {
    console.log('[Stripe] Using test mode (no real API calls)');
    return stripeTestProvider as StripeProvider;
  }

  console.log('[Stripe] Using production mode with Stripe API');
  return stripeProductionProvider as StripeProvider;
};
