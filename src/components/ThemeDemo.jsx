import React from 'react';
import { useSkin } from '../hooks/useComponent.js';
import { useTheme } from '../hooks/useTheme.js';
import { defaultTheme } from '../themes/default.theme.js';
import { minimalTheme } from '../themes/minimal.theme.js';

const ThemeDemo = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { currentSkin, availableSkins, switchSkin } = useSkin();
  const { theme, updateTheme } = useTheme();

  const availableThemes = {
    default: defaultTheme,
    minimal: minimalTheme
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-50 w-80 max-w-sm">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
            Theme & Layout
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      {/* Skin Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Skin: <span className="font-bold text-blue-600">{currentSkin}</span>
        </label>
        <div className="space-y-2">
          {availableSkins.filter(skinName => skinName !== 'line-limiter').map(skinName => (
            <button
              key={skinName}
              onClick={() => switchSkin(skinName)}
              className={`w-full px-3 py-2 text-left rounded text-sm transition-colors ${
                currentSkin === skinName
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {skinName === 'default' ? '🎯 Default Layout' : '✨ Minimal Layout'}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Theme: <span className="font-bold text-green-600">{theme.name}</span>
        </label>
        <div className="space-y-2">
          {Object.entries(availableThemes).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => updateTheme(themeData)}
              className={`w-full px-3 py-2 text-left rounded text-sm transition-colors ${
                theme.id === themeData.id
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {key === 'default' ? '🎨 Sky Blue Theme' : '⚫ Minimal Gray Theme'}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
        <p className="mb-1"><strong>Skin:</strong> Changes layout structure</p>
        <p><strong>Theme:</strong> Changes colors & styling</p>
      </div>
      </div>
    </>
  );
};

export default ThemeDemo;