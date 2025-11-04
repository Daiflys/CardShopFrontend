// src/api/banner.ts
import { Banner } from './types.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const realGetBanners = async (): Promise<Banner[]> => {
  const response = await fetch(`${API_BASE_URL}/banners`);
  if (!response.ok) throw new Error("Error fetching banners");
  return response.json();
};

export const getBanners = realGetBanners;
