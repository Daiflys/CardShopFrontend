import React, { useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';

const LogoProperties = () => {
  const { config, updateLogo, updateFavicon } = useEditorStore();
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      updateLogo({ file: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateFavicon({ file: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoWidthChange = (e) => {
    updateLogo({ width: parseInt(e.target.value) });
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo
        </label>

        {/* Logo preview */}
        {config.logo.file && (
          <div className="mb-3 p-4 bg-gray-50 rounded-md border border-gray-200">
            <img
              src={config.logo.file}
              alt="Logo preview"
              style={{ width: `${config.logo.width}px` }}
              className="max-h-20 object-contain"
            />
          </div>
        )}

        {/* Upload button */}
        <div className="space-y-2">
          <button
            onClick={() => logoInputRef.current?.click()}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {config.logo.file ? 'Change logo' : 'Select logo'}
          </button>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />

          {config.logo.file && (
            <button
              onClick={() => updateLogo({ file: null })}
              className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Remove logo
            </button>
          )}
        </div>
      </div>

      {/* Logo Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Width
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="50"
            max="300"
            value={config.logo.width}
            onChange={handleLogoWidthChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center gap-1 w-20">
            <input
              type="number"
              value={config.logo.width}
              onChange={handleLogoWidthChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6" />

      {/* Favicon Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Favicon
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Displayed at 32 × 32px
        </p>

        {/* Favicon preview */}
        {config.favicon.file && (
          <div className="mb-3 p-4 bg-gray-50 rounded-md border border-gray-200">
            <img
              src={config.favicon.file}
              alt="Favicon preview"
              className="w-8 h-8 object-contain"
            />
          </div>
        )}

        {/* Upload button */}
        <div className="space-y-2">
          <button
            onClick={() => faviconInputRef.current?.click()}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {config.favicon.file ? 'Change favicon' : 'Select favicon'}
          </button>

          <input
            ref={faviconInputRef}
            type="file"
            accept="image/*"
            onChange={handleFaviconUpload}
            className="hidden"
          />

          {config.favicon.file && (
            <button
              onClick={() => updateFavicon({ file: null })}
              className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Remove favicon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoProperties;
