// Language flags utility - using local SVG assets
export const getLanguageFlag = (languageCode, size = 'normal') => {
  // Size variants: normal (20x15 for header), small (24x18 for search grid - 50% larger)
  const [width, height] = size === 'normal' ? [20, 15] : [24, 18];

  const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'ja', 'pt', 'ru', 'zh', 'ko'];
  const language = validLanguages.includes(languageCode) ? languageCode : 'en';

  return (
    <img
      src={`/assets/language-flags/${language}.svg`}
      alt={`${language} flag`}
      width={width}
      height={height}
      className="border border-gray-300 object-cover"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
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