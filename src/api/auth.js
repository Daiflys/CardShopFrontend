// src/api/auth.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- MOCKS ---
const mockLogin = async (email, password) => {
  await new Promise(res => setTimeout(res, 1000));
  if (email === "test@test.com" && password === "1234") {
    return { success: true, token: "mock-token" };
  } else {
    throw new Error("Incorrect credentials (mock)");
  }
};

const mockRegister = async (username, email, password) => {
  await new Promise(res => setTimeout(res, 1000));
  if (email === "test@test.com") {
    throw new Error("Email is already registered (mock)");
  }
  return { success: true };
};

// --- REAL ---
const realLogin = async (email, password) => {
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

const realRegister = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email , password }),
  });
  if (!response.ok) throw new Error(await response.text());
  const token = await response.text();
  localStorage.setItem("authToken", token);
  return response;
};

const validateToken = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
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
const oauthLogin = async (provider, token, userData) => {
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