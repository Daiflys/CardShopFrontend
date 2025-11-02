import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../api/auth";
import GoogleSignInSafe from "../components/GoogleSignInSafe";
import ExternalAuthButtons from "../components/ExternalAuthButtons";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [oauthLoading, setOauthLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = t('auth.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t('auth.errors.emailInvalid');
    }

    if (!password.trim()) {
      errors.password = t('auth.errors.passwordRequired');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});
    try {
      const result = await login(email, password);
      // If backend returned token in login() and we saved it, also store email for header fallback
      localStorage.setItem("userEmail", email);
      
      // Trigger auth change event to update Header
      window.dispatchEvent(new CustomEvent('authChange'));
      
      // Redirect to intended page or home page
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">{t('auth.loginTitle')}</h2>
        {error && (
          <div
            role="alert"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="sr-only">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              placeholder={t('auth.email')}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 w-full min-h-[44px] ${
                fieldErrors.email
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              required
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              placeholder={t('auth.password')}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 w-full min-h-[44px] ${
                fieldErrors.password
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              required
            />
            {fieldErrors.password && (
              <p id="password-error" role="alert" className="text-red-600 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-700 text-white font-bold px-4 py-3 rounded hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            disabled={loading || oauthLoading}
            aria-describedby={loading ? 'loading-status' : undefined}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? t('auth.signingIn') || "Signing in..." : t('auth.signIn') || "Sign in"}
            {loading && <span id="loading-status" className="sr-only">Loading, please wait</span>}
          </button>
        </form>
        
        <div className="mt-4 mb-4 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <div className="mx-4 text-gray-500 text-sm">or</div>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        <GoogleSignInSafe
          onError={(err) => setError(err)}
          onLoading={setOauthLoading}
        />

        {/* External Auth Providers (Shopify, WordPress, etc.) */}
        <div className="mt-4">
          <ExternalAuthButtons />
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-700 hover:underline font-semibold">Sign up</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 