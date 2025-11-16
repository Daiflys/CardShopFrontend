/**
 * Stripe Payment API
 * Modular API client for Stripe payment endpoints
 * This module is completely independent from other payment providers
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';

/**
 * Payment Status enum matching backend
 */
export type PaymentStatus =
  | 'PENDING'      // PaymentIntent created, awaiting confirmation
  | 'AUTHORIZED'   // Payment preauthorized, ready to capture
  | 'CAPTURED'     // Payment captured successfully
  | 'FAILED'       // Payment rejected/failed
  | 'CANCELLED'    // Payment cancelled/void
  | 'REFUNDED';    // Payment refunded

/**
 * Payment Provider enum
 */
export type PaymentProvider = 'STRIPE' | 'REDSYS';

/**
 * Request to create a PaymentIntent
 */
export interface CreatePaymentIntentRequest {
  amount: number;           // REQUIRED - Amount in EUR (e.g., 45.99)
  currency: string;         // REQUIRED - Currency code (EUR, USD, GBP, etc)
  orderId?: string;         // OPTIONAL - Order ID (backend generates if not provided)
  description?: string;     // OPTIONAL - Payment description
  customerId?: string;      // OPTIONAL - Customer ID for tracking
}

/**
 * Response from creating a PaymentIntent
 */
export interface CreatePaymentIntentResponse {
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paymentIntentId: string;
  clientSecret: string;      // Use this with stripe.confirmCardPayment()
}

/**
 * Response from status/capture/cancel/refund endpoints
 */
export interface PaymentStatusResponse {
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paymentIntentId: string;
  clientSecret: string | null;
}

/**
 * Create a PaymentIntent (preauthorization)
 * POST /api/payments/stripe/create-payment-intent
 */
export async function createPaymentIntent(
  request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE_URL}/payments/stripe/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create payment intent: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Query payment status
 * GET /api/payments/stripe/status?orderId=XXX
 */
export async function getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(
    `${API_BASE_URL}/payments/stripe/status?orderId=${encodeURIComponent(orderId)}`,
    {
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Payment not found: ${orderId}`);
    }
    const errorText = await response.text();
    throw new Error(`Failed to get payment status: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Capture a preauthorized payment (Admin only)
 * POST /api/payments/stripe/capture
 */
export async function capturePayment(
  paymentIntentId: string,
  amount?: number
): Promise<PaymentStatusResponse> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE_URL}/payments/stripe/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      paymentIntentId,
      ...(amount !== undefined ? { amount } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to capture payment: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Cancel a payment
 * POST /api/payments/stripe/cancel?paymentIntentId=XXX
 */
export async function cancelPayment(paymentIntentId: string): Promise<PaymentStatusResponse> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(
    `${API_BASE_URL}/payments/stripe/cancel?paymentIntentId=${encodeURIComponent(paymentIntentId)}`,
    {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to cancel payment: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Refund a payment (full or partial)
 * POST /api/payments/stripe/refund?paymentIntentId=XXX&amount=YYY
 */
export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<PaymentStatusResponse> {
  const token = localStorage.getItem('authToken');

  const params = new URLSearchParams({ paymentIntentId });
  if (amount !== undefined) {
    params.append('amount', amount.toString());
  }

  const response = await fetch(
    `${API_BASE_URL}/payments/stripe/refund?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refund payment: ${response.status} ${errorText}`);
  }

  return await response.json();
}
