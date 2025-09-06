import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languageOptions } from '../utils/languageFlags.jsx';
import { MTG_SETS, getSetIcon } from '../data/sets.js';

const SearchFilters = ({ initialQuery = '', onSearch }) => {
  const { t } = useTranslation();
  
  // Filter states
  const [searchText, setSearchText] = useState(initialQuery);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [anyLanguage, setAnyLanguage] = useState(false);
  const [languageFilters, setLanguageFilters] = useState({
    en: true,
    es: false,
    fr: false,
    de: false,
    it: false,
    ja: false,
    pt: false,
    ru: false,
    zh: false,
    ko: false
  });
  const [isLanguageSectionOpen, setIsLanguageSectionOpen] = useState(false);
  const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);

  // Update search text when initialQuery changes
  useEffect(() => {
    setSearchText(initialQuery);
  }, [initialQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCollectionDropdownOpen && !event.target.closest('.collection-dropdown')) {
        setIsCollectionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollectionDropdownOpen]);

  // Get collections from MTG_SETS data, same as BulkSell
  const collections = Object.values(MTG_SETS).map(set => ({
    code: set.code,
    name: set.name
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Use centralized language options
  const languages = languageOptions;

  const handleLanguageToggle = (language) => {
    setLanguageFilters(prev => ({
      ...prev,
      [language]: !prev[language]
    }));
  };

  const handleSearch = () => {
    const filters = {
      query: searchText,
      collection: selectedCollection === 'All Collections' ? '' : selectedCollection,
      languages: anyLanguage ? {} : languageFilters
    };
    onSearch(filters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
        Search Filters
      </h3>

      {/* Search Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Term
        </label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter card name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Collection Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Collection
        </label>
        <div className="relative collection-dropdown">
          <button
            type="button"
            onClick={() => setIsCollectionDropdownOpen(!isCollectionDropdownOpen)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              {selectedCollection && getSetIcon(selectedCollection) && (
                <img 
                  src={getSetIcon(selectedCollection)} 
                  alt={selectedCollection}
                  className="w-4 h-4 flex-shrink-0"
                />
              )}
              <span className="truncate">
                {selectedCollection 
                  ? collections.find(c => c.code === selectedCollection)?.name || selectedCollection 
                  : 'All Collections'
                }
              </span>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isCollectionDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                onClick={() => {
                  setSelectedCollection('');
                  setIsCollectionDropdownOpen(false);
                }}
              >
                <span className="w-4 h-4"></span>
                <span>All Collections</span>
              </div>
              {collections.map((collection) => (
                <div
                  key={collection.code}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  onClick={() => {
                    setSelectedCollection(collection.code);
                    setIsCollectionDropdownOpen(false);
                  }}
                >
                  {getSetIcon(collection.code) ? (
                    <img 
                      src={getSetIcon(collection.code)} 
                      alt={collection.code}
                      className="w-4 h-4 flex-shrink-0"
                    />
                  ) : (
                    <span className="w-4 h-4"></span>
                  )}
                  <span className="truncate">{collection.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Language Filter */}
      <div className="mb-6">
        <button
          onClick={() => setIsLanguageSectionOpen(!isLanguageSectionOpen)}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2 hover:text-gray-900 transition-colors"
        >
          <span>Language</span>
          <span className={`transition-transform duration-200 ${isLanguageSectionOpen ? 'rotate-90' : ''}`}>
            ▶
          </span>
        </button>
        
        {isLanguageSectionOpen && (
          <div className="space-y-3">
            {/* Any Language Checkbox */}
            <div className="mb-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={anyLanguage}
                  onChange={(e) => setAnyLanguage(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Any Language</span>
              </label>
            </div>

            {/* Language Toggles */}
            {!anyLanguage && (
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span>{lang.flag}</span>
                      <span className="text-sm text-gray-700">
                        {lang.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLanguageToggle(lang.key)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 items-center justify-start p-0.5 ${
                        languageFilters[lang.key] 
                          ? 'bg-blue-500' 
                          : 'bg-gray-400'
                      }`}
                      role="switch"
                      aria-checked={languageFilters[lang.key]}
                    >
                      <span className="sr-only">Toggle {lang.name}</span>
                      <span
                        className={`block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${
                          languageFilters[lang.key] 
                            ? 'translate-x-4' 
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
      >
        Search
      </button>
    </div>
  );
};

export default SearchFilters;