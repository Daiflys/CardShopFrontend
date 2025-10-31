import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectionSelector from './CollectionSelector';

const HomePageSearch = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    setCode: '',
    colors: [],
    rarities: []
  });

  // Color options - using direct paths to mana symbol SVGs
  const colorOptions = [
    { value: 'W', name: 'White', svg: '/assets/mana-symbols/W.svg' },
    { value: 'U', name: 'Blue', svg: '/assets/mana-symbols/U.svg' },
    { value: 'B', name: 'Black', svg: '/assets/mana-symbols/B.svg' },
    { value: 'R', name: 'Red', svg: '/assets/mana-symbols/R.svg' },
    { value: 'G', name: 'Green', svg: '/assets/mana-symbols/G.svg' },
    { value: 'C', name: 'Colorless', svg: '/assets/mana-symbols/C.svg' }
  ];

  // Rarity options
  const rarityOptions = [
    { value: 'mythic', label: 'M', fullLabel: 'Mythic', bgColor: 'bg-orange-50', borderColor: 'border-orange-400', activeBg: 'bg-orange-200', activeBorder: 'border-orange-600' },
    { value: 'rare', label: 'R', fullLabel: 'Rare', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', activeBg: 'bg-yellow-200', activeBorder: 'border-yellow-600' },
    { value: 'uncommon', label: 'U', fullLabel: 'Uncommon', bgColor: 'bg-gray-50', borderColor: 'border-gray-400', activeBg: 'bg-gray-200', activeBorder: 'border-gray-600' },
    { value: 'common', label: 'C', fullLabel: 'Common', bgColor: 'bg-gray-100', borderColor: 'border-gray-300', activeBg: 'bg-gray-200', activeBorder: 'border-gray-500' }
  ];

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleRarityToggle = (rarity) => {
    setFormData(prev => ({
      ...prev,
      rarities: prev.rarities.includes(rarity)
        ? prev.rarities.filter(r => r !== rarity)
        : [...prev.rarities, rarity]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Build query params for search page
    const params = new URLSearchParams();

    if (formData.name.trim()) {
      params.set('q', formData.name.trim());
    }

    if (formData.setCode && formData.setCode !== '') {
      params.set('set', formData.setCode);
    }

    if (formData.colors.length > 0) {
      params.set('colors', formData.colors.join(','));
    }

    if (formData.rarities.length > 0) {
      params.set('rarity', formData.rarities.join(','));
    }

    // Navigate to search results page with params
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-4">
      <form onSubmit={handleSearch} className="space-y-3">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-red-600 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Input Product Name"
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Card Set */}
        <div>
          <label className="block text-xs font-semibold text-red-600 mb-1">
            Card set
          </label>
          <CollectionSelector
            value={formData.setCode}
            onChange={(value) => setFormData(prev => ({ ...prev, setCode: value }))}
            placeholder="Unspecified"
            showIcon={false}
            label=""
          />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-xs font-semibold text-red-600 mb-1">
            Color
          </label>
          <div className="flex justify-between gap-2">
            {colorOptions.map((color) => {
              const isActive = formData.colors.includes(color.value);
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorToggle(color.value)}
                  className={`
                    p-0 bg-transparent border-none cursor-pointer rounded-full
                    transition-transform outline-offset-2
                  `}
                  title={color.name}
                >
                  <img
                    src={color.svg}
                    alt={color.name}
                    className="w-12 h-12 rounded-full"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Rarity */}
        <div>
          <label className="block text-xs font-semibold text-red-600 mb-1">
            Rarity
          </label>
          <div className="flex justify-between gap-1.5">
            {rarityOptions.map((rarity) => {
              const isActive = formData.rarities.includes(rarity.value);
              return (
                <button
                  key={rarity.value}
                  type="button"
                  onClick={() => handleRarityToggle(rarity.value)}
                  className={`
                    flex-1 py-1 px-2 rounded text-sm font-bold border-2 transition-all
                    ${isActive
                      ? `${rarity.activeBg} ${rarity.activeBorder} shadow-sm`
                      : `${rarity.bgColor} ${rarity.borderColor} hover:opacity-80`
                    }
                  `}
                  title={rarity.fullLabel}
                >
                  {rarity.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
      </form>
    </div>
  );
};

export default HomePageSearch;
