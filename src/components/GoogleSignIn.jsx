import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderGoogleSignInButton, decodeJWTToken } from '../utils/oauth';
import { oauthLogin } from '../api/auth';
import { OAUTH_PROVIDERS } from '../config/oauth';

const GoogleSignIn = ({ onError, onLoading }) => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    let mounted = true;
    
    const initializeGoogleButton = async () => {
      if (buttonRef.current && mounted) {
        try {
          // Clear any existing content first
          buttonRef.current.innerHTML = '';
          
          await renderGoogleSignInButton(buttonRef.current.id)
            .then(async (response) => {
              if (response.credential && mounted) {
                await handleGoogleSignIn(response.credential);
              }
            })
            .catch((error) => {
              console.error('Google Sign-In error:', error);
              // Don't show error immediately, Google might not be loaded yet
            });
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
          // Don't show error immediately, Google might not be loaded yet
        }
      }
    };

    const timer = setTimeout(initializeGoogleButton, 500);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
      // Clean up Google button elements to prevent DOM conflicts
      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
      }
    };
  }, [handleGoogleSignIn]);

  return (
    <div className="w-full">
      <div
        ref={buttonRef}
        id="google-signin-button"
        className="w-full flex justify-center"
        style={{ minHeight: '40px' }}
      >
        {!isLoading && (
          <div className="w-full border border-gray-300 rounded px-4 py-2 text-center text-sm text-gray-500">
            Loading Google Sign-In...
          </div>
        )}
      </div>
      {isLoading && (
        <div className="text-center text-sm text-gray-600 mt-2">
          Signing in with Google...
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn;