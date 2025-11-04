// src/store/addressStore.ts
import { create } from 'zustand';
import {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
  getPrimaryAddress,
} from '../api/addresses';
import type { Address, AddressCreateRequest, AddressUpdateRequest } from '../api/types';

export interface AddressStore {
  // State
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  error: string;

  // Actions
  loadAddresses: () => Promise<void>;
  loadAddress: (id: number) => Promise<void>;
  addAddress: (data: AddressCreateRequest) => Promise<{ success: boolean; error?: string; address?: Address }>;
  editAddress: (id: number, data: AddressUpdateRequest) => Promise<{ success: boolean; error?: string; address?: Address }>;
  removeAddress: (id: number) => Promise<{ success: boolean; error?: string }>;
  markAsPrimary: (id: number) => Promise<{ success: boolean; error?: string }>;
  loadPrimaryAddress: () => Promise<void>;
  setSelectedAddress: (address: Address | null) => void;
  clearError: () => void;

  // Getters
  getDefaultAddress: () => Address | null;
  canAddMoreAddresses: () => boolean;
  getAddressCount: () => number;
}

const useAddressStore = create<AddressStore>((set, get) => ({
  // State
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: '',

  // Actions
  loadAddresses: async () => {
    try {
      set({ loading: true, error: '' });
      const addresses = await getAddresses();
      set({ addresses, loading: false });
    } catch (err) {
      const token = localStorage.getItem("authToken");
      if (token) {
        set({ error: (err as Error).message, loading: false });
      } else {
        set({ addresses: [], loading: false });
      }
    }
  },

  loadAddress: async (id: number) => {
    try {
      set({ loading: true, error: '' });
      const address = await getAddress(id);
      set({ selectedAddress: address, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addAddress: async (data: AddressCreateRequest) => {
    try {
      set({ loading: true, error: '' });
      const newAddress = await createAddress(data);
      await get().loadAddresses();
      set({ loading: false });
      return { success: true, address: newAddress };
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return { success: false, error: (err as Error).message };
    }
  },

  editAddress: async (id: number, data: AddressUpdateRequest) => {
    try {
      set({ loading: true, error: '' });
      const updatedAddress = await updateAddress(id, data);
      await get().loadAddresses();
      set({ loading: false });
      return { success: true, address: updatedAddress };
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return { success: false, error: (err as Error).message };
    }
  },

  removeAddress: async (id: number) => {
    try {
      set({ loading: true, error: '' });
      await deleteAddress(id);
      await get().loadAddresses();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return { success: false, error: (err as Error).message };
    }
  },

  markAsPrimary: async (id: number) => {
    try {
      set({ loading: true, error: '' });
      await setPrimaryAddress(id);
      await get().loadAddresses();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return { success: false, error: (err as Error).message };
    }
  },

  loadPrimaryAddress: async () => {
    try {
      set({ loading: true, error: '' });
      const primary = await getPrimaryAddress();
      set({ selectedAddress: primary, loading: false });
    } catch (err) {
      const token = localStorage.getItem("authToken");
      if (token) {
        set({ error: (err as Error).message, loading: false });
      } else {
        set({ selectedAddress: null, loading: false });
      }
    }
  },

  setSelectedAddress: (address: Address | null) => {
    set({ selectedAddress: address });
  },

  clearError: () => {
    set({ error: '' });
  },

  // Getters
  getDefaultAddress: () => {
    const { addresses } = get();
    return addresses.find(addr => addr.isPrimary) || null;
  },

  canAddMoreAddresses: () => {
    const { addresses } = get();
    return addresses.length < 5;
  },

  getAddressCount: () => {
    const { addresses } = get();
    return addresses.length;
  },
}));

export default useAddressStore;
