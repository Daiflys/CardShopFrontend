import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchCards, searchCardsBySet } from '../api/search';
import SearchGridCard from '../components/SearchGridCard';
import SearchListCard from '../components/SearchListCard';
import SearchFilters from '../components/SearchFilters';

const Search = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const setFilter = searchParams.get('set');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [rarityFilter, setRarityFilter] = useState('all');
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else if (setFilter) {
      performSetSearch(setFilter);
    }
  }, [query, setFilter]);

  const performSearch = async (searchQuery, filters = {}) => {
    try {
      setLoading(true);
      const searchResults = await searchCards(searchQuery, filters);
      // Show ALL results - no filtering, no cropping
      // Each result might be different editions, conditions, sellers, etc.
      
      // Debug: Let's see what properties each card actually has
      if (searchResults.length > 0) {
        console.log('First search result structure:', searchResults[0]);
        console.log('All search results:', searchResults);
      }
      
      setResults(searchResults);
      setCurrentFilters(filters);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const performSetSearch = async (setCode) => {
    try {
      setLoading(true);
      const searchResults = await searchCardsBySet(setCode);
      
      if (searchResults.length > 0) {
        console.log('Set search result structure:', searchResults[0]);
        console.log('All set search results:', searchResults);
      }
      
      setResults(searchResults);
      setCurrentFilters({ set: setCode });
    } catch (error) {
      console.error('Set search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilteredSearch = (filters) => {
    if (filters.query || Object.keys(filters).some(key => key !== 'query' && filters[key])) {
      performSearch(filters.query, filters);
    }
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
      <div className="flex gap-6">
        {/* Left Sidebar - Search Filters */}
        <div className="w-80 flex-shrink-0">
          <SearchFilters 
            initialQuery={query || ''} 
            onSearch={handleFilteredSearch}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Header with search query and view controls */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {setFilter 
                  ? `Set: ${setFilter.toUpperCase()}` 
                  : `${t('common.search')}: "${query || currentFilters.query || 'All Cards'}"`
                }
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredResults.length} of {results.length} {results.length === 1 ? 'result' : t('common.results')}
                {rarityFilter !== 'all' && ` (${rarityFilter} only)`}
              </p>
            </div>
            
            {/* Rarity filter and view toggle buttons */}
            <div className="flex gap-4 items-center">
              {/* Rarity filter dropdown */}
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium text-gray-700">Filter by rarity:</label>
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded bg-white text-sm"
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
                  className={`px-4 py-2 text-sm font-medium border transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  📋 LIST VIEW
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm font-medium border transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ⚏ GRID VIEW
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {results.length === 0 ? t('common.noResults') : `No cards found with ${rarityFilter} rarity`}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {filteredResults.map((card) => (
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
              {/* List Header */}
              <div className="bg-blue-900 text-white px-4 py-3">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                  <div className="col-span-1"></div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-1 text-center">Rarity</div>
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-2 text-center">Available</div>
                  <div className="col-span-3 text-right">From</div>
                </div>
              </div>
              
              {/* List Items */}
              <div>
                {filteredResults.map((card, index) => (
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
        </div>
      </div>
    </div>
  );
};


export default Search;