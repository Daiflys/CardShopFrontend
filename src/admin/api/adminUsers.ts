// src/admin/api/adminUsers.ts

import type { UserDTO, AdminStats, ErrorResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Get all users (admin only)
 * @returns Array of UserDTO objects
 */
export const getAllUsers = async (): Promise<UserDTO[]> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch users with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as UserDTO[];
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get a specific user by ID (admin only)
 * @param userId - User ID
 * @returns UserDTO object
 */
export const getUserById = async (userId: number): Promise<UserDTO> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch user with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as UserDTO;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Update user role (admin only)
 * @param userId - User ID
 * @param role - New role ("ROLE_USER" or "ROLE_ADMIN")
 * @returns Updated UserDTO object
 */
export const updateUserRole = async (userId: number, role: 'ROLE_USER' | 'ROLE_ADMIN'): Promise<UserDTO> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    // Validate role
    if (role !== 'ROLE_USER' && role !== 'ROLE_ADMIN') {
      throw new Error('Invalid role. Must be ROLE_USER or ROLE_ADMIN.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      let errorMessage = `Failed to update user role with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as UserDTO;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get admin statistics (admin only)
 * @returns AdminStats object
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch admin stats with status ${response.status}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as AdminStats;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};
