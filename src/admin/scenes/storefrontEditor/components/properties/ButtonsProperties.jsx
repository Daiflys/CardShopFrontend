import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const ButtonsProperties = () => {
  const { config, updateButtons } = useEditorStore();
  const btn = config.buttons;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Shape & casing</h4>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Radius</label>
            <select
              value={btn.radius}
              onChange={(e) => updateButtons({ radius: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="0px">Square</option>
              <option value="4px">Small</option>
              <option value="8px">Medium</option>
              <option value="9999px">Pill</option>
            </select>
          </div>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!btn.uppercase}
              onChange={(e) => updateButtons({ uppercase: e.target.checked })}
            />
            Uppercase text
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Primary style</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
            <input
              type="color"
              value={btn.primaryBg}
              onChange={(e) => updateButtons({ primaryBg: e.target.value })}
              className="w-full h-9 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Hover</label>
            <input
              type="color"
              value={btn.primaryBgHover}
              onChange={(e) => updateButtons({ primaryBgHover: e.target.value })}
              className="w-full h-9 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
            <input
              type="color"
              value={btn.primaryText}
              onChange={(e) => updateButtons({ primaryText: e.target.value })}
              className="w-full h-9 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonsProperties;

