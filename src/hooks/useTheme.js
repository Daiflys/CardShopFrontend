import { useState, useEffect } from 'react';
import { defaultTheme } from '../themes/default.theme.js';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('currentTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
      } catch (error) {
        console.warn('Failed to parse saved theme, using default:', error);
        setCurrentTheme(defaultTheme);
      }
    }

    // Listen for theme changes
    const handleThemeChange = (event) => {
      if (event.detail) {
        setCurrentTheme(event.detail);
        localStorage.setItem('currentTheme', JSON.stringify(event.detail));
      }
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const updateTheme = (newTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('currentTheme', JSON.stringify(newTheme));
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };

  return {
    theme: currentTheme,
    updateTheme
  };
};