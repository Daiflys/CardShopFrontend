export const lineLimiterTheme = {
  id: 'line-limiter',
  name: 'Line Limiter',
  components: {
    header: {
      container: "sticky top-0 z-[100] bg-blue-600 text-white shadow-lg",
      wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      content: "flex items-center justify-between h-16",
      leftSection: "flex items-center space-x-8",
      logo: "text-xl font-bold text-white",
      navigation: "hidden md:flex space-x-6 ml-4",
      centerSection: "flex-1 max-w-lg mx-8",
      rightSection: "flex items-center space-x-4",
      languageSwitcher: ""
    },
    footer: {
      container: "bg-gray-800 text-white",
      wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
      content: "",
      sectionsContainer: "grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-6 mb-6",
      section: "",
      sectionTitle: "text-lg font-bold mb-4 text-blue-400",
      sectionContent: "space-y-2",
      link: "text-gray-300 hover:text-white transition-colors cursor-pointer",
      bottomSection: "flex flex-col md:flex-row justify-between items-center gap-4",
      logoContainer: "",
      socialContainer: "flex space-x-4",
      copyrightContainer: "text-gray-400"
    },
    productCard: {
      container: "bg-white border-2 border-black shadow-none p-3 flex flex-col items-center min-w-[140px] max-w-[160px] hover:border-gray-700 transition-colors cursor-pointer relative overflow-hidden",
      imageContainer: "w-24 h-32 flex items-center justify-center mb-2 border border-black p-1",
      contentContainer: "flex flex-col items-center border-t border-black pt-2 w-full",
      title: "text-lg font-bold text-black mb-1 border-b border-black pb-1 text-center",
      meta: "text-xs text-black text-center mb-1 border-b border-gray-400 pb-1",
      price: "text-sm font-semibold text-black border border-black px-2 py-1"
    },
    searchGridCard: {
      container: "border-2 border-red-600 hover:border-red-800 transition-all cursor-pointer shadow-none overflow-hidden relative w-full max-w-sm mx-auto bg-white",
      available: "bg-white",
      unavailable: "bg-gray-100",
      imageContainer: "aspect-[3/4] bg-gray-50 border-b-2 border-red-600 p-2",
      contentContainer: "p-3 relative min-h-[80px] flex flex-col border-b-2 border-red-600",
      infoSection: "mb-2 flex-1 border border-black p-2",
      cardWrapper: "border-2 border-black bg-white m-1 p-2"
    }
  }
};