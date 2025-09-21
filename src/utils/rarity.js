// Rarity utility functions
const VALID_RARITIES = ['common', 'uncommon', 'rare', 'mythic'];

export const validateRarity = (rarity) => {
  if (!rarity) return null;

  const normalizedRarity = rarity.toLowerCase().trim();

  if (!VALID_RARITIES.includes(normalizedRarity)) {
    console.warn(`Unknown rarity detected: "${rarity}". Using default fallback. Valid rarities: ${VALID_RARITIES.join(', ')}`);
    return 'special'; // Return a special identifier for unknown rarities
  }

  return normalizedRarity;
};

export const getRarityColor = (rarity) => {
  try {
    const validRarity = validateRarity(rarity);
    if (!validRarity) return 'from-gray-500 to-gray-600';
    
    switch (validRarity) {
      case 'common':
        return 'from-white to-gray-100';
      case 'uncommon':
        return 'from-gray-700 to-gray-900';
      case 'rare':
        return 'from-yellow-400 to-yellow-600';
      case 'mythic':
        return 'from-red-500 to-red-700';
      case 'special':
        return 'from-blue-500 to-blue-600'; // Blue color for unknown rarities
      default:
        return 'from-blue-500 to-blue-600';
    }
  } catch (error) {
    console.error('Rarity validation error:', error);
    return 'from-gray-500 to-gray-600';
  }
};

export const getRarityTextColor = (rarity) => {
  try {
    const validRarity = validateRarity(rarity);
    if (!validRarity) return 'text-gray-500';
    
    switch (validRarity) {
      case 'common':
        return 'text-gray-100';
      case 'uncommon':
        return 'text-gray-800';
      case 'rare':
        return 'text-yellow-500';
      case 'mythic':
        return 'text-red-500';
      case 'special':
        return 'text-blue-500'; // Blue color for unknown rarities
      default:
        return 'text-blue-500';
    }
  } catch (error) {
    console.error('Rarity validation error:', error);
    return 'text-gray-500';
  }
};

export const getRarityIcon = () => {
  return '●';
};

export const getRaritySolidColor = (rarity) => {
  try {
    const validRarity = validateRarity(rarity);
    if (!validRarity) return 'bg-gray-500';
    
    switch (validRarity) {
      case 'common':
        return 'bg-white';
      case 'uncommon':
        return 'bg-gray-700';
      case 'rare':
        return 'bg-yellow-400';
      case 'mythic':
        return 'bg-red-500';
      case 'special':
        return 'bg-blue-500'; // Blue color for unknown rarities
      default:
        return 'bg-blue-500';
    }
  } catch (error) {
    console.error('Rarity validation error:', error);
    return 'bg-gray-500';
  }
};