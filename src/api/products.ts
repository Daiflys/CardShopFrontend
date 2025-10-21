// src/api/products.ts
import { Product } from './types.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const realGetProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error("Error fetching products");
  return response.json();
};

export const getProducts = realGetProducts;
