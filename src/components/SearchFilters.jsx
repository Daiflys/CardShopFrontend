import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languageOptions } from '../utils/languageFlags.jsx';
import useSearchFiltersStore from '../store/searchFiltersStore.js';
import CollectionSelector from './CollectionSelector.jsx';

const SearchFilters = ({ initialQuery = '', onSearch }) => {
  const { t } = useTranslation();
  
  // Use Zustand store for persistent filter states
  const {
    searchText,
    selectedCollection,
    anyLanguage,
    languageFilters,
    setSearchText,
    setSelectedCollection,
    setAnyLanguage,
    toggleLanguage,
    getCurrentFilters
  } = useSearchFiltersStore();
  
  // Local UI states (not persisted)
  const [isLanguageSectionOpen, setIsLanguageSectionOpen] = useState(false);

  // Update search text when initialQuery changes
  useEffect(() => {
    setSearchText(initialQuery);
  }, [initialQuery, setSearchText]);

  // Use centralized language options
  const languages = languageOptions;

  const handleLanguageToggle = (language) => {
    toggleLanguage(language);
  };

  const handleSearch = () => {
    const filters = getCurrentFilters();
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
      <CollectionSelector
        value={selectedCollection}
        onChange={setSelectedCollection}
        label="Collection"
        placeholder="All Collections"
        className="mb-4"
      />

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