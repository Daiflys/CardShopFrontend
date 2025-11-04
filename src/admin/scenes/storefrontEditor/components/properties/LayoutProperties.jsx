import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const LayoutProperties = () => {
  const { config, updateLayout } = useEditorStore();
  const layout = config.layout;

  const handleNumber = (key) => (e) => {
    const value = parseInt(e.target.value || '0', 10);
    updateLayout({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Container</h4>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max width (px)</label>
            <input
              type="number"
              min="800"
              max="1800"
              step="20"
              value={layout.containerMaxWidth}
              onChange={handleNumber('containerMaxWidth')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Spacing</h4>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Section spacing (px)</label>
            <input
              type="number"
              min="0"
              max="96"
              step="4"
              value={layout.sectionSpacing}
              onChange={handleNumber('sectionSpacing')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Card gap (px)</label>
            <input
              type="number"
              min="0"
              max="48"
              step="2"
              value={layout.cardGap}
              onChange={handleNumber('cardGap')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutProperties;

