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
  orderId?: string;
  // payment intent: 'preauth' (default) or 'sale'
  intent?: 'preauth' | 'sale';
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
  behavior: 'local' as const,
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
    behavior: 'redirect' as const,
    async pay(params: PaymentInitParams) {
      const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';
      const BASE_RETURN_URL = (import.meta.env.VITE_REDSYS_RETURN_URL as string) || `${window.location.origin}/payment/return?provider=redsys`;

      // Use provided orderId or generate one (backend may override/validate)
      const orderId = params.orderId || `ORD${Date.now().toString().slice(-8)}`; // 4-12 chars
      console.log('[Redsys] Using orderId:', orderId);

      // Default to preauthorization intent for delayed capture
      const intent = params.intent || 'preauth';
      // Ensure return URL carries provider and intent for better UX messaging
      const returnUrl = BASE_RETURN_URL.includes('intent=')
        ? BASE_RETURN_URL
        : `${BASE_RETURN_URL}${BASE_RETURN_URL.includes('?') ? '&' : '?'}intent=${encodeURIComponent(intent)}`;

    const token = localStorage.getItem('authToken');
      console.log('[Redsys] Init request →', `${API_BASE_URL}/payments/redsys/init`);
      const initRes = await fetch(`${API_BASE_URL}/payments/redsys/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: params.currency || 'EUR',
          orderId,
          returnUrl,
          intent, // let backend set DS_MERCHANT_TRANSACTIONTYPE accordingly
        }),
      });

      if (!initRes.ok) {
        const txt = await initRes.text();
        console.error('[Redsys] Init failed', initRes.status, txt);
        throw new Error(`Redsys init failed: ${initRes.status} ${txt}`);
      }
      const data = await initRes.json();
      if (!data?.url || !data?.params) throw new Error('Invalid Redsys init response');
      console.log('[Redsys] Init OK → submitting form to', data.url, 'for order', orderId);

      // Build and submit form
      const form = document.createElement('form');
      form.method = data.method || 'POST';
      form.action = data.url;
      Object.entries(data.params).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      console.log('[Redsys] Submitting redirect form with fields:', Object.keys(data.params));
      form.submit();

      // Return a never-resolving promise to prevent caller from continuing
      return new Promise<PaymentResult>(() => {});
    },
  };
  return redirectProvider;
};
