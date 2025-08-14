// src/api/auth.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- MOCKS ---
const mockLogin = async (email, password) => {
  await new Promise(res => setTimeout(res, 1000));
  if (email === "test@test.com" && password === "1234") {
    return { success: true, token: "mock-token", user: { email, username: "TestUser" } };
  } else {
    throw new Error("Incorrect credentials (mock)");
  }
};

const mockRegister = async (username, email, password) => {
  await new Promise(res => setTimeout(res, 1000));
  if (email === "test@test.com") {
    throw new Error("Email is already registered (mock)");
  }
  return { success: true, token: "mock-token", user: { email, username } };
};

// --- REAL ---
const realLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/loginbyemail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }
  
  const token = await response.text();
  localStorage.setItem("authToken", token);
  
  // Try to decode JWT to get user info
  let userInfo = { email };
  if (token && token.split(".").length === 3) {
    try {
      const payloadBase64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const payloadJson = JSON.parse(atob(payloadBase64));
      userInfo = {
        email: payloadJson.email || email,
        username: payloadJson.username || payloadJson.name || payloadJson.sub
      };
    } catch (error) {
      console.log("Could not decode JWT token:", error);
    }
  }
  
  return { success: true, token, user: userInfo };
};

const realRegister = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email , password }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registration failed");
  }
  
  const token = await response.text();
  localStorage.setItem("authToken", token);
  
  return { success: true, token, user: { email, username } };
};

export const login = realLogin;
export const register = realRegister; 