import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const ProductCardProperties = () => {
  const { config, updateProductCards } = useEditorStore();
  const pc = config.productCards;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Image ratio</label>
            <select
              value={pc.imageRatio}
              onChange={(e) => updateProductCards({ imageRatio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="1/1">1:1</option>
              <option value="3/4">3:4</option>
              <option value="2/3">2:3</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Density</label>
            <select
              value={pc.density}
              onChange={(e) => updateProductCards({ density: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Meta</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!pc.showCondition}
              onChange={(e) => updateProductCards({ showCondition: e.target.checked })}
            />
            Show condition
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!pc.showSet}
              onChange={(e) => updateProductCards({ showSet: e.target.checked })}
            />
            Show set
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!pc.showSeller}
              onChange={(e) => updateProductCards({ showSeller: e.target.checked })}
            />
            Show seller
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductCardProperties;

