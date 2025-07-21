// src/api/auth.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// --- MOCKS ---
const mockLogin = async (email, password) => {
  await new Promise(res => setTimeout(res, 1000));
  if (email === "test@test.com" && password === "1234") {
    return { success: true, token: "mock-token" };
  } else {
    throw new Error("Credenciales incorrectas (mock)");
  }
};

const mockRegister = async (email, password) => {
  await new Promise(res => setTimeout(res, 1000));
  if (email === "test@test.com") {
    throw new Error("El email ya está registrado (mock)");
  }
  return { success: true };
};

// --- REAL ---
const realLogin = async (email, password) => {
  const response = await fetch("https://tu-backend.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Credenciales incorrectas");
  return response.json();
};

const realRegister = async (email, password) => {
  const response = await fetch("https://tu-backend.com/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Error en el registro");
  return response.json();
};

export const login = USE_MOCK ? mockLogin : realLogin;
export const register = USE_MOCK ? mockRegister : realRegister; 