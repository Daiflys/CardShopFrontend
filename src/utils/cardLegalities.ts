// src/utils/cardLegalities.ts

/**
 * MTG Legality Formats
 * Only includes the formats we want to display/search
 */
export const LEGALITY_FORMATS = [
  { value: '', label: 'Any Format' },
  { value: 'standard', label: 'Standard' },
  { value: 'modern', label: 'Modern' },
  { value: 'commander', label: 'Commander' },
  { value: 'legacy', label: 'Legacy' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'pioneer', label: 'Pioneer' },
  { value: 'pauper', label: 'Pauper' },
  { value: 'historic', label: 'Historic' },
  { value: 'oldschool', label: 'Old School' },
  { value: 'premodern', label: 'Premodern' }
] as const;

/**
 * Legality Status Options
 */
export const LEGALITY_STATUSES = [
  { value: '', label: 'Any Status' },
  { value: 'legal', label: 'Legal' },
  { value: 'not_legal', label: 'Not Legal' },
  { value: 'banned', label: 'Banned' },
  { value: 'restricted', label: 'Restricted' }
] as const;

/**
 * Formats that we want to display (filters out other formats from backend)
 */
const DISPLAYED_FORMATS = new Set([
  'legacy',
  'modern',
  'pauper',
  'pioneer',
  'vintage',
  'historic',
  'standard',
  'commander',
  'oldschool',
  'premodern'
]);

/**
 * Check if a format should be displayed
 */
export const shouldDisplayFormat = (format: string): boolean => {
  return DISPLAYED_FORMATS.has(format);
};

/**
 * Filter legalities to only show formats we want to display
 */
export const filterDisplayedLegalities = (
  legalities: Record<string, string> | undefined
): Record<string, string> => {
  if (!legalities) return {};

  return Object.entries(legalities)
    .filter(([format]) => shouldDisplayFormat(format))
    .reduce((acc, [format, status]) => {
      acc[format] = status;
      return acc;
    }, {} as Record<string, string>);
};

/**
 * Get color class for legality status badge
 * Green: legal
 * Orange: restricted
 * Red: banned or not_legal
 */
export const getLegalityStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    legal: 'bg-green-100 text-green-800 border-green-300',
    restricted: 'bg-orange-100 text-orange-800 border-orange-300',
    banned: 'bg-red-100 text-red-800 border-red-300',
    not_legal: 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[status] || colors.not_legal;
};

/**
 * Format legality status for display
 */
export const formatLegalityStatus = (status: string): string => {
  const formatted: Record<string, string> = {
    legal: 'Legal',
    not_legal: 'Not Legal',
    banned: 'Banned',
    restricted: 'Restricted'
  };
  return formatted[status] || status;
};

/**
 * Format legality format name for display
 */
export const formatLegalityFormat = (format: string): string => {
  const formatted: Record<string, string> = {
    standard: 'Standard',
    modern: 'Modern',
    commander: 'Commander',
    legacy: 'Legacy',
    vintage: 'Vintage',
    pioneer: 'Pioneer',
    pauper: 'Pauper',
    historic: 'Historic',
    oldschool: 'Old School',
    premodern: 'Premodern'
  };
  return formatted[format] || format.charAt(0).toUpperCase() + format.slice(1);
}
