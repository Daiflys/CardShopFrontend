export const defaultTheme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#0284c7',         // sky-600
    primaryLight: '#f0f9ff',    // sky-50
    primaryDark: '#0369a1',     // sky-700
    secondary: '#0f172a',       // slate-900
    text: '#475569',            // slate-600
    textDark: '#1e293b',        // slate-800
    background: '#ffffff',
    backgroundLight: '#f8fafc', // slate-50
    border: '#e2e8f0',          // slate-200
    success: '#059669',         // emerald-600
    danger: '#dc2626',          // red-600
    warning: '#d97706'          // amber-600
  },
  spacing: {
    xs: '0.25rem',   // 1
    sm: '0.5rem',    // 2
    md: '1rem',      // 4
    lg: '1.5rem',    // 6
    xl: '2rem',      // 8
    '2xl': '3rem'    // 12
  },
  borderRadius: {
    sm: '0.125rem',  // rounded-sm
    md: '0.375rem',  // rounded-md
    lg: '0.5rem',    // rounded-lg
    full: '9999px'   // rounded-full
  },
  fonts: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "Menlo", "Monaco", "Cascadia Code", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace'
  },
  typography: {
    h1: 'text-3xl lg:text-4xl font-bold text-gray-900 leading-tight',
    h2: 'text-2xl lg:text-3xl font-bold text-gray-900 leading-tight',
    h3: 'text-xl lg:text-2xl font-semibold text-gray-900 leading-tight',
    h4: 'text-lg lg:text-xl font-semibold text-gray-900 leading-tight',
    body: 'text-base text-gray-700 leading-relaxed',
    bodySmall: 'text-sm text-gray-600 leading-relaxed',
    caption: 'text-xs text-gray-500 leading-normal'
  },
  layout: {
    containerPadding: 'px-4 sm:px-6 lg:px-8',
    sectionSpacing: 'py-8 lg:py-12',
    cardSpacing: 'p-4 lg:p-6',
    buttonHeight: 'min-h-[44px]',
    inputHeight: 'min-h-[44px]'
  },
  components: {
    header: {
      container: "sticky top-0 z-50 w-full bg-gradient-to-r from-sky-50 to-blue-50 shadow-md border-b border-sky-200 font-sans",
      desktopContainer: "hidden lg:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 w-full max-w-none gap-4",
      mobileContainer: "lg:hidden",
      logo: "text-2xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors whitespace-nowrap",
      logoMobile: "text-xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors whitespace-nowrap",
      navigation: "flex gap-4 text-slate-600",
      navigationLink: "hover:text-sky-600 transition-colors",
      searchContainer: "w-96 mx-6 relative",
      searchInput: "w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80 text-base min-h-[44px]",
      searchDropdown: "absolute z-[60] left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto",
      searchItem: "px-4 py-3 hover:bg-sky-50 border-b border-sky-100 last:border-b-0 cursor-pointer",
      userAvatar: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold shadow-md",
      userAvatarMobile: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-sm",
      userName: "text-sky-700 font-semibold",
      dropdownArrow: "h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform",
      userDropdown: "absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg overflow-hidden z-30",
      userDropdownItem: "w-full text-left px-4 py-3 hover:bg-sky-50 text-slate-700 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
      userDropdownLogout: "w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2",
      loginButton: "px-2 sm:px-3 md:px-4 py-2 border border-sky-300 rounded hover:bg-sky-50 text-sky-700 transition-colors whitespace-nowrap min-h-[44px] h-11 flex items-center justify-center text-sm lg:text-base shrink-0",
      signupButton: "px-2 sm:px-3 md:px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded hover:from-sky-700 hover:to-blue-700 transition-all shadow-md whitespace-nowrap min-h-[44px] h-11 flex items-center justify-center text-sm lg:text-base shrink-0",
      mobileTopBar: "flex items-center justify-between px-4 sm:px-6 py-3",
      mobileMenuButton: "p-3 text-sky-700 hover:bg-sky-100 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
      mobileSearch: "px-4 sm:px-6 pb-3 border-b border-sky-200",
      mobileMenu: "px-4 sm:px-6 py-3 bg-white border-b border-sky-200",
      mobileMenuNav: "space-y-3",
      mobileMenuLink: "block py-3 px-2 text-slate-600 hover:text-sky-600 transition-colors font-medium min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-md",
      mobileUserInfo: "flex items-center gap-3 py-2",
      mobileButton: "block w-full px-4 py-3 border border-sky-300 rounded-md hover:bg-sky-50 text-sky-700 transition-colors text-center font-medium min-h-[44px] whitespace-nowrap flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
      mobileSignupButton: "block w-full px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-md hover:from-sky-700 hover:to-blue-700 transition-all shadow-md text-center font-medium min-h-[44px] whitespace-nowrap flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
      mobileLanguageSwitcher: "pt-3 border-t border-sky-200",
      themeButton: "p-2 text-sky-700 hover:bg-sky-100 rounded-md transition-colors"
    },
    footer: {
      container: "bg-gradient-to-r from-slate-900 to-slate-800 text-white",
      content: "max-w-7xl mx-auto px-4 py-12",
      columnTitle: "text-lg font-semibold mb-4 text-sky-300",
      link: "text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block",
      divider: "border-t border-slate-700 pt-8",
      logoContainer: "text-sky-300",
      socialLink: "text-slate-400 hover:text-sky-300 transition-colors",
      copyright: "text-sm text-slate-400"
    },
    productCard: {
      container: "bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden",
      imageContainer: "w-24 h-32 flex items-center justify-center mb-2",
      contentContainer: "flex flex-col items-center",
      title: "text-lg font-bold text-blue-800 mb-1",
      meta: "text-xs text-gray-500 text-center mb-1",
      price: "text-sm font-semibold text-green-600"
    },
    searchGridCard: {
      container: "rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-md overflow-hidden relative w-full max-w-sm mx-auto",
      available: "bg-white",
      unavailable: "bg-gray-300",
      imageContainer: "aspect-[3/4] bg-gray-50 rounded-t-lg p-2 sm:p-3",
      contentContainer: "p-3 sm:p-4 relative min-h-[100px] sm:min-h-[120px] flex flex-col",
      infoSection: "mb-2 sm:mb-3 flex-1",
      bottomSection: "mt-auto mb-2 sm:mb-3"
    }
  }
};