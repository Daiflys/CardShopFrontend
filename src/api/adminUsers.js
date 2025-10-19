// src/api/adminUsers.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get all users (admin only)
 * @returns {Promise<Array>} Array of UserDTO objects
 */
export const getAllUsers = async () => {
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
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get a specific user by ID (admin only)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} UserDTO object
 */
export const getUserById = async (userId) => {
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
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Update user role (admin only)
 * @param {number} userId - User ID
 * @param {string} role - New role ("ROLE_USER" or "ROLE_ADMIN")
 * @returns {Promise<Object>} Updated UserDTO object
 */
export const updateUserRole = async (userId, role) => {
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
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get admin statistics (admin only)
 * @returns {Promise<Object>} AdminStats object
 */
export const getAdminStats = async () => {
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
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};
