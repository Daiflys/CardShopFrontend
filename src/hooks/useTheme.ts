import { useState, useEffect } from 'react';
import { defaultTheme } from '../themes/default.theme.js';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    text: string;
    textDark: string;
    background: string;
    backgroundLight: string;
    border: string;
    success: string;
    danger: string;
    warning: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  typography: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    body: string;
    bodySmall: string;
    caption: string;
  };
  layout: {
    containerPadding: string;
    sectionSpacing: string;
    cardSpacing: string;
    buttonHeight: string;
    inputHeight: string;
  };
  components: Record<string, Record<string, string>>;
}

export interface UseThemeReturn {
  theme: Theme;
  updateTheme: (newTheme: Theme) => void;
}

// Extend Window interface for custom event
declare global {
  interface WindowEventMap {
    'themeChange': CustomEvent<Theme>;
  }
}

export const useTheme = (): UseThemeReturn => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('currentTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme) as Theme;
        setCurrentTheme(parsedTheme);
      } catch (error) {
        console.warn('Failed to parse saved theme, using default:', error);
        setCurrentTheme(defaultTheme);
      }
    }

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent<Theme>) => {
      if (event.detail) {
        setCurrentTheme(event.detail);
        localStorage.setItem('currentTheme', JSON.stringify(event.detail));
      }
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const updateTheme = (newTheme: Theme): void => {
    setCurrentTheme(newTheme);
    localStorage.setItem('currentTheme', JSON.stringify(newTheme));
    window.dispatchEvent(new CustomEvent<Theme>('themeChange', { detail: newTheme }));
  };

  return {
    theme: currentTheme,
    updateTheme
  };
};
