// OAuth2 Utility Functions
import { OAUTH_CONFIG, OAUTH_PROVIDERS } from '../config/oauth.js';

export const initializeGoogleOAuth = () => {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const checkGoogleLoaded = () => {
      if (window.google?.accounts?.id) {
        resolve();
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };
    
    checkGoogleLoaded();
  });
};

export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    initializeGoogleOAuth().then(() => {
      window.google.accounts.id.initialize({
        client_id: OAUTH_CONFIG.google.clientId,
        callback: (response) => {
          resolve(response);
        },
        error_callback: (error) => {
          reject(error);
        }
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup if One Tap is not available
          renderGoogleSignInButton();
        }
      });
    });
  });
};

export const renderGoogleSignInButton = (elementId = 'google-signin-button') => {
  return new Promise((resolve, reject) => {
    initializeGoogleOAuth().then(() => {
      const element = document.getElementById(elementId);
      if (!element) {
        reject(new Error('Google Sign-In button element not found'));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: OAUTH_CONFIG.google.clientId,
        callback: (response) => {
          resolve(response);
        }
      });

      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: element.offsetWidth
      });
    });
  });
};

export const decodeJWTToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const signOutFromGoogle = () => {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    resolve();
  });
};