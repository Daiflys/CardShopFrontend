import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchCards } from '../api/search';
import SearchGridCard from '../components/SearchGridCard';
import SearchListCard from '../components/SearchListCard';

const Search = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      const searchResults = await searchCards(searchQuery);
      // Show ALL results - no filtering, no cropping
      // Each result might be different editions, conditions, sellers, etc.
      
      // Debug: Let's see what properties each card actually has
      if (searchResults.length > 0) {
        console.log('First search result structure:', searchResults[0]);
        console.log('All search results:', searchResults);
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
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

  const getRarityIcon = (rarity) => {
    const rarityLower = rarity?.toLowerCase();
    if (rarityLower === 'common') return '●'; // Black circle
    if (rarityLower === 'uncommon') return '●'; // Silver circle (rendered as gray)
    if (rarityLower === 'rare') return '●'; // Gold circle (rendered as gold)
    if (rarityLower === 'mythic' || rarityLower === 'mythic rare') return '●'; // Orange/red circle
    return '●';
  };

  const getRarityColor = (rarity) => {
    const rarityLower = rarity?.toLowerCase();
    if (rarityLower === 'common') return 'text-gray-800';
    if (rarityLower === 'uncommon') return 'text-gray-400';
    if (rarityLower === 'rare') return 'text-yellow-500';
    if (rarityLower === 'mythic' || rarityLower === 'mythic rare') return 'text-red-500';
    return 'text-gray-500';
  };

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
      {/* Header with search query and view controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('common.search')}: "{query}"
          </h1>
          <p className="text-gray-600 mt-1">
            {results.length} {results.length === 1 ? 'result' : t('common.results')}
          </p>
        </div>
        
        {/* View toggle buttons - matching the mockup design */}
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

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('common.noResults')}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((card) => (
            <SearchGridCard 
              key={card.id} 
              card={card} 
              onClick={() => handleCardClick(card)}
              formatPrice={formatPrice}
              getAvailableCount={getAvailableCount}
              getRarityIcon={getRarityIcon}
              getRarityColor={getRarityColor}
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
            {results.map((card, index) => (
              <SearchListCard 
                key={card.id}
                card={card}
                index={index}
                onClick={() => handleCardClick(card)}
                formatPrice={formatPrice}
                getAvailableCount={getAvailableCount}
                getRarityIcon={getRarityIcon}
                getRarityColor={getRarityColor}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default Search;