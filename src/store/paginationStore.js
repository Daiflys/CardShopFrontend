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
  }
}));

export default usePaginationStore;