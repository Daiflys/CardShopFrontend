// OAuth2 Configuration

export interface GoogleOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface OAuthConfig {
  google: GoogleOAuthConfig;
}

export const OAUTH_CONFIG: OAuthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "740015526985-5o4tkp77soeaqur1kbqbvo837hrq97ar.apps.googleusercontent.com",
    redirectUri: window.location.origin,
    scope: "openid email profile"
  }
};

// OAuth2 Provider Types
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google'
} as const;

export type OAuthProvider = typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS];
