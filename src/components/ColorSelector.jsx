import React from 'react';

/**
 * ColorSelector Component
 *
 * Displays MTG mana color symbols that can be toggled on/off.
 * Uses SVG icons from /assets/mana-symbols/
 *
 * @param {string[]} selectedColors - Array of selected color codes (e.g., ['W', 'U', 'B'])
 * @param {function} onColorToggle - Callback function when a color is toggled
 * @param {string} size - Size of the symbols: 'small' (8), 'medium' (12), 'large' (16) - default 'medium'
 * @param {string} label - Optional label text
 * @param {string} labelClassName - Optional CSS classes for the label
 * @param {string} containerClassName - Optional CSS classes for the container
 */
const ColorSelector = ({
  selectedColors = [],
  onColorToggle,
  size = 'medium',
  label,
  labelClassName,
  containerClassName = ''
}) => {
  const colorOptions = [
    { value: 'W', name: 'White', svg: '/assets/mana-symbols/W.svg' },
    { value: 'U', name: 'Blue', svg: '/assets/mana-symbols/U.svg' },
    { value: 'B', name: 'Black', svg: '/assets/mana-symbols/B.svg' },
    { value: 'R', name: 'Red', svg: '/assets/mana-symbols/R.svg' },
    { value: 'G', name: 'Green', svg: '/assets/mana-symbols/G.svg' },
    { value: 'C', name: 'Colorless', svg: '/assets/mana-symbols/C.svg' }
  ];

  // Size mappings for Tailwind classes
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const symbolSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName || "block text-sm font-medium text-gray-700 mb-2"}>
          {label}
        </label>
      )}
      <div className="flex justify-between gap-2">
        {colorOptions.map((color) => {
          const isActive = selectedColors.includes(color.value);
          return (
            <button
              key={color.value}
              type="button"
              onClick={() => onColorToggle(color.value)}
              className={`
                p-0 bg-transparent border-none cursor-pointer rounded-full
                transition-all outline-offset-2
                ${isActive ? 'ring-2 ring-blue-500 ring-offset-2 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}
              `}
              title={color.name}
              aria-label={`${isActive ? 'Deselect' : 'Select'} ${color.name}`}
              aria-pressed={isActive}
            >
              <img
                src={color.svg}
                alt={color.name}
                className={`${symbolSize} rounded-full`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
