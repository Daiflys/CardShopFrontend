import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchCards, searchCardsBySet } from '../api/search';
import SearchGridCard from '../components/SearchGridCard';
import SearchListCard from '../components/SearchListCard';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import useSearchFiltersStore from '../store/searchFiltersStore';
import usePaginationStore from '../store/paginationStore';

const Search = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const setFilter = searchParams.get('set');
  const { resetFilters } = useSearchFiltersStore();
  const {
    currentPage,
    totalPages,
    resetPagination,
    getPaginationRange,
    handlePaginatedResponse,
    handlePageChange
  } = usePaginationStore();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [rarityFilter, setRarityFilter] = useState('all');
  const [currentFilters, setCurrentFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingFiltersRef = useRef(null);
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    // Skip search if it was already executed from handleFilteredSearch
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    
    if (query) {
      // Use pendingFilters if available (from filtered search), otherwise just query
      const filters = pendingFiltersRef.current || {};
      pendingFiltersRef.current = null; // Reset after use
      performSearch(query, filters, 0);
    } else if (setFilter) {
      performSetSearch(setFilter, 0);
    }
  }, [query, setFilter]);

  // Reset filters when component unmounts (user leaves search page)
  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, [resetFilters]);

  const performSearch = async (searchQuery, filters = {}, page = 0) => {
    try {
      setLoading(true);
      
      // Only reset pagination if starting from page 0 (new search)
      if (page === 0) {
        resetPagination();
      }
      const searchResults = await searchCards(searchQuery, filters, page, 21);
      
      console.log('Raw search response:', searchResults);
      
      // Transform search results is now handled by formatPaginatedCardsResponse in API layer
      console.log('Search results after formatting:', searchResults);

      // Use centralized pagination response handler
      const cards = handlePaginatedResponse(searchResults, page, 21);
      setResults(cards);
      
      setCurrentFilters(filters);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      resetPagination();
    } finally {
      setLoading(false);
    }
  };

  const performSetSearch = async (setCode, page = 0) => {
    try {
      setLoading(true);
      
      // Only reset pagination if starting from page 0 (new search)
      if (page === 0) {
        resetPagination();
      }
      const searchResults = await searchCardsBySet(setCode, page, 21);
      
      // Transform search results is now handled by formatPaginatedCardsResponse in API layer
      console.log('Set search results after formatting:', searchResults);

      // Use centralized pagination response handler
      const cards = handlePaginatedResponse(searchResults, page, 21);
      setResults(cards);
      
      setCurrentFilters({ set: setCode });
    } catch (error) {
      console.error('Set search error:', error);
      setResults([]);
      resetPagination();
    } finally {
      setLoading(false);
    }
  };

  const handleFilteredSearch = (filters) => {
    console.log('handleFilteredSearch received filters:', filters);
    
    // Simply execute the search with current filters
    performSearch(filters.query || '', filters);
    
    // Skip the next useEffect search since we just executed one
    skipNextSearchRef.current = true;
    
    // Update URL to reflect the search (for browser history/bookmarking)
    const newParams = new URLSearchParams();
    if (filters.query && filters.query.trim()) {
      newParams.set('q', filters.query.trim());
    }
    if (filters.collection && filters.collection !== 'All Collections') {
      newParams.set('set', filters.collection);
    }
    
    const newUrl = newParams.toString() ? `/search?${newParams.toString()}` : '/search';
    navigate(newUrl);
  };

  const handleLocalPageChange = (newPage) => {
    // Use centralized page change handler
    handlePageChange(newPage, (validPage) => {
      if (query) {
        performSearch(query, currentFilters, validPage);
      } else if (setFilter) {
        performSetSearch(setFilter, validPage);
      }
    });
  };

  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`);
  };

  const formatPrice = (card) => {
    const price = getLowestPrice(card);
    if (!price || price === 0) {
      return t('product.outOfStock');
    }
    return `€${price.toFixed(2)}`;
  };

  const getLowestPrice = (card) => {
    if (card.price) return card.price;
    if (card.from) return card.from;
    if (card.prices && card.prices.length > 0) {
      return Math.min(...card.prices.map(p => p.price));
    }
    return null;
  };

  const getAvailableCount = (card) => {
    if (card.available) return card.available;
    if (card.stock) return card.stock;
    if (card.quantity) return card.quantity;
    return 0;
  };

  const filteredResults = rarityFilter === 'all' 
    ? results 
    : results.filter(card => {
        if (!card.rarity) return false;
        return card.rarity.toLowerCase() === rarityFilter.toLowerCase();
      });

  // Sort cards by availability first, then by collection number
  const sortedResults = [...filteredResults].sort((a, b) => {
    // First priority: availability (available cards first)
    const aHasAvailability = getAvailableCount(a) > 0;
    const bHasAvailability = getAvailableCount(b) > 0;
    
    if (aHasAvailability !== bHasAvailability) {
      return bHasAvailability ? 1 : -1; // Available cards first
    }
    
    // Second priority: collection number (ascending order)
    const aCollectorNumber = a.collectorNumber || a.collector_number || '';
    const bCollectorNumber = b.collectorNumber || b.collector_number || '';
    
    // Cards without collection number go to the end
    if (!aCollectorNumber && !bCollectorNumber) return 0;
    if (!aCollectorNumber) return 1; // a goes to end
    if (!bCollectorNumber) return -1; // b goes to end
    
    // Parse as numbers if possible, otherwise compare as strings
    const aNum = parseInt(aCollectorNumber);
    const bNum = parseInt(bCollectorNumber);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum; // Numeric comparison
    }
    
    return aCollectorNumber.localeCompare(bCollectorNumber); // String comparison
  });


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="lg:flex gap-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters & Search
          </button>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Left Sidebar - Search Filters */}
        <div className={`
          lg:w-80 lg:flex-shrink-0 lg:relative lg:translate-x-0 lg:bg-transparent lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out
          lg:block
        `}>
          <div className="lg:sticky lg:top-8 h-full lg:h-auto overflow-y-auto lg:overflow-visible">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 lg:p-0">
              <SearchFilters
                initialQuery={query || ''}
                onSearch={(filters) => {
                  handleFilteredSearch(filters);
                  setSidebarOpen(false); // Close sidebar after search on mobile
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:min-w-0">
          {/* Header with search query and view controls */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                {setFilter
                  ? `Set: ${setFilter.toUpperCase()}`
                  : `${t('common.search')}: "${query || currentFilters.query || 'All Cards'}"`
                }
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                {(() => {
                  const { start, end, total } = getPaginationRange();
                  return total === 0 ? 'No results' : `${start}-${end} of ${total} ${total === 1 ? 'result' : t('common.results')}`;
                })()}
                {rarityFilter !== 'all' && ` (${rarityFilter} only)`}
              </p>
            </div>

            {/* Controls - Stack on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 lg:items-center">
              {/* Rarity filter dropdown */}
              <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                <label className="text-sm font-medium text-gray-700 mb-1 sm:mb-0">Filter by rarity:</label>
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded bg-white text-sm min-w-0"
                >
                  <option value="all">All rarities</option>
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="mythic">Mythic</option>
                </select>
              </div>

              {/* View toggle buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium border transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  📋 LIST
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium border transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ⚏ GRID
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {sortedResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {results.length === 0 ? t('common.noResults') : `No cards found with ${rarityFilter} rarity`}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-6">
              {sortedResults.map((card) => (
                <SearchGridCard
                  key={card.id}
                  card={card}
                  onClick={() => handleCardClick(card)}
                  formatPrice={formatPrice}
                  getAvailableCount={getAvailableCount}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* List Header - Hidden on very small screens */}
              <div className="hidden sm:block bg-blue-900 text-white px-4 py-3">
                <div className="grid gap-4 text-sm font-medium" style={{gridTemplateColumns: '40px 1fr 50px 70px 50px 80px 120px'}}>
                  <div></div>
                  <div>Name</div>
                  <div className="text-center">Rarity</div>
                  <div className="text-center">Language</div>
                  <div className="text-center">#</div>
                  <div className="text-center">Available</div>
                  <div className="text-right">From</div>
                </div>
              </div>

              {/* List Items */}
              <div>
                {sortedResults.map((card, index) => (
                  <SearchListCard
                    key={card.id}
                    card={card}
                    index={index}
                    onClick={() => handleCardClick(card)}
                    formatPrice={formatPrice}
                    getAvailableCount={getAvailableCount}
                    hoveredCard={hoveredCard}
                    setHoveredCard={setHoveredCard}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleLocalPageChange}
          />
        </div>
      </div>
    </div>
  );
};


export default Search;