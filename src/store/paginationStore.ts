import { create } from 'zustand';

export interface PaginationData {
  currentPage?: number;
  totalPages?: number;
  totalElements?: number;
  size?: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
}

export interface PaginationRange {
  start: number;
  end: number;
  total: number;
}

export interface PaginatedApiResponse<T> {
  content?: T[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
}

export interface PaginationStore {
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;

  // Actions
  setCurrentPage: (page: number) => void;
  setPaginationData: (data: PaginationData) => void;
  resetPagination: () => void;

  // Helpers
  getPaginationState: () => PaginationState;
  getPaginationRange: () => PaginationRange;
  handlePaginatedResponse: <T>(result: PaginatedApiResponse<T> | T[], requestedPage: number, pageElements?: number) => T[];
  handlePageChange: (newPage: number, searchFunction?: (page: number) => void) => number;
}

const usePaginationStore = create<PaginationStore>((set, get) => ({
  // Pagination state
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 21,

  // Actions
  setCurrentPage: (page: number) => set({ currentPage: Math.max(0, page) }),

  setPaginationData: ({ currentPage, totalPages, totalElements, size }: PaginationData) => set({
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
  getPaginationState: (): PaginationState => {
    const state = get();
    return {
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      totalElements: state.totalElements,
      size: state.size
    };
  },

  // Helper to get pagination range display
  getPaginationRange: (): PaginationRange => {
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
  handlePaginatedResponse: <T>(result: PaginatedApiResponse<T> | T[], requestedPage: number, pageElements: number = 21): T[] => {
    const { setPaginationData } = get();

    if (result && typeof result === 'object' && 'content' in result && result.content) {
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
      const arrayResult = result as T[];
      setPaginationData({
        currentPage: 0,
        totalPages: Math.ceil(arrayResult.length / pageElements),
        totalElements: arrayResult.length,
        size: pageElements
      });
      return arrayResult;
    }
  },

  // Helper to handle page changes with search/filter logic
  handlePageChange: (newPage: number, searchFunction?: (page: number) => void): number => {
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
