export const minimalTheme = {
  id: 'minimal',
  name: 'Minimal Theme',
  colors: {
    primary: '#1f2937',         // gray-800
    primaryLight: '#f9fafb',    // gray-50
    primaryDark: '#111827',     // gray-900
    secondary: '#6b7280',       // gray-500
    text: '#374151',            // gray-700
    textDark: '#1f2937',        // gray-800
    background: '#ffffff',
    backgroundLight: '#f9fafb', // gray-50
    border: '#e5e7eb',          // gray-200
    success: '#10b981',         // emerald-500
    danger: '#ef4444',          // red-500
    warning: '#f59e0b'          // amber-500
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  fonts: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, monospace'
  },
  components: {
    header: {
      container: "w-full bg-white border-b border-gray-200",
      desktopContainer: "hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-none",
      mobileContainer: "lg:hidden",
      logo: "text-xl font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors",
      logoMobile: "text-xl font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors",
      navigation: "flex gap-6 text-gray-600",
      navigationLink: "hover:text-gray-900 transition-colors text-sm font-medium",
      searchContainer: "w-96 mx-6 relative",
      searchInput: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50",
      searchDropdown: "absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto",
      searchItem: "px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer",
      userAvatar: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white font-medium text-sm",
      userAvatarMobile: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white font-medium text-sm",
      userName: "text-gray-900 font-medium text-sm",
      dropdownArrow: "h-4 w-4 text-gray-500 transition-transform",
      userDropdown: "absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-30",
      userDropdownItem: "w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm",
      userDropdownLogout: "w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm",
      loginButton: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors text-sm font-medium",
      signupButton: "px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium",
      mobileTopBar: "flex items-center justify-between px-6 py-3",
      mobileMenuButton: "p-2 text-gray-600 hover:text-gray-900 transition-colors",
      mobileSearch: "px-6 py-3 border-t border-gray-100 bg-gray-50",
      mobileMenu: "px-6 py-3 bg-white border-t border-gray-200",
      mobileMenuNav: "space-y-3",
      mobileMenuLink: "block py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm",
      mobileUserInfo: "flex items-center gap-3 py-2",
      mobileButton: "block w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors text-center font-medium text-sm",
      mobileSignupButton: "block w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center font-medium text-sm",
      mobileLanguageSwitcher: "pt-3 border-t border-gray-200",
      themeButton: "p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
    },
    footer: {
      container: "bg-gray-900 text-white",
      content: "max-w-7xl mx-auto px-4 py-12",
      columnTitle: "text-lg font-semibold mb-4 text-gray-100",
      link: "text-gray-300 hover:text-white transition-colors cursor-pointer inline-block",
      divider: "border-t border-gray-700 pt-8",
      logoContainer: "text-gray-300",
      socialLink: "text-gray-400 hover:text-white transition-colors",
      copyright: "text-sm text-gray-400"
    },
    productCard: {
      container: "bg-white rounded-md border border-gray-200 p-2 flex flex-col items-center min-w-[120px] max-w-[140px] hover:border-gray-400 transition-colors cursor-pointer relative overflow-hidden",
      imageContainer: "w-20 h-28 flex items-center justify-center mb-2",
      contentContainer: "flex flex-col items-center",
      title: "text-base font-medium text-gray-900 mb-1 text-center",
      meta: "text-xs text-gray-500 text-center mb-1",
      price: "text-sm font-semibold text-gray-700"
    },
    searchGridCard: {
      container: "rounded-md border border-gray-200 hover:border-gray-400 transition-all cursor-pointer hover:shadow-sm overflow-hidden relative w-full max-w-sm mx-auto",
      available: "bg-white",
      unavailable: "bg-gray-100",
      imageContainer: "aspect-[3/4] bg-gray-50 rounded-t-md p-2",
      contentContainer: "p-3 relative min-h-[80px] flex flex-col",
      infoSection: "mb-2 flex-1",
      bottomSection: "mt-auto mb-2"
    }
  }
};