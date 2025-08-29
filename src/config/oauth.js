// OAuth2 Configuration
export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "740015526985-5o4tkp77soeaqur1kbqbvo837hrq97ar.apps.googleusercontent.com",
    redirectUri: window.location.origin,
    scope: "openid email profile"
  }
};

// OAuth2 Provider Types
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google'
};