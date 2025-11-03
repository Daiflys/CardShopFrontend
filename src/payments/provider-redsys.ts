// Redsys Test Payment Provider (simulated)
// This provider simulates a successful Redsys card payment in development.

export interface RedsysConfig {
  merchantCode?: string;
  terminal?: string;
  currency?: string; // e.g. '978' for EUR per Redsys, but we use display ISO like 'EUR' for app
  testMode?: boolean;
}

export interface PaymentInitParams {
  amount: number;
  currency: string;
  cartItems: any[];
  shippingAddress?: any;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  provider: string;
  testMode?: boolean;
}

export const redsysTestProvider = {
  key: 'redsys',
  label: 'Credit/Debit Card (Redsys)',
  isTest: true,
  async pay(params: PaymentInitParams): Promise<PaymentResult> {
    // Simulate slight processing latency
    const delay = Math.random() * 250 + 150;
    await new Promise((r) => setTimeout(r, delay));

    const ts = Date.now();
    const rnd = Math.random().toString(36).slice(2, 10);
    const id = `redsys_test_${ts}_${rnd}`;

    return {
      success: true,
      transactionId: id,
      provider: 'redsys',
      testMode: true,
    };
  },
};

export type RedsysProvider = typeof redsysTestProvider;

export const redsysProviderFromEnv = (): RedsysProvider => {
  const mode = (import.meta.env.VITE_REDSYS_MODE || 'local').toLowerCase();
  if (mode === 'local') return redsysTestProvider as RedsysProvider;

  // Placeholder for redirect mode (requires backend signature)
  const redirectProvider: RedsysProvider = {
    key: 'redsys',
    label: 'Credit/Debit Card (Redsys)',
    isTest: true,
    async pay() {
      // This path requires a backend endpoint to initialize Redsys form with signed params
      // Example endpoint (to be implemented): `${VITE_API_BASE_URL}/payments/redsys/init`
      // For now, keep local until backend is wired.
      throw new Error('Redsys redirect mode requires backend. Set VITE_REDSYS_MODE=local for simulated test payments.');
    },
  };
  return redirectProvider;
};
