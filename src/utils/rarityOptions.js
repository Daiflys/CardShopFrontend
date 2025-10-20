// Rarity options utility - centralized definition

export const rarityOptions = [
  'All',
  'Masterpiece',
  'Mythic',
  'Rare',
  'Time Shifted',
  'Uncommon',
  'Common',
  'Land',
  'Special',
  'Token',
  'Code Card',
  'Tip Card'
];

// Get rarity color for MUI components (hex colors)
export const getRarityColorHex = (rarity) => {
  const rarityLower = rarity?.toLowerCase();

  switch (rarityLower) {
    case 'common':
      return '#757575'; // gray
    case 'uncommon':
      return '#c0c0c0'; // silver
    case 'rare':
      return '#ffd700'; // gold
    case 'mythic':
    case 'masterpiece':
      return '#ff4500'; // orange-red
    case 'special':
    case 'time shifted':
      return '#9c27b0'; // purple
    default:
      return '#757575'; // gray
  }
};

// Get symbol for rarity
export const getRaritySymbol = (rarity) => {
  const rarityLower = rarity?.toLowerCase();

  switch (rarityLower) {
    case 'common':
      return 'C';
    case 'uncommon':
      return 'U';
    case 'rare':
      return 'R';
    case 'mythic':
    case 'masterpiece':
      return 'M';
    case 'special':
      return 'S';
    case 'time shifted':
      return 'T';
    default:
      return '?';
  }
};
