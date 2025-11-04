// src/components/ExternalAuthButtons.tsx
// Renders login buttons for all enabled external auth providers

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getActiveAuthProviders,
  type AuthProvider,
  type AuthResponse,
} from '../authProviders';

/**
 * ExternalAuthButtons Component
 *
 * Automatically renders login buttons for all enabled external auth providers.
 * Completely agnostic - doesn't know about Shopify, WordPress, etc.
 * Just reads from the registry and renders whatever is active.
 *
 * Usage:
 * ```tsx
 * <ExternalAuthButtons />
 * ```
 */
export default function ExternalAuthButtons() {
  const [providers, setProviders] = useState<AuthProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Load active providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const activeProviders = await getActiveAuthProviders();
        setProviders(activeProviders);
      } catch (error) {
        console.error('Failed to load auth providers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);

  /**
   * Handle successful authentication from any provider
   */
  const handleAuthSuccess = (response: AuthResponse) => {
    console.log('External auth successful:', response);

    // Get the redirect path from location state, or default to home
    const from = (location.state as any)?.from?.pathname || '/';

    // Navigate to the intended destination
    navigate(from, { replace: true });
  };

  /**
   * Handle authentication error from any provider
   */
  const handleAuthError = (error: Error) => {
    console.error('External auth error:', error);
    // Could show a toast notification here
    alert(`Authentication failed: ${error.message}`);
  };

  // If no providers are enabled, don't render anything
  if (loading) {
    return null; // Or a skeleton loader if you prefer
  }

  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Render all provider buttons */}
      <div className="space-y-3">
        {providers.map((provider) => {
          // Get the button component from the provider
          const ButtonComponent = provider.getButtonComponent();

          return (
            <ButtonComponent
              key={provider.id}
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          );
        })}
      </div>
    </div>
  );
}
