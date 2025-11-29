// Card finish options utility - centralized definition
// Handles transformation between UI display, internal values, and server enum values

export interface FinishOption {
  code: string;        // Internal value used in state (lowercase)
  name: string;        // Display name shown to user
  serverValue: string; // Value sent to backend (uppercase enum)
  icon: string;        // Emoji icon for display
}

export const finishOptions: FinishOption[] = [
  { code: "nonfoil", name: "Normal", serverValue: "NONFOIL", icon: "" },
  { code: "foil", name: "Foil", serverValue: "FOIL", icon: "⭐" },
  { code: "etched", name: "Etched", serverValue: "ETCHED", icon: "⚡" }
];

/**
 * Get the display name for a finish code
 * @param finishCode - Internal finish code (e.g., "nonfoil")
 * @returns Display name (e.g., "Normal")
 */
export const getFinishName = (finishCode: string): string => {
  const finish = finishOptions.find(opt => opt.code === finishCode);
  return finish ? finish.name : 'Unknown';
};

/**
 * Get the server enum value for a finish code
 * @param finishCode - Internal finish code (e.g., "nonfoil")
 * @returns Server enum value (e.g., "NONFOIL")
 */
export const getFinishServerValue = (finishCode: string): string => {
  const finish = finishOptions.find(opt => opt.code === finishCode);
  return finish ? finish.serverValue : 'NONFOIL';
};

/**
 * Get the icon emoji for a finish code
 * @param finishCode - Internal finish code (e.g., "foil")
 * @returns Emoji icon (e.g., "⭐")
 */
export const getFinishIcon = (finishCode: string): string => {
  const finish = finishOptions.find(opt => opt.code === finishCode);
  return finish ? finish.icon : '';
};

/**
 * Convert server enum value to internal finish code
 * @param serverValue - Server enum value (e.g., "FOIL")
 * @returns Internal finish code (e.g., "foil")
 */
export const getFinishFromServerValue = (serverValue: string): string => {
  const finish = finishOptions.find(opt => opt.serverValue === serverValue);
  return finish ? finish.code : 'nonfoil';
};
