// src/api/auth.ts
import type { LoginResponse, RegisterResponse, OAuthUserData } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const realLogin = async (email: string, password: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    console.log("Response not ok, error: ", response);
  }
  const token = await response.text();
  localStorage.setItem("authToken", token);
  return response;
};

const realRegister = async (username: string, email: string, password: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error(await response.text());
  const token = await response.text();
  localStorage.setItem("authToken", token);
  return response;
};

const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    return false;
  }
};

// OAuth2 Login
const oauthLogin = async (provider: string, token: string, userData?: OAuthUserData): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/auth/${provider}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    console.log("OAuth login response not ok, error: ", response);
    throw new Error("OAuth login failed");
  }

  const authToken = await response.text();
  localStorage.setItem("authToken", authToken);

  // Store user email for header fallback
  if (userData?.email) {
    localStorage.setItem("userEmail", userData.email);
  }

  return response;
};

export const login = realLogin;
export const register = realRegister;
export { oauthLogin, validateToken };
