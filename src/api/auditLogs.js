// src/api/auditLogs.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get recent audit logs with pagination
 * @param {number} page - Page number (default 0)
 * @param {number} size - Page size (default 50)
 * @returns {Promise} Response with audit logs array
 */
export const getRecentAuditLogs = async (page = 0, size = 50) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/audit/recent?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch audit logs with status ${response.status}`;

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
 * Get audit logs by username
 * @param {string} username - Username to filter by
 * @param {number} page - Page number (default 0)
 * @param {number} size - Page size (default 20)
 * @returns {Promise} Response with audit logs array
 */
export const getAuditLogsByUser = async (username, page = 0, size = 20) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/audit/user/${encodeURIComponent(username)}?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch user audit logs with status ${response.status}`;

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
 * Get audit logs by action type
 * @param {string} action - Action type to filter by
 * @param {number} page - Page number (default 0)
 * @param {number} size - Page size (default 20)
 * @returns {Promise} Response with audit logs array
 */
export const getAuditLogsByAction = async (action, page = 0, size = 20) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/audit/action/${encodeURIComponent(action)}?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch action audit logs with status ${response.status}`;

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
 * Get audit logs by entity
 * @param {string} entityType - Entity type (e.g., "User", "CardToSell", "Purchase")
 * @param {number} entityId - Entity ID
 * @returns {Promise} Response with audit logs array
 */
export const getAuditLogsByEntity = async (entityType, entityId) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/audit/entity/${encodeURIComponent(entityType)}/${entityId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch entity audit logs with status ${response.status}`;

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
 * Get audit logs by date range
 * @param {string} start - Start datetime (ISO format)
 * @param {string} end - End datetime (ISO format)
 * @returns {Promise} Response with audit logs array
 */
export const getAuditLogsByRange = async (start, end) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/audit/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch audit logs by range with status ${response.status}`;

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
 * Get audit logs by user and date range
 * @param {string} username - Username to filter by
 * @param {string} start - Start datetime (ISO format)
 * @param {string} end - End datetime (ISO format)
 * @returns {Promise} Response with audit logs array
 */
export const getAuditLogsByUserAndRange = async (username, start, end) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/audit/user/${encodeURIComponent(username)}/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch user audit logs by range with status ${response.status}`;

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
