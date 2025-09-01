import React from 'react';
import { getRarityColor, validateRarity } from '../utils/rarity';

const RarityIndicator = ({ rarity, className = "" }) => {
  if (!rarity) return null;
  
  try {
    const validRarity = validateRarity(rarity);
    if (!validRarity) return null;
    
    const gradientColors = getRarityColor(rarity);
    
    return (
      <div className={`absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r ${gradientColors} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-x-0 -top-2 h-2 bg-gradient-to-r from-transparent via-black/10 to-transparent blur-sm"></div>
      </div>
    );
  } catch (error) {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-red-500 to-red-700 animate-pulse" title={error.message}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    );
  }
};

export default RarityIndicator;