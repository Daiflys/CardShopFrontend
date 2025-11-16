// Payment providers registry
import type { PaymentInitParams, PaymentResult } from './types';
import { redsysProviderFromEnv } from './provider-redsys';
import { stripeProviderFromEnv } from './provider-stripe';

export interface PaymentProvider {
  key: string;
  label: string;
  logoUrl?: string;
  isTest?: boolean;
  behavior?: 'local' | 'redirect';
  pay: (params: PaymentInitParams) => Promise<PaymentResult>;
}

/**
 * Active payment providers
 * Each provider is completely independent and modular
 * Providers can be easily enabled/disabled by commenting out the lines below
 */
const providers: PaymentProvider[] = [
  //redsysProviderFromEnv(),  // Redsys payment provider
  stripeProviderFromEnv(),  // Stripe payment provider
  // Future: add paypal, mercadopago, etc.
];

export const getPaymentProviders = (): PaymentProvider[] => providers;

export const getPaymentProviderByKey = (key: string): PaymentProvider | undefined =>
  providers.find((p) => p.key === key);
