import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcherFlags = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: (
        <svg width="20" height="15" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#012169"/>
          <path d="M0,0 L20,15 M20,0 L0,15" stroke="#fff" strokeWidth="3"/>
          <path d="M0,0 L20,15 M20,0 L0,15" stroke="#C8102E" strokeWidth="2"/>
          <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#fff" strokeWidth="5"/>
          <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#C8102E" strokeWidth="3"/>
        </svg>
      )
    },
    { 
      code: 'es', 
      name: 'Español', 
      flag: (
        <svg width="20" height="15" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#AA151B"/>
          <rect width="20" height="9" y="3" fill="#F1BF00"/>
        </svg>
      )
    },
    { 
      code: 'ja', 
      name: '日本語', 
      flag: (
        <svg width="20" height="15" viewBox="0 0 20 15" className="border border-gray-300">
          <rect width="20" height="15" fill="#fff"/>
          <circle cx="10" cy="7.5" r="4.5" fill="#BC002D"/>
        </svg>
      )
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-sky-200 rounded-md hover:bg-sky-50 hover:border-sky-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {currentLanguage.flag}
        <span className="text-slate-700 font-medium">
          {currentLanguage.name}
        </span>
        <svg 
          className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-sky-200 rounded-md shadow-lg z-50 overflow-hidden">
          <div className="py-1" role="listbox">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-sky-50 transition-colors ${
                  i18n.language === language.code 
                    ? 'bg-sky-100 text-sky-700' 
                    : 'text-slate-700'
                }`}
                role="option"
                aria-selected={i18n.language === language.code}
              >
                <div className="flex items-center gap-2">
                  {language.flag}
                  <span className="font-medium">
                    {language.name}
                  </span>
                </div>
                {i18n.language === language.code && (
                  <svg className="w-4 h-4 text-sky-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcherFlags;