import { create } from 'zustand';

const usePaginationStore = create((set, get) => ({
  // Pagination state
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 21,
  
  // Actions
  setCurrentPage: (page) => set({ currentPage: Math.max(0, page) }),
  
  setPaginationData: ({ currentPage, totalPages, totalElements, size }) => set({
    currentPage: Math.max(0, currentPage || 0),
    totalPages: Math.max(0, totalPages || 0),
    totalElements: Math.max(0, totalElements || 0),
    size: size || 21
  }),
  
  resetPagination: () => set({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 21
  }),
  
  // Helper to get current pagination state
  getPaginationState: () => {
    const state = get();
    return {
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      totalElements: state.totalElements,
      size: state.size
    };
  },

  // Helper to get pagination range display
  getPaginationRange: () => {
    const state = get();
    if (state.totalElements === 0) return { start: 0, end: 0, total: 0 };

    const start = (state.currentPage) * state.size + 1;
    const end = Math.min((state.currentPage + 1) * state.size, state.totalElements);

    return {
      start,
      end,
      total: state.totalElements
    };
  },

  // Helper to handle paginated API response
  handlePaginatedResponse: (result, requestedPage, defaultSize = 21) => {
    const { setPaginationData } = get();

    if (result.content) {
      // Server response with pagination metadata
      setPaginationData({
        currentPage: requestedPage, // Use requested page for consistency
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        size: result.size
      });
      return result.content;
    } else {
      // Non-paginated response (array)
      setPaginationData({
        currentPage: 0,
        totalPages: Math.ceil(result.length / defaultSize),
        totalElements: result.length,
        size: defaultSize
      });
      return result;
    }
  },

  // Helper to handle page changes with search/filter logic
  handlePageChange: (newPage, searchFunction) => {
    const { setCurrentPage } = get();

    // Ensure newPage is a valid number, default to 0 if invalid
    const validPage = isNaN(newPage) ? 0 : Math.max(0, Math.floor(Number(newPage)));

    console.log('PaginationStore: handlePageChange called with', newPage, 'validated to', validPage);

    // Update the page in store first
    setCurrentPage(validPage);

    // Execute the search/filter function if provided
    if (searchFunction) {
      searchFunction(validPage);
    }

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return validPage;
  }
}));

export default usePaginationStore;