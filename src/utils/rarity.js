// Rarity utility functions
const VALID_RARITIES = ['common', 'uncommon', 'rare', 'mythic'];

export const validateRarity = (rarity) => {
  if (!rarity) return null;
  
  const normalizedRarity = rarity.toLowerCase().trim();
  
  if (!VALID_RARITIES.includes(normalizedRarity)) {
    console.error(`Invalid rarity detected: "${rarity}". Expected one of: ${VALID_RARITIES.join(', ')}`);
    throw new Error(`Invalid rarity: ${rarity}. Please contact support if this persists.`);
  }
  
  return normalizedRarity;
};

export const getRarityColor = (rarity) => {
  try {
    const validRarity = validateRarity(rarity);
    if (!validRarity) return 'from-gray-500 to-gray-600';
    
    switch (validRarity) {
      case 'common':
        return 'from-gray-700 to-gray-900';
      case 'uncommon':
        return 'from-gray-300 to-gray-500';
      case 'rare':
        return 'from-yellow-400 to-yellow-600';
      case 'mythic':
        return 'from-red-500 to-red-700';
      default:
        return 'from-gray-500 to-gray-600';
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
        return 'text-gray-800';
      case 'uncommon':
        return 'text-gray-400';
      case 'rare':
        return 'text-yellow-500';
      case 'mythic':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  } catch (error) {
    console.error('Rarity validation error:', error);
    return 'text-gray-500';
  }
};

export const getRarityIcon = () => {
  return '●';
};