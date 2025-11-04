import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const ColorsProperties = () => {
  const { config, setActiveColorScheme } = useEditorStore();

  const handleSchemeSelect = (schemeId) => {
    setActiveColorScheme(schemeId);
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-xs text-blue-800 leading-relaxed">
          Color schemes can be applied to sections throughout your online store.
        </p>
      </div>

      {/* Schemes heading */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Schemes</h4>
        <p className="text-xs text-gray-500 mb-4">
          Select a color scheme to apply across your store
        </p>
      </div>

      {/* Color scheme grid */}
      <div className="grid grid-cols-2 gap-3">
        {config.colors.schemes.map((scheme) => {
          const isActive = scheme.id === config.colors.activeSchemeId;

          return (
            <button
              key={scheme.id}
              onClick={() => handleSchemeSelect(scheme.id)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Scheme preview */}
              <div className="mb-2 h-16 rounded-md overflow-hidden border border-gray-200">
                <div className="h-1/3" style={{ backgroundColor: scheme.colors.background }} />
                <div className="h-1/3" style={{ backgroundColor: scheme.colors.accent1 }} />
                <div className="h-1/3" style={{ backgroundColor: scheme.colors.accent2 }} />
              </div>

              {/* Scheme name */}
              <div className="text-xs font-medium text-gray-900">{scheme.name}</div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}

        {/* Add new scheme button (placeholder for future) */}
        <button
          className="p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center min-h-[100px] text-gray-400 hover:text-gray-600"
          disabled
          title="Coming soon"
        >
          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-medium">Add Scheme</span>
        </button>
      </div>

      {/* Active scheme details */}
      {config.colors.activeSchemeId && (
        <>
          <div className="border-t border-gray-200 my-6" />

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Active Scheme: {config.colors.schemes.find(s => s.id === config.colors.activeSchemeId)?.name}
            </h4>

            <div className="space-y-3">
              {Object.entries(
                config.colors.schemes.find(s => s.id === config.colors.activeSchemeId)?.colors || {}
              ).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: value }}
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorsProperties;
