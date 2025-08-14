// src/api/auth.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  
  // Store email for header display
  localStorage.setItem("userEmail", email);
  
  // Try to decode JWT to get user info if it's a valid JWT
  let userInfo = { email };
  if (token && token.split(".").length === 3) {
    try {
      const payloadBase64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const payloadJson = JSON.parse(atob(payloadBase64));
      const username = payloadJson.username || payloadJson.name || payloadJson.sub;
      if (username) {
        userInfo.username = username;
        localStorage.setItem("userName", username);
      }
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
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userName", username);
  
  return { success: true, token, user: { email, username } };
};

export const login = realLogin;
export const register = realRegister; 