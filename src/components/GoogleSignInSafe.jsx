import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decodeJWTToken } from '../utils/oauth';
import { oauthLogin } from '../api/auth';
import { OAUTH_CONFIG, OAUTH_PROVIDERS } from '../config/oauth';

const GoogleSignInSafe = ({ onError, onLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const containerRef = useRef(null);

  const handleGoogleSignIn = useCallback(async (credential) => {
    setIsLoading(true);
    if (onLoading) onLoading(true);

    try {
      const decodedToken = decodeJWTToken(credential);
      
      if (!decodedToken) {
        throw new Error('Failed to decode Google token');
      }

      const userData = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        sub: decodedToken.sub
      };

      await oauthLogin(OAUTH_PROVIDERS.GOOGLE, credential, userData);

      // Trigger auth change event to update Header
      window.dispatchEvent(new CustomEvent('authChange'));

      // Redirect to intended page or home page
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (error) {
      console.error('OAuth login error:', error);
      if (onError) onError(error.message || 'OAuth login failed');
    } finally {
      setIsLoading(false);
      if (onLoading) onLoading(false);
    }
  }, [navigate, location, onError, onLoading]);

  const initializeGoogle = useCallback(() => {
    if (window.google?.accounts?.id && !googleLoaded) {
      try {
        window.google.accounts.id.initialize({
          client_id: OAUTH_CONFIG.google.clientId,
          callback: (response) => {
            if (response.credential) {
              handleGoogleSignIn(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });
        setGoogleLoaded(true);
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
      }
    }
  }, [handleGoogleSignIn, googleLoaded]);

  useEffect(() => {
    // Check if Google is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    // Wait for Google to load
    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle);
        initializeGoogle();
      }
    }, 100);

    // Cleanup after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkGoogle);
    }, 10000);

    return () => {
      clearInterval(checkGoogle);
      clearTimeout(timeout);
    };
  }, [initializeGoogle]);

  const renderGoogleButton = () => {
    if (!googleLoaded || !containerRef.current) return;
    
    try {
      // Clear container first
      containerRef.current.innerHTML = '';
      
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        width: containerRef.current.offsetWidth || 300,
        text: 'continue_with',
        shape: 'rectangular'
      });
    } catch (error) {
      console.error('Failed to render Google button:', error);
    }
  };

  useEffect(() => {
    if (googleLoaded) {
      // Small delay to ensure container is ready
      setTimeout(renderGoogleButton, 100);
    }
  }, [googleLoaded]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="w-full border border-gray-300 rounded px-4 py-2 text-center text-sm text-gray-600">
          Signing in with Google...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full flex justify-center"
        style={{ minHeight: '40px' }}
      >
        {!googleLoaded && (
          <div className="w-full border border-gray-300 rounded px-4 py-2 text-center text-sm text-gray-500">
            Loading Google Sign-In...
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSignInSafe;