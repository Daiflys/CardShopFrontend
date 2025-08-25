import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = password === repeatPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError("Passwords doesn't match");
      return;
    }
    if (username === "") {
      setError("You must enter a username");
      return;
    }
    if (email === "") {
      setError("You must enter an email");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await register(username, email, password);
      // Store email for header fallback since register also sets token
      localStorage.setItem("userEmail", email);
      
      // Trigger auth change event to update Header
      window.dispatchEvent(new CustomEvent('authChange'));
      
      // Redirect to home page after successful registration
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Create account</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">Registration successful! You can now log in.</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
            type="username"
            placeholder="Username"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Repeat password"
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${repeatPassword && !passwordsMatch ? 'border-red-400' : ''}`}
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
          />
          {!passwordsMatch && repeatPassword && (
            <div className="text-red-600 text-sm -mt-2 mb-2">Passwords do not match</div>
          )}
          <button
            type="submit"
            className="bg-blue-700 text-white font-bold px-4 py-2 rounded hover:bg-blue-800 transition"
            disabled={loading || !passwordsMatch}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 hover:underline font-semibold">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 