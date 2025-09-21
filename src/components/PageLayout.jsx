import React, { useState } from 'react';

const PageLayout = ({
  children,
  sidebar = null,
  sidebarTitle = "Filters",
  showMobileSidebarButton = true,
  containerClassName = "",
  sidebarClassName = "",
  contentClassName = "",
  maxWidth = "max-w-7xl"
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If no sidebar provided, just render content in centered layout
  if (!sidebar) {
    return (
      <div className={`${maxWidth} mx-auto px-4 py-8 ${containerClassName}`}>
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${maxWidth} mx-auto px-4 py-8 ${containerClassName}`}>
      <div className="lg:flex gap-6">
        {/* Mobile Sidebar Button */}
        {showMobileSidebarButton && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {sidebarTitle}
            </button>
          </div>
        )}

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Left Sidebar */}
        <div className={`
          lg:w-80 lg:flex-shrink-0 lg:relative lg:translate-x-0 lg:bg-transparent lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out
          lg:block ${sidebarClassName}
        `}>
          <div className="lg:sticky lg:top-8 h-full lg:h-auto overflow-y-auto lg:overflow-visible">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">{sidebarTitle}</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 lg:p-0">
              {sidebar}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 lg:min-w-0 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;