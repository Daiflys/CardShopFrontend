import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from './store/editorStore';
import Sidebar from './components/Sidebar';
import PreviewFrame from './components/PreviewFrame';
import PropertiesPanel from './components/PropertiesPanel';

const StorefrontEditor = () => {
  const navigate = useNavigate();
  const { save, isDirty, isSaving, lastSaved, config, setApplyToSiteAndSave } = useEditorStore();

  const [currentPage, setCurrentPage] = useState('home'); // For future: home, product, cart, etc.
  const [viewport, setViewport] = useState('desktop');


  const handleSave = () => {
    const success = save();
    if (success) {
      // TODO: Show success toast
      console.log('✅ Configuration saved!');
    } else {
      // TODO: Show error toast
      console.error('❌ Failed to save configuration');
    }
  };

  const handleExit = () => {
    if (isDirty) {
      const confirm = window.confirm(
        'You have unsaved changes. Are you sure you want to exit?'
      );
      if (!confirm) return;
    }
    navigate('/admin');
  };

  return (
    <div className="storefront-editor h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="top-bar bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-20">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            title="Exit editor"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">Storefront Editor</h1>
            <p className="text-xs text-gray-500">
              {lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleTimeString()}` : 'Not saved yet'}
            </p>
          </div>
        </div>

        {/* Center: Page selector (future) */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Home page</span>
          {/* Future: Dropdown for multiple pages */}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Apply to site toggle */}
          <div className="flex items-center gap-3 mr-3" title="Apply changes to the live site">
            <span className="text-xs font-medium text-gray-700">Apply to site</span>
            <button
              onClick={() => setApplyToSiteAndSave(!config.applyToSite)}
              role="switch"
              aria-checked={config.applyToSite}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.applyToSite ? 'bg-emerald-500 focus:ring-emerald-400' : 'bg-gray-300 focus:ring-gray-400'}`}
            >
              {/* Knob */}
              <span
                className={`absolute top-1 left-1 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${config.applyToSite ? 'translate-x-7' : 'translate-x-0'}`}
                aria-hidden="true"
              >
                {config.applyToSite ? (
                  <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.42l2.293 2.293 6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 10-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 10-1.06-1.06L10 8.94 6.28 5.22z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {/* ON/OFF label inside track for clarity */}
              <span className={`mx-auto text-[10px] font-bold tracking-wide ${config.applyToSite ? 'text-white' : 'text-gray-700'}`}>
                {config.applyToSite ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
          {/* Dirty indicator */}
          {isDirty && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="4" />
              </svg>
              Unsaved changes
            </span>
          )}

          {/* Preview toggles (future: desktop/mobile) */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewport === 'desktop'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Desktop view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewport === 'mobile'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Mobile view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>


          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isDirty && !isSaving
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Content: 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Sections & Settings */}
        <Sidebar />

        {/* Center: Preview iframe */}
        <PreviewFrame viewport={viewport} />

        {/* Right Panel: Properties of selected element */}
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default StorefrontEditor;
