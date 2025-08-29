import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/auth";
import GoogleSignInSafe from "../components/GoogleSignInSafe";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
    <div className="px-6 py-8">
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Log in</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-700 text-white font-bold px-4 py-2 rounded hover:bg-blue-800 transition"
            disabled={loading || oauthLoading}
          >
            {loading ? "Signing in..." : "Sign in"}
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