import React, { useState, useEffect } from 'react';
import { MTG_SETS, getSetIcon } from '../data/sets.js';

/**
 * Reusable collection/set selector component with searchable dropdown
 *
 * @param {Object} props
 * @param {string} props.value - Current selected collection code
 * @param {Function} props.onChange - Callback when selection changes (receives collection code)
 * @param {string} props.label - Label text for the selector (default: "Collection")
 * @param {string} props.placeholder - Placeholder text when no collection selected (default: "All Collections")
 * @param {string} props.searchPlaceholder - Placeholder for search input (default: "Search collections...")
 * @param {boolean} props.showIcon - Whether to show set icons (default: true)
 * @param {string} props.className - Additional CSS classes for the wrapper
 */
const CollectionSelector = ({
  value,
  onChange,
  label = 'Collection',
  placeholder = 'All Collections',
  searchPlaceholder = 'Search collections...',
  showIcon = true,
  className = ''
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Get collections from MTG_SETS data
  const allCollections = Object.values(MTG_SETS).map(set => ({
    code: set.code,
    name: set.name
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Filter collections based on search text
  const filteredCollections = allCollections.filter(collection =>
    collection.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Find selected collection details
  const selectedCollection = value
    ? allCollections.find(c => c.code === value)
    : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.collection-selector-wrapper')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSelect = (collectionCode) => {
    onChange(collectionCode);
    setIsDropdownOpen(false);
    setSearchText('');
  };

  return (
    <div className={`collection-selector-wrapper ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            {showIcon && selectedCollection && getSetIcon(selectedCollection.code) && (
              <img
                src={getSetIcon(selectedCollection.code)}
                alt={selectedCollection.code}
                className="w-4 h-4 flex-shrink-0"
              />
            )}
            <span className="truncate">
              {selectedCollection ? selectedCollection.name : placeholder}
            </span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {/* Search input inside dropdown */}
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Scrollable options */}
            <div className="max-h-48 overflow-auto">
              <div
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                onClick={() => handleSelect('')}
              >
                {showIcon && <span className="w-4 h-4"></span>}
                <span>{placeholder}</span>
              </div>
              {filteredCollections.map((collection) => (
                <div
                  key={collection.code}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  onClick={() => handleSelect(collection.code)}
                >
                  {showIcon && (
                    getSetIcon(collection.code) ? (
                      <img
                        src={getSetIcon(collection.code)}
                        alt={collection.code}
                        className="w-4 h-4 flex-shrink-0"
                      />
                    ) : (
                      <span className="w-4 h-4"></span>
                    )
                  )}
                  <span className="truncate">{collection.name}</span>
                </div>
              ))}
              {filteredCollections.length === 0 && searchText && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No collections found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSelector;
