/**
 * Stripe Payment Modal
 * Self-contained payment UI for Stripe
 * This component is completely independent from other payment providers
 */

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from '../design/components/Button';

// Initialize Stripe outside component to avoid recreating
const getStripePromise = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.error('[Stripe] Missing VITE_STRIPE_PUBLISHABLE_KEY in environment');
    return null;
  }
  return loadStripe(publishableKey);
};

/**
 * Card form component with Stripe Elements
 */
const StripeCardForm = ({ clientSecret, amount, onSuccess, onError, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded yet. Please try again.');
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      const cardElement = elements.getElement(CardElement);

      console.log('[Stripe] Confirming card payment...');
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('[Stripe] Payment failed:', error);
        setErrorMessage(error.message || 'Payment failed');
        onError?.(error);
      } else {
        console.log('[Stripe] Payment successful:', paymentIntent);
        // Payment succeeded - status should be 'requires_capture' for preauth
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      console.error('[Stripe] Unexpected error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred');
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card details
        </label>
        <div className="border rounded-md p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={processing}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="success"
          type="submit"
          loading={processing}
          disabled={processing || !stripe}
        >
          {processing ? 'Processing...' : `Pay €${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

/**
 * Main modal component
 */
const StripePaymentModal = ({ clientSecret, amount, orderId, onSuccess, onError, onClose }) => {
  const stripePromise = getStripePromise();

  if (!stripePromise) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration Error</h2>
          <p className="text-red-600 mb-4">
            Stripe is not properly configured. Please contact support.
          </p>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          {orderId && (
            <p className="text-sm text-gray-500 mt-1">Order: {orderId}</p>
          )}
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Amount to pay:</span>
            <span className="text-lg font-bold text-gray-900">€{amount.toFixed(2)}</span>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <StripeCardForm
            clientSecret={clientSecret}
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
            onClose={onClose}
          />
        </Elements>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
