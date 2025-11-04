import React from 'react';
import { getRaritySolidColor } from '../utils/rarity.ts';

export type RarityCircleSize = 'small' | 'medium' | 'large';

export interface RarityCircleProps {
  rarity?: string | null;
  size?: RarityCircleSize;
  className?: string;
}

/**
 * Reusable rarity circle component with automatic border for light colors
 *
 * @param rarity - Card rarity (common, uncommon, rare, mythic, etc.)
 * @param size - Size class: 'small' (w-2 h-2), 'medium' (w-3 h-3), 'large' (w-4 h-4)
 * @param className - Additional CSS classes
 */
const RarityCircle: React.FC<RarityCircleProps> = ({
  rarity,
  size = 'medium',
  className = ''
}) => {
  // Map size to Tailwind classes
  const sizeClasses: Record<RarityCircleSize, string> = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  // Rarities that need a border on light backgrounds
  const needsBorder = ['common'].includes(rarity?.toLowerCase() || '');

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
