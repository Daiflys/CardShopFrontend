// src/authProviders/shopify/ShopifyLoginButton.tsx
// UI component for Shopify login

import { useState } from 'react';
import type { AuthButtonProps } from '../types';
import { ShopifyAuthProvider } from './ShopifyAuthProvider';
import { AUTH_PROVIDERS_CONFIG } from '../../config/authProviders.config';

/**
 * Shopify Login Button Component
 *
 * Displays a button that opens a modal for Shopify authentication.
 * Uses the ShopifyAuthProvider to handle authentication.
 */
export default function ShopifyLoginButton({
  onSuccess,
  onError,
  disabled = false,
  className = '',
}: AuthButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize provider
  const provider = new ShopifyAuthProvider(AUTH_PROVIDERS_CONFIG.shopify);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await provider.login({ email, password });

      if (response.success) {
        setShowModal(false);
        onSuccess?.(response);
      } else {
        setError(response.error || 'Login failed');
        onError?.(new Error(response.error || 'Login failed'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <>
      {/* Shopify Login Button */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-center gap-3 px-4 py-3
          border border-gray-300 rounded-lg
          hover:bg-gray-50 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {/* Shopify Icon */}
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.337 2.126c-.106-.06-.227-.053-.293-.04-.066.014-1.694.36-1.694.36s-1.134-1.134-1.267-1.267c-.133-.133-.4-.093-.506-.067l-.467.134C10.984.933 10.704.6 10.25.6c-1.52 0-2.253 1.907-2.48 2.88-.64.2-1.094.347-1.147.36-.333.107-.346.12-.387.44-.04.253-1.067 8.24-1.067 8.24L12.64 14l4.734-1.04S15.43 2.186 15.337 2.126zm-1.934.787c-.373.12-.787.24-1.227.373V2.96c0-.44-.067-.8-.187-1.08.6.107 1.013.573 1.414 1.033zM12.427 1.8c.12.28.187.68.187 1.2v.213c-.44.134-.92.294-1.414.454.227-.88.64-1.32 1.227-1.867zm-.734-.573c.12 0 .227.026.333.08-.666.6-1.12 1.453-1.333 2.746-.4.12-.8.253-1.173.373.253-1.333.96-3.2 2.173-3.2z"
            fill="#95BF47"
          />
          <path
            d="M15.337 2.126c-.106-.06-.227-.053-.293-.04-.066.014-1.694.36-1.694.36s-1.134-1.134-1.267-1.267c-.04-.04-.093-.066-.147-.08L12.64 14l4.734-1.04S15.43 2.186 15.337 2.126z"
            fill="#5E8E3E"
          />
          <path
            d="M10.25 5.68l-.626 1.88s-.56-.267-1.24-.267c-1 0-1.054.627-1.054.787 0 .853 2.214 1.186 2.214 3.2 0 1.586-1 2.6-2.36 2.6-1.627 0-2.454-1.013-2.454-1.013l.44-1.44s.84.733 1.547.733c.466 0 .653-.36.653-.626 0-1.094-1.813-1.147-1.813-3.014 0-1.547 1.107-3.04 3.347-3.04.866 0 1.293.2 1.293.2z"
            fill="#FFF"
          />
        </svg>
        <span className="font-medium text-gray-700">Continue with Shopify</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.337 2.126c-.106-.06-.227-.053-.293-.04-.066.014-1.694.36-1.694.36s-1.134-1.134-1.267-1.267c-.133-.133-.4-.093-.506-.067l-.467.134C10.984.933 10.704.6 10.25.6c-1.52 0-2.253 1.907-2.48 2.88-.64.2-1.094.347-1.147.36-.333.107-.346.12-.387.44-.04.253-1.067 8.24-1.067 8.24L12.64 14l4.734-1.04S15.43 2.186 15.337 2.126zm-1.934.787c-.373.12-.787.24-1.227.373V2.96c0-.44-.067-.8-.187-1.08.6.107 1.013.573 1.414 1.033zM12.427 1.8c.12.28.187.68.187 1.2v.213c-.44.134-.92.294-1.414.454.227-.88.64-1.32 1.227-1.867zm-.734-.573c.12 0 .227.026.333.08-.666.6-1.12 1.453-1.333 2.746-.4.12-.8.253-1.173.373.253-1.333.96-3.2 2.173-3.2z"
                    fill="#95BF47"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">
                  Sign in with Shopify
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="shopify-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="shopify-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="your-email@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="shopify-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="shopify-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Info */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              Use your Shopify customer account credentials
            </p>
          </div>
        </div>
      )}
    </>
  );
}
