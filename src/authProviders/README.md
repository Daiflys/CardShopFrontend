# Auth Providers Module

Modular authentication provider system for integrating external authentication services (Shopify, WordPress, etc.).

## 🏗️ Architecture

This is a **plugin-based architecture** where each authentication provider is:
- **Self-contained**: All code for a provider lives in its own directory
- **Configuration-driven**: Enable/disable providers via a single config file
- **Zero-coupling**: The core app doesn't know about specific providers
- **Tree-shakeable**: Disabled providers are not included in the build

## 📁 Directory Structure

```
src/authProviders/
├── index.ts                  # Provider registry (dynamic loading)
├── types.ts                  # Base interfaces all providers implement
├── BaseAuthProvider.ts       # Abstract base class
├── README.md                 # This file
│
├── shopify/                  # Shopify provider module
│   ├── index.ts              # Module exports
│   ├── ShopifyAuthProvider.ts   # Provider implementation
│   ├── ShopifyLoginButton.tsx   # UI component
│   └── types.ts              # Shopify-specific types
│
└── wordpress/                # Future: WordPress provider
    └── ...
```

## 🚀 How to Use

### Enable/Disable Providers

**Single file controls everything**: `src/config/authProviders.config.ts`

```typescript
export const AUTH_PROVIDERS_CONFIG = {
  shopify: {
    enabled: true,  // ← Set to false to completely remove Shopify
    shop: import.meta.env.VITE_SHOPIFY_SHOP,
    storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
  },

  wordpress: {
    enabled: false,  // ← Not active
  },
};
```

### Add Environment Variables

`.env`:
```bash
VITE_SHOPIFY_SHOP=your-shop-name
VITE_SHOPIFY_STOREFRONT_TOKEN=abc123...
```

### Render Login Buttons

```jsx
import ExternalAuthButtons from '../components/ExternalAuthButtons';

function Login() {
  return (
    <div>
      {/* Your regular login form */}

      {/* External providers - auto-renders based on config */}
      <ExternalAuthButtons />
    </div>
  );
}
```

That's it! If Shopify is enabled in config, the button appears. If disabled, nothing renders.

## 🔌 How to Add a New Provider

### Step 1: Create Provider Directory

```bash
mkdir src/authProviders/my-provider
```

### Step 2: Implement the Provider

Create `my-provider/MyProviderAuthProvider.ts`:

```typescript
import { BaseAuthProvider, LoginCredentials, AuthResponse } from '../types';

export class MyProviderAuthProvider extends BaseAuthProvider {
  readonly id = 'my-provider';
  readonly name = 'My Provider';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 1. Authenticate with the external service
    // 2. Get their access token/user data
    // 3. Verify with your backend
    const result = await this.verifyWithBackend(externalToken, userData);
    return result;
  }

  async validate(token: string): Promise<boolean> {
    // Validate token with external service
    return true;
  }

  getButtonComponent() {
    return require('./MyProviderLoginButton').default;
  }
}
```

### Step 3: Create Login Button

Create `my-provider/MyProviderLoginButton.tsx`:

```tsx
import { AuthButtonProps } from '../types';

export default function MyProviderLoginButton({ onSuccess, onError }: AuthButtonProps) {
  return (
    <button onClick={() => {
      // Handle login
    }}>
      Login with My Provider
    </button>
  );
}
```

### Step 4: Export from Module

Create `my-provider/index.ts`:

```typescript
export { MyProviderAuthProvider } from './MyProviderAuthProvider';
export { default as MyProviderLoginButton } from './MyProviderLoginButton';
```

### Step 5: Add to Config

In `src/config/authProviders.config.ts`:

```typescript
export interface AuthProvidersConfig {
  shopify: ShopifyProviderConfig;
  myProvider: MyProviderConfig;  // Add interface
}

export const AUTH_PROVIDERS_CONFIG = {
  shopify: { ... },

  myProvider: {  // Add config
    enabled: true,
    apiKey: import.meta.env.VITE_MY_PROVIDER_API_KEY,
  },
};
```

### Step 6: Register in Registry

In `src/authProviders/index.ts`:

```typescript
async initialize(): Promise<void> {
  // ... existing providers ...

  // Add your provider
  if (AUTH_PROVIDERS_CONFIG.myProvider.enabled) {
    const { MyProviderAuthProvider } = await import('./my-provider');
    const provider = new MyProviderAuthProvider(AUTH_PROVIDERS_CONFIG.myProvider);
    this.providers.push(provider);
  }
}
```

**Done!** Your provider will now appear in the login page automatically.

## 🎯 Key Interfaces

### AuthProvider Interface

All providers must implement:

```typescript
interface AuthProvider {
  readonly id: string;           // Unique ID (e.g., 'shopify')
  readonly name: string;         // Display name (e.g., 'Shopify')
  readonly enabled: boolean;     // Is enabled?

  login(credentials: LoginCredentials): Promise<AuthResponse>;
  validate(token: string): Promise<boolean>;
  getButtonComponent(): ComponentType<AuthButtonProps>;
}
```

### BaseAuthProvider Helper

Extend this class to get common functionality:

```typescript
class MyProvider extends BaseAuthProvider {
  // Automatically get:
  // - this.config (your provider config)
  // - this.enabled (enabled status)
  // - this.verifyWithBackend() (send to backend for JWT)
}
```

## 🔒 Backend Integration

Each provider needs a backend endpoint for verification:

```
POST /api/auth/{provider-id}/verify
Body: { token: string, userData: any }
Response: { token: string (JWT), user: {...} }
```

Example for Shopify:
```
POST /api/auth/shopify/verify
Body: {
  token: "shopify-access-token",
  userData: { id, email, firstName, ... }
}
Response: {
  token: "your-jwt-token",
  user: { id, email, name }
}
```

## 📋 Current Providers

| Provider | Status | File Location |
|----------|--------|---------------|
| Shopify  | ✅ Implemented | `src/authProviders/shopify/` |
| WordPress | ⏳ Planned | - |

## 🧪 Testing

To test a provider without enabling it globally:

```typescript
import { ShopifyAuthProvider } from './authProviders/shopify';

const provider = new ShopifyAuthProvider({
  enabled: true,
  shop: 'test-shop',
  storefrontAccessToken: 'test-token',
});

const result = await provider.login({ email, password });
```

## 🎨 UI Customization

Each provider's button can be customized via props:

```tsx
<ExternalAuthButtons className="custom-class" />
```

Or override in the provider's button component.

## 🚨 Important Notes

1. **Security**: NEVER trust external tokens directly. Always verify with your backend.
2. **Environment Variables**: Use `.env` for credentials, never hardcode.
3. **Error Handling**: All providers should handle errors gracefully.
4. **Loading States**: Button components should show loading states.
5. **Accessibility**: Use proper ARIA labels and keyboard navigation.

## 📚 Examples

### Shopify Provider

See `src/authProviders/shopify/` for a complete example of:
- GraphQL API integration
- Modal-based login form
- Error handling
- Loading states
- Backend verification

This is the reference implementation for new providers.
