import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SearchFilters = ({ initialQuery = '', onSearch }) => {
  const { t } = useTranslation();
  
  // Filter states
  const [searchText, setSearchText] = useState(initialQuery);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [anyLanguage, setAnyLanguage] = useState(true);
  const [languageFilters, setLanguageFilters] = useState({
    en: false,
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

  // Update search text when initialQuery changes
  useEffect(() => {
    setSearchText(initialQuery);
  }, [initialQuery]);

  // Mock collections - replace with real data from API
  const collections = [
    'All Collections',
    'Alpha',
    'Beta', 
    'Unlimited',
    'Revised',
    'Fourth Edition',
    'Ice Age',
    'Alliances',
    'Mirage',
    'Tempest',
    'Urza\'s Saga',
    'Mercadian Masques',
    'Invasion',
    'Odyssey',
    'Onslaught',
    'Mirrodin',
    'Kamigawa',
    'Ravnica',
    'Time Spiral',
    'Lorwyn',
    'Shadowmoor',
    'Shards of Alara',
    'Zendikar',
    'Scars of Mirrodin',
    'Innistrad',
    'Return to Ravnica',
    'Theros',
    'Khans of Tarkir',
    'Battle for Zendikar',
    'Shadows over Innistrad',
    'Kaladesh',
    'Amonkhet',
    'Ixalan',
    'Dominaria',
    'Guilds of Ravnica',
    'War of the Spark',
    'Throne of Eldraine',
    'Theros Beyond Death',
    'Ikoria',
    'Core Set 2021',
    'Zendikar Rising',
    'Kaldheim',
    'Strixhaven',
    'Adventures in the Forgotten Realms',
    'Innistrad: Midnight Hunt',
    'Innistrad: Crimson Vow',
    'Kamigawa: Neon Dynasty',
    'Streets of New Capenna',
    'Dominaria United',
    'The Brothers\' War',
    'Phyrexia: All Will Be One',
    'March of the Machine'
  ];

  const languages = [
    { 
      key: 'en', 
      name: 'English', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#012169"/>
          <path d="M0,0 L20,15 M20,0 L0,15" stroke="#fff" strokeWidth="3"/>
          <path d="M0,0 L20,15 M20,0 L0,15" stroke="#C8102E" strokeWidth="2"/>
          <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#fff" strokeWidth="5"/>
          <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#C8102E" strokeWidth="3"/>
        </svg>
      )
    },
    { 
      key: 'es', 
      name: 'Español', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#AA151B"/>
          <rect width="20" height="9" y="3" fill="#F1BF00"/>
        </svg>
      )
    },
    { 
      key: 'fr', 
      name: 'Français', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#fff"/>
          <rect width="6.67" height="15" fill="#002654"/>
          <rect width="6.67" height="15" x="13.33" fill="#CE1126"/>
        </svg>
      )
    },
    { 
      key: 'de', 
      name: 'Deutsch', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="5" fill="#000"/>
          <rect width="20" height="5" y="5" fill="#DE0000"/>
          <rect width="20" height="5" y="10" fill="#FFCE00"/>
        </svg>
      )
    },
    { 
      key: 'it', 
      name: 'Italiano', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#fff"/>
          <rect width="6.67" height="15" fill="#009246"/>
          <rect width="6.67" height="15" x="13.33" fill="#CE2B37"/>
        </svg>
      )
    },
    { 
      key: 'ja', 
      name: '日本語', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#fff"/>
          <circle cx="10" cy="7.5" r="4.5" fill="#BC002D"/>
        </svg>
      )
    },
    { 
      key: 'pt', 
      name: 'Português', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#FF0000"/>
          <rect width="12" height="15" fill="#00AF66"/>
        </svg>
      )
    },
    { 
      key: 'ru', 
      name: 'Русский', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="5" fill="#fff"/>
          <rect width="20" height="5" y="5" fill="#0033A0"/>
          <rect width="20" height="5" y="10" fill="#DA020E"/>
        </svg>
      )
    },
    { 
      key: 'zh', 
      name: '中文', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#EE1C25"/>
          <polygon points="4,3 5,5 3,4 5,4 3,5" fill="#FFFF00"/>
        </svg>
      )
    },
    { 
      key: 'ko', 
      name: '한국어', 
      flag: (
        <svg width="16" height="12" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#fff"/>
          <circle cx="10" cy="7.5" r="6" fill="#003478" fillOpacity="0.3"/>
          <circle cx="10" cy="7.5" r="3" fill="#CD2E3A" fillOpacity="0.6"/>
        </svg>
      )
    }
  ];

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
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Collections</option>
          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>
      </div>

      {/* Language Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        
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