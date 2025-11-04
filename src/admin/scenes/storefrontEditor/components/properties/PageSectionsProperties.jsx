import React from 'react';
import { useEditorStore } from '../../store/editorStore';

const defaultMiniBanner = () => ({
  type: 'miniBanner',
  enabled: true,
  settings: {
    text: 'Welcome to our TCG Shop',
    linkUrl: '/',
    background: '#f3f4f6',
    textColor: '#111827',
    height: 160,
    align: 'center'
  }
});

const defaultRichText = () => ({
  type: 'richText',
  enabled: true,
  settings: {
    title: 'Your title here',
    body: 'Tell your customers something about your store.',
    align: 'center',
    background: '#ffffff',
    textColor: '#111827',
    padding: 24,
    buttonLabel: 'Shop now',
    buttonUrl: '/',
  }
});

const PageSectionsProperties = () => {
  const {
    config,
    addPageSection,
    updatePageSection,
    removePageSection,
    movePageSection,
    togglePageSection,
  } = useEditorStore();

  const sections = config.pages?.home?.sections || [];

  const addMiniBanner = () => {
    addPageSection('home', defaultMiniBanner());
  };
  const addRichText = () => {
    addPageSection('home', defaultRichText());
  };

  const renderEditor = (section, idx) => {
    if (section.type === 'miniBanner') {
      const s = section.settings || {};
      const onUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          updatePageSection('home', section.id, { settings: { ...s, backgroundImage: reader.result } });
        };
        reader.readAsDataURL(file);
      };
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={s.showText !== false}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, showText: e.target.checked } })}
              />
              Show text
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={!!s.overlayEnabled}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, overlayEnabled: e.target.checked } })}
              />
              Image overlay
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={!!s.showButton}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, showButton: e.target.checked } })}
              />
              Show button
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
              <input
                type="text"
                value={s.text || ''}
                disabled={s.showText === false}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, text: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Link URL</label>
              <input
                type="text"
                value={s.linkUrl || ''}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, linkUrl: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
              <input
                type="color"
                value={s.background || '#f3f4f6'}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, background: e.target.value } })}
                className="w-full h-9 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text color</label>
              <input
                type="color"
                value={s.textColor || '#111827'}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, textColor: e.target.value } })}
                className="w-full h-9 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
              <input
                type="number"
                min="80"
                max="300"
                value={s.height || 160}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, height: parseInt(e.target.value || '0', 10) } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Overlay options */}
          {s.overlayEnabled && (
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Overlay color</label>
                <input
                  type="color"
                  value={s.overlayColor || '#000000'}
                  onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, overlayColor: e.target.value } })}
                  className="w-full h-9 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Overlay opacity (%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={s.overlayOpacity ?? 35}
                    onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, overlayOpacity: parseInt(e.target.value || '0', 10) } })}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={s.overlayOpacity ?? 35}
                    onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, overlayOpacity: parseInt(e.target.value || '0', 10) } })}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm text-center"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Background image</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Image URL or base64"
                value={s.backgroundImage || ''}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, backgroundImage: e.target.value } })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <label className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 cursor-pointer">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
              </label>
              {s.backgroundImage && (
                <button
                  onClick={() => updatePageSection('home', section.id, { settings: { ...s, backgroundImage: '' } })}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-md text-sm bg-white hover:bg-red-50"
                >
                  Clear
                </button>
              )}
            </div>
            {s.backgroundImage && (
              <div className="mt-2 border border-gray-200 rounded p-2 bg-gray-50">
                <img src={s.backgroundImage} alt="Preview" className="max-h-24 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={s.align || 'center'}
              onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, align: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          {/* Border radius */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Border radius (px)</label>
            <input
              type="number"
              min="0"
              max="32"
              value={s.borderRadius ?? 8}
              onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, borderRadius: parseInt(e.target.value || '0', 10) } })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Button options */}
          {s.showButton && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Button label</label>
                <input
                  type="text"
                  value={s.buttonLabel || ''}
                  onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, buttonLabel: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Button URL</label>
                <input
                  type="text"
                  value={s.buttonUrl || ''}
                  onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, buttonUrl: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Button background</label>
                <input
                  type="color"
                  value={s.buttonBg || '#0284c7'}
                  onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, buttonBg: e.target.value } })}
                  className="w-full h-9 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Button text color</label>
                <input
                  type="color"
                  value={s.buttonTextColor || '#ffffff'}
                  onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, buttonTextColor: e.target.value } })}
                  className="w-full h-9 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      );
    }
    if (section.type === 'richText') {
      const s = section.settings || {};
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={s.title || ''}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, title: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Button label</label>
              <input
                type="text"
                value={s.buttonLabel || ''}
                onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, buttonLabel: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Body</label>
            <textarea
              rows={4}
              value={s.body || ''}
              onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, body: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
              <input type="color" value={s.background || '#ffffff'} onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, background: e.target.value } })} className="w-full h-9 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text color</label>
              <input type="color" value={s.textColor || '#111827'} onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, textColor: e.target.value } })} className="w-full h-9 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Padding (px)</label>
              <input type="number" min="0" max="96" value={s.padding || 24} onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, padding: parseInt(e.target.value || '0', 10) } })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Button URL</label>
              <input type="text" value={s.buttonUrl || ''} onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, buttonUrl: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
              <select value={s.align || 'center'} onChange={(e) => updatePageSection('home', section.id, { settings: { ...s, align: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="text-xs text-gray-500">No editor available for this section type.</div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Home page sections</h4>
        <div className="flex gap-2">
          <button
            onClick={addMiniBanner}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add Mini Banner
          </button>
          <button
            onClick={addRichText}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Add Rich Text
          </button>
        </div>
      </div>

      {sections.length === 0 && (
        <div className="p-4 border border-dashed border-gray-300 rounded-md text-sm text-gray-600">
          No sections yet. Click “Add Mini Banner” to get started.
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div key={section.id} className="border border-gray-200 rounded-md">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-gray-200 text-gray-700 text-xs font-bold">{idx + 1}</span>
                <span className="text-sm font-medium text-gray-800 capitalize">{section.type}</span>
                <label className="flex items-center gap-2 ml-3 text-xs text-gray-700">
                  <input type="checkbox" checked={!!section.enabled} onChange={(e) => togglePageSection('home', section.id, e.target.checked)} />
                  Enabled
                </label>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => movePageSection('home', section.id, idx - 1)} disabled={idx === 0} className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40">Up</button>
                <button onClick={() => movePageSection('home', section.id, idx + 1)} disabled={idx === sections.length - 1} className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40">Down</button>
                <button onClick={() => removePageSection('home', section.id)} className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded">Delete</button>
              </div>
            </div>
            <div className="p-3">
              {renderEditor(section, idx)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSectionsProperties;
