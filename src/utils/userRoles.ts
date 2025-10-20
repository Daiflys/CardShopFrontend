// src/utils/userRoles.ts

/**
 * User role information structure
 */
export interface RoleInfo {
  value: string;
  label: string;
  description: string;
  color: string;
  icon: string;
}

/**
 * Provider information structure
 */
export interface ProviderInfo {
  value: string;
  label: string;
  description: string;
  color: string;
  icon: string;
}

/**
 * User roles and their display information
 */
export const USER_ROLES: Record<string, RoleInfo> = {
  ROLE_ADMIN: {
    value: 'ROLE_ADMIN',
    label: 'Admin',
    description: 'Administrator with full access',
    color: '#9c27b0', // purple
    icon: 'AdminPanelSettings'
  },
  ROLE_USER: {
    value: 'ROLE_USER',
    label: 'User',
    description: 'Regular user with standard access',
    color: '#2196f3', // blue
    icon: 'Person'
  }
};

/**
 * Provider types for user authentication
 */
export const PROVIDERS: Record<string, ProviderInfo> = {
  LOCAL: {
    value: 'LOCAL',
    label: 'Email',
    description: 'Local email/password authentication',
    color: '#4caf50', // green
    icon: 'Email'
  },
  GOOGLE: {
    value: 'GOOGLE',
    label: 'Google',
    description: 'Google OAuth authentication',
    color: '#ea4335', // Google red
    icon: 'Google'
  }
};

/**
 * Get all user roles as array
 * @returns Array of role objects
 */
export const getAllRoles = (): RoleInfo[] => {
  return Object.values(USER_ROLES);
};

/**
 * Get role info by value
 * @param roleValue - The role value (e.g., "ROLE_ADMIN")
 * @returns Role info object or null if not found
 */
export const getRoleInfo = (roleValue: string): RoleInfo | null => {
  return USER_ROLES[roleValue] || null;
};

/**
 * Get role label by value
 * @param roleValue - The role value
 * @returns Role label or the original value if not found
 */
export const getRoleLabel = (roleValue: string): string => {
  const role = USER_ROLES[roleValue];
  return role ? role.label : roleValue;
};

/**
 * Get role color by value
 * @param roleValue - The role value
 * @returns Role color or default gray
 */
export const getRoleColor = (roleValue: string): string => {
  const role = USER_ROLES[roleValue];
  return role ? role.color : '#757575'; // gray
};

/**
 * Get provider info by value
 * @param providerValue - The provider value (e.g., "LOCAL", "GOOGLE")
 * @returns Provider info object or null if not found
 */
export const getProviderInfo = (providerValue: string): ProviderInfo | null => {
  return PROVIDERS[providerValue] || null;
};

/**
 * Get provider label by value
 * @param providerValue - The provider value
 * @returns Provider label or the original value if not found
 */
export const getProviderLabel = (providerValue: string): string => {
  const provider = PROVIDERS[providerValue];
  return provider ? provider.label : providerValue;
};

/**
 * Get provider color by value
 * @param providerValue - The provider value
 * @returns Provider color or default gray
 */
export const getProviderColor = (providerValue: string): string => {
  const provider = PROVIDERS[providerValue];
  return provider ? provider.color : '#757575'; // gray
};

/**
 * Check if a role is admin
 * @param roleValue - The role value
 * @returns True if role is admin
 */
export const isAdmin = (roleValue: string): boolean => {
  return roleValue === USER_ROLES.ROLE_ADMIN.value;
};

/**
 * Check if a role is regular user
 * @param roleValue - The role value
 * @returns True if role is regular user
 */
export const isRegularUser = (roleValue: string): boolean => {
  return roleValue === USER_ROLES.ROLE_USER.value;
};
