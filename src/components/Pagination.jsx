import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "" 
}) => {
  console.log('Pagination props:', { currentPage, totalPages });
  
  // Ensure currentPage and totalPages are valid numbers
  const validCurrentPage = Math.max(0, Math.floor(Number(currentPage) || 0));
  const validTotalPages = Math.max(0, Math.floor(Number(totalPages) || 0));
  
  if (validTotalPages <= 1) {
    return (
      <div className={`flex items-center justify-center space-x-1 mt-6 ${className}`}>
        <span className="text-sm text-gray-500">
          Page {validCurrentPage + 1} of {validTotalPages || 1} 
          {validTotalPages === 0 && " (No results)"}
        </span>
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    const validPage = Math.max(0, Math.min(validTotalPages - 1, Math.floor(Number(newPage) || 0)));
    console.log('Pagination: changing from page', validCurrentPage, 'to page', validPage);
    if (validPage !== validCurrentPage) {
      onPageChange(validPage);
    }
  };

  const getVisiblePages = () => {
    const maxVisible = 7;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let start = Math.max(0, validCurrentPage - halfVisible);
    let end = Math.min(validTotalPages - 1, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showFirstEllipsis = visiblePages[0] > 0;
  const showLastEllipsis = visiblePages[visiblePages.length - 1] < validTotalPages - 1;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1 mt-6 ${className}`}>
      {/* Previous button with arrow */}
      <button
        onClick={() => handlePageChange(validCurrentPage - 1)}
        disabled={validCurrentPage === 0}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
          validCurrentPage === 0
            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white border border-gray-300'
        }`}
      >
        <span>←</span>
        Previous
      </button>

      {/* First page */}
      {showFirstEllipsis && (
        <>
          <button
            onClick={() => handlePageChange(0)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              validCurrentPage === 0
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white border border-gray-300'
            }`}
          >
            1
          </button>
          <span className="px-2 py-2 text-gray-500">...</span>
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-[40px] ${
            validCurrentPage === page
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white border border-gray-300'
          }`}
        >
          {page + 1}
        </button>
      ))}

      {/* Last page */}
      {showLastEllipsis && (
        <>
          <span className="px-2 py-2 text-gray-500">...</span>
          <button
            onClick={() => handlePageChange(validTotalPages - 1)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              validCurrentPage === validTotalPages - 1
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white border border-gray-300'
            }`}
          >
            {validTotalPages}
          </button>
        </>
      )}

      {/* Next button with arrow */}
      <button
        onClick={() => handlePageChange(validCurrentPage + 1)}
        disabled={validCurrentPage === validTotalPages - 1}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
          validCurrentPage === validTotalPages - 1
            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-white border border-gray-300'
        }`}
      >
        Next
        <span>→</span>
      </button>
      
      {/* Page info */}
      <div className="ml-4 text-sm text-gray-600">
        Page {validCurrentPage + 1} of {validTotalPages}
      </div>
    </div>
  );
};

export default Pagination;