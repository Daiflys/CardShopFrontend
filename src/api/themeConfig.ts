const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface ThemeConfig {
  id?: number;
  userId?: number;
  name: string;
  description?: string;
  isPublic?: boolean;
  isActive?: boolean;
  configJson: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateThemeRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  configJson: string;
}

export interface UpdateThemeRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
  configJson?: string;
}

// Mock data for development
const mockThemes: ThemeConfig[] = [];

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Get all themes for current user (includes user's themes + public themes)
export const getUserThemes = async (): Promise<ThemeConfig[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mockThemes);
  }

  const response = await fetch(`${API_BASE_URL}/theme-configs`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch themes');
  }

  return response.json();
};

// Get active theme for current user
export const getActiveTheme = async (): Promise<ThemeConfig> => {
  if (USE_MOCK) {
    const activeTheme = mockThemes.find(t => t.isActive);
    if (!activeTheme) {
      throw new Error('No active theme found');
    }
    return Promise.resolve(activeTheme);
  }

  const response = await fetch(`${API_BASE_URL}/theme-configs/active`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch active theme');
  }

  return response.json();
};

// Get theme by ID
export const getThemeById = async (id: number): Promise<ThemeConfig> => {
  if (USE_MOCK) {
    const theme = mockThemes.find(t => t.id === id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    return Promise.resolve(theme);
  }

  const response = await fetch(`${API_BASE_URL}/theme-configs/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch theme');
  }

  return response.json();
};

// Create new theme
export const createTheme = async (request: CreateThemeRequest): Promise<ThemeConfig> => {
  if (USE_MOCK) {
    const newTheme: ThemeConfig = {
      ...request,
      id: mockThemes.length + 1,
      userId: 1,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockThemes.push(newTheme);
    return Promise.resolve(newTheme);
  }

  const response = await fetch(`${API_BASE_URL}/theme-configs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to create theme');
  }

  return response.json();
};

// Update existing theme
export const updateTheme = async (
  id: number,
  request: UpdateThemeRequest
): Promise<ThemeConfig> => {
  if (USE_MOCK) {
    const themeIndex = mockThemes.findIndex(t => t.id === id);
    if (themeIndex === -1) {
      throw new Error('Theme not found');
    }
    mockThemes[themeIndex] = {
      ...mockThemes[themeIndex],
      ...request,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(mockThemes[themeIndex]);
  }

  const response = await fetch(`${API_BASE_URL}/theme-configs/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to update theme');
  }

  return response.json();
};

// Delete theme
export const deleteTheme = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    const themeIndex = mockThemes.findIndex(t => t.id === id);
    if (themeIndex !== -1) {
      mockThemes.splice(themeIndex, 1);
    }
    return Promise.resolve();
  }

  const response = await fetch(`${API_BASE_URL}/theme-configs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete theme');
  }
};

// Activate theme
export const activateTheme = async (id: number): Promise<ThemeConfig> => {
  if (USE_MOCK) {
    // Deactivate all themes
    mockThemes.forEach(t => (t.isActive = false));

    // Activate selected theme
    const theme = mockThemes.find(t => t.id === id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    theme.isActive = true;
    return Promise.resolve(theme);
  }

  const response = await fetch(`${API_BASE_URL}/theme-configs/${id}/activate`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to activate theme');
  }

  return response.json();
};
