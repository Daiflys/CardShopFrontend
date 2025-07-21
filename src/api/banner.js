// src/api/banner.js
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// --- MOCK ---
const banners = [
  {
    title: "AETHERDRIFT",
    subtitle: "Ramp & Furious",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
  {
    title: "MAGIC X FINAL FANTASY",
    subtitle: "It's the Final (Fantasy) Countdown",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
  {
    title: "MODERN HORIZONS",
    subtitle: "New Horizons Await",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
  {
    title: "LEGENDARY BATTLES",
    subtitle: "Epic Showdowns",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
];

const mockGetBanners = async () => {
  await new Promise(res => setTimeout(res, 200));
  return banners;
};

// --- REAL ---
const realGetBanners = async () => {
  const response = await fetch("https://tu-backend.com/api/banners");
  if (!response.ok) throw new Error("Error al obtener banners");
  return response.json();
};

export const getBanners = USE_MOCK ? mockGetBanners : realGetBanners; 