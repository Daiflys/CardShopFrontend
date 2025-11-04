// Payment providers registry
import type { PaymentInitParams, PaymentResult } from './provider-redsys';
import { redsysProviderFromEnv } from './provider-redsys';

export interface PaymentProvider {
  key: string;
  label: string;
  logoUrl?: string;
  isTest?: boolean;
  behavior?: 'local' | 'redirect';
  pay: (params: PaymentInitParams) => Promise<PaymentResult>;
}

const providers: PaymentProvider[] = [
  redsysProviderFromEnv(),
  // Future: add paypal, stripe, etc.
];

export const getPaymentProviders = (): PaymentProvider[] => providers;

export const getPaymentProviderByKey = (key: string): PaymentProvider | undefined =>
  providers.find((p) => p.key === key);
