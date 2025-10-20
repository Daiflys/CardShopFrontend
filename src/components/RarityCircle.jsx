import React from 'react';
import { getRaritySolidColor } from '../utils/rarity';

/**
 * Reusable rarity circle component with automatic border for light colors
 *
 * @param {string} rarity - Card rarity (common, uncommon, rare, mythic, etc.)
 * @param {string} size - Size class: 'small' (w-2 h-2), 'medium' (w-3 h-3), 'large' (w-4 h-4)
 * @param {string} className - Additional CSS classes
 */
const RarityCircle = ({ rarity, size = 'medium', className = '' }) => {
  // Map size to Tailwind classes
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  // Rarities that need a border on light backgrounds
  const needsBorder = ['common'].includes(rarity?.toLowerCase());

  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  const colorClass = getRaritySolidColor(rarity);
  const borderClass = needsBorder ? 'border border-black' : '';

  return (
    <span
      className={`inline-block rounded-full ${sizeClass} ${colorClass} ${borderClass} ${className}`.trim()}
      title={rarity || 'Unknown'}
    />
  );
};

export default RarityCircle;
