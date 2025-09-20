import React from "react";

const DefaultHeader = ({
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
      className={theme.components.header.container}
    >
      {/* Desktop Header */}
      <div className={theme.components.header.desktopContainer}>
        {/* Logo and Navigation */}
        <div className="flex items-center gap-4">
          {logo}
          <nav className={theme.components.header.navigation}>
            {navigation}
          </nav>
        </div>

        {/* Search */}
        <div className={theme.components.header.searchContainer}>
          {searchComponent}
        </div>

        {/* User Menu and Language */}
        <div className="flex gap-4 items-center">
          {userMenu}
          {languageSwitcher}
        </div>
      </div>

      {/* Mobile Header */}
      <div className={theme.components.header.mobileContainer}>
        {/* Top bar with logo and hamburger */}
        <div className={theme.components.header.mobileTopBar}>
          {logo}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileSearchToggle}
              className={theme.components.header.mobileMenuButton}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={onMobileMenuToggle}
              className={theme.components.header.mobileMenuButton}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className={theme.components.header.mobileSearch}>
            {searchComponent}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={theme.components.header.mobileMenu}>
            <nav className={theme.components.header.mobileMenuNav}>
              {navigation && (
                <div className="space-y-2 mb-4 pb-4 border-b border-sky-200">
                  <a
                    href="/search"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/search';
                    }}
                    className={theme.components.header.mobileMenuLink}
                  >
                    Search
                  </a>
                  <a
                    href="/advanced-search"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/advanced-search';
                    }}
                    className={theme.components.header.mobileMenuLink}
                  >
                    Advanced Search
                  </a>
                </div>
              )}
              {userMenu}
              <div className={theme.components.header.mobileLanguageSwitcher}>
                {languageSwitcher}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default DefaultHeader;