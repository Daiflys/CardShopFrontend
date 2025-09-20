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
    sans: 'ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, monospace'
  },
  components: {
    header: {
      container: "w-full bg-gradient-to-r from-sky-50 to-blue-50 shadow-md border-b border-sky-200",
      desktopContainer: "hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-none",
      mobileContainer: "lg:hidden",
      logo: "text-2xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors",
      logoMobile: "text-xl font-bold text-sky-700 cursor-pointer hover:text-sky-600 transition-colors",
      navigation: "flex gap-4 text-slate-600",
      navigationLink: "hover:text-sky-600 transition-colors",
      searchContainer: "flex-1 mx-6 relative",
      searchInput: "w-full px-3 py-2 border border-sky-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80",
      searchDropdown: "absolute z-[60] left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto",
      searchItem: "px-4 py-3 hover:bg-sky-50 border-b border-sky-100 last:border-b-0 cursor-pointer",
      userAvatar: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold shadow-md",
      userAvatarMobile: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-sm",
      userName: "text-sky-700 font-semibold",
      dropdownArrow: "h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform",
      userDropdown: "absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg overflow-hidden z-30",
      userDropdownItem: "w-full text-left px-4 py-2 hover:bg-sky-50 text-slate-700",
      userDropdownLogout: "w-full text-left px-4 py-2 hover:bg-red-50 text-red-600",
      loginButton: "px-4 py-2 border border-sky-300 rounded hover:bg-sky-50 text-sky-700 transition-colors",
      signupButton: "px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded hover:from-sky-700 hover:to-blue-700 transition-all shadow-md",
      mobileTopBar: "flex items-center justify-between px-4 py-3",
      mobileMenuButton: "p-2 text-sky-700 hover:bg-sky-100 rounded-md transition-colors",
      mobileSearch: "px-4 pb-3 border-b border-sky-200",
      mobileMenu: "px-4 py-3 bg-white border-b border-sky-200",
      mobileMenuNav: "space-y-3",
      mobileMenuLink: "block py-2 text-slate-600 hover:text-sky-600 transition-colors font-medium",
      mobileUserInfo: "flex items-center gap-3 py-2",
      mobileButton: "block w-full px-4 py-3 border border-sky-300 rounded-md hover:bg-sky-50 text-sky-700 transition-colors text-center font-medium",
      mobileSignupButton: "block w-full px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-md hover:from-sky-700 hover:to-blue-700 transition-all shadow-md text-center font-medium",
      mobileLanguageSwitcher: "pt-3 border-t border-sky-200",
      themeButton: "p-2 text-sky-700 hover:bg-sky-100 rounded-md transition-colors"
    }
  }
};