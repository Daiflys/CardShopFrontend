// src/api/addresses.ts
import type { Address, AddressCreateRequest, AddressUpdateRequest } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const realGetAddresses = async (): Promise<Address[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/addresses`, {
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

  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
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

  const response = await fetch(`${API_BASE_URL}/addresses`, {
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

  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
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

  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
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

  const response = await fetch(`${API_BASE_URL}/addresses/${id}/set-primary`, {
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

  const response = await fetch(`${API_BASE_URL}/addresses/primary`, {
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
export const getAddresses = realGetAddresses;
export const getAddress = realGetAddress;
export const createAddress = realCreateAddress;
export const updateAddress = realUpdateAddress;
export const deleteAddress = realDeleteAddress;
export const setPrimaryAddress = realSetPrimaryAddress;
export const getPrimaryAddress = realGetPrimaryAddress;
