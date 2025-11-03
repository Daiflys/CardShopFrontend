import React from 'react';
import { useEditorStore } from '../store/editorStore';
import LogoProperties from './properties/LogoProperties';
import ColorsProperties from './properties/ColorsProperties';
import TypographyProperties from './properties/TypographyProperties';

const PropertiesPanel = () => {
  const { selectedSection } = useEditorStore();

  const renderProperties = () => {
    switch (selectedSection) {
      case 'logo':
        return <LogoProperties />;
      case 'colors':
        return <ColorsProperties />;
      case 'typography':
        return <TypographyProperties />;
      default:
        return (
          <div className="p-6 text-center text-gray-500">
            <p>Select a section to customize</p>
          </div>
        );
    }
  };

  return (
    <div className="properties-panel w-96 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 capitalize">
              {selectedSection}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Customize the appearance of your entire online store
            </p>
          </div>
        </div>
      </div>

      {/* Properties content */}
      <div className="p-6">
        {renderProperties()}
      </div>

      {/* Helper text */}
      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          Theme settings control the colors, typography and other common elements of your online store.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          When you edit theme settings, the changes apply to your <strong>entire online store</strong>.
        </p>
      </div>
    </div>
  );
};

export default PropertiesPanel;
