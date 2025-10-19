// src/admin/api/auditLogs.ts

import type { AuditLogDTO, PageResponse, ErrorResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Get recent audit logs with pagination
 * @param page - Page number (default 0)
 * @param size - Page size (default 50)
 * @returns Response with audit logs array
 */
export const getRecentAuditLogs = async (page: number = 0, size: number = 50): Promise<PageResponse<AuditLogDTO>> => {
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
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as PageResponse<AuditLogDTO>;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get audit logs by username
 * @param username - Username to filter by
 * @param page - Page number (default 0)
 * @param size - Page size (default 20)
 * @returns Response with audit logs array
 */
export const getAuditLogsByUser = async (username: string, page: number = 0, size: number = 20): Promise<PageResponse<AuditLogDTO>> => {
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
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as PageResponse<AuditLogDTO>;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get audit logs by action type
 * @param action - Action type to filter by
 * @param page - Page number (default 0)
 * @param size - Page size (default 20)
 * @returns Response with audit logs array
 */
export const getAuditLogsByAction = async (action: string, page: number = 0, size: number = 20): Promise<PageResponse<AuditLogDTO>> => {
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
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as PageResponse<AuditLogDTO>;
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get audit logs by entity
 * @param entityType - Entity type (e.g., "User", "CardToSell", "Purchase")
 * @param entityId - Entity ID
 * @returns Response with audit logs array
 */
export const getAuditLogsByEntity = async (entityType: string, entityId: number): Promise<AuditLogDTO[]> => {
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
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as AuditLogDTO[];
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get audit logs by date range
 * @param start - Start datetime (ISO format)
 * @param end - End datetime (ISO format)
 * @returns Response with audit logs array
 */
export const getAuditLogsByRange = async (start: string, end: string): Promise<AuditLogDTO[]> => {
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
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as AuditLogDTO[];
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

/**
 * Get audit logs by user and date range
 * @param username - Username to filter by
 * @param start - Start datetime (ISO format)
 * @param end - End datetime (ISO format)
 * @returns Response with audit logs array
 */
export const getAuditLogsByUserAndRange = async (username: string, start: string, end: string): Promise<AuditLogDTO[]> => {
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
          const errorData = await response.json() as ErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON:', jsonError);
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as AuditLogDTO[];
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }

    throw error;
  }
};
