import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const TypographyProperties = () => {
  const { config, updateTypography } = useEditorStore();

  // Common fonts (you can expand this list)
  const fonts = [
    'Assistant',
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Ubuntu',
    'Nunito',
  ];

  const handleHeadingsFontChange = (e) => {
    updateTypography('headings', { font: e.target.value });
  };

  const handleHeadingsScaleChange = (e) => {
    updateTypography('headings', { scale: parseInt(e.target.value) });
  };

  const handleBodyFontChange = (e) => {
    updateTypography('body', { font: e.target.value });
  };

  const handleBodyScaleChange = (e) => {
    updateTypography('body', { scale: parseInt(e.target.value) });
  };

  return (
    <div className="space-y-8">
      {/* Headings */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Headings</h4>

        {/* Font selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Font
          </label>
          <div className="relative">
            <select
              value={config.typography.headings.font}
              onChange={handleHeadingsFontChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
              style={{ fontFamily: config.typography.headings.font }}
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scale slider */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Scale
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="80"
              max="150"
              step="5"
              value={config.typography.headings.scale}
              onChange={handleHeadingsScaleChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center gap-1 w-16">
              <input
                type="number"
                min="80"
                max="150"
                value={config.typography.headings.scale}
                onChange={handleHeadingsScaleChange}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h1
            style={{
              fontFamily: config.typography.headings.font,
              fontSize: `${config.typography.headings.scale}%`
            }}
            className="text-2xl font-bold text-gray-900"
          >
            Heading Preview
          </h1>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Body */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Body</h4>

        {/* Font selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Font
          </label>
          <div className="relative">
            <select
              value={config.typography.body.font}
              onChange={handleBodyFontChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
              style={{ fontFamily: config.typography.body.font }}
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scale slider */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Scale
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="80"
              max="150"
              step="5"
              value={config.typography.body.scale}
              onChange={handleBodyScaleChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center gap-1 w-16">
              <input
                type="number"
                min="80"
                max="150"
                value={config.typography.body.scale}
                onChange={handleBodyScaleChange}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p
            style={{
              fontFamily: config.typography.body.font,
              fontSize: `${config.typography.body.scale}%`
            }}
            className="text-base text-gray-700 leading-relaxed"
          >
            The quick brown fox jumps over the lazy dog. This is a preview of your body text with the selected font and scale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypographyProperties;
