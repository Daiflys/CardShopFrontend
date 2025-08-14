import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccess("Login successful! Redirecting...");
        
        // Store user info in localStorage
        if (result.user) {
          localStorage.setItem("userEmail", result.user.email);
          if (result.user.username) {
            localStorage.setItem("userName", result.user.username);
          }
        }
        
        // Notify Header to update user info
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Log in</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center border border-green-200">
            {success}
          </div>
        )}
        
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
            className="bg-blue-700 text-white font-bold px-4 py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-700 hover:underline font-semibold">Sign up</Link>
        </div>
        
        {/* Show test credentials for mock mode */}
        {import.meta.env.VITE_USE_MOCK === "true" && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
            <p className="font-semibold mb-1">Test credentials:</p>
            <p>Email: test@test.com</p>
            <p>Password: 1234</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 