// src/utils/auditActions.js

/**
 * Audit action types and their display information
 */
export const AUDIT_ACTIONS = {
  USER_LOGIN: {
    value: 'USER_LOGIN',
    label: 'User Login',
    description: 'User successfully logged in',
    color: '#4caf50', // green
    category: 'Authentication'
  },
  USER_LOGIN_FAILED: {
    value: 'USER_LOGIN_FAILED',
    label: 'Login Failed',
    description: 'User login attempt failed',
    color: '#f44336', // red
    category: 'Authentication'
  },
  USER_SIGNUP: {
    value: 'USER_SIGNUP',
    label: 'User Signup',
    description: 'New user account created',
    color: '#2196f3', // blue
    category: 'Authentication'
  },
  USER_SIGNUP_FAILED: {
    value: 'USER_SIGNUP_FAILED',
    label: 'Signup Failed',
    description: 'User signup attempt failed',
    color: '#f44336', // red
    category: 'Authentication'
  },
  PRICE_UPDATED: {
    value: 'PRICE_UPDATED',
    label: 'Price Updated',
    description: 'Card price was updated',
    color: '#ff9800', // orange
    category: 'Inventory'
  },
  PRICE_UPDATE_FAILED: {
    value: 'PRICE_UPDATE_FAILED',
    label: 'Price Update Failed',
    description: 'Card price update failed',
    color: '#f44336', // red
    category: 'Inventory'
  },
  USER_ROLE_CHANGED: {
    value: 'USER_ROLE_CHANGED',
    label: 'Role Changed',
    description: 'User role was modified',
    color: '#9c27b0', // purple
    category: 'User Management'
  },
  PURCHASE_CREATED: {
    value: 'PURCHASE_CREATED',
    label: 'Purchase Created',
    description: 'New purchase was completed',
    color: '#4caf50', // green
    category: 'Sales'
  },
  PURCHASE_FAILED: {
    value: 'PURCHASE_FAILED',
    label: 'Purchase Failed',
    description: 'Purchase attempt failed',
    color: '#f44336', // red
    category: 'Sales'
  },
  CARD_CREATED: {
    value: 'CARD_CREATED',
    label: 'Card Created',
    description: 'New card added to inventory',
    color: '#00bcd4', // cyan
    category: 'Inventory'
  },
  BULK_CARDS_CREATED: {
    value: 'BULK_CARDS_CREATED',
    label: 'Bulk Cards Created',
    description: 'Multiple cards added via bulk upload',
    color: '#00bcd4', // cyan
    category: 'Inventory'
  }
};

/**
 * Get all audit action types as array
 */
export const getAllAuditActions = () => {
  return Object.values(AUDIT_ACTIONS);
};

/**
 * Get audit action info by value
 * @param {string} actionValue - The action value (e.g., "USER_LOGIN")
 * @returns {Object|null} Action info object or null if not found
 */
export const getAuditActionInfo = (actionValue) => {
  return AUDIT_ACTIONS[actionValue] || null;
};

/**
 * Get audit action label by value
 * @param {string} actionValue - The action value
 * @returns {string} Action label or the original value if not found
 */
export const getAuditActionLabel = (actionValue) => {
  const action = AUDIT_ACTIONS[actionValue];
  return action ? action.label : actionValue;
};

/**
 * Get audit action color by value
 * @param {string} actionValue - The action value
 * @returns {string} Action color or default gray
 */
export const getAuditActionColor = (actionValue) => {
  const action = AUDIT_ACTIONS[actionValue];
  return action ? action.color : '#757575'; // gray
};

/**
 * Get unique categories from audit actions
 * @returns {Array} Array of unique categories
 */
export const getAuditCategories = () => {
  const categories = new Set();
  Object.values(AUDIT_ACTIONS).forEach(action => {
    categories.add(action.category);
  });
  return Array.from(categories).sort();
};

/**
 * Get audit actions by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of actions in the category
 */
export const getAuditActionsByCategory = (category) => {
  return Object.values(AUDIT_ACTIONS).filter(action => action.category === category);
};

/**
 * Entity types for audit logs
 */
export const ENTITY_TYPES = {
  USER: 'User',
  CARD_TO_SELL: 'CardToSell',
  PURCHASE: 'Purchase'
};

/**
 * Result types for audit logs
 */
export const RESULT_TYPES = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

/**
 * Get result color
 * @param {string} result - Result value
 * @returns {string} Color for the result
 */
export const getResultColor = (result) => {
  switch (result) {
    case RESULT_TYPES.SUCCESS:
      return '#4caf50'; // green
    case RESULT_TYPES.FAILED:
      return '#f44336'; // red
    default:
      return '#757575'; // gray
  }
};
