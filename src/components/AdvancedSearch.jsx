import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languageOptions } from '../utils/languageFlags.jsx';
import { useTheme } from '../hooks/useTheme';
import { LEGALITY_FORMATS, LEGALITY_STATUSES } from '../utils/cardLegalities';
import CollectionSelector from './CollectionSelector.jsx';
import ColorSelector from './ColorSelector.jsx';

const AdvancedSearch = ({ onSearch, onReset }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    languages: [],
    setCode: '',
    rarity: '',
    colors: [],
    cmcEquals: '',
    cmcMin: '',
    cmcMax: '',
    typeLine: '',
    artist: '',
    legalityFormat: '',
    legalityStatus: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    sets: false,
    languages: false,
    colors: false,
    rarity: false,
    legalityFormat: false,
    legalityStatus: false
  });

  const rarityOptions = [
    { value: '', label: 'Any Rarity' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'mythic', label: 'Mythic Rare' },
    { value: 'special', label: 'Special' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleDropdownToggle = (dropdown) => {
    setIsDropdownOpen(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean up empty values
    const cleanFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== '' && value !== null && value !== undefined;
      })
    );

    onSearch(cleanFormData);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      languages: [],
      setCode: '',
      rarity: '',
      colors: [],
      cmcEquals: '',
      cmcMin: '',
      cmcMax: '',
      typeLine: '',
      artist: '',
      legalityFormat: '',
      legalityStatus: ''
    });
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Search</h2>
        <p className="text-gray-600">Find exactly the cards you're looking for with detailed filters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter card name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Set Selection */}
          <CollectionSelector
            value={formData.setCode}
            onChange={(value) => handleInputChange('setCode', value)}
            label="Set"
            placeholder="Any Set"
          />

          {/* Rarity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rarity
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle('rarity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
              >
                <span>{rarityOptions.find(r => r.value === formData.rarity)?.label || 'Any Rarity'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen.rarity && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  {rarityOptions.map((rarity) => (
                    <div
                      key={rarity.value}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleInputChange('rarity', rarity.value);
                        handleDropdownToggle('rarity');
                      }}
                    >
                      {rarity.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colors */}
        <ColorSelector
          selectedColors={formData.colors}
          onColorToggle={(color) => handleArrayToggle('colors', color)}
          size="medium"
          label="Colors"
          labelClassName="block text-sm font-medium text-gray-700 mb-2"
        />

        {/* Mana Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mana Cost
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Exactly</label>
              <input
                type="number"
                min="0"
                value={formData.cmcEquals}
                onChange={(e) => handleInputChange('cmcEquals', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minimum</label>
              <input
                type="number"
                min="0"
                value={formData.cmcMin}
                onChange={(e) => handleInputChange('cmcMin', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Maximum</label>
              <input
                type="number"
                min="0"
                value={formData.cmcMax}
                onChange={(e) => handleInputChange('cmcMax', e.target.value)}
                placeholder="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Type Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type Line
          </label>
          <input
            type="text"
            value={formData.typeLine}
            onChange={(e) => handleInputChange('typeLine', e.target.value)}
            placeholder="e.g. Creature, Instant, Artifact..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Artist */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Artist
          </label>
          <input
            type="text"
            value={formData.artist}
            onChange={(e) => handleInputChange('artist', e.target.value)}
            placeholder="Artist name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => handleDropdownToggle('languages')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
            >
              <span>
                {formData.languages.length === 0
                  ? 'Any Language'
                  : `${formData.languages.length} language(s) selected`
                }
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen.languages && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {languageOptions.map((lang) => (
                  <div
                    key={lang.key}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                    onClick={() => handleArrayToggle('languages', lang.key)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang.key)}
                      onChange={() => {}}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{lang.flag}</span>
                    <span className="flex-1">{lang.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legality Filters */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Legality Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legality Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleDropdownToggle('legalityFormat')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                >
                  <span>{LEGALITY_FORMATS.find(f => f.value === formData.legalityFormat)?.label || 'Any Format'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen.legalityFormat && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {LEGALITY_FORMATS.map((format) => (
                      <div
                        key={format.value}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleInputChange('legalityFormat', format.value);
                          handleDropdownToggle('legalityFormat');
                        }}
                      >
                        {format.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legality Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleDropdownToggle('legalityStatus')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                >
                  <span>{LEGALITY_STATUSES.find(s => s.value === formData.legalityStatus)?.label || 'Any Status'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen.legalityStatus && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {LEGALITY_STATUSES.map((status) => (
                      <div
                        key={status.value}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleInputChange('legalityStatus', status.value);
                          handleDropdownToggle('legalityStatus');
                        }}
                      >
                        {status.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Search Cards
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;