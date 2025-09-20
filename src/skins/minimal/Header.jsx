import React from "react";

const MinimalHeader = ({
  theme,
  logo,
  navigation,
  searchComponent,
  userMenu,
  languageSwitcher,
  mobileMenuOpen,
  mobileSearchOpen,
  onMobileMenuToggle,
  onMobileSearchToggle
}) => {
  return (
    <header
      className="w-full bg-white border-b border-gray-200"
    >
      {/* Single row layout - Minimal design */}
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          {logo}
        </div>

        {/* Desktop: Search in center */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          {searchComponent}
        </div>

        {/* Right side: User menu + language */}
        <div className="flex items-center gap-4">
          {/* Mobile search toggle */}
          <button
            onClick={onMobileSearchToggle}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {userMenu}
          {languageSwitcher}
        </div>
      </div>

      {/* Mobile search dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden px-6 py-3 border-t border-gray-100 bg-gray-50">
          {searchComponent}
        </div>
      )}
    </header>
  );
};

export default MinimalHeader;