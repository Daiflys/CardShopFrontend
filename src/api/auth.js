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
  const response = await fetch(`${API_BASE_URL}/auth/loginbyemail`, {
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

export const login = realLogin;
export const register = realRegister; 