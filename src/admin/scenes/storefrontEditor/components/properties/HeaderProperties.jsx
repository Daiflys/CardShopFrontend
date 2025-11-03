import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const HeaderProperties = () => {
  const { config, updateHeader } = useEditorStore();
  const header = config.header;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Announcement bar</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!header.showAnnouncementBar}
              onChange={(e) => updateHeader({ showAnnouncementBar: e.target.checked })}
            />
            Show announcement bar
          </label>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              value={header.announcementText}
              onChange={(e) => updateHeader({ announcementText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Welcome message"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
              <input
                type="color"
                value={header.announcementBg}
                onChange={(e) => updateHeader({ announcementBg: e.target.value })}
                className="w-full h-9 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text color</label>
              <input
                type="color"
                value={header.announcementTextColor}
                onChange={(e) => updateHeader({ announcementTextColor: e.target.value })}
                className="w-full h-9 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Header</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!header.stickyHeader}
              onChange={(e) => updateHeader({ stickyHeader: e.target.checked })}
            />
            Sticky header
          </label>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
              <input
                type="color"
                value={header.headerBg}
                onChange={(e) => updateHeader({ headerBg: e.target.value })}
                className="w-full h-9 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
              <input
                type="color"
                value={header.headerText}
                onChange={(e) => updateHeader({ headerText: e.target.value })}
                className="w-full h-9 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Border</label>
              <input
                type="color"
                value={header.headerBorder}
                onChange={(e) => updateHeader({ headerBorder: e.target.value })}
                className="w-full h-9 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderProperties;

