// src/api/addresses.ts
import type { Address, AddressCreateRequest, AddressUpdateRequest } from './types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// --- MOCK DATA ---
let mockAddresses: Address[] = [];
let nextMockId = 1;

const mockGetAddresses = async (): Promise<Address[]> => {
  await new Promise(res => setTimeout(res, 300));
  return [...mockAddresses];
};

const mockGetAddress = async (id: number): Promise<Address> => {
  await new Promise(res => setTimeout(res, 200));
  const address = mockAddresses.find(addr => addr.id === id);
  if (!address) {
    throw new Error('Address not found');
  }
  return address;
};

const mockCreateAddress = async (data: AddressCreateRequest): Promise<Address> => {
  await new Promise(res => setTimeout(res, 300));

  // Check max 5 addresses limit
  if (mockAddresses.length >= 5) {
    throw new Error('Maximum 5 addresses allowed per user');
  }

  const now = new Date().toISOString();
  const isFirstAddress = mockAddresses.length === 0;

  const newAddress: Address = {
    id: nextMockId++,
    userId: 1, // Mock user ID
    recipientName: data.recipientName,
    street: data.street,
    additionalInfo: data.additionalInfo || null,
    city: data.city,
    state: data.state || null,
    postalCode: data.postalCode,
    country: data.country,
    phone: data.phone || null,
    isPrimary: isFirstAddress, // First address is automatically primary
    createdAt: now,
    updatedAt: now,
  };

  mockAddresses.push(newAddress);
  return newAddress;
};

const mockUpdateAddress = async (id: number, data: AddressUpdateRequest): Promise<Address> => {
  await new Promise(res => setTimeout(res, 300));

  const address = mockAddresses.find(addr => addr.id === id);
  if (!address) {
    throw new Error('Address not found');
  }

  const updatedAddress: Address = {
    ...address,
    recipientName: data.recipientName,
    street: data.street,
    additionalInfo: data.additionalInfo || null,
    city: data.city,
    state: data.state || null,
    postalCode: data.postalCode,
    country: data.country,
    phone: data.phone || null,
    updatedAt: new Date().toISOString(),
  };

  mockAddresses = mockAddresses.map(addr => addr.id === id ? updatedAddress : addr);
  return updatedAddress;
};

const mockDeleteAddress = async (id: number): Promise<void> => {
  await new Promise(res => setTimeout(res, 200));

  const address = mockAddresses.find(addr => addr.id === id);
  if (!address) {
    throw new Error('Address not found');
  }

  mockAddresses = mockAddresses.filter(addr => addr.id !== id);
};

const mockSetPrimaryAddress = async (id: number): Promise<Address> => {
  await new Promise(res => setTimeout(res, 300));

  const address = mockAddresses.find(addr => addr.id === id);
  if (!address) {
    throw new Error('Address not found');
  }

  // Unmark all other addresses as primary
  mockAddresses = mockAddresses.map(addr => ({
    ...addr,
    isPrimary: addr.id === id,
    updatedAt: addr.id === id ? new Date().toISOString() : addr.updatedAt,
  }));

  return mockAddresses.find(addr => addr.id === id)!;
};

const mockGetPrimaryAddress = async (): Promise<Address | null> => {
  await new Promise(res => setTimeout(res, 200));
  const primary = mockAddresses.find(addr => addr.isPrimary);
  return primary || null;
};

// --- REAL API ---
const realGetAddresses = async (): Promise<Address[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/addresses`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error fetching addresses");
  }

  return response.json() as Promise<Address[]>;
};

const realGetAddress = async (id: number): Promise<Address> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Address not found");
    }
    throw new Error("Error fetching address");
  }

  return response.json() as Promise<Address>;
};

const realCreateAddress = async (data: AddressCreateRequest): Promise<Address> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.error || "Validation error");
    }
    throw new Error("Error creating address");
  }

  return response.json() as Promise<Address>;
};

const realUpdateAddress = async (id: number, data: AddressUpdateRequest): Promise<Address> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Address not found");
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.error || "Validation error");
    }
    throw new Error("Error updating address");
  }

  return response.json() as Promise<Address>;
};

const realDeleteAddress = async (id: number): Promise<void> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Address not found");
    }
    throw new Error("Error deleting address");
  }
};

const realSetPrimaryAddress = async (id: number): Promise<Address> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}/set-primary`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Address not found");
    }
    throw new Error("Error setting primary address");
  }

  return response.json() as Promise<Address>;
};

const realGetPrimaryAddress = async (): Promise<Address | null> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/addresses/primary`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Error fetching primary address");
  }

  return response.json() as Promise<Address>;
};

// Export functions
export const getAddresses = USE_MOCK ? mockGetAddresses : realGetAddresses;
export const getAddress = USE_MOCK ? mockGetAddress : realGetAddress;
export const createAddress = USE_MOCK ? mockCreateAddress : realCreateAddress;
export const updateAddress = USE_MOCK ? mockUpdateAddress : realUpdateAddress;
export const deleteAddress = USE_MOCK ? mockDeleteAddress : realDeleteAddress;
export const setPrimaryAddress = USE_MOCK ? mockSetPrimaryAddress : realSetPrimaryAddress;
export const getPrimaryAddress = USE_MOCK ? mockGetPrimaryAddress : realGetPrimaryAddress;
