// Language flags utility - using header design as reference
export const getLanguageFlag = (languageCode, size = 'normal') => {
  // Size variants: normal (20x15 for header), small (16x12 for other places)
  const [width, height] = size === 'normal' ? [20, 15] : [16, 12];
  
  const flags = {
    en: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        {/* American flag */}
        <rect width="20" height="15" fill="#B22234"/>
        <rect width="20" height="1.15" y="1.15" fill="#fff"/>
        <rect width="20" height="1.15" y="3.46" fill="#fff"/>
        <rect width="20" height="1.15" y="5.77" fill="#fff"/>
        <rect width="20" height="1.15" y="8.08" fill="#fff"/>
        <rect width="20" height="1.15" y="10.38" fill="#fff"/>
        <rect width="20" height="1.15" y="12.69" fill="#fff"/>
        <rect width="8" height="8.08" fill="#3C3B6E"/>
        <g fill="#fff">
          <circle cx="1.3" cy="1.3" r="0.2"/>
          <circle cx="2.6" cy="1.3" r="0.2"/>
          <circle cx="3.9" cy="1.3" r="0.2"/>
          <circle cx="5.2" cy="1.3" r="0.2"/>
          <circle cx="6.5" cy="1.3" r="0.2"/>
          <circle cx="2" cy="2.6" r="0.2"/>
          <circle cx="3.3" cy="2.6" r="0.2"/>
          <circle cx="4.6" cy="2.6" r="0.2"/>
          <circle cx="5.9" cy="2.6" r="0.2"/>
        </g>
      </svg>
    ),
    es: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="15" fill="#AA151B"/>
        <rect width="20" height="9" y="3" fill="#F1BF00"/>
      </svg>
    ),
    fr: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="15" fill="#fff"/>
        <rect width="6.67" height="15" fill="#002654"/>
        <rect width="6.67" height="15" x="13.33" fill="#CE1126"/>
      </svg>
    ),
    de: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="5" fill="#000"/>
        <rect width="20" height="5" y="5" fill="#DE0000"/>
        <rect width="20" height="5" y="10" fill="#FFCE00"/>
      </svg>
    ),
    it: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="15" fill="#fff"/>
        <rect width="6.67" height="15" fill="#009246"/>
        <rect width="6.67" height="15" x="13.33" fill="#CE2B37"/>
      </svg>
    ),
    ja: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="15" fill="#fff"/>
        <circle cx="10" cy="7.5" r="4.5" fill="#BC002D"/>
      </svg>
    ),
    pt: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="15" fill="#FF0000"/>
        <rect width="12" height="15" fill="#00AF66"/>
      </svg>
    ),
    ru: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="5" fill="#fff"/>
        <rect width="20" height="5" y="5" fill="#0033A0"/>
        <rect width="20" height="5" y="10" fill="#DA020E"/>
      </svg>
    ),
    zh: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="15" fill="#EE1C25"/>
        <polygon points="4,3 5,5 3,4 5,4 3,5" fill="#FFFF00"/>
      </svg>
    ),
    ko: (
      <svg width={width} height={height} viewBox="0 0 20 15" className="border border-gray-300">
        <rect width="20" height="15" fill="#fff"/>
        <circle cx="10" cy="7.5" r="6" fill="#003478" fillOpacity="0.3"/>
        <circle cx="10" cy="7.5" r="3" fill="#CD2E3A" fillOpacity="0.6"/>
      </svg>
    )
  };

  return flags[languageCode] || flags.en; // Default to English if language not found
};

export const getLanguageName = (languageCode) => {
  const names = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    ja: '日本語',
    pt: 'Português',
    ru: 'Русский',
    zh: '中文',
    ko: '한국어'
  };
  
  return names[languageCode] || 'English';
};

// Complete language options for card language filters (all languages)
export const languageOptions = [
  { 
    key: 'en', 
    name: 'English', 
    flag: getLanguageFlag('en', 'normal')
  },
  { 
    key: 'es', 
    name: 'Español', 
    flag: getLanguageFlag('es', 'normal')
  },
  { 
    key: 'fr', 
    name: 'Français', 
    flag: getLanguageFlag('fr', 'normal')
  },
  { 
    key: 'de', 
    name: 'Deutsch', 
    flag: getLanguageFlag('de', 'normal')
  },
  { 
    key: 'it', 
    name: 'Italiano', 
    flag: getLanguageFlag('it', 'normal')
  },
  { 
    key: 'ja', 
    name: '日本語', 
    flag: getLanguageFlag('ja', 'normal')
  },
  { 
    key: 'pt', 
    name: 'Português', 
    flag: getLanguageFlag('pt', 'normal')
  },
  { 
    key: 'ru', 
    name: 'Русский', 
    flag: getLanguageFlag('ru', 'normal')
  },
  { 
    key: 'zh', 
    name: '中文', 
    flag: getLanguageFlag('zh', 'normal')
  },
  { 
    key: 'ko', 
    name: '한국어', 
    flag: getLanguageFlag('ko', 'normal')
  }
];

// Language options for header (normal size)
export const headerLanguageOptions = [
  { 
    code: 'en', 
    name: 'English', 
    flag: getLanguageFlag('en', 'normal')
  },
  { 
    code: 'es', 
    name: 'Español', 
    flag: getLanguageFlag('es', 'normal')
  },
  { 
    code: 'ja', 
    name: '日本語', 
    flag: getLanguageFlag('ja', 'normal')
  }
];